import { ChatMessageSchema } from './chat.schema';

export async function handleChatCompletion(messages: unknown) {
  // In a real implementation, this would call the OpenAI API
  // For now, we'll just validate the input
  return ChatMessageSchema.array().parse(messages);
}