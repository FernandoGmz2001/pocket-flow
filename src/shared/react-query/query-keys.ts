export const QUERY_KEYS = {
  TRANSACTIONS: {
    ALL: ['transactions'] as const,
    DETAIL: (id: string) => ['transactions', id] as const,
  },
  CATEGORIES: {
    ALL: ['categories'] as const,
  },
}
