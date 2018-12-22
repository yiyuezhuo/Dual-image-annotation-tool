function downloadTextFile(text, name) {
    // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    const a = document.createElement('a');
    const type = name.split(".").pop();
    a.href = URL.createObjectURL( new Blob([text], { type:`text/${type === "txt" ? "plain" : type}` }) );
    a.download = name;
    a.click();
}

  

var convasMargin = 10;

var elements = {
    canvas: document.getElementById('canvas'),
    inp1: document.getElementById('inp1'),
    inp2: document.getElementById('inp2'),
    inpPoint1: document.getElementById('inpPoint1'),
    inpPoint2: document.getElementById('inpPoint2'),
    btnExport1: document.getElementById('btnExport1'),
    btnExport2: document.getElementById('btnExport2'),
    img1: document.getElementById('img1'),
    img2: document.getElementById('img2'),
    scale1: document.getElementById('scale1'),
    scale2: document.getElementById('scale2'),
    scale1value: document.getElementById('scale1value'),
    scale2value: document.getElementById('scale2value'),
};

var ctx = elements.canvas.getContext('2d');

elements.inp1.onchange = function(e) {
    elements.img1.onload = updateCanvas;
    elements.img1.src = URL.createObjectURL(this.files[0]);
};
elements.inp2.onchange = function(e) {
    elements.img2.onload = updateCanvas;
    elements.img2.src = URL.createObjectURL(this.files[0]);
};

elements.scale1.onchange = function(){
    elements.scale1value.innerHTML = elements.scale1.value;
    updateCanvas();
}
elements.scale2.onchange = function(){
    elements.scale2value.innerHTML = elements.scale2.value;
    updateCanvas();
}
elements.canvas.onclick = function(e){
    console.log(e);

    var s1 = elements.scale1.value;
    var s2 = elements.scale2.value;
    var w1 = elements.img1.width * s1;
    var w2 = elements.img1.width * s1  + convasMargin;

    if(e.offsetX < w1){
        points1.push([e.offsetX/s1, e.offsetY/s1]);
    }
    else if(e.offsetX > w2){
        points2.push([(e.offsetX-w2)/s2, e.offsetY/s2]);
    }

    updateCanvas();
}

elements.btnExport1.onclick = function(){
    downloadTextFile(JSON.stringify(points1), 'point1.json');
}
elements.btnExport2.onclick = function(){
    downloadTextFile(JSON.stringify(points2), 'point2.json');
}
elements.inpPoint1.onchange = function(){
    // https://stackoverflow.com/questions/3146483/html5-file-api-read-as-text-and-binary
    var fr = new FileReader();
    fr.onload = function(){
        points1 = JSON.parse(fr.result);
    }
    fr.readAsText(elements.inpPoint1.files[0]);
    updateCanvas();
}
elements.inpPoint2.onchange = function(){
    // https://stackoverflow.com/questions/3146483/html5-file-api-read-as-text-and-binary
    var fr = new FileReader();
    fr.onload = function(){
        points2 = JSON.parse(fr.result);
    }
    fr.readAsText(elements.inpPoint2.files[0]);
    updateCanvas();
}


var points1 = []; // points store "true" value instead of image element-wise value
var points2 = [];


function updateCanvas(){
    // draw two images
    var s1 = elements.scale1.value;
    var s2 = elements.scale2.value;
    elements.canvas.width = elements.img1.width * s1  + convasMargin + elements.img2.width * s2;
    elements.canvas.height = Math.max(elements.img1.height*s1, elements.img2.height*s2);
    ctx.drawImage(elements.img1, 0, 0, elements.img1.width*s1, elements.img1.height*s1);
    ctx.drawImage(elements.img2, elements.img1.width*s1  + convasMargin, 0, elements.img2.width*s2, elements.img2.height*s2);

    // draw points
    ctx.fillStyle = 'rgb(0,0,0)'
    for(let p of points1){
        let x=p[0] * s1;
        let y=p[1] * s1;
        let r=2;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI);
        ctx.fill();
        //console.log(x, y, r, 0, 2*Math.PI)
    }

    for(let p of points2){
        let x=p[0] * s2 + convasMargin + elements.img1.width * s1;
        let y=p[1] * s2;
        let r=2;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI);
        ctx.fill();
    }


    // draw correspondence line
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    for(var i=0; i<Math.min(points1.length, points2.length); i++){
        var p1 = points1[i];
        var p2 = points2[i];
        
        ctx.beginPath();
        ctx.moveTo(p1[0]*s1, p1[1]*s1);
        ctx.lineTo(p2[0]*s2 + convasMargin + elements.img1.width*s1, p2[1]*s2);
        ctx.stroke();
        //console.log(p1[0]*s1, p1[1]*s1);
        //console.log(p2[0]*s2 + convasMargin + elements.img1.width*s1, p2[1]*s2);
    }
}
