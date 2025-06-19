// src/services/openai/resume-service.ts
import { aiToolsService } from '../api/ai-tools-service';

export const resumeService = {
  // CV File Analysis
  analyzeCvFile: async (file: File, onUploadProgress?: (progressEvent: any) => void) => {
    try {
      return await aiToolsService.analyzeCvFile(file, onUploadProgress);
    } catch (error) {
      console.error('Backend file analysis failed:', error);
      throw error;
    }
  },

  // CV Analysis
  analyzeCv: async (cvText: string) => {
    try {
      const result = await aiToolsService.analyzeCv(cvText);
      return result.analysis || result;
    } catch (error) {
      console.error('Error analyzing CV:', error);
      throw error;
    }
  },

  // CV Analysis with Job Matching
  analyzeCvWithJobMatch: async (cvText: string) => {
    try {
      // First analyze the CV
      const cvAnalysis = await resumeService.analyzeCv(cvText);
      
      // Then get job matches
      const matchResult = await aiToolsService.matchJobs(undefined, cvAnalysis);
      
      return {
        cv_analysis: cvAnalysis,
        job_matches: matchResult.job_matches,
        total_jobs_analyzed: matchResult.total_jobs_analyzed
      };
    } catch (error) {
      console.error('Error analyzing CV with job matching:', error);
      throw error;
    }
  }
};

export default resumeService;