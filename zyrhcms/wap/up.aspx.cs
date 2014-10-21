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

public partial class wap_up : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void Button1_Click(object sender, EventArgs e)
    {
        string strFileName = Path.GetFileName(this.File1.PostedFile.FileName.Trim());
        string strFilePath = Server.MapPath("pic/" + strFileName);

        this.File1.PostedFile.SaveAs(strFilePath);

        Response.Write("图片上传成功。图片路径：" + Public.GetRootUrl(HttpContext.Current.Request) + "/wap/pic/" + strFileName);
        this.Image1.ImageUrl = Public.GetRootUrl(HttpContext.Current.Request) + "/wap/pic/" + strFileName;
    }
}
