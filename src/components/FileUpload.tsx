import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  conversationId: string | null;
  onFileUploaded?: (fileUrl: string, fileName: string) => void;
  className?: string;
}

export default function FileUpload({ conversationId, onFileUploaded, className }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!conversationId) {
      toast({
        variant: "destructive",
        title: "No conversation",
        description: "Please start a conversation first",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${conversationId}/${Date.now()}.${fileExt}`;
      const filePath = `chat-files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("chat-files")
        .getPublicUrl(filePath);

      // Save file attachment record
      const { error: dbError } = await supabase.from("file_attachments").insert({
        conversation_id: conversationId,
        file_name: file.name,
        file_path: publicUrl,
        file_type: file.type,
        file_size: file.size,
      });

      if (dbError) throw dbError;

      setUploadedFiles((prev) => [...prev, { name: file.name, url: publicUrl }]);
      onFileUploaded?.(publicUrl, file.name);
      toast({ title: "File uploaded successfully" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          disabled={uploading || !conversationId}
          className="hidden"
          id="file-upload"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !conversationId}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-1">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm"
            >
              <File className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

