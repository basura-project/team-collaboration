"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import { UserProvider } from "@/store";
import UserRouter from "@/app/router";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  admin,
  employee,
  client,
  auth,
  children,
}: Readonly<{
  admin: React.ReactNode;
  employee: React.ReactNode;
  client: React.ReactNode;
  auth: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <UserProvider>
        <body className={inter.className}>
          {children}
          {/* Pass layouts to UserRouter */}
          <UserRouter
            admin={admin}
            employee={employee}
            client={client}
            auth={auth}
          />
          <Toaster />
        </body>
      </UserProvider>
    </html>
  );
}
