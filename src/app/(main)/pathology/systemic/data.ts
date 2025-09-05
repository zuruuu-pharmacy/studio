
export interface Disease {
  title: string;
}

export interface DiseaseCategory {
  name: string;
  diseases: Disease[];
}

export interface OrganSystem {
  system: string;
  icon: any; // Lucide icon component
  categories: DiseaseCategory[];
}

export const systemicPathologyData: Omit<OrganSystem, 'icon'>[] = [
  {
    system: "Cardiovascular System",
    categories: [
      {
        name: "Ischemic Heart Disease",
        diseases: [
          { title: "Myocardial Infarction" },
          { title: "Angina Pectoris" },
        ]
      },
      {
        name: "Hypertensive Heart Disease",
        diseases: [
            { title: "Systemic Hypertensive Heart Disease"}
        ]
      },
      {
        name: "Valvular Heart Disease",
        diseases: []
      },
      {
        name: "Cardiomyopathies",
        diseases: []
      }
    ]
  },
  {
    system: "Respiratory System",
    categories: [
      {
        name: "Obstructive Lung Diseases",
        diseases: []
      },
      {
        name: "Restrictive Lung Diseases",
        diseases: []
      },
       {
        name: "Lung Tumors",
        diseases: []
      }
    ]
  }
];
