// Adds the measuremy.site script tag to every page. The tracker reads its key from its own <script> element, so the
// injected snippet creates that element; pageviews on client-side navigation (Astro's <ClientRouter />) are counted
// by the tracker itself, which listens to history.pushState.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DEFAULT_HOST = "https://a.measuremy.site";
const ENV_NAMES = ["PUBLIC_MEASUREMYSITE_KEY", "MEASUREMYSITE_KEY"];

// Astro doesn't load .env files into process.env before the config runs, so look in them the way Vite would
// (.env.[mode].local beats .env.[mode] beats .env.local beats .env; the real environment beats all of them).
function keyFromEnv(root, mode) {
  for (const name of ENV_NAMES) if (process.env[name]) return process.env[name];
  for (const file of [`.env.${mode}.local`, `.env.${mode}`, ".env.local", ".env"]) {
    const path = fileURLToPath(new URL(file, root));
    if (!existsSync(path)) continue;
    for (const name of ENV_NAMES) {
      const m = new RegExp(`^\\s*(?:export\\s+)?${name}\\s*=\\s*["']?([^"'\\s#]+)`, "m").exec(readFileSync(path, "utf8"));
      if (m) return m[1];
    }
  }
}

/** @param {import("./index").MeasuremysiteOptions} [options] */
export default function measuremysite(options = {}) {
  const host = (options.host ?? DEFAULT_HOST).replace(/\/+$/, "");
  return {
    name: "astro-measuremysite",
    hooks: {
      "astro:config:setup": ({ command, config, injectScript, logger }) => {
        const key = options.key ?? keyFromEnv(config.root, command === "dev" ? "development" : "production");
        if (!key) {
          logger.warn("No site key: pass measuremysite({ key: \"pk_...\" }) or set PUBLIC_MEASUREMYSITE_KEY. Get one at https://measuremy.site/login.");
          return;
        }
        if (!/^pk_[A-Za-z0-9_-]+$/.test(key)) throw new Error(`astro-measuremysite: "${key}" isn't a site key; it starts with pk_ (the public key from the dashboard's Setup tab).`);
        // Dev-server visits would count as real traffic, so `astro dev` leaves the tracker out unless asked.
        if (command === "dev" && !options.dev) return;
        injectScript(
          "head-inline",
          `(function(){var s=document.createElement("script");s.defer=true;s.src=${JSON.stringify(host + "/t.js")};s.setAttribute("data-key",${JSON.stringify(key)});document.head.appendChild(s);})();`,
        );
      },
    },
  };
}
