"use client";

import * as React from "react";
import Link from "next/link";

import { getClientDetails } from "@/services/index";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListSkeleton } from "@/components/ui/skeleton/ListSkeleton";

import EditClientForm from "./edit-client-form";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function EditClient({ params: { clientID } }: any) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<string>("");
  const [clientDetails, setClientDetails] = React.useState<any>({});

  React.useEffect(() => {
    (async () => {
      try {
        let res = await getClientDetails(clientID);
        if (res.data) {
          setClientDetails(res.data);
        }
        setIsLoading(false);
        setIsError("");
      } catch (e: any) {
        setIsLoading(false);
        setIsError(e.response.data.error);
        console.log(e);
      }
    })();
  }, [isLoading]);

  return (
    <div className="grid gap-2">
      <Breadcrumb className="hidden md:flex -mt-[68px] z-50">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit #{clientID}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card x-chunk="dashboard-05-chunk-3">
        <div className="hidden space-y-2 p-6 pb-6 md:block">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">
              Edit Client
            </h2>
          </div>
          <Separator className="my-6" />
          {isLoading && <ListSkeleton rows={8} />}
          {!isLoading && isError == "" && (
            <div className="grid gap-2 lg:max-w-sm">
              <EditClientForm clientDetails={clientDetails} />
            </div>
          )}
        </div>
        {isError !== "" && !isLoading && (
          <p className="text-[0.8rem] font-medium text-destructive space-y-2 pt-0 p-6 md:block">
            {isError}
          </p>
        )}
      </Card>
    </div>
  );
}
