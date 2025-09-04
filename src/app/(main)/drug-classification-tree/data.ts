
export interface Drug {
  name: string;
}

export interface DrugClass {
  name: string;
  drugs?: Drug[];
  subclasses?: DrugClass[];
}

export const drugTreeData: DrugClass[] = [
  {
    name: "Cardiovascular System Drugs",
    subclasses: [
      {
        name: "Antihypertensives",
        subclasses: [
          {
            name: "ACE Inhibitors",
            drugs: [{ name: "Lisinopril" }, { name: "Captopril" }, { name: "Enalapril" }],
          },
          {
            name: "Angiotensin II Receptor Blockers (ARBs)",
            drugs: [{ name: "Losartan" }, { name: "Valsartan" }],
          },
          {
            name: "Beta-Blockers",
            subclasses: [
                { name: "Cardioselective (Beta-1)", drugs: [{ name: "Metoprolol" }, { name: "Atenolol" }] },
                { name: "Non-cardioselective (Beta-1 & Beta-2)", drugs: [{ name: "Propranolol" }] },
            ]
          },
          {
            name: "Calcium Channel Blockers",
            drugs: [{ name: "Amlodipine" }, { name: "Verapamil" }],
          },
          {
            name: "Diuretics",
            drugs: [{ name: "Hydrochlorothiazide" }, { name: "Furosemide" }],
          },
        ],
      },
      {
        name: "Antianginal Drugs",
        drugs: [{ name: "Nitroglycerin" }, { name: "Isosorbide Mononitrate" }]
      },
      {
        name: "Antiarrhythmic Drugs",
        drugs: [{ name: "Amiodarone" }, { name: "Lidocaine" }]
      },
      {
        name: "Lipid-Lowering Agents",
        subclasses: [
            { name: "Statins (HMG-CoA Reductase Inhibitors)", drugs: [{ name: "Atorvastatin" }, { name: "Simvastatin" }]}
        ]
      }
    ],
  },
  {
    name: "Central Nervous System (CNS) Drugs",
    subclasses: [
      {
        name: "Analgesics",
        subclasses: [
          { name: "Opioids", drugs: [{ name: "Morphine" }, { name: "Codeine" }, { name: "Tramadol" }] },
          { name: "Non-Opioids", drugs: [{ name: "Paracetamol (Acetaminophen)" }] },
          {
            name: "NSAIDs",
            drugs: [{ name: "Ibuprofen" }, { name: "Diclofenac" }, { name: "Aspirin" }],
          },
        ],
      },
      {
        name: "Antidepressants",
        subclasses: [
            { name: "SSRIs", drugs: [{ name: "Sertraline" }, { name: "Fluoxetine" }] },
            { name: "TCAs", drugs: [{ name: "Amitriptyline" }] },
        ]
      },
      {
        name: "Antipsychotics",
        drugs: [{ name: "Haloperidol" }, { name: "Olanzapine" }]
      },
      {
        name: "Anxiolytics & Hypnotics",
        subclasses: [
            { name: "Benzodiazepines", drugs: [{ name: "Diazepam" }, { name: "Alprazolam" }] }
        ]
      }
    ],
  },
  {
    name: "Anti-infective Agents",
    subclasses: [
      {
        name: "Antibiotics",
        subclasses: [
          { name: "Penicillins", drugs: [{ name: "Amoxicillin" }, { name: "Ampicillin" }] },
          { name: "Cephalosporins", drugs: [{ name: "Cefixime" }, { name: "Ceftriaxone" }] },
          { name: "Macrolides", drugs: [{ name: "Azithromycin" }, { name: "Erythromycin" }] },
          { name: "Quinolones", drugs: [{ name: "Ciprofloxacin" }, { name: "Levofloxacin" }] },
        ],
      },
      {
        name: "Antifungals",
        drugs: [{ name: "Fluconazole" }, { name: "Miconazole" }],
      },
      {
        name: "Antivirals",
        drugs: [{ name: "Acyclovir" }],
      },
    ],
  },
  {
    name: "Endocrine System Drugs",
    subclasses: [
        {
            name: "Antidiabetic Drugs",
            subclasses: [
                { name: "Biguanides", drugs: [{ name: "Metformin" }] },
                { name: "Sulfonylureas", drugs: [{ name: "Glibenclamide" }] },
                { name: "Insulins", drugs: [{ name: "Insulin Regular" }, { name: "Insulin Glargine" }] },
            ]
        },
        {
            name: "Thyroid Hormones",
            drugs: [{ name: "Levothyroxine" }]
        }
    ]
  }
];
