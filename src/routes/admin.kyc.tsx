import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { AdminShell } from "@/components/site/AdminShell";
import { Badge, statusTone } from "@/components/site/ui";

export const Route = createFileRoute("/admin/kyc")({
  head: () => seo("KYC | Admin", "Review and approve customer KYC submissions."),
  component: Page,
});

function Page() {
  const [kyc, setKyc] = useStore("kyc");
  const [, setUsers] = useStore("users");
  const decide = (id: string, status: "Verified" | "Rejected") => {
    const entry = kyc.find((k) => k.id === id);
    setKyc(kyc.map((k) => (k.id === id ? { ...k, status } : k)));
    if (entry) setUsers((us) => us.map((u) => (u.email === entry.userEmail && u.kyc === "Pending" ? { ...u, kyc: status } : u)));
    toast.success(`KYC ${status.toLowerCase()}`);
  };
  return (
    <div className="card-lux p-6">
      <h1 className="mb-4 font-semibold">KYC Submissions</h1>
      {kyc.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr>{["Customer", "PAN", "Aadhaar", "Submitted", "Status", "Actions"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{kyc.map((k) => (
            <tr key={k.id} className="border-t">
              <td className="p-3">{k.userEmail}</td>
              <td className="p-3">{k.pan}</td>
              <td className="p-3">{k.aadhaar}</td>
              <td className="p-3">{k.date}</td>
              <td className="p-3"><Badge tone={statusTone(k.status)}>{k.status}</Badge></td>
              <td className="p-3">
                {k.status === "Pending" ? (
                  <div className="flex gap-2">
                    <button className="btn-gold px-3 py-1 text-xs" onClick={() => decide(k.id, "Verified")}>Approve</button>
                    <button className="btn-outline px-3 py-1 text-xs" onClick={() => decide(k.id, "Rejected")}>Reject</button>
                  </div>
                ) : <span className="text-xs text-muted-foreground">—</span>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
