<%@ page language="C#" autoeventwireup="true" inherits="temp_record, App_Web_1jzavedf" validaterequest="false" %>
<!DOCTYPE html>
<html>
<head runat="server">
    <title>中心存储设备录像计划 - 临时版</title>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>  
    <style type="text/css">
    body{font-size:14px;}
    </style>      
    <script type="text/javascript">
    function showPlanContent(){
        var strPlan = cms.util.$('txtPlan').value.trim();
        var strDaysPlan = cms.util.$('txtDaysPlan').value.trim();
        
        var arrPlanConfig = [];
        var arrDaysPlanConfig = [];
        for(var i=0; i<96; i++){
            arrPlanConfig.push(0);
        }
        for(var i=0; i<7; i++){
            arrDaysPlanConfig.push(0);
        }
        
        var arrPlan = strPlan.split('');
        var arrDaysPlan = strDaysPlan.split('');
        for(var i=0; i<arrPlan.length; i++){
            arrPlanConfig[i] = parseInt(arrPlan[i], 10);
        }
        for(var i=0; i<arrDaysPlan.length; i++){
            arrDaysPlanConfig[i] = parseInt(arrDaysPlan[i], 10);
        }
        
        var strHtml = '';
        for(var i=0; i<1; i++){
            strHtml += '<label style="margin-right:20px;width:50px;display:inline-block;">'
                + '<input type="checkbox" value="' + 0 + '" name="chbPlan1" title="' + 0 + '" onclick="setPlan(this, \'\');" />'
                + 0 + '.</label>';
            for(j=0; j<59; j+=15){
                var m = j + 15;
                var s = '00';
                if(m > 45){
                    m = 59;
                    s = '59';
                }                
                strHtml += '<label style="margin-right:20px;">'
                    + '<input type="checkbox" value="' + i + '" name="chbPlan1" title="' + m + '" onclick="setPlan(this, \'title\');" />'
                    + '00:00:00'
                    + ' - '
                    + '00:00:00'
                    + '</label>';
            }
            strHtml += '<br /><br />';
        }
        
        var num = 0;
        for(var i=0; i<24; i++){
            strHtml += '<label style="margin-right:20px;width:50px;display:inline-block;">'
                + '<input type="checkbox" value="' + i + '" name="chbPlan1" onclick="setPlan(this, \'value\');" />'
                + (i+1) + '.</label>';
            for(j=0; j<59; j+=15){
                var m = j + 15;
                var s = '00';
                if(m > 45){
                    m = 59;
                    s = '59';
                }                
                strHtml += '<label style="margin-right:20px;">'
                    + '<input type="checkbox" value="' + i + '" name="chbPlan" title="' + m + '"' 
                    + (arrPlanConfig[num] == 1 ? ' checked="checked" ' : '') 
                    + ' onclick="getPlan();" '
                    + ' />'
                    + ('' + i).padLeft(2, '0') + ':' + ('' + j).padLeft(2, '0') + ':' + '00'
                    + ' - '
                    + ('' + i).padLeft(2, '0') + ':' + ('' + m).padLeft(2, '0') + ':' + s
                    + '</label>';
                num++;
            }
            strHtml += '<br />';
        }
        cms.util.$('divPlan').innerHTML = strHtml;
        
        num = 0;
        strHtml = '';
        strHtml += '<label style="margin-right:20px;width:75px;display:inline-block;">'
                + '<input type="checkbox" value="' + i + '" name="chbPlan1" onclick="setDaysPlan(this);" />'
                + '周计划' + '</label>';
        for(var i=0; i<7; i++){
            strHtml += '<label style="margin-right:20px;">'
                + '<input type="checkbox" value="' + i + '" name="chbDaysPlan"'
                + (arrDaysPlanConfig[num] == 1 ? ' checked="checked" ' : '') 
                + ' onclick="getPlan();" '
                + ' />'
                + '周' + weekday(i)
                + '</label>';
            num++;
        }
        cms.util.$('divDaysPlan').innerHTML = strHtml;
    }
    
    function weekday(day){
        var strWeekday = '日';
        switch(day){
            case 0:strWeekday = '日';
                break;
            case 1:strWeekday = '一';
                break;
            case 2:strWeekday = '二';
                break;
            case 3:strWeekday = '三';
                break;
            case 4:strWeekday = '四';
                break;
            case 5:strWeekday = '五';
                break;
            case 6:strWeekday = '六';
                break;
        }
        return strWeekday;
    }
    
    function setPlan(obj, type){
        var checked = obj.checked;
        var val = obj.value;
        
        var arrItem = cms.util.$N('chbPlan');
        if(type == 'value'){
            for(var i=0,c=arrItem.length; i<c; i++){
                if(arrItem[i].value == val){
                    arrItem[i].checked = checked;
                }
            }
        } else if(type == 'title'){
            val = obj.title;
            for(var i=0,c=arrItem.length; i<c; i++){
                if(arrItem[i].title == val){
                    arrItem[i].checked = checked;
                }
            }        
        } else {
            for(var i=0,c=arrItem.length; i<c; i++){
                arrItem[i].checked = checked;
            } 
        }
        getPlan();
    }
    
    function setDaysPlan(obj){
        var checked = obj.checked;
        
        var arrItem = cms.util.$N('chbDaysPlan');
        for(var i=0,c=arrItem.length; i<c; i++){
            arrItem[i].checked = checked;
        } 
        getPlan();
    }
    
    
    function getPlan(){
        var arrItem = cms.util.$N('chbPlan');
        var arrDaysItem = cms.util.$N('chbDaysPlan');
        
        var strPlan = '';
        var strDaysPlan = '';
        for(var i=0,c=arrItem.length; i<c; i++){
            strPlan += arrItem[i].checked ? '1' : '0';
        }
        for(var i=0,c=arrDaysItem.length; i<c; i++){
            strDaysPlan += arrDaysItem[i].checked ? '1' : '0';
        }
        cms.util.$('txtPlan').value = strPlan;
        cms.util.$('txtDaysPlan').value = strDaysPlan;        
    }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div style="line-height:28px;">
        选择设备：<asp:DropDownList ID="ddlDevice" runat="server" Height="22px">
        </asp:DropDownList>
        通道号：<asp:DropDownList ID="ddlChannel" runat="server">
        </asp:DropDownList>
        <asp:Button ID="btnSearch" runat="server" Text="查询录像计划" OnClick="btnSearch_Click" />
        <asp:Label ID="lblError" runat="server" Text="" ForeColor="red"></asp:Label><br />
        码流类型：<asp:DropDownList ID="ddlStreamType" runat="server">
            <asp:ListItem Value="0">0-主码流</asp:ListItem>
            <asp:ListItem Value="1" Selected="true">1-子码流</asp:ListItem>
        </asp:DropDownList>
        传输模式：<asp:DropDownList ID="ddlConnectType" runat="server">
            <asp:ListItem Value="0">0-UDP</asp:ListItem>
            <asp:ListItem Value="1" Selected="true">1-TCP</asp:ListItem>
        </asp:DropDownList>
        <br />
        计划内容：<input id="txtPlan" style="width: 700px" type="text" readonly="readonly" runat="server" maxlength="7" />
        <div id="divPlan">
        </div>
        每周计划：<input id="txtDaysPlan" style="width: 60px" type="text" readonly="readonly" runat="server" maxlength="7" />
        <div id="divDaysPlan"></div>
        <input id="btnSave" type="button" value="保存计划" runat="server" onserverclick="btnSave_ServerClick" />
        <asp:Button ID="btnDelete" runat="server" Text="删除计划" OnClick="btnDelete_Click" />
        <asp:Label ID="lblPrompt" runat="server" Text=""></asp:Label><br />
        <br />
        <label id="lblJs" runat="server"></label>
        <br />
        选择设备：<asp:DropDownList ID="ddlDev" runat="server" Height="22px">
        </asp:DropDownList>
        <asp:Button ID="btnWS" runat="server" Text="获取录像计划WS" OnClick="btnWS_Click" /><br />
        <asp:TextBox ID="txtXml" runat="server" TextMode="MultiLine" Height="300px" Width="99%" ReadOnly="True"></asp:TextBox>
        </div>        
    </form>
</body>
</html>
