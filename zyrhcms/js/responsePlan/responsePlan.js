var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 400;
var rightWidth = 0;
var switchWidth = 5
var boxSize = {};
var boxId = 'pwboxid001';

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var arrMarker = [];
var arrLabel = [];

//预案内容窗体
var planWins = [];
//功能模块窗体
var moduleWins = [];

var menuBoxWidth = 300;

var arrWin = [
    {id:'plan',name:'预案',url:''},
    {id:'accident',name:'事故信息',url:''},
    {id:'dev',name:'设备信息',url:''},
    {id:'patrol',name:'巡检记录',url:''},
    {id:'preview',name:'视频预览',url: cms.util.path + '/modules/responsePlan/sub/preview.aspx?devCode=122'},
    {id:'modify',name:'检修记录',url:''},
    {id:'cad',name:'CAD图纸',url:cms.util.path + '/modules/responsePlan/sub/cad.aspx'},
    {id:'6c',name:'6C检测图像',url:''},
    {id:'gpsPlayback',name:'GPS轨迹回放',url:cms.util.path + '/modules/responsePlan/sub/gpsTrack.aspx'}
];

var winLandmark = null;

$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, rightWidth);
    //cms.frame.setFullScreen(true);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    emap.initialEmap();
    
    initialForm();
    setLeftDisplay($('#bodyLeftSwitch'));
    
    //window.setTimeout(emap.initialEmap, 2000);
        
    window.setTimeout(loadEmapLandmark, 5000);
    
    cms.frame.setFrameByShortcutKey();
    //window.setTimeout(showResponseStat, 1000);
});

$(window).resize(function(){
    setBodySize();
});

var posX = 0;
var posW = 0;

var initialForm = function(){
    $('#bodyLeftSwitch').click(function(){
        setLeftDisplay($(this));
    });    
    
    cms.jquery.tabs('#tabModule', null, '.tabcontainer');
    cms.jquery.tabs('#tabAccident', null, '.planlist');
    
    $('.emap-menu-list').width(menuBoxWidth);
    $('.emap-menu-list-bg').width(menuBoxWidth);
    
    //显示内容模块窗体
    //showModuleWin();
    
    showTestWin();
    
    loadTileStat(emap.map.getZoom());
    
    testdata.buildTable();
    
    typetree.loadTypeTree();
    
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
    $('.tabpanel-vertical').height(boxSize.height);
    $('#tabContainer').width(leftWidth - 2);
    $('#toolbar').height(26);
    $('#mapCanvas').width(boxSize.width - (cms.util.isMSIE ? 1 : 0));
    $('#mapCanvas').height(boxSize.height - 27 - (cms.util.isMSIE ? 1 : 0));
    $('#menuBox').width(boxSize.width - (cms.util.isMSIE ? 1 : 0));
    
    /*设置地图上部菜单按钮半透明背景层X坐标*/
    $('.emap-menu-list-bg').css('left', (boxSize.width-menuBoxWidth)/2);
    $('.emap-menu-list-bg').height(2);
    
    /*以下是左边面板布局尺寸*/
    $('#listResponsePlan').height(boxSize.height - 150 - 120 - 25*2 - 27);
    
    $('#treePlanType').height(boxSize.height - 180 - 27);
    
};

var setLeftDisplay = function(obj){
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
}

var showResponseStat = function(){
    var strHtml = '';
    var config = {
        title: '预案实时统计',
        html: strHtml,
        width: 240,
        height: 150,
        noBottom: true,
        minAble: true,
        minWidth: 125,
        showMinMax: true,
        closeAble: false,
        lock: false,
        position: 3,
        x: 5,
        y: 98
    };
    cms.box.win(config);
};


var getPlanType = function(action, obj, objBox){
    var urlparam = 'action=' + action; //'getPlanLevel';
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/responsePlan.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        success: function(data) {
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                    var list = jsondata.list;
                    if(action == 'getPlanLevel'){
                        buildPlanLevel(obj, objBox, list);
                    } else if(action == 'getPlanType'){
                        buildPlanType(obj, objBox, list);
                    }
                } else {
                    module.showDataError({html:jsondata.error, width:400, height:250});
                }
            }
        }
    });
};

var buildPlanType = function(obj, objBox, planTypeList){
    var config = {parentId:0, data:planTypeList, maxHeight:'200',width:'304',event:'focus', recursion:true};
    new DropDownList(obj, 'planType', config, objBox);
};

var buildPlanLevel = function(obj, objBox, planLevelList){
    new DropDownList(obj, 'planLevel', {parentId:0, width:150, data:planLevelList,event:'focus'}, objBox);
};

var setObjDisabled = function(obj, disabled){
    if(obj == null || obj == undefined) return false;
    if(disabled){
        obj.disabled = true;
        obj.style.color = '#999';
    } else {
        obj.disabled = false;
        obj.style.color = '#000';
    }
};

var editResponsePlan = function(btn){
    if(btn != undefined && btn != null){
        if(btn.disabled){
            return false;
        }
        setObjDisabled(btn, true);
    }
    
    var strHtml = '<div style="padding:5px 0;">'
        + '<table cellpadding="0" cellspacing="0" class="tbform">'
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>预案名称：','class="tdr"'),
            cms.util.buildTd('<input type="text" id="txtPlanName_PlanForm" class="txt w300" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>预案类型：','class="tdr w85"'),
            cms.util.buildTd('<div id="divPlanType" style="position:relative;"><input type="text" id="txtPlanType_PlanForm" /></div>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>严重等级：','class="tdr"'),
            cms.util.buildTd('<div id="divPlanLevel" style="position:relative;"><input type="text" id="txtPlanLevel_PlanForm" /></div>')
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>人员伤亡：','class="tdr"'),
            cms.util.buildTd('<select id="ddlCasualty_PlanForm" onchange="setCasualtyPanelDisabled();" class="select w50" style="margin-right:20px;"><option value="0">无</option><option value="1">有</option></select>'
                + '<span id="casualty_panel">'
                + '受伤：<input type="text" id="txtLatLng_PlanForm" class="txt w40 text-center" value="0" maxlength="8" style="margin-right:2px;" />人' 
                + '<span style="margin-left:20px;">死亡：</span>'
                + '<input type="text" id="txtLatLng_PlanForm" class="txt w40 text-center" value="0" maxlength="8" style="margin-right:2px;" />人'
                + '</span>'
            )
        ])
        + cms.util.buildTr([cms.util.buildTd('<em>*</em>GPS定位：','class="tdr"'),
            cms.util.buildTd('<input type="text" id="txtLatLng_PlanForm" class="txt w200" />')
        ])
        + cms.util.buildTr([cms.util.buildTd('预案描述：','class="tdr" style="vertical-align:top;"'),
            cms.util.buildTd('<textarea id="txtPlanDesc_PlanForm" class="txt" style="width:300px;height:100px;margin-top:3px;" rows="" cols=""></textarea>')
        ])
        + '</table>'
        + '</div>';
    var config = {
        id: 'pweditplan',
        title: '应急预案发布',
        html: strHtml,
        width: 420,
        height: 450,
        bottomHeight: 35,
        buttonHeight: 26,
        lock: false,
        buttonText: ['发布','取消'],
        callBack: editResponsePlanAction,
        returnValue: btn
    };
    cms.box.form(config);
    
    getPlanType('getPlanType', cms.util.$('txtPlanType_PlanForm'), cms.util.$('divPlanType'));
    getPlanType('getPlanLevel', cms.util.$('txtPlanLevel_PlanForm'), cms.util.$('divPlanLevel'));
    
    setCasualtyPanelDisabled();
};

var setCasualtyPanelDisabled = function(disabled){
    var disabled = $('#ddlCasualty_PlanForm').val() == 0;
    $('#casualty_panel input').attr('disabled', disabled);
    if(disabled){
        $('#casualty_panel input').attr('value', '0');
    }
};

var editResponsePlanAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
    
    }
    pwobj.Hide();
    pwReturn.returnValue.disabled = false;
};

var showResponsePlanManage = function(obj){
    if(obj != undefined && obj != null){
        if(obj.disabled){
            return false;
        }
        setObjDisabled(obj, true);
    }
    
    var strHtml = '';
    var config = {
        id: 'pwcm',
        title: '应急预案管理',
        html: strHtml,
        width: 240,
        height: 180,
        noBottom: true,
        position: 3,
        x: 5,
        y: 258,
        lock: false,
        minAble: true,
        minWidth: 200,
        maxAble: true,
        showMinMax: true,
        opacity: 0.98,
        //不限制窗体拖动范围
        dragRangeLimit: false,
        callBack: closeWin,
        returnValue: obj,
        callBackByResize: popwinResize
    };
    var pw = cms.box.win(config);
};

var hideWin = function(pwobj, pwReturn){
    pwobj.Hide();
    
    setObjDisabled(pwReturn.returnValue, false);
};

var closeWin = function(pwobj, pwReturn){
    pwobj.Hide();
    
    setObjDisabled(pwReturn.returnValue, false);
};

var showResponsePlan = function(obj, plan){
    if(obj != undefined && obj != null){
        if(obj.disabled){
            return false;
        }
        setObjDisabled(obj, true);
    }
    
    var strHtml = '<div class="tabpanel" id="pwtabpanel"></div><div id="listBoxPanel"></div>';
    var tabs = [
        {code: 'cad', name: 'CAD图纸', load: false},
        {code: 'device', name: '设备资料', load: false},
        {code: 'patrol', name: '巡检记录', load: false},
        {code: 'repair', name: '检修记录', load: false},
        {code: 'preview', name: '视频预览', load: false}
    ];
    /*
    var config = {
        id: 'pwemaporg',
        title: '应急预案' + ' - ' + plan.name,
        html: strHtml,
        width: 700,
        height: 500,
        noBottom: true,
        lock: false,
        minAble: true,
        minWidth: 200,
        maxAble: true,
        showMinMax: true,
        //opacity: 0.98,
        //不限制窗体拖动范围
        dragRangeLimit: false,
        callBack: closeWin,
        returnValue: obj,
        callBackByResize: popwinResize
    };
    wid = cms.box.win(config);
    */
    var urlparam = 'action=getPlanTypeModule&typeId=' + plan.type;
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/responsePlan.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) == 'function'){CollectGarbage();} },
        success: function(data) {
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                    loadResponsePlanModule(jsondata.list, plan);
                } else {

                }
            }
        }
    });
    
};

var loadResponsePlanModule = function(list, plan){
    var tabs = [];
    for(var i=0; i<planWins.length; i++){
        planWins[i].Hide();
    }
    
    for(var m=0; m<list.length; m++){
        tabs.push({code:list[m].id,name:list[m].name, load:false});
    }
    for(var i=0; i<tabs.length; i++){
        /*
        var len = tabs[i].name.len();
        var txtlen = 10;
        var strTitle = len > txtlen ? tabs[i].name : '';
        var strName = len > txtlen ? tabs[i].name.gbtrim(txtlen, '..') : tabs[i].name;
        var strTab = '<a class="' + (i == 0 ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#listBox_' + tabs[i].code + '">'
            + '<span title="' + strTitle + '">' + strName + '</span>'
            + '</a>';
        */
        /*
        var strTab = cms.jquery.buildTab(tabs[i].code, tabs[i].name, 10, '#listBox_' + tabs[i].code, false);
        $('#pwtabpanel').append(strTab);
        
        var strHtml = '<div id="listBox_' + tabs[i].code + '" class="listbox" ' + (i == 0 ? '':' style="display:none;"') + '>'
            + tabs[i].name
            + '</div>';
        $('#listBoxPanel').append(strHtml);
        */
    }
    var strHtml = '';
    var zindex = 1000;
    for(var i=0; i<tabs.length; i++){
        /*
        var strTab = cms.jquery.buildTab(tabs[i].code, tabs[i].name, 10, '#listBox_' + tabs[i].code, false);
        $('#pwtabpanel').append(strTab);
        
        var strHtml = '<div id="listBox_' + tabs[i].code + '" class="listbox" ' + (i == 0 ? '':' style="display:none;"') + '>'
            + tabs[i].name
            + '</div>';
        $('#listBoxPanel').append(strHtml);
        */
        strHtml = tabs[i].name;
        var config = {
            id: 'pwplan_' + tabs[i].code,
            title: tabs[i].name + ' - ' + plan.name,
            html: strHtml,
            //boxType: 'iframe',
            //requestType: 'iframe',
            width: 300,
            height: 200,
            noBottom: true,
            position: '1',
            x: 300 + i*50,
            y: 150 + i*30,
            lock: false,
            minAble: true,
            minWidth: 200,
            maxAble: true,
            showMinMax: true,
            topMost: true,
            zindex: zindex + i*5,
            //opacity: 0.98,
            //不限制窗体拖动范围
            //dragRangeLimit: false,
            callBack: closeWin,
            callBackByResize: popwinResize
        };
        planWins[i] = cms.box.win(config);
    }
    /*
    cms.jquery.tabs('#pwtabpanel', '#listBoxPanel', '.listbox', 'switchTab');
    */
};

var popwinResize = function(pwmodel){
    
};

var switchTab = function(param){
    
};

var showTestWin = function(){
    var strHtml = '<table id="tbTileStat" class="tblist" cellpadding="0" cellspacing="0"></table>';
    var config = {
        id: 'pwrailway',
        title: '铁路图统计',
        html: strHtml,
        noBottom: true,
        width: 260,
        height: 302,
        closeAble: false,
        lock: false,
        position: 9,
        minAble: true,
        showMinMax: true
    };
    var pwtest = cms.box.win(config);
    pwtest.Min();
};

var loadTileStat = function(zoom){
    var urlparam = 'action=statRailwayTile';
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/emap.aspx',
        data: urlparam,
        error: function(data){
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        success: function(data) {
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                    fillTileStat(jsondata, parseInt(zoom, 10));
                } else if(jsondata.result == 2){

                } else {

                }
            }
        }
    });
};

var fillTileStat = function(jsondata, zoom){
    var list = jsondata.list;
    var obj = cms.util.$('tbTileStat');
    
    cms.util.clearDataRow(obj, 0);
    var rid = 0;
    var row = obj.insertRow(rid++);
    var rowData = [];
    var cellid = 0;
    
    rowData[cellid++] = {html: '缩放等级', style:[['width','60px'],['textAlign', 'center']]};
    rowData[cellid++] = {html: '图片数量', style:[['width','60px']]};
    rowData[cellid++] = {html: '缩放等级', style:[['width','60px'],['textAlign', 'center']]};
    rowData[cellid++] = {html: '图片数量', style:[['width','60px']]};
    rowData[cellid++] = {html: '', style:[]}; //空
    
    cms.util.fillTable(row, rowData);
    
    for(var i=0,c=list.length; i<c; i+=2){
        row = obj.insertRow(rid);
        rowData = [];
        cellid = 0;
        var idx = i;
        
        rowData[cellid++] = {html: list[idx].zoom, style:[['width','60px'],['textAlign', 'center'],['color',zoom == parseInt(list[idx].zoom,10) ? '#f00' : '#000']]};
        rowData[cellid++] = {html: list[idx].total, style:[['width','60px'],['textAlign', 'center'],['background', zoom == parseInt(list[idx].zoom,10) ? '#f00' : '#fff']]};
        
        idx = i+1;
        if(idx < c){
            rowData[cellid++] = {html: list[idx].zoom, style:[['width','60px'],['textAlign', 'center'],['color',zoom == parseInt(list[idx].zoom,10) ? '#f00' : '#000']]};
            rowData[cellid++] = {html: list[idx].total, style:[['width','60px'],['textAlign', 'center'],['background', zoom == parseInt(list[idx].zoom,10) ? '#f00' : '#fff']]};
        }
        rowData[cellid++] = {html: '', style:[]}; //空
        
        cms.util.fillTable(row, rowData);
        rid++;
    }
};

var appendImagePath = function(path){
    if(path.indexOf('http://img.railmap.cn/tile/') < 0){
        return false;
    }
    var urlparam = 'action=downloadImage&path=' + path;
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/emap.aspx',
        data: urlparam,
        error: function(data){alert(data);
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        success: function(data) {
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){

                } else if(jsondata.result == 2){

                } else {

                }
            }
        }
    });
};


var loadEmapLandmark = function(zoom){
    var urlparam = 'action=getLandmark&zoom=' + zoom;
    $.ajax({
        type: 'post',
        async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/emap.aspx',
        data: urlparam,
        error: function(data){alert(data);
            cms.box.alert({id: boxId, title: '错误信息', html: data});
        },
        success: function(data) {
            if(!data.isJsonData()){
                module.showDataError({html:data, width:400, height:250});
                return false;
            } else {
                var jsondata = data.toJson();//eval('(' + data + ')');
                if(jsondata.result == 1){
                    showLandmark(jsondata);
                } else if(jsondata.result == 2){

                } else {

                }
            }
        }
    });
};

var showLandmark = function(jsondata){
    var iconPath = cms.util.path + '/skin/default/images/common/emap/building.gif';
    var list = jsondata.list;    
    var ptxy = new MapCorrect();
    for(var i=0,c=list.length; i<c; i++){
        var obj = ptxy.offset(parseFloat(list[i].lat), parseFloat(list[i].lng));
        var latlng = new google.maps.LatLng(obj.lat, obj.lng);
        var marker = new google.maps.Marker({
	        position: latlng,
	        map: emap.map,
	        icon: iconPath,
	        title: list[i].name
        });
                
        google.maps.event.addListener(marker, 'click', function(){
            showLandmarkInfo(event, this);
        });
    }
};

var showLandmarkInfo = function(e, mark){
    var evt = window.event || arguments.callee.caller.arguments[0];
    var pos = {x: evt.clientX, y: evt.clientY};
    var strHtml = '<div style="padding:5px;">' 
        + mark.title + '<br />' 
        + '纬度：' + mark.position.lat() + '<br />' 
        + '经度：' + mark.position.lng() + '<br />' 
        + pos.x + ',' + pos.y 
        + '</div>';
    var config = {
        id: 'pwLandmark',
        title: mark.title,
        html: strHtml,
        position: 'custom',
        x: pos.x,
        y: pos.y,
        width: 180,
        hieght: 120,
        bgOpacity: 0.3,
        noBottom: true
    };
    winLandmark = cms.box.win(config);
};

function GetEvent(){
    return window.event || arguments.callee.caller.arguments[0];
};

function showModuleWin(){
    var strHtml = '';
    var zindex = 1000;
    var bodySize = cms.util.getBodySize();
    var winSize = [300, 200];
    for(var i=0; i<arrWin.length; i++){
        winSize = arrWin[i].id == 'preview' ? [460, 320] : [300, 200];
        strHtml = arrWin[i].url != '' ? arrWin[i].url : arrWin[i].name;
        var config = {
            id: 'pwplan_' + arrWin[i].id,
            title: arrWin[i].name + (cms.box.buildIframe(bodySize.width, bodySize.height, true)),
            html: strHtml,
            //boxType: 'iframe',
            //requestType: 'iframe',
            width: winSize[0],
            height: winSize[1],
            noBottom: true,
            position: '7',
            x: 10 + i*100,
            y: 10,
            lock: false,
            minAble: true,
            minWidth: 200,
            maxAble: true,
            showMinMax: true,
            topMost: true,
            topMostType: 1,
            //opacity: 0.98,
            //不限制窗体拖动范围
            //dragRangeLimit: false,
            callBack: closeWin,
            callBackByResize: popwinResize
        };
        if(arrWin[i].url != ''){
            config.boxType = 'iframe';
            config.requestType = 'iframe';
        }
        planWins[i] = cms.box.win(config);
    }
};

var showMenu = function(){
    $('.emap-menu-list-bg').show();
    $('.emap-menu-list-bg').height(30);
    $('.emap-menu-list ul').show();
};

var hideMenu = function(){
    $('.emap-menu-list-bg').show();
    $('.emap-menu-list-bg').height(2);
    $('.emap-menu-list ul').hide();

};