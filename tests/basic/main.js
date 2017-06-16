require(['delaunay/vector2', 'delaunay/solvers/divideAndConquer', 'delaunay/delaunay'], (vector2, divideAndConquer, delaunay2D) => {
    'use strict';

    const Vector2 = vector2.Vector2;
    const DivideAndConquerSolver = divideAndConquer.DivideAndConquerSolver;
    const Delaunay2D = delaunay2D.Delaunay2D;

    let points = [];
    for (let i = 0; i < 2; ++i) {
        for (let j = 0; j < 2; ++j) {
            points.push(new Vector2(j, i));
        }
    }

    let delauneyMesher = new Delaunay2D(points, DivideAndConquerSolver);
    delauneyMesher.solve();
});
