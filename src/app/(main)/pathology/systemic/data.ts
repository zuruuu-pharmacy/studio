
import { Stethoscope, Dna, FileText, Bot, Book, Zap, FlaskConical, GitBranch, Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Microscope, Droplet } from 'lucide-react';

export interface Disease {
  title: string;
  synonyms?: string;
  overview: string;
  learningObjectives: string[];
  tags: {
    organ: string;
    system: string;
    category: 'Inflammatory' | 'Infectious' | 'Neoplastic' | 'Degenerative' | 'Genetic' | 'Metabolic' | 'Autoimmune' | 'Vascular' | 'Other';
    level: 'Basic' | 'Intermediate' | 'Advanced';
  };
  etiology: string[];
  pathogenesis: string;
  morphology: {
    gross: string;
    microscopic: string;
    imageHint?: string;
  };
  clinicalFeatures: string;
  investigations: string;
  management: string;
  complications: string;
  prognosis: string;
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

export const systemicPathologyData: OrganSystem[] = [
  {
    system: "Cardiovascular System",
    icon: Heart,
    categories: [
      {
        name: "Ischemic Heart Disease",
        diseases: [
          { 
            title: "Myocardial Infarction",
            synonyms: "Heart Attack",
            overview: "Myocardial infarction (MI) is the irreversible death (necrosis) of heart muscle secondary to prolonged ischemia. It is usually caused by the rupture of an atherosclerotic plaque and subsequent thrombosis of a coronary artery.",
            learningObjectives: [
                "Define myocardial infarction and understand its primary cause.",
                "Describe the pathogenesis, including the role of atherosclerosis and thrombosis.",
                "Recognize the key morphological changes (gross and microscopic) over time.",
                "Identify the classic clinical presentation and diagnostic investigations.",
                "Outline the main principles of management and major complications."
            ],
            tags: {
                organ: "Heart",
                system: "Cardiovascular",
                category: "Vascular",
                level: "Intermediate"
            },
            etiology: [
                "Atherosclerosis of coronary arteries (>90% of cases)",
                "Coronary artery embolism",
                "Vasculitis",
                "Cocaine use (coronary vasospasm)"
            ],
            pathogenesis: "The typical sequence is: 1. A sudden disruption of an atherosclerotic plaque. 2. Platelets adhere, aggregate, and are activated, releasing thromboxane A2, ADP, and serotonin. 3. The coagulation cascade is activated, adding to the growing thrombus. 4. Within minutes, the thrombus can expand to completely occlude the vessel lumen. 5. If ischemia lasts >20-40 minutes, irreversible myocyte injury (necrosis) begins.",
            morphology: {
                gross: "12-24 hours: Pallor of the myocardium. 1-3 days: The infarct is pale and yellow. 3-7 days: The center of the infarct is soft and yellow, with a hyperemic (red) border. Weeks later: A firm, white scar forms.",
                microscopic: "4-12 hours: Coagulative necrosis begins, edema, hemorrhage. 1-3 days: Dense neutrophilic infiltrate. 3-7 days: Macrophages appear to phagocytose dead cells. 1-2 weeks: Granulation tissue forms. >2 weeks: Collagen deposition and scarring.",
                imageHint: "myocardial infarction histology"
            },
            clinicalFeatures: "Severe, crushing substernal chest pain or pressure, often radiating to the left arm, jaw, or neck. Sweating (diaphoresis), nausea, and shortness of breath are common. Some MIs, especially in diabetics and the elderly, can be 'silent'.",
            investigations: "ECG: ST-segment elevation (STEMI) or depression (NSTEMI). Cardiac Biomarkers: Troponin T and Troponin I are highly sensitive and specific for myocardial injury and are the preferred markers. Creatine kinase-MB (CK-MB) is less specific.",
            management: "Goals are to restore blood flow, reduce oxygen demand, and prevent complications. Includes oxygen, nitrates, aspirin, antiplatelet agents (e.g., clopidogrel), anticoagulants (e.g., heparin), and urgent reperfusion therapy (PCI or thrombolysis). Beta-blockers and ACE inhibitors are used for long-term management.",
            complications: "Arrhythmias, cardiogenic shock, myocardial rupture, ventricular aneurysm, mural thrombus, and heart failure.",
            prognosis: "Varies greatly depending on the size of the infarct, the patient's age, and the presence of complications. With modern therapy, short-term mortality has significantly decreased."
          },
        ]
      },
      {
        name: "Hypertensive Heart Disease",
        diseases: []
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
    icon: Wind,
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
  },
   {
    system: "Gastrointestinal System",
    icon: CircleEllipsis,
    categories: [
      {
        name: "Esophageal Disorders",
        diseases: []
      },
      {
        name: "Gastric Pathology",
        diseases: []
      },
       {
        name: "Inflammatory Bowel Disease",
        diseases: []
      },
      {
        name: "Liver & Biliary Pathology",
        diseases: []
      }
    ]
  },
   {
    system: "Nervous System",
    icon: Brain,
    categories: [
      {
        name: "Cerebrovascular Disease",
        diseases: []
      },
      {
        name: "Neurodegenerative Diseases",
        diseases: []
      },
       {
        name: "CNS Tumors",
        diseases: []
      },
      {
        name: "Infections of the CNS",
        diseases: []
      }
    ]
  },
  {
    system: "Renal System",
    icon: Droplet,
    categories: [
        {
            name: "Glomerular Diseases",
            diseases: []
        },
        {
            name: "Tubulointerstitial Diseases",
            diseases: []
        },
        {
            name: "Renal Tumors",
            diseases: []
        }
    ]
  },
  {
    system: "Endocrine System",
    icon: Dna,
    categories: [
        {
            name: "Thyroid Pathology",
            diseases: []
        },
        {
            name: "Adrenal Pathology",
            diseases: []
        },
        {
            name: "Pancreatic Islet Pathology",
            diseases: []
        }
    ]
  },
  {
    system: "Musculoskeletal System",
    icon: Bone,
    categories: [
        {
            name: "Bone Tumors",
            diseases: []
        },
        {
            name: "Diseases of Joints",
            diseases: []
        },
        {
            name: "Soft Tissue Tumors",
            diseases: []
        }
    ]
  },
  {
    system: "Hematopoietic & Lymphoid Systems",
    icon: TestTube,
    categories: [
        {
            name: "Red Blood Cell Disorders",
            diseases: []
        },
        {
            name: "White Blood Cell Disorders (Benign)",
            diseases: []
        },
        {
            name: "Neoplasms of White Cells",
            diseases: []
        }
    ]
  }
];
