<%@ Page Language="C#" AutoEventWireup="true" CodeFile="showInfo.aspx.cs" Inherits="modules_safety_showInfo" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <style type="text/css">
        #mainContent p{text-align:left; text-indent:2em; padding:0 10px;}
    </style>
</head>
<body oncontextmenu="return false;">
    <div id="mainContent" style="overflow:auto;background:#e9f6ff; text-align:center;max-width:720px;">
        <%if (!hasInfo){%>
            <span style="padding:0 5px;"><%=strName%>暂无介绍信息</span>
        <%}else{%>
            <h3 style="margin:5px 10px;padding-bottom:5px; font-size:16px;border-bottom:solid 1px #31302e;"><%=strName%></h3>
            <p><%=strIntroduce%></p>
        <%}%>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/user.js"></script>
<script type="text/javascript">
    var boxSize = {};
        
    $(window).load(function(){        
        setBodySize();        
    });
    
    $(window).resize(function(){
        setBodySize();
    });
    
    var setBodySize = function(){
        var bodySize = cms.util.getBodySize();
        
        $('#mainContent').width(bodySize.width);
        $('#mainContent').height(bodySize.height);
    };
</script>