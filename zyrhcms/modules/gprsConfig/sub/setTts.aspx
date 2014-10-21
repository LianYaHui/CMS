<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html>
<html>
<head>
    <title>TTS播放文字</title>
</head>
<body>
    <div class="formbody" style="padding:0;">
        <div id="divTabConList">
            <div class="tts-form-box" id="ttsFormBox_setting" style="width:560px;padding:5px 10px;">
                <div style="margin:5px 0 0;">
                    播放段位：<select class="select" id="ddlTtsMemoryNo" onchange="gprsConfig.setTtsFormSelectControl();"></select>
                    播放时间：<select class="select" id="ddlTtsHour"><option value="">选择</option></select>:<select class="select" id="ddlTtsMinute"><option value="">选择</option></select>
                    重复播放次数：<select class="select" id="ddlTtsReplayTime"></select>
                    <span style="display:block;color:#666;">说明：即时播放只播放1次(信息5分钟后过期)，其余9个播放段位会把内容存储在设备内存中重复播放。</span>
                </div>
                <div style="clear:both;">
                    <div id="lblTtsWordCount" style="float:right;"></div>
                    <span style="float:left;">请在下框中输入要播放的内容</span>
                    <label class="chb-label-nobg" style="float:left;margin-left:20px;color:#00f; display:none;">
                        <input type="checkbox" class="chb" id="chbClearTtsSpace" checked="checked" /><span>清除内容中的空格(如播放英文不要勾选)</span>
                    </label>
                </div>
                <div>
                    <textarea class="txt" id="txtTtsContent" style="width:550px;height:105px;" rows="" cols=""></textarea>
                </div>
                <div style="line-height:18px;padding:5px 0;color:#666;">
                    说明：播放内容中不能含有* # 以及换行符，如果出现，将自动被替换为空格符“ ”，英文逗号(,)将被替换为中文逗号(，)，字数不得超过2000个字节(一个中文汉字算两个字节)。
                </div>
                <a class="btn btnc24" id="btnSet" onclick="gprsConfig.setTtsContent(this);"><span class="w85">设置播放文字</span></a>
            </div>
            <div class="tts-form-box" id="ttsFormBox_current" style="display:none;">
                <div class="listheader">
                    <table class="tbheader" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width:30px;">序号</td>
                            <td style="width:35px;">段位</td>
                            <td style="width:55px;">播放时间</td>
                            <td style="width:55px;">播放次数</td>
                            <td style="width:45px;">状态</td>
                            <td style="width:120px;">文字内容</td>
                            <td style="width:30px;">详情</td>
                            <td style="width:120px;">下发时间</td>
                            <td style="width:60px;">操作</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div class="list" id="listTts">正在加载，请稍候...</div>
            </div>
            <div class="tts-form-box" id="ttsFormBox_history" style="display:none;">
                <div class="listheader">
                    <table class="tbheader" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width:30px;">序号</td>
                            <td style="width:35px;">段位</td>
                            <td style="width:55px;">播放时间</td>
                            <td style="width:55px;">播放次数</td>
                            <td style="width:45px;">状态</td>
                            <td style="width:120px;">文字内容</td>
                            <td style="width:30px;">详情</td>
                            <td style="width:120px;">下发时间</td>
                            <td style="width:60px;">操作</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div class="list" id="listTtsHistory">正在加载，请稍候...</div>
                <div class="statusbar"><span id="ttsPagination"></span></div>
            </div>
            <div class="tts-form-box" id="ttsFormBox_devmemory" style="display:none;">
                <div class="listheader">
                    <table class="tbheader" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width:30px;">序号</td>
                            <td style="width:35px;">段位</td>
                            <td style="width:55px;">播放时间</td>
                            <td style="width:55px;">播放次数</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div class="list" id="listTtsDevMemory">正在读取，请稍候...</div>
                <div class="statusbar">
                    <a class="btn btnc22" id="btnRead" onclick="gprsConfig.readDevTtsMemory(this);" style="margin-left:3px;"><span>读取设备存储</span></a>
                    <label id="lblReadTtsDevMemory" style="color:#666;"></label>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
<script type="text/javascript">
    gprsConfig.arrTtsTabs = [
        {code: 'setting', name: '设置播放文字', load: false},
        {code: 'current', name: '当前播放', load: false, isPaging: false, pageIndex: 1, pageSize: 10},
        {code: 'history', name: '历史记录', load: false, isPaging: true, pageIndex: 1, pageSize: 10},
        {code: 'devmemory', name: '设备存储', load: false, isPaging: false, pageIndex: 1, pageSize: 10}
    ];
    gprsConfig.ttsFormType = 'setting';
    gprsConfig.ttsMaxWordCount = 2000;
    //即时播放存储位号
    gprsConfig.ttsInstantPlayNo = 9;
    
    gprsConfig.initialTtsForm = function(){
        var strHtml = '<div id="ttsTabPanel" class="tabpanel" style="margin-left:-2px;">';
        for(var i=0; i<gprsConfig.arrTtsTabs.length; i++){
            var tab = gprsConfig.arrTtsTabs[i];
            strHtml += '<a class="' + (tab.code == gprsConfig.ttsFormType ? 'cur':'tab') + '" lang="' + tab.code + '" rel="#ttsFormBox_' + tab.code + '">'
                + '<span>' + tab.name + '</span>'
                + '</a>';
        }
        strHtml += '</div>';
        gprsConfig.frame.setFormPrompt(strHtml);
        
        cms.jquery.tabs('#ttsTabPanel', null, '.tts-form-box', 'gprsConfig.switchTtsTab');
        
        //设置表单一
        cms.util.fillNumberOptions(cms.util.$('ddlTtsMemoryNo'), 0, 8, 0, 1, null, null, 1);
        cms.util.fillOption(cms.util.$('ddlTtsMemoryNo'), '9', '即时播放');
        cms.util.$('ddlTtsMemoryNo').value = '9';
        
        cms.util.fillNumberOptions(cms.util.$('ddlTtsHour'), 0, 23, '', 1, 2, '0');
        cms.util.fillNumberOptions(cms.util.$('ddlTtsMinute'), 0, 59, '', 1, 2, '0');
        cms.util.fillNumberOptions(cms.util.$('ddlTtsReplayTime'), 1, 99, 1, 1);
        var txtTtsContent = cms.util.$('txtTtsContent');
        txtTtsContent.onchange = function(){gprsConfig.checkTtsWordLength();};
        txtTtsContent.onkeydown = function(){gprsConfig.checkTtsWordLength();};
        txtTtsContent.onkeyup = function(){gprsConfig.checkTtsWordLength();};
    };
    
    gprsConfig.switchTtsTab = function(param){
        var idx = gprsConfig.getTabsIndex(gprsConfig.arrTtsTabs, param.action);
        switch(param.action){
            case gprsConfig.arrTtsTabs[1].code:
                if(!gprsConfig.arrTtsTabs[idx].load){
                    $('#listTts').html('<table class="tblist" id="tbListTts" cellpadding="0" cellspacing="0"></table>');
                    $('#listTts').append('<div id="lblListTts" style="padding:5px 10px;"></div>');
                    gprsConfig.arrTtsTabs[idx].load = true;
                }
                gprsConfig.getTtsContent(param.action, 0);
                break;
            case gprsConfig.arrTtsTabs[2].code:
                if(!gprsConfig.arrTtsTabs[idx].load){
                    $('#listTtsHistory').html('<table class="tblist" id="tbListTtsHistory" cellpadding="0" cellspacing="0"></table>');
                    $('#listTtsHistory').append('<div id="lblListTtsHistory" style="padding:5px 10px;"></div>');
                    gprsConfig.arrTtsTabs[idx].load = true;
                }
                gprsConfig.getTtsContent(param.action, -1);
                break;
            case gprsConfig.arrTtsTabs[3].code:
                if(!gprsConfig.arrTtsTabs[idx].load){
                    $('#listTtsDevMemory').html('<table class="tblist" id="tbListTtsDevMemory" cellpadding="0" cellspacing="0"></table>');
                    $('#listTtsDevMemory').append('<div id="lblListTtsDevMemory" style="padding:5px 10px;"></div>');
                    gprsConfig.arrTtsTabs[idx].load = true;
                    //读取设备TTS存储
                    gprsConfig.readDevTtsMemory();
                }
                break;
                
        }
        gprsConfig.setFormBodySize();
    };
    
    gprsConfig.setFormBodySize = function(){
        var formSize = gprsConfig.frame.getFormSize();
        
        $('#listTts').height(formSize.height - 25);
        $('#listTtsHistory').height(formSize.height - 23 - 27);
        $('#listTtsDevMemory').height(formSize.height - 23 - 27);
    };
        
    gprsConfig.setTtsFormSelectControl = function(){
        var memoryNo = parseInt($('#ddlTtsMemoryNo').val().trim(), 10);
        if(gprsConfig.ttsInstantPlayNo == memoryNo){
            $('#ddlTtsHour').attr('disabled', true);
            $('#ddlTtsMinute').attr('disabled', true);
            $('#ddlTtsReplayTime').attr('disabled', true);
            $('#ddlTtsReplayTime').attr('value', 1);
            $('#ddlTtsMinute').attr('value', '');
            $('#ddlTtsHour').attr('value', '');
        } else {
            $('#ddlTtsHour').attr('disabled', false);
            $('#ddlTtsMinute').attr('disabled', false);
            $('#ddlTtsReplayTime').attr('disabled', false);
        }
    };
    
    gprsConfig.initialTts = function(){
        gprsConfig.initialTtsForm();
        gprsConfig.setTtsFormSelectControl();
    };    
    gprsConfig.initialTts();
    
    gprsConfig.checkTtsWordLength = function(){
        var c = gprsConfig.getTtsInputContent().len;
        var cc = gprsConfig.ttsMaxWordCount - c;
        var isOver = cc < 0;
        if(!isOver){
            $('#lblTtsWordCount').html( '还可以输入<span style="color:#00f;">' + (cc) + '</span>个字符。');
        } else {
            $('#lblTtsWordCount').html('已超出<span style="color:#f00;">' + (Math.abs(cc)) + '</span>个字符。');
        }
        return isOver;
    };
    
    gprsConfig.getTtsInputContent = function(){
        var isClear = $("#chbClearTtsSpace").attr('checked');
        var content = $('#txtTtsContent').val().trim();
        var arrContent = content.split('\n');
        var strContent = '';
        for(var i=0,c=arrContent.length; i<c; i++){
            if(arrContent[i].trim() != ''){
                var str = isClear ? arrContent[i].trim().replaceAll(' ','').replaceAll('　','') : arrContent[i].trim(); //清除空格
                strContent += str + '\n';
            }
        }
        //统计字数长度时先将 \n 转换成 空格
        //var strCopy = strContent.replaceAll('\n',' ').replaceAll(',','，').replaceAll('#',' ');
        var strCopy = strContent.replaceAll(',','，').replaceAll('#',' ');
        return {len: strCopy.trim().len(), content: strContent.trim()};
    };
        
    gprsConfig.setTtsContent = function(btn){
        var memoryNo = parseInt($('#ddlTtsMemoryNo').val().trim(), 10);
        var playTimes = parseInt($('#ddlTtsReplayTime').val().trim(), 10);
        var hour = $('#ddlTtsHour').val().trim();
        var minute = $('#ddlTtsMinute').val().trim();
        var ttsContent = gprsConfig.getTtsInputContent();
        var strContent = escape(ttsContent.content.replaceAll('\n',' ').replaceAll(',','，').replaceAll('#',' '));
        var urlparam = 'action=setTts';
        var strBoxHtml = '';
        
        if(memoryNo != 9 && (hour == '' || minute == '')){
            cms.box.msgAndFocus(hour == '' ? cms.util.$('ddlTtsHour') : cms.util.$('ddlTtsMinute'), {title:'提示信息', html:'请选择播放时间'});
            return false;
        } else if('' == strContent){
            cms.box.msgAndFocus(cms.util.$('txtTtsContent'), {title:'提示信息', html:'请输入TTS播放文字内容'});
            return false;
        } else if(gprsConfig.checkTtsWordLength()){
            cms.box.msgAndFocus(cms.util.$('txtTtsContent'), {title:'提示信息', html:'TTS播放文字内容长度应小于' + gprsConfig.ttsMaxWordCount + '个字符。'});
            return false;
        } else {
            var strTime = '';
            if(gprsConfig.ttsInstantPlayNo == memoryNo){
                strTime = '00:00:00';
            } else {
                strTime = hour + ':' + minute + ':00';
            }
            if('ALL' == strContent.toUpperCase() || 'ADL' == strContent.toUpperCase()){
                strContent = strContent.toUpperCase();
                strBoxHtml = '确定要删除设备()的' + ('ALL' == strContent ? '全部' : '第' + memory + '段位的') + 'TTS播放文字内容吗？';
            } else {
                strBoxHtml = '确定要设置TTS播放文字吗？'
            }
            urlparam += '&devCode=' + devInfo.devCode + '&setting=' + strContent + '&param=' + playTimes + '_' + strTime + '_' + memoryNo;
                        
            cms.box.confirm({
                title: 'TTS播放文字',
                html: strBoxHtml,
                callBack: gprsConfig.setTtsContentAction,
                returnValue: {
                    btn: btn, 
                    urlparam: urlparam,
                    setting: strContent
                }
            });
        }
    };
    
    gprsConfig.setTtsContentAction = function(pwobj, pwReturn, param){
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
            module.appendDebugInfo(module.getDebugTime() + '[setTts Request] urlparam: ' + urlparam);
            if(!gprsConfig.checkControlDisabled(btn)){
                return false;
            }
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.setTtsContentCallBack,
                param: {
                    btn: btn,
                    setting: strSetting
                }
            });
        }
    };
    
    gprsConfig.setTtsContentCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setTts Response] data: ' + data);
        gprsConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }        
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var n = 0;
        var strSetting = param.setting;
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var id = jsondata.list[i];
            if(strSetting == 'ALL'){
                gprsConfig.task.appendTaskList({id:id, action:'setTts', title:'删除全部TTS播放文字', result:'正在设置，请稍候...'});
            } else if(strSetting == 'ADL'){
                gprsConfig.task.appendTaskList({id:id, action:'setTts', title:'删除TTS播放文字', result:'正在设置，请稍候...'});
            } else {
                gprsConfig.task.appendTaskList({id:id, action:'setTts', title:'设置TTS播放文字', result:'正在设置，请稍候...'});
            }
        }
        
        gprsConfig.getTtsContent(gprsConfig.arrTtsTabs[1].code, 0);
        //gprsConfig.getTtsContent(gprsConfig.arrTtsTabs[2].code, -1);
    };
    
    /*获取TTS内容*/
    gprsConfig.getTtsContent = function(action, status){
        var urlparam = 'action=getTts&devCode=' + devInfo.devCode + '&status=' + status;        
        var idx = gprsConfig.getTabsIndex(gprsConfig.arrTtsTabs, action);
        if(gprsConfig.arrTtsTabs[idx].isPaging){
            urlparam += '&pageIndex=' + (gprsConfig.arrTtsTabs[idx].pageIndex - 1) + '&pageSize=' + gprsConfig.arrTtsTabs[idx].pageSize;
        }
        module.appendDebugInfo(module.getDebugTime() + '[getTts Request] urlparam: ' + urlparam);        
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.getTtsContentCallBack,
            param: {
                action: action,
                status: status
            }
        });
    };
    
    gprsConfig.getTtsContentCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[getTts Response] data: ' + data);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        gprsConfig.showTtsContent(param.action, param.status, jsondata);
    };
    
    gprsConfig.showTtsContent = function(action, status, jsondata){
        var objList = null;
        var dataCount = jsondata.dataCount;
        var idx = gprsConfig.getTabsIndex(gprsConfig.arrTtsTabs, action);
        
        if(gprsConfig.arrTtsTabs[1].code == action){
            objList = cms.util.$('tbListTts');
            $('#lblListTts').hide();
        } else {
            objList = cms.util.$('tbListTtsHistory');
            $('#lblListTtsHistory').hide();
        }        
        if(objList == null){
            return false;
        }
        cms.util.clearDataRow(objList, 0);
        if(jsondata.list.length > 0){
            for(var i=0,c=jsondata.list.length; i<c; i++){
                var dr = jsondata.list[i];
                var rid = (gprsConfig.arrTtsTabs[idx].isPaging ? (gprsConfig.arrTtsTabs[idx].pageIndex - 1 ) * gprsConfig.arrTtsTabs[idx].pageSize :  0) + (i + 1);
                var row = objList.insertRow(i);
                var rowData = [];
                var cellid = 0;
                
                var isInstantPlay = dr.memoryNo == gprsConfig.ttsInstantPlayNo;
                var strContent = '<input type="text" class="txt-label" id="txtTtsContent_' + dr.id + '" value="' + dr.memoryContent + '" title="' + dr.memoryContent + '" style="width:99%;" readonly="readonly" />';
                var strStatus = parseInt(dr.deleted, 10) == 1 ? '已删除' : gprsConfig.parseTtsStatus(parseInt(dr.status, 10));
                var strDetail = '<a onclick="gprsConfig.showTtsDetail(' + dr.id + ');"><span>详情</span></a>';
                var strOper = '<a style="width:25px;display:inline;" onclick="gprsConfig.copyTtsContent(' + dr.id + ',' + dr.memoryNo + ',\'' + dr.startTime + '\',' + dr.playTimes + ');"><span>复制</span></a>';
                if(0 == parseInt(dr.status, 10) && !isInstantPlay){
                    strOper += '<a style="width:25px;display:inline; margin-left:5px;color:#f00;" onclick="gprsConfig.deleteTtsContent(false,' + dr.memoryNo + ',' + dr.id + ');"><span>删除</span></a>';
                }
                
                rowData[cellid++] = {html: rid, style:[['width','30px']]};
                rowData[cellid++] = {html: isInstantPlay ? '-' : (parseInt(dr.memoryNo, 10) + 1), style:[['width','35px']]};
                rowData[cellid++] = {html: isInstantPlay ? '即时播放' : dr.startTime.substr(0, 5), style:[['width','55px']]};
                rowData[cellid++] = {html: dr.playTimes, style:[['width','55px']]};
                rowData[cellid++] = {html: strStatus, style:[['width','45px']]};
                rowData[cellid++] = {html: strContent, style:[['width','114px'],['padding','0 3px']]};
                rowData[cellid++] = {html: strDetail, style:[['width','30px']]};
                rowData[cellid++] = {html: dr.createTime, style:[['width','120px']]};
                rowData[cellid++] = {html: strOper, style:[['width','60px']]};
                rowData[cellid++] = {html: '', style:[]};
                
                cms.util.fillTable(row, rowData);
            }
        } else {
            if(gprsConfig.arrTtsTabs[1].code == action){
                $('#lblListTts').html('无当前播放的TTS文字');
                $('#lblListTts').show();
            } else {
                $('#lblListTtsHistory').html('无TTS文字播放历史记录');
                $('#lblListTtsHistory').show();
            } 
        }
        if(gprsConfig.arrTtsTabs[idx].isPaging){
            var config = {
                dataCount: dataCount,
                pageIndex: gprsConfig.arrTtsTabs[idx].pageIndex,
                pageSize: gprsConfig.arrTtsTabs[idx].pageSize,
                pageStart: 1,
                showType: 'nolist',
                markType: 'Symbol',
                callBack: 'gprsConfig.showPage',
                showDataStat: true,
                showPageCount: false,
                keyAble: true
            };
            var pager = new Pagination();
            pager.Show(config, cms.util.$('ttsPagination'));
            pageCount = pager.pageCount;
        }
    };
    
    gprsConfig.checkInstantPlayTime = function(strNow, strTime, timeout){
        try{
            var ts = strNow.toDate() - strTime.toDate();
            return ts / 1000;
        }catch(e){return -1;}
    };
    
    gprsConfig.parseTtsStatus = function(status){
        switch(status){
            case 0:
                return '可用';
                break;
            case 1:
                return '未开始';
                break;
            case 2:
                return '已覆盖';
                break;
            case 3:
                return '已过期';
                break;
        }
    };
    
    gprsConfig.showTtsDetail = function(id){      
        var strContent = $('#txtTtsContent_' + id).val();
        var strHtml = '<textarea style="position:absolute;top:25px;left:0;width:394px;height:210px;padding:0 3px;margin:0;border:none;font-size:12px;line-height:20px;font-family:宋体,Arial;">'
            + strContent
            + '</textarea>'
            + '<div class="statusbar" style="position:absolute;bottom:0;left:0;padding:0 5px;"><span id="lblTtsDetailLength"></span></div>';
        var config = {
            title: 'TTS播放文字内容',
            html: strHtml,
            width: 400,
            height: 260,
            noBottom: true
        };
        cms.box.win(config);
    };
    
    gprsConfig.showPage = function(page){
        gprsConfig.arrTtsTabs[2].pageIndex = parseInt(page, 10);
        gprsConfig.getTtsContent(gprsConfig.arrTtsTabs[2].code, -1);
    };
    
    /*删除TTS*/
    gprsConfig.deleteTtsContent = function(isAll, memoryNo, id){
        var strSetting = isAll ? 'ALL' : 'ADL';
        var urlparam = 'action=deleteTts&devCode=' + devInfo.devCode + '&setting=' + strSetting + '&memoryNo=' + (memoryNo || -1) + '&param=' + (id || -1);
        var strBoxHtml = '确定要删除' + (isAll ? '全部' : '') + 'TTS播放文字吗？';
        cms.box.confirm({
            title: '删除TTS播放文字',
            html: strBoxHtml,
            callBack: gprsConfig.deleteTtsContentAction,
            returnValue: {
                isAll: isAll, 
                urlparam: urlparam,
                setting: strSetting
            }
        });
    };
        
    gprsConfig.deleteTtsContentAction = function(pwobj, pwReturn, param){
        var strSetting = '';
        var urlparam = '';
        var isContinue = false;
        if(param != undefined){
            isContinue = true;
            strSetting = param.setting;
            urlparam = param.urlparam;        
        } else {
            if(pwReturn.dialogResult){
                isContinue = true;
                strSetting = pwReturn.returnValue.setting;
                urlparam = pwReturn.returnValue.urlparam;
            }
        }
        if(isContinue){
            module.appendDebugInfo(module.getDebugTime() + '[deleteTts Request] urlparam: ' + urlparam);  
            gprsConfig.ajaxRequest({
                data: urlparam,
                callBack: gprsConfig.deleteTtsContentCallBack,
                param: {
                    action: strSetting
                }
            });
        }
    };
    
    gprsConfig.deleteTtsContentCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[deleteTts Response] data: ' + data);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var id = jsondata.list[i];
            gprsConfig.task.appendTaskList({id:id, action:'deleteTts', title:'删除设备TTS播放文字', result:'正在删除，请稍候...'});
        }
        
        gprsConfig.getTtsContent(gprsConfig.arrTtsTabs[1].code, 0);
        gprsConfig.getTtsContent(gprsConfig.arrTtsTabs[2].code, -1);
    };
    
    /*复制TTS内容*/
    gprsConfig.copyTtsContent = function(id, memoryNo, startTime, playTimes){
        cms.box.confirm({
            title: '复制TTS播放文字',
            html: '确定要复制TTS播放文字吗？',
            callBack: gprsConfig.copyTtsContentAction,
            returnValue: {
                id: id, 
                memoryNo: memoryNo,
                startTime: startTime,
                playTimes: playTimes
            }
        });
    };
    
    gprsConfig.copyTtsContentAction = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var id = pwReturn.returnValue.id;
            var memoryNo = pwReturn.returnValue.memoryNo;
            var playTimes = pwReturn.returnValue.playTimes;
            var startTime = pwReturn.returnValue.startTime;
            var strContent = $('#txtTtsContent_' + id).val();
            
            $('#txtTtsContent').attr('value', strContent);
            $('#ddlTtsMemoryNo').attr('value', memoryNo);
            $('#ddlTtsReplayTime').attr('value', playTimes);
            if(parseInt(memoryNo, 10) == gprsConfig.ttsInstantPlayNo){
                $('#ddlTtsHour').attr('value', '');
                $('#ddlTtsMinute').attr('value', '');
                
                $('#ddlTtsHour').attr('disabled', true);
                $('#ddlTtsMinute').attr('disabled', true);
                $('#ddlTtsReplayTime').attr('disabled', true);
            } else {
                var arrTime = startTime.split(':');
                $('#ddlTtsHour').attr('value', arrTime[0]);
                $('#ddlTtsMinute').attr('value', arrTime[1]);
                
                $('#ddlTtsHour').attr('disabled', false);
                $('#ddlTtsMinute').attr('disabled', false);
                $('#ddlTtsReplayTime').attr('disabled', false);
            }
            $('#bodyPrompt a').eq(0).click();
        }
        pwobj.Hide();
    };
    
    /*读取TTS内容*/
    gprsConfig.readDevTtsMemory = function(btn){
        if(btn == undefined){
            btn = cms.util.$('btnRead');
        }
        var urlparam = 'action=readTts&devCode=' + devInfo.devCode;
        module.appendDebugInfo(module.getDebugTime() + '[readTts Request] urlparam: ' + urlparam);
        if(!gprsConfig.checkControlDisabled(btn)){
            return false;
        }
        gprsConfig.ajaxRequest({
            data: urlparam,
            callBack: gprsConfig.readDevTtsMemoryCallBack,
            param: {
                btn: btn
            }
        });
    };
    
    gprsConfig.readDevTtsMemoryCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readTts Response] data: ' + data);
        gprsConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }        
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        for(var i=0,c=jsondata.list.length; i<c; i++){
            var id = jsondata.list[i];
            gprsConfig.task.appendTaskList({id:id, action:'readTts', title:'读取设备TTS播放文字', result:'正在读取，请稍候...', callBack:'gprsConfig.showDevTtsMemory'});
        }
    };
    
    gprsConfig.showDevTtsMemory = function(strResult, bSuccess){
        if(bSuccess){
            var strContent = result;
            var arrTts = strContent.split(' ');
            var c = arrTts.length;
            var mc = c;
            var objList = cms.util.$('tbListTtsDevMemory');
            if(objList == null){
                return false;
            }
            cms.util.clearDataRow(objList, 0);
                    
            for(var i=0; i<c; i++){
                if(arrTts[i] == ''){
                    mc--;
                    continue;
                }
                var rid = (i + 1);
                var row = objList.insertRow(i);
                var rowData = [];
                var cellid = 0;
                
                var arrCon = arrTts[i].split(',');
                var strTime = arrCon[2].length == 4 ? arrCon[2].substr(0,2) + ':' + arrCon[2].substr(2,2) : arrCon[2];
                
                rowData[cellid++] = {html: rid, style:[['width','30px']]};
                rowData[cellid++] = {html: parseInt(arrCon[0], 10) + 1, style:[['width','35px']]}; //段位加1,因段位从0开始
                rowData[cellid++] = {html: strTime, style:[['width','55px']]};
                rowData[cellid++] = {html: parseInt(arrCon[1], 10), style:[['width','55px']]};
                rowData[cellid++] = {html: '', style:[]};
                
                cms.util.fillTable(row, rowData);
            }
            
            if(mc > 0){
                $('#lblListTtsDevMemory').hide();
            } else {
                $('#lblListTtsDevMemory').html('没有读取到设备上存储的TTS播放文字');
                $('#lblListTtsDevMemory').show();
            }
            $('#lblReadTtsDevMemory').html('设备TTS存储读取完成[' + new Date().toString('yyyy-MM-dd HH:mm:ss') + ']');
        } else {
            $('#lblListTtsDevMemory').html('读取失败');
            $('#lblListTtsDevMemory').show();        
        }
    };
</script>