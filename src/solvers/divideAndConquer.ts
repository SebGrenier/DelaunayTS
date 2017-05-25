import {IDelaunay2DSolver} from "./solvers";
import {Point} from "../point";
import {Triangle} from "../triangle";
import {Mesh} from "../mesh"

function pointCompare (pointA: Point, pointB: Point): number {
    if (pointA.x < pointB.x)
        return -1;
    if (pointA.x > pointB.x)
        return 1;

    if (pointA.y < pointB.y)
        return -1;
    if (pointA.y > pointB.y)
        return 1;

    return 0;
}

function pointSort (points: Point[]): Point[] {
    let copy = points.slice();
    return copy.sort(pointCompare);
}

function canSplitSets (sets: Point[][]): boolean {
    let i = 0;
    const size = sets.length;
    for (i; i < size; ++i) {
        if (sets[i].length > 3)
            return true;
    }

    return false;
}

function splitSets (sets: Point[][]): Point[][] {
    let setsCopy = sets.slice();
    let i = 0;
    let size = 0;
    let setSize = 0;
    let halfSize = 0;
    let newSets: Point[][] = [];
    while (canSplitSets(setsCopy)) {
        size = setsCopy.length;
        newSets = [];
        for (i = 0; i < size; ++i) {
            setSize = setsCopy[i].length;
            if (setSize <= 3) {
                newSets.push(setsCopy[i]);
                continue;
            }

            halfSize = Math.floor(setSize / 2);
            newSets.push(setsCopy[i].slice(0, halfSize));
            newSets.push(setsCopy[i].slice(halfSize));
        }

        setsCopy = newSets;
    }

    return setsCopy;
}

function mergeMesh (meshLeft: Mesh, meshRight: Mesh): Mesh {
    let newMesh = Mesh.merge(meshLeft, meshRight);

    return newMesh;
}

export class DivideAndConquerSolver implements IDelaunay2DSolver {
    solve (points: Point[], constraints?: IConstraint[]): Triangle[] {
        // Sort the points by their x then y coordinates
        let sortedPoints = pointSort(points);

        // Split the set of points in half, until you get sets of no more than 3 points
        let sets = [sortedPoints];
        let splittedSets = splitSets(sets);

        // Convert sets of points into sets of segments and triangles
        let shapeSets = [];
        for (let set of splittedSets) {
            let shapeSet = [];
            let mesh = new Mesh(set, [Array.apply(null, {length: set.length}).map(Number.call, Number)]);
            shapeSet.push(mesh);
            shapeSets.push(shapeSet);
        }

        // Merge the shape sets together until you have one set of shapes (hopefully the delaunay mesh)

        return [];
    }
}
