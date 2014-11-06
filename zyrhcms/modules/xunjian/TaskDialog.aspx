<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TaskDialog.aspx.cs" Inherits="xunjian_TaskDialog" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="taskManageForm" runat="server">
        <table id="tb_im" class="table-ui margin5" style="width: 400px;">
            <tr>
                <td class="td-title">
                    <span>任务名称</span>
                </td>
                <td colspan="3">
                    <asp:TextBox ID="txt_taskName" runat="server" CssClass="form-control input-sm"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td class="td-title">
                    <span>是否禁用</span>
                </td>
                <td>
                    <input type="checkbox" runat="server" id="ck_isEnable" class="textbox-ui" />
                </td>
                <td class="td-title">
                    <span>任务类型</span>
                </td>
                <td>
                    <select id="slt_taskType" class="chosen" runat="server">
                        <option>多线程</option>
                        <option>单线程</option>
                        <option>多线多点线程</option>
                    </select>
                </td>
            </tr>
        </table>

        <script type="text/javascript">
            $(function () {
                $(".chosen").chosen();
            });
        </script>
    </form>
</body>
</html>
