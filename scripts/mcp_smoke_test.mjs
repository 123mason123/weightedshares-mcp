#!/usr/bin/env node
/**
 * Zero-dependency smoke test for the WeightedShares Remote MCP Server.
 *
 * Usage:
 *   node scripts/mcp_smoke_test.mjs
 *   node scripts/mcp_smoke_test.mjs https://weightedshares.com/mcp
 */
import assert from "node:assert/strict";

const ENDPOINT = (process.argv[2] || "https://weightedshares.com/mcp").replace(/\/$/, "");

async function rpc(method, params, id = 1) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  assert.equal(res.status, 200, `${method} expected HTTP 200, got ${res.status}`);
  const data = await res.json();
  assert.equal(data.jsonrpc, "2.0", `${method} missing jsonrpc=2.0`);
  assert.ok(!data.error, `${method} returned JSON-RPC error: ${JSON.stringify(data.error)}`);
  return data.result;
}

function parseToolJson(result, label) {
  assert.ok(Array.isArray(result?.content) && result.content.length > 0, `${label} missing content`);
  assert.ok(!result.isError, `${label} returned isError=true: ${result.content[0]?.text}`);
  return JSON.parse(result.content[0].text);
}

console.log(`[weightedshares-mcp] Testing ${ENDPOINT}...`);

// 1. GET discovery manifest
const metaRes = await fetch(ENDPOINT, { headers: { Accept: "application/json" } });
assert.equal(metaRes.status, 200, `GET ${ENDPOINT} expected HTTP 200, got ${metaRes.status}`);
const meta = await metaRes.json();
assert.equal(meta.server?.name, "weightedshares-sec-mcp");
console.log(`  PASS  GET manifest (${meta.tools?.length} tools, protocol ${meta.protocolVersion})`);

// 2. initialize
const init = await rpc("initialize", {}, 1);
assert.equal(init.serverInfo?.name, "weightedshares-sec-mcp");
console.log(`  PASS  initialize (${init.serverInfo.name}@${init.serverInfo.version})`);

// 3. tools/list
const list = await rpc("tools/list", {}, 2);
assert.equal(list.tools?.length, 5, "Expected 5 MCP tools");
console.log(`  PASS  tools/list (${list.tools.map((t) => t.name).join(", ")})`);

// 4. get_company_buybacks_sbc
const nvda = parseToolJson(
  await rpc("tools/call", { name: "get_company_buybacks_sbc", arguments: { ticker: "NVDA", period: "5y" } }, 3),
  "get_company_buybacks_sbc(NVDA)",
);
assert.equal(nvda.ticker, "NVDA");
assert.ok(nvda.metrics?.latestDilutedWeightedAverageShares > 0);
assert.ok(nvda.sourceUrl.includes("weightedshares.com/companies/nvda"));
console.log(
  `  PASS  get_company_buybacks_sbc(NVDA) -> 5Y diluted share change: ${nvda.metrics.dilutedShareChangePct}%`,
);

// 5. compare_companies_dilution
const cmp = parseToolJson(
  await rpc(
    "tools/call",
    { name: "compare_companies_dilution", arguments: { tickerA: "NVDA", tickerB: "AMD", period: "5y" } },
    4,
  ),
  "compare_companies_dilution(NVDA, AMD)",
);
assert.ok(cmp.comparison?.length === 2);
console.log(`  PASS  compare_companies_dilution(NVDA vs AMD) -> ${cmp.sourceUrl}`);

// 6. get_sec_screen
const screen = parseToolJson(
  await rpc(
    "tools/call",
    { name: "get_sec_screen", arguments: { screen: "negative-sbc-adjusted-fcf", limit: 5 } },
    5,
  ),
  "get_sec_screen(negative-sbc-adjusted-fcf)",
);
assert.ok(Array.isArray(screen.rows) && screen.rows.length > 0);
console.log(`  PASS  get_sec_screen(negative-sbc-adjusted-fcf) -> ${screen.rows.length} rows`);

// 7. get_superinvestor_dilution
const buffett = parseToolJson(
  await rpc(
    "tools/call",
    { name: "get_superinvestor_dilution", arguments: { slug: "warren-buffett", period: "5y" } },
    6,
  ),
  "get_superinvestor_dilution(warren-buffett)",
);
assert.equal(buffett.slug, "warren-buffett");
console.log(
  `  PASS  get_superinvestor_dilution(warren-buffett) -> weighted 5Y share change: ${buffett.audit?.weightedShareChangePct}%`,
);

// 8. search_sec_companies
const search = parseToolJson(
  await rpc("tools/call", { name: "search_sec_companies", arguments: { query: "autozone", limit: 5 } }, 7),
  "search_sec_companies(autozone)",
);
assert.ok(search.results?.some((r) => r.ticker === "AZO"));
console.log(`  PASS  search_sec_companies(autozone) -> matched AZO`);

console.log("[weightedshares-mcp] All live MCP smoke tests passed.");
