import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Check, Eye, ChevronDown, Hash, Download } from "lucide-react";
import { useBookings, useUpdateBookingStatus } from "@/hooks/use-bookings";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  ValidationModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// Register modules
ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

import { useNavigate } from "react-router-dom";

export default function AdminBookings() {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const updateStatusMutation = useUpdateBookingStatus();

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilterDropdown, setStatusFilterDropdown] = useState("all");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const statusOptions = [
    "pending",
    "awaiting_payment",
    "paid",
    "in_possession",
    "returned",
    "overdue",
    "cancelled",
  ];

  // Filter logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.reference_code
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.user?.business_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.asset?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDropdown =
        statusFilterDropdown === "all" ||
        booking.status === statusFilterDropdown;

      const matchesColumnFilter =
        statusFilters.length === 0 || statusFilters.includes(booking.status);

      return matchesSearch && matchesDropdown && matchesColumnFilter;
    });
  }, [bookings, searchQuery, statusFilterDropdown, statusFilters]);

  // Headers
  const StatusHeaderComponent = () => (
    <div className="flex items-center justify-between w-full">
      <span>Status</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="ml-2 hover:bg-slate-100 rounded p-1">
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {statusOptions.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={statusFilters.includes(status)}
              onCheckedChange={(checked) => {
                setStatusFilters((prev) =>
                  checked
                    ? [...prev, status]
                    : prev.filter((s) => s !== status),
                );
              }}
            >
              <StatusBadge status={status} role="admin" className="text-xs" />
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

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
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      {
        field: "user",
        headerName: "Company / User",
        flex: 1.2,
        cellClass: "text-slate-600 flex items-center",
        valueGetter: (params) => {
          const user = params.data.user;
          return user
            ? user.business_name || user.email
            : `User #${params.data.user_id}`;
        },
        cellRenderer: (params: any) => {
          const user = params.data.user;
          if (!user)
            return (
              <span className="text-muted-foreground">
                User #{params.data.user_id}
              </span>
            );
          return (
            <div className="flex flex-col justify-center h-full leading-tight py-1">
              <span className="font-medium text-slate-900">
                {user.business_name || "No Business Name"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          );
        },
      },
      {
        field: "asset",
        headerName: "Asset",
        flex: 1.2,
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
        headerComponent: StatusHeaderComponent,
        headerName: "Status",
        width: 160,
        cellClass: "flex items-center",
        cellRenderer: (params: any) => (
          <StatusBadge status={params.value} role="admin" />
        ),
      },
      {
        headerName: "Actions",
        width: 140,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
        cellRenderer: (params: any) => {
          const booking = params.data;
          if (!booking) return null;

          return (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/bookings/${booking.id}`);
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-md transition-colors"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>

              {booking.status === "pending" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatusMutation.mutate({
                      id: booking.id,
                      status: "awaiting_payment",
                    });
                  }}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-md transition-colors"
                  title="Approve Booking"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [navigate, updateStatusMutation, statusFilters],
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

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Manage and track all booking requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings, users, assets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilterDropdown}
            onValueChange={setStatusFilterDropdown}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {bookingsLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex-1 rounded-lg border bg-white shadow-sm overflow-hidden">
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
            
            /* Fix checkbox styling */
            .ag-theme-quartz .ag-checkbox-input-wrapper {
              width: 18px;
              height: 18px;
              font-size: 18px;
            }
            
            .ag-theme-quartz .ag-checkbox-input-wrapper input[type="checkbox"] {
              width: 18px;
              height: 18px;
              margin: 0;
              cursor: pointer;
            }
            
            .ag-theme-quartz .ag-checkbox-input-wrapper::after {
              display: none;
            }
            
            .ag-theme-quartz input[type="checkbox"] {
              appearance: none;
              -webkit-appearance: none;
              width: 18px;
              height: 18px;
              border: 1.5px solid #d1d5db;
              border-radius: 4px;
              outline: none;
              cursor: pointer;
              position: relative;
              background-color: white;
              transition: all 0.15s ease;
            }
            
            .ag-theme-quartz input[type="checkbox"]:hover {
              border-color: #9ca3af;
            }
            
            .ag-theme-quartz input[type="checkbox"]:checked {
              background-color: #3b82f6;
              border-color: #3b82f6;
            }
            
            .ag-theme-quartz input[type="checkbox"]:checked::after {
              content: "";
              position: absolute;
              left: 5px;
              top: 2px;
              width: 5px;
              height: 9px;
              border: solid white;
              border-width: 0 2px 2px 0;
              transform: rotate(45deg);
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
          <div
            className="ag-theme-quartz"
            style={{ height: "600px", width: "100%" }}
          >
            <AgGridReact
              rowData={filteredBookings}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              rowHeight={56}
              headerHeight={48}
              suppressCellFocus={true}
              rowSelection="multiple"
              rowMultiSelectWithClick={true}
              animateRows={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
