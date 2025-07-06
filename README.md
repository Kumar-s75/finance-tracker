# Personal Finance Visualizer

A comprehensive web application for tracking and managing personal finances with interactive charts, budgeting tools, and spending insights.

## Features

### Stage 1: Basic Transaction Tracking ✅
- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with sorting and filtering
- ✅ Monthly expenses bar chart
- ✅ Form validation with error handling
- ✅ Responsive design

### Stage 2: Categories ✅
- ✅ Predefined categories for transactions
- ✅ Category-wise pie chart visualization
- ✅ Dashboard with summary cards
- ✅ Total expenses and category breakdown
- ✅ Recent transactions display

### Stage 3: Budgeting ✅
- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison chart
- ✅ Spending insights and alerts
- ✅ Budget progress tracking
- ✅ Over-budget notifications

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB with native driver
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd personal-finance-visualizer
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your MongoDB connection string:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/finance-tracker
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Transactions
1. Click "Add Transaction" button
2. Fill in amount, description, category, date, and type
3. Submit to save the transaction

### Setting Budgets
1. Go to the "Budgets" tab
2. Select the month you want to set a budget for
3. Click "Set Budget" and choose category and amount
4. Track your progress with visual indicators

### Viewing Analytics
- **Dashboard**: Overview of current month's finances
- **Transactions**: Complete list of all transactions
- **Analytics**: Detailed charts and visualizations
- **Budgets**: Budget management and tracking

## Features Implemented

### ✅ All Required Features
- **Transaction Management**: Full CRUD operations
- **Categories**: 10 predefined categories
- **Charts**: Monthly expenses, category breakdown, budget comparison
- **Budgeting**: Monthly budget setting and tracking
- **Insights**: Smart spending analysis and alerts
- **Responsive Design**: Works on all device sizes
- **Error Handling**: Comprehensive error states and validation

### Additional Features
- **Real-time Updates**: Automatic data refresh
- **Progress Indicators**: Visual budget progress bars
- **Smart Insights**: Automated spending pattern analysis
- **Month Navigation**: Easy switching between months
- **Recent Transactions**: Quick overview of latest activity

## Database Schema

### Transactions Collection
\`\`\`javascript
{
  _id: ObjectId,
  amount: Number,
  description: String,
  category: String,
  date: String (ISO date),
  type: "income" | "expense",
  createdAt: String (ISO date),
  updatedAt: String (ISO date)
}
\`\`\`

### Budgets Collection
\`\`\`javascript
{
  _id: ObjectId,
  category: String,
  amount: Number,
  month: String (YYYY-MM format),
  createdAt: String (ISO date),
  updatedAt: String (ISO date)
}
\`\`\`

## API Endpoints

- \`GET /api/transactions\` - Fetch all transactions
- \`POST /api/transactions\` - Create new transaction
- \`PUT /api/transactions/[id]\` - Update transaction
- \`DELETE /api/transactions/[id]\` - Delete transaction
- \`GET /api/budgets?month=YYYY-MM\` - Fetch budgets for month
- \`POST /api/budgets\` - Create/update budget

## Deployment

The application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your \`MONGODB_URI\` environment variable in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
