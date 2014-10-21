var alarm = alarm || {};

var paddingTop = 4;
var paddingWidth = 5;
var borderWidth = 2;
var leftWidth = 200;
var rightWidth = 0;
var switchWidth = 5;
var boxSize = {};
var boxId = 'pwbox001';
//列表框最小宽度
var listBoxMinWidth = 1069;
//滚动条宽度
var scrollBarWidth = 18;

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 10;
var pageCount = 0;

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

var arrKeys = {name:'输入要查找的设备名称', indexcode:'输入要查找的设备编号'};

var settingCookieName = 'pic_alarm_cookie';

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(bodySize.width > 1280){
        leftWidth = 220;
    }
    cms.frame.setFrameSize(leftWidth, rightWidth);
    setBodySize();
    cms.frame.setPageBodyDisplay();
    
    initialForm();
    module.showDebugBox();
    module.hideDebugBox();
    
    //创建树型菜单表单
    tree.buildTreeForm('#leftMenu', treeType, treeTitle, 'tree.showTreeMenu', 'treeAction', true, leftWidth);
    //加载树型菜单
    tree.showTreeMenu(false, treeType, 'treeAction', true);
    //定时刷新树型菜单设备状态
    tree.timer = window.setTimeout(tree.updateDevStatus, 30*1000, 30*1000);
    
    loadData();
    
    updateTimeBoard(time);
    window.setInterval(timing, 1000);
    
    setBodySize();
    
    cms.frame.setFrameByShortcutKey({resizeFunc: setBodySize, keyFunc: shortcutKeyAction, shiftKeyFunc: null});
});

$(window).resize(function(){
    if(cms.frame.resize++ === 0){
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
    
    $('#listHeader').html(cms.util.buildTable('tbHeader','tbheader'));
    $('#listContent').html(cms.util.buildTable('tbList','tbalarm'));
    
    $('#txtKeywords').focus(function(){
        if(checkKeywords(this)){
            $(this).attr('value','');
        }
    });
    
    if(module.isDebug){
        $('#mainTitle .tools').append('<a class="ibtn" id="btnDebug" title="调试" onclick="showDebugInfo();"><i class="icon-debug"></i></a>');
    }
    
    window.setTimeout(cms.util.setKeyEnter, 500, [cms.util.$('txtKeywords')], 'loadData');

    var maxdate = $("#txtMaxDate").val();
    $("#txtStartTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    $("#txtEndTime").focus(function(){
        WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',maxDate:maxdate,dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
    
    $('#ddlType').change(function(){
        switch($(this).val()){
            case 'name':
                if(checkKeywords('#txtKeywords')){
                    $('#txtKeywords').attr('value', arrKeys.name);
                }
                break;
            case 'indexcode':
                if(checkKeywords('#txtKeywords')){
                    $('#txtKeywords').attr('value', arrKeys.indexcode);
                }
                break;
        }
    });
    
    getSettingCookie();
    
    updateTimeBoard(time);
    
    $('a').focus(function(){
        $(this).blur();
    });
};

var shortcutKeyAction = function(keyCode){
    timerPlay(cms.util.$('btnTimerPlay'));
};

//alert(navigator.userAgent);
var setBodySize = function(){
    var frameSize = cms.frame.getFrameSize();
    leftWidth = cms.frame.leftWidth;
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
    
    setBoxSize(frameSize);
};

var setBoxSize = function(frameSize){
    $('#treebox').width(leftWidth - 2);
    $('#treebox').height(boxSize.height - 52);
    
    $('#listBox').height(boxSize.height - 25*2 - 28);
    $('#listHeader').height(23);
    $('#listContent').height(boxSize.height - 25*2 - 28 - 23);
        
    if(boxSize.width > listBoxMinWidth){
        $('#tbHeader').width(boxSize.width);
        $('#tbList').width(boxSize.width - scrollBarWidth);
        
        //设置表格内容宽度
        $('.td-alarm-info').width(boxSize.width - 809);
        $('.tbinfo .txt').width(boxSize.width - 809 - 110);
    } else {
        $('#tbHeader').width(listBoxMinWidth);
        $('#tbList').width(listBoxMinWidth - scrollBarWidth);
        
        $('.td-alarm-info').width(listBoxMinWidth - 809);
        $('.tbinfo .txt').width(150);
    }
    
    cms.util.$("listContent").onscroll = function(){
//        $('.referPicBox').css('position','inherit');
//        $('.alarmPicBox').css('position','inherit');
        cms.util.scrollSync(this, cms.util.$('listHeader'));
    }
};

var setLeftDisplay = function(obj){
    if(obj === undefined){
        obj = $('#bodyLeftSwitch');
    }
    cms.frame.setLeftDisplay($('#bodyLeft'), obj);
};

var loadData = function(){
    pageIndex = pageStart;
    $('#txtDevCode').attr('value', '');
    $('#txtDevUnitId').attr('value', $('#txtUserUnitId').val());
    getAlarmInfo();    
};

var loadAllData = function(){
    pageIndex = pageStart;
    clearKeywords();
    $('#txtDevCode').attr('value', '');
    $('#txtDevUnitId').attr('value', $('#txtUserUnitId').val());
    getAlarmInfo(); 
};

var clearKeywords = function(){
    $('#txtKeywords').attr('value', '');
};

var treeAction = function(param){
    switch(param.type){
        case 'unit':
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', '');
            $('#txtKeywords').attr('value', '');
            $('#lblTitle').html('&nbsp;-&nbsp;' + param.unitName);
            break;
        case 'device':
            $('#ddlType').attr('value', 'name');
            $('#txtDevUnitId').attr('value', param.unitId);
            $('#txtDevCode').attr('value', param.devCode);
            $('#txtKeywords').attr('value', param.devName);
            $('#lblTitle').html('&nbsp;-&nbsp;' + param.unitName);
            break;
    }
    pageIndex = pageStart;
    getAlarmInfo();
};

var getAlarmInfo = function(){
    //记录加载开始时间
    dtRunStart = new Date();
        
    var unitId = $('#txtDevUnitId').val();
    var devCode = $('#txtDevCode').val();
    var channelNo = 0;
    var presetNo = 0;
    var startTime = $('#txtStartTime').val();
    var endTime = $('#txtEndTime').val();
    var filter = $('#ddlType').val();
    var keywords = $('#txtKeywords').val();
    if(checkKeywords('#txtKeywords')){
        keywords = '';
    }
    var minAlarmLevel = -1;
    var maxAlarmLevel = -1;
    var strAlarmLevel = $('#ddlAlarmLevel').val();
    if(strAlarmLevel !== '-1'){
        minAlarmLevel = parseInt(strAlarmLevel.split(',')[0]);
        maxAlarmLevel = parseInt(strAlarmLevel.split(',')[1]);
    }
    
    if(startTime === ''){
        cms.box.alert({id: boxId,title: '错误信息', html:cms.box.singleLine('请选择开始时间！')});
        return false;
    }
    else if(endTime === ''){
        cms.box.alert({id: boxId,title: '错误信息', html:cms.box.singleLine('请选择结束时间！')});
        return false;
    }
    else{
        endTime += endTime.length === 10 ? ' 23:59:59' : '';
    }
    var dtStart = startTime.toDate();
    var dtEnd = endTime.toDate();
    if(dtEnd - dtStart < 0){
        cms.box.alert({id: boxId,title: '错误信息', html:cms.box.singleLine('结束时间不能小于开始时间！')});
        return false;
    }else if(dtEnd.dateDifference(dtStart) > 365){
        cms.box.alert({id: boxId,title: '错误信息', html:cms.box.singleLine('时间间隔不得超过365天！')});
        return false;        
    }
    //devCode = filter === 'indexcode' ? keywords : '';
    
    if(!enabled) return false;
    enabled = false;
    
    //清除分页数据
    $('#pagination').html('');
    //显示加载
    showLoading(true);  
        
    var urlparam = 'action=getPictureAlarmLog&unitId=' + unitId + '&devCode=' + devCode + '&channelNo=' + channelNo + '&presetNo=' + presetNo 
        + '&filter=' + filter + '&keywords=' + escape(keywords) + '&minAlarmLevel=' + minAlarmLevel + '&maxAlarmLevel=' + maxAlarmLevel
        + '&startTime=' + startTime + '&endTime=' + endTime
        + '&pageIndex=' + (pageIndex-pageStart) + '&pageSize=' + pageSize
        + '&' + new Date().getTime();
    
    if(!module.isDebugInfoAppend){
        module.clearDebugInfo();
    }
    module.appendDebugInfo(module.getDebugTime() + '[GetAlarmList Request] param: ' + urlparam);
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/alarm.aspx',
        data: urlparam,
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            module.appendDebugInfo(module.getDebugTime() + '[GetAlarmList Response] data: ' + data);
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
            var jsondata = strData.toJson();//eval('(' + strData + ')');
            showListHeader();
            if(!showAlarmList(jsondata)){
                enabled = true;
                getAlarmInfo();
            } else {
                enabled = true;
                showLoading(false);
            }
            module.appendDebugInfo(module.getDebugTime() + '[ShowAlarmList Finished]');
        },
        complete: function(XHR, TS){ XHR = null; if(typeof(CollectGarbage) === 'function'){CollectGarbage();} }
    });
};

var showListHeader = function(){
    var objHeader = cms.util.$('tbHeader');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    
    var rowData = alarmList.buildListHeader();
    cms.util.fillTable(row, rowData);
};

var showAlarmList = function(jsondata){
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
        
        //当前登录的用户信息
        var userInfo = {userName:loginUser.userName,userRole:loginUser.userRole,userPriority:loginUser.userPriority};
        
        for(var i = 0; i < dc; i++){
            var dr = jsondata.list[i];
            var row = objList.insertRow(rid);
            var rnum = (pageIndex-pageStart) * pageSize + rid + 1;
            var strParam = "";//"{devId:'" + dr.devId + "',devName:'" + dr.devName + "',devCode:'" + dr.devCode + "',unitId:'组织单元ID" + (i+1) + "'}";
            
            row.lang = strParam;
            
            rowData = alarmList.buildListData(row, dr, rnum, userInfo, {devName: jsondata.devName});
            
            cms.util.fillTable(row, rowData);
            
            //预加载图片
            loadPicture('#imgRefer' + rnum);
            loadPicture('#imgAlarm' + rnum);
            
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
        
        setTableStyle();
        
        autoPause = false;
        
        return true;
    }
};

var showPage = function(page){
    pageIndex = parseInt(page, 10);
    getAlarmInfo();
};

var setTableStyle = function(){
    $('.tbinfo tr:odd').addClass('alternating');
    $('.tbinfo tr').hover(
        function() {$(this).addClass('hover');},
        function() {$(this).removeClass('hover');}
    );
    var chbitems = $('#tbList tr input[type="checkbox"]');
    chbitems.click(function() {
        if($(this).attr("checked") === 'checked'){
            $(this).parents('tr').addClass('selected');
        }else{
            $(this).parents('tr').removeClass('selected');
        }        
        $('#chbAll').attr('checked', chbitems.size() === cms.jquery.getCheckBoxChecked('#tbList').size());
    });
    
    $('#chbAll').click(function(){
        cms.jquery.selectCheckBox('#tbList');
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
    $('#tbList a').focus(function(){
        $(this).blur();
    });
};

var showDebugInfo = function(){
    module.showDebugBox();
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

var checkKeywords = function(objTxt){
    return $(objTxt).val() === arrKeys.indexcode || $(objTxt).val() === arrKeys.name;
};

var updateTimeBoard = function(time){
    $('#timeboard .ts').html(time);
};

var getSettingCookie = function(){
    var settingByCookie = cms.util.getCookie(settingCookieName);
    if(settingByCookie.isJsonData()){
        try{
            var jsonSet = eval('(' + settingByCookie + ')');
            pageSize = parseInt(jsonSet.pageSize);
            timer = parseInt(jsonSet.timer);
            time = timer;
        }catch(e){
            alert(e);
        }
    }
};

var checkSettingCookieIsExist = function(){
    var settingByCookie = cms.util.getCookie(settingCookieName);    
    return settingByCookie !== '';
};

//显示设置面板
var showSetting = function(obj){
    var isCookie = checkSettingCookieIsExist();
    if(cms.util.$('ddlPageSize') === null){
        var opSize = [['1','1 条'],['2','2 条'],['5','5 条'],['10','10 条'],['15','15 条'],['20','20 条'],['25','25 条'],['30','30 条'],['50','50 条'],['100','100 条']];
        var opTime = [];
        if(loginUser.userName === 'admin' || parseInt(loginUser.userId, 10) === 1 || (parseInt(loginUser.userRole, 10) === 1 &&  parseInt(loginUser.userPriority, 10) >= 90)){
            opTime = [['3','3 秒钟'],['5','5 秒钟'],['10','10 秒钟'],['15','15 秒钟'],['30','30 秒钟'],['45','45 秒钟'],['60','1 分钟'],['180','3 分钟'],['300','5 分钟']];
        } else {
            opTime = [['15','15 秒钟'],['30','30 秒钟'],['45','45 秒钟'],['60','1 分钟'],['180','3 分钟'],['300','5 分钟']];
        }
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
            callBack: changeSetting
        });
    } else {
        popwin.Show('settingbox');
        $('#ddlPageSize').attr('value', pageSize);
        $('#ddlTimer').attr('value', timer);
        $('#chbSaveSetting').attr("checked", isCookie);
    }
};

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
    }
    pwobj.Hide();
};

var refresh = function(){
    getAlarmInfo();
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

var deletePictureAlarm = function(alarmIdList){
    if(alarmIdList === '') return false;
    var urlparam = 'action=deletePictureAlarm&alarmIdList=' + alarmIdList;
    //alert(urlparam);
    $.ajax({
        type: 'post',
        //async: false,
        datatype: 'json',
        url: cms.util.path + '/ajax/alarm.aspx',
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
                getAlarmInfo();
            }
        }
    });
};

var deleteAlarmAction = function(pwobj, pwReturn){
    var strIdList = pwReturn.returnValue.idList;// $('#txtDelList').val();
    if(pwReturn.dialogResult){
        deletePictureAlarm(strIdList);
    }
    timerPlayStop(false);
    pwobj.Hide();
};

var deleteSingleAlarm = function(alarmIdList){
    var strHtml = cms.box.singleLine('删除后不可恢复，确定要删除报警信息吗？');
    cms.box.confirm({
        id: 'pwalarmdelete',
        title: '删除报警信息',
        html: strHtml,
        callBack: deleteAlarmAction,
        returnValue: {
            idList: alarmIdList
        }
    });
    
    timerPlayStop(true);
};

var deleteMultiAlarm = function(){
    var dc = cms.jquery.getCheckBoxChecked('#tbList').length;    
    var strIdList = cms.jquery.getCheckBoxCheckedValue('#tbList');
    
    if(dc === 0){
        cms.box.alert({title:'提示信息', html:cms.box.singleLine('请选择报警信息！'),width:200,height:135});
        return false;
    } else {
        var strHtml = '当前选中了<b style="color:#f00;padding:0 3px;">' + dc + '</b>个报警信息。<br />'
            + '删除后不可恢复，确定要删除选中的报警信息吗？';
        cms.box.confirm({
            id: 'pwalarmdelete',
            title: '删除报警信息',
            html: strHtml,
            callBack: deleteAlarmAction,
            returnValue: {
                idList: strIdList
            }
        });
        
        timerPlayStop(true);
    }
};

var drawAlarmArea = function(month, id, rid){
    var btnId = '#btnDraw' + month + '_' + id;
    var obj = cms.util.$("canvasAlarm" + month + '_' + id);
    
    if(obj !== null){
        if(obj.style.display === 'none'){
            obj.style.display = '';
            $(btnId).attr('title', '隐藏报警区域');
            $(btnId + ' i').removeClass();
            $(btnId + ' i').addClass('icon-display');
        } else {
            obj.style.display = 'none';
            $(btnId).attr('title', '显示报警区域'); 
            $(btnId + ' i').removeClass();
            $(btnId + ' i').addClass('icon-hide');
        }
    }else{
        var urlparam = 'action=getSingleAlarmLog&month=' + month + '&id=' + id;
        
        $.ajax({
            type: 'post',
            //async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/alarm.aspx',
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
                    var alarmInfo = jsondata.alarmInfo;
                    if(alarmInfo !== ''){
                        showAlarmArea(alarmInfo, month, id, rid);
                        $(btnId).attr('title', '隐藏报警区域');
                        $(btnId + ' i').removeClass();
                        $(btnId + ' i').addClass('icon-display');  
                    }
                }
            }
        });
    }
};
    
var showAlarmArea = function(alarmInfo, month, id, rid){
    var drawdata = '{area:[';
    for(var i=0,c=alarmInfo.AlarmList.length; i<c; i++){
        var region = alarmInfo.AlarmList[i].Region;
        if(i > 0)drawdata += ',';
        drawdata += '{points:[' + convertAlarmPoints(region) + ']}';        
    }
    drawdata += ']}';
    
    drawdata = eval('(' + drawdata + ')');
    
    var canvasAlarm = document.createElement("div");
    canvasAlarm.id = "canvasAlarm" + month + '_' + id;
    canvasAlarm.className = "canvas-small";
    canvasAlarm.style.bgColor = "Transparent";
    
    //因为坐标已经转换过了，所以这里的坐标比例应该是 1
    drawline.showPoint(canvasAlarm, drawdata, 1, drawline.pointColor);
    $("#alarmPicBox" + month + '_' + id).append(canvasAlarm);
    
//    $('.referPicBox').css('position','relative');
//    $('.alarmPicBox').css('position','relative');
};

var convertAlarmPoints = function(region){
    var result = '';
    for(var i=0,c=region.points.length; i<c; i++){
        if(i>0) result += ',';
        var point = convertPoint(region.points[i]);
        result += '{x:' + point.x + ',y:' + point.y + '}';
    }
    return result;
};

//转换坐标
//图片宽度 704 这里图片缩放放到 1/2， 所以坐标 * 704 * 0.5
var convertPoint = function(point){
    var px = Math.ceil(point.x * 704 * 0.5);
    var py = Math.ceil(point.y * 576 * 0.5);
    return {x:px,y:py};
};

var setDrawEnabled = function(btnId, enabled){
    $('#' + btnId).attr('disabled', true);
    if(!cms.util.isMSIE){
        $('#' + btnId).unbind('click');
        $('#' + btnId).hide();
    }
};

//预加载图片
var picturePreloaded = function(img,scaling,w,h,loadpic){
    $(img).LoadImage(scaling, w, h, loadpic);
};

var loadPicture = function(img){
    var prepic = cmsPath + '/skin/default/images/pic/loading.gif';
    picturePreloaded(img, false, 355, 288, prepic);
};

var loadBigPicture = function(img){
    var prepic = cmsPath + '/skin/default/images/pic/loading.gif';
    picturePreloaded(img, false, 704, 576, prepic);
};

var showPictureSource = function(path, type){
    var w = 704;
    var h = 576;
    var th = 25;
    var sw = 18;
    var boxW = w;
    var boxH = h + th;
    
    var strHtml = '<img id="imgSource" src="' + path + '" style="width:' + w + 'px;height:' + h + 'px;padding:0;margin:0;"/>'; 
    
    if(loginUser.userName === 'admin' && loginUser.userRole === '1'){
        boxH += 23;
        strHtml += '<div class="statusbar" style="height:22px; line-height:22px; padding:0; margin:0; text-indent:5px;">源地址：' + path + '</div>';
    }
    
    var bodySize = cms.util.getBodySize();
    if(bodySize.height < (h + th)){
        boxW = w + sw;
        boxH = bodySize.height - 1;
    } else {
        boxW = w;
    }
    var config = {
        id: 'picturesourcebox',
        title: (type === 0 ? '抓拍图' : '参考图') + '源图片',
        html: strHtml,
        width: boxW,
        height: boxH,
        noBottom: true,
        borderStyle: 'solid 2px #99bbe8',
        bgOpacity: 0.9,
        clickBgClose: 'dblclick',
        escClose: true
    }
    cms.box.win(config);
    
    //预加载图片
    loadPicture('#imgSource');
};

var downloadPicture = function(imgPath, type, domain){
    try{
        var handleUrl = cms.util.path + '/ajax/download.aspx?action=download&domain=' + domain + '&type=' + type + '&path=' + imgPath;        
	    window.location.href = handleUrl;
	}catch(ex){
	    cms.box.alert({id: boxId, title: '图片下载失败', html: '图片下载失败，请稍候再试'});
	}
};

var statDeviceAlarm = function(){
    var size = {w: 768, h: 528};
    
    var bodySize = cms.util.getBodySize();
    if(size.h > bodySize.height){
        size.h = bodySize.height - 2;
    }    
    var strHtml = cmsPath + '/modules/alarm/stat.aspx';
    var config = {
        id: 'statdevicealarm',
        title: '统计设备报警数量',
        html: strHtml,
        requestType: 'iframe',
        width: size.w,
        height: size.h,
        noBottom: true,
        callBack: winCloseAction
    };
    cms.box.win(config);
};

var statSingleDeviceAlarm = function(devCode){

};

var winCloseAction = function(pwobj){
    pwobj.Hide();
    pwobj.Clear();
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