cms.playback = cms.playback || {};

var paddingTop = 1;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 400;
var rightWidth = 0;
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
cms.playback.searchFormPanelH = 120;
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

cms.playback.previewOcx = null;
//当前选中窗口
cms.playback.curWinNum = 0;
//最大窗口数量
cms.playback.maxWinCount = 36;
//当前窗口数量
cms.playback.curWinCount = 1;
//播放窗口与设备记录
cms.playback.arrWinDev = [];

//播放类型 0-设备录像，1-中心存储，2-备份录像
cms.playback.playType = 0;

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
cms.playback.recordFileIndex = 0;
cms.playback.continuous = false;

//服务器连接
cms.playback.htServerConnect = new cms.util.Hashtable();

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    module.showOcxDebugBox();
    module.hideOcxDebugBox();
    
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', false, leftWidth, '3');
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', false, true, true, false, true, '3,4');
    
    setBodySize();

    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: shortcutKeyAction});
    
    //初始化OCX控件
    initialOcx();
});

$(window).unload(function(){
     if(cms.playback.timer != null){
        //清除定时器
        clearInterval(cms.playback.timer);
    }
    if(cms.playback.previewOcx != null){
        cms.ocx.stopAll(cms.playback.previewOcx);
        cms.ocx.logout(cms.playback.previewOcx);
    }
});

$(window).resize(function(){
    if(cms.frame.resize++ == 0){
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
};

var initialOcx = function(){
    //获取OCX控件
    cms.playback.previewOcx = cms.util.$('WMPOCX');
    
    if(cms.playback.previewOcx != null){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Request] iRank: ' + cms.playback.curWinCount);
        var result = cms.ocx.setWindowRank(cms.playback.previewOcx, cms.playback.curWinCount);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Response] return: ' + cms.ocx.showErrorCode(result));
        
        if(1 == cms.playback.curWinCount){
            //设置双击是否可用
            cms.ocx.enableDblClick(cms.playback.previewOcx, false);
        }
        
        //启用控件右键菜单
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableContextMenu Request] bEnable: false');
        result = cms.ocx.enableContextMenu(cms.playback.previewOcx, false);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableContextMenu Response] return: ' + cms.ocx.showErrorCode(result));
    }
    
    initialProgressBar();
};

var shortcutKeyAction = function(keyCode){
    switch(keyCode){
        case 81:
            if(cms.playback.previewOcx != null){
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[IsFullScreen Request]');
                var isFull = cms.ocx.isFullScreen(cms.playback.previewOcx);
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[IsFullScreen Response] return: ' + isFull);
                
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Request] bFull: ' + !isFull);
                var result = cms.ocx.setFullScreen(cms.playback.previewOcx, !isFull);
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Response] return: ' + cms.ocx.showErrorCode(result));
            }
            break;
    }
};

var initialProgressBar = function(){
    var strHtml = '<div id="playbackProgress" style="float:left;padding:0;margin:0;height:15px;"></div><input type="hidden" id="txtPlaybackProgress" readonly="readonly" class="txt w20" style="float:left;" />';
    $('#progressbar').html(strHtml);
    
    cms.playback.progressBar = new ProgressBar(cms.util.$('playbackProgress'),
        {
            id:'playbackProgress', width:boxSize.width - 14, min:0, defaultValue:0, title:'回放进度',showPercent:true, max:100, limit:{},border:'none',
            callBack:setPlayBackProgress, returnValue:'txtPlaybackProgress'
        }
    );
};

var changeProgressBarSize = function(){
    if(cms.playback.progressBar != null){
        var val = parseInt($('#txtPlaybackProgress').val(), 10);
        cms.playback.progressBar.changeSize(boxSize.width - 14, val);
    }
};

var setPlayBackProgress = function(num, objId){
    var obj = cms.util.$(objId);
    obj.value = num;
    var percent = parseInt(num);
    if(cms.playback.playType == cms.playback.arrPlayType[0][0]){
        if(!cms.playback.fileName.equals('') && cms.playback.isPlayBack){
            cms.playback.startPlayBack(cms.playback.serverIp, cms.playback.serverPort, cms.playback.curDevCode, cms.playback.fileName, percent);
        }
    } else if(cms.playback.playType == cms.playback.arrPlayType[1][0]){
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
            cms.playback.startStorePlayBack(cms.playback.storeServerIp, cms.playback.storeServerPort, cms.playback.curDevCode, cms.playback.channelNo,
               fileType , dtStart.toString('yyyy-MM-dd HH:mm:ss'), endTime, dataSize, true);
        }
    }
};

cms.playback.setProgressBar = function(pos){
    pos = parseInt(pos, 10);
    if(pos >= 0 && pos <= 100 && cms.playback.progressBar != null){
        cms.playback.progressBar.setting(pos, false);
    }
};

var setBodySize = function(){
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
};

var setBoxSize = function(){
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
    $('.listbox .list').height(boxSize.height - cms.playback.searchFormPanelH - 25 - 23 - 26 - treeHeight);
    $('.listbox .tbheader').width(listBoxMinWidth);
    $('.listbox .tblist').width(listBoxMinWidth - scrollBarWidth);  
};


var setLeftDisplay = function(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var treeAction = function(param){
    switch(param.type){
        case 'device':
            /*
            $('#txtDevName').attr('value', param.devName);
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            cms.playback.curDevCode = param.devCode;
            
            alert('双击播放视频：' + param.devCode + ',' + param.devName);
            */
            break;
        case 'camera':
            $('#txtDevName').attr('value', param.devName);
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            $('#txtDevId').attr('value', param.devId);
            $('#txtChannelNo').attr('value', param.channelNo);
            
            cms.playback.curDevCode = param.devCode;
            cms.playback.channelNo = param.channelNo;
            
            cms.playback.devVedioPreview(param.devId, param);
            break;
    }
};


var searchFile = function(btn){
    if(cms.playback.curDevCode.equals(string.empty)){
        var strHtml = '请选择要录像回放的设备通道。<br />双击“设备通道”中的设备监控通道名称。' + cms.box.buildIframe(600,300,true);
        cms.box.alert({id: 'pwerror', title: '提示信息', html: strHtml});
        return false;
    }
    var devName = $('#txtDevName').val();
    var playType = $('#ddlPlayType').val();
    var fileType = $('#ddlFileType').val();
    var startTime = $('#txtStartTime').val();
    var endTime = $('#txtEndTime').val();
    
    cms.playback.btnSearch = btn;
    
    //保存当前录像回放类型
    cms.playback.playType = playType;
    
	cms.playback.showPrompt('正在搜索文件，请稍候...');
	cms.playback.showFileStat('');
    cms.playback.clearListContent();
	
	cms.playback.showFileListHeader();
	
    if(cms.playback.setSearchButtonDisabled(true)){
        if(cms.playback.playType == cms.playback.arrPlayType[0][0]){
	        //延时10毫秒 执行搜索，因搜索文件时浏览器会卡死，先显示提示信息再加载
	         if(cms.playback.login(cms.playback.cagServerIp, cms.playback.cagServerPort, loginUser.userName, loginUser.userPwd, loginUser.loginLineCode, loginUser.timeLimitedPlay)){
	            window.setTimeout(cms.playback.queryDeviceRecords, 10, cms.playback.curDevCode, cms.playback.channelNo, fileType, 0, 10,startTime, endTime);
            }
	    } else if(cms.playback.playType == cms.playback.arrPlayType[1][0]){
	        cms.playback.queryCentralRecords(cms.playback.curDevCode, cms.playback.channelNo, fileType, 0, 10, startTime, endTime);
	    }
	}
};

cms.playback.setWindowRank = function(num, btn){
    var winset = cms.util.$N("winset");
    for(var i=0; i<winset.length; i++){
        winset[i].className = winset[i].className.replace('cur', 'win');
    }
    btn.className = btn.className + ' cur' + num;
    
    if(cms.playback.previewOcx != null){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Request] iRank: ' + num);
        var result = cms.ocx.setWindowRank(cms.playback.previewOcx, num);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Response] return: ' + cms.ocx.showErrorCode(result));
    }
    
    //当前窗口数量
    cms.playback.curWinCount = num;
    
    if(cms.playback.curWinNum >= cms.playback.curWinCount){
        cms.playback.curWinNum = 0;
    }
    cms.ocx.setWindowSelect(cms.playback.previewOcx, cms.playback.curWinNum);

    var bEnable = cms.playback.curWinCount > 1;
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableDblClick Request] bEnable: ' + bEnable);
    //设置双击是否可用
    cms.ocx.enableDblClick(cms.playback.previewOcx, bEnable);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableDblClick Response] return: ' + cms.ocx.showErrorCode(result));
};

cms.playback.fullScreen = function(btn){
    if(cms.playback.previewOcx != null){
        var isFull = cms.ocx.isFullScreen(cms.playback.previewOcx);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Request] bFull: ' + !isFull);
        var result = cms.ocx.setFullScreen(cms.playback.previewOcx, !isFull);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Response] return: ' + cms.ocx.showErrorCode(result));
    }
};

cms.playback.setScreenAdaption = function(btn){
    cms.playback.btnIconSwitch(btn);
    
    //屏幕自适应/居中设置
    
};

cms.playback.setStreamControl = function(btn){
    cms.playback.btnIconSwitch(btn);
    
    //实时性/流畅性设置

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
        + '<a name="allstop" class="winset allstop" title="全部停止回放" onclick="cms.playback.stopAllPlayBack();">全部停止回放</a>'
        + '<a name="stop" class="winset stop" title="停止回放" onclick="cms.playback.stopPlayBack();">停止回放</a>'
        /*
        + '<a name="screen-switch" class="winset screen-stretch" title="自适应" onclick="cms.playback.setScreenAdaption(this);" '
        + ' rel="stretch" lang="[[\'stretch\',\'winset screen-stretch\',\'自适应\'],[\'center\',\'winset screen-center\',\'充满窗口\']]">自适应</a>'
        */
        + (cms.playback.isDebug ? '<a name="windebug" class="winset debug" title="调试" onclick="module.showOcxDebugBox();" style="margin-left:10px;">OCX控件接口调试</a>' : '')
        + '</div>'
        + '<div class="win-set-panel">'
        /*
        + '<a name="winset" class="winset cur1" onclick="cms.playback.setChanMode(1, this);" title="一画面">1画面</a>'
        + '<a name="winset" class="winset win4" onclick="cms.playback.setChanMode(4, this);" title="四画面">4画面</a>'
        */
        + '<a name="winmax" class="winset winmax" title="切换为全屏&#10;按Esc键退出全屏" onclick="cms.playback.fullScreen(this);">切换为全屏</a>';
        + '</div>';
    return strHtml;
};

cms.playback.devVedioPreview = function(devId, param){
    var urlparam = 'action=getDevPreviewParam&devId=' + devId + '&channelNo=' + param.channelNo + '&loginLineId=' + loginUser.loginLineId;
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
                if(dev.serverIp.equals('')){
                    var strHtml = '设备没有配置服务器信息，请到后台管理先配置设备服务器信息' + cms.box.buildIframe(600,300,true);
                    cms.box.alert({id: 'pwerror', title: '错误信息', html: strHtml});
                    return false;
                } else {
                    var camera = jsondata.camera;
                    cms.playback.curDevCode = param.devCode;
                    cms.playback.channelNo = parseInt(param.channelNo, 10);
                    cms.playback.devId = devId;
                    cms.playback.cagServerIp = dev.cagServerIp;
                    cms.playback.cagServerPort = dev.cagServerPort;
                    cms.playback.serverLineId = dev.serverLineId;
                    cms.playback.serverLineCode = dev.serverLineCode;
                    cms.playback.storeServerIp = dev.storeServerIp;
                    cms.playback.storeServerPort = dev.storeServerPort;
                }
            }
        }
    });

};

cms.playback.login = function(serverIp, serverPort, userName, userPwd, loginLineCode, timeLimitedPlay){
    var strServer = serverIp + ':' + serverPort;
    //var strServer = 'ServerPort';
    if(!cms.playback.htServerConnect.contains(strServer)){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Login Request] szWmpIp: ' + serverIp + ', nWmpPort: ' + serverPort
            + ', szUser: ' + userName + ', szPwd: ' + userPwd + ', iLine:' + loginLineCode + ', nPlayLimit:' + timeLimitedPlay);
        try{
            result = cms.ocx.login(cms.playback.previewOcx, serverIp, serverPort, userName, userPwd, loginLineCode, timeLimitedPlay);
        }catch(e){
            module.showOcxError(e, 'OCX登录失败');
        }
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Login Response] return: ' + cms.ocx.showErrorCode(result));
        
        if(0 == result){
            cms.playback.htServerConnect.add(strServer);
            return true;
        } else {
            cms.box.alert({title:'提示信息' + cms.box.buildIframe(600, 400, true),html:'服务器（' + serverIp + ':' + serverPort + '）连接失败，请检查服务器是否运行。'});
            return false;
        }
    }
    return true;
};

cms.playback.queryDeviceRecords = function(devCode, channelNo, fileType, iOffset, iLimited, startTime, endTime){
    try{
        var result = '';
        
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[QueryDevRecords Request] szDeviceId: ' 
            + devCode + ', iChannel: ' + channelNo + ', iFileType: ' + fileType + ', iOffset: ' + iOffset 
            + ', iLimited: ' + iLimited + ', szBeginTime: ' + startTime + ', szEndTime: ' + endTime);
        var strJson = cms.ocx.queryDevRecords(cms.playback.previewOcx, devCode, channelNo, fileType, iOffset, iLimited,  startTime, endTime);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[QueryDevRecords Response] return: ' + strJson);
        cms.playback.showDeviceRecords(strJson);
    }
    catch(e){
	    cms.playback.showPrompt('搜索录像出错' + '<br />' + e);
	}
    cms.playback.setSearchButtonDisabled(false);
};

cms.playback.queryCentralRecords = function(devCode, channelNo, fileType, iOffset, iLimited, startTime, endTime){
    try{
        var result = '';
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[QueryCentralRecords Request] szDeviceId: ' 
            + devCode + ', iChannelId: ' + channelNo + ', nRecFlag: ' + fileType + ', iOffset: ' + iOffset 
            + ', iLimited: ' + iLimited + ', szBeginTime: ' + startTime + ', szEndTime: ' + endTime);
        var strJson = cms.ocx.queryCentralRecords(cms.playback.previewOcx, devCode, channelNo, fileType, iOffset, iLimited, startTime, endTime);

        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[QueryCentralRecords Response] return: ' + strJson);
        cms.playback.showCentralRecords(strJson);
    }
    catch(e){
	    cms.playback.showPrompt('搜索录像出错' + '<br />' + e);
	}    
    cms.playback.setSearchButtonDisabled(false);
};

cms.playback.showDeviceRecords = function(strParams){
    var devName = $('#txtDevName').val();
    if('' == strParams || !strParams.isJsonData()){
	    cms.playback.showPrompt('没有搜索到相关的录像文件');
        cms.playback.clearListContent();
	    cms.playback.showFileStat('设备“' + devName + '” 共搜索到 0 个录像文件');
        return false;
    }
    
    var jsonParam = eval('(' + strParams + ')');
    if(jsonParam.result != undefined && jsonParam.result != 0){ 
        cms.playback.showPrompt('没有搜索到相关的录像文件<br />错误码：' + jsonParam.result + '<br />错误描述：' + jsonParam.msg);
        return false;
    }
    if(jsonParam.params == undefined){
	    cms.playback.showPrompt('没有搜索到相关的录像文件');
        cms.playback.clearListContent();
	    cms.playback.showFileStat('设备“' + devName + '” 共搜索到 0 个录像文件');
        return false;    
    }
    var arrFile = jsonParam.params;
    var count = arrFile.length;
    
    if(count <= 0){
	    cms.playback.showPrompt('没有搜索到相关的录像文件');
        cms.playback.clearListContent();
	    cms.playback.showFileStat('设备“' + devName + '” 共搜索到 0 个录像文件');
        return false;
    }
    cms.playback.showDeviceRecordListContent(arrFile);
    cms.playback.showPrompt('');
    cms.playback.showFileStat('设备“' + devName + '” 共搜索到 ' + count + ' 个录像文件');
    	
};

cms.playback.showCentralRecords = function(strJson){
    var devName = $('#txtDevName').val();
    try{
        if(strJson == ''){
		    //没有搜索到录像文件
		    cms.playback.showPrompt('没有搜索到相关的录像文件');
            cms.playback.clearListContent();
		    cms.playback.showFileStat('设备“' + devName + '” 共搜索到 0 个录像文件');
		    return false;
        }		
		var jsonParam = eval('(' + strJson + ')');
        if(jsonParam.result != undefined && jsonParam.result != 0){ 
	        cms.playback.showPrompt('没有搜索到相关的录像文件<br />错误码：' + jsonParam.result + '<br />错误描述：' + jsonParam.msg);
            return false;
        }
		var count = jsonParam.length;
		if(count > 0){
		    cms.playback.showCentralRecordListContent(jsonParam);
		    cms.playback.showPrompt('');
		    cms.playback.showFileStat('设备“' + devName + '” 共搜索到 ' + count + ' 个录像文件');
		} else {
		    //没有搜索到录像文件
		    cms.playback.showPrompt('没有搜索到相关的录像文件');
            cms.playback.clearListContent();
		    cms.playback.showFileStat('设备“' + devName + '” 共搜索到 0 个录像文件');
		}
	}
	catch(e){
	    //没有搜索到录像文件
	    cms.playback.showPrompt('没有搜索到相关的录像文件' + '<br />' + e);
        cms.playback.clearListContent();
		cms.playback.showFileStat('设备“' + devName + '” 共搜索到 0 个录像文件');
	}	
};

cms.playback.showCentralRecordListContent = function(fileList){
    var objList = cms.util.$('tbList');
    var rid = 0;
    var dataCount = fileList.length;
    var rowData = [];
    
    cms.util.clearDataRow(objList, 0);
    
    //清空录像文件列表
    cms.playback.arrRecordFile.length = 0;
    
    //for(var i = dataCount-1; i>=0; i--){
    for(var i = 0,c=dataCount; i<c; i++){
        var dr = fileList[i];
        var row = objList.insertRow(rid);
        var rnum = rid + 1;
               
        rowData = cms.playback.buildStoreListContent(row, dr, rnum);
            
        cms.util.fillTable(row, rowData);
        
        rowData = null;
        
        rid++;
        
        cms.playback.arrRecordFile.push(dr);
    }
};

cms.playback.buildStoreListContent = function(row, dr, rid){
    var rowData = [];
    var cellid = 0;
	var strFileName = '';
	//var fileInfo = cms.playback.parseFileName(strFileName);
	var strFileType = cms.playback.parseFileType(dr.rev_flag);
	var arrDuration = cms.playback.calculateDuration(dr.begin_time, dr.end_time);
	var strPlayBack = '<a class="playback" title="单击回放录像" id="btnPlayBack_' + (rid - 1) + '" '
	    + 'onclick="startStorePlayBack(this, \'' + cms.playback.storeServerIp + '\',' + cms.playback.storeServerPort + ','
	    + '\'' + cms.playback.curDevCode + '\',' + cms.playback.channelNo + ',' + dr.rev_flag + ',\'' + dr.begin_time + '\',\'' + dr.end_time + '\',' + (rid-1) + ');"'
	    + '></a>';
	var strFilePath = cms.util.getSystemDir() + ':\\\\Zyrh\\\\RecordFiles\\\\';// + cms.playback.curDevCode + '_' + cms.playback.channelNo + '_' 
	    //+ cms.playback.cleanTimeFormat(dr.begin_time) + '_' + cms.playback.cleanTimeFormat(dr.end_time) + '.mp4';
	var strDownload = '<a class="download" title="单击下载录像文件" '
	    + 'onclick="cms.playback.downloadRecordFile(\'' + cms.playback.storeServerIp + '\',' + cms.playback.storeServerPort + ','
	    + '\'' + cms.playback.curDevCode + '\',' + cms.playback.channelNo + ',' + dr.rev_flag + ',\'' + dr.begin_time + '\',\'' + dr.end_time + '\','
	    + '\'' + strFilePath + '\');"'
	    + '></a>';

    var strParam = "{fileName:'" + strFileName + "'}";

    rowData[cellid++] = {html: rid, style:[['width','28px']]}; //序号
    rowData[cellid++] = {html: cms.playback.channelNo, style:[['width','28px']]}; //通道
    rowData[cellid++] = {html: cms.playback.fileLength(dr.rec_len) + ' MB', style:[['width','75px']]}; //文件大小
    rowData[cellid++] = {html: strPlayBack, style:[['width','28px']]}; //回放按钮
    //rowData[cellid++] = {html: strDownload, style:[['width','28px']]}; //下载按钮
    rowData[cellid++] = {html: dr.begin_time, style:[['width','120px']]}; //起始时间
    rowData[cellid++] = {html: dr.end_time, style:[['width','120px']]}; //结束时间
    rowData[cellid++] = {html: cms.util.fixedCellWidth(strFileType, 65, true, strFileType), style:[['width','65px']]}; //文件类型
    rowData[cellid++] = {html: arrDuration[1], style:[['width','55px']]}; //录像时长
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

cms.playback.downloadRecordFile = function(serverIp, serverPort, devCode, channelNo, fileType, startTime, endTime, filePath){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[DownloadRecord Request] szIp: ' + serverIp + ', nPort: ' + serverPort + ', szDevId: ' 
        + devCode + ', nCameraId: ' + channelNo + ', nRecFlag: ' + fileType + ', szBeginTime: ' + startTime + ', szEndTime: ' + endTime
        + ', szPath: ' + filePath);
    var result = cms.record.downloadFile(cms.playback.previewOcx, serverIp, serverPort, devCode, channelNo, fileType, startTime, endTime, filePath);
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[DownloadRecord Response] result: ' + result);
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
    
    if(0 == playType){
        rowData[cellid++] = {html: '序号', style:[['width','28px']]};
        rowData[cellid++] = {html: '通道', style:[['width','28px']]};
        rowData[cellid++] = {html: '文件大小', style:[['width','75px']]};
        rowData[cellid++] = {html: '回放', style:[['width','28px']]};
        rowData[cellid++] = {html: '起始时间', style:[['width','120px']]};
        rowData[cellid++] = {html: '结束时间', style:[['width','120px']]};
        rowData[cellid++] = {html: '文件类型', style:[['width','65px']]};
        rowData[cellid++] = {html: '文件名称', style:[['width','135px']]};
        rowData[cellid++] = {html: '录像时长', style:[['width','55px']]};
        rowData[cellid++] = {html: '', style:[]}; //空
    } else {
        rowData[cellid++] = {html: '序号', style:[['width','28px']]};
        rowData[cellid++] = {html: '通道', style:[['width','28px']]};
        rowData[cellid++] = {html: '文件大小', style:[['width','75px']]};
        rowData[cellid++] = {html: '回放', style:[['width','28px']]};
        //rowData[cellid++] = {html: '下载 ', style:[['width','28px']]};
        rowData[cellid++] = {html: '起始时间', style:[['width','120px']]};
        rowData[cellid++] = {html: '结束时间', style:[['width','120px']]};
        rowData[cellid++] = {html: '文件类型', style:[['width','65px']]};
        rowData[cellid++] = {html: '录像时长', style:[['width','55px']]};
        rowData[cellid++] = {html: '', style:[]}; //空    
    }
    
    return rowData;
};

cms.playback.clearListContent = function(){
    var objList = cms.util.$('tbList');
    cms.util.clearDataRow(objList, 0);
};

cms.playback.showDeviceRecordListContent = function(arrFile){
    var objList = cms.util.$('tbList');
    var rid = 0;
    var dataCount = arrFile.length;
    var rowData = [];
    
    cms.util.clearDataRow(objList, 0);
    
    for(var i = dataCount-1; i>=0; i--){
        var dr = arrFile[i];
        var row = objList.insertRow(rid);
        var rnum = rid + 1;
               
        rowData = cms.playback.buildListContent(row, dr, rnum);
            
        cms.util.fillTable(row, rowData);
        
        rowData = null;
        
        rid++;
    }
};

cms.playback.buildListContent = function(row, dr, rid){
    var rowData = [];
    var cellid = 0;
	var strFileName = dr.file_name;
	var strFileType = cms.playback.parseFileType(dr.type);
	var arrDuration = cms.playback.calculateDuration(dr.begin_time, dr.end_time);
	var strPlayBack = '<a class="playback" title="单击回放录像" '
	    + ' onclick="startPlayBack(this, \'' + strFileName + '\',' + dr.size + ');"></a>';

    var strParam = "{fileName:'" + strFileName + "'}";
        
    rowData[cellid++] = {html: rid, style:[['width','28px']]}; //序号
    rowData[cellid++] = {html: dr.channel, style:[['width','28px']]}; //通道
    rowData[cellid++] = {html: cms.playback.parseFileSize(dr.size) + ' MB', style:[['width','75px']]}; //文件大小
    rowData[cellid++] = {html: strPlayBack, style:[['width','28px']]}; //回放按钮
    rowData[cellid++] = {html: dr.begin_time, style:[['width','120px']]}; //起始时间
    rowData[cellid++] = {html: dr.end_time, style:[['width','120px']]}; //结束时间
    rowData[cellid++] = {html: cms.util.fixedCellWidth(strFileType, 65, true, strFileType), style:[['width','65px']]}; //文件类型
    rowData[cellid++] = {html: strFileName, style:[['width','135px']]}; //文件名称
    rowData[cellid++] = {html: arrDuration[1], style:[['width','55px']]}; //录像时长
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

//单击回放按钮进行回放
var startPlayBack = function(obj, strFileName, fileSize){
    var tr = obj.parentNode.parentNode;
    //设置回放按钮所在行为选中行
    if(cms.playback.setRowSelected(tr)){
        window.setTimeout(cms.playback.startPlayBack, 100, 
            cms.playback.curDevCode, 1, strFileName, 0, 0, fileSize, 1, 1);
    }
};

var startStorePlayBack = function(obj, devCode, channelNo, fileType, startTime, endTime, idx){
    cms.playback.recordFileIndex = idx;
    
    var tr = obj.parentNode.parentNode;
    //设置回放按钮所在行为选中行
    if(cms.playback.setRowSelected(tr)){
        window.setTimeout(cms.playback.startStorePlayBack, 100, devCode, channelNo, fileType, startTime, endTime, idx);
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

cms.playback.parseFileType = function(fileType){
    for(var i=0,c=cms.playback.arrFileType.length; i<c; i++){
        if(parseInt(fileType, 16) == parseInt(cms.playback.arrFileType[i][0], 16)){
            return cms.playback.arrFileType[i][1];
        }
    }
    return '-';
};

cms.playback.startPlayBack = function(devCode, channelNo, fileName, nOffset, nReadSize, nTotalSize, iSaveToCenter, iDevLine){
    if(cms.playback.isPlayBack){
        cms.playback.stopPlayBack();
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpPlayDevRecord Request] szDeviceId: ' + devCode + ', szFileName: ' + fileName);
    var result = cms.ocx.playDevRecord(cms.playback.previewOcx, devCode, channelNo, fileName, nOffset, nReadSize, nTotalSize, iSaveToCenter, iDevLine);
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpPlayDevRecord Response] return: ' + cms.ocx.showErrorCode(result));
    
    cms.playback.fileName = fileName;
    cms.playback.isPlayBack = true;
    
    //定时获取回放进度，并设置进度条位置
    cms.playback.timer = window.setInterval(cms.playback.getPlayBackPos, cms.playback.interval);
};

cms.playback.startStorePlayBack = function(devCode, channelNo, fileType, startTime, endTime, dataSize, dragPlay, idx){
    if(cms.playback.isPlayBack){
        cms.playback.stopPlayBack(dragPlay);
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpPlayCentralRecord Request] szDeviceId: ' 
        + devCode + ', iChannelId: ' + channelNo + ', nRecFlag: ' + fileType + ', szBeginTime: ' + startTime + ',szEndTime: ' + endTime);

    var result = cms.ocx.playCentralRecord(cms.playback.previewOcx, devCode, channelNo, fileType, startTime, endTime);
    
    if(idx == undefined){
        idx = cms.playback.recordFileIndex;
    } else {
        cms.playback.recordFileIndex = idx;
    }
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpPlayCentralRecord Response] return: ' + cms.ocx.showErrorCode(result));
    
    if(cms.playback.progressBar != null && (dragPlay == undefined || !dragPlay)){
        cms.playback.progressBar.setting(0, false);
    }
    
    cms.playback.isPlayBack = true;
    if(dragPlay == undefined || !dragPlay){
        //cms.playback.fileName = fileName;
        cms.playback.arrRecordTime.push([fileType, startTime, endTime, cms.playback.calculateTimeLength(startTime, endTime), dataSize]);
        cms.playback.lastPercent = 0;
    }
    
    //定时获取回放进度，并设置进度条位置
    //cms.playback.timer = window.setInterval(cms.playback.getPlayBackPos, cms.playback.interval);
};

cms.playback.stopPlayBack = function(dragPlay){
    if(cms.playback.playType == cms.playback.arrPlayType[0][0]){
        var serverIp = cms.playback.serverIp;
        var serverPort = cms.playback.serverPort;
        var devCode = cms.playback.curDevCode;
        
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Stop Request]');
        
        var result = cms.ocx.stop(cms.playback.previewOcx);
        
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Stop Response] return: ' + cms.ocx.showErrorCode(result));
        
        cms.playback.fileName = '';
        cms.playback.isPlayBack = false;
        
        //清除定时器
        clearInterval(cms.playback.timer);
    
    } else if(cms.playback.playType == cms.playback.arrPlayType[1][0]){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Stop Request] ');
        
        var result = cms.ocx.stop(cms.playback.previewOcx);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Stop Response] return: ' + cms.ocx.showErrorCode(result));
        
        if(dragPlay == undefined || !dragPlay){
            cms.playback.arrRecordTime.length = 0;
            cms.playback.lastPercent = 0;
        }
    }    
};

cms.playback.stopAllPlayBack = function(){    
    if(cms.playback.playType == cms.playback.arrPlayType[0][0]){
    
    } else if(cms.playback.playType == cms.playback.arrPlayType[1][0]){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopAll Request] ');
        var result = cms.ocx.stopAll(cms.playback.previewOcx);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopAll Response] return: ' + cms.ocx.showErrorCode(result));
        
        cms.playback.arrRecordTime.length = 0;
        cms.playback.lastPercent = 0;
    }
};

cms.playback.getPlayBackPos = function(){
    if(cms.playback.playType == cms.playback.arrPlayType[0][0]){        
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetDevProgress Request] iWnd: ' + cms.playback.curWinNum);
        var result = cms.ocx.getDevProgress(cms.playback.previewOcx, cms.playback.curWinNum);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[GetDevProgress Response] return: ' + cms.ocx.showErrorCode(result));    
    } else if(cms.playback.playType == cms.playback.arrPlayType[1][0]){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetCentralProgress Request] iWnd: ' + cms.playback.curWinNum);
        var result = cms.ocx.getCentralProgress(cms.playback.previewOcx, cms.playback.curWinNum);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WmpGetCentralProgress Response] return: ' + cms.ocx.showErrorCode(result));
    }
    /*
    var serverIp = cms.playback.serverIp;
    var serverPort = cms.playback.serverPort;
    var devCode = cms.playback.curDevCode;

    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WMPGetPlayBackPos Request] bstrServerIP: ' + serverIp + ', lServerPort: ' + serverPort + ', bstrDeviceID: ' + devCode);

    var result = cms.view.getPlayBackPos(cms.playback.previewOcx, serverIp, serverPort, devCode);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[WMPGetPlayBackPos Response] return: ' + cms.ocx.showErrorCode(result));
    */
    
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

cms.playback.playEvent = function(szDevId, iChannel, nRecFlag, nDataSize, szFrameTime){
    if(cms.playback.showPlayEventLog){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[PlayEvent] return: szDevId: ' + szDevId + ',iChannel: ' + iChannel + ',nRecFlag: ' + nRecFlag 
            + ',nDataSize: ' + nDataSize + ',szFrameTime: ' + szFrameTime);
    }
    cms.playback.setStoreProgressBar(nDataSize, szFrameTime);
    
    if(cms.playback.continuous && parseInt(nRecFlag, 10) == 2){
        if(cms.playback.recordFileIndex < cms.playback.arrRecordFile.length - 1){
            cms.playback.recordFileIndex++;
            var idx = cms.playback.recordFileIndex;
            var dr = cms.playback.arrRecordFile[idx];
            startStorePlayBack(cms.util.$('btnPlayBack_' + idx), cms.playback.curDevCode, cms.playback.channelNo,
                dr.rev_flag ,dr.begin_time, dr.end_time, idx);
        }
    }
};

cms.playback.setStoreProgressBar = function(dataSize, curTime){
    try{
        if('1970-01-01 08:00:00' == curTime.trim()){
            if(cms.playback.lastPercent > 80){
                cms.playback.progressBar.setting(100, false);
            } else {
                return false;
            }
        }
        var total = parseInt(cms.playback.arrRecordTime[0][3], 10);
        var cur = parseInt(cms.playback.calculateTimeLength(cms.playback.arrRecordTime[0][1], curTime), 10);
        var pos = parseInt(cur/total*100);
        cms.playback.lastPercent = pos;
        
        if(cms.playback.showPlayEventLog){
            module.appendOcxDebugInfo(module.getOcxDebugTime() + 'percent: %' + (pos < 0 ? 0 : pos > 100 ? 100 : pos));
        }
        if(pos >= 0 && pos <= 100 && cms.playback.progressBar != null){
            cms.playback.progressBar.setting(pos, false);
        }
    }catch(e){}
};

cms.playback.calculateTimeLength = function(startTime, endTime){
    try{
        var dtStart = ('' + startTime).toDate();
        var dtEnd = ('' + endTime).toDate();
        var ts =  dtEnd - dtStart;
        
        return parseInt(ts/1000, 10);
    }catch(e){}
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
        cms.playback.curWinNum = parseInt(iNew, 10);
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