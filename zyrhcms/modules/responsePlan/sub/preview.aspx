<%@ Page Language="C#" AutoEventWireup="true" CodeFile="preview.aspx.cs" Inherits="modules_responsePlan_sub_preview" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
</head>
<body>
    <div>
        <iframe id="frmPreview" src="http://36.32.160.67:81/login!loginByHttp.action?username=<%=strUserName%>&password=<%=strUserPwd%>&devIndexCode=<%=strDevCode%>" frameborder="0" scrolling="auto" width="100%" height="100%" name="mainContent" id="mainContent" ></iframe>
    </div>
</body>
</html>
<script type="text/javascript">
    $(window).load(function(){
        setBodySize();    
    });
    
    $(window).resize(function(){
        setBodySize();
    });
    
    function setBodySize(){
        $('#frmPreview').width($(window).width());
        $('#frmPreview').height($(window).height());     
    }
</script>