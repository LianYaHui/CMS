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
using System.Xml;

public partial class tools_XmlToArray : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btnConvert_Click(object sender, EventArgs e)
    {
        StringBuilder strArray = new StringBuilder();
        string strXml = this.txtXml.Text.Trim();
        string strRootName = this.txtRootName.Text.Trim();
        string strNodeName = this.txtNodeName.Text.Trim();

        XmlDocument xml = new XmlDocument();
        xml.LoadXml(strXml);
        XmlNode root;
        XmlNodeList nodeList;
        if (strNodeName.Equals(string.Empty))
        {
            nodeList = xml.SelectNodes(strNodeName);
        }
        else
        {
            root = xml.SelectSingleNode(strRootName);
            nodeList = root.SelectNodes(strNodeName);
        }
        XmlNode xn = nodeList.Item(0);
        int nc = xn.ChildNodes.Count;
        int n = 0;

        strArray.Append("arrKeywFieldConvert = new string[" + nc + ", 2] {\r\n");

        foreach (XmlNode x in xn.ChildNodes)
        {
            strArray.Append("\t{");
            strArray.Append(String.Format("\"{0}\", \"{1}\"", x.Name, x.Name));
            strArray.Append("}");
            strArray.Append(n++ < nc - 1 ? "," : "");
            strArray.Append("\r\n");
        }

        strArray.Append("};");
        this.txtArray.Text = strArray.ToString();
    }
}
