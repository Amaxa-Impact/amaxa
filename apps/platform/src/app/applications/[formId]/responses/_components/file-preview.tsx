"use client";

import { useEffect, useState } from "react";
import {
  IconFile,
  IconFileTypePdf,
  IconMaximize,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import { useAction } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";
import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";

interface FileInfo {
  blobId: string;
  path: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
}

interface FilePreviewProps {
  file: FileInfo;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(contentType: string): boolean {
  return contentType.startsWith("image/");
}

function isPdfFile(contentType: string): boolean {
  return contentType === "application/pdf";
}

function getFileIcon(contentType: string) {
  if (isImageFile(contentType)) {
    return IconPhoto;
  }
  if (isPdfFile(contentType)) {
    return IconFileTypePdf;
  }
  return IconFile;
}

export function FilePreview({ file }: FilePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const getPreview = useAction(api.files.getApplicationFilePreview);

  const isPreviewableType =
    isImageFile(file.contentType) || isPdfFile(file.contentType);
  const isTooLarge = file.sizeBytes > 12 * 1024 * 1024;

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    if (!isPreviewableType || isTooLarge) {
      setPreviewUrl(null);
      setHasError(false);
      setIsLoading(false);
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }

    setIsLoading(true);
    setHasError(false);

    void getPreview({ blobId: file.blobId, path: file.path })
      .then((result) => {
        if (!isActive) return;
        if (!result) {
          setHasError(true);
          setPreviewUrl(null);
          return;
        }

        objectUrl = URL.createObjectURL(
          new Blob([result.data], { type: result.contentType }),
        );
        setPreviewUrl(objectUrl);
      })
      .catch(() => {
        if (!isActive) return;
        setHasError(true);
        setPreviewUrl(null);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file.blobId, file.path, getPreview, isPreviewableType, isTooLarge]);

  const canPreview =
    !!previewUrl &&
    !isLoading &&
    ((isImageFile(file.contentType) && !imageError) ||
      isPdfFile(file.contentType));
  const isPreviewDisabled = !previewUrl || isLoading || hasError;
  const previewStatus = isLoading
    ? "Loading preview..."
    : isTooLarge
      ? "Preview too large"
      : hasError
        ? "Preview unavailable"
        : !isPreviewableType
          ? "No preview available"
          : null;
  const FileIcon = getFileIcon(file.contentType);

  return (
    <>
      <div className="bg-muted/50 overflow-hidden rounded-lg border">
        {/* Preview thumbnail for images */}
        {isImageFile(file.contentType) && previewUrl && !imageError && (
          <button
            className="group relative block w-full cursor-pointer"
            onClick={() => setIsPreviewOpen(true)}
            type="button"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black/5">
              <img
                alt={file.filename}
                className="h-full w-full object-contain"
                onError={() => setImageError(true)}
                src={previewUrl}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <IconMaximize className="h-8 w-8 text-white" />
              </div>
            </div>
          </button>
        )}

        {/* Preview thumbnail for PDFs */}
        {isPdfFile(file.contentType) && previewUrl && (
          <button
            className="group relative block w-full cursor-pointer"
            onClick={() => setIsPreviewOpen(true)}
            type="button"
          >
            <div className="relative flex aspect-video w-full items-center justify-center bg-red-50 dark:bg-red-950/20">
              <IconFileTypePdf className="h-16 w-16 text-red-500" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <IconMaximize className="h-8 w-8 text-white" />
              </div>
            </div>
          </button>
        )}

        {/* File info bar */}
        <div className="flex items-center justify-between gap-2 p-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileIcon className="text-muted-foreground h-4 w-4 shrink-0" />
            <span className="truncate text-sm font-medium">
              {file.filename}
            </span>
            <span className="text-muted-foreground shrink-0 text-xs">
              ({formatFileSize(file.sizeBytes)})
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {canPreview ? (
              <Button
                disabled={isPreviewDisabled}
                onClick={() => setIsPreviewOpen(true)}
                size="sm"
                variant="ghost"
              >
                <IconMaximize className="h-4 w-4" />
                <span className="sr-only">Preview</span>
              </Button>
            ) : previewStatus ? (
              <span className="text-muted-foreground text-xs">
                {previewStatus}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Full-screen preview modal */}
      {isPreviewOpen && previewUrl && (
        <FilePreviewModal
          contentType={file.contentType}
          filename={file.filename}
          onClose={() => setIsPreviewOpen(false)}
          url={previewUrl}
        />
      )}
    </>
  );
}

interface FilePreviewModalProps {
  url: string;
  filename: string;
  contentType: string;
  onClose: () => void;
}

function FilePreviewModal({
  url,
  filename,
  contentType,
  onClose,
}: FilePreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4">
        <span className="truncate text-sm font-medium text-white">
          {filename}
        </span>
        <div className="flex items-center gap-2">
          <Button
            className="text-white hover:bg-white/20 hover:text-white"
            onClick={onClose}
            size="icon-sm"
            variant="ghost"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex h-full w-full items-center justify-center p-16",
          isPdfFile(contentType) && "p-4",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {isImageFile(contentType) && (
          <img
            alt={filename}
            className="max-h-full max-w-full object-contain"
            src={url}
          />
        )}
        {isPdfFile(contentType) && (
          <iframe
            className="h-full w-full max-w-5xl rounded-lg bg-white"
            src={url}
            title={filename}
          />
        )}
      </div>
    </div>
  );
}

interface FileListProps {
  files: FileInfo[];
}

export function FileList({ files }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {files.map((file) => (
        <FilePreview file={file} key={file.blobId} />
      ))}
    </div>
  );
}
