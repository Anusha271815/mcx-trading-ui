import MarketClock from "../clock/MarketClock";
import RiskModeToggle from "../risk/RiskModeToggle";

export default function TopBar() {
  return (
    <div className="flex justify-between items-center px-6 py-3 border-b border-gray-800">
      <MarketClock />
      <RiskModeToggle />
    </div>
  );
}