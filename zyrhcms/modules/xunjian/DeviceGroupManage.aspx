<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DeviceGroupManage.aspx.cs" Inherits="modules_xunjian_DeviceGroupManage" %>


<form runat="server">
    <div style="width: 50%" class="pull-left">
        <table id="Group_grid" title="群组管理" style="height: 540px"
            data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
                toolbar:'#group_grid_tb',
                pagination:true
			">
            <thead>
                <tr>
                    <th data-options="field:'GroupName',width:150">群组名称</th>
                    <th data-options="field:'groupBuildTypeText',width:180">生成方式</th>
                    <th data-options="field:'CreateTime',width:180,formatter:Farmat.DataTime">创建时间</th>
                </tr>
            </thead>
        </table>
    </div>

    <div style="width: 50%" class="pull-left">
        <table id="Group_device_grid" title="群组设备" style="height: 540px"
            data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
                toolbar:'#Group_device_grid_tb'
			">
            <thead>
                <tr>
                    <th data-options="field:'DeviceCode',width:150">设备编号</th>
                    <th data-options="field:'JoinDateTime',formatter:Farmat.DataTime,width:180">加入时间</th>

                </tr>
            </thead>
        </table>

    </div>


</form>

<div id="group_grid_tb">
    <a id="btn_addGroup" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增</a>
    <a id="btn_removeGroup" class="easyui-linkbutton" iconcls="icon-remove" plain="true">删除</a>
</div>

<div id="Group_device_grid_tb">
    <a id="btn_addDevice" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增</a>
    <a id="btn_editDevice" class="easyui-linkbutton" iconcls="icon-edit" plain="true">编辑</a>
    <a id="btn_removeDevice" class="easyui-linkbutton" iconcls="icon-remove" plain="true">删除</a>
</div>

<div id="group_dialog">
</div>

<script>
    $(function () {
        var $groupGrid = $("#Group_grid").datagrid({
            singleSelect: true,
            url: _path + "DataSource/GroupDeviceHandle.ashx",
            onDblClickRow: function (index, row) {
                $Group_device_grid.datagrid({
                    url: _path + "DataSource/DeviceJoinHandle.ashx?gid=" + row.GroupID,
                    toolbar: (row.GroupBuildType === 200001 ? "" : '#Group_device_grid_tb')
                });
            }
        });

        var $Group_device_grid = $("#Group_device_grid").datagrid({
            singleSelect: true
        });

        var $dialog = new EasyuiDialog(_path + "GroupDetail.aspx", {
            width: 450,
            height: 300,
            title: "新建群组",
            buttons: [{
                text: '确认',
                iconCls: 'icon-ok',
                handler: function () {
                    var _id = $("#PointForm").data("id");
                    _id = parseInt(_id || 0);

                    //TODO
                    return;

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
        }, "#group_dialog");





        //add 
        $("#btn_addGroup").click(function () {
            $dialog.dialog({ href: _path + "GroupDetail.aspx" }).dialog("open");
        });

        //edit
        $("#btn_editGroup").click(function () {
            var sltRow = $groupGrid.datagrid("getSelected");

            if (!sltRow) {
                MessageBox.Alert("请选择数据");
                return;
            }

            if (sltRow.GroupBuildType === 200001) {
                MessageBox.Alert("系统群组无法更改和删除");
                return;
            }


        });

        //remove
        $("#btn_removeGroup").click(function () {
            var sltRow = $groupGrid.datagrid("getSelected");

            if (!sltRow) {
                MessageBox.Alert("请选择数据");
                return;
            }

            if (sltRow.GroupBuildType === 200001) {
                MessageBox.Alert("系统群组无法更改和删除");
                return;
            }


        });

        $("#").click(function () {

        });
        $("#").click(function () {

        });
        $("#").click(function () {

        });
    });
</script>

