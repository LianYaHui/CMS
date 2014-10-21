<%@ Page Language="C#" AutoEventWireup="true" CodeFile="userinfo.aspx.cs" Inherits="common_aspx_userinfo" %><!DOCTYPE html>
<html>
<head>
    <title>用户信息</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <style type="text/css">
        body{background:#fff;}
    </style>
</head>
<body>
    <div>
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td>组织机构：</td>
                <td><%=ui.UnitName%></td>
            </tr>
            <tr>
                <td class="w100">用户名：</td>
                <td><%=ui.UserName%></td>
            </tr>
            <tr>
                <td>用户权限：</td>
                <td><%=ui.RoleName%></td>
            </tr>
            <tr>
                <td>登录次数：</td>
                <td><%=ui.LoginTimes%></td>
            </tr>
            <tr>
                <td>最后登录时间：</td>
                <td><%=ui.LastLoginTime%></td>
            </tr>
            <tr>
                <td>帐户创建时间：</td>
                <td><%=ui.CreateTime%></td>
            </tr>
            <tr>
                <td>帐户过期时间：</td>
                <td><%=ui.ExpireTime%></td>
            </tr>
            <tr>
                <td>限时预览时长：</td>
                <td><%=ui.TimeLimitedPreview <=0 ?"不限制":(ui.TimeLimitedPreview / 60).ToString() + "分钟"%></td>
            </tr>
        </table>
    </div>
</body>
</html>
<script type="text/javascript">
    $(".tbform tr").each(function(){
        $(this).children("td:first").addClass('tdr');
    });
</script>