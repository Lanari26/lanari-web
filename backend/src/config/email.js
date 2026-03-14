const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

transporter.verify()
    .then(() => console.log('SMTP connected — email ready'))
    .catch(err => console.error('SMTP connection failed:', err.message));

/**
 * Send an email
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendMail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}: ${subject}`);
    } catch (err) {
        console.error(`Email failed to ${to}:`, err.message);
    }
};

/* ─── HTML Template Wrapper ─── */
const wrap = (body) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0e1a;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:32px 40px;border-radius:16px 16px 0 0;">
    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Lanari Tech</h1>
  </td></tr>
  <!-- Body -->
  <tr><td style="background-color:#1f2937;padding:40px;border:1px solid #374151;border-top:none;">
    ${body}
  </td></tr>
  <!-- Footer -->
  <tr><td style="padding:24px 40px;text-align:center;">
    <p style="margin:0 0 8px;color:#6b7280;font-size:12px;">Lanari Tech &bull; Norrsken House Kigali &bull; 1 KN 78 St, Kigali, Rwanda</p>
    <p style="margin:0;color:#4b5563;font-size:11px;">&copy; ${new Date().getFullYear()} Lanari Tech. All rights reserved.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

/* ─── Email Templates ─── */

const templates = {
    /** Welcome email sent to new users */
    welcome: (name) => ({
        subject: 'Welcome to Lanari Tech!',
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">Welcome aboard, ${name}! 🎉</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                Thank you for joining Lanari Tech. You now have access to our full ecosystem of products and services designed to empower your digital journey.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                    <td style="padding:16px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                        <p style="margin:0 0 4px;color:#60a5fa;font-size:13px;font-weight:700;">What you can do:</p>
                        <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.8;">
                            ✦ Browse <strong style="color:#e5e7eb;">Siri</strong> — our E-Commerce platform<br/>
                            ✦ Find work on <strong style="color:#e5e7eb;">Rise</strong> — Freelancing & Jobs<br/>
                            ✦ Learn at <strong style="color:#e5e7eb;">Academy</strong> — Digital Skills<br/>
                            ✦ Explore <strong style="color:#e5e7eb;">AI Solutions</strong> & more
                        </p>
                    </td>
                </tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                Go to Dashboard
            </a>
        `)
    }),

    /** Confirmation email sent to user who submitted contact form */
    contactConfirmation: (firstName) => ({
        subject: 'We received your message — Lanari Tech',
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">Thanks for reaching out, ${firstName}!</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                We've received your message and our team will get back to you as soon as possible. Typically we respond within 24 hours.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                    <td style="padding:16px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                        <p style="margin:0 0 4px;color:#60a5fa;font-size:13px;font-weight:700;">In the meantime:</p>
                        <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.8;">
                            ✦ Explore our <strong style="color:#e5e7eb;">products and services</strong><br/>
                            ✦ Check out <strong style="color:#e5e7eb;">career opportunities</strong><br/>
                            ✦ Learn more <strong style="color:#e5e7eb;">about us</strong>
                        </p>
                    </td>
                </tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                Visit Lanari Tech
            </a>
        `)
    }),

    /** Internal notification to admin when a new contact message arrives */
    contactNotifyAdmin: ({ firstName, lastName, email, message }) => ({
        subject: `New Contact Message from ${firstName} ${lastName}`,
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">New Contact Message</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;">A visitor submitted the contact form on the website.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:16px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                    <p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#60a5fa;">${email}</a></p>
                    <p style="margin:0 0 8px;color:#e5e7eb;font-size:14px;"><strong>Message:</strong></p>
                    <p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</p>
                </td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/admin/messages" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                View in Admin Panel
            </a>
        `)
    }),

    /** Confirmation to partner who submitted a request */
    partnerConfirmation: (orgName) => ({
        subject: 'Partnership Request Received — Lanari Tech',
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">Partnership Request Received</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                Thank you for your interest in partnering with Lanari Tech! We've received the partnership request from <strong style="color:#e5e7eb;">${orgName}</strong> and our partnerships team will review it carefully.
            </p>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                We'll follow up within 3-5 business days with next steps.
            </p>
            <a href="${process.env.FRONTEND_URL}/" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                Visit Lanari Tech
            </a>
        `)
    }),

    /** Internal notification to admin when a new partner request arrives */
    partnerNotifyAdmin: ({ organizationName, contactEmail, partnershipProposal }) => ({
        subject: `New Partnership Request: ${organizationName}`,
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">New Partnership Request</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;">A new partnership request has been submitted.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:16px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                    <p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Organization:</strong> ${organizationName}</p>
                    <p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Contact Email:</strong> <a href="mailto:${contactEmail}" style="color:#60a5fa;">${contactEmail}</a></p>
                    <p style="margin:0 0 8px;color:#e5e7eb;font-size:14px;"><strong>Proposal:</strong></p>
                    <p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.7;white-space:pre-wrap;">${partnershipProposal}</p>
                </td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/admin/partners" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                View in Admin Panel
            </a>
        `)
    }),

    /** Confirmation email sent to job applicant */
    applicationConfirmation: ({ applicantName, jobTitle, department }) => ({
        subject: `Application Received — ${jobTitle} at Lanari Tech`,
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">Application Received!</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                Hi ${applicantName}, thank you for applying to the <strong style="color:#e5e7eb;">${jobTitle}</strong> position in our <strong style="color:#e5e7eb;">${department}</strong> department.
            </p>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                Our hiring team will review your application and get back to you within 5-7 business days. In the meantime, feel free to explore more about Lanari Tech.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:16px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                    <p style="margin:0 0 4px;color:#60a5fa;font-size:13px;font-weight:700;">Application Details:</p>
                    <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.8;">
                        ✦ <strong style="color:#e5e7eb;">Position:</strong> ${jobTitle}<br/>
                        ✦ <strong style="color:#e5e7eb;">Department:</strong> ${department}<br/>
                        ✦ <strong style="color:#e5e7eb;">Status:</strong> Under Review
                    </p>
                </td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/careers" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                View More Openings
            </a>
        `)
    }),

    /** Internal notification to admin when a new application arrives */
    applicationNotifyAdmin: ({ applicantName, applicantEmail, jobTitle, department, coverLetter }) => ({
        subject: `New Application: ${applicantName} — ${jobTitle}`,
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">New Job Application</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;">A new application has been submitted.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:16px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                    <p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Applicant:</strong> ${applicantName}</p>
                    <p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Email:</strong> <a href="mailto:${applicantEmail}" style="color:#60a5fa;">${applicantEmail}</a></p>
                    <p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Position:</strong> ${jobTitle} (${department})</p>
                    ${coverLetter ? `<p style="margin:0 0 8px;color:#e5e7eb;font-size:14px;"><strong>Cover Letter:</strong></p><p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.7;white-space:pre-wrap;">${coverLetter}</p>` : '<p style="margin:0;color:#6b7280;font-size:13px;font-style:italic;">No cover letter provided</p>'}
                </td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/admin/jobs" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                View in Admin Panel
            </a>
        `)
    }),

    /** Login alert email */
    loginAlert: (name) => ({
        subject: 'New Sign-In to Your Lanari Account',
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">New Sign-In Detected</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                Hi ${name}, we noticed a new sign-in to your Lanari Tech account on <strong style="color:#e5e7eb;">${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</strong>.
            </p>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                If this was you, no action is needed. If you didn't sign in, please secure your account immediately.
            </p>
            <a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                Go to Dashboard
            </a>
        `)
    }),

    /** Confirmation email sent to investor */
    investorConfirmation: (name) => ({
        subject: 'Investment Inquiry Received — Lanari Tech',
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">Thank You for Your Interest!</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                Hi ${name}, thank you for expressing interest in investing in Lanari Tech. We've received your inquiry and our investor relations team will review it carefully.
            </p>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                A member of our team will reach out to you within 2-3 business days with more information, including access to our investor deck and financial projections.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:16px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                    <p style="margin:0 0 4px;color:#f59e0b;font-size:13px;font-weight:700;">Why Lanari Tech?</p>
                    <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.8;">
                        ✦ <strong style="color:#e5e7eb;">4+ core platforms</strong> — diversified digital ecosystem<br/>
                        ✦ <strong style="color:#e5e7eb;">Growing market</strong> — Africa's tech sector is booming<br/>
                        ✦ <strong style="color:#e5e7eb;">Social impact</strong> — empowering communities through technology<br/>
                        ✦ <strong style="color:#e5e7eb;">Rwanda HQ</strong> — positioned in Africa's innovation hub
                    </p>
                </td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/invest" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                Learn More
            </a>
        `)
    }),

    /** Internal notification to admin when a new investor inquiry arrives */
    investorNotifyAdmin: ({ fullName, email, phone, organization, investmentRange, message }) => ({
        subject: `New Investor Inquiry: ${fullName}${organization ? ` (${organization})` : ''}`,
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">New Investor Inquiry</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;">A potential investor has submitted an inquiry.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:16px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                    <p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Name:</strong> ${fullName}</p>
                    <p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Email:</strong> <a href="mailto:${email}" style="color:#f59e0b;">${email}</a></p>
                    ${phone ? `<p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Phone:</strong> ${phone}</p>` : ''}
                    ${organization ? `<p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Organization:</strong> ${organization}</p>` : ''}
                    ${investmentRange ? `<p style="margin:0 0 12px;color:#e5e7eb;font-size:14px;"><strong>Investment Range:</strong> <span style="color:#f59e0b;font-weight:700;">${investmentRange}</span></p>` : ''}
                    ${message ? `<p style="margin:0 0 8px;color:#e5e7eb;font-size:14px;"><strong>Message:</strong></p><p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</p>` : '<p style="margin:0;color:#6b7280;font-size:13px;font-style:italic;">No additional message provided</p>'}
                </td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/admin/investors" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                View in Admin Panel
            </a>
        `)
    })
};

/* ─── Campaign Email Templates (pre-designed for admin) ─── */

const campaignTemplates = {
    newsletter: {
        name: 'Newsletter',
        description: 'Monthly newsletter with updates, news and highlights',
        subject: 'Lanari Tech Newsletter — {{month}}',
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">Hey {{name}}! Here's what's new</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                Here's your monthly roundup of everything happening at Lanari Tech. Stay in the loop with our latest products, features, and community updates.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:20px;background:linear-gradient(135deg,#1e3a5f,#1a1a2e);border-radius:12px;border:1px solid #374151;">
                    <p style="margin:0 0 8px;color:#60a5fa;font-size:14px;font-weight:700;">Highlights This Month</p>
                    <p style="margin:0;color:#9ca3af;font-size:14px;line-height:2;">
                        {{content}}
                    </p>
                </td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                Explore More
            </a>
            <p style="margin:24px 0 0;color:#6b7280;font-size:12px;line-height:1.6;">
                You're receiving this because you're a Lanari Tech member.
            </p>
        `)
    },

    productLaunch: {
        name: 'Product Launch',
        description: 'Announce a new product or major feature release',
        subject: 'Introducing {{productName}} — Lanari Tech',
        html: wrap(`
            <div style="text-align:center;margin-bottom:24px;">
                <span style="display:inline-block;padding:6px 16px;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;font-size:11px;font-weight:700;border-radius:20px;letter-spacing:1px;text-transform:uppercase;">NEW LAUNCH</span>
            </div>
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:26px;text-align:center;font-weight:800;">{{productName}}</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;text-align:center;">
                {{description}}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:20px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                    <p style="margin:0 0 8px;color:#10b981;font-size:14px;font-weight:700;">Key Features</p>
                    <p style="margin:0;color:#9ca3af;font-size:14px;line-height:2;">
                        {{features}}
                    </p>
                </td></tr>
            </table>
            <div style="text-align:center;">
                <a href="${process.env.FRONTEND_URL}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:12px;box-shadow:0 4px 15px rgba(16,185,129,0.3);">
                    Try It Now
                </a>
            </div>
        `)
    },

    promotion: {
        name: 'Special Offer',
        description: 'Promotional campaign with special deals or discounts',
        subject: 'Special Offer Just for You — Lanari Tech',
        html: wrap(`
            <div style="text-align:center;margin-bottom:16px;">
                <span style="display:inline-block;padding:6px 16px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#ffffff;font-size:11px;font-weight:700;border-radius:20px;letter-spacing:1px;text-transform:uppercase;">LIMITED OFFER</span>
            </div>
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:26px;text-align:center;font-weight:800;">{{headline}}</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;text-align:center;">
                Hi {{name}}, we have something special just for you.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:24px;background:linear-gradient(135deg,#451a03,#78350f);border-radius:12px;border:1px solid #92400e;text-align:center;">
                    <p style="margin:0 0 8px;color:#fbbf24;font-size:32px;font-weight:800;">{{offer}}</p>
                    <p style="margin:0;color:#fcd34d;font-size:14px;">{{details}}</p>
                </td></tr>
            </table>
            <div style="text-align:center;">
                <a href="${process.env.FRONTEND_URL}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:12px;box-shadow:0 4px 15px rgba(245,158,11,0.3);">
                    Claim Offer
                </a>
            </div>
            <p style="margin:24px 0 0;color:#6b7280;font-size:12px;text-align:center;">
                This offer is exclusive to Lanari Tech members.
            </p>
        `)
    },

    event: {
        name: 'Event Invitation',
        description: 'Invite users to webinars, meetups, or events',
        subject: 'You\'re Invited: {{eventName}} — Lanari Tech',
        html: wrap(`
            <div style="text-align:center;margin-bottom:16px;">
                <span style="display:inline-block;padding:6px 16px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#ffffff;font-size:11px;font-weight:700;border-radius:20px;letter-spacing:1px;text-transform:uppercase;">EVENT</span>
            </div>
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:24px;text-align:center;font-weight:800;">{{eventName}}</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;text-align:center;">
                Hi {{name}}, you're invited to join us for an exciting event!
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:20px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding:8px 0;color:#9ca3af;font-size:14px;">
                                <strong style="color:#8b5cf6;">Date:</strong> <span style="color:#e5e7eb;">{{date}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0;color:#9ca3af;font-size:14px;">
                                <strong style="color:#8b5cf6;">Time:</strong> <span style="color:#e5e7eb;">{{time}}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0;color:#9ca3af;font-size:14px;">
                                <strong style="color:#8b5cf6;">Location:</strong> <span style="color:#e5e7eb;">{{location}}</span>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:14px;line-height:1.7;">
                {{description}}
            </p>
            <div style="text-align:center;">
                <a href="${process.env.FRONTEND_URL}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:12px;box-shadow:0 4px 15px rgba(139,92,246,0.3);">
                    RSVP Now
                </a>
            </div>
        `)
    },

    announcement: {
        name: 'General Announcement',
        description: 'Company news, updates, or important announcements',
        subject: '{{title}} — Lanari Tech',
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;">{{title}}</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;">
                Hi {{name}},
            </p>
            <div style="margin:0 0 24px;color:#d1d5db;font-size:15px;line-height:1.8;">
                {{content}}
            </div>
            <a href="${process.env.FRONTEND_URL}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;border-radius:12px;">
                Visit Lanari Tech
            </a>
        `)
    },

    welcome_back: {
        name: 'Welcome Back',
        description: 'Re-engage inactive users and bring them back',
        subject: 'We Miss You, {{name}}! — Lanari Tech',
        html: wrap(`
            <h2 style="margin:0 0 16px;color:#ffffff;font-size:24px;text-align:center;">We Miss You, {{name}}!</h2>
            <p style="margin:0 0 24px;color:#9ca3af;font-size:15px;line-height:1.7;text-align:center;">
                It's been a while since we've seen you. A lot has changed at Lanari Tech, and we'd love for you to check out what's new.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:20px;background-color:#111827;border-radius:12px;border:1px solid #374151;">
                    <p style="margin:0 0 8px;color:#60a5fa;font-size:14px;font-weight:700;">What you've been missing:</p>
                    <p style="margin:0;color:#9ca3af;font-size:14px;line-height:2;">
                        {{updates}}
                    </p>
                </td></tr>
            </table>
            <div style="text-align:center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:12px;box-shadow:0 4px 15px rgba(59,130,246,0.3);">
                    Come Back & Explore
                </a>
            </div>
        `)
    }
};

module.exports = { sendMail, templates, campaignTemplates, wrap };
