
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
        name: "Antipsychotics",
        pharmaFocus: "Receptor selectivity, metabolic pathways, monitoring ADRs.",
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
        name: "NSAIDs & Anti-gout drugs",
        pharmaFocus: "Titrimetric assay (Aspirin), impurity profile, HPLC methods.",
        subclasses: [
            {
                name: "Non-opioid analgesics",
                drugs: [
                    {
                        name: "Aspirin",
                        classification: "Salicylate, NSAID.",
                        moa: "Irreversibly inhibits COX-1 and COX-2 enzymes, preventing prostaglandin and thromboxane synthesis.",
                        therapeuticUses: "Analgesic, antipyretic, anti-inflammatory, antiplatelet agent.",
                        adrs: "GI irritation/bleeding, tinnitus, Reye's syndrome in children.",
                        contraindications: "Peptic ulcer, bleeding disorders, children with viral illness.",
                        pharmaApplications: {
                            dosageForms: "Tablets (plain, enteric-coated, buffered, chewable).",
                            formulations: "Disprin, Ascard (Brands).",
                            storage: "Store in a cool, dry place.",
                        },
                        analyticalMethods: {
                            qualitative: "Ferric chloride test for salicylates.",
                            quantitative: "Acid-base titration (back titration method). HPLC.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Low dose (75-81mg) is used for cardiovascular protection.",
                    }
                ]
            },
            {
                name: "Anti-gout drugs",
                drugs: [
                     {
                        name: "Allopurinol",
                        classification: "Xanthine oxidase inhibitor.",
                        moa: "Inhibits xanthine oxidase, the enzyme responsible for the conversion of hypoxanthine to xanthine and xanthine to uric acid. This reduces uric acid production.",
                        therapeuticUses: "Prophylaxis of gout, management of hyperuricemia.",
                        adrs: "Skin rash (can be severe, e.g., SJS/TEN), GI upset.",
                        contraindications: "Known hypersensitivity.",
                        pharmaApplications: {
                            dosageForms: "Tablets.",
                            formulations: "Zyloric (Brand).",
                            storage: "Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "TLC, IR spectroscopy.",
                            quantitative: "HPLC, UV spectrophotometry.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Start at a low dose to reduce risk of hypersensitivity reactions. Maintain adequate fluid intake.",
                    }
                ]
            }
        ]
      },
    ],
  },
];
