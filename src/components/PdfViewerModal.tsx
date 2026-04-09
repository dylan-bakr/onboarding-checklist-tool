import { useRef, useState } from 'react'

interface Props {
  path: string
  bundledUrl?: string
  onClose: () => void
}

export default function PdfViewerModal({ path, bundledUrl, onClose }: Props) {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayUrl = bundledUrl ?? (fileUrl?.startsWith('blob:') ? fileUrl : undefined)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileUrl) URL.revokeObjectURL(fileUrl)
    setFileUrl(URL.createObjectURL(file))
  }

  const handleClose = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 p-6 flex flex-col h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#222b36]">PDF Viewer</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-xs font-medium text-gray-600 mb-1">Network path:</p>
          <p className="text-xs font-mono bg-[#f4f4f4] rounded-lg px-3 py-2 text-gray-700 break-all">
            {path}
          </p>
        </div>

        {displayUrl ? (
          <div className="flex-1 min-h-0">
            <iframe
              src={displayUrl}
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full rounded-lg border border-gray-100"
              title="PDF Viewer"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-gray-500 max-w-sm">
              This file lives on the network drive. Navigate to the path above, then open the file
              here to view it.
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="px-5 py-2.5 bg-[#0078d4] hover:bg-[#006cbd] text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Open File…
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}
