
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Model
{
    public class InspectionTaskInfo : ModelBaseInfo
    {
        public virtual String TaskName { set; get; }

        public virtual Int32 TaskType { set; get; }

        public virtual int TaskCategory { set; get; }

        public virtual object Grade { set; get; }

        public virtual Double Longitude { set; get; }

        public virtual Double Latitude { set; get; }

        public virtual int TaskDegree { set; get; }

        public virtual DateTime TaskStartTime { set; get; }
        public virtual DateTime TaskEndTime { set; get; }

        public virtual String TaskDescription { set; get; }

        public virtual String HelpURL { set; get; }
    }
}