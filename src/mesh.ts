import {Point} from "./point"

export class Mesh {
    constructor (public points: Point[], public shapes: number[][]) {}

    addMesh (other: Mesh): void {
        // Merge both arrays, but offset the indices of each shapes
        let oldPointsSize = this.points.length;
        for (let point of other.points) {
            this.points.push(point);
        }
        for (let shape of other.shapes) {
            let newShape = shape.map(index => index + oldPointsSize);
            this.shapes.push(newShape);
        }
    }

    static merge (meshA: Mesh, meshB: Mesh): Mesh {
        let newMesh = new Mesh(meshA.points.slice(), meshA.shapes.slice());
        newMesh.addMesh(meshB);
        return newMesh;
    }
}
