import {Vector2} from "../vector2";
import {Triangle} from "../triangle";

declare interface IDelaunay2DSolver {
    solve: (points: Vector2[], constraints?: IConstraint[]) => Triangle[];
}
