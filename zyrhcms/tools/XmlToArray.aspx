<%@ Page Language="C#" AutoEventWireup="true" CodeFile="XmlToArray.aspx.cs" Inherits="tools_XmlToArray" ValidateRequest="false" %>
<!DOCTYPE html>
<html>
<head runat="server">
    <title>无标题页</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        根节点：<asp:TextBox ID="txtRootName" runat="server"></asp:TextBox>
        <span style="padding:0 20px;"></span>父节点：<asp:TextBox ID="txtNodeName" runat="server"></asp:TextBox>
        <br />
        <table cellpadding="0" cellspacing="0">
            <tr>
                <td><asp:TextBox ID="txtXml" runat="server" Height="300px" Width="500px" TextMode="MultiLine"></asp:TextBox></td>
                <td><asp:Button ID="btnConvert" runat="server" Text="开始转换" OnClick="btnConvert_Click" /></td>
                <td><asp:TextBox ID="txtArray" runat="server" Height="300px" Width="500px" TextMode="MultiLine"></asp:TextBox></td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>