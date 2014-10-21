<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="hbtest_index" %>
<!DOCTYPE html>
<html>
<head>
    <title>无标题页</title>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
</head>
<body>
    <div data-options="region:'west',split:true,title:'功能菜单',iconCls:'menus'" style="width: 210px; float:left;
        padding: 10px; overflow: auto;" id="wwest">
          <ul>
          <!--
            <li><a href="#" onclick="pcallfunction('测量工具',null)">测量</a></li>
            <li><a href="#" onclick="text2()">多点绘制</a></li>
            <li><a href="#" onclick="text6()">点显示</a></li>
            <li><a href="#" onclick="text610()">点显示关</a></li>
             <li><a href="#" onclick="text611()">点显示开</a></li>
            <li><a href="#" onclick="text7()">线显示</a></li>
            <li><a href="#" onclick="text70()">线显示开</a></li>
            <li><a href="#" onclick="text71()">线显示关</a></li>
            -->
        </ul>
            <label><input type="checkbox" onclick="showStation(this);" />车站</label>
            <label><input type="checkbox" onclick="showDepartment(this);" />车间</label>
            
            <label><input type="checkbox" onclick="showLine1(this);" />画线条一</label>
            <label><input type="checkbox" onclick="showLine2(this);" />画线条二</label>
            <label><input type="checkbox" onclick="showLine3(this);" />画线条三</label>
            
            <input type="text" id="txtResult1" />
    </div>
    <div data-options="region:'center',split:true,collapsed:false,title:'电子地图',iconCls:'map'"
        style="padding: 0px; float:right; width:980px;height:600px;border:solid 1px #99bbe8; position:relative;" name="MapDiv" id="MapDiv">
        <div style="position:absolute;display:none;">正在加载地图，请稍候...</div>
        <iframe name="mapGis" id="mapGis" height="100%" width="100%" frameborder="0" src="../arcgis/index.aspx"
            scrolling="no">浏览器不支持嵌入式框架，或被配置为不显示嵌入式框架。</iframe>
    </div>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/safety/oamap.js"></script>
<script type="text/javascript">
    var htMarker = new cms.util.Hashtable();
    
    var mapCallback = function(type, id, name, action){
        var strTitle = '车站详情';
        var strHtml = '';
        alert(type + ',' + id + ',' + name + ',' + action);
        switch(type){
            default:
                break;
        }
        /*
        
        var config = {
            id: 'pwMarkerDetail',
            title: '车站详情',
            html: strHtml,
            width: 600,
            height: 400,
            lock: false
        };
        cms.box.win(config);
        */
    };
        
    var showStation = function(obj){
        var show = obj.checked;
        var type = 'station';
        var icon = cms.util.path + '/skin/default/images/railway/gis/2.gif';   
        if(show){
            if(htMarker.contains(type)){
                oamap.showMarker(type);
            } else {
                var dataList = [
                    {type: type, id: 'a1', code:'001', name: '陆家山', lat: 31.0758, lng: 113.9316, icon: icon},
                    {type: type, id: 2, code:'002', name: '赤壁', lat: 29.7238, lng: 113.9245, icon: icon},
                    {type: type, id: 3, code:'003', name: '丹水池', lat: 30.6761, lng: 114.3469, icon: icon},
                    {type: type, id: 4, code:'004', name: '武汉', lat: 30.6098, lng: 114.4188, icon: icon}
                ];

                var markerDataList = oamap.buildMarkerData(dataList, type, true);
                oamap.createMarker({id: type, scale:oamap.scale}, markerDataList);
                
                
                htMarker.add(type);
            }
        } else {
            oamap.hideMarker(type);
        }
    };
        
    var showDepartment = function(obj){
        var show = obj.checked;
        var type = 3;
        if(show){
            if(htMarker.contains(type)){
                oamap.showMarker(type);
            } else {
                var dataList = [
                    /*{id: 1, code:'001', name: '汉口供电车间', lat: 30.6349, lng: 114.2987},
                    {id: 2, code:'002', name: '咸宁供电车间', lat: 29.8807, lng: 114.2809},*/
                    {id: 3, code:'003', name: '武昌东供电车间', lat: 30.5299, lng: 114.315}
                ];
                
                var markerDataList = oamap.buildMarkerData(dataList, type, true);
                oamap.createMarker({id: type, scale:oamap.scale}, markerDataList);
                htMarker.add(type);
            }
        } else {
            oamap.hideMarker(type);
        }
    };
    
    var showLine1 = function(obj){
        var show = obj.checked;
        var type = '10000001';
        var id = '11';
        if(show){
            if(htMarker.contains(id)){
                oamap.showLine(id);
            } else {
                var dataList = [
                    {id: 1, code:'001', name: '汉口供电车间', lat: 30.6349, lng: 114.2987},
                    //{id: 2, code:'002', name: '咸宁供电车间', lat: 29.8807, lng: 114.2809},
                    {id: 3, code:'003', name: '武昌东供电车间', lat: 30.5299, lng: 114.315}
                ];
                
                var linePointList = oamap.buildLinePoint(dataList, false, false);
                var param = {type: type, id: id,name:'abc', scale: oamap.scale, color: '#ff0000', width: '3', alpha: '0.8', action:'asd'};
                oamap.createLine(param, linePointList)
            }
        } else {
            oamap.hideLine(id);
        }
    };
    
    var showLine2 = function(obj){
        var show = obj.checked;
        var type = '10000001';
        var id = '12';
        if(show){
            if(htMarker.contains(id)){
                oamap.showLine(id);
            } else {
                var dataList = [
                    {id: 4, code:'004', name: '武汉', lat: 30.6098, lng: 114.4188},
                    {id: 1, code:'001', name: '汉口供电车间', lat: 30.6349, lng: 114.2987}
                ];
                
                var linePointList = oamap.buildLinePoint(dataList, false, false);
                var param = {type: type, id: id,name:'abc', scale: oamap.scale, color: '#0000ff', width: '3', alpha: '0.8', action:'asd'};
                var result = oamap.createLine(param, linePointList)
            }
        } else {
            oamap.hideLine(id);
        }
    };
    
    var showLine3 = function(obj){
        var show = obj.checked;
        var type = '10000001';
        var id = '13';
        if(show){
            if(htMarker.contains(id)){
                oamap.showLine(id);
            } else {
                var dataList = [
                    {id: 4, code:'004', name: '武汉', lat: 30.6098, lng: 114.4188},
                    {id: 3, code:'003', name: '武昌东供电车间', lat: 30.5299, lng: 114.315}
                ];
                
                var linePointList = oamap.buildLinePoint(dataList, false, false);
                var param = {type: type, id: id,name:'abc', scale: oamap.scale, color: '#0000ff', width: '3', alpha: '0.8', action:'asd'};
                oamap.createLine(param, linePointList)
            }
        } else {
            oamap.hideLine(id);
        } 
    };
</script>