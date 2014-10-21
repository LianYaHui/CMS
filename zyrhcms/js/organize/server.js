cms.server = cms.server || {};

cms.server.pageStart = 1;
cms.server.pageIndex = cms.server.pageStart;
cms.server.pageSize = 20;

cms.server.zindex = [1000, 1001];

cms.server.tabContainerChange = function(rval){
    //alert(rval.action + ',' + rval.container);
};

cms.server.getServerType = function(obj, defaultVal){
    var urlparam = 'action=getServerType';
    var strOption = '';
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/server.aspx',
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
            if (1 == jsondata.result) {
                var list = jsondata.list;
                for(var i=0; i<list.length; i++){
                    cms.util.fillOption(obj, list[i].typeId, list[i].typeName + ' ' + list[i].typeCode);
                }
                obj.value = defaultVal;
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);
            }
        }
    });
    return strOption;
};

cms.server.getServerList = function(){
    var urlparam = 'action=getServerList';
    if(!module.isDebugInfoAppend){
        module.clearDebugInfo();
    }
    module.appendDebugInfo(module.getDebugTime() + '[GetServerList Request] param: ' + urlparam);
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/server.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            module.appendDebugInfo(module.getDebugTime() + '[GetServerList Response] data: ' + data);
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata = data.toJson();//eval('(' + data + ')');
            cms.server.showListHeader();
            if(1 == jsondata.result){
                cms.server.showServerInfo(jsondata);
                module.appendDebugInfo(module.getDebugTime() + '[ShowServerList Finished]');
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);
            }
        }
    });
};

cms.server.getServerLine = function(){
    var urlparam = 'action=getServerLine';
    var list = null;
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/server.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        success: function(data) {
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            } else {
                var json = eval('(' + data + ')');
                if (json.result == 1) {
                    list = json.list;
                }
            }
        }
    });
    return list;
};

cms.server.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_server');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = cms.server.buildListHeader();
    cms.util.fillTable(row, rowData);
}

cms.server.showServerInfo = function(jsondata){
    var objList = cms.util.$('tbList_server');
    var rid = 0;
    var dataCount = jsondata.list.length;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, cms.server.pageSize);
    if(cms.server.pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        cms.server.pageIndex = pc;
        
        return false;
    } else {
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (cms.server.pageIndex-cms.server.pageStart) * cms.server.pageSize + rid + 1;
            var strParam = "{serverId:'" + dr.serverId + "',serverName:'" + dr.serverName + "'"
                + ",typeId:'" + dr.typeId + "',typeName:'" + dr.typeName + "'"
                + ",serverIp:'" + dr.serverIp + "',serverPort:'" + dr.serverPort + "'" + "}";
            
            row.lang = strParam;
            
            rowData = cms.server.buildListData(row, dr, rnum);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: cms.server.pageIndex,
            pageSize: cms.server.pageSize,
            pageStart: cms.server.pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'cms.server.showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination_server'));
        pageCount = pager.pageCount;
        
        cms.server.setTableStyle('#tbList_server', '#tbHeader_server');
        
        return true;
    }
}

cms.server.buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '服务器编号', style:[['width','100px']]};
    rowData[cellid++] = {html: '服务器名称', style:[['width','150px']]};
    rowData[cellid++] = {html: '服务器类型', style:[['width','120px']]};
    rowData[cellid++] = {html: 'IP地址', style:[['width','100px']]};
    rowData[cellid++] = {html: '通讯端口', style:[['width','60px']]};
    rowData[cellid++] = {html: '是否允许被下级引用', style:[['width','120px']]};
    rowData[cellid++] = {html: '创建时间', style:[['width','120px']]};
    rowData[cellid++] = {html: '设备数量', style:[['width','60px']]};
    rowData[cellid++] = {html: '备注', style:[['width','100px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.server.buildListData = function(row, dr, rid){
    var cellid = 0;
    var rowData = [];
    var strServerName = '<a class="link" onclick="cms.server.showEditServerWin(\'edit\',\'' + dr.serverId + '\');">' + cms.util.fixedCellWidth(dr.serverName, 150, true, dr.serverName) + '</a>';
    var strCheckBox = '<input type="checkbox" value="' + dr.serverId + '" />';
    
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    rowData[cellid++] = {html: rid, style:[['width','35px']]};
    rowData[cellid++] = {html: dr.serverCode, style:[['width','100px']]};
    rowData[cellid++] = {html: strServerName, style:[['width','150px']]};
    rowData[cellid++] = {html: dr.typeName, style:[['width','120px']]};
    rowData[cellid++] = {html: dr.serverIp, style:[['width','100px']]};
    rowData[cellid++] = {html: dr.serverPort, style:[['width','60px']]};
    rowData[cellid++] = {html: dr.shareFlag == 1 ? '是' : '否', style:[['width','120px']]};
    rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]};
    rowData[cellid++] = {html: dr.deviceCount, style:[['width','60px']]};
    rowData[cellid++] = {html: dr.remark.toHtml(), style:[['width','100px']]}
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

cms.server.setTableStyle = function(tb, tbHeader){
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
        cms.jquery.selectCheckBox('#tbList_server');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
};

cms.server.showPage = function(page){
    cms.server.pageIndex = parseInt(page, 10);
    cms.server.getServerList();
};

cms.server.showEditServerWin = function(action, serverId){
    timerPlayStop(true);
    var boxH = 450;
    var bodySize = cms.util.getBodySize();
    if(boxH > bodySize.height){
        boxH = bodySize.height - 2;
    }
    var config = {
        id: 'pweditform',
        title: (action == 'edit' ? '编辑' : '添加') + '服务器信息',
        width: 420,
        height: boxH,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: cms.server.zindex[0],
        callBack: cms.server.editServer
    };
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }
    var conH = boxH - 25 - config.bottomHeight - 10;
    
    var server = {
        serverId:'',typeId:'', serverIp:'', serverPort:'', serverCode:'',serverName:'',remark:'',shareFlag: 1,deviceCount:0
    };
    var serverIpList = null;
    
    if(action == 'edit'){
        //加载服务器信息
        var urlparam = 'action=getServerInfo&serverId=' + serverId;
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/server.aspx',
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
                    var si = jsondata.server;
                    serverIpList = jsondata.iplist;
                    
                    server.serverId = si.serverId;
                    server.typeId = si.typeId;
                    server.serverName = si.serverName;
                    server.serverCode = si.serverCode;
                    server.shareFlag = si.shareFlag;
                    server.remark = si.remark;
                    
                    server.deviceCount = si.deviceCount;
                }
            }
        });
    }
    
    var serverLineList = cms.server.getServerLine();
    
    var strHtml = ''
        + '<div style="height:' + conH + 'px;overflow:auto;padding:5px 10px;" id="tabDevContainer">'
        + '<div class="tabcon" id="tabcon1">'
        + '<input id="txtServerId_ServerForm" type="hidden" value="' + server.serverId + '" />'
        + '<input id="txtAction_ServerForm" type="hidden" value="' + action + '" />'
        + '<input id="txtIsAutoDelete_ServerForm" type="hidden" value="0" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform" style="margin-left:11px;">'
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>服务器类型：','class="tdr w135"'),
            cms.util.buildTd('<select id="ddlServerType_ServerForm" class="select"' + (server.deviceCount > 0 ? ' disabled="disabled" ' : '') + ' style="width:206px;"><option value="">请选择服务器类型</option>' + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>服务器编号：','class="tdr"'),
            cms.util.buildTd('<input id="txtServerCode_ServerForm" type="text" class="txt w200" maxlength="64" value="' + server.serverCode + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>服务器名称：','class="tdr"'),
            cms.util.buildTd('<input id="txtServerName_ServerForm" type="text" class="txt w200" maxlength="64" value="' + server.serverName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>是否允许被下级引用：','class="tdr"'),
            cms.util.buildTd('<select id="ddlShareFlag_ServerForm" class="select" style="width:206px;"><option value="1">是</option><option value="0">否</option></select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('备注信息：','class="tdr" style="vertical-align:top;"'),
            cms.util.buildTd('<textarea id="txtRemark_ServerForm" type="text" class="txt w200" style="height:40px;">' + server.remark.toValue() + '</textarea>')
        ])
        + '</table>';
    
    if(serverLineList != null){
        strHtml += '<div style="overflow:auto;padding:5px 10px;margin-top:5px;border:solid 1px #99bbe8;height:' + (conH - 165 - 20 - (action == 'add' ? 30 : 0)) + 'px;">';
        for(var j=0; j<serverLineList.length; j++){
            var strServerLine = '<input type="hidden" id="txtServerLineId_ServerForm_' + serverLineList[j].id + '" class="txt w30" name="txtServerLineId_ServerForm" value="' + serverLineList[j].id + '" />'
                + '<input type="hidden" id="txtServerIpId_ServerForm_' + serverLineList[j].id + '" class="txt w30" name="txtServerIpId_ServerForm" value="' + 0 + '" />';
            strHtml += '<table cellpadding="0" cellspacing="0" class="tbform" style="margin:0 0;width:100%;">';
            strHtml += cms.util.buildTr([cms.util.buildTd((j+1) + '.' + serverLineList[j].name + strServerLine,'colspan="2" style="height:22px;font-weight:bold;color:#15428b;"')]);
            
            strHtml += cms.util.buildTr([cms.util.buildTd('<em>*</em>服务器IP：','class="tdr w135"'),
                cms.util.buildTd('<input id="txtServerIp_ServerForm_' + serverLineList[j].id + '" name="txtServerIp_ServerForm" type="text" class="txt w150" maxlength="20" ' + ' value="' + server.serverIp + '" />')
            ])
            + cms.util.buildTr([cms.util.buildTd('<em>*</em>服务器端口：','class="tdr"'),
                cms.util.buildTd('<input id="txtServerPort_ServerForm_' + serverLineList[j].id + '" name="txtServerPort_ServerForm" type="text" class="txt w50" maxlength="5" ' + ' value="' + server.serverPort + '" />'
                + '(1-65535,0:无效)')
            ]);
            strHtml += '</table>';
        }
        strHtml += '</div>';
    }

    strHtml += '<table cellpadding="0" cellspacing="0" class="tbform" style="margin-left:11px;">'
        + (action == 'add'? cms.util.buildTr([cms.util.buildTd('','class="tdr w135"'),
            cms.util.buildTd('<label for="chbContinue_ServerForm" class="chb-label-nobg nomp"><input type="checkbox" id="chbContinue_ServerForm" class="chb"><span>添加完成后继续添加</span></label>')
        ]):'')
        + '</table>'
        + '</div>'
        
        + '</div>';

    config.html = strHtml;
    var pwobj = cms.box.win(config);
    
    $('#ddlServerType_ServerForm').attr('value', server.typeId);
    $('#ddlShareFlag_ServerForm').attr('value', server.shareFlag);
    
    cms.server.getServerType(cms.util.$('ddlServerType_ServerForm'), server.typeId);
    
    if(serverIpList != null){
        for(var i=0; i<serverIpList.length; i++){
            $('#txtServerIpId_ServerForm_' + serverIpList[i].lineId).attr('value', serverIpList[i].id);
            $('#txtServerIp_ServerForm_' + serverIpList[i].lineId).attr('value', serverIpList[i].serverIp);
            $('#txtServerPort_ServerForm_' + serverIpList[i].lineId).attr('value', serverIpList[i].serverPort);
        }
    }
    
    cms.jquery.tabs('#tabDev', '#tabDevContainer', '.tabcon', 'cms.server.tabContainerChange');
    cms.server.toggle();
    if($('#ddlServerType_ServerForm').attr('disabled') == 'disabled'){
        cms.util.$('txtServerCode_ServerForm').focus();
    } else {
        cms.util.$('ddlServerType_ServerForm').focus();    
    }
};

cms.server.toggle = function(){
    $(".item-title").toggle(function(){
		//$(this).next(".item-content").animate({height: 'toggle', opacity: 'toggle'}, "fast");
		$(this).next(".item-content").show();
		$(this).children('a').eq(0).removeClass();
		$(this).children('a').eq(0).addClass("switch sw-open");
		return false;
	},function(){
		//$(this).next(".item-content").animate({height: 'toggle', opacity: 'toggle'}, "fast");
		$(this).next(".item-content").hide();
		$(this).children('a').eq(0).removeClass();
		$(this).children('a').eq(0).addClass("switch sw-close");
		return false;
   });
}

cms.server.editServer = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strAction = $('#txtAction_ServerForm').val();
        var typeId = $('#ddlServerType_ServerForm').val();
        var serverCode = $('#txtServerCode_ServerForm').val().trim();
        var serverName = $('#txtServerName_ServerForm').val().trim();
        var shareFlag = $('#ddlShareFlag_ServerForm').val().trim();
        var remark = $('#txtRemark_ServerForm').val().trim();
        
        var isPass = false;
        
        var strServerIpList = '';
        
        var arrIpId = cms.util.$N('txtServerIpId_ServerForm');
        var arrLine = cms.util.$N('txtServerLineId_ServerForm');
        var arrIp = cms.util.$N('txtServerIp_ServerForm');
        var arrPort = cms.util.$N('txtServerPort_ServerForm');
        var c = arrLine.length;
        var n = 0;
        for(var i=0; i<arrLine.length; i++){
            var lineId = parseInt(arrLine[i].value.trim(), 10);
            var id = parseInt(arrIpId[i].value.trim(), 10);
            var ip = arrIp[i].value.trim();
            var port = arrPort[i].value.trim();
                
            if(ip.equals('') && port.equals('')){
                n++;
                if(id > 0){
                    //删除原有的线路IP信息
                    strServerIpList += '|' + id + ',' +  lineId + ',' + ip + ',' + port;
                }
            } else if(ip.equals('')){
                cms.box.msgAndFocus(arrIp[i], {id: boxId, title: '提示信息', html: '数据不完整。'});
                return false;
            } else if(port.equals('')){
                cms.box.msgAndFocus(arrPort[i], {id: boxId, title: '提示信息', html: '数据不完整。'});
                return false;
            } else {
                var pattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
                if(!pattern.exec(ip)){
                    cms.box.msgAndFocus(arrIp[i], {id: boxId, title: '提示信息', html: 'IP地址格式填写错误。'});
                    return false;
                } else if(isNaN(port) || port < 0 || port > 65535){
                    cms.box.msgAndFocus(arrPort[i], {id: boxId, title: '提示信息', html: '端口填写错误。'});
                    return false;
                }
                strServerIpList += '|' + id + ',' +  lineId + ',' + ip + ',' + port;
            }
        }
        if(strServerIpList != ''){            
            strServerIpList = strServerIpList.substr(1);
        }

        if(typeId.equals('')){
            cms.box.msgAndFocus(cms.util.$('ddlServerType_ServerForm'), {id: boxId, title: '提示信息', html: '请选择服务器类型。'});
        } else if(serverCode.equals('')){
            cms.box.msgAndFocus(cms.util.$('txtServerCode_ServerForm'), {id: boxId, title: '提示信息', html: '请输入服务器编号。'});
        }  else if(serverName.equals('')){
            cms.box.msgAndFocus(cms.util.$('txtServerName_ServerForm'), {id: boxId, title: '提示信息', html: '请输入服务器名称。'});
        } else {
            isPass = true;
        }
        if(!isPass){
            return false;
        }
        
        var urlparam = '';
        if(strAction == 'edit'){
            var serverId = $('#txtServerId_ServerForm').val();
            urlparam = 'action=editServer&serverId=' + serverId + '&typeId=' + typeId
                + '&serverCode=' + serverCode + '&serverName=' + escape(serverName)
                + '&shareFlag=' + shareFlag + '&remark=' + escape(remark) + '&serverIpList=' + strServerIpList;

            $.ajax({
                type: 'post',
                async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/server.aspx',
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
                        cms.server.getServerList();
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '服务器信息已修改。'}, true);
                    } else if(jsondata.result == -2){
                        cms.box.msgAndFocus(cms.util.$('txtServerName_ServerForm'),{id: boxId, title: '提示信息', html: '已存在相同名称的服务器信息。'}, true);                        
                    } else if(jsondata.result == -5){
                        cms.box.msgAndFocus(cms.util.$('txtServerIp_ServerForm_' + jsondata.lineId),{id: boxId, title: '提示信息', html: '已存在相同的服务器线路IP地址和端口。'}, true);                        
                    } else {
                        module.showErrorInfo(jsondata.msg, jsondata.error);
                        pwobj.Hide();
                    }
                }
            });
        } else {
            var isContinue = cms.jquery.isChecked('#chbContinue_ServerForm');
            urlparam = 'action=addServer&typeId=' + typeId
                + '&serverCode=' + serverCode + '&serverName=' + escape(serverName) 
                + '&shareFlag=' + shareFlag + '&remark=' + escape(remark) + '&serverIpList=' + strServerIpList;
            $.ajax({
                type: 'post',
                async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/server.aspx',
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
                        cms.server.getServerList();
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '服务器信息已添加。'}, true);
                        if(isContinue){
                            cms.server.showEditDeviceWin('add');
                        }
                    } else if(jsondata.result == -2){
                        cms.box.msgAndFocus(cms.util.$('txtServerName_ServerForm'),{id: boxId, title: '提示信息', html: '已存在相同名称的服务器信息。'}, true);
                    } else if(jsondata.result == -5){
                        cms.box.msgAndFocus(cms.util.$('txtServerIp_ServerForm_' + jsondata.lineId),{id: boxId, title: '提示信息', html: '已存在相同的服务器线路IP地址和端口。'}, true);                        
                        //IP信息添加失败，但服务器信息添加成功，保存ID
                        $('#txtServerId_ServerForm').attr('value', jsondata.serverId);
                        //添加 改为 编辑
                        $('#txtAction_ServerForm').attr('value', 'edit');
                        //标记 删除 记号
                        $('#txtIsAutoDelete_ServerForm').attr('value', '1');
                    } else { 
                        module.showErrorInfo(jsondata.msg, jsondata.error);
                        pwobj.Hide();
                    }
                }
            });
        }
    } else {
        pwobj.Hide();
        
        //添加服务器IP信息失败后，自动删除添加的服务器信息
        var isAutoDelete = $('#txtIsAutoDelete_ServerForm').val().trim();
        var serverId = $('#txtServerId_ServerForm').val().trim();
        if(isAutoDelete == '1' && serverId != ''){            
            var urlparam = 'action=deleteServer&serverIdList=' + serverId;
            $.ajax({
                type: 'post',
                async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/server.aspx',
                data: urlparam,
                error: function(jqXHR, textStatus, errorThrown){
                    module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR){
                    alert(data);
                }
            });
        }
    }
}

cms.server.showDeleteServerWin = function(){
    var uc = cms.jquery.getCheckBoxChecked('#tbList_server').length;    
    var serverIdList = cms.jquery.getCheckBoxCheckedValue('#tbList_server');
     if(uc == 0){
        cms.box.alert({title:'提示信息', html:'请选择要删除的服务器！'}, true);
        return false;
    } else {
        var strHtml = '当前选中了<b style="color:#f00;padding:0 3px;">' + uc + '</b>个服务器。<br />'
            + '删除后不可恢复，您确定要删除选中的服务器信息吗？';
        cms.box.confirm({
            id: 'pwdeleteform',
            title: '删除服务器信息',
            html: strHtml,
            callBack: cms.server.deleteServer,
            returnValue: {
                serverIdList: serverIdList
            }
        });
    }
};

cms.server.deleteServer = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var serverIdList = pwReturn.returnValue.serverIdList;
        var urlparam = 'action=deleteServer&serverIdList=' + serverIdList;
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/server.aspx',
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
                    cms.server.getServerList();
                    cms.box.alert({id: boxId, title: '提示信息', html: '服务器信息已删除。'}, true);
                } else {
                    module.showErrorInfo(jsondata.msg, jsondata.error);
                }
                pwobj.Hide();
            }
        });
    } else {
        pwobj.Hide();
    }
};