<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PatrolLineManage.aspx.cs" Inherits="modules_xunjian_PatrolLineManage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <table id="ptLine_grid" title="路线管理" style="height: 540px"
            data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
                toolbar:'#tbLine'
			">
            <thead>
                <tr>
                    <th data-options="field:'line_name',width:180">巡检线路名称</th>
                    <th data-options="field:'name',width:180">所属组织机构</th>
                    <th data-options="field:'line_sort',width:80,formatter:Farmat.SX">上下行</th>
                    <th data-options="field:'c',width:80,formatter:Farmat.NullToZero">巡检点个数</th>
                    <th data-options="field:'lineOrder',width:80">排序号</th>
                    <th data-options="field:'create_time',width:180,formatter:Farmat.DataTime">创建时间</th>
                </tr>
            </thead>
        </table>

        <div id="tbLine">
            <div>
                <a id="btn_addLine" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增路线</a>

                <a id="btn__addRegional" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增区域</a>

                <a id="btn_editLine" class="easyui-linkbutton" iconcls="icon-edit" plain="true">编辑</a>

                <a id="btn_editRevece" class="easyui-linkbutton" iconcls="icon-reload" plain="true">线路反转</a>

            </div>
        </div>
        <div id="div_line">
        </div>

        <div id="mmLine" class="easyui-menu" style="width: 120px;">
            <div id="btn_addRegional" data-options="iconCls:'icon-add'">添加区域</div>
            <div id="btn_editRegional" data-options="iconCls:'icon-edit'">修改</div>

            <div id="btn_Insert">
                <span>插入区域</span>
                <div style="width: 150px;">
                    <div id="btn_insertBefore">
                        插入在此区域前
                    </div>
                    <div id="btn_insertAfter">
                        插入在此区域后
                    </div>
                </div>
            </div>
        </div>

        <input id="tag_Revece" type="hidden" value="10" /><%--默认上行--%>
    </form>

    <script>
        $(function () {
            var $menu = $('#mmLine');
            var $insertMenu = $("#btn_Insert");
            var $r = $("#tag_Revece");

            var grid = $("#ptLine_grid").treegrid({
                url: _path + "DataSource/PatrolLine.ashx?r=" + $r.val(),
                singleSelect: true,
                idField: 'line_id',
                animate: true,

                treeField: 'line_name',
                onContextMenu: function (e, row) {
                    e.preventDefault();
                    grid.treegrid('select', row.line_id);


                    if (row.super_id === 0)
                        $insertMenu.hide();
                    else $insertMenu.show();

                    $menu.menu('show', {
                        left: e.pageX,
                        top: e.pageY
                    });

                }
            });

            var $dialog = new EasyuiDialog(_path + "PatrolLineDetail.aspx", {
                width: 550,
                height: 400,
                title: "路线明细",
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var _id = $("#formPatroLine").data("id");
                        _id = parseInt(_id);

                        Public.ajax(_path + "InnerFunction.asmx/SavePatrolLine",
                            JSON.stringify({
                                json: JSON.stringify({
                                    line_id: _id,
                                    line_name: $("#txt_LineName").val(),
                                    super_id: parseInt($("#formPatroLine").data("sid")),
                                    begin_latitude: parseFloat($("#txt_beginX").val() || 0),
                                    begin_longitude: parseFloat($("#txt_beginY").val() || 0),
                                    end_latitude: parseFloat($("#txt_endX").val() || 0),
                                    end_longitude: parseFloat($("#txt_endY").val() || 0),
                                    lineOrder: $("#txt_LineOrder").val(),
                                    line_sort: $("#slt_revece_line").val()
                                })
                            }),
                            function (data) {
                                if (data.d == 1) {

                                    if ($("#ck_continue_pl").is(':checked') === true) {
                                        $dialog.dialog("refresh");
                                    }
                                    else {
                                        $dialog.dialog("close");
                                    }


                                    grid.treegrid("reload");
                                }
                                else {
                                    MessageBox.Alert("发生错误");
                                }
                            });


                    }
                }]
            }, "#div_line");

            //
            $("#btn__addRegional,#btn_addRegional").click(function () {
                var sltRow = grid.treegrid("getSelected");
                if (sltRow == null) {
                    MessageBox.Alert("请选择一行数据");
                    return;
                }


                $dialog.dialog({
                    href: _path + "PatrolLineDetail.aspx?sid=" + sltRow.line_id + "&r=" + $("#tag_Revece").val()
                }).dialog("open");
            });

            //add
            $("#btn_addLine").click(function () {
                $dialog.dialog({
                    href: _path + "PatrolLineDetail.aspx?r=" + $("#tag_Revece").val()
                }).dialog("open");
            });

            $("#btn_insertBefore").click(function () {
                var sltRow = grid.treegrid("getSelected");
                if (sltRow == null) {
                    MessageBox.Alert("请选择一行数据");
                    return;
                }

                $dialog.dialog({
                    href: _path + "PatrolLineDetail.aspx?sid=" + sltRow.super_id + "&o=" + (parseFloat(sltRow.lineOrder || 0) - 1) + "&r=" + $("#tag_Revece").val()
                }).dialog("open");
            });

            $("#btn_insertAfter").click(function () {
                var sltRow = grid.treegrid("getSelected");
                if (sltRow == null) {
                    MessageBox.Alert("请选择一行数据");
                    return;
                }

                $dialog.dialog({
                    href: _path + "PatrolLineDetail.aspx?sid=" + sltRow.super_id + "&o=" + (parseFloat(sltRow.lineOrder || 0) + 1) + "&r=" + $("#tag_Revece").val()
                }).dialog("open");
            });

            //Edit
            $("#btn_editLine").click(function () {
                var sltRow = grid.treegrid("getSelected");
                if (sltRow == null) {
                    MessageBox.Alert("请选择一行数据");
                    return;
                }

                $dialog.dialog({
                    href: _path + "PatrolLineDetail.aspx?ID=" + sltRow.line_id
                }).dialog("open");
            });

            $("#btn_editRevece").click(function () {

                var r = $r.val() == 10 ? 20 : 10;

                $r.val(r);

                grid.treegrid({
                    queryParams: null,
                    url: _path + "DataSource/PatrolLine.ashx?r=" + r,
                });
            });
        });
    </script>
</body>
</html>
