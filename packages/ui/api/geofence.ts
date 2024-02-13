import { geolocation, ipAddress } from '@vercel/edge';
import { get } from '@vercel/edge-config';
import { NextRequest, NextResponse } from 'next/server';
import { withEdgeHandlers } from '../lib/api';
import { AppEnv, EdgeStore } from '../lib/typings';
import { ApiError } from '../lib/errors';
import { GEOFENCE_VERCEL_STORE_KEY } from '../lib/constants';
import { APP_ENV } from '../config';

const [defaultCountry, defaultIP] =
  APP_ENV === AppEnv.DEVELOPMENT ? ['US', '127.0.1.1'] : [undefined, undefined];

const GET = async (req: Request | NextRequest) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const geofencing = await get<EdgeStore>(GEOFENCE_VERCEL_STORE_KEY);
  const { ip = defaultIP, country = defaultCountry } = {
    ...geolocation(req),
    ip: ipAddress(req)
  };

  if (!geofencing || !ip || !country) {
    throw new ApiError(
      'BAD_REQUEST',
      !geofencing
        ? 'Cannot read from store'
        : !ip
        ? 'Cannot read IP from request'
        : 'Cannot read country from request'
    );
  }

  if (
    !geofencing['whitelist-ips'].includes(ip) &&
    geofencing['blocked-country-codes'].includes(country)
  ) {
    throw new ApiError('FAHRENHEIT', 'Not allowed in your region');
  }

  return NextResponse.json({ allowed: true }, { status: 200 });
};

export default withEdgeHandlers({ GET });
