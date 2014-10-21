<%@ Page Language="C#" AutoEventWireup="true" CodeFile="upload.aspx.cs" Inherits="modules_gprsConfig_upload_upload" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>上传升级文件</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <style type="text/css">
        body{background:#fff;}
    </style>    
    <script type="text/jscript">
        function upload(){
            $('#btnUpload').click();
        }
        
        function setUpdateFile(filePath){
            parent.gprsConfig.getRemoteUpdateFile(filePath);
            if('' == filePath){
                $('#fileRemoteUpdate').focus();
            }
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        请上传升级程序文件，文件格式：.bin .hex
        <br />
        选择文件：<asp:FileUpload ID="fileRemoteUpdate" runat="server" CssClass="txt" />
        <a class="btn btnc22" onclick="upload();"><span>上传文件</span></a>
        <input id="btnUpload" type="submit" value="上传" runat="server" onserverclick="btnUpload_ServerClick" style="visibility:hidden;" />
        <br />
        <asp:Label ID="lblPrompt" runat="server" Text="" ForeColor="red"></asp:Label>
    </div>
    </form>
</body>
</html>