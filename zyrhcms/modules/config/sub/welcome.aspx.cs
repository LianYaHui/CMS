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
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class modules_config_welcome : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected string strConfigFileName = String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), Config.GetConfigFileName());
    protected string strKeyImage = "WelcomeBg";
    protected string strPageTitle = "首页欢迎图片设置";
    protected string strFileDir = String.Format("{0}{1}/home/", Config.WebDir, Config.ImageDir);

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
        string strFilePath = strFileDir + Config.GetAppSetting(strKeyImage).Split('?')[0];
        if (File.Exists(Server.MapPath(strFilePath)))
        {
            this.imgWelcome.ImageUrl = String.Format("{0}?{1}", strFilePath, Public.NoCache());

            System.Drawing.Image img = System.Drawing.Image.FromFile(Server.MapPath(strFilePath));

            FileInfo fi = new FileInfo(Server.MapPath(strFilePath));

            this.lblInfo.Text = String.Format("{0}, {1}×{2}px, {3}kb", fi.Name, img.Width, img.Height, Math.Round(Convert.ToDouble(fi.Length) / 1024.0, 2));

            img.Dispose();
        }
        else
        {
            this.lblInfo.Text = "图片文件不存在";
        }
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

    #region  上传图片
    public void UploadImage()
    {
        try
        {
            string strUserPwd = this.txtUserPwd.Value.Trim();
            string strUserName = uc.GetLoginUserName();

            if (!this.CheckUserPwd(strUserName, strUserPwd))
            {
                return;
            }

            Dictionary<string, string> dic = new Dictionary<string, string>();

            string strFileName = this.fileWelcome.PostedFile.FileName;
            if (!strFileName.Equals(string.Empty))
            {
                FileOperate fo = new FileOperate();

                string strPattern = "(.png|.jpg|.gif)";
                if (!new Regex(strPattern).IsMatch(Path.GetExtension(strFileName).ToLower()))
                {
                    this.lblError.InnerHtml = "图片格式错误";
                    return;
                }

                FileExtension[] fx = new FileExtension[] { FileExtension.PNG, FileExtension.GIF, FileExtension.JPG };
                if (!FileOperate.ValidateFileExtension(this.fileWelcome, fx))
                {
                    this.lblError.InnerHtml = "图片格式错误.";
                    return;
                }

                if (!Directory.Exists(Server.MapPath(strFileDir)))
                {
                    Directory.CreateDirectory(Server.MapPath(strFileDir));
                }

                strFileName = String.Format("welcome{0}", Path.GetExtension(strFileName).ToLower());
                this.fileWelcome.PostedFile.SaveAs(Server.MapPath(strFileDir + strFileName));

                dic.Add(strKeyImage, String.Format("{0}?{1}", strFileName, DateTime.Now.ToString("yyMMddHHmmss")));
            }

            ConfigOperate co = new ConfigOperate();
            co.UpdateAppSettings(this.strConfigFileName, dic);

            this.Response.Redirect(this.Request.Url.ToString());
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    protected void btnUpload_ServerClick(object sender, EventArgs e)
    {
        this.UploadImage();
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