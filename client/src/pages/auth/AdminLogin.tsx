import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
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
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ShieldCheck } from "lucide-react";
import { loginSchema } from "@/core/lib/schemas";
import { z } from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { login, isLoggingIn, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        // If logged in as non-admin, maybe logout first?
        // For now preventing access to admin login if already logged in as regular user
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  function onLogin(data: LoginFormValues) {
    login(data, {
      onSuccess: (data: any) => {
        // Redirect based on role
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          // Ideally we should fail here if not admin, but backend handles login authentication
          // We can perhaps show a toast or redirect
          navigate("/dashboard");
        }
      },
    });
  }

  if (user) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center mb-8">
          <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-display text-white">
            Admin Portal
          </h1>
          <p className="text-zinc-400 mt-2">Restricted access only</p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Admin Login
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your administrative credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@fhsa.com"
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-zinc-800 border-zinc-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Access Portal"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
