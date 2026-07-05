"use client";

import { motion } from "framer-motion";

interface StaggerProps { children: React.ReactNode; className?: string; staggerDelay?: number; }

export function Stagger({ children, className, staggerDelay = 0.05 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{ visible: { transition: { staggerChildren: staggerDelay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
