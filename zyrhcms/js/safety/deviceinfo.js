var safety = safety || {};
safety.device = safety.device || {};

safety.device.curTensionLengthIndexCode = '';
safety.device.curDevType = 10100;

safety.device.markers = [];
safety.device.labels = [];

safety.device.getDeviceList = function(type, indexCode, objHeader, objList){
    var urlparam = '';
    switch(type){
        case 10100:
            urlparam = 'action=getPillarList&indexCode=' + indexCode;
            break;
    }
    if(urlparam.equals('')){
        cms.util.clearDataRow(objList, 0);
        return false;
    }
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/controlcenter.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            try{
                if(!data.isJsonData()){
                    module.showJsonErrorData(data);
                    return false;
                } else {
                    var jsondata = data.toJson();//eval('(' + data + ')');
                    if(jsondata.result == 1){
                        if(jsondata.wsResult.result == 1){
                            safety.device.showDeviceList(jsondata.list, objHeader, objList);
                        } else {
                            alert(jsondata.wsResult.error);
                        }
                    } else {
                        alert(jsondata.error);
                    }
                }
            } catch(ex){
                alert('获取支柱信息失败。错误信息如下：\r\n' + data);
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

safety.device.showDeviceList = function(dataList, objHeader, objList){
    var rid = 0;
    var cellid = 0;
    var rowData = [];
    var ci = 0;
    
    cms.util.clearDataRow(objHeader, 0);
    
    var rh = objHeader.insertRow(0);
    rowData[cellid++] = {html: '序号', style:[['width','25px']]};
    rowData[cellid++] = {html: '名称', style:[['width','100px']]};
    rowData[cellid++] = {html: '纬度', style:[['width','80px']]};
    rowData[cellid++] = {html: '经度', style:[['width','80px']]};
    rowData[cellid++] = {html: '', style:[]};
        
    cms.util.fillTable(rh, rowData);
         
    cms.util.clearDataRow(objList, 0);
    
    var arrMarkerDataList = [];
    var strIcon = cms.util.path + '/skin/default/images/railway/gis/pillar.gif';

    for(var i=0; i<dataList.length; i++){
        var dr = dataList[i];
        var row = objList.insertRow(rid);
        rowData = [];
        cellid = 0;
        
        var strName = '<span>' + cms.util.fixedCellWidth(dr.name, 80, true, dr.name) + '</span>';

        row.lang = '{pid:\'' + dr.pid + '\',code:\'' + dr.code + '\',name:\'' + dr.name + '\',lat:\'' + dr.lat + '\',lng:\'' + dr.lng + '\'}';

        row.ondblclick = function(){
            var lang = eval('(' + this.lang + ')');
            if(lang.lat == ''){
                safety.device.showDeviceDetail(lang.pid, lang.name);
            } else {
                //safety.device.createMarker(lang.lat, lang.lng, lang.pid, lang.code, lang.name);
                safety.device.showDeviceDetail(lang.pid, lang.name);
            }
        };

        rowData[cellid++] = {html: (rid + 1), style:[['width','25px']]};
        rowData[cellid++] = {html: dr.name, style:[['width','100px']]};
        rowData[cellid++] = {html: dr.lat, style:[['width','80px']]};
        rowData[cellid++] = {html: dr.lng, style:[['width','80px']]};
        rowData[cellid++] = {html: '', style:[]};

        cms.util.fillTable(row, rowData);
        
        if((''+dr.lat) != '' && (''+dr.lat) != '0' && (''+dr.lng) != '' && (''+dr.lng) != '0'){
            arrMarkerDataList.push({
                id: dr.name,
                name: dr.name,
                action: dr.pid,
                lat: dr.lat,
                lng: dr.lng,
                icon: strIcon
            })
        }

        rid++;
        ci++;
    }
    
    var markerDataList = oamap.buildMarkerData(arrMarkerDataList, 'pillar', true);
    if(markerDataList != '[]'){
        oamap.createMarker({id: 'pillar', scale:oamap.scale}, markerDataList);
    }
};

//显示锚段详细信息
safety.device.showTensionLengthDetail = function(indexCode, name){
    //打开第三方平台锚段详细信息页面
    var url = thirdPartyPage.tensionLength.format(indexCode);    
    //alert('锚段：' + url);
    var config = {
        id: 'pwTensionLengthDetail',
        title: '锚段详细信息',
        html: url,
        width: 800,
        height: 450,
        boxType: 'iframe',
        requestType: 'iframe',
        noBottom: true,
        maxAble: true,
        showMinMax: true,
        lock: false
    };
    
    cms.box.win(config);
};

safety.device.showDeviceDetail = function(parentIndexCode, indexCode, type, name){
    //打开第三方平台支柱详细信息页面
    var url = thirdPartyPage.pillarInfo.format([indexCode,parentIndexCode]);
    //alert('支柱信息：' + url);
    var config = {
        id: 'pwDeviceDetail',
        title: '详细信息',
        html: url,
        width: 800,
        height: 500,
        boxType: 'iframe',
        requestType: 'iframe',
        noBottom: true,
        maxAble: true,
        showMinMax: true,
        lock: false
    };
    
    cms.box.win(config);
};

//在地图中定位设备
safety.device.createMarker = function(lat, lng, pcode, code, name, type){
    
    var strIcon = '';
    switch(type){
        case 10100:
            strIcon = cms.util.path + '/skin/default/images/railway/gis/pillar.gif';
            break;
        default:
            strIcon = cms.util.path + '/skin/default/images/railway/gis/pillar.gif';
            break;
    }
    
    var myLatlng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
	    position: myLatlng,
	    map: emap.map,
	    icon: strIcon,
	    title: name
    });
    safety.device.markers.push(marker);
        
    emap.setMapCenter(lat, lng);
    var label = new MyMarker(emap.map, {
        latlng: myLatlng,
        labelText: name
    });
    
    safety.device.labels.push(label);
    
    google.maps.event.addListener(marker, 'click', function(){
        safety.device.showDeviceDetail(pcode, code, type, name);
    });
};

safety.device.clearMarker = function(){
    for(var i=0; i<safety.device.markers.length; i++){
        safety.device.markers[i].setMap(null);
        safety.device.labels[i].setMap(null);
    }
};