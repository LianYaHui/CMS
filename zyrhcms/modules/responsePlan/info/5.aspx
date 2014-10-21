<%@ Page Language="C#" AutoEventWireup="true" CodeFile="5.aspx.cs" Inherits="modules_responsePlan_info_5" %>

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
        .tbdoc{border:solid 1px #ccc; border-collapse:collapse; width:660px; margin:0;}
        .tbdoc td{border:solid 1px #ccc; text-align:center;}
        .tbdoc td span{width:30px; display:inline-block;}
        .ctitle{background:#080;height:24px; text-align:center; color:#fff;}
        .cimgbox{display:block;width:230px;height:200px; overflow:auto;}
    </style>
</head>
<body>
    <div id="docbox">
        <table cellpadding="0" cellspacing="0" class="tbdoc" id="tb6C" style="width:100%; height:450px;">
            <tr>
                <td>
                    <div class="ctitle">C1照片</div>
                    <div class="cimgbox"></div>
                </td>
                <td>
                    <div class="ctitle">C2照片</div>
                    <div class="cimgbox"></div>
                </td>
                <td>
                    <div class="ctitle">C3照片</div>
                    <div class="cimgbox"></div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="ctitle">C4照片</div>
                    <div class="cimgbox"></div>
                </td>
                <td>
                    <div class="ctitle">C5照片</div>
                    <div class="cimgbox">
                        <img src="../pics/036.jpg" alt="" />
                    </div>
                </td>
                <td>
                    <div class="ctitle">C6照片</div>
                    <div class="cimgbox">
                        <img src="../pics/036.jpg" alt="" />
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
<script type="text/javascript">
    var cellSize = {};
    var isMax = false;
    
    $(window).load(function(){
        setBodySize();
        $('#tb6C td').dblclick(function(){
            setCellSize($(this));
        });        
    });
    
    $(window).resize(function(){
        setBodySize();
    });
        
    function setBodySize(){
        var bodySize = cms.util.getBodySize();
        cellSize = {width:bodySize.width/3, height:bodySize.height/2};
        $('#docbox').height(bodySize.height);
        $('#tb6C').height(bodySize.height);
        if(!isMax){
            $('#tb6C td').width(cellSize.width);
            $('#tb6C td').height(cellSize.height);
            $('#tb6C td .cimgbox').width(cellSize.width);
            $('#tb6C td .cimgbox').height(cellSize.height - 25);
        }
    }
    setBodySize();
    
    function setCellSize(obj){
        var bodySize = cms.util.getBodySize();
        cellSize = {width:bodySize.width/3, height:bodySize.height/2};
        
        if(obj.prop('lang') == '' || obj.prop('lang') == 'normal'){
                obj.width(bodySize.width);
                obj.height(bodySize.height);
                obj.attr('lang', 'max');
                isMax = true;
                $('#tb6C td .cimgbox').width(bodySize.width);
                $('#tb6C td .cimgbox').height(bodySize.height - 25);
                $('#tb6C td').hide();
                obj.show();
        } else {
            obj.width(cellSize.width);
            obj.height(cellSize.height);
            
            obj.attr('lang', 'normal');
            isMax = false;
            $('#tb6C td .cimgbox').width(cellSize.width);
            $('#tb6C td .cimgbox').height(cellSize.height - 25);
            $('#tb6C td').show();
        }
    }
</script>