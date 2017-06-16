import {Vector2} from "./vector2";

export function perpendicularVector (v: Vector2) {
    return new Vector2(-v.y, v.x);
}

export function distanceBetweenPoints (p1: Vector2, p2: Vector2) {
    return Vector2.sub(p2, p1).length();
}

export function pointDistanceToSegmentStable (a: Vector2, b: Vector2, c: Vector2) {
    const ab = Vector2.sub(b, a);
    const ac = Vector2.sub(c, a);
    const bc = Vector2.sub(c, b);
    const e = Vector2.dot(ac, ab);

    // c projects outside ab
    if (e <= 0)
        return ac.length();
    const f = Vector2.dot(ab, ab);
    if (e >= f)
        return bc.length();

    const num = Math.abs((b[0] - a[0]) * (a[1] - c[1]) - (a[0] - c[0]) * (b[1] - a[1]));
    const denum = distanceBetweenPoints(a, b);
    return num / denum;
}

// Returns 2 times the signed triangle area. The result is positive if
// abc is ccw, negative if abc is cw, zero if abc is degenerate.
export function signed2DTriArea (a: Vector2, b: Vector2, c: Vector2) {
    return (a[0] - c[0]) * (b[1] - c[1]) - (a[1] - c[1]) * (b[0] - c[0]);
}

// Returns the intersection point between two segments, null if they don't. To intersect, the segment must cross, i.e. passing on the extreme points is not intersecting.
export function test2DSegmentSegmentIntersect (a: Vector2, b: Vector2, c: Vector2, d: Vector2): Vector2|null {
    let t = 0;

    // Sign of areas correspond to which side of ab points c and d are
    const a1 = signed2DTriArea(a, b, d);
    // Compute winding of abd (+ or -)
    const a2 = signed2DTriArea(a, b, c);
    // To intersect, must have sign opposite of a1
    // If c and d are on different sides of ab, areas have different signs
    if (a1 * a2 < 0.0) {
        // Compute signs for a and b with respect to segment cd
        const a3 = signed2DTriArea(c, d, a);
        // Compute winding of cda (+ or -)
        // Since area is constant a1 - a2 = a3 - a4, or a4 = a3 + a2 - a1
        // float a4 = Signed2DTriArea(c, d, b);
        // Must have opposite sign of a3
        const a4 = a3 + a2 - a1;
        // Points a and b on different sides of cd if areas have different signs
        if (a3 * a4 < 0.0) {
            // Segments intersect. Find intersection point along L(t) = a + t * (b - a).
            // Given height h1 of an over cd and height h2 of b over cd,
            // t = h1 / (h1 - h2) =(b*h1/2) / (b*h1/2 - b*h2/2) = a3 / (a3 - a4),
            // where b (the base of the triangles cda and cdb, i.e., the length
            // of cd) cancels out.
            t = a3 / (a3 - a4);
            return Vector2.add(a, Vector2.mult(Vector2.sub(b, a), t));
        }
    }
    return null;
}

// Test if segments ab and cd overlap. If they do, compute and return
// intersection position p
export function test2DSegmentSegment (a: Vector2, b: Vector2, c: Vector2, d: Vector2, distanceThreshold: number = 0) {
    const intersection = test2DSegmentSegmentIntersect(a, b, c, d);
    if (intersection)
        return intersection;

    if (pointDistanceToSegmentStable(a, b, c) <= distanceThreshold)
        return c;

    if (pointDistanceToSegmentStable(a, b, d) <= distanceThreshold)
        return d;

    if (pointDistanceToSegmentStable(c, d, a) <= distanceThreshold)
        return a;

    if (pointDistanceToSegmentStable(c, d, b) <= distanceThreshold)
        return b;

    // Segments not intersecting
    return null;
}

/**
 * Compute the angle between segment v1v2 and v1v3
 * @export
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {Vector2} v3
 * @returns {number} Angle between 0 and pi
 */
export function angleBetweenSegments (v1: Vector2, v2: Vector2, v3: Vector2) {
    const v1v2 = Vector2.sub(v2, v1).normalize();
    const v1v3 = Vector2.sub(v3, v1).normalize();
    return Math.acos(Vector2.dot(v1v2, v1v3));
}
