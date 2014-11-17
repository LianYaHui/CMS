<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PatrolPointManage.aspx.cs" Inherits="modules_xunjian_PatrolPointManage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <table id="ptPoint_grid" title="巡检类型管理" style="height: 540px"
            data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
                toolbar:'#tbType',
                pagination:true
			">
            <thead>
                <tr>
                    <th data-options="field:'type_name',width:150">类型名称</th>
                    <th data-options="field:'type_desc',width:180">类型描述</th>
                    <th data-options="field:'patrol_radii',width:80">默认巡检半径(米)</th>
                    <th data-options="field:'c',width:80">巡检点数量</th>
                    <th data-options="field:'create_time',width:180,formatter:Farmat.DataTime">创建时间</th>
                </tr>
            </thead>
        </table>

        <div id="tbType">
            <div>
                <a id="btn_addType" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增</a>
                <a id="btn_editType" class="easyui-linkbutton" iconcls="icon-edit" plain="true">编辑</a>

            </div>
        </div>
        <div id="div_type">
        </div>
    </form>

    <script>
        $(function () {
            var grid = $("#ptPoint_grid").datagrid({
                url: _path + "PatrolPointManage.aspx?action=get",
                singleSelect: true
            });

            var $dialog = new EasyuiDialog(_path + "PatrolPointDetail.aspx", {
                width: 450,
                height: 400,
                title: "巡检点类型明细",
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var _id = $("#formPatroPoint").data("id");
                        _id = parseInt(_id);

                        Public.ajax(_path + "InnerFunction.asmx/SavePatrolType",
                            JSON.stringify({
                                json: JSON.stringify({
                                    type_id: _id,
                                    type_name: $("#txt_PointName").val(),
                                    patrol_radii: parseInt($("#txt_Ridio").val()),
                                    type_desc: $("#txt_PointDesc").val()
                                })
                            }),
                            function (data) {
                                if (data.d == 1) {
                                    $dialog.dialog("close");
                                    grid.datagrid("reload");
                                }
                                else {
                                    MessageBox.Alert("发生错误");
                                }
                            });
                    }
                }]
            }, "#div_type");


            //add
            $("#btn_addType").click(function () {
                $dialog.dialog({
                    href: _path + "PatrolPointDetail.aspx"
                }).dialog("open");
            });

            //Edit
            $("#btn_editType").click(function () {
                var sltRow = grid.datagrid("getSelected");
                if (sltRow == null) {
                    MessageBox.Alert("请选择一行数据");
                    return;
                }

                $dialog.dialog({
                    href: _path + "PatrolPointDetail.aspx?ID=" + sltRow.type_id
                }).dialog("open");
            });
        });
    </script>
</body>
</html>
