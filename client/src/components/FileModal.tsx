import { useState, useRef } from "react";
import { Globe, Trash, Upload, X } from "lucide-react";
import { uploadPointsByFile } from "../services/api/pointServices";
import {
  uploadPointsByWebpage,
  uploadPointsByWebsite,
} from "../services/api/pointServices";
import { toast } from "react-toastify";

type FileModalProps = {
  setShowFileModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const FileModal = ({ setShowFileModal }: FileModalProps) => {
  const [file, setFile] = useState<FileList | null>(null);
  const [url, setUrl] = useState("");
  const [importMode, setImportMode] = useState<"webpage" | "website">(
    "webpage"
  );

  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async () => {
    if (!file || file.length === 0) return;
    const selected = file[0];
    setIsUploading(true);
    try {
      await uploadPointsByFile(selected);
      toast("File uploaded successfully!", { type: "success" });
    } catch (error) {
      console.error("[FileModal.tsx] handleFileUpload Error:", error);
      toast("An error occurred. Please try again.", { type: "error" });
    } finally {
      setIsUploading(false);
      setShowFileModal(false);
    }
  };

  const handleUrl = async () => {
    if (url.trim() === "") return;
    setIsUploading(true);

    try {
      if (importMode === "webpage") {
        await uploadPointsByWebpage(url);
      } else {
        await uploadPointsByWebsite(url);
      }

      toast(
        `${
          importMode === "webpage" ? "Webpage" : "Website"
        } imported successfully!`,
        { type: "success" }
      );
    } catch (error) {
      console.error(`[FileModal.tsx] handleUrl Error:`, error);
      toast("An error occurred. Please try again.", { type: "error" });
    } finally {
      setUrl("");
      setIsUploading(false);
      setShowFileModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50 transition-opacity"
        onClick={() => setShowFileModal(false)}
      />

      {/* Modal content */}
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <button
          onClick={() => setShowFileModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Upload Content
        </h3>

        {/* File Upload Section */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive
              ? "border-purple-500 bg-purple-50"
              : "border-gray-300 hover:border-purple-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file && file.length > 0 ? (
            <div className="flex flex-col items-center space-y-4">
              <span className="text-gray-800 font-medium">{file[0].name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFile(null)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center cursor-pointer"
                  disabled={isUploading}
                >
                  <Trash className="h-4 w-4 mr-1" /> Remove
                </button>
                <button
                  onClick={triggerFileSelect}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer"
                  disabled={isUploading}
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Drag and drop your file here, or
              </p>
              <button
                onClick={triggerFileSelect}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer"
                disabled={isUploading}
              >
                Browse Files
              </button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple={false}
            className="hidden"
            onChange={(e) => setFile(e.target.files)}
          />
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Supported formats: PDF, TXT, CSV, XLS, etc.
        </p>

        {file && file.length > 0 && (
          <div className="flex justify-center mt-5">
            <button
              className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              onClick={handleFileUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : `Upload ${file[0].name}`}
            </button>
          </div>
        )}

        {!file && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="flex items-center justify-center gap-8 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="importMode"
                  value="webpage"
                  checked={importMode === "webpage"}
                  onChange={() => setImportMode("webpage")}
                  className="form-radio h-4 w-4 text-purple-600"
                />
                <span className="text-gray-700">Webpage</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="importMode"
                  value="website"
                  checked={importMode === "website"}
                  onChange={() => setImportMode("website")}
                  className="form-radio h-4 w-4 text-purple-600"
                />
                <span className="text-gray-700">Website</span>
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <h4 className="text-md font-medium text-gray-800">
                  Import from {importMode === "webpage" ? "Webpage" : "Website"}
                  :
                </h4>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isUploading}
                />
                <button
                  onClick={handleUrl}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap cursor-pointer"
                  disabled={isUploading || !url.trim()}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>

              <p className="text-sm text-gray-500">
                {importMode === "webpage"
                  ? "Imports a single webpage's content."
                  : "Imports content from the entire website."}
              </p>
              <p className="text-xs text-gray-400 text-center">
                NOTE: Website imports may take up to 2 minutes.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileModal;
