import MetricsGrid from "@/components/analytics/MetrixGrid";


export default function AnalyticsPage() {
  return (
    <div className="space-y-6">


      <MetricsGrid />

    </div>
  );
}


// import SessionGauge from "@/components/confidence/SessionGauge";
// import MarketCard from "@/components/market/marketCard";
// import AlertsPanel from "@/components/alerts/AlertPanel";
// import PriceChart from "@/components/charts/PriceChart";
// import VolumeChart from "@/components/charts/VolumeChart";

// export default function MarketOverviewPage() {
//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-semibold">Market Overview</h1>
//         <p className="text-sm text-gray-400">
//           Live session confidence & global instruments
//         </p>
//       </div>

//       {/* TOP GRID */}
//       <div className="grid grid-cols-12 gap-6">
//         {/* LEFT */}
//         <div className="col-span-4 space-y-4">
//           <SessionGauge />
//           <AlertsPanel />
//         </div>

//         {/* RIGHT */}
//         {/* <div className="col-span-8 grid grid-cols-2 auto-rows-min gap-4">
//           <MarketCard title="MCX Gold" price="59,450" change="+0.65%" bullish />
//           <MarketCard title="MCX Silver" price="74,710" change="-1.09%" />
//           <MarketCard title="USD/INR" price="91.57" change="+0.22%" bullish />
//           <MarketCard title="COMEX Gold" price="1,989" change="+0.88%" bullish />
//           <MarketCard title="MCX Gold" price="59,450" change="+0.65%" bullish />
//           <MarketCard title="MCX Silver" price="74,710" change="-1.09%" />
//           <MarketCard title="USD/INR" price="91.57" change="+0.22%" bullish />
//           <MarketCard title="COMEX Gold" price="1,989" change="+0.88%" bullish />
//         </div>
//       </div> */}

//       {/* CHARTS */}
//       <div className="grid grid-cols-2 gap-6">
//         <PriceChart />
//         <VolumeChart />
//       </div>
//     </div>
//   );
// }
