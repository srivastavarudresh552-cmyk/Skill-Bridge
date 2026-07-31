import { useRef, useState } from 'react';

export default function FileDropzone({ file, onFileSelect, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList) => {
    const selected = fileList[0];
    if (selected) onFileSelect(selected);
  };

  const openPicker = () => inputRef.current?.click();

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragging ? 'border-brand-500 bg-brand-50' : error ? 'border-danger-300 bg-danger-50' : 'border-gray-300 hover:border-brand-400 hover:bg-brand-50/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="max-w-[200px] truncate">{file.name}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-1 text-gray-400 hover:text-danger-600"
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m0-9l-3 3m3-3l3 3" />
            </svg>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-brand-600">Click to upload</span> or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-400">PDF only, up to 5MB</p>
          </>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger-600">{error}</p>}
    </div>
  );
}