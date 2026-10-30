import type { ComponentType, HTMLAttributes, RefObject } from "react";

export interface LaserFlowProps extends HTMLAttributes<HTMLDivElement> {
  surfaceRef?: RefObject<HTMLElement | null>;
  color?: string;
  beamPosition?: number;
  intensity?: number;
  dpr?: number;
}

export const LaserFlow: ComponentType<LaserFlowProps>;
export default LaserFlow;
