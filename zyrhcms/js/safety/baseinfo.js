var baseinfo = baseinfo || {};

baseinfo.arrDept = [];
baseinfo.curDepartmentId = 0;

baseinfo.initialList = function(obj, val, txt){
    cms.util.clearOption(obj, 0);
    cms.util.fillOption(obj, val, txt);
};

baseinfo.getDepartment = function(obj, box, func){
    var urlparam = 'action=getDepartment&id=0';
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
            baseinfo.arrDept = jsondata.list;
            baseinfo.showDepartment(obj, box, jsondata.list, func);
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

baseinfo.showDepartment = function(obj, box, depList, func){
    if(depList.length > 0){
        var depFirst = depList.length > 1 ? depList[1] : depList[0];
        new DropDownList(obj, 'dep', {parentId:0, data:depList, val: depFirst.id, text: depFirst.name, maxHeight:'110',width:'238',event:'focus',func:func, recursion:true}, box);
        $('#ddlDepartment1').hide();
        $('#txtDepartmentId').attr('value', depFirst.id);
        baseinfo.curDepartmentId = depFirst.id;
    }
};

baseinfo.getDepartmentIndexCode = function(id){
    for(var i=0,c=baseinfo.arrDept.length; i<c; i++){
        if(parseInt(id, 10) == parseInt(baseinfo.arrDept[i].id, 10)){
            return [baseinfo.arrDept[i].code, baseinfo.arrDept[i].name];
        }
    }
    return null;
};

baseinfo.getRailwayLineList = function(obj, val){
    var urlparam = 'action=getRailwayLine';
    
    cms.util.clearOption(obj, 0);
    cms.util.fillOption(obj, '', '请选择线路');
    
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
            var json = eval('(' + data + ')');
            
            if (json.result == 1) {
                for(var i=0; i<json.list.length; i++){
                    cms.util.fillOption(obj, json.list[i].number, json.list[i].name);
                }
                if(val != '0' && val != '' && val != undefined){
                    obj.value = val;
                }
            } else if (json.result == -1) {
                if(cms.util.dbConnection(json.error) == 0){
                    cms.box.alert({id: boxId, title: '错误信息', html: DB_CONNECTION_FAILED, iconType:'error'});
                } 
            } else {
            
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

baseinfo.getUpDownLine = function(obj, val){
    var urlparam = 'action=getUpDownLine';
    
    cms.util.clearOption(obj, 0);
    cms.util.fillOption(obj, '', '请选择行别');
    
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
            var json = eval('(' + data + ')');
            
            if (json.result == 1) {
                for(var i=0; i<json.list.length; i++){
                    cms.util.fillOption(obj, json.list[i].id, json.list[i].name);
                }
                if(val != '0' && val != '' && val != undefined){
                    obj.value = val;
                }
            } else if (json.result == -1) {
                if(cms.util.dbConnection(json.error) == 0){
                    cms.box.alert({id: boxId, title: '错误信息', html: DB_CONNECTION_FAILED, iconType:'error'});
                } 
            } else {
            
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
};

baseinfo.getLineRegionList = function(obj, lineIndexCode, deptIndexCode){
    var urlparam = 'action=getLineRegionList&lineIndexCode=' + lineIndexCode + '&deptIndexCode=' + deptIndexCode;
    
    cms.util.clearOption(obj, 0);
    cms.util.fillOption(obj, '', '请选择区间');
    
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
            var json = eval('(' + data + ')');
            
            if (json.result == 1) {
                for(var i=0; i<json.list.length; i++){
                    cms.util.fillOption(obj, json.list[i].code, json.list[i].name);
                }    
            } else if (json.result == -1) {
                if(cms.util.dbConnection(json.error) == 0){
                    cms.box.alert({id: boxId, title: '错误信息', html: DB_CONNECTION_FAILED, iconType:'error'});
                } 
            } else {
            
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
}


baseinfo.getTensionLengthList = function(obj, regionIndexCode, deptIndexCode, upDownLine){
    var urlparam = 'action=getTensionLengthList&regionIndexCode=' + regionIndexCode + '&deptIndexCode=' + deptIndexCode + '&upDownLine=' + upDownLine;
    
    cms.util.clearOption(obj, 0);
    cms.util.fillOption(obj, '', '请选择锚段');
    
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
            var json = eval('(' + data + ')');
            
            if (json.result == 1) {
                for(var i=0; i<json.list.length; i++){
                    cms.util.fillOption(obj, json.list[i].code, json.list[i].name);
                }    
            } else if (json.result == -1) {
                if(cms.util.dbConnection(json.error) == 0){
                    cms.box.alert({id: boxId, title: '错误信息', html: DB_CONNECTION_FAILED, iconType:'error'});
                } 
            } else {
            
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
}

baseinfo.getPillarList = function(type, regionIndexCode, tensionLengthIndexCode, objHeader, objList){
    var urlparam = 'action=getPillarList&tensionLengthIndexCode=' + tensionLengthIndexCode;
    if(urlparam.equals('')){
        cms.util.clearDataRow(objList, 0);
        return false;
    }    
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
            if(jsondata.result == 1){
                baseinfo.showPillarList(jsondata.list, objHeader, objList);
            } else {
                alert(jsondata.error);
            }
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
}

baseinfo.showPillarList = function(dataList, objHeader, objList){
    var rid = 0;
    var cellid = 0;
    var rowData = [];
    var ci = 0;
    
    cms.util.clearDataRow(objHeader, 0);
    
    var rh = objHeader.insertRow(0);
    rowData[cellid++] = {html: '序号', style:[['width','25px']]};
    rowData[cellid++] = {html: '名称', style:[['width','60px']]};
    rowData[cellid++] = {html: '公里标', style:[['width','60px']]};
    rowData[cellid++] = {html: '纬度', style:[['width','80px']]};
    rowData[cellid++] = {html: '经度', style:[['width','80px']]};
    rowData[cellid++] = {html: '', style:[]};
        
    cms.util.fillTable(rh, rowData);
         
    cms.util.clearDataRow(objList, 0);
    
    for(var i=0; i<dataList.length; i++){
        var dr = dataList[i];
        var row = objList.insertRow(rid);
        rowData = [];
        cellid = 0;
        
        var strName = '<span>' + cms.util.fixedCellWidth(dr.name, 60, true, dr.name) + '</span>';

        row.lang = '{pid:\'' + dr.pid + '\',code:\'' + dr.code + '\',name:\'' + dr.name + '\',lat:\'' + dr.longitude + '\',lng:\'' + dr.longitude + '\'}';

        row.ondblclick = function(){
            var lang = eval('(' + this.lang + ')');
            if(lang.lat == ''){
                safety.device.showDeviceDetail(lang.pid, lang.name);
            } else {
                safety.device.createMarker(lang.lat, lang.lng, lang.pid, lang.name, lang.name);
                safety.device.showDeviceDetail(lang.pid, lang.name);
            }
        };

        rowData[cellid++] = {html: (rid + 1), style:[['width','25px']]};
        rowData[cellid++] = {html: dr.name, style:[['width','60px']]};
        rowData[cellid++] = {html: dr.kilometerPost, style:[['width','60px']]};
        rowData[cellid++] = {html: dr.latitude, style:[['width','80px']]};
        rowData[cellid++] = {html: dr.longitude, style:[['width','80px']]};
        rowData[cellid++] = {html: '', style:[]};

        cms.util.fillTable(row, rowData);
        rid++;
        ci++;
    }
};

baseinfo.getSubstationList = function(lineIndexCode, typeIdList, objHeader, objList){
    var urlparam = 'action=getSubstationList&lineIndexCode=' + lineIndexCode + '&typeIdList=' + typeIdList;

    if(urlparam.equals('')){
        cms.util.clearDataRow(objList, 0);
        return false;
    }
    
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
            cms.util.clearDataRow(objHeader, 0);
            cms.util.clearDataRow(objList, 0);
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        }
    });
}

baseinfo.showSubstationList = function(dataList, objHeader, objList){
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
    
    for(var i=0; i<dataList.length; i++){
        var dr = dataList[i];
        var row = objList.insertRow(rid);
        rowData = [];
        cellid = 0;
        
        var strName = '<span>' + cms.util.fixedCellWidth(dr.name, 100, true, dr.name) + '</span>';

        row.lang = '{code:\'' + dr.code + '\',name:\'' + dr.name + '\',lat:\'' + dr.longitude + '\',lng:\'' + dr.longitude + '\'}';

        row.ondblclick = function(){
            var lang = eval('(' + this.lang + ')');
            if(lang.lat == ''){
                deviceDetail.showSubstationDetail(lang.code);
            } else {
                //safety.device.createMarker(lang.lat, lang.lng, lang.code, lang.name, lang.name);
                deviceDetail.showSubstationDetail(lang.code);
            }
        };

        rowData[cellid++] = {html: (rid + 1), style:[['width','25px']]};
        rowData[cellid++] = {html: dr.name, style:[['width','100px']]};
        rowData[cellid++] = {html: dr.latitude, style:[['width','80px']]};
        rowData[cellid++] = {html: dr.longitude, style:[['width','80px']]};
        rowData[cellid++] = {html: '', style:[]};
            
        cms.util.fillTable(row, rowData);
        rid++;
        ci++;
    }
};
