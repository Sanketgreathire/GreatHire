import 'dotenv/config';
import { generateInterviewQuestions } from './services/interview.service.js';

const job = {
  jobDetails: {
    title: 'Software Engineer',
    details: 'Work on backend services, APIs, and data processing.',
    skills: ['Node.js', 'SQL', 'REST'],
    experience: '2+ years'
  }
};

const resumeText = `Experienced backend developer with Node.js, SQL, and building REST APIs. Worked on data pipelines and small ML integrations.`;

(async () => {
  try {
    const script = await generateInterviewQuestions(job, resumeText);
    console.log('--- AI SCRIPT START ---');
    console.log(script);
    console.log('--- AI SCRIPT END ---');
  } catch (err) {
    console.error('AI call failed:', err);
    process.exit(1);
  }
})();
