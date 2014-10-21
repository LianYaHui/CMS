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
using Zyrh.BLL;
using Zyrh.Common;
using Zyrh.Model;

public partial class ajax_user : System.Web.UI.Page
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected UserManage um = new UserManage(Public.CmsDBConnectionString);
    protected UserCenter uc = new UserCenter();
    protected UserInfo ui = new UserInfo();

    protected string strAction = string.Empty;
    protected int unitId = 0;
    protected int userId = 0;
    protected string strUserIdList = string.Empty;
    protected int pageIndex = 0;
    protected int pageSize = 20;
    protected int status = -1;

    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "text/plain";

        this.strAction = Public.RequestString("action");
        this.unitId = Public.RequestString("unitId", 0);

        ui = uc.GetLoginUserInfo();
        if (this.unitId == 0)
        {
            this.unitId = ui.UnitId;
        }

        switch (this.strAction)
        {
            case "getLoginUserInfo":
                Response.Write(this.GetLoginUserInfo());
                break;
            case "getLoginLineId":
                break;
            case "logout":
                Response.Write(this.Logout());
                break;
            case "modifyPassword":
                string strOldPwd = Public.RequestString("pwd_old", string.Empty);
                string strNewPwd = Public.RequestString("pwd_new", string.Empty);
                string strConfirmPwd = Public.RequestString("pwd_confirm", string.Empty);
                Response.Write(this.ModifyPassword(strOldPwd, strNewPwd, strConfirmPwd));
                break;
            case "getExpireTime":
                Response.Write(DateTime.Now.AddYears(5).ToString("yyyy-MM-dd HH:mm:ss"));
                break;
            case "getUserList":
                this.userId = Public.RequestString("userId", 0);
                this.pageIndex = Public.RequestString("pageIndex", 0);
                this.pageSize = Public.RequestString("pageSize", 0);
                bool getChild = Public.RequestString("getChild", 0) == 1;
                this.status = Public.RequestString("status", -1);
                int expire = Public.RequestString("expire", -1);
                Response.Write(this.GetUserList(this.unitId, this.userId, status, expire, this.pageIndex, this.pageSize, getChild));
                break;
            case "getUserInfo":
                this.userId = Public.RequestString("userId", 0);
                this.status = Public.RequestString("status", -1);
                Response.Write(this.GetUserInfo(this.userId, this.status));
                break;
            case "deleteUser":
                this.strUserIdList = Public.RequestString("userIdList", string.Empty);
                this.status = Public.RequestString("status", -1);
                Response.Write(this.DeleteUserInfo(this.strUserIdList, this.status));
                break;
            case "getRole":
                Response.Write(this.GetRoleInfo());
                break;
            case "addUser":
                UserInfo userAdd = new UserInfo();
                userAdd.UnitId = Public.RequestString("unitId", 0);
                userAdd.RoleId = Public.RequestString("roleId", 0);
                userAdd.UserName = Public.RequestString("userName", string.Empty);
                userAdd.UserPwd = Public.RequestString("userPwd", string.Empty);
                userAdd.Priority = Public.RequestString("priority", 50);
                userAdd.TimeLimitedPreview = Public.RequestString("timeLimitedPreview", 0);
                userAdd.Status = Public.RequestString("status", 0);
                userAdd.ExpireTime = Public.RequestString("expireTime", string.Empty);
                userAdd.RealName = Public.RequestString("realName", string.Empty);
                userAdd.PhoneNumber = Public.RequestString("phoneNumber", string.Empty);
                userAdd.Email = Public.RequestString("email", string.Empty);
                userAdd.SequenceIndex = Public.RequestString("sequenceIndex", 0);
                userAdd.GroupId = Public.RequestString("groupId", 0);
                userAdd.CardId = Public.RequestString("cardId", string.Empty);
                userAdd.Description = Public.RequestString("descriptoin", string.Empty);
                userAdd.OperatorId = ui.UserId;

                Response.Write(this.AddUserInfo(userAdd));
                break;
            case "editUser":
                UserInfo userEdit = new UserInfo();
                userEdit.UserId = Public.RequestString("userId", 0);
                userEdit.UnitId = Public.RequestString("unitId", 0);
                userEdit.RoleId = Public.RequestString("roleId", 0);
                userEdit.UserName = Public.RequestString("userName", string.Empty);
                userEdit.UserPwd = Public.RequestString("userPwd", string.Empty);
                userEdit.Priority = Public.RequestString("priority", 50);
                userEdit.TimeLimitedPreview = Public.RequestString("timeLimitedPreview", 0);
                userEdit.Status = Public.RequestString("status", 0);
                userEdit.ExpireTime = Public.RequestString("expireTime", string.Empty);
                userEdit.RealName = Public.RequestString("realName", string.Empty);
                userEdit.PhoneNumber = Public.RequestString("phoneNumber", string.Empty);
                userEdit.Email = Public.RequestString("email", string.Empty);
                userEdit.SequenceIndex = Public.RequestString("sequenceIndex", 0);
                userEdit.GroupId = Public.RequestString("groupId", 0);
                userEdit.CardId = Public.RequestString("cardId", string.Empty);
                userEdit.Description = Public.RequestString("descriptoin", string.Empty);
                userEdit.OperatorId = ui.UserId;

                Response.Write(this.UpdateUserInfo(userEdit));
                break;
            default:
                Response.Write("ok");
                break;
        }
    }

    #region  获得当前登录用户信息
    private string GetLoginUserInfo()
    {
        try
        {
            if (!uc.CheckUserLogin())
            {
                return "{result:0,msg:'用户未登录'}";
            }

            UserInfo ui = um.GetUserInfo(uc.GetLoginUserName());
            StringBuilder strUser = new StringBuilder();
            strUser.Append("{");
            strUser.Append(String.Format("userName:'{0}',loginTimes:'{1}',lastLoginTime:'{2}'", ui.UserName, ui.LoginTimes, ui.LastLoginTime));
            strUser.Append("}");

            return String.Format("{{result:1,user:{0}}}", strUser.ToString());
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得当前登录线路ID
    protected string GetLoginLineId()
    {
        try
        {
            return String.Format("{{result:1,lineId:{0}}}", uc.GetLoginLineId());
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  修改密码
    public string ModifyPassword(string strOldPwd, string strNewPwd, string strConfirmPwd)
    {
        try
        {
            string strUserName = uc.GetLoginUserName();
            if (strUserName.Equals(string.Empty))
            {
                return "{result:-1,msg:'用户未登录',error:'noauth'}";
            }
            if (!strNewPwd.Equals(strConfirmPwd))
            {
                return "{result:2, msg:'两次输入的密码不一样'}"; //两次输入的密码不一样
            }
            strOldPwd = Encrypt.HashEncrypt(strOldPwd, EncryptFormat.MD5).ToLower();
            strNewPwd = Encrypt.HashEncrypt(strNewPwd, EncryptFormat.MD5).ToLower();

            UserManage um = new UserManage(Public.CmsDBConnectionString);
            UserInfo ui = um.GetUserInfo(strUserName);
            if (!strOldPwd.Equals(ui.UserPwd.ToLower()))
            {
                return "{result:3,msg:'旧密码输入错误'}"; //旧密码输入错误
            }
            else
            {
                if (um.UpdateUserPwd(strUserName, strNewPwd) > 0)
                {
                    return "{result:1}";
                }
                else
                {
                    return "{result:0,msg:'密码修改失败'}";
                }
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  退出
    private string Logout()
    {
        try
        {
            UserStatus us = new UserStatus();
            us.SessionId = uc.GetSessionId();

            um.DeleteUserStatus(us);
            uc.Logout();
            uc.DeleteUserCookie();

            return "{result:1}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得用户列表
    public string GetUserList(int unitId, int userId, int status, int expire, int pageIndex, int pageSize, bool getChild)
    {
        int dataCount = 0;
        try
        {
            if (unitId == 0 && userId == 0)
            {
                return "{result:0,count:0,list:[]}";
            }
            else
            {
                DBResultInfo dbResult = um.GetUserInfo(unitId, userId, status, -1, expire, pageIndex * pageSize, pageSize, getChild);
                DataSet dsUser = dbResult.dsResult;

                StringBuilder strUser = new StringBuilder();

                if (dsUser != null && dsUser.Tables[1] != null && dsUser.Tables[1].Rows.Count > 0)
                {
                    dataCount = Convert.ToInt32(dsUser.Tables[1].Rows[0][0].ToString());
                }
                strUser.Append("{result:1");
                strUser.Append(String.Format(",dataCount:'{0}'", dataCount));
                strUser.Append(",list:[");
                if (dsUser != null && dsUser.Tables[0] != null && dsUser.Tables[0].Rows.Count > 0)
                {
                    int n = 0;
                    foreach (DataRow dr in dsUser.Tables[0].Rows)
                    {
                        UserInfo ui = um.FillUserInfo(dr);

                        strUser.Append(n++ > 0 ? "," : "");
                        strUser.Append("{");
                        strUser.Append(String.Format("userId:'{0}',userName:'{1}',realName:'{2}',status:'{3}',loginTimes:'{4}',createTime:'{5}',lastLoginTime:'{6}'", 
                            ui.UserId, ui.UserName, ui.RealName, ui.Status, ui.LoginTimes, Public.ConvertDateTime(ui.CreateTime), Public.ConvertDateTime(ui.LastLoginTime)));
                        strUser.Append(String.Format(",priority:'{0}',timeLimitedPreview:'{1}',expireTime:'{2}',isExpire:'{3}',userPwd:'{4}',updateTime:'{5}'", 
                            ui.Priority, ui.TimeLimitedPreview, Public.ConvertDateTime(ui.ExpireTime), this.CheckExpireTime(ui.ExpireTime), ui.UserPwd, Public.ConvertDateTime(ui.UpdateTime)));
                        strUser.Append(String.Format(",unitId:'{0}',unitName:'{1}',roleId:'{2}',roleName:'{3}'", ui.UnitId, ui.UnitName, ui.RoleId, ui.RoleName));
                        strUser.Append(String.Format(",email:'{0}',phoneNumber:'{1}',sequenceIndex:'{2}',description:'{3}'", ui.Email, ui.PhoneNumber, ui.SequenceIndex, ui.Description));
                        strUser.Append(String.Format(",groupId:'{0}',cardId:'{1}'", ui.GroupId, ui.CardId));
                        strUser.Append("}");
                    }
                }
                strUser.Append("]");
                strUser.Append("}");

                return strUser.ToString();
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,count:'{0}',list:[],msg:'{1}',error:'{2}'}}", dataCount, Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得用户信息
    public string GetUserInfo(int userId, int status)
    {
        int dataCount = 0;
        try
        {
            if (userId == 0)
            {
                return "{result:0,userInfo:{}}";
            }
            else
            {
                DBResultInfo dbResult = um.GetUserInfo(userId, status);
                DataSet dsUser = dbResult.dsResult;

                StringBuilder strUser = new StringBuilder();

                if (dsUser != null && dsUser.Tables[1] != null && dsUser.Tables[1].Rows.Count > 0)
                {
                    dataCount = Convert.ToInt32(dsUser.Tables[1].Rows[0][0].ToString());
                }
                strUser.Append("{result:1");
                strUser.Append(",userInfo:{");
                if (dsUser != null && dsUser.Tables[0] != null && dsUser.Tables[0].Rows.Count > 0)
                {
                    UserInfo ui = um.FillUserInfo(dsUser.Tables[0].Rows[0]);
                    strUser.Append(String.Format("userId:'{0}',userName:'{1}',realName:'{2}',status:'{3}',loginTimes:'{4}',createTime:'{5}',lastLoginTime:'{6}'", 
                        ui.UserId, ui.UserName, ui.RealName, ui.Status, ui.LoginTimes, Public.ConvertDateTime(ui.CreateTime), Public.ConvertDateTime(ui.LastLoginTime)));
                    strUser.Append(String.Format(",priority:'{0}',timeLimitedPreview:'{1}',expireTime:'{2}',isExpire:'{3}',userPwd:'{4}',updateTime:'{5}'", 
                        ui.Priority, ui.TimeLimitedPreview, Public.ConvertDateTime(ui.ExpireTime), this.CheckExpireTime(ui.ExpireTime), ui.UserPwd, Public.ConvertDateTime(ui.UpdateTime)));
                    strUser.Append(String.Format(",unitId:'{0}',unitName:'{1}',roleId:'{2}',roleName:'{3}'", ui.UnitId, ui.UnitName, ui.RoleId, ui.RoleName));
                    strUser.Append(String.Format(",email:'{0}',phoneNumber:'{1}',sequenceIndex:'{2}',description:'{3}'", ui.Email, ui.PhoneNumber, ui.SequenceIndex, ui.Description));
                    strUser.Append(String.Format(",groupId:'{0}',cardId:'{1}'", ui.GroupId, ui.CardId));
                }
                strUser.Append("}");
                strUser.Append("}");

                return strUser.ToString();
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,userInfo:{},msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  检测是否过期
    public int CheckExpireTime(string strExpireTime)
    {
        try
        {
            DateTime dtExpire = DateTime.Parse(strExpireTime);
            DateTime dtNow = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            int isExpire = DateTime.Compare(dtNow, dtExpire);
            return isExpire <= 0 ? 0 : 1;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
    }
    #endregion

    #region  检测 是否是所辖用户
    protected string CheckUserIsIn(string strUserIdList, int userUnitId)
    {
        StringBuilder strResult = new StringBuilder();

        string strUnitIdList = new ControlUnitManage(Public.CmsDBConnectionString).GetControlUnitIdList(userUnitId);
        DataSet ds = um.GetAllUserInfoList(strUnitIdList, -1);

        if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
        {
            string[] arrUser = strUserIdList.Split(',');
            foreach (string str in arrUser)
            {
                if (str.Equals(string.Empty) || !new Regex(@"^[\d]+$").IsMatch(str))
                {
                    continue;
                }

                DataView dv = new DataView(ds.Tables[0], "user_id=" + str, "", DataViewRowState.CurrentRows);
                if (dv.Count > 0)
                {
                    strResult.Append(",");
                    strResult.Append(str);
                }
            }
        }
        return strResult.Length > 0 ? strResult.ToString().Substring(1) : string.Empty;
    }
    #endregion

    #region  删除用户（将用户状态改为“注销”,将已注销的用户删除）
    protected string DeleteUserInfo(string strUserIdList, int status)
    {
        try
        {
            StringBuilder strResult = new StringBuilder();

            if (!uc.CheckUserLogin())
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'您还没有登录，无权限删除用户信息！'");
                strResult.Append("}");

                return strResult.ToString();
            }
            else if (!uc.IsAdmin)
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'当前帐户无权限删除用户信息！'");
                strResult.Append("}");

                return strResult.ToString();
            }
            strUserIdList = this.CheckUserIsIn(strUserIdList, ui.UnitId);
            if (strUserIdList.Equals(string.Empty))
            {
                strResult.Append("{result:0");
                strResult.Append(",msg:'注意：您只能删除当前帐户所辖的用户信息！'");
                strResult.Append("}");

                return strResult.ToString();
            }
            //删除注销的帐户
            int result = 0;
            if (2 == status)
            {
                result = um.RealDeleteUser(strUserIdList);
            }
            else
            {
                result = um.UpdateUserStatus(strUserIdList, 2);
            }
            if (result > 0)
            {
                return "{result:1}";
            }
            return "{result:0}";
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  获得用户角色
    protected string GetRoleInfo()
    {
        try
        {
            RoleManage rm = new RoleManage(this.DBConnectionString);
            DataSet dsRole = rm.GetRoleInfo();
            if (dsRole != null && dsRole.Tables[0] != null && dsRole.Tables[0].Rows.Count > 0)
            {
                StringBuilder strResult = new StringBuilder();
                int n = 0;
                strResult.Append("{result:1");
                strResult.Append(String.Format(",dataCount:{0}", dsRole.Tables[0].Rows.Count));
                strResult.Append(",list:[");
                foreach (DataRow dr in dsRole.Tables[0].Rows)
                {
                    RoleInfo ri = rm.FillRoleInfo(dr);
                    strResult.Append(n > 0 ? "," : "");
                    strResult.Append(String.Format("{{roleId:'{0}',roleName:'{1}',sequenceIndex:'{2}',description:'{3}'}}", ri.RoleId, ri.RoleName, ri.SequenceIndex, ri.Description));
                    n++;
                }
                strResult.Append("]");
                strResult.Append("}");
                return strResult.ToString();
            }
            return "{result:0,msg:'没有找到用户权限列表',list:[]}";
        }
        catch (Exception ex)
        {
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  添加用户
    protected string AddUserInfo(UserInfo info)
    {
        try
        {
            if (!info.UserName.Equals(string.Empty) && info.UnitId > 0 && info.RoleId > 0)
            {
                if (um.CheckUserNameIsExist(info.UserName) > 0)
                {
                    return String.Format("{{result:-2, msg:'用户名已存在'}}"); 
                }
                StringBuilder strResult = new StringBuilder();
                UserInfo ui = new UserInfo();
                ui.UnitId = info.UnitId;
                ui.RoleId = info.RoleId;
                ui.UserName = info.UserName;
                ui.UserPwd = Encrypt.HashEncrypt(info.UserPwd, EncryptFormat.MD5).ToLower();
                ui.Priority = info.Priority;
                ui.TimeLimitedPreview = info.TimeLimitedPreview;
                ui.Status = info.Status;
                ui.ExpireTime = info.ExpireTime;
                ui.RealName = info.RealName;
                ui.PhoneNumber = info.PhoneNumber;
                ui.Email = info.Email;
                ui.OperatorId = info.OperatorId;
                ui.CreateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                ui.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                ui.SequenceIndex = info.SequenceIndex;
                ui.GroupId = info.GroupId;
                ui.CardId = info.CardId;
                ui.Description = info.Description;

                //int uid = um.AddUserInfo(ui);
                DBResultInfo dbResult = um.RealAddUserInfo(ui);
                int uid = dbResult.iResult;
                string strSql = dbResult.strSql;

                if (uid > 0)
                {
                    um.UpdateUserRoleMap(uid, info.RoleId);

                    return String.Format("{{result:1}}");
                }
                return String.Format("{{result:0,msg:'添加用户失败',yes:1}}");
            }
            else
            {
                return String.Format("{{result:0,msg:'添加用户失败',no:1}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

    #region  编辑用户
    protected string UpdateUserInfo(UserInfo info)
    {
        try
        {
            if (info.UserId > 0 && !info.UserName.Equals(string.Empty) && info.UnitId > 0 && info.RoleId > 0)
            {
                StringBuilder strResult = new StringBuilder();
                UserInfo ui = new UserInfo();
                ui.UserId = info.UserId;
                ui.UnitId = info.UnitId;
                ui.RoleId = info.RoleId;
                ui.UserName = info.UserName;
                ui.UserPwd = info.UserPwd.Equals(string.Empty) ? string.Empty : Encrypt.HashEncrypt(info.UserPwd, EncryptFormat.MD5).ToLower();
                ui.Priority = info.Priority;
                ui.TimeLimitedPreview = info.TimeLimitedPreview;
                ui.Status = info.Status;
                ui.ExpireTime = info.ExpireTime;
                ui.RealName = info.RealName;
                ui.PhoneNumber = info.PhoneNumber;
                ui.Email = info.Email;
                ui.OperatorId = info.OperatorId;
                ui.UpdateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                ui.SequenceIndex = info.SequenceIndex;
                ui.GroupId = info.GroupId;
                ui.CardId = info.CardId;
                ui.Description = info.Description;

                DBResultInfo dbResult = um.UpdateUserInfo(ui);
                int result = dbResult.iResult;
                if (result > 0)
                {
                    um.UpdateUserRoleMap(info.UserId, info.RoleId);

                    return String.Format("{{result:1}}");
                }
                return String.Format("{{result:0,msg:'编辑用户失败',yes:1}}");
            }
            else
            {
                return String.Format("{{result:0,msg:'编辑用户失败',no:1}}");
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return String.Format("{{result:-1,msg:'{0}',error:'{1}'}}", Public.ReplaceSingleQuotes(ex.Message), Public.BuildExceptionCode(ex, HttpContext.Current));
        }
    }
    #endregion

}
