<%@ Page Language="C#" AutoEventWireup="true" CodeFile="guide.aspx.cs" Inherits="modules_gpsTrack_guide" %><!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <title>GPS搜索向导</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" /><%=strPageCode%>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <style type="text/css">
        #divForm{}
        #divForm ul{padding:5px 5px 0;}
        .form li{display:inline-block; height:28px;}
        #divGuide{background:#fff;}
        #divGuide ul{padding:0 0 5px 5px; overflow:hidden;}
        #divGuide li{display:inline-block; border:solid 1px #99bbe8; cursor:pointer; background:#fff; width:70px; text-align:center; line-height:20px; margin:5px 5px 0 0;}
    </style>
</head>
<body>
    <div id="divForm">
        <input type="hidden" class="txt w65" id="txtMaxDate" value="<%=DateTime.Now.ToString("yyyy-MM-dd")%>" />
        <ul class="form">
        <li>设备编号：<input type="text" class="txt w120" id="txtDevCode" value="<%=strDevCode%>" /></li>
        <li>开始日期：<input type="text" class="txt w65" id="txtStartTime" value="<%=DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd")%>" /></li>
        <li>结束日期：<input type="text" class="txt w65" id="txtEndTime" value="<%=DateTime.Now.ToString("yyyy-MM-dd")%>" /></li>
        </ul>
        <a onclick="cms.gpsguide.getGpsGuide();" class="btn btnc22" style="margin-left:65px;float:left;"><span>搜索</span></a>
        <label class="chb-label-nobg" style="float:left;margin:0 5px;">
            <input type="checkbox" id="chbType" class="chb" /><span>仅显示有数据的</span>
        </label>
    </div>
    <div id="divGuide" runat="server" style="overflow:auto;border:solid 1px #ddd;"></div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/gpsTrack/gpsGuide.js?<%=Public.NoCache()%>"></script>