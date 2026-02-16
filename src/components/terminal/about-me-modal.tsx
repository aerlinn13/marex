"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Landmark,
  CreditCard,
  ShieldCheck,
  GitBranch,
  Users,
  MessageSquare,
  RefreshCw,
  Video,
  CheckCircle2,
  Server,
  Heart,
  Shield,
  Handshake,
  GraduationCap,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AboutMeModalProps {
  open: boolean;
  onClose: () => void;
}

function Tile({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-4 min-h-[8rem]">
      <Icon className="h-5 w-5 text-marex-accent-purple mb-2" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
        {description}
      </p>
    </div>
  );
}

export function AboutMeModal({ open, onClose }: AboutMeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-marex-border-subtle bg-marex-bg-panel">
        <DialogHeader>
          <DialogTitle className="text-base text-foreground">
            Danil Chernyshev — Marex Capital Markets, Global Payments
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Why I&apos;m the right fit for this role
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="fintech">
          <TabsList className="h-7 bg-transparent p-0">
            <TabsTrigger value="fintech" className="h-6 px-3 text-xs">
              Fintech Experience
            </TabsTrigger>
            <TabsTrigger value="realtime" className="h-6 px-3 text-xs">
              Realtime &amp; Messaging
            </TabsTrigger>
            <TabsTrigger value="values" className="h-6 px-3 text-xs">
              Values Alignment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fintech">
            <div className="grid grid-cols-2 gap-3">
              <Tile
                icon={Landmark}
                title="Core Banking Platform"
                description="4 years with React, TypeScript, Redux Toolkit — powered Chase UK's expansion to 2.5M customers"
              />
              <Tile
                icon={CreditCard}
                title="Financial Products"
                description="Credit/debit interest, credit cards, fees & rewards, suspense accounts, index rates"
              />
              <Tile
                icon={ShieldCheck}
                title="Regulatory Compliance"
                description="Partnered with SecOps for ISO 27001 certification and FCA compliance"
              />
              <Tile
                icon={GitBranch}
                title="CI/CD & Observability"
                description="Jenkins pipelines, New Relic and Coralogix monitoring integration"
              />
              <Tile
                icon={Users}
                title="Engineering Mentorship"
                description="Mentored 4 junior engineers, established standards and best practices"
              />
            </div>
          </TabsContent>

          <TabsContent value="realtime">
            <div className="grid grid-cols-2 gap-3">
              <Tile
                icon={MessageSquare}
                title="Sea/Chat Platform"
                description="Owned a real-time messaging platform — the maritime industry's Slack"
              />
              <Tile
                icon={RefreshCw}
                title="Framework Migration"
                description="Led full Aurelia.js to React/Redux/TypeScript migration in 4 months"
              />
              <Tile
                icon={Video}
                title="Video Calling"
                description="Built Twilio SDK video calling feature from scratch in 2 weeks"
              />
              <Tile
                icon={CheckCircle2}
                title="Quality & Testing"
                description="Introduced TypeScript strict mode and comprehensive testing practices"
              />
              <Tile
                icon={Server}
                title="Full-Stack C#"
                description="Backend experience with C# at Clarksons complementing frontend expertise"
              />
            </div>
          </TabsContent>

          <TabsContent value="values">
            <div className="grid grid-cols-2 gap-3">
              <Tile
                icon={Heart}
                title="Respect"
                description="Delivered for tier-1 clients (Chase UK, Citi, Nationwide, Westpac), prioritising client needs and safe onboarding"
              />
              <Tile
                icon={Shield}
                title="Integrity"
                description="Resolved compliance findings, supported ISO 27001 and FCA requirements — doing business the right way"
              />
              <Tile
                icon={Handshake}
                title="Collaborative"
                description="Mentored engineers through pair programming; led cross-team migrations; managed distributed teams"
              />
              <Tile
                icon={GraduationCap}
                title="Developing our People"
                description="Created career roadmaps; author of The True Mind Theory; creator of the Iterative-Functional Method"
              />
              <Tile
                icon={Zap}
                title="Adaptable and Nimble"
                description="Shipped across React, React Native, Swift, Java, C#, Node.js — rapid delivery on tight timelines"
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
