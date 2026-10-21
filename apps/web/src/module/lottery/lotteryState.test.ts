import assert from "node:assert/strict";
import test from "node:test";
import { PrizeType } from "../enum";
import { LotteryDataInterface, UserInterface } from "../interface";
import {
  applyWinners,
  getDrawCount,
  getNextPrizeIndex,
  getAvailableUsers,
  pickRandomUsers,
  rollbackWinners,
} from "./lotteryState";
import { secureRandomIndex } from "./secureRandom";

function makeData(): LotteryDataInterface {
  const users: UserInterface[] = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    isWin: false,
    isInPrize: false,
    order: index,
    name: `Guest ${index + 1}`,
    gift: PrizeType.none,
    date: "",
  }));

  return {
    lotteryId: "test",
    prizes: [
      { id: 0, name: "Grand Prize", amount: 100, count: 0, total: 1, type: PrizeType.specialPrize },
      { id: 1, name: "Prize", amount: 10, count: 0, total: 2, type: PrizeType.firstPrize },
    ],
    prizesCount: [1, 3],
    prizeIndex: 1,
    users,
    isShowTable: true,
    isLottery: false,
  };
}

test("allows drawing the final prize and reports completion only after it is full", () => {
  const data = makeData();
  data.prizeIndex = 0;
  assert.equal(getNextPrizeIndex(data.prizes, data.prizeIndex), 0);
  data.prizes[0].count = 1;
  assert.equal(getNextPrizeIndex(data.prizes, data.prizeIndex), -1);
});

test("caps draw count to requested amount, available users, and remaining inventory", () => {
  const data = makeData();
  assert.equal(getDrawCount(data, 1), 1);
  data.prizes[1].count = 1;
  assert.equal(getDrawCount(data, 5), 1);
  data.prizeIndex = -1;
  assert.equal(getDrawCount(data, 5), 0);
});

test("selects unique users using a deterministic random source", () => {
  const data = makeData();
  const selected = pickRandomUsers(data.users, 3, () => 0);
  assert.deepEqual(selected.map((user) => user.id), [1, 2, 3]);
  assert.equal(new Set(selected.map((user) => user.id)).size, 3);
});

test("uses an explicit sparse participant list instead of treating its max ID as a range", () => {
  const data = makeData();
  data.users[0].id = 2;
  data.users[1].id = 19;
  data.users[2].id = 100;
  assert.deepEqual(
    getAvailableUsers(data.users, 100, [2, 100]).map((user) => user.id),
    [2, 100],
  );
});

test("gives each candidate the same exact inclusion frequency across all two-pick outcomes", () => {
  const users = makeData().users;
  const inclusions = new Array(users.length).fill(0);

  for (let first = 0; first < users.length; first += 1) {
    for (let second = 0; second < users.length - 1; second += 1) {
      const choices = [first, second];
      let step = 0;
      const selected = pickRandomUsers(users, 2, () => {
        return choices[step++];
      });
      selected.forEach((user) => inclusions[user.id - 1] += 1);
    }
  }

  assert.deepEqual(inclusions, [8, 8, 8, 8, 8]);
});

test("uses rejection sampling to avoid modulo bias in secure integer selection", () => {
  const values = [0xffff_ffff, 5];
  let calls = 0;
  const result = secureRandomIndex(3, (buffer) => {
    buffer[0] = values[calls++];
  });
  assert.equal(result, 2);
  assert.equal(calls, 2);
  assert.equal(secureRandomIndex(1, () => assert.fail("no randomness needed")), 0);
});

test("applies winners and rolls back their state without changing prize inventory", () => {
  const data = makeData();
  const winners = pickRandomUsers(data.users, 2, () => 0);
  applyWinners(data, winners, 0, "2026-10-21");
  assert.deepEqual(data.users.filter((user) => user.isWin).map((user) => user.id), [1, 2]);
  assert.equal(data.users[1].order, 1);

  const inventoryBeforeRollback = data.prizes[1].count;
  rollbackWinners(data, winners.map((user) => user.id));
  assert.equal(data.users.filter((user) => user.isWin).length, 0);
  assert.equal(data.prizes[1].count, inventoryBeforeRollback);
});
