import { supabase } from './supabase';

/**
 * Professional Credit Management Library
 */

export async function getCredits(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data.credits;
}

export async function deductCredits(userId: string, amount: number) {
    const currentCredits = await getCredits(userId);

    if (currentCredits < amount) {
        throw new Error('Insufficient credits');
    }

    const { data, error } = await supabase
        .from('profiles')
        .update({ credits: currentCredits - amount })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data.credits;
}

export async function addCredits(userId: string, amount: number) {
    const currentCredits = await getCredits(userId);

    const { data, error } = await supabase
        .from('profiles')
        .update({ credits: currentCredits + amount })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data.credits;
}

/**
 * n8n Integration Logic
 */

export async function triggerN8NWorkflow(webhookUrl: string, payload: any) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`n8n workflow failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Workflow error:', error);
        throw error;
    }
}
/**
 * Schedule Management Logic
 */

export async function deleteScheduledPost(postId: string) {
    const { error } = await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', postId);

    if (error) throw error;
    return true;
}

export async function updateScheduledPostStatus(postId: string, status: string) {
    const { data, error } = await supabase
        .from('scheduled_posts')
        .update({ status })
        .eq('id', postId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function reschedulePost(postId: string, newDate: Date) {
    const { data, error } = await supabase
        .from('scheduled_posts')
        .update({ scheduled_at: newDate.toISOString() })
        .eq('id', postId)
        .select()
        .single();

    if (error) throw error;
    return data;
}
