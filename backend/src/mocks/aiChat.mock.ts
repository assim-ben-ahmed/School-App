import { config } from '../config/app.config';
import { logger } from '../utils/logger';
import { simulateDelay } from './testData';

/**
 * Mock AI Chat Service
 * Simulates OpenAI API responses for testing without API key
 */

const MOCK_AI_RESPONSES: Record<string, string[]> = {
    campus: [
        "The library is located in the main building, open from 8 AM to 10 PM daily. You can access it from the east entrance.",
        "Building A houses the Computer Science department on floors 2-4. The AI lab is on the 3rd floor, room 301.",
        "The cafeteria serves lunch from 11:30 AM to 2:30 PM. They have vegetarian and vegan options available daily.",
        "The gym is open to all students with a valid ID. Hours are 6 AM to 10 PM on weekdays, 8 AM to 8 PM on weekends.",
        "You can find study rooms on the 2nd floor of the library. Book them online through the student portal.",
    ],

    email: [
        "Here's a professional email template:\n\nDear Professor [Name],\n\nI hope this email finds you well. I am writing to [state your purpose clearly].\n\n[Main content - be concise and specific]\n\nThank you for your time and consideration.\n\nBest regards,\n[Your name]\n[Student ID]",
        "When emailing professors, always use a clear subject line, formal greeting, and professional tone. Keep it concise and proofread before sending.",
        "For internship applications, highlight your relevant skills and coursework. Attach your resume and mention specific projects that align with the position.",
    ],

    wellness: [
        "It's great that you're taking care of your mental health! Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. Repeat 3-4 times.",
        "Remember to take regular breaks while studying. The Pomodoro Technique (25 min work, 5 min break) can help maintain focus and reduce stress.",
        "Physical activity is great for mental health. Even a 10-minute walk can boost your mood and energy levels.",
        "If you're feeling overwhelmed, please reach out to the campus counseling center. They offer free, confidential support. Remember, I'm an AI and not a replacement for professional help.",
    ],

    interview: [
        "Great question! Use the STAR method: Situation (context), Task (your responsibility), Action (what you did), Result (outcome). This structure helps you give complete, compelling answers.",
        "For 'Tell me about yourself,' focus on your academic background, relevant projects, skills, and career goals. Keep it to 2-3 minutes and tailor it to the role.",
        "When asked about weaknesses, choose a real weakness but show how you're working to improve it. For example: 'I used to struggle with public speaking, so I joined Toastmasters and now regularly present in class.'",
    ],

    study: [
        "Active recall is one of the most effective study techniques. Instead of re-reading notes, try to recall information from memory, then check your accuracy.",
        "Spaced repetition helps with long-term retention. Review material after 1 day, then 3 days, then 1 week, then 2 weeks.",
        "When studying algorithms, don't just memorize - understand the 'why' behind each step. Try explaining the algorithm to someone else or write it out in pseudocode.",
        "For math and coding problems, practice is key. Do problems without looking at solutions first. Struggle is part of learning!",
    ],

    career: [
        "Start building your professional network now! Attend career fairs, join LinkedIn, and connect with alumni in your field of interest.",
        "For tech internships, focus on building a strong GitHub portfolio. Contribute to open source, create personal projects, and document your code well.",
        "Your resume should highlight projects, not just coursework. Include specific technologies used, problems solved, and measurable results.",
        "Research the company before interviews. Understand their products, culture, and recent news. Prepare thoughtful questions to ask the interviewer.",
    ],
};

export class MockAIChatService {
    async chat(botType: string, message: string): Promise<string> {
        logger.info(`[MOCK] AI Chat - Bot: ${botType}, Message: ${message.substring(0, 50)}...`);

        // Simulate API delay
        await simulateDelay(config.mockDelay + 500); // AI responses take a bit longer

        // Get responses for this bot type
        const responses = MOCK_AI_RESPONSES[botType] || MOCK_AI_RESPONSES.campus;

        // Simple keyword-based response selection
        const lowerMessage = message.toLowerCase();

        // Context-aware responses
        if (lowerMessage.includes('library') || lowerMessage.includes('book')) {
            return responses[0];
        }
        if (lowerMessage.includes('building') || lowerMessage.includes('room') || lowerMessage.includes('where')) {
            return responses[1];
        }
        if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('overwhelmed')) {
            return MOCK_AI_RESPONSES.wellness[3];
        }
        if (lowerMessage.includes('email') || lowerMessage.includes('write') || lowerMessage.includes('professor')) {
            return MOCK_AI_RESPONSES.email[0];
        }
        if (lowerMessage.includes('interview') || lowerMessage.includes('star')) {
            return MOCK_AI_RESPONSES.interview[0];
        }
        if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('exam')) {
            return MOCK_AI_RESPONSES.study[0];
        }

        // Random response from bot's pool
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }
}

export const mockAIChatService = new MockAIChatService();
