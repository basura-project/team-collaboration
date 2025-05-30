"use client";
import React, { Suspense } from "react";
import SubmissionsList from "./components/list";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SubmissionsPage = () => {
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
      <Card className="p-8">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold tracking-tight">Submissions</h2>
          <p className="text-sm text-muted-foreground">List of submissions</p>
        </div>
        <SubmissionsList />
      </Card>
    </>
  );
};

export default SubmissionsPage;
