import { generateKeyPairSync, createSign } from 'crypto';
import http from 'http';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/walletBridge.js', () => ({ requestFromWallet: jest.fn() }));

const { requestFromWallet } = await import('../src/walletBridge.js');
const { requestBadge } = await import('../src/index.js');

describe('requestBadge integration', () => {
  let server;
  let privateKey;
  let publicKeyJwk;
  let issuer;

  function base64url(input) {
    return Buffer.from(input).toString('base64url');
  }

  function createJwt(payload) {
    const header = { alg: 'RS256', typ: 'JWT' };
    const encoded = base64url(JSON.stringify(header)) + '.' + base64url(JSON.stringify(payload));
    const sign = createSign('RSA-SHA256');
    sign.update(encoded);
    const signature = sign.sign(privateKey);
    return encoded + '.' + base64url(signature);
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
    issuer = `http://localhost:${server.address().port}`;
  });

  afterAll(() => server.close());

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('flows through consent and returns payload', async () => {
    const now = Math.floor(Date.now()/1000);
    const jwt = createJwt({ sub: 'xyz', iss: issuer, iat: now, exp: now + 3600 });
    requestFromWallet.mockResolvedValue(jwt);
    const badgePromise = requestBadge({ issuer });
    document.querySelector('#pb-accept').click();
    const payload = await badgePromise;
    expect(payload.sub).toBe('xyz');
    expect(document.querySelector('#pb-accept')).toBeNull();
  });

  test('rejects when user cancels', async () => {
    requestFromWallet.mockResolvedValue('token');
    const badgePromise = requestBadge({ issuer });
    document.querySelector('#pb-cancel').click();
    await expect(badgePromise).rejects.toThrow('User cancelled');
  });
});
