export class Vector2 {
    constructor (public x: number, public y: number) {}

    get 0 (): number { return this.x; }
    set 0 (value: number) { this.x = value; }

    get 1 (): number { return this.y; }
    set 1 (value: number) { this.y = value; }

    length (): number {
        return Vector2.dot(this, this);
    }

    normalize (): Vector2 {
        const length = this.length();
        return Vector2.div(this, length);
    }

    static add (pointA: Vector2, pointB: Vector2) {
        return new Vector2(pointA.x + pointB.x, pointA.y + pointB.y);
    }

    static sub (pointA: Vector2, pointB: Vector2) {
        return new Vector2(pointA.x - pointB.x, pointA.y - pointB.y);
    }

    static mult (point: Vector2, scalar: number) {
        return new Vector2(point.x * scalar, point.y * scalar);
    }

    static div (point: Vector2, scalar: number) {
        return new Vector2(point.x / scalar, point.y / scalar);
    }

    static dot (pointA: Vector2, pointB: Vector2) {
        return (pointA.x * pointB.x) + (pointA.y * pointB.y);
    }
}
