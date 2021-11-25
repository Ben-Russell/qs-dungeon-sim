export interface Fighter {
    id: string;
    type: number;
    health: number;
    damage: number;
    defense: number;
    critdamage: number;
    hit: number;
    dodge: number;
    item_id?: string;
}

// just kinda a default fighter constructor
export function createFighter(id: number, data = {}): Fighter {
    return {
        id: id.toString(),
        type: 1,
        health: 0,
        damage: 0,
        defense: 0,
        critdamage: 0,
        hit: 0,
        dodge: 0,
        ...data
    };
}

export enum FighterClasses {
    Assassin = 0,
    Brawler = 1,
    Cavalry = 2,
    Healer = 3,
    Hunter = 4,
    Knight = 5,
    Mage = 6,
    Priest = 7,
    Tank = 8,
    Warrior = 9,
    Wizard = 10,

    CaveFighter = 98,
    Monster = 99
}
