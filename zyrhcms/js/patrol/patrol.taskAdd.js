cms.patrol = cms.patrol || {};
cms.patrol.task = cms.patrol.task || {};

var boxSize = {};
var boxId = 'pwbox001';
var operMenuWidth = 111;
//列表框最小宽度
var listBoxMinWidth = 580;
//滚动条宽度
var scrollBarWidth = 18;

var pageStart = 1;
var pageIndex = pageStart;
var pageSize = 20;

var pwtabs = [
    {code: 'point', name: '巡检点', load: false},
    {code: 'device', name: '巡检设备', load: false},
    {code: 'user', name: '巡检人员', load: false}
];

var pwtasktabs = [
    {code: 'task', name: '巡检任务', load: false},
    {code: 'shift', name: '巡检班次', load: false},
    {code: 'plan', name: '任务计划', load: false}
];

var htTaskPoint = null;
var rid = 0;
var rnum = 0;
var rmax = 50;
var shifts = 0; //任务班次
var shift_max = 24;
var shift_rid = 0;
var shift_time = [15, 30]; //班次时间间隔，每个班次时间最短时间，每个班次之间的最小时间间隔
var today = $('#txtToday').val();
var plan_load = [false,false,false,false];

$(window).load(function(){
    var bodySize = cms.util.getBodySize();
    if(parent.cms.patrol.setBodyShow != undefined){
        parent.cms.patrol.setBodyShow(true);
    }
    setBodySize();    
        
    initialForm();
});

$(window).resize(function(){
    setBodySize();
});

var initialForm = function(){
    /*
    var mindate = $("#txtMinDate").val();
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartDate").focus(function(){
        WdatePicker({skin:'ext',minDate:mindate,maxDate:maxdate,dateFmt:'yyyy-MM-dd'});
    });
    $("#txtEndDate").focus(function(){
        WdatePicker({skin:'ext',minDate:mindate,maxDate:maxdate,dateFmt:'yyyy-MM-dd'});
    });
    */
    
    $('#listHeader').html(cms.util.buildTable('tbHeader','tbheader'));
    $('#listContent').html(cms.util.buildTable('tbList','tblist'));
    
    showListHeader();
}

var setBodySize = function(){
    boxSize = cms.util.getBodySize();
    $('#mainContent').width(boxSize.width);
    $('#mainContent').height(boxSize.height - 25);
    
    setBoxSize();
}

var setBoxSize = function(){
    $('#operMenu').height(boxSize.height - 25 - 27);
    $('#operMenu').width(operMenuWidth - 1);
    
    $('.listbox').width(boxSize.width-operMenuWidth);
    if(cms.util.isIE6){
        $('.listbox .listheader').width(boxSize.width-operMenuWidth);
        $('.listbox .list').width(boxSize.width-operMenuWidth);
    }
    $('.listbox').height(boxSize.height - 25*2 - 27);
    $('.listbox .listheader').height(23);
    $('.listbox .list').height(boxSize.height - 25*2 - 27 - 23);
    
    $('.statusbar').width(boxSize.width-operMenuWidth);
    
    setListBoxSize();
    
    $('.listbox .list').scroll(function(){cms.jquery.scrollSync(this, '.listbox .listheader');});
}

var setListBoxSize = function(){
    if(boxSize.width >= listBoxMinWidth){
        listBoxMinWidth = boxSize.width-operMenuWidth;
    }
    $('.listbox .tbheader').width(listBoxMinWidth);
    $('.listbox .tblist').width(listBoxMinWidth - scrollBarWidth);
}

var loadData = function(){
    pageIndex = pageStart;
    //getCaptureInfo();
}

var winCloseAction = function(pwobj){
    pwobj.Hide();
    pwobj.Clear();
}

var setParam = function(param){
    $('#txtDevUnitId').attr('value', param.unitId);
    $('#txtDevCode').attr('value', param.devCode);
}

var buildListHeader = function(){
    var cellid = 0;
    var rowData = [];
    
    rowData[cellid++] = {html: '<input type="checkbox" id="chbAll" />', style:[['width','25px']]};
    rowData[cellid++] = {html: '序号', style:[['width','35px']]};
    rowData[cellid++] = {html: '开始时间', style:[['width','100px']]};
    rowData[cellid++] = {html: '结束时间', style:[['width','100px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    return rowData;
}

var showListHeader = function(){
    var objHeader = cms.util.$('tbHeader');
    cms.util.clearDataRow(objHeader, 0);
    
    var row = objHeader.insertRow(0);
    var rowData = buildListHeader();
    cms.util.fillTable(row, rowData);
}


var showHelp = function(action, title, obj){
    if(action == 'close' || action == 'hide'){
        module.showHelpInfo(null, 'hide');
    } else {
        var strHtml = '<div style="padding:6px 10px;color:#666;">';
        var strTitle = title;
        switch(action){
            case 'task_type':
                strHtml += '单点任务：'
                    + '<br />'
                    + '计划任务：';
                break;
            case 'work_cycle':
                strHtml += '每天：'
                    + '<br />'
                    + '每周：'
                    + '<br />'
                    + '每月：';
                break;
            case 'check_type':
                strHtml += '所有工作日：'
                    + '<br />'
                    + '多少个工作日以上：';
                break;
        }
        strHtml += '</div>';
        module.showHelpInfo({title:strTitle, html:strHtml});
    }
}

var initialTaskParam = function(){
    rid = 0;
    rnum = 0;
    shifts = 0;
    shift_rid = 0;
    plan_load = [false, false, false, false];
    cms.patrol.task.tsShiftStart = [];
    cms.patrol.task.tsShiftEnd = [];
}

var showEditTaskWin = function(action){
    initialTaskParam();
    htTaskPoint = new cms.util.Hashtable();
    var unitId = $('#txtUserUnitId').val();
    for(var i=0,c=pwtabs.length; i<c; i++){
        pwtabs[i].load = false;
    }
    var bs = {w:722, h:500, ch:60};            
    var bodySize = cms.util.getBodySize();
    if(bs.h > bodySize.height){
        bs.h = bodySize.height - 2;
    }
    
    var ts = {w:205, bh:bs.h-bs.ch, uth:150, th:(bs.h-bs.ch-28)-150};
    var fs = {w:bs.w-ts.w-1, h:bs.h-bs.ch};
    var dt = new Date().getTime();
    var arrUrl = [
        cmsPath + '/modules/patrol/tree/unit.aspx?bodyW=' + ts.w + '&bodyH=' + ts.uth + '&' + dt,
        cmsPath + '/modules/patrol/tree/point.aspx?bodyW=' + ts.w + '&bodyH=' + ts.th + '&' + dt,
        cmsPath + '/modules/patrol/tree/device.aspx?bodyW=' + ts.w + '&bodyH=' + ts.th + '&' + dt,
        cmsPath + '/modules/patrol/tree/user.aspx?bodyW=' + ts.w + '&bodyH=' + ts.th + '&' + dt        
    ];
    var strHtml = '<input type="hidden" id="txtOldUnitId_TaskForm" value="' + unitId + '" />'
        + '<input type="hidden" id="txtCurUnitId_TaskForm" value="' + unitId + '" />'
        + '<div style="width:' + ts.w + 'px; height:' + ts.bh + 'px; background:#e7e9ea;border-right:solid 1px #99bbe8; float:left;">'
        + '<div class="tabcon" id="tabcon1" style="width:' + ts.w + 'px;height:' + ts.uth + 'px;overflow:hidden;">'
        + '<iframe id="frmtask_unit" frameborder="0" scrolling="auto" width="' + ts.w + 'px" height="' + ts.uth + 'px" src="' + arrUrl[0] + '"></iframe>'
        + '</div>'
        
        + '<div class="tabpanel" id="tabPatrol">'
        + '<a class="tab" lang="point" rel="#tabcon1"><span>巡检点</span></a>'
        + '<a class="tab" lang="device" rel="#tabcon2"><span>巡检设备</span></a>'
        + '<a class="tab" lang="user" rel="#tabcon3"><span>巡检人员</span></a>'
        + '</div>'
        + '<div id="tabPatrolContainer">'
        + '<div class="tabcon" id="tabcon1" style="width:' + ts.w + 'px;height:' + ts.th + 'px;overflow:hidden;">'
        + '<iframe id="frmtask_point" frameborder="0" scrolling="auto" width="' + ts.w + 'px" height="' + ts.th + 'px" src="' + arrUrl[1] + '"></iframe>'
        + '</div>'
        + '<div class="tabcon" id="tabcon2" style="width:' + ts.w + 'px;height:' + ts.th + 'px;overflow:hidden;display:none;">'
        + '<iframe id="frmtask_device" frameborder="0" scrolling="auto"  width="' + ts.w + 'px" height="' + ts.th + 'px" src="' + arrUrl[2] + '"></iframe>'
        + '</div>'
        + '<div class="tabcon" id="tabcon3" style="width:' + ts.w + 'px;height:' + ts.th + 'px;overflow:hidden;display:none;">'
        + '<iframe id="frmtask_user" frameborder="0" scrolling="auto"  width="' + ts.w + 'px" height="' + ts.th + 'px" src="' + arrUrl[3] + '"></iframe>'
        + '</div>'
        + '</div>'
        + '</div>';
        
    strHtml += '<div style="float:left;overflow:hidden; width:' + fs.w + 'px;height:' + (fs.h) + 'px;background:#dfe8f6;">'
        + '<div class="tabpanel" id="tabTaskPlan">'
        + '<a class="cur" lang="task" rel="#taskForm"><span>巡检任务</span></a>'
        + '<a class="tab" lang="shift" rel="#taskShiftForm"><span>巡检班次</span></a>'
        + '<a class="tab" lang="plan" rel="#taskPlanForm"><span>任务计划</span></a>'
        + '</div>'
        + '<div id="tabTaskPlanContainer">';
    if(action == 'edit'){
    
    } else {
        strHtml += '<div id="taskForm" class="tabcon1">'
            + '<div class="operbar" style="padding:0 5px;">' 
            + '<span>请在左边菜单选择巡检点</span>'
            + '<a class="btn btnc22" href="javascript:;" onclick="deleteTaskPoint();" style="float:right;"><span>删除</span></a>'
            + '</div>'
            + buildTaskForm(null, fs.h-5-28)
            + '</div>';
        strHtml += '<div id="taskShiftForm" class="tabcon1" style="display:none;">'
            + '<div class="operbar p-0-5">'
            + '<span>巡检班次</span>'
            + '<a class="btn btnc22" href="javascript:;" onclick="appendTaskShift();" style="float:right;"><span>新增班次</span></a>'
            + '</div>'
            + '<table cellpadding="0" cellspacing="0" class="tbheader tbheader-bg">'
            + '<tr><td style="width:45px;">班次</td><td style="width:180px;">开始时间</td>'
            + '<td style="width:180px;">结束时间</td><td style="width:45px;">删除</td><td>&nbsp;</td></tr>'
            + '</table>'
            + '<div style="height:' + (fs.h-5-28-172) + 'px; overflow:auto;background:#fff;border-bottom:solid 1px #99bbe8;">'
            + '<table cellpadding="0" cellspacing="0" class="tbborder" id="tbTaskShift"></table>'
            + '</div>'
            + '<div style="padding:5px 10px;">'
            + '说明：<br />'
            + '班次表示一个工作日内（24小时）需要完成的巡检次数，可以有多个班次。<br />'
            + '一般情况下一个工作日只有一个班次。<br />'
            + '若有多个班次，必须指定每个班次的有效执行时间，各个班次时间不得交叉重合。<br />'
            + '</div>'
            + '</div>';
        strHtml += '<div id="taskPlanForm" class="tabcon1" style="display:none;">'
            + '<div class="operbar p-0-5">' + '<span>任务计划向导</span>' + '</div>'
            + '<div style="height:' + (fs.h-12-172) + 'px; padding:5px 8px 0;background:#fff;border-bottom:solid 1px #99bbe8;">'
            + buildTaskPlanForm(null)
            + '</div>'
            + '</div>';
    }    
    strHtml += '</div>';
    
    strHtml += '</div>';
    
    strHtml += '<label class="chb-label-nobg" style="margin:0;padding:0;position:absolute;bottom:6px;left:8px;width:135px;">'
        + '<input type="checkbox" class="chb" id="chbContinue" /><span>添加完成后继续添加</span></label>';
    var config = {
        title: (action == 'edit' ? '编辑' : '新增') + '巡检任务',
        html: strHtml,
        width: bs.w,
        height: bs.h,
        buttonText: ['保存','取消'],
        buttonHeight: 26,
        bottomHeight: 35,
        zindex: 100,
        callBack: saveTaskPlan
    };
    cms.box.form(config);
    
    //初始化巡检班次
    appendTaskShift(null);
    $('#tbTaskShift .btn').hide();  
        
    setFormControl();
    
    cms.jquery.tabs('#tabPatrol', '#tabPatrolContainer', '.tabcon', 'changeTabPage');
    cms.jquery.tabs('#tabTaskPlan', '#tabTaskPlanContainer', '.tabcon1', 'changeTaskTabPage');
}

var buildTaskForm = function(task, h){
    var strHtml = ''
        + '<table cellpadding="0" cellspacing="0" class="tbheader tbheader-bg">'
        + '<tr><td style="width:25px;"><input type="checkbox" id="chbAll_TaskForm" onclick="cms.util.selectCheckBox(\'chbPatrolPoint\',3)" /></td><td style="width:35px;">序号</td>'
        + '<td style="width:138px;">巡检点名称</td><td style="width:90px;">纬度</td><td style="width:90px;">经度</td>'
        + '<td style="width:60px;">巡检半径</td><td style="width:40px;">操作</td><td>&nbsp;</td></tr>'
        + '</table>'
        + '<div style="height:' + (h-172) + 'px; vertical-align:top; overflow:auto;background:#fff;border-bottom:solid 1px #99bbe8;">'
        + '<table cellpadding="0" cellspacing="0" class="tbborder" id="tbPatrolPointList"></table>'
        + '</div>'

        + '<table cellpadding="0" cellspacing="0" class="tbform" style="margin:5px 8px;">'
        + '<tr><td style="width:70px;">巡检设备：</td>'
        + '<td>'
        + '<input type="text" id="txtDevName_TaskForm" class="txt w120 m-r-10 f-left" readonly="readonly" onfocus="setTabSwitch(\'tree\',\'device\');" />'
        + '<input type="hidden" id="txtDevCode_TaskForm" class="txt w50" />'
        + '</td>'
        + '<td style="width:70px;">巡检人员：</td>'
        + '<td>'
        + '<input type="text" id="txtUserName_TaskForm" class="txt w180" readonly="readonly" style="width:198px;" onfocus="setTabSwitch(\'tree\',\'user\');" />'
        + '<input type="hidden" id="txtUserIdList_TaskForm" class="txt" />'
        + '</td></tr>'
        + '<tr><td style="width:70px;">起始日期：</td>'
        + '<td>'
        + '<input type="text" class="txt w120 m-r-10" id="txtStartDate_TaskForm" />'
        + '</td>'
        + '<td style="width:70px;">截止日期：</td>'
        + '<td>'
        + '<input type="text" class="txt w120 m-r-10" id="txtEndDate_TaskForm" />'
        + '</td></tr>'
        + '</table>';
    strHtml += '<div style="color:#f50;padding:0 8px;">任务创建完成后，内容不可以修改，请认真填写任务内容并核对。</div>';
    return strHtml;
}

var buildTaskPlanForm = function(task){
    var strHtml = '计划类型：'
        + '<select class="select" id="ddlWorkCycle_TaskForm" style="width:70px;" onchange="taskPlanGuide();">' + cms.util.buildOptions([['0','一次性'],['1','每天'],['2','每周'],['3','每月']], '') + '</select>'
        + '<div id="taskPlanPanel" style="padding:10px;margin:10px; margin-left:0;border:solid 1px #ddd;">'
        + '<div class="planpanel" id="divPlanPanel_0">一次性任务，只巡检一次，没有计划</div>'
        + '<div class="planpanel" id="divPlanPanel_1" style="display:none;"></div>'
        + '<div class="planpanel" id="divPlanPanel_2" style="display:none;"></div>'
        + '<div class="planpanel" id="divPlanPanel_3" style="display:none;"></div>'
        + '</div>';
        
    strHtml += '<div style="clear:both; overflow:hidden;">'
        + '<span style="float:left;">考勤类型：</span><select class="select" disabled="disabled" id="ddlCheckType_TaskForm" style="float:left;" onchange="changeCheckType(this);">' + cms.util.buildOptions([['0','全勤考核'],['1','多少个工作日以上']], '') + '</select>'
        + '<span id="panelDays" class="hide" style="margin-left:10px;">至少需要巡检<input type="text" class="txt w30 text-center" id="txtDays_TaskForm" maxlength="3" style="margin:0 3px;" />个工作日</span>'
        + '</div>';
    strHtml += '<div style="padding:20px 0 0;color:#f00;">说明：当前只有一次性任务，其他计划类型功能暂未实现</div>';
    //strHtml += '任务结果：<br /><textarea id="txtQueryString" style="width:480px;height:80px;position:absolute;bottom:40px;"></textarea>';
    return strHtml;
}

var appendTaskShift = function(worktime){
    if(shifts > shift_max - 1){
        cms.box.alert({id:boxId,title:'提示信息',html:'班次最多不得超过' + shift_max + '个班次'});
        return false;
    }
    var tb = cms.util.$('tbTaskShift');
    var id = shift_rid;
    var row = tb.insertRow(shifts);
    var rowData = [];
    var cellid = 0;
    
    row.style.height = '26px';
    if(worktime == null || worktime == undefined){
        worktime = {start:'00:00', end:'23:59'};
    }
    
    var strStart = '<span style="float:left;margin-left:5px;">开始时间：</span><span id="boxStartTime_' + id + '" style="float:left;text-align:left;"></span>'
        + '<input type="hidden" name="txtStartTime_TaskForm" id="txtStartTime_TaskForm_' + id + '" value="' + worktime.start + '" />';
    var strEnd = '<span style="float:left;margin-left:5px;">结束时间：</span><span id="boxEndTime_' + id + '" style="float:left;text-align:left;">'
        + '</span><input type="hidden" name="txtEndTime_TaskForm" id="txtEndTime_TaskForm_' + id + '" value="' + worktime.end + '" />';
    var strOper = '<a class="btn btnc22" href="javascript:" onclick="deleteTaskShift($(\'#txtShiftNum_TaskForm_' + id + '\').val());"><span>删除</span></a>';
    var strNum = '<input type="text" name="txtShiftNum_TaskForm" id="txtShiftNum_TaskForm_' + id + '" style="width:45px;border:none;text-align:center;" readonly="readonly" value="' + (shifts + 1) + '" />';
    
    rowData[cellid++] = {html: strNum, style:[['width','45px']]};
    rowData[cellid++] = {html: strStart, style:[['width','180px']]};
    rowData[cellid++] = {html: strEnd, style:[['width','180px']]};
    rowData[cellid++] = {html: strOper, style:[['width','45px']]};
    rowData[cellid++] = {html: '', style:[]};
    
    cms.util.fillTable(row, rowData);
    cms.patrol.task.tsShiftStart.push(new TimeSelect('boxStartTime_' + id, {id:'txtStartTime_' + id, type:'h:m', obj:'txtStartTime_TaskForm_' + id, width:80}));
    cms.patrol.task.tsShiftEnd.push(new TimeSelect('boxEndTime_' + id, {id:'txtEndTime_' + id, type:'h:m', obj:'txtEndTime_TaskForm_' + id, width:80}));
    shift_rid++;
    shifts++;
    
    if(shifts > 1){
        $('#tbTaskShift .btn').show();
    }
}

var deleteTaskShift = function(ri){
    if(shifts <= 1){
        cms.box.alert({id:boxId,title:'提示信息',html:'还删？至少得有一个班次啊'});
        return false;
    }
    var tb = cms.util.$('tbTaskShift');
    cms.util.removeDataRow(tb, parseInt(ri,10)-1);
    shifts--;
    //删除行后，重新排序数字序号
    var arrNum = cms.util.$N("txtShiftNum_TaskForm");
    for(var i=0,c=arrNum.length; i<c; i++){
        arrNum[i].value = i+1;
    }
}

var reloadForm = function(){
    $('#taskForm').html(buildTaskForm());
}

var setFormControl = function(){
    var mindate = $("#txtMinDate").val();
    var maxdate = $("#txtMaxDate").val();
    $("#txtStartDate_TaskForm").focus(function(){
        WdatePicker({skin:'ext',minDate:mindate,maxDate:maxdate,dateFmt:'yyyy-MM-dd'});
    });
    $("#txtEndDate_TaskForm").focus(function(){
        WdatePicker({skin:'ext',minDate:mindate,maxDate:maxdate,dateFmt:'yyyy-MM-dd'});
    });
}

var changeCheckType = function(obj){
    if(obj.value == '0'){    
        $('#panelDays').hide();
    } else {
        $('#panelDays').show();
        $('#txtDays_TaskForm').focus();
    }    
}

var changeTabPage = function(param){
    var unitId = $('#txtCurUnitId_TaskForm').val();
    var n = cms.jquery.getTabItem(pwtabs, param.action);
    if(!pwtabs[n].load){
        $('#frmtask_' + param.action)[0].contentWindow.loadTree(unitId);
        pwtabs[n].load = true;
    }
}

var setTabSwitch = function(tabs, action){
    if(tabs == 'tree'){
        var i = cms.jquery.getTabItem(pwtabs, action);
        cms.jquery.tabSwitch('#tabPatrol', i);
    } else if(tabs == 'task'){
        var i = cms.jquery.getTabItem(pwtasktabs, action);
        cms.jquery.tabSwitch('#tabTaskPlan', i);        
    }
}

var changeTaskTabPage = function(param){

}

var setUnit = function(param){
    $('#txtCurUnitId_TaskForm').attr('value', param.unitId);
    if($('#txtOldUnitId_TaskForm').val() != $('#txtCurUnitId_TaskForm').val()){
        for(var i=0; i<pwtabs.length; i++){
            pwtabs[i].load = false;
        }
        $('#txtOldUnitId_TaskForm').attr('value', param.unitId);        
    }
}

var setDevice = function(param){
    $('#txtDevCode_TaskForm').attr('value', param.devCode);
    $('#txtDevName_TaskForm').attr('value', param.devName);
    setTabSwitch('task', 'task');
}

var setPoint = function(param){
    if(param.type == 'point'){
        if(!htTaskPoint.contains(param.pointId)){
            htTaskPoint.add(param.pointId, param.pointName);
            var pinfo = {id:param.pointId,name:param.pointName,lat:param.latitude,lng:param.longitude,radii:param.radii}
            buildTaskPointList(pinfo);
        }
    }
    setTabSwitch('task', 'task');
}

var setPointMulti = function(arrPoint){
    if(arrPoint.length > 0){
        for(var i=0,c=arrPoint.length; i<c; i++){
            var pinfo = eval('(' + arrPoint[i] + ')');
            if(!htTaskPoint.contains(pinfo.id)){
                htTaskPoint.add(pinfo.id, pinfo.name);
                buildTaskPointList(pinfo);
            }
        }
    }
    setTabSwitch('task', 'task');
}

var buildTaskPointList = function(p){
    var obj = cms.util.$('tbPatrolPointList');    
    var row = obj.insertRow(rnum++);
    
    var cellid = 0;
    var rowData = [];
    
    row.style.height = '26px';
    
    var strCheckbox =  '<input type="checkbox" name="chbPatrolPoint" value="' + rid + '" />';
    var txtNum = '<input type="text" class="txt-label" id="ppNum' + rid +  '" name="ppNum" value="' + rnum + '" readonly="readonly" style="width:29px;text-align:center;" />';
    var txtName = '<input type="text" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt-label" id="ppName' + rid +  '" name="ppName" value="' + p.name + '" maxlength="30" style="width:132px;" />'
    + '<input type="hidden" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt" id="ppId' + rid + '" name="ppId" value="' + p.id + '" style="width:20px;" />';
    var txtLat = '<input type="text" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt-label" id="ppLat' + rid +  '" name="ppLat" value="' + p.lat + '" maxlength="12" style="width:82px;" />';
    var txtLng = '<input type="text" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt-label" id="ppLng' + rid +  '" name="ppLng" value="' + p.lng + '" maxlength="12" style="width:82px;" />';
    var txtRadii = '<input type="text" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt-label" id="ppRadii' + rid +  '" name="ppRadii" value="' + p.radii + '" maxlength="4" style="width:52px;text-align:center;" />';
    var strDel = '<a class="btn btnc22" href="javascript:;" onclick="deleteTaskPoint(parseInt(cms.util.$(\'ppNum' + rid + '\').value,10)-1,parseInt(cms.util.$(\'ppId' + rid + '\').value,10));"><span>删除</span></a>';
    
    rowData[cellid++] = {html: strCheckbox, style:[['width','25px']]};
    rowData[cellid++] = {html: txtNum, style:[['width','35px']]};
    rowData[cellid++] = {html: txtName, style:[['width','138px']]};
    rowData[cellid++] = {html: txtLat, style:[['width','90px']]};
    rowData[cellid++] = {html: txtLng, style:[['width','90px']]};
    rowData[cellid++] = {html: txtRadii, style:[['width','60px']]};
    rowData[cellid++] = {html: strDel, style:[['width','40px']]};
    
    rowData[cellid++] = {html: '', style:[]}; //空
    
    cms.util.fillTable(row, rowData);
    
    
    rid++;
}

var setPatrolPointTableStyle = function(tb){
    var chbitems = $(tb + ' tr input[type="checkbox"]');
    chbitems.click(function() {
        if($(this).attr("checked") == 'checked'){
            $(this).parents('tr').addClass('selected');
        }else{
            $(this).parents('tr').removeClass('selected');
        }        
        $('#chbAll_TaskForm').attr('checked', chbitems.size() == cms.jquery.getCheckBoxChecked(tb).size());
    });
    
    $('#chbAll_TaskForm').click(function(){
        cms.util.selectCheckBox('chbPatrolPoint', 3);
    });
    
    $('input[type="checkbox"]').focus(function(){
        $(this).blur();
    });
}

var deleteTaskPoint = function(id, pid){
    var arrVal = cms.util.getCheckBoxCheckedValue('chbPatrolPoint');
    var arrNum = cms.util.getCheckBoxChecked('chbPatrolPoint');
    var arrPoint = [];
    if(id != undefined){
        arrPoint.push({id:id, pid:pid});
    } else if(arrVal != ''){
        for(var i=0,c=arrNum.length; i<c; i++){
            arrPoint.push({id:parseInt($('#ppNum' + arrNum[i].value).val())-1, pid:$('#ppId' + arrNum[i].value).val()});
        }
    }
    var config = {
        title: '确认',
        html: '确定要删除选中的巡检点吗？',
        boxType: 'confirm',
        callBack: deleteTaskPointAction,
        returnValue: {
            arrPoint: arrPoint
        }
    };
    cms.box.win(config);
}

var deleteTaskPointAction = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var obj = cms.util.$("tbPatrolPointList");
        var arrPoint = pwReturn.returnValue.arrPoint;
        for(var i=arrPoint.length; i>0; i--){
            cms.util.removeDataRow(obj, arrPoint[i-1].id);
            htTaskPoint.remove(arrPoint[i-1].pid);
            rnum--;
        }
        //删除行后，重新排序数字序号
        var arrNum = cms.util.$N("ppNum");
        for(var i=0,c=arrNum.length; i<c; i++){
            arrNum[i].value = i+1;
        }
        $('#chbAll_TaskForm').attr('checked', false);
    }
}

var setUser = function(param){

}

var buildOption = function(param){
    var strOption = '';
    if(param.type == 'number'){
        for(var i=param.min; i<=param.max; i++){
            strOption += '<option value="' + i + '">' + i + '</option>';
        }
    }
    return strOption;
}

var taskPlanGuide = function(){
    var taskType = parseInt($('#ddlWorkCycle_TaskForm').val(), 10);
    var wday = [[1,'星期一'],[2,'星期二'],[3,'星期三'],[4,'星期四'],[5,'星期五'],[6,'星期六'],[0,'星期日']];
    var mweek = [[1,'第一个'],[2,'第二个'],[3,'第三个'],[4,'第四个'],[5,'最后一个']];
    var months = [[1,'一月'],[2,'二月'],[3,'三月'],[4,'四月'],[5,'五月'],[6,'六月'],[7,'七月'],[8,'八月'],[9,'九月'],[10,'十月'],[11,'十一月'],[12,'十二月']];
    var strHtml = '';
    $('#taskPlanPanel .planpanel').hide();
    switch(taskType){
        case 0:
            strHtml += '一次性任务，只巡检一次，没有计划';
            break;
        case 1:
            strHtml += '<input type="hidden" id="txtDays_TaskPlan" />'
                + '<ul>'
                + '<li style="height:30px;"><label for="rbDays_1">'
                + '<input type="radio" value="1" name="rbDays" id="rbDays_1" checked="checked" onclick="planItemSwitch(1,1);" />每天'
                + '</label></li>'
                + '<li style="height:30px;"><label for="rbDays_2">'
                + '<input type="radio" value="2" name="rbDays" id="rbDays_2"  style="float:left;" onclick="planItemSwitch(1,2);" />'
                + '<span style="float:left;">每隔</span><span id="boxDays" style="margin:0 5px 0 10px;float:left;"></span><span style="float:left;">天</span>'
                + '</label></li>'
                + '</ul>';
            break;
        case 2:
            strHtml += '<input type="hidden" id="txtWeeks_TaskPlan" />'
                + '<span style="float:left;">每隔</span><span id="boxWeeks" style="margin:0 5px;float:left;"></span><span style="float:left;">周</span>'
                + '<div style="padding:10px 0 0;clear:both;">'
                + '请选择下面日期：'
                + '<ul style="clear:both;overflow:hidden;" id="WeekList_TaskPlan">';
            
            for(var i=0; i<7; i++){
                strHtml += '<li style="width:120px;float:left;padding:5px 0 0;"><label>'
                    + '<input type="checkbox" value="' + wday[i][0] + '" />' + wday[i][1]
                    + '</label></li>';
            }
            strHtml += '</ul></div>';
            break;
        case 3:
            strHtml += '<input type="hidden" id="txtMonthDay_TaskPlan" />'
                + '<ul>'
                + '<li style="margin-bottom:8px;width:155px;float:left;"><label for="rbMonths_1">'
                + '<input type="radio" value="1" name="rbMonths" id="rbMonths_1" checked="checked" style="float:left;" onclick="planItemSwitch(3,1);" />'
                + '<span style="display:inline-block;width:50px;float:left;">哪一天</span><span id="boxMonthDay" style="float:left;"></span>'
                + '</label></li>'
                + '<li style="margin-bottom:8px;float:left;"><label for="rbMonths_2">'
                + '<input type="radio" value="2" name="rbMonths" id="rbMonths_2" onclick="planItemSwitch(3,2);" />'
                + '<span style="display:inline-block;width:50px;">哪几天</span><input type="text" id="txtMonthDays_TaskPlan" onclick="selectMonthDays(this);" class="txt w200" />'
                + '</label></li>'
                + '<li style="margin-bottom:5px;clear:both;"><label for="rbMonths_3">'
                + '<input type="radio" value="3" name="rbMonths" id="rbMonths_3" onclick="planItemSwitch(3,3);" /><span style="display:inline-block;width:50px;">星期</span>'
                + '<select class="select w80 m-r-10" id="ddlWeekNum_TaskPlan">' + cms.util.buildOptions(mweek, 0)  + '</select>'
                + '<select class="select w80" id="ddlWeekDay_TaskPlan">' + cms.util.buildOptions(wday, 1)  + '</select>'
                + '</label></li>'
                + '</ul>'
                + '月份：'
                + '<ul style="clear:both;overflow:hidden;" id="MonthList_TaskPlan">';
            for(var i=0; i<12; i++){
                strHtml += '<li style="width:100px;float:left;padding:5px 0 0;"><label>'
                    + '<input type="checkbox" checked="checked" value="' + months[i][0] + '" />' + months[i][1]
                    + '</label></li>';            
            }
            strHtml += '</ul>';
            break;
    }
    
    if(!plan_load[taskType]){
        $('#divPlanPanel_' + taskType).html(strHtml);
        if(taskType == 1){
            cms.patrol.task.tsDays = new TimeSelect('boxDays', {id:'txtDays', type:'num', obj:'txtDays_TaskPlan',min:1,max:365,loop:true,width:45});
            cms.patrol.task.tsDays.Disabled(true);
        } else if(taskType == 2){            
            var ts2 = new TimeSelect('boxWeeks', {id:'txtWeeks', type:'num', obj:'txtWeeks_TaskPlan',min:1,max:52,loop:true,width:45});
        } else if(taskType == 3){
            cms.patrol.task.tsMonthDays = new TimeSelect('boxMonthDay', {id:'txtMonthsDay', type:'num', obj:'txtMonthDay_TaskPlan',min:1,max:31,loop:true,width:45});            
        }
        plan_load[taskType] = true;
    }
    $('#divPlanPanel_' + taskType).show();
    
    if(parseInt(taskType,10) <= 1){
        $('#ddlCheckType_TaskForm').attr('value', '0');
        $('#ddlCheckType_TaskForm').attr('disabled', true);
    } else {
        $('#ddlCheckType_TaskForm').attr('disabled', false);
    }
    
}

var selectMonthDays = function(obj){
    var offset = $('#' + obj.id).offset();
    var w = obj.offsetWidth;
    var h = obj.offsetHeight;
    var strDays = obj.value.trim();
    var arrDays = strDays.split(',');
    var strHtml = '<ul style="overflow:hidden;clear:both;padding:3px 3px 0;" id="pwTaskPlanMonthDays">';
    for(var i=0; i<31; i++){
        strHtml += '<li style="width:40px;float:left;"><label><input id="pwchb_md_' + (i+1) + '" type="checkbox" value="' + (i+1) + '" />' + (i+1) + '</label></li>';
    }
    strHtml += '</ul>'
        + '<a href="javascript:;" style="float:right;margin:0 5px;" onclick="setMonthDaysChecked(\'#pwTaskPlanMonthDays\', 3);">反选</a>'
        + '<a href="javascript:;" style="float:right;margin:0 5px;" onclick="setMonthDaysChecked(\'#pwTaskPlanMonthDays\', 1);">全选</a>';
    var config = {
        id: 'pwmonthdays',
        title: '选择日期',
        html: strHtml,
        width: 265,
        height: 188,
        noTitle: true,
        position: 'custom',
        x: offset.left - 60,
        y: offset.top + h,
        dragAble: false,
        bgOpacity: 0.3,
        callBack: setMonthDays
    };
    cms.box.form(config);
    
    for(var i=0,c=arrDays.length; i<c; i++){
        $('#pwchb_md_' + arrDays[i]).attr('checked', true);
    }
}

var setMonthDaysChecked = function(obj, type){
    if(type == 1){
        $(obj + ' input[type="checkbox"]').attr('checked', true);  
    } else {
        var chbitems = $(obj + ' input[type="checkbox"]');
        chbitems.each(function(){
            if($(this).attr("checked") == 'checked'){
                $(this).attr("checked", false);
            }else{
                $(this).attr("checked", true);
            }
        });    
    }
}

var setMonthDays = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var strDays = cms.jquery.getCheckBoxCheckedValue('#pwTaskPlanMonthDays');
        $('#txtMonthDays_TaskPlan').attr('value', strDays);
    }
    pwobj.Hide();
}

var planItemSwitch = function(type, i){
    switch(type){
        case 0:
            break;
        case 1:
            cms.patrol.task.tsDays.Disabled(i == 1);
            break;
        case 2:
            break;
        case 3:
            cms.patrol.task.tsMonthDays.Disabled(i != 1);
            break;
    }
}

var taskPlanAction = function(pwobj, pwReturn){

}

var saveTaskPlan = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var unitId = $('#txtOldUnitId_TaskForm').val();
        var strDevCode = $('#txtDevCode_TaskForm').val().trim();
        var strStartDate = $('#txtStartDate_TaskForm').val().trim();
        var strEndDate = $('#txtEndDate_TaskForm').val().trim();
        var arrPatrolPoint = getPatrolPoint();
        var typeId = parseInt($('#ddlWorkCycle_TaskForm').val(), 10);
                
        if(!arrPatrolPoint){
            setTabSwitch('tree', 'point');
            setTabSwitch('task', 'task');
            return false;
        } else if(strDevCode == ''){
            cms.box.alert({id: boxId, title:'提示', html:'请选择巡检设备！'});
            setTabSwitch('tree', 'device');
            setTabSwitch('task', 'task');
            return false;
        } else if(strStartDate == ''){
            cms.box.msgAndFocus(cms.util.$('txtStartDate_TaskForm'),{id: boxId, title:'提示', html:'请输入起始日期！'});
            setTabSwitch('task', 'task');
            return false;
        } else if(cms.util.dateCompare(today.toDate(), strStartDate.toDate()) == 1){
            cms.box.msgAndFocus(cms.util.$('txtEndDate_TaskForm'),{id: boxId, title:'提示', html:'起始日期不得小于当前日期！'});
            setTabSwitch('task', 'task');
            return false;        
        } else if(strEndDate == ''){
            cms.box.msgAndFocus(cms.util.$('txtEndDate_TaskForm'),{id: boxId, title:'提示', html:'请输入截止日期！'});
            setTabSwitch('task', 'task');
            return false;
        } else if(cms.util.dateCompare(strStartDate.toDate(),strEndDate.toDate()) == 1){
            cms.box.msgAndFocus(cms.util.$('txtEndDate_TaskForm'),{id: boxId, title:'提示', html:'截止日期不得小于起始日期！'});
            setTabSwitch('task', 'task');
            return false;        
        } 
        
        var arrPatrolShift = getPatrolShift();
        if(!arrPatrolShift){
            setTabSwitch('task', 'shift');
            return false;        
        }        
        
        var taskPatrolPlan = getPatrolPlan();
        if(!taskPatrolPlan){
            setTabSwitch('task', 'plan');
            return false;        
        }
        var strPatrolPoint = '[';
        for(var i=0,c=arrPatrolPoint.length; i<c; i++){
            //strPatrolPoint += arrPatrolPoint[i][0] + '_' + arrPatrolPoint[i][1] + '_' + arrPatrolPoint[i][2] + '_' + arrPatrolPoint[i][3] + '_' + arrPatrolPoint[i][4];
            strPatrolPoint += '[' + arrPatrolPoint[i][0] + ',\'' + escape(arrPatrolPoint[i][1]) + '\',\'' + arrPatrolPoint[i][2] + '\',\'' + arrPatrolPoint[i][3] + '\',' + arrPatrolPoint[i][4] + ']';
            strPatrolPoint += i<c-1 ? ',' : '';
        }
        strPatrolPoint += ']';
        var strPatrolShift = '[';
        for(var i=0,c=arrPatrolShift.length; i<c; i++){
            strPatrolShift += '[\'' + arrPatrolShift[i][0] + '\',\'' + arrPatrolShift[i][1] + '\']';
            strPatrolShift += i<c-1 ? ',' : '';
        }
        strPatrolShift += ']';
        
        var urlparam = 'action=addPatrolTask&unitId=' + unitId + '&typeId=' + typeId + '&devCode=' + strDevCode 
            + '&startDate=' + strStartDate + '&endDate=' + strEndDate + '&patrolPoint=' + strPatrolPoint 
            + '&patrolShift=' + strPatrolShift + '&patrolPlan=' + taskPatrolPlan;
        //alert(urlparam);
        $('#txtQueryString').attr('value', urlparam);
        $.ajax({
            type: 'post',
            async: false,
            datatype: 'json',
            url: cms.util.path + '/ajax/patrol.aspx',
            data: urlparam,
            error: function(jqXHR, textStatus, errorThrown){
                module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus, jqXHR){
                var strData = data;
                if(!data.isJsonData()){
                    module.showJsonErrorData(data);
                    return false;
                } else {
                    var jsondata = strData.toJson();//eval('(' + strData + ')');
                    if(jsondata.result == 1){
                        cms.box.alert({title:'提示',html:'巡检任务设置成功。<br />任务ID:' + jsondata.taskId + '，任务计划数：' + jsondata.taskPlan});
                        pwobj.Hide();
                    } else if(jsondata == -1){
                        module.showDataError({html:jsondata.error, width:400, height:250});
                        return false;
                    } else {
                        cms.box.alert({title:'提示',html:'巡检任务设置失败，请稍候再试。'});                    
                    }
                }
            }
        });
    } else {
        pwobj.Hide();
    }
}

var calculateMinutes = function(time){
    var ts = time.split(':');
    return parseInt(ts[0], 10)*60 + parseInt(ts[1],10);
}

var getPatrolPoint = function(){
    var arrResult = [];
    
    var arrNum = cms.util.$N('ppNum');
    var arrId = cms.util.$N('ppId');
    var arrName = cms.util.$N('ppName');
    var arrLat = cms.util.$N('ppLat');
    var arrLng = cms.util.$N('ppLng');
    var arrRadii = cms.util.$N('ppRadii');
    
    var c = arrNum.length;
    if(c == 0){
        cms.box.alert({id: boxId, title:'提示', html:'请选择巡检点信息！'});
        return false;
    }
    for(var i=0; i<c; i++){
        //alert('11:' + arrRadii[i].value);
        if(arrName[i].value.trim().equals('')){
            cms.box.msgAndFocus(arrName[i],{id: boxId, title:'提示', html:'请输入巡检点名称！'});
            return false;
        } else if(arrLat[i].value.trim().equals('')){
            cms.box.msgAndFocus(arrLat[i],{id: boxId, title:'提示', html:'请输入纬度坐标！'});
            return false;
        } else if(!/^[1-9][0-9]{1,2}\.\d+$/.test(arrLat[i].value.trim())){
            cms.box.msgAndFocus(arrLat[i],{id: boxId, title:'提示', html:'纬度坐标输入错误！'});
            return false;
        } else if(arrLng[i].value.trim().equals('')){
            cms.box.msgAndFocus(arrLng[i],{id: boxId, title:'提示', html:'请输入经度坐标！'});
            return false;
        } else if(!/^[1-9][0-9]{1,2}\.\d+$/.test(arrLng[i].value.trim())){
            cms.box.msgAndFocus(arrLng[i],{id: boxId, title:'提示', html:'经度坐标输入错误！'});
            return false;
        }  else if(arrRadii[i].value.trim().equals('')){
            cms.box.msgAndFocus(arrRadii[i],{id: boxId, title:'提示', html:'请输入巡检半径！'});
            return false;
        } else if(!arrRadii[i].value.trim().isNumber() || parseInt(arrRadii[i].value.trim(), 10) < 1){
            cms.box.msgAndFocus(arrRadii[i],{id: boxId, title:'提示', html:'巡检半径输入错误（巡检半径为正整数，且不小于1米）！'});
            return false;
        } else {
            var arrPoint = [arrId[i].value.trim(),arrName[i].value.trim(),arrLat[i].value.trim(),arrLng[i].value.trim(),arrRadii[i].value.trim()];
            arrResult.push(arrPoint);
        }
    }
    return arrResult;
}

var getPatrolShift = function(){
    var arrResult = [];
    
    var arrStart = cms.util.$N('txtStartTime_TaskForm');
    var arrEnd = cms.util.$N('txtEndTime_TaskForm');
    var c = arrStart.length;
    if(c == 0){
        cms.box.alert({id: boxId, title:'提示', html:'请设置巡检班次！'});
        return false;
    }
    var arrTimes = [];
    for(var i=0; i<c; i++){
        //记录时间和当时的位置(提示错误时定位用)
        var ts = [calculateMinutes(arrStart[i].value), calculateMinutes(arrEnd[i].value), i];
        if(ts[0] >= ts[1]){
            //提示错误，并定位到相应的输入框中
            cms.box.msgAndFocus(cms.patrol.task.tsShiftStart[i].GetObj(),{id: boxId, title:'提示', html:'巡检班次开始时间必须小于结束时间！'});
            return false;
        } else {        
            var arrTime = [arrStart[i].value, arrEnd[i].value];
            arrResult.push(arrTime);
            arrTimes.push(ts);
        }
    }
    
    for(var i=0,c=arrTimes.length; i<c-1; i++){
        if(arrTimes[i][0] > arrTimes[i+1][0]){
            var temp = arrTimes[i];
            arrTimes[i] = arrTimes[i+1];
            arrTimes[i+1] = temp;
        }
    }
    var tc = arrTimes.length;
    for(var i=0; i<tc-1; i++){
        for(var j=i+1; j<tc; j++){
            if(arrTimes[i][1] > arrTimes[j][0]){
                //提示错误，并定位到相应的输入框中
                cms.box.msgAndFocus(cms.patrol.task.tsShiftStart[arrTimes[j][2]].GetObj(),{id: boxId, title:'提示', html:'巡检班次时间有交叉重合，请检查！'});
                return false;
            }
        }
    }
    return arrResult;
}

var getPatrolPlan = function(){
    var arrResult = '{';
    var taskPlanType = parseInt($('#ddlWorkCycle_TaskForm').val(), 10);
    
    switch(taskPlanType){
        case 0:
            arrResult += 'planType:\'once\'';
            break;
        case 1:
            arrResult += 'planType:\'day\'';
            if(parseInt(cms.util.getRadioCheckedValue('rbDays', 1), 10) == 1){
                arrResult += ',dateType:\'every\',interval:1';
            } else {
                arrResult += ',dateType:\'interval\',interval:' + $('#txtDays_TaskPlan').val() + '';            
            }
            break;
        case 2:
            arrResult += 'planType:\'week\',interval:' + $('#txtWeeks_TaskPlan').val() + ',dayList:\'' + cms.jquery.getCheckBoxCheckedValue('#WeekList_TaskPlan') + '\'';
            break;
        case 3:
            var dateType = parseInt(cms.util.getRadioCheckedValue('rbMonths', 1), 10);
            var dateList = dateType == 1 ? $('#txtMonthDay_TaskPlan').val() : $('#txtMonthDays_TaskPlan').val();
            var week = dateType == 3 ? $('#ddlWeekNum_TaskPlan').val() : 0;
            var weekday = dateType == 3 ? $('#ddlWeekDay_TaskPlan').val() : 0;
            arrResult += 'planType:\'month\',monthList:\'' + cms.jquery.getCheckBoxCheckedValue('#MonthList_TaskPlan') + '\''
                + ',dateType:\'' + (dateType==1 ? 'date' : dateType==2 ? 'datelist' : 'weekday') + '\''
                + ',dateList:\'' + dateList + '\',week:' + week + ',weekday:' + weekday;
            break;
    }
    arrResult += '}';
    
    return arrResult;
}