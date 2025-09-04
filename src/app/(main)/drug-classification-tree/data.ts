
export interface Drug {
  name: string;
  classification: string;
  moa: string;
  therapeuticUses: string;
  adrs: string;
  contraindications: string;
  pharmaApplications: {
    dosageForms: string;
    formulations: string;
    storage: string;
  };
  analyticalMethods: {
    qualitative: string;
    quantitative: string;
    pharmacopoeial: string;
  };
  specialNotes: string;
}

export interface DrugClass {
  name: string;
  pharmaFocus?: string;
  drugs?: Drug[];
  subclasses?: DrugClass[];
}

export const drugTreeData: DrugClass[] = [
  {
    name: "Central Nervous System (CNS) Drugs",
    subclasses: [
      {
        name: "Sedatives & Hypnotics",
        pharmaFocus: "Dosage forms (injection, tablets), stability testing, dissolution profiles.",
        subclasses: [
          {
            name: "Benzodiazepines",
            drugs: [
              {
                name: "Diazepam",
                classification: "Benzodiazepine",
                moa: "Enhances the effect of the neurotransmitter GABA at the GABAA receptor, resulting in sedative, hypnotic, anxiolytic, anticonvulsant, and muscle relaxant properties.",
                therapeuticUses: "Anxiety, seizures, muscle spasms, alcohol withdrawal.",
                adrs: "Drowsiness, confusion, ataxia, dependence.",
                contraindications: "Severe respiratory insufficiency, myasthenia gravis, sleep apnea.",
                pharmaApplications: {
                  dosageForms: "Tablets, oral solution, rectal gel, injection (IV/IM).",
                  formulations: "Valium (Brand), Diazepam Intensol.",
                  storage: "Store at room temperature, protected from light.",
                },
                analyticalMethods: {
                  qualitative: "TLC, colorimetric tests.",
                  quantitative: "HPLC, UV-Vis Spectrophotometry.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "High potential for dependence and abuse. Avoid abrupt withdrawal. Potentiated by alcohol and other CNS depressants.",
              },
            ],
          },
          {
            name: "Barbiturates",
            drugs: [
                {
                    name: "Phenobarbital",
                    classification: "Barbiturate",
                    moa: "Acts on GABAA receptors, increasing the duration of chloride ion channel opening. This depresses the CNS.",
                    therapeuticUses: "Seizures (all types except absence), status epilepticus, sedation.",
                    adrs: "Sedation, respiratory depression, cognitive impairment, dependence.",
                    contraindications: "Severe liver disease, porphyria, known hypersensitivity.",
                    pharmaApplications: {
                        dosageForms: "Tablets, elixir, injection.",
                        formulations: "Luminal (Brand).",
                        storage: "Store at controlled room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "FTIR, GC-MS for identification.",
                        quantitative: "HPLC, GC.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Induces hepatic enzymes (CYP450), leading to many drug interactions. Narrow therapeutic index.",
                }
            ]
          },
           {
            name: "Z-drugs",
            drugs: [
              {
                name: "Zolpidem",
                classification: "Non-benzodiazepine hypnotic (Z-drug)",
                moa: "Acts as a sedative and hypnotic by selectively binding to the omega-1 subtype of the GABAA receptor, enhancing GABA-mediated neuronal inhibition.",
                therapeuticUses: "Short-term treatment of insomnia.",
                adrs: "Drowsiness, dizziness, headache, complex sleep-related behaviors (e.g., sleep-driving).",
                contraindications: "Known hypersensitivity, severe hepatic impairment.",
                pharmaApplications: {
                  dosageForms: "Tablets (immediate-release, extended-release), sublingual tablets, oral spray.",
                  formulations: "Ambien (Brand), Edluar, Zolpimist.",
                  storage: "Store at controlled room temperature, protected from light.",
                },
                analyticalMethods: {
                  qualitative: "LC-MS/MS for identification in biological samples.",
                  quantitative: "HPLC, LC-MS/MS.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "Should be taken immediately before bedtime. Can cause amnesia for events that occur after taking the drug.",
              }
            ]
          },
          {
            name: "Melatonin receptor agonists",
            drugs: []
          }
        ],
      },
      {
        name: "Anxiolytics, Antidepressants, and Antimanic Drugs",
        pharmaFocus: "plasma protein binding, drug assays, titrimetric methods (e.g., lithium estimation).",
        subclasses: [
          {
            name: "SSRIs",
            drugs: [],
          },
          {
            name: "SNRIs",
            drugs: [],
          },
          {
            name: "TCAs",
            drugs: [],
          },
          {
            name: "MAOIs",
            drugs: [],
          },
          {
            name: "Mood stabilizers",
            drugs: [],
          },
        ]
      },
      {
        name: "Antiepileptics",
        pharmaFocus: "bioavailability testing, therapeutic drug monitoring (TDM).",
        subclasses: [
            {
                name: "Sodium channel blockers",
                drugs: [],
            },
            {
                name: "GABA enhancers",
                drugs: [],
            },
            {
                name: "Newer agents",
                drugs: [],
            },
        ],
      },
      {
        name: "Antipsychotics",
        pharmaFocus: "receptor selectivity, metabolic pathways, monitoring ADRs.",
        subclasses: [
            {
                name: "Typical Antipsychotics",
                drugs: [
                    {
                        name: "Haloperidol",
                        classification: "First-generation (typical) antipsychotic, Butyrophenone.",
                        moa: "Strong central antidopaminergic (D2 receptor antagonist) action.",
                        therapeuticUses: "Schizophrenia, acute psychosis, Tourette's syndrome.",
                        adrs: "Extrapyramidal symptoms (EPS), tardive dyskinesia, QT prolongation.",
                        contraindications: "Parkinson's disease, severe CNS depression, coma.",
                        pharmaApplications: {
                            dosageForms: "Tablets, oral concentrate, injection (IM).",
                            formulations: "Haldol (Brand).",
                            storage: "Protect from light. Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "TLC, IR spectroscopy.",
                            quantitative: "HPLC.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "High risk of EPS. Monitor for neuroleptic malignant syndrome (NMS).",
                    }
                ]
            },
            {
                name: "Atypical Antipsychotics",
                drugs: [
                    {
                        name: "Olanzapine",
                        classification: "Second-generation (atypical) antipsychotic.",
                        moa: "Antagonist at dopamine D2 and serotonin 5-HT2A receptors.",
                        therapeuticUses: "Schizophrenia, bipolar disorder.",
                        adrs: "Significant weight gain, metabolic syndrome (hyperglycemia, dyslipidemia).",
                        contraindications: "Known hypersensitivity.",
                        pharmaApplications: {
                            dosageForms: "Tablets, orally disintegrating tablets (ODT), injection (IM).",
                            formulations: "Zyprexa (Brand).",
                            storage: "Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "HPLC with UV detection, FTIR.",
                            quantitative: "HPLC, LC-MS/MS for bioanalysis.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Monitor weight, glucose, and lipids regularly.",
                    }
                ]
            }
        ]
      },
      {
        name: "Opioid Analgesics",
        pharmaFocus: "dissolution testing of tablets, abuse-deterrent formulations, chromatography analysis.",
        subclasses: [
          {
            name: "Natural (Morphine, Codeine)",
            drugs: [],
          },
          {
            name: "Semi-synthetic (Oxycodone, Hydromorphone)",
            drugs: [],
          },
          {
            name: "Synthetic (Fentanyl, Tramadol)",
            drugs: [],
          },
        ]
      },
      {
        name: "Therapeutic Gases",
        pharmaFocus: "storage (cylinders, pressure control), pharmaceutical grade purity, applications in ICU.",
        drugs: [],
      },
       {
        name: "CNS Stimulants",
        pharmaFocus: "assay techniques, OTC vs controlled formulations.",
        subclasses: [
          {
            name: "Cerebral stimulants (Caffeine, Theophylline)",
            drugs: [],
          },
          {
            name: "Medullary stimulants (Nikethamide)",
            drugs: [],
          },
           {
            name: "Spinal stimulants (Strychnine – historical, not clinical now)",
            drugs: [],
          },
        ]
      },
      {
        name: "Anesthetics",
        pharmaFocus: "lipid solubility studies, partition coefficient analysis, quality control.",
        subclasses: [
            {
                name: "General anesthetics",
                subclasses: [
                    { name: "IV (Propofol, Thiopental)", drugs: [] },
                    { name: "Inhalational (Isoflurane, Sevoflurane)", drugs: [] },
                ]
            },
            {
                name: "Local anesthetics",
                subclasses: [
                    { name: "Ester type (Procaine)", drugs: [] },
                    { name: "Amide type (Lidocaine, Bupivacaine)", drugs: [] },
                ]
            }
        ]
      },
    ],
  },
  {
    name: "Non-Steroidal Anti-Inflammatory Drugs (NSAIDs)",
    pharmaFocus: "titrimetric assay (Aspirin), impurity profile, HPLC methods.",
    subclasses: [
        {
            name: "Non-opioid analgesics (Paracetamol, Aspirin)",
            drugs: [],
        },
        {
            name: "Traditional NSAIDs (Ibuprofen, Diclofenac)",
            drugs: [],
        },
        {
            name: "COX-2 inhibitors (Celecoxib)",
            drugs: [],
        },
        {
            name: "Disease-modifying antirheumatic drugs (DMARDs)",
            drugs: [],
        },
        {
            name: "Anti-gout drugs (Allopurinol, Febuxostat, Colchicine)",
            drugs: [],
        },
    ],
  },
];
