var jiupian = jiupian || {};
var boxId = 'pwalert';
jiupian.editRowIndex = -1;
jiupian.arrMarker = [];

jiupian.getRailwayLineList = function(obj, val){
    var urlparam = 'action=getRailwayLine';
    
    cms.util.clearOption(obj, 0);
    cms.util.fillOption(obj, '', '请选择线路');
    
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/baseinfo.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        },
        success: function(data) {
            //cms.box.alert({title: '提示', html: data});
            var json = eval('(' + data + ')');
            
            if (json.result == 1) {
                for(var i=0; i<json.list.length; i++){
                    cms.util.fillOption(obj, json.list[i].number, json.list[i].name);
                }
                if(val != '0' && val != '' && val != undefined){
                    obj.value = val;
                }
            } else {
                alert(data);
            }
        }
    });
};

jiupian.getUpDownLine = function(obj, val){
    var urlparam = 'action=getUpDownLine';
    
    cms.util.clearOption(obj, 0);
    cms.util.fillOption(obj, '', '请选择行别');
    
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/baseinfo.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        },
        success: function(data) {
            //cms.box.alert({title: '提示', html: data});
            var json = eval('(' + data + ')');
            
            if (json.result == 1) {
                for(var i=0; i<json.list.length; i++){
                    cms.util.fillOption(obj, json.list[i].id, json.list[i].name);
                }
                if(val != '0' && val != '' && val != undefined){
                    obj.value = val;
                }
            } else {
                alert(data);
            }
        }
    });
};

jiupian.getLineRegionList = function(obj, lineIndexCode, deptIndexCode){
    var urlparam = 'action=getLineRegionList&lineIndexCode=' + lineIndexCode + '&deptIndexCode=' + deptIndexCode;
    
    cms.util.clearOption(obj, 0);
    cms.util.fillOption(obj, '', '请选择区间');
    
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/baseinfo.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },        
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        },
        success: function(data) {
            //cms.box.alert({title: '提示', html: data});
            var json = eval('(' + data + ')');
            
            if (json.result == 1) {
                for(var i=0; i<json.list.length; i++){
                    cms.util.fillOption(obj, json.list[i].code, json.list[i].name);
                }    
            } else {
                alert(data);
            }
        }
    });
}


jiupian.getTensionLengthList = function(obj, regionIndexCode, deptIndexCode, upDownLine){
    var urlparam = 'action=getTensionLengthList&regionIndexCode=' + regionIndexCode + '&deptIndexCode=' + deptIndexCode + '&upDownLine=' + upDownLine;
    
    cms.util.clearOption(obj, 0);
    cms.util.fillOption(obj, '', '请选择锚段');
    
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/baseinfo.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },        
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        },
        success: function(data) {
            //cms.box.alert({title: '提示', html: data});
            var json = eval('(' + data + ')');
            
            if (json.result == 1) {
                for(var i=0; i<json.list.length; i++){
                    cms.util.fillOption(obj, json.list[i].code, json.list[i].name);
                }    
            } else {
                alert(data);
            }
        }
    });
}

jiupian.getPillarList = function(type, indexCode, objHeader, objList){
    var urlparam = 'action=getPillarList&indexCode=' + indexCode;
    
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/controlcenter.aspx',
        data: urlparam,
        error: function(data){
            alert('er:' + data);
            //cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        },
        success: function(data) {
            try{
                if(!data.isJsonData()){
                    module.showDataError({html:data, width:400, height:250});
                    return false;
                } else {
                    var jsondata = eval('(' + data + ')');
                    if(jsondata.result == 1){
                        if(jsondata.wsResult.result == 1){
                            jiupian.showPillarList(jsondata.list, objHeader, objList);
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
        }
    });
};

jiupian.showPillarList = function(dataList, objHeader, objList){
    var rid = 0;
    var cellid = 0;
    var rowData = [];
    var ci = 0;
    
    cms.util.clearDataRow(objHeader, 0);
    
    var rh = objHeader.insertRow(0);
    rowData[cellid++] = {html: '序号', style:[['width','25px']]};
    rowData[cellid++] = {html: '支柱名称', style:[['width','90px']]};
    rowData[cellid++] = {html: '定位', style:[['width','25px']]};
    rowData[cellid++] = {html: '纬度', style:[['width','68px']]};
    rowData[cellid++] = {html: '经度', style:[['width','68px']]};
    rowData[cellid++] = {html: '操作', style:[['width','65px']]};
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
        
        var strName = '<input name="txtName" id="txtName_' + i + '" type="text" class="txt" style="width:82px;border:none;text-align:center;" readonly="readonly" value="' + dr.name + '" />';
        var strLat = '<input name="txtLat" id="txtLat_' + i + '" maxlength="10" type="text" class="txt" style="width:62px;" value="' + dr.lat + '" lang="' + dr.lat + '" rel="' + dr.lat + '" disabled="disabled" />';
        var strLng = '<input name="txtLng" id="txtLng_' + i + '" maxlength="10" type="text" class="txt" style="width:62px;" value="' + dr.lng + '" lang="' + dr.lng + '" rel="' + dr.lng + '" disabled="disabled" />';
        var strOper = '<a id="btnEdit_' + i + '" style="width:30px;float:left;color:#000;border:solid 1px #ccc;" onclick="jiupian.editLatLng(' + i + ',\'edit\');"><span>编辑</span></a>'
            + '<a id="btnCover_' + i + '" style="width:30px;float:right;color:#000;border:solid 1px #ccc;" onclick="jiupian.editLatLng(' + i + ',\'recover\');"><span>还原</span></a>'
            + '<a id="btnSave_' + i + '" style="display:none;width:30px;float:left;" onclick="jiupian.editLatLng(' + i + ',\'save\');"><span>更新</span></a>'
            + '<a id="btnCancel_' + i + '" style="display:none;width:30px;float:right;" onclick="jiupian.editLatLng(' + i + ',\'cancel\');"><span>取消</span></a>';
        var strPos = '<input name="chbItem" id="chbItem_' + i + '" type="checkbox" onclick="jiupian.showMarker(' + i + ');" value="' + i + '" />';
        row.lang = '{pid:\'' + dr.pid + '\',code:\'' + dr.code + '\',name:\'' + dr.name + '\',lat:\'' + dr.lat + '\',lng:\'' + dr.lng + '\'}';

        row.ondblclick = function(){
            var lang = eval('(' + this.lang + ')');

        };

        rowData[cellid++] = {html: (rid + 1), style:[['width','25px']]};
        rowData[cellid++] = {html: strName, style:[['width','90px']]};
        rowData[cellid++] = {html: strPos, style:[['width','25px']]};
        rowData[cellid++] = {html: strLat, style:[['width','68px']]};
        rowData[cellid++] = {html: strLng, style:[['width','68px']]};
        rowData[cellid++] = {html: strOper, style:[['width','65px']]};
        rowData[cellid++] = {html: '', style:[]};

        cms.util.fillTable(row, rowData);
               
        rid++;
        ci++;
        jiupian.arrMarker.push(null);
    }
    
};


jiupian.editLatLng = function(i, action){
    var txtLat = cms.util.$('txtLat_' + i);
    var txtLng = cms.util.$('txtLng_' + i);
    var btnEdit = cms.util.$('btnEdit_' + i);
    var btnSave = cms.util.$('btnSave_' + i);
    var btnCancel = cms.util.$('btnCancel_' + i);
    var btnCover = cms.util.$('btnCover_' + i);
    
    //jiupian.arrMarker[i][0].draggable = false;
    
    if(action == 'edit'){
        if(jiupian.editRowIndex >= 0){
            jiupian.rollbackLatLng(jiupian.editRowIndex);
        }
        txtLat.disabled = false;
        txtLng.disabled = false;
        
        btnSave.style.display = '';
        btnCancel.style.display = '';  
        btnEdit.style.display = 'none';
        btnCover.style.display = 'none';
        
        jiupian.editRowIndex = i;
        
        //jiupian.arrMarker[i][0].draggable = true;
    } else if(action == 'recover'){
        if(confirm('确定要还原吗？')){
            txtLat.value = txtLat.rel;
            txtLng.value = txtLng.rel;
            txtLat.lang = txtLat.rel;
            txtLng.lang = txtLng.rel;
            
            jiupian.recoverMarker(i);
        }
    } else {
        if(action == 'save'){
            if(confirm('确定要更新吗？')){
                txtLat.lang = txtLat.value.trim();
                txtLng.lang = txtLng.value.trim();
            } else {
                return false;
            }   
        } else if(action == 'cancel'){
            txtLat.value = txtLat.lang;
            txtLng.value = txtLng.lang;
        }
        jiupian.recoverMarker(i);
            
        txtLat.disabled = true;
        txtLng.disabled = true;
        
        btnSave.style.display = 'none';
        btnCancel.style.display = 'none';  
        btnEdit.style.display = '';
        btnCover.style.display = '';
        
        jiupian.editRowIndex = -1;
    }
};

jiupian.rollbackLatLng = function(i){
    var txtLat = cms.util.$('txtLat_' + i);
    var txtLng = cms.util.$('txtLng_' + i);
    var btnEdit = cms.util.$('btnEdit_' + i);
    var btnSave = cms.util.$('btnSave_' + i);
    var btnCancel = cms.util.$('btnCancel_' + i);
    var btnCover = cms.util.$('btnCover_' + i);

    txtLat.disabled = true;
    txtLng.disabled = true;
    
    btnSave.style.display = 'none';
    btnCancel.style.display = 'none'; 
    
    btnEdit.style.display = '';
    btnCover.style.display = '';
    
    txtLat.value = txtLat.lang;
    txtLng.value = txtLng.lang;

    jiupian.recoverMarker(i);
    
    jiupian.editRowIndex = -1;
};

jiupian.changeLatLng = function(lat, lng){
    if(jiupian.editRowIndex >= 0){
        var txtLat = cms.util.$('txtLat_' + jiupian.editRowIndex);
        var txtLng = cms.util.$('txtLng_' + jiupian.editRowIndex);
        var latLng = mc.revert(parseFloat(lat), parseFloat(lng));
        
        if(txtLat.value.trim() == '' || txtLng.value.trim() == ''){
            txtLat.value = latLng.lat;
            txtLng.value = latLng.lng;
            
            return '第' + (jiupian.editRowIndex + 1) + '行';
        }
        return '';
    }
    return '';
};

jiupian.showMarker = function(i, oper){
    if(oper != undefined){
        cms.util.selectCheckBox('chbItem', oper);
        
        var arrItem = cms.util.$N('chbItem');
        
        jiupian.createMarker(arrItem, 0);
        
    } else {
        if(i != undefined && i >= 0){
            var chb = cms.util.$('chbItem_' + i);
            if(jiupian.arrMarker[i] != null){
                jiupian.arrMarker[i][0].setMap(null);
                jiupian.arrMarker[i][1].setMap(null);
                
                jiupian.arrMarker[i] = null;
            }
            
            if(chb.checked){
                var name = cms.util.$('txtName_' + i).value.trim();
                var lat = cms.util.$('txtLat_' + i).value.trim();
                var lng = cms.util.$('txtLng_' + i).value.trim();
                if('' == lat || '' == lng){
                    jiupian.arrMarker[i] = null;
                } else {
                    var latLng = mc.encode(parseFloat(lat), parseFloat(lng));
                    var myLatLng = new google.maps.LatLng(latLng.lat, latLng.lng); 
                    
                    var marker = new google.maps.Marker({
                        id: i,
	                    position: myLatLng,
	                    map: map,
	                    draggable: true
                    });
                    map.setCenter(myLatLng);
                    
                    google.maps.event.addListener(marker, 'dragend', function(event){
                        jiupian.moveMarker(event, marker);
                    });
                    
                    google.maps.event.addListener(marker, 'click', function(event){
                        showMarkerLatLng(marker);
                    });
                    
                    var label = new MyMarker(map, {
                        latlng: myLatLng,
                        labelText: (i+1) + '. ' + name
                    });
                    
                    jiupian.arrMarker[i] = [marker, label];
                }
            }
        }
    }
};

jiupian.createMarker = function(arrItem, i){
    if(arrItem.length > 0){
        if(jiupian.arrMarker[i] != null){
            jiupian.arrMarker[i][0].setMap(null);
            jiupian.arrMarker[i][1].setMap(null);
            
            jiupian.arrMarker[i] = null;
        }
        if(arrItem[i].checked){
            var idx = arrItem[i].value.trim();
            var name = cms.util.$('txtName_' + idx).value.trim();
            var lat = cms.util.$('txtLat_' + idx).value.trim();
            var lng = cms.util.$('txtLng_' + idx).value.trim();
            
            if('' == lat || '' == lng){
                jiupian.arrMarker[i] = null;
            } else {
                var latLng = mc.encode(parseFloat(lat), parseFloat(lng));
                var myLatLng = new google.maps.LatLng(latLng.lat, latLng.lng); 
                
                var marker = new google.maps.Marker({
                    id: i,
                    position: myLatLng,
                    map: map,
                    draggable: true
                });
                map.setCenter(myLatLng);
                
                google.maps.event.addListener(marker, 'dragend', function(event){
                    jiupian.moveMarker(event, marker);
                });
                google.maps.event.addListener(marker, 'click', function(event){
                    showMarkerLatLng(marker);
                });
                
                var label = new MyMarker(map, {
                    latlng: myLatLng,
                    labelText: (i+1) + '. ' + name
                });
                
                jiupian.arrMarker[i] = [marker, label];
            }
        }
        
        if(i < arrItem.length - 1){
            jiupian.createMarker(arrItem, ++i);
        }
    }
};

jiupian.moveMarker = function(ev, marker){
    var id = marker.id;
    
    var latLng = ev.latLng;
    var name = cms.util.$('txtName_' + id).value.trim();
    var txtLat = cms.util.$('txtLat_' + id);
    var txtLng = cms.util.$('txtLng_' + id);
    
    //移动标签
    jiupian.arrMarker[id][1].setMap(null);
    var label = new MyMarker(map, {
        latlng: ev.latLng,
        labelText: (id+1) + '. ' + name
    });    
    jiupian.arrMarker[id][1] = label;    
    
    if(id == jiupian.editRowIndex){
        var newLatLng = mc.revert(parseFloat(ev.latLng.lat()), parseFloat(ev.latLng.lng()));
        
        txtLat.value = newLatLng.lat;
        txtLng.value = newLatLng.lng;
    } else {
        jiupian.recoverMarker(id);
    }    
};

jiupian.recoverMarker = function(i){
    var name = cms.util.$('txtName_' + i).value.trim();
    var txtLat = cms.util.$('txtLat_' + i);
    var txtLng = cms.util.$('txtLng_' + i);
    
    if(jiupian.arrMarker[i] != null){
        jiupian.arrMarker[i][0].setMap(null);
            
        var lat = txtLat.value.trim();
        var lng = txtLng.value.trim();
        
        var latLng = mc.encode(parseFloat(lat), parseFloat(lng));
        var myLatLng = new google.maps.LatLng(latLng.lat, latLng.lng); 
        
        var marker = new google.maps.Marker({
            id: i,
            position: myLatLng,
            map: map,
            draggable: true
        });
        google.maps.event.addListener(marker, 'dragend', function(event){
            jiupian.moveMarker(event, marker);
        });
        
        google.maps.event.addListener(marker, 'click', function(event){
            showMarkerLatLng(marker);
        });
        
        jiupian.arrMarker[i][1].setMap(null);
        var label = new MyMarker(map, {
            latlng: myLatLng,
            labelText: (i+1) + '. ' + name
        });
        
        jiupian.arrMarker[i][0] = marker;
        jiupian.arrMarker[i][1] = label;
    }
};

jiupian.getContent = function(action){
    var strContent = '';
    var arrItem = cms.util.$N('chbItem');
    for(var i=0; i<arrItem.length; i++){
        var idx = arrItem[i].value.trim();
        var name = cms.util.$('txtName_' + idx).value.trim();
        var lat = cms.util.$('txtLat_' + idx).value.trim();
        var lng = cms.util.$('txtLng_' + idx).value.trim();
        
        var latVal = cms.util.$('txtLat_' + idx).rel.trim();
        var lngVal = cms.util.$('txtLng_' + idx).rel.trim();
        
        if(action == 'export'){
            strContent += (i > 0 ? ',' : '') + escape(name) + '_' + lat + '_' + lng;
        } else {
            if('' == lat || '' == lng || (lat == latVal && lng == lngVal)){
                continue;
            } else {
                strContent += (i > 0 ? ',' : '') + eascpe(name) + '_' + lat + '_' + lng;
            }
        }
    }
    
    return strContent;
};

jiupian.buildResult = function(){
    var strRegion = cms.util.$('ddlLineRegion').value.trim();
    var strTensionLengthIndexCode = cms.util.$('ddlTensionLength').value.trim();
    var strHtml = '<div style="padding:0 5px;">区间：' + $("#ddlLineRegion").find("option:selected").text() + '，锚段：' 
        + $("#ddlTensionLength").find("option:selected").text() + '，锚段编号：' + strTensionLengthIndexCode + '</div>'
        + '<textarea id="txtResult" class="txt" style="width:99%;height:320px;" readonly="readonly"></textarea>'
        + '<div style="padding:0 5px;">在上面的文本框中“三击鼠标”全选内容，复制内容，粘贴到Excel文档中即可。</div>';
    
    var config = {
        id: '',
        title: '生成结果',
        html: strHtml,
        noBottom: true,
        width: 600,
        height: 400
    };
    cms.box.win(config);
    var strResult = '<table cellpadding="0" cellspacing="0" border="1">';
    strResult += '<tr>';
    strResult += '<td>锚段编号</td>';
    strResult += '<td>支柱名称</td>';
    strResult += '<td>纬度</td>';
    strResult += '<td>经度</td>';
    strResult += '</tr>';
    
    var strContent = jiupian.getContent('export');
    var arrContent = strContent.split(',');
    for(var i=0,c=arrContent.length; i<c; i++){
        var arrTemp = arrContent[i].split('_');
        strResult += '<tr>';
        strResult += '<td>' + strTensionLengthIndexCode + '</td>';
        for(var j=0,m=arrTemp.length; j<m; j++){
            strResult += '<td>' + arrTemp[j] + '</td>';
        }
        strResult += '</tr>';
    }
    strResult += '</table>';
    
    cms.util.$('txtResult').value = strResult;
};

jiupian.exportExcel = function(){
    var strTensionLengthIndexCode = cms.util.$('ddlTensionLength').value.trim();
    if(strTensionLengthIndexCode != ''){
        var handleURL = cms.util.path + '/tools/jpAjax.aspx?action=exportExcel&tensionLengthIndexCode='+ strTensionLengthIndexCode + '&isIE=' + (cms.util.isMSIE ? 1 : 0);
        window.location.href = handleURL;    
    }    
};

jiupian.save = function(){
    //var strContent = jiupian.getContent('save');
    var strContent = jiupian.getContent('export');
    if(strContent == ''){
        return false;
    }  
    
    var strContent = jiupian.getContent('export');
    var strTensionLengthIndexCode = cms.util.$('ddlTensionLength').value.trim();
    
    if(strContent == ''){
        return false;
    }
    var urlparam = 'action=saveExcel&tensionLengthIndexCode=' + strTensionLengthIndexCode + '&content=' + strContent;

    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'text',
        url: cms.util.path + '/ajax/jpAjax.aspx',
        data: urlparam,
        error: function(data){
            alert(data);
        },
        success: function(data){
            //alert(data);
            if(!data.isJsonData()){
                alert(data);
            } else {
                var jsondata =  eval('(' + data + ')');
                
                if(1 == jsondata.result){
                }
            }
        }
    });
};

/*
jiupian.getPillarList = function(type, regionIndexCode, tensionLengthIndexCode, objHeader, objList){
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
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },        
        complete: function(XHR, TS){ 
            XHR = null; 
            if(typeof(CollectGarbage) == 'function'){CollectGarbage();} 
        },
        success: function(data) {alert(data);
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            } else {
                var jsondata = eval('(' + data + ')');
                if(jsondata.result == 1){
                    jiupian.showPillarList(jsondata.list, objHeader, objList);
                } else {
                    alert(jsondata.error);
                }
            }
        }
    });
}

jiupian.showPillarList = function(dataList, objHeader, objList){
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
*/