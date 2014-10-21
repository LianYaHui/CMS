var oamap = oamap || {};
oamap.zoom = 0;
oamap.scale = 1000000;
oamap.isInitial = false;
oamap.mapCenter = {lat:0, lng: 0};
oamap.frameId = 'mapGis';
oamap.boxSize = null;
oamap.initialCallBack = null;

/*
    初始化GIS地图
    callBack: 需要在地图加载完成后 调用的函数
*/
oamap.initialEmap = function(obj, boxSize, callBack){
    oamap.boxSize = boxSize;
    
    if(obj == undefined){
        obj = cms.util.$('oamapCanvas');
    }
    var strPage = cms.util.path + '/arcgis/index.aspx?' + new Date().getTime();
    var strHtml = '<iframe name="mapGis" id="mapGis" height="100%" width="100%" frameborder="0" src="' + strPage + '" scrolling="no">'
        + '浏览器不支持嵌入式框架，或被配置为不显示嵌入式框架。'
        + '</iframe>';
    
    obj.innerHTML = strHtml;
    
    if(callBack != undefined){
        oamap.initialCallBack = callBack;
    }
};

//地图加载完成后调用
oamap.returnInitial = function(){
    oamap.isInitial = true;
    
    if(oamap.initialCallBack != null && typeof oamap.initialCallBack == 'function'){
        window.setTimeout(oamap.initialCallBack, 3000);
    }
};

//GIS Flash返回的 地图中心坐标
oamap.returnCenter = function(lat, lng){
    oamap.mapCenter = {lat: lat, lng: lng};
};

//GIS Flash返回的 地图缩放比例
oamap.returnZoom = function(zoom, scale){
    oamap.zoom = zoom;
    oamap.scale = scale;
};

oamap.getCenter = function(){
    return oamap.mapCenter;
};

oamap.setCenter = function(lat, lng){
    return $('#' + oamap.frameId)[0].contentWindow.setCenter(lat, lng);
};

oamap.getZoom = function(){
    return oamap.zoom;
};

oamap.setZoom = function(zoom){
    return $('#' + oamap.frameId)[0].contentWindow.setZoom(zoom);
};

oamap.setCenterAndZoom = function(lat, lng, zoom){
    return $('#' + oamap.frameId)[0].contentWindow.setCenterZoom(lat, lng, zoom);
};

//显示图层控件
oamap.showLayerControl = function(){
    oamap.callMapFunction('layer', null);
}; 

//显示测量控件
oamap.showMeasureControl = function(){
    oamap.callMapFunction('measure', null);
}; 

//显示测量控件
oamap.showDrawControl = function(){
    oamap.callMapFunction('draw', null);
}; 

//打印地图
oamap.printMap = function(){
    oamap.callMapFunction('print', null);
}; 

oamap.callMapFunction = function(action, jsondata){
    return $('#' + oamap.frameId)[0].contentWindow.callMapFunction(action, jsondata);
};

oamap.checkLatLng = function(lat, lng){
    lat = lat == undefined ? '' : '' + lat;
    lng = lng == undefined ? '' : '' + lng;
    return lat != '' && lat != '0' && lng != '' && lng != '0';
};

oamap.buildMarkerData = function(dataList, type, showLabel){
    var strData = '[';
    var picUrl = cms.util.path + '/skin/default/images/railway/gis/';
    var num = 0;
    for(var i=0,c=dataList.length; i<c; i++){
        var dr = dataList[i];
        if(oamap.checkLatLng(dr.lat, dr.lng)){
            var typeId = dr.type == undefined ? type : dr.type;
            var disLabel = (dr.showLabel != undefined ? dr.showLabel : showLabel) ? 1 : 0;
            var disInfo = (dr.showInfo != undefined ? dr.showInfo : false) ? 1 : 0;
            //var strIcon = (dr.icon != undefined ? dr.icon : picUrl + typeId + (typeId == 2 ? '.swf' : '.gif'));
            //var strIcon = (dr.icon != undefined ? dr.icon : picUrl + typeId + (typeId == 3 ? '.swf' : '.gif'));
            var strIcon = (dr.icon != undefined ? dr.icon : picUrl + typeId + '.gif');
            var strLabel = '';
            if(disLabel == 1){
                strLabel = dr.label != undefined ? dr.label : dr.name;
            }
            var strAction = dr.action != undefined ? dr.action : (dr.code != undefined ? dr.code : '');
            
            strData += num > 0 ? ',' : '';
            strData += '{';
            strData += '"type":"' + typeId + '"'
                + ',"id":"' + dr.id + '"'
                + ',"name":"' + dr.name + '"'
                + ',"GPS_X":"' + dr.lng + '"'
                + ',"GPS_Y":"' + dr.lat + '"'
                + ',"action":"' + strAction + '"'
                + ',"picUrl":"' + strIcon + '"'
                + ',"label":"' + strLabel + '"'
                + ',"disLabel":"' + disLabel + '"'
                + ',"disInfo":"' + disInfo + '"'
                + '}';
            num++;
        }
    }
    strData += ']';
    
    return strData;
};

oamap.createMarker = function(param, markerDataList){
    var jsondata = '{"id": "' + param.id + '", "scale": "' + param.scale + '", "pointsArray": ' + markerDataList + '}';
    return oamap.callMapFunction('createMarker', jsondata);
};

oamap.showMarker = function(id){
    var jsondata = '{"id": "' + id + '", "controlNum": "0"}';
    return oamap.callMapFunction('showMarker', jsondata);
};

oamap.hideMarker = function(id){
    var jsondata = '{"id": "' + id + '", "controlNum": "1"}';
    return oamap.callMapFunction('showMarker', jsondata);
};

oamap.removeMarker = function(){

};

oamap.setCenter = function(){
    var jsondata = '{ "layerID": "pillar", "picUrl": "../hbweb/assets/images/roadLight.gif", "jsonData": "LDBM = \'34050401010000002\'", "scale": "2000", "keyCon": 0, "someTxt": "name：圣达菲凯萨琳房间洒落了\nid：的撒范德萨发" }';
    return oamap.callMapFunction('point', jsondata);
};


oamap.buildLinePoint = function(dataList, showPoint, showInfo){
    var strData = '[';
    var picUrl = cms.util.path + '/skin/default/images/railway/gis/';
    var num = 0;
    for(var i=0,c=dataList.length; i<c; i++){
        var dr = dataList[i];
        if(oamap.checkLatLng(dr.lat, dr.lng)){
            var disPoint = (showPoint != undefined ? showPoint : false) ? 1 : 0;
            var disInfo = (showInfo != undefined ? showInfo : false) ? 1 : 0;
            var strIcon = picUrl + 'icon.gif';
            
            var strAction = dr.action != undefined ? dr.action : (dr.code != undefined ? dr.code : '');
            
            strData += i > 0 ? ',' : '';
            strData += '{';
            strData += '"id":"' + dr.id + '"'
                + ',"name":"' + dr.name + '"'
                + ',"GPS_X":"' + dr.lng + '"'
                + ',"GPS_Y":"' + dr.lat + '"'
                + ',"action":"' + strAction + '"'
                + ',"picUrl":"' + strIcon + '"'
                + ',"disPoint":"' + disPoint + '"'
                + ',"disInfo":"' + disInfo + '"'
                + '}';
            num++;
        }
    }
    strData += ']';
    
    return strData;
};

oamap.createLine = function(param, linePointList){
    var jsondata = '{'
        + '"id": "' + param.id + '"'
        + ',"name":"' + param.name + '"'
        + ',"type": "' + param.type + '"'
        + ',"scale": "' + param.scale + '"'
        + ',"color":"' + param.color.replace('#','0x') + '"'
        + ',"width":"' + param.width + '"'
        + ',"alpha":"' + param.alpha + '"'
        + ',"action": "' + param.action + '"'
        + ',"pointsArray": ' + linePointList
        + '}';
        
    return oamap.callMapFunction('createLine', jsondata);
};

oamap.showLine = function(layerId){
    var jsondata = '{"id": "' + layerId + '", "controlNum": "0"}';
    return oamap.callMapFunction('showLine', jsondata);
};

oamap.hideLine = function(layerId){
    var jsondata = '{"id": "' + layerId + '", "controlNum": "1"}';
    return oamap.callMapFunction('showLine', jsondata);
};
