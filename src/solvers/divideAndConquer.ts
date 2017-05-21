import {IDelaunay2DSolver} from "./solvers";
import {Point} from "../point";
export class DivideAndConquerSolver implements IDelaunay2DSolver {
    solve (points: Point[], constraints?: IConstraint[]) {
        return [];
    }
}
