cms.device = cms.device || {};

cms.device.pageStart = 1;
cms.device.pageIndex = cms.device.pageStart;
cms.device.pageSize = 20;
cms.device.arrKeys = {name:'输入要查找的设备名称', indexcode:'输入要查找的设备编号'};

cms.device.zindex = [1000, 1001];

cms.device.DagServerType = 20002;
cms.device.CssServerType = 20004;


cms.device.tabContainerChange = function(rval){
    //alert(rval.action + ',' + rval.container);
};

cms.device.checkKeywords = function(objTxt){
    return $(objTxt).val() == cms.device.arrKeys.indexcode || $(objTxt).val() == cms.device.arrKeys.name;
};

cms.device.getServerLine = function(obj, defaultVal){
    var urlparam = 'action=getServerLine';
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
                    var dr = list[i];
                    cms.util.fillOption(obj, dr.id, dr.name);
                }
                obj.value = defaultVal;
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);
            }
        }
    });
};

cms.device.getServerList = function(typeId, obj, defaultVal){
    var urlparam = 'action=getServerList&typeId=' + typeId;
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
                    var dr = list[i];
                    cms.util.fillOption(obj, dr.serverId, dr.serverName + ' (' + dr.serverIp + ':' + dr.serverPort + ')');
                }
                obj.value = defaultVal;
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);
            }
        }
    });
};

cms.device.getDeviceType = function(obj, defaultVal){
    var urlparam = 'action=getDeviceType';
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
            if (1 == jsondata.result) {
                var list = jsondata.list;
                for(var i=0; i<list.length; i++){
                    var dr = list[i];
                    //cms.util.fillOption(obj, dr.typeCode, dr.typeName + '  ' + dr.typeDesc);
                    cms.util.fillOption(obj, dr.typeCode, dr.typeName);
                }
                obj.value = defaultVal;
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);
            }
        }
    });
};

cms.device.getDeviceListData = function(){
    cms.device.pageIndex = cms.device.pageStart;
    cms.device.getDeviceList();
};

cms.device.getDeviceList = function(){
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var strFilter = $('#ddlType').val();
    var strKeywords = $('#txtKeywords').val();
    if(cms.device.checkKeywords('#txtKeywords')){
        strKeywords = '';
    }
    var status3g = parseInt($('#ddlStatus3G_DevList').val(), 10);
    var status2g = parseInt($('#ddlStatus2G_DevList').val(), 10);
    var hasIp = parseInt($('#ddlHasDevIp_DevList').val(), 10);
    var getChild = $('#showChild_device').attr('checked') == 'checked' ? 1 : 0;
    var urlparam = 'action=getDeviceList&unitId=' + unit.id
        + '&pageIndex=' + (cms.device.pageIndex-cms.device.pageStart)
        + '&pageSize=' + cms.device.pageSize 
        + '&status3g=' + status3g + '&status2g=' + status2g + '&hasIp=' + hasIp
        + '&filter=' + strFilter + '&keywords=' + escape(strKeywords) + '&getChild=' + getChild;
    
    if(!module.isDebugInfoAppend){
        module.clearDebugInfo();
    }
    module.appendDebugInfo(module.getDebugTime() + '[GetDeviceList Request] param: ' + urlparam);
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
            module.appendDebugInfo(module.getDebugTime() + '[GetDeviceList Response] data: ' + data);
            $('#txtData').attr('value', data);
            var strData = $('#txtData').val();
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata = strData.toJson();//eval('(' + strData + ')');
            if(1 == jsondata.result){
                cms.device.showListHeader();
                cms.device.showDevInfo(jsondata);
                module.appendDebugInfo(module.getDebugTime() + '[ShowDeviceList Finished]');
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);
            }
        }
    });
};

cms.device.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader_device');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = cms.device.buildListHeader();
    cms.util.fillTable(row, rowData);
};

cms.device.showDevInfo = function(jsondata){
    var objList = cms.util.$('tbList_device');
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, cms.device.pageSize);
    if(cms.device.pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        cms.device.pageIndex = pc;
        
        return false;
    } else {
        cms.util.clearDataRow(objList, 0);
            
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (cms.device.pageIndex-cms.device.pageStart) * cms.device.pageSize + rid + 1;
            var strParam = "{devId:'" + dr.devId + "',devName:'" + dr.devName + "',typeCode:'" + dr.typeCode + "'}";
            
            row.lang = strParam;
            
            rowData = cms.device.buildListData(row, dr, rnum);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: cms.device.pageIndex,
            pageSize: cms.device.pageSize,
            pageStart: cms.device.pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'cms.device.showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination_device'));
        pageCount = pager.pageCount;
        
        cms.device.setTableStyle('#tbList_device', '#tbHeader_device');
        
        return true;
    }
};

cms.device.buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '组织机构', style:[['width','100px']]};
    rowData[cellid++] = {html: '设备ID', style:[['width','50px']]};
    rowData[cellid++] = {html: '设备名称', style:[['width','180px']]};
    rowData[cellid++] = {html: '设备编号', style:[['width','100px']]};
    rowData[cellid++] = {html: '详情', style:[['width','35px']]};
    rowData[cellid++] = {html: '设备类型', style:[['width','60px']]};
    rowData[cellid++] = {html: '通道数', style:[['width','45px']]};
    rowData[cellid++] = {html: '2G状态', style:[['width','50px']]};
    rowData[cellid++] = {html: '3G状态', style:[['width','50px']]};
    rowData[cellid++] = {html: '设备IP地址', style:[['width','100px']]};
    rowData[cellid++] = {html: '通讯端口', style:[['width','55px']]};
    rowData[cellid++] = {html: '远程配置', style:[['width','60px']]};
    rowData[cellid++] = {html: '注册类型', style:[['width',' 70px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

cms.device.buildListData = function(row, dr, rid){
    var cellid = 0;
    var rowData = [];
    var strDevName = '<a class="link" onclick="cms.device.showEditDeviceWin(\'edit\',\'' + dr.devId + '\');">' + cms.util.fixedCellWidth(dr.devName, 180, true, dr.devName) + '</a>';
    var strCheckBox = '<input type="checkbox" value="' + dr.devId + '" />';
    var is3G = dr.networkMode.indexOf('3') >= 0 || dr.networkMode.indexOf('4') >= 0;
    var strControl = is3G ? '<a class="link" onclick="module.showRemoteConfig(\'' + dr.devCode + '\',\'' + dr.devName + '\', {lock: true});">远程配置</a>' : '-';
    
    rowData[cellid++] = {html: strCheckBox, style:[['width','25px']]};
    rowData[cellid++] = {html: rid, style:[['width','35px']]};
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.unitName, 100, true, dr.unitName), style:[['width','100px']]};
    rowData[cellid++] = {html: dr.devId, style:[['width','50px']]};
    rowData[cellid++] = {html: strDevName, style:[['width','180px']]};
    rowData[cellid++] = {html: cms.util.fixedCellWidth(dr.devCode, 100, true, dr.devCode), style:[['width','100px']]};
    rowData[cellid++] = {html: '<a onclick="module.showDevDetail(\'' + dr.devCode + '\',\'' + dr.devName + '\');">查看</a>', style:[['width','35px']]};
    rowData[cellid++] = {html: dr.typeName, style:[['width','60px']]};
    rowData[cellid++] = {html: dr.cameraChannelCount, style:[['width','45px']]};
    rowData[cellid++] = {html: dr.status2g == 1 ? '在线' : '-', style:[['width','50px']]};
    rowData[cellid++] = {html: dr.status3g == 1 ? '在线' : '-', style:[['width','50px']]};
    rowData[cellid++] = {html: dr.networkAddr, style:[['width','100px']]};
    rowData[cellid++] = {html: dr.networkPort, style:[['width','55px']]};
    rowData[cellid++] = {html: strControl, style:[['width','60px']]};
    rowData[cellid++] = {html: dr.registerType, style:[['width',' 70px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

cms.device.setTableStyle = function(tb, tbHeader){
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
        cms.jquery.selectCheckBox('#tbList_device');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
};

cms.device.showPage = function(page){
    cms.device.pageIndex = parseInt(page, 10);
    cms.device.getDeviceList();
};

cms.device.showEditDeviceWin = function(action, devId){
    timerPlayStop(true);
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var boxH = 460;
    var bodySize = cms.util.getBodySize();
    if(boxH > bodySize.height){
        boxH = bodySize.height - 2;
    }
    var config = {
        id: 'pweditform',
        title: (action == 'edit' ? '编辑' : '添加') + '设备信息',
        width: 500,
        height: boxH,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: cms.device.zindex[0],
        callBack: cms.device.editDevice
    };
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }
    var conH = boxH - 25 - 28 - config.bottomHeight - 10;
    
    var dev = {devId:'', devCode:'', devName:'', typeCode:'', channelNum: '1', userName:'admin', userPwd:'12345',
        dagServerId:0, cssServerId: 0, audioType: 0, bitStreamType: 0, serverLineId: 0};
    var devConfig = {phoneNumber2G:'',phoneNumber3G:'', latitude:'', longitude:'', devRemark:'', fuelConsumption:''};
    
    if(action == 'edit'){
        //加载设备信息
        var urlparam = 'action=getDeviceInfo&devId=' + devId;
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
                    var di = jsondata.dev;
                    dev.devId = di.devId;
                    dev.unitId = di.unitId;
                    dev.unitName = di.unitName;
                    dev.devCode = di.devCode;
                    dev.devName = di.devName;
                    dev.typeCode = di.typeCode;
                    dev.channelNum = di.cameraChannelCount;
                    dev.userName = di.userName;
                    dev.userPwd = di.userPwd;
                    dev.dagServerId = di.dagServerId;
                    dev.cssServerId = di.cssServerId;
                    dev.audioType = di.audioType;
                    dev.bitStreamType = di.bitStreamType;
                    dev.serverLineId = di.serverLineId;
                    
                    var cfg = jsondata.config;
                    devConfig.phoneNumber2G = cfg.phoneNumber2G;
                    devConfig.phoneNumber3G = cfg.phoneNumber3G;
                    devConfig.latitude = cfg.latitude;
                    devConfig.longitude = cfg.longitude;
                    devConfig.devRemark = cfg.devRemark;
                    devConfig.fuelConsumption = cfg.fuelConsumption;
                } else {
                    module.showErrorInfo(jsondata.msg, jsondata.error);
                }
            }
        });
    } else {
        dev.unitId = unit.id;
        dev.unitName = unit.name;    
    }
    var strChannelCountOption = '';
    for(var i=0; i<=16; i++){
        strChannelCountOption += '<option value="' + i + '">' + i + '</option>';
    }
    var arrAudioType = [['0', '选择音频解码库'],['1', 'G.711'],['2', 'G.722']];
    var arrBitStreamType = [['0','选择码流类型'],['1','1'],['2','2'],['3','3']];
    
    var strHtml = '<div class="tabpanel" id="tabDev">'
        + '<a class="cur" lang="info" rel="#tabcon1"><span>基本信息</span></a>'
        + '<a class="tab" lang="login" rel="#tabcon2"><span>登录信息</span></a>'
        + '<a class="tab" lang="config" rel="#tabcon3"><span>配置信息</span></a>'
        + '</div>'
        + '<div class="p-5-10" style="height:' + conH + 'px;overflow:auto;" id="tabDevContainer">'
        + '<div class="tabcon" id="tabcon1">'
        + '<input id="txtUnitId_DevForm" type="hidden" value="' + dev.unitId + '" />'
        + '<input id="txtDevId_DevForm" type="hidden" value="' + dev.devId + '" />'
        + '<input id="txtAction_DevForm" type="hidden" value="' + action + '" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>组织机构：','class="tdr w120"'),
            cms.util.buildTd('<input type="text" class="txt w260" readonly="readonly" disabled="disabled" value="' + dev.unitName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>设备编号：','class="tdr"'),
            cms.util.buildTd('<input id="txtDevCode_DevForm" type="text" class="txt w260" maxlength="30" ' + (action=='edit' && (loginUser.userName != 'admin' && loginUser.userId != '1') ? ' disabled="disabled" ' : '') + ' value="' + dev.devCode + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>设备名称：','class="tdr"'),
            cms.util.buildTd('<input id="txtDevName_DevForm" type="text" class="txt w260" maxlength="64" value="' + dev.devName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>设备类型：','class="tdr"'),
            cms.util.buildTd('<select id="ddlDevType_DevForm" class="select" style="width:266px;"><option value="">请选择设备类型</option>' + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>设备接入服务器：','class="tdr"'),
            cms.util.buildTd('<select id="ddlDagServer_DevForm" class="select" style="width:266px;"><option value="0">请选择设备接入服务器</option>' + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>中心存储服务器：','class="tdr"'),
            cms.util.buildTd('<select id="ddlCsuServer_DevForm" class="select" style="width:266px;"><option value="0">请选择中心存储服务器</option>' + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>连接服务器线路：','class="tdr"'),
            cms.util.buildTd('<select id="ddlServerLine_DevForm" class="select" style="width:266px;"><option value="0">请选择服务器线路</option>'  + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>视频通道数：','class="tdr"'),
            cms.util.buildTd('<select id="ddlChannelCount_DevForm" class="select" style="width:236px;float:left;">' + strChannelCountOption + '</select>'
                + '<a class="ibtn" id="ibtnHelp" onclick="cms.device.help(\'channel\', this);" style="float:left;margin-left:5px;"><i class="icon-help"></i></a>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>音频解码库：','class="tdr"'),
            cms.util.buildTd('<select id="ddlAudioType_DevForm" class="select" style="width:266px;float:left;">' 
                + cms.util.buildOptions(arrAudioType, dev.audioType)
                + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('GPS定位：','class="tdr"'),
            cms.util.buildTd('<input id="txtLatLng_DevForm" type="text" class="txt w200" disabled="disabled" maxlength="64" value="' + cms.device.buildLatLng(devConfig.latitude, devConfig.longitude) + '" '
            + ' ondblclick="cms.device.openMapLocation(\'' + dev.devName + '\');" />'
            + '<a class="btn btnc22" onclick="cms.device.openMapLocation();"><span>打开地图</span></a>')
        ])
        + (action == 'add'? cms.util.buildTr([cms.util.buildTd('','class="tdr"'),
            cms.util.buildTd('<label for="chbContinue_DevForm" class="chb-label-nobg nomp"><input type="checkbox" id="chbContinue_DevForm" class="chb"><span>添加完成后继续添加</span></label>')
        ]):'')
        /*
        + cms.util.buildTr([cms.util.buildTd('数字通道数：','class="tdr"'),
            cms.util.buildTd('<input id="txtDevName_DevForm" type="text" class="txt w220" maxlength="5" value="0" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('报警输入数：','class="tdr"'),
            cms.util.buildTd('<input id="txtDevName_DevForm" type="text" class="txt w220" maxlength="5" value="0" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('报警输出数：','class="tdr"'),
            cms.util.buildTd('<input id="txtDevName_DevForm" type="text" class="txt w220" maxlength="5" value="0" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('对讲通道数：','class="tdr"'),
            cms.util.buildTd('<input id="txtDevName_DevForm" type="text" class="txt w220" maxlength="5" value="0" />')
        ])
        */
        + '</table>'        
        + '</div>'
        + '<div class="tabcon" id="tabcon2" style="display:none;">'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        /*
        + cms.util.buildTr([cms.util.buildTd('登录用户名：','class="tdr w80"'),
            cms.util.buildTd('<input id="txtUserName_DevForm" type="text" class="txt w260" maxlength="20" value="' + dev.userName + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('登录密码：','class="tdr w80"'),
            cms.util.buildTd('<input id="txtUserPwd_DevForm" type="text" class="txt w260" maxlength="25" value="' + dev.userPwd + '" />')
        ])
        */
        + cms.util.buildTr([cms.util.buildTd('设备登录密码：','class="tdr w90"'),
            cms.util.buildTd('<input id="txtDevPwd_DevForm" type="password" class="txt pwd w260" maxlength="25" value="" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('确认密码：','class="tdr w90"'),
            cms.util.buildTd('<input id="txtDevPwdConfirm_DevForm" type="password" class="txt pwd w260" maxlength="25" value="" />')
        ])
        + (action == 'edit' ? cms.util.buildTr([cms.util.buildTd('提示说明：','class="tdr w90"'),
            cms.util.buildTd('如果不修改密码，请不要输入密码')
        ]) : '')
        + '</table>'
        /*
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('GPS纬度：','class="tdr"'),
            cms.util.buildTd('<input id="txtLatitude_DevForm" type="text" class="txt w260" maxlength="64" value="' + devConfig.latitude + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('GPS经度：','class="tdr"'),
            cms.util.buildTd('<input id="txtLongitude_DevForm" type="text" class="txt w260" maxlength="64" value="' + devConfig.longitude + '" />')
        ])
        + '</table>'
        */
        + '</div>'
        + '<div class="tabcon" id="tabcon3" style="display:none;">'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('设备3G号码：','class="tdr w85"'),
            cms.util.buildTd('<input id="txtPhoneNumber3G_DevForm" type="text" class="txt w260" maxlength="64" value="' + devConfig.phoneNumber3G + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('设备2G号码：','class="tdr"'),
            cms.util.buildTd('<input id="txtPhoneNumber2G_DevForm" type="text" class="txt w260" maxlength="64" value="' + devConfig.phoneNumber2G + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('百公里油耗：','class="tdr"'),
            cms.util.buildTd('<input id="txtFuelConsumption_DevForm" type="text" class="txt w260" maxlength="10" value="' + devConfig.fuelConsumption + '" /> 升')
        ])     
        + cms.util.buildTr([cms.util.buildTd('码流类型：','class="tdr"'),
            cms.util.buildTd('<select id="ddlBitStreamType_DevForm" class="select" style="width:266px;float:left;">' 
                + cms.util.buildOptions(arrBitStreamType, dev.bitStreamType)
                + '</select>')
        ])
        + cms.util.buildTr([cms.util.buildTd('备注信息：','class="tdr" style="vertical-align:top;" '),
            cms.util.buildTd('<textarea id="txtDevRemark_DevForm" runat="server" cols="20" rows="2" class="txt w260" style="height:60px">' + devConfig.devRemark.toValue() + '</textarea>')
        ])
        + '</table>'
        + '</div>'
        + '</div>';

    config.html = strHtml;
    var pwobj = cms.box.win(config);
    
    cms.device.getDeviceType(cms.util.$('ddlDevType_DevForm'), dev.typeCode);
    cms.device.getServerList(cms.device.DagServerType, cms.util.$('ddlDagServer_DevForm'), dev.dagServerId);
    cms.device.getServerList(cms.device.CssServerType, cms.util.$('ddlCsuServer_DevForm'), dev.cssServerId);
    cms.device.getServerLine(cms.util.$('ddlServerLine_DevForm'), dev.serverLineId);
    
    $('#ddlChannelCount_DevForm').attr('value', dev.channelNum);
    
    cms.jquery.tabs('#tabDev', '#tabDevContainer', '.tabcon', 'cms.device.tabContainerChange');
    //cms.device.toggle();
    
//    //限制设备编号的输入格式，只能输入英文字母或数字
//    cms.util.inputControl(cms.util.$('txtDevCode_DevForm'), false);
    
    if(action=='edit' && (loginUser.userName != 'admin' && loginUser.userId != '1')){
        $('#txtDevName_DevForm').focus();
    } else {
        $('#txtDevCode_DevForm').focus();
    }
};

var pwMapLocation = null;
cms.device.openMapLocation = function(strTitle){
    var strLatLng = $('#txtLatLng_DevForm').val().trim();
    var url = cms.util.path + '/modules/emap/location.aspx?latLng=' + strLatLng + '&callBack=' + 'parent.cms.device.openMapLocationCallBack' + '&title=' + escape(strTitle);
    var config = {
        id: 'pwMapLocation',
        title: 'GPS定位',
        html: url,
        noBottom: true,
        requestType: 'iframe',
        width: 600,
        height: 450,
        filter: false,
        maxAble: true,
        showMinMax: true
    };
    pwMapLocation = cms.box.win(config);
};

cms.device.openMapLocationCallBack = function(latLng, isClose){
    $('#txtLatLng_DevForm').attr('value', latLng);
    if(isClose && pwMapLocation != null){
        pwMapLocation.Hide();
    }
};

cms.device.toggle = function(){
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
};

cms.device.buildLatLng = function(lat, lng){
    if(lat.trim() != '' && lng.trim() != ''){
        return lat.trim() + ',' + lng.trim();
    }
    return '';
};

cms.device.checkLatLng = function(latLng){
    var arrLatLng = latLng.split(',');
    if(arrLatLng.length == 2){
        return [true, arrLatLng[0], arrLatLng[1]];
    } else {
        return [false, '', ''];
    }
};

cms.device.editDevice = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strAction = $('#txtAction_DevForm').val();
        var unitId = $('#txtUnitId_DevForm').val();
        var devCode = $('#txtDevCode_DevForm').val().trim();
        var devName = $('#txtDevName_DevForm').val().trim();
        var typeCode = $('#ddlDevType_DevForm').val();
        var channelCount = $('#ddlChannelCount_DevForm').val();
        var dagServerId = $('#ddlDagServer_DevForm').val();
        var cssServerId = $('#ddlCsuServer_DevForm').val();
        var serverLineId = $('#ddlServerLine_DevForm').val();
        var userName = '';//$('#txtUserName_DevForm').val();
        var userPwd = '';//$('#txtUserPwd_DevForm').val();
        var audioType = $('#ddlAudioType_DevForm').val().trim();
        var bitStreamType = $('#ddlBitStreamType_DevForm').val().trim();
        
        var devPwd = $('#txtDevPwd_DevForm').val();
        var devPwdConfirm = $('#txtDevPwdConfirm_DevForm').val();
        
        var phoneNumber3G = $('#txtPhoneNumber3G_DevForm').val().trim();
        var phoneNumber2G = $('#txtPhoneNumber2G_DevForm').val().trim();
        var fuelConsumption = $('#txtFuelConsumption_DevForm').val().trim();
        var latLng = $('#txtLatLng_DevForm').val().trim();
        var arrLatLng = cms.device.checkLatLng(latLng);
        var latitude = arrLatLng[1].trim();
        var longitude = arrLatLng[2].trim();
        
        var devRemark = $('#txtDevRemark_DevForm').val().trim();
        var pattern = /^[a-zA-Z0-9\-]{1,30}$/;
        
        if(devCode.equals('')){
            $('#tabDev a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtDevCode_DevForm'), {id: boxId, title: '提示信息', html: '请输入设备编号。'});
            return false;
        } else if(!pattern.exec(devCode)){
            $('#tabDev a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtDevCode_DevForm'), {id: boxId, title: '提示信息', html: '设备编号格式输入错误。<br />设备编号只能是1-11位的英文字母、数字组合。'});
            return false;
        } else if(devName.equals('')){
            $('#tabDev a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtDevName_DevForm'), {id: boxId, title: '提示信息', html: '请输入设备名称。'});
            return false;
        } else if(typeCode.equals('')){
            $('#tabDev a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('ddlDevType_DevForm'), {id: boxId, title: '提示信息', html: '请选择设备类型。'});
            return false;
        }
        if(latLng != '' && !arrLatLng[0]){
            $('#tabDev a').eq(0).click();
            cms.box.msgAndFocus(cms.util.$('txtLatLng_DevForm'), {id: boxId, title: '提示信息', html: 'GPS数据格式错误。'});
            return false;        
        }
        if(typeCode == '50785' && '' == devPwd && 'edit' != strAction){
            $('#tabDev a').eq(1).click();
            cms.box.msgAndFocus(cms.util.$('txtDevPwd_DevForm'), {id: boxId, title: '提示信息', html: '请输入登录密码。'});
            return false;
        } else if(devPwd != devPwdConfirm){
            $('#tabDev a').eq(1).click();
            cms.box.msgAndFocus(cms.util.$('txtDevPwdConfirm_DevForm'), {id: boxId, title: '提示信息', html: '两次输入的密码不一样。'});
            return false;
        }
        
        var urlparam = '';
        if(strAction == 'edit'){
            var devId = $('#txtDevId_DevForm').val();
            urlparam = 'action=editDevice&devId=' + devId + '&unitId=' + unitId + '&typeCode=' + typeCode
                + '&devCode=' + devCode + '&devName=' + escape(devName)
                + '&cameraChannelCount=' + channelCount + '&audioType=' + audioType + '&bitStreamType=' + bitStreamType
                + '&dagServerId=' + dagServerId + '&cssServerId=' + cssServerId + '&serverLineId=' + serverLineId
                + '&userName=' + userName + '&userPwd=' + userPwd
                + '&phoneNumber3G=' + phoneNumber3G + '&phoneNumber2G=' + phoneNumber2G + '&latitude=' + latitude
                + '&longitude=' + longitude + '&devRemark= ' + escape(devRemark) + '&fuelConsumption=' + fuelConsumption
                + '&devPwd=' + devPwd;
                
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
                    if(jsondata.result == 1){
                        cms.device.getDeviceList();
                        //更新设备信息后，加载设备通道信息
                        cms.camera.getCameraList();
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '设备信息已修改。'}, true);
                        //timerPlayStop(false);
                    } else if(jsondata.result == -2){
                        $('#tabDev a').eq(0).click();
                        cms.box.msgAndFocus(cms.util.$('txtDevCode_DevForm'),{id: boxId, title: '提示信息', html: '设备编号已存在。'}, true);                        
                    } else {
                        module.showErrorInfo(jsondata.msg, jsondata.error);
                        pwobj.Hide();
                        //timerPlayStop(false);
                    }
                }
            });
        } else {
            var isContinue = cms.jquery.isChecked('#chbContinue_DevForm');
            urlparam = 'action=addDevice&unitId=' + unitId + '&typeCode=' + typeCode
                + '&devCode=' + devCode + '&devName=' + escape(devName)
                + '&cameraChannelCount=' + channelCount + '&audioType=' + audioType + '&bitStreamType=' + bitStreamType
                + '&dagServerId=' + dagServerId + '&cssServerId=' + cssServerId + '&serverLineId=' + serverLineId
                + '&userName=' + userName + '&userPwd=' + userPwd
                + '&phoneNumber3G=' + phoneNumber3G + '&phoneNumber2G=' + phoneNumber2G + '&latitude=' + latitude
                + '&longitude=' + longitude + '&devRemark= ' + escape(devRemark) + '&fuelConsumption=' + fuelConsumption
                + '&devPwd=' + devPwd;
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
                    if(jsondata.result == 1){
                        cms.device.getDeviceList();
                        //添加设备信息后，加载设备通道信息
                        cms.camera.getCameraList();
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '设备信息已添加。'}, true);
                        if(isContinue){
                            cms.device.showEditDeviceWin('add');
                        } else {
                            //timerPlayStop(false);
                        }
                    } else if(jsondata.result == -2){
                        $('#tabDev a').eq(0).click();
                        cms.box.msgAndFocus(cms.util.$('txtDevCode_DevForm'),{id: boxId, title: '提示信息', html: '设备编号已存在。'}, true);
                    } else {
                        module.showErrorInfo(jsondata.msg, jsondata.error);
                        pwobj.Hide();
                        //timerPlayStop(false);
                    }
                }
            });
        }
    } else {
        pwobj.Hide();
        //timerPlayStop(false);
    }
    cms.device.help('hide');
};

cms.device.showDeleteDeviceWin = function(){
    timerPlayStop(true);
    var uc = cms.jquery.getCheckBoxChecked('#tbList_device').length;    
    var devIdList = cms.jquery.getCheckBoxCheckedValue('#tbList_device');
     if(uc == 0){
        cms.box.alert({title:'提示信息', html:'请选择要删除的设备！'}, true);
        //timerPlayStop(false);
        return false;
    } else {
        var strHtml = '当前选中了<b style="color:#f00;padding:0 3px;">' + uc + '</b>个设备。<br />'
            + '删除设备将同时删除设备相关的配置信息及监控点通道等信息。<br />'
            + '删除后不可恢复，您确定要删除选中的设备信息吗？';
        cms.box.confirm({
            id: 'pwdeleteform',
            title: '删除设备信息',
            html: strHtml,
            callBack: cms.device.deleteDevice,
            returnValue: {
                devIdList: devIdList
            }
        });
    }
};

cms.device.deleteDevice = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var devIdList = pwReturn.returnValue.devIdList;
        var urlparam = 'action=deleteDevice&devIdList=' + devIdList;
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
                if(jsondata.result == 1){
                    cms.device.getDeviceList();
                    cms.box.alert({id: boxId, title: '提示信息', html: '设备信息已删除。'}, true);
                } else {
                    module.showErrorInfo(jsondata.msg, jsondata.error);                    
                }
                pwobj.Hide();
                //timerPlayStop(false);
            }
        });
    } else {
        pwobj.Hide();
        //timerPlayStop(false);
    }
};

cms.device.showImportDevWin = function(){
    alert('导入设备功能未完成');
};

cms.device.showExportDevWin = function(){
    alert('导出设备功能未完成');
};

cms.device.help = function(action, obj){
    if(action == 'close' || action == 'hide'){
        module.showHelpInfo(null, 'hide');
    } else {
        var offset = $('#' + obj.id).offset();
        var h = $('#' + obj.id).height();
        var strHtml = '<div style="padding:6px 10px;color:#666;">';
        switch(action){
            case 'channel':
            strHtml += '<b>设备视频通道数说明：</b><br />纯2G设备无视频通道，请选择视频通道数为0。<br />3G设备1-16个通道，默认为1个通道。';
            break;
        }
        strHtml += '</div>';
        //module.showHelpInfo({html:strHtml, position: 'custom', x: offset.left, y: offset.top + h, noTitle:true, minAble: false, closeButtonType: 'text'});
    
        module.showHelpInfo({html:strHtml});
    }
};