<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="bulletin.aspx.cs" Inherits="modules_infoManage_sub_bulletin"%>
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
    <div id="bodyTitle">
        <span class="title"></span><span id="reload" class="reload"></span>
        <div class="tools">
            <a class="btn imgbtn" onclick="showEditBulletinWin('','发布公告');"><i class="icon-add"></i><span>发布公告</span></a>
            <a class="btn imgbtn" onclick="showDeleteBulletinWin();"><i class="icon-delete"></i><span>删除公告</span></a>
        </div>
    </div>
    <div id="bodyContent">
        <div class="form">
            <form id="Form1" action="" runat="server" method="post"> 
                <input type="hidden" id="txtCurrentPageUrl" runat="server" />
                <div class="listbox">
                <asp:Repeater ID="rptList" runat="server">
                    <HeaderTemplate>
                        <table class="tblist" cellpadding="0" cellspacing="0" style="text-align:center;width:auto;min-width:780px;">
                        <tr class="trheader">
                            <td style="width:30px;"><input type="checkbox" id="chbAll" onclick="selectAll(this);" /></td>
                            <td style="width:35px;">序号</td>
                            <td style="text-align:left; text-indent:5px;">公告标题</td>
                            <td style="width:120px;">开始时间</td>
                            <td style="width:120px;">结束时间</td>
                            <td style="width:60px;">是否发布</td>
                            <td style="width:60px;">排序编号</td>
                            <td style="width:120px;">创建时间</td>
                            <td style="width:80px;">操作</td>
                        </tr>
                    </HeaderTemplate>
                    <ItemTemplate>
                        <tr>
                            <td><input type="checkbox" name="chbBulletin" value="<%#((Zyrh.Model.Info.BulletinInfo)Container.DataItem).Id%>" onclick="selectItem();" /></td>
                            <td><%#Container.ItemIndex + 1 + ((pageIndex - 1) * pageSize)%></td>
                            <td style="text-align:left; text-indent:5px;"><%#((Zyrh.Model.Info.BulletinInfo)Container.DataItem).Title%></td>
                            <td><%#((Zyrh.Model.Info.BulletinInfo)Container.DataItem).StartTime%></td>
                            <td><%#((Zyrh.Model.Info.BulletinInfo)Container.DataItem).EndTime%></td>
                            <td><%#((Zyrh.Model.Info.BulletinInfo)Container.DataItem).IsValidate == 1 ? "已发布" : "未发布" %></td>
                            <td><%#((Zyrh.Model.Info.BulletinInfo)Container.DataItem).SortOrder %></td>
                            <td><%#((Zyrh.Model.Info.BulletinInfo)Container.DataItem).CreateTime%></td>
                            <td>
                                <a onclick="showEditBulletinWin('action=edit&id=<%#((Zyrh.Model.Info.BulletinInfo)Container.DataItem).Id%>','编辑公告');">编辑</a>
                                <a onclick="showBulletinDetail(<%#((Zyrh.Model.Info.BulletinInfo)Container.DataItem).Id%>);">查看</a>
                            </td>
                        </tr>
                    </ItemTemplate>
                    <FooterTemplate></table></FooterTemplate>
                </asp:Repeater>
                </div>
            </form>
        </div>
    </div>
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
<script type="text/javascript">
    var pwEditBulletin = null;
    $(window).load(function(){
        page.setPageTitle('<%=strTitle%>');
    
    });
    
    $(window).resize(function(){
    
    });
    
    function showEditBulletinWin(param, title){
        var strUrl = cms.util.path + '/modules/infoManage/sub/bulletinEdit.aspx?%s'.format(param);
        var config = {
            title: title,
            html: strUrl,
            requestType: 'iframe',
            noBottom: true,
            width: 760,
            height: 460,
            maxAble: true,
            showMinMax: true,
            filter: false,
            callBack: editBulletinCallBack
        };
        
        pwEditBulletin = cms.box.win(config);
        cms.util.setWindowStatus();
    }
    
    function closeEditBulletin(){
        pwEditBulletin.Hide();
        page.loadPage($$('txtCurrentPageUrl').val().trim());
    }

    function editBulletinCallBack(pwobj, pwReturn){
        page.loadPage($$('txtCurrentPageUrl').val().trim());
    }

    function showDeleteBulletinWin(){
        var idList = cms.util.getCheckBoxCheckedValue('chbBulletin');
        if('' == idList){
            cms.box.alert({title:'提示信息', html:'请选择要删除的公告信息'});
            return false;
        }
        var config = {
            title: '提示信息',
            html: '删除后不可恢复，确定要删除选中的公告信息吗？',
            callBack: deleteBulletin,
            returnValue: {
                idList: idList
            }
        };
        cms.box.confirm(config);
    }
    
    function deleteBulletin(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var urlparam = 'action=deleteBulletin&idList=' + pwReturn.returnValue.idList;
            module.ajaxRequest({
                url: cms.util.path + '/ajax/bulletin.aspx',
                data: urlparam,
                callBack: deleteBulletinCallBack
            });
        }
        pwobj.Hide();
    }
    
    function deleteBulletinCallBack(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = eval('(' + data + ')');
        if(jsondata.result != 1){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        page.loadPage($$('txtCurrentPageUrl').val().trim());
    }
        
    function showBulletinDetail(id){
        var url = cms.util.path + '/modules/infoManage/sub/bulletinDetail.aspx?id=' + id;
        var config = {
            title: '公告信息',
            html: url,
            requestType: 'iframe',
            noBottom: true,
            width: 720,
            height: 450,
            maxAble: true,
            showMinMax: true
        };
        
        cms.box.win(config);
    }
    
    function selectAll(obj){
        if(obj.checked){
            cms.util.selectCheckBox('chbBulletin', 1);
        } else {
            cms.util.selectCheckBox('chbBulletin', 2);
        }
    }
    
    function selectItem(){
        var arr = cms.util.$N('chbBulletin');
        var c = cms.util.getCheckBoxCheckedCount('chbBulletin');
        
        cms.util.$('chbAll').checked = arr.length == c;
    }
</script>
</asp:Content>