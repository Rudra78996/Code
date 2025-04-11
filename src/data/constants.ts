import { Labor, Material } from '../types';

export const MATERIALS: Material[] = [
  { id: 'concrete', name: 'Concrete', unit: 'm³', costPerUnit: 85 },
  { id: 'steel', name: 'Steel Reinforcement', unit: 'kg', costPerUnit: 1.2 },
  { id: 'brick', name: 'Bricks', unit: 'piece', costPerUnit: 0.5 },
  { id: 'sand', name: 'Sand', unit: 'm³', costPerUnit: 25 },
  { id: 'gravel', name: 'Gravel', unit: 'm³', costPerUnit: 30 },
];

export const LABOR: Labor[] = [
  { id: 'mason', role: 'Mason', costPerHour: 25 },
  { id: 'carpenter', role: 'Carpenter', costPerHour: 28 },
  { id: 'electrician', role: 'Electrician', costPerHour: 35 },
  { id: 'plumber', role: 'Plumber', costPerHour: 32 },
  { id: 'general', role: 'General Labor', costPerHour: 20 },
];

export const OVERHEAD_PERCENTAGE = 0.15; // 15% overhead