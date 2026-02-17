const pool = require('../config/db');

exports.search = async (req, res, next) => {
    try {
        const q = (req.query.q || '').trim();

        // Static pages always returned (enriched with DB counts where relevant)
        const staticPages = [
            { title: 'Siri Market', description: 'Buy & resell anywhere even without stock. Become a trader or seller online with zero inventory.', category: 'Product', icon: '🛍️', color: 'from-blue-500 to-cyan-400', url: '/siri', tags: ['e-commerce', 'shop', 'buy', 'sell', 'resell', 'market', 'trade', 'store', 'product'] },
            { title: 'Rise Network', description: 'Freelancing, jobs, internships & professional networking. Connect with professionals and grow your career.', category: 'Product', icon: '🚀', color: 'from-purple-500 to-pink-400', url: '/rise', tags: ['freelance', 'job', 'internship', 'career', 'network', 'hire', 'work'] },
            { title: 'Coding Academy', description: 'Practical coding and digital skills training. Learn web development, mobile apps, and more.', category: 'Product', icon: '🎓', color: 'from-emerald-500 to-teal-400', url: '/academy', tags: ['learn', 'code', 'course', 'training', 'education', 'skill', 'programming'] },
            { title: 'AI Solutions', description: 'Intelligent tools powered by AI — customer support, analytics, and automated documentation.', category: 'Product', icon: '🤖', color: 'from-orange-500 to-red-400', url: '/ai-products', tags: ['ai', 'artificial intelligence', 'machine learning', 'automation'] },
            { title: 'Cloud Services', description: 'Scalable cloud hosting, storage, and CDN for your applications and websites.', category: 'Service', icon: '☁️', color: 'from-sky-500 to-blue-400', url: '/cloud', tags: ['cloud', 'hosting', 'server', 'storage', 'deploy'] },
            { title: 'Analytics Dashboard', description: 'Data-driven insights and business intelligence to make smarter decisions.', category: 'Service', icon: '📊', color: 'from-indigo-500 to-purple-400', url: '/analytics', tags: ['analytics', 'data', 'dashboard', 'insights', 'metrics'] },
            { title: 'Lanari Mail', description: 'Professional corporate email with custom domain — yourname@lanari.rw.', category: 'Service', icon: '✉️', color: 'from-red-500 to-pink-400', url: '/mail', tags: ['email', 'mail', 'inbox', 'message', 'corporate'] },
            { title: 'Lanari Docs', description: 'Create, collaborate, and share documents and technical documentation seamlessly.', category: 'Service', icon: '📄', color: 'from-yellow-500 to-orange-400', url: '/docs', tags: ['docs', 'document', 'documentation', 'write'] },
            { title: 'Calendar', description: 'Schedule events, meetings, and manage your time effectively.', category: 'Service', icon: '📅', color: 'from-green-500 to-emerald-400', url: '/calendar', tags: ['calendar', 'event', 'schedule', 'meeting'] },
            { title: 'Partner with Us', description: 'Join forces with Lanari Tech. Strategic partnerships for mutual growth.', category: 'Company', icon: '🤝', color: 'from-pink-500 to-rose-400', url: '/partner', tags: ['partner', 'collaborate', 'business', 'sponsor'] },
            { title: 'Invest in Lanari', description: 'Investment opportunities in Africa\'s growing tech ecosystem.', category: 'Company', icon: '💎', color: 'from-amber-500 to-yellow-400', url: '/invest', tags: ['invest', 'funding', 'investor', 'equity', 'startup'] },
            { title: 'Contact Us', description: 'Get in touch with Lanari Tech. We\'d love to hear from you.', category: 'Company', icon: '📬', color: 'from-teal-500 to-cyan-400', url: '/contact', tags: ['contact', 'support', 'help', 'reach'] },
            { title: 'About Lanari Tech', description: 'Our mission, values, and the story behind empowering Rwanda\'s digital future.', category: 'Company', icon: '🏢', color: 'from-blue-500 to-indigo-400', url: '/about', tags: ['about', 'mission', 'values', 'story', 'company'] },
            { title: 'Our Services', description: 'Full-stack digital solutions — web, mobile, cloud, and AI development.', category: 'Company', icon: '⚙️', color: 'from-gray-500 to-slate-400', url: '/services', tags: ['service', 'solution', 'consulting', 'development'] },
            { title: 'Projects', description: 'Featured projects and case studies showcasing what we\'ve built.', category: 'Company', icon: '🏗️', color: 'from-cyan-500 to-blue-400', url: '/projects', tags: ['project', 'portfolio', 'case study', 'showcase'] },
        ];

        // Query dynamic content from DB
        const [jobs] = await pool.query(
            'SELECT id, title, department, type, location FROM job_listings WHERE is_active = TRUE'
        ).catch(() => [[]]);

        const jobResults = jobs.map(j => ({
            title: j.title,
            description: `${j.department} · ${j.type} · ${j.location}`,
            category: 'Career',
            icon: '💼',
            color: 'from-violet-500 to-purple-400',
            url: '/careers',
            tags: ['career', 'job', 'hire', 'apply', j.department.toLowerCase(), j.type.toLowerCase(), j.title.toLowerCase()]
        }));

        // Combine all searchable content
        const allContent = [...staticPages, ...jobResults];

        // If no query, return everything
        if (!q) {
            return res.json({ success: true, data: allContent });
        }

        // Score and filter
        const lower = q.toLowerCase();
        const words = lower.split(/\s+/);

        const scored = allContent.map(item => {
            let score = 0;
            const titleLower = item.title.toLowerCase();
            const descLower = item.description.toLowerCase();
            const tagsJoined = item.tags.join(' ');

            if (titleLower === lower) score += 100;
            if (titleLower.includes(lower)) score += 50;
            if (descLower.includes(lower)) score += 20;
            if (tagsJoined.includes(lower)) score += 30;

            words.forEach(word => {
                if (titleLower.includes(word)) score += 15;
                if (descLower.includes(word)) score += 5;
                item.tags.forEach(tag => {
                    if (tag.includes(word)) score += 10;
                });
            });

            return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

        res.json({ success: true, data: scored });
    } catch (err) {
        next(err);
    }
};
