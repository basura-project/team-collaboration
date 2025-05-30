"use client";

import * as React from "react";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";


import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { editClient, getUnAssignedProperties,
  getPropertyDetails, } from "@/services/index";

export default function EditClient({ clientDetails }: any) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<string>("");
  const [unAssignedProperties, setUnAssignedProperties] = React.useState<any[]>(
    []
  );
  const [selectedProperties, setSelectedProperties] = React.useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const preselectData = clientDetails.properties.map((property: string) => {
      return {
        label: property,
        value: property,
      };
    })
    setSelectedProperties(preselectData);
  },[]);

  const formSchema = z
    .object({
      clientID: z
        .string()
        .min(1, { message: "Please enter Client Id" })
        .max(50),
      name: z
        .string()
        .min(1, { message: "Please enter Name" })
        .max(50),
      phone: z
        .string()
        .min(1, { message: "Please enter contact number" })
        .max(50),
      email: z
        .string()
        .min(1, { message: "Please enter email" })
        .email("This is not a valid email."),
      properties: z.array(z.string()).min(1, { message: "Please select a property" }).default([]),
      username: z.string().min(1, { message: "Please enter username" }).max(50),
      password: z.string().min(1, { message: "Please enter password" }).max(50),
      confirmPassword: z
        .string()
        .min(1, { message: "Please confirm password" })
        .max(50),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"], // path of error
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientID: clientDetails.client_id,
      name: clientDetails.client_name,
      phone: clientDetails.phone,
      email: clientDetails.email,
      username: clientDetails.username,
      password: "2244",
      properties: clientDetails.properties
    },
  });

  async function onSubmit() {
    let values = form.getValues();
    setIsLoading(true);
    setIsError("");

    try {
      let clientDetailsForm = {
        client_id: clientDetails.client_id,
        client_name: values.name,
        phone: values.phone,
        email: values.email,
        username: values.username,
        password: values.password,
        properties: values.properties
      };
      let res = await editClient(clientDetails.client_id, clientDetailsForm);
      if (res) {
        toast({
          title: "Successful",
          description: "Client details submitted successfully",
        });
      }
      setIsLoading(false);
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

  const handleOnOpen = async (state: boolean) => {
    // Fetch unassigned properties
    if (state) {
      setOptionsLoading(true);
      try {
        const unAssignedProperties = await getUnAssignedProperties();

        // Convert each property string to an object and wait for all to resolve
        const formattedProperties = await Promise.all(
          unAssignedProperties.map(async (property: string) => {
            const res = await getPropertyDetails(property);

            if (res) {
              return {
                label: res.data.property_id,
                value: res.data.property_id,
                category: res.data.property_type,
              };
            }
            // Return null or handle missing response appropriately
            return null;
          })
        );

        // Filter out any null results in case getPropertyDetails returned undefined
        setUnAssignedProperties(formattedProperties.filter(Boolean));
      } catch (err) {
        console.error("Error fetching unassigned properties", err);
      } finally {
        setOptionsLoading(false);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
      <FormField
            control={form.control}
            name="clientID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Id</FormLabel>
                <FormControl>
                  <Input
                    id="clientID"
                    placeholder="Client Id"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="clientID"
                    autoCorrect="off"
                    disabled={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input
                  id="Name"
                  placeholder="Name"
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Phone No</FormLabel>
              <FormControl>
                <Input
                  id="phone"
                  placeholder="+1 XXXXXXXXX"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Id</FormLabel>
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
        <FormField
          control={form.control}
          name="properties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Properties</FormLabel>
              <FormControl>
              <MultiSelect
                  onOpen={(state) => handleOnOpen(state)}
                  options={unAssignedProperties || selectedProperties}
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={selectedProperties}
                  placeholder="Select"
                  variant="inverted"
                  animation={2}
                  loading={optionsLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  placeholder="User Name"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <Button
          onClick={() => clearForm()}
          variant="outline"
          className="!mt-3 mr-3"
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Clear
        </Button>

        <Button
          onClick={() => onSubmit()}
          className="!mt-3"
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
