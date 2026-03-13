import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export interface PageWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={title} />
        {description && (
          <meta property="og:description" content={description} />
        )}
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className={className}
      >
        {children}
      </motion.div>
    </>
  );
};