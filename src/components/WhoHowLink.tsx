import { useState } from 'react'
import PdfViewerModal from './PdfViewerModal'

function isUrlLink(link: string): boolean {
  return link.startsWith('http://') || link.startsWith('https://')
}

function isSdrivePdf(link: string): boolean {
  return !isUrlLink(link) && link.toLowerCase().endsWith('.pdf')
}

interface Props {
  link: string
  text: string
  bundledAsset?: string
}

export default function WhoHowLink({ link, text, bundledAsset }: Props) {
  const [showPdf, setShowPdf] = useState(false)

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

  // Bundled PDF asset — open viewer immediately without file picker
  if (bundledAsset && bundledAsset.toLowerCase().endsWith('.pdf')) {
    return (
      <>
        <button
          type="button"
          title={`Open PDF: ${link}`}
          onClick={() => setShowPdf(true)}
          className="text-[#0078d4] underline hover:text-[#006cbd] cursor-pointer"
        >
          PDF
        </button>
        {showPdf && (
          <PdfViewerModal bundledUrl={bundledAsset} path={link} onClose={() => setShowPdf(false)} />
        )}
      </>
    )
  }

  // Bundled .docx asset — offer direct download
  if (bundledAsset && bundledAsset.toLowerCase().endsWith('.docx')) {
    return (
      <a
        href={bundledAsset}
        download
        title={`Download: ${link}`}
        className="text-[#0078d4] underline hover:text-[#006cbd]"
      >
        {text}
      </a>
    )
  }

  // S Drive PDF without a bundled asset — user picks the file locally
  if (isSdrivePdf(link)) {
    return (
      <>
        <button
          type="button"
          title={`Open PDF: ${link}`}
          onClick={() => setShowPdf(true)}
          className="text-[#0078d4] underline hover:text-[#006cbd] cursor-pointer"
        >
          PDF
        </button>
        {showPdf && <PdfViewerModal path={link} onClose={() => setShowPdf(false)} />}
      </>
    )
  }

  return (
    <button
      type="button"
      title={`Copy path: ${link}`}
      onClick={() => navigator.clipboard.writeText(link)}
      className="text-[#0078d4] underline hover:text-[#006cbd] cursor-copy"
    >
      {text}
    </button>
  )
}
