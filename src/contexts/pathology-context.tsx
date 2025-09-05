
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
    },
    {
        title: "Case 11: A 28-year-old female with flank pain and fever",
        history: "A 28-year-old female presents to the ER with a two-day history of high fever, chills, and severe right-sided flank pain. She also reports dysuria and increased urinary frequency.",
        specialty: "Renal Pathology",
        findings: "Urinalysis is remarkable for pyuria, bacteriuria, and white blood cell casts. A urine culture grows E. coli. A renal biopsy (for educational purposes) would show a dense neutrophilic infiltrate within the renal interstitium and tubules, with associated tubular destruction and abscess formation.",
        diagnosis: "Acute Pyelonephritis.",
        discussion: "This case is a classic example of an acute kidney infection (pyelonephritis), which is an infection of the kidney parenchyma and renal pelvis. The presence of white blood cell casts is the key finding that localizes the infection to the kidney, distinguishing it from a lower UTI like cystitis. The causative organism is most commonly E. coli ascending from the lower urinary tract.",
        tags: {
            organ: "💧 Renal",
            type: "🦠 Infectious",
            difficulty: "⭐ Classic",
        },
        quiz: [
            {
                question: "Which finding on urinalysis is most specific for pyelonephritis versus cystitis?",
                options: ["Pyuria (WBCs in urine)", "Bacteriuria (bacteria in urine)", "White blood cell casts", "Hematuria (blood in urine)"],
                answer: "White blood cell casts"
            }
        ],
        imageHint: "pyelonephritis histology"
    },
    {
        title: "Case 12: A 78-year-old woman with memory loss",
        history: "A 78-year-old woman is brought in by her family due to a 5-year history of progressive memory loss, particularly for recent events. She is also experiencing confusion, personality changes, and difficulty with daily tasks like cooking.",
        specialty: "Neuropathology",
        findings: "MRI shows diffuse cortical atrophy, especially in the temporal and parietal lobes. At autopsy, the brain is grossly atrophic. Microscopic examination reveals numerous extracellular neuritic plaques composed of amyloid-beta (Aβ) peptides and intracellular neurofibrillary tangles composed of hyperphosphorylated tau protein. Congo red staining of plaques shows apple-green birefringence under polarized light.",
        diagnosis: "Alzheimer's Disease.",
        discussion: "Alzheimer's Disease is the most common cause of dementia in the elderly. The diagnosis is confirmed by the characteristic histopathological findings of Aβ plaques and neurofibrillary tangles. These lesions lead to synaptic dysfunction, neuronal loss, and the macroscopic brain atrophy seen on imaging. The deposition of amyloid can also be seen in cerebral blood vessels, a condition known as cerebral amyloid angiopathy.",
        tags: {
            organ: "🧠 Neurology",
            type: "Degenerative",
            difficulty: "⭐ Classic",
        },
        quiz: [
            {
                question: "What are the two hallmark microscopic findings of Alzheimer's Disease?",
                options: ["Lewy bodies and alpha-synuclein", "Prion protein and spongiform change", "Neuritic plaques and neurofibrillary tangles", "Oligodendrocyte loss and demyelination"],
                answer: "Neuritic plaques and neurofibrillary tangles"
            }
        ],
        imageHint: "alzheimer's disease histology"
    },
    {
        title: "Case 13: A 62-year-old man with jaundice",
        history: "A 62-year-old man with a long history of heavy alcohol use and Hepatitis C infection presents with yellowing of the skin and eyes (jaundice), a swollen abdomen (ascites), and confusion.",
        specialty: "Gastrointestinal Pathology",
        findings: "Liver function tests are severely deranged. A liver biopsy shows diffuse transformation of the liver into regenerative parenchymal nodules surrounded by dense fibrous bands. The normal lobular architecture of the liver is completely effaced. The fibrosis bridges between portal tracts and central veins.",
        diagnosis: "Cirrhosis of the Liver.",
        discussion: "Cirrhosis represents the end stage of chronic liver disease, resulting from various insults such as chronic viral hepatitis, alcohol abuse, or non-alcoholic steatohepatitis (NASH). It is defined by the presence of bridging fibrous septa and parenchymal nodule formation. This disruption of architecture leads to portal hypertension (causing ascites) and hepatocellular failure (causing jaundice and encephalopathy).",
        tags: {
            organ: "🩺 GI Tract",
            type: "Chronic Disease",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "The defining histological feature of cirrhosis is:",
                options: ["Steatosis (fatty change)", "Acute inflammation", "Bridging fibrosis and regenerative nodules", "Bile duct proliferation"],
                answer: "Bridging fibrosis and regenerative nodules"
            }
        ],
        imageHint: "liver cirrhosis histology"
    },
    {
        title: "Case 14: A 35-year-old woman with a neck nodule",
        history: "A 35-year-old woman presents for evaluation of a painless lump in her neck that she noticed a month ago. She has no other symptoms. She has a history of radiation exposure to the neck during childhood for an unrelated condition.",
        specialty: "Endocrine Pathology",
        findings: "Ultrasound confirms a 1.5 cm solid nodule in the right lobe of the thyroid. A fine-needle aspiration (FNA) is performed. The cytology shows cells arranged in papillary clusters with characteristic nuclear features: enlarged, overlapping nuclei with finely dispersed, pale chromatin ('Orphan Annie eyes'), nuclear grooves, and intranuclear pseudoinclusions.",
        diagnosis: "Papillary Thyroid Carcinoma.",
        discussion: "Papillary thyroid carcinoma is the most common type of thyroid cancer. It is strongly associated with prior radiation exposure. The diagnosis is made primarily on the basis of its unique and characteristic nuclear features, which are often sufficient for diagnosis even on FNA cytology. The prognosis is generally excellent.",
        tags: {
            organ: "🦋 Endocrine",
            type: "🧪 Cancer",
            difficulty: "⭐ Classic"
        },
        quiz: [
            {
                question: "Which nuclear feature is considered pathognomonic for Papillary Thyroid Carcinoma?",
                options: ["Prominent nucleoli", "Hyperchromatic, small nuclei", "'Orphan Annie eye' nuclei with grooves", "Smudged chromatin"],
                answer: "'Orphan Annie eye' nuclei with grooves"
            }
        ],
        imageHint: "papillary thyroid carcinoma histology"
    },
    {
        title: "Case 15: A 50-year-old man with a chronic cough",
        history: "A 50-year-old man, an immigrant from a high-prevalence country, presents with a chronic cough lasting over three months, accompanied by weight loss, fever, night sweats, and occasional hemoptysis.",
        specialty: "Infectious Disease Pathology",
        findings: "Chest X-ray shows a cavity in the apex of the right lung. A sputum sample is obtained for staining and culture. An acid-fast stain (Ziehl-Neelsen stain) reveals red, rod-shaped organisms. A lung biopsy from the edge of the cavity shows caseating granulomas, which are collections of activated macrophages (epithelioid histiocytes) and multinucleated giant cells (Langhans cells), with a central area of amorphous, eosinophilic necrotic debris.",
        diagnosis: "Tuberculosis.",
        discussion: "Tuberculosis, caused by Mycobacterium tuberculosis, is a major global health problem. The hallmark of the disease is the formation of caseating granulomas in response to the infection. The presence of acid-fast bacilli on stain or culture confirms the diagnosis. The upper lobe location is typical for secondary (reactivation) tuberculosis.",
        tags: {
            organ: "🫁 Lung",
            type: "🦠 Infectious",
            difficulty: "⭐ Classic"
        },
        quiz: [
            {
                question: "What is the characteristic type of necrosis seen in tuberculosis?",
                options: ["Coagulative necrosis", "Liquefactive necrosis", "Caseous necrosis", "Fibrinoid necrosis"],
                answer: "Caseous necrosis"
            }
        ],
        imageHint: "tuberculosis granuloma histology"
    },
    {
        title: "Case 16: A 62-year-old with long-standing heartburn",
        history: "A 62-year-old man with a 15-year history of gastroesophageal reflux disease (GERD), for which he takes antacids intermittently, presents for a routine endoscopy.",
        specialty: "Gastrointestinal Pathology",
        findings: "Endoscopy reveals tongues of red, velvety mucosa extending proximally from the gastroesophageal junction, in contrast to the normal pale, squamous esophageal mucosa. Biopsies from this area show metaplasia of the normal stratified squamous epithelium to an intestinal-type columnar epithelium containing goblet cells.",
        diagnosis: "Barrett Esophagus.",
        discussion: "Barrett esophagus is a complication of chronic GERD, where the normal esophageal squamous epithelium undergoes metaplasia to a more acid-resistant intestinal-type epithelium. The key diagnostic feature is the presence of goblet cells. This condition is clinically significant because it is a major risk factor for developing esophageal adenocarcinoma, and patients require regular surveillance.",
        tags: {
            organ: "🩺 GI Tract",
            type: "🧪 Pre-cancerous",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "The definitive histological finding for Barrett Esophagus is the presence of:",
                options: ["Squamous cells", "Goblet cells", "Parietal cells", "Chief cells"],
                answer: "Goblet cells"
            }
        ],
        imageHint: "barrett esophagus histology"
    },
    {
        title: "Case 17: A 68-year-old with intermittent claudication",
        history: "A 68-year-old man with a history of smoking and type 2 diabetes complains of cramping pain in his calf muscles that occurs on walking a certain distance and is relieved by rest (intermittent claudication).",
        specialty: "Cardiovascular Pathology",
        findings: "Ankle-brachial index is low, confirming peripheral artery disease. An angiogram shows severe stenosis of the femoral artery. A cross-section of a similar artery at autopsy would show a large, eccentric intimal plaque with a fibrous cap overlying a central necrotic core containing lipid debris and cholesterol crystals. The plaque is complicated by calcification.",
        diagnosis: "Atherosclerosis.",
        discussion: "Atherosclerosis is the underlying cause of most cardiovascular disease, including coronary artery disease, stroke, and peripheral artery disease. It is a chronic inflammatory and lipid-driven disease of the arterial intima. The characteristic lesion, the atheroma or fibrofatty plaque, narrows the vessel lumen, leading to ischemia. Plaque rupture can lead to acute thrombosis and infarction.",
        tags: {
            organ: "❤️ Heart",
            type: "Degenerative",
            difficulty: "⭐ Classic"
        },
        quiz: [
            {
                question: "The characteristic lesion of atherosclerosis is known as the:",
                options: ["Granuloma", "Pannus", "Atheroma", "Callus"],
                answer: "Atheroma"
            }
        ],
        imageHint: "atherosclerosis histology"
    },
    {
        title: "Case 18: A 50-year-old man with a painful big toe",
        history: "A 50-year-old obese man presents with the sudden onset of excruciating pain, redness, and swelling in his left great toe. He reports eating a large meal with steak and drinking several beers the night before.",
        specialty: "Rheumatologic Pathology",
        findings: "Physical exam reveals a warm, tender, and swollen first metatarsophalangeal joint. Aspiration of the joint fluid is performed. Under polarized light microscopy, the fluid reveals needle-shaped, negatively birefringent crystals within neutrophils.",
        diagnosis: "Gout.",
        discussion: "Gout is an inflammatory arthritis caused by the deposition of monosodium urate (MSU) crystals in joints and soft tissues, resulting from hyperuricemia. The acute attack is triggered by the precipitation of these crystals, which are phagocytosed by neutrophils, leading to a massive inflammatory response. The key to diagnosis is the identification of the characteristic needle-shaped, negatively birefringent MSU crystals in synovial fluid.",
        tags: {
            organ: "🦴 Rheumatology",
            type: "Metabolic",
            difficulty: "⭐ Classic"
        },
        quiz: [
            {
                question: "What is the characteristic microscopic finding in the joint fluid of a patient with acute gout?",
                options: ["Calcium pyrophosphate crystals", "Positively birefringent crystals", "Needle-shaped, negatively birefringent crystals", "Cholesterol crystals"],
                answer: "Needle-shaped, negatively birefringent crystals"
            }
        ],
        imageHint: "gout crystals microscopy"
    },
    {
        title: "Case 19: A 75-year-old woman with abdominal pain",
        history: "A 75-year-old woman presents with left lower quadrant abdominal pain, fever, and leukocytosis. She has a known history of diverticulosis.",
        specialty: "Gastrointestinal Pathology",
        findings: "A CT scan of the abdomen shows inflammation of the sigmoid colon with thickening of the colonic wall and inflammatory stranding in the surrounding fat. A biopsy of an affected diverticulum (outpouching of the colonic mucosa and submucosa) shows mucosal inflammation with crypt abscesses and perforation at the base of the diverticulum.",
        diagnosis: "Acute Diverticulitis.",
        discussion: "Diverticulosis, the presence of diverticula, is common in older individuals in Western countries. Diverticulitis occurs when these diverticula become obstructed or perforate, leading to inflammation and infection. The pathology is essentially a localized perforation with a resulting pericolic abscess or inflammation. Complications can include abscess formation, fistula, or free perforation leading to peritonitis.",
        tags: {
            organ: "🩺 GI Tract",
            type: "炎症性 Inflammatory",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "Diverticulitis is defined as the inflammation of what pre-existing structures?",
                options: ["Polyps", "Haustra", "Diverticula", "Appendix"],
                answer: "Diverticula"
            }
        ],
        imageHint: "diverticulitis histology"
    },
    {
        title: "Case 20: A 70-year-old man with urinary symptoms",
        history: "A 70-year-old man presents with difficulty initiating urination, a weak urinary stream, and the need to urinate frequently at night (nocturia). A digital rectal exam reveals a hard, irregular nodule on his prostate. His serum prostate-specific antigen (PSA) level is elevated.",
        specialty: "Urologic Pathology",
        findings: "A prostate biopsy is performed. The histology shows small, crowded glands infiltrating the prostatic stroma. The cells have prominent nucleoli and there is a loss of the basal cell layer, which is normally present in benign glands (confirmed with immunohistochemistry for basal cell markers like p63).",
        diagnosis: "Prostatic Adenocarcinoma.",
        discussion: "Prostate cancer is one of the most common cancers in men. The diagnosis is made histologically on biopsy. The key features are the infiltrative pattern of small, crowded glands, the presence of prominent nucleoli, and, most importantly, the absence of the basal cell layer. The Gleason grading system is used to assess the architectural pattern of the cancer, which is a major prognostic factor.",
        tags: {
            organ: "♂️ Urology",
            type: "🧪 Cancer",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "Which feature is a key histological indicator of malignancy in prostate glands?",
                options: ["Presence of a basal cell layer", "Large, back-to-back glands", "Absence of a basal cell layer", "Squamous metaplasia"],
                answer: "Absence of a basal cell layer"
            }
        ],
        imageHint: "prostate adenocarcinoma histology"
    }
];


interface PathologyContextType {
  caseStudies: CaseStudy[];
  addCaseStudy: (caseStudy: Omit<CaseStudy, 'id'>) => void;
  completedCases: Set<string>;
  toggleCaseCompletion: (caseId: string) => void;
}

const PathologyContext = createContext<PathologyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pathology_data_v4'; // Bump version for new cases

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
