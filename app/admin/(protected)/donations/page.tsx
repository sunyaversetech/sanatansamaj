"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
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

type DonationRow = {
  _id: string;
  fullName: string;
  email: string;
  amount: number;
  currency: string;
  isAnonymous: boolean;
  status: "pending" | "paid";
  createdAt: string;
};

async function fetchDonations(q: string, page: number) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("page", String(page));
  const res = await fetch(`/api/admin/donations?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load donations");
  return res.json() as Promise<{
    items: DonationRow[];
    total: number;
    page: number;
    limit: number;
  }>;
}

export default function DonationsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["admin-donations", debouncedSearch, page],
    queryFn: () => fetchDonations(debouncedSearch, page),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Donations</h1>
        <p className="text-sm text-muted-foreground">
          {data ? `${data.total} donation${data.total === 1 ? "" : "s"}` : "Loading…"}
        </p>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Anonymous</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                )}
                {isError && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-destructive">
                      Failed to load donations.
                    </TableCell>
                  </TableRow>
                )}
                {data && data.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No donations found.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((d) => (
                  <TableRow key={d._id}>
                    <TableCell className="font-medium">{d.fullName}</TableCell>
                    <TableCell>{d.email}</TableCell>
                    <TableCell>
                      ${d.amount?.toFixed(2)} {d.currency?.toUpperCase()}
                    </TableCell>
                    <TableCell>{d.isAnonymous ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Badge variant={d.status === "paid" ? "default" : "secondary"}>
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(d.createdAt).toLocaleDateString()}</TableCell>
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
