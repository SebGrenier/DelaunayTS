import _ = require("lodash");
import * as mathUtils from "../math-utils";
import {Mesh} from "../mesh";
import {Triangle} from "../triangle";
import {Vector2} from "../vector2";
import {IDelaunay2DSolver} from "./solvers";

function pointCompare (pointA: Vector2, pointB: Vector2): number {
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

function pointSort (points: Vector2[]): Vector2[] {
    const copy = points.slice();
    return copy.sort(pointCompare);
}

function leftSort (pointA: Vector2, pointB: Vector2): number {
    if (pointA.y < pointB.y)
        return -1;
    if (pointA.y > pointB.y)
        return 1;

    if (pointA.x < pointB.x)
        return 1;
    if (pointA.x > pointB.x)
        return -1;

    return 0;
}

function rightSort (pointA: Vector2, pointB: Vector2): number {
    if (pointA.y < pointB.y)
        return -1;
    if (pointA.y > pointB.y)
        return 1;

    if (pointA.x < pointB.x)
        return -1;
    if (pointA.x > pointB.x)
        return 1;

    return 0;
}

function mergeMesh (meshLeft: Mesh, meshRight: Mesh): Mesh {
    return Mesh.merge(meshLeft, meshRight);
}

class MeshTree {
    leftChild: MeshTree|null;
    rightChild: MeshTree|null;
    mesh: Mesh|null;
    constructor (points: Vector2[]) {
        this.leftChild = null;
        this.rightChild = null;
        this.mesh = null;

        // Split points into two groups if applicable
        const pointsLength = points.length;
        if (pointsLength > 3) {
            const halfLength = Math.floor(pointsLength / 2);
            this.leftChild = new MeshTree(points.slice(0, halfLength));
            this.rightChild = new MeshTree(points.slice(halfLength));
        } else {
            this.mesh = new Mesh(points, [Array.apply(null, {length: points.length}).map(Number.call, Number)]);
        }
    }

    canMerge (): boolean {
        return !!this.leftChild && !!this.rightChild;
    }

    merge (): void {
        if (!this.leftChild || !this.rightChild)
            return;

        if (this.leftChild && this.leftChild.canMerge())
            this.leftChild.merge();
        if (this.rightChild && this.rightChild.canMerge())
            this.rightChild.merge();

        const leftMesh = this.leftChild.getMesh() as Mesh;
        const rightMesh = this.rightChild.getMesh() as Mesh;
        const mesh = mergeMesh(leftMesh, rightMesh);

        // Find the base LR edge
        const orderedLeftPoints = leftMesh.getOrderedPoints(leftSort);
        const orderedRightPoints = rightMesh.getOrderedPoints(rightSort);

        const LRBaseEdge = {
            left: null as Vector2,
            right: null as Vector2
        };

        findEdgeBlock: for (const leftPoint of orderedLeftPoints) {
            for (const rightPoint of orderedRightPoints) {
                if (!leftMesh.segmentIntersectMesh(leftPoint, rightPoint) && !rightMesh.segmentIntersectMesh(leftPoint, rightPoint)) {
                    LRBaseEdge.left = leftPoint;
                    LRBaseEdge.right = rightPoint;
                    break findEdgeBlock;
                }
            }
        }

        if (!LRBaseEdge.left || !LRBaseEdge.right)
            throw new Error("Could not find base LR edge");

        const newShape = [
            mesh.getIndexOfPoint(LRBaseEdge.left),
            mesh.getIndexOfPoint(LRBaseEdge.right)
        ];

        while (true) {
            // Find right candidate
            const connectedPoints: Vector2[] = mesh.getPointsConnectedToPoint(LRBaseEdge.right);
            const angles: number[] = connectedPoints.map((p: Vector2) => mathUtils.angleBetweenSegments(LRBaseEdge.right, p, LRBaseEdge.left));
            const angleAndPoints = _.zip<any>(angles, connectedPoints) as Array<[number, Vector2]>;
            const sortedAnglesAndPoints = _.sortBy(angleAndPoints, (anp) => anp[0]);
            const [sortedAngles, sortedPoints] = _.unzip(sortedAnglesAndPoints);

            let potentialRightCandidate = null;
            for (let i = 0; i < sortedPoints.length; ++i) {
                if (sortedAngles[i] >= Math.PI) {
                    potentialRightCandidate = null;
                    break;
                }
            }

            break;
        }

        this.mesh = mesh;
        this.leftChild = null;
        this.rightChild = null;
    }

    getMesh (): Mesh|null {
        return this.mesh;
    }
}

export class DivideAndConquerSolver implements IDelaunay2DSolver {
    solve (points: Vector2[], constraints?: IConstraint[]): Triangle[] {
        // Sort the points by their x then y coordinates
        const sortedPoints = pointSort(points);

        // Split the set of points into a tree of meshes that can be merged.
        const meshTree = new MeshTree(sortedPoints);

        // Merge the subtrees together to get a final mesh
        if (meshTree.canMerge()) {
            meshTree.merge();
        }

        const mesh = meshTree.getMesh();

        return [];
    }
}
