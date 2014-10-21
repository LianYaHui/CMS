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
using Zyrh.Model;
using Zyrh.Model.Device;
using Zyrh.BLL;
using Zyrh.BLL.Device;

public partial class modules_gprs_history : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected DeviceConfigManage dcm = new DeviceConfigManage(Public.CmsDBConnectionString);
    protected DeviceConfigInfo dci = new DeviceConfigInfo();
    protected string devCode = string.Empty;
    protected string strCode = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Config.ValidateUrlReferrer())
        {
            if (Request.UrlReferrer == null || !Request.UrlReferrer.Host.Equals(this.Request.Url.Host))
            {
                Response.Write("UrlReferrer Error");
                Response.End();
            }
        }
        if (!uc.CheckUserLogin())
        {
            this.Server.Transfer(Public.WebDir + "/common/aspx/noauth.aspx", false);
        }

        if (!IsPostBack)
        {
            this.devCode = Public.GetRequest("devCode", string.Empty);

            UserManage um = new UserManage(Public.CmsDBConnectionString);
            ui = um.GetUserInfo(uc.GetLoginUserName());
            this.strCode = new UserLogin().ResponseLoginUserInfo(ui);

            this.GetDeviceConfigInfo(this.devCode);
        }
    }

    #region  获得设备配置信息
    protected void GetDeviceConfigInfo(string devCode)
    {
        try
        {
            if (!devCode.Equals(string.Empty))
            {
                DataSet ds = dcm.GetDeviceConfigInfo(devCode, string.Empty);

                if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    DeviceConfigInfo dci = dcm.FillDeviceConfigInfo(ds.Tables[0].Rows[0]);
                    this.txtDevId.Value = dci.DevId.ToString();
                    this.txtDevCode.Value = dci.DevCode;
                    this.txtDevName.Value = dci.DevName;
                    this.txtDevTypeCode.Value = dci.TypeCode;
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

}
