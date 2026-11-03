"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { AddMemberDialog } from "@/components/admin/add-member-dialog";
import { ListPagination } from "@/components/admin/list-pagination";
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
import { manualPaymentMethodLabels } from "@/lib/manual-payment";

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
  paymentMethod?: "stripe" | keyof typeof manualPaymentMethodLabels;
  createdAt: string;
};

async function fetchMemberships(q: string, page: number) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("page", String(page));
  const res = await fetch(`/api/admin/memberships?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load memberships");
  return res.json() as Promise<{
    items: MembershipRow[];
    total: number;
    page: number;
    limit: number;
  }>;
}

const planLabels: Record<MembershipRow["planTier"], string> = {
  single: "Single",
  family: "Family",
  life: "Life",
};

export default function MembershipsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["admin-memberships", debouncedSearch, page],
    queryFn: () => fetchMemberships(debouncedSearch, page),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Memberships</h1>
          <p className="text-sm text-muted-foreground">
            {data ? `${data.total} member${data.total === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        <AddMemberDialog onAdded={() => setPage(1)} />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
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
                      {m.paymentMethod && m.paymentMethod !== "stripe" && (
                        <div className="text-xs text-muted-foreground">
                          {manualPaymentMethodLabels[m.paymentMethod]}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{m.validTill || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {data && data.total > 0 && (
        <ListPagination
          page={page}
          totalPages={totalPages}
          disabled={isPlaceholderData}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
