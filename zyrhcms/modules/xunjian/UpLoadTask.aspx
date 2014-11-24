<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UpLoadTask.aspx.cs" Inherits="modules_xunjian_UpLoadTask" %>






<form id="form1" runat="server">
    <table id="dg_taskUpLaod" title="任务汇报管理" style="height: 550px">
        <thead>
            <tr>
                <th data-options="field:'FirstUpLoadTime',width:140,formatter:Farmat.Date">上报时间</th>
                <th data-options="field:'DegreeDesc',width:100">任务名称</th>
                <th data-options="field:'typeDesc',width:100">设备标识</th>
                <th data-options="field:'point_name',width:100">巡检点</th>
                <th data-options="field:'MarkID',width:150">上报标识</th>
            </tr>
        </thead>
    </table>

    <div id="ut_tb">
        <a id="btn_upDesc" class="easyui-linkbutton" iconcls="icon-ok" plain="true">评论</a>
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
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var __id = $descDialog.data("UT_ID");

                        var desc = $("#txt_utDesc").val();

                        Public.ajax(_path + "InnerFunction.asmx/SaveLeaderDesc",
                           JSON.stringify({
                               json: JSON.stringify({
                                   ID: __id,
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
                                href: _path + "UpLoadTaskMes.aspx?id=" + row.ID
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
                $descDialog.data("UT_ID", sltRow.ID).dialog("open");
            });
        });
    </script>
</form>


