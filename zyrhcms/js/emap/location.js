var emap = emap || {};

var paddingTop = 0;
var paddingWidth = 0;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 0;
var rightWidth = rightWidthConfig = 0;
var switchWidth = 0
var boxSize = {};

var marker = null;

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    cms.frame.setFrameSize(leftWidth, rightWidth);
    cms.frame.setPageBodyDisplay();
    initialForm();

    setBodySize();
});

$(window).resize(function(){
    cms.frame.setFrameSize();
    setBodySize();
});

var initialForm = function(){    
    initialMap();
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    $('#pageBody').css('padding-top', paddingTop);
    
    boxSize = {
        width: frameSize.width - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
};

var setBoxSize = function(){
    $('#mapCanvas').width(boxSize.width);
    $('#mapCanvas').height(boxSize.height - 25 - 30);
};

var initialMap = function(){
    var obj = cms.util.$('mapCanvas');
    if('gmap' == mapConfig.mapEngine){
        gmap.initial(obj, mapConfig.mapCenter, mapConfig.mapZoom, mapConfig.mapType);
        
        var strHtml = '<div id="mapToolbar" style="margin-right:5px;">';
        strHtml += '<a class="btn btnc22" onclick="switchMapToolbarButton(\'zoomin\', this);" rel="release" lang="[\'press\',\'release\']"><span>拉框放大</span></a>'
            + '<a class="btn btnc22" onclick="switchMapToolbarButton(\'zoomout\', this);" rel="release" lang="[\'press\',\'release\']"><span>拉框缩小</span></a>';
        strHtml += '</div>';
        $('#toolbar').html(strHtml);
    } else if('bmap' == mapConfig.mapEngine){
        bmap.initial(obj);
        bmap.setMapType(mapConfig.mapType);
    }
        
    $('#toolbar .chb').focus(function(){
        this.blur();
    });
    
    createMarker(strLatLng);
};

var switchMapToolbarButton = function(action, btn){
    $('#mapToolbar a').removeClass();
    $('#mapToolbar a').addClass('btn btnc22');
    var rel = btn.rel;
    $('#mapToolbar a').attr('rel', 'release');
    btn.rel = rel;
    
    if(action == 'zoomin' || action == 'zoomout'){
        gmap.setBoundsAction(action, btn);
        gmap.hideRangingBox();
    } else if(action == 'ranging'){ 
        gmap.showRangingBox(btn);
        gmap.setBoundsAction('');
    }
};

var clearDeviceGps = function(){
    //清除已有的标记
    for(var i=0,c=arrDevMarker.length; i<c; i++){
        gmap.removeMarker(arrDevMarker[i].marker);
    }
    arrDevMarker.length = 0;
};

var createMarker = function(strLatLng){
    if(strLatLng != ''){
        var arr = strLatLng.split(',');
        if(arr.length != 2){
            return false;
        }
        var lat = arr[0];
        var lng = arr[1];
        
        if('gmap' == mapConfig.mapEngine){
            var latLng = gmap.mc.offset(parseFloat(lat, 10), parseFloat(lng, 10));
            if(marker != null){
                gmap.removeMarker(marker);
            }
            marker = gmap.createMarker({
                position: gmap.createLatLng(latLng.lat, latLng.lng),
                draggable: true,
                animation: true
            });
            
            google.maps.event.addListener(marker, 'dragend', function(event){
                moveMarker(event.latLng);
            });
            
            gmap.setCenter(gmap.createLatLng(latLng.lat, latLng.lng));
        } else if('bmap' == mapConfig.mapEngine){
            var latLng = {lat: parseFloat(lat, 10), lng: parseFloat(lng, 10)};
            latLng = bmap.gpsConvertBD(latLng);
            if(marker != null){
                bmap.removeMarker(marker);
            }
            
            var point = new BMap.Point(latLng.lng, latLng.lat);    // 创建点坐标
            marker = bmap.createMarker({
                map: bmap.map, point: point, options:{enableDragging: true},label:strTitle,showLabel:false
            });
            
            marker.addEventListener('dragend', function(ev){
                var p = this.getPosition();
                
                var latLng = {lat: p.lat, lng: p.lng};
                markerLatLng = bmap.bdConvertGps(latLng);
            
                var pn = Math.pow(10,8);
                markerLatLng.lat = Math.round(markerLatLng.lat*pn)/pn;
                markerLatLng.lng = Math.round(markerLatLng.lng*pn)/pn;
                
                moveMarker(markerLatLng);
            });   
            
            bmap.setCenter(point);
        }
    } else {
        if('gmap' == mapConfig.mapEngine){
            google.maps.event.addListener(gmap.map, 'click', function(event){
                if(null == marker){
                    marker = gmap.createMarker({
                        position: event.latLng,
                        map: gmap.map,
                        draggable: true
                    });
                    moveMarker(event.latLng);
                    google.maps.event.addListener(marker, 'dragend', function(event){
                        moveMarker(event.latLng);
                    });
                }
            });
        } else if('bmap' == mapConfig.mapEngine){
            bmap.map.addEventListener("click",function(e){
                if(marker == null){
                    var point = e.point;    // 创建点坐标
                    marker = bmap.createMarker({
                        map: bmap.map, point: point, options:{enableDragging: true},label:'地图中心',showLabel:true
                    });
                    marker.addEventListener('dragend', function(ev){
                        var p = this.getPosition();
                        markerLatLng = bmap.bdConvertGps({lat: p.lat, lng: p.lng});
                    
                        var pn = Math.pow(10,8);
                        markerLatLng.lat = Math.round(markerLatLng.lat*pn)/pn;
                        markerLatLng.lng = Math.round(markerLatLng.lng*pn)/pn;
                        
                        moveMarker(markerLatLng)
                    });
                    
                    
                    var latLng = {lat: e.point.lat, lng: e.point.lng};
                    latLng = bmap.bdConvertGps(latLng);
                    
                    var pn = Math.pow(10,8);
                    latLng.lat = Math.round(latLng.lat*pn)/pn;
                    latLng.lng = Math.round(latLng.lng*pn)/pn;
                    
                    moveMarker(latLng);
                }
            });
        }
    }
};

var moveMarker = function(evLatLng){
    if('gmap' == mapConfig.mapEngine){
        var latLng = gmap.mc.revert(evLatLng.lat(), evLatLng.lng());
        $('#lblLatLng').html(latLng.lat + ',' + latLng.lng);
    } else if('bmap' == mapConfig.mapEngine){
        $('#lblLatLng').html(evLatLng.lat + ',' + evLatLng.lng);    
    }
};

var setLocation = function(flag){
    var strLatLng = '';
    if(flag){
        strLatLng = $('#lblLatLng').html().trim();
    } else {
        strLatLng = $('#txtLatLng').val().trim();
    }
    if(strCallBack != ''){
        var func = eval('(' + strCallBack + ')');
        func(strLatLng, flag);
    }    
};

var resetLocation = function(){
    var strLatLng = $('#txtLatLng').val().trim();
    $('#lblLatLng').html(strLatLng);    
    createMarker(strLatLng);
    if(strCallBack != ''){
        var func = eval('(' + strCallBack + ')');
        func(strLatLng);
    }  
};