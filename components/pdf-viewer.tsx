'use client'

import { useState, ChangeEvent } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerProps {
  fileUrl: string
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [customScale, setCustomScale] = useState('100')

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const zoomIn = () => {
    const newScale = Math.min(scale + 0.1, 2.0)
    setScale(newScale)
    setCustomScale(Math.round(newScale * 100).toString())
  }

  const zoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.5)
    setScale(newScale)
    setCustomScale(Math.round(newScale * 100).toString())
  }

  const rotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360)
  }

  const handleCustomScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setCustomScale(value)
  }

  const handleCustomScaleBlur = () => {
    let numberValue = parseInt(customScale, 10)
    
    // Clamp between 50% and 200%
    numberValue = Math.max(50, Math.min(200, numberValue || 100))
    
    setCustomScale(numberValue.toString())
    setScale(numberValue / 100)
  }

  const handleCustomScaleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCustomScaleBlur()
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Controls */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm w-full mb-4 p-2 flex justify-center gap-2 items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={zoomOut}
          disabled={scale <= 0.5}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          <Input
            type="text"
            value={customScale}
            onChange={handleCustomScaleChange}
            onBlur={handleCustomScaleBlur}
            onKeyPress={handleCustomScaleKeyPress}
            className="w-16 text-center px-1"
          />
          <span className="text-sm text-gray-500">%</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={zoomIn}
          disabled={scale >= 2.0}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={rotate}
          title="Rotate"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* PDF Document */}
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
      >
        {numPages &&
          Array.from(new Array(numPages), (_, index) => (
            <div 
              key={`page_${index + 1}`} 
              className="mb-4 pdf-page-container"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center top'
              }}
            >
              <Page
                pageNumber={index + 1}
                width={450}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div>Loading page...</div>}
              />
            </div>
          ))}
      </Document>
    </div>
  )
} 