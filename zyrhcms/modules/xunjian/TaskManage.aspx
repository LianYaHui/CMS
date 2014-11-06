<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TaskManage.aspx.cs" Inherits="xunjian_TaskManage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <table id="dg_task" class="easyui-datagrid" title="数据表格" style="height: 550px"
            data-options="rownumbers:true,singleSelect:true,toolbar:'#tb',pagination:true,method:'get'">
            <thead>
                <tr>
                    <th data-options="field:'Name',width:180">名称</th>
                    <th data-options="field:'isEnable',width:100">是否启用</th>
                    <th data-options="field:'Type',width:80,align:'right'">类型</th>
                </tr>
            </thead>
        </table>
        <div id="tb">
            <div>
                <a id="btn_addTask" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增</a>
                <a id="btn_editTask" class="easyui-linkbutton" iconcls="icon-edit" plain="true">编辑</a>
                <a id="btn_dltTask" class="easyui-linkbutton" iconcls="icon-remove" plain="true">删除</a>
            </div>
        </div>
    </form>

    <div id="task_dialog">
    </div>


    <script>
        $(function () {

            var $dialog = new EasyuiDialog(_path + "TaskDialog.aspx", {
                width: 450,
                height: 400,
                title: "任务明细",
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var _id = $("#taskManageForm").data("id");

                        if (PubStringFun.IsNullOrempty(_id)) _id = 0;
                        else _id = parseInt(_id);
                    }
                }]
            }, "#task_dialog");

            var $dg_task = $("#dg_task").datagrid({
                url: _path + "data.js"
            });

            //新增
            $("#btn_addTask").click(function () {
                $dialog.dialog({
                    href: _path + "TaskDialog.aspx"
                }).dialog("open");
            });

            //编辑
            $("#btn_editTask").click(function () {

            });


            //删除
            $("#btn_dltTask").click(function () {
                var row = $dg_task.datagrid("getSelected");

                if (!row) {
                    MessageBox.Alert("请选择要删除的数据");
                    return;
                }

                MessageBox.Confirm("要删除所选择的任务吗？", "删除数据", function (f) {
                    if (!f) {
                        return;
                    }

                    MessageBox.Show("data is delete");
                });
            });
        });
    </script>
</body>
</html>
