import { type ClassValue, clsx } from "clsx";
import { randomBytes } from "crypto";
import { twMerge } from "tailwind-merge";

export enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}

export enum Endpoint {
  LOGIN = "/login",
  SHOP = "/shop",
  DASHBOARD = "/dashboard",
  MERCHANT = "merchant",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sendBackendRequest = async (
  endpoint: string,
  method: HttpMethod,
  data?: any,
  isFormData: boolean = false,
  headerAuthorization: string = ""
): Promise<Response> => {
  const headers: HeadersInit = {};
  let body: string | FormData | undefined;

  if (isFormData) {
    body = data as FormData;
  } else {
    headers["Content-Type"] = "application/json";
    if (headerAuthorization) {
      headers["Authorization"] = headerAuthorization;
    }
    body = data ? JSON.stringify(data) : undefined;
  }

  const response = await fetch(`/api/${endpoint}`, {
    method,
    headers,
    body,
  });
  return response;
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return str; // Return the string as-is if it's empty or null
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const formatCurrency = (amount: number): string => {
  // Check if the input is a valid number
  if (isNaN(amount) || !isFinite(amount)) {
    throw new Error("Invalid input. Please provide a valid number.");
  }

  // Use Number.prototype.toLocaleString() to format the number without decimals
  const formattedAmount = amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formattedAmount;
};

export const formatAddress = (address: string | undefined) => {
  if (!address) return "";
  const firstFive = address.substring(0, 4);
  const lastFive = address.substring(address.length - 4);
  return `${firstFive}...${lastFive}`;
};
export function generateApiKey(): string {
  // Generate a 32-byte random string and convert it to hex
  return `pk_${randomBytes(32).toString("hex")}`;
}
