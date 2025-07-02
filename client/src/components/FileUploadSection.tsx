import { Upload, X, FileText } from "lucide-react";
import { useState, useRef } from "react";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

export default function FileUploadSection() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div 
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept=".txt,.csv,.pdf,.xlsx,.xls" 
          multiple 
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        <div className="space-y-2">
          <div className="flex justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700">
              Drop files here or <span className="text-blue-600 hover:text-blue-700">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Supports TXT, CSV, PDF, XLSX files</p>
          </div>
          
          {/* File Type Icons */}
          <div className="flex justify-center space-x-3 pt-2">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-red-600">PDF</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-green-600">XLS</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">TXT</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-purple-600">CSV</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFile(file.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
