// src/services/openai/email-service.ts
import { Candidate, Company } from '@/types';
import { aiToolsService } from '../api/ai-tools-service';
import { useAuthStore } from '@/store/useAuthStore';

export const emailService = {
  // Generate email for candidates
  generateCandidateEmail: async (
    candidate: Candidate,
    purpose: string,
    additionalContext?: string
  ) => {
    try {
      const user = useAuthStore.getState().user;
      const result = await aiToolsService.generateEmail(
        'candidate',
        candidate.id,
        purpose,
        additionalContext,
        'Professional and friendly',
        user?.name || 'Hiring Manager',
        user?.role || 'Talent Acquisition'
      );
      return result.email_template;
    } catch (error) {
      console.error('Error generating candidate email:', error);
      throw error;
    }
  },

  // Generate email for companies
  generateCompanyEmail: async (
    company: Company,
    purpose: string,
    additionalContext?: string
  ) => {
    try {
      const user = useAuthStore.getState().user;
      const result = await aiToolsService.generateEmail(
        'company',
        company.id,
        purpose,
        additionalContext,
        'Professional',
        user?.name || 'Hiring Manager',
        user?.role || 'Talent Acquisition'
      );
      return result.email_template;
    } catch (error) {
      console.error('Error generating company email:', error);
      throw error;
    }
  }
};

export default emailService;