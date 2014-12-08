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
    |
    <a id="btn_GroupNode" class="easyui-linkbutton" iconcls="icon-tip" plain="true">查看群组聊天记录</a>
</div>

<div id="Group_device_grid_tb">
    <a id="btn_addDevice" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增组成员</a>
    <a id="btn_removeDevice" class="easyui-linkbutton" iconcls="icon-remove" plain="true">移除组成员</a>
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
                    title: row.GroupName + "的组成员"
                }).data("DeviceGroup", row);
            }
        });

        var $Group_device_grid = $("#Group_device_grid").datagrid({
            singleSelect: false
        });

        var $dialog = new EasyuiDialog(_path + "GroupDetail.aspx", {
            width: 450,
            height: 300,
            title: "新建群组",
            buttons: [{
                text: '确认',
                iconCls: 'icon-ok',
                handler: function () {
                    var _id = $("#GroupForm").data("id");
                    _id = parseInt(_id || 0);

                    Public.ajax(_path + "InnerFunction.asmx/SaveGroup",
                        JSON.stringify({
                            json: JSON.stringify({
                                GroupID: _id,
                                GroupName: $("#txt_GroupName_gd").val()
                            })
                        }),
                        function (data) {
                            if (data.d == 1) {
                                $groupGrid.datagrid("reload");
                                $dialog.dialog("close");

                                MessageBox.Show("保存成功");
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

            $dialog.dialog({ href: _path + "GroupDetail.aspx?gid=" + sltRow.GroupID }).dialog("open");
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

            MessageBox.Confirm("确认该删除该群组吗?", "确认", function (ok) {
                if (ok) {
                    Public.ajax(_path + "InnerFunction.asmx/RemoveGroup",
                                    JSON.stringify({
                                        groupID: sltRow.GroupID
                                    }),
                                    function (data) {
                                        if (data.d > 0) {
                                            $groupGrid.datagrid("reload");

                                            MessageBox.Show("操作成功");
                                        }
                                        else {
                                            MessageBox.Alert("发生错误");
                                        }
                                    });
                }
            });

        });

        //add device
        $("#btn_addDevice").click(function () {
            var group = $Group_device_grid.data("DeviceGroup");

            if (!group) {
                MessageBox.Alert("请先选择一个组");
                return;
            }

            if (group.GroupBuildType === 200001) {
                MessageBox.Alert("选择的组是系统自动生成的,不能新增或者移除组员");
                return;
            }

            $deviceDialog.dialog({
                title: "选择设备",
                href: (_path + "DevicePage.aspx"),
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var sltedRows = Q($("#dg_sltDevice").datagrid("getRows"));

                        var sltrow = [];
                        Q(sltedRows).ForEach(function (r) {
                            sltrow.push(r.device_id);
                        });

                        if (sltrow.length == 0) {
                            MessageBox.Alert("请选择一个设备");
                            return;
                        }

                        Public.ajax(_path + "InnerFunction.asmx/AddDeviceToGroup",
                                JSON.stringify({
                                    groupID: group.GroupID,
                                    deivceCode: sltrow
                                }),
                                function (data) {
                                    if (data.d == 1) {
                                        $deviceDialog.dialog("close");
                                        $Group_device_grid.datagrid("reload");

                                        MessageBox.Show("保存成功");
                                    }
                                    else {
                                        MessageBox.Alert("发生错误");
                                    }
                                });
                    }
                }]
            }).dialog("open");
        });

        $("#btn_removeDevice").click(function () {
            var group = $Group_device_grid.data("DeviceGroup");

            if (!group) {
                MessageBox.Alert("请先选择一个组");
                return;
            }

            if (group.GroupBuildType === 200001) {
                MessageBox.Alert("选择的组是系统自动生成的,不能新增或者移除组员");
                return;
            }

            var sltRows = $Group_device_grid.datagrid("getSelections");

            if (sltRows.length == 0) {
                MessageBox.Alert("请至少选择一个组员");
                return;
            }

            Public.ajax(_path + "InnerFunction.asmx/RemoveDeviceForGroup",
                                           JSON.stringify({
                                               groupID: group.GroupID,
                                               deivceCode: Q(sltRows).Select("$.DeviceCode").ToArray()
                                           }),
                                           function (data) {
                                               if (data.d > 0) {
                                                   $Group_device_grid.datagrid("reload");
                                                   MessageBox.Show("操作成功");
                                               }
                                               else {
                                                   MessageBox.Alert("发生错误");
                                               }
                                           });
        });


        $("#btn_GroupNode").click(function () {
            var sltRow = $groupGrid.datagrid("getSelected");

            if (!sltRow) {
                MessageBox.Alert("请选择数据");
                return;
            }

            MessageBox.Alert("ToDo");
        });
    });
</script>

