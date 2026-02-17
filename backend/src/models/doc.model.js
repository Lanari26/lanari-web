const pool = require('../config/db');

// Auto-create table on module load
pool.query(`
    CREATE TABLE IF NOT EXISTS docs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        icon VARCHAR(10) DEFAULT '📄',
        sort_order INT DEFAULT 0,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_slug (slug)
    )
`).then(async () => {
    // Seed initial docs if table is empty
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM docs');
    if (count === 0) {
        const seeds = [
            {
                title: 'Introduction to Lanari Tech',
                slug: 'introduction',
                category: 'Getting Started',
                icon: '🚀',
                sort_order: 1,
                content: `## Welcome to Lanari Tech

Lanari Tech is a Rwandan technology company on a mission to empower Africa's digital future. We build platforms for e-commerce, professional networking, education, and digital solutions — all designed for the African market.

### Our Ecosystem

- **Siri Market** — E-commerce and reselling platform
- **Rise Network** — Jobs, freelancing, and professional networking
- **Coding Academy** — Digital skills training and courses
- **AI Solutions** — Chatbots, analytics, and automation
- **Cloud Services** — Hosting, storage, and CDN

### Core Values

- **Innovation** — Pushing boundaries with creative solutions
- **Integrity** — Building trust through transparency
- **Impact** — Creating real change in communities
- **Inclusion** — Technology that's accessible to everyone

### Getting Help

If you need assistance, you can:
- Use our **AI Chat** assistant (available after login)
- Contact us at **lanari.rw@gmail.com**
- WhatsApp: **+250 795 983 610**
- Visit us at **Norrsken House Kigali**, 1 KN 78 St, Kigali, Rwanda`
            },
            {
                title: 'Creating Your Account',
                slug: 'creating-account',
                category: 'Getting Started',
                icon: '👤',
                sort_order: 2,
                content: `## Creating Your Account

### Registration

1. Navigate to the **Register** page
2. Fill in your details:
   - **Full Name** — Your display name
   - **Email** — A valid email address (used for login)
   - **Phone Number** — Optional, for contact purposes
   - **Password** — Minimum 8 characters
3. Click **Create Account**

### After Registration

Once registered, you'll receive:
- A **welcome email** with tips on getting started
- Access to your **personal dashboard**
- The ability to use **Lanari AI** chat assistant
- Access to the **Calendar** for scheduling

### Logging In

Use your email and password at the **Login** page. You'll receive a login alert email for security.

### Account Security

- Use a strong, unique password (8+ characters)
- Check login alert emails for unauthorized access
- Contact support immediately if you notice suspicious activity`
            },
            {
                title: 'Siri Market — E-Commerce Platform',
                slug: 'siri-market',
                category: 'Products',
                icon: '🛍️',
                sort_order: 1,
                content: `## Siri Market

Siri Market is Lanari Tech's e-commerce platform that lets you buy and resell products — even without holding any physical stock.

### Key Features

- **Zero Inventory Selling** — List products without owning stock
- **Global Marketplace** — Access products from worldwide suppliers
- **Reselling Model** — Browse, list, sell, and earn the markup
- **Secure Payments** — Safe transactions for buyers and sellers

### How Reselling Works

1. **Browse** the product catalog
2. **List** items in your store with your own pricing
3. **Customer buys** from your store
4. **Siri handles** fulfillment and shipping
5. **You earn** the markup as profit

### Who Is It For?

Siri Market is designed for:
- Aspiring entrepreneurs with no startup capital
- Existing businesses wanting to expand online
- Anyone in Rwanda and across Africa looking to earn through digital trade

### Getting Started

Visit the Siri Market page on our website to learn more and start your journey as a digital trader.`
            },
            {
                title: 'Rise Network — Jobs & Freelancing',
                slug: 'rise-network',
                category: 'Products',
                icon: '🚀',
                sort_order: 2,
                content: `## Rise Network

Rise Network is your gateway to professional growth and opportunities across Africa.

### Features

- **Freelance Projects** — Find clients and get hired for your skills
- **Job Listings** — Browse remote and local opportunities
- **Internship Programs** — Kickstart your career with hands-on experience
- **Professional Networking** — Connect with industry leaders

### For Job Seekers

1. Create a professional profile showcasing your skills
2. Browse job listings and freelance projects
3. Submit proposals and applications
4. Get hired and build your career

### For Employers

1. Post job listings with details (title, department, type, location)
2. Receive applications with cover letters
3. Review candidates and manage the hiring process

### Supported Professions

Rise supports developers, designers, writers, marketers, project managers, and other professionals across Africa.

### Applying for Jobs

Visit the **Careers** page to see current openings. Each listing includes the role description, requirements, and an apply button. You'll receive a confirmation email after applying.`
            },
            {
                title: 'Coding Academy — Learn to Code',
                slug: 'coding-academy',
                category: 'Products',
                icon: '🎓',
                sort_order: 3,
                content: `## Lanari Coding Academy

Practical, hands-on digital skills training to prepare you for the modern workforce.

### Available Courses

- **Web Development** — HTML, CSS, JavaScript, React
- **Mobile Development** — Build apps for Android & iOS
- **Python & Data Science** — Analytics and automation
- **UI/UX Design** — Create beautiful user experiences
- **Cloud & DevOps** — Deploy and scale applications
- **AI & Machine Learning** — Build intelligent systems

### How It Works

1. Browse our course catalog
2. Start with **free beginner courses**
3. Follow structured lessons with hands-on projects
4. Get mentorship from experienced developers
5. Build your portfolio as you learn

### Pricing

Many courses start **free**. Advanced courses and mentorship programs may have fees. Contact us for enterprise training packages.

### Mentorship

Every student gets access to guidance from experienced developers who can help with:
- Code reviews
- Career advice
- Project planning
- Technical questions`
            },
            {
                title: 'AI Solutions',
                slug: 'ai-solutions',
                category: 'Products',
                icon: '🤖',
                sort_order: 4,
                content: `## Lanari AI Solutions

Bringing the power of artificial intelligence to your business.

### Products

#### AI Customer Support
Automated chatbots that understand your customers and provide instant, accurate responses 24/7.

#### AI Analytics
Smart insights from your business data — identify trends, predict outcomes, and make data-driven decisions.

#### Auto Documentation
AI-powered technical documentation generation. Keep your docs up-to-date automatically.

### Lanari AI Chat

Our built-in AI assistant is available to all registered users. It can help with:
- Questions about Lanari products and services
- General technology queries
- Navigating the platform

The AI uses a knowledge base combined with advanced NLP to provide accurate, helpful responses.

### For Businesses

We help businesses in Rwanda and across Africa leverage AI to work smarter, not harder. Contact us for custom AI solutions tailored to your needs.`
            },
            {
                title: 'Cloud Services',
                slug: 'cloud-services',
                category: 'Products',
                icon: '☁️',
                sort_order: 5,
                content: `## Lanari Cloud

Reliable, scalable cloud infrastructure built for African businesses.

### Services

#### Web Hosting
Fast, reliable hosting for your websites and web applications with 99.9% uptime.

#### Cloud Storage
Secure file storage with easy access from anywhere. Upload, manage, and share files.

#### CDN (Content Delivery Network)
Global content delivery for blazing-fast load times. Your content served from the nearest edge location.

#### Auto-Scaling
Your infrastructure grows with your traffic. No more worrying about traffic spikes crashing your site.

### Pricing

Competitive pricing designed for the African market. Free tier available for small projects. Contact us for enterprise plans.

### Getting Started

Visit the Cloud Services page to explore plans and get started with hosting your project.`
            },
            {
                title: 'Using the Dashboard',
                slug: 'using-dashboard',
                category: 'User Guide',
                icon: '📊',
                sort_order: 1,
                content: `## Your Personal Dashboard

After logging in, your dashboard is your central hub for managing your Lanari Tech experience.

### Dashboard Sections

#### Profile Information
View and manage your account details:
- Full name and email
- Phone number
- Account role and member since date

#### Notifications
Stay updated with:
- Welcome messages
- System announcements
- Activity alerts

You can mark notifications as read individually or all at once.

#### Job Applications
If you've applied for positions through Careers, track your applications here with:
- Job title and department
- Application date
- Current status

### Quick Actions

From the dashboard, you can quickly navigate to:
- **AI Chat** — Talk to our intelligent assistant
- **Calendar** — Manage your schedule
- **Notifications** — View all alerts`
            },
            {
                title: 'AI Chat Assistant',
                slug: 'ai-chat',
                category: 'User Guide',
                icon: '💬',
                sort_order: 2,
                content: `## Lanari AI Chat

Our AI-powered chat assistant helps you get information about Lanari Tech products and services.

### How to Use

1. **Log in** to your account
2. Navigate to the **AI Chat** page
3. Type your question and press send
4. The AI will respond with relevant information

### What You Can Ask

- **Product questions** — "What is Siri Market?", "How does Rise work?"
- **Service inquiries** — "What cloud services do you offer?"
- **Course information** — "What courses are available at the Academy?"
- **Company details** — "How can I contact Lanari?", "Where are you located?"
- **General help** — "How can I apply for a job?", "How do I invest?"

### Chat Sessions

- Conversations are saved as **sessions**
- You can view previous chat sessions
- Start new conversations anytime
- Delete old sessions to clean up

### Tips for Best Results

- Ask specific questions for more accurate answers
- Use keywords related to the product or service
- If the answer isn't quite right, try rephrasing your question
- The AI understands English and some Kinyarwanda greetings`
            },
            {
                title: 'Calendar & Events',
                slug: 'calendar-events',
                category: 'User Guide',
                icon: '📅',
                sort_order: 3,
                content: `## Lanari Calendar

Stay organized with your personal calendar.

### Creating Events

1. Navigate to the **Calendar** page
2. Click on a date or the "New Event" button
3. Fill in the details:
   - **Title** — Event name (required)
   - **Date** — Event date (required)
   - **Start/End Time** — Optional time range
   - **Description** — Optional notes
   - **Color** — Color label for organization
4. Save the event

### Managing Events

- **Edit** — Click an event to modify its details
- **Delete** — Remove events you no longer need
- **Navigate** — Browse months using the navigation arrows
- **Filter by month** — View events for specific months

### Color Labels

Use colors to categorize your events:
- **Blue** — Work/Professional
- **Red** — Important/Urgent
- **Green** — Personal
- **Yellow** — Reminders
- **Purple** — Meetings

Events are private and only visible to your account.`
            },
            {
                title: 'Partnership Program',
                slug: 'partnership-program',
                category: 'Business',
                icon: '🤝',
                sort_order: 1,
                content: `## Partner with Lanari Tech

Grow together through strategic partnerships.

### Partnership Types

#### Technology Partnerships
Integrate with our ecosystem — build on top of Lanari's platforms or offer complementary services.

#### Marketing Alliances
Co-promote and reach new audiences. Joint campaigns, referral programs, and cross-platform visibility.

#### Educational Partnerships
Collaborate on training programs. Partner institutions can offer Lanari Academy courses or develop joint curricula.

#### Community Partnerships
Drive digital inclusion across Africa. NGOs, community organizations, and government bodies working on digital transformation.

### How to Apply

1. Visit the **Partner** page
2. Fill in the partnership request form:
   - Organization name
   - Contact email
   - Partnership proposal (describe your vision)
3. Submit and wait for our team to review
4. We respond within 3-5 business days

### What Happens Next

Our partnerships team reviews every request carefully. Approved partners receive:
- Dedicated partnership manager
- Co-marketing opportunities
- API access (for technology partners)
- Regular check-ins and support`
            },
            {
                title: 'Investment Opportunities',
                slug: 'investment-opportunities',
                category: 'Business',
                icon: '💎',
                sort_order: 2,
                content: `## Invest in Lanari Tech

Be part of Africa's digital transformation.

### Why Invest

- **Growing Market** — Africa's tech sector is one of the fastest-growing globally
- **Diversified Portfolio** — 4+ core platforms covering e-commerce, jobs, education, and AI
- **Social Impact** — Empowering communities through technology and digital inclusion
- **Early Stage** — Significant growth potential with early-mover advantage
- **Rwanda HQ** — Positioned in Africa's innovation hub

### How to Express Interest

1. Visit the **Invest** page
2. Submit the investor inquiry form with:
   - Your name and email
   - Organization (optional)
   - Investment range (optional)
   - Message about your interest
3. Our investor relations team will contact you within 2-3 business days

### What You'll Receive

- Access to our **investor deck**
- **Financial projections** and growth data
- Meetings with the **founding team**
- Regular **updates** on company progress

### Contact

For direct investor inquiries: **invest@lanari.rw**`
            },
            {
                title: 'Contact & Support',
                slug: 'contact-support',
                category: 'Business',
                icon: '📞',
                sort_order: 3,
                content: `## Contact & Support

Multiple ways to reach the Lanari Tech team.

### General Contact

- **Email:** lanari.rw@gmail.com
- **WhatsApp:** +250 795 983 610
- **Website:** lanari.rw
- **Location:** Norrsken House Kigali, 1 KN 78 St, Kigali, Rwanda

### Specific Teams

- **Careers:** careers@lanari.rw
- **Support:** support@lanari.rw
- **Investment:** invest@lanari.rw

### Contact Form

Visit the **Contact** page to send us a message directly. You'll receive:
- Instant confirmation email
- Response within 24 hours from our team

### AI Assistant

For quick answers about Lanari products and services, use our **AI Chat** feature (requires login). It's available 24/7 and can answer most common questions instantly.

### Office Hours

We're available Monday through Friday, 8:00 AM to 6:00 PM (East Africa Time).
Weekend support is available via WhatsApp for urgent matters.`
            }
        ];

        for (const doc of seeds) {
            await pool.query(
                'INSERT INTO docs (title, slug, category, content, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
                [doc.title, doc.slug, doc.category, doc.content, doc.icon, doc.sort_order]
            );
        }
        console.log(`Seeded ${seeds.length} documentation articles`);
    }
}).catch(err => console.error('Failed to create docs table:', err.message));

const Doc = {
    async findAll() {
        const [rows] = await pool.query(
            'SELECT * FROM docs ORDER BY category, sort_order ASC, title ASC'
        );
        return rows;
    },

    async findPublished() {
        const [rows] = await pool.query(
            'SELECT * FROM docs WHERE is_published = TRUE ORDER BY category, sort_order ASC, title ASC'
        );
        return rows;
    },

    async findBySlug(slug) {
        const [rows] = await pool.query(
            'SELECT * FROM docs WHERE slug = ? AND is_published = TRUE',
            [slug]
        );
        return rows[0] || null;
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM docs WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async getCategories() {
        const [rows] = await pool.query(
            'SELECT category, COUNT(*) as count FROM docs WHERE is_published = TRUE GROUP BY category ORDER BY category ASC'
        );
        return rows;
    },

    async create({ title, slug, category, content, icon, sortOrder }) {
        const [result] = await pool.query(
            'INSERT INTO docs (title, slug, category, content, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [title, slug, category, content, icon || '📄', sortOrder || 0]
        );
        return result.insertId;
    },

    async update(id, data) {
        const fields = [];
        const values = [];
        const map = {
            title: 'title', slug: 'slug', category: 'category',
            content: 'content', icon: 'icon', sortOrder: 'sort_order',
            isPublished: 'is_published'
        };
        for (const [key, col] of Object.entries(map)) {
            if (data[key] !== undefined) {
                fields.push(`${col} = ?`);
                values.push(data[key]);
            }
        }
        if (fields.length === 0) return false;
        values.push(id);
        const [result] = await pool.query(
            `UPDATE docs SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM docs WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Doc;
