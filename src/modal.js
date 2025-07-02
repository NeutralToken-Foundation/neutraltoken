import { CDN_BASE } from './cdn.js';

export default function createModal(config, onRequest) {
  return new Promise((resolve, reject) => {
    // Inject external stylesheet if not already present
    if (!document.getElementById('neutraltoken-css')) {
      const link = document.createElement('link');
      link.id = 'neutraltoken-css';
      link.rel = 'stylesheet';
      link.href = `${CDN_BASE}/neutraltoken.css`;
      document.head.appendChild(link);
    }

    // Create modal container
    const overlay = document.createElement('div');
    overlay.className = 'pb-overlay';
    overlay.innerHTML = `
      <div class="pb-modal">
        <img src="${CDN_BASE}/logo.png" alt="NeutralToken logo" />
        <h2>Verify with NeutralToken</h2>
        <p>This site is requesting to verify your eligibility.</p>

        <button id="pb-accept" class="pb-button-primary">Continue</button>
        <button id="pb-cancel" class="pb-button-secondary">Cancel</button>

        <small>Issued by: <strong>sandbox.neutraltoken.org</strong></small>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#pb-accept')?.addEventListener('click', async () => {
      try {
        const token = await onRequest();
        cleanup();
        resolve(token);
      } catch (err) {
        cleanup();
        reject(err);
      }
    });

    overlay.querySelector('#pb-cancel')?.addEventListener('click', () => {
      cleanup();
      reject(new Error('User cancelled'));
    });

    function cleanup() {
      overlay.remove();
    }
  });
}