import { LotteryDataInterface, PrizeInterface, UserInterface } from "../interface";
import Locale from "../locale";
import Util from "../util";

type ImportedParticipant = { id: number; name: string };

export async function readParticipantList(file: File): Promise<ImportedParticipant[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

  const uniqueRows = new Map<number, ImportedParticipant>();
  rows.forEach((row) => {
    const id = Number(row[Locale.Common.Number]);
    const name = String(row[Locale.Common.Name] ?? "").trim();
    if (Number.isInteger(id) && id > 0 && name) uniqueRows.set(id, { id, name });
  });
  return [...uniqueRows.values()];
}

export async function exportPrizeList(
  users: UserInterface[],
  prizes: PrizeInterface[],
): Promise<void> {
  const XLSX = await import("xlsx");
  const rows = [...users]
    .filter((user) => user.isWin)
    .sort((a, b) => b.order - a.order)
    .map((user) => {
      const prize = prizes.find((item) => item.type === user.gift);
      return {
        [Locale.Common.Number]: String(user.id),
        [Locale.Common.Name]: user.name,
        [Locale.Common.Prize]: Util.getPrizeName(user.gift),
        [Locale.Common.Gift]: prize?.name ?? "",
        [Locale.Common.Date]: user.date,
      };
    });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, Locale.Common.PrizeForm);
  XLSX.writeFile(workbook, `${Locale.Common.PrizeForm}.xlsx`, {
    cellStyles: true,
    bookType: "xlsx",
  });
}

export function applyParticipantList(
  data: LotteryDataInterface,
  rows: ImportedParticipant[],
): number[] {
  const usersById = new Map(data.users.map((user) => [user.id, user]));
  const participantIds: number[] = [];
  rows.forEach(({ id, name }) => {
    const user = usersById.get(id);
    if (!user) return;
    user.name = name;
    participantIds.push(id);
  });
  return participantIds;
}

