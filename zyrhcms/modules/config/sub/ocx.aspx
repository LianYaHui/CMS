<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="ocx.aspx.cs" Inherits="modules_config_sub_ocx" %>
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
                <div>
                    说明：<br />
                    OCX控件程序更新后，记得修改OCX控件版本。<br />
                    当客户端安装的OCX控件版本低于WEB平台配置的OCX控件版本，视频预览时会提示客户端升级OCX控件。
                </div>
                OCX控件版本：
                <br />                
                <asp:TextBox ID="txtOcxVersion" runat="server" CssClass="txt w200"></asp:TextBox>
                <div style="padding:10px 0;clear:both;">
                    <label style="float:left;color:#999;">为防止误操作，请输入帐户密码：</label><br />
                    <input id="txtUserPwd" type="password" class="txt pwd w200" maxlength="30" runat="server" style="float:left;" />
                    <label id="lblUserPwd" runat="server" style="float:left;color:#f00;border:none;background-color:#fff;"></label>
                </div>
                <br />
                <a class="btn btnc24" onclick="updateOcxVersion();"><span class="w85">更新OCX版本</span></a>
                <input id="btnUpdate" type="submit" value="submit" runat="server" onserverclick="btnUpdate_ServerClick" style="visibility:hidden;width:0;height:0;" />
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
    
    
    function updateOcxVersion(){
        var userPwd = $$('txtUserPwd').val().trim();
        if('' == userPwd){
            page.showPrompt('请输入密码！', $$('lblUserPwd'), infoType.warning);
            $$('txtUserPwd').focus();
            return false;
        }
        var config = {
            id: 'pwUpdate',
            title: '更新OCX控件版本',
            html: '确定要更新OCX控件版本吗？',
            callBack: updateOcxVersionCallBack
        };
        cms.box.confirm(config);
    }
    
    function updateOcxVersionCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            $$('btnUpdate').click();
        }
        pwobj.Hide();
    }
</script>
</asp:Content>