"use client";

import type { ReactNode } from "react";
import { MunicipioProvider } from "./MunicipioProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return <MunicipioProvider>{children}</MunicipioProvider>;
}
