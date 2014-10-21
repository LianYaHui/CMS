cms.preview = cms.preview || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 240;
var rightWidth = rightWidthConfig =  222;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//滚动条宽度
var scrollBarWidth = 18;

var treeType = 'camera';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

cms.preview.titleH = 25;
cms.preview.viewControlPanelH = 40;
cms.preview.controlPanelW = 201;
cms.preview.ptzPanelH = 225;
cms.preview.presetPanelH = 150;
cms.preview.presetBarH = 26; //预置点工具栏高度
cms.preview.videoParamPanelH = 175; //默认为最小化 25px 展开时设置为 175px
cms.preview.videoParamShow = true;
//是否已加载视频参数FORM
cms.preview.videoParamLoaded = false;
cms.preview.ptzPanelShow = true;

cms.preview.isDebug = module.checkIsDebug();

//是否记录OCX窗口选择改变事件
cms.preview.isLogOcxWindowChangedEvent = false;
//是否处理OCX GPS消息事件
cms.preview.isDisposeOcxGpsEvent = false;
//是否处理OCX 报警消息事件
cms.preview.isDisposeOcxAlarmEvent = false;
//是否处理OCX 设备上下线消息事件
cms.preview.isDisposeOcxDevOnOffEvent = true;

cms.preview.previewOcx = null;
//当前选中窗口
cms.preview.curWinNum = 0;
//当前复合流声音播放窗口，默认无
cms.preview.curPlayAudioWinNum = -1;
//最大窗口数量
cms.preview.maxWinCount = 36;
//当前窗口数量
cms.preview.curWinCount = 4;

//播放窗口与设备记录
cms.preview.arrWinDev = [];

cms.preview.curDevCode = '';

//服务器连接
cms.preview.htServerConnect = new cms.util.Hashtable();
//设备名称
cms.preview.htDeviceName = new cms.util.Hashtable();

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = 260;
    }
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    module.showOcxDebugBox();
    module.hideOcxDebugBox();
    
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth, '3');
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true, true, true, false, true, '3,4');
    //定时刷新树型菜单设备状态
    tree.timer = window.setTimeout(tree.updateDevStatus, 15*1000, 15*1000);
    
    setBodySize();
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: shortcutKeyAction});
    
    //初始化OCX控件
    initialOcx();
    
    window.setTimeout(getDeviceNameList, 10*1000);
});

$(window).unload(function(){
    if(cms.preview.previewOcx !== null){
        cms.ocx.stopAll(cms.preview.previewOcx);
        cms.ocx.logout(cms.preview.previewOcx);
    }
});

$(window).resize(function(){
    if(cms.frame.resize++ === 0){
        cms.frame.setFrameSize(leftWidth, rightWidth);
    } else {
        cms.frame.setFrameSize();
    }
    setBodySize();
});

cms.preview.browser = function(){
    return '<div style="background:#333;color:#fff;height:30px;text-align:center;position:relative;top:46%;left:0%;width:auto;margin:0 auto;line-height:30px;font-size:12px;">'
        + '提示：视频预览OCX控件仅支持IE浏览器，请使用IE浏览器预览视频。</div>';
};

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    $('#bodyRightSwitch').click(function(){
        setRightDisplay($(this));
    });
    
    if(!cms.util.isMSIE){
        $('#viewbox').css('position','relative');
        $('#viewbox').html(cms.preview.browser());
    }
    
    $('#viewcontrol').html(cms.preview.buildVideoControl());
    $('#viewcontrol a').focus(function(){
        $(this).blur();
    });
    
    $('#mainTitle').append('<span id="audioPrompt" class="right-tools" style="margin:0 5px 0 0;"></span>');
    $('#mainTitle').append('<span id="recordPrompt" class="right-tools" style="margin:0 5px 0 0;"></span>');
    $('#mainTitle .title').append('<span id="winInfo"></span>');
    
    //初始化窗口监控点数据
    for(var i=0; i<cms.preview.maxWinCount; i++){
        var camera = {devCode: ''};
        cms.preview.arrWinDev.push(camera);
    }
    
    $('#paramTitle').css('cursor','pointer');
    $('#paramTitle').click(function(){
        $(this).find('a').removeClass();
        if(cms.preview.videoParamShow){
            $('#paramBox').hide();
            $(this).find('a').addClass('switch sw-close');
            cms.preview.videoParamShow = false;
        } else {
            $('#paramBox').show();
            $(this).find('a').addClass('switch sw-open');
            cms.preview.videoParamShow = true;
            //加载视频参数FORM
            if(!cms.preview.videoParamLoaded){                
                cms.videoparam.buildVideoParam();
                cms.preview.videoParamLoaded = true;
            }
        }
        setPresetPanelSize();
    });
    
    $('#ptzTitle').css('cursor','pointer');
    $('#ptzTitle').click(function(){
        $(this).find('a').removeClass();
        if(cms.preview.ptzPanelShow){
            $('#ptzBox').hide();
            $(this).find('a').addClass('switch sw-close');
            cms.preview.ptzPanelShow = false;
        } else {
            $('#ptzBox').show();
            $(this).find('a').addClass('switch sw-open');
            cms.preview.ptzPanelShow = true;
        }
        setPresetPanelSize();
    });
    cms.ptz.buildPtzForm();
    cms.ptz.buildPtzSpeed();
    
    cms.preset.buildPresetForm();
    ////暂时不加载
    //cms.videoparam.buildVideoParam();
    cms.preview.videoParamShow = false;
    
    setRightPanelSize();
};

var initialOcx = function(){
    //获取OCX控件
    cms.preview.previewOcx = cms.util.$('WMPOCX');
    
    if(cms.preview.previewOcx !== null){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Request] iRank: ' + cms.preview.curWinCount);
        var result = cms.ocx.setWindowRank(cms.preview.previewOcx, cms.preview.curWinCount);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Response] return: ' + cms.ocx.showErrorCode(result));
        
        if(1 === cms.preview.curWinCount){
            //设置双击是否可用
            cms.ocx.enableDblClick(cms.preview.previewOcx, false);
        }
    }
};

var shortcutKeyAction = function(keyCode){
    switch(keyCode){
        case 81:    //Q OCX fullscreen
            if(cms.preview.previewOcx !== null){
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[IsFullScreen Request]');
                var isFull = cms.ocx.isFullScreen(cms.preview.previewOcx);
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[IsFullScreen Response] return: ' + isFull);
                
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Request] bFull: ' + !isFull);
                var result = cms.ocx.setFullScreen(cms.preview.previewOcx, !isFull);
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Response] return: ' + cms.ocx.showErrorCode(result));
            }
            break;
    }
};

cms.preview.buildVideoControl = function(){
    var strHtml = ''
        + '<div class="win-stop-panel">'
        + '<a name="allstop" class="winset allstop" title="全部停止预览" onclick="cms.preview.stopAllPlayWin();">全部停止预览</a>'
        + '<a name="stop" class="winset stop" title="停止预览" onclick="cms.preview.stopPlayWin();">停止预览</a>'
        + '<a name="audio-switch" id="btnPlayAudio" class="winset audio-close" title="打开声音" onclick="cms.preview.setAudio(this);" '
        + ' rel="close" lang="[[\'close\',\'winset audio-close\',\'打开声音\'],[\'open\',\'winset audio-open\',\'关闭声音\']]">打开语音</a>'
        /*
        + '<a name="screen-switch" class="winset screen-stretch" title="自适应" onclick="cms.preview.setScreenAdaption(this);" '
        + ' rel="stretch" lang="[[\'stretch\',\'winset screen-stretch\',\'自适应\'],[\'center\',\'winset screen-center\',\'充满窗口\']]">自适应</a>'
        + '<a name="stream-switch" class="winset stream-realtime" title="实时性优先" onclick="cms.preview.setStreamControl(this);" '
        + ' rel="realtime" lang="[[\'realtime\',\'winset stream-realtime\',\'实时性优先\'],[\'smoothly\',\'winset stream-smoothly\',\'流畅性优先\']]">实时性优先</a>'
        */
        + (cms.preview.isDebug ? '<a name="windebug" class="winset debug" title="调试" onclick="module.showOcxDebugBox();" style="margin-left:10px;">OCX控件接口调试</a>' : '')
        + '</div>'
        + '<div class="win-set-panel">'
        + '<a name="winset" id="btnWinSet1" class="winset win1" onclick="cms.preview.setWindowRank(1, this);" title="一画面">1画面</a>'
        + '<a name="winset" id="btnWinSet4" class="winset cur4" onclick="cms.preview.setWindowRank(4, this);" title="四画面">4画面</a>'
        + '<a name="winset" id="btnWinSet9" class="winset win9" onclick="cms.preview.setWindowRank(9, this);" title="九画面">9画面</a>'
        + '<a name="winset" id="btnWinSet16" class="winset win16" onclick="cms.preview.setWindowRank(16, this);" title="十六画面">16画面</a>'
        //+ '<a name="winmore" class="winset winmore" title="画面分割">画面分割</a>'
        + '<a name="winmax" class="winset winmax" title="切换为全屏&#10;按Esc键退出全屏" onclick="cms.preview.fullScreen(this);">切换为全屏</a>';
        + '</div>';
    return strHtml;
}

var setPresetPanelSize = function(){
    var bh = [cms.preview.ptzPanelH - 25, cms.preview.videoParamPanelH - 25];
    var presetH = getBoxHeight() - (cms.preview.ptzPanelShow ? bh[0] : 0) - (cms.preview.videoParamShow ? bh[1] : 0);
    $('#presetBox').height(presetH);
    $('#presetPanel').height(presetH - cms.preview.presetBarH);
    $('#presetToolbar').height(cms.preview.presetBarH - 1);
};

var getBoxHeight = function(){
    var frameSize = cms.frame.getFrameSize();
    var c = $('#bodyRight .titlebar').size();
    return frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1) - 25 * c;
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
    rightWidth = $('#bodyRight').is(':visible') ? rightWidthConfig : 0;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - switchWidth * 2 - borderWidth - rightWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    $('#bodyMain').height(boxSize.height);
        
    $('#bodyRight').width(rightWidth - borderWidth);
    $('#bodyRightSwitch').width(switchWidth);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    
    $('#bodyRight').height(boxSize.height);
    $('#bodyRightSwitch').height(boxSize.height);
    
    setBoxSize();
    setRightPanelSize();
};

var setBoxSize = function(){
    $('#leftMenu').height(boxSize.height);
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52);
    
    $('.viewbox').width(boxSize.width);
    $('.viewbox').height(boxSize.height - 25 - 40);
};

var setRightPanelSize = function(){
    var c = $('#bodyRight .titlebar').size();
    
    var totalHeight = boxSize.height - 25 * c;
    var bh = [cms.preview.ptzPanelH - 25, cms.preview.videoParamPanelH - 25];
    $('#ptzBox').height(bh[0]);
    
    setPresetPanelSize();
    
    $('#paramBox').height(bh[1]);
    
    if(cms.preview.videoParamShow){
        $('#paramBox').show();
        $('#paramTitle').find('a').addClass('switch sw-open');
    } else {
        $('#paramBox').hide();
        $('#paramTitle').find('a').addClass('switch sw-close');
    }
};

var setLeftDisplay = function(obj){
    if(obj === undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var setRightDisplay = function(obj){
    if(obj === undefined){
        obj = $('#bodyRightSwitch');
    }
    cms.frame.setRightDisplay($('#bodyRight'), obj);
};

var treeAction = function(param){
    switch(param.type){
        case 'camera':
            $('#txtDevName').attr('value', param.devName);
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            cms.preview.curDevCode = param.devCode;
            
            cms.preview.devVedioPreview(param.devId, param);
            break;
    }
    pageIndex = pageStart;
};

var loadData = function(){
    pageIndex = pageStart;
    
};

var winCloseAction = function(pwobj){
    pwobj.Hide();
    pwobj.Clear();
};

cms.preview.checkDevice = function(){
    return cms.preview.curDevCode !== '';
};

cms.preview.setDevice = function(devId, devCode, devName){
    cms.preview.curDevCode = devCode;
};

cms.preview.devVedioPreview = function(devId, param){
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
            if(jsondata.result === 1){
                var dev = jsondata.dev;
                if(dev.cagServerIp.equals('')){
                    var strHtml = '没有配置CAG服务器信息，请到后台管理先配置服务器信息' + cms.box.buildIframe(600,300,true);
                    cms.box.alert({id: 'pwerror', title: '错误信息', html: strHtml});
                    return false;
                } else {
                    var camera = jsondata.camera;
                    cms.preview.curDevCode = param.devCode;
                    var winParam = {
                        userName: loginUser.userName,
                        userPwd: loginUser.userPwd,
                        devCode: param.devCode,
                        devName: param.devName,
                        serverLineId: dev.serverLineId,
                        serverLineCode: dev.serverLineCode,
                        cagServerIp: dev.cagServerIp,
                        cagServerPort: dev.cagServerPort,
                        channelNo: param.channelNo,
                        cameraId: camera[0].cameraId,
                        cameraName: camera[0].cameraName,
                        streamType: camera[0].streamType,
                        connectType: camera[0].connectType
                    };
                    if(cms.preview.login(dev.cagServerIp, dev.cagServerPort, loginUser.userName, loginUser.userPwd, loginUser.loginLineCode, loginUser.timeLimitedPlay)){
                        if(winParam.serverLineId === ''){
                            cms.box.alert({title:'提示信息' + cms.box.buildIframe(600, 300, true), html:'设备没有选择服务器线路，将以默认线路播放'});
                            winParam.serverLineId = 0;
                        }
                        cms.preview.play(cms.preview.curWinNum, param.devCode, param.channelNo, camera[0].streamType, camera[0].connectType, winParam.serverLineCode, winParam);
                    }
                }
            } else {
                module.showErrorInfo(jsondata.msg, jsondata.error);
            }
        }
    });
};

cms.preview.checkWinIsPlayed = function(winNum){
    return cms.preview.arrWinDev[winNum].isPlayed;
};

cms.preview.checkWinPlayStatus = function(winNum){
    return 2 === cms.preview.arrWinDev[winNum].playStatus;
};

cms.preview.login = function(serverIp, serverPort, userName, userPwd, loginLineCode, timeLimitedPlay){
    var strServer = serverIp + ':' + serverPort;
    if(!cms.preview.htServerConnect.contains(strServer)){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Login Request]'
            + ' szWmpIp: ' + serverIp + ', nWmpPort: ' + serverPort + ', szUser: ' + userName + ', szPwd: ' + userPwd
            + ', iLine:' + loginLineCode + ', nPlayLimit:' + timeLimitedPlay);
        try{
            result = cms.ocx.login(cms.preview.previewOcx, serverIp, serverPort, userName, userPwd, loginLineCode, timeLimitedPlay);
        }catch(e){
            module.showOcxError(e, 'OCX登录失败');
        }
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Login Response] return: ' + cms.ocx.showErrorCode(result));
        
        if(0 === result){
            cms.preview.htServerConnect.add(strServer);
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

cms.preview.play = function(winNum, devCode, channelNo, streamType, connectType, devLineId, winParam){
    var result = '';
    /*
    if(cms.preview.checkWinIsPlayed(winNum)){
        //若当前窗口正在预览视频，则先停止预览
        cms.preview.stopPlayWin(winNum);
    }
    */
    
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Play Request]'
        + ' szDevId: ' + devCode + ', iChannel: ' + channelNo + ', iSubChannel: ' + streamType
        + ', iTransMode: ' + connectType + ', iStreamCtrl: ' + 0 + ', iDevLine: ' + devLineId);
    try{
        result = cms.ocx.play(cms.preview.previewOcx, devCode, channelNo, streamType, connectType, 0, devLineId);
    }catch(e){
        module.showOcxError(e, '播放预览失败');
    }
    if(0 === result){
        if(winParam !== null && winParam !== undefined){
            //设置窗口数据
            //cms.preview.setWinDevData(cms.preview.curWinNum, winParam);
            /*
                以前是先播放视频，成功后，再选择下一窗口
                现在是先选择下一窗口，再开始播放，所以这里设备通道信息还是设置在之前的窗口中，但是当前窗口已经变成下一个窗口了
            */
            cms.preview.setWinDevData(winNum, winParam);
        }
        //显示当前选中的窗口
        cms.preview.showCurPlayCamera();
        //读取预置点信息
        window.setTimeout(cms.preset.getPresetInfo, 1000);
    } else if(1 === result){
        //该设备通道已经在预览，不能重复播放
        
    } else {
        //var isOnline = cms.ocx.checkOnline(cms.preview.previewOcx, devCode);
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Play Response] return: ' + cms.ocx.showErrorCode(result));
};

cms.preview.stopPlayWin = function(winNum){
    if(winNum === undefined){
        winNum = cms.preview.curWinNum;
    }
    var camera = cms.preview.getWinDevData(winNum);
    if(camera === undefined || camera.devCode === ''){
        return false;
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Stop Request]');
    //停止预览窗口
    var result = cms.ocx.stop(cms.preview.previewOcx);
           
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Stop Response] return: ' + cms.ocx.showErrorCode(result));
    
    if(0 === result){
        cms.preview.clearWinDevData(winNum);
    }
    
    //设置声音图标为关闭
    cms.preview.setSoundIcon('close');
    
    cms.preview.showCurPlayCamera(false);
    //设置云台按钮状态
    cms.ptz.setPtzButtonStatus(null);
    //清除预置点信息
    cms.preset.resetPresetInfo();
};

cms.preview.stopAllPlayWin = function(){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopAll Request]');
    //停止全部预览窗口
    var result = cms.ocx.stopAll(cms.preview.previewOcx);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopAll Response] return: ' + cms.ocx.showErrorCode(result));
    
    cms.preview.clearAllWinDevData();
    
    //设置声音图标为关闭
    cms.preview.setSoundIcon('close');
    
    cms.preview.showCurPlayCamera(false);
    //设置云台按钮状态
    cms.ptz.setPtzButtonStatus(null);
    //清除预置点信息
    cms.preset.resetPresetInfo();
};

//语音对讲
cms.preview.startAudioChat = function(userName, userPwd, serverIp, serverPort, devCode, audioType){
    if(!cms.preview.login(serverIp, serverPort, userName, userPwd, loginUser.loginLineId)){
        //登录失败
        return false;
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StartAudioChat Request] szDevId: ' + devCode + ', iAudioType: ' + audioType);
    var result = cms.ocx.startAudioChat(cms.preview.previewOcx, devCode, audioType);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StartAudioChat Response] return: ' + cms.ocx.showErrorCode(result));
};

//停止语音对讲
cms.preview.stopAudioChat = function(serverIp, serverPort){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopAudioChat Request]');
    var result = cms.ocx.stopAudioChat(cms.preview.previewOcx);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[StopAudioChat Response] return: ' + cms.ocx.showErrorCode(result));
};

//显示当前选中的播放窗口的设备通道名称
cms.preview.showCurPlayCamera = function(isShow){
    var camera = cms.preview.getWinDevData(cms.preview.curWinNum);
    if(!camera.devCode.equals(string.empty) && (isShow || isShow === undefined)){
        cms.util.$('winInfo').innerHTML = '&nbsp;- ' + camera.cameraName;
    } else {
        cms.util.$('winInfo').innerHTML = '';
    }
};

//显示当前正在播放声音的窗口
cms.preview.showCurPlaySound = function(isShow){
    if(!isShow && isShow !== undefined){
        cms.util.$('audioPrompt').innerHTML = '';
    } else if(cms.preview.curPlayAudioWinNum >= 0){
        cms.util.$('audioPrompt').innerHTML = '第' + (cms.preview.curPlayAudioWinNum + 1) + '窗口正在播放声音';
    }
};

//设置窗口设备数据
cms.preview.setWinDevData = function(num, param){
    cms.preview.arrWinDev[num].userName = param.userName;
    cms.preview.arrWinDev[num].userPwd = param.userPwd;
    cms.preview.arrWinDev[num].serverIp = param.serverIp;
    cms.preview.arrWinDev[num].serverPort = param.serverPort;
    cms.preview.arrWinDev[num].devCode = param.devCode;
    cms.preview.arrWinDev[num].channelNo = param.channelNo;
    cms.preview.arrWinDev[num].streamType = param.streamType;
    cms.preview.arrWinDev[num].connectType = param.connectType;
    cms.preview.arrWinDev[num].devName = param.devName;
    cms.preview.arrWinDev[num].cameraId = param.cameraId;
    cms.preview.arrWinDev[num].cameraName = param.cameraName;
    //默认关闭复合流播放声音
    cms.preview.arrWinDev[num].playAudio = 'close';
    //云台控制-灯光
    cms.preview.arrWinDev[num].ptzLight = false;
    //云台控制-雨刷
    cms.preview.arrWinDev[num].ptzWiper = false;
    //云台控制-加热
    cms.preview.arrWinDev[num].ptzHeat = false;
    //播放状态
    cms.preview.arrWinDev[num].playStatus = -1;
    //窗口是否已经进行播放操作（无论成功与否）
    cms.preview.arrWinDev[num].isPlayed = true;
    //设备连接失败后重拨次数
    cms.preview.arrWinDev[num].replayTimes = 0;
};

//设置播放窗口设备数据云台控制按钮状态
cms.preview.setWinDevDataForPtzAction = function(cmd, action, num){
    if(num === undefined){
        num = cms.preview.curWinNum;
    }
    var status = (1 === action);
    switch(cmd){
        case 17: //灯光
            cms.preview.arrWinDev[num].ptzLight = status;
            break;
        case 16: //雨刷
            cms.preview.arrWinDev[num].ptzWiper = status;
            break;
        case 18: //加热
            cms.preview.arrWinDev[num].ptzHeat = status;
            break;
    }
};

//清除窗口设备数据
cms.preview.clearWinDevData = function(num){
    if(num === undefined){
        num = cms.preview.curWinNum;
    }
    cms.preview.arrWinDev[num] = {devCode: ''};
    if(cms.preview.curPlayAudioWinNum === num){
        cms.preview.curPlayAudioWinNum = -1;    
    }
};

//清除全部窗口设备数据
cms.preview.clearAllWinDevData = function(){
    for(var i=0; i<cms.preview.maxWinCount; i++){
        cms.preview.arrWinDev[i] = {devCode: ''};
    }
    cms.preview.curPlayAudioWinNum = -1;
};

//获得窗口设备数据
cms.preview.getWinDevData = function(num){
    if(num === undefined){
        num = cms.preview.curWinNum;
    }
    return cms.preview.arrWinDev[num];
};

//交换窗口设备数据
cms.preview.swapWinDevData = function(num, num1){
    var temp = cms.preview.arrWinDev[num];
    cms.preview.arrWinDev[num] = cms.preview.arrWinDev[num1];
    cms.preview.arrWinDev[num1] = temp;
    return true;
};

cms.preview.setWindowRank = function(num, btn, isCall){
    var winset = cms.util.$N("winset");
    for(var i=0; i<winset.length; i++){
        winset[i].className = winset[i].className.replace('cur', 'win');
    }
    if(btn === null){
        btn = cms.util.$('btnWinSet' + num);
    }
    if(btn !== null){
        btn.className = btn.className + ' cur' + num;
    }
        
    if(isCall !== undefined && !isCall){
        return false;
    }
    
    if(cms.preview.previewOcx !== null){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Request] iRank: ' + num);
        var result = cms.ocx.setWindowRank(cms.preview.previewOcx, num);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetRank Response] return: ' + cms.ocx.showErrorCode(result));
    }
    
    //当前窗口数量
    cms.preview.curWinCount = num;
    
    if(cms.preview.curWinNum >= cms.preview.curWinCount){
        cms.preview.curWinNum = 0;
    }
    
    var bEnable = cms.preview.curWinCount > 1;
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableDblClick Request] bEnable: ' + bEnable);
    //设置双击是否可用
    cms.ocx.enableDblClick(cms.preview.previewOcx, bEnable);
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableDblClick Response] return: ' + cms.ocx.showErrorCode(result));
};

cms.preview.fullScreen = function(btn){
    if(cms.preview.previewOcx !== null){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Request] bFull: true');
        var result = cms.ocx.setFullScreen(cms.preview.previewOcx, true);
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetFullScreen Response] return: ' + cms.ocx.showErrorCode(result));
    }
};

//切换按钮图标
cms.preview.btnIconSwitch = function(btn, type){
    var cg = eval('(' + btn.lang + ')');
    var idx = 0;
    if(type !== undefined){
        idx = type === cg[0][0] ? 0 : 1;
    } else {
        idx = btn.rel === cg[0][0] ? 1 : 0;
    }
    btn.rel = cg[idx][0];
    btn.className = cg[idx][1];
    btn.title = cg[idx][2];
};

//打开/关闭复合流播放声音
cms.preview.setSound = function(btn){
    var camera = cms.preview.getWinDevData();
    if(camera.devCode.equals(string.empty)){
        return false;
    }
    if(cms.preview.curPlayAudioWinNum >= 0){
        cms.preview.arrWinDev[cms.preview.curPlayAudioWinNum].playAudio = 'close';
    }
    switch(btn.rel){
        case 'close':
            module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetVolume Request] lVolume: 100, 备注：设置复合流播放声音音量');
            var result = cms.ocx.setVolume(cms.preview.previewOcx, cms.preview.curWinNum, 100);
            module.appendOcxDebugInfo(module.getOcxDebugTime() + '[SetVolume Response] return: ' + cms.ocx.showErrorCode(result));
            
            module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableSound Request] 备注：打开复合流播放声音');
            var result = cms.ocx.enableSound(cms.preview.previewOcx, cms.preview.curWinNum, 1);
            module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableSound Response] return: ' + cms.ocx.showErrorCode(result));
            
            cms.preview.curPlayAudioWinNum = cms.preview.curWinNum;
            /*
            //因OCX控件接口无返回参数
            if(0 === result){
                cms.preview.arrWinDev[cms.preview.curWinNum].playAudio = btn.rel;
                cms.preview.btnIconSwitch(btn);
            }
            */
            break;
        case 'open':
            module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableSound Request] 备注：关闭复合流播放声音');
            var result = cms.ocx.enableSound(cms.preview.previewOcx, cms.preview.curWinNum, 0);
            module.appendOcxDebugInfo(module.getOcxDebugTime() + '[EnableSound Response] return: ' + cms.ocx.showErrorCode(result));
            
            cms.preview.curPlayAudioWinNum = -1;
            /*
            if(0 === result){
                cms.preview.arrWinDev[cms.preview.curWinNum].playAudio = btn.rel;
                cms.preview.btnIconSwitch(btn);
            }
            */
            break;
    }    
    cms.preview.btnIconSwitch(btn);
    cms.preview.arrWinDev[cms.preview.curWinNum].playAudio = btn.rel;

    //显示当前播放声音的窗口
    cms.preview.showCurPlaySound();
};

cms.preview.setSoundIcon = function(action){
    var btn = cms.util.$('btnPlayAudio');
    cms.preview.btnIconSwitch(btn, action);
    if(action.equals('close')){
        //显示当前播放声音的窗口
        cms.preview.showCurPlaySound(false);
    }
};

cms.preview.setScreenAdaption = function(btn){
    cms.preview.btnIconSwitch(btn);
    
    //屏幕自适应/居中设置
    
};

cms.preview.setStreamControl = function(btn){
    cms.preview.btnIconSwitch(btn);
    
    //实时性/流畅性设置

};


/*控件事件*/

cms.preview.onWindowRankChanged = function(iRank){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[onWindowRankChanged Event] iRank: ' + iRank);
    cms.preview.curWinCount = iRank;

    cms.preview.setWindowRank(iRank, null, false);
};

/*
    窗口选择状态改变事件
    参数:
    iNew: 当前选择的窗口
    iOld: 上一次选择的窗口
*/
cms.preview.onWindowChanged = function(iNew, iOld){
    if(cms.preview.isLogOcxWindowChangedEvent){
        module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnMonitorSelChanged Event] iNew: ' + iNew + ', iOld: ' + iOld);
    }
    if(iNew >= 0 && iNew < cms.preview.maxWinCount){
        cms.preview.curWinNum = parseInt(iNew, 10);
        
        //显示当前选中的窗口（调试窗口）
        module.showSelectedWindow(cms.preview.curWinNum);
        
        //设置声音图标
        var winParam = cms.preview.getWinDevData(iNew);
        cms.preview.setSoundIcon(!winParam.devCode.equals(string.empty) ? winParam.playAudio : 'close');
        
        //显示当前选中窗口的设备通道信息
        cms.preview.showCurPlayCamera();
        
        //显示当前播放声音的窗口
        cms.preview.showCurPlaySound();
        //设置云台按钮状态
        cms.ptz.setPtzButtonStatus(winParam);
        //读取预置点信息
        cms.preset.getPresetInfo();
        //读取视频图像参数
        cms.videoparam.getVideoParam();
    }
};

/*
    窗口位置拖动事件
    参数:
    iSrc: 当前选择的窗口
    iDst: 交换的窗口
*/
cms.preview.onWindowSwap = function(iSrc, iDst){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnMonitorSwap Event] iSrc: ' + iSrc + ', iDst: ' + iDst);
    
    cms.preview.swapWinDevData(iSrc, iDst);
};

/*
    播放状态事件
    参数:
    iWnd: 播放窗口ID
    szDevId: 播放设备ID
    iChannel: 播放设备通道
    //iStatus: 播放状态, 1-开始;2-成功;3-出错;4-停止
    iError: 播放失败时的错误码
*/
/*
cms.preview.onPlayStatus = function(iWnd, szDevId, iChannel, iStatus, iError){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnPlayStatus Event] iWnd: ' + iWnd + ', szDevId: ' + szDevId + ', iChannel: ' + iChannel + ', iStatus:' + iStatus + ', iError:' + iError);
    alert('Status:' + iWnd + ',' + iStatus);
    switch(iStatus){
        case 1: //播放开始
            cms.preview.arrWinDev[iWnd].playStatus = iStatus;
            break;
        case 2: //播放成功
            cms.preview.arrWinDev[iWnd].playStatus = iStatus;
            break;
        case 3: //播放失败
            if(cms.preview.checkWinPlayStatus(iWnd)){
                //播放过程中 失败，弹出提示信息
                var camera = cms.preview.getWinDevData(iWnd);
                cms.preview.showPlayStatusPrompt('设备(' + camera.devCode + ')通道(' + camera.channelNo + ') 取流失败');
            }
            var isOnline = cms.ocx.checkOnline(cms.preview.previewOcx, szDevId);
            if(cms.preview.arrWinDev[iWnd].replayTimes < 2 && isOnline === 1){
                //重拨
                var winParam = cms.preview.getWinDevData(iWnd);
                var times = cms.preview.arrWinDev[iWnd].replayTimes + 1;
                module.appendOcxDebugInfo(module.getOcxDebugTime() + '[Replay] devCode: ' + winParam.devCode + ', channelNo: ' + winParam.channelNo + ', times: ' + times);
                                
                if(cms.preview.login(winParam.serverIp, winParam.serverPort, winParam.userName, winParam.userPwd, loginUser.loginLineId)){
                    cms.preview.play(iWnd, winParam.devCode, winParam.channelNo, winParam.streamType, winParam.connectType, loginUser.loginLineId, null);
                }
                
                cms.preview.arrWinDev[iWnd].replayTimes++;
            } else {
                cms.preview.clearWinDevData(iWnd);
                cms.preview.showCurPlayCamera(false);
                cms.preset.resetPresetInfo();
            }
            break;
        case 4: //播放结束
            cms.preview.clearWinDevData(iWnd);
            break;
    }
};
*/

/*
    播放状态事件
    参数:
    iWnd: 播放窗口ID
    szDevId: 播放设备ID
    iChannel: 播放设备通道
    iStatus: 播放状态, 1-开始;2-停止
    iError: 播放失败时的错误码
*/
cms.preview.onPlayStatus = function(iWnd, szDevId, iChannel, iStatus, iError){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnPlayStatus Event] iWnd: ' + iWnd + ', szDevId: ' + szDevId + ', iChannel: ' + iChannel + ', iStatus:' + iStatus + ', iError:' + iError);
    switch(iStatus){
        case 1: //播放开始
            cms.preview.arrWinDev[iWnd].playStatus = iStatus;
            break;
        case 2: //播放成功
            cms.preview.clearWinDevData(iWnd);
            break;
    }
};

/*限时预览提示*/
cms.preview.onPlayLimiePrompt = function(iWnd){
    var size = [300, 240];
    var strHtml = '第' + (iWnd + 1) + '个窗口' + cms.ocx.playLimitNotify + '秒后将停止预览';
    var config = {
        title: '提示信息' + cms.box.buildIframe(size[0], size[1], true),
        html: strHtml
    };
    cms.box.alert(config);
};

/*
    设备上下线消息事件
*/
cms.preview.onNotify = function(szPuid, iStatus){
    if(!cms.preview.isDisposeOcxDevOnOffEvent) return false;
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnNotify Event] szPuid: ' + szPuid + ', iStatus: ' + iStatus);
    if(0 === iStatus){
        cms.preview.showPlayStatusPrompt('设备(' + szPuid + ') 离线');
    }
};

/*
    GPS消息事件
*/
cms.preview.onGpsInfo = function(szGpsinfo){
    if(!cms.preview.isDisposeOcxGpsEvent) return false;
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnGpsinfo Event] szGpsinfo: ' + szGpsinfo);
};

/*
    报警消息事件
*/
cms.preview.onAlarmInfo = function(szAlarmInfo){
    if(!cms.preview.isDisposeOcxAlarmEvent) return false;
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnAlarmInfo Event] szAlarmInfo: ' + szAlarmInfo);
};

/*
    服务器连接断开事件
    下次播放需要重新连接服务器
*/
cms.preview.onServerClosed = function(szServerIp, iServerPort){
    if(szServerIp === undefined || iServerPort === undefined){
        cms.preview.htServerConnect.clear();
    } else {
        //var strKey = szServerIp + ':' + iServerPort;
        var strKey = 'ServerPort';
        if(cms.preview.htServerConnect.contains(strKey)){
            cms.preview.htServerConnect.remove(strKey);
        }
    }
};

//显示视频播放状态提示
cms.preview.showPlayStatusPrompt = function(str){
    var strHtml = '<div style="padding:5px 10px;">';
    strHtml += str;
    strHtml += '</div>';
    var size = [260, 180];
    var config = {
        id: 'pwPlayPrompt',
        title: '提示信息' + cms.box.buildIframe(size[0], size[1], true),
        html: strHtml,
        build: 'append',
        appendType: 'stack',
        lock: false,
        noBottom: true,
        width: size[0],
        height: size[1],
        position: 9,
        rise: true,
        autoClose: true,
        timeout: 5000
    };
    cms.box.win(config);
};

/*
    语音对讲 事件
    功能:
    语音对讲开启或关闭时触发
    参数:
    szDevId:设备ID
    iAudioChan:设备语音通道
    iAction:1-开启,0-关闭  -1-断线
    iStatus:错误码
    返回: 无
*/
cms.preview.onAudioPlayEvent = function(szDevId,iAudioChan,iAction,iStatus){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnAudioPlayEvent Event]'
        //+ ' iWnd: ' + iWnd
        + ', szDevId: ' + szDevId + ', iAudioChan: ' + iAudioChan + ', iAction: ' + iAction + ', iStatus: ' + iStatus);
    var strHtml = '<div style="padding:5px 10px;">';
    strHtml += '设备（' +  szDevId + '）通道' + iAudioChan;
    strHtml += 1 === iAction ? '正在语音对讲' : 0 === iAction ? '语音对讲已关闭' : '语音对讲已断线';
    strHtml += '</div>';
    var size = [300, 180];
    var config = {
        id: 'pwAudioPlayEvent',
        title: '提示信息' + cms.box.buildIframe(size[0], size[1], true),
        html: strHtml,
        build: 'append',
        appendType: 'stack',
        lock: false,
        noBottom: true,
        width: size[0],
        height: size[1],
        position: 9,
        rise: true,
        autoClose: true,
        timeout: 5000
    };
    cms.box.win(config);
};

/*
    抓图事件
    功能:
    抓图完成后事件
    参数:
    iResult:错误码
    szDevId:设备ID
    iChannel:通道号
    szPathFile:文件存放的路径和文件名.
*/
cms.preview.onCaptureEvent = function(iResult,szDevId,iChannel,szPathFile){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnCaptureEvent Event]'
        //+ ' iWnd: ' + iWnd
        + ', iResult: ' + iResult + ', szDevId: ' + szDevId + ', iChannel: ' + iChannel + ', szPathFile: ' + szPathFile);
    var strHtml = '<div style="padding:5px 10px;">';
    strHtml += '抓图文件已保存，图片路径：' + szPathFile;
    strHtml += '</div>';
    var size = [300, 180];
    var config = {
        id: 'pwCaptureEvent',
        title: '提示信息' + cms.box.buildIframe(size[0], size[1], true),
        html: strHtml,
        build: 'append',
        appendType: 'stack',
        lock: false,
        noBottom: true,
        width: size[0],
        height: size[1],
        position: 9,
        rise: true,
        autoClose: true,
        timeout: 5000
    };
    cms.box.win(config);
};

/*
    本地录像事件
    功能:
    录像完成后事件
    参数:
    iResult:错误码
    iEvent: 1-开始录像  2-停止录像
    szDevId:设备ID
    iChannel:通道号
    szPathFile:文件存放的路径和文件名.
*/
cms.preview.onLocalRecordEvent = function(iResult,iEvent,szDevId,iChannel,szPathFile){
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnLocalRecordEvent Event]'
        //+ ' iWnd: ' + iWnd
        + ', iResult: ' + iResult + ', iEvent: ' + iEvent + ', szDevId: ' + szDevId + ', iChannel: ' + iChannel + ', szPathFile: ' + szPathFile);
    var strHtml = '<div style="padding:5px 10px;">';
    if(iEvent === 1){
        strHtml += '正在录像，文件路径：' + szPathFile;
    } else {
        strHtml += '录像已完成，文件路径：' + szPathFile;
    }
    strHtml += '</div>';
    var size = [300, 180];
    var config = {
        id: 'pwLocalRecordEvent',
        title: '提示信息' + cms.box.buildIframe(size[0], size[1], true),
        html: strHtml,
        build: 'append',
        appendType: 'stack',
        lock: false,
        noBottom: true,
        width: size[0],
        height: size[1],
        position: 9,
        rise: true,
        autoClose: true,
        timeout: 5000
    };
    cms.box.win(config);
};


var showAlarm = ShowDeviceAlarmEvent;
var playAlarmSound = PlayDeviceAlarmSound;
var pwAlarmBox = null;
/*
    报警事件
    参数:
    szDevId:设备号
    szTime: 报警时间
    szRemark:报警描述
    iAlarmType:报警类型
    iAction:报警动作, 1-报警开始;2-报警停止
    iVideoChannel:视频通道号
    iDiskNo:硬盘号
    iAlarmInChannel:报警输入通道号
    描述:
    iAlarmType类型:
        100-硬盘满;
        101-硬盘错;
        102;视频丢失;
        103-视频制式不匹配;
        201-视频遮挡;
        202-移动侦测;
        203-超速报警;
        204-噪音报警;
        300-报警输入;
        301-报警输出
*/
cms.preview.onAlarm = function(szDevId, szTime, szRemark, iAlarmType, iAction, iVideoChannel, iDiskNo, iAlarmInChannel){
    if(!showAlarm){
        return false;
    }
    module.appendOcxDebugInfo(module.getOcxDebugTime() + '[OnAlarm Event]'
        + ' szDevId: ' + szDevId + ', szTime: ' + szTime + ', szRemark: ' + szRemark + ', iAlarmType: ' + iAlarmType
        + ', iAction: ' + iAction + ', iVideoChannel: ' + iVideoChannel + ', iDiskNo: ' + iDiskNo 
        + ', iAlarmInChannel: ' + iAlarmInChannel);
    
    var size = [320, 220];
    var strDevName = '';
    if(0 === cms.preview.htDeviceName.count()){
        getDeviceNameList();
    } else {
        strDevName = '“' + cms.preview.htDeviceName.contains(szDevId) ? cms.preview.htDeviceName.items(szDevId) + '”' : '';
    }
    var strHtml = '<div style="padding:0 5px;">';
    strHtml += '设备%s(%s)通道%s %s<br />报警时间：%s<br />'.format(
        [strDevName, szDevId, iVideoChannel, iAction === 1 ? '报警开始' : '报警停止', szTime], '%s'
    );
    strHtml += '报警类型：%s<br />报警输入通道号：%s&nbsp;&nbsp;硬盘号：%s<br />报警描述：%s<br />'.format(
        [cms.ocx.parseAlarmType(iAlarmType), iAlarmInChannel,iDiskNo, szRemark], '%s'
    );
    if(1 === iAction && playAlarmSound){
        strHtml += '<embed id="MPlayer" src="' + cmsPath + '/skin/default/sound/alarm/1.wav' + '" loop="false" width="0" height="0" /></embed>';
    }
    strHtml += '</div>';
    var config = {
        id: 'pwAlarmInfo',
        title: '报警信息%s'.format([cms.box.buildIframe(size[0], size[1], true)], '%s'),
        html: strHtml,
        width: size[0],
        height: size[1],
        position: 9,
        minAble: true,
        showMinMax: true,
        lock: false,
        //rise: true,
        build: 'show',
        buttonText: ['我知道了']
    };
    pwAlarmBox = cms.box.alert(config);
};

function getDeviceNameList(){
    var urlparam = 'action=getDeviceNameList&devCode=&devTypeCode=';
    module.ajaxRequest({
        url: cmsPath + '/ajax/device.aspx',
        data: urlparam,
        callBack: getDeviceNameListCallBack
    });
}

function getDeviceNameListCallBack(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result !== 1 || jsondata.list === undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    
    for(var i=0,c=jsondata.list.length; i<c; i++){
        var dr = jsondata.list[i];
        if(!cms.preview.htDeviceName.contains(dr.code)){
            cms.preview.htDeviceName.add(dr.code, dr.name);
        }
        delete dr;
    }
    delete jsondata;
}