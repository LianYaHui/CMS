var emap = emap || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 220;
var rightWidth = rightWidthConfig = 0;
var listboxHeight = listboxHeightConfig = 165;
var leftFormHeight = 165;
var listMinWidth = 1050;
var switchWidth = 5
var boxSize = {};
/*
var listBoxHeightConfig = [26, 165, 282];
var listBoxHeight = 165;
var listBoxWinModeConfig = [0, 1, 2];
var listBoxWinMode = 1;
*/
var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

//设备ICON图标
var arrDevIcon = [];

var tabs = [
    {code: 'bmap', name: '百度地图', load: false},
    {code: 'gmap', name: '谷歌地图', load: false}
    //{code: 'amap', name: 'ArcGIS地图', load: false},
    //{code: 'omap', name: '静态地图', load: false}
];

var curMapEngine = mapConfig.mapEngine;

var isShowDevGps = true;
var arrDevMarker = [];
var devGpsTimer = null;
var devGpsTiming = 15*1000;
var pwDevNoGps = null;
var arrFollowDev = [];
var isAllowFollow = true;
var showMarkerLabel = true;

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    cms.frame.setFrameSize(leftWidth, rightWidth);
    cms.frame.setPageBodyDisplay();
    //隐藏顶部
    cms.frame.setHeaderDisplay($('#switchHeader'));

    loadMapJs();
    
    //加载设备ICON图标
    getDevIconData();
    
    initialForm();
    
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    
    var checkbox = {callback:'setDeviceChecked'};
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true, false, false, true, true, '', checkbox);
    //定时刷新树型菜单设备状态
    tree.timer = window.setTimeout(tree.updateDevStatus, 30*1000, 30*1000);

    setBodySize();
    
    initialListBox();

    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
    
    window.setTimeout(getDeviceGps, 2000);
});

$(window).resize(function(){
    cms.frame.setFrameSize();
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
        if(tabs[i].code != curMapEngine){
            continue;
        }
        var strTab = '<a class="' + (tabs[i].code == curMapEngine ? 'cur':'tab') + '" lang="' + tabs[i].code + '" rel="#mapCanvas_' + tabs[i].code + '">'
            + '<span>' + tabs[i].name + '</span></a>';
        $('#tabpanel').append(strTab);
        strHtml += '<div id="mapCanvas_' + tabs[i].code + '" class="mapcanvas" ' + (tabs[i].code == curMapEngine ? '':' style="display:none;"') + '></div>';
    }
    $('#mapCanvas').append(strHtml);
        
    cms.jquery.tabs('#mainTitle .tabpanel', null, '.mapcanvas', 'switchMap');
    
    buildLeftForm();
    
    initialMap(curMapEngine);
    
    window.setTimeout(getDeviceGpsList, 2000);
};

var buildLeftForm = function(){
    var strHtml = '<div class="titlebar" style="border-top:solid 1px #99bbe8;"><div class="title">操作菜单</div></div>';

    $('#leftForm').html(strHtml);
};

var loadMapJs = function(){
    cms.util.loadJs(cmsPath, '/js/emap/bmap.js');
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
    rightWidth = $('#bodyRight').is(':visible') ? rightWidthConfig : 0;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - leftWidth - rightWidth - switchWidth - borderWidth, 
        height: frameSize.height - borderWidth - paddingTop - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyMain').width(boxSize.width);
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    $('#bodyMain').height(boxSize.height);
    /*
    $('#bodyRight').width(rightWidth - borderWidth);
    $('#bodyRightSwitch').width(switchWidth);
    $('#bodyRight').height(boxSize.height);
    $('#bodyRightSwitch').height(boxSize.height);
    */
    
    setBoxSize();
};

var setBoxSize = function(){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52 - leftFormHeight);
    
    $('#mapCanvas').width(boxSize.width);
    $('#mapCanvas').height(boxSize.height - 25 - listboxHeight);
    
    for(var i=0; i<tabs.length; i++){
        $('#mapCanvas_' + tabs[i].code).width(boxSize.width);
        $('#mapCanvas_' + tabs[i].code).height(boxSize.height - 25 - listboxHeight);    
    }
    $('#listbox').height(listboxHeight);
};

var switchListBox = function(btn){
    if(btn.className == 'switch sw-open'){
        btn.className = 'switch sw-close';
        listboxHeight = 25;
    } else {
        btn.className = 'switch sw-open';
        listboxHeight = listboxHeightConfig;
    }
    setBoxSize();
};

var setLeftDisplay = function(obj){
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var setRightDisplay = function(obj){
    cms.frame.setRightDisplay($('#bodyRight'), obj);
};

var getTabIndex = function(mapType){
    for(var i=0; i<tabs.length; i++){
        if(mapType == tabs[i].code){
            return i;
        }
    }
    return -1;
};

var initialMap = function(mapEngine){
    var obj = cms.util.$('mapCanvas_' + mapEngine);
    var idx = getTabIndex(mapEngine);
    
    switch(mapEngine){
        case 'gmap':
            /*
            if(!tabs[idx].load){
                tabs[idx].load = gmap.initial(obj, mapConfig.mapCenter, mapConfig.mapZoom, mapConfig.mapType);
            }
            */
            gmap.initial(obj, mapConfig.mapCenter, mapConfig.mapZoom, mapConfig.mapType);
            
            var strHtml = '<div id="mapToolbar" style="margin-right:5px;">';
            strHtml += '<a class="btn btnc22" onclick="switchMapToolbarButton(\'zoomin\', this);" rel="release" lang="[\'press\',\'release\']"><span>拉框放大</span></a>'
                + '<a class="btn btnc22" onclick="switchMapToolbarButton(\'zoomout\', this);" rel="release" lang="[\'press\',\'release\']"><span>拉框缩小</span></a>'
                + '<a class="btn btnc22" onclick="switchMapToolbarButton(\'ranging\', this);" rel="release" lang="[\'press\',\'release\']" class="btn btnc22"><span>测距</span></a>'
                + '<a class="btn btnc22" onclick="cms.frame.setFullScreen();" rel="release" lang="[\'press\',\'release\']" class="btn btnc22"><span>全屏</span></a>';
            //strHtml += '<label class="label-chb-nobg"><input type="checkbox" class="chb" ' + (isShowDevGps ? ' checked="checked" ' : '') + ' onclick="enabledDeviceGpsShow(this.checked);" />加载设备</label>';
            strHtml += '</div>';
            $('#toolbar').html(strHtml);
            break;
        case 'bmap':
            /*
            if(!tabs[idx].load){
                tabs[idx].load = true;
                bmap.initial(obj, mapConfig.mapCenter, mapConfig.mapZoom);
                bmap.setMapType(mapConfig.mapType);
                
                window.setTimeout(setMapCenter, 100);
            }
            */
            
            bmap.initial(obj, mapConfig.mapCenter, mapConfig.mapZoom);
            bmap.setMapType(mapConfig.mapType);
            
            window.setTimeout(setMapCenter, 100);
            
             var strHtml = '<div id="mapToolbar" style="margin-right:5px;">'
                + '<label class="chb-label" style="margin-right:3px;"><input type="checkbox" class="chb" checked="checked" onclick="setMarkerLabelShow(this.checked);" /><span>显示设备名称</span></label>'
                + '<a class="btn btnc22" onclick="setMapCenter();" title="回到地图中心位置"><span>中心</span></a>'
                + '<a class="btn btnc22" onclick="bmap.disToolsOpen();switchMapToolbarButton(\'zoomin\',this);" rel="release" lang="[\'press\',\'release\']"><span>测距</span></a>'
                + '<a class="btn btnc22" onclick="bmap.recToolsOpen();switchMapToolbarButton(\'ranging\',this);" rel="release" lang="[\'press\',\'release\']"><span>框选</span></a>'
                + '<a class="btn btnc22" id="btnCancelFollow" onclick="cancelFollow(this);" style="display:none;"><span>取消跟踪</span></a>';
            strHtml += '</div>';
            $('#toolbar').html(strHtml);
            break;
        case 'amap':
            break;
        case 'omap':
            break;
        default:
            break;
    }
        
    $('#toolbar .chb').focus(function(){
        this.blur();
    });
};

var setMapCenter = function(){
    if('gmap' == mapConfig.mapEngine){
    
    } else if('bmap' == mapConfig.mapEngine){
        var latLng = bmap.gpsConvertBD(mapConfig.mapCenter);
            
        var point = new BMap.Point(latLng.lng, latLng.lat);    // 创建点坐标
            
        bmap.setCenter(point);
    }
};

var switchMapToolbarButton = function(action, btn){
    $('#mapToolbar a').removeClass();
    $('#mapToolbar a').addClass('btn btnc22');
    var rel = btn.rel;
    $('#mapToolbar a').attr('rel', 'release');
    btn.rel = rel;
    if('gmap' == mapConfig.mapEngine){
        if(action == 'zoomin' || action == 'zoomout'){
            gmap.setBoundsAction(action, btn);
            gmap.hideRangingBox();
        } else if(action == 'ranging'){ 
            gmap.showRangingBox(btn);
            gmap.setBoundsAction('');
        }
    } else if('bmap' == mapConfig.mapEngine){
        
    }
};

var switchMap = function(param){
    curMapType = param.action;

    initialMap(curMapEngine);
};

var initialListBox = function(){
    var strTitleBar = '<div class="titlebar" style="border-top:solid 1px #99bbe8;">'
        + '<div id="tabpanel-list" class="tabpanel" style="float:left;width:300px; background:none;">'
        + '<a class="cur" lang="dev" rel="#devListBox"><span>设备信息</span></a>'
        + '</div>'
        + '<a class="switch sw-open" onclick="switchListBox(this);" style="float:right;"></a>'
        + '</div>';
    var strList = '<div id="devListBox" class="listbox" style="overflow:auto;">'
        + '<div class="listheader" style="overflow:hidden;">'
        + '<table cellpadding="0" cellspacing="0" class="tbheader" style="min-width:' + listMinWidth + 'px;">'
        + '<tr>'
        + '<td style="width:35px;">序号</td>'
        + '<td style="width:150px;">设备名称</td>'
        + '<td style="width:90px;">设备编号</td>'
        + '<td style="width:55px;">在线状态</td>'
        + '<td style="width:45px;">ACC状态</td>'
        + '<td style="width:100px;">警情</td>'
        + '<td style="width:60px;">IO状态</td>'
        + '<td style="width:70px;">速度(km/h)</td>'
        + '<td style="width:70px;">角度(°)</td>'
        + '<td style="width:80px;">纬度</td>'
        + '<td style="width:80px;">经度</td>'
        + '<td style="width:45px;">电压(V)</td>'
        + '<td style="width:150px;">所属区域</td>'
        + '<td style="text-align:right;">'
        + '</td>'
        + '</tr>'
        + '</table>'
        + '</div>'
        + '<div class="list" style="height:' + (listboxHeight - 51) + 'px;">'
        + '<table id="tbList" class="tblist" style="min-width:' + (listMinWidth - 20) + 'px;"></table>'
        + '</div>'
        + '</div>';
    
    $('#listbox').html(strTitleBar + strList);
    
    cms.jquery.tabs('#tabpanel-list', null, '.listbox', '');
    
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
};

//添加要跟踪的设备编号
var addFollowDev = function(devCode){
    arrFollowDev.length = 0;
    arrFollowDev.push(devCode);
};

var getFollowDevList = function(){
    if(arrFollowDev.length > 0){
        return arrFollowDev.join(',');
    }
    return '';
};

//检测是否是被跟踪的设备编号
var checkIsFollowDev = function(devCode){
    if(arrFollowDev.length > 0){
        return arrFollowDev[0] == devCode;
    }
    return false;
};

var showFollowButton = function(){
    $('#btnCancelFollow').show();
    isAllowFollow = true;
};

var cancelFollow = function(){
    $('#btnCancelFollow').hide();
    isAllowFollow = false;
    
    arrFollowDev.length = 0;
};

var setMarkerLabelShow = function(isShow){
    showMarkerLabel = isShow;
    
    getDeviceGps(false);
};

var getDirectionCode = function(direction){
    var strDirection = "n";
	if( (0 <= direction && direction <= 22.5)  || direction > 337.5 )
	{
		strDirection = 'n';
	}
	else if( 22.5 < direction && direction <= 67.5 )
	{
		strDirection = 'ne';
	}
	else if( 67.5 < direction && direction<= 112.5 )
	{
		strDirection = 'e';
	}
	else if( 112.5 < direction && direction<= 157.5 )
	{
		strDirection = 'se';
	}
	else if( 157.5 < direction && direction<= 202.5 )
	{
		strDirection = 's';
	}
	else if( 202.5 < direction && direction<= 247.5 )
	{
		strDirection = 'sw';
	}
	else if( 247.5 < direction && direction<= 292.5 )
	{
		strDirection = 'w';
	}
	else if( 292.5 < direction && direction<= 337.5 )
	{
		strDirection = 'nw';
	}
	return strDirection;
};

//获取设备GPS信息
var getDeviceGpsList = function(){
    var unitId = parseInt(loginUser.userUnit, 10);
    var urlparam = 'action=getDeviceGps&unitId=' + unitId;
    
    module.ajaxRequest({
        url: cmsPath + '/ajax/device.aspx',
        data: urlparam,
        callBack: showDeviceGpsList,
        param: {
        
        }
    });
    //30秒后再次加载
    window.setTimeout(getDeviceGpsList, 30*1000);
};

var showDeviceGpsList = function(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    var dc = jsondata.dataCount;
    var objList = cms.util.$('tbList');
    var rid = 0;
    var rowData = [];
    
    cms.util.clearDataRow(objList, 0);
    for(var i=0; i<dc; i++){        
        var dr = jsondata.list[i];
        var row = objList.insertRow(rid);
        var cellid = 0;
        
        row.lang = dr.code;
        row.ondblclick = function(){
            addFollowDev(this.lang);
            showFollowButton();
            
            getSingleDeviceGps(this.lang);            
        };
        var strName = '<a onclick="module.showDevDetail(\'' + dr.code + '\',\'' + dr.name + '\');">' + dr.name + '</a>';
        var strStatus = '';
        if(dr.mode != ''){
            var arrOnline = ['<span style="color:#999;">离线</span>', '<span style="color:#008000;">在线</span>'];
            switch(dr.mode){
                case '2':
                    strStatus = arrOnline[parseInt(dr.s2, 10)];
                    break;
                case '3':
                case '4':
                    strStatus = arrOnline[parseInt(dr.s3, 10)];
                    break;
                default:
                    strStatus = dr.s2 == '1' || dr.s3 == '1' ? arrOnline[1] : arrOnline[0];
                    break;
            }
        }
        strStatus = '<span onmouseover="parseDevOnlineStatus(this,[\'' + dr.mode + '\',\'' + dr.s2 + '\',\'' + dr.s3 + '\'])">' + strStatus + '</span>';
        
        rowData[cellid++] = {html: (rid+1), style:[['width','35px']]};
        rowData[cellid++] = {html: strName, style:[['width','150px']]};
        rowData[cellid++] = {html: dr.code, style:[['width','90px']]};
        rowData[cellid++] = {html: strStatus, style:[['width','55px']]};
        rowData[cellid++] = {html: dr.acc == '1' ? '<span style="color:#f00;">开</span>' : '关', style:[['width','45px']]};
        rowData[cellid++] = {html: parseDevAlarmInfo(dr.alarm), style:[['width','100px']]};
        rowData[cellid++] = {html: dr.io, style:[['width','60px']]};
        rowData[cellid++] = {html: dr.speed, style:[['width','70px']]};
        rowData[cellid++] = {html: dr.dir, style:[['width','70px']]};
        rowData[cellid++] = {html: dr.lat, style:[['width','80px']]};
        rowData[cellid++] = {html: dr.lng, style:[['width','80px']]};
        rowData[cellid++] = {html: parseDevVoltage(dr.v), style:[['width','45px']]};
        rowData[cellid++] = {html: dr.uname, style:[['width','150px']]};
        
        rowData[cellid++] = {html: '', style:[]};
        
        cms.util.fillTable(row, rowData);
        
        delete dr;
        rid++;
    }
    
    setTableStyle('#tbList');
};

var setTableStyle = function(tb){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
};

var parseDevOnlineStatus = function(obj, param){
    var strTitle = '';
    switch(param[0]){
        case '2':
            strTitle = param[1] == '1' ? '2G在线' : '2G离线';
            break;
        case '3':
        case '4':
            strTitle = param[2] == '1' ? '2G在线' : '2G离线';
            break;
        default:
            strTitle = param[1] == '1' ? '2G在线' : '2G离线';
            strTitle += ' ';
            strTitle += param[2] == '1' ? '3G在线' : '3G离线';
            break;
    }
    obj.title = strTitle;
};

var parseDevAlarmInfo = function(s){
    if('' == s) return '-';
    if(!s.isNumber()) return s;
    var arrAlarmEnum = ['-', 'SOS报警', '一级告警', '二级告警', '三级告警', '区域报警', '外部报警一', '外部报警二', '外部报警三', '报警输出一', '报警输出二'];    
    return arrAlarmEnum[parseInt(s, 10)];
};

var parseDevVoltage = function(v){
    if(parseFloat(v, 10) < 1){
        return '-';
    }
    return v;
};

/*显示设备GPS定位*/
var setDeviceChecked = function(){
    getDeviceGps(true);
};

var getCheckedDevice = function(){
    var arrDevice = [];
    var strDevCode = '';
    var arrChb = cms.util.getCheckBoxChecked('chbTreeDevice');
    for(var i=0,c=arrChb.length; i<c; i++){
        var dev = eval('(' + arrChb[i].value + ')');
        strDevCode += i > 0 ? ',' : '';
        strDevCode += dev.code;
    }
    return strDevCode;
};

var enabledDeviceGpsShow = function(isShow){
    if(isShow != undefined){
        isShowDevGps = isShow;
    } else {
        isShowDevGps = !isShowDevGps;
    }
    if(!isShowDevGps){
        for(var i=0,c=arrDevMarker.length; i<c; i++){
            arrDevMarker[i].marker.setMap(null);
        }
    } else {        
        for(var i=0,c=arrDevMarker.length; i<c; i++){
            arrDevMarker[i].marker.setMap(gmap.map);
        }
    }
};

var getDeviceGps = function(isUserAction){
    var strDevCodeList = getCheckedDevice();
    var strFollowDevCodeList = getFollowDevList();
    
    if('' == strDevCodeList && '' == strFollowDevCodeList){
        clearDeviceGps();
        if(pwDevNoGps != null){
            pwDevNoGps.Hide();
        }
        return false;
    }
    strDevCodeList += (strDevCodeList != '' ? ',' : '') + strFollowDevCodeList;
    
    var urlparam = 'action=getDeviceBaseInfoList&devCode=' + strDevCodeList + '&getChild=1';
    if(devGpsTimer != null){
        window.clearTimeout(devGpsTimer);
    }
    module.ajaxRequest({
        url: cmsPath + '/ajax/device.aspx',
        data: urlparam,
        callBack: showDeviceGps,
        param: {
            isUserAction: isUserAction
        }
    });
};

var showDeviceGps = function(data, param){
    devGpsTimer = null;
    
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    clearDeviceGps();
    
    var strPrompt = '';
    var no = 0;
    var list = jsondata.list;
    for(var i=0,c=list.length; i<c; i++){
        var dr = list[i];
        var marker = createDevGpsMarker(dr);
        if(null == marker){
            strPrompt += ++no + '. ' + '<a onclick="module.showDevDetail(\'' + dr.devCode + '\',\'' + dr.devName + '\');">' + dr.devName + '</a>' + '<br />';
            continue;
        }
        arrDevMarker.push({marker: marker.marker, devCode: dr.devCode});
        
        if(checkIsFollowDev(dr.devCode)){            
            if(isAllowFollow){
                showDevMenu(marker.point, dr.devCode, dr);
                if('gmap' == curMapEngine){
                    gmap.setBoundsContains(marker.marker.latLng);
                } else if('bmap' == curMapEngine){
                    bmap.setBoundsContains(marker.point);
                }
            }
        }
    }
    var len = arrDevMarker.length;
    
    if('gmap' == curMapEngine){
        if(len == 1){
            if(param.isUserAction){
                gmap.setBoundsContains(arrDevMarker[0].marker.latLng, gmap.map);
            } else {
                //将设备图标设置在可视区域范围内显示
                gmap.setBoundsContains(arrDevMarker[0].marker.latLng);
            }
        }
    } else if('bmap' == curMapEngine){
        if(len == 1){
            if(param.isUserAction){
                bmap.setBoundsContains(arrDevMarker[0].marker.getPosition());
            } else {
                bmap.setBoundsContains(arrDevMarker[0].marker.getPosition());                
            }
        }
    }
    devGpsTimer = window.setTimeout(getDeviceGps, devGpsTiming); 
    
    if('' != strPrompt && param.isUserAction){
        var size = [217, 165];
        var strHtml = '<div style="height:36px;line-height:18px;padding:0 5px;">当前选中<b style="color:#00f;padding:0 2px;">' + list.length + '</b>台设备，'
            + '有<b style="color:#f00;padding:0 2px;">' + no + '</b>台设备暂时没有GPS定位信息</div>'
            + '<div style="padding:0 5px;height:' + (size[1] - 25 - 36) + 'px;overflow:auto;">' + strPrompt + '</div>';
        pwDevNoGps = cms.box.win({
            id:'pwDevNoGps',
            title: '提示信息',
            html: strHtml,
            width: size[0],
            height: size[1],
            position: 7,
            lock:false,
            noBottom: true,
            closeType: 'hide',
            build: 'show'
        });
    }
};

var clearDeviceGps = function(){
    //清除已有的标记
    
    if('gmap' == curMapEngine){
        for(var i=0,c=arrDevMarker.length; i<c; i++){
            gmap.removeMarker(arrDevMarker[i].marker);
        }
    } else if('bmap' == curMapEngine){
        for(var i=0,c=arrDevMarker.length; i<c; i++){
            bmap.removeMarker(arrDevMarker[i].marker);
        }    
    }
    arrDevMarker.length = 0;
};

var treeAction = function(param){
    switch(param.type){
        case 'unit':
            break;
        case 'device':
            getSingleDeviceGps(param.devCode);
            break;
    }
};

var getSingleDeviceGps = function(devCode){
    var urlparam = 'action=getSingleDeviceBaseInfo&devCode=' + devCode;
    module.ajaxRequest({
        url: cmsPath + '/ajax/device.aspx',
        data: urlparam,
        callBack: showSingleDeviceGps,
        param: null
    });
};

var showSingleDeviceGps = function(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    var dev = jsondata.dev;

    var oldMarker = getDevGpsInArray(dev.devCode);
        
    if('gmap' == curMapEngine){
        if(oldMarker != null){
            gmap.removeMarker(oldMarker[0].marker);
        }
        
        var marker = createDevGpsMarker(dev);
        if(null == marker){
            var strHtml = dev.devName + '暂时没有GPS定位信息';
            cms.box.alert({
                title: '提示信息',
                html: strHtml
            });
            return false;
        }
        if(oldMarker != null){
            arrDevMarker[oldMarker[1]] = {marker: marker.marker, devCode: dev.devCode};
        } else {
            arrDevMarker.push({marker: marker.marker, devCode: dev.devCode});
        }
        gmap.setCenter(marker.position);
        
        if(null == devGpsTimer){
            devGpsTimer = window.setTimeout(getDeviceGps, devGpsTiming);
        }
    } else if('bmap' == curMapEngine){
        var marker = createDevGpsMarker(dev);
        if(null == marker){
            var strHtml = dev.devName + '暂时没有GPS定位信息';
            cms.box.alert({
                title: '提示信息',
                html: strHtml
            });
            return false;
        }
        
        if(oldMarker != null){
            arrDevMarker[oldMarker[1]] = {marker: marker.marker, devCode: dev.devCode};
        } else {
            arrDevMarker.push({marker: marker.marker, devCode: dev.devCode});
        }
        bmap.setCenter(marker.point);
        
        if(isAllowFollow){
            //显示InfoMessageWindow
            showDevMenu(marker.point, dev.devCode, dev);
        }
        
        if(null == devGpsTimer){
            devGpsTimer = window.setTimeout(getDeviceGps, devGpsTiming);
        }
    }
};


var checkDeviceIsOnline = function(dev){
    if(dev.networkMode.indexOf('3') >= 0 || dev.networkMode.indexOf('4') >= 0){
        return parseInt(dev.status3G, 10) == 1;
    } else {
        return parseInt(dev.status2G, 10) == 1;
    }
};

var parseDeviceOnlineStatus = function(dev){    
    if(dev.networkMode.indexOf('3') >= 0 || dev.networkMode.indexOf('4') >= 0){
        return parseInt(dev.status3G, 10);
    } else {
        return parseInt(dev.status2G, 10);
    }
};

var showDevMenu = function(latLng, id, param){
    var dev = param;
    var strHtml = '<div style="line-height:18px;font-size:12px;font-family:宋体,Arial;margin-bottom:5px;">'
        + '设备编号：' + dev.devCode + '<br />设备名称：' + dev.devName + '<br />设备类型：' + dev.typeName
        + '<br />设备状态：' + (checkDeviceIsOnline(dev) ? '在线' : '离线')
        + '<br />GPS定位：' + dev.latitude + ',' + dev.longitude
        + '<br />速度：' + dev.speed + ' km/h' + ' &nbsp;角度：' + dev.direction + '°'
        + '<br />GPS时间：' + dev.lastGpsTime
        + '</div>';
    strHtml += '<a class="btn btnc22" onclick="module.showDevDetail(\'' + dev.devCode + '\',\'' + dev.devName + '\');"><span class="w60">设备详情</span></a>';
    if(dev.networkMode == '2'){
        strHtml += '<a class="btn btnc22" onclick="module.showGpsTrack(\'' + dev.devCode + '\',\'' + dev.devName + '\');" style="margin-left:3px;"><span class="w60">轨迹回放</span></a>'
            + '<a class="btn btnc22" onclick="module.showGprsConfig(\'' + dev.devCode + '\',\'' + dev.devName + '\');" style="margin-left:3px;"><span class="w60">2G设置</span></a>';
    } else {
        strHtml += '<a class="btn btnc22" onclick="module.showPreview(\'' + dev.devCode + '\',\'' + dev.devName + '\', 1);" style="margin-left:3px;"><span class="w60">视频预览</span></a>'
            + '<a class="btn btnc22" onclick="module.showPlayBack(\'' + dev.devCode + '\',\'' + dev.devName + '\');" style="margin-left:3px;"><span class="w60">录像回放</span></a>'
            + '<br />'
            + (loginUser.userName == 'admin' ? '<a class="btn btnc22" onclick="module.showRemoteConfig(\'' + dev.devCode + '\',\'' + dev.devName + '\');" style="margin:3px 3px 0 0"><span class="w60">远程配置</span></a>' : '')
            + '<a class="btn btnc22" onclick="module.showGpsTrack(\'' + dev.devCode + '\',\'' + dev.devName + '\');" style="margin:3px 0 0 0;"><span class="w60">轨迹回放</span></a>';
        if(dev.networkMode.indexOf('2') >= 0){
            strHtml += '<a class="btn btnc22" onclick="module.showGprsConfig(\'' + dev.devCode + '\',\'' + dev.devName + '\');" style="margin:3px 0 0 3px;"><span class="w60">2G设置</span></a>';
        }
    }
    
    if('gmap' == curMapEngine){
        gmap.showInfoWindow(strHtml, latLng, gmap.map);
    } else if('bmap' == curMapEngine){
        
        var opts = {
        /*
          width : 200,     // 信息窗口宽度
          height: 60,     // 信息窗口高度
        */
          title : param.devName , // 信息窗口标题
          enableMessage: false, //设置允许信息窗发送短息
          message: ''
        }
        var infoWindow = new BMap.InfoWindow(strHtml, opts);  // 创建信息窗口对象
        bmap.map.openInfoWindow(infoWindow, latLng); //开启信息窗口
    }
};

var getDevIconData = function(){
    var urlparam = 'action=getDeviceIcon';
    module.ajaxRequest({
        url: cms.util.path + '/ajax/device.aspx',
        data: urlparam,
        callBack: getDevIconDataCallBack
    });
};

var getDevIconDataCallBack = function(data, param){
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();
    if(1 == jsondata.result && jsondata.list != undefined){
        arrDevIcon = jsondata.list;
    }
};

var getDevIcon = function(type, direction, status){
    var strPath = '';
    /*
    for(var i=0,c=arrDevIcon.length; i<c; i++){
        if(type == arrDevIcon[i].type && status == arrDevIcon[i].status){
            strPath = arrDevIcon[i].path;
            break;
        }
    }
    */
    //alert(type + ',' + status + ',' + strPath);
    if(strPath != ''){
        strPath = cmsPath + strPath;
    } else {
        var strDir = getDirectionCode(direction);
        var arrPath = [
            'car_' + strDir + '_gray.png',
            'car_' + strDir + '_green.png',
            'car_' + strDir + '_red.png'
        ];
        strPath = cmsPath + '/skin/default/images/common/emap/car/' + arrPath[status];
    }
    return strPath;
};

var createDevGpsMarker = function(dev){
    var strTitle = '设备编号：' + dev.devCode + '\r\n设备名称：' + dev.devName + '\r\n设备类型：' + dev.typeName
        + '\r\n设备状态：' + (checkDeviceIsOnline(dev) ? '在线' : '离线')
        + '\r\nGPS定位：' + dev.latitude + ',' + dev.longitude
        + '\r\n速度：' + dev.speed + ' km/h' + '  角度：' + dev.direction + '°'
        + '\r\nGPS时间：' + dev.lastGpsTime;

    if('gmap' == curMapEngine){
        if('' == dev.latitude || '' == dev.longitude){
            return null;
        }
        dev.latitude = gmap.latLngRecovery(dev.latitude);
        dev.longitude = gmap.latLngRecovery(dev.longitude);
        
        var latLng = gmap.mc.offset(parseFloat(dev.latitude, 10), parseFloat(dev.longitude, 10));
        var status = parseDeviceOnlineStatus(dev);
        var icon = getDevIcon(dev.typeCode, dev.direction, status);
        
        var position = gmap.createLatLng(latLng.lat, latLng.lng);
        var markerOption = {
            position: position,
            map: gmap.map,
            id: dev.devCode,
            func: showDevMenu,
            param: dev,
            image: {
                src: icon, style: {
                    width: '32px',
                    height: '32px'
                }
            },
            title: strTitle
        };
        if(showMarkerLabel){
            markerOption.label = {
                html: '<nobr>' + dev.devName + '</nobr>', style: {
                    color: '#00f'
                }
            };
        }
        
        var marker = gmap.createLabelMarker(markerOption);
        return {marker: marker, position:position};
    } else if('bmap' == curMapEngine){        
        if('' == dev.latitude || '' == dev.longitude){
            return null;
        }
        var latLng = {lat: dev.latitude, lng: dev.longitude};
        latLng = bmap.gpsConvertBD(latLng);
        var point = new BMap.Point(latLng.lng, latLng.lat);    // 创建点坐标
        var status = parseDeviceOnlineStatus(dev);
        var icon = new BMap.Icon(getDevIcon(dev.typeCode, dev.direction, status), new BMap.Size(32,32));
        
        var marker = bmap.createMarker({
            map: bmap.map, 
            point: point, 
            options:{icon: icon, title: strTitle}, 
            label: dev.devName + ' &nbsp;' + dev.speed + 'km/h', 
            showLabel: showMarkerLabel
        });
        marker.addEventListener('click', function(){
            showDevMenu(point, dev.devCode, dev);
        });
        if(showMarkerLabel){
            marker.getLabel().addEventListener('click', function(){
                showDevMenu(point, dev.devCode, dev);
            });
        }
        
        return {marker: marker, point:point};
    }
};

var getDevGpsInArray = function(devCode){
    for(var i=0,c=arrDevMarker.length; i<c; i++){
        if(devCode == arrDevMarker[i][1]){
            return [arrDevMarker[i], i];
        }
    }
    return null;
};