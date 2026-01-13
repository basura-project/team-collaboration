import axios from "axios";
import Cookies from "js-cookie";

let BASEURL = "https://basura-app-ba8f0c65e78f.herokuapp.com/";

const apiService = axios.create({
  baseURL: BASEURL,
  timeout: 10000,
});

// Request interceptor

apiService.interceptors.request.use(
  (config: any) => {
    let auth: string;
    if (Cookies.get("access_token")) {
      auth = `Bearer ${Cookies.get("access_token")}`;
    } else {
      auth = "";
    }
    config.headers["Authorization"] = auth;
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

let refreshTokenRetry = true;

// Response interceptor

apiService.interceptors.response.use(
  (response) => response, // Just return the response if it's successful
  async (error) => {
    const originalRequest = error.config;
    // Check if the error is a 401 and if it's not a retry
    if (
      error.response.status === 401 &&
      error.response.data.msg === "Token has expired" &&
      refreshTokenRetry
    ) {
      refreshTokenRetry = false;
      try {
        // Attempt to refresh the token
        const refreshToken = Cookies.get("refresh_token"); // Or wherever you store it
        const response = await axios.post(
          `${BASEURL}/token/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        // Save the new token
        const newToken = response.data.access_token;
        Cookies.set("access_token", newToken);

        // Update the Authorization header and retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiService(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Handle token refresh failure (e.g., redirect to login)
        console.error("Token refresh failed:", refreshError);
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/"; // Redirect to login if refresh fails
      }
    } else if (
      error.response.status === 401 &&
      error.response.data.msg === "Missing Authorization Header"
    ) {
      window.location.href = "/";
    }

    // Return any error which is not due to authentication
    return Promise.reject(error);
  }
);

// Login Api
export const login = async (userDetails: any) => {
  try {
    const response = await apiService.post("login", userDetails);
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Logout function
export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  window.location.href = "/";
};

// User details
export const userDetails = async () => {
  try {
    const response = await apiService.get("user/details");
    return response;
  } catch (error) {
    console.error("Error fetching user details", error);
    throw error;
  }
};

// Suggest employee ID

export const suggestID = async (type: string) => {
  try {
    const response = await apiService.get(`${type}-id/suggest`);
    return response;
  } catch (error) {
    console.error(`Error fetching suggested ${type} ID`, error);
    throw error;
  }
};

// Add new employee
export const addEmployee = async (employeeDetails: any) => {
  try {
    const response = await apiService.post("add-employee", employeeDetails, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error adding a new employee", error);
    throw error;
  }
};

// Edit employee
export const editEmployee = async (
  employee_id: string,
  employeeDetails: any
) => {
  try {
    const response = await apiService.put(
      `employee/${employee_id}`,
      employeeDetails
    );
    return response;
  } catch (error) {
    console.error("Error updating employee details", error);
    throw error;
  }
};

// Delete employee
export const deleteEmployee = async (employee_id: string) => {
  try {
    const response = await apiService.delete(`employee/${employee_id}`);
    return response;
  } catch (error) {
    console.error("Error deleting employee", error);
    throw error;
  }
};

// Get list of employees
export const getEmployees = async () => {
  try {
    const response = await apiService.get("employees", {
      params: { sort_by: "employee_id", sort_order: "desc" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees list", error);
    throw error;
  }
};

// Get employee details
export const getEmployeeDetails = async (empID: string) => {
  try {
    const response = await apiService.get(`employee/${empID}`);
    return response;
  } catch (error) {
    console.error("Error fetching employee details", error);
    throw error;
  }
};

// Add new property
export const addProperty = async (propertyDetails: any) => {
  try {
    const response = await apiService.post("add-property", propertyDetails);
    return response;
  } catch (error) {
    console.error("Error adding property", error);
    throw error;
  }
};

// Get list of properties
export const getProperties = async () => {
  try {
    const response = await apiService.get("properties", {
      params: { sort_by: "property_id", sort_order: "desc" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching properties list", error);
    throw error;
  }
};

// Get unassigned properties

export const getUnAssignedProperties = async () => {
  try {
    const response = await apiService.get("unassigned-properties");
    return response.data;
  } catch (error) {
    console.error("Error fetching unassigned properties", error);
    throw error;
  }
};

// Get property details
export const getPropertyDetails = async (propertyId: string) => {
  try {
    const response = await apiService.get(`property/${propertyId}`);
    return response;
  } catch (error) {
    console.error("Error fetching property details", error);
    throw error;
  }
};

// Edit property
export const editProperty = async (
  propertyId: string,
  propertyDetails: any
) => {
  try {
    const response = await apiService.put(
      `property/${propertyId}`,
      propertyDetails
    );
    return response;
  } catch (error) {
    console.error("Error updating property details", error);
    throw error;
  }
};

// Delete property
export const deleteProperty = async (propertyId: string) => {
  try {
    const response = await apiService.delete(`property/${propertyId}`);
    return response;
  } catch (error) {
    console.error("Error deleting property", error);
    throw error;
  }
};

//Get Clients
export const getClients = async () => {
  try {
    const response = await apiService.get("clients", {
      params: { sort_by: "client_id", sort_order: "desc" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching clients list", error);
    throw error;
  }
};

// Get employee details
export const getClientDetails = async (clientID: string) => {
  try {
    const response = await apiService.get(`client/${clientID}`);
    return response;
  } catch (error) {
    console.error("Error fetching employee details", error);
    throw error;
  }
};

// Add new Client
export const addClient = async (clientDetails: any) => {
  try {
    const response = await apiService.post("add-client", clientDetails, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error adding a new employee", error);
    throw error;
  }
};

// Edit Client
export const editClient = async (client_id: string, clientDetails: any) => {
  try {
    const response = await apiService.put(`client/${client_id}`, clientDetails);
    return response;
  } catch (error) {
    console.error("Error updating employee details", error);
    throw error;
  }
};

// Delete Client
export const deleteClient = async (client_id: string) => {
  try {
    const response = await apiService.delete(`client/${client_id}`);
    return response;
  } catch (error) {
    console.error("Error deleting employee", error);
    throw error;
  }
};

//Get Garbage attributes
export const getGarbageAttributes = async () => {
  try {
    const response = await apiService.get("garbage-attributes");
    return response?.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Error fetching garbage attributes", error);
    throw new Error("Failed to fetch garbage attributes");
  }
};

// Add a garbage attribute
export const addGarbageAttribute = async (garbageAttribute: any) => {
  try {
    const response = await apiService.post(
      "garbage-attributes",
      garbageAttribute,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding a garbage attribute", error);
    throw error;
  }
};

// Edit a garbage attribute

export const editGarbageAttribute = async (
  garbageAttribute_name: string,
  garbageAttribute: object
) => {
  try {
    const response = await apiService.put(
      `garbage-attributes/${garbageAttribute_name}`,
      garbageAttribute
    );
    return response;
  } catch (error) {
    console.error("Error updating garbage attribute", error);
    throw error;
  }
};

// Delete a garbage attribute

export const deleteGarbageAttribute = async (garbageAttribute_name: string) => {
  try {
    const response = await apiService.delete(
      `garbage-attributes/${garbageAttribute_name}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting garbage attribute", error);
    throw error;
  }
};

// Add a garbage entry

export const addGarbageEntry = async (garbage_entry: any) => {
  try {
    const response = await apiService.post("add-entry", garbage_entry, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error adding a garbage entry", error);
    throw error;
  }
};

// Get property details for Add entry
export const getPropertyDetailsForAddEntry = async (propertyId: string) => {
  try {
    const response = await apiService.get(`property-details/${propertyId}`);
    if (response.status === 404) {
      throw new Error("There is no client associated with this property");
    }
    return response;
  } catch (error) {
    console.error("Error fetching property details", error);
    throw error;
  }
};

// Get garbage submissions
export const getGarbageSubmissions = async (page?: number) => {
  try {
    const response = await apiService.get("submissions", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching garbage submissions", error);
    throw error;
  }
};

// Get single garbage submission
export const getGarbageSubmission = async (propertyId: string) => {
  try {
    const response = await apiService.get(`submissions/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching garbage submission", error);
    throw error;
  }
};

// Delete garbage entry
export interface Params {
  property_id: string;
  client_id: string;
  timestamp: string;
  created_by: string;
}

export const deleteGarbageEntry = async (params: Params) => {
  try {
    const response = await apiService.delete("delete-entry", {
      headers: {
        "Content-Type": "application/json", // Set content type
      },
      data: params, // Pass JSON in the request body
    });
    return response;
  } catch (error) {
    console.error("Error deleting garbage entry", error);
    throw error;
  }
};

//Fetch analytics Data
export const getAnalyticsData = async (fromDate: string, toDate: string) => {
  try {
    const response = await apiService.get("analytics", {
      params: { start_date: fromDate, end_date: toDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics data", error);
    throw error;
  }
};

export const getAnalyticsDataForProperty = async () => {
  try {
    const response = await apiService.get("api/client/overview");
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics data", error);
    throw error;
  }
};

interface WasteDataQueryParams {
  startDate?: string;
  endDate?: string;
  clientId?: number;
  // Add other query parameters as needed
}

export const getClientWasteData = async (
  queryParams: WasteDataQueryParams = {}
): Promise<any> => {
  try {
    const response = await apiService.get("api/waste-data", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics data", error);
    throw error;
  }
};

export const getEnvironmentData = async (
  material: String,
  metric: String,
  weight: Number
) => {
  try {
    const response = await apiService.get("api/savings/", {
      params: {
        material: material,
        metric: metric,
        weight: weight,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching environment data", error);
    throw error;
  }
};
