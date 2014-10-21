var drawline = drawline || {};

//画直线
drawline.drawLine = function(canvas, x1, y1, x2, y2, id, config){
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var d = Math.max(dx, dy);
    if(x2 >= x1 && y2 >= y1){
        for(var i = 0; i < d; i++){
            drawline.drawPoint(canvas, x1 + (i * dx / d), y1 + (i * dy / d), id, (i+1), config);
        }
    }
    else if(x2 <= x1 && y2 <= y1){
        for(var i = 0; i < d; i++){
            drawline.drawPoint(canvas,x2 + (i * dx / d),y2 + (i * dy / d), id, (i+1), config);
        }
    }
    else if(x2 < x1 && y2 > y1){
        for(var i = 0; i < d; i++){
            drawline.drawPoint(canvas,x1 - (i * dx / d),y1 + (i * dy / d), id, (i+1), config);
        }
    }
    else if(x2 > x1 && y2 < y1){
        for(var i = 0; i < d; i++){
            drawline.drawPoint(canvas,x1 + (i * dx / d),y1 - (i * dy / d), id, (i+1), config);
        }
    }
    return id != null ? id + d : null;
};

drawline.drawPoint = function(canvas, x, y, id, increment, config){
    var point = document.createElement("i");
    if(id != null && increment >= 0){
        point.id = "point" + (id + increment);
    }
    this._config = config != null ? config : {zindex:"10001",width:"1px",background:"#f00"};
    point.className = "point";
    point.style.border = "none";
    point.style.fontSize = "0px"; //only ie6
    point.style.position = "absolute";
    point.style.zIndex = this._config.zindex || 10001;
    point.style.width = point.style.height = this._config.width || '1px';
    point.style.background = this._config.background || '#f00';
    point.style.left = x + "px";
    point.style.top = y + "px";
    canvas.appendChild(point);
    return id != null ? id + increment : null;
};

drawline.deletePoint = function(canvas, id){
    var point = document.getElementById("point" + id);
    if(point != null && point != undefined){
        canvas.removeChild(point);    
    }
};

//drawline.pointColor = '#f00,#ff0,#f0f,#0f0,#00f,#0ff,#800000,#f90,#008080,#000080'.split(',');
drawline.pointColor = '#f00'.split(',');
    
drawline.showPoint = function(canvas, data, rate, arrColor){
    //var json = eval('(' + data + ')');
    var c = arrColor != null ? arrColor.length : 0;
    var json = data;
    var points = 0;
    for(var i = 0; i < json.area.length; i++){
        points = json.area[i].start;
        //alert("s:" + points);
        for(var j = 0; j < json.area[i].points.length; j++){
            var x1 = json.area[i].points[j].x;
            var y1 = json.area[i].points[j].y;
            var x2 = json.area[i].points[0].x;
            var y2 = json.area[i].points[0].y;
            
            if(j < json.area[i].points.length - 1){
                x2 = json.area[i].points[j + 1].x;
                y2 = json.area[i].points[j + 1].y;
            }
            points = drawline.drawLine(canvas, parseInt(x1, 10)*rate, parseInt(y1, 10)*rate, parseInt(x2, 10)*rate, parseInt(y2, 10)*rate, points, {zindex:"10001",width:"1px",background:drawline.getPointColor(arrColor,c,i)});
            points += 1;
        }
        //alert("e:" + points);
    }
};

drawline.getPointColor = function(arrColor, c, i){
    if(arrColor == null || arrColor == undefined) return "#ff0";
    if(i < c){
        return arrColor[i];
    }
    return "#f00";
};