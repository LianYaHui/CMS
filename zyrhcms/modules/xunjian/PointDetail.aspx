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
        <label for="txt_type_pd" class="col-sm-3 control-label">巡检路线区域</label>
        <div class="col-sm-9">
            <input type="text" readonly class="form-control" id="txt_line_pd" runat="server" placeholder="巡检半径" style="cursor: pointer;" />
        </div>
    </div>

    <div class="checkbox">
        <label>
            <input type="checkbox" id="ck_continue_pd" />添加完成后继续
        </label>
    </div>

    <div id="pd_div_line">
    </div>

    <script>
        $(function () {
            var $dialog = new EasyuiDialog(_path + "LineDialog.aspx", {
                width: 450,
                height: 400,
                title: "选择路线",
                buttons: [{
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        var LineInfo = $("#ptLine_grid_diolog").treegrid("getSelected");
                        if (!LineInfo) {
                            MessageBox.Alert("请选择一条路线或者区域");
                            return;
                        }

                        $("#txt_line_pd").val(LineInfo.line_name).data("line_id", LineInfo.line_id);

                        $dialog.dialog("close");
                        MessageBox.Show("操作已成功");
                    }
                }]
            }, "#pd_div_line");



            $("#txt_line_pd").click(function () {
                $dialog.dialog("open");
            });
        });
    </script>

</form>
