var gprsHistory = gprsHistory || {};

var paddingTop = 1;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 200;
var rightWidth = 0;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = 680;
//滚动条宽度
var scrollBarWidth = 17;

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;
var pageCount = 1;

var timer = 60;
var time = timer;
var pause = false;
var autoPause = true;
var setPause = false;
var loaded = false;
var enabled = true;

var treeType = 'device';
var treeTitle = '设备列表';
var isSearchTree = false;
var treekeys = '';

var settingCookieName = 'gprs_history_cookie';

var userName = loginUser.userName;

$(window).load(function(){
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    module.showDebugBox();
    module.hideDebugBox();
    
    if(devCode == ''){
        //创建树型菜单表单
        tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
        //加载树型菜单
        tree.showTreeMenu(false, treeType, 'treeAction', true);
        //定时刷新
        tree.timer = window.setTimeout(tree.updateDevStatus, 30*1000, 30*1000);
    } else {
        $('#bodyLeft').hide();
        $('#bodyLeftSwitch').hide();
    }
    loadData();
    
    updateTimeBoard(time);
    window.setInterval(timing, 1000);
    
    setBodySize();
    
    $('.chb').focus(function(){
        this.blur();
    }); 
    
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
    if(devCode !== ''){
        $('#lblTitle').html($('#txtDevName').val());
        $('#divDevCode').hide();
    } else {
        $('#bodyLeftSwitch').click(function(){
            setLeftDisplay($(this));
        });
    }
    
    if(module.isDebug){
        $('#mainTitle .tools').append('<a class="ibtn" id="btnDebug" title="调试" onclick="showDebugInfo();"><i class="icon-debug"></i></a>');
    }
        
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    
    $('#listHeader').html(cms.util.buildTable('tbHeader','tbheader'));
    $('#listContent').html(cms.util.buildTable('tbList','tblist'));
    
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
    
    $('a').focus(function(){
        $(this).blur();
    });
}

var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
    rightWidth = cms.frame.rightWidth;
    $('#pageBody').css('padding', paddingTop);
    
    if(devCode == ''){
        boxSize = {
            width: frameSize.width - leftWidth - switchWidth - borderWidth - paddingTop*2, 
            height: frameSize.height - borderWidth - paddingTop*2
        };
        $('#bodyLeft').width(leftWidth - borderWidth);
        $('#bodyLeftSwitch').width(switchWidth);
        $('#bodyLeft').height(boxSize.height);
        $('#bodyLeftSwitch').height(boxSize.height);
    } else {        
        boxSize = {
            width: frameSize.width - borderWidth - paddingTop*2, 
            height: frameSize.height - borderWidth - paddingTop*2
        };
    }
    
    $('#bodyMain').width(boxSize.width);
    
    $('#bodyMain').height(boxSize.height);
    
    setBoxSize();
}

var setBoxSize = function(){
    if(devCode == ''){
        $('#treebox').width(leftWidth - 2);
        $('#treebox').height(boxSize.height - 52);
    }
    
    $('.listbox').width(boxSize.width);
    if(cms.util.isIE6){
        $('.listbox .listheader').width(boxSize.width);
        $('.listbox .list').width(boxSize.width);
    }
    $('.listbox').height(boxSize.height - 25*2 - 28);
    $('.listbox .listheader').height(23);
    $('.listbox .list').height(boxSize.height - 25*2 - 26 - 25);
    
    var showProtocol = cms.util.$('showProtocol').checked;
    setListBoxSize(loginUser.userName, showProtocol);
}

var setListBoxSize = function(userName, showProtocol){    
    //设置List表格宽度
    if(userName == 'admin' && showProtocol){
        listBoxMinWidth = 1200;
    } else {
        listBoxMinWidth = 680;
    }
    if(boxSize.width >= listBoxMinWidth){
        listBoxMinWidth = boxSize.width;
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

var setTableStyle = function(tb){
    $(tb + ' tr:odd').addClass('alternating');
    $(tb + ' tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
   
    $(tb + ' a').focus(function(){
        $(this).blur();
    });
}

var treeAction = function(param){
    switch(param.type){
        case 'unit':
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', '');
            $('#lblTitle').html(' - ' + param.unitName);
            break;
        case 'device':
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            $('#lblTitle').html(' - ' + param.devName);
            break;
    }
    pageIndex = pageStart;
    getDeviceGprsLog();
}

var loadData = function(){
    pageIndex = pageStart;
    getDeviceGprsLog();    
}

var getDeviceGprsLog = function(){
    //记录加载开始时间
    dtRunStart = new Date();
        
    var unitId = $('#txtDevUnitId').val();
    var typeCode = $('#ddlDevType').val();
    var devCode = $('#txtDevCode').val();
    var startTime = $('#txtStartTime').val();
    var endTime = $('#txtEndTime').val();
        
    var showProtocol = $('#showProtocol').attr('checked') == 'checked' ? 1 : 0;
    
    var dtStart = startTime.toDate();
    var dtEnd = endTime.toDate();
    if(dtEnd - dtStart < 0){
        cms.box.alert({id: boxId,title: '错误信息', html:'结束时间不能小于开始时间！'});
        return false;
    } else if(dtEnd.dateDifference(dtStart) > 90){
        cms.box.alert({id: boxId,title: '错误信息', html:'时间间隔不得超过90天！'});
        return false;
    }
    
    if(!enabled) return false;
    enabled = false;
    
    //清除分页数据
    $('#pagination').html('');
    //显示加载
    showLoading(true);  
    
    var urlparam = 'action=getDeviceGprsLog&unitId=' + unitId + '&typeCode=' + typeCode + '&devCode=' + devCode 
        + '&startTime=' + startTime + '&endTime=' + endTime
        + '&pageIndex=' + (pageIndex-pageStart) + '&pageSize=' + pageSize
        + '&showProtocol=' + showProtocol + '&' + new Date().getTime();

    if(!module.isDebugInfoAppend){
        module.clearDebugInfo();
    }
    module.appendDebugInfo(module.getDebugTime() + '[GetDeviceGprsLog Request] param: ' + urlparam);
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/gprs.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            module.appendDebugInfo(module.getDebugTime() + '[GetDeviceGprsLog Response] data: ' + data);
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            
            $('#txtData').attr('value', data);
            var strData = $('#txtData').val();
            if(!strData.isJsonData()){
                module.showDataError({html:strData, width:400, height:250});
                return false;
            }
            setListBoxSize(loginUser.userName, showProtocol);
            
            var jsondata = strData.toJson();//eval('(' + strData + ')');
            showListHeader(showProtocol);
            if(!showDeviceGprsLog(jsondata, showProtocol)){
                enabled = true;
                getDeviceGprsLog();
            } else {            
                enabled = true;
                showLoading(false);                
            }
            module.appendDebugInfo(module.getDebugTime() + '[ShowDeviceGprsLog Finished]');
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) == 'function'){CollectGarbage();} }
    });
}

var showListHeader = function(showProtocol){
    var objHeader = cms.util.$('tbHeader');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    
    var rowData = gprsList.buildLogListHeader('', userName, showProtocol);
    cms.util.fillTable(row, rowData);
}

var showDeviceGprsLog = function(jsondata, showProtocol){
    var objList = cms.util.$('tbList');
    var rid = 0;
    var dataCount = jsondata.dataCount;
    var dc = jsondata.list.length;
    var rowData = [];
    
    var pc = cms.util.pageCount(dataCount, pageSize);
    if(pageIndex > pc && dataCount > 0){
        //cms.box.alert({id: boxId,title: '提示信息', html:'请输入正确的页码！<br />正确的页码是：1-' + pc + '。'});    
        pageIndex = pc;
        
        return false;
    } else {
        autoPause = true;
        cms.util.clearDataRow(objList, 0);
        
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (pageIndex-pageStart) * pageSize + rid + 1;
            
            rowData = gprsList.buildLogListData(row, dr, rnum, userName, {devName: jsondata.devName}, showProtocol);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
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
        
        autoPause = false;
        
        return true;
    }
}

var showPage = function(page){
    pageIndex = parseInt(page, 10);
    getDeviceGprsLog();
}

var showDeviceDetail = function(){

}

var showDebugInfo = function(){
    module.showDebugBox();
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

var shortcutKeyAction = function(keyCode){
    timerPlay(cms.util.$('btnTimerPlay'));
};

var checkSettingCookieIsExist = function(){
    var settingByCookie = cms.util.getCookie(settingCookieName);    
    return settingByCookie !== '';
}

//显示设置面板
var showSetting = function(obj){
    var isCookie = checkSettingCookieIsExist();
    if(cms.util.$('ddlPageSize') == null){
        var opSize = [['1','1 条'],['2','2 条'],['5','5 条'],['10','10 条'],['15','15 条'],['20','20 条'],['25','25 条'],['30','30 条'],['50','50 条'],['100','100 条'],['200','200 条']];
        var opTime = [['3','3 秒钟'],['5','5 秒钟'],['10','10 秒钟'],['15','15 秒钟'],['30','30 秒钟'],['45','45 秒钟'],['60','1 分钟'],['180','3 分钟'],['300','5 分钟']];
        var strHtml = '<div class="p-10">'
            + '<div>每页显示<select id="ddlPageSize" class="select w70 m-0-3" >'
            + cms.util.buildOptions(opSize, pageSize)
            + '</select>记录'
            + '</div>'
            + '<div class="p-10-0">'
            + '<a class="btn btnc22" style="float:right;" onfocus="this.blur();" onclick="refresh();"><span class="w50">立即刷新<span></a>'
            + '设置定时<select id="ddlTimer" class="select w70 m-0-3" >'
            + cms.util.buildOptions(opTime, timer)
            + '</select>刷新'
            + '</div>'
            + '<label for="chbSaveSetting" class="lblCheckBox"><input type="checkbox" id="chbSaveSetting" ' + (isCookie ? 'checked="checked"' : '') + ' onfocus="this.blur();" /><span>记住我的设置</span></label>'
            + '</div>';
        cms.box.form({
            id: 'settingbox',
            title: '页面设置',
            html: strHtml,
            width: 250,
            height: 180,
            callBack: changeSetting,
            build: 'show',
            reload: false
        });
    } else {
        popwin.Show('settingbox');
        $('#ddlPageSize').attr('value', pageSize);
        $('#ddlTimer').attr('value', timer);
        $('#chbSaveSetting').attr("checked", isCookie);
    }
}

var changeSetting = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var ps = $('#ddlPageSize').val();
        if(ps > pageSize){
            pageIndex = pageStart;
        }
        pageSize = ps;
        timer = $('#ddlTimer').val();
        time = timer;
        
        if($('#chbSaveSetting').is(":checked")){
            //将当前设置写入Cookie中
            cms.util.setCookie(settingCookieName, '{pageSize:\'' + pageSize + '\',timer:\'' + timer + '\'}', 7*24);
        } else {
            cms.util.delCookie(settingCookieName);
        }
        getDeviceGprsLog();
    }
    pwobj.Hide();
}

var refresh = function(){
    getDeviceGprsLog();
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

var updateTimeBoard = function(time){
    $('#timeboard .ts').html(time);
}