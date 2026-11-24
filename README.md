# WeightedShares SEC EDGAR MCP Server

[![MCP Protocol](https://img.shields.io/badge/MCP-2025--03--26%20Streamable%20HTTP-2563eb)](https://modelcontextprotocol.io)
[![Hosted Endpoint](https://img.shields.io/badge/Endpoint-weightedshares.com%2Fmcp-10b981)](https://weightedshares.com/mcp)
[![SEC EDGAR Coverage](https://img.shields.io/badge/SEC%20EDGAR-10%2C400%2B%20U.S.%20Stocks-6366f1)](https://weightedshares.com)
[![Open Data License](https://img.shields.io/badge/Data%20License-CC%20BY%204.0-0ea5e9)](https://weightedshares.com/methodology)
[![Code License: MIT](https://img.shields.io/badge/Code%20License-MIT-yellow.svg)](./LICENSE)

Official hosted **Model Context Protocol (MCP)** server manifest (`server.json`), client configurations, and zero-dependency verification toolkit for **[WeightedShares.com](https://weightedshares.com)** — a free, SEC EDGAR XBRL-backed **Buybacks vs. Stock-Based Compensation (SBC), RSU Tax Withholdings, True FCF (`FCF − SBC`), Form 4 Insider Selling, and 13F Superinvestor Dilution Radar** for U.S. public companies.

Connect Claude Code, Claude Desktop, Cursor, Windsurf, Cline, OpenAI Codex CLI, or any MCP-compatible AI agent directly to deterministic, filing-linked SEC XBRL data across **10,400+ U.S. public companies** with **zero local installation** and **no API key required** (`30 req/min/IP`).

---

## Live Terminal & Endpoints

- **Flagship Buybacks vs. SBC Radar**: [https://weightedshares.com](https://weightedshares.com)
- **Hosted MCP Endpoint (Streamable HTTP / JSON-RPC 2.0)**: `https://weightedshares.com/mcp` *(alias of `https://weightedshares.com/api/mcp`)*
- **2026 U.S. Buybacks vs. SBC Reality Report**: [https://weightedshares.com/reports/2026-buybacks-vs-sbc](https://weightedshares.com/reports/2026-buybacks-vs-sbc)
- **Superinvestor 13F Dilution Audits**: [https://weightedshares.com/superinvestors](https://weightedshares.com/superinvestors)
- **Quantitative SEC Screens**:
  - [Stock Buyback Companies & True Share Cannibals](https://weightedshares.com/screens/stock-buyback-companies)
  - [Corporate Stock Buyback Programs](https://weightedshares.com/screens/stock-buyback-programs)
  - [Share Dilution & SBC Leaders](https://weightedshares.com/screens/share-dilution)
  - [Negative SBC-Adjusted FCF ("True FCF Traps")](https://weightedshares.com/screens/negative-sbc-adjusted-fcf)
  - [Hidden RSU Tax Withholding Cash Drains](https://weightedshares.com/screens/rsu-tax-withholdings)
  - [12M Form 4 Insider Selling vs. Buybacks](https://weightedshares.com/screens/insider-selling-vs-buybacks)
- **Interactive Share Dilution Calculator**: [https://weightedshares.com/calculator](https://weightedshares.com/calculator)
- **Methodology & Hard SEC Guardrails**: [https://weightedshares.com/methodology](https://weightedshares.com/methodology)
- **Machine-Readable Site Guide (`llms.txt`)**: [https://weightedshares.com/llms.txt](https://weightedshares.com/llms.txt)

---

## Why Use WeightedShares MCP?

Generic LLMs and web scrapers frequently make silent accounting mistakes on U.S. equity filings — confusing cover-page shares outstanding with diluted weighted-average shares, summing RSU tax withholdings into cash buybacks, misreading split-adjusted historical denominators, or running banks and REITs through industrial FCF formulas.

WeightedShares extracts structured XBRL directly from official **SEC EDGAR** (`10-K`, `20-F`, `40-F`, `10-Q`, `Form 4`, and `13F-HR`) with deterministic accounting guardrails and clickable SEC accession links on every returned metric.

---

## Available Read-Only Tools (5)

All 5 tools are **read-only**, **idempotent**, require **no authentication**, and return structured JSON payloads with SEC filing provenance (`protocolVersion: 2025-03-26`).

- **`get_company_buybacks_sbc`** — Audit 3Y / 5Y / 10Y / Max buybacks, SBC expense, RSU tax withholdings, Standard FCF vs. True FCF (`FCF − SBC`), unrecognized SBC pipeline, cover-page shares vs. diluted weighted-average shares, latest 10-Q YoY trend, and clickable SEC filing links for any of 10,400+ U.S. tickers.
- **`compare_companies_dilution`** — Head-to-head SEC EDGAR comparison of any two U.S. public companies across 3Y / 5Y / 10Y / Max lookback windows.
- **`get_sec_screen`** — Query any of the 6 live flagship quantitative SEC screens (`stock-buyback-companies`, `stock-buyback-programs`, `share-dilution`, `negative-sbc-adjusted-fcf`, `rsu-tax-withholdings`, `insider-selling-vs-buybacks`).
- **`get_superinvestor_dilution`** — Audit a legendary superinvestor's latest SEC Form 13F-HR U.S. equity portfolio (Warren Buffett, Duan Yongping, Li Lu, Bill Ackman, Philippe Laffont, David Tepper, Stanley Druckenmiller, Cathie Wood, Chris Hohn, Seth Klarman, Terry Smith) for weighted diluted share drift, SBC % of revenue, and True FCF margins. Pass `slug="list"` to enumerate all 11 portfolios.
- **`search_sec_companies`** — Search across 10,400+ SEC EDGAR-registered U.S. public issuers by ticker or company name.

### Tool Parameters Reference

| Tool | Required Params | Optional Params |
| --- | --- | --- |
| `get_company_buybacks_sbc` | `ticker` (e.g. `"NVDA"`, `"PLTR"`, `"BRK-B"`) | `period`: `"3y"` \| `"5y"` \| `"10y"` \| `"max"` *(default `"5y"`)* |
| `compare_companies_dilution` | `tickerA`, `tickerB` (e.g. `"NVDA"`, `"AMD"`) | `period`: `"3y"` \| `"5y"` \| `"10y"` \| `"max"` *(default `"5y"`)* |
| `get_sec_screen` | `screen`: `"stock-buyback-companies"` \| `"stock-buyback-programs"` \| `"share-dilution"` \| `"negative-sbc-adjusted-fcf"` \| `"rsu-tax-withholdings"` \| `"insider-selling-vs-buybacks"` | `limit`: `1–50` *(default `20`)* |
| `get_superinvestor_dilution` | `slug` (e.g. `"warren-buffett"`, `"li-lu"`, `"duan-yongping"`, or `"list"`) | `period`: `"3y"` \| `"5y"` \| `"10y"` \| `"max"` *(default `"5y"`)* |
| `search_sec_companies` | `query` (e.g. `"palantir"`, `"autozone"`, `"NVDA"`) | `limit`: `1–20` *(default `10`)* |

### Example Prompts for Your AI Agent

- *"Audit PLTR's 5-year buybacks vs. SBC, RSU tax withholdings, and True FCF using SEC EDGAR filings, and include the exact 10-K filing links."*
- *"Compare NVDA vs. AMD over the last 5 years: who actually shrank diluted share count and how much did each spend on buybacks vs. SBC?"*
- *"List the top 10 flagship U.S. companies whose positive 5-year Standard FCF turns negative after subtracting stock-based compensation."*
- *"Audit Warren Buffett's and Li Lu's latest 13F portfolios for weighted 5-year share shrinkage vs. dilution."*
- *"Compare 12-month Form 4 insider selling vs. corporate buybacks across flagship U.S. companies."*

---

## Quick Start (Client Setup)

Zero local build, Docker container, or API key required — point your MCP client to `https://weightedshares.com/mcp`.

### Claude Code CLI

```bash
claude mcp add --transport http weightedshares https://weightedshares.com/mcp
```

### Cursor / Windsurf / Cline

Add to `~/.cursor/mcp.json` (template in [`configs/cursor_mcp.json`](./configs/cursor_mcp.json)):

```json
{
  "mcpServers": {
    "weightedshares": {
      "url": "https://weightedshares.com/mcp"
    }
  }
}
```

### Claude Desktop (via `mcp-remote`)

Add to `claude_desktop_config.json` (template in [`configs/claude_desktop_config.json`](./configs/claude_desktop_config.json)):

```json
{
  "mcpServers": {
    "weightedshares": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://weightedshares.com/mcp"]
    }
  }
}
```

### OpenAI Codex CLI

Add to `~/.codex/config.toml` (template in [`configs/codex_config.toml`](./configs/codex_config.toml)):

```toml
[mcp_servers.weightedshares]
url = "https://weightedshares.com/mcp"
```

---

## Verify Live Endpoint (Zero Dependencies)

Run the included Node.js 18+ smoke test against the live hosted server:

```bash
node scripts/mcp_smoke_test.mjs
```

Or test directly with `curl`:

```bash
# Discover server manifest
curl -s https://weightedshares.com/mcp | jq

# Call get_company_buybacks_sbc for NVDA (5Y)
curl -s -X POST https://weightedshares.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_company_buybacks_sbc","arguments":{"ticker":"NVDA","period":"5y"}}}' | jq
```

---

## Hard SEC Accounting Guardrails

Every MCP response enforces the same audited SEC accounting rules used on [weightedshares.com/methodology](https://weightedshares.com/methodology):

1. **Cover-page shares vs. diluted weighted-average shares** (`dei:EntityCommonStockSharesOutstanding` vs. `us-gaap:WeightedAverageNumberOfDilutedSharesOutstanding`) are always kept strictly separate.
2. **Never sum `buybacksUsd + rsuTaxWithholdingUsd`**: SEC XBRL does not distinguish issuers that report RSU net-share tax settlements on a separate financing line from issuers that fold them into common stock repurchases.
3. **Never fabricate an implied average buyback price** from mismatched cash-flow vs. trade-date share tags.
4. **Strict USD-only currency integrity**: non-USD `20-F` / IFRS units (`EUR`, `DKK`, `TWD`, `CNY`) are never coerced into `*_usd` fields.
5. **Economic share-class equivalence**: multi-class issuers like Berkshire Hathaway (`BRK-B` / `BRK-A`) respect economic equivalence (`1 Class A = 1,500 Class B`) rather than naive summing.
6. **Financials & REIT FCF guardrails**: balance-sheet banks, investment banks, insurers, brokerages, and REITs suppress industrial `FCF = OCF − CapEx` / `True FCF` distress figures and are excluded from `True FCF Traps` screens.
7. **Descriptive SEC facts only**: never investment advice, stock ratings, price targets, or buy/sell recommendations.

---

## Rate Limit, Attribution & License

- **Public Rate Limit**: `30 requests / minute / IP` (no API key or signup required).
- **Open Data Attribution (`CC BY 4.0`)**: SEC-derived outputs returned by WeightedShares MCP are free to use in research notes, Substack newsletters, blogs, dashboards, and AI agent responses — please attribute with a link back to [WeightedShares.com](https://weightedshares.com) (and the `sourceUrl` returned by the tool).
- **Repository Code License**: Configuration templates and smoke test scripts in this repository are released under the [MIT License](./LICENSE).
- **Contact**: `hello@weightedshares.com`
