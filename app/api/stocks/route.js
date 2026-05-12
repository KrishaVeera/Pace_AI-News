const SYMBOLS = ["AAPL", "GOOGL", "MSFT", "NVDA", "META", "AMZN", "^GSPC", "^DJI"];
const DISPLAY_NAMES = { "^GSPC": "S&P 500", "^DJI": "DOW" };

async function fetchStock(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const meta = json.chart.result[0].meta;
  const price = meta.regularMarketPrice;
  const prev = meta.previousClose ?? meta.chartPreviousClose ?? price;
  const changePercent = prev ? ((price - prev) / prev) * 100 : 0;
  return {
    symbol,
    displayName: DISPLAY_NAMES[symbol] ?? symbol,
    price,
    change: price - prev,
    changePercent,
    positive: changePercent >= 0,
  };
}

export async function GET() {
  const results = await Promise.allSettled(SYMBOLS.map(fetchStock));
  const stocks = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  if (stocks.length === 0) {
    return Response.json({ error: "Failed to fetch stocks" }, { status: 502 });
  }

  return Response.json(stocks);
}
