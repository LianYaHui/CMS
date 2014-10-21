<%@ Page Language="C#" AutoEventWireup="true" CodeFile="gps.aspx.cs" Inherits="modules_tools_upgrade_gps" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>无标题页</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:TextBox ID="txtSql" runat="server" Width="800px" TextMode="multiLine" Height="100px">
        alter table {0} add mileage float(10,3) null default '0.000' comment '里程，单位:km/h';
        alter table {0} add acc_status smallint(1) DEFAULT '0' COMMENT 'ACC开关状态：0-关，1-开';
        alter table {0} add alarm_info smallint(2) DEFAULT '0' COMMENT '警情:1-SOS报警，2,3,4-一、二、三级报警，5-区域报警，6,7,8-外部报警一、二、三，9,10-报警输出一、二';
        alter table {0} add io_status varchar(16) DEFAULT NULL COMMENT 'IO状态';
        </asp:TextBox>
        <br />
        <asp:Button ID="btnUpgrade" runat="server" Text="升级" OnClick="btnUpgrade_Click" />
    </div>
    </form>
</body>
</html>
