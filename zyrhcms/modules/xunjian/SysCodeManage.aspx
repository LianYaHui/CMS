<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SysCodeManage.aspx.cs" Inherits="modules_xunjian_SysCodeManage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <table id="code_treeGrid" title="代码管理" style="height: 540px"
            data-options="
				rownumbers: true,
				animate: true,
				collapsible: true,
				fitColumns: true,
				idField: 'ID',
                toolbar:'#tbCode',
                treeField:'Display'
			">
            <thead>
                <tr>
                    <th data-options="field:'Display',width:180">显示值</th>
                    <th data-options="field:'ID',width:180">标识值</th>
                    <th data-options="field:'CreateTime',width:180,formatter:Farmat.DataTime">创建时间</th>
                    <th data-options="field:'isEnable',width:180,formatter:Farmat.IsEnable">是否启用</th>
                </tr>
            </thead>
        </table>

        <div id="tbCode">
            <div>
                <a id="btn_addCode" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增</a>
                <a id="btn_editCode" class="easyui-linkbutton" iconcls="icon-edit" plain="true">编辑</a>

            </div>
        </div>

        <div id="code_dialog">
        </div>

        <script>
            $(function () {
                var grid = $("#code_treeGrid").treegrid({
                    url: _path + "DataSource/CodeHandle.ashx"
                });

                var $dialog = new EasyuiDialog(_path + "SysCodeDetail.aspx", {
                    width: 450,
                    height: 400,
                    title: "任务明细",
                    buttons: [{
                        text: '确认',
                        iconCls: 'icon-ok',
                        handler: function () {
                            var _id = $("#CodeForm").data("id");
                            _id = parseInt(_id);

                            Public.ajax(_path + "InnerFunction.asmx/SaveCode",
                                JSON.stringify({
                                    json: JSON.stringify({
                                        ID: _id,
                                        Display: $("#txt_CodeDisplay").val(),
                                        TypeID: $("#slt_codeType").val(),
                                        isEnable: $("#ck_isEnable").is(':checked')
                                    })
                                }),
                                function (data) {
                                    if (data.d == 1) {
                                        $dialog.dialog("close");
                                        grid.treegrid("reload");
                                    }
                                    else {
                                        MessageBox.Alert("发生错误");
                                    }
                                });


                        }
                    }]
                }, "#code_dialog");


                //add
                $("#btn_addCode").click(function () {
                    $dialog.dialog({
                        href: _path + "SysCodeDetail.aspx"
                    }).dialog("open");
                });

                //Edit
                $("#btn_editCode").click(function () {
                    var sltRow = grid.treegrid("getSelected");
                    if (sltRow == null) {
                        MessageBox.Alert("请选择一行数据");
                        return;
                    }

                    $dialog.dialog({
                        href: _path + "SysCodeDetail.aspx?ID=" + sltRow.ID
                    }).dialog("open");
                });
            });
        </script>
    </form>
</body>
</html>
