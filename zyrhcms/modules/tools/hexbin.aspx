<%@ Page Language="C#" AutoEventWireup="true" CodeFile="hexbin.aspx.cs" Inherits="modules_tools_hexbin" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Hex转换Bin</title>
    <style type="text/css">
        body{margin:0; padding:10px; line-height:24px; font-size:12px;}
    </style>
</head>
<body>    
    <form id="form1" runat="server">
    <div>
        <h4>Hex文件内容转换成Bin文件内容（设备远程升级文件）</h4>
        要转换的Hex文件内容：<br />
        <asp:TextBox ID="txtHex" runat="server" Height="200px" TextMode="MultiLine" Width="600px"></asp:TextBox>
        <br />
        <asp:Button ID="btnConvert" runat="server" Text="转换" OnClick="btnConvert_Click" style="margin:10px 0;" />
        <br />
        转换后的Bin文件内容：<br />
        <asp:TextBox ID="txtBin" runat="server" Height="200px" TextMode="MultiLine" Width="600px"></asp:TextBox>
        <br />
        <asp:Label ID="lblInfo" runat="server" Text=""></asp:Label>
    </div>
    </form>
</body>
</html>
