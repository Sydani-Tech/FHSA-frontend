import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { insertUserSchema } from "@/core/lib/schemas";
import { z } from "zod";
import type { UserCreate } from "@/core/lib/types";

type RegisterFormValues = z.infer<typeof insertUserSchema>;

export default function Register() {
  const { register, isRegistering, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "business_user",
      status: "pending",
      businessName: "",
      phone: "",
      location: "",
      productionFocus: "",
    },
  });

  if (user) return null;

  function onRegister(data: RegisterFormValues) {
    const apiData: UserCreate = {
      email: data.email,
      // first_name and last_name are optional now
      password: data.password,
      role: data.role as "business_user" | "admin",
      business_name: data.businessName,
      phone: data.phone,
      location: data.location,
      production_focus: data.productionFocus,
      certifications: data.certifications,
      needs: data.needs,
    };

    register(apiData, {
      onSuccess: () => {
        // AuthProvider handles login state, useEffect will redirect to dashboard
      },
    });
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-foreground relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
        <img
          src="https://pixabay.com/get/g7ae77b39da0608eb0a692a1ef60b8bacb7aadd5cd4c1e2c79ba1f904fc717fca3d681934b87ab054ded1b4ecdbebd72d62118ba2a8a6ac22f814d8d5da9be6fb_1280.jpg"
          alt="Fields"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 text-center px-12">
          <h2 className="text-4xl font-bold font-display text-white mb-6">
            Join the ecosystem
          </h2>
          <p className="text-white/80 text-lg">
            Connect with thousands of producers sharing resources to build a
            better future.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden mb-8">
            <h1 className="text-3xl font-bold font-display text-primary">
              FarmShare
            </h1>
          </div>
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold">
                Create Account
              </CardTitle>
              <CardDescription>
                Start your journey with FarmShare
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegister, (errors) => {
                    console.error("Form Validation Errors:", errors);
                  })}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@company.com"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              className="h-12 pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Green Acres Farm"
                            className="h-12"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="px-0 justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-primary hover:underline font-medium"
                >
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
