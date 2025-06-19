// src/services/openai/interview-service.ts
import { aiToolsService } from '../api/ai-tools-service';

export const interviewService = {
  // Generate position interview questions
  generatePositionInterviewQuestions: async (
    position: string,
    companyName?: string,
    candidateContext?: string
  ) => {
    try {
      // Extract candidate ID if provided in context
      let candidateId: string | undefined;
      if (candidateContext && candidateContext.includes('id:')) {
        const idMatch = candidateContext.match(/id:\s*(\w+)/);
        candidateId = idMatch ? idMatch[1] : undefined;
      }
      
      const result = await aiToolsService.generateInterviewQuestions(
        position,
        candidateId,
        undefined, // skills
        'Mid-level', // default experience level
        ['technical', 'behavioral', 'situational'] // question types
      );
      
      return result.interview_questions;
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw error;
    }
  }
};

export default interviewService;