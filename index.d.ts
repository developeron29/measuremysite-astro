import type { AstroIntegration } from "astro";

export interface MeasuremysiteOptions {
  /** The site's public key (pk_...), from the dashboard's Setup tab. Defaults to PUBLIC_MEASUREMYSITE_KEY. Safe to commit. */
  key?: string;
  /** Tracker host, for self-hosted installs. Defaults to https://a.measuremy.site. */
  host?: string;
  /** Also track pages served by `astro dev`. Off by default, so local visits don't count. */
  dev?: boolean;
}

export default function measuremysite(options?: MeasuremysiteOptions): AstroIntegration;
