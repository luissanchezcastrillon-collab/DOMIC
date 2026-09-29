"use client";

import { useEffect, useRef, useState } from "react";
import { createMotocarroEngine } from "../lib/motocarroEngine";

type Phase = "wait" | "pull" | "parked" | "done";

const LETTERS = [
  { char: "d", delay: 0.5 },
  { char: "o", delay: 0.4 },
  { char: "m", delay: 0.3 },
  { char: "i", delay: 0.2 },
  { char: "c", delay: 0.1 },
];

const PULL_MS = 1100;
const EXIT_MS = 1600;

type Props = {
  /** Se llama cuando el motocarro termina de pasar */
  onComplete?: () => void;
};

export default function BrandBannerIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("wait");
  const phaseRef = useRef<Phase>("wait");
  const doneRef = useRef(false);
  const engineRef = useRef<ReturnType<typeof createMotocarroEngine> | null>(
    null
  );

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    engineRef.current = createMotocarroEngine();
    return () => {
      engineRef.current?.stop(100);
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const t0 = setTimeout(() => setPhase("pull"), 700);
    const t1 = setTimeout(() => setPhase("parked"), 700 + PULL_MS);
    const t2 = setTimeout(() => setPhase("done"), 700 + PULL_MS + EXIT_MS);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase !== "done" || doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  }, [phase, onComplete]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (phase === "pull") {
      void engine.start();

      const onUnlock = () => {
        if (phaseRef.current === "pull" || phaseRef.current === "parked") {
          void engine.start();
        }
      };
      window.addEventListener("pointerdown", onUnlock, { once: true });
      return () => {
        window.removeEventListener("pointerdown", onUnlock);
      };
    }

    if (phase === "parked") {
      const t = setTimeout(() => engine.stop(100), Math.round(EXIT_MS * 0.85));
      return () => clearTimeout(t);
    }

    if (phase === "done") {
      engine.stop(0);
    }
  }, [phase]);

  const showRoad = phase !== "done";
  const showTrail = phase === "pull" || phase === "parked";
  const lettersLive = phase === "pull" || phase === "parked" || phase === "done";

  return (
    <div className="brand-stage">
      {showRoad ? (
        <div className="vehiculo-overlay" aria-hidden="true">
          <div className="vehiculo-lane">
            <div className="brand-road-line" />
          </div>
        </div>
      ) : null}

      <div
        className={
          phase === "wait"
            ? "pull-unit pull-unit--wait"
            : phase === "pull"
              ? "pull-unit pull-unit--pull"
              : "pull-unit pull-unit--parked"
        }
      >
        {lettersLive ? (
          <h1
            className={`brand brand--hero brand--drop${
              phase === "pull" ? " brand--pulling" : " brand--resting"
            }`}
            aria-label="domic"
          >
            {LETTERS.map(({ char, delay }) => (
              <span
                key={char}
                className={
                  phase === "pull"
                    ? "brand-letter"
                    : "brand-letter brand-letter--shown"
                }
                style={
                  phase === "pull"
                    ? { animationDelay: `${delay}s` }
                    : undefined
                }
              >
                {char}
              </span>
            ))}
          </h1>
        ) : null}

        {showTrail ? (
          <div
            className={`banner-trail${
              phase === "parked" ? " banner-trail--continue" : ""
            }`}
          >
            <div
              className={`banner-tow-rope${
                phase === "parked" ? " banner-tow-rope--fade" : ""
              }`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="motocarro" src="/motocarro.png?v=21" alt="" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
