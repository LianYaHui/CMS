<%@ Control Language="C#" AutoEventWireup="true" CodeFile="top.ascx.cs" Inherits="common_ascx_top" %><%if(ShowPageTop){%>
    <div id="pageTop">
        <div id="topBanner">
            <div id="logo"><%=LogoImage%><%=LogoName%></div><%if(ShowUserInfo){%>
            <div id="userInfo">
                <a href="<%=Public.WebDir%>/default.aspx" style="color:#ccc;">返回管理平台</a>
                <br />
                用户名：<a href="javascript:;" onclick="user.showUserInfo();">[<%=UserName%>]</a>|
                <a href="javascript:;" onclick="user.modifyPassword();">修改密码</a>|
                <a href="javascript:;" onclick="module.showVersionInfo();">版本信息</a>|
                <a href="javascript:;" onclick="user.logout();">退出</a>
            </div><%}%>
        </div>
        <div id="nav">
            <%if (LoadMenu) { Response.Write(strMenuString); %>            
            <a id="switchHeader" class="switch-header"></a>
            <div id="switchExit">
                <a class="switch-exit" onclick="user.logout();" title="退出"></a>
                <a class="switch-home" href="<%=Public.WebDir%>/default.aspx" title="返回平台首页"></a>
            </div>
            <%}else{%><ul>
                <li class="cur"><a href="<%=Public.WebDir%>/default.aspx">首页</a></li>
                <li><a onclick="module.showVersionInfo();">版本信息</a></li>
                <!--<li><a href="<%=Public.WebDir%>/help/default.aspx">帮助</a></li>-->
            </ul><%}%>
        </div>
    </div>
    <%}%>