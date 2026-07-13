# GitHub Pages Deployment

This MVP is configured as a static Next.js export, so it can run on GitHub Pages while the app has no server-side database or API dependency.

## Deploy

1. Push the project to GitHub.
2. In the repository settings, open **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main`, or run the **Deploy to GitHub Pages** workflow manually.

For a project page, the app will be published at:

```text
https://<username>.github.io/<repository-name>/
```

For a user or organization page repository such as `<username>.github.io`, the app is published at the domain root and no repository base path is used.

## Current Scope

GitHub Pages is a good fit for the current static invitation MVP. When guest management, RSVP persistence, or admin APIs need real server behavior, deploy the full app to a server-capable platform such as Vercel, Netlify with functions, or another Node hosting provider.
