import * as React from "react";

import Sidebar from "@/app/@employee/components/sidebar";
import Header from "@/app/@employee/components/header";


export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar />

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="grid auto-rows-max items-start lg:col-span-2">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
