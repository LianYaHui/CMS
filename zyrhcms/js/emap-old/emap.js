var emap = emap || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 220;
var rightWidth = 0;
var switchWidth = 5
var boxSize = {};

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    cms.frame.setFrameSize(leftWidth, rightWidth);
    //先设置尺寸，防止加载时页面布局错乱
    //setBodySize();
    cms.frame.setPageBodyDisplay();
    initialForm();
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true, false, false, false);
    //定时刷新树型菜单设备状态
    tree.timer = window.setTimeout(tree.updateDevStatus, 30*1000, 30*1000);

    setBodySize();
    initialEmap();
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
});

$(window).resize(function(){
    cms.frame.setFrameSize();
    setBodySize();
});

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    
    $('#statusBar').append('<span id="pos1"></span><span id="pos2"></span>');
}

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
    rightWidth = cms.frame.rightWidth;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
}

var setBoxSize = function(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52);
    
    $('#mapCanvas').width(boxSize.width);
    $('#mapCanvas').height(boxSize.height - 25 - 26);
}

var setLeftDisplay = function(obj){
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
}

var initialEmap = function(){
    var mapCanvas = cms.util.$('mapCanvas');
    var myLatlng = new google.maps.LatLng(29.87458, 121.64041);
    var myOptions = {
	    zoom: 12,
	    center: myLatlng,
	    mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(mapCanvas, myOptions);
    var marker = new google.maps.Marker({
	    position: myLatlng,
	    map: map,
	    title: "宁波中研瑞华"
    });
    google.maps.event.addListener(marker, 'click', showWin);
    
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
}

var wid = null;
var showWin = function(){
    var config = {
        id: 'pwemapdev',
        title: '设备信息',
        html: '',
        width: 400,
        height: 300,
        noBottom: true,
        position: 1,
        lock: false
    };
    wid = cms.box.win(config);
}

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
    if(text !== undefined){
        mapCenterDiv.innerHTML = text.name;
        mapCenterDiv.title = text.title;
    } else {
        mapCenterDiv.innerHTML = '中心';
        mapCenterDiv.title = '定位到地图中心';
    }
    mapCenterDiv.onselectstart = function(){return false;} //IE下屏蔽双击选中文字
	mapCenterDiv.unselectable = 'on'; //Opera下屏蔽双击选中文字
    
    google.maps.event.addDomListener(mapCenterDiv, 'click', function() {
        map.setCenter(typeof mapCenter === 'function' ? mapCenter() : mapCenter);
    });
    //将控件添加到顶部右边 （地图类型控件左边）
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(mapCenterDiv);
}

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
}

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
} 