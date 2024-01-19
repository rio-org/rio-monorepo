export const mainNavVariants = {
  initial: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  loaded: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: 1,
      delayChildren: 0.1
    }
  }
};

export const mainNavChildrenVariants = {
  initial: {
    y: -20,
    opacity: 0,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
      type: 'spring'
    }
  },
  loaded: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000 },
      type: 'spring'
    }
  }
};

export const mainNavConnectVariants = {
  initial: {
    opacity: 0,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  loaded: {
    opacity: 1,
    transition: {
      delay: 0.5
    }
  }
};
