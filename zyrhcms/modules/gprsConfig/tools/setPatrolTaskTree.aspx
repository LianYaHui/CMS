<%@ Page Language="C#" AutoEventWireup="true" CodeFile="setPatrolTaskTree.aspx.cs" Inherits="modules_gprsConfig_tools_setPatrolTaskTree" %>
<!DOCTYPE html>
<html>
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/dtree/dtree.js"></script>
    <script type="text/javascript">
        var unitId = '<%=unitId%>';
    </script>
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
<script type="text/javascript">
var pwtree = pwtree || {};
pwtree.$ = function(i){ return document.getElementById(i); }
pwtree.isFirefox = navigator.userAgent.indexOf('Firefox') >= 0;

pwtree.buildTree = function(obj, config){
    var rootUnitId = config.unitId || 0;
    var nid = 0;
    var pid = -1;
    var strTree = '';
    var htTree = new cms.util.Hashtable();
    var htParent = new cms.util.Hashtable();
    var cmsPath = cms.util.path;
    var imgPath = cmsPath + '/skin/default/images/common/tree/';
	var urlparam = 'action=getTree&controlUnitId=' + rootUnitId + '&treeType=' + config.treeType + '&' + new Date().getTime();
	
	$.ajax({ 
        type: "post", 
        async: config.isAsync, //默认为异步加载 true
        datatype: "json",
        url: cms.util.path + '/ajax/treePatrolTask.aspx',
        data: urlparam, 
        error: function(jqXHR, textStatus, errorThrown){
            module.showAjaxErrorData(jqXHR, textStatus, errorThrown);
        },
        success: function(data, textStatus, jqXHR){
            if(!data.isJsonData()){
                module.showJsonErrorData(data);
                return false;
            }
            var jsondata = eval('(' + data + ')');
            rootUnitId = jsondata.uid;
            var unit = jsondata.unit;
            var region = jsondata.region;
            var group = jsondata.group;

            d = new dTree('d', 
                {skin: cmsPath + '/common/js/dtree/img1',showCheckBox:config.showCheckBox,dblclick:config.dblclick,folderLinks:config.folderLinks},
                {node: imgPath + 'device.gif'}
            );
            nid++;
            pid++;
        	
            d.add(0,-1,'设备目录树',null);
            
            for(var i=0,c=unit.length; i<c; i++){
                htTree.add('unit' + unit[i].id, nid);
                pid = nid == 1 ? 0 : htTree.items('unit' + unit[i].pid);
                var url = config.callBack + '({nid:\'' + nid + '\',type:\'unit\',unitId:\'' + unit[i].id + '\',unitName:' + (pwtree.isFirefox ? 'this.textContent' : 'this.innerText') + '});';
                
                d.add(nid,pid,unit[i].name,null,url,'','',imgPath + 'unit.gif',imgPath + 'unit.gif',true);
                nid++;
            }
            
            if(config.treeType == 'point'){
                var line = jsondata.line;
                var point = jsondata.point;
                var cc = line.length;
                if(cc == 0){
                    strTree = '该组织机构暂无线路、巡检点信息';
                } else {
                    for(var j=0; j<cc; j++){
                        var li = line[j];
                        htTree.add('line' + li.id, nid);
                        pid = nid == 1 ? 0 : htTree.items('unit' + li.uid);
                        var url = config.callBack + '({nid:\'' + nid + '\',type:\'line\',lineId:\'' + li.id + '\',lineName:\'' + li.name + '\',unitId:\'' + li.uid + '\',unitName:\'' + li.uname + '\'});';
                        var icon = imgPath + 'line.gif';
                        var checkbox = null;
                        if(config.checkbox !== undefined){
                            checkbox = {};
                            checkbox.callback = config.checkbox.callback;
                        }
                        d.add(nid,pid,li.name,checkbox,url,'','',icon,icon,true, null, false);
                        
                        nid++;
                    }
                    for(var k=0,cc=point.length; k<cc; k++){
                        var pt = point[k];
                        htTree.add('point' + pt.id, nid);
                        pid = nid == 1 ? 0 : htTree.items('line' + pt.lid);
                        var url = config.callBack + '({nid:\'' + nid + '\',type:\'point\',pointId:\'' + pt.id + '\',pointName:\'' + pt.name 
                            + '\',latitude:\'' + pt.lat + '\',longitude:\'' + pt.lng + '\',radii:\'' + pt.radii + '\',unitId:\'' + pt.uid 
                            + '\',unitName:\'' + pt.uname + '\'});';
                        var icon = imgPath + 'point.gif';
                        var checkbox = null;
                        if(config.checkbox !== undefined){
                            checkbox = {};
                            checkbox.css = config.checkbox.css;
                            checkbox.name = config.checkbox.name;
                            checkbox.callback = config.checkbox.callback;
                            checkbox.value = '{id:\'' + pt.id + '\',name:\'' + pt.name + '\',lat:\'' + pt.lat + '\',lng:\'' + pt.lng + '\',radii:\'' + pt.radii + '\'}';
                        }
                        d.add(nid,pid,pt.name,checkbox,url,'','',icon,icon,true, null, false);
                        
                        nid++;
                    }
                }
            }
            
            $(obj).html(''+d + strTree);

            //隐藏第一个节点 root
            $("#id0").parent("div").hide();

            d.closeAll();
            d.openTo(1);
	            
            //将第一个节点选中
            d.s(1);
        }
    });
    return rootUnitId;
};
</script>
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

loadTree(unitId);

var setPoint = function(param){
    parent.gprsConfig.setPatrolPoint(param);
}

var setCheckBox = function(){
    var arrPoint = [];
    var arrChb = cms.util.$N('chbPoint');
    for(var i=0,c=arrChb.length; i<c; i++){
        if(arrChb[i].checked){
            arrPoint.push(arrChb[i].value);
        }
    }
    parent.gprsConfig.setPatrolPointMulti(arrPoint);
}
</script>