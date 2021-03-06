﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MySql.Data.MySqlClient;
using System.Collections;
using System.Data;

namespace TaskBLL
{
    public class DeviceGroupBLL
    {

        FoxzyForMySql.MySqlManageUtil db = DBUtil.CreateMySqlDB();

        /// <summary>
        /// 自动生成系统群组并更新成员
        /// </summary>
        /// <param name="unitID"></param>
        /// <returns></returns>
        public int BuilderGroup(int unitID)
        {
            var unitInfo = GetUnitInfo(unitID);

            if (unitInfo == null)
            {
                return -1;
            }
            DataTable group_tb = GetGroupByUnitID(unitID);

            if (group_tb.Rows.Count == 0)
            {
                //新建系统组
                Dictionary<String, Object> groupInfo = new Dictionary<string, object>();

                groupInfo.Add("GroupID", 0);
                groupInfo.Add("GroupBuildType", 200001);
                groupInfo.Add("isEnable", true);
                groupInfo.Add("CreateTime", DateTime.Now);
                groupInfo.Add("UnitID", unitID);

                groupInfo.Add("GroupName", DataView.ToString(unitInfo["name"]) + "_组群");
                InsertGroupInfo(groupInfo);
            }

            var GroupInfo = GetGroupByUnitID(unitID).Rows[0];

            int GroupID = Convert.ToInt32(GroupInfo["GroupID"]);


            var deviceGroupInfo = GetGroupDeviceinfo(GroupID).Rows.OfType<DataRow>();
            var deviceInfos = GetDeviceInfo(unitID);

            //生成默认的群
            foreach (DataRow d in deviceInfos.Rows)
            {
                String deviceCode = Convert.ToString(d["index_code"]).ToLower();

                if (deviceGroupInfo.Count(r =>
                    Convert.ToString(r["DeviceCode"]).ToLower()
                    == deviceCode) == 0)
                {
                    Dictionary<String, Object> groupdeviceInfo = new Dictionary<string, object>();

                    groupdeviceInfo.Add("GroupID", GroupID);
                    groupdeviceInfo.Add("DeviceCode", deviceCode);
                    groupdeviceInfo.Add("JoinDateTime", DateTime.Now);
                    groupdeviceInfo.Add("isEnable", true);

                    Insert("Group_Device_Join", groupdeviceInfo);
                }
            }

            //TODO
            //remove


            return 1;
        }

        public int Insert(String table, Dictionary<String, Object> info)
        {
            return db.CreateInsert(table)
              .SetDictionary(info)
              .ExecuteNonQuery();
        }

        public int Insert(String table, object info)
        {
            return db.CreateInsert(table)
              .SetObject(info)
              .ExecuteNonQuery();
        }

        public DataTable GetGroupDeviceinfo(int groupID)
        {
            return db.CreateSelect()
                .Select()
                .From("Group_Device_Join")
                .Where("isEnable=1 and GroupID = " + groupID)
                .ToDataSet()
                .Tables[0];
        }


        public void InsertGroupInfo(Dictionary<String, Object> groupInfo)
        {
            db.CreateInsert("Device_Group_Info")
              .SetDictionary(groupInfo)
              .ExecuteNonQuery();
        }

        public DataTable GetGroupByUnitID(int unitID)
        {
            String sql = "select * from Device_Group_Info where UnitID=?uid and isEnable=1";

            IEnumerable<IDataParameter> pars = new IDataParameter[]{
                new MySqlParameter("?uid",unitID)
            };

            DataTable group_tb = db.FillDataSet(sql, pars, CommandType.Text).Tables[0];
            return group_tb;
        }

        public DataRow GetUnitInfo(int unitID)
        {
            return db.CreateSelect()
                .From("control_unit")
                .Where("control_unit_id=" + unitID)
                .Select()
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

        public DataTable GetGroupByDeviceCode(String Code)
        {
            return db.CreateSelect()
                .From("Group_Device_Join")
                .Select()
                .Where("DeviceCode=?code and  isEnable=1")
                .SetParameter("?code", Code)
                .ToDataSet()
                .Tables[0];
        }

        public DataTable GetGroupDevice(int groupID)
        {
            String sql = @"select d.device_name,de.*,'' as DeptName,'' as WorkTypeID from Group_Device_Join g
left JOIN device_info d on d.index_code=g.DeviceCode
left JOIN Device_emp_info de on de.DeviceCode=d.index_code
where g.GroupID=?gid and g.isEnable=1";

            IEnumerable<IDataParameter> pars = new IDataParameter[]{
                                               new MySqlParameter("?gid",groupID)
                                               };

            return db.FillDataSet(sql, pars, CommandType.Text).Tables[0];
        }

        public DataTable SelectGroup(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String baseSql = @"select g.*,c.Value as groupBuildTypeText from  Device_Group_Info g 
                            left join  Codeinfo c on g.groupBuildType=c.Code
                            where g.isEnable=1 ORDER BY GROUPID desc";

            return db.CreatePagination()
                .Set(baseSql, null)
                .Pagination(currentPage, pageCount, out totalCount, null).Tables[0];
        }

        public DataRow GetGroupInfo(int gid)
        {
            return db.CreateSelect()
                .From("Device_Group_Info")
                .Select()
                .Where("GroupID=" + gid)
                .ToDataSet()
                .Tables[0]
                .Rows[0];
        }

        public int RemoveDeviceForGroup(int groupID, string[] deivceCode)
        {
            return db.CreateUpdate("Group_Device_Join")
                .Set("isEnable=0,ExitDatetime=now()")
                .SetParameter("?gid", groupID)
                .Where(String.Format("GroupID=?gid and DeviceCode in ({0})", String.Join(",", deivceCode.Select(c => String.Format("'{0}'", c)).ToArray())))
                .ExecuteNonQuery();
        }

        public int RemoveGroup(int groupID)
        {
            return db.CreateUpdate("Device_Group_Info")
               .Set("isEnable=0")
               .SetParameter("?gid", groupID)
               .Where("GroupID=?gid ")
               .ExecuteNonQuery();
        }

        public DataTable SelectGroupNode(int currentPage, int pageCount, out int totalCount, String where = null, String order = null)
        {
            String sql = "select * from device_node_info where isEnable=1";

            if (!String.IsNullOrEmpty(where))
                sql += where;

            return db.CreatePagination()
                 .Set(sql, null)
                 .Pagination(currentPage, pageCount, out totalCount, order)
                 .Tables[0];
        }
    }
}
