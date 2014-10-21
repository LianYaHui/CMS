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
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class modules_previewFlash_default : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strDevCode = string.Empty;

    protected string strRtmpUrl = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            Master.ShowPageMenu(MenuType.WebMenu.GetHashCode(), Public.GetRequest("menuCode", string.Empty));
            Master.ShowPageTop(Public.GetRequest("showHeader", 1) == 1);
            this.GetUserInfo();

            this.strDevCode = Public.RequestString("devCode");

            //this.strRtmpUrl = "rtmp://" + Zyrh.Common.DomainIp.GetServerIp(this.Request.Url.Host) + ":1935/live";
            this.strRtmpUrl = "rtmp://112.15.139.58:1935/live";
        }
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

}