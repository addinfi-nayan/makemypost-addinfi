'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import Navbar from '@/components/Navbar';
import { createBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Instagram,
  Zap,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  Rocket,
  Check,
  ChevronDown,
  Mail,
  Linkedin,
  Facebook,
  Cpu,
  Lock,
  Globe,
  PenTool,
  Palette,
  Layers,
  Image as ImageIcon,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAuthModalOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthAction = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    { q: "How does the AI match my brand style?", a: "Magic Sync analyzes your last 10 posts — color palette, fonts, visual density. Every design feels authentically yours." },
    { q: "How does the pricing work?", a: "It's simple — buy a pack of posts. Our most popular plan is 20 posts for ₹999, working out to just ₹50 per post. Each post is a fully designed, branded image ready to publish." },
    { q: "Is my data and account information secure?", a: "We use Meta's official Graph API. Zero password storage. AES-256 encryption for all tokens." },
    { q: "Can I use my own logo and brand colors?", a: "Yes. Upload logo + brand colors in Settings. AI applies them to every design automatically." },
    { q: "What social media platforms are supported?", a: "Instagram Pro + Facebook Pages. Google My Business coming soon. Download designs to post anywhere." },
    { q: "Do you offer a free trial?", a: "2 free posts on sign-up. No card required. Test everything before buying." },
    { q: "Who is MakeMyPosts designed for?", a: "Small businesses, agencies, freelancers — anyone who wants pro social media without paying a designer." },
    { q: "Can I cancel my subscription anytime?", a: "Anytime. Monthly plans cancel instantly. Purchased post packs never expire." }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar showDashboardLink={true} />

      {/* ─── Hero ─── */}
      <section className="pt-32 pb-24 px-6 relative mesh-gradient">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full shimmer-badge border border-[var(--accent-1)]/20 text-[var(--accent-1)] text-xs font-medium mb-8">
            <Sparkles className="w-3 h-3" />
            AI-Powered Social Media Studio
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-[-0.04em] leading-[1.05] mb-6">
            Create posts that<br />
            <span className="grad-text">look incredible.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-dim)] max-w-xl mx-auto mb-10 leading-relaxed">
            AI generates on-brand Instagram & Facebook content with your logo. 20 posts for just ₹999. Ready in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <button
              onClick={handleAuthAction}
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-[var(--bg)] rounded-xl text-sm font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-white/5 cursor-pointer"
            >
              Start Creating Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-7 py-3.5 border border-[var(--border)] text-[var(--text-dim)] rounded-xl text-sm font-medium hover:text-[var(--text)] hover:border-white/15 transition-all flex items-center justify-center gap-2"
            >
              See Features
            </a>
          </div>

          <div className="flex items-center justify-center gap-5 text-[13px] text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[var(--accent-1)]" /> 2 Free Posts</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[var(--accent-1)]" /> No Card Required</span>
          </div>
        </div>
      </section>

      {/* ─── Bento Features Grid ─── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-[42px] font-bold tracking-tight mb-4">
              Everything you need to <span className="grad-text">create & grow</span>
            </h2>
            <p className="text-[var(--text-dim)] text-lg max-w-md mx-auto">Powerful features, beautifully simple.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Large — Magic Sync */}
            <div className="md:col-span-2 gradient-border glow-purple">
              <div className="p-8 md:p-10 h-full flex flex-col justify-between min-h-[280px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-1)]/10 border border-[var(--accent-1)]/20 flex items-center justify-center mb-5">
                    <Instagram className="w-5 h-5 text-[var(--accent-1)]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 tracking-tight">Magic Sync</h3>
                  <p className="text-[var(--text-dim)] text-[15px] leading-relaxed max-w-md">
                    Connect your Instagram and our AI analyzes your brand — colors, style, vibe. Every design stays perfectly on-brand.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  {['#818CF8', '#C084FC', '#F472B6', '#34D399', '#FBBF24'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg" style={{ background: c, opacity: 0.7 + i * 0.06 }} />
                  ))}
                  <span className="text-xs text-[var(--text-muted)] ml-2">Your palette, detected</span>
                </div>
              </div>
            </div>

            {/* Small — Speed */}
            <div className="gradient-border">
              <div className="p-8 h-full flex flex-col justify-between min-h-[280px]">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-2)]/10 border border-[var(--accent-2)]/20 flex items-center justify-center mb-5">
                  <Zap className="w-5 h-5 text-[var(--accent-2)]" />
                </div>
                <div>
                  <div className="text-[56px] font-bold tracking-tight grad-text leading-none mb-2">&lt;30s</div>
                  <p className="text-[var(--text-dim)] text-[15px]">Average time to generate a fully designed, branded post.</p>
                </div>
              </div>
            </div>

            {/* Small — Logo */}
            <div className="gradient-border">
              <div className="p-8 h-full flex flex-col justify-between min-h-[240px]">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-3)]/10 border border-[var(--accent-3)]/20 flex items-center justify-center mb-5">
                  <ImageIcon className="w-5 h-5 text-[var(--accent-3)]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 tracking-tight">Auto Logo Placement</h3>
                  <p className="text-[var(--text-dim)] text-[15px]">Your logo, perfectly positioned on every design. No manual work.</p>
                </div>
              </div>
            </div>

            {/* Large — Scheduling */}
            <div className="md:col-span-2 gradient-border">
              <div className="p-8 md:p-10 h-full flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 tracking-tight">Smart Scheduling</h3>
                  <p className="text-[var(--text-dim)] text-[15px] leading-relaxed max-w-md">
                    Generate, approve, and schedule — all in one flow. Posts go live automatically at the perfect time.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-6">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
                    <div key={i} className={`px-3 py-2 rounded-lg text-xs font-medium ${i === 2 ? 'bg-green-400/15 text-green-400 border border-green-400/20' : 'bg-white/[0.03] text-[var(--text-muted)] border border-[var(--border)]'}`}>
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-[42px] font-bold tracking-tight mb-4">
              Three steps. <span className="grad-text">That&apos;s it.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Connect", desc: "Link Instagram. Magic Sync learns your brand in seconds.", icon: Instagram, color: "var(--accent-1)" },
              { num: "02", title: "Generate", desc: "Describe your post. AI creates multiple branded designs.", icon: PenTool, color: "var(--accent-2)" },
              { num: "03", title: "Publish", desc: "Pick a design, schedule it. We handle the rest.", icon: Rocket, color: "var(--accent-3)" }
            ].map((s, i) => (
              <div key={i} className="relative group">
                <div className="gradient-border">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.num}</span>
                      <div className="h-px flex-1 bg-[var(--border)]" />
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 tracking-tight">{s.title}</h3>
                    <p className="text-[var(--text-dim)] text-[15px] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-20 px-6 relative mesh-gradient">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-[42px] font-bold tracking-tight mb-4">
              Simple, honest <span className="grad-text">pricing</span>
            </h2>
            <p className="text-[var(--text-dim)] text-lg">No hidden fees. Start free, scale as you grow.</p>
          </div>

          {/* Top-ups */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[var(--accent-1)]" /> One-Time Packs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'Starter', price: '₹499', credits: '10 posts', per: '₹50/post', desc: 'Try it out.' },
                { name: 'Value', price: '₹999', credits: '20 posts', per: '₹50/post', desc: 'Most popular.', badge: true }
              ].map((p, i) => (
                <div key={i} className={`gradient-border ${p.badge ? 'glow-purple' : ''}`}>
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{p.name}</h4>
                        {p.badge && <span className="text-[10px] font-semibold bg-[var(--accent-1)]/15 text-[var(--accent-1)] px-2 py-0.5 rounded-full uppercase">Popular</span>}
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">{p.credits} · {p.per}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold tracking-tight">{p.price}</span>
                      <button
                        onClick={handleAuthAction}
                        className="px-5 py-2 bg-white text-[var(--bg)] rounded-lg text-xs font-semibold hover:bg-white/90 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Get Pack
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--accent-2)]" /> Monthly Plans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: 'Creator', price: '₹1,999', period: '/mo', credits: '50 posts', accounts: '1 account', desc: 'For solo creators.' },
                { name: 'Agency', price: '₹4,999', period: '/mo', credits: '150 posts', accounts: '5 accounts', auto: true, desc: 'For growing teams.' }
              ].map((p, i) => (
                <div key={i} className="gradient-border">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold mb-0.5">{p.name}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{p.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold tracking-tight">{p.price}</span>
                        <span className="text-sm text-[var(--text-muted)]">{p.period}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[11px] bg-white/[0.04] px-2.5 py-1 rounded-md text-[var(--text-muted)] border border-[var(--border)]">{p.credits}</span>
                      <span className="text-[11px] bg-white/[0.04] px-2.5 py-1 rounded-md text-[var(--text-muted)] border border-[var(--border)]">{p.accounts}</span>
                      {p.auto && <span className="text-[11px] bg-[var(--accent-2)]/10 px-2.5 py-1 rounded-md text-[var(--accent-2)] border border-[var(--accent-2)]/20">Auto-schedule</span>}
                    </div>
                    <button
                      onClick={handleAuthAction}
                      className="w-full py-2.5 border border-[var(--border)] text-sm font-medium rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Choose Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-[42px] font-bold tracking-tight text-center mb-12">
            FAQ
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="gradient-border !rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between cursor-pointer group"
                >
                  <span className="text-[15px] font-medium group-hover:text-[var(--accent-1)] transition-colors pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-[var(--accent-1)]' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 text-[var(--text-dim)] text-[14px] leading-relaxed fade-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Security ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="gradient-border glow-purple">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold tracking-tight text-center mb-8">Built on trust</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: ShieldCheck, label: "Official Meta API" },
                  { icon: Lock, label: "AES-256 Encryption" },
                  { icon: Cpu, label: "Supabase Backend" },
                  { icon: Globe, label: "Global CDN" }
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <item.icon className="w-5 h-5 text-[var(--accent-1)] mx-auto mb-2" />
                    <p className="text-[13px] text-[var(--text-dim)]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6 text-center relative mesh-gradient">
        <div className="max-w-xl mx-auto relative">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Ready to <span className="grad-text">create?</span>
          </h2>
          <p className="text-[var(--text-dim)] text-lg mb-8">2 free posts. No card. Start in 30 seconds.</p>
          <button
            onClick={handleAuthAction}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--bg)] rounded-xl text-sm font-semibold hover:bg-white/90 transition-all shadow-xl shadow-white/5 group cursor-pointer"
          >
            Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[var(--border)] py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-[var(--text)]">Make<span className="grad-text">My</span>Posts</span>
              <span className="text-xs text-[var(--text-muted)] ml-2">© 2026 Addinfi Digitech Private Ltd.</span>
            </div>

            <div className="flex items-center gap-4">
              {[
                { Icon: Instagram, href: 'https://www.instagram.com/instaaddinfi/' },
                { Icon: Linkedin, href: 'https://www.linkedin.com/company/addinfi/' },
                { Icon: Facebook, href: 'https://www.facebook.com/addinfi/' },
                { Icon: Mail, href: 'mailto:info@addinfi.com' }
              ].map(({ Icon, href }, idx) => (
                <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
