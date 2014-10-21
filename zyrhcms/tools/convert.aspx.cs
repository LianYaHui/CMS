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

public partial class test_convert : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btnConvert_Click(object sender, EventArgs e)
    {
        string strSource = this.txtSource.Text;
        this.txtResult.Text = this.ConvertToCoding(strSource, "shift-jis");
        this.txtResult1.Text = this.ConvertToCoding(strSource, "unicode");
    }


    protected void btnConvert1_Click(object sender, EventArgs e)
    {
        string strCoding = this.txtCoding.Text.Trim();
        string strEncoding= this.ddlEncoding.SelectedValue.ToString().ToLower();
        this.txtString.Text = this.ConvertToString(strCoding, strEncoding);
    }

    #region  将字符串转换成编码
    public string ConvertToCoding(string strText, string strEncoding)
    {
        StringBuilder strResult = new StringBuilder();
        System.Text.Encoding encoding = Encoding.GetEncoding(strEncoding);

        char[] arr = strText.ToCharArray();

        if ("unicode".Equals(strEncoding))
        {
            foreach (char c in arr)
            {
                StringBuilder strTemp = new StringBuilder();
                byte[] buffer = encoding.GetBytes(c.ToString());
                foreach (byte b in buffer)
                {
                    //将字节数组0位1位的位置对换
                    strTemp.Insert(0, Convert.ToString(b, 16).PadLeft(2, '0'));
                }
                strResult.Append(buffer.Length < 2 ? "00" : "");
                strResult.Append(strTemp.ToString());
            }
        }
        else
        {
            /*
            byte[] buffer = encoding.GetBytes(strText);
            foreach (byte b in buffer)
            {
                strResult.Append(Convert.ToString(b, 16).PadLeft(2, '0'));
            }
            */

            foreach (char c in arr)
            {
                StringBuilder strTemp = new StringBuilder();
                byte[] buffer = encoding.GetBytes(c.ToString());
                foreach (byte b in buffer)
                {
                    //将字节数组0位1位的位置对换
                    strTemp.Append(Convert.ToString(b, 16).PadLeft(2, '0'));
                }
                strResult.Append(buffer.Length < 2 ? "00" : "");
                strResult.Append(strTemp.ToString());
            }
        }

        return strResult.ToString().ToUpper();
    }
    #endregion


    #region  将字符串转换成编码
    public string ConvertToString(string strCoding, string strEncoding)
    {
        StringBuilder strResult = new StringBuilder();
        System.Text.Encoding encoding = Encoding.GetEncoding(strEncoding);
        int len = strCoding.Length;
        if (len % 4 > 0)
        {
            len -= len % 4;
        }

        byte[] bytes = new byte[len / 2];

        if ("unicode".Equals(strEncoding))
        {
            for (int i = 0, j = 0; i < len; i += 4, j += 2)
            {
                bytes[j] = Convert.ToByte(strCoding.Substring(i + 2, 2), 16);
                bytes[j + 1] = Convert.ToByte(strCoding.Substring(i, 2), 16);
            }
        }
        else
        {
            for (int i = 0, j = 0; i < len; i += 4, j += 2)
            {
                bytes[j] = Convert.ToByte(strCoding.Substring(i, 2), 16);
                bytes[j + 1] = Convert.ToByte(strCoding.Substring(i + 2, 2), 16);
            }
        }
        strResult.Append(encoding.GetString(bytes));

        return strResult.ToString().ToUpper();
    }
    #endregion

}
