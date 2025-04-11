import { ProjectDetails, CostBreakdown } from '../types';
import { MATERIALS, LABOR, OVERHEAD_PERCENTAGE } from '../data/constants';

export function calculateCosts(details: ProjectDetails): CostBreakdown {
  // Calculate materials cost
  const materials = details.materials.reduce((acc, { materialId, quantity }) => {
    const material = MATERIALS.find(m => m.id === materialId);
    if (material && quantity > 0) {
      acc[materialId] = {
        quantity,
        unitCost: material.costPerUnit,
        totalCost: quantity * material.costPerUnit,
      };
    }
    return acc;
  }, {} as CostBreakdown['materials']);

  // Calculate labor cost
  const labor = details.labor.reduce((acc, { laborId, hours }) => {
    const laborType = LABOR.find(l => l.id === laborId);
    if (laborType && hours > 0) {
      acc[laborId] = {
        hours,
        hourlyRate: laborType.costPerHour,
        totalCost: hours * laborType.costPerHour,
      };
    }
    return acc;
  }, {} as CostBreakdown['labor']);

  // Calculate totals
  const totalMaterialCost = Object.values(materials).reduce((sum, { totalCost }) => sum + totalCost, 0);
  const totalLaborCost = Object.values(labor).reduce((sum, { totalCost }) => sum + totalCost, 0);
  const overhead = (totalMaterialCost + totalLaborCost) * OVERHEAD_PERCENTAGE;
  const total = totalMaterialCost + totalLaborCost + overhead;

  return {
    materials,
    labor,
    totalMaterialCost,
    totalLaborCost,
    overhead,
    total,
  };
}