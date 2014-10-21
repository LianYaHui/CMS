<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DateTime.aspx.cs" Inherits="modules_safety_control_DateTime" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/datepicker/WdatePicker.js"></script>
    <script type="text/javascript">
        var eid = '<%=eid%>';
        var step = '<%=step%>';
        var sub = '<%=sub%>';
    </script>
</head>
<body>
    <div id="mainContent" class="" style="background:#fff; padding:5px 10px;">
        请选择时间：<input id="txtTime" type="text" class="txt w120" value="<%=DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")%>" maxlength="19" />
    </div>
    <div class="statusbar statusbar-h30" style="position:absolute;bottom:0;left:0; text-align:center;">
        <a class="btn btnc24" onclick="saveContent(false);"><span class="w50">确定</span></a>
        <a class="btn btnc24" onclick="saveContent(true);"><span class="w80">确定，关闭</span></a>
        <a class="btn btnc24" onclick="cancel();"><span class="w50">取消</span></a>
    </div>
</body>
</html>
<script type="text/javascript" src="control.js"></script>
<script type="text/javascript">
$(window).load(function(){
    setBodySize();
    $("#txtTime").focus(function(){
        WdatePicker({skin:'ext',dateFmt:'yyyy-MM-dd HH:mm:ss'});
    });
});

$(window).resize(function(){
    setBodySize();
});

var setBodySize = function(){
    var bodySize = cms.util.getBodySize();
    cms.util.$('mainContent').style.height = (bodySize.height - 32) + 'px';
    cms.util.$('mainContent').style.width = (bodySize.width) + 'px';
};

var saveContent = function(isClose){
    var strResult = cms.util.$('txtTime').value.trim();
    if(strResult.equals('')){
        return false;
    }
    
    updateControlValue(eid, step, sub, isClose, true, strResult, false, true);
};

var cancel = function(){
    updateControlValue(eid, step, sub, true);
};
</script>