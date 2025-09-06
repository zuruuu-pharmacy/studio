
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
            type: "Autoimmune",
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
            difficulty: "⭐ Classic"
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
            type: "Inflammatory",
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
    },
    {
        title: "Case 21: A 48-year-old IV drug user with fever",
        history: "A 48-year-old man with a history of intravenous heroin use presents with a high fever, chills, and a new heart murmur. He also has tender nodules on his fingertips (Osler's nodes) and small, non-tender macules on his palms (Janeway lesions).",
        specialty: "Cardiovascular Pathology",
        findings: "Blood cultures are positive for Staphylococcus aureus. An echocardiogram reveals a large, mobile vegetation on the tricuspid valve. Pathological examination of a valve at autopsy would show large, friable vegetations composed of fibrin, inflammatory cells, and bacterial colonies, causing destruction of the valve leaflet.",
        diagnosis: "Infective Endocarditis (Acute).",
        discussion: "Infective endocarditis, especially in IV drug users, commonly affects the right-sided heart valves like the tricuspid. Staphylococcus aureus is a frequent causative agent of acute, rapidly destructive endocarditis. The vegetations can embolize, leading to septic infarcts in distant organs. The peripheral stigmata like Osler's nodes and Janeway lesions are classic, though not always present.",
        tags: {
            organ: "❤️ Heart",
            type: "🦠 Infectious",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "In intravenous drug users, which heart valve is most commonly affected by infective endocarditis?",
                options: ["Mitral valve", "Aortic valve", "Tricuspid valve", "Pulmonic valve"],
                answer: "Tricuspid valve"
            }
        ],
        imageHint: "infective endocarditis valve"
    },
    {
        title: "Case 22: A 68-year-old hospitalized patient with diarrhea",
        history: "A 68-year-old man was hospitalized for pneumonia and treated with a 10-day course of clindamycin. Three days after completing the antibiotic course, he develops profuse, watery, foul-smelling diarrhea, abdominal cramping, and fever.",
        specialty: "Gastrointestinal Pathology",
        findings: "Stool testing is positive for Clostridioides difficile toxins A and B. Colonoscopy reveals yellow-white plaques and pseudomembranes loosely adherent to the colonic mucosa. Biopsy of these pseudomembranes shows an exudate of fibrin, mucin, and neutrophils erupting from the surface of the colonic crypts, resembling a 'volcano' lesion.",
        diagnosis: "Pseudomembranous Colitis (due to C. difficile infection).",
        discussion: "C. difficile-associated diarrhea is a major healthcare-associated infection, often precipitated by antibiotic use that disrupts the normal gut flora. The toxins produced by C. diff cause cytoskeletal damage, leading to epithelial cell death and the formation of characteristic pseudomembranes. The 'volcano' or 'mushroom cloud' appearance on biopsy is classic.",
        tags: {
            organ: "🩺 GI Tract",
            type: "🦠 Infectious",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "The formation of pseudomembranes in this condition is directly caused by what?",
                options: ["Bacterial invasion of the mucosa", "Ischemic injury", "Bacterial toxins causing epithelial necrosis", "An autoimmune reaction"],
                answer: "Bacterial toxins causing epithelial necrosis"
            }
        ],
        imageHint: "pseudomembranous colitis histology"
    },
    {
        title: "Case 23: A 40-year-old with pruritic, purple papules",
        history: "A 40-year-old woman presents with an intensely itchy rash on her wrists and ankles that has been present for several weeks. She also notes lacy white streaks inside her cheeks.",
        specialty: "Dermatopathology",
        findings: "The skin lesions are polygonal, flat-topped, purple papules (the '6 Ps': Pruritic, Polygonal, Planar, Purple, Papules, and Plaques). The oral lesions are reticular white lines (Wickham's striae). A skin biopsy shows hyperkeratosis, a wedge-shaped hypergranulosis, and a dense, band-like lymphocytic infiltrate at the dermoepidermal junction that obscures it. Sawtooth-shaped rete ridges and colloid bodies are also seen.",
        diagnosis: "Lichen Planus.",
        discussion: "Lichen planus is a chronic inflammatory disorder of the skin and mucous membranes. The diagnosis is often made clinically but confirmed with biopsy. The key histological features are the band-like (lichenoid) lymphocytic infiltrate and the damage to the basal cell layer of the epidermis. It is thought to be a T-cell mediated autoimmune disease.",
        tags: {
            organ: "🔬 Skin",
            type: "🧑‍⚕️ Autoimmune",
            difficulty: "⭐ Classic"
        },
        quiz: [
            {
                question: "The characteristic pattern of inflammation in a skin biopsy of lichen planus is described as:",
                options: ["Perivascular", "Nodular", "Lichenoid (band-like)", "Diffuse"],
                answer: "Lichenoid (band-like)"
            }
        ],
        imageHint: "lichen planus histology"
    },
    {
        title: "Case 24: A 3-year-old boy with a large abdominal mass",
        history: "A 3-year-old boy is brought to the pediatrician by his mother, who felt a large, smooth mass in his abdomen while bathing him. The child is otherwise asymptomatic.",
        specialty: "Pediatric Pathology",
        findings: "An abdominal ultrasound and CT scan confirm a large, well-circumscribed mass arising from the right kidney. A nephrectomy is performed. The tumor is composed of three main components: primitive small blue cells (blastema), immature tubules (epithelium), and a spindled stroma. This is the classic triphasic histology.",
        diagnosis: "Wilms Tumor (Nephroblastoma).",
        discussion: "Wilms tumor is the most common primary renal tumor of childhood. The classic triphasic histology, containing blastemal, epithelial, and stromal elements, recapitulates the development of the normal kidney (nephrogenesis). Most cases are sporadic, but some are associated with genetic syndromes (e.g., WAGR syndrome, Beckwith-Wiedemann syndrome). Prognosis is generally very good with modern multi-modal therapy.",
        tags: {
            organ: "💧 Renal",
            type: "🧪 Cancer",
            difficulty: "🔥 Complex"
        },
        quiz: [
            {
                question: "The classic histology of a Wilms tumor is described as:",
                options: ["Monomorphic", "Biphasic", "Triphasic", "Pleomorphic"],
                answer: "Triphasic"
            }
        ],
        imageHint: "wilms tumor histology"
    },
    {
        title: "Case 25: A 45-year-old woman with a 'lumpy' breast",
        history: "A 45-year-old premenopausal woman complains of cyclic breast pain and nodularity that is most prominent before her menstrual periods. On physical exam, there are ill-defined, rubbery thickenings in the upper outer quadrants of both breasts.",
        specialty: "Breast Pathology",
        findings: "A biopsy of a nodular area shows a combination of cysts of varying sizes (some with apocrine metaplasia), stromal fibrosis, and a proliferation of epithelial cells within the terminal duct lobular unit (adenosis). There is no cytologic or architectural atypia.",
        diagnosis: "Fibrocystic Changes of the Breast.",
        discussion: "Fibrocystic change is an extremely common, benign condition and represents an exaggerated physiological response of the breast tissue to cyclic hormonal changes. It is not a single disease but a spectrum of changes. It is important to distinguish nonproliferative changes (like simple cysts and fibrosis) from proliferative changes, some of which (proliferative disease with atypia) confer a small increased risk for subsequent breast cancer.",
        tags: {
            organ: "♀️ Gynecology",
            type: "Benign/Physiologic",
            difficulty: "⭐ Classic",
        },
        quiz: [
            {
                question: "Which of the following is NOT a component of nonproliferative fibrocystic change?",
                options: ["Cyst formation", "Stromal fibrosis", "Atypical ductal hyperplasia", "Adenosis"],
                answer: "Atypical ductal hyperplasia"
            }
        ],
        imageHint: "fibrocystic breast change histology",
    },
    {
        title: "Case 26: A 25-year-old with abdominal pain and diarrhea",
        history: "A 25-year-old presents with a 6-month history of intermittent, crampy right lower quadrant abdominal pain and non-bloody diarrhea. He has also developed painful skin nodules and joint pain.",
        specialty: "Gastrointestinal Pathology",
        findings: "Colonoscopy reveals patchy areas of inflammation with deep, linear ulcers, creating a 'cobblestone' appearance. The inflammation involves the terminal ileum and parts of the colon, with segments of normal mucosa in between ('skip lesions'). Biopsy shows transmural inflammation (involving the full thickness of the bowel wall) and non-caseating granulomas.",
        diagnosis: "Crohn's Disease.",
        discussion: "Crohn's disease is an inflammatory bowel disease characterized by skip lesions and transmural inflammation. The presence of non-caseating granulomas is highly characteristic, though not seen in all cases. Unlike ulcerative colitis, it can affect any part of the GI tract, from mouth to anus, and its complications include fistulas and strictures due to the transmural nature of the inflammation.",
        tags: {
            organ: "🩺 GI Tract",
            type: "🧑‍⚕️ Autoimmune",
            difficulty: "🔥 Complex",
        },
        quiz: [
            {
                question: "Which feature is most characteristic of Crohn's Disease compared to Ulcerative Colitis?",
                options: ["Crypt abscesses", "Bloody diarrhea", "Continuous inflammation", "Transmural inflammation with skip lesions"],
                answer: "Transmural inflammation with skip lesions"
            }
        ],
        imageHint: "crohn's disease histology",
    },
    {
        title: "Case 27: A 6-year-old with a rash and fever",
        history: "A 6-year-old presents with a high fever for 5 days, a widespread rash, red 'strawberry' tongue, conjunctivitis, and swollen hands and feet. The child is irritable.",
        specialty: "Pediatric/Cardiovascular Pathology",
        findings: "Clinical diagnosis is the primary mode. Echocardiogram reveals coronary artery aneurysms. Pathologically, the disease involves a necrotizing vasculitis of medium-sized arteries, particularly the coronary arteries. The arterial wall shows an inflammatory infiltrate of lymphocytes, macrophages, and plasma cells.",
        diagnosis: "Kawasaki Disease.",
        discussion: "Kawasaki disease is an acute febrile vasculitis of childhood. The major concern is the development of coronary artery aneurysms, which can lead to thrombosis, myocardial infarction, and sudden death. Treatment with intravenous immunoglobulin (IVIG) and aspirin is crucial to reduce the risk of these cardiac complications.",
        tags: {
            organ: "❤️ Heart",
            type: "Vasculitis",
            difficulty: "🔥 Complex",
        },
        quiz: [
            {
                question: "What is the most serious potential complication of Kawasaki Disease?",
                options: ["Liver failure", "Kidney failure", "Coronary artery aneurysms", "Aseptic meningitis"],
                answer: "Coronary artery aneurysms"
            }
        ],
        imageHint: "kawasaki disease vasculitis",
    },
    {
        title: "Case 28: A 60-year-old with fatigue and bone pain",
        history: "A 60-year-old man presents with increasing fatigue, bone pain (especially in the back), and recurrent bacterial infections over the past year. Lab tests show anemia and elevated serum creatinine.",
        specialty: "Hematopathology",
        findings: "Serum protein electrophoresis shows a monoclonal 'M-spike' of IgG. X-rays reveal multiple 'punched-out' lytic lesions in the skull and vertebral bodies. A bone marrow biopsy is hypercellular and shows sheets of plasma cells, many of which are atypical, with prominent nucleoli or binucleation.",
        diagnosis: "Multiple Myeloma.",
        discussion: "Multiple myeloma is a malignancy of plasma cells that accumulate in the bone marrow. The malignant plasma cells produce a monoclonal immunoglobulin (the M-protein), which can be detected in serum or urine. The disease causes bone destruction (lytic lesions), suppresses normal hematopoiesis (causing anemia and leukopenia), and can lead to renal failure through various mechanisms, including light chain cast nephropathy.",
        tags: {
            organ: "🧬 Hematology",
            type: "🧪 Cancer",
            difficulty: "🔥 Complex",
        },
        quiz: [
            {
                question: "The characteristic finding on serum protein electrophoresis in multiple myeloma is called a:",
                options: ["Polyclonal gammopathy", "Beta-gamma bridge", "M-spike", "Alpha-1-antitrypsin peak"],
                answer: "M-spike"
            }
        ],
        imageHint: "multiple myeloma bone marrow",
    },
    {
        title: "Case 29: A 24-year-old woman with a 'butterfly' rash",
        history: "A 24-year-old woman presents with a rash over her cheeks and nose that worsens with sun exposure, along with fatigue, joint pain, and hair loss. Lab tests show proteinuria and a positive antinuclear antibody (ANA) test.",
        specialty: "Rheumatologic Pathology",
        findings: "A skin biopsy of the rash shows liquefactive degeneration of the basal epidermal layer and a perivascular lymphocytic infiltrate. A renal biopsy shows diffuse thickening of the glomerular capillary walls, creating a 'wire loop' appearance on light microscopy. Immunofluorescence microscopy reveals granular deposits of IgG and complement along the glomerular basement membrane ('full house' pattern).",
        diagnosis: "Systemic Lupus Erythematosus (SLE) with lupus nephritis.",
        discussion: "SLE is a prototypic autoimmune disease characterized by the production of autoantibodies, particularly ANAs. The deposition of immune complexes in various tissues causes widespread inflammation and damage. The malar 'butterfly' rash is classic. Renal involvement (lupus nephritis) is common and a major cause of morbidity. The 'full house' immunofluorescence pattern in the kidney is highly characteristic.",
        tags: {
            organ: "🦴 Rheumatology",
            type: "🧑‍⚕️ Autoimmune",
            difficulty: "🔥 Complex",
        },
        quiz: [
            {
                question: "The 'full house' pattern on immunofluorescence of a renal biopsy is most characteristic of which condition?",
                options: ["Diabetic nephropathy", "Lupus nephritis", "Amyloidosis", "Minimal change disease"],
                answer: "Lupus nephritis"
            }
        ],
        imageHint: "lupus nephritis histology",
    },
    {
        title: "Case 30: A 32-year-old woman with weakness and double vision",
        history: "A 32-year-old woman presents with fluctuating muscle weakness that worsens with activity and improves with rest. Her symptoms are most prominent in the muscles of her eyes, causing drooping eyelids (ptosis) and double vision (diplopia) by the end of the day.",
        specialty: "Neuropathology",
        findings: "Blood tests are positive for antibodies against the acetylcholine receptor (AChR). Electromyography (EMG) shows a decremental response to repetitive nerve stimulation. A biopsy of a muscle is not typically needed for diagnosis but would show simplified postsynaptic membranes and a reduced number of AChRs.",
        diagnosis: "Myasthenia Gravis.",
        discussion: "Myasthenia gravis is an autoimmune disorder caused by autoantibodies that block or destroy nicotinic acetylcholine receptors at the neuromuscular junction. This impairs neuromuscular transmission, leading to the characteristic fluctuating, fatigable muscle weakness. The disease is often associated with abnormalities of the thymus gland (hyperplasia or thymoma).",
        tags: {
            organ: "🧠 Neurology",
            type: "🧑‍⚕️ Autoimmune",
            difficulty: "⭐ Classic",
        },
        quiz: [
            {
                question: "Myasthenia Gravis is caused by autoantibodies targeting what structure?",
                options: ["Myelin sheath", "Voltage-gated calcium channels", "Acetylcholine receptors", "Dopamine receptors"],
                answer: "Acetylcholine receptors"
            }
        ],
        imageHint: "neuromuscular junction diagram",
    },
    {
        title: "Case 31: A 42-year-old woman with a 'lumpy' breast",
        history: "A 42-year-old premenopausal woman complains of cyclic breast pain and nodularity that is most prominent before her menstrual periods. On physical exam, there are ill-defined, rubbery thickenings in the upper outer quadrants of both breasts.",
        specialty: "Breast Pathology",
        findings: "A biopsy of a nodular area shows a combination of cysts of varying sizes (some with apocrine metaplasia), stromal fibrosis, and a proliferation of epithelial cells within the terminal duct lobular unit (adenosis). There is no cytologic or architectural atypia.",
        diagnosis: "Fibrocystic Changes of the Breast.",
        discussion: "Fibrocystic change is an extremely common, benign condition and represents an exaggerated physiological response of the breast tissue to cyclic hormonal changes. It is not a single disease but a spectrum of changes. It is important to distinguish nonproliferative changes (like simple cysts and fibrosis) from proliferative changes, some of which (proliferative disease with atypia) confer a small increased risk for subsequent breast cancer.",
        tags: {
            organ: "♀️ Gynecology",
            type: "Benign/Physiologic",
            difficulty: "⭐ Classic",
        },
        quiz: [
            {
                question: "Which of the following is NOT a component of nonproliferative fibrocystic change?",
                options: ["Cyst formation", "Stromal fibrosis", "Atypical ductal hyperplasia", "Adenosis"],
                answer: "Atypical ductal hyperplasia"
            }
        ],
        imageHint: "fibrocystic breast change histology",
    },
    {
        title: "Case 32: A 28-year-old with celiac disease",
        history: "A 28-year-old presents with chronic diarrhea, bloating, and weight loss. She has a history of iron deficiency anemia. Serology is positive for anti-tissue transglutaminase (anti-tTG) IgA antibodies.",
        specialty: "Gastrointestinal Pathology",
        findings: "An upper endoscopy is performed, and biopsies are taken from the duodenum. The histology shows marked villous atrophy (blunting and flattening of the villi), crypt hyperplasia (elongation of the crypts), and a significant increase in intraepithelial lymphocytes.",
        diagnosis: "Celiac Disease.",
        discussion: "Celiac disease is an immune-mediated enteropathy triggered by the ingestion of gluten in genetically predisposed individuals. The immune response to gluten leads to damage of the small intestinal mucosa, primarily the duodenum and proximal jejunum. This results in malabsorption. The triad of villous atrophy, crypt hyperplasia, and increased intraepithelial lymphocytes is the classic histological picture.",
        tags: {
            organ: "🩺 GI Tract",
            type: "🧑‍⚕️ Autoimmune",
            difficulty: "⭐ Classic",
        },
        quiz: [
            {
                question: "What is the characteristic histological triad of celiac disease?",
                options: ["Villous atrophy, crypt hyperplasia, increased intraepithelial lymphocytes", "Normal villi, crypt abscesses, granulomas", "Transmural inflammation, fissures, fibrosis", "Pseudomembranes, mucosal necrosis, 'volcano' lesions"],
                answer: "Villous atrophy, crypt hyperplasia, increased intraepithelial lymphocytes"
            }
        ],
        imageHint: "celiac disease histology",
    },
    {
        title: "Case 33: A 66-year-old with weight loss and abdominal pain",
        history: "A 66-year-old man with a long history of H. pylori gastritis presents with unintentional weight loss, vague upper abdominal pain, and early satiety.",
        specialty: "Gastrointestinal Pathology",
        findings: "Endoscopy reveals a large, ulcerated mass in the antrum of the stomach. Biopsy shows an infiltrative adenocarcinoma with two patterns: some areas show intestinal-type glands, while other areas consist of poorly cohesive, single cells with large mucin vacuoles pushing the nucleus to the periphery (signet-ring cells).",
        diagnosis: "Gastric Adenocarcinoma (Mixed Intestinal and Diffuse types).",
        discussion: "Gastric cancer is a major cause of cancer mortality worldwide. It is broadly divided into two main histologic types: intestinal-type, which is often associated with chronic H. pylori gastritis and forms glands; and diffuse-type, which is characterized by infiltrative signet-ring cells and is associated with a worse prognosis. Chronic H. pylori infection is the single most important risk factor for developing gastric adenocarcinoma.",
        tags: {
            organ: "🩺 GI Tract",
            type: "🧪 Cancer",
            difficulty: "🔥 Complex",
        },
        quiz: [
            {
                question: "A gastric adenocarcinoma composed of single cells with large mucin vacuoles is known as which type?",
                options: ["Intestinal-type", "Signet-ring cell carcinoma (Diffuse-type)", "Carcinoid tumor", "Gastrointestinal stromal tumor (GIST)"],
                answer: "Signet-ring cell carcinoma (Diffuse-type)"
            }
        ],
        imageHint: "gastric adenocarcinoma histology",
    },
    {
        title: "Case 34: A 30-year-old woman with muscle weakness and skin rash",
        history: "A 30-year-old woman presents with a several-month history of progressive, symmetric proximal muscle weakness (difficulty climbing stairs, combing hair) and a distinctive skin rash. The rash includes a purplish discoloration of the upper eyelids (heliotrope rash) and reddish papules over her knuckles (Gottron's papules).",
        specialty: "Rheumatologic Pathology",
        findings: "Blood tests show elevated creatine kinase (CK) levels. A muscle biopsy is performed. Histology shows inflammation that is most pronounced around small blood vessels and at the periphery of muscle fascicles (perifascicular atrophy). The inflammatory infiltrate is composed of lymphocytes and plasma cells.",
        diagnosis: "Dermatomyositis.",
        discussion: "Dermatomyositis is an inflammatory myopathy characterized by the combination of muscle weakness and classic skin findings. The underlying pathology is thought to be an antibody-mediated attack on small blood vessels within the muscle, leading to microinfarcts and subsequent muscle fiber damage, particularly at the periphery of the fascicles. This perifascicular atrophy is a hallmark histological feature.",
        tags: {
            organ: "🦴 Rheumatology",
            type: "🧑‍⚕️ Autoimmune",
            difficulty: "🔥 Complex",
        },
        quiz: [
            {
                question: "The hallmark histological finding in a muscle biopsy from a patient with dermatomyositis is:",
                options: ["Neurogenic atrophy", "Fiber type grouping", "Perifascicular atrophy", "Endomysial inflammation without atrophy"],
                answer: "Perifascicular atrophy"
            }
        ],
        imageHint: "dermatomyositis histology",
    },
    {
        title: "Case 35: A 65-year-old man with fatigue and splenomegaly",
        history: "A 65-year-old man presents with a 6-month history of fatigue, weight loss, and a feeling of abdominal fullness. On exam, he has massive splenomegaly. His white blood cell count is markedly elevated (150,000/µL).",
        specialty: "Hematopathology",
        findings: "The peripheral blood smear shows a dramatic increase in granulocytes in all stages of maturation, from myeloblasts to mature neutrophils, with a peak in myelocytes. The basophil count is also increased. A bone marrow biopsy is hypercellular with marked myeloid hyperplasia. Cytogenetic analysis reveals the t(9;22) translocation, also known as the Philadelphia chromosome.",
        diagnosis: "Chronic Myeloid Leukemia (CML).",
        discussion: "CML is a myeloproliferative neoplasm driven by the BCR-ABL1 fusion gene, created by the Philadelphia chromosome. This fusion gene encodes a constitutively active tyrosine kinase that drives the massive proliferation of granulocytic cells. The disease classically presents in a chronic phase, but without effective treatment, it will progress to an accelerated phase and ultimately a fatal blast crisis, which resembles acute leukemia.",
        tags: {
            organ: "🧬 Hematology",
            type: "🧪 Cancer",
            difficulty: "🔥 Complex",
        },
        quiz: [
            {
                question: "What is the pathognomonic cytogenetic finding in Chronic Myeloid Leukemia (CML)?",
                options: ["Trisomy 21", "t(15;17)", "t(9;22) Philadelphia chromosome", "t(8;14)"],
                answer: "t(9;22) Philadelphia chromosome"
            }
        ],
        imageHint: "chronic myeloid leukemia smear",
    }
];


interface PathologyContextType {
  caseStudies: CaseStudy[];
  addCaseStudy: (caseStudy: Omit<CaseStudy, 'id'>) => void;
  completedCases: Set<string>;
  toggleCaseCompletion: (caseId: string) => void;
}

const PathologyContext = createContext<PathologyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pathology_data_v5'; // Bump version for new cases

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

  // Prevent hydration mismatch by waiting for localStorage to load
  if (!isLoaded) {
    return null;
  }

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
