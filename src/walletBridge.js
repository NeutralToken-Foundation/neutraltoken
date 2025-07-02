/**
 * Simulated wallet communication. In production this would use
 * postMessage or deep link. For now we simply prompt for a JWT.
 */
export function requestFromWallet() {
  return new Promise((resolve, reject) => {
    const token = window.prompt('Enter JWT badge');
    if (token) return resolve(token.trim());
    reject(new Error('No token provided'));
  });
}
