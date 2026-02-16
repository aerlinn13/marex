"use client";

import type { LearningArticle } from "@/lib/learning-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LearningModalProps {
  article: LearningArticle | null;
  open: boolean;
  onClose: () => void;
}

export function LearningModal({ article, open, onClose }: LearningModalProps) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto border-marex-border-subtle bg-marex-bg-panel">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-marex-accent-purple/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-marex-accent-purple">
              {article.category}
            </span>
          </div>
          <DialogTitle className="text-base text-foreground">
            {article.title}
          </DialogTitle>
          <DialogDescription className="text-base text-marex-accent-purple/80 font-medium mt-1">
            {article.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-base text-muted-foreground leading-relaxed">
          {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {article.keyTerms && article.keyTerms.length > 0 && (
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-3 space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Key Terms
            </h4>
            {article.keyTerms.map((kt) => (
              <div key={kt.term} className="text-sm">
                <span className="font-semibold text-foreground">{kt.term}</span>
                <span className="text-muted-foreground"> — {kt.definition}</span>
              </div>
            ))}
          </div>
        )}

        {article.realWorldExample && (
          <div className="rounded border-l-2 border-marex-accent-purple bg-marex-accent-purple/5 p-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-marex-accent-purple mb-1">
              Real-World Example
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {article.realWorldExample}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
