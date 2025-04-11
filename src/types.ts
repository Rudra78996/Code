export interface Material {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
}

export interface Labor {
  id: string;
  role: string;
  costPerHour: number;
}

export interface ProjectDetails {
  projectName: string;
  length: number;
  width: number;
  height: number;
  materials: Array<{
    materialId: string;
    quantity: number;
  }>;
  labor: Array<{
    laborId: string;
    hours: number;
  }>;
}

export interface CostBreakdown {
  materials: {
    [key: string]: {
      quantity: number;
      unitCost: number;
      totalCost: number;
    };
  };
  labor: {
    [key: string]: {
      hours: number;
      hourlyRate: number;
      totalCost: number;
    };
  };
  totalMaterialCost: number;
  totalLaborCost: number;
  overhead: number;
  total: number;
}

export interface SavedProject {
  id: string;
  name: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  materials: Array<{
    materialId: string;
    quantity: number;
  }>;
  labor: Array<{
    laborId: string;
    hours: number;
  }>;
  total_cost: number;
  created_at: string;
}