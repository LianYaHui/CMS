<%@ Page Language="C#" AutoEventWireup="true" CodeFile="sms1.aspx.cs" Inherits="test_sms1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>无标题页</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        串口：<asp:DropDownList ID="ddlCom" runat="server">
        <asp:ListItem Value="1">1</asp:ListItem>
        <asp:ListItem Value="2">2</asp:ListItem>
        <asp:ListItem Value="3">3</asp:ListItem>
        <asp:ListItem Value="4">4</asp:ListItem>
        <asp:ListItem Value="5">5</asp:ListItem>
        <asp:ListItem Value="6">6</asp:ListItem>
        <asp:ListItem Value="7">7</asp:ListItem>
        <asp:ListItem Value="8">8</asp:ListItem>
        <asp:ListItem Value="9">9</asp:ListItem>
        <asp:ListItem Value="10">10</asp:ListItem>
        <asp:ListItem Value="11">11</asp:ListItem>
        <asp:ListItem Value="12">12</asp:ListItem>
        <asp:ListItem Value="13">13</asp:ListItem>
        <asp:ListItem Value="14">14</asp:ListItem>
        <asp:ListItem Value="15">15</asp:ListItem>
        <asp:ListItem Value="16">16</asp:ListItem>
        <asp:ListItem Value="17">17</asp:ListItem>
        <asp:ListItem Value="18">18</asp:ListItem>
        <asp:ListItem Value="19">19</asp:ListItem>
        </asp:DropDownList>
        波特率：<asp:DropDownList ID="ddlBaud" runat="server">
        <asp:ListItem Value="9600">9600</asp:ListItem>
        <asp:ListItem Value="115200">115200</asp:ListItem>
        </asp:DropDownList>
        <asp:Button ID="btnRun" runat="server" Text="启动" OnClick="btnRun_Click" />
        <asp:Button ID="btnStop" runat="server" Text="停止" />
        <br />
        
        手机号码：<br />
        <asp:TextBox ID="txtPhoneNumber" runat="server"></asp:TextBox>
        <br />
        短信内容：<br />
        <asp:TextBox ID="txtSmsContent" runat="server" TextMode="multiLine" Width="400px" Height="100px"></asp:TextBox>
        <br />
        <asp:Button ID="btnSend" runat="server" Text="发送短信" OnClick="btnSend_Click" />
    </div>
    </form>
</body>
</html>
