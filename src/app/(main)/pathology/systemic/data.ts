
export interface Disease {
  title: string;
  synonyms: string[];
  learningObjectives: string[];
  tags: {
    system: string;
    acuity: 'Acute' | 'Chronic';
    highYield: boolean;
  };
  level: 'Basic' | 'Intermediate' | 'Advanced';
  etiology: {
    factor: string;
    importance: 'High' | 'Medium' | 'Low';
  }[];
  pathogenesis: string;
  morphology: {
    gross: string;
    microscopic: string;
  };
  clinicalFeatures: string;
  investigations: {
    test: string;
    findings: string;
  }[];
  management: string;
  complicationsPrognosis: string;
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
          {
            title: "Myocardial Infarction",
            synonyms: ["Heart Attack"],
            learningObjectives: [
              "Define myocardial infarction and its main cause.",
              "Describe the pathogenesis of coronary artery thrombosis.",
              "List the key morphological changes (gross and microscopic) over time.",
              "Identify the principal clinical features and diagnostic lab tests.",
              "Outline the main complications of an MI.",
            ],
            tags: {
              system: "Cardiovascular",
              acuity: "Acute",
              highYield: true,
            },
            level: "Intermediate",
            etiology: [
              { factor: "Atherosclerotic plaque rupture/thrombosis", importance: "High" },
              { factor: "Coronary artery vasospasm", importance: "Medium" },
              { factor: "Embolism to coronary artery", importance: "Low" },
            ],
            pathogenesis: "The most common cause is the rupture of an atherosclerotic plaque in a coronary artery. This exposes thrombogenic material, leading to the formation of a thrombus that occludes the vessel. The lack of blood flow (ischemia) causes myocyte death (necrosis) if not restored promptly.",
            morphology: {
              gross: "Initially, no changes. After 12-24 hours, the infarct appears pale or mottled. Over days, it becomes yellow and soft, surrounded by a hyperemic border. A white fibrous scar is formed after 2 months.",
              microscopic: "Early signs (4-12 hours) include coagulative necrosis, edema, and hemorrhage. Neutrophils appear by 12-24 hours. Macrophages replace neutrophils by day 3-7 to clear necrotic debris. Granulation tissue forms by 1-2 weeks, progressively replaced by a dense collagenous scar.",
            },
            clinicalFeatures: "Severe, crushing substernal chest pain, often radiating to the left arm or jaw. Accompanied by sweating (diaphoresis), shortness of breath (dyspnea), and nausea. Some MIs, especially in diabetics, can be 'silent'.",
            investigations: [
              { test: "ECG", findings: "ST-segment elevation (STEMI) or depression (NSTEMI), Q waves." },
              { test: "Cardiac Troponins (cTnT, cTnI)", findings: "Highly sensitive and specific markers of myocyte necrosis. Levels rise within 2-4 hours and remain elevated for days." },
              { test: "Creatine Kinase (CK-MB)", findings: "Rises within 4-6 hours, peaks at 24 hours, and returns to normal in 48-72 hours. Less specific than troponins." },
            ],
            management: "Goals are to restore blood flow (reperfusion) and minimize cardiac workload. Includes antiplatelet therapy (aspirin), anticoagulants (heparin), beta-blockers, nitrates, and urgent reperfusion via percutaneous coronary intervention (PCI) or thrombolysis. Always check current local guidelines for specific protocols.",
            complicationsPrognosis: "Arrhythmias, cardiogenic shock, myocardial rupture, ventricular aneurysm, and heart failure. Prognosis depends on the size of the infarct and the success of reperfusion therapy.",
          }
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
