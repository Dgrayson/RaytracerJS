var cW = 700;
var cH = 500;

var vW = 1;
var vH = 1;

var O = [0, 0, 0];
var d = 1;

class Sphere {
    constructor(center, radius, color, specular) {
        this.center = center;
        this.radius = radius;
        this.color = color;
        this.specular = specular
    }
}

class Light {
    constructor(type, intensity, position, direction) {
        this.type = type;
        this.intensity = intensity;
        this.position = position;
        this.direction = direction;
    }
}

var lights =
    [
        new Light("ambient", 0.2, null, null),
        new Light("point", 0.6, [2, 1, 0], null),
        new Light("directional", 0.2, null, [1, 4, 4])
    ];

var spheres =
    [
        new Sphere([0, 1, 3], 1, [255, 0, 0], 500),
        new Sphere([1, 0, 2], .5, [150, 130, 200], 10),
        new Sphere([-.5, -.5, 2], .5, [100, 255, 100], 1000)
    ];


// ======================================================================
//  Low-level canvas access.
// ======================================================================

var canvas = document.getElementById("canvas");
var canvas_context = canvas.getContext("2d");
var canvas_buffer = canvas_context.getImageData(0, 0, canvas.width, canvas.height);
var canvas_pitch = canvas_buffer.width * 4;


// The PutPixel() function.
var PutPixel = function (x, y, color) {
    x = canvas.width / 2 + x;
    y = canvas.height / 2 - y - 1;

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        return;
    }

    var offset = 4 * x + canvas_pitch * y;
    canvas_buffer.data[offset++] = color[0];
    canvas_buffer.data[offset++] = color[1];
    canvas_buffer.data[offset++] = color[2];
    canvas_buffer.data[offset++] = 255; // Alpha = 255 (full opacity)
}

// Displays the contents of the offscreen buffer into the canvas.
var UpdateCanvas = function () {
    canvas_context.putImageData(canvas_buffer, 0, 0);
}

// ======================================================================
//  Linear algebra helpers
// ======================================================================

function dot(v, w) {
    return v[0] * w[0] + v[1] * w[1] + v[2] * w[2];
}

function add(v, w) {
    return [v[0] + w[0], v[1] + w[1], v[2] + w[2]];
}

function subtract(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

function multiply(k, vec) {
    return [k * vec[0], k * vec[1], k * vec[2]];
}

function length(v) {
    return Math.sqrt(dot(v, v));
}

function canvasToViewport(x, y) {
    return [x * (vW / cW), y * (vH / cH), d];
}

// ======================================================================
//  RayTracer
// ======================================================================

function computeLighting(P, N, V, s) {
    let i = 0.0;

    for (var x = 0; x < lights.length; x++) {
        //console.log(x); 
        var light = lights[x];

        if (light.type == "ambient") {
            i += light.intensity;
        }
        else {
            let L = null;
            if (light.type == "point") {
                L = subtract(light.position, P);
            }
            else {
                L = light.direction;
            }

            let n_dot_1 = dot(N, L);

            if (n_dot_1 > 0) {
                i += light.intensity * n_dot_1 / (1.0 * length(L));
            }

            // Specular
            if (s != -1) {
                var R = subtract(multiply(2.0 * dot(N, L), N), L);

                r_dot_v = dot(R, V);

                if (r_dot_v > 0) {
                    i += light.intensity * Math.pow(r_dot_v / (length(R) * length(V)), s);
                }
            }
        }
    }

    return i;
}

function TraceRay(O, D, t_min, t_max) {
    let closest_t = Infinity;
    let closest_sphere = null;

    for (let x = 0; x < spheres.length; x++) {
        t = IntersectRaySphere(O, D, spheres[x]);

        if (t[0] > t_min && t[0] < t_max && t[0] < closest_t) {
            closest_t = t[0];
            closest_sphere = spheres[x];
        }

        if (t[1] > t_min && t[1] < t_max && t[1] < closest_t) {
            closest_t = t[1];
            closest_sphere = spheres[x];
        }
    }

    if (closest_sphere == null) {
        return [0, 0, 0];
    }

    var P = add(O, multiply(closest_t, D));
    var N = subtract(P, closest_sphere.center);

    N = multiply(1.0 / length(N), N);
    console.log(closest_sphere.specular);
    return multiply(computeLighting(P, N, -D, closest_sphere.specular), closest_sphere.color);
}

function IntersectRaySphere(O, D, sphere) {
    r = sphere.radius;
    CO = subtract(O, sphere.center);

    a = dot(D, D);
    b = 2 * dot(CO, D);
    c = dot(CO, CO) - r * r;

    discrim = b * b - 4 * a * c;

    t1 = (-b + Math.sqrt(discrim)) / (2 * a);
    t2 = (-b - Math.sqrt(discrim)) / (2 * a);

    return [t1, t2];
}



for (var x = -canvas.width / 2; x < canvas.width / 2; x++) {
    for (var y = -canvas.height / 2; y < canvas.height / 2; y++) {
        var direction = canvasToViewport(x, y);
        var color = TraceRay(O, direction, 1, Infinity);

        PutPixel(x, y, color);
    }
}

UpdateCanvas(); 