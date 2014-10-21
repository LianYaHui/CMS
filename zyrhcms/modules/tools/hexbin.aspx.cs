using System;
using System.Data;
using System.Configuration;
using System.Globalization;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Zyrh.Common;

public partial class modules_tools_hexbin : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btnConvert_Click(object sender, EventArgs e)
    {
        try
        {
            string strHex = this.txtHex.Text.Trim();
            string strHexContent = HexBin.DistillHexContent(strHex);

            byte[] szBin = HexBin.HexConvertBin(strHexContent);

            string strCrc = CRC.LongConvertString(CRC.CRC16(szBin, 0, strHexContent.Length/2), true);
            this.txtBin.Text = strHexContent + strCrc;
            this.lblInfo.Text = strHexContent.Length / 2 + "个字符" + "  CRC校验码：" + strCrc;

            //this.txtBin.Text = HexBin.HexConvertBinString(HexBin.DistillHexContent(strHex));
        }
        catch (Exception ex)
        {
            string strError = ex.Message;
        }
    }
}
