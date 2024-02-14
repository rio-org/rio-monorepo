import { NextApiRequest, NextApiResponse } from 'next';
import { withHandlers } from '../lib/api';
import { asType } from '../lib/utilities';

// POST Handler
const POST = async (
  req: NextApiRequest,
  res: NextApiResponse<{ revalidated: boolean; message: string }>
) => {
  const { pathnames } = asType<{ pathnames?: string[] }>(req.body ?? {});
  const { secret } = asType<{ secret?: string }>(req.query ?? {});

  // Check for secret to confirm this is a valid request
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return res
      .status(401)
      .json({ revalidated: false, message: 'Invalid token' });
  }

  try {
    // this should be an array of actual paths not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    if (pathnames?.length) {
      await Promise.all(pathnames.map((p) => res.revalidate(p)));
    }

    return res.json({ revalidated: true, message: 'revalidated' });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res
      .status(500)
      .json({ revalidated: false, message: 'Error revalidating' });
  }
};

export default withHandlers({ POST });
