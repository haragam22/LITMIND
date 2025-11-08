import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, BookOpen, Loader2, ArrowLeft, Library } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  imageUrl: string;
  previewLink: string;
}

interface BookSearchProps {
  onSelectBook: (book: Book) => void;
  onBack?: () => void;
}

export const BookSearch = ({ onSelectBook, onBack }: BookSearchProps) => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchBooks = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12&printType=books`
      );
      const data = await response.json();

      if (data.items) {
        const formattedBooks: Book[] = data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors || ["Unknown Author"],
          description: item.volumeInfo.description || "No description available",
          imageUrl: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg",
          previewLink: item.volumeInfo.previewLink,
        }));
        setBooks(formattedBooks);
      } else {
        setBooks([]);
        toast({
          title: "No books found",
          description: "Try a different search term",
        });
      }
    } catch (error) {
      console.error("Error searching books:", error);
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchBooks();
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="rounded-xl hover:bg-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Library className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Book Library</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Search header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Discover Books
            </h2>
            <p className="text-lg text-muted-foreground">
              Search from millions of books with audiobook and videobook support
            </p>
          </div>

          {/* Search bar */}
          <Card className="max-w-2xl mx-auto p-6 shadow-xl border-border/50 bg-card/50 backdrop-blur">
            <div className="flex gap-3">
              <Input
                placeholder="Search by title, author, or subject..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 text-lg rounded-xl border-border/50"
              />
              <Button
                onClick={searchBooks}
                disabled={loading}
                size="lg"
                className="rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results grid */}
          {books.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <Card
                  key={book.id}
                  className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur"
                  onClick={() => onSelectBook(book)}
                >
                  <div className="aspect-[2/3] relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read Book
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {book.authors.join(", ")}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
