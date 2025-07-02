// src/verifier.js
import { createRemoteJWKSet, jwtVerify } from 'jose';

/**
 * Verify a JWT badge against an issuer's JWKS endpoint.
 * @param {string} token - The JWT credential.
 * @param {Object} options - Options including `issuer` (required).
 * @returns {Promise<Object>} payload of the verified JWT.
 */
export default async function verifyBadge(token, options = {}) {
  if (!token) throw new Error('No token provided');
  if (!options.issuer) throw new Error('issuer required');

  const issuerUrl = new URL(options.issuer);
  const jwksUri = new URL('/.well-known/jwks.json', issuerUrl);
  const JWKS = createRemoteJWKSet(jwksUri);

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: options.issuer
  });

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error('Credential expired');
  }

  return payload;
}