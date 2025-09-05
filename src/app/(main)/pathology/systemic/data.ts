
import { Stethoscope, Dna, FileText, Bot, Book, Zap, FlaskConical, GitBranch, Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Microscope, Droplet, User, Video, Mic, Notebook, BookCopy, CaseSensitive, FileHeart, HelpCircle, Target, CheckCircle, GitCommit, CalendarClock, BookA, ShieldAlert, BrainCircuit, Lightbulb, ShieldCheck, ListChecks } from 'lucide-react';

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
  references?: string[];
  facultyReviewer?: string;
  dateReviewed?: string;
  versionHistory?: { version: string; date: string; changes: string; }[];
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
            investigations: "ECG: ST-segment elevation (STEMI) or depression (NSTEMI) are key findings.\n\nCardiac Biomarkers: Troponin T and Troponin I are highly sensitive and specific for myocardial injury and are the preferred markers. They rise within 2-4 hours and remain elevated for days. Creatine kinase-MB (CK-MB) is less specific and returns to normal more quickly.",
            management: "Goals are to restore blood flow (reperfusion), reduce oxygen demand, and prevent complications.\n\nImmediate: Oxygen, nitrates, aspirin, antiplatelet agents (e.g., clopidogrel), anticoagulants (e.g., heparin).\n\nReperfusion: Urgent Percutaneous Coronary Intervention (PCI) is preferred. Thrombolysis (e.g., with Alteplase) is an option if PCI is not available.\n\nLong-term: Beta-blockers, ACE inhibitors, and Statins are crucial for secondary prevention. Always check current local and international guidelines (e.g., AHA/ACC) for the latest recommendations.",
            complications: "Arrhythmias (most common cause of death before reaching hospital), cardiogenic shock, myocardial rupture (leading to cardiac tamponade), ventricular aneurysm, mural thrombus (risk of stroke), and chronic heart failure.",
            prognosis: "Varies greatly depending on the size and location of the infarct, the patient's age, and the presence of complications. With modern reperfusion therapy, short-term mortality has significantly decreased.",
            references: ["Robbins & Cotran Pathologic Basis of Disease, 10th Ed.", "Braunwald's Heart Disease: A Textbook of Cardiovascular Medicine, 12th Ed."],
            facultyReviewer: "Dr. A. Khan, MD, FACC",
            dateReviewed: "2024-05-20",
            versionHistory: [
                { version: "1.1", date: "2024-05-20", changes: "Added latest ACC/AHA guideline reference." },
                { version: "1.0", date: "2023-09-10", changes: "Initial version created." }
            ]
          },
        ]
      },
      {
        name: "Hypertensive Heart Disease",
        diseases: [
            { 
            title: "Systemic Hypertensive Heart Disease",
            synonyms: "Hypertensive Cardiomyopathy",
            overview: "Systemic hypertensive heart disease refers to the response of the heart to the increased demands induced by systemic hypertension. It primarily manifests as left ventricular hypertrophy (LVH) and can eventually lead to heart failure.",
            learningObjectives: [
                "Define left ventricular hypertrophy as an adaptation to pressure overload.",
                "Understand the criteria for diagnosing hypertensive heart disease.",
                "Describe the gross and microscopic features of LVH.",
                "Explain the progression from compensated LVH to heart failure."
            ],
            tags: {
                organ: "Heart",
                system: "Cardiovascular",
                category: "Other",
                level: "Intermediate"
            },
            etiology: [
                "Chronic, poorly controlled systemic hypertension (essential or secondary)."
            ],
            pathogenesis: "Increased pressure load on the left ventricle causes mechanical stress on myocytes. This leads to the activation of signal transduction pathways that induce the synthesis of new contractile proteins (myosin, actin) and an increase in the size of individual myocytes. The overall effect is a thickening of the left ventricular wall without a corresponding increase in chamber size, a pattern known as concentric hypertrophy.",
            morphology: {
                gross: "The heart is enlarged and heavy. The left ventricular wall is markedly thickened, often >2.0 cm (normal is ~1.2-1.5 cm). The left ventricular chamber size may be normal or even reduced. The increased stiffness of the wall impairs diastolic filling.",
                microscopic: "Myocytes are enlarged ('boxcar' nuclei). There may be an increase in interstitial fibrous tissue over time.",
                imageHint: "left ventricular hypertrophy gross specimen"
            },
            clinicalFeatures: "Patients may be asymptomatic for years. As the disease progresses, they may develop symptoms of diastolic heart failure (e.g., exertional dyspnea) due to impaired ventricular filling. Atrial fibrillation is a common complication. Eventually, systolic failure can also occur.",
            investigations: "Echocardiography is the gold standard for diagnosing LVH, showing increased wall thickness and mass. ECG may show signs of LVH (e.g., S aVL + R V5/V6 > 35 mm), but is less sensitive.",
            management: "The primary goal is aggressive blood pressure control using antihypertensive medications (e.g., ACE inhibitors, ARBs, diuretics) to halt or even reverse the hypertrophy. Management of heart failure symptoms if they develop. Always check current local and international hypertension guidelines (e.g., JNC8, ACC/AHA).",
            complications: "Diastolic heart failure, systolic heart failure, atrial fibrillation, increased risk of myocardial ischemia, and sudden cardiac death.",
            prognosis: "Good if hypertension is well-controlled. Poor once symptomatic heart failure develops.",
          },
        ]
      },
      {
        name: "Valvular Heart Disease",
        diseases: [
             { 
            title: "Rheumatic Heart Disease",
            overview: "Rheumatic heart disease (RHD) is a chronic condition resulting from rheumatic fever, which is a delayed, non-suppurative inflammatory sequel to a pharyngeal infection with group A streptococcus. RHD is characterized by permanent damage to the heart valves, most commonly the mitral valve.",
            learningObjectives: [
                "Understand the relationship between streptococcal pharyngitis, acute rheumatic fever, and chronic RHD.",
                "Describe the pathogenesis, involving molecular mimicry.",
                "Identify the key pathological features, including Aschoff bodies and MacCallum plaques.",
                "Recognize the clinical consequences, particularly mitral stenosis."
            ],
            tags: {
                organ: "Heart",
                system: "Cardiovascular",
                category: "Inflammatory",
                level: "Advanced"
            },
            etiology: [
                "Group A streptococcal pharyngitis (untreated or inadequately treated)."
            ],
            pathogenesis: "The disease is caused by an autoimmune reaction. Antibodies produced against the M proteins of streptococci cross-react with host glycoproteins in the heart, joints, and other tissues (molecular mimicry). This triggers a pancarditis (inflammation of all three layers of the heart) during the acute rheumatic fever phase. Repeated attacks lead to chronic scarring and fibrosis of the heart valves.",
            morphology: {
                gross: "In chronic RHD, the mitral valve leaflets are thickened, fibrotic, and calcified. There is fusion of the commissures and shortening and fusion of the chordae tendineae, leading to a 'fish-mouth' or 'buttonhole' stenosis. The left atrium is often dilated.",
                microscopic: "The pathognomonic lesion of acute rheumatic fever is the Aschoff body, a focus of fibrinoid necrosis surrounded by inflammatory cells, including characteristic Anitschkow cells ('caterpillar cells'). In chronic disease, the valves show fibrosis and neovascularization.",
                imageHint: "rheumatic heart disease mitral stenosis gross"
            },
            clinicalFeatures: "Acute rheumatic fever presents with migratory polyarthritis, carditis, subcutaneous nodules, erythema marginatum, and Sydenham chorea (Jones criteria). Chronic RHD manifests years later with symptoms of valvular disease, most commonly mitral stenosis (e.g., dyspnea, atrial fibrillation, risk of stroke).",
            investigations: "Echocardiography is key for diagnosing and assessing the severity of valvular lesions in chronic RHD. Elevated ASO titers can support a diagnosis of recent streptococcal infection in acute RF.",
            management: "Primary prevention involves prompt treatment of streptococcal pharyngitis with penicillin. Secondary prevention with long-term prophylactic penicillin is crucial in patients with a history of rheumatic fever to prevent recurrences. Management of chronic RHD involves treating heart failure and considering surgical valve repair or replacement. Always check current local and international guidelines.",
            complications: "Mitral stenosis, atrial fibrillation, thromboembolism (stroke), infective endocarditis, and chronic heart failure.",
            prognosis: "Variable. Depends on the severity of valvular damage and the prevention of recurrent attacks.",
          },
        ]
      },
      {
        name: "Cardiomyopathies",
        diseases: [
            { 
            title: "Dilated Cardiomyopathy (DCM)",
            overview: "Dilated cardiomyopathy is characterized by progressive cardiac dilation and contractile (systolic) dysfunction, usually with concomitant hypertrophy. It is the most common type of cardiomyopathy.",
            learningObjectives: [
                "Define DCM based on its key functional and structural features.",
                "List the major causes of DCM.",
                "Describe the gross and microscopic pathology.",
                "Relate the pathology to the clinical presentation of systolic heart failure."
            ],
            tags: {
                organ: "Heart",
                system: "Cardiovascular",
                category: "Other",
                level: "Advanced"
            },
            etiology: [
                "Idiopathic (most common)",
                "Genetic/familial (~30-50%)",
                "Myocarditis (viral, e.g., Coxsackie B)",
                "Alcohol abuse (toxic)",
                "Peripartum cardiomyopathy",
                "Chemotherapy (e.g., Doxorubicin)"
            ],
            pathogenesis: "The final common pathway is myocyte injury leading to ineffective contraction. The exact mechanisms vary by cause but often involve direct toxicity, genetic mutations in cytoskeletal proteins, or immune-mediated damage. This leads to a vicious cycle of ventricular dilation and worsening systolic function.",
            morphology: {
                gross: "The heart is enlarged, heavy, and flabby due to dilation of all four chambers. The ventricular walls may be thinned, normal, or thickened. Mural thrombi are common and can be a source of thromboemboli.",
                microscopic: "Findings are often nonspecific. Myocytes can be hypertrophied, but many are stretched and thinned. There is often interstitial and endocardial fibrosis of variable degree.",
                imageHint: "dilated cardiomyopathy gross heart"
            },
            clinicalFeatures: "Presents with signs and symptoms of congestive heart failure (systolic dysfunction), such as dyspnea, orthopnea, and peripheral edema. Fatigue and weakness are common. Arrhythmias and embolic events can also occur.",
            investigations: "Echocardiography is the primary diagnostic tool, showing left ventricular dilation and a severely reduced ejection fraction (typically <40%). ECG can show various abnormalities but is nonspecific.",
            management: "Management focuses on standard heart failure therapy, including diuretics, ACE inhibitors/ARBs, beta-blockers, and aldosterone antagonists. In advanced cases, cardiac transplantation or a left ventricular assist device (LVAD) may be necessary. Always check current local and international heart failure guidelines.",
            complications: "Progressive heart failure, arrhythmias, thromboembolism, and sudden cardiac death.",
            prognosis: "Poor without treatment. With optimal medical therapy, survival has improved, but many patients eventually progress to end-stage heart failure.",
          },
        ]
      }
    ]
  },
  {
    system: "Respiratory System",
    icon: Wind,
    categories: [
      {
        name: "Obstructive Lung Diseases",
        diseases: [
             { 
            title: "Chronic Obstructive Pulmonary Disease (COPD)",
            synonyms: "Emphysema and Chronic Bronchitis",
            overview: "COPD is a common, preventable, and treatable disease that is characterized by persistent respiratory symptoms and airflow limitation that is due to airway and/or alveolar abnormalities, usually caused by significant exposure to noxious particles or gases.",
            learningObjectives: [
                "Differentiate between the pathological definitions of emphysema and chronic bronchitis.",
                "Understand the central role of cigarette smoking in the pathogenesis of COPD.",
                "Describe the key morphological features of emphysema (e.g., centriacinar) and chronic bronchitis (Reid index).",
                "Relate the pathology to the clinical presentation of dyspnea and chronic cough."
            ],
            tags: {
                organ: "Lung",
                system: "Respiratory",
                category: "Degenerative",
                level: "Intermediate"
            },
            etiology: [
                "Cigarette smoking (most common)",
                "Alpha-1 antitrypsin deficiency (a genetic cause of emphysema)",
                "Air pollution",
                "Occupational dusts and chemicals"
            ],
            pathogenesis: "Emphysema: Inhaled irritants cause chronic inflammation with an influx of neutrophils and macrophages. These cells release proteases (like elastase) that break down elastin in the alveolar walls, leading to irreversible airspace enlargement. Chronic Bronchitis: Irritants cause hypertrophy of submucosal glands in the large airways and an increase in goblet cells in small airways, leading to excessive mucus production.",
            morphology: {
                gross: "Emphysema: Lungs are voluminous and pale. Centriacinar emphysema (most common in smokers) affects the upper lobes. Panacinar emphysema (seen in alpha-1 antitrypsin deficiency) affects the lower lobes. Chronic Bronchitis: The bronchial walls are thickened and the airways may be filled with mucus plugs.",
                microscopic: "Emphysema: Abnormally large alveoli with destruction of the septal walls. Chronic Bronchitis: The Reid index (ratio of the thickness of the mucous gland layer to the thickness of the bronchial wall) is increased (>0.4).",
                imageHint: "emphysema lung gross"
            },
            clinicalFeatures: "Presents with a long history of progressively worsening shortness of breath (dyspnea), chronic cough, and sputum production. Patients may be 'pink puffers' (predominantly emphysema, thin, tachypneic) or 'blue bloaters' (predominantly bronchitis, cyanotic, edematous).",
            investigations: "Spirometry is required for diagnosis, showing a reduced FEV1/FVC ratio (<0.7) that is not fully reversible with bronchodilators. Chest X-ray may show hyperinflation and flattened diaphragms.",
            management: "Smoking cessation is the single most important intervention. Bronchodilators (e.g., beta-agonists, anticholinergics) are the mainstay of symptomatic therapy. Inhaled corticosteroids may be used in patients with frequent exacerbations. Supplemental oxygen is used for chronic hypoxemia. Always check current local and international COPD guidelines (e.g., GOLD).",
            complications: "Acute exacerbations, respiratory failure, pulmonary hypertension, and cor pulmonale (right heart failure).",
            prognosis: "Progressive disease, but the rate of decline can be slowed by smoking cessation.",
          },
        ]
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
