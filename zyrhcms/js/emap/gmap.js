var gmap = gmap || {};
gmap.map = null;
gmap.infoWindow = null;
gmap.zoom = 12;
gmap.center = {lat: 29.87458, lng: 121.64041};
gmap.mc = new MapCorrect();

//是否启用测距功能
gmap.enabledRanging = true;
gmap.isRanging = false;
gmap.isRangingOver = false;
gmap.rangingBox = null;
gmap.arrRangingMarker = [];
gmap.arrRangingLine = [];
gmap.rangingTotal = 0;

//启用坐标经纬度提示
gmap.enabledLocationPrompt = false;
//启用框选放大功能
gmap.enabledMapBoundZoom = true;
//框选 放大/缩小 zoomin zoomout
gmap.mapBoundZoomAction = 'zoomin';
//是否启用基本图层
gmap.enabledBaseNoRailMap = true;
//是否启用铁路图层
gmap.enabledRailwayLayer = true;

gmap.iconPath = {
    marker: 'http://www.google.com/mapfiles/marker.png',
    start: 'http://www.google.com/mapfiles/dd-start.png',
    end: 'http://www.google.com/mapfiles/dd-end.png'
};

//基本地图
gmap.noRailMapStyle = [ 
    { featureType: "road.highway", stylers:[{ visibility: "off" }] },
    { featureType: "road.arterial", stylers:[{ visibility: "simplified" }, { lightness: 48 }] }, 
    { featureType: "transit.station", stylers:[{ visibility: "off" }] }, 
    { featureType: "transit.line", stylers:[{ visibility: "simplified" }, { lightness: 54 }] }, 
    { featureType: "administrative.locality", elementType: "labels", stylers:[{ visibility: "off" }] }
];

//铁路图层
gmap.RailwayMapTypeOption = {
	getTileUrl : function(coord, zoom) {
	    var path = '';
        if (zoom <= 12){
            //path = cms.util.path + "/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
            path = "http://img.railmap.cn/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
        }else{
            //path = cms.util.path + "/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
            path = "http://img.railmap.cn/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
        }
        return path;
	},
	tileSize : new google.maps.Size(256, 256),
	isPng: true,
	name: '铁路',
	alt: '铁路'
};

gmap.createRailwayControl = function(){
    var railwayMapType = gmap.createControl({
        padding: '0',
        margin: cms.util.isMSIE && cms.util.ieVersion() != 7 ? '6px -6px 0 0':'5px -6px 0 0',
        textAlign: 'left',
        html: '<label for="gmapRailwayMapBtn" style="border:solid 1px #7e7567;background:#fff;display:block;width:70px;text-align:center;padding:2px 3px 0;'
            + (cms.util.isMSIE && cms.util.ieVersion() != 7 ? 'height:15px;line-height:15px;' : 'height:24px;line-height:24px;') + '">'
            + '<input type="checkbox" id="gmapRailwayMapBtn" style="padding:0;float:left;'
            + (cms.util.isMSIE && cms.util.ieVersion() != 7 ? 'margin:1px 0 0;width:11px;height:11px;' : (cms.util.ieVersion() == 7 ? 'margin:5px 0 0;' : 'margin:7px 0 0;') + 'width:12px;height:12px;')
            + '" onclick="gmap.setRailwayMapDisplay(this.checked);" />'
            + '<span style="float:left;margin-left:3px;">铁路图层</span><label>'
    }, gmap.map);
    gmap.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(railwayMapType);
};

gmap.setBaseNoRailMapControlDisplay = function(isDisplay){
    gmap.enabledBaseNoRailMap = isDisplay || false;
};

gmap.setRailwayControlDisplay = function(isDisplay){
    gmap.enabledRailwayLayer = isDisplay || false;
};

gmap.setRailwayMapDisplay = function(isDisplay){
    if(isDisplay){
	    var RailwayMapType = new google.maps.ImageMapType(gmap.RailwayMapTypeOption);
	    gmap.map.overlayMapTypes.insertAt(0, RailwayMapType);
	} else {
	    gmap.map.overlayMapTypes.removeAt(0);
	}
};

gmap.initial = function(mapCanvas, center, zoom, mapType){
    if(typeof center == 'object'){
        gmap.center = center;
    }
    if(typeof zoom == 'number'){
        gmap.zoom = zoom;
    }
    var latLng = gmap.mc.offset(gmap.center.lat, gmap.center.lng);
    var myLatLng = new google.maps.LatLng(latLng.lat, latLng.lng);
    var mapTypeId = google.maps.MapTypeId.HYBRID;
    if(mapType != undefined){
        switch(mapType){
            case "HYBRID": mapTypeId = google.maps.MapTypeId.HYBRID; break;
            case "ROADMAP": mapTypeId = google.maps.MapTypeId.ROADMAP; break;
            case "SATELLITE": mapTypeId = google.maps.MapTypeId.SATELLITE; break;
            case "TERRAIN": mapTypeId = google.maps.MapTypeId.TERRAIN; break;
            default: mapTypeId = google.maps.MapTypeId.HYBRID; break;
        }
    }
    var myOptions = {
	    zoom: gmap.zoom,
	    center: myLatLng,
	    mapTypeControl: true,
        panControl: true,
	    zoomControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
        disableDoubleClickZoom: false, //启用/禁用双击放大功能
        mapTypeControlOptions: {
            mapTypeIds : ['baseNoRailMap',  google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN],
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
	    mapTypeId: mapTypeId
    };
    gmap.map = new google.maps.Map(mapCanvas, myOptions);
    
    if(gmap.enabledBaseNoRailMap){
        var baseNoRailMap = new google.maps.StyledMapType(gmap.noRailMapStyle, {
		    name: '基本地图'
	    });
	    gmap.map.mapTypes.set('baseNoRailMap', baseNoRailMap);
	}
	
	if(gmap.enabledRailwayLayer){
	    gmap.createRailwayControl();
	}	
	
    gmap.infoWindow = new google.maps.InfoWindow();
    
    google.maps.event.addListener(gmap.map, 'click', function(event){
        if(gmap.isRanging){ //测量距离
            var marker = gmap.createMarker({
	            position: event.latLng,
	            map: gmap.map,
	            title: '' + gmap.arrRangingMarker.length,
                draggable: true
            });
            gmap.appendRangingPoint(marker, event.latLng);
            
            google.maps.event.addListener(marker, 'dragend', function(event){
                gmap.moveRangingMarker(gmap.map, event, marker);
            });
        } else {
            /*
            var latLng = gmap.mc.revert(event.latLng.lat(), event.latLng.lng());
            var strLatLng = latLng.lat + ',' + latLng.lng;
            gmap.showInfoWindow(strLatLng, event.latLng, gmap.map);
            */
        }
    });
    google.maps.event.addListener(gmap.map, 'rightclick', function(event){
        if(gmap.isRanging){
            var marker = gmap.createMarker({
	            position: event.latLng,
	            map: gmap.map,
	            title: '' + gmap.arrRangingMarker.length,	            
                draggable: false
            });
            gmap.appendRangingPoint(marker, event.latLng, true);
        }
    });
    
    if(gmap.enabledLocationPrompt){
        //鼠标移动时显示坐标经纬度提示信息
        gmap.createPromptBar(gmap.map);
    }
    if(gmap.enabledMapBoundZoom){
        //启用框选放大功能
        gmap.setMapBounds(gmap.map);
    }
    return gmap.map;
};

gmap.createControl = function(options, map){    
    var controlUI = document.createElement('div');
    controlUI.id = options.id || '';
    controlUI.style.backgroundColor = options.background || 'transparent';
    controlUI.style.border = options.border || 'none';
    controlUI.style.cursor = options.cursor || 'pointer';
    controlUI.style.textAlign = options.textAlign || 'center';
    controlUI.style.margin = options.margin || '0';
    controlUI.style.padding = options.padding || '0';
    controlUI.style.minWidth = options.minWidth || 'auto';
    controlUI.style.fontSize = options.fontSize || '12px';
    controlUI.style.lineHeight = options.lineHeight || '1.8';
    controlUI.title = options.title || '';
    controlUI.innerHTML = options.html || '';
    
    if(options.func != undefined && options.func != null && typeof options.func == 'function'){    
        google.maps.event.addDomListener(controlUI, 'click', function() {
            options.func(options.param);
        });
    }
    return controlUI;
};

gmap.createToolbar = function(map, strHtml){
    var toolbarControl = gmap.createControl({
        padding: '0 3px',
        textAlign: 'left',
        html: strHtml
    }, map || gmap.map);
    gmap.map.controls[google.maps.ControlPosition.TOP_LEFT].push(toolbarControl);
};

gmap.createPromptBar = function(map){
    var promptControl = gmap.createControl({
        padding: '0 3px',
        background: '#ffffff'
    }, map);
    gmap.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(promptControl);

    google.maps.event.addListener(map, 'mousemove', function(event){
        var latLng = gmap.mc.revert(event.latLng.lat(), event.latLng.lng());
        promptControl.innerHTML = latLng.lat + ', ' + latLng.lng;
    });
};

gmap.showInfoWindow = function(strInfo, latLng, map){
    gmap.infoWindow.setContent(strInfo);
    gmap.infoWindow.setPosition(latLng);

    gmap.infoWindow.open(map || gmap.map);
};

gmap.setCenter = gmap.setMapCenter = function(latLng, map){
    map = map || gmap.map;
    //map.setCenter(latLng);
    map.panTo(latLng);
    
    var center = map.getCenter();
    gmap.center = {lat: center.lat(), lng: center.lng()};
};

gmap.setZoom = gmap.setMapZoom = function(zoom, map){
    map = map || gmap.map;
    map.setZoom(parseInt(zoom, 10));
    
    gmap.zoom = map.getZoom();
};

gmap.setMapType = function(mapType, map){
    var mapTypeId = null;
    map = map || gmap.map;
    switch(mapType){
        case "HYBRID": mapTypeId = google.maps.MapTypeId.HYBRID; break;
        case "ROADMAP": mapTypeId = google.maps.MapTypeId.ROADMAP; break;
        case "SATELLITE": mapTypeId = google.maps.MapTypeId.SATELLITE; break;
        case "TERRAIN": mapTypeId = google.maps.MapTypeId.TERRAIN; break;
        default: mapTypeId = google.maps.MapTypeId.HYBRID; break;
    }
    map.setMapTypeId(mapTypeId);
};

gmap.createLatLng = function(lat, lng){
    if(typeof lat != 'number'){
        lat = parseFloat(lat, 10);
    }
    if(typeof lng != 'number'){
        lng = parseFloat(lng, 10);
    }
    return new google.maps.LatLng(lat, lng);
};

//创建标记点
gmap.createMarker = function(options){
    var marker = new google.maps.Marker({
	    position: options.position || options.latLng || null,
	    map: options.map || gmap.map,
	    icon: options.icon || '',
	    title: options.title || '',
	    draggable: options.draggable || false,
	    animation: options.animation || null
    });
    google.maps.event.addListener(marker, 'click', function(event){
        var func = 'function' == typeof options.func ? options.func : eval('(' + options.func + ')');
        if('function' == typeof func){
            func(event, options.param);
        } else {
            var latLng = gmap.mc.revert(event.latLng.lat(), event.latLng.lng());
            var strLatLng = latLng.lat + ',' + latLng.lng;
            gmap.showInfoWindow(strLatLng, event.latLng, options.map || gmap.map);
        }
    });
    
    return marker;
};

//创建自定义标记点（带标签文字）
gmap.createLabelMarker = function(options){
    var marker = new LabelMarker(options.position || options.latLng, options.map || gmap.map, {
        id: options.id,
        param: options.param,
        func: options.func,
        image: options.image || null,
        label: options.label || null
    });    
    
    google.maps.event.addListener(marker, "click", function(event) {
        var func = 'function' == typeof marker.func ? marker.func : eval('(' + marker.func + ')');
        if('function' == typeof func){
            func(marker.latLng, marker.id, marker.param);
        } 
    });
    
    return marker;
};

//移除标记点
gmap.removeMarker = function(marker){
    marker.setMap(null);
};

//隐藏标记点
gmap.hideMarker = function(marker){
    marker.setMap(null);
};

//创建折线
gmap.createPolyLine = function(arrLatLng, options){
    options = options || {};
    var polyline = new google.maps.Polyline({
        path: arrLatLng,
        title: options.title || '',
        strokeColor: options.color || "#ff0000",
        strokeOpacity: options.opacity || 0.6,
        strokeWeight: options.weight || 3,
        editable: options.editable || false
    });
    polyline.setMap(options.map || gmap.map);//画折线
    
    google.maps.event.addListener(polyline, 'click', function(event){
        var func = 'function' == typeof options.func ? options.func : eval('(' + options.func + ')');
        if('function' == typeof func){
            func(event, options.param);
        } else {
            gmap.showPolyLineInfo(event, polyline);
        }
    });
    
    return polyline;
};

//显示折线各顶点坐标数据
gmap.showPolyLineInfo = function(ev, polyline){
    var vertices = polyline.getPath();
    var latLng = gmap.mc.revert(ev.latLng.lat(), ev.latLng.lng());

    var strInfo = '<b>折线数据</b><br />';
    
    strInfo += '当前位置经纬度：(' + latLng.lat + ', ' + latLng.lng + ')<br />';
    strInfo += '各顶点经纬度坐标：<br />';

    for (var i =0; i < vertices.getLength(); i++) {
        var xy = vertices.getAt(i);
        latLng = gmap.mc.revert(xy.lat(), xy.lng());
        strInfo += '顶点' + (i + 1) + '. (' + latLng.lat +', ' + latLng.lng + ')<br />';
    }
        
    gmap.showInfoWindow(strInfo, ev.latLng);
};

//移除折线
gmap.removePolyline = function(polyline){
    polyline.setMap(null);
};

//隐藏折线
gmap.hidePolyline = function(polyline){
    polyline.setMap(null);
};

//创建多边形
gmap.createPolygon = function(arrLatLng, options){
    options = options || {};
    var polygon = new google.maps.Polygon({
        paths: arrLatLng,
        strokeColor: options.color || "#ff0000",
        strokeOpacity: options.opacity || 0.8,
        strokeWeight: options.weight || 2,
        fillColor: options.color || "#ff0000",
        fillOpacity: 0.25,
        title: options.title || '',
        draggable: options.draggable || false,
        editable: options.editable || false,
        geodesic: options.geodesic || false
    });
    polygon.setMap(options.map || gmap.map);//画多边形
    
    google.maps.event.addListener(polygon, 'click', function(event){
        var func = 'function' == typeof options.func ? options.func : eval('(' + options.func + ')');
        if('function' == typeof func){
            func(event, options.param);
        } else {
            gmap.showPolygonInfo(event, polygon);
        }
    });
    
    return polygon;
};

//显示多边形各顶点坐标数据
gmap.showPolygonInfo = function(ev, polygon){
    var vertices = polygon.getPath();
    var latLng = gmap.mc.revert(ev.latLng.lat(), ev.latLng.lng());

    var strInfo = '<b>多边形数据</b><br />';
    strInfo += '当前位置经纬度：(' + latLng.lat + ', ' + latLng.lng + ')<br />';
    strInfo += '各顶点经纬度坐标：<br />';

    for (var i =0; i < vertices.getLength(); i++) {
        var xy = vertices.getAt(i);
        latLng = gmap.mc.revert(xy.lat(), xy.lng());
        strInfo += '顶点' + (i + 1) + '. (' + latLng.lat +', ' + latLng.lng + ')<br />';
    }

    gmap.showInfoWindow(strInfo, ev.latLng);
};

//移除多边形
gmap.removePolygon = function(polygon){
    polygon.setMap(null);
};

//隐藏多边形
gmap.hidePolygon = function(polygon){
    polygon.setMap(null);
};

//计算两个经纬度之间的直线距离
gmap.getDistance = function(lat1, lng1, lat2, lng2){
    var R = 6378137;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d * 10) / 10;
};

//经纬度值纠正，经纬度值 应小于180
gmap.latLngRecovery = function(latLng){
    if(typeof latLng != 'number'){
        latLng = parseFloat(latLng, 10);
    }
    while(latLng > 180){
		latLng = latLng / 10;
	}
    return latLng;
};

gmap.dmsNumConvertLatLng = function(dms, decimalDigitsLen){
    if(typeof dms == 'number'){
        //数值纠正，有些设备报上来的数据会无故乘以100或其他倍数
        dms = gmap.latLngRecovery(dms);
        
        var arr = ('' + dms).split('.');
        //取整作为度数
        var d = parseInt(dms, 10);
        //取小数部分前两位 除60 作为分数
        var str = arr[1].substr(2);
        var m = parseInt(arr[1].substr(0, 2));
        var s = parseFloat(str);
        s = s / Math.Pow(10, str.Length) * 60;
        
        return gmap.dmsConvertLatLng(d, m, s, decimalDigitsLen);
    } else {
		var arr = dms.split(/°|′|″|'|"/);
		var d = parseInt(arr[0], 10);
		var m = parseInt(arr[1]);
		var s = arr[2] + (arr.length > 3 ? parseInt(arr[3], 10) / 1000 : 0);
		
		return gmap.dmsConvertLatLng(d, m, s, decimalDigitsLen);
    }
};

//度分秒转换为经纬度坐标值
gmap.dmsConvertLatLng = function(degree, minute, second, decimalDigitsLen){
    var latLng = parseInt(degree, 10) + parseInt(minute, 10) / 60 + parseInt(second, 10) / 3600;
    if(typeof decimalDigitsLen == 'number' && decimalDigitsLen >= 0){
        var pv = Math.pow(10, decimalDigitsLen);
        return Math.round(latLng * pv) /pv;
    }
    return latLng;
};

//经纬度值转换为度分秒
//isShowMS: 是否显示毫秒
gmap.latLngConvertDms = function(latLng, isDMS){
    latLng = parseFloat(latLng, 10);
    var arrDms = [0, 0, 0.0, 0];
    var m = 0;
    var degree = 0;
    var minute = 0;
    var second = 0;
    
    degree = Math.floor(latLng);
    m = (latLng - degree) * 60;
    //取分值整数部分
    minute = Math.floor(m);
    
    if(isDMS){
        second = Math.round((m - minute) * 60 * 1000) / 1000;
        
        return degree + '°' + minute + '′' + second + '″';    
    } else {
        var pv = Math.pow(10, 4);
        second = Math.round((m - minute) * pv) / pv * pv;
        
        return degree + '.' + minute.padLeft(2, '0') + second.padLeft(4, '0');
    }
};

gmap.pointInPolygon = function(arrPoint, point){

};

/*
    地图距离测量工具 开始
*/
//显示测量工具
gmap.showRangingBox = function(btn){
    if(btn != undefined){
        var lang = eval('(' + btn.lang + ')');
        if(lang[0] == btn.rel){
            gmap.hideRangingBox();
            btn.rel = lang[1];
            btn.className = 'btn btnc22';
            return false;
        } else {
            btn.rel = lang[0];
            btn.className = 'btn btn22';
        }
    }
    if(gmap.arrRangingMarker.length == 0 || !gmap.isRangingOver){
        gmap.isRanging = true;
    }
    var size = [217, 240];
    var strHtml = '<div style="padding:0 5px;">'
        + '<span style="height:25px; line-height:25px;">点击地图可跟踪您要测量的路线</span>'
        + '<div id="divGmapRangingData" style="height:' + (size[1] - 25 - 35 - 25*2) + 'px;overflow:auto;padding:0;"></div>'
        + '<div id="divGmapRangingTotal" style="height:29px;line-height:28px;padding:5px 0 0;font-size:14px;"></div>'
        + '<a id="btnGmapRangingDelete" onclick="gmap.deleteLastRangingPoint();" class="btn btnc22"><span>删除最后一个点</span></a>'
        + '<a id="btnGmapRangingClear" onclick="gmap.clearRangingData();" class="btn btnc22" style="margin-left:5px;"><span>清除</span></a>'
        + '</div>';
    var config = {
        id: 'pwGmapRanging',
        title: '距离测量工具',
        html: strHtml,
        noBottom: true,
        width: size[0],
        height: size[1],
        lock: false,
        position: 7,
        closeType: 'hide',
        build: 'show',
        reload: false,
        showClose: false
    };
    gmap.rangingBox = cms.box.win(config);
    
    gmap.setRangingForm();
    gmap.showRangingTrack(0, 20);
};

//隐藏测量工具
gmap.hideRangingBox = function(){
    gmap.isRanging = false;
    if(gmap.rangingBox != null){
        gmap.rangingBox.Hide();
    }
    gmap.hideRangingTrack();
};

//回放显示测量轨迹
gmap.showRangingTrack = function(idx, timing){
    if(gmap.arrRangingMarker.length == 0) return false;
    gmap.arrRangingMarker[idx][0].setMap(gmap.map);
    gmap.arrRangingMarker[idx][1].setMap(gmap.map);
    if(idx > 0){
        gmap.arrRangingLine[idx - 1][0].setMap(gmap.map);
    }
    if(idx > 1){
        gmap.arrRangingMarker[idx - 1][0].setMap(null);
    }
    if(idx++ < gmap.arrRangingMarker.length - 1){
        window.setTimeout(gmap.showRangingTrack, timing, idx);
    } else {
        //当最后一个点不在可视范围内，则将地图中心移至最后一个点
        gmap.setBoundsContains(gmap.arrRangingMarker[idx - 1][2], gmap.map);    
    }
};

//隐藏测量轨迹
gmap.hideRangingTrack = function(){
    var len = gmap.arrRangingMarker.length;
    if(0 == len) return false;    
    for(var i = len - 1; i >= 0; i--){
        gmap.arrRangingMarker[i][0].setMap(null);
        gmap.arrRangingMarker[i][1].setMap(null);
    }
    
    len = gmap.arrRangingLine.length;    
    for(var i = len - 1; i >= 0; i--){
        gmap.arrRangingLine[i][0].setMap(null);
    }
};

//清除测量数据
gmap.clearRangingData = function(){
    if(gmap.arrRangingMarker.length > 0){
        gmap.hideRangingTrack();
        
        gmap.arrRangingMarker.length = 0;
        gmap.arrRangingLine.length = 0;
        gmap.rangingTotal = 0;
        
        gmap.setRangingForm();
    }
    
    gmap.isRanging = true;
    gmap.isRangingOver = false;
};

gmap.setRangingForm = function(){
    var len = gmap.arrRangingMarker.length;
    if(len > 0){
        $('#btnGmapRangingDelete').attr('disabled', false);
        $('#btnGmapRangingClear').attr('disabled', false);    
    } else {
        $('#divGmapRangingData').html('');
        $('#divGmapRangingTotal').html('');
        $('#btnGmapRangingDelete').attr('disabled', true);
        $('#btnGmapRangingClear').attr('disabled', true);
    }
};

//删除最后一个点
gmap.deleteLastRangingPoint = function(){
    var len = gmap.arrRangingMarker.length;
    var pv = Math.pow(10, 4);
    var km = 1000;
    
    gmap.isRanging = true;
    gmap.isRangingOver = false;
    if(0 == len){
        return false;
    }
    gmap.arrRangingMarker[len - 1][0].setMap(null);
    gmap.arrRangingMarker[len - 1][1].setMap(null);
//    if(len > 2){
//        var strLabel = '<nobr>' + '总长：' + (Math.round(gmap.rangingTotal / km * pv)/pv) + '公里' + '</nobr>';
//        gmap.arrRangingMarker[len - 2][1].setLabel(strLabel);
//    }
    gmap.arrRangingMarker.splice(len - 1, 1);    
    
    if(len > 1){
        gmap.arrRangingMarker[len - 2][0].setMap(gmap.map);
        gmap.rangingTotal -= gmap.arrRangingLine[len - 2][1];
        
        $('#divGmapRangingTotal').html('总距离：' + (Math.round(gmap.rangingTotal / km * pv)/pv) + '公里');
        $('#divGmapRangingData li:last-child').remove();
        gmap.arrRangingLine[len - 2][0].setMap(null);
        gmap.arrRangingLine.splice(len - 2, 1);
    } else {
        gmap.setRangingForm();
    }
};

//追加测量轨迹点
gmap.appendRangingPoint = function(marker, evLatLng, isOver){
    var len = gmap.arrRangingMarker.length;
    var strLabel = '';
    var idx = len;
    if(0 == idx){
        marker.setIcon(gmap.iconPath.start);
        strLabel = '起点';
    } else {
        marker.setIcon(gmap.iconPath.end);    
    }
    if(isOver){
        gmap.isRanging = false;
        gmap.isRangingOver = true;
    }
    if(idx > 0){
        var arrLinePath = [gmap.arrRangingMarker[idx - 1][2], evLatLng];
        var polyLine = gmap.createPolyLine(arrLinePath,{
            title: '测量线路' + idx
        });
        
        var latLng = gmap.mc.revert(gmap.arrRangingMarker[idx - 1][2].lat(), gmap.arrRangingMarker[idx - 1][2].lng());
        var latLng1 = gmap.mc.revert(evLatLng.lat(), evLatLng.lng());
    
        var distance = gmap.getDistance(latLng.lat, latLng.lng, latLng1.lat, latLng1.lng);
        gmap.rangingTotal += distance;
        
        var pv = Math.pow(10, 4);
        var km = 1000;
        
        var strDistance = '<li>第' + (len) + '段:&nbsp;' + (Math.round(distance / km * pv)/pv) + '公里</li>';
        
        strLabel = (isOver ? '总长：' : '') + (Math.round(gmap.rangingTotal / km * pv)/pv) + '公里';
        
        gmap.arrRangingLine.push([polyLine, distance, strDistance]);
        
        $('#divGmapRangingData').append(strDistance);
        $('#divGmapRangingTotal').html('总距离：' + (Math.round(gmap.rangingTotal / km * pv)/pv) + '公里');
        
        $('#divGmapRangingData').scrollTop($('#divGmapRangingData')[0].scrollHeight);
    }
    if(len > 1){
        //隐藏前一个标记点
        gmap.arrRangingMarker[idx - 1][0].setMap(null);
    }
    
    var label = gmap.createLabelMarker({
        position: evLatLng,
        map: gmap.map,
        label: {
            html: '<nobr>' + strLabel + '</nobr>'
        }
    });
    
    gmap.arrRangingMarker.push([marker, label, evLatLng]);
    gmap.setRangingForm();
};

//移动测量点
gmap.moveRangingMarker = function(map, e, marker){
    //删除最后一个点
    gmap.deleteLastRangingPoint();
    //追加当前点
    gmap.appendRangingPoint(marker, e.latLng);
    
    marker.setMap(map);
};
/*
    地图距离测量工具 结束
*/

/*
    地图框选 开始
*/
gmap.setMapBounds = function(map){
    var rectangle = new google.maps.Rectangle({
        map : map,
        bounds : new google.maps.LatLngBounds(map.getCenter(),map.getCenter()),
        strokeColor : "#FF0000",
        strokeWeight : "1",
        strokeOpacity : 1,
        fillColor : "#E6ECEA",
        fillOpacity : 0.2
    });
        
    map.enableKeyDragZoom({
        key: "shift",
        action: 'zoomin',
        boxStyle: {
            border: "1px dashed black",
            backgroundColor: "transparent",
            opacity: 1
        },
        veilStyle: {
            backgroundColor: "gray",
            opacity: 0.1
        }/*,
        visualEnabled: true,
        visualPosition: google.maps.ControlPosition.LEFT,
        visualPositionOffset: new google.maps.Size(35, 0),
        visualPositionIndex: null,
        visualSprite: "",
        visualSize: new google.maps.Size(20, 20),
        visualTips: {
            off: "单击启用框选放大",
            on: "单击取消框选放大"
        }
        */
        
    });    
    
    gmap.map = map;
    
    var dz = map.getDragZoomObject();
    google.maps.event.addListener(dz, "dragend", function(bnds){
        rectangle.setBounds(bnds);
		window.setTimeout(function(){
			rectangle.setBounds(null);
		}, 2000);
    });
};

gmap.setBoundsAction = function(action, btn){
    if('' == action){
        gmap.map.dragZoom_.hotKeyDown_ = false;    
    } else {
        gmap.map.dragZoom_.action = action;
        
        if(btn != undefined){
            var lang = eval('(' + btn.lang + ')');
            if(lang[0] == btn.rel){
                gmap.hideRangingBox();
                btn.rel = lang[1];
                gmap.map.dragZoom_.hotKeyDown_ = false;
                btn.className = 'btn btnc22';
                return false;
            } else {
                btn.rel = lang[0];
                gmap.map.dragZoom_.hotKeyDown_ = true;
                btn.className = 'btn btn22';
            }
        }
    }
};

/*
    地图框选 结束
*/

gmap.setBoundsContains = function(latLng, map){
    map = map || gmap.map;
    var bounds = map.getBounds();
    if(bounds == undefined){
        return false;
    }
    //不在bounds之内则做相应的处理
    if (!bounds.contains(latLng)){
        /*
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var northEastX = ne.x;
        var northEastY = ne.y;
        var southWestX = sw.x;
        var southWestY = sw.y;
        var center = map.getCenter();
        var lng = center.lng();
        var lat = center.lat();
        var px = latLng.lng();
        var py = latLng.lat();
        if (px <= southWestX){ //出左边界
            var minusRt = southWestX - px;
            center = new google.maps.LatLng(lat, lng - minusRt);
        } else if (px >= northEastX) { //出右边界
            var minusRt = px - northEastX;
            center = new google.maps.LatLng(lat, lng + minusRt);
        } else if (py >= northEastY) { //出上边界
            var minusRt = py - northEastY;
            center = new google.maps.LatLng(lat + minusRt, lng);
        } else if (py <= southWestY) { //出下边界
            var minusRt = southWestY - py;
            center = new google.maps.LatLng(lat - minusRt, lng);
        }
        */
        map.setCenter(latLng);
    }
};