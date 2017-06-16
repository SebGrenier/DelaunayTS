import {Point} from "./point";

export class Mesh {
    constructor (public points: Point[], public shapes: number[][]) {}

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

    static merge (meshA: Mesh, meshB: Mesh): Mesh {
        const newMesh = new Mesh(meshA.points.slice(), meshA.shapes.slice());
        newMesh.addMesh(meshB);
        return newMesh;
    }
}
