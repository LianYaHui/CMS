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

public partial class gpsTrack : System.Web.UI.Page
{
    protected string strDevCode = string.Empty;
    protected string strUserName = string.Empty;
    protected string strUserPwd = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.strDevCode = Public.RequestString("devCode");
            this.strUserName = Public.RequestString("user");
            this.strUserPwd = Public.RequestString("pwd");

            this.GotoGpsTrack(this.strDevCode, this.strUserName, this.strUserPwd);
        }
    }

    protected void GotoGpsTrack(string strDevCode, string strUserName, string strUserPwd)
    {
        try
        {
            string strUrl = String.Format("{0}/modules/gpsTrack/gpsTrack.aspx?devCode={1}&user={2}&pwd={3}",
                Public.WebDir, strDevCode, strUserName, strUserPwd);
            this.Server.Transfer(strUrl, false);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }

}