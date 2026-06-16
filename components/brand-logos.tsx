import React from "react";
import { siPython, siOpenjdk, siDotnet, siNodedotjs, siPhp } from "simple-icons";

// Real brand SVGs (Simple Icons) for the supported languages, tuned for the dark theme.
const LANGS = [
  { name: "Python", icon: siPython, color: "#4B8BBE" },
  { name: "Java", icon: siOpenjdk, color: "#E8E8E8" },
  { name: ".NET", icon: siDotnet, color: "#9B7DF6" },
  { name: "Node.js", icon: siNodedotjs, color: "#5FA04E" },
  { name: "PHP", icon: siPhp, color: "#9AA0DC" },
];

function Mark({ icon, name, color }: { icon: { path: string }; name: string; color: string }) {
  return (
    <div className="flex select-none items-center gap-2.5 opacity-70 transition-opacity duration-300 hover:opacity-100">
      <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-7 md:w-7" fill={color} aria-hidden="true">
        <path d={icon.path} />
      </svg>
      <span className="text-base font-semibold text-foreground/80 md:text-lg">{name}</span>
    </div>
  );
}

export const LANGUAGE_LOGOS: React.FC[] = LANGS.map((l) => {
  const C = () => <Mark icon={l.icon} name={l.name} color={l.color} />;
  C.displayName = `Logo_${l.name}`;
  return C;
});
