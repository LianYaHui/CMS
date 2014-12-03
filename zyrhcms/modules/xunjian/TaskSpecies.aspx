<%@ Page Language="C#" AutoEventWireup="true" CodeFile="TaskSpecies.aspx.cs" Inherits="modules_xunjian_TaskSpecies" %>

<div>
    <table id="ptPoint_grid" title="任务种类管理" style="height: 540px"
        data-options="
				rownumbers: true,
				collapsible: true,
				fitColumns: true,
                toolbar:'#tbType',
                pagination:true
			">
        <thead>
            <tr>
                <th data-options="field:'type_name',width:150">忠烈名称</th>
                <th data-options="field:'type_desc',width:180">类型描述</th>
                <th data-options="field:'patrol_radii',width:80">默认巡检半径(米)</th>
                <th data-options="field:'c',width:80">巡检点数量</th>
                <th data-options="field:'create_time',width:180,formatter:Farmat.DataTime">创建时间</th>
            </tr>
        </thead>
    </table>
</div>

