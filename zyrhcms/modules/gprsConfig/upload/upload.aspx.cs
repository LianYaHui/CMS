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

public partial class modules_gprsConfig_upload_upload : System.Web.UI.Page
{
    protected string strType = "update";
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btnUpload_ServerClick(object sender, EventArgs e)
    {
        string strFile = this.fileRemoteUpdate.PostedFile.FileName;
        if (strFile.Equals(string.Empty))
        {
            this.lblPrompt.Text = "请选择升级文件。";
            return;
        }
        string strDir = Public.WebDir + "/download/updatefiles/";
        string strExtension = Path.GetExtension(strFile).ToLower();
        string strFileName = Path.GetFileNameWithoutExtension(strFile);
        strFileName += "_" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + strExtension;
        if (this.CheckFileName(strType, strExtension))
        {
            if (!Directory.Exists(Server.MapPath(strDir)))
            {
                Directory.CreateDirectory(Server.MapPath(strDir));
            }
            this.fileRemoteUpdate.SaveAs(Server.MapPath(strDir + strFileName));

            if (File.Exists(Server.MapPath(strDir + strFileName)))
            {
                this.lblPrompt.Text = "<span style=\"color:#00f;\">" + Server.MapPath(strDir + strFileName) + "<br />文件上传完毕</span>";
                this.lblPrompt.Text += "<script>setUpdateFile('" + strDir + strFileName + "');</script>";
            }
            else
            {
                this.lblPrompt.Text = "<span style=\"color:#00f;\">" + Server.MapPath(strDir + strFileName) + "<br />文件上传失败</span>";
                this.lblPrompt.Text += "<script>setUpdateFile('');</script>";
            }
        }
        else
        {
            this.lblPrompt.Text = "<span style=\"color:#f00;\">文件格式错误</span>";
            this.lblPrompt.Text += "<script>setUpdateFile('');</script>";
        }
    }

    public bool CheckFileName(string strType, string strExtension)
    {
        bool result = false;
        string strFormat = "";
        switch (strType)
        {
            case "update":
                strFormat = ".hex,.bin";
                result = strFormat.IndexOf(strExtension.ToLower()) >= 0;
                break;
        }
        return result;
    }

}
