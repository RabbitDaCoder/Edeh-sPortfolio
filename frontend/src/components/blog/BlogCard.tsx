import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { ArrowRight } from "lucide-react";
import type { BlogPostData } from "./FeaturedPost";

interface BlogCardProps {
  post: BlogPostData;
  index: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="group cursor-pointer border border-border rounded-md p-6 hover:border-text-muted/40 transition-colors"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant="muted" className="text-xs">
            {post.category}
          </Badge>
          <span className="text-xs text-text-muted font-mono">
            {post.readTime}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-text-muted line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-text-muted font-mono">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
};
