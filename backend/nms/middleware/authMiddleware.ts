import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { NextApiRequest, NextApiResponse } from 'next';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();

export async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
  const authHeader = req.headers.authorization; // Get the "Authorization" header

  // Skip authentication in test environment
  if (process.env.NODE_ENV === 'test' && authHeader === 'Bearer test-token') {
    return handler(req, res);
  }

  // Step 1: Check if the "Authorization" header exists and starts with "Bearer "
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    // Step 2: Extract the token by splitting "Bearer <token>"
    const token = authHeader.split('Bearer ')[1];

    // Step 3: Verify the token with Firebase
    await auth.verifyIdToken(token);

    // Step 4: If the token is valid, call the actual API handler
    return handler(req, res);
  } catch (error) {
    console.error('Authentication error:', error);

    // Detailed error handling based on Firebase error codes
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Unauthorized - Token expired' });
    }
    if (error.code === 'auth/argument-error') {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    // Generic error response for other cases
    return res.status(401).json({ message: 'Unauthorized - Failed to verify token' });
  }
}
