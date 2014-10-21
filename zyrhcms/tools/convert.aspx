<%@ Page Language="C#" AutoEventWireup="true" CodeFile="convert.aspx.cs" Inherits="test_convert" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>字符编码转换</title>
    <style type="text/css">
        body{font-size:12px; line-height:2;}
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        将字符串转换成编码：<br />
        <table cellpadding="0" cellspacing="0">
            <tr>
                <td>字符串：</td>
                <td><asp:textbox ID="txtSource" runat="server" Width="320px"></asp:textbox></td>
                <td><asp:Button ID="btnConvert" runat="server" Text="转换" OnClick="btnConvert_Click" /></td>
            </tr>
            <tr>
                <td>Shift-JIS:</td>
                <td><asp:TextBox ID="txtResult" runat="server" Width="320px"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Unicode:</td>
                <td><asp:TextBox ID="txtResult1" runat="server" Width="320px"></asp:TextBox></td>
            </tr>
        </table>
        
        
        
        <br />
        将编码转换成字符串：
        <br />
        <table cellpadding="0" cellspacing="0">
            <tr>
                <td>字符编码：</td>
                <td>
                    <asp:TextBox ID="txtCoding" runat="server" Width="320px"></asp:TextBox>
                </td>
                <td>
                <asp:DropDownList ID="ddlEncoding" runat="server">
                    <asp:ListItem>Shift-JIS</asp:ListItem>
                    <asp:ListItem>Unicode</asp:ListItem>
                </asp:DropDownList>
                </td>
                <td>
                <asp:Button ID="btnConvert1" runat="server" Text="转换" OnClick="btnConvert1_Click" />
                </td>
            </tr>            
            <tr>
                <td>字符串：</td>
                <td><asp:TextBox ID="txtString" runat="server" Width="320px"></asp:TextBox></td>
            </tr>
        </table>
               
        <br />
        <br />
        说明：<br />
        有个别字符无法转换出正确的Shift-JIS编码，<br />
        例如：汉字“鸿”、“华” 转换出的Shift-JIS 编码是3F，但实际上是错误的编码。<br /><br />
        如果转换出来的Shift-JIS编码为3F或003F，基本上这个字符就是没有对应的Shift-JIS编码
    </div>
    </form>
</body>
</html>

