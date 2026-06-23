"use client";

import React from "react";
import { motion } from "framer-motion";
import { scaleUp } from "../../lib/motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowBorder?: boolean;
  delay?: number;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hoverEffect = true,
  glowBorder = false,
  delay = 0,
  onClick
}) => {
  const cardClass = `
    glass-card 
    p-6 
    ${hoverEffect ? "glass-card-hover cursor-pointer" : ""} 
    ${glowBorder ? "gradient-border-glow" : ""} 
    ${className}
  `.trim();

  return (
    <motion.div
      variants={scaleUp(delay)}
      initial="hidden"
      animate="show"
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cardClass}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
