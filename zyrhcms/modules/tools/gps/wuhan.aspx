<%@ Page Language="C#" AutoEventWireup="true" CodeFile="wuhan.aspx.cs" Inherits="modules_tools_gps_wuhan" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>武汉铁路供电段GPS坐标转换</title>
    <style type="text/css">
        body{margin:0; padding:5px 10px; font-size:12px;}
        table{}
        table td{height:35px;}
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <div>数据格式：序号,纬度,经度,公里标,名称。 示例：1,30°37'0"113"',114°14'1"97"',819.700,汉宜线下行
        <br />
        <table cellpadding="0" cellspacing="0" style="width:99%;">
            <tr>
                <td style="width:50%;">
                    线路ID：<asp:DropDownList ID="ddlLine" runat="server">
                        <asp:ListItem Value="1">1 汉丹线上行</asp:ListItem>
                        <asp:ListItem Value="2">2 汉丹线下行</asp:ListItem>
                        <asp:ListItem Value="3">3 汉宜线上行</asp:ListItem>
                        <asp:ListItem Value="4">4 汉宜线下行</asp:ListItem>
                        <asp:ListItem Value="5">5 合武1上行</asp:ListItem>
                        <asp:ListItem Value="6">6 合武2下行</asp:ListItem>
                        <asp:ListItem Value="7">7 合武线上行</asp:ListItem>
                        <asp:ListItem Value="8">8 合武线下行</asp:ListItem>
                        <asp:ListItem Value="9">9 京广线上行</asp:ListItem>
                        <asp:ListItem Value="10">10 京广线下行</asp:ListItem>
                        <asp:ListItem Value="11">11 京九线上行</asp:ListItem>
                        <asp:ListItem Value="12">12 京九线下行</asp:ListItem>
                        <asp:ListItem Value="13">13 麻武线下行</asp:ListItem>
                        <asp:ListItem Value="14">14 南环线上行</asp:ListItem>
                        <asp:ListItem Value="15">15 南环线下行</asp:ListItem>
                        <asp:ListItem Value="16">16 武九线上行</asp:ListItem>
                        <asp:ListItem Value="17">17 汉宜线上行</asp:ListItem>
                        <asp:ListItem Value="18">18 京广高铁线</asp:ListItem>
                        <asp:ListItem Value="19">19 测试</asp:ListItem>
                    </asp:DropDownList>&nbsp;
                    <asp:CheckBox ID="chbConvert" runat="server" Checked="True" ForeColor="Blue" Text="度分秒转换" />&nbsp;
                    经纬度小数点位数：
                    <asp:TextBox ID="txtLength" runat="server" Text="8" Width="40px"></asp:TextBox><asp:CheckBox ID="chbRound" runat="server" Checked="True" Text="小数点四舍五入" />
                </td>
                <td style="width:50%;">转换后的数据</td>
            </tr>
            <tr>
                <td><asp:TextBox ID="txtSource" runat="server" TextMode="multiLine" Height="360px" Width="98%" onscroll="document.getElementById('txtLatLng').scrollTop = this.scrollTop;"></asp:TextBox></td>
                <td><asp:TextBox ID="txtLatLng" runat="server" Height="360px" TextMode="multiLine" Width="100%" onscroll="document.getElementById('txtSource').scrollTop = this.scrollTop;"></asp:TextBox></td>
            </tr>
            <tr>
                <td><asp:Button ID="btnConvert" runat="server" Text="执行转换" OnClick="btnConvert_Click" />
                    <asp:CheckBox ID="chbZhiYi" runat="server" Text="直译" />
                    <asp:Label ID="lblPrompt" runat="server"></asp:Label></td>
            </tr>
            <tr>
                <td colspan="2"><asp:TextBox ID="txtResult" runat="server" TextMode="multiLine" Height="150px" Width="100%"></asp:TextBox></td>
            </tr>
        </table>
       </div>
    </div>
    </form>
</body>
</html>
