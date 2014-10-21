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
                <td style="width:120px;">报警输入：</td>
                <td>
                    <select id="ddlAlarmInChannel" class="select w200" style="width:206px;"></select>
                </td>
            </tr>
            <tr>
                <td>报警名称：</td>
                <td>
                    <input type="text" id="txtAlarmName" class="txt w200" maxlength="64" />
                </td>
            </tr>
            <tr>
                <td>报警器状态：</td>
                <td>
                    <select id="ddlAlertorStatus" class="select w200" style="width:206px;">
                        <option value="0">常开</option>
                        <option value="1">常闭</option>
                    </select>
                </td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" /><span>处理报警</span></label>
        <div class="tabpanel" id="tabpanel">
            <a class="cur" lang="time" rel="#divAlarmTime"><span>布防时间</span></a>
            <a class="tab" lang="linkage" rel="#divAlarmLinkage"><span>联动方式</span></a>
        </div>
        <div id="divAlarmTime" class="div-alarm-setting" style="padding:10px 0 20px;">
            <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="width:120px;">星期：</td>
                    <td>
                        <select id="ddlWeekDay" class="select w200" style="width:206px;">
                            <option value="1">星期一</option>
                            <option value="2">星期二</option>
                            <option value="3">星期三</option>
                            <option value="4">星期四</option>
                            <option value="5">星期五</option>
                            <option value="6">星期六</option>
                            <option value="7">星期日</option>
                        </select>
                    </td>
                </tr>
            </table>
            <table class="tbAlarmTime tblist" cellpadding="0" cellspacing="0" id="tbAlarmTime" style="width:400px;margin:5px 0 10px 0;">
                <tr class="trheader" style="height:24px;">
                    <td style="width:60px;text-align:center;">时间段</td>
                    <td style="width:165px;text-align:center;">开始时间</td>
                    <td style="width:165px;text-align:center;">结束时间</td>
                </tr>
            </table>
            <hr style="margin:5px 0;" />
            <a class="btn btnc22" style="float:right;" onclick="remoteConfig.showCopyToWeekDay('divWeekDayPanel','ddlWeekDay', this);" lang="['复制到星期','取消复制']"><span class="w75">复制到星期</span></a>
            <div id="divWeekDayPanel" style="margin:10px 0;overflow:hidden; clear:both;"></div>
            <hr style="margin:5px 0;" />
            <a class="btn btnc22" style="float:right;" onclick="remoteConfig.showCopyToChannel('divChannelPanel','ddlAlarmInChannel','报警量', this);" lang="['复制到报警量','取消复制']"><span class="w75">复制到报警量</span></a>
            <div id="divChannelPanel" style="margin:10px 0;overflow:hidden; clear:both;padding-bottom:20px;"></div>
        </div>
        <div id="divAlarmLinkage" class="div-alarm-setting" style="display:none;padding-bottom:20px;">
            报警触发方式
        </div>
    </div>
    <div class="formbottom">
        <a class="btn btnc24" id="btnRead"><span>读取报警输入设置</span></a>
        <a class="btn btnc24" id="btnSet"><span class="w50">保存</span></a>
    </div>
</body>
</html>
<script type="text/javascript">
    remoteConfig.setFormTableStyle();
    remoteConfig.setFormBodySize();
    
    remoteConfig.fillChannelOption(cms.util.$('ddlAlarmInChannel'), devInfo.channelCount, '报警量');
    
    showAlarmTime();
    
    $(".tbAlarmTime tr:not(:nth-child(1)) td").css('height','28px');
    
    cms.jquery.tabs('.tabpanel', null, '.div-alarm-setting', '');
    
    function showAlarmTime(){
        var objList = cms.util.$('tbAlarmTime');
        cms.util.clearDataRow(objList, 1);
        var dc = 4;
        var rid = 1;
        
        for(var i = 0; i < dc; i++){
            var row = objList.insertRow(rid);
            
            rowData = buildAlarmTime(row, rid);
            
            cms.util.fillTable(row, rowData);
            rid++;
        }
    }
    
    function buildAlarmTime(row, rnum){
        var rowData = [];
        var cellid = 0;
        var strStart = '<select class="select w50" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" style="margin:0 5px 0 10px;">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        var strEnd = '<select class="select w50" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w50" style="margin:0 5px 0 10px">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        
        rowData[cellid++] = {html: rnum, style:[['textAlign','center']]}; //序号
        rowData[cellid++] = {html: strStart, style:[['textAlign','center']]}; //开始时间
        rowData[cellid++] = {html: strEnd, style:[['textAlign','center']]}; //结束时间
        
        return rowData;
    }
    
    remoteConfig.copyToChannel = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var chbName = pwReturn.returnValue.chbName;
        }
        pwobj.Hide();
    };
</script>