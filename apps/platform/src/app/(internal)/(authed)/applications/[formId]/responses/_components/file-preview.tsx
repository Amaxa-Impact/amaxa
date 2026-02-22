"use client";

import { useEffect, useReducer } from "react";
import Image from "next/image";
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

interface PreviewState {
  isPreviewOpen: boolean;
  imageError: boolean;
  isLoading: boolean;
  previewUrl: string | null;
  hasError: boolean;
}

type PreviewAction =
  | { type: "openPreview" }
  | { type: "closePreview" }
  | { type: "imageError" }
  | { type: "resetPreview" }
  | { type: "loadingPreview" }
  | { type: "previewSuccess"; url: string }
  | { type: "previewFailure" };

const initialPreviewState: PreviewState = {
  isPreviewOpen: false,
  imageError: false,
  isLoading: false,
  previewUrl: null,
  hasError: false,
};

function previewReducer(state: PreviewState, action: PreviewAction): PreviewState {
  switch (action.type) {
    case "openPreview":
      return { ...state, isPreviewOpen: true };
    case "closePreview":
      return { ...state, isPreviewOpen: false };
    case "imageError":
      return { ...state, imageError: true };
    case "resetPreview":
      return {
        ...state,
        isLoading: false,
        hasError: false,
        previewUrl: null,
        imageError: false,
      };
    case "loadingPreview":
      return { ...state, isLoading: true, hasError: false };
    case "previewSuccess":
      return {
        ...state,
        isLoading: false,
        hasError: false,
        previewUrl: action.url,
      };
    case "previewFailure":
      return { ...state, isLoading: false, hasError: true, previewUrl: null };
    default:
      return state;
  }
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

interface GetFileIconProps {
  contentType: string;
  className?: string;
}
function GetFileIcon({ contentType, className }: GetFileIconProps) {
  if (isImageFile(contentType)) {
    return (
      <>
        <IconPhoto className={className} />
      </>
    );
  }
  if (isPdfFile(contentType)) {
    return (
      <>
        <IconFileTypePdf className={className} />;
      </>
    );
  }
  return (
    <>
      <IconFile />
    </>
  );
}

export function FilePreview({ file }: FilePreviewProps) {
  const [previewState, dispatch] = useReducer(previewReducer, initialPreviewState);

  const getPreview = useAction(api.files.getApplicationFilePreview);

  const isPreviewableType =
    isImageFile(file.contentType) || isPdfFile(file.contentType);
  const isTooLarge = file.sizeBytes > 12 * 1024 * 1024;
  const shouldLoadPreview = isPreviewableType && !isTooLarge;

  const { hasError, imageError, isLoading, isPreviewOpen, previewUrl } =
    previewState;

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    if (!shouldLoadPreview) {
      dispatch({ type: "resetPreview" });
      return;
    }

    dispatch({ type: "loadingPreview" });

    void getPreview({ blobId: file.blobId, path: file.path })
      .then((result) => {
        if (!isActive) return;

        if (!result) {
          dispatch({ type: "previewFailure" });
          return;
        }

        objectUrl = URL.createObjectURL(
          new Blob([result.data], { type: result.contentType }),
        );
        dispatch({ type: "previewSuccess", url: objectUrl });
      })
      .catch(() => {
        if (!isActive) return;
        dispatch({ type: "previewFailure" });
      });

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file.blobId, file.path, getPreview, shouldLoadPreview]);

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

  return (
    <>
      <div className="bg-muted/50 overflow-hidden rounded-lg border">
        {isImageFile(file.contentType) && previewUrl && !imageError && (
          <button
            className="group relative block w-full cursor-pointer"
            onClick={() => dispatch({ type: "openPreview" })}
            type="button"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black/5">
              <Image
                alt={file.filename}
                className="object-contain"
                fill
                onError={() => dispatch({ type: "imageError" })}
                sizes="(max-width: 640px) 100vw, 50vw"
                src={previewUrl}
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <IconMaximize className="h-8 w-8 text-white" />
              </div>
            </div>
          </button>
        )}

        {isPdfFile(file.contentType) && previewUrl && (
          <button
            className="group relative block w-full cursor-pointer"
            onClick={() => dispatch({ type: "openPreview" })}
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

        <div className="flex items-center justify-between gap-2 p-3">
          <div className="flex min-w-0 items-center gap-2">
            <GetFileIcon
              contentType={file.contentType}
              className="text-muted-foreground h-4 w-4 shrink-0"
            />
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
                onClick={() => dispatch({ type: "openPreview" })}
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

      {isPreviewOpen && previewUrl && (
        <FilePreviewModal
          contentType={file.contentType}
          filename={file.filename}
          onClose={() => dispatch({ type: "closePreview" })}
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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90">
      <button
        aria-label="Close preview"
        className="absolute inset-0"
        onClick={onClose}
        type="button"
      />
      <div className="relative z-10 absolute top-0 right-0 left-0 flex items-center justify-between bg-linear-to-b from-black/60 to-transparent p-4">
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

      <div
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center p-16",
          isPdfFile(contentType) && "p-4",
        )}
      >
        {isImageFile(contentType) && (
          <div className="relative h-full w-full">
            <Image
              alt={filename}
              className="object-contain"
              fill
              priority
              sizes="100vw"
              src={url}
              unoptimized
            />
          </div>
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
