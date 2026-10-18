/**
 * Original educational articles for the demo. Neutral, general information only: no
 * recommendations, no profit claims. Each article renders at /education/[slug].
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "formula"; expression: string; caption: string }
  | { type: "example"; title: string; text: string };

export interface ArticleSection {
  heading: string;
  blocks: ArticleBlock[];
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate";
  topic: string;
  keyPoints: string[];
  sections: ArticleSection[];
}

const p = (text: string): ArticleBlock => ({ type: "p", text });
const list = (...items: string[]): ArticleBlock => ({ type: "list", items });

export const ARTICLES: readonly Article[] = [
  {
    slug: "pips-and-lots",
    title: "Pips and lots: how forex positions are measured",
    description:
      "What a pip is, why JPY pairs are different, and how lot sizes turn small price moves into amounts of money.",
    level: "Beginner",
    topic: "Foundations",
    keyPoints: [
      "A pip is the standard unit for quoting price changes in a currency pair.",
      "For most pairs a pip is 0.0001; for pairs quoted in Japanese yen it is 0.01.",
      "Lot size sets how much one pip is worth in money.",
    ],
    sections: [
      {
        heading: "Reading a currency quote",
        blocks: [
          p(
            "A currency pair such as EUR/USD shows how many units of the second currency (the quote currency) buy one unit of the first (the base currency). If EUR/USD reads 1.0850, one euro costs 1.0850 US dollars.",
          ),
          p(
            "Quotes come in two prices. The bid is the price at which the market will buy the base currency from you, and the ask is the price at which it will sell it to you. The gap between them is the spread, which is one of the costs of trading.",
          ),
        ],
      },
      {
        heading: "What a pip is",
        blocks: [
          p(
            "Prices move constantly, so traders need a common unit for describing a move. That unit is the pip. For most pairs a pip is the fourth decimal place, 0.0001. A move in EUR/USD from 1.0850 to 1.0865 is a rise of 15 pips.",
          ),
          p(
            "Pairs where the Japanese yen is the quote currency, such as USD/JPY, are priced with fewer decimals because one yen is worth much less than one dollar. For these pairs a pip is the second decimal place, 0.01. A move from 151.20 to 151.45 is 25 pips.",
          ),
          p(
            "Many platforms show one extra digit, sometimes called a fractional pip or pipette. On a five-decimal EUR/USD quote, the last digit is a tenth of a pip.",
          ),
        ],
      },
      {
        heading: "Lots: the size of a position",
        blocks: [
          p(
            "Forex positions are sized in lots. A standard lot is 100,000 units of the base currency. Smaller sizes are common too:",
          ),
          list(
            "Standard lot: 100,000 units (1.00 lots)",
            "Mini lot: 10,000 units (0.10 lots)",
            "Micro lot: 1,000 units (0.01 lots)",
          ),
          p(
            "The lot size decides what a one-pip move is worth. Bigger positions mean every pip carries more money, in both directions.",
          ),
        ],
      },
      {
        heading: "Putting pips and lots together",
        blocks: [
          {
            type: "formula",
            expression:
              "Pip value = pip size × units × (value of 1 quote-currency unit in your account currency)",
            caption: "The general pip value formula.",
          },
          {
            type: "example",
            title: "Worked example",
            text: "One standard lot of EUR/USD is 100,000 euros. A pip is 0.0001, so one pip equals 100,000 × 0.0001 = 10 US dollars. For an account held in dollars, each pip on that position is worth about $10. On a micro lot the same pip is worth about $0.10.",
          },
          p(
            "When the quote currency is not your account currency, the pip value has to be converted, which is why pip values on pairs like USD/JPY change slightly as the price moves. The pip value calculator on the Tools page shows this step by step.",
          ),
        ],
      },
    ],
  },
  {
    slug: "leverage-and-margin",
    title: "Leverage and margin explained",
    description:
      "How leverage lets a small deposit control a larger position, what margin really is, and why losses scale just as fast as gains.",
    level: "Beginner",
    topic: "Foundations",
    keyPoints: [
      "Margin is the amount set aside to open and keep a leveraged position.",
      "Leverage multiplies exposure, so both gains and losses are larger relative to your deposit.",
      "A margin call or stop-out can close positions automatically when equity falls too far.",
    ],
    sections: [
      {
        heading: "Exposure versus deposit",
        blocks: [
          p(
            "With leveraged products you do not pay the full value of a position up front. Instead you put down a fraction of it, called margin, and the provider extends the rest. The full value of the position is its notional value, and that is the amount your profit or loss is calculated on.",
          ),
          p(
            "Leverage is usually written as a ratio such as 1:30. At 1:30, every dollar of margin controls up to thirty dollars of exposure. Put another way, the margin requirement is one thirtieth, or about 3.33%, of the notional value.",
          ),
        ],
      },
      {
        heading: "Calculating margin",
        blocks: [
          {
            type: "formula",
            expression: "Margin required = notional value ÷ leverage",
            caption: "Notional value is the position size converted into your account currency.",
          },
          {
            type: "example",
            title: "Worked example",
            text: "Opening 1 standard lot of EUR/USD at 1.0850 creates a notional exposure of 100,000 euros, which is $108,500. At 1:30 leverage the margin required is $108,500 ÷ 30 ≈ $3,616.67.",
          },
        ],
      },
      {
        heading: "Why leverage cuts both ways",
        blocks: [
          p(
            "Because profit and loss are based on the notional value, a small percentage move in the market becomes a large percentage of the margin. In the example above, a 1% fall in EUR/USD is a loss of about $1,085, which is roughly 30% of the margin used.",
          ),
          p(
            "This is the core reason leveraged trading is risky: losses can build quickly, and in some situations they can exceed what you expected to lose. Lower leverage reduces how fast this happens but does not remove the risk.",
          ),
        ],
      },
      {
        heading: "Equity, free margin and margin calls",
        blocks: [
          list(
            "Balance: the account value excluding open positions.",
            "Equity: balance plus or minus the floating result of open positions.",
            "Used margin: the total margin locked by open positions.",
            "Free margin: equity minus used margin, which is what is available for new positions.",
            "Margin level: equity divided by used margin, shown as a percentage.",
          ),
          p(
            "Providers set thresholds on the margin level. Falling below one may trigger a warning (a margin call); falling below a lower one may close positions automatically (a stop-out). The exact levels vary, so it matters to read them before trading. The figures used anywhere on this demo site are illustrative only.",
          ),
        ],
      },
    ],
  },
  {
    slug: "risk-management",
    title: "Risk management basics",
    description:
      "Practical, general principles for limiting losses: position sizing, stop-losses, risk-to-reward and avoiding concentration.",
    level: "Beginner",
    topic: "Risk",
    keyPoints: [
      "Decide how much you are prepared to lose before you think about what you could gain.",
      "Position size follows from your risk amount and stop distance, not the other way round.",
      "No method removes risk; it only helps to keep it within limits you chose.",
    ],
    sections: [
      {
        heading: "Start with the loss, not the target",
        blocks: [
          p(
            "Every trade can lose. Risk management is the habit of deciding, before entering, how much of your capital a single idea is allowed to cost. Many educational resources discuss limiting risk per trade to a small, fixed percentage of the account, so that a run of losses does not do irreparable damage.",
          ),
          p(
            "The right figure depends on individual circumstances. The point is to choose it deliberately rather than let the size of a position be decided by excitement or by the amount of margin available.",
          ),
        ],
      },
      {
        heading: "Sizing a position from risk",
        blocks: [
          {
            type: "formula",
            expression:
              "Position size (lots) = risk amount ÷ (stop-loss in pips × pip value per lot)",
            caption: "Rounded down so that the planned risk is not exceeded.",
          },
          {
            type: "example",
            title: "Worked example",
            text: "With a $10,000 account and a 1% risk limit, the risk amount is $100. If the stop-loss is 25 pips away on EUR/USD, where one lot is worth about $10 per pip, the size is $100 ÷ (25 × $10) = 0.40 lots.",
          },
          p(
            "The position size calculator on the Tools page performs this calculation and shows the assumptions it uses.",
          ),
        ],
      },
      {
        heading: "Stop-losses and their limits",
        blocks: [
          p(
            "A stop-loss order closes a position once the price reaches a level you set. It turns an open-ended risk into a planned one, but it is not a guarantee: in fast markets or over a weekend gap the order may be filled at a worse price than requested, which is called slippage.",
          ),
          p(
            "Placing a stop is a judgement about where your trade idea would be proven wrong, rather than an arbitrary number of pips. A stop that is too close may be hit by normal price noise; one that is too far may mean a smaller position is needed to respect the same risk limit.",
          ),
        ],
      },
      {
        heading: "Other habits worth considering",
        blocks: [
          list(
            "Risk-to-reward: compare the distance to your stop with the distance to your target before entering.",
            "Correlation: several positions in related pairs can add up to one large bet on a single currency.",
            "Event risk: scheduled announcements can cause sudden moves and wider spreads.",
            "Records: a simple trading journal makes it easier to review decisions honestly.",
          ),
          p(
            "None of these remove risk. They are ways of keeping the risks you take visible and within limits you have chosen in advance.",
          ),
        ],
      },
    ],
  },
  {
    slug: "order-types",
    title: "Order types: market, limit and stop orders",
    description:
      "The common ways to enter and exit positions, when each one is filled, and the trade-offs between price certainty and execution certainty.",
    level: "Beginner",
    topic: "Execution",
    keyPoints: [
      "A market order prioritises being filled; a pending order prioritises the price.",
      "Limit orders wait for a better price, stop orders wait for the price to move through a level.",
      "Stop-loss and take-profit orders are pending orders attached to an open position.",
    ],
    sections: [
      {
        heading: "Market orders",
        blocks: [
          p(
            "A market order asks to buy or sell immediately at the best available price. Buys fill at the ask and sells at the bid. You are almost certain to be filled, but the exact price can differ from the one on screen if the market moves between clicking and execution.",
          ),
        ],
      },
      {
        heading: "Pending orders",
        blocks: [
          p(
            "Pending orders sit until the market reaches a price you specify. They come in two families, depending on whether you want a better price or confirmation that the price has moved:",
          ),
          list(
            "Buy limit: buy below the current price, if the price falls to your level.",
            "Sell limit: sell above the current price, if the price rises to your level.",
            "Buy stop: buy above the current price, once the price rises through your level.",
            "Sell stop: sell below the current price, once the price falls through your level.",
          ),
          p(
            "A limit order will not be filled at a worse price than its limit, but it may never be filled at all. A stop order becomes a market order once triggered, so it is likely to be filled, but the price can slip past the trigger level.",
          ),
        ],
      },
      {
        heading: "Orders that protect an open position",
        blocks: [
          p(
            "A stop-loss is a stop order that closes a position if the market moves against it. A take-profit is a limit order that closes the position once a chosen target is reached. Some platforms also offer a trailing stop, which follows the price by a set distance as it moves in your favour.",
          ),
          {
            type: "example",
            title: "Example",
            text: "Someone buys EUR/USD at 1.0850 with a stop-loss at 1.0825 and a take-profit at 1.0900. The stop risks 25 pips and the target aims for 50 pips. Whichever level is reached first closes the trade; neither outcome is guaranteed.",
          },
        ],
      },
      {
        heading: "Choosing between them",
        blocks: [
          p(
            "The choice comes down to a trade-off. If being in the market matters more than the exact price, a market order fits. If the price matters more than certainty of execution, a limit order fits. If you only want to act once the market has shown a move, a stop order fits. Understanding how each behaves in fast markets is as important as knowing how to place it.",
          ),
        ],
      },
    ],
  },
  {
    slug: "reading-candlestick-charts",
    title: "How to read a candlestick chart",
    description:
      "What each part of a candlestick represents, how timeframes change the picture, and why patterns are context rather than predictions.",
    level: "Beginner",
    topic: "Charts",
    keyPoints: [
      "Each candle summarises the open, high, low and close for one period.",
      "The body shows the open-to-close range; the wicks show the extremes.",
      "Patterns describe what happened; they do not reliably predict what happens next.",
    ],
    sections: [
      {
        heading: "Anatomy of a candle",
        blocks: [
          p(
            "A candlestick chart shows price over time as a row of candles. Each candle covers one period, such as one minute, one hour or one day, and records four prices: the open, the high, the low and the close (often shortened to OHLC).",
          ),
          list(
            "Body: the thick part between the open and the close.",
            "Upper wick: a thin line from the body up to the highest price of the period.",
            "Lower wick: a thin line from the body down to the lowest price of the period.",
            "Colour: commonly one colour when the close is above the open and another when it is below. Colours are a convention and differ between platforms.",
          ),
        ],
      },
      {
        heading: "What the shape tells you",
        blocks: [
          p(
            "A long body means the price travelled a long way between open and close. A short body with long wicks means the price moved around but ended near where it started, which is often read as indecision. A long lower wick shows that prices fell during the period but recovered before the close.",
          ),
          p(
            "These are descriptions of what buyers and sellers did during the period. They become more meaningful in context: where the candle sits relative to recent highs and lows, and how it compares with the candles around it.",
          ),
        ],
      },
      {
        heading: "Timeframes",
        blocks: [
          p(
            "The same market can look very different on different timeframes. A sharp drop on a five-minute chart might be invisible on a daily chart. Many people look at more than one timeframe to separate short-term noise from the broader direction.",
          ),
        ],
      },
      {
        heading: "A healthy scepticism about patterns",
        blocks: [
          p(
            "There are many named patterns, such as dojis, hammers and engulfing candles. They can be a useful vocabulary for describing price action, but no pattern reliably predicts the next move. Markets respond to news, liquidity and countless decisions that a chart cannot show.",
          ),
          p(
            "The illustrative charts on the Platforms page are drawn from simulated data, so you can practise reading candles without any connection to real markets.",
          ),
        ],
      },
    ],
  },
  {
    slug: "trading-psychology",
    title: "Trading psychology: decisions under uncertainty",
    description:
      "Common biases that affect financial decisions, and practical routines that help keep choices deliberate rather than emotional.",
    level: "Intermediate",
    topic: "Behaviour",
    keyPoints: [
      "Uncertainty and money together make it hard to stay objective.",
      "Biases like loss aversion and overconfidence affect almost everyone.",
      "Written plans and post-trade reviews help keep decisions consistent.",
    ],
    sections: [
      {
        heading: "Why psychology matters",
        blocks: [
          p(
            "Even a careful plan has to be carried out by a person, often while prices are moving and money is at stake. Under that pressure people tend to act in predictable ways that are not always in their interest. Recognising those tendencies does not make anyone immune to them, but it does make them easier to notice.",
          ),
        ],
      },
      {
        heading: "Common biases",
        blocks: [
          list(
            "Loss aversion: losses feel heavier than equal gains, which can lead to holding losing positions too long in the hope they recover.",
            "Overconfidence: a few good outcomes can feel like proof of skill, encouraging larger positions than planned.",
            "Recency bias: giving the latest events too much weight compared with the longer record.",
            "Confirmation bias: noticing information that supports an existing view and dismissing what contradicts it.",
            "Revenge trading: trying to win back a loss quickly, usually by abandoning the plan.",
          ),
        ],
      },
      {
        heading: "Routines that help",
        blocks: [
          p(
            "Most practical advice comes down to making decisions before emotions run high. A written plan that states the reason for a trade, the entry, the exit if wrong and the exit if right reduces the number of choices left for the heat of the moment.",
          ),
          list(
            "Set limits in advance, such as a maximum loss per day, and stop when it is reached.",
            "Keep a journal of decisions, including how you felt, not just the numbers.",
            "Review outcomes in batches rather than judging each result in isolation.",
            "Take breaks after a large loss or gain before making the next decision.",
          ),
        ],
      },
      {
        heading: "Outcome versus process",
        blocks: [
          p(
            "A good decision can have a bad outcome, and a poor decision can work out by luck. Judging yourself only by results makes it hard to learn. Reviewing whether you followed your own process is a more stable way to improve, and it keeps attention on the parts you control.",
          ),
          p(
            "This article is general education. It is not advice, and nothing on this demo site suggests that trading is suitable for any particular person.",
          ),
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** All human-readable text in an article, used for reading time. */
export function articleText(article: Article): string {
  const parts: string[] = [article.title, article.description, ...article.keyPoints];
  for (const section of article.sections) {
    parts.push(section.heading);
    for (const block of section.blocks) {
      if (block.type === "p") parts.push(block.text);
      else if (block.type === "list") parts.push(...block.items);
      else if (block.type === "formula") parts.push(block.expression, block.caption);
      else parts.push(block.title, block.text);
    }
  }
  return parts.join(" ");
}
