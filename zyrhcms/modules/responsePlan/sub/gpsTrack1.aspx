<%@ Page Language="C#" AutoEventWireup="true" CodeFile="gpsTrack1.aspx.cs" Inherits="modules_responsePlan_sub_gpsTrack1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <style type="text/css">
        .tblist{background:#fff;}
    </style>
</head>
<body>
    <div style="overflow:auto;" id="listbox">
    <table id="tbList" class="tblist" cellpadding="0" cellspacing="0" style="width:450px;">
        <tr style="background:#dfe8f6;">
            <td style="width:25px;">序号</td>
            <td style="width:85px;">设备编号</td>
            <td style="width:65px;">纬度</td>
            <td style="width:65px;">经度</td>
            <td style="width:25px;">速度</td>
            <td style="width:120px;">时间</td>
            <td></td>
        </tr>
        <tr>
            <td>1</td>
            <td>15266435913</td>
            <td>30.238028</td>
            <td>115.444511</td>
            <td>2</td>
            <td>2013-7-25 8:09:35</td>
            <td></td>
        </tr>
        <tr>
            <td>2</td>
            <td>15266435913</td>
            <td>30.238058</td>
            <td>115.444486</td>
            <td>2</td>
            <td>2013-7-25 8:09:46</td>
            <td></td>
        </tr>
        <tr>
            <td>3</td>
            <td>15266435913</td>
            <td>30.238058</td>
            <td>115.444503</td>
            <td>3</td>
            <td>2013-7-25 8:09:56</td>
            <td></td>
        </tr>
        <tr>
            <td>4</td>
            <td>15266435913</td>
            <td>30.238058</td>
            <td>115.444511</td>
            <td>1</td>
            <td>2013-7-25 8:10:16</td>
            <td></td>
        </tr>
        <tr>
            <td>5</td>
            <td>15266435913</td>
            <td>30.23805</td>
            <td>115.444503</td>
            <td>2</td>
            <td>2013-7-25 8:10:26</td>
            <td></td>
        </tr>
        <tr>
            <td>6</td>
            <td>15266435913</td>
            <td>30.23805</td>
            <td>115.444517</td>
            <td>2</td>
            <td>2013-7-25 8:10:37</td>
            <td></td>
        </tr>
    </table>
    </div>
</body>
</html>
<script type="text/javascript">
    $('#listbox').width($(window).width());
    $('#listbox').height($(window).height());
</script>
