// ============================================================
// MMA LIFE DYNASTY
// CORE — RNG
// ============================================================
//
// Centralized Random Number Generator.
//
// IMPORTANT:
// Every system that needs randomness should use this module.
// This keeps the simulation predictable, testable and easier
// to balance in future updates.
// ============================================================


// ============================================================
// RANDOM NUMBER GENERATOR
// ============================================================

export class RNG {

    constructor(seed = Date.now()) {

        this.seed = normalizeSeed(seed);

        this.initialSeed = this.seed;

        this.calls = 0;
    }


    // --------------------------------------------------------
    // Generate next pseudo-random number between 0 and 1
    // --------------------------------------------------------

    next() {

        let value = this.seed;

        value += 0x6D2B79F5;

        let t = value;

        t = Math.imul(
            t ^ (t >>> 15),
            t | 1
        );

        t ^= t + Math.imul(
            t ^ (t >>> 7),
            t | 61
        );

        const result =
            ((t ^ (t >>> 14)) >>> 0) / 4294967296;

        this.seed = value >>> 0;

        this.calls++;

        return result;
    }


    // --------------------------------------------------------
    // Integer between min and max
    // --------------------------------------------------------

    int(min, max) {

        min = Math.ceil(min);

        max = Math.floor(max);

        if (max < min) {

            throw new Error(
                "RNG.int(): max must be greater than or equal to min."
            );
        }

        return Math.floor(
            this.next() * (max - min + 1)
        ) + min;
    }


    // --------------------------------------------------------
    // Floating point number
    // --------------------------------------------------------

    float(min = 0, max = 1) {

        if (max < min) {

            throw new Error(
                "RNG.float(): max must be greater than or equal to min."
            );
        }

        return (
            this.next() * (max - min)
        ) + min;
    }


    // --------------------------------------------------------
    // Percentage chance
    //
    // chance(50) = 50% chance
    // chance(10) = 10% chance
    // --------------------------------------------------------

    chance(percent) {

        if (percent <= 0) {

            return false;
        }

        if (percent >= 100) {

            return true;
        }

        return this.next() * 100 < percent;
    }


    // --------------------------------------------------------
    // Pick random item from array
    // --------------------------------------------------------

    pick(array) {

        if (!Array.isArray(array) || array.length === 0) {

            return null;
        }

        return array[
            this.int(0, array.length - 1)
        ];
    }


    // --------------------------------------------------------
    // Shuffle array
    // --------------------------------------------------------

    shuffle(array) {

        if (!Array.isArray(array)) {

            return [];
        }

        const result = [...array];

        for (
            let i = result.length - 1;
            i > 0;
            i--
        ) {

            const j = this.int(0, i);

            [
                result[i],
                result[j]
            ] = [
                result[j],
                result[i]
            ];
        }

        return result;
    }


    // --------------------------------------------------------
    // Weighted random selection
    //
    // Example:
    //
    // rng.weighted([
    //     { value: "KO", weight: 30 },
    //     { value: "Decision", weight: 70 }
    // ]);
    // --------------------------------------------------------

    weighted(items) {

        if (!Array.isArray(items) || items.length === 0) {

            return null;
        }

        const validItems = items.filter(item => {

            return (
                item &&
                typeof item.weight === "number" &&
                item.weight > 0
            );
        });

        if (validItems.length === 0) {

            return null;
        }

        const totalWeight = validItems.reduce(
            (total, item) => total + item.weight,
            0
        );

        let roll = this.float(0, totalWeight);

        for (const item of validItems) {

            roll -= item.weight;

            if (roll <= 0) {

                return item.value;
            }
        }

        return validItems[
            validItems.length - 1
        ].value;
    }


    // --------------------------------------------------------
    // Normal distribution approximation
    //
    // Useful for generating realistic attributes where most
    // fighters should be around an average rather than equally
    // distributed.
    // --------------------------------------------------------

    normal(mean = 0, deviation = 1) {

        let u = 0;

        let v = 0;

        while (u === 0) {

            u = this.next();
        }

        while (v === 0) {

            v = this.next();
        }

        const standardNormal =
            Math.sqrt(-2 * Math.log(u)) *
            Math.cos(2 * Math.PI * v);

        return (
            mean +
            standardNormal * deviation
        );
    }


    // --------------------------------------------------------
    // Clamp random result to range
    // --------------------------------------------------------

    normalInt(
        mean,
        deviation,
        min,
        max
    ) {

        const value = Math.round(
            this.normal(mean, deviation)
        );

        return clamp(value, min, max);
    }


    // --------------------------------------------------------
    // Save RNG state
    // --------------------------------------------------------

    getState() {

        return {

            seed: this.seed,

            initialSeed: this.initialSeed,

            calls: this.calls
        };
    }


    // --------------------------------------------------------
    // Restore RNG state
    // --------------------------------------------------------

    setState(state) {

        if (!state) {

            return;
        }

        if (
            typeof state.seed === "number"
        ) {

            this.seed = normalizeSeed(
                state.seed
            );
        }

        if (
            typeof state.initialSeed === "number"
        ) {

            this.initialSeed =
                normalizeSeed(
                    state.initialSeed
                );
        }

        if (
            typeof state.calls === "number"
        ) {

            this.calls = state.calls;
        }
    }


    // --------------------------------------------------------
    // Reset RNG
    // --------------------------------------------------------

    reset(seed = this.initialSeed) {

        this.seed = normalizeSeed(seed);

        this.calls = 0;
    }
}


// ============================================================
// DEFAULT RNG INSTANCE
// ============================================================

export const rng = new RNG();


// ============================================================
// HELPER FUNCTIONS
// ============================================================


// ------------------------------------------------------------
// Normalize seed
// ------------------------------------------------------------

function normalizeSeed(seed) {

    if (
        typeof seed !== "number" ||
        !Number.isFinite(seed)
    ) {

        seed = Date.now();
    }

    return (
        Math.abs(
            Math.floor(seed)
        ) >>> 0
    );
}


// ------------------------------------------------------------
// Clamp value
// ------------------------------------------------------------

export function clamp(
    value,
    min,
    max
) {

    return Math.min(
        Math.max(value, min),
        max
    );
}


// ============================================================
// CONVENIENCE FUNCTIONS
// ============================================================


// ------------------------------------------------------------
// Random integer
// ------------------------------------------------------------

export function randomInt(min, max) {

    return rng.int(min, max);
}


// ------------------------------------------------------------
// Random float
// ------------------------------------------------------------

export function randomFloat(min, max) {

    return rng.float(min, max);
}


// ------------------------------------------------------------
// Percentage chance
// ------------------------------------------------------------

export function randomChance(percent) {

    return rng.chance(percent);
}


// ------------------------------------------------------------
// Random array item
// ------------------------------------------------------------

export function randomPick(array) {

    return rng.pick(array);
}


// ------------------------------------------------------------
// Random weighted item
// ------------------------------------------------------------

export function randomWeighted(items) {

    return rng.weighted(items);
}


// ============================================================
// END OF RNG
// ============================================================
