<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设备信息</title>
</head>
<body>
    <div class="formbody" id="divFormContent">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">通道号：</td>
                <td style="width:180px;">
                    <select id="ddlChannelId" class="select" style="width:156px;"></select>
                </td>
                <td style="width:75px;">星期：</td>
                <td>
                    <select id="ddlWeekDay" class="select w150" style="width:156px;">
                        <option value="1">星期一</option>
                        <option value="2">星期二</option>
                        <option value="3">星期三</option>
                        <option value="4">星期四</option>
                        <option value="5">星期五</option>
                        <option value="6">星期六</option>
                        <option value="0">星期日</option>
                    </select>
                </td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" id="chbEnabled" /><span>启用设备录像</span></label>
        <hr style="margin:5px 0;clear:both;" />
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">录像过期时间：</td>
                <td colspan="3">
                    <input id="txtKeepDays" type="text" class="txt w150" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="3" /> 天</td>
            </tr>
            <tr>
                <td>预录时间：</td>
                <td style="width:180px;">
                    <select id="ddlPreTime" class="select w150"style="width:156px;">
                        <option value="0">不预录</option>
                        <option value="1">5秒</option>
                        <option value="2">10秒</option>
                        <option value="3">15秒</option>
                        <option value="4">20秒</option>
                        <option value="5">25秒</option>
                        <option value="6">30秒</option>
                        <option value="7">不受限制</option>
                    </select>
                </td>
                <td style="width:75px;">录像延时：</td>
                <td>
                    <select id="ddlDelayTime" class="select w150"style="width:156px;">
                        <option value="0">5秒</option>
                        <option value="1">10秒</option>
                        <option value="2">30秒</option>
                        <option value="3">1分</option>
                        <option value="4">2分</option>
                        <option value="5">5分</option>
                        <option value="6">10分</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>冗余录像：</td>
                <td>
                    <select id="ddlRedundancy" class="select w150"style="width:156px;">
                        <option value="1">是</option>
                        <option value="0" selected="selected">否</option>
                    </select>
                </td>
                <td>记录音频：</td>
                <td>
                    <select id="ddlRecordAudio" class="select w150"style="width:156px;">
                        <option value="1">是</option>
                        <option value="0" selected="selected">否</option>
                    </select>
                </td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;">
            <input type="radio" class="chb" checked="checked" id="rbAllDay" name="rbRecordType" value="0" onclick="setDeviceRecordControl(0);" /><span>全天录像</span>
        </label>
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">录像类型：</td>
                <td>
                    <select id="ddlRecordType" class="select w150" style="width:156px;"></select>
                </td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;">
            <input type="radio" class="chb" name="rbRecordType" value="1" onclick="setDeviceRecordControl(1);" /><span>按时间段录像</span>
        </label>
        <br />
        <table class="tbRecordTime tblist" cellpadding="0" cellspacing="0" id="tbRecordTime" style="width:545px;margin:5px 0 10px 0;">
            <tr class="trheader" style="height:24px;">
                <td style="width:50px;text-align:center;">时间段</td>
                <td style="width:150px;text-align:center;">开始时间</td>
                <td style="width:150px;text-align:center;">结束时间</td>
                <td>录像类型</td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <a class="btn btnc22" id="btnCopyWeek" style="float:right;" onclick="remoteConfig.showCopyToWeekDay('divWeekDayPanel','ddlWeekDay', this);" lang="['复制到星期','取消复制']"><span class="w75">复制到星期</span></a>
        <div id="divWeekDayPanel" style="margin:10px 0;overflow:hidden; clear:both;"></div>
        <hr style="margin:5px 0;" />
        <a class="btn btnc22" id="btnCopyChannel" style="float:right;" onclick="remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', this);" lang="['复制到通道','取消复制']"><span class="w75">复制到通道</span></a>
        <div id="divChannelPanel" style="margin:10px 0;overflow:hidden; clear:both;padding-bottom:20px;"></div>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readDeviceRecordPlan(this);"><span>读取设备录像计划</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setDeviceRecordPlan(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize();
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');
    
    cms.util.fillOptions(cms.util.$('ddlRecordType'), remoteConfig.arrRecordType, 0x0);
    
    remoteConfig.showCopyToWeekDay('divWeekDayPanel','ddlWeekDay', cms.util.$('btnCopyWeek'), true);
    remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', cms.util.$('btnCopyChannel'), true);

    $('#ddlChannelId').change(function(){
        remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', cms.util.$('btnCopyChannel'), true, true);
        if(remoteConfig.isAutoRead){
            remoteConfig.readDeviceRecordPlan(cms.util.$('btnRead'));
        }
    });
    
    $('#ddlWeekDay').change(function(){
        remoteConfig.showCopyToWeekDay('divWeekDayPanel','ddlWeekDay', cms.util.$('btnCopyWeek'), true, true);
        if(remoteConfig.isAutoRead){
            remoteConfig.readDeviceRecordPlan(cms.util.$('btnRead'));
        }
    });
    
    showRecordTime();
    setDeviceRecordControl(0);
    
    $(".tbRecordTime tr:not(:nth-child(1)) td").css('height','28px');
        
    function showRecordTime(){
        var objList = cms.util.$('tbRecordTime');
        cms.util.clearDataRow(objList, 1);
        var dc = 4;
        var rid = 1;
        
        for(var i = 0; i < dc; i++){
            var row = objList.insertRow(rid);
            
            rowData = buildRecordTime(row, rid);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
    }
    
    function buildRecordTime(row, rnum){
        var rowData = [];
        var cellid = 0;
        var strStart = '<select class="select w50" name="ddlRecordTime" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" name="ddlRecordTime" style="margin:0 5px 0 10px;">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        var strEnd = '<select class="select w50" name="ddlRecordTime" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" name="ddlRecordTime" style="margin:0 5px 0 10px">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        var strRecordType = '<select class="select" name="ddlRecordTimeType" style="width:180px;">' + cms.util.buildOptions(remoteConfig.arrRecordType, 0x0) + '</select>';
        
        rowData[cellid++] = {html: rnum, style:[['textAlign','center']]}; //序号
        rowData[cellid++] = {html: strStart, style:[['textAlign','center']]}; //开始时间
        rowData[cellid++] = {html: strEnd, style:[['textAlign','center']]}; //结束时间
        rowData[cellid++] = {html: strRecordType, style:[['textAlign','center']]}; //录像类型
        
        return rowData;
    }
    
    function setDeviceRecordControl(type){
        var arrType = cms.util.$N('ddlRecordTimeType');
        var arrTime = cms.util.$N('ddlRecordTime');
        if(0 == type){
            //全天录像
            $('#ddlRecordType').attr('disabled', false);
            for(var i=0,c=arrType.length; i<c; i++){
                arrType[i].disabled = true;
            }
            for(var i=0,c=arrTime.length; i<c; i++){
                arrTime[i].disabled = true;
            }
        } else {
            //按时间段录像
            $('#ddlRecordType').attr('disabled', true);
            for(var i=0,c=arrType.length; i<c; i++){
                arrType[i].disabled = false;
            }
            for(var i=0,c=arrTime.length; i<c; i++){
                arrTime[i].disabled = false;
            }
        }
    };
    
    remoteConfig.copyToChannel = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var chbName = pwReturn.returnValue.chbName;
        }
        pwobj.Hide();
    };
    
    remoteConfig.getDeviceRecordPlan = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceRecordPlan&devCode=' + strDevCode + '&field=device_record_plan';

        module.appendDebugInfo(module.getDebugTime() + '[getDeviceRecordPlan Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getDeviceRecordPlanCallBack
        });
    };
    
    remoteConfig.getDeviceRecordPlanCallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showDeviceRecordPlan(jsondata);
    };
    
    remoteConfig.showDeviceRecordPlan = function(jsondata){
        if(0 == jsondata.list.length) return false;
        var info = jsondata.list[0];
        
        if(info.channel_no != undefined){
            $('#ddlChannelId').attr('value', info.channel_no);
        }
        $('#chbEnabled').attr('checked', info.enabled == '1');
        $('#txtKeepDays').attr('value',info.keep_days);
        $('#ddlDelayTime').attr('value',info.delay_time);
        $('#ddlPreTime').attr('value',info.pre_time);
        $('#ddlRedundancy').attr('value',info.redundancy);
        $('#ddlRecordAudio').attr('value',info.audio_rec);
        
        remoteConfig.showDeviceRecordSpan(info.rec_time_span);
        
        cms.util.setRadioChecked('rbRecordType', info.rec_all_day == '1' ? '0' : '1'); 
        if('1' == info.rec_all_day){
            setDeviceRecordControl(0);
        } else {
            setDeviceRecordControl(1);
        }
        $('#ddlRecordType').attr('value', info.allday_rec_type);
    };
    
    remoteConfig.showDeviceRecordSpan = function(span){
        showRecordTime();
        if('' == span || undefined == span){
            return false;
        }
        if(!span.isJsonData()){
            return false;
        }
        var arr = eval('(' + span + ')');
        var arrType = cms.util.$N('ddlRecordTimeType');
        var arrTime = cms.util.$N('ddlRecordTime');
        var n = 0;
        var start = [];
        var end = [];
        for(var i=0,c=arr.length; i<c; i++){
            //如果HTML控件为null，表示返回结果中的内容列表数量超出
            if(arrType[i] == null){
                break;
            }
            arrType[i].value = arr[i][0];
            start = arr[i][1].split(':');
            end = arr[i][2].split(':');
            n = i*4;
            arrTime[n].value = start[0];
            arrTime[n+1].value = start[1];
            arrTime[n+2].value = end[0];
            arrTime[n+3].value = end[1];
        }
    };
    
    //remoteConfig.getDeviceRecordPlan();
    
    remoteConfig.readDeviceRecordPlan = function(btn){
        var strDevCode = devInfo.devCode;
        var channelNo = $('#ddlChannelId').val().trim();
        var week = $('#ddlWeekDay').val().trim();
        var urlparam = 'action=getDeviceRecordPlan&devCode=' + strDevCode + '&setting=' + channelNo + ',' + week;
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readDeviceRecordPlan Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readDeviceRecordPlanCallBack,
            param: {
                btn: btn,
                title: '通道' + channelNo + ' ' + remoteConfig.parseWeekDay(week)
            }
        });
    };
    
    remoteConfig.readDeviceRecordPlanCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readDeviceRecordPlan Response] data: ' + data);
        remoteConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var id = jsondata.list[0];
        remoteConfig.task.appendTaskList({id:id, action:'readDeviceRecordPlan', title:'读取设备录像计划：' + param.title, result:'正在读取，请稍候...', callBack:'remoteConfig.showDeviceRecordResult'});
    };
    
    remoteConfig.showDeviceRecordResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + escape(strResult) + '&field=device_record_plan';

        module.appendDebugInfo(module.getDebugTime() + '[parseDeviceRecordPlan Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getDeviceRecordPlanCallBack
        });
    };
    
    remoteConfig.getDeviceRecordPlanInput = function(){
        var arrType = cms.util.$N('ddlRecordTimeType');
        var arrTime = cms.util.$N('ddlRecordTime');
        var recTimeSpan = '';
        var n = 0;
        var arrRange = [];
        for(var i=0,c=arrType.length; i<c; i++){
            n = i*4;
            if(i > 0){
                recTimeSpan += '|';
            }
            recTimeSpan += arrType[i].value.trim();
            recTimeSpan += ',' + arrTime[n].value.trim() + ':' + arrTime[n+1].value.trim();
            recTimeSpan += ',' + arrTime[n+2].value.trim() + ':' + arrTime[n+3].value.trim();
            
            var start = parseInt(arrTime[n].value.trim(),10)*60 + parseInt(arrTime[n+1].value.trim(), 10);
            var end = parseInt(arrTime[n+2].value.trim(),10)*60 + parseInt(arrTime[n+3].value.trim(), 10);
            if(0 == start && 0 == end){
                continue;
            }
            else if(start >= end && start > 0){
                cms.box.msgAndFocus(arrTime[n], {title:'提示',html:'开始时间必须小于结束时间'});
                return false;
            } else {
                //检测各组时间是否有交叉
                for(var j=0,t=arrRange.length; j<t; j++){
                    if((start >= arrRange[j][1] && start <= arrRange[j][2]) || (end >= arrRange[j][1] && end <= arrRange[j][2])){
                        cms.box.msgAndFocus(arrTime[n], {title:'提示',html:'第' + (i+1) + '组时间与第' + arrRange[j][0] + '组时间交叉重复'});
                        return false;
                    }
                }
            }
            arrRange.push([(i+1), start, end]);
        }
        return recTimeSpan;
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readDeviceRecordPlan(cms.util.$('btnRead'));
    }
        
    remoteConfig.setDeviceRecordPlan = function(btn){
        var strChannel = cms.util.getCheckBoxCheckedValue('chbChannelCopy');
        var strWeek = cms.util.getCheckBoxCheckedValue('chbWeekDayCopy');
        
        var isChannelCopy = '' != strChannel && strChannel.split(',').length > 1;
        var isWeekCopy = '' != strWeek && strWeek.split(',').length > 1;
        var arrChannel = isChannelCopy ? strChannel.split(',') : [$('#ddlChannelId').val()];
        var arrWeek = isWeekCopy ? strWeek.split(',') : [$('#ddlWeekDay').val()];
        
        var recTimeSpan = remoteConfig.getDeviceRecordPlanInput();
        if(!recTimeSpan){
            return false;
        }
        
        for(var m=0; m<arrChannel.length; m++){
            var channelNo = arrChannel[m];
            for(var n=0; n<arrWeek.length; n++){
                var week = arrWeek[n];
                var strNodeList = '';

                var arrNode = [
                    ['channel', channelNo],
                    ['week', week],
                    ['enable', $('#chbEnabled').attr("checked") ? '1' : '0'],
                    ['keep_days', $('#txtKeepDays').val()],
                    ['pre_time', $('#ddlPreTime').val()],
                    ['delay_time', $('#ddlDelayTime').val()],
                    ['redundancy', $('#ddlRedundancy').val()],
                    ['audio_rec', $('#ddlRecordAudio').val()],
                    ['rec_allday', $('#rbAllDay').attr("checked") ? '1' : '0'],
                    ['allday_rectype', $('#ddlRecordType').val()],
                    ['rec_time_span', recTimeSpan]
                ];
                
                for(var i=0; i<arrNode.length; i++){
                    strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
                }
                var strXml = remoteConfig.buildXml(strNodeList);
                
                var strDevCode = devInfo.devCode;
                var urlparam = 'action=setDeviceRecordPlan&devCode=' + strDevCode + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml) + '&param=';
                if(!remoteConfig.checkControlDisabled(btn)){
                    if(!isChannelCopy && !isWeekCopy){
                        return false;
                    }
                }
                module.appendDebugInfo(module.getDebugTime() + '[setDeviceRecordPlan Request] param: ' + urlparam);
                remoteConfig.ajaxRequest({
                    url: remoteConfig.setRemoteConfigUrl,
                    data: urlparam,
                    callBack: remoteConfig.setDeviceRecordPlanCallBack,
                    param: {
                        btn: btn,
                        title: '通道' + channelNo + ' ' + remoteConfig.parseWeekDay(week)
                    }
                });  
            }
        }      
    };
    
    remoteConfig.setDeviceRecordPlanCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setDeviceRecordPlan Response] data: ' + data);
        remoteConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        var id = jsondata.list[0];
        remoteConfig.task.appendTaskList({id:id, action:'setDeviceRecordPlan', title:'设置设备录像计划：' + param.title, result:'正在设置，请稍候...', callBack:''});
    };
</script>