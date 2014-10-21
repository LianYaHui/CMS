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
using Zyrh.BLL;
using Zyrh.BLL.Info;
using Zyrh.Common;
using Zyrh.Model;
using Zyrh.Model.Info;

public partial class modules_infoManage_sub_datumEdit : System.Web.UI.Page
{
    protected string strAction = string.Empty;
    protected int id = 0;
    protected bool isEdit = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        this.strAction = Public.RequestString("action", "add");
        this.txtAction.Value = this.strAction;

        if (!IsPostBack)
        {
            this.InitialData();
        }

    }

    protected void InitialData()
    {
        this.id = Public.RequestString("id", 0);
        this.txtId.Value = this.id.ToString();

        this.strAction = this.txtAction.Value.Trim();
        this.isEdit = this.strAction.Equals("edit") && this.id > 0;
        if (this.isEdit)
        {
            this.GetDatum(this.id);
        }
        else
        {
            this.rbValidate1.Checked = true;
        }
    }

    #region  获得资料信息
    protected void GetDatum(int id)
    {
        try
        {
            DatumManage dm = new DatumManage(Public.CmsDBConnectionString);
            DBResultInfo dbResult = dm.GetDatum(id);

            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                DataRow dr = ds.Tables[0].Rows[0];
                DatumInfo info = dm.FillDatum(dr);

                this.txtId.Value = info.Id.ToString();
                this.txtTitle.Value = info.Title;
                this.txtOldPath.Value = info.FilePath;
                this.ddlFileExt.Value = info.FileExtension.Replace(".", "");
                this.rbValidate1.Checked = info.IsValidate == 1;
                this.rbValidate0.Checked = info.IsValidate == 0;
                this.txtSortOrder.Value = info.SortOrder.ToString();
            }
        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    #region  编辑资料信息
    protected void UpdateDatum()
    {
        try
        {
            this.id = DataConvert.ConvertValue(this.txtId.Value.Trim(), 0);
            this.strAction = this.txtAction.Value.Trim();
            this.isEdit = this.strAction.Equals("edit") && this.id > 0;
            string strTitle = this.txtTitle.Value.Trim();
            string strOldPath = this.txtOldPath.Value.Trim();
            string strFileName = Path.GetFileName(this.fileDatum.PostedFile.FileName);
            string strExt = this.ddlFileExt.Value.Trim();
            string strFileDir = Config.WebDir + Config.UploadFileDir + "/datum/";
            string strFilePath = Config.UploadFileDir + "/datum/";
            int sortOrder = DataConvert.ConvertValue(this.txtSortOrder.Value.Trim(), 0);

            int isValidate = this.rbValidate1.Checked ? 1 : 0;


            DatumInfo info = new DatumInfo();
            info.Id = this.id;
            info.Title = Public.FilterString(strTitle);
            info.SortOrder = sortOrder;
            info.IsValidate = isValidate;
            info.UploadTime = Public.GetDateTime();

            DatumManage dm = new DatumManage(Public.CmsDBConnectionString);
            if (this.isEdit)
            {
                if (!strFileName.Equals(string.Empty))
                {
                    if (!Directory.Exists(Server.MapPath(strFileDir)))
                    {
                        Directory.CreateDirectory(Server.MapPath(strFileDir));
                    }
                    if (!this.CheckFileExtension(strExt))
                    {
                        return;
                    }

                    strFileName = this.BuildFileName(strFileName); 
                    this.fileDatum.PostedFile.SaveAs(Server.MapPath(strFileDir + strFileName));

                    info.FilePath = strFilePath + strFileName;
                }
                else
                {
                    info.FilePath = strOldPath;
                }

                info.FileExtension = Path.GetExtension(info.FilePath);
                info.FileSize = this.GetFileSize(Config.WebDir + info.FilePath);
                info.UpdateTime = Public.GetDateTime();

                dm.UpdateDatum(info);

                if (!strFileName.Equals(string.Empty) && File.Exists(Server.MapPath(Config.WebDir + strOldPath)))
                {
                    File.Delete(Server.MapPath(Config.WebDir + strOldPath));
                }
                this.ShowPrompt("资料信息更新成功", this.Request.Url.ToString(), true);
            }
            else
            {
                if (strFileName.Equals(string.Empty))
                {
                    this.lblPrompt.InnerHtml = "请选择文件";
                    return;
                }
                else
                {
                    if (!Directory.Exists(Server.MapPath(strFileDir)))
                    {
                        Directory.CreateDirectory(Server.MapPath(strFileDir));
                    }
                    if (!this.CheckFileExtension(strExt))
                    {
                        return;
                    }
                    strFileName = this.BuildFileName(strFileName);
                    this.fileDatum.PostedFile.SaveAs(Server.MapPath(strFileDir + strFileName));
                }

                info.FilePath = strFilePath + strFileName;
                info.FileExtension = Path.GetExtension(info.FilePath);
                info.FileSize = this.GetFileSize(Config.WebDir + info.FilePath);
                info.CreateTime = Public.GetDateTime();
                info.UpdateTime = Public.GetDateTime();

                dm.AddDatum(info);
                this.ShowPrompt("资料信息发布成功", this.Request.Url.ToString(), true);
            }

        }
        catch (Exception ex)
        {
            this.lblPrompt.InnerHtml = Public.BuildExcetionPrompt(ex);
        }
    }
    #endregion

    protected void btnSave_ServerClick(object sender, EventArgs e)
    {
        this.UpdateDatum();
    }

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
        
        if (!FileOperate.ValidateFileExtension(this.fileDatum, ext))
        {
            this.lblPrompt.InnerHtml = "<span style=\"color:#f00;margin-left:10px;\">提示：上传的文件格式错误!</span>";
            return false;
        }
        return true;
    }
    #endregion

    #region  获得文件大小
    public int GetFileSize(string strFilePath)
    {
        try
        {
            if (!File.Exists(Server.MapPath(strFilePath)))
            {
                return 0;
            }
            FileInfo fi = new FileInfo(Server.MapPath(strFilePath));


            return Convert.ToInt32(fi.Length);
        }
        catch (Exception ex) { throw (ex); }
    }
    #endregion

    #region  显示提示信息
    public void ShowPrompt(string strPrompt, string strUrl, bool isClose)
    {
        string strClose = isClose ? "true" : "false";
        string strFunc = isClose ? "parent.closeEditDatum" : "null";
        this.lblPrompt.InnerHtml = String.Format("<script>page.showPromptWin('{0}','{1}',{2},{3});</script>",
            strPrompt, strUrl, strClose, strFunc);
    }
    #endregion

}