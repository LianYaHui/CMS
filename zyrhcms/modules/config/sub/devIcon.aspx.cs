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
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Device;

public partial class modules_config_sub_devIcon : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();
    protected string strConfigFileName = String.Format("{0}{1}/{2}", Config.WebDir, Config.GetConfigFileDir(), "devicon.config");

    protected string strTitle = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.CheckUserRole();

        if (!IsPostBack)
        {
            this.strTitle = Public.RequestString("title");
            this.InitialData();
        }
        this.GetUserInfo();
    }

    #region  获得登录用户信息
    public void GetUserInfo()
    {
        if (uc.CheckUserLogin())
        {
            ui = uc.GetLoginUserInfo();
        }
    }
    #endregion


    #region  检测用户权限
    public void CheckUserRole()
    {
        try
        {
            if (!uc.CheckUserLogin())
            {
                this.Server.Transfer(Public.WebDir + Public.NoAuthUrl, false);
            }

            if (!uc.IsFounder)
            {
                Response.Write("您没有权限设置系统配置");
                Response.Flush();
                Response.End();
            }
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion


    #region  初始化
    public void InitialData()
    {
        this.GetDeviceIcon();
    }
    #endregion

    #region  验证帐户密码
    protected bool CheckUserPwd(string strUserName, string strUserPwd)
    {
        try
        {
            if (strUserPwd.Equals(string.Empty))
            {
                return false;
            }
            if (strUserPwd.Length != 32 && !UserCenter.CheckUserPwdFormat(strUserPwd))
            {
                this.lblUserPwd.InnerHtml = "密码格式输入错误！";
                return false;
            }
            UserInfo ui = new UserManage(Public.CmsDBConnectionString).GetUserInfo(strUserName);
            int login = uc.UserLogin(ui, strUserPwd);
            if (login == 1)
            {
                this.lblUserPwd.InnerHtml = "";
                return true;
            }
            else if (login > 0)
            {
                this.lblUserPwd.InnerHtml = "帐户已注销或受限！";
                return false;
            }
            else
            {
                this.lblUserPwd.InnerHtml = "密码输入错误！";
                return false;
            }
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  获得设备ICON图标
    protected void GetDeviceIcon()
    {
        try
        {
            StringBuilder strResult = new StringBuilder();
            Hashtable htCode = new Hashtable();

            string strFilePath = Server.MapPath(this.strConfigFileName);
            XmlDocument doc = new XmlDocument();
            doc.Load(strFilePath);

            XmlNodeList xnl = doc.SelectNodes("/config/icon");

            strResult.Append("[");
            if (xnl != null)
            {
                foreach (XmlNode xn in xnl)
                {
                    XmlAttribute code = xn.Attributes["code"];
                    string strCode = code.Value.Trim();

                    if (!htCode.Contains(strCode))
                    {
                        htCode.Add(strCode, String.Format("{{status:{0},path:'{1}'}}", xn.Attributes["status"].Value, xn.InnerText));
                    }
                    else
                    {
                        string strVal = htCode[strCode].ToString();
                        strVal += String.Format(",{{status:{0},path:'{1}'}}", xn.Attributes["status"].Value, xn.InnerText);
                        htCode.Remove(strCode);
                        htCode.Add(strCode, strVal);
                    }
                }
            }
            int n = 0;
            foreach (DictionaryEntry obj in htCode)
            {
                if (n++ > 0)
                {
                    strResult.Append(",");
                }
                strResult.Append(String.Format("{{type:'{0}',icon:[{1}]}}", obj.Key.ToString(), obj.Value.ToString()));
            }
            strResult.Append("]");

            this.txtIconData.Value = strResult.ToString();
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  设置设备ICON图标
    protected void SetDeviceIcon()
    {
        try
        {
            string strUserPwd = this.txtUserPwd.Value.Trim();
            string strUserName = uc.GetLoginUserName();

            if (!this.CheckUserPwd(strUserName, strUserPwd))
            {
                return;
            }
            string strIconList = this.txtIconList.Value.Trim();
            if (strIconList.Equals(string.Empty))
            {
                return;
            };
            string[] arrIconList = strIconList.Split('|');

            string strFilePath = Server.MapPath(this.strConfigFileName);
            XmlDocument doc = new XmlDocument();
            doc.Load(strFilePath);

            XmlNode root = doc.SelectSingleNode("config");

            XmlNodeList xnl = doc.SelectNodes("/config/icon");
            if (xnl != null)
            {
                foreach (XmlNode xn in xnl)
                {
                    XmlAttribute code = xn.Attributes["code"];
                    if (code != null)
                    {
                        foreach (string str in arrIconList)
                        {
                            string[] arrTemp = str.Split(',');
                            XmlAttribute icon = xn.Attributes["status"];

                            if (code.Value.Equals(arrTemp[0]) && icon.Value.Equals(arrTemp[1]))
                            {
                                xn.InnerText = arrTemp[2];
                                break;
                            }
                        }
                    }
                }
            }

            doc.Save(strFilePath);

            this.Response.Redirect(this.Request.Url.ToString());
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  初始化设备ICON图标
    protected void InitialIcon()
    {
        try
        {
            string strUserPwd = this.txtUserPwd.Value.Trim();
            string strUserName = uc.GetLoginUserName();

            if (!this.CheckUserPwd(strUserName, strUserPwd))
            {
                return;
            }
            string strDir = String.Format("{0}/icon/", Config.UploadFileDir).Replace("//", "/");
            int[] arrStatus ={ 0, 1, 2 };
            string[] arrPath = {
                "/skin/default/images/common/emap/car_n_gray.png",
                "/skin/default/images/common/emap/car_n_green.png",
                "/skin/default/images/common/emap/car_n_red.png"
            };
            bool isInitial = this.chbInitial.Checked;

            string strFilePath = Server.MapPath(this.strConfigFileName);
            XmlDocument doc = new XmlDocument();
            doc.Load(strFilePath);

            XmlNode root = doc.SelectSingleNode("config");
            XmlNodeList xnl = root.ChildNodes;
            Hashtable htType = new Hashtable();


            DeviceTypeManage dtm = new DeviceTypeManage(Public.CmsDBConnectionString);
            DataSet ds = dtm.GetDeviceType(string.Empty, 1);

            if (xnl.Count == 0 || isInitial)
            {
                if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    if (isInitial)
                    {
                        root.RemoveAll();
                    }
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        DeviceTypeInfo info = dtm.FillDeviceTypeInfo(dr);
                        foreach (int i in arrStatus)
                        {
                            XmlElement xn = doc.CreateElement("icon");// new XmlElement();
                            xn.SetAttribute("code", info.TypeCode);
                            xn.SetAttribute("status", i.ToString());
                            xn.InnerText = arrPath[i];

                            root.AppendChild(xn);
                        }
                    }

                    doc.Save(strFilePath);
                }
            }
            else
            {
                foreach (XmlNode xn in xnl)
                {
                    string strKey = xn.Attributes["code"].Value.Trim();
                    if (!htType.Contains(strKey))
                    {
                        htType.Add(strKey, 0);
                    }
                }
                if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        DeviceTypeInfo info = dtm.FillDeviceTypeInfo(dr);
                        string strKey = info.TypeCode;
                        if (htType.Contains(strKey))
                        {
                            //存在节点，将节点值设置为1
                            htType.Remove(strKey);
                            htType.Add(strKey, 1);
                        }
                        else
                        {
                            //不存在，则创建节点
                            foreach (int i in arrStatus)
                            {
                                XmlElement xn = doc.CreateElement("icon");// new XmlElement();
                                xn.SetAttribute("code", info.TypeCode);
                                xn.SetAttribute("status", i.ToString());
                                xn.InnerText = arrPath[i];

                                root.AppendChild(xn);
                            }
                        }
                    }
                    ArrayList arrDel = new ArrayList();

                    //删除多余的设备类型
                    foreach (XmlNode xn in xnl)
                    {
                        string strKey = xn.Attributes["code"].Value.Trim();
                        if (htType.Contains(strKey) && htType[strKey].ToString().Equals("0"))
                        {
                            arrDel.Add(xn);
                        }
                    }

                    for (int i = 0; i < arrDel.Count; i++)
                    {
                        root.RemoveChild((XmlNode)arrDel[i]);
                    }

                    doc.Save(strFilePath);
                }
            }
            this.Response.Redirect(this.Request.Url.ToString());
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    protected void btnSave_ServerClick(object sender, EventArgs e)
    {
        this.SetDeviceIcon();
    }

    protected void btnInitial_ServerClick(object sender, EventArgs e)
    {
        this.InitialIcon();
    }

    protected string ConvertChar(string strContent)
    {
        return HttpUtility.HtmlEncode(strContent).Replace("\r\n", "");//.Replace("&", "&amp;").Replace("\"", "&quot;").Replace("\r\n", "");
    }

    protected string RevertChar(string strContent)
    {
        return HttpUtility.HtmlDecode(strContent);//.Replace("&amp;", "&").Replace("&quot;", "\"");
    }

}
