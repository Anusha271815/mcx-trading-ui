export interface AnalyticsMetrics {
  total_pnl: number;
  win_rate: number;
  profit_factor: number;
  sharpe_ratio: number;
  max_drawdown: number;

  total_trades: number;
  winning_trades: number;
  losing_trades: number;

  avg_win: number;
  avg_loss: number; 

  best_trade: number;
  worst_trade: number;

  consecutive_wins: number;
  consecutive_losses: number;

  period?: string;
}
