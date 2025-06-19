const express = require('express');
const router = express.Router();
const AiToolsController = require('../../controllers/ai-tools.controller');
const { authMiddleware, roleMiddleware } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

// ============== AI TOOLS ==============

/**
 * @route POST /api/v1/ai-tools/analyze-cv
 * @desc Analyze CV using AI
 * @access Private
 */
router.post('/analyze-cv', 
    authMiddleware,
    upload.single('file'), // Add file upload middleware
    AiToolsController.analyzeCv
);

/**
 * @route POST /api/v1/ai-tools/generate-job-description
 * @desc Generate job description using AI
 * @access Private
 */
router.post('/generate-job-description', 
    authMiddleware, 
    AiToolsController.generateJobDescription
);

/**
 * @route POST /api/v1/ai-tools/generate-interview-questions
 * @desc Generate interview questions using AI
 * @access Private
 */
router.post('/generate-interview-questions', 
    authMiddleware, 
    AiToolsController.generateInterviewQuestions
);

/**
 * @route POST /api/v1/ai-tools/generate-email
 * @desc Generate email template using AI
 * @access Private
 */
router.post('/generate-email', 
    authMiddleware, 
    AiToolsController.generateEmail
);

/**
 * @route POST /api/v1/ai-tools/match-jobs
 * @desc Match candidate to jobs using AI
 * @access Private
 */
router.post('/match-jobs', 
    authMiddleware, 
    AiToolsController.matchJobs
);

/**
 * @route POST /api/v1/ai-tools/process-query
 * @desc Process general AI query
 * @access Private
 */
router.post('/process-query', 
    authMiddleware, 
    AiToolsController.processQuery
);

module.exports = router;