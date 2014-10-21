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
using System.Text.RegularExpressions;
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class tools_wh : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string strMenuCode = string.Empty;
    protected string strUserName = string.Empty;
    protected string strUserPwd = string.Empty;
    protected int showHeader = 1;
    protected int lineId = 1;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.InitialData();
    }


    #region  初始化
    protected void InitialData()
    {
        try
        {
            this.strMenuCode = Public.GetRequest("menuCode", string.Empty);
            this.strUserName = Public.GetRequest("userName", "whgdd");
            this.strUserPwd = Public.GetRequest("userPwd", "132546");
            this.strUserPwd = Encrypt.HashEncrypt(this.strUserPwd, EncryptFormat.MD5).ToLower();

            this.showHeader = Public.GetRequest("showHeader", 1);

            if (!uc.CheckUserLogin())
            {
                if (!this.strUserName.Equals(string.Empty) && !this.strUserPwd.Equals(string.Empty))
                {
                    if (new UserLogin().Login(this.strUserName, this.strUserPwd.ToLower(), this.lineId) != "1")
                    {
                        this.Response.Redirect(Public.WebDir + Public.HomeUrl, false);
                        return;
                    }
                }
            }

            this.Response.Redirect(Public.WebDir + "/tools/wuhan.aspx", false);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
    }
    #endregion

}
