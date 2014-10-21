<%@ Page Language="C#" MasterPageFile="~/master/mpMain.master" AutoEventWireup="true" CodeFile="default.aspx.cs" Inherits="_default"  %>
<%@ MasterType VirtualPath="~/master/mpMain.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <script type="text/javascript">var homeUrl = '<%=Public.HomeUrl%>'; if(location.href.indexOf(homeUrl) < 0){ location.href = cmsPath + homeUrl; } </script>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/default.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.calendar.js"></script>    
    <script type="text/javascript">
        var imgWelcomeBg = '<%=Config.GetWelcomeBg()%>';
        var imgIndexTopBanner = '<%=Config.GetIndexTopBanner()%>';
    </script>
    <!--[if IE 6]>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dd_belatedpng.js"></script>
    <script type="text/javascript">dd_belatedpng.fix('.menu-list a');</script>
    <![endif]-->
    <style type="text/css">
        .cbox{}
        .cbox table{border-collapse:collapse;}
        .cbox .tbrh{}
        .cbox td{line-height:18px;border:solid 1px #fff;text-align:center;}
    </style>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="pageBody">
        <div id="homeBodyLeft">
            <div class="welcome-box">
                <span class="username"><%=strUserName%></span>
                <div class="userinfo">
                    <a href="javascript:;" onclick="user.showUserInfo();">用户信息</a>|
                    <a href="javascript:;" onclick="user.modifyPassword();">修改密码</a>|
                    <a href="javascript:;" onclick="user.logout();">退出</a>
                </div>
            </div>
            <div class="box">
                <div class="title">公告信息</div>
                <div class="content" style="overflow:auto;">
                    <table id="tbBulletin" cellpadding="0" cellspacing="0"></table>
                </div>
            </div>
            <div class="box" style="border:none;">
                <!--<div class="title">报警信息</div>-->
            </div>
        </div>
        <div id="homeBodyMain">
            <div class="box">
                <div class="title">功能导航</div>
                <div class="line"></div>
                <div class="sub-title">控制客户端</div>
                <div class="menu-list">
                    <%=strMenuListClient%>
                </div>
                <%if (uc.IsAdmin){%>
                <div class="line"></div>
                <div class="sub-title">配置客户端</div>
                <div class="menu-list">
                    <%=strMenuListManage%>
                </div>
                <%}%>
            </div>
        </div>
        <div id="homeBodyRight">
            <div class="box" style="background:#fff;">
                <div class="title">日历<span id="curdate" style="float:right;padding-right:10px;"></span></div>
                <div id="divCalendar"></div>
            </div>
            <div class="box">
                <div class="title">下载中心</div>
                <div class="content" style="overflow:auto;">
                    <table id="tbDatum" cellpadding="0" cellspacing="0"></table>
                </div>
            </div>
            <div class="box" style="border:none;">
                <!--<div class="title">异常信息</div>-->
            </div>
        </div>
        <div id="footer">
            <%=Config.GetCopyright()%>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/default.js?<%=Public.NoCache()%>"></script>
</asp:Content>