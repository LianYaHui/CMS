cms.gpsStat = cms.gpsStat || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 0;
var rightWidth = rightWidthConfig =  0;
var leftFormHeight = 165;
var switchWidth = 0;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = listBoxMinWidthConfig = loginUser.userName.equals('admin') ? 680 : 580;
//滚动条宽度
var scrollBarWidth = 18;

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

cms.gpsStat.treeBoxH = 0;
cms.gpsStat.titleH = 25;
cms.gpsStat.viewControlPanelH = 40;
cms.gpsStat.searchFormPanelH = 212;
cms.gpsStat.trackBoxHeight = 150;

cms.gpsStat.isDebug = module.checkIsDebug();

cms.gpsStat.pageStart = 1;
cms.gpsStat.pageIndex = cms.gpsStat.pageStart;
cms.gpsStat.pageSize = 20;

cms.gpsStat.curDevCode = null;

var tabs = [
    {code: 'mileage', name: '里程统计', load: false},
    {code: 'alarm', name: '报警统计', load: false},
    {code: 'park', name: '停车统计', load: false}
    //{code: 'omap', name: '静态地图', load: false}
];
var curTab = 'mileage';

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = leftWidthConfig = 220;
    }
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    if(cms.gpsStat.isDebug){
        var winDebug = initialDebugBox();
        winDebug.Hide();
    }
    /*
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', false, leftWidth, '3');
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', false, true, false, false, true);
    //定时刷新树型菜单设备状态
    tree.timer = window.setTimeout(tree.updateDevStatus, 15*1000, 15*1000);
    */
    setBodySize();

    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
});

$(window).unload(function(){
    if(cms.gpsStat.timer != null){
        //清除定时器
        clearInterval(cms.gpsStat.timer);
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
    $('#bodyRightSwitch').click(function(){
        setRightDisplay($(this));
    });
    
    var strHtml = '';
    for(var i=0; i<tabs.length; i++){
        var strTab = '<a class="' + (tabs[i].code == curTab ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#frmBox_' + tabs[i].code + '">'
            + '<span>' + tabs[i].name + '</span></a>';
        $('#tabpanel').append(strTab);
        //strHtml += '<div id="frmBox_' + tabs[i].code + '" class="frmbox" ' + (tabs[i].code == curTab ? '':' style="display:none;"') + '></div>';
    }
    $('#frmbox').append(strHtml);
    
    cms.jquery.tabs('#mainTitle .tabpanel', null, '.frmbox', 'loadPage');
    
    loadPage({action:'mileage'}, false);
    
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    
    //buildLeftForm();
};

var buildLeftForm = function(){
    var strHtml = '<div class="titlebar" style="border-top:solid 1px #99bbe8;"><div class="title">操作菜单</div></div>';

    $('#leftForm').html(strHtml);
};

var setGpsTime = function(strDate){
    $('#txtStartTime').attr('value', strDate + ' 0:00:00');
    $('#txtEndTime').attr('value', strDate + ' 23:59:59');
};

var initialDebugBox = function(){    
    if(cms.gpsStat.isDebug){        
        var bodySize = cms.util.getBodySize();
        var size = {w:450, h:300};
        var strHtml = ''
            + '<textarea id="txtDebugger" class="txt" readonly="readonly" style="width:' + (size.w - 8) + 'px;height:' + (size.h - 25 - 28) + 'px;padding:0 3px;margin:0;"></textarea>'
            + '<div class="statusbar">'
            + '<a class="btn btnc22" onclick="clearDebugInfo();" style="float:right;margin-right:3px;"><span>清除内容</span></a>'
            + '<span id="lblWinNum" style="padding:0 3px;"></span>'
            + '<span id="lblPlayWinNum" style="padding:0 3px;"></span>'
            + '<span id="lblStopWinNum" style="padding:0 3px;"></span>'
            + '</div>';
        strHtml += cms.box.buildIframe(450, 300, true);
        
        var config = {
            id: 'pwdebug',
            title: 'GPS轨迹回放功能调试',
            html: strHtml,
            noBottom: true,
            width: size.w,
            height: size.h,
            lock: false,
            position: 8,
            y: 5,
            closeType: 'hide',
            build: 'show',
            reload: false
        };
        var windebug = cms.box.win(config);
        
        cms.gpsStat.debugMessageBox = cms.util.$('txtDebugger');
        
        return windebug;
    }
    return null;
};

var appendDebugInfo = function(str){
    if(cms.gpsStat.isDebug){
        cms.gpsStat.debugMessageBox.value += str + '\r\n';
    }
};

var clearDebugInfo = function(){
    if(cms.gpsStat.isDebug){
        cms.gpsStat.debugMessageBox.value = '';
    }
}

var getDebugTime = function(){
    return '[' + new Date().toString('yyyy-MM-dd HH:mm:ss fff') + '] ';
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
    rightWidth = $('#bodyRight').is(':visible') ? rightWidthConfig : 0;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    $('#bodyRight').width(rightWidth - borderWidth);
    $('#bodyRightSwitch').width(switchWidth);
    
    boxSize = {
        width: frameSize.width - leftWidth - rightWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    $('#bodyMain').height(boxSize.height);

    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyRight').height(boxSize.height);
    $('#bodyRightSwitch').height(boxSize.height);
    
    setBoxSize();
};

var setBoxSize = function(){
    $('#leftMenu').height(boxSize.height - leftFormHeight);
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 25*2 - leftFormHeight);
    
    $('#mainContent').width(boxSize.width);
    $('#mainContent').height(boxSize.height - 25);
    
    $('#frmbox .frmcon').width(boxSize.width);
    $('#frmbox .frmcon').height(boxSize.height - 25);
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
            $('#txtDevName').attr('value', param.devName);
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            $('#txtDevId').attr('value', param.devId);
            cms.gpsStat.curDevCode = param.devCode;
            break;
    }
};

var loadPage = function(param, update){
    var url = buildPageURl(param.action);
    $('#frmbox iframe').hide();
    if(!checkPageIsLoad(param.action)){
        $('#frmbox').append(buildIframe(param.action, url));
        
        tabs[cms.jquery.getTabItem(tabs, param.action)].load = true;
        setBoxSize();
    } else {
        if(update){
            updateIframe(param.action, url, true);
        }
    }
    $('#frmBox_' + param.action).show(); 
};

var buildPageURl = function(code){
    var url = '';
    switch(code){
        case 'mileage':
        url = cmsPath + '/modules/gpsStat/mileage.aspx?devCode=&' + new Date().getTime();
        break;
        case 'alarm':
        url = cmsPath + '/modules/gpsStat/alarm.aspx?devCode=&' + new Date().getTime();
        break;
        case 'park':
        url = cmsPath + '/modules/gpsStat/park.aspx?devCode=&' + new Date().getTime();
        break;
    }
    return url;
};

var buildIframe = function(code, url){
    return '<iframe class="frmcon" id="frmBox_' + code + '" frameborder="0" scrolling="auto" width="100%" height="100%" src="' + url + '"></iframe>';
};

/*
isUpdate: 是否强制更新
*/
var updateIframe = function(code, url, isUpdate){
    var oldUrl = $('#frmBox_' + code).prop('src');
    //如果页面URL更新了，则重新加载页面
    if((url != undefined && url != '' && url != oldUrl.replace(cms.util.getHost(oldUrl), '')) || isUpdate){
        $('#frmBox_' + code).attr('src', url);
    }
};

var getIframeId = function(code){
    return '#frmBox_' + code;
};

var checkPageIsLoad = function(tab){
    for(var i=0; i<tabs.length; i++){
        if(tabs[i].code == tab){
            return tabs[i].load;
        }
    }
    return false;
};

var gotoPage = function(param){
    curTab = param.action;
};