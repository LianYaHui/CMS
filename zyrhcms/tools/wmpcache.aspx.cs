using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using wmp;

public partial class tools_wmpcache : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btnQuery_Click(object sender, EventArgs e)
    {
        string strIp = this.txtIp.Text.Trim();
        int port = Convert.ToInt32(this.txtPort.Text.Trim());
        string strDevId = this.txtDevId.Text.Trim();
        WmpCache wc = new WmpCache(strIp, port);

        string[] arrServer = wc.EnumServerIndex(ServerType.ST_DAG);
        foreach (string str in arrServer)
        {
            Response.Write(str + "<br />");
        }

        wmp.dag.DeviceRegisterInfo drInfo = wc.GetDeviceRegisterInfo(strDevId);
        if (drInfo != null)
        {
            Response.Write(drInfo.Ip + ":" + drInfo.Port.ToString());
        }
        else
        {
            Response.Write("设备不在线");
        }

        
    }
}
