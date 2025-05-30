"use client";

import * as React from "react";
import { useRouter, redirect } from "next/navigation";
import { useUser } from "@/store"; // Import your UserContext hook
import Cookies from "js-cookie";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { login, userDetails } from "@/services/index";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const { setUser } = useUser(); // Access UserContext's `setUser` function
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<string>("");

  // Form schema validation
  const formSchema = z.object({
    username: z
      .string()
      .min(1, { message: "Please enter your username" })
      .max(50),
    password: z
      .string()
      .min(1, { message: "Please enter your password" })
      .max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIsError("");

    try {
      // Login API call
      const loginRes = await login(values);
      if (loginRes.data) {
        // Store tokens in cookies
        Cookies.set("access_token", loginRes.data.access_token);
        Cookies.set("refresh_token", loginRes.data.refresh_token);

        // Fetch user details after login
        const userDetailsRes = await userDetails();

        // Set user details in UserContext
        if (userDetailsRes.data) {
          setUser(userDetailsRes.data); // Assuming setUser updates the UserContext state
        }

        // Redirect to role-based dashboard
        const userRole = userDetailsRes.data.role;
        switch (userRole) {
          case "admin":
            router.push("/employees");
            break;
          case "employee":
            router.push("/new-entry");
            break;
          case "client":
            router.push("/analytics");
            break;
          default:
            router.push("/auth");
        }
      }
    } catch (e: any) {
      // Handle errors
      setIsLoading(false);
      if (e.response && e.response.data) {
        setIsError(e.response.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    placeholder="password"
                    type="password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="!mt-3" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </form>
      </Form>
      {isError !== "" && !isLoading && (
        <p className="text-[0.8rem] font-medium text-destructive">{isError}</p>
      )}
    </div>
  );
}
