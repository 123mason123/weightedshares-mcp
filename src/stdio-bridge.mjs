#!/usr/bin/env node
/**
 * Zero-dependency MCP stdio-to-Streamable-HTTP bridge for WeightedShares.com.
 * Forwards JSON-RPC 2.0 MCP requests over stdin/stdout to https://weightedshares.com/mcp.
 * Strict stdout hygiene: only valid JSON-RPC 2.0 lines are ever written to stdout.
 */
import readline from "node:readline";

const MCP_ENDPOINT =
  process.env.WEIGHTEDSHARES_MCP_URL?.trim() || "https://weightedshares.com/mcp";

function writeJsonLine(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}

async function forwardRpc(req) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "weightedshares-mcp-stdio-bridge/1.0.0",
      },
      body: JSON.stringify(req),
      signal: controller.signal,
    });

    if (res.status === 202 || res.status === 204) {
      return null;
    }

    const text = await res.text();
    if (!text.trim()) return null;

    const parsed = JSON.parse(text);
    return parsed;
  } finally {
    clearTimeout(timer);
  }
}

async function handleMessage(rawLine) {
  const trimmed = rawLine.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    writeJsonLine({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error: invalid JSON" },
    });
    return;
  }

  const isNotification =
    msg.id === undefined ||
    (typeof msg.method === "string" && msg.method.startsWith("notifications/"));

  if (isNotification) {
    // Notifications expect no JSON-RPC response on stdout.
    return;
  }

  try {
    const response = await forwardRpc(msg);
    if (response) {
      writeJsonLine(response);
    }
  } catch (err) {
    process.stderr.write(
      `[weightedshares-mcp] bridge error for ${msg.method ?? "unknown"}: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    writeJsonLine({
      jsonrpc: "2.0",
      id: msg.id ?? null,
      error: {
        code: -32603,
        message: `Upstream MCP error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

// Serialize message handling to preserve strict JSON-RPC ordering on stdout.
let queue = Promise.resolve();
rl.on("line", (line) => {
  queue = queue.then(() => handleMessage(line));
});
