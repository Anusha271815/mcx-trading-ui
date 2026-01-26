export interface MarketContext {
  comex_gold_change: number;
  shanghai_gold_change: number;
  induced_move_score: number;
  news_count: number;
}

export interface TradingVerdict {
  verdict: string;
  action: "BUY" | "SELL" | "WAIT";
  confidence: number;
  strategy: string;
  regime: string;

  recommendation: {
    position_size: string;
    stop_loss: string;
    target: string;
    urgency: string;
  };

  reasoning: string;

  market_context: MarketContext;

  timestamp: string;
}
