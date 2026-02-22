export interface HealthStatus {
  score: number;
  signal: string;
  recent_win_rate: number;
  recent_sharpe: number;
  current_drawdown: number;
  consecutive_losses: number;
  description: string;
  recommendation: string;
}