
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
  imageUrl: string;
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
}

const initialCaseStudies: CaseStudy[] = [
    {
        id: "case1",
        title: "Case 01: A 65-year-old male with a lung mass",
        history: "A 65-year-old male with a 40-pack-year smoking history presents with a chronic cough, hemoptysis, and a 10-lb weight loss over the past 3 months. He denies fever or night sweats.",
        specialty: "Pulmonary Pathology",
        findings: "Chest X-ray reveals a 3 cm spiculated mass in the right upper lobe. Biopsy shows nests of malignant cells with abundant eosinophilic cytoplasm, keratin pearls, and distinct intercellular bridges.",
        diagnosis: "Squamous Cell Carcinoma of the lung.",
        discussion: "The key histological features here are the keratin pearls and intercellular bridges, which are pathognomonic for squamous differentiation. The patient's extensive smoking history is the primary risk factor. This case highlights the classic presentation and morphology of one of the major types of lung cancer.",
        imageUrl: "https://picsum.photos/id/101/600/400",
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
        ]
    },
    {
        id: "case2",
        title: "Case 02: A 45-year-old female with joint pain",
        history: "A 45-year-old female presents with symmetrical swelling and pain in the small joints of her hands and wrists (MCP, PIP joints), with morning stiffness lasting over an hour for the past 6 months.",
        specialty: "Rheumatologic Pathology",
        findings: "Blood tests show elevated rheumatoid factor and anti-CCP antibodies. Synovial biopsy reveals marked synovial hyperplasia with villous-like projections, dense lymphoplasmacytic infiltrates (some forming germinal centers), and fibrinoid necrosis. This destructive tissue is known as a pannus.",
        diagnosis: "Rheumatoid Arthritis.",
        discussion: "This is a classic presentation of Rheumatoid Arthritis, an autoimmune disease. The key is the symmetrical small-joint arthritis and the specific serological markers. The histology showing pannus formation confirms the destructive nature of the inflammation, which eventually erodes cartilage and bone.",
        imageUrl: "https://picsum.photos/id/102/600/400",
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
        ]
    },
    {
        id: "case3",
        title: "Case 03: A 20-year-old male with lymphadenopathy",
        history: "A 20-year-old male presents with a painless, enlarging lymph node in his neck for the past two months, accompanied by intermittent fever ('Pel-Ebstein fever') and night sweats.",
        specialty: "Hematopathology",
        findings: "Lymph node biopsy reveals effacement of the normal architecture by a mixed inflammatory infiltrate. Scattered among these are large, binucleated cells with prominent eosinophilic nucleoli, resembling 'owl eyes'. These are Reed-Sternberg cells. Immunohistochemistry shows these cells are positive for CD30 and CD15.",
        diagnosis: "Hodgkin Lymphoma (Nodular Sclerosis type).",
        imageUrl: "https://picsum.photos/id/103/600/400",
        tags: {
            organ: "🧬 Hematology",
            type: "🧪 Lymphoma",
            difficulty: "⭐ Classic",
        },
        discussion: "The presence of Reed-Sternberg cells is diagnostic for Hodgkin Lymphoma. The mixed inflammatory background is characteristic. The specific subtype is determined by the overall architecture and cellular composition. The CD30+/CD15+ immunophenotype is classic.",
        quiz: [
             {
                question: "The diagnostic cell for Hodgkin Lymphoma is the:",
                options: ["Plasma cell", "Myeloblast", "Reed-Sternberg cell", "Atypical lymphocyte"],
                answer: "Reed-Sternberg cell"
            }
        ]
    },
];


interface PathologyContextType {
  caseStudies: CaseStudy[];
  addCaseStudy: (caseStudy: Omit<CaseStudy, 'id'>) => void;
  completedCases: Set<string>;
  toggleCaseCompletion: (caseId: string) => void;
}

const PathologyContext = createContext<PathologyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pathology_data_v2'; // Bump version for progress

export function PathologyProvider({ children }: { children: ReactNode }) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies);
  const [completedCases, setCompletedCases] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData.cases) && parsedData.cases.length > 0) {
            setCaseStudies(parsedData.cases);
        }
        if (Array.isArray(parsedData.completed)) {
            setCompletedCases(new Set(parsedData.completed));
        }
      }
    } catch (error) {
      console.error("Failed to load pathology data from localStorage", error);
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
