import { useState } from "react";
import { useAssets } from "@/hooks/use-assets";
import { useBookings } from "@/hooks/use-bookings";
import { AssetCard } from "@/components/AssetCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Filter, Loader2 } from "lucide-react";

export default function AssetsList() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");

  const { data: assets, isLoading } = useAssets({
    search: search || undefined,
    type: type !== "all" ? type : undefined,
  });

  const { data: bookings } = useBookings();

  const getIsRequested = (assetId: number) => {
    return bookings
      ? bookings.some(
          (b) =>
            b.asset_id === assetId &&
            b.status !== "cancelled" &&
            b.status !== "returned",
        )
      : false;
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="container mx-auto px-4 sm:px-6 lg:px-4 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">
              Browse Assets
            </h1>
            <p className="text-muted-foreground mt-2">
              Find the equipment you need for your next harvest.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cold_storage">Cold Storage</SelectItem>
                <SelectItem value="oven">Processing (Ovens)</SelectItem>
                <SelectItem value="truck">Logistics (Trucks)</SelectItem>
                <SelectItem value="tractor">Machinery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[400px] rounded-xl bg-muted/20 animate-pulse"
              />
            ))}
          </div>
        ) : assets?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground">
              No assets found
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              We couldn't find any assets matching your search. Try adjusting
              your filters.
            </p>
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("");
                setType("all");
              }}
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets?.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                isRequested={getIsRequested(asset.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
