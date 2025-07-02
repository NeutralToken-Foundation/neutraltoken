import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/modal.js', () => ({ default: jest.fn() }));
jest.unstable_mockModule('../src/walletBridge.js', () => ({ requestFromWallet: jest.fn() }));
jest.unstable_mockModule('../src/verifier.js', () => ({ default: jest.fn() }));

const modal = (await import('../src/modal.js')).default;
const bridge = await import('../src/walletBridge.js');
const verifier = await import('../src/verifier.js');
const { requestBadge } = await import('../src/index.js');

describe('requestBadge', () => {
  it('resolves with badge payload', async () => {
    modal.mockImplementation(async (cfg, cb) => cb());
    bridge.requestFromWallet.mockResolvedValue('token');
    verifier.default.mockResolvedValue({ sub: '123' });

    const payload = await requestBadge({ issuer: 'https://issuer.example' });
    expect(payload.sub).toBe('123');
  });

  it('rejects on error', async () => {
    modal.mockRejectedValue(new Error('cancel'));
    await expect(requestBadge()).rejects.toThrow('cancel');
  });
});
