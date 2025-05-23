"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getGarbageSubmissions } from "@/services";

interface GarbageAttributes {
  [key: string]: number;
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
  timestamp: string;
  garbage_attributes: GarbageAttributes;
  created_by: string;
  expired: boolean;
}

export default function SubmissionView() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { propertyID } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await getGarbageSubmissions(1);
        const foundSubmission = data.find(
          (sub: Submission) => sub.property_id === propertyID
        );
        if (foundSubmission) {
          setSubmission(foundSubmission);
        } else {
          toast({
            title: "Error",
            description: "Submission not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching submission:", error);
        toast({
          title: "Error",
          description: "Failed to fetch submission details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [propertyID, toast]);

  const formatDate = (timeStamp: string) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcDate = new Date(timeStamp);
    const zonedDate = new TZDate(utcDate, userTimeZone);
    return format(zonedDate, "PPPp");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!submission) {
    return null;
  }

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

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">View Entry</CardTitle>
          <p className="text-md text-gray-800 pt-0">
            View garbage entry details and information.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-20">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Property ID
                </h3>
                <p className="mt-1">{submission.property_id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Client ID</h3>
                <p className="mt-1">{submission.client_id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Client Type
                </h3>
                <Button variant="outline" className="mt-1">
                  {submission.client_type}
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Client Name
                </h3>
                {submission.client_name}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Borough Name
                </h3>
                <p className="mt-1">{submission.borough_name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Street Name
                </h3>
                <p className="mt-1">{submission.street_name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Chute Present
                </h3>
                <p className="mt-1">
                  {submission.chute_present ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Date & Time
                </h3>
                <p className="mt-1">{formatDate(submission.timestamp)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Garbage Segregation
                </h3>
                <div className="mt-2 space-y-2">
                  {Object.entries(submission.garbage_attributes).map(
                    ([key, value]) => (
                      <div key={key} className="flex items-center">
                        <span className="capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="font-medium ml-2">- {value} lbs</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Created By
                </h3>
                <p className="mt-1">{submission.created_by}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
