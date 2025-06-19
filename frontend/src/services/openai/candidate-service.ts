// src/services/openai/candidate-service.ts
import { Candidate } from '@/types';
import { aiToolsService } from '../api/ai-tools-service';

export const candidateService = {
  // Generate candidate feedback
  generateCandidateFeedback: async (candidate: Candidate) => {
    try {
      // Create context about the candidate
      const context = `Candidate: ${candidate.firstName} ${candidate.lastName}, Position: ${candidate.position}, ` +
                     `Skills: ${candidate.skills?.join(', ') || 'Not specified'}, ` +
                     `Experience: ${candidate.experience || 'Not specified'}`;
      
      const query = `Generate constructive feedback for this candidate including:
        1. Strengths based on their position and profile
        2. Areas for potential improvement
        3. Suggestions for career development
        4. Overall assessment
        
        Make the feedback professional, constructive, and actionable.`;
      
      const result = await aiToolsService.processQuery(query, context);
      return result.response;
    } catch (error) {
      console.error('Error generating candidate feedback:', error);
      throw error;
    }
  }
};

export default candidateService;