import { PlaceResult } from "@/types";

export async function searchLocation(query: string): Promise<PlaceResult[]> {
  if (!query) return [];
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
    if (!res.ok) throw new Error("Geocode failed");
    return await res.json();
  } catch (e) {
    console.error("Search error:", e);
    return [];
  }
}
