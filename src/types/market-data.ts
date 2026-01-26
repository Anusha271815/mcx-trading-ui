export interface MarketInstrument {
    name: string;
    price: number;
    change_pct: number;
    timestamp: string;
    source: string;
  }
  
  export interface MarketSource {
    gold?: MarketInstrument;
    silver?: MarketInstrument;
  }
  
  export interface MarketDataResponse {
    comex: MarketSource;
    shanghai: MarketSource;
    london: MarketSource;
    fetched_at: string;
  }
  