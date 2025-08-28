
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-interaction-engine.ts';
import '@/ai/flows/ai-dose-calculator.ts';
import '@/ai/flows/allergy-checker.ts';
import '@/ai/flows/drug-monograph-lookup.ts';
import '@/ai/flows/prescription-reader.ts';
import '@/ai/flows/voice-assistant.ts';
import '@/ai/flows/drug-food-interaction.ts';
