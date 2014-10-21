<%@ Page Language="C#" AutoEventWireup="true" CodeFile="point.aspx.cs" Inherits="modules_patrol_tree_point" %>
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
        body{background:#e7e9ea;}
    </style>
</head>
<body>
    <div class="treebox" style="overflow:auto;">
        <div id="tree">正在加载，请稍候...</div>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/tree_patroltask.js?<%=Public.NoCache()%>"></script>
<script type="text/javascript">
var setBodySize = function(){
    var bodySize = cms.util.getBodySize();
    $('.treebox').width(bodySize.width);
    $('.treebox').height(bodySize.height);
};

$(window).load(function(){
    setBodySize();
});

$(window).resize(function(){
    setBodySize();
});
 
var loadTree = function(unitId){
    var checkbox = {name:'chbPoint',css:'chbPoint',callback:'setCheckBox'};
    pwtree.buildTree($('#tree'), {treeType:'point',unitId:unitId, showCheckBox:true, checkbox:checkbox, callBack: 'setPoint',dblclick:false,folderLinks:true});
}

loadTree(1);

var setPoint = function(param){
    //alert(param);
    parent.setPoint(param);
}

var setCheckBox = function(){
    var arrPoint = [];
    var arrChb = cms.util.$N('chbPoint');
    for(var i=0,c=arrChb.length; i<c; i++){
        if(arrChb[i].checked){
            arrPoint.push(arrChb[i].value);
            //alert(arrChb[i].value);
        }
    }
    parent.setPointMulti(arrPoint);
}
</script>