cms.patrol = cms.patrol || {};
cms.patrol.manage = cms.patrol.manage || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 240;
var rightWidth = 0;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = 1025;
//滚动条宽度
var scrollBarWidth = 18;

var treeType = 'unit';
var treeTitle = '组织机构';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

var timer = 90;
var time = timer;
var pause = false;
var autoPause = true;
var setPause = false;
var loaded = false;
var enabled = true;

var tabs = [
    {code: 'point', name: '巡检点', load: false},
    {code: 'type', name: '巡检点类型', load: false},
    {code: 'line', name: '巡检线路', load: false},
    {code: 'allocate', name: '设备分配', load: false}
];
//当前页面类型
var pageType = 'point';
//加载JS
var jsLoaded = {device: false, camera: false, server: false};

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    initialForm();
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true);
    
    setBodySize();
    
    //加载数据 延时50ms
    window.setTimeout(getDataContent, 50, pageType);
    
    updateTimeBoard(time);
    window.setInterval(timing, 1000);
    
    //默认停止定时刷新
    timerPlayStop(true);
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
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
    
    for(var i=0; i<tabs.length; i++){
        var strTab = '<a class="' + (tabs[i].code == pageType ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#listBox_' + tabs[i].code + '"><span>' + tabs[i].name + '</span></a>';
        $('#tabpanel').append(strTab);
        
        var strHtml = '<div id="listBox_' + tabs[i].code + '" class="listbox" ' + (tabs[i].code == pageType ? '':' style="display:none;"') + '>'
            + '<div id="listHeader_' + tabs[i].code + '" class="listheader"></div>'
            + '<div id="listContent_' + tabs[i].code + '" class="list scrollbar"></div>'
            + '</div>';
        $('#listBoxPanel').append(strHtml);
        $('#statusBar').append('<span id="pagination_' + tabs[i].code + '" class="pagination"></span>');
        
        $('#listHeader_' + tabs[i].code).html(cms.util.buildTable('tbHeader_' + tabs[i].code,'tbheader'));
        $('#listContent_' + tabs[i].code).html(cms.util.buildTable('tbList_' + tabs[i].code,'tblist'));
    }
    
    showTools(pageType);
    
    cms.jquery.tabs('.operbar .tabpanel', null, '.listbox', 'gotoPage');
    
    $('#txtKeywords').focus(function(){
        if(cms.patrol.point.checkKeywords(this)){
            $(this).attr('value','');
        }
    });

    window.setTimeout(loadJs, 50);
}

var loadJs = function(){
    cms.util.loadJs(cms.util.path + '/js/patrolManage/', 'patrol.type.js?' + new Date().getTime());
    cms.util.loadJs(cms.util.path + '/js/patrolManage/', 'patrol.area.js?' + new Date().getTime());
    cms.util.loadJs(cms.util.path + '/js/patrolManage/', 'patrol.line.js?' + new Date().getTime());
}

var showTools = function(type){
    $('.left-tools').html('');
    $('.right-tools').hide('');
    $('.left-tools').css('margin-left', '60px');
    $('#toolbar').hide();
    switch(type){
        case 'point':
            $('.left-tools').html(buildTools(type));
            if($('.right-tools').html() == ''){
                $('.right-tools').css('float', 'right');
                $('.right-tools').html(buildTools('search'));
                $('#txtKeywords').focus(function(){
                    if(cms.patrol.area.checkKeywords(this)){
                        $(this).attr('value','');
                    }
                });
            }
            $('.right-tools').show();   
            if($('#toolbar').html() == ''){
                $('#toolbar').html(buildCon(type));
            }
            $('#toolbar').show();
            break;
        case 'type':
        case 'area':
        case 'line':
            $('.left-tools').html(buildTools(type));
            break;
    }
}

var buildTools = function(type){
    var strTools = '';
    switch(type){
        case 'point':
            strTools = '<a class="btn imgbtn" onclick="cms.patrol.point.showEditPointWin(\'add\');"><i class="icon-add"></i><span>添加</span></a>'
                + '<a class="btn imgbtn" onclick="cms.patrol.point.showDeletePointWin();"><i class="icon-delete"></i><span>删除</span></a>';
            strTools += '<a class="btn imgbtn" onclick="cms.patrol.point.showImportPointWin();"><i class="icon-import"></i><span>导入巡检点</span></a>'
                + '<a class="btn imgbtn" onclick="cms.patrol.point.showExportPointWin();"><i class="icon-export"></i><span>导出巡检点</span></a>';
            break;
        case 'type':
            strTools = '<a class="btn imgbtn" onclick="cms.patrol.type.showEditTypeWin(\'add\');"><i class="icon-add"></i><span>添加</span></a>'
                + '<a class="btn imgbtn" onclick="cms.patrol.type.showDeleteTypeWin();"><i class="icon-delete"></i><span>删除</span></a>';
            break;
        case 'area':
            strTools = '<a class="btn imgbtn"><i class="icon-add"></i><span>添加</span></a>'
                + '<a class="btn imgbtn"><i class="icon-delete"></i><span>删除</span></a>';
            break;
        case 'line':
            strTools = '<a class="btn imgbtn" onclick="cms.patrol.line.showEditLineWin(\'add\');"><i class="icon-add"></i><span>添加</span></a>'
                + '<a class="btn imgbtn" onclick="cms.patrol.line.showDeleteLineWin();"><i class="icon-delete"></i><span>删除</span></a>';
            break;
        case 'search':
            strTools = '<input id="txtKeywords" type="text" class="txt w135" maxlength="25" value="输入要查找的巡检点名称" />'
                + '<a onclick="loadData();" class="btn btnsearch"></a>'
                + '<a onclick="loadAllData();" class="btn btnsearch-cancel"></a>';
            break;        
    }
    return strTools;
}

var buildCon = function(type){
    var strHtml = '<label for="showChild" class="chb-label" style="_width:100px;">'
        + '<input type="checkbox" id="showChild" onclick="cms.patrol.point.getPatrolPoint();" class="chb" /><span>显示下级巡检点</span>'
        + '</label>';
    
    return strHtml;
}

var gotoPage = function(rval){
    if(pageType != rval.action){
        time = timer;
    }
    pageType = rval.action;
    $('#statusBar .pagination').hide();
    $('#statusBar #pagination_' + rval.action).show();
    showTools(rval.action);
    
    //切换TAB时，判断是否已加载TAB项内容
    if(!tabs[cms.jquery.getTabItem(tabs, pageType)].load){
        getDataContent(pageType);
    } else {
        return false;
    }
}

var refreshTreeMenu = function(){
    var unitId = tree.showTreeMenu(false, treeType, 'treeAction', true, false);
    //重新加载树菜单中，将第一个节点选中
    
}

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
    rightWidth = cms.frame.rightWidth;
    
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
        $('.listheader').width(boxSize.width);
        $('.listbox .list').width(boxSize.width);      
    }
    $('.listbox').height(boxSize.height - 25*2 - 28);
    $('.listheader').height(23);
    $('.listbox .list').height(boxSize.height - 25*2 - 28 - 23);
        
    setListBoxSize();
    
    //cms.util.$("listContent").onscroll = function(){cms.util.scrollSync(this, cms.util.$('listHeader'));}
    //cms.util.$("listServerContent").onscroll = function(){cms.util.scrollSync(this, cms.util.$('listServerHeader'));}
}

var setListBoxSize = function(){
    if(boxSize.width >= listBoxMinWidth){
        listBoxMinWidth = boxSize.width;
    } else {
        listBoxMinWidth = 1065;
    }
    $('.listbox .tbheader').width(listBoxMinWidth);
    $('.listbox .tblist').width(listBoxMinWidth - scrollBarWidth);
}

var setLeftDisplay = function(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
}

var treeAction = function(param){
    switch(param.type){
        case 'unit':
            $('#txtCurUnitId').attr('value', param.unitId);
            $('#txtCurUnitName').attr('value', param.unitName);
            $('#txtNodeId').attr('value', param.nid);
            break;
    }
    if(isUnitChanged()){
        $('#txtOldUnitId').attr('value', $('#txtCurUnitId').val());
        //改变组织机构时，设置TAB项内容为未加载
        $.each(tabs, function(i, o){
            o.load = false;
        });
    }
    getDataContent(pageType);
    
}

var isUnitChanged = function(){
    return $('#txtOldUnitId').val() != $('#txtCurUnitId').val();
}

var loadData = function(){
    switch(pageType){
        case 'point':
            cms.patrol.point.pageIndex = cms.patrol.point.pageStart;
            cms.patrol.point.getPatrolPoint();
            break;
    }
}

var getDataContent = function(pageType){
    autoPause = true;
    showLoading(true);
    switch(pageType){
        case 'point':
            cms.patrol.point.pageIndex = cms.patrol.point.pageStart;
            //$('#txtDevUnitId').attr('value', $('#txtUserUnitId').val());
            cms.patrol.point.getPatrolPoint();
            break;
        case 'type':
            cms.patrol.type.pageIndex = cms.patrol.type.pageStart;
            cms.patrol.type.getPatrolPointType();
            break;
        case 'line':
            cms.patrol.line.pageIndex = cms.patrol.line.pageStart;
            cms.patrol.line.getPatrolLine();
            break;
    }
    tabs[cms.jquery.getTabItem(tabs, pageType)].load = true;
    loaded = true;
    autoPause = false;
    showLoading(false);
}

var loadAllData = function(){
    switch(pageType){
        case 'point':
            clearKeywords();
            cms.patrol.point.pageIndex = cms.patrol.point.pageStart;
            cms.patrol.point.getPatrolPoint();
            break;
    }
}

var clearKeywords = function(){
    $('#txtKeywords').attr('value', '');
}

var winCloseAction = function(pwobj){
    pwobj.Hide();
    pwobj.Clear();
}

var showDebugInfo = function(){
    module.showDebugInfo({html:$('#txtData').val()}, $('#txtRunTime').val());
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

var refresh = function(){
    getDataContent(pageType);
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
    }
    updateTimeBoard(time);
}

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
}