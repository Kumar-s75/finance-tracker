"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart"
import { CategoryPieChart } from "@/components/charts/category-pie-chart"
import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart"
import { BudgetForm } from "@/components/budget-form"
import { DashboardCards } from "@/components/dashboard-cards"
import { SpendingInsights } from "@/components/spending-insights"
import { useToast } from "@/hooks/use-toast"
import type { Transaction, Budget } from "@/lib/types"
import { Loader2, RefreshCw } from "lucide-react"

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7))
  const { toast } = useToast()

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    try {
      const [transactionsRes, budgetsRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch(`/api/budgets?month=${currentMonth}`),
      ])

      if (!transactionsRes.ok || !budgetsRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const [transactionsData, budgetsData] = await Promise.all([transactionsRes.json(), budgetsRes.json()])

      setTransactions(transactionsData)
      setBudgets(budgetsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budgets?month=${currentMonth}`)
      if (response.ok) {
        const budgetsData = await response.json()
        setBudgets(budgetsData)
      }
    } catch (error) {
      console.error("Failed to fetch budgets:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchBudgets()
  }, [currentMonth])

  const handleRefresh = () => {
    fetchData(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your financial data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personal Finance Visualizer</h1>
            <p className="text-muted-foreground">Track and manage your personal finances</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <TransactionForm onSuccess={() => fetchData()} />
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardCards transactions={transactions} />

            <div className="grid gap-6 md:grid-cols-2">
              <MonthlyExpensesChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SpendingInsights transactions={transactions} budgets={budgets} currentMonth={currentMonth} />
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction._id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div
                            className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Transactions</h2>
              <TransactionForm onSuccess={() => fetchData()} />
            </div>
            <TransactionList transactions={transactions} onUpdate={() => fetchData()} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <MonthlyExpensesChart transactions={transactions} />
              <div className="grid gap-6 lg:grid-cols-2">
                <CategoryPieChart transactions={transactions} />
                <BudgetComparisonChart transactions={transactions} budgets={budgets} currentMonth={currentMonth} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl font-bold">Budget Management</h2>
                <p className="text-muted-foreground">Set and track your monthly budgets</p>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={currentMonth} onValueChange={setCurrentMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const date = new Date()
                      date.setMonth(date.getMonth() - 6 + i)
                      const monthStr = date.toISOString().slice(0, 7)
                      return (
                        <SelectItem key={monthStr} value={monthStr}>
                          {date.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <BudgetForm currentMonth={currentMonth} onSuccess={() => fetchBudgets()} />
              </div>
            </div>

            <div className="grid gap-6">
              <BudgetComparisonChart transactions={transactions} budgets={budgets} currentMonth={currentMonth} />

              <Card>
                <CardHeader>
                  <CardTitle>Budget Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {budgets.length > 0 ? (
                    <div className="space-y-4">
                      {budgets.map((budget) => {
                        const spent = transactions
                          .filter((t) => {
                            const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
                            return (
                              t.type === "expense" &&
                              t.category === budget.category &&
                              transactionMonth === currentMonth
                            )
                          })
                          .reduce((sum, t) => sum + t.amount, 0)

                        const percentage = (spent / budget.amount) * 100
                        const remaining = budget.amount - spent

                        return (
                          <div key={budget._id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">{budget.category}</h3>
                              <div className="text-sm text-muted-foreground">
                                ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className={`h-2 rounded-full ${
                                  percentage > 100 ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500"
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className={remaining >= 0 ? "text-green-600" : "text-red-600"}>
                                {remaining >= 0
                                  ? `$${remaining.toFixed(2)} remaining`
                                  : `$${Math.abs(remaining).toFixed(2)} over budget`}
                              </span>
                              <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No budgets set for this month. Click "Set Budget" to get started.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
