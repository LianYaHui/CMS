<%@ Page Language="C#" AutoEventWireup="true" CodeFile="iconUpload.aspx.cs" Inherits="modules_config_sub_iconUpload" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/page.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/popwin/popwin.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.box.js"></script>
    
    <script type="text/javascript">
    function upload(){
        var config = {
            title: '提示信息',
            html: '确定要上传图片吗？',
            callBack: uploadCallBack
        };
        cms.box.confirm(config);
    }

    function uploadCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            $('#btnUpload').click();
        }
        pwobj.Hide();
    }

    function cancel(){
        var config = {
            title: '提示信息',
            html: '确定要取消吗？',
            callBack: cancelCallBack
        };
        cms.box.confirm(config);
    }

    function cancelCallBack(pwobj, pwReturn){
        if(pwReturn.dialogResult){
            $('#btnReset').click();
        }
        pwobj.Hide();
    }

    function returnFilePath(path){
        parent.setFilePath(path);
    }
    </script>
</head>
<body oncontextmenu="<%=Config.SetContextMenu()%>">
    <form id="form1" runat="server">
    <div style="padding:10px;">
        说明：设备在电子地图上显示的ICON图标，尺寸大小不得超过32px。<br />图片格式为.png|.gif，建议处理成透明背景的小图片。
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td>选择图片：</td>
                <td><input id="fileIcon" type="file" class="txt w200" runat="server" /></td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <label id="lblPrompt" runat="server"></label>
                    <a class="btn btnc22" onclick="upload(this);"><span>上传图片</span></a>
                    <a class="btn btnc22" onclick="cancel(this);"><span>取消</span></a>
                </td>
            </tr>
        </table>
        <input id="txtFilePath" runat="server" type="hidden" />
        <input id="txtOldPath" runat="server" type="hidden" />
        <input id="btnUpload" type="submit" value="上传图片" onserverclick="btnUpload_ServerClick" runat="server" style="visibility:hidden;width:0;height:0;" />
        <input id="btnReset" type="submit" value="取消" onserverclick="btnReset_ServerClick" runat="server" style="visibility:hidden;width:0;height:0;" />
    </div>
    </form>
</body>
</html>
<script type="text/javascript" src="<%=Public.WebDir%>/js/module.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/frame.js"></script>
<script type="text/javascript" src="<%=Public.WebDir%>/js/page.js"></script>