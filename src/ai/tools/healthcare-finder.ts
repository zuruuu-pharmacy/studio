
'use server';
/**
 * @fileOverview Tools for finding healthcare providers.
 *
 * This file contains Genkit tools for finding nearby hospitals, pharmacies,
 * and doctors. Currently, they return mock data but are structured to be
 * connected to a real API.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LocationSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
});

export const findNearbyHospitals = ai.defineTool(
  {
    name: 'findNearbyHospitals',
    description: 'Returns a list of nearby hospitals based on the user\'s location.',
    inputSchema: z.object({
      // In a real app, you'd pass lat/lng here
    }),
    outputSchema: z.array(LocationSchema),
  },
  async () => {
    // Mock data. Replace with a real API call (e.g., Google Maps Platform).
    return [
      { name: 'National Hospital & Medical Centre', address: '130, Block F, Model Town, Lahore', phone: '042111171819' },
      { name: 'Lahore General Hospital', address: 'Ferozepur Road, Lahore', phone: '04299264091' },
      { name: 'Jinnah Hospital', address: 'Usmani Rd, Faisal Town, Lahore', phone: '04299231400' },
    ];
  }
);

export const findNearbyPharmacies = ai.defineTool(
  {
    name: 'findNearbyPharmacies',
    description: 'Returns a list of nearby pharmacies based on the user\'s location.',
    inputSchema: z.object({}),
    outputSchema: z.array(LocationSchema),
  },
  async () => {
    // Mock data
    return [
      { name: 'Clinix Pharmacy', address: '123 Main St, Lahore', phone: '04235882 Clinix' },
      { name: 'Servaid Pharmacy', address: '456 Side St, Lahore', phone: '0311 1737824' },
      { name: 'Fazal Din Pharma Plus', address: '789 Central Sq, Lahore', phone: '042111742762' },
    ];
  }
);

export const findAvailableDoctors = ai.defineTool(
  {
    name: 'findAvailableDoctors',
    description: 'Returns a list of currently available doctors nearby.',
    inputSchema: z.object({
      specialty: z.string().optional().describe('Optional specialty to filter by (e.g., Cardiologist, GP).'),
    }),
    outputSchema: z.array(LocationSchema.extend({ specialty: z.string() })),
  },
  async ({ specialty }) => {
    // Mock data
    return [
      { name: 'Dr. Ali Khan', specialty: 'Cardiologist', address: 'Heart Clinic, Model Town', phone: '03001234567' },
      { name: 'Dr. Fatima Ahmed', specialty: 'General Physician', address: 'Family Health, Gulberg', phone: '03217654321' },
    ];
  }
);
