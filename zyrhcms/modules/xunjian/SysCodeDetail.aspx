<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SysCodeDetail.aspx.cs" Inherits="modules_xunjian_SysCodeDetail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="../../js/easyui/easyui.css" rel="stylesheet" />
    <link href="../../js/easyui/icon.css" rel="stylesheet" />
    <link href="../../js/easyui/min.Plugin.css" rel="stylesheet" />
    <link href="../../js/easyui/ui-common.css" rel="stylesheet" />

    <script src="../../js/easyui/lib.js"></script>
    <script src="../../js/easyui/jquery.min.js"></script>
    <script src="../../js/easyui/Jquery.MS.min.js"></script>
    <script src="../../js/easyui/jquery.easyui.min.js"></script>
    <script src="../../js/easyui/easyui-lang-zh_CN.js"></script>
    <script src="../../js/easyui/common.js"></script>
    <script src="../../js/bootstrap/js/bootstrap.min.js"></script>
</head>
<body>
    <form id="CodeForm" runat="server">
        <table class="table-ui margin5" style="width: 400px;">
            <tr>
                <td class="td-title">
                    <span>显示值</span>
                </td>
                <td colspan="3">
                    <asp:TextBox ID="txt_CodeDisplay" runat="server" CssClass="form-control input-sm"></asp:TextBox>
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
                    <span>所属类型</span>
                </td>
                <td>
                    <select id="slt_codeType" style="width: 100px;" class="chosen" runat="server">
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
