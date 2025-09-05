
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
          { 
            title: "Calcific Aortic Stenosis",
            overview: "Calcific aortic stenosis is the most common cause of aortic stenosis, resulting from the age-related 'wear and tear' of the aortic valve. It involves the progressive calcification and fibrosis of the valve leaflets, leading to obstruction of left ventricular outflow.",
            learningObjectives: [
                "Identify calcific aortic stenosis as the primary cause of aortic stenosis in the elderly.",
                "Describe the morphology of the calcified valve.",
                "Understand the hemodynamic consequences of aortic stenosis.",
                "Recognize the classic clinical triad of symptoms."
            ],
            tags: {
                organ: "Heart",
                system: "Cardiovascular",
                category: "Degenerative",
                level: "Intermediate"
            },
            etiology: [
                "Age-related degenerative calcification.",
                "Accelerated in patients with a congenitally bicuspid aortic valve."
            ],
            pathogenesis: "The pathogenesis is similar to atherosclerosis, involving lipid deposition, inflammation, and active calcification driven by osteoblast-like cells within the valve. Chronic mechanical stress on the valve contributes to this process.",
            morphology: {
                gross: "The valve cusps are thickened, fibrotic, and contain heaped-up masses of calcific deposits, particularly on the aortic side. This prevents the cusps from opening fully during systole. The commissures are typically not fused (unlike in rheumatic heart disease).",
                microscopic: "Fibrosis and calcification within the valve cusps.",
                imageHint: "calcific aortic stenosis gross"
            },
            clinicalFeatures: "Patients are often asymptomatic for a long period due to compensatory left ventricular hypertrophy. Once symptoms develop, the prognosis worsens significantly. The classic triad is: 1. Angina (chest pain) 2. Syncope (fainting), especially on exertion 3. Dyspnea (shortness of breath) from heart failure. A harsh systolic ejection murmur is heard on auscultation.",
            investigations: "Echocardiography is the diagnostic test of choice, used to visualize the calcified valve, measure the valve area, and assess the severity of the stenosis and the degree of left ventricular hypertrophy.",
            management: "There is no medical therapy to halt or reverse the calcification. Management involves monitoring asymptomatic patients. Once symptoms develop or the stenosis becomes severe, the only effective treatment is aortic valve replacement (either surgical or transcatheter - TAVR/TAVI). Always check current local and international valvular heart disease guidelines.",
            complications: "Left ventricular hypertrophy, heart failure, arrhythmias, infective endocarditis.",
            prognosis: "Excellent for asymptomatic patients. Poor once symptoms develop, with an average survival of 2-3 years without valve replacement.",
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
          { 
            title: "Hypertrophic Cardiomyopathy (HCM)",
            overview: "Hypertrophic cardiomyopathy is a genetic disorder characterized by myocardial hypertrophy, poorly compliant left ventricular myocardium leading to abnormal diastolic filling, and, in about one-third of cases, intermittent left ventricular outflow obstruction.",
            learningObjectives: [
                "Define HCM as a primary genetic disorder of the sarcomere.",
                "Describe the characteristic asymmetric septal hypertrophy.",
                "Recognize the key histologic feature of myocyte disarray.",
                "Understand the risk of sudden cardiac death in young athletes."
            ],
            tags: {
                organ: "Heart",
                system: "Cardiovascular",
                category: "Genetic",
                level: "Advanced"
            },
            etiology: [
                "Autosomal dominant mutations in genes encoding sarcomeric proteins (e.g., beta-myosin heavy chain, myosin-binding protein C)."
            ],
            pathogenesis: "Mutations in contractile proteins lead to hypercontractility and inefficient energy use, stimulating myocyte hypertrophy. The hypertrophy is often asymmetric, disproportionately affecting the ventricular septum. This can lead to dynamic outflow obstruction as the anterior leaflet of the mitral valve is pulled towards the septum during systole.",
            morphology: {
                gross: "Massive myocardial hypertrophy without ventricular dilation. The classic pattern is asymmetric hypertrophy of the ventricular septum. The LV cavity is often compressed into a 'banana-like' shape.",
                microscopic: "The histologic hallmark is extensive myocyte hypertrophy, myocyte disarray (haphazard arrangement of myocytes), and interstitial fibrosis.",
                imageHint: "hypertrophic cardiomyopathy histology"
            },
            clinicalFeatures: "Many patients are asymptomatic. Symptoms can include dyspnea, angina, fatigue, and syncope. HCM is a major cause of sudden cardiac death in young adults and athletes, often due to ventricular arrhythmias.",
            investigations: "Echocardiography is the primary diagnostic tool, showing asymmetric septal hypertrophy and dynamic outflow obstruction. Genetic testing can identify the causative mutation.",
            management: "Management focuses on symptom relief and reducing the risk of sudden death. Beta-blockers and calcium channel blockers are used to reduce heart rate and improve diastolic filling. Implantable cardioverter-defibrillators (ICDs) are used in high-risk patients to prevent sudden death. Always check current local and international HCM guidelines.",
            complications: "Sudden cardiac death, atrial fibrillation, heart failure, infective endocarditis.",
            prognosis: "Highly variable. Some patients remain stable for life, while others have a high risk of sudden death.",
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
          { 
            title: "Asthma",
            overview: "Asthma is a chronic inflammatory disorder of the airways characterized by reversible bronchoconstriction, airway hyperresponsiveness, and inflammation. It presents with episodic wheezing, shortness of breath, and cough.",
            learningObjectives: [
                "Define asthma as a disorder of reversible airway obstruction.",
                "Describe the pathogenesis of atopic asthma, involving Type I hypersensitivity.",
                "Identify the key histologic features, including airway remodeling.",
                "Understand the basis of pharmacologic management."
            ],
            tags: {
                organ: "Lung",
                system: "Respiratory",
                category: "Autoimmune",
                level: "Classic"
            },
            etiology: [
                "A combination of genetic predisposition (atopy) and environmental exposures (allergens, viral infections)."
            ],
            pathogenesis: "Atopic (allergic) asthma is a classic Type I hypersensitivity reaction. Initial exposure to an allergen sensitizes Th2 cells, which stimulate B cells to produce IgE. IgE coats mast cells. On re-exposure, the allergen cross-links IgE on mast cells, causing degranulation and release of mediators (histamine, leukotrienes) that lead to acute bronchoconstriction. A late-phase reaction involves the recruitment of eosinophils and other inflammatory cells, causing sustained inflammation. Over time, this leads to airway remodeling (hypertrophy of smooth muscle and mucous glands, sub-basement membrane fibrosis).",
            morphology: {
                gross: "Lungs are overdistended. Airways may be occluded by thick mucus plugs.",
                microscopic: "Mucus plugs contain shed epithelial cells and eosinophils, forming Curschmann spirals and Charcot-Leyden crystals. Airway walls show inflammation with many eosinophils, hypertrophy of bronchial smooth muscle, and thickening of the basement membrane.",
                imageHint: "asthma histology"
            },
            clinicalFeatures: "Episodic attacks of wheezing, cough (especially at night), and dyspnea, often triggered by allergens, cold air, or exercise. Symptoms are typically reversible, either spontaneously or with treatment.",
            investigations: "Spirometry showing reversible airflow obstruction (i.e., an increase in FEV1 of >12% and >200 mL after bronchodilator administration) is the hallmark of diagnosis.",
            management: "Management involves reliever medications for acute symptoms (e.g., short-acting beta-agonists like salbutamol) and controller medications to manage chronic inflammation (e.g., inhaled corticosteroids). Always check current local and international asthma guidelines (e.g., GINA).",
            complications: "Severe acute exacerbations (status asthmaticus), airway remodeling.",
            prognosis: "Excellent with proper management, but can be fatal if untreated.",
          },
        ]
      },
      {
        name: "Restrictive Lung Diseases",
        diseases: [
            { 
            title: "Idiopathic Pulmonary Fibrosis (IPF)",
            overview: "Idiopathic pulmonary fibrosis is a progressive, irreversible, and usually fatal fibrosing interstitial pneumonia of unknown cause, occurring in older adults. It is characterized by the radiologic and/or histologic pattern of usual interstitial pneumonia (UIP).",
            learningObjectives: [
                "Define IPF and its association with the UIP pattern.",
                "Describe the pathogenesis involving recurrent epithelial injury and aberrant repair.",
                "Recognize the key morphologic features: patchy fibrosis, fibroblastic foci, and honeycomb change.",
                "Understand the poor prognosis and limited treatment options."
            ],
            tags: {
                organ: "Lung",
                system: "Respiratory",
                category: "Degenerative",
                level: "Advanced"
            },
            etiology: [
                "Unknown (idiopathic). Risk factors include smoking and genetic predisposition."
            ],
            pathogenesis: "The current hypothesis suggests that repeated cycles of epithelial injury and activation in a susceptible host lead to an abnormal wound healing response. This involves the excessive proliferation of fibroblasts and myofibroblasts (forming fibroblastic foci) and the massive deposition of collagen, leading to progressive scarring.",
            morphology: {
                gross: "The pleural surfaces of the lungs have a 'cobblestone' appearance. The fibrosis is most pronounced in the lower lobes and subpleural regions.",
                microscopic: "The hallmark is patchy interstitial fibrosis, which varies in intensity and age. The key lesion is the fibroblastic focus, a collection of actively proliferating fibroblasts. In late stages, the fibrosis leads to the destruction of alveolar architecture and the formation of cystic spaces lined by bronchiolar epithelium, known as 'honeycomb lung'.",
                imageHint: "usual interstitial pneumonia histology"
            },
            clinicalFeatures: "Presents with the insidious onset of gradually progressive dyspnea on exertion and a dry cough. Digital clubbing and 'velcro-like' crackles on auscultation are common.",
            investigations: "High-resolution CT (HRCT) of the chest showing the characteristic UIP pattern (subpleural, basal-predominant reticulation with honeycomb change) can be diagnostic. If imaging is not definitive, a surgical lung biopsy is required.",
            management: "Antifibrotic drugs (e.g., pirfenidone, nintedanib) can slow the rate of disease progression but do not cure the disease. Lung transplantation is the only definitive treatment. Supportive care includes oxygen therapy and pulmonary rehabilitation. Always check current local and international IPF guidelines.",
            complications: "Progressive respiratory failure, acute exacerbations, pulmonary hypertension.",
            prognosis: "Poor, with a median survival of 3 to 5 years after diagnosis.",
          },
        ]
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
          { 
            title: "Adenocarcinoma of the Lung",
            overview: "Adenocarcinoma is the most common type of lung cancer, particularly in non-smokers and women. It typically arises in the periphery of the lung and is characterized by gland formation or mucin production by the tumor cells.",
            learningObjectives: [
                "Recognize adenocarcinoma as the most common lung cancer subtype.",
                "Identify its typical peripheral location.",
                "Describe the characteristic histologic features (gland formation, mucin).",
                "Understand the importance of molecular testing (e.g., for EGFR, ALK) in guiding therapy."
            ],
            tags: {
                organ: "Lung",
                system: "Respiratory",
                category: "Neoplastic",
                level: "Intermediate"
            },
            etiology: [
                "Cigarette smoking (a major risk factor, but less strongly associated than with SCC).",
                "Genetic mutations (e.g., EGFR, ALK, KRAS) are common and are important therapeutic targets."
            ],
            pathogenesis: "Develops from precursor lesions, such as atypical adenomatous hyperplasia (AAH) and adenocarcinoma in situ (AIS). The accumulation of driver mutations in genes like EGFR, KRAS, and ALK promotes uncontrolled growth and invasion.",
            morphology: {
                gross: "Usually located in the periphery of the lung. The tumors may be single or multiple nodules and can be associated with pleural puckering and scarring.",
                microscopic: "Shows glandular differentiation (acinar, papillary, micropapillary, or solid growth patterns) and/or mucin production. The cells are typically cuboidal to columnar with varying degrees of atypia.",
                imageHint: "lung adenocarcinoma histology"
            },
            clinicalFeatures: "Often discovered incidentally on imaging. Symptoms, when present, relate to cough, dyspnea, or chest pain. Paraneoplastic syndromes are less common than with other lung cancer types.",
            investigations: "Diagnosis is by biopsy (often CT-guided needle biopsy). Molecular testing for driver mutations (EGFR, ALK, ROS1, etc.) is standard of care for all advanced adenocarcinomas to guide targeted therapy.",
            management: "Treatment depends on stage and molecular status. Early-stage disease is treated with surgery. Advanced-stage disease is treated with chemotherapy, targeted therapy (e.g., osimertinib for EGFR mutations), and/or immunotherapy. Always check current local and international NSCLC guidelines.",
            complications: "Pleural effusion, metastasis to brain, liver, adrenals, and bone.",
            prognosis: "Variable. Patients with targetable driver mutations who respond to targeted therapy can have significantly better outcomes.",
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
             { 
                title: "Gastroesophageal Reflux Disease (GERD)",
                overview: "GERD is a common condition characterized by symptoms or mucosal damage produced by the abnormal reflux of gastric contents into the esophagus. It is primarily a motility disorder related to lower esophageal sphincter (LES) dysfunction.",
                learningObjectives: [
                    "Define GERD based on its clinical and pathological features.",
                    "Understand the mechanisms leading to LES incompetence.",
                    "Describe the potential histologic changes in reflux esophagitis.",
                    "List the major complications of chronic GERD."
                ],
                tags: {
                    organ: "Esophagus",
                    system: "Gastrointestinal",
                    category: "Inflammatory",
                    level: "Basic"
                },
                etiology: [
                    "Decreased LES pressure or inappropriate transient LES relaxations.",
                    "Hiatal hernia.",
                    "Delayed gastric emptying.",
                    "Factors that increase intra-abdominal pressure (e.g., obesity, pregnancy)."
                ],
                pathogenesis: "The primary pathogenetic event is the prolonged exposure of the esophageal mucosa to gastric acid and pepsin, and sometimes bile. This leads to chemical injury and inflammation of the squamous epithelium.",
                morphology: {
                    gross: "Endoscopy may show erythema (redness) and erosions or ulcers in the distal esophagus. However, many patients with symptoms have a normal-appearing endoscopy (non-erosive reflux disease or NERD).",
                    microscopic: "Histologic findings in reflux esophagitis include: 1. Eosinophils and neutrophils within the squamous epithelium. 2. Basal zone hyperplasia (thickening of the basal layer). 3. Elongation of the lamina propria papillae.",
                    imageHint: "reflux esophagitis histology"
                },
                clinicalFeatures: "The cardinal symptom is heartburn (pyrosis), often after meals or when lying down. Other symptoms include regurgitation, dysphagia (difficulty swallowing), and chronic cough or laryngitis (atypical symptoms).",
                investigations: "Diagnosis is often made clinically based on typical symptoms. Endoscopy is performed for alarm symptoms (e.g., dysphagia, weight loss) or to evaluate for complications. 24-hour esophageal pH monitoring is the most sensitive test.",
                management: "Lifestyle modifications (e.g., weight loss, elevating head of bed) and medications are the mainstays. Antacids provide temporary relief. H2-receptor antagonists and proton pump inhibitors (PPIs) are the most effective drugs for reducing acid secretion and healing esophagitis. Always check current local guidelines.",
                complications: "Reflux esophagitis, esophageal stricture, Barrett esophagus, and esophageal adenocarcinoma.",
                prognosis: "Excellent with appropriate management, but it is a chronic condition that often requires long-term therapy.",
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
            { 
                title: "Chronic Gastritis (H. pylori)",
                overview: "Chronic gastritis is a chronic inflammation of the stomach mucosa. Infection with Helicobacter pylori is the most common cause. It can lead to complications such as peptic ulcer disease, gastric adenocarcinoma, and MALT lymphoma.",
                learningObjectives: [
                    "Identify H. pylori as the leading cause of chronic gastritis.",
                    "Describe the typical location (antrum) and histologic features of H. pylori gastritis.",
                    "Understand the mechanism of H. pylori-induced mucosal injury.",
                    "Explain the rationale for H. pylori eradication therapy."
                ],
                tags: {
                    organ: "Stomach",
                    system: "Gastrointestinal",
                    category: "Infectious",
                    level: "Basic"
                },
                etiology: [
                    "Helicobacter pylori infection."
                ],
                pathogenesis: "H. pylori is a spiral-shaped bacterium that lives in the stomach. It produces urease, which neutralizes stomach acid, allowing it to survive. It also produces toxins (like CagA and VacA) and enzymes that damage the mucosal protective layer, leading to inflammation. The host inflammatory response further contributes to epithelial cell injury.",
                morphology: {
                    gross: "Endoscopy may show erythema and a nodular appearance, primarily in the antrum.",
                    microscopic: "The key features are: 1. A prominent inflammatory infiltrate of lymphocytes and plasma cells in the lamina propria. 2. Neutrophils within the gastric pits and epithelium (indicating active inflammation). 3. The curved H. pylori organisms can often be seen in the surface mucus (best visualized with a Warthin-Starry or Giemsa stain).",
                    imageHint: "h pylori gastritis histology"
                },
                clinicalFeatures: "Often asymptomatic. When symptomatic, it can cause upper abdominal pain (dyspepsia), nausea, and bloating. It is a major cause of peptic ulcers.",
                investigations: "Diagnosis can be made by non-invasive tests (urea breath test, stool antigen test, serology) or invasive tests (endoscopy with biopsy for histology and rapid urease test).",
                management: "Eradication therapy with a combination of a proton pump inhibitor (PPI) and at least two antibiotics (e.g., clarithromycin and amoxicillin) is the standard of care. Always check current local and international guidelines for recommended regimens.",
                complications: "Peptic ulcer disease, gastric adenocarcinoma, MALT lymphoma.",
                prognosis: "Excellent with successful eradication, which can prevent long-term complications.",
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
        diseases: [
           { 
            title: "Ischemic Stroke",
            overview: "Ischemic stroke is characterized by a sudden loss of blood circulation to an area of the brain, resulting in a corresponding loss of neurologic function. It is most commonly caused by thrombosis of a cerebral artery on a background of atherosclerosis or by an embolus from the heart or carotid arteries.",
            learningObjectives: [
                "Differentiate between thrombotic and embolic ischemic stroke.",
                "Describe the process of liquefactive necrosis in the brain.",
                "Recognize the time-dependent microscopic changes after an ischemic event.",
                "Understand the concept of the ischemic penumbra and the rationale for thrombolytic therapy."
            ],
            tags: {
                organ: "Brain",
                system: "Nervous System",
                category: "Vascular",
                level: "Intermediate"
            },
            etiology: [
                "Thrombosis due to atherosclerosis of cerebral arteries (common at carotid bifurcation, middle cerebral artery).",
                "Embolism from the heart (atrial fibrillation), carotid artery plaques, or paradoxical emboli.",
                "Small vessel disease (lacunar infarcts) associated with hypertension and diabetes."
            ],
            pathogenesis: "Cessation of blood flow deprives neurons of glucose and oxygen, leading to ATP depletion and failure of ion pumps. This results in an influx of calcium, activation of destructive enzymes, and the generation of free radicals. The core of the infarct undergoes irreversible necrosis within minutes, while the surrounding area (penumbra) is potentially salvageable if blood flow is restored quickly.",
            morphology: {
                gross: "12-24 hours: The brain tissue appears pale, soft, and swollen. 8-10 days: The tissue becomes gelatinous and friable. Months later: A fluid-filled cystic cavity forms.",
                microscopic: "12-24 hours: Red neurons (eosinophilic cytoplasm, pyknotic nuclei) appear. 24-72 hours: Neutrophilic infiltration. 3-5 days: Macrophages (microglia) begin to phagocytose necrotic debris. Weeks to months: The necrotic tissue is removed, leaving a cavity surrounded by reactive astrocytes (gliosis). This process is termed liquefactive necrosis.",
                imageHint: "ischemic stroke histology"
            },
            clinicalFeatures: "Sudden onset of focal neurologic deficits corresponding to the area of the brain affected (e.g., contralateral hemiparesis, aphasia, visual field defects).",
            investigations: "Non-contrast CT scan of the head is the first step to rule out hemorrhage. Diffusion-weighted MRI is the most sensitive test for detecting acute ischemia. CT angiography may be used to identify vessel occlusion.",
            management: "Acute management focuses on 'time is brain'. Thrombolytic therapy with Alteplase (tPA) can be given within a 3 to 4.5-hour window. Mechanical thrombectomy can be performed for large vessel occlusions. Secondary prevention includes antiplatelet agents, statins, and management of risk factors. Always check current local and international stroke guidelines.",
            complications: "Cerebral edema, hemorrhagic transformation of the infarct, seizures, permanent neurologic disability.",
            prognosis: "Highly variable and depends on the size and location of the stroke, the patient's age, and the timeliness of treatment.",
          },
          { 
            title: "Intracerebral Hemorrhage",
            overview: "Intracerebral hemorrhage is bleeding directly into the brain parenchyma. It is most commonly caused by the rupture of small, intraparenchymal vessels damaged by chronic hypertension.",
            learningObjectives: [
                "Identify chronic hypertension as the leading cause of intracerebral hemorrhage.",
                "Recognize the common locations for hypertensive hemorrhages.",
                "Describe the pathology of Charcot-Bouchard microaneurysms.",
                "Differentiate clinically and radiologically from ischemic stroke."
            ],
            tags: {
                organ: "Brain",
                system: "Nervous System",
                category: "Vascular",
                level: "Advanced"
            },
            etiology: [
                "Hypertension (most common cause).",
                "Cerebral amyloid angiopathy (common in the elderly).",
                "Rupture of an arteriovenous malformation (AVM) or cavernoma.",
                "Tumors."
            ],
            pathogenesis: "Chronic hypertension leads to hyaline arteriolosclerosis of small penetrating arteries and arterioles. This weakens the vessel walls and can lead to the formation of minute aneurysms (Charcot-Bouchard microaneurysms), which are prone to rupture.",
            morphology: {
                gross: "A fresh hemorrhage appears as a solid clot of blood that compresses the surrounding brain parenchyma. Over time, the clot is broken down and resorbed, leaving a slit-like, orange-brown cavity.",
                microscopic: "Shows a central core of clotted blood with surrounding brain tissue showing edema and neuronal injury. Eventually, hemosiderin-laden macrophages and reactive astrocytes are seen at the periphery.",
                imageHint: "intracerebral hemorrhage gross brain"
            },
            clinicalFeatures: "Presents with the abrupt onset of focal neurologic deficits, often accompanied by headache, vomiting, and a decreased level of consciousness. Symptoms progress over minutes to hours as the hematoma expands.",
            investigations: "Non-contrast CT scan of the head is the diagnostic test of choice, showing a hyperdense (white) area of acute blood.",
            management: "Management is primarily supportive. Key goals are to control blood pressure aggressively to prevent hematoma expansion and to manage intracranial pressure. Surgical evacuation may be considered for some large or superficially located hematomas. Always check current local and international guidelines.",
            complications: "Increased intracranial pressure, herniation, hydrocephalus.",
            prognosis: "Poor, with high rates of mortality and severe disability.",
          },
          { 
            title: "Subarachnoid Hemorrhage",
            overview: "Subarachnoid hemorrhage (SAH) is bleeding into the subarachnoid space, the area between the arachnoid and pia mater. The most common cause of non-traumatic SAH is the rupture of a saccular (berry) aneurysm in a cerebral artery.",
            learningObjectives: [
                "Define SAH and identify ruptured berry aneurysm as the most common cause.",
                "Describe the typical location of berry aneurysms (branch points in the circle of Willis).",
                "Recognize the classic clinical presentation of a 'thunderclap' headache.",
                "Understand the major complications, including vasospasm and hydrocephalus."
            ],
            tags: {
                organ: "Brain",
                system: "Nervous System",
                category: "Vascular",
                level: "Advanced"
            },
            etiology: [
                "Rupture of a saccular (berry) aneurysm (~85% of cases).",
                "Arteriovenous malformation (AVM) rupture.",
                "Trauma (most common cause of SAH overall, but typically considered separately)."
            ],
            pathogenesis: "Saccular aneurysms are thin-walled outpouchings of arteries, typically occurring at branch points in the circle of Willis. They lack a normal medial layer, making them prone to rupture, especially in the setting of hypertension. Rupture releases arterial blood directly into the cerebrospinal fluid (CSF).",
            morphology: {
                gross: "Blood is seen in the subarachnoid space, particularly at the base of the brain, tracking along the sulci. The ruptured aneurysm may be identified.",
                microscopic: "Not a primary diagnostic modality. Shows blood within the subarachnoid space.",
                imageHint: "subarachnoid hemorrhage CT scan"
            },
            clinicalFeatures: "Presents with the sudden onset of an excruciatingly severe headache, often described as the 'worst headache of my life' (thunderclap headache). This may be accompanied by vomiting, neck stiffness (meningismus), and loss of consciousness.",
            investigations: "A non-contrast CT scan of the head is the first-line investigation and will show hyperdense blood in the sulci and cisterns. If the CT is negative but clinical suspicion is high, a lumbar puncture is performed to look for xanthochromia (yellow discoloration of the CSF from bilirubin). CT angiography is then used to identify the ruptured aneurysm.",
            management: "Immediate management involves securing the airway and controlling blood pressure. The aneurysm must be secured to prevent re-bleeding, either by neurosurgical clipping or endovascular coiling. Nimodipine (a calcium channel blocker) is used to prevent cerebral vasospasm, a major delayed complication. Always check current local and international SAH guidelines.",
            complications: "Re-bleeding (high mortality), cerebral vasospasm (leading to delayed ischemia), hydrocephalus, seizures.",
            prognosis: "High mortality and morbidity, even with treatment.",
          },
        ]
      },
      {
        name: "Neurodegenerative Diseases",
        diseases: [
            {
                title: "Parkinson's Disease",
                overview: "Parkinson's disease is a progressive neurodegenerative disorder characterized by the loss of dopaminergic neurons in the substantia nigra pars compacta. This leads to the classic motor symptoms of bradykinesia, rigidity, resting tremor, and postural instability.",
                learningObjectives: [
                    "Identify the loss of dopaminergic neurons in the substantia nigra as the key pathology.",
                    "Recognize the Lewy body as the characteristic histologic finding.",
                    "Correlate the dopamine deficiency with the cardinal motor symptoms.",
                    "Understand the principles of dopamine replacement therapy."
                ],
                tags: {
                    organ: "Brain",
                    system: "Nervous System",
                    category: "Degenerative",
                    level: "Classic"
                },
                etiology: [
                    "Most cases are idiopathic (sporadic).",
                    "Genetic mutations (e.g., in SNCA, LRRK2, Parkin) account for a minority of cases."
                ],
                pathogenesis: "The pathogenesis involves the misfolding and aggregation of the protein alpha-synuclein, which forms the major component of Lewy bodies. It is thought that these aggregates are toxic to neurons, leading to the progressive death of dopaminergic neurons in the substantia nigra.",
                morphology: {
                    gross: "Pallor of the substantia nigra and locus ceruleus due to the loss of pigmented, dopaminergic neurons.",
                    microscopic: "The key findings are: 1. Loss of dopaminergic neurons in the substantia nigra pars compacta. 2. The presence of Lewy bodies, which are intracytoplasmic, eosinophilic, round inclusions with a dense core and a pale halo.",
                    imageHint: "parkinson's lewy body histology"
                },
                clinicalFeatures: "The classic triad is resting tremor ('pill-rolling'), rigidity ('cogwheel' or 'lead-pipe'), and bradykinesia (slowness of movement). Postural instability develops later. Non-motor symptoms like constipation, REM sleep behavior disorder, and cognitive decline are also common.",
                investigations: "Diagnosis is primarily clinical, based on the characteristic motor signs.",
                management: "Symptomatic treatment is aimed at replacing dopamine. Levodopa (a dopamine precursor), combined with a peripheral decarboxylase inhibitor (carbidopa), is the most effective treatment. Other options include dopamine agonists and MAO-B inhibitors. Always check current local and international guidelines.",
                complications: "Motor fluctuations ('on-off' phenomena), dyskinesias, dementia, falls.",
                prognosis: "Progressive disease, but treatment can significantly improve quality of life for many years.",
            },
            {
                title: "Alzheimer's Disease",
                overview: "Alzheimer's Disease is the most common cause of dementia in the elderly, characterized by a progressive decline in memory, cognitive function, and the ability to perform daily activities. The definitive diagnosis relies on the histopathological findings of amyloid plaques and neurofibrillary tangles.",
                learningObjectives: [
                    "Identify Alzheimer's as the leading cause of dementia.",
                    "Describe the two hallmark pathological lesions: Aβ plaques and tau tangles.",
                    "Understand the role of amyloid-beta and tau in pathogenesis.",
                    "Recognize the clinical progression from memory loss to global cognitive decline."
                ],
                tags: {
                    organ: "Brain",
                    system: "Nervous System",
                    category: "Degenerative",
                    level: "Classic"
                },
                etiology: [
                    "Mostly sporadic (late-onset). Age is the most important risk factor.",
                    "Early-onset familial cases are associated with mutations in genes like APP, PSEN1, and PSEN2.",
                    "The APOE ε4 allele is a major genetic risk factor for late-onset disease."
                ],
                pathogenesis: "The amyloid cascade hypothesis posits that the accumulation of amyloid-beta (Aβ) peptides, derived from the abnormal processing of amyloid precursor protein (APP), is the initiating event. Aβ aggregates form extracellular plaques, which are believed to be neurotoxic. This process also leads to the hyperphosphorylation of the microtubule-associated protein tau, which then aggregates intracellularly to form neurofibrillary tangles, causing further neuronal dysfunction and death.",
                morphology: {
                    gross: "Diffuse cortical atrophy with widening of the cerebral sulci and narrowing of the gyri, most prominent in the temporal and parietal lobes. The ventricles may be enlarged (hydrocephalus ex vacuo).",
                    microscopic: "The two diagnostic findings are: 1. Neuritic (senile) plaques: Extracellular deposits of a central amyloid-beta core surrounded by dystrophic neurites. 2. Neurofibrillary tangles: Intracytoplasmic bundles of filaments composed of hyperphosphorylated tau protein.",
                    imageHint: "alzheimer's plaque tangle histology"
                },
                clinicalFeatures: "Presents with an insidious onset of memory impairment, especially for recent events. This is followed by a slow but progressive decline in other cognitive domains, such as language (aphasia), motor skills (apraxia), and recognition (agnosia), eventually leading to profound dementia.",
                investigations: "Diagnosis is largely clinical. Neuropsychological testing can quantify the cognitive deficits. MRI shows cortical atrophy. PET scans can detect amyloid plaques. Cerebrospinal fluid (CSF) analysis may show low Aβ42 and high tau levels.",
                management: "Treatment is symptomatic and supportive. Cholinesterase inhibitors (e.g., donepezil) and NMDA receptor antagonists (e.g., memantine) can provide modest benefit. Newer anti-amyloid monoclonal antibodies have been approved but have significant side effects and unclear clinical benefit. Always check current local and international guidelines.",
                complications: "Progressive dependence, aspiration pneumonia, immobility.",
                prognosis: "Incurable and progressive, with an average survival of 8-10 years after diagnosis.",
            },
            {
                title: "Huntington's Disease",
                overview: "Huntington's disease is an autosomal dominant neurodegenerative disorder characterized by a combination of progressive movement disorders (chorea), cognitive decline, and psychiatric disturbances. It is caused by an expansion of a CAG trinucleotide repeat in the huntingtin (HTT) gene.",
                learningObjectives: [
                    "Understand the autosomal dominant inheritance pattern and genetic basis (CAG repeat expansion).",
                    "Identify the characteristic atrophy of the caudate nucleus and putamen.",
                    "Recognize chorea as the hallmark movement disorder.",
                    "Appreciate the concept of anticipation in genetic counseling."
                ],
                tags: {
                    organ: "Brain",
                    system: "Nervous System",
                    category: "Genetic",
                    level: "Advanced"
                },
                etiology: [
                    "Expansion of a CAG (glutamine) trinucleotide repeat in the HTT gene on chromosome 4."
                ],
                pathogenesis: "The expanded CAG repeat results in a mutant huntingtin protein with a long polyglutamine tract. This mutant protein is prone to misfolding and aggregation, forming intranuclear inclusions that are toxic to neurons, particularly the medium spiny neurons of the striatum (caudate and putamen).",
                morphology: {
                    gross: "Pronounced atrophy of the caudate nucleus and putamen. This can lead to a 'boxcar' appearance of the lateral ventricles on imaging.",
                    microscopic: "Severe loss of medium spiny neurons in the striatum. Intranuclear inclusions of mutant huntingtin protein can be seen.",
                    imageHint: "huntington's disease brain atrophy"
                },
                clinicalFeatures: "Typically presents in mid-life (30s-40s). The hallmark is chorea, an involuntary, jerky, dance-like movement. Over time, this progresses to parkinsonism and dystonia. Cognitive decline leads to dementia, and psychiatric symptoms like depression and psychosis are common.",
                investigations: "Genetic testing to confirm the number of CAG repeats in the HTT gene is diagnostic.",
                management: "There is no cure or disease-modifying therapy. Management is symptomatic and supportive, including medications to control chorea (e.g., tetrabenazine) and psychiatric symptoms. Genetic counseling is critical for affected families. Always check current local and international guidelines.",
                complications: "Progressive disability, swallowing difficulties leading to aspiration pneumonia, and suicide.",
                prognosis: "Relentlessly progressive, with death typically occurring 15 to 20 years after onset.",
            },
        ]
      }
    ]
  },
  {
    system: "Renal System",
    icon: Droplet,
    categories: [
        {
            name: "Glomerular Diseases",
            diseases: [
                { 
                    title: "Minimal Change Disease",
                    overview: "Minimal change disease is the most common cause of nephrotic syndrome in children. It is characterized by normal-appearing glomeruli on light microscopy but diffuse effacement (flattening) of podocyte foot processes on electron microscopy.",
                    learningObjectives: [
                        "Recognize minimal change disease as the leading cause of nephrotic syndrome in children.",
                        "Describe the classic presentation of nephrotic syndrome.",
                        "Understand the key pathologic finding of podocyte foot process effacement.",
                        "Appreciate the excellent response to corticosteroid therapy."
                    ],
                    tags: {
                        organ: "Kidney",
                        system: "Renal System",
                        category: "Other",
                        level: "Classic"
                    },
                    etiology: [
                        "Idiopathic (most cases).",
                        "May be associated with respiratory infections, immunizations, or certain drugs (e.g., NSAIDs)."
                    ],
                    pathogenesis: "Thought to be caused by a primary disorder of T-cells, which produce a circulating factor that injures podocytes, leading to the flattening of their foot processes and massive proteinuria. The exact factor has not been identified.",
                    morphology: {
                        gross: "Kidneys appear normal.",
                        microscopic: "Light microscopy: Glomeruli appear virtually normal. Immunofluorescence: Negative for immune deposits. Electron Microscopy: This is the key diagnostic finding. It shows diffuse and uniform effacement (flattening) of the foot processes of the podocytes.",
                        imageHint: "minimal change disease electron microscopy"
                    },
                    clinicalFeatures: "Presents with the abrupt onset of the nephrotic syndrome: massive proteinuria (>3.5 g/day), hypoalbuminemia, generalized edema, and hyperlipidemia. Blood pressure is usually normal, and renal function is preserved.",
                    investigations: "Urinalysis showing massive proteinuria without significant hematuria. Serum albumin is low. Renal biopsy is usually not performed in children with a classic presentation, as they are treated empirically.",
                    management: "The disease is highly responsive to corticosteroids. Most children achieve complete remission. For relapsing or steroid-resistant cases, other immunosuppressive agents may be used. Always check current local and international guidelines.",
                    complications: "Increased risk of infection (due to loss of immunoglobulins in urine) and thromboembolism (due to loss of anticoagulant proteins).",
                    prognosis: "Excellent. Despite relapses, the long-term prognosis is very good, and progression to chronic renal failure is rare.",
                },
                { 
                    title: "Diabetic Nephropathy",
                    overview: "Diabetic nephropathy is a major complication of both Type 1 and Type 2 diabetes mellitus and is the leading cause of end-stage renal disease (ESRD) worldwide. It is characterized by a series of pathologic changes in the glomeruli, tubules, and renal vasculature.",
                    learningObjectives: [
                        "Identify diabetes as the leading cause of ESRD.",
                        "Describe the key histologic lesions, including mesangial expansion and Kimmelstiel-Wilson nodules.",
                        "Understand the progression from microalbuminuria to overt proteinuria and renal failure.",
                        "Recognize the importance of glycemic and blood pressure control in prevention."
                    ],
                    tags: {
                        organ: "Kidney",
                        system: "Renal System",
                        category: "Metabolic",
                        level: "Intermediate"
                    },
                    etiology: [
                        "Type 1 and Type 2 Diabetes Mellitus."
                    ],
                    pathogenesis: "Chronic hyperglycemia is the primary driver of damage. It leads to the non-enzymatic glycosylation of proteins, forming advanced glycation end-products (AGEs) that cause cross-linking of collagen and other proteins. Hyperglycemia also activates protein kinase C and other pathways that promote the production of cytokines and growth factors, leading to glomerular hypertrophy, mesangial expansion, and fibrosis.",
                    morphology: {
                        gross: "Kidneys may be enlarged initially, but become shrunken and granular in later stages.",
                        microscopic: "The earliest change is thickening of the glomerular basement membrane (GBM). This is followed by diffuse expansion of the mesangial matrix. The pathognomonic lesion is the Kimmelstiel-Wilson nodule, which is a nodular, PAS-positive deposit of matrix in the mesangium. Other findings include hyaline arteriolosclerosis of both afferent and efferent arterioles.",
                        imageHint: "diabetic nephropathy kimmelstiel-wilson"
                    },
                    clinicalFeatures: "The first clinical sign is the development of microalbuminuria (small amounts of albumin in the urine). This can progress to overt proteinuria (nephrotic-range) and a gradual decline in the glomerular filtration rate (GFR), eventually leading to end-stage renal disease.",
                    investigations: "Annual screening for microalbuminuria in all diabetic patients is crucial. Serum creatinine and eGFR are monitored to track renal function.",
                    management: "Strict glycemic control (monitoring HbA1c) and aggressive blood pressure control (using ACE inhibitors or ARBs, which are renoprotective) are the cornerstones of management to slow disease progression. Always check current local and international diabetes guidelines.",
                    complications: "End-stage renal disease requiring dialysis or transplantation.",
                    prognosis: "Progressive, but the rate of decline can be significantly slowed with good management of blood sugar and blood pressure.",
                },
                 {
                    title: "Membranous Nephropathy",
                    overview: "Membranous nephropathy is a common cause of nephrotic syndrome in adults. It is an autoimmune disease characterized by the deposition of immune complexes along the subepithelial side of the glomerular basement membrane, leading to basement membrane thickening and podocyte injury.",
                    learningObjectives: [
                        "Recognize membranous nephropathy as a common cause of adult nephrotic syndrome.",
                        "Understand the pathogenesis involving antibodies against the phospholipase A2 receptor (PLA2R).",
                        "Identify the characteristic 'spike and dome' appearance on silver stain.",
                        "Describe the typical granular immunofluorescence pattern."
                    ],
                    tags: {
                        organ: "Kidney",
                        system: "Renal System",
                        category: "Autoimmune",
                        level: "Advanced"
                    },
                    etiology: [
                        "Primary (idiopathic) in about 85% of cases, associated with autoantibodies to the PLA2R on podocytes.",
                        "Secondary to other conditions, such as drugs (NSAIDs), infections (Hepatitis B), and other autoimmune diseases (lupus)."
                    ],
                    pathogenesis: "In the primary form, circulating antibodies bind to the PLA2R antigen on the surface of podocytes. This in-situ formation of immune complexes activates the complement system, leading to the formation of the membrane attack complex (C5b-C9), which injures the podocytes and disrupts the glomerular filtration barrier, causing proteinuria.",
                    morphology: {
                        gross: "Kidneys may appear normal or slightly enlarged and pale.",
                        microscopic: "Light microscopy shows diffuse, uniform thickening of the glomerular basement membrane (GBM) without significant hypercellularity. Silver stain (Jones stain) highlights new basement membrane material laid down between the immune deposits, creating a characteristic 'spike and dome' pattern. Immunofluorescence shows granular deposits of IgG and C3 along the capillary walls.",
                        imageHint: "membranous nephropathy spike and dome"
                    },
                    clinicalFeatures: "Presents with the insidious onset of nephrotic syndrome (heavy proteinuria, edema, hypoalbuminemia). Can also present with non-nephrotic proteinuria.",
                    investigations: "Urinalysis, serum albumin, and lipid profile confirm nephrotic syndrome. Serology for PLA2R antibodies is highly specific for primary membranous nephropathy. Renal biopsy is often required for definitive diagnosis.",
                    management: "Management depends on the risk of progression. Low-risk patients may be managed with supportive care (ACE inhibitors, statins). High-risk patients require immunosuppressive therapy, such as cyclophosphamide and corticosteroids, or rituximab. Always check current local and international guidelines.",
                    complications: "Thromboembolism, progressive renal failure.",
                    prognosis: "Variable. About one-third of patients undergo spontaneous remission, one-third remain proteinuric but stable, and one-third progress to end-stage renal disease.",
                }
            ]
        },
        {
            name: "Tubulointerstitial Diseases",
            diseases: [
                { 
                    title: "Acute Pyelonephritis",
                    overview: "Acute pyelonephritis is an infection of the kidney parenchyma and renal pelvis. It is a common complication of an ascending urinary tract infection, most frequently caused by E. coli.",
                    learningObjectives: [
                        "Define acute pyelonephritis and its typical cause.",
                        "Describe the route of infection (ascending vs. hematogenous).",
                        "Recognize the key histologic feature: neutrophilic infiltration of the tubules and interstitium.",
                        "Differentiate clinically from lower urinary tract infection (cystitis)."
                    ],
                    tags: {
                        organ: "Kidney",
                        system: "Renal System",
                        category: "Infectious",
                        level: "Basic"
                    },
                    etiology: [
                        "Escherichia coli (most common, >85% of cases).",
                        "Other gram-negative rods (e.g., Proteus, Klebsiella).",
                        "Risk factors include urinary tract obstruction, vesicoureteral reflux, and catheterization."
                    ],
                    pathogenesis: "Most cases result from an ascending infection from the lower urinary tract. Bacteria colonize the urethra, ascend to the bladder, and then travel up the ureters to the kidney. Vesicoureteral reflux, a condition where urine flows backward from the bladder to the ureters, is a major predisposing factor.",
                    morphology: {
                        gross: "The kidney may be enlarged. There are often discrete, yellowish, raised abscesses visible on the cortical surface.",
                        microscopic: "The characteristic finding is a patchy interstitial inflammation with a dense infiltrate of neutrophils. Neutrophils are also seen within the lumina of renal tubules, forming 'neutrophil casts' or 'pus casts'.",
                        imageHint: "acute pyelonephritis histology"
                    },
                    clinicalFeatures: "Presents with the sudden onset of fever, chills, and flank pain (costovertebral angle tenderness). Often accompanied by symptoms of cystitis, such as dysuria, frequency, and urgency.",
                    investigations: "Urinalysis shows pyuria (WBCs), bacteriuria, and, most importantly, white blood cell casts, which are diagnostic of renal involvement.",
                    management: "Treatment consists of appropriate antibiotics based on urine culture and sensitivity results. Always check current local and international UTI guidelines.",
                    complications: "Sepsis, papillary necrosis, pyonephrosis (pus filling the renal pelvis), and perinephric abscess. Recurrent infections can lead to chronic pyelonephritis and renal scarring.",
                    prognosis: "Excellent with prompt and appropriate antibiotic therapy.",
                },
                 {
                    title: "Acute Tubular Necrosis (ATN)",
                    overview: "Acute tubular necrosis is the most common cause of acute kidney injury (AKI). It is characterized by the destruction of renal tubular epithelial cells, most often due to ischemia or nephrotoxins.",
                    learningObjectives: [
                        "Define ATN and recognize it as the leading cause of AKI.",
                        "Differentiate between ischemic and nephrotoxic ATN.",
                        "Describe the key histologic features, including tubular cell necrosis and muddy brown casts.",
                        "Understand the clinical phases of ATN (initiation, maintenance, recovery)."
                    ],
                    tags: {
                        organ: "Kidney",
                        system: "Renal System",
                        category: "Other",
                        level: "Intermediate"
                    },
                    etiology: [
                        "Ischemic: Prolonged hypotension or hypovolemia (e.g., from major surgery, sepsis, hemorrhage).",
                        "Nephrotoxic: Direct toxicity from drugs (e.g., aminoglycosides, cisplatin), contrast agents, or endogenous substances (e.g., myoglobin in rhabdomyolysis)."
                    ],
                    pathogenesis: "Ischemia leads to loss of cell polarity, detachment of tubular cells from the basement membrane, and obstruction of the tubular lumen by casts, all of which decrease GFR. Nephrotoxins cause direct cellular injury and necrosis. In both cases, the injury leads to a sharp decline in renal function.",
                    morphology: {
                        gross: "Kidneys are often swollen and pale.",
                        microscopic: "Shows necrosis and sloughing of tubular epithelial cells, particularly in the proximal convoluted tubule and the thick ascending limb. The tubules are often dilated and contain characteristic granular, pigmented 'muddy brown' casts. The interstitium is edematous.",
                        imageHint: "acute tubular necrosis histology"
                    },
                    clinicalFeatures: "Presents with acute kidney injury, characterized by a rapid rise in serum creatinine and a decrease in urine output (oliguria). The clinical course has three phases: 1. Initiation (the period of initial insult), 2. Maintenance (oliguria and uremia), and 3. Recovery (urine output increases, but tubules are still damaged, leading to electrolyte imbalances).",
                    investigations: "Urinalysis shows muddy brown granular casts, a high fractional excretion of sodium (FENa > 2%), and urine osmolality that is similar to plasma.",
                    management: "Management is supportive. The underlying cause must be corrected (e.g., restore blood pressure, stop offending drug). Careful management of fluids and electrolytes is crucial. Dialysis may be required during the oliguric phase.",
                    complications: "Hyperkalemia, metabolic acidosis, uremia, fluid overload.",
                    prognosis: "Potentially reversible if the underlying cause is treated and the patient survives the acute phase. The tubular epithelium has a remarkable capacity for regeneration.",
                }
            ]
        }
    ]
  },
  {
    system: "Endocrine System",
    icon: Dna,
    categories: [
        {
            name: "Thyroid Pathology",
            diseases: [
                { 
                    title: "Graves' Disease",
                    overview: "Graves' disease is an autoimmune disorder that is the most common cause of endogenous hyperthyroidism. It is characterized by the production of autoantibodies that stimulate the TSH receptor, leading to uncontrolled thyroid hormone production.",
                    learningObjectives: [
                        "Define Graves' disease as an autoimmune cause of hyperthyroidism.",
                        "Understand the role of TSH receptor antibodies (TSI).",
                        "Describe the classic clinical triad: thyrotoxicosis, ophthalmopathy, and dermopathy.",
                        "Recognize the key histologic features of diffuse hyperplasia."
                    ],
                    tags: {
                        organ: "Thyroid",
                        system: "Endocrine System",
                        category: "Autoimmune",
                        level: "Classic"
                    },
                    etiology: [
                        "Autoimmune, with a strong genetic predisposition (associated with certain HLA types)."
                    ],

                    pathogenesis: "The central defect is a failure of self-tolerance, leading to the production of several autoantibodies. The most important is Thyroid-Stimulating Immunoglobulin (TSI), an IgG antibody that binds to and activates the TSH receptor on thyroid follicular cells, mimicking the action of TSH and causing chronic, unregulated overproduction of thyroid hormones.",
                    morphology: {
                        gross: "The thyroid gland is diffusely and symmetrically enlarged. The parenchyma is soft and has a 'beefy-red' appearance.",
                        microscopic: "The follicles are lined by tall, crowded columnar epithelial cells that project into the follicular lumen, forming small papillae. The colloid within the follicles is pale and scalloped at the margins, reflecting active resorption. A lymphocytic infiltrate is present in the stroma.",
                        imageHint: "graves' disease histology"
                    },
                    clinicalFeatures: "Presents with signs of hyperthyroidism (thyrotoxicosis): heat intolerance, weight loss despite increased appetite, palpitations, anxiety, and tremor. The classic extrathyroidal manifestations are: 1. Infiltrative ophthalmopathy (exophthalmos) due to inflammation and edema of the extraocular muscles and retro-orbital tissues. 2. Pretibial myxedema (a localized, infiltrative dermopathy).",
                    investigations: "Laboratory tests show high levels of free T4 and T3, with a suppressed TSH level. The presence of TSH receptor antibodies (TSI) is diagnostic.",
                    management: "Treatment options include: 1. Beta-blockers for symptomatic control. 2. Antithyroid drugs (e.g., methimazole, propylthiouracil) to block hormone synthesis. 3. Radioiodine ablation to destroy thyroid tissue. 4. Thyroidectomy (surgical removal). Always check current local and international hyperthyroidism guidelines.",
                    complications: "Thyroid storm (a life-threatening exacerbation of hyperthyroidism), atrial fibrillation, heart failure.",
                    prognosis: "Manageable with treatment, but often requires lifelong therapy or results in permanent hypothyroidism after ablation or surgery.",
                },
                { 
                    title: "Hashimoto's Thyroiditis",
                    overview: "Hashimoto's thyroiditis is an autoimmune disease that is the most common cause of hypothyroidism in areas of the world where iodine levels are sufficient. It is characterized by the gradual destruction of the thyroid gland by a combination of cell-mediated and antibody-mediated immune processes.",
                    learningObjectives: [
                        "Recognize Hashimoto's thyroiditis as the most common cause of hypothyroidism in developed countries.",
                        "Describe the autoimmune pathogenesis involving both T-cells and autoantibodies.",
                        "Identify the key histologic features: lymphocytic infiltrate, germinal centers, and Hürthle cell metaplasia.",
                        "Understand the clinical course from euthyroidism to hypothyroidism."
                    ],
                    tags: {
                        organ: "Thyroid",
                        system: "Endocrine System",
                        category: "Autoimmune",
                        level: "Classic"
                    },
                    etiology: [
                        "Autoimmune, with a strong genetic predisposition."
                    ],
                    pathogenesis: "The pathogenesis involves a breakdown of self-tolerance to thyroid autoantigens. This leads to: 1. CD8+ cytotoxic T-cell-mediated killing of thyroid follicular cells. 2. Cytokine-mediated cell death (e.g., via IFN-γ). 3. Antibody-dependent cell-mediated cytotoxicity. Autoantibodies against thyroglobulin and thyroid peroxidase are present and are useful diagnostic markers.",
                    morphology: {
                        gross: "The thyroid is diffusely and symmetrically enlarged, though it can be atrophic in later stages. The cut surface is pale, gray-tan, and firm.",
                        microscopic: "The key features are: 1. A dense, widespread lymphocytic infiltrate, often with well-formed germinal centers. 2. Destruction of thyroid follicles. 3. The remaining follicular cells often show Hürthle cell (or oncocytic) metaplasia, characterized by abundant, eosinophilic, granular cytoplasm.",
                        imageHint: "hashimoto thyroiditis histology"
                    },
                    clinicalFeatures: "Presents with gradual thyroid failure, preceded by a period of goiter without functional abnormality. Symptoms of hypothyroidism include fatigue, cold intolerance, weight gain, constipation, and dry skin.",
                    investigations: "Laboratory tests show a low free T4 level with an elevated TSH level (primary hypothyroidism). The presence of anti-thyroid peroxidase (anti-TPO) and/or anti-thyroglobulin antibodies is highly suggestive of the diagnosis.",
                    management: "Treatment involves lifelong thyroid hormone replacement therapy with levothyroxine. Always check current local and international hypothyroidism guidelines.",
                    complications: "Increased risk of other autoimmune diseases and a small increased risk of developing B-cell non-Hodgkin lymphoma of the thyroid.",
                    prognosis: "Excellent with hormone replacement therapy.",
                },
                { 
                    title: "Papillary Thyroid Carcinoma",
                    overview: "Papillary thyroid carcinoma (PTC) is the most common form of thyroid cancer. It is known for its excellent prognosis and characteristic nuclear features, which are key to its diagnosis.",
                    learningObjectives: [
                        "Recognize PTC as the most common thyroid malignancy.",
                        "Identify prior radiation exposure as a major risk factor.",
                        "Describe the pathognomonic nuclear features ('Orphan Annie eyes', grooves, pseudoinclusions).",
                        "Understand that prognosis is generally excellent."
                    ],
                    tags: {
                        organ: "Thyroid",
                        system: "Endocrine System",
                        category: "Neoplastic",
                        level: "Classic"
                    },
                    etiology: [
                        "Exposure to ionizing radiation, particularly in childhood.",
                        "Genetic mutations in the MAPK pathway (e.g., BRAF mutations, RET/PTC rearrangements)."
                    ],
                    pathogenesis: "Mutations that activate the MAPK signaling pathway are central to the development of PTC. These mutations lead to uncontrolled cell growth and proliferation.",
                    morphology: {
                        gross: "Tumors can be solitary or multifocal, and may appear well-circumscribed or infiltrative. They are often solid, gray-white, and may have cystic or papillary areas.",
                        microscopic: "The diagnosis is based on nuclear features, not the papillary architecture. The key features are: 1. Enlarged, overlapping nuclei with finely dispersed, optically clear chromatin ('Orphan Annie eye' nuclei). 2. Nuclear grooves (longitudinal invaginations of the nuclear membrane). 3. Intranuclear cytoplasmic pseudoinclusions. Psammoma bodies (concentrically calcified structures) are also common.",
                        imageHint: "papillary thyroid carcinoma histology"
                    },
                    clinicalFeatures: "Usually presents as a painless, palpable thyroid nodule or a mass in the neck due to lymph node metastasis. May be discovered incidentally on imaging.",
                    investigations: "Ultrasound is used to characterize the nodule. Fine-needle aspiration (FNA) cytology is the primary diagnostic tool and is often sufficient for diagnosis due to the characteristic nuclear features.",
                    management: "Treatment typically involves total or near-total thyroidectomy, followed by radioiodine ablation for higher-risk patients. Patients require lifelong thyroid hormone suppression therapy. Always check current local and international thyroid cancer guidelines.",
                    complications: "Metastasis to cervical lymph nodes is common but does not significantly worsen the excellent prognosis. Distant metastases (e.g., to lung) are rare.",
                    prognosis: "Excellent, with a 10-year survival rate exceeding 95%.",
                },
            ]
        },
        {
            name: "Parathyroid Pathology",
            diseases: [
                {
                    title: "Primary Hyperparathyroidism",
                    overview: "Primary hyperparathyroidism is a condition characterized by the excessive, unregulated secretion of parathyroid hormone (PTH), leading to hypercalcemia. It is most commonly caused by a benign parathyroid adenoma.",
                    learningObjectives: [
                        "Define primary hyperparathyroidism and its relation to hypercalcemia.",
                        "Identify parathyroid adenoma as the most common cause.",
                        "Recognize the clinical manifestations summarized as 'bones, stones, groans, and psychiatric overtones'.",
                        "Interpret the key laboratory findings of high PTH and high calcium."
                    ],
                    tags: {
                        organ: "Parathyroid",
                        system: "Endocrine System",
                        category: "Neoplastic",
                        level: "Classic"
                    },
                    etiology: [
                        "Parathyroid adenoma (~85% of cases).",
                        "Primary hyperplasia (~10-15%).",
                        "Parathyroid carcinoma (<1%)."
                    ],
                    pathogenesis: "A somatic mutation in a single parathyroid chief cell leads to the clonal expansion and formation of a benign tumor (adenoma) that autonomously secretes PTH, irrespective of the serum calcium level. The excess PTH causes increased bone resorption, increased renal calcium reabsorption, and increased intestinal calcium absorption (via activation of Vitamin D), all leading to hypercalcemia.",
                    morphology: {
                        gross: "A parathyroid adenoma is typically a single, encapsulated, soft, tan-to-reddish-brown nodule. The remaining parathyroid glands are usually normal or shrunken due to feedback inhibition.",
                        microscopic: "The adenoma is composed of uniform, polygonal chief cells arranged in sheets, with a delicate vascular network. A key feature is the absence of adipose tissue within the adenoma, which is normally present in an adult parathyroid gland.",
                        imageHint: "parathyroid adenoma histology"
                    },
                    clinicalFeatures: "Many patients are asymptomatic and diagnosed on routine blood tests. Symptomatic patients can present with the classic mnemonic 'painful bones (osteitis fibrosa cystica), renal stones, abdominal groans (pancreatitis, peptic ulcers), and psychiatric overtones (depression, lethargy)'.",
                    investigations: "The key laboratory finding is an elevated serum calcium level with a simultaneously elevated or inappropriately normal PTH level.",
                    management: "Surgical removal of the adenomatous gland (parathyroidectomy) is the definitive treatment. Always check current local and international guidelines.",
                    complications: "Osteoporosis, kidney stones, pancreatitis.",
                    prognosis: "Excellent after successful surgery.",
                },
            ]
        }
    ]
  },
  {
    system: "Musculoskeletal System",
    icon: Bone,
    categories: [
        {
            name: "Bone Tumors",
            diseases: [
                { 
                    title: "Osteosarcoma",
                    overview: "Osteosarcoma is the most common primary malignant tumor of bone. It is a bone-producing mesenchymal tumor that most frequently arises in the metaphysis of long bones, particularly around the knee, in adolescents and young adults.",
                    learningObjectives: [
                        "Identify osteosarcoma as the most common primary bone cancer.",
                        "Recognize its typical patient demographic (adolescents) and location (around the knee).",
                        "Describe the key histologic feature: production of osteoid (unmineralized bone) by malignant tumor cells.",
                        "Understand the characteristic 'sunburst' appearance and Codman's triangle on X-ray."
                    ],
                    tags: {
                        organ: "Bone",
                        system: "Musculoskeletal System",
                        category: "Neoplastic",
                        level: "Advanced"
                    },
                    etiology: [
                        "Most are sporadic.",
                        "Associated with genetic conditions like hereditary retinoblastoma (RB1 gene mutations) and Li-Fraumeni syndrome (TP53 gene mutations).",
                        "Can arise in the setting of prior radiation or Paget's disease of bone in older adults."
                    ],
                    pathogenesis: "Driven by complex genetic alterations, including mutations in the RB1 and TP53 tumor suppressor genes, which lead to the uncontrolled proliferation of malignant osteoblasts.",
                    morphology: {
                        gross: "The tumor is typically a large, gritty, gray-white mass that arises in the metaphysis, destroying the cortex and forming a soft tissue mass. It often shows areas of hemorrhage and cystic change.",
                        microscopic: "The diagnostic hallmark is the production of malignant osteoid (a pink, amorphous extracellular material) by the anaplastic tumor cells. The tumor cells are pleomorphic, with large, hyperchromatic nuclei.",
                        imageHint: "osteosarcoma histology"
                    },
                    clinicalFeatures: "Presents with bone pain, which may be worse at night, and a progressively enlarging, tender mass. Pathologic fracture can occur.",
                    investigations: "X-ray shows a destructive mass, often with a 'sunburst' pattern of periosteal reaction and lifting of the cortex to form a Codman's triangle. MRI is used to define the extent of the tumor. Biopsy is required for diagnosis.",
                    management: "Current standard of care is neoadjuvant chemotherapy (chemotherapy before surgery) followed by limb-sparing surgical resection and then further adjuvant chemotherapy. Always check current local and international sarcoma guidelines.",
                    complications: "Metastasis, most commonly to the lungs.",
                    prognosis: "With modern multi-agent chemotherapy and surgery, the long-term survival rate is approximately 60-70%.",
                },
                 { 
                    title: "Ewing Sarcoma",
                    overview: "Ewing sarcoma is a malignant small round blue cell tumor of bone and soft tissue that primarily affects children and young adults. It is characterized by a specific chromosomal translocation, most commonly t(11;22).",
                    learningObjectives: [
                        "Recognize Ewing sarcoma as a 'small round blue cell tumor' of childhood.",
                        "Identify its characteristic chromosomal translocation t(11;22).",
                        "Describe the classic 'onion-skin' periosteal reaction on X-ray.",
                        "Understand the importance of immunohistochemistry (CD99 positivity) for diagnosis."
                    ],
                    tags: {
                        organ: "Bone",
                        system: "Musculoskeletal System",
                        category: "Neoplastic",
                        level: "Advanced"
                    },
                    etiology: [
                        "Specific chromosomal translocation, t(11;22)(q24;q12), which creates an EWS-FLI1 fusion gene that acts as an aberrant transcription factor."
                    ],
                    pathogenesis: "The EWS-FLI1 fusion protein drives oncogenesis by altering the expression of numerous downstream genes involved in cell proliferation, survival, and differentiation.",
                    morphology: {
                        gross: "Typically arises in the diaphysis of long bones (like the femur) or in the flat bones of the pelvis. It is a soft, tan-white tumor that often invades the cortex and forms a large soft tissue mass.",
                        microscopic: "Composed of sheets of uniform, small round blue cells with scant, clear cytoplasm. Homer-Wright rosettes (tumor cells arranged around a central fibrillary space) may be present. Immunohistochemistry showing strong membrane positivity for CD99 is a key diagnostic feature.",
                        imageHint: "ewing sarcoma histology"
                    },
                    clinicalFeatures: "Presents as a painful, enlarging mass. Systemic symptoms like fever and leukocytosis can be present, mimicking an infection.",
                    investigations: "X-ray often shows a destructive lytic tumor with a characteristic 'onion-skin' layered periosteal reaction. Biopsy is essential for diagnosis. Molecular testing for the t(11;22) translocation is confirmatory.",
                    management: "Treatment involves a combination of multi-agent chemotherapy, surgery, and/or radiation therapy. Always check current local and international sarcoma guidelines.",
                    complications: "Metastasis to lungs, bone, and bone marrow.",
                    prognosis: "With aggressive multimodal therapy, long-term survival is around 70% for patients with localized disease.",
                },
                { 
                    title: "Chondrosarcoma",
                    overview: "Chondrosarcoma is a malignant tumor that produces cartilage. It is the second most common primary malignant tumor of bone after osteosarcoma and typically affects adults over the age of 40.",
                    learningObjectives: [
                        "Define chondrosarcoma as a cartilage-producing malignancy.",
                        "Recognize its predilection for the axial skeleton (pelvis, ribs, shoulder).",
                        "Describe the histologic features, including grading based on cellularity and atypia.",
                        "Understand that it is largely resistant to chemotherapy and radiation."
                    ],
                    tags: {
                        organ: "Bone",
                        system: "Musculoskeletal System",
                        category: "Neoplastic",
                        level: "Advanced"
                    },
                    etiology: [
                        "Can arise de novo (primary) or from a pre-existing benign cartilage tumor like an enchondroma or osteochondroma (secondary)."
                    ],
                    pathogenesis: "Involves mutations in genes like IDH1 and IDH2. The tumor cells are malignant chondrocytes that produce an abnormal cartilaginous matrix.",
                    morphology: {
                        gross: "A large, bulky tumor made up of gray-white, translucent, glistening nodules of cartilage. The tumor often erodes through the cortex.",
                        microscopic: "The diagnosis and grade depend on cellularity, cytologic atypia, and mitotic activity. Low-grade tumors have mildly increased cellularity and minimal atypia. High-grade tumors are highly cellular with severe pleomorphism and frequent mitoses. The key is to find malignant chondrocytes within a cartilaginous matrix.",
                        imageHint: "chondrosarcoma histology"
                    },
                    clinicalFeatures: "Presents as a painful, progressively enlarging mass. Typically affects the central skeleton (pelvis, shoulder, ribs) more often than the long bones.",
                    investigations: "X-ray shows a lytic lesion with characteristic 'rings and arcs' or 'popcorn' calcifications, representing calcification of the cartilaginous matrix. Biopsy is required for diagnosis.",
                    management: "Wide surgical excision is the mainstay of treatment. Most chondrosarcomas are resistant to chemotherapy and radiation therapy. Always check current local and international sarcoma guidelines.",
                    complications: "Local recurrence after inadequate excision, metastasis (especially high-grade tumors).",
                    prognosis: "Highly dependent on the histologic grade. Low-grade tumors have an excellent prognosis with surgery alone, while high-grade tumors have a high risk of metastasis and a poor prognosis.",
                },
            ]
        },
        {
            name: "Diseases of Joints",
            diseases: [
                { 
                    title: "Osteoarthritis",
                    overview: "Osteoarthritis (OA) is the most common type of joint disease, characterized by the progressive degeneration and loss of articular cartilage, leading to pain and loss of function. It is primarily a disease of 'wear and tear' and aging.",
                    learningObjectives: [
                        "Define osteoarthritis as a degenerative, non-inflammatory joint disease.",
                        "Understand the central role of articular cartilage breakdown in its pathogenesis.",
                        "Recognize the key pathologic features, including eburnation, osteophytes, and subchondral cysts.",
                        "Differentiate OA clinically and pathologically from rheumatoid arthritis."
                    ],
                    tags: {
                        organ: "Joints",
                        system: "Musculoskeletal System",
                        category: "Degenerative",
                        level: "Classic"
                    },
                    etiology: [
                        "Primary (idiopathic): Related to aging and mechanical stress.",
                        "Secondary: Due to a predisposing condition like trauma, congenital deformity, or other forms of arthritis."
                    ],
                    pathogenesis: "OA is driven by a combination of mechanical stress and biochemical changes. Chondrocytes, the cells of cartilage, initially attempt to repair damage but eventually fail. They produce degradative enzymes (like metalloproteinases) that break down the cartilage matrix. This leads to a vicious cycle of cartilage erosion, exposure of the underlying bone, and secondary inflammatory changes.",
                    morphology: {
                        gross: "The articular cartilage becomes softened, fibrillated, and eventually completely worn away, exposing the underlying subchondral bone, which becomes polished and ivory-like (eburnation). Bony outgrowths (osteophytes) form at the margins of the joint. Small fractures in the subchondral bone can lead to the formation of subchondral cysts.",
                        microscopic: "Early changes include fibrillation and cracking of the cartilage surface. Later, there is a complete loss of cartilage and thickening of the subchondral bone plate.",
                        imageHint: "osteoarthritis gross knee"
                    },
                    clinicalFeatures: "Presents with joint pain that worsens with use and is relieved by rest. Morning stiffness is minimal (<30 minutes). Commonly affects weight-bearing joints (knees, hips) and the small joints of the hands (DIP and PIP joints, forming Heberden's and Bouchard's nodes).",
                    investigations: "Diagnosis is primarily clinical and radiographic. X-rays show joint space narrowing, subchondral sclerosis, osteophytes, and cysts.",
                    management: "Management is focused on symptom relief and maintaining function. This includes weight loss, physical therapy, and analgesics (e.g., paracetamol, NSAIDs). In end-stage disease, joint replacement surgery is highly effective. Always check current local and international OA guidelines.",
                    complications: "Chronic pain, joint deformity, and loss of mobility.",
                    prognosis: "A progressive condition, but many patients can be managed effectively with conservative measures.",
                },
                 { 
                    title: "Rheumatoid Arthritis",
                    overview: "Rheumatoid arthritis (RA) is a chronic, systemic autoimmune disease that primarily affects the joints, leading to a symmetric, inflammatory, destructive polyarthritis. It can also have numerous extra-articular manifestations.",
                    learningObjectives: [
                        "Define RA as a systemic autoimmune disease.",
                        "Understand the role of autoantibodies (RF and anti-CCP) and T-cell mediated inflammation.",
                        "Describe the formation of a pannus and its destructive effects on cartilage and bone.",
                        "Recognize the classic clinical presentation of symmetric arthritis with morning stiffness."
                    ],
                    tags: {
                        organ: "Joints",
                        system: "Musculoskeletal System",
                        category: "Autoimmune",
                        level: "Classic"
                    },
                    etiology: [
                        "Autoimmune, with a strong genetic predisposition (HLA-DR4) combined with environmental triggers (e.g., smoking)."
                    ],
                    pathogenesis: "RA is initiated by the activation of CD4+ T-cells, which respond to an unknown antigen. These T-cells produce cytokines that activate macrophages and other inflammatory cells in the synovium. B-cells are also activated, producing autoantibodies like Rheumatoid Factor (RF) and anti-citrullinated protein antibodies (anti-CCP). This chronic inflammation leads to synovial hyperplasia and the formation of a pannus, a mass of inflamed synovial tissue, inflammatory cells, and fibroblasts that grows over the articular cartilage and erodes the underlying bone.",
                    morphology: {
                        gross: "Affected joints are swollen and warm. The synovium is thickened, edematous, and hyperplastic, with finger-like projections (villi). The pannus erodes the cartilage and bone, leading to joint space narrowing and bony erosions. In late stages, fibrous or bony ankylosis (fusion of the joint) can occur, causing permanent deformity.",
                        microscopic: "The synovium shows a dense inflammatory infiltrate of lymphocytes and plasma cells (often forming lymphoid follicles), synovial cell hyperplasia, and increased vascularity. The pannus is seen invading the cartilage.",
                        imageHint: "rheumatoid arthritis pannus histology"
                    },
                    clinicalFeatures: "Presents with a symmetric arthritis affecting multiple small joints (MCP, PIP joints of the hands, MTP joints of the feet). Characterized by prolonged morning stiffness (>1 hour) that improves with activity. Systemic symptoms like fatigue and low-grade fever are common.",
                    investigations: "Blood tests for Rheumatoid Factor (RF) and anti-CCP antibodies (more specific) are key. Inflammatory markers (ESR, CRP) are elevated. X-rays show joint space narrowing and marginal bony erosions.",
                    management: "Early treatment with disease-modifying antirheumatic drugs (DMARDs), such as methotrexate, is crucial to prevent joint destruction. Biologic agents (e.g., anti-TNF inhibitors) are used for more severe disease. NSAIDs and corticosteroids are used for symptom control. Always check current local and international RA guidelines.",
                    complications: "Joint destruction and deformity, rheumatoid nodules, vasculitis, and an increased risk of cardiovascular disease.",
                    prognosis: "A chronic, progressive disease, but modern therapies have significantly improved outcomes and can induce remission.",
                },
                 { 
                    title: "Gout",
                    overview: "Gout is a metabolic disease characterized by recurrent episodes of acute inflammatory arthritis due to the deposition of monosodium urate (MSU) crystals in joints and soft tissues. It is caused by chronic hyperuricemia.",
                    learningObjectives: [
                        "Define gout and its relationship to hyperuricemia.",
                        "Describe the mechanism of MSU crystal-induced inflammation, involving the inflammasome.",
                        "Recognize the characteristic appearance of needle-shaped, negatively birefringent crystals.",
                        "Differentiate between acute gouty arthritis and chronic tophaceous gout."
                    ],
                    tags: {
                        organ: "Joints",
                        system: "Musculoskeletal System",
                        category: "Metabolic",
                        level: "Classic"
                    },
                    etiology: [
                        "Primary gout (most common): Due to an unknown enzyme defect or underexcretion of uric acid by the kidneys.",
                        "Secondary gout: Due to conditions that increase uric acid production (e.g., leukemia, chemotherapy) or decrease its excretion (e.g., renal failure, diuretics)."
                    ],
                    pathogenesis: "When serum uric acid levels are elevated, MSU crystals can precipitate in and around joints. These crystals are phagocytosed by macrophages, which triggers the activation of the NLRP3 inflammasome, leading to the production of interleukin-1β (IL-1β) and a massive neutrophilic inflammatory response, causing the acute arthritis.",
                    morphology: {
                        gross: "Acute arthritis shows a swollen, red joint. Chronic tophaceous gout is characterized by the formation of tophi, which are large aggregates of MSU crystals surrounded by a foreign-body giant cell reaction. Tophi commonly occur in the ear helix, joints, and tendons.",
                        microscopic: "Synovial fluid analysis during an acute attack reveals numerous neutrophils and needle-shaped MSU crystals, which are negatively birefringent under polarized light. A tophus consists of a central core of urate crystals surrounded by macrophages, lymphocytes, and giant cells.",
                        imageHint: "gout crystals polarized light"
                    },
                    clinicalFeatures: "Presents with a sudden onset of excruciatingly painful arthritis, most classically in the first metatarsophalangeal joint (podagra). The attacks are self-limited but recurrent.",
                    investigations: "Definitive diagnosis requires aspiration of synovial fluid and identification of MSU crystals. Serum uric acid level is usually elevated but can be normal during an acute attack.",
                    management: "Acute attacks are treated with anti-inflammatory drugs like NSAIDs, colchicine, or corticosteroids. Long-term management to lower uric acid levels involves drugs like allopurinol (a xanthine oxidase inhibitor) or probenecid (a uricosuric agent). Always check current local and international gout guidelines.",
                    complications: "Chronic tophaceous arthritis with joint destruction, and urate nephropathy.",
                    prognosis: "Excellent with proper long-term management.",
                }
            ]
        }
    ]
  },
  {
    system: "Hematopoietic & Lymphoid Systems",
    icon: TestTube,
    categories: [
        {
            name: "Red Blood Cell Disorders",
            diseases: [
                { 
                    title: "Iron Deficiency Anemia",
                    overview: "Iron deficiency anemia is the most common type of anemia worldwide. It results from insufficient iron to support normal red blood cell production, leading to the formation of small (microcytic) and pale (hypochromic) red blood cells.",
                    learningObjectives: [
                        "Identify iron deficiency as the most common cause of anemia.",
                        "List the major causes of iron deficiency.",
                        "Describe the classic peripheral blood smear findings of microcytic, hypochromic anemia.",
                        "Interpret key iron studies (ferritin, iron, TIBC)."
                    ],
                    tags: {
                        organ: "Blood",
                        system: "Hematopoietic & Lymphoid Systems",
                        category: "Metabolic",
                        level: "Basic"
                    },
                    etiology: [
                        "Chronic blood loss (e.g., from GI tract, menstruation).",
                        "Inadequate dietary intake.",
                        "Malabsorption (e.g., celiac disease).",
                        "Increased demand (e.g., pregnancy, infancy)."
                    ],
                    pathogenesis: "Iron is an essential component of heme, which is part of hemoglobin. When iron stores are depleted, hemoglobin synthesis is impaired. The body produces red blood cells that are smaller than normal and contain less hemoglobin, leading to anemia.",
                    morphology: {
                        gross: "N/A.",
                        microscopic: "Peripheral blood smear shows microcytic (low MCV), hypochromic (low MCH/MCHC) red blood cells with increased central pallor. Anisopoikilocytosis (variation in size and shape) is also present.",
                        imageHint: "iron deficiency anemia smear"
                    },
                    clinicalFeatures: "Presents with general symptoms of anemia: fatigue, weakness, shortness of breath on exertion, and pallor. Specific signs of iron deficiency include pica (craving for non-food items like ice), koilonychia (spoon-shaped nails), and glossitis.",
                    investigations: "CBC shows low hemoglobin and low MCV. Iron studies are key: low serum ferritin (reflecting depleted iron stores), low serum iron, high total iron-binding capacity (TIBC), and low transferrin saturation.",
                    management: "Treatment involves identifying and correcting the underlying cause of iron loss and repleting iron stores with oral iron supplementation (e.g., ferrous sulfate). Always check current local and international anemia guidelines.",
                    complications: "In severe cases, can lead to high-output heart failure.",
                    prognosis: "Excellent with correction of the underlying cause and iron replacement.",
                },
                 { 
                    title: "Sickle Cell Anemia",
                    overview: "Sickle cell anemia is an autosomal recessive genetic disorder caused by a point mutation in the beta-globin gene, leading to the production of an abnormal hemoglobin, HbS. Under deoxygenated conditions, HbS polymerizes, causing red blood cells to deform into a rigid, sickle shape.",
                    learningObjectives: [
                        "Understand the genetic basis of sickle cell anemia (autosomal recessive, point mutation).",
                        "Describe the process of HbS polymerization and red cell sickling.",
                        "Relate sickling to the two major pathological consequences: chronic hemolysis and vaso-occlusion.",
                        "Recognize the key clinical manifestations, such as painful vaso-occlusive crises."
                    ],
                    tags: {
                        organ: "Blood",
                        system: "Hematopoietic & Lymphoid Systems",
                        category: "Genetic",
                        level: "Intermediate"
                    },
                    etiology: [
                        "Homozygous inheritance of the sickle cell mutation in the beta-globin gene (glutamic acid is replaced by valine at the 6th position)."
                    ],
                    pathogenesis: "Deoxygenation causes HbS molecules to aggregate into long, rigid polymers that distort the RBC into a sickle shape. These sickled cells are less deformable, leading to obstruction of small blood vessels (vaso-occlusion) and ischemic tissue damage. They are also fragile and are rapidly destroyed in the spleen, leading to a chronic hemolytic anemia.",
                    morphology: {
                        gross: "Patients may show signs of chronic hemolysis (jaundice, gallstones) and vaso-occlusion (splenic atrophy, bone infarcts).",
                        microscopic: "Peripheral blood smear shows characteristic sickle-shaped red blood cells and target cells. Howell-Jolly bodies (nuclear remnants in RBCs) are seen due to functional asplenia.",
                        imageHint: "sickle cell anemia smear"
                    },
                    clinicalFeatures: "Presents with chronic hemolytic anemia and recurrent, painful vaso-occlusive crises, often affecting the bones, chest, and abdomen. Other manifestations include acute chest syndrome, stroke, and an increased susceptibility to infections with encapsulated organisms (due to splenic dysfunction).",
                    investigations: "Diagnosis is made by hemoglobin electrophoresis, which shows a predominance of HbS. A sickling test can demonstrate the phenomenon in vitro.",
                    management: "Management is supportive and focuses on preventing crises. This includes hydration, pain management, and hydroxyurea (which increases levels of fetal hemoglobin, HbF, an inhibitor of sickling). Blood transfusions are used for severe anemia or complications. Always check current local and international guidelines.",
                    complications: "Acute chest syndrome, stroke, aplastic crisis (with parvovirus B19 infection), renal failure.",
                    prognosis: "A chronic, lifelong illness, but advances in care have significantly improved life expectancy.",
                },
                 {
                    title: "Autoimmune Hemolytic Anemia (AIHA)",
                    overview: "Autoimmune hemolytic anemia is a group of disorders caused by autoantibodies that target red blood cells (RBCs), leading to their premature destruction (hemolysis). It is classified based on the thermal properties of the autoantibody (warm vs. cold).",
                    learningObjectives: [
                        "Define AIHA as antibody-mediated RBC destruction.",
                        "Differentiate between warm and cold AIHA based on the antibody type and clinical presentation.",
                        "Understand the diagnostic role of the direct antiglobulin test (DAT or Coombs test).",
                        "Recognize spherocytes on a peripheral blood smear."
                    ],
                    tags: {
                        organ: "Blood",
                        system: "Hematopoietic & Lymphoid Systems",
                        category: "Autoimmune",
                        level: "Advanced"
                    },
                    etiology: [
                        "Primary (idiopathic) in about half of cases.",
                        "Secondary to other conditions, such as autoimmune diseases (e.g., SLE), lymphoid neoplasms (e.g., CLL), or drugs (e.g., penicillin, methyldopa)."
                    ],
                    pathogenesis: "Warm AIHA (most common): Caused by IgG antibodies that bind to RBCs optimally at body temperature (37°C). These IgG-coated RBCs are then cleared from circulation by macrophages in the spleen (extravascular hemolysis). Cold AIHA: Caused by IgM antibodies that bind to RBCs only at cold temperatures (typically <30°C). The IgM antibody fixes complement, and hemolysis can occur either extravascularly in the liver or intravascularly.",
                    morphology: {
                        gross: "Patients may have splenomegaly (in warm AIHA) and jaundice.",
                        microscopic: "The key finding on the peripheral blood smear in warm AIHA is the presence of spherocytes, which are small, dark, spherical RBCs that lack central pallor. They are formed when macrophages in the spleen remove portions of the IgG-coated RBC membrane.",
                        imageHint: "spherocytes blood smear"
                    },
                    clinicalFeatures: "Presents with a variable degree of anemia, from mild to life-threatening. Jaundice and splenomegaly are common. In cold AIHA, patients may experience acrocyanosis (bluish discoloration of fingertips and toes) on exposure to cold.",
                    investigations: "The direct antiglobulin test (DAT or Coombs test) is the cornerstone of diagnosis; it detects antibodies directly on the surface of the patient's RBCs. Other findings include signs of hemolysis: elevated LDH, elevated indirect bilirubin, and low haptoglobin.",
                    management: "Corticosteroids are the first-line treatment for warm AIHA. For refractory cases, splenectomy or other immunosuppressants (e.g., rituximab) may be used. For cold AIHA, the mainstay is avoiding cold exposure. Always check current local and international guidelines.",
                    complications: "Severe anemia, thromboembolism.",
                    prognosis: "Variable, depending on the underlying cause and response to treatment.",
                },
            ]
        },
        {
            name: "Neoplasms of White Cells",
            diseases: [
                { 
                    title: "Acute Lymphoblastic Leukemia (ALL)",
                    overview: "Acute lymphoblastic leukemia is a malignant neoplasm of immature lymphoid cells (lymphoblasts). It is the most common cancer of childhood, with a peak incidence between 2 and 5 years of age.",
                    learningObjectives: [
                        "Define ALL as a malignancy of lymphoblasts.",
                        "Recognize its bimodal age distribution (childhood peak and smaller adult peak).",
                        "Describe the typical clinical presentation related to bone marrow failure.",
                        "Understand the importance of immunophenotyping to distinguish B-cell ALL from T-cell ALL."
                    ],
                    tags: {
                        organ: "Bone Marrow",
                        system: "Hematopoietic & Lymphoid Systems",
                        category: "Neoplastic",
                        level: "Advanced"
                    },
                    etiology: [
                        "Most cases are idiopathic.",
                        "Associated with certain genetic syndromes like Down syndrome."
                    ],
                    pathogenesis: "Caused by the clonal proliferation of a transformed hematopoietic stem cell that is committed to the lymphoid lineage. The accumulation of these non-functional blasts in the bone marrow suppresses normal hematopoiesis, leading to anemia, thrombocytopenia, and neutropenia.",
                    morphology: {
                        gross: "Patients may have hepatosplenomegaly and lymphadenopathy.",
                        microscopic: "The bone marrow is hypercellular and packed with lymphoblasts. These are typically small cells with scant cytoplasm, fine chromatin, and inconspicuous nucleoli. The peripheral blood smear also shows circulating blasts.",
                        imageHint: "acute lymphoblastic leukemia smear"
                    },
                    clinicalFeatures: "Presents with an abrupt onset of symptoms related to bone marrow failure: fatigue (anemia), bleeding/bruising (thrombocytopenia), and fever/infections (neutropenia). Bone pain is also common. T-cell ALL can present with a large mediastinal mass.",
                    investigations: "CBC shows anemia, thrombocytopenia, and a variable white cell count with circulating blasts. Bone marrow biopsy is required for diagnosis. Immunophenotyping by flow cytometry is crucial to confirm the lymphoid lineage (e.g., TdT positivity) and determine if it is B-cell or T-cell ALL.",
                    management: "Treatment involves intensive multi-agent chemotherapy with different phases (induction, consolidation, maintenance). Prophylactic treatment to the CNS is also given. Always check current local and international ALL treatment protocols.",
                    complications: "Infection, bleeding, tumor lysis syndrome during chemotherapy.",
                    prognosis: "Prognosis is excellent in children, with cure rates over 90%. It is less favorable in adults.",
                },
                { 
                    title: "Chronic Lymphocytic Leukemia (CLL)",
                    overview: "Chronic lymphocytic leukemia is a low-grade B-cell neoplasm characterized by the progressive accumulation of mature-appearing but functionally incompetent lymphocytes. It is the most common leukemia of adults in the Western world.",
                    learningObjectives: [
                        "Recognize CLL as a common, indolent leukemia of the elderly.",
                        "Describe the characteristic immunophenotype of the malignant B-cells.",
                        "Identify 'smudge cells' on a peripheral blood smear.",
                        "Understand the clinical course, from asymptomatic lymphocytosis to complications like immunosuppression."
                    ],
                    tags: {
                        organ: "Bone Marrow",
                        system: "Hematopoietic & Lymphoid Systems",
                        category: "Neoplastic",
                        level: "Intermediate"
                    },
                    etiology: [
                        "Unknown."
                    ],
                    pathogenesis: "The disease results from the clonal proliferation of mature B-cells that are resistant to apoptosis, leading to their gradual accumulation in the blood, bone marrow, and lymph nodes.",
                    morphology: {
                        gross: "Patients often have generalized lymphadenopathy and hepatosplenomegaly.",
                        microscopic: "Peripheral blood smear shows a marked lymphocytosis with small, mature-looking lymphocytes with scant cytoplasm and clumped 'soccer ball' chromatin. 'Smudge cells' (fragile lymphocytes that are disrupted during slide preparation) are characteristic. Bone marrow is infiltrated by these lymphocytes.",
                        imageHint: "cll smudge cell smear"
                    },
                    clinicalFeatures: "Often discovered incidentally on a routine CBC showing lymphocytosis. Many patients are asymptomatic for years. When symptoms occur, they include fatigue, weight loss, and enlarged lymph nodes. Patients are immunosuppressed and are at increased risk for infections.",
                    investigations: "Diagnosis is made by flow cytometry of the peripheral blood, which shows a clonal population of B-cells co-expressing CD5 and CD23, in addition to other B-cell markers like CD19 and CD20.",
                    management: "Asymptomatic, early-stage disease is often managed with a 'watch and wait' approach. Treatment is initiated for symptomatic or advanced disease and may include chemotherapy, monoclonal antibodies (e.g., rituximab), or targeted therapies (e.g., BTK inhibitors like ibrutinib). Always check current local and international CLL guidelines.",
                    complications: "Transformation to a more aggressive lymphoma (Richter's transformation), autoimmune hemolytic anemia, and infections.",
                    prognosis: "Highly variable. Some patients have a very indolent course and may never require treatment, while others have more aggressive disease. Prognostic markers like IgHV mutation status and cytogenetic abnormalities (e.g., del17p) are important.",
                },
                 {
                    title: "Hodgkin Lymphoma",
                    overview: "Hodgkin lymphoma is a lymphoid neoplasm characterized by the presence of a unique tumor cell, the Reed-Sternberg (RS) cell, within a mixed inflammatory background. It typically arises in a single lymph node or chain of nodes and spreads in a contiguous, predictable fashion.",
                    learningObjectives: [
                        "Identify the Reed-Sternberg cell as the diagnostic hallmark of Hodgkin lymphoma.",
                        "Differentiate Hodgkin lymphoma from non-Hodgkin lymphomas based on clinical and pathological features.",
                        "Recognize the different classical subtypes (e.g., Nodular Sclerosis).",
                        "Understand the excellent prognosis with modern therapy."
                    ],
                    tags: {
                        organ: "Lymph Node",
                        system: "Hematopoietic & Lymphoid Systems",
                        category: "Neoplastic",
                        level: "Classic"
                    },
                    etiology: [
                        "Largely unknown, but linked to Epstein-Barr virus (EBV) infection in a subset of cases."
                    ],
                    pathogenesis: "The Reed-Sternberg cell is a large, malignant B-lymphocyte that has lost its normal B-cell gene expression program. These rare tumor cells secrete cytokines that attract a large number of non-neoplastic inflammatory cells, which make up the bulk of the tumor mass.",
                    morphology: {
                        gross: "Painless enlargement of lymph nodes, most commonly in the cervical or mediastinal regions.",
                        microscopic: "The diagnostic cell is the Reed-Sternberg cell: a very large cell with multiple nuclei or a single bilobed nucleus, each containing a large, eosinophilic, inclusion-like nucleolus ('owl eyes'). These cells are scattered within a background of reactive lymphocytes, eosinophils, and plasma cells. In the Nodular Sclerosis subtype (the most common), the lymph node is divided into nodules by bands of collagen.",
                        imageHint: "hodgkin lymphoma reed sternberg"
                    },
                    clinicalFeatures: "Presents with painless lymphadenopathy. 'B symptoms' (fever, night sweats, weight loss) can be present and have prognostic significance. Pruritus (itching) is also common.",
                    investigations: "Diagnosis requires an excisional lymph node biopsy. Immunohistochemistry is key: classic RS cells are positive for CD30 and CD15, and are usually negative for B-cell and T-cell markers like CD20 and CD3.",
                    management: "Treatment involves chemotherapy and/or radiation therapy, with excellent cure rates, even in advanced stages. Always check current local and international Hodgkin lymphoma guidelines.",
                    complications: "Secondary malignancies and cardiovascular disease are long-term complications of treatment.",
                    prognosis: "One of the most curable cancers, with a 5-year survival rate of over 85%.",
                },
            ]
        }
    ]
  },
]
