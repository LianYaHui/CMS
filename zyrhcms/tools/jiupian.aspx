<%@ Page Language="C#" AutoEventWireup="true" CodeFile="jiupian.aspx.cs" Inherits="tools_jiupian" %>
<!DOCTYPE html>
<html>
<head>
    <title>谷歌地图 支柱经纬度坐标纠偏</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/mapcorrect.js"></script>
    <script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=false"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/safety/marker.js"></script>
    <script type="text/javascript" src="jiupian.js"></script>
</head>
<body oncontextmenu="return false;">
    <div id="mainBox" style="background:#dfe8f6;">
        <div id="leftBox" style="float:left;border-right:solid 1px #99bbe8;">
            <div class="titlebar" style="margin-top:0;text-indent:5px;">显示支柱坐标位置</div>
            <div style="padding:0 5px 0;height:150px;">
                <table cellpadding="0" cellspacing="0" class="tbform">
                    <tr>
                        <td>线别：</td>
                        <td><select id="ddlLine" class="select w240" onchange="changeLine(this);"></select></td>
                    </tr>
                    <tr>
                        <td>区间：</td>
                        <td><select id="ddlLineRegion" class="select w240" onchange="changeLineRegion();"><option>选择区间</option></select></td>
                    </tr>
                    <tr>
                        <td>行别：</td>
                        <td><select id="ddlUpDown" class="select w240" onchange="changeLineRegion();"></select></td>
                    </tr>
                    <tr>
                        <td>锚段：</td>
                        <td><select id="ddlTensionLength" class="select w240"><option>选择锚段</option></select></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <a class="btn btnc22" onclick="getPillarList();"><span>加载支柱信息</span></a>
                            <a class="btn btnc22" onclick="setConditionDisabled(false);"><span>重新选择锚段</span></a>
                            <input type="hidden" id="txtParentId" class="txt w50" readonly="readonly" />
                        </td>
                    </tr>
                </table>
            </div>
            <div class="listheader">
                <table cellpadding="0" cellspacing="0" class="tbheader" id="tbHeader">
                    <tr>
                        <td style="width:25px;">序号</td>
                        <td style="width:100px;">支柱名称</td>
                        <td style="width:72px;">纬度</td>
                        <td style="width:72px;">经度</td>
                        <td style="width:80px;">操作</td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <div class="list" style="background:#fff;" id="divList">
                <table cellpadding="0" cellspacing="0" class="tblist" id="tbList"></table>
            </div>
            <div class="statusbar statusbar-h30">
                <a class="btn btnc24" onclick="jiupian.showMarker(-1, 1);" style="margin-left:5px;"><span>全选</span></a>
                <a class="btn btnc24" onclick="jiupian.showMarker(-1, 3);"><span>反选</span></a>
                <a class="btn btnc24" onclick="jiupian.showMarker(-1, 2);"><span>取消</span></a>
                
                <div style="float:right;">
                    <a class="btn btnc24" onclick="jiupian.buildResult();" style="margin-right:5px;"><span>生成结果</span></a>
                </div>
            </div>
        </div>
        <div id="mapBox" style="float:right;">
            <div id="formBox" style="height:24px;background:#dbebfe; padding:0 5px 0;border-bottom:solid 1px #99bbe8;">
                纬度：<input type="text" class="txt" id="txtClickLat" />
                经度：<input type="text" class="txt" id="txtClickLng" />
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
    
    jiupian.getRailwayLineList(cms.util.$('ddlLine'), '');
    //jiupian.getLineRegionList(cms.util.$('ddlLineRegion'), '', '');
    jiupian.getUpDownLine(cms.util.$('ddlUpDown'), '');
    //jiupian.getTensionLengthList(cms.util.$('ddlTensionLength'), '', '', '');
    
});

var changeLine = function(obj){
    jiupian.getLineRegionList(cms.util.$('ddlLineRegion'), obj.value.trim(), '');
};

var changeLineRegion = function(){
    jiupian.getTensionLengthList(cms.util.$('ddlTensionLength'), cms.util.$('ddlLineRegion').value.trim(), '', cms.util.$('ddlUpDown').value.trim());
};

var getPillarList = function(){
    var tensionLengthIndexCode = cms.util.$('ddlTensionLength').value.trim();
    var tbHeader = cms.util.$('tbHeader');
    var tbList = cms.util.$('tbList');
    
    if('' == tensionLengthIndexCode){
        alert('请选择锚段');
        return false;
    }
    //记录当前锚段编号
    cms.util.$('txtParentId').value = tensionLengthIndexCode;
    
    jiupian.getPillarList('', tensionLengthIndexCode, tbHeader, tbList);
    
    setConditionDisabled(true);
};

var setConditionDisabled = function(disabled){
    
    cms.util.$('ddlLine').disabled = disabled;
    cms.util.$('ddlLineRegion').disabled = disabled;
    cms.util.$('ddlUpDown').disabled = disabled;
    cms.util.$('ddlTensionLength').disabled = disabled;
};

$(window).resize(function(){
    setBodySize();
});

var setBodySize = function(){
    var bodySize = cms.util.getBodySize();
    var leftWidth = 380;
    $('#leftBox').width(leftWidth - 1);
    $('#mainBox').height(bodySize.height);
    $('#leftBox').height(bodySize.height);
    $('#divList').height(bodySize.height - 150 - 25*2 - 30);
    
    $('#mapBox').height(bodySize.height);
    
    $('#mapCanvas').width(bodySize.width - leftWidth);
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
	    zoom: 15,
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
        
        var idx = jiupian.changeLatLng(event.latLng.lat(), event.latLng.lng());
        marker = new google.maps.Marker({
	        position: event.latLng,
	        map: map,
	        title: idx
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
    cms.util.$('txtClickLat').value = latLng.lat;
    cms.util.$('txtClickLng').value = latLng.lng;
};

var showMarkerLatLng = function(marker){
    var lat = marker.position.lat();
    var lng = marker.position.lng();
    
    var latLng = mc.decode(parseFloat(lat), parseFloat(lng));
    cms.util.$('txtClickLat').value = latLng.lat;
    cms.util.$('txtClickLng').value = latLng.lng;
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