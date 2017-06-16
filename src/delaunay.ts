import {IDelaunay2DSolver} from "./solvers/solvers";
import {Triangle} from "./triangle";
import {Vector2} from "./vector2";

export class Delaunay2D<T extends IDelaunay2DSolver> {
    constraints: IConstraint[];
    triangles: Triangle[];
    solver: T;
    constructor (public points: Vector2[], TCreator: { new (): T; }) {
        this.solver = new TCreator();
        this.constraints = [];
    }

    addConstraint (constraint: IConstraint) {
        this.constraints.push(constraint);
    }

    solve () {
        this.triangles = this.solver.solve(this.points, this.constraints);
    }
}
