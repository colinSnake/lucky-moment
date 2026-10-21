import { PrizeType } from "../enum";
import { LotteryDataInterface, PrizeInterface, UserInterface } from "../interface";
import { secureRandomIndex } from "./secureRandom";

export function getAvailableUsers(
  users: UserInterface[],
  participantsCount: number,
  participantIds?: number[],
): UserInterface[] {
  const eligibleIds = participantIds ? new Set(participantIds) : null;
  return users.filter(
    (user) =>
      !user.isWin &&
      (eligibleIds ? eligibleIds.has(user.id) : user.id <= participantsCount),
  );
}

export function getNextPrizeIndex(
  prizes: PrizeInterface[],
  startIndex: number,
): number {
  let index = Math.min(startIndex, prizes.length - 1);
  while (index >= 0 && prizes[index].count >= prizes[index].total) index -= 1;
  return index;
}

export function getDrawCount(
  data: Pick<LotteryDataInterface, "prizes" | "prizesCount" | "prizeIndex">,
  availableCount: number,
): number {
  if (data.prizeIndex < 0 || !data.prizes[data.prizeIndex]) return 0;
  const requested = data.prizesCount[data.prizeIndex] ?? 0;
  const remainingPrizeCount = Math.max(
    0,
    data.prizes[data.prizeIndex]?.total - data.prizes[data.prizeIndex]?.count,
  );
  return Math.min(requested, availableCount, remainingPrizeCount);
}

export function pickRandomUsers(
  users: UserInterface[],
  count: number,
  randomIndex: (maxExclusive: number) => number = secureRandomIndex,
): UserInterface[] {
  const pool = [...users];
  const selected: UserInterface[] = [];
  const targetCount = Math.min(Math.max(0, count), pool.length);

  for (let index = 0; index < targetCount; index += 1) {
    const selectedIndex = index + randomIndex(pool.length - index);
    [pool[index], pool[selectedIndex]] = [pool[selectedIndex], pool[index]];
    selected.push(pool[index]);
  }
  return selected;
}

export function applyWinners(
  data: LotteryDataInterface,
  selectedUsers: UserInterface[],
  orderStart: number,
  date: string,
): void {
  const prize = data.prizes[data.prizeIndex];

  selectedUsers.forEach((user, index) => {
    user.isWin = true;
    user.isInPrize = true;
    user.gift = prize.type;
    user.order = orderStart + index;
    user.date = date;
  });
}

export function rollbackWinners(
  data: LotteryDataInterface,
  selectedIds: number[],
): void {
  const ids = new Set(selectedIds);
  data.users.forEach((user) => {
    if (!ids.has(user.id)) return;
    user.isWin = false;
    user.isInPrize = false;
    user.gift = PrizeType.none;
    user.date = "";
  });
}

