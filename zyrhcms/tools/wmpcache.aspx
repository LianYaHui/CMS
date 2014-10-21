<%@ Page Language="C#" AutoEventWireup="true" CodeFile="wmpcache.aspx.cs" Inherits="tools_wmpcache" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>无标题页</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        IP:<asp:TextBox ID="txtIp" runat="server">60.12.220.24</asp:TextBox>
        Port:<asp:TextBox ID="txtPort" runat="server">6379</asp:TextBox>
        DevId:<asp:TextBox ID="txtDevId" runat="server">dx14</asp:TextBox>
        
        <asp:Button ID="btnQuery" runat="server" Text="查询缓存" OnClick="btnQuery_Click" />
    </div>
    </form>
</body>
</html>