
'use server';
/**
 * @fileOverview AI-powered prescription refill and order management system.
 *
 * - manageRefill - A function that tracks medication, predicts refills, and generates orders.
 * - ManageRefillInput - The input type for the manageRefill function.
 * - ManageRefillOutput - The return type for the manageRefill function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findNearbyPharmaciesWithStock } from '@/ai/tools/pharmacy-finder';

const MedicationOrderSchema = z.object({
    name: z.string().describe('The full name of the medication.'),
    strength: z.string().describe('The strength/dosage of the medication (e.g., "5 mg").'),
    dosage: z.string().describe('The dosage instructions (e.g., "1 tab daily").'),
    quantityDispensed: z.number().int().describe('The total number of units dispensed (e.g., 30 tablets).'),
    dispensedDate: z.string().describe('The date the medication was dispensed (YYYY-MM-DD).'),
});

const ManageRefillInputSchema = z.object({
  patientId: z.string().optional().describe("The patient's ID."),
  medication: MedicationOrderSchema,
});
export type ManageRefillInput = z.infer<typeof ManageRefillInputSchema>;


const ManageRefillOutputSchema = z.object({
  patient_id: z.string().optional(),
  medicine: z.object({
    name: z.string(),
    strength: z.string(),
    dosage: z.string(),
    quantity_dispensed: z.number().int(),
    remaining_days: z.number().int().describe('Calculated number of days of medication remaining.'),
  }),
  refill_reminder: z.object({
    status: z.enum(['Active', 'NotNeeded', 'Urgent']),
    message: z.string().describe('A friendly reminder message for the patient.'),
    refill_due_date: z.string().describe('The predicted date the refill will be due (YYYY-MM-DD).'),
  }),
  order: z.object({
    partner_pharmacy: z.string().describe('The name of the suggested partner pharmacy.'),
    option: z.string().describe('The suggested fulfillment option (e.g., "Home Delivery", "Pickup").'),
    order_status: z.string().default('NotPlaced'),
    estimated_delivery: z.string().optional().describe('Estimated delivery time if applicable.'),
  }).optional(),
});
export type ManageRefillOutput = z.infer<typeof ManageRefillOutputSchema>;


export async function manageRefill(input: ManageRefillInput): Promise<ManageRefillOutput> {
  return refillManagerFlow(input);
}


const prompt = ai.definePrompt({
  name: 'refillManagerPrompt',
  input: {schema: ManageRefillInputSchema},
  output: {schema: ManageRefillOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  tools: [findNearbyPharmaciesWithStock],
  prompt: `You are an AI pharmacy assistant responsible for managing prescription refills for Zuruu AI Pharmacy.

**Current Date for Calculation: ${new Date().toISOString().split('T')[0]}**

**Patient & Medication Data:**
- Patient ID: {{{patientId}}}
- Medicine: {{{medication.name}}} ({{{medication.strength}}})
- Dosage: {{{medication.dosage}}}
- Quantity Dispensed: {{{medication.quantityDispensed}}}
- Dispensed Date: {{{medication.dispensedDate}}}

**Your Task:**
1.  **Calculate Remaining Supply:**
    - First, determine the daily consumption from the 'dosage' (e.g., "1 tab daily" is 1, "Twice daily" or "BD" is 2, "Thrice daily" or "TDS" is 3). Assume 1 if unclear.
    - Calculate the number of days that have passed since the 'dispensedDate'.
    - Calculate 'remaining_days' = (Total Days of Supply) - (Days Passed). Total Days of Supply = quantityDispensed / dailyConsumption. Round down to the nearest whole number. If the calculation results in a negative number, the remaining days are 0.

2.  **Predict Refill Date:**
    - Calculate the 'refill_due_date' by adding (Total Days of Supply) to the 'dispensedDate'.

3.  **Generate Reminder:**
    - Set reminder 'status' to "Urgent" if remaining_days are 3 or less.
    - Set reminder 'status' to "Active" if remaining_days are between 4 and 7.
    - Set reminder 'status' to "NotNeeded" if remaining_days are more than 7.
    - Create a friendly 'message' based on the status and remaining days.

4.  **Find Pharmacy & Create Order:**
    - If, and only if, the reminder status is "Active" or "Urgent", you MUST use the 'findNearbyPharmaciesWithStock' tool to find a pharmacy that has the medication. You must pass the medication name to the tool.
    - If a pharmacy is found, create a mock 'order' object with the pharmacy name and a suggested 'option' (e.g., "Home Delivery"). If multiple are found, select the first one. Set a default estimated delivery of "2 hours".

Respond in the structured format defined by the output schema.
`,
});


const refillManagerFlow = ai.defineFlow(
  {
    name: 'refillManagerFlow',
    inputSchema: ManageRefillInputSchema,
    outputSchema: ManageRefillOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
