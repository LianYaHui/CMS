var omap = omap || {};

omap.map = null;
omap.mapBg = null;
omap.zoom = 1;
omap.zindex = 10;
//中心缩放
omap.centerScale = true;
omap.mapTypeControl = true;
omap.scaleControl = true;
omap.zoomControl = true;
omap.markers = [];
omap.lines = [];
omap.icon = '';
omap.iconSize = [20, 20, 16, 16, 12, 12];
omap.size = {width: 3087, height: 2887};
omap.boxSize = null;

omap.ControlPosition = {
    LEFT_TOP: 'LEFT_TOP',
    RIGHT_TOP: 'RIGHT_TOP',
    LEFT_BOTTOM: 'LEFT_BOTTOM',
    RIGHT_BOTTOM: 'RIGHT_BOTTOM'
};

omap.initialEmap = function(obj, options){
    var strHtml = '';
    if(options != undefined && typeof options == 'object'){
        omap.boxSize = options.boxSize;
        if(options.zindex != undefined){
            omap.zindex = options.zindex;
        }
        if(options.zoomControl != undefined){
            omap.zoomControl = options.zoomControl;
        }
        if(options.mapTypeControl != undefined){
            omap.mapTypeControl = options.mapTypeControl;
        }
        if(options.scaleControl != undefined){
            omap.scaleControl = options.scaleControl;
        }
        if(options.zoomControlOptions == undefined){
            options.zoomControlOptions = {};
        }
        
        if(omap.zoomControl){
            if(options.zoomControlOptions == undefined){
                options.zoomControlOptions = {};
            }
            options.zoomControlOptions.position = options.zoomControlOptions.position || omap.ControlPosition.LEFT_TOP;
            options.zoomControlOptions.y = options.zoomControlOptions.y || 5;
            options.zoomControlOptions.x = options.zoomControlOptions.x || 5;
        }
        
        if(omap.mapTypeControl){
            if(options.mapTypeControlOptions == undefined){
                options.mapTypeControlOptions = {};
            }
            options.mapTypeControlOptions.position = options.mapTypeControlOptions.position || omap.ControlPosition.RIGHT_TOP;
            options.mapTypeControlOptions.y = options.mapTypeControlOptions.y || 0;
            options.mapTypeControlOptions.x = options.mapTypeControlOptions.x || 0;
        }
        
        if(omap.scaleControl){
            if(options.scaleControlOptions == undefined){
                options.scaleControlOptions = {};
            }
            options.scaleControlOptions.position = options.scaleControlOptions.position || omap.ControlPosition.LEFT_BOTTOM;
            options.scaleControlOptions.y = options.scaleControlOptions.y || 0;
            options.scaleControlOptions.x = options.scaleControlOptions.x || 0;
        }
    } else {
        alert('地图初始化失败，原因：参数错误');
        return false;
    }
    
    if(obj == undefined){
        obj = cms.util.$('omapCanvas');
    }
    if(options.mapBgFilePath == undefined || options.mapBgFilePath == null){
        options.mapBgFilePath = strImgPathDir + '/map/' + 'map.jpg';
    }
    options.mapBgFilePath = options.mapBgFilePath.replaceAll('//','/');
    strHtml += omap.zoomControl ? '<div id="omapControl" style="position:absolute;' + omap.setControlPosition(options.zoomControlOptions) + 'z-index:' + (omap.zindex + 5) + ';">' + omap.buildZoomControl() + '</div>' : '';
    strHtml += omap.scaleControl ? '<div id="omapScaleBox" style="position:absolute;' + omap.setControlPosition(options.scaleControlOptions) + 'height:20px;line-height:20px;padding:0 3px;background:#fff;z-index:' + (omap.zindex + 5) + ';"></div>' : '';
    strHtml += omap.mapTypeControl ? '<div id="omapBgChange" style="position:absolute;' + omap.setControlPosition(options.mapTypeControlOptions) + 'height:20px;line-height:20px;background:#fff;z-index:' + (omap.zindex + 5) + ';border:solid 1px #ccc;"></div>' : '';
    strHtml += ''
        + '<div id="hiddenPic" style="position:absolute; left:0px; top:0; width:0px; height:0px; z-index:1; visibility: hidden;">'
        + '<img id="mapBg2" name="mapBg2" src="' + options.mapBgFilePath + '" border="0" width="' + options.boxSize.width + 'px" />'
        + '</div>'
        + '<div id="mapBox" onmouseout="drag=0" onmouseover="dragObj=mapBox; drag=1;" class="dragAble" '
        + ' style="z-index:' + omap.zindex + '; height:0; left:0px; position:absolute; top:0; width:0" >'
        + '<img id="mapBg1" name="mapBg1" src="' + options.mapBgFilePath + '" border="0" width="' + options.boxSize.width + 'px" ondblclick="bigit();" '
        + ' style="position:absolute;left:0; top:0;" />'
        + '</div>';
    obj.innerHTML = strHtml;
    
    omap.map = cms.util.$('mapBox');
    omap.mapBg = cms.util.$('mapBg1');
    omap.getZoom();
    omap.showBgChange();
    
    omap.map.onmousewheel = obj.onmousewheel = wheel;
};

omap.setControlPosition = function(option){
    var strPosition = '';
    switch(option.position){
        case 'LEFT_TOP':
            strPosition = 'left:' + option.x + 'px;top:' + option.y + 'px;';
            break;
        case 'RIGHT_TOP':
            strPosition = 'right:' + option.x + 'px;top:' + option.y + 'px;';
            break;
        case 'LEFT_BOTTOM':
            strPosition = 'left:' + option.x + 'px;bottom:' + option.y + 'px;';
            break;
        case 'RIGHT_BOTTOM':
            strPosition = 'right:' + option.x + 'px;bottom:' + option.y + 'px;';
            break;
    }
    return strPosition;
};

omap.getZoom = function(){
    omap.zoom = parseInt(omap.mapBg.width, 10) / parseInt(omap.size.width, 10);
    omap.showScaleRate();
    return omap.zoom;    
};

omap.setZoom = function(zoom){
    if(typeof zoom == 'number'){
        omap.mapBg.style.width = (parseInt(omap.size.width, 10) * parseFloat(zoom, 10)) + 'px';
        omap.showScaleRate();
        omap.moveMarker();        
        if(omap.line != undefined){
            omap.line.moveLine(omap.map);
        }
        return omap.getZoom();
    }
};

omap.showScaleRate = function(){
    if(omap.scaleControl){
        cms.util.$('omapScaleBox').innerHTML = '比例:' + (omap.zoom <= 1 ? '1<span style="padding:0 2px;">:</span>' + Math.round(1/omap.zoom * 100)/100 : Math.round(omap.zoom * 100)/100 + '<span style="padding:0 2px;">:</span>' + 1);
    }
};

omap.showBgChange = function(){
    if(omap.mapTypeControl){
        cms.util.$('omapBgChange').innerHTML = ''
        + '<span style="display:block;float:left;padding:0 3px;cursor:pointer;background:#dbebfe;" onclick="omap.chageMapBg(\'\',this);">彩色</span>'
        + '<span style="float:left;border-left:solid 1px #ccc;display:block;width:0;">&nbsp;</span>'
        + '<span style="float:left;display:block;padding:0 3px;cursor:pointer;" onclick="omap.chageMapBg(\'gray\',this);">灰色</span>'
        + '<span style="float:left;border-left:solid 1px #ccc;display:block;width:0;">&nbsp;</span>'
        + '<span style="float:left;display:block;padding:0 3px;cursor:pointer;" onclick="omap.chageMapBg(\'clean\',this);">线路图</span>';
    }
};

omap.chageMapBg = function(action, btn, strMapBgFilePath){
    if(strMapBgFilePath != undefined){
        omap.mapBg.src = strMapBgFilePath.replaceAll('//','/');
    } else {
        var strFilePath = strImgPathDir + '/map/' + (action == 'gray' ? 'map_gray.jpg' : action == 'clean' ? 'map_clean.jpg' : 'map.jpg');
        
        omap.mapBg.src = strFilePath.replaceAll('//','/');

        var childs = cms.util.$('omapBgChange').childNodes;
        for(var i=0; i<childs.length; i++){
            childs[i].style.background = '#fff';
        }
        if(btn != null && btn != undefined){
            btn.style.background = '#dbebfe';
        } else {
            childs[action == 'gray' ? 2 : action == 'clean' ? 4 : 0].style.background = '#dbebfe';
        }
    }
};

omap.setMapBg = function(strFilePath){
    if(strFilePath != ''){
        omap.chageMapBg(null, null, strFilePath);
    }
};

//页面画布缩放时，改变地图背景尺寸，后续
omap.changeSize = function(boxSize){
    if(omap.mapBg != null){
        //功能后续完成
        
        
        omap.getZoom();
    }
};

omap.showMarker = function(param){
	var option = {
	    title: param.name,
	    icon: param.icon,
		pos: {left: param.left || 0, top: param.top || 0},
		showLabel: param.showLabel || false,
        labelBg: param.labelBg || '#fff',
        labelBorder: param.labelBorder || 'solid 1px #ddd',
        labelColor: param.labelColor || '#000',
		func: param.func || null,
		val: param.val || ''
	};
	var marker = omap.buildMarker(option);
	omap.markers.push(marker);
	return marker;
};

omap.clearMarker = function(){
	for(var i=0,c=omap.markers.length; i<c; i++){
		omap.removeMarker(omap.markers[i]);
		omap.markers.splice(i, 1);
	}
};

omap.removeMarker = function(marker){
    if(marker != null && marker != undefined && typeof marker == 'object'){
        try{
	        omap.map.removeChild(marker);
	    }
	    catch(e){}
	}
};

omap.moveMarker = function(marker){    
	var size = omap.zoom > 0.5 ? [omap.iconSize[0], omap.iconSize[1]] : omap.zoom < 0.3 ? [omap.iconSize[4], omap.iconSize[5]] : [omap.iconSize[2], omap.iconSize[3]];
	var w = parseInt(size[0], 10);
	var h = parseInt(size[1], 10);
    if(marker != null && marker != undefined){
    
    } else {
        for(var i=0,c=omap.markers.length; i<c; i++){
            var marker = omap.markers[i];
            var pos = eval('(' + marker.lang + ')');
            var left = parseInt(pos[0], 10);
            var top = parseInt(pos[1], 10);
            
            left = left * omap.zoom - w / 2;
            top = top * omap.zoom - h / 2;
            
            marker.style.left = left + 'px';
            marker.style.top = top + 'px';
            
            if(marker.childNodes.length >= 1){
                marker.childNodes[0].style.width = w + 'px';
                marker.childNodes[0].style.height = h + 'px';
                
                if(marker.childNodes.length >= 2){
                    marker.childNodes[1].style.top = h + 'px';
                    marker.childNodes[1].style.left = size[0] / 2 + 'px';
                }
            }
        }
    }
};

omap.buildMarker = function(option){
	var marker = document.createElement('DIV');
	var size = omap.zoom > 0.5 ? [omap.iconSize[0], omap.iconSize[1]] : omap.zoom < 0.3 ? [omap.iconSize[4], omap.iconSize[5]] : [omap.iconSize[2], omap.iconSize[3]];	
    var left = option.pos.left * omap.zoom - size[0]/2;
    var top = option.pos.top * omap.zoom - size[1]/2;
    
	marker.style.position = 'absolute';
	marker.style.left = left + 'px';
	marker.style.top = top + 'px';
	marker.title = option.title;
	marker.lang = '[' + option.pos.left + ',' + option.pos.top + ']';
	
    var img = document.createElement('IMG');
	img.src = option.icon.replaceAll('//','/');
	img.title = option.title;
	img.style.width = size[0] + 'px';
	img.style.height = size[1] + 'px';
	img.style.cursor = 'pointer';
	img.style.zIndex = 10001;
	img.lang = option.val;
	if(option.func != undefined && typeof option.func == 'function'){
	    img.onclick = function(){
            option.func(this.lang);
        }
	}
	
	marker.appendChild(img);

    if(option.showLabel){
        var label = document.createElement('SPAN');
        label.style.cssText = 'position:absolute; display:block;height:12px;line-height:12px;'
            + 'width:' + (option.title.len() * 6) + 'px;top:' + size[1] + 'px;left:' + size[0]/2 + 'px;minWidth:100px;'
            + 'padding:2px;cursor:pointer;z-index:10000;';
        label.style.background = option.labelBg;
        label.style.border = option.labelBorder;
        label.style.color = option.labelColor;
        
        label.innerHTML = option.title;
	    label.lang = option.val;        
        if(typeof option.func == 'function'){
	        label.onclick = function(){
                option.func(this.lang);
            }
	    }
	    marker.appendChild(label);
    }
	
	omap.map.appendChild(marker);

	return marker;
};

omap.buildZoomControl = function(obj){
    var strHtml = '<table cellpadding="0" cellspacing="0" id="tbMapControl">'
        + '<tr>'
        + '<td>&nbsp;</td>'
        + '<td><img src="' + strImgPathDir + '/map/up.gif" onclick="clickMove(\'up\')" title="向上"></td>'
        + '<td>&nbsp;</td>'
        + '</tr>'
        + '<tr>'
        + '<td><img src="' + strImgPathDir + '/map/left.gif" onclick="clickMove(\'left\')" title="向左"></td>'
        + '<td><img src="' + strImgPathDir + '/map/zoom.gif" onclick="realsize();" title="还原"></td>'
        + '<td><img src="' + strImgPathDir + '/map/right.gif" onclick="clickMove(\'right\')" title="向右"></td>'
        + '</tr>'
        + '<tr>'
        + '<td>&nbsp;</td>'
        + '<td><img src="' + strImgPathDir + '/map/down.gif" onclick="clickMove(\'down\')" title="向下"></td>'
        + '<td>&nbsp;</td>'
        + '</tr>'
        + '<tr>'
        + '<td>&nbsp;</td>'
        + '<td><img src="' + strImgPathDir + '/map/zoom_in.gif" onclick="bigit();" title="放大"></td>'
        + '<td>&nbsp;</td>'
        + '</tr>'
        + '<tr>'
        + '<td>&nbsp;</td>'
        + '<td><img src="' + strImgPathDir + '/map/zoom_out.gif" onclick="smallit();" title="缩小"></td>'
        + '<td>&nbsp;</td>'
        + '</tr>'
        + '</table>'
        + '<style type="text/css">'
        + '#tbMapControl img{width:20px;height:20px;cursor:pointer;}'
        + '</style>';
    if(obj != undefined && typeof obj == 'object'){
        obj.innerHTML = strHtml.replaceAll('//', '/');
    }
    return strHtml.replaceAll('//', '/');
};


var drag = 0;
var move = 0;
// 拖拽对象
var ie = document.all;
var nn6 = document.getElementById && !document.all;
var isdrag = false;
var y, x;
var oDragObj;

function moveMouse(e) {
    if (isdrag) {
        oDragObj.style.top = (nn6 ? nTY + e.clientY - y: nTY + event.clientY - y) + "px";
        oDragObj.style.left = (nn6 ? nTX + e.clientX - x: nTX + event.clientX - x) + "px";
        return false;
    }
    
    //alert(oDragObj.style.top + ',' + oDragObj.style.left);
}

function initDrag(e) {
    try{
        var oDragHandle = nn6 ? e.target: event.srcElement;
        var topElement = "HTML";
        while (oDragHandle.tagName != topElement && oDragHandle.className != "dragAble") {
            oDragHandle = nn6 ? oDragHandle.parentNode: oDragHandle.parentElement;
        }
        if (oDragHandle.className == "dragAble") {
            isdrag = true;
            oDragObj = oDragHandle;
            nTY = parseInt(oDragObj.style.top + 0);
            y = nn6 ? e.clientY: event.clientY;
            nTX = parseInt(oDragObj.style.left + 0);
            x = nn6 ? e.clientX: event.clientX;
            document.onmousemove = moveMouse;
            return false;
        }
    }catch(e){}
}

document.onmousedown = initDrag;
document.onmouseup = new Function("isdrag=false");

function clickMove(s) {
    if (s == "up") {
        dragObj.style.top = parseInt(dragObj.style.top) + 100;
    } else if (s == "down") {
        dragObj.style.top = parseInt(dragObj.style.top) - 100;
    } else if (s == "left") {
        dragObj.style.left = parseInt(dragObj.style.left) + 100;
    } else if (s == "right") {
        dragObj.style.left = parseInt(dragObj.style.left) - 100;
    }
}

function smallit() {
    var height1 = mapBg1.height;
    var width1 = mapBg1.width;
    mapBg1.height = height1 / 1.1;
    mapBg1.width = width1 / 1.1;
    
    mapBgMove(0.1, 'small');  
    
    omap.getZoom();
    omap.moveMarker();
    if(omap.line != undefined){
        omap.line.moveLine(omap.map);
    }
}

function bigit() {
    var height1 = mapBg1.height;
    var width1 = mapBg1.width;
    mapBg1.height = height1 * 1.1;
    mapBg1.width = width1 * 1.1;
    
    mapBgMove(0.1, 'big');  
    
    omap.getZoom();
    omap.moveMarker();
    if(omap.line != undefined){
        omap.line.moveLine(omap.map);
    }
}

function mapBgMove(rate, action){
    if(omap.centerScale){
        var w = parseInt(omap.mapBg.width, 10);
        var h = parseInt(omap.mapBg.height, 10);
        var left = parseInt(omap.map.style.left, 10);
        var top = parseInt(omap.map.style.top, 10);
        if('big' == action){
            omap.map.style.left = (left - w/2 * omap.zoom * rate) + 'px';
            omap.map.style.top = (top - h/2 * omap.zoom *  rate) + 'px';
        } else {
            omap.map.style.left = (left + w/2 * omap.zoom * rate) + 'px';
            omap.map.style.top = (top + h/2 * omap.zoom * rate) + 'px';        
        }
    }
}

function realsize() {
    mapBg1.height = mapBg2.height;
    mapBg1.width = mapBg2.width;
    mapBox.style.left = 0;
    mapBox.style.top = 0;

    omap.getZoom();
    omap.moveMarker();
}

function featsize() {
    var width1 = mapBg2.width;
    var height1 = mapBg2.height;
    var width2 = 360;
    var height2 = 200;
    var h = height1 / height2;
    var w = width1 / width2;
    if (height1 < height2 && width1 < width2) {
        mapBg1.height = height1;
        mapBg1.width = width1;
    } else {
        if (h > w) {
            mapBg1.height = height2;
            mapBg1.width = width1 * height2 / height1;
        } else {
            mapBg1.width = width2;
            mapBg1.height = height1 * width2 / width1;
        }
    }
    mapBox.style.left = 0;
    mapBox.style.top = 0;
}

/*鼠标滚动事件 */  
var wheel = function(event) {
	var delta = 0;
	if (!event) /* For IE. */  
		event = window.event;
	if (event.wheelDelta) { /* IE/Opera. */  
		delta = event.wheelDelta / 110;
	} else if (event.detail) {
		delta = -event.detail / 3;
	}
	if (delta)  
		handle(delta);
	if (event.preventDefault)  
		event.preventDefault();
	event.returnValue = false;
}  

if (window.addEventListener) {  
	/** DOMMouseScroll is for mozilla. */  
	window.addEventListener('DOMMouseScroll', wheel, false);
}

var handle = function(delta) {  
	var random_num = Math.floor((Math.random() * 100) + 50);
	if (delta < 0) {  
		//alert("鼠标滑轮向下滚动：" + delta + "次！"); // 1  
		smallit();
		//$("btn_next_pic").onclick(random_num);
		return;
	} else {  
		//alert("鼠标滑轮向上滚动：" + delta + "次！"); // -1  
		bigit();
		//$("btn_last_pic").onclick(random_num);
		return;
	}  
}