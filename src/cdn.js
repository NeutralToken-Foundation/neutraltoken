import pkg from '../package.json' assert { type: 'json' };

// Determine version from script src or fallback to package version
let version = pkg.version;
if (typeof document !== 'undefined') {
  const currentScript = document.currentScript?.src || '';
  const match = currentScript.match(/neutraltoken@(.*?)(\/|$)/);
  if (match && match[1]) {
    version = match[1];
  } else if (currentScript.includes('@latest')) {
    version = 'latest';
  }
}

export const CDN_BASE = `https://cdn.jsdelivr.net/npm/@neutraltoken/core@${version}/dist`;
