// Remove or comment out the unused import
// import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">PDF Chat App</h1>
        {/* Add navigation/auth buttons here if needed */}
      </header>

      <main className="flex flex-col items-center justify-center gap-8 py-12">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Chat with Your PDFs</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Upload your PDF documents and start an interactive conversation. Get instant answers and insights from your documents.
          </p>
          
          <div className="flex gap-4 justify-center">
            <a
              className="rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
              href="/chat"
            >
              Get Started
            </a>
            <a
              className="rounded-lg border border-input bg-background px-6 py-3 font-medium hover:bg-accent transition-colors"
              href="/docs"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Add features section or file upload component here */}
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} PDF Chat App. All rights reserved.</p>
      </footer>
    </div>
  );
}
