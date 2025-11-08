import { useState } from "react";
import { Hero } from "@/components/Hero";
import { BookSearch } from "@/components/BookSearch";
import { BookReader } from "@/components/BookReader";

interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  imageUrl: string;
  previewLink: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<"hero" | "search" | "reader">("hero");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleGetStarted = () => {
    setCurrentView("search");
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentView("reader");
  };

  const handleBack = () => {
    if (currentView === "reader") {
      setCurrentView("search");
      setSelectedBook(null);
    } else if (currentView === "search") {
      setCurrentView("hero");
    }
  };

  return (
    <div className="min-h-screen">
      {currentView === "hero" && <Hero onGetStarted={handleGetStarted} />}
      {currentView === "search" && <BookSearch onSelectBook={handleSelectBook} onBack={handleBack} />}
      {currentView === "reader" && selectedBook && (
        <BookReader book={selectedBook} onBack={handleBack} />
      )}
    </div>
  );
};

export default Index;
