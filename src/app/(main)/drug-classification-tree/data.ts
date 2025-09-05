
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
                },
                 {
                    name: "Thiopental",
                    classification: "Barbiturate (ultra short-acting)",
                    moa: "Potentiates GABA-A receptor activity, causing profound but brief CNS depression.",
                    therapeuticUses: "Induction of anesthesia, management of refractory status epilepticus.",
                    adrs: "Respiratory depression, hypotension, laryngospasm, extravasation injury.",
                    contraindications: "Absence of suitable veins, status asthmaticus, porphyria.",
                    pharmaApplications: {
                        dosageForms: "Powder for injection (reconstituted).",
                        formulations: "Pentothal (Brand).",
                        storage: "Store powder at room temperature. Reconstituted solution is unstable.",
                    },
                    analyticalMethods: {
                        qualitative: "Colorimetric tests.",
                        quantitative: "HPLC, GC-MS.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Rapid onset and redistribution from brain to other tissues determines its short duration of action.",
                },
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
              },
               {
                name: "Zaleplon",
                classification: "Non-benzodiazepine hypnotic (Z-drug)",
                moa: "Interacts with the GABAA-benzodiazepine receptor complex, primarily at the omega-1 subtype.",
                therapeuticUses: "Short-term treatment of insomnia, particularly for difficulty falling asleep.",
                adrs: "Dizziness, headache, somnolence, rebound insomnia.",
                contraindications: "Known hypersensitivity, severe hepatic impairment.",
                pharmaApplications: {
                  dosageForms: "Capsules.",
                  formulations: "Sonata (Brand).",
                  storage: "Store at room temperature.",
                },
                analyticalMethods: {
                  qualitative: "HPLC.",
                  quantitative: "HPLC with UV detection.",
                  pharmacopoeial: "USP.",
                },
                specialNotes: "Very short half-life (~1 hour), making it useful for middle-of-the-night awakenings.",
              },
               {
                name: "Eszopiclone",
                classification: "Non-benzodiazepine hypnotic (Z-drug), Cyclopyrrolone derivative",
                moa: "Interacts with GABAA receptor complexes at binding domains located close to or allosterically coupled to benzodiazepine receptors.",
                therapeuticUses: "Treatment of insomnia (improves sleep onset and sleep maintenance).",
                adrs: "Unpleasant bitter/metallic taste, headache, dry mouth, somnolence.",
                contraindications: "Known hypersensitivity.",
                pharmaApplications: {
                  dosageForms: "Tablets.",
                  formulations: "Lunesta (Brand).",
                  storage: "Store at room temperature.",
                },
                analyticalMethods: {
                  qualitative: "LC-MS.",
                  quantitative: "HPLC, LC-MS/MS.",
                  pharmacopoeial: "USP.",
                },
                specialNotes: "Approved for longer-term use than some other hypnotics. Can impair next-day driving ability.",
              },
            ]
          },
          {
            name: "Melatonin receptor agonists",
            drugs: [
                 {
                    name: "Ramelteon",
                    classification: "Melatonin receptor agonist",
                    moa: "Selective agonist at the MT1 and MT2 melatonin receptors within the suprachiasmatic nucleus (SCN) of the brain.",
                    therapeuticUses: "Treatment of insomnia characterized by difficulty with sleep onset.",
                    adrs: "Dizziness, somnolence, fatigue, nausea.",
                    contraindications: "Fluvoxamine co-administration, known hypersensitivity.",
                    pharmaApplications: {
                        dosageForms: "Tablets.",
                        formulations: "Rozerem (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "LC-MS/MS.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "Not a controlled substance, as it has no potential for abuse or dependence.",
                },
            ],
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
                 {
                    name: "Fluoxetine",
                    classification: "Selective Serotonin Reuptake Inhibitor (SSRI)",
                    moa: "Inhibits CNS neuronal reuptake of serotonin (5-HT).",
                    therapeuticUses: "Major depressive disorder, OCD, panic disorder, bulimia nervosa.",
                    adrs: "Insomnia, nausea, headache, anxiety.",
                    contraindications: "Concomitant use with MAOIs, pimozide, or thioridazine.",
                    pharmaApplications: {
                        dosageForms: "Capsules (including delayed-release), tablets, oral solution.",
                        formulations: "Prozac (Brand), Sarafem.",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "IR spectroscopy, TLC.",
                        quantitative: "HPLC.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Very long half-life of its active metabolite (norfluoxetine), which can lead to prolonged drug interactions.",
                },
                 {
                    name: "Citalopram",
                    classification: "Selective Serotonin Reuptake Inhibitor (SSRI)",
                    moa: "Selectively inhibits the reuptake of serotonin from the synaptic cleft.",
                    therapeuticUses: "Major depressive disorder.",
                    adrs: "Nausea, dry mouth, somnolence, QT prolongation at higher doses.",
                    contraindications: "Concomitant use with MAOIs, congenital long QT syndrome.",
                    pharmaApplications: {
                        dosageForms: "Tablelets, oral solution.",
                        formulations: "Celexa (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "HPLC with UV or fluorescence detection.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Dose-dependent risk of QT prolongation. Maximum recommended dose is 40 mg/day (20 mg/day in elderly or poor CYP2C19 metabolizers).",
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
                },
                 {
                    name: "Duloxetine",
                    classification: "Serotonin-Norepinephrine Reuptake Inhibitor (SNRI)",
                    moa: "A potent inhibitor of serotonin and norepinephrine reuptake.",
                    therapeuticUses: "Major depressive disorder, diabetic peripheral neuropathic pain, fibromyalgia, chronic musculoskeletal pain.",
                    adrs: "Nausea, dry mouth, constipation, fatigue.",
                    contraindications: "Concomitant use with MAOIs, uncontrolled narrow-angle glaucoma.",
                    pharmaApplications: {
                        dosageForms: "Delayed-release capsules.",
                        formulations: "Cymbalta (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "LC-MS/MS.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "Should not be used in patients with substantial alcohol use or chronic liver disease due to risk of hepatotoxicity.",
                },
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
                },
                 {
                    name: "Nortriptyline",
                    classification: "Tricyclic Antidepressant (TCA), Secondary amine",
                    moa: "Primarily inhibits the reuptake of norepinephrine, with less effect on serotonin. Less sedating and anticholinergic than amitriptyline.",
                    therapeuticUses: "Depression, neuropathic pain, smoking cessation.",
                    adrs: "Dry mouth, constipation, sedation (less than amitriptyline), orthostatic hypotension.",
                    contraindications: "Acute recovery period after MI, co-administration with MAOIs.",
                    pharmaApplications: {
                        dosageForms: "Capsules, oral solution.",
                        formulations: "Pamelor (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "HPLC, GC-MS.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "Active metabolite of amitriptyline. Therapeutic drug monitoring can be useful due to variability in metabolism.",
                },
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
                },
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
            name: "Dopamine precursors",
            drugs: [
                {
                    name: "Levodopa/Carbidopa",
                    classification: "Dopamine precursor/DOPA decarboxylase inhibitor",
                    moa: "Levodopa is a precursor to dopamine. Carbidopa inhibits the peripheral decarboxylation of levodopa, allowing more levodopa to cross the blood-brain barrier for CNS effect.",
                    therapeuticUses: "Parkinson's disease.",
                    adrs: "Nausea, vomiting, orthostatic hypotension, dyskinesias (motor fluctuations), hallucinations.",
                    contraindications: "Narrow-angle glaucoma, use of nonselective MAOIs.",
                    pharmaApplications: {
                        dosageForms: "Tablets (immediate-release, extended-release), orally disintegrating tablets, intestinal gel.",
                        formulations: "Sinemet (Brand), Rytary, Duopa.",
                        storage: "Store at room temperature, protect from light and moisture.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC, IR.",
                        quantitative: "HPLC with electrochemical or UV detection.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Effectiveness can wane over time ('wearing-off' phenomenon). High-protein meals can interfere with absorption.",
                },
            ],
          },
          {
            name: "MAO-B inhibitors",
            drugs: [
                {
                    name: "Selegiline",
                    classification: "Selective, irreversible MAO-B inhibitor",
                    moa: "Inhibits the monoamine oxidase type B (MAO-B) enzyme, which breaks down dopamine in the brain, thereby increasing dopamine levels.",
                    therapeuticUses: "Parkinson's disease (adjunctive therapy with levodopa/carbidopa).",
                    adrs: "Nausea, dizziness, insomnia, confusion, hallucinations.",
                    contraindications: "Use with meperidine, tramadol, methadone, TCAs, SSRIs due to risk of serotonin syndrome.",
                    pharmaApplications: {
                        dosageForms: "Capsules, tablets, orally disintegrating tablets, transdermal patch.",
                        formulations: "Eldepryl (Brand), Zelapar.",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "LC-MS/MS.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "At higher doses, loses its selectivity for MAO-B and can inhibit MAO-A, necessitating tyramine dietary restrictions.",
                },
            ],
          },
          {
            name: "COMT inhibitors",
            drugs: [
                 {
                    name: "Entacapone",
                    classification: "COMT inhibitor",
                    moa: "Reversibly inhibits catechol-O-methyltransferase (COMT), reducing the peripheral breakdown of levodopa and increasing its plasma half-life.",
                    therapeuticUses: "Adjunct to levodopa/carbidopa for 'wearing-off' episodes in Parkinson's disease.",
                    adrs: "Dyskinesia, nausea, brownish-orange urine discoloration, diarrhea.",
                    contraindications: "Known hypersensitivity.",
                    pharmaApplications: {
                        dosageForms: "Tablets. Also available in combination with levodopa/carbidopa.",
                        formulations: "Comtan (Brand), Stalevo (combination product).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "HPLC with UV detection.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "Must be administered with each dose of levodopa/carbidopa. May require a reduction in the levodopa dose.",
                },
            ],
          },
          {
            name: "Alzheimer’s drugs",
            drugs: [
                 {
                    name: "Donepezil",
                    classification: "Cholinesterase inhibitor",
                    moa: "Reversibly inhibits acetylcholinesterase, the enzyme responsible for the breakdown of acetylcholine, thereby increasing acetylcholine levels in the brain.",
                    therapeuticUses: "Mild, moderate, and severe Alzheimer's disease.",
                    adrs: "Nausea, vomiting, diarrhea, insomnia, bradycardia.",
                    contraindications: "Known hypersensitivity.",
                    pharmaApplications: {
                        dosageForms: "Tablets, orally disintegrating tablets.",
                        formulations: "Aricept (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "LC-MS/MS.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Provides symptomatic treatment but does not alter the underlying course of the disease.",
                },
                 {
                    name: "Memantine",
                    classification: "NMDA receptor antagonist",
                    moa: "Blocks N-methyl-D-aspartate (NMDA) receptors, protecting them from the excessive stimulation by glutamate that is thought to cause neurotoxicity in Alzheimer's disease.",
                    therapeuticUses: "Moderate to severe Alzheimer's disease.",
                    adrs: "Dizziness, headache, confusion, constipation.",
                    contraindications: "Known hypersensitivity.",
                    pharmaApplications: {
                        dosageForms: "Tablets, capsules (extended-release), oral solution.",
                        formulations: "Namenda (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "LC-MS/MS.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "Often used in combination with a cholinesterase inhibitor like donepezil.",
                },
            ],
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
                    },
                    {
                        name: "Chlorpromazine",
                        classification: "First-generation (typical) antipsychotic, Phenothiazine",
                        moa: "Blocks postsynaptic dopamine D2 receptors in the mesolimbic system. Also has strong anticholinergic, antihistaminic, and alpha-adrenergic blocking effects.",
                        therapeuticUses: "Schizophrenia, psychotic disorders, intractable hiccups, nausea/vomiting.",
                        adrs: "Sedation, orthostatic hypotension, anticholinergic effects (dry mouth, constipation), EPS, photosensitivity.",
                        contraindications: "Comatose states, large amounts of CNS depressants, bone marrow suppression.",
                        pharmaApplications: {
                            dosageForms: "Tablets, injection (IM/IV), suppositories.",
                            formulations: "Thorazine (Brand).",
                            storage: "Protect from light. Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "Colorimetric tests, TLC.",
                            quantitative: "HPLC, spectrophotometry.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Low-potency typical antipsychotic, so lower risk of EPS but higher risk of sedative and hypotensive effects compared to haloperidol.",
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
                    },
                    {
                        name: "Clozapine",
                        classification: "Second-generation (atypical) antipsychotic",
                        moa: "Weak D2 receptor antagonist but strong 5-HT2A antagonist. Also acts on various other receptors.",
                        therapeuticUses: "Treatment-resistant schizophrenia, reducing suicidal behavior in schizophrenic patients.",
                        adrs: "Agranulocytosis (potentially fatal), myocarditis, seizures, significant weight gain, sialorrhea (excessive salivation).",
                        contraindications: "History of clozapine-induced agranulocytosis or myocarditis, uncontrolled epilepsy.",
                        pharmaApplications: {
                            dosageForms: "Tablets, orally disintegrating tablets.",
                            formulations: "Clozaril (Brand).",
                            storage: "Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "HPLC.",
                            quantitative: "HPLC, LC-MS/MS for TDM.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Requires mandatory absolute neutrophil count (ANC) monitoring due to the risk of agranulocytosis. Reserved for treatment failure with other antipsychotics.",
                    },
                    {
                        name: "Risperidone",
                        classification: "Second-generation (atypical) antipsychotic",
                        moa: "Potent antagonist of serotonin 5-HT2A and dopamine D2 receptors.",
                        therapeuticUses: "Schizophrenia, bipolar mania, irritability associated with autistic disorder.",
                        adrs: "Hyperprolactinemia (leading to gynecomastia, galactorrhea), EPS (especially at higher doses), orthostatic hypotension.",
                        contraindications: "Known hypersensitivity.",
                        pharmaApplications: {
                            dosageForms: "Tablets, orally disintegrating tablets, oral solution, long-acting injection.",
                            formulations: "Risperdal (Brand), Risperdal Consta (injection).",
                            storage: "Store at room temperature, protect from light.",
                        },
                        analyticalMethods: {
                            qualitative: "HPLC.",
                            quantitative: "HPLC, LC-MS/MS.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Acts more like a typical antipsychotic at doses >6 mg/day due to strong D2 blockade, increasing EPS risk.",
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
            name: "Natural",
            drugs: [
                {
                    name: "Morphine",
                    classification: "Opioid Analgesic, Phenanthrene derivative",
                    moa: "Acts as an agonist at mu-opioid receptors in the CNS, causing analgesia, sedation, and euphoria.",
                    therapeuticUses: "Severe acute and chronic pain.",
                    adrs: "Respiratory depression, constipation, sedation, nausea, vomiting, dependence.",
                    contraindications: "Severe respiratory depression, acute or severe bronchial asthma, paralytic ileus.",
                    pharmaApplications: {
                        dosageForms: "Oral solution, tablets (IR, ER), injection (IV, IM, SC, epidural).",
                        formulations: "MS Contin (ER tablet), Kadian (ER capsule), Duramorph (injection).",
                        storage: "Controlled substance. Store securely at room temperature, protect from light.",
                    },
                    analyticalMethods: {
                        qualitative: "Colorimetric tests (Marquis reagent), GC-MS.",
                        quantitative: "HPLC, LC-MS.",
                        pharmacopoeial: "USP, BP (Titration for assay).",
                    },
                    specialNotes: "The gold standard against which other opioids are compared. Has an active metabolite (morphine-6-glucuronide) that can accumulate in renal failure.",
                },
                 {
                    name: "Codeine",
                    classification: "Opioid Analgesic, Antitussive",
                    moa: "A prodrug that is metabolized to morphine by the CYP2D6 enzyme. Acts as a weak agonist at mu-opioid receptors.",
                    therapeuticUses: "Mild to moderate pain, cough suppression.",
                    adrs: "Constipation, nausea, drowsiness. Risk of respiratory depression in ultra-rapid metabolizers.",
                    contraindications: "Post-tonsillectomy pain in children, ultra-rapid CYP2D6 metabolizers.",
                    pharmaApplications: {
                        dosageForms: "Tablets (often in combination with paracetamol), oral solution.",
                        formulations: "Tylenol with Codeine.",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "TLC, GC-MS.",
                        quantitative: "HPLC.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Genetic variability in CYP2D6 can lead to either lack of efficacy (poor metabolizers) or toxicity (ultra-rapid metabolizers).",
                },
            ],
          },
          {
            name: "Semi-synthetic",
            drugs: [
                {
                    name: "Oxycodone",
                    classification: "Semi-synthetic Opioid Analgesic",
                    moa: "Binds to mu-opioid receptors to produce analgesia.",
                    therapeuticUses: "Moderate to severe pain.",
                    adrs: "Constipation, nausea, somnolence, dizziness, high abuse potential.",
                    contraindications: "Significant respiratory depression, acute or severe bronchial asthma.",
                    pharmaApplications: {
                        dosageForms: "Tablets (IR, ER), capsules (IR), oral solution. Also in combination with paracetamol.",
                        formulations: "OxyContin (ER tablet), Roxicodone (IR tablet), Percocet (combo).",
                        storage: "Controlled substance. Store securely at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "Immunoassay, GC-MS.",
                        quantitative: "LC-MS/MS, HPLC.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "OxyContin formulation was a major focus of opioid crisis litigation due to its high abuse potential.",
                },
                 {
                    name: "Hydromorphone",
                    classification: "Semi-synthetic Opioid Analgesic",
                    moa: "Potent agonist at the mu-opioid receptor.",
                    therapeuticUses: "Severe pain.",
                    adrs: "Respiratory depression, sedation, constipation. High risk of overdose due to potency.",
                    contraindications: "Opioid-naive patients (for high-potency formulations), respiratory depression.",
                    pharmaApplications: {
                        dosageForms: "Tablets (IR, ER), oral liquid, injection, suppositories.",
                        formulations: "Dilaudid (Brand).",
                        storage: "Controlled substance. Store securely at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "GC-MS.",
                        quantitative: "LC-MS/MS.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Significantly more potent than morphine (approx. 5-7 times on a mg basis). High risk of medication errors.",
                },
            ],
          },
          {
            name: "Synthetic",
            drugs: [
                {
                    name: "Fentanyl",
                    classification: "Synthetic Opioid Analgesic",
                    moa: "Extremely potent, selective agonist of the mu-opioid receptor.",
                    therapeuticUses: "Severe pain (transdermal patch for chronic pain), procedural anesthesia (injection).",
                    adrs: "Respiratory depression, muscle rigidity (especially chest wall), bradycardia.",
                    contraindications: "Management of acute or postoperative pain (transdermal patch), opioid-naive patients.",
                    pharmaApplications: {
                        dosageForms: "Injection, transdermal patch, buccal film, sublingual tablet, nasal spray.",
                        formulations: "Duragesic (patch), Actiq (lozenge), Sublimaze (injection).",
                        storage: "Controlled substance. Store and dispose of patches carefully to prevent accidental exposure.",
                    },
                    analyticalMethods: {
                        qualitative: "LC-MS/MS.",
                        quantitative: "LC-MS/MS.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "Approximately 100 times more potent than morphine. Illicit fentanyl is a major driver of overdose deaths.",
                },
                 {
                    name: "Tramadol",
                    classification: "Atypical Synthetic Opioid Analgesic",
                    moa: "Weak mu-opioid receptor agonist. Also inhibits the reuptake of serotonin and norepinephrine.",
                    therapeuticUses: "Moderate to moderately severe pain.",
                    adrs: "Dizziness, nausea, constipation, somnolence. Lowers seizure threshold.",
                    contraindications: "Use in children <12 years, significant respiratory depression.",
                    pharmaApplications: {
                        dosageForms: "Tablets (IR, ER), capsules.",
                        formulations: "Ultram (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "GC-MS.",
                        quantitative: "HPLC, LC-MS/MS.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Risk of serotonin syndrome when combined with other serotonergic drugs. Lower abuse potential than traditional opioids but still present.",
                },
            ],
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
            name: "Cerebral stimulants",
            drugs: [
                {
                    name: "Caffeine",
                    classification: "Methylxanthine, CNS Stimulant",
                    moa: "Antagonizes adenosine receptors in the brain, leading to increased alertness. Also inhibits phosphodiesterase.",
                    therapeuticUses: "Increase alertness, treatment of apnea of prematurity in neonates.",
                    adrs: "Insomnia, nervousness, tachycardia, gastrointestinal upset.",
                    contraindications: "Known hypersensitivity.",
                    pharmaApplications: {
                        dosageForms: "Tablets, injection. Widely available in beverages and OTC products.",
                        formulations: "No-Doz (OTC), Cafcit (injection for apnea).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "TLC.",
                        quantitative: "HPLC, UV-Vis spectrophotometry.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Tolerance can develop with chronic use. Abrupt cessation can cause withdrawal headaches.",
                },
            ],
          },
          {
            name: "Medullary stimulants",
            drugs: [],
          },
           {
            name: "Spinal stimulants",
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
                    { 
                        name: "IV Anesthetics", 
                        drugs: [
                            {
                                name: "Propofol",
                                classification: "Intravenous general anesthetic",
                                moa: "Potentiates GABAA receptor activity, causing global CNS depression.",
                                therapeuticUses: "Induction and maintenance of anesthesia, sedation in ICU.",
                                adrs: "Hypotension, apnea, injection site pain, propofol infusion syndrome (rare).",
                                contraindications: "Hypersensitivity to propofol, egg, or soy products.",
                                pharmaApplications: {
                                    dosageForms: "Emulsion for injection.",
                                    formulations: "Diprivan (Brand).",
                                    storage: "Store at room temperature. Aseptic technique is critical as the lipid emulsion supports microbial growth.",
                                },
                                analyticalMethods: {
                                    qualitative: "GC-MS.",
                                    quantitative: "HPLC.",
                                    pharmacopoeial: "USP, BP.",
                                },
                                specialNotes: "Rapid onset and short duration of action. Milky white appearance.",
                            },
                             {
                                name: "Thiopental",
                                classification: "Barbiturate (ultra short-acting)",
                                moa: "Potentiates GABA-A receptor activity, causing profound but brief CNS depression.",
                                therapeuticUses: "Induction of anesthesia, management of refractory status epilepticus.",
                                adrs: "Respiratory depression, hypotension, laryngospasm, extravasation injury.",
                                contraindications: "Absence of suitable veins, status asthmaticus, porphyria.",
                                pharmaApplications: {
                                    dosageForms: "Powder for injection (reconstituted).",
                                    formulations: "Pentothal (Brand).",
                                    storage: "Store powder at room temperature. Reconstituted solution is unstable.",
                                },
                                analyticalMethods: {
                                    qualitative: "Colorimetric tests.",
                                    quantitative: "HPLC, GC-MS.",
                                    pharmacopoeial: "USP, BP.",
                                },
                                specialNotes: "Rapid onset and redistribution from brain to other tissues determines its short duration of action.",
                            },
                        ] 
                    },
                    { 
                        name: "Inhalational Anesthetics", 
                        drugs: [
                             {
                                name: "Isoflurane",
                                classification: "Inhalational general anesthetic",
                                moa: "Exact mechanism unknown, but thought to enhance inhibitory channel activity (GABA, glycine) and inhibit excitatory channel activity (NMDA, nicotinic).",
                                therapeuticUses: "Induction and maintenance of general anesthesia.",
                                adrs: "Hypotension (vasodilation), respiratory depression, pungent odor can irritate airways.",
                                contraindications: "Known or suspected susceptibility to malignant hyperthermia.",
                                pharmaApplications: {
                                    dosageForms: "Liquid for inhalation (vaporized).",
                                    formulations: "Forane (Brand).",
                                    storage: "Store in airtight containers, protected from light.",
                                },
                                analyticalMethods: {
                                    qualitative: "Gas Chromatography (GC).",
                                    quantitative: "GC with Flame Ionization Detector (FID).",
                                    pharmacopoeial: "USP, BP.",
                                },
                                specialNotes: "Low blood:gas partition coefficient allows for relatively rapid induction and recovery.",
                            },
                        ] 
                    },
                ]
            },
            {
                name: "Local anesthetics",
                subclasses: [
                    { 
                        name: "Amide type", 
                        drugs: [
                             {
                                name: "Lidocaine",
                                classification: "Local Anesthetic (Amide type), Class IB Antiarrhythmic",
                                moa: "Blocks voltage-gated sodium channels, preventing the initiation and conduction of nerve impulses.",
                                therapeuticUses: "Local or regional anesthesia, treatment of ventricular arrhythmias.",
                                adrs: "CNS effects (drowsiness, tinnitus, seizures at high doses), cardiac effects (hypotension, bradycardia).",
                                contraindications: "Adams-Stokes syndrome, severe heart block, hypersensitivity to amide anesthetics.",
                                pharmaApplications: {
                                    dosageForms: "Injection, topical patch, gel, ointment, oral solution.",
                                    formulations: "Xylocaine (Brand), Lidoderm (patch).",
                                    storage: "Store at room temperature.",
                                },
                                analyticalMethods: {
                                    qualitative: "TLC, IR.",
                                    quantitative: "HPLC, GC.",
                                    pharmacopoeial: "USP, BP.",
                                },
                                specialNotes: "Metabolized by the liver. Often formulated with epinephrine to prolong duration of action and reduce systemic absorption.",
                            },
                        ] 
                    },
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
            name: "Non-opioid analgesics",
            drugs: [
                {
                    name: "Paracetamol (Acetaminophen)",
                    classification: "Analgesic, Antipyretic",
                    moa: "Not fully elucidated. Thought to inhibit COX enzymes in the CNS. Weak peripheral anti-inflammatory effect.",
                    therapeuticUses: "Pain, fever.",
                    adrs: "Generally well-tolerated at therapeutic doses. Hepatotoxicity in overdose.",
                    contraindications: "Severe liver disease, hypersensitivity.",
                    pharmaApplications: {
                        dosageForms: "Tablets, capsules, oral suspension, suppositories, IV injection.",
                        formulations: "Tylenol (US Brand), Panadol (International Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "Colorimetric test with o-cresol.",
                        quantitative: "UV-Vis spectrophotometry, HPLC.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Overdose is treated with N-acetylcysteine (NAC). Lacks significant anti-inflammatory properties.",
                },
                {
                    name: "Aspirin",
                    classification: "NSAID, Salicylate",
                    moa: "Irreversibly inhibits COX-1 and COX-2 enzymes, preventing prostaglandin and thromboxane synthesis.",
                    therapeuticUses: "Pain, fever, inflammation. Low dose for antiplatelet effect (prevention of MI/stroke).",
                    adrs: "GI upset, bleeding, tinnitus, Reye's syndrome in children.",
                    contraindications: "Hypersensitivity, children with viral illness, bleeding disorders.",
                    pharmaApplications: {
                        dosageForms: "Tablets (chewable, enteric-coated, buffered), suppositories.",
                        formulations: "Bayer (Brand), Ecotrin (enteric-coated).",
                        storage: "Store in a dry place to prevent hydrolysis to salicylic and acetic acid.",
                    },
                    analyticalMethods: {
                        qualitative: "Ferric chloride test for salicylate.",
                        quantitative: "Acid-base titration after hydrolysis.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Enteric coating is a key formulation strategy to reduce GI side effects.",
                },
            ],
        },
        {
            name: "Traditional NSAIDs",
            drugs: [
                {
                    name: "Ibuprofen",
                    classification: "NSAID, Propionic acid derivative",
                    moa: "Reversibly inhibits COX-1 and COX-2 enzymes.",
                    therapeuticUses: "Pain, fever, inflammation (e.g., arthritis).",
                    adrs: "GI upset, risk of GI bleeding, renal impairment, increased cardiovascular risk.",
                    contraindications: "Aspirin allergy, perioperative pain in CABG surgery.",
                    pharmaApplications: {
                        dosageForms: "Tablets, capsules, oral suspension, IV injection.",
                        formulations: "Advil (Brand), Motrin (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "HPLC, titration.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Available over-the-counter (OTC) at lower strengths.",
                },
                {
                    name: "Diclofenac",
                    classification: "NSAID, Acetic acid derivative",
                    moa: "Reversibly inhibits COX-1 and COX-2 enzymes.",
                    therapeuticUses: "Pain, inflammation (arthritis), migraine.",
                    adrs: "GI upset, increased cardiovascular risk (higher than some other NSAIDs), renal impairment.",
                    contraindications: "Aspirin allergy, perioperative pain in CABG surgery.",
                    pharmaApplications: {
                        dosageForms: "Tablets (IR, ER), capsules, topical gel, injection.",
                        formulations: "Voltaren (Brand), Cataflam.",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "HPLC.",
                        pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Topical formulations (gel) are used to minimize systemic side effects for localized pain.",
                },
            ],
        },
        {
            name: "COX-2 inhibitors",
            drugs: [
                {
                    name: "Celecoxib",
                    classification: "Selective COX-2 inhibitor NSAID",
                    moa: "Selectively inhibits the COX-2 enzyme, which is induced during inflammation, sparing the COX-1 enzyme that protects the GI mucosa.",
                    therapeuticUses: "Osteoarthritis, rheumatoid arthritis, acute pain.",
                    adrs: "Increased risk of cardiovascular events (MI, stroke), renal impairment. Lower risk of GI bleeding than traditional NSAIDs.",
                    contraindications: "Aspirin or sulfa allergy, perioperative pain in CABG surgery.",
                    pharmaApplications: {
                        dosageForms: "Capsules.",
                        formulations: "Celebrex (Brand).",
                        storage: "Store at room temperature.",
                    },
                    analyticalMethods: {
                        qualitative: "HPLC.",
                        quantitative: "HPLC, LC-MS/MS.",
                        pharmacopoeial: "USP.",
                    },
                    specialNotes: "Developed to reduce GI toxicity, but cardiovascular risks became a major concern for the class.",
                },
            ],
        },
        {
            name: "Disease-modifying antirheumatic drugs (DMARDs)",
            drugs: [],
        },
        {
            name: "Anti-gout drugs",
            drugs: [],
        },
    ],
  },
  {
    name: "Drugs Acting on the Autonomic Nervous System (ANS)",
    pharmaFocus: "receptor binding assays, sterile preparations, formulation of eye drops.",
    subclasses: [
      {
        name: "Cholinergic Agonists & Antagonists",
        subclasses: [
          {
            name: "Direct-acting agonists",
            drugs: [
              {
                name: "Pilocarpine",
                classification: "Cholinergic agonist (muscarinic)",
                moa: "Directly stimulates muscarinic receptors, leading to effects like miosis (pupil constriction) and increased salivation and sweat.",
                therapeuticUses: "Glaucoma (to reduce intraocular pressure), xerostomia (dry mouth).",
                adrs: "Sweating, nausea, blurred vision, bradycardia.",
                contraindications: "Acute iritis, uncontrolled asthma.",
                pharmaApplications: {
                  dosageForms: "Eye drops, tablets.",
                  formulations: "Salagen (tablets), Isopto Carpine (eye drops).",
                  storage: "Store at room temperature.",
                },
                analyticalMethods: {
                  qualitative: "TLC.",
                  quantitative: "HPLC, titration.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "A miotic agent that constricts the pupil.",
              },
            ],
          },
          {
            name: "Antimuscarinics (Antagonists)",
            drugs: [
              {
                name: "Atropine",
                classification: "Anticholinergic, Antimuscarinic",
                moa: "Competitively blocks acetylcholine at muscarinic receptors, leading to effects opposite of the parasympathetic nervous system.",
                therapeuticUses: "Symptomatic bradycardia, preoperative medication to reduce secretions, antidote for organophosphate poisoning.",
                adrs: "Dry mouth, blurred vision, tachycardia, urinary retention, constipation, confusion (anticholinergic toxidrome).",
                contraindications: "Narrow-angle glaucoma, myasthenia gravis.",
                pharmaApplications: {
                  dosageForms: "Injection (IV, IM), eye drops.",
                  formulations: "AtroPen (autoinjector).",
                  storage: "Store at room temperature, protect from light.",
                },
                analyticalMethods: {
                  qualitative: "TLC, Vitali-Morin reaction.",
                  quantitative: "HPLC, Titration.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "Classic anticholinergic. Mnemonic for overdose: 'Hot as a hare, blind as a bat, dry as a bone, red as a beet, mad as a hatter'.",
              },
            ],
          },
        ]
      },
      {
        name: "Adrenergic Agonists (Sympathomimetics)",
        drugs: [
            {
              name: "Adrenaline (Epinephrine)",
              classification: "Adrenergic agonist (alpha and beta)",
              moa: "Acts on alpha-1, beta-1, and beta-2 adrenergic receptors. Causes vasoconstriction (alpha), increased heart rate and contractility (beta-1), and bronchodilation (beta-2).",
              therapeuticUses: "Anaphylaxis, cardiac arrest, severe asthma attacks.",
              adrs: "Tachycardia, hypertension, anxiety, tremor, arrhythmias.",
              contraindications: "No absolute contraindications in a life-threatening situation like anaphylaxis.",
              pharmaApplications: {
                dosageForms: "Injection (IV, IM, SC), auto-injector.",
                formulations: "EpiPen (auto-injector).",
                storage: "Protect from light. Do not refrigerate.",
              },
              analyticalMethods: {
                qualitative: "Colorimetric tests.",
                quantitative: "HPLC with electrochemical detection.",
                pharmacopoeial: "USP, BP.",
              },
              specialNotes: "The drug of choice for anaphylactic shock.",
            },
            {
              name: "Salbutamol (Albuterol)",
              classification: "Selective beta-2 adrenergic agonist",
              moa: "Selectively stimulates beta-2 adrenergic receptors in the lungs, causing relaxation of bronchial smooth muscle and subsequent bronchodilation.",
              therapeuticUses: "Asthma (acute relief of bronchospasm), COPD.",
              adrs: "Tremor, tachycardia, palpitations, nervousness.",
              contraindications: "Known hypersensitivity.",
              pharmaApplications: {
                dosageForms: "Metered-dose inhaler (MDI), dry powder inhaler (DPI), nebulizer solution, tablets, syrup.",
                formulations: "Ventolin (Brand), ProAir (Brand).",
                storage: "Store at room temperature. Shake inhalers well.",
              },
              analyticalMethods: {
                qualitative: "HPLC.",
                quantitative: "HPLC, UV spectrophotometry.",
                pharmacopoeial: "USP, BP.",
              },
              specialNotes: "Considered a 'reliever' medication in asthma. Overuse can indicate poor asthma control.",
            },
        ],
      },
      {
        name: "Adrenergic Antagonists",
         subclasses: [
          {
            name: "Alpha Blockers",
            drugs: [
               {
                  name: "Prazosin",
                  classification: "Alpha-1 adrenergic antagonist",
                  moa: "Selectively blocks postsynaptic alpha-1 adrenergic receptors, leading to vasodilation of both arteries and veins and a fall in blood pressure.",
                  therapeuticUses: "Hypertension, benign prostatic hyperplasia (BPH).",
                  adrs: "First-dose hypotension (syncope), dizziness, headache, drowsiness.",
                  contraindications: "Known hypersensitivity.",
                  pharmaApplications: {
                    dosageForms: "Capsules.",
                    formulations: "Minipress (Brand).",
                    storage: "Store at room temperature, protect from light.",
                  },
                  analyticalMethods: {
                    qualitative: "HPLC.",
                    quantitative: "HPLC.",
                    pharmacopoeial: "USP.",
                  },
                  specialNotes: "The 'first-dose effect' can be minimized by starting with a low dose at bedtime.",
                },
            ]
          },
          {
            name: "Beta Blockers",
            drugs: [
                {
                  name: "Propranolol",
                  classification: "Non-selective beta-adrenergic antagonist",
                  moa: "Blocks both beta-1 and beta-2 adrenergic receptors, leading to decreased heart rate, contractility, and blood pressure. Also causes bronchoconstriction.",
                  therapeuticUses: "Hypertension, angina, arrhythmias, migraine prophylaxis, performance anxiety.",
                  adrs: "Bradycardia, fatigue, bronchospasm (in asthmatics), masking of hypoglycemia symptoms.",
                  contraindications: "Asthma, COPD, sinus bradycardia, heart block.",
                  pharmaApplications: {
                    dosageForms: "Tablets (IR, ER), oral solution, injection.",
                    formulations: "Inderal (Brand).",
                    storage: "Store at room temperature.",
                  },
                  analyticalMethods: {
                    qualitative: "HPLC.",
                    quantitative: "HPLC, UV spectrophotometry.",
                    pharmacopoeial: "USP, BP.",
                  },
                  specialNotes: "Non-selective nature limits its use in patients with respiratory conditions. It is lipophilic and crosses the blood-brain barrier, which is why it's used for migraine and anxiety.",
                },
            ]
          },
        ]
      },
      {
        name: "Neuromuscular Blockers",
        drugs: [
            {
              name: "Succinylcholine",
              classification: "Depolarizing neuromuscular blocker",
              moa: "Acts as an acetylcholine (ACh) receptor agonist, causing persistent depolarization of the motor endplate, which leads to muscle paralysis.",
              therapeuticUses: "Rapid sequence intubation (RSI), short procedures requiring muscle relaxation.",
              adrs: "Muscle fasciculations, hyperkalemia, myalgia, potential trigger for malignant hyperthermia.",
              contraindications: "History of malignant hyperthermia, severe burns, major trauma, neuromuscular disease (due to hyperkalemia risk).",
              pharmaApplications: {
                dosageForms: "Injection.",
                formulations: "Anectine (Brand).",
                storage: "Must be refrigerated.",
              },
              analyticalMethods: {
                qualitative: "Specific enzyme assays for pseudocholinesterase activity.",
                quantitative: "LC-MS/MS for determination in biological fluids.",
                pharmacopoeial: "USP, BP.",
              },
              specialNotes: "Very rapid onset and short duration of action due to breakdown by plasma pseudocholinesterase.",
            },
            {
              name: "Pancuronium",
              classification: "Non-depolarizing neuromuscular blocker (long-acting)",
              moa: "Acts as a competitive antagonist at nicotinic ACh receptors at the motor endplate, preventing ACh from binding and causing muscle paralysis.",
              therapeuticUses: "To provide skeletal muscle relaxation during surgery.",
              adrs: "Tachycardia, hypertension, prolonged muscle weakness.",
              contraindications: "Known hypersensitivity.",
              pharmaApplications: {
                dosageForms: "Injection.",
                formulations: "Pavulon (Brand).",
                storage: "Store in refrigerator.",
              },
              analyticalMethods: {
                qualitative: "HPLC.",
                quantitative: "HPLC.",
                pharmacopoeial: "USP, BP.",
              },
              specialNotes: "Action can be reversed by acetylcholinesterase inhibitors like neostigmine.",
            },
        ],
      },
      {
        name: "Ganglion Blockers",
        drugs: [],
      },
    ]
  },
  {
    name: "Cardiovascular Drugs",
    pharmaFocus: "bioequivalence studies, sterile product formulation, dissolution testing.",
    subclasses: [
      {
        name: "Antihypertensives",
        subclasses: [
          {
            name: "ACE Inhibitors",
            drugs: [
              {
                name: "Captopril",
                classification: "ACE Inhibitor",
                moa: "Inhibits Angiotensin-Converting Enzyme (ACE), preventing the conversion of angiotensin I to angiotensin II, a potent vasoconstrictor. This leads to vasodilation and reduced aldosterone secretion.",
                therapeuticUses: "Hypertension, heart failure, post-myocardial infarction.",
                adrs: "Dry cough, hyperkalemia, hypotension, angioedema (rare but serious).",
                contraindications: "History of angioedema, bilateral renal artery stenosis, pregnancy.",
                pharmaApplications: {
                  dosageForms: "Tablets.",
                  formulations: "Capoten (Brand).",
                  storage: "Store at room temperature, protect from moisture.",
                },
                analyticalMethods: {
                  qualitative: "HPLC, IR spectroscopy.",
                  quantitative: "HPLC, Titration.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "First ACE inhibitor developed. Shorter half-life requires more frequent dosing compared to newer agents.",
              },
            ],
          },
          {
            name: "ARBs",
            drugs: [
              {
                name: "Losartan",
                classification: "Angiotensin II Receptor Blocker (ARB)",
                moa: "Selectively blocks the AT1 receptor, preventing angiotensin II from binding. This causes vasodilation and reduces aldosterone secretion, lowering blood pressure.",
                therapeuticUses: "Hypertension, diabetic nephropathy, heart failure.",
                adrs: "Dizziness, hyperkalemia. Lower incidence of cough compared to ACE inhibitors.",
                contraindications: "Pregnancy, bilateral renal artery stenosis.",
                pharmaApplications: {
                  dosageForms: "Tablets.",
                  formulations: "Cozaar (Brand).",
                  storage: "Store at room temperature.",
                },
                analyticalMethods: {
                  qualitative: "HPLC, Mass Spectrometry.",
                  quantitative: "HPLC with UV detection.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "A good alternative for patients who cannot tolerate the cough associated with ACE inhibitors.",
              },
            ],
          },
          {
            name: "Beta-blockers",
            drugs: [
              {
                name: "Metoprolol",
                classification: "Cardioselective Beta-1 Blocker",
                moa: "Selectively blocks beta-1 adrenergic receptors in the heart, leading to decreased heart rate, myocardial contractility, and blood pressure.",
                therapeuticUses: "Hypertension, angina, post-myocardial infarction, heart failure.",
                adrs: "Fatigue, dizziness, bradycardia, hypotension.",
                contraindications: "Severe bradycardia, heart block (2nd or 3rd degree), decompensated heart failure.",
                pharmaApplications: {
                  dosageForms: "Tablets (immediate-release: tartrate; extended-release: succinate), injection.",
                  formulations: "Lopressor (tartrate), Toprol-XL (succinate).",
                  storage: "Store at room temperature, protect from light.",
                },
                analyticalMethods: {
                  qualitative: "HPLC.",
                  quantitative: "HPLC.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "Cardioselectivity is dose-dependent; at higher doses, it can also block beta-2 receptors. The succinate salt (Toprol-XL) is approved for heart failure.",
              },
            ],
          },
          {
            name: "Calcium Channel Blockers",
            drugs: [
               {
                name: "Amlodipine",
                classification: "Dihydropyridine Calcium Channel Blocker",
                moa: "Inhibits the influx of calcium ions into vascular smooth muscle and cardiac muscle, causing peripheral arterial vasodilation and a reduction in blood pressure.",
                therapeuticUses: "Hypertension, angina.",
                adrs: "Peripheral edema, dizziness, flushing, headache, fatigue.",
                contraindications: "Known hypersensitivity.",
                pharmaApplications: {
                  dosageForms: "Tablets.",
                  formulations: "Norvasc (Brand).",
                  storage: "Store at room temperature.",
                },
                analyticalMethods: {
                  qualitative: "HPLC, IR spectroscopy.",
                  quantitative: "HPLC with UV detection.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "Long half-life allows for once-daily dosing. Peripheral edema is a common side effect due to vasodilation.",
              },
            ],
          },
           {
            name: "Diuretics",
            drugs: [
               {
                name: "Hydrochlorothiazide",
                classification: "Thiazide Diuretic",
                moa: "Inhibits the sodium-chloride symporter in the distal convoluted tubule of the kidney, increasing the excretion of sodium, chloride, and water.",
                therapeuticUses: "Hypertension, edema.",
                adrs: "Hypokalemia, hyponatremia, hyperuricemia, hyperglycemia, dizziness.",
                contraindications: "Anuria, hypersensitivity to sulfonamides.",
                pharmaApplications: {
                  dosageForms: "Tablets, capsules.",
                  formulations: "Microzide (Brand).",
                  storage: "Store at room temperature.",
                },
                analyticalMethods: {
                  qualitative: "TLC, IR.",
                  quantitative: "HPLC.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "Often used as a first-line agent for hypertension, frequently in combination with other antihypertensives.",
              },
            ],
          },
        ]
      },
      {
        name: "Antianginal Drugs",
        drugs: [
            {
                name: "Nitroglycerin",
                classification: "Nitrate, Vasodilator",
                moa: "Metabolized to nitric oxide (NO), which activates guanylate cyclase, increasing cGMP levels and leading to smooth muscle relaxation. This causes venous and arterial dilation, reducing myocardial oxygen demand.",
                therapeuticUses: "Acute treatment and prophylaxis of angina pectoris.",
                adrs: "Headache, dizziness, flushing, orthostatic hypotension.",
                contraindications: "Concurrent use with PDE-5 inhibitors (e.g., sildenafil), severe anemia, increased intracranial pressure.",
                pharmaApplications: {
                  dosageForms: "Sublingual tablets, translingual spray, transdermal patch, ointment, IV infusion.",
                  formulations: "Nitrostat (sublingual), Nitro-Dur (patch).",
                  storage: "Sublingual tablets must be stored in the original amber glass container, protected from heat and moisture.",
                },
                analyticalMethods: {
                  qualitative: "IR spectroscopy.",
                  quantitative: "HPLC, Colorimetric methods.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "Tolerance can develop with continuous use, requiring a 'nitrate-free' interval (e.g., removing a patch overnight).",
              },
        ],
      },
      {
          name: "Antiarrhythmics",
          drugs: [],
      },
      {
          name: "Heart failure drugs",
          drugs: [],
      },
      {
          name: "Antihyperlipidemics",
          drugs: [],
      }
    ]
  },
  {
    name: "Drugs Acting on Blood & Blood-forming Organs",
    pharmaFocus: "bioassays, sterility testing, handling of biologics.",
    subclasses: [
      {
        name: "Anticoagulants",
        subclasses: [
          {
            name: "Heparins",
            drugs: [
              {
                name: "Heparin",
                classification: "Anticoagulant",
                moa: "Binds to antithrombin III, accelerating its ability to inactivate thrombin, factor Xa, and other clotting factors, thus preventing clot formation.",
                therapeuticUses: "Treatment and prevention of deep vein thrombosis (DVT) and pulmonary embolism (PE), acute coronary syndromes.",
                adrs: "Bleeding, heparin-induced thrombocytopenia (HIT), osteoporosis (long-term use).",
                contraindications: "Active bleeding, history of HIT, severe thrombocytopenia.",
                pharmaApplications: {
                  dosageForms: "Injection (IV, SC).",
                  formulations: "Various generic formulations.",
                  storage: "Store at room temperature. Do not freeze.",
                },
                analyticalMethods: {
                  qualitative: "Protamine titration.",
                  quantitative: "Activated partial thromboplastin time (aPTT) monitoring, anti-Xa assay.",
                  pharmacopoeial: "USP, BP (assay based on anticoagulant activity).",
                },
                specialNotes: "Antidote is protamine sulfate. Requires regular monitoring (aPTT or anti-Xa).",
              },
            ]
          },
          {
            name: "Oral Anticoagulants",
            drugs: [
                {
                    name: "Warfarin",
                    classification: "Vitamin K antagonist",
                    moa: "Inhibits the synthesis of vitamin K-dependent clotting factors (II, VII, IX, X) and proteins C and S.",
                    therapeuticUses: "Prevention and treatment of thromboembolic disorders (DVT, PE), stroke prevention in atrial fibrillation.",
                    adrs: "Bleeding, skin necrosis (rare), purple toe syndrome (rare).",
                    contraindications: "Pregnancy, active bleeding, recent surgery.",
                    pharmaApplications: {
                      dosageForms: "Tablets.",
                      formulations: "Coumadin (Brand).",
                      storage: "Store at room temperature, protect from light.",
                    },
                    analyticalMethods: {
                      qualitative: "HPLC.",
                      quantitative: "Prothrombin time (PT) / International Normalized Ratio (INR) monitoring.",
                      pharmacopoeial: "USP, BP.",
                    },
                    specialNotes: "Narrow therapeutic index, requiring frequent INR monitoring. Numerous drug and food (Vitamin K) interactions. Antidote is Vitamin K.",
                },
            ]
          }
        ]
      },
      {
        name: "Antiplatelets",
        drugs: [
            {
                name: "Aspirin",
                classification: "NSAID, Antiplatelet",
                moa: "Irreversibly inhibits COX-1 in platelets, preventing the synthesis of thromboxane A2, a potent platelet aggregator.",
                therapeuticUses: "Primary and secondary prevention of cardiovascular events (MI, stroke).",
                adrs: "GI bleeding, hemorrhagic stroke.",
                contraindications: "Hypersensitivity, bleeding disorders.",
                pharmaApplications: {
                  dosageForms: "Tablets (typically low dose, e.g., 75mg, 81mg).",
                  formulations: "Often enteric-coated to reduce GI irritation.",
                  storage: "Store in a dry place.",
                },
                analyticalMethods: {
                  qualitative: "Platelet aggregation tests.",
                  quantitative: "VerifyNow assay.",
                  pharmacopoeial: "USP, BP.",
                },
                specialNotes: "A cornerstone of cardiovascular prevention therapy.",
            },
        ],
      },
      { name: "Thrombolytics", drugs: [] },
      { name: "Hematinics", drugs: [] },
      { name: "Growth factors", drugs: [] },
    ]
  },
  {
    name: "Respiratory System Drugs",
    pharmaFocus: "Inhaler device technology (MDI, DPI), particle size analysis, aerosol performance testing.",
    subclasses: [
      {
        name: "Bronchodilators",
        subclasses: [
            {
                name: "Beta-2 agonists",
                drugs: [
                    {
                        name: "Salbutamol (Albuterol)",
                        classification: "Short-acting beta-2 agonist (SABA)",
                        moa: "Selectively stimulates beta-2 adrenergic receptors, leading to relaxation of bronchial smooth muscle and bronchodilation.",
                        therapeuticUses: "Acute relief of bronchospasm in asthma and COPD.",
                        adrs: "Tremor, tachycardia, palpitations.",
                        contraindications: "Hypersensitivity.",
                        pharmaApplications: {
                            dosageForms: "Metered-dose inhaler (MDI), dry powder inhaler (DPI), nebulizer solution, tablets.",
                            formulations: "Ventolin, ProAir.",
                            storage: "Store at room temperature. Shake MDI before use.",
                        },
                        analyticalMethods: {
                            qualitative: "HPLC.",
                            quantitative: "HPLC, UV spectrophotometry.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Known as a 'reliever' medication. Over-reliance indicates poor underlying asthma control.",
                    },
                ]
            },
            {
                name: "Antimuscarinics",
                drugs: [
                     {
                        name: "Ipratropium",
                        classification: "Short-acting muscarinic antagonist (SAMA)",
                        moa: "Blocks muscarinic cholinergic receptors in the bronchi, leading to bronchodilation.",
                        therapeuticUses: "COPD, asthma (in combination with a SABA).",
                        adrs: "Dry mouth, headache, dizziness.",
                        contraindications: "Hypersensitivity to atropine or its derivatives.",
                        pharmaApplications: {
                            dosageForms: "Metered-dose inhaler, nebulizer solution.",
                            formulations: "Atrovent HFA.",
                            storage: "Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "HPLC, TLC.",
                            quantitative: "HPLC.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Has a slower onset than SABAs, often used in combination for severe asthma exacerbations.",
                    },
                ]
            }
        ]
      },
      {
        name: "Anti-asthmatics",
        subclasses: [
            {
                name: "Corticosteroids",
                drugs: [
                    {
                        name: "Beclomethasone",
                        classification: "Inhaled Corticosteroid (ICS)",
                        moa: "Reduces inflammation in the airways by inhibiting multiple inflammatory cell types and decreasing the production of inflammatory mediators.",
                        therapeuticUses: "Maintenance treatment of asthma.",
                        adrs: "Oral candidiasis (thrush), dysphonia (hoarse voice).",
                        contraindications: "Primary treatment of status asthmaticus.",
                        pharmaApplications: {
                            dosageForms: "Metered-dose inhaler (MDI).",
                            formulations: "Qvar RediHaler.",
                            storage: "Store at room temperature.",
                        },
                        analyticalMethods: {
                            qualitative: "HPLC.",
                            quantitative: "HPLC.",
                            pharmacopoeial: "USP, BP.",
                        },
                        specialNotes: "Patients should be counseled to rinse their mouth after use to prevent thrush. This is a 'preventer' medication.",
                    },
                ]
            },
            {
                name: "Leukotriene antagonists",
                drugs: []
            }
        ]
      },
      { name: "Anti-tussives & Expectorants", drugs: [] },
      { name: "Mucolytics", drugs: [] },
    ]
  },
];

    