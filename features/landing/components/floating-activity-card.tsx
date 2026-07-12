"use client";

import { m } from "motion/react";

type FloatingCard = {
  icon: string;
  text: string;
  x: number;
  y: number;
  delay: number;
};

const cards: FloatingCard[] = [
  {
    icon: "🎯",
    text: "Study session completed \u00b7 45 min",
    x: -60,
    y: -20,
    delay: 0.5,
  },
  {
    icon: "\u2713",
    text: "Task completed \u00b7 Authentication setup",
    x: 40,
    y: 40,
    delay: 1.2,
  },
];

export function FloatingActivityCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:flex" aria-hidden="true">
      {cards.map((card, index) => (
        <m.div
          key={index}
          className="absolute flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-2.5 shadow-lg shadow-slate-950/5 backdrop-blur"
          style={{
            left: `calc(50% + ${card.x}px)`,
            top: `calc(50% + ${card.y}px)`,
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: 1,
            y: [0, -6, 0],
            transition: {
              opacity: { duration: 0.5, delay: card.delay + 0.5 },
              y: {
                duration: 5,
                delay: card.delay + 1,
                repeat: Infinity,
                ease: "easeInOut",
              },
            },
          }}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
            {card.icon}
          </span>
          <span className="text-xs font-medium whitespace-nowrap text-slate-600">{card.text}</span>
        </m.div>
      ))}
    </div>
  );
}
