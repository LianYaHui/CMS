var bmap = bmap || {};
bmap.mc = new MapCorrect(14);

bmap.map;
bmap.zoom = 15;
bmap.center = {};

bmap.point;
bmap.marker;

bmap.disTools;
bmap.disToolsIsOpen = false;
bmap.recTools;
bmap.recToolsIsOpen = false;

bmap.initial = function(mapCanvas, center, zoom, options){
    if(typeof center == 'object'){
        bmap.center = center;
    } else {
        bmap.center = {lat: 29.87486251, lng: 121.64026689};
    }
    if(typeof zoom == 'number'){
        bmap.zoom = zoom;
    }
    if(options == undefined){
        options = {};
    }
    bmap.map = new BMap.Map(mapCanvas, options);
    
    var latLng = bmap.gpsConvertBD(bmap.center);
        
    bmap.point = new BMap.Point(latLng.lng, latLng.lat);    // 创建点坐标    
    bmap.map.centerAndZoom(bmap.point, bmap.zoom);
    bmap.map.enableScrollWheelZoom();
    bmap.map.addControl(new BMap.NavigationControl());
    bmap.map.addControl(new BMap.ScaleControl());
    bmap.map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]}));
    bmap.map.addControl(new BMap.OverviewMapControl());
    /*
    bmap.marker = bmap.createMarker({point: bmap.point, label: '地图中心', showLabel: true});    
    bmap.map.removeOverlay(bmap.marker);
    */

    bmap.setCenter(bmap.point);
        
    bmap.disTools = bmap.iniDisTools(bmap.map);
    bmap.recTools = bmap.iniRecTools(bmap.map);
        
    //bmap.buildTools(mapCanvas);
    
    return bmap.map;
};

bmap.gpsConvertBD = function(latLng){
    latLng = bmap.mc.encode(latLng.lat, latLng.lng);
    latLng = bmap.mc.bd_encode(latLng.lat, latLng.lng);
    return latLng;
};

bmap.bdConvertGps = function(latLng){
    latLng = bmap.mc.bd_decode(latLng.lat, latLng.lng);
    latLng = bmap.mc.decode(latLng.lat, latLng.lng);
    return latLng;
};

bmap.setCenter = function(point, map){
    map = map || bmap.map;
    map.setCenter(point);
};

bmap.setMapZoom = function(zoom, map){
    map = map || bmap.map;
    zoom = isNaN(Number(zoom)) ? 15 : Number(zoom);
    map.setZoom(zoom);
};

bmap.setMapType = function(type, map){
    map = map || bmap.map;
    switch(type){
        case 'BMAP_NORMAL_MAP':
        case '地图':
            map.setMapType(BMAP_NORMAL_MAP);
            break;
        case 'BMAP_HYBRID_MAP':
        case '混合':
            map.setMapType(BMAP_HYBRID_MAP);
            break;
    }
};

bmap.createPoint = function(latLng){
    var point = new BMap.Point(latLng.lng, latLng.lat);
    return point;
};

bmap.createMarker = function(param){
    var map = param.map || bmap.map;
    if(map != null){
        var marker = new BMap.Marker(param.point, param.options);
        map.addOverlay(marker);
        
        if(param.label != undefined && param.showLabel){
            if(param.labelOption == undefined){
                param.labelOption = {offset:new BMap.Size(25,25)};
            }
            var label = new BMap.Label(param.label,param.labelOption);
            marker.setLabel(label);
        }
        return marker;
    }
    return null;
};

bmap.removeMarker = function(marker, map){
    map = map || bmap.map;
    map.removeOverlay(marker);
};

bmap.createPolyLine = function(param){
    var map = param.map || bmap.map;
    if(map != null){
        var polyLine = new BMap.Polyline(param.points, param.options);
        map.addOverlay(polyLine);
        
        return polyLine;
    }
    return null;
};

bmap.removePolyLine = function(polyLine, map){
    map = map || bmap.map;
    map.removeOverlay(polyLine);
};

bmap.setBoundsContains = function(point, map){
    map = map || bmap.map;
    var bounds = map.getBounds();
    if(bounds == undefined){
        return false;
    }
    //不在bounds之内则做相应的处理
    if (!bounds.containsPoint(point)){
        map.setCenter(point);
    }
};

bmap.iniDisTools = function(map){
    return new BMapLib.DistanceTool(map);
};

bmap.iniRecTools = function(map){
    return new BMapLib.RectangleZoom(map, {
        followText: "拖拽鼠标进行操作"
    });
};

bmap.disToolsOpen = function(isOpen){
    if(null == bmap.disTools){
        bmap.disTools = bmap.iniDisTools(bmap.map);
    }
    var action = isOpen || !bmap.disToolsIsOpen;
    if(action){
        bmap.disTools.open();
        bmap.disToolsIsOpen = true;
    } else {
        bmap.disTools.close();
        bmap.disToolsIsOpen = false;
    }
};

bmap.recToolsOpen = function(isOpen){
    if(null == bmap.recTools){
        bmap.recTools = bmap.iniRecTools(bmap.map);
    }
    var action = isOpen || !bmap.recToolsIsOpen;
    if(action){
        bmap.recTools.open();
        bmap.recToolsIsOpen = true;
    } else {
        bmap.recTools.close();
        bmap.recToolsIsOpen = false;
    }
};

bmap.buildTools = function(mapCanvas){
    var divTools = document.createElement('div');
    var strTools = '<div>'
        + '<a class="btn btnc22" onclick="bmap.disToolsOpen();"><span>测距</span></a>'
        + '<a class="btn btnc22" onclick="bmap.recToolsOpen();"><span>框选</span></a>'
        + '</div>';
        
    divTools.style.cssText = 'position:absolute;top:10px;left:80px;';
    divTools.innerHTML = strTools;
    mapCanvas.appendChild(divTools);
};