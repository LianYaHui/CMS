var gprsConfig = gprsConfig || {};
gprsConfig.task = gprsConfig.task || {};
gprsConfig.task.rid = 0;
gprsConfig.task.arrTask = [];
gprsConfig.task.timer = null;
//定时刷新频率，单位：毫秒
gprsConfig.task.timeout = 3000;
//定时刷新频率，单位：毫秒
gprsConfig.task.interval = 1000;
//定时刷新最大次数
gprsConfig.task.maxTimes = 90;
//超时时间
gprsConfig.task.totalOverTime = gprsConfig.task.interval * gprsConfig.task.maxTimes;

gprsConfig.task.initial = function(){
    var strHtml = '<div class="operbar" style="border-top:solid 1px #99bbe8;" onclick="gprsConfig.frame.setTaskBoxSize(0, cms.util.$(\'btnTaskWinMin\'));">'
        + '<a class="win-max" id="btnTaskWinMax" onclick="gprsConfig.frame.setTaskBoxSize(2, this);cms.util.stopBubble(event);" style="margin-top:6px;"></a>'
        + '<a class="win-min" id="btnTaskWinMin" onclick="gprsConfig.frame.setTaskBoxSize(0, this);cms.util.stopBubble(event);" style="margin-top:6px;"></a>'
        + '<span class="title" style="padding:0;cursor:pointer;text-indent:5px;">任务状态栏</span>'
        + '<span id="btnTaskClear" style="display:none;">'
        + '<a class="ibtn nobg" onclick="gprsConfig.task.clearTask(true);cms.util.stopBubble(event);" style="margin-left:225px;" title="清除已完成的任务"><i class="icon-sub"></i>a</a>'
        + '<a class="ibtn nobg" onclick="gprsConfig.task.clearTask(false);cms.util.stopBubble(event);" style="margin-left:3px;" title="删除所有任务"><i class="icon-delete"></i>a</a>'
        + '</span>'
        + '</div>'
        + '<div id="taskHeader" class="listheader">'
        + '<table class="tbheader" id="tbTaskHeader" cellpadding="0" cellspacing="0">'
        + '<tr>'
        + '<td style="width:35px;">序号</td>'
        + '<td style="width:50px;">ID</td>'
        + '<td style="width:234px;">命令</td>'
        + '<td style="width:60px;">状态</td>'
        + '<td>结果</td>'
        + '</tr>'
        + '</table>'
        + '</div>'
        + '<div id="taskList" class="list" style="overflow:auto;">'
        + '<table class="tblist" id="tbTaskList" cellpadding="0" cellspacing="0"></table>'
        + '</div>';
    $('#taskbar').html(strHtml);
};

gprsConfig.task.setBoxSize = function(boxHeight){
    $('#taskList').height(boxHeight - 26 - 24);
};

//gprsConfig.task.appendTaskList = function(id, action, title, result, func, ){

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
gprsConfig.task.appendTaskList = function(param){
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
    gprsConfig.task.appendTask(task);
    
    var objList = cms.util.$('tbTaskList');
    //清除原有任务记录列表
    //cms.util.clearDataRow(objList, 0);
    
    var row = objList.insertRow(gprsConfig.task.rid++);
    var rowData = [];
    var cellid = 0;
    row.id = task.id;
    row.lang = '0';
    
    var strIndex = '<span id="lblTaskIndex_' + task.id + '">' + gprsConfig.task.rid + '</span>';
    var strStatus = '<span id="lblTaskStatus_' + task.id + '">-</span>';
    var strTitle = '<input type="text" readonly="readonly" id="txtTaskTitle_' + task.id + '" class="txt-label" value="' + task.title + '" />';
    var strResult = '<input type="text" readonly="readonly" id="txtTaskResult_' + task.id + '" class="txt-label" value="' + task.result + '" />';
    
    rowData[cellid++] = {html: strIndex, style:[['width','35px']]};
    rowData[cellid++] = {html: task.id, style:[['width','50px']]};
    rowData[cellid++] = {html: strTitle, style:[['width','234px'],['textIndent','3px']]};
    rowData[cellid++] = {html: strStatus, style:[['width','60px']]};
    rowData[cellid++] = {html: strResult, style:[['textAlign','left'],['padding','0 3px']]};
    
    cms.util.fillTable(row, rowData);
    
    var boxList = cms.util.$('taskList');
    boxList.scrollTop = boxList.scrollHeight;
    
    if(gprsConfig.task.timer != null){
        clearTimeout(gprsConfig.task.timer);
    }
    //先读取一次
    gprsConfig.task.getTaskListResult();
    
    gprsConfig.task.timer = window.setTimeout(gprsConfig.task.getTaskListResult, gprsConfig.task.interval);

    module.appendDebugInfo(module.getDebugTime() + '[' + task.action + ' Function]');
    
    if(0 == gprsConfig.frame.taskBoxWinMode){
	    gprsConfig.frame.setTaskBoxSize(1, null);
	}
    gprsConfig.task.setClearButtonDisplay(true);
};

gprsConfig.task.getTaskListResult = function(){
    var taskIdList = '';
    var n = 0;
    for(var i=0,c=gprsConfig.task.arrTask.length; i<c; i++){
        if(!gprsConfig.task.arrTask[i].isOverTime){
            taskIdList += (n > 0 ? ',' : '') + gprsConfig.task.arrTask[i].id;
            n++;
        }
    }
    if('' == taskIdList){
        return false;
    }
    var urlparam = 'action=getSettingLog&logIdList=' + taskIdList;
    module.appendDebugInfo(module.getDebugTime() + '[getTaskLog Request] param: ' + urlparam);
    gprsConfig.ajaxRequest({
        data: urlparam,
        callBack: gprsConfig.task.getTaskListResultCallBack
    });
};

gprsConfig.task.getTaskListResultCallBack = function(data){
    module.appendDebugInfo(module.getDebugTime() + '[getTaskLog Response] data: ' + data);
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(1 == jsondata.result){
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var dr = jsondata.list[i];
            var arrTask = gprsConfig.task.searchTask(dr.id);
            var task = null;
            var idx = null;
            if(arrTask != null){
                task = arrTask[0];
                idx = arrTask[1];
            } else {
                continue;
            }
            
            if(0 == dr.downStatus || (0 == dr.responseStatus && 2 != dr.downStatus)){
                //记录刷新次数
                /*
                if(0 == dr.downStatus){
                    gprsConfig.task.appendTaskTimes(idx, 1);
                } else {
                    gprsConfig.task.appendTaskTimes(idx);
                }
                */
                gprsConfig.task.appendTaskTimes(idx);
                if(!task.isOverTime){
                    continue;
                }
            } else if(1 == dr.downStatus && 1 == dr.responseStatus && task.multiPacket){
                //下发、回复 成功，检测回复协议完整性
                if(!gprsConfig.checkProtocolIntegrality(dr.responseContent)){
                    continue;
                }
            }
            gprsConfig.task.updateTaskList(dr);
            delete dr;
        }
    } else if(-1 == jsondata.result){
        module.showErrorInfo(jsondata.msg, jsondata.error);
    } else {
        module.showErrorInfo(jsondata.msg);
    }
    
    if(gprsConfig.task.arrTask.length > 0){
        if(gprsConfig.task.timer != null){
            clearTimeout(gprsConfig.task.timer);
        }
        gprsConfig.task.timer = window.setTimeout(gprsConfig.task.getTaskListResult, gprsConfig.task.interval);
    } else {
        clearTimeout(gprsConfig.task.timer);
    }
    delete jsondata;
};

gprsConfig.task.updateTaskList = function(param){
    var arrTask = gprsConfig.task.searchTask(param.id);
    if(arrTask != null){
        var task = arrTask[0];
        var idx = arrTask[1];
        module.appendDebugInfo(module.getDebugTime() + '[' + task.action + ' Response] downStatus: ' + param.downStatus + ', downTime: ' + param.downTime
            + ', protocolContent: ' + param.protocolContent + ', responseStatus: ' + param.responseStatus + ', responseTime: ' + param.responseTime
            + ', responseContent: ' + param.responseContent
            + (param.errorCode != '' ? ', errorCode: ' + param.errorCode : '')
        );
        var isDel = true;
        var isSuccess = true;
        var strStatus = '';
        var strContent = '';
        if(1 == param.downStatus && 1 == param.responseStatus){
            strStatus = '完成'; 
            if(gprsConfig.isDebug){
                strContent = param.responseContent;
            } else {
                //隐藏回复协议头部
                strContent = gprsConfig.getResponseProtocolContent(param.responseContent);
            }
        } else if(2 == param.responseStatus){
            isSuccess = false;
            strStatus = '回复失败';
            strContent = gprsConfig.task.parseTaskErrorCode(param.errorCode);
        } else if(2 == param.downStatus){
            isSuccess = false;
            strStatus = '下发失败';
            strContent = gprsConfig.task.parseTaskErrorCode(param.errorCode);
        } else {
            isSuccess = false;
            strStatus = '超时';
            strContent = 0 == param.downStatus ? '未下发' : '未回复';
            isDel = false;
        }
        if(isDel){
            gprsConfig.task.removeTask(idx);
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
                    callBack(gprsConfig.getResponseProtocolContent(strContent), isSuccess, task.callBackParam);
                } else {
                    callBack(gprsConfig.getResponseProtocolContent(strContent), isSuccess);
                }
                delete callBack;
            }catch(ex){
                module.showErrorInfo(ex);
            }
        }
    }
};

//gprsConfig.task.appendTask = function(id, action, title,  result, func){
gprsConfig.task.appendTask = function(param){
    gprsConfig.task.arrTask.push({
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

gprsConfig.task.appendTaskTimes = function(idx, num){
    if(num != undefined){
        gprsConfig.task.arrTask[idx].times += num;    
    } else {
        gprsConfig.task.arrTask[idx].times++;
    }
    if(gprsConfig.task.arrTask[idx].times > gprsConfig.task.maxTimes){
        gprsConfig.task.arrTask[idx].isOverTime = true;
    }
};

gprsConfig.task.removeTask = function(idx){
    gprsConfig.task.arrTask.splice(idx, 1);
};

gprsConfig.task.clearTask = function(isOnlySuccess){
    var objList = cms.util.$('tbTaskList');
    if(isOnlySuccess){    
        if(objList.rows.length > 0){
            for(var i=objList.rows.length - 1; i>=0; i--){
                if('1' == objList.rows[i].lang){
                    cms.util.removeDataRow(objList, i);
                    gprsConfig.task.rid--;
                }
            }
            for(var i=0,c=objList.rows.length; i<c; i++){
                $('#lblTaskIndex_' + objList.rows[i].id).html((i+1));
            }
            gprsConfig.task.setClearButtonDisplay();
        }
    } else {
        if(objList.rows.length > 0 || gprsConfig.task.arrTask.length > 0){
            cms.box.confirm({
                title: '删除任务',
                html: '确定要删除所有任务吗？',
                callBack: gprsConfig.task.clearTaskCallBack
            });
        }
    }
};

gprsConfig.task.clearTaskCallBack = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var objList = cms.util.$('tbTaskList');
        gprsConfig.task.arrTask.length = 0;
        cms.util.clearDataRow(objList, 0);
        gprsConfig.task.rid = 0;
        gprsConfig.task.setClearButtonDisplay(false);
    }
    pwobj.Hide();
};

gprsConfig.task.setClearButtonDisplay = function(isShow){
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

gprsConfig.task.searchTask = function(id){
    var found = false;
    var high = gprsConfig.task.arrTask.length;
    var low = 0;
    var mid = parseInt((high + low) / 2, 10);
    if(high > 0){
        while (!found && high >= low)
        {
            if (id == gprsConfig.task.arrTask[mid].id)
                found = true;
            else if (id < gprsConfig.task.arrTask[mid].id)
                high = mid - 1;
            else
                low = mid + 1;

            mid = parseInt((high + low) / 2, 10);
        }
    }
    return found ? [gprsConfig.task.arrTask[mid], mid] : null;
};

gprsConfig.task.arrErrorCode = [
    [101, '下发失败，设备离线'],
    [102, '下发失败，下发协议格式错误'],
    [103, '下发失败，协议参数格式错误'],
    [201, '设备回复超时'],
    [202, '回复失败，回复协议格式错误'],
    [203, '回复成功，下发协议格式错误'],
    [204, '回复成功，设备执行失败']
];

gprsConfig.task.parseTaskErrorCode = function(ecode){
    if('' == ecode){
        return '未知错误: 可能是设备离线。';
    }
    try{
        ecode = parseInt(ecode, 10);
    } catch(e){
        return ecode + ':未知错误';
    }
    var found = false;
    var high = gprsConfig.task.arrErrorCode.length;
    var low = 0;
    var mid = parseInt((high + low) / 2, 10);
    while (!found && high >= low)
    {
        if (ecode == gprsConfig.task.arrErrorCode[mid][0])
            found = true;
        else if (ecode < gprsConfig.task.arrErrorCode[mid][0])
            high = mid - 1;
        else
            low = mid + 1;

        mid = parseInt((high + low) / 2, 10);
    }
    return found ? gprsConfig.task.arrErrorCode[mid][1] : '未知错误';
};