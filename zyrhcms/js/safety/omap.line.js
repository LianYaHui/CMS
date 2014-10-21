var omap = omap || {};
omap.line = omap.line || {};
omap.line.arrLine = [];

//画直线
omap.line.drawLine = function(canvas, x1, y1, x2, y2, rate, config){
    var arrPoint = [];
    var point = null;
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var d = Math.max(dx, dy);
    
    if(x2 >= x1 && y2 >= y1){
        for(var i = 0; i < d; i++){
            point = omap.line.drawPoint(canvas, x1 + (i * dx / d), y1 + (i * dy / d), rate, config);
            arrPoint.push(point);
        }
    }
    else if(x2 <= x1 && y2 <= y1){
        for(var i = 0; i < d; i++){
            point = omap.line.drawPoint(canvas, x2 + (i * dx / d),y2 + (i * dy / d), rate, config);
            arrPoint.push(point);
        }
    }
    else if(x2 < x1 && y2 > y1){
        for(var i = 0; i < d; i++){
            point = omap.line.drawPoint(canvas, x1 - (i * dx / d),y1 + (i * dy / d), rate, config);
            arrPoint.push(point);
        }
    }
    else if(x2 > x1 && y2 < y1){
        for(var i = 0; i < d; i++){
            point = omap.line.drawPoint(canvas, x1 + (i * dx / d),y1 - (i * dy / d), rate, config);
            arrPoint.push(point);
        }
    }
    
    omap.line.arrLine.push({points: arrPoint});
    
    return arrPoint;
};

omap.line.drawPoint = function(canvas, x, y, rate, config){
    var point = document.createElement("i");
    point.id = "point_" + new Date().getTime();
    this._config = config != null ? config : {zindex:"10001",width:"1px",background:"#f00"};
    point.className = "point";
    point.style.border = "none";
    point.style.fontSize = "0px"; //only ie6
    point.style.position = "absolute";
    point.style.zIndex = this._config.zindex || 10001;
    point.style.width = point.style.height = this._config.width || '1px';
    point.style.background = this._config.background || '#f00';
    point.style.left = x * rate + "px";
    point.style.top = y * rate + "px";
    point.lang = x + ',' + y;
    
    canvas.appendChild(point);
    
    return point;
};

omap.line.clearAllLine = function(canvas){
    for(var i=omap.line.arrLine.length-1; i>=0; i--){
        try{
            var points = omap.line.arrLine[i].points;
            for(var j=points.length-1; j>=0; j--){
                omap.line.deletePoint(canvas, points[j]);
            }
            omap.line.arrLine.splice(i,1);
            delete points;
        } catch(e){
            //alert(e);
        }
    }
    omap.line.arrLine = [];
};

omap.line.moveLine = function(canvas){
    for(var i=omap.line.arrLine.length-1; i>=0; i--){
        try{
            var points = omap.line.arrLine[i].points;
            for(var j=points.length-1; j>=0; j--){
                var pos = points[j].lang.split(',');
                var x = parseInt(pos[0], 10) * omap.zoom;
                var y = parseInt(pos[1], 10) * omap.zoom;
                points[j].style.left = x + "px";
                points[j].style.top = y + "px";
            }            
        } catch(e){
            //alert(e);
        }
    }
};

omap.line.deletePoint = function(canvas, point){
    if(point != null && point != undefined){
        canvas.removeChild(point);    
    }
};

//omap.line.pointColor = '#f00,#ff0,#f0f,#0f0,#00f,#0ff,#800000,#f90,#008080,#000080'.split(',');
omap.line.pointColor = '#f00'.split(',');

/*
omap.line.showPoint = function(canvas, data, rate, arrColor){
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
            points = omap.line.drawLine(canvas, parseInt(x1, 10)*rate, parseInt(y1, 10)*rate, parseInt(x2, 10)*rate, parseInt(y2, 10)*rate, points, {zindex:"10001",width:"1px",background:omap.line.getPointColor(arrColor,c,i)});
            points += 1;
        }
        //alert("e:" + points);
    }
};

omap.line.getPointColor = function(arrColor, c, i){
    if(arrColor == null || arrColor == undefined) return "#ff0";
    if(i < c){
        return arrColor[i];
    }
    return "#f00";
};
*/