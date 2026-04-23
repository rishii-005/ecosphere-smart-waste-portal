import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();

const querySchema = z.object({
  query: z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180)
  })
});

interface NominatimResponse {
  display_name?: string;
  address?: Record<string, string | undefined>;
  name?: string;
}

function buildAddressLabel(data: NominatimResponse, lat: number, lng: number) {
  const address = data.address || {};
  const landmark =
    address.amenity ||
    address.building ||
    address.office ||
    address.tourism ||
    address.shop ||
    address.leisure ||
    address.university ||
    address.college ||
    data.name;

  const locality =
    address.suburb ||
    address.neighbourhood ||
    address.city_district ||
    address.village ||
    address.town ||
    address.city;

  const parts = [
    landmark,
    address.road,
    locality,
    address.state
  ].filter(Boolean);

  const label = parts.length ? parts.join(", ") : data.display_name;
  const nearLabel = [landmark ? `Near ${landmark}` : "", locality, address.state].filter(Boolean).join(", ");

  return {
    address: nearLabel || label || `Near ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    fullAddress: data.display_name || label || nearLabel || `Near ${lat.toFixed(5)}, ${lng.toFixed(5)}`
  };
}

router.get("/reverse-geocode", validate(querySchema), async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&namedetails=1&accept-language=en`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SmartWastePortal/1.0 (student project reverse geocoder)",
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new HttpError(502, "Location lookup service is unavailable right now.");
    }

    const data = (await response.json()) as NominatimResponse;
    const label = buildAddressLabel(data, lat, lng);
    res.json(label);
  } catch (error) {
    next(error);
  }
});

export default router;
