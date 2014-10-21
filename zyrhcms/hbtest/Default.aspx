<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>测试</title>

    <script src="Scripts/jquery-1.7.2.min.js" type="text/javascript"></script>

    <link href="Scripts/themes/gray/easyui.css" rel="stylesheet" type="text/css" />

    <script src="Scripts/jquery.easyui.min.js" type="text/javascript"></script>

    <script src="Scripts/easyloader.js" type="text/javascript"></script>

    <link href="Scripts/themes/icon.css" rel="stylesheet" type="text/css" />

    <script src="Scripts/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>

   <script type="text/javascript" charset="UTF-8">
        function pcallfunction(nodetxt, jsondata) {
            $("#Map")[0].contentWindow.callfunction(nodetxt, jsondata);  
        }
        //layerID, picUrl, jsonData, scale, keyControl, sometext

        function text2() {
            var jsondata2 = '{"Type":"0", "picUrl": "../hbweb/assets/images/roadLight.gif", "spatialNum": 4326, "lineColor": "0xff0000" , "Color": "0x00ff00", "alpha": "0.8" ,"width": "5", "scale": "20000", "pointsArray": [{"infoName": "采石桥1", "GPS_X": "112.44593", "GPS_Y": "31.63645"},{"infoName": "采石桥2", "GPS_X": "112.44393", "GPS_Y":"31.63745" }, {"infoName": "采石桥3", "GPS_X": "112.44393", "GPS_Y": "31.63445" }, {"infoName": "采石桥4", "GPS_X": "112.44593","GPS_Y": "31.63477"}]}';
            pcallfunction('多点绘制', jsondata2);
        }

        function text6() {
            var jsondata6 = '{"id": "001", "scale": "1000000", "pointsArray": [{"picUrl": "../hbweb/assets/images/roadLight.gif","name": "测试点1", "GPS_X": "112.49593", "GPS_Y": "31.63745","disInfo":"1","disLabel":"1","label":"中共十八大大会"},{"picUrl": "../hbweb/assets/images/roadLight.gif","name": "测试点2", "GPS_X": "112.42223", "GPS_Y": "31.69945","disInfo":"0","disLabel":"0","label":"中共十八大二中"},{"picUrl": "../hbweb/assets/images/0close.png","name": "测试点3", "GPS_X": "112.52593", "GPS_Y": "31.65745","disInfo":"1","disLabel":"1","label":"中共十八大三中"}]}';
            pcallfunction('点显示', jsondata6);
        }

        function text7() {
            var jsondata7 = '{"id": "001", "scale": "1000000","color": "0x0000ff", "width": "5", "alpha":"0.8", "pointsArray": [{"picUrl": "../hbweb/assets/images/roadLight.gif","name": "测试点1", "GPS_X": "112.49593", "GPS_Y": "31.65745","disInfo":"1","disPoint":"0"},{"picUrl": "../hbweb/assets/images/roadLight.gif","name": "测试点2", "GPS_X": "112.42223", "GPS_Y": "31.66945","disInfo":"0","disPoint":"0"}]}';
            pcallfunction('线显示', jsondata7);
        }

        function text610() {
            var jsondata610 = '{"id": "001", "controlNum": "1"}';
            pcallfunction('点显示开关', jsondata610);
        }

        function text611() {
            var jsondata611 = '{"id": "001", "controlNum": "0"}';
            pcallfunction('点显示开关', jsondata611);
        }

 
        function text70() {
            var jsondata70 = '{"id": "001", "controlNum": "0"}';
            pcallfunction('线显示开关', jsondata70);
        }

        function text71() {
            var jsondata71 = '{"id": "001", "controlNum": "1"}';
            pcallfunction('线显示开关', jsondata71);
        }
        function aaa(para) {alert("这是flex回调出现的值:"+para)}
        
        function callback(type,id,name,action)
        {
               switch(type){
		        case 1:  //车站			
				        alert(name+action);
			        break;
		        case 2:  //机关单位
			        alert(name+action);
			        break;
		        case 3:  //变电所
				        alert(name+action);
			        break;
		        default:
			        //不调用任何数据
			        break;
	        }
        }


        function GetCenter(x,y)
        {
           $('#tare').text(x+","+y);
        }
    </script>
</head>
<body class="easyui-layout" id="body">
    <form id="Form1" runat="server">
    <div data-options="region:'north',border:false" style="height: 75px; background: url('../images/rere.gif') repeat-x;
        padding: 0px">
        <textarea id="tare" style="width:400px">
        
        </textarea>
    </div>
    <div data-options="region:'west',split:true,title:'功能菜单',iconCls:'menus'" style="width: 210px;
        padding: 10px; overflow: auto;" id="wwest">
          <ul>
            <li><a href="#" onclick="pcallfunction('测量工具',null)">测量</a></li>
            <li><a href="#" onclick="text2()">多点绘制</a></li>
            <li><a href="#" onclick="text6()">点显示</a></li>
            <li><a href="#" onclick="text610()">点显示关</a></li>
             <li><a href="#" onclick="text611()">点显示开</a></li>
            <li><a href="#" onclick="text7()">线显示</a></li>
            <li><a href="#" onclick="text70()">线显示开</a></li>
            <li><a href="#" onclick="text71()">线显示关</a></li>
        </ul>
    </div>
    <div data-options="region:'center',split:true,collapsed:false,title:'电子地图',iconCls:'map'"
        style="padding: 0px;" name="MapDiv" id="MapDiv">
        <iframe name="Map" id="Map" height="100%" width="100%" frameborder="0" src="hbweb/index.html"
            scrolling="no">浏览器不支持嵌入式框架，或被配置为不显示嵌入式框架。</iframe>
    </div>
    <div data-options="region:'south',border:false" style="height: 28px; background: #0056A9;
        padding: 10px; text-align: center; font: nomal bold 10px/28px arial,sans-serif;
        color: Silver">
    </div>
    </form>
</body>
</html>
