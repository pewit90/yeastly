import { Bread } from "./bread";
import bread1JSON from '../testing/input/bread1.json';
import bread2JSON from '../testing/input/bread2.json';

const BREADS = "breads";

function readStorage(): Bread[] {
    const storageValue = localStorage.getItem(BREADS);
    if (storageValue) {
        const breadUuids = JSON.parse(storageValue) as number[];
        return breadUuids.map(uuid => Bread.fromObject(JSON.parse(localStorage.getItem(uuid.toString())!)));
    } else {
        // TODO initialize with proper default values
        const bread1 = Bread.fromObject(bread1JSON);
        const bread2 = Bread.fromObject(bread2JSON);
        const breads = [bread1, bread2];
        localStorage.setItem(BREADS, JSON.stringify([bread1.uuid, bread2.uuid]));
        breads.forEach(bread => localStorage.setItem(bread.uuid.toString(), JSON.stringify(bread)));
        return breads;
    }
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

export function updateBread(bread: Bread) {
    localStorage.setItem(bread.uuid.toString(), JSON.stringify(bread));
    breadIndex[bread.uuid] = bread;
}