import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            {/* Top bar */}
            <div className="border-b border-[var(--border)]">
                <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
                    <Link href="/" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-16">
                <p className="text-xs font-semibold text-[var(--accent-1)] uppercase tracking-widest mb-3">Legal</p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                <p className="text-[var(--text-muted)] text-sm mb-12">Last updated: February 20, 2026</p>

                <div className="space-y-10 text-[15px] text-[var(--text-dim)] leading-relaxed">
                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">1. Introduction</h2>
                        <p>MakeMyPosts ("the Service"), operated by Addinfi Digitech Private Ltd. ("we," "us," or "our"), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you use our platform.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">2. Information We Collect</h2>
                        <h3 className="text-sm font-semibold text-[var(--text)] mb-2 mt-4">a) Information you provide:</h3>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Google account details (name, email, profile picture) via OAuth sign-in.</li>
                            <li>Business logos, brand colors, and assets you upload.</li>
                            <li>Payment information (processed securely by Razorpay — we do not store card details).</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-[var(--text)] mb-2 mt-4">b) Information collected automatically:</h3>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Instagram/Facebook profile data accessed via Meta's official Graph API (with your explicit permission).</li>
                            <li>Usage data: pages visited, features used, session duration.</li>
                            <li>Device information: browser type, operating system, IP address.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">3. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li><strong className="text-[var(--text)]">Service delivery:</strong> To generate AI designs, sync your brand, and publish posts.</li>
                            <li><strong className="text-[var(--text)]">Account management:</strong> To manage your subscription, billing, and support requests.</li>
                            <li><strong className="text-[var(--text)]">Improvement:</strong> To analyze usage patterns and improve the platform.</li>
                            <li><strong className="text-[var(--text)]">Communication:</strong> To send service updates, billing receipts, and support responses.</li>
                        </ul>
                        <p className="mt-3">We do <strong className="text-[var(--text)]">not</strong> sell, rent, or share your personal data with third parties for marketing purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">4. Data Security</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li><strong className="text-[var(--text)]">Encryption:</strong> All social media access tokens are encrypted at rest using AES-256.</li>
                            <li><strong className="text-[var(--text)]">Authentication:</strong> We use Google OAuth 2.0 — we never see or store your Google password.</li>
                            <li><strong className="text-[var(--text)]">Meta API:</strong> We access Instagram/Facebook only through Meta's official Graph API. We never scrape data.</li>
                            <li><strong className="text-[var(--text)]">Infrastructure:</strong> Data is stored in Supabase with enterprise-grade security and row-level access policies.</li>
                            <li><strong className="text-[var(--text)]">Payments:</strong> Handled entirely by Razorpay. We never store your card or bank details.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">5. Social Media Permissions</h2>
                        <p>When you connect your Instagram or Facebook account, we request only the permissions necessary to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                            <li>Read your profile information and recent posts (for brand syncing).</li>
                            <li>Publish content on your behalf (only when you explicitly approve a post).</li>
                        </ul>
                        <p className="mt-3">You can revoke these permissions at any time from your Meta account settings or from our Settings page.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">6. Data Retention</h2>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                            <li>Account data is retained for as long as your account is active.</li>
                            <li>Upon account deletion, all personal data and generated content are permanently removed within 30 days.</li>
                            <li>Billing records may be retained for up to 7 years as required by Indian tax law.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">7. Cookies</h2>
                        <p>We use essential cookies for authentication and session management. We do not use third-party tracking cookies or advertising cookies.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">8. Third-Party Services</h2>
                        <p>We integrate with the following third-party services:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                            <li><strong className="text-[var(--text)]">Google OAuth:</strong> For authentication.</li>
                            <li><strong className="text-[var(--text)]">Meta Graph API:</strong> For Instagram/Facebook integration.</li>
                            <li><strong className="text-[var(--text)]">Razorpay:</strong> For payment processing.</li>
                            <li><strong className="text-[var(--text)]">Supabase:</strong> For database and file storage.</li>
                        </ul>
                        <p className="mt-3">Each service has its own privacy policy which governs their handling of your data.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">9. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                            <li>Access the personal data we hold about you.</li>
                            <li>Request correction of inaccurate data.</li>
                            <li>Request deletion of your account and associated data.</li>
                            <li>Revoke social media permissions at any time.</li>
                            <li>Export your data in a portable format.</li>
                        </ul>
                        <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:info@addinfi.com" className="text-[var(--accent-1)] hover:underline">info@addinfi.com</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">10. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify users of material changes via email or in-app notification. Continued use of the Service after changes constitutes acceptance.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">11. Contact Us</h2>
                        <p>For questions about this Privacy Policy or your data, contact us at:</p>
                        <div className="mt-3 gradient-border !rounded-xl inline-block">
                            <div className="px-6 py-4">
                                <p className="text-[var(--text)] font-medium">Addinfi Digitech Private Ltd.</p>
                                <p><a href="mailto:info@addinfi.com" className="text-[var(--accent-1)] hover:underline">info@addinfi.com</a></p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ─── Footer ─── */}
                <div className="mt-20 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-[var(--text-muted)]">© 2026 Powered by Addinfi Digitech Private Ltd.</p>
                    <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)]">
                        <Link href="/terms" className="hover:text-[var(--text)] transition-colors">Terms & Refunds</Link>
                        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
