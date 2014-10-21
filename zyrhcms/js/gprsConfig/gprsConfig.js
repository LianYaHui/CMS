var gprsConfig = gprsConfig || {};

gprsConfig.isCopyToChannel = false;
gprsConfig.isCopyToWeekDay = false;

gprsConfig.isDebug = module.checkIsDebug();
//OCX控件
gprsConfig.ocx = null;
//加载提示
gprsConfig.pwLoading = null;
//是否延时加载
gprsConfig.isDelayedLoad = true;

//是否自动读取设备上的信息
gprsConfig.isAutoRead = false;

//定时，单位：毫秒
gprsConfig.timeout = 3000;

gprsConfig.curSelect;
gprsConfig.curMenu = '';
gprsConfig.curPageUrl = '';
gprsConfig.funcName = 'gprsConfig.treeAction';
gprsConfig.cmsPath = cmsPath + '/modules/gprsConfig/sub';

gprsConfig.arrFunction = [
    {id: 100, name: '读取设备信息', callBack:{func: gprsConfig.funcName, action: 'info', url: gprsConfig.cmsPath + '/devInfo.aspx'}},
    {id: 101, name: '读取设备版本', callBack:{func: gprsConfig.funcName, action: 'version', url: gprsConfig.cmsPath + '/devVersion.aspx'}},
    {id: 110, name: '设置巡检模式', callBack:{func: gprsConfig.funcName, action: 'patrol_mode', url: gprsConfig.cmsPath + '/patrolMode.aspx'}},
    {id: 111, name: '定时图片抓拍', callBack:{func: gprsConfig.funcName, action: 'timing_capture', url: gprsConfig.cmsPath + '/setTimingCapture.aspx'}},
    {id: 112, name: '定时视频监控', callBack:{func: gprsConfig.funcName, action: 'timing_monitor', url: gprsConfig.cmsPath + '/setTimingMonitor.aspx'}},
    {id: 119, name: '定时图片抓拍(定制)', callBack:{func: gprsConfig.funcName, action: 'timing_capture_dz', url: gprsConfig.cmsPath + '/setTimingCapture.aspx?action=dz'}},
    {id: 120, name: 'TTS播放文字', callBack:{func: gprsConfig.funcName, action: 'tts', url: gprsConfig.cmsPath + '/setTts.aspx'}},
    {id: 121, name: '音频文件播报', callBack:{func: gprsConfig.funcName, action: 'audio', url: gprsConfig.cmsPath + '/audioPlay.aspx'}},
    {id: 122, name: 'FM微波播报', callBack:{func: gprsConfig.funcName, action: 'fm', url: gprsConfig.cmsPath + '/fmPlay.aspx'}},
    {id: 123, name: '实时播报监听', callBack:{func: gprsConfig.funcName, action: 'play_monitor', url: gprsConfig.cmsPath + '/playMonitor.aspx'}},
    {id: 124, name: '输出音量调节', callBack:{func: gprsConfig.funcName, action: 'volume', url: gprsConfig.cmsPath + '/setVolume.aspx'}},
    {id: 125, name: '语音播报监测', callBack:{func: gprsConfig.funcName, action: 'audio_monitor', url: gprsConfig.cmsPath + '/audioMonitor.aspx'}},
    {id: 130, name: 'RS485', callBack:{func: gprsConfig.funcName, action: 'rs485', url: gprsConfig.cmsPath + '/rs485.aspx'}},
    {id: 131, name: 'RS232', callBack:{func: gprsConfig.funcName, action: 'rs232', url: gprsConfig.cmsPath + '/rs232.aspx'}},
    {id: 140, name: '防盗报警设置', callBack:{func: gprsConfig.funcName, action: 'security', url: gprsConfig.cmsPath + '/security.aspx'}},
    {id: 150, name: '设置保存间隔', callBack:{func: gprsConfig.funcName, action: 'interval', url: gprsConfig.cmsPath + '/setSaveInterval.aspx'}},
    {id: 151, name: '设置保存条数', callBack:{func: gprsConfig.funcName, action: 'quantity', url: gprsConfig.cmsPath + '/setSaveQuantity.aspx'}},
    {id: 152, name: '读取设备巡检点', callBack:{func: gprsConfig.funcName, action: 'read_patrol_point', url: gprsConfig.cmsPath + '/readPatrolPoint.aspx'}},
    {id: 153, name: '删除全部巡检点', callBack:{func: gprsConfig.funcName, action: 'delete_patrol_point', url: gprsConfig.cmsPath + '/deletePatrolPoint.aspx'}},
    {id: 154, name: '设置设备巡检点', callBack:{func: gprsConfig.funcName, action: 'set_patrol_point', url: gprsConfig.cmsPath + '/setPatrolPoint.aspx'}},
    {id: 155, name: '设置巡检任务计划', callBack:{func: gprsConfig.funcName, action: 'set_patrol_task', url: gprsConfig.cmsPath + '/setPatrolTask.aspx'}},
    {id: 156, name: '设置巡检边界', callBack:{func: gprsConfig.funcName, action: 'set_patrol_boundary', url: gprsConfig.cmsPath + '/setPatrolBoundary.aspx'}},
    
    {id: 161, name: '设置开/关屏时间',callBack:{func: gprsConfig.funcName, action: 'set_led_time', url: gprsConfig.cmsPath + '/setLedScreenTime.aspx'}},
    {id: 162, name: '设置开/关屏',callBack:{func: gprsConfig.funcName, action: 'set_led_open', url: gprsConfig.cmsPath + '/setLedScreenOpen.aspx'}},
    {id: 163, name: '设置屏大小',callBack:{func: gprsConfig.funcName, action: 'set_led_size', url: gprsConfig.cmsPath + '/setLedScreenSize.aspx'}},
    {id: 164, name: '设置音量大小',callBack:{func: gprsConfig.funcName, action: 'set_led_volume', url: gprsConfig.cmsPath + '/setLedScreenVolume.aspx'}},
    {id: 165, name: '删除区域数据(未完成)',callBack:{func: gprsConfig.funcName, action: 'delete_led_data', url: gprsConfig.cmsPath + '/setLedScreenData.aspx'}},
    
    {id: 200, name: '读取设备版本', callBack:{func: gprsConfig.funcName, action: 'read_device_gps', url: gprsConfig.cmsPath + '/readDevVersion_GPS.aspx'}},
    {id: 201, name: '设置ACC发送间隔', callBack:{func: gprsConfig.funcName, action: 'set_acc_interval', url: gprsConfig.cmsPath + '/setAccInterval.aspx'}},
    {id: 202, name: '取消所有报警消息', callBack:{func: gprsConfig.funcName, action: 'cancel_all_alarm', url: gprsConfig.cmsPath + '/cancelAllAlarm.aspx'}},
    {id: 203, name: '里程设置', callBack:{func: gprsConfig.funcName, action: 'mileage_initial', url: gprsConfig.cmsPath + '/mileageInitial.aspx'}},
    
    {id: 300, name: '设置预置点名称', callBack:{func: gprsConfig.funcName, action: 'set_preset_name', url: gprsConfig.cmsPath + '/setPresetName.aspx'}},
    
    {id: 990, name: '设备电压校准', callBack:{func: gprsConfig.funcName, action: 'voltage_calibrate', url: gprsConfig.cmsPath + '/voltageCalibrate.aspx'}},
    {id: 991, name: '读取设备时钟', callBack:{func: gprsConfig.funcName, action: 'clock', url: gprsConfig.cmsPath + '/devClock.aspx'}},
    {id: 992, name: '设备主机复位', callBack:{func: gprsConfig.funcName, action: 'scm_reset', url: gprsConfig.cmsPath + '/scmReset.aspx'}},
    {id: 993, name: '单独重启云台', callBack:{func: gprsConfig.funcName, action: 'ptz_restart', url: gprsConfig.cmsPath + '/ptzRestart.aspx'}},
    {id: 994, name: '设置管理员号码', callBack:{func: gprsConfig.funcName, action: 'manager_phone', url: gprsConfig.cmsPath + '/managerPhone.aspx'}},
    {id: 995, name: '恢复初始化', callBack:{func: gprsConfig.funcName, action: 'scm_initial', url: gprsConfig.cmsPath + '/scmInitial.aspx'}},
    
    {id: 999, name: '设备远程升级', callBack:{func: gprsConfig.funcName, action: 'remote_update', url: cmsPath + '/modules/gprsConfig/sub/remoteUpdate.aspx'}}
];

gprsConfig.arrDevTypeFunction = [
    {type: 50101, func:[100,200,201,202,203]},
    {type: 50102, func:[]},
    {type: 50105, func:[100,101,110,111,119,140,300,990,991,992,993,994,995]},
    {type: 50106, func:[100,101,120,124,140,990,991,994,999]},
    {type: 50107, func:[100,101,110,112,140,990,991,992,993,994,995,999]},
    //{type: 50116, func:[100,101,120,131,140,160,161,162,163,164,994,999]},
    {type: 50116, func:[100,101,161,162,163,164,165,999]},
    {type: 50117, func:[100,101,120,121,122,123,124,125,130,131,140,990,994,999]},
    {type: 50780, func:[100,101,150,151,152,153,154,155,156,999]},
    {type: 50790, func:[100,101,150,151]},
    {type: 50813, func:[100,101,110,111,112,119,990,992,994,999]}
];

gprsConfig.arrTreeData = {
	module:[
		{id: 0, pid: -1, name: ''},
		{id: 10, pid: 0, name: '设备基本信息', func: [100,101, 200]},
		{id: 11, pid: 0, name: '视频相关配置', func: [110,111,112,119,300]},
		{id: 12, pid: 0, name: '广播参数设置', func: [120,121,122,123,124,125]},
		{id: 13, pid: 0, name: '数据透传设置', func: [130,131]},
		{id: 14, pid: 0, name: '防盗报警配置', func: [140]},
		{id: 15, pid: 0, name: '巡检配置', func: [150,151,152,153,154,155,156]},
		{id: 16, pid: 0, name: 'LED屏设置', func: [160,161,162,163,164,165]},
		{id: 20, pid: 0, name: '车载GPS设置', func: [201,202,203]},
		{id: 99, pid: 0, name: '高级设置', func: [990,991,992,993,994,995,999]}
	]
};

gprsConfig.getTreeMenu = function(typeCode, moduleFunc){
    var arrMenu = [];
    var arrTypeMenu = [];
    for(var i=0,c=gprsConfig.arrDevTypeFunction.length; i<c; i++){
        if(gprsConfig.arrDevTypeFunction[i].type == typeCode){
            arrTypeMenu = gprsConfig.arrDevTypeFunction[i].func;
            break;
        }
    }
    for(var j=0,cc=arrTypeMenu.length; j<cc; j++){
        var id = gprsConfig.filterMenu(moduleFunc, arrTypeMenu[j]);
        if(id != null){
            var menu = gprsConfig.searchTreeMenu(id);
            if(menu != null){
                arrMenu.push(menu);
            }
        }
    }
    return arrMenu;
};

gprsConfig.filterMenu = function(arr, id){
    if(arr == null || arr == undefined){
        return null;
    }
    var found = false;
    var high = arr.length;
    var low = 0;
    var mid = parseInt((high + low) / 2, 10);
    while (!found && high >= low)
    {
        if (id == arr[mid])
            found = true;
        else if (id < arr[mid])
            high = mid - 1;
        else
            low = mid + 1;

        mid = parseInt((high + low) / 2, 10);
    }
    return found ? arr[mid] : null;
};

gprsConfig.searchTreeMenu = function(id){
    var found = false;
    var high = gprsConfig.arrFunction.length;
    var low = 0;
    var mid = parseInt((high + low) / 2, 10);
    while ((!found) && (high >= low))
    {
        if (id == gprsConfig.arrFunction[mid].id)
            found = true;
        else if (id < gprsConfig.arrFunction[mid].id)
            high = mid - 1;
        else
            low = mid + 1;

        mid = parseInt((high + low) / 2, 10);
    }
    return((found) ? gprsConfig.arrFunction[mid]: null);
};


$(window).load(function(){
    if(!isBatch){
	    gprsConfig.frame.initialForm();
	    gprsConfig.loadTreeMenu();
    	
        module.showDebugBox(null, {position:7,x:0,y:1});
        module.hideDebugBox();
        
	    gprsConfig.initialForm();
	    gprsConfig.task.initial();
	    gprsConfig.frame.setBodySize();

	    window.setTimeout(gprsConfig.loadDefaultPage, 500);
    	
	    //设置快捷键
	    gprsConfig.frame.setFrameByShortcutKey();
	}
});

$(window).resize(function(){
    if(!isBatch){
	    gprsConfig.frame.setBodySize();
	}
});

$(window).unload(function(){
    if(gprsConfig.task.timer != undefined && gprsConfig.task.timer != null){
        clearTimeout(gprsConfig.task.timer);
    }
});

gprsConfig.initialForm = function(){
    if(gprsConfig.isDebug){
        $('#bodyRight .titlebar').append('<a name="windebug" class="ibtn nobg" id="btnDebug" onclick="module.showDebugBox();" style="float:right;margin-right:2px;"><i class="icon-debug"></i></a>');
    }
    $('#bodyRight .titlebar').append('<span id="lblDevInfo_GprsConfig" style="float:right;margin-right:10px;">[' + devInfo.devCode + ']' + '&nbsp;' + devInfo.devName + '</span>');
    $('#bodyLeft .titlebar').append('<a class="ibtn nobg" title="刷新" onclick="gprsConfig.reload();" style="float:right;margin-right:1px;"><i class="icon-update"></i></a>');
};

gprsConfig.loadTreeMenu = function(){
	gprsConfig.tree.buildMenuTree(gprsConfig.arrTreeData, [1, 2], gprsConfig.arrTreeData.module.length);
};

gprsConfig.loadDefaultPage = function(){    
	gprsConfig.treeAction({type: 'menu', action:'info', name: '设备信息', url: cmsPath + '/modules/gprsConfig/sub/devInfo.aspx'});	//加载默认页面
};

gprsConfig.treeAction = function(param){
	if(gprsConfig.curSelect == param.action){
		return false;	//不重复加载
	}
	var strUrl = '';
	if(param.type == 'menu'){
		//改变框架中标题栏的名称
		gprsConfig.frame.setFormTitle(param.name);
	    gprsConfig.frame.setFormPrompt('');
		strUrl = param.url;
	}
	if(strUrl == ''){
	    strUrl = 'sub/blank.aspx';
	}
	//gprsConfig.setFormButton(null);
	if(0 == gprsConfig.frame.taskBoxWinMode){
	    gprsConfig.frame.setTaskBoxSize(1, null);
	}
	
	strUrl += (strUrl.indexOf('?') >=0 ? '&' : '?') + 'devCode=' + devInfo.devCode + '&' + new Date().getTime();
	gprsConfig.curPageUrl = strUrl;
	
	gprsConfig.loadPage(strUrl);
	gprsConfig.curSelect = param.action;
};

gprsConfig.loadPage = function(strUrl){
	$(".gprsConfigForm").empty();
	$(".gprsConfigForm").html('正在加载，请稍候...');
	$(".gprsConfigForm").load(strUrl);
	
    gprsConfig.isCopyToChannel = false;
    gprsConfig.isCopyToWeekDay = false;
};

/*
    更新设备配置信息
    将设置的或从设备中读取的设备配置保存到数据库中
*/
gprsConfig.updateDeviceConfig = function(strDevCode, strField, strValue){
    var config = {
        data: 'action=updateDeviceConfig&devCode=' + strDevCode + '&field=' + strField + '&value=' + escape(strValue),
        callBack: gprsConfig.updateDeviceConfigCallBack
    };
    gprsConfig.ajaxRequest(config);
};

gprsConfig.updateDeviceConfigCallBack = function(data, param){
    //暂时不处理设备配置更新
    
};

gprsConfig.close = function(){
    
};

gprsConfig.reload = function(){
    location.reload();
};

gprsConfig.showLoading = function(str, autoClose, timeout){
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
    gprsConfig.pwLoading = cms.box.message(config);
};

gprsConfig.hideLoading = function(){
    if(gprsConfig.pwLoading != null){
        gprsConfig.pwLoading.Hide();
    }
};

gprsConfig.ajaxRequest = function(config){
    module.ajaxRequest({
        url: config.url || cmsPath + '/ajax/gprsSetting.aspx',
        data: config.data,
        callBack: config.callBack,
        param: config.param
    });
};

//设置HTML控件可用性
gprsConfig.setControlDisabled = function(btn, disabled){
    btn.disabled = disabled;
    var css = btn.className;
    if(btn.disabled){
        btn.className = css + ' disabled';
    } else {
        btn.className = css.replace(' disabled', '');
    }
};

//检测HTML控件可用性 并设置其可用性
gprsConfig.checkControlDisabled = function(btn, disabled){
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

//定时设置HTML控件的可用性
gprsConfig.setControlDisabledByTiming = function(btn, disabled, timeout){
    if(timeout == undefined || typeof timeout != 'number'){
        timeout = gprsConfig.timeout;
    }
    if(btn != undefined && btn != null){
        window.setTimeout(gprsConfig.setControlDisabled, timeout, btn, disabled);
    }
};

//快捷键
gprsConfig.shortcutKeyAction = function(keyCode){
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

/*
    计算时间间隔
    num: 开始时间(格式:1130)
    num1: 结束时间(格式:1029)
    return: 间隔秒数 101 => 61*60 = 3660;
*/
gprsConfig.calculationTimeInterval = function(num, num1){
    var ts = Math.abs(parseInt(num, 10) - parseInt(num1, 10));
    var h = parseInt(ts/100, 10);
    var m = ts % 100;
    if(m > 60 && m < 100){
        m -= 40;
    }
    return (h*60 + m)*60;
};

/*
    将时间秒数转换成分钟秒钟数，如：190秒=>3分钟10秒
*/
gprsConfig.secordConvertMinute = function(s){
    var m = parseInt(parseInt(s, 10) / 60, 10);
    s = s % 60;    
    return m > 0 ? (m + '分钟' + (s > 0 ? s + '秒' : '')) : (s + '秒');
};

gprsConfig.getTabsIndex = function(tabs, code){
    for(var i=0,c=tabs.length; i<c; i++){
        if(tabs[i].code == code){
            return i;
        }
    }
    return -1;
};

gprsConfig.buildWeekdayForm = function(param){
    param = param || {};
    var arrWeekDay = [
        [1, '星期一'],
        [2, '星期二'],
        [3, '星期三'],
        [4, '星期四'],
        [5, '星期五'],
        [6, '星期六'],
        [0, '星期日']
    ];
    var c = arrWeekDay.length;
    var strChbName = param.chbName || 'chbWeekDayCopy';
    var strHtml = '';
    var strCheckAll = '';
    var strOnclick = '';
    
    if(param.isAllChecked){
        strCheckAll += '<label class="chb-label-nobg" style="width:65px;">'
            + '<input type="checkbox" name="' + strChbName + 'All" class="chb" onclick="this.checked=true;cms.util.selectCheckBox(\'' + strChbName + '\',1);" />'
            + '<span>全选</span>'
            + '</label>';
        strCheckAll += '<label class="chb-label-nobg" style="">'
            + '<input type="checkbox" name="' + strChbName + 'Inverse" class="chb" onclick="cms.util.selectCheckBox(\'' + strChbName + '\',3);" />'
            + '<span>反选</span>'
            + '</label>';
        strOnclick = ' onclick="cms.util.$N(\'' + strChbName + 'All\')[0].checked = cms.util.getCheckBoxCheckedCount(\'' + strChbName + '\')==' + c + ';"';
    }
    strHtml += '<div>';
    for(var i=0; i<c; i++){
        strHtml += '<label class="chb-label-nobg" style="width:65px;margin-bottom:5px;">'
            + '<input type="checkbox" name="' + strChbName + '" class="chb" value="' + arrWeekDay[i][0] + '" ' + strOnclick + ' />'
            + '<span>' + arrWeekDay[i][1] + '</span>'
            + '</label>';
    }
    strHtml += '</div>';
    strHtml += strCheckAll;
    return strHtml;
};

gprsConfig.buildMonthdayForm = function(param){
    param = param || {};
    var arrMonthDay = [
        [1, '一月'],
        [2, '二月'],
        [3, '三月'],
        [4, '四月'],
        [5, '五月'],
        [6, '六月'],
        [7, '七月'],
        [8, '八月'],
        [9, '九月'],
        [10, '十月'],
        [11, '十一月'],
        [12, '十二月']
    ];
    var c = arrMonthDay.length;
    var strChbName = param.chbName || 'chbMonthDayCopy';
    var strHtml = '';
    var strCheckAll = '';
    var strOnclick = '';
    if(param.isAllChecked){
        strCheckAll += '<label class="chb-label-nobg" style="width:65px;">'
            + '<input type="checkbox" name="' + strChbName + 'All" class="chb" onclick="this.checked=true;cms.util.selectCheckBox(\'' + strChbName + '\',1);" />'
            + '<span>全选</span>'
            + '</label>';
        strCheckAll += '<label class="chb-label-nobg" style="">'
            + '<input type="checkbox" name="' + strChbName + 'Inverse" class="chb" onclick="cms.util.selectCheckBox(\'' + strChbName + '\',3);" />'
            + '<span>反选</span>'
            + '</label>';
        strOnclick = ' onclick="cms.util.$N(\'' + strChbName + 'All\')[0].checked = cms.util.getCheckBoxCheckedCount(\'' + strChbName + '\')==' + c + ';"';
    }
    strHtml += '<div>';
    for(var i=0; i<c; i++){
        strHtml += '<label class="chb-label-nobg" style="width:65px;margin-bottom:5px;">'
            + '<input type="checkbox" name="' + strChbName + '" class="chb" value="' + arrMonthDay[i][0] + '" ' + strOnclick + ' />'
            + '<span>' + arrMonthDay[i][1] + '</span>'
            + '</label>';
    }
    strHtml += '</div>';
    strHtml += strCheckAll;
    return strHtml;
};

gprsConfig.selectMonthDays = function(param){
    var offset = $('#' + param.obj.id).offset();
    var w = param.obj.offsetWidth;
    var h = param.obj.offsetHeight;
    var strDays = param.obj.value.trim();
    var arrDays = strDays.split(',');
    var strHtml = '<ul style="overflow:hidden;clear:both;padding:5px 10px 0;" id="pwTaskPlanMonthDays_' + param.id + '">';
    for(var i=0; i<31; i++){
        strHtml += '<li style="width:40px;float:left;">'
            + '<label class="chb-label-nobg"><input id="pwchb_md_' + param.id + '_' + (i+1) + '" class="chb" type="checkbox" value="' + (i+1) + '" />'
            + '<span>' + (i+1) + '</span>'
            + '</label>'
            + '</li>';
    }
    strHtml += '<li style="width:40px;float:right;"><a onclick="gprsConfig.setMonthDaysChecked(\'#pwTaskPlanMonthDays_' + param.id + '\', 3);">反选</a></li>'
        + '<li style="width:40px;float:right;"><a onclick="gprsConfig.setMonthDaysChecked(\'#pwTaskPlanMonthDays_' + param.id + '\', 1);">全选</a></li>';
    strHtml += '</ul>';
    var config = {
        id: param.id,
        title: '选择日期',
        html: strHtml,
        width: 260,
        height: 200,
        position: 'custom',
        x: offset.left - (260 - w + 2),
        y: offset.top + h - 1,
        dragAble: false,
        buttonWidth: 40,
        callBack: gprsConfig.setMonthDays,
        returnValue: {
            id: param.id,
            obj: param.obj
        }
    };
    cms.box.form(config);
    
    for(var i=0,c=arrDays.length; i<c; i++){
        $('#pwchb_md_' + param.id + '_' + arrDays[i]).attr('checked', true);
    }
};


gprsConfig.setMonthDaysChecked = function(obj, type){
    if(1 == type){
        $(obj + ' input[type="checkbox"]').attr('checked', true);  
    } else {
        var chbitems = $(obj + ' input[type="checkbox"]');
        chbitems.each(function(){
            if($(this).attr("checked") == 'checked'){
                $(this).attr("checked", false);
            }else{
                $(this).attr("checked", true);
            }
        });    
    }
};

gprsConfig.setMonthDays = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strDays = cms.jquery.getCheckBoxCheckedValue('#pwTaskPlanMonthDays_' + pwReturn.returnValue.id);
        $('#' + pwReturn.returnValue.obj.id).attr('value', strDays);
    }
    pwobj.Hide();
};

//GPRS回复协议头部格式
gprsConfig.rspProtocolHeaderPattern = /A\*\w+\*(AA|AB|BB)\*\w+\*/;
//GPRS回复协议结尾格式
gprsConfig.rspProtocolFooterPattern = /(\*##|##|\*#)/g;
//获取GPRS回复协议内容，去除协议头部及尾部
gprsConfig.getResponseProtocolContent = function(protocol){
    return protocol.replace(gprsConfig.rspProtocolHeaderPattern, '').replace(gprsConfig.rspProtocolFooterPattern, '');
};

/*
    检测回复协议完整性
    完整的协议应该是以 ## 结尾
*/
gprsConfig.checkProtocolIntegrality = function(protocol){
    return protocol != '' ? protocol.lastIndexOf('##') == protocol.length - 2 : false;
};