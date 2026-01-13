"use client";

import { Label } from "@amaxa/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { Checkbox } from "@amaxa/ui/checkbox";

import {
  DEFAULT_FILE_CONFIG,
  FILE_SIZE_PRESETS,
  MIME_TYPE_PRESETS,
  type FileConfig,
} from "./types";

interface FileConfigEditorProps {
  value: FileConfig | undefined;
  onChange: (config: FileConfig) => void;
}

const mimeTypeLabels: Record<string, string> = {
  "image/jpeg": "JPEG Images",
  "image/png": "PNG Images",
  "image/gif": "GIF Images",
  "image/webp": "WebP Images",
  "application/pdf": "PDF Documents",
  "application/msword": "Word Documents (.doc)",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Word Documents (.docx)",
};

export function FileConfigEditor({ value, onChange }: FileConfigEditorProps) {
  const config = value ?? DEFAULT_FILE_CONFIG;

  const handleSizeChange = (sizeLabel: string) => {
    const sizeBytes =
      FILE_SIZE_PRESETS[sizeLabel as keyof typeof FILE_SIZE_PRESETS];
    if (sizeBytes) {
      onChange({ ...config, maxSizeBytes: sizeBytes });
    }
  };

  const handleMimeTypeToggle = (mimeType: string, checked: boolean) => {
    const currentTypes = config.allowedMimeTypes;
    let newTypes: string[];

    if (checked) {
      newTypes = [...currentTypes, mimeType];
    } else {
      newTypes = currentTypes.filter((t) => t !== mimeType);
    }

    onChange({ ...config, allowedMimeTypes: newTypes });
  };

  const handlePresetClick = (preset: keyof typeof MIME_TYPE_PRESETS) => {
    onChange({ ...config, allowedMimeTypes: [...MIME_TYPE_PRESETS[preset]] });
  };

  const getCurrentSizeLabel = () => {
    const entry = Object.entries(FILE_SIZE_PRESETS).find(
      ([, bytes]) => bytes === config.maxSizeBytes
    );
    return entry?.[0] ?? "5 MB";
  };

  return (
    <div className="space-y-4 rounded-md border p-3">
      <div className="text-muted-foreground text-xs font-medium uppercase">
        File Upload Settings
      </div>

      {/* Max file size */}
      <div className="space-y-1.5">
        <Label className="text-xs">Maximum File Size</Label>
        <Select value={getCurrentSizeLabel()} onValueChange={handleSizeChange}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(FILE_SIZE_PRESETS).map((label) => (
              <SelectItem key={label} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Allowed file types */}
      <div className="space-y-2">
        <Label className="text-xs">Allowed File Types</Label>

        {/* Quick presets */}
        <div className="flex gap-2">
          <button
            type="button"
            className="text-primary hover:bg-accent rounded px-2 py-1 text-xs"
            onClick={() => handlePresetClick("images")}
          >
            Images only
          </button>
          <button
            type="button"
            className="text-primary hover:bg-accent rounded px-2 py-1 text-xs"
            onClick={() => handlePresetClick("documents")}
          >
            Documents only
          </button>
          <button
            type="button"
            className="text-primary hover:bg-accent rounded px-2 py-1 text-xs"
            onClick={() => handlePresetClick("all")}
          >
            All types
          </button>
        </div>

        {/* Individual type toggles */}
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(mimeTypeLabels).map(([mimeType, label]) => (
            <div key={mimeType} className="flex items-center gap-2">
              <Checkbox
                id={`mime-${mimeType}`}
                checked={config.allowedMimeTypes.includes(mimeType)}
                onCheckedChange={(checked) =>
                  handleMimeTypeToggle(mimeType, checked === true)
                }
              />
              <label
                htmlFor={`mime-${mimeType}`}
                className="text-muted-foreground text-xs"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
