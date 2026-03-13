import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Section } from "../layout/Section";
import { Carousel } from "../ui/Carousel";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useBlogs } from "../../features/blog/hooks/useBlog";
import { ArrowRight } from "lucide-react";

export const BlogPreviewSection: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useBlogs(1, 6);

  const posts = data?.items ?? data ?? [];

  if (!posts.length) return null;

  const carouselItems = posts.map((post: any) => (
    <div key={post.id} className="px-3">
      <Card hover="lift" className="h-full flex flex-col p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Badge variant="muted" className="text-xs">
            {post.tags?.[0] ?? "Blog"}
          </Badge>
          {post.readTime && (
            <span className="text-xs text-text-muted font-mono whitespace-nowrap">
              {post.readTime} min read
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-text-primary line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-text-muted line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-text-muted font-mono">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </div>
  ));

  return (
    <Section id="blog" className="bg-surface/30">
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-display-lg font-serif text-text-primary">
            Latest Articles
          </h2>
          <Button variant="ghost" onClick={() => navigate("/blog")}>
            View all
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Carousel showControls autoplay autoplayInterval={6000}>
            {carouselItems}
          </Carousel>
        </motion.div>
      </div>
    </Section>
  );
};
