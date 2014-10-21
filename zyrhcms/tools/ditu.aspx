<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ditu.aspx.cs" Inherits="tools_ditu" %>
<!DOCTYPE html>
<html>
<head>
    <title>谷歌地图</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/mapcorrect.js"></script>
    <script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=false"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/safety/marker.js"></script>
</head>
<body oncontextmenu="return false;">
    <div id="mainBox">
        <div id="leftBox" style="width:250px;float:left;">
            <div class="titlebar" style="margin-top:0;padding-left:5px;">显示标记点</div>
            <div style="padding:0 5px;">
                请在下框输入标记点的名称和经纬度坐标，<br />
                可以显示多个，每行一个
                <br />
                格式如下(注意是 英文逗号)：<br />
                名称,纬度,经度
                <br />示例<br />
                武汉站,30.6098,114.4188<br />
                武昌站,30.531,114.3124
                <textarea id="txtMarkerData" style="width:230px;height:300px;" class="txt" rows="" cols="">
武汉站,30.6098,114.4188
武昌站,30.531,114.3124</textarea>
                <a class="btn btnc24" onclick="showMarker();"><span>显示标记</span></a>
                <a class="btn btnc24" onclick="clearMarker();"><span>清除标记</span></a>
            </div>
        </div>
        <div id="mapBox" style="float:right;">
            <div id="formBox" style="height:24px;background:#dbebfe; padding:1px 5px 0;">
                纬度：<input type="text" class="txt" id="txtLat" />
                经度：<input type="text" class="txt" id="txtLng" />
            </div>
            <div id="mapCanvas"></div>
        </div>
    </div>
</body>
</html>

<script type="text/javascript">
var map = null;
var mc = new MapCorrect();
var marker = null;
var arrMarker = [];

$(window).load(function(){
    setBodySize();
    initialMap();
});

$(window).resize(function(){
    setBodySize();
});

var setBodySize = function(){
    var bodySize = cms.util.getBodySize();
    $('#mainBox').height(bodySize.height);
    $('#leftBox').height(bodySize.height);
    $('#mapBox').height(bodySize.height);
    
    $('#mapCanvas').width(bodySize.width - 250);
    $('#mapCanvas').height(bodySize.height - 25);
};


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


var initialMap = function(){
    var mapCanvas = cms.util.$('mapCanvas');
    var myLatlng = new google.maps.LatLng(30.593001325080845, 114.30587768554687);
    var myOptions = {
	    zoom: 12,
	    center: myLatlng,
	    mapTypeControl: true,
        mapTypeControlOptions: {
            mapTypeIds : ['norailgmap',  google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN],
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        panControl: true,
	    zoomControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
	    mapTypeId: google.maps.MapTypeId.HYBRID
    }
    map = new google.maps.Map(mapCanvas, myOptions);

    google.maps.event.addListener(map, 'click', function(event){
        showClickLatLng(event);
        
        if(marker != null){
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
	        position: event.latLng,
	        map: map,
	        title: "Hello World!"
        });
        google.maps.event.addListener(marker, 'click', function(){
            showMarkerLatLng(this);
        });
    });
    
    var baseNoRailMap = new google.maps.StyledMapType(noRailMapStyle, {
		name : '基本地图'
	});
	map.mapTypes.set('norailgmap', baseNoRailMap);
	//map.setMapTypeId('norailgmap');
	
	var RailwayMapType = new google.maps.ImageMapType(RailwayMapTypeOption);
	map.overlayMapTypes.insertAt(0, RailwayMapType);
    
};

var showClickLatLng = function(event){
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    
    var latLng = mc.decode(parseFloat(lat), parseFloat(lng));
    cms.util.$('txtLat').value = latLng.lat;
    cms.util.$('txtLng').value = latLng.lng;
};

var showMarkerLatLng = function(marker){
    var lat = marker.position.lat();
    var lng = marker.position.lng();
    
    var latLng = mc.decode(parseFloat(lat), parseFloat(lng));
    cms.util.$('txtLat').value = latLng.lat;
    cms.util.$('txtLng').value = latLng.lng;
};


var showMarker = function(){
    var strData = cms.util.$('txtMarkerData').value.trim();
    var arrData = strData.split('\r\n');
    
    for(var i=0; i<arrData.length; i++){
        var arrTemp = arrData[i].split(',');
        var latLng = mc.encode(parseFloat(arrTemp[1]), parseFloat(arrTemp[2]));
        var myLatLng = new google.maps.LatLng(latLng.lat, latLng.lng); 
        var marker = new google.maps.Marker({
	        position: myLatLng,
	        map: map,
	        title: arrTemp[0]
        });
        if(0 == i){
            map.setCenter(myLatLng);
        }
        google.maps.event.addListener(marker, 'click', function(){
            showMarkerLatLng(this);
        });
        
        var label = new MyMarker(map, {
            latlng: myLatLng,
            labelText: arrTemp[0]
        });
        
        arrMarker.push([marker, label]);
    }
};

var clearMarker = function(){
    for(var i=0; i<arrMarker.length; i++){
        arrMarker[i][0].setMap(null);
        arrMarker[i][1].setMap(null);
    }
};

</script>