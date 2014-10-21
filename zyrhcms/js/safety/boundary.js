var boundary = boundary || {};
boundary.arrLineId = [];
boundary.arrLineColor = ['#ff0000','#0000ff','#00ff00','#ff00ff','#00ffff','#800000'];

boundary.showBoundary = function(deptIndexCode, isUnique, isSwitch){
    var urlparam = 'action=getDepartmentBoundary&deptIndexCode=' + deptIndexCode;
    $.ajax({
        type: "post", 
        //async: false, //同步
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
            if(1 == jsondata.result){
                boundary.buildBoundary(deptIndexCode, jsondata.list, isUnique, isSwitch);
            } else {
                cms.box.alert({title: '提示信息', html: '获取管界信息失败，错误信息如下：' + jsondata.error});
            }
            
            delete jsondata;
            delete data;
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

boundary.hideLine = function(){
    for(var i=boundary.arrLineId.length; i>=0; i--){
        var layerId = boundary.arrLineId[i];
        if(layerId != undefined){
            oamap.hideLine(layerId);
        }
        boundary.arrLineId.splice(i,1);
    }
};

boundary.getColor = function(idx){
    if(idx > boundary.arrLineColor.length - 1){
        idx = 0;
    }
    return boundary.arrLineColor[idx];
};

boundary.buildBoundary = function(deptIndexCode, dataList, isUnique, isSwitch){
    var markerId = isUnique ? 'boundary' : 'boundary' + deptIndexCode;
    var strIcon = cms.util.path + '/skin/default/images/railway/gis/';
    var arrMarkerDataList = [];
    
    boundary.hideLine();
    if(isUnique){
        oamap.hideMarker(markerId);
    }
    
    if(dataList.length > 0){
        for(var i=0,c=dataList.length; i<c; i++){
            var deptLat = dataList[i].latitude;
            var deptLng = dataList[i].longitude;
            var deptName = dataList[i].deptName;
            
            var boundaryData = dataList[i].boundary;
            if(boundaryData.length > 0){
                for(var j=0,cc=boundaryData.length; j<cc; j++){
                    if(boundaryData[j].length >= 4){
                        var num = (j + 1);
                        for(var m=0; m<boundaryData[j].length/2; m++){
                            var lat = boundaryData[j][m*2 + 0];
                            var lng = boundaryData[j][m*2 + 1];
                            arrMarkerDataList.push({
                                id: markerId + '_' + j,
                                name: num + '.' + (m+1),
                                action: '',
                                lat: lat,
                                lng: lng,
                                icon: strIcon + (0 == m ? 'boundary_start' : 'boundary_end') + '.gif'
                            });
                            var lineDataList = [
                                {id: 'b_l_' + j + '_' + m + '_' + 0, code: '', name: '', lat: deptLat, lng: deptLng},
                                {id: 'b_l_' + j + '_' + m + '_' + 1, code: '', name: '', lat: lat, lng: lng}
                            ];
                            var linePointList = oamap.buildLinePoint(lineDataList, false, false);
                            var lineId = 'boundary_line_' + j + '_' + m;
                            boundary.arrLineId.push(lineId);
                            var param = {type: '', id: lineId, name:'acc', scale: oamap.scale, color: boundary.getColor(j), width: '2', alpha: '0.8', action:'asd'};
                            var result = oamap.createLine(param, linePointList);
                        }
                    }
                }
            } else {
                cms.box.alert({title:'提示信息', html:deptName + '暂时没有添加管界信息'});   
            }
        }
        var markerDataList = oamap.buildMarkerData(arrMarkerDataList, markerId, true);
        if(markerDataList != '[]'){
            oamap.createMarker({id: markerId, scale:oamap.scale}, markerDataList);
        }
    }
};