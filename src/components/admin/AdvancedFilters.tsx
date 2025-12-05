import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

export interface FilterOptions {
  search: string;
  profileType: string[];
  riskScoreMin: number;
  riskScoreMax: number;
  emotionScoreMin: number;
  emotionScoreMax: number;
  functionScoreMin: number;
  functionScoreMax: number;
  dateFrom: string;
  dateTo: string;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onReset,
  activeFilterCount,
}: AdvancedFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleProfileTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.profileType, type]
      : filters.profileType.filter((t) => t !== type);
    onFiltersChange({ ...filters, profileType: newTypes });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96 overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 mb-6">
          <SheetTitle>Advanced Filters</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <Label className="text-sm font-medium">Search (Name/Email)</Label>
            <Input
              placeholder="Search patients..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="mt-2"
            />
          </div>

          {/* Profile Type */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Risk Profile</Label>
            <div className="space-y-2">
              {["low-risk", "moderate-risk", "high-risk"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.profileType.includes(type)}
                    onCheckedChange={(checked) =>
                      handleProfileTypeChange(type, !!checked)
                    }
                  />
                  <Label
                    htmlFor={type}
                    className="cursor-pointer font-normal capitalize"
                  >
                    {type.replace("-", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Score Range */}
          <div>
            <Label className="text-sm font-medium">Risk Score Range</Label>
            <div className="space-y-2 mt-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.riskScoreMin}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        riskScoreMin: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.riskScoreMax}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        riskScoreMax: Math.min(100, parseInt(e.target.value) || 100),
                      })
                    }
                  />
                </div>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[filters.riskScoreMin, filters.riskScoreMax]}
                onValueChange={([min, max]) =>
                  onFiltersChange({
                    ...filters,
                    riskScoreMin: min,
                    riskScoreMax: max,
                  })
                }
                className="mt-2"
              />
            </div>
          </div>

          {/* Emotion Score Range */}
          <div>
            <Label className="text-sm font-medium">Emotion Score Range</Label>
            <div className="space-y-2 mt-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.emotionScoreMin}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        emotionScoreMin: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.emotionScoreMax}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        emotionScoreMax: Math.min(100, parseInt(e.target.value) || 100),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Function Score Range */}
          <div>
            <Label className="text-sm font-medium">Function Score Range</Label>
            <div className="space-y-2 mt-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.functionScoreMin}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        functionScoreMin: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.functionScoreMax}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        functionScoreMax: Math.min(100, parseInt(e.target.value) || 100),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-sm font-medium">Assessment Date Range</Label>
            <div className="space-y-2 mt-3">
              <div>
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, dateFrom: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, dateTo: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onReset();
              setOpen(false);
            }}
          >
            Reset All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}