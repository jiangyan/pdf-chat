import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, fileBase64, isFirstMessage } = await req.json();

    // Format the messages for Claude's API
    const formattedMessages = messages.map((msg: { role: string; content: string; }, index: number) => ({
      role: msg.role,
      content: msg.role === 'user' && index === messages.length - 1 && isFirstMessage ? [
        {
          type: 'document',
          source: {
            media_type: 'application/pdf',
            type: 'base64',
            data: fileBase64,
          },
        },
        {
          type: 'text',
          text: msg.content,
        },
      ] : [
        {
          type: 'text',
          text: msg.content,
        },
      ],
    }));

    const response = await anthropic.beta.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      betas: ["pdfs-2024-09-25"],
      messages: formattedMessages,
    });

    return NextResponse.json({ 
      response: response.content[0].type === 'text' ? response.content[0].text : '' 
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'There was an error processing your request' },
      { status: 500 }
    );
  }
} 