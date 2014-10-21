<%@ Page Language="C#" AutoEventWireup="true" CodeFile="dms.aspx.cs" Inherits="modules_tools_dms" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>度分秒转换经纬度</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <table>
            <tr>
                <td>纬度度分（秒）：</td>
                <td><asp:TextBox ID="TextBox1" runat="server">2934.0133</asp:TextBox></td>
                <td>经度度分（秒）：</td>
                <td><asp:TextBox ID="TextBox2" runat="server">10627.2544</asp:TextBox></td>
                <td><asp:Button ID="Button1" runat="server" Text="度分秒转换为经纬度" OnClick="Button1_Click" /></td>
            </tr>
            <tr>
                <td>纬度值：</td>
                <td><asp:TextBox ID="TextBox3" runat="server"></asp:TextBox></td>
                <td>经度值：</td>
                <td><asp:TextBox ID="TextBox4" runat="server"></asp:TextBox></td>
                <td><asp:Button ID="Button2" runat="server" Text="经纬度转换为度分秒" OnClick="Button2_Click" /></td>
            </tr>
            <tr>
                <td>纬度度分秒格式：</td>
                <td><asp:TextBox ID="TextBox5" runat="server"></asp:TextBox></td>
                <td>经度度分秒格式：</td>
                <td><asp:TextBox ID="TextBox6" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>纬度度分格式：</td>
                <td><asp:TextBox ID="TextBox7" runat="server"></asp:TextBox></td>
                <td>经度度分格式：</td>
                <td><asp:TextBox ID="TextBox8" runat="server"></asp:TextBox></td>
            </tr>
        </table>
        </div>
        <asp:Label ID="Label1" runat="server" Text=""></asp:Label>
    </form>
</body>
</html>
