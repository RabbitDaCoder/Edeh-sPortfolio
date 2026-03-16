import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface NextPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  readTime?: number;
  createdAt: string;
  tags: string[];
}

interface NextPostCardProps {
  post: NextPost;
}

export function NextPostCard({ post }: NextPostCardProps) {
  const navigate = useNavigate();
  const category = post.tags?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={() => {
        navigate(`/blog/${post.slug}`);
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="mt-20 border-t border-border bg-surface rounded-lg overflow-hidden hover:bg-surface/80 transition-colors duration-300">
        {/* Cover image */}
        {post.coverImage && (
          <div
            style={{
              width: "100%",
              height: "240px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover brightness-[0.7] transition-transform duration-500 hover:scale-[1.03]"
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 60%)",
              }}
            />
          </div>
        )}

        {/* Card body */}
        <div className="p-8 md:p-10">
          {/* Up next label */}
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4">
            Up next
          </p>

          {/* Category badge */}
          {category && (
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted border border-border px-3 py-1 rounded-full inline-block mb-4">
              {category}
            </span>
          )}

          {/* Post title */}
          <h3 className="font-serif text-display-lg leading-tight text-text-primary mt-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="font-sans text-body-md text-text-muted mt-4 max-w-2xl line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta row + CTA */}
          <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
            {/* Read time */}
            <span className="font-mono text-xs text-text-muted">
              {post.readTime ? `${post.readTime} min read` : null}
            </span>

            {/* Read button */}
            <div className="flex items-center gap-2 font-sans text-sm text-text-primary group">
              <span>Read post</span>
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
