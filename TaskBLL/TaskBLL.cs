using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MySql.Data.MySqlClient;

namespace TaskBLL
{
    public class TaskBLL
    {
        FoxzyForMySql.MySqlManageUtil db = new FoxzyForMySql.MySqlManageUtil();

        /// <summary>
        /// 根据客户端的ID 获取该ID下的所有任务
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public DataTable GetTaskTableByUser(String userID)
        {
            String sql = @"select tt.Value as TaskTypeText,td.Value as TaskDegreeTest,tc.Value as taskCategoryTest,t.HelpUrl,t.Longitude,t.Latitude,u.ID,t.Grade,t.TaskCategory,t.TaskDegree,t.TaskDescription,t.TaskEndTime,t.TaskStartTime,t.TaskType,t.TaskName
from UserTaskInfo u left JOIN InspectionTaskInfo t on t.ID=u.TaskID and t.enable=1
left join codeinfo tc on tc.Code=t.taskCategory
left join codeinfo td on td.Code=t.TaskDegree
left join codeinfo tt on tt.Code=t.TaskType
where u.UserAccount=?user and u.Enable=1";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?user",userID)
            };

            return db.FillDataSet(sql, pars).Tables[0];
        }


        public DataTable GetTaskTableByID(int userTaskID)
        {
            String sql = @"select t.OperationStandard as Specifications
from UserTaskInfo u left JOIN InspectionTaskInfo t on t.ID=u.TaskID and t.enable=1
where u.enable=1 and u.ID=?id";

            MySqlParameter[] pars = new MySqlParameter[]{
                new MySqlParameter("?id",userTaskID)
            };

            return db.FillDataSet(sql, pars).Tables[0];
        }
    }
}
