<%@ Page Language="C#" AutoEventWireup="true" CodeFile="2.aspx.cs" Inherits="modules_responsePlan_info_2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <style type="text/css">
        body{color:#080;background:#fff;}
        .tbdoc{border:solid 1px #080; border-collapse:collapse; width:660px; margin:0 10px;}
        .tbdoc td{border:solid 1px #080; text-align:center; line-height:24px;}
        .tbdoc td span{width:30px; display:inline-block;}
        .input{border-bottom:solid 1px #080; display:inline-block; margin:0 5px -2px;}
        .tbdoc td .tbsub{border:none;}
        .tbdoc td .tbsub td{border:none; border-bottom:solid 1px #080; border-right:solid 1px #080;}
    </style>
</head>
<body>
    <div style="text-align:center; font-weight:bold; font-size:20px;width:660px;margin:0 10px;height:35px; line-height:35px;"><span class="input">接触网第一种工作票</span></div>
    <div style="margin:0 10px;height:25px;">
        <span class="input" style="width:100px;"></span><span style="font-size:16px;">接触网工班</span>
        <span style="font-size:16px;margin-left:300px;">第</span><span class="input" style="width:100px;"></span><span style="font-size:16px;">号</span>
    </div>
    <div id="docbox" style="overflow:auto;height:390px;">
        <table cellpadding="0" cellspacing="0" class="tbdoc" style="display:block;">
            <tr>
                <td style="width:100px;">作业地点</td>
                <td style="width:380px;"></td>
                <td style="width:60px;">发票人</td>
                <td style="width:120px;"></td>
            </tr>
            <tr>
                <td>作业内容</td>
                <td></td>
                <td>发票时间</td>
                <td></td>
            </tr>
            <tr>
                <td>工作票有效期</td>
                <td colspan="3">
                    <span></span>自
                    <span></span>年<span></span>月<span></span>日<span></span>时<span></span>分至
                    <span></span>年<span></span>月<span></span>日<span></span>时<span></span>分止
                </td>
            </tr>
            <tr>
                <td>工作领导人</td>
                <td colspan="3">
                    姓名：<span style="width:300px;"></span>
                    安全等级：<span style="width:150px;"></span>
                </td>
            </tr>
            <tr>
                <td>作业组成员<br />姓名及安全<br />等级（安全等级<br />填在括号内）</td>
                <td colspan="3">
                    <table cellpadding="0" cellspacing="0" style="width:100%;line-height:24px;" class="tbsub">
                        <%for(int i=0; i<5; i++){ %>
                        <tr>
                            <td><span style="width:80px;"></span>（<span></span>）</td>
                            <td><span style="width:80px;"></span>（<span></span>）</td>
                            <td><span style="width:80px;"></span>（<span></span>）</td>
                            <td style="border-right:none;"><span style="width:80px;border-right:none;"></span>（<span></span>）</td>
                        </tr>
                        <%} %>                    
                        <tr>
                            <td style="border-bottom:none;"><span style="width:80px;"></span>（<span></span>）</td>
                            <td style="border-bottom:none;"><span style="width:80px;"></span>（<span></span>）</td>
                            <td style="border-bottom:none;"><span style="width:80px;"></span>（<span></span>）</td>
                            <td style="border-right:none;border-bottom:none;">共计<span class="input" style="width:60px;"></span>人</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>需停电<br />的设备</td>
                <td colspan="3"></td>
            </tr>
            <tr>
                <td>装设接地<br />线的位置</td>
                <td colspan="3"></td>
            </tr>
            <tr>
                <td>作业区<br />防护措施</td>
                <td colspan="3"></td>
            </tr>
            <tr>
                <td style="height:150px;">其他<br />安全措施</td>
                <td colspan="3"></td>
            </tr>
            <tr>
                <td>变更作业组<br />成员记录</td>
                <td colspan="3"></td>
            </tr>
            <tr>
                <td>工作票<br />结束时间</td>
                <td colspan="3" style="text-align:right; padding-right:20px;">
                    <span></span>年<span></span>月<span></span>日<span></span>时<span></span>分
                </td>
            </tr>
            <tr>
                <td>工作领导人<br />（签字）</td>
                <td colspan="3">
                    <span style="width:200px;"></span>
                    <span style="width:60px;border-left:solid 1px #080;border-right:solid 1px #080;">发票人<br />（签字）</span>
                    <span style="width:200px;"></span>
                </td>
            </tr>
        </table>
        <div style="padding:10px;">
            附件：<a href="#">作业预想、收工会记录表</a>
        </div>
    </div>
</body>
</html>
<script type="text/javascript">
    $(window).load(function(){
        setBodySize();
    });
    $(window).resize(function(){
        setBodySize();
    });
    
    function setBodySize(){
        var bodySize = cms.util.getBodySize();
        $('#docbox').height(bodySize.height - 60);
    }
</script>