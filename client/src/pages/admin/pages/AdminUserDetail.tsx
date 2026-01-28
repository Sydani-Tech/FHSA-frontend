import { useParams, Link } from "react-router-dom";
import { useUser } from "@/core/services/user.service";
import { useBookings } from "@/hooks/use-bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  ShieldAlert,
  Hash,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  ValidationModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

export default function AdminUserDetail() {
  const { id } = useParams();
  const userId = Number(id);
  const navigate = useNavigate();

  const { data: user, isLoading: isLoadingUser, error } = useUser(userId);
  const { data: allBookings = [], isLoading: isLoadingBookings } =
    useBookings();

  // Filter bookings for this user client-side since we don't have a specific endpoint yet
  // Ideally backend should support /api/users/{id}/bookings
  const userBookings = useMemo(() => {
    return allBookings.filter((b) => b.user_id === userId);
  }, [allBookings, userId]);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "reference_code",
        headerName: "Ref Code",
        width: 130,
        cellClass: "font-medium flex items-center text-slate-900",
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1 font-mono text-xs">
            <Hash className="h-3 w-3 text-muted-foreground" />
            {params.value}
          </div>
        ),
      },
      {
        field: "asset",
        headerName: "Asset",
        flex: 1,
        cellClass: "text-slate-600 flex items-center",
        valueGetter: (params) =>
          params.data.asset?.name || `Asset #${params.data.asset_id}`,
      },
      {
        field: "dates",
        headerName: "Dates",
        width: 180,
        cellClass: "text-slate-600 flex items-center",
        valueGetter: (params) => {
          const start = params.data.dates?.start;
          const end = params.data.dates?.end;
          if (!start || !end) return "-";
          return `${format(new Date(start), "MMM d")} - ${format(new Date(end), "MMM d")}`;
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        cellClass: "flex items-center",
        cellRenderer: (params: any) => (
          <StatusBadge status={params.value} role="admin" />
        ),
      },
      {
        headerName: "Actions",
        width: 100,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
        cellRenderer: (params: any) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/bookings/${params.data.id}`)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-md transition-colors"
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [navigate],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: false,
      suppressMenu: true,
    }),
    [],
  );

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">User not found</h2>
        <Link to="/admin/users">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/admin/users">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-primary flex items-center gap-2">
            User Profile
            <span className="text-base font-normal text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full ml-2">
              #{user.id}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <div className="ml-auto">
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium capitalize 
                ${
                  user.status === "approved"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : user.status === "restricted"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Info Card */}
        <div className="space-y-6">
          <Card className="border-black/10">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Business Name</p>
                  <p className="font-medium">{user.business_name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium break-all">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{user.location || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Role</span>
                <span className="font-medium capitalize">
                  {user.role.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Joined</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Production Focus
                </p>
                <div className="flex flex-wrap gap-1">
                  {user.production_focus ? (
                    <span className="bg-muted px-2 py-1 rounded-md text-xs">
                      {user.production_focus}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm italic">
                      None specified
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="border-black/10 h-full flex flex-col shadow-none">
            <CardHeader className="pb-3 border-b">
              <CardTitle>Booking History ({userBookings.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {userBookings.length > 0 ? (
                <div className="ag-theme-quartz h-[500px] w-full">
                  <style>{`
            .ag-theme-quartz {
              --ag-header-height: 48px;
              --ag-header-foreground-color: #64748b;
              --ag-header-background-color: #f8fafc;
              --ag-row-height: 56px;
              --ag-border-color: #e2e8f0;
              --ag-row-hover-color: #f8fafc;
              --ag-font-size: 14px;
              --ag-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              --ag-checkbox-checked-color: #3b82f6;
              --ag-checkbox-unchecked-color: #d1d5db;
              --ag-checkbox-background-color: transparent;
            }
            
            .ag-theme-quartz .ag-header-cell {
              font-weight: 500;
              font-size: 13px;
              text-transform: none;
              letter-spacing: 0;
              padding-left: 16px;
              padding-right: 16px;
            }
            
            .ag-theme-quartz .ag-cell {
              padding-left: 16px;
              padding-right: 16px;
              line-height: 1.5;
            }
            
            .ag-theme-quartz .ag-row {
              border-bottom: 1px solid #f1f5f9;
            }
            
            .ag-theme-quartz .ag-row:hover {
              background-color: #f8fafc !important;
            }
            
            .ag-theme-quartz .ag-paging-panel {
              border-top: 1px solid #e2e8f0;
              padding: 12px 16px;
              background-color: #ffffff;
            }
            
            .ag-theme-quartz .ag-root-wrapper {
              border: none;
            }
                  `}</style>
                  <AgGridReact
                    rowData={userBookings}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    rowHeight={56}
                    headerHeight={48}
                    suppressCellFocus={true}
                    animateRows={true}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <ShieldAlert className="h-10 w-10 mb-2 opacity-20" />
                  <p>No bookings found for this user.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
