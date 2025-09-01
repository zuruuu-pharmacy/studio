
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-interaction-engine.ts';
import '@/ai/flows/ai-dose-calculator.ts';
import '@/ai/flows/allergy-checker.ts';
import '@/ai/flows/drug-monograph-lookup.ts';
import '@/ai/flows/prescription-reader.ts';
import '@/ai/flows/drug-food-interaction.ts';
import '@/ai/flows/lab-report-analyzer.ts';
import '@/ai/flows/adherence-reporter.ts';
import '@/ai/flows/symptom-checker.ts';
import '@/ai/flows/lifestyle-suggester.ts';
import '@/ai/flows/refill-manager.ts';
import '@/ai/tools/healthcare-finder.ts';
import '@/ai/tools/pharmacy-finder.ts';
