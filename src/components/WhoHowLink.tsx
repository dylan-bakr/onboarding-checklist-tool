import { useState } from 'react'
import PreviewModal from './PreviewModal'

function isUrlLink(link: string): boolean {
  return link.startsWith('http://') || link.startsWith('https://')
}

function previewLabel(bundledAsset: string): string {
  const lower = bundledAsset.toLowerCase()
  if (lower.endsWith('.pdf')) return 'Preview PDF'
  if (lower.endsWith('.md')) return 'Preview Doc'
  return 'Preview'
}

interface Props {
  link: string
  text: string
  bundledAsset?: string
}

export default function WhoHowLink({ link, text, bundledAsset }: Props) {
  const [showPreview, setShowPreview] = useState(false)

  if (isUrlLink(link)) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        title={link}
        className="text-[#0078d4] underline hover:text-[#006cbd]"
      >
        {text}
      </a>
    )
  }

  if (bundledAsset) {
    return (
      <>
        <button
          type="button"
          title={`Preview: ${link}`}
          onClick={() => setShowPreview(true)}
          className="text-[#0078d4] underline hover:text-[#006cbd] cursor-pointer"
        >
          {previewLabel(bundledAsset)}
        </button>
        {showPreview && (
          <PreviewModal assetUrl={bundledAsset} path={link} onClose={() => setShowPreview(false)} />
        )}
      </>
    )
  }

  return (
    <button
      type="button"
      title={`Click to copy path:\n${link}`}
      onClick={() => navigator.clipboard.writeText(link)}
      className="text-[#0078d4] underline hover:text-[#006cbd] cursor-copy"
    >
      {text}
    </button>
  )
}
