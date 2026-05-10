const Database = require('better-sqlite3');
const path = require('path');

let db;

exports.initDb = () => {
  db = new Database(path.join(__dirname, '../resumes.db'));
  db.pragma('journal_mode = WAL');
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_input TEXT NOT NULL,
      resume_html TEXT NOT NULL,
      ats_score INTEGER NOT NULL,
      missing_keywords TEXT,
      suggestions TEXT,
      created_at TEXT NOT NULL
    )
  `);
};

exports.saveResume = (data) => {
  const stmt = db.prepare(`
    INSERT INTO resumes (
      id, user_input, resume_html, ats_score, missing_keywords, suggestions, created_at
    ) VALUES (
      @id, @userInput, @resumeHtml, @atsScore, @missingKeywords, @suggestions, @createdAt
    )
  `);
  
  stmt.run({
    id: data.id,
    userInput: JSON.stringify(data.userInput),
    resumeHtml: data.resume,
    atsScore: data.atsScore,
    missingKeywords: JSON.stringify(data.missingKeywords),
    suggestions: JSON.stringify(data.suggestions),
    createdAt: data.createdAt
  });
};

exports.getAllResumes = () => {
  const stmt = db.prepare('SELECT * FROM resumes ORDER BY created_at DESC');
  const rows = stmt.all();
  
  // Parse JSON fields back to objects for the frontend
  return rows.map(row => ({
    id: row.id,
    userInput: JSON.parse(row.user_input),
    resume: row.resume_html,
    atsScore: row.ats_score,
    missingKeywords: JSON.parse(row.missing_keywords || '[]'),
    suggestions: JSON.parse(row.suggestions || '[]'),
    createdAt: row.created_at
  }));
};
