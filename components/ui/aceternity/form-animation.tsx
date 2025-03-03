'use client';
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        initial={{ opacity: 0.5, width: "50%" }}
        animate={{ opacity: 1, width: "100%" }}
        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-black-500 to-black-100 blur-xl transition-all"
      />
      <div className={cn("relative bg-black-900 rounded-[inherit]", className)}>
        {children}
      </div>
    </div>
  );
};
