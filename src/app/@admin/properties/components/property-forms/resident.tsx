"use client";

import React, { useEffect} from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import {
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast";
import { suggestID, addProperty, editProperty } from "@/services/index";
import { Value } from "@radix-ui/react-select";

type ApartmentType = {
  [key: string]: number;
};

export default function ResidentPropertyForm({
  className,
  edit,
  propertyDetails,
  ...props
}: any) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<string>("");
  const [bhkCount, setBhkCount] = React.useState<ApartmentType>({
    bhk1: 0,
    bhk2: 0,
    bhk3: 0,
    bhk4: 0,
    bhk5: 0
  });
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchSuggestedId = async () => {
     try {
       const response = await suggestID('property');
       form.setValue("propertyId", response.data.suggested_property_id)
     } catch (err) {
       console.error(err);
     }
    };
    fetchSuggestedId();
 },[]);

 const handleIncrement = (bhk: keyof ApartmentType) => {
  setBhkCount((prev) => ({
    ...prev,
    [bhk]: (prev[bhk] ?? 0) + 1,
  }));
};

const handleDecrement = (bhk: keyof ApartmentType) => {
  setBhkCount((prev) => ({
    ...prev,
    [bhk]: Math.max(0, (prev[bhk] ?? 0) - 1),
  }));
};


  const formSchema = z.object({
    propertyType: z.string().optional(),
    propertyId: z
      .string()
      .min(1, { message: "Please enter property id" })
      .max(50),
    ownerName: z
      .string()
      .min(1, { message: "Please enter owner's name" })
      .max(50),
    ownerPhoneNo: z
      .string()
      .min(1, { message: "Please enter owner's phone name" })
      .max(50),
    propertyManagerName: z
      .string()
      .min(1, { message: "Please enter property manager's name" })
      .max(50),
    propertyManagerContact: z
      .string()
      .min(1, { message: "Please enter property manager's phone number" })
      .max(50),
    apartmentType: z.object({
      bhk1: z.number().optional(),
      bhk2: z.number().optional(),
      bhk3: z.number().optional(),
      bhk4: z.number().optional(),
      bhk5: z.number().optional(),
    }).refine(data => {
      // Check if at least one of the bhk fields has a value
      return data.bhk1 !== undefined || data.bhk2 !== undefined || data.bhk3 !== undefined || data.bhk4 !== undefined || data.bhk5 !== undefined;
    }, {
      message: "Please select at least one apartment type" 
    }),
    housingType: z.string().min(1, { message: "Please select housing type" }),
    boroughName: z.string().min(1, { message: "Please enter borough name" }),
    streetName: z.string().min(1, { message: "Please enter street name" }),
    buildingNo: z.string().min(1, { message: "Please enter building number" }),
    chutePresent: z
      .string()
      .min(1, { message: "Please select if chute is present" }),
    chuteFloorLevel: z.coerce.number({
      message: "Please enter floor level",
    }),
    chuteFloorAll: z.coerce.boolean().optional(),
    noOfFloors: z.coerce.number({
      message: "Please enter the no. of floors",
    }),
    noOfBasementFloors: z.coerce.number({
      message: "Please enter the no. of basement floors",
    }),
    noOfUnitsPerFloor: z.coerce.number({
      message: "Please enter the no. of units per floor",
    }),
    noOfUnitsInTotal: z.coerce.number({
      message: "Please enter the no. of units in total",
    }),
    email: z
      .string()
      .min(1, { message: "Please enter email" })
      .email("This is not a valid email."),
  });

  let propertyDefaultValues;

  if (edit) {
    propertyDefaultValues = {
      propertyType: "Resident Buildings",
      propertyId: propertyDetails.property_id,
      ownerName: propertyDetails.owner_name,
      ownerPhoneNo: propertyDetails.owner_number,
      propertyManagerName: propertyDetails.property_manager_name,
      propertyManagerContact: propertyDetails.property_manager_phone_no,
      apartmentType: propertyDetails.apartment_type,
      housingType: propertyDetails.housing_type,
      boroughName: propertyDetails.borough_name,
      streetName: propertyDetails.street_name,
      buildingNo: propertyDetails.building_number,
      chutePresent: propertyDetails.chute_present === true ? "Yes" : "No",
      chuteFloorAll: propertyDetails.chute_floor_all,
      chuteFloorLevel: propertyDetails.chute_floor_level,
      noOfFloors: propertyDetails.number_of_floors,
      noOfBasementFloors: propertyDetails.number_of_basement_floors,
      noOfUnitsPerFloor: propertyDetails.number_of_units_per_floor,
      noOfUnitsInTotal: propertyDetails.number_of_units_total,
      email: propertyDetails.email,
    };
  } else {
    propertyDefaultValues = {
      propertyId: "",
      ownerName: "",
      ownerPhoneNo: "",
      propertyManagerName: "",
      propertyManagerContact: "",
      apartmentType: {
        bhk1: 0,
        bhk2: 0,
        bhk3: 0,
        bhk4: 0,
        bhk5: 0,
      },
      housingType: "",
      boroughName: "",
      streetName: "",
      buildingNo: "",
      chutePresent: "No",
      chuteFloorLevel: 0,
      chuteFloorAll: false,
      noOfFloors: 0,
      noOfBasementFloors: 0,
      noOfUnitsPerFloor: 0,
      noOfUnitsInTotal: 0,
      email: "",
    };
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: propertyDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIsError("");

    try {
      let propertyDetails = {
        property_id: values.propertyId,
        owner_name: values.ownerName,
        owner_number: values.ownerPhoneNo,
        property_manager_name: values.propertyManagerName,
        property_manager_phone_no: values.propertyManagerContact,
        apartment_type: values.apartmentType,
        housing_type: values.housingType,
        borough_name: values.boroughName,
        street_name: values.streetName,
        building_number: values.buildingNo,
        chute_present: values.chutePresent == "Yes" ? true : false,
        chute_floor_level: values.chuteFloorLevel,
        chute_floor_all: values.chuteFloorAll,
        number_of_floors: values.noOfFloors,
        number_of_basement_floors: values.noOfBasementFloors,
        number_of_units_per_floor: values.noOfUnitsPerFloor,
        number_of_units_total: values.noOfUnitsInTotal,
        email: values.email,
        property_type: "Resident Buildings",
      };

      if (edit) {
        let res = await editProperty(values.propertyId, propertyDetails);
        if (res) {
          toast({
            title: "Successful",
            description: "Property has been updated successfully",
          });
        }
        setIsLoading(false);
      } else {
        let res = await addProperty(propertyDetails);
        if (res) {
          toast({
            title: "Successful",
            description: "Property has been created successfully",
          });
        }
        setIsLoading(false);
      }
    } catch (e: any) {
      setIsLoading(false);
      if (e.response && e.response.data) {
        setIsError(e.response.data.error);
      }
      console.log(e);
    }
  }

  function clearForm() {
    form.reset();
  }

  function ChutePresentWatched({ control }: { control: any }) {
    const firstName = useWatch({
      control,
      name: "chutePresent",
    });

    return firstName == "Yes" ? (
      <>
        <Image
          src="/form-child-arrow.svg"
          width={30}
          height={30}
          alt=""
          className="block dark:hidden ml-[6px] !mt-[16px]"
        />
        <div className="block dark:hidden ml-[54px] !mt-[-30px]">
          <FormField
            control={form.control}
            name="chuteFloorLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chute Floor Level</FormLabel>
                <FormControl>
                  <Input
                    id="chuteFloorLevel"
                    placeholder="Chute Floor Level"
                    type="number"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                {}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          control={form.control}
          name="chuteFloorAll"
          render={({ field }) => (
            <FormItem className="flex space-x-3 space-y-0 mt-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Chute present on all floors
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        </div>
      </>
    ) : (
      ""
    ); // only re-render at the custom hook level, when firstName changes
  }

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {edit && (
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <FormControl>
                    <Input
                      id="propertyType"
                      placeholder="Property Type"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="propertyType"
                      autoCorrect="off"
                      disabled={edit ? true : false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Id</FormLabel>
                <FormControl>
                  <Input
                    id="propertyId"
                    placeholder="Property Id"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="propertyId"
                    autoCorrect="off"
                    disabled={edit ? true : false}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input
                    id="ownerName"
                    placeholder="Owner Name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="ownerName"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ownerPhoneNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Phone Number</FormLabel>
                <FormControl>
                  <Input
                    id="ownerPhoneNo"
                    placeholder="Owner Phone Number"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyManagerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Manager Name</FormLabel>
                <FormControl>
                  <Input
                    id="propertyManagerName"
                    placeholder="Property Manager Name"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyManagerContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Manager Phone Number</FormLabel>
                <FormControl>
                  <Input
                    id="propertyManagerContact"
                    placeholder="Property Manager Phone Number"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apartmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment</FormLabel>
                <Select
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Apartment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>No. of bedrooms</SelectLabel>
                      {Object.keys(bhkCount).map((bhk) => (
                        <div key={bhk} className="flex justify-between items-center px-4">
                          <span>{bhk.replace("bhk", "")} BDR</span>
                          <div className="flex justify-evenly items-center">
                            <Button
                              disabled={bhkCount[bhk] <= 0}
                              variant="link"
                              className="text-sm font-normal hover:no-underline"
                              onClick={() => handleDecrement(bhk as keyof ApartmentType)}
                            >
                              <Minus width={18} />
                            </Button>
                            <span className="max-w-4 min-w-4">
                              <b>{bhkCount[bhk] >= 5 ? `${bhkCount[bhk]}+` : bhkCount[bhk]}</b>
                            </span>
                            <Button
                              disabled={bhkCount[bhk] >= 20}
                              variant="link"
                              className="text-sm font-normal hover:no-underline"
                              onClick={() => handleIncrement(bhk as keyof ApartmentType)}
                            >
                              <Plus width={18} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </SelectGroup>
                  </SelectContent>
              </Select>
              <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="housingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Housing Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    id="housingType"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Private" id="r1" />
                      <Label htmlFor="r1">Private</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Public" id="r2" />
                      <Label htmlFor="r2">Public</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boroughName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Borough Name</FormLabel>
                <FormControl>
                  <Input
                    id="boroughName"
                    placeholder="Borough Name"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="streetName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Name</FormLabel>
                <FormControl>
                  <Input
                    id="streetName"
                    placeholder="Street Name"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buildingNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building No</FormLabel>
                <FormControl>
                  <Input
                    id="buildingNo"
                    placeholder="Building No"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chutePresent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chute Present</FormLabel>
                <FormControl>
                  <RadioGroup
                    id="chutePresent"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="r1" />
                      <Label htmlFor="r1">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="r2" />
                      <Label htmlFor="r2">No</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ChutePresentWatched control={form.control} />
          <FormField
            control={form.control}
            name="noOfFloors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Floors</FormLabel>
                <FormControl>
                  <Input
                    id="noOfFloors"
                    placeholder="No of Floors"
                    type="number"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noOfBasementFloors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Basement Floors</FormLabel>
                <FormControl>
                  <Input
                    id="noOfBasementFloors"
                    placeholder="No of Basement Floors"
                    type="number"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noOfUnitsPerFloor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Units per Floor</FormLabel>
                <FormControl>
                  <Input
                    id="noOfUnitsPerFloor"
                    placeholder="No of Units per Floor"
                    type="number"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noOfUnitsInTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Units in Total</FormLabel>
                <FormControl>
                  <Input
                    id="noOfUnitsInTotal"
                    placeholder="No of Units in Total"
                    type="number"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-6">
            <Button
              onClick={() => clearForm()}
              variant="outline"
              className="!mt-3 mr-3"
              disabled={isLoading}
            >
              Clear
            </Button>

            <Button
              className="!mt-3"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </form>
      </Form>
      {isError !== "" && !isLoading && (
        <p className="text-[0.8rem] font-medium text-destructive">{isError}</p>
      )}
    </div>
  );
}
