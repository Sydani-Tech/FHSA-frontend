import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  MapPin,
  Archive,
  Eye,
  Edit,
  ChevronDown,
  Clock,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAssets } from "@/core/services/asset.service";

import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  ValidationModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

export default function AdminAssets() {
  const navigate = useNavigate();
  const { data: assets = [], isLoading: assetsLoading } = useAssets();

  // State for view mode and filters
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Column filter states
  const [columnTypeFilters, setColumnTypeFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  // Available filter options
  const typeOptions = ["Equipment", "Storage", "Facility", "Logistics"];
  const statusOptions = ["Published", "Draft"];

  // Filter logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTypeDropdown =
        typeFilter === "all" || asset.type === typeFilter;

      // Column filters
      const matchesColumnType =
        columnTypeFilters.length === 0 ||
        columnTypeFilters.includes(asset.type);
      const matchesStatus =
        statusFilters.length === 0 ||
        (statusFilters.includes("Published") && asset.active) ||
        (statusFilters.includes("Draft") && !asset.active);

      return (
        matchesSearch &&
        matchesTypeDropdown &&
        matchesColumnType &&
        matchesStatus
      );
    });
  }, [assets, searchQuery, typeFilter, columnTypeFilters, statusFilters]);

  // Custom header components with dropdown filters
  const TypeHeaderComponent = () => (
    <div className="flex items-center justify-between w-full">
      <span>Type</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="ml-2 hover:bg-slate-100 rounded p-1">
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {typeOptions.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={columnTypeFilters.includes(type)}
              onCheckedChange={(checked) => {
                setColumnTypeFilters((prev) =>
                  checked ? [...prev, type] : prev.filter((t) => t !== type),
                );
              }}
            >
              {type}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

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
              {status}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // AG Grid Defs with improved styling
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1.5,
        filter: false,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        cellClass: "font-medium flex text-slate-900",
      },
      {
        field: "type",
        headerComponent: TypeHeaderComponent,
        flex: 1,
        filter: false,
        cellClass: "text-slate-600 flex items-center",
      },
      {
        field: "active",
        headerComponent: StatusHeaderComponent,
        flex: 0.8,
        filter: false,
        cellClass: "flex items-center",
        cellRenderer: (params: any) => {
          const isActive = params.value === true;
          const isDraft = params.value === false;

          if (isActive) {
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Published
              </span>
            );
          } else if (isDraft) {
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                Draft
              </span>
            );
          } else {
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
                Unpublished
              </span>
            );
          }
        },
      },
      {
        field: "location",
        headerName: "Assigned Teams",
        flex: 1,
        filter: false,
        valueFormatter: (params) => params.value || "Unassigned",
        cellClass: "text-slate-600 flex items-center",
      },
      {
        field: "total_quantity",
        headerName: "Quantity",
        flex: 0.8,
        filter: false,
        valueFormatter: (params) => params.value || 1,
        cellClass: "text-slate-600 flex items-center",
      },
      {
        field: "updated_at",
        headerName: "Last Modified",
        flex: 1,
        sortable: true,
        filter: false,
        valueFormatter: (params) => {
          if (!params.value) return "Never";
          return new Date(params.value).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
        cellClass: "text-slate-600 flex items-center",
      },
      {
        headerName: "Actions",
        width: 160,
        sortable: false,
        filter: false,
        cellClass: "flex items-center",
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/assets/${params.data.id}`);
              }}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-md transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add delete functionality
              }}
              className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
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

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assets</h2>
          <p className="text-muted-foreground">
            Manage your marketplace inventory
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/assets/new")}
          data-testid="btn-add-asset"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Asset
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Storage">Storage</SelectItem>
              <SelectItem value="Facility">Facility</SelectItem>
              <SelectItem value="Logistics">Logistics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center border rounded-md p-1 bg-muted/50">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => setViewMode("list")}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {assetsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex-1">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              No assets found matching your criteria.
            </div>
          ) : viewMode === "list" ? (
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
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
              <div
                className="ag-theme-quartz"
                style={{ height: "600px", width: "100%" }}
              >
                <AgGridReact
                  rowData={filteredAssets}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={10}
                  rowHeight={56}
                  headerHeight={48}
                  suppressCellFocus={true}
                  rowSelection="multiple"
                  animateRows={true}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className="cursor-pointer shadow-lg shadow-black/5 border-primary/10 overflow-hidden relative group flex flex-col"
                  onClick={() => navigate(`/admin/assets/${asset.id}`)}
                >
                  <div className="aspect-video w-full bg-muted relative overflow-hidden">
                    {asset.images && asset.images.length > 0 ? (
                      <img
                        src={asset.images[0]}
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Archive className="h-10 w-10 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={asset.active ? "default" : "secondary"}
                        className="shadow-sm"
                      >
                        {asset.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle
                      className="text-base truncate"
                      title={asset.name}
                    >
                      {asset.name}
                    </CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{asset.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 w-full flex-1">
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs font-normal">
                        {asset.type}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-muted/50 flex justify-between items-center text-sm">
                    <span className="font-semibold">
                      ₦{Number(asset.cost).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      View Details
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
