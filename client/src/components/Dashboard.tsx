import { useLocation } from "react-router-dom";
import RunList from "./RunLogs/RunList";
import StatisticsDashboard from "./Statistics/StatisticsDashboard";

export default function Dashboard() {
  const { hash } = useLocation();

  return (
    <>
      {hash === "#logs" ? (
        <RunList />
      ) : hash === "#stats" ? (
        <StatisticsDashboard />
      ) : hash === "state3" ? (
        <div>State 3 content</div>
      ) : hash === "state4" ? (
        <div>State 4 content</div>
      ) : (
        <RunList />
      )}
    </>
  );
}
