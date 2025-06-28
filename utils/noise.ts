// This is a port of Ken Perlin's C implementation of "classic" Perlin noise.
// It is not the newer, patented Simplex noise, but it's free to use and effective.
// Based on the reference implementation: https://mrl.cs.nyu.edu/~perlin/noise/

const p = new Uint8Array(256);
const P = new Uint8Array(512);

const initializeNoise = (() => {
    let initialized = false;
    return () => {
        if (initialized) return;

        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }

        // Shuffle p
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]]; // Swap
        }

        // Duplicate p into P to avoid overflow
        for (let i = 0; i < 256; i++) {
            P[i] = P[i + 256] = p[i];
        }
        initialized = true;
    };
})();


const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t: number, a: number, b: number) => a + t * (b - a);
const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};

export const perlinNoise = (x: number, y: number, z: number = 0): number => {
    initializeNoise();

    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = fade(x);
    const v = fade(y);
    const w = fade(z);

    const A = P[X] + Y;
    const AA = P[A] + Z;
    const AB = P[A + 1] + Z;
    const B = P[X + 1] + Y;
    const BA = P[B] + Z;
    const BB = P[B + 1] + Z;
    
    const res = lerp(w, lerp(v, lerp(u, grad(P[AA], x, y, z),
                                            grad(P[BA], x - 1, y, z)),
                                lerp(u, grad(P[AB], x, y - 1, z),
                                            grad(P[BB], x - 1, y - 1, z))),
                        lerp(v, lerp(u, grad(P[AA + 1], x, y, z - 1),
                                            grad(P[BA + 1], x - 1, y, z - 1)),
                                lerp(u, grad(P[AB + 1], x, y - 1, z - 1),
                                            grad(P[BB + 1], x - 1, y - 1, z - 1))));

    // Perlin noise returns a value in [-1, 1]. We scale it to [0, 1] for easier use.
    return (res + 1) / 2;
};
