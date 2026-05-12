import { getServiceClient } from '../config/supabase';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export class MessagesService {
  /**
   * Get all conversations for a user (inbox list).
   * Maps to UserInboxList component.
   */
  async getConversations(userId: string) {
    const supabase = getServiceClient();

    // Get distinct conversation partners with latest message
    const { data, error } = await supabase
      .rpc('get_conversations', { current_user_id: userId });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get messages between two users.
   * Maps to UserChatBoxContent component.
   */
  async getMessages(userId: string, otherUserId: string, limit: number = 50) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:users!messages_sender_id_fkey(id, username, first_name, last_name, avatar_url)')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),` +
        `and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;

    // Mark received messages as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', userId)
      .eq('is_read', false);

    return data || [];
  }

  /**
   * Send a message.
   * This will be picked up by Supabase Realtime for live delivery.
   */
  async sendMessage(senderId: string, receiverId: string, content: string) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        is_read: false,
      })
      .select('*, sender:users!messages_sender_id_fkey(id, username, first_name, last_name, avatar_url)')
      .single();

    if (error) throw error;

    // Create activity for receiver
    await supabase.from('activities').insert({
      user_id: receiverId,
      type: 'new_message',
      description: `You have a new message`,
      highlight: '',
      icon: 'flaticon-chat-1',
      reference_id: data.id,
    });

    return data;
  }

  /**
   * Mark a message as read
   */
  async markAsRead(messageId: string, userId: string) {
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .eq('receiver_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const supabase = getServiceClient();

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Set up Supabase Realtime subscription config.
   * Returns the channel name and filter for frontend to subscribe.
   * The actual WebSocket connection happens client-side.
   */
  getRealtimeConfig(userId: string) {
    return {
      channelName: `messages:${userId}`,
      table: 'messages',
      filter: `receiver_id=eq.${userId}`,
      event: 'INSERT',
      instructions: {
        description: 'Subscribe to this channel on the frontend using Supabase Realtime',
        example: `
          const channel = supabase
            .channel('messages:${userId}')
            .on('postgres_changes', {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: 'receiver_id=eq.${userId}'
            }, (payload) => {
              // Handle new message
              console.log('New message:', payload.new);
            })
            .subscribe();
        `,
      },
    };
  }
}

export const messagesService = new MessagesService();
