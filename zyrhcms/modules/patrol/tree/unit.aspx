<%@ Page Language="C#" AutoEventWireup="true" CodeFile="unit.aspx.cs" Inherits="modules_patrol_tree_unit" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <style type="text/css">
        body{background:#e7e9ea; overflow:auto;}
    </style>
</head>
<body oncontextmenu="return false;">
    <div class="treebox" style="width:<%=bodyW%>px;height:<%=bodyH%>px; overflow:auto;">
        <div id="tree">正在加载，请稍候...</div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree_patroltask.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript">
var loadTree = function(){
    pwtree.buildTree($('#tree'), {treeType:'unit', showCheckBox:false, callBack: 'setUnit',dblclick:false,folderLinks:true});
}

var setUnit = function(param){
    parent.setUnit(param);
}

$(window).load(function(){
    loadTree();
});
</script>