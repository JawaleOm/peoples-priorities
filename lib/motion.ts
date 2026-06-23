import { Variants } from "framer-motion";

export const fadeIn = (direction: "up" | "down" | "left" | "right", delay: number = 0): Variants => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export const staggerContainer = (staggerChildren: number = 0.1, delayChildren: number = 0): Variants => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

export const scaleUp = (delay: number = 0): Variants => {
  return {
    hidden: {
      scale: 0.85,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.8,
        delay: delay,
        ease: "easeOut",
      },
    },
  };
};

export const slideIn = (direction: "up" | "down" | "left" | "right", type: string, delay: number, duration: number): Variants => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const cardHover = {
  hover: {
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.025 },
  pressed: { scale: 0.95 },
};
