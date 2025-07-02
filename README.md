# NeutralToken Widget

The **NeutralToken Widget** is an open, embeddable JavaScript SDK for verifying user eligibility — such as age or jurisdiction — using the [NeutralToken protocol](https://github.com/NeutralToken-Foundation/neutraltoken-spec).

This SDK is maintained by the **NeutralToken Foundation** and is protocol-compliant with profiles like `jwt-basic` and `jwt-blind`.

---

## 🚀 What It Does

- Displays a user-facing consent modal
- Requests a credential from the user's wallet or browser extension
- Validates badge expiration and signature (offline)
- Passes eligibility result back to your app

---

## 🧩 Usage Example

```html
<script src="https://cdn.jsdelivr.net/npm/@neutraltoken/core@latest/dist/neutraltoken.min.js"></script>
<script>
  NeutralToken.requestBadge({
    credential_profile: "jwt-basic",
    min_age: 21
  }).then(result => {
    if (result.verified) {
      console.log("Access granted");
    } else {
      console.warn("Verification failed");
    }
  });
</script>
```

---

## ✅ Add a Verify Button (OAuth-style)

Use the provided helper to render an OAuth-style button into any DOM element:

```js
import { renderButton } from 'neutraltoken';

renderButton('#verify-container', {
  credential_profile: "jwt-basic",
  min_age: 21,
  onSuccess: (payload) => console.log("✅ Verified", payload),
  onError: (err) => console.error("❌ Failed", err)
});
```

Make sure to include the CSS in your page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@neutraltoken/core@latest/dist/neutraltoken.css" />
```

The button will automatically include the NeutralToken logo and apply styles that match your user's system theme.

---

## 🎨 Theme Support

The widget and button support **automatic dark/light mode** using `prefers-color-scheme`.

You can also override the theme manually:

```html
<body data-theme="dark">
<!-- or -->
<body data-theme="light">
```

The button will adapt to the correct background, text color, and hover state based on your theme settings.

---

## 📦 Install via NPM

```bash
npm install @neutraltoken/core
```

---

## 📚 Documentation

See [the spec](https://github.com/neutraltoken/neutraltoken-spec) for protocol internals and profiles.

This widget supports:

- Credential profiles: `jwt-basic`, `jwt-blind`
- Presentation flows: iframe + postMessage, optional QR scan
- Configurable consent prompts
- Optional wallet detection and fallback UI

---

## 🛡 Privacy Notice

- No tracking, no identifiers, no verifier-to-issuer communication
- All verification is done **offline**, using issuer public keys
- This widget is compliant with privacy laws and does not store PII

---

## 🛠 Development

To build locally:

```bash
npm install
npm run dev
```

To bundle:

```bash
npm run build
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) in this repo or the [NeutralToken Foundation site](https://neutraltoken.org/community).

---

## 📝 License

MIT License — see [LICENSE](LICENSE)  
Maintained by the NeutralToken Foundation
