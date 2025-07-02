import { webcrypto } from 'crypto';
import { TextEncoder, TextDecoder } from 'util';
import fetch from 'node-fetch';
if (!globalThis.crypto) globalThis.crypto = webcrypto;
if (!globalThis.CryptoKey) globalThis.CryptoKey = webcrypto.CryptoKey;
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;
if (!globalThis.fetch) globalThis.fetch = fetch;
