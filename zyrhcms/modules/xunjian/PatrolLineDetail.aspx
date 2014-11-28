﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PatrolLineDetail.aspx.cs" Inherits="modules_xunjian_PatrolLineDetail" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="formPatroLine" runat="server">
        <table class="table-ui margin5" style="width: 400px;">
            <tr>
                <td class="td-title">
                    <span>路线名称</span>
                </td>
                <td colspan="3">
                    <asp:TextBox ID="txt_LineName" runat="server" CssClass="form-control input-sm"></asp:TextBox>
                </td>
            </tr>

            <tr>
                <td class="td-title">
                    <span>起始点</span>
                </td>
                <td colspan="3"></td>
            </tr>

            <tr>
                <td class="td-title">
                    <span>经度</span>
                </td>
                <td>
                    <input id="txt_beginX" runat="server" class="form-control input-sm" />

                </td>
                <td class="td-title">
                    <span>维度</span>
                </td>
                <td>
                    <input id="txt_beginY" runat="server" class="form-control input-sm" />
                </td>
            </tr>

            <tr>
                <td class="td-title">
                    <span>终止点</span>
                </td>
                <td colspan="3"></td>
            </tr>

            <tr>
                <td class="td-title">
                    <span>经度</span>
                </td>
                <td>
                    <input id="txt_endX" runat="server" class="form-control input-sm" />

                </td>
                <td class="td-title">
                    <span>维度</span>
                </td>
                <td>
                    <input id="txt_endY" runat="server" class="form-control input-sm" />
                </td>
            </tr>

            <tr>
                <td class="td-title" colspan="4">
                    <div class="checkbox">
                        <label>
                            <input id="ck_continue_pl" type="checkbox">添加完成后继续
                        </label>
                    </div>
                </td>
            </tr>
        </table>

        <script type="text/javascript">
        </script>
    </form>
</body>
</html>
