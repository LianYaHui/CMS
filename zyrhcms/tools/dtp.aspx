<%@ Page Language="C#" AutoEventWireup="true" CodeFile="dtp.aspx.cs" Inherits="tools_dtp" %>
<!DOCTYPE html>
<html>
<head>
    <title>标记铁路线路点 - 谷歌地图</title>
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
        <div id="leftBox" style="float:left;border-right:solid 1px #99bbe8;">
            <div class="titlebar" style="margin-top:0;text-indent:5px;">显示标记点</div>
            <div style="padding:0 5px;height:200px;" id="divForm">
                <div style="padding:5px 0;">
                    <div style="color:#f00;">
                        说明：先选择线别 => 加载标记点
                    </div>
                    <table cellpadding="0" cellspacing="0">
                        <tr>
                            <td>选择线路：</td>
                            <td>
                                <select id="ddlLine" class="select">
                                    <option value="0">选择线路</option>
                                    <option value="1">合武线</option>
                                    <option value="11">合武线1</option>
                                    <option value="12">合武线2</option>
                                    <option value="2">汉宜线</option>
                                    <option value="21">汉宜线1-已完成</option>
                                    <option value="22">汉宜线2</option>
                                    <option value="31">武广线1</option>
                                    <option value="33">武广线11</option>
                                    <option value="3">武广线2-已完成</option>
                                    <option value="32">武广线3</option>
                                </select>
                            </td>
                            <td>
                                <a class="btn btnc22" style="margin-left:5px;" onclick="getMarkerInfo();"><span>加载标记点</span></a>
                            </td>
                        </tr>
                    </table>
                    <input type="hidden" id="txtLineId" value="0" />
                    <textarea id="txtMarkerData" rows="" cols="" style="width:290px;height:100px;padding:0;display:none;" class="txt"></textarea>                    
                </div>
            </div>
            <div class="titlebar" style="margin-top:0;text-indent:5px;">标记点</div>
            <div class="listheader">
                <table class="tbheader" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="width:25px;"><input type="checkbox" id="chbAll" onclick="switchMarkerBatchDisplay();" /></td>
                        <td style="width:30px;">序号</td>
                        <td style="width:70px;">纬度</td>
                        <td style="width:70px;">经度</td>
                        <td style="width:50px;">操作</td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <div class="list" id="divList" style="background:#fff;">
                <table class="tblist" id="tbList" cellpadding="0" cellspacing="0"></table>
            </div>
            <div class="statusbar statusbar-h52">
                <label id="lblPrompt" style="height:20px; line-height:20px; display:block;padding:0 5px;"></label>
                <a class="btn btnc24" onclick="saveMarkerInfo();" style="margin-left:5px;"><span class="w40">保存</span></a>
                <label id="lblSave"></label>
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

var arrMarker = [];
var idx = 0;

var leftW = 350;
var formH = 120;
var statusH = 52;

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
    $('#leftBox').width(leftW - 1);
    $('#leftBox').height(bodySize.height);
    $('#mapBox').height(bodySize.height);
    
    $('#mapCanvas').width(bodySize.width - leftW);
    $('#mapCanvas').height(bodySize.height - 25);
    
    $('#divForm').height(formH);
    $('#divList').height(bodySize.height - formH - statusH - 25*2 - 23);
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
        /*
        if(marker != null){
            marker.setMap(null);
        }
        */
        var markerId = getMarkerIndex();
        var marker = new google.maps.Marker({
            id: markerId,
	        position: event.latLng,
	        map: map,
	        //title: '' + markerId,
            draggable: true
        });

        google.maps.event.addListener(marker, 'click', function(){
            showMarkerLatLng(this);
        });
        
        google.maps.event.addListener(marker, 'dragend', function(event){
            moveMarker(event, marker);
        });

        var label = new MyMarker(map, {
            latlng: event.latLng,
            labelText: markerId + 1
        });
        
        arrMarker.push({marker: marker, label: label, lat: event.latLng.lat(), lng: event.latLng.lng()});        
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
        
    var latLng = mc.revert(parseFloat(lat, 10), parseFloat(lng, 10));
    appendMarkerInfo(latLng.lat, latLng.lng);
    
    setOperPrompt();
};

//显示某个标记点坐标
var showMarkerLatLng = function(marker){
    var lat = marker.position.lat();
    var lng = marker.position.lng();
    
    var latLng = mc.decode(parseFloat(lat), parseFloat(lng));
    cms.util.$('txtLat').value = latLng.lat;
    cms.util.$('txtLng').value = latLng.lng;
    
    appendMarkerInfo(latLng.lat, latLng.lng);
};

var getMarkerInfo = function(){
    var lineId = parseInt(cms.util.$('ddlLine').value.trim(), 10);
    if(lineId == 0){
        return false;
    }
    //记录线路ID
    cms.util.$('txtLineId').value = lineId;
    
    var urlparam = 'action=getMarkerInfo&lineId=' + lineId;
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
        url: cms.util.path + '/tools/dtpAjax.aspx',
        data: urlparam,
        error: function(data){ },
        success: function(data){
            var strData = data;
            
            var jsondata = eval('(' + strData + ')');
            if(1 == jsondata.result){
                showMarkerInfo(jsondata);
            }
            delete strData;
            delete jsondata;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) === 'function'){CollectGarbage();} }
    });
};

//显示已有的标记点数据
var showMarkerInfo = function(jsondata){    
    var objList = cms.util.$('tbList');
    cms.util.clearDataRow(objList, 0);
    clearMarker();
    
    var list = jsondata.list;
    for(var i=0,c=list.length; i<c; i++){ 
        arrMarker.push({lat: list[i].lat, lng: list[i].lng});   
        
        appendMarkerInfo(list[i].lat, list[i].lng, list[i].id, i);
    }
    
    showMarkerLabel(list, 0);
};

//显示已有标记点
var showMarkerLabel = function(list, i){
    var c = list.length;
    var markerId = i;
    var latLng = mc.offset(parseFloat(list[i].lat, 10), parseFloat(list[i].lng, 10));
    
    var myLatLng = new google.maps.LatLng(latLng.lat, latLng.lng);
    var marker = new google.maps.Marker({
        id: markerId,
        position: myLatLng,
        map: map,
        //title: '' + markerId,
        draggable: true
    });

    google.maps.event.addListener(marker, 'click', function(){
        showMarkerLatLng(this);
    });
    
    google.maps.event.addListener(marker, 'dragend', function(event){
        moveMarker(event, marker);
    });
            
    var label = new MyMarker(map, {
        latlng: myLatLng,
        labelText: markerId + 1
    });
    
    if(c - 1 == i){
        map.setCenter(myLatLng);
    }    
    
    arrMarker[i].marker = marker;
    arrMarker[i].label = label;
    if(i < c - 1){
        showMarkerLabel(list, ++i);
    }
};

var clearMarker = function(){
    for(var i=0,c=arrMarker.length; i<c; i++){
        arrMarker[i].marker.setMap(null);
        arrMarker[i].label.setMap(null);
    }
    arrMarker.length = 0;
};

var appendMarkerInfo = function(lat, lng, mid, rid){
    var objList = cms.util.$('tbList');
    if(rid == undefined){
        rid = arrMarker.length;    
    }
    var row = objList.insertRow(rid);
    var rowData = [];
    var cellid = 0;
    
    mid = undefined == mid ? '0' : mid;
        
    var strLat = '<input type="text" name="txtLat" id="txtLat_' + rid + '" class="txt w60" style="border:none;background:#fff;" readonly="readonly" value="' + lat + '" />';
    var strLng = '<input type="text" name="txtLng" id="txtLng_' + rid + '" class="txt w60" style="border:none;background:#fff;" readonly="readonly" value="' + lng + '" />';
    
    rowData[cellid++] = {html: '<input name="chbmarker" id="chb_' + rid + '" type="checkbox" value="' + rid + '" checked="checked" onclick="switchMarkerDisplay(this.value);" />', style:[['width','25px']]}; //选择
    rowData[cellid++] = {html: (rid + 1), style:[['width','30px']]}; //序号
    rowData[cellid++] = {html: strLat, style:[['width','70px']]}; //纬度
    rowData[cellid++] = {html: strLng, style:[['width','70px']]}; //经度
    rowData[cellid++] = {html: '', style:[['width','50px']]}; //操作
    
    rowData[cellid++] = {html: '<input type="hidden" readonly="readonly" class="txt w30" name="txtId" id="txtId_' + rid + '" value="' + mid + '" />'
        + '<input type="hidden" readonly="readonly" class="txt w20" style="width:10px;" name="txtUpdate" id="txtUpdate_' + rid + '" value="0" />'
    }; 
    
    cms.util.fillTable(row, rowData);    
};

var moveMarker = function(ev, marker){
    var id = marker.id;
    var latLng = ev.latLng;
        
    var txtLat = cms.util.$('txtLat_' + id);
    var txtLng = cms.util.$('txtLng_' + id);
    var txtUpdate = cms.util.$('txtUpdate_' + id);
    
    //移动标签
    arrMarker[id].label.setMap(null);
    
    var label = new MyMarker(map, {
        latlng: ev.latLng,
        labelText: id + 1
    });
    
    arrMarker[id].label = label;    
   
    var newLatLng = mc.revert(parseFloat(ev.latLng.lat()), parseFloat(ev.latLng.lng()));
    
    txtLat.value = newLatLng.lat;
    txtLng.value = newLatLng.lng;
    txtUpdate.value = '1';
    
    setOperPrompt();
};

var switchMarkerDisplay = function(id){
    var obj = cms.util.$('chb_' + id);
    if(obj.checked){
        arrMarker[id].marker.setMap(map);
        arrMarker[id].label.setMap(map);
        
        //设置地图以当前标记点为中心
        map.setCenter(arrMarker[id].marker.position);
    } else {
        arrMarker[id].marker.setMap(null);
        arrMarker[id].label.setMap(null);
    }
    
    if(cms.util.getCheckBoxChecked('chbmarker').length == cms.util.$N('chbmarker').length){
        cms.util.$('chbAll').checked = true;
    } else {
        cms.util.$('chbAll').checked = false;    
    }
    
};

var switchMarkerBatchDisplay = function(){
    cms.util.selectCheckBox('chbmarker', 3);
    
    var arrChb = cms.util.$N('chbmarker');
    for(var i=0,c=arrChb.length; i<c; i++){
        if(arrChb[i].checked){
            arrMarker[i][0].setMap(map);
            arrMarker[i][1].setMap(map);
        } else {
            arrMarker[i][0].setMap(null);
            arrMarker[i][1].setMap(null);        
        }
    }
};

var getMarkerIndex = function(){
    return arrMarker.length;
};

var saveMarkerInfo = function(){
    var lineId = cms.util.$('txtLineId').value.trim();
    var arrId = cms.util.$N('txtId');
    var arrLat = cms.util.$N('txtLat');
    var arrLng = cms.util.$N('txtLng');
    var arrUpdate = cms.util.$N('txtUpdate');
    var markerData = '';
    var n = 0;
    for(var i=0,c=arrId.length; i<c; i++){
        if(parseInt(arrId[i].value.trim(), 10) == 0 || 1 == parseInt(arrUpdate[i].value.trim(), 10)){
            markerData += (n++ > 0 ? '|' : '') + arrId[i].value.trim() + ',' + arrLat[i].value.trim() + ',' + arrLng[i].value.trim();            
        }
    }
    var urlparam = 'action=saveMarkerInfo&lineId=' + lineId + '&markerData=' + markerData;
    
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
        url: cms.util.path + '/tools/dtpAjax.aspx',
        data: urlparam,
        error: function(data){ },
        success: function(data){
            var strData = data;
            
            var jsondata = eval('(' + strData + ')');
            if(1 == jsondata.result){
                getMarkerInfo();
                setSavePrompt(new Date().toString('yyyy-MM-dd HH:mm:ss') + ' 保存成功');
            } else {
                alert('保存失败');
            }
            delete strData;
            delete jsondata;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) === 'function'){CollectGarbage();} }
    });
};

var setOperPrompt = function(){
    var arrId = cms.util.$N('txtId');
    var arrUpdate = cms.util.$N('txtUpdate');    
    var ac = 0;
    var uc = 0;
    
    for(var i=0,c=arrId.length; i<c; i++){
        if('0' == arrId[i].value.trim()){
            ac++;
        } else if('1' == arrUpdate[i].value.trim()){
            uc++;
        }
    }
    var strHtml = '';
    
    if(ac > 0){
        strHtml += '新增了' + ac + '个标记点';
    }
    if(uc > 0){
        strHtml += (strHtml != '' ? '，' : '') + '修改了' + uc + '个标记点';    
    }
    
    cms.util.$('lblPrompt').innerHTML = strHtml;
};

var setSavePrompt = function(str){
    cms.util.$('lblSave').innerHTML = str;
};

/*

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
*/

</script>