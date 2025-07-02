import pkg from '../package.json' assert { type: 'json' };

// Determine version from script src or fallback to package version
let version = pkg.version;
let local = false;
if (typeof document !== 'undefined') {
  const currentScript = document.currentScript?.src || '';
  if (
    currentScript.startsWith('http://localhost') ||
    currentScript.startsWith('https://localhost') ||
    currentScript.startsWith('/') ||
    window.location.hostname === 'localhost' ||
    window.location.protocol === 'file:'
  ) {
    local = true;
  }
  const match = currentScript.match(/@neutraltoken\/core@(.*?)(\/|$)/);
  if (match && match[1]) {
    version = match[1];
  } else if (currentScript.includes('@latest')) {
    version = 'latest';
  }
}

export const CDN_BASE = local
  ? './dist'
  : `https://cdn.jsdelivr.net/npm/@neutraltoken/core@${version}/dist`;
