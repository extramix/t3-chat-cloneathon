import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export { openrouter, openai, anthropic };