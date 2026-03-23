import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LegalLayout } from "../../components/layout/LegalLayout";
import { LegalSection, LP, LList, LCallout, LEmail, } from "../../components/layout/LegalSection";
export default function PrivacyPage() {
    return (_jsxs(LegalLayout, { title: "Privacy Policy", description: "How Edeh Chinedu Daniel collects, uses, and protects your information on this portfolio platform.", lastUpdated: "March 2026", children: [_jsx(LP, { children: "This Privacy Policy explains how Edeh Chinedu Daniel (\"I\", \"me\", \"my\") collects, uses, and protects information when you visit this portfolio, read my blog, purchase books, or contact me through this platform." }), _jsx(LP, { children: "I built this platform myself and I take your privacy seriously. I do not sell your data, I do not run advertising, and I collect only what is necessary to run the platform." }), _jsxs(LegalSection, { number: "01", heading: "Information I collect", children: [_jsx(LP, { children: "Depending on how you use this platform, I may collect the following:" }), _jsx(LList, { items: [
                            "Contact enquiries: your name, email address, and the message you send through the contact form.",
                            "Book purchases: your name, email address, and payment information. Payment is processed by a third-party provider — I do not store card details.",
                            "Newsletter subscriptions: your email address only.",
                            "Blog comments (if enabled): your name and email.",
                            "Analytics: pages visited, time on site, browser type, and country — collected anonymously via PostHog. No personally identifiable information is stored in analytics.",
                        ] }), _jsx(LCallout, { children: _jsx(LP, { children: "I do not use third-party advertising networks, tracking pixels, or data brokers. This portfolio runs on advertising-free infrastructure and does not feed your behaviour into any AI training pipeline." }) })] }), _jsxs(LegalSection, { number: "02", heading: "How I use your information", children: [_jsx(LP, { children: "Information you provide is used only for the purpose you provided it:" }), _jsx(LList, { items: [
                            "Contact enquiries: to reply to your message. I do not add you to any mailing list without your consent.",
                            "Book purchases: to deliver your purchase, send a receipt, and handle any support requests.",
                            "Newsletter: to send you updates when I publish new blog posts or books. Every email includes an unsubscribe link.",
                            "Analytics: to understand which content is useful and to improve the platform. Data is aggregated and never linked to you personally.",
                        ] })] }), _jsxs(LegalSection, { number: "03", heading: "Cookies and tracking", children: [_jsx(LP, { children: "This platform uses a small number of technical cookies necessary for the site to function, and one analytics tool (PostHog) that uses a first-party cookie." }), _jsx(LList, { items: [
                            "Session cookie: keeps you logged in if you have an account. Expires when you close the browser.",
                            "Theme preference: stores your dark/light mode choice. No personal data.",
                            "PostHog analytics cookie: anonymous identifier used to count unique visits. Does not track you across other websites.",
                        ] }), _jsx(LP, { children: "You can disable cookies in your browser settings at any time. The site will still function without them." })] }), _jsxs(LegalSection, { number: "04", heading: "Data storage and security", children: [_jsx(LP, { children: "Your data is stored on secure servers hosted on Render (backend) and managed via PostgreSQL. I use industry-standard security practices:" }), _jsx(LList, { items: [
                            "All data is transmitted over HTTPS.",
                            "Passwords are hashed with bcrypt (never stored in plain text).",
                            "Access tokens are short-lived and refresh tokens are rotated.",
                            "Database access is restricted to the application server.",
                        ] }), _jsx(LP, { children: "I retain contact enquiry data for up to 12 months and then delete it. Newsletter subscriber data is deleted within 30 days of unsubscribing." })] }), _jsxs(LegalSection, { number: "05", heading: "Third-party services", children: [_jsx(LP, { children: "This platform integrates with the following third-party services. Each has its own privacy policy:" }), _jsx(LList, { items: [
                            "Cloudinary — stores uploaded images and files including book covers and the CV download.",
                            "PostHog — anonymous analytics. Data is processed in the EU.",
                            "Vercel — hosts the frontend. Vercel may log request metadata.",
                            "Render — hosts the backend API and database.",
                            "Upstash (Redis) — caching layer. No personal data is stored in the cache.",
                        ] })] }), _jsxs(LegalSection, { number: "06", heading: "Your rights", children: [_jsx(LP, { children: "You have the right to:" }), _jsx(LList, { items: [
                            "Request a copy of the data I hold about you.",
                            "Request correction of inaccurate data.",
                            "Request deletion of your data at any time.",
                            "Unsubscribe from the newsletter at any time using the link in any email.",
                            "Withdraw consent for data processing at any time.",
                        ] }), _jsxs(LP, { children: ["To exercise any of these rights, email me at ", _jsx(LEmail, {}), ". I will respond within 14 days."] })] }), _jsx(LegalSection, { number: "07", heading: "Children's privacy", children: _jsxs(LP, { children: ["This platform is not directed at children under the age of 13. I do not knowingly collect data from children. If you believe a child has submitted data through this platform, please contact me at ", _jsx(LEmail, {}), " ", "and I will delete it promptly."] }) }), _jsxs(LegalSection, { number: "08", heading: "Changes to this policy", children: [_jsx(LP, { children: "I may update this Privacy Policy from time to time. When I do, I will update the \"Last updated\" date at the top of this page. Continued use of the platform after changes means you accept the updated policy." }), _jsxs(LP, { children: ["Questions? Email me at ", _jsx(LEmail, {}), "."] })] })] }));
}
//# sourceMappingURL=PrivacyPage.js.map