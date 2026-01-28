import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { authApi } from "@/core/api/api-client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import {
  Pencil,
  User,
  MapPin,
  Phone,
  Briefcase,
  Award,
  AlertCircle,
} from "lucide-react";

const profileFormSchema = z.object({
  business_name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  production_focus: z.string().optional(),
  certifications: z.string().optional(),
  needs: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Default to editing if business name is missing (incomplete profile)
  const [isEditing, setIsEditing] = useState(!user?.business_name);

  // Update editing state if user data loads late
  useEffect(() => {
    if (user && !user.business_name) {
      setIsEditing(true);
    }
  }, [user]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      business_name: "",
      phone: "",
      location: "",
      production_focus: "",
      certifications: "",
      needs: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        business_name: user.business_name || "",
        phone: user.phone || "",
        location: user.location || "",
        production_focus: user.production_focus || "",
        certifications: user.certifications
          ? user.certifications.join(", ")
          : "",
        needs: user.needs ? user.needs.join(", ") : "",
      });
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      const payload = {
        ...data,
        certifications: data.certifications
          ? data.certifications
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        needs: data.needs
          ? data.needs
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      await authApi.put("/user/profile", payload);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });

      toast({
        title: "Profile updated",
        description: "Your business profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (!isEditing) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-primary">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your business details and preferences.
            </p>
          </div>
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Pencil className="h-4 w-4" /> Edit Profile
          </Button>
        </div>

        <Card className="overflow-hidden border-primary/10">
          <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center text-4xl font-bold text-primary border-4 border-white/50 backdrop-blur-sm">
                {user?.business_name ? (
                  user.business_name.substring(0, 2).toUpperCase()
                ) : (
                  <User className="h-10 w-10" />
                )}
              </div>
            </div>
          </div>
          <CardHeader className="pt-12 pb-4">
            <CardTitle className="text-2xl">
              {user?.business_name || "Unnamed Business"}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />{" "}
                {user?.location || "No location set"}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-3 w-3" />{" "}
                {user?.production_focus || "No focus set"}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                <AlertCircle className="h-4 w-4 text-accent" /> Needs
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.needs && user.needs.length > 0 ? (
                  user.needs.map((need, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-medium border border-secondary/20"
                    >
                      {need}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No needs listed.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                <Award className="h-4 w-4 text-accent" /> Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.certifications && user.certifications.length > 0 ? (
                  user.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium border border-primary/20"
                    >
                      {cert}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No certifications listed.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 col-span-2">
              <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                <Phone className="h-4 w-4 text-accent" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Email
                  </p>
                  <p className="text-base font-medium">{user?.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    Phone
                  </p>
                  <p className="text-base font-medium">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-primary">
            Edit Profile
          </h1>
          <p className="text-muted-foreground mt-1">Update your information.</p>
        </div>
        {user?.business_name && (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </div>

      <Card className="overflow-hidden border-primary/10">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Farms" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="production_focus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Production Focus</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Dairy, Crops..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Organic, Fair Trade (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate multiple certifications with commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="needs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Needs</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Equipment, Labor (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What are you currently looking for? Separate with commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                {user?.business_name && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
