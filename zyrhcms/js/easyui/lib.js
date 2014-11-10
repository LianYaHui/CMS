﻿var JSON = function () { var m = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, s = { "boolean": function (x) { return String(x) }, number: function (x) { return isFinite(x) ? String(x) : "null" }, string: function (x) { if (/["\\\x00-\x1f]/.test(x)) { x = x.replace(/([\x00-\x1f\\"])/g, function (a, b) { var c = m[b]; if (c) { return c } c = b.charCodeAt(); return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16) }) } return '"' + x + '"' }, object: function (x) { if (x) { var a = [], b, f, i, l, v; if (x instanceof Array) { a[0] = "["; l = x.length; for (i = 0; i < l; i += 1) { v = x[i]; f = s[typeof v]; if (f) { v = f(v); if (typeof v == "string") { if (b) { a[a.length] = "," } a[a.length] = v; b = true } } } a[a.length] = "]" } else { if (x instanceof Object) { a[0] = "{"; for (i in x) { v = x[i]; f = s[typeof v]; if (f) { v = f(v); if (typeof v == "string") { if (b) { a[a.length] = "," } a.push(s.string(i), ":", v); b = true } } } a[a.length] = "}" } else { return } } return a.join("") } return "null" } }; return { copyright: "(c)2005 JSON.org", license: "http://www.crockford.com/JSON/license.html", stringify: function (v) { var f = s[typeof v]; if (f) { v = f(v); if (typeof v == "string") { return v } } return null }, parse: function (text) { try { return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, ""))) && eval("(" + text + ")") } catch (e) { return false } } } }();


Enumerable = (function (j) { var b = function (o) { this.GetEnumerator = o }; b.Choice = function () { var o = (arguments[0] instanceof Array) ? arguments[0] : arguments; return new b(function () { return new f(h.Blank, function () { return this.Yield(o[Math.floor(Math.random() * o.length)]) }, h.Blank) }) }; b.Cycle = function () { var o = (arguments[0] instanceof Array) ? arguments[0] : arguments; return new b(function () { var p = 0; return new f(h.Blank, function () { if (p >= o.length) { p = 0 } return this.Yield(o[p++]) }, h.Blank) }) }; b.Empty = function () { return new b(function () { return new f(h.Blank, function () { return false }, h.Blank) }) }; b.From = function (o) { if (o == null) { return b.Empty() } if (o instanceof b) { return o } if (typeof o == e.Number || typeof o == e.Boolean) { return b.Repeat(o, 1) } if (typeof o == e.String) { return new b(function () { var p = 0; return new f(h.Blank, function () { return (p < o.length) ? this.Yield(o.charAt(p++)) : false }, h.Blank) }) } if (typeof o != e.Function) { if (typeof o.length == e.Number) { return new d(o) } if (!(o instanceof Object) && i.IsIEnumerable(o)) { return new b(function () { var p = true; var q; return new f(function () { q = new Enumerator(o) }, function () { if (p) { p = false } else { q.moveNext() } return (q.atEnd()) ? false : this.Yield(q.item()) }, h.Blank) }) } } return new b(function () { var q = []; var p = 0; return new f(function () { for (var r in o) { if (!(o[r] instanceof Function)) { q.push({ Key: r, Value: o[r] }) } } }, function () { return (p < q.length) ? this.Yield(q[p++]) : false }, h.Blank) }) }, b.Return = function (o) { return b.Repeat(o, 1) }; b.Matches = function (p, q, o) { if (o == null) { o = "" } if (q instanceof RegExp) { o += (q.ignoreCase) ? "i" : ""; o += (q.multiline) ? "m" : ""; q = q.source } if (o.indexOf("g") === -1) { o += "g" } return new b(function () { var r; return new f(function () { r = new RegExp(q, o) }, function () { var s = r.exec(p); return (s) ? this.Yield(s) : false }, h.Blank) }) }; b.Range = function (q, p, o) { if (o == null) { o = 1 } return b.ToInfinity(q, o).Take(p) }; b.RangeDown = function (q, p, o) { if (o == null) { o = 1 } return b.ToNegativeInfinity(q, o).Take(p) }; b.RangeTo = function (q, p, o) { if (o == null) { o = 1 } return (q < p) ? b.ToInfinity(q, o).TakeWhile(function (r) { return r <= p }) : b.ToNegativeInfinity(q, o).TakeWhile(function (r) { return r >= p }) }; b.Repeat = function (p, o) { if (o != null) { return b.Repeat(p).Take(o) } return new b(function () { return new f(h.Blank, function () { return this.Yield(p) }, h.Blank) }) }; b.RepeatWithFinalize = function (p, o) { p = i.CreateLambda(p); o = i.CreateLambda(o); return new b(function () { var q; return new f(function () { q = p() }, function () { return this.Yield(q) }, function () { if (q != null) { o(q); q = null } }) }) }; b.Generate = function (p, o) { if (o != null) { return b.Generate(p).Take(o) } p = i.CreateLambda(p); return new b(function () { return new f(h.Blank, function () { return this.Yield(p()) }, h.Blank) }) }; b.ToInfinity = function (p, o) { if (p == null) { p = 0 } if (o == null) { o = 1 } return new b(function () { var q; return new f(function () { q = p - o }, function () { return this.Yield(q += o) }, h.Blank) }) }; b.ToNegativeInfinity = function (p, o) { if (p == null) { p = 0 } if (o == null) { o = 1 } return new b(function () { var q; return new f(function () { q = p + o }, function () { return this.Yield(q -= o) }, h.Blank) }) }; b.Unfold = function (o, p) { p = i.CreateLambda(p); return new b(function () { var q = true; var r; return new f(h.Blank, function () { if (q) { q = false; r = o; return this.Yield(r) } r = p(r); return this.Yield(r) }, h.Blank) }) }; b.prototype = { CascadeBreadthFirst: function (p, o) { var q = this; p = i.CreateLambda(p); o = i.CreateLambda(o); return new b(function () { var t; var s = 0; var r = []; return new f(function () { t = q.GetEnumerator() }, function () { while (true) { if (t.MoveNext()) { r.push(t.Current()); return this.Yield(o(t.Current(), s)) } var u = b.From(r).SelectMany(function (v) { return p(v) }); if (!u.Any()) { return false } else { s++; r = []; i.Dispose(t); t = u.GetEnumerator() } } }, function () { i.Dispose(t) }) }) }, CascadeDepthFirst: function (p, o) { var q = this; p = i.CreateLambda(p); o = i.CreateLambda(o); return new b(function () { var r = []; var s; return new f(function () { s = q.GetEnumerator() }, function () { while (true) { if (s.MoveNext()) { var t = o(s.Current(), r.length); r.push(s); s = b.From(p(s.Current())).GetEnumerator(); return this.Yield(t) } if (r.length <= 0) { return false } i.Dispose(s); s = r.pop() } }, function () { try { i.Dispose(s) } finally { b.From(r).ForEach(function (t) { t.Dispose() }) } }) }) }, Flatten: function () { var o = this; return new b(function () { var q; var p = null; return new f(function () { q = o.GetEnumerator() }, function () { while (true) { if (p != null) { if (p.MoveNext()) { return this.Yield(p.Current()) } else { p = null } } if (q.MoveNext()) { if (q.Current() instanceof Array) { i.Dispose(p); p = b.From(q.Current()).SelectMany(h.Identity).Flatten().GetEnumerator(); continue } else { return this.Yield(q.Current()) } } return false } }, function () { try { i.Dispose(q) } finally { i.Dispose(p) } }) }) }, Pairwise: function (o) { var p = this; o = i.CreateLambda(o); return new b(function () { var q; return new f(function () { q = p.GetEnumerator(); q.MoveNext() }, function () { var r = q.Current(); return (q.MoveNext()) ? this.Yield(o(r, q.Current())) : false }, function () { i.Dispose(q) }) }) }, Scan: function (p, r, q) { if (q != null) { return this.Scan(p, r).Select(q) } var o; if (r == null) { r = i.CreateLambda(p); o = false } else { r = i.CreateLambda(r); o = true } var s = this; return new b(function () { var v; var u; var t = true; return new f(function () { v = s.GetEnumerator() }, function () { if (t) { t = false; if (!o) { if (v.MoveNext()) { return this.Yield(u = v.Current()) } } else { return this.Yield(u = p) } } return (v.MoveNext()) ? this.Yield(u = r(u, v.Current())) : false }, function () { i.Dispose(v) }) }) }, Select: function (o) { var p = this; o = i.CreateLambda(o); return new b(function () { var r; var q = 0; return new f(function () { r = p.GetEnumerator() }, function () { return (r.MoveNext()) ? this.Yield(o(r.Current(), q++)) : false }, function () { i.Dispose(r) }) }) }, SelectMany: function (o, p) { var q = this; o = i.CreateLambda(o); if (p == null) { p = function (s, r) { return r } } p = i.CreateLambda(p); return new b(function () { var t; var s = undefined; var r = 0; return new f(function () { t = q.GetEnumerator() }, function () { if (s === undefined) { if (!t.MoveNext()) { return false } } do { if (s == null) { var u = o(t.Current(), r++); s = b.From(u).GetEnumerator() } if (s.MoveNext()) { return this.Yield(p(t.Current(), s.Current())) } i.Dispose(s); s = null } while (t.MoveNext()); return false }, function () { try { i.Dispose(t) } finally { i.Dispose(s) } }) }) }, Where: function (o) { o = i.CreateLambda(o); var p = this; return new b(function () { var r; var q = 0; return new f(function () { r = p.GetEnumerator() }, function () { while (r.MoveNext()) { if (o(r.Current(), q++)) { return this.Yield(r.Current()) } } return false }, function () { i.Dispose(r) }) }) }, OfType: function (p) { var o; switch (p) { case Number: o = e.Number; break; case String: o = e.String; break; case Boolean: o = e.Boolean; break; case Function: o = e.Function; break; default: o = null; break } return (o === null) ? this.Where(function (q) { return q instanceof p }) : this.Where(function (q) { return typeof q === o }) }, Zip: function (p, o) { o = i.CreateLambda(o); var q = this; return new b(function () { var t; var r; var s = 0; return new f(function () { t = q.GetEnumerator(); r = b.From(p).GetEnumerator() }, function () { if (t.MoveNext() && r.MoveNext()) { return this.Yield(o(t.Current(), r.Current(), s++)) } return false }, function () { try { i.Dispose(t) } finally { i.Dispose(r) } }) }) }, Join: function (q, p, s, r, o) { p = i.CreateLambda(p); s = i.CreateLambda(s); r = i.CreateLambda(r); o = i.CreateLambda(o); var t = this; return new b(function () { var w; var x; var u = null; var v = 0; return new f(function () { w = t.GetEnumerator(); x = b.From(q).ToLookup(s, h.Identity, o) }, function () { while (true) { if (u != null) { var z = u[v++]; if (z !== undefined) { return this.Yield(r(w.Current(), z)) } z = null; v = 0 } if (w.MoveNext()) { var y = p(w.Current()); u = x.Get(y).ToArray() } else { return false } } }, function () { i.Dispose(w) }) }) }, GroupJoin: function (q, p, s, r, o) { p = i.CreateLambda(p); s = i.CreateLambda(s); r = i.CreateLambda(r); o = i.CreateLambda(o); var t = this; return new b(function () { var v = t.GetEnumerator(); var u = null; return new f(function () { v = t.GetEnumerator(); u = b.From(q).ToLookup(s, h.Identity, o) }, function () { if (v.MoveNext()) { var w = u.Get(p(v.Current())); return this.Yield(r(v.Current(), w)) } return false }, function () { i.Dispose(v) }) }) }, All: function (p) { p = i.CreateLambda(p); var o = true; this.ForEach(function (q) { if (!p(q)) { o = false; return false } }); return o }, Any: function (o) { o = i.CreateLambda(o); var p = this.GetEnumerator(); try { if (arguments.length == 0) { return p.MoveNext() } while (p.MoveNext()) { if (o(p.Current())) { return true } } return false } finally { i.Dispose(p) } }, Concat: function (o) { var p = this; return new b(function () { var r; var q; return new f(function () { r = p.GetEnumerator() }, function () { if (q == null) { if (r.MoveNext()) { return this.Yield(r.Current()) } q = b.From(o).GetEnumerator() } if (q.MoveNext()) { return this.Yield(q.Current()) } return false }, function () { try { i.Dispose(r) } finally { i.Dispose(q) } }) }) }, Insert: function (p, o) { var q = this; return new b(function () { var u; var s; var t = 0; var r = false; return new f(function () { u = q.GetEnumerator(); s = b.From(o).GetEnumerator() }, function () { if (t == p && s.MoveNext()) { r = true; return this.Yield(s.Current()) } if (u.MoveNext()) { t++; return this.Yield(u.Current()) } if (!r && s.MoveNext()) { return this.Yield(s.Current()) } return false }, function () { try { i.Dispose(u) } finally { i.Dispose(s) } }) }) }, Alternate: function (o) { o = b.Return(o); return this.SelectMany(function (p) { return b.Return(p).Concat(o) }).TakeExceptLast() }, Contains: function (p, o) { o = i.CreateLambda(o); var q = this.GetEnumerator(); try { while (q.MoveNext()) { if (o(q.Current()) === p) { return true } } return false } finally { i.Dispose(q) } }, DefaultIfEmpty: function (o) { var p = this; return new b(function () { var r; var q = true; return new f(function () { r = p.GetEnumerator() }, function () { if (r.MoveNext()) { q = false; return this.Yield(r.Current()) } else { if (q) { q = false; return this.Yield(o) } } return false }, function () { i.Dispose(r) }) }) }, Distinct: function (o) { return this.Except(b.Empty(), o) }, Except: function (p, o) { o = i.CreateLambda(o); var q = this; return new b(function () { var s; var r; return new f(function () { s = q.GetEnumerator(); r = new k(o); b.From(p).ForEach(function (t) { r.Add(t) }) }, function () { while (s.MoveNext()) { var t = s.Current(); if (!r.Contains(t)) { r.Add(t); return this.Yield(t) } } return false }, function () { i.Dispose(s) }) }) }, Intersect: function (p, o) { o = i.CreateLambda(o); var q = this; return new b(function () { var t; var r; var s; return new f(function () { t = q.GetEnumerator(); r = new k(o); b.From(p).ForEach(function (u) { r.Add(u) }); s = new k(o) }, function () { while (t.MoveNext()) { var u = t.Current(); if (!s.Contains(u) && r.Contains(u)) { s.Add(u); return this.Yield(u) } } return false }, function () { i.Dispose(t) }) }) }, SequenceEqual: function (q, p) { p = i.CreateLambda(p); var r = this.GetEnumerator(); try { var o = b.From(q).GetEnumerator(); try { while (r.MoveNext()) { if (!o.MoveNext() || p(r.Current()) !== p(o.Current())) { return false } } if (o.MoveNext()) { return false } return true } finally { i.Dispose(o) } } finally { i.Dispose(r) } }, Union: function (p, o) { o = i.CreateLambda(o); var q = this; return new b(function () { var t; var r; var s; return new f(function () { t = q.GetEnumerator(); s = new k(o) }, function () { var u; if (r === undefined) { while (t.MoveNext()) { u = t.Current(); if (!s.Contains(u)) { s.Add(u); return this.Yield(u) } } r = b.From(p).GetEnumerator() } while (r.MoveNext()) { u = r.Current(); if (!s.Contains(u)) { s.Add(u); return this.Yield(u) } } return false }, function () { try { i.Dispose(t) } finally { i.Dispose(r) } }) }) }, OrderBy: function (o) { return new l(this, o, false) }, OrderByDescending: function (o) { return new l(this, o, true) }, Reverse: function () { var o = this; return new b(function () { var p; var q; return new f(function () { p = o.ToArray(); q = p.length }, function () { return (q > 0) ? this.Yield(p[--q]) : false }, h.Blank) }) }, Shuffle: function () { var o = this; return new b(function () { var p; return new f(function () { p = o.ToArray() }, function () { if (p.length > 0) { var q = Math.floor(Math.random() * p.length); return this.Yield(p.splice(q, 1)[0]) } return false }, h.Blank) }) }, GroupBy: function (q, r, p, o) { var s = this; q = i.CreateLambda(q); r = i.CreateLambda(r); if (p != null) { p = i.CreateLambda(p) } o = i.CreateLambda(o); return new b(function () { var t; return new f(function () { t = s.ToLookup(q, r, o).ToEnumerable().GetEnumerator() }, function () { while (t.MoveNext()) { return (p == null) ? this.Yield(t.Current()) : this.Yield(p(t.Current().Key(), t.Current())) } return false }, function () { i.Dispose(t) }) }) }, PartitionBy: function (q, r, p, o) { var t = this; q = i.CreateLambda(q); r = i.CreateLambda(r); o = i.CreateLambda(o); var s; if (p == null) { s = false; p = function (u, v) { return new n(u, v) } } else { s = true; p = i.CreateLambda(p) } return new b(function () { var x; var u; var v; var w = []; return new f(function () { x = t.GetEnumerator(); if (x.MoveNext()) { u = q(x.Current()); v = o(u); w.push(r(x.Current())) } }, function () { var z; while ((z = x.MoveNext()) == true) { if (v === o(q(x.Current()))) { w.push(r(x.Current())) } else { break } } if (w.length > 0) { var y = (s) ? p(u, b.From(w)) : p(u, w); if (z) { u = q(x.Current()); v = o(u); w = [r(x.Current())] } else { w = [] } return this.Yield(y) } return false }, function () { i.Dispose(x) }) }) }, BufferWithCount: function (o) { var p = this; return new b(function () { var q; return new f(function () { q = p.GetEnumerator() }, function () { var s = []; var r = 0; while (q.MoveNext()) { s.push(q.Current()); if (++r >= o) { return this.Yield(s) } } if (s.length > 0) { return this.Yield(s) } return false }, function () { i.Dispose(q) }) }) }, Aggregate: function (o, q, p) { return this.Scan(o, q, p).Last() }, Average: function (o) { o = i.CreateLambda(o); var p = 0; var q = 0; this.ForEach(function (r) { p += o(r); ++q }); return p / q }, Count: function (o) { o = (o == null) ? h.True : i.CreateLambda(o); var p = 0; this.ForEach(function (q, r) { if (o(q, r)) { ++p } }); return p }, Max: function (o) { if (o == null) { o = h.Identity } return this.Select(o).Aggregate(function (q, p) { return (q > p) ? q : p }) }, Min: function (o) { if (o == null) { o = h.Identity } return this.Select(o).Aggregate(function (q, p) { return (q < p) ? q : p }) }, MaxBy: function (o) { o = i.CreateLambda(o); return this.Aggregate(function (q, p) { return (o(q) > o(p)) ? q : p }) }, MinBy: function (o) { o = i.CreateLambda(o); return this.Aggregate(function (q, p) { return (o(q) < o(p)) ? q : p }) }, Sum: function (o) { if (o == null) { o = h.Identity } return this.Select(o).Aggregate(0, function (q, p) { return q + p }) }, ElementAt: function (o) { var q; var p = false; this.ForEach(function (r, s) { if (s == o) { q = r; p = true; return false } }); if (!p) { throw new Error("index is less than 0 or greater than or equal to the number of elements in source.") } return q }, ElementAtOrDefault: function (p, o) { var r; var q = false; this.ForEach(function (s, t) { if (t == p) { r = s; q = true; return false } }); return (!q) ? o : r }, First: function (o) { if (o != null) { return this.Where(o).First() } var q; var p = false; this.ForEach(function (r) { q = r; p = true; return false }); if (!p) { throw new Error("First:No element satisfies the condition.") } return q }, FirstOrDefault: function (p, o) { if (o != null) { return this.Where(o).FirstOrDefault(p) } var r; var q = false; this.ForEach(function (s) { r = s; q = true; return false }); return (!q) ? p : r }, Last: function (o) { if (o != null) { return this.Where(o).Last() } var q; var p = false; this.ForEach(function (r) { p = true; q = r }); if (!p) { throw new Error("Last:No element satisfies the condition.") } return q }, LastOrDefault: function (p, o) { if (o != null) { return this.Where(o).LastOrDefault(p) } var r; var q = false; this.ForEach(function (s) { q = true; r = s }); return (!q) ? p : r }, Single: function (o) { if (o != null) { return this.Where(o).Single() } var q; var p = false; this.ForEach(function (r) { if (!p) { p = true; q = r } else { throw new Error("Single:sequence contains more than one element.") } }); if (!p) { throw new Error("Single:No element satisfies the condition.") } return q }, SingleOrDefault: function (p, o) { if (o != null) { return this.Where(o).SingleOrDefault(p) } var r; var q = false; this.ForEach(function (s) { if (!q) { q = true; r = s } else { throw new Error("Single:sequence contains more than one element.") } }); return (!q) ? p : r }, Skip: function (o) { var p = this; return new b(function () { var r; var q = 0; return new f(function () { r = p.GetEnumerator(); while (q++ < o && r.MoveNext()) { } }, function () { return (r.MoveNext()) ? this.Yield(r.Current()) : false }, function () { i.Dispose(r) }) }) }, SkipWhile: function (o) { o = i.CreateLambda(o); var p = this; return new b(function () { var s; var q = 0; var r = false; return new f(function () { s = p.GetEnumerator() }, function () { while (!r) { if (s.MoveNext()) { if (!o(s.Current(), q++)) { r = true; return this.Yield(s.Current()) } continue } else { return false } } return (s.MoveNext()) ? this.Yield(s.Current()) : false }, function () { i.Dispose(s) }) }) }, Take: function (o) { var p = this; return new b(function () { var r; var q = 0; return new f(function () { r = p.GetEnumerator() }, function () { return (q++ < o && r.MoveNext()) ? this.Yield(r.Current()) : false }, function () { i.Dispose(r) }) }) }, TakeWhile: function (o) { o = i.CreateLambda(o); var p = this; return new b(function () { var r; var q = 0; return new f(function () { r = p.GetEnumerator() }, function () { return (r.MoveNext() && o(r.Current(), q++)) ? this.Yield(r.Current()) : false }, function () { i.Dispose(r) }) }) }, TakeExceptLast: function (o) { if (o == null) { o = 1 } var p = this; return new b(function () { if (o <= 0) { return p.GetEnumerator() } var s; var r = []; return new f(function () { s = p.GetEnumerator() }, function () { while (s.MoveNext()) { if (r.length == o) { r.push(s.Current()); return this.Yield(r.shift()) } r.push(s.Current()) } return false }, function () { i.Dispose(s) }) }) }, TakeFromLast: function (o) { if (o <= 0 || o == null) { return b.Empty() } var p = this; return new b(function () { var r; var t; var s = []; return new f(function () { r = p.GetEnumerator() }, function () { while (r.MoveNext()) { if (s.length == o) { s.shift() } s.push(r.Current()) } if (t == null) { t = b.From(s).GetEnumerator() } return (t.MoveNext()) ? this.Yield(t.Current()) : false }, function () { i.Dispose(t) }) }) }, IndexOf: function (o) { var p = null; this.ForEach(function (q, r) { if (q === o) { p = r; return true } }); return (p !== null) ? p : -1 }, LastIndexOf: function (p) { var o = -1; this.ForEach(function (q, r) { if (q === p) { o = r } }); return o }, ToArray: function () { var o = []; this.ForEach(function (p) { o.push(p) }); return o }, ToLookup: function (p, q, o) { p = i.CreateLambda(p); q = i.CreateLambda(q); o = i.CreateLambda(o); var r = new k(o); this.ForEach(function (s) { var u = p(s); var t = q(s); var v = r.Get(u); if (v !== undefined) { v.push(t) } else { r.Add(u, [t]) } }); return new g(r) }, ToObject: function (o, p) { o = i.CreateLambda(o); p = i.CreateLambda(p); var q = {}; this.ForEach(function (r) { q[o(r)] = p(r) }); return q }, ToDictionary: function (p, q, o) { p = i.CreateLambda(p); q = i.CreateLambda(q); o = i.CreateLambda(o); var r = new k(o); this.ForEach(function (s) { r.Add(p(s), q(s)) }); return r }, ToJSON: function (o, p) { return JSON.stringify(this.ToArray(), o, p) }, ToString: function (p, o) { if (p == null) { p = "" } if (o == null) { o = h.Identity } return this.Select(o).ToArray().join(p) }, Do: function (p) { var o = this; p = i.CreateLambda(p); return new b(function () { var r; var q = 0; return new f(function () { r = o.GetEnumerator() }, function () { if (r.MoveNext()) { p(r.Current(), q++); return this.Yield(r.Current()) } return false }, function () { i.Dispose(r) }) }) }, ForEach: function (p) { p = i.CreateLambda(p); var o = 0; var q = this.GetEnumerator(); try { while (q.MoveNext()) { if (p(q.Current(), o++) === false) { break } } } finally { i.Dispose(q) } }, Write: function (q, p) { if (q == null) { q = "" } p = i.CreateLambda(p); var o = true; this.ForEach(function (r) { if (o) { o = false } else { document.write(q) } document.write(p(r)) }) }, WriteLine: function (o) { o = i.CreateLambda(o); this.ForEach(function (p) { document.write(o(p)); document.write("<br />") }) }, Force: function () { var o = this.GetEnumerator(); try { while (o.MoveNext()) { } } finally { i.Dispose(o) } }, Let: function (o) { o = i.CreateLambda(o); var p = this; return new b(function () { var q; return new f(function () { q = b.From(o(p)).GetEnumerator() }, function () { return (q.MoveNext()) ? this.Yield(q.Current()) : false }, function () { i.Dispose(q) }) }) }, Share: function () { var o = this; var p; return new b(function () { return new f(function () { if (p == null) { p = o.GetEnumerator() } }, function () { return (p.MoveNext()) ? this.Yield(p.Current()) : false }, h.Blank) }) }, MemoizeAll: function () { var p = this; var o; var q; return new b(function () { var r = -1; return new f(function () { if (q == null) { q = p.GetEnumerator(); o = [] } }, function () { r++; if (o.length <= r) { return (q.MoveNext()) ? this.Yield(o[r] = q.Current()) : false } return this.Yield(o[r]) }, h.Blank) }) }, Catch: function (o) { o = i.CreateLambda(o); var p = this; return new b(function () { var q; return new f(function () { q = p.GetEnumerator() }, function () { try { return (q.MoveNext()) ? this.Yield(q.Current()) : false } catch (r) { o(r); return false } }, function () { i.Dispose(q) }) }) }, Finally: function (o) { o = i.CreateLambda(o); var p = this; return new b(function () { var q; return new f(function () { q = p.GetEnumerator() }, function () { return (q.MoveNext()) ? this.Yield(q.Current()) : false }, function () { try { i.Dispose(q) } finally { o() } }) }) }, Trace: function (p, o) { if (p == null) { p = "Trace" } o = i.CreateLambda(o); return this.Do(function (q) { console.log(p, ":", o(q)) }) } }; var h = { Identity: function (o) { return o }, True: function () { return true }, Blank: function () { } }; var e = { Boolean: typeof true, Number: typeof 0, String: typeof "", Object: typeof {}, Undefined: typeof undefined, Function: typeof function () { } }; var i = { CreateLambda: function (p) { if (p == null) { return h.Identity } if (typeof p == e.String) { if (p == "") { return h.Identity } else { if (p.indexOf("=>") == -1) { return new Function("$,$$,$$$,$$$$", "return " + p) } else { var o = p.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/); return new Function(o[1], "return " + o[2]) } } } return p }, IsIEnumerable: function (p) { if (typeof Enumerator != e.Undefined) { try { new Enumerator(p); return true } catch (o) { } } return false }, Compare: function (p, o) { return (p === o) ? 0 : (p > o) ? 1 : -1 }, Dispose: function (o) { if (o != null) { o.Dispose() } } }; var m = { Before: 0, Running: 1, After: 2 }; var f = function (o, p, r) { var s = new c(); var q = m.Before; this.Current = s.Current; this.MoveNext = function () { try { switch (q) { case m.Before: q = m.Running; o(); case m.Running: if (p.apply(s)) { return true } else { this.Dispose(); return false } case m.After: return false } } catch (t) { this.Dispose(); throw t } }; this.Dispose = function () { if (q != m.Running) { return } try { r() } finally { q = m.After } } }; var c = function () { var o = null; this.Current = function () { return o }; this.Yield = function (p) { o = p; return true } }; var l = function (q, o, r, p) { this.source = q; this.keySelector = i.CreateLambda(o); this.descending = r; this.parent = p }; l.prototype = new b(); l.prototype.CreateOrderedEnumerable = function (o, p) { return new l(this.source, o, p, this) }; l.prototype.ThenBy = function (o) { return this.CreateOrderedEnumerable(o, false) }; l.prototype.ThenByDescending = function (o) { return this.CreateOrderedEnumerable(o, true) }; l.prototype.GetEnumerator = function () { var p = this; var o; var r; var q = 0; return new f(function () { o = []; r = []; p.source.ForEach(function (u, t) { o.push(u); r.push(t) }); var s = a.Create(p, null); s.GenerateKeys(o); r.sort(function (u, t) { return s.Compare(u, t) }) }, function () { return (q < r.length) ? this.Yield(o[r[q++]]) : false }, h.Blank) }; var a = function (o, p, q) { this.keySelector = o; this.descending = p; this.child = q; this.keys = null }; a.Create = function (q, o) { var p = new a(q.keySelector, q.descending, o); if (q.parent != null) { return a.Create(q.parent, p) } return p }; a.prototype.GenerateKeys = function (s) { var o = s.length; var q = this.keySelector; var r = new Array(o); for (var p = 0; p < o; p++) { r[p] = q(s[p]) } this.keys = r; if (this.child != null) { this.child.GenerateKeys(s) } }; a.prototype.Compare = function (q, p) { var o = i.Compare(this.keys[q], this.keys[p]); if (o == 0) { if (this.child != null) { return this.child.Compare(q, p) } o = i.Compare(q, p) } return (this.descending) ? -o : o }; var d = function (o) { this.source = o }; d.prototype = new b(); d.prototype.Any = function (o) { return (o == null) ? (this.source.length > 0) : b.prototype.Any.apply(this, arguments) }; d.prototype.Count = function (o) { return (o == null) ? this.source.length : b.prototype.Count.apply(this, arguments) }; d.prototype.ElementAt = function (o) { return (0 <= o && o < this.source.length) ? this.source[o] : b.prototype.ElementAt.apply(this, arguments) }; d.prototype.ElementAtOrDefault = function (p, o) { return (0 <= p && p < this.source.length) ? this.source[p] : o }; d.prototype.First = function (o) { return (o == null && this.source.length > 0) ? this.source[0] : b.prototype.First.apply(this, arguments) }; d.prototype.FirstOrDefault = function (p, o) { if (o != null) { return b.prototype.FirstOrDefault.apply(this, arguments) } return this.source.length > 0 ? this.source[0] : p }; d.prototype.Last = function (o) { return (o == null && this.source.length > 0) ? this.source[this.source.length - 1] : b.prototype.Last.apply(this, arguments) }; d.prototype.LastOrDefault = function (p, o) { if (o != null) { return b.prototype.LastOrDefault.apply(this, arguments) } return this.source.length > 0 ? this.source[this.source.length - 1] : p }; d.prototype.Skip = function (o) { var p = this.source; return new b(function () { var q; return new f(function () { q = (o < 0) ? 0 : o }, function () { return (q < p.length) ? this.Yield(p[q++]) : false }, h.Blank) }) }; d.prototype.TakeExceptLast = function (o) { if (o == null) { o = 1 } return this.Take(this.source.length - o) }; d.prototype.TakeFromLast = function (o) { return this.Skip(this.source.length - o) }; d.prototype.Reverse = function () { var o = this.source; return new b(function () { var p; return new f(function () { p = o.length }, function () { return (p > 0) ? this.Yield(o[--p]) : false }, h.Blank) }) }; d.prototype.SequenceEqual = function (p, o) { if ((p instanceof d || p instanceof Array) && o == null && b.From(p).Count() != this.Count()) { return false } return b.prototype.SequenceEqual.apply(this, arguments) }; d.prototype.ToString = function (p, o) { if (o != null || !(this.source instanceof Array)) { return b.prototype.ToString.apply(this, arguments) } if (p == null) { p = "" } return this.source.join(p) }; d.prototype.GetEnumerator = function () { var p = this.source; var o = 0; return new f(h.Blank, function () { return (o < p.length) ? this.Yield(p[o++]) : false }, h.Blank) }; var k = (function () { var s = function (u, t) { return Object.prototype.hasOwnProperty.call(u, t) }; var r = function (t) { if (t === null) { return "null" } if (t === undefined) { return "undefined" } return (typeof t.toString === e.Function) ? t.toString() : Object.prototype.toString.call(t) }; var p = function (t, u) { this.Key = t; this.Value = u; this.Prev = null; this.Next = null }; var q = function () { this.First = null; this.Last = null }; q.prototype = { AddLast: function (t) { if (this.Last != null) { this.Last.Next = t; t.Prev = this.Last; this.Last = t } else { this.First = this.Last = t } }, Replace: function (t, u) { if (t.Prev != null) { t.Prev.Next = u; u.Prev = t.Prev } else { this.First = u } if (t.Next != null) { t.Next.Prev = u; u.Next = t.Next } else { this.Last = u } }, Remove: function (t) { if (t.Prev != null) { t.Prev.Next = t.Next } else { this.First = t.Next } if (t.Next != null) { t.Next.Prev = t.Prev } else { this.Last = t.Prev } } }; var o = function (t) { this.count = 0; this.entryList = new q(); this.buckets = {}; this.compareSelector = (t == null) ? h.Identity : t }; o.prototype = { Add: function (u, x) { var v = this.compareSelector(u); var y = r(v); var w = new p(u, x); if (s(this.buckets, y)) { var z = this.buckets[y]; for (var t = 0; t < z.length; t++) { if (this.compareSelector(z[t].Key) === v) { this.entryList.Replace(z[t], w); z[t] = w; return } } z.push(w) } else { this.buckets[y] = [w] } this.count++; this.entryList.AddLast(w) }, Get: function (u) { var v = this.compareSelector(u); var x = r(v); if (!s(this.buckets, x)) { return undefined } var y = this.buckets[x]; for (var t = 0; t < y.length; t++) { var w = y[t]; if (this.compareSelector(w.Key) === v) { return w.Value } } return undefined }, Set: function (u, x) { var v = this.compareSelector(u); var y = r(v); if (s(this.buckets, y)) { var z = this.buckets[y]; for (var t = 0; t < z.length; t++) { if (this.compareSelector(z[t].Key) === v) { var w = new p(u, x); this.entryList.Replace(z[t], w); z[t] = w; return true } } } return false }, Contains: function (u) { var v = this.compareSelector(u); var w = r(v); if (!s(this.buckets, w)) { return false } var x = this.buckets[w]; for (var t = 0; t < x.length; t++) { if (this.compareSelector(x[t].Key) === v) { return true } } return false }, Clear: function () { this.count = 0; this.buckets = {}; this.entryList = new q() }, Remove: function (u) { var v = this.compareSelector(u); var w = r(v); if (!s(this.buckets, w)) { return } var x = this.buckets[w]; for (var t = 0; t < x.length; t++) { if (this.compareSelector(x[t].Key) === v) { this.entryList.Remove(x[t]); x.splice(t, 1); if (x.length == 0) { delete this.buckets[w] } this.count--; return } } }, Count: function () { return this.count }, ToEnumerable: function () { var t = this; return new b(function () { var u; return new f(function () { u = t.entryList.First }, function () { if (u != null) { var v = { Key: u.Key, Value: u.Value }; u = u.Next; return this.Yield(v) } return false }, h.Blank) }) } }; return o })(); var g = function (o) { this.Count = function () { return o.Count() }; this.Get = function (p) { return b.From(o.Get(p)) }; this.Contains = function (p) { return o.Contains(p) }; this.ToEnumerable = function () { return o.ToEnumerable().Select(function (p) { return new n(p.Key, p.Value) }) } }; var n = function (o, p) { this.Key = function () { return o }; d.call(this, p) }; n.prototype = new d(); return b })(window);
