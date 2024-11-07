# PDF Chat App

An interactive PDF chat application built with Next.js that allows users to upload, view, and have conversations about PDF documents using Claude 3.5 Sonnet's PDF understanding capabilities.

## Features

- **PDF Upload & Preview**
  - Drag-and-drop PDF upload interface
  - Interactive PDF viewer with zoom and rotation controls
  - Multi-page support with smooth scrolling

- **PDF Chat Interface**
  - Real-time chat interface with Claude 3.5 Sonnet
  - Contextual understanding of PDF content, including text and images
  - Persistent chat history during session
  - Support for follow-up questions

- **Modern UI Components**
  - Built with shadcn/ui components
  - Responsive design
  - Clean and intuitive interface
  - Dark mode support

## Tech Stack

- **Framework**: Next.js 14
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **PDF Processing**: react-pdf, pdfjs-dist
- **AI Integration**: Claude 3.5 Sonnet (Anthropic)
- **File Handling**: react-dropzone

## Getting Started

1. Clone the repository:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
