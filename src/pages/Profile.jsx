import React, { useEffect } from "react";
import DashboardCenterPane from "../components/dashboard/DashboardCenterPane";
import DashboardRightPane from "../components/dashboard/DashboardRightPane";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { useDashboardStore } from "../store/useDashboardStore";

const Profile = () => {
  const profile = useDashboardStore((state) => state.profile);
  const workspaces = useDashboardStore((state) => state.workspaces);
  const activityFeed = useDashboardStore((state) => state.activityFeed);
  const chartData = useDashboardStore((state) => state.chartData);
  const stats = useDashboardStore((state) => state.stats);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const fetchDashboardData = useDashboardStore((state) => state.fetchDashboardData);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="min-h-screen bg-(--surface-primary) text-(--text-primary)">
      <div className="grid min-h-screen grid-cols-[220px_minmax(720px,1fr)_360px]">
        <DashboardSidebar />
        <DashboardCenterPane
          profile={profile}
          workspaces={workspaces}
          isLoading={isLoading}
        />
        <DashboardRightPane
          activityFeed={activityFeed}
          chartData={chartData}
          stats={stats}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Profile;
