using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class modules_config_menu : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strConfigFileName = String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), Config.GetMenuConfigFileName());

    protected string strTitle = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        this.CheckUserRole();
        
        if (!IsPostBack)
        {
            this.strTitle = Public.RequestString("title");
            this.InitialData();
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

            if (!uc.IsFounder)
            {
                Response.Write("您没有权限设置系统配置");
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


    #region  初始化
    public void InitialData()
    {
        this.GetMenu();
    }
    #endregion

    #region  验证帐户密码
    protected bool CheckUserPwd(string strUserName, string strUserPwd)
    {
        try
        {
            if (strUserPwd.Equals(string.Empty))
            {
                return false;
            }
            if (strUserPwd.Length != 32 && !UserCenter.CheckUserPwdFormat(strUserPwd))
            {
                this.lblUserPwd.InnerHtml = "密码格式输入错误！";
                return false;
            }
            UserInfo ui = new UserManage(Public.CmsDBConnectionString).GetUserInfo(strUserName);
            int login = uc.UserLogin(ui, strUserPwd);
            if (login == 1)
            {
                this.lblUserPwd.InnerHtml = "";
                return true;
            }
            else if (login > 0)
            {
                this.lblUserPwd.InnerHtml = "帐户已注销或受限！";
                return false;
            }
            else
            {
                this.lblUserPwd.InnerHtml = "密码输入错误！";
                return false;
            }
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得导航菜单
    public void GetMenu()
    {
        try
        {
            List<CmsMenuInfo> lstMenu = new CmsMenuManage().GetCmsMenu(Server.MapPath(this.strConfigFileName), MenuType.WebMenu.GetHashCode(), -1, 1);
            this.divMenu_Web.InnerHtml = this.BuildMenu(lstMenu);

            lstMenu = new CmsMenuManage().GetCmsMenu(Server.MapPath(this.strConfigFileName), MenuType.ManageMenu.GetHashCode(), -1, 1);
            this.divMenu_Manage.InnerHtml = this.BuildMenu(lstMenu);
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  显示导航菜单项
    public string BuildMenu(List<CmsMenuInfo> lstMenu)
    {
        try
        {
            StringBuilder strMenu = new StringBuilder();
            int n = 0;
            int c = lstMenu.Count;
            bool isShow = true;
            string strChecked = string.Empty;
            string strDisabled = string.Empty;

            strMenu.Append("<table cellpadding=\"0\" cellspacing=\"0\" class=\"tblist\" style=\"width:auto;\">");
            strMenu.Append("<tr>");
            foreach (CmsMenuInfo info in lstMenu)
            {
                n++;
                isShow = info.IsShow == 1;
                strChecked = isShow ? " checked=\"checked\" " : string.Empty;
                strDisabled = info.MenuCode.Equals("20100") ? " disabled=\"disabled\" " : string.Empty;

                strMenu.Append("<td style=\"width:75px;\">");
                strMenu.Append(isShow ? info.MenuName : String.Format("<s>{0}</s>", info.MenuName));
                strMenu.Append("</td>");
                strMenu.Append("<td style=\"width:55px;\">");
                strMenu.Append("<label class=\"chb-label-nobg\" style=\"margin-top:5px;\">");
                strMenu.Append(String.Format("<input type=\"checkbox\" name=\"chbMenu\" class=\"chb\" value=\"{0}\" {1}{2} />", info.MenuCode, strChecked, strDisabled));
                strMenu.Append(String.Format("<span>{0}</span>", "启用"));
                strMenu.Append("</label>");
                strMenu.Append("</td>");
                if (n > 0 && n % 6 == 0)
                {
                    strMenu.Append("</tr>");
                    if (n < c)
                    {
                        strMenu.Append("<tr>");
                    }
                }
                else if (n == c)
                {
                    strMenu.Append("</tr>");
                }
            }
            strMenu.Append("</table>");

            return strMenu.ToString();
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  设置导航菜单
    public void SetMenu()
    {
        try
        {
            string strUserPwd = this.txtUserPwd.Value.Trim();
            string strUserName = uc.GetLoginUserName();

            if (!this.CheckUserPwd(strUserName, strUserPwd))
            {
                return;
            }
            string strMenuList = this.txtMenuCodeList.Value.Trim();
            if (strMenuList.Equals(string.Empty))
            {
                return;
            }
            string[] arrMenuList = strMenuList.Split(',');

            string strFilePath = Server.MapPath(this.strConfigFileName);
            XmlDocument doc = new XmlDocument();
            doc.Load(strFilePath);

            XmlNodeList xnl = doc.SelectNodes("/config/menu");
            if (xnl != null)
            {
                foreach (XmlNode xn in xnl)
                {
                    XmlAttribute code = xn.Attributes["code"];
                    if (code != null)
                    {
                        foreach (string str in arrMenuList)
                        {
                            string[] arrTemp = str.Split('_');
                            if (code.Value.Equals(arrTemp[0]))
                            {
                                XmlAttribute show = xn.Attributes["show"];
                                if (show != null)
                                {
                                    show.Value = arrTemp[1];
                                }
                                break;
                            }
                        }
                    }
                }
            }

            doc.Save(strFilePath);

            this.Response.Redirect(this.Request.Url.ToString());
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    protected void btnSave_ServerClick(object sender, EventArgs e)
    {
        this.SetMenu();
    }

    protected string ConvertChar(string strContent)
    {
        return HttpUtility.HtmlEncode(strContent).Replace("\r\n", "");//.Replace("&", "&amp;").Replace("\"", "&quot;").Replace("\r\n", "");
    }

    protected string RevertChar(string strContent)
    {
        return HttpUtility.HtmlDecode(strContent);//.Replace("&amp;", "&").Replace("&quot;", "\"");
    }

}