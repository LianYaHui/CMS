<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="infoDeviceList.aspx.cs" Inherits="modules_ledScreen_sub_infoDeviceList" %>
<%@ MasterType VirtualPath="~/master/mpPage.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/page.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/pagination/pagination.js"></script>
    <script type="text/javascript" src="<%=Config.WebDir%>/common/js/contextmenu/contextmenu.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <form id="Form1" action="" runat="server" method="post">
    <div id="bodyTitle">
        <span class="title"></span><span id="reload" class="reload"></span>
        <div class="tools">
            <%if(isLog==0){%>
            <a class="btn imgbtn" onclick="showUpdateStatus(0, '', 3);"><i class="icon-delete"></i><span>取消发布</span></a>
            <%}%>
            <span style="margin-left:5px;">每页显示：</span>
            <asp:DropDownList ID="ddlPageSize" runat="server" CssClass="select" AutoPostBack="True" 
                OnSelectedIndexChanged="ddlPageSize_SelectedIndexChanged">
                <asp:ListItem Value="1">1</asp:ListItem>
                <asp:ListItem Value="5">5</asp:ListItem>
                <asp:ListItem Value="10" Selected="true">10</asp:ListItem>
                <asp:ListItem Value="15">15</asp:ListItem>
                <asp:ListItem Value="20">20</asp:ListItem>
                <asp:ListItem Value="30">30</asp:ListItem>
                <asp:ListItem Value="50">50</asp:ListItem>
            </asp:DropDownList>
        </div>
    </div>
    <div id="bodyContent">
        <input type="hidden" id="txtCurrentPageUrl" runat="server" />
        <input type="hidden" id="txtInfoId" runat="server" />
        <input type="hidden" id="txtIsLog" runat="server" />
        <!--
        <div class="operform">
            <div class="formpanel">
            </div>
        </div>
        -->
        <div class="listbox">
            <asp:Repeater ID="rptList" runat="server">
                <HeaderTemplate>
                    <table class="tblist" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;min-width:1200px;">
                    <tr class="trheader">
                        <td style="width:25px;"><input type="checkbox" name="chbDevAll" onclick="cms.util.selectCheckBox('chbDev',3);" /></td>
                        <td style="width:35px;">序号</td>
                        <td style="width:60px;">设备类型</td>
                        <td style="width:100px;max-width:180px;">终端编号</td>
                        <td style="width:120px;">终端名称</td>
                        <td style="width:60px;">存储区位</td>
                        <td style="min-width:150px;">信息内容</td>
                        <td style="width:120px;">下发状态及时间</td>
                        <td style="width:120px;">回复状态及时间</td>
                        <td style="width:60px;">信息状态</td>
                        <td style="width:35px;">操作</td>
                        <td style="width:120px;">信息取消时间</td>
                        <td style="width:35px;">演示</td>
                        <td style="width:120px;">记录ID、创建时间</td>
                    </tr>
                </HeaderTemplate>
                <ItemTemplate>
                    <tr>
                         <td>
                            <input type="checkbox" name="chbDev<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).Status!=0 ? "Cancel" : ""%>" value="<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).DeviceIndexCode%>" />
                        </td>
                        <td><%#Container.ItemIndex + 1 + ((pageIndex - pageStart) * pageSize)%></td>
                        <td><%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).DeviceTypeCode%></td>
                        <td><p><%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).DeviceIndexCode%></p></td>
                        <td><%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).DeviceName%></td>
                        <td><%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).Info.MemoryNumber%></td>
                        <td>
                            <div id="lblName_<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).InfoId%>" class="info" style="height:45px;" title="<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).Info.InfoContent%>">
                                <%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).Info.InfoContent.Replace(" ", "&nbsp;").Replace("\r\n", "<br />")%>
                            </div>
                        </td>
                        <td>
                            <p>
                            <%#this.ParseOperateStatus(((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).DownStatus, 1)%>
                            <br />
                            <%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).DownTime%>
                            </p>
                        </td>
                        <td>
                            <p>
                            <%#this.ParseOperateStatus(((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).ResponseStatus, 2)%>
                            <br />
                            <%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).ResponseTime%>
                            </p>
                        </td>
                        <td><%#this.ParseInfoStatus(((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).Status)%></td>                        
                        <td>
                            <span class="oper-cell<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).Status!=0 ? "-cancel" : ""%>" style="text-align:center;">
                                <a onclick="showUpdateStatus(<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).Id%>, '<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).DeviceIndexCode%>', 3);">取消</a>
                            </span>
                        </td>
                        <td>
                            <p>
                            <%#this.ParseDeleteStatus(((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).DeleteStatus)%>
                            <br />
                            <%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).DeleteTime%>
                            </p>
                        </td>
                        <td> 
                            <a onclick="showDemo(<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).InfoId%>,<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).ScreenRows%>,<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).ScreenCols%>,<%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).ScreenFontSize%>);">演示</a>
                        </td>
                        <td>
                            <p>
                            <%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).InfoId%>
                            -
                            <%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).Id%>
                            <br />
                            <%#((Zyrh.Model.Led.LedScreenInfoDevice)Container.DataItem).CreateTime%>
                            </p>
                        </td>
                    </tr>
                </ItemTemplate>
                <FooterTemplate></table></FooterTemplate>
            </asp:Repeater>
        </div>
    </div>
    </form>
    <div id="bodyBottom">
        <div id="divPagination" runat="server" style="padding:0 5px;"></div>
        <div class="panel-left" style="width:80%;"><span id="lblError" runat="server"></span></div>
        <div class="panel-right"></div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
<script type="text/javascript" src="<%=Config.WebDir%>/common/js/md5.js"></script>
<script type="text/javascript">
    var pwEditType = null;
    var isNeedSave = false;
    $(window).load(function () {
        page.setPageTitle('<%=strTitle%>');

        $(".tblist tr:even").addClass("alternating");
        $(".tblist tr:first").removeClass();
        $(".tblist tr:first").addClass("trheader");
        
        var arrChbCancel = cms.util.$N('chbDevCancel');
        for(var i=0; i<arrChbCancel.length; i++){
            arrChbCancel[i].disabled = true;
        }
        $('.oper-cell-cancel').html('-');
    });

    $(window).resize(function () {
        setBoxSize();
    });

    function setBoxSize() {
        var boxSize = page.getBodySize();
        $('.listbox').height(boxSize.height - 25 - 28 - $('.operform').outerHeight());
    }
    
    
    function showUpdateStatus(id, devCodeList, status, title) {
        var strTitle = '';
        var infoId = $$('txtInfoId').val().trim();
        if(devCodeList == ''){
            devCodeList = cms.util.getCheckBoxCheckedValue('chbDev', ',');
        }
        
        if(devCodeList == ''){
            cms.box.alert({title:'提示信息', html:'请选择要取消的终端'});
            return false;
        } else {
            if(3 == status){
                strTitle = '确定要取消吗？';
            } else if(4 == status){
                strTitle = '确定要删除吗？';
            }
        }
        
        var config = {
            title: '提示信息',
            html: strTitle,
            callBack: showUpdateStatusAction,
            returnValue: {
                id: id,
                infoId: infoId,
                status: status,
                devCodeList: devCodeList
            }
        };
        cms.box.confirm(config);
    }

    function showUpdateStatusAction(pwobj, pwReturn) {
        if (pwReturn.dialogResult) {
            var id = pwReturn.returnValue.id;
            var status = pwReturn.returnValue.status;
            var infoId = pwReturn.returnValue.infoId;
            var devCodeList = pwReturn.returnValue.devCodeList;
            
            var urlparam = 'action=updateDeviceInfoStatus&id=' + id + '&status=' + status 
                + '&infoId=' + infoId + '&devCodeList=' + devCodeList;
            module.ajaxRequest({
                url: cms.util.path + '/ajax/led.aspx',
                data: urlparam,
                callBack: showUpdateStatusCallBack,
                param: {
                    status: status
                }
            });
        } else {
            pwobj.Hide();
        }
    }

    function showUpdateStatusCallBack(data, param) {
        if (!data.isJsonData()) {
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson(); //eval('(' + data + ')');
        if (1 == jsondata.result) {
            page.loadPage($$('txtCurrentPageUrl').val().trim());
        } else if (-1 == jsondata.result) {
            if (!module.dbConnectionError(jsondata.error)) {
                module.showErrorInfo(jsondata.msg, jsondata.error);
                return false;
            }
        } else {
            module.showErrorInfo(jsondata.msg, jsondata.error);
        }
        /*
        if(param.status == 3){
            cms.box.alert({title:'提示信息', html:'信息已取消。' + jsondata.msg});
        } else if(param.status == 4){
            cms.box.alert({title:'提示信息', html:'信息已删除。' + jsondata.msg});
        } else {
            cms.box.alert({title:'提示信息', html:'信息设置完成。' + jsondata.msg});
        }
        */
    }
    
    function showDemo(id, rows, cols, fontsize){
        var content = $('#lblName_' + id).attr('title');
        var r = fontsize > 0 ? cols / fontsize : 5;
        var c = fontsize > 0 ? rows / fontsize : 10;
        var url = 'ledScreen.aspx?rows=%s&cols=%s&simple=%s&content=%s'.format(
            [r, c, 1, escape(content)], '%s'
        );
        var size = module.checkWinSize([600, 400]);
        var config = {
            id: 'pwDemo',
            title: '演示效果',
            html: url,
            requestType: 'iframe',
            noBottom: true,
            maxAble: true,
            showMinMax: true,
            width: size[0],
            height: size[1]
        };
        cms.box.win(config);
    }
</script>
</asp:Content>