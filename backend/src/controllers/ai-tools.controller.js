const OpenAI = require('openai');
const { ApiError } = require('../utils/response');
const Candidate = require('../models/mongodb/candidate.model');
const Company = require('../models/mongodb/company.model');
const Job = require('../models/mongodb/job.model');
const DocumentParserService = require('../services/document-parser');

// Initialize OpenAI client lazily
let openai = null;

const getOpenAIClient = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new ApiError(500, 'OpenAI API key is not configured');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
};

class AiToolsController {
  /**
   * Analyze CV/Resume
   */
  static async analyzeCv(req, res, next) {
    try {
      const { cv_text, file_content } = req.body;
      let content = cv_text || file_content;
      
      // Check if a file was uploaded
      if (req.file) {
        try {
          const parsedFile = await DocumentParserService.parseFile(req.file);
          content = parsedFile.text;
        } catch (parseError) {
          throw new ApiError(400, `Error parsing file: ${parseError.message}`);
        }
      }
      
      if (!content) {
        throw new ApiError(400, 'CV text, file content, or file upload is required');
      }

      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert HR assistant specializing in CV analysis. Extract and structure key information from CVs/resumes."
          },
          {
            role: "user",
            content: `Analyze this CV and extract the following information in a structured format:
            - Candidate name
            - Contact information (email, phone)
            - Professional summary
            - Total years of experience
            - Skills (technical and soft skills)
            - Education (degree, institution, year)
            - Work experience (company, position, duration, key achievements)
            - Languages
            - Certifications
            
            CV Text:
            ${content}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const analysisText = completion.choices[0].message.content;
      
      // Parse the analysis into structured data
      const structuredData = AiToolsController.parseAnalysis(analysisText);

      res.status(200).json({
        success: true,
        data: {
          analysis: structuredData,
          raw_analysis: analysisText
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate job description
   */
  static async generateJobDescription(req, res, next) {
    try {
      const { position, company_name, industry, requirements, experience_level } = req.body;
      
      if (!position) {
        throw new ApiError(400, 'Position title is required');
      }

      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert HR consultant who creates compelling and comprehensive job descriptions."
          },
          {
            role: "user",
            content: `Create a detailed job description for the following position:
            
            Position: ${position}
            Company: ${company_name || 'A leading company'}
            Industry: ${industry || 'Technology'}
            Experience Level: ${experience_level || 'Mid-level'}
            ${requirements ? `Specific Requirements: ${requirements}` : ''}
            
            Include:
            1. Job Title
            2. Brief company introduction
            3. Role overview
            4. Key responsibilities (5-7 points)
            5. Required qualifications
            6. Preferred qualifications
            7. Benefits (if applicable)
            8. Skills required
            
            Make it professional, engaging, and inclusive.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      res.status(200).json({
        success: true,
        data: {
          job_description: completion.choices[0].message.content
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate interview questions
   */
  static async generateInterviewQuestions(req, res, next) {
    try {
      const { position, candidate_id, skills, experience_level, question_types } = req.body;
      
      let candidateInfo = '';
      if (candidate_id) {
        const candidate = await Candidate.findById(candidate_id);
        if (candidate) {
          candidateInfo = `Candidate: ${candidate.firstName} ${candidate.lastName}, Position: ${candidate.position}, Skills: ${candidate.skills?.join(', ')}`;
        }
      }

      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an experienced interviewer who creates thoughtful, role-specific interview questions."
          },
          {
            role: "user",
            content: `Generate interview questions for:
            
            Position: ${position || 'General'}
            ${candidateInfo}
            Experience Level: ${experience_level || 'Mid-level'}
            ${skills ? `Focus Skills: ${skills.join(', ')}` : ''}
            ${question_types ? `Question Types: ${question_types.join(', ')}` : 'Mix of technical, behavioral, and situational'}
            
            Provide:
            1. 5 Technical questions (if applicable)
            2. 5 Behavioral questions (STAR method)
            3. 3 Situational questions
            4. 2 Culture fit questions
            5. 2 Questions about career goals
            
            For each question, provide a brief note on what to look for in the answer.`
          }
        ],
        temperature: 0.6,
        max_tokens: 1200
      });

      res.status(200).json({
        success: true,
        data: {
          interview_questions: completion.choices[0].message.content
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate email template
   */
  static async generateEmail(req, res, next) {
    try {
      const { 
        recipient_type, 
        recipient_id, 
        email_purpose, 
        context, 
        tone,
        sender_name,
        sender_role 
      } = req.body;
      
      if (!email_purpose) {
        throw new ApiError(400, 'Email purpose is required');
      }

      let recipientInfo = '';
      if (recipient_type === 'candidate' && recipient_id) {
        const candidate = await Candidate.findById(recipient_id);
        if (candidate) {
          recipientInfo = `Recipient: ${candidate.firstName} ${candidate.lastName} (Candidate for ${candidate.position})`;
        }
      } else if (recipient_type === 'company' && recipient_id) {
        const company = await Company.findById(recipient_id);
        if (company) {
          recipientInfo = `Recipient: ${company.name} (${company.industry} industry)`;
        }
      }

      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional email writer who creates clear, concise, and appropriately toned business emails."
          },
          {
            role: "user",
            content: `Write a professional email for the following:
            
            ${recipientInfo}
            Purpose: ${email_purpose}
            ${context ? `Context: ${context}` : ''}
            Tone: ${tone || 'Professional and friendly'}
            
            Sender: ${sender_name || 'Hiring Manager'}
            Role: ${sender_role || 'Talent Acquisition'}
            Company: RecruitmentPlus
            
            Include:
            - Appropriate greeting
            - Clear subject line suggestion
            - Well-structured body
            - Professional closing
            - Signature block
            
            Make it personalized and engaging while maintaining professionalism.`
          }
        ],
        temperature: 0.5,
        max_tokens: 800
      });

      res.status(200).json({
        success: true,
        data: {
          email_template: completion.choices[0].message.content
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Match candidate to jobs
   */
  static async matchJobs(req, res, next) {
    try {
      const { candidate_id, cv_analysis } = req.body;
      
      if (!candidate_id && !cv_analysis) {
        throw new ApiError(400, 'Candidate ID or CV analysis is required');
      }

      let candidateInfo = cv_analysis;
      if (candidate_id) {
        const candidate = await Candidate.findById(candidate_id);
        if (candidate) {
          candidateInfo = {
            name: `${candidate.firstName} ${candidate.lastName}`,
            position: candidate.position,
            skills: candidate.skills,
            experience: candidate.experience,
            education: candidate.education
          };
        }
      }

      // Get available jobs
      const jobs = await Job.find({ status: 'active' }).limit(20);

      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert job matching specialist who analyzes candidate profiles against job requirements."
          },
          {
            role: "user",
            content: `Match this candidate to suitable jobs:
            
            Candidate Profile:
            ${JSON.stringify(candidateInfo, null, 2)}
            
            Available Jobs:
            ${jobs.map((job, index) => `
              ${index + 1}. ${job.title} at ${job.company}
              Requirements: ${job.requirements || 'Not specified'}
              Description: ${job.description?.substring(0, 200)}...
            `).join('\n')}
            
            For each matching job, provide:
            1. Match percentage (0-100%)
            2. Matching skills/qualifications
            3. Gaps or missing requirements
            4. Why this is a good/poor match
            5. Suggestions for the candidate
            
            Rank jobs by match percentage.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      res.status(200).json({
        success: true,
        data: {
          job_matches: completion.choices[0].message.content,
          total_jobs_analyzed: jobs.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * General AI chat/query
   */
  static async processQuery(req, res, next) {
    try {
      const { query, context } = req.body;
      
      if (!query) {
        throw new ApiError(400, 'Query is required');
      }

      const completion = await getOpenAIClient().chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI recruitment assistant. Help with recruitment-related queries, provide advice, and answer questions professionally."
          },
          {
            role: "user",
            content: context ? `Context: ${context}\n\nQuery: ${query}` : query
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      res.status(200).json({
        success: true,
        data: {
          response: completion.choices[0].message.content
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Helper method to parse CV analysis
   */
  static parseAnalysis(analysisText) {
    // Simple parsing logic - can be enhanced with more sophisticated parsing
    const sections = analysisText.split('\n\n');
    const result = {
      name: '',
      contact: {},
      summary: '',
      total_experience_years: 0,
      skills: [],
      education: [],
      experience: [],
      languages: [],
      certifications: []
    };

    // Extract information from the text
    sections.forEach(section => {
      const lowerSection = section.toLowerCase();
      
      if (lowerSection.includes('name:')) {
        result.name = section.split(':')[1]?.trim() || '';
      } else if (lowerSection.includes('email:') || lowerSection.includes('phone:')) {
        const lines = section.split('\n');
        lines.forEach(line => {
          if (line.toLowerCase().includes('email:')) {
            result.contact.email = line.split(':')[1]?.trim() || '';
          }
          if (line.toLowerCase().includes('phone:')) {
            result.contact.phone = line.split(':')[1]?.trim() || '';
          }
        });
      } else if (lowerSection.includes('summary') || lowerSection.includes('objective')) {
        result.summary = section.split(':').slice(1).join(':').trim();
      } else if (lowerSection.includes('skills')) {
        const skillsText = section.split(':').slice(1).join(':');
        result.skills = skillsText.split(',').map(s => s.trim()).filter(s => s);
      }
      // Add more parsing logic as needed
    });

    return result;
  }
}

module.exports = AiToolsController;