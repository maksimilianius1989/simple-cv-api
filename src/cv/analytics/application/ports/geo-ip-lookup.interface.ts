export interface IGeoData {
  country?: string;
  region?: string;
  city?: string;
}

export const GEO_IP_LOOKUP = Symbol('GEO_IP_LOOKUP');
export interface IGeoIpLookup {
  lookup(ip: string): IGeoData | null;
}
