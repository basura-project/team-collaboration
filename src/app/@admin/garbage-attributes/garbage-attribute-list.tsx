"use client";

import * as React from "react";

import { useToast } from "@/components/ui/use-toast";
import {
  getGarbageAttributes
} from "@/services/index";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";

import { Pencil, Trash2, SquarePlus, X } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { usePreloader } from "../../../lib/preloader/usePreloaderHook";
import GarbageAttributeForm from "./garbage-attribute-form";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function GarbageAttributeList({
  className,
  ...props
}: UserAuthFormProps) {
  const [modalType, setModalType] = React.useState<
    "add" | "edit" | "delete" | null
  >(null);
  const [selectedAttribute, setSelectedAttribute] = React.useState<any>(null);
  const { data, isDataLoading, error, setData } = usePreloader(getGarbageAttributes, "Attribute list");

  const { toast } = useToast();

  const openModal = (type: "add" | "edit" | "delete", attribute = null) => {
    setModalType(type);
    setSelectedAttribute(attribute);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedAttribute(null);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (modalType === "add") {
        setData([
          ...data,
          { attribute_name: formData.attributeName, color: formData.color },
        ]);
        toast({
          title: "Success",
          description: "Attribute added successfully.",
        });
      } else if (modalType === "edit") {
        let updatedData = data.map((item: any) =>
          item.attribute_name === selectedAttribute?.attribute_name
           ? {...item, attribute_name: formData.attributeName, color: formData.color }
            : item
        );
        setData(updatedData);
        toast({
          title: "Success",
          description: "Attribute updated successfully.",
        });
      } else if (modalType === "delete") {
        setData(
          data.filter(
            (item: any) =>
              item.attribute_name !== selectedAttribute?.attribute_name
          )
        );
        toast({
          title: "Success",
          description: "Attribute deleted successfully.",
        });
      }
      closeModal();
    } catch (e) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
      });
      console.log(e);
    }
  };

  return (
    <div className="flex flex-row flex-wrap gap-x-6">
      {isDataLoading ? (
        <Icons.spinner className="mx-auto my-4 h-6 w-6 animate-spin" />
      ) : (
        <>
          {data?.length > 0 &&
            data.map((attribute: any, index: number) => {
              return (
                <Card
                  key={index}
                  className="flex-1 basis-52 rounded-md my-2 p-1 shadow-md min-w-52 w-52 sm:min-h-28"
                >
                  <CardHeader className="flex flex-row items-center justify-end p-0 space-y-0">
                    <Button
                      onClick={() => openModal("edit", attribute)}
                      size="icon"
                      variant="link"
                      className="h-7 w-7"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button
                      onClick={() => openModal("delete", attribute)}
                      size="icon"
                      variant="link"
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center pt-2">
                    <div
                      style={{ backgroundColor: attribute.color }}
                      className={`rounded-full app-color-code h-8 w-8 max-h-8 min-w-8 mr-4`}
                    ></div>
                    <h3 className="font-semibold">
                      {attribute?.attribute_name}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => openModal("add")}
            className="group flex flex-col items-center justify-center rounded-md my-2 p-1 shadow-md min-w-52 w-52 flex-1 basis-52 md:min-h-28 hover:text-foreground"
          >
            <CardContent className="flex flex-col items-center justify-center pb-0">
              <SquarePlus className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
              <h3 className="font-semibold text-muted-foreground group-hover:text-foreground">
                Add New
              </h3>
            </CardContent>
          </Card>
          {/* Emty elements to adjust flex basis and grow */}
          <div className="w-52 flex-1 basis-52"></div>
          <div className="w-52 flex-1 basis-52"></div>
          <div className="w-52 flex-1 basis-52"></div>
          <div className="w-52 flex-1 basis-52"></div>
          {/* Emty elements to adjust flex basis and grow */}
          <AlertDialog open={modalType !== null} onOpenChange={closeModal}>
            <AlertDialogContent>
              <AlertDialogHeader className="space-y-0">
                <AlertDialogTitle className="flex justify-between">
                  {modalType === "add"
                    ? "Add Attribute"
                    : modalType === "edit"
                    ? "Edit Attribute"
                    : "Delete Attribute"}
                  <Button
                    variant="ghost"
                    className="p-2"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    <X size={20} />
                  </Button>
                </AlertDialogTitle>
                <p className="pt-0 text-muted-foreground">
                  {modalType === "add"
                    ? "Add a new garbage attribute here, click submit when you're done."
                    : modalType === "edit"
                    ? null
                    : null}
                </p>
              </AlertDialogHeader>
              <GarbageAttributeForm
                mode={modalType as "add" | "edit" | "delete"}
                attribute={selectedAttribute}
                onSubmit={handleFormSubmit}
                onCancel={closeModal}
              />
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
