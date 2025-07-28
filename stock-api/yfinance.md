---
# yfinance ● API Cheatsheet
---

## 1. Public API – Main Classes & Functions

| Name                                                                      | Purpose                                            |
| ------------------------------------------------------------------------- | -------------------------------------------------- |
| `Ticker(symbol)`                                                          | Object for single asset data access.               |
| `Tickers("SYM1 SYM2")`                                                    | Access multiple `Ticker` objects.                  |
| `download(tickers, ...)`                                                  | Bulk historical data retrieval.                    |
| `Search(query, ...)`                                                      | Query Yahoo Finance search results (quotes, news). |
| `Lookup(query, ...)`                                                      | Programmatic lookup of tickers/funds/indices.      |
| `Market`, `Sector`, `Industry`                                            | Broader market, sector/industry info.              |
| `EquityQuery`, `FundQuery`, `screen()`                                    | Build and run screening filters.                   |
| `WebSocket`, `AsyncWebSocket`                                             | Live data streaming (sync / async).                |
| `enable_debug_mode()`                                                     | Enable verbose logging.                            |
| `set_tz_cache_location(path)`                                             | Customize cache directory.                         |
| ([Rana Roussi][1], [Ran Aroussi (Official Website)][2], [Rana Roussi][3]) |                                                    |

---

## 2. `Ticker` Interface

### Core Methods / Properties

| Method/Prop                                                               | Description                     |
| ------------------------------------------------------------------------- | ------------------------------- |
| `history(...)`                                                            | OHLC price history.             |
| `actions`                                                                 | Combined dividends and splits.  |
| `dividends`, `splits`                                                     | Event time series.              |
| `financials`, `balance_sheet`, `cashflow`                                 | Annual or quarterly statements. |
| `quarterly_financials`, etc.                                              | Quarterly data.                 |
| `get_isin()`                                                              | ISIN code.                      |
| `calendar` or `.get_calendar()`                                           | Earnings & events transition.   |
| `options`, `option_chain(date)`                                           | Options data.                   |
| `news` / `get_news(count, tab=…)`                                         | Recent news/press releases.     |
| `fast_info`                                                               | Lightweight metadata snapshot.  |
| `get_shares()`, `get_shares_full()`                                       | Share count history.            |
| `get_sec_filings()`                                                       | SEC filings info.               |
| ([Rana Roussi][4], [Ran Aroussi (Official Website)][2], [Rana Roussi][5]) |                                 |

### Forecast & Analyst Methods

| Method                                                 | Description                           |
| ------------------------------------------------------ | ------------------------------------- |
| `get_analyst_price_targets()`, `analyst_price_targets` | Target price estimates.               |
| `get_earnings_estimate()`, `earnings_estimate`         | EPS forecast.                         |
| `get_revenue_estimate()`, `revenue_estimate`           | Revenue forecast.                     |
| `get_growth_estimates()`, `growth_estimates`           | Growth projections versus benchmarks. |
| `get_eps_trend()`, `eps_trend`                         | EPS trend statistics.                 |
| `get_eps_revisions()`, `eps_revisions`                 | Estimate revisions over time.         |
| `get_earnings_history()`, `earnings_history`           | Past earnings data.                   |
| ([LinkedIn][6], [Rana Roussi][5], [PyPI][7])           |                                       |

### Ownership & Holdings

| Method                                                   | Description                |
| -------------------------------------------------------- | -------------------------- |
| `get_major_holders()`, `major_holders`                   | Principal shareholders.    |
| `get_institutional_holders()`, `institutional_holders`   | Institutional positions.   |
| `get_mutualfund_holders()`, `mutualfund_holders`         | Fund holdings.             |
| `get_insider_transactions()`, `insider_transactions`     | Insider trades.            |
| `get_insider_purchases()`, `insider_purchases`           | Insider buys.              |
| `get_insider_roster_holders()`, `insider_roster_holders` | Insider holdings overview. |
| ([Rana Roussi][5])                                       |                            |

---

## 3. Bulk Download via `download()`

| Parameter                                                         | Description                                                             |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `tickers`                                                         | Symbol(s) as list or str.                                               |
| `period`                                                          | e.g. `"1mo"`, `"5y"`, `"max"`.                                          |
| `start`, `end`                                                    | Explicit date range (`YYYY‑MM‑DD`).                                     |
| `interval`                                                        | e.g. `"1m"`, `"5m"`, `"1d"`, `"1wk"`, `"1mo"`. Intraday ≤ 60 days only. |
| `group_by`                                                        | `"ticker"` or `"column"`.                                               |
| `auto_adjust`                                                     | Split/dividend adjustment.                                              |
| `prepost`                                                         | Include extended-hours.                                                 |
| `actions`                                                         | Include dividends/splits.                                               |
| `threads`                                                         | Parallel downloads (`True` or int).                                     |
| `multi_level_index`                                               | Keep MultiIndex columns (default behavior may vary).                    |
| `repair`, `keepna`, `ignore_tz`, `rounding`, `timeout`, `session` | Additional flags.                                                       |

Notes:

- Defaults and behaviors: intraday data limited to \~60 days; 1‑minute to \~7 days only.([Rana Roussi][8], [Ran Aroussi (Official Website)][2], [Algo Trading 101][9])

---

## 4. Advanced Configuration & Logging

| Feature                                                                       | Notes                                                                           |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `enable_debug_mode()`                                                         | Enables debug-level logging.([Rana Roussi][10])                                 |
| `set_tz_cache_location(cache_dir)`                                            | Redirect default timezone cache directory.([Rana Roussi][3], [Rana Roussi][11]) |
| Persistent caches stored by OS defaults but customizable.                     |                                                                                 |
| Supports multi‑level DataFrame column indexing.                               |                                                                                 |
| Automatic "price repair" for anomalies.([Rana Roussi][12], [Rana Roussi][13]) |                                                                                 |

---

## 🚨 Limitations & Considerations

- **Unofficial library**: Not endorsed by Yahoo; authorized only for personal/research use.([Rana Roussi][14])
- **Scraping-based methods** (`financials`, some profiles) susceptible to breakage.
- **Rate limiting**: Frequent calls may result in IP blocking.
- **Intraday data window limitations**: Intervals < 1 day restricted.

---

[1]: https://ranaroussi.github.io/yfinance/reference/index.html?utm_source=chatgpt.com "API Reference — yfinance - GitHub Pages"
[2]: https://aroussi.com/post/python-yahoo-finance?ref=defiplot.com&utm_source=chatgpt.com "Reliably download historical market data from with Python"
[3]: https://ranaroussi.github.io/yfinance/advanced/caching.html?utm_source=chatgpt.com "Caching — yfinance - GitHub Pages"
[4]: https://ranaroussi.github.io/yfinance/reference/api/yfinance.Ticker.html?utm_source=chatgpt.com "Ticker — yfinance - GitHub Pages"
[5]: https://ranaroussi.github.io/yfinance/reference/yfinance.analysis.html?utm_source=chatgpt.com "Analysis & Holdings — yfinance - GitHub Pages"
[6]: https://www.linkedin.com/posts/jae-won-choi_github-ranaroussiyfinance-download-market-activity-7052020522456399872-tJmQ?utm_source=chatgpt.com "Download market data from Yahoo! Finance's… | Jae Won Choi"
[7]: https://pypi.org/user/ranaroussi/?utm_source=chatgpt.com "Profile of ranaroussi - PyPI"
[8]: https://ranaroussi.github.io/yfinance/reference/yfinance.functions.html?utm_source=chatgpt.com "Functions and Utilities — yfinance - GitHub Pages"
[9]: https://algotrading101.com/learn/yfinance-guide/?utm_source=chatgpt.com "yfinance Library - A Complete Guide - AlgoTrading101 Blog"
[10]: https://ranaroussi.github.io/yfinance/advanced/logging.html?utm_source=chatgpt.com "Logging — yfinance"
[11]: https://ranaroussi.github.io/yfinance/advanced/config.html?utm_source=chatgpt.com "Config — yfinance - GitHub Pages"
[12]: https://ranaroussi.github.io/yfinance/advanced/multi_level_columns.html?utm_source=chatgpt.com "Multi-Level Column Index — yfinance"
[13]: https://ranaroussi.github.io/yfinance/advanced/index.html?utm_source=chatgpt.com "Advanced — yfinance"
[14]: https://ranaroussi.github.io/yfinance/?utm_source=chatgpt.com "yfinance documentation - GitHub Pages"
