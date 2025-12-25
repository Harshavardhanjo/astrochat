export type SenderType = 'user' | 'ai_astrologer' | 'human_astrologer' | 'system';
export type MessageType = 'text' | 'ai' | 'human' | 'event' | 'image';

export interface Message {
  id: string;
  sender: SenderType;
  text: string;
  timestamp: number;
  type: MessageType;
  hasFeedback?: boolean;
  feedbackType?: 'liked' | 'disliked';
  replyTo?: string;
  reactions?: string[]; // Array of emoji strings, e.g. ["🙏", "✨"]
}
