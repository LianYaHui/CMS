<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="infoType.aspx.cs" Inherits="modules_ledScreen_sub_infoType"%>
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
            <a class="btn imgbtn" onclick="showEditType('action=add&parentId=<%=parentId%>','新增分类');"><i class="icon-add"></i><span>新增分类</span></a>
            <a class="btn imgbtn" onclick="showDeleteType();"><i class="icon-delete"></i><span>删除分类</span></a>
            <span style="margin-left:5px;">每页显示：</span>
            <asp:DropDownList ID="ddlPageSize" runat="server" CssClass="select" AutoPostBack="True" 
                OnSelectedIndexChanged="ddlPageSize_SelectedIndexChanged">
                <asp:ListItem Value="1">1</asp:ListItem>
                <asp:ListItem Value="5">5</asp:ListItem>
                <asp:ListItem Value="10">10</asp:ListItem>
                <asp:ListItem Value="15" Selected="true">15</asp:ListItem>
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
                <asp:DropDownList ID="ddlParentId" runat="server" CssClass="select" AutoPostBack="true"
                    onselectedindexchanged="ddlParentId_SelectedIndexChanged">
                </asp:DropDownList>
                <asp:DropDownList ID="ddlLevel" runat="server" CssClass="select" AutoPostBack="true"
                    onselectedindexchanged="ddlLevel_SelectedIndexChanged" style="margin-left:5px;">
                </asp:DropDownList>
                <asp:DropDownList ID="ddlEnabled" runat="server" CssClass="select" AutoPostBack="true" 
                    style="margin-left:5px;" onselectedindexchanged="ddlEnabled_SelectedIndexChanged">
                    <asp:ListItem Value="-1">选择启用状态</asp:ListItem>
                    <asp:ListItem Value="1">启用</asp:ListItem>
                    <asp:ListItem Value="0">未启用</asp:ListItem>
                </asp:DropDownList>
                <asp:DropDownList ID="ddlSearchField" runat="server" CssClass="select" AutoPostBack="false" 
                    style="margin:0 0 0 5px;">
                    <asp:ListItem Value="">选择搜索类型</asp:ListItem>
                    <asp:ListItem Value="Name">按分类名称</asp:ListItem>
                    <asp:ListItem Value="Code">按分类编号</asp:ListItem>
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
                    <table class="tblist" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;min-width:1100px;">
                    <tr class="trheader">
                        <td style="width:25px;"><input type="checkbox" name="chbTypeAll" onclick="cms.util.selectCheckBox('chbType',3);" /></td>
                        <td style="width:35px;">序号</td>
                        <td style="width:70px;">分类编号</td>
                        <td style="width:120px;">分类名称</td>
                        <td style="width:60px;">分类层级</td>
                        <td style="width:100px;">上级分类</td>
                        <td style="width:120px;">存储区位</td>
                        <td style="width:60px;">默认有效期</td>
                        <td style="min-width:150px;">预警信号</td>
                        <td style="width:60px;">是否启用</td>
                        <td style="width:60px;">排序编号</td>
                        <td style="width:120px;">创建时间</td>
                        <td style="width:140px;">操作</td>
                    </tr>
                </HeaderTemplate>
                <ItemTemplate>
                    <tr>
                        <td>
                            <input type="checkbox" name="chbType" value="<%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeId%>" />
                        </td>
                        <td><%#Container.ItemIndex + 1 + ((pageIndex - pageStart) * pageSize)%></td>
                        <td><%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeCode%></td>
                        <td><span id="lblName_<%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeId%>">
                            <%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeName%>
                            </span>
                        </td>
                        <td><%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).Level %></td>
                        <td><%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).ParentType.TypeName%></td>
                        <td><%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeConfig.MemoryNumber %></td>
                        <td><%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeConfig.ValidityHour %>小时</td>
                        <td><%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).SignalNameList %></td>
                        <td><%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).Enabled == 1 ? "启用" : "不启用" %></td>
                        <td><%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).SortOrder%></td>
                        <td><%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).CreateTime%></td>
                        <td>
                            <div class="oper-cell">
                                <a onclick="showEditType('action=edit&typeId=<%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeId%>','编辑分类信息');">编辑</a>
                                <span>|</span>
                                <a onclick="showDeleteType(<%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeId%>,'<%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeName%>');">删除</a>
                                <span>|</span>
                                <a onclick="showEditType('action=add&parentId=<%#((Zyrh.Model.Led.InfoTypeInfo)Container.DataItem).TypeId%>','新增子分类');">新增子分类</a>
                            </div>
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
<script type="text/javascript" src="<%=Config.WebDir%>/js/common/md5.js"></script>
<script type="text/javascript">
    var pwEditType = null;
    var isNeedSave = false;
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

    function showDeleteType(id, moduleName) {
        var idList = id == undefined ? cms.util.getCheckBoxCheckedValue('chbType', ',') : ('' + id);
        var count = cms.util.getCheckBoxCheckedCount('chbType');
        if (idList.equals('')) {
            cms.box.alert({ title: '提示信息', html: '请选择要删除的分类!' });
            return false;
        }
        var strTitle = id == undefined ? ('确定要删除选中的<b class="b-num">' + count + '</b>个分类吗？') : ('确定要删除“' + moduleName + '”分类吗？');
        strTitle += '<br />请输入密码：<input type="password" id="txtOperatePwd_Del" class="txt pwd" maxlength="30" />'
        var config = {
            title: '提示信息',
            html: strTitle,
            callBack: showDeleteTypeAction,
            returnValue: {
                idList: idList,
                objPwd: 'txtOperatePwd_Del'
            }
        };
        cms.box.confirmForm(config);
    }

    function showDeleteTypeAction(pwobj, pwReturn) {
        if (pwReturn.dialogResult) {
            var obj = cms.util.$(pwReturn.returnValue.objPwd);
            var pwd = obj.value.trim();
            if (pwd.equals(string.empty)) {
                cms.box.msgAndFocus(obj, { title: '提示信息', html: '请输入密码!' });
                return false;
            }
            var idList = pwReturn.returnValue.idList;
            var urlparam = 'action=deleteType&idList=' + idList + '&pwd=' + md5(pwd);

            module.ajaxRequest({
                url: module.path + '/ajax/config.aspx',
                data: urlparam,
                callBack: showDeleteTypeCallBack
            });
        } else {
            pwobj.Hide();
        }
    }

    function showDeleteTypeCallBack(data, param) {
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
</script>
</asp:Content>