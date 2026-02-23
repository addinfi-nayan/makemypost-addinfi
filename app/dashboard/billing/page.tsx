'use client';

import React, { useState } from 'react';
import {
    CreditCard,
    ChevronRight,
    Zap,
    Sparkles,
    CheckCircle2,
    TrendingUp,
    Loader2,
    Package,
    ShieldCheck,
    Building
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createBrowserClient } from '@/lib/supabase';
import { addCredits } from '@/lib/actions';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function BillingPage() {
    const supabase = createBrowserClient();
    const [loading, setLoading] = useState(false);
    const [billingCycle, setBillingCycle] = useState<'topup' | 'subscription'>('topup');

    const topups = [
        {
            id: 'topup_50',
            name: 'Starter Pack',
            credits: 50,
            price: 499,
            description: 'Ideal for small shop owners or local freelancers.',
            features: ['50 AI Generations', 'Logo Overlays', 'Manual Scheduling']
        },
        {
            id: 'topup_150',
            name: 'Pro Pack',
            credits: 150,
            price: 999,
            popular: true,
            description: 'The best value for growing Indian brands.',
            features: ['150 AI Generations', 'Priority Magic Sync', 'Bulk Scheduling', 'Support']
        }
    ];

    const subscriptions = [
        {
            id: 'sub_basic',
            name: 'Basic Plan',
            credits: 100,
            price: 1499,
            description: 'Best for single business owners.',
            features: ['100 Credits/mo', '1 Connected Account', 'Standard Themes']
        },
        {
            id: 'sub_agency',
            name: 'Agency Plan',
            credits: 500,
            price: 4999,
            popular: true,
            description: 'Built for social media agencies managing clients.',
            features: ['500 Credits/mo', '5 Connected Accounts', 'Auto-Analysis (AI Match)', 'Priority Support']
        },
        {
            id: 'sub_enterprise',
            name: 'Enterprise',
            credits: 'Custom',
            price: 'Custom',
            description: 'Full white-labeling for your team.',
            features: ['Unlimited Credits', 'Unlimited Accounts', 'Your Own Branding', 'API Access']
        }
    ];

    const handlePayment = async (plan: any) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Auth required');

            // Professional Razorpay Simulation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const creditsToAdd = typeof plan.credits === 'number' ? plan.credits : 0;
            if (creditsToAdd > 0) {
                await addCredits(user.id, creditsToAdd);
            } else {
                // Handle custom contact if needed
            }
        } catch (err: any) {
            alert('Payment failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const currentPlans = billingCycle === 'topup' ? topups : subscriptions;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[var(--accent-1)] text-[11px] font-black uppercase tracking-widest shadow-inner">
                        <Package className="w-3 h-3" />
                        Billing & Plans
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-[var(--text)] uppercase italic">Manage <span className="grad-text">Credits</span></h1>
                    <p className="text-[var(--text-dim)] font-black text-xs uppercase tracking-widest">Choose a flexible plan that grows with your business.</p>
                </div>

                {/* Toggle UI */}
                <div className="bg-white/5 p-1 rounded-2xl flex gap-1 border border-white/5 shadow-inner">
                    <button
                        onClick={() => setBillingCycle('topup')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-black transition-all",
                            billingCycle === 'topup' ? "bg-white text-[var(--bg)] shadow-lg" : "text-[var(--text-dim)] hover:text-white"
                        )}
                    >
                        Top-up Packs
                    </button>
                    <button
                        onClick={() => setBillingCycle('subscription')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-black transition-all",
                            billingCycle === 'subscription' ? "bg-white text-[var(--bg)] shadow-lg" : "text-[var(--text-dim)] hover:text-white"
                        )}
                    >
                        Monthly Subs
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPlans.map((plan, i) => (
                    <div
                        key={i}
                        className={cn(
                            "bg-[var(--bg-card)]/40 p-8 rounded-[2.5rem] border transition-all flex flex-col relative group shadow-2xl overflow-hidden",
                            plan.popular
                                ? "border-[var(--accent-1)]/40 shadow-[0_0_40px_rgba(129,140,248,0.1)] scale-105 z-10"
                                : "border-white/5 hover:border-white/10"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent-1)] text-[var(--bg)] px-6 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/20">
                                Most Popular
                            </div>
                        )}

                        <div className="space-y-4 mb-8 relative">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-[var(--text)] tracking-tight uppercase italic">{plan.name}</h3>
                                {billingCycle === 'topup' ? (
                                    <Zap className="w-6 h-6 text-amber-500 animate-pulse" />
                                ) : (
                                    <TrendingUp className="w-6 h-6 text-[var(--accent-1)] animate-glow" />
                                )}
                            </div>
                            <p className="text-[var(--text-dim)] text-[11px] uppercase font-black tracking-widest opacity-60 leading-relaxed">{plan.description}</p>
                            <div className="pt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-[var(--text)] tracking-tighter">
                                    {typeof plan.price === 'number' ? `₹${plan.price}` : plan.price}
                                </span>
                                {billingCycle === 'subscription' && typeof plan.price === 'number' && (
                                    <span className="text-[var(--text-dim)] font-black uppercase tracking-widest text-[11px] opacity-60">/mo</span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-10 relative">
                            <div className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest border-b border-white/5 pb-2 opacity-50">Included Tech</div>
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-400/10 p-0.5 rounded-full text-green-400 shrink-0 border border-green-400/20">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <span className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest opacity-60 leading-tight">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePayment(plan)}
                            disabled={loading}
                            className={cn(
                                "w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden",
                                plan.popular
                                    ? "bg-white text-[var(--bg)] shadow-2xl shadow-indigo-500/10"
                                    : "bg-white/5 text-[var(--text)] border border-white/5 hover:bg-white/10"
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {typeof plan.price === 'number' ? 'Initialize Purchase' : 'Contact Support'}
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                ))}

                {/* High-tier Pitch Card (Always shown in Subscriptions) */}
                {billingCycle === 'subscription' && subscriptions.length < 4 && (
                    <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col justify-between text-[var(--text)] relative h-full shadow-inner overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))] -z-10" />
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-[var(--accent-1)] mb-4">
                                <Building className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight italic">White-Label Solution</h3>
                            <p className="text-[var(--text-dim)] text-[11px] uppercase font-black tracking-widest opacity-60 leading-relaxed">
                                Want to sell this as your own product? Get a custom branded dashboard for your agency.
                            </p>
                        </div>
                        <button className="mt-12 w-full py-5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all text-[var(--text)] active:scale-95">
                            Request HQ Info
                        </button>
                    </div>
                )}
            </div>

            {/* Security Footer */}
            <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5">
                {[
                    { icon: ShieldCheck, title: 'Secure Checkout', desc: 'PCI-compliant transactions with Razorpay.' },
                    { icon: TrendingUp, title: 'Instant Delivery', desc: 'Credits added to your account immediately.' },
                    { icon: Sparkles, title: 'High ROI Assets', desc: 'Premium content generation for local brands.' }
                ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                        <div className="bg-white/5 p-3 rounded-[1.2rem] text-[var(--accent-1)] shrink-0 border border-white/5">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-[var(--text)] uppercase tracking-tight italic text-sm">{item.title}</h4>
                            <p className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest opacity-60 leading-relaxed mt-1">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
