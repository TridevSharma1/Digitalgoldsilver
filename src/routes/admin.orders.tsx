import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { AdminShell } from "@/components/site/AdminShell";
import { Badge, statusTone } from "@/components/site/ui";

export const Route = createFileRoute("/admin/orders")({
  head: () => seo("Orders | Admin", "Track and update physical redemption orders."),
  component: Page,
});

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

function Page() {
  const [orders, setOrders] = useStore("orders");
  return (
    <div className="card-lux p-6">
      <h1 className="mb-4 font-semibold">Redemption Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr>{["Order", "Customer", "Item", "Qty", "Date", "Status"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-3">{o.id}</td>
              <td className="p-3 text-xs">{o.userEmail}</td>
              <td className="p-3">{o.item}</td>
              <td className="p-3">{o.qty}</td>
              <td className="p-3">{o.date}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <select aria-label={`Status for ${o.id}`} className="input-lux max-w-40 py-1" value={o.status} onChange={(e) => { setOrders(orders.map((x) => (x.id === o.id ? { ...x, status: e.target.value } : x))); toast.success("Status updated"); }}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <Badge tone={statusTone(o.status)}>{o.status}</Badge>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
