<%@ Page Language="C#" AutoEventWireup="true" CodeFile="sms.aspx.cs" Inherits="test_sms" ValidateRequest="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>无标题页</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:TextBox ID="TextBox1" runat="server" Height="355px" TextMode="MultiLine" Width="715px"></asp:TextBox><br />
        <br />
        <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="Button" /><br />
        <asp:TextBox ID="TextBox2" runat="server" Width="716px"></asp:TextBox>&nbsp;</div>
    </form>
</body>
</html>
