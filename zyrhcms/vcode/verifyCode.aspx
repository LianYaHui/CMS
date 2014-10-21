<%@ Page Language="C#" %>
<%@ Import Namespace="Zyrh.BLL" %>
<%@ Import Namespace="Zyrh.Common" %>

<script runat="server">
protected string strToken = string.Empty;

protected void Page_Load(object sender, EventArgs e)
{
    //this.strToken = Public.RequestString("token");
    if (Config.ValidateRequestType())
    {
        if (!this.Request.RequestType.Equals("GET"))
        {
            Response.Write("RequestType Error");
            Response.End();
        }
    }
    /*
    if (Config.ValidateRequestToken())
    {
        if (!Token.CheckToken(this.strToken))
        {
            Response.Write("UrlReferrer Error");
            Response.End();
        }
    }
    */

    VerifyCode v = new VerifyCode(24, 6, 5, new Random().Next(0, 10));
    
    string strCode = v.CreateVerifyCode();
    v.CreateImageOnPage(strCode, this.Context);

    UserCenter.SetUserVerifyCode(strCode.ToUpper());
}
</script>