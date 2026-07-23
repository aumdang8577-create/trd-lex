/**
 * Formats a number into a Thai Baht currency string representation
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("THB", "")
    .trim();
}

/**
 * Converts Latitude & Longitude (WGS84) to UTM Coordinates (WGS84 / Zone 47N or 48N for Thailand)
 */
export function latLngToUTM(lat: number, lng: number): string {
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return "N/A";

  const zone = lng < 102.0 ? 47 : 48;
  const zoneMeridian = zone === 47 ? 99.0 : 105.0;

  const radLat = (lat * Math.PI) / 180.0;
  const radLng = (lng * Math.PI) / 180.0;
  const radMeridian = (zoneMeridian * Math.PI) / 180.0;

  const a = 6378137.0; // WGS84 Major Axis
  const f = 1 / 298.257223563; // WGS84 Flattening
  const k0 = 0.9996;
  const e2 = 2 * f - f * f;

  const dLng = radLng - radMeridian;

  const N = a / Math.sqrt(1 - e2 * Math.sin(radLat) * Math.sin(radLat));
  const T = Math.tan(radLat) * Math.tan(radLat);
  const C = (e2 / (1 - e2)) * Math.cos(radLat) * Math.cos(radLat);
  const A = dLng * Math.cos(radLat);

  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256) * radLat -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024) *
        Math.sin(2 * radLat) +
      ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024) * Math.sin(4 * radLat) -
      ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * radLat));

  const easting =
    k0 *
      N *
      (A +
        ((1 - T + C) * Math.pow(A, 3)) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * (e2 / (1 - e2))) * Math.pow(A, 5)) /
          120) +
    500000.0;

  const northing =
    k0 *
    (M +
      N *
        Math.tan(radLat) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * (e2 / (1 - e2))) *
            Math.pow(A, 6)) /
            720));

  const eastFormatted = Math.round(easting).toLocaleString("th-TH");
  const northFormatted = Math.round(northing).toLocaleString("th-TH");
  const latFormatted = lat.toFixed(5);
  const lngFormatted = lng.toFixed(5);

  return `${latFormatted}, ${lngFormatted} (UTM ${zone}N  E: ${eastFormatted}, N: ${northFormatted})`;
}
