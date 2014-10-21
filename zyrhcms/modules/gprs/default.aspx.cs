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
using Zyrh.Model;

public partial class modules_gprs_default : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string MenuCode = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        this.MenuCode = Public.RequestString("menuCode");

        Master.ShowPageMenu(MenuType.WebMenu.GetHashCode(), this.MenuCode);
        Master.ShowPageTop(Public.GetRequest("showHeader", 1) == 1);
        this.GetUserInfo();
    }

    #region  获得登录用户信息
    public void GetUserInfo()
    {
        if (uc.CheckUserLogin())
        {
            ui = uc.GetLoginUserInfo();
            try
            {
                ControlUnitManage cum = new ControlUnitManage(Public.CmsDBConnectionString);
                DataSet dsUnit = cum.GetControlUnit(ui.UnitId);
                if (dsUnit != null && dsUnit.Tables[0] != null && dsUnit.Tables[0].Rows.Count > 0)
                {
                    DataRow drUnit = dsUnit.Tables[0].Rows[0];
                    ControlUnitInfo cui = cum.FillControlUnit(drUnit);
                    ui.UnitName = cui.UnitName;
                }
            }
            catch (Exception ex)
            {
                ServerLog.WriteErrorLog(ex, HttpContext.Current);
            }
        }
    }
    #endregion

}
