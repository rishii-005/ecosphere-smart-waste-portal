import { BatteryCharging, Beef, Cpu, Leaf, Newspaper, Recycle, ShieldCheck } from "lucide-react";
import type { WasteType } from "../types";

export const wasteGuides: Array<{
  type: WasteType;
  title: string;
  icon: typeof Recycle;
  image: string;
  tips: string[];
}> = [
  {
    type: "plastic",
    title: "Plastic",
    icon: Recycle,
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=900&q=80",
    tips: ["Rinse bottles before pickup.", "Flatten containers to save space.", "Keep soft plastic separate."]
  },
  {
    type: "organic",
    title: "Organic",
    icon: Beef,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    tips: ["Avoid plastic liners.", "Compost vegetable scraps.", "Keep wet waste covered."]
  },
  {
    type: "e-waste",
    title: "E-waste",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80",
    tips: ["Remove personal data.", "Never mix batteries with wet waste.", "Use authorized drop-off centers."]
  },
  {
    type: "paper",
    title: "Paper",
    icon: Newspaper,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    tips: ["Keep paper dry.", "Remove food-stained items.", "Bundle newspapers together."]
  },
  {
    type: "glass",
    title: "Glass",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=900&q=80",
    tips: ["Do not break bottles.", "Wrap sharp pieces safely.", "Separate from ceramics."]
  },
  {
    type: "metal",
    title: "Metal",
    icon: BatteryCharging,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
    tips: ["Clean cans lightly.", "Compress where possible.", "Keep hazardous cans separate."]
  }
];

export const sustainablePractices = [
  { icon: Leaf, title: "Buy less packaging", text: "Carry reusable bottles, bags, and containers." },
  { icon: Recycle, title: "Sort at source", text: "Separate wet, dry, sanitary, and hazardous waste daily." },
  { icon: ShieldCheck, title: "Handle safely", text: "Label sharp, medical, battery, and chemical waste clearly." }
];
