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
using Zyrh.Common;

public partial class modules_config_sub_iconUpload : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            string strFilePath = Public.RequestString("filePath");
            this.txtOldPath.Value = strFilePath;
        }
    }
    protected void btnUpload_ServerClick(object sender, EventArgs e)
    {
        try
        {
            string strFileName = this.fileIcon.PostedFile.FileName;
            if (strFileName.Equals(string.Empty))
            {
                return;
            }
            string strExtension = Path.GetExtension(strFileName).ToLower();
            strFileName = String.Format("{0}{1}{2}", DateTime.Now.ToString("yyyyMMddHHmmssfff"), "1", strExtension);
            string strDir = String.Format("{0}/icon/", Config.UploadFileDir).Replace("//", "/");
            string strFilePath = String.Format("{0}{1}", strDir, strFileName).Replace("//", "/");
            if (!Directory.Exists(Server.MapPath(Config.WebDir + strDir)))
            {
                Directory.CreateDirectory(Server.MapPath(Config.WebDir + strDir));
            }

            FileExtension[] fx = new FileExtension[] { FileExtension.PNG, FileExtension.GIF };
            if (!FileOperate.ValidateFileExtension(this.fileIcon, fx))
            {
                this.lblPrompt.InnerHtml = "提示：图片格式错误.<br />";
                return;
            }

            this.fileIcon.PostedFile.SaveAs(Server.MapPath(Config.WebDir + strFilePath));
            if (File.Exists(Server.MapPath(Config.WebDir + strFilePath)))
            {
                System.Drawing.Image img = System.Drawing.Image.FromFile(Server.MapPath(Config.WebDir + strFilePath));
                if (img.Width > 32 || img.Height > 32)
                {
                    string strNewImgPath = String.Format("{0}{1}{2}", DateTime.Now.ToString("yyyyMMddHHmmssfff"), "2", strExtension);
                    FileOperate.MakeThumbnail(Server.MapPath(Config.WebDir + strFilePath), Server.MapPath(Config.WebDir + strDir + strNewImgPath), 32, 32, MakeThumbnailMode.Cut);
                    if (File.Exists(Server.MapPath(Config.WebDir + strDir + strNewImgPath)))
                    {
                        img.Dispose();
                        if (strFilePath.IndexOf("skin") < 0)
                        {
                            File.Delete(Server.MapPath(Config.WebDir + strFilePath));
                        }
                        this.lblPrompt.InnerHtml = "<span style=\"color:#008000;\">图片已上传<br /></span>";
                        strFilePath = String.Format("{0}{1}", strDir, strNewImgPath).Replace("//", "/");
                        this.txtFilePath.Value = strFilePath;
                    }
                }
                else
                {
                    this.lblPrompt.InnerHtml = "<span style=\"color:#008000;\">图片已上传<br /></span>";
                    this.txtFilePath.Value = strFilePath;
                }
                img.Dispose();
            }
            else
            {
                this.lblPrompt.InnerHtml = "<span style=\"color:#f00;\">图片上传失败<br /></span>";
                this.txtFilePath.Value = this.txtOldPath.Value.Trim();
            }
            this.lblPrompt.InnerHtml += String.Format("<script>returnFilePath('{0}');</script>", strFilePath);
        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = "<span style=\"color:#f00;\">" + ex.Message + "<br /></span>";
        }
    }


    protected void btnReset_ServerClick(object sender, EventArgs e)
    {
        try
        {
            string strFilePath = this.txtFilePath.Value.Trim();
            if (!strFilePath.Equals(string.Empty))
            {
                if (File.Exists(Server.MapPath(Config.WebDir + strFilePath)))
                {
                    if (strFilePath.IndexOf("skin") < 0)
                    {
                        File.Delete(Server.MapPath(Config.WebDir + strFilePath));
                    }
                }
            }
            strFilePath = this.txtOldPath.Value.Trim();
            this.txtFilePath.Value = strFilePath;
            this.lblPrompt.InnerHtml = "<span style=\"color:#f50;\">操作已取消<br /></span>";
            this.lblPrompt.InnerHtml += String.Format("<script>returnFilePath('{0}');</script>", strFilePath);
        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = "<span style=\"color:#f00;\">" + ex.Message + "<br /></span>";
        }
    }

}
