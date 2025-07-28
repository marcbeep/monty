from typing import List, Tuple

POPULAR_STOCKS = [
    ("AAPL", "Apple Inc.", "Equities"),
    ("MSFT", "Microsoft Corporation", "Equities"),
    ("GOOGL", "Alphabet Inc.", "Equities"),
    ("AMZN", "Amazon.com Inc.", "Equities"),
    ("TSLA", "Tesla Inc.", "Equities"),
    ("NVDA", "NVIDIA Corporation", "Equities"),
    ("META", "Meta Platforms Inc.", "Equities"),
    ("NFLX", "Netflix Inc.", "Equities"),
    ("VTI", "Vanguard Total Stock Market ETF", "Equities"),
    ("VOO", "Vanguard S&P 500 ETF", "Equities"),
    ("SPY", "SPDR S&P 500 ETF Trust", "Equities"),
    ("QQQ", "Invesco QQQ Trust", "Equities"),
    ("BND", "Vanguard Total Bond Market ETF", "Fixed Income"),
    ("BNDX", "Vanguard Total International Bond ETF", "Fixed Income"),
    ("VNQ", "Vanguard Real Estate Index Fund ETF", "Alternatives"),
    ("IAU", "iShares Gold Trust", "Alternatives"),
    ("TIP", "iShares TIPS Bond ETF", "Fixed Income"),
    ("SCHD", "Schwab US Dividend Equity ETF", "Equities"),
    ("VXUS", "Vanguard Total International Stock ETF", "Equities"),
    ("ARKK", "ARK Innovation ETF", "Equities"),
    ("IWM", "iShares Russell 2000 ETF", "Equities"),
    ("EFA", "iShares MSCI EAFE ETF", "Equities"),
    ("GLD", "SPDR Gold Shares", "Alternatives"),
    ("TLT", "iShares 20+ Year Treasury Bond ETF", "Fixed Income"),
    ("VMOT", "Vanguard Short-Term Inflation-Protected Securities ETF", "Fixed Income"),
]


def search_symbols(query: str, limit: int = 10) -> List[Tuple[str, str, str]]:
    query_lower = query.lower()
    results = []

    for symbol, name, asset_type in POPULAR_STOCKS:
        if (
            query_lower in symbol.lower()
            or query_lower in name.lower()
            or query_lower.replace(" ", "") in name.lower().replace(" ", "")
        ):
            results.append((symbol, name, asset_type))
            if len(results) >= limit:
                break

    return results
