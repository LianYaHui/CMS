<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="phone.aspx.cs" Inherits="modules_config_sub_phone" %>
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
                电话录音本机号码设置：
                <br />
                <asp:TextBox ID="txtSoundRecordPhoneNumberList" runat="server" CssClass="txt w600"></asp:TextBox>
                <br />
                <span class="explain">每个号码之间以英文逗号“,”分隔，最多16个号码</span>
                <br />
                短信发送号码设置：
                <br />
                <asp:TextBox ID="txtSmsPhoneNumberList" runat="server" CssClass="txt w600"></asp:TextBox>
                <br />
                <span class="explain">每个号码之间以英文逗号“,”分隔，最多8个号码</span>
                <div style="padding:10px 0;clear:both;">
                    <label style="float:left;color:#999;">为防止误操作，请输入帐户密码：</label><br />
                    <input id="txtUserPwd" type="password" class="txt pwd w200" maxlength="30" runat="server" style="float:left;" />
                    <label id="lblUserPwd" runat="server" style="float:left;color:#f00;border:none;background-color:#fff;"></label>
                </div>
                <br />
                <a class="btn btnc24" onclick="updatePhoneNumber();"><span class="w85">保存</span></a>
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
    
    function updatePhoneNumber(){
        var userPwd = $$('txtUserPwd').val().trim();
        if('' == userPwd){
            page.showPrompt('请输入密码！', $$('lblUserPwd'), infoType.warning);
            $$('txtUserPwd').focus();
            return false;
        }
        var config = {
            id: 'pwUpdate',
            title: '更新电话录音短信号码',
            html: '确定要更新电话录音短信号码吗？',
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