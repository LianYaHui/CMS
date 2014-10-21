<%@ Page Language="C#" AutoEventWireup="true" CodeFile="info.aspx.cs" Inherits="tools_info" ValidateRequest="false" %>
<!DOCTYPE html>
<html>
<head>
    <title>无标题页</title>
    <link rel="stylesheet" type="text/css" href="<%=Public.WebDir%>/skin/default/css/main.css" />
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/jquery.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/common.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.const.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/cms.util.js"></script>
    <script type="text/javascript" src="<%=Public.WebDir%>/common/js/xheditor/xheditor.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <table cellpadding="0" cellspacing="0" class="tbform">
            <tr>
                <td><h3>修改部门信息</h3></td>
                <td><h3>修改所亭信息</h3></td>
            </tr>
            <tr>
                <td style="height: 22px">部门：<asp:DropDownList ID="ddlDepartment" runat="server" CssClass="select" AutoPostBack="True" OnSelectedIndexChanged="ddlDepartment_SelectedIndexChanged">
                </asp:DropDownList></td>
                <td style="height: 22px">所亭：<asp:DropDownList ID="ddlSubstation" runat="server" CssClass="select" AutoPostBack="True" OnSelectedIndexChanged="ddlSubstation_SelectedIndexChanged">
                </asp:DropDownList></td>
            </tr>
            <tr>
                <td>纬度：<asp:TextBox ID="txtDepartmentLatitude" runat="server" CssClass="txt w120"></asp:TextBox>
                    经度：<asp:TextBox ID="txtDepartmentLongitude" runat="server" CssClass="txt w120"></asp:TextBox></td>
                <td>纬度：<asp:TextBox ID="txtSubstationLatitude" runat="server" CssClass="txt w120"></asp:TextBox>
                    经度：<asp:TextBox ID="txtSubstationLongitude" runat="server" CssClass="txt w120"></asp:TextBox></td>
            </tr>
            <tr>
                <td>简介：<br />                                    
                    <div style="background:#fff;">
                    <textarea id="txtDepartmentIntroduce" name="txtDepartmentIntroduce" cols="20" rows="2" style="width:600px; height:450px;" runat="server"></textarea>
                    </div>
                    <script type="text/javascript">
                        $(document).ready(function() { 
                            $('#txtDepartmentIntroduce').xheditor({skin:'o2007silver',tools:"my",upImgUrl:"../modules/upload/upload.aspx?dir=info&type=pics",upImgExt:"jpg,jpeg,gif,png"}); 
                        }); 
                    </script>
                </td>
                <td>简介：<br />
                    <div style="background:#fff;">
                    <textarea id="txtSubstationIntroduce" name="txtSubstationIntroduce" cols="20" rows="2" style="width:600px; height:450px;" runat="server"></textarea>
                    </div>
                    <script type="text/javascript">
                        $(document).ready(function() { 
                            $('#txtSubstationIntroduce').xheditor({skin:'o2007silver',tools:"my",upImgUrl:"../modules/upload/upload.aspx?dir=info&type=pics",upImgExt:"jpg,jpeg,gif,png"}); 
                        }); 
                    </script>
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Button ID="btnUpdateDpartment" runat="server" Text="更新部门信息" OnClick="btnUpdateDpartment_Click" />
                    <asp:Label ID="lblDepartment" runat="server" Text=""></asp:Label></td>
                <td>
                    <asp:Button ID="btnUpdateSubstation" runat="server" Text="更新所亭信息" OnClick="btnUpdateSubstation_Click" />
                    <asp:Label ID="lblSubstation" runat="server" Text=""></asp:Label></td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>
