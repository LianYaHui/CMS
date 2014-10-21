<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="config.aspx.cs" Inherits="modules_config_config" %>
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
                    <td class="w150">系统名称：</td>
                    <td><input type="text" id="txtWebName" runat="server" class="txt w300" /></td>
                </tr>
                <tr>
                    <td>版权信息：</td>
                    <td><input type="text" id="txtCopyright" runat="server" class="txt w400" style="font-family:Arial,宋体;" /></td>
                </tr>
                <tr>
                    <td>登录失败启用验证码：</td>
                    <td>
                        <select id="ddlLoginFailedTimes" runat="server" class="select w150">
                            <option value="-1">不启用</option>
                            <option value="0">一直启用验证码</option>
                            <option value="1">失败1次后启用</option>
                            <option value="3" selected="selected">失败3次后启用</option>
                            <option value="5">失败5次后启用</option>
                            <option value="10">失败10次后启用</option>
                        </select>
                        <span style="color:#999;">建议失败3次后启用</span>
                    </td>
                </tr>
            </table>            
            <table cellpadding="0" cellspacing="0" class="tbform" id="tbConfig" style="display:none;">
                <tr>
                    <td class="w150">是否禁用右键菜单：</td>
                    <td>
                        <select id="ddlDisabledContextMenu" runat="server" class="select w150">
                            <option value="1">禁用</option>
                            <option value="0">不禁用</option>
                        </select>
                        <span style="color:#999;">建议禁用</span>
                    </td>
                </tr>
                <tr>
                    <td>是否保存管理员用户名：</td>
                    <td>
                        <select id="ddlSaveAdminName" runat="server" class="select w150">
                            <option value="1">保存</option>
                            <option value="0">不保存</option>
                        </select>
                        <span style="color:#999;">说明：若不保存管理员用户名，自动登录功能将无效</span>
                    </td>
                </tr>
                <tr>
                    <td>是否保存管理员密码：</td>
                    <td>
                        <select id="ddlSaveAdminPassword" runat="server" class="select w150">
                            <option value="1">保存</option>
                            <option value="0">不保存</option>
                        </select>
                        <span style="color:#999;">说明：若不保存管理员密码，自动登录功能将无效；若保存密码，则用户名也将保存</span>
                    </td>
                </tr>
                <tr>
                    <td>是否启用自动登录：</td>
                    <td>
                        <select id="ddlAdminAutoLogin" runat="server" class="select w150">
                            <option value="1">启用</option>
                            <option value="0">不启用</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>是否启用提交方式验证：</td>
                    <td>
                        <select id="ddlValidateRequestType" runat="server" class="select w150">
                            <option value="1">启用</option>
                            <option value="0">不启用</option>
                        </select>
                        <span style="color:#999;">建议启用</span>
                    </td>
                </tr>
                <tr style="display:none;">
                    <td>是否启用提交来源验证：</td>
                    <td>
                        <select id="ddlValidateUrlReferrer" runat="server" class="select w150">
                            <option value="1">启用</option>
                            <option value="0">不启用</option>
                        </select>
                    </td>
                </tr>
                <tr style="display:none;">
                    <td>是否启用表单令牌验证：</td>
                    <td>
                        <select id="ddlValidateRequestToken" runat="server" class="select w150">
                            <option value="1">启用</option>
                            <option value="0">不启用</option>
                        </select>
                    </td>
                </tr>
            </table>
            <table cellpadding="0" cellspacing="0" class="tbform" style="margin:5px 0 0;">
                <tr>
                    <td class="w150"></td>
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
                        <input id="btnSave" type="submit" value="submit" runat="server" onserverclick="btnSave_ServerClick" style="visibility:hidden;width:0;height:0;" />
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
    var isDebug = false;
    var arrKey = [];
    
    $(window).load(function(){
        page.setPageTitle('<%=strTitle%>');
    
        initial();
    });
    
    $(window).resize(function(){
    
    });
        
    function initial(){
        document.onkeypress = function(e){
            var e = e || event;
            var cn = e.keyCode;
            var e = e||event;
	        var s = String.fromCharCode(e.keyCode).toUpperCase()
	        var t = new Date().getTime();
	
            if(s == 'B' || s == 'C' || s == 'D' || s == 'E' || s == 'G' || s == 'L' || s == 'O' || s == 'S' || s == 'U'){
                arrKey.push([s, t]);
            }
            
            checkIsDebug(s, t);
        };
    }
    //在3秒钟内敲击2遍DEBUG显示高级选项
    //在3秒钟内敲击2遍CLOSE关闭高级选项
    function checkIsDebug(s, t){
        var count = 10;
        if(arrKey.length > count){
            arrKey.splice(0,1);
        }
        if(count == arrKey.length){
            var ts = arrKey[count-1][1] - arrKey[0][1];
            var strCode = '';
            if(ts > 3000){
                arrKey.length = 0;
                arrKey.push([s, t]);
            } else {
                for(var i=0; i<count; i++){
                    strCode += arrKey[i][0];
                }
                if('DEBUGDEBUG' == strCode){
                    isDebug = true;
                } else if('CLOSECLOSE' == strCode){
                    isDebug = false;
                }
                showConfig();
            }
        }
    }
    
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
            html: '确定要修改系统配置吗？',
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