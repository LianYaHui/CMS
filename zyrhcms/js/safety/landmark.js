var landmark = landmark || {};

landmark.arrType = [];
landmark.arrMarker = [];
landmark.htType = new cms.util.Hashtable();
landmark.arrSupplyMarker = {markers:[],labels:[],showGis: false};
landmark.showSupply = false;

landmark.iniMarkerList = function(){
    for(var i=0; i<landmark.arrType.length; i++){
        var arr = {
            id: landmark.arrType[i].type,
            isShow: false,
            isShowGis: false,
            markers: [],
            labels: []
        };
        
        landmark.arrMarker.push(arr);
    }
};

//设置当前选中的地标类型
landmark.setTypeChecked = function(obj){
    var type = obj.value;
    var idx = landmark.getArrayIndex(parseInt(type));
    if(obj.checked){
        if(!landmark.htType.contains(type)){
            landmark.htType.add(type, type);
        }
    } else {
        if(landmark.htType.contains(type)){
            landmark.htType.remove(type);
        }
    }
};

landmark.showLandmarkType = function(btnId, showSupply){
    if(landmark.arrType.length > 0){
        landmark.buildLandmarkType(landmark.arrType, btnId, showSupply);
    } else {
        var urlparam = 'action=getLandmarkType&isInLAN=' + (isInLAN ? 1 : 0);
        $.ajax({
            type: 'post',
            //async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/baseinfo.aspx',
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
                landmark.arrType = jsondata.list;
                
                landmark.iniMarkerList();
                landmark.buildLandmarkType(landmark.arrType, btnId, showSupply);
            },
            complete: function(XHR, TS){ 
                XHR = null; 
                if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
            }
        });
    }
};

landmark.showDevLocation = function(obj){
    if(obj.checked){
        safety.gps.showDeviceLocation();
    } else {
        safety.gps.clearMarker();
    }
};

landmark.buildLandmarkType = function(arrType, btnId, showSupply){    
    var size = [120, 200];
    var obj = $('#' + btnId);
    var pos = [
        obj.offset().left - size[0] + obj.width() + 8,
        obj.offset().top + obj.height() - 1
    ];
    var strHtml = '';
    var strChecked = '';
    var strClick = '';
    var strName = '';
    
    //视频设备默认显示
    landmark.htType.add(1, 1);
        
    for(var i=0; i<arrType.length; i++){
        strChecked = landmark.htType.contains(arrType[i].type) ? ' checked="checked" ' : '';
        strName = 1 == arrType[i].type ? 'chbVideoDevice' : 'chbLandmarkType';
        strClick = 1 == arrType[i].type ? ' landmark.showDevLocation(this);' : 'landmark.getLandmark(' + showSupply + ');';
        strHtml += '<label class="chb-label-nobg">'
            + '<input type="checkbox" class="chb" name="' + strName + '" ' + strChecked + ' onclick="' + strClick + '" value="' + arrType[i].type + '" />'
            + '<span>' + arrType[i].name + '(' + arrType[i].dataCount + ')</span>'
            + '</label><br />';
    }
    var config = {
        id: 'pwLandmarkType',
        title: '地标类型',
        html: strHtml,
        position: 'custom',
        x: pos[0],
        y: pos[1],
        width: size[0],
        height: size[1],
        noBottom: true,
        closeType: 'hidden',
        build: 'show',
        reload: false,
        lock: false,
        zindex: 1001,
        titleBgColor: '#dbebfe',
        titleBorderStyle: 'none',
        boxBgColor: '#dbebfe'
    };
    
    cms.box.win(config);
};

landmark.getLandmark = function(showSupply){
    landmark.getLandmarkList(showSupply);  
    
    var arrObj = cms.util.$N('chbLandmarkType');
    for(var i=0; i<arrObj.length; i++){
        landmark.setTypeChecked(arrObj[i]);
    }
};

landmark.getLandmarkList = function(showSupply){
    var strTypeIdList = cms.util.getCheckBoxCheckedValue('chbLandmarkType', ',');
    if(strTypeIdList.equals('')){
        landmark.clearLandmark();
        return false;
    }
    var urlparam = 'action=getLandmarkList&typeIdList=' + strTypeIdList;
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/baseinfo.aspx',
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
            landmark.showLandmark(jsondata.landmark, showSupply);
            
            delete jsondata;
            delete data;
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
    
    landmark.clearLandmark();
};

//单击标记 显示标记详细信息
landmark.showLandmarkDetail = function(param){
    var option = eval('(' + param + ')');
    
    //显示所亭详情
    if(option.type >= 5 && option.type <= 8){
        deviceDetail.showSubstationDetail(option.code);
    } else if(option.type == 4 && option.showSupply){
        supply.showSupplyInfo(option.code, option.name);
    }
    
    delete param;
};

//获得标签文字颜色
landmark.getLabelColor = function(type){
    var strColor = '#000';
    switch(type){
        case 2:
            strColor = '#000';
            break;
        case 3:
            strColor = '#800080';
            break;
        case 4:
            strColor = '#ff8c00';
            break;
        case 5:
        case 6:
        case 7:
        case 8:
            strColor = '#12bb26';
            break;
    }
    return strColor;
};

landmark.showLandmarkBase = function(){
    var param = {
        code: '',
        name: '武汉供电段',
        left: 956,
        top: 1330,
        icon: strImgPathDir + 'base.gif',
        showLabel: true,
        labelBg: 'Transparent',
        labelBorder: 'none',
        labelColor: '#f00'
        /*,
        func: landmark.showLandmarkDetail,
        val: '{type:' + typeId + ',code:\'' + dr.code + '\',name:\'' + dr.name + '\',showSupply:' + showSupply + '}'
        */
    };
    var marker = omap.showMarker(param);
};

//显示段部
landmark.showLandmarkBaseInGis = function(){
    var dataList = [{
        code: 'base',
        name: '武汉供电段',
        lat: 30.618364,
        lng: 114.243756,
        icon: strImgPathDir + 'gis/base.gif',
        action: 'base'
    }];
    var markerDataList = oamap.buildMarkerData(dataList, 'base', true);
    if(markerDataList != '[]'){
        oamap.createMarker({id: 'base', scale:oamap.scale}, markerDataList);
    }
};

landmark.showLandmark = function(arrMarker, showSupply){
    var imgPath = strImgPathDir; //cms.util.path + '/skin/default/images/railway/';
    if(isInLAN){
        for(var i=0,c=arrMarker.length; i<c; i++){
            var typeId = arrMarker[i].type;
            if(typeId > 5 && typeId <= 8){
                typeId = 5;
            }
            var idx = landmark.getArrayIndex(arrMarker[i].type);
            
            landmark.arrMarker[idx].isShow = true;
            
            for(var j=0,cc=arrMarker[i].list.length; j<cc; j++){
                var dr = arrMarker[i].list[j];
                var icon = imgPath + typeId + '.gif';
                if(dr.left > 0 && dr.top > 0){
                    var param = {
                        code: dr.code,
                        name: dr.name,
                        left: dr.left,
                        top: dr.top,
                        icon: icon,
                        showLabel: true,
                        labelColor: landmark.getLabelColor(typeId),
                        func: landmark.showLandmarkDetail,
                        val: '{type:' + typeId + ',code:\'' + dr.code + '\',name:\'' + dr.name + '\',showSupply:' + showSupply + '}'

                    };
                    var marker = omap.showMarker(param);
                    
                    landmark.arrMarker[idx].markers.push(marker);
                }
                //创建一个action,作为GIS地图标记 回调函数的参数
                arrMarker[i].list[j].action = arrMarker[i].list[j].code;
                
                delete dr;
            }
            
            //在ArcGIS中显示地图标记
            var dataList = arrMarker[i].list;
            var markerDataList = oamap.buildMarkerData(dataList, typeId, true);
            if(markerDataList != '[]'){
                landmark.arrMarker[idx].isShowGis = true;
                oamap.createMarker({id: typeId, scale:oamap.scale}, markerDataList);
            }
        }
    } else {
        for(var i=0,c=arrMarker.length; i<c; i++){
            var idx = landmark.getArrayIndex(arrMarker[i].type);
            
            if(!landmark.arrMarker[idx].isShow){
                var myLatlng = new google.maps.LatLng(parseFloat(arrMarker[i].lat), parseFloat(arrMarker[i].lng));
                
                var strIcon = imgPath + arrMarker[i].icon;
                var strName = arrMarker[i].name;
                var marker = new google.maps.Marker({
	                position: myLatlng,
	                map: emap.map,
	                icon: strIcon,
	                title: strName
                });
                landmark.arrMarker[idx].markers.push(marker);
                
                var label = new MyMarker(emap.map, {
                    latlng: myLatlng,
                    labelText: strName
                });
                
                landmark.arrMarker[idx].labels.push(label);
            }
        }
    }
};

landmark.clearLandmark = function(){
    var arrObj = cms.util.$N('chbLandmarkType');
    if(isInLAN){
        for(var i=0; i<arrObj.length; i++){
            if(!arrObj[i].checked){
                var idx = landmark.getArrayIndex(arrObj[i].value);
                
                landmark.arrMarker[idx].isShow = false;
                var arrMarker = landmark.arrMarker[idx].markers;

                for(var j=0,c=arrMarker.length; j<c; j++){
                    omap.removeMarker(arrMarker[j]);
                }
                
                if(landmark.arrMarker[idx].isShowGis){
                    oamap.hideMarker(landmark.arrMarker[idx].id);
                }
            }
        }
    } else {
        for(var i=0; i<arrObj.length; i++){
            if(!arrObj[i].checked){
                var idx = landmark.getArrayIndex(arrObj[i].value);
                
                landmark.arrMarker[idx].isShow = false;
                var arrMarker = landmark.arrMarker[idx].markers;
                var arrLabel = landmark.arrMarker[idx].labels;
                
                for(var j=0,c=arrMarker.length; j<c; j++){
                    arrMarker[j].setMap(null);
                    arrLabel[j].setMap(null);
                }
            }
        }
    }
};

landmark.getArrayIndex = function(id){
    for(var i=0,c=landmark.arrMarker.length; i<c; i++){
        if(parseInt(id) == parseInt(landmark.arrMarker[i].id)){
            return i;
        }
    }
    return -1;
};


/*获取应急物资*/
landmark.getSupplyInfo = function(btn, showSupply){
    showSupply = showSupply == undefined ? btn.lang == '0' : showSupply;
    btn.lang = showSupply ? '1' : '0';
    if(showSupply){
        var urlparam = 'action=getLandmarkList&typeIdList=' + 4;
        $.ajax({
            type: 'post',
            //async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/baseinfo.aspx',
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
                landmark.showSupplyInfo(jsondata.landmark, showSupply);
                
                delete jsondata;
                delete data;
            },
            complete: function(XHR, TS){ 
                XHR = null; 
                if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
            }
        });
    } else {
        if(landmark.arrSupplyMarker.showGis){
            oamap.hideMarker('supply');
        }
        var arrMarker = landmark.arrSupplyMarker.markers;

        for(var j=0,c=arrMarker.length; j<c; j++){
            omap.removeMarker(arrMarker[j]);
        }
    }
};

landmark.showSupplyInfo = function(arrMarker, showSupply){
    var imgPath = strImgPathDir; //cms.util.path + '/skin/default/images/railway/';
    if(isInLAN){
        for(var i=0,c=arrMarker.length; i<c; i++){
            var typeId = arrMarker[i].type;
            var idx = landmark.getArrayIndex(arrMarker[i].type);
            
            landmark.showSupply = true;
            
            for(var j=0,cc=arrMarker[i].list.length; j<cc; j++){
                var dr = arrMarker[i].list[j];
                dr.name += '_' + '应急物资'
                var icon = imgPath + typeId + (typeId == 2 ? '.gif' : '.png');
                if(dr.left > 0 && dr.top > 0){
                    var param = {
                        code: dr.code,
                        name: dr.name,
                        left: dr.left,
                        top: dr.top,
                        icon: icon,
                        showLabel: true,
                        func: landmark.showLandmarkDetail,
                        val: '{type:' + typeId + ',code:\'' + dr.code + '\',name:\'' + dr.name + '\',showSupply:' + showSupply + '}'

                    };
                    var marker = omap.showMarker(param);
                    
                    landmark.arrSupplyMarker.markers.push(marker);
                }
                //创建一个action,作为GIS地图标记 回调函数的参数
                arrMarker[i].list[j].action = arrMarker[i].list[j].code;
                
                delete dr;
            }
            
            //在ArcGIS中显示地图标记
            var dataList = arrMarker[i].list;
            var markerDataList = oamap.buildMarkerData(dataList, typeId, true);
            if(markerDataList != '[]'){
                landmark.arrSupplyMarker.showGis = true;
                oamap.createMarker({id: 'supply', scale:oamap.scale}, markerDataList);
            }
        }
    }
};