import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { businessRoutes } from "@/core/routes/business.routes";
import { Button } from "@/components/ui/button";
import { cn } from "@/core/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SideBarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function BusinessUserSideBar({
  collapsed,
  setCollapsed,
}: SideBarProps) {
  const { logout } = useAuth();

  return (
    <div
      className={cn(
        "h-screen bg-card border-r flex flex-col fixed left-0 top-0 transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center h-16 border-b",
          collapsed ? "justify-center" : "px-6",
        )}
      >
        <div className="flex items-center gap-2 font-bold text-xl text-primary font-display overflow-hidden whitespace-nowrap">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            F
          </div>
          <span
            className={cn(
              "transition-all duration-300 opacity-100",
              collapsed && "opacity-0 w-0",
            )}
          >
            FarmShare
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-muted z-50 text-muted-foreground"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <div className="flex-1 px-2 py-2 space-y-2 overflow-y-auto overflow-x-hidden">
        {businessRoutes.map((route) => {
          if (route.section === "secondary") return null;

          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  collapsed ? "justify-center px-2" : "",
                )
              }
              title={collapsed ? route.name : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-medium">{route.name}</span>}
            </NavLink>
          );
        })}
      </div>

      <div
        className={cn(
          "p-2 border-t space-y-2",
          collapsed ? "items-center flex flex-col" : "p-4",
        )}
      >
        {businessRoutes.map((route) => {
          if (route.section !== "secondary" || route.name === "Logout")
            return null;
          const Icon = route.icon;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors whitespace-nowrap w-full",
                  isActive
                    ? "bg-muted text-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  collapsed ? "justify-center px-2" : "",
                )
              }
              title={collapsed ? route.name : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-medium">{route.name}</span>}
            </NavLink>
          );
        })}

        <Button
          variant="ghost"
          className={cn(
            "w-full gap-3 px-3 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 whitespace-nowrap",
            collapsed ? "justify-center px-2" : "justify-start",
          )}
          onClick={() => logout()}
          title={collapsed ? "Logout" : undefined}
        >
          {businessRoutes.find((r) => r.name === "Logout")?.icon &&
            (() => {
              const Icon = businessRoutes.find(
                (r) => r.name === "Logout",
              )!.icon;
              return <Icon className="h-5 w-5 shrink-0" />;
            })()}
          {!collapsed && <span className="font-medium">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
