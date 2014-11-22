<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DevicePage.aspx.cs" Inherits="modules_xunjian_DevicePage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <div class="margin5">
        <div class="pull-left" style="width: 200px;">
            <ul id="ul_unitTree">
            </ul>
        </div>

        <div class="pull-left" style="width: 460px;">
            <table id="dg_Device">
                <thead>
                    <tr>
                        <th data-options="field:'device_id',width:80">设备ID</th>
                        <th data-options="field:'index_code',width:100">设备编码</th>
                        <th data-options="field:'device_name',width:100">设备名称</th>
                        <th data-options="field:'create_time',width:140,formatter:Farmat.DataTime">创建时间</th>
                    </tr>
                </thead>
            </table>
        </div>

        <div class="pull-left" style="width: 200px;">
            <table id="dg_sltDevice">
                <thead>
                    <tr>
                        <th data-options="field:'device_id',width:80">设备ID</th>
                        <th data-options="field:'device_name',width:100">设备名称</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>

    <div id="dg_Device_tb">
        <a id="btn_addSlt" class="easyui-linkbutton" iconcls="icon-add" plain="true">添加</a>
    </div>

    <div id="dg_sltDevice_tb">
        <a id="btn_dltSlt" class="easyui-linkbutton" iconcls="icon-remove" plain="true">删除</a>
    </div>


    <script>
        $(function () {
            var $tree = $("#ul_unitTree").tree({
                url: _path + "UnitTree.ashx",
                animate: true,
                lines: true,
                onDblClick: function (node) {
                    $dg.datagrid({ url: _path + 'DevicePage.aspx?action=GetDrivice&uid=' + node.id });
                }
            });

            var $dg = $("#dg_Device").datagrid(
                $.extend({}, EasyuiSetting.DataGrid, {
                    height: 320,
                    title: '请选择设备',
                    singleSelect: false,
                    toolbar: '#dg_Device_tb'
                })
            );

            var $sltDg = $("#dg_sltDevice").datagrid(
                $.extend({}, EasyuiSetting.DataGrid, {
                    height: 320,
                    title: '已选择的设备',
                    pagination: false,
                    singleSelect: false,
                    toolbar: '#dg_sltDevice_tb'
                })
            );

            //add
            $("#btn_addSlt").click(function () {
                var sltRows = $dg.datagrid("getSelections");

                var sltedRows = Q($sltDg.datagrid("getRows")).Select("$.device_id");

                Q(sltRows).ForEach(function (r) {
                    if (!sltedRows.Contains(r.device_id)) {
                        $sltDg.datagrid("appendRow", r);
                    }
                });
            });

            ///remove
            $("#btn_dltSlt").click(function () {
                var sltedRows = Q($sltDg.datagrid("getSelections"));
                Q(sltedRows).ForEach(function (r) {
                    $sltDg.datagrid("deleteRow", $sltDg.datagrid("getRowIndex", r));
                });
            });


            var data=<%=JsonData%>;
            $sltDg.datagrid("loadData",data);
        });
    </script>
</body>
</html>
