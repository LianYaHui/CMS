cms.preset = cms.preset || {};

cms.preset.maxCount = 256;
cms.preset.rid = 0;
cms.preset.presetNo = 0;
cms.preset.pnsobj = null;

cms.preset.buildPresetForm = function(){
    var strPreset = '<table id="tbPreset" cellpadding="0" cellspacing="0" class="tb-preset"></table>';    
    $('#presetPanel').html(strPreset);
    
    cms.preset.initialPresetList(cms.util.$('tbPreset'), cms.preset.maxCount);
    
    var strToolbar = '<div style="padding:2px 2px 0;">';
    var hasRole = '1' == loginUser.userRole;
    if(hasRole){
        strToolbar += '<a class="btn btnc22" style="float:right;" title="编辑预置点名称" onclick="cms.preset.editPresetName(this);"><span class="w25">编辑</span></a>';
    }
    strToolbar += '<div style="float:left;" id="presetNoSelectBox"></div><input type="hidden" id="txtPresetNo" class="txt w20" />'
        + '<a class="btn btnc22" style="margin-left:3px;" onclick="cms.preset.callPreset();"><span class="w25">调用</span></a>'
        + '<a class="btn btnc22" style="margin-left:3px;" onclick="cms.preset.setPreset();"><span class="w25">设置</span></a>';
    if(hasRole){
        strToolbar += '<a class="btn btnc22" style="margin-left:3px;" onclick="cms.preset.deletePreset();"><span class="w25">删除</span></a>';
    }
    strToolbar += '</div>';
    
    $('#presetToolbar').html(strToolbar);
    
    cms.preset.pnsobj = new TimeSelect('presetNoSelectBox', 
        {id:'txtPresetNo', type:'num', obj:'txtPresetNo',func: cms.preset.setPresetNo,loop:false, value:'1',width:42,min:1,max:cms.preset.maxCount,timing:10});
    
    cms.preset.setPresetNo(1);
};

cms.preset.initialPresetList = function(obj, count){
    cms.util.clearDataRow(obj, 0);
    var rid = 0;
    
    for(var i=0; i<count; i++){
        var row = obj.insertRow(rid);
        var rowData = [];
        var cellid = 0;
        var pn = (i+1);
        var strTitle = '双击可调用此预置点';
        
        row.title = strTitle;
        row.rel = pn;
        row.onclick = function(){
            cms.preset.setPresetNo(this.rel);
        };
        row.ondblclick = function(){
            cms.preset.setPresetNo(this.rel);
            cms.preset.callPreset(cms.preset.presetNo);
        };
        var strPresetName = '预置点' + pn;
        var strPresetObj = '<input type="text" id="txtPresetName_' + pn + '" value="' + strPresetName + '" maxlength="32" readonly="readonly" class="txt-label" style="width:139px;border:none;" />';
        var strFlag = '<input type="hidden" id="txtIsPreset_' + pn + '" value="0" />'
            + '<span id="lblPresetDeleted_' + pn + '" class="flag-right" style="width:25px;height:22px;display:none;"></span>';
        
        rowData[cellid++] = {html: pn, title:strTitle, style:[['width','35px'],['textAlign', 'center']]}; //序号
        rowData[cellid++] = {html: strPresetObj, title:strTitle, style:[['width','139px']]}; //名称
        rowData[cellid++] = {html: strFlag, title:strTitle, style:[['width','25px']]}; //标识
        rowData[cellid++] = {html: '', style:[]}; //空
        
        cms.util.fillTable(row, rowData);
        rid++;
        
        delete rowData;
        delete row;
    }
    
    cms.preset.setTableStyle('#tbPreset');
};

cms.preset.resetPresetInfo = function(){
    var pn = 0;
    for(var i=0; i<cms.preset.maxCount; i++){
        pn = i + 1;
        if(cms.util.$('txtPresetName_' + pn) == null || cms.util.$('lblPresetDeleted_' + pn) == null){
            break;
        }
        cms.util.$('txtPresetName_' + pn).value = '预置点' + pn;
        cms.util.$('txtIsPreset_' + pn).value = '0';
        cms.util.$('lblPresetDeleted_' + pn).style.display = 'none';
    }
};

cms.preset.setTableStyle = function(tb){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
};

cms.preset.setPresetNo = function(pn){
    cms.preset.presetNo = parseInt(pn, 10);
    cms.preset.pnsobj.setValue(cms.preset.presetNo);
};

cms.preset.setPreset = function(pn){
    if(pn == undefined){
        pn = cms.preset.presetNo;
    }
    if(!cms.preview.checkDevice()){
        return false;
    }
    var camera = cms.preview.getWinDevData();
    var previewOcx = cms.preview.previewOcx;
    var strPresetName = cms.util.$('txtPresetName_' + pn).value.trim();
    var iAction = 1;
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetPreset Request] szDevId: ' + camera.devCode + ', iChannel: ' + camera.channelNo 
        + ', iAction: ' + iAction + ', iPresetId: ' + pn + ', szPresetName: ' + strPresetName + ', 备注：设置(' + camera.devCode + ')预置点' + pn);
    
    var result = cms.ocx.setPreset(previewOcx, camera.devCode, camera.channelNo, iAction, pn, strPresetName);
    
    if(0 == result){
        cms.preset.updatePesetInfo(camera.cameraId, pn, strPresetName, 0);
        
        //重新获取预置点名称信息
        //cms.preset.getPresetInfo(camera.cameraId, pn);
        
        //重新获取全部预置点名称信息
        cms.preset.getPresetInfo(camera.cameraId, 0);
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetPreset Response] return: ' + cms.ocx.showErrorCode(result));
};

cms.preset.callPreset = function(pn){
    if(pn == undefined){
        pn = cms.preset.presetNo;
    }
    if(!cms.preview.checkDevice()){
        return false;
    }
    var camera = cms.preview.getWinDevData();
    var previewOcx = cms.preview.previewOcx;
    var iAction = 3;
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetPreset Request] szDevId: ' + camera.devCode + ', iChannel: ' + camera.channelNo 
        + ', iAction: ' + iAction + ', iPresetId: ' + pn + ', 备注：调用(' + camera.devCode + ')预置点' + pn);
    
    var result = cms.ocx.setPreset(previewOcx, camera.devCode, camera.channelNo, iAction, pn);
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetPreset Response] return: ' + cms.ocx.showErrorCode(result));
};

cms.preset.deletePreset = function(pn){
    if(pn == undefined){
        pn = cms.preset.presetNo;
    }
    if(!cms.preview.checkDevice()){
        return false;
    }
    var config = {
        title: '删除预置点' + cms.box.buildIframe(600, 400, true), 
        html: '确定要删除“预置点' + pn + '”吗？',
        callBack: cms.preset.deletePresetAction,
        returnValue: pn
    };
    cms.box.confirm(config);
};

cms.preset.deletePresetAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var pn = parseInt(pwReturn.returnValue, 10);
        
        var camera = cms.preview.getWinDevData();
        var previewOcx = cms.preview.previewOcx;
        var iAction = 2;
        
        //删除设备上的预置点        
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetPreset Request] szDevId: ' + camera.devCode + ', iChannel: ' + camera.channelNo 
            + ', iAction: ' + iAction + ', iPresetId: ' + pn + ', 备注：删除(' + camera.devCode + ')预置点' + pn);
        
        var result = cms.ocx.setPreset(previewOcx, camera.devCode, camera.channelNo, iAction, pn);
        
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetPreset Response] return: ' + cms.ocx.showErrorCode(result));
        if(0 == result){
            //删除服务器数据库中的预置点
            cms.preset.deletePesetInfo(camera.cameraId, pn);
            
            //重新获取预置点名称信息
            //cms.preset.getPresetInfo(camera.cameraId, pn);
            
            //重新获取全部预置点名称信息
            cms.preset.getPresetInfo(camera.cameraId, 0);
        } else {
            cms.box.alert({title: '提示信息', html: '删除预置点失败'});
        }
        pwobj.Hide();
    } else {
        pwobj.Hide();
    }
};

cms.preset.getPresetInfo = function(cameraId, presetNo, isEdit){
    if(cameraId == undefined){
        var camera = cms.preview.getWinDevData();
        if(camera.devCode.equals(string.empty)){
            cms.preset.fillPresetInfo(null);
            return false;
        }
        cameraId = camera.cameraId;
        presetNo = 0;
    }
    var urlparam = 'action=getPresetInfo&cameraId=' + cameraId + '&presetNo=' + presetNo;
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
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
                cms.preset.fillPresetInfo(jsondata, presetNo);
                if(isEdit){
                    cms.preset.showPresetInfo(jsondata, presetNo);
                }
            }
            delete strData;
            delete jsondata;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) == 'function'){CollectGarbage();} }
    });
};

cms.preset.fillPresetInfo = function(jsondata, presetNo){
    var c = null == jsondata ? 0 : jsondata.list.length;
    var pn = 0;
    cms.preset.resetPresetInfo();
    if(c > 0){
        for(var i=0; i<c; i++){
            cms.util.$('txtPresetName_' + jsondata.list[i].no).value = jsondata.list[i].name;
            var isPreset = jsondata.list[i].deleted == 0;
            cms.util.$('txtIsPreset_' + jsondata.list[i].no).value = isPreset ? '1' : '0';
            cms.util.$('lblPresetDeleted_' + jsondata.list[i].no).style.display = isPreset ? '' : 'none';
        }
    }
};

cms.preset.showPresetInfo = function(jsondata, presetNo){
    if(jsondata.list.length > 0){
        cms.util.$('txtPresetName_EditForm').value = jsondata.list[0].name;
        var deleted = jsondata.list[0].deleted;
        if(1 == deleted){
            cms.util.$('txtDeleted_EditForm').value = jsondata.list[0].deleted;
            cms.util.$('divPresetInfoPrompt').innerHTML = '说明：预置点' + presetNo + '未设置或已删除，不能编辑名称。';
        }        
    } else {        
        cms.util.$('txtDeleted_EditForm').value = '-1';
        cms.util.$('divPresetInfoPrompt').innerHTML = '说明：预置点' + presetNo + '未设置或已删除，不能编辑名称。';
    }
};

cms.preset.editPresetName = function(obj){
    var camera = cms.preview.getWinDevData();
    if(camera.devCode.equals(string.empty)){
        return false;
    }
    var strName = $('#txtPresetName_' + cms.preset.presetNo).val();
    var isPreset = $('#txtIsPreset_' + cms.preset.presetNo).val();
    var strHtml = '<div id="divPresetInfoPrompt" style="margin:5px 10px;color:#f00;"></div>'
        + '<table cellpadding="0" cellspacing="0" class="tbform" style="margin:5px 10px;">'
        + '<tr>'
        + '<td>监控点名称：</td>'
        + '<td><input type="text" id="txtCameraName_EditForm" class="txt w210" value="' + camera.cameraName + '" maxlength="32" disabled="disabled" /></td>'
        + '</tr>'
        + '<tr>'
        + '<td>预置点序号：</td>'
        + '<td><input type="text" id="txtPresetNo_EditForm" class="txt w60" value="' + cms.preset.presetNo + '" maxlength="32" disabled="disabled" /></td>'
        + '</tr>'
        + '<tr>'
        + '<td>预置点名称：</td>'
        + '<td><input type="text" id="txtPresetName_EditForm" class="txt w210" value="' + strName + '" onkeydown="cms.preset.statTextLength();" onkeyup="cms.preset.statTextLength();" maxlength="32" /></td>'
        + '</tr>'
        + '<tr>'
        + '<td><input type="hidden" class="txt w30" id="txtDeleted_EditForm" value="0" /></td>'
        + '<td>文字长度应少于32个字符。当前<label id="lblTextLength_EditForm"></label></td>'
        + '</tr>'
        + '</table>'
        + '<input type="hidden" id="txtCameraId_EditForm" class="txt w50" value="' + camera.cameraId + '" maxlength="32" />'
        + '<input type="hidden" id="txtIsPreset_EditForm" class="txt w50" value="' + isPreset + '" maxlength="32" />';
    var config = {
        title: '编辑预置点名称' + cms.box.buildIframe(600, 400, true),
        html: strHtml,
        buttonWidth: 'auto',
        width: 320,
        height: 210,
        buttonText: ['保存','取消'],
        callBack: cms.preset.editPresetNameAction,
        returnValue: {
            isPreset: isPreset
        }
    };
    cms.box.form(config);
    
    //计算文字长度
    cms.preset.statTextLength();
};

cms.preset.statTextLength = function(){
    var len = cms.util.$('txtPresetName_EditForm').value.trim().len();
    cms.util.$('lblTextLength_EditForm').innerHTML = len + '个字符。';
};

cms.preset.editPresetNameAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var camera = cms.preview.getWinDevData();
        if(camera.devCode.equals(string.empty)){
            return false;
        }
        var presetName = $('#txtPresetName_EditForm').val().trim();
        var presetNo = $('#txtPresetNo_EditForm').val().trim();
        var cameraId = camera.cameraId;
        //更新预置点名称时不更新预置点状态
        var deleted = parseInt($('#txtDeleted_EditForm').val().trim(), 10);
        if(0 != Math.abs(deleted)){
            cms.box.alert({title:'提示信息' + cms.box.buildIframe(600, 400, true), html:'预置点' + presetNo + '未设置或已删除，不能编辑名称。<br />请先设置该预置点。'});
            return false;            
        }
        if(presetName.len() > 32){
            cms.box.alert({title:'提示信息' + cms.box.buildIframe(600, 400, true), html:'预置点名称文字长度不得超过32个字符（16个汉字）'});
            return false;
        }
        var isPreset = pwReturn.returnValue.isPreset;
        //更新数据库中的预置点信息
        cms.preset.updatePesetInfo(cameraId, presetNo, presetName, deleted, pwobj, isPreset);

        //pwobj.Hide();
    } else {
        pwobj.Hide();
    }
};

cms.preset.updatePesetInfo = function(cameraId, presetNo, presetName, deleted, pwobj, isPreset){
    var urlparam = 'action=updatePresetInfo&cameraId=' + cameraId + '&presetNo=' + presetNo + '&presetName=' + escape(presetName) + '&deleted=' + deleted;
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
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
                cms.preset.changePresetName(presetNo, presetName);                
                //重新获取全部预置点名称信息
                cms.preset.getPresetInfo(cameraId, 0);
                
                //如果存在预置点，修改名称后重设预置点
                if(isPreset){
                    cms.preset.setPreset(presetNo);
                }
                
                if(pwobj != null && pwobj != undefined){
                    pwobj.Hide();
                }
            } else if(jsondata.result == -2){
                cms.box.alert({title:'提示信息' + cms.box.buildIframe(600, 400, true), html:'预置点名称已经存在'});
            }
            delete strData;
            delete jsondata;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) == 'function'){CollectGarbage();} }
    });
};

cms.preset.deletePesetInfo = function(cameraId, presetNo){
     var urlparam = 'action=deletePresetInfo&cameraId=' + cameraId + '&presetNo=' + presetNo;
    //删除服务器数据库中的预置点
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
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
            var jsondata = strData.toJson();//eval('(' + strData + ')');
            if(jsondata.result == 1){
                cms.preset.changePresetName(presetNo, '预置点' + presetNo);
            }
            delete strData;
            delete jsondata;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) == 'function'){CollectGarbage();} }
    });
};

cms.preset.changePresetName = function(presetNo, strPresetName){
    var obj = cms.util.$('txtPresetName_' + presetNo);
    if(obj != null){
        obj.value = strPresetName;
    }
};