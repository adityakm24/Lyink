import UAParser from "ua-parser-js";
import axios from "axios";

export function getUserAgent(userAgentHeader) {
  const parser = new UAParser();
  const ua = userAgentHeader || "";
  const result = parser.setUA(ua).getResult();
  return result;
}

export async function getGeolocation() {
  try {
    const response = await axios.get("https://ipinfo.io/json");
    const { city, region, country } = response.data;
    return `${city}, ${region}, ${country}`;
  } catch (error) {
    console.error("Error retrieving geolocation:", error);
    return "Unknown";
  }
}

export function getScreenResolution() {
  if (typeof window !== "undefined") {
    const width = window.screen.width;
    const height = window.screen.height;
    return `${width}x${height}`;
  }
  return "Unknown";
}

export async function getLocationFromIP() {
  try {
    const response = await axios.get("https://ipinfo.io/json");
    const { city, region, country } = response.data;
    return `${city}, ${region}, ${country}`;
  } catch (error) {
    console.error("Error retrieving location from IP:", error);
    return "Unknown";
  }
}
