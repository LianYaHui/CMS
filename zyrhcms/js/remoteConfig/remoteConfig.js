var remoteConfig = remoteConfig || {};

remoteConfig.isCopyToChannel = false;
remoteConfig.isCopyToWeekDay = false;

remoteConfig.isDebug = module.checkIsDebug();
//OCX控件
remoteConfig.ocx = null;
//加载提示
remoteConfig.pwLoading = null;
//是否延时加载
remoteConfig.isDelayedLoad = true;

//是否自动读取设备上的信息
remoteConfig.isAutoRead = true;

//是否编码XML格式字符串参数
remoteConfig.isEscapeXml = false;

//定时，单位：毫秒
remoteConfig.timeout = 2000;

remoteConfig.resizeCallBackFunc = null;
remoteConfig.formBodyPadding = 20;
remoteConfig.formBottomHeight = 45;

remoteConfig.curSelect;
remoteConfig.curMenu = '';
remoteConfig.curPageUrl = '';
remoteConfig.funcName = 'remoteConfig.treeAction';
remoteConfig.cmsPath = cmsPath + '/modules/remoteConfig/sub';
remoteConfig.arrTreeData = {
	module:[
		{id: 0, pid: -1, name: ''},
		{id: 1, pid: 0, name: '设备参数', func: null},
		{id: 2, pid: 0, name: '网络参数', func: null},
		{id: 3, pid: 0, name: '通道参数', func: null},
		{id: 4, pid: 0, name: '串口参数', func: null},
		//{id: 5, pid: 0, name: '报警参数', func: null},
		{id: 6, pid: 0, name: '异常参数', func: null},
		{id: 7, pid: 0, name: '硬盘管理', func: null},
		{id: 8, pid: 0, name: '远程升级', func: null},
		{id: 9, pid: 0, name: '设备接入', func: null}
	],
	menu:[
		{id:101, pid: 1, name: '设备信息', callBack:{func: remoteConfig.funcName, action: 'info', url: remoteConfig.cmsPath + '/devInfo.aspx'}},
		{id:102, pid: 1, name: '版本信息', callBack:{func: remoteConfig.funcName, action: 'version', url: remoteConfig.cmsPath + '/devVersion.aspx'}},
		
		{pid: 2, name: '网络设置', callBack:{func: remoteConfig.funcName, action: 'network', url: remoteConfig.cmsPath + '/networkSetting.aspx'}},

		{pid: 3, name: '显示设置', callBack:{func: remoteConfig.funcName, action: 'osdSetting', url: remoteConfig.cmsPath + '/osdSetting.aspx'}},
		{pid: 3, name: '视频设置', callBack:{func: remoteConfig.funcName, action: 'video', url: remoteConfig.cmsPath + '/videoSetting.aspx'}},
		{pid: 3, name: '设备录像计划', callBack:{func: remoteConfig.funcName, action: 'deviceRecordPlan', url: remoteConfig.cmsPath + '/devRecordPlan.aspx'}},
		{pid: 3, name: '中心录像计划', callBack:{func: remoteConfig.funcName, action: 'centerRecordPlan', url: remoteConfig.cmsPath + '/storeRecordPlan.aspx'}},
		{pid: 3, name: '设备抓图计划', callBack:{func: remoteConfig.funcName, action: 'capturePicturePlan', url: remoteConfig.cmsPath + '/capturePicturePlan.aspx'}},
		{pid: 3, name: '移动侦测', callBack:{func: remoteConfig.funcName, action: 'motionDetection', url: remoteConfig.cmsPath + '/motionDetection.aspx'}},
		{pid: 3, name: '视频丢失', callBack:{func: remoteConfig.funcName, action: 'videoLost', url: remoteConfig.cmsPath + '/videoLost.aspx'}},
		{pid: 3, name: '遮挡报警', callBack:{func: remoteConfig.funcName, action: 'maskAlarm', url: remoteConfig.cmsPath + '/maskAlarm.aspx'}},
		{pid: 3, name: '视频遮盖', callBack:{func: remoteConfig.funcName, action: 'videoMask', url: remoteConfig.cmsPath + '/videoMask.aspx'}},
		{pid: 3, name: '字符叠加', callBack:{func: remoteConfig.funcName, action: 'osdCustom', url: remoteConfig.cmsPath + '/osdCustom.aspx'}},

		{pid: 4, name: 'RS232设置', callBack:{func: remoteConfig.funcName, action: 'rs232', url: remoteConfig.cmsPath + '/rs232Setting.aspx'}},
		{pid: 4, name: 'RS485设置', callBack:{func: remoteConfig.funcName, action: 'rs485', url: remoteConfig.cmsPath + '/rs485Setting.aspx'}},
		
		{pid: 5, name: '报警输入设置', callBack:{func: remoteConfig.funcName, action: 'alarmInput', url: remoteConfig.cmsPath + '/alarmInputSetting.aspx'}},
		{pid: 5, name: '报警输出设置', callBack:{func: remoteConfig.funcName, action: 'alarmOutput', url: remoteConfig.cmsPath + '/alarmOutputSetting.aspx'}},
		
		{pid: 6, name: '异常参数设置', callBack:{func: remoteConfig.funcName, action: 'abnormalParam', url: remoteConfig.cmsPath + '/exceptionSetting.aspx'}},
		
		{pid: 7, name: '硬盘管理设置', callBack:{func: remoteConfig.funcName, action: 'diskManage', url: remoteConfig.cmsPath + '/diskManageSetting.aspx'}},

		{pid: 8, name: '远程升级设置', callBack:{func: remoteConfig.funcName, action: 'remoteUpdate', url: remoteConfig.cmsPath + '/remoteUpdate.aspx'}},

		{pid: 9, name: '设备接入平台', callBack:{func: remoteConfig.funcName, action: 'pagSetting', url: remoteConfig.cmsPath + '/devPagSetting.aspx'}}
	]
};

remoteConfig.arrRecordType = [
    [0xff, '所有录像类型'],
    [0x0, '定时录像'],
    [0x1, '移动侦测录像'],
    [0x2, '报警录像'],
    [0x3, '报警或移动侦测录像'],
    [0x4, '报警和移动侦测录像'],
    [0x5, '命令触发'],
    [0x6, '手动录像'],
    [0x7, '震动报警录像'],
    [0x8, '环境报警触发录像']
];

$(window).load(function(){
	remoteConfig.frame.initialForm();
	remoteConfig.frame.setBodySize();
	remoteConfig.frame.setFrameByShortcutKey();
	remoteConfig.loadTreeMenu();
//	
//    module.showOcxDebugBox();
//    module.hideOcxDebugBox();
    
    module.showDebugBox(null, {position:7,x:0,y:1});
    module.hideDebugBox();
    
	remoteConfig.initialForm();
	remoteConfig.task.initial();
	remoteConfig.frame.setBodySize();
	
	window.setTimeout(remoteConfig.loadDefaultPage, 500);
});

$(window).resize(function(){
	remoteConfig.frame.setBodySize();
});

$(window).unload(function(){
    if(remoteConfig.task.timer != undefined && remoteConfig.task.timer != null){
        clearTimeout(remoteConfig.task.timer);
    }
});


remoteConfig.initialForm = function(){
    $('#statusbar').append('<a onclick="remoteConfig.resumeDevice();" class="btn btnc22" style="margin:0 3px 0 2px;"><span class="w65">恢复默认值</span></a>'
        + '<a onclick="remoteConfig.rebootDevice(this);" id="btnReboot" class="btn btnc22"><span class="w50">重启设备</span></a>');
    if(remoteConfig.isDebug){
        $('#bodyRight .titlebar').append('<a name="windebug" class="ibtn nobg" id="btnDebug" onclick="module.showDebugBox();" style="float:right;margin-right:2px;"><i class="icon-debug"></i></a>');
    }
    $('#bodyRight .titlebar').append('<span id="lblDevInfo_RemoteConfig" style="float:right;margin-right:10px;">[' + devInfo.devCode + ']' + '&nbsp;' + devInfo.devName + '</span>');
    $('#statusbar').append('<a class="btn btnc24" id="btnLoginWmp" onclick="remoteConfig.initialOcx();" style="margin-left:3px;display:none;"><span>注册WMP平台</span></a>');
    $('#bodyLeft .titlebar').append('<a class="ibtn nobg" title="刷新" onclick="remoteConfig.reload();" style="float:right;margin-right:1px;"><i class="icon-update"></i></a>');
};

remoteConfig.loadTreeMenu = function(){
	remoteConfig.tree.buildMenuTree(remoteConfig.arrTreeData, [1, 2, 3], remoteConfig.arrTreeData.module.length);
};

remoteConfig.loadDefaultPage = function(){
	remoteConfig.treeAction({type: 'menu', action:'info', name: '设备信息', url: remoteConfig.cmsPath + '/devInfo.aspx'});	//加载默认页面
};

remoteConfig.treeAction = function(param){
	if(remoteConfig.curSelect == param.action){
		return false;	//不重复加载
	}
	var strUrl = '';
	if(param.type == 'menu'){
		//改变框架中标题栏的名称
		remoteConfig.frame.setFormTitle(param.name);
		remoteConfig.frame.setFormPrompt('');
		strUrl = param.url;
	}
	if(strUrl == ''){
	    strUrl = 'sub/blank.aspx';
	}
	//remoteConfig.setFormButton(null);
	/*
	if(0 == remoteConfig.frame.taskBoxWinMode){
	    remoteConfig.frame.setTaskBoxSize(1, null);
	}
	*/
	//隐藏任务栏
	remoteConfig.frame.setTaskBoxSize(0, null);
	
	strUrl += (strUrl.indexOf('?') >=0 ? '&' : '?') + 'devCode=' + devInfo.devCode + '&' + new Date().getTime();
	remoteConfig.curPageUrl = strUrl;
	
	remoteConfig.loadPage(strUrl);
	remoteConfig.curSelect = param.action;	
};

remoteConfig.loadPage = function(strUrl){
	$("#bodyForm").empty();
	$("#bodyForm").html('正在加载，请稍候...');
	$("#bodyForm").load(strUrl);
	
    remoteConfig.isCopyToChannel = false;
    remoteConfig.isCopyToWeekDay = false;
};

/*
remoteConfig.setFormButton = function(param){
	var strButtonHtml = '';
    if(param != null){
	    var strStyle = '';
	    var strFunc = '';
	    for(var i = 0; i<param.length; i++){
	        strStyle = i > 0 ? ' style="margin-left:3px;" ' : '';
	        strFunc = param[i].func != null && param[i].func != '' && param[i].func != undefined ? ' onclick="' + param[i].func + '();" ' : '';
	        strButtonHtml += '<a class="btn btnc24"' + strFunc + strStyle + '><span>' + param[i].name + '</span></a>';
	    }
    }
    //设置右下角按钮
    remoteConfig.frame.setFormButton(strButtonHtml);
};
*/

remoteConfig.setFormBodySize = function(callBack){
    var formSize = remoteConfig.frame.getFormSize();
    var conHeight = formSize.height - remoteConfig.formBodyPadding - remoteConfig.formBottomHeight;
    
    $('#divFormContent').height(conHeight);
    
    if(typeof callBack == 'function'){
        remoteConfig.resizeCallBackFunc = callBack;
    } else if(typeof callBack == 'string' && typeof eval('(' + callBack + ')') == 'function'){
        remoteConfig.resizeCallBackFunc = eval('(' + callBack + ')');
    }
    if(remoteConfig.resizeCallBackFunc != null){
        remoteConfig.resizeCallBackFunc(formSize, conHeight);
    }
};

remoteConfig.setFormTableStyle = function(){
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
};

remoteConfig.rebootDevice = function(btn){
    var config = {
        id: 'pwrcc01',
        title: '提示',
        html: '确定要重启设备吗？' + cms.box.buildIframe(240, 120, true),
        width: 240,
        height: 120,
        callBack: remoteConfig.rebootDeviceAction,
        returnValue: btn
    };
    cms.box.confirm(config);
};

remoteConfig.rebootDeviceAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        pwobj.Hide();
        var strDevCode = devInfo.devCode;
        var btn = pwReturn.returnValue;
        var urlparam = 'action=rebootDevice&devCode=' + strDevCode + '&setting=';
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[rebootDevice Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.rebootDeviceActionCallBack,
            param: {
                btn: btn
            }
        });
    } else {        
        pwobj.Hide();
    }
};

remoteConfig.rebootDeviceActionCallBack = function(data, param){
    module.appendDebugInfo(module.getDebugTime() + '[rebootDevice Response] data: ' + data);
    remoteConfig.setControlDisabledByTiming(param.btn, false);
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    var id = jsondata.list[0];
    remoteConfig.task.appendTaskList({id:id, action:'rebootDevice', title:'重启设备', result:'正在重启，设备重启大约需要30秒，请稍候...'});
};

remoteConfig.rebootDeviceReturn = function(){
    remoteConfig.hideLoading();
    /*
    if(remoteConfig.checkDevOnline(devInfo.devCode) == 1){
        remoteConfig.showLoading('设备重启成功');
    } else {
        remoteConfig.showLoading('设备重启失败');
    }
    */
};

remoteConfig.checkDevOnline = function(devCode){    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpCheckOnline Request] szDevId: ' + devInfo.devCode);
    var result = cms.ocx.checkOnline(remoteConfig.ocx, devCode);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpCheckOnline Response] return: ' + cms.ocx.showErrorCode(result));
    return result;
};

remoteConfig.resumeDevice = function(){
    var config = {
        id: 'pwrcc01',
        title: '提示',
        html: '确定要恢复设备默认值吗？' + cms.box.buildIframe(240, 120, true),
        width: 240,
        height: 120,
        callBack: remoteConfig.resumeDeviceAction
    };
    cms.box.confirm(config);

};

remoteConfig.resumeDeviceAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        pwobj.Hide();
        /*
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpResume Request] szDevId: ' + devInfo.devCode);
        var result = cms.ocx.resume(remoteConfig.ocx, devInfo.devCode);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpResume Response] return: ' + cms.ocx.showErrorCode(result));
        if(result != 0){
            var ex = cms.ocx.parseErrorCode(result);
            cms.box.alert({title: '错误信息',html: ex[2]});
        }
        */
    } else {
        pwobj.Hide();
    }
};

/*
    更新设备配置信息
    将设置的或从设备中读取的设备配置保存到数据库中
*/
remoteConfig.updateRemoteConfig = function(strDevCode, strField, strValue){
    var config = {
        data: 'action=updateRemoteConfig&devCode=' + strDevCode + '&field=' + strField + '&value=' + escape(strValue),
        callBack: remoteConfig.updateRemoteConfigCallBack
    };
    remoteConfig.ajaxRequest(config);
};

remoteConfig.updateRemoteConfigCallBack = function(data, param){
    //暂时不处理设备配置更新
    
};

remoteConfig.close = function(){
    
};

remoteConfig.reload = function(){
    location.reload();
};


remoteConfig.fillChannelOption = function(obj, channelCount, channelName){
    for(var i=0; i<channelCount; i++){
        var num = i + 1;
        cms.util.fillOption(obj, num, channelName + num);
    }
};

remoteConfig.setCheckAll = function(chbName, chbAllName){
    if(cms.util.getCheckBoxChecked(chbName).length == cms.util.$N(chbName).length){
        cms.util.selectCheckBox(chbAllName, 1);
    } else {
        cms.util.selectCheckBox(chbAllName, 2);
    }
};
//设置HTML控件可用性
remoteConfig.setControlDisabled = function(btn, disabled){
    btn.disabled = disabled;
    var css = btn.className;
    if(btn.disabled){
        btn.className = css + ' disabled';
    } else {
        btn.className = css.replace(' disabled', '');
    }
};

remoteConfig.checkControlDisabled = function(btn, disabled){
    if(btn != undefined && btn != null){
        if(btn.disabled){
            return false;
        }
        if(disabled != undefined){
            btn.disabled = disabled;
        } else {
            btn.disabled = true;
        }
        var css = btn.className;
        if(btn.disabled){
            btn.className = css + ' disabled';
        } else {
            btn.className = css.replace(' disabled', '');
        }
    }
    return true;
};

remoteConfig.setControlDisabledByTiming = function(btn, disabled, timeout){
    if(timeout == undefined || typeof timeout != 'number'){
        timeout = remoteConfig.timeout;
    }
    if(btn != undefined && btn != null){
        window.setTimeout(remoteConfig.setControlDisabled, timeout, btn, disabled);
    }
};

//快捷键
remoteConfig.shortcutKeyAction = function(keyCode){    
    switch(keyCode){
        case 67:    // 'C' Clear
            $("a#btnClear").click();
            break;
        case 71:    // 'G' Get
            $("a#btnGet").click();
            break;
        case 82:    // 'R' Read
            $("a#btnRead").click();
            break;
        case 83:    // 'S' Set
            $("a#btnSet").click();
            break;
    }
};

remoteConfig.showChannelList = function(objName, channelName, channelText, isReset){
    var obj = cms.util.$(objName);
    if(channelName == undefined){
        channelName = 'chbChannelCopy';
    }
    if(channelText == undefined){
        channelText = '通道';
    }
    if(isReset){
        cms.util.$N(channelName + 'All')[0].checked = false;
        var arrChb = cms.util.$N(channelName);
        for(var i=0; i<arrChb.length; i++){
            arrChb[i].checked = false;
        }
    } else {
        var strHtml = '<div style="clear:both;padding:5px 0 0;">';
        strHtml += '<label class="chb-label-nobg">'
                + '<input type="checkbox" name="' + channelName + 'All" class="chb" onclick="this.checked=true;cms.util.selectCheckBox(\'' + channelName + '\',1);" />'
                + '<span>全选</span>'
                + '</label>';
        for(var i=0; i<devInfo.channelCount; i++){
            var cno = (i + 1);
            var strClick = ' onclick="remoteConfig.setCheckAll(\'' + channelName + '\',\'' + channelName + 'All\');" ';
            
            strHtml += '<label class="chb-label-nobg" style="margin-left:10px;">'
                + '<input type="checkbox" name="' + channelName + '" class="chb" value="' + cno + '" ' + strClick + ' />'
                + '<span>' + channelText + cno + '</span>'
                + '</label>';
        }
        strHtml += '</div>';
        obj.innerHTML = strHtml;
        
        $('.chb-label-nobg .chb').focus(function(){
            $(this).blur();
        });
    }
};

remoteConfig.showCopyToChannel = function(objName, objChannel, channelText, btn, isChecked, isShow){
    var obj = cms.util.$(objName);
    var channelNo = parseInt(cms.util.$(objChannel).value.trim(), 10);
    var arrLang = eval('(' + btn.lang + ')');
    if(channelText == undefined){
        channelText = '模拟通道';
    }
    if(isShow){
        remoteConfig.isCopyToChannel = false;
    }
    if(remoteConfig.isCopyToChannel){
        remoteConfig.isCopyToChannel = false;
        btn.childNodes[0].innerHTML = arrLang[0];
        obj.innerHTML = '';
    } else {
        remoteConfig.isCopyToChannel = true;
        btn.childNodes[0].innerHTML = arrLang[1];

        var strHtml = '<div style="clear:both;padding:5px 0 0;">';
        strHtml += '<label class="chb-label-nobg" style="margin-left:5px;">'
                + '<input type="checkbox" name="chbChannelAll" class="chb" onclick="this.checked=true;cms.util.selectCheckBox(\'chbChannelCopy\',1);" />'
                + '<span>全选</span>'
                + '</label>';
        for(var i=0; i<devInfo.channelCount; i++){
            var cno = (i + 1);
            var strChecked = channelNo == cno || isChecked ? ' checked="checked" ' : '';
            var strDisabled = channelNo == cno ? ' disabled="disabled" ' : '';
            var strClick = ' onclick="remoteConfig.setCheckAll(\'chbChannelCopy\',\'chbChannelAll\');" ';
            
            strHtml += '<label class="chb-label-nobg" style="margin-left:10px;">'
                + '<input type="checkbox" name="chbChannelCopy" class="chb" value="' + cno + '" ' + strChecked + strDisabled + strClick + ' />'
                + '<span>' + channelText + cno + '</span>'
                + '</label>';
        }
        strHtml += '</div>';
        obj.innerHTML = strHtml;
        
        if(isChecked){
            cms.util.selectCheckBox('chbChannelAll', 1);
        }
        
        $('.chb-label-nobg .chb').focus(function(){
            $(this).blur();
        });
    }
};

remoteConfig.showCopyToWeekDay = function(objName, objDay, btn, isChecked, isShow){
    var obj = cms.util.$(objName);
    var day = parseInt(cms.util.$(objDay).value.trim(), 10);
    var arrLang = eval('(' + btn.lang + ')');
    if(isShow){
        remoteConfig.isCopyToWeekDay = false;
    }
    if(remoteConfig.isCopyToWeekDay){
        remoteConfig.isCopyToWeekDay = false;
        btn.childNodes[0].innerHTML = arrLang[0];
        obj.innerHTML = '';
    } else {
        remoteConfig.isCopyToWeekDay = true;
        btn.childNodes[0].innerHTML = arrLang[1];

        var strHtml = '<div style="clear:both;padding:5px 0 0;">';
        strHtml += '<label class="chb-label-nobg" style="margin-left:5px;">'
            + '<input type="checkbox" name="chbWeekDayAll" class="chb" onclick="this.checked=true;cms.util.selectCheckBox(\'chbWeekDayCopy\',1);" />'
            + '<span>全选</span>'
            + '</label>';
        var arrWeekDay = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        
        for(var i=0; i<arrWeekDay.length; i++){
            var num = i;
            var strChecked = day == num || isChecked ? ' checked="checked" ' : '';
            var strDisabled = day == num ? ' disabled="disabled" ' : '';
            var strClick = ' onclick="remoteConfig.setCheckAll(\'chbWeekDayCopy\',\'chbWeekDayAll\');" ';
            
            strHtml += '<label class="chb-label-nobg" style="margin-left:10px;">'
                + '<input type="checkbox" name="chbWeekDayCopy" class="chb" value="' + num + '" ' + strChecked + strDisabled + strClick + ' />'
                + '<span>' + arrWeekDay[i] + '</span>'
                + '</label>';
        }
        strHtml += '</div>';
        obj.innerHTML = strHtml;
        
        if(isChecked){
            cms.util.selectCheckBox('chbWeekDayAll', 1);
        }
        
        $('.chb-label-nobg .chb').focus(function(){
            $(this).blur();
        });
    }
};

remoteConfig.parseWeekDay = function(day){
    var strDay = '';
    switch(parseInt(day, 10)){
        case 1: strDay = '星期一'; break;
        case 2: strDay = '星期二'; break;
        case 3: strDay = '星期三'; break;
        case 4: strDay = '星期四'; break;
        case 5: strDay = '星期五'; break;
        case 6: strDay = '星期六'; break;
        case 0: strDay = '星期日'; break;
    }
    return strDay;
};

remoteConfig.showLoading = function(str, autoClose, timeout){
    if(str == undefined){
        str = '正在加载，请稍候...';
    }
    var strHtml = '<div class="loading-win">'
        + '<div class="loading-left"></div>'
        + '<div class="loading-text"><span class="loading-icon"></span>' + str + '</div>'
        + '<div class="loading-right"></div>'
        + '</div>';
    var config = {
        id: 'pwLoading',
        html: strHtml,
        borderStyle: 'none',
        showClose: false,
        boxBgColor: 'Transparent',
        bgOpacity: 0.3
    };
    if(autoClose != undefined){
        config.autoClose = true;
        config.timeout = timeout || 10000;
    }
    remoteConfig.pwLoading = cms.box.message(config);
};

remoteConfig.hideLoading = function(){
    if(remoteConfig.pwLoading != null){
        remoteConfig.pwLoading.Hide();
    }
};

remoteConfig.getRemoteConfigUrl = cmsPath + '/ajax/remoteConfig.aspx';
remoteConfig.setRemoteConfigUrl = cmsPath + '/ajax/remoteSetting.aspx';

remoteConfig.ajaxRequest = function(config){
    module.ajaxRequest({
        url: config.url || cmsPath + '/ajax/remoteSetting.aspx',
        data: config.data,
        callBack: config.callBack,
        param: config.param
    });
};

remoteConfig.buildXml = function(strNodeList){
    var strXml = '<?xml version="1.0" encoding="utf-8" ?>'
        + '<ZyrhRemoteConfig>'
        + '<Config>'
        + strNodeList
        + '</Config>'
        + '</ZyrhRemoteConfig>';
    return strXml;
};

remoteConfig.buildXmlNode = function(strName, strCon){
    return '<' + strName + '>' + strCon + '</' + strName + '>';
};

//检测文本框数字输入值
/*
param: {
    obj: null,
    objId: '',
    min: 0,
    max: 0,
    val: 0, //默认值
    title: '',
    prompt: ''
}
*/
remoteConfig.checkNumberInput = function(param){
    var obj = param.obj || cms.util.$(param.objId.replace('#', ''));
    var val = obj.value.trim();
    var isPass = true;
    if(isNaN(parseInt(val, 10)) || isNaN(Number(val))){
        isPass = false;
    } else {
        var num = parseInt(val, 10);
        if(num < param.min || num > param.max){
            isPass = false;
        }
    }
    if(!isPass){
        cms.box.msgAndFocus(obj, {
            title: param.title || '提示信息', 
            html: param.prompt + '只能输入' + param.min + ' - ' + param.max + '之间的整数值'
        });
        obj.value = param.val || '';
        return false;
    }
    return true;
};

//检测IP地址输入
remoteConfig.checkIpInput = function(param, isAllowEmpty){
    var obj = param.obj || cms.util.$(param.objId.replace('#', ''));
    var ip = obj.value.trim();
    var isPass = true;
    if('' == ip && isAllowEmpty){
        isPass = true;
    } else if('' == ip){
        isPass = false;
    } else {
        var arr = ip.split('.');
        if(arr.length != 4){
            isPass = false;
        } else {
            for(var i=0; i<4; i++){
                if(isNaN(Number(arr[i])) || isNaN(parseInt(arr[i], 10))){
                    isPass = false;
                    break;
                } else {
                    var num = parseInt(arr[i], 10);
                    if(num < 0 || num > 255){
                        isPass = false;
                        break;
                    }
                }
            }
        }
    }
    if(!isPass){
        cms.box.msgAndFocus(obj, {
            title: param.title || '提示信息', 
            html: param.prompt + '格式输入错误'
        });
        return false;
    }
    return true;
};

/*
    检测回复协议完整性
    完整的协议应该是以 ## 结尾
*/
remoteConfig.checkProtocolIntegrality = function(protocol){
    return protocol != '';
};