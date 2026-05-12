export type IndexItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string; // Emoji or Lucide icon name
  url?: string;
  isExternal?: boolean;
  color?: string;
  fontSize?: string;
  children: IndexItem[];
  isOpen: boolean;
};

export type GlobalSettings = {
  fontFamily: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  spacing: string;
  showDividers: boolean;
  theme: 'minimal' | 'technical' | 'editorial' | 'brutalist' | 'atmospheric';
  itemShape: 'square' | 'rounded' | 'pill' | 'skew' | 'organic';
  titleFontSize: string;
  subtitleFontSize: string;
  iconSize: string;
  borderStyle: 'solid' | 'dashed' | 'double' | 'dotted';
  bgType: 'solid' | 'gradient' | 'mesh';
  bgGradient: string;
  animationType: 'none' | 'fade' | 'slide' | 'bounce' | 'zoom';
};
