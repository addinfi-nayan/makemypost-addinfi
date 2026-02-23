import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Terms & Conditions',
    description: 'Terms of Service and Refund Policy.',
};

export default function TermsPage() {
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
                {/* ─── Terms & Conditions ─── */}
                <div className="mb-20">
                    <p className="text-xs font-semibold text-[var(--accent-1)] uppercase tracking-widest mb-3">Legal</p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Terms &amp; Conditions</h1>
                    <p className="text-[var(--text-muted)] text-sm mb-12">Last updated: February 20, 2026</p>

                    <div className="space-y-10 text-[15px] text-[var(--text-dim)] leading-relaxed">
                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing or using MakeMyPosts ("the Service"), operated by Addinfi Digitech Private Ltd. ("we," "us," or "our"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Service.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">2. Description of Service</h2>
                            <p>MakeMyPosts is an AI-powered social media content creation platform that generates branded posts for Instagram and Facebook. The Service includes AI design generation, brand syncing, scheduling, and publishing features.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">3. Account Registration</h2>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>You must sign in using a valid Google account via OAuth.</li>
                                <li>You are responsible for all activity under your account.</li>
                                <li>You must be at least 18 years old to use the Service.</li>
                                <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">4. Posts &amp; Pricing</h2>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Posts are the unit of service. Each post generates a fully designed, branded image.</li>
                                <li>Post packs (one-time) and monthly plans are available as listed on our Pricing page.</li>
                                <li>Pricing is in Indian Rupees (INR) and may change with prior notice.</li>
                                <li>New users receive 2 free posts upon sign-up.</li>
                                <li>Purchased post packs never expire.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">5. Payments</h2>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Payments are processed securely via Razorpay.</li>
                                <li>All payments are final upon successful processing unless eligible for a refund as described in our Refund Policy below.</li>
                                <li>Monthly subscriptions auto-renew unless cancelled before the billing date.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">6. Intellectual Property</h2>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>You retain ownership of your uploaded logos, brand assets, and content.</li>
                                <li>AI-generated designs are licensed to you for commercial use upon purchase.</li>
                                <li>The MakeMyPosts platform, brand, and technology remain our intellectual property.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">7. User Conduct</h2>
                            <p>You agree not to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                                <li>Use the Service to generate illegal, harmful, or misleading content.</li>
                                <li>Attempt to reverse-engineer, scrape, or exploit the Service.</li>
                                <li>Share your account credentials with third parties.</li>
                                <li>Violate any applicable laws or regulations while using the Service.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">8. Service Availability</h2>
                            <p>We strive for high uptime but do not guarantee uninterrupted access. We may perform maintenance, updates, or experience downtime beyond our control. We are not liable for losses due to temporary service unavailability.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">9. Limitation of Liability</h2>
                            <p>To the maximum extent permitted by law, MakeMyPosts and Addinfi Digitech Private Ltd. shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount paid by you in the preceding 3 months.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[var(--text)] mb-3">10. Changes to Terms</h2>
                            <p>We may update these Terms at any time. Continued use after changes constitutes acceptance. We will notify users of significant changes via email or in-app notification.</p>
                        </section>
                    </div>
                </div>

                {/* ─── Divider ─── */}
                <div className="border-t border-[var(--border)] my-4" />

                {/* ─── Refund Policy ─── */}
                <div className="pt-16">
                    <p className="text-xs font-semibold text-[var(--accent-3)] uppercase tracking-widest mb-3">Policy</p>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Refund Policy</h2>
                    <p className="text-[var(--text-muted)] text-sm mb-12">Last updated: February 20, 2026</p>

                    <div className="space-y-10 text-[15px] text-[var(--text-dim)] leading-relaxed">
                        <section>
                            <h3 className="text-lg font-semibold text-[var(--text)] mb-3">1. One-Time Post Packs</h3>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li><strong className="text-[var(--text)]">Before use:</strong> Full refund available within 7 days of purchase if no posts have been generated.</li>
                                <li><strong className="text-[var(--text)]">After use:</strong> No refund is available once any posts from the pack have been generated.</li>
                                <li>Unused post packs never expire and remain in your account indefinitely.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-[var(--text)] mb-3">2. Monthly Subscriptions</h3>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>You may cancel your subscription at any time from the Billing dashboard.</li>
                                <li>Cancellation takes effect at the end of the current billing cycle — you retain access until then.</li>
                                <li>No pro-rata refunds are provided for partial months.</li>
                                <li>If you experience a billing error, contact us within 48 hours for resolution.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-[var(--text)] mb-3">3. Technical Issues</h3>
                            <p>If the Service fails to deliver a post due to a technical error on our end (e.g., AI generation failure, publishing failure), we will either:</p>
                            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
                                <li>Re-credit the posts to your account, or</li>
                                <li>Provide a full refund for the affected posts.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-[var(--text)] mb-3">4. How to Request a Refund</h3>
                            <p>Email us at <a href="mailto:info@addinfi.com" className="text-[var(--accent-1)] hover:underline">info@addinfi.com</a> with your registered email and order details. Refunds are processed within 5–7 business days to the original payment method.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-[var(--text)] mb-3">5. Free Posts</h3>
                            <p>The 2 free posts provided upon sign-up are non-refundable and carry no monetary value.</p>
                        </section>
                    </div>
                </div>

                {/* ─── Footer ─── */}
                <div className="mt-20 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-[var(--text-muted)]">© 2026 Powered by Addinfi Digitech Private Ltd.</p>
                    <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)]">
                        <Link href="/privacy" className="hover:text-[var(--text)] transition-colors">Privacy Policy</Link>
                        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
