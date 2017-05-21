import {Point} from "../point";
import {Triangle} from "../triangle";

declare interface IDelaunay2DSolver {
    solve: (points: Point[], constraints?: IConstraint[]) => Triangle[]
}