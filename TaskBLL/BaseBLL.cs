﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace TaskBLL
{
    public class BaseBLL
    {
        FoxzyForMySql.MySqlManageUtil db = DBUtil.CreateMySqlDB();

        public DataTable GetDeviceinfo(int PageIndex, int PageSize, out int Count, String where = null, String order = null)
        {
            return db.CreateSelect()
                .From("device_info")
                .Select("device_id,index_code,device_name,create_time")
                .Where(where)
                .OrderByDesc("device_id")
                .Pagination(PageIndex, PageSize, out Count)
                .Tables[0];
        }

        public DataTable GetDeviceInfoByIDs(String deviceIDs)
        {
            return db.CreateSelect()
                .From("device_info")
                .Select("device_id,index_code,device_name,create_time")
                .Where(String.Format("device_id in ({0},-1)", deviceIDs))
                .ToDataSet()
                .Tables[0];
        }



        public DataTable GetUnitInfo(String where = null)
        {
            return db.CreateSelect()
                .From("control_unit", "c")
                .Select("(select count(*) from control_unit where parent_id= c.control_unit_id ) as ChilenNum,control_unit_id,name,index_code,parent_id,create_time,unit_level")
                .Where(where)
                .ToDataSet()
                .Tables[0];
        }

        public DataRow GetDeviceinfoByCode(String Code)
        {
            var data = db.CreateSelect()
                .From("device_info")
                .Select()
                .Where("index_code=?code")
                .SetParameter("?code", Code)
                .ToDataSet()
                .Tables[0];

            if (data.Rows.Count > 0)
                return data.Rows[0];
            else return null;
        }
    }
}
