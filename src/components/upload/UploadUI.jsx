"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, FileText, X, CheckCircle } from "lucide-react";
import { processPdfFile } from "@/app/upload/actions";

export default function UploadUI({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState(null);
  const inputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setMessage({ type: "error", text: "Please select a PDF file" });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setSelectedFile(file);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const result = await processPdfFile(formData);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        onSuccess?.(result.file);
        setSelectedFile(null);
      } else {
        setMessage({ type: "error", text: result.error });
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("Error processing PDF:", err);
      setMessage({ type: "error", text: "An error occurred while processing the PDF" });
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="bg-background py-8 md:py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Upload PDF</h1>
          <p className="text-muted-foreground">Upload a PDF file to start chatting with it</p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div
              className={`
                relative border-2 border-dashed rounded-lg m-4 transition-all duration-200
                ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50"}
                ${isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isLoading && inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                onChange={handleChange}
                disabled={isLoading}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center py-10 px-4">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-primary/20"></div>
                      <Loader2 className="absolute inset-0 w-20 h-20 text-primary animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-foreground">Processing PDF...</p>
                      <p className="text-sm text-muted-foreground mt-1">Extracting text and creating embeddings</p>
                    </div>
                  </div>
                ) : selectedFile ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground truncate max-w-[250px]">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      className="mt-2"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-foreground">
                        Drag & drop your PDF here
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Only PDF files are supported</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {message && (
          <Alert
            variant={message.type === "error" ? "destructive" : "default"}
            className="mt-4"
          >
            {message.type === "success" && <CheckCircle className="h-4 w-4" />}
            <AlertTitle>
              {message.type === "error" ? "Error" : "Success"}
            </AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}