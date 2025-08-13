import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
}

const UploadEvidence: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "Guidelines.pdf",
      type: "PDF",
      url: "#",
    },
    {
      id: "2",
      name: "Branding Assets",
      type: "Media",
      url: "#",
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploaded = Array.from(event.target.files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type.includes("pdf") ? "PDF" : "Media",
        url: URL.createObjectURL(file),
      }));
      setFiles((prev) => [...prev, ...uploaded]);
    }
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="bg-[#F9FAFB] p-4 rounded-lg shadow border mb-5">
      <div className="flex items-center  mb-3">
        <h2 className="text-gray-800 font-medium">
          Evidence of completed remediation
        </h2>
         <div className="h-5 border-l border-gray-300 mx-3"></div>
        <label className="text-blue-600 text-sm cursor-pointer hover:underline">
          Upload file
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            multiple
          />
        </label>
      </div>

      <div className="flex gap-3 flex-wrap">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-2 border rounded-lg px-3 py-2 relative group bg-gray-50"
          >
            <div className="flex-shrink-0">
              {file.type === "PDF" ? (
                <div className="w-6 h-6 bg-red-600 text-white flex items-center justify-center text-xs font-bold rounded">
                  PDF
                </div>
              ) : (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Drive_logo.png"
                  alt="drive"
                  className="w-6 h-6"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">{file.type} • Download</p>
            </div>
            <button
              className="absolute -top-2 -right-2 bg-white border rounded-full p-0.5 shadow hidden group-hover:block"
              onClick={() => handleRemove(file.id)}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Add file button */}
        <label className="flex items-center justify-center w-12 h-12 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <Plus className="text-gray-500" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            multiple
          />
        </label>
      </div>
    </div>
  );
};

export default UploadEvidence;
