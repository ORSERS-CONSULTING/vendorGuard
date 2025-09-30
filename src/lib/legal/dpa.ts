// src/lib/legal/dpa.ts
export const DPA_META = {
  version: "1.0",
  effectiveDate: "17 Sep 2025",
  lastUpdated: "16 Sep 2025",
  processor: "VendorGuard, a product of OSRERS CONSULTING FZ LLC",
  controllerPlaceholder: "[Your Company Legal Name]",
  governingLawPlaceholder: "[Governing Law/Jurisdiction]",
  subProcessorsLinkPlaceholder: "[Link to Sub-Processors list]",
  legalEmailPlaceholder: "[legal@yourcompany.com]"
};

export type DpaSection = {
  id: string;          // anchor id
  title: string;
  body: string[];      // paragraphs (plain text)
  bullets?: string[];  // optional bullet list
};

export const DPA_SECTIONS: DpaSection[] = [
  {
    id: "definitions",
    title: "1. Definitions",
    body: [
      `"Applicable Data Protection Laws" means all privacy and data protection laws that apply to the Processing, including the EU GDPR, UK GDPR, and relevant national laws.`,
      `"Personal Data" means any information relating to an identified or identifiable natural person processed under this DPA.`,
      `"Processing" means any operation performed on Personal Data (e.g., collection, storage, use, disclosure, deletion).`,
      `"Sub-Processors" means any third party engaged by the Processor to process Personal Data for the Controller.`,
      `"Personal Data Breach" means a breach of security leading to accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to Personal Data.`
    ]
  },
  {
    id: "subject-matter",
    title: "2. Subject Matter & Purpose",
    body: [
      "The Processor shall process Personal Data solely for: (i) providing, maintaining, and supporting the VendorGuard platform and related services; (ii) performing administrative, support, security, analytics, and billing functions ancillary to such services; and (iii) complying with the Controller’s documented instructions consistent with this DPA."
    ]
  },
  {
    id: "term",
    title: "3. Term & Termination",
    body: [
      "This DPA is effective from the Effective Date and remains in force until all Processing of Personal Data for the Controller ceases and all Personal Data is returned or deleted under Section 11."
    ]
  },
  {
    id: "controller-resp",
    title: "4. Controller Responsibilities",
    body: [
      "The Controller shall:",
    ],
    bullets: [
      "Determine the purposes and means of Processing and ensure a lawful basis for Processing Personal Data.",
      "Provide accurate, up-to-date Personal Data and ensure data is collected and shared lawfully.",
      "Provide documented instructions; refrain from instructing Processing that would contravene Applicable Data Protection Laws."
    ]
  },
  {
    id: "processor-obligations",
    title: "5. Processor Obligations",
    body: [
      "The Processor shall process only on documented instructions from the Controller, including with respect to international transfers, and implement appropriate technical and organizational security measures (Section 8).",
      "The Processor shall notify the Controller without undue delay, and where feasible within 72 hours, upon becoming aware of a Personal Data Breach (Section 10) and assist with related obligations.",
      "The Processor shall make available information necessary to demonstrate compliance and, subject to Section 12, allow audits."
    ]
  },
  {
    id: "sub-processors",
    title: "6. Sub-Processors",
    body: [
      "The Controller authorizes the Processor to engage Sub-Processors for the provision of the services, provided that:",
    ],
    bullets: [
      "The Processor shall impose data protection obligations on Sub-Processors no less protective than those in this DPA.",
      `A current list of Sub-Processors is maintained at ${DPA_META.subProcessorsLinkPlaceholder}; the Processor will notify the Controller of material changes, giving a reasonable opportunity to object on justified grounds.`,
      "The Processor remains responsible for Sub-Processors’ performance of their obligations."
    ]
  },
  {
    id: "intl-transfers",
    title: "7. International Transfers",
    body: [
      "Where Personal Data is transferred outside the Controller’s jurisdiction, the Processor shall ensure appropriate safeguards, including execution of the EU/UK Standard Contractual Clauses or other valid transfer mechanisms, and will implement supplementary measures where required."
    ]
  },
  {
    id: "security-measures",
    title: "8. Security Measures",
    body: [
      "The Processor maintains technical and organizational measures appropriate to the risk, which include (as applicable):"
    ],
    bullets: [
      "Encryption of Personal Data in transit and at rest;",
      "Access controls following least-privilege principles and MFA for administrative access;",
      "Segmentation, logging, and monitoring of access and system events;",
      "Secure software development lifecycle, vulnerability management, and regular penetration testing;",
      "Backup, disaster recovery, and business continuity procedures;",
      "Employee security training and confidentiality undertakings."
    ]
  },
  {
    id: "data-subject-rights",
    title: "9. Data Subject Rights",
    body: [
      "The Processor shall assist the Controller, insofar as possible, to fulfil requests from data subjects to exercise rights under Applicable Data Protection Laws (access, rectification, erasure, restriction, portability, objection), taking into account the nature of the Processing and information available to the Processor."
    ]
  },
  {
    id: "personal-data-breach",
    title: "10. Personal Data Breach",
    body: [
      "Upon becoming aware of a Personal Data Breach, the Processor shall notify the Controller without undue delay, and where feasible, within 72 hours. Such notice will include the nature of the breach, categories and approximate number of data subjects and records concerned, likely consequences, and measures taken or proposed to address the breach and mitigate adverse effects."
    ]
  },
  {
    id: "return-deletion",
    title: "11. Return & Deletion",
    body: [
      "Upon termination or upon the Controller’s written instruction, the Processor shall, at the Controller’s choice, securely delete or return all Personal Data and delete existing copies, unless storage is required by law. Where deletion is not feasible, the Processor will continue to protect Personal Data in accordance with this DPA and limit further Processing."
    ]
  },
  {
    id: "audit",
    title: "12. Audit & Information",
    body: [
      "The Processor shall make available information reasonably necessary to demonstrate compliance with this DPA and shall allow for and contribute to audits, including inspections, conducted by the Controller or an auditor mandated by the Controller, on reasonable prior notice, during normal business hours, not more than once annually (unless required by a supervisory authority or following a material Personal Data Breach), subject to confidentiality and security requirements."
    ]
  },
  {
    id: "law",
    title: "13. Governing Law & Jurisdiction",
    body: [
      `This DPA is governed by the laws of ${DPA_META.governingLawPlaceholder}. The courts of ${DPA_META.governingLawPlaceholder} shall have exclusive jurisdiction over any dispute arising from or relating to this DPA, subject to any mandatory rights of either Party to seek relief from competent supervisory authorities.`
    ]
  },
  {
    id: "misc",
    title: "14. Miscellaneous",
    body: [
      "Order of Precedence. If there is a conflict between this DPA and the master agreement, this DPA prevails with respect to data protection matters.",
      "Amendments. The Processor may update this DPA to reflect changes in law or service; material changes will be notified to the Controller.",
      "Severability. If any provision is held invalid, the remaining provisions remain in full force.",
      `Records. The Processor will record the version, timestamp, and IP of any user who accepted this DPA.`,
      `Version: ${DPA_META.version} — Effective: ${DPA_META.effectiveDate}. For historical versions, contact ${DPA_META.legalEmailPlaceholder}.`
    ]
  }
];

export const FOOTER_NOTE = `© 2025 ${DPA_META.controllerPlaceholder}. All rights reserved.`;
