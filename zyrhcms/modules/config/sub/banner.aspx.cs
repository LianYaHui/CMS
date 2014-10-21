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
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class modules_config_banner : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected string strConfigFileName = String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), Config.GetConfigFileName());
    protected string strKeyImage = "TopBanner";
    protected string strKeyImageIndex = "IndexTopBanner";

    protected string strPageTitle = "背景图片设置";
    protected string strFileDir = String.Format("{0}{1}/", Config.WebDir, Config.ImageDir);
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
        string strFilePath = strFileDir + Public.GetAppSetting(strKeyImage).Split('?')[0];
        System.Drawing.Image img;
        FileInfo fi;

        if (File.Exists(Server.MapPath(strFilePath)))
        {
            this.imgBanner.ImageUrl = String.Format("{0}?{1}", strFilePath, Public.NoCache());

            img = System.Drawing.Image.FromFile(Server.MapPath(strFilePath));

            fi = new FileInfo(Server.MapPath(strFilePath));

            this.lblInfo.Text = String.Format("{0}, {1}×{2}px, {3}kb", fi.Name, img.Width, img.Height, Math.Round(Convert.ToDouble(fi.Length) / 1024.0, 2));

            img.Dispose();
        }
        else
        {
            this.lblInfo.Text = "图片文件不存在";
        }

        strFilePath = strFileDir + Public.GetAppSetting(strKeyImageIndex).Split('?')[0];
        if (File.Exists(Server.MapPath(strFilePath)))
        {
            this.imgBannerIndex.ImageUrl = String.Format("{0}?{1}", strFilePath, Public.NoCache());

            img = System.Drawing.Image.FromFile(Server.MapPath(strFilePath));

            fi = new FileInfo(Server.MapPath(strFilePath));

            this.lblInfoIndex.Text = String.Format("{0}, {1}×{2}px, {3}kb", fi.Name, img.Width, img.Height, Math.Round(Convert.ToDouble(fi.Length) / 1024.0, 2));

            img.Dispose();
        }
        else
        {
            this.lblInfoIndex.Text = "图片文件不存在";
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

    #region  上传背景图片
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
            FileOperate fo = new FileOperate();

            string strPattern = "(.png|.jpg|.gif)";
            FileExtension[] fx = new FileExtension[] { FileExtension.PNG, FileExtension.GIF, FileExtension.JPG };

            Dictionary<string, string> dic = new Dictionary<string, string>();

            string strFileName = this.fileBanner.PostedFile.FileName;
            if (!strFileName.Equals(string.Empty))
            {
                if (!new Regex(strPattern).IsMatch(Path.GetExtension(strFileName).ToLower()))
                {
                    this.lblError.InnerHtml = "提示：图片格式错误";
                    return;
                }

                if (!FileOperate.ValidateFileExtension(this.fileBanner, fx))
                {
                    this.lblError.InnerHtml = "提示：图片格式错误.";
                    return;
                }

                if (!Directory.Exists(Server.MapPath(strFileDir)))
                {
                    Directory.CreateDirectory(Server.MapPath(strFileDir));
                }

                strFileName = String.Format("banner{0}", Path.GetExtension(strFileName).ToLower());
                this.fileBanner.PostedFile.SaveAs(Server.MapPath(strFileDir + strFileName));

                dic.Add(strKeyImage, String.Format("{0}?{1}", strFileName, DateTime.Now.ToString("yyMMddHHmmss")));
            }

            strFileName = this.fileBannerIndex.PostedFile.FileName;
            if (!strFileName.Equals(string.Empty))
            {
                if (!new Regex(strPattern).IsMatch(Path.GetExtension(strFileName).ToLower()))
                {
                    this.lblError.InnerHtml = "提示：图片格式错误";
                    return;
                }

                if (!FileOperate.ValidateFileExtension(this.fileBannerIndex, fx))
                {
                    this.lblError.InnerHtml = "提示：图片格式错误.";
                    return;
                }

                if (!Directory.Exists(Server.MapPath(strFileDir)))
                {
                    Directory.CreateDirectory(Server.MapPath(strFileDir));
                }

                strFileName = String.Format("banner-index{0}", Path.GetExtension(strFileName).ToLower());
                this.fileBannerIndex.PostedFile.SaveAs(Server.MapPath(strFileDir + strFileName));

                dic.Add(strKeyImageIndex, String.Format("{0}?{1}", strFileName, DateTime.Now.ToString("yyMMddHHmmss")));
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

    protected void btnDelBanner_ServerClick(object sender, EventArgs e)
    {
        try
        {
            string strFilePath = strFileDir + Public.GetAppSetting(strKeyImage).Split('?')[0];
            if (File.Exists(Server.MapPath(strFilePath)))
            {
                File.Delete(Server.MapPath(strFilePath));
            }
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add(strKeyImage, string.Empty);

            ConfigOperate co = new ConfigOperate();
            co.UpdateAppSettings(this.strConfigFileName, dic);

            this.Response.Redirect(this.Request.Url.ToString());
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    protected void btnDelIndexBanner_ServerClick(object sender, EventArgs e)
    {
        try
        {
            string strFilePath = strFileDir + Public.GetAppSetting(strKeyImageIndex).Split('?')[0];
            if (File.Exists(Server.MapPath(strFilePath)))
            {
                File.Delete(Server.MapPath(strFilePath));
            }
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add(strKeyImageIndex, string.Empty);

            ConfigOperate co = new ConfigOperate();
            co.UpdateAppSettings(this.strConfigFileName, dic);

            this.Response.Redirect(this.Request.Url.ToString());
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
}