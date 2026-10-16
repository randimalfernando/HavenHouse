import { prisma } from "@/lib/prisma";

export const STATES = [
  { code: "WA", name: "Western Australia" },
  { code: "NT", name: "Northern Territory" },
  { code: "SA", name: "South Australia" },
  { code: "QLD", name: "Queensland" },
  { code: "NSW", name: "New South Wales" },
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "VIC", name: "Victoria" },
  { code: "TAS", name: "Tasmania" },
];

// Works out the state/territory from an Australian postcode.
export function stateFromPostcode(postcode) {
  const n = parseInt(String(postcode ?? "").trim(), 10);
  if (!Number.isFinite(n)) return null;
  if ((n >= 200 && n <= 299) || (n >= 2600 && n <= 2618) || (n >= 2900 && n <= 2920)) return "ACT";
  if ((n >= 1000 && n <= 2599) || (n >= 2619 && n <= 2899) || (n >= 2921 && n <= 2999)) return "NSW";
  if ((n >= 3000 && n <= 3999) || (n >= 8000 && n <= 8999)) return "VIC";
  if ((n >= 4000 && n <= 4999) || (n >= 9000 && n <= 9999)) return "QLD";
  if (n >= 5000 && n <= 5999) return "SA";
  if (n >= 6000 && n <= 6999) return "WA";
  if (n >= 7000 && n <= 7999) return "TAS";
  if (n >= 800 && n <= 999) return "NT";
  return null;
}

// Returns { states: [{code,name,count,services:[names]}], total, unknown }
export async function getServicesByState() {
  const services = await prisma.service.findMany({
    select: { serviceName: true, location: { select: { postalCode: true } } },
    orderBy: { serviceName: "asc" },
  });

  const byCode = Object.fromEntries(STATES.map((s) => [s.code, { ...s, count: 0, services: [] }]));
  let unknown = 0;

  for (const s of services) {
    const code = stateFromPostcode(s.location?.postalCode);
    if (code && byCode[code]) {
      byCode[code].count += 1;
      byCode[code].services.push(s.serviceName);
    } else {
      unknown += 1;
    }
  }

  return { states: STATES.map((s) => byCode[s.code]), total: services.length, unknown };
}
