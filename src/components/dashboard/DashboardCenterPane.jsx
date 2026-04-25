import React from "react";
import DashboardProfileSummary from "./DashboardProfileSummary";
import DashboardWorkspaces from "./DashboardWorkspaces";

const DashboardCenterPane = ({ profile, workspaces, isLoading }) => {
  return (
    <main className="min-h-screen overflow-y-auto bg-(--surface-primary) px-8 py-8 font-satoshi">
      <DashboardProfileSummary profile={profile} />
      <DashboardWorkspaces workspaces={workspaces} isLoading={isLoading} />
    </main>
  );
};

export default DashboardCenterPane;
