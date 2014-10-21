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

public partial class modules_safety_control_control : System.Web.UI.Page
{

    protected string strRequest = string.Empty;
    protected string strAction = string.Empty;
    protected int eid = -1;
    protected int step = -1;
    protected int sub = -1;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            this.Initial();
        }
    }

    public void Initial()
    {
        this.strRequest = Public.RequestString("request");
        this.strAction = Public.RequestString("action");
        this.eid = Public.RequestString("eid", -1);
        this.step = Public.RequestString("step", -1);
        this.sub = Public.RequestString("sub", -1);
        this.ModuleControl(this.strRequest, this.strAction, this.eid, this.step, this.sub);
    }

    public void ModuleControl(string strRequest, string strAction, int eid, int step, int sub)
    {
        string strPage = string.Empty;
        switch(strRequest){
            /*
            case "CJZR":
                strPage = "CJZR.aspx?eid=" + eid + "&step=" + step + "&sub=" + sub;
                break;
            case "ZGLD":
                strPage = "ZGLD.aspx?eid=" + eid + "&step=" + step + "&sub=" + sub;
                break;
            case "DKKG":
                strPage = "DKKG.aspx?eid=" + eid + "&step=" + step + "&sub=" + sub;
                break;
            case "YJCS":
                strPage = "YJCS.aspx?eid=" + eid + "&step=" + step + "&sub=" + sub;
                break;
            case "YJYA":
                strPage = "YJYA.aspx?eid=" + eid + "&step=" + step + "&sub=" + sub;
                break;
            case "GZQD":
                strPage = "GZQD.aspx?eid=" + eid + "&step=" + step + "&sub=" + sub;
                break;
            case "DateTime":
                strPage = "DateTime.aspx?eid=" + eid + "&step=" + step + "&sub=" + sub;
                break;
            */
            default:
                strPage = strRequest + ".aspx?eid=" + eid + "&step=" + step + "&sub=" + sub;
                break;
        }
        this.Server.Transfer(strPage, false);
    }

}
