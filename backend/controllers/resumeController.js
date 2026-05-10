const openaiService = require('../services/openaiService');
const dbService = require('../services/dbService');
const { v4: uuidv4 } = require('uuid');

exports.generateResume = async (req, res, next) => {
  try {
    const userInput = req.body;
    const { jobTitle } = userInput;

    if (!jobTitle) {
      return res.status(400).json({ success: false, message: 'Job Title is required' });
    }

    // Step 1: Generate ATS keywords
    let keywords = [];
    try {
      keywords = await openaiService.generateKeywords(jobTitle);
    } catch (error) {
      console.warn('Failed to generate keywords, proceeding without them', error.message);
    }

    // Step 2: Generate initial resume
    let currentResume = await openaiService.generateResume(userInput, keywords);
    
    // Step 3 & 4: Score and improve loop (max 3 times)
    let bestScoreData = null;
    let bestResume = currentResume;
    const maxIterations = 3;
    
    for (let i = 0; i < maxIterations; i++) {
      const scoreData = await openaiService.scoreResume(currentResume, keywords);
      
      // Update best if better or first iteration
      if (!bestScoreData || scoreData.score > bestScoreData.score) {
        bestScoreData = scoreData;
        bestResume = currentResume;
      }
      
      if (scoreData.score >= 90) {
        break; // Excellent score, stop loop
      }
      
      if (i < maxIterations - 1) {
        // Prepare for next iteration
        currentResume = await openaiService.improveResume(currentResume, scoreData.score, scoreData.suggestions, keywords);
      }
    }

    const result = {
      id: uuidv4(),
      userInput,
      resume: bestResume,
      atsScore: bestScoreData.score,
      missingKeywords: bestScoreData.missing,
      suggestions: bestScoreData.suggestions,
      createdAt: new Date().toISOString()
    };

    // Save to Database
    dbService.saveResume(result);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error generating resume:', error);
    next(error);
  }
};

exports.getHistory = (req, res, next) => {
  try {
    const resumes = dbService.getAllResumes();
    return res.status(200).json({
      success: true,
      data: resumes
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    next(error);
  }
};
