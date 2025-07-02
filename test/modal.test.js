import createModal from '../src/modal.js';

describe('modal', () => {
  test('renders and resolves token', async () => {
    document.body.innerHTML = '';
    const tokenPromise = createModal({}, async () => 'abc');
    document.querySelector('#pb-accept').click();
    await expect(tokenPromise).resolves.toBe('abc');
    expect(document.querySelector('#pb-accept')).toBeNull();
  });

  test('rejects on cancel', async () => {
    document.body.innerHTML = '';
    const tokenPromise = createModal({}, async () => 'abc');
    document.querySelector('#pb-cancel').click();
    await expect(tokenPromise).rejects.toThrow('User cancelled');
  });

  test('displays provided reason text', () => {
    document.body.innerHTML = '';
    createModal({ reason: 'Need consent' }, async () => 'abc');
    const text = document.querySelector('p').textContent;
    expect(text).toMatch('Need consent');
  });
});
