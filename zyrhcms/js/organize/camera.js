cms.camera = cms.camera || {};

cms.camera.pageStart = 1;
cms.camera.pageIndex = cms.camera.pageStart;
cms.camera.pageSize = 20;
cms.camera.arrKeys = {name:'输入要查找的设备名称', indexcode:'输入要查找的设备编号'};

cms.camera.zindex = [1000, 1001];

cms.camera.tabContainerChange = function(rval){
    //alert(rval.action + ',' + rval.container);
}

cms.camera.checkKeywords = function(objTxt){
    return $(objTxt).val() == cms.camera.arrKeys.indexcode || $(objTxt).val() == cms.camera.arrKeys.name;
}

cms.camera.getCameraList = function(){
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var strFilter = $('#ddlType').val();
    var strKeywords = $('#txtKeywords').val();
    if(cms.camera.checkKeywords('#txtKeywords')){
        strKeywords = '';
    }
    var getChild = $('#showChild_camera').attr('checked') == 'checked' ? 1 : 0;
    var urlparam = 'action=getCameraList&unitId=' + unit.id + '&pageIndex=' + (cms.camera.pageIndex-cms.camera.pageStart) + '&pageSize=' + cms.camera.pageSize 
        + '&filter=' + strFilter + '&keywords=' + escape(strKeywords) + '&getChild=' + getChild;
    
    if(!module.isDebugInfoAppend){
        module.clearDebugInfo();
    }
    module.appendDebugInfo(module.getDebugTime() + '[GetCameraList Request] param: ' + urlparam);
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/device.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            module.appendDebugInfo(module.getDebugTime() + '[GetCameraList Response] data: ' + data);
            $('#txtData').attr('value', data);
            var strData = $('#txtData').val();
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata = strData.toJson();//eval('(' + strData + ')');
            if(1 == jsondata.result){
                cms.camera.showListHeader();
                cms.camera.showCameraInfo(jsondata);
                module.appendDebugInfo(module.getDebugTime() + '[ShowCameraList Finished]');
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);            
            }
        }
    });
}

cms.camera.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_camera');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = cms.camera.buildListHeader();
    cms.util.fillTable(row, rowData);
}

cms.camera.showCameraInfo = function(jsondata){
    var objList = cms.util.$('tbList_camera');
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, cms.camera.pageSize);
    if(cms.camera.pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        cms.camera.pageIndex = pc;
        
        return false;
    } else {
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (cms.camera.pageIndex-cms.camera.pageStart) * cms.camera.pageSize + rid + 1;
            var strParam = "{devId:'" + dr.devId + "',devName:'" + dr.devName + "',typeCode:'" + dr.typeCode + "'}";
            
            row.lang = strParam;
            
            rowData = cms.camera.buildListData(row, dr, rnum);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: cms.camera.pageIndex,
            pageSize: cms.camera.pageSize,
            pageStart: cms.camera.pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'cms.camera.showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination_camera'));
        pageCount = pager.pageCount;
        
        cms.camera.setTableStyle('#tbList_camera', '#tbHeader_camera');
        
        return true;
    }
}

cms.camera.buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '监控点名称', style:[['width','220px']]};
    rowData[cellid++] = {html: '通道号', style:[['width','45px']]};
    rowData[cellid++] = {html: '类型', style:[['width','60px']]};
    rowData[cellid++] = {html: '连接协议', style:[['width','60px']]};
    rowData[cellid++] = {html: '码流', style:[['width','50px']]};
    rowData[cellid++] = {html: '所属设备', style:[['width','180px']]};
    rowData[cellid++] = {html: '所属组织机构', style:[['width','120px']]};
    rowData[cellid++] = {html: 'IP地址', style:[['width','120px']]};
    rowData[cellid++] = {html: '端口', style:[['width','50px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.camera.buildListData = function(row, dr, rid){
    var cellid = 0;
    var rowData = [];
    var strCameraName = '<a class="link" onclick="cms.camera.showEditCameraWin(\'edit\',\'' + dr.cameraId + '\');">' + cms.util.fixedCellWidth(dr.cameraName, 220, true, dr.cameraName) + '</a>';
    var strCheckBox = '<input type="checkbox" value="' + dr.cameraId + '" />';
    
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    rowData[cellid++] = {html: rid, style:[['width','35px']]};
    
    rowData[cellid++] = {html: strCameraName, style:[['width','220px']]};
    rowData[cellid++] = {html: dr.channelNo, style:[['width','45px']]};
    rowData[cellid++] = {html: cms.camera.cameraType(dr.cameraType), style:[['width','60px']]};
    rowData[cellid++] = {html: cms.camera.connectType(dr.connectType), style:[['width','60px']]};
    rowData[cellid++] = {html: cms.camera.streamType(dr.streamType), style:[['width','50px']]};
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.devName, 180, true, dr.devName), style:[['width','180px']]};
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.unitName, 120, true, dr.unitName), style:[['width','120px']]};
    rowData[cellid++] = {html: dr.networkAddr, style:[['width','120px']]};
    rowData[cellid++] = {html: dr.networkPort, style:[['width','50px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.camera.setTableStyle = function(tb, tbHeader){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
    var chbitems = $(tb + ' tr input[type="checkbox"]');
    chbitems.click(function() {
        if($(this).attr("checked") == 'checked'){
            $(this).parents('tr').addClass('selected');
        }else{
            $(this).parents('tr').removeClass('selected');
        }
        $(tbHeader + ' #chbAll').attr('checked', chbitems.size() == cms.jquery.getCheckBoxChecked(tb).size());    
    });
    
    $(tbHeader + ' #chbAll').click(function(){
        cms.jquery.selectCheckBox('#tbList_camera');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
}

cms.camera.showPage = function(page){
    cms.camera.pageIndex = parseInt(page, 10);
    cms.camera.getCameraList();
}

cms.camera.cameraType = function(type){
    var arrType = ['枪机', '半球', '快球', '云台'];
    return arrType[parseInt(type)];
};

cms.camera.connectType = function(type){
    //var arrType = ['UDP', 'TCP', 'MCAST', 'RTP'];
    var arrType = ['UDP', 'TCP'];
    return arrType[parseInt(type)];
};

cms.camera.streamType = function(type){
    return type == '0' ? '主码流' : '子码流';
};

cms.camera.showEditCameraWin = function(action, cameraId){
    timerPlayStop(true);
    //var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var boxH = 400;
    var bodySize = cms.util.getBodySize();
    if(boxH > bodySize.height){
        boxH = bodySize.height - 2;
    }
    var config = {
        id: 'pweditform',
        title: (action == 'edit' ? '编辑' : '添加') + '监控点信息',
        width: 560,
        height: boxH,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: cms.camera.zindex[0],
        callBack: cms.camera.editCamera
    };
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }
    var conH = boxH - 25 - 28 - config.bottomHeight - 10;
    
    var camera = {
        devId:'', unitId:'', cameraId:'', cameraCode:'', cameraName:'', channelNo: '1',
        devName:'', networkAddr:'', networkPort:'',latitude:'', longitude:'',sound:''
    };
    
    if(action == 'edit'){
        var urlparam = 'action=getCameraInfo&cameraId=' + cameraId;
        $.ajax({
            type: 'post',
            async: false,
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
                if(1 == jsondata.result){
                    var ci = jsondata.camera;
                    camera.cameraId = ci.cameraId;
                    camera.devId = ci.devId;
                    camera.unitId = ci.unitId;
                    camera.cameraCode = ci.cameraCode;
                    camera.cameraName = ci.cameraName;
                    camera.channelNo = ci.channelNo;
                    camera.devName = ci.devName;
                    camera.networkAddr = ci.networkAddr;
                    camera.networkPort = ci.networkPort;
                    camera.latitude = ci.latitude;
                    camera.longitude = ci.longitude;
                    camera.sound = ci.sound;
                    camera.ptzType = ci.ptzType;
                    camera.ptzControlType = ci.ptzControlType;
                    camera.cameraType = ci.cameraType;
                    camera.connectType = ci.connectType;
                    camera.pixel = ci.pixel;
                    camera.streamType = ci.streamType;
                } else {
                    module.showErrorInfo(jsondata.msg, jsondata.error);
                }
            }
        });
    } else {
    
    }    
    var strDevTypeOption = '';
    var strHtml = '';   
    
    var strHtml = '<div class="tabpanel" id="tabDev">'
        + '<a class="cur" lang="info" rel="#tabcon1"><span>基本信息</span></a>'
        //+ '<a class="tab" lang="config" rel="#tabcon2"><span>配置信息</span></a>'
        + '</div>'
        + '<div class="p-5-10" style="height:' + conH + 'px;overflow:auto;" id="tabDevContainer">'
        + '<div class="tabcon" id="tabcon1">'
        + '<input id="txtCameraId_CameraForm" type="hidden" value="' + camera.cameraId + '" />'
        + '<input id="txtDevId_CameraForm" type="hidden" value="' + camera.devId + '" />'
        + '<input id="txtAction_CameraForm" type="hidden" value="' + action + '" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>监控点名称：','class="tdr w85"'),
            cms.util.buildTd('<input id="txtCameraName_CameraForm" type="text" class="txt w420" maxlength="64" value="' + camera.cameraName + '" />', 'colspan="3"')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>云台控制：','class="tdr"'),
            cms.util.buildTd('<select id="ddlPtzControlType_CameraForm" class="select" style="width:156px;">'
                + cms.util.buildOptions([[0,'DVS'],[2,'MU4000'],[3,'NC600']], camera.ptzControlType)
                + '</select>','class="w180"'),
            cms.util.buildTd('<em>*</em>云台类型：','class="tdr w85"'),
            cms.util.buildTd('<select id="ddlPtzType_CameraForm" class="select" style="width:156px;">'
                + cms.util.buildOptions([[4,'无云台，无变焦'],[3,'只有转动，不带变焦'],[2,'只有变焦，不带转动'],[1,'全方位云台']], camera.ptzType)
                + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>摄像机类型：','class="tdr"'),
            cms.util.buildTd('<select id="ddlCameraType_CameraForm" class="select" style="width:156px;">'
                + cms.util.buildOptions([[0,'枪机'],[1,'半球'],[2,'快球'],[3,'云台']], camera.cameraType)
                + '</select>','class="w180"'),
            cms.util.buildTd('<em>*</em>连接协议：','class="tdr w85"'),
            cms.util.buildTd('<select id="ddlConnectType_CameraForm" class="select" style="width:156px;">'
                + cms.util.buildOptions([[0,'UDP'],[1,'TCP']], camera.connectType)
                + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>摄像机像素：','class="tdr"'),
            cms.util.buildTd('<select id="ddlPixel_CameraForm" class="select" style="width:156px;">'
                + cms.util.buildOptions([[1,'普通'],[2,'130万高清'],[3,'200万高清'],[4,'300万高清']], camera.pixel)
                + '</select>','class="w180"'),
            cms.util.buildTd('<em>*</em>码流类型：','class="tdr w85"'),
            cms.util.buildTd('<select id="ddlStreamType_CameraForm" class="select" style="width:156px;">'
                + cms.util.buildOptions([[0,'主码流'],[1,'子码流']], camera.streamType)
                + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('所属设备：','class="tdr"'),
            cms.util.buildTd('<input id="txtDevName_CameraForm" type="text" disabled="disabled" class="txt w150"  value="' + camera.devName + '" />','class="w180"'),
            cms.util.buildTd('通道号：','class="tdr w85"'),
            cms.util.buildTd('<input id="txtChannelNo_CameraForm" type="text" disabled="disabled" class="txt w150"  value="' + camera.channelNo + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('IP地址：','class="tdr"'),
            cms.util.buildTd('<input id="txtNetworkAddr_CameraForm" type="text" disabled="disabled" class="txt w150" value="' + camera.networkAddr + '" />','class="w180"'),
            cms.util.buildTd('端口：','class="tdr w85"'),
            cms.util.buildTd('<input id="txtNetworkPort_CameraForm" type="text" disabled="disabled" class="txt w150" value="' + camera.networkPort + '" />')
        ])
//        + cms.util.buildTr([cms.util.buildTd('纬度：','class="tdr"'),
//            cms.util.buildTd('<input id="txtLatitude_CameraForm" type="text" disabled="disabled" class="txt w150" value="' + camera.latitude + '" />','class="w180"'),
//            cms.util.buildTd('经度：','class="tdr w85"'),
//            cms.util.buildTd('<input id="txtLongitude_CameraForm" type="text" disabled="disabled" class="txt w150" value="' + camera.longitude + '" />')
//        ])
        + cms.util.buildTr([cms.util.buildTd('音频：','class="tdr"'),
            cms.util.buildTd('<select id="ddlSound_CameraForm" class="select" style="width:156px;">'
                + cms.util.buildOptions([[0,'无'],[1,'有']], camera.sound)
                + '</select>','class="w180"'),
            cms.util.buildTd('','class="tdr w85"'),
            cms.util.buildTd('')
        ])
        + (action == 'add'? cms.util.buildTr([cms.util.buildTd('','class="tdr"'),
            cms.util.buildTd('<label for="chbContinue_CameraForm" class="chb-label-nobg nomp"><input type="checkbox" id="chbContinue_CameraForm" class="chb"><span>添加完成后继续添加</span></label>', 'colspan="3"')
        ]):'')

        + '</table>'

        + '</div>';
    config.html = strHtml;
    var pwobj = cms.box.win(config);
};

cms.camera.editCamera = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strAction = $('#txtAction_CameraForm').val();
        var cameraName = $('#txtCameraName_CameraForm').val();
        if(cameraName.equals('')){;
            cms.box.msgAndFocus(cms.util.$('txtCameraName_CameraForm'), {id: boxId, title: '提示信息', html: '请输入监控点名称。'});
            return false;
        }
        var ptzControlType = $('#ddlPtzControlType_CameraForm').val();
        var ptzType = $('#ddlPtzType_CameraForm').val();
        var cameraType = $('#ddlCameraType_CameraForm').val();
        var connectType = $('#ddlConnectType_CameraForm').val();
        var pixel = $('#ddlPixel_CameraForm').val();
        var streamType = $('#ddlStreamType_CameraForm').val();
        var sound = $('#ddlSound_CameraForm').val();
                
        var urlparam = '';        
        if(strAction == 'edit'){
            var cameraId = $('#txtCameraId_CameraForm').val();
            urlparam = 'action=editCamera&cameraId=' + cameraId + '&cameraName=' + escape(cameraName) + '&cameraType=' + cameraType 
                + '&connectType=' + connectType + '&ptzType=' + ptzType + '&streamType=' + streamType + '&ptzControlType=' + ptzControlType 
                + '&pixel=' + pixel + '&sound=' + sound;
            $.ajax({
                type: 'post',
                async: false,
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
                    if(1 == jsondata.result){
                        cms.camera.getCameraList();
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '监控点信息已修改。'}, true);
                        //timerPlayStop(false);
                    } else {
                        module.showErrorInfo(jsondata.msg, jsondata.error);
                        pwobj.Hide();
                        //timerPlayStop(false);
                    }
                }
            });
        } else {
        
        }        
    } else {
        pwobj.Hide();
        //timerPlayStop(false);    
    }
};