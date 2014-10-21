<%@ Page Language="C#" AutoEventWireup="true" CodeFile="protocolManage.aspx.cs" Inherits="modules_tools_protocol_protocolManage" ValidateRequest="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>设备功能协议配置</title>
    <style type="text/css">
        body{margin:0; padding:5px; font-size:12px;}
        table{margin-bottom:5px;}
        table input{border:solid 1px #ddd; height:18px; line-height:18px; width:150px; margin-right:4px;}
        table .td{width:60px;}
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <table cellpadding="3" cellspacing="0" style="width:950px;">
            <tr>
                <td>
                    功能编号
                    <asp:TextBox ID="txtFunctionCode" runat="server" Width="60px"></asp:TextBox>
                    设备类型
                    <asp:DropDownList ID="ddlDeviceType" runat="server" Width="80px">
                    </asp:DropDownList>
                    功能名称
                    <asp:TextBox ID="txtFunctionName" runat="server" Width="150px"></asp:TextBox>
                    协议原型
                    <asp:TextBox ID="txtProtocol" runat="server" Width="280px"></asp:TextBox>
                    参数数量
                    <asp:TextBox ID="txtParameterQuantity" runat="server" Width="70px">0</asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    参数说明
                    <asp:TextBox ID="txtParameterDesc" runat="server" Width="880px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    协议示例
                    <asp:TextBox ID="txtProtocolDemo" runat="server" Width="880px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    回复代码
                    <asp:TextBox ID="txtResponseCode" runat="server" Width="182px"></asp:TextBox>
                    超时时间
                    <asp:TextBox ID="txtTimeout" runat="server" width="40px">30</asp:TextBox> 秒
                    &nbsp;
                    是否启用
                    <asp:DropDownList ID="ddlEnabled" runat="server">
                    <asp:ListItem Value="1">启用</asp:ListItem>
                    <asp:ListItem Value="0">不启用</asp:ListItem>
                    </asp:DropDownList>
                    <div style="float:right;margin-right:10px;">                        
                        更新记录ID <asp:TextBox ID="txtId" runat="server" Width="40px">0</asp:TextBox>
                        <asp:Button ID="btnCancel" runat="server" Text="取消更新" OnClick="btnCancel_Click" Width="65px" />
                    </div>
                </td>
            </tr>
        </table>
        <div>
            <asp:Button ID="btnUpdate" runat="server" Text="确认提交" OnClick="btnUpdate_Click" />
            <asp:CheckBox ID="chbContinue" runat="server" Text="添加成功后继续添加" />
            <asp:TextBox ID="txtSql" runat="server" Width="100px" ReadOnly="true" style="display:none;"></asp:TextBox><br />
        </div>
        <div style="padding:5px 0;">
        <asp:DropDownList ID="ddlDeviceTypeCode" runat="server" Width="80px">
        </asp:DropDownList>
            <asp:Button ID="btnLoad" runat="server" Text="加载配置" OnClick="btnLoad_Click" />
            <asp:Label ID="lblPrompt" runat="server" Text=""></asp:Label>
        </div>
        <div style="height:440px; overflow:auto;">
            <asp:GridView ID="gvFunction" runat="server" AutoGenerateColumns="False" CellPadding="2" BackColor="White" BorderColor="#CCCCCC" BorderStyle="Solid" BorderWidth="1px" OnSelectedIndexChanging="gvFunction_SelectedIndexChanging" DataKeyNames="id">
                <Columns>
                    <asp:TemplateField HeaderText="序号">
                        <ItemTemplate>
                            <%#(Container.DataItemIndex + 1)%>
                        </ItemTemplate>
                        <ItemStyle Width="30px" HorizontalAlign="center" />
                    </asp:TemplateField>
                    <asp:BoundField DataField="function_code" HeaderText="功能代码">
                        <ItemStyle Width="35px" HorizontalAlign="Center" />
                    </asp:BoundField>
                    <asp:BoundField DataField="function_name" HeaderText="功能名称" >
                        <ItemStyle Width="120px" />
                    </asp:BoundField>
                    <asp:BoundField DataField="device_type_code" HeaderText="设备类型" >
                        <ItemStyle Width="55px" HorizontalAlign="Center" />
                    </asp:BoundField>
                    <asp:TemplateField HeaderText="协议原型">
                        <ItemTemplate>
                            <%#Eval("protocol").ToString().Replace("|", "<br />") %>
                        </ItemTemplate>
                        <ItemStyle Width="120px" />
                    </asp:TemplateField>
                    <asp:BoundField DataField="parameter_quantity" HeaderText="参数数量" >
                        <ItemStyle Width="55px" HorizontalAlign="Center" />
                    </asp:BoundField>
                    <asp:BoundField DataField="parameter_desc" HeaderText="参数说明" />
                    <asp:TemplateField HeaderText="协议示例">
                        <ItemTemplate>
                            <%#Eval("protocol_demo").ToString().Replace("|", "<br />") %>
                        </ItemTemplate>
                        <ItemStyle Width="180px" />
                    </asp:TemplateField>
                    <asp:BoundField DataField="response_code" HeaderText="回复代码" >
                        <ItemStyle HorizontalAlign="Center" Width="60px" />
                    </asp:BoundField>
                    <asp:BoundField DataField="timeout" HeaderText="超时时间" >
                        <ItemStyle Width="30px" HorizontalAlign="Center" />
                    </asp:BoundField>
                    <asp:BoundField DataField="is_enabled" HeaderText="是否可用" >
                        <ItemStyle Width="30px" HorizontalAlign="Center" />
                    </asp:BoundField>
                    <asp:BoundField DataField="create_time" HeaderText="创建时间" >
                        <ItemStyle Width="70px" />
                    </asp:BoundField>
                    <asp:BoundField DataField="id" HeaderText="ID" >
                        <ItemStyle Width="30px" HorizontalAlign="Center" />
                    </asp:BoundField>
                    <asp:CommandField  ShowSelectButton="True" HeaderText="编辑" SelectText="编辑" >
                        <ItemStyle Width="30px" HorizontalAlign="Center" />
                    </asp:CommandField>
                </Columns>
                <FooterStyle BackColor="White" ForeColor="#000066" />
                <RowStyle BackColor="#F7F6F3" ForeColor="Black" Font-Names="Arial,宋体" Font-Size="12px" />
                <PagerStyle BackColor="White" ForeColor="#000066" HorizontalAlign="Left" />
                <SelectedRowStyle BackColor="#DBEBFE" />
                <HeaderStyle BackColor="#006699" Font-Bold="True" ForeColor="White" />
                <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
            </asp:GridView>
        </div>
    </div>
    </form>
</body>
</html>
