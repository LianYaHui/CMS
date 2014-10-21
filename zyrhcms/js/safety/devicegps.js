var safety = safety || {};
safety.gps = safety.gps || {};

safety.gps.markers = [];
safety.gps.labels = [];

safety.gps.isShow = true;
safety.gps.timer = null;

safety.gps.showDeviceLocation = function(){
    safety.gps.getDeviceGps();
    safety.gps.timer = window.setInterval(safety.gps.getDeviceGps, 15*1000);
    safety.gps.isShow = true;
};

safety.gps.getDeviceGps = function(){
    var urlparam = 'action=getDeviceBaseInfoList&unitId=';
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/device.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata = data.toJson();//eval('(' + data + ')');
            if(jsondata.result == 1){
                safety.gps.showDeviceGps(jsondata.list, jsondata.now);
            } else {
                //alert('e1:' + jsondata.error);
            }
        }
    });
};

safety.gps.clearMarker = function(){
    for(var i=0; i<safety.gps.markers.length; i++){
        safety.gps.markers[i].setMap(null);
        safety.gps.labels[i].setMap(null);
    }
    clearInterval(safety.gps.timer);
    safety.gps.isShow = false;
};

safety.gps.showDeviceGps = function(dataList, now){
    if(safety.gps.markers.length > 0){
        safety.gps.clearMarker();
        
        safety.gps.markers = [];
        safety.gps.labels = [];
    }
    
    var strIcon = '';//cms.util.path + '/skin/default/images/railway/train.png';
    
    var mc = new MapCorrect();

    for(var i=0; i<dataList.length; i++){
        if(dataList[i].latitude.equals('')){
            continue;
        }
        var latlng = mc.offset(parseFloat(dataList[i].latitude), parseFloat(dataList[i].longitude));
        var lat = latlng.lat;
        var lng = latlng.lng;
        var isOnline = parseInt(dataList[i].status3G, 10) == 1;
        
        var strIcon = cms.util.path + '/skin/default/images/railway/';
        strIcon += (isOnline ? 'train_on.png' : 'train_off.png');
        /*
        switch(parseInt(config[2])){
            case 1:
                strIcon += (isOnline ? 'train_on.png' : 'train_off.png');
                break;
            case 2:
                strIcon += (isOnline ? 'truck_on.png' : 'truck_off.png');
                break;
        }
        */
        var myLatlng = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
	        position: myLatlng,
	        map: emap.map,
	        icon: strIcon,
	        title: dataList[i].devCode + '_' + dataList[i].devName
	        //title: config[0]
        });
        
        safety.gps.markers.push(marker);
        
        var label = new MyMarker(emap.map, {
            latlng: myLatlng,
            labelText: dataList[i].devName
        });
        
        safety.gps.labels.push(label);
        
        google.maps.event.addListener(marker, 'click', function(){
            safety.gps.showDevGpsWin(event, this);
        });
    }
};

safety.gps.showDevGpsWin = function(e, marker){
    var evt = window.event || arguments.callee.caller.arguments[0];
    var pos = {x: evt.clientX, y: evt.clientY};
    var arrDev = marker.title.split('_');
    var strHtml = '<div style="padding:5px;">'
        + ' <a class="preview-icon" onclick="module.showPreview(\'' + arrDev[0] + '\',\'' + arrDev[1] + '\');" style="padding-left:18px;">视频预览</a>' 
        + ' <a class="playback-icon" onclick="module.showPlayBack(\'' + arrDev[0] + '\',\'' + arrDev[1] + '\');" style="padding-left:18px;">录像回放</a>' 
        + ' <a class="gpstrack-icon" onclick="module.showGpsTrack(\'' + arrDev[0] + '\',\'' + arrDev[1] + '\');" style="padding-left:18px;">GPS轨迹回放</a>'
        + '</div>';
    
    var config = {
        id: 'pwLandmark12',
        title: arrDev[1],
        html: strHtml,
        position: 'custom',
        x: pos.x,
        y: pos.y,
        width: 240,
        height: 60,
        bgOpacity: 0.3,
        noBottom: true,
        titleBgColor: '#fff',
        titleBorderStyle: 'none',
        lock: false
    };
    cms.box.win(config);
};

safety.gps.checkDevIsOnline = function(now, lastGpsTime){
    var dtNow = now.toDate();
    var dtGpsTime = lastGpsTime.toDate();
    
    var ts = dtNow.timeDifference(dtGpsTime) / 1000;
    
    return ts <= 30;
};