import { generateKeyPairSync, createSign } from 'crypto';
import http from 'http';
import verifier from '../src/verifier.js';

let server;
let privateKey;
let publicKeyJwk;
let issuer;

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

beforeAll(() => {
  const { publicKey, privateKey: pk } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  privateKey = pk;
  publicKeyJwk = publicKey.export({ format: 'jwk' });
  server = http.createServer((req, res) => {
    if (req.url === '/.well-known/jwks.json') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ keys: [publicKeyJwk] }));
    }
  }).listen(0);
  const { port } = server.address();
  issuer = `http://localhost:${port}`;
});

afterAll(() => {
  server.close();
});

function createJwt(payload) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const encoded = base64url(JSON.stringify(header)) + '.' + base64url(JSON.stringify(payload));
  const sign = createSign('RSA-SHA256');
  sign.update(encoded);
  const signature = sign.sign(privateKey);
  return encoded + '.' + base64url(signature);
}

test('verifies valid token', async () => {
  const now = Math.floor(Date.now()/1000);
  const jwt = createJwt({ sub: 'abc', iss: issuer, iat: now, exp: now + 3600 });
  const payload = await verifier(jwt, { issuer });
  expect(payload.sub).toBe('abc');
});

test('rejects expired token', async () => {
  const now = Math.floor(Date.now()/1000) - 10;
  const jwt = createJwt({ iss: issuer, exp: now });
  await expect(verifier(jwt, { issuer })).rejects.toThrow('Credential expired');
});

test('rejects token with bad signature', async () => {
  const { privateKey: badKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = { iss: issuer, exp: Math.floor(Date.now()/1000) + 100 };
  const encoded = base64url(JSON.stringify(header)) + '.' + base64url(JSON.stringify(payload));
  const sign = createSign('RSA-SHA256');
  sign.update(encoded);
  const signature = sign.sign(badKey);
  const jwt = encoded + '.' + base64url(signature);
  await expect(verifier(jwt, { issuer })).rejects.toThrow();
});

test('rejects malformed token', async () => {
  await expect(verifier('not.a.jwt', { issuer })).rejects.toThrow();
});

test('rejects when token missing', async () => {
  await expect(verifier('', { issuer })).rejects.toThrow('No token provided');
});

test('rejects when jwks endpoint unreachable', async () => {
  const now = Math.floor(Date.now()/1000);
  const jwt = createJwt({ iss: issuer, iat: now, exp: now + 100 });
  await expect(verifier(jwt, { issuer: 'http://localhost:9' })).rejects.toThrow();
});
