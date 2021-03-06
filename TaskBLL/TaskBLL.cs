﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MySql.Data.MySqlClient;
using System.Web;

namespace TaskBLL
{
    public class TaskBLL
    {
        FoxzyForMySql.MySqlManageUtil db = DBUtil.CreateMySqlDB();

        public int InsertLog(String LogStr)
        {
            return db.CreateInsert("sysManageLog")
                .SetObject(new
                {
                    logtime = DateTime.Now,
                    logText = LogStr,
                    clientIP = HttpContext.Current.Request.UserHostAddress
                })
                .ExecuteNonQuery();
        }

        /// <summary>
        /// 根据客户端的ID 获取该ID下的所有任务
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public DataTable GetTaskTableByUser(String userID, int TaskType)
        {
            String sql = @"select t.ID,tt.Value as TaskTypeText,td.Value as TaskDegreeTest,tc.Value as TaskCategoryTest,
                        s.HelpWebUrl as HelpUrl,p.Longitude,p.Latitude,t.Grade,t.TaskCategory,
                        t.TaskDegree,s.TaskDesc as TaskDescription,t.TaskEndTime,t.TaskStartTime,t.TaskType,
                        t.TaskName,t.RoadId,t.taskLeave as 'Leave'
                        from taskdeviceinfo u join InspectionTaskInfo t on t.ID=u.taskid
                        left join UserTaskMappingInfo tm on tm.dt_id=u.tdID
                        left join device_info d on u.DeviceID=d.device_id
                        left join patrol_point p on p.point_id= t.PointID
                        left join codeinfo tc on tc.Code=t.taskCategory
                        left join codeinfo td on td.Code=t.TaskDegree
                        left join codeinfo tt on tt.Code=t.TaskType
                        left join taskspecies s on s.Species_ID=t.SpeciesID
                        where d.index_code=?user and u.isDelete=0 
                        and tm.dt_id is NULL $$where
                        order by t.ID desc";

            if (TaskType % 10000 == 0)
                sql = sql.Replace("$$where", "");
            else
                sql = sql.Replace("$$where", " and t.TaskType=" + TaskType);

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?user",userID)
            };
            return db.FillDataSet(sql, pars).Tables[0];
        }


        public DataTable GetTaskTableByID(int userTaskID)
        {
            String sql = @"select t.OperationStandard as Specifications
                            from InspectionTaskInfo t
                            where t.ID=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",userTaskID)
            };

            return db.FillDataSet(sql, pars).Tables[0];
        }

        public DataTable GetPatrolLine(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select l.line_id,l.create_time,l.line_name,line_count.c,u.name
from patrol_line l left join control_unit u on l.unit_id=u.control_unit_id
left join (select line_id,count(*) as c from patrol_point group by line_id) as line_count on line_count.line_id=l.line_id
where l.is_delete=0";

            String getCountSql = String.Format("select count(*) from ({0}) as t", baseSql);

            String ReturnDataSql = String.Format("{0} limit {1},{2}",
                baseSql, (currentPage - 1) * pageCount, currentPage * pageCount);

            totalCount = Convert.ToInt32(db.ExecuteScalar(getCountSql));

            return db.FillDataSet(ReturnDataSql).Tables[0];
        }


        public DataTable GetTreeLine(int superID, int lineSort)
        {
            String sql = String.Format(@"select l.line_sort,l.lineOrder,l.super_id,l.line_id,l.create_time,l.line_name,line_count.c,u.name,(select count(*) from patrol_line cl where cl.super_id=l.line_id and cl.is_delete=0 AND cl.line_sort={0}) as chilenCount
from patrol_line l left join control_unit u on l.unit_id=u.control_unit_id
left join (select line_id,count(*) as c from patrol_point  group by line_id) as line_count on line_count.line_id=l.line_id
where l.is_delete=0 and l.super_id={1}  $$sort order by l.lineOrder,l.line_id desc", lineSort, superID);

            if (superID > 0)
            {
                sql = sql.Replace("$$sort", String.Format("and l.line_sort = {0}", lineSort));

            }
            else
                sql = sql.Replace("$$sort", "");

            return db.FillDataSet(sql).Tables[0];
        }

        public DataRow GetPatrolLineByID(int ID)
        {
            String sql = @"select * from patrol_line where line_id=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",ID)
            };

            return db.FillDataSet(sql, pars).Tables[0].Rows[0];
        }

        public DataRow GetPatrolLineByName(String LineName)
        {
            return db.CreateSelect()
                .From("patrol_line")
                .Select()
                .Where("line_name=?name")
                .SetParameter("?name", LineName)
                .ToDataSet()
                .Tables[0].Rows[0];
        }


        public DataTable GetPatrolType(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select t.*,c.c from patrol_point_type t left join (select type_id,count(*) as c from patrol_point group by type_id) c on c.type_id=t.type_id where is_delete=0";

            String getCountSql = String.Format("select count(*) from ({0}) as t", baseSql);

            String ReturnDataSql = String.Format("{0} limit {1},{2}",
                baseSql, (currentPage - 1) * pageCount, currentPage * pageCount);

            totalCount = Convert.ToInt32(db.ExecuteScalar(getCountSql));

            return db.FillDataSet(ReturnDataSql).Tables[0];
        }

        public DataRow GetPatrolTypeByID(int id)
        {
            String sql = @"select * from patrol_point_type where type_id=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",id)
            };

            return db.FillDataSet(sql, pars).Tables[0].Rows[0];
        }

        public DataRow GetPatrolTypeByName(String Name)
        {
            return db.CreateSelect()
               .From("patrol_point_type")
               .Select()
               .Where("type_name=?name")
               .SetParameter("?name", Name)
               .ToDataSet()
               .Tables[0].Rows[0];
        }



        public DataTable GetPatrolPoint(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select p.*,pt.type_name,pl.line_name,u.name as uName from patrol_point p left JOIN patrol_point_type pt on p.type_id=pt.type_id
                                left JOIN patrol_line pl on pl.line_id=p.line_id
                                left Join control_unit u on u.control_unit_id=p.unit_id where p.is_delete=0";

            if (!String.IsNullOrEmpty(where))
            {
                baseSql += where;
            }


            String getCountSql = String.Format("select count(*) from ({0}) as t", baseSql);

            String ReturnDataSql = String.Format("{0} limit {1},{2}",
                baseSql, (currentPage - 1) * pageCount, currentPage * pageCount);

            totalCount = Convert.ToInt32(db.ExecuteScalar(getCountSql));

            return db.FillDataSet(ReturnDataSql).Tables[0];
        }

        public DataRow GetPatrolPointByID(int id)
        {
            String sql = @"select * from patrol_point where point_id=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",id)
            };

            return db.FillDataSet(sql, pars).Tables[0].Rows[0];
        }


        public DataTable GetTaskDesc(string UserName, int BeginNum, int EndNum)
        {
            String sql = String.Format("select td.desc,td.Accout,td.DescDateTime from taskdesc td where td.DriveID=?d limit {0},{1}", BeginNum, EndNum);

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?d",UserName)
            };

            return db.FillDataSet(sql, pars).Tables[0];
        }

        public DataTable GetTaskList(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select t.*,ct.`Value` as typeDesc,cc.`Value` as Category,cd.`Value` as DegreeDesc, p.*from 
inspectiontaskinfo t LEFT JOIN codeinfo ct on ct.`Code`=t.TaskType
LEFT JOIN CodeInfo cc on cc.code=t.TaskCategory
left join CodeInfo cd on cd.code=t.TaskDegree
left join patrol_point p on t.pointID =p.point_id 
 where t.`isEnable`=1";


            if (!String.IsNullOrEmpty(where))
            {
                baseSql += where;
            }


            String getCountSql = String.Format("select count(*) from ({0}) as t", baseSql);

            String ReturnDataSql = String.Format("{0} limit {1},{2}",
                baseSql, (currentPage - 1) * pageCount, currentPage * pageCount);

            totalCount = Convert.ToInt32(db.ExecuteScalar(getCountSql));

            return db.FillDataSet(ReturnDataSql).Tables[0];
        }


        public int DeleteTask(String TaskIDs)
        {
            return db.CreateUpdate("inspectiontaskinfo")
                .Set("isEnable=0")
                .Where(String.Format("id in ({0})", TaskIDs))
                .ExecuteNonQuery();
        }

        public DataRow GetTaskByID(int id)
        {
            return db.CreateSelect()
                .From("inspectiontaskinfo")
                .Where("ID=?id")
                .SetParameter("?id", id)
                .ToDataSet()
                .Tables[0]
                .Rows[0];
        }

        public DataTable GetTaskDeviceByTaskID(int taskID)
        {
            return db.CreateSelect()
                .From("TaskDeviceInfo")
                .Where(String.Format("isDelete=0 and TaskID={0}", taskID))
                .ToDataSet()
                .Tables[0];
        }

        public DataTable GetUserTaskMapping(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String sql = @"select td.*,tm.ID,d.device_name,t.TaskName,t.TaskStartTime,t.TaskEndTime,c.Value as upResult from taskdeviceinfo td 
                        left join UserTaskMappingInfo tm on tm.dt_id=td.tdID
                        left join device_info d on td.deviceID =d.device_id
                        left Join codeinfo c on c.code=tm.taskResult
                        left join inspectiontaskinfo t on td.taskid=t.ID
                        where td.isdelete=0";

            return db.CreatePagination()
                .Set(sql, null)
                .Pagination(currentPage, pageCount, out totalCount, null).Tables[0];
        }


        public DataRow GetDeviceTaskInfo(int p)
        {
            return db.CreateSelect()
                .Select()
                .From("UserTaskMappingInfo")
                .Where("ID=" + p)
                .ToDataSet()
                .Tables[0]
                .Rows[0];
        }

        public DataTable GetUploadTaskInfo(String mark)
        {
            return db.CreateSelect()
                .Select()
                .From("uploadtaskinfo")
                .Where("isEnable=1 and MarkID=?mark")
                .SetParameter("?mark", mark)
                .ToDataSet()
                .Tables[0];
        }

        public int Insert(String tableName, object info)
        {
            return db.CreateInsert(tableName)
                .SetObject(info)
                .ExecuteNonQuery();
        }

        public DataTable SelectTaskSpecies(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String sql = @"select Species_Name,Species_ID,HelpWebUrl,TaskDesc,create_time from taskspecies
                            where isEnable=1";

            return db.CreatePagination()
                .Set(sql, null)
                .Pagination(currentPage, pageCount, out totalCount, null).Tables[0];
        }

        public DataRow GetTaskSpecies(int id)
        {
            return db.CreateSelect()
                .From("taskspecies")
                .Select()
                .Where("Species_ID=" + id)
                .ToDataSet()
                .Tables[0]
                .Rows[0];
        }

        public DataTable GetDeviceInfo(int unitID)
        {
            String sql = @"select * from device_info d
                        where d.type_code=50785 and d.control_unit_id=" + unitID;

            return db.FillDataSet(sql, null, CommandType.Text).Tables[0];
        }



        public DataTable SelectPointByGUID(string guid)
        {
            return db.CreateSelect()
                .From("patrol_point as p")
                .LeftJoin("patrol_line as l")
                .On("l.line_id=p.line_id")
                .Where("p.guid=?guid")
                .SetParameter("?guid", guid)
                .Select("p.point_id,l.line_name,p.point_name")
                .ToDataSet()
                .Tables[0];
        }

        public DataTable SelectTaskDevice(int deviceID, int taskID)
        {
            return db.CreateSelect()
                .From("taskdeviceinfo")
                .Select()
                .Where("TaskID=?tid and DeviceID =?did and isDelete=0")
                .SetParameter("?tid", taskID)
                .SetParameter("?did", deviceID)
                .ToDataSet()
                .Tables[0];
        }

        public DataRow SelectDeviceTaskByID(int tdid)
        {
            var data = db.CreateSelect()
                .From("taskdeviceinfo")
                .Select()
                .Where("tdID=?tdid")
                .SetParameter("?tdid", tdid)
                .ToDataSet()
                .Tables[0];

            if (data.Rows.Count > 0)
                return data.Rows[0];
            else return null;
        }

        public DataRow GetTaskMappingByDTID(int tdid)
        {
            var data = db.CreateSelect()
                .From("UserTaskMappingInfo")
                .Select()
                .Where("dt_id=?tdid")
                .SetParameter("?tdid", tdid)
                .ToDataSet()
                .Tables[0];

            if (data.Rows.Count > 0)
                return data.Rows[0];
            else return null;
        }

        public DataRow GetDtByTaskIDAndUser(int taskId, int userID)
        {
            var data = db.CreateSelect()
                .From("taskdeviceinfo")
                .Select()
                .Where("TaskID=?tid and DeviceID = ?uid and isDelete=0")
                .SetParameter("?tid", taskId)
                .SetParameter("?uid", userID)
                .ToDataSet()
                .Tables[0];

            if (data.Rows.Count > 0)
                return data.Rows[0];
            else return null;
        }

        public DataRow GetUserTaskMappingInfoBydtID(int tdID)
        {
            var data = db.CreateSelect()
                .From("UserTaskMappingInfo")
                .Select()
                .Where("dt_id=" + tdID)
                .ToDataSet()
                .Tables[0];

            if (data.Rows.Count > 0)
                return data.Rows[0];
            else return null;
        }
    }
}
