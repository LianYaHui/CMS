<%@ Page Language="C#" AutoEventWireup="true" CodeFile="editPerson.aspx.cs" Inherits="modules_safety_editPerson" ValidateRequest="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>编辑人员信息</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript">
        function closeParentWin(){
            parent.closeEditWin();
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div style="padding:5px 10px;">
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td style="width:80px;">所在部门：</td>
                <td style="width:200px;">
                    <asp:TextBox ID="txtDeptName" CssClass="txt" runat="server" ReadOnly="true"></asp:TextBox></td>
                <td style="width:70px;"></td>
                <td>
                    </td>
            </tr>
            <tr>
                <td style="width:80px;">工作证号：</td>
                <td style="width:200px;">
                    <asp:TextBox ID="txtJobNumber" CssClass="txt" runat="server" ReadOnly="true"></asp:TextBox></td>
                <td style="width:70px;">真实姓名：</td>
                <td>
                    <asp:TextBox ID="txtRealName" CssClass="txt" runat="server" ReadOnly="true"></asp:TextBox></td>
            </tr>
            <tr>
                <td>办公电话：</td>
                <td>
                    <asp:TextBox ID="txtTelephone" CssClass="txt" runat="server" MaxLength="13"></asp:TextBox></td>
                <td>手机号码：</td>
                <td>
                    <asp:TextBox ID="txtMobile" CssClass="txt" runat="server" MaxLength="11"></asp:TextBox></td>
            </tr>
            <tr>
                <td>选择职名：</td>
                <td>
                    <asp:DropDownList ID="ddlJob" runat="server" CssClass="select">
                    </asp:DropDownList></td>
                <td>兼职：</td>
                <td>
                    <asp:DropDownList ID="ddlJobPart" runat="server" CssClass="select">
                    </asp:DropDownList>(可以不选)</td>
            </tr>
            <tr>
                <td>还有兼职？：</td>
                <td colspan="3">
                    <asp:DropDownList ID="ddlJobPart1" runat="server" CssClass="select">
                    </asp:DropDownList>(可以不选)</td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td style="width:80px;">简介：<br />(可以不填)</td>
                <td>
                    <asp:TextBox ID="txtIntroduce" runat="server" TextMode="multiLine" CssClass="txt" Width="450px" Height="80px"></asp:TextBox></td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <asp:Button ID="btnSave" runat="server" Text="确认保存" OnClick="btnSave_Click" />
                    <input id="txtId" type="hidden" runat="server" />
                    <input id="btnReset" type="reset" value="取消" />
                    <asp:Label ID="lblPrompt" runat="server" Text="" ForeColor="red"></asp:Label></td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>
