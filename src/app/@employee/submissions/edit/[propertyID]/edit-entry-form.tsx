"use client";
import React, { useContext, useEffect } from "react";

//context
import { useUser } from "@/store";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";

// Zod form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//Shadcn components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ListSkeleton } from "@/components/ui/skeleton/ListSkeleton";

//services
import {
  addGarbageEntry,
  getProperties,
  getPropertyDetailsForAddEntry,
  getGarbageAttributes,
  getGarbageSubmissions,
} from "@/services";

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
}

// Mock property data
type CommonStringFields =
  | "property_id"
  | "client_id"
  | "client_type"
  | "client_name"
  | "borough_name"
  | "street_name"
  | "chute_present"
  | "timestamp";

type Property = {
  [K in CommonStringFields]: string;
} & {
  garbage_attributes: GarbageAttributes;
};

// Zod schema for form validation
const formSchema = z.object({
  property_id: z.string().min(1, "Property ID is required"),
  client_id: z.string().min(1, "Client ID is required"),
  client_type: z.string().min(1, "Client type is required"),
  client_name: z.string().min(2, "Client name must be at least 2 characters"),
  borough_name: z.string().min(2, "Borough name is required"),
  street_name: z.string().min(2, "Street name is required"),
  timestamp: z.string().min(2, "Timestamp must be included"),
  chute_present: z.enum(["yes", "no"]),
  created_by: z.string().min(1, "Created by"),
  garbage_attributes: z
    .record(z.string(), z.number().optional())
    .refine(
      (data) =>
        Object.values(data).some((value) => value !== undefined && value > 0),
      {
        message: "At least one garbage type must have a value greater than 0",
      }
    ),
});

type FormValues = z.infer<typeof formSchema>;

const EditEntryForm = ({ propertyID }: { propertyID: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [garbageAttributes, setGarbageAttributes] = useState<
    GarbageAttributes[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [entry, setEntry] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const submissions = await getGarbageSubmissions();
        const submission = submissions.find(
          (item: Submission) => item.property_id === propertyID
        );
        if (submission) {
          setEntry(submission);
          form.setValue("property_id", submission.property_id);
          form.setValue("client_id", submission.client_id);
          form.setValue("client_type", submission.client_type);
          form.setValue("client_name", submission.client_name);
          form.setValue("borough_name", submission.borough_name);
          form.setValue(
            "chute_present",
            submission.chute_present ? "yes" : "no"
          );
          form.setValue("created_by", submission.created_by);
          form.setValue(
            "garbage_attributes",
            Object.fromEntries(
              Object.entries(submission.garbage_attributes).map(
                ([key, value]) => [key, Number(value)]
              )
            )
          );
        }
      } catch (error) {
        console.error("Error fetching submission:", error);
        toast({
          title: "Error",
          description: "Failed to load submission data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [propertyID]);

  useEffect(() => {
    const fetchAttributes = async () => {
      setIsLoadingAttributes(true);
      try {
        const res = await getGarbageAttributes();
        setGarbageAttributes(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingAttributes(false);
      }
    };

    fetchAttributes();
  }, []);

  useEffect(() => {
    const filtered = properties.filter((property) =>
      property.property_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  }, [searchTerm, properties]);

  const getPropertiesList = async () => {
    setPropertiesLoading(true);
    try {
      const res = await getProperties();
      setProperties(res);
      setPropertiesLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      property_id: "",
      client_id: "",
      client_type: "",
      client_name: "",
      borough_name: "",
      chute_present: "no",
      created_by: "",
      garbage_attributes: {},
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = form;

  const handlePropertySelect = async (propertyId: string) => {
    const property = properties.find((prop) => prop.property_id === propertyId);
    if (property) {
      setValue("property_id", property.property_id);
      try {
        const propertyDetails = await getPropertyDetailsForAddEntry(propertyId);
        const property = propertyDetails.data;
        setValue("client_id", property.client_id);
        setValue("client_type", property.client_type ?? "");
        setValue("client_name", property.client_name ?? "");
        setValue("borough_name", property.borough_name ?? "");
        setValue("street_name", property.street_name ?? "");
        setValue("chute_present", property.chute_present ? "yes" : "no");
      } catch (error: any) {
        if (error.status === 404) {
          toast({
            title: "Error",
            description: "Client not found",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOnOpenChange = () => {
    return getPropertiesList();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      });

      await addGarbageEntry({ ...data, timestamp });
      toast({
        title: "Success",
        description: "Garbage entry has been submitted successfully.",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit garbage entry.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    reset();
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Entry</CardTitle>
          <p className="text-md text-gray-800 pt-0">
            Edit garbage entry, verify all the details before submission.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex space-y-6">
              <ListSkeleton rows={8} />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-20">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="property_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="propertyId">
                            Property Id
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value); // Update the form state
                                handlePropertySelect(value); // Fetch additional details
                              }}
                              onOpenChange={handleOnOpenChange}
                            >
                              <SelectTrigger id="propertyId">
                                <SelectValue placeholder="Select">
                                  {field.value && field.value}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <Input
                                  type="text"
                                  placeholder="Search property ID"
                                  value={searchTerm}
                                  onChange={handleSearchChange}
                                />
                                {propertiesLoading ? (
                                  <div className="pt-4 pb-2 flex justify-center">
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin text-center" />
                                  </div>
                                ) : (
                                  filteredProperties.map((property) => (
                                    <SelectItem
                                      key={property.property_id}
                                      value={property.property_id}
                                    >
                                      {property.property_id}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="client_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Id</FormLabel>
                          <FormControl>
                            <Input
                              id="clientID"
                              placeholder="Client Id"
                              type="text"
                              autoCapitalize="none"
                              autoCorrect="off"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="client_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Type</FormLabel>
                          <FormControl>
                            <Input
                              disabled
                              id="clientType"
                              placeholder="Client Type"
                              type="text"
                              autoCapitalize="none"
                              autoCorrect="off"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="client_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled
                              id="Name"
                              placeholder="Name"
                              type="text"
                              autoCapitalize="none"
                              autoCorrect="off"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="borough_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="boroughName">
                            Borough Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled
                              id="boroughName"
                              placeholder="Name"
                              type="text"
                              autoCapitalize="none"
                              autoCorrect="off"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="street_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="streetName">
                            Street Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled
                              id="streetName"
                              placeholder="Street Name"
                              type="text"
                              autoCapitalize="none"
                              autoCorrect="off"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chute_present"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="chutePresent">
                            Chute Present
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              disabled
                              value={field.value}
                              onValueChange={field.onChange}
                              className="flex"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="r1" />
                                <Label htmlFor="r1">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="r2" />
                                <Label htmlFor="r2">No</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Garbage Segregation</h3>
                    {isLoadingAttributes ? (
                      <ListSkeleton rows={4} />
                    ) : (
                      garbageAttributes.map(({ attribute_name }, index) => (
                        <FormField
                          key={attribute_name}
                          control={form.control}
                          name={`garbage_attributes.${attribute_name}`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-4">
                                <FormLabel className="w-24 leading-6">
                                  {attribute_name}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    id={`garbage-attribute-${attribute_name}`}
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.valueAsNumber;
                                      field.onChange(
                                        isNaN(value) ? undefined : value
                                      );
                                    }}
                                    className={cn(
                                      "w-20",
                                      errors.garbage_attributes &&
                                        "border-red-500"
                                    )}
                                  />
                                </FormControl>
                                <span className="text-gray-500">lbs</span>
                              </div>
                              {/* Show individual field errors if needed */}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))
                    )}

                    {/* Show the root error for garbage_attributes */}
                    {errors.garbage_attributes?.root && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.garbage_attributes.root.message}
                      </p>
                    )}

                    {/* Alternative way to show errors */}
                    {errors.garbage_attributes &&
                      "message" in errors.garbage_attributes && (
                        <p className="text-sm text-red-500 mt-1">
                          {/* {errors.garbage_attributes.message} */}
                        </p>
                      )}
                  </div>
                </div>
                <div className="flex justify-start gap-4 mt-6">
                  <Button type="button" variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default EditEntryForm;
