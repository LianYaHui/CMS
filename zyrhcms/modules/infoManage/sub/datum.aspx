<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="datum.aspx.cs" Inherits="modules_infoManage_sub_datum" %>
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
            <a class="btn imgbtn" onclick="showEditDatumWin('add','上传资料');"><i class="icon-add"></i><span>上传资料</span></a>
            <a class="btn imgbtn" onclick="showDeleteDatumWin();"><i class="icon-delete"></i><span>删除资料</span></a>
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
                            <td style="text-align:left; text-indent:5px;">资料名称</td>
                            <td style="width:160px;">文件名</td>
                            <td style="width:60px;">文件大小</td>
                            <td style="width:60px;">排序编号</td>
                            <td style="width:120px;">上传时间</td>
                            <td style="width:80px;">操作</td>
                        </tr>
                    </HeaderTemplate>
                    <ItemTemplate>
                        <tr>
                            <td><input type="checkbox" name="chbDatum" value="<%#((Zyrh.Model.Info.DatumInfo)Container.DataItem).Id%>" onclick="selectItem();" /></td>
                            <td><%#Container.ItemIndex + 1 + ((pageIndex - 1) * pageSize)%></td>
                            <td style="text-align:left; text-indent:5px;"><%#((Zyrh.Model.Info.DatumInfo)Container.DataItem).Title%></td>
                            <td><%#this.ShowFileName(((Zyrh.Model.Info.DatumInfo)Container.DataItem).FilePath)%></td>
                            <td><%#this.ShowFileSize(((Zyrh.Model.Info.DatumInfo)Container.DataItem).FileSize)%></td>
                            <td><%#((Zyrh.Model.Info.DatumInfo)Container.DataItem).SortOrder %></td>
                            <td><%#((Zyrh.Model.Info.DatumInfo)Container.DataItem).UploadTime%></td>
                            <td>
                                <a onclick="showEditDatumWin('action=edit&id=<%#((Zyrh.Model.Info.DatumInfo)Container.DataItem).Id%>','编辑资料');">编辑</a>
                                <a href="<%=Config.WebDir%><%#((Zyrh.Model.Info.DatumInfo)Container.DataItem).FilePath %>" target="_blank">下载</a>
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
    var pwEditDatum = null;
    $(window).load(function(){
        page.setPageTitle('<%=strTitle%>');
    
    });
    
    $(window).resize(function(){
    
    });
    
    function showEditDatumWin(param, title){
        var strUrl = cms.util.path + '/modules/infoManage/sub/datumEdit.aspx?%s'.format(param);
        var config = {
            title: title,
            html: strUrl,
            requestType: 'iframe',
            noBottom: true,
            width: 520,
            height: 320,
            maxAble: true,
            showMinMax: true,
            filter: false,
            callBack: editDatumCallBack
        };
        pwEditDatum = cms.box.win(config);
    }
    
    function closeEditDatum(){
        pwEditDatum.Hide();
        page.loadPage($$('txtCurrentPageUrl').val().trim());
    }

    function editDatumCallBack(pwobj, pwReturn){
        page.loadPage($$('txtCurrentPageUrl').val().trim());
    }
    
    function showDeleteDatumWin(){
        var idList = cms.util.getCheckBoxCheckedValue('chbDatum');
        if('' == idList){
            cms.box.alert({title:'提示信息', html:'请选择要删除的资料信息'});
            return false;
        }
        var config = {
            title: '提示信息',
            html: '删除后不可恢复，确定要删除选中的资料信息吗？',
            callBack: deleteDatum,
            returnValue: {
                idList: idList
            }
        };
        cms.box.confirm(config);
    }
    
    function deleteDatum(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            var urlparam = 'action=deleteDatum&idList=' + pwReturn.returnValue.idList;
            module.ajaxRequest({
                url: cms.util.path + '/ajax/datum.aspx',
                data: urlparam,
                callBack: deleteDatumCallBack
            });
        }
        pwobj.Hide();
    }
    
    function deleteDatumCallBack(data, param){
        if(!data.isJsonData()){
            module.showJsonErrorData(data);
            return false;
        }
        var jsondata = data.toJson();// eval('(' + data + ')');
        if(jsondata.result != 1){
            module.showErrorInfo(jsondata.msg, jsondata.error);
            return false;
        }
        page.loadPage($$('txtCurrentPageUrl').val().trim());
    }
    
    
    function selectAll(obj){
        if(obj.checked){
            cms.util.selectCheckBox('chbDatum', 1);
        } else {
            cms.util.selectCheckBox('chbDatum', 2);
        }
    }
    
    function selectItem(){
        var arr = cms.util.$N('chbDatum');
        var c = cms.util.getCheckBoxCheckedCount('chbDatum');
        
        cms.util.$('chbAll').checked = arr.length == c;
    }
</script>
</asp:Content>

