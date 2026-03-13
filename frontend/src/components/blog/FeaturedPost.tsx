import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { ArrowRight } from "lucide-react";

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
  coverColor?: string;
}

interface FeaturedPostProps {
  post: BlogPostData;
}

export const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="group cursor-pointer border border-border rounded-md overflow-hidden hover:border-text-muted/40 transition-colors"
    >
      {/* Cover area */}
      <div className="w-full h-64 md:h-80 bg-surface flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        <span className="text-display-lg font-serif text-text-muted/20 select-none">
          Featured
        </span>
      </div>

      <div className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-xs">
            {post.category}
          </Badge>
          <span className="text-xs text-text-muted font-mono">
            {post.readTime}
          </span>
          <span className="text-xs text-text-muted font-mono">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h2 className="text-display-md font-serif text-text-primary group-hover:text-accent transition-colors">
          {post.title}
        </h2>

        <p className="text-body-md text-text-muted max-w-2xl">{post.excerpt}</p>

        <div className="flex items-center gap-2 text-sm text-text-muted group-hover:text-text-primary transition-colors pt-2">
          Read article
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
};
