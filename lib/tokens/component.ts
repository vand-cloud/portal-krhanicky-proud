// Component — per-component token mapping
export const component = {
  button: {
    paddingX: { sm: "0.75rem", md: "1rem", lg: "1.5rem" },
    paddingY: { sm: "0.375rem", md: "0.5rem", lg: "0.75rem" },
    fontSize: { sm: "0.875rem", md: "1rem", lg: "1.125rem" },
  },
  card: {
    padding: { compact: "1rem", comfortable: "1.5rem", spacious: "2rem" },
  },
  hero: {
    paddingY: { compact: "4rem", comfortable: "6rem", spacious: "8rem" },
  },
} as const;
