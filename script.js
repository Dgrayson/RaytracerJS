var cW = 700; 
var cH = 500; 

var vW = 1; 
var vH = 1; 

var O = [0,0,0]; 
var d = 1; 

var spheres = []; 

class Sphere{
    constructor(center, radius, color){
        this.center = center; 
        this.radius = radius; 
        this.color = color; 
    }
}

function setup(){

    let s1 = new Sphere([30, 40], 5, red);
    spheres = {
        s1
    }
    createCanvas(cW, cH);
}

function draw(){
    let x; 

    for(x = -cW/2; x < cW / 2; x++){
        for(y = -cH / 2; y < cH / 2; y++ ){
            let D = canvasToViewport(x, y); 
            let color = TraceRay(O, D, 1, 0); 
            set(x, y, color(100,50,100));  
        }
    }

    console.log("Running"); 
    set(50, 50, color(100, 50, 100));
    updatePixels(); 

    background(0); 

}

function getColor(){

}

function canvasToViewport(x, y){
    return [x * (vW / cW), y * (vH / cH), d]; 
}

function TraceRay(O, D, t_min, t_max){
    let closest_t = null; 
    let closest_sphere = null; 

    for(let x = 0; x < spheres.length; x++){
        t = IntersectRaySphere(O, D, spheres[x]); 

        if(t[0] > t_min && t[0] < t_max && t[0] < closest_t){
            closest_t = t[0]; 
            closest_sphere = spheres[x]; 
        }

        if (t[1] > t_min && t[1] < t_max && t[1] < closest_t) {
            closest_t = t[1];
            closest_sphere = spheres[x];
        }
    }

    if (closest_sphere == null){
        return color.black; 
    }
    
    return closest_sphere.color; 
}

function IntersectRaySphere(O, D, sphere){
    r = sphere.radius; 
    CO = subtract(O, sphere.center); 

    a = dot(D, D); 
    b = 2 * dot(CO, D); 
    c = dot(CO, CO) - r*r; 

    discrim = b*b - 4*a*c; 

    t1 = (-b + Math.sqrt(discrim)) / (2 * a); 
    t2 = (-b -Math.sqrt(discrim)) / (2*a); 

    return [t1, t2]; 
}

function dotProduct(v, w){
    return v[0] * w[0] + v[1] * w[1] + v[2] * w[2]; 
}

function subtract(v1, v2){
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]]; 
}