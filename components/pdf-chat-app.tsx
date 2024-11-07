'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Send, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import('@/components/pdf-viewer'), {
  ssr: false,
  loading: () => <div>Loading PDF viewer...</div>
})

type Message = {
  text: string
  isUser: boolean
  pending?: boolean
}

export function PdfChatApp() {
  const [file, setFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasFirstMessage, setHasFirstMessage] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setFile(file)
    const fileUrl = URL.createObjectURL(file)
    setFileUrl(fileUrl)
    
    // Add initial system message
    setMessages([{
      text: "I've loaded your PDF. What would you like to know about it?",
      isUser: false
    }])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  })

  const clearFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl)
    }
    setFile(null)
    setFileUrl(null)
    setMessages([])
    setHasFirstMessage(false)  // Reset the first message flag
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !file) return

    const userMessage = { text: inputMessage, isUser: true }
    const pendingMessage = { text: '...', isUser: false, pending: true }
    
    setMessages(prev => [...prev, userMessage, pendingMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Only convert file to base64 if this is the first message
      const fileBase64 = !hasFirstMessage ? await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64String = reader.result as string
          resolve(base64String.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      }) : null;

      const formattedMessages = messages.concat(userMessage).map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formattedMessages,
          fileBase64,
          isFirstMessage: !hasFirstMessage,
          fileName: file.name
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setMessages(prev => [
        ...prev.slice(0, -1),
        { text: data.response, isUser: false }
      ])

      // Set hasFirstMessage to true after the first successful message
      if (!hasFirstMessage) {
        setHasFirstMessage(true)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev.slice(0, -1),
        { text: 'Sorry, there was an error processing your request.', isUser: false }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - File Upload and Preview */}
      <div className="w-1/2 p-4 bg-white shadow-md relative">
        {file ? (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2 z-10" 
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
            <ScrollArea className="h-full">
              {fileUrl && <PDFViewer fileUrl={fileUrl} />}
            </ScrollArea>
          </>
        ) : (
          <div 
            {...getRootProps()} 
            className="h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the PDF here ...</p>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p>Drag &apos;n&apos; drop a PDF file here, or click to select one</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="w-1/2 p-4 flex flex-col">
        <ScrollArea className="flex-grow mb-4 bg-white rounded-lg shadow-md p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-2 p-2 rounded-lg ${
                message.isUser ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              } max-w-[80%] ${message.pending ? 'animate-pulse' : ''}`}
            >
              {message.text}
            </div>
          ))}
        </ScrollArea>
        <div className="flex">
          <Input
            type="text"
            placeholder={file ? "Ask a question about your PDF..." : "Upload a PDF to start chatting..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            className="flex-grow mr-2"
            disabled={!file || isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!file || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}