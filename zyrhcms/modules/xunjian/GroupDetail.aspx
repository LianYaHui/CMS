<%@ Page Language="C#" AutoEventWireup="true" CodeFile="GroupDetail.aspx.cs" Inherits="modules_xunjian_GroupDetail" %>


<form id="GroupForm" style="margin: 20px;" runat="server" class="form-horizontal" role="form">
    <div class="form-group form-group-sm">
        <label for="txt_GroupName_gd" class="col-sm-3 control-label">群组名称</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" id="txt_GroupName_gd" runat="server" placeholder="群组名称" />
        </div>
    </div>

    <div class="checkbox">
        <label>
            <input type="checkbox" id="ck_continue_gd" />添加完成后继续
        </label>
    </div>
</form>

