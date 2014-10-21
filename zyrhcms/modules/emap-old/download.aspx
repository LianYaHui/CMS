<%@ Page Language="C#" AutoEventWireup="true" CodeFile="download.aspx.cs" Inherits="modules_emap_download" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>下载铁路图片</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        地图缩放等级：<asp:DropDownList ID="ddlZoom" runat="server">
        </asp:DropDownList>
        <br />
        <br />
        
        <asp:Button ID="Button1" runat="server" Text="开始下载" OnClick="Button1_Click" />
        <br />
        <br />
        <asp:TextBox ID="txtResult" runat="server" Height="100px" TextMode="MultiLine" Width="500px"></asp:TextBox></div>
    </form>
</body>
</html>
