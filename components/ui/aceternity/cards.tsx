'use client';
import { motion } from "framer-motion";
import React from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    link?: string;
  }[];
  className?: string;
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 ${className}`}
    >
      {items.map((item, idx) => (
        <a href={item.link} key={idx}>
          <div className="p-4 relative group">
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-50 
                         rounded-lg blur-sm opacity-40 group-hover:opacity-100 transition-opacity"
            />
            <div className="relative p-6 bg-black rounded-lg h-full">
              {item.icon && (
                <div className="text-white mb-4 text-2xl">{item.icon}</div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
