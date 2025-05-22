"use client";
import React from "react";
import EditEntryForm from "./edit-entry-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const EditEntryPage = ({ params: { propertyID } }: any) => {
  return (
    <>
      <Breadcrumb className="hidden md:flex -mt-[44px] z-50">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/submissions">Submissions</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EditEntryForm propertyID={propertyID} />
    </>
  );
};

export default EditEntryPage;
