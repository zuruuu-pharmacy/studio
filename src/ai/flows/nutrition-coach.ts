
'use server';
/**
 * @fileOverview AI-powered nutrition coach that generates a personalized diet plan
 *               based on a detailed, interactive questionnaire.
 *
 * - generateCoachedDietPlan - Generates a diet plan from questionnaire data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the detailed input schema based on the questionnaire
const NutritionCoachInputSchema = z.object({
  profile: z.object({
    age: z.coerce.number().optional(),
    gender: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    occupation: z.string().optional(),
    activity_level: z.string().optional(),
    sleep_pattern: z.string().optional(),
    stress_level: z.string().optional(),
  }),
  medical_history: z.object({
    chronic_diseases: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    recent_surgeries: z.string().optional(),
    family_history: z.array(z.string()).optional(),
  }),
  current_diet: z.object({
    meal_pattern: z.string().optional(),
    skips_meals: z.boolean().optional(),
    water_intake: z.string().optional(),
    other_drinks: z.array(z.string()).optional(),
    processed_food_intake: z.string().optional(),
    cooking_habit: z.string().optional(),
  }),
  preferences: z.object({
    diet_type: z.array(z.string()).optional(),
    favorite_foods: z.string().optional(),
    disliked_foods: z.string().optional(),
    fasting_practices: z.string().optional(),
  }),
  goals: z.object({
    primary_goal: z.string().optional(),
    timeline: z.string().optional(),
    motivation_level: z.string().optional(),
    budget: z.string().optional(),
    open_to_lifestyle_changes: z.boolean().optional(),
  }),
});

export type NutritionCoachInput = z.infer<typeof NutritionCoachInputSchema>;

// Define the detailed output schema as requested
const NutritionCoachOutputSchema = z.object({
  patient_id: z.string().optional(),
  profile: z.object({
    age: z.number().optional(),
    gender: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    occupation: z.string().optional(),
    activity_level: z.string().optional(),
    sleep: z.string().optional(),
    stress: z.string().optional(),
  }),
  medical_history: z.object({
    chronic_diseases: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    family_history: z.array(z.string()).optional(),
  }),
  current_diet: z.object({
    meal_pattern: z.string().optional(),
    water_intake: z.string().optional(),
    processed_food: z.string().optional(),
    caffeine: z.string().optional(),
  }),
  preferences: z.object({
    diet_type: z.string().optional(),
    favorite_foods: z.string().optional(),
    dislikes: z.string().optional(),
    fasting_practices: z.string().optional(),
  }),
  goals: z.object({
    primary: z.string().optional(),
    timeline: z.string().optional(),
    motivation: z.string().optional(),
    budget: z.string().optional(),
  }),
  diet_plan: z.object({
    breakfast: z.string(),
    lunch: z.string(),
    snack: z.string(),
    dinner: z.string(),
    hydration: z.string(),
  }),
  warnings: z.array(z.string()).describe('A list of critical warnings, especially drug-food interactions.'),
  detailed_notes: z.object({
    calories: z.string().describe('Calculated TDEE/daily caloric needs.'),
    macros: z.string().describe('Calculated macronutrient distribution (Carbs, Protein, Fat).'),
    fiber_goal: z.string().optional(),
    special_notes: z.string().describe('Summary of diet type, e.g., "Diabetic-friendly, low-sodium, lactose-free".'),
  }),
});

export type NutritionCoachOutput = z.infer<typeof NutritionCoachOutputSchema>;

export async function generateCoachedDietPlan(input: NutritionCoachInput): Promise<NutritionCoachOutput> {
  return nutritionCoachFlow(input);
}


const prompt = ai.definePrompt({
  name: 'nutritionCoachPrompt',
  input: {schema: NutritionCoachInputSchema},
  output: {schema: NutritionCoachOutputSchema},
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an expert AI Nutritionist and Dietitian. Your task is to act as a virtual diet coach.
You have been provided with detailed, structured information from a patient questionnaire.
Analyze all the data and generate a comprehensive, personalized diet plan.

**System Instructions:**

1.  **Calculate Baseline:**
    *   First, calculate the patient's BMI from their height and weight.
    *   Estimate their Total Daily Energy Expenditure (TDEE) based on their BMR (use Mifflin-St Jeor formula if possible) and activity level. This will be their daily caloric target.
    *   Determine an appropriate macronutrient distribution (e.g., 50% Carbs, 20% Protein, 30% Fat) based on their primary goal.

2.  **Analyze Medical Flags & Generate Warnings:**
    *   Critically review their medical history and medications.
    *   If they have diabetes, ensure the diet is low-glycemic.
    *   If they have hypertension, ensure the diet is low-sodium (target <1500mg/day).
    *   If they have kidney disease, moderate protein and potassium as needed.
    *   **Crucially, check for common, significant drug-food interactions** based on their medication list. Examples: Statins (avoid grapefruit), Warfarin (consistent Vitamin K intake, e.g., spinach), some blood pressure meds (avoid high potassium).
    *   For each major flag, create a clear, concise warning message in the 'warnings' array.

3.  **Create the Personalized Diet Plan:**
    *   Develop a 1-day meal plan (3 meals + 1 snack).
    *   The food choices **must** respect the patient's cultural and personal preferences (e.g., vegetarian, halal, dislikes).
    *   The plan must align with the medical flags (e.g., low-sodium options for a hypertensive patient).
    *   Provide specific, actionable meal suggestions. Instead of "salad," suggest "a large bowl of mixed greens with grilled chicken, cucumber, tomatoes, and a light vinaigrette dressing."
    *   Include recommendations for hydration, sleep, and stress management based on their profile.

4.  **Format the Output:**
    *   Populate the output JSON with a summary of the patient's input data for record-keeping.
    *   Fill in the `diet_plan` with your meal suggestions.
    *   Fill in the `warnings` array with all identified alerts.
    *   Fill in the `detailed_notes` with your calculated caloric target, macro split, and a summary of the diet's characteristics.

**Patient Data:**
\`\`\`json
{{{JSON input}}}
\`\`\`

Respond ONLY with the structured JSON output.
`,
});


const nutritionCoachFlow = ai.defineFlow(
  {
    name: 'nutritionCoachFlow',
    inputSchema: NutritionCoachInputSchema,
    outputSchema: NutritionCoachOutputSchema,
  },
  async (input) => {
    // The prompt now expects the full input to be JSON stringified
    const promptInput = {
      JSON: JSON.stringify(input, null, 2),
    };
    
    const {output} = await prompt(promptInput);
    return output!;
  }
);
