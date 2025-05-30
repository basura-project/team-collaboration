"use client";

import * as React from "react";
import Link from "next/link";

import { getEmployeeDetails } from "@/services/index";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListSkeleton } from "@/components/ui/skeleton/ListSkeleton";

import EditEmployeeForm from "./edit-employee-form";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function EditEmployee({ params: { empId } }: any) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<string>("");
  const [empDetails, setEmpDetails] = React.useState<any>({});

  React.useEffect(() => {
    (async () => {
      try {
        let res = await getEmployeeDetails(empId);
        if (res.data) {
          setEmpDetails(res.data);
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
            <BreadcrumbLink href="/employees">Employees</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit #{empId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card x-chunk="dashboard-05-chunk-3">
        <div className="hidden space-y-2 p-6 pb-6 md:block">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">
              Edit Employee
            </h2>
          </div>
          <Separator className="my-6" />
          {isLoading && <ListSkeleton rows={8} />}
          {!isLoading && isError == "" && (
            <div className="grid gap-2 lg:max-w-sm">
              <EditEmployeeForm empDetails={empDetails} />
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
