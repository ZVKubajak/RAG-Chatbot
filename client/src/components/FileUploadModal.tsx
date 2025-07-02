import { Upload, X, FileText } from "lucide-react";
import { useState, useRef } from "react";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Upload Files</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div 
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
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
            
            <div className="space-y-3">
              <div className="flex justify-center">
                <Upload className="w-10 h-10 text-gray-400" />
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
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-red-600">PDF</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600">XLS</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">TXT</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">CSV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}