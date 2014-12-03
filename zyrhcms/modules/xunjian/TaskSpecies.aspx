<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TaskSpecies.aspx.cs" Inherits="modules_xunjian_TaskSpecies" %>

<div>
    <table id="speies_grid" title="任务种类管理" style="height: 540px"
        data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
				toolbar:'#speies_grid_tb',
				pagination:true
			">
        <thead>
            <tr>
                <th data-options="field:'Species_Name',width:150">种类名称</th>
                <th data-options="field:'HelpWebUrl',width:180,formatter:Farmat.Url">帮助网址</th>
                <th data-options="field:'TaskDesc',width:80">任务描述</th>
                <th data-options="field:'create_time',width:180,formatter:Farmat.DataTime">创建时间</th>
            </tr>
        </thead>
    </table>
</div>

<div id="speies_grid_tb">
    <a id="btn_addSpecies" class="easyui-linkbutton" iconcls="icon-add" plain="true">新增</a>
    <a id="btn_editSpecies" class="easyui-linkbutton" iconcls="icon-edit" plain="true">编辑</a>
</div>

<div id="TaskSpecies_diolog">
</div>

<script>
    $(function () {
        var $grid = $("#speies_grid").datagrid({
            url: _path + "TaskSpecies.aspx?action=get",
            singleSelect: true
        });

        var $dialog = new EasyuiDialog(_path + "TaskSpeciesDetail.aspx", {
            width: 650,
            height: 400,
            title: "任务种类明细",
            buttons: [{
                text: '确认',
                iconCls: 'icon-ok',
                handler: function () {
                    var _id = $("#SpeciesForm").data("id") || 0;
                    _id = parseInt(_id);

                    Public.ajax(_path + "InnerFunction.asmx/SaveTaskSpecies",
						JSON.stringify({
						    json: JSON.stringify({
						        Species_Name: $("#txt_SpeciesName_ts").val(),
						        TaskDesc: $("#txt_taskDesc_ts").val(),
						        OperationStandard: $("#txt_taskStandard_ts").val(),
						        HelpWebUrl: $("#txt_Url_ts").val(),
						        Species_ID: _id
						    })
						}),
						function (data) {
						    if (data.d == 1) {
						        $dialog.dialog("close");
						        $grid.datagrid("reload");
						    }
						    else {
						        MessageBox.Alert("发生错误");
						    }
						});
                }
            }]
        }, "#TaskSpecies_diolog");

        //新增
        $("#btn_addSpecies").click(function () {
            $dialog.dialog({
                href: _path + "TaskSpeciesDetail.aspx"
            }).dialog("open");
        });

        //编辑
        $("#btn_editSpecies").click(function () {
            var sltRow = $grid.datagrid("getSelected");
            if (sltRow == null) {
                MessageBox.Alert("请选择一行数据");
                return;
            }


            $dialog.dialog({
                href: _path + "TaskSpeciesDetail.aspx?id=" + sltRow.Species_ID
            }).dialog("open");
        });
    });
</script>
