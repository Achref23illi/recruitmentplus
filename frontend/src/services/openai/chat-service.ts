// src/services/openai/chat-service.ts
import { aiToolsService } from '../api/ai-tools-service';

export const chatService = {
  // Process general query
  processGeneralQuery: async (query: string, context?: string) : Promise<string> => {
    try {
      return await aiToolsService.processGeneralQuery(query, context);
    } catch (error) {
      console.error('Error processing general query:', error);
      throw error;
    }
  }
};

export default chatService;