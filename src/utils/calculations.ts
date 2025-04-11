import { ProjectDetails, CostBreakdown } from '../types';

export function calculateCosts(details: ProjectDetails): CostBreakdown {
  // Calculate materials cost
  const materials = details.materials.reduce((acc, material) => {
    if (material.quantity > 0) {
      acc[material.id] = {
        quantity: material.quantity,
        unitCost: material.costPerUnit,
        totalCost: material.quantity * material.costPerUnit,
        name: material.name,
        unit: material.unit,
      };
    }
    return acc;
  }, {} as CostBreakdown['materials']);

  // Calculate labor cost
  const labor = details.labor.reduce((acc, labor) => {
    if (labor.hours > 0) {
      acc[labor.id] = {
        hours: labor.hours,
        hourlyRate: labor.costPerHour,
        totalCost: labor.hours * labor.costPerHour,
        role: labor.role,
      };
    }
    return acc;
  }, {} as CostBreakdown['labor']);

  // Calculate totals
  const totalMaterialCost = Object.values(materials).reduce((sum, { totalCost }) => sum + totalCost, 0);
  const totalLaborCost = Object.values(labor).reduce((sum, { totalCost }) => sum + totalCost, 0);
  const overhead = (totalMaterialCost + totalLaborCost) * 0.15; // 15% overhead
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