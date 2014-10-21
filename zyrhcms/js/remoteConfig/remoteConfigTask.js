var remoteConfig = remoteConfig || {};
remoteConfig.task = remoteConfig.task || {};
remoteConfig.task.rid = 0;
remoteConfig.task.arrTask = [];
remoteConfig.task.timer = null;
//定时刷新频率，单位：毫秒
remoteConfig.task.timeout = 3000;
//定时刷新频率，单位：毫秒
remoteConfig.task.interval = 1000;
//定时刷新最大次数
remoteConfig.task.maxTimes = 60;
//超时时间
remoteConfig.task.totalOverTime = remoteConfig.task.interval * remoteConfig.task.maxTimes;

remoteConfig.task.initial = function(){
    var strHtml = '<div class="operbar" style="border-top:solid 1px #99bbe8;" onclick="remoteConfig.frame.setTaskBoxSize(0, cms.util.$(\'btnTaskWinMin\'));">'
        + '<a class="win-max" id="btnTaskWinMax" onclick="remoteConfig.frame.setTaskBoxSize(2, this);cms.util.stopBubble(event);" style="margin-top:6px;"></a>'
        + '<a class="win-min" id="btnTaskWinMin" onclick="remoteConfig.frame.setTaskBoxSize(0, this);cms.util.stopBubble(event);" style="margin-top:6px;"></a>'
        + '<span class="title" style="padding:0;cursor:pointer;text-indent:5px;">任务状态栏</span>'
        + '<span id="btnTaskClear" style="display:none;">'
        + '<a class="ibtn nobg" onclick="remoteConfig.task.clearTask(true);cms.util.stopBubble(event);" style="margin-left:225px;" title="清除已完成的任务"><i class="icon-sub"></i>a</a>'
        + '<a class="ibtn nobg" onclick="remoteConfig.task.clearTask(false);cms.util.stopBubble(event);" style="margin-left:3px;" title="删除所有任务"><i class="icon-delete"></i>a</a>'
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

remoteConfig.task.setBoxSize = function(boxHeight){
    $('#taskList').height(boxHeight - 26 - 24);
};

//remoteConfig.task.appendTaskList = function(id, action, title, result, func, ){

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
remoteConfig.task.appendTaskList = function(param){
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
    remoteConfig.task.appendTask(task);
    
    var objList = cms.util.$('tbTaskList');
    //清除原有任务记录列表
    //cms.util.clearDataRow(objList, 0);
    
    var row = objList.insertRow(remoteConfig.task.rid++);
    var rowData = [];
    var cellid = 0;
    row.id = task.id;
    row.lang = '0';
    
    var listW = remoteConfig.frame.boxSize.width;
    var titleW = 225;
    var resultW = listW - 234 - 35 - 50 - 60 - 10;
    
    var strIndex = '<span id="lblTaskIndex_' + task.id + '">' + remoteConfig.task.rid + '</span>';
    var strStatus = '<span id="lblTaskStatus_' + task.id + '">-</span>';
    var strTitle = '<input type="text" readonly="readonly" id="txtTaskTitle_' + task.id + '" class="txt-label" value="' + task.title + '" style="max-width:' + titleW + 'px;" />';
    var strResult = '<input type="text" readonly="readonly" id="txtTaskResult_' + task.id + '" class="txt-label" value="' + task.result + '" style="max-width:' + resultW + 'px;" />';
    
    rowData[cellid++] = {html: strIndex, style:[['width','35px']]};
    rowData[cellid++] = {html: task.id, style:[['width','50px']]};
    rowData[cellid++] = {html: strTitle, style:[['width','234px'],['textIndent','3px']]};
    rowData[cellid++] = {html: strStatus, style:[['width','60px']]};
    rowData[cellid++] = {html: strResult, style:[['textAlign','left'],['padding','0 3px']]};
    
    cms.util.fillTable(row, rowData);
    
    var boxList = cms.util.$('taskList');
    boxList.scrollTop = boxList.scrollHeight;
    
    if(remoteConfig.task.timer != null){
        clearTimeout(remoteConfig.task.timer);
    }
    //先读取一次
    remoteConfig.task.getTaskListResult();
    
    remoteConfig.task.timer = window.setTimeout(remoteConfig.task.getTaskListResult, remoteConfig.task.interval);

    module.appendDebugInfo(module.getDebugTime() + '[' + task.action + ' Function]');
    
    if(0 == remoteConfig.frame.taskBoxWinMode){
	    remoteConfig.frame.setTaskBoxSize(1, null);
	}
    remoteConfig.task.setClearButtonDisplay(true);
};

remoteConfig.task.getTaskListResult = function(){
    var taskIdList = '';
    var n = 0;
    for(var i=0,c=remoteConfig.task.arrTask.length; i<c; i++){
        if(!remoteConfig.task.arrTask[i].isOverTime){
            taskIdList += (n > 0 ? ',' : '') + remoteConfig.task.arrTask[i].id;
            n++;
        }
    }
    if('' == taskIdList){
        return false;
    }
    var urlparam = 'action=getSettingLog&logIdList=' + taskIdList;
    module.appendDebugInfo(module.getDebugTime() + '[getTaskLog Request] param: ' + urlparam);
    remoteConfig.ajaxRequest({
        data: urlparam,
        callBack: remoteConfig.task.getTaskListResultCallBack
    });
};

remoteConfig.task.getTaskListResultCallBack = function(data){
    module.appendDebugInfo(module.getDebugTime() + '[getTaskLog Response] data: ' + data);
    if(!data.isJsonData()){
        module.showJsonErrorData(data);
        return false;
    }
    var jsondata = data.toJson();//eval('(' + data + ')');
    if(1 == jsondata.result){
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var dr = jsondata.list[i];
            var arrTask = remoteConfig.task.searchTask(dr.id);
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
                    remoteConfig.task.appendTaskTimes(idx, 1);
                } else {
                    remoteConfig.task.appendTaskTimes(idx);
                }
                */
                remoteConfig.task.appendTaskTimes(idx);
                if(!task.isOverTime){
                    continue;
                }
            } else if(1 == dr.downStatus && 1 == dr.responseStatus && task.multiPacket){
                //下发、回复 成功，检测回复协议完整性
                if(!remoteConfig.checkProtocolIntegrality(dr.responseContent)){
                    continue;
                }
            }
            remoteConfig.task.updateTaskList(dr);
            delete dr;
        }
    } else if(-1 == jsondata.result){
        module.showErrorInfo(jsondata.msg, jsondata.error);
    } else {
        module.showErrorInfo(jsondata.msg);
    }
    
    if(remoteConfig.task.arrTask.length > 0){
        if(remoteConfig.task.timer != null){
            clearTimeout(remoteConfig.task.timer);
        }
        remoteConfig.task.timer = window.setTimeout(remoteConfig.task.getTaskListResult, remoteConfig.task.interval);
    } else {
        clearTimeout(remoteConfig.task.timer);
    }
    delete jsondata;
};

remoteConfig.task.updateTaskList = function(param){
    var arrTask = remoteConfig.task.searchTask(param.id);
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
            if(remoteConfig.isDebug){
                strContent = param.responseContent;
            } else {
                //隐藏回复协议头部
                strContent = param.responseContent;
            }
        } else if(2 == param.responseStatus){
            isSuccess = false;
            strStatus = '回复失败';
            strContent = remoteConfig.task.parseTaskErrorCode(param.errorCode);
        } else if(2 == param.downStatus){
            isSuccess = false;
            strStatus = '下发失败';
            strContent = remoteConfig.task.parseTaskErrorCode(param.errorCode);
        } else {
            isSuccess = false;
            strStatus = '超时';
            strContent = 0 == param.downStatus ? '未下发' : '未回复';
            isDel = false;
        }
        if(isDel){
            remoteConfig.task.removeTask(idx);
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
                    callBack(strContent, isSuccess, task.callBackParam);
                } else {
                    callBack(strContent, isSuccess);
                }
                delete callBack;
            }catch(ex){
                module.showErrorInfo(ex);
            }
        }
    }
};

//remoteConfig.task.appendTask = function(id, action, title,  result, func){
remoteConfig.task.appendTask = function(param){
    remoteConfig.task.arrTask.push({
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

remoteConfig.task.appendTaskTimes = function(idx, num){
    if(num != undefined){
        remoteConfig.task.arrTask[idx].times += num;    
    } else {
        remoteConfig.task.arrTask[idx].times++;
    }
    if(remoteConfig.task.arrTask[idx].times > remoteConfig.task.maxTimes){
        remoteConfig.task.arrTask[idx].isOverTime = true;
    }
};

remoteConfig.task.removeTask = function(idx){
    remoteConfig.task.arrTask.splice(idx, 1);
};

remoteConfig.task.clearTask = function(isOnlySuccess){
    var objList = cms.util.$('tbTaskList');
    if(isOnlySuccess){    
        if(objList.rows.length > 0){
            for(var i=objList.rows.length - 1; i>=0; i--){
                if('1' == objList.rows[i].lang){
                    cms.util.removeDataRow(objList, i);
                    remoteConfig.task.rid--;
                }
            }
            for(var i=0,c=objList.rows.length; i<c; i++){
                $('#lblTaskIndex_' + objList.rows[i].id).html((i+1));
            }
            remoteConfig.task.setClearButtonDisplay();
        }
    } else {
        if(objList.rows.length > 0 || remoteConfig.task.arrTask.length > 0){
            cms.box.confirm({
                title: '删除任务',
                html: '确定要删除所有任务吗？',
                callBack: remoteConfig.task.clearTaskCallBack
            });
        }
    }
};

remoteConfig.task.clearTaskCallBack = function(pwobj, pwReturn){
    if(pwReturn.dialogResult){
        var objList = cms.util.$('tbTaskList');
        remoteConfig.task.arrTask.length = 0;
        cms.util.clearDataRow(objList, 0);
        remoteConfig.task.rid = 0;
        remoteConfig.task.setClearButtonDisplay(false);
    }
    pwobj.Hide();
};

remoteConfig.task.setClearButtonDisplay = function(isShow){
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

remoteConfig.task.searchTask = function(id){
    var found = false;
    var high = remoteConfig.task.arrTask.length;
    var low = 0;
    var mid = parseInt((high + low) / 2, 10);
    if(high > 0){
        while (!found && high >= low)
        {
            if (id == remoteConfig.task.arrTask[mid].id)
                found = true;
            else if (id < remoteConfig.task.arrTask[mid].id)
                high = mid - 1;
            else
                low = mid + 1;

            mid = parseInt((high + low) / 2, 10);
        }
    }
    return found ? [remoteConfig.task.arrTask[mid], mid] : null;
};

remoteConfig.task.arrErrorCode = [
    [101, '下发失败，设备离线'],
    [102, '下发失败，下发协议格式错误'],
    [103, '下发失败，协议参数格式错误'],
    [201, '设备回复超时'],
    [202, '回复失败，回复协议格式错误'],
    [203, '回复成功，下发协议格式错误'],
    [204, '回复成功，设备执行失败']
];

remoteConfig.task.parseTaskErrorCode = function(ecode){
    if('' == ecode){
        return '未知错误: 可能是设备离线。';
    }
    try{
        ecode = parseInt(ecode, 10);
    } catch(e){
        return ecode + ':未知错误';
    }
    var found = false;
    var high = remoteConfig.task.arrErrorCode.length;
    var low = 0;
    var mid = parseInt((high + low) / 2, 10);
    while (!found && high >= low)
    {
        if (ecode == remoteConfig.task.arrErrorCode[mid][0])
            found = true;
        else if (ecode < remoteConfig.task.arrErrorCode[mid][0])
            high = mid - 1;
        else
            low = mid + 1;

        mid = parseInt((high + low) / 2, 10);
    }
    return found ? remoteConfig.task.arrErrorCode[mid][1] : '未知错误';
};