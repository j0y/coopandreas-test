type NPCPlacement = { x: number; y: number; angle: number };

export function arrangeInACircle(centerx: number, centery: number, radius: number, n: number): NPCPlacement[] {
    const placements: NPCPlacement[] = [];

    for (let i = 0; i < n; i++) {
        const angleDeg = (i / n) * 360; // Evenly distribute around the circle
        const angleRad = (angleDeg * Math.PI) / 180; // Convert degrees to radians

        const x = centerx + radius * Math.cos(angleRad);
        const y = centery + radius * Math.sin(angleRad);
        const facingAngle = (angleDeg + 90) % 360; // Make sure they face the center

        placements.push({ x, y , angle: facingAngle });
    }

    return placements;
}