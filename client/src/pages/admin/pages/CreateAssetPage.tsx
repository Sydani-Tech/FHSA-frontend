import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { X, Plus, ImageIcon } from "lucide-react";
import { useCreateAsset } from "@/core/services/asset.service";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/shared/ImageUpload";

export default function CreateAssetPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createAsset = useCreateAsset();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    description: "",
    cost: "",
    total_quantity: 1, // Default to 1 unit
    active: true,
  });

  // Advanced fields
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  const [images, setImages] = useState<string[]>([]);
  // const [newImageUrl, setNewImageUrl] = useState(""); // Removed

  // Duration options
  const [durationOptions, setDurationOptions] = useState<string[]>(["day"]);

  // Availability
  const [availableDays, setAvailableDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.type ||
      !formData.location ||
      !formData.cost
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Convert specs array to object
    const specsObj = specs.reduce(
      (acc, curr) => ({ ...acc, [curr.key]: curr.value }),
      {},
    );

    createAsset.mutate(
      {
        ...formData,
        specs: specsObj,
        images,
        duration_options: durationOptions,
        availability: { days: availableDays },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Asset created successfully.",
          });
          navigate("/admin/assets");
        },
      },
    );
  };

  const addSpec = () => {
    if (newSpec.key && newSpec.value) {
      setSpecs([...specs, newSpec]);
      setNewSpec({ key: "", value: "" });
    }
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create New Asset</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Basic Info */}
          <Card className="border-black/10 shadow-sm">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Asset Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Industrial Mixer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Category *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Storage">Storage</SelectItem>
                      <SelectItem value="Facility">Facility</SelectItem>
                      <SelectItem value="Logistics">Logistics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Warehouse A, Lagos"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (₦) *</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                {/* Total Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="total_quantity">Total Quantity</Label>
                  <Input
                    id="total_quantity"
                    type="number"
                    min="1"
                    value={formData.total_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_quantity: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the asset..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-black/10 shadow-sm">
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                          // Ensure previous indices exist or fill with empty string (though logic below handles gaps mostly by pushing)
                          // Actually better to treat 'images' as a packed array.
                          // But here we want slots.
                          // Let's simplify: Just add to array if not exists at index? No, array index matters for Main Image (0).
                          // Let's just use the array.
                          if (!url) return; // handled by onRemove

                          // To insert at specific index, we need to make sure array is big enough
                          while (newImages.length < index) newImages.push("");
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
                <p className="text-xs text-muted-foreground mt-2">
                  Additional images to showcase different angles or features.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Specifications & Options */}
          <Card className="border-black/10 shadow-sm">
            <CardHeader>
              <CardTitle>Specifications & Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Specs */}
              <div className="space-y-2">
                <Label>Technical Specifications</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Key (e.g. Capacity)"
                    value={newSpec.key}
                    onChange={(e) =>
                      setNewSpec({ ...newSpec, key: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Value (e.g. 500L)"
                    value={newSpec.value}
                    onChange={(e) =>
                      setNewSpec({ ...newSpec, value: e.target.value })
                    }
                  />
                  <Button type="button" onClick={addSpec} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {specs.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {spec.key}: {spec.value}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSpec(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Available Days */}
              <div className="space-y-2">
                <Label>Available Days</Label>
                <div className="flex flex-wrap gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={
                          availableDays.includes(day) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleDay(day)}
                        className={
                          availableDays.includes(day)
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      >
                        {day}
                      </Button>
                    ),
                  )}
                </div>
              </div>

              {/* Duration Options */}
              <div className="space-y-2">
                <Label>Rental Duration Options</Label>
                <div className="flex flex-wrap gap-2">
                  {["hour", "day", "week", "month"].map((opt) => (
                    <div key={opt} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`dur-${opt}`}
                        checked={durationOptions.includes(opt)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setDurationOptions([...durationOptions, opt]);
                          else
                            setDurationOptions(
                              durationOptions.filter((d) => d !== opt),
                            );
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`dur-${opt}`} className="capitalize">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/assets")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={createAsset.isPending}
            >
              {createAsset.isPending ? "Creating..." : "Create Asset"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
