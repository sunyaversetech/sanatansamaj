import { connectToDb } from "@/lib/db";
import { Membership } from "@/lib/models/Membership.model";
import { Donation } from "@/lib/models/Donation.model";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, HeartHandshake, Wallet, UserPlus } from "lucide-react";

async function getStats() {
  await connectToDb();

  const [memberCount, donationCount, donationTotalAgg, recentMembers] = await Promise.all([
    Membership.countDocuments({ status: "paid" }),
    Donation.countDocuments({ status: "paid" }),
    Donation.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: "$currency", total: { $sum: "$amount" } } },
    ]),
    Membership.countDocuments({
      status: "paid",
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }),
  ]);

  return { memberCount, donationCount, donationTotalAgg, recentMembers };
}

export default async function AdminDashboardPage() {
  const { memberCount, donationCount, donationTotalAgg, recentMembers } = await getStats();

  const donationTotals = donationTotalAgg
    .map((d: { _id: string; total: number }) => `$${d.total.toFixed(2)} ${d._id.toUpperCase()}`)
    .join(", ") || "$0.00";

  const stats = [
    { label: "Active Members", value: memberCount, icon: Users },
    { label: "New Members (30d)", value: recentMembers, icon: UserPlus },
    { label: "Total Donations", value: donationCount, icon: HeartHandshake },
    { label: "Donations Raised", value: donationTotals, icon: Wallet },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of memberships and donations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
