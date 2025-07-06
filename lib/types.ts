export interface Transaction {
  _id?: string
  amount: number
  description: string
  category: string
  date: string
  type: "income" | "expense"
  createdAt?: string
  updatedAt?: string
}

export interface Budget {
  _id?: string
  category: string
  amount: number
  month: string // YYYY-MM format
  createdAt?: string
  updatedAt?: string
}

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Other",
] as const

export type Category = (typeof CATEGORIES)[number]
