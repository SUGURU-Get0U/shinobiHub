import type { ComponentType, ReactNode } from "react";
import { Link } from "expo-router";
interface CardNavProps {
  logo?: ReactNode;
  logoAlt?: string;
  logoHref?: string;
  items: { label: string; links: { label: string; href: string }[] }[];
  linkComponent?: typeof Link;
  theme?: string;
  surface?: string;
  maxWidth?: number;
  ariaLabel?: string;
}
declare const CardNav: ComponentType<CardNavProps>;
export default CardNav;
