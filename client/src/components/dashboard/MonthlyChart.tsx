import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTransactions } from "@/hooks/useTransactions";

export default function MonthlyChart() {
  const { transactions } = useTransactions();

  const monthlyData = transactions.reduce<
    {
      key: string;
      month: string;
      income: number;
      expenses: number;
    }[]
  >((result, transaction) => {
    const date = new Date(transaction.date);

    const year = date.getFullYear();
    const monthIndex = date.getMonth();

    const key = `${year}-${monthIndex}`;

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    let existingMonth = result.find((item) => item.key === key);

    if (!existingMonth) {
      existingMonth = {
        key,
        month: `${month} ${year}`,
        income: 0,
        expenses: 0,
      };

      result.push(existingMonth);
    }

    if (transaction.type === "income") {
      existingMonth.income += transaction.amount;
    } else {
      existingMonth.expenses += transaction.amount;
    }

    return result;
  }, []);

  monthlyData.sort((a, b) => a.key.localeCompare(b.key));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip
                formatter={(value) => `Rs. ${Number(value).toLocaleString()}`}
              />

              <Legend />

              <Bar
                dataKey="income"
                name="Income"
                fill="currentColor"
                className="text-green-500"
              />

              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="currentColor"
                className="text-red-500"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
