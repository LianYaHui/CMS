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
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class modules_sms_sub_soundRecord : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strPageTitle = "电话录音管理";

    protected string strTitle = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        this.CheckUserRole();

        if (!IsPostBack)
        {
            this.strTitle = Public.RequestString("title");
            //this.InitialData();
        }
        this.GetUserInfo();
    }

    #region  获得登录用户信息
    public void GetUserInfo()
    {
        if (uc.CheckUserLogin())
        {
            ui = uc.GetLoginUserInfo();
        }
    }
    #endregion


    #region  检测用户权限
    public void CheckUserRole()
    {
        try
        {
            if (!uc.CheckUserLogin())
            {
                this.Server.Transfer(Public.WebDir + Public.NoAuthUrl, false);
            }

            if (!uc.IsFounder && !uc.IsAdmin)
            {
                Response.Write("您没有权限查看电话录音文件记录");
                Response.Flush();
                Response.End();
            }
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

}