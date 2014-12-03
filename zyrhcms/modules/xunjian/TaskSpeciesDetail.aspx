<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TaskSpeciesDetail.aspx.cs" Inherits="modules_xunjian_TaskSpeciesDetail" %>


<form id="SpeciesForm" runat="server" role="form">
    <table id="tb_im" class="table-ui margin5" style="width: 600px;">
        <tr>
            <td class="td-title">
                <span>名称</span>
            </td>
            <td colspan="3">
                <input type="text" class="form-control" id="txt_SpeciesName_ts" runat="server" placeholder="巡检点名称" />
            </td>
        </tr>

        <tr>
            <td class="td-title">
                <span>帮助链接网址</span>
            </td>
            <td colspan="3">
                <input type="text" id="txt_Url_ts" runat="server" class="form-control input-sm" />
            </td>
        </tr>
        <tr>
            <td class="td-title">
                <span>任务描述</span>
            </td>
            <td colspan="3">
                <textarea id="txt_taskDesc_ts" runat="server" class="form-control input-sm"></textarea>
            </td>
        </tr>

        <tr>
            <td class="td-title">
                <span>操作标准</span>
            </td>
            <td colspan="3">
                <textarea id="txt_taskStandard_ts" rows="5" runat="server" class="form-control input-sm"></textarea>
            </td>
        </tr>
    </table>
</form>


