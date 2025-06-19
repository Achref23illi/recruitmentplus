// src/services/openai/job-service.ts
import { aiToolsService } from '../api/ai-tools-service';

export const jobService = {
  // Generate job description
  generateJobDescriptionService: async (
    position: string,
    companyName: string,
    industry?: string
  ) => {
    try {
      const result = await aiToolsService.generateJobDescription(
        position,
        companyName,
        industry,
        undefined, // requirements
        'Mid-level' // default experience level
      );
      return result.job_description;
    } catch (error) {
      console.error('Error generating job description:', error);
      throw error;
    }
  }
};

export default jobService;