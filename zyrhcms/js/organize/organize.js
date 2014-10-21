cms.organize = cms.organize || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 240;
var rightWidth = 0;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = 1125;
//滚动条宽度
var scrollBarWidth = 18;

var treeType = 'unit';
var treeTitle = '组织机构';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

var timer = 60;
var time = timer;
var pause = false;
var autoPause = true;
var setPause = false;
var loaded = false;
var enabled = true;

var tabs = [
    {code: 'device', name: '设备', load: false, listBoxWidth: 1185},
    {code: 'camera', name: '监控点', load: false, listBoxWidth: 1025},
    {code: 'deviceType', name: '设备类型', load: false, listBoxWidth: 1025},
    {code: 'server', name: '服务器', load: false, listBoxWidth: 1025},
    {code: 'line', name: '线路', load: false, listBoxWidth: 1025}
];
//当前页面类型
var pageType = 'device';
//加载JS
var jsLoaded = {device: true, camera: false, server: false, line: false};

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    module.showDebugBox();
    module.hideDebugBox();
    
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth, '', buildTools('tree'));
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true);
    
    setBodySize();
    
    //加载数据 延时50ms
    window.setTimeout(getDataContent, 50, pageType);
    
    updateTimeBoard(time);
    window.setInterval(timing, 1000);
    
    //默认停止定时刷新
    timerPlayStop(true);
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: shortcutKeyAction, shiftKeyFunc: null});
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
    
    $('#toolbar').append('<div id="toolbar_device" class="toolbar"></div><div id="toolbar_camera" class="toolbar"></div>');
    if(module.isDebug){
        $('#mainTitle .tools').append('<a class="ibtn" id="btnDebug" title="调试" onclick="showDebugInfo();"><i class="icon-debug"></i></a>');
    }
        
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
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    showTools(pageType);
    
    cms.jquery.tabs('.operbar .tabpanel', null, '.listbox', 'gotoPage');
    
    window.setTimeout(loadJs, 50);
};

var shortcutKeyAction = function(keyCode){
    timerPlay(cms.util.$('btnTimerPlay'));
};

var loadJs = function(){
    if(!jsLoaded.device){
        cms.util.loadJs(cms.util.path + '/js/organize/', 'device.js?' + new Date().getTime());
        jsLoaded.device = true;
    }
    if(!jsLoaded.server){
        cms.util.loadJs(cms.util.path + '/js/organize/', 'server.js?' + new Date().getTime());
        jsLoaded.server = true;
    }
    if(!jsLoaded.camera){
        cms.util.loadJs(cms.util.path + '/js/organize/', 'camera.js?' + new Date().getTime());
        jsLoaded.camera = true;
    }
    if(!jsLoaded.line){
        cms.util.loadJs(cms.util.path + '/js/organize/', 'line.js?' + new Date().getTime());
        jsLoaded.line = true;
    }
    if(!jsLoaded.deviceType){
        cms.util.loadJs(cms.util.path + '/js/organize/', 'deviceType.js?' + new Date().getTime());
        jsLoaded.deviceType = true;
    }
};

var showTools = function(type){
    $('.left-tools').html('');
    $('.right-tools').hide('');
    $('.left-tools').css('margin-left', '60px');
    $('.toolbar').hide();
    switch(type){
        case 'device':
            $('.left-tools').html(buildTools(type));
            if($('.right-tools').html() == ''){
                $('.right-tools').css('float', 'right');
                $('.right-tools').html(buildTools('search'));
                $('#txtKeywords').focus(function(){
                    if(cms.device.checkKeywords(this)){
                        $(this).attr('value','');
                    }
                });
                $('#ddlType').change(function(){
                    switch($(this).val()){
                        case 'name':
                            if(cms.device.checkKeywords('#txtKeywords')){
                                $('#txtKeywords').attr('value', cms.device.arrKeys.name);
                            }
                            break;
                        case 'indexcode':
                            if(cms.device.checkKeywords('#txtKeywords')){
                                $('#txtKeywords').attr('value', cms.device.arrKeys.indexcode);
                            }
                            break;
                    }
                });
            }
            $('.right-tools').show();
            if($('#toolbar_' + type).html() == ''){
                $('#toolbar_' + type).html(buildCon(type));
            }
            $('#toolbar_' + type).show();
            break;
        case 'camera':
            //$('.right-tools').show();
            if($('#toolbar_' + type).html() == ''){
                $('#toolbar_' + type).html(buildCon(type));
            }
            $('#toolbar_' + type).show();
        case 'deviceType':
            $('.left-tools').html(buildTools(type));
            break;
        case 'server':
            $('.left-tools').html(buildTools(type));
            break;
        case 'line':
            $('.left-tools').html(buildTools(type));
            break;
    }
};

var buildTools = function(type){
    var strTools = '';
    switch(type){
        case 'tree':
            strTools = '<a class="ibtn nobg" title="刷新" onclick="refreshTreeMenu();"><i class="icon-update"></i></a>'
                + '<a class="ibtn nobg" title="添加" onclick="cms.organize.showAddUnitWin();"><i class="icon-add"></i></a>'
                + '<a class="ibtn nobg" title="编辑" onclick="cms.organize.showEditUnitWin();"><i class="icon-edit"></i></a>'
                + '<a class="ibtn nobg" title="删除" onclick="cms.organize.showDeleteUnitWin();"><i class="icon-delete"></i></a>'
                + '<a class="ibtn nobg" title="向上排序"><i class="icon-up"></i></a>'
                + '<a class="ibtn nobg" title="向下排序"><i class="icon-down"></i></a>';
            break;
        case 'device':
            strTools = '<a class="btn imgbtn" onclick="cms.device.showEditDeviceWin(\'add\');">'
                + '<i class="icon-add"></i><span>添加</span>'
                + '</a>'
                + '<a class="btn imgbtn" onclick="cms.device.showDeleteDeviceWin();">'
                + '<i class="icon-delete"></i><span>删除</span>'
                + '</a>';
            if(type == 'device'){
                strTools += '<a class="btn imgbtn" onclick="cms.device.showImportDevWin();">'
                + '<i class="icon-import"></i><span>导入设备</span>'
                + '</a>'
                    + '<a class="btn imgbtn" onclick="cms.device.showImportDevWin();">'
                + '<i class="icon-export"></i><span>导出设备</span>'
                + '</a>';
            }
            break;
        case 'camera':
            /*
            strTools = '<a class="btn imgbtn"><i class="icon-add"></i><span>添加</span></a>'
                + '<a class="btn imgbtn"><i class="icon-delete"></i><span>删除</span></a>';
            */
            break;
        case 'deviceType':
            strTools = '<a class="btn imgbtn" onclick="cms.deviceType.showEditDeviceType(0);">'
                + '<i class="icon-add"></i><span>添加</span>'
                + '</a>';
                /*
                + '<a class="btn imgbtn" onclick="cms.deviceType.showDeleteDeviceType();">'
                + '<i class="icon-delete"></i><span>删除</span>'
                + '</a>';
                */
            break;
        case 'server':
            strTools = '<a class="btn imgbtn" onclick="cms.server.showEditServerWin(\'add\');">'
                + '<i class="icon-add"></i><span>添加</span>'
                + '</a>'
                + '<a class="btn imgbtn" onclick="cms.server.showDeleteServerWin();">'
                + '<i class="icon-delete"></i><span>删除</span>'
                + '</a>';
            break;
        case 'line':
            strTools = '<a class="btn imgbtn" onclick="cms.line.showEditServerLineWin(\'add\');">'
                + '<i class="icon-add"></i><span>添加</span>'
                + '</a>'
                + '<a class="btn imgbtn" onclick="cms.line.showDeleteServerLineWin();">'
                + '<i class="icon-delete"></i><span>删除</span>'
                + '</a>';
            break;
        case 'search':
            strTools = '<select id="ddlType" class="select w85" style="margin-right:1px;">'
                + '<option value="name">按设备名称</option>'
                + '<option value="indexcode">按设备编号</option>'
                + '</select>'
                + '<input id="txtKeywords" type="text" class="txt w125" maxlength="25" value="输入要查找的设备名称" />'
                + '<a onclick="loadData();" class="btn btnsearch"></a>'
                + '<a onclick="loadAllData();" class="btn btnsearch-cancel"></a>';
            break;        
    }
    return strTools;
};

var buildCon = function(type){
    var strHtml = '';
    switch(type){
        case 'device':
            strHtml = ''
                + '<select class="select" id="ddlStatus2G_DevList" onchange="cms.device.getDeviceListData();">'
                + '<option value="-1">选择2G状态</option><option value="1">2G在线</option><option value="0">2G离线</option>'
                + '</select>'
                + '<select class="select" id="ddlStatus3G_DevList" onchange="cms.device.getDeviceListData();">'
                + '<option value="-1">选择3G状态</option><option value="1">3G在线</option><option value="0">3G离线</option>'
                + '</select>'
                + '<select class="select" id="ddlHasDevIp_DevList" onchange="cms.device.getDeviceListData();">'
                + '<option value="-1">选择是否有IP</option><option value="1">有IP的</option><option value="0">无IP的</option>'
                + '</select>'
                + '<label for="showChild_device" class="chb-label" style="_width:100px;">'
                + '<input type="checkbox" id="showChild_device" onclick="cms.device.getDeviceListData();" class="chb" />'
                + '<span>显示下级设备</span>'
                + '</label>';
            break;
        case 'camera':
            strHtml = '<label for="showChild_camera" class="chb-label" style="_width:100px;">'
                + '<input type="checkbox" id="showChild_camera" onclick="cms.camera.getCameraList();" class="chb" />'
                + '<span>显示下级监控点</span>'
                + '</label>';
            break;
    }
    return strHtml;
};

var gotoPage = function(rval){
    if(pageType != rval.action){
        time = timer;
    }
    pageType = rval.action;
    $('#statusBar .pagination').hide();
    $('#statusBar #pagination_' + pageType).show();
    showTools(rval.action);
    
    //切换页面后 重新设置表格宽度
    setBodySize();
    
    //切换TAB时，判断是否已加载TAB项内容
    if(!tabs[cms.jquery.getTabItem(tabs, pageType)].load){
        getDataContent(pageType);
    } else {
        return false;
    }
};

var refreshTreeMenu = function(){
    var unitId = tree.showTreeMenu(false, treeType, 'treeAction', true, false);
    //重新加载树菜单中，将第一个节点选中
    
};

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
};

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
};

var getTabsIndex = function(pageType){
    for(var i=0,c=tabs.length; i<c; i++){
        if(tabs[i].code == pageType){
            return i;
        }
    }
};

var setListBoxSize = function(){
    listBoxMinWidth = tabs[getTabsIndex(pageType)].listBoxWidth;
    if(boxSize.width >= listBoxMinWidth){
        listBoxMinWidth = boxSize.width;
    }
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
        case 'unit':
            $('#txtCurUnitId').attr('value', param.unitId);
            $('#txtCurUnitName').attr('value', param.unitName);
            $('#txtCurUnitCode').attr('value', param.unitCode);
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
};

var isUnitChanged = function(){
    return $('#txtOldUnitId').val() != $('#txtCurUnitId').val();
};

var getDataContent = function(pageType){
    autoPause = true;
    showLoading(true);
    switch(pageType){
        case 'device':
            cms.device.pageIndex = cms.device.pageStart;
            cms.device.getDeviceList();
            break;
        case 'camera':
            cms.camera.pageIndex = cms.camera.pageStart;
            cms.camera.getCameraList();
            break;
        case 'deviceType':
            cms.deviceType.pageIndex = cms.deviceType.pageStart;
            cms.deviceType.getDeviceTypeList();
            break;
        case 'server':
            cms.server.pageIndex = cms.server.pageStart;
            cms.server.getServerList();
            timerPlayStop(true);
            break;
        case 'line':
            cms.line.pageIndex = cms.line.pageStart;
            cms.line.getServerLine();
            timerPlayStop(true);
            break;
    }
    tabs[cms.jquery.getTabItem(tabs, pageType)].load = true;
    loaded = true;
    autoPause = false;
    showLoading(false);
};

var loadData = function(){
    switch(pageType){
        case 'device':
            cms.device.pageIndex = cms.device.pageStart;
            //$('#txtDevUnitId').attr('value', $('#txtUserUnitId').val());
            cms.device.getDeviceList();
        break;
    }
};

var loadAllData = function(){
    switch(pageType){
        case 'device':
            cms.device.pageIndex = cms.device.pageStart;
            clearKeywords();
            cms.device.getDeviceList();
        break;
    }
};

var clearKeywords = function(){
    $('#txtKeywords').attr('value', '');
};

var winCloseAction = function(pwobj){
    pwobj.Hide();
    pwobj.Clear();
};

var showDebugInfo = function(){
    module.showDebugBox();
};

cms.organize.getUnitCode = function(){
    var code = '';
    var urlparam = 'action=getUnitCode';
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/unit.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            code = data;
        }
    });
    return code;
};

cms.organize.showAddUnitWin = function(){
    timerPlayStop(true);
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var strHtml = '<div style="padding:5px 10px;">'
        + '<input id="txtParentUnitId_Add" type="hidden" value="' + unit.id + '" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('上级组织机构：','style="width:90px;"'),
            cms.util.buildTd('<input type="text" class="txt w200" readonly="readonly" disabled="disabled" value="' + unit.name + '" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('组织机构名称：'),
            cms.util.buildTd('<input id="txtUnitName_Add" type="text" class="txt w200" maxlength="64" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('组织机构编号：'),
            cms.util.buildTd('<input id="txtUnitCode_Add" type="text" class="txt w200" maxlength="64" value="' + cms.organize.getUnitCode() + '" />')
        ], '')
        + '</table>'
        + '</div>';
    var config = {
        id: 'pweditform',
        title: '添加组织机构',
        html: strHtml,
        width: 320,
        height: 180,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: 1001,
        callBack: cms.organize.addControlUnit
    };
    
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }
    cms.box.win(config);
    $('#txtUnitName_Add').focus();
};

cms.organize.addControlUnit = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var parentId = $('#txtParentUnitId_Add').val();
        var unitName = $('#txtUnitName_Add').val();
        var unitCode = $('#txtUnitCode_Add').val();
        if(unitName.trim() == ''){
            cms.box.msgAndFocus(cms.util.$('txtUnitName_Add'),{id: boxId, title: '提示信息', html: '请输入组织机构名称。', zindex: 1002}, true);
            return false;        
        } else {
            var urlparam = 'action=addControlUnit&parentId=' + parentId + '&unitName=' + escape(unitName) + '&unitCode=' + unitCode;
            $.ajax({
                type: 'post',
                //async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/unit.aspx',
                data: urlparam,
                error: function(jqXHR, textStatus, errorThrown){
                    module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR){
                    if(!data.isJsonData()){
                        module.showJsonErrorData(data);
                        return false;
                    }
                    var json = eval('(' + data + ')');
                    if (json.result == 1) {
                        success = true;
                        refreshTreeMenu();
                        pwobj.Hide();
                        cms.organize.showAddUnitWin();
                    } else if (json.result == -1) {
                        pwobj.Hide();
                        if(cms.util.dbConnection(json.error) == 0){
                            cms.box.alert({id: boxId, title: '错误信息', html: DB_CONNECTION_FAILED, iconType:'error', zindex: 1002}, true);
                        } else {
                            cms.box.alert({id: boxId, title: '错误信息', html: json.error, iconType:'error', zindex: 1002});
                        }
                        timerPlayStop(false);
                    } else if (json.result == -2) {
                        cms.box.alert({id: boxId, title: '提示信息', html: '该组织机构名称已经被使用，不能重复。', zindex: 1002}, true);
                        ishide = false;
                    } else {
                        pwobj.Hide();
                        cms.box.alert({id: boxId, title: '提示信息', html: '组织机构添加失败，请稍候再试。<br /><span style="color:#f00;">' + jsondata.error + '</span>', zindex: 1002}, true);
                    }
                }
            });
        }
    } else {
        pwobj.Hide();
        timerPlayStop(false);
    }
};

cms.organize.showEditUnitWin = function(){
    timerPlayStop(true);
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    //加载组织单元信息
    var urlparam = 'action=getUnitInfo&unitId=' + unit.id;
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/unit.aspx',
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
                var ui = jsondata.unit;
                unit.code = ui.code;
            }
        }
    });
    
    var strHtml = '<div style="padding:5px 10px;">'
        + '<input id="txtUnitId_Edit" type="hidden" value="' + unit.id + '" class="txt w30" />'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('组织机构名称：'),
            cms.util.buildTd('<input type="text" id="txtUnitName_Edit" class="txt w200" maxlength="64" value="' + unit.name + '"/>')
        ])
        + cms.util.buildTr([cms.util.buildTd('组织机构编号：'),
            cms.util.buildTd('<input id="txtUnitCode_Edit" type="text" class="txt w200" maxlength="64" value="' + unit.code + '" />')
        ], '')
        + '</table>'
        + '</div>';
    var config = {
        id: 'pweditform',
        title: '修改组织机构',
        html: strHtml,
        width: 320,
        height: 150,
        buttonText: ['保存', '取消'],
        boxType: 'form',
        zindex: 1001,
        callBack: cms.organize.editControlUnit
    };
    
    if(!cms.util.isIE6){
        config.buttonHeight = 26;
        config.buttonWidth = 50;
        config.bottomHeight = 35;
    }    
    cms.box.win(config);
    $('#txtUnitName_Edit').select();
};

cms.organize.editControlUnit = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var unitId = $('#txtUnitId_Edit').val();
        var unitName = $('#txtUnitName_Edit').val();
        var unitCode = $('#txtUnitCode_Edit').val();
        var nodeId = $('#txtNodeId').val();
        if(unitName.trim() == ''){
            cms.box.msgAndFocus(cms.util.$('txtUnitName_Edit'),{id: boxId, title: '提示信息', html: '请输入组织机构名称。', zindex: 1002}, true);
            return false;
        } else {
            var urlparam = 'action=editControlUnit&unitId=' + unitId + '&unitCode=' + unitCode + '&unitName=' + escape(unitName);            
            $.ajax({
                type: 'post',
                //async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/unit.aspx',
                data: urlparam,
                error: function(jqXHR, textStatus, errorThrown){
                    module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR){
                    if(!data.isJsonData()){
                        module.showJsonErrorData(data);
                        return false;
                    }
                    var json = eval('(' + data + ')');
                    if (json.result == 1) {
                        //更新树节点名称显示
                        tree.updateNodeText(nodeId, unitName);
                        $('#txtCurUnitName').attr('value', unitName);
                        pwobj.Hide();
                        timerPlayStop(false);
                    } else if (json.result == -1) {
                        pwobj.Hide();
                        if(cms.util.dbConnection(json.error) == 0){
                            cms.box.alert({id: boxId, title: '错误信息', html: DB_CONNECTION_FAILED, iconType:'error', zindex: 1002}, true);
                        } else {
                            cms.box.alert({id: boxId, title: '错误信息', html: json.error, iconType:'error', zindex: 1002});
                        }
                        timerPlayStop(false);
                    } else if (json.result == -2) {
                        cms.box.alert({id: boxId, title: '提示信息', html: '该组织机构名称已经被使用，不能重复。', zindex: 1002}, true);
                    } else {
                        cms.box.alert({id: boxId, title: '提示信息', html: '组织机构名称更新失败，请稍候再试。<br /><span style="color:#f00;">' + jsondata.error + '</span>', zindex: 1002}, true);
                        pwobj.Hide();
                        timerPlayStop(false);
                    }
                }
            });
        }
    } else {
        pwobj.Hide();
        timerPlayStop(false);
    }
};

cms.organize.showDeleteUnitWin = function(){
    timerPlayStop(true);
    var unit = {id: $('#txtCurUnitId').val(), name: $('#txtCurUnitName').val()};
    var strHtml = '删除组织机构，与该组织相关的设备信息及配置的资源也将被删除。<br />您确定要删除“' + unit.name + '”吗？';
    var config = {
        id: 'pwdeleteform',
        title: '警告',
        html: strHtml,
        width: '450',
        height: '120',
        boxType: 'confirm',
        callBack: cms.organize.deleteControlUnit,
        returnValue: unit.id
    };    
    var pwobj = cms.box.win(config);
    pwobj.Focus(2);
};

cms.organize.deleteControlUnit = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var unitId = pwReturn.returnValue;
        if(unitId != ''){
            var urlparam = 'action=deleteControlUnit&unitId=' + unitId;
            $.ajax({
                type: 'post',
                //async: false,
                datatype: 'json',
                url: cms.util.path + '/ajax/unit.aspx',
                data: urlparam,
                error: function(jqXHR, textStatus, errorThrown){
                    module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
                },
                success: function(data, textStatus, jqXHR){
                    if(!data.isJsonData()){
                        module.showJsonErrorData(data);
                        return false;
                    }
                    var json = eval('(' + data + ')');
                    if(json.result != 1){
                        module.showErrorInfo(json.msg, json.error);
                        pwobj.Hide();
                    } else if(json.result == 1) {
                        refreshTreeMenu();
                        pwobj.Hide();
                    } else if (json.result == -1) {
                        pwobj.Hide();
                        if(cms.util.dbConnection(json.error) == 0){
                            cms.box.alert({id: boxId, title: '错误信息', html: DB_CONNECTION_FAILED, iconType:'error', zindex: 1002}, true);
                        } else {
                            cms.box.alert({id: boxId, title: '错误信息', html: json.error, iconType:'error', zindex: 1002});
                        }
                    }
                }
            });
        }
    }
    pwobj.Hide();
};

//显示加载
var showLoading = function(show){
    if(show){
        $("#loading").show();
        $("#loading").html("正在加载数据，请稍候...");
    }
    else{
        $("#loading").hide();
    }
};

var refresh = function(){
    getDataContent(pageType);
};

var updateTimeBoard = function(time){
    $('#timeboard .ts').html(time);
};

//定时器
var timerPlay = function(obj){
    pause = !pause;
    setTimePlay(obj, pause);
};

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
};

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