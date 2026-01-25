export default function OrdersPage() {
    const orders = [
      {
        id: 1,
        instrument: "MCX GOLD",
        side: "SELL",
        qty: 1,
        price: "141,220",
        status: "EXECUTED",
        time: "14:32 IST",
      },
      {
        id: 2,
        instrument: "MCX GOLD",
        side: "BUY",
        qty: 1,
        price: "141,480",
        status: "PENDING",
        time: "15:10 IST",
      },
    ];
  
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Executed and pending trades · Read-only
          </p>
        </div>
  
        {/* Orders Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-muted)] text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left">Instrument</th>
                <th className="px-4 py-3 text-left">Side</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Time</th>
              </tr>
            </thead>
  
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[var(--border-default)] hover:bg-[var(--bg-muted)]"
                >
                  <td className="px-4 py-3 font-medium">
                    {order.instrument}
                  </td>
  
                  <td
                    className={`px-4 py-3 font-semibold ${
                      order.side === "BUY"
                        ? "text-[var(--buy)]"
                        : "text-[var(--sell)]"
                    }`}
                  >
                    {order.side}
                  </td>
  
                  <td className="px-4 py-3 text-right">{order.qty}</td>
  
                  <td className="px-4 py-3 text-right">{order.price}</td>
  
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === "EXECUTED"
                          ? "bg-[var(--success)]/10 text-[var(--success)]"
                          : "bg-[var(--warning)]/10 text-[var(--warning)]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
  
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  