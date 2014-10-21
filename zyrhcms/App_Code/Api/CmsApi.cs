using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using Zyrh.Common;

/// <summary>
/// CmsApi 的摘要说明
/// </summary>
public class CmsApi
{
    public CmsApi()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    #region  获得抓拍图物理目录根目录
    public string GetCapturePictureDir()
    {
        try
        {
            return Public.GetRootPath() + "\\";
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

}
