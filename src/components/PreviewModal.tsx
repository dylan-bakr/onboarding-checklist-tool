import { useEffect, useState } from 'react'

interface Props {
  /** Bundled public URL to preview (e.g. /assets/foo.pdf or /assets/foo.md) */
  assetUrl: string
  /** Original network/S-Drive path shown at the top for reference */
  path: string
  onClose: () => void
}

function mediaLabel(url: string): string {
  const lower = url.toLowerCase()
  if (lower.endsWith('.pdf')) return 'PDF'
  if (lower.endsWith('.md')) return 'Doc'
  return 'File'
}

function MarkdownViewer({ url }: { url: string }) {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed')
        return r.text()
      })
      .then(setContent)
      .catch(() => setError(true))
  }, [url])

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-red-500">
        Failed to load document.
      </div>
    )
  }

  if (content === null) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Loading…</div>
    )
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-gray-100 bg-[#f9f9f9] p-4">
      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
        {content}
      </pre>
    </div>
  )
}

export default function PreviewModal({ assetUrl, path, onClose }: Props) {
  const label = mediaLabel(assetUrl)
  const isPdf = assetUrl.toLowerCase().endsWith('.pdf')
  const isMd = assetUrl.toLowerCase().endsWith('.md')

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 p-6 flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#222b36]">Preview {label}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Source path */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-600 mb-1">Source path:</p>
          <button
            type="button"
            title="Click to copy path"
            onClick={() => navigator.clipboard.writeText(path)}
            className="w-full text-left text-xs font-mono bg-[#f4f4f4] rounded-lg px-3 py-2 text-gray-700 break-all hover:bg-[#eaeaea] transition-colors cursor-copy"
          >
            {path}
          </button>
        </div>

        {/* Content */}
        {isPdf && (
          <div className="flex-1 min-h-0">
            <iframe
              src={assetUrl}
              sandbox="allow-same-origin"
              className="w-full h-full rounded-lg border border-gray-100"
              title={`Preview ${label}`}
            />
          </div>
        )}

        {isMd && <MarkdownViewer url={assetUrl} />}
      </div>
    </div>
  )
}
