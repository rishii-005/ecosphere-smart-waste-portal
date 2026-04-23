import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LocateFixed, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../components/Button";
import { DropdownSelect } from "../components/DropdownSelect";
import { api } from "../lib/api";
import type { WasteType } from "../types";

const wasteTypes: WasteType[] = ["plastic", "organic", "e-waste", "paper", "metal", "glass", "mixed"];

interface BrowserReverseGeocodeResponse {
  display_name?: string;
  name?: string;
  address?: Record<string, string | undefined>;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildReadableLocation(data: BrowserReverseGeocodeResponse, latitude: number, longitude: number) {
  const address = data.address || {};
  const landmark =
    address.amenity ||
    address.building ||
    address.office ||
    address.university ||
    address.college ||
    address.tourism ||
    address.shop ||
    data.name;

  const locality =
    address.suburb ||
    address.neighbourhood ||
    address.city_district ||
    address.village ||
    address.town ||
    address.city;

  return (
    [landmark ? `Near ${landmark}` : "", locality, address.state].filter(Boolean).join(", ") ||
    data.display_name ||
    `Near ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
  );
}

export function RequestPage() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [wasteType, setWasteType] = useState<WasteType>("plastic");
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const wasteOptions = useMemo(
    () =>
      wasteTypes.map((type) => ({
        value: type,
        label: type === "e-waste" ? "E-Waste" : type.charAt(0).toUpperCase() + type.slice(1)
      })),
    []
  );

  const useLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser does not support live location.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await api.reverseGeocode(latitude, longitude);
          setAddress(result.address || result.fullAddress);
          setMapUrl(`https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`);
          toast.success("Live location added.");
        } catch {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&namedetails=1&accept-language=en`
            );
            const data = (await response.json()) as BrowserReverseGeocodeResponse;
            setAddress(buildReadableLocation(data, latitude, longitude));
            setMapUrl(`https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`);
            toast.success("Nearby address added.");
          } catch {
            setAddress(`Near ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
            setMapUrl(`https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`);
            toast("Address lookup service unavailable, so coordinates fallback used.");
          }
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please allow location access.");
          return;
        }
        toast.error("Could not fetch live location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await api.createRequest({
        wasteType,
        quantityKg: Number(form.get("quantityKg")),
        address,
        pickupDate: String(form.get("pickupDate")),
        notes: String(form.get("notes") || ""),
        imageUrl: preview
      });
      toast.success("Pickup request submitted.");
      event.currentTarget.reset();
      setPreview("");
      setWasteType("plastic");
      setAddress("");
      setMapUrl("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section bg-[#eaf7ee] dark:bg-[#101414]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="font-display text-4xl font-bold">Request waste pickup</h1>
          <p className="mt-2 max-w-2xl text-black/65 dark:text-white/65">Submit accurate waste details so collection teams can plan route, vehicle type, and handling safety.</p>
          <form onSubmit={submit} className="mt-8 grid gap-5 rounded-lg border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(16,20,20,0.08)] dark:border-white/10 dark:bg-[#151c1a]">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 font-semibold">
                Waste type
                <DropdownSelect value={wasteType} onChange={setWasteType} options={wasteOptions} />
              </label>
              <label className="grid gap-2 font-semibold">
                Quantity in kg
                <input className="field" name="quantityKg" type="number" min={1} max={500} placeholder="5" required />
              </label>
            </div>
            <label className="grid gap-2 font-semibold">
              Pickup date
              <input className="field" name="pickupDate" type="date" required />
            </label>
            <label className="grid gap-2 font-semibold">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>Address</span>
                <button
                  type="button"
                  onClick={useLiveLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:hover:bg-white/10"
                >
                  {locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
                  {locating ? "Fetching location..." : "Use live location"}
                </button>
              </div>
              <textarea
                className="field min-h-28"
                name="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="House number, street, city, landmark"
                required
              />
              <p className="text-sm font-normal text-black/55 dark:text-white/55">
                You can type manually or use live location to fetch the nearest address name.
              </p>
            </label>
            {mapUrl && (
              <div className="rounded-lg border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                <div className="mb-3 text-sm font-semibold">Pinned location preview</div>
                <div className="overflow-hidden rounded-lg">
                  <iframe
                    title="Selected live location map"
                    src={mapUrl}
                    className="h-64 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
            <label className="grid gap-2 font-semibold">
              Notes
              <textarea className="field min-h-24" name="notes" placeholder="Example: cleaned bottles, broken glass wrapped, old phone battery included" />
            </label>
            <label className="grid cursor-pointer gap-3 rounded-lg border border-dashed border-black/20 p-5 text-center dark:border-white/20">
              <UploadCloud className="mx-auto text-moss dark:text-mint" />
              <span className="font-semibold">Upload optional waste photo</span>
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (file) setPreview(await fileToDataUrl(file));
                }}
              />
            </label>
            <Button disabled={loading}>{loading ? "Submitting..." : "Submit request"}</Button>
          </form>
        </motion.div>
        <motion.aside initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.06 }} className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(16,20,20,0.08)] dark:border-white/10 dark:bg-[#151c1a]">
          <h2 className="font-display text-2xl font-bold">Photo preview</h2>
          <div className="mt-4 grid aspect-[4/3] place-items-center overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
            {preview ? <img src={preview} alt="Waste upload preview" className="h-full w-full object-cover" /> : <p className="px-8 text-center text-sm text-black/55 dark:text-white/55">Add a photo to help the collection team identify material type and safety needs.</p>}
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
