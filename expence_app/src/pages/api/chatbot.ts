// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage } from '@langchain/core/messages';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  const modelName = 'claude-sonnet-4-20250514';

  try {
    const model = new ChatAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY!,
        model: modelName
    });

    // LangChain's .call() method expects a list of messages
    const response = await model.invoke([new HumanMessage({ content: message })]);

    console.log('Anthropic response:', response);
    const reply = response.content;

    res.status(200).json({ response: reply });
  } catch (error: any) {
    console.error('AI service error:', error);
    res.status(500).json({ 
        error: 'AI service error', 
        details: error.message || 'An unknown error occurred' 
    });
  }
}
