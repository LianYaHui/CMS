<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head runat="server">
    <title>设置巡检点</title>
</head>
<body>
    <div class="formbody" style="padding:0; position:relative;" id="divPatrolFormBox">
        <div id="divTabConList">
            <div class="patrol-form-box" id="patrolFormBox_task" style="">
                <div class="operbar" style="clear:both;">
                    <div style="float:left;padding:1px 5px 0;">
                        <span>找不到巡检点或没有添加巡检点，可以</span><a class="btn btnc22" style="margin:1px 2px 0;" onclick="gprsConfig.openPatrolPointMap();"><span>打开地图</span></a><span>选择巡检点。</span>
                    </div>
                    <a class="btn btnc22" onclick="gprsConfig.deletePatrolPoint();" style="float:right;margin:2px 5px 0 0;"><span>删除</span></a>
                </div>
                <div id="divPatrolLineTreeBox" style="position:absolute;left:0;top:27px;background:#e7e9ea; padding:0;border-right:solid 1px #99bbe8;">
                    <div class="titlebar" style="height:24px;"><span class="title">选择巡检点</span></div>
                    <iframe src="" frameborder="0" scrolling="auto" width="100%" id="frmPatrolTree" name="frmPatrolTree"></iframe>
                </div>
                <div id="divPatrolTaskForm" style="float:right;padding:0; overflow:hidden;">
                    <div class="listheader">
                        <table class="tbheader" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width:25px;"><input type="checkbox" id="chbPatrolPointAll" onclick="cms.util.selectCheckBox('chbPatrolPoint', 1);"/></td>
                                <td style="width:35px;">序号</td>
                                <td style="width:125px;">巡检点名称</td>
                                <td style="width:80px;">纬度</td>
                                <td style="width:80px;">经度</td>
                                <td style="width:55px;">巡检半径</td>
                                <td style="text-align:left; text-indent:5px;">操作</td>
                            </tr>
                        </table>
                    </div>
                    <div class="list" id="listPatrolPoint">
                        <table class="tblist" cellpadding="0" cellspacing="0" id="tbPatrolPointList"></table>
                    </div>
                </div>
            </div>
            
            <div class="patrol-form-box" id="patrolFormBox_shift" style="display:none;">
                <div class="operbar" style="padding:0 5px;">
                    <div style="float:left;margin-top:1px;">
                        <a class="btn imgbtn" onclick="gprsConfig.addPatrolShift();"><i class="icon-add"></i><span>新增班次</span></a>
                        <a class="btn imgbtn" onclick="gprsConfig.deletePatrolShift();"><i class="icon-delete"></i><span>删除班次</span></a>
                    </div>
                </div>
                <div class="listheader">
                    <table class="tbheader" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width:25px;"><input type="checkbox" id="chbPatrolShiftAll" onclick="cms.util.selectCheckBox('chbPatrolShift', 1);"/></td>
                            <td style="width:50px;">班次</td>
                            <td style="width:80px;">开始时间</td>
                            <td style="width:80px;">结束时间</td>
                            <td style="width:50px;">操作</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div class="list" id="listPatrolShift">
                    <table class="tblist" cellpadding="0" cellspacing="0" id="tbPatrolShift"></table>
                </div>
                <div class="prompt" style="max-width:580px;line-height:20px;padding:5px 10px 0;">
                    说明：班次表示一个工作日内（24小时）需要完成的巡检次数，可以有多个班次。一般情况下一个工作日只有一个班次。
                    若有多个班次，必须指定每个班次的有效执行时间，各个班次时间不得交叉重合。
                </div>
            </div>
            
            <div class="patrol-form-box" id="patrolFormBox_plan" style="display:none;">
                <div class="operbar" style="padding:0 10px;">
                    <div style="margin-top:2px;">
                        <span>开始日期：</span>
                        <input type="text" class="txt w70" id="txtPatrolStartDate" style="margin-right:10px;" readonly="readonly" value="<%=DateTime.Now.ToString("yyyy-MM-dd")%>" />
                        <span>结束日期：</span>
                        <input type="text" class="txt w70" id="txtPatrolEndDate" style="margin-right:10px;" readonly="readonly" value="<%=DateTime.Now.ToString("yyyy-MM-dd")%>" />
                        <span>计划类型：</span>
                        <select id="ddlPatrolPlanType" class="select w65" style="margin-right:10px;"></select>
                    </div>
                </div>
                <div id="divPatrolPlanForm" style="padding:5px 10px;">
                    <div class="divPatrolPlanForm" id="divPatrolPlanForm_once">一次性任务，只巡检一次，没有计划</div>
                    <div class="divPatrolPlanForm" id="divPatrolPlanForm_day" style="display:none;">每天巡检一次</div>
                    <div class="divPatrolPlanForm" id="divPatrolPlanForm_week" style="display:none;padding:5px 0 0;">
                        <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td>每隔</td>
                                <td style="padding:0 5px;"><div style="float:left;" id="weekIntervalSelectBox"></div><input type="hidden" id="txtWeekInterval" class="txt w20" /></td>
                                <td>周</td>
                            </tr>
                        </table>
                        <span style="margin:5px 0; display:block;">请选择日期：</span>
                        <div id="divPatrolPlanWeekday"></div>
                    </div>
                    <div class="divPatrolPlanForm" id="divPatrolPlanForm_month" style="display:none;max-width:660px;">
                        <ul style="clear:both;overflow:hidden;display:block;padding:5px 0;">
                            <li style="float:left; display:block; margin-right:30px;margin-bottom:10px;">
                                <label class="chb-label-nobg" for="rbMonthday_1" >
                                    <input type="radio" name="rbMonthday" id="rbMonthday_1" class="chb" value="1" checked="checked" /><span style="width:40px;">哪一天</span>
                                    <div id="boxMonthDay" style="float:left;"></div>
                                    <input type="hidden" class="txt w40" id="txtMonthDay" />
                                </label>
                            </li>
                            <li style="float:left; display:block; margin-right:30px;margin-bottom:10px;">
                                <label class="chb-label-nobg" for="rbMonthday_2">
                                    <input type="radio" name="rbMonthday" id="rbMonthday_2" class="chb" value="2" /><span style="width:40px;">哪几天</span>
                                    <input type="text" class="txt w200" id="txtMonthDays"/>
                                </label>
                            </li>
                            <li style="float:left; display:block;margin-bottom:10px;">
                                <label class="chb-label-nobg" for="rbMonthday_3">
                                    <input type="radio" name="rbMonthday" id="rbMonthday_3" class="chb" value="3" /><span style="width:40px;">星期</span>
                                    <select class="select">
                                        <option value="1">第一个</option>
                                        <option value="2">第二个</option>
                                        <option value="3">第三个</option>
                                        <option value="4">第四个</option>
                                        <option value="5">最后一个</option>
                                    </select>
                                    <select class="select">
                                        <option value="1">星期一</option>
                                        <option value="2">星期二</option>
                                        <option value="3">星期三</option>
                                        <option value="4">星期四</option>
                                        <option value="5">星期五</option>
                                        <option value="6">星期六</option>
                                        <option value="0">星期日</option>
                                    </select>
                                </label>
                            </li>
                        </ul>
                        请选择月份：
                        <div id="divPatrolPlanMonthday"></div>
                    </div>                    
                </div>
            </div>
        </div>
    </div>    
    <div style="clear:both;" class="statusbar statusbar-h30">
        <a class="btn btnc26" style="margin:-1px 5px 0;float:left;" onclick="gprsConfig.setPatrolTask(this);"><span>设置设备巡检点</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.patrolTask = gprsConfig.patrolTask || {};
    
    gprsConfig.patrolTask.shifts = 0; //任务班次
    gprsConfig.patrolTask.shift_max = 24;
    gprsConfig.patrolTask.shift_rid = 0;
    gprsConfig.patrolTask.shift_time = [15, 30]; //班次时间间隔，每个班次时间最短时间，每个班次之间的最小时间间隔
    gprsConfig.patrolTask.tsShiftStart = [];
    gprsConfig.patrolTask.tsShiftEnd = [];
    gprsConfig.patrolTask.htTaskPoint = new cms.util.Hashtable();
    gprsConfig.patrolTask.rid = 0;
    gprsConfig.patrolTask.rnum = 0;
    gprsConfig.patrolTask.rmax = 50;
    
    gprsConfig.patrolTask.arrPoint = [];
    gprsConfig.patrolTask.arrShiftTime = [];

    gprsConfig.arrPatrolTabs = [
        {code: 'task', name: '设置任务点', load: false},
        {code: 'shift', name: '巡检班次', load: false},
        {code: 'plan', name: '任务计划', load: false}
    ];
    gprsConfig.patrolFormType = 'task';
    //巡检计划类型
    gprsConfig.arrPatrolPlanType = [
        {code: 'once', name: '一次性', load: false},
        {code: 'day', name: '每天', load: false},
        {code: 'week', name: '每周', load: false},
        {code: 'month', name: '每月', load: false}
    ];
    
    gprsConfig.initialPatrolForm = function(){
        var strHtml = '<div id="patrolTabPanel" class="tabpanel" style="margin-left:-2px;">';
        for(var i=0; i<gprsConfig.arrPatrolTabs.length; i++){
            var tab = gprsConfig.arrPatrolTabs[i];
            strHtml += '<a class="' + (tab.code == gprsConfig.patrolFormType ? 'cur':'tab') + '" lang="' + tab.code + '" rel="#patrolFormBox_' + tab.code + '">'
                + '<span>' + tab.name + '</span>'
                + '</a>';
        }
        strHtml += '</div>';
        gprsConfig.frame.setFormPrompt(strHtml);
        
        cms.jquery.tabs('#patrolTabPanel', null, '.patrol-form-box', 'gprsConfig.switchPatrolTab');
        
        $('#frmPatrolTree').attr('src', cmsPath + '/modules/gprsConfig/tools/setPatrolTaskTree.aspx?unitId=' + loginUser.userUnit + '&' + new Date().getTime());
        
        //添加一个班次
        gprsConfig.addPatrolShift();
        
        for(var i=0; i<gprsConfig.arrPatrolPlanType.length; i++){
            cms.util.fillOption(cms.util.$('ddlPatrolPlanType'), gprsConfig.arrPatrolPlanType[i].code, gprsConfig.arrPatrolPlanType[i].name);
        }        
        $("#txtPatrolStartDate").focus(function(){
            WdatePicker({skin:'ext',minDate:'2014-01-01',maxDate:'2099-12-31',dateFmt:'yyyy-MM-dd'});
        });
        $("#txtPatrolEndDate").focus(function(){
            WdatePicker({skin:'ext',minDate:'2014-01-01',maxDate:'2099-12-31',dateFmt:'yyyy-MM-dd'});
        });
        
        gprsConfig.setFormBodySize();
    };
    
    gprsConfig.switchPatrolTab = function(param){
        var idx = gprsConfig.getTabsIndex(gprsConfig.arrPatrolTabs, param.action);
        switch(param.action){
            case gprsConfig.arrPatrolTabs[0].code:
                break;
            case gprsConfig.arrPatrolTabs[1].code:
                break;
            case gprsConfig.arrPatrolTabs[2].code:
                if(!gprsConfig.arrPatrolTabs[idx].load){
                    cms.util.$('ddlPatrolPlanType').onchange = function(){
                        gprsConfig.switchPatrolPlanType(this.value);
                    };
                    
                    cms.util.$('txtMonthDays').onclick = function(){
                        gprsConfig.selectMonthDays({id: 'TaskPlanMonth',obj: this});
                    };
                    
                    gprsConfig.arrPatrolTabs[idx].load = true;
                }
                break;
        }
    };
    
    gprsConfig.setFormBodySize = function(){
        var formSize = gprsConfig.frame.getFormSize();
        $('#divPatrolFormBox').height(formSize.height - 30);
        var treeBoxW = formSize.width >= 1000 ? 250 : formSize.width >= 750 ? 200 : 150;
        $('#divPatrolLineTreeBox').width(treeBoxW - 1);
        $('#divPatrolLineTreeBox').height(formSize.height - 30 - 27);
        $('#frmPatrolTree').height(formSize.height - 30 - 27 - 27);
        
        $('#divPatrolTaskForm').width(formSize.width - treeBoxW - 2);
        $('#listPatrolPoint').width(formSize.width - treeBoxW - 2);
        $('#listPatrolPoint').height(formSize.height - 30 - 28 - 23);
        $('#listPatrolShift').height(formSize.height - 30 - 28 - 23 - 50);
        $('#divPatrolPlanForm').height(formSize.height - 30 - 28 - 10);
    };
    
    gprsConfig.openPatrolPointMap = function(){
        var config = {
            id: 'pwPatrolPointMap',
            title: '地图设置巡检点',
            html: cmsPath + '/modules/gprsConfig/tools/setPatrolTaskMap.aspx?',
            requestType: 'iframe',
            width: 600,
            height: 400,
            minWidth: 320,
            minHeight: 260,
            dragAble: true,
            minAble: true,
            maxAble: true,
            showMinMax: true,
            noBottom: true,
            filter: false,
            lock: false,
            position: 7,
            x: 0,
            y: 1
        };
        cms.box.win(config);
    };
    
    gprsConfig.setPatrolPoint = function(param){
        if(param.type == 'point'){
            if(param.pointId > 0){
                if(!gprsConfig.patrolTask.htTaskPoint.contains(param.pointId)){
                    gprsConfig.patrolTask.htTaskPoint.add(param.pointId, param.pointName);
                    var pinfo = {id:param.pointId,name:param.pointName,lat:param.latitude,lng:param.longitude,radii:param.radii};
                    gprsConfig.buildTaskPointList(pinfo);
                }
            } else {
                var pinfo = {id:param.pointId,name:param.pointName,lat:param.latitude,lng:param.longitude,radii:param.radii};
                gprsConfig.buildTaskPointList(pinfo);            
            }
        }
    };

    gprsConfig.setPatrolPointMulti = function(arrPoint){
        if(arrPoint.length > 0){
            for(var i=0,c=arrPoint.length; i<c; i++){
                var pinfo = eval('(' + arrPoint[i] + ')');
                if(pinfo.id > 0){
                    if(!gprsConfig.patrolTask.htTaskPoint.contains(pinfo.id)){
                        gprsConfig.patrolTask.htTaskPoint.add(pinfo.id, pinfo.name);
                        gprsConfig.buildTaskPointList(pinfo);
                    }
                } else {
                    gprsConfig.patrolTask.htTaskPoint.add(pinfo.id, pinfo.name);
                    gprsConfig.buildTaskPointList(pinfo);                
                }
            }
        }
    };

    gprsConfig.buildTaskPointList = function(p){
        var obj = cms.util.$('tbPatrolPointList');
        var rid = gprsConfig.patrolTask.rid;
        var rnum = gprsConfig.patrolTask.rnum;
        var row = obj.insertRow(rnum);
        
        var cellid = 0;
        var rowData = [];
        
        row.style.height = '26px';
        
        var strCheckbox =  '<input type="checkbox" name="chbPatrolPoint" value="' + rid + '" onclick="cms.util.$(\'chbPatrolPointAll\').checked = cms.util.getCheckBoxCheckedCount(\'chbPatrolPoint\')==cms.util.$N(\'chbPatrolPoint\').length" />';
        var txtNum = '<input type="text" class="txt-label" id="ppNum' + rid +  '" name="ppNum" value="' + (rnum + 1) + '" readonly="readonly" style="width:29px;text-align:center;" />';
        var txtName = '<input type="text" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt-label" id="ppName' + rid +  '" name="ppName" value="' + p.name + '" maxlength="30" style="width:115px;" />'
        + '<input type="hidden" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt" id="ppId' + rid + '" name="ppId" value="' + p.id + '" style="width:20px;" />';
        var txtLat = '<input type="text" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt-label" id="ppLat' + rid +  '" name="ppLat" value="' + p.lat + '" maxlength="12" style="width:72px;" />';
        var txtLng = '<input type="text" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt-label" id="ppLng' + rid +  '" name="ppLng" value="' + p.lng + '" maxlength="12" style="width:72px;" />';
        var txtRadii = '<input type="text" onfocus="this.className=\'txt-focus\'" onblur="this.className=\'txt-label\'" class="txt-label" id="ppRadii' + rid +  '" name="ppRadii" value="' + p.radii + '" maxlength="4" style="width:45px;text-align:center;" />';
        var strDel = '<a onclick="gprsConfig.deletePatrolPoint(parseInt(cms.util.$(\'ppNum' + rid + '\').value,10)-1,parseInt(cms.util.$(\'ppId' + rid + '\').value,10));"><span>删除</span></a>';
        
        rowData[cellid++] = {html: strCheckbox, style:[['width','25px']]};
        rowData[cellid++] = {html: txtNum, style:[['width','35px']]};
        rowData[cellid++] = {html: txtName, style:[['width','125px']]};
        rowData[cellid++] = {html: txtLat, style:[['width','80px']]};
        rowData[cellid++] = {html: txtLng, style:[['width','80px']]};
        rowData[cellid++] = {html: txtRadii, style:[['width','55px']]};
        rowData[cellid++] = {html: strDel, style:[['textAlign','left'],['textIndent','5px']]};
        
        cms.util.fillTable(row, rowData);        
        
        gprsConfig.patrolTask.rid++;
        gprsConfig.patrolTask.rnum++;
    };
    
    gprsConfig.deletePatrolPoint = function(id, pid){
        var arrChb = cms.util.$N('chbPatrolPoint');
        if(arrChb.length == 0){
            return false;
        }
        var arrNum = cms.util.getCheckBoxChecked('chbPatrolPoint');
        var c = arrNum.length;
        var arrPoint = [];
        var strHtml = '确定要删除选中的巡检点吗？';
        if(id != undefined){
            arrPoint.push({id:id, pid:pid});
            strHtml = '确定要删除巡检点' + (id + 1) + '吗？';
        } else if(c > 0){
            for(var i=0; i<c; i++){
                arrPoint.push({id:parseInt($('#ppNum' + arrNum[i].value).val())-1, pid:$('#ppId' + arrNum[i].value).val()});
            }
        } else {
            cms.box.alert({title:'提示信息', html:'请选择要删除的巡检点'});
            return false;
        }
        var config = {
            title: '删除巡检点',
            html: strHtml,
            boxType: 'confirm',
            callBack: gprsConfig.deletePatrolPointAction,
            returnValue: {
                arrPoint: arrPoint
            }
        };
        cms.box.win(config);
    };

    gprsConfig.deletePatrolPointAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var obj = cms.util.$("tbPatrolPointList");
            var arrPoint = pwReturn.returnValue.arrPoint;
            for(var i=arrPoint.length; i>0; i--){
                cms.util.removeDataRow(obj, arrPoint[i-1].id);
                gprsConfig.patrolTask.htTaskPoint.remove(arrPoint[i-1].pid);
                gprsConfig.patrolTask.rnum--;
            }
            //删除行后，重新排序数字序号
            var arrNum = cms.util.$N("ppNum");
            for(var i=0,c=arrNum.length; i<c; i++){
                arrNum[i].value = i+1;
            }
            $('#chbPatrolPointAll').attr('checked', false);
        }
    };

    gprsConfig.switchPatrolPlanType = function(type){
        var idx = gprsConfig.getTabsIndex(gprsConfig.arrPatrolPlanType, type);
        switch(type){
            case gprsConfig.arrPatrolPlanType[2].code:
                if(!gprsConfig.arrPatrolPlanType[idx].load){
                    var strHtml = gprsConfig.buildWeekdayForm({isAllChecked: true});                    
                    $('#divPatrolPlanWeekday').html(strHtml);
                    
                    //每隔几周
                    new TimeSelect('weekIntervalSelectBox', 
                        {id:'txtWeekInterval', type:'num', obj:'txtWeekInterval', value:'1',width:42,min:1,max:52,timing:10});
                    
                    gprsConfig.arrPatrolPlanType[idx].load = true;
                }
                break;
            case gprsConfig.arrPatrolPlanType[3].code:
                if(!gprsConfig.arrPatrolPlanType[idx].load){                    
                    var strHtml = gprsConfig.buildMonthdayForm({isAllChecked: true}); 
                    $('#divPatrolPlanMonthday').html(strHtml);
                    //哪一天
                    new TimeSelect('boxMonthDay', 
                        {id:'boxMonthDay', type:'num', obj:'txtMonthDay', value:'1',width:42,min:1,max:31,timing:10});
                    
                    gprsConfig.arrPatrolPlanType[idx].load = true;
                }
                break;
        }
        $('.divPatrolPlanForm').hide();
        $('#divPatrolPlanForm_' + type).show();
    };
    
    gprsConfig.addPatrolShift = function(worktime){
        if(gprsConfig.patrolTask.shifts > gprsConfig.patrolTask.shift_max - 1){
            cms.box.alert({title:'提示信息',html:'班次最多不得超过' + gprsConfig.patrolTask.shift_max + '个班次'});
            return false;
        }
        var tb = cms.util.$('tbPatrolShift');
        var id = gprsConfig.patrolTask.shift_rid;
        var row = tb.insertRow(gprsConfig.patrolTask.shifts);
        var rowData = [];
        var cellid = 0;
        
        row.style.height = '26px';
        if(worktime == null || worktime == undefined){
            worktime = {start:'00:00', end:'23:59'};
        }
        
        var strStart = '<span id="boxStartTime_' + id + '" style="float:left;text-align:left;"></span>'
            + '<input type="hidden" name="txtStartTime_TaskForm" id="txtStartTime_TaskForm_' + id + '" value="' + worktime.start + '" />';
        var strEnd = '<span id="boxEndTime_' + id + '" style="float:left;text-align:left;">'
            + '</span><input type="hidden" name="txtEndTime_TaskForm" id="txtEndTime_TaskForm_' + id + '" value="' + worktime.end + '" />';
        var strOper = '<a onclick="gprsConfig.deletePatrolShift($(\'#txtShiftNum_TaskForm_' + id + '\').val());"><span>删除</span></a>';
        var strNum = '<input type="text" name="txtShiftNum_TaskForm" id="txtShiftNum_TaskForm_' + id + '" class="txt-label" style="width:40px;text-align:center;" readonly="readonly" value="' + (gprsConfig.patrolTask.shifts + 1) + '" />';
        var strCheck = '<input type="checkbox" name="chbPatrolShift" value="' + (gprsConfig.patrolTask.shifts + 1) + '" onclick="cms.util.$(\'chbPatrolShiftAll\').checked = cms.util.getCheckBoxCheckedCount(\'chbPatrolShift\')==cms.util.$N(\'chbPatrolShift\').length;" />';
        
        rowData[cellid++] = {html: strCheck, style:[['width','25px']]};
        rowData[cellid++] = {html: strNum, style:[['width','50px']]};
        rowData[cellid++] = {html: strStart, style:[['width','70px'],['padding','0 5px']]};
        rowData[cellid++] = {html: strEnd, style:[['width','70px'],['padding','0 5px']]};
        rowData[cellid++] = {html: strOper, style:[['width','50px']]};
        rowData[cellid++] = {html: '', style:[]};
        
        cms.util.fillTable(row, rowData);
        gprsConfig.patrolTask.tsShiftStart.push(new TimeSelect('boxStartTime_' + id, {id:'txtStartTime_' + id, type:'h:m', obj:'txtStartTime_TaskForm_' + id, width:65}));
        gprsConfig.patrolTask.tsShiftEnd.push(new TimeSelect('boxEndTime_' + id, {id:'txtEndTime_' + id, type:'h:m', obj:'txtEndTime_TaskForm_' + id, width:65}));
        gprsConfig.patrolTask.shift_rid++;
        gprsConfig.patrolTask.shifts++;
        
        if(gprsConfig.patrolTask.shifts > 1){
            $('#tbPatrolShift .btn').show();
        }
        
        cms.util.$('listPatrolShift').scrollTop = cms.util.$('listPatrolShift').scrollHeight;
        cms.util.$('chbPatrolShiftAll').checked = cms.util.getCheckBoxCheckedCount('chbPatrolShift')==cms.util.$N('chbPatrolShift').length;
    };

    gprsConfig.deletePatrolShift = function(ri){
        if(gprsConfig.patrolTask.shifts <= 1){
            cms.box.alert({title:'提示信息',html:'至少得有一个班次'});
            return false;
        }
        var tb = cms.util.$('tbPatrolShift');
        if(ri == undefined){
            var arr = cms.util.getCheckBoxChecked('chbPatrolShift');
            if(arr.length > 0){
                for(var i=arr.length - 1; i>=0; i--){
                    if(gprsConfig.patrolTask.shifts <= 1){
                        break;
                    }
                    cms.util.removeDataRow(tb, parseInt(arr[i].value,10) - 1);
                    gprsConfig.patrolTask.shifts--;                    
                }
            } else {
                cms.box.alert({title:'提示信息',html:'请选择要删除的班次'});
                return false;                
            }
        } else {
            cms.util.removeDataRow(tb, parseInt(ri,10) - 1);
            gprsConfig.patrolTask.shifts--;
        }
        //删除行后，重新排序数字序号
        var arrNum = cms.util.$N('txtShiftNum_TaskForm');
        var arrChb = cms.util.$N('chbPatrolShift');
        for(var i=0,c=arrNum.length; i<c; i++){
            arrNum[i].value = i+1;
            arrChb[i].value = i+1;
        }
    };
    
    //设置巡检任务
    
    gprsConfig.getPatrolShiftContent = function(){
        var arrNum = cms.util.$N('txtShiftNum_TaskForm');
        var arrStartTime = cms.util.$N('txtStartTime_TaskForm');
        var arrEndTime = cms.util.$N('txtEndTime_TaskForm');
        var arrShift = [];
        var strShift = '';
        if(arrNum.length <= 0){
            cms.box.alert({title:'提示信息', html:'请设置巡检班次'});
            return false;
        }
        for(var i=0,c=arrNum.length; i<c; i++){
            var num = parseInt(arrNum[i].value.trim(), 10);
            var startTime = arrStartTime[i].value.trim();
            var endTime = arrEndTime[i].value.trim();
            
            if(gprsConfig.checkPatrolShiftTime(num, startTime, endTime)){
                strShift += i > 0 ? ',' : '';
                strShift += '[\'' + startTime + '\',\'' + endTime + '\']';
                gprsConfig.patrolTask.arrShiftTime.push([num, startTime, endTime]);
            } else {
                return false;
            }
        }        
        return strShift;
    };
    
    gprsConfig.checkPatrolShiftTime = function(num, startTime, endTime){
        return true;
    };
    
    gprsConfig.setPatrolTask = function(btn){
        var strContent = '';
        var strParam = '';
        var strStartDate = $('#txtPatrolStartDate').val().trim();
        var strEndDate = $('#txtPatrolEndDate').val().trim();
        var playType = $('#ddlPatrolPlanType').val().trim();
        var planContent = '';
        var patrolShift = gprsConfig.getPatrolShiftContent();
        if(!patrolShift){
            return false;
        }
        
        alert(patrolShift);
        
        
        var urlparam = 'action=setPatrolTask&devCode=' + devInfo.devCode + '&setting=' + strContent + '&param=';
        alert(urlparam);
        return false;
        cms.box.confirm({
            title: '设置巡检任务点',
            html: '确定要设置巡检任务吗？',
            callBack: gprsConfig.setPatrolTaskAction,
            returnValue: {
                btn: btn, 
                urlparam: urlparam,
                setting: strContent
            }
        });
    };
    
    gprsConfig.setPatrolTaskAction = function(pwobj, pwReturn){
        var isContinue = false;
        var strSetting = '';
        var urlparam = '';
        var btn = null;
        if(param != undefined){
            isContinue = true;
            strSetting = param.setting;
            urlparam = param.urlparam;
            btn = param.btn;
        } else {
            if(pwReturn.dialogResult){
                isContinue = true;
                strSetting = pwReturn.returnValue.setting;
                urlparam = pwReturn.returnValue.urlparam;
                btn = pwReturn.returnValue.btn;
            }
        }
        if(isContinue){
            module.appendDebugInfo(module.getDebugTime() + '[setPatrolTask Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setPatrolTaskCallBack,
                param: {
                    btn: btn,
                    setting: strSetting
                }
            });
        }
    };
    
    gprsConfig.setPatrolTaskCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setPatrolTask Response] data: ' + data);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }        
        var jsondata = eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var n = 0;
        var strSetting = param.setting;
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var id = jsondata.list[i];
            gprsConfig.task.appendTaskList({id:id, action:'setPatrolTask', title:'设置巡检任务点', result:'正在设置，请稍候...'});
        }
        gprsConfig.setControlDisabledByTiming(param.btn, false);
    };

    gprsConfig.initialPatrolForm();
</script>