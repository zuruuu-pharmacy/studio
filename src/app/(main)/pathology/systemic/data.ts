
import { Stethoscope, Dna, FileText, Bot, Book, Zap, FlaskConical, GitBranch, Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Microscope, Droplet, User, Video, Mic, Notebook, BookCopy, CaseSensitive, FileHeart, HelpCircle, Target, CheckCircle, GitCommit, CalendarClock, BookA, ShieldAlert, BrainCircuit, Lightbulb, ShieldCheck, ListChecks } from 'lucide-react';

export interface Disease {
  title: string;
  synonyms?: string;
  overview: string;
  learningObjectives: string[];
  tags: {
    organ: string;
    system: string;
    category: 'Inflammatory' | 'Infectious' | 'Neoplastic' | 'Degenerative' | 'Genetic' | 'Metabolic' | 'Autoimmune' | 'Vascular' | 'Other' | 'Benign/Physiologic' | 'Motility Disorder' | 'Chronic Disease' | 'Vasculitis' | 'Pre-cancerous';
    level: 'Basic' | 'Intermediate' | 'Advanced' | 'Classic';
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
          { 
            title: "Atherosclerosis",
            overview: "Atherosclerosis is the underlying cause of most cardiovascular disease, including coronary artery disease, stroke, and peripheral artery disease. It is a chronic inflammatory and lipid-driven disease of the arterial intima, characterized by the formation of atheromas (fibrofatty plaques).",
            learningObjectives: [
                "Define atherosclerosis and identify its major risk factors.",
                "Describe the 'response to injury' hypothesis of pathogenesis.",
                "Recognize the morphology of an atherosclerotic plaque.",
                "Understand the clinical consequences of atherosclerosis in different arterial beds."
            ],
            tags: {
                organ: "Arteries",
                system: "Cardiovascular",
                category: "Degenerative",
                level: "Classic"
            },
            etiology: [
                "Major modifiable risk factors: Hyperlipidemia (especially high LDL), hypertension, cigarette smoking, diabetes mellitus.",
                "Non-modifiable risk factors: Age, male gender, family history.",
                "Other factors: Inflammation (measured by CRP), obesity, physical inactivity."
            ],
            pathogenesis: "The 'response to injury' hypothesis is key: 1. Chronic endothelial injury (from risk factors) leads to increased vascular permeability and leukocyte adhesion. 2. Lipoproteins (especially LDL) enter the intima and are oxidized. 3. Monocytes adhere, migrate into the intima, and transform into macrophages, which engulf oxidized LDL to become foam cells. 4. Smooth muscle cells migrate from the media to the intima and proliferate, synthesizing extracellular matrix (e.g., collagen), which forms a fibrous cap.",
            morphology: {
                gross: "The characteristic lesion is the atheromatous plaque, which is an eccentric, raised intimal lesion with a soft, yellow, lipid-rich core and a firm, white fibrous cap. Fatty streaks are the earliest visible lesions but do not always progress to plaques.",
                microscopic: "A plaque consists of: 1. A fibrous cap (smooth muscle cells, collagen, elastin). 2. A cellular component (macrophages, foam cells, T-lymphocytes). 3. A necrotic core (lipid debris, cholesterol crystals, cellular debris, calcium).",
                imageHint: "atherosclerosis histology"
            },
            clinicalFeatures: "Often asymptomatic for decades. Symptoms arise from organ ischemia due to: 1. Progressive luminal narrowing (stable angina, intermittent claudication). 2. Acute plaque change (rupture, erosion, or hemorrhage), leading to thrombosis and infarction (MI, ischemic stroke).",
            investigations: "Diagnosis is often clinical or based on downstream effects. Angiography can visualize stenoses. Lipid profile is a key lab test. Ankle-brachial index is used for peripheral artery disease.",
            management: "Primary prevention focuses on risk factor modification: statins for hyperlipidemia, antihypertensives, smoking cessation, and diabetes control. Antiplatelet agents (e.g., aspirin) are used for secondary prevention. Revascularization procedures (PCI, CABG) are used for severe stenosis.",
            complications: "Myocardial infarction, ischemic stroke, aortic aneurysm, peripheral artery disease.",
            prognosis: "Depends on the extent of disease and control of risk factors.",
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
          { 
            title: "Infective Endocarditis",
            overview: "Infective endocarditis is an infection of the heart valves or endocardium, most commonly by bacteria. It is characterized by the formation of bulky, friable vegetations composed of thrombotic debris and microorganisms, which can lead to severe valve destruction and systemic embolization.",
            learningObjectives: [
                "Define infective endocarditis and list common causative organisms.",
                "Differentiate between acute and subacute presentations.",
                "Describe the morphology of vegetations and their consequences.",
                "Understand the modified Duke criteria for diagnosis."
            ],
            tags: {
                organ: "Heart",
                system: "Cardiovascular",
                category: "Infectious",
                level: "Advanced"
            },
            etiology: [
                "Staphylococcus aureus (high virulence, often affects normal valves, common in IV drug users)",
                "Viridans group streptococci (low virulence, typically affects previously damaged valves, associated with dental procedures)",
                "Enterococci",
                "HACEK group of organisms",
                "Fungi (e.g., Candida, in immunocompromised patients or IV drug users)"
            ],
            pathogenesis: "Endothelial injury to a valve creates a sterile platelet-fibrin thrombus. A transient bacteremia allows microorganisms to seed this thrombus. The organisms then proliferate within this protected environment, forming a vegetation that can destroy the valve and embolize.",
            morphology: {
                gross: "Bulky, friable, and destructive vegetations on the heart valves (most often mitral and aortic; tricuspid in IV drug users). These can erode into the underlying myocardium to form a ring abscess.",
                microscopic: "The vegetation consists of fibrin, inflammatory cells, and colonies of microorganisms.",
                imageHint: "infective endocarditis valve"
            },
            clinicalFeatures: "Fever is the most common symptom. New or changing heart murmur is a classic sign. Other features include petechiae, splinter hemorrhages (under fingernails), Osler's nodes (painful nodules on fingertips), and Janeway lesions (painless macules on palms/soles).",
            investigations: "Blood cultures (multiple sets) are crucial for identifying the causative organism. Echocardiography (TTE or TEE) is essential to visualize vegetations. The diagnosis is often made using the modified Duke criteria, which combines clinical, microbiological, and echocardiographic findings.",
            management: "Prolonged courses of high-dose intravenous antibiotics are the cornerstone of treatment, tailored to the specific organism and its sensitivities. Surgical valve replacement may be necessary for complications like severe heart failure, persistent infection, or recurrent emboli. Always check current local and international guidelines.",
            complications: "Valvular insufficiency, heart failure, myocardial abscess, septic emboli to brain (stroke) or other organs, glomerulonephritis (due to immune complex deposition).",
            prognosis: "Depends on the causative organism and the presence of complications. Acute endocarditis caused by S. aureus can be rapidly fatal.",
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
        diseases: [
           { 
            title: "Squamous Cell Carcinoma of the Lung",
            overview: "Squamous cell carcinoma (SCC) is a type of non-small cell lung cancer (NSCLC) that is strongly associated with smoking. It typically arises centrally in the major bronchi and is characterized by squamous differentiation (keratinization and/or intercellular bridges).",
            learningObjectives: [
                "Identify smoking as the primary risk factor for lung SCC.",
                "Describe the precursor lesion, squamous metaplasia and dysplasia.",
                "Recognize the key histologic features of SCC.",
                "Understand the clinical presentation, including paraneoplastic syndromes."
            ],
            tags: {
                organ: "Lung",
                system: "Respiratory",
                category: "Neoplastic",
                level: "Intermediate"
            },
            etiology: [
                "Cigarette smoking (overwhelmingly the most important risk factor)."
            ],
            pathogenesis: "Chronic irritation of the bronchial epithelium from smoke leads to a sequence of adaptive and dysplastic changes: squamous metaplasia -> squamous dysplasia -> carcinoma in situ -> invasive carcinoma. This process is driven by the accumulation of genetic mutations in pathways controlling cell growth and differentiation.",
            morphology: {
                gross: "Typically arises as a central (hilar) mass that may project into the bronchial lumen, causing obstruction. The tumor is often firm, white-tan, and may show areas of central necrosis and cavitation.",
                microscopic: "The defining features are keratinization (in the form of 'keratin pearls') and/or intercellular bridges between tumor cells. The cells are typically large with eosinophilic cytoplasm and hyperchromatic, irregular nuclei.",
                imageHint: "lung cancer histology"
            },
            clinicalFeatures: "Often presents with symptoms of bronchial obstruction: cough, hemoptysis, and post-obstructive pneumonia. Can cause paraneoplastic syndromes, most notably the production of parathyroid hormone-related protein (PTHrP), leading to hypercalcemia.",
            investigations: "Diagnosis is made by biopsy, typically obtained via bronchoscopy. Chest CT scan is used for staging. Sputum cytology can sometimes be diagnostic.",
            management: "Treatment depends on the stage. Early-stage disease may be treated with surgical resection. Advanced disease is treated with chemotherapy and/or radiation. Immunotherapy (e.g., checkpoint inhibitors) has become a key part of treatment. Always check current local and international NSCLC guidelines (e.g., NCCN, ESMO).",
            complications: "Bronchial obstruction, superior vena cava syndrome (if tumor compresses the SVC), distant metastases (e.g., to adrenals, brain, bone).",
            prognosis: "Prognosis is stage-dependent but is generally poor for lung cancer overall. Better than small cell lung cancer at a similar stage.",
          },
        ]
      }
    ]
  },
   {
    system: "Gastrointestinal System",
    icon: CircleEllipsis,
    categories: [
      {
        name: "Esophageal Disorders",
        diseases: [
             { 
                title: "Barrett Esophagus",
                overview: "Barrett esophagus is a complication of chronic gastroesophageal reflux disease (GERD), where the normal stratified squamous epithelium of the distal esophagus is replaced by metaplastic columnar epithelium containing goblet cells. Its main significance is that it is a major risk factor for developing esophageal adenocarcinoma.",
                learningObjectives: [
                    "Define Barrett esophagus and its relationship to GERD.",
                    "Identify the key histologic feature (intestinal metaplasia with goblet cells).",
                    "Understand the progression from metaplasia to dysplasia to carcinoma.",
                    "Recognize the need for endoscopic surveillance."
                ],
                tags: {
                    organ: "Esophagus",
                    system: "Gastrointestinal",
                    category: "Pre-cancerous",
                    level: "Intermediate"
                },
                etiology: [
                    "Chronic gastroesophageal reflux disease (GERD) is the primary risk factor."
                ],
                pathogenesis: "Prolonged exposure of the esophageal mucosa to gastric acid and bile leads to chronic inflammation and injury. In response, the native squamous epithelium undergoes metaplasia, changing into a more acid-resistant intestinal-type columnar epithelium. This metaplastic epithelium is unstable and can accumulate further mutations, leading to dysplasia and eventually adenocarcinoma.",
                morphology: {
                    gross: "On endoscopy, it appears as tongues or patches of red, velvety mucosa extending proximally from the gastroesophageal junction, contrasting with the normal pale, glossy squamous mucosa.",
                    microscopic: "The diagnostic hallmark is the presence of intestinal metaplasia, defined by the presence of goblet cells (which stain blue with Alcian blue stain) within the columnar epithelium.",
                    imageHint: "barrett esophagus histology"
                },
                clinicalFeatures: "Patients typically have symptoms of chronic GERD (heartburn, regurgitation). Barrett esophagus itself does not cause symptoms; it is an endoscopic and pathologic diagnosis.",
                investigations: "Upper endoscopy with biopsy is required for diagnosis. Multiple biopsies should be taken to assess for the presence and grade of dysplasia.",
                management: "Management involves aggressive treatment of the underlying GERD with proton pump inhibitors (PPIs). Patients with confirmed Barrett esophagus require periodic endoscopic surveillance to monitor for dysplasia. If high-grade dysplasia is found, endoscopic eradication therapies (e.g., radiofrequency ablation) or esophagectomy may be considered. Always check current local and international guidelines (e.g., ACG).",
                complications: "The most feared complication is progression to esophageal adenocarcinoma.",
                prognosis: "The risk of progression to cancer is low on a per-year basis but significant over a lifetime. Surveillance aims to detect dysplasia or early cancer when it is treatable.",
             },
        ]
      },
      {
        name: "Gastric Pathology",
        diseases: [
            { 
                title: "Gastric Adenocarcinoma",
                overview: "Gastric adenocarcinoma is the most common malignancy of the stomach. It is broadly divided into two main histologic types: intestinal-type and diffuse-type, which have different epidemiologic and pathologic features.",
                learningObjectives: [
                    "Identify H. pylori as the major risk factor for gastric cancer.",
                    "Differentiate between the intestinal and diffuse types of gastric adenocarcinoma.",
                    "Recognize the characteristic morphology of signet-ring cells.",
                    "Understand the clinical presentation and generally poor prognosis."
                ],
                tags: {
                    organ: "Stomach",
                    system: "Gastrointestinal",
                    category: "Neoplastic",
                    level: "Advanced"
                },
                etiology: [
                    "Chronic infection with Helicobacter pylori (most important risk factor).",
                    "Dietary factors (e.g., nitrates, smoked/salted foods).",
                    "Chronic gastritis with intestinal metaplasia.",
                    "Genetic factors (e.g., mutations in CDH1 for diffuse-type)."
                ],
                pathogenesis: "Intestinal-type: Arises from a background of chronic gastritis and intestinal metaplasia, following a metaplasia-dysplasia-carcinoma sequence. Diffuse-type: Arises de novo from gastric mucous cells, is not associated with chronic gastritis, and is characterized by mutations in E-cadherin (CDH1), leading to loss of cell adhesion.",
                morphology: {
                    gross: "Intestinal-type tends to form bulky, exophytic masses or ulcerated tumors. Diffuse-type infiltrates the gastric wall, thickening it and creating a rigid, 'leather bottle' appearance (linitis plastica).",
                    microscopic: "Intestinal-type forms glandular structures, similar to colonic adenocarcinoma. Diffuse-type is composed of poorly cohesive, single cells with large mucin vacuoles that push the nucleus to the periphery, creating a characteristic signet-ring cell appearance.",
                    imageHint: "gastric adenocarcinoma histology"
                },
                clinicalFeatures: "Often asymptomatic until late stage. Presents with vague symptoms like weight loss, abdominal pain, anorexia, and early satiety. Anemia from chronic bleeding is common. A palpable left supraclavicular node (Virchow's node) can be a sign of metastatic disease.",
                investigations: "Upper endoscopy with biopsy is the gold standard for diagnosis. CT scans are used for staging.",
                management: "Surgical resection is the only curative treatment, but is only possible in early-stage disease. For advanced disease, chemotherapy and targeted therapies (e.g., HER2 inhibitors if tumor is positive) are used. Always check current local and international guidelines (e.g., NCCN).",
                complications: "Metastasis, most commonly to regional lymph nodes, liver, and peritoneum (Krukenberg tumor in ovary).",
                prognosis: "Generally poor, as most patients present with advanced disease. Prognosis is stage-dependent.",
            },
        ]
      },
       {
        name: "Inflammatory Bowel Disease",
        diseases: [
            { 
                title: "Crohn's Disease",
                overview: "Crohn's disease is a chronic, relapsing inflammatory bowel disease (IBD) that can affect any part of the gastrointestinal tract from mouth to anus, but most commonly involves the terminal ileum and colon. It is characterized by transmural, skip-lesion inflammation.",
                learningObjectives: [
                    "Define Crohn's disease and contrast it with ulcerative colitis.",
                    "Describe the classic pathologic features: skip lesions, transmural inflammation, and granulomas.",
                    "Recognize the 'cobblestone' appearance and 'creeping fat' on gross examination.",
                    "Understand the major complications, including fistulas and strictures."
                ],
                tags: {
                    organ: "Intestines",
                    system: "Gastrointestinal",
                    category: "Autoimmune",
                    level: "Intermediate"
                },
                etiology: [
                    "Idiopathic, but involves a combination of genetic susceptibility (e.g., NOD2 gene mutations), a dysregulated immune response to gut flora, and environmental triggers."
                ],
                pathogenesis: "An inappropriate immune response to normal gut bacteria in a genetically susceptible host leads to chronic inflammation. The inflammation is T-cell mediated (Th1 and Th17 pathways) and involves the full thickness of the bowel wall.",
                morphology: {
                    gross: "Characterized by skip lesions (areas of disease separated by normal bowel). The affected bowel shows deep, linear 'serpentine' ulcers, which combined with mucosal edema, create a 'cobblestone' appearance. The bowel wall is thickened and rubbery. The serosal fat often wraps around the bowel surface ('creeping fat').",
                    microscopic: "The inflammation is transmural, extending through all layers of the bowel wall. Neutrophils are present, but the infiltrate is typically mixed. Non-caseating granulomas are a hallmark finding, though not present in all cases.",
                    imageHint: "crohn's disease histology"
                },
                clinicalFeatures: "Highly variable. Common symptoms include recurrent right lower quadrant abdominal pain, non-bloody diarrhea, and weight loss. Perianal disease (fistulas, abscesses) is common. Extraintestinal manifestations like arthritis and uveitis can occur.",
                investigations: "Colonoscopy with biopsy is key. Imaging (CT or MR enterography) is used to evaluate the small bowel. Capsule endoscopy can also be used.",
                management: "Step-up or top-down therapy involving 5-ASA agents, corticosteroids (for flares), immunomodulators (e.g., azathioprine), and biologic agents (e.g., anti-TNF like infliximab). Surgical resection may be needed for complications. Always check current local and international IBD guidelines.",
                complications: "Fistulas (connections between bowel loops or to other organs), strictures (leading to obstruction), abscesses, and an increased risk of colon cancer.",
                prognosis: "A chronic, lifelong disease with a relapsing and remitting course. There is no medical cure.",
            },
            { 
                title: "Ulcerative Colitis",
                overview: "Ulcerative colitis (UC) is an inflammatory bowel disease characterized by continuous, superficial inflammation that is limited to the colon and almost always involves the rectum.",
                learningObjectives: [
                    "Define ulcerative colitis and contrast it with Crohn's disease.",
                    "Describe the key pathologic features: continuous inflammation limited to the mucosa.",
                    "Recognize the gross appearance of pseudopolyps.",
                    "Understand the major complications, including toxic megacolon and carcinoma risk."
                ],
                tags: {
                    organ: "Colon",
                    system: "Gastrointestinal",
                    category: "Autoimmune",
                    level: "Intermediate"
                },
                etiology: [
                    "Idiopathic, similar to Crohn's disease, involving genetic susceptibility and a dysregulated immune response."
                ],
                pathogenesis: "An inappropriate immune response, likely driven by Th2 cells, leads to inflammation that is confined to the mucosal and submucosal layers of the colon.",
                morphology: {
                    gross: "The disease starts in the rectum and extends proximally in a continuous fashion. The mucosa is red, granular, and friable. There may be broad-based ulcers. Regenerating mucosa can bulge into the lumen, forming 'pseudopolyps'. There are no skip lesions.",
                    microscopic: "Inflammation is limited to the mucosa and submucosa. There is distortion of crypt architecture, with branched and shortened crypts. A prominent inflammatory infiltrate is present in the lamina propria, and neutrophils are often seen invading the crypts, forming crypt abscesses. Granulomas are absent.",
                    imageHint: "ulcerative colitis histology"
                },
                clinicalFeatures: "The cardinal symptom is bloody diarrhea. Other symptoms include tenesmus (a feeling of incomplete defecation) and lower abdominal cramping. The course is relapsing and remitting.",
                investigations: "Colonoscopy with biopsy is the diagnostic standard.",
                management: "Similar to Crohn's disease, with a focus on 5-ASA agents (topical and oral), corticosteroids, immunomodulators, and biologics. Colectomy (surgical removal of the colon) is curative for the disease. Always check current local and international IBD guidelines.",
                complications: "Toxic megacolon (a life-threatening dilation of the colon), severe bleeding, and a significantly increased risk of developing colorectal adenocarcinoma, which depends on the duration and extent of disease.",
                prognosis: "Chronic relapsing course. The risk of cancer necessitates regular surveillance colonoscopies.",
            },
        ]
      },
      {
        name: "Liver & Biliary Pathology",
        diseases: [
            { 
            title: "Cirrhosis",
            overview: "Cirrhosis is the end-stage of chronic liver disease, defined by three characteristics: 1. Bridging fibrous septa, 2. Parenchymal nodules created by regeneration of hepatocytes, and 3. Disruption of the entire liver architecture. It is an irreversible process.",
            learningObjectives: [
                "Define cirrhosis based on its key histologic features.",
                "List the major causes of cirrhosis.",
                "Describe the pathogenesis involving hepatocyte death, regeneration, and fibrosis.",
                "Understand the clinical consequences of portal hypertension and liver failure."
            ],
            tags: {
                organ: "Liver",
                system: "Gastrointestinal",
                category: "Chronic Disease",
                level: "Advanced"
            },
            etiology: [
                "Chronic viral hepatitis (Hepatitis B and C)",
                "Alcoholic liver disease",
                "Non-alcoholic fatty liver disease (NAFLD/NASH)",
                "Hemochromatosis (iron overload)",
                "Autoimmune hepatitis"
            ],
            pathogenesis: "The central event is the death of hepatocytes, which triggers inflammation and the activation of hepatic stellate cells. Activated stellate cells are the primary source of collagen, leading to progressive fibrosis. Simultaneously, remaining hepatocytes attempt to regenerate, forming spherical nodules. The combination of fibrosis and nodule formation disrupts the normal vascular architecture, leading to portal hypertension.",
            morphology: {
                gross: "The liver may be enlarged or shrunken, but it is always firm and nodular. Micronodular cirrhosis (<3 mm nodules) is typical of alcohol, while macronodular cirrhosis (>3 mm nodules) is often seen in viral hepatitis.",
                microscopic: "The defining features are bridging fibrous septa that link portal tracts to each other and to central veins, and regenerative nodules of hepatocytes that lack the normal central vein.",
                imageHint: "liver cirrhosis histology"
            },
            clinicalFeatures: "May be asymptomatic for years. When decompensated, it presents with signs of liver failure (jaundice, coagulopathy, encephalopathy) and portal hypertension (ascites, esophageal varices, splenomegaly).",
            investigations: "Diagnosis is often clinical, based on imaging (e.g., nodular liver on ultrasound) and lab tests (e.g., low albumin, high INR). Liver biopsy is the gold standard for confirmation.",
            management: "Management involves treating the underlying cause (if possible), managing complications (e.g., diuretics for ascites, beta-blockers for varices), and screening for hepatocellular carcinoma. Liver transplantation is the only curative option for end-stage disease. Always check current local and international guidelines.",
            complications: "Portal hypertension, ascites, hepatic encephalopathy, esophageal variceal bleeding, and hepatocellular carcinoma.",
            prognosis: "Poor once decompensation occurs. The MELD score is used to predict short-term mortality and prioritize patients for liver transplant.",
            },
        ]
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
