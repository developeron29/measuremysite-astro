# astro-measuremysite

[measuremy.site](https://measuremy.site) for Astro: cookieless web analytics your AI agent can read.

```sh
npx astro add astro-measuremysite
```

Then pass your site's public key (the `pk_...` key from the dashboard's Setup tab; it's public and safe to commit):

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import measuremysite from "astro-measuremysite";

export default defineConfig({
  integrations: [measuremysite({ key: "pk_..." })],
});
```

Or leave `measuremysite()` empty and set `PUBLIC_MEASUREMYSITE_KEY` in your environment.

The tracker is added to every page of the built site. `astro dev` leaves it out so local visits don't count (`dev: true` turns it on). Client-side navigation with `<ClientRouter />` is counted as pageviews.

Options: `key`, `host` (a self-hosted tracker, default `https://a.measuremy.site`), `dev`.

## Custom events

```html
<button data-measuremysite-event="signup">Sign up</button>
```

or `window.measuremysite && measuremysite.track("signup")` after a successful action.

## Read your traffic from your coding agent

Connect the measuremy.site MCP server and ask Claude Code, Cursor or Codex about visits, sources and pages:

```sh
claude mcp add --transport http measuremysite https://a.measuremy.site/mcp
```

No key needed; it signs in with OAuth. More at [measuremy.site/docs/mcp](https://measuremy.site/docs/mcp).

MIT licensed.
