var sms = sms || {};
sms.task = sms.task || {};
sms.task.rid = 0;
sms.task.arrTask = [];
sms.task.timer = null;
//定时刷新频率，单位：毫秒
sms.task.timeout = 3000;
//定时刷新频率，单位：毫秒
sms.task.interval = 1000;
//定时刷新最大次数
sms.task.maxTimes = 90;
//超时时间
sms.task.totalOverTime = sms.task.interval * sms.task.maxTimes;

sms.task.initial = function(){
    var strHtml = '<div class="operbar" style="border-top:solid 1px #99bbe8;" onclick="sms.frame.setTaskBoxSize(0, cms.util.$(\'btnTaskWinMin\'));">'
        + '<a class="win-max" id="btnTaskWinMax" onclick="sms.frame.setTaskBoxSize(2, this);cms.util.stopBubble(event);" style="margin-top:6px;"></a>'
        + '<a class="win-min" id="btnTaskWinMin" onclick="sms.frame.setTaskBoxSize(0, this);cms.util.stopBubble(event);" style="margin-top:6px;"></a>'
        + '<span class="title" style="padding:0;cursor:pointer;text-indent:5px;">短信发送状态</span>'
        + '<span id="btnTaskClear" style="display:none;">'
        + '<a class="ibtn nobg" onclick="sms.task.clearTask(true);cms.util.stopBubble(event);" style="margin-left:225px;" title="清除已完成的任务"><i class="icon-sub"></i>a</a>'
        + '<a class="ibtn nobg" onclick="sms.task.clearTask(false);cms.util.stopBubble(event);" style="margin-left:3px;" title="删除所有任务"><i class="icon-delete"></i>a</a>'
        + '</span>'
        + '</div>'
        + '<div id="taskHeader" class="listheader">'
        + '<table class="tbheader" id="tbTaskHeader" cellpadding="0" cellspacing="0">'
        + '<tr>'
        + '<td style="width:35px;">序号</td>'
        + '<td style="width:50px;">ID</td>'
        + '<td>命令</td>'
        + '<td style="width:60px;">状态</td>'
        + '<td style="width:200px;">结果</td>'
        + '</tr>'
        + '</table>'
        + '</div>'
        + '<div id="taskList" class="list" style="overflow:auto;">'
        + '<table class="tblist" id="tbTaskList" cellpadding="0" cellspacing="0"></table>'
        + '</div>';
    $('#taskbar').html(strHtml);
};

sms.task.setBoxSize = function(boxHeight){
    $('#taskList').height(boxHeight - 26 - 24);
};

//sms.task.appendTaskList = function(id, action, title, result, func, ){

/*
    param: {
        id: 1,
        action: 'readDevVersion',
        title: '读取设备版本',
        result: '正在读取，请稍候...' || '完成',
        callBack: '', //回调函数名称
        callBackParam: '', 回调函数附加参数
        multiPacket: true || false //回复内容是否是多包数据,多包数据读取时间长
    }
*/
sms.task.appendTaskList = function(param){
    if(param == undefined){
        param = {};
    }
    var task = {
        id: param.id || 0,
        action: param.action || '',
        title: param.title || '',
        result: param.result || '正在设置，请稍候...',
        callBack: param.callBack || null,
        callBackParam: param.callBackParam || null,
        multiPacket: param.multiPacket || false
    };
    sms.task.appendTask(task);
    
    var objList = cms.util.$('tbTaskList');
    //清除原有任务记录列表
    //cms.util.clearDataRow(objList, 0);
    
    var row = objList.insertRow(sms.task.rid++);
    var rowData = [];
    var cellid = 0;
    row.id = task.id;
    row.lang = '0';
    
    var strIndex = '<span id="lblTaskIndex_' + task.id + '">' + sms.task.rid + '</span>';
    var strStatus = '<span id="lblTaskStatus_' + task.id + '">-</span>';
    var strTitle = '<input type="text" readonly="readonly" id="txtTaskTitle_' + task.id + '" class="txt-label" value="' + task.title + '" />';
    var strResult = '<input type="text" readonly="readonly" id="txtTaskResult_' + task.id + '" class="txt-label" value="' + task.result + '" />';
    
    rowData[cellid++] = {html: strIndex, style:[['width','35px']]};
    rowData[cellid++] = {html: task.id, style:[['width','50px']]};
    rowData[cellid++] = {html: strTitle, style:[['textAlign','left'],['textIndent','3px']]};
    rowData[cellid++] = {html: strStatus, style:[['width','60px']]};
    rowData[cellid++] = {html: strResult, style:[['width','195px'],['textIndent','5px']]};
    
    cms.util.fillTable(row, rowData);
    
    var boxList = cms.util.$('taskList');
    boxList.scrollTop = boxList.scrollHeight;
    
    if(sms.task.timer != null){
        clearTimeout(sms.task.timer);
    }
    //先读取一次
    sms.task.getTaskListResult();
    
    sms.task.timer = window.setTimeout(sms.task.getTaskListResult, sms.task.interval);

    module.appendDebugInfo(module.getDebugTime() + '[' + task.action + ' Function]');
    
    if(0 == sms.frame.taskBoxWinMode){
	    sms.frame.setTaskBoxSize(1, null);
	}
    sms.task.setClearButtonDisplay(true);
};

sms.task.getTaskListResult = function(){
    var taskIdList = '';
    var n = 0;
    for(var i=0,c=sms.task.arrTask.length; i<c; i++){
        if(!sms.task.arrTask[i].isOverTime){
            taskIdList += (n > 0 ? ',' : '') + sms.task.arrTask[i].id;
            n++;
        }
    }
    if('' == taskIdList){
        return false;
    }
    var urlparam = 'action=getSmsSendLog&logIdList=' + taskIdList;
    module.appendDebugInfo(module.getDebugTime() + '[getSmsSendLog Request] param: ' + urlparam);
    module.ajaxRequest({
        url: cmsPath + '/ajax/sms.aspx',
        data: urlparam,
        callBack: sms.task.getTaskListResultCallBack
    });
};

sms.task.getTaskListResultCallBack = function(data){
    module.appendDebugInfo(module.getDebugTime() + '[getSmsSendLog Response] data: ' + data);
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(1 == jsondata.result){
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var dr = jsondata.list[i];
            var arrTask = sms.task.searchTask(dr.id);
            var task = null;
            var idx = null;
            if(arrTask != null){
                task = arrTask[0];
                idx = arrTask[1];
            } else {
                continue;
            }
            
            if(0 == dr.sendStatus){
                sms.task.appendTaskTimes(idx);
                if(!task.isOverTime){
                    continue;
                }
            }
            sms.task.updateTaskList(dr);
            delete dr;
        }
    } else if(-1 == jsondata.result){
        module.showErrorInfo(jsondata.msg, jsondata.error);
    } else {
        module.showErrorInfo(jsondata.msg);
    }
    
    if(sms.task.arrTask.length > 0){
        if(sms.task.timer != null){
            clearTimeout(sms.task.timer);
        }
        sms.task.timer = window.setTimeout(sms.task.getTaskListResult, sms.task.interval);
    } else {
        clearTimeout(sms.task.timer);
    }
    delete jsondata;
};

sms.task.updateTaskList = function(param){
    var arrTask = sms.task.searchTask(param.id);
    if(arrTask != null){
        var task = arrTask[0];
        var idx = arrTask[1];
        module.appendDebugInfo(module.getDebugTime() + '[' + task.action + ' Response]'
            + ' sendStatus: ' + param.sendStatus + ', sendTime: ' + param.sendTime
            + ' ,sendNumber:' + param.sendNumber + ', sendResult: ' + param.sendResult
        );
        var isDel = true;
        var isSuccess = true;
        var strStatus = '';
        var strContent = '';
        if(1 == param.sendStatus){
            strStatus = '完成'; 
            if(sms.isDebug){
                strContent = param.sendResult;
            } else {
                strContent = param.sendResult;
            }
        } else if(2 == param.sendStatus){
            isSuccess = false;
            strStatus = '发送失败';
            strContent = param.sendResult;
        } else if(3 == param.sendStatus){
            isSuccess = false;
            strStatus = '任务被取消';
            strContent = param.sendResult;
        } else {
            isSuccess = false;
            strStatus = '超时';
            strContent = '未下发';
            isDel = false;
        }
        if(isDel){
            sms.task.removeTask(idx);
        }
        
        $('#lblTaskStatus_' + param.id).html(strStatus);
        $('#txtTaskResult_' + param.id).attr('value', strContent);
        //设置所在行 row.lang = 1
        $('#txtTaskResult_' + param.id).parent().parent().prop('lang', '1');
        
        if(!isSuccess){
            $('#txtTaskResult_' + param.id).css('color', '#f00');
            $('#lblTaskStatus_' + param.id).css('color', '#f00');
        }
                
        if(task.callBack != undefined && task.callBack != null){
            try{
                var callBack = null;
                if('function' == typeof task.callBack){
                    callBack = task.callBack;
                } else {
                    callBack = eval('(' + task.callBack + ')');
                }
                //回调（过滤协议头部内容及清除*）
                if(task.callBackParam != undefined && task.callBackParam != null){
                    callBack(sms.getResponseProtocolContent(strContent), isSuccess, task.callBackParam);
                } else {
                    callBack(sms.getResponseProtocolContent(strContent), isSuccess);
                }
                delete callBack;
            }catch(ex){
                module.showErrorInfo(ex);
            }
        }
    }
};

sms.task.appendTask = function(param){
    sms.task.arrTask.push({
        id: param.id,
        action: param.action,
        title: param.title,
        result: param.result || '正在设置，请稍候...',
        callBack: param.callBack || null,
        callBackParam: param.callBackParam|| null,
        multiPacket: param.multiPacket || false,
        status: 0,
        times: 0,
        isOverTime: false
    });
};

sms.task.appendTaskTimes = function(idx, num){
    if(num != undefined){
        sms.task.arrTask[idx].times += num;    
    } else {
        sms.task.arrTask[idx].times++;
    }
    if(sms.task.arrTask[idx].times > sms.task.maxTimes){
        sms.task.arrTask[idx].isOverTime = true;
    }
};

sms.task.removeTask = function(idx){
    sms.task.arrTask.splice(idx, 1);
};

sms.task.clearTask = function(isOnlySuccess){
    var objList = cms.util.$('tbTaskList');
    if(isOnlySuccess){    
        if(objList.rows.length > 0){
            for(var i=objList.rows.length - 1; i>=0; i--){
                if('1' == objList.rows[i].lang){
                    cms.util.removeDataRow(objList, i);
                    sms.task.rid--;
                }
            }
            for(var i=0,c=objList.rows.length; i<c; i++){
                $('#lblTaskIndex_' + objList.rows[i].id).html((i+1));
            }
            sms.task.setClearButtonDisplay();
        }
    } else {
        if(objList.rows.length > 0 || sms.task.arrTask.length > 0){
            cms.box.confirm({
                title: '删除任务',
                html: '确定要删除所有任务吗？',
                callBack: sms.task.clearTaskCallBack
            });
        }
    }
};

sms.task.clearTaskCallBack = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var objList = cms.util.$('tbTaskList');
        sms.task.arrTask.length = 0;
        cms.util.clearDataRow(objList, 0);
        sms.task.rid = 0;
        sms.task.setClearButtonDisplay(false);
    }
    pwobj.Hide();
};

sms.task.setClearButtonDisplay = function(isShow){
    if(isShow != undefined){
        if(isShow){
            $('#btnTaskClear').show();        
        } else {
            $('#btnTaskClear').hide();        
        }
    } else {
        var objList = cms.util.$('tbTaskList');
        if(objList.rows.length > 0){
            $('#btnTaskClear').show();
        } else {
            $('#btnTaskClear').hide();
        }
    }
};

sms.task.searchTask = function(id){
    var found = false;
    var high = sms.task.arrTask.length;
    var low = 0;
    var mid = parseInt((high + low) / 2, 10);
    if(high > 0){
        while (!found && high >= low)
        {
            if (id == sms.task.arrTask[mid].id)
                found = true;
            else if (id < sms.task.arrTask[mid].id)
                high = mid - 1;
            else
                low = mid + 1;

            mid = parseInt((high + low) / 2, 10);
        }
    }
    return found ? [sms.task.arrTask[mid], mid] : null;
};