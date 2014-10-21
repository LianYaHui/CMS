using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Text;
using System.Data;
using Zyrh.BLL;
using Zyrh.BLL.Device;
using Zyrh.Model;
using Zyrh.Model.Device;

/// <summary>
/// ZyrhGpsWebService 的摘要说明
/// </summary>
[WebService(Namespace = "ZyrhGpsService")]
///[WebService(Namespace = "http://www.3gvs.net")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
public class ZyrhGpsWebService: System.Web.Services.WebService
{
    protected string DBConnectionString = Public.CmsDBConnectionString;
    protected string GpsDBConnectionString = Public.GpsDBConnectionString;

    public ZyrhGpsWebService()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    #region  创建GPS数据表
    [WebMethod(Description = "创建GPS数据表")]
    public bool CreateGpsTable()
    {
        try
        {
            DeviceGpsManage dgm = new DeviceGpsManage(this.DBConnectionString);
            DeviceStatusManage dsm = new DeviceStatusManage(this.DBConnectionString);

            string strTableName = dgm.BuildGpsTableName(string.Empty);// "gps" + DateTime.Now.ToString("yyyyMMdd");

            return dgm.CreateGpsTable(this.GpsDBConnectionString, strTableName);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  添加GPS信息
    [WebMethod(Description = "添加GPS信息")]
    public bool AddGpsInfo(DeviceGpsInfo dgi)
    {
        try
        {
            DeviceGpsManage dgm = new DeviceGpsManage(this.DBConnectionString);
            DeviceStatusManage dsm = new DeviceStatusManage(this.DBConnectionString);
            if (dgi.ReceiveTime.Equals(string.Empty))
            {
                dgi.ReceiveTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            }
            string strTableName = dgm.BuildGpsTableName(DateTime.Parse(dgi.ReceiveTime).ToString("yyyyMMdd"));
            string strSql = string.Empty;

            if (dgm.CreateGpsTable(this.GpsDBConnectionString, strTableName))
            {
                strSql = dgm.BuildGpsInsertSql(strTableName, dgi);
                dgm.InsertGpsInfo(this.GpsDBConnectionString, strSql);
            }

            if (dgm.CheckGpsBaseInfoIsExist(dgi.DevCode))
            {
                strSql = dgm.BuildGpsBaseInfoUpdateSql(dgi);
                dgm.UpdateGpsBaseInfo(strSql);
            }
            else
            {
                strSql = dgm.BuildGpsBaseInfoInsertSql(dgi);
                dgm.InsertGpsBaseInfo(strSql);
            }

            //保存设备状态表中的GPS信息
            DeviceStatusInfo dsi = new DeviceStatusInfo();
            dsi.Latitude = dgi.Latitude;
            dsi.Longitude = dgi.Longitude;
            dsi.LastGpsTime = dgi.ReceiveTime;
            dsi.GpsType = dgi.GpsType;
            dsi.GpsAddType = 0;
            dsi.Direction = dgi.Direction;
            dsi.Speed = dgi.Speed;
            dsi.Mileage = dgi.Mileage;
            dsi.AccStatus = dgi.AccStatus;
            dsi.AlarmInfo = dgi.AlarmInfo;
            dsi.IoStatus = dgi.IoStatus;
            dsi.DevCode = dgi.DevCode;

            dsm.UpdateDeviceStatusGps(dsi);

            return true;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  批量添加GPS信息
    [WebMethod(Description="批量添加GPS信息")]
    public bool BatchAddGpsInfo(List<DeviceGpsInfo> lstGps)
    {
        try
        {
            DeviceGpsManage dgm = new DeviceGpsManage(this.DBConnectionString);
            DeviceStatusManage dsm = new DeviceStatusManage(this.DBConnectionString);

            foreach (DeviceGpsInfo dgi in lstGps)
            {
                if (dgi.ReceiveTime.Equals(string.Empty))
                {
                    dgi.ReceiveTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                }
                string strTableName = dgm.BuildGpsTableName(DateTime.Parse(dgi.ReceiveTime).ToString("yyyyMMdd"));// "gps" + DateTime.Parse(dgi.ReceiveTime).ToString("yyyyMMdd");
                string strSql = string.Empty;

                if (dgm.CreateGpsTable(this.GpsDBConnectionString, strTableName))
                {
                    strSql = dgm.BuildGpsInsertSql(strTableName, dgi);
                    dgm.InsertGpsInfo(this.GpsDBConnectionString, strSql);
                }

                if (dgm.CheckGpsBaseInfoIsExist(dgi.DevCode))
                {
                    strSql = dgm.BuildGpsBaseInfoUpdateSql(dgi);
                    dgm.UpdateGpsBaseInfo(strSql);
                }
                else
                {
                    strSql = dgm.BuildGpsBaseInfoInsertSql(dgi);
                    dgm.InsertGpsBaseInfo(strSql);
                }

                //保存设备状态表中的GPS信息
                DeviceStatusInfo dsi = new DeviceStatusInfo();
                dsi.Latitude = dgi.Latitude;
                dsi.Longitude = dgi.Longitude;
                dsi.LastGpsTime = dgi.ReceiveTime;
                dsi.GpsType = dgi.GpsType;
                dsi.GpsAddType = 0;
                dsi.Direction = dgi.Direction;
                dsi.Speed = dgi.Speed;
                dsi.Mileage = dgi.Mileage;
                dsi.AccStatus = dgi.AccStatus;
                dsi.AlarmInfo = dgi.AlarmInfo;
                dsi.IoStatus = dgi.IoStatus;
                dsi.DevCode = dgi.DevCode;

                dsm.UpdateDeviceStatusGps(dsi);
            }
            return true;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return false;
        }
    }
    #endregion

    #region  巡检任务报送
    [WebMethod(Description = "巡检任务报送 返回整形数组: 0:失败,1:成功,-1:表示程序出错,-2:重复报送，-3:任务已取消，-4:无效报送，-5:任务不存在")]
    public List<int> PatrolTaskReport(List<PatrolTaskReportInfo> lstPTRIInfo)
    {
        List<int> lstResult = new List<int>();
        try
        {
            PatrolTaskManage ptm = new PatrolTaskManage(this.DBConnectionString);
            foreach (PatrolTaskReportInfo ptrInfo in lstPTRIInfo)
            {
                if (ptrInfo.FinishTime.Equals(string.Empty))
                {
                    ptrInfo.FinishTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                }

                DBResultInfo dbResult = ptm.UpdatePatrolTaskPlain(ptrInfo);
                int result = dbResult.iResult;

                ServerLog.WriteDebugLog(HttpContext.Current.Request, "GPS_Report", dbResult.strSql);

                lstResult.Add(result); 
            }
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
        }
        return lstResult;
    }
    #endregion

    #region  获取设备巡检任务
    /// <summary>
    /// 获取设备巡检任务
    /// </summary>
    /// <param name="strDevCode">设备索引编号</param>
    /// <param name="lstDevTaskMemory">设备当前任务存储</param>
    /// <returns></returns>
    [WebMethod(Description = "获取设备巡检任务（当前有效的） strDevCode:设备索引编号；lstDevTaskMemory:设备当前任务存储")]
    public List<PatrolTaskPlanInfo> GetDevicePatrolTask(string strDevCode, List<PatrolTaskPlanInfo> lstDevTaskMemory)
    {
        try
        {
            return this.GetDeviceUsableTask(strDevCode, lstDevTaskMemory);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }

    [WebMethod(Description = "获取设备巡检任务（当前有效的） strDevCode:设备索引编号；lstDevTaskMemory:设备当前任务存储")]
    public List<PatrolTaskPlanInfo> GetDevicePatrolTaskTest(string strDevCode)
    {
        try
        {
            return this.GetDeviceUsableTask(strDevCode, null);
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion

    #region  获得设备有效任务
    protected List<PatrolTaskPlanInfo> GetDeviceUsableTask(string strDevCode, List<PatrolTaskPlanInfo> lstDevTaskMemory)
    {
        try
        {
            List<PatrolTaskPlanInfo> lstTask = new List<PatrolTaskPlanInfo>();

            PatrolTaskManage ptm = new PatrolTaskManage(this.DBConnectionString);
            DBResultInfo dbResult = ptm.GetDeviceUsableTask(strDevCode, 0, 0);

            //ServerLog.WriteDebugLog(HttpContext.Current.Request, "GPS_GetTask", dbResult.strSql);
            DataSet ds = dbResult.dsResult;
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    PatrolTaskPlanInfo ptp = ptm.FillPatrolTaskPlanInfo(dr);
                    //将任务计划ID 作为 任务ID 发送到设备上
                    ptp.TaskId = ptp.Id;

                    lstTask.Add(ptp);
                }
            }

            return lstTask;
        }
        catch (Exception ex)
        {
            ServerLog.WriteErrorLog(ex, HttpContext.Current);
            return null;
        }
    }
    #endregion


}
