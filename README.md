# The issue reproduction of Resend 6.9.0+ built via Nitro on Cloudflare Workers

https://github.com/resend/resend-node/issues/826

---

# Steps to reproduce

## How this project was installed

### Install clean Nitro app

Follow the Nitro docs: https://v3.nitro.build/docs/quick-start

>**NOTE:**
>
>The app reported in the issue is Nuxt-based, and because Nuxt uses Nitro as its server engine, this issue affects both Nitro v2 (original app) and the v3 alpha (current reproduction).

```bash
pnpx create-nitro-app
```

Choose **Full-stack with Vite**.

### Add Cloudflare Workers preset to Nitro config

Code example for `vite.config.ts`:
```ts
export default defineConfig({
  plugins: [
    nitro({
      preset: "cloudflare_module",
      cloudflare: {
        deployConfig: true,
        nodeCompat: true
      }
    }),
  ],
})
```

Example v2 (original app): https://github.com/besidka/besidka/blob/main/nuxt.config.ts#L11
Example v3 (current reproduction):
- File: https://github.com/serhii-chernenko/nitro-cloudflare-resend-issue/blob/main/vite.config.ts#L8
- Commit: https://github.com/serhii-chernenko/nitro-cloudflare-resend-issue/commit/37610e3334a9582ad1e898b9ba4149707c4d301d

### Run the Cloudflare Workers build locally to make it sure there are no issues

```bash
pnpm run build # Built Nitro app
pnpx wrangler dev # Deploy local preview via Cloudflare Workers
```

## Resend issue

### Install latest Resend package 6.9.1

```bash
pnpm add resend
```

### Add actual resend usage to any server endpoint to include the package to bundle

Edit the existing `server/api/hello.ts` endpoint:
```ts
import { defineHandler } from "nitro/h3";
import { Resend } from 'resend'

export default defineHandler((event) => {
  const resend = new Resend('api_key')

  return { api: "works!"}
});
```

Commit: https://github.com/serhii-chernenko/nitro-cloudflare-resend-issue/commit/5177e49539b88a443c6bd67bfad7115056ef0a24

### Run the Cloudflare Workers build again to see error

```bash
pnpm run build # Built Nitro app
pnpx wrangler dev # Deploy local preview via Cloudflare Workers
```

<img width="3036" height="632" alt="image" src="https://github.com/user-attachments/assets/88d76842-c267-48e6-97bc-def77c7d1928" />

**Logs:**

```
✘ [ERROR] service core:user:undefined: Uncaught TypeError: The argument 'path' The argument must be a file URL object, a file URL string, or an absolute path string.. Received 'undefined'
    at null.<anonymous> (node:module:34:15) in createRequire
    at null.<anonymous> (_runtime.mjs:34:33)
✘ [ERROR] The Workers runtime failed to start. There is likely additional logging output above.
```

### Downgrade Resend to `6.8.0` to solve the issue

```bash
pnpm add resend@6.8.0
```

Commit: https://github.com/serhii-chernenko/nitro-cloudflare-resend-issue/commit/b20ba9a04e0b3098b71e538362d8d69200297778

### Run the Cloudflare Workers build again to see succesful build

```bash
pnpm run build # Built Nitro app
pnpx wrangler dev # Deploy local preview via Cloudflare Workers
```

<img width="1516" height="1606" alt="image" src="https://github.com/user-attachments/assets/0239878a-829c-4997-8e6c-8b822cadc048" />

