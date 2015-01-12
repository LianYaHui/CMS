<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeviceTask.aspx.cs" Inherits="modules_xunjian_DeviceTask" %>


<form runat="server">
    <div class="pull-left" style="width: 25%;">
        <ul id="ul_unitTreeMain">
        </ul>
    </div>
    <div class="pull-left" style="width: 75%;">
        <table id="grid_deviceTask">
            <thead>
                <tr>
                    <th data-options="field:'device_id',width:80">设备ID</th>
                    <th data-options="field:'index_code',width:100">设备编码</th>
                    <th data-options="field:'device_name',width:100">设备名称</th>
                    <th data-options="field:'create_time',width:140,formatter:Farmat.DataTime">创建时间</th>

                    <th data-options="field:'AllCount',width:100">总分配任务数</th>
                    <th data-options="field:'SuccCount',width:100">已完成任务数</th>
                    <th data-options="field:'UnSuccCount',width:100">未完成任务数</th>
                    <th data-options="field:'tasingCount',width:100">正在执行的任务数</th>
                </tr>
            </thead>
        </table>
    </div>
</form>

<script>
    $(function () {
        var $tree = $("#ul_unitTreeMain").tree({
            url: _path + "UnitTree.ashx",
            animate: true,
            lines: true,
            onDblClick: function (node) {
                $dg.datagrid({ url: _path + '/DataSource/TaskDeviceHandle.ashx?uid=' + node.id });
            }
        });


        var $dg = $("#grid_deviceTask").datagrid(
               $.extend({}, EasyuiSetting.DataGrid, {
                   height: 470,
                   title: '设备明细',
                   singleSelect: false
               })
           );
    });
</script>
