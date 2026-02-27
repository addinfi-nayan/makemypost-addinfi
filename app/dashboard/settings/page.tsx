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
    Smartphone,
    ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Custom Dropdown Component
function CustomDropdown({ 
    label, 
    value, 
    onChange, 
    options, 
    placeholder 
}: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void; 
    options: { value: string; label: string }[]; 
    placeholder?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative">
            <label className="block text-xs font-[900] text-white/70 uppercase tracking-widest mb-2 opacity-80">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-2)] outline-none transition-all text-white text-sm text-left flex items-center justify-between group hover:border-white/10"
            >
                <span className={selectedOption ? "text-white" : "text-white/40"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)} 
                    />
                    <div className="absolute z-20 w-full mt-1 bg-[var(--bg-card)] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full p-3 text-left text-sm transition-colors ${
                                    option.value === value 
                                        ? 'bg-[var(--accent-2)]/20 text-white' 
                                        : 'text-white hover:bg-white/[0.05]'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createBrowserClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [brand, setBrand] = useState({
        name: '',
        contact_details: '',
        address: '',
        logo_url: '',
        instagram_handle: '',
        product_services_details: '',
        post_content_focus: 'balance', // 'product_focused', 'content_focused', 'balance'
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
        <div className="max-w-4xl space-y-10 pt-24 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-[900] text-white tracking-tighter uppercase italic">Brand <span className="grad-text">Settings</span></h1>
                <p className="text-white mt-2 font-[900] text-xs uppercase tracking-widest">Personalize your content with your brand identity.</p>
            </div>

            {/* Business Details Section */}
            <section className="bg-gradient-to-br from-[var(--bg-card)]/60 to-[var(--bg-card)]/40 p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
                <div className="flex items-center gap-4 text-white/60 mb-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-[900] text-white uppercase tracking-tight italic">Business Details</h2>
                        <p className="text-xs font-[900] text-white/70 uppercase tracking-widest mt-1">Company Information & Contact</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-[900] text-white uppercase tracking-widest mb-3 opacity-80">Brand Name</label>
                            <input
                                type="text"
                                value={brand.name}
                                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                                placeholder="e.g. Addinfi"
                                className="w-full p-4 bg-white/[0.05] border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--accent-1)]/50 outline-none transition-all text-white text-sm placeholder:text-white/30"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-[900] text-white uppercase tracking-widest mb-3 opacity-80">Contact Details</label>
                            <input
                                type="text"
                                value={brand.contact_details}
                                onChange={(e) => setBrand({ ...brand, contact_details: e.target.value })}
                                placeholder="e.g. contact@brand.com | +1-234-567-8900"
                                className="w-full p-4 bg-white/[0.05] border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--accent-1)]/50 outline-none transition-all text-white text-sm placeholder:text-white/30"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-[900] text-white uppercase tracking-widest mb-3 opacity-80">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    value={brand.address}
                                    onChange={(e) => setBrand({ ...brand, address: e.target.value })}
                                    placeholder="e.g. 123 Business St, City, State 12345"
                                    className="w-full p-4 pl-12 bg-white/[0.05] border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--accent-1)]/50 outline-none transition-all text-white text-sm placeholder:text-white/30"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-[900] text-white uppercase tracking-widest mb-3 opacity-80">Instagram Handle</label>
                            <div className="relative">
                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    value={brand.instagram_handle}
                                    onChange={(e) => setBrand({ ...brand, instagram_handle: e.target.value })}
                                    placeholder="your_brand"
                                    className="w-full p-4 pl-12 bg-white/[0.05] border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--accent-1)]/50 outline-none transition-all text-white text-sm placeholder:text-white/30"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-[900] text-white uppercase tracking-widest mb-3 opacity-80">Product / Services Details</label>
                            <textarea
                                value={brand.product_services_details}
                                onChange={(e) => setBrand({ ...brand, product_services_details: e.target.value })}
                                placeholder="Describe your products and services in detail..."
                                rows={4}
                                className="w-full p-4 bg-white/[0.05] border border-white/10 rounded-xl focus:ring-2 focus:ring-[var(--accent-1)]/50 outline-none transition-all text-white text-sm placeholder:text-white/30 resize-none"
                            />
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-4">
                            <label className="block text-xs font-[900] text-white uppercase tracking-widest mb-3 opacity-80">Brand Logo (PNG)</label>
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full max-w-xs">
                                    {logoPreview ? (
                                        <div className="relative group">
                                            <img
                                                src={logoPreview}
                                                alt="Logo Preview"
                                                className="w-full h-32 object-contain rounded-xl border border-white/20 bg-white/[0.05]"
                                            />
                                            <button
                                                onClick={() => {
                                                    setLogoPreview('');
                                                    setLogoFile(null);
                                                    setBrand({ ...brand, logo_url: '' });
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-red-400/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full h-32 border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center bg-white/[0.05] hover:border-white/50 transition-colors">
                                            <Upload className="w-8 h-8 text-white/40 mb-2" />
                                            <p className="text-xs text-white/40 text-center">Click to upload logo</p>
                                            <p className="text-xs text-white/20 text-center mt-1">PNG format recommended</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                    id="logo-upload"
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className="mt-4 px-6 py-3 bg-[var(--accent-1)]/10 text-[var(--accent-1)] font-[900] uppercase tracking-widest text-xs rounded-xl border border-[var(--accent-1)]/20 hover:bg-[var(--accent-1)]/20 transition-all cursor-pointer"
                                >
                                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Post Settings Section */}
            <section className="bg-gradient-to-br from-[var(--bg-card)]/40 to-[var(--bg-card)]/20 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                <div className="flex items-center gap-4 text-white/60 mb-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                        <SettingsIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-[900] text-white uppercase tracking-tight italic">Post Settings</h2>
                        <p className="text-xs font-[900] text-white/70 uppercase tracking-widest mt-1">Content Generation & Scheduling</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <CustomDropdown
                            label="Default Theme"
                            value={postSettings.default_theme}
                            onChange={(value) => setPostSettings({ ...postSettings, default_theme: value })}
                            options={[
                                { value: 'Minimalist', label: 'Minimalist' },
                                { value: 'Bold', label: 'Bold' },
                                { value: 'Festive', label: 'Festive' }
                            ]}
                        />

                        <CustomDropdown
                            label="Post Frequency"
                            value={postSettings.post_frequency}
                            onChange={(value) => setPostSettings({ ...postSettings, post_frequency: value })}
                            options={[
                                { value: 'daily', label: 'Daily' },
                                { value: 'weekly', label: 'Weekly' },
                                { value: 'custom', label: 'Custom' }
                            ]}
                        />
                    </div>

                    <div className="space-y-6">
                        <CustomDropdown
                            label="Post Content Focus"
                            value={brand.post_content_focus}
                            onChange={(value) => setBrand({ ...brand, post_content_focus: value })}
                            options={[
                                { value: 'product_focused', label: 'Product Focused (80% Image + 20% Text)' },
                                { value: 'content_focused', label: 'Content Focused (50% Image + 50% Text)' },
                                { value: 'balance', label: 'Balance (70% Image + 30% Content)' }
                            ]}
                        />

                        <div className="flex items-center justify-between p-4 bg-white/[0.05] rounded-xl border border-white/10">
                            <label className="text-xs font-[900] text-white/70 uppercase tracking-widest opacity-80">Auto Schedule</label>
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
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/[0.05] rounded-xl border border-white/10">
                            <label className="text-xs font-[900] text-white/70 uppercase tracking-widest opacity-80">Add Watermark</label>
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

                        <div className="p-4 bg-white/[0.05] rounded-xl border border-white/10">
                            <div className="text-xs font-[900] text-white/70 uppercase tracking-widest opacity-80 mb-2">Quick Stats</div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/60">Total Posts</span>
                                    <span className="text-white font-[900]">0</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/60">Scheduled</span>
                                    <span className="text-white font-[900]">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GMB Details Section */}
            <section className="bg-gradient-to-br from-[var(--bg-card)]/30 to-[var(--bg-card)]/20 p-8 rounded-[3rem] border border-dashed border-white/10 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 text-white/50 mb-2">
                    <MapPin className="w-5 h-5" />
                    <h2 className="text-base font-[900] text-white uppercase tracking-tight italic">Google My Business (GMB)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-[900] text-white/70 uppercase mb-2 opacity-80">GMB Profile Name</label>
                        <input
                            type="text"
                            value={brand.gmb_details.business_name}
                            onChange={(e) => setBrand({
                                ...brand,
                                gmb_details: { ...brand.gmb_details, business_name: e.target.value }
                            })}
                            placeholder="Business name as it appears on Google"
                            className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-1)] outline-none transition-all text-white text-sm placeholder:text-white/20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-[900] text-white/70 uppercase mb-2 opacity-80">Business Address</label>
                        <input
                            type="text"
                            value={brand.gmb_details.address}
                            onChange={(e) => setBrand({
                                ...brand,
                                gmb_details: { ...brand.gmb_details, address: e.target.value }
                            })}
                            placeholder="Full address for location tags"
                            className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-xl focus:ring-1 focus:ring-[var(--accent-1)] outline-none transition-all text-white text-sm placeholder:text-white/20"
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
