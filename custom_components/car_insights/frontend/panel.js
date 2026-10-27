// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = "/api/car_insights/ui/", u, d = (e) => u = e, f = () => Object.keys(u?.states ?? {}).some((e) => e.startsWith("zone.") && e !== "zone.home"), p = (e, t) => u ? u.fetchWithAuth(e, t) : fetch(e, t);
async function m(e, t, n) {
	let r = await p(l + t, {
		method: e,
		headers: n === void 0 ? {} : { "Content-Type": "application/json" },
		body: n === void 0 ? void 0 : JSON.stringify(n)
	});
	if (!r.ok) {
		let e = Error(String(r.status));
		e.status = r.status;
		try {
			let t = (await r.json()).detail;
			typeof t == "string" && (e.detail = t);
		} catch {}
		throw e;
	}
	return r.status === 204 ? null : r.json();
}
var h = (e) => m("GET", e);
function g() {
	let e = { current: !1 }, t = () => e.current = !1;
	return {
		next: () => (t(), e = { current: !0 }),
		reset: t
	};
}
// node_modules/svelte/src/internal/shared/utils.js
var _ = Array.isArray, v = Array.prototype.indexOf, y = Array.prototype.includes, b = Array.from, x = Object.defineProperty, S = Object.getOwnPropertyDescriptor, C = Object.getOwnPropertyDescriptors, ee = Object.prototype, te = Array.prototype, w = Object.getPrototypeOf, T = Object.isExtensible;
function E(e) {
	return typeof e == "function";
}
var D = () => {};
function ne(e) {
	return typeof e?.then == "function";
}
function O(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function k() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function re(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
// node_modules/svelte/src/internal/client/constants.js
var A = 1 << 24, j = 1024, ie = 2048, M = 4096, N = 8192, P = 16384, F = 32768, ae = 1 << 25, oe = 65536, se = 1 << 19, ce = 1 << 20, le = 1 << 25, ue = 1 << 21, de = 1 << 22, fe = 1 << 23, pe = Symbol("$state"), me = Symbol("component"), he = Symbol("legacy props"), ge = Symbol(""), _e = Symbol("attributes"), ve = Symbol("class"), ye = Symbol("style"), be = Symbol("text"), xe = Symbol("form reset"), Se = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Ce = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), we = {}, I = Symbol("uninitialized"), Te = "http://www.w3.org/1999/xhtml", Ee = "http://www.w3.org/2000/svg", De = "http://www.w3.org/1998/Math/MathML";
function Oe() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function ke(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ae() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function je() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/svelte/src/internal/client/dom/hydration.js
var R = !1;
function Me(e) {
	R = e;
}
var z;
function Ne(e) {
	if (e === null) throw ke(), we;
	return z = e;
}
function Pe() {
	return Ne(/* @__PURE__ */ _n(z));
}
function B(e) {
	if (R) {
		if (/* @__PURE__ */ _n(z) !== null) throw ke(), we;
		z = e;
	}
}
function Fe(e = 1) {
	if (R) {
		for (var t = e, n = z; t--;) n = /* @__PURE__ */ _n(n);
		z = n;
	}
}
function Ie(e = !0) {
	for (var t = 0, n = z;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ _n(n);
		e && n.remove(), n = i;
	}
}
function Le(e) {
	if (!e || e.nodeType !== 8) throw ke(), we;
	return e.data;
}
// node_modules/svelte/src/internal/client/reactivity/equality.js
function Re(e) {
	return e === this.v;
}
function ze(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Be(e) {
	return !ze(e, this.v);
}
function Ve(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
// node_modules/svelte/src/internal/client/errors.js
function He() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ue(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function We(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ge() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ke(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function qe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Je(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function V() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ye() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Xe() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ze() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/svelte/src/internal/client/context.js
var Qe = null;
function $e(e) {
	Qe = e;
}
function et(e, t = !1, n) {
	Qe = {
		p: Qe,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: nr,
		l: null
	};
}
function tt(e) {
	var t = Qe, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) jn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Qe = t.p, nt(e);
}
function nt(e = {}) {
	return x(e, me, { value: !0 }), e;
}
function rt() {
	return !0;
}
// node_modules/svelte/src/internal/client/dom/task.js
var it = [];
function at() {
	var e = it;
	it = [], O(e);
}
function ot(e) {
	if (it.length === 0 && !Pt) {
		var t = it;
		queueMicrotask(() => {
			t === it && at();
		});
	}
	it.push(e);
}
function st() {
	for (; it.length > 0;) at();
}
// node_modules/svelte/src/internal/client/reactivity/status.js
var ct = ~(ie | M | j);
function lt(e, t) {
	e.f = e.f & ct | t;
}
function ut(e) {
	e.f & 512 || e.deps === null ? lt(e, j) : lt(e, M);
}
// node_modules/svelte/src/internal/client/reactivity/utils.js
function dt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), lt(e, j);
}
// node_modules/svelte/src/internal/client/dom/elements/misc.js
var ft = !1;
function pt() {
	ft || (ft = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[xe]?.();
		});
	}, { capture: !0 }));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function mt(e) {
	var t = $n, n = nr;
	tr(null), rr(null);
	try {
		return e();
	} finally {
		tr(t), rr(n);
	}
}
function ht(e, t, n, r = n) {
	e.addEventListener(t, () => mt(n));
	let i = e[xe];
	e[xe] = i ? () => {
		i(), r(!0);
	} : () => r(!0), pt();
}
// node_modules/svelte/src/internal/client/reactivity/async.js
function gt(e, t, n, r) {
	let i = rt() ? bt : Ct;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = nr, c = _t(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				wn(e, s);
			}
			vt();
		}
	}
	var d = yt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ St(e))).then(u).catch((e) => wn(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), vt());
	}) : f();
}
function _t() {
	var e = nr, t = $n, n = Qe, r = At;
	return function(i = !0) {
		rr(e), tr(t), $e(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function vt(e = !0) {
	rr(null), tr(null), $e(null), e && At?.deactivate();
}
function yt() {
	var e = nr, t = e.b, n = At, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function bt(e) {
	var t = 2 | ie;
	return nr !== null && (nr.f |= se), {
		ctx: Qe,
		deps: null,
		effects: null,
		equals: Re,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: I,
		wv: 0,
		parent: nr,
		ac: null
	};
}
var xt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function St(e, t, n) {
	let r = nr;
	r === null && He();
	var i = void 0, a = Zt(I), o = !$n, s = /* @__PURE__ */ new Set();
	return Pn(() => {
		var t = nr, n = k();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== Se && n.reject(e);
			}).finally(vt);
		} catch (e) {
			n.reject(e), vt();
		}
		var c = At;
		if (o) {
			if (t.f & 32768) var l = yt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(xt);
			else for (let e of s.values()) e.reject(xt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== xt && (c.activate(), t ? (a.f |= fe, tn(a, t)) : (a.f & 8388608 && (a.f ^= fe), tn(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), kn(() => {
		for (let e of s) e.reject(xt);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function H(e) {
	let t = /* @__PURE__ */ bt(e);
	return ar(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Ct(e) {
	let t = /* @__PURE__ */ bt(e);
	return t.equals = Be, t;
}
function wt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Hn(t[n]);
	}
}
function Tt(e) {
	var t, n = nr, r = e.parent;
	if (!Zn && r !== null && e.v !== I && r.f & 24576) return Oe(), e.v;
	rr(r);
	try {
		wt(e), t = _r(e);
	} finally {
		rr(n);
	}
	return t;
}
function Et(e) {
	var t = Tt(e);
	!e.equals(t) && (e.wv = mr(), (!At?.is_fork || e.deps === null) && (At === null ? e.v = t : (At.capture(e, t, !0), jt?.capture(e, t, !0)), e.deps === null)) ? lt(e, j) : Zn || (Mt === null ? ut(e) : (On() || At?.is_fork) && Mt.set(e, t));
}
function Dt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && mt(() => {
		t.ac.abort(Se), t.ac = null;
	}), t.fn !== null && (t.teardown = D), br(t, 0), Bn(t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && xr(t);
}
// node_modules/svelte/src/internal/client/reactivity/batch.js
var kt = null, At = null, jt = null, Mt = null, Nt = null, Pt = !1, Ft = !1, It = null, Lt = null, Rt = 0, zt = 1, Bt = class e {
	id = zt++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		kt === null ? kt = this : (kt.#n = this, this.#t = kt), kt = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) lt(r, ie), t(r);
			for (r of n.m) lt(r, M), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		var e = [];
		for (let i of this.#c) if (!(i.f & 16384 || !(i.f & 6144))) {
			for (var t = i, n = !1; t.parent !== null;) {
				t = t.parent;
				var r = t.f;
				if (r & 96) {
					if (!(r & 1024)) {
						n = !0;
						break;
					}
					t.f ^= j;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), lt(e, ie), this.schedule(e);
		for (let e of this.#d) lt(e, M), this.schedule(e);
		this.apply();
		for (var t = It = [], n = [], r = Lt = []; this.#c.length > 0;) {
			Rt++ > 1e3 && (this.#S(), Ht());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw qt(e), this.#h() || this.discard(), t;
			}
		}
		if (At = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (It = null, Lt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) Kt(e, t);
			r.length > 0 && At.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), jt = this, Wt(n), Wt(t), jt = null, this.#s?.resolve();
			var o = At;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (Yt.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= j;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= j : i & 4 ? t.push(r) : hr(r) && (i & 16 && this.#d.add(r), xr(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#y() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#b(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), lt(i, ie), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), At = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) dt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== I && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Mt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		At = this;
	}
	deactivate() {
		At = null, Mt = null;
	}
	flush() {
		try {
			Ft = !0, At = this, this.#_();
		} finally {
			Rt = 0, Nt = null, It = null, Lt = null, Ft = !1, At = null, Mt = null, Yt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(xt);
		this.#S(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, ot(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= k()).promise;
	}
	static ensure() {
		if (At === null) {
			let t = At = new e();
			!Ft && !Pt && ot(() => {
				t.#e || t.flush();
			});
		}
		return At;
	}
	apply() {
		Mt = null;
	}
	schedule(e) {
		Nt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? kt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Vt(e) {
	var t = Pt, n = jt;
	jt = null, Pt = !0;
	try {
		var r;
		for (e && (Vt(), r = e());;) {
			if (st(), At === null) return r;
			At.flush();
		}
	} finally {
		Pt = t, jt = n;
	}
}
function Ht() {
	try {
		qe();
	} catch (e) {
		wn(e, Nt);
	}
}
var Ut = null;
function Wt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && hr(r) && (Ut = /* @__PURE__ */ new Set(), xr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Wn(r), Ut?.size > 0)) {
				Yt.clear();
				for (let e of Ut) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ut.has(n) && (Ut.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || xr(n);
					}
				}
				Ut.clear();
			}
		}
		Ut = null;
	}
}
function Gt(e) {
	At.schedule(e);
}
function Kt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), lt(e, j);
		for (var n = e.first; n !== null;) Kt(n, t), n = n.next;
	}
}
function qt(e) {
	lt(e, j);
	for (var t = e.first; t !== null;) qt(t), t = t.next;
}
// node_modules/svelte/src/internal/client/reactivity/sources.js
var Jt = /* @__PURE__ */ new Set(), Yt = /* @__PURE__ */ new Map(), Xt = !1;
function Zt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Re,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function U(e, t) {
	let n = Zt(e, t);
	return ar(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Qt(e, t = !1, n = !0) {
	let r = Zt(e);
	return t || (r.equals = Be), r;
}
function W(e, t, n = !1) {
	return $n !== null && (!er || $n.f & 131072) && rt() && $n.f & 4325394 && (ir === null || !ir.has(e)) && Xe(), tn(e, n ? sn(t) : t, Lt);
}
var $t = null, en = 0;
function tn(e, t, n = null) {
	if (!e.equals(t)) {
		Zn ? Yt.set(e, t) : Yt.has(e) || Yt.set(e, e.v);
		var r = Bt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Tt(t), Mt === null && ut(t);
		}
		e.wv = mr(), $t = null, en = 0, on(e, ie, n), $t = null, rt() && nr !== null && nr.f & 1024 && !(nr.f & 96) && (cr === null ? lr([e]) : cr.push(e)), !r.is_fork && Jt.size > 0 && !Xt && nn();
	}
	return t;
}
function nn() {
	Xt = !1;
	for (let e of Jt) {
		e.f & 1024 && lt(e, M);
		let t;
		try {
			t = hr(e);
		} catch {
			t = !0;
		}
		t && xr(e);
	}
	Jt.clear();
}
function rn(e, t = 1) {
	var n = Y(e), r = t === 1 ? n++ : n--;
	return W(e, n), r;
}
function an(e) {
	W(e, e.v + 1);
}
function on(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = rt(), a = r.length;
		if (en += a, en > 1e5 && $t === null && ($t = /* @__PURE__ */ new Set()), $t !== null) {
			if ($t.has(e)) return;
			$t.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== nr) {
				var l = (c & ie) === 0;
				if (l && lt(s, t), c & 131072) Jt.add(s);
				else if (c & 2) {
					var u = s;
					Mt?.delete(u), on(u, M, n);
				} else if (l) {
					var d = s;
					c & 16 && Ut !== null && Ut.add(d), n === null ? Gt(d) : n.push(d);
				}
			}
		}
	}
}
function sn(e) {
	if (typeof e != "object" || !e || pe in e || me in e) return e;
	let t = w(e);
	if (t !== ee && t !== te) return e;
	var n = /* @__PURE__ */ new Map(), r = _(e), i = /* @__PURE__ */ U(0), a = null, o = fr, s = (e) => {
		if (fr === o) return e();
		var t = $n, n = fr;
		tr(null), pr(o);
		var r = e();
		return tr(t), pr(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ U(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			"value" in r && r.configurable !== !1 && r.enumerable !== !1 && r.writable !== !1 || V();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ U(r.value, a);
				return n.set(t, e), e;
			}) : W(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ U(I, a));
					n.set(t, e), an(i);
				}
			} else W(r, I), an(i);
			return !0;
		},
		get(t, r, i) {
			if (r === pe) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || S(t, r)?.writable) && (o = s(() => /* @__PURE__ */ U(sn(c ? t[r] : I), a)), n.set(r, o)), o !== void 0) {
				var l = Y(o);
				return l === I ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = Y(i);
				if (a === I) return;
				if (r && "value" in r) r.value = a;
				else return {
					enumerable: !0,
					configurable: !0,
					value: a,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === pe) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== I || Reflect.has(e, t);
			return (r !== void 0 || nr !== null && (!i || S(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ U(i ? sn(e[t]) : I, a)), n.set(t, r)), Y(r) === I) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ U(I, a)), n.set(d + "", f)) : W(f, I);
			}
			if (l === void 0) (!u || S(e, t)?.writable) && (l = s(() => /* @__PURE__ */ U(void 0, a)), W(l, sn(o)), n.set(t, l));
			else {
				u = l.v !== I;
				var p = s(() => sn(o));
				W(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var h = n.get("length"), g = Number(t);
					Number.isInteger(g) && g >= h.v && W(h, g + 1);
				}
				an(i);
			}
			return !0;
		},
		ownKeys(e) {
			Y(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== I;
			});
			for (var [r, a] of n) a.v !== I && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Ye();
		}
	});
}
function cn(e) {
	try {
		if (typeof e == "object" && e && pe in e) return e[pe];
	} catch {}
	return e;
}
function ln(e, t) {
	return Object.is(cn(e), cn(t));
}
var un, dn, fn, pn;
function mn() {
	if (un === void 0) {
		un = window, dn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		fn = S(t, "firstChild").get, pn = S(t, "nextSibling").get, T(e) && (e[ve] = void 0, e[_e] = null, e[ye] = void 0, e.__e = void 0), T(n) && (n[be] = void 0);
	}
}
function hn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function gn(e) {
	return fn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function _n(e) {
	return pn.call(e);
}
function G(e, t) {
	if (!R) return /* @__PURE__ */ gn(e);
	var n = /* @__PURE__ */ gn(z);
	if (n === null) n = z.appendChild(hn());
	else if (t && n.nodeType !== 3) {
		var r = hn();
		return n?.before(r), Ne(r), r;
	}
	return t && Sn(n), Ne(n), n;
}
function vn(e, t = !1) {
	if (!R) {
		var n = /* @__PURE__ */ gn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ _n(n) : n;
	}
	if (t) {
		if (z?.nodeType !== 3) {
			var r = hn();
			return z?.before(r), Ne(r), r;
		}
		Sn(z);
	}
	return z;
}
function K(e, t = !1) {
	if (!R) return /* @__PURE__ */ gn(e);
	var n = G(e, t);
	return B(e), n;
}
function q(e, t = 1, n = !1) {
	let r = R ? z : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ _n(r);
	if (!R) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = hn();
			return r === null ? i?.after(a) : r.before(a), Ne(a), a;
		}
		Sn(r);
	}
	return Ne(r), r;
}
function yn(e) {
	e.textContent = "";
}
function bn() {
	return !1;
}
function xn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Sn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Cn(e) {
	var t = nr;
	if (t === null) return $n.f |= fe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	wn(e, t);
}
function wn(e, t) {
	if (e === we) throw e;
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
// node_modules/svelte/src/internal/client/reactivity/effects.js
function Tn(e) {
	nr === null && ($n === null && Ke(e), Ge()), Zn && We(e);
}
function En(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Dn(e, t) {
	var n = nr;
	n !== null && n.f & 8192 && (e |= N);
	var r = {
		ctx: Qe,
		deps: null,
		nodes: null,
		f: e | ie | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	At?.register_created_effect(r);
	var i = r;
	if (e & 4) It === null ? Bt.ensure().schedule(r) : It.push(r);
	else if (t !== null) {
		try {
			xr(r);
		} catch (e) {
			throw Hn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= oe));
	}
	if (i !== null && (i.parent = n, n !== null && En(i, n), $n !== null && $n.f & 2 && !(e & 64))) {
		var a = $n;
		(a.effects ??= []).push(i);
	}
	return r;
}
function On() {
	return $n !== null && !er;
}
function kn(e) {
	let t = Dn(8, null);
	return lt(t, j), t.teardown = e, t;
}
function An(e) {
	Tn("$effect");
	var t = nr.f;
	if (!$n && t & 32 && Qe !== null && !Qe.i) {
		var n = Qe;
		(n.e ??= []).push(e);
	} else return jn(e);
}
function jn(e) {
	return Dn(4 | ce, e);
}
function Mn(e) {
	Bt.ensure();
	let t = Dn(64 | se, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Gn(t, () => {
			Hn(t), n(void 0);
		}) : (Hn(t), n(void 0));
	});
}
function Nn(e) {
	return Dn(4, e);
}
function Pn(e) {
	return Dn(de | se, e);
}
function Fn(e, t = 0) {
	return Dn(8 | t, e);
}
function J(e, t = [], n = [], r = []) {
	gt(r, t, n, (t) => {
		Dn(8, () => {
			e(...t.map(Y));
		});
	});
}
function In(e, t = 0) {
	return Dn(16 | t, e);
}
function Ln(e, t = 0) {
	return Dn(A | t, e);
}
function Rn(e) {
	return Dn(32 | se, e);
}
function zn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Zn, r = $n;
		Qn(!0), tr(null);
		try {
			t.call(null);
		} catch (t) {
			wn(t, e.parent);
		} finally {
			Qn(n), tr(r);
		}
	}
}
function Bn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && mt(() => {
			e.abort(Se);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Hn(n, t), n = r;
	}
}
function Vn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Hn(t), t = n;
	}
}
function Hn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Un(e.nodes.start, e.nodes.end), n = !0), e.f |= ae, Bn(e, t && !n), br(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	zn(e), e.f ^= ae, e.f |= P;
	var i = e.parent;
	i !== null && i.first !== null && Wn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Un(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ _n(e);
		e.remove(), e = n;
	}
}
function Wn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Gn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Kn(e, r, !0);
	var i = () => {
		n && Hn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Kn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= N;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Kn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function qn(e) {
	e.f &= -257, Jn(e, !0);
}
function Jn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= N, e.f & 1024 || (lt(e, ie), Bt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Jn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Yn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ _n(n);
		t.append(n), n = i;
	}
}
// node_modules/svelte/src/internal/client/legacy.js
var Xn = null, Zn = !1;
function Qn(e) {
	Zn = e;
}
var $n = null, er = !1;
function tr(e) {
	$n = e;
}
var nr = null;
function rr(e) {
	nr = e;
}
var ir = null;
function ar(e) {
	$n !== null && ($n.f & 2097152 || $n.f & 2) && (ir ??= /* @__PURE__ */ new Set()).add(e);
}
var or = null, sr = 0, cr = null;
function lr(e) {
	cr = e;
}
var ur = 1, dr = 0, fr = dr;
function pr(e) {
	fr = e;
}
function mr() {
	return ++ur;
}
function hr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (hr(a) && Et(a), a.wv > e.wv) return !0;
		}
		t & 512 && Mt === null && lt(e, j);
	}
	return !1;
}
function gr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(ir !== null && ir.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? gr(a, t, !1) : t === a && (n ? lt(a, ie) : a.f & 1024 && lt(a, M), Gt(a));
	}
}
function _r(e) {
	var t = or, n = sr, r = cr, i = $n, a = ir, o = Qe, s = er, c = fr, l = e.f;
	or = null, sr = 0, cr = null, $n = l & 96 ? null : e, ir = null, $e(e.ctx), er = !1, fr = ++dr, e.ac !== null && (mt(() => {
		e.ac.abort(Se);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= F;
		var f = vr(e);
		if (rt() && cr !== null && !er && f !== null && !(e.f & 6146)) for (var p = 0; p < cr.length; p++) gr(cr[p], e);
		if (i !== null && i !== e) {
			if (dr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = dr;
			if (t !== null) for (let e of t) e.rv = dr;
			cr !== null && (r === null ? r = cr : r.push(...cr));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (t) {
		return vr(e), Cn(t);
	} finally {
		e.f ^= ue, or = t, sr = n, cr = r, $n = i, ir = a, $e(o), er = s, fr = c;
	}
}
function vr(e) {
	var t = e.deps, n = At?.is_fork;
	if (or !== null) {
		var r;
		if (n || br(e, sr), t !== null && sr > 0) for (t.length = sr + or.length, r = 0; r < or.length; r++) t[sr + r] = or[r];
		else e.deps = t = or;
		if (On() && e.f & 512) for (r = sr; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && sr < t.length && (br(e, sr), t.length = sr);
	return t;
}
function yr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = v.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (or === null || !y.call(or, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== I && ut(a), a.ac !== null && mt(() => {
			a.ac.abort(Se), a.ac = null, lt(a, ie);
		}), Dt(a), br(a, 0);
	}
}
function br(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) yr(e, n[r]);
}
function xr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		lt(e, j);
		var n = nr;
		nr = e;
		try {
			t & 16777232 ? Vn(e) : Bn(e), zn(e);
			var r = _r(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = ur;
		} finally {
			nr = n;
		}
	}
}
async function Sr() {
	await Promise.resolve(), Vt();
}
function Y(e) {
	var t = !!(e.f & 2);
	if (Xn?.add(e), $n !== null && !er && !(nr !== null && nr.f & 16384) && (ir === null || !ir.has(e))) {
		var n = $n.deps;
		if ($n.f & 2097152) e.rv < dr && (e.rv = dr, or === null && n !== null && n[sr] === e ? sr++ : or === null ? or = [e] : or.push(e));
		else {
			$n.deps ??= [], y.call($n.deps, e) || $n.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [$n] : y.call(r, $n) || r.push($n);
		}
	}
	if (Zn && Yt.has(e)) return Yt.get(e);
	if (t) {
		var i = e;
		if (Zn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || wr(i)) && (a = Tt(i)), Yt.set(i, a), a;
		}
		var o = !(i.f & 512) && !er && $n !== null && !!($n.f & 512), s = (i.f & F) === 0;
		hr(i) && (o && (i.f |= 512), Et(i)), o && !s && (Ot(i), Cr(i));
	}
	if (Mt?.has(e)) return Mt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Cr(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : y.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (Ot(n), Cr(n));
	}
}
function wr(e) {
	if (e.v === I) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Yt.has(t) || t.f & 2 && wr(t)) return !0;
	return !1;
}
function Tr(e) {
	var t = er;
	try {
		return er = !0, e();
	} finally {
		er = t;
	}
}
function Er(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (pe in e) Dr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && pe in n && Dr(n);
		}
	}
}
function Dr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Dr(e[n], t);
		} catch {}
		let n = w(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = C(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Or = ["touchstart", "touchmove"];
function kr(e) {
	return Or.includes(e);
}
// node_modules/svelte/src/internal/client/dom/elements/events.js
var Ar = Symbol("events"), jr = /* @__PURE__ */ new Set(), Mr = /* @__PURE__ */ new Set();
function Nr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || zr.call(t, e), !e.cancelBubble) return mt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, ot(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Pr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Nr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && kn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Fr(e, t, n) {
	(t[Ar] ??= {})[e] = n;
}
function Ir(e) {
	for (var t = 0; t < e.length; t++) jr.add(e[t]);
	for (var n of Mr) n(e);
}
var Lr = null, Rr = !1;
function zr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Lr = e, Rr || (Rr = !0, setTimeout(() => {
		Rr = !1, Lr = null;
	}));
	var o = 0, s = Lr === e && e[Ar];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Ar] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		x(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = $n, d = nr;
		tr(null), rr(null);
		try {
			for (var f, p = []; a !== null && a !== t;) {
				try {
					var m = a[Ar]?.[r];
					m == null || a.disabled && e.target !== a || m.call(a, e);
				} catch (e) {
					f ? p.push(e) : f = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (f) {
				for (let e of p) queueMicrotask(() => {
					throw e;
				});
				throw f;
			}
		} finally {
			e[Ar] = t, delete e.currentTarget, tr(u), rr(d);
		}
	}
}
// node_modules/svelte/src/internal/client/dom/reconciler.js
var Br = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Vr(e) {
	return Br?.createHTML(e) ?? e;
}
function Hr(e) {
	var t = xn("template");
	return t.innerHTML = Vr(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/svelte/src/internal/client/dom/template.js
function Ur(e, t) {
	var n = nr;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function X(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (R) return Ur(z, null), z;
		i === void 0 && (i = Hr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ gn(i)));
		var t = r || dn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ gn(t), s = t.lastChild;
			Ur(o, s);
		} else Ur(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Wr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (R) return Ur(z, null), z;
		if (!o) {
			var e = /* @__PURE__ */ gn(Hr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ gn(e);) o.appendChild(/* @__PURE__ */ gn(e));
			else o = /* @__PURE__ */ gn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ gn(t), r = t.lastChild;
			Ur(n, r);
		} else Ur(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Gr(e, t) {
	return /* @__PURE__ */ Wr(e, t, "svg");
}
function Kr(e = "") {
	if (!R) {
		var t = hn(e + "");
		return Ur(t, t), t;
	}
	var n = z;
	return n.nodeType === 3 ? Sn(n) : (n.before(n = hn()), Ne(n)), Ur(n, n), n;
}
function qr() {
	if (R) return Ur(z, null), z;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = hn();
	return e.append(t, n), Ur(t, n), e;
}
function Z(e, t) {
	if (R) {
		var n = nr;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = z), Pe();
	} else e !== null && e.before(t);
}
function Jr() {
	if (R && z && z.nodeType === 8 && z.textContent?.startsWith("$")) {
		let e = z.textContent.substring(1);
		return Pe(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
// node_modules/svelte/src/reactivity/create-subscriber.js
function Yr(e) {
	let t = 0, n = Zt(0), r;
	return () => {
		On() && (Y(n), Fn(() => (t === 0 && (r = Tr(() => e(() => an(n)))), t += 1, () => {
			ot(() => {
				--t, t === 0 && (r?.(), r = void 0, an(n));
			});
		})));
	};
}
// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Xr = oe | se;
function Zr(e, t, n, r) {
	new Qr(e, t, n, r);
}
var Qr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = R ? z : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = Yr(() => (this.#m = Zt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = nr;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = nr.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = In(() => {
			if (R) {
				let e = Le(this.#t);
				Pe();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Xr), R && (this.#e = z);
	}
	#g() {
		try {
			this.#a = Rn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		ot(r), t && (this.#s = Rn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? je() : (t = !0, n && Ze(), this.#s !== null && Gn(this.#s, () => {
				this.#s = null;
			}), this.#C(() => {
				this.#x();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#y()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					wn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (P | ae)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Rn(() => e(this.#e)), ot(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = hn(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return Rn(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							wn(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(At)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Gn(this.#o, () => {
					this.#o = null;
				}), this.#S(At));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Rn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Yn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Rn(() => t(this.#e));
			} else this.#S(At);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		dt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = nr, n = $n, r = Qe;
		rr(this.#i), tr(this.#i), $e(this.#i.ctx);
		try {
			return Bt.ensure(), e();
		} finally {
			rr(t), tr(n), $e(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Gn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, ot(() => {
			this.#d = !1, this.#m && tn(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Y(this.#m);
	}
	error(e) {
		if (e === we || !this.#n.onerror && !this.#n.failed) throw e;
		At?.is_fork ? (this.#a && At.skip_effect(this.#a), this.#o && At.skip_effect(this.#o), this.#s && At.skip_effect(this.#s), At.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (Hn(this.#a), null), this.#o &&= (Hn(this.#o), null), this.#s &&= (Hn(this.#s), null), R && (Ne(this.#t), Fe(), Ne(Ie()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return Rn(() => {
						var r = nr;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return wn(e, this.#i.parent), null;
				}
			}));
		};
		ot(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					wn(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => wn(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
}, $r = !0;
function Q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[be] ??= e.nodeValue) && (e[be] = n, e.nodeValue = `${n}`);
}
function ei(e, t) {
	return ni(e, t);
}
var ti = /* @__PURE__ */ new Map();
function ni(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	mn();
	var c = void 0, l = Mn(() => {
		var l = n ?? t.appendChild(hn());
		Zr(l, { pending: () => {} }, (t) => {
			et({});
			var n = Qe;
			if (a && (n.c = a), i && (r.$$events = i), R && Ur(t, null), $r = o, c = e(t, r) || nt(), $r = !0, R && (nr.nodes.end = z, z === null || z.nodeType !== 8 || z.data !== "]")) throw ke(), we;
			tt();
		}, s);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = kr(r);
					for (let e of [t, document]) {
						var a = ti.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ti.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, zr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(b(jr)), Mr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = ti.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, zr), r.delete(e), r.size === 0 && ti.delete(n)) : r.set(e, i);
			}
			Mr.delete(d), l !== n && l.parentNode?.removeChild(l);
		};
	});
	return ri.set(c, l), c;
}
var ri = /* @__PURE__ */ new WeakMap(), ii = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) qn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (qn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Hn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Yn(r, t), t.append(hn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Hn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Gn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Hn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = At, r = bn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = hn();
				i.append(a), this.#n.set(e, {
					effect: Rn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Rn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else R && (this.anchor = z), this.#a(n);
	}
}, ai = 0, oi = 1, si = 2;
function ci(e, t, n, r, i) {
	R && Pe();
	var a = rt(), o = I, s = a ? Zt(o) : /* @__PURE__ */ Qt(o, !1, !1), c = a ? Zt(o) : /* @__PURE__ */ Qt(o, !1, !1), l = new ii(e);
	In(() => {
		var a = At, o = t(), u = !1;
		let d = R && ne(o) === (e.data === "[!");
		if (d && (Ne(Ie()), Me(!1)), ne(o)) {
			var f = _t(), p = !1;
			let e = (e) => {
				if (!u) {
					p = !0, f(!1), At === a && a.deactivate(), Bt.ensure();
					try {
						e();
					} finally {
						vt(!1), Pt || Vt();
					}
				}
			};
			o.then((t) => {
				e(() => {
					tn(s, t), l.ensure(oi, r && ((e) => r(e, s)));
				});
			}, (t) => {
				e(() => {
					if (tn(c, t), l.ensure(si, i && ((e) => i(e, c))), !i) throw c.v;
				});
			}), R ? l.ensure(ai, n) : ot(() => {
				p || e(() => {
					l.ensure(ai, n);
				});
			});
		} else tn(s, o), l.ensure(oi, r && ((e) => r(e, s)));
		return d && Me(!0), () => {
			u = !0;
		};
	});
}
// node_modules/svelte/src/internal/client/dom/blocks/if.js
function $(e, t, n = !1) {
	var r;
	R && (r = z, Pe());
	var i = new ii(e), a = n ? oe : 0;
	function o(e, t) {
		if (R) {
			var n = Le(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ie();
				Ne(a), i.anchor = a, Me(!1), i.ensure(e, t), Me(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	In(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// node_modules/svelte/src/internal/client/dom/blocks/key.js
var li = Symbol("NaN");
function ui(e, t, n) {
	R && Pe();
	var r = new ii(e), i = !rt();
	In(() => {
		var e = t();
		e !== e && (e = li), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
// node_modules/svelte/src/internal/client/dom/blocks/each.js
function di(e, t) {
	return t;
}
function fi(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Gn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					pi(e, b(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, u = l.parentNode;
			yn(u), u.append(l), e.items.clear();
		}
		pi(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function pi(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= le, Yn(a, document.createDocumentFragment())) : Hn(t[i], n);
	}
}
var mi;
function hi(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var c = e;
		o = R ? Ne(/* @__PURE__ */ gn(c)) : c.appendChild(hn());
	}
	R && Pe();
	var l = null, u = /* @__PURE__ */ Ct(() => {
		var e = n();
		return _(e) ? e : e == null ? [] : b(e);
	}), d = /* @__PURE__ */ new Map(), f = !0;
	function p(e) {
		if (!(h.effect.f & 16384)) {
			h.pending.delete(e);
			var n = Y(u);
			h.fallback = l, _i(h, n, o, t, r), l !== null && (n.length === 0 ? l.f & 33554432 ? (l.f ^= le, yi(l, null, o)) : qn(l) : Gn(l, () => {
				l = null;
			}));
		}
	}
	function m(e) {
		h.pending.delete(e);
	}
	var h = {
		effect: In(() => {
			var e = Y(u), c = e.length;
			let h = !1;
			R && Le(o) === "[!" != (c === 0) && (o = Ie(), Ne(o), Me(!1), h = !0);
			for (var g = /* @__PURE__ */ new Set(), _ = At, v = bn(), y = 0; y < c; y += 1) {
				R && z.nodeType === 8 && z.data === "]" && (o = z, h = !0, Me(!1));
				var b = e[y], x = r(b, y), S = f ? null : s.get(x);
				S ? (S.v && tn(S.v, b), S.i && tn(S.i, y), v && _.unskip_effect(S.e)) : (S = vi(s, f ? o : mi ??= hn(), b, x, y, i, t, n), f || (S.e.f |= le), s.set(x, S)), g.add(x);
			}
			if (c === 0 && a && !l && (f ? l = Rn(() => a(o)) : (l = Rn(() => a(mi ??= hn())), l.f |= le)), c > g.size && Ue("", "", ""), R && c > 0 && Ne(Ie()), !f) {
				if (d.set(_, g), v) {
					for (let [e, t] of s) g.has(e) || _.skip_effect(t.e);
					_.oncommit(p), _.ondiscard(m);
				} else p(_);
			}
			h && Me(!0), Y(u);
		}),
		flags: t,
		items: s,
		pending: d,
		outrogroups: null,
		fallback: l
	};
	f = !1, R && (o = z);
}
function gi(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function _i(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = gi(e.effect.first), l, u = null, d, f = [], p = [], m, h, g, _;
	if (a) for (_ = 0; _ < o; _ += 1) m = t[_], h = i(m, _), g = s.get(h).e, g.f & 33554432 || (g.nodes?.a?.measure(), (d ??= /* @__PURE__ */ new Set()).add(g));
	for (_ = 0; _ < o; _ += 1) {
		if (m = t[_], h = i(m, _), g = s.get(h).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(g), t.done.delete(g);
		if (g.f & 8192 && (qn(g), a && (g.nodes?.a?.unfix(), (d ??= /* @__PURE__ */ new Set()).delete(g))), g.f & 33554432) {
			if (g.f ^= le, g === c) yi(g, null, n);
			else {
				var v = u ? u.next : c;
				g === e.effect.last && (e.effect.last = g.prev), g.prev && (g.prev.next = g.next), g.next && (g.next.prev = g.prev), bi(e, u, g), bi(e, g, v), yi(g, v, n), u = g, f = [], p = [], c = gi(u.next);
				continue;
			}
		}
		if (g !== c) {
			if (l !== void 0 && l.has(g)) {
				if (f.length < p.length) {
					var y = p[0], x;
					u = y.prev;
					var S = f[0], C = f[f.length - 1];
					for (x = 0; x < f.length; x += 1) yi(f[x], y, n);
					for (x = 0; x < p.length; x += 1) l.delete(p[x]);
					bi(e, S.prev, C.next), bi(e, u, S), bi(e, C, y), c = y, u = C, --_, f = [], p = [];
				} else l.delete(g), yi(g, c, n), bi(e, g.prev, g.next), bi(e, g, u === null ? e.effect.first : u.next), bi(e, u, g), u = g;
				continue;
			}
			for (f = [], p = []; c !== null && c !== g;) (l ??= /* @__PURE__ */ new Set()).add(c), p.push(c), c = gi(c.next);
			if (c === null) continue;
		}
		g.f & 33554432 || f.push(g), u = g, c = gi(g.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (pi(e, b(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var ee = [];
		if (l !== void 0) for (g of l) g.f & 8192 || ee.push(g);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && ee.push(c), c = gi(c.next);
		var te = ee.length;
		if (te > 0) {
			var w = r & 4 && o === 0 ? n : null;
			if (a) {
				for (_ = 0; _ < te; _ += 1) ee[_].nodes?.a?.measure();
				for (_ = 0; _ < te; _ += 1) ee[_].nodes?.a?.fix();
			}
			fi(e, ee, w);
		}
	}
	a && ot(() => {
		if (d !== void 0) for (g of d) g.nodes?.a?.apply();
	});
}
function vi(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Zt(n) : /* @__PURE__ */ Qt(n, !1, !1) : null, l = o & 2 ? Zt(i) : null;
	return {
		v: c,
		i: l,
		e: Rn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function yi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ _n(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function bi(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function xi(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		R && (o = Ne(/* @__PURE__ */ gn(c)));
	}
	J(() => {
		var e = nr;
		if (s === (s = t() ?? "")) R && Pe();
		else if (n && !R) e.nodes = null, c.innerHTML = s, s !== "" && Ur(/* @__PURE__ */ gn(c), c.lastChild);
		else if (e.nodes !== null && (Un(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (R) {
				for (var a = z.data, l = Pe(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ _n(l);
				if (l === null) throw ke(), we;
				Ur(z, u), o = Ne(l);
			} else {
				var d = xn(r ? "svg" : i ? "math" : "template", r ? Ee : i ? De : void 0);
				d.innerHTML = s;
				var f = r || i ? d : d.content;
				if (Ur(/* @__PURE__ */ gn(f), f.lastChild), r || i) for (; /* @__PURE__ */ gn(f);) o.before(/* @__PURE__ */ gn(f));
				else o.before(f);
			}
		}
	});
}
// node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function Si(e, t, ...n) {
	var r = new ii(e);
	In(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, oe);
}
// node_modules/svelte/src/internal/client/timing.js
var Ci = () => performance.now(), wi = {
	tick: (e) => requestAnimationFrame(e),
	now: () => Ci(),
	tasks: /* @__PURE__ */ new Set()
};
// node_modules/svelte/src/internal/client/loop.js
function Ti() {
	let e = wi.now();
	wi.tasks.forEach((t) => {
		t.c(e) || (wi.tasks.delete(t), t.f());
	}), wi.tasks.size !== 0 && wi.tick(Ti);
}
function Ei(e) {
	let t;
	return wi.tasks.size === 0 && wi.tick(Ti), {
		promise: new Promise((n) => {
			wi.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			wi.tasks.delete(t);
		}
	};
}
// node_modules/svelte/src/internal/client/dom/elements/transitions.js
function Di(e, t) {
	mt(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function Oi(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function ki(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = Oi(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var Ai = (e) => e;
function ji(e, t, n, r) {
	var i = !!(e & 1), a = !!(e & 2), o = i && a, s = !!(e & 4), c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return mt(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			t.inert = u, i ? (a || f?.abort(), f = Mi(t, m(), p, 1, () => {
				Di(t, "introstart");
			}, () => {
				Di(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			})) : (p?.abort(), p?.reset?.());
		},
		out(e) {
			a ? (t.inert = !0, p = Mi(t, m(), f, 0, () => {
				Di(t, "outrostart");
			}, () => {
				Di(t, "outroend"), e?.();
			})) : (e?.(), l = void 0);
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = nr;
	if ((g.nodes.t ??= []).push(h), i && $r) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || !!(v.f & 32768);
		}
		_ && Nn(() => {
			Tr(() => h.in());
		});
	}
}
function Mi(e, t, n, r, i, a) {
	var o = r === 1, s = !1;
	if (E(t)) {
		var c;
		return ot(() => {
			s || (c = Mi(e, t({ direction: o ? "in" : "out" }), n, r, i, a));
		}), {
			abort: () => {
				s = !0, c?.abort();
			},
			deactivate: () => c?.deactivate(),
			reset: () => c?.reset(),
			t: () => c?.t() ?? 1 - r
		};
	}
	if (n?.deactivate(), !t?.duration && !t?.delay) return i(), a(), {
		abort: D,
		deactivate: D,
		reset: D,
		t: () => r
	};
	let { delay: l = 0, css: u, tick: d, easing: f = Ai } = t;
	var p, m = () => 1 - r;
	return ot(() => {
		if (!s) {
			var c = [];
			if (o && n === void 0 && (d && d(0, 1), u)) {
				var h = ki(u(0, 1));
				c.push(h, h);
			}
			p = e.animate(c, {
				duration: l,
				fill: "forwards"
			}), p.onfinish = () => {
				p.cancel(), i();
				var o = n?.t() ?? 1 - r;
				n?.abort();
				var s = r - o, c = t.duration * Math.abs(s), l = [];
				if (c > 0) {
					var h = !1;
					if (u) for (var g = Math.ceil(c / (1e3 / 60)), _ = 0; _ <= g; _ += 1) {
						var v = o + s * f(_ / g), y = ki(u(v, 1 - v));
						l.push(y), h ||= y.overflow === "hidden";
					}
					h && (e.style.overflow = "hidden"), m = () => {
						var e = p.currentTime;
						return o + s * f(e / c);
					}, d && Ei(() => {
						if (p.playState !== "running") return !1;
						var e = m();
						return d(e, 1 - e), !0;
					});
				}
				p = e.animate(l, {
					duration: c,
					fill: "forwards"
				}), p.onfinish = () => {
					m = () => r, d?.(r, 1 - r), a();
				};
			};
		}
	}), {
		abort: () => {
			s = !0, p && (p.cancel(), p.effect = null, p.onfinish = D);
		},
		deactivate: () => {
			a = D;
		},
		reset: () => {
			r === 0 && d?.(1, 0);
		},
		t: () => m()
	};
}
// node_modules/svelte/src/internal/client/dom/elements/actions.js
function Ni(e, t, n) {
	Nn(() => {
		var r = Tr(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Fn(() => {
				var e = n();
				Er(e), i && ze(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Pi(e, t) {
	var n = void 0, r;
	Ln(() => {
		n !== (n = t()) && (r &&= (Hn(r), null), n && (r = Rn(() => {
			Nn(() => n(e));
		})));
	});
}
// node_modules/svelte/src/internal/shared/attributes.js
var Fi = [..." 	\n\r\f\xA0\v﻿"];
function Ii(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Fi.includes(r[o - 1])) && (s === r.length || Fi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Li(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Ri(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function zi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Ri)), i && c.push(...Object.keys(i).map(Ri));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Ri(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += Li(r)), i && (n += Li(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
// node_modules/svelte/src/internal/client/dom/elements/class.js
function Bi(e, t, n, r, i, a) {
	var o = e[ve];
	if (R || o !== n || o === void 0) {
		var s = Ii(n, r, a);
		R && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ve] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// node_modules/svelte/src/internal/client/dom/elements/style.js
function Vi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Hi(e, t, n, r) {
	var i = e[ye];
	if (R || i !== t) {
		var a = zi(t, r);
		R && a === e.getAttribute("style") || (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ye] = t;
	} else r && (Array.isArray(r) ? (Vi(e, n?.[0], r[0]), Vi(e, n?.[1], r[1], "important")) : Vi(e, n, r));
	return r;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Ui(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Wi(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || _(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var s of e.options) {
			var c = Ji(s);
			Ui(s, r ? i.includes(c) : ln(c, n));
		}
		if (t) {
			if (o !== null) for (s of e.options) {
				var l = o.has(s);
				s.selected !== l && (s.selected = l);
			}
			else e.selectedIndex !== a && (e.selectedIndex = a);
		}
	}
}
function Gi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!_(t)) return Ae();
		for (var r of e.options) r.selected = t.includes(Ji(r));
	} else {
		for (r of e.options) if (ln(Ji(r), t)) {
			r.selected = !0;
			return;
		}
		n && t === void 0 || (e.selectedIndex = -1);
	}
}
function Ki(e) {
	var t = new MutationObserver((t) => {
		t.every(Yi) || ("__defaultValue" in e && Wi(e, !1), "__value" in e && Gi(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), kn(() => {
		t.disconnect();
	});
}
function qi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	ht(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), Ji);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && Ji(o);
		}
		n(a), e.__value = a, At !== null && r.add(At);
	}), Nn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = At;
			if (r.has(o)) return;
		}
		if (Gi(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = Ji(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function Ji(e) {
	return "__value" in e ? e.__value : e.value;
}
function Yi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Xi = Symbol("is custom element"), Zi = Symbol("is html"), Qi = Ce ? "link" : "LINK", $i = Ce ? "progress" : "PROGRESS";
function ea(e) {
	if (R) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					ra(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					ra(e, "checked", null), e.checked = r;
				}
			}
		};
		e[xe] = n, ot(n), pt();
	}
}
function ta(e, t) {
	var n = ia(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === $i) && (e.value = t ?? "");
}
function na(e, t) {
	var n = ia(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function ra(e, t, n, r) {
	var i = ia(e);
	R && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Qi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ge] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && oa(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ia(e) {
	return e[_e] ??= {
		[Xi]: e.nodeName.includes("-"),
		[Zi]: e.namespaceURI === Te
	};
}
var aa = /* @__PURE__ */ new Map();
function oa(e) {
	var t = e.getAttribute("is") || e.nodeName, n = aa.get(t);
	if (n) return n;
	aa.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = C(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = w(i);
	}
	return n;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function sa(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	ht(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = da(e) ? fa(a) : a, n(a), At !== null && r.add(At), await Sr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (R && e.defaultValue !== e.value || Tr(t) == null && e.value) && (n(da(e) ? fa(e.value) : e.value), At !== null && r.add(At)), Fn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = At;
			if (r.has(i)) return;
		}
		da(e) && n === fa(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
var ca = /* @__PURE__ */ new Set();
function la(e, t, n, r, i = r) {
	var a = n.getAttribute("type") === "checkbox", o = e;
	let s = !1;
	if (t !== null) for (var c of t) o = o[c] ??= [];
	o.push(n), ht(n, "change", () => {
		var e = n.__value;
		a && (e = ua(o, e, n.checked)), i(e);
	}, () => i(a ? [] : null)), Fn(() => {
		var e = r();
		R && n.defaultChecked !== n.checked ? s = !0 : a ? (e ||= [], n.checked = e.includes(n.__value)) : n.checked = ln(n.__value, e);
	}), kn(() => {
		var e = o.indexOf(n);
		e !== -1 && o.splice(e, 1);
	}), ca.has(o) || (ca.add(o), ot(() => {
		o.sort((e, t) => e.compareDocumentPosition(t) === 4 ? -1 : 1), ca.delete(o);
	})), ot(() => {
		if (s) {
			var e = a ? ua(o, e, n.checked) : o.find((e) => e.checked)?.__value;
			i(e);
		}
	});
}
function ua(e, t, n) {
	for (var r = /* @__PURE__ */ new Set(), i = 0; i < e.length; i += 1) e[i].checked && r.add(e[i].__value);
	return n || r.delete(t), Array.from(r);
}
function da(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function fa(e) {
	return e === "" ? null : +e;
}
var pa = /* @__PURE__ */ new class e {
	#e = /* @__PURE__ */ new WeakMap();
	#t;
	#n;
	static entries = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.#n = e;
	}
	observe(e, t) {
		var n = this.#e.get(e) || /* @__PURE__ */ new Set();
		return n.add(t), this.#e.set(e, n), this.#r().observe(e, this.#n), () => {
			var n = this.#e.get(e);
			n.delete(t), n.size === 0 && (this.#e.delete(e), this.#t.unobserve(e));
		};
	}
	#r() {
		return this.#t ??= new ResizeObserver((t) => {
			for (var n of t) {
				e.entries.set(n.target, n);
				for (var r of this.#e.get(n.target) || []) r(n);
			}
		});
	}
}({ box: "border-box" });
function ma(e, t, n) {
	var r = pa.observe(e, () => n(e[t]));
	Nn(() => (Tr(() => n(e[t])), r));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ha(e, t) {
	return e === t || e?.[pe] === t;
}
function ga(e = nt(), t, n, r) {
	var i = Qe.r, a = nr;
	return Nn(() => {
		var o, s;
		return Fn(() => {
			o = s, s = r?.() || [], Tr(() => {
				ha(n(...s), e) || (t(e, ...s), o && ha(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ha(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// node_modules/svelte/src/internal/client/reactivity/store.js
var _a = !1;
function va(e) {
	var t = _a;
	try {
		return _a = !1, [e(), _a];
	} finally {
		_a = t;
	}
}
// node_modules/svelte/src/internal/client/reactivity/props.js
var ya = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (E(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			E(i) && (i = i());
			let a = S(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (E(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = S(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === pe || t === he) return !1;
		for (let n of e.props) if (E(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (E(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function ba(...e) {
	return new Proxy({ props: e }, ya);
}
function xa(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ bt(r), Y(l)) : (c && (c = !1, s = o ? Tr(r) : r), s);
	let d;
	if (a) {
		var f = pe in e || he in e;
		d = S(e, t)?.set ?? (f && t in e ? (n) => e[t] = n : void 0);
	}
	var p, m = !1;
	a ? [p, m] = va(() => e[t]) : p = e[t], p === void 0 && r !== void 0 && (p = u(), d && (i && Je(t), d(p)));
	var h = i ? () => {
		var n = e[t];
		return n === void 0 ? u() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return h;
	if (d) {
		var g = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || g || m) && d(t ? h() : e), e) : h();
		});
	}
	var _ = !1, v = (n & 1 ? bt : Ct)(() => (_ = !1, h()));
	a && Y(v);
	var y = nr;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Y(v) : i && a ? sn(e) : e;
			return W(v, n), _ = !0, s !== void 0 && (s = n), e;
		}
		return Zn && _ || y.f & 16384 ? v.v : Y(v);
	});
}
function Sa(e) {
	Qe === null && Ve("onMount"), An(() => {
		let t = Tr(e);
		if (typeof t == "function") return t;
	});
}
// node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
// src/lib/routes.js
var Ca = /* @__PURE__ */ new Set([
	"activity",
	"stats",
	"settings"
]), wa = {
	trips: "trip",
	charges: "charge"
}, Ta = /* @__PURE__ */ new Set(["prices", "cars"]), Ea = {
	page: "activity",
	section: null,
	detail: null,
	redirect: "#/activity"
};
function Da(e) {
	let [, t, n, r, ...i] = e.replace(/^#/, "").split("/");
	if (Ca.has(t) && n === void 0) return {
		page: t,
		section: null,
		detail: null,
		redirect: null
	};
	if (t === "settings" && Ta.has(n) && r === void 0) return {
		page: t,
		section: n,
		detail: null,
		redirect: null
	};
	if (wa[t] && /^\d+$/.test(r) && !i.length) try {
		return {
			page: "activity",
			section: null,
			detail: {
				kind: wa[t],
				vid: decodeURIComponent(n),
				start: Number(r)
			},
			redirect: null
		};
	} catch {}
	return Ea;
}
var Oa = (e, t) => e == null ? "–" : t(e), ka = (e) => Oa(e, (e) => `${(e / 1e3).toFixed(1)} km`), Aa = (e) => Oa(e, (e) => `${(e / 1e3).toFixed(2)} kWh`), ja = (e) => Oa(e, (e) => `${(e / 1e3).toFixed(1)} kW`), Ma = (e) => Oa(e, (e) => `${e.toFixed(1)} %`), Na = (e) => Oa(e, (e) => {
	let t = Math.round(e / 60);
	return t >= 60 ? `${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")} min` : `${t} min`;
});
function Pa({ distance_m: e, net_wh: t, charged_wh: n }) {
	let r = [];
	return e && r.push(`${(e / 1e3).toFixed(e >= 1e4 ? 0 : 1)} km`), t && r.push(`${(t / 1e3).toFixed(1)} kWh used`), n && r.push(`+${(n / 1e3).toFixed(1)} kWh`), r.join(" · ");
}
var Fa = (e) => e == null ? null : e / 1e3, Ia = (e) => Oa(Fa(e), (e) => `${e.toFixed(1)} kWh/100 km`), La = (e, t, n = 0) => Oa(e, (e) => `${e < 0 ? "−" : "+"}${Math.abs(e).toFixed(n)} ${t}`), Ra = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
], za = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
], Ba = (e) => String(e).padStart(2, "0"), Va = 864e5, Ha, Ua, Wa, Ga = () => Wa;
function Ka(e) {
	let t = e || void 0;
	try {
		new Intl.DateTimeFormat([], { timeZone: t });
	} catch {
		t = void 0;
	}
	Wa = t, Ha = new Intl.DateTimeFormat("en-US", {
		timeZone: t,
		hourCycle: "h23",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric"
	}), Ua = new Intl.DateTimeFormat([], {
		timeZone: t,
		hour: "2-digit",
		minute: "2-digit"
	});
}
Ka();
var qa = (e) => Object.fromEntries(Ha.formatToParts(e).map((e) => [e.type, Number(e.value)]));
function Ja(e) {
	if (!Wa) return new Date(e + Va / 2).toISOString().slice(0, 10).split("-").map(Number);
	let { year: t, month: n, day: r } = qa(e);
	return [
		t,
		n,
		r
	];
}
var Ya = (e) => {
	let { year: t, month: n, day: r } = qa(e);
	return `${t}-${Ba(n)}-${Ba(r)}`;
}, Xa = () => Ya(Date.now()), Za = (e) => e == null ? "–" : Ua.format(e), Qa = (e) => Date.parse(`${e}T00:00:00Z`), $a = (e) => {
	let t = new Date(Qa(e));
	return `${Ra[t.getUTCDay()]} ${t.getUTCDate()} ${za[t.getUTCMonth()]}`;
};
function eo(e, t) {
	let n = (Qa(t) - Qa(e)) / Va;
	return n === 0 ? "Today" : n === 1 ? "Yesterday" : $a(e);
}
function to(e, t = Date.now()) {
	if (e == null) return "–";
	let n = Ya(e);
	return n === Ya(t) ? Za(e) : `${$a(n)} ${Za(e)}`;
}
var no = (e) => {
	let t = qa(e);
	return Date.UTC(t.year, t.month - 1, t.day, t.hour % 24, t.minute, t.second) - e;
};
function ro(e) {
	let t = Qa(e), n = t - no(t), r = t - no(n);
	return Ya(r) !== e && Ya(n) === e ? n : r;
}
var io = (e) => ro(new Date(Qa(e) + Va).toISOString().slice(0, 10)), ao = sn({
	wide: !1,
	split: !1,
	reducedMotion: !1
}), oo = matchMedia("(min-width: 768px)"), so = matchMedia("(min-width: 1080px)"), co = matchMedia("(prefers-reduced-motion: reduce)"), lo = () => {
	ao.wide = oo.matches, ao.split = so.matches, ao.reducedMotion = co.matches;
};
oo.addEventListener("change", lo), so.addEventListener("change", lo), co.addEventListener("change", lo), lo();
// node_modules/svelte/src/transition/index.js
var uo = (e) => e;
function fo(e, { delay: t = 0, duration: n = 400, easing: r = uo } = {}) {
	let i = +getComputedStyle(e).opacity;
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e) => `opacity: ${e * i}`
	};
}
// src/lib/motion.js
function po(e, { onFrame: t, onSettle: n, snap: r = {
	distance: .5,
	speed: .5
}, frame: i = requestAnimationFrame, cancel: a = cancelAnimationFrame, now: o = performance.now.bind(performance) }) {
	let s = null, c = 0, l = () => {
		c++, s !== null && a(s), s = null;
	};
	return {
		get running() {
			return s !== null;
		},
		stop: l,
		to(a, u) {
			l(), e.set(a, { velocity: u });
			let d = c, f = 0, p = (a = o()) => {
				s = null;
				let l = e.step(Math.min((a - (f || a - 16)) / 1e3, .05));
				f = a, !l && Math.abs(e.value - e.target) < r.distance && Math.abs(e.velocity) < r.speed && (Object.assign(e, {
					value: e.target,
					velocity: 0
				}), l = !0), t(e.value), d === c && (l ? n?.() : s = i(p));
			};
			s = i(p);
		}
	};
}
var mo = (e) => parseFloat(e) * (e.trim().endsWith("ms") ? 1 : 1e3), ho = (e) => mo(getComputedStyle(document.documentElement).getPropertyValue(e)), go = /* @__PURE__ */ X("<span class=\"pill svelte-mrgi7d\"> </span>"), _o = /* @__PURE__ */ X("<span aria-hidden=\"true\">✓</span>"), vo = /* @__PURE__ */ X("<button role=\"menuitemradio\" tabindex=\"-1\" class=\"svelte-mrgi7d\"><span> </span> <!></button>"), yo = /* @__PURE__ */ X("<div class=\"menu chrome svelte-mrgi7d\" role=\"menu\" aria-label=\"Vehicle\" tabindex=\"-1\"></div>"), bo = /* @__PURE__ */ X("<button class=\"pill press svelte-mrgi7d\" aria-haspopup=\"menu\"><span class=\"label svelte-mrgi7d\"> </span> <svg class=\"icon svelte-mrgi7d\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 9l6 6 6-6\"></path></svg></button> <!>", 1), xo = /* @__PURE__ */ X("<div class=\"root svelte-mrgi7d\"><!></div>");
function So(e, t) {
	et(t, !0);
	let n = xa(t, "value", 15, ""), r = ho("--fade"), i = /* @__PURE__ */ U(!1), a = /* @__PURE__ */ U(void 0), o = /* @__PURE__ */ U(void 0), s = /* @__PURE__ */ U(void 0), c = /* @__PURE__ */ H(() => t.options.find((e) => e.value === n())), l = () => [...Y(s).querySelectorAll("button")];
	async function u() {
		W(i, !0), await Sr(), (Y(s).querySelector("[aria-checked=\"true\"]") ?? l()[0])?.focus();
	}
	function d(e = !0) {
		W(i, !1), e && Y(o)?.focus();
	}
	function f(e) {
		n(e), d();
	}
	function p(e) {
		let t = l(), n = t.indexOf(document.activeElement), r = {
			ArrowDown: (n + 1) % t.length,
			ArrowUp: (n - 1 + t.length) % t.length,
			Home: 0,
			End: t.length - 1
		}[e.key];
		if (r !== void 0) t[r].focus();
		else if (e.key === "Escape") d();
		else if (e.key === "Tab") return d(!1);
		else return;
		e.preventDefault();
	}
	var m = xo();
	Pr("pointerdown", un, (e) => Y(i) && !Y(a).contains(e.target) && d(!1));
	var h = G(m), g = (e) => {
		var t = go(), n = K(t, !0);
		J(() => Q(n, Y(c)?.label ?? "–")), Z(e, t);
	}, _ = (e) => {
		var a = bo(), l = vn(a), m = K(G(l), !0);
		Fe(2), B(l), ga(l, (e) => W(o, e), () => Y(o));
		var h = q(l, 2), g = (e) => {
			var i = yo();
			hi(i, 21, () => t.options, (e) => e.value, (e, t) => {
				var r = vo(), i = G(r), a = K(i, !0), o = q(i, 2), s = (e) => {
					Z(e, _o());
				};
				$(o, (e) => {
					Y(t).value === n() && e(s);
				}), B(r), J(() => {
					ra(r, "aria-checked", Y(t).value === n()), Q(a, Y(t).label);
				}), Fr("click", r, () => f(Y(t).value)), Z(e, r);
			}), B(i), ga(i, (e) => W(s, e), () => Y(s)), Fr("keydown", i, p), ji(3, i, () => fo, () => ({ duration: r })), Z(e, i);
		};
		$(h, (e) => {
			Y(i) && e(g);
		}), J(() => {
			ra(l, "aria-expanded", Y(i)), Q(m, Y(c)?.label ?? "–");
		}), Fr("click", l, () => Y(i) ? d() : u()), Fr("keydown", l, (e) => {
			Y(i) || e.key !== "ArrowDown" && e.key !== "ArrowUp" || (e.preventDefault(), u());
		}), Z(e, a);
	};
	$(h, (e) => {
		t.options.length < 2 ? e(g) : e(_, -1);
	}), B(m), ga(m, (e) => W(a, e), () => Y(a)), Z(e, m), tt();
}
Ir(["click", "keydown"]);
// src/lib/ui/Sidebar.svelte
var Co = /* @__PURE__ */ X("<a class=\"press svelte-1ccclju\"><svg class=\"icon svelte-1ccclju\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"></svg> <span> </span></a>"), wo = /* @__PURE__ */ X("<aside class=\"chrome svelte-1ccclju\"><!> <nav aria-label=\"Main\" class=\"svelte-1ccclju\"></nav></aside>");
function To(e, t) {
	et(t, !0);
	let n = xa(t, "view", 15, ""), r = xa(t, "showPill", 3, !0);
	var i = wo(), a = G(i), o = (e) => {
		So(e, {
			get options() {
				return t.options;
			},
			get value() {
				return n();
			},
			set value(e) {
				n(e);
			}
		});
	};
	$(a, (e) => {
		r() && e(o);
	});
	var s = q(a, 2);
	hi(s, 21, () => t.tabs, (e) => e.page, (e, n) => {
		var r = Co(), i = G(r);
		xi(i, () => Y(n).icon, !0), B(i);
		var a = K(q(i, 2), !0);
		B(r), J(() => {
			ra(r, "href", Y(n).href), ra(r, "aria-current", t.page === Y(n).page ? "page" : void 0), Q(a, Y(n).label);
		}), Z(e, r);
	}), B(s), B(i), Z(e, i), tt();
}
// src/lib/ui/TabBar.svelte
var Eo = /* @__PURE__ */ X("<a class=\"press svelte-31wq8u\"><svg class=\"icon svelte-31wq8u\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"></svg> <span> </span></a>"), Do = /* @__PURE__ */ X("<nav class=\"chrome svelte-31wq8u\" aria-label=\"Main\"></nav>");
function Oo(e, t) {
	var n = Do();
	hi(n, 21, () => t.tabs, (e) => e.page, (e, n) => {
		var r = Eo(), i = G(r);
		xi(i, () => Y(n).icon, !0), B(i);
		var a = K(q(i, 2), !0);
		B(r), J(() => {
			ra(r, "href", Y(n).href), ra(r, "aria-current", t.page === Y(n).page ? "page" : void 0), Q(a, Y(n).label);
		}), Z(e, r);
	}), B(n), Z(e, n);
}
// src/lib/ui/Shell.svelte
var ko = /* @__PURE__ */ X("<header class=\"svelte-gp4acw\"><!></header>"), Ao = /* @__PURE__ */ X("<div><!> <main class=\"svelte-gp4acw\"><!></main> <!></div>");
function jo(e, t) {
	et(t, !0);
	let n = xa(t, "options", 19, () => []), r = xa(t, "view", 15, ""), i = /* @__PURE__ */ H(() => [
		{
			page: "activity",
			href: "#/activity",
			label: "Activity",
			icon: "<path d=\"M3 12h4l3-8 4 16 3-8h4\"/>"
		},
		{
			page: "stats",
			href: "#/stats",
			label: "Statistics",
			icon: "<path d=\"M5 20V10M12 20V4M19 20v-7\"/>"
		},
		...t.isAdmin ? [{
			page: "settings",
			href: "#/settings",
			label: "Settings",
			icon: "<path d=\"M4 7h10M18 7h2M4 17h2M10 17h10\"/><circle cx=\"16\" cy=\"7\" r=\"2\"/><circle cx=\"8\" cy=\"17\" r=\"2\"/>"
		}] : []
	]), a = /* @__PURE__ */ H(() => t.page !== "settings");
	var o = Ao();
	let s;
	var c = G(o), l = (e) => {
		To(e, {
			get tabs() {
				return Y(i);
			},
			get page() {
				return t.page;
			},
			get options() {
				return n();
			},
			get showPill() {
				return Y(a);
			},
			get view() {
				return r();
			},
			set view(e) {
				r(e);
			}
		});
	}, u = (e) => {
		var t = ko();
		So(G(t), {
			get options() {
				return n();
			},
			get value() {
				return r();
			},
			set value(e) {
				r(e);
			}
		}), B(t), Z(e, t);
	};
	$(c, (e) => {
		ao.wide ? e(l) : Y(a) && e(u, 1);
	});
	var d = q(c, 2);
	Si(G(d), () => t.children), B(d);
	var f = q(d, 2), p = (e) => {
		Oo(e, {
			get tabs() {
				return Y(i);
			},
			get page() {
				return t.page;
			}
		});
	};
	$(f, (e) => {
		ao.wide || e(p);
	}), B(o), J(() => s = Bi(o, 1, "shell svelte-gp4acw", null, s, { wide: ao.wide })), Z(e, o), tt();
}
// src/lib/activity.js
var Mo = (e, t) => e === "all" || t.kind === (e === "trips" ? "trip" : "charge"), No = (e) => `#/${e.kind}s/${encodeURIComponent(e.vehicle_id)}/${e.start}`, Po = (e, t) => t === "all" ? e : e.map((e) => ({
	...e,
	items: e.items.filter((e) => Mo(t, e))
})).filter((e) => e.items.length);
function Fo(e, t, n, r, i) {
	let a = Po(e, t).flatMap((e) => e.items), o = a.findIndex((e) => e.kind === n && e.vehicle_id === r && e.start === i);
	return o < 0 ? {
		prev: null,
		next: null
	} : {
		prev: o > 0 ? No(a[o - 1]) : null,
		next: o < a.length - 1 ? No(a[o + 1]) : null
	};
}
var Io = (e, t) => [...t, ...e.filter((e) => !t.some((t) => t.date === e.date))].sort((e, t) => e.date < t.date ? 1 : -1), Lo = ({ detailOpen: e }) => e ? "replace" : "push", Ro = sn({
	view: "",
	filter: "all",
	today: "",
	days: [],
	next: null,
	loading: !1,
	error: ""
}), zo = g(), Bo = zo.next(), Vo = (e, t) => `activity?view=${encodeURIComponent(e)}${t == null ? "" : `&before=${t}`}`;
async function Ho(e) {
	let t = Bo = zo.next();
	Object.assign(Ro, {
		view: e,
		days: [],
		next: null,
		today: "",
		loading: !0,
		error: ""
	});
	try {
		let n = await h(Vo(e));
		if (!t.current) return;
		Object.assign(Ro, {
			today: n.today,
			days: n.days,
			next: n.next
		});
	} catch (e) {
		t.current && (Ro.error = e.message);
	}
	t.current && (Ro.loading = !1);
}
async function Uo() {
	if (Ro.loading || Ro.next == null) return;
	let e = Bo;
	Object.assign(Ro, {
		loading: !0,
		error: ""
	});
	try {
		let t = await h(Vo(Ro.view, Ro.next));
		if (!e.current) return;
		let n = new Set(Ro.days.map((e) => e.date));
		Ro.days.push(...t.days.filter((e) => !n.has(e.date))), Ro.next = t.next;
	} catch (t) {
		e.current && (Ro.error = t.message);
	}
	e.current && (Ro.loading = !1);
}
async function Wo() {
	if (Ro.loading || !Ro.view) return;
	let e = Bo;
	try {
		let t = await h(Vo(Ro.view));
		if (!e.current || Ro.loading) return;
		let n = Io(Ro.days, t.days);
		Object.assign(Ro, {
			today: t.today,
			error: "",
			days: n
		}), n.length === t.days.length && (Ro.next = t.next);
	} catch {}
}
// src/lib/onboarding.js
var Go = [
	"car",
	"data",
	"prices",
	"places",
	"viewers",
	"dashboard"
], Ko = "https://github.com/misterblokhead/ha-car-insights/blob/main/docs/", qo = (e, t) => {
	let n = {
		car: !0,
		data: e.cars.some((e) => e.has_data),
		prices: e.price_set,
		places: t,
		viewers: e.opened.includes("viewers"),
		dashboard: e.opened.includes("dashboard")
	};
	return Go.map((e) => ({
		id: e,
		done: n[e]
	}));
}, Jo = (e, t) => qo(e, t).every((e) => e.done), Yo = (e, t) => !e.hidden && !Jo(e, t), Xo = (e, t) => e.hidden && !Jo(e, t), Zo = (e, t, n) => e && Yo(t, n), Qo = {
	car_app: ["car_app"],
	integration: ["integration"],
	both: ["car_app", "integration"]
}, $o = (e) => e.cars.filter((e) => !e.has_data).map((e) => ({
	name: e.name,
	kinds: [...Qo[e.source], ...e.missing_entities ? ["missing"] : []]
}));
// src/lib/detail.js
function es(e) {
	let t = e.indexOf(" ");
	return t < 0 ? [e, ""] : [e.slice(0, t), e.slice(t + 1)];
}
function ts(e) {
	if (e == null) return ["–", ""];
	let t = Math.round(e / 60);
	return [t >= 60 ? `${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")}` : String(t), "min"];
}
var ns = (e, t) => e == null || t == null ? null : {
	mine: e,
	usual: t,
	delta: e - t
};
function rs(e, t) {
	return t ? {
		duration: ns(e.duration_s == null ? null : e.duration_s / 60, t.avg_duration_s == null ? null : t.avg_duration_s / 60),
		consumption: ns(Fa(e.wh_per_100km), t.avg_wh_per_100km == null ? null : t.avg_wh_per_100km / 1e3)
	} : null;
}
var is = (e, t) => t > 0 ? Math.min(94, Math.max(6, 50 + (e / t - 1) * 100)) : null, as = (e, t, n = 0) => e.toFixed(n).replace(/^-/, "").replace(/[0.]/g, "") === "" ? "same" : La(e, t, n), os = (e) => e == null ? "–" : `${e < 0 ? "−" : ""}${Math.abs(e).toFixed(1)} kW`, ss = (e, t, n) => e == null && t == null ? "–" : `${e ?? "–"} → ${t ?? "–"} ${n}`, cs = (e, t) => `${Za(e)} – ${t == null ? "now" : Za(t)}`, ls = (e, t, n = Date.now()) => `${eo(Ya(e), Ya(n))} · ${cs(e, t)}`, us = (e, t) => e ?? t ?? "Unknown", ds = (e) => e.place ?? e.address ? `Charged at ${e.place ?? e.address}` : "Charged", fs = (e, t) => (t && e != null ? "~" : "") + Aa(e), ps = (e) => `${us(e.from, e.from_address)} → ${us(e.to, e.to_address)}`, ms = (e) => `Route from ${us(e.from, e.from_address)} to ${us(e.to, e.to_address)}, ${ka(e.distance_m)}, ${e.end == null ? "still driving" : Na(e.duration_s)}`, hs = (e) => e == null ? "–" : `${e.toFixed(0)} °C`, gs = (e, [t, n]) => ({
	label: e,
	value: t,
	unit: n
}), _s = [
	["accel", "Hard accelerations"],
	["brake", "Hard brakings"],
	["corner", "Sharp corners"]
], vs = (e) => e == null ? "Too short for a score" : e >= 80 ? "Smooth" : e >= 60 ? "Average" : "Lively", ys = (e, t) => t > 0 ? `${(e / t * 10).toFixed(1)} per 10 km` : "–";
function bs(e, t) {
	let n = Object.values(e).reduce((e, [t]) => e + t, 0);
	return Object.entries(e).map(([e, [r, i]]) => ({
		name: e,
		share: n ? r / n : 0,
		kwhPer100: r >= t * 1e3 && r > 0 && i != null ? i / r * 100 : null
	}));
}
var xs = (e, t = Date.now()) => `No data since ${eo(Ya(e), Ya(t))}`, Ss = (e) => e == null ? "–" : `€${e.toFixed(2)}`, Cs = (e) => e?.amount == null ? "–" : e.basis === "default" ? `≈ ${Ss(e.amount)}` : Ss(e.amount);
function ws(e) {
	if (e?.amount == null) return "Not available: no price for this date, or no energy reading";
	if (e.basis === "receipt") return "Receipt";
	let t = e.tariff, n = [
		e.basis === "spot" ? e.spot ?? "Spot" : `Default ${e.current.toUpperCase()} price`,
		`${Ss(t.per_kwh)}/kWh`,
		`${Math.round((e.loss - 1) * 100)} % charging loss`
	];
	return t.start_fee && n.push(`start fee ${Ss(t.start_fee)}`), t.per_min && n.push(`${Ss(t.per_min)}/min`), e.card_markup_pct && n.push(`card +${e.card_markup_pct} %`), e.card_start_fee && n.push(`card fee ${Ss(e.card_start_fee)}`), n.join(" · ");
}
var Ts = ({ energy: e, fixed: t }) => e == null ? "" : `${Ss(e)} energy · ${t == null ? "fixed not available yet" : `${Ss(t)} fixed`}`, Es = (e, t) => e == null || !t ? "–" : `${Ss(e / t * 1e5)}/100 km`, Ds = (e, t) => {
	let n = ro(t), r = io(t);
	return e.find((e) => e.valid_from >= n && e.valid_from < r)?.valid_from ?? n;
}, Os = (e) => e > 0 ? `${e} ${e === 1 ? "charge" : "charges"} without a price` : "", ks = (e, t) => e.find((e) => e.valid_from <= t) ?? null, As = /* @__PURE__ */ X(" <small> </small>", 1), js = /* @__PURE__ */ X("<a><span class=\"glyph svelte-14efj7c\" aria-hidden=\"true\"><!></span> <span class=\"title svelte-14efj7c\"> </span> <span class=\"big svelte-14efj7c\"> <!></span> <span class=\"caption when svelte-14efj7c\"> </span> <!> <!></a>");
function Ms(e, t) {
	let n = xa(t, "current", 3, !1);
	var r = js();
	let i;
	var a = G(r);
	Si(G(a), () => t.glyph), B(a);
	var o = q(a, 2), s = K(o, !0), c = q(o, 2), l = G(c, !0), u = q(l), d = (e) => {
		var n = As(), r = vn(n, !0);
		r.nodeValue = " ";
		var i = K(q(r), !0);
		J(() => Q(i, t.unit)), Z(e, n);
	};
	$(u, (e) => {
		t.unit && e(d);
	}), B(c);
	var f = q(c, 2), p = K(f, !0), m = q(f, 2);
	Si(m, () => t.aside ?? D), Si(q(m, 2), () => t.below ?? D), B(r), J(() => {
		ra(r, "href", t.href), i = Bi(r, 1, `card press ${t.kind ?? ""}`, "svelte-14efj7c", i, {
			current: n(),
			aside: t.aside
		}), ra(r, "aria-current", n() ? "page" : void 0), Q(s, t.title), Q(l, t.value), Q(p, t.when);
	}), Fr("click", r, function(...e) {
		t.onclick?.apply(this, e);
	}), Z(e, r);
}
Ir(["click"]);
// src/lib/ui/ChargeBar.svelte
var Ns = /* @__PURE__ */ X("<i class=\"base svelte-1vubvs7\"></i>"), Ps = /* @__PURE__ */ X("<i class=\"room svelte-1vubvs7\"></i>"), Fs = /* @__PURE__ */ X("<div class=\"bar svelte-1vubvs7\" role=\"img\"><!> <i class=\"added svelte-1vubvs7\"></i> <!></div>");
function Is(e, t) {
	let n = xa(t, "full", 3, !1), r = (e) => Math.min(100, Math.max(0, e)), i = /* @__PURE__ */ H(() => t.from != null && t.to != null), a = /* @__PURE__ */ H(() => Y(i) ? r(Math.min(t.from, t.to)) : 0), o = /* @__PURE__ */ H(() => Y(i) ? r(Math.max(t.from, t.to)) : 0);
	var s = qr(), c = vn(s), l = (e) => {
		var i = Fs(), s = G(i), c = (e) => {
			var t = Ns();
			let n;
			J(() => n = Hi(t, "", n, { width: `${Y(a) ?? ""}%` })), Z(e, t);
		};
		$(s, (e) => {
			n() && e(c);
		});
		var l = q(s, 2);
		let u;
		var d = q(l, 2), f = (e) => {
			var t = Ps();
			let n;
			J(() => n = Hi(t, "", n, { left: `${Y(o) ?? ""}%` })), Z(e, t);
		};
		$(d, (e) => {
			n() && e(f);
		}), B(i), J((e, t) => {
			ra(i, "aria-label", `Charged from ${e ?? ""} % to ${t ?? ""} %`), u = Hi(l, "", u, {
				left: `${Y(a) ?? ""}%`,
				width: `${Y(o) - Y(a)}%`
			});
		}, [() => Math.round(r(t.from)), () => Math.round(r(t.to))]), Z(e, i);
	};
	$(c, (e) => {
		Y(i) && e(l);
	}), Z(e, s);
}
// src/lib/ui/ChargeCard.svelte
var Ls = /* @__PURE__ */ Gr("<svg viewBox=\"0 0 24 24\"><path d=\"M13 3 5 14h6l-1 7 8-11h-6z\"></path></svg>"), Rs = /* @__PURE__ */ X("<span class=\"caption row svelte-1njo9sk\"> </span>"), zs = /* @__PURE__ */ X("<span class=\"level row svelte-1njo9sk\"><!> <span class=\"caption svelte-1njo9sk\"> </span></span>"), Bs = /* @__PURE__ */ X("<!> <!>", 1);
function Vs(e, t) {
	et(t, !0);
	let n = xa(t, "current", 3, !1), r = /* @__PURE__ */ H(() => t.item.start_pct), i = /* @__PURE__ */ H(() => t.item.end_pct), a = /* @__PURE__ */ H(() => fs(t.item.added_wh, t.item.energy_source === "soc_estimate").split(" ")), o = /* @__PURE__ */ H(() => re(Y(a), 2)), s = /* @__PURE__ */ H(() => Y(o)[0]), c = /* @__PURE__ */ H(() => Y(o)[1]), l = /* @__PURE__ */ H(() => `${cs(t.item.start, t.item.end)} · ${ja(t.item.avg_w)}`);
	{
		let a = (e) => {
			Z(e, Ls());
		}, o = (e) => {
			var n = Bs(), a = vn(n), o = (e) => {
				var n = Rs(), r = K(n, !0);
				J((e) => Q(r, e), [() => Cs(t.item.cost)]), Z(e, n);
			};
			$(a, (e) => {
				t.item.cost?.amount != null && e(o);
			});
			var s = q(a, 2), c = (e) => {
				var t = zs(), n = G(t);
				Is(n, {
					get from() {
						return Y(r);
					},
					get to() {
						return Y(i);
					}
				});
				var a = K(q(n, 2));
				B(t), J((e, t) => Q(a, `${e ?? ""} → ${t ?? ""} %`), [() => Math.round(Y(r)), () => Math.round(Y(i))]), Z(e, t);
			};
			$(s, (e) => {
				Y(r) != null && Y(i) != null && e(c);
			}), Z(e, n);
		}, u = /* @__PURE__ */ H(() => No(t.item)), d = /* @__PURE__ */ H(() => ds(t.item));
		Ms(e, {
			get href() {
				return Y(u);
			},
			get current() {
				return n();
			},
			get onclick() {
				return t.onclick;
			},
			kind: "charge",
			get title() {
				return Y(d);
			},
			get value() {
				return Y(s);
			},
			get unit() {
				return Y(c);
			},
			get when() {
				return Y(l);
			},
			glyph: a,
			below: o,
			$$slots: {
				glyph: !0,
				below: !0
			}
		});
	}
	tt();
}
// src/lib/cars.js
var Hs = "/_my_redirect/config_flow_start?domain=car_insights", Us = "/config/integrations/integration/car_insights", Ws = (e) => ({
	active: e.filter((e) => !e.archived),
	archived: e.filter((e) => e.archived)
}), Gs = (e) => e.history_deleted === !1 ? "Its history could not be deleted; try Delete history again." : null, Ks = "Car Insights stopped with its last car.", qs = (e, t) => t && e.status === 503;
function Js(e) {
	window.top.history.pushState(null, "", e), window.top.dispatchEvent(new CustomEvent("location-changed"));
}
// src/lib/ui/GettingStarted.svelte
var Ys = /* @__PURE__ */ X("<p class=\"err svelte-1l9jcf1\" role=\"alert\"> </p>"), Xs = /* @__PURE__ */ X("<span class=\"caption\"> </span>"), Zs = /* @__PURE__ */ X("<span class=\"caption\">Waiting for your car's first data…</span> <!>", 1), Qs = /* @__PURE__ */ X("<a href=\"#/settings/prices\" class=\"svelte-1l9jcf1\">Open prices</a>"), $s = /* @__PURE__ */ X("<button class=\"link press svelte-1l9jcf1\" type=\"button\">Open zones</button>"), ec = /* @__PURE__ */ X("<a href=\"#/settings/cars\" class=\"svelte-1l9jcf1\">Open cars</a>"), tc = /* @__PURE__ */ X("<a target=\"_blank\" rel=\"noopener\" class=\"svelte-1l9jcf1\">Read how</a>"), nc = /* @__PURE__ */ X("<li class=\"svelte-1l9jcf1\"><span aria-hidden=\"true\"> </span> <div class=\"body svelte-1l9jcf1\"><span class=\"title\"><span class=\"sr\"> </span> </span> <!> <!> <!></div></li>"), rc = /* @__PURE__ */ X("<section class=\"card svelte-1l9jcf1\" aria-labelledby=\"getting-started\"><div class=\"head svelte-1l9jcf1\"><h2 id=\"getting-started\" class=\"svelte-1l9jcf1\">Getting started</h2> <button class=\"press svelte-1l9jcf1\" type=\"button\">Hide</button></div> <!> <ol class=\"svelte-1l9jcf1\"></ol></section>");
function ic(e, t) {
	et(t, !0);
	let n = {
		car_app: "Put the .conf file on the car's USB stick and check that the car app is running.",
		integration: "Car Insights reads your car's integration every few minutes. Check that its entities are not unavailable.",
		missing: "Some of its entities are missing: see Settings → System → Repairs."
	}, r = {
		car: "Add your car",
		data: "First data from your car",
		prices: "Set your electricity prices",
		places: "Name your places",
		viewers: "Choose who sees what",
		dashboard: "Dashboard and sensors"
	}, i = /* @__PURE__ */ H(() => t.checklist.cars.length), a = /* @__PURE__ */ H(() => ({
		car: `${Y(i)} ${Y(i) === 1 ? "car is" : "cars are"} set up`,
		places: "Trips then read Home → Work instead of street names.",
		viewers: "Only matters when other people use this Home Assistant."
	})), o = /* @__PURE__ */ H(() => qo(t.checklist, t.places)), s = /* @__PURE__ */ H(() => $o(t.checklist)), c = /* @__PURE__ */ U(""), l = /* @__PURE__ */ U(!1);
	async function u(e) {
		W(c, ""), W(l, !0);
		try {
			return await m("PUT", "onboarding", e), !0;
		} catch (e) {
			return W(c, e.detail || `Could not save (${e.message})`, !0), !1;
		} finally {
			W(l, !1);
		}
	}
	async function d() {
		await u({ hidden: !0 }) && await t.reload(), await Sr(), t.gone?.focus();
	}
	async function f(e) {
		e.preventDefault(), await u({ opened: "viewers" }), location.hash = "#/settings/cars";
	}
	async function p() {
		await u({ opened: "dashboard" }) && await t.reload();
	}
	var h = rc(), g = G(h), _ = q(G(g), 2);
	B(g);
	var v = q(g, 2), y = (e) => {
		var t = Ys(), n = K(t, !0);
		J(() => Q(n, Y(c))), Z(e, t);
	};
	$(v, (e) => {
		Y(c) && e(y);
	});
	var b = q(v, 2);
	hi(b, 21, () => Y(o), (e) => e.id, (e, t) => {
		var o = nc(), c = G(o);
		let l;
		var u = K(c, !0), d = q(c, 2), m = G(d), h = G(m), g = K(h, !0), _ = q(h, 1, !0);
		B(m);
		var v = q(m, 2), y = (e) => {
			var n = Xs(), r = K(n, !0);
			J(() => Q(r, Y(a)[Y(t).id])), Z(e, n);
		};
		$(v, (e) => {
			Y(a)[Y(t).id] && e(y);
		});
		var b = q(v, 2), x = (e) => {
			var t = Zs();
			hi(q(vn(t), 2), 17, () => Y(s), di, (e, t) => {
				var r = qr();
				hi(vn(r), 17, () => Y(t).kinds, di, (e, r) => {
					var a = Xs(), o = K(a);
					J(() => Q(o, `${Y(i) > 1 ? `${Y(t).name}: ` : ""}${n[Y(r)] ?? ""}`)), Z(e, a);
				}), Z(e, r);
			}), Z(e, t);
		};
		$(b, (e) => {
			Y(t).id === "data" && !Y(t).done && e(x);
		});
		var S = q(b, 2), C = (e) => {
			Z(e, Qs());
		}, ee = (e) => {
			var t = $s();
			Fr("click", t, () => Js("/config/zone")), Z(e, t);
		}, te = (e) => {
			var t = ec();
			Fr("click", t, f), Z(e, t);
		}, w = (e) => {
			var t = tc();
			J(() => ra(t, "href", Ko + "sensors-and-dashboard.md")), Fr("click", t, p), Z(e, t);
		};
		$(S, (e) => {
			Y(t).id === "prices" ? e(C) : Y(t).id === "places" ? e(ee, 1) : Y(t).id === "viewers" ? e(te, 2) : Y(t).id === "dashboard" && e(w, 3);
		}), B(d), B(o), J(() => {
			l = Bi(c, 1, "mark svelte-1l9jcf1", null, l, { done: Y(t).done }), Q(u, Y(t).done ? "✓" : ""), Q(g, Y(t).done ? "Done: " : "To do: "), Q(_, r[Y(t).id]);
		}), Z(e, o);
	}), B(b), B(h), J(() => _.disabled = Y(l)), Fr("click", _, d), Z(e, h), tt();
}
Ir(["click"]);
// src/lib/ui/LiveStrip.svelte
var ac = /* @__PURE__ */ Gr("<svg class=\"icon svelte-lcylx6\" viewBox=\"0 0 24 24\" role=\"img\" aria-label=\"Plugged in\"><path d=\"M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4\"></path></svg>"), oc = /* @__PURE__ */ X("<li class=\"svelte-lcylx6\"><i class=\"svelte-lcylx6\"></i> <span class=\"where svelte-lcylx6\"><b class=\"svelte-lcylx6\"> </b> </span> <span class=\"vals svelte-lcylx6\"> <!></span></li>"), sc = /* @__PURE__ */ X("<ul class=\"card svelte-lcylx6\"></ul>");
function cc(e, t) {
	et(t, !0);
	let n = {
		driving: "Driving",
		charging: "Charging",
		parked: "Parked",
		no_data: "No data"
	}, r = {
		driving: "var(--trip)",
		charging: "var(--charge)",
		parked: "var(--muted)",
		no_data: "var(--muted)"
	};
	var i = qr(), a = vn(i), o = (e) => {
		var i = sc();
		hi(i, 21, () => t.vehicles, (e) => e.id, (e, t) => {
			var i = oc(), a = G(i);
			let o;
			var s = q(a, 2), c = G(s), l = K(c, !0), u = q(c);
			B(s);
			var d = q(s, 2), f = G(d), p = q(f), m = (e) => {
				Z(e, ac());
			};
			$(p, (e) => {
				Y(t).status === "charging" && e(m);
			}), B(d), B(i), J((e, n, i) => {
				o = Hi(a, "", o, { background: r[Y(t).status] ?? r.parked }), Q(l, Y(t).name), Q(u, ` · ${e ?? ""}`), Q(f, `${n ?? ""} · ${i ?? ""} `);
			}, [
				() => Y(t).status === "no_data" ? xs(Y(t).updated) : `${n[Y(t).status] ?? Y(t).status} · ${Y(t).position?.place || "–"}`,
				() => Ma(Y(t).soc_percent),
				() => ka(Y(t).range_m)
			]), Z(e, i);
		}), B(i), Z(e, i);
	};
	$(a, (e) => {
		t.vehicles.length && e(o);
	}), Z(e, i), tt();
}
// src/lib/spring.js
function lc({ value: e = 0, response: t = .35, damping: n = 1 } = {}) {
	let r = (2 * Math.PI / t) ** 2, i = 4 * Math.PI * n / t, a = {
		value: e,
		velocity: 0,
		target: e,
		set(e, { velocity: t } = {}) {
			a.target = e, t != null && (a.velocity = t);
		},
		step(e) {
			for (let t = e; t > 0;) {
				let e = Math.min(t, .004);
				a.velocity += (-r * (a.value - a.target) - i * a.velocity) * e, a.value += a.velocity * e, t -= e;
			}
			return Math.abs(a.value - a.target) < .5 && Math.abs(a.velocity) < .5 && (a.value = a.target, a.velocity = 0, !0);
		}
	};
	return a;
}
// src/lib/ui/Segmented.svelte
var uc = /* @__PURE__ */ X("<label><input type=\"radio\" class=\"svelte-5bfr2e\"/> <span> </span></label>"), dc = /* @__PURE__ */ X("<div class=\"group svelte-5bfr2e\" role=\"radiogroup\"><div class=\"marker svelte-5bfr2e\"></div> <!></div>");
function fc(e, t) {
	let n = Jr();
	et(t, !0);
	let r = [], i = xa(t, "value", 15, ""), a = lc({
		response: .35,
		damping: 1
	}), o = po(a, { onFrame: (e) => W(c, e, !0) }), s = /* @__PURE__ */ U(0), c = /* @__PURE__ */ U(0), l = !1, u = /* @__PURE__ */ H(() => Math.max(0, (Y(s) - 4) / t.options.length));
	An(() => {
		let e = Math.max(0, t.options.findIndex((e) => e.value === i())) * Y(u);
		if (!l || ao.reducedMotion) l = Y(s) > 0, Object.assign(a, {
			value: e,
			target: e,
			velocity: 0
		}), W(c, e);
		else return o.to(e), o.stop;
	});
	var d = dc(), f = G(d);
	let p;
	hi(q(f, 2), 17, () => t.options, (e) => e.value, (e, t) => {
		var a = uc();
		let o;
		var s = G(a);
		ea(s);
		var c, l = K(q(s, 2), !0);
		B(a), J(() => {
			o = Bi(a, 1, "svelte-5bfr2e", null, o, { on: Y(t).value === i() }), ra(s, "name", n), c !== (c = Y(t).value) && (s.value = (s.__value = c) ?? ""), Q(l, Y(t).label);
		}), la(r, [], s, () => (Y(t).value, i()), i), Z(e, a);
	}), B(d), J(() => {
		ra(d, "aria-label", t.label), p = Hi(f, "", p, {
			width: `${Y(u) ?? ""}px`,
			transform: `translateX(${Y(c) ?? ""}px)`
		});
	}), ma(d, "clientWidth", (e) => W(s, e)), Z(e, d), tt();
}
// src/lib/gesture.js
var pc = (e, t = .998) => e / 1e3 * t / (1 - t), mc = (e, t, n) => e + pc(t) > n / 2;
function hc(e) {
	let t = e[0], n = e[e.length - 1];
	return t && n && n.t > t.t ? (n.x - t.x) / (n.t - t.t) * 1e3 : 0;
}
// src/lib/ui/DetailPane.svelte
var gc = (e) => (document.body.appendChild(e), { destroy: () => e.remove() }), _c = /* @__PURE__ */ X("<div class=\"item svelte-2a30b3\"><!></div>"), vc = /* @__PURE__ */ X("<header class=\"bar chrome svelte-2a30b3\"><button class=\"back press svelte-2a30b3\"><svg class=\"icon svelte-2a30b3\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m15 5-7 7 7 7\"></path></svg> </button> <span class=\"steps svelte-2a30b3\"><button class=\"press svelte-2a30b3\" aria-label=\"Previous activity\"><svg class=\"icon svelte-2a30b3\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m5 15 7-7 7 7\"></path></svg></button> <button class=\"press svelte-2a30b3\" aria-label=\"Next activity\"><svg class=\"icon svelte-2a30b3\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m5 9 7 7 7-7\"></path></svg></button></span></header> <div class=\"content svelte-2a30b3\"><!></div>", 1), yc = /* @__PURE__ */ X("<div role=\"dialog\" tabindex=\"-1\" aria-label=\"Details\"><!></div>"), bc = /* @__PURE__ */ X("<aside aria-label=\"Details\"><!></aside>");
function xc(e, t) {
	et(t, !0);
	let n = (e) => {
		var n = vc(), o = vn(n), s = G(o), c = q(G(s));
		B(s);
		var l = q(s, 2), u = G(l), d = q(u, 2);
		B(l), B(o);
		var f = q(o, 2);
		ui(G(f), () => t.id, (e) => {
			var n = _c();
			Si(G(n), () => t.children), B(n), ji(1, n, () => fo, () => ({ duration: a })), ji(2, n, () => fo, () => ({ duration: a })), Z(e, n);
		}), B(f), J(() => {
			Q(c, ` ${ao.wide ? "Close" : "Activity"}`), u.disabled = !r(), d.disabled = !i();
		}), Fr("click", s, y), Fr("click", u, () => b(r())), Fr("click", d, () => b(i())), Z(e, n);
	}, r = xa(t, "prev", 3, null), i = xa(t, "next", 3, null), a = ho("--fade"), o = /* @__PURE__ */ H(() => !ao.split), s = /* @__PURE__ */ H(() => !ao.wide && !ao.reducedMotion), c = lc({
		response: .35,
		damping: 1
	}), l = !ao.wide && !ao.reducedMotion, u = /* @__PURE__ */ U(sn(l ? innerWidth : 0)), d = /* @__PURE__ */ U(!1), f = /* @__PURE__ */ U(!1), p = /* @__PURE__ */ U(!1), m = /* @__PURE__ */ U(void 0), h = 0, g = null, _ = po(c, {
		snap: {
			distance: 1,
			speed: 30
		},
		onFrame: (e) => W(u, e, !0),
		onSettle() {
			W(d, !1), c.target > 0 && t.onclose();
		}
	});
	function v(e, t) {
		W(d, !0), _.to(e, t);
	}
	Sa(() => (c.value = Y(u), l && v(0), () => {
		_.stop(), clearTimeout(h);
	}));
	function y() {
		Y(p) || (Y(s) ? v(Y(m).offsetWidth) : (W(p, !0), h = setTimeout(t.onclose, a)));
	}
	let b = (e) => e && location.replace(e);
	function x(e) {
		if (!(e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey)) {
			if (e.key === "Escape") e.preventDefault(), y();
			else if ((e.key === "ArrowUp" || e.key === "ArrowDown") && !e.target.closest?.("input, select, textarea, [role=menu], [role=listbox]")) {
				let t = e.key === "ArrowUp" ? r() : i();
				t && (e.preventDefault(), b(t));
			}
		}
	}
	let S = (e) => {
		for (; g.samples.length > 1 && g.samples[0].t < e.timeStamp - 100;) g.samples.shift();
	};
	function C(e) {
		_.stop(), Y(m).setPointerCapture(e.pointerId), g.live = !0, W(d, W(f, !0), !0);
	}
	function ee(e) {
		!Y(s) || e.pointerType === "mouse" && e.button || !Y(d) && (e.clientX - Y(u) > 24 || e.target.closest("button, a")) || (g = {
			id: e.pointerId,
			grab: e.clientX,
			top: e.clientY,
			from: c.value,
			samples: [{
				t: e.timeStamp,
				x: e.clientX
			}],
			live: !1
		}, Y(d) && C(e));
	}
	function te(e) {
		if (g && e.pointerId === g.id) {
			if (!g.live) {
				let t = Math.abs(e.clientX - g.grab), n = Math.abs(e.clientY - g.top);
				if (n > 8 && n > t) return void (g = null);
				if (t < 8) return;
				C(e);
			}
			W(u, Math.max(0, g.from + e.clientX - g.grab), !0), Object.assign(c, {
				value: Y(u),
				target: Y(u),
				velocity: 0
			}), g.samples.push({
				t: e.timeStamp,
				x: e.clientX
			}), S(e);
		}
	}
	function w(e) {
		if (!g || e.pointerId !== g.id) return;
		if (!g.live) return void (g = null);
		g.samples.push({
			t: e.timeStamp,
			x: e.clientX
		}), S(e);
		let t = hc(g.samples);
		g = null, W(f, !1);
		let n = Y(m).offsetWidth;
		v(mc(Y(u), t, n) ? n : 0, t);
	}
	An(() => {
		if (!Y(o)) return;
		let e = document.querySelector(ao.wide ? "main" : "#app");
		return e.inert = !0, () => e.inert = !1;
	}), An(() => {
		t.id, Y(m)?.scrollTo(0, 0);
	});
	var T = qr();
	Pr("keydown", un, x);
	var E = vn(T), D = (e) => {
		var t = yc();
		let r, i;
		var a = G(t);
		n(a), B(t), ga(t, (e) => W(m, e), () => Y(m)), Ni(t, (e) => gc?.(e)), J(() => {
			r = Bi(t, 1, "layer svelte-2a30b3", null, r, {
				phone: !ao.wide,
				busy: Y(d),
				held: Y(f),
				leaving: Y(p),
				"fade-in": !l
			}), ra(t, "aria-modal", !ao.wide), i = Hi(t, "", i, { transform: Y(u) ? `translateX(${Y(u)}px)` : null });
		}), Fr("pointerdown", t, ee), Fr("pointermove", t, te), Fr("pointerup", t, w), Pr("pointercancel", t, w), Z(e, t);
	}, ne = (e) => {
		var t = bc();
		let r;
		var i = G(t);
		n(i), B(t), ga(t, (e) => W(m, e), () => Y(m)), J(() => r = Bi(t, 1, "column svelte-2a30b3", null, r, {
			leaving: Y(p),
			"fade-in": !l
		})), Z(e, t);
	};
	$(E, (e) => {
		Y(o) ? e(D) : e(ne, -1);
	}), Z(e, T), tt();
}
Ir([
	"click",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
var Sc = 256;
function Cc(e, t, n) {
	let r = Sc * 2 ** n, i = e * Math.PI / 180;
	return [(t + 180) / 360 * r, (1 - Math.log(Math.tan(i) + 1 / Math.cos(i)) / Math.PI) / 2 * r];
}
function wc(e, t, n, r = 8) {
	let i = t - 2 * r, a = n - 2 * r, o = 17, s;
	for (;; o--) {
		s = e.map(([e, t]) => Cc(e, t, o));
		let r = s.map((e) => e[0]), c = s.map((e) => e[1]);
		if (o === 0 || Math.max(...r) - Math.min(...r) <= i && Math.max(...c) - Math.min(...c) <= a) {
			let e = Math.round((Math.max(...r) + Math.min(...r)) / 2 - t / 2), i = Math.round((Math.max(...c) + Math.min(...c)) / 2 - n / 2), a = [];
			for (let r = Math.floor(e / Sc); r <= Math.floor((e + t - 1) / Sc); r++) for (let t = Math.floor(i / Sc); t <= Math.floor((i + n - 1) / Sc); t++) t >= 0 && t < 2 ** o && a.push({
				z: o,
				x: r,
				y: t,
				left: r * Sc - e,
				top: t * Sc - i
			});
			return {
				z: o,
				tiles: a,
				points: s.map(([t, n]) => [t - e, n - i])
			};
		}
	}
}
var Tc = "/api/map_tiles/raster/{z}/{x}/{y}.png", Ec = ({ z: e, x: t, y: n }) => Tc.replace("{z}", e).replace("{x}", t).replace("{y}", n), Dc = /* @__PURE__ */ new Map();
function Oc(e) {
	let t = Dc.get(e);
	return t || (t = p(e).then(async (e) => {
		if (!e.ok) throw Error(String(e.status));
		return URL.createObjectURL(await e.blob());
	}), t.catch(() => Dc.get(e) === t && Dc.delete(e)), Dc.set(e, t)), t;
}
// src/lib/ui/RouteOutline.svelte
var kc = /* @__PURE__ */ X("<img alt=\"\" width=\"256\" height=\"256\" class=\"svelte-wy78el\"/>"), Ac = /* @__PURE__ */ X("<span class=\"box svelte-wy78el\"><span class=\"tiles svelte-wy78el\" aria-hidden=\"true\"><!></span> <svg role=\"img\" class=\"svelte-wy78el\"><polyline class=\"svelte-wy78el\"></polyline><circle class=\"open svelte-wy78el\" r=\"3.5\"></circle><circle class=\"end svelte-wy78el\" r=\"3.5\"></circle></svg></span>");
function jc(e, t) {
	et(t, !0);
	let n = xa(t, "label", 3, "Route"), r = /* @__PURE__ */ H(() => t.points?.length >= 2 ? wc(t.points, t.width, t.height, 8) : null), i = /* @__PURE__ */ H(() => Y(r)?.points ?? []), a = /* @__PURE__ */ H(() => Y(i)[0]), o = /* @__PURE__ */ H(() => Y(i)[Y(i).length - 1]), s = /* @__PURE__ */ U(void 0), c = /* @__PURE__ */ U(typeof IntersectionObserver > "u");
	An(() => {
		if (Y(c) || !Y(s)) return;
		let e = new IntersectionObserver((e) => e.some((e) => e.isIntersecting) && W(c, !0), { rootMargin: "200px" });
		return e.observe(Y(s)), () => e.disconnect();
	});
	var l = qr(), u = vn(l), d = (e) => {
		var l = Ac();
		let u;
		var d = G(l), f = G(d), p = (e) => {
			var t = qr();
			hi(vn(t), 17, () => Y(r).tiles, (e) => `${e.x}/${e.y}`, (e, t) => {
				var n = qr();
				ci(vn(n), () => Oc(Ec(Y(t))), null, (e, n) => {
					var r = kc();
					let i;
					J(() => {
						ra(r, "src", Y(n)), i = Hi(r, "", i, {
							left: `${Y(t).left ?? ""}px`,
							top: `${Y(t).top ?? ""}px`
						});
					}), Z(e, r);
				}), Z(e, n);
			}), Z(e, t);
		};
		$(f, (e) => {
			Y(c) && e(p);
		}), B(d);
		var m = q(d, 2), h = G(m), g = q(h), _ = q(g);
		B(m), B(l), ga(l, (e) => W(s, e), () => Y(s)), J((e) => {
			u = Hi(l, "", u, {
				width: `${t.width ?? ""}px`,
				height: `${t.height ?? ""}px`
			}), ra(m, "width", t.width), ra(m, "height", t.height), ra(m, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), ra(m, "aria-label", n()), ra(h, "points", e), ra(g, "cx", Y(a)[0]), ra(g, "cy", Y(a)[1]), ra(_, "cx", Y(o)[0]), ra(_, "cy", Y(o)[1]);
		}, [() => Y(i).map((e) => `${e[0].toFixed(1)},${e[1].toFixed(1)}`).join(" ")]), Z(e, l);
	};
	$(u, (e) => {
		Y(r) && e(d);
	}), Z(e, l), tt();
}
// src/lib/ui/TripCard.svelte
var Mc = /* @__PURE__ */ Gr("<svg class=\"icon\" viewBox=\"0 0 24 24\"><path d=\"M5 16v-5l2-5h10l2 5v5M5 16h14M5 16v3h3v-3M16 16v3h3v-3M7 11h10\"></path></svg>"), Nc = /* @__PURE__ */ X("<span class=\"route svelte-8nqrvt\"><!></span> <span class=\"caption stats svelte-8nqrvt\"> <br/> </span>", 1);
function Pc(e, t) {
	et(t, !0);
	let n = xa(t, "current", 3, !1), r = /* @__PURE__ */ H(() => ka(t.item.distance_m).split(" ")), i = /* @__PURE__ */ H(() => re(Y(r), 2)), a = /* @__PURE__ */ H(() => Y(i)[0]), o = /* @__PURE__ */ H(() => Y(i)[1]), s = /* @__PURE__ */ H(() => `${Za(t.item.start)} · ${t.item.end == null ? "now" : Na(t.item.duration_s)}`);
	{
		let r = (e) => {
			Z(e, Mc());
		}, i = (e) => {
			var n = Nc(), r = vn(n), i = G(r);
			{
				let e = /* @__PURE__ */ H(() => ms(t.item));
				jc(i, {
					get points() {
						return t.item.route;
					},
					width: 120,
					height: 84,
					get label() {
						return Y(e);
					}
				});
			}
			B(r);
			var a = q(r, 2), o = G(a, !0), s = q(o, 2, !0);
			B(a), J((e, t) => {
				Q(o, e), Q(s, t);
			}, [() => Ia(t.item.wh_per_100km), () => Aa(t.item.net_wh)]), Z(e, n);
		}, c = /* @__PURE__ */ H(() => No(t.item)), l = /* @__PURE__ */ H(() => ps(t.item));
		Ms(e, {
			get href() {
				return Y(c);
			},
			get current() {
				return n();
			},
			get onclick() {
				return t.onclick;
			},
			kind: "trip",
			get title() {
				return Y(l);
			},
			get value() {
				return Y(a);
			},
			get unit() {
				return Y(o);
			},
			get when() {
				return Y(s);
			},
			glyph: r,
			aside: i,
			$$slots: {
				glyph: !0,
				aside: !0
			}
		});
	}
	tt();
}
// src/lib/series.js
var Fc = (e) => e.every((e) => e == null);
function Ic(e) {
	if (!e || !e.rows || !e.rows.length) return null;
	let t = (t) => e.cols.indexOf(t), n = e.rows.filter((e) => e[t("km")] != null);
	if (!n.length) return null;
	let r = (e) => n.map((n) => n[t(e)]);
	return { speed: ((e) => {
		let t = e.map(([e, t]) => ({
			label: e,
			values: r(t),
			scale: "y"
		}));
		return t.every((e) => Fc(e.values)) ? null : {
			x: r("km"),
			series: t
		};
	})([["Speed km/h", "speed_kmh"]]) };
}
function Lc(e) {
	let t = [...new Set(e.flatMap((e) => e.points.map((e) => e[0])))].sort((e, t) => e - t);
	return {
		x: t.map((e) => e / 1e3),
		series: e.map((e) => {
			let n = new Map(e.points);
			return {
				label: e.label,
				scale: e.scale,
				values: t.map((e) => n.has(e) ? n.get(e) : null)
			};
		})
	};
}
function Rc(e) {
	let t = e?.car_kwh ?? [], n = e?.cloud_soc ?? [], r = e?.cloud_plugged ?? [];
	return {
		car: t.length ? Lc([{
			label: "Battery kWh",
			scale: "y",
			points: t
		}]) : null,
		cloud: n.length || r.length ? Lc([{
			label: "SoC %",
			scale: "y",
			points: n
		}, {
			label: "Plugged",
			scale: "plug",
			points: r
		}]) : null
	};
}
function zc(e, t = .5) {
	if (!e || !e.rows) return null;
	let n = (t) => e.cols.indexOf(t), r = e.rows.filter((e) => e[n("km")] != null);
	if (!r.length) return null;
	let i = {
		x: [],
		net: [],
		gross: [],
		recup: []
	}, a = [
		"net",
		"gross",
		"recup"
	], o = [
		"net_kwh",
		"gross_kwh",
		"recup_kwh"
	].map(n), s = [
		0,
		0,
		0
	], c = null, l = null, u = () => {
		l != null && l !== 0 && (i.x.push(+(l * t).toFixed(6)), a.forEach((e, t) => {
			i[e].push(c[t] - s[t]);
		}));
	};
	for (let e of r) {
		let r = Math.ceil(e[n("km")] / t - 1e-9);
		r !== l && (u(), c && (s = c), l = r, c = s), c = o.map((t, n) => e[t] ?? c[n]);
	}
	return u(), i.x.length ? i : null;
}
var Bc = 12e4;
function Vc(e, t) {
	if (!t) return null;
	let n = (e, n) => {
		let r = [];
		for (let i = 1; i < e.length; i++) {
			let a = (e[i][0] - e[i - 1][0]) / 36e5;
			if (a <= 0) continue;
			let o = n(e[i - 1][1]), s = n(e[i][1]);
			r.push({
				x: (o + s) / 2 / t * 100,
				kw: (s - o) / 1e3 / a
			});
		}
		return r;
	}, r = (e, t) => {
		let n = e.map((e) => e.kw);
		return {
			x: e.map((e) => e.x),
			kw: n,
			source: t,
			min: Math.min(...n),
			max: Math.max(...n)
		};
	}, i = [];
	for (let t of e?.car_kwh ?? []) (!i.length || t[0] - i.at(-1)[0] >= Bc) && i.push(t);
	let a = n(i, (e) => e * 1e3);
	if (a.length >= 3) return r(a, "car");
	let o = n(e?.cloud_soc ?? [], (e) => e / 100 * t);
	return o.length < 3 ? null : r(o.map((e, t) => {
		let n = o.slice(Math.max(0, t - 1), t + 2);
		return {
			x: e.x,
			kw: n.reduce((e, t) => e + t.kw, 0) / n.length
		};
	}), "cloud");
}
// node_modules/uplot/dist/uPlot.esm.js
var Hc = !0, Uc = "uplot", Wc = "u-hz", Gc = "u-vt", Kc = "u-title", qc = "u-wrap", Jc = "u-under", Yc = "u-over", Xc = "u-axis", Zc = "u-off", Qc = "u-select", $c = "u-cursor-x", el = "u-cursor-y", tl = "u-cursor-pt", nl = "u-legend", rl = "u-live", il = "u-inline", al = "u-series", ol = "u-marker", sl = "u-label", cl = "u-value", ll = "width", ul = "height", dl = "top", fl = "bottom", pl = "left", ml = "right", hl = "#000", gl = "#0000", _l = "mousemove", vl = "mousedown", yl = "mouseup", bl = "mouseenter", xl = "mouseleave", Sl = "dblclick", Cl = "resize", wl = "scroll", Tl = "change", El = "dppxchange", Dl = "--", Ol = typeof window < "u", kl = Ol ? document : null, Al = Ol ? window : null, jl = Ol ? navigator : null, Ml, Nl;
function Pl() {
	let e = devicePixelRatio;
	Ml != e && (Ml = e, Nl && Yl(Tl, Nl, Pl), Nl = matchMedia(`(min-resolution: ${Ml - .001}dppx) and (max-resolution: ${Ml + .001}dppx)`), Jl(Tl, Nl, Pl), Al.dispatchEvent(new CustomEvent(El)));
}
function Fl(e, t) {
	if (t != null) {
		let n = e.classList;
		!n.contains(t) && n.add(t);
	}
}
function Il(e, t) {
	let n = e.classList;
	n.contains(t) && n.remove(t);
}
function Ll(e, t, n) {
	e.style[t] = n + "px";
}
function Rl(e, t, n, r) {
	let i = kl.createElement(e);
	return t != null && Fl(i, t), n?.insertBefore(i, r), i;
}
function zl(e, t) {
	return Rl("div", e, t);
}
var Bl = /* @__PURE__ */ new WeakMap();
function Vl(e, t, n, r, i) {
	let a = "translate(" + t + "px," + n + "px)";
	a != Bl.get(e) && (e.style.transform = a, Bl.set(e, a), t < 0 || n < 0 || t > r || n > i ? Fl(e, Zc) : Il(e, Zc));
}
var Hl = /* @__PURE__ */ new WeakMap();
function Ul(e, t, n) {
	let r = t + n;
	r != Hl.get(e) && (Hl.set(e, r), e.style.background = t, e.style.borderColor = n);
}
var Wl = /* @__PURE__ */ new WeakMap();
function Gl(e, t, n, r) {
	let i = t + "" + n;
	i != Wl.get(e) && (Wl.set(e, i), e.style.height = n + "px", e.style.width = t + "px", e.style.marginLeft = r ? -t / 2 + "px" : 0, e.style.marginTop = r ? -n / 2 + "px" : 0);
}
var Kl = { passive: !0 }, ql = {
	...Kl,
	capture: !0
};
function Jl(e, t, n, r) {
	t.addEventListener(e, n, r ? ql : Kl);
}
function Yl(e, t, n, r) {
	t.removeEventListener(e, n, Kl);
}
Ol && Pl();
function Xl(e, t, n, r) {
	let i;
	n ||= 0, r ||= t.length - 1;
	let a = r <= 2147483647;
	for (; r - n > 1;) i = a ? n + r >> 1 : vu((n + r) / 2), t[i] < e ? n = i : r = i;
	return e - t[n] <= t[r] - e ? n : r;
}
function Zl(e) {
	return (t, n, r) => {
		let i = -1, a = -1;
		for (let a = n; a <= r; a++) if (e(t[a])) {
			i = a;
			break;
		}
		for (let i = r; i >= n; i--) if (e(t[i])) {
			a = i;
			break;
		}
		return [i, a];
	};
}
var Ql = (e) => e != null, $l = (e) => e != null && e > 0, eu = Zl(Ql), tu = Zl($l);
function nu(e, t, n, r = 0, i = !1) {
	let a = i ? tu : eu, o = i ? $l : Ql;
	[t, n] = a(e, t, n);
	let s = e[t], c = e[t];
	if (t > -1) {
		if (r == 1) s = e[t], c = e[n];
		else if (r == -1) s = e[n], c = e[t];
		else for (let r = t; r <= n; r++) {
			let t = e[r];
			o(t) && (t < s ? s = t : t > c && (c = t));
		}
	}
	return [s ?? ku, c ?? -ku];
}
function ru(e, t, n, r) {
	let i = wu(e), a = wu(t);
	e == t && (i == -1 ? (e *= n, t /= n) : (e /= n, t *= n));
	let o = n == 10 ? Tu : Eu, s = i == 1 ? vu : bu, c = a == 1 ? bu : vu, l = s(o(_u(e))), u = c(o(_u(t))), d = Cu(n, l), f = Cu(n, u);
	return n == 10 && (l < 0 && (d = Gu(d, -l)), u < 0 && (f = Gu(f, -u))), r || n == 2 ? (e = d * i, t = f * a) : (e = Wu(e, d), t = Uu(t, f)), [e, t];
}
function iu(e, t, n, r) {
	let i = ru(e, t, n, r);
	return e == 0 && (i[0] = 0), t == 0 && (i[1] = 0), i;
}
var au = .1, ou = {
	mode: 3,
	pad: au
}, su = {
	pad: 0,
	soft: null,
	mode: 0
}, cu = {
	min: su,
	max: su
};
function lu(e, t, n, r) {
	return nd(n) ? fu(e, t, n) : (su.pad = n, su.soft = r ? 0 : null, su.mode = r ? 3 : 0, fu(e, t, cu));
}
function uu(e, t) {
	return e ?? t;
}
function du(e, t, n) {
	for (t = uu(t, 0), n = uu(n, e.length - 1); t <= n;) {
		if (e[t] != null) return !0;
		t++;
	}
	return !1;
}
function fu(e, t, n) {
	let r = n.min, i = n.max, a = uu(r.pad, 0), o = uu(i.pad, 0), s = uu(r.hard, -ku), c = uu(i.hard, ku), l = uu(r.soft, ku), u = uu(i.soft, -ku), d = uu(r.mode, 0), f = uu(i.mode, 0), p = t - e, m = Tu(p), h = Su(_u(e), _u(t)), g = _u(Tu(h) - m);
	(p < 1e-24 || g > 10) && (p = 0, (e == 0 || t == 0) && (p = 1e-24, d == 2 && l != ku && (a = 0), f == 2 && u != -ku && (o = 0)));
	let _ = p || h || 1e3, v = Cu(10, vu(Tu(_))), y = Gu(Wu(e - _ * (p == 0 ? e == 0 ? .1 : 1 : a), v / 10), 24), b = e >= l && (d == 1 || d == 3 && y <= l || d == 2 && y >= l) ? l : ku, x = Su(s, y < b && e >= b ? b : xu(b, y)), S = Gu(Uu(t + _ * (p == 0 ? t == 0 ? .1 : 1 : o), v / 10), 24), C = t <= u && (f == 1 || f == 3 && S >= u || f == 2 && S <= u) ? u : -ku, ee = xu(c, S > C && t <= C ? C : Su(C, S));
	return x == ee && x == 0 && (ee = 100), [x, ee];
}
var pu = new Intl.NumberFormat(Ol ? jl.language : "en-US"), mu = (e) => pu.format(e), hu = Math, gu = hu.PI, _u = hu.abs, vu = hu.floor, yu = hu.round, bu = hu.ceil, xu = hu.min, Su = hu.max, Cu = hu.pow, wu = hu.sign, Tu = hu.log10, Eu = hu.log2, Du = (e, t = 1) => hu.sinh(e) * t, Ou = (e, t = 1) => hu.asinh(e / t), ku = Infinity;
function Au(e) {
	return (Tu((e ^ e >> 31) - (e >> 31)) | 0) + 1;
}
function ju(e, t, n) {
	return xu(Su(e, t), n);
}
function Mu(e) {
	return typeof e == "function";
}
function Nu(e) {
	return Mu(e) ? e : () => e;
}
var Pu = () => {}, Fu = (e) => e, Iu = (e, t) => t, Lu = (e) => null, Ru = (e) => !0, zu = (e, t) => e == t, Bu = /\.\d*?(?=9{6,}|0{6,})/gm, Vu = (e) => {
	if ($u(e) || Ku.has(e)) return e;
	let t = `${e}`, n = t.match(Bu);
	if (n == null) return e;
	let r = n[0].length - 1;
	if (t.indexOf("e-") != -1) {
		let [e, n] = t.split("e");
		return +`${Vu(e)}e${n}`;
	}
	return Gu(e, r);
};
function Hu(e, t) {
	return Vu(Gu(Vu(e / t)) * t);
}
function Uu(e, t) {
	return Vu(bu(Vu(e / t)) * t);
}
function Wu(e, t) {
	return Vu(vu(Vu(e / t)) * t);
}
function Gu(e, t = 0) {
	if ($u(e)) return e;
	let n = 10 ** t;
	return yu(e * n * (1 + 2 ** -52)) / n;
}
var Ku = /* @__PURE__ */ new Map();
function qu(e) {
	return (("" + e).split(".")[1] || "").length;
}
function Ju(e, t, n, r) {
	let i = [], a = r.map(qu);
	for (let o = t; o < n; o++) {
		let t = _u(o), n = Gu(Cu(e, o), t);
		for (let s = 0; s < r.length; s++) {
			let c = e == 10 ? +`${r[s]}e${o}` : r[s] * n, l = (o >= 0 ? 0 : t) + (o >= a[s] ? 0 : a[s]), u = e == 10 ? c : Gu(c, l);
			i.push(u), Ku.set(u, l);
		}
	}
	return i;
}
var Yu = {}, Xu = [], Zu = [null, null], Qu = Array.isArray, $u = Number.isInteger, ed = (e) => e === void 0;
function td(e) {
	return typeof e == "string";
}
function nd(e) {
	let t = !1;
	if (e != null) {
		let n = e.constructor;
		t = n == null || n == Object;
	}
	return t;
}
function rd(e) {
	return typeof e == "object" && !!e;
}
var id = Object.getPrototypeOf(Uint8Array), ad = "__proto__";
function od(e, t = nd) {
	let n;
	if (Qu(e)) {
		let r = e.find((e) => e != null);
		if (Qu(r) || t(r)) {
			n = Array(e.length);
			for (let r = 0; r < e.length; r++) n[r] = od(e[r], t);
		} else n = e.slice();
	} else if (e instanceof id) n = e.slice();
	else if (t(e)) {
		n = {};
		for (let r in e) r != ad && (n[r] = od(e[r], t));
	} else n = e;
	return n;
}
function sd(e) {
	let t = arguments;
	for (let n = 1; n < t.length; n++) {
		let r = t[n];
		for (let t in r) t != ad && (nd(e[t]) ? sd(e[t], od(r[t])) : e[t] = od(r[t]));
	}
	return e;
}
var cd = 0, ld = 1, ud = 2;
function dd(e, t, n) {
	for (let r = 0, i, a = -1; r < t.length; r++) {
		let o = t[r];
		if (o > a) {
			for (i = o - 1; i >= 0 && e[i] == null;) e[i--] = null;
			for (i = o + 1; i < n && e[i] == null;) e[a = i++] = null;
		}
	}
}
function fd(e, t) {
	if (hd(e)) {
		let t = e[0].slice();
		for (let n = 1; n < e.length; n++) t.push(...e[n].slice(1));
		return gd(t[0]) || (t = md(t)), t;
	}
	let n = /* @__PURE__ */ new Set();
	for (let t = 0; t < e.length; t++) {
		let r = e[t][0], i = r.length;
		for (let e = 0; e < i; e++) n.add(r[e]);
	}
	let r = [Array.from(n).sort((e, t) => e - t)], i = r[0].length, a = /* @__PURE__ */ new Map();
	for (let e = 0; e < i; e++) a.set(r[0][e], e);
	for (let n = 0; n < e.length; n++) {
		let o = e[n], s = o[0];
		for (let e = 1; e < o.length; e++) {
			let c = o[e], l = Array(i).fill(void 0), u = t ? t[n][e] : ld, d = [];
			for (let e = 0; e < c.length; e++) {
				let t = c[e], n = a.get(s[e]);
				t === null ? u != cd && (l[n] = t, u == ud && d.push(n)) : l[n] = t;
			}
			dd(l, d, i), r.push(l);
		}
	}
	return r;
}
var pd = typeof queueMicrotask > "u" ? (e) => Promise.resolve().then(e) : queueMicrotask;
function md(e) {
	let t = e[0], n = t.length, r = Array(n);
	for (let e = 0; e < r.length; e++) r[e] = e;
	r.sort((e, n) => t[e] - t[n]);
	let i = [];
	for (let t = 0; t < e.length; t++) {
		let a = e[t], o = Array(n);
		for (let e = 0; e < n; e++) o[e] = a[r[e]];
		i.push(o);
	}
	return i;
}
function hd(e) {
	let t = e[0][0], n = t.length;
	for (let r = 1; r < e.length; r++) {
		let i = e[r][0];
		if (i.length != n) return !1;
		if (i != t) {
			for (let e = 0; e < n; e++) if (i[e] != t[e]) return !1;
		}
	}
	return !0;
}
function gd(e, t = 100) {
	let n = e.length;
	if (n <= 1) return !0;
	let r = 0, i = n - 1;
	for (; r <= i && e[r] == null;) r++;
	for (; i >= r && e[i] == null;) i--;
	if (i <= r) return !0;
	let a = Su(1, vu((i - r + 1) / t));
	for (let t = e[r], n = r + a; n <= i; n += a) {
		let r = e[n];
		if (r != null) {
			if (r <= t) return !1;
			t = r;
		}
	}
	return !0;
}
var _d = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
], vd = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
function yd(e) {
	return e.slice(0, 3);
}
var bd = vd.map(yd), xd = {
	MMMM: _d,
	MMM: _d.map(yd),
	WWWW: vd,
	WWW: bd
};
function Sd(e) {
	return (e < 10 ? "0" : "") + e;
}
function Cd(e) {
	return (e < 10 ? "00" : e < 100 ? "0" : "") + e;
}
var wd = {
	YYYY: (e) => e.getFullYear(),
	YY: (e) => (e.getFullYear() + "").slice(2),
	MMMM: (e, t) => t.MMMM[e.getMonth()],
	MMM: (e, t) => t.MMM[e.getMonth()],
	MM: (e) => Sd(e.getMonth() + 1),
	M: (e) => e.getMonth() + 1,
	DD: (e) => Sd(e.getDate()),
	D: (e) => e.getDate(),
	WWWW: (e, t) => t.WWWW[e.getDay()],
	WWW: (e, t) => t.WWW[e.getDay()],
	HH: (e) => Sd(e.getHours()),
	H: (e) => e.getHours(),
	h: (e) => {
		let t = e.getHours();
		return t == 0 ? 12 : t > 12 ? t - 12 : t;
	},
	AA: (e) => e.getHours() >= 12 ? "PM" : "AM",
	aa: (e) => e.getHours() >= 12 ? "pm" : "am",
	a: (e) => e.getHours() >= 12 ? "p" : "a",
	mm: (e) => Sd(e.getMinutes()),
	m: (e) => e.getMinutes(),
	ss: (e) => Sd(e.getSeconds()),
	s: (e) => e.getSeconds(),
	fff: (e) => Cd(e.getMilliseconds())
};
function Td(e, t) {
	t ||= xd;
	let n = [], r = /\{([a-z]+)\}|[^{]+/gi, i;
	for (; i = r.exec(e);) n.push(i[0][0] == "{" ? wd[i[1]] : i[0]);
	return (e) => {
		let r = "";
		for (let i = 0; i < n.length; i++) r += typeof n[i] == "string" ? n[i] : n[i](e, t);
		return r;
	};
}
var Ed = new Intl.DateTimeFormat().resolvedOptions().timeZone;
function Dd(e, t) {
	let n;
	return t == "UTC" || t == "Etc/UTC" ? n = /* @__PURE__ */ new Date(+e + e.getTimezoneOffset() * 6e4) : t == Ed ? n = e : (n = new Date(e.toLocaleString("en-US", { timeZone: t })), n.setMilliseconds(e.getMilliseconds())), n;
}
var Od = (e) => e % 1 == 0, kd = [
	1,
	2,
	2.5,
	5
], Ad = Ju(10, -32, 0, kd), jd = Ju(10, 0, 32, kd), Md = jd.filter(Od), Nd = Ad.concat(jd), Pd = "\n", Fd = "{YYYY}", Id = Pd + Fd, Ld = "{M}/{D}", Rd = Pd + Ld, zd = Rd + "/{YY}", Bd = "{aa}", Vd = "{h}:{mm}" + Bd, Hd = Pd + Vd, Ud = ":{ss}", Wd = null;
function Gd(e) {
	let t = e * 1e3, n = t * 60, r = n * 60, i = r * 24, a = i * 30, o = i * 365, s = (e == 1 ? Ju(10, 0, 3, kd).filter(Od) : Ju(10, -3, 0, kd)).concat([
		t,
		t * 5,
		t * 10,
		t * 15,
		t * 30,
		n,
		n * 5,
		n * 10,
		n * 15,
		n * 30,
		r,
		r * 2,
		r * 3,
		r * 4,
		r * 6,
		r * 8,
		r * 12,
		i,
		i * 2,
		i * 3,
		i * 4,
		i * 5,
		i * 6,
		i * 7,
		i * 8,
		i * 9,
		i * 10,
		i * 15,
		a,
		a * 2,
		a * 3,
		a * 4,
		a * 6,
		o,
		o * 2,
		o * 5,
		o * 10,
		o * 25,
		o * 50,
		o * 100
	]), c = [
		[
			o,
			Fd,
			Wd,
			Wd,
			Wd,
			Wd,
			Wd,
			Wd,
			1
		],
		[
			i * 28,
			"{MMM}",
			Id,
			Wd,
			Wd,
			Wd,
			Wd,
			Wd,
			1
		],
		[
			i,
			Ld,
			Id,
			Wd,
			Wd,
			Wd,
			Wd,
			Wd,
			1
		],
		[
			r,
			"{h}" + Bd,
			zd,
			Wd,
			Rd,
			Wd,
			Wd,
			Wd,
			1
		],
		[
			n,
			Vd,
			zd,
			Wd,
			Rd,
			Wd,
			Wd,
			Wd,
			1
		],
		[
			t,
			Ud,
			zd + " " + Vd,
			Wd,
			Rd + " " + Vd,
			Wd,
			Hd,
			Wd,
			1
		],
		[
			e,
			Ud + ".{fff}",
			zd + " " + Vd,
			Wd,
			Rd + " " + Vd,
			Wd,
			Hd,
			Wd,
			1
		]
	];
	function l(t) {
		return (s, c, l, u, d, f) => {
			let p = [], m = d >= o, h = d >= a && d < o, g = t(l), _ = Gu(g * e, 3), v = tf(g.getFullYear(), m ? 0 : g.getMonth(), h || m ? 1 : g.getDate()), y = Gu(v * e, 3);
			if (h || m) {
				let n = h ? d / a : 0, r = m ? d / o : 0, i = _ == y ? _ : Gu(tf(v.getFullYear() + r, v.getMonth() + n, 1) * e, 3), s = new Date(yu(i / e)), c = s.getFullYear(), l = s.getMonth();
				for (let a = 0; i <= u; a++) {
					let o = tf(c + r * a, l + n * a, 1), s = o - t(Gu(o * e, 3));
					i = Gu((+o + s) * e, 3), i <= u && p.push(i);
				}
			} else {
				let a = d >= i ? i : d, o = y + (vu(l) - vu(_)) + Uu(_ - y, a);
				p.push(o);
				let m = t(o), h = m.getHours() + m.getMinutes() / n + m.getSeconds() / r, g = d / r, v = f / s.axes[c]._space;
				for (; o = Gu(o + d, e == 1 ? 0 : 3), !(o > u);) if (g > 1) {
					let e = vu(Gu(h + g, 6)) % 24, n = t(o).getHours() - e;
					n > 1 && (n = -1), o -= n * r, h = (h + g) % 24;
					let i = p[p.length - 1];
					Gu((o - i) / d, 3) * v >= .7 && p.push(o);
				} else p.push(o);
			}
			return p;
		};
	}
	return [
		s,
		c,
		l
	];
}
var [Kd, qd, Jd] = Gd(1), [Yd, Xd, Zd] = Gd(.001);
Ju(2, -53, 53, [1]);
function Qd(e, t) {
	return e.map((e) => e.map((n, r) => r == 0 || r == 8 || n == null ? n : t(r == 1 || e[8] == 0 ? n : e[1] + n)));
}
function $d(e, t) {
	return (n, r, i, a, o) => {
		let s = t.find((e) => o >= e[0]) || t[t.length - 1], c, l, u, d, f, p;
		return r.map((t) => {
			let n = e(t), r = n.getFullYear(), i = n.getMonth(), a = n.getDate(), o = n.getHours(), m = n.getMinutes(), h = n.getSeconds(), g = r != c && s[2] || i != l && s[3] || a != u && s[4] || o != d && s[5] || m != f && s[6] || h != p && s[7] || s[1];
			return c = r, l = i, u = a, d = o, f = m, p = h, g(n);
		});
	};
}
function ef(e, t) {
	let n = Td(t);
	return (t, r, i, a, o) => r.map((t) => n(e(t)));
}
function tf(e, t, n) {
	return new Date(e, t, n);
}
function nf(e, t) {
	return t(e);
}
var rf = "{YYYY}-{MM}-{DD} {h}:{mm}{aa}";
function af(e, t) {
	return (n, r, i, a) => a == null ? Dl : t(e(r));
}
function of(e, t) {
	let n = e.series[t];
	return n.width ? n.stroke(e, t) : n.points.width ? n.points.stroke(e, t) : null;
}
function sf(e, t) {
	return e.series[t].fill(e, t);
}
var cf = {
	show: !0,
	live: !0,
	isolate: !1,
	mount: Pu,
	markers: {
		show: !0,
		width: 2,
		stroke: of,
		fill: sf,
		dash: "solid"
	},
	idx: null,
	idxs: null,
	values: []
};
function lf(e, t) {
	let n = e.cursor.points, r = zl(), i = n.size(e, t);
	Ll(r, ll, i), Ll(r, ul, i);
	let a = i / -2;
	Ll(r, "marginLeft", a), Ll(r, "marginTop", a);
	let o = n.width(e, t, i);
	return o && Ll(r, "borderWidth", o), r;
}
function uf(e, t) {
	let n = e.series[t].points;
	return n._fill || n._stroke;
}
function df(e, t) {
	let n = e.series[t].points;
	return n._stroke || n._fill;
}
function ff(e, t) {
	return e.series[t].points.size;
}
var pf = [0, 0];
function mf(e, t, n) {
	return pf[0] = t, pf[1] = n, pf;
}
function hf(e, t, n, r = !0) {
	return (e) => {
		e.button != 0 || r && e.target != t || n(e);
	};
}
function gf(e, t, n, r = !0) {
	return (e) => {
		r && e.target != t || n(e);
	};
}
var _f = {
	show: !0,
	x: !0,
	y: !0,
	lock: !1,
	move: mf,
	points: {
		one: !1,
		show: lf,
		size: ff,
		width: 0,
		stroke: df,
		fill: uf
	},
	bind: {
		mousedown: hf,
		mouseup: hf,
		click: hf,
		dblclick: hf,
		mousemove: gf,
		mouseleave: gf,
		mouseenter: gf
	},
	drag: {
		setScale: !0,
		x: !0,
		y: !1,
		dist: 0,
		uni: null,
		click: (e, t) => {
			t.stopPropagation(), t.stopImmediatePropagation();
		},
		_x: !1,
		_y: !1
	},
	focus: {
		dist: (e, t, n, r, i) => r - i,
		prox: -1,
		bias: 0
	},
	hover: {
		skip: [void 0],
		prox: null,
		bias: 0
	},
	left: -10,
	top: -10,
	idx: null,
	dataIdx: null,
	idxs: null,
	event: null
}, vf = {
	show: !0,
	stroke: "rgba(0,0,0,0.07)",
	width: 2
}, yf = sd({}, vf, { filter: Iu }), bf = sd({}, yf, { size: 10 }), xf = sd({}, vf, { show: !1 }), Sf = "12px system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"", Cf = "bold " + Sf, wf = 1.5, Tf = {
	show: !0,
	scale: "x",
	stroke: hl,
	space: 50,
	gap: 5,
	alignTo: 1,
	size: 50,
	labelGap: 0,
	labelSize: 30,
	labelFont: Cf,
	side: 2,
	grid: yf,
	ticks: bf,
	border: xf,
	font: Sf,
	lineGap: wf,
	rotate: 0
}, Ef = "Value", Df = "Time", Of = {
	show: !0,
	scale: "x",
	auto: !1,
	sorted: 1,
	min: ku,
	max: -Infinity,
	idxs: []
};
function kf(e, t, n, r, i) {
	return t.map((e) => e == null ? "" : mu(e));
}
function Af(e, t, n, r, i, a, o) {
	let s = [], c = Ku.get(i) || 0;
	n = o ? n : Gu(Uu(n, i), c);
	for (let e = n; e <= r; e = Gu(e + i, c)) s.push(Object.is(e, -0) ? 0 : e);
	return s;
}
function jf(e, t, n, r, i, a, o) {
	let s = [], c = e.scales[e.axes[t].scale].log;
	i = Cu(c, vu((c == 10 ? Tu : Eu)(n))), c == 10 && (i = Nd[Xl(i, Nd)]);
	let l = n, u = i * c;
	c == 10 && (u = Nd[Xl(u, Nd)]);
	do
		s.push(l), l += i, c == 10 && !Ku.has(l) && (l = Gu(l, Ku.get(i))), l >= u && (i = l, u = i * c, c == 10 && (u = Nd[Xl(u, Nd)]));
	while (l <= r);
	return s;
}
function Mf(e, t, n, r, i, a, o) {
	let s = e.scales[e.axes[t].scale].asinh, c = r > s ? jf(e, t, Su(s, n), r, i) : [s], l = r >= 0 && n <= 0 ? [0] : [];
	return (n < -s ? jf(e, t, Su(s, -r), -n, i) : [s]).reverse().map((e) => -e).concat(l, c);
}
var Nf = /./, Pf = /[12357]/, Ff = /[125]/, If = /1/, Lf = (e, t, n, r) => e.map((e, i) => t == 4 && e == 0 || i % r == 0 && n.test(e.toExponential()[+(e < 0)]) ? e : null);
function Rf(e, t, n, r, i) {
	let a = e.axes[n], o = a.scale, s = e.scales[o], c = e.valToPos, l = a._space, u = c(10, o), d = c(9, o) - u >= l ? Nf : c(7, o) - u >= l ? Pf : c(5, o) - u >= l ? Ff : If;
	if (d == If) {
		let e = _u(c(1, o) - u);
		if (e < l) return Lf(t.slice().reverse(), s.distr, d, bu(l / e)).reverse();
	}
	return Lf(t, s.distr, d, 1);
}
function zf(e, t, n, r, i) {
	let a = e.axes[n], o = a.scale, s = a._space, c = e.valToPos, l = _u(c(1, o) - c(2, o));
	return l < s ? Lf(t.slice().reverse(), 3, Nf, bu(s / l)).reverse() : t;
}
function Bf(e, t, n, r) {
	return r == null ? Dl : t == null ? "" : mu(t);
}
var Vf = {
	show: !0,
	scale: "y",
	stroke: hl,
	space: 30,
	gap: 5,
	alignTo: 1,
	size: 50,
	labelGap: 0,
	labelSize: 30,
	labelFont: Cf,
	side: 3,
	grid: yf,
	ticks: bf,
	border: xf,
	font: Sf,
	lineGap: wf,
	rotate: 0
};
function Hf(e, t) {
	return Gu((3 + (e || 1) * 2) * t, 3);
}
function Uf(e, t) {
	let { scale: n, idxs: r } = e.series[0], i = e._data[0], a = e.valToPos(i[r[0]], n, !0), o = _u(e.valToPos(i[r[1]], n, !0) - a) / (e.series[t].points.space * Ml);
	return r[1] - r[0] <= o;
}
var Wf = {
	scale: null,
	auto: !0,
	sorted: 0,
	min: ku,
	max: -Infinity
}, Gf = (e, t, n, r, i) => i, Kf = {
	show: !0,
	auto: !0,
	sorted: 0,
	gaps: Gf,
	alpha: 1,
	facets: [sd({}, Wf, { scale: "x" }), sd({}, Wf, { scale: "y" })]
}, qf = {
	scale: "y",
	auto: !0,
	sorted: 0,
	show: !0,
	spanGaps: !1,
	gaps: Gf,
	alpha: 1,
	points: {
		show: Uf,
		filter: null
	},
	values: null,
	min: ku,
	max: -Infinity,
	idxs: [],
	path: null,
	clip: null
};
function Jf(e, t, n, r, i) {
	return n / 10;
}
var Yf = {
	time: Hc,
	auto: !0,
	distr: 1,
	log: 10,
	asinh: 1,
	min: null,
	max: null,
	dir: 1,
	ori: 0
}, Xf = sd({}, Yf, {
	time: !1,
	ori: 1
}), Zf = {};
function Qf(e, t) {
	let n = Zf[e];
	return n || (n = {
		key: e,
		plots: [],
		sub(e) {
			n.plots.push(e);
		},
		unsub(e) {
			n.plots = n.plots.filter((t) => t != e);
		},
		pub(e, t, r, i, a, o, s) {
			for (let c = 0; c < n.plots.length; c++) n.plots[c] != t && n.plots[c].pub(e, t, r, i, a, o, s);
		}
	}, e != null && (Zf[e] = n)), n;
}
var $f = 1, ep = 2;
function tp(e, t, n) {
	let r = e.mode, i = e.series[t], a = r == 2 ? e._data[t] : e._data, o = e.scales, s = e.bbox, c = a[0], l = r == 2 ? a[1] : a[t], u = r == 2 ? o[i.facets[0].scale] : o[e.series[0].scale], d = r == 2 ? o[i.facets[1].scale] : o[i.scale], f = s.left, p = s.top, m = s.width, h = s.height, g = e.valToPosH, _ = e.valToPosV;
	return u.ori == 0 ? n(i, c, l, u, d, g, _, f, p, m, h, up, fp, mp, gp, vp) : n(i, c, l, u, d, _, g, p, f, h, m, dp, pp, hp, _p, yp);
}
function np(e, t) {
	let n = 0, r = 0, i = uu(e.bands, Xu);
	for (let e = 0; e < i.length; e++) {
		let a = i[e];
		a.series[0] == t ? n = a.dir : a.series[1] == t && (a.dir == 1 ? r |= 1 : r |= 2);
	}
	return [n, r == 1 ? -1 : r == 2 ? 1 : r == 3 ? 2 : 0];
}
function rp(e, t, n, r, i) {
	let a = e.mode, o = e.series[t], s = a == 2 ? o.facets[1].scale : o.scale, c = e.scales[s];
	return i == -1 ? c.min : i == 1 ? c.max : c.distr == 3 ? c.dir == 1 ? c.min : c.max : 0;
}
function ip(e, t, n, r, i, a) {
	return tp(e, t, (e, t, o, s, c, l, u, d, f, p, m) => {
		let h = e.pxRound, g = s.dir * (s.ori == 0 ? 1 : -1), _ = s.ori == 0 ? fp : pp, v, y;
		g == 1 ? (v = n, y = r) : (v = r, y = n);
		let b = h(l(t[v], s, p, d)), x = h(u(o[v], c, m, f)), S = h(l(t[y], s, p, d)), C = h(u(a == 1 ? c.max : c.min, c, m, f)), ee = new Path2D(i);
		return _(ee, S, C), _(ee, b, C), _(ee, b, x), ee;
	});
}
function ap(e, t, n, r, i, a) {
	let o = null;
	if (e.length > 0) {
		o = new Path2D();
		let s = t == 0 ? mp : hp, c = n;
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			if (n[1] > n[0]) {
				let e = n[0] - c;
				e > 0 && s(o, c, r, e, r + a), c = n[1];
			}
		}
		let l = n + i - c;
		l > 0 && s(o, c, r - 5, l, r + a + 10);
	}
	return o;
}
function op(e, t, n) {
	let r = e[e.length - 1];
	r && r[0] == t ? r[1] = n : e.push([t, n]);
}
function sp(e, t, n, r, i, a, o) {
	let s = [], c = e.length;
	for (let l = i == 1 ? n : r; l >= n && l <= r; l += i) if (t[l] === null) {
		let u = l, d = l;
		if (i == 1) for (; ++l <= r && t[l] === null;) d = l;
		else for (; --l >= n && t[l] === null;) d = l;
		let f = a(e[u]), p = d == u ? f : a(e[d]), m = u - i;
		f = o <= 0 && m >= 0 && m < c ? a(e[m]) : f;
		let h = d + i;
		p = o >= 0 && h >= 0 && h < c ? a(e[h]) : p, p >= f && s.push([f, p]);
	}
	return s;
}
function cp(e) {
	return e == 0 ? Fu : e == 1 ? yu : (t) => Hu(t, e);
}
function lp(e) {
	let t = e == 0 ? up : dp, n = e == 0 ? (e, t, n, r, i, a) => {
		e.arcTo(t, n, r, i, a);
	} : (e, t, n, r, i, a) => {
		e.arcTo(n, t, i, r, a);
	}, r = e == 0 ? (e, t, n, r, i) => {
		e.rect(t, n, r, i);
	} : (e, t, n, r, i) => {
		e.rect(n, t, i, r);
	};
	return (e, i, a, o, s, c = 0, l = 0) => {
		c == 0 && l == 0 ? r(e, i, a, o, s) : (c = xu(c, o / 2, s / 2), l = xu(l, o / 2, s / 2), t(e, i + c, a), n(e, i + o, a, i + o, a + s, c), n(e, i + o, a + s, i, a + s, l), n(e, i, a + s, i, a, l), n(e, i, a, i + o, a, c), e.closePath());
	};
}
var up = (e, t, n) => {
	e.moveTo(t, n);
}, dp = (e, t, n) => {
	e.moveTo(n, t);
}, fp = (e, t, n) => {
	e.lineTo(t, n);
}, pp = (e, t, n) => {
	e.lineTo(n, t);
}, mp = lp(0), hp = lp(1), gp = (e, t, n, r, i, a) => {
	e.arc(t, n, r, i, a);
}, _p = (e, t, n, r, i, a) => {
	e.arc(n, t, r, i, a);
}, vp = (e, t, n, r, i, a, o) => {
	e.bezierCurveTo(t, n, r, i, a, o);
}, yp = (e, t, n, r, i, a, o) => {
	e.bezierCurveTo(n, t, i, r, o, a);
};
function bp(e) {
	return (e, t, n, r, i) => tp(e, t, (t, a, o, s, c, l, u, d, f, p, m) => {
		let { pxRound: h, points: g } = t, _, v;
		s.ori == 0 ? (_ = up, v = gp) : (_ = dp, v = _p);
		let y = Gu(g.width * Ml, 3), b = (g.size - g.width) / 2 * Ml, x = Gu(b * 2, 3), S = new Path2D(), C = new Path2D(), { left: ee, top: te, width: w, height: T } = e.bbox;
		mp(C, ee - x, te - x, w + x * 2, T + x * 2);
		let E = (e) => {
			if (o[e] != null) {
				let t = h(l(a[e], s, p, d)), n = h(u(o[e], c, m, f));
				_(S, t + b, n), v(S, t, n, b, 0, gu * 2);
			}
		};
		if (i) i.forEach(E);
		else for (let e = n; e <= r; e++) E(e);
		return {
			stroke: y > 0 ? S : null,
			fill: S,
			clip: C,
			flags: 3
		};
	});
}
function xp(e) {
	return (t, n, r, i, a, o) => {
		r != i && (a != r && o != r && e(t, n, r), a != i && o != i && e(t, n, i), e(t, n, o));
	};
}
var Sp = xp(fp), Cp = xp(pp);
function wp(e) {
	let t = uu(e?.alignGaps, 0);
	return (e, n, r, i) => tp(e, n, (a, o, s, c, l, u, d, f, p, m, h) => {
		[r, i] = eu(s, r, i);
		let g = a.pxRound, _ = (e) => g(u(e, c, m, f)), v = (e) => g(d(e, l, h, p)), y, b;
		c.ori == 0 ? (y = fp, b = Sp) : (y = pp, b = Cp);
		let x = c.dir * (c.ori == 0 ? 1 : -1), S = {
			stroke: new Path2D(),
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: $f
		}, C = S.stroke, ee = !1;
		if (i - r >= m * 4) {
			let t = (t) => e.posToVal(t, c.key, !0), n = null, a = null, l, u, d, f = _(o[x == 1 ? r : i]), p = _(o[r]), m = _(o[i]), h = t(x == 1 ? p + 1 : m - 1);
			for (let e = x == 1 ? r : i; e >= r && e <= i; e += x) {
				let r = o[e], i = (x == 1 ? r < h : r > h) ? f : _(r), c = s[e];
				i == f ? c == null ? c === null && (ee = !0) : (u = c, n == null ? (y(C, i, v(u)), l = n = a = u) : u < n ? n = u : u > a && (a = u)) : (n != null && b(C, f, v(n), v(a), v(l), v(u)), c == null ? (n = a = null, c === null && (ee = !0)) : (u = c, y(C, i, v(u)), n = a = l = u), f = i, h = t(f + x));
			}
			n != null && n != a && d != f && b(C, f, v(n), v(a), v(l), v(u));
		} else for (let e = x == 1 ? r : i; e >= r && e <= i; e += x) {
			let t = s[e];
			t === null ? ee = !0 : t != null && y(C, _(o[e]), v(t));
		}
		let [te, w] = np(e, n);
		if (a.fill != null || te != 0) {
			let t = S.fill = new Path2D(C), s = v(a.fillTo(e, n, a.min, a.max, te)), c = _(o[r]), l = _(o[i]);
			x == -1 && ([l, c] = [c, l]), y(t, l, s), y(t, c, s);
		}
		if (!a.spanGaps) {
			let l = [];
			ee && l.push(...sp(o, s, r, i, x, _, t)), S.gaps = l = a.gaps(e, n, r, i, l), S.clip = ap(l, c.ori, f, p, m, h);
		}
		return w != 0 && (S.band = w == 2 ? [ip(e, n, r, i, C, -1), ip(e, n, r, i, C, 1)] : ip(e, n, r, i, C, w)), S;
	});
}
function Tp(e) {
	let t = uu(e.align, 1), n = uu(e.ascDesc, !1), r = uu(e.alignGaps, 0), i = uu(e.extend, !1);
	return (e, a, o, s) => tp(e, a, (c, l, u, d, f, p, m, h, g, _, v) => {
		[o, s] = eu(u, o, s);
		let y = c.pxRound, { left: b, width: x } = e.bbox, S = (e) => y(p(e, d, _, h)), C = (e) => y(m(e, f, v, g)), ee = d.ori == 0 ? fp : pp, te = {
			stroke: new Path2D(),
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: $f
		}, w = te.stroke, T = d.dir * (d.ori == 0 ? 1 : -1), E = C(u[T == 1 ? o : s]), D = S(l[T == 1 ? o : s]), ne = D, O = D;
		i && t == -1 && (O = b, ee(w, O, E)), ee(w, D, E);
		for (let e = T == 1 ? o : s; e >= o && e <= s; e += T) {
			let n = u[e];
			if (n == null) continue;
			let r = S(l[e]), i = C(n);
			t == 1 ? ee(w, r, E) : ee(w, ne, i), ee(w, r, i), E = i, ne = r;
		}
		let k = ne;
		i && t == 1 && (k = b + x, ee(w, k, E));
		let [re, A] = np(e, a);
		if (c.fill != null || re != 0) {
			let t = te.fill = new Path2D(w), n = C(c.fillTo(e, a, c.min, c.max, re));
			ee(t, k, n), ee(t, O, n);
		}
		if (!c.spanGaps) {
			let i = [];
			i.push(...sp(l, u, o, s, T, S, r));
			let f = c.width * Ml / 2, p = n || t == 1 ? f : -f, m = n || t == -1 ? -f : f;
			i.forEach((e) => {
				e[0] += p, e[1] += m;
			}), te.gaps = i = c.gaps(e, a, o, s, i), te.clip = ap(i, d.ori, h, g, _, v);
		}
		return A != 0 && (te.band = A == 2 ? [ip(e, a, o, s, w, -1), ip(e, a, o, s, w, 1)] : ip(e, a, o, s, w, A)), te;
	});
}
function Ep(e, t, n, r, i, a, o = ku) {
	if (e.length > 1) {
		let s = null;
		for (let c = 0, l = Infinity; c < e.length; c++) if (t[c] !== void 0) {
			if (s != null) {
				let t = _u(e[c] - e[s]);
				t < l && (l = t, o = _u(n(e[c], r, i, a) - n(e[s], r, i, a)));
			}
			s = c;
		}
	}
	return o;
}
function Dp(e) {
	e ||= Yu;
	let t = uu(e.size, [
		.6,
		ku,
		1
	]), n = e.align || 0, r = e.gap || 0, i = e.radius;
	i = i == null ? [0, 0] : typeof i == "number" ? [i, 0] : i;
	let a = Nu(i), o = 1 - t[0], s = uu(t[1], ku), c = uu(t[2], 1), l = uu(e.disp, Yu), u = uu(e.each, (e) => {}), { fill: d, stroke: f } = l;
	return (e, t, i, p) => tp(e, t, (m, h, g, _, v, y, b, x, S, C, ee) => {
		let te = m.pxRound, w = n, T = r * Ml, E = s * Ml, D = c * Ml, ne, O;
		_.ori == 0 ? [ne, O] = a(e, t) : [O, ne] = a(e, t);
		let k = _.dir * (_.ori == 0 ? 1 : -1), re = _.ori == 0 ? mp : hp, A = _.ori == 0 ? u : (e, t, n, r, i, a, o) => {
			u(e, t, n, i, r, o, a);
		}, j = uu(e.bands, Xu).find((e) => e.series[0] == t), ie = j == null ? 0 : j.dir, M = m.fillTo(e, t, m.min, m.max, ie), N = te(b(M, v, ee, S)), P, F, ae, oe = C, se = te(m.width * Ml), ce = !1, le = null, ue = null, de = null, fe = null;
		d != null && (se == 0 || f != null) && (ce = !0, le = d.values(e, t, i, p), ue = /* @__PURE__ */ new Map(), new Set(le).forEach((e) => {
			e != null && ue.set(e, new Path2D());
		}), se > 0 && (de = f.values(e, t, i, p), fe = /* @__PURE__ */ new Map(), new Set(de).forEach((e) => {
			e != null && fe.set(e, new Path2D());
		})));
		let { x0: pe, size: me } = l;
		if (pe != null && me != null) {
			w = 1, h = pe.values(e, t, i, p), pe.unit == 2 && (h = h.map((t) => e.posToVal(x + t * C, _.key, !0)));
			let n = me.values(e, t, i, p);
			F = me.unit == 2 ? n[0] * C : y(n[0], _, C, x) - y(0, _, C, x), oe = Ep(h, g, y, _, C, x, oe), ae = oe - F + T;
		} else oe = Ep(h, g, y, _, C, x, oe), ae = oe * o + T, F = oe - ae;
		ae < 1 && (ae = 0), se >= F / 2 && (se = 0), ae < 5 && (te = Fu);
		let he = ae > 0, ge = oe - ae - (he ? se : 0);
		F = te(ju(ge, D, E)), P = (w == 0 ? F / 2 : w == k ? 0 : F) - w * k * ((w == 0 ? T / 2 : 0) + (he ? se / 2 : 0));
		let _e = {
			stroke: null,
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: 0
		}, ve = ce ? null : new Path2D(), ye = null;
		if (j != null) ye = e.data[j.series[1]];
		else {
			let { y0: n, y1: r } = l;
			n != null && r != null && (g = r.values(e, t, i, p), ye = n.values(e, t, i, p));
		}
		let be = ne * F, xe = O * F;
		for (let n = k == 1 ? i : p; n >= i && n <= p; n += k) {
			let r = g[n];
			if (r == null) continue;
			if (ye != null) {
				let e = ye[n] ?? 0;
				if (r - e == 0) continue;
				N = b(e, v, ee, S);
			}
			let i = y(_.distr != 2 || l != null ? h[n] : n, _, C, x), a = b(uu(r, M), v, ee, S), o = te(i - P), s = te(Su(a, N)), c = te(xu(a, N)), u = s - c;
			if (r != null) {
				let i = r < 0 ? xe : be, a = r < 0 ? be : xe;
				ce ? (se > 0 && de[n] != null && re(fe.get(de[n]), o, c + vu(se / 2), F, Su(0, u - se), i, a), le[n] != null && re(ue.get(le[n]), o, c + vu(se / 2), F, Su(0, u - se), i, a)) : re(ve, o, c + vu(se / 2), F, Su(0, u - se), i, a), A(e, t, n, o - se / 2, c, F + se, u);
			}
		}
		return se > 0 ? _e.stroke = ce ? fe : ve : ce || (_e._fill = m.width == 0 ? m._fill : m._stroke ?? m._fill, _e.width = 0), _e.fill = ce ? ue : ve, _e;
	});
}
function Op(e, t) {
	let n = uu(t?.alignGaps, 0);
	return (t, r, i, a) => tp(t, r, (o, s, c, l, u, d, f, p, m, h, g) => {
		[i, a] = eu(c, i, a);
		let _ = o.pxRound, v = (e) => _(d(e, l, h, p)), y = (e) => _(f(e, u, g, m)), b, x, S;
		l.ori == 0 ? (b = up, S = fp, x = vp) : (b = dp, S = pp, x = yp);
		let C = l.dir * (l.ori == 0 ? 1 : -1), ee = v(s[C == 1 ? i : a]), te = ee, w = [], T = [];
		for (let e = C == 1 ? i : a; e >= i && e <= a; e += C) if (c[e] != null) {
			let t = s[e], n = v(t);
			w.push(te = n), T.push(y(c[e]));
		}
		let E = {
			stroke: e(w, T, b, S, x, _),
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: $f
		}, D = E.stroke, [ne, O] = np(t, r);
		if (o.fill != null || ne != 0) {
			let e = E.fill = new Path2D(D), n = y(o.fillTo(t, r, o.min, o.max, ne));
			S(e, te, n), S(e, ee, n);
		}
		if (!o.spanGaps) {
			let e = [];
			e.push(...sp(s, c, i, a, C, v, n)), E.gaps = e = o.gaps(t, r, i, a, e), E.clip = ap(e, l.ori, p, m, h, g);
		}
		return O != 0 && (E.band = O == 2 ? [ip(t, r, i, a, D, -1), ip(t, r, i, a, D, 1)] : ip(t, r, i, a, D, O)), E;
	});
}
function kp(e) {
	return Op(Ap, e);
}
function Ap(e, t, n, r, i, a) {
	let o = e.length;
	if (o < 2) return null;
	let s = new Path2D();
	if (n(s, e[0], t[0]), o == 2) r(s, e[1], t[1]);
	else {
		let n = Array(o), r = Array(o - 1), a = Array(o - 1), c = Array(o - 1);
		for (let n = 0; n < o - 1; n++) a[n] = t[n + 1] - t[n], c[n] = e[n + 1] - e[n], r[n] = a[n] / c[n];
		n[0] = r[0];
		for (let e = 1; e < o - 1; e++) r[e] === 0 || r[e - 1] === 0 || r[e - 1] > 0 != r[e] > 0 ? n[e] = 0 : (n[e] = 3 * (c[e - 1] + c[e]) / ((2 * c[e] + c[e - 1]) / r[e - 1] + (c[e] + 2 * c[e - 1]) / r[e]), isFinite(n[e]) || (n[e] = 0));
		n[o - 1] = r[o - 2];
		for (let r = 0; r < o - 1; r++) i(s, e[r] + c[r] / 3, t[r] + n[r] * c[r] / 3, e[r + 1] - c[r] / 3, t[r + 1] - n[r + 1] * c[r] / 3, e[r + 1], t[r + 1]);
	}
	return s;
}
var jp = /* @__PURE__ */ new Set();
function Mp() {
	for (let e of jp) e.syncRect(!0);
}
Ol && (Jl(Cl, Al, Mp), Jl(wl, Al, Mp, !0), Jl(El, Al, () => {
	Jp.pxRatio = Ml;
}));
var Np = wp(), Pp = bp();
function Fp(e, t, n, r) {
	return (r ? [e[0], e[1]].concat(e.slice(2)) : [e[0]].concat(e.slice(1))).map((e, r) => Lp(e, r, t, n));
}
function Ip(e, t) {
	return e.map((e, n) => n == 0 ? {} : sd({}, t, e));
}
function Lp(e, t, n, r) {
	return sd({}, t == 0 ? n : r, e);
}
function Rp(e, t, n) {
	return t == null ? Zu : [t, n];
}
var zp = Rp;
function Bp(e, t, n) {
	return t == null ? Zu : lu(t, n, au, !0);
}
function Vp(e, t, n, r) {
	return t == null ? Zu : ru(t, n, e.scales[r].log, !1);
}
var Hp = Vp;
function Up(e, t, n, r) {
	return t == null ? Zu : iu(t, n, e.scales[r].log, !1);
}
var Wp = Up;
function Gp(e, t, n, r, i) {
	let a = Su(Au(e), Au(t)), o = t - e, s = Xl(i / r * o, n);
	do {
		let e = n[s], t = r * e / o;
		if (t >= i && a + (e < 5 ? Ku.get(e) : 0) <= 17) return [e, t];
	} while (++s < n.length);
	return [0, 0];
}
function Kp(e) {
	let t, n;
	return e = e.replace(/(\d+)px/, (e, r) => (t = yu((n = +r) * Ml)) + "px"), [
		e,
		t,
		n
	];
}
function qp(e) {
	e.show && [e.font, e.labelFont].forEach((e) => {
		let t = Gu(e[2] * Ml, 1);
		e[0] = e[0].replace(/[0-9.]+px/, t + "px"), e[1] = t;
	});
}
function Jp(e, t, n) {
	let r = { mode: uu(e.mode, 1) }, i = r.mode;
	function a(e, t, n, r) {
		let i = t.valToPct(e);
		return r + n * (t.dir == -1 ? 1 - i : i);
	}
	function o(e, t, n, r) {
		let i = t.valToPct(e);
		return r + n * (t.dir == -1 ? i : 1 - i);
	}
	function s(e, t, n, r) {
		return t.ori == 0 ? a(e, t, n, r) : o(e, t, n, r);
	}
	r.valToPosH = a, r.valToPosV = o;
	let c = !1;
	r.status = 0;
	let l = r.root = zl(Uc);
	if (e.id != null && (l.id = e.id), Fl(l, e.class), e.title) {
		let t = zl(Kc, l);
		t.textContent = e.title;
	}
	let u = Rl("canvas"), d = r.ctx = u.getContext("2d"), f = zl(qc, l);
	Jl("click", f, (e) => {
		e.target === m && (an != en || on != tn) && cn.click(r, e);
	}, !0);
	let p = r.under = zl(Jc, f);
	f.appendChild(u);
	let m = r.over = zl(Yc, f);
	e = od(e);
	let h = +uu(e.pxAlign, 1), g = cp(h);
	(e.plugins || []).forEach((t) => {
		t.opts && (e = t.opts(r, e) || e);
	});
	let _ = e.ms || .001, v = r.series = i == 1 ? Fp(e.series || [], Of, qf, !1) : Ip(e.series || [null], Kf), y = r.axes = Fp(e.axes || [], Tf, Vf, !0), b = r.scales = {}, x = r.bands = e.bands || [];
	x.forEach((e) => {
		e.fill = Nu(e.fill || null), e.dir = uu(e.dir, -1);
	});
	let S = i == 2 ? v[1].facets[0].scale : v[0].scale, C = {
		axes: Bt,
		series: kt
	}, ee = (e.drawOrder || ["axes", "series"]).map((e) => C[e]);
	function te(e) {
		let t = e.distr == 3 ? (t) => Tu(t > 0 ? t : e.clamp(r, t, e.min, e.max, e.key)) : e.distr == 4 ? (t) => Ou(t, e.asinh) : e.distr == 100 ? (t) => e.fwd(t) : (e) => e;
		return (n) => {
			let r = t(n), { _min: i, _max: a } = e, o = a - i;
			return (r - i) / o;
		};
	}
	function w(t) {
		let n = b[t];
		if (n == null) {
			let r = (e.scales || Yu)[t] || Yu;
			if (r.from != null) {
				w(r.from);
				let e = sd({}, b[r.from], r, { key: t });
				e.valToPct = te(e), b[t] = e;
			} else {
				n = b[t] = sd({}, t == S ? Yf : Xf, r), n.key = t;
				let e = n.time, a = n.range, o = Qu(a);
				if ((t != S || i == 2 && !e) && (o && (a[0] == null || a[1] == null) && (a = {
					min: a[0] == null ? ou : {
						mode: 1,
						hard: a[0],
						soft: a[0]
					},
					max: a[1] == null ? ou : {
						mode: 1,
						hard: a[1],
						soft: a[1]
					}
				}, o = !1), !o && nd(a))) {
					let e = a;
					a = (t, n, r) => n == null ? Zu : lu(n, r, e);
				}
				n.range = Nu(a || (e ? zp : t == S ? n.distr == 3 ? Hp : n.distr == 4 ? Wp : Rp : n.distr == 3 ? Vp : n.distr == 4 ? Up : Bp)), n.auto = Nu(!o && n.auto), n.clamp = Nu(n.clamp || Jf), n._min = n._max = null, n.valToPct = te(n);
			}
		}
	}
	w("x"), w("y"), i == 1 && v.forEach((e) => {
		w(e.scale);
	}), y.forEach((e) => {
		w(e.scale);
	});
	for (let t in e.scales) w(t);
	let T = b[S], E = T.distr, D, ne;
	T.ori == 0 ? (Fl(l, Wc), D = a, ne = o) : (Fl(l, Gc), D = o, ne = a);
	let O = {};
	for (let e in b) {
		let t = b[e];
		(t.min != null || t.max != null) && (O[e] = {
			min: t.min,
			max: t.max
		}, t.min = t.max = null);
	}
	let k = e.tzDate || ((e) => new Date(yu(e / _))), re = e.fmtDate || Td, A = _ == 1 ? Jd(k) : Zd(k), j = $d(k, Qd(_ == 1 ? qd : Xd, re)), ie = af(k, nf(rf, re)), M = [], N = r.legend = sd({}, cf, e.legend), P = r.cursor = sd({}, _f, { drag: { y: i == 2 } }, e.cursor), F = N.show, ae = P.show, oe = N.markers;
	N.idxs = M, oe.width = Nu(oe.width), oe.dash = Nu(oe.dash), oe.stroke = Nu(oe.stroke), oe.fill = Nu(oe.fill);
	let se, ce, le, ue = [], de = [], fe, pe = !1, me = {};
	if (N.live) {
		let e = v[1] ? v[1].values : null;
		pe = e != null, fe = pe ? e(r, 1, 0) : { _: 0 };
		for (let e in fe) me[e] = Dl;
	}
	if (F) {
		if (se = Rl("table", nl, l), le = Rl("tbody", null, se), N.mount(r, se), pe) {
			ce = Rl("thead", null, se, le);
			let e = Rl("tr", null, ce);
			for (var he in Rl("th", null, e), fe) Rl("th", sl, e).textContent = he;
		} else Fl(se, il), N.live && Fl(se, rl);
	}
	let ge = { show: !0 }, _e = { show: !1 };
	function ve(e, t) {
		if (t == 0 && (pe || !N.live || i == 2)) return Zu;
		let n = [], a = Rl("tr", al, le, le.childNodes[t]);
		Fl(a, e.class), e.show || Fl(a, Zc);
		let o = Rl("th", null, a);
		if (oe.show) {
			let e = zl(ol, o);
			if (t > 0) {
				let n = oe.width(r, t);
				n && (e.style.border = n + "px " + oe.dash(r, t) + " " + oe.stroke(r, t)), e.style.background = oe.fill(r, t);
			}
		}
		let s = zl(sl, o);
		for (var c in e.label instanceof HTMLElement ? s.appendChild(e.label) : s.textContent = e.label, t > 0 && (oe.show || (s.style.color = e.width > 0 ? oe.stroke(r, t) : oe.fill(r, t)), be("click", o, (t) => {
			if (P._lock) return;
			We(t);
			let n = v.indexOf(e);
			if ((t.ctrlKey || t.metaKey) != N.isolate) {
				let e = v.some((e, t) => t > 0 && t != n && e.show);
				v.forEach((t, r) => {
					r > 0 && gn(r, e ? r == n ? ge : _e : ge, !0, Zn.setSeries);
				});
			} else gn(n, { show: !e.show }, !0, Zn.setSeries);
		}, !1), qe && be(bl, o, (t) => {
			P._lock || (We(t), gn(v.indexOf(e), xn, !0, Zn.setSeries));
		}, !1)), fe) {
			let e = Rl("td", cl, a);
			e.textContent = "--", n.push(e);
		}
		return [a, n];
	}
	let ye = /* @__PURE__ */ new Map();
	function be(e, t, n, i = !0) {
		let a = ye.get(t) || {}, o = P.bind[e](r, t, n, i);
		o && (Jl(e, t, a[e] = o), ye.set(t, a));
	}
	function xe(e, t, n) {
		let r = ye.get(t) || {};
		for (let n in r) (e == null || n == e) && (Yl(n, t, r[n]), delete r[n]);
		e ?? ye.delete(t);
	}
	let Se = 0, Ce = 0, we = 0, I = 0, Te = 0, Ee = 0, De = Te, Oe = Ee, ke = we, Ae = I, je = 0, R = 0, Me = 0, z = 0;
	r.bbox = {};
	let Ne = !1, Pe = !1, B = !1, Fe = !1, Ie = !1, Le = !1;
	function Re(e, t, n) {
		(n || e != r.width || t != r.height) && ze(e, t), Vt(!1), B = !0, Pe = !0, Kt();
	}
	function ze(e, t) {
		r.width = Se = we = e, r.height = Ce = I = t, Te = Ee = 0, He(), Ue();
		let n = r.bbox;
		je = n.left = Hu(Te * Ml, .5), R = n.top = Hu(Ee * Ml, .5), Me = n.width = Hu(we * Ml, .5), z = n.height = Hu(I * Ml, .5);
	}
	function Be() {
		let e = !1, t = 0;
		for (; !e;) {
			t++;
			let n = Rt(t), i = zt(t);
			e = t == 3 || n && i, e || (ze(r.width, r.height), Pe = !0);
		}
	}
	function Ve({ width: e, height: t }) {
		Re(e, t);
	}
	r.setSize = Ve;
	function He() {
		let e = !1, t = !1, n = !1, r = !1;
		y.forEach((i, a) => {
			if (i.show && i._show) {
				let { side: a, _size: o } = i, s = a % 2, c = o + (i.label == null ? 0 : i.labelSize);
				c > 0 && (s ? (we -= c, a == 3 ? (Te += c, r = !0) : n = !0) : (I -= c, a == 0 ? (Ee += c, e = !0) : t = !0));
			}
		}), tt[0] = e, tt[1] = n, tt[2] = t, tt[3] = r, we -= at[1] + at[3], Te += at[3], I -= at[2] + at[0], Ee += at[0];
	}
	function Ue() {
		let e = Te + we, t = Ee + I, n = Te, r = Ee;
		function i(i, a) {
			switch (i) {
				case 1: return e += a, e - a;
				case 2: return t += a, t - a;
				case 3: return n -= a, n + a;
				case 0: return r -= a, r + a;
			}
		}
		y.forEach((e, t) => {
			if (e.show && e._show) {
				let t = e.side;
				e._pos = i(t, e._size), e.label != null && (e._lpos = i(t, e.labelSize));
			}
		});
	}
	if (P.dataIdx == null) {
		let e = P.hover, n = e.skip = new Set(e.skip ?? []);
		n.add(void 0);
		let r = e.prox = Nu(e.prox), i = e.bias ??= 0;
		P.dataIdx = (e, a, o, s) => {
			if (a == 0) return o;
			let c = o, l = r(e, a, o, s) ?? ku, u = l >= 0 && l < ku, d = T.ori == 0 ? we : I, f = P.left, p = t[0], m = t[a];
			if (n.has(m[o])) {
				c = null;
				let e = null, t = null, r;
				if (i == 0 || i == -1) for (r = o; e == null && r-- > 0;) n.has(m[r]) || (e = r);
				if (i == 0 || i == 1) for (r = o; t == null && r++ < m.length;) n.has(m[r]) || (t = r);
				if (e != null || t != null) {
					if (u) {
						let n = e == null ? -Infinity : D(p[e], T, d, 0), r = t == null ? Infinity : D(p[t], T, d, 0), i = f - n, a = r - f;
						i <= a ? i <= l && (c = e) : a <= l && (c = t);
					} else c = t == null ? e : e == null ? t : o - e <= t - o ? e : t;
				}
			} else u && _u(f - D(p[o], T, d, 0)) > l && (c = null);
			return c;
		};
	}
	let We = (e) => {
		P.event = e;
	};
	P.idxs = M, P._lock = !1;
	let Ge = P.points;
	Ge.show = Nu(Ge.show), Ge.size = Nu(Ge.size), Ge.stroke = Nu(Ge.stroke), Ge.width = Nu(Ge.width), Ge.fill = Nu(Ge.fill);
	let Ke = r.focus = sd({}, e.focus || { alpha: .3 }, P.focus), qe = Ke.prox >= 0, Je = qe && Ge.one, V = [], Ye = [], Xe = [];
	function Ze(e, t) {
		let n = Ge.show(r, t);
		if (n instanceof HTMLElement) return Fl(n, tl), Fl(n, e.class), Vl(n, -10, -10, we, I), m.insertBefore(n, V[t]), n;
	}
	function Qe(e, t) {
		if (i == 1 || t > 0) {
			let t = i == 1 && b[e.scale].time, n = e.value;
			e.value = t ? td(n) ? af(k, nf(n, re)) : n || ie : n || Bf, e.label = e.label || (t ? Df : Ef);
		}
		if (Je || t > 0) {
			e.width = e.width == null ? 1 : e.width, e.paths = e.paths || Np || Lu, e.fillTo = Nu(e.fillTo || rp), e.pxAlign = +uu(e.pxAlign, h), e.pxRound = cp(e.pxAlign), e.stroke = Nu(e.stroke || null), e.fill = Nu(e.fill || null), e._stroke = e._fill = e._paths = e._focus = null;
			let t = Hf(Su(1, e.width), 1), n = e.points = sd({}, {
				size: t,
				width: Su(1, t * .2),
				stroke: e.stroke,
				space: t * 2,
				paths: Pp,
				_stroke: null,
				_fill: null
			}, e.points);
			n.show = Nu(n.show), n.filter = Nu(n.filter), n.fill = Nu(n.fill), n.stroke = Nu(n.stroke), n.paths = Nu(n.paths), n.pxAlign = e.pxAlign;
		}
		if (F) {
			let n = ve(e, t);
			ue.splice(t, 0, n[0]), de.splice(t, 0, n[1]), N.values.push(null);
		}
		if (ae) {
			M.splice(t, 0, null);
			let n = null;
			Je ? t == 0 && (n = Ze(e, t)) : t > 0 && (n = Ze(e, t)), V.splice(t, 0, n), Ye.splice(t, 0, 0), Xe.splice(t, 0, 0);
		}
		Yn("addSeries", t);
	}
	function $e(e, t) {
		t ??= v.length, e = i == 1 ? Lp(e, t, Of, qf) : Lp(e, t, {}, Kf), v.splice(t, 0, e), Qe(v[t], t);
	}
	r.addSeries = $e;
	function et(e) {
		if (v.splice(e, 1), F) {
			N.values.splice(e, 1), de.splice(e, 1);
			let t = ue.splice(e, 1)[0];
			xe(null, t.firstChild), t.remove();
		}
		ae && (M.splice(e, 1), V.splice(e, 1)[0].remove(), Ye.splice(e, 1), Xe.splice(e, 1)), Yn("delSeries", e);
	}
	r.delSeries = et;
	let tt = [
		!1,
		!1,
		!1,
		!1
	];
	function nt(e, t) {
		if (e._show = e.show, e.show) {
			let n = e.side % 2, i = b[e.scale];
			i ??= (e.scale = n ? v[1].scale : S, b[e.scale]);
			let a = i.time;
			e.size = Nu(e.size), e.space = Nu(e.space), e.rotate = Nu(e.rotate), Qu(e.incrs) && e.incrs.forEach((e) => {
				!Ku.has(e) && Ku.set(e, qu(e));
			}), e.incrs = Nu(e.incrs || (i.distr == 2 ? Md : a ? _ == 1 ? Kd : Yd : Nd)), e.splits = Nu(e.splits || (a && i.distr == 1 ? A : i.distr == 3 ? jf : i.distr == 4 ? Mf : Af)), e.stroke = Nu(e.stroke), e.grid.stroke = Nu(e.grid.stroke), e.ticks.stroke = Nu(e.ticks.stroke), e.border.stroke = Nu(e.border.stroke);
			let o = e.values;
			e.values = Qu(o) && !Qu(o[0]) ? Nu(o) : a ? Qu(o) ? $d(k, Qd(o, re)) : td(o) ? ef(k, o) : o || j : o || kf, e.filter = Nu(e.filter || (i.distr >= 3 && i.log == 10 ? Rf : i.distr == 3 && i.log == 2 ? zf : Iu)), e.font = Kp(e.font), e.labelFont = Kp(e.labelFont), e._size = e.size(r, null, t, 0), e._space = e._rotate = e._incrs = e._found = e._splits = e._values = null, e._size > 0 && (tt[t] = !0, e._el = zl(Xc, f));
		}
	}
	function rt(e, t, n, r) {
		let [i, a, o, s] = n, c = t % 2, l = 0;
		return c == 0 && (s || a) && (l = t == 0 && !i || t == 2 && !o ? yu(Tf.size / 3) : 0), c == 1 && (i || o) && (l = t == 1 && !a || t == 3 && !s ? yu(Vf.size / 2) : 0), l;
	}
	let it = r.padding = (e.padding || [
		rt,
		rt,
		rt,
		rt
	]).map((e) => Nu(uu(e, rt))), at = r._padding = it.map((e, t) => e(r, t, tt, 0)), ot, st = null, ct = null, lt = i == 1 ? v[0].idxs : null, ut = null, dt = !1;
	function ft(e, n) {
		if (t = e ?? [], r.data = r._data = t, i == 2) {
			ot = 0;
			for (let e = 1; e < v.length; e++) ot += t[e][0].length;
		} else {
			t.length == 0 && (r.data = r._data = t = [[]]), ut = t[0], ot = ut.length;
			let e = t;
			if (E == 2) {
				e = t.slice();
				let n = e[0] = Array(ot);
				for (let e = 0; e < ot; e++) n[e] = e;
			}
			r._data = t = e;
		}
		if (Vt(!0), Yn("setData"), E == 2 && (B = !0), n !== !1) {
			let e = T;
			e.auto(r, dt) ? pt() : hn(S, e.min, e.max), Fe ||= P.left >= 0, Le = !0, Kt();
		}
	}
	r.setData = ft;
	function pt() {
		dt = !0;
		let e, n;
		i == 1 && (ot > 0 ? (st = lt[0] = 0, ct = lt[1] = ot - 1, e = t[0][st], n = t[0][ct], E == 2 ? (e = st, n = ct) : e == n && (E == 3 ? [e, n] = ru(e, e, T.log, !1) : E == 4 ? [e, n] = iu(e, e, T.log, !1) : T.time ? n = e + yu(86400 / _) : [e, n] = lu(e, n, au, !0))) : (st = lt[0] = e = null, ct = lt[1] = n = null)), hn(S, e, n);
	}
	let mt, ht, gt, _t, vt, yt, bt, xt, St, H;
	function Ct(e, t, n, r, i, a) {
		e ??= gl, n ??= Xu, r ??= "butt", i ??= gl, a ??= "round", e != mt && (d.strokeStyle = mt = e), i != ht && (d.fillStyle = ht = i), t != gt && (d.lineWidth = gt = t), a != vt && (d.lineJoin = vt = a), r != yt && (d.lineCap = yt = r), n != _t && d.setLineDash(_t = n);
	}
	function wt(e, t, n, r) {
		t != ht && (d.fillStyle = ht = t), e != bt && (d.font = bt = e), n != xt && (d.textAlign = xt = n), r != St && (d.textBaseline = St = r);
	}
	function Tt(e, t, n, i, a = 0) {
		if (i.length > 0 && e.auto(r, dt) && (t == null || t.min == null)) {
			let t = uu(st, 0), r = uu(ct, i.length - 1), o = n.min == null ? nu(i, t, r, a, e.distr == 3) : [n.min, n.max];
			e.min = xu(e.min, n.min = o[0]), e.max = Su(e.max, n.max = o[1]);
		}
	}
	let Et = {
		min: null,
		max: null
	};
	function Dt() {
		for (let e in b) {
			let t = b[e];
			O[e] == null && (t.min == null || O[S] != null && t.auto(r, dt)) && (O[e] = Et);
		}
		for (let e in b) {
			let t = b[e];
			O[e] == null && t.from != null && O[t.from] != null && (O[e] = Et);
		}
		O[S] != null && Vt(!0);
		let e = {};
		for (let t in O) {
			let n = O[t];
			if (n != null) {
				let a = e[t] = od(b[t], rd);
				if (n.min != null) sd(a, n);
				else if (t != S || i == 2) {
					if (ot == 0 && a.from == null) {
						let e = a.range(r, null, null, t);
						a.min = e[0], a.max = e[1];
					} else a.min = ku, a.max = -Infinity;
				}
			}
		}
		if (ot > 0) {
			v.forEach((n, a) => {
				if (i == 1) {
					let i = n.scale, o = O[i];
					if (o == null) return;
					let s = e[i];
					if (a == 0) {
						let e = s.range(r, s.min, s.max, i);
						s.min = e[0], s.max = e[1], st = Xl(s.min, t[0]), ct = Xl(s.max, t[0]), ct - st > 1 && (t[0][st] < s.min && st++, t[0][ct] > s.max && ct--), n.min = ut[st], n.max = ut[ct];
					} else n.show && n.auto && Tt(s, o, n, t[a], n.sorted);
					n.idxs[0] = st, n.idxs[1] = ct;
				} else if (a > 0 && n.show && n.auto) {
					let [r, i] = n.facets, o = r.scale, s = i.scale, [c, l] = t[a], u = e[o], d = e[s];
					u != null && Tt(u, O[o], r, c, r.sorted), d != null && Tt(d, O[s], i, l, i.sorted), n.min = i.min, n.max = i.max;
				}
			});
			for (let t in e) {
				let n = e[t], i = O[t];
				if (n.from == null && (i == null || i.min == null)) {
					let e = n.range(r, n.min == ku ? null : n.min, n.max == -Infinity ? null : n.max, t);
					n.min = e[0], n.max = e[1];
				}
			}
		}
		for (let t in e) {
			let n = e[t];
			if (n.from != null) {
				let i = e[n.from];
				if (i.min == null) n.min = n.max = null;
				else {
					let e = n.range(r, i.min, i.max, t);
					n.min = e[0], n.max = e[1];
				}
			}
		}
		let n = {}, a = !1;
		for (let t in e) {
			let r = e[t], i = b[t];
			if (i.min != r.min || i.max != r.max) {
				i.min = r.min, i.max = r.max;
				let e = i.distr;
				i._min = e == 3 ? Tu(i.min) : e == 4 ? Ou(i.min, i.asinh) : e == 100 ? i.fwd(i.min) : i.min, i._max = e == 3 ? Tu(i.max) : e == 4 ? Ou(i.max, i.asinh) : e == 100 ? i.fwd(i.max) : i.max, n[t] = a = !0;
			}
		}
		if (a) {
			v.forEach((e, t) => {
				i == 2 ? t > 0 && n.y && (e._paths = null) : n[e.scale] && (e._paths = null);
			});
			for (let e in n) B = !0, Yn("setScale", e);
			ae && P.left >= 0 && (Fe = Le = !0);
		}
		for (let e in O) O[e] = null;
	}
	function Ot(e) {
		let t = ju(st - 1, 0, ot - 1), n = ju(ct + 1, 0, ot - 1);
		for (; e[t] == null && t > 0;) t--;
		for (; e[n] == null && n < ot - 1;) n++;
		return [t, n];
	}
	function kt() {
		if (ot > 0) {
			let e = v.some((e) => e._focus) && H != Ke.alpha;
			e && (d.globalAlpha = H = Ke.alpha), v.forEach((e, n) => {
				if (n > 0 && e.show && (At(n, !1), At(n, !0), e._paths == null)) {
					let a = H;
					H != e.alpha && (d.globalAlpha = H = e.alpha);
					let o = i == 2 ? [0, t[n][0].length - 1] : Ot(t[n]);
					e._paths = e.paths(r, n, o[0], o[1]), H != a && (d.globalAlpha = H = a);
				}
			}), v.forEach((e, t) => {
				if (t > 0 && e.show) {
					let n = H;
					H != e.alpha && (d.globalAlpha = H = e.alpha), e._paths != null && jt(t, !1);
					{
						let n = e._paths == null ? null : e._paths.gaps, i = e.points.show(r, t, st, ct, n), a = e.points.filter(r, t, i, n);
						(i || a) && (e.points._paths = e.points.paths(r, t, st, ct, a), jt(t, !0));
					}
					H != n && (d.globalAlpha = H = n), Yn("drawSeries", t);
				}
			}), e && (d.globalAlpha = H = 1);
		}
	}
	function At(e, t) {
		let n = t ? v[e].points : v[e];
		n._stroke = n.stroke(r, e), n._fill = n.fill(r, e);
	}
	function jt(e, t) {
		let n = t ? v[e].points : v[e], { stroke: r, fill: i, clip: a, flags: o, _stroke: s = n._stroke, _fill: c = n._fill, _width: l = n.width } = n._paths;
		l = Gu(l * Ml, 3);
		let u = null, f = l % 2 / 2;
		t && c == null && (c = l > 0 ? "#fff" : s);
		let p = n.pxAlign == 1 && f > 0;
		if (p && d.translate(f, f), !t) {
			let e = je - l / 2, t = R - l / 2, n = Me + l, r = z + l;
			u = new Path2D(), u.rect(e, t, n, r);
		}
		t ? Nt(s, l, n.dash, n.cap, c, r, i, o, a) : Mt(e, s, l, n.dash, n.cap, c, r, i, o, u, a), p && d.translate(-f, -f);
	}
	function Mt(e, n, i, a, o, s, c, l, u, d, f) {
		let p = !1;
		u != 0 && x.forEach((m, h) => {
			if (m.series[0] == e) {
				let e = v[m.series[1]], g = t[m.series[1]], _ = (e._paths || Yu).band;
				Qu(_) && (_ = m.dir == 1 ? _[0] : _[1]);
				let y, b = null;
				e.show && _ && du(g, st, ct) ? (b = m.fill(r, h) || s, y = e._paths.clip) : _ = null, Nt(n, i, a, o, b, c, l, u, d, f, y, _), p = !0;
			}
		}), p || Nt(n, i, a, o, s, c, l, u, d, f);
	}
	function Nt(e, t, n, r, i, a, o, s, c, l, u, f) {
		Ct(e, t, n, r, i), (c || l || f) && (d.save(), c && d.clip(c), l && d.clip(l)), f ? (s & 3) == 3 ? (d.clip(f), u && d.clip(u), Ft(i, o), Pt(e, a, t)) : s & ep ? (Ft(i, o), d.clip(f), Pt(e, a, t)) : s & $f && (d.save(), d.clip(f), u && d.clip(u), Ft(i, o), d.restore(), Pt(e, a, t)) : (Ft(i, o), Pt(e, a, t)), (c || l || f) && d.restore();
	}
	function Pt(e, t, n) {
		n > 0 && (t instanceof Map ? t.forEach((e, t) => {
			d.strokeStyle = mt = t, d.stroke(e);
		}) : t != null && e && d.stroke(t));
	}
	function Ft(e, t) {
		t instanceof Map ? t.forEach((e, t) => {
			d.fillStyle = ht = t, d.fill(e);
		}) : t != null && e && d.fill(t);
	}
	function It(e, t, n, i) {
		let a = y[e], o;
		if (i <= 0) o = [0, 0];
		else {
			let s = a._space = a.space(r, e, t, n, i);
			o = Gp(t, n, a._incrs = a.incrs(r, e, t, n, i, s), i, s);
		}
		return a._found = o;
	}
	function Lt(e, t, n, r, i, a, o, s, c, l) {
		let u = o % 2 / 2;
		h == 1 && d.translate(u, u), Ct(s, o, c, l, s), d.beginPath();
		let f, p, m, g, _ = i + (r == 0 || r == 3 ? -a : a);
		n == 0 ? (p = i, g = _) : (f = i, m = _);
		for (let r = 0; r < e.length; r++) t[r] != null && (n == 0 ? f = m = e[r] : p = g = e[r], d.moveTo(f, p), d.lineTo(m, g));
		d.stroke(), h == 1 && d.translate(-u, -u);
	}
	function Rt(e) {
		let t = !0;
		return y.forEach((n, i) => {
			if (!n.show) return;
			let a = b[n.scale];
			if (a.min == null) {
				n._show && (t = !1, n._show = !1, Vt(!1));
				return;
			}
			n._show || (t = !1, n._show = !0, Vt(!1));
			let o = n.side, s = o % 2, { min: c, max: l } = a, [u, d] = It(i, c, l, s == 0 ? we : I);
			if (d == 0) return;
			let f = a.distr == 2, p = n._splits = n.splits(r, i, c, l, u, d, f), m = a.distr == 2 ? p.map((e) => ut[e]) : p, h = a.distr == 2 ? ut[p[1]] - ut[p[0]] : u, g = n._values = n.values(r, n.filter(r, m, i, d, h), i, d, h);
			n._rotate = o == 2 ? n.rotate(r, g, i, d) : 0;
			let _ = n._size;
			n._size = bu(n.size(r, g, i, e)), _ != null && n._size != _ && (t = !1);
		}), t;
	}
	function zt(e) {
		let t = !0;
		return it.forEach((n, i) => {
			let a = n(r, i, tt, e);
			a != at[i] && (t = !1), at[i] = a;
		}), t;
	}
	function Bt() {
		for (let e = 0; e < y.length; e++) {
			let t = y[e];
			if (!t.show || !t._show) continue;
			let n = t.side, i = n % 2, a, o, c = t.stroke(r, e), l = n == 0 || n == 3 ? -1 : 1, [u, f] = t._found;
			if (t.label != null) {
				let s = t.labelGap * l, p = yu((t._lpos + s) * Ml);
				wt(t.labelFont[0], c, "center", n == 2 ? dl : fl), d.save(), i == 1 ? (a = o = 0, d.translate(p, yu(R + z / 2)), d.rotate((n == 3 ? -gu : gu) / 2)) : (a = yu(je + Me / 2), o = p);
				let m = Mu(t.label) ? t.label(r, e, u, f) : t.label;
				d.fillText(m, a, o), d.restore();
			}
			if (f == 0) continue;
			let p = b[t.scale], m = i == 0 ? Me : z, h = i == 0 ? je : R, _ = t._splits, v = p.distr == 2 ? _.map((e) => ut[e]) : _, x = p.distr == 2 ? ut[_[1]] - ut[_[0]] : u, S = t.ticks, C = t.border, ee = S.show ? S.size : 0, te = yu(ee * Ml), w = yu((t.alignTo == 2 ? t._size - ee - t.gap : t.gap) * Ml), T = t._rotate * -gu / 180, E = g(t._pos * Ml), D = E + (te + w) * l;
			o = i == 0 ? D : 0, a = i == 1 ? D : 0;
			let ne = t.font[0];
			wt(ne, c, t.align == 1 ? pl : t.align == 2 ? ml : T > 0 ? pl : T < 0 ? ml : i == 0 ? "center" : n == 3 ? ml : pl, T || i == 1 ? "middle" : n == 2 ? dl : fl);
			let O = t.font[1] * t.lineGap, k = _.map((e) => g(s(e, p, m, h))), re = t._values;
			for (let e = 0; e < re.length; e++) {
				let t = re[e];
				if (t != null) {
					i == 0 ? a = k[e] : o = k[e], t = "" + t;
					let n = t.indexOf("\n") == -1 ? [t] : t.split(/\n/gm);
					for (let e = 0; e < n.length; e++) {
						let t = n[e];
						T ? (d.save(), d.translate(a, o + e * O), d.rotate(T), d.fillText(t, 0, 0), d.restore()) : d.fillText(t, a, o + e * O);
					}
				}
			}
			S.show && Lt(k, S.filter(r, v, e, f, x), i, n, E, te, Gu(S.width * Ml, 3), S.stroke(r, e), S.dash, S.cap);
			let A = t.grid;
			A.show && Lt(k, A.filter(r, v, e, f, x), i, i == 0 ? 2 : 1, i == 0 ? R : je, i == 0 ? z : Me, Gu(A.width * Ml, 3), A.stroke(r, e), A.dash, A.cap), C.show && Lt([E], [1], +(i == 0), i == 0 ? 1 : 2, i == 1 ? R : je, i == 1 ? z : Me, Gu(C.width * Ml, 3), C.stroke(r, e), C.dash, C.cap);
		}
		Yn("drawAxes");
	}
	function Vt(e) {
		v.forEach((t, n) => {
			n > 0 && (t._paths = null, e && (i == 1 ? (t.min = null, t.max = null) : t.facets.forEach((e) => {
				e.min = null, e.max = null;
			})));
		});
	}
	let Ht = !1, Ut = !1, Wt = [];
	function Gt() {
		Ut = !1;
		for (let e = 0; e < Wt.length; e++) Yn(...Wt[e]);
		Wt.length = 0;
	}
	function Kt() {
		Ht ||= (pd(Jt), !0);
	}
	function qt(e, t = !1) {
		Ht = !0, Ut = t, e(r), Jt(), t && Wt.length > 0 && queueMicrotask(Gt);
	}
	r.batch = qt;
	function Jt() {
		if (Ne &&= (Dt(), !1), B &&= (Be(), !1), Pe) {
			if (Ll(p, pl, Te), Ll(p, dl, Ee), Ll(p, ll, we), Ll(p, ul, I), Ll(m, pl, Te), Ll(m, dl, Ee), Ll(m, ll, we), Ll(m, ul, I), Ll(f, ll, Se), Ll(f, ul, Ce), u.width = yu(Se * Ml), u.height = yu(Ce * Ml), y.forEach(({ _el: e, _show: t, _size: n, _pos: r, side: i }) => {
				if (e != null) {
					if (t) {
						let t = i === 3 || i === 0 ? n : 0, a = i % 2 == 1;
						Ll(e, a ? "left" : "top", r - t), Ll(e, a ? "width" : "height", n), Ll(e, a ? "top" : "left", a ? Ee : Te), Ll(e, a ? "height" : "width", a ? I : we), Il(e, Zc);
					} else Fl(e, Zc);
				}
			}), mt = ht = gt = vt = yt = bt = xt = St = _t = null, H = 1, Pn(!0), Te != De || Ee != Oe || we != ke || I != Ae) {
				Vt(!1);
				let e = we / ke, t = I / Ae;
				if (ae && !Fe && P.left >= 0) {
					P.left *= e, P.top *= t, U && Vl(U, yu(P.left), 0, we, I), Qt && Vl(Qt, 0, yu(P.top), we, I);
					for (let n = 0; n < V.length; n++) {
						let r = V[n];
						r != null && (Ye[n] *= e, Xe[n] *= t, Vl(r, bu(Ye[n]), bu(Xe[n]), we, I));
					}
				}
				if (dn.show && !Ie && dn.left >= 0 && dn.width > 0) {
					dn.left *= e, dn.width *= e, dn.top *= t, dn.height *= t;
					for (let e in In) Ll(fn, e, dn[e]);
				}
				De = Te, Oe = Ee, ke = we, Ae = I;
			}
			Yn("setSize"), Pe = !1;
		}
		Se > 0 && Ce > 0 && (d.clearRect(0, 0, u.width, u.height), Yn("drawClear"), ee.forEach((e) => e()), Yn("draw")), dn.show && Ie && (pn(dn), Ie = !1), ae && Fe && (Mn(null, !0, !1), Fe = !1), N.show && N.live && Le && (An(), Le = !1), c || (c = !0, r.status = 1, Yn("ready")), dt = !1, Ht = !1;
	}
	r.redraw = (e, t) => {
		B = t || !1, e === !1 ? Kt() : hn(S, T.min, T.max);
	};
	function Yt(e, n) {
		let i = b[e];
		if (i.from == null) {
			if (ot == 0) {
				let t = i.range(r, n.min, n.max, e);
				n.min = t[0], n.max = t[1];
			}
			if (n.min > n.max) {
				let e = n.min;
				n.min = n.max, n.max = e;
			}
			if (ot > 1 && n.min != null && n.max != null && n.max - n.min < 1e-16) return;
			e == S && i.distr == 2 && ot > 0 && (n.min = Xl(n.min, t[0]), n.max = Xl(n.max, t[0]), n.min == n.max && n.max++), O[e] = n, Ne = !0, Kt();
		}
	}
	r.setScale = Yt;
	let Xt, Zt, U, Qt, W, $t, en, tn, nn, rn, an, on, sn = !1, cn = P.drag, ln = cn.x, un = cn.y;
	ae && (P.x && (Xt = zl($c, m)), P.y && (Zt = zl(el, m)), T.ori == 0 ? (U = Xt, Qt = Zt) : (U = Zt, Qt = Xt), an = P.left, on = P.top);
	let dn = r.select = sd({
		show: !0,
		over: !0,
		left: 0,
		width: 0,
		top: 0,
		height: 0
	}, e.select), fn = dn.show ? zl(Qc, dn.over ? m : p) : null;
	function pn(e, t) {
		if (dn.show) {
			for (let t in e) dn[t] = e[t], t in In && Ll(fn, t, e[t]);
			t !== !1 && Yn("setSelect");
		}
	}
	r.setSelect = pn;
	function mn(e) {
		if (v[e].show) F && Il(ue[e], Zc);
		else if (F && Fl(ue[e], Zc), ae) {
			let t = Je ? V[0] : V[e];
			t != null && Vl(t, -10, -10, we, I);
		}
	}
	function hn(e, t, n) {
		Yt(e, {
			min: t,
			max: n
		});
	}
	function gn(e, t, n, a) {
		t.focus != null && Sn(e), t.show != null && v.forEach((n, r) => {
			r > 0 && (e == r || e == null) && (n.show = t.show, mn(r), i == 2 ? (hn(n.facets[0].scale, null, null), hn(n.facets[1].scale, null, null)) : hn(n.scale, null, null), Kt());
		}), n !== !1 && Yn("setSeries", e, t), a && er("setSeries", r, e, t);
	}
	r.setSeries = gn;
	function _n(e, t) {
		sd(x[e], t);
	}
	function G(e, t) {
		e.fill = Nu(e.fill || null), e.dir = uu(e.dir, -1), t ??= x.length, x.splice(t, 0, e);
	}
	function vn(e) {
		e == null ? x.length = 0 : x.splice(e, 1);
	}
	r.addBand = G, r.setBand = _n, r.delBand = vn;
	function K(e, t) {
		v[e].alpha = t, ae && V[e] != null && (V[e].style.opacity = t), F && ue[e] && (ue[e].style.opacity = t);
	}
	let q, yn, bn, xn = { focus: !0 };
	function Sn(e) {
		if (e != bn) {
			let t = e == null, n = Ke.alpha != 1;
			v.forEach((r, a) => {
				if (i == 1 || a > 0) {
					let i = t || a == 0 || a == e;
					r._focus = t ? null : i, n && K(a, i ? 1 : Ke.alpha);
				}
			}), bn = e, n && Kt();
		}
	}
	F && qe && be(xl, se, (e) => {
		P._lock || (We(e), bn != null && gn(null, xn, !0, Zn.setSeries));
	});
	function Cn(e, t, n) {
		let r = b[t];
		n && (e = e / Ml - (r.ori == 1 ? Ee : Te));
		let i = we;
		r.ori == 1 && (i = I, e = i - e), r.dir == -1 && (e = i - e);
		let a = r._min, o = r._max, s = e / i, c = a + (o - a) * s, l = r.distr;
		return l == 3 ? Cu(10, c) : l == 4 ? Du(c, r.asinh) : l == 100 ? r.bwd(c) : c;
	}
	function wn(e, n) {
		return Xl(Cn(e, S, n), t[0], st, ct);
	}
	r.valToIdx = (e) => Xl(e, t[0]), r.posToIdx = wn, r.posToVal = Cn, r.valToPos = (e, t, n) => b[t].ori == 0 ? a(e, b[t], n ? Me : we, n ? je : 0) : o(e, b[t], n ? z : I, n ? R : 0), r.setCursor = (e, t, n) => {
		an = e.left, on = e.top, Mn(null, t, n);
	};
	function Tn(e, t) {
		Ll(fn, pl, dn.left = e), Ll(fn, ll, dn.width = t);
	}
	function En(e, t) {
		Ll(fn, dl, dn.top = e), Ll(fn, ul, dn.height = t);
	}
	let Dn = T.ori == 0 ? Tn : En, On = T.ori == 1 ? Tn : En;
	function kn() {
		if (F && N.live) for (let e = +(i == 2); e < v.length; e++) {
			if (e == 0 && pe) continue;
			let t = N.values[e], n = 0;
			for (let r in t) de[e][n++].firstChild.nodeValue = t[r];
		}
	}
	function An(e, t) {
		if (e != null && (e.idxs ? e.idxs.forEach((e, t) => {
			M[t] = e;
		}) : ed(e.idx) || M.fill(e.idx), N.idx = M[0]), F && N.live) {
			for (let e = 0; e < v.length; e++) (e > 0 || i == 1 && !pe) && jn(e, M[e]);
			kn();
		}
		Le = !1, t !== !1 && Yn("setLegend");
	}
	r.setLegend = An;
	function jn(e, n) {
		let i = v[e], a = e == 0 && E == 2 ? ut : t[e], o;
		pe ? o = i.values(r, e, n) ?? me : (o = i.value(r, n == null ? null : a[n], e, n), o = o == null ? me : { _: o }), N.values[e] = o;
	}
	function Mn(e, n, a) {
		nn = an, rn = on, [an, on] = P.move(r, an, on), P.left = an, P.top = on, ae && (U && Vl(U, yu(an), 0, we, I), Qt && Vl(Qt, 0, yu(on), we, I));
		let o, s = st > ct;
		q = ku, yn = null;
		let c = T.ori == 0 ? we : I, l = T.ori == 1 ? we : I;
		if (an < 0 || ot == 0 || s) {
			o = P.idx = null;
			for (let e = 0; e < v.length; e++) {
				let t = V[e];
				t != null && Vl(t, -10, -10, we, I);
			}
			qe && gn(null, xn, !0, e == null && Zn.setSeries), N.live && (M.fill(o), Le = !0);
		} else {
			let e, n, a;
			i == 1 && (e = T.ori == 0 ? an : on, n = Cn(e, S), o = P.idx = Xl(n, t[0], st, ct), a = D(t[0][o], T, c, 0));
			let s = -10, u = -10, d = 0, f = 0, p = !0, m = "", h = "";
			for (let e = +(i == 2); e < v.length; e++) {
				let g = v[e], _ = M[e], y = _ == null ? null : i == 1 ? t[e][_] : t[e][1][_], x = P.dataIdx(r, e, o, n), S = x == null ? null : i == 1 ? t[e][x] : t[e][1][x];
				if (Le = Le || S != y || x != _, M[e] = x, e > 0 && g.show) {
					let n = x == null ? -10 : x == o ? a : D(i == 1 ? t[0][x] : t[e][0][x], T, c, 0), _ = S == null ? -10 : ne(S, i == 1 ? b[g.scale] : b[g.facets[1].scale], l, 0);
					if (qe && S != null) {
						let t = T.ori == 1 ? an : on, n = _u(Ke.dist(r, e, x, _, t));
						if (n < q) {
							let r = Ke.bias;
							if (r != 0) {
								let i = Cn(t, g.scale), a = S >= 0 ? 1 : -1, o = i >= 0 ? 1 : -1;
								o == a && (o == 1 ? r == 1 ? S >= i : S <= i : r == 1 ? S <= i : S >= i) && (q = n, yn = e);
							} else q = n, yn = e;
						}
					}
					if (Le || Je) {
						let t, i;
						T.ori == 0 ? (t = n, i = _) : (t = _, i = n);
						let a, o, c, l, g, v, y = !0, b = Ge.bbox;
						if (b != null) {
							y = !1;
							let t = b(r, e);
							c = t.left, l = t.top, a = t.width, o = t.height;
						} else c = t, l = i, a = o = Ge.size(r, e);
						if (v = Ge.fill(r, e), g = Ge.stroke(r, e), Je) e == yn && q <= Ke.prox && (s = c, u = l, d = a, f = o, p = y, m = v, h = g);
						else {
							let t = V[e];
							t != null && (Ye[e] = c, Xe[e] = l, Gl(t, a, o, y), Ul(t, v, g), Vl(t, bu(c), bu(l), we, I));
						}
					}
				}
			}
			if (Je) {
				let e = Ke.prox;
				if (Le || (bn == null ? q <= e : q > e || yn != bn)) {
					let e = V[0];
					e != null && (Ye[0] = s, Xe[0] = u, Gl(e, d, f, p), Ul(e, m, h), Vl(e, bu(s), bu(u), we, I));
				}
			}
		}
		if (dn.show && sn) {
			if (e != null) {
				let [t, n] = Zn.scales, [r, i] = Zn.match, [a, o] = e.cursor.sync.scales, s = e.cursor.drag;
				if (ln = s._x, un = s._y, ln || un) {
					let { left: s, top: u, width: d, height: f } = e.select, p = e.scales[a].ori, m = e.posToVal, h, g, _, v, y, x = t != null && r(t, a), S = n != null && i(n, o);
					x && ln ? (p == 0 ? (h = s, g = d) : (h = u, g = f), _ = b[t], v = D(m(h, a), _, c, 0), y = D(m(h + g, a), _, c, 0), Dn(xu(v, y), _u(y - v))) : Dn(0, c), S && un ? (p == 1 ? (h = s, g = d) : (h = u, g = f), _ = b[n], v = ne(m(h, o), _, l, 0), y = ne(m(h + g, o), _, l, 0), On(xu(v, y), _u(y - v))) : On(0, l);
				} else Ln();
			} else {
				let e = _u(nn - W), t = _u(rn - $t);
				if (T.ori == 1) {
					let n = e;
					e = t, t = n;
				}
				ln = cn.x && e >= cn.dist, un = cn.y && t >= cn.dist;
				let n = cn.uni;
				n == null ? cn.x && cn.y && (ln || un) && (ln = un = !0) : ln && un && (ln = e >= n, un = t >= n, !ln && !un && (t > e ? un = !0 : ln = !0));
				let r, i;
				ln && (T.ori == 0 ? (r = en, i = an) : (r = tn, i = on), Dn(xu(r, i), _u(i - r)), un || On(0, l)), un && (T.ori == 1 ? (r = en, i = an) : (r = tn, i = on), On(xu(r, i), _u(i - r)), ln || Dn(0, c)), !ln && !un && (Dn(0, 0), On(0, 0));
			}
		}
		if (cn._x = ln, cn._y = un, e == null) {
			if (a) {
				if (Qn != null) {
					let [e, t] = Zn.scales;
					Zn.values[0] = e == null ? null : Cn(T.ori == 0 ? an : on, e), Zn.values[1] = t == null ? null : Cn(T.ori == 1 ? an : on, t);
				}
				er(_l, r, an, on, we, I, o);
			}
			if (qe) {
				let e = a && Zn.setSeries, t = Ke.prox;
				bn == null ? q <= t && gn(yn, xn, !0, e) : q > t ? gn(null, xn, !0, e) : yn != bn && gn(yn, xn, !0, e);
			}
		}
		Le && (N.idx = o, An()), n !== !1 && Yn("setCursor");
	}
	let Nn = null;
	Object.defineProperty(r, "rect", { get() {
		return Nn ?? Pn(!1), Nn;
	} });
	function Pn(e = !1) {
		e ? Nn = null : (Nn = m.getBoundingClientRect(), Yn("syncRect", Nn));
	}
	function Fn(e, t, n, r, i, a, o) {
		P._lock || sn && e != null && e.movementX == 0 && e.movementY == 0 || (J(e, t, n, r, i, a, o, !1, e != null), e == null ? Mn(t, !0, !1) : Mn(null, !0, !0));
	}
	function J(e, t, n, i, a, o, c, l, u) {
		if (Nn ?? Pn(!1), We(e), e != null) n = e.clientX - Nn.left, i = e.clientY - Nn.top;
		else {
			if (n < 0 || i < 0) {
				an = -10, on = -10;
				return;
			}
			let [e, r] = Zn.scales, c = t.cursor.sync, [l, u] = c.values, [d, f] = c.scales, [p, m] = Zn.match, h = t.axes[0].side % 2 == 1, g = T.ori == 0 ? we : I, _ = T.ori == 1 ? we : I, v = h ? o : a, y = h ? a : o, x = h ? i : n, S = h ? n : i;
			if (n = d == null ? x / v * g : p(e, d) ? s(l, b[e], g, 0) : -10, i = f == null ? S / y * _ : m(r, f) ? s(u, b[r], _, 0) : -10, T.ori == 1) {
				let e = n;
				n = i, i = e;
			}
		}
		u && (t == null || t.cursor.event.type == _l) && ((n <= 1 || n >= we - 1) && (n = Hu(n, we)), (i <= 1 || i >= I - 1) && (i = Hu(i, I))), l ? (W = n, $t = i, [en, tn] = P.move(r, n, i)) : (an = n, on = i);
	}
	let In = {
		width: 0,
		height: 0,
		left: 0,
		top: 0
	};
	function Ln() {
		pn(In, !1);
	}
	let Rn, zn, Bn, Vn;
	function Hn(e, t, n, i, a, o, s) {
		sn = !0, ln = un = cn._x = cn._y = !1, J(e, t, n, i, a, o, s, !0, !1), e != null && (be(yl, kl, Un, !1), er(vl, r, en, tn, we, I, null));
		let { left: c, top: l, width: u, height: d } = dn;
		Rn = c, zn = l, Bn = u, Vn = d;
	}
	function Un(e, t, n, i, a, o, s) {
		sn = cn._x = cn._y = !1, J(e, t, n, i, a, o, s, !1, !0);
		let { left: c, top: l, width: u, height: d } = dn, f = u > 0 || d > 0, p = Rn != c || zn != l || Bn != u || Vn != d;
		if (f && p && pn(dn), cn.setScale && f && p) {
			let e = c, t = u, n = l, r = d;
			if (T.ori == 1 && (e = l, t = d, n = c, r = u), ln && hn(S, Cn(e, S), Cn(e + t, S)), un) for (let e in b) {
				let t = b[e];
				e != S && t.from == null && t.min != ku && hn(e, Cn(n + r, e), Cn(n, e));
			}
			Ln();
		} else P.lock && (P._lock = !P._lock, Mn(t, !0, e != null));
		e != null && (xe(yl, kl), er(yl, r, an, on, we, I, null));
	}
	function Wn(e, t, n, r, i, a, o) {
		if (P._lock) return;
		We(e);
		let s = sn;
		if (sn) {
			let e = !0, t = !0, n, r;
			T.ori == 0 ? (n = ln, r = un) : (n = un, r = ln), n && r && (e = an <= 10 || an >= we - 10, t = on <= 10 || on >= I - 10), n && e && (an = an < en ? 0 : we), r && t && (on = on < tn ? 0 : I), Mn(null, !0, !0), sn = !1;
		}
		an = -10, on = -10, M.fill(null), Mn(null, !0, !0), s && (sn = s);
	}
	function Gn(e, t, n, i, a, o, s) {
		P._lock || (We(e), pt(), Ln(), e != null && er(Sl, r, an, on, we, I, null));
	}
	function Kn() {
		y.forEach(qp), Re(r.width, r.height, !0);
	}
	Jl(El, Al, Kn);
	let qn = {};
	qn.mousedown = Hn, qn.mousemove = Fn, qn.mouseup = Un, qn.dblclick = Gn, qn.setSeries = (e, t, n, i) => {
		let a = Zn.match[2];
		n = a(r, t, n), n != -1 && gn(n, i, !0, !1);
	}, ae && (be(vl, m, Hn), be(_l, m, Fn), be(bl, m, (e) => {
		We(e), Pn(!1);
	}), be(xl, m, Wn), be(Sl, m, Gn), jp.add(r), r.syncRect = Pn);
	let Jn = r.hooks = e.hooks || {};
	function Yn(e, t, n) {
		Ut ? Wt.push([
			e,
			t,
			n
		]) : e in Jn && Jn[e].forEach((e) => {
			e.call(null, r, t, n);
		});
	}
	(e.plugins || []).forEach((e) => {
		for (let t in e.hooks) Jn[t] = (Jn[t] || []).concat(e.hooks[t]);
	});
	let Xn = (e, t, n) => n, Zn = sd({
		key: null,
		setSeries: !1,
		filters: {
			pub: Ru,
			sub: Ru
		},
		scales: [S, v[1] ? v[1].scale : null],
		match: [
			zu,
			zu,
			Xn
		],
		values: [null, null]
	}, P.sync);
	Zn.match.length == 2 && Zn.match.push(Xn), P.sync = Zn;
	let Qn = Zn.key, $n = Qf(Qn);
	function er(e, t, n, r, i, a, o) {
		Zn.filters.pub(e, t, n, r, i, a, o) && $n.pub(e, t, n, r, i, a, o);
	}
	$n.sub(r);
	function tr(e, t, n, r, i, a, o) {
		Zn.filters.sub(e, t, n, r, i, a, o) && qn[e](null, t, n, r, i, a, o);
	}
	r.pub = tr;
	function nr() {
		$n.unsub(r), jp.delete(r), ye.clear(), Yl(El, Al, Kn), l.remove(), se?.remove(), Yn("destroy");
	}
	r.destroy = nr;
	function rr() {
		Yn("init", e, t), ft(t || e.data, !1), O[S] ? Yt(S, O[S]) : pt(), Ie = dn.show && (dn.width > 0 || dn.height > 0), Fe = Le = !0, Re(e.width, e.height);
	}
	return v.forEach(Qe), y.forEach(nt), n ? n instanceof HTMLElement ? (n.appendChild(l), rr()) : n(r, rr) : rr(), r;
}
Jp.assign = sd, Jp.fmtNum = mu, Jp.rangeNum = lu, Jp.rangeLog = ru, Jp.rangeAsinh = iu, Jp.orient = tp, Jp.pxRatio = Ml, Jp.join = fd, Jp.fmtDate = Td, Jp.tzDate = Dd, Jp.sync = Qf;
{
	Jp.addGap = op, Jp.clipGaps = ap;
	let e = Jp.paths = { points: bp };
	e.linear = wp, e.stepped = Tp, e.bars = Dp, e.spline = kp;
}
// src/lib/Chart.svelte
var Yp = /* @__PURE__ */ X("<div class=\"chart svelte-1knyfmf\" role=\"img\"></div>");
function Xp(e, t) {
	et(t, !0);
	let n = xa(t, "time", 3, !1), r = xa(t, "xlabel", 3, ""), i = xa(t, "height", 3, 180), a = xa(t, "label", 3, ""), o = xa(t, "xaxis", 19, () => ({})), s = xa(t, "marks", 19, () => []), c, l = /* @__PURE__ */ U(0), u = (e, t) => /^#[0-9a-f]{6}$/i.test(e) ? e + Math.round(t * 255).toString(16).padStart(2, "0") : e;
	An(() => {
		let e = matchMedia("(prefers-color-scheme: dark)"), t = () => rn(l);
		return e.addEventListener("change", t), () => e.removeEventListener("change", t);
	}), An(() => {
		Y(l);
		let e = getComputedStyle(c), a = (t) => e.getPropertyValue(t).trim(), d = a("--muted"), f = a("--line"), p = `11px ${a("--font")}`, m = (e, t, n = {}) => ({
			scale: e,
			side: t,
			stroke: d,
			font: p,
			grid: {
				stroke: f,
				width: 1,
				show: e === "y"
			},
			ticks: {
				stroke: f,
				width: 1
			},
			...n
		}), h = { x: { time: n() } };
		t.series.some((e) => (e.scale ?? "y") === "y" && e.kind && e.kind !== "line") && (h.y = { range: [0, null] }), !n() && t.series.some((e) => e.kind === "bars") && (h.x.range = (e, t, n) => [t - .5, n + .5]), t.series.some((e) => e.scale === "y2") && (h.y2 = {}), t.series.some((e) => e.scale === "plug") && (h.plug = { range: [0, 1] });
		let g = (e) => m(e, 1, e === "plug" ? {
			size: 76,
			splits: () => [0, 1],
			values: (e, t) => t.map((e) => e ? "plugged" : "unplugged")
		} : {}), _ = (e) => {
			let t = a(e.color ?? "--trip"), n = e.kind !== "bars" && e.values.filter((e) => e != null).length === 1, r = {
				label: e.label,
				scale: e.scale ?? "y",
				stroke: t,
				width: 2,
				spanGaps: !0,
				points: {
					show: n,
					size: 7,
					fill: t
				}
			};
			return e.dash && (r.dash = [6, 4]), e.scale === "plug" && (r.paths = Jp.paths.stepped({ align: 1 })), e.kind === "area" && (r.fill = (e) => {
				let n = e.ctx.createLinearGradient(0, e.bbox.top, 0, e.bbox.top + e.bbox.height);
				return n.addColorStop(0, u(t, .35)), n.addColorStop(1, u(t, .04)), n;
			}), e.kind === "bars" && Object.assign(r, {
				paths: Jp.paths.bars({
					size: [.6, 48],
					radius: .25
				}),
				fill: t,
				width: 0
			}), r;
		}, v = (e) => {
			let { ctx: t, bbox: n } = e, r = 4 * devicePixelRatio, i = n.top + n.height, { min: o, max: c } = e.scales.x;
			if (o != null) for (let l of s()) {
				let s = Math.min(n.left + n.width - r, Math.max(n.left + r, e.valToPos(Math.min(c, Math.max(o, l.x)), "x", !0)));
				t.fillStyle = a(l.color), t.beginPath(), t.moveTo(s - r, i), t.lineTo(s + r, i), t.lineTo(s, i - 1.6 * r), t.fill();
			}
		}, y = Ga(), b = new Jp({
			...y && { tzDate: (e) => Jp.tzDate(/* @__PURE__ */ new Date(e * 1e3), y) },
			width: c.clientWidth || 300,
			height: i(),
			legend: {
				show: t.series.length > 1,
				live: !1
			},
			cursor: { drag: {
				x: !1,
				y: !1
			} },
			hooks: { draw: [v] },
			scales: h,
			axes: [
				{
					stroke: d,
					font: p,
					grid: {
						stroke: f,
						width: 1
					},
					ticks: {
						stroke: f,
						width: 1
					},
					label: r(),
					labelFont: p,
					labelSize: r() ? 22 : 0,
					...o()
				},
				m("y", 3),
				...h.y2 ? [g("y2")] : [],
				...h.plug ? [g("plug")] : []
			],
			series: [{}, ...t.series.map(_)]
		}, [t.x, ...t.series.map((e) => e.values)], c), x = new ResizeObserver(() => b.setSize({
			width: c.clientWidth,
			height: i()
		}));
		return x.observe(c), () => {
			x.disconnect(), b.destroy();
		};
	});
	var d = Yp();
	ga(d, (e) => c = e, () => c), J((e) => ra(d, "aria-label", e), [() => a() || `Chart: ${t.series.map((e) => e.label).join(", ")}`]), Z(e, d), tt();
}
// src/lib/ui/DetailPage.svelte
var Zp = /* @__PURE__ */ X("<p class=\"d-msg\"> <a class=\"d-link\" href=\"#/activity\">Back to activity</a></p>"), Qp = /* @__PURE__ */ X("<p class=\"d-msg\" role=\"alert\"><button class=\"d-btn\">Retry</button></p>"), $p = /* @__PURE__ */ X("<p class=\"d-msg\" aria-busy=\"true\">Loading…</p>"), em = /* @__PURE__ */ X("<article class=\"d-stack\"><header><h1 class=\"d-title\" tabindex=\"-1\"><!></h1> <!></header> <!></article>");
function tm(e, t) {
	et(t, !0);
	let n = /* @__PURE__ */ U(null), r = /* @__PURE__ */ U(null), i = /* @__PURE__ */ U(void 0), a = g();
	async function o() {
		let e = a.next();
		W(r, null);
		try {
			let r = await h(t.url);
			if (!e.current) return;
			t.onloaded?.(r), W(n, r, !0);
		} catch (t) {
			e.current && W(r, t, !0);
		}
	}
	Sa(() => (o(), Sr().then(() => Y(i)?.focus({ preventScroll: !0 })), a.reset));
	var s = em(), c = G(s), l = G(c), u = G(l), d = (e) => {
		var r = qr();
		Si(vn(r), () => t.title, () => Y(n)), Z(e, r);
	}, f = (e) => {
		Z(e, Kr("Not available"));
	}, p = (e) => {
		var n = Kr();
		J(() => Q(n, `Couldn't load this ${t.noun ?? ""}`)), Z(e, n);
	}, m = (e) => {
		var n = Kr();
		J(() => Q(n, t.noun === "trip" ? "Trip" : "Charge")), Z(e, n);
	};
	$(u, (e) => {
		Y(n) ? e(d) : Y(r)?.status === 404 ? e(f, 1) : Y(r) ? e(p, 2) : e(m, -1);
	}), B(l), ga(l, (e) => W(i, e), () => Y(i));
	var _ = q(l, 2), v = (e) => {
		var r = qr();
		Si(vn(r), () => t.subtitle ?? D, () => Y(n)), Z(e, r);
	};
	$(_, (e) => {
		Y(n) && e(v);
	}), B(c);
	var y = q(c, 2), b = (e) => {
		var n = Zp(), r = G(n);
		Fe(), B(n), J(() => Q(r, `This ${t.noun ?? ""} is not available. `)), Z(e, n);
	}, x = (e) => {
		var t = Qp();
		Fr("click", K(t), o), Z(e, t);
	}, S = (e) => {
		Z(e, $p());
	}, C = (e) => {
		var r = qr();
		Si(vn(r), () => t.body, () => Y(n), () => o), Z(e, r);
	};
	$(y, (e) => {
		Y(r)?.status === 404 ? e(b) : Y(r) ? e(x, 1) : Y(n) ? e(C, -1) : e(S, 2);
	}), B(s), J(() => Hi(s, `--accent: var(${t.accent ?? ""})`)), Z(e, s), tt();
}
Ir(["click"]);
// src/lib/ui/Figure.svelte
var nm = /* @__PURE__ */ X(" <small class=\"svelte-12txda6\"> </small>", 1), rm = /* @__PURE__ */ X("<div><span class=\"caption\"> </span> <span class=\"value big svelte-12txda6\"> <!></span> <!></div>");
function im(e, t) {
	let n = xa(t, "unit", 3, ""), r = xa(t, "size", 3, "normal");
	var i = rm();
	let a;
	var o = G(i), s = K(o, !0), c = q(o, 2), l = G(c, !0), u = q(l), d = (e) => {
		var t = nm(), r = vn(t, !0);
		r.nodeValue = " ";
		var i = K(q(r), !0);
		J(() => Q(i, n())), Z(e, t);
	};
	$(u, (e) => {
		n() && e(d);
	}), B(c), Si(q(c, 2), () => t.children ?? D), B(i), J(() => {
		a = Bi(i, 1, "fig card svelte-12txda6", null, a, { small: r() === "small" }), Q(s, t.label), Q(l, t.value);
	}), Z(e, i);
}
// node_modules/leaflet/dist/leaflet.css
var am = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t, n) => {
	(function(n, r) {
		typeof e == "object" && t !== void 0 ? r(e) : typeof define == "function" && define.amd ? define(["exports"], r) : (n = typeof globalThis < "u" ? globalThis : n || self, r(n.leaflet = {}));
	})(n, (function(e) {
		var t = "1.9.4";
		function n(e) {
			for (var t, n = 1, r = arguments.length, i; n < r; n++) for (t in i = arguments[n], i) e[t] = i[t];
			return e;
		}
		var r = Object.create || (function() {
			function e() {}
			return function(t) {
				return e.prototype = t, new e();
			};
		})();
		function i(e, t) {
			var n = Array.prototype.slice;
			if (e.bind) return e.bind.apply(e, n.call(arguments, 1));
			var r = n.call(arguments, 2);
			return function() {
				return e.apply(t, r.length ? r.concat(n.call(arguments)) : arguments);
			};
		}
		var a = 0;
		function o(e) {
			return "_leaflet_id" in e || (e._leaflet_id = ++a), e._leaflet_id;
		}
		function s(e, t, n) {
			var r, i, a, o = function() {
				r = !1, i &&= (a.apply(n, i), !1);
			};
			return a = function() {
				r ? i = arguments : (e.apply(n, arguments), setTimeout(o, t), r = !0);
			}, a;
		}
		function c(e, t, n) {
			var r = t[1], i = t[0], a = r - i;
			return e === r && n ? e : ((e - i) % a + a) % a + i;
		}
		function l() {
			return !1;
		}
		function u(e, t) {
			if (t === !1) return e;
			var n = 10 ** (t === void 0 ? 6 : t);
			return Math.round(e * n) / n;
		}
		function d(e) {
			return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
		}
		function f(e) {
			return d(e).split(/\s+/);
		}
		function p(e, t) {
			for (var n in Object.prototype.hasOwnProperty.call(e, "options") || (e.options = e.options ? r(e.options) : {}), t) e.options[n] = t[n];
			return e.options;
		}
		function m(e, t, n) {
			var r = [];
			for (var i in e) r.push(encodeURIComponent(n ? i.toUpperCase() : i) + "=" + encodeURIComponent(e[i]));
			return (!t || t.indexOf("?") === -1 ? "?" : "&") + r.join("&");
		}
		var h = /\{ *([\w_ -]+) *\}/g;
		function g(e, t) {
			return e.replace(h, function(e, n) {
				var r = t[n];
				if (r === void 0) throw Error("No value provided for variable " + e);
				return typeof r == "function" && (r = r(t)), r;
			});
		}
		var _ = Array.isArray || function(e) {
			return Object.prototype.toString.call(e) === "[object Array]";
		};
		function v(e, t) {
			for (var n = 0; n < e.length; n++) if (e[n] === t) return n;
			return -1;
		}
		var y = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
		function b(e) {
			return window["webkit" + e] || window["moz" + e] || window["ms" + e];
		}
		var x = 0;
		function S(e) {
			var t = +/* @__PURE__ */ new Date(), n = Math.max(0, 16 - (t - x));
			return x = t + n, window.setTimeout(e, n);
		}
		var C = window.requestAnimationFrame || b("RequestAnimationFrame") || S, ee = window.cancelAnimationFrame || b("CancelAnimationFrame") || b("CancelRequestAnimationFrame") || function(e) {
			window.clearTimeout(e);
		};
		function te(e, t, n) {
			if (n && C === S) e.call(t);
			else return C.call(window, i(e, t));
		}
		function w(e) {
			e && ee.call(window, e);
		}
		var T = {
			__proto__: null,
			extend: n,
			create: r,
			bind: i,
			get lastId() {
				return a;
			},
			stamp: o,
			throttle: s,
			wrapNum: c,
			falseFn: l,
			formatNum: u,
			trim: d,
			splitWords: f,
			setOptions: p,
			getParamString: m,
			template: g,
			isArray: _,
			indexOf: v,
			emptyImageUrl: y,
			requestFn: C,
			cancelFn: ee,
			requestAnimFrame: te,
			cancelAnimFrame: w
		};
		function E() {}
		E.extend = function(e) {
			var t = function() {
				p(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
			}, i = t.__super__ = this.prototype, a = r(i);
			for (var o in a.constructor = t, t.prototype = a, this) Object.prototype.hasOwnProperty.call(this, o) && o !== "prototype" && o !== "__super__" && (t[o] = this[o]);
			return e.statics && n(t, e.statics), e.includes && (D(e.includes), n.apply(null, [a].concat(e.includes))), n(a, e), delete a.statics, delete a.includes, a.options && (a.options = i.options ? r(i.options) : {}, n(a.options, e.options)), a._initHooks = [], a.callInitHooks = function() {
				if (!this._initHooksCalled) {
					i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
					for (var e = 0, t = a._initHooks.length; e < t; e++) a._initHooks[e].call(this);
				}
			}, t;
		}, E.include = function(e) {
			var t = this.prototype.options;
			return n(this.prototype, e), e.options && (this.prototype.options = t, this.mergeOptions(e.options)), this;
		}, E.mergeOptions = function(e) {
			return n(this.prototype.options, e), this;
		}, E.addInitHook = function(e) {
			var t = Array.prototype.slice.call(arguments, 1), n = typeof e == "function" ? e : function() {
				this[e].apply(this, t);
			};
			return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(n), this;
		};
		function D(e) {
			if (typeof L < "u" && L && L.Mixin) {
				e = _(e) ? e : [e];
				for (var t = 0; t < e.length; t++) e[t] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", (/* @__PURE__ */ Error()).stack);
			}
		}
		var ne = {
			on: function(e, t, n) {
				if (typeof e == "object") for (var r in e) this._on(r, e[r], t);
				else {
					e = f(e);
					for (var i = 0, a = e.length; i < a; i++) this._on(e[i], t, n);
				}
				return this;
			},
			off: function(e, t, n) {
				if (!arguments.length) delete this._events;
				else if (typeof e == "object") for (var r in e) this._off(r, e[r], t);
				else {
					e = f(e);
					for (var i = arguments.length === 1, a = 0, o = e.length; a < o; a++) i ? this._off(e[a]) : this._off(e[a], t, n);
				}
				return this;
			},
			_on: function(e, t, n, r) {
				if (typeof t != "function") console.warn("wrong listener type: " + typeof t);
				else if (this._listens(e, t, n) === !1) {
					n === this && (n = void 0);
					var i = {
						fn: t,
						ctx: n
					};
					r && (i.once = !0), this._events = this._events || {}, this._events[e] = this._events[e] || [], this._events[e].push(i);
				}
			},
			_off: function(e, t, n) {
				var r, i, a;
				if (this._events && (r = this._events[e], r)) {
					if (arguments.length === 1) {
						if (this._firingCount) for (i = 0, a = r.length; i < a; i++) r[i].fn = l;
						delete this._events[e];
					} else if (typeof t != "function") console.warn("wrong listener type: " + typeof t);
					else {
						var o = this._listens(e, t, n);
						if (o !== !1) {
							var s = r[o];
							this._firingCount && (s.fn = l, this._events[e] = r = r.slice()), r.splice(o, 1);
						}
					}
				}
			},
			fire: function(e, t, r) {
				if (!this.listens(e, r)) return this;
				var i = n({}, t, {
					type: e,
					target: this,
					sourceTarget: t && t.sourceTarget || this
				});
				if (this._events) {
					var a = this._events[e];
					if (a) {
						this._firingCount = this._firingCount + 1 || 1;
						for (var o = 0, s = a.length; o < s; o++) {
							var c = a[o], l = c.fn;
							c.once && this.off(e, l, c.ctx), l.call(c.ctx || this, i);
						}
						this._firingCount--;
					}
				}
				return r && this._propagateEvent(i), this;
			},
			listens: function(e, t, n, r) {
				typeof e != "string" && console.warn("\"string\" type argument expected");
				var i = t;
				typeof t != "function" && (r = !!t, i = void 0, n = void 0);
				var a = this._events && this._events[e];
				if (a && a.length && this._listens(e, i, n) !== !1) return !0;
				if (r) {
					for (var o in this._eventParents) if (this._eventParents[o].listens(e, t, n, r)) return !0;
				}
				return !1;
			},
			_listens: function(e, t, n) {
				if (!this._events) return !1;
				var r = this._events[e] || [];
				if (!t) return !!r.length;
				n === this && (n = void 0);
				for (var i = 0, a = r.length; i < a; i++) if (r[i].fn === t && r[i].ctx === n) return i;
				return !1;
			},
			once: function(e, t, n) {
				if (typeof e == "object") for (var r in e) this._on(r, e[r], t, !0);
				else {
					e = f(e);
					for (var i = 0, a = e.length; i < a; i++) this._on(e[i], t, n, !0);
				}
				return this;
			},
			addEventParent: function(e) {
				return this._eventParents = this._eventParents || {}, this._eventParents[o(e)] = e, this;
			},
			removeEventParent: function(e) {
				return this._eventParents && delete this._eventParents[o(e)], this;
			},
			_propagateEvent: function(e) {
				for (var t in this._eventParents) this._eventParents[t].fire(e.type, n({
					layer: e.target,
					propagatedFrom: e.target
				}, e), !0);
			}
		};
		ne.addEventListener = ne.on, ne.removeEventListener = ne.clearAllEventListeners = ne.off, ne.addOneTimeEventListener = ne.once, ne.fireEvent = ne.fire, ne.hasEventListeners = ne.listens;
		var O = E.extend(ne);
		function k(e, t, n) {
			this.x = n ? Math.round(e) : e, this.y = n ? Math.round(t) : t;
		}
		var re = Math.trunc || function(e) {
			return e > 0 ? Math.floor(e) : Math.ceil(e);
		};
		k.prototype = {
			clone: function() {
				return new k(this.x, this.y);
			},
			add: function(e) {
				return this.clone()._add(A(e));
			},
			_add: function(e) {
				return this.x += e.x, this.y += e.y, this;
			},
			subtract: function(e) {
				return this.clone()._subtract(A(e));
			},
			_subtract: function(e) {
				return this.x -= e.x, this.y -= e.y, this;
			},
			divideBy: function(e) {
				return this.clone()._divideBy(e);
			},
			_divideBy: function(e) {
				return this.x /= e, this.y /= e, this;
			},
			multiplyBy: function(e) {
				return this.clone()._multiplyBy(e);
			},
			_multiplyBy: function(e) {
				return this.x *= e, this.y *= e, this;
			},
			scaleBy: function(e) {
				return new k(this.x * e.x, this.y * e.y);
			},
			unscaleBy: function(e) {
				return new k(this.x / e.x, this.y / e.y);
			},
			round: function() {
				return this.clone()._round();
			},
			_round: function() {
				return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
			},
			floor: function() {
				return this.clone()._floor();
			},
			_floor: function() {
				return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
			},
			ceil: function() {
				return this.clone()._ceil();
			},
			_ceil: function() {
				return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
			},
			trunc: function() {
				return this.clone()._trunc();
			},
			_trunc: function() {
				return this.x = re(this.x), this.y = re(this.y), this;
			},
			distanceTo: function(e) {
				e = A(e);
				var t = e.x - this.x, n = e.y - this.y;
				return Math.sqrt(t * t + n * n);
			},
			equals: function(e) {
				return e = A(e), e.x === this.x && e.y === this.y;
			},
			contains: function(e) {
				return e = A(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y);
			},
			toString: function() {
				return "Point(" + u(this.x) + ", " + u(this.y) + ")";
			}
		};
		function A(e, t, n) {
			return e instanceof k ? e : _(e) ? new k(e[0], e[1]) : e == null ? e : typeof e == "object" && "x" in e && "y" in e ? new k(e.x, e.y) : new k(e, t, n);
		}
		function j(e, t) {
			if (e) for (var n = t ? [e, t] : e, r = 0, i = n.length; r < i; r++) this.extend(n[r]);
		}
		j.prototype = {
			extend: function(e) {
				var t, n;
				if (!e) return this;
				if (e instanceof k || typeof e[0] == "number" || "x" in e) t = n = A(e);
				else if (e = ie(e), t = e.min, n = e.max, !t || !n) return this;
				return !this.min && !this.max ? (this.min = t.clone(), this.max = n.clone()) : (this.min.x = Math.min(t.x, this.min.x), this.max.x = Math.max(n.x, this.max.x), this.min.y = Math.min(t.y, this.min.y), this.max.y = Math.max(n.y, this.max.y)), this;
			},
			getCenter: function(e) {
				return A((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, e);
			},
			getBottomLeft: function() {
				return A(this.min.x, this.max.y);
			},
			getTopRight: function() {
				return A(this.max.x, this.min.y);
			},
			getTopLeft: function() {
				return this.min;
			},
			getBottomRight: function() {
				return this.max;
			},
			getSize: function() {
				return this.max.subtract(this.min);
			},
			contains: function(e) {
				var t, n;
				return e = typeof e[0] == "number" || e instanceof k ? A(e) : ie(e), e instanceof j ? (t = e.min, n = e.max) : t = n = e, t.x >= this.min.x && n.x <= this.max.x && t.y >= this.min.y && n.y <= this.max.y;
			},
			intersects: function(e) {
				e = ie(e);
				var t = this.min, n = this.max, r = e.min, i = e.max, a = i.x >= t.x && r.x <= n.x, o = i.y >= t.y && r.y <= n.y;
				return a && o;
			},
			overlaps: function(e) {
				e = ie(e);
				var t = this.min, n = this.max, r = e.min, i = e.max, a = i.x > t.x && r.x < n.x, o = i.y > t.y && r.y < n.y;
				return a && o;
			},
			isValid: function() {
				return !!(this.min && this.max);
			},
			pad: function(e) {
				var t = this.min, n = this.max, r = Math.abs(t.x - n.x) * e, i = Math.abs(t.y - n.y) * e;
				return ie(A(t.x - r, t.y - i), A(n.x + r, n.y + i));
			},
			equals: function(e) {
				return e ? (e = ie(e), this.min.equals(e.getTopLeft()) && this.max.equals(e.getBottomRight())) : !1;
			}
		};
		function ie(e, t) {
			return !e || e instanceof j ? e : new j(e, t);
		}
		function M(e, t) {
			if (e) for (var n = t ? [e, t] : e, r = 0, i = n.length; r < i; r++) this.extend(n[r]);
		}
		M.prototype = {
			extend: function(e) {
				var t = this._southWest, n = this._northEast, r, i;
				if (e instanceof P) r = e, i = e;
				else if (e instanceof M) {
					if (r = e._southWest, i = e._northEast, !r || !i) return this;
				} else return e ? this.extend(F(e) || N(e)) : this;
				return !t && !n ? (this._southWest = new P(r.lat, r.lng), this._northEast = new P(i.lat, i.lng)) : (t.lat = Math.min(r.lat, t.lat), t.lng = Math.min(r.lng, t.lng), n.lat = Math.max(i.lat, n.lat), n.lng = Math.max(i.lng, n.lng)), this;
			},
			pad: function(e) {
				var t = this._southWest, n = this._northEast, r = Math.abs(t.lat - n.lat) * e, i = Math.abs(t.lng - n.lng) * e;
				return new M(new P(t.lat - r, t.lng - i), new P(n.lat + r, n.lng + i));
			},
			getCenter: function() {
				return new P((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2);
			},
			getSouthWest: function() {
				return this._southWest;
			},
			getNorthEast: function() {
				return this._northEast;
			},
			getNorthWest: function() {
				return new P(this.getNorth(), this.getWest());
			},
			getSouthEast: function() {
				return new P(this.getSouth(), this.getEast());
			},
			getWest: function() {
				return this._southWest.lng;
			},
			getSouth: function() {
				return this._southWest.lat;
			},
			getEast: function() {
				return this._northEast.lng;
			},
			getNorth: function() {
				return this._northEast.lat;
			},
			contains: function(e) {
				e = typeof e[0] == "number" || e instanceof P || "lat" in e ? F(e) : N(e);
				var t = this._southWest, n = this._northEast, r, i;
				return e instanceof M ? (r = e.getSouthWest(), i = e.getNorthEast()) : r = i = e, r.lat >= t.lat && i.lat <= n.lat && r.lng >= t.lng && i.lng <= n.lng;
			},
			intersects: function(e) {
				e = N(e);
				var t = this._southWest, n = this._northEast, r = e.getSouthWest(), i = e.getNorthEast(), a = i.lat >= t.lat && r.lat <= n.lat, o = i.lng >= t.lng && r.lng <= n.lng;
				return a && o;
			},
			overlaps: function(e) {
				e = N(e);
				var t = this._southWest, n = this._northEast, r = e.getSouthWest(), i = e.getNorthEast(), a = i.lat > t.lat && r.lat < n.lat, o = i.lng > t.lng && r.lng < n.lng;
				return a && o;
			},
			toBBoxString: function() {
				return [
					this.getWest(),
					this.getSouth(),
					this.getEast(),
					this.getNorth()
				].join(",");
			},
			equals: function(e, t) {
				return e ? (e = N(e), this._southWest.equals(e.getSouthWest(), t) && this._northEast.equals(e.getNorthEast(), t)) : !1;
			},
			isValid: function() {
				return !!(this._southWest && this._northEast);
			}
		};
		function N(e, t) {
			return e instanceof M ? e : new M(e, t);
		}
		function P(e, t, n) {
			if (isNaN(e) || isNaN(t)) throw Error("Invalid LatLng object: (" + e + ", " + t + ")");
			this.lat = +e, this.lng = +t, n !== void 0 && (this.alt = +n);
		}
		P.prototype = {
			equals: function(e, t) {
				return e ? (e = F(e), Math.max(Math.abs(this.lat - e.lat), Math.abs(this.lng - e.lng)) <= (t === void 0 ? 1e-9 : t)) : !1;
			},
			toString: function(e) {
				return "LatLng(" + u(this.lat, e) + ", " + u(this.lng, e) + ")";
			},
			distanceTo: function(e) {
				return oe.distance(this, F(e));
			},
			wrap: function() {
				return oe.wrapLatLng(this);
			},
			toBounds: function(e) {
				var t = 180 * e / 40075017, n = t / Math.cos(Math.PI / 180 * this.lat);
				return N([this.lat - t, this.lng - n], [this.lat + t, this.lng + n]);
			},
			clone: function() {
				return new P(this.lat, this.lng, this.alt);
			}
		};
		function F(e, t, n) {
			return e instanceof P ? e : _(e) && typeof e[0] != "object" ? e.length === 3 ? new P(e[0], e[1], e[2]) : e.length === 2 ? new P(e[0], e[1]) : null : e == null ? e : typeof e == "object" && "lat" in e ? new P(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : t === void 0 ? null : new P(e, t, n);
		}
		var ae = {
			latLngToPoint: function(e, t) {
				var n = this.projection.project(e), r = this.scale(t);
				return this.transformation._transform(n, r);
			},
			pointToLatLng: function(e, t) {
				var n = this.scale(t), r = this.transformation.untransform(e, n);
				return this.projection.unproject(r);
			},
			project: function(e) {
				return this.projection.project(e);
			},
			unproject: function(e) {
				return this.projection.unproject(e);
			},
			scale: function(e) {
				return 256 * 2 ** e;
			},
			zoom: function(e) {
				return Math.log(e / 256) / Math.LN2;
			},
			getProjectedBounds: function(e) {
				if (this.infinite) return null;
				var t = this.projection.bounds, n = this.scale(e);
				return new j(this.transformation.transform(t.min, n), this.transformation.transform(t.max, n));
			},
			infinite: !1,
			wrapLatLng: function(e) {
				var t = this.wrapLng ? c(e.lng, this.wrapLng, !0) : e.lng, n = this.wrapLat ? c(e.lat, this.wrapLat, !0) : e.lat, r = e.alt;
				return new P(n, t, r);
			},
			wrapLatLngBounds: function(e) {
				var t = e.getCenter(), n = this.wrapLatLng(t), r = t.lat - n.lat, i = t.lng - n.lng;
				if (r === 0 && i === 0) return e;
				var a = e.getSouthWest(), o = e.getNorthEast();
				return new M(new P(a.lat - r, a.lng - i), new P(o.lat - r, o.lng - i));
			}
		}, oe = n({}, ae, {
			wrapLng: [-180, 180],
			R: 6371e3,
			distance: function(e, t) {
				var n = Math.PI / 180, r = e.lat * n, i = t.lat * n, a = Math.sin((t.lat - e.lat) * n / 2), o = Math.sin((t.lng - e.lng) * n / 2), s = a * a + Math.cos(r) * Math.cos(i) * o * o, c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
				return this.R * c;
			}
		}), se = 6378137, ce = {
			R: se,
			MAX_LATITUDE: 85.0511287798,
			project: function(e) {
				var t = Math.PI / 180, n = this.MAX_LATITUDE, r = Math.max(Math.min(n, e.lat), -n), i = Math.sin(r * t);
				return new k(this.R * e.lng * t, this.R * Math.log((1 + i) / (1 - i)) / 2);
			},
			unproject: function(e) {
				var t = 180 / Math.PI;
				return new P((2 * Math.atan(Math.exp(e.y / this.R)) - Math.PI / 2) * t, e.x * t / this.R);
			},
			bounds: (function() {
				var e = se * Math.PI;
				return new j([-e, -e], [e, e]);
			})()
		};
		function le(e, t, n, r) {
			_(e) ? (this._a = e[0], this._b = e[1], this._c = e[2], this._d = e[3]) : (this._a = e, this._b = t, this._c = n, this._d = r);
		}
		le.prototype = {
			transform: function(e, t) {
				return this._transform(e.clone(), t);
			},
			_transform: function(e, t) {
				return t ||= 1, e.x = t * (this._a * e.x + this._b), e.y = t * (this._c * e.y + this._d), e;
			},
			untransform: function(e, t) {
				return t ||= 1, new k((e.x / t - this._b) / this._a, (e.y / t - this._d) / this._c);
			}
		};
		function ue(e, t, n, r) {
			return new le(e, t, n, r);
		}
		var de = n({}, oe, {
			code: "EPSG:3857",
			projection: ce,
			transformation: function() {
				var e = .5 / (Math.PI * ce.R);
				return ue(e, .5, -e, .5);
			}()
		}), fe = n({}, de, { code: "EPSG:900913" });
		function pe(e) {
			return document.createElementNS("http://www.w3.org/2000/svg", e);
		}
		function me(e, t) {
			for (var n = "", r = 0, i, a = e.length, o, s, c; r < a; r++) {
				for (s = e[r], i = 0, o = s.length; i < o; i++) c = s[i], n += (i ? "L" : "M") + c.x + " " + c.y;
				n += t ? V.svg ? "z" : "x" : "";
			}
			return n || "M0 0";
		}
		var he = document.documentElement.style, ge = "ActiveXObject" in window, _e = ge && !document.addEventListener, ve = "msLaunchUri" in navigator && !("documentMode" in document), ye = Je("webkit"), be = Je("android"), xe = Je("android 2") || Je("android 3"), Se = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), Ce = be && Je("Google") && Se < 537 && !("AudioNode" in window), we = !!window.opera, I = !ve && Je("chrome"), Te = Je("gecko") && !ye && !we && !ge, Ee = !I && Je("safari"), De = Je("phantom"), Oe = "OTransition" in he, ke = navigator.platform.indexOf("Win") === 0, Ae = ge && "transition" in he, je = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !xe, R = "MozPerspective" in he, Me = !window.L_DISABLE_3D && (Ae || je || R) && !Oe && !De, z = typeof orientation < "u" || Je("mobile"), Ne = z && ye, Pe = z && je, B = !window.PointerEvent && window.MSPointerEvent, Fe = !!(window.PointerEvent || B), Ie = "ontouchstart" in window || !!window.TouchEvent, Le = !window.L_NO_TOUCH && (Ie || Fe), Re = z && we, ze = z && Te, Be = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, Ve = function() {
			var e = !1;
			try {
				var t = Object.defineProperty({}, "passive", { get: function() {
					e = !0;
				} });
				window.addEventListener("testPassiveEventSupport", l, t), window.removeEventListener("testPassiveEventSupport", l, t);
			} catch {}
			return e;
		}(), He = function() {
			return !!document.createElement("canvas").getContext;
		}(), Ue = !!(document.createElementNS && pe("svg").createSVGRect), We = !!Ue && (function() {
			var e = document.createElement("div");
			return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
		})(), Ge = !Ue && function() {
			try {
				var e = document.createElement("div");
				e.innerHTML = "<v:shape adj=\"1\"/>";
				var t = e.firstChild;
				return t.style.behavior = "url(#default#VML)", t && typeof t.adj == "object";
			} catch {
				return !1;
			}
		}(), Ke = navigator.platform.indexOf("Mac") === 0, qe = navigator.platform.indexOf("Linux") === 0;
		function Je(e) {
			return navigator.userAgent.toLowerCase().indexOf(e) >= 0;
		}
		var V = {
			ie: ge,
			ielt9: _e,
			edge: ve,
			webkit: ye,
			android: be,
			android23: xe,
			androidStock: Ce,
			opera: we,
			chrome: I,
			gecko: Te,
			safari: Ee,
			phantom: De,
			opera12: Oe,
			win: ke,
			ie3d: Ae,
			webkit3d: je,
			gecko3d: R,
			any3d: Me,
			mobile: z,
			mobileWebkit: Ne,
			mobileWebkit3d: Pe,
			msPointer: B,
			pointer: Fe,
			touch: Le,
			touchNative: Ie,
			mobileOpera: Re,
			mobileGecko: ze,
			retina: Be,
			passiveEvents: Ve,
			canvas: He,
			svg: Ue,
			vml: Ge,
			inlineSvg: We,
			mac: Ke,
			linux: qe
		}, Ye = V.msPointer ? "MSPointerDown" : "pointerdown", Xe = V.msPointer ? "MSPointerMove" : "pointermove", Ze = V.msPointer ? "MSPointerUp" : "pointerup", Qe = V.msPointer ? "MSPointerCancel" : "pointercancel", $e = {
			touchstart: Ye,
			touchmove: Xe,
			touchend: Ze,
			touchcancel: Qe
		}, et = {
			touchstart: ut,
			touchmove: lt,
			touchend: lt,
			touchcancel: lt
		}, tt = {}, nt = !1;
		function rt(e, t, n) {
			return t === "touchstart" && ct(), et[t] ? (n = et[t].bind(this, n), e.addEventListener($e[t], n, !1), n) : (console.warn("wrong event specified:", t), l);
		}
		function it(e, t, n) {
			$e[t] ? e.removeEventListener($e[t], n, !1) : console.warn("wrong event specified:", t);
		}
		function at(e) {
			tt[e.pointerId] = e;
		}
		function ot(e) {
			tt[e.pointerId] && (tt[e.pointerId] = e);
		}
		function st(e) {
			delete tt[e.pointerId];
		}
		function ct() {
			nt ||= (document.addEventListener(Ye, at, !0), document.addEventListener(Xe, ot, !0), document.addEventListener(Ze, st, !0), document.addEventListener(Qe, st, !0), !0);
		}
		function lt(e, t) {
			if (t.pointerType !== (t.MSPOINTER_TYPE_MOUSE || "mouse")) {
				for (var n in t.touches = [], tt) t.touches.push(tt[n]);
				t.changedTouches = [t], e(t);
			}
		}
		function ut(e, t) {
			t.MSPOINTER_TYPE_TOUCH && t.pointerType === t.MSPOINTER_TYPE_TOUCH && nn(t), lt(e, t);
		}
		function dt(e) {
			var t = {}, n, r;
			for (r in e) n = e[r], t[r] = n && n.bind ? n.bind(e) : n;
			return e = t, t.type = "dblclick", t.detail = 2, t.isTrusted = !1, t._simulated = !0, t;
		}
		var ft = 200;
		function pt(e, t) {
			e.addEventListener("dblclick", t);
			var n = 0, r;
			function i(e) {
				if (e.detail !== 1) r = e.detail;
				else if (!(e.pointerType === "mouse" || e.sourceCapabilities && !e.sourceCapabilities.firesTouchEvents)) {
					var i = an(e);
					if (!i.some(function(e) {
						return e instanceof HTMLLabelElement && e.attributes.for;
					}) || i.some(function(e) {
						return e instanceof HTMLInputElement || e instanceof HTMLSelectElement;
					})) {
						var a = Date.now();
						a - n <= ft ? (r++, r === 2 && t(dt(e))) : r = 1, n = a;
					}
				}
			}
			return e.addEventListener("click", i), {
				dblclick: t,
				simDblclick: i
			};
		}
		function mt(e, t) {
			e.removeEventListener("dblclick", t.dblclick), e.removeEventListener("click", t.simDblclick);
		}
		var ht = jt([
			"transform",
			"webkitTransform",
			"OTransform",
			"MozTransform",
			"msTransform"
		]), gt = jt([
			"webkitTransition",
			"transition",
			"OTransition",
			"MozTransition",
			"msTransition"
		]), _t = gt === "webkitTransition" || gt === "OTransition" ? gt + "End" : "transitionend";
		function vt(e) {
			return typeof e == "string" ? document.getElementById(e) : e;
		}
		function yt(e, t) {
			var n = e.style[t] || e.currentStyle && e.currentStyle[t];
			if ((!n || n === "auto") && document.defaultView) {
				var r = document.defaultView.getComputedStyle(e, null);
				n = r ? r[t] : null;
			}
			return n === "auto" ? null : n;
		}
		function bt(e, t, n) {
			var r = document.createElement(e);
			return r.className = t || "", n && n.appendChild(r), r;
		}
		function xt(e) {
			var t = e.parentNode;
			t && t.removeChild(e);
		}
		function St(e) {
			for (; e.firstChild;) e.removeChild(e.firstChild);
		}
		function H(e) {
			var t = e.parentNode;
			t && t.lastChild !== e && t.appendChild(e);
		}
		function Ct(e) {
			var t = e.parentNode;
			t && t.firstChild !== e && t.insertBefore(e, t.firstChild);
		}
		function wt(e, t) {
			if (e.classList !== void 0) return e.classList.contains(t);
			var n = Ot(e);
			return n.length > 0 && RegExp("(^|\\s)" + t + "(\\s|$)").test(n);
		}
		function Tt(e, t) {
			if (e.classList !== void 0) for (var n = f(t), r = 0, i = n.length; r < i; r++) e.classList.add(n[r]);
			else if (!wt(e, t)) {
				var a = Ot(e);
				Dt(e, (a ? a + " " : "") + t);
			}
		}
		function Et(e, t) {
			e.classList === void 0 ? Dt(e, d((" " + Ot(e) + " ").replace(" " + t + " ", " "))) : e.classList.remove(t);
		}
		function Dt(e, t) {
			e.className.baseVal === void 0 ? e.className = t : e.className.baseVal = t;
		}
		function Ot(e) {
			return e.correspondingElement && (e = e.correspondingElement), e.className.baseVal === void 0 ? e.className : e.className.baseVal;
		}
		function kt(e, t) {
			"opacity" in e.style ? e.style.opacity = t : "filter" in e.style && At(e, t);
		}
		function At(e, t) {
			var n = !1, r = "DXImageTransform.Microsoft.Alpha";
			try {
				n = e.filters.item(r);
			} catch {
				if (t === 1) return;
			}
			t = Math.round(t * 100), n ? (n.Enabled = t !== 100, n.Opacity = t) : e.style.filter += " progid:" + r + "(opacity=" + t + ")";
		}
		function jt(e) {
			for (var t = document.documentElement.style, n = 0; n < e.length; n++) if (e[n] in t) return e[n];
			return !1;
		}
		function Mt(e, t, n) {
			var r = t || new k(0, 0);
			e.style[ht] = (V.ie3d ? "translate(" + r.x + "px," + r.y + "px)" : "translate3d(" + r.x + "px," + r.y + "px,0)") + (n ? " scale(" + n + ")" : "");
		}
		function Nt(e, t) {
			e._leaflet_pos = t, V.any3d ? Mt(e, t) : (e.style.left = t.x + "px", e.style.top = t.y + "px");
		}
		function Pt(e) {
			return e._leaflet_pos || new k(0, 0);
		}
		var Ft, It, Lt;
		if ("onselectstart" in document) Ft = function() {
			Jt(window, "selectstart", nn);
		}, It = function() {
			Xt(window, "selectstart", nn);
		};
		else {
			var Rt = jt([
				"userSelect",
				"WebkitUserSelect",
				"OUserSelect",
				"MozUserSelect",
				"msUserSelect"
			]);
			Ft = function() {
				if (Rt) {
					var e = document.documentElement.style;
					Lt = e[Rt], e[Rt] = "none";
				}
			}, It = function() {
				Rt && (document.documentElement.style[Rt] = Lt, Lt = void 0);
			};
		}
		function zt() {
			Jt(window, "dragstart", nn);
		}
		function Bt() {
			Xt(window, "dragstart", nn);
		}
		var Vt, Ht;
		function Ut(e) {
			for (; e.tabIndex === -1;) e = e.parentNode;
			e.style && (Wt(), Vt = e, Ht = e.style.outlineStyle, e.style.outlineStyle = "none", Jt(window, "keydown", Wt));
		}
		function Wt() {
			Vt && (Vt.style.outlineStyle = Ht, Vt = void 0, Ht = void 0, Xt(window, "keydown", Wt));
		}
		function Gt(e) {
			do
				e = e.parentNode;
			while ((!e.offsetWidth || !e.offsetHeight) && e !== document.body);
			return e;
		}
		function Kt(e) {
			var t = e.getBoundingClientRect();
			return {
				x: t.width / e.offsetWidth || 1,
				y: t.height / e.offsetHeight || 1,
				boundingClientRect: t
			};
		}
		var qt = {
			__proto__: null,
			TRANSFORM: ht,
			TRANSITION: gt,
			TRANSITION_END: _t,
			get: vt,
			getStyle: yt,
			create: bt,
			remove: xt,
			empty: St,
			toFront: H,
			toBack: Ct,
			hasClass: wt,
			addClass: Tt,
			removeClass: Et,
			setClass: Dt,
			getClass: Ot,
			setOpacity: kt,
			testProp: jt,
			setTransform: Mt,
			setPosition: Nt,
			getPosition: Pt,
			get disableTextSelection() {
				return Ft;
			},
			get enableTextSelection() {
				return It;
			},
			disableImageDrag: zt,
			enableImageDrag: Bt,
			preventOutline: Ut,
			restoreOutline: Wt,
			getSizedParentNode: Gt,
			getScale: Kt
		};
		function Jt(e, t, n, r) {
			if (t && typeof t == "object") for (var i in t) Qt(e, i, t[i], n);
			else {
				t = f(t);
				for (var a = 0, o = t.length; a < o; a++) Qt(e, t[a], n, r);
			}
			return this;
		}
		var Yt = "_leaflet_events";
		function Xt(e, t, n, r) {
			if (arguments.length === 1) Zt(e), delete e[Yt];
			else if (t && typeof t == "object") for (var i in t) W(e, i, t[i], n);
			else if (t = f(t), arguments.length === 2) Zt(e, function(e) {
				return v(t, e) !== -1;
			});
			else for (var a = 0, o = t.length; a < o; a++) W(e, t[a], n, r);
			return this;
		}
		function Zt(e, t) {
			for (var n in e[Yt]) {
				var r = n.split(/\d/)[0];
				(!t || t(r)) && W(e, r, null, null, n);
			}
		}
		var U = {
			mouseenter: "mouseover",
			mouseleave: "mouseout",
			wheel: !("onwheel" in window) && "mousewheel"
		};
		function Qt(e, t, n, r) {
			var i = t + o(n) + (r ? "_" + o(r) : "");
			if (e[Yt] && e[Yt][i]) return this;
			var a = function(t) {
				return n.call(r || e, t || window.event);
			}, s = a;
			!V.touchNative && V.pointer && t.indexOf("touch") === 0 ? a = rt(e, t, a) : V.touch && t === "dblclick" ? a = pt(e, a) : "addEventListener" in e ? t === "touchstart" || t === "touchmove" || t === "wheel" || t === "mousewheel" ? e.addEventListener(U[t] || t, a, V.passiveEvents ? { passive: !1 } : !1) : t === "mouseenter" || t === "mouseleave" ? (a = function(t) {
				t ||= window.event, ln(e, t) && s(t);
			}, e.addEventListener(U[t], a, !1)) : e.addEventListener(t, s, !1) : e.attachEvent("on" + t, a), e[Yt] = e[Yt] || {}, e[Yt][i] = a;
		}
		function W(e, t, n, r, i) {
			i ||= t + o(n) + (r ? "_" + o(r) : "");
			var a = e[Yt] && e[Yt][i];
			if (!a) return this;
			!V.touchNative && V.pointer && t.indexOf("touch") === 0 ? it(e, t, a) : V.touch && t === "dblclick" ? mt(e, a) : "removeEventListener" in e ? e.removeEventListener(U[t] || t, a, !1) : e.detachEvent("on" + t, a), e[Yt][i] = null;
		}
		function $t(e) {
			return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, this;
		}
		function en(e) {
			return Qt(e, "wheel", $t), this;
		}
		function tn(e) {
			return Jt(e, "mousedown touchstart dblclick contextmenu", $t), e._leaflet_disable_click = !0, this;
		}
		function nn(e) {
			return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this;
		}
		function rn(e) {
			return nn(e), $t(e), this;
		}
		function an(e) {
			if (e.composedPath) return e.composedPath();
			for (var t = [], n = e.target; n;) t.push(n), n = n.parentNode;
			return t;
		}
		function on(e, t) {
			if (!t) return new k(e.clientX, e.clientY);
			var n = Kt(t), r = n.boundingClientRect;
			return new k((e.clientX - r.left) / n.x - t.clientLeft, (e.clientY - r.top) / n.y - t.clientTop);
		}
		var sn = V.linux && V.chrome ? window.devicePixelRatio : V.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
		function cn(e) {
			return V.edge ? e.wheelDeltaY / 2 : e.deltaY && e.deltaMode === 0 ? -e.deltaY / sn : e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : e.deltaX || e.deltaZ ? 0 : e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : e.detail ? e.detail / -32765 * 60 : 0;
		}
		function ln(e, t) {
			var n = t.relatedTarget;
			if (!n) return !0;
			try {
				for (; n && n !== e;) n = n.parentNode;
			} catch {
				return !1;
			}
			return n !== e;
		}
		var un = {
			__proto__: null,
			on: Jt,
			off: Xt,
			stopPropagation: $t,
			disableScrollPropagation: en,
			disableClickPropagation: tn,
			preventDefault: nn,
			stop: rn,
			getPropagationPath: an,
			getMousePosition: on,
			getWheelDelta: cn,
			isExternalTarget: ln,
			addListener: Jt,
			removeListener: Xt
		}, dn = O.extend({
			run: function(e, t, n, r) {
				this.stop(), this._el = e, this._inProgress = !0, this._duration = n || .25, this._easeOutPower = 1 / Math.max(r || .5, .2), this._startPos = Pt(e), this._offset = t.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
			},
			stop: function() {
				this._inProgress && (this._step(!0), this._complete());
			},
			_animate: function() {
				this._animId = te(this._animate, this), this._step();
			},
			_step: function(e) {
				var t = +/* @__PURE__ */ new Date() - this._startTime, n = this._duration * 1e3;
				t < n ? this._runFrame(this._easeOut(t / n), e) : (this._runFrame(1), this._complete());
			},
			_runFrame: function(e, t) {
				var n = this._startPos.add(this._offset.multiplyBy(e));
				t && n._round(), Nt(this._el, n), this.fire("step");
			},
			_complete: function() {
				w(this._animId), this._inProgress = !1, this.fire("end");
			},
			_easeOut: function(e) {
				return 1 - (1 - e) ** this._easeOutPower;
			}
		}), fn = O.extend({
			options: {
				crs: de,
				center: void 0,
				zoom: void 0,
				minZoom: void 0,
				maxZoom: void 0,
				layers: [],
				maxBounds: void 0,
				renderer: void 0,
				zoomAnimation: !0,
				zoomAnimationThreshold: 4,
				fadeAnimation: !0,
				markerZoomAnimation: !0,
				transform3DLimit: 8388608,
				zoomSnap: 1,
				zoomDelta: 1,
				trackResize: !0
			},
			initialize: function(e, t) {
				t = p(this, t), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(e), this._initLayout(), this._onResize = i(this._onResize, this), this._initEvents(), t.maxBounds && this.setMaxBounds(t.maxBounds), t.zoom !== void 0 && (this._zoom = this._limitZoom(t.zoom)), t.center && t.zoom !== void 0 && this.setView(F(t.center), t.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = gt && V.any3d && !V.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), Jt(this._proxy, _t, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
			},
			setView: function(e, t, r) {
				return t = t === void 0 ? this._zoom : this._limitZoom(t), e = this._limitCenter(F(e), t, this.options.maxBounds), r ||= {}, this._stop(), this._loaded && !r.reset && r !== !0 && (r.animate !== void 0 && (r.zoom = n({ animate: r.animate }, r.zoom), r.pan = n({
					animate: r.animate,
					duration: r.duration
				}, r.pan)), this._zoom === t ? this._tryAnimatedPan(e, r.pan) : this._tryAnimatedZoom && this._tryAnimatedZoom(e, t, r.zoom)) ? (clearTimeout(this._sizeTimer), this) : (this._resetView(e, t, r.pan && r.pan.noMoveStart), this);
			},
			setZoom: function(e, t) {
				return this._loaded ? this.setView(this.getCenter(), e, { zoom: t }) : (this._zoom = e, this);
			},
			zoomIn: function(e, t) {
				return e ||= V.any3d ? this.options.zoomDelta : 1, this.setZoom(this._zoom + e, t);
			},
			zoomOut: function(e, t) {
				return e ||= V.any3d ? this.options.zoomDelta : 1, this.setZoom(this._zoom - e, t);
			},
			setZoomAround: function(e, t, n) {
				var r = this.getZoomScale(t), i = this.getSize().divideBy(2), a = (e instanceof k ? e : this.latLngToContainerPoint(e)).subtract(i).multiplyBy(1 - 1 / r), o = this.containerPointToLatLng(i.add(a));
				return this.setView(o, t, { zoom: n });
			},
			_getBoundsCenterZoom: function(e, t) {
				t ||= {}, e = e.getBounds ? e.getBounds() : N(e);
				var n = A(t.paddingTopLeft || t.padding || [0, 0]), r = A(t.paddingBottomRight || t.padding || [0, 0]), i = this.getBoundsZoom(e, !1, n.add(r));
				if (i = typeof t.maxZoom == "number" ? Math.min(t.maxZoom, i) : i, i === Infinity) return {
					center: e.getCenter(),
					zoom: i
				};
				var a = r.subtract(n).divideBy(2), o = this.project(e.getSouthWest(), i), s = this.project(e.getNorthEast(), i);
				return {
					center: this.unproject(o.add(s).divideBy(2).add(a), i),
					zoom: i
				};
			},
			fitBounds: function(e, t) {
				if (e = N(e), !e.isValid()) throw Error("Bounds are not valid.");
				var n = this._getBoundsCenterZoom(e, t);
				return this.setView(n.center, n.zoom, t);
			},
			fitWorld: function(e) {
				return this.fitBounds([[-90, -180], [90, 180]], e);
			},
			panTo: function(e, t) {
				return this.setView(e, this._zoom, { pan: t });
			},
			panBy: function(e, t) {
				if (e = A(e).round(), t ||= {}, !e.x && !e.y) return this.fire("moveend");
				if (t.animate !== !0 && !this.getSize().contains(e)) return this._resetView(this.unproject(this.project(this.getCenter()).add(e)), this.getZoom()), this;
				if (this._panAnim || (this._panAnim = new dn(), this._panAnim.on({
					step: this._onPanTransitionStep,
					end: this._onPanTransitionEnd
				}, this)), t.noMoveStart || this.fire("movestart"), t.animate !== !1) {
					Tt(this._mapPane, "leaflet-pan-anim");
					var n = this._getMapPanePos().subtract(e).round();
					this._panAnim.run(this._mapPane, n, t.duration || .25, t.easeLinearity);
				} else this._rawPanBy(e), this.fire("move").fire("moveend");
				return this;
			},
			flyTo: function(e, t, n) {
				if (n ||= {}, n.animate === !1 || !V.any3d) return this.setView(e, t, n);
				this._stop();
				var r = this.project(this.getCenter()), i = this.project(e), a = this.getSize(), o = this._zoom;
				e = F(e), t = t === void 0 ? o : t;
				var s = Math.max(a.x, a.y), c = s * this.getZoomScale(o, t), l = i.distanceTo(r) || 1, u = 1.42, d = u * u;
				function f(e) {
					var t = e ? -1 : 1, n = e ? c : s, r = (c * c - s * s + t * d * d * l * l) / (2 * n * d * l), i = Math.sqrt(r * r + 1) - r;
					return i < 1e-9 ? -18 : Math.log(i);
				}
				function p(e) {
					return (Math.exp(e) - Math.exp(-e)) / 2;
				}
				function m(e) {
					return (Math.exp(e) + Math.exp(-e)) / 2;
				}
				function h(e) {
					return p(e) / m(e);
				}
				var g = f(0);
				function _(e) {
					return s * (m(g) / m(g + u * e));
				}
				function v(e) {
					return s * (m(g) * h(g + u * e) - p(g)) / d;
				}
				function y(e) {
					return 1 - (1 - e) ** 1.5;
				}
				var b = Date.now(), x = (f(1) - g) / u, S = n.duration ? 1e3 * n.duration : 1e3 * x * .8;
				function C() {
					var n = (Date.now() - b) / S, a = y(n) * x;
					n <= 1 ? (this._flyToFrame = te(C, this), this._move(this.unproject(r.add(i.subtract(r).multiplyBy(v(a) / l)), o), this.getScaleZoom(s / _(a), o), { flyTo: !0 })) : this._move(e, t)._moveEnd(!0);
				}
				return this._moveStart(!0, n.noMoveStart), C.call(this), this;
			},
			flyToBounds: function(e, t) {
				var n = this._getBoundsCenterZoom(e, t);
				return this.flyTo(n.center, n.zoom, t);
			},
			setMaxBounds: function(e) {
				return e = N(e), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), e.isValid() ? (this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
			},
			setMinZoom: function(e) {
				var t = this.options.minZoom;
				return this.options.minZoom = e, this._loaded && t !== e && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(e) : this;
			},
			setMaxZoom: function(e) {
				var t = this.options.maxZoom;
				return this.options.maxZoom = e, this._loaded && t !== e && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(e) : this;
			},
			panInsideBounds: function(e, t) {
				this._enforcingBounds = !0;
				var n = this.getCenter(), r = this._limitCenter(n, this._zoom, N(e));
				return n.equals(r) || this.panTo(r, t), this._enforcingBounds = !1, this;
			},
			panInside: function(e, t) {
				t ||= {};
				var n = A(t.paddingTopLeft || t.padding || [0, 0]), r = A(t.paddingBottomRight || t.padding || [0, 0]), i = this.project(this.getCenter()), a = this.project(e), o = this.getPixelBounds(), s = ie([o.min.add(n), o.max.subtract(r)]), c = s.getSize();
				if (!s.contains(a)) {
					this._enforcingBounds = !0;
					var l = a.subtract(s.getCenter()), u = s.extend(a).getSize().subtract(c);
					i.x += l.x < 0 ? -u.x : u.x, i.y += l.y < 0 ? -u.y : u.y, this.panTo(this.unproject(i), t), this._enforcingBounds = !1;
				}
				return this;
			},
			invalidateSize: function(e) {
				if (!this._loaded) return this;
				e = n({
					animate: !1,
					pan: !0
				}, e === !0 ? { animate: !0 } : e);
				var t = this.getSize();
				this._sizeChanged = !0, this._lastCenter = null;
				var r = this.getSize(), a = t.divideBy(2).round(), o = r.divideBy(2).round(), s = a.subtract(o);
				return !s.x && !s.y ? this : (e.animate && e.pan ? this.panBy(s) : (e.pan && this._rawPanBy(s), this.fire("move"), e.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(i(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
					oldSize: t,
					newSize: r
				}));
			},
			stop: function() {
				return this.setZoom(this._limitZoom(this._zoom)), this.options.zoomSnap || this.fire("viewreset"), this._stop();
			},
			locate: function(e) {
				if (e = this._locateOptions = n({
					timeout: 1e4,
					watch: !1
				}, e), !("geolocation" in navigator)) return this._handleGeolocationError({
					code: 0,
					message: "Geolocation not supported."
				}), this;
				var t = i(this._handleGeolocationResponse, this), r = i(this._handleGeolocationError, this);
				return e.watch ? this._locationWatchId = navigator.geolocation.watchPosition(t, r, e) : navigator.geolocation.getCurrentPosition(t, r, e), this;
			},
			stopLocate: function() {
				return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
			},
			_handleGeolocationError: function(e) {
				if (this._container._leaflet_id) {
					var t = e.code, n = e.message || (t === 1 ? "permission denied" : t === 2 ? "position unavailable" : "timeout");
					this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
						code: t,
						message: "Geolocation error: " + n + "."
					});
				}
			},
			_handleGeolocationResponse: function(e) {
				if (this._container._leaflet_id) {
					var t = e.coords.latitude, n = e.coords.longitude, r = new P(t, n), i = r.toBounds(e.coords.accuracy * 2), a = this._locateOptions;
					if (a.setView) {
						var o = this.getBoundsZoom(i);
						this.setView(r, a.maxZoom ? Math.min(o, a.maxZoom) : o);
					}
					var s = {
						latlng: r,
						bounds: i,
						timestamp: e.timestamp
					};
					for (var c in e.coords) typeof e.coords[c] == "number" && (s[c] = e.coords[c]);
					this.fire("locationfound", s);
				}
			},
			addHandler: function(e, t) {
				if (!t) return this;
				var n = this[e] = new t(this);
				return this._handlers.push(n), this.options[e] && n.enable(), this;
			},
			remove: function() {
				if (this._initEvents(!0), this.options.maxBounds && this.off("moveend", this._panInsideMaxBounds), this._containerId !== this._container._leaflet_id) throw Error("Map container is being reused by another instance");
				try {
					delete this._container._leaflet_id, delete this._containerId;
				} catch {
					this._container._leaflet_id = void 0, this._containerId = void 0;
				}
				for (var e in this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), xt(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest &&= (w(this._resizeRequest), null), this._clearHandlers(), this._loaded && this.fire("unload"), this._layers) this._layers[e].remove();
				for (e in this._panes) xt(this._panes[e]);
				return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
			},
			createPane: function(e, t) {
				var n = bt("div", "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""), t || this._mapPane);
				return e && (this._panes[e] = n), n;
			},
			getCenter: function() {
				return this._checkIfLoaded(), this._lastCenter && !this._moved() ? this._lastCenter.clone() : this.layerPointToLatLng(this._getCenterLayerPoint());
			},
			getZoom: function() {
				return this._zoom;
			},
			getBounds: function() {
				var e = this.getPixelBounds();
				return new M(this.unproject(e.getBottomLeft()), this.unproject(e.getTopRight()));
			},
			getMinZoom: function() {
				return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
			},
			getMaxZoom: function() {
				return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? Infinity : this._layersMaxZoom : this.options.maxZoom;
			},
			getBoundsZoom: function(e, t, n) {
				e = N(e), n = A(n || [0, 0]);
				var r = this.getZoom() || 0, i = this.getMinZoom(), a = this.getMaxZoom(), o = e.getNorthWest(), s = e.getSouthEast(), c = this.getSize().subtract(n), l = ie(this.project(s, r), this.project(o, r)).getSize(), u = V.any3d ? this.options.zoomSnap : 1, d = c.x / l.x, f = c.y / l.y, p = t ? Math.max(d, f) : Math.min(d, f);
				return r = this.getScaleZoom(p, r), u && (r = Math.round(r / (u / 100)) * (u / 100), r = t ? Math.ceil(r / u) * u : Math.floor(r / u) * u), Math.max(i, Math.min(a, r));
			},
			getSize: function() {
				return (!this._size || this._sizeChanged) && (this._size = new k(this._container.clientWidth || 0, this._container.clientHeight || 0), this._sizeChanged = !1), this._size.clone();
			},
			getPixelBounds: function(e, t) {
				var n = this._getTopLeftPoint(e, t);
				return new j(n, n.add(this.getSize()));
			},
			getPixelOrigin: function() {
				return this._checkIfLoaded(), this._pixelOrigin;
			},
			getPixelWorldBounds: function(e) {
				return this.options.crs.getProjectedBounds(e === void 0 ? this.getZoom() : e);
			},
			getPane: function(e) {
				return typeof e == "string" ? this._panes[e] : e;
			},
			getPanes: function() {
				return this._panes;
			},
			getContainer: function() {
				return this._container;
			},
			getZoomScale: function(e, t) {
				var n = this.options.crs;
				return t = t === void 0 ? this._zoom : t, n.scale(e) / n.scale(t);
			},
			getScaleZoom: function(e, t) {
				var n = this.options.crs;
				t = t === void 0 ? this._zoom : t;
				var r = n.zoom(e * n.scale(t));
				return isNaN(r) ? Infinity : r;
			},
			project: function(e, t) {
				return t = t === void 0 ? this._zoom : t, this.options.crs.latLngToPoint(F(e), t);
			},
			unproject: function(e, t) {
				return t = t === void 0 ? this._zoom : t, this.options.crs.pointToLatLng(A(e), t);
			},
			layerPointToLatLng: function(e) {
				var t = A(e).add(this.getPixelOrigin());
				return this.unproject(t);
			},
			latLngToLayerPoint: function(e) {
				return this.project(F(e))._round()._subtract(this.getPixelOrigin());
			},
			wrapLatLng: function(e) {
				return this.options.crs.wrapLatLng(F(e));
			},
			wrapLatLngBounds: function(e) {
				return this.options.crs.wrapLatLngBounds(N(e));
			},
			distance: function(e, t) {
				return this.options.crs.distance(F(e), F(t));
			},
			containerPointToLayerPoint: function(e) {
				return A(e).subtract(this._getMapPanePos());
			},
			layerPointToContainerPoint: function(e) {
				return A(e).add(this._getMapPanePos());
			},
			containerPointToLatLng: function(e) {
				var t = this.containerPointToLayerPoint(A(e));
				return this.layerPointToLatLng(t);
			},
			latLngToContainerPoint: function(e) {
				return this.layerPointToContainerPoint(this.latLngToLayerPoint(F(e)));
			},
			mouseEventToContainerPoint: function(e) {
				return on(e, this._container);
			},
			mouseEventToLayerPoint: function(e) {
				return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
			},
			mouseEventToLatLng: function(e) {
				return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
			},
			_initContainer: function(e) {
				var t = this._container = vt(e);
				if (!t) throw Error("Map container not found.");
				if (t._leaflet_id) throw Error("Map container is already initialized.");
				Jt(t, "scroll", this._onScroll, this), this._containerId = o(t);
			},
			_initLayout: function() {
				var e = this._container;
				this._fadeAnimated = this.options.fadeAnimation && V.any3d, Tt(e, "leaflet-container" + (V.touch ? " leaflet-touch" : "") + (V.retina ? " leaflet-retina" : "") + (V.ielt9 ? " leaflet-oldie" : "") + (V.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
				var t = yt(e, "position");
				t !== "absolute" && t !== "relative" && t !== "fixed" && t !== "sticky" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
			},
			_initPanes: function() {
				var e = this._panes = {};
				this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), Nt(this._mapPane, new k(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (Tt(e.markerPane, "leaflet-zoom-hide"), Tt(e.shadowPane, "leaflet-zoom-hide"));
			},
			_resetView: function(e, t, n) {
				Nt(this._mapPane, new k(0, 0));
				var r = !this._loaded;
				this._loaded = !0, t = this._limitZoom(t), this.fire("viewprereset");
				var i = this._zoom !== t;
				this._moveStart(i, n)._move(e, t)._moveEnd(i), this.fire("viewreset"), r && this.fire("load");
			},
			_moveStart: function(e, t) {
				return e && this.fire("zoomstart"), t || this.fire("movestart"), this;
			},
			_move: function(e, t, n, r) {
				t === void 0 && (t = this._zoom);
				var i = this._zoom !== t;
				return this._zoom = t, this._lastCenter = e, this._pixelOrigin = this._getNewPixelOrigin(e), r ? n && n.pinch && this.fire("zoom", n) : ((i || n && n.pinch) && this.fire("zoom", n), this.fire("move", n)), this;
			},
			_moveEnd: function(e) {
				return e && this.fire("zoomend"), this.fire("moveend");
			},
			_stop: function() {
				return w(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
			},
			_rawPanBy: function(e) {
				Nt(this._mapPane, this._getMapPanePos().subtract(e));
			},
			_getZoomSpan: function() {
				return this.getMaxZoom() - this.getMinZoom();
			},
			_panInsideMaxBounds: function() {
				this._enforcingBounds || this.panInsideBounds(this.options.maxBounds);
			},
			_checkIfLoaded: function() {
				if (!this._loaded) throw Error("Set map center and zoom first.");
			},
			_initEvents: function(e) {
				this._targets = {}, this._targets[o(this._container)] = this;
				var t = e ? Xt : Jt;
				t(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && t(window, "resize", this._onResize, this), V.any3d && this.options.transform3DLimit && (e ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
			},
			_onResize: function() {
				w(this._resizeRequest), this._resizeRequest = te(function() {
					this.invalidateSize({ debounceMoveend: !0 });
				}, this);
			},
			_onScroll: function() {
				this._container.scrollTop = 0, this._container.scrollLeft = 0;
			},
			_onMoveEnd: function() {
				var e = this._getMapPanePos();
				Math.max(Math.abs(e.x), Math.abs(e.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
			},
			_findEventTargets: function(e, t) {
				for (var n = [], r, i = t === "mouseout" || t === "mouseover", a = e.target || e.srcElement, s = !1; a;) {
					if (r = this._targets[o(a)], r && (t === "click" || t === "preclick") && this._draggableMoved(r)) {
						s = !0;
						break;
					}
					if (r && r.listens(t, !0) && (i && !ln(a, e) || (n.push(r), i)) || a === this._container) break;
					a = a.parentNode;
				}
				return !n.length && !s && !i && this.listens(t, !0) && (n = [this]), n;
			},
			_isClickDisabled: function(e) {
				for (; e && e !== this._container;) {
					if (e._leaflet_disable_click) return !0;
					e = e.parentNode;
				}
			},
			_handleDOMEvent: function(e) {
				var t = e.target || e.srcElement;
				if (!(!this._loaded || t._leaflet_disable_events || e.type === "click" && this._isClickDisabled(t))) {
					var n = e.type;
					n === "mousedown" && Ut(t), this._fireDOMEvent(e, n);
				}
			},
			_mouseEvents: [
				"click",
				"dblclick",
				"mouseover",
				"mouseout",
				"contextmenu"
			],
			_fireDOMEvent: function(e, t, r) {
				if (e.type === "click") {
					var i = n({}, e);
					i.type = "preclick", this._fireDOMEvent(i, i.type, r);
				}
				var a = this._findEventTargets(e, t);
				if (r) {
					for (var o = [], s = 0; s < r.length; s++) r[s].listens(t, !0) && o.push(r[s]);
					a = o.concat(a);
				}
				if (a.length) {
					t === "contextmenu" && nn(e);
					var c = a[0], l = { originalEvent: e };
					if (e.type !== "keypress" && e.type !== "keydown" && e.type !== "keyup") {
						var u = c.getLatLng && (!c._radius || c._radius <= 10);
						l.containerPoint = u ? this.latLngToContainerPoint(c.getLatLng()) : this.mouseEventToContainerPoint(e), l.layerPoint = this.containerPointToLayerPoint(l.containerPoint), l.latlng = u ? c.getLatLng() : this.layerPointToLatLng(l.layerPoint);
					}
					for (s = 0; s < a.length; s++) if (a[s].fire(t, l, !0), l.originalEvent._stopped || a[s].options.bubblingMouseEvents === !1 && v(this._mouseEvents, t) !== -1) return;
				}
			},
			_draggableMoved: function(e) {
				return e = e.dragging && e.dragging.enabled() ? e : this, e.dragging && e.dragging.moved() || this.boxZoom && this.boxZoom.moved();
			},
			_clearHandlers: function() {
				for (var e = 0, t = this._handlers.length; e < t; e++) this._handlers[e].disable();
			},
			whenReady: function(e, t) {
				return this._loaded ? e.call(t || this, { target: this }) : this.on("load", e, t), this;
			},
			_getMapPanePos: function() {
				return Pt(this._mapPane) || new k(0, 0);
			},
			_moved: function() {
				var e = this._getMapPanePos();
				return e && !e.equals([0, 0]);
			},
			_getTopLeftPoint: function(e, t) {
				return (e && t !== void 0 ? this._getNewPixelOrigin(e, t) : this.getPixelOrigin()).subtract(this._getMapPanePos());
			},
			_getNewPixelOrigin: function(e, t) {
				var n = this.getSize()._divideBy(2);
				return this.project(e, t)._subtract(n)._add(this._getMapPanePos())._round();
			},
			_latLngToNewLayerPoint: function(e, t, n) {
				var r = this._getNewPixelOrigin(n, t);
				return this.project(e, t)._subtract(r);
			},
			_latLngBoundsToNewLayerBounds: function(e, t, n) {
				var r = this._getNewPixelOrigin(n, t);
				return ie([
					this.project(e.getSouthWest(), t)._subtract(r),
					this.project(e.getNorthWest(), t)._subtract(r),
					this.project(e.getSouthEast(), t)._subtract(r),
					this.project(e.getNorthEast(), t)._subtract(r)
				]);
			},
			_getCenterLayerPoint: function() {
				return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
			},
			_getCenterOffset: function(e) {
				return this.latLngToLayerPoint(e).subtract(this._getCenterLayerPoint());
			},
			_limitCenter: function(e, t, n) {
				if (!n) return e;
				var r = this.project(e, t), i = this.getSize().divideBy(2), a = new j(r.subtract(i), r.add(i)), o = this._getBoundsOffset(a, n, t);
				return Math.abs(o.x) <= 1 && Math.abs(o.y) <= 1 ? e : this.unproject(r.add(o), t);
			},
			_limitOffset: function(e, t) {
				if (!t) return e;
				var n = this.getPixelBounds(), r = new j(n.min.add(e), n.max.add(e));
				return e.add(this._getBoundsOffset(r, t));
			},
			_getBoundsOffset: function(e, t, n) {
				var r = ie(this.project(t.getNorthEast(), n), this.project(t.getSouthWest(), n)), i = r.min.subtract(e.min), a = r.max.subtract(e.max);
				return new k(this._rebound(i.x, -a.x), this._rebound(i.y, -a.y));
			},
			_rebound: function(e, t) {
				return e + t > 0 ? Math.round(e - t) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(t));
			},
			_limitZoom: function(e) {
				var t = this.getMinZoom(), n = this.getMaxZoom(), r = V.any3d ? this.options.zoomSnap : 1;
				return r && (e = Math.round(e / r) * r), Math.max(t, Math.min(n, e));
			},
			_onPanTransitionStep: function() {
				this.fire("move");
			},
			_onPanTransitionEnd: function() {
				Et(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
			},
			_tryAnimatedPan: function(e, t) {
				var n = this._getCenterOffset(e)._trunc();
				return (t && t.animate) !== !0 && !this.getSize().contains(n) ? !1 : (this.panBy(n, t), !0);
			},
			_createAnimProxy: function() {
				var e = this._proxy = bt("div", "leaflet-proxy leaflet-zoom-animated");
				this._panes.mapPane.appendChild(e), this.on("zoomanim", function(e) {
					var t = ht, n = this._proxy.style[t];
					Mt(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), n === this._proxy.style[t] && this._animatingZoom && this._onZoomTransitionEnd();
				}, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
			},
			_destroyAnimProxy: function() {
				xt(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
			},
			_animMoveEnd: function() {
				var e = this.getCenter(), t = this.getZoom();
				Mt(this._proxy, this.project(e, t), this.getZoomScale(t, 1));
			},
			_catchTransitionEnd: function(e) {
				this._animatingZoom && e.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
			},
			_nothingToAnimate: function() {
				return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
			},
			_tryAnimatedZoom: function(e, t, n) {
				if (this._animatingZoom) return !0;
				if (n ||= {}, !this._zoomAnimated || n.animate === !1 || this._nothingToAnimate() || Math.abs(t - this._zoom) > this.options.zoomAnimationThreshold) return !1;
				var r = this.getZoomScale(t), i = this._getCenterOffset(e)._divideBy(1 - 1 / r);
				return n.animate !== !0 && !this.getSize().contains(i) ? !1 : (te(function() {
					this._moveStart(!0, n.noMoveStart || !1)._animateZoom(e, t, !0);
				}, this), !0);
			},
			_animateZoom: function(e, t, n, r) {
				this._mapPane && (n && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = t, Tt(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
					center: e,
					zoom: t,
					noUpdate: r
				}), this._tempFireZoomEvent ||= this._zoom !== this._animateToZoom, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(i(this._onZoomTransitionEnd, this), 250));
			},
			_onZoomTransitionEnd: function() {
				this._animatingZoom && (this._mapPane && Et(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
			}
		});
		function pn(e, t) {
			return new fn(e, t);
		}
		var mn = E.extend({
			options: { position: "topright" },
			initialize: function(e) {
				p(this, e);
			},
			getPosition: function() {
				return this.options.position;
			},
			setPosition: function(e) {
				var t = this._map;
				return t && t.removeControl(this), this.options.position = e, t && t.addControl(this), this;
			},
			getContainer: function() {
				return this._container;
			},
			addTo: function(e) {
				this.remove(), this._map = e;
				var t = this._container = this.onAdd(e), n = this.getPosition(), r = e._controlCorners[n];
				return Tt(t, "leaflet-control"), n.indexOf("bottom") === -1 ? r.appendChild(t) : r.insertBefore(t, r.firstChild), this._map.on("unload", this.remove, this), this;
			},
			remove: function() {
				return this._map &&= (xt(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), null), this;
			},
			_refocusOnMap: function(e) {
				this._map && e && e.screenX > 0 && e.screenY > 0 && this._map.getContainer().focus();
			}
		}), hn = function(e) {
			return new mn(e);
		};
		fn.include({
			addControl: function(e) {
				return e.addTo(this), this;
			},
			removeControl: function(e) {
				return e.remove(), this;
			},
			_initControlPos: function() {
				var e = this._controlCorners = {}, t = "leaflet-", n = this._controlContainer = bt("div", t + "control-container", this._container);
				function r(r, i) {
					var a = t + r + " " + t + i;
					e[r + i] = bt("div", a, n);
				}
				r("top", "left"), r("top", "right"), r("bottom", "left"), r("bottom", "right");
			},
			_clearControlPos: function() {
				for (var e in this._controlCorners) xt(this._controlCorners[e]);
				xt(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
			}
		});
		var gn = mn.extend({
			options: {
				collapsed: !0,
				position: "topright",
				autoZIndex: !0,
				hideSingleBase: !1,
				sortLayers: !1,
				sortFunction: function(e, t, n, r) {
					return n < r ? -1 : +(r < n);
				}
			},
			initialize: function(e, t, n) {
				for (var r in p(this, n), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1, e) this._addLayer(e[r], r);
				for (r in t) this._addLayer(t[r], r, !0);
			},
			onAdd: function(e) {
				this._initLayout(), this._update(), this._map = e, e.on("zoomend", this._checkDisabledLayers, this);
				for (var t = 0; t < this._layers.length; t++) this._layers[t].layer.on("add remove", this._onLayerChange, this);
				return this._container;
			},
			addTo: function(e) {
				return mn.prototype.addTo.call(this, e), this._expandIfNotCollapsed();
			},
			onRemove: function() {
				this._map.off("zoomend", this._checkDisabledLayers, this);
				for (var e = 0; e < this._layers.length; e++) this._layers[e].layer.off("add remove", this._onLayerChange, this);
			},
			addBaseLayer: function(e, t) {
				return this._addLayer(e, t), this._map ? this._update() : this;
			},
			addOverlay: function(e, t) {
				return this._addLayer(e, t, !0), this._map ? this._update() : this;
			},
			removeLayer: function(e) {
				e.off("add remove", this._onLayerChange, this);
				var t = this._getLayer(o(e));
				return t && this._layers.splice(this._layers.indexOf(t), 1), this._map ? this._update() : this;
			},
			expand: function() {
				Tt(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
				var e = this._map.getSize().y - (this._container.offsetTop + 50);
				return e < this._section.clientHeight ? (Tt(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = e + "px") : Et(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
			},
			collapse: function() {
				return Et(this._container, "leaflet-control-layers-expanded"), this;
			},
			_initLayout: function() {
				var e = "leaflet-control-layers", t = this._container = bt("div", e), n = this.options.collapsed;
				t.setAttribute("aria-haspopup", !0), tn(t), en(t);
				var r = this._section = bt("section", e + "-list");
				n && (this._map.on("click", this.collapse, this), Jt(t, {
					mouseenter: this._expandSafely,
					mouseleave: this.collapse
				}, this));
				var i = this._layersLink = bt("a", e + "-toggle", t);
				i.href = "#", i.title = "Layers", i.setAttribute("role", "button"), Jt(i, {
					keydown: function(e) {
						e.keyCode === 13 && this._expandSafely();
					},
					click: function(e) {
						nn(e), this._expandSafely();
					}
				}, this), n || this.expand(), this._baseLayersList = bt("div", e + "-base", r), this._separator = bt("div", e + "-separator", r), this._overlaysList = bt("div", e + "-overlays", r), t.appendChild(r);
			},
			_getLayer: function(e) {
				for (var t = 0; t < this._layers.length; t++) if (this._layers[t] && o(this._layers[t].layer) === e) return this._layers[t];
			},
			_addLayer: function(e, t, n) {
				this._map && e.on("add remove", this._onLayerChange, this), this._layers.push({
					layer: e,
					name: t,
					overlay: n
				}), this.options.sortLayers && this._layers.sort(i(function(e, t) {
					return this.options.sortFunction(e.layer, t.layer, e.name, t.name);
				}, this)), this.options.autoZIndex && e.setZIndex && (this._lastZIndex++, e.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
			},
			_update: function() {
				if (!this._container) return this;
				St(this._baseLayersList), St(this._overlaysList), this._layerControlInputs = [];
				var e, t, n, r, i = 0;
				for (n = 0; n < this._layers.length; n++) r = this._layers[n], this._addItem(r), t ||= r.overlay, e ||= !r.overlay, i += +!r.overlay;
				return this.options.hideSingleBase && (e &&= i > 1, this._baseLayersList.style.display = e ? "" : "none"), this._separator.style.display = t && e ? "" : "none", this;
			},
			_onLayerChange: function(e) {
				this._handlingClick || this._update();
				var t = this._getLayer(o(e.target)), n = t.overlay ? e.type === "add" ? "overlayadd" : "overlayremove" : e.type === "add" ? "baselayerchange" : null;
				n && this._map.fire(n, t);
			},
			_createRadioElement: function(e, t) {
				var n = "<input type=\"radio\" class=\"leaflet-control-layers-selector\" name=\"" + e + "\"" + (t ? " checked=\"checked\"" : "") + "/>", r = document.createElement("div");
				return r.innerHTML = n, r.firstChild;
			},
			_addItem: function(e) {
				var t = document.createElement("label"), n = this._map.hasLayer(e.layer), r;
				e.overlay ? (r = document.createElement("input"), r.type = "checkbox", r.className = "leaflet-control-layers-selector", r.defaultChecked = n) : r = this._createRadioElement("leaflet-base-layers_" + o(this), n), this._layerControlInputs.push(r), r.layerId = o(e.layer), Jt(r, "click", this._onInputClick, this);
				var i = document.createElement("span");
				i.innerHTML = " " + e.name;
				var a = document.createElement("span");
				return t.appendChild(a), a.appendChild(r), a.appendChild(i), (e.overlay ? this._overlaysList : this._baseLayersList).appendChild(t), this._checkDisabledLayers(), t;
			},
			_onInputClick: function() {
				if (!this._preventClick) {
					var e = this._layerControlInputs, t, n, r = [], i = [];
					this._handlingClick = !0;
					for (var a = e.length - 1; a >= 0; a--) t = e[a], n = this._getLayer(t.layerId).layer, t.checked ? r.push(n) : t.checked || i.push(n);
					for (a = 0; a < i.length; a++) this._map.hasLayer(i[a]) && this._map.removeLayer(i[a]);
					for (a = 0; a < r.length; a++) this._map.hasLayer(r[a]) || this._map.addLayer(r[a]);
					this._handlingClick = !1, this._refocusOnMap();
				}
			},
			_checkDisabledLayers: function() {
				for (var e = this._layerControlInputs, t, n, r = this._map.getZoom(), i = e.length - 1; i >= 0; i--) t = e[i], n = this._getLayer(t.layerId).layer, t.disabled = n.options.minZoom !== void 0 && r < n.options.minZoom || n.options.maxZoom !== void 0 && r > n.options.maxZoom;
			},
			_expandIfNotCollapsed: function() {
				return this._map && !this.options.collapsed && this.expand(), this;
			},
			_expandSafely: function() {
				var e = this._section;
				this._preventClick = !0, Jt(e, "click", nn), this.expand();
				var t = this;
				setTimeout(function() {
					Xt(e, "click", nn), t._preventClick = !1;
				});
			}
		}), _n = function(e, t, n) {
			return new gn(e, t, n);
		}, G = mn.extend({
			options: {
				position: "topleft",
				zoomInText: "<span aria-hidden=\"true\">+</span>",
				zoomInTitle: "Zoom in",
				zoomOutText: "<span aria-hidden=\"true\">&#x2212;</span>",
				zoomOutTitle: "Zoom out"
			},
			onAdd: function(e) {
				var t = "leaflet-control-zoom", n = bt("div", t + " leaflet-bar"), r = this.options;
				return this._zoomInButton = this._createButton(r.zoomInText, r.zoomInTitle, t + "-in", n, this._zoomIn), this._zoomOutButton = this._createButton(r.zoomOutText, r.zoomOutTitle, t + "-out", n, this._zoomOut), this._updateDisabled(), e.on("zoomend zoomlevelschange", this._updateDisabled, this), n;
			},
			onRemove: function(e) {
				e.off("zoomend zoomlevelschange", this._updateDisabled, this);
			},
			disable: function() {
				return this._disabled = !0, this._updateDisabled(), this;
			},
			enable: function() {
				return this._disabled = !1, this._updateDisabled(), this;
			},
			_zoomIn: function(e) {
				!this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
			},
			_zoomOut: function(e) {
				!this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
			},
			_createButton: function(e, t, n, r, i) {
				var a = bt("a", n, r);
				return a.innerHTML = e, a.href = "#", a.title = t, a.setAttribute("role", "button"), a.setAttribute("aria-label", t), tn(a), Jt(a, "click", rn), Jt(a, "click", i, this), Jt(a, "click", this._refocusOnMap, this), a;
			},
			_updateDisabled: function() {
				var e = this._map, t = "leaflet-disabled";
				Et(this._zoomInButton, t), Et(this._zoomOutButton, t), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || e._zoom === e.getMinZoom()) && (Tt(this._zoomOutButton, t), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || e._zoom === e.getMaxZoom()) && (Tt(this._zoomInButton, t), this._zoomInButton.setAttribute("aria-disabled", "true"));
			}
		});
		fn.mergeOptions({ zoomControl: !0 }), fn.addInitHook(function() {
			this.options.zoomControl && (this.zoomControl = new G(), this.addControl(this.zoomControl));
		});
		var vn = function(e) {
			return new G(e);
		}, K = mn.extend({
			options: {
				position: "bottomleft",
				maxWidth: 100,
				metric: !0,
				imperial: !0
			},
			onAdd: function(e) {
				var t = "leaflet-control-scale", n = bt("div", t), r = this.options;
				return this._addScales(r, t + "-line", n), e.on(r.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), n;
			},
			onRemove: function(e) {
				e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
			},
			_addScales: function(e, t, n) {
				e.metric && (this._mScale = bt("div", t, n)), e.imperial && (this._iScale = bt("div", t, n));
			},
			_update: function() {
				var e = this._map, t = e.getSize().y / 2, n = e.distance(e.containerPointToLatLng([0, t]), e.containerPointToLatLng([this.options.maxWidth, t]));
				this._updateScales(n);
			},
			_updateScales: function(e) {
				this.options.metric && e && this._updateMetric(e), this.options.imperial && e && this._updateImperial(e);
			},
			_updateMetric: function(e) {
				var t = this._getRoundNum(e), n = t < 1e3 ? t + " m" : t / 1e3 + " km";
				this._updateScale(this._mScale, n, t / e);
			},
			_updateImperial: function(e) {
				var t = e * 3.2808399, n, r, i;
				t > 5280 ? (n = t / 5280, r = this._getRoundNum(n), this._updateScale(this._iScale, r + " mi", r / n)) : (i = this._getRoundNum(t), this._updateScale(this._iScale, i + " ft", i / t));
			},
			_updateScale: function(e, t, n) {
				e.style.width = Math.round(this.options.maxWidth * n) + "px", e.innerHTML = t;
			},
			_getRoundNum: function(e) {
				var t = 10 ** ((Math.floor(e) + "").length - 1), n = e / t;
				return n = n >= 10 ? 10 : n >= 5 ? 5 : n >= 3 ? 3 : n >= 2 ? 2 : 1, t * n;
			}
		}), q = function(e) {
			return new K(e);
		}, yn = mn.extend({
			options: {
				position: "bottomright",
				prefix: "<a href=\"https://leafletjs.com\" title=\"A JavaScript library for interactive maps\">" + (V.inlineSvg ? "<svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"8\" viewBox=\"0 0 12 8\" class=\"leaflet-attribution-flag\"><path fill=\"#4C7BE1\" d=\"M0 0h12v4H0z\"/><path fill=\"#FFD500\" d=\"M0 4h12v3H0z\"/><path fill=\"#E0BC00\" d=\"M0 7h12v1H0z\"/></svg> " : "") + "Leaflet</a>"
			},
			initialize: function(e) {
				p(this, e), this._attributions = {};
			},
			onAdd: function(e) {
				for (var t in e.attributionControl = this, this._container = bt("div", "leaflet-control-attribution"), tn(this._container), e._layers) e._layers[t].getAttribution && this.addAttribution(e._layers[t].getAttribution());
				return this._update(), e.on("layeradd", this._addAttribution, this), this._container;
			},
			onRemove: function(e) {
				e.off("layeradd", this._addAttribution, this);
			},
			_addAttribution: function(e) {
				e.layer.getAttribution && (this.addAttribution(e.layer.getAttribution()), e.layer.once("remove", function() {
					this.removeAttribution(e.layer.getAttribution());
				}, this));
			},
			setPrefix: function(e) {
				return this.options.prefix = e, this._update(), this;
			},
			addAttribution: function(e) {
				return e && (this._attributions[e] || (this._attributions[e] = 0), this._attributions[e]++, this._update()), this;
			},
			removeAttribution: function(e) {
				return e && this._attributions[e] && (this._attributions[e]--, this._update()), this;
			},
			_update: function() {
				if (this._map) {
					var e = [];
					for (var t in this._attributions) this._attributions[t] && e.push(t);
					var n = [];
					this.options.prefix && n.push(this.options.prefix), e.length && n.push(e.join(", ")), this._container.innerHTML = n.join(" <span aria-hidden=\"true\">|</span> ");
				}
			}
		});
		fn.mergeOptions({ attributionControl: !0 }), fn.addInitHook(function() {
			this.options.attributionControl && new yn().addTo(this);
		}), mn.Layers = gn, mn.Zoom = G, mn.Scale = K, mn.Attribution = yn, hn.layers = _n, hn.zoom = vn, hn.scale = q, hn.attribution = function(e) {
			return new yn(e);
		};
		var bn = E.extend({
			initialize: function(e) {
				this._map = e;
			},
			enable: function() {
				return this._enabled || (this._enabled = !0, this.addHooks()), this;
			},
			disable: function() {
				return this._enabled && (this._enabled = !1, this.removeHooks()), this;
			},
			enabled: function() {
				return !!this._enabled;
			}
		});
		bn.addTo = function(e, t) {
			return e.addHandler(t, this), this;
		};
		var xn = { Events: ne }, Sn = V.touch ? "touchstart mousedown" : "mousedown", Cn = O.extend({
			options: { clickTolerance: 3 },
			initialize: function(e, t, n, r) {
				p(this, r), this._element = e, this._dragStartTarget = t || e, this._preventOutline = n;
			},
			enable: function() {
				this._enabled ||= (Jt(this._dragStartTarget, Sn, this._onDown, this), !0);
			},
			disable: function() {
				this._enabled && (Cn._dragging === this && this.finishDrag(!0), Xt(this._dragStartTarget, Sn, this._onDown, this), this._enabled = !1, this._moved = !1);
			},
			_onDown: function(e) {
				if (this._enabled && (this._moved = !1, !wt(this._element, "leaflet-zoom-anim"))) {
					if (e.touches && e.touches.length !== 1) Cn._dragging === this && this.finishDrag();
					else if (!(Cn._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) && (Cn._dragging = this, this._preventOutline && Ut(this._element), zt(), Ft(), !this._moving)) {
						this.fire("down");
						var t = e.touches ? e.touches[0] : e, n = Gt(this._element);
						this._startPoint = new k(t.clientX, t.clientY), this._startPos = Pt(this._element), this._parentScale = Kt(n);
						var r = e.type === "mousedown";
						Jt(document, r ? "mousemove" : "touchmove", this._onMove, this), Jt(document, r ? "mouseup" : "touchend touchcancel", this._onUp, this);
					}
				}
			},
			_onMove: function(e) {
				if (this._enabled) {
					if (e.touches && e.touches.length > 1) this._moved = !0;
					else {
						var t = e.touches && e.touches.length === 1 ? e.touches[0] : e, n = new k(t.clientX, t.clientY)._subtract(this._startPoint);
						(n.x || n.y) && (Math.abs(n.x) + Math.abs(n.y) < this.options.clickTolerance || (n.x /= this._parentScale.x, n.y /= this._parentScale.y, nn(e), this._moved || (this.fire("dragstart"), this._moved = !0, Tt(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), Tt(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(n), this._moving = !0, this._lastEvent = e, this._updatePosition()));
					}
				}
			},
			_updatePosition: function() {
				var e = { originalEvent: this._lastEvent };
				this.fire("predrag", e), Nt(this._element, this._newPos), this.fire("drag", e);
			},
			_onUp: function() {
				this._enabled && this.finishDrag();
			},
			finishDrag: function(e) {
				Et(document.body, "leaflet-dragging"), this._lastTarget &&= (Et(this._lastTarget, "leaflet-drag-target"), null), Xt(document, "mousemove touchmove", this._onMove, this), Xt(document, "mouseup touchend touchcancel", this._onUp, this), Bt(), It();
				var t = this._moved && this._moving;
				this._moving = !1, Cn._dragging = !1, t && this.fire("dragend", {
					noInertia: e,
					distance: this._newPos.distanceTo(this._startPos)
				});
			}
		});
		function wn(e, t, n) {
			for (var r, i = [
				1,
				4,
				2,
				8
			], a = 0, o, s, c, l, u = e.length, d, f; a < u; a++) e[a]._code = In(e[a], t);
			for (s = 0; s < 4; s++) {
				for (d = i[s], r = [], a = 0, u = e.length, o = u - 1; a < u; o = a++) c = e[a], l = e[o], c._code & d ? l._code & d || (f = J(l, c, d, t, n), f._code = In(f, t), r.push(f)) : (l._code & d && (f = J(l, c, d, t, n), f._code = In(f, t), r.push(f)), r.push(c));
				e = r;
			}
			return e;
		}
		function Tn(e, t) {
			var n, r, i, a, o, s, c, l, u;
			if (!e || e.length === 0) throw Error("latlngs not passed");
			zn(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
			var d = F([0, 0]), f = N(e);
			f.getNorthWest().distanceTo(f.getSouthWest()) * f.getNorthEast().distanceTo(f.getNorthWest()) < 1700 && (d = En(e));
			var p = e.length, m = [];
			for (n = 0; n < p; n++) {
				var h = F(e[n]);
				m.push(t.project(F([h.lat - d.lat, h.lng - d.lng])));
			}
			for (s = c = l = 0, n = 0, r = p - 1; n < p; r = n++) i = m[n], a = m[r], o = i.y * a.x - a.y * i.x, c += (i.x + a.x) * o, l += (i.y + a.y) * o, s += o * 3;
			u = s === 0 ? m[0] : [c / s, l / s];
			var g = t.unproject(A(u));
			return F([g.lat + d.lat, g.lng + d.lng]);
		}
		function En(e) {
			for (var t = 0, n = 0, r = 0, i = 0; i < e.length; i++) {
				var a = F(e[i]);
				t += a.lat, n += a.lng, r++;
			}
			return F([t / r, n / r]);
		}
		var Dn = {
			__proto__: null,
			clipPolygon: wn,
			polygonCenter: Tn,
			centroid: En
		};
		function On(e, t) {
			if (!t || !e.length) return e.slice();
			var n = t * t;
			return e = Nn(e, n), e = jn(e, n), e;
		}
		function kn(e, t, n) {
			return Math.sqrt(Rn(e, t, n, !0));
		}
		function An(e, t, n) {
			return Rn(e, t, n);
		}
		function jn(e, t) {
			var n = e.length, r = new (typeof Uint8Array < "u" ? Uint8Array : Array)(n);
			r[0] = r[n - 1] = 1, Mn(e, r, t, 0, n - 1);
			var i, a = [];
			for (i = 0; i < n; i++) r[i] && a.push(e[i]);
			return a;
		}
		function Mn(e, t, n, r, i) {
			for (var a = 0, o, s = r + 1, c; s <= i - 1; s++) c = Rn(e[s], e[r], e[i], !0), c > a && (o = s, a = c);
			a > n && (t[o] = 1, Mn(e, t, n, r, o), Mn(e, t, n, o, i));
		}
		function Nn(e, t) {
			for (var n = [e[0]], r = 1, i = 0, a = e.length; r < a; r++) Ln(e[r], e[i]) > t && (n.push(e[r]), i = r);
			return i < a - 1 && n.push(e[a - 1]), n;
		}
		var Pn;
		function Fn(e, t, n, r, i) {
			var a = r ? Pn : In(e, n), o = In(t, n), s, c, l;
			for (Pn = o;;) {
				if (!(a | o)) return [e, t];
				if (a & o) return !1;
				s = a || o, c = J(e, t, s, n, i), l = In(c, n), s === a ? (e = c, a = l) : (t = c, o = l);
			}
		}
		function J(e, t, n, r, i) {
			var a = t.x - e.x, o = t.y - e.y, s = r.min, c = r.max, l, u;
			return n & 8 ? (l = e.x + a * (c.y - e.y) / o, u = c.y) : n & 4 ? (l = e.x + a * (s.y - e.y) / o, u = s.y) : n & 2 ? (l = c.x, u = e.y + o * (c.x - e.x) / a) : n & 1 && (l = s.x, u = e.y + o * (s.x - e.x) / a), new k(l, u, i);
		}
		function In(e, t) {
			var n = 0;
			return e.x < t.min.x ? n |= 1 : e.x > t.max.x && (n |= 2), e.y < t.min.y ? n |= 4 : e.y > t.max.y && (n |= 8), n;
		}
		function Ln(e, t) {
			var n = t.x - e.x, r = t.y - e.y;
			return n * n + r * r;
		}
		function Rn(e, t, n, r) {
			var i = t.x, a = t.y, o = n.x - i, s = n.y - a, c = o * o + s * s, l;
			return c > 0 && (l = ((e.x - i) * o + (e.y - a) * s) / c, l > 1 ? (i = n.x, a = n.y) : l > 0 && (i += o * l, a += s * l)), o = e.x - i, s = e.y - a, r ? o * o + s * s : new k(i, a);
		}
		function zn(e) {
			return !_(e[0]) || typeof e[0][0] != "object" && e[0][0] !== void 0;
		}
		function Bn(e) {
			return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), zn(e);
		}
		function Vn(e, t) {
			var n, r, i, a, o, s, c, l;
			if (!e || e.length === 0) throw Error("latlngs not passed");
			zn(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
			var u = F([0, 0]), d = N(e);
			d.getNorthWest().distanceTo(d.getSouthWest()) * d.getNorthEast().distanceTo(d.getNorthWest()) < 1700 && (u = En(e));
			var f = e.length, p = [];
			for (n = 0; n < f; n++) {
				var m = F(e[n]);
				p.push(t.project(F([m.lat - u.lat, m.lng - u.lng])));
			}
			for (n = 0, r = 0; n < f - 1; n++) r += p[n].distanceTo(p[n + 1]) / 2;
			if (r === 0) l = p[0];
			else for (n = 0, a = 0; n < f - 1; n++) if (o = p[n], s = p[n + 1], i = o.distanceTo(s), a += i, a > r) {
				c = (a - r) / i, l = [s.x - c * (s.x - o.x), s.y - c * (s.y - o.y)];
				break;
			}
			var h = t.unproject(A(l));
			return F([h.lat + u.lat, h.lng + u.lng]);
		}
		var Hn = {
			__proto__: null,
			simplify: On,
			pointToSegmentDistance: kn,
			closestPointOnSegment: An,
			clipSegment: Fn,
			_getEdgeIntersection: J,
			_getBitCode: In,
			_sqClosestPointOnSegment: Rn,
			isFlat: zn,
			_flat: Bn,
			polylineCenter: Vn
		}, Un = {
			project: function(e) {
				return new k(e.lng, e.lat);
			},
			unproject: function(e) {
				return new P(e.y, e.x);
			},
			bounds: new j([-180, -90], [180, 90])
		}, Wn = {
			R: 6378137,
			R_MINOR: 6356752.314245179,
			bounds: new j([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),
			project: function(e) {
				var t = Math.PI / 180, n = this.R, r = e.lat * t, i = this.R_MINOR / n, a = Math.sqrt(1 - i * i), o = a * Math.sin(r), s = Math.tan(Math.PI / 4 - r / 2) / ((1 - o) / (1 + o)) ** (a / 2);
				return r = -n * Math.log(Math.max(s, 1e-10)), new k(e.lng * t * n, r);
			},
			unproject: function(e) {
				for (var t = 180 / Math.PI, n = this.R, r = this.R_MINOR / n, i = Math.sqrt(1 - r * r), a = Math.exp(-e.y / n), o = Math.PI / 2 - 2 * Math.atan(a), s = 0, c = .1, l; s < 15 && Math.abs(c) > 1e-7; s++) l = i * Math.sin(o), l = ((1 - l) / (1 + l)) ** (i / 2), c = Math.PI / 2 - 2 * Math.atan(a * l) - o, o += c;
				return new P(o * t, e.x * t / n);
			}
		}, Gn = {
			__proto__: null,
			LonLat: Un,
			Mercator: Wn,
			SphericalMercator: ce
		}, Kn = n({}, oe, {
			code: "EPSG:3395",
			projection: Wn,
			transformation: function() {
				var e = .5 / (Math.PI * Wn.R);
				return ue(e, .5, -e, .5);
			}()
		}), qn = n({}, oe, {
			code: "EPSG:4326",
			projection: Un,
			transformation: ue(1 / 180, 1, -1 / 180, .5)
		}), Jn = n({}, ae, {
			projection: Un,
			transformation: ue(1, 0, -1, 0),
			scale: function(e) {
				return 2 ** e;
			},
			zoom: function(e) {
				return Math.log(e) / Math.LN2;
			},
			distance: function(e, t) {
				var n = t.lng - e.lng, r = t.lat - e.lat;
				return Math.sqrt(n * n + r * r);
			},
			infinite: !0
		});
		ae.Earth = oe, ae.EPSG3395 = Kn, ae.EPSG3857 = de, ae.EPSG900913 = fe, ae.EPSG4326 = qn, ae.Simple = Jn;
		var Yn = O.extend({
			options: {
				pane: "overlayPane",
				attribution: null,
				bubblingMouseEvents: !0
			},
			addTo: function(e) {
				return e.addLayer(this), this;
			},
			remove: function() {
				return this.removeFrom(this._map || this._mapToAdd);
			},
			removeFrom: function(e) {
				return e && e.removeLayer(this), this;
			},
			getPane: function(e) {
				return this._map.getPane(e ? this.options[e] || e : this.options.pane);
			},
			addInteractiveTarget: function(e) {
				return this._map._targets[o(e)] = this, this;
			},
			removeInteractiveTarget: function(e) {
				return delete this._map._targets[o(e)], this;
			},
			getAttribution: function() {
				return this.options.attribution;
			},
			_layerAdd: function(e) {
				var t = e.target;
				if (t.hasLayer(this)) {
					if (this._map = t, this._zoomAnimated = t._zoomAnimated, this.getEvents) {
						var n = this.getEvents();
						t.on(n, this), this.once("remove", function() {
							t.off(n, this);
						}, this);
					}
					this.onAdd(t), this.fire("add"), t.fire("layeradd", { layer: this });
				}
			}
		});
		fn.include({
			addLayer: function(e) {
				if (!e._layerAdd) throw Error("The provided object is not a Layer.");
				var t = o(e);
				return this._layers[t] || (this._layers[t] = e, e._mapToAdd = this, e.beforeAdd && e.beforeAdd(this), this.whenReady(e._layerAdd, e)), this;
			},
			removeLayer: function(e) {
				var t = o(e);
				return this._layers[t] && (this._loaded && e.onRemove(this), delete this._layers[t], this._loaded && (this.fire("layerremove", { layer: e }), e.fire("remove")), e._map = e._mapToAdd = null), this;
			},
			hasLayer: function(e) {
				return o(e) in this._layers;
			},
			eachLayer: function(e, t) {
				for (var n in this._layers) e.call(t, this._layers[n]);
				return this;
			},
			_addLayers: function(e) {
				e = e ? _(e) ? e : [e] : [];
				for (var t = 0, n = e.length; t < n; t++) this.addLayer(e[t]);
			},
			_addZoomLimit: function(e) {
				isNaN(e.options.maxZoom) && isNaN(e.options.minZoom) || (this._zoomBoundLayers[o(e)] = e, this._updateZoomLevels());
			},
			_removeZoomLimit: function(e) {
				var t = o(e);
				this._zoomBoundLayers[t] && (delete this._zoomBoundLayers[t], this._updateZoomLevels());
			},
			_updateZoomLevels: function() {
				var e = Infinity, t = -Infinity, n = this._getZoomSpan();
				for (var r in this._zoomBoundLayers) {
					var i = this._zoomBoundLayers[r].options;
					e = i.minZoom === void 0 ? e : Math.min(e, i.minZoom), t = i.maxZoom === void 0 ? t : Math.max(t, i.maxZoom);
				}
				this._layersMaxZoom = t === -Infinity ? void 0 : t, this._layersMinZoom = e === Infinity ? void 0 : e, n !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
			}
		});
		var Xn = Yn.extend({
			initialize: function(e, t) {
				p(this, t), this._layers = {};
				var n, r;
				if (e) for (n = 0, r = e.length; n < r; n++) this.addLayer(e[n]);
			},
			addLayer: function(e) {
				var t = this.getLayerId(e);
				return this._layers[t] = e, this._map && this._map.addLayer(e), this;
			},
			removeLayer: function(e) {
				var t = e in this._layers ? e : this.getLayerId(e);
				return this._map && this._layers[t] && this._map.removeLayer(this._layers[t]), delete this._layers[t], this;
			},
			hasLayer: function(e) {
				return (typeof e == "number" ? e : this.getLayerId(e)) in this._layers;
			},
			clearLayers: function() {
				return this.eachLayer(this.removeLayer, this);
			},
			invoke: function(e) {
				var t = Array.prototype.slice.call(arguments, 1), n, r;
				for (n in this._layers) r = this._layers[n], r[e] && r[e].apply(r, t);
				return this;
			},
			onAdd: function(e) {
				this.eachLayer(e.addLayer, e);
			},
			onRemove: function(e) {
				this.eachLayer(e.removeLayer, e);
			},
			eachLayer: function(e, t) {
				for (var n in this._layers) e.call(t, this._layers[n]);
				return this;
			},
			getLayer: function(e) {
				return this._layers[e];
			},
			getLayers: function() {
				var e = [];
				return this.eachLayer(e.push, e), e;
			},
			setZIndex: function(e) {
				return this.invoke("setZIndex", e);
			},
			getLayerId: function(e) {
				return o(e);
			}
		}), Zn = function(e, t) {
			return new Xn(e, t);
		}, Qn = Xn.extend({
			addLayer: function(e) {
				return this.hasLayer(e) ? this : (e.addEventParent(this), Xn.prototype.addLayer.call(this, e), this.fire("layeradd", { layer: e }));
			},
			removeLayer: function(e) {
				return this.hasLayer(e) ? (e in this._layers && (e = this._layers[e]), e.removeEventParent(this), Xn.prototype.removeLayer.call(this, e), this.fire("layerremove", { layer: e })) : this;
			},
			setStyle: function(e) {
				return this.invoke("setStyle", e);
			},
			bringToFront: function() {
				return this.invoke("bringToFront");
			},
			bringToBack: function() {
				return this.invoke("bringToBack");
			},
			getBounds: function() {
				var e = new M();
				for (var t in this._layers) {
					var n = this._layers[t];
					e.extend(n.getBounds ? n.getBounds() : n.getLatLng());
				}
				return e;
			}
		}), $n = function(e, t) {
			return new Qn(e, t);
		}, er = E.extend({
			options: {
				popupAnchor: [0, 0],
				tooltipAnchor: [0, 0],
				crossOrigin: !1
			},
			initialize: function(e) {
				p(this, e);
			},
			createIcon: function(e) {
				return this._createIcon("icon", e);
			},
			createShadow: function(e) {
				return this._createIcon("shadow", e);
			},
			_createIcon: function(e, t) {
				var n = this._getIconUrl(e);
				if (!n) {
					if (e === "icon") throw Error("iconUrl not set in Icon options (see the docs).");
					return null;
				}
				var r = this._createImg(n, t && t.tagName === "IMG" ? t : null);
				return this._setIconStyles(r, e), (this.options.crossOrigin || this.options.crossOrigin === "") && (r.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), r;
			},
			_setIconStyles: function(e, t) {
				var n = this.options, r = n[t + "Size"];
				typeof r == "number" && (r = [r, r]);
				var i = A(r), a = A(t === "shadow" && n.shadowAnchor || n.iconAnchor || i && i.divideBy(2, !0));
				e.className = "leaflet-marker-" + t + " " + (n.className || ""), a && (e.style.marginLeft = -a.x + "px", e.style.marginTop = -a.y + "px"), i && (e.style.width = i.x + "px", e.style.height = i.y + "px");
			},
			_createImg: function(e, t) {
				return t ||= document.createElement("img"), t.src = e, t;
			},
			_getIconUrl: function(e) {
				return V.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"];
			}
		});
		function tr(e) {
			return new er(e);
		}
		var nr = er.extend({
			options: {
				iconUrl: "marker-icon.png",
				iconRetinaUrl: "marker-icon-2x.png",
				shadowUrl: "marker-shadow.png",
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				tooltipAnchor: [16, -28],
				shadowSize: [41, 41]
			},
			_getIconUrl: function(e) {
				return typeof nr.imagePath != "string" && (nr.imagePath = this._detectIconPath()), (this.options.imagePath || nr.imagePath) + er.prototype._getIconUrl.call(this, e);
			},
			_stripUrl: function(e) {
				var t = function(e, t, n) {
					var r = t.exec(e);
					return r && r[n];
				};
				return e = t(e, /^url\((['"])?(.+)\1\)$/, 2), e && t(e, /^(.*)marker-icon\.png$/, 1);
			},
			_detectIconPath: function() {
				var e = bt("div", "leaflet-default-icon-path", document.body), t = yt(e, "background-image") || yt(e, "backgroundImage");
				if (document.body.removeChild(e), t = this._stripUrl(t), t) return t;
				var n = document.querySelector("link[href$=\"leaflet.css\"]");
				return n ? n.href.substring(0, n.href.length - 11 - 1) : "";
			}
		}), rr = bn.extend({
			initialize: function(e) {
				this._marker = e;
			},
			addHooks: function() {
				var e = this._marker._icon;
				this._draggable ||= new Cn(e, e, !0), this._draggable.on({
					dragstart: this._onDragStart,
					predrag: this._onPreDrag,
					drag: this._onDrag,
					dragend: this._onDragEnd
				}, this).enable(), Tt(e, "leaflet-marker-draggable");
			},
			removeHooks: function() {
				this._draggable.off({
					dragstart: this._onDragStart,
					predrag: this._onPreDrag,
					drag: this._onDrag,
					dragend: this._onDragEnd
				}, this).disable(), this._marker._icon && Et(this._marker._icon, "leaflet-marker-draggable");
			},
			moved: function() {
				return this._draggable && this._draggable._moved;
			},
			_adjustPan: function(e) {
				var t = this._marker, n = t._map, r = this._marker.options.autoPanSpeed, i = this._marker.options.autoPanPadding, a = Pt(t._icon), o = n.getPixelBounds(), s = n.getPixelOrigin(), c = ie(o.min._subtract(s).add(i), o.max._subtract(s).subtract(i));
				if (!c.contains(a)) {
					var l = A((Math.max(c.max.x, a.x) - c.max.x) / (o.max.x - c.max.x) - (Math.min(c.min.x, a.x) - c.min.x) / (o.min.x - c.min.x), (Math.max(c.max.y, a.y) - c.max.y) / (o.max.y - c.max.y) - (Math.min(c.min.y, a.y) - c.min.y) / (o.min.y - c.min.y)).multiplyBy(r);
					n.panBy(l, { animate: !1 }), this._draggable._newPos._add(l), this._draggable._startPos._add(l), Nt(t._icon, this._draggable._newPos), this._onDrag(e), this._panRequest = te(this._adjustPan.bind(this, e));
				}
			},
			_onDragStart: function() {
				this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
			},
			_onPreDrag: function(e) {
				this._marker.options.autoPan && (w(this._panRequest), this._panRequest = te(this._adjustPan.bind(this, e)));
			},
			_onDrag: function(e) {
				var t = this._marker, n = t._shadow, r = Pt(t._icon), i = t._map.layerPointToLatLng(r);
				n && Nt(n, r), t._latlng = i, e.latlng = i, e.oldLatLng = this._oldLatLng, t.fire("move", e).fire("drag", e);
			},
			_onDragEnd: function(e) {
				w(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", e);
			}
		}), ir = Yn.extend({
			options: {
				icon: new nr(),
				interactive: !0,
				keyboard: !0,
				title: "",
				alt: "Marker",
				zIndexOffset: 0,
				opacity: 1,
				riseOnHover: !1,
				riseOffset: 250,
				pane: "markerPane",
				shadowPane: "shadowPane",
				bubblingMouseEvents: !1,
				autoPanOnFocus: !0,
				draggable: !1,
				autoPan: !1,
				autoPanPadding: [50, 50],
				autoPanSpeed: 10
			},
			initialize: function(e, t) {
				p(this, t), this._latlng = F(e);
			},
			onAdd: function(e) {
				this._zoomAnimated = this._zoomAnimated && e.options.markerZoomAnimation, this._zoomAnimated && e.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
			},
			onRemove: function(e) {
				this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && e.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
			},
			getEvents: function() {
				return {
					zoom: this.update,
					viewreset: this.update
				};
			},
			getLatLng: function() {
				return this._latlng;
			},
			setLatLng: function(e) {
				var t = this._latlng;
				return this._latlng = F(e), this.update(), this.fire("move", {
					oldLatLng: t,
					latlng: this._latlng
				});
			},
			setZIndexOffset: function(e) {
				return this.options.zIndexOffset = e, this.update();
			},
			getIcon: function() {
				return this.options.icon;
			},
			setIcon: function(e) {
				return this.options.icon = e, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
			},
			getElement: function() {
				return this._icon;
			},
			update: function() {
				if (this._icon && this._map) {
					var e = this._map.latLngToLayerPoint(this._latlng).round();
					this._setPos(e);
				}
				return this;
			},
			_initIcon: function() {
				var e = this.options, t = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), n = e.icon.createIcon(this._icon), r = !1;
				n !== this._icon && (this._icon && this._removeIcon(), r = !0, e.title && (n.title = e.title), n.tagName === "IMG" && (n.alt = e.alt || "")), Tt(n, t), e.keyboard && (n.tabIndex = "0", n.setAttribute("role", "button")), this._icon = n, e.riseOnHover && this.on({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				}), this.options.autoPanOnFocus && Jt(n, "focus", this._panOnFocus, this);
				var i = e.icon.createShadow(this._shadow), a = !1;
				i !== this._shadow && (this._removeShadow(), a = !0), i && (Tt(i, t), i.alt = ""), this._shadow = i, e.opacity < 1 && this._updateOpacity(), r && this.getPane().appendChild(this._icon), this._initInteraction(), i && a && this.getPane(e.shadowPane).appendChild(this._shadow);
			},
			_removeIcon: function() {
				this.options.riseOnHover && this.off({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				}), this.options.autoPanOnFocus && Xt(this._icon, "focus", this._panOnFocus, this), xt(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
			},
			_removeShadow: function() {
				this._shadow && xt(this._shadow), this._shadow = null;
			},
			_setPos: function(e) {
				this._icon && Nt(this._icon, e), this._shadow && Nt(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex();
			},
			_updateZIndex: function(e) {
				this._icon && (this._icon.style.zIndex = this._zIndex + e);
			},
			_animateZoom: function(e) {
				var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
				this._setPos(t);
			},
			_initInteraction: function() {
				if (this.options.interactive && (Tt(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), rr)) {
					var e = this.options.draggable;
					this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new rr(this), e && this.dragging.enable();
				}
			},
			setOpacity: function(e) {
				return this.options.opacity = e, this._map && this._updateOpacity(), this;
			},
			_updateOpacity: function() {
				var e = this.options.opacity;
				this._icon && kt(this._icon, e), this._shadow && kt(this._shadow, e);
			},
			_bringToFront: function() {
				this._updateZIndex(this.options.riseOffset);
			},
			_resetZIndex: function() {
				this._updateZIndex(0);
			},
			_panOnFocus: function() {
				var e = this._map;
				if (e) {
					var t = this.options.icon.options, n = t.iconSize ? A(t.iconSize) : A(0, 0), r = t.iconAnchor ? A(t.iconAnchor) : A(0, 0);
					e.panInside(this._latlng, {
						paddingTopLeft: r,
						paddingBottomRight: n.subtract(r)
					});
				}
			},
			_getPopupAnchor: function() {
				return this.options.icon.options.popupAnchor;
			},
			_getTooltipAnchor: function() {
				return this.options.icon.options.tooltipAnchor;
			}
		});
		function ar(e, t) {
			return new ir(e, t);
		}
		var or = Yn.extend({
			options: {
				stroke: !0,
				color: "#3388ff",
				weight: 3,
				opacity: 1,
				lineCap: "round",
				lineJoin: "round",
				dashArray: null,
				dashOffset: null,
				fill: !1,
				fillColor: null,
				fillOpacity: .2,
				fillRule: "evenodd",
				interactive: !0,
				bubblingMouseEvents: !0
			},
			beforeAdd: function(e) {
				this._renderer = e.getRenderer(this);
			},
			onAdd: function() {
				this._renderer._initPath(this), this._reset(), this._renderer._addPath(this);
			},
			onRemove: function() {
				this._renderer._removePath(this);
			},
			redraw: function() {
				return this._map && this._renderer._updatePath(this), this;
			},
			setStyle: function(e) {
				return p(this, e), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && e && Object.prototype.hasOwnProperty.call(e, "weight") && this._updateBounds()), this;
			},
			bringToFront: function() {
				return this._renderer && this._renderer._bringToFront(this), this;
			},
			bringToBack: function() {
				return this._renderer && this._renderer._bringToBack(this), this;
			},
			getElement: function() {
				return this._path;
			},
			_reset: function() {
				this._project(), this._update();
			},
			_clickTolerance: function() {
				return (this.options.stroke ? this.options.weight / 2 : 0) + (this._renderer.options.tolerance || 0);
			}
		}), sr = or.extend({
			options: {
				fill: !0,
				radius: 10
			},
			initialize: function(e, t) {
				p(this, t), this._latlng = F(e), this._radius = this.options.radius;
			},
			setLatLng: function(e) {
				var t = this._latlng;
				return this._latlng = F(e), this.redraw(), this.fire("move", {
					oldLatLng: t,
					latlng: this._latlng
				});
			},
			getLatLng: function() {
				return this._latlng;
			},
			setRadius: function(e) {
				return this.options.radius = this._radius = e, this.redraw();
			},
			getRadius: function() {
				return this._radius;
			},
			setStyle: function(e) {
				var t = e && e.radius || this._radius;
				return or.prototype.setStyle.call(this, e), this.setRadius(t), this;
			},
			_project: function() {
				this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
			},
			_updateBounds: function() {
				var e = this._radius, t = this._radiusY || e, n = this._clickTolerance(), r = [e + n, t + n];
				this._pxBounds = new j(this._point.subtract(r), this._point.add(r));
			},
			_update: function() {
				this._map && this._updatePath();
			},
			_updatePath: function() {
				this._renderer._updateCircle(this);
			},
			_empty: function() {
				return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
			},
			_containsPoint: function(e) {
				return e.distanceTo(this._point) <= this._radius + this._clickTolerance();
			}
		});
		function cr(e, t) {
			return new sr(e, t);
		}
		var lr = sr.extend({
			initialize: function(e, t, r) {
				if (typeof t == "number" && (t = n({}, r, { radius: t })), p(this, t), this._latlng = F(e), isNaN(this.options.radius)) throw Error("Circle radius cannot be NaN");
				this._mRadius = this.options.radius;
			},
			setRadius: function(e) {
				return this._mRadius = e, this.redraw();
			},
			getRadius: function() {
				return this._mRadius;
			},
			getBounds: function() {
				var e = [this._radius, this._radiusY || this._radius];
				return new M(this._map.layerPointToLatLng(this._point.subtract(e)), this._map.layerPointToLatLng(this._point.add(e)));
			},
			setStyle: or.prototype.setStyle,
			_project: function() {
				var e = this._latlng.lng, t = this._latlng.lat, n = this._map, r = n.options.crs;
				if (r.distance === oe.distance) {
					var i = Math.PI / 180, a = this._mRadius / oe.R / i, o = n.project([t + a, e]), s = n.project([t - a, e]), c = o.add(s).divideBy(2), l = n.unproject(c).lat, u = Math.acos((Math.cos(a * i) - Math.sin(t * i) * Math.sin(l * i)) / (Math.cos(t * i) * Math.cos(l * i))) / i;
					(isNaN(u) || u === 0) && (u = a / Math.cos(Math.PI / 180 * t)), this._point = c.subtract(n.getPixelOrigin()), this._radius = isNaN(u) ? 0 : c.x - n.project([l, e - u]).x, this._radiusY = c.y - o.y;
				} else {
					var d = r.unproject(r.project(this._latlng).subtract([this._mRadius, 0]));
					this._point = n.latLngToLayerPoint(this._latlng), this._radius = this._point.x - n.latLngToLayerPoint(d).x;
				}
				this._updateBounds();
			}
		});
		function ur(e, t, n) {
			return new lr(e, t, n);
		}
		var dr = or.extend({
			options: {
				smoothFactor: 1,
				noClip: !1
			},
			initialize: function(e, t) {
				p(this, t), this._setLatLngs(e);
			},
			getLatLngs: function() {
				return this._latlngs;
			},
			setLatLngs: function(e) {
				return this._setLatLngs(e), this.redraw();
			},
			isEmpty: function() {
				return !this._latlngs.length;
			},
			closestLayerPoint: function(e) {
				for (var t = Infinity, n = null, r = Rn, i, a, o = 0, s = this._parts.length; o < s; o++) for (var c = this._parts[o], l = 1, u = c.length; l < u; l++) {
					i = c[l - 1], a = c[l];
					var d = r(e, i, a, !0);
					d < t && (t = d, n = r(e, i, a));
				}
				return n && (n.distance = Math.sqrt(t)), n;
			},
			getCenter: function() {
				if (!this._map) throw Error("Must add layer to map before using getCenter()");
				return Vn(this._defaultShape(), this._map.options.crs);
			},
			getBounds: function() {
				return this._bounds;
			},
			addLatLng: function(e, t) {
				return t ||= this._defaultShape(), e = F(e), t.push(e), this._bounds.extend(e), this.redraw();
			},
			_setLatLngs: function(e) {
				this._bounds = new M(), this._latlngs = this._convertLatLngs(e);
			},
			_defaultShape: function() {
				return zn(this._latlngs) ? this._latlngs : this._latlngs[0];
			},
			_convertLatLngs: function(e) {
				for (var t = [], n = zn(e), r = 0, i = e.length; r < i; r++) n ? (t[r] = F(e[r]), this._bounds.extend(t[r])) : t[r] = this._convertLatLngs(e[r]);
				return t;
			},
			_project: function() {
				var e = new j();
				this._rings = [], this._projectLatlngs(this._latlngs, this._rings, e), this._bounds.isValid() && e.isValid() && (this._rawPxBounds = e, this._updateBounds());
			},
			_updateBounds: function() {
				var e = this._clickTolerance(), t = new k(e, e);
				this._rawPxBounds && (this._pxBounds = new j([this._rawPxBounds.min.subtract(t), this._rawPxBounds.max.add(t)]));
			},
			_projectLatlngs: function(e, t, n) {
				var r = e[0] instanceof P, i = e.length, a, o;
				if (r) {
					for (o = [], a = 0; a < i; a++) o[a] = this._map.latLngToLayerPoint(e[a]), n.extend(o[a]);
					t.push(o);
				} else for (a = 0; a < i; a++) this._projectLatlngs(e[a], t, n);
			},
			_clipPoints: function() {
				var e = this._renderer._bounds;
				if (this._parts = [], this._pxBounds && this._pxBounds.intersects(e)) {
					if (this.options.noClip) this._parts = this._rings;
					else for (var t = this._parts, n = 0, r, i = 0, a = this._rings.length, o, s, c; n < a; n++) for (c = this._rings[n], r = 0, o = c.length; r < o - 1; r++) s = Fn(c[r], c[r + 1], e, r, !0), s && (t[i] = t[i] || [], t[i].push(s[0]), (s[1] !== c[r + 1] || r === o - 2) && (t[i].push(s[1]), i++));
				}
			},
			_simplifyPoints: function() {
				for (var e = this._parts, t = this.options.smoothFactor, n = 0, r = e.length; n < r; n++) e[n] = On(e[n], t);
			},
			_update: function() {
				this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
			},
			_updatePath: function() {
				this._renderer._updatePoly(this);
			},
			_containsPoint: function(e, t) {
				var n, r, i, a, o, s, c = this._clickTolerance();
				if (!this._pxBounds || !this._pxBounds.contains(e)) return !1;
				for (n = 0, a = this._parts.length; n < a; n++) for (s = this._parts[n], r = 0, o = s.length, i = o - 1; r < o; i = r++) if ((t || r !== 0) && kn(e, s[i], s[r]) <= c) return !0;
				return !1;
			}
		});
		function fr(e, t) {
			return new dr(e, t);
		}
		dr._flat = Bn;
		var pr = dr.extend({
			options: { fill: !0 },
			isEmpty: function() {
				return !this._latlngs.length || !this._latlngs[0].length;
			},
			getCenter: function() {
				if (!this._map) throw Error("Must add layer to map before using getCenter()");
				return Tn(this._defaultShape(), this._map.options.crs);
			},
			_convertLatLngs: function(e) {
				var t = dr.prototype._convertLatLngs.call(this, e), n = t.length;
				return n >= 2 && t[0] instanceof P && t[0].equals(t[n - 1]) && t.pop(), t;
			},
			_setLatLngs: function(e) {
				dr.prototype._setLatLngs.call(this, e), zn(this._latlngs) && (this._latlngs = [this._latlngs]);
			},
			_defaultShape: function() {
				return zn(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
			},
			_clipPoints: function() {
				var e = this._renderer._bounds, t = this.options.weight, n = new k(t, t);
				if (e = new j(e.min.subtract(n), e.max.add(n)), this._parts = [], this._pxBounds && this._pxBounds.intersects(e)) {
					if (this.options.noClip) this._parts = this._rings;
					else for (var r = 0, i = this._rings.length, a; r < i; r++) a = wn(this._rings[r], e, !0), a.length && this._parts.push(a);
				}
			},
			_updatePath: function() {
				this._renderer._updatePoly(this, !0);
			},
			_containsPoint: function(e) {
				var t = !1, n, r, i, a, o, s, c, l;
				if (!this._pxBounds || !this._pxBounds.contains(e)) return !1;
				for (a = 0, c = this._parts.length; a < c; a++) for (n = this._parts[a], o = 0, l = n.length, s = l - 1; o < l; s = o++) r = n[o], i = n[s], r.y > e.y != i.y > e.y && e.x < (i.x - r.x) * (e.y - r.y) / (i.y - r.y) + r.x && (t = !t);
				return t || dr.prototype._containsPoint.call(this, e, !0);
			}
		});
		function mr(e, t) {
			return new pr(e, t);
		}
		var hr = Qn.extend({
			initialize: function(e, t) {
				p(this, t), this._layers = {}, e && this.addData(e);
			},
			addData: function(e) {
				var t = _(e) ? e : e.features, n, r, i;
				if (t) {
					for (n = 0, r = t.length; n < r; n++) i = t[n], (i.geometries || i.geometry || i.features || i.coordinates) && this.addData(i);
					return this;
				}
				var a = this.options;
				if (a.filter && !a.filter(e)) return this;
				var o = gr(e, a);
				return o ? (o.feature = Y(e), o.defaultOptions = o.options, this.resetStyle(o), a.onEachFeature && a.onEachFeature(e, o), this.addLayer(o)) : this;
			},
			resetStyle: function(e) {
				return e === void 0 ? this.eachLayer(this.resetStyle, this) : (e.options = n({}, e.defaultOptions), this._setLayerStyle(e, this.options.style), this);
			},
			setStyle: function(e) {
				return this.eachLayer(function(t) {
					this._setLayerStyle(t, e);
				}, this);
			},
			_setLayerStyle: function(e, t) {
				e.setStyle && (typeof t == "function" && (t = t(e.feature)), e.setStyle(t));
			}
		});
		function gr(e, t) {
			var n = e.type === "Feature" ? e.geometry : e, r = n ? n.coordinates : null, i = [], a = t && t.pointToLayer, o = t && t.coordsToLatLng || vr, s, c, l, u;
			if (!r && !n) return null;
			switch (n.type) {
				case "Point": return s = o(r), _r(a, e, s, t);
				case "MultiPoint":
					for (l = 0, u = r.length; l < u; l++) s = o(r[l]), i.push(_r(a, e, s, t));
					return new Qn(i);
				case "LineString":
				case "MultiLineString": return c = yr(r, n.type === "LineString" ? 0 : 1, o), new dr(c, t);
				case "Polygon":
				case "MultiPolygon": return c = yr(r, n.type === "Polygon" ? 1 : 2, o), new pr(c, t);
				case "GeometryCollection":
					for (l = 0, u = n.geometries.length; l < u; l++) {
						var d = gr({
							geometry: n.geometries[l],
							type: "Feature",
							properties: e.properties
						}, t);
						d && i.push(d);
					}
					return new Qn(i);
				case "FeatureCollection":
					for (l = 0, u = n.features.length; l < u; l++) {
						var f = gr(n.features[l], t);
						f && i.push(f);
					}
					return new Qn(i);
				default: throw Error("Invalid GeoJSON object.");
			}
		}
		function _r(e, t, n, r) {
			return e ? e(t, n) : new ir(n, r && r.markersInheritOptions && r);
		}
		function vr(e) {
			return new P(e[1], e[0], e[2]);
		}
		function yr(e, t, n) {
			for (var r = [], i = 0, a = e.length, o; i < a; i++) o = t ? yr(e[i], t - 1, n) : (n || vr)(e[i]), r.push(o);
			return r;
		}
		function br(e, t) {
			return e = F(e), e.alt === void 0 ? [u(e.lng, t), u(e.lat, t)] : [
				u(e.lng, t),
				u(e.lat, t),
				u(e.alt, t)
			];
		}
		function xr(e, t, n, r) {
			for (var i = [], a = 0, o = e.length; a < o; a++) i.push(t ? xr(e[a], zn(e[a]) ? 0 : t - 1, n, r) : br(e[a], r));
			return !t && n && i.length > 0 && i.push(i[0].slice()), i;
		}
		function Sr(e, t) {
			return e.feature ? n({}, e.feature, { geometry: t }) : Y(t);
		}
		function Y(e) {
			return e.type === "Feature" || e.type === "FeatureCollection" ? e : {
				type: "Feature",
				properties: {},
				geometry: e
			};
		}
		var Cr = { toGeoJSON: function(e) {
			return Sr(this, {
				type: "Point",
				coordinates: br(this.getLatLng(), e)
			});
		} };
		ir.include(Cr), lr.include(Cr), sr.include(Cr), dr.include({ toGeoJSON: function(e) {
			var t = !zn(this._latlngs), n = xr(this._latlngs, +!!t, !1, e);
			return Sr(this, {
				type: (t ? "Multi" : "") + "LineString",
				coordinates: n
			});
		} }), pr.include({ toGeoJSON: function(e) {
			var t = !zn(this._latlngs), n = t && !zn(this._latlngs[0]), r = xr(this._latlngs, n ? 2 : +!!t, !0, e);
			return t || (r = [r]), Sr(this, {
				type: (n ? "Multi" : "") + "Polygon",
				coordinates: r
			});
		} }), Xn.include({
			toMultiPoint: function(e) {
				var t = [];
				return this.eachLayer(function(n) {
					t.push(n.toGeoJSON(e).geometry.coordinates);
				}), Sr(this, {
					type: "MultiPoint",
					coordinates: t
				});
			},
			toGeoJSON: function(e) {
				var t = this.feature && this.feature.geometry && this.feature.geometry.type;
				if (t === "MultiPoint") return this.toMultiPoint(e);
				var n = t === "GeometryCollection", r = [];
				return this.eachLayer(function(t) {
					if (t.toGeoJSON) {
						var i = t.toGeoJSON(e);
						if (n) r.push(i.geometry);
						else {
							var a = Y(i);
							a.type === "FeatureCollection" ? r.push.apply(r, a.features) : r.push(a);
						}
					}
				}), n ? Sr(this, {
					geometries: r,
					type: "GeometryCollection"
				}) : {
					type: "FeatureCollection",
					features: r
				};
			}
		});
		function wr(e, t) {
			return new hr(e, t);
		}
		var Tr = wr, Er = Yn.extend({
			options: {
				opacity: 1,
				alt: "",
				interactive: !1,
				crossOrigin: !1,
				errorOverlayUrl: "",
				zIndex: 1,
				className: ""
			},
			initialize: function(e, t, n) {
				this._url = e, this._bounds = N(t), p(this, n);
			},
			onAdd: function() {
				this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (Tt(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
			},
			onRemove: function() {
				xt(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
			},
			setOpacity: function(e) {
				return this.options.opacity = e, this._image && this._updateOpacity(), this;
			},
			setStyle: function(e) {
				return e.opacity && this.setOpacity(e.opacity), this;
			},
			bringToFront: function() {
				return this._map && H(this._image), this;
			},
			bringToBack: function() {
				return this._map && Ct(this._image), this;
			},
			setUrl: function(e) {
				return this._url = e, this._image && (this._image.src = e), this;
			},
			setBounds: function(e) {
				return this._bounds = N(e), this._map && this._reset(), this;
			},
			getEvents: function() {
				var e = {
					zoom: this._reset,
					viewreset: this._reset
				};
				return this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
			},
			setZIndex: function(e) {
				return this.options.zIndex = e, this._updateZIndex(), this;
			},
			getBounds: function() {
				return this._bounds;
			},
			getElement: function() {
				return this._image;
			},
			_initImage: function() {
				var e = this._url.tagName === "IMG", t = this._image = e ? this._url : bt("img");
				Tt(t, "leaflet-image-layer"), this._zoomAnimated && Tt(t, "leaflet-zoom-animated"), this.options.className && Tt(t, this.options.className), t.onselectstart = l, t.onmousemove = l, t.onload = i(this.fire, this, "load"), t.onerror = i(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (t.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), e ? this._url = t.src : (t.src = this._url, t.alt = this.options.alt);
			},
			_animateZoom: function(e) {
				var t = this._map.getZoomScale(e.zoom), n = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
				Mt(this._image, n, t);
			},
			_reset: function() {
				var e = this._image, t = new j(this._map.latLngToLayerPoint(this._bounds.getNorthWest()), this._map.latLngToLayerPoint(this._bounds.getSouthEast())), n = t.getSize();
				Nt(e, t.min), e.style.width = n.x + "px", e.style.height = n.y + "px";
			},
			_updateOpacity: function() {
				kt(this._image, this.options.opacity);
			},
			_updateZIndex: function() {
				this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._image.style.zIndex = this.options.zIndex);
			},
			_overlayOnError: function() {
				this.fire("error");
				var e = this.options.errorOverlayUrl;
				e && this._url !== e && (this._url = e, this._image.src = e);
			},
			getCenter: function() {
				return this._bounds.getCenter();
			}
		}), Dr = function(e, t, n) {
			return new Er(e, t, n);
		}, Or = Er.extend({
			options: {
				autoplay: !0,
				loop: !0,
				keepAspectRatio: !0,
				muted: !1,
				playsInline: !0
			},
			_initImage: function() {
				var e = this._url.tagName === "VIDEO", t = this._image = e ? this._url : bt("video");
				if (Tt(t, "leaflet-image-layer"), this._zoomAnimated && Tt(t, "leaflet-zoom-animated"), this.options.className && Tt(t, this.options.className), t.onselectstart = l, t.onmousemove = l, t.onloadeddata = i(this.fire, this, "load"), e) {
					for (var n = t.getElementsByTagName("source"), r = [], a = 0; a < n.length; a++) r.push(n[a].src);
					this._url = n.length > 0 ? r : [t.src];
				} else {
					_(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(t.style, "objectFit") && (t.style.objectFit = "fill"), t.autoplay = !!this.options.autoplay, t.loop = !!this.options.loop, t.muted = !!this.options.muted, t.playsInline = !!this.options.playsInline;
					for (var o = 0; o < this._url.length; o++) {
						var s = bt("source");
						s.src = this._url[o], t.appendChild(s);
					}
				}
			}
		});
		function kr(e, t, n) {
			return new Or(e, t, n);
		}
		var Ar = Er.extend({ _initImage: function() {
			var e = this._image = this._url;
			Tt(e, "leaflet-image-layer"), this._zoomAnimated && Tt(e, "leaflet-zoom-animated"), this.options.className && Tt(e, this.options.className), e.onselectstart = l, e.onmousemove = l;
		} });
		function jr(e, t, n) {
			return new Ar(e, t, n);
		}
		var Mr = Yn.extend({
			options: {
				interactive: !1,
				offset: [0, 0],
				className: "",
				pane: void 0,
				content: ""
			},
			initialize: function(e, t) {
				e && (e instanceof P || _(e)) ? (this._latlng = F(e), p(this, t)) : (p(this, e), this._source = t), this.options.content && (this._content = this.options.content);
			},
			openOn: function(e) {
				return e = arguments.length ? e : this._source._map, e.hasLayer(this) || e.addLayer(this), this;
			},
			close: function() {
				return this._map && this._map.removeLayer(this), this;
			},
			toggle: function(e) {
				return this._map ? this.close() : (arguments.length ? this._source = e : e = this._source, this._prepareOpen(), this.openOn(e._map)), this;
			},
			onAdd: function(e) {
				this._zoomAnimated = e._zoomAnimated, this._container || this._initLayout(), e._fadeAnimated && kt(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && kt(this._container, 1), this.bringToFront(), this.options.interactive && (Tt(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
			},
			onRemove: function(e) {
				e._fadeAnimated ? (kt(this._container, 0), this._removeTimeout = setTimeout(i(xt, void 0, this._container), 200)) : xt(this._container), this.options.interactive && (Et(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
			},
			getLatLng: function() {
				return this._latlng;
			},
			setLatLng: function(e) {
				return this._latlng = F(e), this._map && (this._updatePosition(), this._adjustPan()), this;
			},
			getContent: function() {
				return this._content;
			},
			setContent: function(e) {
				return this._content = e, this.update(), this;
			},
			getElement: function() {
				return this._container;
			},
			update: function() {
				this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan());
			},
			getEvents: function() {
				var e = {
					zoom: this._updatePosition,
					viewreset: this._updatePosition
				};
				return this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
			},
			isOpen: function() {
				return !!this._map && this._map.hasLayer(this);
			},
			bringToFront: function() {
				return this._map && H(this._container), this;
			},
			bringToBack: function() {
				return this._map && Ct(this._container), this;
			},
			_prepareOpen: function(e) {
				var t = this._source;
				if (!t._map) return !1;
				if (t instanceof Qn) {
					t = null;
					var n = this._source._layers;
					for (var r in n) if (n[r]._map) {
						t = n[r];
						break;
					}
					if (!t) return !1;
					this._source = t;
				}
				if (!e) {
					if (t.getCenter) e = t.getCenter();
					else if (t.getLatLng) e = t.getLatLng();
					else if (t.getBounds) e = t.getBounds().getCenter();
					else throw Error("Unable to get source layer LatLng.");
				}
				return this.setLatLng(e), this._map && this.update(), !0;
			},
			_updateContent: function() {
				if (this._content) {
					var e = this._contentNode, t = typeof this._content == "function" ? this._content(this._source || this) : this._content;
					if (typeof t == "string") e.innerHTML = t;
					else {
						for (; e.hasChildNodes();) e.removeChild(e.firstChild);
						e.appendChild(t);
					}
					this.fire("contentupdate");
				}
			},
			_updatePosition: function() {
				if (this._map) {
					var e = this._map.latLngToLayerPoint(this._latlng), t = A(this.options.offset), n = this._getAnchor();
					this._zoomAnimated ? Nt(this._container, e.add(n)) : t = t.add(e).add(n);
					var r = this._containerBottom = -t.y, i = this._containerLeft = -Math.round(this._containerWidth / 2) + t.x;
					this._container.style.bottom = r + "px", this._container.style.left = i + "px";
				}
			},
			_getAnchor: function() {
				return [0, 0];
			}
		});
		fn.include({ _initOverlay: function(e, t, n, r) {
			var i = t;
			return i instanceof e || (i = new e(r).setContent(t)), n && i.setLatLng(n), i;
		} }), Yn.include({ _initOverlay: function(e, t, n, r) {
			var i = n;
			return i instanceof e ? (p(i, r), i._source = this) : (i = t && !r ? t : new e(r, this), i.setContent(n)), i;
		} });
		var Nr = Mr.extend({
			options: {
				pane: "popupPane",
				offset: [0, 7],
				maxWidth: 300,
				minWidth: 50,
				maxHeight: null,
				autoPan: !0,
				autoPanPaddingTopLeft: null,
				autoPanPaddingBottomRight: null,
				autoPanPadding: [5, 5],
				keepInView: !1,
				closeButton: !0,
				autoClose: !0,
				closeOnEscapeKey: !0,
				className: ""
			},
			openOn: function(e) {
				return e = arguments.length ? e : this._source._map, !e.hasLayer(this) && e._popup && e._popup.options.autoClose && e.removeLayer(e._popup), e._popup = this, Mr.prototype.openOn.call(this, e);
			},
			onAdd: function(e) {
				Mr.prototype.onAdd.call(this, e), e.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof or || this._source.on("preclick", $t));
			},
			onRemove: function(e) {
				Mr.prototype.onRemove.call(this, e), e.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof or || this._source.off("preclick", $t));
			},
			getEvents: function() {
				var e = Mr.prototype.getEvents.call(this);
				return (this.options.closeOnClick === void 0 ? this._map.options.closePopupOnClick : this.options.closeOnClick) && (e.preclick = this.close), this.options.keepInView && (e.moveend = this._adjustPan), e;
			},
			_initLayout: function() {
				var e = "leaflet-popup", t = this._container = bt("div", e + " " + (this.options.className || "") + " leaflet-zoom-animated"), n = this._wrapper = bt("div", e + "-content-wrapper", t);
				if (this._contentNode = bt("div", e + "-content", n), tn(t), en(this._contentNode), Jt(t, "contextmenu", $t), this._tipContainer = bt("div", e + "-tip-container", t), this._tip = bt("div", e + "-tip", this._tipContainer), this.options.closeButton) {
					var r = this._closeButton = bt("a", e + "-close-button", t);
					r.setAttribute("role", "button"), r.setAttribute("aria-label", "Close popup"), r.href = "#close", r.innerHTML = "<span aria-hidden=\"true\">&#215;</span>", Jt(r, "click", function(e) {
						nn(e), this.close();
					}, this);
				}
			},
			_updateLayout: function() {
				var e = this._contentNode, t = e.style;
				t.width = "", t.whiteSpace = "nowrap";
				var n = e.offsetWidth;
				n = Math.min(n, this.options.maxWidth), n = Math.max(n, this.options.minWidth), t.width = n + 1 + "px", t.whiteSpace = "", t.height = "";
				var r = e.offsetHeight, i = this.options.maxHeight, a = "leaflet-popup-scrolled";
				i && r > i ? (t.height = i + "px", Tt(e, a)) : Et(e, a), this._containerWidth = this._container.offsetWidth;
			},
			_animateZoom: function(e) {
				var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), n = this._getAnchor();
				Nt(this._container, t.add(n));
			},
			_adjustPan: function() {
				if (this.options.autoPan) {
					if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) this._autopanning = !1;
					else {
						var e = this._map, t = parseInt(yt(this._container, "marginBottom"), 10) || 0, n = this._container.offsetHeight + t, r = this._containerWidth, i = new k(this._containerLeft, -n - this._containerBottom);
						i._add(Pt(this._container));
						var a = e.layerPointToContainerPoint(i), o = A(this.options.autoPanPadding), s = A(this.options.autoPanPaddingTopLeft || o), c = A(this.options.autoPanPaddingBottomRight || o), l = e.getSize(), u = 0, d = 0;
						a.x + r + c.x > l.x && (u = a.x + r - l.x + c.x), a.x - u - s.x < 0 && (u = a.x - s.x), a.y + n + c.y > l.y && (d = a.y + n - l.y + c.y), a.y - d - s.y < 0 && (d = a.y - s.y), (u || d) && (this.options.keepInView && (this._autopanning = !0), e.fire("autopanstart").panBy([u, d]));
					}
				}
			},
			_getAnchor: function() {
				return A(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
			}
		}), Pr = function(e, t) {
			return new Nr(e, t);
		};
		fn.mergeOptions({ closePopupOnClick: !0 }), fn.include({
			openPopup: function(e, t, n) {
				return this._initOverlay(Nr, e, t, n).openOn(this), this;
			},
			closePopup: function(e) {
				return e = arguments.length ? e : this._popup, e && e.close(), this;
			}
		}), Yn.include({
			bindPopup: function(e, t) {
				return this._popup = this._initOverlay(Nr, this._popup, e, t), this._popupHandlersAdded ||= (this.on({
					click: this._openPopup,
					keypress: this._onKeyPress,
					remove: this.closePopup,
					move: this._movePopup
				}), !0), this;
			},
			unbindPopup: function() {
				return this._popup &&= (this.off({
					click: this._openPopup,
					keypress: this._onKeyPress,
					remove: this.closePopup,
					move: this._movePopup
				}), this._popupHandlersAdded = !1, null), this;
			},
			openPopup: function(e) {
				return this._popup && (this instanceof Qn || (this._popup._source = this), this._popup._prepareOpen(e || this._latlng) && this._popup.openOn(this._map)), this;
			},
			closePopup: function() {
				return this._popup && this._popup.close(), this;
			},
			togglePopup: function() {
				return this._popup && this._popup.toggle(this), this;
			},
			isPopupOpen: function() {
				return this._popup ? this._popup.isOpen() : !1;
			},
			setPopupContent: function(e) {
				return this._popup && this._popup.setContent(e), this;
			},
			getPopup: function() {
				return this._popup;
			},
			_openPopup: function(e) {
				if (this._popup && this._map) {
					rn(e);
					var t = e.layer || e.target;
					this._popup._source === t && !(t instanceof or) ? this._map.hasLayer(this._popup) ? this.closePopup() : this.openPopup(e.latlng) : (this._popup._source = t, this.openPopup(e.latlng));
				}
			},
			_movePopup: function(e) {
				this._popup.setLatLng(e.latlng);
			},
			_onKeyPress: function(e) {
				e.originalEvent.keyCode === 13 && this._openPopup(e);
			}
		});
		var Fr = Mr.extend({
			options: {
				pane: "tooltipPane",
				offset: [0, 0],
				direction: "auto",
				permanent: !1,
				sticky: !1,
				opacity: .9
			},
			onAdd: function(e) {
				Mr.prototype.onAdd.call(this, e), this.setOpacity(this.options.opacity), e.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
			},
			onRemove: function(e) {
				Mr.prototype.onRemove.call(this, e), e.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
			},
			getEvents: function() {
				var e = Mr.prototype.getEvents.call(this);
				return this.options.permanent || (e.preclick = this.close), e;
			},
			_initLayout: function() {
				var e = "leaflet-tooltip " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
				this._contentNode = this._container = bt("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + o(this));
			},
			_updateLayout: function() {},
			_adjustPan: function() {},
			_setPosition: function(e) {
				var t, n, r = this._map, i = this._container, a = r.latLngToContainerPoint(r.getCenter()), o = r.layerPointToContainerPoint(e), s = this.options.direction, c = i.offsetWidth, l = i.offsetHeight, u = A(this.options.offset), d = this._getAnchor();
				s === "top" ? (t = c / 2, n = l) : s === "bottom" ? (t = c / 2, n = 0) : s === "center" ? (t = c / 2, n = l / 2) : s === "right" ? (t = 0, n = l / 2) : s === "left" ? (t = c, n = l / 2) : o.x < a.x ? (s = "right", t = 0, n = l / 2) : (s = "left", t = c + (u.x + d.x) * 2, n = l / 2), e = e.subtract(A(t, n, !0)).add(u).add(d), Et(i, "leaflet-tooltip-right"), Et(i, "leaflet-tooltip-left"), Et(i, "leaflet-tooltip-top"), Et(i, "leaflet-tooltip-bottom"), Tt(i, "leaflet-tooltip-" + s), Nt(i, e);
			},
			_updatePosition: function() {
				var e = this._map.latLngToLayerPoint(this._latlng);
				this._setPosition(e);
			},
			setOpacity: function(e) {
				this.options.opacity = e, this._container && kt(this._container, e);
			},
			_animateZoom: function(e) {
				var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
				this._setPosition(t);
			},
			_getAnchor: function() {
				return A(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
			}
		}), Ir = function(e, t) {
			return new Fr(e, t);
		};
		fn.include({
			openTooltip: function(e, t, n) {
				return this._initOverlay(Fr, e, t, n).openOn(this), this;
			},
			closeTooltip: function(e) {
				return e.close(), this;
			}
		}), Yn.include({
			bindTooltip: function(e, t) {
				return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Fr, this._tooltip, e, t), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
			},
			unbindTooltip: function() {
				return this._tooltip &&= (this._initTooltipInteractions(!0), this.closeTooltip(), null), this;
			},
			_initTooltipInteractions: function(e) {
				if (e || !this._tooltipHandlersAdded) {
					var t = e ? "off" : "on", n = {
						remove: this.closeTooltip,
						move: this._moveTooltip
					};
					this._tooltip.options.permanent ? n.add = this._openTooltip : (n.mouseover = this._openTooltip, n.mouseout = this.closeTooltip, n.click = this._openTooltip, this._map ? this._addFocusListeners() : n.add = this._addFocusListeners), this._tooltip.options.sticky && (n.mousemove = this._moveTooltip), this[t](n), this._tooltipHandlersAdded = !e;
				}
			},
			openTooltip: function(e) {
				return this._tooltip && (this instanceof Qn || (this._tooltip._source = this), this._tooltip._prepareOpen(e) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
			},
			closeTooltip: function() {
				if (this._tooltip) return this._tooltip.close();
			},
			toggleTooltip: function() {
				return this._tooltip && this._tooltip.toggle(this), this;
			},
			isTooltipOpen: function() {
				return this._tooltip.isOpen();
			},
			setTooltipContent: function(e) {
				return this._tooltip && this._tooltip.setContent(e), this;
			},
			getTooltip: function() {
				return this._tooltip;
			},
			_addFocusListeners: function() {
				this.getElement ? this._addFocusListenersOnLayer(this) : this.eachLayer && this.eachLayer(this._addFocusListenersOnLayer, this);
			},
			_addFocusListenersOnLayer: function(e) {
				var t = typeof e.getElement == "function" && e.getElement();
				t && (Jt(t, "focus", function() {
					this._tooltip._source = e, this.openTooltip();
				}, this), Jt(t, "blur", this.closeTooltip, this));
			},
			_setAriaDescribedByOnLayer: function(e) {
				var t = typeof e.getElement == "function" && e.getElement();
				t && t.setAttribute("aria-describedby", this._tooltip._container.id);
			},
			_openTooltip: function(e) {
				if (this._tooltip && this._map) {
					if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
						this._openOnceFlag = !0;
						var t = this;
						this._map.once("moveend", function() {
							t._openOnceFlag = !1, t._openTooltip(e);
						});
					} else this._tooltip._source = e.layer || e.target, this.openTooltip(this._tooltip.options.sticky ? e.latlng : void 0);
				}
			},
			_moveTooltip: function(e) {
				var t = e.latlng, n, r;
				this._tooltip.options.sticky && e.originalEvent && (n = this._map.mouseEventToContainerPoint(e.originalEvent), r = this._map.containerPointToLayerPoint(n), t = this._map.layerPointToLatLng(r)), this._tooltip.setLatLng(t);
			}
		});
		var Lr = er.extend({
			options: {
				iconSize: [12, 12],
				html: !1,
				bgPos: null,
				className: "leaflet-div-icon"
			},
			createIcon: function(e) {
				var t = e && e.tagName === "DIV" ? e : document.createElement("div"), n = this.options;
				if (n.html instanceof Element ? (St(t), t.appendChild(n.html)) : t.innerHTML = n.html === !1 ? "" : n.html, n.bgPos) {
					var r = A(n.bgPos);
					t.style.backgroundPosition = -r.x + "px " + -r.y + "px";
				}
				return this._setIconStyles(t, "icon"), t;
			},
			createShadow: function() {
				return null;
			}
		});
		function Rr(e) {
			return new Lr(e);
		}
		er.Default = nr;
		var zr = Yn.extend({
			options: {
				tileSize: 256,
				opacity: 1,
				updateWhenIdle: V.mobile,
				updateWhenZooming: !0,
				updateInterval: 200,
				zIndex: 1,
				bounds: null,
				minZoom: 0,
				maxZoom: void 0,
				maxNativeZoom: void 0,
				minNativeZoom: void 0,
				noWrap: !1,
				pane: "tilePane",
				className: "",
				keepBuffer: 2
			},
			initialize: function(e) {
				p(this, e);
			},
			onAdd: function() {
				this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
			},
			beforeAdd: function(e) {
				e._addZoomLimit(this);
			},
			onRemove: function(e) {
				this._removeAllTiles(), xt(this._container), e._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
			},
			bringToFront: function() {
				return this._map && (H(this._container), this._setAutoZIndex(Math.max)), this;
			},
			bringToBack: function() {
				return this._map && (Ct(this._container), this._setAutoZIndex(Math.min)), this;
			},
			getContainer: function() {
				return this._container;
			},
			setOpacity: function(e) {
				return this.options.opacity = e, this._updateOpacity(), this;
			},
			setZIndex: function(e) {
				return this.options.zIndex = e, this._updateZIndex(), this;
			},
			isLoading: function() {
				return this._loading;
			},
			redraw: function() {
				if (this._map) {
					this._removeAllTiles();
					var e = this._clampZoom(this._map.getZoom());
					e !== this._tileZoom && (this._tileZoom = e, this._updateLevels()), this._update();
				}
				return this;
			},
			getEvents: function() {
				var e = {
					viewprereset: this._invalidateAll,
					viewreset: this._resetView,
					zoom: this._resetView,
					moveend: this._onMoveEnd
				};
				return this.options.updateWhenIdle || (this._onMove ||= s(this._onMoveEnd, this.options.updateInterval, this), e.move = this._onMove), this._zoomAnimated && (e.zoomanim = this._animateZoom), e;
			},
			createTile: function() {
				return document.createElement("div");
			},
			getTileSize: function() {
				var e = this.options.tileSize;
				return e instanceof k ? e : new k(e, e);
			},
			_updateZIndex: function() {
				this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
			},
			_setAutoZIndex: function(e) {
				for (var t = this.getPane().children, n = -e(-Infinity, Infinity), r = 0, i = t.length, a; r < i; r++) a = t[r].style.zIndex, t[r] !== this._container && a && (n = e(n, +a));
				isFinite(n) && (this.options.zIndex = n + e(-1, 1), this._updateZIndex());
			},
			_updateOpacity: function() {
				if (this._map && !V.ielt9) {
					kt(this._container, this.options.opacity);
					var e = +/* @__PURE__ */ new Date(), t = !1, n = !1;
					for (var r in this._tiles) {
						var i = this._tiles[r];
						if (i.current && i.loaded) {
							var a = Math.min(1, (e - i.loaded) / 200);
							kt(i.el, a), a < 1 ? t = !0 : (i.active ? n = !0 : this._onOpaqueTile(i), i.active = !0);
						}
					}
					n && !this._noPrune && this._pruneTiles(), t && (w(this._fadeFrame), this._fadeFrame = te(this._updateOpacity, this));
				}
			},
			_onOpaqueTile: l,
			_initContainer: function() {
				this._container || (this._container = bt("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
			},
			_updateLevels: function() {
				var e = this._tileZoom, t = this.options.maxZoom;
				if (e !== void 0) {
					for (var n in this._levels) n = Number(n), this._levels[n].el.children.length || n === e ? (this._levels[n].el.style.zIndex = t - Math.abs(e - n), this._onUpdateLevel(n)) : (xt(this._levels[n].el), this._removeTilesAtZoom(n), this._onRemoveLevel(n), delete this._levels[n]);
					var r = this._levels[e], i = this._map;
					return r || (r = this._levels[e] = {}, r.el = bt("div", "leaflet-tile-container leaflet-zoom-animated", this._container), r.el.style.zIndex = t, r.origin = i.project(i.unproject(i.getPixelOrigin()), e).round(), r.zoom = e, this._setZoomTransform(r, i.getCenter(), i.getZoom()), r.el.offsetWidth, this._onCreateLevel(r)), this._level = r, r;
				}
			},
			_onUpdateLevel: l,
			_onRemoveLevel: l,
			_onCreateLevel: l,
			_pruneTiles: function() {
				if (this._map) {
					var e, t, n = this._map.getZoom();
					if (n > this.options.maxZoom || n < this.options.minZoom) this._removeAllTiles();
					else {
						for (e in this._tiles) t = this._tiles[e], t.retain = t.current;
						for (e in this._tiles) if (t = this._tiles[e], t.current && !t.active) {
							var r = t.coords;
							this._retainParent(r.x, r.y, r.z, r.z - 5) || this._retainChildren(r.x, r.y, r.z, r.z + 2);
						}
						for (e in this._tiles) this._tiles[e].retain || this._removeTile(e);
					}
				}
			},
			_removeTilesAtZoom: function(e) {
				for (var t in this._tiles) this._tiles[t].coords.z === e && this._removeTile(t);
			},
			_removeAllTiles: function() {
				for (var e in this._tiles) this._removeTile(e);
			},
			_invalidateAll: function() {
				for (var e in this._levels) xt(this._levels[e].el), this._onRemoveLevel(Number(e)), delete this._levels[e];
				this._removeAllTiles(), this._tileZoom = void 0;
			},
			_retainParent: function(e, t, n, r) {
				var i = Math.floor(e / 2), a = Math.floor(t / 2), o = n - 1, s = new k(+i, +a);
				s.z = +o;
				var c = this._tileCoordsToKey(s), l = this._tiles[c];
				return l && l.active ? (l.retain = !0, !0) : (l && l.loaded && (l.retain = !0), o > r && this._retainParent(i, a, o, r));
			},
			_retainChildren: function(e, t, n, r) {
				for (var i = 2 * e; i < 2 * e + 2; i++) for (var a = 2 * t; a < 2 * t + 2; a++) {
					var o = new k(i, a);
					o.z = n + 1;
					var s = this._tileCoordsToKey(o), c = this._tiles[s];
					c && c.active ? c.retain = !0 : (c && c.loaded && (c.retain = !0), n + 1 < r && this._retainChildren(i, a, n + 1, r));
				}
			},
			_resetView: function(e) {
				var t = e && (e.pinch || e.flyTo);
				this._setView(this._map.getCenter(), this._map.getZoom(), t, t);
			},
			_animateZoom: function(e) {
				this._setView(e.center, e.zoom, !0, e.noUpdate);
			},
			_clampZoom: function(e) {
				var t = this.options;
				return t.minNativeZoom !== void 0 && e < t.minNativeZoom ? t.minNativeZoom : t.maxNativeZoom !== void 0 && t.maxNativeZoom < e ? t.maxNativeZoom : e;
			},
			_setView: function(e, t, n, r) {
				var i = Math.round(t);
				i = this.options.maxZoom !== void 0 && i > this.options.maxZoom || this.options.minZoom !== void 0 && i < this.options.minZoom ? void 0 : this._clampZoom(i);
				var a = this.options.updateWhenZooming && i !== this._tileZoom;
				(!r || a) && (this._tileZoom = i, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), i !== void 0 && this._update(e), n || this._pruneTiles(), this._noPrune = !!n), this._setZoomTransforms(e, t);
			},
			_setZoomTransforms: function(e, t) {
				for (var n in this._levels) this._setZoomTransform(this._levels[n], e, t);
			},
			_setZoomTransform: function(e, t, n) {
				var r = this._map.getZoomScale(n, e.zoom), i = e.origin.multiplyBy(r).subtract(this._map._getNewPixelOrigin(t, n)).round();
				V.any3d ? Mt(e.el, i, r) : Nt(e.el, i);
			},
			_resetGrid: function() {
				var e = this._map, t = e.options.crs, n = this._tileSize = this.getTileSize(), r = this._tileZoom, i = this._map.getPixelWorldBounds(this._tileZoom);
				i && (this._globalTileRange = this._pxBoundsToTileRange(i)), this._wrapX = t.wrapLng && !this.options.noWrap && [Math.floor(e.project([0, t.wrapLng[0]], r).x / n.x), Math.ceil(e.project([0, t.wrapLng[1]], r).x / n.y)], this._wrapY = t.wrapLat && !this.options.noWrap && [Math.floor(e.project([t.wrapLat[0], 0], r).y / n.x), Math.ceil(e.project([t.wrapLat[1], 0], r).y / n.y)];
			},
			_onMoveEnd: function() {
				this._map && !this._map._animatingZoom && this._update();
			},
			_getTiledPixelBounds: function(e) {
				var t = this._map, n = t._animatingZoom ? Math.max(t._animateToZoom, t.getZoom()) : t.getZoom(), r = t.getZoomScale(n, this._tileZoom), i = t.project(e, this._tileZoom).floor(), a = t.getSize().divideBy(r * 2);
				return new j(i.subtract(a), i.add(a));
			},
			_update: function(e) {
				var t = this._map;
				if (t) {
					var n = this._clampZoom(t.getZoom());
					if (e === void 0 && (e = t.getCenter()), this._tileZoom !== void 0) {
						var r = this._getTiledPixelBounds(e), i = this._pxBoundsToTileRange(r), a = i.getCenter(), o = [], s = this.options.keepBuffer, c = new j(i.getBottomLeft().subtract([s, -s]), i.getTopRight().add([s, -s]));
						if (!(isFinite(i.min.x) && isFinite(i.min.y) && isFinite(i.max.x) && isFinite(i.max.y))) throw Error("Attempted to load an infinite number of tiles");
						for (var l in this._tiles) {
							var u = this._tiles[l].coords;
							u.z === this._tileZoom && c.contains(new k(u.x, u.y)) || (this._tiles[l].current = !1);
						}
						if (Math.abs(n - this._tileZoom) > 1) this._setView(e, n);
						else {
							for (var d = i.min.y; d <= i.max.y; d++) for (var f = i.min.x; f <= i.max.x; f++) {
								var p = new k(f, d);
								if (p.z = this._tileZoom, this._isValidTile(p)) {
									var m = this._tiles[this._tileCoordsToKey(p)];
									m ? m.current = !0 : o.push(p);
								}
							}
							if (o.sort(function(e, t) {
								return e.distanceTo(a) - t.distanceTo(a);
							}), o.length !== 0) {
								this._loading || (this._loading = !0, this.fire("loading"));
								var h = document.createDocumentFragment();
								for (f = 0; f < o.length; f++) this._addTile(o[f], h);
								this._level.el.appendChild(h);
							}
						}
					}
				}
			},
			_isValidTile: function(e) {
				var t = this._map.options.crs;
				if (!t.infinite) {
					var n = this._globalTileRange;
					if (!t.wrapLng && (e.x < n.min.x || e.x > n.max.x) || !t.wrapLat && (e.y < n.min.y || e.y > n.max.y)) return !1;
				}
				if (!this.options.bounds) return !0;
				var r = this._tileCoordsToBounds(e);
				return N(this.options.bounds).overlaps(r);
			},
			_keyToBounds: function(e) {
				return this._tileCoordsToBounds(this._keyToTileCoords(e));
			},
			_tileCoordsToNwSe: function(e) {
				var t = this._map, n = this.getTileSize(), r = e.scaleBy(n), i = r.add(n);
				return [t.unproject(r, e.z), t.unproject(i, e.z)];
			},
			_tileCoordsToBounds: function(e) {
				var t = this._tileCoordsToNwSe(e), n = new M(t[0], t[1]);
				return this.options.noWrap || (n = this._map.wrapLatLngBounds(n)), n;
			},
			_tileCoordsToKey: function(e) {
				return e.x + ":" + e.y + ":" + e.z;
			},
			_keyToTileCoords: function(e) {
				var t = e.split(":"), n = new k(+t[0], +t[1]);
				return n.z = +t[2], n;
			},
			_removeTile: function(e) {
				var t = this._tiles[e];
				t && (xt(t.el), delete this._tiles[e], this.fire("tileunload", {
					tile: t.el,
					coords: this._keyToTileCoords(e)
				}));
			},
			_initTile: function(e) {
				Tt(e, "leaflet-tile");
				var t = this.getTileSize();
				e.style.width = t.x + "px", e.style.height = t.y + "px", e.onselectstart = l, e.onmousemove = l, V.ielt9 && this.options.opacity < 1 && kt(e, this.options.opacity);
			},
			_addTile: function(e, t) {
				var n = this._getTilePos(e), r = this._tileCoordsToKey(e), a = this.createTile(this._wrapCoords(e), i(this._tileReady, this, e));
				this._initTile(a), this.createTile.length < 2 && te(i(this._tileReady, this, e, null, a)), Nt(a, n), this._tiles[r] = {
					el: a,
					coords: e,
					current: !0
				}, t.appendChild(a), this.fire("tileloadstart", {
					tile: a,
					coords: e
				});
			},
			_tileReady: function(e, t, n) {
				t && this.fire("tileerror", {
					error: t,
					tile: n,
					coords: e
				});
				var r = this._tileCoordsToKey(e);
				n = this._tiles[r], n && (n.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (kt(n.el, 0), w(this._fadeFrame), this._fadeFrame = te(this._updateOpacity, this)) : (n.active = !0, this._pruneTiles()), t || (Tt(n.el, "leaflet-tile-loaded"), this.fire("tileload", {
					tile: n.el,
					coords: e
				})), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), V.ielt9 || !this._map._fadeAnimated ? te(this._pruneTiles, this) : setTimeout(i(this._pruneTiles, this), 250)));
			},
			_getTilePos: function(e) {
				return e.scaleBy(this.getTileSize()).subtract(this._level.origin);
			},
			_wrapCoords: function(e) {
				var t = new k(this._wrapX ? c(e.x, this._wrapX) : e.x, this._wrapY ? c(e.y, this._wrapY) : e.y);
				return t.z = e.z, t;
			},
			_pxBoundsToTileRange: function(e) {
				var t = this.getTileSize();
				return new j(e.min.unscaleBy(t).floor(), e.max.unscaleBy(t).ceil().subtract([1, 1]));
			},
			_noTilesToLoad: function() {
				for (var e in this._tiles) if (!this._tiles[e].loaded) return !1;
				return !0;
			}
		});
		function Br(e) {
			return new zr(e);
		}
		var Vr = zr.extend({
			options: {
				minZoom: 0,
				maxZoom: 18,
				subdomains: "abc",
				errorTileUrl: "",
				zoomOffset: 0,
				tms: !1,
				zoomReverse: !1,
				detectRetina: !1,
				crossOrigin: !1,
				referrerPolicy: !1
			},
			initialize: function(e, t) {
				this._url = e, t = p(this, t), t.detectRetina && V.retina && t.maxZoom > 0 ? (t.tileSize = Math.floor(t.tileSize / 2), t.zoomReverse ? (t.zoomOffset--, t.minZoom = Math.min(t.maxZoom, t.minZoom + 1)) : (t.zoomOffset++, t.maxZoom = Math.max(t.minZoom, t.maxZoom - 1)), t.minZoom = Math.max(0, t.minZoom)) : t.zoomReverse ? t.minZoom = Math.min(t.maxZoom, t.minZoom) : t.maxZoom = Math.max(t.minZoom, t.maxZoom), typeof t.subdomains == "string" && (t.subdomains = t.subdomains.split("")), this.on("tileunload", this._onTileRemove);
			},
			setUrl: function(e, t) {
				return this._url === e && t === void 0 && (t = !0), this._url = e, t || this.redraw(), this;
			},
			createTile: function(e, t) {
				var n = document.createElement("img");
				return Jt(n, "load", i(this._tileOnLoad, this, t, n)), Jt(n, "error", i(this._tileOnError, this, t, n)), (this.options.crossOrigin || this.options.crossOrigin === "") && (n.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (n.referrerPolicy = this.options.referrerPolicy), n.alt = "", n.src = this.getTileUrl(e), n;
			},
			getTileUrl: function(e) {
				var t = {
					r: V.retina ? "@2x" : "",
					s: this._getSubdomain(e),
					x: e.x,
					y: e.y,
					z: this._getZoomForUrl()
				};
				if (this._map && !this._map.options.crs.infinite) {
					var r = this._globalTileRange.max.y - e.y;
					this.options.tms && (t.y = r), t["-y"] = r;
				}
				return g(this._url, n(t, this.options));
			},
			_tileOnLoad: function(e, t) {
				V.ielt9 ? setTimeout(i(e, this, null, t), 0) : e(null, t);
			},
			_tileOnError: function(e, t, n) {
				var r = this.options.errorTileUrl;
				r && t.getAttribute("src") !== r && (t.src = r), e(n, t);
			},
			_onTileRemove: function(e) {
				e.tile.onload = null;
			},
			_getZoomForUrl: function() {
				var e = this._tileZoom, t = this.options.maxZoom, n = this.options.zoomReverse, r = this.options.zoomOffset;
				return n && (e = t - e), e + r;
			},
			_getSubdomain: function(e) {
				var t = Math.abs(e.x + e.y) % this.options.subdomains.length;
				return this.options.subdomains[t];
			},
			_abortLoading: function() {
				var e, t;
				for (e in this._tiles) if (this._tiles[e].coords.z !== this._tileZoom && (t = this._tiles[e].el, t.onload = l, t.onerror = l, !t.complete)) {
					t.src = y;
					var n = this._tiles[e].coords;
					xt(t), delete this._tiles[e], this.fire("tileabort", {
						tile: t,
						coords: n
					});
				}
			},
			_removeTile: function(e) {
				var t = this._tiles[e];
				if (t) return t.el.setAttribute("src", y), zr.prototype._removeTile.call(this, e);
			},
			_tileReady: function(e, t, n) {
				if (!(!this._map || n && n.getAttribute("src") === y)) return zr.prototype._tileReady.call(this, e, t, n);
			}
		});
		function Hr(e, t) {
			return new Vr(e, t);
		}
		var Ur = Vr.extend({
			defaultWmsParams: {
				service: "WMS",
				request: "GetMap",
				layers: "",
				styles: "",
				format: "image/jpeg",
				transparent: !1,
				version: "1.1.1"
			},
			options: {
				crs: null,
				uppercase: !1
			},
			initialize: function(e, t) {
				this._url = e;
				var r = n({}, this.defaultWmsParams);
				for (var i in t) i in this.options || (r[i] = t[i]);
				t = p(this, t);
				var a = t.detectRetina && V.retina ? 2 : 1, o = this.getTileSize();
				r.width = o.x * a, r.height = o.y * a, this.wmsParams = r;
			},
			onAdd: function(e) {
				this._crs = this.options.crs || e.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
				var t = this._wmsVersion >= 1.3 ? "crs" : "srs";
				this.wmsParams[t] = this._crs.code, Vr.prototype.onAdd.call(this, e);
			},
			getTileUrl: function(e) {
				var t = this._tileCoordsToNwSe(e), n = this._crs, r = ie(n.project(t[0]), n.project(t[1])), i = r.min, a = r.max, o = (this._wmsVersion >= 1.3 && this._crs === qn ? [
					i.y,
					i.x,
					a.y,
					a.x
				] : [
					i.x,
					i.y,
					a.x,
					a.y
				]).join(","), s = Vr.prototype.getTileUrl.call(this, e);
				return s + m(this.wmsParams, s, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + o;
			},
			setParams: function(e, t) {
				return n(this.wmsParams, e), t || this.redraw(), this;
			}
		});
		function X(e, t) {
			return new Ur(e, t);
		}
		Vr.WMS = Ur, Hr.wms = X;
		var Wr = Yn.extend({
			options: { padding: .1 },
			initialize: function(e) {
				p(this, e), o(this), this._layers = this._layers || {};
			},
			onAdd: function() {
				this._container || (this._initContainer(), Tt(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
			},
			onRemove: function() {
				this.off("update", this._updatePaths, this), this._destroyContainer();
			},
			getEvents: function() {
				var e = {
					viewreset: this._reset,
					zoom: this._onZoom,
					moveend: this._update,
					zoomend: this._onZoomEnd
				};
				return this._zoomAnimated && (e.zoomanim = this._onAnimZoom), e;
			},
			_onAnimZoom: function(e) {
				this._updateTransform(e.center, e.zoom);
			},
			_onZoom: function() {
				this._updateTransform(this._map.getCenter(), this._map.getZoom());
			},
			_updateTransform: function(e, t) {
				var n = this._map.getZoomScale(t, this._zoom), r = this._map.getSize().multiplyBy(.5 + this.options.padding), i = this._map.project(this._center, t), a = r.multiplyBy(-n).add(i).subtract(this._map._getNewPixelOrigin(e, t));
				V.any3d ? Mt(this._container, a, n) : Nt(this._container, a);
			},
			_reset: function() {
				for (var e in this._update(), this._updateTransform(this._center, this._zoom), this._layers) this._layers[e]._reset();
			},
			_onZoomEnd: function() {
				for (var e in this._layers) this._layers[e]._project();
			},
			_updatePaths: function() {
				for (var e in this._layers) this._layers[e]._update();
			},
			_update: function() {
				var e = this.options.padding, t = this._map.getSize(), n = this._map.containerPointToLayerPoint(t.multiplyBy(-e)).round();
				this._bounds = new j(n, n.add(t.multiplyBy(1 + e * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
			}
		}), Gr = Wr.extend({
			options: { tolerance: 0 },
			getEvents: function() {
				var e = Wr.prototype.getEvents.call(this);
				return e.viewprereset = this._onViewPreReset, e;
			},
			_onViewPreReset: function() {
				this._postponeUpdatePaths = !0;
			},
			onAdd: function() {
				Wr.prototype.onAdd.call(this), this._draw();
			},
			_initContainer: function() {
				var e = this._container = document.createElement("canvas");
				Jt(e, "mousemove", this._onMouseMove, this), Jt(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this), Jt(e, "mouseout", this._handleMouseOut, this), e._leaflet_disable_events = !0, this._ctx = e.getContext("2d");
			},
			_destroyContainer: function() {
				w(this._redrawRequest), delete this._ctx, xt(this._container), Xt(this._container), delete this._container;
			},
			_updatePaths: function() {
				if (!this._postponeUpdatePaths) {
					var e;
					for (var t in this._redrawBounds = null, this._layers) e = this._layers[t], e._update();
					this._redraw();
				}
			},
			_update: function() {
				if (!(this._map._animatingZoom && this._bounds)) {
					Wr.prototype._update.call(this);
					var e = this._bounds, t = this._container, n = e.getSize(), r = V.retina ? 2 : 1;
					Nt(t, e.min), t.width = r * n.x, t.height = r * n.y, t.style.width = n.x + "px", t.style.height = n.y + "px", V.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y), this.fire("update");
				}
			},
			_reset: function() {
				Wr.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
			},
			_initPath: function(e) {
				this._updateDashArray(e), this._layers[o(e)] = e;
				var t = e._order = {
					layer: e,
					prev: this._drawLast,
					next: null
				};
				this._drawLast && (this._drawLast.next = t), this._drawLast = t, this._drawFirst = this._drawFirst || this._drawLast;
			},
			_addPath: function(e) {
				this._requestRedraw(e);
			},
			_removePath: function(e) {
				var t = e._order, n = t.next, r = t.prev;
				n ? n.prev = r : this._drawLast = r, r ? r.next = n : this._drawFirst = n, delete e._order, delete this._layers[o(e)], this._requestRedraw(e);
			},
			_updatePath: function(e) {
				this._extendRedrawBounds(e), e._project(), e._update(), this._requestRedraw(e);
			},
			_updateStyle: function(e) {
				this._updateDashArray(e), this._requestRedraw(e);
			},
			_updateDashArray: function(e) {
				if (typeof e.options.dashArray == "string") {
					for (var t = e.options.dashArray.split(/[, ]+/), n = [], r, i = 0; i < t.length; i++) {
						if (r = Number(t[i]), isNaN(r)) return;
						n.push(r);
					}
					e.options._dashArray = n;
				} else e.options._dashArray = e.options.dashArray;
			},
			_requestRedraw: function(e) {
				this._map && (this._extendRedrawBounds(e), this._redrawRequest = this._redrawRequest || te(this._redraw, this));
			},
			_extendRedrawBounds: function(e) {
				if (e._pxBounds) {
					var t = (e.options.weight || 0) + 1;
					this._redrawBounds = this._redrawBounds || new j(), this._redrawBounds.extend(e._pxBounds.min.subtract([t, t])), this._redrawBounds.extend(e._pxBounds.max.add([t, t]));
				}
			},
			_redraw: function() {
				this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
			},
			_clear: function() {
				var e = this._redrawBounds;
				if (e) {
					var t = e.getSize();
					this._ctx.clearRect(e.min.x, e.min.y, t.x, t.y);
				} else this._ctx.save(), this._ctx.setTransform(1, 0, 0, 1, 0, 0), this._ctx.clearRect(0, 0, this._container.width, this._container.height), this._ctx.restore();
			},
			_draw: function() {
				var e, t = this._redrawBounds;
				if (this._ctx.save(), t) {
					var n = t.getSize();
					this._ctx.beginPath(), this._ctx.rect(t.min.x, t.min.y, n.x, n.y), this._ctx.clip();
				}
				this._drawing = !0;
				for (var r = this._drawFirst; r; r = r.next) e = r.layer, (!t || e._pxBounds && e._pxBounds.intersects(t)) && e._updatePath();
				this._drawing = !1, this._ctx.restore();
			},
			_updatePoly: function(e, t) {
				if (this._drawing) {
					var n, r, i, a, o = e._parts, s = o.length, c = this._ctx;
					if (s) {
						for (c.beginPath(), n = 0; n < s; n++) {
							for (r = 0, i = o[n].length; r < i; r++) a = o[n][r], c[r ? "lineTo" : "moveTo"](a.x, a.y);
							t && c.closePath();
						}
						this._fillStroke(c, e);
					}
				}
			},
			_updateCircle: function(e) {
				if (this._drawing && !e._empty()) {
					var t = e._point, n = this._ctx, r = Math.max(Math.round(e._radius), 1), i = (Math.max(Math.round(e._radiusY), 1) || r) / r;
					i !== 1 && (n.save(), n.scale(1, i)), n.beginPath(), n.arc(t.x, t.y / i, r, 0, Math.PI * 2, !1), i !== 1 && n.restore(), this._fillStroke(n, e);
				}
			},
			_fillStroke: function(e, t) {
				var n = t.options;
				n.fill && (e.globalAlpha = n.fillOpacity, e.fillStyle = n.fillColor || n.color, e.fill(n.fillRule || "evenodd")), n.stroke && n.weight !== 0 && (e.setLineDash && e.setLineDash(t.options && t.options._dashArray || []), e.globalAlpha = n.opacity, e.lineWidth = n.weight, e.strokeStyle = n.color, e.lineCap = n.lineCap, e.lineJoin = n.lineJoin, e.stroke());
			},
			_onClick: function(e) {
				for (var t = this._map.mouseEventToLayerPoint(e), n, r, i = this._drawFirst; i; i = i.next) n = i.layer, n.options.interactive && n._containsPoint(t) && (e.type !== "click" && e.type !== "preclick" || !this._map._draggableMoved(n)) && (r = n);
				this._fireEvent(r ? [r] : !1, e);
			},
			_onMouseMove: function(e) {
				if (!(!this._map || this._map.dragging.moving() || this._map._animatingZoom)) {
					var t = this._map.mouseEventToLayerPoint(e);
					this._handleMouseHover(e, t);
				}
			},
			_handleMouseOut: function(e) {
				var t = this._hoveredLayer;
				t && (Et(this._container, "leaflet-interactive"), this._fireEvent([t], e, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
			},
			_handleMouseHover: function(e, t) {
				if (!this._mouseHoverThrottled) {
					for (var n, r, a = this._drawFirst; a; a = a.next) n = a.layer, n.options.interactive && n._containsPoint(t) && (r = n);
					r !== this._hoveredLayer && (this._handleMouseOut(e), r && (Tt(this._container, "leaflet-interactive"), this._fireEvent([r], e, "mouseover"), this._hoveredLayer = r)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, e), this._mouseHoverThrottled = !0, setTimeout(i(function() {
						this._mouseHoverThrottled = !1;
					}, this), 32);
				}
			},
			_fireEvent: function(e, t, n) {
				this._map._fireDOMEvent(t, n || t.type, e);
			},
			_bringToFront: function(e) {
				var t = e._order;
				if (t) {
					var n = t.next, r = t.prev;
					if (n) n.prev = r;
					else return;
					r ? r.next = n : n && (this._drawFirst = n), t.prev = this._drawLast, this._drawLast.next = t, t.next = null, this._drawLast = t, this._requestRedraw(e);
				}
			},
			_bringToBack: function(e) {
				var t = e._order;
				if (t) {
					var n = t.next, r = t.prev;
					if (r) r.next = n;
					else return;
					n ? n.prev = r : r && (this._drawLast = r), t.prev = null, t.next = this._drawFirst, this._drawFirst.prev = t, this._drawFirst = t, this._requestRedraw(e);
				}
			}
		});
		function Kr(e) {
			return V.canvas ? new Gr(e) : null;
		}
		var qr = (function() {
			try {
				return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(e) {
					return document.createElement("<lvml:" + e + " class=\"lvml\">");
				};
			} catch {}
			return function(e) {
				return document.createElement("<" + e + " xmlns=\"urn:schemas-microsoft.com:vml\" class=\"lvml\">");
			};
		})(), Z = {
			_initContainer: function() {
				this._container = bt("div", "leaflet-vml-container");
			},
			_update: function() {
				this._map._animatingZoom || (Wr.prototype._update.call(this), this.fire("update"));
			},
			_initPath: function(e) {
				var t = e._container = qr("shape");
				Tt(t, "leaflet-vml-shape " + (this.options.className || "")), t.coordsize = "1 1", e._path = qr("path"), t.appendChild(e._path), this._updateStyle(e), this._layers[o(e)] = e;
			},
			_addPath: function(e) {
				var t = e._container;
				this._container.appendChild(t), e.options.interactive && e.addInteractiveTarget(t);
			},
			_removePath: function(e) {
				var t = e._container;
				xt(t), e.removeInteractiveTarget(t), delete this._layers[o(e)];
			},
			_updateStyle: function(e) {
				var t = e._stroke, n = e._fill, r = e.options, i = e._container;
				i.stroked = !!r.stroke, i.filled = !!r.fill, r.stroke ? (t ||= e._stroke = qr("stroke"), i.appendChild(t), t.weight = r.weight + "px", t.color = r.color, t.opacity = r.opacity, r.dashArray ? t.dashStyle = _(r.dashArray) ? r.dashArray.join(" ") : r.dashArray.replace(/( *, *)/g, " ") : t.dashStyle = "", t.endcap = r.lineCap.replace("butt", "flat"), t.joinstyle = r.lineJoin) : t && (i.removeChild(t), e._stroke = null), r.fill ? (n ||= e._fill = qr("fill"), i.appendChild(n), n.color = r.fillColor || r.color, n.opacity = r.fillOpacity) : n && (i.removeChild(n), e._fill = null);
			},
			_updateCircle: function(e) {
				var t = e._point.round(), n = Math.round(e._radius), r = Math.round(e._radiusY || n);
				this._setPath(e, e._empty() ? "M0 0" : "AL " + t.x + "," + t.y + " " + n + "," + r + " 0,23592600");
			},
			_setPath: function(e, t) {
				e._path.v = t;
			},
			_bringToFront: function(e) {
				H(e._container);
			},
			_bringToBack: function(e) {
				Ct(e._container);
			}
		}, Jr = V.vml ? qr : pe, Yr = Wr.extend({
			_initContainer: function() {
				this._container = Jr("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Jr("g"), this._container.appendChild(this._rootGroup);
			},
			_destroyContainer: function() {
				xt(this._container), Xt(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
			},
			_update: function() {
				if (!(this._map._animatingZoom && this._bounds)) {
					Wr.prototype._update.call(this);
					var e = this._bounds, t = e.getSize(), n = this._container;
					this._svgSize && this._svgSize.equals(t) || (this._svgSize = t, n.setAttribute("width", t.x), n.setAttribute("height", t.y)), Nt(n, e.min), n.setAttribute("viewBox", [
						e.min.x,
						e.min.y,
						t.x,
						t.y
					].join(" ")), this.fire("update");
				}
			},
			_initPath: function(e) {
				var t = e._path = Jr("path");
				e.options.className && Tt(t, e.options.className), e.options.interactive && Tt(t, "leaflet-interactive"), this._updateStyle(e), this._layers[o(e)] = e;
			},
			_addPath: function(e) {
				this._rootGroup || this._initContainer(), this._rootGroup.appendChild(e._path), e.addInteractiveTarget(e._path);
			},
			_removePath: function(e) {
				xt(e._path), e.removeInteractiveTarget(e._path), delete this._layers[o(e)];
			},
			_updatePath: function(e) {
				e._project(), e._update();
			},
			_updateStyle: function(e) {
				var t = e._path, n = e.options;
				t && (n.stroke ? (t.setAttribute("stroke", n.color), t.setAttribute("stroke-opacity", n.opacity), t.setAttribute("stroke-width", n.weight), t.setAttribute("stroke-linecap", n.lineCap), t.setAttribute("stroke-linejoin", n.lineJoin), n.dashArray ? t.setAttribute("stroke-dasharray", n.dashArray) : t.removeAttribute("stroke-dasharray"), n.dashOffset ? t.setAttribute("stroke-dashoffset", n.dashOffset) : t.removeAttribute("stroke-dashoffset")) : t.setAttribute("stroke", "none"), n.fill ? (t.setAttribute("fill", n.fillColor || n.color), t.setAttribute("fill-opacity", n.fillOpacity), t.setAttribute("fill-rule", n.fillRule || "evenodd")) : t.setAttribute("fill", "none"));
			},
			_updatePoly: function(e, t) {
				this._setPath(e, me(e._parts, t));
			},
			_updateCircle: function(e) {
				var t = e._point, n = Math.max(Math.round(e._radius), 1), r = Math.max(Math.round(e._radiusY), 1) || n, i = "a" + n + "," + r + " 0 1,0 ", a = e._empty() ? "M0 0" : "M" + (t.x - n) + "," + t.y + i + n * 2 + ",0 " + i + -n * 2 + ",0 ";
				this._setPath(e, a);
			},
			_setPath: function(e, t) {
				e._path.setAttribute("d", t);
			},
			_bringToFront: function(e) {
				H(e._path);
			},
			_bringToBack: function(e) {
				Ct(e._path);
			}
		});
		V.vml && Yr.include(Z);
		function Xr(e) {
			return V.svg || V.vml ? new Yr(e) : null;
		}
		fn.include({
			getRenderer: function(e) {
				var t = e.options.renderer || this._getPaneRenderer(e.options.pane) || this.options.renderer || this._renderer;
				return t ||= this._renderer = this._createRenderer(), this.hasLayer(t) || this.addLayer(t), t;
			},
			_getPaneRenderer: function(e) {
				if (e === "overlayPane" || e === void 0) return !1;
				var t = this._paneRenderers[e];
				return t === void 0 && (t = this._createRenderer({ pane: e }), this._paneRenderers[e] = t), t;
			},
			_createRenderer: function(e) {
				return this.options.preferCanvas && Kr(e) || Xr(e);
			}
		});
		var Zr = pr.extend({
			initialize: function(e, t) {
				pr.prototype.initialize.call(this, this._boundsToLatLngs(e), t);
			},
			setBounds: function(e) {
				return this.setLatLngs(this._boundsToLatLngs(e));
			},
			_boundsToLatLngs: function(e) {
				return e = N(e), [
					e.getSouthWest(),
					e.getNorthWest(),
					e.getNorthEast(),
					e.getSouthEast()
				];
			}
		});
		function Qr(e, t) {
			return new Zr(e, t);
		}
		Yr.create = Jr, Yr.pointsToPath = me, hr.geometryToLayer = gr, hr.coordsToLatLng = vr, hr.coordsToLatLngs = yr, hr.latLngToCoords = br, hr.latLngsToCoords = xr, hr.getFeature = Sr, hr.asFeature = Y, fn.mergeOptions({ boxZoom: !0 });
		var $r = bn.extend({
			initialize: function(e) {
				this._map = e, this._container = e._container, this._pane = e._panes.overlayPane, this._resetStateTimeout = 0, e.on("unload", this._destroy, this);
			},
			addHooks: function() {
				Jt(this._container, "mousedown", this._onMouseDown, this);
			},
			removeHooks: function() {
				Xt(this._container, "mousedown", this._onMouseDown, this);
			},
			moved: function() {
				return this._moved;
			},
			_destroy: function() {
				xt(this._pane), delete this._pane;
			},
			_resetState: function() {
				this._resetStateTimeout = 0, this._moved = !1;
			},
			_clearDeferredResetState: function() {
				this._resetStateTimeout !== 0 && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
			},
			_onMouseDown: function(e) {
				if (!e.shiftKey || e.which !== 1 && e.button !== 1) return !1;
				this._clearDeferredResetState(), this._resetState(), Ft(), zt(), this._startPoint = this._map.mouseEventToContainerPoint(e), Jt(document, {
					contextmenu: rn,
					mousemove: this._onMouseMove,
					mouseup: this._onMouseUp,
					keydown: this._onKeyDown
				}, this);
			},
			_onMouseMove: function(e) {
				this._moved || (this._moved = !0, this._box = bt("div", "leaflet-zoom-box", this._container), Tt(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
				var t = new j(this._point, this._startPoint), n = t.getSize();
				Nt(this._box, t.min), this._box.style.width = n.x + "px", this._box.style.height = n.y + "px";
			},
			_finish: function() {
				this._moved && (xt(this._box), Et(this._container, "leaflet-crosshair")), It(), Bt(), Xt(document, {
					contextmenu: rn,
					mousemove: this._onMouseMove,
					mouseup: this._onMouseUp,
					keydown: this._onKeyDown
				}, this);
			},
			_onMouseUp: function(e) {
				if ((e.which === 1 || e.button === 1) && (this._finish(), this._moved)) {
					this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(i(this._resetState, this), 0);
					var t = new M(this._map.containerPointToLatLng(this._startPoint), this._map.containerPointToLatLng(this._point));
					this._map.fitBounds(t).fire("boxzoomend", { boxZoomBounds: t });
				}
			},
			_onKeyDown: function(e) {
				e.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
			}
		});
		fn.addInitHook("addHandler", "boxZoom", $r), fn.mergeOptions({ doubleClickZoom: !0 });
		var Q = bn.extend({
			addHooks: function() {
				this._map.on("dblclick", this._onDoubleClick, this);
			},
			removeHooks: function() {
				this._map.off("dblclick", this._onDoubleClick, this);
			},
			_onDoubleClick: function(e) {
				var t = this._map, n = t.getZoom(), r = t.options.zoomDelta, i = e.originalEvent.shiftKey ? n - r : n + r;
				t.options.doubleClickZoom === "center" ? t.setZoom(i) : t.setZoomAround(e.containerPoint, i);
			}
		});
		fn.addInitHook("addHandler", "doubleClickZoom", Q), fn.mergeOptions({
			dragging: !0,
			inertia: !0,
			inertiaDeceleration: 3400,
			inertiaMaxSpeed: Infinity,
			easeLinearity: .2,
			worldCopyJump: !1,
			maxBoundsViscosity: 0
		});
		var ei = bn.extend({
			addHooks: function() {
				if (!this._draggable) {
					var e = this._map;
					this._draggable = new Cn(e._mapPane, e._container), this._draggable.on({
						dragstart: this._onDragStart,
						drag: this._onDrag,
						dragend: this._onDragEnd
					}, this), this._draggable.on("predrag", this._onPreDragLimit, this), e.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), e.on("zoomend", this._onZoomEnd, this), e.whenReady(this._onZoomEnd, this));
				}
				Tt(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
			},
			removeHooks: function() {
				Et(this._map._container, "leaflet-grab"), Et(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
			},
			moved: function() {
				return this._draggable && this._draggable._moved;
			},
			moving: function() {
				return this._draggable && this._draggable._moving;
			},
			_onDragStart: function() {
				var e = this._map;
				if (e._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
					var t = N(this._map.options.maxBounds);
					this._offsetLimit = ie(this._map.latLngToContainerPoint(t.getNorthWest()).multiplyBy(-1), this._map.latLngToContainerPoint(t.getSouthEast()).multiplyBy(-1).add(this._map.getSize())), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
				} else this._offsetLimit = null;
				e.fire("movestart").fire("dragstart"), e.options.inertia && (this._positions = [], this._times = []);
			},
			_onDrag: function(e) {
				if (this._map.options.inertia) {
					var t = this._lastTime = +/* @__PURE__ */ new Date(), n = this._lastPos = this._draggable._absPos || this._draggable._newPos;
					this._positions.push(n), this._times.push(t), this._prunePositions(t);
				}
				this._map.fire("move", e).fire("drag", e);
			},
			_prunePositions: function(e) {
				for (; this._positions.length > 1 && e - this._times[0] > 50;) this._positions.shift(), this._times.shift();
			},
			_onZoomEnd: function() {
				var e = this._map.getSize().divideBy(2), t = this._map.latLngToLayerPoint([0, 0]);
				this._initialWorldOffset = t.subtract(e).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
			},
			_viscousLimit: function(e, t) {
				return e - (e - t) * this._viscosity;
			},
			_onPreDragLimit: function() {
				if (this._viscosity && this._offsetLimit) {
					var e = this._draggable._newPos.subtract(this._draggable._startPos), t = this._offsetLimit;
					e.x < t.min.x && (e.x = this._viscousLimit(e.x, t.min.x)), e.y < t.min.y && (e.y = this._viscousLimit(e.y, t.min.y)), e.x > t.max.x && (e.x = this._viscousLimit(e.x, t.max.x)), e.y > t.max.y && (e.y = this._viscousLimit(e.y, t.max.y)), this._draggable._newPos = this._draggable._startPos.add(e);
				}
			},
			_onPreDragWrap: function() {
				var e = this._worldWidth, t = Math.round(e / 2), n = this._initialWorldOffset, r = this._draggable._newPos.x, i = (r - t + n) % e + t - n, a = (r + t + n) % e - t - n, o = Math.abs(i + n) < Math.abs(a + n) ? i : a;
				this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = o;
			},
			_onDragEnd: function(e) {
				var t = this._map, n = t.options, r = !n.inertia || e.noInertia || this._times.length < 2;
				if (t.fire("dragend", e), r) t.fire("moveend");
				else {
					this._prunePositions(+/* @__PURE__ */ new Date());
					var i = this._lastPos.subtract(this._positions[0]), a = (this._lastTime - this._times[0]) / 1e3, o = n.easeLinearity, s = i.multiplyBy(o / a), c = s.distanceTo([0, 0]), l = Math.min(n.inertiaMaxSpeed, c), u = s.multiplyBy(l / c), d = l / (n.inertiaDeceleration * o), f = u.multiplyBy(-d / 2).round();
					!f.x && !f.y ? t.fire("moveend") : (f = t._limitOffset(f, t.options.maxBounds), te(function() {
						t.panBy(f, {
							duration: d,
							easeLinearity: o,
							noMoveStart: !0,
							animate: !0
						});
					}));
				}
			}
		});
		fn.addInitHook("addHandler", "dragging", ei), fn.mergeOptions({
			keyboard: !0,
			keyboardPanDelta: 80
		});
		var ti = bn.extend({
			keyCodes: {
				left: [37],
				right: [39],
				down: [40],
				up: [38],
				zoomIn: [
					187,
					107,
					61,
					171
				],
				zoomOut: [
					189,
					109,
					54,
					173
				]
			},
			initialize: function(e) {
				this._map = e, this._setPanDelta(e.options.keyboardPanDelta), this._setZoomDelta(e.options.zoomDelta);
			},
			addHooks: function() {
				var e = this._map._container;
				e.tabIndex <= 0 && (e.tabIndex = "0"), Jt(e, {
					focus: this._onFocus,
					blur: this._onBlur,
					mousedown: this._onMouseDown
				}, this), this._map.on({
					focus: this._addHooks,
					blur: this._removeHooks
				}, this);
			},
			removeHooks: function() {
				this._removeHooks(), Xt(this._map._container, {
					focus: this._onFocus,
					blur: this._onBlur,
					mousedown: this._onMouseDown
				}, this), this._map.off({
					focus: this._addHooks,
					blur: this._removeHooks
				}, this);
			},
			_onMouseDown: function() {
				if (!this._focused) {
					var e = document.body, t = document.documentElement, n = e.scrollTop || t.scrollTop, r = e.scrollLeft || t.scrollLeft;
					this._map._container.focus(), window.scrollTo(r, n);
				}
			},
			_onFocus: function() {
				this._focused = !0, this._map.fire("focus");
			},
			_onBlur: function() {
				this._focused = !1, this._map.fire("blur");
			},
			_setPanDelta: function(e) {
				for (var t = this._panKeys = {}, n = this.keyCodes, r = 0, i = n.left.length; r < i; r++) t[n.left[r]] = [-1 * e, 0];
				for (r = 0, i = n.right.length; r < i; r++) t[n.right[r]] = [e, 0];
				for (r = 0, i = n.down.length; r < i; r++) t[n.down[r]] = [0, e];
				for (r = 0, i = n.up.length; r < i; r++) t[n.up[r]] = [0, -1 * e];
			},
			_setZoomDelta: function(e) {
				for (var t = this._zoomKeys = {}, n = this.keyCodes, r = 0, i = n.zoomIn.length; r < i; r++) t[n.zoomIn[r]] = e;
				for (r = 0, i = n.zoomOut.length; r < i; r++) t[n.zoomOut[r]] = -e;
			},
			_addHooks: function() {
				Jt(document, "keydown", this._onKeyDown, this);
			},
			_removeHooks: function() {
				Xt(document, "keydown", this._onKeyDown, this);
			},
			_onKeyDown: function(e) {
				if (!(e.altKey || e.ctrlKey || e.metaKey)) {
					var t = e.keyCode, n = this._map, r;
					if (t in this._panKeys) {
						if (!n._panAnim || !n._panAnim._inProgress) {
							if (r = this._panKeys[t], e.shiftKey && (r = A(r).multiplyBy(3)), n.options.maxBounds && (r = n._limitOffset(A(r), n.options.maxBounds)), n.options.worldCopyJump) {
								var i = n.wrapLatLng(n.unproject(n.project(n.getCenter()).add(r)));
								n.panTo(i);
							} else n.panBy(r);
						}
					} else if (t in this._zoomKeys) n.setZoom(n.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[t]);
					else if (t === 27 && n._popup && n._popup.options.closeOnEscapeKey) n.closePopup();
					else return;
					rn(e);
				}
			}
		});
		fn.addInitHook("addHandler", "keyboard", ti), fn.mergeOptions({
			scrollWheelZoom: !0,
			wheelDebounceTime: 40,
			wheelPxPerZoomLevel: 60
		});
		var ni = bn.extend({
			addHooks: function() {
				Jt(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
			},
			removeHooks: function() {
				Xt(this._map._container, "wheel", this._onWheelScroll, this);
			},
			_onWheelScroll: function(e) {
				var t = cn(e), n = this._map.options.wheelDebounceTime;
				this._delta += t, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime ||= +/* @__PURE__ */ new Date();
				var r = Math.max(n - (+/* @__PURE__ */ new Date() - this._startTime), 0);
				clearTimeout(this._timer), this._timer = setTimeout(i(this._performZoom, this), r), rn(e);
			},
			_performZoom: function() {
				var e = this._map, t = e.getZoom(), n = this._map.options.zoomSnap || 0;
				e._stop();
				var r = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), i = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(r)))) / Math.LN2, a = n ? Math.ceil(i / n) * n : i, o = e._limitZoom(t + (this._delta > 0 ? a : -a)) - t;
				this._delta = 0, this._startTime = null, o && (e.options.scrollWheelZoom === "center" ? e.setZoom(t + o) : e.setZoomAround(this._lastMousePos, t + o));
			}
		});
		fn.addInitHook("addHandler", "scrollWheelZoom", ni);
		var ri = 600;
		fn.mergeOptions({
			tapHold: V.touchNative && V.safari && V.mobile,
			tapTolerance: 15
		});
		var ii = bn.extend({
			addHooks: function() {
				Jt(this._map._container, "touchstart", this._onDown, this);
			},
			removeHooks: function() {
				Xt(this._map._container, "touchstart", this._onDown, this);
			},
			_onDown: function(e) {
				if (clearTimeout(this._holdTimeout), e.touches.length === 1) {
					var t = e.touches[0];
					this._startPos = this._newPos = new k(t.clientX, t.clientY), this._holdTimeout = setTimeout(i(function() {
						this._cancel(), this._isTapValid() && (Jt(document, "touchend", nn), Jt(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", t));
					}, this), ri), Jt(document, "touchend touchcancel contextmenu", this._cancel, this), Jt(document, "touchmove", this._onMove, this);
				}
			},
			_cancelClickPrevent: function e() {
				Xt(document, "touchend", nn), Xt(document, "touchend touchcancel", e);
			},
			_cancel: function() {
				clearTimeout(this._holdTimeout), Xt(document, "touchend touchcancel contextmenu", this._cancel, this), Xt(document, "touchmove", this._onMove, this);
			},
			_onMove: function(e) {
				var t = e.touches[0];
				this._newPos = new k(t.clientX, t.clientY);
			},
			_isTapValid: function() {
				return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
			},
			_simulateEvent: function(e, t) {
				var n = new MouseEvent(e, {
					bubbles: !0,
					cancelable: !0,
					view: window,
					screenX: t.screenX,
					screenY: t.screenY,
					clientX: t.clientX,
					clientY: t.clientY
				});
				n._simulated = !0, t.target.dispatchEvent(n);
			}
		});
		fn.addInitHook("addHandler", "tapHold", ii), fn.mergeOptions({
			touchZoom: V.touch,
			bounceAtZoomLimits: !0
		});
		var ai = bn.extend({
			addHooks: function() {
				Tt(this._map._container, "leaflet-touch-zoom"), Jt(this._map._container, "touchstart", this._onTouchStart, this);
			},
			removeHooks: function() {
				Et(this._map._container, "leaflet-touch-zoom"), Xt(this._map._container, "touchstart", this._onTouchStart, this);
			},
			_onTouchStart: function(e) {
				var t = this._map;
				if (!(!e.touches || e.touches.length !== 2 || t._animatingZoom || this._zooming)) {
					var n = t.mouseEventToContainerPoint(e.touches[0]), r = t.mouseEventToContainerPoint(e.touches[1]);
					this._centerPoint = t.getSize()._divideBy(2), this._startLatLng = t.containerPointToLatLng(this._centerPoint), t.options.touchZoom !== "center" && (this._pinchStartLatLng = t.containerPointToLatLng(n.add(r)._divideBy(2))), this._startDist = n.distanceTo(r), this._startZoom = t.getZoom(), this._moved = !1, this._zooming = !0, t._stop(), Jt(document, "touchmove", this._onTouchMove, this), Jt(document, "touchend touchcancel", this._onTouchEnd, this), nn(e);
				}
			},
			_onTouchMove: function(e) {
				if (e.touches && e.touches.length === 2 && this._zooming) {
					var t = this._map, n = t.mouseEventToContainerPoint(e.touches[0]), r = t.mouseEventToContainerPoint(e.touches[1]), a = n.distanceTo(r) / this._startDist;
					if (this._zoom = t.getScaleZoom(a, this._startZoom), !t.options.bounceAtZoomLimits && (this._zoom < t.getMinZoom() && a < 1 || this._zoom > t.getMaxZoom() && a > 1) && (this._zoom = t._limitZoom(this._zoom)), t.options.touchZoom === "center") {
						if (this._center = this._startLatLng, a === 1) return;
					} else {
						var o = n._add(r)._divideBy(2)._subtract(this._centerPoint);
						if (a === 1 && o.x === 0 && o.y === 0) return;
						this._center = t.unproject(t.project(this._pinchStartLatLng, this._zoom).subtract(o), this._zoom);
					}
					this._moved ||= (t._moveStart(!0, !1), !0), w(this._animRequest);
					var s = i(t._move, t, this._center, this._zoom, {
						pinch: !0,
						round: !1
					}, void 0);
					this._animRequest = te(s, this, !0), nn(e);
				}
			},
			_onTouchEnd: function() {
				!this._moved || !this._zooming ? this._zooming = !1 : (this._zooming = !1, w(this._animRequest), Xt(document, "touchmove", this._onTouchMove, this), Xt(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom)));
			}
		});
		fn.addInitHook("addHandler", "touchZoom", ai), fn.BoxZoom = $r, fn.DoubleClickZoom = Q, fn.Drag = ei, fn.Keyboard = ti, fn.ScrollWheelZoom = ni, fn.TapHold = ii, fn.TouchZoom = ai, e.Bounds = j, e.Browser = V, e.CRS = ae, e.Canvas = Gr, e.Circle = lr, e.CircleMarker = sr, e.Class = E, e.Control = mn, e.DivIcon = Lr, e.DivOverlay = Mr, e.DomEvent = un, e.DomUtil = qt, e.Draggable = Cn, e.Evented = O, e.FeatureGroup = Qn, e.GeoJSON = hr, e.GridLayer = zr, e.Handler = bn, e.Icon = er, e.ImageOverlay = Er, e.LatLng = P, e.LatLngBounds = M, e.Layer = Yn, e.LayerGroup = Xn, e.LineUtil = Hn, e.Map = fn, e.Marker = ir, e.Mixin = xn, e.Path = or, e.Point = k, e.PolyUtil = Dn, e.Polygon = pr, e.Polyline = dr, e.Popup = Nr, e.PosAnimation = dn, e.Projection = Gn, e.Rectangle = Zr, e.Renderer = Wr, e.SVG = Yr, e.SVGOverlay = Ar, e.TileLayer = Vr, e.Tooltip = Fr, e.Transformation = le, e.Util = T, e.VideoOverlay = Or, e.bind = i, e.bounds = ie, e.canvas = Kr, e.circle = ur, e.circleMarker = cr, e.control = hn, e.divIcon = Rr, e.extend = n, e.featureGroup = $n, e.geoJSON = wr, e.geoJson = Tr, e.gridLayer = Br, e.icon = tr, e.imageOverlay = Dr, e.latLng = F, e.latLngBounds = N, e.layerGroup = Zn, e.map = pn, e.marker = ar, e.point = A, e.polygon = mr, e.polyline = fr, e.popup = Pr, e.rectangle = Qr, e.setOptions = p, e.stamp = o, e.svg = Xr, e.svgOverlay = jr, e.tileLayer = Hr, e.tooltip = Ir, e.transformation = ue, e.version = t, e.videoOverlay = kr;
		var oi = window.L;
		e.noConflict = function() {
			return window.L = oi, this;
		}, window.L = e;
	}));
})))()), om = /* @__PURE__ */ X("<div class=\"map svelte-1zqw7d\" role=\"region\"></div>");
function sm(e, t) {
	et(t, !0);
	let n = am.default.TileLayer.extend({ createTile(e, t) {
		let n = document.createElement("img");
		return n.alt = "", am.default.DomEvent.on(n, "load", am.default.Util.bind(this._tileOnLoad, this, t, n)), am.default.DomEvent.on(n, "error", am.default.Util.bind(this._tileOnError, this, t, n)), Oc(this.getTileUrl(e)).then((e) => n.src = e, (e) => t(e, n)), n;
	} }), r = xa(t, "lines", 19, () => []), i = xa(t, "dots", 19, () => []), a = xa(t, "label", 3, "Map"), o = /* @__PURE__ */ U(void 0);
	An(() => {
		let e = getComputedStyle(Y(o)), t = (t) => e.getPropertyValue(`--${t}`).trim(), a = matchMedia("(pointer: coarse)").matches, s = am.default.map(Y(o), {
			scrollWheelZoom: !1,
			dragging: !a
		});
		s.attributionControl.setPrefix(!1), new n(Tc, {
			maxZoom: 19,
			attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">OpenStreetMap</a> contributors"
		}).addTo(s);
		let c = am.default.latLngBounds([]), l = (e, t) => t && e.on("click", () => location.hash = t);
		for (let { points: e, kind: n, href: i } of r()) l(am.default.polyline(e, {
			color: t(n),
			weight: 4
		}).addTo(s), i), c.extend(e);
		for (let { lat: e, lon: n, kind: r, role: a, title: o, href: u } of i()) {
			let i = a === "end", d = am.default.circleMarker([e, n], {
				radius: 6,
				fillColor: t(r),
				fillOpacity: 1,
				color: "#fff",
				weight: i ? 2 : 0
			}).addTo(s);
			if (o) {
				let e = document.createElement("span");
				e.textContent = o, d.bindTooltip(e);
			}
			l(d, u), c.extend([e, n]);
		}
		c.isValid() && s.fitBounds(c, {
			padding: [16, 16],
			maxZoom: 17
		});
		let u = () => (s.scrollWheelZoom.enable(), s.dragging.enable()), d = () => s.scrollWheelZoom.disable(), f = () => (d(), a && s.dragging.disable()), p = (e) => e.stopPropagation(), m = [
			["click", u],
			["focus", u],
			["blur", f],
			["mouseleave", d],
			["pointerdown", p],
			["touchstart", p],
			["wheel", p]
		];
		for (let [e, t] of m) Y(o).addEventListener(e, t, { passive: !0 });
		return () => {
			for (let [e, t] of m) Y(o).removeEventListener(e, t);
			s.remove();
		};
	});
	var s = om();
	let c;
	ga(s, (e) => W(o, e), () => Y(o)), J(() => {
		ra(s, "aria-label", a()), c = Hi(s, "", c, { height: `${t.height ?? ""}px` });
	}), Z(e, s), tt();
}
// src/pages/ChargeDetail.svelte
var cm = /* @__PURE__ */ X("<span class=\"caption svelte-1d50lj3\">Cloud times</span>"), lm = /* @__PURE__ */ X("<span class=\"caption svelte-1d50lj3\">Estimated</span>"), um = /* @__PURE__ */ X("<p class=\"badges svelte-1d50lj3\"><!> <!></p>"), dm = /* @__PURE__ */ X("<p class=\"d-sub\"> </p> <!>", 1), fm = /* @__PURE__ */ X(" <small class=\"svelte-1d50lj3\"> </small>", 1), pm = /* @__PURE__ */ X("<p class=\"d-note\"> </p>"), mm = /* @__PURE__ */ X("<button class=\"d-btn\" type=\"button\">Clear</button>"), hm = /* @__PURE__ */ X("<form class=\"edit svelte-1d50lj3\"><label class=\"field wide\">Location name<input required=\"\" maxlength=\"40\" class=\"svelte-1d50lj3\"/></label> <label class=\"field\">€/kWh<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" required=\"\" class=\"svelte-1d50lj3\"/></label> <label class=\"field\">Start fee<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\" class=\"svelte-1d50lj3\"/></label> <label class=\"field\">€/min<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\" class=\"svelte-1d50lj3\"/></label> <button class=\"d-btn\" type=\"submit\">Save location</button> <button class=\"d-btn\" type=\"button\">Cancel</button></form>"), gm = /* @__PURE__ */ X("<div class=\"edit svelte-1d50lj3\"><button class=\"d-btn\" type=\"button\">Save as charge location</button></div>"), _m = /* @__PURE__ */ X("<p class=\"note svelte-1d50lj3\" role=\"alert\"> </p>"), vm = /* @__PURE__ */ X("<form class=\"edit svelte-1d50lj3\"><label class=\"field\">Total paid (€)<input type=\"number\" min=\"0\" step=\"0.01\" inputmode=\"decimal\" required=\"\" class=\"svelte-1d50lj3\"/></label> <button class=\"d-btn\" type=\"submit\">Save</button> <!></form> <!> <!>", 1), ym = /* @__PURE__ */ X("<div class=\"stats svelte-1d50lj3\"><span class=\"svelte-1d50lj3\"><span class=\"d-note\">Min</span><b class=\"svelte-1d50lj3\"> </b></span> <span class=\"svelte-1d50lj3\"><span class=\"d-note\">Average</span><b class=\"svelte-1d50lj3\"> </b></span> <span class=\"svelte-1d50lj3\"><span class=\"d-note\">Max</span><b class=\"svelte-1d50lj3\"> </b></span></div> <!> <p class=\"d-note source svelte-1d50lj3\"> </p>", 1), bm = /* @__PURE__ */ X("<p class=\"d-msg\">Not enough readings for a speed curve</p>"), xm = /* @__PURE__ */ X("<p class=\"d-msg\">No readings from the car during this charge</p>"), Sm = /* @__PURE__ */ X("<p class=\"d-msg\">No readings from the cloud for this charge</p>"), Cm = /* @__PURE__ */ X("<section class=\"d-card hero svelte-1d50lj3\"><span class=\"d-note\">Added</span> <span class=\"big svelte-1d50lj3\"> <!></span> <!> <div class=\"levels svelte-1d50lj3\"><span class=\"svelte-1d50lj3\"><span class=\"d-note\">Start</span><b class=\"svelte-1d50lj3\"> </b></span> <span class=\"end svelte-1d50lj3\"><span class=\"d-note\">End</span><b class=\"svelte-1d50lj3\"> </b></span></div></section> <!> <div class=\"d-figs three\"></div> <section class=\"d-card\"><div class=\"d-head\"><h2>Cost</h2><b class=\"amount svelte-1d50lj3\"> </b></div> <!> <!></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Charging speed</h2><span class=\"d-note\">kW against charge level</span></div> <!></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Battery energy</h2><span class=\"d-note\">from the car, kWh</span></div> <!></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Charge level</h2><span class=\"d-note\">from the cloud, %</span></div> <!></section> <section class=\"d-card\"><dl class=\"d-rows foot\"><div><dt>Outside temperature</dt><dd> </dd></div></dl></section>", 1);
function wm(e, t) {
	et(t, !0);
	let n = xa(t, "isAdmin", 3, !1), r = /* @__PURE__ */ U(null), i = /* @__PURE__ */ U(""), a = /* @__PURE__ */ U(null), o = /* @__PURE__ */ U(""), s = /* @__PURE__ */ U(!1), c = /* @__PURE__ */ H(() => Y(r)?.charge), l = /* @__PURE__ */ H(() => Y(r)?.cost?.spot == null && Y(c)?.lat != null), u = /* @__PURE__ */ H(() => Y(c)?.energy_source === "soc_estimate"), d = /* @__PURE__ */ H(() => Y(r) ? Rc(Y(r).series) : null), f = /* @__PURE__ */ H(() => Y(r) ? Vc(Y(r).series, Y(r).capacity_wh) : null), p = /* @__PURE__ */ H(() => {
		if (!Y(f)) return null;
		let e = Y(f).x.map((e, t) => t).sort((e, t) => Y(f).x[e] - Y(f).x[t]);
		return {
			x: e.map((e) => Y(f).x[e]),
			kw: e.map((e) => Y(f).kw[e])
		};
	}), h = /* @__PURE__ */ H(() => Y(c) ? es(fs(Y(c).added_wh, Y(u))) : ["–", ""]), g = /* @__PURE__ */ H(() => Y(c) ? [
		gs("Duration", ts(Y(c).duration_s)),
		gs("Average power", es(ja(Y(c).avg_w))),
		gs("Range added", Y(c).range_added_m == null ? ["–", ""] : es(`~${ka(Y(c).range_added_m)}`))
	] : []), _ = (e, t) => t == null ? Aa(e) : `${Aa(e)} · ${Math.round(t)} %`, v = (e) => {
		let t = e.values.filter((e) => e != null);
		return t.length ? `${t[0]} to ${t[t.length - 1]}` : "–";
	}, y = (e) => {
		W(r, e, !0), W(i, e.cost?.basis === "receipt" ? String(e.cost.amount) : "", !0);
	};
	async function b(e, t) {
		W(o, ""), W(s, !0);
		let n = !0;
		try {
			await e();
		} catch (e) {
			n = !1, W(o, e.detail || `Could not save (${e.message})`, !0);
		}
		return await t(), Wo(), W(s, !1), n;
	}
	let x = (e, n) => b(() => m("PUT", `charges/${encodeURIComponent(t.vid)}/${Y(c).start}/receipt`, { amount: e }), n);
	async function S(e, n) {
		e.preventDefault();
		let { name: r, per_kwh: i, start_fee: o, per_min: s } = Y(a), l = {
			vehicle_id: t.vid,
			start: Y(c).start,
			name: r,
			per_kwh: Number(i),
			start_fee: Number(o),
			per_min: Number(s)
		};
		await b(() => m("POST", "spots", l), n) && W(a, null);
	}
	{
		let m = (e) => {
			Fe();
			var t = Kr();
			J((e) => Q(t, e), [() => ds(Y(c))]), Z(e, t);
		}, b = (e) => {
			var t = dm(), n = vn(t), r = K(n, !0), i = q(n, 2), a = (e) => {
				var t = um(), n = G(t), r = (e) => {
					Z(e, cm());
				};
				$(n, (e) => {
					Y(c).times_source === "cloud" && e(r);
				});
				var i = q(n, 2), a = (e) => {
					Z(e, lm());
				};
				$(i, (e) => {
					Y(u) && e(a);
				}), B(t), Z(e, t);
			};
			$(i, (e) => {
				(Y(c).times_source === "cloud" || Y(u)) && e(a);
			}), J((e) => Q(r, e), [() => ls(Y(c).start, Y(c).end)]), Z(e, t);
		}, C = (e, t = D, u = D) => {
			var m = Cm(), y = vn(m), b = q(G(y), 2), C = G(b, !0), ee = q(C), te = (e) => {
				var t = fm(), n = vn(t, !0);
				n.nodeValue = " ";
				var r = K(q(n), !0);
				J(() => Q(r, Y(h)[1])), Z(e, t);
			};
			$(ee, (e) => {
				Y(h)[1] && e(te);
			}), B(b);
			var w = q(b, 2);
			Is(w, {
				get from() {
					return Y(c).start_pct;
				},
				get to() {
					return Y(c).end_pct;
				},
				full: !0
			});
			var T = q(w, 2), E = G(T), ne = K(q(G(E)), !0);
			B(E);
			var O = q(E, 2), k = K(q(G(O)), !0);
			B(O), B(T), B(y);
			var re = q(y, 2), A = (e) => {
				{
					let t = /* @__PURE__ */ H(() => [{
						lat: Y(c).lat,
						lon: Y(c).lon,
						kind: "charge"
					}]);
					sm(e, {
						get dots() {
							return Y(t);
						},
						height: 180
					});
				}
			};
			$(re, (e) => {
				Y(c).lat != null && Y(c).lon != null && e(A);
			});
			var j = q(re, 2);
			hi(j, 21, () => Y(g), (e) => e.label, (e, t) => {
				im(e, ba(() => Y(t), { size: "small" }));
			}), B(j);
			var ie = q(j, 2), M = G(ie), N = K(q(G(M)), !0);
			B(M);
			var P = q(M, 2), F = (e) => {
				var t = pm(), n = K(t, !0);
				J((e) => Q(n, e), [() => ws(Y(r).cost)]), Z(e, t);
			};
			$(P, (e) => {
				(Y(c).end != null || Y(r).cost.amount != null) && e(F);
			});
			var ae = q(P, 2), oe = (e) => {
				var t = vm(), n = vn(t), c = G(n), d = q(G(c));
				ea(d), B(c);
				var f = q(c, 2), p = q(f, 2), m = (e) => {
					var t = mm();
					J(() => t.disabled = Y(s)), Fr("click", t, () => x(null, u())), Z(e, t);
				};
				$(p, (e) => {
					Y(r).cost.basis === "receipt" && e(m);
				}), B(n);
				var h = q(n, 2), g = (e) => {
					var t = qr(), n = vn(t), r = (e) => {
						var t = hm(), n = G(t), r = q(G(n));
						ea(r), B(n);
						var i = q(n, 2), o = q(G(i));
						ea(o), B(i);
						var c = q(i, 2), l = q(G(c));
						ea(l), B(c);
						var d = q(c, 2), f = q(G(d));
						ea(f), B(d);
						var p = q(d, 2), m = q(p, 2);
						B(t), J(() => p.disabled = Y(s)), Pr("submit", t, (e) => S(e, u())), sa(r, () => Y(a).name, (e) => Y(a).name = e), sa(o, () => Y(a).per_kwh, (e) => Y(a).per_kwh = e), sa(l, () => Y(a).start_fee, (e) => Y(a).start_fee = e), sa(f, () => Y(a).per_min, (e) => Y(a).per_min = e), Fr("click", m, () => W(a, null)), Z(e, t);
					}, i = (e) => {
						var t = gm();
						Fr("click", K(t), () => W(a, {
							name: "",
							per_kwh: "",
							start_fee: "",
							per_min: ""
						}, !0)), Z(e, t);
					};
					$(n, (e) => {
						Y(a) ? e(r) : e(i, -1);
					}), Z(e, t);
				};
				$(h, (e) => {
					Y(l) && e(g);
				});
				var _ = q(h, 2), v = (e) => {
					var t = _m(), n = K(t, !0);
					J(() => Q(n, Y(o))), Z(e, t);
				};
				$(_, (e) => {
					Y(o) && e(v);
				}), J(() => f.disabled = Y(s)), Pr("submit", n, (e) => {
					e.preventDefault(), x(Number(Y(i)), u());
				}), sa(d, () => Y(i), (e) => W(i, e)), Z(e, t);
			};
			$(ae, (e) => {
				n() && e(oe);
			}), B(ie);
			var se = q(ie, 2), ce = q(G(se), 2), le = (e) => {
				var t = ym(), n = vn(t), r = G(n), i = K(q(G(r)), !0);
				B(r);
				var a = q(r, 2), o = K(q(G(a)), !0);
				B(a);
				var s = q(a, 2), l = K(q(G(s)), !0);
				B(s), B(n);
				var u = q(n, 2);
				{
					let e = /* @__PURE__ */ H(() => os(Y(f).min)), t = /* @__PURE__ */ H(() => ja(Y(c).avg_w)), n = /* @__PURE__ */ H(() => os(Y(f).max)), r = /* @__PURE__ */ H(() => [{
						label: "kW",
						values: Y(p).kw,
						kind: "area",
						color: "--charge"
					}]);
					Xp(u, {
						get x() {
							return Y(p).x;
						},
						xlabel: "Charge level (%)",
						get label() {
							return `Charging speed against charge level, minimum ${Y(e) ?? ""}, average ${Y(t) ?? ""}, maximum ${Y(n) ?? ""}`;
						},
						get series() {
							return Y(r);
						}
					});
				}
				var d = K(q(u, 2), !0);
				J((e, t, n) => {
					Q(i, e), Q(o, t), Q(l, n), Q(d, Y(f).source === "cloud" ? "From the cloud's charge level, every 6 min, smoothed" : "From the car's battery readings");
				}, [
					() => os(Y(f).min),
					() => ja(Y(c).avg_w),
					() => os(Y(f).max)
				]), Z(e, t);
			}, ue = (e) => {
				Z(e, bm());
			};
			$(ce, (e) => {
				Y(p) ? e(le) : e(ue, -1);
			}), B(se);
			var de = q(se, 2), fe = q(G(de), 2), pe = (e) => {
				{
					let t = /* @__PURE__ */ H(() => v(Y(d).car.series[0])), n = /* @__PURE__ */ H(() => Y(d).car.series.map((e) => ({
						...e,
						color: "--energy"
					})));
					Xp(e, {
						get x() {
							return Y(d).car.x;
						},
						time: !0,
						height: 160,
						get label() {
							return `Battery energy from the car, ${Y(t) ?? ""} kWh`;
						},
						get series() {
							return Y(n);
						}
					});
				}
			}, me = (e) => {
				Z(e, xm());
			};
			$(fe, (e) => {
				Y(d)?.car ? e(pe) : e(me, -1);
			}), B(de);
			var he = q(de, 2), ge = q(G(he), 2), _e = (e) => {
				{
					let t = /* @__PURE__ */ H(() => v(Y(d).cloud.series[0])), n = /* @__PURE__ */ H(() => Y(d).cloud.series.map((e, t) => ({
						...e,
						color: t ? "--muted" : "--charge"
					})));
					Xp(e, {
						get x() {
							return Y(d).cloud.x;
						},
						time: !0,
						height: 160,
						get label() {
							return `Charge level from the cloud, ${Y(t) ?? ""} %`;
						},
						get series() {
							return Y(n);
						}
					});
				}
			}, ve = (e) => {
				Z(e, Sm());
			};
			$(ge, (e) => {
				Y(d)?.cloud ? e(_e) : e(ve, -1);
			}), B(he);
			var ye = q(he, 2), be = G(ye), xe = G(be), Se = K(q(G(xe)), !0);
			B(xe), B(be), B(ye), J((e, t, n, r) => {
				Q(C, Y(h)[0]), Q(ne, e), Q(k, t), Q(N, n), Q(Se, r);
			}, [
				() => _(Y(c).start_wh, Y(c).start_pct),
				() => _(Y(c).end_wh, Y(c).end_pct),
				() => Cs(Y(r).cost),
				() => hs(Y(r).outside_temp_c)
			]), Z(e, m);
		}, ee = /* @__PURE__ */ H(() => `charges/${encodeURIComponent(t.vid)}/${t.start}`);
		tm(e, {
			get url() {
				return Y(ee);
			},
			noun: "charge",
			accent: "--charge-text",
			onloaded: y,
			title: m,
			subtitle: b,
			body: C,
			$$slots: {
				title: !0,
				subtitle: !0,
				body: !0
			}
		});
	}
	tt();
}
Ir(["click"]);
// src/pages/TripDetail.svelte
var Tm = /* @__PURE__ */ X("<p class=\"d-sub\"> </p>"), Em = /* @__PURE__ */ X("<span class=\"d-note\"> </span>"), Dm = /* @__PURE__ */ X("<p class=\"d-note\">From your car's cloud data, approximate</p>"), Om = /* @__PURE__ */ X("<div class=\"big\"> <small>/ 100</small></div>"), km = /* @__PURE__ */ X("<div><dt> </dt><dd> </dd></div>"), Am = /* @__PURE__ */ X("<i></i>"), jm = /* @__PURE__ */ X("<li class=\"svelte-5xbjqg\"><i class=\"swatch svelte-5xbjqg\"></i><span class=\"n svelte-5xbjqg\"> </span><span> </span><span class=\"pc svelte-5xbjqg\"> </span></li>"), Mm = /* @__PURE__ */ X("<dl class=\"d-rows\"><div><dt>Standing</dt><dd> </dd></div></dl>"), Nm = /* @__PURE__ */ X("<section class=\"d-card\"><div class=\"d-head\"><h2>Driving style</h2><span class=\"d-note\"> </span></div> <!> <dl class=\"d-rows\"></dl> <div class=\"d-head bandhead\"><h2>Speed bands</h2><span class=\"d-note\">km/h · kWh/100 km · share</span></div> <div class=\"share-bar\" role=\"img\"></div> <ul class=\"bands svelte-5xbjqg\"></ul> <!></section>"), Pm = /* @__PURE__ */ X("<p class=\"d-msg\">No consumption data</p>"), Fm = /* @__PURE__ */ X("<p class=\"d-msg\">No speed data</p>"), Im = /* @__PURE__ */ X("<section class=\"d-card\"><div class=\"d-head\"><h2>Consumption</h2><span class=\"d-note\">kWh per 0.5 km</span></div> <!> <dl class=\"d-rows\"><div><dt>Battery</dt><dd> </dd></div> <div><dt>Net</dt><dd> </dd></div> <div><dt>Gross</dt><dd> </dd></div> <div><dt>Recuperated</dt><dd> </dd></div></dl></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Speed</h2><span class=\"d-note\"> </span></div> <!></section>", 1), Lm = /* @__PURE__ */ X("<div class=\"cmp svelte-5xbjqg\"><div class=\"line svelte-5xbjqg\"><span> </span> <b> </b></div> <div class=\"track svelte-5xbjqg\" aria-hidden=\"true\"><i class=\"usual svelte-5xbjqg\"></i><i class=\"dot svelte-5xbjqg\"></i></div> <span class=\"d-note\"> </span></div>"), Rm = /* @__PURE__ */ X("<section class=\"d-card\"><h2>Compared with your usual route</h2> <p class=\"d-note\"> </p> <!></section>"), zm = /* @__PURE__ */ X("<!> <div class=\"d-figs\"><!> <!></div> <!> <!> <!> <!> <section class=\"d-card\"><dl class=\"d-rows foot\"><div><dt>Battery</dt><dd> </dd></div> <div><dt>Outside temperature</dt><dd> </dd></div> <div><dt>Odometer</dt><dd> </dd></div></dl></section>", 1);
function Bm(e, t) {
	et(t, !0);
	let n = (e) => e == null ? null : (e / 1e3).toFixed(2), r = (e) => e == null ? null : e.toFixed(0), i = (e) => e == null ? "–" : `${Math.round(e)} km/h`, a = {
		accel: "--trip",
		brake: "--trip-text",
		corner: "--muted"
	}, o = [
		.4,
		.45,
		.6,
		.8,
		1
	];
	{
		let s = (e, t) => {
			let n = () => (t?.()).trip;
			Fe();
			var r = Kr();
			J((e) => Q(r, e), [() => ps(n())]), Z(e, r);
		}, c = (e, t) => {
			let n = () => (t?.()).trip;
			var r = Tm(), i = K(r, !0);
			J((e) => Q(i, e), [() => ls(n().start, n().end)]), Z(e, r);
		}, l = (e, t = D) => {
			let s = /* @__PURE__ */ H(() => t().trip), c = /* @__PURE__ */ H(() => zc(t().series, .5)), l = /* @__PURE__ */ H(() => Ic(t().series)?.speed), u = /* @__PURE__ */ H(() => (t().series?.events ?? []).map(([e, t]) => ({
				x: e,
				color: a[t]
			}))), d = /* @__PURE__ */ H(() => Y(s).style), f = /* @__PURE__ */ H(() => Y(d) ? bs(Y(d).bands, .5) : []), p = /* @__PURE__ */ H(() => Y(s).avg_speed_mps == null ? null : Y(s).avg_speed_mps * 3.6), m = /* @__PURE__ */ H(() => Y(s).max_speed_mps == null ? null : Y(s).max_speed_mps * 3.6), h = /* @__PURE__ */ H(() => Fa(Y(s).wh_per_100km)), g = /* @__PURE__ */ H(() => rs(Y(s), t().similar)), _ = /* @__PURE__ */ H(() => [
				gs("Distance", es(ka(Y(s).distance_m))),
				gs("Duration", ts(Y(s).duration_s)),
				gs("Energy used", es(Aa(Y(s).net_wh))),
				gs("Average", Y(h) == null ? ["–", ""] : [Y(h).toFixed(1), "kWh/100 km"]),
				gs("Average speed", Y(p) == null ? ["–", ""] : [Y(p).toFixed(0), "km/h"]),
				gs("Recuperated", es(Aa(Y(s).recup_wh)))
			]), v = /* @__PURE__ */ H(() => Y(g) ? [{
				name: "Time",
				m: Y(g).duration,
				unit: "min",
				digits: 0,
				text: (e) => `${Math.round(e)} min`
			}, {
				name: "Energy",
				m: Y(g).consumption,
				unit: "kWh/100 km",
				digits: 1,
				text: (e) => `${e.toFixed(1)} kWh/100 km`
			}].filter((e) => e.m) : []);
			var y = zm(), b = vn(y), x = (e) => {
				let n = /* @__PURE__ */ H(() => {
					let [e, n] = [t().route[0], t().route.at(-1)];
					return {
						a: e,
						z: n
					};
				});
				{
					let r = /* @__PURE__ */ H(() => [{
						points: t().route,
						kind: "trip"
					}]), i = /* @__PURE__ */ H(() => [{
						lat: Y(n).a[0],
						lon: Y(n).a[1],
						kind: "trip",
						role: "start"
					}, {
						lat: Y(n).z[0],
						lon: Y(n).z[1],
						kind: "trip",
						role: "end"
					}]), a = /* @__PURE__ */ H(() => ms(Y(s)));
					sm(e, {
						get lines() {
							return Y(r);
						},
						get dots() {
							return Y(i);
						},
						get label() {
							return Y(a);
						},
						height: 240
					});
				}
			};
			$(b, (e) => {
				t().route?.length >= 2 && e(x);
			});
			var S = q(b, 2), C = G(S);
			hi(C, 17, () => Y(_), (e) => e.label, (e, t) => {
				im(e, ba(() => Y(t)));
			});
			var ee = q(C, 2);
			{
				let e = /* @__PURE__ */ H(() => Ss(t().cost.total));
				im(ee, {
					label: "Cost",
					get value() {
						return Y(e);
					},
					children: (e, n) => {
						var r = qr(), i = vn(r), a = (e) => {
							var n = Em(), r = K(n, !0);
							J((e) => Q(r, e), [() => Ts(t().cost)]), Z(e, n);
						}, o = /* @__PURE__ */ H(() => Ts(t().cost));
						$(i, (e) => {
							Y(o) && e(a);
						}), Z(e, r);
					},
					$$slots: { default: !0 }
				});
			}
			B(S);
			var te = q(S, 2), w = (e) => {
				Z(e, Dm());
			};
			$(te, (e) => {
				Y(s).approx && e(w);
			});
			var T = q(te, 2), E = (e) => {
				var t = Nm(), n = G(t), r = K(q(G(n)), !0);
				B(n);
				var i = q(n, 2), a = (e) => {
					var t = Om(), n = G(t, !0);
					Fe(), B(t), J(() => Q(n, Y(d).score)), Z(e, t);
				};
				$(i, (e) => {
					Y(d).score != null && e(a);
				});
				var c = q(i, 2);
				hi(c, 21, () => _s, ([e, t]) => e, (e, t) => {
					var n = /* @__PURE__ */ H(() => re(Y(t), 2));
					let r = () => Y(n)[0], i = () => Y(n)[1];
					var a = km(), o = G(a), c = K(o, !0), l = K(q(o));
					B(a), J((e) => {
						Q(c, i()), Q(l, `${Y(d)[r()][0] ?? ""} · ${e ?? ""}`);
					}, [() => ys(Y(d)[r()][0], Y(s).distance_m / 1e3)]), Z(e, a);
				}), B(c);
				var l = q(c, 4);
				hi(l, 23, () => Y(f), (e) => e.name, (e, t, n) => {
					var r = qr(), i = vn(r), a = (e) => {
						var r = Am();
						let i;
						J(() => i = Hi(r, "", i, {
							flex: `${Y(t).share ?? ""} 1 0`,
							background: "var(--trip)",
							opacity: o[Y(n)]
						})), Z(e, r);
					};
					$(i, (e) => {
						Y(t).share > 0 && e(a);
					}), Z(e, r);
				}), B(l);
				var u = q(l, 2);
				hi(u, 23, () => Y(f), (e) => e.name, (e, t, n) => {
					var r = jm(), i = G(r);
					let a;
					var s = q(i), c = K(s, !0), l = q(s), u = K(l, !0), d = K(q(l));
					B(r), J((e, r) => {
						a = Hi(i, "", a, { opacity: o[Y(n)] }), Q(c, Y(t).name), Q(u, e), Q(d, `${r ?? ""} %`);
					}, [() => Y(t).kwhPer100 == null ? "–" : Y(t).kwhPer100.toFixed(1), () => Math.round(Y(t).share * 100)]), Z(e, r);
				}), B(u);
				var p = q(u, 2), m = (e) => {
					var t = Mm(), n = G(t), r = K(q(G(n)), !0);
					B(n), B(t), J((e) => Q(r, e), [() => Aa(Y(d).standing)]), Z(e, t);
				};
				$(p, (e) => {
					Y(d).standing != null && e(m);
				}), B(t), J((e, t) => {
					Q(r, e), ra(l, "aria-label", `Distance by speed band: ${t ?? ""}`);
				}, [() => vs(Y(d).score), () => Y(f).map((e) => `${e.name} km/h ${Math.round(e.share * 100)} %`).join(", ")]), Z(e, t);
			};
			$(T, (e) => {
				Y(d) && e(E);
			});
			var ne = q(T, 2), O = (e) => {
				var t = Im(), r = vn(t), a = q(G(r), 2), o = (e) => {
					{
						let t = /* @__PURE__ */ H(() => Aa(Y(s).net_wh)), n = /* @__PURE__ */ H(() => Aa(Y(s).gross_wh)), r = /* @__PURE__ */ H(() => Aa(Y(s).recup_wh)), i = /* @__PURE__ */ H(() => [
							{
								label: "Gross",
								values: Y(c).gross,
								color: "--muted"
							},
							{
								label: "Net",
								values: Y(c).net,
								color: "--trip"
							},
							{
								label: "Recuperated",
								values: Y(c).recup,
								color: "--good",
								dash: !0
							}
						]);
						Xp(e, {
							get x() {
								return Y(c).x;
							},
							xlabel: "km",
							get label() {
								return `Consumption per 0.5 km: net ${Y(t) ?? ""}, gross ${Y(n) ?? ""}, recuperated ${Y(r) ?? ""}`;
							},
							get series() {
								return Y(i);
							}
						});
					}
				}, d = (e) => {
					Z(e, Pm());
				};
				$(a, (e) => {
					Y(c) ? e(o) : e(d, -1);
				});
				var f = q(a, 2), h = G(f), g = K(q(G(h)), !0);
				B(h);
				var _ = q(h, 2), v = K(q(G(_)), !0);
				B(_);
				var y = q(_, 2), b = K(q(G(y)), !0);
				B(y);
				var x = q(y, 2), S = K(q(G(x)), !0);
				B(x), B(f), B(r);
				var C = q(r, 2), ee = G(C), te = K(q(G(ee)));
				B(ee);
				var w = q(ee, 2), T = (e) => {
					{
						let t = /* @__PURE__ */ H(() => i(Y(m))), n = /* @__PURE__ */ H(() => i(Y(p))), r = /* @__PURE__ */ H(() => Y(u).length ? `, ${Y(u).length} driving events marked` : ""), a = /* @__PURE__ */ H(() => Y(l).series.map((e) => ({
							...e,
							kind: "area",
							color: "--trip"
						})));
						Xp(e, {
							get x() {
								return Y(l).x;
							},
							xlabel: "km",
							get label() {
								return `Speed over distance, maximum ${Y(t) ?? ""}, average ${Y(n) ?? ""}${Y(r) ?? ""}`;
							},
							get marks() {
								return Y(u);
							},
							get series() {
								return Y(a);
							}
						});
					}
				}, E = (e) => {
					Z(e, Fm());
				};
				$(w, (e) => {
					Y(l) ? e(T) : e(E, -1);
				}), B(C), J((e, t, n, r, i, a) => {
					Q(g, e), Q(v, t), Q(b, n), Q(S, r), Q(te, `max ${i ?? ""} · average ${a ?? ""}`);
				}, [
					() => ss(n(Y(s).start_wh), n(Y(s).end_wh), "kWh"),
					() => Aa(Y(s).net_wh),
					() => Aa(Y(s).gross_wh),
					() => Aa(Y(s).recup_wh),
					() => i(Y(m)),
					() => i(Y(p))
				]), Z(e, t);
			};
			$(ne, (e) => {
				Y(s).approx || e(O);
			});
			var k = q(ne, 2), A = (e) => {
				var n = Rm(), r = q(G(n), 2), i = K(r);
				hi(q(r, 2), 17, () => Y(v), (e) => e.name, (e, t) => {
					let n = /* @__PURE__ */ H(() => as(Y(t).m.delta, Y(t).unit, Y(t).digits));
					var r = Lm(), i = G(r), a = G(i), o = K(a, !0), s = q(a, 2);
					let c;
					var l = K(s, !0);
					B(i);
					var u = q(i, 2), d = q(G(u));
					let f;
					B(u);
					var p = K(q(u, 2));
					B(r), J((e, r, i) => {
						Q(o, Y(t).name), c = Bi(s, 1, "svelte-5xbjqg", null, c, {
							good: Y(n) !== "same" && Y(t).m.delta < 0,
							worse: Y(n) !== "same" && Y(t).m.delta > 0
						}), Q(l, Y(n)), f = Hi(d, "", f, { left: e }), Q(p, `${r ?? ""} · usually ${i ?? ""}`);
					}, [
						() => `${is(Y(t).m.mine, Y(t).m.usual) ?? ""}%`,
						() => Y(t).text(Y(t).m.mine),
						() => Y(t).text(Y(t).m.usual)
					]), Z(e, r);
				}), B(n), J((e) => Q(i, `${e ?? ""}, ${t().similar.n ?? ""} earlier ${t().similar.n === 1 ? "trip" : "trips"}`), [() => ps(Y(s))]), Z(e, n);
			};
			$(k, (e) => {
				Y(v).length && e(A);
			});
			var j = q(k, 2), ie = G(j), M = G(ie), N = K(q(G(M)), !0);
			B(M);
			var P = q(M, 2), F = K(q(G(P)), !0);
			B(P);
			var ae = q(P, 2), oe = K(q(G(ae)), !0);
			B(ae), B(ie), B(j), J((e, t, n) => {
				Q(N, e), Q(F, t), Q(oe, n);
			}, [
				() => ss(r(Y(s).start_pct), r(Y(s).end_pct), "%"),
				() => hs(Y(s).avg_temp_c),
				() => ss(r(Y(s).odometer_start_km), r(Y(s).odometer_end_km), "km")
			]), Z(e, y);
		}, u = /* @__PURE__ */ H(() => `trips/${encodeURIComponent(t.vid)}/${t.start}`);
		tm(e, {
			get url() {
				return Y(u);
			},
			noun: "trip",
			accent: "--trip-text",
			title: s,
			subtitle: c,
			body: l,
			$$slots: {
				title: !0,
				subtitle: !0,
				body: !0
			}
		});
	}
	tt();
}
// src/pages/Activity.svelte
var Vm = !1, Hm = /* @__PURE__ */ X("<span class=\"svelte-hc7ao7\"> </span>"), Um = /* @__PURE__ */ X("<li class=\"svelte-hc7ao7\"><!></li>"), Wm = /* @__PURE__ */ X("<section><h2 class=\"chrome svelte-hc7ao7\"> <!></h2> <ul class=\"svelte-hc7ao7\"></ul></section>"), Gm = /* @__PURE__ */ X("<p class=\"msg\"> </p>"), Km = /* @__PURE__ */ X("<div class=\"msg\" role=\"alert\"><p>Couldn't load your activity.</p> <button class=\"btn\">Retry</button></div>"), qm = /* @__PURE__ */ X("<p class=\"msg\" aria-busy=\"true\">Loading…</p>"), Jm = /* @__PURE__ */ X("<div aria-hidden=\"true\"></div>"), Ym = /* @__PURE__ */ X("<div><div><h1 class=\"page-title\" tabindex=\"-1\">Activity</h1> <!> <!> <div class=\"filter svelte-hc7ao7\"><!></div> <div><!> <!></div> <!></div> <!></div>");
function Xm(e, t) {
	et(t, !0);
	let n = xa(t, "detail", 3, null), r = xa(t, "isAdmin", 3, !1), i = [
		{
			value: "all",
			label: "All"
		},
		{
			value: "trips",
			label: "Trips"
		},
		{
			value: "charges",
			label: "Charges"
		}
	], a = {
		all: "Your trips and charges appear here after the first drive.",
		trips: "No trips yet.",
		charges: "No charges yet."
	}, o = /* @__PURE__ */ U(sn([])), s = /* @__PURE__ */ U(null), c = /* @__PURE__ */ U(void 0), l = /* @__PURE__ */ U(void 0), u = /* @__PURE__ */ U(sn(Ro.filter)), d = /* @__PURE__ */ U(!1), p, m = /* @__PURE__ */ H(() => Po(Ro.days, Y(u))), _ = /* @__PURE__ */ H(() => n() && No({
		kind: n().kind,
		vehicle_id: n().vid,
		start: n().start
	})), v = /* @__PURE__ */ H(() => n() ? Fo(Ro.days, Ro.filter, n().kind, n().vid, n().start) : {
		prev: null,
		next: null
	}), y = (e) => n()?.kind === e.kind && n().vid === e.vehicle_id && n().start === e.start, b = (e) => {
		e.button !== 0 || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || (Lo({ detailOpen: !!n() }) === "replace" ? (e.preventDefault(), location.replace(e.currentTarget.getAttribute("href"))) : Vm = !0);
	}, x = () => Vm ? history.back() : location.replace("#/activity");
	An(() => {
		Y(_) && ao.split && p?.querySelector("[aria-current=page]")?.closest("li").scrollIntoView({ block: "nearest" });
	});
	let S = "";
	An(() => {
		if (Y(_)) return void (S = Y(_));
		Vm = !1, S && p && ([...p.querySelectorAll("a")].find((e) => e.getAttribute("href") === S)?.focus({ preventScroll: !0 }), S = "");
	});
	let C = g();
	async function ee() {
		let e = C.next();
		try {
			let n = await h(`overview?view=${encodeURIComponent(t.view)}`);
			e.current && W(o, n.vehicles, !0);
		} catch {}
	}
	async function te() {
		if (r()) try {
			W(s, await h("onboarding"), !0);
		} catch {}
	}
	An(() => (Ho(t.view), ee(), te(), C.reset)), An(() => {
		let e = Ro.filter;
		if (e === Tr(() => Y(u))) return void W(d, !1);
		W(d, !0);
		let t = ho("--fade") / 2, n = setTimeout(() => (W(u, e, !0), W(d, !1)), t);
		return () => clearTimeout(n);
	}), An(() => {
		let e = () => {
			document.visibilityState === "visible" && (Wo(), ee(), te());
		}, t = setInterval(e, 6e4);
		return document.addEventListener("visibilitychange", e), () => {
			clearInterval(t), document.removeEventListener("visibilitychange", e);
		};
	}), An(() => {
		if (!Y(l) || Ro.next == null || Ro.loading || Ro.error) return;
		let e = new IntersectionObserver(([e]) => e.isIntersecting && Uo(), { rootMargin: "400px" });
		return e.observe(Y(l)), () => e.disconnect();
	});
	var w = Ym();
	let T;
	var E = G(w);
	let D;
	var ne = G(E);
	ga(ne, (e) => W(c, e), () => Y(c));
	var O = q(ne, 2), k = (e) => {
		{
			let t = /* @__PURE__ */ H(f);
			ic(e, {
				get checklist() {
					return Y(s);
				},
				get places() {
					return Y(t);
				},
				reload: te,
				get gone() {
					return Y(c);
				}
			});
		}
	}, re = /* @__PURE__ */ H(() => Y(s) && Zo(r(), Y(s), f()));
	$(O, (e) => {
		Y(re) && e(k);
	});
	var A = q(O, 2);
	cc(A, { get vehicles() {
		return Y(o);
	} });
	var j = q(A, 2);
	fc(G(j), {
		get options() {
			return i;
		},
		label: "Show",
		get value() {
			return Ro.filter;
		},
		set value(e) {
			Ro.filter = e;
		}
	}), B(j);
	var ie = q(j, 2);
	let M;
	var N = G(ie);
	hi(N, 17, () => Y(m), (e) => e.date, (e, t) => {
		let n = /* @__PURE__ */ H(() => Pa(Y(t).summary));
		var r = Wm(), i = G(r), a = G(i, !0), o = q(a), s = (e) => {
			var t = Hm(), r = K(t);
			J(() => Q(r, ` · ${Y(n) ?? ""}`)), Z(e, t);
		};
		$(o, (e) => {
			Y(n) && e(s);
		}), B(i);
		var c = q(i, 2);
		hi(c, 21, () => Y(t).items, (e) => `${e.kind}/${e.vehicle_id}/${e.start}`, (e, t) => {
			var n = Um(), r = G(n), i = (e) => {
				{
					let n = /* @__PURE__ */ H(() => y(Y(t)));
					Pc(e, {
						get item() {
							return Y(t);
						},
						get current() {
							return Y(n);
						},
						onclick: b
					});
				}
			}, a = (e) => {
				{
					let n = /* @__PURE__ */ H(() => y(Y(t)));
					Vs(e, {
						get item() {
							return Y(t);
						},
						get current() {
							return Y(n);
						},
						onclick: b
					});
				}
			};
			$(r, (e) => {
				Y(t).kind === "trip" ? e(i) : e(a, -1);
			}), B(n), Z(e, n);
		}), B(c), B(r), J((e) => Q(a, e), [() => eo(Y(t).date, Ro.today)]), Z(e, r);
	});
	var P = q(N, 2), F = (e) => {
		var t = Gm(), n = K(t, !0);
		J(() => Q(n, a[Y(u)])), Z(e, t);
	};
	$(P, (e) => {
		Y(m).length || Ro.loading || Ro.error || Ro.next != null || e(F);
	}), B(ie), ga(ie, (e) => p = e, () => p);
	var ae = q(ie, 2), oe = (e) => {
		var n = Km(), r = q(G(n), 2);
		B(n), Fr("click", r, () => Ro.days.length ? Uo() : Ho(t.view)), Z(e, n);
	}, se = (e) => {
		Z(e, qm());
	}, ce = (e) => {
		var t = Jm();
		ga(t, (e) => W(l, e), () => Y(l)), Z(e, t);
	};
	$(ae, (e) => {
		Ro.error ? e(oe) : Ro.loading ? e(se, 1) : Ro.next != null && e(ce, 2);
	}), B(E);
	var le = q(E, 2), ue = (e) => {
		xc(e, {
			get id() {
				return Y(_);
			},
			onclose: x,
			get prev() {
				return Y(v).prev;
			},
			get next() {
				return Y(v).next;
			},
			children: (e, t) => {
				var i = qr(), a = vn(i), o = (e) => {
					Bm(e, {
						get vid() {
							return n().vid;
						},
						get start() {
							return n().start;
						}
					});
				}, s = (e) => {
					wm(e, {
						get vid() {
							return n().vid;
						},
						get start() {
							return n().start;
						},
						get isAdmin() {
							return r();
						}
					});
				};
				$(a, (e) => {
					n().kind === "trip" ? e(o) : e(s, -1);
				}), Z(e, i);
			},
			$$slots: { default: !0 }
		});
	};
	$(le, (e) => {
		n() && e(ue);
	}), B(w), J(() => {
		T = Bi(w, 1, "split svelte-hc7ao7", null, T, { two: ao.split && n() }), D = Bi(E, 1, "page svelte-hc7ao7", null, D, { wide: ao.wide }), M = Bi(ie, 1, "list svelte-hc7ao7", null, M, { out: Y(d) });
	}), Z(e, w), tt();
}
Ir(["click"]);
// src/pages/settings/FixedCosts.svelte
var Zm = /* @__PURE__ */ X("<div class=\"row split\"><span> <br/><span class=\"muted\"> </span></span> <button type=\"button\" class=\"danger press\">Delete</button></div> <form class=\"row split\"><label class=\"grow inline\">End date <input name=\"end\" type=\"date\"/></label> <button class=\"press\" type=\"submit\">Save</button></form>", 1), Qm = /* @__PURE__ */ X("<p class=\"row muted\">No fixed costs.</p>"), $m = /* @__PURE__ */ X("<option> </option>"), eh = /* @__PURE__ */ X("<form class=\"row fields\"><label class=\"field wide\">Name<input required=\"\" maxlength=\"40\"/></label> <label class=\"field\">Amount (€)<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" required=\"\"/></label> <label class=\"field\">Period<select></select></label> <label class=\"field\">Start<input type=\"date\" required=\"\"/></label> <label class=\"field\">End (optional)<input type=\"date\"/></label> <button class=\"press\" type=\"submit\">Add</button> <button class=\"press\" type=\"button\">Cancel</button></form>"), th = /* @__PURE__ */ X("<div class=\"row\"><button class=\"press\" type=\"button\">Add fixed cost</button></div>"), nh = /* @__PURE__ */ X("<h3> </h3> <div class=\"list card\"><!> <!></div>", 1), rh = /* @__PURE__ */ X("<h2>Fixed costs</h2> <p class=\"note caption\">Monthly card fees, insurance and the like. Empty the end date to run a cost on.</p> <!>", 1);
function ih(e, t) {
	et(t, !0);
	let n = [
		"month",
		"quarter",
		"year",
		"once"
	], r = () => ({
		name: "",
		amount: "",
		period: "month",
		start: Xa(),
		end: ""
	}), i = /* @__PURE__ */ U(null), a = /* @__PURE__ */ U(sn(r())), o = /* @__PURE__ */ U(!1), s = (e) => t.data.prices.fixed_costs.filter((t) => t.vehicle_id === e);
	function c(e) {
		W(a, r(), !0), W(i, e, !0);
	}
	async function l(e) {
		e.preventDefault();
		let n = {
			name: Y(a).name,
			amount: Number(Y(a).amount),
			period: Y(a).period,
			start: Y(a).start,
			end: Y(a).end || null
		};
		W(o, !0), await t.change(() => m("POST", `vehicles/${Y(i)}/fixed_costs`, n)) && W(i, null), W(o, !1);
	}
	async function u(e, n) {
		e.preventDefault();
		let r = e.currentTarget.elements.end;
		r.value !== (n.end ?? "") && (await t.change(() => m("PUT", `fixed_costs/${n.id}`, { end: r.value || null })) || (r.value = n.end ?? ""));
	}
	let d = (e) => confirm(`Delete "${e.name}"?`) && t.change(() => m("DELETE", `fixed_costs/${e.id}`)), f = (e) => e.focus();
	var p = rh();
	hi(q(vn(p), 4), 17, () => t.data.vehicles, (e) => e.id, (e, t) => {
		var r = nh(), p = vn(r), m = K(p, !0), h = q(p, 2), g = G(h);
		hi(g, 17, () => s(Y(t).id), (e) => e.id, (e, t) => {
			var n = Zm(), r = vn(n), i = G(r), a = G(i, !0), o = K(q(a, 2));
			B(i);
			var s = q(i, 2);
			B(r);
			var c = q(r, 2), l = G(c), f = q(G(l));
			ea(f), B(l);
			var p = q(l, 2);
			B(c), J((e) => {
				Q(a, Y(t).name), Q(o, `${e ?? ""} · ${Y(t).period ?? ""} · from ${Y(t).start ?? ""}${Y(t).end ? ` to ${Y(t).end}` : ""}`), ra(s, "aria-label", `Delete ${Y(t).name}`), ra(f, "aria-label", `End date of ${Y(t).name}`), ra(f, "min", Y(t).start), ta(f, Y(t).end ?? ""), ra(p, "aria-label", `Save end date of ${Y(t).name}`);
			}, [() => Ss(Y(t).amount)]), Fr("click", s, () => d(Y(t))), Pr("submit", c, (e) => u(e, Y(t))), Z(e, n);
		}, (e) => {
			Z(e, Qm());
		});
		var _ = q(g, 2), v = (e) => {
			var t = eh(), r = G(t), s = q(G(r));
			ea(s), Pi(s, () => f), B(r);
			var c = q(r, 2), u = q(G(c));
			ea(u), B(c);
			var d = q(c, 2), p = q(G(d));
			hi(p, 21, () => n, di, (e, t) => {
				var n = $m(), r = K(n, !0), i = {};
				J(() => {
					Q(r, Y(t)), i !== (i = Y(t)) && (n.value = (n.__value = i) ?? "");
				}), Z(e, n);
			}), B(p), Ki(p), B(d);
			var m = q(d, 2), h = q(G(m));
			ea(h), B(m);
			var g = q(m, 2), _ = q(G(g));
			ea(_), B(g);
			var v = q(g, 2), y = q(v, 2);
			B(t), J(() => {
				ra(_, "min", Y(a).start), v.disabled = Y(o);
			}), Pr("submit", t, l), sa(s, () => Y(a).name, (e) => Y(a).name = e), sa(u, () => Y(a).amount, (e) => Y(a).amount = e), qi(p, () => Y(a).period, (e) => Y(a).period = e), sa(h, () => Y(a).start, (e) => Y(a).start = e), sa(_, () => Y(a).end, (e) => Y(a).end = e), Fr("click", y, () => W(i, null)), Z(e, t);
		}, y = (e) => {
			var n = th();
			Fr("click", K(n), () => c(Y(t).id)), Z(e, n);
		};
		$(_, (e) => {
			Y(i) === Y(t).id ? e(v) : e(y, -1);
		}), B(h), J(() => Q(m, Y(t).name)), Z(e, r);
	}), Z(e, p), tt();
}
Ir(["click"]);
// src/pages/settings/Prices.svelte
var ah = /* @__PURE__ */ X("<form class=\"row fields\"><label class=\"field\">€/kWh<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" required=\"\"/></label> <label class=\"field\">Start fee<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\"/></label> <label class=\"field\">€/min<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\"/></label> <label class=\"field\">Valid from<input type=\"date\" required=\"\"/></label> <button class=\"press\" type=\"submit\">Save</button> <button class=\"press\" type=\"button\">Cancel</button></form>"), oh = /* @__PURE__ */ X("<div class=\"row split\"><span> <br/><span class=\"muted\"> </span></span> <button class=\"press\" type=\"button\">Change</button></div> <!>", 1), sh = /* @__PURE__ */ X("<form class=\"row\"><label class=\"grow\"><span class=\"sr\">Location name</span><input required=\"\" maxlength=\"40\"/></label> <button class=\"press\" type=\"submit\">Rename</button> <button type=\"button\" class=\"danger press\">Delete</button></form> <div class=\"row split\"><span class=\"muted\"> </span> <button class=\"press\" type=\"button\">Change</button></div> <!>", 1), ch = /* @__PURE__ */ X("<h3>Charge locations</h3> <div class=\"list card\"></div>", 1), lh = /* @__PURE__ */ X("<h2 id=\"prices\" tabindex=\"-1\">Prices</h2> <p class=\"note caption\">A new price counts from its date.</p> <div class=\"list card\"></div> <!>", 1);
function uh(e, t) {
	et(t, !0);
	let n = (e, t = D) => {
		var n = qr(), a = vn(n), s = (e) => {
			var t = ah(), n = G(t), a = q(G(n));
			ea(a), Pi(a, () => g), B(n);
			var s = q(n, 2), c = q(G(s));
			ea(c), B(s);
			var l = q(s, 2), u = q(G(l));
			ea(u), B(l);
			var d = q(l, 2), p = q(G(d));
			ea(p), B(d);
			var m = q(d, 2), h = q(m, 2);
			B(t), J(() => m.disabled = Y(r)), Pr("submit", t, f), sa(a, () => Y(o).per_kwh, (e) => Y(o).per_kwh = e), sa(c, () => Y(o).start_fee, (e) => Y(o).start_fee = e), sa(u, () => Y(o).per_min, (e) => Y(o).per_min = e), sa(p, () => Y(o).from, (e) => Y(o).from = e), Fr("click", h, () => W(i, null)), Z(e, t);
		};
		$(a, (e) => {
			Y(i) === t() && e(s);
		}), Z(e, n);
	}, r = /* @__PURE__ */ U(!1), i = /* @__PURE__ */ U(null), a = [], o = /* @__PURE__ */ U(sn({
		per_kwh: "",
		start_fee: "",
		per_min: "",
		from: ""
	})), s = /* @__PURE__ */ U(sn({}));
	An(() => {
		W(s, Object.fromEntries(t.data.prices.spots.map((e) => [e.id, e.name])), !0);
	});
	let c = () => Date.now(), l = (e) => e ? [
		`${Ss(e.per_kwh)}/kWh`,
		e.start_fee && `start fee ${Ss(e.start_fee)}`,
		e.per_min && `${Ss(e.per_min)}/min`
	].filter(Boolean).join(" · ") : "Not set", u = /* @__PURE__ */ H(() => [["ac", "Default AC price"], ["dc", "Default DC price"]].map(([e, n]) => ({
		id: e,
		label: n,
		list: t.data.prices[e]
	})));
	function d(e, t) {
		a = t;
		let n = ks(a, c());
		W(o, {
			per_kwh: n?.per_kwh ?? "",
			start_fee: n?.start_fee ?? "",
			per_min: n?.per_min ?? "",
			from: Xa()
		}, !0), W(i, e, !0);
	}
	async function f(e) {
		e.preventDefault();
		let n = {
			valid_from: Ds(a, Y(o).from),
			per_kwh: Number(Y(o).per_kwh),
			start_fee: Number(Y(o).start_fee),
			per_min: Number(Y(o).per_min)
		};
		W(r, !0), await t.change(() => m("PUT", `prices/${Y(i)}`, n)) && W(i, null), W(r, !1);
	}
	let p = (e) => t.change(() => m("PUT", `spots/${e.id}`, { name: Y(s)[e.id] })), h = (e) => confirm(`Delete "${e.name}"? Its charges go back to the default price.`) && t.change(() => m("DELETE", `spots/${e.id}`)), g = (e) => e.focus();
	var _ = lh(), v = q(vn(_), 4);
	hi(v, 21, () => Y(u), (e) => e.id, (e, t) => {
		var r = oh(), i = vn(r), a = G(i), o = G(a, !0), s = K(q(o, 2), !0);
		B(a);
		var u = q(a, 2);
		B(i);
		var f = q(i, 2);
		n(f, () => Y(t).id), J((e) => {
			Q(o, Y(t).label), Q(s, e), ra(u, "aria-label", `Change ${Y(t).label}`);
		}, [() => l(ks(Y(t).list, c()))]), Fr("click", u, () => d(Y(t).id, Y(t).list)), Z(e, r);
	}), B(v);
	var y = q(v, 2), b = (e) => {
		var r = ch(), i = q(vn(r), 2);
		hi(i, 21, () => t.data.prices.spots, (e) => e.id, (e, t) => {
			var r = sh(), i = vn(r), a = G(i), o = q(G(a));
			ea(o), B(a);
			var u = q(a, 2), f = q(u, 2);
			B(i);
			var m = q(i, 2), g = G(m), _ = K(g, !0), v = q(g, 2);
			B(m);
			var y = q(m, 2);
			n(y, () => Y(t).id), J((e) => {
				ra(u, "aria-label", `Rename ${Y(t).name}`), ra(f, "aria-label", `Delete ${Y(t).name}`), Q(_, e), ra(v, "aria-label", `Change price of ${Y(t).name}`);
			}, [() => l(ks(Y(t).tariffs, c()))]), Pr("submit", i, (e) => {
				e.preventDefault(), p(Y(t));
			}), sa(o, () => Y(s)[Y(t).id], (e) => Y(s)[Y(t).id] = e), Fr("click", f, () => h(Y(t))), Fr("click", v, () => d(Y(t).id, Y(t).tariffs)), Z(e, r);
		}), B(i), Z(e, r);
	};
	$(y, (e) => {
		t.data.prices.spots.length && e(b);
	}), Z(e, _), tt();
}
Ir(["click"]);
// src/pages/Settings.svelte
var dh = /* @__PURE__ */ X("<p class=\"err svelte-1ozf5k3\" role=\"alert\"> </p>"), fh = /* @__PURE__ */ X("<p class=\"note\" role=\"status\"> </p>"), ph = /* @__PURE__ */ X("<form class=\"row\"><label class=\"grow\"><span class=\"sr\">Group name</span><input required=\"\" maxlength=\"40\"/></label> <button class=\"press\" type=\"submit\">Rename</button> <button type=\"button\" class=\"danger press\">Delete</button></form>"), mh = /* @__PURE__ */ X("<p class=\"row muted\">No groups yet.</p>"), hh = /* @__PURE__ */ X("<button class=\"danger press\" type=\"button\">Keep its history</button> <button class=\"danger press\" type=\"button\">Delete everything</button> <button class=\"press\" type=\"button\">Cancel</button>", 1), gh = /* @__PURE__ */ X("<button class=\"danger press\" type=\"button\">Remove car</button>"), _h = /* @__PURE__ */ X("<option> </option>"), vh = /* @__PURE__ */ X("<label class=\"row split\"> <input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\"/></label>"), yh = /* @__PURE__ */ X("<label class=\"row split\"><span> <span class=\"muted\"> </span></span> <input type=\"checkbox\"/></label>"), bh = /* @__PURE__ */ X("<p class=\"row muted\">No users yet.</p>"), xh = /* @__PURE__ */ X("<section><h3> </h3> <div class=\"row\"><button class=\"press\" type=\"button\">Configure</button> <!></div> <div class=\"list card\"><label class=\"row split\">Cost group <select><option>No group</option><!></select></label> <!></div> <fieldset><legend>Viewers</legend> <div class=\"list card\"></div></fieldset></section>"), Sh = /* @__PURE__ */ X("<div class=\"row split\"><span> <span class=\"muted\">Archived</span></span> <button class=\"danger press\" type=\"button\">Delete history</button></div>"), Ch = /* @__PURE__ */ X("<h2>Archived</h2> <div class=\"list card\"></div>", 1), wh = /* @__PURE__ */ X("<div class=\"row\"><button class=\"press\" type=\"button\">Show getting started</button></div>"), Th = /* @__PURE__ */ X("<h2>Cost groups</h2> <div class=\"list card\"><!> <form class=\"row\"><label class=\"grow\"><span class=\"sr\">New group</span><input required=\"\" maxlength=\"40\" placeholder=\"New group\"/></label> <button class=\"press\" type=\"submit\">Add group</button></form></div> <!> <h2 id=\"cars\" tabindex=\"-1\">Cars</h2> <p class=\"note caption\">Users appear here after they open this page once. Administrators always see every car.</p> <div class=\"row\"><button class=\"press\" type=\"button\">Add car</button></div> <!> <!> <!> <!>", 1), Eh = /* @__PURE__ */ X("<p class=\"msg\">Loading…</p>"), Dh = /* @__PURE__ */ X("<div class=\"page settings svelte-1ozf5k3\"><h1 class=\"page-title\">Settings</h1> <!> <!> <!></div>");
function Oh(e, t) {
	et(t, !0);
	let n = xa(t, "section", 3, null), r = /* @__PURE__ */ U(null), i = /* @__PURE__ */ U(null), a = /* @__PURE__ */ U(""), o = /* @__PURE__ */ U(""), s = /* @__PURE__ */ U(sn({})), c = /* @__PURE__ */ U(null), l = !1, u = /* @__PURE__ */ U(!1), d = /* @__PURE__ */ U(void 0), p = /* @__PURE__ */ U(0), _ = /* @__PURE__ */ H(() => Y(p) > 0), v = g(), y = (e) => W(a, e.detail || `Could not save (${e.message})`, !0);
	async function b() {
		let e = v.next(), t = l;
		l = !1;
		try {
			let [t, n] = await Promise.all([h("settings"), h("onboarding").catch(() => null)]);
			if (!e.current) return;
			W(r, t, !0), W(i, n, !0), W(u, !1), W(s, Object.fromEntries(t.groups.map((e) => [e.id, e.name])), !0);
		} catch (n) {
			if (!e.current) return;
			qs(n, t) ? (W(u, !0), W(r, {
				...Y(r),
				vehicles: []
			}, !0)) : W(a, `Could not load (${n.message})`);
		}
	}
	async function x(e) {
		W(a, ""), rn(p);
		let t = !0;
		try {
			await e();
		} catch (e) {
			t = !1, y(e);
		}
		return await b(), rn(p, -1), t;
	}
	async function S(e, t, n) {
		let r = e.currentTarget;
		await x(t) || n(r), await Sr(), r.focus();
	}
	async function C(e, t) {
		let n = document.activeElement;
		await e(), await Sr(), (n?.isConnected ? n : t)?.focus();
	}
	let ee = () => C(async () => {
		await x(() => m("POST", "groups", { name: Y(o) })), Y(a) || W(o, "");
	}), te = (e) => C(() => x(() => m("PUT", `groups/${e.id}`, { name: Y(s)[e.id] }))), w = (e) => confirm(`Delete group "${e.name}"?`) && x(() => m("DELETE", `groups/${e.id}`)), T = (e, t, n) => () => m("PUT", `vehicles/${e.id}`, {
		group_id: t,
		viewers: n
	}), E = (e, t) => (W(c, null), C(() => x(async () => {
		let n = await m("DELETE", `vehicles/${e.id}?history=${t}`);
		l = !0, W(a, Gs(n) ?? "", !0);
	}), Y(d))), D = (e) => confirm(`Remove "${e.name}" and delete everything stored for it? This cannot be undone.`) && E(e, "delete"), ne = (e) => confirm(`Delete the stored history of "${e.name}"? This cannot be undone.`) && C(() => x(() => m("DELETE", `vehicles/${e.id}/history`)), Y(d)), O = (e) => e.focus(), k = (e, t) => () => m("PUT", `vehicles/${e.id}/card`, t), A = async () => {
		await x(() => m("PUT", "onboarding", { hidden: !1 })) && (location.hash = "#/activity");
	}, j = null;
	An(() => {
		if (!n()) j = null;
		else if (Y(r) && n() !== j) {
			j = n();
			let e = document.getElementById(n());
			e?.scrollIntoView(), e?.focus({ preventScroll: !0 });
		}
	}), b();
	var ie = Dh(), M = q(G(ie), 2), N = (e) => {
		var t = dh(), n = K(t, !0);
		J(() => Q(n, Y(a))), Z(e, t);
	};
	$(M, (e) => {
		Y(a) && e(N);
	});
	var P = q(M, 2), F = (e) => {
		var t = fh(), n = K(t, !0);
		J(() => Q(n, Ks)), Z(e, t);
	};
	$(P, (e) => {
		Y(u) && e(F);
	});
	var ae = q(P, 2), oe = (e) => {
		let t = /* @__PURE__ */ H(() => Ws(Y(r).vehicles));
		var n = Th(), a = q(vn(n), 2), l = G(a);
		hi(l, 17, () => Y(r).groups, (e) => e.id, (e, t) => {
			var n = ph(), r = G(n), i = q(G(r));
			ea(i), B(r);
			var a = q(r, 2), o = q(a, 2);
			B(n), J(() => {
				a.disabled = Y(_), ra(a, "aria-label", `Rename ${Y(t).name}`), o.disabled = Y(_), ra(o, "aria-label", `Delete ${Y(t).name}`);
			}), Pr("submit", n, (e) => {
				e.preventDefault(), te(Y(t));
			}), sa(i, () => Y(s)[Y(t).id], (e) => Y(s)[Y(t).id] = e), Fr("click", o, () => w(Y(t))), Z(e, n);
		}, (e) => {
			Z(e, mh());
		});
		var u = q(l, 2), p = G(u), m = q(G(p));
		ea(m), B(p);
		var h = q(p, 2);
		B(u), B(a);
		var g = q(a, 2);
		uh(g, {
			get data() {
				return Y(r);
			},
			change: x
		});
		var v = q(g, 6), y = G(v);
		ga(y, (e) => W(d, e), () => Y(d)), B(v);
		var b = q(v, 2);
		hi(b, 17, () => Y(t).active, (e) => e.id, (e, t) => {
			var n = xh(), i = G(n), a = K(i, !0), o = q(i, 2), s = G(o), l = q(s, 2), u = (e) => {
				var n = hh(), r = vn(n), i = q(r, 2), a = q(i, 2);
				Pi(a, () => O), J(() => {
					r.disabled = Y(_), i.disabled = Y(_);
				}), Fr("click", r, () => E(Y(t), "keep")), Fr("click", i, () => D(Y(t))), Fr("click", a, () => W(c, null)), Z(e, n);
			}, d = (e) => {
				var n = gh();
				J(() => n.disabled = Y(_)), Fr("click", n, () => W(c, Y(t).id, !0)), Z(e, n);
			};
			$(l, (e) => {
				Y(c) === Y(t).id ? e(u) : e(d, -1);
			}), B(o);
			var f = q(o, 2), p = G(f), m = q(G(p)), h = G(m);
			h.value = h.__value = "", hi(q(h), 17, () => Y(r).groups, di, (e, t) => {
				var n = _h(), r = K(n, !0), i = {};
				J(() => {
					Q(r, Y(t).name), i !== (i = Y(t).id) && (n.value = (n.__value = i) ?? "");
				}), Z(e, n);
			}), B(m);
			var g;
			Ki(m), B(p), hi(q(p, 2), 16, () => [["markup_pct", "Card markup %"], ["start_fee", "Card start fee"]], di, (e, n) => {
				var i = /* @__PURE__ */ H(() => re(n, 2));
				let a = () => Y(i)[0], o = () => Y(i)[1], s = /* @__PURE__ */ H(() => Y(r).prices.cards[Y(t).id] ?? {
					markup_pct: 0,
					start_fee: 0
				});
				var c = vh(), l = G(c), u = q(l);
				ea(u), B(c), J(() => {
					Q(l, `${o() ?? ""} `), u.disabled = Y(_), ta(u, Y(s)[a()]);
				}), Fr("change", u, (e) => S(e, k(Y(t), {
					...Y(s),
					[a()]: Number(e.currentTarget.value)
				}), (e) => e.value = Y(s)[a()])), Z(e, c);
			}), B(f);
			var v = q(f, 2), y = q(G(v), 2);
			hi(y, 21, () => Y(r).users, (e) => e.id, (e, n) => {
				var r = yh(), i = G(r), a = G(i), o = K(q(a));
				B(i);
				var s = q(i, 2);
				ea(s), B(r), J((e, t) => {
					Q(a, `${(Y(n).name || Y(n).id) ?? ""} `), Q(o, `(last seen ${e ?? ""})`), s.disabled = Y(_), na(s, t);
				}, [() => to(Y(n).last_seen), () => Y(t).viewers.includes(Y(n).id)]), Fr("change", s, (e) => {
					let r = e.currentTarget.checked;
					S(e, T(Y(t), Y(t).group_id, r ? [...Y(t).viewers, Y(n).id] : Y(t).viewers.filter((e) => e !== Y(n).id)), (e) => e.checked = !r);
				}), Z(e, r);
			}, (e) => {
				Z(e, bh());
			}), B(y), B(v), B(n), J(() => {
				Q(a, Y(t).name), s.disabled = Y(_), m.disabled = Y(_), g !== (g = Y(t).group_id ?? "") && (m.value = (m.__value = g) ?? "", Gi(m, g));
			}), Fr("click", s, () => Js(Us)), Fr("change", m, (e) => S(e, T(Y(t), e.currentTarget.value || null, Y(t).viewers), (e) => e.value = Y(t).group_id ?? "")), Z(e, n);
		});
		var C = q(b, 2), j = (e) => {
			var n = Ch(), r = q(vn(n), 2);
			hi(r, 21, () => Y(t).archived, (e) => e.id, (e, t) => {
				var n = Sh(), r = G(n), i = G(r);
				Fe(), B(r);
				var a = q(r, 2);
				B(n), J(() => {
					Q(i, `${Y(t).name ?? ""} `), a.disabled = Y(_);
				}), Fr("click", a, () => ne(Y(t))), Z(e, n);
			}), B(r), Z(e, n);
		};
		$(C, (e) => {
			Y(t).archived.length && e(j);
		});
		var ie = q(C, 2);
		ih(ie, {
			get data() {
				return Y(r);
			},
			change: x
		});
		var M = q(ie, 2), N = (e) => {
			var t = wh(), n = K(t);
			J(() => n.disabled = Y(_)), Fr("click", n, A), Z(e, t);
		}, P = /* @__PURE__ */ H(() => Y(i) && Xo(Y(i), f()));
		$(M, (e) => {
			Y(P) && e(N);
		}), J(() => {
			h.disabled = Y(_), y.disabled = Y(_);
		}), Pr("submit", u, (e) => {
			e.preventDefault(), ee();
		}), sa(m, () => Y(o), (e) => W(o, e)), Fr("click", y, () => Js(Hs)), Z(e, n);
	}, se = (e) => {
		Z(e, Eh());
	};
	$(ae, (e) => {
		Y(r) ? e(oe) : Y(a) || e(se, 1);
	}), B(ie), Z(e, ie), tt();
}
Ir(["click", "change"]);
// src/lib/stats.js
var kh = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
], Ah = (e) => (t, n, r) => `${e}?view=${encodeURIComponent(t)}&period=${n}${r ? `&at=${r}` : ""}`, jh = Ah("stats"), Mh = Ah("map"), Nh = (e, t) => e == null || !t ? null : (e - t) / t, Ph = (e) => kh[e - 1].slice(0, 3);
function Fh(e) {
	let [t, n, r] = Ja(e), i = new Date(Date.UTC(t, n - 1, r - 1));
	return [
		i.getUTCFullYear(),
		i.getUTCMonth() + 1,
		i.getUTCDate()
	];
}
function Ih(e, t, n) {
	let [r, i, a] = Ja(t);
	if (e === "year") return String(r);
	if (e === "month") return `${kh[i - 1]} ${r}`;
	let [o, s, c] = Fh(n);
	return o === r ? i === s ? `${a} – ${c} ${Ph(i)}` : `${a} ${Ph(i)} – ${c} ${Ph(s)}` : `${a} ${Ph(i)} ${r} – ${c} ${Ph(s)} ${o}`;
}
function Lh(e, t) {
	let [, n, r] = Ja(t);
	return e === "year" ? Ph(n) : String(r);
}
function Rh(e, t = 5) {
	let n = e.filter((e) => e.place != null && e.wh > 0).sort((e, t) => t.wh - e.wh), r = n.slice(t).reduce((e, t) => e + t.wh, 0) + e.filter((e) => e.place == null).reduce((e, t) => e + t.wh, 0), i = n.slice(0, t).map((e) => ({
		name: e.place,
		wh: e.wh,
		other: !1
	}));
	r > 0 && i.push({
		name: "Other",
		wh: r,
		other: !0
	});
	let a = i.reduce((e, t) => e + t.wh, 0);
	return i.map((e) => ({
		...e,
		share: e.wh / a
	}));
}
function zh(e, t) {
	let n = t?.km > 0 ? t : null, r = (e, t) => e.km > 0 ? e[t] / e.km * 10 : null, i = Object.values(e.bands).map((e) => e.kwh_per_100km), a = Math.max(0, ...i.filter((e) => e != null));
	return {
		points: e.score != null && n?.score != null ? e.score - n.score : null,
		events: _s.map(([t, i]) => {
			let a = r(e, t);
			return {
				k: t,
				name: i,
				change: n ? Nh(a, r(n, t)) : null
			};
		}),
		bands: Object.entries(e.bands).map(([e, t]) => ({
			name: e,
			value: t.kwh_per_100km,
			share: t.kwh_per_100km == null || !a ? 0 : Math.max(0, t.kwh_per_100km / a)
		}))
	};
}
var Bh = (e) => e == null ? null : {
	dir: Math.sign(e),
	text: e ? String(Math.abs(e)) : "same",
	hint: !1
}, Vh = /* @__PURE__ */ X("<div class=\"msg\" role=\"alert\"><p>Couldn't load the map.</p> <button class=\"d-btn\">Retry</button></div>"), Hh = /* @__PURE__ */ X("<p class=\"d-msg\"> </p>"), Uh = /* @__PURE__ */ X("<section class=\"d-card\"><div class=\"d-head\"><h2>Map</h2></div> <!></section>");
function Wh(e, t) {
	et(t, !0);
	let n = /* @__PURE__ */ U(void 0), r = /* @__PURE__ */ U(!1), i = /* @__PURE__ */ U(null), a = /* @__PURE__ */ U(!1), o = g();
	An(() => {
		let e = new IntersectionObserver((t) => t.some((e) => e.isIntersecting) && (W(r, !0), e.disconnect()));
		return e.observe(Y(n)), () => e.disconnect();
	});
	async function s() {
		let e = o.next();
		W(a, !1);
		try {
			let n = await h(Mh(t.view, t.period, t.at));
			if (!e.current) return;
			W(i, {
				lines: n.trips.map((e) => ({
					points: e.route,
					kind: "trip",
					href: No({
						kind: "trip",
						vehicle_id: e.vid,
						start: e.start
					})
				})),
				dots: n.charges.map((e) => ({
					lat: e.lat,
					lon: e.lon,
					kind: "charge",
					title: us(e.name),
					href: No({
						kind: "charge",
						vehicle_id: e.vid,
						start: e.start
					})
				}))
			}, !0);
		} catch {
			e.current && W(a, !0);
		}
	}
	An(() => {
		if (Y(r)) return s(), o.reset;
	});
	var c = Uh(), l = q(G(c), 2), u = (e) => {
		var t = Vh(), n = q(G(t), 2);
		B(t), Fr("click", n, s), Z(e, t);
	}, d = (e) => {
		var t = Hh(), n = K(t, !0);
		J(() => {
			ra(t, "aria-busy", Y(r)), Q(n, Y(r) ? "Loading…" : "");
		}), Z(e, t);
	}, f = (e) => {
		var n = Hh(), r = K(n);
		J(() => Q(r, `Nothing to map this ${t.period ?? ""}`)), Z(e, n);
	}, p = (e) => {
		sm(e, {
			get lines() {
				return Y(i).lines;
			},
			get dots() {
				return Y(i).dots;
			},
			height: 320
		});
	};
	$(l, (e) => {
		Y(a) ? e(u) : Y(i) ? !Y(i).lines.length && !Y(i).dots.length ? e(f, 2) : e(p, -1) : e(d, 1);
	}), B(c), ga(c, (e) => W(n, e), () => Y(n)), Z(e, c), tt();
}
Ir(["click"]);
// src/pages/Stats.svelte
var Gh = (e, t = D) => {
	var n = qh();
	let r;
	var i = G(n), a = (e) => {
		var n = Kh(), r = vn(n), i = K(r, !0), a = K(q(r), !0);
		J(() => {
			Q(i, t().dir > 0 ? "▲" : "▼"), Q(a, t().dir > 0 ? "up" : "down");
		}), Z(e, n);
	};
	$(i, (e) => {
		t().dir && e(a);
	});
	var o = q(i);
	B(n), J(() => {
		r = Bi(n, 1, "trend svelte-qardfz", null, r, {
			up: t().hint && t().dir > 0,
			down: t().hint && t().dir < 0
		}), Q(o, ` ${t().text ?? ""}`);
	}), Z(e, n);
}, Kh = /* @__PURE__ */ X("<span aria-hidden=\"true\"> </span><span class=\"sr\"> </span>", 1), qh = /* @__PURE__ */ X("<span><!> </span>"), Jh = /* @__PURE__ */ X("<div class=\"msg svelte-qardfz\" role=\"alert\"><p>Couldn't load your statistics.</p> <button class=\"d-btn\">Retry</button></div>"), Yh = /* @__PURE__ */ X("<p class=\"msg svelte-qardfz\" aria-busy=\"true\">Loading…</p>"), Xh = /* @__PURE__ */ X("<span> </span>"), Zh = /* @__PURE__ */ X("<span class=\"sub caption svelte-qardfz\"><!> <!></span>"), Qh = /* @__PURE__ */ X("<p class=\"d-note\"> </p>"), $h = /* @__PURE__ */ X("<li class=\"svelte-qardfz\"><b> </b> <span class=\"d-note facts svelte-qardfz\"><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span></span></li>"), eg = /* @__PURE__ */ X("<section class=\"d-card pv svelte-qardfz\"><h2>By car</h2> <ul class=\"svelte-qardfz\"></ul></section>"), tg = /* @__PURE__ */ X("<a class=\"press svelte-qardfz\"><span class=\"k svelte-qardfz\">Longest trip</span><span class=\"v svelte-qardfz\"> </span> <span class=\"d-note svelte-qardfz\"> </span></a>"), ng = /* @__PURE__ */ X("<div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Longest trip</span><span class=\"v svelte-qardfz\"> </span></div>"), rg = /* @__PURE__ */ X("<a class=\"press svelte-qardfz\"><span class=\"k svelte-qardfz\">Most efficient trip</span><span class=\"v svelte-qardfz\"> </span> <span class=\"d-note svelte-qardfz\"> </span></a>"), ig = /* @__PURE__ */ X("<div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Most efficient trip</span><span class=\"v svelte-qardfz\"> </span><span class=\"d-note svelte-qardfz\">Trips of at least 5 km</span></div>"), ag = /* @__PURE__ */ X("<span class=\"d-note svelte-qardfz\"> </span>"), og = /* @__PURE__ */ X("<span class=\"d-note\"> </span>"), sg = /* @__PURE__ */ X("<span class=\"d-note pts svelte-qardfz\"><!></span>"), cg = /* @__PURE__ */ X("<div class=\"big\"> <small>/ 100</small><!></div>"), lg = /* @__PURE__ */ X(" <!>", 1), ug = /* @__PURE__ */ X("<div><dt> </dt><dd> <!></dd></div>"), dg = /* @__PURE__ */ X("<li class=\"svelte-qardfz\"><span class=\"bn svelte-qardfz\"> </span><span class=\"track svelte-qardfz\"><i class=\"meter svelte-qardfz\"></i></span><span class=\"bv svelte-qardfz\"> </span></li>"), fg = /* @__PURE__ */ X("<dl class=\"d-rows\"><div><dt>Standing</dt><dd> </dd></div></dl>"), pg = /* @__PURE__ */ X("<!> <dl class=\"d-rows\"></dl> <div class=\"d-head bandhead\"><h2>Consumption by speed</h2><span class=\"d-note\">km/h · kWh/100 km</span></div> <ul class=\"bands svelte-qardfz\"></ul> <!>", 1), mg = /* @__PURE__ */ X("<p class=\"d-msg\"> </p>"), hg = /* @__PURE__ */ X("<i></i>"), gg = /* @__PURE__ */ X("<li class=\"svelte-qardfz\"><i class=\"dot svelte-qardfz\"></i><span class=\"n svelte-qardfz\"> </span><span> </span><span class=\"pc svelte-qardfz\"> </span></li>"), _g = /* @__PURE__ */ X("<div class=\"share-bar\" role=\"img\"></div> <ul class=\"svelte-qardfz\"></ul>", 1), vg = /* @__PURE__ */ X("<div><div class=\"col svelte-qardfz\"><div class=\"tiles svelte-qardfz\"><div class=\"d-figs svelte-qardfz\"></div> <!></div> <!> <section class=\"d-card hl svelte-qardfz\"><h2>Highlights</h2> <ul class=\"svelte-qardfz\"><li class=\"svelte-qardfz\"><!></li> <li class=\"svelte-qardfz\"><!></li> <li class=\"svelte-qardfz\"><div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Recuperated</span><span class=\"v svelte-qardfz\"> </span> <!></div></li> <li class=\"svelte-qardfz\"><div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Cost</span><span class=\"v svelte-qardfz\"> </span> <span class=\"d-note cost svelte-qardfz\"> <!><!> <!></span></div></li></ul></section> <section class=\"d-card sty svelte-qardfz\"><div class=\"d-head\"><h2>Driving style</h2><!></div> <!></section></div> <div class=\"col svelte-qardfz\"><section class=\"d-card chartcard svelte-qardfz\"><div class=\"d-head\"><h2>Distance</h2><span class=\"d-note\"> </span></div> <!></section> <section class=\"d-card places svelte-qardfz\"><div class=\"d-head\"><h2>Charged by place</h2><span class=\"d-note\"> </span></div> <!></section></div></div> <div class=\"mapcard svelte-qardfz\"><!></div>", 1), yg = /* @__PURE__ */ X("<div class=\"page svelte-qardfz\"><h1 class=\"page-title\">Statistics</h1> <div class=\"seg svelte-qardfz\"><!></div> <div class=\"nav svelte-qardfz\"><button class=\"press svelte-qardfz\"><svg class=\"icon svelte-qardfz\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M15 5l-7 7 7 7\"></path></svg></button> <h2 aria-live=\"polite\" class=\"svelte-qardfz\"> </h2> <button class=\"press svelte-qardfz\"><svg class=\"icon svelte-qardfz\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 5l7 7-7 7\"></path></svg></button></div> <!></div>");
function bg(e, t) {
	et(t, !0);
	let n = [
		{
			value: "week",
			label: "Week"
		},
		{
			value: "month",
			label: "Month"
		},
		{
			value: "year",
			label: "Year"
		}
	], r = [
		"--charge",
		"--trip",
		"--energy",
		"--p3",
		"--p4"
	], i = /* @__PURE__ */ U("week"), a = /* @__PURE__ */ U(null), o = /* @__PURE__ */ U(null), s = /* @__PURE__ */ U(!1), c = /* @__PURE__ */ U(!0), l = g(), u = (e) => (W(i, e, !0), W(a, null));
	async function d() {
		let e = l.next();
		W(c, !0), W(s, !1);
		try {
			let n = await h(jh(t.view, Y(i), Y(a)));
			e.current && W(o, n, !0);
		} catch {
			e.current && W(s, !0);
		} finally {
			e.current && W(c, !1);
		}
	}
	An(() => (d(), l.reset));
	let f = (e, t = !1) => {
		if (e == null) return null;
		let n = Math.round(e * 100);
		return {
			dir: Math.sign(n),
			text: `${Math.abs(n)} %`,
			hint: t
		};
	}, p = (e, t, n = !1) => f(Nh(e, t), n), m = (e) => Fa(e.wh_per_100km), _ = /* @__PURE__ */ H(() => Y(o)?.totals), v = /* @__PURE__ */ H(() => {
		if (!Y(_)) return [];
		let e = Y(o).previous, [t, n] = [m(Y(_)), e.trips ? m(e) : null], r = t != null && n ? Number((t - n).toFixed(1)) : null;
		return [
			{
				label: "Distance",
				value: es(ka(Y(_).distance_m)),
				trend: p(Y(_).distance_m, e.distance_m)
			},
			{
				label: "Average",
				value: t == null ? ["–", ""] : [t.toFixed(1), "kWh/100 km"],
				trend: r == null ? null : {
					dir: Math.sign(r),
					text: r ? La(r, "kWh/100", 1) : "0.0 kWh/100",
					hint: !0
				}
			},
			{
				label: "Energy used",
				value: es(Aa(Y(_).net_wh)),
				count: `${Y(_).trips} ${Y(_).trips === 1 ? "trip" : "trips"}`,
				trend: p(Y(_).net_wh, e.net_wh, !0)
			},
			{
				label: "Charged",
				value: es(Aa(Y(_).charged_wh)),
				count: `${Y(_).charges} ${Y(_).charges === 1 ? "charge" : "charges"}`,
				trend: p(Y(_).charged_wh, e.charged_wh)
			}
		];
	}), y = /* @__PURE__ */ H(() => Y(o)?.buckets ?? []), b = /* @__PURE__ */ H(() => Y(y).map((e) => Lh(Y(i), e.start))), x = /* @__PURE__ */ H(() => Y(y).map((e) => Fa(e.wh_per_100km))), S = /* @__PURE__ */ H(() => ({
		splits: Y(b).map((e, t) => t).filter((e) => Y(i) !== "month" || Y(b)[e] === "1" || Number(Y(b)[e]) % 5 == 0),
		values: (e, t) => t.map((e) => Y(b)[e])
	})), C = /* @__PURE__ */ H(() => [{
		label: "Distance (km)",
		values: Y(y).map((e) => e.distance_m / 1e3),
		kind: "bars",
		color: "--trip"
	}, ...Y(x).some((e) => e != null) ? [{
		label: "kWh/100 km",
		values: Y(x),
		scale: "y2",
		color: "--energy"
	}] : []]), ee = /* @__PURE__ */ H(() => Y(i) === "year" ? "month" : "day"), te = /* @__PURE__ */ H(() => Y(_) ? `Distance per ${Y(ee)}: ${ka(Y(_).distance_m)} in total, average ${Ia(Y(_).wh_per_100km)}` : ""), w = /* @__PURE__ */ H(() => Y(o) ? Rh(Y(o).by_place) : []), T = (e, t) => e.other ? "--muted" : r[t % r.length], E = /* @__PURE__ */ H(() => Y(_) ? p(Y(_).cost.total, Y(o).previous.cost.total, !0) : null), D = /* @__PURE__ */ H(() => Y(o)?.highlights), ne = /* @__PURE__ */ H(() => Y(D)?.gross_wh > 0 ? Math.round(Y(D).recup_wh / Y(D).gross_wh * 100) : null), O = /* @__PURE__ */ H(() => Y(o)?.style), k = /* @__PURE__ */ H(() => Y(O)?.km > 0 ? zh(Y(O), Y(o).previous_style) : null), re = /* @__PURE__ */ H(() => Bh(Y(k)?.points)), A = (e) => eo(Ya(e), Xa()), j = (e) => No({
		kind: "trip",
		vehicle_id: e.vehicle_id,
		start: e.start
	});
	var ie = yg(), M = q(G(ie), 2), N = G(M), P = () => Y(i), F = u;
	fc(N, {
		get options() {
			return n;
		},
		get value() {
			return P();
		},
		set value(e) {
			F(e);
		},
		label: "Period"
	}), B(M);
	var ae = q(M, 2), oe = G(ae), se = q(oe, 2), ce = K(se, !0), le = q(se, 2);
	B(ae);
	var ue = q(ae, 2), de = (e) => {
		var t = Jh(), n = q(G(t), 2);
		B(t), Fr("click", n, d), Z(e, t);
	}, fe = (e) => {
		Z(e, Yh());
	}, pe = (e) => {
		var n = vg(), r = vn(n);
		let s;
		var l = G(r), u = G(l), d = G(u);
		hi(d, 21, () => Y(v), (e) => e.label, (e, t) => {
			im(e, {
				get label() {
					return Y(t).label;
				},
				get value() {
					return Y(t).value[0];
				},
				get unit() {
					return Y(t).value[1];
				},
				children: (e, n) => {
					var r = qr(), i = vn(r), a = (e) => {
						var n = Zh(), r = G(n), i = (e) => {
							var n = Xh(), r = K(n, !0);
							J(() => Q(r, Y(t).count)), Z(e, n);
						};
						$(r, (e) => {
							Y(t).count && e(i);
						});
						var a = q(r, 2), o = (e) => {
							Gh(e, () => Y(t).trend);
						};
						$(a, (e) => {
							Y(t).trend && e(o);
						}), B(n), Z(e, n);
					};
					$(i, (e) => {
						(Y(t).count || Y(t).trend) && e(a);
					}), Z(e, r);
				},
				$$slots: { default: !0 }
			});
		}), B(d);
		var p = q(d, 2), m = (e) => {
			var t = Qh(), n = K(t);
			J(() => Q(n, `Change against the previous ${Y(i) ?? ""}`)), Z(e, t);
		}, h = /* @__PURE__ */ H(() => Y(v).some((e) => e.trend));
		$(p, (e) => {
			Y(h) && e(m);
		}), B(u);
		var g = q(u, 2), b = (e) => {
			var t = eg(), n = q(G(t), 2);
			hi(n, 21, () => Y(o).per_vehicle, (e) => e.id, (e, t) => {
				var n = $h(), r = G(n), i = K(r, !0), a = q(r, 2), o = G(a), s = K(o, !0), c = q(o), l = K(c, !0), u = q(c), d = K(u), f = q(u), p = K(f), m = K(q(f));
				B(a), B(n), J((e, n, r, a, o) => {
					Q(i, Y(t).name), Q(s, e), Q(l, n), Q(d, `${r ?? ""} used`), Q(p, `${a ?? ""} charged`), Q(m, `${o ?? ""} cost`);
				}, [
					() => ka(Y(t).totals.distance_m),
					() => Ia(Y(t).totals.wh_per_100km),
					() => Aa(Y(t).totals.net_wh),
					() => Aa(Y(t).totals.charged_wh),
					() => Ss(Y(t).totals.cost.total)
				]), Z(e, n);
			}), B(n), B(t), Z(e, t);
		};
		$(g, (e) => {
			Y(o).per_vehicle && e(b);
		});
		var x = q(g, 2), ie = q(G(x), 2), M = G(ie), N = G(M), P = (e) => {
			var t = tg(), n = q(G(t)), r = K(n, !0), i = K(q(n, 2));
			B(t), J((e, n, a, o) => {
				ra(t, "href", e), Q(r, n), Q(i, `${a ?? ""} · ${o ?? ""}`);
			}, [
				() => j(Y(D).longest),
				() => ka(Y(D).longest.distance_m),
				() => ps(Y(D).longest),
				() => A(Y(D).longest.start)
			]), Z(e, t);
		}, F = (e) => {
			var t = ng(), n = K(q(G(t)), !0);
			B(t), J(() => Q(n, "–")), Z(e, t);
		};
		$(N, (e) => {
			Y(D).longest ? e(P) : e(F, -1);
		}), B(M);
		var ae = q(M, 2), oe = G(ae), se = (e) => {
			var t = rg(), n = q(G(t)), r = K(n), i = K(q(n, 2));
			B(t), J((e, n, a) => {
				ra(t, "href", e), Q(r, `${n ?? ""} kWh/100 km`), Q(i, `${a ?? ""} · trips of at least 5 km`);
			}, [
				() => j(Y(D).most_efficient),
				() => (Y(D).most_efficient.wh_per_100km / 1e3).toFixed(1),
				() => A(Y(D).most_efficient.start)
			]), Z(e, t);
		}, ce = (e) => {
			var t = ig(), n = K(q(G(t)), !0);
			Fe(), B(t), J(() => Q(n, "–")), Z(e, t);
		};
		$(oe, (e) => {
			Y(D).most_efficient ? e(se) : e(ce, -1);
		}), B(ae);
		var le = q(ae, 2), ue = G(le), de = q(G(ue)), fe = K(de, !0), pe = q(de, 2), me = (e) => {
			var t = ag(), n = K(t);
			J((e) => Q(n, `${Y(ne) ?? ""} % of the ${e ?? ""} used before recuperation`), [() => Aa(Y(D).gross_wh)]), Z(e, t);
		};
		$(pe, (e) => {
			Y(ne) != null && e(me);
		}), B(ue), B(le);
		var he = q(le, 2), ge = G(he), _e = q(G(ge)), ve = K(_e, !0), ye = q(_e, 2), be = G(ye), xe = q(be), Se = (e) => {
			var t = Kr();
			J((e) => Q(t, `· ${e ?? ""}`), [() => Es(Y(_).cost.total, Y(_).distance_m)]), Z(e, t);
		};
		$(xe, (e) => {
			Y(_).distance_m && e(Se);
		});
		var Ce = q(xe), we = (e) => {
			var t = Kr();
			J((e) => Q(t, `· ${e ?? ""}`), [() => Os(Y(_).cost.uncosted)]), Z(e, t);
		};
		$(Ce, (e) => {
			Y(_).cost.uncosted > 0 && e(we);
		});
		var I = q(Ce, 2), Te = (e) => {
			Gh(e, () => Y(E));
		};
		$(I, (e) => {
			Y(E) && e(Te);
		}), B(ye), B(ge), B(he), B(ie), B(x);
		var Ee = q(x, 2), De = G(Ee), Oe = q(G(De)), ke = (e) => {
			var t = og(), n = K(t, !0);
			J((e) => Q(n, e), [() => Y(O).score == null ? "No trips of 2 km or more" : vs(Y(O).score)]), Z(e, t);
		};
		$(Oe, (e) => {
			Y(k) && e(ke);
		}), B(De);
		var Ae = q(De, 2), je = (e) => {
			var t = pg(), n = vn(t), r = (e) => {
				var t = cg(), n = G(t, !0), r = q(n, 2), i = (e) => {
					var t = sg();
					Gh(G(t), () => Y(re)), B(t), Z(e, t);
				};
				$(r, (e) => {
					Y(re) && e(i);
				}), B(t), J(() => Q(n, Y(O).score)), Z(e, t);
			};
			$(n, (e) => {
				Y(O).score != null && e(r);
			});
			var i = q(n, 2);
			hi(i, 21, () => Y(k).events, (e) => e.k, (e, t) => {
				let n = /* @__PURE__ */ H(() => f(Y(t).change, !0));
				var r = ug(), i = G(r), a = K(i, !0), o = q(i), s = G(o, !0), c = q(s), l = (e) => {
					var t = lg(), r = vn(t, !0);
					r.nodeValue = " ", Gh(q(r), () => Y(n)), Z(e, t);
				};
				$(c, (e) => {
					Y(n) && e(l);
				}), B(o), B(r), J((e) => {
					Q(a, Y(t).name), Q(s, e);
				}, [() => ys(Y(O)[Y(t).k], Y(O).km)]), Z(e, r);
			}), B(i);
			var a = q(i, 4);
			hi(a, 21, () => Y(k).bands, (e) => e.name, (e, t) => {
				var n = dg(), r = G(n), i = K(r, !0), a = q(r), o = G(a);
				let s;
				B(a);
				var c = K(q(a), !0);
				B(n), J((e) => {
					Q(i, Y(t).name), s = Hi(o, "", s, { width: `${Y(t).share * 100}%` }), Q(c, e);
				}, [() => Y(t).value == null ? "–" : Y(t).value.toFixed(1)]), Z(e, n);
			}), B(a);
			var o = q(a, 2), s = (e) => {
				var t = fg(), n = G(t), r = K(q(G(n)), !0);
				B(n), B(t), J((e) => Q(r, e), [() => Aa(Y(O).standing_kwh * 1e3)]), Z(e, t);
			};
			$(o, (e) => {
				Y(O).standing_kwh != null && e(s);
			}), Z(e, t);
		}, R = (e) => {
			var t = mg(), n = K(t);
			J(() => Q(n, `No trips in this ${Y(i) ?? ""}.`)), Z(e, t);
		};
		$(Ae, (e) => {
			Y(k) ? e(je) : e(R, -1);
		}), B(Ee), B(l);
		var Me = q(l, 2), z = G(Me), Ne = G(z), Pe = K(q(G(Ne)));
		B(Ne);
		var Ie = q(Ne, 2), Le = (e) => {
			{
				let t = /* @__PURE__ */ H(() => Y(y).map((e, t) => t));
				Xp(e, {
					get x() {
						return Y(t);
					},
					get series() {
						return Y(C);
					},
					get xaxis() {
						return Y(S);
					},
					height: 200,
					get label() {
						return Y(te);
					}
				});
			}
		}, Re = (e) => {
			var t = mg(), n = K(t);
			J(() => Q(n, `No trips in this ${Y(i) ?? ""}.`)), Z(e, t);
		};
		$(Ie, (e) => {
			Y(_).distance_m > 0 ? e(Le) : e(Re, -1);
		}), B(z);
		var ze = q(z, 2), Be = G(ze), Ve = K(q(G(Be)), !0);
		B(Be);
		var He = q(Be, 2), Ue = (e) => {
			var t = _g(), n = vn(t);
			hi(n, 23, () => Y(w), (e) => e.name, (e, t, n) => {
				var r = hg();
				let i;
				J((e) => i = Hi(r, "", i, {
					flex: `${Y(t).wh ?? ""} 1 0`,
					background: e
				}), [() => `var(${T(Y(t), Y(n)) ?? ""})`]), Z(e, r);
			}), B(n);
			var r = q(n, 2);
			hi(r, 23, () => Y(w), (e) => e.name, (e, t, n) => {
				var r = gg(), i = G(r);
				let a;
				var o = q(i), s = K(o, !0), c = q(o), l = K(c, !0), u = K(q(c));
				B(r), J((e, n, r) => {
					a = Hi(i, "", a, { background: e }), Q(s, Y(t).name), Q(l, n), Q(u, `${r ?? ""} %`);
				}, [
					() => `var(${T(Y(t), Y(n)) ?? ""})`,
					() => Aa(Y(t).wh),
					() => Math.round(Y(t).share * 100)
				]), Z(e, r);
			}), B(r), J((e) => ra(n, "aria-label", `Charged by place: ${e ?? ""}`), [() => Y(w).map((e) => `${e.name} ${Aa(e.wh)}`).join(", ")]), Z(e, t);
		}, We = (e) => {
			var t = mg(), n = K(t);
			J(() => Q(n, `No charging in this ${Y(i) ?? ""}.`)), Z(e, t);
		};
		$(He, (e) => {
			Y(w).length ? e(Ue) : e(We, -1);
		}), B(ze), B(Me), B(r);
		var Ge = q(r, 2);
		Wh(G(Ge), {
			get view() {
				return t.view;
			},
			get period() {
				return Y(i);
			},
			get at() {
				return Y(a);
			}
		}), B(Ge), J((e, t, n, i, a) => {
			s = Bi(r, 1, "grid svelte-qardfz", null, s, { busy: Y(c) }), ra(r, "aria-busy", Y(c)), Q(fe, e), Q(ve, t), Q(be, `${n ?? ""} charging · ${i ?? ""} fixed`), Q(Pe, `per ${Y(ee) ?? ""}`), Q(Ve, a);
		}, [
			() => Aa(Y(D).recup_wh),
			() => Ss(Y(_).cost.total),
			() => Ss(Y(_).cost.energy),
			() => Ss(Y(_).cost.fixed),
			() => Aa(Y(_).charged_wh)
		]), Z(e, n);
	};
	$(ue, (e) => {
		Y(s) ? e(de) : Y(o) ? e(pe, -1) : e(fe, 1);
	}), B(ie), J((e) => {
		oe.disabled = !Y(o) || Y(c), ra(oe, "aria-label", `Previous ${Y(i) ?? ""}`), Q(ce, e), le.disabled = Y(c) || !Y(o)?.period.next_at, ra(le, "aria-label", `Next ${Y(i) ?? ""}`);
	}, [() => Y(o) ? Ih(Y(i), Y(o).period.start, Y(o).period.end) : ""]), Fr("click", oe, () => W(a, Y(o).period.prev_at, !0)), Fr("click", le, () => W(a, Y(o).period.next_at, !0)), Z(e, ie), tt();
}
Ir(["click"]);
// src/App.svelte
var xg = /* @__PURE__ */ X("<p class=\"msg svelte-1n46o8q\"> </p>"), Sg = /* @__PURE__ */ X("<p class=\"msg svelte-1n46o8q\">Loading…</p>"), Cg = /* @__PURE__ */ X("<p class=\"msg svelte-1n46o8q\">No vehicles available to you.</p>");
function wg(e, t) {
	et(t, !0);
	let n = /* @__PURE__ */ U(null), r = /* @__PURE__ */ U(sn({
		vehicles: [],
		groups: []
	})), i = /* @__PURE__ */ U(""), a = Da(location.hash), o = /* @__PURE__ */ U(sn(a)), s = /* @__PURE__ */ U(""), c = "car-insights-view", l = /* @__PURE__ */ H(() => [...Y(r).vehicles.map((e) => ({
		value: `v:${e.id}`,
		label: e.name
	})), ...Y(r).groups.map((e) => ({
		value: `g:${e.id}`,
		label: `Group: ${e.name}`
	}))]), u = g();
	async function d() {
		let e = u.next();
		try {
			let t = await h("views");
			if (!e.current) return;
			W(r, t, !0), Y(l).some((e) => e.value === Y(i)) || W(i, Y(l)[0]?.value || "", !0);
		} catch {}
	}
	function f() {
		let e = Y(o).page;
		W(o, Da(location.hash), !0), Y(o).redirect && location.replace(Y(o).redirect), e === "settings" && Y(o).page !== "settings" && d();
	}
	addEventListener("hashchange", f), a.redirect && location.replace(a.redirect), An(() => {
		Y(n) && !Y(n).is_admin && Y(o).page === "settings" && location.replace("#/activity");
	});
	let p = "";
	An(() => {
		p && Y(i) && Y(i) !== p && Y(o).detail && location.replace("#/activity"), Y(i) && (p = Y(i));
	}), An(() => {
		if (Y(i)) try {
			localStorage.setItem(c, Y(i));
		} catch {}
	}), (async () => {
		try {
			let [e, t] = await Promise.all([h("me"), h("views")]);
			Ka(e?.tz), ((e) => {
				var t = re(e, 2);
				W(n, t[0], !0), W(r, t[1], !0);
			})([e, t]);
			let a = "";
			try {
				a = localStorage.getItem(c) || "";
			} catch {}
			let o = Y(l).map((e) => e.value);
			W(i, o.includes(a) ? a : o[0] || "", !0);
		} catch (e) {
			W(s, `Could not load (${e.message})`);
		}
	})();
	var m = qr(), _ = vn(m), v = (e) => {
		var t = xg(), n = K(t, !0);
		J(() => Q(n, Y(s))), Z(e, t);
	}, y = (e) => {
		Z(e, Sg());
	}, b = (e) => {
		jo(e, {
			get page() {
				return Y(o).page;
			},
			get isAdmin() {
				return Y(n).is_admin;
			},
			get options() {
				return Y(l);
			},
			get view() {
				return Y(i);
			},
			set view(e) {
				W(i, e, !0);
			},
			children: (e, t) => {
				var r = qr(), a = vn(r), s = (e) => {
					Oh(e, { get section() {
						return Y(o).section;
					} });
				}, c = (e) => {
					Z(e, Cg());
				}, l = (e) => {
					var t = qr();
					ui(vn(t), () => Y(i), (e) => {
						bg(e, { get view() {
							return Y(i);
						} });
					}), Z(e, t);
				}, u = (e) => {
					var t = qr();
					ui(vn(t), () => Y(i), (e) => {
						Xm(e, {
							get view() {
								return Y(i);
							},
							get detail() {
								return Y(o).detail;
							},
							get isAdmin() {
								return Y(n).is_admin;
							}
						});
					}), Z(e, t);
				};
				$(a, (e) => {
					Y(o).page === "settings" && Y(n).is_admin ? e(s) : Y(i) ? Y(o).page === "stats" ? e(l, 2) : e(u, -1) : e(c, 1);
				}), Z(e, r);
			},
			$$slots: { default: !0 }
		});
	};
	$(_, (e) => {
		Y(s) ? e(v) : Y(n) ? e(b, -1) : e(y, 1);
	}), Z(e, m), tt();
}
// src/main.js
var Tg = (e) => ei(wg, { target: e }), Eg = () => new Promise((e) => {
	let t = new URL(
		/* @vite-ignore */
		"panel.css",
		import.meta.url
	);
	t.search = new URL(import.meta.url).search;
	let n = Object.assign(document.createElement("link"), {
		rel: "stylesheet",
		href: t.href
	});
	n.onload = n.onerror = e, document.head.append(n);
});
addEventListener("click", (e) => e.target.closest?.("a[href^=\"#\"]:not([target])")?.setAttribute("target", "_self"), !0), customElements.define("car-insights-panel", class extends HTMLElement {
	#e = !1;
	set hass(e) {
		d(e), !this.#e && (this.#e = !0, this.style.display = "block", this.style.height = "100%", Eg().then(() => {
			let e = this.appendChild(document.createElement("div"));
			e.id = "app", Tg(e);
		}));
	}
});
