var paddingTop = 4;
var paddingWidth = 5;
var leftWidth = leftWidthConfig = 200;
var rightWidth = rightWidthConfig =  0;

var switchWidth = 5;
var boxSize = {};
var paddingTop = 4;
var borderWidth = 1;

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;
var pageCount = 1;

$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, rightWidth, setBodySize);
    
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    
     //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    
    var checkbox = {callback:'setDeviceChecked'};
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true, false, false, true, true, '', checkbox);
    //定时刷新树型菜单设备状态
    tree.timer = window.setTimeout(tree.updateDevStatus, 15*1000, 15*1000);
    
    setBodySize();
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: null, shiftKeyFunc: null});
});

$(window).unload(function(){});

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
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2014-01-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2014-01-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    
    $('#listHeader').html(cms.util.buildTable('tbHeader','tbheader'));
    $('#listContent').html(cms.util.buildTable('tbList','tblist'));
    
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    buildTableHeader();
};

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = $('#bodyLeft').is(':visible') ? leftWidthConfig : 0;
    $('#pageBody').css('padding-top', paddingTop);
    
    $('#bodyLeft').width(leftWidth - borderWidth);
    $('#bodyLeftSwitch').width(switchWidth);
    boxSize = {
        width: frameSize.width - borderWidth - leftWidth - switchWidth, 
        height: frameSize.height - paddingTop - borderWidth - (cms.util.isMSIE ? 0 : 1)
    };
    
    $('#bodyLeft').height(boxSize.height);
    $('#bodyLeftSwitch').height(boxSize.height);
    
    $('#bodyMain').width(boxSize.width);
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
};

var setBoxSize = function(){
    $('#leftMenu').height(boxSize.height);
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 25*2);
    
    $('#mainContent').width(boxSize.width);
    $('#mainContent').height(boxSize.height - 28);
    
    $('.listbox').width(boxSize.width);
    $('.listbox .listheader').width(boxSize.width);
    $('.listbox .list').width(boxSize.width);
    
    $('.listbox').height(boxSize.height - 28 - 25);
    $('.list').height(boxSize.height - 28 - 26 - 23);
    
    $('#tbHeader').css('min-width', 1020);
    $('#tbList').css('min-width', 1000);
};

var setLeftDisplay = function(obj){
    if(obj == undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

/*
var treeAction = function(param){
    switch(param.type){
        case 'unit':
            alert(param.unitId);
            $('#txtUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', '');
            break;
        case 'device':
            alert(param.devCode);
            $('#txtUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            break;
    }
    getDeviceGpsStat(cms.util.$('btnSearch'));
};
*/

/*显示设备GPS定位*/
var setDeviceChecked = function(){
    $('#txtDevCode').attr('value', getCheckedDevice());
    pageIndex = pageStart;
    getDeviceGpsStat();
    module.setControlDisabled(cms.util.$('btnSearch'), true);
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

var getDeviceGpsStat = function(btn){
    setLoadingPrompt('正在查询，请稍候...');
    var devCode = $('#txtDevCode').val().trim();
    
    var startTime = $('#txtStartTime').val().trim();
    var endTime = $('#txtEndTime').val().trim();
    var urlparam = 'action=getDeviceGpsMileageStat&devCode=' + devCode + '&startTime=' + startTime + '&endTime=' + endTime
        + '&pageIndex=' + (pageIndex-pageStart) + '&pageSize=' + pageSize + '&' + new Date().getTime();
    if(!module.checkControlDisabled(btn)){
        return false;
    }    
    module.ajaxRequest({
        url: cmsPath + '/ajax/gps.aspx',
        data: urlparam,
        callBack: getDeviceGpsStatCallBack,
        param: {
            btn: btn
        }
    });
};

var getDeviceGpsStatCallBack = function(data, param){
    module.setControlDisabledByTiming(param.btn, false);
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(jsondata.result != 1 || jsondata.list == undefined){
        module.showErrorInfo(jsondata.msg, jsondata.error);
        return false;
    }
    showDeviceGpsStat(jsondata);
};

var buildTableHeader = function(){
    var objHeader = cms.util.$('tbHeader');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '设备编号', style:[['width','100px']]};
    rowData[cellid++] = {html: '设备名称', style:[['width','120px']]};
    rowData[cellid++] = {html: '里程(km/h)', style:[['width','65px']]};
    rowData[cellid++] = {html: '油耗(L)', style:[['width','50px']]};
    rowData[cellid++] = {html: '起始里程', style:[['width','65px']]};
    rowData[cellid++] = {html: '起始时间', style:[['width','120px']]};
    rowData[cellid++] = {html: '结束里程', style:[['width','65px']]};
    rowData[cellid++] = {html: '结束时间', style:[['width','120px']]};
    rowData[cellid++] = {html: '百公里油耗(L)', style:[['width','85px']]};
    rowData[cellid++] = {html: '组织机构', style:[['width','100px']]};
    
    rowData[cellid++] = {html: '', style:[]};
    
    cms.util.fillTable(row, rowData);
};

var showDeviceGpsStat = function(jsondata){
    var objList = cms.util.$('tbList');
    var rid = 0;
    var num = (pageIndex - pageStart) * pageSize;
    cms.util.clearDataRow(objList, 0);
    
    for(var i=0,c=jsondata.list.length; i<c; i++){
        var dr = jsondata.list[i];
        var row = objList.insertRow(rid++);    
        var cellid = 0;
        var rowData = [];
        
        rowData[cellid++] = {html: (num + i + 1), style:[['width','35px']]};
        rowData[cellid++] = {html: dr.code, style:[['width','100px']]};
        rowData[cellid++] = {html: module.buildLabelText(dr.name, 'text-align:center;'), style:[['width','120px']]};
        rowData[cellid++] = {html: dr.mileage, style:[['width','65px']]};
        rowData[cellid++] = {html: dr.fuel, style:[['width','50px']]};
        rowData[cellid++] = {html: dr.min, style:[['width','65px']]};
        rowData[cellid++] = {html: dr.minTime == '' ? '-' : dr.minTime, style:[['width','120px']]};
        rowData[cellid++] = {html: dr.max, style:[['width','65px']]};
        rowData[cellid++] = {html: dr.maxTime == '' ? '-' : dr.maxTime, style:[['width','120px']]};
        rowData[cellid++] = {html: dr.fuelRate, style:[['width','85px']]};
        rowData[cellid++] = {html: module.buildLabelText(dr.uname, 'text-align:center;'), style:[['width','100px']]};
        
        rowData[cellid++] = {html: '', style:[]};
        
        cms.util.fillTable(row, rowData);
    }
    
    dataCount = jsondata.dataCount;
    var config = {
        dataCount: dataCount,
        pageIndex: pageIndex,
        pageSize: pageSize,
        pageStart: pageStart,
        showType: 'nolist',
        markType: 'Symbol',
        callBack: 'showPage',
        showDataStat: true,
        showPageCount: false,
        keyAble: true
    };
    var pager = new Pagination();
    pager.Show(config, cms.util.$('pagination'));
    pageCount = pager.pageCount;
    
    setTableStyle('#tbList');
    
    module.setControlDisabled(cms.util.$('btnSearch'), false);
    setLoadingPrompt('');
};

var showPage = function(page){
    pageIndex = parseInt(page, 10);
    getDeviceGpsStat();
    module.setControlDisabled(cms.util.$('btnSearch'), true);
};

var setTableStyle = function(tb){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
};

var setLoadingPrompt = function(str){
    $('#loading').html(str);
};

var exportDevice = function(){
    var strHtml = '确定要导出设备GPS里程统计信息吗？';
    cms.box.confirm({
        id: 'exportdevice',
        title: '导出设备GPS里程统计信息',
        html: strHtml,
        width: 320,
        callBack: exportDeviceAction
    });
};

var exportDeviceAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var unitId = $('#txtUnitId').val();
        var devCode = $('#txtDevCode').val().trim();    
        var startTime = $('#txtStartTime').val().trim();
        var endTime = $('#txtEndTime').val().trim();
        var handleURL = cmsPath + '/ajax/gps.aspx?action=exportDeviceGpsMileageStat&devCode=' + devCode + '&startTime=' + startTime + '&endTime=' + endTime
            + '&isIE=' + (cms.util.isMSIE ? 1 : 0) + '&' + new Date().getTime();
            
        window.location.href = handleURL;
    }
    pwobj.Hide();
};