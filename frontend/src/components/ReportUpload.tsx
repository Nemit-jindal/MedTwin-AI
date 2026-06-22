"use client";

import { useRef, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";

import {
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ReportUploadProps {
  onExtractedData?: (
    data: {
      extractedValues: Record<string, number>;
      healthSummary: string;
      reportText: string;
    }
  ) => void;
}

export default function ReportUpload({
  onExtractedData,
}: ReportUploadProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState("");

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file.name);

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await axios.post(
          "http://127.0.0.1:8000/extract-report",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      onExtractedData?.({
        extractedValues:
          response.data.extracted_values,

        healthSummary:
          response.data.health_summary,

        reportText:
          response.data.report_text,
      });

      setIsSuccess(true);

      setMessage(
        `Successfully extracted data from ${response.data.filename}`
      );

    } catch (error) {
      console.error(error);

      setIsSuccess(false);

      setMessage(
        "Failed to process report."
      );

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* Title */}
      <div>
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Upload className="h-5 w-5 text-cyan-400" />
          Upload Medical Report
        </h3>

        <p className="text-sm text-zinc-400">
          Upload PDF, JPG or PNG medical report.
        </p>
      </div>

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Upload Button */}
      <Button
        className="w-full bg-white text-black rounded-xl hover:bg-zinc-200"
        onClick={() =>
          fileInputRef.current?.click()
        }
        disabled={uploading}
      >
        {uploading
          ? "Extracting..."
          : "Upload Medical Report"}
      </Button>

      {/* File Selected */}
      {selectedFile && (
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
          <p className="text-sm text-zinc-400">
            Selected File
          </p>

          <p className="font-medium text-white mt-1 break-all">
            {selectedFile}
          </p>
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl p-4 text-sm border ${
            isSuccess
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}

          {message}
        </div>
      )}

    </div>
  );
}