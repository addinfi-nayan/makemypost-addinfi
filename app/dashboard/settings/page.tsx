'use client';

import React, { useState, useEffect } from 'react';
import {
    Building2,
    Upload,
    Instagram,
    MapPin,
    Save,
    Loader2,
    CheckCircle2,
    Trash2,
    LogOut,
    Settings as SettingsIcon,
    Bell,
    Palette,
    Globe,
    Shield,
    Smartphone
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createBrowserClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [brand, setBrand] = useState({
        name: '',
        logo_url: '',
        instagram_handle: '',
        gmb_details: { business_name: '', address: '' }
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    
    // Post Settings
    const [postSettings, setPostSettings] = useState({
        default_theme: 'Minimalist',
        auto_schedule: true,
        post_frequency: 'daily',
        watermark: false
    });
    
    // Profile Settings
    const [profileSettings, setProfileSettings] = useState({
        notifications: true,
        public_profile: false,
        language: 'en',
        timezone: 'UTC'
    });

    useEffect(() => {
        const fetchBrand = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: brandData } = await supabase
                .from('brands')
                .select('*')
                .single();

            if (brandData) {
                setBrand(brandData);
                if (brandData.logo_url) setLogoPreview(brandData.logo_url);
            }
            setLoading(false);
        };

        fetchBrand();
    }, [supabase]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let finalLogoUrl = brand.logo_url;

        if (logoFile) {
            const fileExt = logoFile.name.split('.').pop();
            const timestamp = Date.now();
            const fileName = `${user.id}-${timestamp}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('brand-logos')
                .upload(fileName, logoFile);

            if (uploadData) {
                const { data: { publicUrl } } = supabase.storage
                    .from('brand-logos')
                    .getPublicUrl(fileName);
                finalLogoUrl = publicUrl;
            }
        }

        const brandData = {
            ...brand,
            user_id: user.id,
            logo_url: finalLogoUrl,
        };

        const { error } = await supabase
            .from('brands')
            .upsert(brandData);

        setSaving(false);
        if (!error) alert('Settings saved successfully!');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) return null;

    return (
        <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-[900] text-[var(--text)] tracking-tighter uppercase italic">Brand <span className="grad-text">Settings</span></h1>
                <p className="text-[var(--text-dim)] mt-2 font-[900] text-xs uppercase tracking-widest">Personalize your content with your brand identity.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Details */}
                <section className="bg-[var(--bg-card)]/40 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 text-[var(--accent-1)] mb-2">
                        <Building2 className="w-5 h-5" />
                        <h2 className="text-base font-[900] text-[var(--text)] uppercase tracking-tight italic">Business Details</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-[900] text-[var(--text-dim)] uppercase tracking-widest mb-2 opacity-80">Brand Name</label>
                            <input
                                type="text"
                                value={brand.name}
                                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                                placeholder="e.g. Addinfi"
                                className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-1)] outline-none transition-all text-[var(--text)] text-sm placeholder:text-white/20"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-[900] text-[var(--text-dim)] uppercase tracking-widest mb-2 opacity-80">Instagram Handle</label>
                            <div className="relative">
                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    value={brand.instagram_handle}
                                    onChange={(e) => setBrand({ ...brand, instagram_handle: e.target.value })}
                                    placeholder="your_brand"
                                    className="w-full p-4 pl-12 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-1)] outline-none transition-all text-[var(--text)] text-sm placeholder:text-white/20"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Post Settings */}
                <section className="bg-[var(--bg-card)]/40 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
                    <div className="flex items-center gap-3 text-[var(--accent-2)] mb-2">
                        <SettingsIcon className="w-5 h-5" />
                        <h2 className="text-base font-[900] text-[var(--text)] uppercase tracking-tight italic">Post Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-[900] text-[var(--text-dim)] uppercase tracking-widest mb-2 opacity-80">Default Theme</label>
                            <select
                                value={postSettings.default_theme}
                                onChange={(e) => setPostSettings({ ...postSettings, default_theme: e.target.value })}
                                className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-2)] outline-none transition-all text-[var(--text)] text-sm"
                            >
                                <option value="Minimalist">Minimalist</option>
                                <option value="Bold">Bold</option>
                                <option value="Festive">Festive</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-[900] text-[var(--text-dim)] uppercase tracking-widest mb-2 opacity-80">Post Frequency</label>
                            <select
                                value={postSettings.post_frequency}
                                onChange={(e) => setPostSettings({ ...postSettings, post_frequency: e.target.value })}
                                className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-2)] outline-none transition-all text-[var(--text)] text-sm"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-xs font-[900] text-[var(--text-dim)] uppercase tracking-widest opacity-80">Auto Schedule</label>
                            <button
                                onClick={() => setPostSettings({ ...postSettings, auto_schedule: !postSettings.auto_schedule })}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-colors duration-200 relative",
                                    postSettings.auto_schedule ? "bg-[var(--accent-2)]" : "bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                                    postSettings.auto_schedule ? "translate-x-6" : "translate-x-1"
                                )} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-xs font-[900] text-[var(--text-dim)] uppercase tracking-widest opacity-80">Add Watermark</label>
                            <button
                                onClick={() => setPostSettings({ ...postSettings, watermark: !postSettings.watermark })}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-colors duration-200 relative",
                                    postSettings.watermark ? "bg-[var(--accent-2)]" : "bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                                    postSettings.watermark ? "translate-x-6" : "translate-x-1"
                                )} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* GMB Details */}
            <section className="bg-[var(--bg-card)]/40 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 col-span-full relative">
                <div className="flex items-center gap-3 text-[var(--accent-1)] mb-2">
                    <MapPin className="w-5 h-5" />
                    <h2 className="text-base font-[900] text-[var(--text)] uppercase tracking-tight italic">Google My Business (GMB)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-[900] text-[var(--text-dim)] uppercase mb-2 opacity-80">GMB Profile Name</label>
                        <input
                            type="text"
                            value={brand.gmb_details.business_name}
                            onChange={(e) => setBrand({
                                ...brand,
                                gmb_details: { ...brand.gmb_details, business_name: e.target.value }
                            })}
                            placeholder="Business name as it appears on Google"
                            className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-1)] outline-none transition-all text-[var(--text)] text-sm placeholder:text-white/20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-[900] text-[var(--text-dim)] uppercase mb-2 opacity-80">Business Address</label>
                        <input
                            type="text"
                            value={brand.gmb_details.address}
                            onChange={(e) => setBrand({
                                ...brand,
                                gmb_details: { ...brand.gmb_details, address: e.target.value }
                            })}
                            placeholder="Full address for location tags"
                            className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-1)] outline-none transition-all text-[var(--text)] text-sm placeholder:text-white/20"
                        />
                    </div>
                </div>
            </section>

            <div className="flex justify-between items-center pt-10 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-8 py-4 bg-red-400/10 text-red-400 font-[900] uppercase tracking-widest text-xs rounded-2xl border border-red-400/20 hover:bg-red-400/20 transition-all active:scale-95"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out Session
                </button>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 px-12 py-5 bg-white text-[var(--bg)] font-[900] uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl transition-all transform hover:scale-[1.05] active:scale-95 disabled:opacity-50 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Syncing...' : 'Commit Settings'}
                </button>
            </div>
        </div>
    );
}
