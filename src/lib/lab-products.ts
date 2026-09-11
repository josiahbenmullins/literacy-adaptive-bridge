export type LABProductStatus =
  | "available"
  | "next-in-queue"
  | "coming-soon"
  | "planned";

export type LABProductGroup =
  | "Koine / Biblical Greek"
  | "Ancient Greek"
  | "Latin"
  | "Biblical Hebrew";

export type LABProduct = {
  id: string;
  name: string;
  corpus: string;
  group: LABProductGroup;
  status: LABProductStatus;
  code: string;
  description: string;
  facts?: string;
  basicCopy?: string;
  url?: string;
  emblem?: string;
  showOnHome?: boolean;
};

export const labProductGroups: LABProductGroup[] = [
  "Koine / Biblical Greek",
  "Ancient Greek",
  "Latin",
  "Biblical Hebrew",
];

export const labProductStatusLabels: Record<LABProductStatus, string> = {
  available: "Available",
  "next-in-queue": "Next in queue",
  "coming-soon": "Coming soon",
  planned: "Planned",
};

export function labProductVisualStatus(status: LABProductStatus) {
  if (status === "available") return "available";
  if (status === "planned") return "planned";

  return "coming-soon";
}

export const labProducts: LABProduct[] = [
  {
    id: "gnt",
    name: "GNT LAB",
    corpus: "Greek New Testament",
    group: "Koine / Biblical Greek",
    status: "available",
    code: "GNT",
    emblem: "/gnt-lab-symbol.png",
    url: "https://gnt.literacyadaptivebridge.com",
    facts: "27 books · 260 chapters",
    description:
      "Read the Greek New Testament at your own vocabulary level with adaptive Greek/English display, word study, vocabulary tools, and manual word selection.",
    basicCopy:
      "GNT LAB Basic includes John 1–3, Acts 1–3, and Romans 1–3 with the complete reader feature set.",
    showOnHome: true,
  },
  {
    id: "lxx",
    name: "LXX LAB",
    corpus: "Septuagint",
    group: "Koine / Biblical Greek",
    status: "next-in-queue",
    code: "LXX",
    description:
      "Adaptive reading of the ancient Greek translation of the Hebrew Scriptures.",
    showOnHome: true,
  },
  {
    id: "apostolic-fathers",
    name: "Apostolic Fathers LAB",
    corpus: "Apostolic Fathers",
    group: "Koine / Biblical Greek",
    status: "coming-soon",
    code: "AF",
    description:
      "Adaptive reading of the early Christian Greek writings traditionally collected as the Apostolic Fathers.",
    showOnHome: true,
  },
  {
    id: "iliad",
    name: "Iliad LAB",
    corpus: "Homer's Iliad",
    group: "Ancient Greek",
    status: "planned",
    code: "ΙΛ",
    description: "Adaptive reading of Homer's Iliad in ancient Greek.",
    showOnHome: true,
  },
  {
    id: "odyssey",
    name: "Odyssey LAB",
    corpus: "Homer's Odyssey",
    group: "Ancient Greek",
    status: "planned",
    code: "ΟΔ",
    description: "Adaptive reading of Homer's Odyssey in ancient Greek.",
  },
  {
    id: "epictetus",
    name: "Epictetus LAB",
    corpus: "Epictetus",
    group: "Ancient Greek",
    status: "planned",
    code: "ΕΠ",
    description:
      "Adaptive reading of the Discourses, Enchiridion, and related Greek texts of Epictetus.",
  },
  {
    id: "marcus-aurelius",
    name: "Marcus Aurelius LAB",
    corpus: "Marcus Aurelius",
    group: "Ancient Greek",
    status: "planned",
    code: "ΜΑ",
    description:
      "Adaptive reading of the Meditations in its original Greek.",
  },
  {
    id: "vulgate",
    name: "Vulgate LAB",
    corpus: "Latin Vulgate",
    group: "Latin",
    status: "planned",
    code: "VG",
    description: "Adaptive reading of the Latin Bible.",
  },
  {
    id: "virgil",
    name: "Virgil LAB",
    corpus: "Virgil",
    group: "Latin",
    status: "planned",
    code: "VR",
    description: "Adaptive reading of Virgil's Latin works.",
  },
  {
    id: "hebrew-old-testament",
    name: "Hebrew Old Testament LAB",
    corpus: "Hebrew Old Testament",
    group: "Biblical Hebrew",
    status: "planned",
    code: "תנ״ך",
    description:
      "Adaptive reading of the Hebrew Scriptures in Biblical Hebrew.",
  },
];
