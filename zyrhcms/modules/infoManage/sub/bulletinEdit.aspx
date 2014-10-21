<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="bulletinEdit.aspx.cs" Inherits="modules_infoManage_sub_bulletinEdit" ValidateRequest="false" %>
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
    <script type="text/javascript" src="<%=Config.WebDir%>/common/js/xheditor/xheditor.js"></script>
    <script type="text/javascript" src="<%=Config.WebDir%>/common/js/xheditor/xheditor_lang/zh-cn.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
<div id="bodyTitle"><div id="lblPrompt" runat="server"></div></div>
<div id="bodyContent">
    <form action="" method="post" runat="server">
        <input id="txtAction" type="hidden" runat="server"/>
        <input type="hidden" id="txtId" runat="server" />
        <table cellpadding="0" cellspacing="0" class="tbform" style="margin-left:10px;">
            <tr>
                <td class="w70">公告标题：</td>
                <td colspan="3"><input type="text" id="txtTitle" class="txt w400" runat="server" maxlength="64" /></td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="" style="margin-left:10px;">
            <tr>
                <td class="w70" style="vertical-align:top;">公告内容：</td>
                <td>
                    <textarea id="txtContent" cols="20" rows="2" runat="server" style="width:650px; height:240px;"></textarea>
                </td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tbform" style="margin-left:10px;">
            <tr>
                <td class="w70">开始时间：</td>
                <td><input type="text" id="txtStartTime" class="txt w120" runat="server" readonly="readonly" /></td>
                <td class="w70">结束时间：</td>
                <td><input type="text" id="txtEndTime" class="txt w120" runat="server" readonly="readonly" /></td>
            </tr>
            <tr>
                <td>是否发布：</td>
                <td colspan="3">
                    <label><input type="radio" name="rbValidate" value="1" runat="server" id="rbValidate1" />发布</label>
                    <label><input type="radio" name="rbValidate" value="0" runat="server" id="rbValidate0" />不发布</label>
                    <span style="color:#999;">若设置为不发布，该公告信息不会出现在首页“公告信息”中。</span>
                </td>
            </tr>
            <tr>
                <td>排序编号：</td>
                <td colspan="3">
                    <input type="text" id="txtSortOrder" class="txt w80" runat="server" maxlength="8" value="0" onkeyup="value=value.replace(/[^\d]/g,'')" onblur="value=value.replace(/[^\d]/g,'')" />
                    <span style="color:#999;">降序排列，数字大的排在前面</span>
                </td>
            </tr>
            <tr>
                <td>接受对象：</td>
                <td colspan="3">
                    <input type="text" readonly="readonly" id="txtUnitName" class="txt w500" />
                </td>
            </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tbform" style="margin-left:10px;">
            <tr>
                <td class="w70"></td>
                <td>
                    <a class="btn btnc24" onclick="saveBulletin();"><span class="w75">确认,保存</span></a>
                    <input id="btnSave" type="submit" value="确定" onserverclick="btnSave_ServerClick" runat="server" style="visibility:hidden;width:0;height:0;" />
                </td>
            </tr>
        </table>
    </form>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript"> 
    /*
    $(".tbform tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
    */
    $(document).ready(function(){ 
        $$('txtContent').xheditor({
            skin:'o2007silver',tools:'my',upImgUrl:"../../upload/upload.aspx?dir=bulletin&type=pic",upImgExt:"jpg,jpeg,gif,png"
        }); 
        $$("txtStartTime").focus(function(){
            WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss'});
        });
        $$("txtEndTime").focus(function(){
            WdatePicker({skin:'ext',minDate:'2012-09-01 0:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss'});
        });
    });
    
    function saveBulletin(){
        var strTitle = $$('txtTitle').val().trim();
        var strContent = $$('txtContent').val().trim();
        var strStartTime = $$('txtStartTime').val().trim();
        var strEndTime = $$('txtEndTime').val().trim();
        
        if('' == strTitle){
            cms.box.msgAndFocus(page.$('txtTitle'), {title:'提示信息', html:'请输入公告标题！'});
        } else if('' == strContent){
            //cms.box.alert({title:'提示信息', html:'请输入公告内容！'});
            cms.box.msgAndFocus(page.$('txtContent'), {title:'提示信息', html:'请输入公告内容！'});
        } else if('' == strStartTime){
            cms.box.msgAndFocus(page.$('txtStartTime'), {title:'提示信息', html:'请选择开始时间！'});
        } else if('' == strEndTime){
            cms.box.msgAndFocus(page.$('txtEndTime'), {title:'提示信息', html:'请选择结束时间！'});
        } else {
            $$('btnSave').click();
        }
    }
</script>
</asp:Content>