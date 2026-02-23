'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
    Calendar as CalendarIcon,
    Clock,
    Plus,
    MoreVertical,
    Image as ImageIcon,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createBrowserClient } from '@/lib/supabase';
import { deleteScheduledPost, updateScheduledPostStatus, reschedulePost } from '@/lib/actions';
import { useRouter } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function SchedulePage() {
    const supabase = createBrowserClient();
    const router = useRouter();
    const [date, setDate] = useState<Date>(new Date());
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const { data, error } = await supabase
                .from('scheduled_posts')
                .select('*')
                .gte('scheduled_at', startOfDay.toISOString())
                .lte('scheduled_at', endOfDay.toISOString())
                .order('scheduled_at', { ascending: true });

            if (error) throw error;
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPosts();
    }, [date]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this scheduled post?')) return;
        try {
            await deleteScheduledPost(id);
            setPosts(posts.filter(p => p.id !== id));
            setActiveMenuId(null);
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleToggleStatus = async (post: any) => {
        const newStatus = post.status === 'paused' ? 'scheduled' : 'paused';
        try {
            await updateScheduledPostStatus(post.id, newStatus);
            setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
            setActiveMenuId(null);
        } catch (err) {
            alert('Status update failed');
        }
    };

    const handleModifySchedule = async (id: string) => {
        // For now, just a prompt to simulate rescheduling
        const newTime = prompt('Enter new schedule time (e.g., 2026-02-23T15:30:00Z)');
        if (!newTime) return;
        try {
            const newDate = new Date(newTime);
            if (isNaN(newDate.getTime())) throw new Error('Invalid date');
            await reschedulePost(id, newDate);
            fetchPosts(); // Refresh list
            setActiveMenuId(null);
        } catch (err) {
            alert('Reschedule failed: ' + (err as Error).message);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text)] tracking-tighter uppercase italic">Post <span className="grad-text">Schedule</span></h1>
                    <p className="text-[var(--text-dim)] mt-1 font-black text-xs uppercase tracking-widest">Plan and manage your brand's presence across platforms.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--bg)] font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all hover:bg-white/90 transform hover:scale-[1.05] active:scale-95 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <Plus className="w-4 h-4" />
                    New Schedule
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Calendar Side */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                    <div className="bg-[var(--bg-card)]/40 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden calendar-container">
                        <style jsx global>{`
              .calendar-container .react-calendar {
                width: 100%;
                border: none;
                background: transparent;
                color: var(--text) !important;
                font-family: inherit;
              }
              .calendar-container .react-calendar__tile--now {
                background: rgba(255, 255, 255, 0.05) !important;
                color: var(--accent-1) !important;
              }
              .calendar-container .react-calendar__tile--active {
                background: var(--accent-1) !important;
                color: var(--bg) !important;
                border-radius: 12px;
                box-shadow: 0 0 20px rgba(129, 140, 248, 0.3);
              }
              .calendar-container .react-calendar__tile {
                padding: 1rem 0.5rem;
                border-radius: 12px;
                font-weight: 700;
                font-size: 0.8rem;
                text-transform: uppercase;
                transition: all 0.2s;
              }
              .calendar-container .react-calendar__tile:enabled:hover,
              .calendar-container .react-calendar__tile:enabled:focus {
                background: rgba(255, 255, 255, 0.1) !important;
                color: var(--text) !important;
              }
              .calendar-container .react-calendar__navigation button {
                font-weight: 800;
                font-size: 0.9rem;
                text-transform: uppercase;
                color: var(--text) !important;
              }
              .calendar-container .react-calendar__navigation button:enabled:hover,
              .calendar-container .react-calendar__navigation button:enabled:focus {
                background: rgba(255, 255, 255, 0.05) !important;
              }
              .calendar-container .react-calendar__month-view__weekdays__weekday {
                color: var(--text-dim) !important;
                font-size: 0.6rem;
                font-weight: 800;
                text-transform: uppercase;
                opacity: 0.5;
              }
            `}</style>
                        <Calendar
                            onChange={(val) => setDate(val as Date)}
                            value={date}
                            className="rounded-2xl"
                            prevLabel={<ChevronLeft className="w-4 h-4" />}
                            nextLabel={<ChevronRight className="w-4 h-4" />}
                        />
                    </div>

                    <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 shadow-inner">
                        <div className="flex items-center gap-3 text-[var(--accent-1)] mb-2">
                            <Clock className="w-5 h-5" />
                            <h3 className="font-black text-[var(--text)] uppercase tracking-tight text-sm italic">Timezone</h3>
                        </div>
                        <p className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest">Asia/Kolkata (IST)</p>
                        <button className="text-[10px] text-[var(--accent-1)] font-black uppercase tracking-widest mt-2 hover:text-white transition-colors">Change Ops Center</button>
                    </div>
                </div>

                {/* Posts List Side */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-[var(--text)] tracking-tight uppercase italic">
                            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </h2>
                        <div className="text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest opacity-60">{posts.length} entries detected</div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-1)]" />
                            </div>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-[var(--bg-card)]/40 p-5 rounded-[2rem] border border-white/5 shadow-xl flex items-center justify-between group hover:border-[var(--accent-1)]/30 transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl flex items-center justify-center text-white/5 border border-white/5 group-hover:border-[var(--accent-1)]/30 group-hover:bg-white/10 transition-colors">
                                            <ImageIcon className="w-8 h-8 opacity-20 group-hover:text-[var(--accent-1)] transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-black text-[var(--text)] tracking-tight uppercase italic">{post.title}</h4>
                                                <span className={cn(
                                                    "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                                                    post.status === 'posted' ? "bg-green-400/10 text-green-400 border border-green-400/20" :
                                                        post.status === 'paused' ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" :
                                                            "bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20"
                                                )}>
                                                    {post.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">
                                                    <Clock className="w-3.5 h-3.5 text-[var(--accent-1)]" />
                                                    {new Date(post.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] opacity-60">
                                                    {post.platform}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 relative">
                                        <button
                                            onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)}
                                            className="p-2 hover:bg-white/5 rounded-xl text-[var(--text-dim)] hover:text-white transition-colors cursor-pointer"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {activeMenuId === post.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setActiveMenuId(null)}
                                                />
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] border border-white/5 rounded-xl shadow-2xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                                    <button
                                                        onClick={() => handleModifySchedule(post.id)}
                                                        className="w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-[var(--text-dim)] hover:text-white hover:bg-white/5 transition-all flex items-center gap-3"
                                                    >
                                                        Modify Schedule
                                                    </button>
                                                    {post.status !== 'posted' && (
                                                        <button
                                                            onClick={() => handleToggleStatus(post)}
                                                            className="w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-[var(--text-dim)] hover:text-white hover:bg-white/5 transition-all flex items-center gap-3"
                                                        >
                                                            {post.status === 'paused' ? 'Resume Signal' : 'Pause Signal'}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        className="w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 transition-all flex items-center gap-3"
                                                    >
                                                        Delete Node
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-24 bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10 shadow-inner">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 animate-float">
                                    <CalendarIcon className="w-8 h-8 text-white/10" />
                                </div>
                                <h3 className="text-lg font-black text-[var(--text)] uppercase tracking-tight italic">No signals on this date</h3>
                                <p className="text-[var(--text-dim)] font-black uppercase tracking-widest text-[11px] mt-2 opacity-60">Ready to initiate some generation?</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
