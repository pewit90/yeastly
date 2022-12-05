import { Bread } from "./bread";
import { Step } from "./step";
import bread1JSON from "../testing/input/bread1.json";
import bread2JSON from "../testing/input/bread2.json";

const BREAD_UUIDS = "bread_uuids";

function readStorage(): Bread[] {
  const storageValue = localStorage.getItem(BREAD_UUIDS);
  if (storageValue) {
    const breadUuids = JSON.parse(storageValue) as number[];
    return breadUuids.map((uuid) =>
      Bread.fromObject(JSON.parse(localStorage.getItem(uuid.toString())!))
    );
  } else {
    // TODO initialize with proper default values
    const bread1 = Bread.fromObject(bread1JSON);
    const bread2 = Bread.fromObject(bread2JSON);
    const breads = [bread1, bread2];
    setBreadUUIDs([bread1.uuid, bread2.uuid]);
    breads.forEach((bread) =>
      localStorage.setItem(bread.uuid.toString(), JSON.stringify(bread))
    );
    return breads;
  }
}

function getBreadUUIDs(): number[] {
  const breadUUIDs = localStorage.getItem(BREAD_UUIDS);
  if (!breadUUIDs) throw new Error("breadUUIDs missing.");
  return JSON.parse(breadUUIDs) as number[];
}

function setBreadUUIDs(uuids: number[]) {
  localStorage.setItem(BREAD_UUIDS, JSON.stringify(uuids));
}

function deleteBreadUUID(uuid: number) {
  const breadUUIDs = getBreadUUIDs();
  const index = breadUUIDs.indexOf(uuid);
  if (index > -1) breadUUIDs.splice(index, 1);
  setBreadUUIDs(breadUUIDs);
}

function addBreadUUID(uuid: number) {
  const breadUUIDs = getBreadUUIDs();
  setBreadUUIDs(breadUUIDs.concat(uuid));
}

const breadIndex: Record<number, Bread> = readStorage().reduce(
  (acc, current) => ({ ...acc, [current.uuid]: current }),
  {} as Record<number, Bread>
);

export function getBread(uuid: number): Bread {
  return breadIndex[uuid];
}

export function getBreads(): Bread[] {
  console.log("getBreads " + JSON.stringify(Object.values(breadIndex)));
  return Object.values(breadIndex);
}

export function storeBread(bread: Bread) {
  localStorage.setItem(bread.uuid.toString(), JSON.stringify(bread));
  breadIndex[bread.uuid] = bread;
  addBreadUUID(bread.uuid);
}

export function deleteBread(uuid: number) {
  deleteBreadUUID(uuid);
  localStorage.removeItem(uuid.toString());
  console.info("Deleted " + uuid);
}

export function createAndStoreBread(name?: string, steps?: Step[]) {
  const timestamp = new Date();
  const bread = new Bread(
    timestamp.getTime(),
    name ?? "New Bread",
    steps ?? [],
    timestamp
  );
  storeBread(bread);
  return bread;
}
