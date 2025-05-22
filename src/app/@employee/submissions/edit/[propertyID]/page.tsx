"use client";
import React, { useEffect, useState } from "react";
import EditEntryForm from "./edit-entry-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { getGarbageSubmissions } from "@/services";

interface GarbageAttributes {
  [key: string]: number; // For dynamic properties
}

interface Submission {
  id: string;
  property_id: string;
  client_id: string;
  client_type: string;
  client_name: string;
  borough_name: string;
  street_name: string;
  chute_present: boolean;
  timestamp: string; // ISO 8601 format
  garbage_attributes: GarbageAttributes;
  created_by: string;
}

const EditEntryPage = ({ params: { propertyID } }: any) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getGarbageSubmissions();
        setSubmissions(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching garbage submissions", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const submission = submissions.find(
    (item) => item.property_id === propertyID
  );

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
      {!isLoading && submission !== undefined ? (
        <EditEntryForm entry={submission} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default EditEntryPage;
