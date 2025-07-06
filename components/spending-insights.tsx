"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Transaction, Budget } from "@/lib/types"
import { AlertTriangle, TrendingUp, Target, CheckCircle } from "lucide-react"

interface SpendingInsightsProps {
  transactions: Transaction[]
  budgets: Budget[]
  currentMonth: string
}

export function SpendingInsights({ transactions, budgets, currentMonth }: SpendingInsightsProps) {
  const insights = useMemo(() => {
    const currentMonthTransactions = transactions.filter((t) => {
      const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
      return transactionMonth === currentMonth && t.type === "expense"
    })

    const previousMonth = new Date(currentMonth + "-01")
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    const prevMonthStr = previousMonth.toISOString().slice(0, 7)

    const previousMonthTransactions = transactions.filter((t) => {
      const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
      return transactionMonth === prevMonthStr && t.type === "expense"
    })

    // Calculate category spending
    const currentSpending: Record<string, number> = {}
    const previousSpending: Record<string, number> = {}

    currentMonthTransactions.forEach((t) => {
      currentSpending[t.category] = (currentSpending[t.category] || 0) + t.amount
    })

    previousMonthTransactions.forEach((t) => {
      previousSpending[t.category] = (previousSpending[t.category] || 0) + t.amount
    })

    // Get current month budgets
    const currentBudgets = budgets.filter((b) => b.month === currentMonth)

    const insights = []

    // Budget alerts
    currentBudgets.forEach((budget) => {
      const spent = currentSpending[budget.category] || 0
      const percentage = (spent / budget.amount) * 100

      if (percentage > 100) {
        insights.push({
          type: "warning",
          title: "Budget Exceeded",
          description: `You've exceeded your ${budget.category} budget by ${(((spent - budget.amount) / budget.amount) * 100).toFixed(1)}%`,
          icon: AlertTriangle,
          color: "text-red-600",
        })
      } else if (percentage > 80) {
        insights.push({
          type: "caution",
          title: "Budget Alert",
          description: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget`,
          icon: Target,
          color: "text-yellow-600",
        })
      } else if (percentage < 50) {
        insights.push({
          type: "success",
          title: "On Track",
          description: `Great job! You're only using ${percentage.toFixed(1)}% of your ${budget.category} budget`,
          icon: CheckCircle,
          color: "text-green-600",
        })
      }
    })

    // Spending trends
    Object.keys(currentSpending).forEach((category) => {
      const current = currentSpending[category]
      const previous = previousSpending[category] || 0

      if (previous > 0) {
        const change = ((current - previous) / previous) * 100
        if (Math.abs(change) > 20) {
          insights.push({
            type: change > 0 ? "warning" : "info",
            title: `${category} Spending ${change > 0 ? "Increased" : "Decreased"}`,
            description: `${Math.abs(change).toFixed(1)}% ${change > 0 ? "increase" : "decrease"} from last month`,
            icon: TrendingUp,
            color: change > 0 ? "text-red-600" : "text-green-600",
          })
        }
      }
    })

    // Top spending category
    const topCategory = Object.entries(currentSpending).sort(([, a], [, b]) => b - a)[0]

    if (topCategory) {
      const totalSpending = Object.values(currentSpending).reduce((sum, amount) => sum + amount, 0)
      const percentage = (topCategory[1] / totalSpending) * 100

      if (percentage > 40) {
        insights.push({
          type: "info",
          title: "Top Spending Category",
          description: `${topCategory[0]} accounts for ${percentage.toFixed(1)}% of your spending this month`,
          icon: Target,
          color: "text-blue-600",
        })
      }
    }

    return insights.slice(0, 6) // Limit to 6 insights
  }, [transactions, budgets, currentMonth])

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Add more transactions and budgets to see personalized insights
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{insight.title}</p>
                    <Badge
                      variant={
                        insight.type === "warning"
                          ? "destructive"
                          : insight.type === "caution"
                            ? "secondary"
                            : insight.type === "success"
                              ? "default"
                              : "outline"
                      }
                      className="text-xs"
                    >
                      {insight.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
