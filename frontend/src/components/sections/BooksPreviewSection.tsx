import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Section } from "../layout/Section";
import { Carousel } from "../ui/Carousel";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useBooks } from "../../features/books/hooks/useBooks";
import { ArrowRight } from "lucide-react";

export const BooksPreviewSection: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useBooks(1, 6);

  const books = data?.items ?? data ?? [];

  if (!books.length) return null;

  const carouselItems = books.map((book: any) => (
    <div key={book.id} className="px-3">
      <Card hover="tilt" className="h-full flex flex-col space-y-4">
        {/* Book cover */}
        <div className="w-full h-56 bg-gradient-to-br from-accent/30 to-muted/10 rounded-sm flex items-center justify-center border border-border overflow-hidden">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-text-muted">Book Cover</span>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col space-y-3">
          <div>
            <h3 className="text-base font-semibold text-text-primary line-clamp-2">
              {book.title}
            </h3>
          </div>

          <p className="text-sm text-text-muted line-clamp-2 flex-1">
            {book.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Badge variant="outline" className="text-xs">
              {new Date(book.createdAt).getFullYear()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/books/${book.slug}`)}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  ));

  return (
    <Section id="books">
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-display-lg font-serif text-text-primary">
            My Books
          </h2>
          <Button variant="ghost" onClick={() => navigate("/books")}>
            Browse all
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Carousel showControls>{carouselItems}</Carousel>
        </motion.div>
      </div>
    </Section>
  );
};
