<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="mapKey.aspx.cs" Inherits="modules_config_sub_mapKey" %>
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
                    <td class="w150" style="vertical-align:top;">地图引擎：</td>
                    <td>
                        <select id="ddlMapEngine" class="select" runat="server" style="width:120px;">
                            <option value="bmap">百度地图</option>
                            <option value="gmap">谷歌地图</option>
                        </select>
                        <span style="color:#ccc;">由于网络原因…，请选择百度地图</span>
                    </td>
                </tr>
                <tr>
                    <td class="w150" style="vertical-align:top;">百度地图API密钥：</td>
                    <td>
                        <input type="text" id="txtBaiDuMapKey" runat="server" class="txt w300" />
                        <br />
                        <span style="color:#f00;">提示：请勿随意修改地图密钥，若密钥有误将导致地图功能无法使用。</span>
                        <br />
                        <span>
                            若当前没有可用的密钥，请至百度LBS开放平台申请密钥，点击这里-><a href="http://lbsyun.baidu.com/apiconsole/key?application=key" target="_blank">申请百度地图密钥</a>
                        </span>
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
                        <a class="btn btnc24" onclick="saveConfig();" style="margin-right:10px;"><span class="w50">保存</span></a>
                        <a class="btn btnc24" onclick="$('#btnReset').click();"><span class="w40">取消</span></a>
                        <input id="btnSave" type="submit" value="submit" runat="server" onserverclick="btnSave_ServerClick" style="visibility:hidden;width:0;height:0;" />
                        <input id="btnReset" type="reset" value="reset" style="visibility:hidden;width:0;height:0;" />
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
    
    });
    
    $(window).resize(function(){
    
    });

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