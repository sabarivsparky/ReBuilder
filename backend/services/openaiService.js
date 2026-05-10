const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

// Create default export for when not configured
const mockOpenai = {
  generateKeywords: async () => ['leadership', 'agile', 'javascript', 'react', 'api design'],
  generateResume: async (input) => `Mock Resume for ${input.fullName || 'User'}`,
  scoreResume: async () => ({ score: 85, missing: ['cloud'], suggestions: ['Add cloud skills'] }),
  improveResume: async (res) => res,
};

let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (error) {
  console.warn("OpenAI API Key not missing or valid. Using mock service.");
}

const parseJsonResponse = (content) => {
  try {
    // Attempt to extract JSON from markdown if explicitly formatted that way
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      return JSON.parse(match[1].trim());
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to parse JSON response:", content);
    throw new Error("Invalid output format from AI");
  }
};

exports.generateKeywords = async (jobTitle) => {
  if (!openai) return mockOpenai.generateKeywords();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an HR expert. Return a JSON array of 15-20 crucial ATS keywords for the given job title. Only return the JSON array.' },
      { role: 'user', content: `Job Title: ${jobTitle}` }
    ],
    response_format: { type: "json_object" }
  });

  // Since response_format json_object requires an object, we should wrap the prompt requirement
  const responseGpt4 = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an HR expert. Return a JSON object with a single property "keywords" containing an array of 15-20 crucial ATS keywords for the given job title.' },
        { role: 'user', content: `Job Title: ${jobTitle}` }
      ],
      response_format: { type: "json_object" }
  });
    
  return JSON.parse(responseGpt4.choices[0].message.content).keywords;
};

exports.generateResume = async (userInput, keywords) => {
  if (!openai) return mockOpenai.generateResume(userInput);

  const prompt = `
Generate a professional, ATS-optimized resume in clean HTML format based on the following user input.
Ensure you use standard sections (Header, Summary, Experience, Education, Skills, Projects).
Do NOT include any external CSS or complex layouts. Use basic HTML tags (h1, h2, h3, p, ul, li, strong).
Do NOT hallucinate information not provided by the user. Expand the work experience bullet points to be action-oriented and impactful if they are brief, but strictly based on the provided facts.

Integrate these ATS keywords naturally if they align with the user's skills and experience: ${keywords.join(', ')}

User Details:
${JSON.stringify(userInput, null, 2)}

Only output the HTML code without markdown wrapping fences.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an expert resume writer and recruiter.' },
      { role: 'user', content: prompt }
    ],
  });

  let html = response.choices[0].message.content;
  if(html.startsWith('\`\`\`html')) {
    html = html.replace(/\`\`\`html\n/, '').replace(/\n\`\`\`$/, '');
  }
  return html.trim();
};

exports.scoreResume = async (resumeHtml, keywords) => {
  if (!openai) return mockOpenai.scoreResume();

  const prompt = `
You are an advanced ATS (Applicant Tracking System). Evaluate this resume against the target keywords.
Target Keywords: ${keywords.join(', ')}

Resume:
${resumeHtml}

Return a JSON object strictly in this format:
{
  "score": <number 0-100 indicating ATS match and professional quality>,
  "missing": <array of strings, target keywords missing from the resume>,
  "suggestions": <array of strings, 3 actionable tips to improve the resume>
}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an ATS scorer.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

exports.improveResume = async (resumeHtml, currentScore, suggestions, keywords) => {
  if (!openai) return mockOpenai.improveResume(resumeHtml);

  const prompt = `
You are an expert resume optimizer.
Current ATS Score: ${currentScore}
Improvement Suggestions: ${suggestions.join('; ')}
Target Keywords to incorporate: ${keywords.join(', ')}

Here is the current HTML resume:
${resumeHtml}

Rewrite the HTML resume to address the suggestions naturally, improve impact, and better incorporate missing keywords without sounding forced.
Only output the HTML code.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an expert resume optimzer.' },
      { role: 'user', content: prompt }
    ],
  });
  
  let html = response.choices[0].message.content;
  if(html.startsWith('\`\`\`html')) {
    html = html.replace(/\`\`\`html\n/, '').replace(/\n\`\`\`$/, '');
  }
  return html.trim();
};
