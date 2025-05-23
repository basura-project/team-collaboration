"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getEmployeeDetails } from "@/services/index";
import { PencilLine } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListSkeleton } from "@/components/ui/skeleton/ListSkeleton";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ViewEmployee({ params: { empId } }: any) {
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
            <BreadcrumbPage>View #{empId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card x-chunk="dashboard-05-chunk-3">
        <div className="hidden space-y-2 p-6 md:block">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">
              Employee Details
            </h2>
          </div>
          <Separator className="my-6" />
          {isLoading && <ListSkeleton rows={8} />}
          {!isLoading && isError == "" && (
            <div className="flex-1 py-2">
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Employee Id
                </h3>
                <p className="mt-1">{empDetails.employee_id}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">
                  First Name
                </h3>
                <p className="mt-1">{empDetails.name.firstname}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Middle Name
                </h3>
                <p className="mt-1">
                  {empDetails.name.middlename !== ""
                    ? empDetails.name.middlename
                    : "-"}
                </p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                <p className="mt-1">{empDetails.name.lastname}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                <p className="mt-1">{empDetails.contact}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{empDetails.email}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Secondary Email
                </h3>
                <p className="mt-1">{empDetails.secondary_email}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">User Name</h3>
                <p className="mt-1">{empDetails.username}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Bank Account No
                </h3>
                <p className="mt-1">{empDetails.bank_account_no}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Routing No
                </h3>
                <p className="mt-1">{empDetails.routing_no}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Swift Code
                </h3>
                <p className="mt-1">{empDetails.swift_code}</p>
              </div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p className="mt-1">{empDetails.role}</p>
              </div>
              <Button className="font-normal">
                <PencilLine size={16} />
                <Link
                  className="pl-2"
                  href={`/employees/edit/${empDetails.employee_id}`}
                >
                  Edit
                </Link>
              </Button>
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
