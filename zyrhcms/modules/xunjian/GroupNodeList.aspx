<%@ Page Language="C#" AutoEventWireup="true" CodeFile="GroupNodeList.aspx.cs" Inherits="modules_xunjian_GroupNodeList" %>


<form runat="server" id="NodeFrom" class="margin5" style="height: 98%;">
    <table id="node_list_grid" title="通讯记录"
        data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
                toolbar:'#node_list_grid_tb',
                pagination:true
			">
        <thead>
            <tr>
                <th data-options="field:'deivceCode'" width="10%">设备编号</th>
                <th data-options="field:'Contont'" width="75%">通讯内容</th>
                <th data-options="field:'createTime',formatter:Farmat.DataTime" width="15%">通讯时间</th>
            </tr>
        </thead>
    </table>
    <div id="node_list_grid_tb" style="padding: 2px 5px;">
        从
        <input id="nd_begin_date" class="easyui-datetimebox" style="width: 160px" />
        至
        <input id="nd_end_date" class="easyui-datetimebox" style="width: 160px" />
        |
        设备编码
        <input id="nd_device_code" placeholder="设备编码" class="easyui-textbox" type="text" />

        |
        <a id="btn_Search_node" class="easyui-linkbutton" iconcls="icon-search">查询</a>
    </div>
    <script>
        $(function () {
            var $nodeGrid = $("#node_list_grid").datagrid({
                height: $("#NodeFrom").height()
            });

            var $nd_begin_date = $("#nd_begin_date"),
                $nd_end_date = $("#nd_end_date"),
                $nd_device_code = $("#nd_device_code");



            $("#btn_Search_node").click(function () {
                var begin = $nd_begin_date.datetimebox("getValue");
                var end = $nd_end_date.datetimebox("getValue");
                var device = $nd_device_code.textbox("getValue");

                var gid = $node_recard_dialog.data("groupID");

                var where = " and GroupID=" + $node_recard_dialog.data("groupID");

                

                if (begin) where += (" and createTime>='" + begin + "'");
                if (end) where += (" and createTime<='" + end + "'");
                if (device) where += (" and deivceCode ='" + device + "'");

                $nodeGrid.datagrid({
                    url: encodeURI(_path + "GroupNodeList.aspx?action=get&w=" + where)
                });
            });
        });
    </script>
</form>


