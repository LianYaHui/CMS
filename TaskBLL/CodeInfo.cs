using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TaskBLL
{
    public class CodeInfo : ModelBaseInfo
    {
        public int Code
        {
            set;
            get;
        }

        public int Value
        {
            set;
            get;
        }

        public int CodeType
        {
            set;
            get;
        }

        public String Object { set; get; }
    }
}
