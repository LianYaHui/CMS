<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="logo.aspx.cs" Inherits="modules_config_logo" %>
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
                <div>说明：上传LOGO图片之前，请先将LOGO图片文件大小处理成合适大小。</div>
                当前图片：
                <div style="overflow:auto;">
                    <asp:Image ID="imgLogo" runat="server" style="display:block;" />
                </div>
                <asp:Label ID="lblInfo" runat="server" Text=""></asp:Label>
                <a class="btn btnc22" onclick="delLogo();"><span>删除LOGO图片</span></a>
                <input id="btnDelLogo" type="button" value="删除LOGO图片" runat="server" style="visibility:hidden;width:1px;height:1px;" onserverclick="btnDelLogo_ServerClick" />
                <br />
                选择图片：<br />
                <asp:FileUpload ID="fileLogo" runat="server" CssClass="txt w200" />
                建议 图片高度小于40px，图片宽度小于500px，图片格式: .png|.gif|.jpg
                <br />
                LOGO名称：<br />
                <asp:TextBox ID="txtLogoName" runat="server" CssClass="txt w200"></asp:TextBox>
                <div style="padding:10px 0;clear:both;">
                    <label style="float:left;color:#999;">为防止误操作，请输入帐户密码：</label><br />
                    <input id="txtUserPwd" type="password" class="txt pwd w200" maxlength="30" runat="server" style="float:left;" />
                    <label id="lblUserPwd" runat="server" style="float:left;color:#f00;border:none;background-color:#fff;"></label>
                </div>
                <br />
                <a class="btn btnc24" onclick="uploadLogo();"><span class="w65">上传图片</span></a>
                <input id="btnUpload" type="submit" value="submit" runat="server" onserverclick="btnUpload_ServerClick" style="visibility:hidden;width:0;height:0;" />
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
    
    
    function uploadLogo(){
        var userPwd = $$('txtUserPwd').val().trim();
        if('' == userPwd){
            page.showPrompt('请输入密码！', $$('lblUserPwd'), infoType.warning);
            $$('txtUserPwd').focus();
            return false;
        }
        var config = {
            id: 'pwUpload',
            title: '更新LOGO',
            html: '确定要更新LOGO图片或名称吗？',
            callBack: uploadLogoCallBack
        };
        cms.box.confirm(config);
    }
    
    function uploadLogoCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            $$('btnUpload').click();
        }
        pwobj.Hide();
    }
    
    
    function delLogo(){
        var config = {
            id: 'pwDel',
            title: '删除LOGO图片',
            html: '确定要删除LOGO图片吗？',
            callBack: delLogoCallBack
        };
        cms.box.confirm(config);
    }
    
    function delLogoCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            $$('btnDelLogo').click();
        }
        pwobj.Hide();
    }
</script>
</asp:Content>