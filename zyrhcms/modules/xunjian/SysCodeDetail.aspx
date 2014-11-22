<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SysCodeDetail.aspx.cs" Inherits="modules_xunjian_SysCodeDetail" %>

<form id="CodeForm" runat="server">
    <table class="table-ui margin5" style="width: 400px;">
        <tr>
            <td class="td-title">
                <span>显示值</span>
            </td>
            <td colspan="3">
                <asp:textbox id="txt_CodeDisplay" runat="server" cssclass="form-control input-sm"></asp:textbox>
            </td>
        </tr>

        <tr>
            <td class="td-title">
                <span>标识值</span>
            </td>
            <td colspan="3">
                <asp:textbox id="txt_code_cd" runat="server" cssclass="form-control input-sm"></asp:textbox>
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
                <select id="slt_codeType" style="width: 100%;" class="chosen" runat="server">
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
