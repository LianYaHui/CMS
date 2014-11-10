<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PatrolPointDetail.aspx.cs" Inherits="modules_xunjian_PatrolPointDetail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="formPatroPoint" runat="server">
        <table class="table-ui margin5" style="width: 400px;">
            <tr>
                <td class="td-title">
                    <span>路线名称</span>
                </td>
                <td colspan="3">
                    <asp:TextBox ID="txt_PointName" runat="server" CssClass="form-control input-sm"></asp:TextBox>
                </td>
            </tr>

            <tr>
                <td class="td-title">
                    <span>默认半径</span>
                </td>
                <td colspan="3">
                    <asp:TextBox Text="50" ID="txt_Ridio" runat="server" CssClass="form-control input-sm"></asp:TextBox>
                </td>
            </tr>

            <tr>
                <td class="td-title">
                    <span>类型描述</span>
                </td>
                <td colspan="3">
                    <asp:TextBox TextMode="MultiLine" ID="txt_PointDesc" runat="server" CssClass="form-control input-sm"></asp:TextBox>
                </td>
            </tr>
        </table>

        <script type="text/javascript">
        </script>
    </form>
</body>
</html>
