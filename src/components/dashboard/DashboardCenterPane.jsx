import React from "react";
import DashboardProfileSummary from "./DashboardProfileSummary";
import DashboardWorkspaces from "./DashboardWorkspaces";

const DashboardCenterPane = ({ profile, workspaces, isLoading }) => {
  return (
    <main className="h-screen overflow-hidden bg-(--surface-primary) px-7 py-7 font-satoshi">
      <DashboardProfileSummary profile={profile} />
      <DashboardWorkspaces workspaces={workspaces} isLoading={isLoading} />
    </main>
  );
};

export default DashboardCenterPane;
