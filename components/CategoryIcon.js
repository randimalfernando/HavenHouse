import {
  LifeBuoy,
  Home,
  Baby,
  Briefcase,
  HeartHandshake,
  Brain,
  Shield,
  Church,
  Accessibility,
} from "lucide-react";

const ICONS = {
  crisis_line: LifeBuoy,
  accommodation: Home,
  hh_kids: Baby,
  jobs_program: Briefcase,
  social_work: HeartHandshake,
  psychological_support: Brain,
  antisemitism_resources: Shield,
  chaplaincy: Church,
  ndis: Accessibility,
};

export default function CategoryIcon({ category, size = 22 }) {
  const Icon = ICONS[category] || HeartHandshake;

  return (
    <span className="category-icon-badge">
      <Icon size={size} strokeWidth={1.8} />
    </span>
  );
}