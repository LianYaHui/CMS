var emap = emap || {};
emap.zoom = 11;
emap.map = null;
emap.measure = false;
emap.measureMarkers = [];
emap.measurePolyline = [];
emap.marker = null;

var noRailMapStyle = [{
	featureType : "road.highway",
	stylers : [{
		visibility : "off"
	}]
}, {
	featureType : "road.arterial",
	stylers : [{
		visibility : "simplified"
	}, {
		lightness : 48
	}]
}, {
	featureType : "transit.station",
	stylers : [{
		visibility : "off"
	}]
}, {
	featureType : "transit.line",
	stylers : [{
		visibility : "simplified"
	}, {
		lightness : 54
	}]
}, {
	featureType : "administrative.locality",
	elementType : "labels",
	stylers : [{
		visibility : "off"
	}]
}, {
}];
var mapOptions = {
	center : new google.maps.LatLng(40, 116),
	zoom : 5,
	mapTypeControlOptions : {
		mapTypeIds : [google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN]
	}
};
var RailwayMapTypeOption = {
	getTileUrl : function(coord, zoom) {
	    var path = '';
        if (zoom <= 12){
            //path = cms.util.path + "/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
            path = "http://img.railmap.cn/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
    		//return "http://railmap.cn/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
        }else{
            //path = cms.util.path + "/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
            path = "http://img.railmap.cn/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
		    //return "http://railmap.cn/tile/" + zoom + "/" + coord.x + "-" + coord.y + ".png";
        }
        //appendImagePath(path);
        return path;
	},
	tileSize : new google.maps.Size(256, 256),
	isPng : true,
	name : '铁路',
	alt : '铁路'
};

var getRailwayImage = function(path){
    
}

emap.initialEmap = function(){
    var mapCanvas = cms.util.$('mapCanvas');
    var myLatlng = new google.maps.LatLng(30.64145672280775,114.29763793945312);
    var myOptions = {
	    zoom: emap.zoom,
	    center: myLatlng,
	    mapTypeControl: true,
        mapTypeControlOptions: {
            mapTypeIds : ['norailgmap',  google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN],
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
	    zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        scaleControl: true,
        scaleControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT
        },
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        overviewMapControl: true,
        overviewMapControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
	    //mapTypeId: google.maps.MapTypeId.HYBRID
	    mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = emap.map = new google.maps.Map(mapCanvas, myOptions);
    /*
    var marker = new google.maps.Marker({
	    position: myLatlng,
	    map: map,
	    title: "Hello World!"
    });
    google.maps.event.addListener(marker, 'click', function(){
        showWin(this);
    });
    */
    google.maps.event.addListener(map, 'click', function(event){
        //emap.distanceFrom(event, map);
    });
    
    var baseNoRailMap = new google.maps.StyledMapType(noRailMapStyle, {
		name : '基本地图'
	});
	map.mapTypes.set('norailgmap', baseNoRailMap);
	map.setMapTypeId('norailgmap');
	
	var RailwayMapType = new google.maps.ImageMapType(RailwayMapTypeOption);
	map.overlayMapTypes.insertAt(0, RailwayMapType);
	
	//map.mapTypes.set('railmap', RailwayMapTypeOption);
		
    google.maps.event.addListener(map, 'center_changed', function(){
        //loadTileStat(map.getZoom());
    });
    google.maps.event.addListener(map, 'zoom_changed', function(){
        //loadTileStat(map.getZoom());
    });
    
    HomeControl(map, myLatlng,{name:'中心',title:'定位到地图中心'});
}

emap.setMapCenter = function(lat, lng){
    var myLatlng = new google.maps.LatLng(lat, lng);
    emap.map.setCenter(myLatlng);
};

var distanceFrom = function(obj){
    emap.measure = !emap.measure;
    var strHtml = '<div>距离测量工具</div>'
        + '点击地图可跟踪您要测量的路线。';
    if(emap.measure){
        var config = {
            id: 'pwMapMeasure',
            title: '地图测距',
            html: strHtml,
            width: 316,
            height: 400,
            position: 7,
            noBottom: true,
            lock: false
        };
        cms.box.win(config);
    }
    alert(emap.measure);
};

//添加地图中心控件
function HomeControl(map, mapCenter, text){
    var mapCenterDiv = document.createElement('DIV');
    mapCenterDiv.style.cssText = 'width:40px;height:25px;padding:1px 0 0;line-height:25px;background:#fff;border:solid 1px #717b87;'
        + 'text-align:center;cursor:pointer;font-size:13px;color:#000;font-family:宋体;margin:5px -6px 0 0;'
        + '-moz-user-select:none;-khtml-user-select:none;user-select:none;';
    var isMSIE = navigator.userAgent.indexOf('MSIE') >= 0;
    if(isMSIE){
        mapCenterDiv.style.height = '17px';
        mapCenterDiv.style.lineHeight = '17px';
    }
    if(text != undefined){
        mapCenterDiv.innerHTML = text.name;
        mapCenterDiv.title = text.title;
    } else {
        mapCenterDiv.innerHTML = '中心';
        mapCenterDiv.title = '定位到地图中心';
    }
    mapCenterDiv.onselectstart = function(){return false;} //IE下屏蔽双击选中文字
	mapCenterDiv.unselectable = 'on'; //Opera下屏蔽双击选中文字
    
    google.maps.event.addDomListener(mapCenterDiv, 'click', function() {
        map.setCenter(typeof mapCenter == 'function' ? mapCenter() : mapCenter);
    });
    //将控件添加到顶部右边 （地图类型控件左边）
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(mapCenterDiv);
};

/*计算两个坐标之间的距离*/
function DistanceFrom(startLatlng, endLatlng){
    var lat = [startLatlng.lat(), endLatlng.lat()];
    var lng = [startLatlng.lng(), endLatlng.lng()];
    var R = 6378137;
    var dLat = (lat[1] - lat[0]) * Math.PI / 180;
    var dLng = (lng[1] - lng[0]) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d);
};

/*
根据距离计算经纬度差值
距离单位：米
*/
function LatLngFrom(distance, type){
    var lngdis = 95856.63859388379;
    var latdis = 111325.120670763;
    switch(type){
        case 'lat':
            return distance/latdis;
            break;
        case 'lng':
            return distance/lngdis;
            break;
    }
}; 

var wid = null;
var showWin = function(marker){
    var config = {
        id: 'pwemapdev',
        title: '设备信息',
        html: '铁路应急预案指挥系统',
        width: 200,
        height: 200,
        noBottom: true,
        position: 5,
        lock: false,
        opacity: 0.95
    };
    wid = cms.box.win(config);
};

emap.distanceFrom = function(event, map){
    if(emap.measure){
        emap.marker = emap.addMarker(event.latLng, map, {});// new google.maps.LatLng(30.64145672280775,114.29763793945312);
        emap.measureMarkers.push(emap.marker);
        var len = emap.measureMarkers.length;
        if(len == 1){
            emap.marker.icon = 'http://ditu.google.cn/mapfiles/dd-start.png';
        } else {
            emap.marker.icon = ' http://labs.google.com/ridefinder/images/mm_20_red.png';
            
            var polyline = emap.drawOverlay(emap.measureMarkers, map, {});
            emap.measurePolyline.push(polyline);
        }
        emap.marker.title = len + ' ' + event.latLng;
    } else {
        if(emap.marker != null){
            emap.marker.setMap(null);
        }
        emap.marker = emap.addMarker(event.latLng, map, {});// new google.maps.LatLng(30.64145672280775,114.29763793945312);
    }
};

emap.addMarker = function(latLng, map, option){
    var marker = new google.maps.Marker({
	    position: latLng,
	    map: map,
	    title: option.title || '',
	    icon: option.icon || ''
    });
    return marker;
};

emap.drawOverlay = function(markers, map, option){
    var flightPlanCoordinates = [];
    for(var i in markers){
        flightPlanCoordinates.push(markers[i].getPosition());
    }
    var polyline = new google.maps.Polyline({
        path: flightPlanCoordinates,
        map: map,
        strokeColor: option.color || '#ff0000',
        strokeOpacity: option.opacity || 0.9,
        strokeWeight: option.weight || 2
    });
    return polyline;
};