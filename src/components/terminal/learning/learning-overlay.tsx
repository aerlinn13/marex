"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTerminalState } from "@/hooks/use-terminal-state";
import { LEARNING_CONTENT, type LearningArticle } from "@/lib/learning-content";
import { LearningModal } from "./learning-modal";
import { GraduationCap } from "lucide-react";

export function LearningOverlay() {
  const { learningMode, setLearningMode } = useTerminalState();
  const [article, setArticle] = useState<LearningArticle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!learningMode) return;

      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-learn]");
      if (!target) return;

      const key = target.getAttribute("data-learn");
      if (!key) return;

      const found = LEARNING_CONTENT[key];
      if (!found) return;

      e.preventDefault();
      e.stopPropagation();

      setArticle(found);
      setModalOpen(true);
    },
    [learningMode]
  );

  useEffect(() => {
    if (!learningMode) return;

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [learningMode, handleClick]);

  return (
    <>
      {learningMode && (
        <style>{`
          [data-learn] {
            cursor: help !important;
            transition: outline 0.15s ease, box-shadow 0.15s ease;
          }
          [data-learn]:hover {
            outline: 2px solid #7b42f6;
            outline-offset: 2px;
            box-shadow: 0 0 12px rgba(123, 66, 246, 0.3);
          }
        `}</style>
      )}

      {/* Floating toggle — portaled to body so react-remove-scroll can't block it */}
      {mounted &&
        createPortal(
          <button
            data-no-dismiss
            className={`fixed bottom-4 right-4 z-[60] pointer-events-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              learningMode
                ? "bg-marex-accent-purple text-white shadow-lg shadow-marex-accent-purple/30"
                : "bg-marex-bg-panel border border-marex-border-subtle text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setLearningMode(!learningMode)}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Learn
          </button>,
          document.body
        )}

      <LearningModal
        article={article}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
