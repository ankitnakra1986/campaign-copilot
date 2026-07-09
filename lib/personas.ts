export type Role = "vp" | "manager" | "legal";

export interface Persona {
  role: Role;
  name: string;
  title: string;
  initial: string;
  landing: string;
  blurb: string;
}

export const DIANE: Persona = {
  role: "vp",
  name: "Diane",
  title: "VP, Campaign Management",
  initial: "D",
  landing: "/overview",
  blurb: "See the business impact and what needs a decision.",
};

export const MARIA: Persona = {
  role: "manager",
  name: "Maria",
  title: "Campaign Manager",
  initial: "M",
  landing: "/inbox",
  blurb: "Pick up today's brief in Slack and ship the campaign.",
};

export const SAM: Persona = {
  role: "legal",
  name: "Sam Ortiz",
  title: "Legal Counsel",
  initial: "S",
  landing: "/legal",
  blurb: "See the whole email — sign off on the one line we flagged.",
};

export const PERSONAS: Persona[] = [DIANE, MARIA, SAM];

export function personaForRole(role: Role): Persona {
  return PERSONAS.find((p) => p.role === role) ?? DIANE;
}

// Which chair are you sitting in on this screen? Simulated roles, not real auth.
export function personaForPath(path: string): Persona {
  if (path.startsWith("/legal")) return SAM;
  if (path.startsWith("/inbox") || path.startsWith("/campaign/")) return MARIA;
  if (path === "/overview" || path === "/campaigns" || path === "/memory") return DIANE;
  return DIANE;
}
