import { clearTimer, setupTimer } from "../timer-service";
import bread1JSON from "../testing/input/bread1.json";
import bread2JSON from "../testing/input/bread2.json";
import bread3JSON from "../testing/input/bread3.json";
import { Bread } from "./bread";
import { Step } from "./step";

export abstract class AbstractStorage<T, ID extends number | string> {
  private index: Record<ID, T> = {} as Record<ID, T>;

  constructor(private readonly name: string) {}

  get uuidStorageLocation(): string {
    return `${this.name}_uuids`;
  }

  private fetchUuids(): ID[] {
    return JSON.parse(localStorage.getItem(this.uuidStorageLocation) ?? "[]");
  }

  private objectStorageLocation(uuid: ID): string {
    return `${this.name}_${uuid}`;
  }

  private fetchObject(uuid: ID): T | null {
    const serializedObject = localStorage.getItem(
      this.objectStorageLocation(uuid)
    );
    return serializedObject ? this.deserialize(serializedObject) : null;
  }

  private fetchObjects(): T[] {
    const ids = this.fetchUuids();
    return ids
      .map((id) => this.fetchObject(id))
      .filter((object) => object !== null) as T[];
  }

  private buildIndex(objects: T[]) {
    return objects.reduce(
      (acc, current) => ({ ...acc, [this.idOf(current)]: current }),
      {} as Record<ID, T>
    );
  }

  storeObject(val: T): void {
    const id = this.idOf(val);
    const serialized = this.serialize(val);
    localStorage.setItem(this.objectStorageLocation(id), serialized);
    const uuids = this.fetchUuids();
    if (!uuids.includes(id)) {
      uuids.push(id);
      localStorage.setItem(this.uuidStorageLocation, JSON.stringify(uuids));
    }
  }

  protected abstract serialize(val: T): string;
  protected abstract deserialize(str: string): T;
  protected abstract initialValues(): T[];
  protected abstract idOf(val: T): ID;
}

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
    const bread3 = Bread.fromObject(bread3JSON);
    const breads = [bread1, bread2, bread3];
    setBreadUUIDs([bread1.uuid, bread2.uuid, bread3.uuid]);
    breads.forEach((bread) =>
      localStorage.setItem(bread.uuid.toString(), JSON.stringify(bread))
    );
    return breads;
  }
}

function getBreadUUIDs(): number[] {
  const breadUUIDs = localStorage.getItem(BREAD_UUIDS);
  if (!breadUUIDs) throw new Error(BREAD_UUIDS + " missing.");
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

/**
 * Add a bread to list of UUIDs, if it is not already added.
 * @param uuid The uuid of the bread
 */
function addBreadUUID(uuid: number) {
  const breadUUIDs = getBreadUUIDs();
  const index = breadUUIDs.find((val) => val === uuid);
  if (!index) setBreadUUIDs(breadUUIDs.concat(uuid));
}

const breadIndex: Record<number, Bread> = readStorage().reduce(
  (acc, current) => ({ ...acc, [current.uuid]: current }),
  {} as Record<number, Bread>
);

export function getBread(uuid: number): Bread {
  return breadIndex[uuid];
}

export function getBreads(): Bread[] {
  return Object.values(breadIndex);
}

export async function storeBread(bread: Bread) {
  localStorage.setItem(bread.uuid.toString(), JSON.stringify(bread));
  breadIndex[bread.uuid] = bread;
  addBreadUUID(bread.uuid);
  await clearTimer(bread.uuid);
  await setupTimer(bread);
}

export function deleteBread(uuid: number) {
  clearTimer(uuid);
  deleteBreadUUID(uuid);
  localStorage.removeItem(uuid.toString());
  delete breadIndex[uuid];
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
