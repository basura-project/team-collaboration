"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/store";

import Loading from "@/components/ui/loading";

export const UserRouter = ({
  admin,
  employee,
  client,
  auth,
}: Readonly<{
  admin: React.ReactNode;
  employee: React.ReactNode;
  client: React.ReactNode;
  auth: React.ReactNode;
}>): React.ReactNode => {
  const [defaultRoute, setDefaultRoute] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userPromise, fetchTime } = useUser();

  useEffect(() => {
    // Set default route dynamically based on user role
    const handleRoutes = async () => {
      try {
        let currentUser = await userPromise;
        if (currentUser) {
          // Set the default route based on user role
          if (currentUser.role === "admin") {
            setDefaultRoute("admin");
          } else if (currentUser.role === "employee") {
            setDefaultRoute("employee");
          } else if (currentUser.role === "client") {
            setDefaultRoute("client");
          }
        } else {
          // Handle the case where no user is found
          setDefaultRoute("auth");
        }
      } catch (error) {
        // Handle any errors from the promise
        console.error("Error fetching user:", error);
        setDefaultRoute("auth"); // Redirect to auth if there's an error
      } finally {
        setIsLoading(false); // Ensure loading is set to false in all cases
      }
    };
    handleRoutes();
  }, [userPromise, defaultRoute]);

  // Map defaultRoute to the appropriate layout component
  const routeComponents: { [key: string]: React.ReactNode } = {
    admin,
    employee,
    client,
    auth,
  };

  return <>{!isLoading ? routeComponents[defaultRoute] : <Loading />}</>;
};

export default UserRouter;
