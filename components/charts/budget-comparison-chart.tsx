"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction, Budget } from "@/lib/types"

interface BudgetComparisonChartProps {
  transactions: Transaction[]
  budgets: Budget[]
  currentMonth: string
}

export function BudgetComparisonChart({ transactions, budgets, currentMonth }: BudgetComparisonChartProps) {
  const chartData = useMemo(() => {
    // Get current month's expenses by category
    const currentMonthExpenses: Record<string, number> = {}

    transactions
      .filter((t) => {
        const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
        return t.type === "expense" && transactionMonth === currentMonth
      })
      .forEach((transaction) => {
        currentMonthExpenses[transaction.category] =
          (currentMonthExpenses[transaction.category] || 0) + transaction.amount
      })

    // Get current month's budgets
    const currentMonthBudgets = budgets.filter((b) => b.month === currentMonth)

    // Combine data
    const categories = new Set([...Object.keys(currentMonthExpenses), ...currentMonthBudgets.map((b) => b.category)])

    return Array.from(categories)
      .map((category) => {
        const budget = currentMonthBudgets.find((b) => b.category === category)
        const actual = currentMonthExpenses[category] || 0
        const budgetAmount = budget?.amount || 0

        return {
          category: category.length > 15 ? category.slice(0, 15) + "..." : category,
          budget: budgetAmount,
          actual: actual,
          remaining: Math.max(0, budgetAmount - actual),
          over: Math.max(0, actual - budgetAmount),
        }
      })
      .filter((item) => item.budget > 0 || item.actual > 0)
  }, [transactions, budgets, currentMonth])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600">Budget: </span>
              {formatCurrency(data.budget)}
            </p>
            <p className="text-sm">
              <span className="text-green-600">Actual: </span>
              {formatCurrency(data.actual)}
            </p>
            {data.over > 0 && (
              <p className="text-sm">
                <span className="text-red-600">Over budget: </span>
                {formatCurrency(data.over)}
              </p>
            )}
            {data.remaining > 0 && (
              <p className="text-sm">
                <span className="text-gray-600">Remaining: </span>
                {formatCurrency(data.remaining)}
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No budget data available for this month
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Budget vs Actual -{" "}
          {new Date(currentMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="budget" fill="hsl(var(--chart-1))" name="Budget" radius={[2, 2, 0, 0]} />
              <Bar dataKey="actual" fill="hsl(var(--chart-2))" name="Actual" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
