<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UpLoadTask.aspx.cs" Inherits="modules_xunjian_UpLoadTask" %>



<form id="form1" runat="server">
    <table id="dg_taskUpLaod" title="任务汇报管理" style="height: 550px">
        <thead>
            <tr>
                <th data-options="field:'execStatus',width:140,formatter:Farmat.execStatus">执行状态</th>

                <th data-options="field:'TaskName',width:100">任务名称</th>
                <th data-options="field:'TaskStartTime',width:100,formatter:Farmat.Date">任务起始时间</th>
                <th data-options="field:'TaskEndTime',width:100,formatter:Farmat.Date">任务结束时间</th>
                <th data-options="field:'device_name',width:100">设备人员名称</th>
                <th data-options="field:'FirstUpLoadTime',width:140,formatter:Farmat.Date">上报时间</th>

                <th data-options="field:'upResult',width:140">上报状况</th>
            </tr>
        </thead>
    </table>

    <div id="ut_tb">
        <div>
            <a id="btn_upDesc" class="easyui-linkbutton" iconcls="icon-ok" plain="true">评论</a>
            <a id="btn_upDetail" class="easyui-linkbutton" iconcls="icon-ok" plain="true">上报明细</a>

            <a class="easyui-linkbutton" iconcls="icon-ok" plain="true">导出Excel</a>
        </div>
        <div>
            <span>任务完成情况：</span>
            <select class="easyui-combobox" panelheight="auto" style="width: 100px">
                <option value="1">未开始</option>
                <option value="2">执行中</option>
                <option value="3">未完成</option>
                <option value="4">已完成</option>
            </select>

            <span>上报时间</span>
            从:
            <input class="easyui-datebox" style="width: 110px">
            至:
            <input class="easyui-datebox" style="width: 110px">

            <a id="btn_upSearch" class="easyui-linkbutton" iconcls="icon-search">查询</a>
        </div>

    </div>

    <div id="ut_setDesc">
        <div class="margin5">
            <textarea id="txt_utDesc" rows="5" runat="server" class="form-control input-sm"></textarea>
        </div>
    </div>

    <div id="ud_mes">
    </div>

    <script>
        $(function () {
            var $descDialog = new EasyuiDialog(null, {
                width: 450,
                height: 200,

                title: "请输入信息已帮助更好的完成任务",
                onOpen: function () {
                    var sltRow = $grid.datagrid("getSelected");

                    $("#txt_utDesc").val(sltRow.leaderDesc);
                },
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var __id = $descDialog.data("UT_ID");

                        var desc = $("#txt_utDesc").val();

                        Public.ajax(_path + "InnerFunction.asmx/SaveLeaderDesc",
                           JSON.stringify({
                               json: JSON.stringify({
                                   tdID: __id,
                                   leaderDesc: desc
                               })
                           }),
                           function (data) {
                               if (data.d == 1) {
                                   $descDialog.dialog("close");
                                   $grid.datagrid("reload");
                               }
                               else {
                                   MessageBox.Alert("发生错误");
                               }
                           });


                    }
                }]
            }, "#ut_setDesc");


            var $mesDialog = new EasyuiDialog(null, {
                title: "上报信息数据",
                fit: true
            }, "#ud_mes");



            var $grid = $("#dg_taskUpLaod").datagrid(
                $.extend({}, EasyuiSetting.DataGrid, {
                    singleSelect: false,
                    toolbar: '#ut_tb',
                    onDblClickRow: function (index, row) {
                        $mesDialog
                            .dialog({
                                href: _path + "UpLoadTaskMes.aspx?id=" + row.tdID
                            })
                            .dialog("open");
                    },
                    url: _path + "UpLoadTask.aspx?action=get"
                }));


            $("#btn_upDesc").click(function () {
                var sltRow = $grid.datagrid("getSelected");
                if (sltRow == null) {
                    MessageBox.Alert("请选择一行数据");
                    return;
                }
                //

                $descDialog.data("UT_ID", sltRow.tdID).dialog("open");
            });

            $("#btn_upDetail").click(function () {
                var sltRow = $grid.datagrid("getSelected");
                if (sltRow == null) {
                    MessageBox.Alert("请选择一行数据");
                    return;
                }
                $mesDialog.dialog({
                    href: _path + "UpLoadTaskMes.aspx?id=" + sltRow.tdID
                }).dialog("open");
            });

            $("#btn_upSearch").click(function () {
                MessageBox.Show("Data is beta");
            });
        });
    </script>
</form>


