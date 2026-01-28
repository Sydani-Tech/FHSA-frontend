import { useParams, useNavigate } from "react-router-dom";
import { useAsset } from "@/hooks/use-assets";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  MapPin,
  Check,
  User,
  Info,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: asset, isLoading } = useAsset(Number(id));
  const { mutate: createRequest, isPending: isSubmitting } = useCreateBooking();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });
  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!asset) {
    return <div className="text-center py-20">Asset not found</div>;
  }

  const handleRequest = () => {
    if (!user) {
      navigate("/auth?tab=login");
      return;
    }

    if (!date?.from || !date?.to) {
      // In a real app, show a toast here
      return;
    }

    createRequest(
      {
        asset_id: asset.id,
        dates: { start: date.from.toISOString(), end: date.to.toISOString() },
        purpose,
        quantity,
      },
      {
        onSuccess: () => setIsDialogOpen(false),
      },
    );
  };

  const handlePaymentMock = () => {
    handleRequest();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Image */}
      <div
        className="relative h-[400px] w-full overflow-hidden bg-muted cursor-pointer"
        onClick={() => setSelectedImage(asset.images?.[0] || null)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <img
          src={
            asset.images?.[0] ||
            "https://images.unsplash.com/photo-1585834896791-c67d6435c24b?auto=format&fit=crop&q=80&w=2000"
          }
          alt={asset.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
        />
        <div className="absolute bottom-0 left-0 z-20 container mx-auto px-4 pb-8">
          <Badge className="mb-4 bg-primary text-white hover:bg-primary/90">
            {asset.type.replace("_", " ")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground">
            {asset.name}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">{asset.location}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg shadow-black/5 border-primary/10 border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold font-display mb-4">
                  About this asset
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {asset.description || "No description provided."}
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-muted/30 p-4 rounded-xl">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" /> Specifications
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {asset.specs &&
                        Object.entries(asset.specs as Record<string, any>).map(
                          ([key, val]) => (
                            <li
                              key={key}
                              className="flex justify-between border-b border-border/50 pb-1 last:border-0"
                            >
                              <span className="capitalize">{key}:</span>
                              <span className="font-medium text-foreground">
                                {val}
                              </span>
                            </li>
                          ),
                        )}
                      {!asset.specs && <li>No specifications available</li>}
                    </ul>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-xl">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Check className="h-4 w-4 text-secondary" /> Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {/* Mock tags for visual completeness */}
                      <Badge variant="outline" className="bg-background">
                        Instant Booking
                      </Badge>
                      <Badge variant="outline" className="bg-background">
                        Verified Owner
                      </Badge>
                      <Badge variant="outline" className="bg-background">
                        Insurance Included
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gallery Section */}
            {asset.images && asset.images.length > 0 && (
              <Card className="shadow-lg shadow-black/5 border-primary/10">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold font-display mb-4">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {asset.images.map((img: string, i: number) => (
                      <div
                        key={i}
                        className="aspect-square relative rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Gallery ${i}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg shadow-black/5 border-primary/10">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold font-display mb-4">
                  Owner Info
                </h2>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      Platform Verified Partner
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Member since 2023
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    Contact Owner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24 shadow-xl border-border/60">
              <CardContent className="pt-6">
                <div className=" items-baseline justify-between mb-6 pb-6 border-b">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      ₦{Number(asset.cost).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      / {asset.duration_options?.[0] || "unit"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-secondary font-medium">
                    <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                    Available now:{" "}
                    {asset.available_quantity ?? asset.total_quantity}
                    {asset.total_quantity > 1 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({asset.total_quantity} units total)
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Quantity Input */}
                  <div className="border rounded-lg p-3">
                    <Label className="text-xs uppercase text-muted-foreground font-bold mb-2 block">
                      Quantity (Max: {asset.total_quantity})
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={asset.total_quantity}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(
                            Math.max(1, Number(e.target.value)),
                            asset.total_quantity,
                          ),
                        )
                      }
                    />
                  </div>

                  {/* Dates Display */}
                  <div className="border rounded-lg p-3">
                    <Label className="text-xs uppercase text-muted-foreground font-bold mb-2 block">
                      Dates
                    </Label>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </div>
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="w-full text-lg shadow-lg shadow-primary/20"
                      >
                        Request to Book
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Complete your request</DialogTitle>
                        <DialogDescription>
                          The owner will review your request. No payment is
                          taken until approved.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        <div className="flex justify-center">
                          <Calendar
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={1}
                            className="rounded-md border shadow-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="purpose">Purpose of use</Label>
                          <Textarea
                            id="purpose"
                            placeholder="Describe how you will use this equipment..."
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePaymentMock}
                          disabled={isSubmitting}
                        >
                          {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Confirm Request
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    You won't be charged yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/30 border-none text-white">
          <div className="relative h-[80vh] w-full flex items-center justify-center">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
