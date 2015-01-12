<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TaskDialog.aspx.cs" Inherits="xunjian_TaskDialog" %>

<form id="taskManageForm" runat="server">
    <table id="tb_im" class="table-ui margin5" style="width: 600px;">
        <tr>
            <td class="td-title">
                <span>任务名称</span>
            </td>
            <td colspan="3">
                <asp:textbox id="txt_taskName" runat="server" cssclass="form-control input-sm"></asp:textbox>
            </td>
        </tr>
        <tr>
            <td class="td-title">
                <span>任务类型</span>
            </td>
            <td colspan="3">
                <select id="slt_taskType" class="chosen" style="width: 300px" runat="server">
                </select>
            </td>
        </tr>

        <tr>
            <td class="td-title">
                <span>任务类别</span>
            </td>
            <td colspan="3">
                <select id="slt_taskCategory" style="width: 300px" class="chosen" runat="server">
                </select>
            </td>
        </tr>

        <tr>
            <td class="td-title">
                <span>任务紧急情况</span>
            </td>
            <td colspan="3">
                <select id="slt_taskDegree" style="width: 300px" class="chosen" runat="server">
                </select>
            </td>
        </tr>

        <tr>
            <td class="td-title">
                <span>任务种类</span>
            </td>
            <td colspan="3">
                <select id="slt_taskSpecies" style="width: 300px" class="chosen" runat="server">
                </select>
            </td>
        </tr>

        <tr>
            <td class="td-title">
                <span>开始时间</span>
            </td>
            <td>
                <input class="easyui-datebox" id="txt_beginDate" runat="server" style="width: 150px;"
                    data-options="formatter:Farmat.DateYYYYMMDD,required:true" />
            </td>

            <td class="td-title">
                <span>结束时间</span>
            </td>
            <td>
                <input class="easyui-datebox" id="txt_EndDate" runat="server" style="width: 150px;"
                    data-options="formatter:Farmat.DateYYYYMMDD,required:true" />
            </td>
        </tr>


        <tr>
            <td class="td-title">
                <span>巡检点</span>
            </td>

            <td colspan="3">
                <table id="dg_task_slt" title="对应的巡检点" style="height: 200px; width: 450px;"
                    data-options="rownumbers:true,singleSelect:false,toolbar:'#slt_grid_tb'">
                    <thead>
                        <tr>
                            <th data-options="field:'point_name',width:180">巡检点</th>
                            <th data-options="field:'line_name',width:200">所属区域路段</th>
                        </tr>
                    </thead>
                </table>
            </td>
        </tr>
    </table>

    <div id="slt_grid_tb">
        <a id="btn_addPoint_slt" class="easyui-linkbutton" iconcls="icon-add" plain="true">添加</a>
        <a id="btn_dltPoint_slt" class="easyui-linkbutton" iconcls="icon-remove" plain="true">删除</a>

        <a class="easyui-linkbutton" iconcls="icon-edit" href="<%=Public.WebDir%>/modules/xunjian/导入模板.xlsx" plain="true">下载Excel模板</a>
        <a id="btn_drPoint_slt" class="easyui-linkbutton" iconcls="icon-add" plain="true">导入临时巡检点</a>
    </div>

    <div id="tmp_upload_ts"></div>

    <script type="text/javascript">
        $(function () {
            $(".chosen").chosen();

            var jsonData=<%=JsonPoint%>;

            var $slt_grid = $("#dg_task_slt").datagrid()
                            .datagrid("loadData",jsonData);

            if(jsonData.length > 0 ){
                $slt_grid.datagrid({
                    toolbar:''
                });
            }

            $linePointDialog.dialog({
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var g = $("#Point_grid_dialog");
                        var slt_point = g.datagrid("getSelections");

                        var sltPointID = Q($slt_grid.datagrid("getRows")).Select("$.point_id");

                        Q(slt_point).ForEach(function (r) {
                            if (!sltPointID.Contains(r.point_id)) {
                                $slt_grid.datagrid("appendRow", r);
                            }
                        });


                        //$linePointDialog.dialog("close");
                        MessageBox.Show("添加成功");
                    }
                }]
            });

            $("#btn_addPoint_slt").click(function () {
                $linePointDialog.dialog("open");
            });

            $("#btn_dltPoint_slt").click(function () {
                var sltedRows = Q($slt_grid.datagrid("getSelections"));
                Q(sltedRows).ForEach(function (r) {
                    $slt_grid.datagrid("deleteRow", $slt_grid.datagrid("getRowIndex", r));
                });
            });










            var $dialog2 = new EasyuiDialog(_path + "UpLoadExcel.aspx", {
                width: 400,
                height: 200,
                title: "导入excel"
            }, "#tmp_upload_ts");




            $("#btn_drPoint_slt").click(function(){
                $dialog2.dialog({
                    href:_path + "UpLoadExcel.aspx"
                }).dialog("open");
            });
        });
    </script>
</form>
