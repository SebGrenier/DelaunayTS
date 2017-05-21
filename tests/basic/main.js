require(['delaunay/point', 'delaunay/solvers/divideAndConquer', 'delaunay/delaunay'], (point, divideAndConquer, delaunay2D) => {
    'use strict';

    const Point = point.Point;
    const DivideAndConquerSolver = divideAndConquer.DivideAndConquerSolver;
    const Delaunay2D = delaunay2D.Delaunay2D;

    let points = [];
    for (let i = 0; i < 2; ++i) {
        for (let j = 0; j < 2; ++j) {
            points.push(new Point(j, i));
        }
    }

    let delauneyMesher = new Delaunay2D(points, DivideAndConquerSolver);
    delauneyMesher.solve();
});
