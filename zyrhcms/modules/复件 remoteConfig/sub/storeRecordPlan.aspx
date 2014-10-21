<%@ Page Language="C#" %>
<script runat="server"></script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>设备信息</title>
</head>
<body>
    <div class="formbody">
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">通道号：</td>
                <td>
                    <select id="ddlChannelId" class="select" style="width:206px;"></select>
                </td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;"><input type="checkbox" class="chb" checked="checked" /><span>启用中心录像</span></label>
        <hr style="margin-top:5px;clear:both;" />
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
        <label class="chb-label-nobg" style="float:left;"><input type="radio" class="chb" checked="checked" name="rbRecordType" /><span>全天录像</span></label>
        <table class="tbremoteconfig" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width:120px;">录像类型：</td>
                <td>
                    <select id="ddlRecordType" class="select w200" style="width:206px;"></select>
                </td>
            </tr>
        </table>
        <label class="chb-label-nobg" style="float:left;"><input type="radio" class="chb" checked="checked" name="rbRecordType" /><span>按时间段录像</span></label>
        <table class="tbRecordTime tblist" cellpadding="0" cellspacing="0" id="tbRecordTime" style="width:490px;margin:5px 0 10px 0;">
            <tr class="trheader" style="height:24px;">
                <td style="width:50px;text-align:center;">时间段</td>
                <td style="width:135px;text-align:center;">开始时间</td>
                <td style="width:135px;text-align:center;">结束时间</td>
                <td>录像类型</td>
            </tr>
        </table>
        <hr style="margin:5px 0;" />
        <a class="btn btnc22" style="float:right;" onclick="remoteConfig.showCopyToWeekDay('divWeekDayPanel','ddlWeekDay', this);" lang="['复制到星期','取消复制']"><span class="w75">复制到星期</span></a>
        <div id="divWeekDayPanel" style="margin:10px 0;overflow:hidden; clear:both;"></div>
        <hr style="margin:5px 0;" />
        <a class="btn btnc22" style="float:right;" onclick="remoteConfig.showCopyToChannel('divChannelPanel','ddlChannelId','通道', this);" lang="['复制到通道','取消复制']"><span class="w75">复制到报警量</span></a>
        <div id="divChannelPanel" style="margin:10px 0;overflow:hidden; clear:both;padding-bottom:20px;"></div>
    </div>
</body>
</html>
<script type="text/javascript">
    $(".tbremoteconfig tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    
    remoteConfig.fillChannelOption(cms.util.$('ddlChannelId'), devInfo.channelCount, '通道');
    
    cms.util.fillOptions(cms.util.$('ddlRecordType'), remoteConfig.arrRecordType, 0x0);

    showRecordTime();
    
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
        var strStart = '<select class="select w40" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w40" style="margin:0 5px 0 10px;">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        var strEnd = '<select class="select w40" style="margin-right:5px;">' + cms.util.buildNumberOptions(0, 23, 0, 1, 2, '0') + '</select>时'
            + '<select class="select w40" style="margin:0 5px 0 10px">' + cms.util.buildNumberOptions(0, 59, 0, 1, 2, '0') + '</select>分';
        var strRecordType = '<select class="select" id="ddlRecordType_" style="width:150px;">' + cms.util.buildOptions(remoteConfig.arrRecordType, 0x0) + '</select>';
        
        rowData[cellid++] = {html: rnum, style:[['textAlign','center']]}; //序号
        rowData[cellid++] = {html: strStart, style:[['textAlign','center']]}; //开始时间
        rowData[cellid++] = {html: strEnd, style:[['textAlign','center']]}; //结束时间
        rowData[cellid++] = {html: strRecordType, style:[['textAlign','center']]}; //录像类型
        
        return rowData;
    }
    
    remoteConfig.copyToChannel = function(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var chbName = pwReturn.returnValue.chbName;
        }
        pwobj.Hide();
    };
</script>