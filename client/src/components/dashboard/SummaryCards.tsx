import { ArrowDownRight, ArrowUpRight, Wallet, PiggyBank } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useSavings } from "@/hooks/useSavings";

import { calculateFinanceSummary } from "@/services/financeService";

export default function SummaryCards() {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { savings } = useSavings();

  const {
    balance,
    income,
    expenses,
    savings: totalSavings,
  } = calculateFinanceSummary(transactions, accounts, savings);

  const cards = [
    {
      title: "Total Balance",
      value: balance,
      icon: Wallet,
    },
    {
      title: "Income",
      value: income,
      icon: ArrowUpRight,
    },
    {
      title: "Expenses",
      value: expenses,
      icon: ArrowDownRight,
    },
    {
      title: "Savings",
      value: totalSavings,
      icon: PiggyBank,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>

              <Icon className="size-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                Rs. {card.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
