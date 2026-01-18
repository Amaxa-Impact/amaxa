"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuthFromAuthKit } from "@/components/convex-client-provider";
import { env } from "@/env";
import { IconFile, IconUpload, IconX } from "@tabler/icons-react";
import { useAccessToken } from "@workos-inc/authkit-nextjs/components";
import { useAction } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import { Label } from "@amaxa/ui/label";

import type { ApplicationFormField, FileUploadValue } from "../types";

interface FormFieldApi<TValue> {
  name: string;
  state: {
    value: TValue;
    meta: {
      isTouched: boolean;
      errors: string[];
    };
  };
  handleBlur: () => void;
  handleChange: (value: TValue) => void;
}

interface FileFieldProps {
  field: FormFieldApi<FileUploadValue | undefined>;
  formField: ApplicationFormField;
  formSlug: string;
}

interface UploadedFile {
  blobId: string;
  path: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
}

const CONVEX_SITE_URL = env.NEXT_PUBLIC_CONVEX_URL.replace(
  ".convex.cloud",
  ".convex.site",
);

export function FileField({ field, formField, formSlug }: FileFieldProps) {
  const authInstance = useAuthFromAuthKit();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const commitApplicationFile = useAction(api.files.commitApplicationFile);

  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const currentValue = field.state.value;
  const uploadedFiles = useMemo(() => {
    return currentValue?.files ?? [];
  }, [currentValue]);

  const maxFiles = formField.fileConfig?.maxFiles ?? 1;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = useCallback(
    (file: File): string | null => {
      const config = formField.fileConfig;
      if (!config) return null;

      if (file.size > config.maxSizeBytes) {
        return `File size exceeds ${formatFileSize(config.maxSizeBytes)} limit`;
      }

      if (
        config.allowedMimeTypes.length > 0 &&
        !config.allowedMimeTypes.includes(file.type)
      ) {
        return "File type not allowed";
      }

      return null;
    },
    [formField.fileConfig],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const contentType = file.type;

      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      if (uploadedFiles.length >= maxFiles) {
        setUploadError(`Maximum ${maxFiles} file(s) allowed`);
        return;
      }

      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);

      try {
        const accessToken = await authInstance.fetchAccessToken();

        if (!accessToken) {
          throw new Error("No access token available");
        }

        const uploadResponse = await fetch(`/api/fs/upload`, {
          method: "POST",
          headers: {
            "Content-Type": contentType,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Failed to upload file: ${errorText}`);
        }

        setUploadProgress(75);

        const { blobId } = (await uploadResponse.json()) as { blobId: string };

        const { path } = await commitApplicationFile({
          blobId,
          filename: file.name,
          formSlug,
        });

        setUploadProgress(100);

        const newFile: UploadedFile = {
          blobId,
          path,
          filename: file.name,
          contentType,
          sizeBytes: file.size,
        };

        const newValue: FileUploadValue = {
          type: "file",
          files: [...uploadedFiles, newFile],
        };

        field.handleChange(newValue);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError(
          error instanceof Error ? error.message : "Upload failed",
        );
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [
      validateFile,
      uploadedFiles,
      maxFiles,
      formSlug,
      field,
      commitApplicationFile,
    ],
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        field.handleChange(undefined);
      } else {
        field.handleChange({
          type: "file",
          files: newFiles,
        } as FileUploadValue);
      }
    },
    [field, uploadedFiles],
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium" htmlFor={field.name}>
        {formField.label}
        {formField.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {formField.description && (
        <p className="text-muted-foreground text-xs">{formField.description}</p>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={file.blobId}
              className="bg-muted flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center gap-2">
                <IconFile className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">{file.filename}</span>
                <span className="text-muted-foreground text-xs">
                  ({formatFileSize(file.sizeBytes)})
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(index)}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length < maxFiles && (
        <div className="relative">
          <label
            htmlFor={`file-input-${field.name}`}
            className={`border-input hover:bg-accent flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
              isUploading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <IconUpload className="text-muted-foreground mb-2 h-8 w-8" />
            <span className="text-muted-foreground text-sm">
              {isUploading
                ? `Uploading... ${uploadProgress}%`
                : "Click to upload or drag and drop"}
            </span>
            {formField.fileConfig && (
              <span className="text-muted-foreground mt-1 text-xs">
                Max {formatFileSize(formField.fileConfig.maxSizeBytes)}
              </span>
            )}
          </label>
          <input
            id={`file-input-${field.name}`}
            type="file"
            className="sr-only"
            accept={formField.fileConfig?.allowedMimeTypes.join(",")}
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
      )}

      {uploadError && <p className="text-destructive text-xs">{uploadError}</p>}
      {hasError && (
        <p className="text-destructive text-xs">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
}
