// Runs at Netlify build time (see netlify.toml [build] command).
// Writes config.js from the SUPABASE_URL environment variable so the public
// project URL never needs to be hardcoded/committed in index.html. The
// service_role key is intentionally never touched by this script — it must
// only ever be read server-side via Netlify.env.get() in functions.
const fs = require("fs");

const url = process.env.SUPABASE_URL || "";

fs.writeFileSync("config.js", `window.SUPABASE_URL = ${JSON.stringify(url)};\n`);
