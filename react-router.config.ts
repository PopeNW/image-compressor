import type { Config } from "@react-router/dev/config";

import { basename } from "./github-pages.ts";

export default {
  basename,
  ssr: false,
} satisfies Config;
