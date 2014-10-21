<%@ Page Language="C#" AutoEventWireup="true" CodeFile="GZQD.aspx.cs" Inherits="modules_safety_control_GZQD" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript">
        var eid = '<%=eid%>';
        var step = '<%=step%>';
        var sub = '<%=sub%>';
    </script>
</head>
<body>
    <div id="mainContent" class="" style="background:#fff;">
        <div class="operbar" style="text-align:left;padding:0 10px; line-height:26px;">搜索车站</div>
        <div style="padding:5px 10px; background:#dbebfe;">
            <table cellpadding="0" cellspacing="0" class="tbform">
                <tr>
                    <td colspan="2">车站太多不好找，先搜索一下</td>
                </tr>
                <tr>
                    <td>选择线别：</td>
                    <td>
                        <select id="ddlLine" class="select">
                            <option value="">选择线别</option>
                        </select> <label style="color:#999;">(可以不选)</label>
                    </td>
                </tr>
                <tr>
                    <td>关键字：</td>
                    <td>
                        <input type="text" class="txt w150" id="txtKeywords" />
                        <a class="btn btnc22" onclick="getStation();"><span>搜索</span></a>
                    </td>
                </tr>
            </table>
        </div>
        <div class="operbar" style="border-top:solid 1px #99bbe8; text-align:left;padding:0 10px; line-height:26px;">选择故障区段</div>
        <div style="padding:5px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td rowspan="2" style="width:60px;">故障区段</td>
                <td style="width:70px;"><label><input id="rbLineType1" type="radio" name="rbLineType" value="1" checked="checked" />自闭线</label></td>
                <td rowspan="2">
                    <select id="ddlStation" class="select" style="margin:0 2px;"><option value="">选择车站</option></select>站
                    至
                    <select id="ddlStation1" class="select" style="margin:0 2px;"><option value="">选择车站</option></select>站 之间
                </td>
            </tr>
            <tr>
                <td><label><input id="rbLineType2" type="radio" name="rbLineType" value="2" />贯通线</label></td>
            </tr>
        </table>
        </div>
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
    getRailwayLine(cms.util.$('ddlLine'));
    getStation();
    cms.util.$('rbLineType1').focus();
});

$(window).resize(function(){
    setBodySize();
});

var setBodySize = function(){
    var bodySize = cms.util.getBodySize();
    cms.util.$('mainContent').style.height = (bodySize.height - 32) + 'px';
    cms.util.$('mainContent').style.width = (bodySize.width) + 'px';
};

var getStation = function(){
    var strKeywords = cms.util.$('txtKeywords').value.trim();
    var lineId = cms.util.$('ddlLine').value.trim();
    var ddl = cms.util.$('ddlStation');
    var ddl1 = cms.util.$('ddlStation1');
    
    getRailwayStation(lineId, strKeywords, ddl, ddl1);  
};

var saveContent = function(isClose){
    var strResult = '故障区段：';
    var strLineType = parseInt(cms.util.getRadioCheckedValue('rbLineType', 1), 10) == 1 ? '自闭线' : '贯通线';
    var strStation = cms.util.$('ddlStation').value.trim().split('_')[1];
    var strStation1 = cms.util.$('ddlStation1').value.trim().split('_')[1];
    
    strResult += strLineType + ' ' + strStation + '站 至 ' + strStation1 + '站 之间';
    
    updateControlValue(eid, step, sub, isClose, true, strResult, false);
};

var cancel = function(){    
    updateControlValue(eid, step, sub, true);
};
</script>