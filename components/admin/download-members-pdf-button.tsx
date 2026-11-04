"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadMembersPdfButton() {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/admin/memberships/export");
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Could not create the members list");
      }

      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `members-list-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Members PDF error:", err);
      toast.error("Could not download the PDF", {
        description:
          err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleDownload} disabled={downloading}>
      {downloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Download PDF
    </Button>
  );
}
