import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")

    const db = await getDatabase()
    const query = month ? { month } : {}

    const budgets = await db.collection("budgets").find(query).toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, amount, month } = body

    if (!category || !amount || !month) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if budget already exists for this category and month
    const existingBudget = await db.collection("budgets").findOne({
      category,
      month,
    })

    if (existingBudget) {
      // Update existing budget
      await db.collection("budgets").updateOne(
        { category, month },
        {
          $set: {
            amount: Number.parseFloat(amount),
            updatedAt: new Date().toISOString(),
          },
        },
      )
    } else {
      // Create new budget
      await db.collection("budgets").insertOne({
        category,
        amount: Number.parseFloat(amount),
        month,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating/updating budget:", error)
    return NextResponse.json({ error: "Failed to create/update budget" }, { status: 500 })
  }
}
