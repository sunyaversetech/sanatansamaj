import { ImageResponse } from "next/og";
import { orgInfo } from "@/lib/site-data";
import { getLogoDataUri } from "@/lib/logo";
import type { MembershipApplication } from "@/lib/membership-schema";

const CARD_WIDTH = 1050;
const CARD_HEIGHT = 660;

const GOLD = "#c9962c";
const GOLD_DARK = "#7d5817";
const INK = "#1b1712";

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function membershipPeriod(planTier: MembershipApplication["planTier"], signOffDate: string) {
  if (planTier === "life") {
    const year = new Date(`${signOffDate}T00:00:00`).getFullYear();
    return { label: "MEMBER SINCE", value: Number.isNaN(year) ? signOffDate : String(year) };
  }
  const start = new Date(`${signOffDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) {
    return { label: "VALID", value: "1 Year from Purchase" };
  }
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  return {
    label: "VALID",
    value: `${formatDate(signOffDate)} — ${new Intl.DateTimeFormat("en-AU", { day: "2-digit", month: "short", year: "numeric" }).format(end)}`,
  };
}

export async function renderMembershipCardPng(data: {
  membershipId: string;
  fullName: string;
  planLabel: string;
  planTier: MembershipApplication["planTier"];
  signOffDate: string;
}): Promise<Buffer> {
  const period = membershipPeriod(data.planTier, data.signOffDate);

  const image = new ImageResponse(
    (
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          backgroundColor: GOLD,
          backgroundImage: `linear-gradient(135deg, ${GOLD} 0%, #dba93a 55%, ${GOLD} 100%)`,
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img
              src={getLogoDataUri()}
              width={72}
              height={72}
              style={{ borderRadius: 999, backgroundColor: INK, padding: 6 }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: INK, letterSpacing: -0.5 }}>
                {orgInfo.name}
              </div>
              <div style={{ fontSize: 16, color: GOLD_DARK, letterSpacing: 2 }}>
                MEMBERSHIP CARD
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              borderRadius: 999,
              backgroundColor: INK,
              color: GOLD,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {data.planLabel}
          </div>
        </div>

        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 18, color: GOLD_DARK, letterSpacing: 2, marginBottom: 6 }}>
            NAME
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: INK, letterSpacing: -1 }}>
            {data.fullName}
          </div>
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, color: GOLD_DARK, letterSpacing: 2, marginBottom: 6 }}>
              MEMBERSHIP NUMBER
            </div>
            <div style={{ fontSize: 38, fontWeight: 700, color: INK, letterSpacing: 1 }}>
              {data.membershipId}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: 18, color: GOLD_DARK, letterSpacing: 2, marginBottom: 6 }}>
              {period.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: INK }}>{period.value}</div>
          </div>
        </div>
      </div>
    ),
    { width: CARD_WIDTH, height: CARD_HEIGHT },
  );

  const arrayBuffer = await image.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
