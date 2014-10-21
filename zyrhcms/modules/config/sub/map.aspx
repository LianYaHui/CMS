<%@ Page Language="C#" MasterPageFile="~/master/mpPage.master" AutoEventWireup="true" CodeFile="map.aspx.cs" Inherits="modules_config_map" %>
<%@ MasterType VirtualPath="~/master/mpPage.master" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphHeader" Runat="Server">
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/page.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/mapcorrect.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    <script type="text/javascript">
        var strLatLngConfig = '<%=Config.GetMapCenter()%>'.split(',');
        var mapConfig = {
            mapEngine: '<%=Config.GetMapEngine()%>',
            mapType: '<%=Config.GetMapType()%>',
            mapZoom: <%=Config.GetMapZoom()%>,
            mapCenter: {lat: strLatLngConfig[0], lng: strLatLngConfig[1]}
        };
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphBody" Runat="Server">
    <div id="bodyTitle"><span class="title"></span><span id="reload" class="reload"></span></div>
    <div id="bodyContent">
        <div class="form">
            <form id="Form1" action="" runat="server" method="post">
                <strong>地图设置</strong>
                <div style="float:right;">
                    <div id="divCanvas" style="width:600px;height:380px;border:solid 1px #bb99e8;margin-bottom:5px;"></div>
                    <div style="display:block;clear:both;padding:5px 0 10px;">
                    <a class="btn btnc22" onclick="updateLatLng();"><span class="w40">更新</span></a>
                    <a class="btn btnc22" onclick="cancelLatLng();"><span class="w40">还原</span></a>
                    <span id="divPrompt" style="margin:5px 0;"></span>
                    </div>
                </div>
                <table cellpadding="0" cellspacing="0" class="tbform">
                    <tr>
                        <td>地图中心坐标：</td>
                        <td><input type="text" class="txt w150" id="txtLatLng" runat="server" maxlength="25" readonly="readonly" /></td>
                    </tr>
                    <tr>
                        <td>默认放大倍数：</td>
                        <td>
                            <select id="ddlMapZoom" runat="server" class="select w50" onchange="bmap.setMapZoom(this.value);">
                            </select> 放大倍数建议选择10 - 15之间
                        </td>
                    </tr>
                    <tr>
                        <td>默认地图类型：</td>
                        <td>
                            <select id="ddlMapType" runat="server"  class="select" onchange="bmap.setMapType(this.value);">
                                <option value="BMAP_NORMAL_MAP">普通地图</option>
                                <option value="BMAP_HYBRID_MAP">混合地图</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <div style="padding:10px 0;">
                    <label style="float:left;color:#999;">为防止误操作，请输入帐户密码：</label><br />
                    <input id="txtUserPwd" type="password" class="txt pwd w200" maxlength="30" runat="server" style="float:left;" />
                    <label id="lblUserPwd" runat="server" style="float:left;color:#f00;border:none;background-color:#fff;"></label>
                </div>
                <br />
                <input id="txtMenuCodeList" type="hidden" runat="server" />
                <a class="btn btnc24" onclick="save();"><span class="w65">确认，保存</span></a>
                <input id="btnSave" type="submit" value="submit" runat="server" onserverclick="btnSave_ServerClick" style="visibility:hidden;width:0;height:0;" />
            </form>
        </div>
    </div>    
    <div id="bodyBottom">
        <div class="panel-left" style="width:80%;"><span id="lblError" runat="server"></span></div>
        <div class="panel-right"></div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="cphFooter" Runat="Server">
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>
<%if(Config.GetMapEngine().Equals("gmap")){%>
<script type="text/javascript" src="http://ditu.google.cn/maps/api/js?v=3.8&sensor=false"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/keydragzoom.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/gmap.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/gmap.marker.js"></script>
<%} else if(Config.GetMapEngine().Equals("bmap")){%>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=<%=Config.GetBaiDuMapKey()%>"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/RectangleZoom/1.2/src/RectangleZoom_min.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/emap/bmap.js?<%=Public.NoCache()%>"></script>
<%}%>
<script type="text/javascript">
    $(window).load(function(){
        page.setPageTitle('<%=strTitle%>');
    
        initialMap();
    });
    
    $(window).resize(function(){
    
    });
        
    function save(){
        var userPwd = $$('txtUserPwd').val().trim();
        if('' == userPwd){
            page.showPrompt('请输入密码！', $$('lblUserPwd'), infoType.warning);
            $$('txtUserPwd').focus();
            return false;
        }
        
        var config = {
            id: 'pwSave',
            title: '设置地图中心',
            html: '确定要更新地图中心设置吗？',
            callBack: saveCallBack
        };
        cms.box.confirm(config);
    }
    
    function saveCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            $$('btnSave').click();
        }
        pwobj.Hide();
    }
    
    /*以下是地图部分代码*/
    var marker = null;
    var markerLatLng = mapConfig.mapCenter;
    var map = null;
    
    function initialMap(){
        var obj = cms.util.$('divCanvas');
        if('gmap' == mapConfig.mapEngine){
            gmap.setRailwayControlDisplay(false);
            gmap.setBaseNoRailMapControlDisplay(false);
            map = gmap.initial(obj, mapConfig.mapCenter, mapConfig.mapZoom, mapConfig.mapType);
        } else if('bmap' == mapConfig.mapEngine) {
            map = bmap.initial(obj);     
            
            map.addEventListener('zoomend', function(ev){
                $$('ddlMapZoom').attr('value', this.getZoom());
            });
            
            map.addEventListener('maptypechange', function(ev){
                var typeName = this.getMapType().getName();
                switch(typeName){
                    case '地图':
                        $$('ddlMapType').attr('value', 'BMAP_NORMAL_MAP');
                        break;
                    case '混合':
                        $$('ddlMapType').attr('value', 'BMAP_HYBRID_MAP');
                        break;
                }
            });
            
            bmap.setMapType(mapConfig.mapType);
        }
        showMarker();
    }
    
    function showMarker(){        
        if('gmap' == mapConfig.mapEngine){
            if(marker != null){
                gmap.removeMarker(marker);
            }
            var latLng = gmap.mc.offset(parseFloat(markerLatLng.lat, 10), parseFloat(markerLatLng.lng, 10));
            var position = gmap.createLatLng(latLng.lat, latLng.lng);
            marker = gmap.createMarker({
                position: position,
                map: gmap.map,
                draggable: true
            });
            
            google.maps.event.addListener(marker, 'dragend', function(event){
                var lat = event.latLng.lat();
                var lng = event.latLng.lng();
                markerLatLng = gmap.mc.revert(lat, lng);
                
                showLatLng(markerLatLng);
            });
            
            google.maps.event.addListener(gmap.map, 'zoom_changed', function() {
                $$('ddlMapZoom').attr('value', gmap.map.getZoom());
            });
            
            showLatLng(markerLatLng);
            
            gmap.setBoundsContains(position, map);
        } else if('bmap' == mapConfig.mapEngine) {
            if(marker != null){
                bmap.removeMarker(marker);
            }
            
            var latLng = {lat: parseFloat(markerLatLng.lat, 10), lng: parseFloat(markerLatLng.lng, 10)};
            latLng = bmap.gpsConvertBD(latLng);
            
            var point = new BMap.Point(latLng.lng, latLng.lat);    // 创建点坐标
            
            marker = bmap.createMarker({
                map: bmap.map, point: point, options:{enableDragging: true},label:'地图中心',showLabel:true
            });
            bmap.setCenter(point);
            bmap.setMapZoom(mapConfig.mapZoom);
            
            marker.addEventListener('dragend', function(ev){
                var p = this.getPosition();
                
                var latLng = {lat: p.lat, lng: p.lng};
                markerLatLng = bmap.bdConvertGps(latLng);
            
                var pn = Math.pow(10,8);
                markerLatLng.lat = Math.round(markerLatLng.lat*pn)/pn;
                markerLatLng.lng = Math.round(markerLatLng.lng*pn)/pn;
                
                showLatLng(markerLatLng);
            });
            showLatLng(markerLatLng);
            
            window.setTimeout(bmap.setCenter, 1000, point);
        }
    }
    
    function showLatLng(latLng){        
        var strHtml = '当前位置坐标：' + latLng.lat + ',' + latLng.lng;
        $('#divPrompt').html(strHtml);
    }
    
    function updateLatLng(){
        $$('txtLatLng').attr('value', markerLatLng.lat + ',' + markerLatLng.lng);
    }
    
    function cancelLatLng(){
        markerLatLng = mapConfig.mapCenter;
        
        updateLatLng();
        showMarker();
        
        showLatLng(markerLatLng);
    }
</script>
</asp:Content>