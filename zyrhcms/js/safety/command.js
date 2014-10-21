var safety = safety || {};
safety.command = safety.command || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 320;
var rightWidth = 0;
var switchWidth = 5
var boxSize = {};
var boxId = 'pwboxid001';
var pwWorkPlan = null;

var treeType = 'camera';
var treeTitle = '作业车辆现场视频信息';
var isSearchTree = false;
var treekeys = '';

var arrMarker = [];
var arrLabel = [];

//预案内容窗体
var planWins = [];
//功能模块窗体
var moduleWins = [];

var menuBoxWidth = 300;

var tabs = [
    {code: 'gis', name: 'GIS地图', objName: 'oamapCanvas', load: false},
    {code: 'static', name: '段管界地图', objName: 'omapCanvas', load: false}
];
//当前地图类型
var curTab = 'gis';

var isLoadDepartment = false;

$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, rightWidth);
    //cms.frame.setFullScreen(true);
    setLeftDisplay($('#bodyLeftSwitch'));
    
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    
    if(!isInLAN){
        //创建树型菜单表单
        tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', false, leftWidth, '3');
        //加载树型菜单
        tree.showTreeMenu(false, treeType, 'treeAction', false, true, true, false, true);
        //定时刷新树型菜单设备状态
        tree.timer = window.setTimeout(tree.updateDevStatus, 15*1000, 15*1000);
        setBodySize();
    }
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
});

$(window).resize(function(){
    setBodySize();
});

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });
    
    if(isInLAN){    
        for(var i=0; i<tabs.length; i++){
            var strTab = '<a class="' + (tabs[i].code == curTab ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#' + tabs[i].objName + '"><span>' + tabs[i].name + '</span></a>';
            $('#tabpanel').append(strTab);
            
            if(tabs[i].code == curTab){
                $('#' + tabs[i].objName).show();
            }
        }
        cms.jquery.tabs('#toolbar .tabpanel', null, '.mapbox', 'switchMap');
        
        oamap.initialEmap(cms.util.$('oamapCanvas'), boxSize, initialModulecIcon);
        var mapOption = {
            boxSize: boxSize,
            zoomControlOptions: {
                y: 62
            }
        };
        omap.initialEmap(cms.util.$('omapCanvas'), mapOption);
        
        landmark.showLandmarkBase();
        
        //获得部门信息
        //baseinfo.getDepartment(cms.util.$('txtDepartmentId'), cms.util.$('ddlDepartment'), deptCallBack);

        baseinfo.getRailwayLineList(cms.util.$('ddlLine'));
        baseinfo.getUpDownLine(cms.util.$('ddlUpDownLine'), '');
        //延时 加载区间信息
        window.setTimeout(getLineRegionList, 100);

        changeDevType(10000);
        
        selectDevType(10000, 10100, cms.util.$('devType_' + 10100));
                
        initialModulecIcon();
    } else {
        try{
            window.setTimeout(emap.initialEmap, 1000);
        }
        catch(e){}
        safety.preview.iniPreviceDev();
        window.setTimeout(safety.gps.showDeviceLocation, 600);
    }
    flowControl.initialProcess();
};

var initialModulecIcon = function(){
    window.setTimeout(oamap.setCenterAndZoom, 1000, 30.66078, 114.36857, 3);
    window.setTimeout(landmark.showLandmarkBaseInGis, 1000);
    window.setTimeout(safety.accident.showAccidentList, 1000, true);
    
    var objBox = cms.util.$('mapCanvasBox');
    var objCanvas = cms.util.$('oamapCanvas');
    var divBar = document.createElement('DIV');
    divBar.className = 'oamap-toolbar';
    var dir = cms.util.path + '/skin/default/images/railway/toolbar/';
    var strHtml = '<ul style="float:right;">'
        + '<li><a onclick="oamap.showDrawControl();"><img src="' + dir + 'measure.png" />测量</a></li>'
        + '<li><a onclick="oamap.showLayerControl();"><img src="' + dir + 'history.png" />图层</a></li>'
        + '</ul>';    
    divBar.innerHTML = strHtml;
    objCanvas.appendChild(divBar);
    
    divBar1 = document.createElement('DIV');
    divBar1.className = 'map-toolbar';
    strHtml = '<ul style="padding:0 0 0 5px;">'
        + '<li><a onclick="showPlanList();"><img src="' + dir + 'plan.png" />应急预案</a></li>'
        + '<li><a onclick="safety.accident.showFlowChartDemo();" style="color:#00f;"><img src="' + dir + 'gprs.png" />应急流程</a></li>'
        + '<li><a onclick="showAccidentList();" style="color:#f00;"><img src="' + dir + 'gprs.png" />故障处理</a></li>'
        + '<li><a onclick="showAddressList();"><img src="' + dir + 'user.png" />通讯录</a></li>'
        + '<li><a onclick="landmark.getSupplyInfo(this);setModuleIcon(this);" lang="0" rel=""><img src="' + dir + 'material.png" />应急物资</a></li>'
        + '<li><a onclick="showAccidentLog();"><img src="' + dir + 'history.png" />故障记录</a></li>'
        + '<li><a onclick="setLeftDisplay($(\'#bodyLeftSwitch\'));"><img src="' + dir + 'search.png" />综合查询</a></li>'
        + '<li><a onclick="showDrawing();"><img src="' + dir + 'draw.png" />图纸查询</a></li>'
        + '</ul>';
    divBar1.innerHTML = strHtml;    
    objBox.appendChild(divBar1);
};

var setModuleIcon = function(btn){
    if(btn.rel == ''){
        btn.rel = 'cur';
        btn.className = 'cur';
    } else {
        btn.rel = '';
        btn.className = '';    
    }
};

var switchMap = function(rval){
    //切换到静态地图时 需要设置一下地图当前缩放比例 重新计算标记位置点
    if(rval.action == 'static'){
        omap.getZoom();
    }
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
    rightWidth = cms.frame.rightWidth;
    $('#pageBody').css('padding-top', paddingTop);
    //$('#bodyTop').css('margin-bottom', paddingTop);
    
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
    setLeftPanelSize();
};

var getDateTime = function(){
    var urlparam = 'action=getDateTime&format=' + escape('yyyy年MM月dd日 HH:mm:ss') + '&showWeedDay=1';
    $.ajax({
        type: "post", 
        //async: false, //同步
        datatype: 'json',
        url: cms.util.path + '/ajax/common.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            $('#timeboard').html(data);
            window.setTimeout(getDateTime, 500);
        }
    });
};

var setBoxSize = function(){
    $('#mainContent').width(boxSize.width);
    $('#mainContent').height(boxSize.height);
    if(!isInLAN){
        $('#mapCanvas').width(boxSize.width - (cms.util.isMSIE ? 1 : 0));
        $('#mapCanvas').height(boxSize.height - 27 - (cms.util.isMSIE ? 1 : 0));
    } else {
        $('#omapCanvas').width(boxSize.width);
        $('#omapCanvas').height(boxSize.height - 25);
        
        $('#oamapCanvas').width(boxSize.width);
        $('#oamapCanvas').height(boxSize.height - 25);
        
        omap.changeSize(boxSize);
    }
};

var setLeftDisplay = function(obj){
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
    
    if(!isLoadDepartment && $('#bodyLeft').is(':visible')){
        //获得部门信息
        baseinfo.getDepartment(cms.util.$('txtDepartmentId'), cms.util.$('ddlDepartment'), deptCallBack);
    }
};

var setLeftPanelSize = function(){    
    setLeftPanelBoxSize();    
    $('#leftPanel .titlebar').css('cursor','pointer');
    $('#leftPanel .titlebar').click(function(){
        if($(this).next('.box-panel').is(":hidden")){
            $("#leftPanel .box-panel").slideUp('fast');
            $('#leftPanel .titlebar a').removeClass();
            $('#leftPanel .titlebar a').addClass('switch sw-close');
            $(this).next('.box-panel').animate({height: 'toggle', opacity: 'toggle'}, 'fast');
            $(this).find('a').removeClass();
            $(this).find('a').addClass('switch sw-open');
        }
        setLeftPanelBoxSize();        
    });
};

var setLeftPanelBoxSize = function(){
    var c = $('#leftPanel .titlebar').size();
    var topHeight = isInLAN ? 165 : 0;
    $('#common_form').height(topHeight - 26);
    var totalHeight = boxSize.height - 25 * c - topHeight;
    $('#leftPanel .box-panel').height(totalHeight);
    
    setLeftItemPanelSize();
};

var setLeftItemPanelSize = function(){
    var c = $('#leftPanel .titlebar').size();
    var topHeight = isInLAN ? 165 : 0;
    var height = boxSize.height - 25 * c - topHeight
    
    $('#divDevListBox').height(height - 49);
    $('#divDevList').height(height - 49 - 25);
};

//部门改变后 重新加载区间
var deptCallBack = function(){
    baseinfo.curDepartmentId = $('#txtDepartmentId').val().trim();
    getLineRegionList();
};

var getLineRegionList = function(){
    try{
        var deptInfo = baseinfo.getDepartmentIndexCode(baseinfo.curDepartmentId);
        var lineIndexCode = $('#ddlLine').val().trim();
        
        baseinfo.getLineRegionList(cms.util.$('ddlRegion'), lineIndexCode, deptInfo[0]);
        
        window.setTimeout(getTensionLengthList, 100);
    }
    catch(e){}
};

var getTensionLengthList = function(){
    var deptInfo = baseinfo.getDepartmentIndexCode(baseinfo.curDepartmentId);
    var regionIndexCode = $('#ddlRegion').val().trim();
    var upDownLine = $('#ddlUpDownLine').val().trim();
    
    if(!regionIndexCode.equals('')){
        baseinfo.getTensionLengthList(cms.util.$('ddlTensionLength'), regionIndexCode, deptInfo[0], upDownLine);
    } else {
        baseinfo.initialList(cms.util.$('ddlTensionLength'), '', '请选择锚段');
    }
};

var getDeviceList = function(type, subtype){
    if(20000 == type){
        var lineIndexCode = cms.util.$('ddlLine').value.trim();
        var typeIdList = subtype;
        baseinfo.getSubstationList(lineIndexCode, typeIdList, cms.util.$('tbDevInfoHeader'), cms.util.$('tbDevInfoList'));
    } else if(30000 == type){
    
    } else{
        if(subtype == '' || subtype == undefined){
            subtype = 10100;
        }
        var tensionLengthIndexCode = $('#ddlTensionLength').val().trim();
        safety.device.curTensionLengthIndexCode = tensionLengthIndexCode;
        if(!safety.device.curTensionLengthIndexCode.equals('') && safety.device.curDevType == 10000 && subtype == 10100){
            deviceDetail.showTensionLengthDetail(tensionLengthIndexCode);
        }
        if(!tensionLengthIndexCode.equals('') && safety.device.curDevType == 10000){
            safety.device.getDeviceList(subtype, safety.device.curTensionLengthIndexCode, cms.util.$('tbDevInfoHeader'),cms.util.$('tbDevInfoList'));
        } else {
        
        }
    }
};

var showPlanList = function(){
    safety.eplan.showPlanList();
};

var showAccidentList = function(){
    safety.accident.showAccidentList();
};

var exit = function(){
    cms.box.confirm({
        title: '退出',
        html: '确定要退出应急指挥吗？',
        callBack: exitCallBack
    });
};

var exitCallBack = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        pwobj.Hide();
        module.moduleAction('30100','');
    }
};

var showAddressList = function(){
    var size = module.checkWinSize(850, 550);
    var strHtml = cms.util.path + '/modules/safety/addressList.aspx';
    var config = {
        id: 'pwAddressList',
        title: '通讯录',
        html: strHtml,
        boxType: 'window',
        requestType: 'iframe',
        width: size[0],
        height: size[1],
        noBottom: true,
        maxAble: true,
        showMinMax: true,
        closeType: 'hide',
        build: 'show',
        reload: false,
        lock: false
    };
    cms.box.win(config);
};

var showAccidentLog = function(){
    var size = module.checkWinSize(850, 550);
    var strHtml = cms.util.path + '/modules/safety/eventLog.aspx';
    var config = {
        id: 'pwAccidentLog',
        title: '故障记录',
        html: strHtml,
        boxType: 'window',
        requestType: 'iframe',
        width: size[0],
        height: size[1],
        noBottom: true,
        maxAble: true,
        showMinMax: true,
        closeType: 'hide',
        build: 'show',
        reload: false,
        lock: false
    };
    cms.box.win(config);
};

var showDrawing = function(){
    var size = module.checkWinSize(850, 550);
    var strHtml = '';
    var config = {
        id: 'pwDrawing',
        title: '图纸查询',
        html: strHtml,
        boxType: 'window',
        requestType: 'iframe',
        width: size[0],
        height: size[1],
        noBottom: true,
        maxAble: true,
        showMinMax: true,
        closeType: 'hide',
        build: 'show',
        reload: false,
        lock: false
    };
    cms.box.win(config);
};

var mapCallback = function(type, id, name, action){
    //alert(type + ',' + id + ',' + name + ',' + action);
    switch(type){
        case 'pillar':
            deviceDetail.showPillarDetail(id, action, name);
        case 'event_point':
            switch(action){
                case 'pillar':
                    var arr = id.split('_');
                    var code = arr[0];
                    var pcode = arr[1];
                    deviceDetail.showPillarDetail(code, pcode, '');
                    break;
                case 'substation':
                    var arr = id.split('_');
                    var code = arr[0];
                    var sname = arr[1];
                    deviceDetail.showSubstationDetail(code, sname);
                    break;
            }
            break;
        case '2':
            break;
        case '3':
            break;
        case '4':
            supply.showSupplyInfo(action, name);
            break;
        case '5':
        case '6':
        case '7':
        case '8':
            deviceDetail.showSubstationDetail(action, name);
            break;
        default:
            break;
    }
};