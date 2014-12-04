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
                <span>任务巡检点</span>
            </td>
            <td colspan="3">
                <input id="txt_Taskpoint" runat="server" style="width: 300px" />
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
    </table>

    <script type="text/javascript">
        $(function () {
            $(".chosen").chosen();
            $("#txt_Taskpoint").combogrid({
                idField: 'point_id',
                textField: 'point_name',
                url: _path + "PointManagePage.aspx?action=get",
                columns: [[
                  { field: 'point_name', width: 180, title: '巡检点名称' },
                  { field: 'type_name', width: 150, title: "类型名称" },
                  { field: 'radii', width: 80, title: "默认巡检半径(米)" },
                  { field: 'create_time', width: 180, formatter: Farmat.DataTime, title: "创建时间" },
                ]],
                fitColumns: true,
                rownumbers: true,
                pagination: true,
                panelWidth: 500
            });

        });
    </script>
</form>
