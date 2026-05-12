import { GlobalSettings, IndexItem } from "./types";

export const FONTS = [
  "Inter",
  "Space Grotesk",
  "Playfair Display",
  "JetBrains Mono",
  "Outfit",
  "Anton",
  "Cormorant Garamond",
  "Libre Baskerville",
  "Syne",
  "Bungee",
  "Unbounded",
  "Montserrat",
  "Georgia",
  "Courier New"
];

export const DEFAULT_SETTINGS: GlobalSettings = {
  fontFamily: "Inter",
  primaryColor: "#4f46e5",
  backgroundColor: "#ffffff",
  textColor: "#1e293b",
  borderRadius: "12px",
  spacing: "24px",
  showDividers: true,
  theme: "minimal",
  itemShape: "rounded",
  titleFontSize: "1.125rem",
  subtitleFontSize: "0.875rem",
  iconSize: "2.5rem",
  borderStyle: "solid",
  bgType: "solid",
  bgGradient: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
  animationType: "fade"
};

export const INITIAL_DATA: IndexItem[] = [
  {
    id: "1",
    title: "Benvenuti nel corso",
    subtitle: "Introduzione e setup",
    icon: "👋",
    url: "#intro",
    children: [
      {
        id: "1-1",
        title: "Lezione 1: Installazione",
        url: "/lesson-1",
        children: [],
        isOpen: false,
        icon: "💻"
      },
      {
        id: "1-2",
        title: "Lezione 2: Primi passi",
        url: "/lesson-2",
        children: [],
        isOpen: false,
        icon: "🚀"
      }
    ],
    isOpen: true
  },
  {
    id: "2",
    title: "Capitolo 2: Concetti Avanzati",
    icon: "🧠",
    url: "#advanced",
    children: [],
    isOpen: false
  }
];
