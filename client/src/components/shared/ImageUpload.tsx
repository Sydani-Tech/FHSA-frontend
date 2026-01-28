import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  X,
  Link as LinkIcon,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { uploadService } from "@/core/services/upload.service";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Image",
  className = "",
  placeholder = "Image URL",
}: ImageUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [inputType, setInputType] = useState<"file" | "url">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, WEBP)",
        variant: "destructive",
      });
      return;
    }

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadService.uploadFile(file);
      onChange(url);
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Upload failed", error);
      toast({
        title: "Upload failed",
        description: "Could not upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <Label>{label}</Label>}

      {value ? (
        <div className="relative group aspect-video w-full max-w-sm rounded-lg overflow-hidden border bg-muted">
          <img
            src={value}
            alt="Uploaded asset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onRemove ? onRemove() : onChange("");
              }}
            >
              <X className="h-4 w-4 mr-2" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Button
              type="button"
              variant={inputType === "file" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setInputType("file")}
              className="text-xs"
            >
              <Upload className="h-3 w-3 mr-2" /> Upload File
            </Button>
            <Button
              type="button"
              variant={inputType === "url" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setInputType("url")}
              className="text-xs"
            >
              <LinkIcon className="h-3 w-3 mr-2" /> URL
            </Button>
          </div>

          {inputType === "file" ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors ${
                isUploading ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
              )}
              <div className="text-sm font-medium">
                {isUploading ? "Uploading..." : "Click to select image"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WEBP up to 5MB
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
