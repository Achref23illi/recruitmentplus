// src/services/api/ai-tools-service.ts
import apiClient from './axios-client';
import { 
  CVAnalysisResponse, 
  JobMatchResponseItem, 
  EmailGenerationResponse,
  InterviewQuestionItem,
  JobDescriptionResponse,
  ChatCompletionResponse,
  EmailTemplateInfo 
} from './types';

// AI Tools Service - Updated to match backend endpoints
export const aiToolsService = {
  // CV Analysis
  analyzeCv: async (cvText: string): Promise<CVAnalysisResponse> => {
    try {
      const response = await apiClient.post('/ai-tools/analyze-cv', { cv_text: cvText });
      // Backend returns { analysis: ..., raw_analysis: ... }
      return response;
    } catch (error) {
      console.error('Error analyzing CV:', error);
      throw error;
    }
  },

  // Job Matching
  matchJobs: async (candidateId?: string, cvAnalysis?: any): Promise<{job_matches: string, total_jobs_analyzed: number}> => {
    try {
      const response = await apiClient.post('/ai-tools/match-jobs', {
        candidate_id: candidateId,
        cv_analysis: cvAnalysis
      });
      return response.data;
    } catch (error) {
      console.error('Error matching jobs:', error);
      throw error;
    }
  },

  // Email Generation - Updated to match backend
  generateEmail: async (
    recipientType: 'candidate' | 'company',
    recipientId: string,
    emailPurpose: string,
    context?: string,
    tone?: string,
    senderName?: string,
    senderRole?: string
  ): Promise<{email_template: string}> => {
    try {
      const response = await apiClient.post('/ai-tools/generate-email', {
        recipient_type: recipientType,
        recipient_id: recipientId,
        email_purpose: emailPurpose,
        context,
        tone,
        sender_name: senderName,
        sender_role: senderRole
      });
      return response.data;
    } catch (error) {
      console.error('Error generating email:', error);
      throw error;
    }
  },

  // Interview Questions Generation - Updated to match backend
  generateInterviewQuestions: async (
    position?: string,
    candidateId?: string,
    skills?: string[],
    experienceLevel?: string,
    questionTypes?: string[]
  ): Promise<{interview_questions: string}> => {
    try {
      const response = await apiClient.post('/ai-tools/generate-interview-questions', {
        position,
        candidate_id: candidateId,
        skills,
        experience_level: experienceLevel,
        question_types: questionTypes
      });
      return response.data;
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw error;
    }
  },

  // Job Description Generation - Updated to match backend
  generateJobDescription: async (
    position: string,
    companyName?: string,
    industry?: string,
    requirements?: string,
    experienceLevel?: string
  ): Promise<{job_description: string}> => {
    try {
      const response = await apiClient.post('/ai-tools/generate-job-description', {
        position,
        company_name: companyName,
        industry,
        requirements,
        experience_level: experienceLevel
      });
      return response.data;
    } catch (error) {
      console.error('Error generating job description:', error);
      throw error;
    }
  },

  // Process General Query - Updated to match backend
  processQuery: async (query: string, context?: string): Promise<{response: string}> => {
    try {
      const response = await apiClient.post('/ai-tools/process-query', {
        query,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  },

  // Helper methods for compatibility with frontend
  processGeneralQuery: async (query: string, context?: string): Promise<string> => {
    const result = await aiToolsService.processQuery(query, context);
    return result.response;
  },

  // CV File Analysis - Updated for file upload
  analyzeCvFile: async (
    file: File, 
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<CVAnalysisResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/ai-tools/analyze-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onUploadProgress
      });
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing CV file:', error);
      throw error;
    }
  }
};

export default aiToolsService;