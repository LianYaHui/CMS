<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserPermissionManage.aspx.cs" Inherits="modules_xunjian_UserPermissionManage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <table id="dg_up" class="easyui-datagrid" title="用户权限" style="height: 520px"
            data-options="rownumbers:true,singleSelect:true,toolbar:'#tb_up',pagination:true">
            <thead>
                <tr>
                    <th data-options="field:'Name',width:180">账户名</th>
                    <th data-options="field:'Name',width:180">用户名</th>
                    <th data-options="field:'isEnable',width:100">联系方式</th>
                    <th data-options="field:'Type',width:80,align:'right'">所属组</th>
                </tr>
            </thead>
        </table>
        <div id="tb_up">
            <div>
                <a id="btn_editTask" class="easyui-linkbutton" iconcls="icon-edit" plain="true">分配权限</a>
            </div>
        </div>
    </form>
</body>
</html>
