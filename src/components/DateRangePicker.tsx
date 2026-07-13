import { useState, useCallback } from "react";
import { CalendarIcon, X, Check, RotateCcw } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { id } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
}

function parseDate(text: string): Date | undefined {
  const d = parse(text, "dd/MM/yyyy", new Date());
  return isValid(d) ? d : undefined;
}

export function DateRangePicker({ value, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(value);
  const [txtFrom, setTxtFrom] = useState("");
  const [txtTo, setTxtTo] = useState("");
  const [errFrom, setErrFrom] = useState(false);
  const [errTo, setErrTo] = useState(false);

  const sync = (range?: DateRange) => {
    setTxtFrom(range?.from ? format(range.from, "dd/MM/yyyy") : "");
    setTxtTo(range?.to ? format(range.to, "dd/MM/yyyy") : "");
    setErrFrom(false);
    setErrTo(false);
  };

  const onSelect = (range?: DateRange) => {
    setDraft(range);
    sync(range);
    // Jangan auto-close — user harus klik "Terapkan"
  };

  const onOpen = (o: boolean) => {
    setOpen(o);
    if (o) {
      setDraft(value);
      sync(value);
    }
  };

  const doApply = () => {
    // Validate: both dates must be present and from <= to
    const from = parseDate(txtFrom);
    const to = parseDate(txtTo);

    setErrFrom(!txtFrom || !from);
    setErrTo(!txtTo || !to);

    if (from && to && from <= to) {
      onChange({ from, to });
      setDraft({ from, to });
      setOpen(false);
      return;
    }

    // Try to use calendar selection instead
    if (draft?.from && draft?.to) {
      onChange(draft);
      setOpen(false);
      return;
    }

    // If only start date is selected (calendar), allow it but keep open
    if (draft?.from && !draft?.to) {
      // Don't close, user still needs to pick end date
      return;
    }
  };

  const doCancel = () => {
    setDraft(value);
    sync(value);
    setOpen(false);
  };

  const doReset = () => {
    setDraft(undefined);
    setTxtFrom("");
    setTxtTo("");
    onChange(undefined);
    setOpen(false);
  };

  const doManualApply = () => {
    const from = parseDate(txtFrom);
    const to = parseDate(txtTo);

    setErrFrom(!txtFrom || !from);
    setErrTo(!txtTo || !to);

    if (from && to && from <= to) {
      setDraft({ from, to });
    }
  };

  const shown = draft || value;

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={onOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("justify-start text-left font-normal h-9 flex-1", !value && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {value?.from ? (value.to ? <>{format(value.from, "dd MMM yyyy", { locale: id })} - {format(value.to, "dd MMM yyyy", { locale: id })}</> : format(value.from, "dd MMM yyyy", { locale: id })) : <span>{placeholder || "Pilih rentang tanggal"}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start" sideOffset={8}>
          <Calendar
            mode="range"
            selected={draft}
            onSelect={onSelect}
            numberOfMonths={2}
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2030, 11)}
          />

          {/* Manual date inputs + actions */}
          <div className="mt-3 pt-3 border-t space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  className={cn("h-7 text-xs", errFrom && "border-destructive focus-visible:ring-destructive")}
                  placeholder="Dari dd/mm/yyyy"
                  value={txtFrom}
                  onChange={(e) => { setTxtFrom(e.target.value); setErrFrom(false); }}
                  onBlur={() => setErrFrom(!!txtFrom && !parseDate(txtFrom))}
                />
              </div>
              <span className="text-muted-foreground text-xs">-</span>
              <div className="flex-1">
                <Input
                  className={cn("h-7 text-xs", errTo && "border-destructive focus-visible:ring-destructive")}
                  placeholder="Sampai dd/mm/yyyy"
                  value={txtTo}
                  onChange={(e) => { setTxtTo(e.target.value); setErrTo(false); }}
                  onBlur={() => setErrTo(!!txtTo && !parseDate(txtTo))}
                />
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs shrink-0" onClick={doManualApply} title="Perbarui dari input manual">
                <Check className="h-3 w-3 mr-1" />Perbarui
              </Button>
            </div>

            {/* Error hint */}
            {(errFrom || errTo) && (
              <p className="text-xs text-destructive">
                Format tanggal tidak valid. Gunakan format dd/mm/yyyy.
              </p>
            )}

            <div className="flex items-center justify-between gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={doReset} title="Hapus periode">
                <RotateCcw className="h-3 w-3 mr-1" />Reset
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={doCancel}>
                  Batal
                </Button>
                <Button size="sm" className="h-7 text-xs" onClick={doApply} disabled={!draft?.from && !txtFrom}>
                  <Check className="h-3 w-3 mr-1" />Terapkan
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {value?.from && (
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={doReset} title="Hapus periode"><X className="h-4 w-4" /></Button>
      )}
    </div>
  );
}