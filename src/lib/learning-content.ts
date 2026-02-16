export interface LearningArticle {
  title: string;
  category: string;
  summary: string;
  content: string[];
  keyTerms?: { term: string; definition: string }[];
  realWorldExample?: string;
}

export const LEARNING_CONTENT: Record<string, LearningArticle> = {
  "esp-tile": {
    title: "Electronic Streaming Prices (ESP)",
    category: "Pricing",
    summary:
      "ESP tiles show continuously updated, executable bid and ask prices for a currency pair — the core pricing mechanism in modern FX trading.",
    content: [
      "Electronic Streaming Prices (ESP) replaced the older Request for Quote (RFQ) model where traders had to manually ask for prices. With ESP, liquidity providers continuously stream two-way prices (bid and ask) to clients, enabling instant execution.",
      "Each ESP tile represents a single currency pair and displays the best available prices from connected liquidity providers. The prices update in real time — often multiple times per second — reflecting changes in the interbank market.",
      "Traders can execute by clicking the Sell (bid) or Buy (ask) side. Because prices are pre-trade, execution is typically instant, though in fast markets the price may move between display and execution (known as 'last look').",
    ],
    keyTerms: [
      { term: "ESP", definition: "Electronic Streaming Prices — continuously updated executable quotes" },
      { term: "RFQ", definition: "Request for Quote — the older model where prices are requested on demand" },
      { term: "Last Look", definition: "A brief window where the LP can reject a trade if the price has moved" },
    ],
    realWorldExample:
      "A corporate treasurer needs to buy EUR 5M against USD. They see the ESP tile showing EUR/USD 1.0842 / 1.0845. They click Buy at 1.0845 and the trade executes instantly — no phone calls, no waiting.",
  },

  "esp-sell-button": {
    title: "Sell / Hit the Bid",
    category: "Execution",
    summary:
      "Clicking Sell executes at the bid price — the price at which the market maker is willing to buy from you.",
    content: [
      "In FX, 'selling' means selling the base currency (the first in the pair). For EUR/USD, selling means you are selling euros and receiving US dollars.",
      "'Hitting the bid' is market terminology for selling at the quoted bid price. The bid is always the lower of the two prices because it represents what the dealer will pay. You are a price taker accepting the dealer's bid.",
      "In professional FX, sell orders on ESP tiles execute immediately at the displayed price (subject to last-look). For large notionals, the price may differ from what is displayed due to market impact or partial fills.",
    ],
    keyTerms: [
      { term: "Bid", definition: "The price at which the market maker will buy (you sell at this price)" },
      { term: "Base Currency", definition: "The first currency in the pair (EUR in EUR/USD)" },
      { term: "Hit the Bid", definition: "To sell at the current bid price" },
    ],
    realWorldExample:
      "EUR/USD shows 1.0842 / 1.0845. You hit the bid (Sell) at 1.0842, meaning you sell EUR and receive USD at a rate of 1.0842 dollars per euro.",
  },

  "esp-buy-button": {
    title: "Buy / Lift the Offer",
    category: "Execution",
    summary:
      "Clicking Buy executes at the ask (offer) price — the price at which the market maker is willing to sell to you.",
    content: [
      "Buying in FX means purchasing the base currency. For EUR/USD, buying means you pay US dollars to receive euros at the quoted ask price.",
      "'Lifting the offer' (or 'paying the offer') means you accept the market maker's ask price. The ask is always higher than the bid — the difference is the spread, which represents the market maker's compensation.",
      "ESP buy execution is designed for speed. In liquid pairs like EUR/USD, execution is near-instant for standard market sizes. For very large amounts, traders may use algorithmic execution strategies to minimise market impact.",
    ],
    keyTerms: [
      { term: "Ask / Offer", definition: "The price at which the market maker will sell (you buy at this price)" },
      { term: "Lift the Offer", definition: "To buy at the current ask price" },
      { term: "Quote Currency", definition: "The second currency in the pair (USD in EUR/USD)" },
    ],
    realWorldExample:
      "You need to buy GBP 10M for a client payment. GBP/USD shows 1.2710 / 1.2713. You lift the offer at 1.2713, paying $12.713M to receive £10M.",
  },

  "spread-display": {
    title: "Bid-Ask Spread",
    category: "Pricing",
    summary:
      "The spread is the difference between bid and ask prices, measured in pips — it represents the cost of immediate execution.",
    content: [
      "The bid-ask spread is the primary transaction cost in FX trading. It is the difference between the price you can sell at (bid) and the price you can buy at (ask). Tighter spreads mean lower costs.",
      "Spreads are quoted in pips (percentage in point). For most pairs, one pip is 0.0001; for JPY pairs, one pip is 0.01. A EUR/USD spread of 3 pips means 0.0003.",
      "Spread width depends on liquidity, volatility, and the currency pair. Major pairs (EUR/USD, USD/JPY) typically have spreads of 0.5–3 pips. Exotic pairs can have spreads of 20–100+ pips. Spreads widen during news events, low liquidity periods (e.g. market opens), and high volatility.",
    ],
    keyTerms: [
      { term: "Pip", definition: "Percentage in point — the smallest standard price increment (0.0001 for most pairs)" },
      { term: "Tight Spread", definition: "A narrow bid-ask difference, indicating high liquidity and low cost" },
      { term: "Wide Spread", definition: "A large bid-ask difference, typically during volatile or illiquid conditions" },
    ],
    realWorldExample:
      "EUR/USD bid 1.08420 / ask 1.08450 = 3.0 pip spread. On a EUR 1M trade, this spread costs approximately $30 (0.0003 × 1,000,000).",
  },

  "price-display": {
    title: "FX Price Formatting (Big Figure & Pips)",
    category: "Pricing",
    summary:
      "FX prices are displayed with the 'big figure' digits enlarged for rapid reading — a convention from the interbank voice market.",
    content: [
      "In professional FX, prices are displayed in a specific format that emphasises the most important digits. The 'big figure' (or 'handle') refers to the first few digits that change infrequently. The 'pips' digits — the last two significant figures — are displayed larger because they change most often.",
      "For EUR/USD at 1.08452: '1.08' is the whole portion, '45' are the pip digits (displayed large), and '2' is the pipette (1/10th of a pip, shown as a superscript). Traders focus on the pip digits because the big figure is assumed to be known.",
      "This convention originated in voice trading where brokers would say 'forty-five, two' rather than 'one-oh-eight-four-five-two', since all market participants already knew the big figure. The visual formatting on electronic platforms mirrors this tradition.",
    ],
    keyTerms: [
      { term: "Big Figure", definition: "The first digits of a price that change infrequently (e.g. '1.08' in 1.0845)" },
      { term: "Pips Digits", definition: "The 4th and 5th decimal places — the main focus for traders" },
      { term: "Pipette", definition: "1/10th of a pip — the last digit, shown in superscript" },
    ],
    realWorldExample:
      "A voice broker quotes EUR/USD as 'forty-five, two'. All participants know the big figure is 1.08, so the full price is 1.08452.",
  },

  "price-ladder": {
    title: "Depth of Market / Price Ladder",
    category: "Pricing",
    summary:
      "The price ladder shows resting order volume at each price level, revealing supply and demand depth beyond the best bid/ask.",
    content: [
      "A price ladder (or depth-of-market display) shows the aggregate order volume available at each price level around the current market price. Bid amounts appear on the left, ask amounts on the right, with the price in the centre.",
      "In FX, depth of market reflects aggregated liquidity from multiple providers. Unlike equities exchanges, the FX market is decentralised (OTC), so the depth shown depends on which liquidity providers are connected to your platform.",
      "Traders use the ladder to gauge liquidity and potential price impact. If large bid volumes sit at 1.0840 but ask volumes are thin above 1.0845, a buy order might move the price up more easily than a sell order would push it down.",
    ],
    keyTerms: [
      { term: "Depth of Market (DOM)", definition: "The volume of orders resting at each price level" },
      { term: "Liquidity", definition: "The ease of executing trades without significant price impact" },
      { term: "Price Impact", definition: "How much a trade moves the market price" },
    ],
    realWorldExample:
      "A trader sees 50M of bids clustered at 1.0840 on the ladder. This 'support' level suggests the price is unlikely to fall below 1.0840 without significant selling pressure.",
  },

  "watchlist": {
    title: "FX Watchlist / Rate Monitor",
    category: "Pricing",
    summary:
      "The watchlist provides a consolidated view of real-time rates across multiple currency pairs, enabling quick market surveillance.",
    content: [
      "The FX watchlist displays live bid/ask rates, daily change, and percentage change for a configurable set of currency pairs. It serves as the trader's primary market monitoring tool.",
      "Colour coding provides instant visual feedback: green indicates the pair has moved up (base currency strengthening) while red indicates it has moved down. The 24-hour change columns help traders identify trending pairs and unusual moves.",
      "Clicking a pair in the watchlist typically selects it as the active trading pair, updating the chart, ESP tile, and order entry form. This workflow enables rapid switching between instruments.",
    ],
    keyTerms: [
      { term: "Base Currency Strengthening", definition: "When the exchange rate rises (e.g. EUR/USD moves from 1.08 to 1.09)" },
      { term: "24h Change", definition: "The absolute price change over the last 24 hours" },
      { term: "% Change", definition: "The relative price change as a percentage of the previous close" },
    ],
    realWorldExample:
      "A macro trader monitors 20 pairs in the watchlist. They notice USD/JPY is up 1.2% while EUR/USD is flat — suggesting a broad dollar rally concentrated against the yen, possibly driven by BOJ policy expectations.",
  },

  "candlestick-chart": {
    title: "Candlestick Charts in FX",
    category: "Technical Analysis",
    summary:
      "Candlestick charts display open, high, low, and close (OHLC) data for each time period, revealing price action patterns used in technical analysis.",
    content: [
      "Each candlestick represents one time period (e.g. 5 minutes, 1 hour, 1 day). The body shows the open-to-close range: green (bullish) means close > open; red (bearish) means close < open. The thin lines (wicks/shadows) show the high and low of the period.",
      "Candlestick patterns originated in 18th century Japanese rice trading. Common patterns include doji (open ≈ close, indicating indecision), hammer (small body, long lower wick, indicating potential reversal), and engulfing patterns (one candle's body completely covers the previous).",
      "In FX, candlestick charts are the dominant charting style. Traders combine pattern recognition with support/resistance levels, moving averages, and other technical indicators to identify trading opportunities.",
    ],
    keyTerms: [
      { term: "OHLC", definition: "Open, High, Low, Close — the four data points in each candlestick" },
      { term: "Body", definition: "The thick part showing the open-to-close range" },
      { term: "Wick / Shadow", definition: "The thin lines showing the high and low extremes" },
    ],
    realWorldExample:
      "A long lower wick on a daily EUR/USD candle at the 1.0800 support level suggests buyers stepped in aggressively — a potential bullish reversal signal that a swing trader might act on.",
  },

  "chart-timeframe": {
    title: "Chart Timeframes",
    category: "Technical Analysis",
    summary:
      "Different timeframes (1m to 1D) serve different trading styles — from scalpers watching 1-minute charts to swing traders analysing daily candles.",
    content: [
      "The timeframe determines how much price data each candlestick represents. Shorter timeframes (1m, 5m) show more granular price action and are used by scalpers and day traders. Longer timeframes (4H, 1D) smooth out noise and are favoured by swing and position traders.",
      "Multi-timeframe analysis is a cornerstone of FX technical analysis. A common approach: identify the trend on a higher timeframe (e.g. daily), then look for entries on a lower timeframe (e.g. 15m) in the direction of the higher-timeframe trend.",
      "Common timeframes and their typical users: 1m/5m for scalpers, 15m/1H for day traders, 4H for swing traders, and 1D for position traders and analysts. Most professional FX traders monitor at least 2–3 timeframes simultaneously.",
    ],
    keyTerms: [
      { term: "Scalping", definition: "Very short-term trading aiming for small, frequent profits on 1m–5m charts" },
      { term: "Multi-Timeframe Analysis", definition: "Analysing the same pair on multiple timeframes to confirm signals" },
      { term: "Noise", definition: "Random short-term price fluctuations that obscure the underlying trend" },
    ],
    realWorldExample:
      "A day trader sees EUR/USD in an uptrend on the 4H chart. They switch to the 15m chart to find a pullback entry: a dip to a support level with a bullish candle pattern becomes their entry signal.",
  },

  "order-entry": {
    title: "Order Entry",
    category: "Order Management",
    summary:
      "The order entry panel is where traders construct and submit limit and stop orders with specific price, amount, and time-in-force parameters.",
    content: [
      "Unlike ESP execution (immediate, at-market), the order entry form allows traders to specify a desired price. The order rests in the market until the price is reached, the order expires, or the trader cancels it.",
      "Key fields include: order type (limit or stop), currency pair, notional amount, price, time-in-force, and direction. Each field must be carefully set — an error in any parameter could result in an unintended trade.",
      "Professional FX platforms validate orders before submission: checking that the price is on the correct side of the market (e.g. a buy limit must be below current ask), the amount is within permitted limits, and the pair is tradeable.",
    ],
    keyTerms: [
      { term: "Resting Order", definition: "An order that waits in the market until its price condition is met" },
      { term: "Notional", definition: "The face value or amount of the currency being traded" },
      { term: "Order Validation", definition: "Pre-submission checks to prevent erroneous orders" },
    ],
    realWorldExample:
      "A trader thinks EUR/USD will pull back to 1.0800 before rallying. They place a Buy Limit at 1.0800 for EUR 5M, GTC. The order rests until the price drops to 1.0800, then executes automatically.",
  },

  "limit-order": {
    title: "Limit Orders",
    category: "Order Management",
    summary:
      "A limit order buys at or below a specified price (or sells at or above), guaranteeing price but not execution.",
    content: [
      "A buy limit order is placed below the current market price: 'I want to buy, but only at this price or better.' A sell limit is placed above the current price: 'I want to sell, but only at this price or better.'",
      "Limit orders are the most common resting order type in FX. They guarantee your execution price (you will never pay more than your limit) but do not guarantee execution — if the market never reaches your price, the order will not fill.",
      "In FX, limit orders are often used to enter positions at technical levels (support/resistance), to take profit on existing positions, or to build positions gradually at improving prices.",
    ],
    keyTerms: [
      { term: "Buy Limit", definition: "An order to buy at or below a specified price (placed below market)" },
      { term: "Sell Limit", definition: "An order to sell at or above a specified price (placed above market)" },
      { term: "Price Guarantee", definition: "Limit orders ensure execution at the specified price or better" },
    ],
    realWorldExample:
      "EUR/USD is at 1.0850. A trader places a sell limit at 1.0900, expecting resistance at that level. If EUR/USD rallies to 1.0900, the order fills — locking in the higher price.",
  },

  "stop-order": {
    title: "Stop Orders",
    category: "Order Management",
    summary:
      "A stop order triggers when the market reaches a specified price — used for both stop-losses and momentum entries.",
    content: [
      "A buy stop is placed above the current market price: it triggers a buy when the price rises to that level. A sell stop is placed below: it triggers a sell when the price falls. This is the opposite of limit order placement.",
      "The most common use is as a stop-loss: protecting against adverse price movements. For example, if you are long EUR/USD at 1.0850, a sell stop at 1.0800 limits your maximum loss to 50 pips.",
      "Momentum traders also use stop orders to enter breakout trades: a buy stop above a resistance level automatically enters a long position if the price breaks through. In fast markets, stop orders may experience slippage (execution at a worse price than specified).",
    ],
    keyTerms: [
      { term: "Stop-Loss", definition: "A stop order used to limit losses on an existing position" },
      { term: "Slippage", definition: "The difference between expected and actual execution price" },
      { term: "Breakout", definition: "When price moves beyond a defined support or resistance level" },
    ],
    realWorldExample:
      "You are long GBP/USD at 1.2700 with a sell stop at 1.2650. If the market crashes on unexpected news, your stop triggers at 1.2650 (or nearby if slippage occurs), capping your loss at ~50 pips.",
  },

  "order-amount": {
    title: "Trade Notional / Amount",
    category: "Order Management",
    summary:
      "The order amount specifies the notional value of the base currency being traded — in FX, amounts are typically quoted in millions.",
    content: [
      "In FX, the notional (or face value) is expressed in the base currency. For EUR/USD, an amount of 1,000,000 means 1 million euros. The equivalent amount of the quote currency is calculated at the execution rate.",
      "Standard institutional trade sizes: spot FX starts at roughly 1M of base currency. The interbank market regularly sees trades of 10M–100M+. Retail and corporate trades may be smaller.",
      "The amount directly affects market impact. A 1M EUR/USD trade will fill at the displayed price with no impact. A 500M trade might move the market several pips and would typically be executed using an algorithmic strategy.",
    ],
    keyTerms: [
      { term: "Notional", definition: "The face value of a trade, expressed in the base currency" },
      { term: "Market Impact", definition: "The price movement caused by the execution of a large trade" },
      { term: "Round Lot", definition: "A standard trade size — typically 1M in institutional FX" },
    ],
    realWorldExample:
      "A pension fund needs to sell USD 250M to buy GBP for UK investments. Rather than one large trade (which would move the market), they use a TWAP algorithm to split it into smaller clips over 2 hours.",
  },

  "order-price": {
    title: "Limit / Stop Price",
    category: "Order Management",
    summary:
      "The order price is the trigger or execution level — for limits it is the best acceptable price; for stops it is the activation price.",
    content: [
      "For limit orders, the price specifies the worst acceptable execution price. A buy limit at 1.0800 means 'buy at 1.0800 or lower'. For stop orders, the price is the trigger: once the market touches this level, the stop becomes a market order.",
      "The pip adjustment arrows (up/down) allow fine-tuning the price by one pip at a time. For non-JPY pairs this is 0.0001; for JPY pairs, 0.01. Precise pricing is critical — a price even one pip off can mean the difference between an order filling and missing.",
      "Traders often set prices at round numbers (1.0800, 1.0900) or technical levels. These levels tend to attract large amounts of resting orders, creating support and resistance zones.",
    ],
    keyTerms: [
      { term: "Trigger Price", definition: "The price at which a stop order activates" },
      { term: "Round Number", definition: "Psychologically significant price levels (e.g. 1.0800, 110.00)" },
      { term: "Pip Adjustment", definition: "Fine-tuning order price by the minimum increment" },
    ],
    realWorldExample:
      "A trader places a buy limit at 1.08000 (a round number). Thousands of other traders have the same idea, creating a cluster of bids. When the price reaches 1.08000, the large volume of buy orders creates a 'floor' — classic support.",
  },

  "tif-selector": {
    title: "Time in Force (GTC, IOC, FOK, GTD, DAY)",
    category: "Order Management",
    summary:
      "Time in Force determines how long an order remains active — from 'good until cancelled' to 'fill immediately or cancel'.",
    content: [
      "GTC (Good Till Cancelled): The order remains active indefinitely until filled or manually cancelled. The most common TIF for resting limit/stop orders.",
      "IOC (Immediate or Cancel): The order must fill immediately (partially or fully). Any unfilled portion is cancelled. Used when you want to avoid leaving resting orders in the market.",
      "FOK (Fill or Kill): The entire order must fill immediately or the entire order is cancelled. No partial fills. Used when partial execution would be unacceptable (e.g. hedging a specific exposure).",
      "GTD (Good Till Date): The order remains active until a specified date/time, then is automatically cancelled. Useful for event-driven strategies (e.g. 'keep this order until the NFP release').",
      "DAY: The order is valid only for the current trading day. At end of day (typically 5pm New York), unfilled orders are cancelled. The FX market considers a 'day' to run from 5pm ET to 5pm ET.",
    ],
    keyTerms: [
      { term: "GTC", definition: "Good Till Cancelled — remains active until filled or cancelled" },
      { term: "IOC", definition: "Immediate or Cancel — fill what you can immediately, cancel the rest" },
      { term: "FOK", definition: "Fill or Kill — fill the entire order immediately or cancel completely" },
      { term: "GTD", definition: "Good Till Date — active until a specified expiry date" },
      { term: "DAY", definition: "Valid for the current trading day only (5pm–5pm ET in FX)" },
    ],
    realWorldExample:
      "A risk manager places a stop-loss with TIF = GTC because they need it to remain active regardless of how long it takes. For a speculative limit order ahead of a news event, they use GTD with expiry set to 30 minutes after the announcement.",
  },

  "place-order": {
    title: "Placing an Order",
    category: "Order Management",
    summary:
      "The PLACE ORDER button submits the order for execution — once submitted, the order enters the market and begins its lifecycle.",
    content: [
      "Order submission is a critical action. Once placed, the order is live in the market and will execute if conditions are met. Professional platforms confirm the order details and return a unique order ID for tracking.",
      "Before submission, the platform validates all fields: correct price side (limit buy below market, limit sell above), valid amount within trading limits, valid currency pair, and acceptable time-in-force.",
      "After submission, the order appears in the order status panel with status 'Working'. The trader can then monitor, amend, suspend, or cancel the order as market conditions change.",
    ],
    keyTerms: [
      { term: "Order ID", definition: "A unique identifier assigned to each submitted order for tracking" },
      { term: "Working", definition: "An order that has been accepted and is active in the market" },
      { term: "Validation", definition: "Pre-submission checks ensuring the order parameters are correct" },
    ],
    realWorldExample:
      "A trader clicks PLACE ORDER for a buy limit EUR/USD 5M at 1.0800 GTC. The system validates, accepts the order (ID: ORD-20240115-001), and it appears in the status panel as 'Working'.",
  },

  "order-status": {
    title: "Order Lifecycle & States",
    category: "Order Management",
    summary:
      "Orders progress through states — Working, Suspended, PartiallyFilled, Filled, Cancelled — each representing a stage in the order lifecycle.",
    content: [
      "Working: The order is active and waiting for its price condition to be met. This is the normal state for resting limit and stop orders.",
      "Suspended: The order has been temporarily paused by the trader. It will not execute while suspended, but can be resumed. Useful when you want to pause an order without losing your place in the queue.",
      "Partially Filled: Part of the order has executed but a remaining amount is still working. This happens when available liquidity at the order price is less than the full order amount.",
      "Filled: The order has fully executed. The trade is done and will appear in the blotter. The fill price and time are recorded for reconciliation.",
      "Cancelled: The order has been removed from the market, either by the trader (manual cancel) or by the system (TIF expiry, OFF ALL, or risk controls).",
    ],
    keyTerms: [
      { term: "Order Lifecycle", definition: "The progression of states an order passes through from submission to completion" },
      { term: "Partial Fill", definition: "When only a portion of the order amount has been executed" },
      { term: "Reconciliation", definition: "The process of matching executed trades with expected outcomes" },
    ],
    realWorldExample:
      "A GTC limit order to sell EUR 10M at 1.0900 first partially fills 3M when a buyer matches, showing 'Partially Filled (3M/10M)'. Later the remaining 7M fills, and the status changes to 'Filled'.",
  },

  "order-amend": {
    title: "Amending Orders",
    category: "Order Management",
    summary:
      "Amending allows a trader to modify an active order's price or amount without cancelling and re-entering — preserving queue priority.",
    content: [
      "Order amendment (or modification) changes the parameters of a working order. The most common amendment is a price change — moving a limit order closer to or further from the market as conditions evolve.",
      "In many venues, amending the price preserves your time priority in the order queue, which is advantageous compared to cancelling and re-entering. However, the rules vary by venue and order type.",
      "The AMEND button in this terminal increases the price by one pip — a quick way to make the order more aggressive. In production systems, amendments typically open a dialog where the trader can specify the new price and amount.",
    ],
    keyTerms: [
      { term: "Amendment", definition: "Modification of a working order's price, amount, or other parameters" },
      { term: "Queue Priority", definition: "Your position in the order queue based on when your order was submitted" },
      { term: "Aggressive", definition: "Moving your price closer to the market, increasing the chance of execution" },
    ],
    realWorldExample:
      "A trader has a buy limit at 1.0800 but the market is dropping faster than expected. They amend the order to 1.0790 to wait for a better entry, keeping their queue priority at the new level.",
  },

  "order-suspend": {
    title: "Suspending Orders",
    category: "Order Management",
    summary:
      "Suspending pauses a working order without cancelling it — the order remains on the books but will not execute until resumed.",
    content: [
      "Order suspension is a risk management tool that temporarily deactivates an order. Unlike cancellation, a suspended order can be quickly reactivated without re-entering all parameters.",
      "Traders suspend orders when they want to pause trading activity — for example, ahead of a major news event, during system maintenance, or when stepping away from the desk. The order retains all its parameters and can be resumed with one click.",
      "Some platforms automatically suspend all orders when the screen lock is activated, adding a layer of protection against unintended execution when the trader is away.",
    ],
    keyTerms: [
      { term: "Suspension", definition: "Temporarily pausing an order so it will not execute" },
      { term: "Resume", definition: "Reactivating a suspended order, returning it to Working status" },
    ],
    realWorldExample:
      "Ahead of the US Non-Farm Payrolls release (a major market-moving event), a trader suspends all their resting orders to avoid execution during the volatile seconds around the announcement, then resumes them once the market stabilises.",
  },

  "fill-at-market": {
    title: "Fill at Market",
    category: "Execution",
    summary:
      "FILL@MKT immediately executes a resting order at the current market price, bypassing the limit/stop price condition.",
    content: [
      "Fill at Market converts a resting order into an immediate market execution. Instead of waiting for the price to reach the order's specified level, the order is filled at the best available current price.",
      "This is useful when a trader decides they want to enter or exit now rather than wait. For example, if you have a buy limit at 1.0800 but the market is at 1.0850 and you believe it will rally further, FILL@MKT gets you in immediately.",
      "The trade-off is price: you pay the current market spread rather than your specified limit price. The filled order appears in the blotter with the actual execution price, not the original order price.",
    ],
    keyTerms: [
      { term: "Market Order", definition: "An order to execute immediately at the best available price" },
      { term: "Best Available", definition: "The current bid (for sells) or ask (for buys) price" },
      { term: "Opportunity Cost", definition: "The risk that waiting for a better price means missing the trade entirely" },
    ],
    realWorldExample:
      "A trader has a sell limit at 1.0900 but breaking news suggests the market will drop. They hit FILL@MKT to sell immediately at 1.0860 rather than risk the price falling further while waiting for 1.0900.",
  },

  "off-all": {
    title: "OFF ALL / Kill Switch",
    category: "Risk",
    summary:
      "OFF ALL cancels every working order instantly — a critical risk control for stopping all market exposure in an emergency.",
    content: [
      "The OFF ALL button (also called a 'kill switch') cancels all active orders across all currency pairs in a single action. It is the most important risk control on any trading terminal.",
      "Kill switches are mandated by regulatory bodies and internal risk management. They must work instantly and reliably, even during extreme market conditions. In production systems, OFF ALL may also flatten open positions.",
      "Traders use OFF ALL during market emergencies (flash crashes, unexpected central bank decisions), system issues (connectivity problems, pricing anomalies), or when they detect potential errors in their order book.",
    ],
    keyTerms: [
      { term: "Kill Switch", definition: "An emergency button that cancels all orders and/or closes all positions" },
      { term: "Risk Control", definition: "Mechanisms that limit potential losses from trading activity" },
      { term: "Flash Crash", definition: "A rapid, extreme price movement that reverses quickly" },
    ],
    realWorldExample:
      "During the 2015 SNB event (Swiss National Bank unexpectedly removed the EUR/CHF floor), EUR/CHF dropped 30% in minutes. Traders who hit OFF ALL in the first seconds saved themselves from catastrophic losses on their resting orders.",
  },

  "blotter": {
    title: "Trade Blotter",
    category: "Settlement",
    summary:
      "The blotter is the trader's transaction log — a real-time record of all executed trades, orders, and market activity for the session.",
    content: [
      "The trade blotter is the central record-keeping component. It displays all executed trades (done deals), working and completed orders, and in full systems, positions and messages from the market.",
      "The blotter serves multiple purposes: real-time trade monitoring, end-of-day reconciliation, audit trail for compliance, and PnL tracking. Every trade on the desk flows through the blotter.",
      "Blotter data is typically filterable and exportable. Traders filter by currency pair, time range, status, or counterparty to find specific trades. At end of day, operations teams reconcile blotter records against counterparty confirmations.",
    ],
    keyTerms: [
      { term: "Blotter", definition: "A real-time log of all trading activity" },
      { term: "Reconciliation", definition: "Matching internal trade records with counterparty confirmations" },
      { term: "Audit Trail", definition: "A complete record of all actions for compliance purposes" },
    ],
    realWorldExample:
      "At 5pm, the operations team pulls the day's blotter: 47 trades totalling USD 1.2B notional across 8 currency pairs. They match each trade against confirmations received from counterparties, flagging 2 discrepancies for investigation.",
  },

  "blotter-trades": {
    title: "Done Trades",
    category: "Settlement",
    summary:
      "The Done Trades tab shows fully executed transactions — trades that have been completed and are proceeding to settlement.",
    content: [
      "Done trades are completed transactions where both parties have agreed on the rate, amount, and value date. These trades are now in the post-trade lifecycle: confirmation, settlement, and accounting.",
      "Each done trade shows the reference ID, execution time, currency pair, direction, amount, execution rate, product type (spot, forward, swap), status, and counterparty. These details are essential for reconciliation.",
      "In FX, most spot trades settle T+2 (two business days after the trade date). The settlement process involves the actual exchange of currencies through correspondent banks. Done trades that fail to settle become 'breaks' requiring manual resolution.",
    ],
    keyTerms: [
      { term: "T+2 Settlement", definition: "Standard FX spot settlement: two business days after trade date" },
      { term: "Value Date", definition: "The date when currencies are actually exchanged" },
      { term: "Confirmation", definition: "A formal document agreeing the trade details between counterparties" },
    ],
    realWorldExample:
      "A EUR/USD spot trade done on Monday settles on Wednesday (T+2). On Wednesday, your bank debits USD from your nostro account and credits EUR. If the counterparty fails to deliver, the trade is flagged as a settlement break.",
  },

  "blotter-orders": {
    title: "Order Blotter",
    category: "Order Management",
    summary:
      "The Order Blotter provides a comprehensive view of all orders — working, filled, cancelled, and suspended — for full lifecycle tracking.",
    content: [
      "Unlike the order status panel (which focuses on active orders), the order blotter shows the complete history of all orders placed during the session, regardless of their current state.",
      "The order blotter is essential for compliance and best execution reporting. Regulators require firms to demonstrate that orders were handled fairly and that execution quality meets best-execution standards.",
      "Key columns include order ID, submission time, pair, direction, type, amount, price, time-in-force, status, and filled amount. The filled amount column is particularly important for tracking partial fills.",
    ],
    keyTerms: [
      { term: "Best Execution", definition: "Regulatory requirement to execute orders at the best available terms for the client" },
      { term: "Order History", definition: "Complete record of all orders placed, including cancelled and rejected" },
      { term: "Compliance", definition: "Adherence to regulatory rules governing trade execution and reporting" },
    ],
    realWorldExample:
      "A compliance officer reviews the order blotter and notices an order was submitted, amended three times, then cancelled — all within 2 seconds. This pattern (layering) could indicate market manipulation and triggers an investigation.",
  },

  "connection-status": {
    title: "Market Data Connection",
    category: "Infrastructure",
    summary:
      "The connection indicator shows whether the terminal is receiving live market data — a critical signal for any real-time trading system.",
    content: [
      "The green 'Live' indicator confirms the terminal is connected to the market data feed and receiving real-time prices. A red 'Disconnected' indicator means prices are stale and trading should be halted.",
      "Market data connections use WebSocket or similar persistent protocols to stream prices with minimal latency. In production systems, connections are monitored with heartbeats and automatic reconnection logic.",
      "Trading on stale prices is one of the most dangerous situations in FX. If the connection drops, displayed prices freeze at their last values while the actual market continues moving. Executing at stale prices can result in immediate and significant losses.",
    ],
    keyTerms: [
      { term: "Market Data Feed", definition: "The real-time stream of prices from liquidity providers" },
      { term: "Stale Price", definition: "A displayed price that no longer reflects the current market" },
      { term: "Heartbeat", definition: "A periodic signal confirming the connection is active" },
    ],
    realWorldExample:
      "A trader's connection drops during volatile markets. The screen still shows EUR/USD at 1.0850, but the actual market has moved to 1.0800. If they sell at the stale 1.0850, the trade would execute at the real price of 1.0800 — a 50-pip loss.",
  },

  "screen-lock": {
    title: "Screen Lock",
    category: "Risk",
    summary:
      "Screen Lock prevents accidental trades when the trader steps away from the desk — a visual warning state that blocks order execution.",
    content: [
      "Screen Lock is a safety feature that prevents unintended order execution. When active, it displays a prominent visual warning (amber state) to indicate the terminal is locked.",
      "In institutional trading environments, traders manage multiple screens and millions in exposure. An accidental click while reaching for a coffee could execute a trade. Screen lock eliminates this risk.",
      "Professional terminals automatically engage screen lock after a period of inactivity. Some also suspend all working orders when the screen is locked, providing an additional layer of protection.",
    ],
    keyTerms: [
      { term: "Screen Lock", definition: "A safety state that prevents accidental order execution" },
      { term: "Fat Finger", definition: "An accidental trade caused by misclicking or mistyping" },
      { term: "Auto-Lock", definition: "Automatic screen lock after a period of inactivity" },
    ],
    realWorldExample:
      "A trader locks their screen before a meeting. During the meeting, EUR/USD swings wildly on an ECB announcement. Their resting orders remain as-is (or are suspended), and no accidental clicks can occur on the locked terminal.",
  },

  "volatile-market": {
    title: "Volatile Market Mode",
    category: "Risk",
    summary:
      "Volatile Market mode widens price tolerance, adjusts risk parameters, and visually alerts the trader that market conditions are abnormal.",
    content: [
      "Volatile Market mode is a terminal state that acknowledges abnormal market conditions. When activated, it typically widens acceptable slippage tolerances, may reduce maximum order sizes, and provides prominent visual warnings.",
      "High volatility in FX often occurs during: major economic data releases (NFP, CPI), central bank decisions (FOMC, ECB, BOJ), geopolitical events (elections, conflicts), and liquidity crunches (year-end, holiday periods).",
      "Traders activate this mode proactively before known events or reactively when they observe unusual price behaviour. It serves as both a risk management tool and a communication signal to others on the desk.",
    ],
    keyTerms: [
      { term: "Volatility", definition: "The degree of price variation — higher volatility means larger, faster price swings" },
      { term: "Slippage Tolerance", definition: "The acceptable difference between expected and actual execution price" },
      { term: "Liquidity Crunch", definition: "A period when market depth evaporates and spreads widen dramatically" },
    ],
    realWorldExample:
      "30 minutes before the FOMC rate decision, a trader activates Volatile Market mode. Spreads are already widening as LPs reduce their quoting. The mode's wider tolerances prevent their stop-loss orders from being rejected due to slippage limits.",
  },

  "currency-pair": {
    title: "Currency Pairs in FX",
    category: "Fundamentals",
    summary:
      "A currency pair is the quotation of two currencies — the base and quote — expressing how much of the quote currency is needed to buy one unit of the base.",
    content: [
      "Every FX trade involves two currencies simultaneously: you buy one and sell the other. The pair is written as BASE/QUOTE (e.g. EUR/USD). The exchange rate tells you how many units of the quote currency you need to buy one unit of the base.",
      "Major pairs all include USD: EUR/USD, USD/JPY, GBP/USD, USD/CHF. Cross pairs exclude USD: EUR/GBP, EUR/JPY, GBP/JPY. Exotic pairs include an emerging market currency: USD/TRY, EUR/PLN. Majors account for ~75% of daily FX volume.",
      "Convention determines which currency is the base. EUR is always the base (EUR/USD, EUR/GBP, EUR/JPY). GBP is base against most currencies except EUR. These conventions are historical and standardised globally.",
    ],
    keyTerms: [
      { term: "Base Currency", definition: "The first currency in the pair — the one being bought or sold" },
      { term: "Quote Currency", definition: "The second currency — the one used to express the exchange rate" },
      { term: "Major Pair", definition: "Currency pairs involving USD and another major currency (EUR, GBP, JPY, CHF)" },
      { term: "Cross Pair", definition: "A pair that does not include USD (e.g. EUR/GBP)" },
    ],
    realWorldExample:
      "EUR/USD at 1.0850 means 1 euro costs 1.0850 US dollars. If you buy EUR 1M, you pay USD 1,085,000. If the rate rises to 1.0900, your euros are now worth USD 1,090,000 — a profit of USD 5,000.",
  },

  "blotter-positions": {
    title: "FX Positions Blotter",
    category: "Position Management",
    summary:
      "The positions blotter tracks net exposure per currency pair — aggregating individual trades into a single position with real-time unrealized PnL.",
    content: [
      "An FX position represents your net exposure in a currency pair, aggregated from all individual trades. If you buy EUR 5M and then sell EUR 2M, your net position is Long EUR 3M. The positions blotter shows this aggregated view rather than each individual trade.",
      "The blotter displays each position's currency pair, direction (Long or Short), net amount, average entry price, current market price, and unrealized PnL. This gives traders a consolidated view of their risk exposure across all instruments.",
      "Positions differ from individual trades: a trade is a single execution event, while a position is the cumulative result of multiple trades. The positions blotter is the primary tool for monitoring overall portfolio exposure and managing risk.",
    ],
    keyTerms: [
      { term: "Net Position", definition: "The aggregated exposure in a currency pair after netting all buys and sells" },
      { term: "Exposure", definition: "The total amount of capital at risk from open positions" },
      { term: "Position Blotter", definition: "A real-time display of all aggregated positions and their PnL" },
    ],
    realWorldExample:
      "A desk trader executes 15 EUR/USD trades during the day — 8 buys totalling EUR 40M and 7 sells totalling EUR 35M. The positions blotter shows one line: Long EUR/USD 5M, with a single unrealized PnL figure based on the weighted average entry price.",
  },

  "unrealized-pnl": {
    title: "Unrealized PnL (Mark-to-Market)",
    category: "Position Management",
    summary:
      "Unrealized PnL is the theoretical profit or loss on an open position if it were closed at the current market price — it fluctuates in real time.",
    content: [
      "Unrealized PnL (also called mark-to-market PnL) represents the current profit or loss on an open position. It is 'unrealized' because the position has not been closed — the PnL only becomes real (realized) when the position is flattened.",
      "For a Long position, unrealized PnL = (current price − average entry price) × amount. For a Short position, unrealized PnL = (average entry price − current price) × amount. A Long position profits when prices rise; a Short position profits when prices fall.",
      "Mark-to-market valuation is performed continuously using live market prices. It is the standard method for measuring portfolio performance in real time. Risk managers monitor unrealized PnL to enforce position limits and trigger risk alerts.",
    ],
    keyTerms: [
      { term: "Unrealized PnL", definition: "Theoretical profit/loss on an open position at current market prices" },
      { term: "Realized PnL", definition: "Actual profit/loss locked in when a position is closed" },
      { term: "Mark-to-Market", definition: "Valuing positions at current market prices rather than historical cost" },
    ],
    realWorldExample:
      "You are Long EUR/USD 10M at an average entry of 1.0800. The current price is 1.0850. Your unrealized PnL is (1.0850 − 1.0800) × 10,000,000 = +$50,000. If the price drops to 1.0780, it becomes (1.0780 − 1.0800) × 10,000,000 = −$20,000.",
  },

  "close-position": {
    title: "Closing a Position",
    category: "Position Management",
    summary:
      "Closing a position means executing an offsetting trade to flatten your exposure — converting unrealized PnL into realized PnL.",
    content: [
      "To close a position, you execute a trade in the opposite direction for the same amount. If you are Long EUR/USD 5M, you close by selling EUR 5M. This flattens your exposure to zero and locks in (realizes) whatever PnL existed at the closing price.",
      "The mechanics of closing are identical to any other trade — the system simply recognizes that the new trade offsets the existing position. After closing, the unrealized PnL becomes realized PnL and the position disappears from the blotter.",
      "Traders close positions for several reasons: to take profit, to cut losses (stop-loss), to reduce risk ahead of events, or at end-of-day as part of risk management policy. Partial closes are also common — selling half a position to lock in some profit while maintaining exposure.",
    ],
    keyTerms: [
      { term: "Flatten", definition: "To close a position completely, bringing net exposure to zero" },
      { term: "Offsetting Trade", definition: "A trade in the opposite direction that reduces or eliminates a position" },
      { term: "Realized PnL", definition: "Profit or loss that is locked in when a position is closed" },
    ],
    realWorldExample:
      "You are Long GBP/USD 10M at 1.2700 with unrealized PnL of +$30,000 (current price 1.2730). You click Close Position, which sells GBP 10M at 1.2730. The $30,000 is now realized profit, and your GBP/USD position is flat.",
  },

  "blotter-messages": {
    title: "Messages & Notifications",
    category: "Infrastructure",
    summary:
      "The messages panel aggregates all system communications — trade confirmations, risk alerts, settlement notices, and operational messages — in a centralised, prioritised feed.",
    content: [
      "In a live FX trading environment, dozens of automated messages flow through the terminal every hour. Trade execution confirmations, order status updates, risk limit warnings, settlement instructions, and system health notifications all arrive as messages.",
      "Messages are categorised by type: Trade Execution (fill confirmations), Order Status (working, amended, cancelled), Risk Alert (limit breaches, margin warnings), Settlement (payment instructions, netting), and System (connectivity, maintenance). Each category is colour-coded for rapid identification.",
      "Priority levels (high, medium, low) determine visual prominence. High-priority messages — such as risk limit breaches or failed settlements — display a red indicator and may trigger audible alerts. Unread tracking ensures critical messages are not missed during busy trading sessions.",
    ],
    keyTerms: [
      { term: "Trade Notification", definition: "An automated confirmation that a trade has been executed, including all deal details" },
      { term: "Risk Alert", definition: "A warning that a risk limit (position size, PnL, credit) has been approached or breached" },
      { term: "Settlement Notice", definition: "Instructions or confirmations related to the exchange of currencies on value date" },
      { term: "System Message", definition: "Operational notifications about connectivity, maintenance windows, or platform status" },
    ],
    realWorldExample:
      "A trader executes a large EUR/USD trade. Within seconds, the messages panel shows: a Trade Execution confirmation with the deal reference, followed by a Risk Alert warning that EUR exposure is now at 85% of the desk limit.",
  },

  "account-balances": {
    title: "Account Balances & Margin",
    category: "Risk",
    summary:
      "Account balances track available funds, reserved margin, and total equity across multiple currencies — the foundation of position-sizing and risk management.",
    content: [
      "FX trading requires maintaining balances in multiple currencies simultaneously. A firm trading EUR/USD, GBP/JPY, and AUD/CHF needs nostro (correspondent bank) accounts in all six currencies. The balance modal provides a consolidated view of all currency holdings.",
      "Three key figures per currency: Available Balance (funds free to support new trades), Reserved Margin (funds locked as collateral for open positions), and Total Balance (available + reserved). When available balance approaches zero, new position-taking is restricted.",
      "Margin management is critical in leveraged FX trading. If losses on open positions erode the available balance below the maintenance margin level, a margin call is triggered — requiring the trader to either deposit additional funds or reduce positions immediately.",
    ],
    keyTerms: [
      { term: "Nostro Account", definition: "A bank account held in a foreign currency at a correspondent bank (e.g. a USD account at a US bank held by a European firm)" },
      { term: "Available Margin", definition: "Free funds that can be used to open new positions or absorb losses" },
      { term: "Reserved Margin", definition: "Funds set aside as collateral for currently open positions" },
      { term: "Margin Call", definition: "A demand to deposit additional funds when available balance falls below the required maintenance level" },
    ],
    realWorldExample:
      "A trader's USD nostro shows: Total $10M, Reserved $7M (supporting open positions), Available $3M. They want to open a new EUR/USD position requiring $2.5M margin. The trade is permitted, but leaves only $500K available — close to a margin call if positions move against them.",
  },

  "rfs-pricing": {
    title: "Request for Stream (RFS) / Depth of Market",
    category: "Pricing",
    summary:
      "RFS (Request for Stream) provides full depth-of-market pricing with multiple price levels — showing available liquidity beyond just the best bid and ask.",
    content: [
      "While ESP tiles show only the top-of-book (best available bid and ask), the RFS / depth-of-market view reveals the full price ladder: all available price levels and the volume at each. This gives traders visibility into where liquidity sits and how their order might be filled.",
      "RFS differs from the older RFQ (Request for Quote) model. In RFQ, you ask for a single price for a specific amount. In RFS, you subscribe to a continuous stream of depth data, seeing prices for multiple size tiers simultaneously. This enables better execution planning for large orders.",
      "The price ladder displays bids on one side and asks on the other, with prices in the centre. Larger volumes at a price level indicate stronger support (bids) or resistance (asks). Traders use this information to gauge market impact — how much their order will move the price.",
    ],
    keyTerms: [
      { term: "RFS", definition: "Request for Stream — a continuous subscription to depth-of-market pricing from liquidity providers" },
      { term: "Top of Book", definition: "The best available bid and ask prices — what you see on an ESP tile" },
      { term: "Depth of Market", definition: "The full set of available prices and volumes beyond the top of book" },
      { term: "Price Ladder", definition: "A visual display of all price levels and corresponding volumes, arranged vertically by price" },
    ],
    realWorldExample:
      "A trader needs to sell EUR 50M. The ESP tile shows a bid for 5M at 1.0842. The RFS ladder reveals: 5M at 1.0842, 10M at 1.0841, 20M at 1.0840, and 15M at 1.0838. They now know selling the full 50M would sweep through 4 price levels, with an average fill around 1.0840.",
  },

  "position-direction": {
    title: "Long & Short Positions",
    category: "Position Management",
    summary:
      "A Long position means you have bought the base currency (profit when price rises); a Short position means you have sold it (profit when price falls).",
    content: [
      "In FX, 'Long' means you hold a net bought position in the base currency. If you are Long EUR/USD, you own euros and will profit if EUR/USD rises (the euro strengthens against the dollar). Conversely, you lose if the rate falls.",
      "'Short' means you hold a net sold position in the base currency. If you are Short EUR/USD, you have sold euros (borrowed and sold them) and will profit if EUR/USD falls. You would need to buy euros back at a lower price to realize the profit.",
      "Position direction is determined by the net of all trades. If you buy EUR 10M and sell EUR 7M, you are net Long EUR 3M. The direction can flip — if you then sell another EUR 5M, you become Short EUR 2M. Understanding your net direction is critical for managing risk.",
    ],
    keyTerms: [
      { term: "Long", definition: "A net bought position — profits when the price rises" },
      { term: "Short", definition: "A net sold position — profits when the price falls" },
      { term: "Net Exposure", definition: "The aggregate directional position after netting all trades" },
    ],
    realWorldExample:
      "A trader buys EUR/USD 5M at 1.0800, then sells EUR/USD 8M at 1.0830. Net position: Short EUR 3M at an effective entry around 1.0830. If EUR/USD drops to 1.0800, the unrealized PnL is +(1.0830 − 1.0800) × 3M = +$9,000.",
  },

  "keyboard-shortcuts": {
    title: "Keyboard Shortcuts in Trading Terminals",
    category: "Infrastructure",
    summary:
      "Keyboard shortcuts enable traders to execute critical actions in milliseconds — far faster than mouse navigation — which can mean the difference between catching and missing a price.",
    content: [
      "Professional trading terminals are designed for speed. Every action that can be bound to a keystroke saves time: setting direction (B for Buy, S for Sell), submitting orders (Ctrl+Enter), and emergency actions (Ctrl+Shift+X for OFF ALL) are all standard shortcuts.",
      "Shortcuts are typically disabled when the cursor is in a text input field to prevent accidental triggering. This is why pressing 'B' in a notes field types the letter, but pressing 'B' elsewhere sets the direction to Buy.",
      "Experienced FX traders rarely touch the mouse during active trading. The workflow is almost entirely keyboard-driven: select pair with a hotkey, set direction, type amount, adjust price, and submit — all without lifting hands from the keyboard.",
    ],
    keyTerms: [
      { term: "Hotkey", definition: "A keyboard shortcut that triggers a specific action in the terminal" },
      { term: "Modifier Key", definition: "Ctrl, Shift, or Alt — combined with other keys to create compound shortcuts" },
      { term: "Focus Context", definition: "Whether shortcuts are active depends on which UI element has focus" },
    ],
    realWorldExample:
      "A scalper sees EUR/USD spike on a news headline. They press B (Buy), type the amount, press Ctrl+Enter to submit — total time under 2 seconds. A mouse-driven workflow would take 5–10 seconds, by which time the price may have moved 10+ pips.",
  },

  "trade-confirmation": {
    title: "Pre-Trade Confirmation & Compliance",
    category: "Risk",
    summary:
      "The trade confirmation dialog acts as a final checkpoint before order submission — displaying key details and flagging potential issues like large notionals or distant prices.",
    content: [
      "Pre-trade confirmation is a risk management requirement in institutional FX. Before an order is sent to market, the trader sees a summary of all parameters: direction, pair, type, amount, price, and time-in-force. This 'are you sure?' step prevents costly errors.",
      "The dialog highlights warnings when order parameters are unusual: large notional amounts (exceeding desk thresholds), prices far from the current market (which might indicate a fat-finger error), or other risk flags defined by the firm's compliance rules.",
      "Regulatory frameworks like MiFID II require firms to implement pre-trade controls. These include price collars (rejecting orders too far from market), size limits, and mandatory confirmation for orders above certain thresholds. The confirmation dialog is the trader-facing part of this control framework.",
    ],
    keyTerms: [
      { term: "Pre-Trade Check", definition: "Automated validation of order parameters before submission to market" },
      { term: "Fat-Finger Error", definition: "An accidental order with incorrect parameters — usually wrong price or amount" },
      { term: "Price Collar", definition: "A maximum allowed deviation from the current market price for new orders" },
      { term: "Notional Threshold", definition: "A size limit above which additional confirmation or approval is required" },
    ],
    realWorldExample:
      "A trader accidentally types 100M instead of 10M for a EUR/USD order. The confirmation dialog flags: 'Large notional: 100M exceeds 5M threshold'. The trader catches the error and corrects it before the order reaches the market.",
  },

  "sma-indicator": {
    title: "Simple Moving Average (SMA)",
    category: "Technical Analysis",
    summary:
      "The SMA calculates the arithmetic mean of closing prices over a set period — smoothing price data to reveal the underlying trend direction.",
    content: [
      "A Simple Moving Average (SMA) is calculated by adding the closing prices for the last N periods and dividing by N. For example, a 20-period SMA on a 1H chart averages the last 20 hourly closing prices. Each new candle drops the oldest price and adds the newest.",
      "The SMA is a lagging indicator — it follows price rather than predicting it. When the price is above the SMA, the trend is generally considered bullish; when below, bearish. Crossovers between price and SMA, or between two SMAs of different periods, are common trading signals.",
      "Common SMA periods in FX: 20 (short-term trend), 50 (medium-term), 100 and 200 (long-term). The 200-day SMA is particularly significant — institutional traders and algorithms often use it as a key support/resistance level.",
    ],
    keyTerms: [
      { term: "SMA", definition: "Simple Moving Average — the arithmetic mean of closing prices over N periods" },
      { term: "Lagging Indicator", definition: "A technical indicator that follows price action rather than predicting it" },
      { term: "Golden Cross", definition: "When a shorter-period SMA crosses above a longer-period SMA — a bullish signal" },
      { term: "Death Cross", definition: "When a shorter-period SMA crosses below a longer-period SMA — a bearish signal" },
    ],
    realWorldExample:
      "EUR/USD has been trading below its 200-day SMA at 1.0900 for weeks. When price finally breaks above 1.0900 with strong volume, algorithmic systems and trend-followers pile into long positions, creating a self-reinforcing rally.",
  },

  "ema-indicator": {
    title: "Exponential Moving Average (EMA)",
    category: "Technical Analysis",
    summary:
      "The EMA gives more weight to recent prices, making it more responsive to new information than the SMA — preferred by traders who need faster signals.",
    content: [
      "The Exponential Moving Average (EMA) applies a weighting multiplier that gives greater importance to recent prices. The formula is: EMA = (Close − Previous EMA) × multiplier + Previous EMA, where the multiplier = 2 / (N + 1). This makes the EMA react faster to price changes than the SMA.",
      "Because the EMA responds more quickly to recent price action, it generates trading signals earlier than the SMA. However, this sensitivity is a double-edged sword: faster signals also mean more false signals, especially in choppy, range-bound markets.",
      "In FX, short-period EMAs (8, 10, 13) are popular with day traders and scalpers. The EMA is also a component of other indicators — for example, the MACD (Moving Average Convergence Divergence) is based on the difference between a 12-period and 26-period EMA.",
    ],
    keyTerms: [
      { term: "EMA", definition: "Exponential Moving Average — a weighted average that emphasises recent prices" },
      { term: "Weighting Multiplier", definition: "The factor that determines how much weight recent prices receive (2 / (N+1))" },
      { term: "Responsiveness", definition: "How quickly an indicator reacts to new price data" },
      { term: "MACD", definition: "Moving Average Convergence Divergence — a trend indicator derived from two EMAs" },
    ],
    realWorldExample:
      "A day trader uses a 10-period EMA on the 5-minute chart. EUR/USD dips to the EMA at 1.0830 and bounces — the trader buys, using the EMA as dynamic support. The SMA would have been at 1.0825, missing the actual bounce point.",
  },

  "bollinger-bands": {
    title: "Bollinger Bands",
    category: "Technical Analysis",
    summary:
      "Bollinger Bands wrap a moving average with volatility-based envelopes — expanding in volatile markets and contracting in quiet ones — to identify overbought/oversold conditions.",
    content: [
      "Bollinger Bands consist of three lines: a middle band (typically a 20-period SMA), an upper band (SMA + 2 standard deviations), and a lower band (SMA − 2 standard deviations). The bands dynamically adjust to market volatility — wider in volatile conditions, narrower when the market is calm.",
      "Statistically, approximately 95% of price action falls within the 2-standard-deviation bands. When price touches or exceeds the upper band, the market may be overbought; when it touches the lower band, oversold. However, in strong trends, prices can 'walk the band' for extended periods.",
      "The 'Bollinger Squeeze' is a powerful signal: when the bands contract to their narrowest width, it indicates low volatility — which often precedes a sharp breakout. Traders watch for squeezes and position for the subsequent expansion in volatility.",
    ],
    keyTerms: [
      { term: "Bollinger Bands", definition: "Volatility bands placed above and below a moving average at ±2 standard deviations" },
      { term: "Standard Deviation", definition: "A statistical measure of price dispersion — higher values indicate greater volatility" },
      { term: "Bollinger Squeeze", definition: "When the bands contract tightly, signalling low volatility and a potential impending breakout" },
      { term: "Walking the Band", definition: "When price stays near the upper or lower band during a strong trend" },
    ],
    realWorldExample:
      "GBP/USD Bollinger Bands narrow to their tightest in 3 months — a classic squeeze. The trader sets buy and sell stop orders just outside the bands. When the Bank of England surprises with a rate hike, price breaks above the upper band and the buy stop triggers, catching the breakout.",
  },

  "risk-dashboard": {
    title: "Risk Dashboard & Exposure Management",
    category: "Risk",
    summary:
      "The risk dashboard provides a consolidated view of all risk metrics — net currency exposure, margin utilisation, position limits, and top risk items — enabling real-time risk monitoring.",
    content: [
      "The risk dashboard aggregates multiple risk dimensions into a single view. Net currency exposure shows directional risk per currency; margin utilisation shows how much of the firm's collateral is committed; and position limit bars show utilisation against pre-set maximums per pair.",
      "Top risk items are algorithmically identified: concentrated exposure in a single currency, high margin utilisation (above 80%), pairs approaching position limits, and correlation risk (e.g. being long both EUR/USD and GBP/USD, which are highly correlated). These are ranked by severity.",
      "In institutional FX, risk dashboards are monitored not just by traders but by independent risk managers who can override trading activity. If margin utilisation exceeds a threshold, the risk manager can suspend new order placement until exposure is reduced.",
    ],
    keyTerms: [
      { term: "Net Exposure", definition: "The total directional risk per currency after netting long and short positions" },
      { term: "Margin Utilisation", definition: "The percentage of available collateral currently committed to support open positions" },
      { term: "Position Limit", definition: "The maximum allowed exposure per currency pair, set by risk management" },
      { term: "Correlation Risk", definition: "The risk that multiple positions move against you simultaneously because the underlyings are correlated" },
    ],
    realWorldExample:
      "A risk manager sees the dashboard showing EUR exposure at 90% of limit and margin at 78%. They alert the desk: no new EUR positions until exposure drops below 75%. A trader closes EUR/CHF 5M to bring exposure back within limits.",
  },

  "audio-alerts": {
    title: "Audio Alerts in Trading Systems",
    category: "Infrastructure",
    summary:
      "Audio alerts notify traders of critical events — order fills, risk breaches, and price triggers — without requiring visual attention on the screen.",
    content: [
      "Trading floors are multi-screen environments where traders cannot watch every element simultaneously. Audio alerts provide an additional notification channel: distinct sounds for order fills, risk warnings, connection issues, and price alerts ensure critical events are not missed.",
      "Common audio events in FX terminals: order filled (a confirmation chime), risk limit breach (an urgent warning tone), connection lost (a distinct alert), and price level reached (a notification sound). Each sound is designed to be distinguishable even in a noisy trading floor environment.",
      "The ability to mute audio is essential — during calls, meetings, or when alerts become overwhelming in extremely active markets. Professional systems allow per-category muting (e.g. silence fill alerts but keep risk warnings) for fine-grained control.",
    ],
    keyTerms: [
      { term: "Audio Alert", definition: "An audible notification triggered by a specific trading or system event" },
      { term: "Fill Alert", definition: "A sound that plays when a resting order has been executed" },
      { term: "Risk Alert Sound", definition: "A distinctive warning tone when risk limits are approached or breached" },
      { term: "Alert Fatigue", definition: "When excessive alerts cause traders to ignore or dismiss important notifications" },
    ],
    realWorldExample:
      "A trader has a buy limit resting in USD/JPY while focused on a EUR/USD chart. The fill chime sounds — the USD/JPY order has executed. Without the audio alert, they might not notice for minutes, during which time they could miss an opportunity to set a stop-loss.",
  },

  "pnl-summary": {
    title: "P&L Tracking & Equity Curve",
    category: "Position Management",
    summary:
      "The P&L summary aggregates realized and unrealized profit/loss across all positions, with an equity curve showing how portfolio value has evolved over time.",
    content: [
      "P&L (Profit and Loss) tracking is the fundamental measure of trading performance. Total P&L combines unrealized P&L (from open positions, fluctuating with market prices) and realized P&L (locked in from closed trades). The breakdown by pair shows which instruments are contributing to or detracting from performance.",
      "The equity curve plots total portfolio value over time — the most important chart for evaluating a trader's performance. A steadily rising curve indicates consistent profitability; sharp drawdowns indicate periods of loss. Risk managers monitor the equity curve for maximum drawdown (the largest peak-to-trough decline).",
      "P&L attribution by currency pair helps traders identify their strengths and weaknesses. If a trader consistently profits in EUR/USD but loses in GBP/JPY, it suggests they should concentrate on EUR/USD and reduce GBP/JPY activity — or investigate why their edge doesn't transfer.",
    ],
    keyTerms: [
      { term: "Equity Curve", definition: "A time-series chart of total portfolio value, showing cumulative P&L over time" },
      { term: "Drawdown", definition: "The peak-to-trough decline in portfolio value — a key measure of risk" },
      { term: "P&L Attribution", definition: "Breaking down total P&L by instrument, strategy, or time period to identify performance drivers" },
      { term: "Sharpe Ratio", definition: "Risk-adjusted return: the average return divided by the standard deviation of returns" },
    ],
    realWorldExample:
      "A desk head reviews the weekly P&L summary: +$120K total, with EUR/USD contributing +$200K and GBP/USD losing −$80K. The equity curve shows a smooth upward trajectory with a 2% maximum drawdown — indicating disciplined risk management.",
  },

  "algo-orders": {
    title: "Algorithmic Order Types (TWAP/VWAP)",
    category: "Execution",
    summary:
      "TWAP and VWAP algorithms split large orders into smaller slices executed over time, minimising market impact and achieving benchmark execution prices.",
    content: [
      "TWAP (Time-Weighted Average Price) divides an order into equal-sized slices and executes them at regular intervals over a specified duration. For example, selling EUR 50M over 30 minutes with 10 slices means executing EUR 5M every 3 minutes. The goal is to match the time-weighted average price of the execution period.",
      "VWAP (Volume-Weighted Average Price) executes proportionally to market volume rather than time. It targets the volume-weighted average price as its benchmark. Participation rate (e.g. 25%) determines what fraction of market volume the algorithm consumes. VWAP reduces market impact by trading more when liquidity is abundant.",
      "These algorithms are essential for institutional FX. A trader selling USD 500M in a single clip would move the market several pips against themselves. By using TWAP or VWAP, the impact is distributed across time and liquidity, achieving a better average price.",
    ],
    keyTerms: [
      { term: "TWAP", definition: "Time-Weighted Average Price — executes equal slices at regular time intervals" },
      { term: "VWAP", definition: "Volume-Weighted Average Price — executes proportionally to market volume" },
      { term: "Market Impact", definition: "The adverse price movement caused by executing a large order" },
      { term: "Participation Rate", definition: "The fraction of market volume that the VWAP algorithm targets (e.g. 25%)" },
      { term: "Slicing", definition: "Breaking a large order into smaller child orders for gradual execution" },
    ],
    realWorldExample:
      "A sovereign wealth fund needs to sell USD 200M against JPY. A single market order would move the rate 5+ pips. Instead, they use a VWAP algorithm with 20% participation over 2 hours. The algorithm monitors real-time volume and adjusts slice sizes, achieving a fill within 0.5 pips of VWAP — saving approximately $100K versus a single block trade.",
  },

  "fix-protocol": {
    title: "FIX Protocol Messages",
    category: "Infrastructure",
    summary:
      "FIX (Financial Information eXchange) is the standard messaging protocol for electronic trading — every order, execution, and status update flows as a structured FIX message.",
    content: [
      "The FIX protocol is the universal language of electronic trading, used by virtually every financial institution, broker, and exchange worldwide. Each FIX message is a sequence of tag=value pairs separated by delimiters. Key tags include: 35 (MsgType), 11 (ClOrdID), 55 (Symbol), 54 (Side), 38 (OrderQty), 44 (Price), and 39 (OrdStatus).",
      "Message types map to the order lifecycle: New Order Single (D) for placing orders, Execution Report (8) for fills and status updates, Order Cancel Request (F) for cancellations, and Order Cancel/Replace Request (G) for amendments. Each message type has required and optional fields defined by the FIX specification.",
      "Understanding FIX messages is essential for diagnosing trading issues. When an order is rejected, the FIX Execution Report contains the reject reason (tag 103). When a fill price seems wrong, inspecting the raw FIX message shows exactly what the counterparty reported. Support teams and developers regularly parse FIX logs for troubleshooting.",
    ],
    keyTerms: [
      { term: "FIX Protocol", definition: "Financial Information eXchange — the standard electronic trading message protocol (current version: FIX 4.4/5.0)" },
      { term: "Tag", definition: "A numeric field identifier in a FIX message (e.g. tag 35 = MsgType)" },
      { term: "MsgType (35)", definition: "The message type identifier: D=New Order, 8=Execution Report, F=Cancel Request" },
      { term: "Execution Report (8)", definition: "The primary FIX message for order status updates, fills, and rejections" },
      { term: "ClOrdID (11)", definition: "Client Order ID — the unique identifier assigned by the order originator" },
    ],
    realWorldExample:
      "A trader's limit order is unexpectedly rejected. The support desk pulls the FIX log and finds the Execution Report: 35=8|39=8|103=99|58=Insufficient credit. The reject reason (tag 103=99, tag 58 text) reveals the counterparty's credit check failed — the trader needs to contact their credit team.",
  },
};
