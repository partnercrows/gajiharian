import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/lib/store";

export function SignatureSection() {
  const signature = useInvoiceStore((s) => s.signature);
  const updateSignature = useInvoiceStore((s) => s.updateSignature);

  return (
    <Card className="p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-lg">Signature</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Names appear on the printed invoice. Optionally upload a signature image.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SignatureBox
          title="Person In Charge"
          name={signature.picName}
          image={signature.picImage}
          onName={(v) => updateSignature({ picName: v })}
          onImage={(v) => updateSignature({ picImage: v })}
        />
        <SignatureBox
          title="Employee Representative"
          name={signature.repName}
          image={signature.repImage}
          onName={(v) => updateSignature({ repName: v })}
          onImage={(v) => updateSignature({ repImage: v })}
        />
      </div>
    </Card>
  );
}

function SignatureBox({
  title,
  name,
  image,
  onName,
  onImage,
}: {
  title: string;
  name: string;
  image?: string;
  onName: (v: string) => void;
  onImage: (v: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{title}</Label>
      <div className="border rounded-md h-28 grid place-items-center bg-muted/30 relative overflow-hidden">
        {image ? (
          <>
            <img src={image} alt="signature" className="max-h-full max-w-full object-contain" />
            <button
              onClick={() => onImage(undefined)}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground grid place-items-center hover:bg-destructive/90"
              title="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => inputRef.current?.click()}
            className="text-muted-foreground"
          >
            <Upload className="h-4 w-4" /> Upload signature
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      <Input
        value={name}
        onChange={(e) => onName(e.target.value)}
        placeholder="Nama"
        className="h-9"
      />
    </div>
  );
}
