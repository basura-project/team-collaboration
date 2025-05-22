"use client";

import * as React from "react";
import Link from "next/link";

import { getEmployeeDetails } from "@/services/index";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListSkeleton } from "@/components/ui/skeleton/ListSkeleton";

import EditResidentForm from "../../components/property-forms/resident";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function EditEmployee({ params: { propId } }: any) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<string>("");
  const [empDetails, setEmpDetails] = React.useState<any>({});

  const propertyDetails: any = {
    property_id: "PROP12340",
    property_type: "Resident Buildings",
    property_manager_name: "Manager Name",
    property_manager_phone_no: "+1234567890",
    email: "manager@example.com",
    owner_name: "Owner Name",
    owner_number: "+1234567890",
    apartment_type: "2BHK",
    housing_type: "Public",
    borough_name: "Brooklyn",
    street_name: "Main Street",
    building_number: "123",
    chute_present: true,
    number_of_floors: 5,
    number_of_basement_floors: 1,
    number_of_units_per_floor: 4,
    number_of_units_total: 20,
    franchise_name: "McDonald's",
    inside_a_mall: false,
    mall_name: "Mall Name",
    is_event: false,
    event_name: "Event Name",
    retail_or_office: true,
    industry_type: "Food",
    handling: "Federal",
    department: "Health",
    is_bid: true,
    area_covered: "Main Street",
    building_type: "School",
    school: "Elementary",
  };

  React.useEffect(() => {
    (async () => {
      setIsLoading(false);
      // try {
      //   let res = await getEmployeeDetails(propId);
      //   if (res.data) {
      //     setEmpDetails(res.data);
      //   }
      //   setIsLoading(false);
      //   setIsError("");
      // } catch (e: any) {
      //   setIsLoading(false);
      //   setIsError(e.response.data.error);
      //   console.log(e);
      // }
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
            <BreadcrumbLink href="/properties">Properties</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit #{propId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card x-chunk="dashboard-05-chunk-3">
        <div className="hidden space-y-2 p-6 pb-6 md:block">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">
              Edit Property
            </h2>
          </div>
          <Separator className="my-6" />
          {isLoading && <ListSkeleton rows={8} />}
          {!isLoading && isError == "" && (
            <div className="grid gap-2 lg:max-w-sm">
              <EditResidentForm edit={true} propertyDetails={propertyDetails} />
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
