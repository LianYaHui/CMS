<%@ Page Language="C#" AutoEventWireup="true" CodeFile="LinePointDialog.aspx.cs" Inherits="modules_xunjian_LinePointDialog" %>


<form runat="server">
    <div class="pull-left" style="width: 30%">
        <table id="Line_grid_diolog" title="巡检路线区域" style="height: 300px">
            <thead>
                <tr>
                    <th data-options="field:'line_name',width:180">巡检线路名称</th>
                </tr>
            </thead>
        </table>
    </div>

    <div class="pull-left" style="width: 70%">
        <table id="Point_grid_dialog" title="巡检点" style="height: 300px"
            data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
				pagination:true,
			">
            <thead>
                <tr>
                    <th data-options="field:'ck',checkbox:true"></th>
                    <th data-options="field:'point_name',width:180">巡检点名称</th>
                    <th data-options="field:'create_time',width:180,formatter:Farmat.DataTime">创建时间</th>
                </tr>
            </thead>
        </table>
    </div>

    <script>
        $(function () {
            $("#Line_grid_diolog").treegrid({
                url: _path + "DataSource/PatrolLine.ashx?r=10",
                singleSelect: true,
                idField: 'line_id',
                animate: true,
                treeField: 'line_name',
                rownumbers: true,
                collapsible: true,
                fitColumns: true,
                onDblClickRow: function (row) {
                    $$gird.datagrid({
                        url: _path + "PointManagePage.aspx?action=get&line_id=" + row.line_id
                    });
                }
            });

            var $$gird = $("#Point_grid_dialog").datagrid({
                url: _path + "PointManagePage.aspx?action=get",
                singleSelect: false,
                selectOnCheck: true,
                checkOnSelect: true
            });
        });
    </script>
</form>
