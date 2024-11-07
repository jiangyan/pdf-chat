declare module 'react-pdf' {
  import { ComponentType, ReactElement } from 'react';

  interface DocumentProps {
    file: string | File | null;
    onLoadSuccess?: (data: { numPages: number }) => void;
    loading?: ReactElement | string;
    children?: React.ReactNode;
  }

  interface PageProps {
    pageNumber: number;
    width?: number;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    loading?: ReactElement | string;
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