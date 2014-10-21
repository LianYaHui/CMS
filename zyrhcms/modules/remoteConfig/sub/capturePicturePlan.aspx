<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设备抓图计划</title>
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
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" id="chbEnabled" /><span>启用抓图</span></label>
        <hr style="margin:5px 0;clear:both;" />
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">存储/上传方式：</td>
                <td colspan="3">
                    <select id="ddlSaveTo" class="select w150">
                        <option value="1">只上传中心</option>
                        <option value="2">只存储在本地</option>
                        <option value="3">上传中心&amp;存储在本地</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>连拍次数：</td>
                <td style="width:180px;">
                    <select id="ddlCaptureFrequency" class="select w150">
                        <option value="1">1次</option>
                        <option value="2">2次</option>
                        <option value="3">3次</option>
                        <option value="4">4次</option>
                        <option value="5">5次</option>
                    </select>
                </td>
                <td style="width:75px;">抓拍间隔：</td>
                <td>
                    <select class="select w45" id="ddlCaptureIntervalTimeH" style="margin-right:2px;"></select>时
                    <select class="select w45" id="ddlCaptureIntervalTimeM" style="margin-right:2px;"></select>分
                    <select class="select w45" id="ddlCaptureIntervalTimeS" style="margin-right:2px;"></select>秒
                </td>
            </tr>
            <tr>
                <td>抓图分辨率：</td>
                <td>
                    <select id="ddlPictureResolution" class="select w150">
                        <option value="1">QCIF (176*144)</option>
					    <option value="2">CIF (352*288)</option>
					    <option value="3">2CIF (704*288)</option>
					    <option value="4">DCIF (528*384)</option>
					    <option value="5">4CIF (704*576)</option>
					    <option value="6">D1 (720*576)</option>
					    <option value="7">WD1 (960*576)</option>
					    
					    <option value="20">QVGA (320*240)</option>
					    <option value="21">VGA (640*480)</option>
					    <option value="22">SVGA (800*600)</option>
					    <option value="23">XVGA (1024*768)</option>
					    <option value="24">UXGA (1200*1600)</option>
					    
					    <option value="41">720P (720*1280)</option>
					    <option value="42">960P (960*1280)</option>
					    <option value="43">1080P (1080*1920)</option>
					    
					    <option value="44">250W (1280*1920)</option>
					    <option value="45">300W (2048*1536)</option>
					    <option value="46">500W (1920*2560)</option>
					    <option value="47">800W (3200*2400)</option>
					    <option value="48">1000W (2048*1536)</option>
                    </select>
                </td>
                <td>抓图质量：</td>
                <td>
                    <select id="ddlPictureQuality" class="select w150">
                        <option value="0">最高</option>
					    <option value="1">较高</option>
					    <option value="2">中等</option>
					    <option value="3">低</option>
					    <option value="4">较低</option>
					    <option value="5">最低</option>
                    </select>                
                </td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;">
            <input type="radio" class="chb" checked="checked" name="rbCaptureType" value="2" onclick="setDeviceCaptureControl(2);" /><span>全天抓拍</span>
        </label>
        <br />
        <label class="chb-label-nobg" style="float:left;">
            <input type="radio" class="chb" name="rbCaptureType" value="0" onclick="setDeviceCaptureControl(0);" /><span>定时间点抓拍</span>
        </label>
        <br />
        <table class="tbCaptureTime tblist" cellpadding="0" cellspacing="0" id="tbCaptureTimePoint" style="width:490px;margin:5px 0 10px 0;">
            <tr class="trheader" style="height:24px;">
                <td style="width:50px;text-align:center;">时间点</td>
                <td style="width:165px;text-align:center;">抓拍时间</td>
                <td style="width:50px;text-align:center;">时间点</td>
                <td style="width:165px;text-align:center;">抓拍时间</td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;">
            <input type="radio" class="chb" name="rbCaptureType" value="1" onclick="setDeviceCaptureControl(1);" /><span>定时间段抓拍</span>
        </label>
        <br />
        <table class="tbCaptureTime tblist" cellpadding="0" cellspacing="0" id="tbCaptureTime" style="width:490px;margin:5px 0 10px 0;">
            <tr class="trheader" style="height:24px;">
                <td style="width:50px;text-align:center;">时间段</td>
                <td style="width:165px;text-align:center;">开始时间</td>
                <td style="width:165px;text-align:center;">结束时间</td>
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
        <a class="btn btnc24" id="btnRead" onclick="remoteConfig.readDeviceCapturePlan(this);"><span>读取设备抓图计划</span></a>
        <a class="btn btnc24" id="btnSet" onclick="remoteConfig.setDeviceCapturePlan(this);"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize();
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');

    cms.util.fillNumberOptions(cms.util.$('ddlCaptureIntervalTimeH'), 0, 23, '00', 1, 2, '0');
    cms.util.fillNumberOptions(cms.util.$('ddlCaptureIntervalTimeM'), 0, 59, '00', 1, 2, '0');
    cms.util.fillNumberOptions(cms.util.$('ddlCaptureIntervalTimeS'), 0, 59, '05', 1, 2, '0');
    
    remoteConfig.showCopyToWeekDay('divWeekDayPanel','ddlWeekDay', cms.util.$('btnCopyWeek'), true);
    remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', cms.util.$('btnCopyChannel'), true);
    
    cms.util.$('ddlChannelId').onchange = function(){
        remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', cms.util.$('btnCopyChannel'), true, true);
        if(remoteConfig.isAutoRead){
            remoteConfig.readDeviceCapturePlan(cms.util.$('btnRead'));
        }
    };
    
    cms.util.$('ddlWeekDay').onchange = function(){
        remoteConfig.showCopyToWeekDay('divWeekDayPanel','ddlWeekDay', cms.util.$('btnCopyWeek'), true, true);
        if(remoteConfig.isAutoRead){
            remoteConfig.readDeviceCapturePlan(cms.util.$('btnRead'));
        }
    };
    
    showCaptureTime('point');
    showCaptureTime();
    setDeviceCaptureControl(2);
    
    $(".tbCaptureTime tr:not(:nth-child(1)) td").css('height','28px');
    
    function showCaptureTime(type){
        if('point' == type){
            var objList = cms.util.$('tbCaptureTimePoint');
            cms.util.clearDataRow(objList, 1);
            var dc = 8;
            var rid = 1;
            
            for(var i = 0; i < dc/2; i++){
                var row = objList.insertRow(rid);
                
                rowData = buildCaptureTimePoint(row, rid + i);
                
                cms.util.fillTable(row, rowData);
                
                rid++;
            }
        } else {
            var objList = cms.util.$('tbCaptureTime');
            cms.util.clearDataRow(objList, 1);
            var dc = 4;
            var rid = 1;
            
            for(var i = 0; i < dc; i++){
                var row = objList.insertRow(rid);
                
                rowData = buildCaptureTime(row, rid);
                
                cms.util.fillTable(row, rowData);
                rid++;
            }
        }
    }
    
    function buildCaptureTimePoint(row, rnum){
        var rowData = [];
        var cellid = 0;
        var strStart = '<select class="select w50" name="ddlCaptureTimePoint" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" name="ddlCaptureTimePoint" style="margin:0 5px 0 10px;">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        
        rowData[cellid++] = {html: rnum, style:[['textAlign','center']]}; //序号
        rowData[cellid++] = {html: strStart, style:[['textAlign','center']]}; //抓拍时间
        
        rowData[cellid++] = {html: rnum + 1, style:[['textAlign','center']]}; //序号
        rowData[cellid++] = {html: strStart, style:[['textAlign','center']]}; //抓拍时间
        
        return rowData;
    }
    
    function buildCaptureTime(row, rnum){
        var rowData = [];
        var cellid = 0;
        var strStart = '<select class="select w50" name="ddlCaptureTime" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" name="ddlCaptureTime" style="margin:0 5px 0 10px;">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        var strEnd = '<select class="select w50" name="ddlCaptureTime" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" name="ddlCaptureTime" style="margin:0 5px 0 10px">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        
        rowData[cellid++] = {html: rnum, style:[['textAlign','center']]}; //序号
        rowData[cellid++] = {html: strStart, style:[['textAlign','center']]}; //开始时间
        rowData[cellid++] = {html: strEnd, style:[['textAlign','center']]}; //结束时间
        
        return rowData;
    }
    
    function setDeviceCaptureControl(type){
        var arrTimePoint = cms.util.$N('ddlCaptureTimePoint');
        var arrTime = cms.util.$N('ddlCaptureTime');
        if(2 == type){
            //全天抓拍
            for(var i=0,c=arrTimePoint.length; i<c; i++){
                arrTimePoint[i].disabled = true;
            }
            for(var i=0,c=arrTime.length; i<c; i++){
                arrTime[i].disabled = true;
            }
        } else if(0 == type){
            //按时间点抓拍
            for(var i=0,c=arrTimePoint.length; i<c; i++){
                arrTimePoint[i].disabled = false;
            }
            for(var i=0,c=arrTime.length; i<c; i++){
                arrTime[i].disabled = true;
            }
        } else {
            //按时间段抓拍
            for(var i=0,c=arrTimePoint.length; i<c; i++){
                arrTimePoint[i].disabled = true;
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
    
    
    remoteConfig.getDeviceCapturePlan = function(){
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=getDeviceCapturePlan&devCode=' + strDevCode + '&field=device_capture_plan';

        module.appendDebugInfo(module.getDebugTime() + '[getDeviceCapturePlan Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getDeviceCapturePlanCallBack
        });
    };
    
    remoteConfig.getDeviceCapturePlanCallBack = function(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();//eval('(' + data + ')');
        if(jsondata.result != 1 || jsondata.list == undefined){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        remoteConfig.showDeviceCapturePlan(jsondata);
    };
    
    remoteConfig.showDeviceCapturePlan = function(jsondata){
        if(0 == jsondata.list.length) return false;
        var info = jsondata.list[0];
        
        if(info.channel_no != undefined){
            $('#ddlChannelId').attr('value', info.channel_no);
        }
        $('#chbEnabled').attr('checked', info.enabled == '1');
        $('#ddlSaveTo').attr('value', info.send_to);
        $('#ddlCaptureFrequency').attr('value',info.frequency);
        var interval = parseInt(info.interval, 10);
        
        if(interval < 60){
            $('#ddlCaptureIntervalTimeH').attr('value', '00');
            $('#ddlCaptureIntervalTimeM').attr('value', '00');
            $('#ddlCaptureIntervalTimeS').attr('value', ('' + interval).padLeft(2, '0'));
        } else if(interval >= 60 && interval < 3600){
            $('#ddlCaptureIntervalTimeH').attr('value', '00');
            $('#ddlCaptureIntervalTimeM').attr('value', ('' + parseInt(interval/60, 10)).padLeft(2, '0'));
            $('#ddlCaptureIntervalTimeS').attr('value', ('' + interval%60).padLeft(2, '0'));
        } else if(interval >= 3600){
            $('#ddlCaptureIntervalTimeH').attr('value', ('' + parseInt(interval/3600, 10)).padLeft(2, '0'));
            $('#ddlCaptureIntervalTimeM').attr('value', ('' + parseInt(interval%3600/60, 10)).padLeft(2, '0'));
            $('#ddlCaptureIntervalTimeS').attr('value', ('' + interval%60).padLeft(2, '0'));        
        } else if(interval < 0 || interval >= 86400){
            $('#ddlCaptureIntervalTimeH').attr('value', '00');
            $('#ddlCaptureIntervalTimeM').attr('value', '00');
            $('#ddlCaptureIntervalTimeS').attr('value', '00');        
        }
        
        $('#ddlPictureResolution').attr('value',info.resolution);
        $('#ddlPictureQuality').attr('value',info.pic_quality);
        
        cms.util.setRadioChecked('rbCaptureType', info.capture_type);
        
        remoteConfig.showDeviceCaptureSpan(info.point_list, 'point');
        remoteConfig.showDeviceCaptureSpan(info.span_list);
        
        setDeviceCaptureControl(parseInt(info.capture_type, 10));
    };
    
    remoteConfig.showDeviceCaptureSpan = function(span, type){
        if('point' == type){
            showCaptureTime('point');
        } else {
            showCaptureTime();
        }
        if('' == span || undefined == span){
            return false;
        }
        if(!span.isJsonData()){
            return false;
        }
        var arr = eval('(' + span + ')');
        var time = [];
        var start = [];
        var end = [];
        var n = 0;
        if('point' == type){
            var arrTimePoint = cms.util.$N('ddlCaptureTimePoint');
            for(var i=0,c=arr.length; i<c; i++){
                time = arr[i].split(':');
                n = i*2;
                arrTimePoint[n].value = time[0];
                arrTimePoint[n+1].value = time[1];
            }
        } else {
            var arrTime = cms.util.$N('ddlCaptureTime');
            for(var i=0,c=arr.length; i<c; i++){
                start = arr[i][0].split(':');
                end = arr[i][1].split(':');
                n = i*4;
                arrTime[n].value = start[0];
                arrTime[n+1].value = start[1];
                arrTime[n+2].value = end[0];
                arrTime[n+3].value = end[1];
            }        
        }
    };
    
    //remoteConfig.getDeviceCapturePlan();
    
    remoteConfig.readDeviceCapturePlan = function(btn){
        var strDevCode = devInfo.devCode;
        var channelNo = $('#ddlChannelId').val().trim();
        var week = $('#ddlWeekDay').val().trim();
        var urlparam = 'action=getDeviceCapturePlan&devCode=' + strDevCode + '&setting=' + channelNo + ',' + week;
        if(!remoteConfig.checkControlDisabled(btn)){
            return false;
        }
        module.appendDebugInfo(module.getDebugTime() + '[readDeviceCapturePlan Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            data: urlparam,
            callBack: remoteConfig.readDeviceCapturePlanCallBack,
            param: {
                btn: btn,
                title: '通道' + channelNo + ' ' + remoteConfig.parseWeekDay(week)
            }
        });
    };
    
    remoteConfig.readDeviceCapturePlanCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[readDeviceCapturePlan Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'readDeviceCapturePlan', title:'读取设备抓图计划：' + param.title, result:'正在读取，请稍候...', callBack:'remoteConfig.showDeviceCaptureResult'});
    };
    
    remoteConfig.showDeviceCaptureResult = function(strResult, bSuccess){
        if(!strResult.isXmlDom()){return false;}
        var strDevCode = devInfo.devCode;
        var urlparam = 'action=parseXmlProtocol&xml=' + escape(strResult) + '&field=device_capture_plan';

        module.appendDebugInfo(module.getDebugTime() + '[parseDeviceCapturePlan Request] param: ' + urlparam);
        remoteConfig.ajaxRequest({
            url: remoteConfig.getRemoteConfigUrl,
            data: urlparam,
            callBack: remoteConfig.getDeviceCapturePlanCallBack
        });
    };

    remoteConfig.getDeviceCapturePlanInput = function(type){
        var captureTimeSpan = '';
        var n = 0;
        var arrRange = [];
        if('point' == type){
            var arrTimePoint = cms.util.$N('ddlCaptureTimePoint');
            for(var i=0,c=arrTimePoint.length/2; i<c; i++){
                n = i*2;
                if(i > 0){
                    captureTimeSpan += '|';
                }
                captureTimeSpan += arrTimePoint[n].value.trim() + ':' + arrTimePoint[n+1].value.trim();
                
                var time = parseInt(arrTimePoint[n].value.trim(),10)*60 + parseInt(arrTimePoint[n+1].value.trim(), 10);
                if(0 == time){
                    continue;
                }else {
                    //检测各组时间是否有交叉
                    for(var j=0,t=arrRange.length; j<t; j++){
                        if(time == arrRange[j][1]){
                            cms.box.msgAndFocus(arrTimePoint[n], {title:'提示',html:'第' + (i+1) + '组时间与第' + arrRange[j][0] + '组时间交叉重复'});
                            return false;
                        }
                    }
                }
                arrRange.push([(i+1), time]);
            }
        } else {
            var arrTime = cms.util.$N('ddlCaptureTime');
            for(var i=0,c=arrTime.length/4; i<c; i++){
                n = i*4;
                if(i > 0){
                    captureTimeSpan += '|';
                }
                captureTimeSpan += arrTime[n].value.trim() + ':' + arrTime[n+1].value.trim();
                captureTimeSpan += ',' + arrTime[n+2].value.trim() + ':' + arrTime[n+3].value.trim();
                
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
        }
        return captureTimeSpan;
    };
    
    remoteConfig.getCaptureInterval = function(){
        var h = parseInt($('#ddlCaptureIntervalTimeH').val(), 10);
        var m = parseInt($('#ddlCaptureIntervalTimeM').val(), 10);
        var s = parseInt($('#ddlCaptureIntervalTimeS').val(), 10);
        
        return h*3600 + m*60 + s;
    };
    
    if(remoteConfig.isAutoRead){
        remoteConfig.readDeviceCapturePlan(cms.util.$('btnRead'));
    }
    
    remoteConfig.setDeviceCapturePlan = function(btn){
        var strChannel = cms.util.getCheckBoxCheckedValue('chbChannelCopy', ',');
        var strWeek = cms.util.getCheckBoxCheckedValue('chbWeekDayCopy', ',');
        var isChannelCopy = '' != strChannel && strChannel.split(',').length > 1;
        var isWeekCopy = '' != strWeek && strWeek.split(',').length > 1;
        var arrChannel = isChannelCopy ? strChannel.split(',') : [$('#ddlChannelId').val()];
        var arrWeek = isWeekCopy ? strWeek.split(',') : [$('#ddlWeekDay').val()];
        
        var captureTimePoint = remoteConfig.getDeviceCapturePlanInput('point');
        var captureTimeSpan = remoteConfig.getDeviceCapturePlanInput();
        var interval = remoteConfig.getCaptureInterval();
        if(!captureTimePoint || !captureTimeSpan){
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
                    ['save_to', $('#ddlSaveTo').val()],
                    ['capture_type', cms.util.getRadioCheckedValue('rbCaptureType')],
                    ['interval', interval],
                    ['resolution', $('#ddlPictureResolution').val()],
                    ['pic_quality', $('#ddlPictureQuality').val()],
                    ['frequency', $('#ddlCaptureFrequency').val()],
                    ['point_list', captureTimePoint],
                    ['span_list', captureTimeSpan]
                ];
                
                for(var i=0; i<arrNode.length; i++){
                    strNodeList += remoteConfig.buildXmlNode(arrNode[i][0], arrNode[i][1]);
                }
                var strXml = remoteConfig.buildXml(strNodeList);
                
                var strDevCode = devInfo.devCode;
                var urlparam = 'action=setDeviceCapturePlan&devCode=' + strDevCode + '&setting=' + escape(strXml) + '&param=';
                if(!remoteConfig.checkControlDisabled(btn)){
                    if(!isChannelCopy && !isWeekCopy){
                        return false;
                    }
                }
                module.appendDebugInfo(module.getDebugTime() + '[setDeviceCapturePlan Request] param: ' + urlparam);
                remoteConfig.ajaxRequest({
                    url: remoteConfig.setRemoteConfigUrl,
                    data: urlparam,
                    callBack: remoteConfig.setDeviceCapturePlanCallBack,
                    param: {
                        btn: btn,
                        title: '通道' + channelNo + ' ' + remoteConfig.parseWeekDay(week)
                    }
                });
            }
        }
    };
    
    remoteConfig.setDeviceCapturePlanCallBack = function(data, param){
        module.appendDebugInfo(module.getDebugTime() + '[setDeviceCapturePlan Response] data: ' + data);
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
        remoteConfig.task.appendTaskList({id:id, action:'setDeviceCapturePlan', title:'设置设备抓图计划：' + param.title, result:'正在设置，请稍候...', callBack:''});
    };
</script>