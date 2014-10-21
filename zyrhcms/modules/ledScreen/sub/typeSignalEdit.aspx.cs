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
using System.IO;
using System.Data;
using Zyrh.BLL;
using Zyrh.BLL.Led;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Led;

public partial class modules_ledScreen_sub_typeSignalEdit : System.Web.UI.Page
{
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected string strPageTitle = "";
    protected string strAction = "add";
    protected int id = 0;
    protected int typeId = 0;
    protected int signalId = 0;
    protected bool isEdit = false;
    protected bool isSetFocus = true;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.strAction = Public.RequestString("action", "add");
        this.txtAction.Value = this.strAction;
        this.strPageTitle = this.strAction.Equals("edit") ? "编辑预警信号" : "新增预警信号";

        if (!IsPostBack)
        {
            this.InitialData();
        }
    }


    #region  初始化数据
    protected void InitialData()
    {
        this.id = Public.RequestString("id", 0);
        this.typeId = Public.RequestString("typeId", -1);

        this.txtId.Value = this.id.ToString();
        this.txtTypeId.Value = this.typeId.ToString();

        if (this.id > 0)
        {
            this.GetSignal(-1);
            this.GetTypeSignal(this.id);
        }
        else
        {
            this.GetSignal(this.typeId);
            this.imgIcon.Visible = false;
        }

    }
    #endregion

    #region  获得信号
    protected void GetSignal(int typeId)
    {
        try
        {
            SignalLevelManage sm = new SignalLevelManage(Public.CmsDBConnectionString);

            DBResultInfo dbResult = sm.GetSignalLevel(1);

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                string strFilter = string.Empty;
                if (typeId > 0)
                {
                    TypeSignalManage tm = new TypeSignalManage(Public.CmsDBConnectionString);
                    string strSignalIdList = tm.GetInfoTypeSignalIdList(typeId);
                    if (!strSignalIdList.Equals(string.Empty))
                    {
                        strFilter = String.Format(" signal_id not in({0}) ", strSignalIdList);
                    }
                }
                DataView dv = new DataView(ds.Tables[0], strFilter, "", DataViewRowState.CurrentRows);

                foreach (DataRowView dr in dv)
                {
                    SignalLevelInfo info = sm.FillSignalLevelInfo(dr);
                    ListItem li = new ListItem(info.SignalName, info.SignalId.ToString());
                    this.ddlSignal.Items.Add(li);
                }
                this.ddlSignal.Items.Insert(0, new ListItem("选择信号", "-1"));
            }
            else
            {
                this.ddlSignal.Items.Clear();
                this.ddlSignal.Items.Add(new ListItem("选择信号", "-1"));
            }
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  获得分类信号
    public void GetTypeSignal(int id)
    {
        try
        {
            TypeSignalManage sm = new TypeSignalManage(Public.CmsDBConnectionString);

            DBResultInfo dbResult = sm.GetInfoTypeSignal(id);

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                TypeSignalInfo info = sm.FillTypeSignalInfo(dr);

                this.txtTypeId.Value = info.TypeId.ToString();
                this.ddlSignal.Value = info.SignalId.ToString();
                this.txtDefenseGuidelines.Value = info.DefenseGuidelines;
                this.txtDesc.Value = info.Desc;
                this.txtOldIcon.Value = info.Icon;

                if (!info.Icon.Equals(string.Empty))
                {
                    this.imgIcon.Src = (Config.WebDir + "/" + info.Icon).Replace("//", "/");
                    this.imgIcon.Visible = true;
                }
                else
                {
                    this.imgIcon.Visible = false;
                }
                this.ddlSignal.Disabled = true;
            }
        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  编辑
    protected void btnSubmit_Click(object sender, EventArgs e)
    {
        try
        {
            TypeSignalManage tm = new TypeSignalManage(Public.CmsDBConnectionString);

            this.id = DataConvert.ConvertValue(this.txtId.Value.Trim(), 0);
            this.typeId = DataConvert.ConvertValue(this.txtTypeId.Value.Trim(), 0);
            this.signalId = DataConvert.ConvertValue(this.ddlSignal.Value.Trim(), 0);
            this.strAction = this.txtAction.Value.Trim();
            this.isEdit = this.strAction.Equals("edit") && this.typeId > 0;
            string strDesc = this.txtDesc.Value.Trim();
            string strDefenseGuidelines = this.txtDefenseGuidelines.Value.Trim();
            string strOldIcon = this.txtOldIcon.Value.Trim();
            string strFileName = this.fileIcon.PostedFile.FileName;
            string strFileDir = Config.WebDir + Config.UploadFileDir + "/led/signal/";
            string strFilePath = Config.UploadFileDir + "/led/signal/";

            TypeSignalInfo info = new TypeSignalInfo();
            info.Id = this.id;
            info.TypeId = this.typeId;
            info.SignalId = this.signalId;
            info.Desc = Public.FilterString(strDesc);
            info.DefenseGuidelines = Public.FilterString(strDefenseGuidelines);
            info.CreateTime = Public.GetDateTime();
            info.UpdateTime = Public.GetDateTime();

            if (tm.CheckTypeSignalIsExist(typeId, signalId, id) > 0)
            {
                this.lblError.InnerHtml = "已经存在相同的分类预警信号，不能重复添加";
                return;
            }

            if (!strFileName.Equals(string.Empty))
            {
                if (!Directory.Exists(Server.MapPath(strFileDir)))
                {
                    Directory.CreateDirectory(Server.MapPath(strFileDir));
                }
                if (!this.CheckFileExtension("img"))
                {
                    return;
                }

                strFileName = this.BuildFileName(strFileName);
                this.fileIcon.PostedFile.SaveAs(Server.MapPath(strFileDir + strFileName));

                info.Icon = strFilePath + strFileName;
            }
            else if (this.isEdit)
            {
                info.Icon = strOldIcon;
            }

            if (this.isEdit)
            {
                tm.UpdateInfoTypeSignal(info);

                this.ShowPrompt("分类信号更新成功", this.Request.Url.ToString(), true);
            }
            else
            {
                tm.AddInfoTypeSignal(info);

                this.ShowPrompt("分类信号添加成功", this.Request.Url.ToString(), true);
            }

        }
        catch (Exception ex)
        {
            this.lblError.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  获得文件名
    public string BuildFileName(string strFileName)
    {
        string strExt = Path.GetExtension(strFileName).ToLower();
        strFileName = String.Format("{0}{1}", DateTime.Now.ToString("yyyyMMddHHmmssfff"), new Random().Next(100, 999).ToString());
        return Encrypt.HashEncrypt(strFileName, EncryptFormat.ShortMd5).ToLower() + strExt;
    }
    #endregion

    #region  验证文件格式
    protected bool CheckFileExtension(string strExt)
    {
        FileExtension[] ext;
        switch (strExt)
        {
            case "rar":
                ext = new FileExtension[] {
                        FileExtension.RAR
                    };
                break;
            case "zip":
            case "docx":
            case "xlsx":
                ext = new FileExtension[] {
                        FileExtension.ZIP
                    };
                break;
            case "xls":
                ext = new FileExtension[] {
                        FileExtension.XLS
                    };
                break;
            case "doc":
                ext = new FileExtension[] {
                        FileExtension.DOC
                    };
                break;
            case "pdf":
                ext = new FileExtension[] {
                        FileExtension.PDF
                    };
                break;
            case "img":
                ext = new FileExtension[] {
                        FileExtension.JPG,
                        FileExtension.PNG,
                        FileExtension.GIF,
                        FileExtension.BMP
                    };
                break;
            default:
                ext = new FileExtension[] {
                        FileExtension.JPG,
                        FileExtension.PNG,
                        FileExtension.GIF,
                        FileExtension.BMP,
                        FileExtension.RAR,
                        FileExtension.ZIP,
                        FileExtension.DOC,
                        FileExtension.XLS,
                        FileExtension.PDF
                    };
                break;
        }

        if (!FileOperate.ValidateFileExtension(this.fileIcon, ext))
        {
            this.lblError.InnerHtml = "<span style=\"color:#f00;margin-left:10px;\">提示：上传的文件格式错误!</span>";
            return false;
        }
        return true;
    }
    #endregion

    #region  显示提示信息
    public void ShowPrompt(string strPrompt, string strUrl, bool isClose)
    {
        this.isSetFocus = false;

        string strClose = isClose ? "true" : "false";
        string strFunc = isClose ? "parent.closeEditSignal" : "null";
        this.lblPrompt.InnerHtml = String.Format("<script>var isSetFocus = false; page.showPromptWin('{0}','{1}',{2},{3});</script>",
            strPrompt, strUrl, strClose, strFunc);
    }
    #endregion

}
