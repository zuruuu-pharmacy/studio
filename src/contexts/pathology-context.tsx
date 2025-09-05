
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';

export interface CaseStudy {
  id: string;
  title: string;
  history: string;
  specialty: string;
  findings: string;
  diagnosis: string;
  discussion: string;
  tags: {
    organ: string;
    type: string;
    difficulty: string;
  };
  quiz: {
    question: string;
    options: string[];
    answer: string;
  }[];
  imageHint?: string;
}

const initialCaseStudies: Omit<CaseStudy, 'id'>[] = [
    {
        title: "Case 01: A 65-year-old male with a lung mass",
        history: "A 65-year-old male with a 40-pack-year smoking history presents with a chronic cough, hemoptysis, and a 10-lb weight loss over the past 3 months. He denies fever or night sweats.",
        specialty: "Pulmonary Pathology",
        findings: "Chest X-ray reveals a 3 cm spiculated mass in the right upper lobe. Biopsy shows nests of malignant cells with abundant eosinophilic cytoplasm, keratin pearls, and distinct intercellular bridges.",
        diagnosis: "Squamous Cell Carcinoma of the lung.",
        discussion: "The key histological features here are the keratin pearls and intercellular bridges, which are pathognomonic for squamous differentiation. The patient's extensive smoking history is the primary risk factor. This case highlights the classic presentation and morphology of one of the major types of lung cancer.",
        tags: {
            organ: "🫁 Lung",
            type: "🧪 Cancer",
            difficulty: "🔥 Complex",
        },
        quiz: [
            {
                question: "What is the most definitive histological feature for this diagnosis?",
                options: ["Gland formation", "Keratin pearls", "Small blue cells", "Rosettes"],
                answer: "Keratin pearls"
            }
        ],
        imageHint: "lung cancer histology",
    },
    {
        title: "Case 02: A 45-year-old female with joint pain",
        history: "A 45-year-old female presents with symmetrical swelling and pain in the small joints of her hands and wrists (MCP, PIP joints), with morning stiffness lasting over an hour for the past 6 months.",
        specialty: "Rheumatologic Pathology",
        findings: "Blood tests show elevated rheumatoid factor and anti-CCP antibodies. Synovial biopsy reveals marked synovial hyperplasia with villous-like projections, dense lymphoplasmacytic infiltrates (some forming germinal centers), and fibrinoid necrosis. This destructive tissue is known as a pannus.",
        diagnosis: "Rheumatoid Arthritis.",
        discussion: "This is a classic presentation of Rheumatoid Arthritis, an autoimmune disease. The key is the symmetrical small-joint arthritis and the specific serological markers. The histology showing pannus formation confirms the destructive nature of the inflammation, which eventually erodes cartilage and bone.",
        tags: {
            organ: "🦴 Rheumatology",
            type: "🧑‍⚕️ Autoimmune",
            difficulty: "⭐ Classic",
        },
        quiz: [
             {
                question: "The destructive, inflamed synovial tissue in this condition is known as:",
                options: ["Tophi", "Osteophyte", "Pannus", "Granuloma"],
                answer: "Pannus"
            }
        ],
        imageHint: "rheumatoid arthritis synovium",
    },
    {
        title: "Case 03: A 20-year-old male with lymphadenopathy",
        history: "A 20-year-old male presents with a painless, enlarging lymph node in his neck for the past two months, accompanied by intermittent fever ('Pel-Ebstein fever') and night sweats.",
        specialty: "Hematopathology",
        findings: "Lymph node biopsy reveals effacement of the normal architecture by a mixed inflammatory infiltrate. Scattered among these are large, binucleated cells with prominent eosinophilic nucleoli, resembling 'owl eyes'. These are Reed-Sternberg cells. Immunohistochemistry shows these cells are positive for CD30 and CD15.",
        diagnosis: "Hodgkin Lymphoma (Nodular Sclerosis type).",
        discussion: "The presence of Reed-Sternberg cells is diagnostic for Hodgkin Lymphoma. The mixed inflammatory background is characteristic. The specific subtype is determined by the overall architecture and cellular composition. The CD30+/CD15+ immunophenotype is classic.",
        tags: {
            organ: "🧬 Hematology",
            type: "🧪 Lymphoma",
            difficulty: "⭐ Classic",
        },
        quiz: [
             {
                question: "The diagnostic cell for Hodgkin Lymphoma is the:",
                options: ["Plasma cell", "Myeloblast", "Reed-Sternberg cell", "Atypical lymphocyte"],
                answer: "Reed-Sternberg cell"
            }
        ],
        imageHint: "hodgkin lymphoma reed sternberg",
    },
    {
        title: "Case 04: A 58-year-old man with chest pain",
        history: "A 58-year-old man with a history of hypertension and hyperlipidemia presents to the emergency department with severe, crushing substernal chest pain radiating to his left arm. The pain started 2 hours ago.",
        specialty: "Cardiovascular Pathology",
        findings: "ECG shows ST-segment elevation in the anterior leads. Cardiac troponin levels are markedly elevated. The patient undergoes coronary angiography but dies. Autopsy of the heart reveals a pale, well-demarcated area in the anterior wall of the left ventricle. Microscopically, this area shows coagulative necrosis with loss of nuclei, preserved cell outlines, and early neutrophil infiltration.",
        diagnosis: "Acute Myocardial Infarction.",
        discussion: "This is a classic case of an MI. The clinical presentation and ECG/troponin findings are typical. The key pathological finding is coagulative necrosis, the hallmark of ischemic injury in most solid organs (except the brain). The presence of neutrophils indicates an early inflammatory response, consistent with an infarction that is several hours to a few days old.",
        tags: {
            organ: "❤️ Heart",
            type: "ichemic",
            difficulty: "⭐ Classic"
        },
        quiz: [
            {
                question: "What is the characteristic type of necrosis seen in a myocardial infarction?",
                options: ["Liquefactive necrosis", "Caseous necrosis", "Coagulative necrosis", "Fat necrosis"],
                answer: "Coagulative necrosis"
            }
        ],
        imageHint: "myocardial infarction histology"
    },
    {
        title: "Case 05: A 30-year-old woman with bloody diarrhea",
        history: "A 30-year-old woman presents with a 4-week history of recurrent bloody diarrhea, lower abdominal cramps, and tenesmus. She has no recent travel history or sick contacts.",
        specialty: "Gastrointestinal Pathology",
        findings: "Colonoscopy reveals continuous inflammation starting from the rectum and extending proximally. The mucosa is erythematous, friable, and shows loss of normal vascular pattern. Biopsies show distortion of crypt architecture, with branched crypts and a diffuse inflammatory infiltrate in the lamina propria, including prominent plasma cells and neutrophils invading the crypt epithelium (cryptitis and crypt abscesses). The inflammation is limited to the mucosa and submucosa.",
        diagnosis: "Ulcerative Colitis.",
        discussion: "Ulcerative colitis is an inflammatory bowel disease characterized by continuous inflammation limited to the colon and rectum. The key features are the continuous pattern of involvement and the superficial inflammation (mucosa/submucosa). This is in contrast to Crohn's disease, which can affect any part of the GI tract in a discontinuous ('skip-lesion') pattern and is typically transmural.",
        tags: {
            organ: "🩺 GI Tract",
            type: "炎症性 Autoimmune",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "Which feature most strongly distinguishes Ulcerative Colitis from Crohn's disease in this case?",
                options: ["Presence of granulomas", "Transmural inflammation", "Continuous inflammation limited to the colon", "Presence of fistulas"],
                answer: "Continuous inflammation limited to the colon"
            }
        ],
        imageHint: "ulcerative colitis histology"
    },
    {
        title: "Case 06: A 70-year-old woman with a pigmented skin lesion",
        history: "A 70-year-old woman with a history of extensive sun exposure is concerned about a mole on her back that has recently changed in size and color. It is now approximately 7 mm in diameter.",
        specialty: "Dermatopathology",
        findings: "On examination, the lesion is an asymmetrical, variegated brown-to-black macule with irregular borders. An excisional biopsy is performed. Histology shows a proliferation of atypical, large melanocytes with irregular nuclei and prominent nucleoli, arranged in poorly formed nests and as single cells at all levels of the epidermis (pagetoid spread). Similar atypical cells are seen invading the dermis.",
        diagnosis: "Malignant Melanoma, Superficial Spreading type.",
        discussion: "The 'ABCDEs' of melanoma (Asymmetry, Border irregularity, Color variegation, Diameter >6mm, Evolving) are classic clinical signs. The key histological features of malignancy are the architectural disarray and the significant cytological atypia of the melanocytes. The upward (pagetoid) spread within the epidermis and invasion into the dermis are definitive for malignant melanoma.",
        tags: {
            organ: "🔬 Skin",
            type: "🧪 Cancer",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "The upward migration of malignant melanocytes within the epidermis is known as:",
                options: ["Acanthosis", "Spongiosis", "Pagetoid spread", "Hyperkeratosis"],
                answer: "Pagetoid spread"
            }
        ],
        imageHint: "melanoma histology"
    },
    {
        title: "Case 07: A 12-year-old boy with dark urine",
        history: "A 12-year-old boy presents with puffy eyes, swollen feet, and dark, 'cola-colored' urine. The symptoms began two weeks after he had a sore throat.",
        specialty: "Renal Pathology",
        findings: "Urinalysis shows hematuria, red blood cell casts, and mild proteinuria. Blood tests reveal elevated anti-streptolysin O (ASO) titers. A renal biopsy shows enlarged, hypercellular glomeruli due to a proliferation of endothelial and mesangial cells, as well as an influx of neutrophils. Immunofluorescence microscopy shows granular deposits of IgG and C3 along the glomerular basement membrane.",
        diagnosis: "Post-Streptococcal Glomerulonephritis.",
        discussion: "This is a classic example of a nephritic syndrome caused by an immune complex-mediated glomerulonephritis. The history of a recent sore throat (pharyngitis) followed by acute kidney symptoms points towards a post-infectious cause. The elevated ASO titer confirms a recent streptococcal infection. The key biopsy finding is the 'hump-like' subepithelial deposits seen on electron microscopy, which correspond to the granular IgG/C3 deposits seen on immunofluorescence.",
        tags: {
            organ: "💧 Renal",
            type: "🧑‍⚕️ Immune-mediated",
            difficulty: "⭐ Classic"
        },
        quiz: [
            {
                question: "What is the typical finding on immunofluorescence microscopy for this condition?",
                options: ["Linear deposits of IgG", "Granular deposits of IgG and C3", "No immune deposits", "IgA deposits in the mesangium"],
                answer: "Granular deposits of IgG and C3"
            }
        ],
        imageHint: "glomerulonephritis histology"
    },
    {
        title: "Case 08: A 55-year-old woman with postmenopausal bleeding",
        history: "A 55-year-old obese woman with a history of type 2 diabetes presents with an episode of vaginal bleeding, one year after her last menstrual period.",
        specialty: "Gynecologic Pathology",
        findings: "An endometrial biopsy is performed. The histology shows endometrial glands that are crowded, back-to-back, with complex architectural patterns (glandular budding and infoldings) and cytologic atypia. There is no evidence of stromal invasion.",
        diagnosis: "Endometrial Hyperplasia with Atypia (Endometrioid Intraepithelial Neoplasia).",
        discussion: "Postmenopausal bleeding is an alarming sign that requires investigation. The patient has several risk factors for endometrial cancer, including obesity (peripheral conversion of androgens to estrogen) and diabetes. The biopsy shows a precursor lesion to endometrioid adenocarcinoma, the most common type of endometrial cancer. The architectural crowding and cytologic atypia are key features that distinguish it from benign hyperplasia. This diagnosis carries a high risk of progression to or co-existence with carcinoma.",
        tags: {
            organ: "♀️ Gynecology",
            type: "🧪 Pre-cancerous",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "The most significant risk factor for this condition in this patient is:",
                options: ["Age", "Obesity", "Postmenopausal status", "History of childbirth"],
                answer: "Obesity"
            }
        ],
        imageHint: "endometrial hyperplasia histology"
    },
    {
        title: "Case 09: A 40-year-old man with difficulty swallowing",
        history: "A 40-year-old man presents with a several-year history of progressive difficulty swallowing (dysphagia) for both solids and liquids, along with intermittent regurgitation of undigested food.",
        specialty: "Gastrointestinal Pathology",
        findings: "A barium swallow study shows a dilated esophagus with a narrowed, 'bird's beak' appearance at the gastroesophageal junction. Manometry confirms aperistalsis in the esophageal body and incomplete relaxation of the lower esophageal sphincter (LES). An esophageal biopsy from the LES shows a reduced number of ganglion cells in the myenteric plexus.",
        diagnosis: "Achalasia.",
        discussion: "Achalasia is a primary esophageal motility disorder characterized by the two key manometric findings: aperistalsis and impaired LES relaxation. The underlying pathology is the loss of inhibitory ganglion cells in the myenteric (Auerbach's) plexus, which are necessary for coordinated peristalsis and LES opening. This leads to the functional obstruction and dilation of the esophagus seen on imaging.",
        tags: {
            organ: "🩺 GI Tract",
            type: "Motility Disorder",
            difficulty: "⭐ Classic"
        },
        quiz: [
            {
                question: "The underlying pathophysiology of achalasia involves the loss of which cells?",
                options: ["Parietal cells", "Goblet cells", "Ganglion cells in the myenteric plexus", "Chief cells"],
                answer: "Ganglion cells in the myenteric plexus"
            }
        ],
        imageHint: "achalasia barium swallow"
    },
    {
        title: "Case 10: A 60-year-old with a 'pearly' skin lesion",
        history: "A 60-year-old fair-skinned man who worked as a farmer presents with a slow-growing, non-healing sore on his nose that occasionally bleeds.",
        specialty: "Dermatopathology",
        findings: "Examination reveals a 0.8 cm pearly papule with fine, overlying telangiectasias (small blood vessels) and a slightly rolled border. A shave biopsy is performed. Histology shows nests of basaloid cells with scant cytoplasm and hyperchromatic nuclei, descending from the epidermis into the dermis. The nests show peripheral palisading of the nuclei and a surrounding fibromyxoid stroma.",
        diagnosis: "Basal Cell Carcinoma (Nodular type).",
        discussion: "Basal cell carcinoma is the most common form of skin cancer, strongly associated with chronic sun exposure. The clinical description of a 'pearly' papule with telangiectasias is classic. The key histological features are the nests of 'basaloid' cells (resembling the basal layer of the epidermis) and the characteristic peripheral palisading of nuclei at the edge of the nests.",
        tags: {
            organ: "🔬 Skin",
            type: "🧪 Cancer",
            difficulty: "⭐ Classic"
        },
        quiz: [
            {
                question: "Which histological feature is most characteristic of Basal Cell Carcinoma?",
                options: ["Keratin pearls", "Intercellular bridges", "Peripheral palisading", "Gland formation"],
                answer: "Peripheral palisading"
            }
        ],
        imageHint: "basal cell carcinoma histology"
    }
];


interface PathologyContextType {
  caseStudies: CaseStudy[];
  addCaseStudy: (caseStudy: Omit<CaseStudy, 'id'>) => void;
  completedCases: Set<string>;
  toggleCaseCompletion: (caseId: string) => void;
}

const PathologyContext = createContext<PathologyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pathology_data_v3'; // Bump version for data model change

export function PathologyProvider({ children }: { children: ReactNode }) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [completedCases, setCompletedCases] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData.cases) && parsedData.cases.length > 0) {
            setCaseStudies(parsedData.cases);
        } else {
            // Load initial data if none saved
            setCaseStudies(initialCaseStudies.map((c, i) => ({...c, id: `case${i+1}`})));
        }
        if (Array.isArray(parsedData.completed)) {
            setCompletedCases(new Set(parsedData.completed));
        }
      } else {
         // Load initial data if no save file
         setCaseStudies(initialCaseStudies.map((c, i) => ({...c, id: `case${i+1}`})));
      }
    } catch (error) {
      console.error("Failed to load pathology data from localStorage", error);
       setCaseStudies(initialCaseStudies.map((c, i) => ({...c, id: `case${i+1}`})));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
        try {
            const dataToSave = {
                cases: caseStudies,
                completed: Array.from(completedCases)
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save pathology data to localStorage", error);
        }
    }
  }, [caseStudies, completedCases, isLoaded]);

  const addCaseStudy = (caseStudy: Omit<CaseStudy, 'id'>) => {
    const newCase: CaseStudy = {
      ...caseStudy,
      id: `case_${Date.now().toString()}`,
    };
    setCaseStudies(prevCases => [newCase, ...prevCases]);
  };

  const toggleCaseCompletion = (caseId: string) => {
    setCompletedCases(prev => {
        const newSet = new Set(prev);
        if (newSet.has(caseId)) {
            newSet.delete(caseId);
        } else {
            newSet.add(caseId);
        }
        return newSet;
    });
  };
  
  const contextValue = useMemo(() => ({ caseStudies, addCaseStudy, completedCases, toggleCaseCompletion }), [caseStudies, completedCases]);

  return (
    <PathologyContext.Provider value={contextValue}>
      {children}
    </PathologyContext.Provider>
  );
}

export function usePathology() {
  const context = useContext(PathologyContext);
  if (context === undefined) {
    throw new Error('usePathology must be used within a PathologyProvider');
  }
  return context;
}
