var cW = 700; 
var cH = 500; 

var vW = 1; 
var vH = 1; 

var O = [0,0,0]; 
var d = 1; 

class Sphere(){
    constructor(center, radius, color){
        this.center = center; 
        this.radius = radius; 
        this.color = color; 
    }
}

function setup(){
    createCanvas(cW, cH);
}

function draw(){
    let x; 

    for(x = -cW/2; x < cH / 2; x++){
        for(y = -cH / 2; y < cH / 2; y++ ){
            let D = canvasToViewport(x, y); 
            let color = TraceRay(O, D, 1, 0); 
            PutPixel(x, y, color); 
        }
    }
    background(0); 

}

function canvasToViewport(x, y){
    return [x * (vW / cW), y * (vH / cH), d]; 
}