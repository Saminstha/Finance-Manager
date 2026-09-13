import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTransactions } from "@/hooks/useTransactions";

const CHART_COLORS = [
  "#2f3f7a",
  "#1f9d8b",
  "#e08e45",
  "#c65b5b",
  "#7a6fd1",
  "#4f8fe0",
  "#3f9142",
  "#a8763e",
];

export default function SpendingChart() {
  const { transactions } = useTransactions();

  const spendingData = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<
      {
        category: string;
        amount: number;
      }[]
    >((result, transaction) => {
      const existingCategory = result.find(
        (item) => item.category === transaction.category,
      );

      if (existingCategory) {
        existingCategory.amount += transaction.amount;
      } else {
        result.push({
          category: transaction.category,
          amount: transaction.amount,
        });
      }

      return result;
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {spendingData.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => `Rs. ${Number(value).toLocaleString()}`}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
