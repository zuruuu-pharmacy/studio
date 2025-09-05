
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
               {
                name: "Alprazolam",
                classification: "Benzodiazepine",
                moa: "Enhances the effect of GABA at the GABAA receptor, leading to anxiolytic, sedative, and hypnotic effects.",
                therapeuticUses: "Anxiety disorders, panic disorder.",
                adrs: "Drowsiness, dizziness, memory impairment, dependence.",
                contraindications: "Known hypersensitivity, narrow-angle glaucoma, concomitant use with potent CYP3A4 inhibitors like ketoconazole.",
                pharmaApplications: {
                  dosageForms: "Tablets (immediate-release, extended-release), orally disintegrating tablets.",
                  formulations: "Xanax (Brand), Niravam.",
                  storage: "Store at controlled room temperature.",
                },
                analyticalMethods: {
                  qualitative: "LC-MS/MS for identification.",
                  quantitative: "HPLC, LC-MS.",
                  pharmacopoeial: "USP.",
                },
                specialNotes: "Short-acting, which may lead to a higher potential for dependence. Use with caution in elderly patients.",
              },
              {
                name: "Lorazepam",
                classification: "Benzodiazepine",
                moa: "Potentiates the effects of GABA by binding to the GABAA receptor, causing sedation, anxiolysis, and anticonvulsant activity.",
                therapeuticUses: "Anxiety, status epilepticus, preoperative sedation.",
                adrs: "Sedation, weakness, unsteadiness, anterograde amnesia.",
                contraindications: "Hypersensitivity, acute narrow-angle glaucoma, severe respiratory failure.",
                pharmaApplications: {
                  dosageForms: "Tablets, injection (IV/IM), oral concentrate.",
                  formulations: "Ativan (Brand).",
                  storage: "Injection must be refrigerated. Tablets at room temperature.",
                },
                analyticalMethods: {
                  qualitative: "GC-MS, FTIR.",
                  quantitative: "HPLC.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "Metabolized via glucuronidation, so it has fewer interactions with drugs metabolized by CYP450 enzymes compared to other benzodiazepines.",
              },
              {
                name: "Clonazepam",
                classification: "Benzodiazepine",
                moa: "Enhances the postsynaptic effect of GABA, leading to suppression of seizure activity and anxiolytic effects.",
                therapeuticUses: "Seizure disorders (Lennox-Gastaut syndrome, akinetic, myoclonic seizures), panic disorder.",
                adrs: "Drowsiness, ataxia, behavioral changes, tolerance.",
                contraindications: "Significant liver disease, acute narrow-angle glaucoma.",
                pharmaApplications: {
                  dosageForms: "Tablets, orally disintegrating tablets.",
                  formulations: "Klonopin (Brand).",
                  storage: "Store at room temperature, away from moisture and light.",
                },
                analyticalMethods: {
                  qualitative: "TLC, IR spectroscopy.",
                  quantitative: "HPLC, GC-ECD.",
                  pharmacopoeial: "USP.",
                },
                specialNotes: "Long half-life makes it useful for chronic conditions but increases the risk of accumulation, especially in the elderly.",
              },
              {
                name: "Midazolam",
                classification: "Benzodiazepine",
                moa: "Acts on the GABAA receptor to produce very rapid and short-lasting sedation, anxiolysis, and amnesia.",
                therapeuticUses: "Procedural sedation, anesthesia induction, treatment of acute seizures.",
                adrs: "Respiratory depression, hypotension, paradoxical agitation.",
                contraindications: "Acute narrow-angle glaucoma, known hypersensitivity. Use with caution in patients with CHF or COPD.",
                pharmaApplications: {
                  dosageForms: "Injection (IV/IM), oral syrup, nasal spray.",
                  formulations: "Versed (Brand).",
                  storage: "Store at room temperature, protect from light.",
                },
                analyticalMethods: {
                  qualitative: "LC-MS for identification in biological fluids.",
                  quantitative: "HPLC, LC-MS/MS.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "High risk of respiratory depression, especially when co-administered with opioids. Requires careful monitoring of vital signs during use.",
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
            drugs: [
                {
                    name: "Sertraline",
                    classification: "Selective Serotonin Reuptake Inhibitor (SSRI)",
                    moa: "Selectively inhibits the reuptake of serotonin (5-HT) in the presynaptic neuron, increasing the level of serotonin in the synaptic cleft.",
                    therapeuticUses: "Major depressive disorder, obsessive-compulsive disorder (OCD), panic disorder, post-traumatic stress disorder (PTSD).",
                    adrs: "Nausea, diarrhea, insomnia, sexual dysfunction.",
                    contraindications: "Concomitant use with MAOIs or pimozide.",
                    pharmaApplications: {
                        dosageForms: "Tablets, oral concentrate.",
                        formulations: "Zoloft (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC with diode array detection.",
                        quantitative: "HPLC-UV, LC-MS/MS for bioanalysis.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "May take 4-6 weeks to see full therapeutic effect. Carries a black box warning for increased suicidal thinking in young adults.",
                },
            ],
          },
          {
            name: "SNRIs",
            drugs: [
                 {
                    name: "Venlafaxine",
                    classification: "Serotonin-Norepinephrine Reuptake Inhibitor (SNRI)",
                    moa: "Potent inhibitor of both serotonin and norepinephrine reuptake. Weakly inhibits dopamine reuptake.",
                    therapeuticUses: "Major depressive disorder, generalized anxiety disorder, social anxiety disorder, panic disorder.",
                    adrs: "Nausea, dizziness, sweating, hypertension (especially at higher doses).",
                    contraindications: "Concomitant use with MAOIs.",
                    pharmaApplications: {
                        dosageForms: "Tablets (immediate-release), capsules (extended-release).",
                        formulations: "Effexor XR (Brand).",
                        storage: "Store at room temperature, away from moisture.",
                    },
                    analyticalMethods: {
                        qualitative: "IR spectroscopy, HPLC.",
                        quantitative: "HPLC with UV or fluorescence detection.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "Can cause a significant discontinuation syndrome if stopped abruptly. Blood pressure should be monitored, especially with dose increases.",
                }
            ],
          },
          {
            name: "TCAs",
            drugs: [
                {
                    name: "Amitriptyline",
                    classification: "Tricyclic Antidepressant (TCA)",
                    moa: "Inhibits the reuptake of serotonin and norepinephrine. Also has significant anticholinergic and antihistaminic activity.",
                    therapeuticUses: "Depression, neuropathic pain, migraine prophylaxis.",
                    adrs: "Sedation, dry mouth, constipation, blurred vision, weight gain, cardiotoxicity in overdose.",
                    contraindications: "Recent myocardial infarction, co-administration with MAOIs.",
                    pharmaApplications: {
                        dosageForms: "Tablets.",
                        formulations: "Elavil (Brand).",
                        storage: "Store at room temperature, protect from light.",
                    },
                    analyticalMethods: {
                        qualitative: "TLC.",
                        quantitative: "HPLC, GC-MS.",
                        pharmacopoeial: "BP, USP.",
                    },
                    specialNotes: "High risk of toxicity in overdose due to cardiac effects. Use is limited by its side effect profile compared to newer agents.",
                }
            ],
          },
          {
            name: "MAOIs",
            drugs: [
                {
                    name: "Phenelzine",
                    classification: "Monoamine Oxidase Inhibitor (MAOI)",
                    moa: "Irreversibly inhibits both MAO-A and MAO-B, leading to increased levels of norepinephrine, serotonin, and dopamine in the brain.",
                    therapeuticUses: "Atypical depression, treatment-resistant depression.",
                    adrs: "Orthostatic hypotension, dizziness, insomnia, weight gain, sexual dysfunction.",
                    contraindications: "Pheochromocytoma, severe renal or hepatic disease, concomitant use with sympathomimetics or other antidepressants.",
                    pharmaApplications: {
                        dosageForms: "Tablets.",
                        formulations: "Nardil (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "Spectrophotometric methods.",
                        quantitative: "HPLC.",
                        pharmacopoeial: "BP.",
                    },
                    specialNotes: "Requires strict dietary restrictions (tyramine-free diet) to avoid hypertensive crisis. Numerous and potentially fatal drug interactions.",
                }
            ],
          },
          {
            name: "Mood stabilizers",
            drugs: [
                {
                    name: "Lithium",
                    classification: "Mood stabilizer",
                    moa: "Not fully understood, but thought to modulate second messenger systems (e.g., inositol phosphate pathway) and inhibit glycogen synthase kinase-3 (GSK-3).",
                    therapeuticUses: "Bipolar disorder (acute mania and maintenance).",
                    adrs: "Tremor, polyuria, polydipsia, hypothyroidism, renal dysfunction.",
                    contraindications: "Severe renal or cardiovascular disease, severe dehydration, sodium depletion.",
                    pharmaApplications: {
                        dosageForms: "Capsules, tablets (immediate-release, extended-release), oral solution.",
                        formulations: "Lithobid (Brand), Eskalith.",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "Flame photometry, Atomic Absorption Spectroscopy.",
                        quantitative: "Ion-selective electrodes, Flame photometry.",
                        pharmacopoeial: "USP, BP (assay is often a simple acid-base titration).",
                    },
                    specialNotes: "Very narrow therapeutic index, requiring regular blood monitoring. Dehydration and NSAID use can increase lithium levels to toxic concentrations.",
                },
                 {
                    name: "Valproate",
                    classification: "Anticonvulsant, Mood stabilizer",
                    moa: "Increases GABA levels in the brain, blocks voltage-gated sodium channels, and inhibits T-type calcium channels.",
                    therapeuticUses: "Bipolar disorder (mania), epilepsy (various seizure types), migraine prophylaxis.",
                    adrs: "Nausea, weight gain, tremor, hair loss, hepatotoxicity (rare but severe).",
                    contraindications: "Significant hepatic dysfunction, urea cycle disorders, known hypersensitivity. Highly teratogenic.",
                    pharmaApplications: {
                        dosageForms: "Capsules, tablets (delayed-release, extended-release), oral solution, injection.",
                        formulations: "Depakote (Brand), Depakene.",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "GC-MS, LC-MS.",
                        quantitative: "Immunoassay, HPLC, GC.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Black box warning for hepatotoxicity, pancreatitis, and teratogenicity. Requires monitoring of liver function tests and platelet counts.",
                }
            ],
          },
        ]
      },
      {
        name: "Antiepileptics",
        pharmaFocus: "bioavailability testing, therapeutic drug monitoring (TDM).",
        subclasses: [
            {
                name: "Sodium channel blockers",
                drugs: [
                    {
                        name: "Phenytoin",
                        classification: "Anticonvulsant, Hydantoin derivative",
                        moa: "Blocks voltage-gated sodium channels, stabilizing neuronal membranes and preventing seizure propagation.",
                        therapeuticUses: "Focal seizures, generalized tonic-clonic seizures, status epilepticus.",
                        adrs: "Gingival hyperplasia, hirsutism, nystagmus, ataxia, rash (SJS).",
                        contraindications: "Sinus bradycardia, Adams-Stokes syndrome, known hypersensitivity.",
                        pharmaApplications: {
                            dosageForms: "Capsules (extended-release), chewable tablets, oral suspension, injection.",
                            formulations: "Dilantin (Brand).",
                            storage: "Store at room temperature, protect from light and moisture.",
                        },
                        analyticalMethods: {
                            qualitative: "IR spectroscopy, TLC.",
                            quantitative: "HPLC, immunoassay for TDM.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Exhibits zero-order (saturable) kinetics at therapeutic doses, leading to non-linear dose-concentration relationship. Requires TDM.",
                    },
                    {
                        name: "Carbamazepine",
                        classification: "Anticonvulsant, Iminostilbene derivative",
                        moa: "Blocks voltage-gated sodium channels, which inhibits high-frequency repetitive firing in neurons.",
                        therapeuticUses: "Focal seizures, generalized tonic-clonic seizures, trigeminal neuralgia, bipolar disorder.",
                        adrs: "Drowsiness, dizziness, rash (SJS/TEN in HLA-B*1502 allele carriers), hyponatremia.",
                        contraindications: "Bone marrow depression, hypersensitivity to TCAs, use of MAOIs.",
                        pharmaApplications: {
                            dosageForms: "Tablets (immediate-release, chewable, extended-release), oral suspension.",
                            formulations: "Tegretol (Brand).",
                            storage: "Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "HPLC, IR spectroscopy.",
                            quantitative: "HPLC, immunoassay for TDM.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Auto-inducer of its own metabolism. Requires screening for HLA-B*1502 allele in patients of Asian descent before starting therapy.",
                    }
                ],
            },
            {
                name: "GABA enhancers",
                drugs: [
                    {
                        name: "Valproic Acid",
                        classification: "Anticonvulsant, Mood stabilizer",
                        moa: "Increases brain concentrations of GABA, blocks voltage-gated sodium channels, and inhibits T-type calcium channels.",
                        therapeuticUses: "Broad-spectrum antiepileptic (focal, generalized, absence seizures), bipolar disorder, migraine prophylaxis.",
                        adrs: "Nausea, vomiting, weight gain, hair loss, tremor, hepatotoxicity, pancreatitis. Highly teratogenic.",
                        contraindications: "Significant hepatic dysfunction, urea cycle disorders.",
                        pharmaApplications: {
                            dosageForms: "Capsules, tablets (delayed-release, extended-release), oral solution, injection.",
                            formulations: "Depakene (Valproic Acid), Depakote (Divalproex Sodium).",
                            storage: "Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "GC-MS.",
                            quantitative: "HPLC, GC, immunoassay for TDM.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Monitor LFTs, CBC, and amylase. Black box warnings for hepatotoxicity, pancreatitis, and fetal risk.",
                    },
                ],
            },
            {
                name: "Newer agents",
                drugs: [
                     {
                        name: "Levetiracetam",
                        classification: "Anticonvulsant, Pyrrolidine derivative",
                        moa: "Unique mechanism involving binding to synaptic vesicle protein 2A (SV2A), which is thought to modulate neurotransmitter release.",
                        therapeuticUses: "Focal seizures, generalized tonic-clonic seizures, myoclonic seizures.",
                        adrs: "Somnolence, asthenia, dizziness, behavioral effects (irritability, aggression).",
                        contraindications: "Known hypersensitivity.",
                        pharmaApplications: {
                            dosageForms: "Tablets (immediate-release, extended-release), oral solution, injection.",
                            formulations: "Keppra (Brand).",
                            storage: "Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "LC-MS/MS.",
                            quantitative: "HPLC-UV.",
                            pharmacopoeial: "USP.",
                        },
                        specialNotes: "Minimal drug interactions as it is not metabolized by CYP450 enzymes. Renally cleared, so dose adjustment is needed in renal impairment.",
                    },
                    {
                        name: "Lamotrigine",
                        classification: "Anticonvulsant, Phenyltriazine derivative",
                        moa: "Blocks voltage-gated sodium channels and may also inhibit release of glutamate.",
                        therapeuticUses: "Focal seizures, generalized tonic-clonic seizures, Lennox-Gastaut syndrome, maintenance treatment of bipolar I disorder.",
                        adrs: "Rash (can progress to life-threatening Stevens-Johnson Syndrome), dizziness, headache, diplopia.",
                        contraindications: "Known hypersensitivity.",
                        pharmaApplications: {
                            dosageForms: "Tablets (immediate-release, chewable, orally disintegrating, extended-release).",
                            formulations: "Lamictal (Brand).",
                            storage: "Store at room temperature, protect from light.",
                        },
                        analyticalMethods: {
                            qualitative: "HPLC.",
                            quantitative: "HPLC-UV.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Requires very slow dose titration to reduce the risk of serious rash. Valproate significantly inhibits its metabolism, requiring lower doses.",
                    }
                ],
            },
        ],
      },
      {
        name: "Antiparkinsonian & Other Neurodegenerative Drugs",
        pharmaFocus: "stability studies, impurity analysis, formulation challenges (oral vs transdermal).",
        subclasses: [
          {
            name: "Dopamine precursors (Levodopa + Carbidopa)",
            drugs: [],
          },
          {
            name: "MAO-B inhibitors (Selegiline)",
            drugs: [],
          },
          {
            name: "COMT inhibitors (Entacapone)",
            drugs: [],
          },
          {
            name: "Alzheimer’s drugs (Donepezil, Memantine)",
            drugs: [],
          },
        ]
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
