import { Bread, toBread } from "./bread";
import bread1JSON from '../testing/input/bread1.json';
import bread2JSON from '../testing/input/bread2.json';

const bread1 = toBread(bread1JSON);
const bread2 = toBread(bread2JSON);

const breads: Record<number, Bread> = {
    [bread1.uuid]: bread1,
    [bread2.uuid]: bread2,
}

export function getBread(uuid: number): Bread {
    return breads[uuid];
}

