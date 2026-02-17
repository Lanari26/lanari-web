const fs = require('fs');
const path = require('path');
const { ChatSession, ChatMessage } = require('../models/chat.model');

const CSV_PATH = path.join(__dirname, '../../data/ai_knowledge.csv');

// ─── AI Provider Setup (optional enhancement) ──────────────
let aiProvider = null;
let geminiClient = null;
let claudeClient = null;

try {
    if (process.env.GEMINI_API_KEY) {
        const { GoogleGenAI } = require('@google/genai');
        geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        aiProvider = 'gemini';
    } else if (process.env.CLAUDE_API_KEY) {
        const Anthropic = require('@anthropic-ai/sdk');
        claudeClient = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
        aiProvider = 'claude';
    }
} catch (e) {
    console.warn('AI provider SDK not available:', e.message);
}

console.log(`AI Provider: ${aiProvider || 'none (NLP engine only)'}`);

// ─── NLP Utilities ───────────────────────────────────────────

let knowledgeBase = [];

const STOP_WORDS = new Set([
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they',
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'can', 'may', 'might', 'shall', 'must',
    'what', 'who', 'how', 'where', 'when', 'why', 'which',
    'that', 'this', 'these', 'those', 'there', 'here',
    'and', 'but', 'or', 'not', 'no', 'so', 'if', 'then',
    'of', 'in', 'on', 'at', 'to', 'for', 'with', 'from', 'by',
    'up', 'out', 'into', 'through', 'during', 'before', 'after',
    'please', 'tell', 'show', 'give', 'want', 'need', 'know', 'like', 'let',
    'also', 'just', 'very', 'really', 'much', 'more', 'some', 'any'
]);

function stem(word) {
    if (word.length < 4) return word;
    return word
        .replace(/ing$/, '').replace(/tion$/, 't').replace(/sion$/, 's')
        .replace(/ment$/, '').replace(/ness$/, '').replace(/able$/, '')
        .replace(/ible$/, '').replace(/ies$/, 'y').replace(/ful$/, '')
        .replace(/ous$/, '').replace(/ive$/, '').replace(/ly$/, '')
        .replace(/es$/, '').replace(/s$/, '').replace(/ed$/, '');
}

function tokenize(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 2 && !STOP_WORDS.has(w))
        .map(stem);
}

function termFreq(tokens) {
    const tf = {};
    for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
    const len = tokens.length || 1;
    for (const t in tf) tf[t] /= len;
    return tf;
}

function cosineSimilarity(tf1, tf2) {
    const allTerms = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
    let dot = 0, mag1 = 0, mag2 = 0;
    for (const term of allTerms) {
        const a = tf1[term] || 0;
        const b = tf2[term] || 0;
        dot += a * b; mag1 += a * a; mag2 += b * b;
    }
    if (mag1 === 0 || mag2 === 0) return 0;
    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

function bigramOverlap(tokens1, tokens2) {
    if (tokens1.length < 2 || tokens2.length < 2) return 0;
    const bigrams1 = new Set();
    for (let i = 0; i < tokens1.length - 1; i++) bigrams1.add(tokens1[i] + ' ' + tokens1[i + 1]);
    let overlap = 0;
    for (let i = 0; i < tokens2.length - 1; i++) {
        if (bigrams1.has(tokens2[i] + ' ' + tokens2[i + 1])) overlap++;
    }
    return overlap / Math.max(bigrams1.size, 1);
}

// ─── Knowledge Base ──────────────────────────────────────────

function loadKnowledge() {
    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n').slice(1);
    knowledgeBase = [];
    for (const line of lines) {
        if (!line.trim()) continue;
        const match = line.match(/^"((?:[^"]|"")+)","((?:[^"]|"")+)","?([^"]*)"?$/);
        if (!match) continue;
        const question = match[1].replace(/""/g, '"');
        const answer = match[2].replace(/""/g, '"').replace(/\\n/g, '\n');
        const link = match[3] || null;
        const tokens = tokenize(question + ' ' + answer);
        const qTokens = tokenize(question);
        const tf = termFreq(qTokens);
        const fullTf = termFreq(tokens);
        knowledgeBase.push({ question, answer, link, tokens, qTokens, tf, fullTf });
    }
}

loadKnowledge();

// ─── Smart NLP Matching ─────────────────────────────────────

function findTopMatches(userMessage, limit = 3) {
    const userTokens = tokenize(userMessage);
    const userTf = termFreq(userTokens);
    if (userTokens.length === 0) return [];

    const scored = knowledgeBase.map(entry => {
        const qScore = cosineSimilarity(userTf, entry.tf) * 0.6
            + bigramOverlap(userTokens, entry.qTokens) * 0.2;
        const fullScore = cosineSimilarity(userTf, entry.fullTf) * 0.15;
        const exactBonus = userTokens.some(t =>
            entry.qTokens.includes(t) && !STOP_WORDS.has(t)
        ) ? 0.05 : 0;
        return { entry, score: qScore + fullScore + exactBonus };
    });

    return scored
        .filter(s => s.score >= 0.12)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

function findBestMatch(userMessage) {
    const matches = findTopMatches(userMessage, 1);
    if (matches.length > 0 && matches[0].score >= 0.15) {
        return { text: matches[0].entry.answer, link: matches[0].entry.link, score: matches[0].score };
    }
    return null;
}

function findBestLink(message) {
    return findBestMatch(message)?.link || null;
}

// ─── Conversational Patterns ────────────────────────────────

const GREETINGS = ['hi', 'hello', 'hey', 'sup', 'yo', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings', 'hola', 'bonjour', 'muraho', 'mwaramutse', 'bite'];
const THANKS = ['thank', 'thanks', 'thx', 'appreciate', 'grateful', 'murakoze'];
const FAREWELLS = ['bye', 'goodbye', 'see you', 'later', 'take care', 'good night'];
const HELP_WORDS = ['help', 'assist', 'support', 'guide'];

function detectIntent(message) {
    const q = message.toLowerCase().trim();

    if (GREETINGS.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!'))) return 'greeting';
    if (THANKS.some(g => q.includes(g))) return 'thanks';
    if (FAREWELLS.some(g => q.includes(g))) return 'farewell';
    if (q === '?' || q === 'help' || (q.split(' ').length <= 3 && HELP_WORDS.some(h => q.includes(h)))) return 'help';

    // Yes/No follow-up
    if (['yes', 'yeah', 'yep', 'sure', 'ok', 'okay'].some(w => q === w)) return 'affirmative';
    if (['no', 'nope', 'nah'].some(w => q === w)) return 'negative';

    return 'question';
}

// ─── Smart Response Generator ───────────────────────────────

function generateNLPResponse(message, chatHistory = []) {
    const intent = detectIntent(message);

    // Handle conversational intents
    if (intent === 'greeting') {
        return {
            text: "Hello! 👋 I'm **Lanari AI**, your intelligent assistant.\n\nI can help you with:\n- 🛍️ **Siri Market** — E-commerce & reselling\n- 🚀 **Rise Network** — Jobs & freelancing\n- 🎓 **Coding Academy** — Learn to code\n- 🤖 **AI Solutions** — Smart business tools\n- ☁️ **Cloud Services** — Hosting & infrastructure\n- And much more!\n\nWhat would you like to know?",
            link: null
        };
    }

    if (intent === 'thanks') {
        return {
            text: "You're welcome! 😊 I'm glad I could help. Feel free to ask me anything else about Lanari Tech's products and services!",
            link: null
        };
    }

    if (intent === 'farewell') {
        return {
            text: "Goodbye! 👋 It was great chatting with you. Come back anytime you have questions about Lanari Tech. Have a wonderful day!",
            link: null
        };
    }

    if (intent === 'help') {
        return {
            text: "I'm here to help! 🤝 Here are some things you can ask me:\n\n- **\"What is Siri Market?\"** — Learn about our e-commerce platform\n- **\"How can I find a job?\"** — Explore Rise Network opportunities\n- **\"What courses are available?\"** — Check out Coding Academy\n- **\"What AI solutions do you offer?\"** — Discover our AI products\n- **\"How can I contact Lanari?\"** — Get our contact details\n- **\"What products does Lanari have?\"** — See all our platforms\n\nJust ask anything about Lanari Tech!",
            link: null
        };
    }

    // Handle affirmative/negative follow-ups using chat history
    if (intent === 'affirmative' || intent === 'negative') {
        const lastAiMsg = [...chatHistory].reverse().find(m => m.role === 'ai');
        if (lastAiMsg) {
            if (intent === 'affirmative') {
                return {
                    text: "Great! Is there anything specific you'd like to know more about? Feel free to ask me any detailed questions!",
                    link: null
                };
            } else {
                return {
                    text: "No problem! Let me know if there's something else I can help you with. You can ask about any of Lanari Tech's products or services.",
                    link: null
                };
            }
        }
    }

    // ─── NLP Knowledge Base Matching ────────────────────────
    const topMatches = findTopMatches(message, 3);

    if (topMatches.length > 0) {
        const best = topMatches[0];

        // High confidence — return directly with a friendly wrapper
        if (best.score >= 0.35) {
            const response = best.entry.answer;
            // If there are related topics, suggest them
            const suggestions = topMatches.slice(1)
                .filter(m => m.score >= 0.15 && m.entry.link !== best.entry.link)
                .map(m => {
                    const topic = m.entry.question.replace(/^(What is |How can I |How does |What |How )/i, '');
                    return `- ${topic}`;
                });

            let text = response;
            if (suggestions.length > 0) {
                text += '\n\n---\n**Related topics you might find interesting:**\n' + suggestions.join('\n');
            }

            return { text, link: best.entry.link };
        }

        // Medium confidence — answer but note uncertainty
        if (best.score >= 0.15) {
            const response = best.entry.answer;
            return {
                text: response + "\n\n---\n*💡 Not quite what you were looking for? Try rephrasing your question or ask about a specific Lanari product!*",
                link: best.entry.link
            };
        }
    }

    // ─── Partial keyword matching as last resort ────────────
    const userTokens = tokenize(message);
    const partialMatches = knowledgeBase.filter(entry => {
        const overlap = userTokens.filter(t => entry.tokens.includes(t));
        return overlap.length >= 1;
    });

    if (partialMatches.length > 0) {
        // Pick the entry with the most token overlap
        const ranked = partialMatches.map(entry => ({
            entry,
            overlap: userTokens.filter(t => entry.tokens.includes(t)).length
        })).sort((a, b) => b.overlap - a.overlap);

        const best = ranked[0];
        if (best.overlap >= 2) {
            return {
                text: best.entry.answer + "\n\n---\n*💡 I matched this based on keywords in your question. For more specific answers, try asking a detailed question!*",
                link: best.entry.link
            };
        }

        // Single keyword match — suggest related topics instead of guessing
        const suggestions = ranked.slice(0, 3).map(r =>
            `- **${r.entry.question}**`
        );

        return {
            text: "I found some topics that might be related to your question:\n\n" + suggestions.join('\n') + "\n\nWhich one interests you? Or feel free to ask me something more specific!",
            link: null
        };
    }

    // ─── No match — helpful fallback ────────────────────────
    return {
        text: "I don't have specific information about that in my knowledge base, but I'd love to help! 🤔\n\nHere are some popular topics I can tell you about:\n\n- 🛍️ **Siri Market** — E-commerce and reselling\n- 🚀 **Rise Network** — Jobs, freelancing, and networking\n- 🎓 **Coding Academy** — Courses and digital skills\n- 🤖 **AI Solutions** — Chatbots, analytics, automation\n- ☁️ **Cloud Services** — Hosting, storage, CDN\n- 📧 **Lanari Mail** — Professional email\n- 📊 **Analytics** — Business data insights\n- 📞 **Contact us** — Reach our team\n\nOr ask me anything else — I'm here to help!",
        link: null
    };
}

// ─── AI Provider (optional enhancement) ─────────────────────

function buildSystemPrompt() {
    const kb = knowledgeBase.map(e =>
        `Q: ${e.question} A: ${e.answer.replace(/\n/g, ' ').substring(0, 200)}`
    ).join('\n');

    return `You are Lanari AI, assistant for Lanari Tech (Rwanda). Use this knowledge base:
${kb}

Rules: Use knowledge base for Lanari questions. Answer general questions from your own knowledge. Be concise (2-3 paragraphs max). Use markdown. Be friendly. Don't invent Lanari features not in the knowledge base.`;
}

async function askAI(message, chatHistory = []) {
    if (!aiProvider) return null;

    const systemPrompt = buildSystemPrompt();
    const recentHistory = chatHistory.slice(-6);

    if (aiProvider === 'gemini') {
        return askGemini(message, recentHistory, systemPrompt);
    } else if (aiProvider === 'claude') {
        return askClaude(message, recentHistory, systemPrompt);
    }
    return null;
}

async function askGemini(message, history, systemPrompt) {
    const contents = [];
    contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
    contents.push({ role: 'model', parts: [{ text: 'Understood.' }] });

    for (const msg of history) {
        contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await geminiClient.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents
    });
    return response.text;
}

async function askClaude(message, history, systemPrompt) {
    const messages = [];
    for (const msg of history) {
        messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        });
    }
    messages.push({ role: 'user', content: message });

    const response = await claudeClient.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages
    });
    return response.content[0].text;
}

// ─── CSV Save ────────────────────────────────────────────────

function saveToCSV(question, answer) {
    try {
        const match = findBestMatch(question);
        if (match && match.score >= 0.4) return;

        const escapedQ = question.replace(/"/g, '""');
        const escapedA = answer.replace(/\n/g, '\\n').replace(/"/g, '""');
        fs.appendFileSync(CSV_PATH, `\n"${escapedQ}","${escapedA}",""`, 'utf-8');
        loadKnowledge();
    } catch (err) {
        console.error('Failed to save Q&A to CSV:', err.message);
    }
}

// ─── Route Handlers ──────────────────────────────────────────

exports.getKnowledge = async (req, res) => {
    loadKnowledge();
    res.json({ success: true, data: knowledgeBase.map(e => ({ question: e.question, answer: e.answer, link: e.link })) });
};

exports.chat = async (req, res, next) => {
    try {
        const { message, sessionId } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        loadKnowledge();
        const userId = req.user.id;
        let sid = sessionId;

        if (!sid) {
            sid = await ChatSession.create(userId, message.trim().substring(0, 60));
        } else {
            const session = await ChatSession.findById(sid, userId);
            if (!session) return res.status(404).json({ error: 'Session not found' });
        }

        await ChatMessage.create({ sessionId: sid, role: 'user', content: message.trim() });

        const history = await ChatMessage.findBySession(sid);
        let responseText;
        let link;

        // Strategy: Try AI provider first (if available), fall back to NLP engine
        let aiSuccess = false;
        if (aiProvider) {
            try {
                const aiResponse = await askAI(message.trim(), history);
                if (aiResponse) {
                    responseText = aiResponse;
                    link = findBestLink(message);
                    aiSuccess = true;
                    saveToCSV(message.trim(), responseText);
                }
            } catch (aiErr) {
                console.error(`${aiProvider} error:`, aiErr.message);
                // Fall through to NLP engine
            }
        }

        // NLP Engine — primary answer method when no AI provider
        if (!aiSuccess) {
            const nlpResult = generateNLPResponse(message.trim(), history);
            responseText = nlpResult.text;
            link = nlpResult.link;
        }

        await ChatMessage.create({ sessionId: sid, role: 'ai', content: responseText, link });
        await ChatSession.touch(sid);

        res.json({ success: true, sessionId: sid, data: { text: responseText, link } });
    } catch (err) {
        next(err);
    }
};

exports.getSessions = async (req, res, next) => {
    try {
        const sessions = await ChatSession.findByUser(req.user.id);
        res.json({ success: true, data: sessions });
    } catch (err) { next(err); }
};

exports.getSession = async (req, res, next) => {
    try {
        const session = await ChatSession.findById(req.params.id, req.user.id);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        const messages = await ChatMessage.findBySession(session.id);
        res.json({ success: true, data: { session, messages } });
    } catch (err) { next(err); }
};

exports.deleteSession = async (req, res, next) => {
    try {
        const deleted = await ChatSession.delete(req.params.id, req.user.id);
        if (!deleted) return res.status(404).json({ error: 'Session not found' });
        res.json({ success: true, message: 'Session deleted' });
    } catch (err) { next(err); }
};
