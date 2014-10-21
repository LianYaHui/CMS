<%@ Page Language="C#" AutoEventWireup="true" CodeFile="wst.aspx.cs" Inherits="tools_wst" ValidateRequest="false" %>
<!DOCTYPE html>
<html>
<head>
    <title>WebService接口测试</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
</head>
<body oncontextmenu="return false;">
    <form id="form1" runat="server">
    <div>
        <table cellpadding="0" cellspacing="5" class="tbform">
            <tr>
                <td>
                    参数代码：<br />
                    <asp:DropDownList ID="ddlParamCode" runat="server" CssClass="select" onchange="cms.util.$('txtParamCode').value = this.value;">
                        <asp:ListItem Value="007">获取施工计划</asp:ListItem>
                        <asp:ListItem Value="006">获取支柱信息</asp:ListItem>
                        <asp:ListItem Value="010">查询指定部门的应急物资</asp:ListItem>    
                        <asp:ListItem Value="013">查询值班跟班安排</asp:ListItem>                     
                        <asp:ListItem Value="005">查询锚段信息</asp:ListItem>
                        <asp:ListItem Value="004">查询行别</asp:ListItem>
                        <asp:ListItem Value="003">查询区间站场</asp:ListItem>
                        <asp:ListItem Value="002">查询线别</asp:ListItem>
                        <asp:ListItem Value="001">查询部门信息</asp:ListItem>
                    </asp:DropDownList>
                    <asp:TextBox ID="txtParamCode" runat="server" CssClass="txt">007</asp:TextBox>
                </td>
                <td><a onclick="showWSParam();" target="_blank">查看WebService接口协议</a></td>
            </tr>
            <tr>
                <td style="vertical-align:top;">
                    参数内容：<br />
                    <asp:TextBox ID="txtParamContent" runat="server" CssClass="txt" TextMode="multiLine" Height="260px" Width="400px"><?xml version="1.0" encoding="utf-8"?>
<Request>
<TYPEID></TYPEID>
<BEGINDATE>{StartTime}</BEGINDATE>
<ENDDATE>{EndTime}</ENDDATE>
<DEPARTMENTID></DEPARTMENTID>
<WORKBUILDTYPE></WORKBUILDTYPE>
<WORKGRADE></WORKGRADE> 
</Request>
                    </asp:TextBox>
                    <br />
                    <asp:Button ID="btnSearch" runat="server" Text="查询" OnClick="btnSearch_Click" />
                </td>
                <td style="vertical-align:top;">
                    返回结果：<br />
                    <asp:TextBox ID="txtResult" runat="server" CssClass="txt" TextMode="multiLine" Height="420px" Width="600px" ReadOnly="true"></asp:TextBox>
                    <br />
                    <asp:Label ID="lblPrompt" runat="server" Text="" ForeColor="red"></asp:Label>
                </td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>
<script type="text/javascript">
function showWSParam(){
    var config = {
        id: 'pwWSParam',
        title: 'WebService接口协议',
        html: cms.util.path + '/config/wsparam.xml',
        width: 800,
        height: 500,
        maxAble: true,
        showMinMax: true,
        noBottom: true,
        boxType: 'window',
        requestType: 'iframe',
        lock: false,
        closeType: 'hide',
        build: 'show'
    };
    
    cms.box.win(config);
}
</script>