export type Tier = "free" | "premium";

export interface Book {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  tier: Tier;
  genre: string;
  // Cover palette (two oklch-friendly hex tones)
  palette: [string, string];
  chapters: { title: string; content: string }[];
  custom?: boolean;
}

const lorem = (paras: number, seed: string) => {
  const sentences = [
    `In the long shadow of the koppies, ${seed} carried the weight of a continent that refused to be still.`,
    `The marketplace hummed at dawn — voices in isiZulu, Sesotho, Afrikaans and English braided into one frayed rope.`,
    `Memory, here, is a currency. It is spent slowly, hoarded by elders, traded by poets, and counterfeited by politicians.`,
    `She walked past the corrugated roofs and thought of the rain — how it forgives nothing, and yet returns each season.`,
    `He wrote not to be read, but to be remembered; the page was a small homeland, portable and unbordered.`,
    `Outside, the highveld sky stretched like a stretched canvas, the kind painters in Joubert Park abandon for being too honest.`,
    `Liberation, the old man said, is not an event. It is a discipline practiced daily, in queues, in kitchens, in council chambers.`,
    `The taxi rank was a parliament of its own — louder, faster, and far more accountable than the one in Cape Town.`,
  ];
  return Array.from({ length: paras })
    .map((_, i) =>
      Array.from({ length: 4 })
        .map((_, j) => sentences[(i * 4 + j) % sentences.length])
        .join(" "),
    )
    .join("\n\n");
};

const chap = (titles: string[], seed: string) =>
  titles.map((t) => ({ title: t, content: lorem(5, seed) }));

export const SEED_BOOKS: Book[] = [
  {
    id: "socialism-nomuntu-omusha",
    title: "Socialism Nomuntu Omusha",
    author: "Thabo M. Sithole",
    synopsis:
      "A bracing meditation on collective futures, written from the kitchen tables of Soweto and the lecture halls of Wits.",
    tier: "free",
    genre: "Political Essay",
    palette: ["#1b1d22", "#c79049"],
    chapters: chap(
      ["I. The Inheritance", "II. A New Person", "III. The Common Table", "IV. After the Slogan"],
      "Socialism",
    ),
  },
  {
    id: "echoes-of-the-karoo",
    title: "Echoes of the Karoo",
    author: "Nadia van Wyk",
    synopsis:
      "Twelve interlinked stories charting drought, devotion, and the slow erosion of a sheep-farming dorp.",
    tier: "premium",
    genre: "Literary Fiction",
    palette: ["#8a5a2b", "#e9d3a8"],
    chapters: chap(
      ["The Dry Year", "The Letter from Beaufort West", "Windpump Sermons", "What the Aloe Knew"],
      "Karoo",
    ),
  },
  {
    id: "voices-of-gauteng",
    title: "Voices of Gauteng",
    author: "Lerato Mokoena",
    synopsis:
      "An anthology of working-class poetry from the City of Gold — minibus drivers, nurses, and night-shift welders.",
    tier: "premium",
    genre: "Poetry",
    palette: ["#2b2e36", "#d4a24c"],
    chapters: chap(
      ["I. M1 South", "II. Hillbrow at Three", "III. Mineworker's Lullaby", "IV. After Knock-Off"],
      "Gauteng",
    ),
  },
  {
    id: "soweto-rhythms",
    title: "Soweto Rhythms",
    author: "Sipho Dlamini",
    synopsis:
      "A jazz historian's love letter to Orlando, Dube and the shebeens that taught a country how to listen.",
    tier: "premium",
    genre: "Cultural History",
    palette: ["#3a1f1a", "#e6a14a"],
    chapters: chap(
      ["Before the Stage", "The Pennywhistle Years", "Brenda, Always Brenda", "A New Standard"],
      "Soweto",
    ),
  },
  {
    id: "modern-african-prose",
    title: "Modern African Prose",
    author: "Dr. Amara Okeke",
    synopsis:
      "A scholarly survey of post-2000 African novelists, with extended readings of South African voices.",
    tier: "premium",
    genre: "Criticism",
    palette: ["#1a2a2f", "#cba055"],
    chapters: chap(
      ["The Continental Turn", "Form After Apartheid", "Translating the Self", "Toward a New Canon"],
      "Prose",
    ),
  },
  {
    id: "table-mountain-letters",
    title: "Table Mountain Letters",
    author: "Petrus Hendricks",
    synopsis:
      "Correspondence between a Cape Town architect and his estranged daughter in Johannesburg, spanning a decade.",
    tier: "premium",
    genre: "Epistolary Novel",
    palette: ["#22323a", "#d8b46a"],
    chapters: chap(
      ["Spring, 2013", "A Question of Foundations", "What You Said in Braamfontein", "Coming Home"],
      "Cape",
    ),
  },
  {
    id: "drum-and-thread",
    title: "Drum and Thread",
    author: "Zandile Khumalo",
    synopsis:
      "A novella tracing three generations of Zulu beadworkers, and the patterns they could never explain out loud.",
    tier: "premium",
    genre: "Literary Fiction",
    palette: ["#2e1b2a", "#d49a55"],
    chapters: chap(
      ["The First Pattern", "What Gogo Refused", "Ulwandle", "Threading Forward"],
      "Beadwork",
    ),
  },
  {
    id: "robben-island-notebooks",
    title: "The Robben Island Notebooks",
    author: "Mandla Khoza",
    synopsis:
      "Reconstructed marginalia from a political prisoner's library — a meditation on reading as resistance.",
    tier: "premium",
    genre: "Memoir",
    palette: ["#1d242c", "#c89249"],
    chapters: chap(
      ["The Library Cart", "Underlined in Pencil", "What the Censor Missed", "After Release"],
      "Island",
    ),
  },
  {
    id: "highveld-stories",
    title: "Highveld Stories",
    author: "Boipelo Tau",
    synopsis:
      "Short fiction from the maize belt — small towns, big skies, and the quiet revolutions of farm workers.",
    tier: "premium",
    genre: "Short Stories",
    palette: ["#2a2618", "#e2b257"],
    chapters: chap(
      ["The Combine", "Sundays in Bethal", "The New Foreman", "A Long Drive Home"],
      "Highveld",
    ),
  },
  {
    id: "ubuntu-economics",
    title: "Ubuntu Economics",
    author: "Prof. Sibongile Mthembu",
    synopsis:
      "A field-shaping argument for an African moral economy, written for policymakers and citizens alike.",
    tier: "premium",
    genre: "Economics",
    palette: ["#1f2a24", "#caa057"],
    chapters: chap(
      ["I Am Because We Are", "Markets and Kinship", "A Budget for Belonging", "The Long Reform"],
      "Ubuntu",
    ),
  },
];

export const PREFERENCE_OPTIONS = [
  "Fiction",
  "Poetry",
  "Politics",
  "History",
  "Memoir",
  "Economics",
  "Short Stories",
  "Criticism",
];

export const PREMIUM_PRICE = "R149.99/pm";
