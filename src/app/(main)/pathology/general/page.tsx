
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Microscope, ShieldAlert, Heart, GitBranch, Stethoscope, Dna, FileText, Bot, Book } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from "next/image";

const generalPathologyTopics = [
    {
        title: "Cellular Injury, Adaptation, and Death",
        icon: ShieldAlert,
        overview: "Cellular injury occurs when cells are exposed to stress beyond their adaptive capacity. This foundational topic explores how cells respond, from simple adaptations like changing size (atrophy/hypertrophy) or type (metaplasia), to injury (reversible/irreversible), and ultimately to cell death through necrosis or apoptosis.",
        detailedNotes: "Causes of cell injury include oxygen deprivation (hypoxia), chemical agents, infectious agents, immunological reactions, genetic factors, nutritional imbalances, and physical agents. The mechanisms involve ATP depletion, mitochondrial damage, influx of calcium, and membrane damage. Apoptosis is a tightly regulated energy-dependent process, whereas necrosis is a passive, pathological process that elicits inflammation.",
        visualLearning: {
            image: "https://picsum.photos/id/111/400/200",
            caption: "Histopathology of coagulative necrosis in the kidney, showing preserved cell outlines but loss of nuclei."
        },
        clinicalCorrelation: "A classic clinical example is Myocardial Infarction (heart attack), where lack of blood flow to a part of the heart muscle causes irreversible ischemic injury and coagulative necrosis.",
        pharmaApplication: "Understanding apoptosis pathways is crucial for cancer chemotherapy, where drugs are designed to induce apoptosis in malignant cells. Conversely, drugs that prevent apoptosis can be used to treat neurodegenerative diseases."
    },
    {
        title: "Inflammation (Acute and Chronic)",
        icon: Heart,
        overview: "Inflammation is the body's protective response to eliminate the initial cause of cell injury, clear out necrotic cells, and initiate tissue repair. It is divided into acute inflammation (rapid onset, short duration, characterized by neutrophils) and chronic inflammation (longer duration, involving lymphocytes and macrophages).",
        detailedNotes: "The five cardinal signs of acute inflammation are redness (rubor), swelling (tumor), heat (calor), pain (dolor), and loss of function (functio laesa). Key events include vasodilation, increased vascular permeability, and the migration of leukocytes from blood vessels to the site of injury (extravasation). Chemical mediators like histamine, prostaglandins, and cytokines orchestrate this process.",
        visualLearning: {
            image: "https://picsum.photos/id/112/400/200",
            caption: "A diagram showing the steps of leukocyte extravasation during acute inflammation."
        },
        clinicalCorrelation: "Appendicitis is a classic example of acute inflammation. Rheumatoid arthritis is a systemic autoimmune disease characterized by chronic inflammation of the joints.",
        pharmaApplication: "Non-steroidal anti-inflammatory drugs (NSAIDs) like Ibuprofen work by inhibiting the COX enzymes, thereby blocking prostaglandin synthesis and reducing inflammation and pain. Corticosteroids are potent anti-inflammatory agents with broad effects on inflammatory pathways."
    },
    {
        title: "Tissue Repair and Healing",
        icon: GitBranch,
        overview: "Tissue repair is the restoration of tissue architecture and function after an injury. It can occur by regeneration, where injured cells are replaced by cells of the same type, or by healing, which involves collagen deposition and scar formation. The outcome depends on the tissue's proliferative capacity and the extent of the injury.",
        detailedNotes: "The process of healing by scar formation involves inflammation, formation of granulation tissue (new blood vessels and fibroblasts), and remodeling of connective tissue. Growth factors like TGF-β are critical in stimulating fibroblast proliferation and collagen synthesis. Wound healing can be by first intention (e.g., a clean surgical incision) or second intention (e.g., a large, open wound).",
        visualLearning: {
            image: "https://picsum.photos/id/113/400/200",
            caption: "Microscopic view of granulation tissue, characterized by angiogenesis and a fibroblastic stroma."
        },
        clinicalCorrelation: "A surgical wound healing with minimal scarring is an example of healing by first intention. A large burn healing with a prominent scar and contracture is an example of second intention. Keloids are an example of excessive scar formation.",
        pharmaApplication: "Certain drugs, like corticosteroids, can impair wound healing by inhibiting inflammation and collagen synthesis. Understanding growth factors has led to the development of therapeutic agents that can promote healing in chronic wounds."
    },
    {
        title: "Neoplasia",
        icon: Dna,
        overview: "Neoplasia means 'new growth,' and the new growth is a neoplasm, or tumor. It represents uncontrolled cell proliferation. Neoplasms are divided into benign and malignant categories. Cancer is the common term for all malignant tumors. The study of neoplasia, oncology, is a critical field in medicine.",
        detailedNotes: "Malignant tumors are distinguished from benign tumors by their characteristics of anaplasia (lack of differentiation), invasiveness (ability to invade surrounding tissue), and metastasis (ability to spread to distant sites). The development of cancer is a multi-step process involving mutations in genes that regulate cell growth (oncogenes) and suppress tumors (tumor suppressor genes).",
         visualLearning: {
            image: "https://picsum.photos/id/114/400/200",
            caption: "Metastatic adenocarcinoma in a lymph node, showing glandular structures in a location where they don't belong."
        },
        clinicalCorrelation: "Lung cancer in a smoker is a common example of neoplasia linked to an environmental carcinogen. The spread of breast cancer to the axillary lymph nodes is an example of metastasis.",
        pharmaApplication: "Cancer chemotherapy targets rapidly dividing cells. Newer targeted therapies, like tyrosine kinase inhibitors (e.g., Imatinib), are designed to block the specific molecular pathways that are mutated in a particular cancer. Immunotherapies aim to stimulate the patient's own immune system to attack cancer cells."
    },
    {
        title: "Hemodynamic Disorders",
        icon: Stethoscope,
        overview: "This topic concerns diseases related to blood flow and the integrity of the circulatory system. It encompasses a spectrum of conditions from localized fluid imbalances like edema to systemic catastrophes like shock.",
        detailedNotes: "Key concepts include: Edema (excess fluid in interstitial spaces), Hyperemia (active increase in blood flow) vs. Congestion (passive decrease in blood outflow), Hemorrhage (extravasation of blood), Thrombosis (inappropriate clot formation), Embolism (intravascular solid, liquid, or gas mass carried by blood), Infarction (ischemic necrosis), and Shock (systemic hypoperfusion).",
         visualLearning: {
            image: "https://picsum.photos/id/115/400/200",
            caption: "A pulmonary thromboembolus lodged at the bifurcation of the pulmonary artery (saddle embolus)."
        },
        clinicalCorrelation: "Deep vein thrombosis (DVT) in the leg can lead to a life-threatening pulmonary embolism. An infarct in the brain causes an ischemic stroke. Septic shock is a form of systemic collapse due to a massive infection.",
        pharmaApplication: "Anticoagulants (e.g., Warfarin, Heparin) and antiplatelet agents (e.g., Aspirin) are used to prevent and treat thrombosis. Thrombolytic drugs (e.g., Alteplase) are used to dissolve existing clots in conditions like acute MI or stroke."
    }
];

function DetailSection({ title, content, icon: Icon }: { title: string, content: React.ReactNode, icon: React.ElementType }) {
    return (
        <div className="mt-4">
            <h4 className="font-semibold text-base mb-2 flex items-center gap-2"><Icon className="h-5 w-5 text-primary"/>{title}</h4>
            <div className="pl-7 text-muted-foreground text-sm space-y-2 border-l-2 border-primary/20 ml-2.5 pl-4 pb-2">{content}</div>
        </div>
    )
}


export default function GeneralPathologyPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">General Pathology</h1>
      <p className="text-muted-foreground mb-6">
        Core concepts of disease processes that are fundamental to understanding systemic pathology.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Fundamental Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {generalPathologyTopics.map((topic, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-background/50">
                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <topic.icon className="h-6 w-6 text-primary" />
                    {topic.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 space-y-4">
                  <DetailSection title="Overview" icon={FileText}>
                    <p>{topic.overview}</p>
                  </DetailSection>

                   <DetailSection title="Detailed Notes" icon={Book}>
                     <p>{topic.detailedNotes}</p>
                  </DetailSection>

                   <DetailSection title="Visual Learning" icon={Microscope}>
                    <div className="flex flex-col items-center">
                      <Image src={topic.visualLearning.image} alt={topic.visualLearning.caption} width={400} height={200} className="rounded-md border" />
                      <p className="text-xs italic mt-2">{topic.visualLearning.caption}</p>
                    </div>
                  </DetailSection>

                  <DetailSection title="Clinical & Pharmaceutical Correlation" icon={Stethoscope}>
                    <p><strong>Clinical:</strong> {topic.clinicalCorrelation}</p>
                    <p><strong>Pharma:</strong> {topic.pharmaApplication}</p>
                  </DetailSection>

                  <DetailSection title="Practice Questions & Revision" icon={Bot}>
                    <div className="flex gap-4">
                        <Button variant="outline" disabled>MCQs (Coming Soon)</Button>
                        <Button variant="outline" disabled>Flashcards (Coming Soon)</Button>
                    </div>
                  </DetailSection>

                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
