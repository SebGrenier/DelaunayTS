import * as mathUtils from "./math-utils";
import {Vector2} from "./vector2";

export class Mesh {
    constructor (public points: Vector2[], public shapes: number[][]) {}

    addMesh (other: Mesh): void {
        // Merge both arrays, but offset the indices of each shapes
        const oldPointsSize = this.points.length;
        for (const point of other.points) {
            this.points.push(point);
        }
        for (const shape of other.shapes) {
            const newShape = shape.map(index => index + oldPointsSize);
            this.shapes.push(newShape);
        }
    }

    getOrderedPoints (sortFunc: (pointA: Vector2, pointB: Vector2) => number) {
        const copy = this.points.slice();
        return copy.sort(sortFunc);
    }

    segmentIntersectMesh (pointA: Vector2, pointB: Vector2): boolean {
        for (const shape of this.shapes) {
            if (shape.length === 2) {
                const pointC = this.points[shape[0]];
                const pointD = this.points[shape[1]];
                if (mathUtils.test2DSegmentSegmentIntersect(pointA, pointB, pointC, pointD))
                    return true;
            } else {
                for (let i = 0; i < shape.length; ++i) {
                    const pointC = this.points[shape[i]];
                    const pointD = this.points[shape[(i + 1) % shape.length]];
                    if (mathUtils.test2DSegmentSegmentIntersect(pointA, pointB, pointC, pointD))
                        return true;
                }
            }
        }

        return false;
    }

    getIndexOfPoint (point: Vector2) {
        return this.points.findIndex((p) => {
            return p.x === point.x && p.y === point.y;
        });
    }

    getPointsConnectedToPoint (point: Vector2): Vector2[] {
        const pointIndex = this.getIndexOfPoint(point);
        const connectedIndices = [];
        for (const shape of this.shapes) {
            if (shape.indexOf(pointIndex) > -1) {
                for (const index of shape) {
                    if (index !== pointIndex && connectedIndices.indexOf(index) === -1)
                        connectedIndices.push(index);
                }
            }
        }

        return connectedIndices.map((index) => this.points[index]);
    }

    static merge (meshA: Mesh, meshB: Mesh): Mesh {
        const newMesh = new Mesh(meshA.points.slice(), meshA.shapes.slice());
        newMesh.addMesh(meshB);
        return newMesh;
    }
}
