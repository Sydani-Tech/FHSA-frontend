import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAssets,
  useUpdateAsset,
  useDeleteAsset,
} from "@/core/services/asset.service";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  MapPin,
  Check,
  Info,
  Calendar as CalendarIcon,
  ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminAssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: assets = [], isLoading } = useAssets();
  const updateAssetMutation = useUpdateAsset();
  const deleteAssetMutation = useDeleteAsset();

  const [isEditing, setIsEditing] = useState(false);
  const [asset, setAsset] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [images, setImages] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [durationOptions, setDurationOptions] = useState<string[]>([]);

  // Load asset data when available
  useEffect(() => {
    if (assets.length && id) {
      const foundAsset = assets.find((a: any) => a.id === Number(id));
      if (foundAsset) {
        setAsset(foundAsset);
        setFormData(foundAsset);
        // Parse specs if object
        if (foundAsset.specs) {
          const specArr = Object.entries(foundAsset.specs).map(
            ([key, value]) => ({ key, value: String(value) }),
          );
          setSpecs(specArr);
        }
        if (foundAsset.images) setImages(foundAsset.images);
        if (foundAsset.availability?.days)
          setAvailableDays(foundAsset.availability.days);
        if (foundAsset.duration_options)
          setDurationOptions(foundAsset.duration_options);
      }
    }
  }, [assets, id]);

  const handleUpdate = () => {
    // Convert specs array to object
    const specsObj = specs.reduce(
      (acc, curr) => ({ ...acc, [curr.key]: curr.value }),
      {},
    );

    updateAssetMutation.mutate(
      {
        id: Number(id),
        ...formData, // basic fields
        specs: specsObj,
        images,
        duration_options: durationOptions,
        availability: { days: availableDays },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast({
            title: "Asset Updated",
            description: "Changes saved successfully.",
          });
        },
      },
    );
  };

  const handleDelete = () => {
    if (id) {
      deleteAssetMutation.mutate(Number(id), {
        onSuccess: () => {
          toast({
            title: "Asset Deleted",
            description: "Asset removed successfully.",
          });
          navigate("/admin/assets");
        },
      });
    }
  };

  // Edit helpers
  const addSpec = () => {
    if (newSpec.key && newSpec.value) {
      setSpecs([...specs, newSpec]);
      setNewSpec({ key: "", value: "" });
    }
  };
  const removeSpec = (index: number) =>
    setSpecs(specs.filter((_, i) => i !== index));

  const toggleDay = (day: string) => {
    if (availableDays.includes(day))
      setAvailableDays(availableDays.filter((d) => d !== day));
    else setAvailableDays([...availableDays, day]);
  };

  if (isLoading)
    return (
      <div className="p-8">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  if (!asset && !isLoading) return <div className="p-8">Asset not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20 mt-[-2rem] -mx-8">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden bg-muted group">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={asset.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-20 w-20 text-muted-foreground/20" />
          </div>
        )}

        {/* Admin Back Button */}
        <div className="absolute top-6 left-6 z-30">
          <Button
            variant="secondary"
            size="sm"
            className="backdrop-blur-md hover:bg-background/80"
            onClick={() => navigate("/admin/assets")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Admin Actions Overlay */}
        <div className="absolute top-6 right-6 z-30 flex gap-2">
          {!isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                className="shadow-lg backdrop-blur-md  hover:bg-background"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Asset
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="shadow-lg">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Asset?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove <strong>{asset.name}</strong>{" "}
                      from the marketplace.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                className="shadow-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateAssetMutation.isPending}
                className="shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 z-20 container mx-auto px-8 pb-8">
          <div className="flex items-center gap-2 mb-4">
            {isEditing ? (
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger className="w-[180px] bg-background/90 backdrop-blur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Facility">Facility</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className="bg-primary text-white hover:bg-primary/90 text-sm px-3 py-1">
                {asset.type.replace("_", " ")}
              </Badge>
            )}
            <Badge
              variant={asset.active ? "default" : "secondary"}
              className={
                asset.active ? "bg-emerald-500 hover:bg-emerald-600" : ""
              }
            >
              {asset.active ? "Active" : "Inactive"}
            </Badge>
          </div>

          {isEditing ? (
            <div className="max-w-2xl space-y-4">
              <Input
                className="text-4xl font-bold h-16 bg-background/80 backdrop-blur-sm"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                className="text-lg h-12 bg-background/80 backdrop-blur-sm"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Location"
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground max-w-3xl leading-tight">
                {asset.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{asset.location}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-30">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold font-display mb-4">
                  About this asset
                </h2>
                {isEditing ? (
                  <Textarea
                    className="min-h-[150px] text-lg leading-relaxed"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {asset.description || "No description provided."}
                  </p>
                )}

                <div className="grid gap-6 mt-8">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <Info className="h-5 w-5 text-primary" /> Specifications
                    </h3>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Key"
                            value={newSpec.key}
                            onChange={(e) =>
                              setNewSpec({ ...newSpec, key: e.target.value })
                            }
                            className="h-8 text-sm"
                          />
                          <Input
                            placeholder="Value"
                            value={newSpec.value}
                            onChange={(e) =>
                              setNewSpec({ ...newSpec, value: e.target.value })
                            }
                            className="h-8 text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={addSpec}
                            variant="secondary"
                          >
                            Add
                          </Button>
                        </div>
                        <ul className="space-y-2">
                          {specs.map((spec, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-center bg-background px-3 py-2 rounded border text-sm"
                            >
                              <span>
                                {spec.key}: {spec.value}
                              </span>
                              <X
                                className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-destructive"
                                onClick={() => removeSpec(i)}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        {specs.length > 0 ? (
                          specs.map((spec, i) => (
                            <li
                              key={i}
                              className="flex justify-between border-b border-border/50 pb-2 last:border-0"
                            >
                              <span className="capitalize font-medium text-muted-foreground">
                                {spec.key}:
                              </span>
                              <span className="font-semibold text-foreground">
                                {spec.value}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li>No specifications available</li>
                        )}
                      </ul>
                    )}
                  </div>

                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <ImageIcon className="h-5 w-5 text-secondary" /> Images
                    </h3>
                    {isEditing ? (
                      <div className="space-y-6">
                        {/* Main Image */}
                        <div className="space-y-2">
                          <Label>Main Image (Cover) *</Label>
                          <div className="max-w-md">
                            <ImageUpload
                              value={images[0]}
                              onChange={(url) => {
                                const newImages = [...images];
                                if (newImages.length === 0) newImages.push(url);
                                else newImages[0] = url;
                                setImages(newImages);
                              }}
                              onRemove={() => {
                                const newImages = [...images];
                                newImages.shift(); // Remove first
                                setImages(newImages);
                              }}
                              label="Main Asset Image"
                            />
                          </div>
                        </div>

                        {/* Gallery Images */}
                        <div className="space-y-2">
                          <Label>Gallery Images (Max 3)</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map((index) => (
                              <div key={index}>
                                <ImageUpload
                                  value={images[index]}
                                  onChange={(url) => {
                                    const newImages = [...images];
                                    if (!url) return;

                                    while (newImages.length < index)
                                      newImages.push("");
                                    newImages[index] = url;
                                    setImages(newImages);
                                  }}
                                  onRemove={() => {
                                    const newImages = [...images];
                                    newImages.splice(index, 1);
                                    setImages(newImages);
                                  }}
                                  label={`Gallery Image ${index}`}
                                  placeholder="Add URL or Upload"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {images.slice(0, 4).map((url, i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg overflow-hidden border bg-background"
                          >
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {images.length === 0 && (
                          <div className="col-span-2 py-4 text-center text-muted-foreground text-sm">
                            No specific images uploaded
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24 shadow-xl border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-baseline justify-between mb-6 pb-6 border-b">
                  {isEditing ? (
                    <div className="w-full space-y-4">
                      <div>
                        <Label>Pricing (₦)</Label>
                        <Input
                          type="number"
                          value={formData.cost}
                          onChange={(e) =>
                            setFormData({ ...formData, cost: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Total Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.total_quantity || 1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              total_quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-primary">
                          ₦{Number(asset.cost).toLocaleString()}
                        </span>
                        <span className="text-muted-foreground font-medium">
                          / unit
                        </span>
                      </div>
                      {asset.total_quantity > 1 && (
                        <span className="text-sm font-medium text-muted-foreground">
                          Inventory: {asset.total_quantity} units
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground font-bold mb-3 block">
                      Availability
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing
                        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                        : availableDays
                      ).map((day) => (
                        <Badge
                          key={day}
                          variant={
                            availableDays.includes(day) ? "default" : "outline"
                          }
                          className={`
                                    ${isEditing ? "cursor-pointer hover:opacity-80" : ""} 
                                    ${availableDays.includes(day) ? "bg-primary text-white" : ""}
                                `}
                          onClick={() => isEditing && toggleDay(day)}
                        >
                          {day}
                        </Badge>
                      ))}
                      {!isEditing && availableDays.length === 0 && (
                        <span className="text-sm text-muted-foreground">
                          No availability specified
                        </span>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4 border-t">
                      <Label className="text-xs uppercase text-muted-foreground font-bold mb-3 block">
                        Admin Status
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={formData.active ? "default" : "outline"}
                          className={
                            formData.active
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : ""
                          }
                          onClick={() =>
                            setFormData({ ...formData, active: true })
                          }
                        >
                          Active
                        </Button>
                        <Button
                          variant={!formData.active ? "destructive" : "outline"}
                          onClick={() =>
                            setFormData({ ...formData, active: false })
                          }
                        >
                          Inactive
                        </Button>
                      </div>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2 mb-2 font-medium text-foreground">
                        <Check className="h-4 w-4 text-emerald-500" /> Admin
                        Verified
                      </p>
                      <p>This asset is visible on the marketplace.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
