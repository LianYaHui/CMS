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
using Zyrh.Common;

public partial class modules_tools_crc16 : System.Web.UI.Page
{
    protected StringOperate1 so = new StringOperate1();

    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        string strContent = this.TextBox1.Text.Trim();
        int len = so.GetLength(strContent, true);
        this.lblLen1.Text = len + "个字符";
        this.TextBox2.Text = CRC.LongConvertString(CRC.CRC16(strContent, Encoding.GetEncoding("UTF-8"), 0, so.GetLength(strContent, true)), false);
    }

    protected void Button2_Click(object sender, EventArgs e)
    {
        string strContent = this.TextBox3.Text.Trim();
        int len = so.GetLength(strContent, true);
        this.lblLen2.Text = len + "个字符";
        this.TextBox4.Text = CRC.LongConvertString(CRC.CRC16(strContent, Encoding.GetEncoding("GB2312"), 0, so.GetLength(strContent, true)), false);
    }
}
