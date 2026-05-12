import { Response } from 'express';
import { messagesService } from '../services/messages.service';
import { sendSuccess, sendCreated, Errors } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class MessagesController {
  async getConversations(req: AuthenticatedRequest, res: Response) {
    try {
      const conversations = await messagesService.getConversations(req.user!.id);
      sendSuccess(res, conversations);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch conversations');
    }
  }

  async getMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const messages = await messagesService.getMessages(req.user!.id, req.params.userId, limit);
      sendSuccess(res, messages);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch messages');
    }
  }

  async sendMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const { receiver_id, content } = req.body;
      const message = await messagesService.sendMessage(req.user!.id, receiver_id, content);
      sendCreated(res, message);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to send message');
    }
  }

  async markAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const message = await messagesService.markAsRead(req.params.id, req.user!.id);
      sendSuccess(res, message);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to mark message as read');
    }
  }

  async getUnreadCount(req: AuthenticatedRequest, res: Response) {
    try {
      const count = await messagesService.getUnreadCount(req.user!.id);
      sendSuccess(res, { unread_count: count });
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to get unread count');
    }
  }

  async getRealtimeConfig(req: AuthenticatedRequest, res: Response) {
    try {
      const config = messagesService.getRealtimeConfig(req.user!.id);
      sendSuccess(res, config);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to get realtime config');
    }
  }
}

export const messagesController = new MessagesController();
