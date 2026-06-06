'use client';
import { useCallback, useRef } from 'react';
import { Upload, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export default function FileUploadZone({ onFileSelect, accept, className }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50',
        className,
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground mb-2">Drag and drop a file here</p>
      <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        Select file
      </Button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </div>
  );
}
