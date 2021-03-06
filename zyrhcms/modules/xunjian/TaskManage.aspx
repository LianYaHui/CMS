﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TaskManage.aspx.cs" Inherits="xunjian_TaskManage" %>


<form id="form1" runat="server">
    <div class="pull-left" style="width: 20%;">
        <table id="lineTree_task" title="巡检路段" style="height: 540px">
            <thead>
                <tr>
                    <th data-options="field:'line_name',width:180">巡检路段</th>
                </tr>
            </thead>
        </table>

    </div>
    <div class="pull-left" style="width: 80%;">
        <table id="dg_task" title="巡检任务管理" style="height: 550px"
            data-options="rownumbers:true,singleSelect:true,toolbar:'#tb',pagination:true">
            <thead>
                <tr>
                    <th data-options="field:'TaskName',width:180">名称</th>
                    <th data-options="field:'DegreeDesc',width:100">紧急程度</th>
                    <th data-options="field:'typeDesc',width:100">巡检类型</th>
                    <th data-options="field:'point_name',width:100">巡检点</th>
                    <th data-options="field:'TaskStartTime',width:100,formatter:Farmat.Date">任务开始时间</th>
                    <th data-options="field:'TaskEndTime',width:100,formatter:Farmat.Date">任务结束时间</th>
                    <th data-options="field:'CreateTime',width:100,align:'center',formatter:Farmat.DataTime">创建时间</th>
                </tr>
            </thead>
        </table>
    </div>

    <div id="tb">
        <div>
            <a id="btn_addTask" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增</a>
            <a id="btn_editTask" class="easyui-linkbutton" iconcls="icon-edit" plain="true">编辑</a>
            <a id="btn_dltTask" class="easyui-linkbutton" iconcls="icon-remove" plain="true">删除</a>

            <a id="btn_TaskCp" class="easyui-linkbutton" iconcls="icon-sum" plain="true">为任务分配设备</a>
        </div>
    </div>
</form>

<div id="task_dialog">
</div>

<div id="task_cp_dialog">
</div>


<script>
    $(function () {
        var $treeLine = $("#lineTree_task").treegrid({
            url: _path + "DataSource/PatrolLine.ashx?r=10",
            singleSelect: true,
            idField: 'line_id',
            animate: true,
            treeField: 'line_name',
            rownumbers: true,
            collapsible: true,
            fitColumns: true,
            onDblClickRow: function (row) {
                $dg_task.datagrid({
                    url: _path + "TaskManage.aspx?action=get&line_id=" + row.line_id
                });
            }
        });




        var $dialog = new EasyuiDialog(_path + "TaskDialog.aspx", {
            width: 650,
            height: 400,
            title: "任务明细",
            buttons: [{
                text: '确认',
                iconCls: 'icon-ok',
                handler: function () {
                    var _id = $("#taskManageForm").data("id");
                    _id = parseInt(_id || 0);

                    var ajaxPars = null, ajaxUrl = "";
                    var info = {
                        TaskName: $("#txt_taskName").val(),
                        taskType: parseInt($("#slt_taskType").val()),
                        TaskCategory: parseInt($("#slt_taskCategory").val()),
                        TaskDegree: parseInt($("#slt_taskDegree").val()),
                        TaskStartTime: $("#txt_beginDate").datebox("getValue"),
                        TaskEndTime: $("#txt_EndDate").datebox("getValue"),
                        SpeciesID: $("#slt_taskSpecies").val()
                    };

                    var endDate = parseInt(info.TaskEndTime.ReplaceAll("-", "")),
                        beigiDate = parseInt(info.TaskStartTime.ReplaceAll("-", "")),
                        nowDate = parseInt(new Date().format("yyyyMMdd"));

                    if (beigiDate > endDate) {
                        MessageBox.Alert("开始日期不能大于结束日期");
                        return;
                    }

                    if (nowDate > endDate) {
                        MessageBox.Alert("结束日期不能小于当前日期");
                        return;
                    }



                    if (_id > 0) {//update
                        info.ID = _id;
                        info.PointID = Q($("#dg_task_slt").datagrid("getRows")).Select("$.point_id").First();

                        ajaxPars = JSON.stringify({
                            json: JSON.stringify(info)
                        });
                        ajaxUrl = _path + "InnerFunction.asmx/UpdateTask";
                    }
                    else {
                        ajaxUrl = _path + "InnerFunction.asmx/AddTask";

                        var point_ids = Q($("#dg_task_slt").datagrid("getRows")).Select("$.point_id").ToArray();

                        ajaxPars = JSON.stringify({
                            json: JSON.stringify(info),
                            pointIDs: point_ids
                        });
                    }


                    Public.ajax(ajaxUrl, ajaxPars,
                            function (data) {
                                if (data.d == 1) {
                                    $dialog.dialog("close");
                                    $dg_task.datagrid("reload");

                                    MessageBox.Show("保存成功");
                                }
                                else {
                                    MessageBox.Alert("发生错误");
                                }
                            });
                }
            }]
        }, "#task_dialog");

        var $dg_task = $("#dg_task").datagrid({
            url: _path + "TaskManage.aspx?action=get"
        });

        $("#btn_TaskCp").click(function () {
            var row = $dg_task.datagrid("getSelected");

            if (!row) {
                MessageBox.Alert("请选择要分配的数据");
                return;
            }


            $deviceDialog.dialog({
                title: "分配任务",
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var sltedRows = Q($("#dg_sltDevice").datagrid("getRows"));

                        var sltrow = [];
                        Q(sltedRows).ForEach(function (r) {
                            sltrow.push({
                                DeviceID: r.device_id
                            });
                        });

                        if (sltrow.length == 0) {
                            MessageBox.Alert("请选择一个设备");
                            return;
                        }


                        var info = {
                            tid: row.ID,
                            row: sltrow
                        };

                        Public.ajax(_path + "InnerFunction.asmx/SaveTaskDevice",
                                JSON.stringify({
                                    json: JSON.stringify(info)
                                }),
                                function (data) {
                                    if (data.d == 1) {
                                        $deviceDialog.dialog("close");
                                        $dg_task.datagrid("reload");

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

        //新增
        $("#btn_addTask").click(function () {
            $dialog.dialog({
                href: _path + "TaskDialog.aspx"
            }).dialog("open");
        });

        //编辑
        $("#btn_editTask").click(function () {
            var row = $dg_task.datagrid("getSelected");

            if (!row) {
                MessageBox.Alert("请选择要删除的数据");
                return;
            }


            $dialog.dialog({
                href: (_path + "TaskDialog.aspx?id=" + row.ID)
            }).dialog("open");
        });


        //删除
        $("#btn_dltTask").click(function () {
            var row = $dg_task.datagrid("getSelected");

            if (!row) {
                MessageBox.Alert("请选择要删除的数据");
                return;
            }

            MessageBox.Confirm("要删除所选择的任务吗？", "删除数据", function (f) {
                if (f) {
                    Public.ajax(_path + "InnerFunction.asmx/DeleteTask",
                        JSON.stringify({ id: row.ID }),
                        function (data) {
                            if (data.d == "1") {
                                $dg_task.datagrid("reload");
                                MessageBox.Show("操作已完成");
                            }
                            else {
                                MessageBox.Alert("操作失败");
                            }
                        });
                }
            });
        });
    });
</script>
