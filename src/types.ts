export interface Material {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  description?: string;
}

export interface Labor {
  id: string;
  role: string;
  costPerHour: number;
  description?: string;
}

export interface ProjectMaterial {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  quantity: number;
  description?: string;
}

export interface ProjectLabor {
  id: string;
  role: string;
  costPerHour: number;
  hours: number;
  description?: string;
}

export interface ProjectDetails {
  projectName: string;
  length: number;
  width: number;
  height: number;
  materials: ProjectMaterial[];
  labor: ProjectLabor[];
}

export interface CostBreakdown {
  materials: {
    [key: string]: {
      quantity: number;
      unitCost: number;
      totalCost: number;
      name: string;
      unit: string;
    };
  };
  labor: {
    [key: string]: {
      hours: number;
      hourlyRate: number;
      totalCost: number;
      role: string;
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
  materials: ProjectMaterial[];
  labor: ProjectLabor[];
  total_cost: number;
  created_at: string;
}