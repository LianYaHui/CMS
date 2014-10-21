<%@ Page Language="C#" AutoEventWireup="true" CodeFile="3.aspx.cs" Inherits="modules_responsePlan_info_3" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <style type="text/css">
        body{color:#000;background:#fff;}
        .tbdoc{border:solid 1px #000; border-collapse:collapse; width:660px; margin:0 10px;}
        .tbdoc td{border:solid 1px #000; text-align:center; line-height:24px; width:80px;}
        span{display:inline-block;}
        .input{border-bottom:solid 1px #000; display:inline-block;width:40px; margin:0 5px -2px;}
        .tbdoc td .tbsub{border:none;}
        .tbdoc td .tbsub td{border:none; border-bottom:solid 1px #080; border-right:solid 1px #080;}
    </style>
</head>
<body>
    <div style="width:660px; text-align:center; font-size:20px;font-weight:bold; line-height:35px;">检修作业分工单</div>
    <div style="margin:0 10px;height:25px;">
        <span>编号：</span><span class="input" style="width:100px;"></span>
        <span style="margin-left:320px;" class="input"></span>年<span class="input"></span>月<span class="input"></span>日
    </div>    
    <div id="docbox" style="overflow:auto;height:390px;">
        <table cellpadding="0" cellspacing="0" class="tbdoc">
            <tr>
                <td colspan="2">作业地点及内容</td>
                <td colspan="4"></td>
                <td style="width:80px;">工作领导人</td>
                <td style="width:120px;"></td>
            </tr>
            <tr>
                <td>要令地点</td>
                <td></td>
                <td>要令人员</td>
                <td></td>
                <td>座台地点</td>
                <td></td>
                <td>座台人员</td>
                <td></td>
            </tr>
            <tr>
                <td rowspan="3">验电接地</td>
                <td>接地杆号</td>
                <td colspan="4" rowspan="3">
                    <table cellpadding="0" cellspacing="0" class="tbsub" style="width:100%;">
                        <tr>
                            <td>操作人</td>
                            <td>监护人</td>
                            <td style="border-right:none;">接地杆号</td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td></td>
                            <td style="border-right:none;"></td>
                        </tr>
                        <tr>
                            <td style="border-bottom:none;">&nbsp;</td>
                            <td style="border-bottom:none;"></td>
                            <td style="border-bottom:none;border-right:none;"></td>
                        </tr>
                    </table>
                </td>
                <td>操作人</td>
                <td>监护人</td>
            </tr>
            <tr>
                <td>
                    &nbsp;</td>
                <td>
                    &nbsp;</td>
                <td>
                    &nbsp;</td>
            </tr>
            <tr>
                <td>
                    &nbsp;</td>
                <td>
                    &nbsp;</td>
                <td>
                    &nbsp;</td>
            </tr>
            <tr>
                <td rowspan="5">第一作业组</td>
                <td>作业范围</td>
                <td colspan="6"></td>
            </tr>
            <tr>
                <td>监护人</td>
                <td colspan="6"></td>
            </tr>
            <tr>
                <td>高空作业人</td>
                <td colspan="6"></td>
            </tr>
            <tr>
                <td>记录人</td>
                <td colspan="6" style="text-align:left;"><span style="width:250px;"></span>
                <span style="border-left:solid 1px #000;border-right:solid 1px #000;padding:0 10px;">测量人</span></td>
            </tr>
            <tr>
                <td>辅助人员</td>
                <td colspan="6"></td>
            </tr>
		    <tr>
                <td rowspan="5">第二作业组</td>
                <td>作业范围</td>
                <td colspan="6"></td>
            </tr>
            <tr>
                <td>监护人</td>
                <td colspan="6"></td>
            </tr>
            <tr>
                <td>高空作业人</td>
                <td colspan="6"></td>
            </tr>
            <tr>
                <td>记录人</td>
                <td colspan="6" style="text-align:left;"><span style="width:250px;"></span>
                <span style="border-left:solid 1px #000;border-right:solid 1px #000;padding:0 10px;">测量人</span></td>
            </tr>
            <tr>
                <td>辅助人员</td>
                <td colspan="6"></td>
            </tr>
		    <tr>
		        <td style="height:100px;">联系方式</td>
		        <td colspan="7"></td>
		    </tr>
		    <tr>
		        <td style="height:80px;">备注</td>
		        <td colspan="7"></td>
		    </tr>
        </table>
        <br />
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