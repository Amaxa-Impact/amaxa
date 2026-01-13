"use client";

import { useCallback, useState } from "react";
import type { AnyFieldApi } from "@tanstack/react-form";
import { IconFile, IconUpload, IconX } from "@tabler/icons-react";

import { Button } from "@amaxa/ui/button";
import { Label } from "@amaxa/ui/label";

import type { ApplicationFormField, FileUploadValue } from "../types";

interface FileFieldProps {
  field: AnyFieldApi;
  formField: ApplicationFormField;
  formSlug: string;
}

interface UploadedFile {
  s3Key: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
}

export function FileField({ field, formField, formSlug }: FileFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const currentValue = field.state.value as FileUploadValue | undefined;
  const uploadedFiles = currentValue?.files ?? [];
  const maxFiles = formField.fileConfig?.maxFiles ?? 1;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (file: File): string | null => {
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
  };

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const contentType = file.type || "application/octet-stream";

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      // Check max files limit
      if (uploadedFiles.length >= maxFiles) {
        setUploadError(`Maximum ${maxFiles} file(s) allowed`);
        return;
      }

      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);

      try {
        // Get presigned upload URL
        const presignResponse = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fieldId: formField._id,
            formSlug,
            filename: file.name,
            contentType,
            sizeBytes: file.size,
          }),
        });

        if (!presignResponse.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { uploadUrl, s3Key, uploadToken } = (await presignResponse.json()) as {
          uploadUrl: string;
          s3Key: string;
          uploadToken: string;
        };

        // Upload file directly to S3
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            // Browsers forbid setting Content-Length manually.
            // Keep Content-Type aligned with what we signed server-side.
            "Content-Type": contentType,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        setUploadProgress(100);

        // Confirm upload
        const confirmResponse = await fetch("/api/upload/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uploadToken, s3Key }),
        });

        if (!confirmResponse.ok) {
          throw new Error("Failed to confirm upload");
        }

        // Update form field value
        const newFile: UploadedFile = {
          s3Key,
          filename: file.name,
          contentType: file.type,
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
          error instanceof Error ? error.message : "Upload failed"
        );
      } finally {
        setIsUploading(false);
        // Reset input
        e.target.value = "";
      }
    },
    [field, formField, formSlug, uploadedFiles, maxFiles]
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
    [field, uploadedFiles]
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

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={file.s3Key}
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

      {/* Upload area */}
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

      {/* Error messages */}
      {uploadError && <p className="text-destructive text-xs">{uploadError}</p>}
      {hasError && (
        <p className="text-destructive text-xs">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
}
