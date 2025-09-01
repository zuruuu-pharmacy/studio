
'use server';
/**
 * @fileOverview Tools for finding healthcare providers and pharmacies.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PharmacySchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  hasStock: z.boolean(),
  deliveryAvailable: z.boolean(),
});

// Mock pharmacy data
const MOCK_PHARMACIES = [
    { name: 'Clinix Pharmacy - Model Town', address: '123 Main St, Lahore', phone: '04235882123', hasStock: true, deliveryAvailable: true },
    { name: 'Servaid Pharmacy - Gulberg', address: '456 Side St, Lahore', phone: '03111737824', hasStock: true, deliveryAvailable: false },
    { name: 'Fazal Din Pharma Plus - DHA', address: '789 Central Sq, Lahore', phone: '042111742762', hasStock: false, deliveryAvailable: true },
    { name: 'Green Plus Pharmacy - Johar Town', address: '101 Tech Ave, Lahore', phone: '04235179991', hasStock: true, deliveryAvailable: true },
];

export const findNearbyPharmaciesWithStock = ai.defineTool(
  {
    name: 'findNearbyPharmaciesWithStock',
    description: 'Returns a list of nearby pharmacies that have a specific medication in stock.',
    inputSchema: z.object({
        medicationName: z.string().describe('The name of the medication to check for.'),
    }),
    outputSchema: z.array(PharmacySchema),
  },
  async ({ medicationName }) => {
    // In a real app, this would query a database. Here, we'll just return mock data.
    // We'll pretend that Fazal Din is always out of stock for this example.
    return MOCK_PHARMACIES.filter(p => p.hasStock);
  }
);
