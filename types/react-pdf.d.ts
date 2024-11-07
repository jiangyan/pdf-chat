declare module 'react-pdf' {
  import { ComponentType, ReactElement } from 'react';

  interface DocumentProps {
    file: string | File | null;
    onLoadSuccess?: (data: { numPages: number }) => void;
    loading?: ReactElement | string;
    error?: ReactElement | string;
    className?: string;
    children?: React.ReactNode;
  }

  interface PageProps {
    pageNumber: number;
    width?: number;
    height?: number;
    scale?: number;
    rotate?: number;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    renderInteractiveForms?: boolean;
    customTextRenderer?: boolean;
    loading?: ReactElement | string;
    error?: ReactElement | string;
    className?: string;
    renderMode?: 'canvas' | 'svg' | 'none';
    canvasBackground?: string;
    quality?: number;
  }

  export const Document: ComponentType<DocumentProps>;
  export const Page: ComponentType<PageProps>;
  export const pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    version: string;
  };
} 