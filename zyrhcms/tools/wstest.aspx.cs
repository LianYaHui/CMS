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
using System.Text;
using System.Text.RegularExpressions;

public partial class tools_wstest : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.InitialData();
        }
    }

    protected void InitialData()
    {
        string strParamContent = this.txtParamContent.Text.Trim();
        strParamContent = strParamContent.Replace("{StartTime}", DateTime.Now.ToString("yyyy-MM-dd 00:00:00"));
        strParamContent = strParamContent.Replace("{EndTime}", DateTime.Now.ToString("yyyy-MM-dd 23:59:59"));
        this.txtParamContent.Text = strParamContent;
    }

    protected void btnSearch_Click(object sender, EventArgs e)
    {
        try
        {
            string strParamCode = this.txtParamCode.Text.Trim();
            string strParamContent = this.txtParamContent.Text.Trim();
            if (strParamCode.Equals(string.Empty) || strParamContent.Equals(string.Empty))
            {
                this.txtResult.Text = string.Empty;
                this.lblPrompt.Text = "";
                return;
            }
            string strXml = new WuhanWS.WebService1().Process(strParamCode, strParamContent.ToString());
            
            Regex regObj = new Regex("<ROW>(.|\n)*?</ROW>", RegexOptions.Multiline | RegexOptions.IgnoreCase);
            int count = regObj.Matches(strXml).Count;
            this.lblPrompt.Text = "共" + count + "条数据";

            if (!strXml.Equals(string.Empty))
            {
                strXml = strXml.Replace("<", "\r\n<");
                strXml = strXml.Replace("\r\n</", "</");
                strXml = strXml.Replace("\r\n<ROWSET>", "<ROWSET>");
                strXml = strXml.Replace("</ROW>", "\r\n</ROW>");
                strXml = strXml.Replace("</ROWSET>", "\r\n</ROWSET>");
            }
            this.txtResult.Text = strXml;
        }
        catch (Exception ex)
        {
            this.txtResult.Text = "出错了：\r\n" + ex.Message;
        }
    }
}
