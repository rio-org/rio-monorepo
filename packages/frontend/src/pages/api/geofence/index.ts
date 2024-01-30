import { NextResponse } from 'next/server';
import { geolocation, ipAddress } from '@vercel/edge';
import { get } from '@vercel/edge-config';
import { withEdgeErrors, withEdgeHandlers } from '@rio-monorepo/ui/lib/api';
import { GeoFencingEdgeStore, AppEnv } from '@rio-monorepo/ui/lib/typings';
import { APP_ENV, GEOFENCE_STORE_KEY } from '@rio-monorepo/ui/config';
import { ApiError } from '@rio-monorepo/ui/lib/errors';

export const config = {
  runtime: 'edge',
  dynamic: 'force-dynamic'
};

const GET = withEdgeErrors(async (req: Request) => {
  const ip = ipAddress(req) ?? '127.0.0.1';
  const { country } = geolocation(req);

  if (APP_ENV !== AppEnv.PRODUCTION) {
    console.log({ ip, country });
  }

  const geofencing = await get<GeoFencingEdgeStore>(GEOFENCE_STORE_KEY);

  if (!geofencing) {
    throw new ApiError('REQUEST_FAILURE', 'Cannot read from store');
  }

  const {
    'blocked-country-codes': blockedCountryCodes,
    'whitelist-ips': whitelistIPs
  } = geofencing;

  if (whitelistIPs.includes(ip)) {
    return NextResponse.json({ allowed: true }, { status: 200 });
  }

  if (!country) {
    throw new ApiError('BAD_REQUEST', 'Cannot read country from request');
  }

  if (blockedCountryCodes.includes(country)) {
    throw new ApiError('FAHRENHEIT', 'Not allowed in your region');
  }

  return NextResponse.json({ allowed: true }, { status: 200 });
});

export default withEdgeHandlers({ GET });
