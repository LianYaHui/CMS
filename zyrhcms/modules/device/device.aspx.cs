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
using System.Text;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.BLL.Server;
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.Model.Server;

public partial class modules_device_device : System.Web.UI.Page
{
    protected DeviceManage dm = new DeviceManage(Public.CmsDBConnectionString);
    protected DeviceInfo di = new DeviceInfo();

    protected string devCode = string.Empty;

    protected string strLatLng = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        Master.PageTitle = "设备详情";
        Master.ShowPageTop(false);

        if (!IsPostBack)
        {
            this.devCode = Public.RequestString("devCode", string.Empty);
            this.GetDeviceInfo(this.devCode);
        }
    }

    #region  获得设备配置信息
    protected void GetDeviceInfo(string devCode)
    {
        try
        {
            new DeviceStatusWebCheck().UpdateOvertimeDeviceStatus3G();

            DBResultInfo dbResult = dm.GetDeviceInfo(devCode);
            DataSet ds = dbResult.dsResult;

            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                this.di = dm.FillDeviceInfo(ds.Tables[0].Rows[0]);
                if (di.devStatus.Latitude.Equals(string.Empty) || di.devStatus.Latitude.Equals("0"))
                {
                    this.strLatLng = "-";
                }
                else
                {
                    this.strLatLng = di.devStatus.Latitude + "," + di.devStatus.Longitude;
                }
                ServerManage sm = new ServerManage(Public.CmsDBConnectionString);
                DBResultInfo dbServer = sm.GetServerInfo(this.di.DagServerId);
                DataSet dsServer = dbServer.dsResult;
                
                if (dsServer != null && dsServer.Tables[0] != null && dsServer.Tables[0].Rows.Count > 0)
                {
                    ServerInfo dag = sm.FillServerInfo(dsServer.Tables[0].Rows[0]);
                    this.di.DagServer = dag;
                }

                dbServer = sm.GetServerInfo(this.di.CssServerId);
                dsServer = dbServer.dsResult;

                if (dsServer != null && dsServer.Tables[0] != null && dsServer.Tables[0].Rows.Count > 0)
                {
                    ServerInfo css = sm.FillServerInfo(dsServer.Tables[0].Rows[0]);
                    this.di.CssServer = css;
                }
            }
        }
        catch (Exception ex) { ServerLog.WriteErrorLog(ex, HttpContext.Current); }
    }
    #endregion

    #region  获得组织机构树
    public string GetControlUnitTree(string strParentTree)
    {
        try
        {
            ControlUnitManage cum = new ControlUnitManage(Public.CmsDBConnectionString);
            if (!strParentTree.Equals(string.Empty))
            {
                StringBuilder strResult = new StringBuilder();
                strParentTree = strParentTree.Replace(")(", ",").Replace("(", "").Replace(")", "");
                DataSet ds = cum.GetControlUnitParentList(strParentTree);
                if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    int n = 0;
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        ControlUnitInfo cui = cum.FillControlUnit(dr);
                        strResult.Append(n++ > 0 ? "&nbsp;>&nbsp;" : "");
                        strResult.Append(cui.UnitName);
                    }
                }
                return strResult.ToString();
            }
            else
            {
                return string.Empty;
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return ex.Message;
        }
    }
    #endregion

}
