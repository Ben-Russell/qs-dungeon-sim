export interface Fightergear {
    id: string;
    damage: number;
    health: number;
    defense: number;
    crit_damage: number;
    hit: number;
    dodge: number;
    block: number;
    round_healing: number;
    burning: number;
    all_attributes: number;
    damage_reduction: number;
}

export const fightergearstats = [
    "damage",
    "health",
    "defense",
    "crit_damage",
    "hit",
    "dodge",
    "block",
    "round_healing",
    "burning",
    "all_attributes",
    "damage_reduction"
];

export const createFightergear = (gid: string):Fightergear => {
    return {
        id: gid,
        damage: 0,
        health: 0,
        defense: 0,
        crit_damage: 0,
        hit: 0,
        dodge: 0,
        block: 0,
        round_healing: 0,
        burning: 0,
        all_attributes: 0,
        damage_reduction: 0,
    }
}

/*
item_id: 12111
item_player_id: 2719
item_depth: 6
item_damage: 15000
item_health: 60000
item_defense: 0
item_crit_damage: 150
item_hit: 30000
item_dodge: 0
item_block: 0
item_round_healing: 0
item_burning: 0
item_all_attributes: 0
item_damage_reduction: 0
item_movement_regen: 2400
item_damage_tier: 4
item_health_tier: 3
item_defense_tier: 0
item_crit_damage_tier: 4
item_hit_tier: 6
item_dodge_tier: 0
item_block_tier: 0
item_round_healing_tier: 0
item_burning_tier: 0
item_all_attributes_tier: 0
item_damage_reduction_tier: 0
item_movement_regen_tier: 2

*/
