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
                {spendingData.map((entry) => (
                  <Cell key={entry.category} />
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
