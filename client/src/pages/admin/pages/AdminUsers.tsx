import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Trash2, ChevronDown } from "lucide-react";
import {
  useUsers,
  useUpdateUserStatus,
  useDeleteUser,
} from "@/core/services/user.service";
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

// Register all community modules
ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const updateUserStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();

  // Filter states
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [roleFilters, setRoleFilters] = useState<string[]>([]);

  // Available filter options
  const statusOptions = ["approved", "pending", "restricted"];
  const roleOptions = ["admin", "business_user"];

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(user.status);
      const matchesRole =
        roleFilters.length === 0 || roleFilters.includes(user.role);
      return matchesStatus && matchesRole;
    });
  }, [users, statusFilters, roleFilters]);

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "restricted":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Custom header component with dropdown filter
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
              <span className="capitalize">{status}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const RoleHeaderComponent = () => (
    <div className="flex items-center justify-between w-full">
      <span>Role</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="ml-2 hover:bg-slate-100 rounded p-1">
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {roleOptions.map((role) => (
            <DropdownMenuCheckboxItem
              key={role}
              checked={roleFilters.includes(role)}
              onCheckedChange={(checked) => {
                setRoleFilters((prev) =>
                  checked ? [...prev, role] : prev.filter((r) => r !== role),
                );
              }}
            >
              <span className="capitalize">{role.replace("_", " ")}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "email",
        headerName: "User (Email)",
        flex: 2,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        filter: false,
        cellClass: "font-medium text-slate-900 flex items-center",
      },
      {
        field: "business_name",
        headerName: "Business Name",
        flex: 1.5,
        filter: false,
        cellClass: "text-slate-600 flex items-center",
        valueFormatter: (params) => params.value || "-",
      },
      {
        field: "status",
        headerComponent: StatusHeaderComponent,
        width: 150,
        filter: false,
        cellClass: "flex items-center",
        cellRenderer: (params: any) => {
          // Lighter, pill-shaped badges
          let className =
            "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium capitalize ";
          if (params.value === "approved")
            className +=
              "bg-emerald-50 text-emerald-700 border border-emerald-200";
          else if (params.value === "pending")
            className += "bg-amber-50 text-amber-700 border border-amber-200";
          else if (params.value === "restricted")
            className += "bg-rose-50 text-rose-700 border border-rose-200";
          else
            className += "bg-slate-50 text-slate-600 border border-slate-200";

          return <span className={className}>{params.value}</span>;
        },
      },
      {
        field: "role",
        headerComponent: RoleHeaderComponent,
        width: 150,
        filter: false,
        cellClass: "text-slate-600 capitalize flex items-center",
        cellRenderer: (params: any) => (
          <span className="text-slate-600 capitalize text-sm">
            {params.value?.replace("_", " ")}
          </span>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const user = params.data;
          if (!user) return null;

          return (
            <div className="flex gap-2 items-center h-full">
              <button
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-md transition-colors"
                title="Approve"
                onClick={(e) => {
                  e.stopPropagation();
                  updateUserStatusMutation.mutate({
                    id: user.id,
                    status:
                      user.status === "pending" ? "approved" : user.status,
                  });
                }}
              >
                <Check className="h-4 w-4" />
              </button>

              <button
                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteUserMutation.mutate(user.id);
                }}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [updateUserStatusMutation, deleteUserMutation, statusFilters, roleFilters],
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
    <Card className="h-[650px] border-balck/10 flex flex-col border shadow-sm bg-card">
      <CardHeader className="px-6 py-4 border-b">
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {usersLoading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
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
                
                /* Fix checkbox styling to remove double border appearance */
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
            <div className="ag-theme-quartz  h-full w-full">
              <AgGridReact
                rowData={filteredUsers}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                rowHeight={56}
                headerHeight={48}
                suppressCellFocus={true}
                rowSelection="multiple"
                animateRows={true}
                onRowClicked={(event) => {
                  navigate(`/admin/users/${event.data.id}`);
                }}
                rowClass="cursor-pointer hover:bg-slate-50"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
