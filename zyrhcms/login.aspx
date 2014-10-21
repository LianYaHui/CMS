<%@ Page Language="C#" AutoEventWireup="true" CodeFile="login.aspx.cs" Inherits="login" %><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <title>用户登录 - <%=Config.GetWebName()%></title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/login.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/md5.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/ipass.js"></script>
    <script type="text/javascript">var imgLoginBg = '<%=Config.GetLoginBg()%>';</script>
</head>
<body oncontextmenu="<%=Config.SetContextMenu()%>">
    <form action="" method="post" onsubmit="userLogin();return false;">
        <div class="login-box" id="loginBox">
            <div class="login-banner"></div>
            <div class="login-form">
                <table class="login" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="w55">用户名：</td>
                        <td><input id="txtUserName" type="text" class="txt" maxlength="25" /></td>
                    </tr>
                    <tr>
                        <td>密&nbsp;&nbsp;码：</td>
                        <td><input id="txtUserPwd" name="txtUserPwd" type="password" class="txt pwd" maxlength="32"/>
                        <label id="lblError"></label></td>
                    </tr>
                    <tr>
                        <td>登录到：</td>
                        <td>
                            <select id="ddlServerLine" class="select" runat="server"></select>
                        </td>
                    </tr>
                    <tr id="trVerifyCode" style="display:none;">
                        <td>验证码：</td>
                        <td>
                            <img id="imgVerifyCode" class="img-vc" alt="" title="点击刷新图片" src="#" />
                            <input id="txtVerifyCode" type="text" class="txt txt-vc" maxlength="6" />
                            <label id="lblVerifyCode"></label>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style="padding-top:5px;">
                            <label for="chbRemember" class="chb-label-nobg" style="float:left;width:80px;<%=strSavePwdDisplay%>">
                                <input type="checkbox" id="chbRemember" class="chb" /><span><%=strSaveLabel%></span>
                            </label>
                            <a class="btn btnc24" onclick="$('#btnLogin').click();" style="float:right;"><span class="w60">登录</span></a>
                            <input id="btnLogin" type="submit" value="登录" class="btnlogin" style="visibility:hidden;width:0; height:0;" />
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </form>
    <span id="ModuleAction"></span>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/login.js"></script>