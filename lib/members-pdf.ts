import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getLogoDataUri } from "@/lib/logo";
import { orgInfo } from "@/lib/site-data";

const GOLD_DARK = "#7d5817";
const INK = "#1b1712";
const MUTED = "#6b6459";
const ROW_SHADE = "#faf5ea";

const MARGIN = 14;
const LOGO_SIZE = 18;

export type MembersPdfRow = {
  fullName: string;
  email: string;
  planLabel: string;
  validTill: string;
};

// The built-in PDF fonts only cover Western characters, and anything else comes
// out as unrelated symbols. A clear placeholder is safer on a members record
// than a name that looks real but is wrong.
const UNPRINTABLE = /[^\x20-\x7e\xa0-\xff–—‘’“”]/;

function printableName(fullName: string) {
  return UNPRINTABLE.test(fullName) ? "(Name can't be shown here - see email)" : fullName;
}

export function renderMembersPdf(rows: MembersPdfRow[], generatedOn: string): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const textX = MARGIN + LOGO_SIZE + 4;

  doc.addImage(getLogoDataUri(), "PNG", MARGIN, MARGIN, LOGO_SIZE, LOGO_SIZE);

  doc.setTextColor(INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(orgInfo.name, textX, MARGIN + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Members List", textX, MARGIN + 13);

  doc.setTextColor(MUTED);
  doc.setFontSize(9);
  doc.text(`Generated on ${generatedOn}`, textX, MARGIN + 18);

  doc.setTextColor(GOLD_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total Members: ${rows.length}`, MARGIN, MARGIN + LOGO_SIZE + 9);

  autoTable(doc, {
    startY: MARGIN + LOGO_SIZE + 13,
    margin: { left: MARGIN, right: MARGIN, top: MARGIN, bottom: 16 },
    head: [["Name", "Email", "Membership Plan", "Valid Till"]],
    body: rows.map((r) => [printableName(r.fullName), r.email, r.planLabel, r.validTill]),
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.5, textColor: INK, overflow: "linebreak" },
    headStyles: { fillColor: GOLD_DARK, textColor: "#ffffff", fontStyle: "bold" },
    alternateRowStyles: { fillColor: ROW_SHADE },
    // Fixed widths so one very long email wraps instead of squeezing the others.
    columnStyles: {
      0: { cellWidth: 54 },
      1: { cellWidth: 62 },
      2: { cellWidth: 44 },
      3: { cellWidth: 22 },
    },
  });

  // The page count is only known once the table has been laid out.
  const pageCount = doc.getNumberOfPages();
  doc.setTextColor(MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - MARGIN, pageHeight - 8, { align: "right" });
  }

  return Buffer.from(doc.output("arraybuffer"));
}
