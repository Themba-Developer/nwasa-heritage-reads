import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNwasa } from "@/lib/nwasa-store";
import { TabBar } from "@/components/nwasa/TabBar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user } = useNwasa();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
    else if (!user.onboarded) navigate({ to: "/onboarding" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl pb-28">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}
