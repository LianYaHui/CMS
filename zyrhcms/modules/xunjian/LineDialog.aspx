<%@ Page Language="C#" AutoEventWireup="true" CodeFile="LineDialog.aspx.cs" Inherits="modules_xunjian_LineDialog" %>


<form runat="server">
    <table id="ptLine_grid_diolog" title="巡检路线区域" style="height: 300px">
        <thead>
            <tr>
                <th data-options="field:'line_name',width:180">巡检线路名称</th>
                <th data-options="field:'c',width:80,formatter:Farmat.NullToZero">巡检点个数</th>
                <th data-options="field:'create_time',width:180,formatter:Farmat.DataTime">创建时间</th>
            </tr>
        </thead>
    </table>
    <script>
        $(function () {
            var grid = $("#ptLine_grid_diolog").treegrid({
                url: _path + "DataSource/PatrolLine.ashx",
                singleSelect: true,
                idField: 'line_id',
                animate: true,
                treeField: 'line_name',
                rownumbers: true,
                collapsible: true,
                fitColumns: true
            });
        });
    </script>
</form>

