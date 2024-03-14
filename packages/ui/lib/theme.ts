export const theme = {
  tab: {
    styles: {
      base: {
        indicator: {
          backgroundColor: 'bg-background',
          borderColor: 'border-border',
          borderRadius: 'rounded-full'
        }
      }
    }
  },
  menu: {
    styles: {
      base: {
        menu: {
          p: 'p-1',
          borderRadius: 'rounded-xl'
        },
        item: {
          initial: {
            borderRadius: 'rounded-lg'
          }
        }
      }
    }
  },
  navbar: {
    styles: {
      base: {
        navbar: {
          initial: {
            py: 'py-0',
            px: 'px-0'
          }
        }
      }
    }
  },
  tooltip: {
    styles: {
      base: {
        bg: 'bg-card',
        textColor: 'text-[var(--color-dark-gray)]',
        boxShadow: 'shadow-lg'
      }
    }
  }
};
