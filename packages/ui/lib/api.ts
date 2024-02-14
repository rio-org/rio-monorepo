import { ApiError, getApiSurfaceError } from './errors';
import { asType } from './utilities';
import { NextResponse } from 'next/server';
import type {
  Methods,
  Handler,
  RequestHandlers,
  EdgeFunction,
  EdgeFunctionHandlers,
  FAQsEdgeStore,
  FAQ
} from './typings';
import { FAQS_VERCEL_STORE_KEY } from './constants';
import { get } from '@vercel/edge-config';

export const withErrors = (handler: Handler): Handler => {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (err) {
      const error = asType<ApiError>(err);
      console.error('[API ERROR]', error.kind, error.message);
      const { httpStatusCode, surfaceError } = getApiSurfaceError(error);
      return res.status(httpStatusCode).json(surfaceError);
    }
  };
};

export const withEdgeErrors = (edgeFunction: EdgeFunction): EdgeFunction => {
  return async (req) => {
    try {
      return await edgeFunction(req);
    } catch (err) {
      const error = asType<ApiError>(err);
      console.error('[API ERROR]', error.kind, error.message);
      const { httpStatusCode, surfaceError } = getApiSurfaceError(error);
      return NextResponse.json(surfaceError, { status: httpStatusCode });
    }
  };
};

export const withHandlers = (handlers: RequestHandlers): Handler => {
  return (req, res) => {
    const method = req.method as Methods;

    if (!handlers[method]) {
      res.setHeader('Allow', Object.keys(handlers));
      res.status(405).end(`Method ${method} Not Allowed`);
      return;
    }

    return withErrors(handlers[method] as Handler)(req, res);
  };
};

export const withEdgeHandlers = (
  handlers: EdgeFunctionHandlers
): EdgeFunction => {
  return async (req) => {
    const method = req.method as Methods;

    if (!handlers[method]) {
      return NextResponse.json(`Method ${method} Not Allowed`, {
        status: 405,
        headers: { Allow: Object.keys(handlers).join(', ') }
      });
    }

    return withEdgeErrors(handlers[method] as EdgeFunction)(req);
  };
};

export const getFAQsFromEdge = async (
  appName: keyof FAQsEdgeStore,
  route: string
): Promise<FAQ[]> => {
  try {
    const faqs = await get<FAQsEdgeStore>(FAQS_VERCEL_STORE_KEY);
    return faqs?.[appName]?.[route] ?? [];
  } catch {
    return [];
  }
};
