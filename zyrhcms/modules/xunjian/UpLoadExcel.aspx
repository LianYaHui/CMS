<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UpLoadExcel.aspx.cs" Inherits="modules_xunjian_UpLoadExcel" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form class="margin5">
        <link href="<%=Public.WebDir%>/modules/xunjian/Common/uploadify.css" rel="stylesheet" />
        <script src="<%=Public.WebDir%>/modules/xunjian/Common/swfobject.js"></script>
        <script src="<%=Public.WebDir%>/modules/xunjian/Common/jquery.uploadify.min.js"></script>


        <div class="win-tool-button">
            <input type="file" name="uploadify" id="uploadify" />
            <a id="btn-upLoad" data-size="s" class="ladda-button" data-color="purple" data-style="zoom-out">上传</a>
            <div></div>
        </div>
        <div id="fileQueue"></div>
    </form>

    <script>

        $(function () {
            $("#uploadify").uploadify({
                'uploader': _path + 'Common/uploadify.swf',
                'script': _path + 'UpLoadExcel.aspx?action=save',
                'cancelImg': _path + 'Common/cancel.png',
                'folder': _path + 'UpLoadFiles',
                'queueID': 'fileQueue',
                'auto': false,
                fileExt: '*.xlsx;*.xls',
                fileDesc: "Excel文件",
                'sizeLimit': 10240000,
                'multi': false,
                onComplete: function (event, queueID, fileObj, response, data) {
                    if (parseInt(response) > 0) {
                        MessageBox.Show("导入成功。。。。,总计倒入" + response + "条数据");
                    } else {
                        MessageBox.Show("上传异常，请联系管理员。。。。");
                    }
                    $("#fileupLoad-win").window("close");
                }
            });


            $("#btn-upLoad").click(function () {
                $('#uploadify').uploadifyUpload();
            });
        });

    </script>
</body>
</html>
