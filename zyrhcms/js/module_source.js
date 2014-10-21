var module = module || {};
module.loginTimer = null;
module.loginKeepTime = 0;
//1分钟维护一次登录
module.loginKeepInterval = 60*1000;

module.openWin = function(menuCode, menuName, selected){
    cms.box.openwin({
        id: 'pwMenuCode',
        title: menuName + cms.box.buildIframe(600, 400),
        html: cms.util.path + '/module.aspx?module=' + menuCode + '&menucode=' + menuCode,
        requestType: 'iframe',
        noBottom: true,
        width: 600,
        height: 400,
        filter: false,
        callBack: module.closeWin,
        returnValue: {
            old: selected,
            cur: menuCode
        }
    });
    $('#nav li').removeClass('cur');
    $('#menu_' + menuCode).addClass('cur');
};

module.closeWin = function(pwobj, pwReturn){
    pwobj.Hide();
    $('#menu_' + pwReturn.returnValue.cur).removeClass('cur');
    $('#menu_' + pwReturn.returnValue.old).addClass('cur');
};

module.moduleAction = function(module, param){
    var strParam = '';
    if(param == null || param == undefined || typeof param !== 'object'){
        param = [];
    }
    for(var i=0,c=param.length; i<c; i++){
        strParam += '&' + param[i][0] + '=' + param[i][1];
    }    
    var strForm = '<form id="frmMainNav" method="post" action="">'
        + '<input type="hidden" id="menucode" name="menucode" />'
        + '<input type="hidden" id="module" name="module" />'
        + '<input type="hidden" id="param" name="param" />'
        + '</form>';
    $('#ModuleAction').html(strForm);
    $('#frmMainNav').attr('action', cms.util.path + '/module.aspx');
    $('#menucode').attr('value', module);
    $('#module').attr('value', module);
    $('#param').attr('value', strParam);
    $('#frmMainNav').submit();
};

//检测返回结果中是否包含数据库连接故障的文字
module.dbConnection = function(str){
    return str.indexOf('Unable to connect to') >= 0 || str.indexOf('Access denied for user') >= 0 ? 0 : 1;
};

module.ajaxRequest = function(config){
    var strData = null;
    var _config = {
        type:  config.type || 'post',
        //async: false,
        datatype:  config.datatype || 'json',
        url: config.url,
        data: config.data,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            if('function' == typeof config.callBack){
                config.callBack(data, config.param);
            } else {
                strData = data;
                delete data;
            }
        },
        complete: function(jqXHR, textStatus){
            jqXHR = null;
            if('function' == typeof(CollectGarbage)){
                CollectGarbage();
            }
        }
    };
    if(config.async != undefined){
        _config.async = config.async;
    }
    
    $.ajax(_config);
    
    if(_config.async != undefined && !_config.async){
        return strData;
    }
};


//设置HTML控件可用性
module.setControlDisabled = function(btn, disabled){
    btn.disabled = disabled;
};

//检测HTML控件可用性 并设置其可用性
module.checkControlDisabled = function(btn, disabled){
    if(btn != undefined && btn != null){
        if(btn.disabled){
            return false;
        }
        if(disabled != undefined){
            btn.disabled = disabled;
        } else {
            btn.disabled = true;
        }
    }
    return true;
};

//定时设置HTML控件的可用性
module.setControlDisabledByTiming = function(btn, disabled, timeout){
    if(timeout == undefined || typeof timeout != 'number'){
        timeout = 3000;
    }
    if(btn != undefined && btn != null){
        window.setTimeout(module.setControlDisabled, timeout, btn, disabled);
    }
};

module.buildLabelText = function(val, style){
    style = style || '';
    return '<input type="text" class="txt-label" readonly="readonly" value="' + val + '" style="width:98%;' + style + '" onmouseover="this.title=this.value;" />';
};

/*用户登录状态*/

//检测用户是否是最高管理员
module.checkUserIsFounder = function(){
    return loginUser.userRole == 1 && (loginUser.userId == 1 || loginUser.userName.equals('admin'));
};

//检测用户是否是系统管理员
module.checkUserIsAdmin = function(){
    return loginUser.userRole == 1;
};

//检测用户是否有权限
module.userAuth = function(str){
    return str.indexOf('noauth') == 0 ? 0 : 1;
};

module.noAuth = function(){
    var uinfo = cms.util.getCookie('userInfo');
    
    if(uinfo == ''){
        module.gotoLogin();
    }
    else if(uinfo.isJsonData()){
        try{
            var ui = eval('(' + uinfo + ')');
            var nowTime = parseInt(new Date().getTime()/1000);
            
            //上次登录时间超过3个小时，直接进入登录页面
            if((nowTime - ui.loginTime) / 60 / 60 >= 3){
                module.gotoLogin();
            } else {
                module.showNoAuth();
            }
        }catch(ex){
            module.gotoLogin();
        }
    }
    else {
        module.showNoAuth();
    }
};

module.showNoAuth = function(){
    cms.box.alert({
        id: 'timeout',
        title: '提示信息',
        html: '您还没有登录或登录已超时，确定将返回登录界面。',
        width: 350,
        height: 180,
        iconType: 'warning',
        autoClose: true,
        timeout: 10*1000,
        filter: false,
        callBack: module.gotoLogin
    });
};

module.showOvertime = function(){
    cms.box.alert({
        id: 'timeout',
        title: '提示信息',
        html: '登录已超时，确定将返回登录界面。',
        width: 330,
        height: 180,
        iconType: 'warning',
        autoClose: true,
        timeout: 10*1000,
        filter: false,
        callBack: module.gotoLogin
    });
};

module.checkOvertime = function(str){
    return str.indexOf('noauth') >= 0;
};

module.gotoLogin = function(){
    top.location.href = cms.util.path + '/login.aspx';
};

$(window).load(function(){
    if(top.location == self.location){
        module.loginTimer = window.setInterval(module.userLoginTime, 1000);
        
        try{
            if(loginUser !== undefined && loginUser !== null){
                var userName = loginUser.userName;
                var userPwd = loginUser.userPwd;
                var lineId = loginUser.loginLineId;
                
                window.setTimeout(module.userLoginKeep, module.loginKeepInterval, userName, userPwd, lineId);
            }
        }catch(ex){}
    }
});

module.userLoginTime = function(){
    module.loginKeepTime++;
};

//定时自动登录，用于保持用户登录状态
module.userLoginKeep = function(userName, userPwd, lineId){
    var urlparam = 'action=userLoginKeep&userName=' + escape(userName) + '&userPwd=' + userPwd + '&lineId=' + lineId;
    module.ajaxRequest({
        url: cms.util.path + '/ajax/login.aspx',
        data: urlparam,
        callBack: module.userLoginKeepCallBack,
        param: {
            userName: userName,
            userPwd: userPwd,
            lineId: lineId
        }
    });
};

module.userLoginKeepCallBack = function(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(1 == jsondata.result){
        window.setTimeout(module.userLoginKeep, module.loginKeepInterval, param.userName, param.userPwd, param.lineId);
    }
};

module.getServerTime = function(){
    var strTime = module.ajaxRequest({
        async: false,
        url: cms.util.path + '/ajax/common.aspx',
        data: 'action=getDateTime'
    });
    return strTime;
};

/*功能模块*/
module.getTime = function(){
    return new Date().getTime();
};

module.checkWinSize = function(width, height, borderMargin){
    var size = [parseInt(width, 10), parseInt(height, 10)];
    if(borderMargin == undefined){
        borderMargin = 5;
    }
    var bodySize = cms.util.getBodySize();
    if(size[1] > bodySize.height){
        size[1] = bodySize.height - borderMargin;
    }
    return size;
};

module.showDevDetail = function(devCode, devName, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||560, config.height||360];
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var strHtml = cmsPath + '/modules/device/device.aspx?devCode=' + devCode + '&' + module.getTime();
    var _config = {
        id: 'pwDevDetailBox',
        title: '设备详情 - ' + devName + strFrame,
        html: strHtml,
        requestType: 'iframe',
        width: size[0],
        height: size[1],
        noBottom: true,
        dragMask: false,
        minAble: true,
        maxAble: true,
        showMinMax: true,
        filter: false,
		lock: config.lock || false
    };    
    return cms.box.win(_config);
};

module.showDevPreset = function(devCode, devName, cameraId, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||720, config.height||500];
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var strHtml = cmsPath + '/modules/device/preset.aspx?devCode=' + devCode + '&cameraId=' + cameraId + '&' + module.getTime();;
    var _config = {
        id: 'pwDevPresetBox',
        title: '设备通道预置点 - ' + devName + strFrame,
        html: strHtml,
        requestType: 'iframe',
        width: size[0],
        height: size[1],
        noBottom: true,
        dragMask: false,
		minAble: true,
		maxAble: true,
		showMinMax: true,
        filter: false,
		lock: config.lock || false
    };    
    return cms.box.win(_config);
};

module.showGpsGuide = function(devCode, devName, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||475, config.height||360];
    size = module.checkWinSize(size[0], size[1]);
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var url = cmsPath + '/modules/gpsTrack/guide.aspx?devCode=' + devCode + '&' + module.getTime();
    var _config = {
	    id: 'pwGpsGuideBox',
	    title: 'GPS轨迹记录搜索向导' + (devName != '' ? ' - ' + devName : '') + strFrame,
	    html: url,
	    requestType: 'iframe',
	    width: size[0],
	    height: size[1],
		noBottom: true,
		minAble: true,
		maxAble: true,
		showMinMax: true,
		filter: false,
		lock: config.lock || false
	};
	if(config.callBack != undefined){
	    _config.callBack = config.callBack;
	}	
	return cms.box.win(_config);
};

module.showCaptureGuide = function(devCode, devName, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||475, config.height||360];
    size = module.checkWinSize(size[0], size[1]);
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var url = cmsPath + '/modules/capture/guide.aspx?devCode=' + devCode + '&' + module.getTime();
    var _config = {
	    id: 'pwCaptureGuideBox',
	    title: '抓拍图记录搜索向导' + (devName != '' ? ' - ' + devName : '') + strFrame,
	    html: url,
	    requestType: 'iframe',
	    width: size[0],
	    height: size[1],
		noBottom: true,
		minAble: true,
		maxAble: true,
		showMinMax: true,
		filter: false,
		lock: config.lock || false
	};
	if(config.callBack != undefined){
	    _config.callBack = config.callBack;
	}	
	return cms.box.win(_config);

};

module.showPreview = function(devCode, devName, channelNo, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||800, config.height||520];
    size = module.checkWinSize(size[0], size[1]);
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var url = cmsPath + '/preview.aspx?devCode=' + devCode + '&channelNo=' + channelNo + '&autoPlay=1&' + module.getTime();
	var _config = {
	    id: 'pwPreviewBox',
	    title: '视频预览 - ' + devName + strFrame,
	    html: url,
	    requestType: 'iframe',
	    width: size[0],
	    height: size[1],
		noBottom: true,
		minAble: true,
		maxAble: true,
		showMinMax: true,
        filter: false,
		lock: config.lock || false
	};
	if(config.callBack != undefined){
	    _config.callBack = config.callBack;
	}	
	return cms.box.win(_config);
};

module.showPlayBack = function(devCode, devName, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||900, config.height||520];
    size = module.checkWinSize(size[0], size[1]);
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var url = cmsPath + '/playback.aspx?devCode=' + devCode + '&' + module.getTime();
	var _config = {
	    id: 'pwPlayBackBox',
	    title: '录像回放 - ' + devName + strFrame,
	    html: url,
	    requestType: 'iframe',
	    width: size[0],
	    height: size[1],
		noBottom: true,
		minAble: true,
		maxAble: true,
		showMinMax: true,
        filter: false,
		lock: config.lock || false
	};
	if(config.callBack != undefined){
	    _config.callBack = config.callBack;
	}	
	return cms.box.win(_config);
};

module.showGpsTrack = function(devCode, devName, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||900, config.height||520];
    size = module.checkWinSize(size[0], size[1]);
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var url = cmsPath + '/gpsTrack.aspx?devCode=' + devCode + '&' + module.getTime();
	var _config = {
	    id: 'pwGpsTrackBox',
	    title: 'GPS轨迹回放 - ' + devName + strFrame,
	    html: url,
	    requestType: 'iframe',
	    width: size[0],
	    height: size[1],
		noBottom: true,
		minAble: true,
		maxAble: true,
		showMinMax: true,
		filter: false,
		lock: config.lock || false
	};
	if(config.callBack != undefined){
	    _config.callBack = config.callBack;
	}	
	return cms.box.win(_config);
};

module.showGprsConfig = function(devCode, devName, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||800, config.height||520];
    size = module.checkWinSize(size[0], size[1]);
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var url = cmsPath + '/gprsConfig.aspx?devCode=' + devCode + '&' + module.getTime();
	var _config = {
	    id: 'pwGprsConfig',
	    title: 'GPRS配置 - ' + devName + strFrame,
	    html: url,
	    requestType: 'iframe',
	    width: size[0],
	    height: size[1],
		noBottom: true,
		minAble: true,
		maxAble: true,
		showMinMax: true,
		filter: false,
		topMost: false,
		lock: config.lock || false,
		callBack: config.callBack || module.gprsConfigCallBack
	};
	return cms.box.win(_config);
};

module.gprsConfigCallBack = function(pwobj, pwReturn){
    var size = [210, 135];
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    cms.box.confirm({
        id: 'pwGprsConfigConfirm',
        title: '关闭GPRS设置' + strFrame,
        html: '确定要关闭GPRS设置吗？',
	    width: size[0],
	    height: size[1],
        zindex: (pwobj.config.zindex + 5),
		filter: false,
        callBack: module.hideGprsConfig,
        returnValue: {
            win: pwobj
        }
    });
};

module.hideGprsConfig = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var func = $('#pwIFrame' + 'pwGprsConfig')[0].contentWindow.gprsConfig.close;
        if(func != null && func != undefined){
            func();
        }
        pwReturn.returnValue.win.Hide();
        pwobj.Hide();
    }
};

module.showRemoteConfig = function(devCode, devName, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||800, config.height||520];
    size = module.checkWinSize(size[0], size[1]);
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var url = cmsPath + '/remoteConfig.aspx?devCode=' + devCode + '&' + module.getTime();
	var _config = {
	    id: 'pwRemoteConfig',
	    title: '远程配置 - ' + devName + strFrame,
	    html: url,
	    requestType: 'iframe',
	    width: size[0],
	    height: size[1],
		noBottom: true,
		minAble: true,
		maxAble: true,
		showMinMax: true,
		filter: false,
		topMost: false,
		lock: config.lock || false,
		callBack: config.callBack || module.remoteConfigCallBack
	};
	return cms.box.win(_config);
};

module.remoteConfigCallBack = function(pwobj, pwReturn){
    var size = [210, 135];
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    cms.box.confirm({
        id: 'pwRemoteConfigConfirm',
        title: '关闭远程配置' + strFrame,
        html: '确定要关闭远程配置吗？',
	    width: size[0],
	    height: size[1],
        zindex: (pwobj.config.zindex + 5),
		filter: false,
        callBack: module.hideRemoteConfig,
        returnValue: {
            win: pwobj
        }
    });
};

module.hideRemoteConfig = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var func = $('#pwIFrame' + 'pwRemoteConfig')[0].contentWindow.remoteConfig.close;
        if(func != null && func != undefined){
            func();
        }
        pwReturn.returnValue.win.Hide();
        pwobj.Hide();
    }
};

//检测是否是调试模式(显示调试界面)
module.checkIsDebug = function(){
    try{
        return loginUser.userName.equals('admin') || loginUser.userName.equals('zyrh') || loginUser.userId == 1;
    } catch(ex){
        return false;
    }
};

/*OCX控件功能调试*/
module.pwOcxDebugBox = null;
module.pwOcxDebugBoxConfig = null;
module.isOcxDebug = module.checkIsDebug();
module.txtOcxDebugMessageBox = null;
module.isOcxDebugInfoAppend = true;
 
module.getOcxDebugTime = function(){
    return '[' + new Date().toString('yyyy-MM-dd HH:mm:ss fff') + '] ';
};

module.showOcxDebugBox = function(config){
    if(module.isOcxDebug){
        var bodySize = cms.util.getBodySize();
        if(config != null && config != undefined){
            module.pwOcxDebugBoxConfig = config;
        }
        var _config = {};
        if(module.pwOcxDebugBoxConfig != null){
            _config = module.pwOcxDebugBoxConfig;
        }
        var size = {w:_config.width || 500, h:_config.height || 300};
        var strHtml = ''
            + '<textarea id="txtOcxDebugMessage_Debug" class="txt" readonly="readonly" style="width:' + (size.w - 6) + 'px;height:' + (size.h - 25 - 26) + 'px;'
            + 'padding:0 3px;position:absolute;top:25px;left:0;margin:0;border:none;"></textarea>'
            + '<div class="statusbar" style="position:absolute;bottom:0;left:0;height:24px;">'
            + '<a class="btn btnc22" onclick="module.clearOcxDebugInfo();" style="float:right;margin-right:3px;"><span>Clear</span></a>'
            + '<span id="lblWinNum_Debug" style="padding:0 3px;"></span>'
            + '<span id="lblPlayWinNum_Debug" style="padding:0 3px;"></span>'
            + '<span id="lblStopWinNum_Debug" style="padding:0 3px;"></span>'
            + '</div>';
        
        var bodySize = cms.util.getBodySize();
        var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height, true);
        var newConfig = {
            id: 'pwOcxDebug',
            title: (_config.title || 'OCX控件日志') + strFrame,
            html: strHtml,
            noBottom: true,
            width: size.w,
            height: size.h,
            minAble: true,
            maxAble: true,
            showMinMax: true,
            minWidth: size.w,
            minHeight: _config.minHeight || 128,
            lock: false,
            position: _config.position || 8,
            x: _config.x || 0,
            y: _config.y || 0,
            closeType: 'hide',
            build: 'show',
            reload: false,
            callBackByResize: module.showOcxDebugCallBackByResize
        };
        module.pwOcxDebugBox = null;
        module.pwOcxDebugBox = cms.box.win(newConfig);
        
        module.txtOcxDebugMessageBox = cms.util.$('txtOcxDebugMessage_Debug');
        
        return module.pwOcxDebugBox;
    }
};

module.showOcxDebugCallBackByResize = function(winModel, bodySize){
    module.txtOcxDebugMessageBox.style.width  = (bodySize.w - 6) + 'px';
    module.txtOcxDebugMessageBox.style.height = (bodySize.h - 26) + 'px';
};

module.hideOcxDebugBox = function(){
    if(module.pwOcxDebugBox != null){
        module.pwOcxDebugBox.Hide();
    }
};

module.appendOcxDebugInfo = function(str){
    if(module.isOcxDebug && module.txtOcxDebugMessageBox != null){
        module.txtOcxDebugMessageBox.value += str + '\r\n';
        module.txtOcxDebugMessageBox.scrollTop = module.txtOcxDebugMessageBox.scrollHeight;
    }
};

module.clearOcxDebugInfo = function(){
    if(module.isOcxDebug && module.txtOcxDebugMessageBox != null){
        module.txtOcxDebugMessageBox.value = '';
    }
};

module.showSelectedWindow = function(winNum){
    if(module.isOcxDebug && module.txtOcxDebugMessageBox != null){
        $('#lblWinNum_Debug').html('当前窗口:' + (winNum + 1));
    }
};

/*调试数据*/
module.pwDebugBox = null;
module.pwDebugBoxConfig = null;
module.isDebug = module.checkIsDebug();
module.txtDebugMessageBox = null;
module.isDebugInfoAppend = false;

module.showRunTime = function(obj, times){
    var strHtml = '开始加载：' + times[0].toString('yyyy-MM-dd HH:mm:ss fff') + ' 开始显示：' + times[1].toString('yyyy-MM-dd HH:mm:ss fff') 
        + '<br />显示完毕：' + times[2].toString('yyyy-MM-dd HH:mm:ss fff')
        + ' 加载耗时：' + cms.util.timeDifference(times[1], times[0]) + 'ms 显示耗时：' + cms.util.timeDifference(times[2], times[1]) + 'ms';
    obj.attr('value', strHtml);
};
 
module.getDebugTime = function(){
    return '[' + new Date().toString('yyyy-MM-dd HH:mm:ss fff') + '] ';
};

module.showDebugBox = function(data, config){
    if(config != null && config != undefined){
        module.pwDebugBoxConfig = config;
    }
    var _config = {};
    if(module.pwDebugBoxConfig != null){
        _config = module.pwDebugBoxConfig;
    }
    var strData = data != null && data != undefined ? data : '';
    var size = [_config.width||500, _config.height|| 320];
    var txtH = size[1] - 25 - 25;
    
    var strStype = ' style="width:' + (size[0]-10) + 'px;height:' + txtH + 'px;border:none;margin:0;padding:0 5px;font-size:12px;line-height:20px;font-family:宋体,Arial;'
        + 'position:absolute;top:25px;left:0;" ';
    var strHtml = '<textarea id="txtDebugInfo_PopWin" ' + strStype + ' readonly="readonly">' + strData + '</textarea>'
            + '<div class="statusbar" style="position:absolute;bottom:0;left:0;height:24px;">'
            + '<a class="btn btnc22" onclick="module.clearDebugInfo();" style="float:right;margin-right:3px;"><span>Clear</span></a>'
            + '</div>';
    
    var newConfig = {
        id: 'pwDebugInfo',
        title: _config.title || '调试数据',
        html: strHtml,
        width: size[0],
        height: size[1],
        minWidth: 300,
        minHeight: 150,
        noBottom: true,
        minAble: true,
        maxAble: true,
        showMinMax: true,
        filter: false,
        lock: false,
        position: _config.position || 8,
        x: _config.x || 0,
        y: _config.y || 0,
        closeType: 'hide',
        build: 'show',
        reload: false,
        callBackByResize: module.showDebugCallBackByResize
    };
    module.pwDebugBox = null;
    module.pwDebugBox = cms.box.win(newConfig);
    
    module.txtDebugMessageBox = cms.util.$('txtDebugInfo_PopWin');
    
    return module.pwDebugBox;
};

module.showDebugCallBackByResize = function(winModel, bodySize){
    module.txtDebugMessageBox.style.width  = (bodySize.w - 10) + 'px';
    module.txtDebugMessageBox.style.height = (bodySize.h - 25) + 'px';
};

module.hideDebugBox = function(){
    if(module.pwDebugBox != null){
        module.pwDebugBox.Hide();
    }
};

module.appendDebugInfo = function(str){
    if(module.isDebug && module.txtDebugMessageBox != null){
        module.txtDebugMessageBox.value += str + '\r\n';
        module.txtDebugMessageBox.scrollTop = module.txtDebugMessageBox.scrollHeight;
    }
};

module.clearDebugInfo = function(){
    if(module.isDebug && module.txtDebugMessageBox != null){
        module.txtDebugMessageBox.value = '';
    }
};

/*错误信息*/
module.showAjaxErrorData = function(jqXHR, textStatus, errorThrown, config){
    if(config == undefined){
        config = {};
    }
    if(0 == jqXHR.status){
        return false;
    }
    if(12031 == jqXHR.status || jqXHR.status > 12000){
        //jquery ajax 中出现的12031错误状态码的原因没有查到，如果有出现，暂时先屏幕
        return false;
    }
    var size = [config.width||300, config.height||180];
    
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var strError = '应用程序错误，错误信息如下：<br />'
        + 'status: ' + jqXHR.status + '<br />'
        + 'errorThrown: ' + errorThrown + '<br />'
        + 'textStatus: ' + textStatus + '<br />'
        + '<a onclick="module.showErrorDetail(document.getElementById(\'pwAjaxErrorDataResult\').value);">查看错误代码</a>'
        + '<textarea style="display:none;" id="pwAjaxErrorDataResult">' + jqXHR.responseText + '</textarea>';
    var _config = {
        id: config.id || 'pwAjaxErrorDataBox',
        title: (config.title || '错误信息') + strFrame,
        html: strError,
        width: size[0],
        height: size[1],
        iconType: 'error',
        filter:false
    };
    cms.box.alert(_config);
};

module.showJsonErrorData = function(data, config){
    if(config == undefined){
        config = {};
    }
    
    var size = [config.width||280, config.height||150];
    var strError = 'JSON数据格式错误，请检查程序代码。<br />'
        + '<a onclick="module.showErrorDetail(document.getElementById(\'pwJsonErrorDataResult\').value);">查看错误代码</a>'
        + '<textarea style="display:none;" id="pwJsonErrorDataResult">' + data.replaceAll('<br />', '\r\n') + '</textarea>';
    
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var _config = {
        id: config.id || 'pwJsonErrorDataBox',
        title: (config.title || '错误信息') + strFrame,
        html: strError,
        width: size[0],
        height: size[1],
        filter:false
    };
    cms.box.alert(_config);
};

module.showErrorInfo = function(msg, error, config){
    if(error != null && error != undefined && 'noauth'.equals(error.toLowerCase())){
        module.showNoAuth();
        return false;
    }
    if(config == undefined){
        config = {};
    }
    var size = [];
    var strTitle = '提示信息';
    var strMsg = msg;
    if(error != null && error != undefined && error != ''){
        size = [config.width||280, config.height||150];
        strTitle = '错误信息';
        strMsg += '<br /><a onclick="module.showErrorDetail(document.getElementById(\'pwErrorInfoResult\').value);">查看错误代码</a>'
        + '<textarea style="display:none;" id="pwErrorInfoResult">' + error.replaceAll('<br />', '\r\n') + '</textarea>';
    } else {        
        size = [config.width||'auto', config.height||'auto'];
    }
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var _config = {
        id: config.id || 'pwErrorInfoBox',
        title: (config.title || strTitle) + strFrame,
        html: strMsg,
        width: size[0],
        height: size[1],
        filter: false
    };
    cms.box.alert(_config);
};

module.showErrorDetail = function(str){
    var size = [420, 240];
    var strStype = ' style="width:' + (size[0] - 10) + 'px;height:' + (size[1] - 25) + 'px;border:none;margin:0;padding:0 5px;font-size:12px;line-height:18px;font-family:宋体,Arial;" ';
    var strHtml = '<textarea id="txtErrorDetail_PopWin" ' + strStype + ' readonly="readonly">' + str + '</textarea>';
    
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    cms.box.win({
        id: 'pwErrorDetail',
        title: '错误信息详情' + strFrame,
        html: strHtml,
        width: size[0],
        height: size[1],
        noBottom: true,
        maxAble: true,
        showMinMax: true,
        filter: false,
        callBackByResize: module.showErrorDetailCallBackByResize
    });
};

module.showErrorDetailCallBackByResize = function(winModel, bodySize){
    $('#txtErrorDetail_PopWin').width(bodySize.w - 10);
    $('#txtErrorDetail_PopWin').height(bodySize.h);
};

module.showOcxError = function(e, msg, config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||'auto', config.height||'auto'];
    var strMsg = msg + '<br />错误详情：' + e;
    var strTitle = 'OCX错误信息';
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var _config = {
        id: config.id || 'pwOcxErrorBox',
        title: (config.title || strTitle) + strFrame,
        html: strMsg,
        width: size[0],
        height: size[1],
        filter: false
    };
    cms.box.alert(_config);
};

/*帮助信息*/

module.showHelpInfo = function(config, action){
    if(action == 'close' || action == 'hide'){
        popwin.Hide('pwHelpInfo');
        return false;
    } 
    if(config == undefined){
        config = {};
    }
    var size = [config.width||420, config.height||240];
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
	var _config = {
	    id: 'pwHelpInfo',
	    title: (config.title || '帮助信息') + strFrame,
	    html: config.html,
	    width: size[0],
	    height: size[1],
		noBottom: true,
		filter: false
	};
	return cms.box.win(_config);
};

module.showVersionInfo = function(config){
    if(config == undefined){
        config = {};
    }
    var size = [config.width||420, config.height||280];
    var bodySize = cms.util.getBodySize();
    var strFrame = cms.box.buildIframe(bodySize.width, bodySize.height);
    var url = cmsPath + '/common/aspx/version.aspx?' + module.getTime();
	var _config = {
	    id: 'pwCmsVersion',
	    title: '版本信息' + strFrame,
	    html: url,
	    requestType: 'iframe',
	    width: size[0],
	    height: size[1],
		//noBottom: true,
		filter: false
	};
	return cms.box.win(_config);
};

/**/
/*
window.onerror = function(e){
    alert('错误信息：' + e);
};
*/