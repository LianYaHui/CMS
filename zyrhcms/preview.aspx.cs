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

public partial class preview : System.Web.UI.Page
{
    protected string strDevCode = string.Empty;
    protected string strUserName = string.Empty;
    protected string strUserPwd = string.Empty;
    protected int lineId = 1;
    protected int autoPlay = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.strDevCode = Public.RequestString("devCode");
            this.strUserName = Public.RequestString("user");
            this.strUserPwd = Public.RequestString("pwd");
            this.lineId = Public.RequestString("lineId", 1);
            this.autoPlay = Public.RequestString("autoPlay", 0);

            this.GotoPreview(this.strDevCode, this.strUserName, this.strUserPwd, this.lineId, this.autoPlay);
        }
    }

    protected void GotoPreview(string strDevCode, string strUserName, string strUserPwd, int lineId, int autoPlay)
    {
        try
        {
            string strUrl = String.Format("{0}/modules/preview/preview.aspx?devCode={1}&user={2}&pwd={3}&lineId={4}&autoPlay={5}", 
                Public.WebDir, strDevCode, strUserName, strUserPwd, lineId, autoPlay);
            this.Server.Transfer(strUrl, false);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }

}