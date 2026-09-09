export const SPRING = { type: 'spring', stiffness: 300, damping: 25 } as const

export const CARD_HOVER = { y: -2 }
export const CARD_TAP = { scale: 0.98 }
export const ROW_HOVER = { y: -1, scale: 1.01 }
export const ROW_TAP = { scale: 0.98 }
export const TOGGLE_TAP = { scale: 0.98 }

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: SPRING },
  exit: { opacity: 0, y: -8, transition: SPRING },
}

export const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: SPRING },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: SPRING },
}

export const listItemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: SPRING },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: SPRING },
}

export const drawerInnerVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING, delay: 0.05 },
  },
  exit: { opacity: 0, y: 8, transition: SPRING },
}

export const drawerHandleVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: SPRING },
}
