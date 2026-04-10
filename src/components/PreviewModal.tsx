import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'

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
  if (lower.endsWith('.md')) return 'Document'
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
    <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-gray-100 bg-[#f9f9f9] p-6 prose prose-sm max-w-none text-gray-700 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mb-1 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-semibold [&_code]:bg-gray-200 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-gray-200 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_a]:text-[#0078d4] [&_a]:underline [&_hr]:border-gray-200 [&_hr]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500">
      <Markdown>{content}</Markdown>
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
