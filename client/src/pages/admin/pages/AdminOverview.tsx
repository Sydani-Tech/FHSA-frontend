import { Users, Package, FileText, TrendingUp } from "lucide-react";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboardStats } from "@/hooks/use-stats";
import { useBookings } from "@/hooks/use-bookings";
import { useAssets } from "@/core/services/asset.service";

export default function AdminOverview() {
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();
  const { data: bookings = [] } = useBookings();
  const { data: assets = [] } = useAssets();

  const bookingStatusData = [
    {
      name: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      itemStyle: { color: "hsl(47, 96%, 53%)" },
    },
    {
      name: "Active",
      value: bookings.filter((b) =>
        ["awaiting_payment", "paid", "in_possession"].includes(b.status),
      ).length,
      itemStyle: { color: "hsl(142, 76%, 36%)" },
    },
    {
      name: "Completed/Rejected",
      value: bookings.filter((b) =>
        ["returned", "rejected", "cancelled"].includes(b.status),
      ).length,
      itemStyle: { color: "hsl(0, 84%, 60%)" },
    },
  ];

  const assetTypeData = assets.reduce(
    (acc: { name: string; count: number }[], asset) => {
      const existing = acc.find((a) => a.name === asset.type);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: asset.type, count: 1 });
      }
      return acc;
    },
    [],
  );

  const pieOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "0%",
      left: "center",
    },
    series: [
      {
        name: "Booking Status",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: bookingStatusData,
      },
    ],
  };

  const barOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: assetTypeData.map((d) => d.name),
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Count",
        type: "bar",
        barWidth: "60%",
        data: assetTypeData.map((d) => ({
          value: d.count,
          itemStyle: { color: "hsl(142, 76%, 36%)" },
        })),
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-lg shadow-black/5 border-primary/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div
              className="text-3xl font-bold tracking-tight"
              data-testid="stat-users"
            >
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                stats?.total_users || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active platform accounts
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-black/5 border-primary/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Assets
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div
              className="text-3xl font-bold tracking-tight"
              data-testid="stat-assets"
            >
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                stats?.active_assets || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for booking
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-black/5 border-primary/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div
              className="text-3xl font-bold tracking-tight"
              data-testid="stat-pending"
            >
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                stats?.pending_requests || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-black/5 border-primary/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assets With Users
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div
              className="text-3xl font-bold tracking-tight"
              data-testid="stat-in-possession"
            >
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                stats?.assets_in_possession || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently dispatched
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-black/5 border-primary/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div
              className="text-3xl font-bold tracking-tight"
              data-testid="stat-completion"
            >
              {(stats?.total_requests || 0) > 0
                ? Math.round(
                    ((stats?.completed_requests || 0) /
                      (stats?.total_requests || 1)) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Returned successfully
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg shadow-black/5 border-primary/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Request Status Distribution
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ReactECharts
              option={pieOption}
              style={{ height: "100%", width: "100%" }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-black/5 border-primary/10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assets by Type
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ReactECharts
              option={barOption}
              style={{ height: "100%", width: "100%" }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
