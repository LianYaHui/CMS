var gprs = gprs || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 200;
var rightWidth = rightWidthConfig = 0;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = listBoxMinWidthConfig = 1500;
//滚动条宽度
var scrollBarWidth = 17;

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;
var pageCount = 1;

var timer = 45;
var time = timer;
var pause = false;
var autoPause = true;
var setPause = false;
var loaded = false;
var enabled = true;

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var arrKeys = {name:'输入要查找的设备名称', indexcode:'输入要查找的设备编号'};

var settingCookieName = 'gprs_setting_cookie';

var userName = loginUser.userName;

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = leftWidthConfig = 220;
    }
    cms.frame.setFrameSize(leftWidth, rightWidth);
    //先设置尺寸，防止加载时页面布局错乱
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    module.showDebugBox();
    module.hideDebugBox();
    
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true);
    //定时刷新树型菜单设备状态
    tree.timer = window.setTimeout(tree.updateDevStatus, 30*1000, 30*1000);
    
    //加载数据
    loadData();
    
    updateTimeBoard(time);
    window.setInterval(timing, 1000);
    
    setBodySize();
    
    if(cms.util.isIE6){
        //window.setTimeout(cms.box.IEUpgrade, 5*1000);
    }

    $('.chb').focus(function(){
        this.blur();
    });
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: shortcutKeyAction, shiftKeyFunc: null});
});

$(window).resize(function(){
    if(cms.frame.resize++ === 0){
        cms.frame.setFrameSize(leftWidth, rightWidth);
    } else {
        cms.frame.setFrameSize();
    }
    setBodySize();
});

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    
    $('#listHeader').html(cms.util.buildTable('tbHeader','tbheader'));
    $('#listContent').html(cms.util.buildTable('tbList','tblist'));
    
    if(module.isDebug){
        $('#mainTitle .tools').append('<a class="ibtn" id="btnDebug" title="调试" onclick="showDebugInfo();"><i class="icon-debug"></i></a>');
    }
    
    $('#txtKeywords').focus(function(){
        if(checkKeywords(this)){
            $(this).attr('value','');
        }
    });

    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    window.setTimeout(cms.util.setKeyEnter, 500, [cms.util.$('txtKeywords')], 'loadData');
    
    getDeviceType();
    
    $('#ddlType').change(function(){
        switch($(this).val()){
            case 'name':
                if(checkKeywords('#txtKeywords')){
                    $('#txtKeywords').attr('value', arrKeys.name);
                }
                break;
            case 'indexcode':
                if(checkKeywords('#txtKeywords')){
                    $('#txtKeywords').attr('value', arrKeys.indexcode);
                }
                break;
        }
    });
    
    getSettingCookie();
    
    updateTimeBoard(time);
    
    $('a').focus(function(){
        $(this).blur();
    });
}

var shortcutKeyAction = function(keyCode){
    timerPlay(cms.util.$('btnTimerPlay'));
};

var checkKeywords = function(objTxt){
    return $(objTxt).val() === arrKeys.indexcode || $(objTxt).val() === arrKeys.name;
}

var getSettingCookie = function(){
    var settingByCookie = cms.util.getCookie(settingCookieName);
    if(settingByCookie.isJsonData()){
        try{
            var jsonSet = eval('(' + settingByCookie + ')');
            pageSize = parseInt(jsonSet.pageSize);
            timer = parseInt(jsonSet.timer);
            time = timer;
        }catch(e){
            alert(e);
        }
    }
}

var checkSettingCookieIsExist = function(){
    var settingByCookie = cms.util.getCookie(settingCookieName);
    return settingByCookie !== '';
}

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
    rightWidth = $('#bodyRight').is(':visible') ? rightWidthConfig : 0;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
}

var setBoxSize = function(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52);
    
    $('.listbox').width(boxSize.width);
    if(cms.util.isIE6){
        $('.listbox .listheader').width(boxSize.width);
        $('.listbox .list').width(boxSize.width);
    }
    var operH = $('.operform').outerHeight();
    $('.listbox').height(boxSize.height - 25 - 26 - operH);
    $('.listbox .listheader').height(23);
    $('.listbox .list').height(boxSize.height - 25 - 26 - 23 - operH);
    
    setListBoxSize();
}

var setListBoxSize = function(){
    if(boxSize.width >= listBoxMinWidth){
        listBoxMinWidth = boxSize.width;
    }
    $('.listbox .tbheader').width(listBoxMinWidth);
    $('.listbox .tblist').width(listBoxMinWidth - scrollBarWidth);
}

var setLeftDisplay = function(obj){
    if(obj === undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
}

var setRightDisplay = function(obj){
    if(obj === undefined){
        obj = $('#bodyRightSwitch');
    }
    cms.frame.setRightDisplay($('#bodyRight'), obj);
}

var setTableStyle = function(tb){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
    var chbitems = $(tb + ' tr input[type="checkbox"]');
    chbitems.click(function() {
        if($(this).attr("checked") === 'checked'){
            $(this).parents('tr').addClass('selected');
        }else{
            $(this).parents('tr').removeClass('selected');
        }        
        $('#chbAll').attr('checked', chbitems.size() === cms.jquery.getCheckBoxChecked(tb).size());    
    });
    
    $('#chbAll').click(function(){
        cms.jquery.selectCheckBox('#tbList');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
}

var loadData = function(){
    pageIndex = pageStart;
    $('#txtDevCode').attr('value', '');
    /*
    //搜索时 不限选择的组织单元限制
    $('#txtDevUnitId').attr('value', $('#txtUserUnitId').val());
    */
    getDeviceInfo();    
}

var loadAllData = function(){
    pageIndex = pageStart;
    clearKeywords();
    $('#txtDevCode').attr('value', '');
    $('#txtDevUnitId').attr('value', $('#txtUserUnitId').val());
    getDeviceInfo(); 
}

var clearKeywords = function(){
    $('#txtKeywords').attr('value', '');
}

var treeAction = function(param){
    switch(param.type){
        case 'unit':
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtKeywords').attr('value', '');
            $('#txtDevCode').attr('value', '');
            $('#lblTitle').html('&nbsp;-&nbsp;' + param.unitName);
            $('#txtDevUnitName').attr('value', param.unitName);
            break;
        case 'device':
            $('#ddlType').attr('value', 'name');
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevUnitName').attr('value', param.unitName);
            $('#txtDevCode').attr('value', param.devCode);
            $('#txtKeywords').attr('value', param.devName);
            $('#lblTitle').html('&nbsp;-&nbsp;' + param.unitName);
            break;
    }
    pageIndex = pageStart;
    getDeviceInfo();
}

var getDeviceType = function(){
    var urlparam = 'action=getDeviceType';
    var ddlType = cms.util.$('ddlDevType');
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
            if (1 == jsondata.result) {
                var list = jsondata.list;
                for(var i=0; i<list.length; i++){
                    cms.util.fillOption(ddlType, list[i].typeCode, list[i].typeName);
                }
            } else if(-1 == jsondata.result){
                module.showErrorInfo(jsondata.msg, jsondata.error);
            }
        }
    });
};

var getDeviceInfo = function(){
    var unitId = $('#txtDevUnitId').val();
    var typeCode = $('#ddlDevType').val();
    var devCode = $('#txtDevCode').val();
    var status3g = $('#ddlOnline3G').val();
    var status2g = $('#ddlOnline2G').val();
    var filter = $('#ddlType').val();
    var keywords = $('#txtKeywords').val();
    if(checkKeywords('#txtKeywords')){
        keywords = '';
    }
    
    var showAllData = $('#showAllData').attr('checked') === 'checked' ? 1 : 0;
        
    if(!enabled) return false;
    enabled = false;
    
    //清除分页数据
    $('#pagination').html('');
    //显示加载
    showLoading(true);
    
    var urlparam = 'action=getDeviceGprsInfo&unitId=' + unitId + '&typeCode=' + typeCode + '&devCode=' + devCode 
        + '&status3G=' + status3g + '&status2G=' + status2g + '&filter=' + filter + '&keywords=' + escape(keywords)
        + '&pageIndex=' + (pageIndex-pageStart) + '&pageSize=' + pageSize
        + '&showAllData=' + showAllData + '&' + new Date().getTime();

    if(!module.isDebugInfoAppend){
        module.clearDebugInfo();
    }
    module.appendDebugInfo(module.getDebugTime() + '[GetDeviceInfo Request] param: ' + urlparam);
    module.ajaxRequest({
        url: cmsPath + '/ajax/gprs.aspx',
        data: urlparam,
        callBack: getDeviceInfoCallBack,
        param: {
            showAllData: showAllData
        }
    });
};

var getDeviceInfoCallBack = function(data, param){
    module.appendDebugInfo(module.getDebugTime() + '[GetDeviceInfo Response] data: ' + data);
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    
    $('#txtData').attr('value', data);
    var strData = $('#txtData').val();
    
    //设置List表格宽度
    if(loginUser.userName === 'admin' && param.showAllData === 1){
        listBoxMinWidth = 2400;
    } else {
        listBoxMinWidth = listBoxMinWidthConfig;
    }
    setListBoxSize();
    
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(1 == jsondata.result){
        showListHeader(param.showAllData);
        if(!showDeviceInfo(jsondata, param.showAllData)){
            enabled = true;
            getDeviceInfo();
        } else {
            enabled = true;
            showLoading(false);
        }
        
        module.appendDebugInfo(module.getDebugTime() + '[ShowDeviceInfo Finished]');
    } else if(-1 == jsondata.result){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        
        enabled = true;
        showLoading(false);
    } else {
        module.showErrorInfo(jsondata.msg);
        
        enabled = true;
        showLoading(false);
    }
    delete strData;
    delete jsondata;
};

var showListHeader = function(showAllData){
    var objHeader = cms.util.$('tbHeader');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    
    var rowData = gprsList.buildListHeader('', userName, showAllData);
    cms.util.fillTable(row, rowData);
}

var showDeviceInfo = function(jsondata, showAllData){
    var objList = cms.util.$('tbList');
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, pageSize);
    if(pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        pageIndex = pc;
        
        return false;
    } else {
        autoPause = true;
        cms.util.clearDataRow(objList, 0);

        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (pageIndex-pageStart) * pageSize + rid + 1;
            var strParam = "{devId:'" + dr.devId + "',devName:'" + dr.devName + "',devCode:'" + dr.devCode + "',typeCode:'" + dr.typeCode + "',unitId:'" + dr.unitId + "'}";
            
            row.lang = strParam;

            row.ondblclick = function(){
                var lang = eval('(' + this.lang + ')');
                showDevDetail(lang.devCode, lang.devName);
            };
            
            rowData = gprsList.buildListData(row, dr, rnum, userName, showAllData);
            
            cms.util.fillTable(row, rowData);
            
            rowData = null;
            dr = null;
            delete dr;
            delete rowData;
            
            rid++;
        }
        
        var config = {
            dataCount: dataCount,
            pageIndex: pageIndex,
            pageSize: pageSize,
            pageStart: pageStart,
            showType: 'nolist',
            markType: 'Symbol',
            callBack: 'showPage',
            showDataStat: true,
            showPageCount: false,
            keyAble: true
        };
        var pager = new Pagination();
        pager.Show(config, cms.util.$('pagination'));
        pageCount = pager.pageCount;
        
        setTableStyle('#tbList');
        autoPause = false;
        
        return true;
    }
}

var showPage = function(page){
    pageIndex = parseInt(page, 10);
    getDeviceInfo();
};

var showBatchSetting = function(){
    var strHtml = cms.util.path + '/modules/gprs/setting.aspx?batch=1&devCode=';
    var pwobj = cms.box.win({
        id: 'pwsettingbox',
        title: '批量设置',
        html: strHtml,
        width: 760,
        height: 500,
        minAble: true,
        minWidth: 300,
        showMinMax: true,
        noBottom: true,
        requestType: 'iframe'
    });
}

var showDebugInfo = function(){
    module.showDebugBox();
}

//显示加载
var showLoading = function(show){
    if(show){
        $("#loading").show();
        $("#loading").html("正在加载数据，请稍候...");
    }
    else{
        $("#loading").hide();
    }
}

//显示设置面板
var showSetting = function(obj){
    var isCookie = checkSettingCookieIsExist();
    if(cms.util.$('ddlPageSize') === null){
        var opSize = [['1','1 条'],['2','2 条'],['5','5 条'],['10','10 条'],['15','15 条'],['20','20 条'],['25','25 条'],['30','30 条'],['50','50 条'],['100','100 条'],['200','200 条']];
        var opTime = [];
        if(loginUser.userName === 'admin' || parseInt(loginUser.userId, 10) === 1 || (parseInt(loginUser.userRole, 10) === 1 &&  parseInt(loginUser.userPriority, 10) >= 90)){
            opTime = [['3','3 秒钟'],['5','5 秒钟'],['10','10 秒钟'],['15','15 秒钟'],['30','30 秒钟'],['45','45 秒钟'],['60','1 分钟'],['180','3 分钟'],['300','5 分钟']];
        } else {
            opTime = [['15','15 秒钟'],['30','30 秒钟'],['45','45 秒钟'],['60','1 分钟'],['180','3 分钟'],['300','5 分钟']];
        }
        var strHtml = '<div class="p-10">'
            + '<div>每页显示<select id="ddlPageSize" class="select w70 m-0-3" >'
            + cms.util.buildOptions(opSize, pageSize)
            + '</select>记录'
            + '</div>'
            + '<div class="p-10-0">'
            + '<a class="btn btnc22" style="float:right;" onfocus="this.blur();" onclick="refresh();"><span class="w50">立即刷新<span></a>'
            + '设置定时<select id="ddlTimer" class="select w70 m-0-3" >'
            + cms.util.buildOptions(opTime, timer)
            + '</select>刷新'
            + '</div>'
            + '<label for="chbSaveSetting" class="lblCheckBox"><input type="checkbox" id="chbSaveSetting" ' + (isCookie ? 'checked="checked"' : '') + ' onfocus="this.blur();" /><span>记住我的设置</span></label>'
            + '</div>';
        cms.box.form({
            id: 'settingbox',
            title: '页面设置',
            html: strHtml,
            width: 250,
            height: 180,
            callBack: changeSetting,
            build: 'show',
            reload: false
        });
    } else {
        popwin.Show('settingbox');
        $('#ddlPageSize').attr('value', pageSize);
        $('#ddlTimer').attr('value', timer);
        $('#chbSaveSetting').attr("checked", isCookie);
    }
}

var changeSetting = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var ps = $('#ddlPageSize').val();
        if(ps > pageSize){
            pageIndex = pageStart;
        }
        pageSize = ps;
        
        timer = $('#ddlTimer').val();
        time = timer;
        
        if($('#chbSaveSetting').is(":checked")){
            //将当前设置写入Cookie中
            cms.util.setCookie(settingCookieName, '{pageSize:\'' + pageSize + '\',timer:\'' + timer + '\'}', 7*24);
        } else {
            cms.util.delCookie(settingCookieName);
        }
        getDeviceInfo();
    }
    pwobj.Hide();
}

var refresh = function(){
    getDeviceInfo();
}

var updateTimeBoard = function(time){
    $('#timeboard .ts').html(time);
}

//定时器
var timerPlay = function(obj){
    pause = !pause;
    setTimePlay(obj, pause);
}

var setTimePlay = function(obj, pause){
    if(pause){
        $('#' + obj.id + ' i').removeClass();
        $('#' + obj.id + ' i').addClass('icon-stop');
        obj.title = '播放';
    } else {
        $('#' + obj.id + ' i').removeClass();
        $('#' + obj.id + ' i').addClass('icon-play');
        obj.title = '暂停';
    }
}

//计时器
var timing = function(){
    if(loaded){
        $("#timerboard").show();
    }
    if(!pause && !autoPause){
        time -= (time -1 >= 0 && !pause) ? 1 : 0;
        if(time <= 0){
            time = timer;
            autoPause = true;
            
            refresh();
        }
        //超过60分钟后，刷新页面
        if(module.loginKeepTime >= 60*60){
            module.moduleAction($('#txtMenuCode').val().trim(), '');
        }
    }
    updateTimeBoard(time);
}

var setPatrolMode = function(setting){
    var dc = cms.jquery.getCheckBoxChecked('#tbList').length;
    var devCode = cms.jquery.getCheckBoxCheckedValue('#tbList');
    $('#txtDevCodeList').attr('value', devCode);
    var strText = setting === 1 ? '手动' : '自动';
    
    if(dc === 0){
        cms.box.alert({title:'提示信息', html:'请选择设备！',width:200,height:120});
        return false;
    } else {
        //停止定时刷新
        timerPlayStop(true);
        
        var strHtml = '当前选中了<b style="color:#f00;padding:0 3px;">' + dc + '</b>个设备。<Br/>'
            + '确定要将选中的设备巡检模式设置为“' + strText + '”模式吗？';
        cms.box.confirm({
            id: 'pwdevbatchsetting',
            title: '设置巡检模式 - ' + strText,
            html: strHtml,
            callBack: setPatrolModeAction,
            returnValue: {
                devCode: devCode,
                setting: setting
            }
        });
    }
};

var setPatrolModeAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var devCode = pwReturn.returnValue.devCode;
        var setting = pwReturn.returnValue.setting;        
        var urlparam = 'action=setPatrolMode&batch=Y&setting=' + setting + '&devCode=' + devCode;
        module.ajaxRequest({
            url: cms.util.path + '/ajax/setting.aspx',
            data: urlparam,
            callBack: setPatrolModeCallBack,
            param: {
                devCode: devCode,
                setting: setting
            }
        });
    }
    //开启定时刷新
    timerPlayStop(false);
    
    pwobj.Hide();
};

var setPatrolModeCallBack = function(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata =  eval('(' + data + ')');
    var dc = param.devCode.split(',').length;
    var strHtml = '选中的' + dc + '台设备的' + (param.setting === 1 ? '批量手动设置' : '批量自动设置') + ' 指令已下发！';
    cms.box.alert({title:'提示信息', html:strHtml,width:320,height:180});
};

var showDevDetail = function(devCode, devName){
    module.showDevDetail(devCode, devName, {lock: true, callBack: winCloseAction});
    //停止定时刷新
    timerPlayStop(true);
};

var showGprsSetting = function(devCode, devName){
    var size = [780, 520];
    var strHtml = cmsPath + '/modules/gprs/setting.aspx?devCode=' + devCode;
    var pwobj = cms.box.win({
        id: 'pwGprsSetting',
        title: 'GPRS设置 - ' + devName,
        html: strHtml,
        requestType: 'iframe',
        width: size[0],
        height: size[1],
        minAble: true,
        maxAble: true,
        showMinMax: true,
        noBottom: true,
        filter: false,
        callBack: winCloseAction
    });
    timerPlayStop(true);
};

var showPreview = function(devCode, devName){
    module.showPreview(devCode, devName, 1, {lock: true, callBack: winCloseAction});
    //停止定时刷新
    timerPlayStop(true);
};

var showPlayBack = function(devCode, devName){
    module.showPlayBack(devCode, devName, {lock: true, callBack: winCloseAction});
    //停止定时刷新
    timerPlayStop(true);
};

var showGpsTrack = function(devCode, devName){
    module.showGpsTrack(devCode, devName, {lock: true, callBack: winCloseAction});
    //停止定时刷新
    timerPlayStop(true);
};

var showGprsConfig = function(devCode, devName){
    module.showGprsConfig(devCode, devName, {lock: true, callBack: winCloseAction});
    //停止定时刷新
    timerPlayStop(true);
};

var showRemoteConfig = function(devCode, devName){
    module.showRemoteConfig(devCode, devName, {lock: true, callBack: winCloseAction});
    //停止定时刷新
    timerPlayStop(true);
};

var showDevPreset = function(devCode, devName){
    module.showDevPreset(devCode, devName, -1, {lock: true, callBack: winCloseAction});
    //停止定时刷新
    timerPlayStop(true);
};

var showHistory = function(devCode, devName){
    var w = 700;
    var h = 500;
    var url = cmsPath + '/modules/gprs/history.aspx?devCode=' + devCode + '&bodyH=' + h + '&' + new Date().getTime(); 
    var bodySize = cms.util.getBodySize();
        
    //停止定时刷新
    timerPlayStop(true);
	var pwobj = cms.box.win({
	    id:'pwHistoryBox',
	    title:'历史数据 - ' + devName,
	    html:url,
	    requestType:'iframe',
	    width:w,
	    height:h,
		noBottom:true,
		minAble:true,
		maxAble:true,
		showMinMax:true,
		callBack: winCloseAction
	});
};

var winCloseAction = function(pwobj){
    timerPlayStop(false);
    pwobj.Hide();
    pwobj.Clear();
};

var timerPlayStop= function(stop){
    if(stop){
        if(!pause){
            //停止自动刷新列表
            pause = true;
            setTimePlay(cms.util.$('btnTimerPlay'), pause);
            setPause = true;
        }
    } else {
        if(setPause){
            pause = false;
            setTimePlay(cms.util.$('btnTimerPlay'), pause);
            setPause = false;
        }
    }
};

var batchSetting = function(){
    var strDevCodeList = cms.util.getCheckBoxCheckedValue('chbDevCode', ',');
    if('' == strDevCodeList){
        cms.box.alert({title:'提示信息', html:'请选择设备'});
    } else {
        batchSettingAction(strDevCodeList);
    }
};

var batchSettingAction = function(strDevCodeList){
    var w = 700;
    var h = 500;
    var url = cmsPath + '/modules/gprsConfig/batch.aspx?devCode=' + strDevCodeList + '&' + new Date().getTime(); 
    var bodySize = cms.util.getBodySize();
        
    //停止定时刷新
    timerPlayStop(true);
	var pwobj = cms.box.win({
	    id:'pwBatchConfig',
	    title:'批量设置',
	    html:url,
	    requestType:'iframe',
	    width:w,
	    height:h,
		noBottom:true,
		minAble:true,
		maxAble:true,
		showMinMax:true,
		callBack: winCloseAction
	});
};

var exportDevice = function(){
    var unitName = $('#txtDevUnitName').val();
    var strHtml = '确定要导出“' + unitName + '”设备信息吗？';
    cms.box.confirm({
        id: 'exportdevice',
        title: '导出设备信息',
        html: strHtml,
        width: 320,
        callBack: exportDeviceAction
    });
};

var exportDeviceAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var unitId = $('#txtDevUnitId').val();
        var handleURL = cms.util.path + "/ajax/export.aspx?action=exportDevice&unitId=" + unitId + "&isIE=" + (cms.util.isMSIE ? 1 : 0);
        window.location.href = handleURL;
    }
    pwobj.Hide();
};