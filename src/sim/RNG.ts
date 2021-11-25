function Rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function RollChance(percent) {
    let roll = Rand(1, 10000);
    if (roll < percent * 100) {
        return true;
    }
    return false;
}

const RNG = {
    Rand: Rand,
    RollChance: RollChance
};

export default RNG;
