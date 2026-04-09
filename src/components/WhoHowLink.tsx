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
}

export default function WhoHowLink({ link, text }: Props) {
  const [showPdf, setShowPdf] = useState(false)

  if (isUrlLink(link)) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noreferrer noopener"
        title={link}
        className="text-[#0078d4] underline hover:text-[#006cbd]"
      >
        {text}
      </a>
    )
  }

  if (isSdrivePdf(link)) {
    return (
      <>
        <button
          type="button"
          title={`Open PDF from:\n${link}`}
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
      title={`Click to copy path:\n${link}`}
      onClick={() => navigator.clipboard.writeText(link)}
      className="text-[#0078d4] underline hover:text-[#006cbd] cursor-copy"
    >
      {text}
    </button>
  )
}
