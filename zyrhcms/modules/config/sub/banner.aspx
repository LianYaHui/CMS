<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="banner.aspx.cs" Inherits="modules_config_banner" %>
<%@ MasterType VirtualPath="~/master/mpPage.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/page.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="bodyTitle"><span class="title"></span><span id="reload" class="reload"></span></div>
    <div id="bodyContent">
        <div class="form">
            <form id="Form1" action="" runat="server" method="post">
                选择图片<br />
                <asp:FileUpload ID="fileBanner" runat="server" CssClass="txt" /> 顶部背景图片 图片尺寸建议1280px×56px，图片格式：.png|.jpg|.gif
                <br />
                <asp:FileUpload ID="fileBannerIndex" runat="server" CssClass="txt" /> 首页顶部背景图片 图片尺寸960px×56px，图片格式：.png|.jpg|.gif
                <div style="padding:10px 0;clear:both;">
                    <label style="float:left;color:#999;">为防止误操作，请输入帐户密码：</label><br />
                    <input id="txtUserPwd" type="password" class="txt pwd w200" maxlength="30" runat="server" style="float:left;" />
                    <label id="lblUserPwd" runat="server" style="float:left;color:#f00;border:none;background-color:#fff;"></label>
                </div>
                <br />
                <a class="btn btnc22" onclick="uploadBanner();"><span>上传图片</span></a>
                <input id="btnUpload" type="submit" value="submit" runat="server" onserverclick="btnUpload_ServerClick" style="visibility:hidden;width:0;height:0;" />
                <br />
                当前顶部背景图片：<a class="btn btnc22" onclick="delBanner(1);"><span>删除顶部背景图片</span></a>
                <input id="btnDelBanner" type="button" value="删除顶部背景图片" runat="server" style="visibility:hidden;width:1px;height:1px;" onserverclick="btnDelBanner_ServerClick" />
                <div style="max-width:1280px;max-height:80px;overflow:auto;">
                    <asp:Image ID="imgBanner" runat="server" style="display:block;" />
                </div>
                <asp:Label ID="lblInfo" runat="server" Text=""></asp:Label>
                <br />
                当前首页顶部背景图片：<a class="btn btnc22" onclick="delBanner(2);"><span>删除首页顶部背景图片</span></a>
                <input id="btnDelIndexBanner" type="button" value="删除首页顶部背景图片" runat="server" style="visibility:hidden;width:1px;height:1px;" onserverclick="btnDelIndexBanner_ServerClick" />
                <div style="max-width:1000px;max-height:80px;overflow:auto;">
                    <asp:Image ID="imgBannerIndex" runat="server" style="display:block;" />
                </div>
                <asp:Label ID="lblInfoIndex" runat="server" Text=""></asp:Label>
            </form>
        </div>
    </div>    
    <div id="bodyBottom">
        <div class="panel-left" style="width:80%;"><span id="lblError" runat="server"></span></div>
        <div class="panel-right"></div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
<script type="text/javascript">
    $(window).load(function(){
        page.setPageTitle('<%=strTitle%>');
    });
    
    $(window).resize(function(){
    
    });
    
    
    function uploadBanner(){
        var userPwd = $$('txtUserPwd').val().trim();
        if('' == userPwd){
            page.showPrompt('请输入密码！', $$('lblUserPwd'), infoType.warning);
            $$('txtUserPwd').focus();
            return false;
        }
        var config = {
            id: 'pwUpload',
            title: '上传顶部背景图片',
            html: '确定要上传顶部背景图片吗？',
            callBack: uploadBannerCallBack
        };
        cms.box.confirm(config);
    }
    
    function uploadBannerCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            $$('btnUpload').click();
        }
        pwobj.Hide();
    }
    
    function delBanner(type){
        var config = {
            id: 'pwDel',
            title: '删除顶部背景图片',
            html: '确定要删除顶部背景图片吗？',
            callBack: delBannerCallBack,
            returnValue: type
        };
        cms.box.confirm(config);
    }
    
    function delBannerCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            if(1 == pwReturn.returnValue){
                $$('btnDelBanner').click();
            } else {
                $$('btnDelIndexBanner').click();
            }
        }
        pwobj.Hide();
    }
</script>
</asp:Content>