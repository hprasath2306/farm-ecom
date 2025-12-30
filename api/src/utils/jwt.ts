import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: string;
  email?: string;
}

// Get JWT secret with lazy evaluation
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return secret;
};

// Generate token
const generateToken = (userId: string): string => {
  const payload: JWTPayload = { id: userId };
  
  const token = jwt.sign(
    payload,
    getJWTSecret(),
    { 
      expiresIn: '7d',
      algorithm: 'HS256'
    }
  );
  
  return token;
};

// Verify Token
const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, getJWTSecret()) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

export { generateToken, verifyToken };