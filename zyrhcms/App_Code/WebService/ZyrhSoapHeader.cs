using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

/// <summary>
/// ZyrhSoapHeader 的摘要说明
/// </summary>
public class ZyrhSoapHeader: System.Web.Services.Protocols.SoapHeader
{

    private string userName = string.Empty;
    public string UserName
    {
        get { return this.userName; }
        set { this.userName = value; }
    }

    private string userPwd = string.Empty;
    public string UserPwd
    {
        get { return this.userPwd; }
        set { this.userPwd = value; }
    }

    public ZyrhSoapHeader()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    public ZyrhSoapHeader(string userName, string userPwd)
    {
        this.userName = userName;
        this.userPwd = userPwd;
    }

}
