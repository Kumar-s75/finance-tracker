"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react"

interface DashboardCardsProps {
  transactions: Transaction[]
}

export function DashboardCards({ transactions }: DashboardCardsProps) {
  const stats = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7)

    const currentMonthTransactions = transactions.filter((t) => {
      const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
      return transactionMonth === currentMonth
    })

    const totalIncome = currentMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    const netIncome = totalIncome - totalExpenses

    // Get most expensive category
    const categoryExpenses: Record<string, number> = {}
    currentMonthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount
      })

    const topCategory = Object.entries(categoryExpenses).sort(([, a], [, b]) => b - a)[0]

    // Recent transaction
    const recentTransaction = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      recentTransaction,
      transactionCount: currentMonthTransactions.length,
    }
  }, [transactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(stats.netIncome)}
          </div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.transactionCount}</div>
          <p className="text-xs text-muted-foreground">
            {stats.topCategory ? `Top: ${stats.topCategory.name}` : "This month"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
