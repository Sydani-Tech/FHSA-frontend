import type { Asset } from "@/core/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AssetCardProps {
  asset: Asset;
  isRequested?: boolean;
}

export function AssetCard({ asset, isRequested }: AssetCardProps) {
  // Use a random Unsplash image if no images provided, based on type
  const getImage = (type: string) => {
    switch (type.toLowerCase()) {
      case "cold_storage":
        return "https://images.unsplash.com/photo-1585834896791-c67d6435c24b?auto=format&fit=crop&q=80&w=800"; // Warehouse
      case "oven":
        return "https://images.unsplash.com/photo-1585517173874-985871c50493?auto=format&fit=crop&q=80&w=800"; // Bakery oven
      case "truck":
        return "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800"; // Truck
      default:
        return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"; // Generic farm
    }
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full flex flex-col relative">
      <div className="relative h-48 overflow-hidden">
        {/* Descriptive alt text for Unsplash image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={asset.images?.[0] || getImage(asset.type)}
          alt={asset.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {isRequested && (
            <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 backdrop-blur-sm shadow-md animate-in fade-in zoom-in">
              Requested
            </Badge>
          )}
          <Badge className="bg-white/90 text-foreground hover:bg-white backdrop-blur-sm">
            {asset.type.replace("_", " ")}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 z-20 text-white font-medium flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-accent" />
          {asset.location}
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold font-display line-clamp-1 group-hover:text-primary transition-colors">
          {asset.name}
        </h3>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {asset.description || "No description provided."}
        </p>

        <div className="flex items-center gap-4 text-sm font-medium text-foreground/80">
          <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary-foreground px-2.5 py-1 rounded-md">
            <DollarSign className="h-4 w-4" />
            <span>
              ₦{Number(asset.cost).toLocaleString()} /{" "}
              {asset.duration_options?.[0] || "unit"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 mt-auto">
        <Link to={`/marketplace/${asset.id}`} className="w-full">
          <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            {isRequested ? "View Request Status" : "View Details"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
