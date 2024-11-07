'use client'

import { useState, useEffect, useRef } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerProps {
  fileUrl: string
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [scale, setScale] = useState<number>(1.5)
  const [rotation, setRotation] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3))
  }

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5))
  }

  const rotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360)
  }

  // Handle drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const container = containerRef.current
    container.scrollLeft -= e.movementX
    container.scrollTop -= e.movementY
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'grabbing'
    } else {
      document.body.style.cursor = 'default'
    }

    return () => {
      document.body.style.cursor = 'default'
    }
  }, [isDragging])

  return (
    <div className="relative pdf-container h-full">
      {/* Moved controls up by changing top-8 to top-4 */}
      <div className="fixed top-4 left-8 flex gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md z-[100]">
        <Button
          variant="outline"
          size="icon"
          onClick={zoomOut}
          disabled={scale <= 0.5}
          className="hover:bg-gray-100"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="flex items-center min-w-[60px] px-2 rounded bg-muted">
          {Math.round(scale * 100)}%
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={zoomIn}
          disabled={scale >= 3}
          className="hover:bg-gray-100"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={rotate}
          className="hover:bg-gray-100"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable and draggable container */}
      <div 
        ref={containerRef}
        className="overflow-auto h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading="Loading PDF..."
          className="pdf-document"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={scale}
              rotate={rotation}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              renderInteractiveForms={true}
              className="pdf-page-container mb-4"
              loading="Loading page..."
              customTextRenderer={false}
              renderMode="canvas"
              canvasBackground="#fff"
              quality={2}
            />
          ))}
        </Document>
      </div>
    </div>
  )
} 