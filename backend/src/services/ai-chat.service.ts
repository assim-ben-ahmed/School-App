import OpenAI from 'openai';
import prisma from '../database/prisma';
import { config } from '../config/app.config';
import { ValidationError } from '../utils/errors';
import { mockAIChatService } from '../mocks/aiChat.mock';

const openai = config.mockMode ? null : new OpenAI({
    apiKey: config.openai.apiKey,
});

const BOT_SYSTEM_PROMPTS = {
    campus: "You are a helpful campus guide for Aivancity University. Help students navigate the campus, find classrooms, learn about facilities, and answer questions about campus services. Be friendly and concise.",

    email: "You are a professional email writing assistant. Help students draft formal emails to professors, employers, and administrators. Provide templates, improve writing, and ensure professional tone. Keep responses structured and actionable.",

    wellness: "You are a supportive mental health and wellness companion. Provide stress management tips, mindfulness exercises, and emotional support. ALWAYS remind users that you're not a replacement for professional mental health services. Be empathetic and encouraging.",

    interview: "You are an interview coach helping students prepare for job interviews. Use the STAR method (Situation, Task, Action, Result) to help them structure answers. Provide feedback on common interview questions and offer practice scenarios.",

    study: "You are a study buddy helping students with homework, explaining concepts, and suggesting effective study techniques. Use the Pomodoro Technique, active recall, and spaced repetition. Be encouraging and break down complex topics.",

    career: "You are a career advisor helping students explore career paths, find internships, build resumes, and develop professionally. Provide actionable advice on networking, job searching, and skill development.",
};

export class AIChatService {
    async createSession(userId: string, botType: string) {
        const validBotTypes = ['campus', 'email', 'wellness', 'interview', 'study', 'career'];

        if (!validBotTypes.includes(botType)) {
            throw new ValidationError('Invalid bot type');
        }

        const session = await prisma.aIChatSession.create({
            data: {
                userId,
                botType,
            },
        });

        // Create welcome message
        const welcomeMessage = await this.sendMessage(session.id, 'assistant', this.getWelcomeMessage(botType));

        return {
            session,
            welcomeMessage,
        };
    }

    async sendMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
        const message = await prisma.aIChatMessage.create({
            data: {
                sessionId,
                role,
                content,
            },
        });

        return message;
    }

    async chat(sessionId: string, userMessage: string) {
        // Get session
        const session = await prisma.aIChatSession.findUnique({
            where: { id: sessionId },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 10, // Last 10 messages for context
                },
            },
        });

        if (!session) {
            throw new ValidationError('Session not found');
        }

        // Save user message
        await this.sendMessage(sessionId, 'user', userMessage);

        let aiResponse: string;

        // Use mock or real AI
        if (config.mockMode) {
            aiResponse = await mockAIChatService.chat(session.botType, userMessage);
        } else {
            // Prepare messages for OpenAI
            const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
                {
                    role: 'system',
                    content: BOT_SYSTEM_PROMPTS[session.botType as keyof typeof BOT_SYSTEM_PROMPTS],
                },
                ...session.messages.reverse().map((msg) => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })),
                {
                    role: 'user',
                    content: userMessage,
                },
            ];

            // Get AI response
            const completion = await openai!.chat.completions.create({
                model: config.openai.model,
                messages,
                max_tokens: config.openai.maxTokens,
                temperature: 0.7,
            });

            aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
        }

        // Save AI response
        const responseMessage = await this.sendMessage(sessionId, 'assistant', aiResponse);

        return responseMessage;
    }

    async getChatHistory(sessionId: string) {
        const messages = await prisma.aIChatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        });

        return messages;
    }

    async getUserSessions(userId: string) {
        const sessions = await prisma.aIChatSession.findMany({
            where: { userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // Get last message for preview
                },
            },
            orderBy: { startedAt: 'desc' },
        });

        return sessions;
    }

    private getWelcomeMessage(botType: string): string {
        const welcomeMessages: Record<string, string> = {
            campus: "Hi! I'm your Campus Assistant. I can help you navigate the campus, find classrooms, and answer questions about campus facilities. What would you like to know?",
            email: "Hello! I'm your Email Assistant. I can help you draft professional emails, improve your writing, and manage correspondence. Would you like help writing an email, or do you have a draft you'd like me to review?",
            wellness: "Welcome! I'm here to support your mental health and wellbeing. Remember, I'm an AI assistant and not a replacement for professional help. I can offer stress management tips, mindfulness exercises, and general wellness advice. How are you feeling today?",
            interview: "Hi! I'm your Interview Instructor. I can help you prepare for job interviews, practice common questions, and provide feedback on your responses. Would you like to practice a specific type of interview, or shall we start with common questions?",
            study: "Hey there! I'm your Study Buddy. I can help you with homework, explain difficult concepts, suggest study techniques, and keep you motivated. What subject or topic would you like help with today?",
            career: "Hello! I'm your Career Advisor. I can help you explore career paths, find internships, build your resume, and plan your professional development. What aspect of your career would you like to discuss?",
        };

        return welcomeMessages[botType] || "Hello! How can I help you today?";
    }
}

export const aiChatService = new AIChatService();
