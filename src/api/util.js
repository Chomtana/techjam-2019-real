function circle_intersection(x0, y0, r0, x1, y1, r1) {
  var a, dx, dy, d, h, rx, ry;
  var x2, y2;

  /* dx and dy are the vertical and horizontal distances between
   * the circle centers.
   */
  dx = x1 - x0;
  dy = y1 - y0;

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt((dy*dy) + (dx*dx));

  /* Check for solvability. */
  if (d > (r0 + r1)) {
      /* no solution. circles do not intersect. */
      return false;
  }
  if (d < Math.abs(r0 - r1)) {
      /* no solution. one circle is contained in the other */
      return false;
  }

  /* 'point 2' is the point where the line through the circle
   * intersection points crosses the line between the circle
   * centers.  
   */

  /* Determine the distance from point 0 to point 2. */
  a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

  /* Determine the coordinates of point 2. */
  x2 = x0 + (dx * a/d);
  y2 = y0 + (dy * a/d);

  /* Determine the distance from point 2 to either of the
   * intersection points.
   */
  h = Math.sqrt((r0*r0) - (a*a));

  /* Now determine the offsets of the intersection points from
   * point 2.
   */
  rx = -dy * (h/d);
  ry = dx * (h/d);

  /* Determine the absolute intersection points. */
  var xi = x2 + rx;
  var xi_prime = x2 - rx;
  var yi = y2 + ry;
  var yi_prime = y2 - ry;

  return [[xi, yi], [xi_prime, yi_prime]];
}

function three_circles_intersection(x0, y0, r0, x1, y1, r1, x2, y2, r2){
  let a, dx, dy, d, h, rx, ry;
  let point2_x, point2_y;
  let EPSILON = 1e-4;
  /* dx and dy are the vertical and horizontal distances between
  * the circle centers.
  */
  dx = x1 - x0;
  dy = y1 - y0;

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt((dy*dy) + (dx*dx));

  /* Check for solvability. */
  if (d > (r0 + r1))
  {
    /* no solution. circles do not intersect. */
    return false;
  }
  if (d < Math.abs(r0 - r1))
  {
    /* no solution. one circle is contained in the other */
    return false;
  }

  /* 'point 2' is the point where the line through the circle
  * intersection points crosses the line between the circle
  * centers.
  */

  /* Determine the distance from point 0 to point 2. */
  a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

  /* Determine the coordinates of point 2. */
  point2_x = x0 + (dx * a/d);
  point2_y = y0 + (dy * a/d);

  /* Determine the distance from point 2 to either of the
  * intersection points.
  */
  h = Math.sqrt((r0*r0) - (a*a));

  /* Now determine the offsets of the intersection points from
  * point 2.
  */
  rx = -dy * (h/d);
  ry = dx * (h/d);

  /* Determine the absolute intersection points. */
  let intersectionPoint1_x = point2_x + rx;
  let intersectionPoint2_x = point2_x - rx;
  let intersectionPoint1_y = point2_y + ry;
  let intersectionPoint2_y = point2_y - ry;

  // Log.d("INTERSECTION Circle1 AND Circle2:", "(" + intersectionPoint1_x + "," + intersectionPoint1_y + ")" + " AND (" + intersectionPoint2_x + "," + intersectionPoint2_y + ")");

  /* Lets determine if circle 3 intersects at either of the above intersection points. */
  dx = intersectionPoint1_x - x2;
  dy = intersectionPoint1_y - y2;
  let d1 = Math.sqrt((dy*dy) + (dx*dx));

  dx = intersectionPoint2_x - x2;
  dy = intersectionPoint2_y - y2;
  let d2 = Math.sqrt((dy*dy) + (dx*dx));

  if(Math.abs(d1 - r2) < EPSILON) {
    // Log.d("INTERSECTION Circle1 AND Circle2 AND Circle3:", "(" + intersectionPoint1_x + "," + intersectionPoint1_y + ")");
    return {
      "x" : intersectionPoint1_x,
      "y" : intersectionPoint1_y
    }
  }
  else if(Math.abs(d2 - r2) < EPSILON) {
    // Log.d("INTERSECTION Circle1 AND Circle2 AND Circle3:", "(" + intersectionPoint2_x + "," + intersectionPoint2_y + ")"); //here was an error
    return {
      "x" : intersectionPoint2_x,
      "y" : intersectionPoint2_y
    }
  }
  else {
    return {
      err : "failed"
    }
    // Log.d("INTERSECTION Circle1 AND Circle2 AND Circle3:", "NONE");
  }
  // return true;
}
module.exports = {circle_intersection, three_circles_intersection};