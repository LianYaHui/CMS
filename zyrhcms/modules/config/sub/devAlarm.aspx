<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="devAlarm.aspx.cs" Inherits="modules_config_sub_devAlarm"%>
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
            <table cellpadding="0" cellspacing="0" class="tbform">
                <tr>
                    <td class="w180">是否显示设备报警事件信息：</td>
                    <td>
                        <select id="ddlShowDeviceAlarmEvent" runat="server" class="select w150">
                            <option value="0">不显示报警</option>
                            <option value="1">显示报警</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>是否播放设备报警事件声音提示：</td>
                    <td>
                        <select id="ddlPlayDeviceAlarmSound" runat="server" class="select w150">
                            <option value="0">不播放报警声音</option>
                            <option value="1">播放报警声音</option>
                        </select>
                    </td>
                </tr>
            </table>
            
            <table cellpadding="0" cellspacing="0" class="tbform" style="margin:5px 0 0;">
                <tr>
                    <td class="w180"></td>
                    <td>
                        <label style="float:left;color:#999;">为防止误操作，请输入帐户密码：</label><br />
                        <input id="txtUserPwd" type="password" class="txt pwd w200" maxlength="30" runat="server" style="float:left;" />
                        <label id="lblUserPwd" runat="server" style="float:left;color:#f00;border:none;background-color:#fff;"></label>
                    </td>
                </tr>
                <tr>
                    <td class="w80"></td>
                    <td style="padding:10px 0 0;">
                        <a class="btn btnc24" onclick="saveConfig();"><span class="w50">保存</span></a>
                        <input id="btnSave" type="submit" value="submit" runat="server" onserverclick="btnSave_ServerClick" class="btn-hide" />
                    </td>
                </tr>
            </table>
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
    
    function showConfig(){
        if(isDebug){
            $('#tbConfig').show();
        } else {
            $('#tbConfig').hide();
        }
    }
    
    function saveConfig(){
        var userPwd = $$('txtUserPwd').val().trim();
        if('' == userPwd){
            page.showPrompt('请输入密码！', $$('lblUserPwd'), infoType.warning);
            $$('txtUserPwd').focus();
            return false;
        }
        var config = {
            id: 'pwSave',
            title: '修改配置',
            html: '确定要修改设备报警事件配置吗？',
            callBack: saveConfigCallBack
        };
        cms.box.confirm(config);
    }
    
    function saveConfigCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            $$('btnSave').click();
        }
        pwobj.Hide();
    }
</script>
</asp:Content>