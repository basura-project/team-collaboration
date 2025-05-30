"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PencilLine } from "lucide-react";
import { ListSkeleton } from "@/components/ui/skeleton/ListSkeleton";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ViewEmployee({ params: { propId } }: any) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isError, setIsError] = React.useState<string>("");
  const [propDetails, setPropDetails] = React.useState<any>({});

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
    setIsLoading(false);
  }, [isLoading]);

  const propertyDetailsSchema: any = {
    "Resident Buildings": {
      property_type: "Property Type",
      property_id: "Property Id",
      owner_name: "Owner Name",
      owner_number: "Owner Phone Number",
      property_manager_name: "Property Manager Name",
      property_manager_phone_no: "Property Manager Phone Number",
      apartment_type: "Apartment Type ( No. of bedrooms )",
      housing_type: "Housing Type",
      borough_name: "Borough Name",
      street_name: "Street Name",
      building_number: "Building No.",
      chute_present: "Chute Present",
      chute_floor_level: "Chute Floor Level",
      number_of_floors: "No. of Floors",
      number_of_basement_floors: "No. of Basement Floors",
      number_of_units_per_floor: "No. of Units Per Floor",
      number_of_units_total: "No. Number of Units in Total",
      email: "Email",
    },
    Commercial: {
      property_type: "Property Type",
      property_id: "Property Id",
      franchise_name: "Franchise Name",
      property_manager_name: "Property Manager Name",
      property_manager_phone_no: "Property Manager Phone Number",
      borough_name: "Borough Name",
      street_name: "Street Name",
      building_number: "Building No.",
      inside_a_mall: "Inside a Mall?",
      mall_name: "Mall Name",
      is_event: "If an Event",
      event_name: "Event Name",
      retail_or_office: "Retail or Office",
      industry_type: "Industry Type",
      chute_present: "Chute Present",
      chute_floor_level: "Chute Floor Level",
      number_of_floors: "No. of Floors",
      number_of_basement_floors: "No. of Basement Floors",
      number_of_units_per_floor: "No. of Units Per Floor",
      number_of_units_total: "No. Number of Units in Total",
      email: "Email",
    },
    Municipal: {
      property_type: "Property Type",
      property_id: "Property Id",
      handling: "Handling",
      department: "Department",
      bid: "Is it a BID (Business Improvement District) ?",
      housing_type: "Building Type",
      buildingAddress: "Building Address",
      borough_name: "Borough Name",
      street_name: "Street Name or Avenue Name",
      property_manager_name: "Property Manager Name",
      property_manager_phone_no: "Property Manager Phone Number",
      isSchool: "If School",
      school: "School Type",
      schoolBoroughName: "School Borough Name",
      schoolStreetOrAvenueName: "School Street Name or Avenue Name",
      schoolBuildingNumber: "School Building No.",
      chute_present: "Chute Present",
      chute_floor_level: "Chute Floor Level",
      number_of_floors: "No. of Floors",
      number_of_basement_floors: "No. of Basement Floors",
      email: "Email",
    },
  };

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
            <BreadcrumbPage>View #{propId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card x-chunk="dashboard-05-chunk-3">
        <div className="hidden space-y-2 p-6 md:block">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">
              Property Details
            </h2>
          </div>
          <Separator className="my-6" />
          {isLoading && <ListSkeleton rows={8} />}
          <div className="flex-1 py-2">
            {!isLoading &&
              isError == "" &&
              Object.keys(propertyDetailsSchema["Resident Buildings"]).map(
                (field) => (
                  <div className="mb-3" key={field}>
                    <h3 className="text-sm font-medium text-gray-500">
                      {propertyDetailsSchema["Resident Buildings"][field]}
                    </h3>
                    <p className="mt-1">{propertyDetails[field] ?? "-"}</p>
                  </div>
                )
              )}
            <Button className="font-normal">
              <PencilLine size={16} />
              <Link
                className="pl-2"
                href={`/properties/edit/${propertyDetails.property_id}`}
              >
                Edit
              </Link>
            </Button>
          </div>
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
