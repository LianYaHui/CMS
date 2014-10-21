<%@ Page Language="C#" AutoEventWireup="true" CodeFile="setPatrolTaskMap.aspx.cs" Inherits="modules_gprsConfig_tools_setPatrolTaskMap" %>
<!DOCTYPE html>
<html>
<head>
    <title>地图找巡检点</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/mapcorrect.js"></script>
    <script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=false"></script>
</head>
<body>
    <div id="mapCanvas">
    
    </div>
    <div></div>
</body>
</html>
<script type="text/javascript">
$(window).load(function(){
    setBodySize();
});

$(window).resize(function(){
    setBodySize();
});

var setBodySize = function(){
    var bodySize = cms.util.getBodySize();
    $('#mapCanvas').width(bodySize.width);
    $('#mapCanvas').height(bodySize.height - 30);
    
    gmap.initial(cms.util.$('mapCanvas'));
};

var gmap = gmap || {};
gmap.zoom = 12;
gmap.center = {lat: 29.87458, lng: 121.64041};
gmap.mc = new MapCorrect();

gmap.initial = function(mapCanvas, center, zoom){
    var myLatlng = new google.maps.LatLng(gmap.center.lat, gmap.center.lng);
    var myOptions = {
	    zoom: gmap.zoom,
	    center: myLatlng,
	    mapTypeControl: true,
        panControl: true,
	    zoomControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
	    mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(mapCanvas, myOptions);
    
    google.maps.event.addListener(map, 'click', function(event){        
        new google.maps.Marker({
	        position: event.latLng,
	        map: map,
	        draggable: true
        });
        var latLng = gmap.mc.revert(event.latLng.lat(), event.latLng.lng());
        var param = {type:'point', pointId:0, pointName:'', latitude:latLng.lat, longitude:latLng.lng, radii:50};        
        parent.gprsConfig.setPatrolPoint(param);
    });
    
    //google.maps.event.addListener(marker, 'click', showWin);
    /*
    google.maps.event.addListener(map, 'mousedown', function(event){
        $('#pos1').html('MouseDown:' + event.latLng);
        new google.maps.Marker({
	        position: event.latLng,
	        map: map
        });
    });
    google.maps.event.addListener(map, 'mouseup', function(event){
        $('#pos2').html('MouseUp:' + event.latLng);
    });
    */
    return true;
};
</script>
