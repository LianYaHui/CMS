<%@ Page Language="C#" AutoEventWireup="true" CodeFile="crc16.aspx.cs" Inherits="modules_tools_crc16" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>CRC16校验</title>
    <style type="text/css">
        body{margin:0; padding:10px; line-height:24px; font-size:12px;}
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <h4>CRC16检验码，输出结果：高位+低位</h4>
        要检验的文字内容(UTF-8编码)<br />
        <asp:TextBox ID="TextBox1" runat="server" Width="650px" Height="150px" TextMode="MultiLine" style="margin-bottom:5px;"></asp:TextBox>
        <br />
        <asp:Button ID="Button1" runat="server" Text="计算校验码" OnClick="Button1_Click" />
        内容长度：<asp:Label ID="lblLen1" runat="server" Text="" style="margin-right:20px;"></asp:Label>校验码：
        <asp:TextBox ID="TextBox2" runat="server" Width="60px"></asp:TextBox><br />
        <br />
        要检验的文字内容(GB2312编码)<br />
        <asp:TextBox ID="TextBox3" runat="server" Width="650px" Height="150px" TextMode="MultiLine" style="margin-bottom:5px;"></asp:TextBox>
        <br />
        <asp:Button ID="Button2" runat="server" OnClick="Button2_Click" Text="计算校验码" />
        内容长度：<asp:Label ID="lblLen2" runat="server" Text="" style="margin-right:20px;"></asp:Label>校验码：
        <asp:TextBox ID="TextBox4" runat="server" Width="60px"></asp:TextBox>
    </div>
    </form>
</body>
</html>
