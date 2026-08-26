"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";

type MembershipRow = {
  _id: string;
  membershipId?: string;
  fullName: string;
  email: string;
  telephone: string;
  planTier: "single" | "family" | "life";
  status: "pending" | "paid";
  amountPaid: number;
  currency: string;
  validTill?: string;
  isRenewal: boolean;
  createdAt: string;
};

async function fetchMemberships(q: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  const res = await fetch(`/api/admin/memberships?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load memberships");
  return res.json() as Promise<{ items: MembershipRow[]; total: number }>;
}

const planLabels: Record<MembershipRow["planTier"], string> = {
  single: "Single",
  family: "Family",
  life: "Life",
};

export default function MembershipsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-memberships", debouncedSearch],
    queryFn: () => fetchMemberships(debouncedSearch),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Memberships</h1>
        <p className="text-sm text-muted-foreground">
          {data ? `${data.total} member${data.total === 1 ? "" : "s"}` : "Loading…"}
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membership ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Valid Till</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                )}
                {isError && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-destructive">
                      Failed to load memberships.
                    </TableCell>
                  </TableRow>
                )}
                {data && data.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No memberships found.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((m) => (
                  <TableRow key={m._id}>
                    <TableCell className="font-medium">{m.membershipId || "—"}</TableCell>
                    <TableCell>{m.fullName}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>{planLabels[m.planTier]}</TableCell>
                    <TableCell>
                      <Badge variant={m.status === "paid" ? "default" : "secondary"}>
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${m.amountPaid?.toFixed(2)} {m.currency?.toUpperCase()}
                    </TableCell>
                    <TableCell>{m.validTill || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
