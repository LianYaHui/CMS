<%@ Page Language="C#" AutoEventWireup="true" CodeFile="1.aspx.cs" Inherits="modules_responsePlan_info_1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <style type="text/css">
        body{margin:0; padding:0;font-size:12px; font-family:宋体,Arial; background:#fff;}
        .divform{background:#dfe8f6; padding:0 10px;}
        .tbform{}
        .tbform td{height:26px;}
        .tbstep{width:680px;border-collapse:collapse;}
        .tbstep td{ height:24px; text-align:center;}
        .tbstep .cur{background:#080; color:#fff;}
    </style>
</head>
<body>
    <div class="divform">
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td style="width:80px;">日计划号：</td>
                <td style="width:120px;"></td>
                <td style="width:80px;">施工类型：</td>
                <td style="width:120px;"></td>
                <td style="width:80px;">作业时间：</td>
                <td></td>
            </tr>
            <tr>
                <td>作业项目：</td>
                <td></td>
                <td>作业等级：</td>
                <td></td>
                <td>施工地点：</td>
                <td></td>
            </tr>
            <tr>
                <td>施工内容：</td>
                <td colspan="5"></td>
            </tr>
        </table>
    </div>
    <div class="divform" style="padding:10px;">
        <table cellpadding="0" cellspacing="0" class="tbstep">
            <tr>
                <td class="cur">1.开始</td>
                <td>2.工区上报</td>
                <td>3.车间审批</td>
                <td>4.段审批</td>
                <td>5.计划下达</td>
                <td>6.工区执行</td>
                <td>7.工单编制</td>
                <td>8.完成反馈</td>
                <td>9.完成</td>
            </tr>
        </table>
    </div>
    <div class="titlebar"><div class="title">前后5天范围内历史作业记录</div></div>
    <div class="listheader">
        <table cellpadding="0" cellspacing="0" class="tbheader">
            <tr>
                <td style="width:120px;">作业项目</td>
                <td style="width:120px;">站内/区间</td>
                <td style="width:120px;">施工地点</td>
                <td style="width:80px;">施工负责人</td>
                <td style="width:120px;">施工日期</td>
                <td style="width:120px;">作业时段</td>
                <td></td>
            </tr>
        </table>
    </div>
</body>
</html>