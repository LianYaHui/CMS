cms.gpstrack = cms.gpstrack || {};

var paddingTop = 1;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = leftWidthConfig = 360;
var rightWidth = rightWidthConfig =  465;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = listBoxMinWidthConfig = loginUser.userName.equals('admin') ? 680 : 580;
//滚动条宽度
var scrollBarWidth = 18;

var treeType = 'camera';
var treeTitle = '设备通道';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

var mc = new MapCorrect();
var mapEngine = mapConfig.mapEngine;

cms.gpstrack.treeBoxH = 0;
cms.gpstrack.titleH = 25;
cms.gpstrack.viewControlPanelH = 40;
cms.gpstrack.searchFormPanelH = 185;
cms.gpstrack.trackBoxHeight = 150;

cms.gpstrack.isDebug = module.checkIsDebug();

cms.gpstrack.htMarker = new cms.util.Hashtable();

cms.gpstrack.markers = [];
cms.gpstrack.tracks = [];

cms.gpstrack.distance_line = null;

cms.gpstrack.pageStart = 1;
cms.gpstrack.pageIndex = cms.gpstrack.pageStart;
cms.gpstrack.pageSize = 20;

cms.gpstrack.playid = null;
cms.gpstrack.playnum = 0;
cms.gpstrack.playcount = 0;

cms.gpstrack.gpslist = [];
cms.gpstrack.tracklist = [];

cms.gpstrack.speeds = [2000,1000,500,250,125];
cms.gpstrack.isplay = false;
cms.gpstrack.ispause = false;
cms.gpstrack.isrepeat = false;
cms.gpstrack.playspeed = cms.gpstrack.speeds[2];
cms.gpstrack.icon = cms.util.path + '/skin/default/images/common/emap/p.png';

cms.gpstrack.drawline = false;
cms.gpstrack.lineColor = [
    ['','无'],['#ff0000', '红色'],['#0000ff', '蓝色'],['#800080', '紫色'],['#008000', '绿色'],['#000000', '黑色'],
    ['#ff00ff','紫红色'],['#ffffff', '白色'],['#ffff00', '黄色']
];
cms.gpstrack.lineWidth = [['1','1px'],['2', '2px'],['3', '3px'],['4', '4px'],['5', '5px']];
cms.gpstrack.linestyle = {color:'', width:2};
cms.gpstrack.lastLatLng = null;
cms.gpstrack.firstMarker = null;
cms.gpstrack.lastMarker = null;
cms.gpstrack.firstLabel = null;
cms.gpstrack.lastLabel = null;
cms.gpstrack.gpsline = [];

cms.gpstrack.mapmove = true;

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = leftWidthConfig = 220;
    }
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    if(cms.gpstrack.isDebug){
        var winDebug = initialDebugBox();
        winDebug.Hide();
    }
    /*
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', false, leftWidth, '3');
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', false, true, false, false, true);
    //定时刷新树型菜单设备状态
    //tree.timer = window.setTimeout(tree.updateDevStatus, 15*1000, 15*1000);
    */
    
    setBodySize();

    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});    
});

$(window).unload(function(){
    if(cms.gpstrack.timer != null){
        //清除定时器
        clearInterval(cms.gpstrack.timer);
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
    
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
           
    $('#listHeader').html(cms.util.buildTable('tbHeader','tbheader'));
    $('#listContent').html(cms.util.buildTable('tbList','tblist') + '<div id="divPrompt" style="padding:5px 10px;display:none;"></div>');
    
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    cms.util.fillOptions(cms.util.$('ddlManualType'), [['-1','全部'],['0','自动'],['1','手动']], -1);
    cms.util.fillOptions(cms.util.$('ddlDesc'), [['1','降序'],['0','升序']], 1);
    
    initialMap(mapEngine);
    
    cms.gpstrack.buildGpsTrackForm(cms.util.$('divTrackForm'));
    
    var strHtml = '<a class="btn btnc22" onclick="cms.gpstrack.selectGpsTrack(1);"><span>全选</span></a>'
        + '<a class="btn btnc22" onclick="cms.gpstrack.selectGpsTrack(3);"><span>反选</span></a>'
        + '<a class="btn btnc22" onclick="cms.gpstrack.selectGpsTrack(2);"><span>取消</span></a>'
        + '<a class="btn btnc22" style="display:none;" id="btnClearLocation" onclick="cms.gpstrack.clearGpsLocation();"><span>清除定位</span></a>';
    $('.tools').html(strHtml);
    
    $('.right-tools').html('<a onclick="showGpsGuide();" class="btn btnc22" style="margin-right:3px;"><span>向导</span></a>');
    $('#bodyMain .titlebar').append('<a class="ibtn nobg" title="刷新" onclick="location.reload();" style="float:right;margin-right:1px;"><i class="icon-update"></i></a>');
    
    cms.gpstrack.showListHeader();
      
    cms.util.$('txtDevName').onfocus = function(){
        if(this.value.trim().equals(string.empty)){
            cms.gpstrack.showDevPrompt();
        }
    };
};

var initialMap = function(mapEngine){
    var obj = cms.util.$('mapCanvas');
    
    switch(mapEngine){
        case 'gmap':
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
            bmap.initial(obj, mapConfig.mapCenter, mapConfig.mapZoom);
            bmap.setMapType(mapConfig.mapType);
            
            window.setTimeout(setMapCenter, 100);
            
            var strHtml = '<div id="mapToolbar" style="margin-right:5px;">'
                + '<a class="btn btnc22" onclick="setMapCenter();" title="回到地图中心位置"><span>中心</span></a>'
                + '<a class="btn btnc22" onclick="bmap.disToolsOpen();"><span>测距</span></a>'
                + '<a class="btn btnc22" onclick="bmap.recToolsOpen();"><span>框选</span></a>';
            strHtml += '</div>';
            $('#toolbar').html(strHtml);
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

var showGpsGuide = function(){
    var devCode = $('#txtDevCode').val().trim();
    var devName = $('#txtDevName').val().trim();
    module.showGpsGuide(devCode, devName, {lock: true});
};

var setGpsTime = function(strDate){
    $('#txtStartTime').attr('value', strDate + ' 0:00:00');
    $('#txtEndTime').attr('value', strDate + ' 23:59:59');
    
    if($('#txtDevCode').val().trim() != ''){
        searchGpsTrack();
    }
};

var initialDebugBox = function(){    
    if(cms.gpstrack.isDebug){        
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
        
        cms.gpstrack.debugMessageBox = cms.util.$('txtDebugger');
        
        return windebug;
    }
    return null;
};

var appendDebugInfo = function(str){
    if(cms.gpstrack.isDebug){
        cms.gpstrack.debugMessageBox.value += str + '\r\n';
    }
};

var clearDebugInfo = function(){
    if(cms.gpstrack.isDebug){
        cms.gpstrack.debugMessageBox.value = '';
    }
}

var getDebugTime = function(){
    return '[' + new Date().toString('yyyy-MM-dd HH:mm:ss fff') + '] ';
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
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
    setLeftPanelSize();
};

var setBoxSize = function(){
    /*
    $('#leftMenu').height(cms.gpstrack.treeBoxH);
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(cms.gpstrack.treeBoxH - 25);
    
    $('.viewbox').width(boxSize.width);
    $('.viewbox').height(boxSize.height - 25 - 40 - cms.gpstrack.progressBarHeight);
    */
};

var setLeftDisplay = function(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var setLeftPanelSize = function(){
    $('#divSearchForm').height(62);
    $('#divTrackForm').height(cms.gpstrack.searchFormPanelH - 25 - 3 - 62);
    $('.listbox').width(leftWidth - 2);
    if(cms.util.isIE6){
        $('.listbox .listheader').width(leftWidth - 2);
        $('.listbox .list').width(leftWidth - 2);
    }
    $('.listbox').height(boxSize.height - cms.gpstrack.searchFormPanelH - 25 - 28);
    $('.listbox .listheader').height(23);
    $('.listbox .list').height(boxSize.height - cms.gpstrack.searchFormPanelH - 25 - 28 - 23);
    $('.listbox .tbheader').width(listBoxMinWidth);
    $('.listbox .tblist').width(listBoxMinWidth - scrollBarWidth);
        
    $('#mapCanvas').height(boxSize.height - 25);
    $('#mapCanvas').width(boxSize.width);
};

var searchGpsTrack = function(){
    pageIndex = pageStart;
    cms.gpstrack.getGpsLog();
};

cms.gpstrack.showListHeader = function(){
    var objHeader = cms.util.$('tbHeader');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    
    var rowData = cms.gpstrack.buildListHeader();
    cms.util.fillTable(row, rowData);
};

cms.gpstrack.buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '序号', style:[['width','32px']]};
    rowData[cellid++] = {html: '纬度', style:[['width','75px']]};
    rowData[cellid++] = {html: '经度', style:[['width','80px']]};
    rowData[cellid++] = {html: '定位', style:[['width','30px']]};
    rowData[cellid++] = {html: '接收时间', style:[['width','120px']]};
    rowData[cellid++] = {html: '速度(km/h)', style:[['width','65px']]};
    rowData[cellid++] = {html: '方向(°)', style:[['width','60px']]};
    rowData[cellid++] = {html: '类型', style:[['width','45px']]};
    if(loginUser.userName.equals('admin')){
        rowData[cellid++] = {html: '记录时间', style:[['width','120px']]};
    }
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
};

cms.gpstrack.showDevPrompt = function(){
    var strHtml = '没有指定要轨迹回放的设备。';
    cms.box.alert({title:'提示信息', html:strHtml});
};

cms.gpstrack.checkFormParam = function(){
    var devCode = $('#txtDevCode').val().trim();
    var startTime = $('#txtStartTime').val().trim();
    var endTime = $('#txtEndTime').val().trim();
    var manualType = $('#ddlManualType').val().trim();
    if(devCode.equals(string.empty)){
        cms.gpstrack.showDevPrompt();
        return false;
    } else if(startTime.equals(string.empty)){
        cms.box.msgAndFocus(cms.util.$('txtStartTime'), {title:'提示信息', html:'请选择开始时间'});
        return false;
    } else if(endTime.equals(string.empty)){
        cms.box.msgAndFocus(cms.util.$('txtEndTime'), {title:'提示信息', html:'请选择结束时间'});
        return false;
    }
    return true;
};

cms.gpstrack.getGpsLog = function(){
    var devCode = $('#txtDevCode').val().trim();
    var startTime = $('#txtStartTime').val().trim();
    var endTime = $('#txtEndTime').val().trim();
    var manualType = $('#ddlManualType').val().trim();
    var isDesc = $('#ddlDesc').val().trim();
    if(!cms.gpstrack.checkFormParam()){
        return false;
    }
    
    var objList = cms.util.$('tbList');
    cms.util.clearDataRow(objList, 0);
    cms.gpstrack.showPrompt('正在搜索，请稍候...');
        
    var urlparam = 'action=getDeviceGpsLog&devCode=' + devCode + '&startTime=' + startTime + '&endTime=' + endTime 
        + '&pageIndex=' + (pageIndex-pageStart) + '&pageSize=' + pageSize + '&manual=' + manualType + '&isDesc=' + isDesc 
        + '&' + new Date().getTime();
    
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
        url: cms.util.path + '/ajax/gps.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            $('#txtData').attr('value', data);
            var strData = $('#txtData').val();
            if(!strData.isJsonData()){
                module.showJsonErrorData(strData);
                return false;
            }            
            var jsondata = strData.toJson();//eval('(' + strData + ')');
            if(jsondata.result == 1){
                if(cms.gpstrack.showGpsLog(objList, devCode, jsondata)){
                    cms.gpstrack.showPrompt('');
                } else {
                    cms.gpstrack.showPrompt('没有找到相关的GPS轨迹记录');
                }
            } else {
                if(module.checkOvertime(jsondata.error)){
                    module.showOvertime();
                } else {
                    cms.box.alert({title:'错误信息', html: jsondata.error});
                }
            }
            
            delete strData;
            delete jsondata;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) == 'function'){CollectGarbage();} }
    });
};

cms.gpstrack.showGpsLog = function(objList, devCode, jsondata){
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    
    for(var i=0,c=jsondata.list.length; i<c; i++){
        var dr = jsondata.list[i];
        var row = objList.insertRow(rid);
        var rnum = (pageIndex-pageStart) * pageSize + rid + 1;
        var rowData = [];
        var cellid = 0;
        //var strLang = '{idx:' + rnum + ',devCode:\'' + devCode + '\',lat:\'' + dr.latitude + '\',lng:\'' + dr.longitude + '\',time:\'' + dr.receiveTime + '\',speed:' + dr.speed + ',manual:' + dr.manual + ',direction:' + dr.direction + '}';
        var strLang = '[' + rnum + ',\'' + devCode + '\',\'' + dr.latitude + '\',\'' + dr.longitude + '\',\'' + dr.receiveTime + '\',' + dr.speed + ',' + dr.direction + ',' + dr.manual + ']';
        var strLocation = '<input type="checkbox" name="chbGpsTrack" lang="' + strLang + '" onclick="cms.gpstrack.showGpsLocation(\'chbGpsTrack\');" />';
        
        rowData[cellid++] = {html: rnum, style:[['width','32px']]};
        rowData[cellid++] = {html: dr.latitude, style:[['width','75px']]};
        rowData[cellid++] = {html: dr.longitude, style:[['width','80px']]};
        rowData[cellid++] = {html: strLocation, style:[['width','30px']]};
        rowData[cellid++] = {html: dr.receiveTime, style:[['width','120px']]};
        rowData[cellid++] = {html: dr.speed, style:[['width','65px']]};
        rowData[cellid++] = {html: dr.direction, style:[['width','60px']]};
        rowData[cellid++] = {html: dr.manual == 0 ? '自动' : '手动', style:[['width','45px']]};
        if(loginUser.userName.equals('admin')){
            rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]};
        }
        rowData[cellid++] = {html: '', style:[]}; //空
        
        cms.util.fillTable(row, rowData);

        rowData = null;
        dr = null;
        
        delete strLang;
        delete strLocation;
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
        callBack: 'cms.gpstrack.showPage',
        showDataCount: true,
        showDataStat: false,
        showPageCount: false,
        keyAble: true
    };
    var pager = new Pagination();
    pager.Show(config, cms.util.$('pagination'));
    
    return dataCount > 0;
};

cms.gpstrack.showPrompt = function(str){
    if(str == undefined) str = '';
    cms.util.$('divPrompt').innerHTML = str;
    cms.util.$('divPrompt').style.display = '' == str ? 'none' : '';
};

cms.gpstrack.showPage = function(page){
    pageIndex = parseInt(page, 10);
    cms.gpstrack.getGpsLog();
};

cms.gpstrack.buildGpsTrackForm = function(box){
    var strSpeed = '';
    for(var i=0; i<cms.gpstrack.speeds.length; i++){
        strSpeed += '<td id="sp' + (i+1) + '" onclick="cms.gpstrack.setPlaySpeed(this,'+ (i+1) + ',' + cms.gpstrack.speeds[i] + ');" '
            + ' style="width:15px; cursor:pointer; '
            + ' background:' + (cms.gpstrack.playspeed == cms.gpstrack.speeds[i] ? '#00f':'#fff')+ ';"></td>';
    }
    var strHtml = '<table cellpadding="0" cellspacing="0" style="margin:2px 0 0 0">'
        + '<tr style="height:30px;">'
        + '<td>轨迹连线：</td>'
        + '<td>'
        + '<select id="ddlTrackLine" class="select w50" onchange="cms.gpstrack.setTrackLine();" style="float:left;">'
        + cms.util.buildOptions(cms.gpstrack.lineColor, cms.gpstrack.linestyle.color)
        + '</select>'
        + '<select id="ddlTrackLineWidth" class="select w50" onchange="cms.gpstrack.setTrackLine();" style="float:left;margin-left:3px;">'
        + cms.util.buildOptions(cms.gpstrack.lineWidth, cms.gpstrack.linestyle.width)
        + '</select>'
        //+ '<span id="trackLineDemo" style="display:inline-block;width:30px;border:none;margin:10px 0 0 3px;float:left;"></span>'
        + '<span style="float:left;margin-left:7px;">地图缩放：</span>'
        + '<span style="float:left;">'
        + '<select id="ddlMapZoom" class="select w50" onchange="' + ('gmap' == mapEngine ? 'gmap' : 'bmap') + '.setMapZoom(this.value);">'
        + cms.util.buildNumberOptions(21, 0, mapConfig.mapZoom)
        + '</select>'
        + '</span>'
        
        + '</td>'
        + '</tr>'
        + '<tr style="height:30px;">'
        + '<td>回放速度：</td>'
        + '<td>'
        + '<table style=" height:12px; line-height:13px;float:left;" cellpadding="0" cellspacing="3" border="0">'
        + '<tr>'
        + '<td style="padding:3px 0 0 0;">慢</td>'
        + strSpeed
        + '<td style="padding:3px 0 0 0;">快</td>'
        + '</tr></table>'
        
        + '<label class="chb-label-bg" style="margin:0 0 0 5px;float:left;">'
        + '<input type="checkbox" class="chb" style="margin-top:2px;float:left;" checked="checked" onclick="cms.gpstrack.setMapMove(this);" />'
        + '<span style="float:left;">地图跟随移动</span>'
        + '</label>'
        
        + '</td>'
        + '</tr>'
        + '<tr style="height:30px;">'
        + '<td></td>'
        + '<td>'
        + '<a class="btn btnc24" id="btnTrackPlay" onclick="cms.gpstrack.startTrackPlay(this);"><span class="w50">轨迹回放</span></a>'
        + '<a class="btn btnc24 m-l-5" onclick="cms.gpstrack.stopTrackPlay();"><span class="w50">停止回放</span></a>'
        + '<a class="btn btnc24 m-l-5" onclick="cms.gpstrack.clearGpsTrack();"><span class="w50">清除轨迹</span></a>'
        + '</td>'
        + '</tr>'
        + '</table>';
    box.innerHTML = strHtml;
    
    if('gmap' == mapConfig.mapEngine){
        google.maps.event.addListener(gmap.map, 'zoom_changed',
        function() {
            $('#ddlMapZoom').attr('value', gmap.map.getZoom());
        });
    } else if('bmap' == mapConfig.mapEngine){
        bmap.map.addEventListener('zoomend', function(ev){
            $('#ddlMapZoom').attr('value', this.getZoom());
        });
    }
};

cms.gpstrack.setPlaySpeed = function(obj, num, speed){
    for(var i=1; i<=cms.gpstrack.speeds.length; i++){
        cms.util.$("sp" + i).style.background = "#fff";
    }
    obj.style.background = "#00f";
    cms.gpstrack.playspeed = speed;
};

cms.gpstrack.setTrackLine = function(){
    var strColor = cms.util.$('ddlTrackLine').value.trim();
    var width = cms.util.$('ddlTrackLineWidth').value.trim();
    /*
    var objDemo = cms.util.$('trackLineDemo');
    
    objDemo.style.height = width + 'px';
    objDemo.style.background = strColor;
    */
    
    cms.gpstrack.drawline = !strColor.equals('');
    cms.gpstrack.linestyle.color = strColor;
    cms.gpstrack.linestyle.width = parseInt(width, 10);
};

cms.gpstrack.setMapMove = function(obj){
    cms.gpstrack.mapmove = obj.checked;
};

cms.gpstrack.selectGpsTrack = function(oper){
    var chbName = 'chbGpsTrack';
    cms.util.selectCheckBox(chbName, oper);
    cms.gpstrack.showGpsLocation(chbName);
};

cms.gpstrack.showGpsLocation = function(chbName){
    var arrChb = cms.util.$N(chbName);
    for(var i=0,c=arrChb.length; i<c; i++){
        var gt = eval('(' +  arrChb[i].lang + ')');
        if(gt[2] == '' || gt[3] == '') {
            continue;
        }
        var strHtml = '序号：%s\r\n纬度：%s\r\n经度：%s\r\n时间：%s\r\n速度：%s km/h\r\n方向：%s°';
        strHtml = strHtml.format([gt[0], gt[2], gt[3], gt[4], gt[5], gt[6]]);
        strHtml += gt[7] == 1 ? '\r\n人工手动采集' : '';
        
        var strKey = gt[1] + '_' + gt[4];
        
        delete strHtml;
        
        if('gmap' == mapConfig.mapEngine){
            var myLatLng = cms.gpstrack.buildLatLng(gt[2], gt[3]);
            if(arrChb[i].checked){
                if(!cms.gpstrack.htMarker.contains(strKey)){
                    var options = {
                        position: myLatLng,
                        image:{
                            src: gmap.iconPath.marker,
                            title: strHtml
                        },
                        label: {
                            text: '<nobr>' + gt[0] + '. ' + gt[4] + '</nobr>'
                        }
                    };
                    var marker = gmap.createLabelMarker(options);
                    cms.gpstrack.htMarker.add(strKey, [marker]);
                    delete options;
                }
            } else {
                if(cms.gpstrack.htMarker.contains(strKey)){
                    var arrMarker = cms.gpstrack.htMarker.items(strKey);
                    gmap.removeMarker(arrMarker[0]);
                    cms.gpstrack.htMarker.remove(strKey);
                    
                    delete arrMarker;
                }
            }
            if(c - 1 == i){
                gmap.setMapCenter(myLatLng);
            }
        } else if('bmap' == mapConfig.mapEngine){
            var point = cms.gpstrack.buildLatLng(gt[2], gt[3]);
            if(arrChb[i].checked){
                if(!cms.gpstrack.htMarker.contains(strKey)){
                    var options = {
                        map: bmap.map, 
                        point: point,
                        options:{title: strHtml},
                        label:'<nobr>' + gt[0] + '. ' + gt[4] + '</nobr>',
                        showLabel:true
                    };
                    var marker = bmap.createMarker(options);
                    cms.gpstrack.htMarker.add(strKey, [marker]);
                    delete options;
                }
            } else {
                if(cms.gpstrack.htMarker.contains(strKey)){
                    var arrMarker = cms.gpstrack.htMarker.items(strKey);
                    bmap.removeMarker(arrMarker[0]);
                    cms.gpstrack.htMarker.remove(strKey);
                    
                    delete arrMarker;
                }
            }
            if(c - 1 == i){
                bmap.setCenter(point);
            }
        }
    }
    cms.util.$('btnClearLocation').style.display = cms.gpstrack.htMarker.count() > 0 ? '' : 'none';
    
    delete arrChb;
};

cms.gpstrack.clearGpsLocation = function(){
    if('gmap' == mapConfig.mapEngine){
        for(var i=0,c=cms.gpstrack.htMarker.count(); i<c; i++){
            var arrMarker = cms.gpstrack.htMarker.items(cms.gpstrack.htMarker.item(i));
            gmap.removeMarker(arrMarker[0]);
            
            delete arrMarker;
        }
    } else if('bmap' == mapConfig.mapEngine){
        for(var i=0,c=cms.gpstrack.htMarker.count(); i<c; i++){
            var arrMarker = cms.gpstrack.htMarker.items(cms.gpstrack.htMarker.item(i));
            bmap.removeMarker(arrMarker[0]);
            
            delete arrMarker;
        }
    }
        
    cms.gpstrack.htMarker.clear();
    cms.util.$('btnClearLocation').style.display = 'none';
    
    //取消GPS轨迹记录勾选
    cms.gpstrack.selectGpsTrack(2);
};

/*轨迹回放*/

cms.gpstrack.getGpsTrack = function(){
    var devCode = $('#txtDevCode').val().trim();
    var startTime = $('#txtStartTime').val().trim();
    var endTime = $('#txtEndTime').val().trim();
    var manualType = $('#ddlManualType').val().trim();
    if(!cms.gpstrack.checkFormParam()){
        return false;
    }
    var urlparam = 'action=getDeviceGpsTrack&devCode=' + devCode + '&startTime=' + startTime + '&endTime=' + endTime + '&manual=' + manualType + '&isDesc=0';

    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'text',
        url: cms.util.path + '/ajax/gps.aspx',
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
                if(jsondata.list.length == 0){
                    cms.box.alert({title:'提示信息', html:'没有找到相关的GPS轨迹记录'});
                    return false;
                }
                
                cms.gpstrack.clearGpsTrack();
                
                cms.gpstrack.isplay = true;
                cms.gpstrack.ispause = false;
                cms.util.$('btnTrackPlay').childNodes[0].innerHTML = '暂停回放';
                
                cms.gpstrack.tracklist = jsondata.list;
                cms.gpstrack.playnum = 0;
                cms.gpstrack.playcount = jsondata.list.length;
                
                cms.gpstrack.showGpsTrack();
                cms.gpstrack.playid = window.setInterval(cms.gpstrack.showGpsTrack, cms.gpstrack.playspeed);
                //cms.gpstrack.setDrawTrackLineDisabled(true);
            } else {
                if(module.checkOvertime(jsondata.error)){
                    module.showOvertime();
                } else {
                    cms.box.alert({title:'错误信息', html: jsondata.error});
                }
            }
            delete strData;
            delete jsondata;
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) == 'function'){CollectGarbage();} }
    });
};

cms.gpstrack.buildLatLng = function(lat, lng){
    if('gmap' == mapConfig.mapEngine){
        var latLng = mc.offset(parseFloat(lat), parseFloat(lng));
        return new google.maps.LatLng(latLng.lat, latLng.lng);    
    } else if('bmap' == mapConfig.mapEngine){        
        var latLng = {lat: parseFloat(lat), lng: parseFloat(lng)};
        latLng = bmap.gpsConvertBD(latLng);
        return new BMap.Point(latLng.lng, latLng.lat);
    }
}

cms.gpstrack.showGpsTrack = function(){
    var msg = '';
    if(cms.gpstrack.playnum >= 0 && cms.gpstrack.playnum <= cms.gpstrack.playcount){
        var idx = cms.gpstrack.playnum - (cms.gpstrack.playnum > 0 ? 1 : 0);
        var gt = cms.gpstrack.tracklist[idx];
        if(gt[1] != '' && gt[2] != '') {
            if('gmap' == mapConfig.mapEngine){
                var myLatLng = cms.gpstrack.buildLatLng(gt[1],gt[2]);
            
                //创建轨迹点
                if(cms.gpstrack.playnum > 0){
                    if(cms.gpstrack.playnum > 1){
                        //先清除指示点，保留第一个和最后一个
                        gmap.removeMarker(cms.gpstrack.lastMarker);
                    }
                    
                    var strHtml = '序号：%s\r\n纬度：%s\r\n经度：%s\r\n时间：%s\r\n速度：%s km/h\r\n方向：%s°';
                    strHtml = strHtml.format([(idx + 1), gt[1], gt[2], gt[3], gt[4], gt[5]]);
                    strHtml += gt[6] == 1 ? '\r\n人工手动采集' : '\r\n自动';
                    
                    var options = {
                        position: myLatLng,
                        icon: cms.gpstrack.icon,
                        func: function(){cms.gpstrack.showTrackDetail(gt, idx + 1);}
                    };
                    var trackMarker = gmap.createMarker(options);
                    cms.gpstrack.tracks[idx] = trackMarker;
                    
                    delete strHtml;
                }        
                var options = {
                    position: myLatLng,
                    image:{
                        src: gmap.iconPath.marker,
                        title: strHtml
                    },
                    label: {text: '<nobr>' + (idx + 1) + '. ' + gt[3] + '</nobr>'}
                };
                //创建指示点
                var marker = gmap.createLabelMarker(options);
                
                cms.gpstrack.lastMarker = marker;
                
                if(0 == cms.gpstrack.playnum){
                    cms.gpstrack.firstMarker = marker;
                }
                
                //轨迹连线
                if(cms.gpstrack.drawline && cms.gpstrack.playnum > 0 && cms.gpstrack.lastLatLng != null){
                    var flightPlanCoordinates = [cms.gpstrack.lastLatLng, myLatLng];
                    
                    cms.gpstrack.gpsline[cms.gpstrack.playnum-1] = gmap.createPolyLine(flightPlanCoordinates, {
                        color: cms.gpstrack.linestyle.color,
                        opacity: 0.99,
                        weight: cms.gpstrack.linestyle.width
                    });
                }
                cms.gpstrack.lastLatLng = myLatLng;
                
                if(cms.gpstrack.mapmove){
                    gmap.setBoundsContains(myLatLng);
                }
            } else if('bmap' == mapConfig.mapEngine){
                var point = cms.gpstrack.buildLatLng(gt[1],gt[2]);
                
                //创建轨迹点
                if(cms.gpstrack.playnum > 0){
                    if(cms.gpstrack.playnum > 1){
                        //先清除指示点，保留第一个和最后一个
                        bmap.removeMarker(cms.gpstrack.lastMarker);
                    }
                    
                    var strHtml = '序号：%s\r\n纬度：%s\r\n经度：%s\r\n时间：%s\r\n速度：%s km/h\r\n方向：%s°';
                    strHtml = strHtml.format([(idx + 1), gt[1], gt[2], gt[3], gt[4], gt[5]]);
                    strHtml += gt[6] == 1 ? '\r\n人工手动采集' : '\r\n自动';

                    var icon = new BMap.Icon(cms.gpstrack.icon, new BMap.Size(18,18));
                    var options = {
                        map: bmap.map, 
                        point: point,
                        options:{
                            title: strHtml,
                            icon: icon,
                            offset: new BMap.Size(0,0)
                        },
                        label: '<nobr>' + (idx + 1) + '. ' + gt[3] + '</nobr>',
                        showLabel: false
                    };
                    
                    var trackMarker = bmap.createMarker(options);                    
                    trackMarker.addEventListener('click', function(ev){
                        var p = this.getPosition();
                        cms.gpstrack.showTrackDetail(gt, idx + 1);
                    });
                    
                    cms.gpstrack.tracks[idx] = trackMarker;
                    
                    delete strHtml;
                }
                var options = {
                    map: bmap.map, 
                    point: point,
                    options:{
                        title: strHtml
                    },
                    label: '<nobr>' + (idx + 1) + '. ' + gt[3] + '</nobr>',
                    showLabel:true
                };
                //创建指示点
                var marker = bmap.createMarker(options);
                
                cms.gpstrack.lastMarker = marker;
                
                if(0 == cms.gpstrack.playnum){
                    cms.gpstrack.firstMarker = marker;
                }
                
                //轨迹连线
                if(cms.gpstrack.drawline && cms.gpstrack.playnum > 0 && cms.gpstrack.lastLatLng != null){
                    var points = [cms.gpstrack.lastLatLng, point];
                    
                    cms.gpstrack.gpsline[cms.gpstrack.playnum-1] = bmap.createPolyLine({
                        points: points,
                        options:{
                            strokeColor: cms.gpstrack.linestyle.color,
                            strokeOpacity: 0.6,
                            strokeWeight: cms.gpstrack.linestyle.width
                        }
                    });
                }
                
                cms.gpstrack.lastLatLng = point;
                
                if(cms.gpstrack.mapmove){
                    bmap.setBoundsContains(point);
                }
            }
        } else {
            cms.gpstrack.playnum--;
        }
    }
    else{
        cms.gpstrack.endTrackPlay();
        
        //轨迹播放完成，允许设置是否连线轨迹
        //gpstrack.setDrawTrackLineDisabled(false);
        return false;
    }
    cms.gpstrack.playnum++;
    return true;
};

cms.gpstrack.showTrackDetail = function(gpstrack, idx){
    var evt = window.event || arguments.callee.caller.arguments[0];
    var pos = {x: evt.clientX, y: evt.clientY};
    
    var strSequence = idx != undefined ? '序号：' + idx : '';
    var strHtml = '<div style="padding:2px 10px 5px;">%s<br />纬度：%s<br />经度：%s<br />时间：%s<br />速度：%s km/h<br />方向：%s°';
    strHtml = strHtml.format([strSequence, gpstrack[1], gpstrack[2], gpstrack[3], gpstrack[4], gpstrack[5]]);
    strHtml += gpstrack[6] == 1 ? '<br />人工手动采集' : '<br />自动';
    strHtml += '</div>';
    
    var config = {
        id: 'pwTrackDetail',
        html: strHtml,
        position: 'custom',
        x: pos.x,
        y: pos.y,
        bgOpacity: 0.3,
        noBottom: true,
        noTitle: true,
        titleBgColor: '#fff',
        titleBorderStyle: 'none',
        lock: false,
        height: 'auto'
    };
    cms.box.win(config);
};

cms.gpstrack.calculateToView = function(latlng){
    var bounds = emap.map.getBounds();
    //不在bounds之内则做相应的处理
    if (!bounds.contains(latlng)){
        emap.map.setCenter(latlng);
    }
};

cms.gpstrack.startTrackPlay = function(btn){
    if(cms.gpstrack.isrepeat){
        //重复回放，先清除之前的回放轨迹
        cms.gpstrack.clearGpsTrack();
        cms.gpstrack.isrepeat = false;
    }
    if(cms.gpstrack.isplay){
        //正在播放，暂停        
        cms.gpstrack.pauseTrackPlay()
        cms.gpstrack.ispause = true;
        cms.gpstrack.isplay = false;
        btn.childNodes[0].innerHTML = '继续回放';
    } 
    else if(cms.gpstrack.ispause){
        //暂停中，继续播放
        cms.gpstrack.showGpsTrack();
        cms.gpstrack.playid = window.setInterval(cms.gpstrack.showGpsTrack, cms.gpstrack.playspeed);
        cms.gpstrack.isplay = true;
        cms.gpstrack.ispause = false;
        btn.childNodes[0].innerHTML = '暂停回放';
        
    } else {
        //加载轨迹，准备播放
        cms.gpstrack.getGpsTrack();
    }
};

//回放结束，可重复回放
cms.gpstrack.endTrackPlay = function(){
    if(cms.gpstrack.playid != null){
        clearInterval(cms.gpstrack.playid);
    }
    
    cms.box.alert({title:'提示信息',html:'轨迹回放结束'});
        
    cms.gpstrack.playnum = 0;
    cms.gpstrack.isplay = false;
    cms.gpstrack.ispause = false;
    //重复回放标记
    cms.gpstrack.isrepeat = true;
    cms.util.$('btnTrackPlay').childNodes[0].innerHTML = '重复回放';
};

//停止回放，需重新加载数据再回放
cms.gpstrack.stopTrackPlay = function(){
    if(cms.gpstrack.playid != null){
        clearInterval(cms.gpstrack.playid);
    }
    
    cms.gpstrack.playnum = 0;
    cms.gpstrack.isplay = false;
    cms.gpstrack.ispause = false;
    cms.util.$('btnTrackPlay').childNodes[0].innerHTML = '轨迹回放';
};

//暂停回放
cms.gpstrack.pauseTrackPlay = function(){
    if(cms.gpstrack.playid != null){
        clearInterval(cms.gpstrack.playid);
    }
    return true;
};

cms.gpstrack.clearGpsTrack = function(){
    if(cms.gpstrack.isplay || cms.gpstrack.ispause){
        cms.box.alert({title:'提示信息',html:'轨迹回放或暂停回放时不能清除回放轨迹。<br />请先停止回放才能清除轨迹。'});
        return false;
    }    
    if('gmap' == mapConfig.mapEngine){
        for(var i=0,c=cms.gpstrack.tracks.length; i<c; i++){
            gmap.removeMarker(cms.gpstrack.tracks[i]);
        }
        for(var j=0,c=cms.gpstrack.gpsline.length; j<c; j++){
            gmap.removeMarker(cms.gpstrack.gpsline[j]);
        }
        if(cms.gpstrack.firstMarker != null){
            gmap.removeMarker(cms.gpstrack.firstMarker);
        }
        if(cms.gpstrack.lastMarker != null){
            gmap.removeMarker(cms.gpstrack.lastMarker);
        }
    } else if('bmap' == mapConfig.mapEngine){    
        for(var i=0,c=cms.gpstrack.tracks.length; i<c; i++){
            bmap.removeMarker(cms.gpstrack.tracks[i]);
        }
        for(var j=0,c=cms.gpstrack.gpsline.length; j<c; j++){
            bmap.removeMarker(cms.gpstrack.gpsline[j]);
        }
        if(cms.gpstrack.firstMarker != null){
            bmap.removeMarker(cms.gpstrack.firstMarker);
        }
        if(cms.gpstrack.lastMarker != null){
            bmap.removeMarker(cms.gpstrack.lastMarker);
        }
    }
    //清除GPS轨迹数据列表
    delete cms.gpstrack.tracklist;
    cms.gpstrack.tracklist = [];
    
    delete cms.gpstrack.tracks;
    delete cms.gpstrack.gpsline;
    cms.gpstrack.tracks = [];
    cms.gpstrack.gpsline = [];
};