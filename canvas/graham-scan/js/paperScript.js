// CANVAS
const $canvas = document.querySelector("#myCanvas");
paper.setup($canvas, {
  width: 1000,
  height: 700,
});

let ctx = $canvas.getContext("2d");

// GLOBALS
const Point = paper.Point;
const Size = paper.Size;
const Rectangle = paper.Rectangle;
const Path = paper.Path;

const $go = document.querySelector("#go");

$go.addEventListener("click", () => {
  new Path.Rectangle({
    x: 0,
    y: 0,
    width: 1000,
    height: 500,
    fillColor: "#fff",
  });
  run();
});

// LAYER
async function run() {
  const $points = document.querySelector("#points");
  const $delay = document.querySelector("#delay");
  let points = getRandomPoints($points.value);

  points.forEach(
    (point) =>
      new Path.Circle({ center: point, radius: 2, strokeColor: "#2375ff" })
  );

  let pathPoints = await grahamScan({ points, delay: $delay.value });

  console.log("final");
  let path = createPath(pathPoints);
}

// path.smooth();

// FUNCTIONS

async function grahamScan({ points: pts, delay }) {
  let points = [...pts];
  points = pts.sort((a, b) => (a.y == b.y ? a.x - b.x : a.y - b.y));
  const initialPoint = points[0];
  const pathPoints = [initialPoint];
  points.shift();
  points.push(initialPoint);

  // sort by angle
  points = pts.sort((a, b) => {
    let o = ccw(initialPoint, a, b);
    if (o == 0) {
      return distSq(initialPoint, b) >= distSq(initialPoint, a) ? -1 : 1;
    }
    return o;
  });

  let _path = createPath(pathPoints);

  for (point of points) {
    _path.remove();
    while (
      pathPoints.length > 1 &&
      ccw(
        pathPoints[pathPoints.length - 2],
        pathPoints[pathPoints.length - 1],
        point
      ) > 0
    ) {
      pathPoints.pop();
    }

    pathPoints.push(point);
    _path = createPath(pathPoints);
    if (delay > 0) {
      console.log("delayed", delay);
      await new Promise((res) => setTimeout(() => res(true), delay));
    }
  }

  pathPoints.push(initialPoint);

  return pathPoints;
}

function ccw(p1, p2, p3) {
  let val = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
  return val;
}

function distSq(p1, p2) {
  return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

// Utility FUNCTIONS
function getRandomPoints(n) {
  let points = [];
  for (let i = 0; i < n; ++i) {
    let x = parseInt(Math.random() * 900);
    let y = parseInt(Math.random() * 500);
    points.push(new Point(x, y));
  }

  return points;
}

function createPath(points) {
  let path = new Path();
  path.strokeColor = "black";

  points.forEach((point) => {
    path.add(point);
  });

  return path;
}

// EVENTS
// function onResize(event) {
//   // Whenever the window is resized, recenter the path:
// path.position = view.center;
// }
