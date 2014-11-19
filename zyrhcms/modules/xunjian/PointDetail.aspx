<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PointDetail.aspx.cs" Inherits="modules_xunjian_PointDetail" %>


<form id="PointForm" style="margin: 20px;" runat="server" class="form-horizontal" role="form">
    <div class="form-group form-group-sm">
        <label for="txt_PointName_pd" class="col-sm-3 control-label">巡检点名称</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" id="txt_PointName_pd" runat="server" placeholder="巡检点名称" />
        </div>
    </div>

    <div class="form-group form-group-sm">
        <label for="txt_longitude_pd" class="col-sm-3 control-label">经度</label>
        <div class="col-sm-3">
            <input type="text" class="form-control" runat="server" id="txt_longitude_pd" placeholder="经度" />
        </div>
        <label for="txt_latitude_pd" class="col-sm-3 control-label">维度</label>
        <div class="col-sm-3">
            <input type="text" class="form-control" runat="server" id="txt_latitude_pd" placeholder="维度" />
        </div>
    </div>

    <div class="form-group form-group-sm">
        <label for="txt_radio_pd" class="col-sm-3 control-label">巡检半径</label>
        <div class="col-sm-9">
            <input type="text" class="form-control" id="txt_radio_pd" runat="server" placeholder="巡检半径" />
        </div>
    </div>

    <div class="form-group form-group-sm">
        <label for="txt_type_pd" class="col-sm-3 control-label">巡检点类型</label>
        <div class="col-sm-9">
            <select class="form-control" id="slt_type_pd" runat="server">
            </select>
        </div>
    </div>

    <div class="form-group form-group-sm">
        <label for="txt_line_pd" class="col-sm-3 control-label">巡检路线</label>
        <div class="col-sm-9">
            <select class="form-control" id="slt_line_pd" runat="server">
            </select>
        </div>
    </div>

    <div class="checkbox">
        <label>
            <input type="checkbox" id="ck_continue_pd" />添加完成后继续
        </label>
    </div>


</form>
