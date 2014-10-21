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
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" id="chbEnabled" /><span>启用中心录像</span></label>
        <hr style="margin-top:5px;clear:both;" />
        <label class="chb-label-nobg" style="float:left;">
            <input type="radio" class="chb" checked="checked" id="rbAllDay" name="rbRecordTimeType" value="0" onclick="setDeviceRecordControl(0);" /><span>全天录像</span>
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
            <input type="radio" class="chb" name="rbRecordTimeType" value="1" onclick="setDeviceRecordControl(1);" /><span>按时间段录像</span>
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
    <input id="txtOldRecordTimePlan" type="hidden" />
    <input id="txtOldWeekdayCopy" type="hidden" />
    <input id="txtOldChannelCopy" type="hidden" />
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.getStoreRecordPlan(this);"><span>读取中心录像计划</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setStoreRecordPlan(this);"><span class="w50">保存</span></a>
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
        remoteConfig.getStoreRecordPlan();
    });
    
    $('#ddlWeekDay').change(function(){        
        remoteConfig.showCopyToWeekDay('divWeekDayPanel','ddlWeekDay', cms.util.$('btnCopyWeek'), true, true);
        remoteConfig.getStoreRecordPlan();
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
    
    remoteConfig.getStoreRecordPlan = function(){
        var strDevCode = devInfo.devCode;
        var channelNo = $('#ddlChannelId').val().trim();
        var urlparam = 'action=getStoreRecordPlan&devCode=' + strDevCode + '&channelNo=' + channelNo;

        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.getStoreRecordPlanCallBack
        });
    };
    
    remoteConfig.getStoreRecordPlanCallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showStoreRecordPlan(jsondata);
    };
    
    remoteConfig.showStoreRecordPlan = function(jsondata){
        if(jsondata.recordPlan == undefined) return false;
        var info = jsondata.recordPlan;
        
        if(info.channel_no != undefined){
            $('#ddlChannelId').attr('value', jsondata.channelNo);
        }
                
        remoteConfig.showStoreRecordSpan(info.timeConfig);

        $('#txtOldRecordTimePlan').attr('value', info.timeConfig);
        if(info.weekdayCopy != undefined){
            $('#txtOldWeekdayCopy').attr('value', info.weekdayCopy);
        }
        if(info.channelCopy != undefined){
            $('#txtOldChannelCopy').attr('value', info.channelCopy);
        }
    };
    
    remoteConfig.showStoreRecordSpan = function(span){
        if('' == span || undefined == span){
            return false;
        }
        var arrSpan = span.split(';');
        var curDay = parseInt($('#ddlWeekDay').val().trim(), 10);
        var curTimeConfig = arrSpan[curDay];
        
        var arr = curTimeConfig.split('|');
        var arrType = cms.util.$N('ddlRecordTimeType');
        var arrTime = cms.util.$N('ddlRecordTime');
        var n = 0;
        var start = [];
        var end = [];
        for(var i=0,c=arr.length; i<c-1; i++){
            //如果HTML控件为null，表示返回结果中的内容列表数量超出
            if(arrType[i] == null){
                break;
            }
            var temp = arr[i].split(',');
            
            start = temp[0].split('-')[0].split(':');
            end = temp[0].split('-')[1].split(':');
            n = i*4;
            arrTime[n].value = start[0];
            arrTime[n+1].value = start[1];
            arrTime[n+2].value = end[0];
            arrTime[n+3].value = end[1];
            arrType[i].value = temp[1];
        }
        if(arr.length == 5){
            var arrConfig = arr[4].split(',');
            var enabled = parseInt(arrConfig[0], 10);
            var timeType = parseInt(arrConfig[1], 10);
            var recordType = arrConfig[2];
            
            $('#chbEnabled').attr('checked', enabled == 1);
            cms.util.setRadioChecked('rbRecordTimeType', timeType);
            $('#ddlRecordType').attr('value', recordType);
            
            setDeviceRecordControl(timeType);
        }
    };
    
    remoteConfig.getStoreRecordPlan();
        
    remoteConfig.getStoreRecordPlanInput = function(){
        var timeType = parseInt(cms.util.getRadioCheckedValue('rbRecordTimeType', '0'), 10);
        
        var arrType = cms.util.$N('ddlRecordTimeType');
        var arrTime = cms.util.$N('ddlRecordTime');
        var recTimeSpan = '';
        var n = 0;
        if(timeType == 0){
            recTimeSpan += '00:00-23:59,0|00:00-00:00,0|00:00-00:00,0|00:00-00:00,0';
        } else {
            for(var i=0,c=arrType.length; i<c; i++){
                n = i*4;
                if(i > 0){
                    recTimeSpan += '|';
                }
                recTimeSpan += arrTime[n].value.trim() + ':' + arrTime[n+1].value.trim();
                recTimeSpan += '-' + arrTime[n+2].value.trim() + ':' + arrTime[n+3].value.trim();
                recTimeSpan += ',' + arrType[i].value.trim();
            }
        }
        return recTimeSpan;
    };
    
    remoteConfig.buildRecordPlan = function(recTimePlan, curDay, weekdayCopy, enabled, timeType, recordType){
        var strPlan = '';
        var strOldRecTimePlan = $('#txtOldRecordTimePlan').val().trim();
        var arr = strOldRecTimePlan.split(';');
        var strType = '%s,%s,%s'.format([enabled, timeType, recordType], '%s');
        var strNone = '00:00-00:00,0|00:00-00:00,0|00:00-00:00,0|00:00-00:00,0|' + strType;
        recTimePlan = recTimePlan + '|' + strType;
        
        if(!enabled){
            if(arr.length > 1){
                for(var i=0; i<arr.length; i++){
                    if(i > 0){
                        strPlan += ';';
                    }
                    strPlan += strNone;
                }
            } else {
                for(var i=0; i<=6; i++){
                    if(i > 0){
                        strPlan += ';';
                    }
                    strPlan += strNone;
                }
            }
        
            return strPlan;
        }
        if(arr.length > 1){
            for(var i=0; i<arr.length; i++){
                if(i > 0){
                    strPlan += ';';
                }
                if(i != curDay && weekdayCopy.indexOf(''+i) < 0){
                    strPlan += arr[i];
                } else {
                    strPlan += recTimePlan;
                }
            }
        } else {
            for(var i=0; i<=6; i++){
                if(i > 0){
                    strPlan += ';';
                }
                if(i != curDay && weekdayCopy.indexOf(''+i) < 0){
                    strPlan += strNone;
                } else {
                    strPlan += recTimePlan;
                }
            }
        }
        return strPlan;
    };
    
    remoteConfig.setStoreRecordPlan = function(btn){
        var strNodeList = '';
        var recTimePlan = remoteConfig.getStoreRecordPlanInput();
        //var channelCopy = $('#txtOldChannelCopy').val().trim();
        //var weekdayCopy = $('#txtOldWeekdayCopy').val().trim();
        var enabled = $('#chbEnabled').attr("checked") ? 1 : 0;
        var channelNo = $('#ddlChannelId').val();
        var curDay = parseInt($('#ddlWeekDay').val().trim(), 10);
        var timeType = cms.util.getRadioCheckedValue('rbRecordTimeType', 0);
        var recordType = $('#ddlRecordType').val().trim();
        var channelCopy = cms.util.getCheckBoxCheckedValue('chbChannelCopy',',');
        var weekdayCopy = cms.util.getCheckBoxCheckedValue('chbWeekDayCopy',',');
        
        if('' == channelCopy){
            channelCopy = channelNo;
        }
        if('' == weekdayCopy){
            weekdayCopy = '' + curDay;
        }
        var strRecordTimePlan = remoteConfig.buildRecordPlan(recTimePlan, curDay, weekdayCopy, enabled, timeType, recordType);
                
        var arrNode = [
            ['deviceId', devInfo.devId],
            ['weekdayCopy', weekdayCopy],
            ['channelCopy', channelCopy],
            ['timeConfig', strRecordTimePlan]
        ];
        
        for(var i=0; i<arrNode.length; i++){
            strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
        }
        var strXml = remoteConfig.buildXml(strNodeList);
        
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=setStoreRecordPlan&devCode=' + strDevCode + '&channelNo=' + channelNo + '&setting=' + (remoteConfig.isEscapeXml ? escape(strXml) : strXml) + '&param=';
        
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[setStoreRecordPlan Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.setStoreRecordPlanCallBack,
            param: {
                btn: btn
            }
        });
        
    };
    
    remoteConfig.setStoreRecordPlanCallBack = function(data, param){
        remoteConfig.setControlDisabledByTiming(param.btn, false);
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        } else {
            var strHtml = '中心录像计划设置成功<br />%s'.format(
                jsondata.msg, '%s'
            );
            cms.box.alert({
                title: '提示',
                html: strHtml,
                infoType: 'success'
            });
        }  
    };
    
</script>