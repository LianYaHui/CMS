<%@ Page Language="C#" AutoEventWireup="true" CodeFile="6.aspx.cs" Inherits="modules_responsePlan_info_6" %>

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
        .tbdoc{border:solid 1px #ccc; border-collapse:collapse; width:660px; margin:0 10px;}
        .tbdoc td{border:solid 1px #ccc; text-align:center;}
        .tbdoc td span{width:30px; display:inline-block;}
        .ctitle{background:#080;height:24px; text-align:center; color:#fff;}
        .cimgbo
    </style>
</head>
<body>
    <div style="width:660px;height:35px; line-height:35px; font-size:20px; font-weight:bold; text-align:center;">接触网作业车作业（巡视）计划单</div>    
    <div id="docbox" style="overflow:auto;height:415px;">
        <table cellpadding="0" cellspacing="0" class="tbdoc" border="1">
		    <tr>
			    <td colspan="2" style="width:140px;">作业（巡视）日期</td>
			    <td style="width:260px;"></td>
			    <td style="width:70px;">工作领导人</td>
			    <td style="width:80px;"></td>
			    <td style="width:50px;">行别</td>
			    <td style="width:60px;"></td>
		    </tr>
		    <tr>
			    <td colspan="2">作业（巡视）范围</td>
			    <td></td>
			    <td>座台要令人</td>
			    <td></td>
			    <td>座台地点</td>
			    <td></td>
		    </tr>
		    <tr>
			    <td colspan="2">实际调度命令<br />
		        封锁范围</td>
			    <td colspan="5"></td>
		    </tr>
		    <tr>
			    <td colspan="2" style="height:50px;">进入封锁区间径路</td>
			    <td colspan="5"></td>
		    </tr>
		    <tr>
			    <td style="width:70px;">车号</td>
			    <td style="width:70px;">司机</td>
			    <td colspan="2" style="width:330px;">作业车（作业、巡视）运行要求</td>
			    <td colspan="3" style="width:190px;">作业区段外轨超高（曲线），使用平台要求</td>
		    </tr>
		    <tr>
			    <td rowspan="4">&nbsp;</td>
			    <td>&nbsp;</td>
			    <td colspan="2" rowspan="4"></td>
			    <td colspan="3" rowspan="4"></td>
		    </tr>
		    <tr>
			    <td>&nbsp;</td>
		    </tr>
		    <tr>
			    <td>&nbsp;</td>
		    </tr>
		    <tr>
			    <td>&nbsp;</td>
		    </tr>
		    <tr>
			    <td rowspan="4">&nbsp;</td>
			    <td>&nbsp;</td>
			    <td colspan="2" rowspan="4"></td>
			    <td colspan="3" rowspan="4"></td>
		    </tr>
		    <tr>
			    <td>&nbsp;</td>
		    </tr>
		    <tr>
			    <td>&nbsp;</td>
		    </tr>
		    <tr>
			    <td>&nbsp;</td>
		    </tr>
		    <tr>
			    <td rowspan="4">&nbsp;</td>
			    <td>&nbsp;</td>
			    <td colspan="2" rowspan="4"></td>
			    <td colspan="3" rowspan="4"></td>
		    </tr>
		    <tr>
			    <td>&nbsp;</td>
		    </tr>
		    <tr>
			    <td>&nbsp;</td>
		    </tr>
		    <tr>
			    <td>&nbsp;</td>
		    </tr>
		    <tr>
			    <td colspan="2">作业区段坡道情况<br>
		        及作业、连挂要求</td>
			    <td colspan="5"></td>
		    </tr>
		    <tr>
			    <td colspan="2" style="width:140px;">座台人员掌握作业车进出车站、站场转线情况，告知施工负责人及司机情况。（座台人员按实际填写）</td>
			    <td colspan="5"></td>
		    </tr>
		    <tr>
			    <td colspan="7" style="text-align:left;">注：1、施工负责人、座台人员、作业车各司机各一份；2、作业（巡视）方式在相应的方格打√，计划单上有3台作业车的作业要求，作业组超过3台另外填写；3、“调度命令封锁范围”一项由司机确认后按实际封锁范围填写；4、“进入封锁区间径路”一项由司机按车站布置的径路（含进入封锁区间前，有无转线调车情况）填写；5、“作业车（作业、巡视）运行要求”填写作业车的运行方式、停车地点、解列次序、解列地点（杆号）以及上下地线地点、返回连挂的运行方式等；6、“作业区段外轨超高（曲线）使用平台要求”填写在外轨超高线路（曲线）作业的要求（段规定使用和禁止使用平台以及使用抓轨器的要求）；7、“作业区段坡道情况及作业、连挂要求”填写在坡道作业方向、连挂方式和安全注意事项；8、“座台人员掌握作业车进出车站、站场转线情况”一项由座台人员按实际情况填写，及时预告施工负责人（司机），车站对作业车安排的运行、调车计划，但不能作为代替车站车机联控和调车联控职责。9、座台人员计划单该次计划完成后，此单交由本车组保留备查；10、此计划单保留期限为二个月。</td>
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
        $('#docbox').height(bodySize.height - 35);
    }
</script>