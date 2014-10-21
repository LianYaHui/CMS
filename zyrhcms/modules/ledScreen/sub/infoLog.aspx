<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="infoLog.aspx.cs" Inherits="modules_ledScreen_sub_infoLog" %>
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
            <a class="btn imgbtn" onclick="parent.addInfo();"><i class="icon-add"></i><span>信息发布</span></a>
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
        <div class="operform">
            <div class="formpanel">
                <asp:DropDownList ID="ddlType" runat="server" CssClass="select" AutoPostBack="true"
                    onselectedindexchanged="ddlType_SelectedIndexChanged">
                </asp:DropDownList>
                <asp:DropDownList ID="ddlInfoStatus" runat="server" CssClass="select" AutoPostBack="true"
                    onselectedindexchanged="ddlInfoStatus_SelectedIndexChanged" style="margin-left:5px;">
                    <asp:ListItem Value="-1">选择信息状态</asp:ListItem>
                    <asp:ListItem Value="2">被覆盖的</asp:ListItem>
                    <asp:ListItem Value="3">被取消的</asp:ListItem>
                    <asp:ListItem Value="5">已过期的</asp:ListItem>
                </asp:DropDownList>
                <asp:DropDownList ID="ddlSendStatus" runat="server" CssClass="select" AutoPostBack="true"
                    onselectedindexchanged="ddlSendStatus_SelectedIndexChanged" style="margin-left:5px;">
                    <asp:ListItem Value="-1">选择发送状态</asp:ListItem>
                    <asp:ListItem Value="0">未发送的</asp:ListItem>
                    <asp:ListItem Value="1">发送成功的</asp:ListItem>
                    <asp:ListItem Value="2">发送失败的</asp:ListItem>
                </asp:DropDownList>
                <asp:DropDownList ID="ddlTiming" runat="server" CssClass="select" AutoPostBack="true" 
                    style="margin-left:5px;" onselectedindexchanged="ddlTiming_SelectedIndexChanged">
                    <asp:ListItem Value="-1">选择发布状态</asp:ListItem>
                    <asp:ListItem Value="0">即时发布</asp:ListItem>
                    <asp:ListItem Value="1">预约发布</asp:ListItem>
                </asp:DropDownList>
                <asp:DropDownList ID="ddlSearchField" runat="server" CssClass="select" AutoPostBack="false" 
                    style="margin:0 0 0 5px;">
                    <asp:ListItem Value="Content">按信息内容</asp:ListItem>
                </asp:DropDownList>
                <input type="text" class="txt w120" id="txtKeywords" runat="server" maxlength="25" style="margin:0;" />
                <a onclick="loadData();" class="btn btnsearch" style="margin:0;"></a>
                <a onclick="loadAllData();" class="btn btnsearch-cancel" style="margin:0;"></a>
                <input id="btnSearch" type="submit" value="Search" onserverclick="btnSearch_ServerClick" runat="server" style="visibility:hidden;width:0;height:0;" />
            </div>
        </div>
        <div class="listbox">
            <asp:Repeater ID="rptList" runat="server">
                <HeaderTemplate>
                    <table class="tblist" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;min-width:1000px;">
                    <tr class="trheader">
                        <td style="width:25px;"><input type="checkbox" name="chbInfoAll" onclick="cms.util.selectCheckBox('chbInfo',3);" /></td>
                        <td style="width:35px;">序号</td>
                        <td style="width:100px;">信息分类</td>
                        <td style="width:60px;">发布类型</td>
                        <td style="width:60px;">存储区位</td>
                        <td style="min-width:120px;">信息内容</td>
                        <td style="width:120px;">开始、结束时间</td>
                        <td style="width:60px;">查看终端</td>
                        <td style="width:60px;">发送状态</td>
                        <td style="width:55px;">信息状态</td>
                        <%if(isLog==0){%><td style="width:35px;">操作</td><%}%>
                        <td style="width:120px;">信息ID、创建时间</td>
                    </tr>
                </HeaderTemplate>
                <ItemTemplate>
                    <tr>
                        <td>
                            <input type="checkbox" name="chbInfo" value="<%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).Id%>" />
                        </td>
                        <td><%#Container.ItemIndex + 1 + ((pageIndex - pageStart) * pageSize)%></td>
                        <td><%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).InfoType.TypeName%></td>
                        <td><%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).IsTiming == 0 ? "即时发布" : "预约发布" %></td>
                        <td><%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).MemoryNumber%></td>
                        <td><div id="lblName_<%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).Id%>" class="info" style="height:45px;" title="<%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).InfoContent%>">
                                <%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).InfoContent.Replace(" ", "&nbsp;").Replace("\r\n", "<br />")%>
                            </div>
                        </td>
                        <td>
                            <%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).StartTime %>
                            <div><%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).EndTime %></div>
                        </td>
                        <td>
                            <a onclick="showDeviceList(<%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).Id%>);">查看终端</a>
                            <a onclick="showDemo(<%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).Id%>);">演示</a>
                        </td>
                        <td><%#this.ParseSendStatus(((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).SendStatus)%></td>
                        <td><%#this.ParseInfoStatus(((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).InfoStatus)%></td>
                        <%if(isLog==0){%><td>
                            <span class="oper-cell" style="text-align:center;display:<%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).InfoStatus!=0 ? "none" : ""%>">
                                <a onclick="showUpdateStatus(<%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).Id%>,3);">取消</a>
                            </span>
                            <span class="oper-cell" style="display:<%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).InfoStatus ==0 && ((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).IsTiming == 1 ? "" : "none"%>">
                                <a onclick="showEditInfo('action=edit&Id=<%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).Id%>');">编辑</a>
                            </span>
                        </td><%}%>
                        <td>
                            <p>
                            <%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).Id%>
                            <br />
                            <%#((Zyrh.Model.Led.LedScreenInfo)Container.DataItem).CreateTime%>
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
    var isLog = <%=isLog%>;
    $(window).load(function () {
        page.setPageTitle('<%=strTitle%>');

        $(".tblist tr:even").addClass("alternating");
        $(".tblist tr:first").removeClass();
        $(".tblist tr:first").addClass("trheader");
    });

    $(window).resize(function () {
        setBoxSize();
    });

    function setBoxSize() {
        var boxSize = page.getBodySize();
        $('.listbox').height(boxSize.height - 25 - 28 - $('.operform').outerHeight());
    }

    function showEditType(param, title) {
        var strUrl = 'infoTypeEdit.aspx?%s'.format(param);
        var size = page.checkWinSize([700, 500]);
        var config = {
            id: 'pwEditType',
            title: title,
            html: strUrl,
            requestType: 'iframe',
            width: size[0],
            height: size[1],
            minWidth: 200,
            minAble: true,
            maxAble: true,
            showMinMax: true,
            noBottom: true,
            filter: false,
            callBack: editTypeCallBack
        };
        pwEditType = cms.box.win(config);
        cms.util.setWindowStatus();
    }

    function closeEditType() {
        pwEditType.Hide();
        page.loadPage($$('txtCurrentPageUrl').val().trim());
    }

    function editTypeCallBack(pwobj, pwReturn) {
        if (isNeedSave) {
            editTypeCloseConfirm();
        } else {
            page.loadPage($$('txtCurrentPageUrl').val().trim());
        }
    }

    function editTypeCloseConfirm() {
        var config = {
            title: '提示信息',
            html: '您还没有保存，确定要关闭窗口吗',
            callBack: editTypeCloseCallBack
        };
        cms.box.confirm(config);
    }

    function editTypeCloseCallBack(pwobj, pwReturn) {
        if (pwReturn.dialogResult) {
            page.loadPage($$('txtCurrentPageUrl').val().trim());
        }
        pwobj.Hide();
    }

    function showUpdateStatus(id, status, title) {
        var strTitle = '';
        if(3 == status){
            strTitle = '确定要取消吗？';
        } else if(4 == status){
            strTitle = '确定要删除吗？';
        }
        strTitle += '<br />请输入密码：<input type="password" id="txtOperatePwd_Del" class="txt pwd" maxlength="30" />';
        var config = {
            title: '提示信息',
            html: strTitle,
            callBack: showUpdateStatusAction,
            returnValue: {
                id: id,
                status: status,
                objPwd: 'txtOperatePwd_Del'
            }
        };
        cms.box.confirmForm(config);
        
        $('#txtOperatePwd_Del').focus();
    }

    function showUpdateStatusAction(pwobj, pwReturn) {
        if (pwReturn.dialogResult) {
            var obj = cms.util.$(pwReturn.returnValue.objPwd);
            var pwd = obj.value.trim();
            if (pwd.equals(string.empty)) {
                cms.box.msgAndFocus(obj, { title: '提示信息', html: '请输入密码!' });
                return false;
            }
            var id = pwReturn.returnValue.id;
            var status = pwReturn.returnValue.status;
            var urlparam = 'action=updateInfoStatus&id=' + id + '&status=' + status + '&pwd=' + md5(pwd);
            
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
    
    function showCopyInfo(id){
        var config = {
            title: '提示信息',
            html: '确定要复制信息吗？',
            callBack: showCopyInfoAction,
            returnValue: {
                id: id
            }
        };
        cms.box.confirmForm(config);
    }
    
    function showCopyInfoAction(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            parent.copyInfo(pwReturn.returnValue.id);
        }
        pwobj.Hide();
    }
    
    function showDeviceList(id){
        var size = page.checkWinSize([1000, 500]);
        var config = {
            id: 'pwDevList',
            title: '查看信息终端 (信息ID: ' + id + ')',
            html: 'infoDeviceList.aspx?infoId=' + id + '&isLog=' + isLog,
            requestType: 'iframe',
            noBottom: true,
            width: size[0],
            height: size[1],
            showMinMax: true,
            minAble: true,
            maxAble: true,
            minWidth: 260,
            callBack: showDeviceListCallBack
        };
        var pwobj = cms.box.win(config);
        //pwobj.Max();
    }
    
    function showDeviceListCallBack(pwobj, pwReturn){
         page.loadPage($$('txtCurrentPageUrl').val().trim());
    }

    function loadData() {
        if ($$('ddlSearchField').val().trim().equals('')) {
            $$('ddlSearchField').focus();
            return false;
        }
        $$('btnSearch').click()
    }

    function loadAllData() {
        $$('ddlSearchField').get(0).selectedIndex = 0;
        $$('txtKeywords').attr('value', '');
        $$('btnSearch').click()
    }
    
    function showDemo(id){
        var content = $('#lblName_' + id).attr('title');
        var url = 'ledScreen.aspx?content=' + escape(content);
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