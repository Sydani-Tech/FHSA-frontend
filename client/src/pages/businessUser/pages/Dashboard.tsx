import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useUserDashboardStats } from "@/hooks/use-stats";
import { useBookings } from "@/hooks/use-bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  TrendingUp,
  Users,
  Package,
  ArrowRight,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: stats, isLoading: isStatsLoading } = useUserDashboardStats();
  const { data: requests, isLoading: isRequestsLoading } = useBookings();

  if (isAuthLoading || isStatsLoading || isRequestsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Mock data for the chart if no real historical data yet
  const chartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 550 },
    { name: "Apr", value: 480 },
    { name: "May", value: 650 },
    { name: "Jun", value: 700 },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.business_name || user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg shadow-black/5 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.total_bookings || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time bookings
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-black/5 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Bookings
              </CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.pending_bookings || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-black/5 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Bookings
              </CardTitle>
              <Truck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.active_bookings || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                In possession or paid
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-black/5 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Bookings
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.completed_bookings || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Returned and closed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Split */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg shadow-black/5 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Requests</CardTitle>
                <Link to="/bookings">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No requests found.
                    </div>
                  ) : (
                    requests?.slice(0, 5).map((req: any) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {req.id}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Request #{req.id}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {req.purpose}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            req.status === "pending" ? "secondary" : "outline"
                          }
                        >
                          {req.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg shadow-black/5 border-primary/10">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-6">
            {/* <Card className="bg-primary text-primary-foreground shadow-xl shadow-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Premium Membership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-primary-foreground/90">
                  Unlock advanced analytics and priority support.
                </p>
                <Button className="w-full font-bold bg-white text-primary">
                  Upgrade Now
                </Button>
              </CardContent>
            </Card> */}

            <Card className="shadow-lg shadow-black/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start">
                  Find Equipment
                </Button>
                <Button variant="outline" className="justify-start">
                  My Schedule
                </Button>
                <Button variant="outline" className="justify-start">
                  Help Center
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
