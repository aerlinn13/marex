"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, FileText, Search } from "lucide-react";

interface BlotterToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function BlotterToolbar({ searchValue, onSearchChange }: BlotterToolbarProps) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-marex-border-subtle">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Filter..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-6 w-40 pl-7 text-xs"
            aria-label="Filter blotter"
            data-blotter-search
          />
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="offAll" size="xs">
          OFF ALL ORG
        </Button>
        <Button variant="terminalGhost" size="xs">
          <FileSpreadsheet className="mr-1 h-3 w-3" />
          EXCEL
        </Button>
        <Button variant="terminalGhost" size="xs">
          <FileText className="mr-1 h-3 w-3" />
          PDF
        </Button>
      </div>
    </div>
  );
}
