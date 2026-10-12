import { useQuery } from "@tanstack/react-query";
import { getMonthly } from "@/api/reports";
import { Loadable } from "@/components/report/Loadable";
import { MonthlyChart } from "@/components/report/MonthlyChart";
import { Ranking } from "@/components/report/Ranking";
import { Transactions } from "@/components/report/Transactions";

export default function ReportPage() {
  const monthly = useQuery({ queryKey: ["reports", "monthly"], queryFn: () => getMonthly(12) });

  return (
    <div>
      <h1 className="mb-5 font-display text-3xl font-semibold tracking-tight">Report</h1>
      <div className="md:grid md:grid-cols-2 md:items-start md:gap-x-12">
        <div>
          <Loadable query={monthly} height="h-72">
            {(data) => <MonthlyChart data={data} />}
          </Loadable>
          <Ranking />
        </div>
        <Transactions />
      </div>
    </div>
  );
}
