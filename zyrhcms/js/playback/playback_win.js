cms.playback = cms.playback || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 200;
var rightWidth = 465;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = 800;
//滚动条宽度
var scrollBarWidth = 18;

var treeType = 'camera';
var treeTitle = '设备通道';
var isSearchTree = false;
var treekeys = '';
var treeHeight = 130;


var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

cms.playback.titleH = 25;
cms.playback.viewControlPanelH = 40;
cms.playback.searchFormPanelH = 150;
cms.playback.progressBarHeight = 15;

cms.playback.arrPlayType = [
    [0, '设备录像'],
    [1, '中心存储'],
    [2, '备份录像']
];
cms.playback.arrFileType = [
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

cms.playback.isDebug = module.checkIsDebug();

//是否处理OCX GPS消息事件
cms.playback.isDisposeOcxGpsEvent = false;
//是否处理OCX 报警消息事件
cms.playback.isDisposeOcxAlarmEvent = false;
//是否处理OCX 设备上下线消息事件
cms.playback.isDisposeOcxDevOnOffEvent = false;

cms.playback.ocx = null;
//当前选中窗口
cms.playback.curWinNum = 0;
//最大窗口数量
cms.playback.maxWinCount = 36;
//当前窗口数量
cms.playback.curWinCount = 4;
//播放窗口与设备记录
cms.playback.arrWinDev = [];

//播放类型 0-设备录像，1-中心存储，2-备份录像
cms.playback.playType = 0;

cms.playback.cagServerIp = '';
cms.playback.cagServerPort = 0;


cms.playback.curDevCode = '';
cms.playback.devId = 0;
cms.playback.channelNo = 1;
cms.playback.serverIp = '';
cms.playback.serverPort = 0;
cms.playback.storeServerIp = '';
cms.playback.storeServerPort = 0;
cms.playback.fileName = '';
cms.playback.serverLineId = 1;
cms.playback.serverLineCode = 0;

cms.playback.arrRecordTime = [];
cms.playback.showPlayEventLog = true;
cms.playback.lastPercent = 0;

cms.playback.isPlayBack = false;
cms.playback.btnSearch = null;
cms.playback.curRow = null;

cms.playback.progressBar = null;
//获取回放进度定时器
cms.playback.timer = null;
//定时器频率，默认为1秒
cms.playback.interval = 1*1000;
//最后一次进度
cms.playback.lastProgress = 0;
//相同进度次数
cms.playback.sameProgressCount = 0;

cms.playback.arrRecordFile = [];
cms.playback.arrRecordPlayFile = [];
//
cms.playback.recordFileIndex = 0;
//是否连续播放
cms.playback.continuous = false;

//服务器连接
cms.playback.htServerConnect = new cms.util.Hashtable();

//录像下载句柄 
/*
{
    handle:0,
    status:0,
    progress:0
}
*/
cms.playback.arrDownloadHandle = [];

//录像下载窗口
cms.playback.pwDownload = null;
//下载录像列表行数
cms.playback.downloadListRowId = 0;
//下载进度定时器
cms.playback.downloadProgressTimer = null;

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = 220;
    }
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    try{
        module.showOcxDebugBox();
        module.hideOcxDebugBox();
    }catch(e){}
    
    if(isWindow){        
        //创建树型菜单表单
        tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', false, leftWidth, '3');
        //加载树型菜单
        tree.showTreeMenu(false, treeType, 'treeAction', false, true, true, false, true, '3,4');
    } else {
        //创建树型菜单表单
        tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', false, leftWidth, '3');
        //加载树型菜单
        tree.showTreeMenu(false, treeType, 'treeAction', false, true, true, false, true, '3,4');
        //定时刷新树型菜单设备状态
        tree.timer = window.setTimeout(tree.updateDevStatus, 15*1000, 15*1000);
    }
    setBodySize();

    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: shortcutKeyAction});
    
    //初始化OCX控件
    cms.playback.initialOcx();

});

$(window).resize(function(){
    if(cms.frame.resize++ == 0){
        cms.frame.setFrameSize(leftWidth, rightWidth);
    } else {
        cms.frame.setFrameSize();
    }
    setBodySize();
});

$(window).unload(function(){
    if(cms.playback.timer != null){
        //清除定时器
        clearInterval(cms.playback.timer);
    }
    if(cms.playback.ocx != null){
        cms.ocx.stopAll(cms.playback.ocx);
        cms.ocx.logout(cms.playback.ocx);
    }
});

function initialForm(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    
    cms.util.fillOptions(cms.util.$('ddlPlayType'), cms.playback.arrPlayType, 0);
    cms.util.fillOptions(cms.util.$('ddlFileType'), cms.playback.arrFileType, 0xff);
    
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
        
    
    $('#viewcontrol').html(cms.playback.buildVideoControl());
    $('#viewcontrol a').focus(function(){
        $(this).blur();
    });
        
    $('#listHeader').html(cms.util.buildTable('tbHeader','tbheader'));
    $('#listContent').html(cms.util.buildTable('tbList','tblist') + '<div id="divPrompt" style="padding:5px 10px;"></div>');
    
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    $('#bodyMain .titlebar').append('<a class="ibtn nobg" title="刷新" onclick="location.reload();" style="float:right;margin-right:1px;"><i class="icon-update"></i></a>');
    
    cms.playback.showFileListHeader();
    
    //初始化设备编号 和 通道号
    cms.playback.curDevCode = $('#txtDevCode').val();
    cms.playback.channelNo = parseInt($('#txtChannelNo').val(), 10);
    cms.playback.serverIp = $('#txtServerIp').val();
    cms.playback.serverPort = parseInt($('#txtServerPort').val(), 10);
    cms.playback.storeServerIp = $('#txtStoreServerIp').val();
    cms.playback.storeServerPort = parseInt($('#txtStoreServerPort').val(), 10);
}

function setBodySize(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? 400 : 0;
    $('#pageBody').css('padding', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth - borderWidth - paddingTop*2, 
        height: frameSize.height - borderWidth - paddingTop*2 - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    $('#bodyMain').height(boxSize.height);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    
    setBoxSize();
    
    changeProgressBarSize();
}

function setBoxSize(){
    $('#leftMenu').height(treeHeight);
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(treeHeight - 25);
    $('#tree').height(treeHeight - 25);
    
    $('.viewbox').width(boxSize.width);
    $('.viewbox').height(boxSize.height - 25 - 40 - cms.playback.progressBarHeight);
    
    $('#divSearchForm').width(leftWidth - 2);
    $('#divSearchForm').height(cms.playback.searchFormPanelH - 25 - 3);
    
    $('.listbox').width(leftWidth - 2);
    if(cms.util.isIE6){
        $('.listbox .listheader').width(leftWidth - 2);
        $('.listbox .list').width(leftWidth - 2);
    }
    $('.listbox').height(boxSize.height - cms.playback.searchFormPanelH - 26 - 26 - treeHeight);
    $('.listbox .listheader').height(23);
    var listHeight = boxSize.height - cms.playback.searchFormPanelH - 25 - 23 - 26 - treeHeight;
    $('.listbox .list').height(listHeight);
    $('.listbox .tbheader').width(listBoxMinWidth);
    $('.listbox .tblist').width(listBoxMinWidth - scrollBarWidth);
}

function shortcutKeyAction(keyCode){
    switch(keyCode){
        case 81:
            if(cms.playback.ocx != null){
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[IsFullScreen Request]');
                var isFull = cms.ocx.isFullScreen(cms.playback.ocx);
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[IsFullScreen Response] return: ' + isFull);
                
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Request] bFull: ' + !isFull);
                var result = cms.ocx.setFullScreen(cms.playback.ocx, !isFull);
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Response] return: ' + cms.ocx.showErrorCode(result));
            }
            break;
    }
}

function treeAction(param){
    switch(param.type){
        case 'camera':
            $('#txtDevName').attr('value', param.devName);
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            $('#txtDevId').attr('value', param.devId);
            $('#txtChannelName').attr('value', param.cameraName);
            cms.playback.curDevCode = param.devCode;
            
            cms.playback.selectDeviceToPlay(param.devId, param);
            break;
    }
}

function initialProgressBar(){
    var strHtml = '<div id="playbackProgress" style="float:left;padding:0;margin:0;height:15px;"></div><input type="hidden" id="txtPlaybackProgress" readonly="readonly" class="txt w20" style="float:left;" />';
    $('#progressbar').html(strHtml);
    
    cms.playback.progressBar = new ProgressBar(cms.util.$('playbackProgress'),
        {
            id:'playbackProgress', width:boxSize.width - 14, min:0, defaultValue:0, title:'回放进度',showPercent:true, max:100, limit:{},border:'none',
            callBack:setPlayBackProgress, returnValue:'txtPlaybackProgress'
        }
    );
}

function changeProgressBarSize(){
    if(cms.playback.progressBar != null){
        var val = parseInt($('#txtPlaybackProgress').val(), 10);
        cms.playback.progressBar.changeSize(boxSize.width - 14, val);
    }
}

//设置进度条（未完待续）
function setPlayBackProgress(num, objId){
    var obj = cms.util.$(objId);
    obj.value = num;
    var percent = parseInt(num);
    //获取表单参数
    var param = cms.playback.getFormParam();
    
    if(param.playType == 0){
        if(!cms.playback.fileName.equals('') && cms.playback.isPlayBack){
            cms.playback.startPlayBack(cms.playback.serverIp, cms.playback.serverPort, cms.playback.curDevCode, cms.playback.fileName, percent);
        }
    } else if(param.playType == 1){
        if(cms.playback.arrRecordTime.length > 0 && cms.playback.isPlayBack){
            var fileType = cms.playback.arrRecordTime[0][0];
            var startTime = cms.playback.arrRecordTime[0][1];
            //拖动时间 要重新计算开始的时间
            var total = cms.playback.arrRecordTime[0][3];
            var ts = percent / 100 * parseInt(total, 10);
            var dtStart = ('' + startTime).toDate();
            dtStart.setSeconds(dtStart.getSeconds() + parseInt(ts, 10));
            
            var endTime = cms.playback.arrRecordTime[0][2];
            var dataSize = cms.playback.arrRecordTime[0][4];
            
            cms.playback.playCentralRecord(null, szDevId, iChannel, szBeginTime, szEndTime, iRecFlag, nTotalSize)
            
            cms.playback.startStorePlayBack( cms.playback.curDevCode, cms.playback.channelNo,
               dtStart.toString('yyyy-MM-dd HH:mm:ss'), endTime, fileType, dataSize, true);
        }
    }
}

function setLeftDisplay(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
}

cms.playback.initialOcx = function(){
    //获取OCX控件
    cms.playback.ocx = cms.util.$('WMPOCX');
    
    if(cms.playback.ocx != null){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Request] iRank: ' + cms.playback.curWinCount);
        var result = cms.ocx.setWindowRank(cms.playback.ocx, cms.playback.curWinCount);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Response] return: ' + cms.ocx.showErrorCode(result));
        
        if(1 == cms.playback.curWinCount){
            //设置双击是否可用
            cms.ocx.enableDblClick(cms.playback.ocx, false);
        }
        
        //启用控件右键菜单
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableContextMenu Request] bEnable: false');
        result = cms.ocx.enableContextMenu(cms.playback.ocx, false);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableContextMenu Response] return: ' + cms.ocx.showErrorCode(result));
    }
    
    initialProgressBar();
};


cms.playback.btnIconSwitch = function(btn){
    var cg = eval('(' + btn.lang + ')');
    var idx = 0;    
    idx = btn.rel == cg[0][0] ? 1 : 0;
    btn.rel = cg[idx][0];
    btn.className = cg[idx][1];
    btn.title = cg[idx][2];
};

cms.playback.buildVideoControl = function(){
    var strHtml = ''
        + '<div class="win-stop-panel">'
        + '<a name="allstop" class="winset allstop" title="全部停止回放" onclick="cms.playback.stopAll();">全部停止回放</a>'
        + '<a name="stop" class="winset stop" title="停止回放" onclick="cms.playback.stop();">停止回放</a>'
        /*
        + '<a name="screen-switch" class="winset screen-stretch" title="自适应" onclick="cms.playback.setScreenAdaption(this);" '
        + ' rel="stretch" lang="[[\'stretch\',\'winset screen-stretch\',\'自适应\'],[\'center\',\'winset screen-center\',\'充满窗口\']]">自适应</a>'
        */
        + (cms.playback.isDebug ? '<a name="windebug" class="winset debug" title="调试" onclick="module.showOcxDebugBox();" style="margin-left:10px;">OCX控件接口调试</a>' : '')
        + '</div>'
        + '<div class="win-set-panel">'
       + '<a name="winset" id="btnWinSet1" class="winset win1" onclick="cms.playback.setWindowRank(1, this);" title="一画面">1画面</a>'
        + '<a name="winset" id="btnWinSet4" class="winset cur4" onclick="cms.playback.setWindowRank(4, this);" title="四画面">4画面</a>'
        + '<a name="winset" id="btnWinSet9" class="winset win9" onclick="cms.playback.setWindowRank(9, this);" title="九画面">9画面</a>'
        + '<a name="winset" id="btnWinSet16" class="winset win16" onclick="cms.playback.setWindowRank(16, this);" title="十六画面">16画面</a>'
        + '<a name="winmax" class="winset winmax" title="切换为全屏&#10;按Esc键退出全屏" onclick="cms.playback.fullScreen(this);">切换为全屏</a>';
        + '</div>';
    return strHtml;
};

cms.playback.selectDeviceToPlay = function(devId, param){
    var urlparam = 'action=getDevPreviewParam&devId=' + devId + '&channelNo=' + param.channelNo
        + '&loginLineId=' + loginUser.loginLineId + '&loginLineCode=' + loginUser.loginLineCode;
    $.ajax({
        type: 'post',
        //async: false, //同步交互
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
                var dev = jsondata.dev;
                if(dev.cagServerIp.equals('')){
                    var strHtml = '设备没有配置服务器信息，请到后台管理先配置设备服务器信息' + cms.box.buildIframe(600,300,true);
                    cms.box.alert({id: 'pwerror', title: '错误信息', html: strHtml});
                    return false;
                } else {
                    var camera = jsondata.camera;
                    cms.playback.curDevCode = param.devCode;
                    cms.playback.devId = devId;
                    cms.playback.cagServerIp = dev.cagServerIp;
                    cms.playback.cagServerPort = dev.cagServerPort;
                    cms.playback.serverLineId = dev.serverLineId;
                    cms.playback.serverLineCode = dev.serverLineCode;
                    cms.playback.storeServerIp = dev.storeServerIp;
                    cms.playback.storeServerPort = dev.storeServerPort;
                    cms.playback.channelNo = parseInt(param.channelNo, 10);
                }
            }
        }
    });

};

//OCX登录
cms.playback.login = function(serverIp, serverPort, userName, userPwd, loginLineCode, timeLimitedPlay){
    var strServer = serverIp + ':' + serverPort;
    var result = -1;
    if(!cms.playback.htServerConnect.contains(strServer)){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Login Request]'
            + ' szIp: ' + serverIp + ', nPort: ' + serverPort + ', szUser: ' + userName + ', szPwd: ' + userPwd
            + ', iLine:' + loginLineCode + ', nPlayLimit:' + timeLimitedPlay + ', nLimitNotify:' + cms.ocx.playLimitNotify);
        try{
            result = cms.ocx.login(cms.playback.ocx, serverIp, serverPort, userName, userPwd, loginLineCode, timeLimitedPlay);
        }catch(e){
            module.showOcxError(e, 'OCX登录失败');
        }
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Login Response] return: ' + cms.ocx.showErrorCode(result));
        
        if(0 == result){
            cms.playback.htServerConnect.add(strServer);
            return true;
        } else {
            cms.box.alert({
                title:'提示信息' + cms.box.buildIframe(600, 400, true),
                html:'服务器（' + serverIp + ':' + serverPort + '）连接失败，请检查服务器是否运行。'
            });
            return false;
        }
    }
    return true;
};

//获取表单参数
cms.playback.getFormParam = function(){
    var param = {
        devCode: cms.playback.curDevCode,
        channelNo: cms.playback.channelNo,
        //设备连接服务器线路编号
        devLineCode: cms.playback.serverLineCode,
        devName: $('#txtDevName').val(),
        playType: parseInt($('#ddlPlayType').val(), 10),
        fileType: parseInt($('#ddlFileType').val(), 10),
        offset: 0,
        limited: 10,
        startTime: $('#txtStartTime').val(),
        endTime: $('#txtEndTime').val()
    };
    
    return param;
};

cms.playback.searchRecordFile = function(btn){
    //先登录
    if(!cms.playback.login(cms.playback.cagServerIp, cms.playback.cagServerPort, loginUser.userName, loginUser.userPwd, loginUser.loginLineCode, loginUser.timeLimitedPlay)){
        return false;
    }
    
    //获取表单参数
    var param = cms.playback.getFormParam();
    
    //查询结果
    var strResult = '';
    var strAction = 0 == param.playType ? 'QueryDevRecords' : 1 == param.playType ? 'QueryCentralRecords' : '';
    
    try{
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[' + strAction + ' Request]'
            + ' szDeviceId: ' + param.devCode + ', iChannel: ' + param.channelNo + ', iFileType: ' + param.fileType
            + ', iOffset: ' + param.offset + ', iLimited: ' + param.limited + ', szBeginTime: ' + param.startTime
            + ', szEndTime: ' + param.endTime);

        switch(param.playType){
            case 0:     //设备录像
	            cms.playback.showPrompt('正在搜索设备录像文件，请稍候...');
	            cms.playback.showFileStat('');
                cms.playback.clearFileList();
                
                strResult = cms.ocx.queryDevRecords(cms.playback.ocx, param.devCode, param.channelNo, param.fileType, param.offset, param.limited, param.startTime, param.endTime);
                break;
            case 1:     //中心录像
	            cms.playback.showPrompt('正在搜索中心录像文件，请稍候...');
	            cms.playback.showFileStat('');
                cms.playback.clearFileList();
                
                strResult = cms.ocx.queryCentralRecords(cms.playback.ocx, param.devCode, param.channelNo, param.fileType, param.offset, param.limited, param.startTime, param.endTime);
                break;
            case 2:
                break;
        }
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[' + strAction + ' Response] return: ' + strResult);
    }catch(e){
        cms.playback.showPrompt('搜索录像出错' + '<br />错误码如下：<br />' + e);
    }
    cms.playback.showRecordFile(strResult, param);
};

cms.playback.showRecordFile = function(strResult, param){
    if('' == strResult || !strResult.isJsonData()){
	    cms.playback.showPrompt('没有搜索到相关的录像文件');
        cms.playback.clearFileList();
	    cms.playback.showFileStat('设备“' + param.devName + '” 共搜索到 0 个录像文件');
        return false;
    }
    var jsonParam = strResult.toJson(); //eval('(' + strResult + ')');
    if(jsonParam.result != undefined && jsonParam.result != 0){        
	    cms.playback.showPrompt('没有搜索到相关的录像文件<br />错误码：' + jsonParam.result + '<br />错误描述：' + jsonParam.msg);
        return false;
    } else if(undefined == jsonParam.params || 0 == jsonParam.params.length){
	    cms.playback.showPrompt('没有搜索到相关的录像文件');   
        cms.playback.clearFileList(); 
	    cms.playback.showFileStat('设备“' + param.devName + '” 共搜索到 0 个录像文件');
    }
    else {
        var objTable = cms.util.$('tbList');
        cms.playback.showFileList(jsonParam.params, param, objTable);
        
	    cms.playback.showPrompt('');
    }
};

cms.playback.showFileList = function(list, param, objTable){
    var rid = 0;
    var dataCount = list.length;
        
    //清除表格行
    cms.util.clearDataRow(objTable, 0);
    
    //清空录像文件列表
    cms.playback.arrRecordFile.length = 0;
    
    for(var i = 0,c=dataCount; i<c; i++){
        var dr = list[i];
        var row = objTable.insertRow(rid);
               
        rowData = cms.playback.buildFileContent(row, dr, rid, param);
            
        cms.util.fillTable(row, rowData);
        
        rowData = null;
        
        rid++;
        
        cms.playback.arrRecordFile.push(dr);
    }
};

cms.playback.buildFileContent = function(row, dr, rid, param){
    var rowData = [];
    var cellid = 0;
    
    var strFileName = dr.file_name;
	var strFileType = cms.playback.parseFileType(dr.type);
	var arrDuration = cms.playback.calculateDuration(dr.begin_time, dr.end_time);
	var strAction = '';
    switch(param.playType){
        case 0:
            //播放设备录像时是否同时保存到中心录像
            //0-不进行中心存储录像;1-按帧时间存入中心存储;2-按当前时间存入中心存储
            var iSaveToCenter = 1;
            strAction = "cms.playback.playDeviceRecord(this,\'%s\',%s,\'%s\',%s,%s,%s,%s,%s);".format(
                [param.devCode, param.channelNo, dr.file_name, 0, 0, dr.size, iSaveToCenter, param.devLineCode], '%s'
            );
            break;
        case 1:
            strAction = "cms.playback.playCentralRecord(this,\'%s\',%s,\'%s\',\'%s\',%s,%s);".format(
                [param.devCode, param.channelNo, dr.begin_time, dr.end_time, dr.type, dr.size], '%s'
            );
            break;
        case 2:
            break;
    }    
	var strPlayBack = '<a class="playback" title="单击回放录像" id="btnPlayBack_' + rid + '" onclick="' + strAction + '"></a>';	
	var strDownload = '<a class="download" title="单击下载录像文件"'
	    + ' onclick="cms.playback.downloadRecord({playType:' + param.playType;
	if(0 == param.playType){
	    strDownload += ', szDevId:\'%s\', iChannel:%s, szFileName:\'%s\', nOffset:%s, nReadSize:%s, nTotalSize:%s, iSaveToCenter:%s, iDevLine:%s'.format(
	    [param.devCode, param.channelNo, dr.file_name, 0, 0, dr.size, 0, param.devLineCode],'%s'
	    );	    
	} else if(1 == param.playType){
	    strDownload += ',szDevId:\'%s\',iChannel:%s,szBeginTime:\'%s\',szEndTime:\'%s\',iRecFlag:%s,nTotalSize:%s,szFileName:\'%s\''.format(
	        [param.devCode, param.channelNo, dr.begin_time, dr.end_time, dr.type, dr.size, dr.file_name], '%s'
	    );
	}	
	strDownload += '});"></a>';
	
    var strParam = "{fileName:'" + strFileName + "'}";
    
    rowData[cellid++] = {html: (rid + 1), style:[['width','28px']]}; //序号
    rowData[cellid++] = {html: param.channelNo, style:[['width','28px']]}; //通道
    rowData[cellid++] = {html: dr.begin_time, style:[['width','120px']]}; //起始时间
    rowData[cellid++] = {html: arrDuration[1], style:[['width','55px']]}; //录像时长
    rowData[cellid++] = {html: strPlayBack, style:[['width','28px']]}; //回放按钮
    rowData[cellid++] = {html: strDownload, style:[['width','28px']]}; //下载按钮
    rowData[cellid++] = {html: dr.end_time, style:[['width','120px']]}; //结束时间
    rowData[cellid++] = {html: cms.playback.fileLength(dr.size) + ' MB', style:[['width','75px']]}; //文件大小
    rowData[cellid++] = {html: cms.util.fixedCellWidth(strFileType, 65, true, strFileType), style:[['width','65px']]}; //文件类型
    rowData[cellid++] = {html: strFileName, style:[['width','135px']]}; //文件名称
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;   
    
};

cms.playback.clearFileList = function(objTable){
    if(objTable == undefined){
        objTable = cms.util.$('tbList');    
    }
    cms.util.clearDataRow(objTable, 0);
};

//播放设备录像
cms.playback.playDeviceRecord = function(btn, szDeviceId, iChannel, szFileName, nOffset, nReadSize, nTotalSize, iSaveToCenter, iDevLine){
    if(cms.playback.isPlayBack){
        cms.playback.stop();
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[PlayDevRecord Request]'
        + ' szDeviceId: ' + szDeviceId + ', iChannel: ' + iChannel + ', szFileName: ' + szFileName
        + ', nOffset: ' + nOffset + ', nReadSize: ' + nReadSize + ', nTotalSize: ' + nTotalSize
        + ', iSaveToCenter: ' + iSaveToCenter + ', iDevLine:' + iDevLine);
        
    if(btn != null){
        var tr = btn.parentNode.parentNode;
        cms.playback.setRowSelected(tr);
    }
    
    var result = cms.ocx.playDevRecord(cms.playback.ocx, szDeviceId, iChannel, szFileName, nOffset, nReadSize, nTotalSize, iSaveToCenter, iDevLine);

    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[PlayDevRecord Response] return: ' + cms.ocx.showErrorCode(result));
    
    if(0 == result){
        cms.playback.isPlayBack = true;
    
        //定时获取回放进度，并设置进度条位置
        cms.playback.timer = window.setInterval(cms.playback.getPlayBackPos, cms.playback.interval, 0, cms.playback.curWinNum);
    }
};

//播放中心录像
cms.playback.playCentralRecord = function(btn, szDevId, iChannel, szBeginTime, szEndTime, iRecFlag, nTotalSize){
    if(cms.playback.isPlayBack){
        cms.playback.stop();
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[PlayCentralRecord Request]'
        + ' szDevId: ' + szDevId + ', iChannel: ' + iChannel + ', szBeginTime: ' + szBeginTime
        + ', szEndTime: ' + szEndTime + ', iRecFlag: ' + iRecFlag + ', nTotalSize: ' + nTotalSize);

    if(btn != null){
        var tr = btn.parentNode.parentNode;
        cms.playback.setRowSelected(tr);
    }
    
    var result = cms.ocx.playCentralRecord(cms.playback.ocx, szDevId, iChannel, szBeginTime, szEndTime, iRecFlag, nTotalSize);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[PlayCentralRecord Response] return: ' + cms.ocx.showErrorCode(result));
    
    if(0 == result){
        cms.playback.isPlayBack = true;
        
        //定时获取回放进度，并设置进度条位置
        cms.playback.timer = window.setInterval(cms.playback.getPlayBackPos, cms.playback.interval, 1, cms.playback.curWinNum);
    }
};

cms.playback.stop = function(){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Stop Request]');
    var result = cms.ocx.stop(cms.playback.ocx);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Stop Response] return: ' + cms.ocx.showErrorCode(result));
    
    //清除定时器
    clearInterval(cms.playback.timer);
};

cms.playback.stopAll = function(){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopAll Request]');
    var result = cms.ocx.stopAll(cms.playback.ocx);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopAll Response] return: ' + cms.ocx.showErrorCode(result));
    
    //清除定时器
    clearInterval(cms.playback.timer); 
};

cms.playback.downloadRecordFile = function(){

};

//获取录像回放进度
cms.playback.getPlayBackPos = function(playType, iWnd){
    if(playType == 0){        
        //module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetDevProgress Request] iWnd: ' + iWnd);
        var result = cms.ocx.getDevProgress(cms.playback.ocx, iWnd);
        //module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetDevProgress Response] return: ' + result);    
    } else if(playType == 1){
        //module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetCentralProgress Request] iWnd: ' + iWnd);
        var result = cms.ocx.getCentralProgress(cms.playback.ocx, iWnd);
        //module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetCentralProgress Response] return: ' + result);
    }
    
    var progress = parseInt(result, 10);
    if(progress >= 0 && progress <= 100){
        if(progress === cms.playback.lastProgress){
            cms.playback.sameProgressCount++;
        } else {
            cms.playback.sameProgressCount = 0;
        }

        if(cms.playback.sameProgressCount > 30 || (cms.playback.sameProgressCount > 10 && cms.playback.lastProgress >= 98)){
            //清除定时器
            clearInterval(cms.playback.timer);
        }

        cms.playback.lastProgress = progress;

        //设置进度条
        cms.playback.setProgressBar(result);
    } else {
        //清除定时器
        clearInterval(cms.playback.timer);
    }
};

cms.playback.setContinuous = function(isContinuous){
    cms.playback.continuous = isContinuous;
};

cms.playback.cleanTimeFormat = function(strTime){
    return strTime.replace(/[-: ]/g,'')
};

//计算中心存储录像文件大小
cms.playback.fileLength = function(len){
    return parseInt(len/1024/1024*1000)/1000;
};

cms.playback.showFileStat = function(str){
    $('#prompt').css('padding', '0 5px');
    $('#prompt').html(str);
};

cms.playback.showPrompt = function(str){
    if(str.equals(string.empty)){
        $('#divPrompt').hide();
    } else {
        $('#divPrompt').html(str);
        $('#divPrompt').show();    
    }
};

cms.playback.setSearchButtonDisabled = function(disabled){
    cms.playback.btnSearch.disabled = disabled;
    return true;
};

cms.playback.setRowSelected = function(row){
    if(cms.playback.curRow != null){
        cms.playback.curRow.className = '';
    }
    row.className = 'trselect';    
    cms.playback.curRow = row;
    return true;
};

cms.playback.showFileListHeader = function(){
    var objHeader = cms.util.$('tbHeader');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    
    var rowData = cms.playback.buildListHeader(cms.playback.playType);
    cms.util.fillTable(row, rowData);
};

cms.playback.buildListHeader = function(playType){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '序号', style:[['width','28px']]};
    rowData[cellid++] = {html: '通道', style:[['width','28px']]};
    rowData[cellid++] = {html: '起始时间', style:[['width','120px']]};
    rowData[cellid++] = {html: '录像时长', style:[['width','55px']]};
    rowData[cellid++] = {html: '回放', style:[['width','28px']]};
    rowData[cellid++] = {html: '下载 ', style:[['width','28px']]};
    rowData[cellid++] = {html: '结束时间', style:[['width','120px']]};
    rowData[cellid++] = {html: '文件大小', style:[['width','75px']]};
    rowData[cellid++] = {html: '文件类型', style:[['width','65px']]};
    rowData[cellid++] = {html: '文件名称', style:[['width','135px']]};
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

cms.playback.setProgressBar = function(pos){
    pos = parseInt(pos, 10);
    if(pos >= 0 && pos <= 100 && cms.playback.progressBar != null){
        cms.playback.progressBar.setting(pos, false);
    }
};

cms.playback.parseFileName = function(strFileName){
	var strChannel = parseInt(strFileName.substr(2, 2), 10);
	var strFileType = strFileName.substr(4, 2);
	var strStart = cms.playback.parseTime(strFileName.substr(6, 14));
	var strEnd = cms.playback.parseTime(strFileName.substr(20, 14));
	var strLength = strFileName.substr(35);
	
	var fileLength = parseInt(strLength, 10);
	fileLength = strLength.length == 6 ? parseInt(fileLength / 1024 * 100) / 100 : fileLength / 100;

	return [strChannel, fileLength, strStart, strEnd, strFileType];
};

cms.playback.parseFileSize = function(size){
	return parseInt(size/1024/1024*1000) / 1000;
};

cms.playback.parseTime = function(strTime){
    if(strTime.length == 14){
        var strResult = '';
        var arr = strTime.split('');
        for(var i=0,c=arr.length; i<c; i++){
            strResult += arr[i];
            strResult += (i == 3 || i == 5) ? '-' : (i == 9 || i == 11 ? ':' : (i == 7 ? ' ' : ''));
        }
        return strResult;
    }
	return strTime;
};

cms.playback.calculateDuration = function(startTime, endTime){
    var ts = endTime.toDate().timeDifference(startTime.toDate())/1000;
    var h = Math.floor((ts%(24*3600))/3600);
    var m = Math.floor(ts%3600/60);
    var s = Math.round(ts%60);
    return [ts, h + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)];
};

cms.playback.calculateTimeLength = function(startTime, endTime){
    try{
        var dtStart = ('' + startTime).toDate();
        var dtEnd = ('' + endTime).toDate();
        var ts =  dtEnd - dtStart;
        
        return parseInt(ts/1000, 10);
    }catch(e){}
};

cms.playback.parseFileType = function(fileType){
    for(var i=0,c=cms.playback.arrFileType.length; i<c; i++){
        if(parseInt(fileType, 16) == parseInt(cms.playback.arrFileType[i][0], 16)){
            return cms.playback.arrFileType[i][1];
        }
    }
    return '-';
};

cms.playback.setWindowRank = function(num, btn, isCall){
    var winset = cms.util.$N("winset");
    for(var i=0; i<winset.length; i++){
        winset[i].className = winset[i].className.replace('cur', 'win');
    }
    if(btn == null){
        btn = cms.util.$('btnWinSet' + num);
    }
    if(btn != null){
        btn.className = btn.className + ' cur' + num;
    }
        
    if(isCall != undefined && !isCall){
        return false;
    }
    
    if(cms.playback.ocx != null){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Request] iRank: ' + num);
        var result = cms.ocx.setWindowRank(cms.playback.ocx, num);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Response] return: ' + cms.ocx.showErrorCode(result));
    }
    
    //当前窗口数量
    cms.playback.curWinCount = num;
    
    if(cms.playback.curWinNum >= cms.playback.curWinCount){
        cms.playback.curWinNum = 0;
    }
    
    var bEnable = cms.playback.curWinCount > 1;
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableDblClick Request] bEnable: ' + bEnable);
    //设置双击是否可用
    cms.ocx.enableDblClick(cms.playback.ocx, bEnable);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableDblClick Response] return: ' + cms.ocx.showErrorCode(result));
};

cms.playback.fullScreen = function(btn){
    if(cms.playback.ocx != null){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Request] bFull: true');
        var result = cms.ocx.setFullScreen(cms.playback.ocx, true);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Response] return: ' + cms.ocx.showErrorCode(result));
    }
};

//切换按钮图标
cms.playback.btnIconSwitch = function(btn, type){
    var cg = eval('(' + btn.lang + ')');
    var idx = 0;
    if(type != undefined){
        idx = type == cg[0][0] ? 0 : 1;
    } else {
        idx = btn.rel == cg[0][0] ? 1 : 0;
    }
    btn.rel = cg[idx][0];
    btn.className = cg[idx][1];
    btn.title = cg[idx][2];
};

//下载录像文件
cms.playback.downloadRecord = function(param){
    var result = -1;
    var strResult = '';
    var strAction = '';
    if(0 == param.playType){ //设备录像
        strAction = 'DownloadDevRecords';
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[' + strAction + ' Request]'
            + ' szDevId：' + param.szDevId + ',iChannel: ' + param.iChannel + ', szFileName: ' + param.szFileName
            + ', nOffset: ' + param.nOffset + ', nReadSize: ' + param.nReadSize + ', nTotalSize: ' + param.nTotalSize
            + ', iSaveToCenter: ' + param.iSaveToCenter + ', iDevLine: ' + param.iDevLine + ', 备注：下载设备录像文件');
        result = cms.ocx.downloadDevRecords(cms.playback.ocx, param.szDevId, param.iChannel, param. szFileName, 
            param.nOffset, param.nReadSize, param.nTotalSize, param.iSaveToCenter, param.iDevLine);   
    } else if(1 == param.playType){ //中心录像
        strAction = 'DownloadCentralRecords';
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[' + strAction + ' Request]'
            + ' szDevId：' + param.szDevId + ',iChannel: ' + param.iChannel + ', szBeginTime: ' + param.szBeginTime
            + ', szEndTime: ' + param.szEndTime + ', iRecFlag: ' + param.iRecFlag + ', nTotalSize: ' + param.nTotalSize
            + ', 备注：下载中心录像文件');
        result = cms.ocx.downloadCentralRecords(cms.playback.ocx, param.szDevId, param.iChannel, param.szBeginTime,
            param.szEndTime, param.iRecFlag, param.nTotalSize); 
    }
    
    if(result >= 0){
        strResult = '%s, 备注：%s'.format([result, '开始下载'], '%s');
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[' + strAction + ' Response] return: ' + strResult);
        
        cms.playback.arrDownloadHandle.push({
            handle:result, status:0, progress:0, fileName: param.szFileName, fileSize: param.nTotalSize,
            isShow: false, isCancel: false
        });
        
        cms.playback.showDownloadList();
    } else if(-1 == result){
        strResult = '%s, 备注：%s'.format([result, '下载失败'], '%s');
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[' + strAction + ' Response] return: ' + strResult);
        
        cms.box.alert({title:'提示信息' + cms.box.buildIframe(600,450, true),html:'录像文件下载失败'});
    }
};

cms.playback.stopDownloadConfirm = function(iDownloadHandle){
    var config = {
        id: 'pwDownloadCancelConfirm',
        title: '提示信息' + cms.box.buildIframe(600,450, true),
        html: '确定要取消下载吗？',
        callBack: cms.playback.stopDownloadConfirmCallBack,
        returnValue:{
            iDownloadHandle: iDownloadHandle
        }
    };
    cms.box.confirm(config);
};

cms.playback.stopDownloadConfirmCallBack = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        iDownloadHandle = pwReturn.returnValue.iDownloadHandle;
        cms.playback.stopDownload(iDownloadHandle, true);
    }
    pwobj.Hide();
};

//停止录像下载
cms.playback.stopDownload = function(iDownloadHandle, isAction){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopDownload Request]'
        + ' iDownloadHandle：' + iDownloadHandle + ', 备注：停止录像文件下载');
    var result = cms.ocx.stopDownload(cms.playback.ocx, iDownloadHandle);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopDownload Response] return: ' + cms.ocx.showErrorCode(result));
    if(0 == result){
        if(isAction){
            var objStatus = cms.util.$('lblDownloadStatus_' + iDownloadHandle);
            var objOper = cms.util.$('lblDownloadOper_' + iDownloadHandle);
            
            objStatus.innerHTML = '已取消';
            objOper.innerHTML = '<a onclick="cms.playback.deleteDownloadListRow(' + iDownloadHandle + ');" title="删除行">×</a>';
        }
        
        for(var i=0,c=cms.playback.arrDownloadHandle.length; i<c; i++){
            if(cms.playback.arrDownloadHandle[i].handle == iDownloadHandle){
                cms.playback.arrDownloadHandle[i].isCancel = true;
                break;
            }
        }
    }
};

//获得录像下载进度
cms.playback.getDownloadProgress = function(iDownloadHandle){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetDownloadProgress Request]'
        + ' iDownloadHandle：' + iDownloadHandle + ', 备注：获取录像文件下载进度');
    var result = cms.ocx.getDownloadProgress(cms.playback.ocx, iDownloadHandle);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetDownloadProgress Response] return: ' + result);
    return result;
};

cms.playback.showDownloadList = function(){
    if(cms.playback.pwDownload != null){
        cms.playback.pwDownload.Show();
    } else {
        var size = [420, 200];
        var strHtml = '<div class="listheader">'
            + '<table class="tbheader" cellpadding="0" cellspacing="0">'
            + '<tr>'
            + '<td style="width:25px;">序号</td>'
            + '<td style="width:125px;">文件名称</td>'
            + '<td style="width:70px;">文件大小</td>'
            + '<td style="width:55px;">下载进度</td>'
            + '<td style="width:55px;">状态</td>'
            + '<td style="width:50px;">操作</td>'
            + '<td></td>'
            + '</tr>'
            + '</table>'
            + '</div>'
            + '<div class="list" style="height:' + (size[1]- 25*2) + 'px;">'
            + '<table class="tblist" cellpadding="0" cellspacing="0" id="tbDownloadList"></table>'
            + '</div>';
        var config = {
            id: 'pwDownload',
            title: '录像文件下载' + cms.box.buildIframe(size[0], size[1], true),
            html: strHtml,
            width: size[0],
            height: size[1],
            minAble: true,
            showMinMax: true,
            noBottom: true,
            lock: false,
            position: 7
        };  
        cms.playback.pwDownload = cms.box.win(config);
    }
    
    cms.playback.buildDownloadList();
};

cms.playback.buildDownloadList = function(){
    var len = cms.playback.arrDownloadHandle.length;
    if(0 == len){
        return false;
    }
    var objList = cms.util.$('tbDownloadList');
    
    for(var i = len-1; i>=0; i--){
        var dr = cms.playback.arrDownloadHandle[i];
        if(dr.isShow){
            continue;
        }
        var row = objList.insertRow(cms.playback.downloadListRowId);
        var rowData = [];
        var cellid = 0;
        var strOper = '<div id="lblDownloadOper_' + dr.handle + '">'
            + '<a class="btn btnc22 w35" style="margin-left:5px;" onclick="cms.playback.stopDownloadConfirm(' + dr.handle + ');">'
            + '<span class="w30">取消</span>'
            + '</a>'
            + '</div>';
        
        rowData[cellid++] = {html: '<span id="lblDownloadRow_' + dr.handle + '">' + (cms.playback.downloadListRowId+1) + '</span>', style:[['width','25px']]};
        rowData[cellid++] = {html: dr.fileName, style:[['width','125px']]};
        rowData[cellid++] = {html: cms.playback.fileLength(dr.fileSize) + ' MB', style:[['width','70px']]};
        rowData[cellid++] = {html: '<span id="lblDownloadProgress_' + dr.handle + '"></span>', style:[['width','55px']]};
        rowData[cellid++] = {html: '<span id="lblDownloadStatus_' + dr.handle + '">正在下载</span>', style:[['width','55px']]}
        rowData[cellid++] = {html: strOper, style:[['width','50px']]};
        rowData[cellid++] = {html: '<input type="hidden" name="txtDownloadListRow" id="txtDownloadListRow_' + dr.handle + '" value="' + cms.playback.downloadListRowId + '" lang="' + dr.handle + '" />'};
        
        cms.util.fillTable(row, rowData);
        
        cms.playback.arrDownloadHandle[i].isShow = true;
        
        cms.playback.downloadListRowId++;
    }
    
    cms.playback.showDownloadProgress();
};

cms.playback.deleteDownloadListRow = function(handle){
    var rid = parseInt(cms.util.$('txtDownloadListRow_' + handle).value.trim(), 10);
    var objList = cms.util.$('tbDownloadList');
    cms.util.removeDataRow(objList, rid);
    cms.playback.downloadListRowId--;
    
    var arr = cms.util.$N('txtDownloadListRow');
    for(var i=0,c=arr.length; i<c; i++){
        var id = parseInt(arr[i].value.trim(), 10);
        if(id > rid){
            arr[i].value = (id - 1);
            if(cms.util.$('lblDownloadRow_' + arr[i].lang) != null){
                cms.util.$('lblDownloadRow_' + arr[i].lang).innerHTML = id;
            }
        }
    }
};

cms.playback.showDownloadProgress = function(){    
    if(cms.playback.downloadProgressTimer != null){
        clearTimeout(cms.playback.downloadProgressTimer);
    }
    var len = cms.playback.arrDownloadHandle.length;
    if(0 == len){
        return false;
    }
    var count = len;
    for(var i=0; i<len; i++){
        var dr = cms.playback.arrDownloadHandle[i];
        var handle = dr.handle;
        if(dr.progress >= 100 || dr.isCancel){
            count--;
            continue;
        }
        var progress = cms.playback.getDownloadProgress(handle);
        var objProgress = cms.util.$('lblDownloadProgress_' + handle);
        var objStatus = cms.util.$('lblDownloadStatus_' + handle);
        var objOper = cms.util.$('lblDownloadOper_' + handle);
        
        if(progress >= 100){
            objProgress.innerHTML = '%s %'.format(100, '%s');
            objStatus.innerHTML = '下载完成';
            objOper.innerHTML = '<a onclick="cms.playback.deleteDownloadListRow(' + handle + ');" title="删除行">×</a>';
            
            //下载完成，关闭下载句柄，但不改变下载状态
            cms.playback.stopDownload(handle, false);
        } else {
            objProgress.innerHTML = '%s %'.format(progress, '%s');
        }
    }
    if(count > 0){
        cms.playback.downloadProgressTimer = window.setTimeout(cms.playback.showDownloadProgress, 1000);
    }
};

/*控件事件*/
/*
    窗口选择状态改变事件
    参数:
    iNew: 当前选择的窗口
    iOld: 上一次选择的窗口
*/
cms.playback.onWindowChanged = function(iNew, iOld){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnMonitorSelChanged Event] iNew: ' + iNew + ', iOld: ' + iOld);   
    if(iNew >= 0 && iNew < cms.playback.maxWinCount){
        //alert('当前选择窗口：' + num);
        //cms.playback.curWinNum = parseInt(iNew, 10);
    }
};

/*
    播放状态事件
    参数:
    iWnd: 播放窗口ID
    szDevId: 播放设备ID
    iChannel: 播放设备通道
    iStatus: 播放状态, 1-开始;2-成功;3-出错;4-停止
    iError: 播放失败时的错误码
*/
cms.playback.onPlayStatus = function(iWnd, szDevId, iChannel, iStatus, iError){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnPlayStatus Event] iWnd: ' + iWnd + ', szDevId: ' + szDevId + ', iChannel: ' + iChannel + ', iStatus:' + iStatus + ', iError:' + iError);
    
    if(iStatus != 0){
        //播放失败
    }
};

/*
    设备上下线消息事件
*/
cms.playback.onNotify = function(szPuid, iStatus){
    if(!cms.playback.isDisposeOcxDevOnOffEvent) return false;
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnNotify Event] szPuid: ' + szPuid + ', iStatus: ' + iStatus);
    if(0 == iStatus){
        cms.playback.showPlayStatusPrompt('设备(' + szPuid + ') 离线');
    }
};

/*
    GPS消息事件
*/
cms.playback.onGpsInfo = function(szGpsinfo){
    if(!cms.playback.isDisposeOcxGpsEvent) return false;
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnGpsinfo Event] szGpsinfo: ' + szGpsinfo);
};

/*
    报警消息事件
*/
cms.playback.onAlarmInfo = function(szAlarmInfo){
    if(!cms.playback.isDisposeOcxAlarmEvent) return false;
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnAlarmInfo Event] szAlarmInfo: ' + szAlarmInfo);
};