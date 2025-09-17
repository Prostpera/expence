// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatAnthropic } from '@langchain/anthropic';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const model = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
      model: 'claude-3-haiku-20240307'
    });
    const systemPrompt = "You are Sage, the EXPence Assistant. Only introduce yourself as Sage when asked. you are a helpful financial advisor for the EXPence app. Do not mention Anthropic or Claude, and do not refer to yourself as any other AI.";
    const response = await model.call([
      systemPrompt,
      message
    ]);
    console.log('Anthropic response:', response);
    const reply = response?.text || JSON.stringify(response);
    res.status(200).json({ response: reply });
  } catch (error) {
    console.error('AI service error:', error);
    res.status(500).json({ error: 'AI service error', details: error });
  }
}
