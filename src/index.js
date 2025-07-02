import createModal from './modal.js';
import verifyBadge from './verifier.js';
import { requestFromWallet } from './walletBridge.js';
import { Buffer } from 'buffer';
import process from 'process';

import pkg from '../package.json' assert { type: 'json' };
import { CDN_BASE } from './cdn.js';
console.log(`📦 NeutralToken v${pkg.version} loaded`);

// Provide Node.js globals in the browser when needed
if (typeof window !== 'undefined') {
  if (!window.Buffer) {
    window.Buffer = Buffer;
  }
  if (!window.process) {
    window.process = process;
  }
}

/**
 * Renders a pre-styled NeutralToken OAuth-style button into a target element.
 * @param {HTMLElement|string} target - DOM element or selector to insert into.
 * @param {Object} config - Config passed to requestBadge.
 */
export function renderButton(target, config = {}) {
  if (!document.getElementById('neutraltoken-css')) {
    const link = document.createElement('link');
    link.id = 'neutraltoken-css';
    link.rel = 'stylesheet';
    link.href = `${CDN_BASE}/neutraltoken.css`;
    document.head.appendChild(link);
  }

  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) {
    console.error('NeutralToken: renderButton target not found.');
    return;
  }

  const button = document.createElement('button');
  button.className = 'verify-button';
  button.innerHTML = `
    <img src="${CDN_BASE}/logo.png" alt="Verify with NeutralToken" />
    <span>Verify with NeutralToken</span>
  `;

  button.addEventListener('click', () => {
    requestBadge(config)
      .then((payload) => {
        console.log('✅ Badge verified', payload);
        if (typeof config.onSuccess === 'function') {
          config.onSuccess(payload);
        }
      })
      .catch((err) => {
        console.error('❌ Badge verification failed', err);
        if (typeof config.onError === 'function') {
          config.onError(err);
        }
      });
  });

  container.appendChild(button);
}

/**
 * Request a badge from the user.
 * @param {Object} config
 * @returns {Promise<Object>} resolved with decoded badge payload
 */
function requestBadge(config = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      if (config.token) {
        console.log('🪵 Using provided token from config:', config.token);
      } else {
        console.log('🪵 No token provided. Launching modal...');
      }

      const token = config.token
        ? config.token
        : await createModal(config, async () => {
            console.log('🪵 Inside modal callback — calling requestFromWallet');
            return await requestFromWallet(config);
          });

      console.log('🪵 Token acquired:', token);

      const payload = await verifyBadge(token, config);

      console.log('🪵 Payload verified:', payload);
      resolve(payload);
    } catch (err) {
      console.error('❌ requestBadge error:', err);
      reject(err);
    }
  });
}

export { requestBadge, verifyBadge };

// For browser global use (CDN)
if (typeof window !== 'undefined') {
  window.NeutralToken = {
    requestBadge,
    verifyBadge,
    renderButton
  };
}