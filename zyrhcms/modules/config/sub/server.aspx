<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="server.aspx.cs" Inherits="modules_config_sub_server" %>
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
            <h3>GPRS服务器</h3>
            <table cellpadding="0" cellspacing="0" class="tbform">
                <tr>
                    <td class="w120">Gprs服务器IP：</td>
                    <td class="w150"><input type="text" id="txtGprsServerIp" runat="server" class="txt w120" maxlength="20" /></td>
                    <td class="w110">Gprs服务器Port：</td>
                    <td><input type="text" id="txtGprsServerPort" runat="server" class="txt w50" maxlength="5" onkeyup="value=value.replace(/[^\d]/g,'')" onblur="value=value.replace(/[^\d]/g,'')" /></td>
                </tr>
            </table>
            <h3>LED服务器</h3>
            <table cellpadding="0" cellspacing="0" class="tbform">
                <tr>
                    <td class="w120">LED服务器IP：</td>
                    <td class="w150"><input type="text" id="txtLedServerIp" runat="server" class="txt w120" maxlength="20" /></td>
                    <td class="w110">LED服务器Port：</td>
                    <td><input type="text" id="txtLedServerPort" runat="server" class="txt w50" maxlength="5" onkeyup="value=value.replace(/[^\d]/g,'')" onblur="value=value.replace(/[^\d]/g,'')" /></td>
                </tr>
            </table>
            <h3>缓存服务器</h3>
            <table cellpadding="0" cellspacing="0" class="tbform">
                <tr>
                    <td class="w120">缓存服务器IP：</td>
                    <td class="w150"><input type="text" id="txtRedisServerIp" runat="server" class="txt w120" maxlength="20" /></td>
                    <td class="w110">缓存服务器Port：</td>
                    <td class="w90"><input type="text" id="txtRedisServerPort" runat="server" class="txt w50" maxlength="5" onkeyup="value=value.replace(/[^\d]/g,'')" onblur="value=value.replace(/[^\d]/g,'')" /></td>
                    <td class="w120">是否调用Redis服务：</td>
                    <td>
                        <select id="ddlRedisEnabled" runat="server" class="select w120" style="width:76px;">
                            <option value="0">不调用</option>
                            <option value="1">调用</option>
                        </select>
                    </td>
                </tr>
            </table>
            <table cellpadding="0" cellspacing="0" class="tbform">
                <tr>
                    
                    <td class="w120">推送中心录像计划：</td>
                    <td>
                        <select id="ddlRecordPlanPush" runat="server" class="select w120" style="width:126px;">
                            <option value="0">不推送</option>
                            <option value="1">推送</option>
                        </select>
                        <span>推送中心录像计划给CSS服务器（中心存储服务器），服务器IP和端口从设备所配置的CSS服务器获取。</span>
                    </td>
                </tr>
            </table>
            <h3>SMS服务器</h3>
            <table cellpadding="0" cellspacing="0" class="tbform">
                <tr>
                    <td class="w120">SMS服务器IP：</td>
                    <td class="w150"><input type="text" id="txtSmsServerIp" runat="server" class="txt w120" maxlength="20" /></td>
                    <td class="w110">SMS服务器Port：</td>
                    <td><input type="text" id="txtSmsServerPort" runat="server" class="txt w50" maxlength="5" onkeyup="value=value.replace(/[^\d]/g,'')" onblur="value=value.replace(/[^\d]/g,'')" /></td>
                </tr>
            </table>
            <table cellpadding="0" cellspacing="0" class="tbform" style="margin:5px 0 0;">
                <tr>
                    <td class="w120"></td>
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
    $(window).load(function(){
        page.setPageTitle('<%=strTitle%>');
    });
    
    $(window).resize(function(){
    
    });
    /*
    function checkIp(ip){
        var arr = ip.split('.');
        var c = 4;
        if(arr.length != c){
            return false;
        }
        
        for(var i=0; i<c; i++){
            var num = Number(arr[i], 10);
            if(isNaN(num) || num < 0 || num > 255){
                return false;
            }            
        }
        return true;
    }
    */
    function checkIp(strIP) {
        if (strIP == undefined) return false;
        var pattern = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //匹配IP地址的正则表达式
        if(!pattern.test(strIP))
        {
            return false
        }
        if( RegExp.$1 > 255 || RegExp.$2 > 255 || RegExp.$3 > 255 || RegExp.$4 > 255){
            return false;
        }
        return true;
    }
    
    var wc = 0;
    function checkInput(obj, type, name){
        var val = obj.val().trim();
        if(wc > 0){
            return false;
        }
        if('' == val){
            page.showPrompt('请输入' + name + '服务器' + ('ip' == type ? 'IP' : '端口') + '！', $$('lblError'), infoType.warning);
            obj.focus();
            wc++;
            return false;
        }
        if('ip' == type){
            if(!checkIp(val)){
                page.showPrompt(name + '服务器IP输入错误！', $$('lblError'), infoType.warning);
                obj.focus();
                wc++;
                return false;
            }
        } else if('port' == type){
            val = Number(val, 10);
            if(isNaN(val) || val <= 0 || val > 65535){
                page.showPrompt(name + '服务器端口输入错误！', $$('lblError'), infoType.warning);
                obj.focus();
                wc++;
                return false;
            }
        }
        return val;
    }
        
    function saveConfig(){
        var userPwd = $$('txtUserPwd').val().trim();
        if('' == userPwd){
            page.showPrompt('请输入密码！', $$('lblUserPwd'), infoType.warning);
            $$('txtUserPwd').focus();
            return false;
        }
        wc = 0;
        var strGprsServerIp = checkInput($$('txtGprsServerIp'), 'ip', 'Gprs');
        var gprsServerPort = checkInput($$('txtGprsServerPort'), 'port', 'Gprs');
        var strRedisServerIp = checkInput($$('txtRedisServerIp'), 'ip', 'Redis');
        var redisServerPort = checkInput($$('txtRedisServerPort'), 'port', 'Redis');
        var strSmsServerIp = checkInput($$('txtSmsServerIp'), 'ip', 'Sms');
        var smsServerPort = checkInput($$('txtSmsServerPort'), 'port', 'Sms');
        
        if(!strGprsServerIp || !gprsServerPort || !strRedisServerIp || !redisServerPort || !strSmsServerIp || !smsServerPort){
            return false;
        }
        
        var config = {
            id: 'pwSave',
            title: '修改配置',
            html: '确定要修改服务器配置吗？',
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

