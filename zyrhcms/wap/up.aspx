<%@ Page Language="C#" AutoEventWireup="true" CodeFile="up.aspx.cs" Inherits="wap_up" %>
<!DOCTYPE html>
<html>
<head runat="server">
    <title>无标题页</title>
</head>
<body>
    <form id="form1" runat="server">
    <div id="DIV1" runat="server">
        <input id="File1" type="file" runat="server" />
        <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="上传图片" /><br />
        <br />
        <asp:Image ID="Image1" runat="server" /></div>
    </form>
</body>
</html>