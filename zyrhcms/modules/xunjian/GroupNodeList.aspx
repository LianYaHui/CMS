<%@ Page Language="C#" AutoEventWireup="true" CodeFile="GroupNodeList.aspx.cs" Inherits="modules_xunjian_GroupNodeList" %>


<form runat="server" id="NodeFrom" class="margin5" style="height: 98%;">
    <table id="node_list_grid" title="通讯记录"
        data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
                toolbar:'#node_list_grid_tb'
			">
        <thead>
            <tr>
                <th data-options="field:'DeviceCode'" width="10%">设备编号</th>
                <th data-options="field:'JoinDateTime'" width="75%">通讯内容</th>
                <th data-options="field:'JoinDateTime',formatter:Farmat.DataTime" width="15%">通讯时间</th>
            </tr>
        </thead>
    </table>
    <div id="node_list_grid_tb" style="padding: 2px 5px;">
        从
        <input class="easyui-datetimebox" style="width: 160px" />
        至
        <input class="easyui-datetimebox" style="width: 160px" />
        |
        设备编码
        <input placeholder="设备编码" class="easyui-textbox" type="text" />

        |
        <a id="btn_Search_node" class="easyui-linkbutton" iconcls="icon-search">查询</a>
    </div>
    <script>
        $(function () {
            var $nodeGrid = $("#node_list_grid").datagrid({
                height: $("#NodeFrom").height()
            });

            $("#btn_Search_node").click(function () {

            });
        });
    </script>
</form>


