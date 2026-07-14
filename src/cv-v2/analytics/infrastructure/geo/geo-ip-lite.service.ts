import {
  IGeoData,
  type IGeoIpLookup,
} from '../../application/ports/geo-ip-lookup.interface';
import { Injectable } from '@nestjs/common';
import geoip from 'geoip-lite';

@Injectable()
export class GeoipLiteService implements IGeoIpLookup {
  lookup(ip: string): IGeoData | null {
    const geo = geoip.lookup(ip);
    if (!geo) return null;
    return {
      country: geo.country,
      region: geo.region,
      city: geo.city,
    };
  }
}
