<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PointManagePage.aspx.cs" Inherits="modules_xunjian_PointManagePage" %>

<form id="form1" runat="server">
    <div class="pull-left" style="width: 20%;">

        <table id="lineTree_point" title="巡检路段" style="height: 540px">
            <thead>
                <tr>
                    <th data-options="field:'line_name',width:180">巡检线路名称</th>
                </tr>
            </thead>
        </table>

    </div>

    <div class="pull-left" style="width: 80%;">
        <table id="Point_grid" title="巡检点管理" style="height: 540px"
            data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
				toolbar:'#tbPoint',
				pagination:true
			">
            <thead>
                <tr>
                    <th data-options="field:'point_name',width:180">巡检点名称</th>
                    <th data-options="field:'latitude',width:80">纬度</th>
                    <th data-options="field:'longitude',width:80">经度</th>
                    <th data-options="field:'radii',width:180">巡检半径</th>
                    <th data-options="field:'type_name',width:180">巡检点类型</th>
                    <th data-options="field:'line_name',width:180">所属路线</th>
                    <th data-options="field:'uName',width:180">组织机构</th>
                    <th data-options="field:'create_time',width:180,formatter:Farmat.DataTime">创建时间</th>
                </tr>
            </thead>
        </table>
    </div>


    <div id="tbPoint">
        <div>
            <a id="btn_addPoint" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增</a>
            <a id="btn_editPoint" class="easyui-linkbutton" iconcls="icon-edit" plain="true">编辑</a>

        </div>
    </div>
    <div id="DivPoint">
    </div>



    <script>
        $(function () {
            var $treeLine = $("#lineTree_point").treegrid({
                url: _path + "DataSource/PatrolLine.ashx",
                singleSelect: true,
                idField: 'line_id',
                animate: true,
                treeField: 'line_name',
                rownumbers: true,
                collapsible: true,
                fitColumns: true,
                onDblClickRow: function (row) {
                    grid.datagrid({
                        url: _path + "PointManagePage.aspx?action=get&line_id=" + row.line_id
                    });
                }
            });

            var grid = $("#Point_grid").datagrid({
                url: _path + "PointManagePage.aspx?action=get",
                singleSelect: true
            });

            var $dialog = new EasyuiDialog(_path + "PointDetail.aspx", {
                width: 450,
                height: 400,
                title: "巡检点类型明细",
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var _id = $("#PointForm").data("id");
                        _id = parseInt(_id || 0);

                        Public.ajax(_path + "InnerFunction.asmx/SavePatrolPoint",
                            JSON.stringify({
                                json: JSON.stringify({
                                    point_id: _id,
                                    point_name: $("#txt_PointName_pd").val(),
                                    radii: parseFloat($("#txt_radio_pd").val()),
                                    longitude: parseFloat($("#txt_longitude_pd").val()),
                                    latitude: parseFloat($("#txt_latitude_pd").val()),
                                    type_id: parseInt($("#slt_type_pd").val()),
                                    line_id: parseInt($("#slt_line_pd").val())
                                })
                            }),
                            function (data) {
                                if (data.d == 1) {
                                    grid.datagrid("reload");

                                    if ($("#ck_continue_pd").is(':checked') === true) {
                                        $dialog.dialog("refresh", _path + "PointDetail.aspx");
                                    }
                                    else {
                                        $dialog.dialog("close");

                                    }

                                    MessageBox.Show("添加成功");
                                }
                                else {
                                    MessageBox.Alert("发生错误");
                                }
                            });
                    }
                }]
            }, "#DivPoint");


            //add
            $("#btn_addPoint").click(function () {
                $dialog.dialog({
                    href: _path + "PointDetail.aspx"
                }).dialog("open");
            });

            //Edit
            $("#btn_editPoint").click(function () {
                var sltRow = grid.datagrid("getSelected");
                if (sltRow == null) {
                    MessageBox.Alert("请选择一行数据");
                    return;
                }

                $dialog.dialog({
                    href: _path + "PointDetail.aspx?ID=" + sltRow.point_id
                }).dialog("open");
            });
        });
    </script>
</form>

