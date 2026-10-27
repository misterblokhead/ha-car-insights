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
function ne(e) {
	return typeof e == "function";
}
var E = () => {};
function re(e) {
	return typeof e?.then == "function";
}
function D(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function O() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function ie(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
// node_modules/svelte/src/internal/client/constants.js
var k = 1 << 24, A = 1024, ae = 2048, j = 4096, M = 8192, N = 16384, P = 32768, oe = 1 << 25, se = 65536, ce = 1 << 19, le = 1 << 20, ue = 1 << 25, de = 1 << 21, fe = 1 << 22, pe = 1 << 23, me = Symbol("$state"), he = Symbol("component"), ge = Symbol("legacy props"), _e = Symbol(""), ve = Symbol("attributes"), ye = Symbol("class"), be = Symbol("style"), xe = Symbol("text"), Se = Symbol("form reset"), Ce = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), we = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), Te = {}, F = Symbol("uninitialized"), Ee = "http://www.w3.org/1999/xhtml", De = "http://www.w3.org/2000/svg", Oe = "http://www.w3.org/1998/Math/MathML";
function ke() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ae(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function je() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Me() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
// node_modules/svelte/src/internal/client/dom/hydration.js
var I = !1;
function Ne(e) {
	I = e;
}
var R;
function Pe(e) {
	if (e === null) throw Ae(), Te;
	return R = e;
}
function Fe() {
	return Pe(/* @__PURE__ */ vn(R));
}
function z(e) {
	if (I) {
		if (/* @__PURE__ */ vn(R) !== null) throw Ae(), Te;
		R = e;
	}
}
function Ie(e = 1) {
	if (I) {
		for (var t = e, n = R; t--;) n = /* @__PURE__ */ vn(n);
		R = n;
	}
}
function Le(e = !0) {
	for (var t = 0, n = R;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ vn(n);
		e && n.remove(), n = i;
	}
}
function Re(e) {
	if (!e || e.nodeType !== 8) throw Ae(), Te;
	return e.data;
}
// node_modules/svelte/src/internal/client/reactivity/equality.js
function ze(e) {
	return e === this.v;
}
function Be(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ve(e) {
	return !Be(e, this.v);
}
function He(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
// node_modules/svelte/src/internal/client/errors.js
function Ue() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function We(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ge(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ke() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function qe(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Je() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ye(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function B() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Xe() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ze() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Qe() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/svelte/src/internal/client/context.js
var $e = null;
function et(e) {
	$e = e;
}
function tt(e, t = !1, n) {
	$e = {
		p: $e,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: nr,
		l: null
	};
}
function nt(e) {
	var t = $e, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) jn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, $e = t.p, rt(e);
}
function rt(e = {}) {
	return x(e, he, { value: !0 }), e;
}
function it() {
	return !0;
}
// node_modules/svelte/src/internal/client/dom/task.js
var at = [];
function ot() {
	var e = at;
	at = [], D(e);
}
function st(e) {
	if (at.length === 0 && !Ft) {
		var t = at;
		queueMicrotask(() => {
			t === at && ot();
		});
	}
	at.push(e);
}
function ct() {
	for (; at.length > 0;) ot();
}
// node_modules/svelte/src/internal/client/reactivity/status.js
var lt = ~(ae | j | A);
function ut(e, t) {
	e.f = e.f & lt | t;
}
function dt(e) {
	e.f & 512 || e.deps === null ? ut(e, A) : ut(e, j);
}
// node_modules/svelte/src/internal/client/reactivity/utils.js
function ft(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), ut(e, A);
}
// node_modules/svelte/src/internal/client/dom/elements/misc.js
var pt = !1;
function mt() {
	pt || (pt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[Se]?.();
		});
	}, { capture: !0 }));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ht(e) {
	var t = $n, n = nr;
	tr(null), rr(null);
	try {
		return e();
	} finally {
		tr(t), rr(n);
	}
}
function gt(e, t, n, r = n) {
	e.addEventListener(t, () => ht(n));
	let i = e[Se];
	e[Se] = i ? () => {
		i(), r(!0);
	} : () => r(!0), mt();
}
// node_modules/svelte/src/internal/client/reactivity/async.js
function _t(e, t, n, r) {
	let i = it() ? xt : wt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = nr, c = vt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				wn(e, s);
			}
			yt();
		}
	}
	var d = bt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Ct(e))).then(u).catch((e) => wn(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), yt());
	}) : f();
}
function vt() {
	var e = nr, t = $n, n = $e, r = jt;
	return function(i = !0) {
		rr(e), tr(t), et(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function yt(e = !0) {
	rr(null), tr(null), et(null), e && jt?.deactivate();
}
function bt() {
	var e = nr, t = e.b, n = jt, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function xt(e) {
	var t = 2 | ae;
	return nr !== null && (nr.f |= ce), {
		ctx: $e,
		deps: null,
		effects: null,
		equals: ze,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: F,
		wv: 0,
		parent: nr,
		ac: null
	};
}
var St = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function Ct(e, t, n) {
	let r = nr;
	r === null && Ue();
	var i = void 0, a = Qt(F), o = !$n, s = /* @__PURE__ */ new Set();
	return Pn(() => {
		var t = nr, n = O();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== Ce && n.reject(e);
			}).finally(yt);
		} catch (e) {
			n.reject(e), yt();
		}
		var c = jt;
		if (o) {
			if (t.f & 32768) var l = bt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(St);
			else for (let e of s.values()) e.reject(St);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== St && (c.activate(), t ? (a.f |= pe, nn(a, t)) : (a.f & 8388608 && (a.f ^= pe), nn(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), kn(() => {
		for (let e of s) e.reject(St);
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
function V(e) {
	let t = /* @__PURE__ */ xt(e);
	return ar(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function wt(e) {
	let t = /* @__PURE__ */ xt(e);
	return t.equals = Ve, t;
}
function Tt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Hn(t[n]);
	}
}
function Et(e) {
	var t, n = nr, r = e.parent;
	if (!Zn && r !== null && e.v !== F && r.f & 24576) return ke(), e.v;
	rr(r);
	try {
		Tt(e), t = _r(e);
	} finally {
		rr(n);
	}
	return t;
}
function Dt(e) {
	var t = Et(e);
	!e.equals(t) && (e.wv = mr(), (!jt?.is_fork || e.deps === null) && (jt === null ? e.v = t : (jt.capture(e, t, !0), Mt?.capture(e, t, !0)), e.deps === null)) ? ut(e, A) : Zn || (Nt === null ? dt(e) : (On() || jt?.is_fork) && Nt.set(e, t));
}
function Ot(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ht(() => {
		t.ac.abort(Ce), t.ac = null;
	}), t.fn !== null && (t.teardown = E), br(t, 0), Bn(t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && xr(t);
}
// node_modules/svelte/src/internal/client/reactivity/batch.js
var At = null, jt = null, Mt = null, Nt = null, Pt = null, Ft = !1, It = !1, Lt = null, Rt = null, zt = 0, Bt = 1, Vt = class e {
	id = Bt++;
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
		At === null ? At = this : (At.#n = this, this.#t = At), At = this;
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
			for (var r of n.d) ut(r, ae), t(r);
			for (r of n.m) ut(r, j), t(r);
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
					t.f ^= A;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), ut(e, ae), this.schedule(e);
		for (let e of this.#d) ut(e, j), this.schedule(e);
		this.apply();
		for (var t = Lt = [], n = [], r = Rt = []; this.#c.length > 0;) {
			zt++ > 1e3 && (this.#S(), Ut());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Jt(e), this.#h() || this.discard(), t;
			}
		}
		if (jt = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Lt = null, Rt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) qt(e, t);
			r.length > 0 && jt.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), Mt = this, Gt(n), Gt(t), Mt = null, this.#s?.resolve();
			var o = jt;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (Xt.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= A;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= A : i & 4 ? t.push(r) : hr(r) && (i & 16 && this.#d.add(r), xr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), ut(i, ae), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), jt = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) ft(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== F && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Nt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		jt = this;
	}
	deactivate() {
		jt = null, Nt = null;
	}
	flush() {
		try {
			It = !0, jt = this, this.#_();
		} finally {
			zt = 0, Pt = null, Lt = null, Rt = null, It = !1, jt = null, Nt = null, Xt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(St);
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
		this.#m || (this.#m = !0, st(() => {
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
		return (this.#s ??= O()).promise;
	}
	static ensure() {
		if (jt === null) {
			let t = jt = new e();
			!It && !Ft && st(() => {
				t.#e || t.flush();
			});
		}
		return jt;
	}
	apply() {
		Nt = null;
	}
	schedule(e) {
		Pt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? At = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ht(e) {
	var t = Ft, n = Mt;
	Mt = null, Ft = !0;
	try {
		var r;
		for (e && (Ht(), r = e());;) {
			if (ct(), jt === null) return r;
			jt.flush();
		}
	} finally {
		Ft = t, Mt = n;
	}
}
function Ut() {
	try {
		Je();
	} catch (e) {
		wn(e, Pt);
	}
}
var Wt = null;
function Gt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && hr(r) && (Wt = /* @__PURE__ */ new Set(), xr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Wn(r), Wt?.size > 0)) {
				Xt.clear();
				for (let e of Wt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Wt.has(n) && (Wt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || xr(n);
					}
				}
				Wt.clear();
			}
		}
		Wt = null;
	}
}
function Kt(e) {
	jt.schedule(e);
}
function qt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), ut(e, A);
		for (var n = e.first; n !== null;) qt(n, t), n = n.next;
	}
}
function Jt(e) {
	ut(e, A);
	for (var t = e.first; t !== null;) Jt(t), t = t.next;
}
// node_modules/svelte/src/internal/client/reactivity/sources.js
var Yt = /* @__PURE__ */ new Set(), Xt = /* @__PURE__ */ new Map(), Zt = !1;
function Qt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: ze,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function H(e, t) {
	let n = Qt(e, t);
	return ar(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function $t(e, t = !1, n = !0) {
	let r = Qt(e);
	return t || (r.equals = Ve), r;
}
function U(e, t, n = !1) {
	return $n !== null && (!er || $n.f & 131072) && it() && $n.f & 4325394 && (ir === null || !ir.has(e)) && Ze(), nn(e, n ? cn(t) : t, Rt);
}
var en = null, tn = 0;
function nn(e, t, n = null) {
	if (!e.equals(t)) {
		Zn ? Xt.set(e, t) : Xt.has(e) || Xt.set(e, e.v);
		var r = Vt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Et(t), Nt === null && dt(t);
		}
		e.wv = mr(), en = null, tn = 0, sn(e, ae, n), en = null, it() && nr !== null && nr.f & 1024 && !(nr.f & 96) && (cr === null ? lr([e]) : cr.push(e)), !r.is_fork && Yt.size > 0 && !Zt && rn();
	}
	return t;
}
function rn() {
	Zt = !1;
	for (let e of Yt) {
		e.f & 1024 && ut(e, j);
		let t;
		try {
			t = hr(e);
		} catch {
			t = !0;
		}
		t && xr(e);
	}
	Yt.clear();
}
function an(e, t = 1) {
	var n = Y(e), r = t === 1 ? n++ : n--;
	return U(e, n), r;
}
function on(e) {
	U(e, e.v + 1);
}
function sn(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = it(), a = r.length;
		if (tn += a, tn > 1e5 && en === null && (en = /* @__PURE__ */ new Set()), en !== null) {
			if (en.has(e)) return;
			en.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== nr) {
				var l = (c & ae) === 0;
				if (l && ut(s, t), c & 131072) Yt.add(s);
				else if (c & 2) {
					var u = s;
					Nt?.delete(u), sn(u, j, n);
				} else if (l) {
					var d = s;
					c & 16 && Wt !== null && Wt.add(d), n === null ? Kt(d) : n.push(d);
				}
			}
		}
	}
}
function cn(e) {
	if (typeof e != "object" || !e || me in e || he in e) return e;
	let t = w(e);
	if (t !== ee && t !== te) return e;
	var n = /* @__PURE__ */ new Map(), r = _(e), i = /* @__PURE__ */ H(0), a = null, o = fr, s = (e) => {
		if (fr === o) return e();
		var t = $n, n = fr;
		tr(null), pr(o);
		var r = e();
		return tr(t), pr(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ H(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			"value" in r && r.configurable !== !1 && r.enumerable !== !1 && r.writable !== !1 || B();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ H(r.value, a);
				return n.set(t, e), e;
			}) : U(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ H(F, a));
					n.set(t, e), on(i);
				}
			} else U(r, F), on(i);
			return !0;
		},
		get(t, r, i) {
			if (r === me) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || S(t, r)?.writable) && (o = s(() => /* @__PURE__ */ H(cn(c ? t[r] : F), a)), n.set(r, o)), o !== void 0) {
				var l = Y(o);
				return l === F ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = Y(i);
				if (a === F) return;
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
			if (t === me) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== F || Reflect.has(e, t);
			return (r !== void 0 || nr !== null && (!i || S(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ H(i ? cn(e[t]) : F, a)), n.set(t, r)), Y(r) === F) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ H(F, a)), n.set(d + "", f)) : U(f, F);
			}
			if (l === void 0) (!u || S(e, t)?.writable) && (l = s(() => /* @__PURE__ */ H(void 0, a)), U(l, cn(o)), n.set(t, l));
			else {
				u = l.v !== F;
				var p = s(() => cn(o));
				U(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var h = n.get("length"), g = Number(t);
					Number.isInteger(g) && g >= h.v && U(h, g + 1);
				}
				on(i);
			}
			return !0;
		},
		ownKeys(e) {
			Y(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== F;
			});
			for (var [r, a] of n) a.v !== F && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			Xe();
		}
	});
}
function ln(e) {
	try {
		if (typeof e == "object" && e && me in e) return e[me];
	} catch {}
	return e;
}
function un(e, t) {
	return Object.is(ln(e), ln(t));
}
var dn, fn, pn, mn;
function hn() {
	if (dn === void 0) {
		dn = window, fn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		pn = S(t, "firstChild").get, mn = S(t, "nextSibling").get, T(e) && (e[ye] = void 0, e[ve] = null, e[be] = void 0, e.__e = void 0), T(n) && (n[xe] = void 0);
	}
}
function gn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function _n(e) {
	return pn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function vn(e) {
	return mn.call(e);
}
function W(e, t) {
	if (!I) return /* @__PURE__ */ _n(e);
	var n = /* @__PURE__ */ _n(R);
	if (n === null) n = R.appendChild(gn());
	else if (t && n.nodeType !== 3) {
		var r = gn();
		return n?.before(r), Pe(r), r;
	}
	return t && Sn(n), Pe(n), n;
}
function G(e, t = !1) {
	if (!I) {
		var n = /* @__PURE__ */ _n(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ vn(n) : n;
	}
	if (t) {
		if (R?.nodeType !== 3) {
			var r = gn();
			return R?.before(r), Pe(r), r;
		}
		Sn(R);
	}
	return R;
}
function K(e, t = !1) {
	if (!I) return /* @__PURE__ */ _n(e);
	var n = W(e, t);
	return z(e), n;
}
function q(e, t = 1, n = !1) {
	let r = I ? R : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ vn(r);
	if (!I) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = gn();
			return r === null ? i?.after(a) : r.before(a), Pe(a), a;
		}
		Sn(r);
	}
	return Pe(r), r;
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
	if (t === null) return $n.f |= pe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	wn(e, t);
}
function wn(e, t) {
	if (e === Te) throw e;
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
	nr === null && ($n === null && qe(e), Ke()), Zn && Ge(e);
}
function En(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Dn(e, t) {
	var n = nr;
	n !== null && n.f & 8192 && (e |= M);
	var r = {
		ctx: $e,
		deps: null,
		nodes: null,
		f: e | ae | 512,
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
	jt?.register_created_effect(r);
	var i = r;
	if (e & 4) Lt === null ? Vt.ensure().schedule(r) : Lt.push(r);
	else if (t !== null) {
		try {
			xr(r);
		} catch (e) {
			throw Hn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= se));
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
	return ut(t, A), t.teardown = e, t;
}
function An(e) {
	Tn("$effect");
	var t = nr.f;
	if (!$n && t & 32 && $e !== null && !$e.i) {
		var n = $e;
		(n.e ??= []).push(e);
	} else return jn(e);
}
function jn(e) {
	return Dn(4 | le, e);
}
function Mn(e) {
	Vt.ensure();
	let t = Dn(64 | ce, e);
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
	return Dn(fe | ce, e);
}
function Fn(e, t = 0) {
	return Dn(8 | t, e);
}
function J(e, t = [], n = [], r = []) {
	_t(r, t, n, (t) => {
		Dn(8, () => {
			e(...t.map(Y));
		});
	});
}
function In(e, t = 0) {
	return Dn(16 | t, e);
}
function Ln(e, t = 0) {
	return Dn(k | t, e);
}
function Rn(e) {
	return Dn(32 | ce, e);
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
		e !== null && ht(() => {
			e.abort(Ce);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Un(e.nodes.start, e.nodes.end), n = !0), e.f |= oe, Bn(e, t && !n), br(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	zn(e), e.f ^= oe, e.f |= N;
	var i = e.parent;
	i !== null && i.first !== null && Wn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Un(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ vn(e);
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
		e.f ^= M;
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
		e.f ^= M, e.f & 1024 || (ut(e, ae), Vt.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ vn(n);
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
			if (hr(a) && Dt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Nt === null && ut(e, A);
	}
	return !1;
}
function gr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(ir !== null && ir.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? gr(a, t, !1) : t === a && (n ? ut(a, ae) : a.f & 1024 && ut(a, j), Kt(a));
	}
}
function _r(e) {
	var t = or, n = sr, r = cr, i = $n, a = ir, o = $e, s = er, c = fr, l = e.f;
	or = null, sr = 0, cr = null, $n = l & 96 ? null : e, ir = null, et(e.ctx), er = !1, fr = ++dr, e.ac !== null && (ht(() => {
		e.ac.abort(Ce);
	}), e.ac = null);
	try {
		e.f |= de;
		var u = e.fn, d = u();
		e.f |= P;
		var f = vr(e);
		if (it() && cr !== null && !er && f !== null && !(e.f & 6146)) for (var p = 0; p < cr.length; p++) gr(cr[p], e);
		if (i !== null && i !== e) {
			if (dr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = dr;
			if (t !== null) for (let e of t) e.rv = dr;
			cr !== null && (r === null ? r = cr : r.push(...cr));
		}
		return e.f & 8388608 && (e.f ^= pe), d;
	} catch (t) {
		return vr(e), Cn(t);
	} finally {
		e.f ^= de, or = t, sr = n, cr = r, $n = i, ir = a, et(o), er = s, fr = c;
	}
}
function vr(e) {
	var t = e.deps, n = jt?.is_fork;
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
		a.f & 512 && (a.f ^= 512), a.v !== F && dt(a), a.ac !== null && ht(() => {
			a.ac.abort(Ce), a.ac = null, ut(a, ae);
		}), Ot(a), br(a, 0);
	}
}
function br(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) yr(e, n[r]);
}
function xr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		ut(e, A);
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
	await Promise.resolve(), Ht();
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
	if (Zn && Xt.has(e)) return Xt.get(e);
	if (t) {
		var i = e;
		if (Zn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || wr(i)) && (a = Et(i)), Xt.set(i, a), a;
		}
		var o = !(i.f & 512) && !er && $n !== null && !!($n.f & 512), s = (i.f & P) === 0;
		hr(i) && (o && (i.f |= 512), Dt(i)), o && !s && (kt(i), Cr(i));
	}
	if (Nt?.has(e)) return Nt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Cr(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : y.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (kt(n), Cr(n));
	}
}
function wr(e) {
	if (e.v === F) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Xt.has(t) || t.f & 2 && wr(t)) return !0;
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
		if (me in e) Dr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && me in n && Dr(n);
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
		if (r.capture || zr.call(t, e), !e.cancelBubble) return ht(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, st(() => {
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
		if (I) return Ur(R, null), R;
		i === void 0 && (i = Hr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ _n(i)));
		var t = r || fn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ _n(t), s = t.lastChild;
			Ur(o, s);
		} else Ur(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Wr(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (I) return Ur(R, null), R;
		if (!o) {
			var e = /* @__PURE__ */ _n(Hr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ _n(e);) o.appendChild(/* @__PURE__ */ _n(e));
			else o = /* @__PURE__ */ _n(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ _n(t), r = t.lastChild;
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
	if (!I) {
		var t = gn(e + "");
		return Ur(t, t), t;
	}
	var n = R;
	return n.nodeType === 3 ? Sn(n) : (n.before(n = gn()), Pe(n)), Ur(n, n), n;
}
function qr() {
	if (I) return Ur(R, null), R;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = gn();
	return e.append(t, n), Ur(t, n), e;
}
function Z(e, t) {
	if (I) {
		var n = nr;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = R), Fe();
	} else e !== null && e.before(t);
}
function Jr() {
	if (I && R && R.nodeType === 8 && R.textContent?.startsWith("$")) {
		let e = R.textContent.substring(1);
		return Fe(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
// node_modules/svelte/src/reactivity/create-subscriber.js
function Yr(e) {
	let t = 0, n = Qt(0), r;
	return () => {
		On() && (Y(n), Fn(() => (t === 0 && (r = Tr(() => e(() => on(n)))), t += 1, () => {
			st(() => {
				--t, t === 0 && (r?.(), r = void 0, on(n));
			});
		})));
	};
}
// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Xr = se | ce;
function Zr(e, t, n, r) {
	new Qr(e, t, n, r);
}
var Qr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = I ? R : null;
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
	#h = Yr(() => (this.#m = Qt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = nr;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = nr.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = In(() => {
			if (I) {
				let e = Re(this.#t);
				Fe();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Xr), I && (this.#e = R);
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
		st(r), t && (this.#s = Rn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? Me() : (t = !0, n && Qe(), this.#s !== null && Gn(this.#s, () => {
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
		return (this.#i.f & (N | oe)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Rn(() => e(this.#e)), st(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = gn(), n = !1;
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
				}), this.#a === null ? (this.#c = null, n && this.#S(jt)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Gn(this.#o, () => {
					this.#o = null;
				}), this.#S(jt));
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
			} else this.#S(jt);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		ft(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = nr, n = $n, r = $e;
		rr(this.#i), tr(this.#i), et(this.#i.ctx);
		try {
			return Vt.ensure(), e();
		} finally {
			rr(t), tr(n), et(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Gn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, st(() => {
			this.#d = !1, this.#m && nn(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Y(this.#m);
	}
	error(e) {
		if (e === Te || !this.#n.onerror && !this.#n.failed) throw e;
		jt?.is_fork ? (this.#a && jt.skip_effect(this.#a), this.#o && jt.skip_effect(this.#o), this.#s && jt.skip_effect(this.#s), jt.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (Hn(this.#a), null), this.#o &&= (Hn(this.#o), null), this.#s &&= (Hn(this.#s), null), I && (Pe(this.#t), Ie(), Pe(Le()));
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
		st(() => {
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
	n !== (e[xe] ??= e.nodeValue) && (e[xe] = n, e.nodeValue = `${n}`);
}
function ei(e, t) {
	return ni(e, t);
}
var ti = /* @__PURE__ */ new Map();
function ni(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	hn();
	var c = void 0, l = Mn(() => {
		var l = n ?? t.appendChild(gn());
		Zr(l, { pending: () => {} }, (t) => {
			tt({});
			var n = $e;
			if (a && (n.c = a), i && (r.$$events = i), I && Ur(t, null), $r = o, c = e(t, r) || rt(), $r = !0, I && (nr.nodes.end = R, R === null || R.nodeType !== 8 || R.data !== "]")) throw Ae(), Te;
			nt();
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
						Yn(r, t), t.append(gn()), this.#n.set(e, {
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
		var n = jt, r = bn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = gn();
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
		} else I && (this.anchor = R), this.#a(n);
	}
}, ai = 0, oi = 1, si = 2;
function ci(e, t, n, r, i) {
	I && Fe();
	var a = it(), o = F, s = a ? Qt(o) : /* @__PURE__ */ $t(o, !1, !1), c = a ? Qt(o) : /* @__PURE__ */ $t(o, !1, !1), l = new ii(e);
	In(() => {
		var a = jt, o = t(), u = !1;
		let d = I && re(o) === (e.data === "[!");
		if (d && (Pe(Le()), Ne(!1)), re(o)) {
			var f = vt(), p = !1;
			let e = (e) => {
				if (!u) {
					p = !0, f(!1), jt === a && a.deactivate(), Vt.ensure();
					try {
						e();
					} finally {
						yt(!1), Ft || Ht();
					}
				}
			};
			o.then((t) => {
				e(() => {
					nn(s, t), l.ensure(oi, r && ((e) => r(e, s)));
				});
			}, (t) => {
				e(() => {
					if (nn(c, t), l.ensure(si, i && ((e) => i(e, c))), !i) throw c.v;
				});
			}), I ? l.ensure(ai, n) : st(() => {
				p || e(() => {
					l.ensure(ai, n);
				});
			});
		} else nn(s, o), l.ensure(oi, r && ((e) => r(e, s)));
		return d && Ne(!0), () => {
			u = !0;
		};
	});
}
// node_modules/svelte/src/internal/client/dom/blocks/if.js
function $(e, t, n = !1) {
	var r;
	I && (r = R, Fe());
	var i = new ii(e), a = n ? se : 0;
	function o(e, t) {
		if (I) {
			var n = Re(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Le();
				Pe(a), i.anchor = a, Ne(!1), i.ensure(e, t), Ne(!0);
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
	I && Fe();
	var r = new ii(e), i = !it();
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
		r?.has(a) ? (a.f |= ue, Yn(a, document.createDocumentFragment())) : Hn(t[i], n);
	}
}
var mi;
function hi(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var c = e;
		o = I ? Pe(/* @__PURE__ */ _n(c)) : c.appendChild(gn());
	}
	I && Fe();
	var l = null, u = /* @__PURE__ */ wt(() => {
		var e = n();
		return _(e) ? e : e == null ? [] : b(e);
	}), d = /* @__PURE__ */ new Map(), f = !0;
	function p(e) {
		if (!(h.effect.f & 16384)) {
			h.pending.delete(e);
			var n = Y(u);
			h.fallback = l, _i(h, n, o, t, r), l !== null && (n.length === 0 ? l.f & 33554432 ? (l.f ^= ue, yi(l, null, o)) : qn(l) : Gn(l, () => {
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
			I && Re(o) === "[!" != (c === 0) && (o = Le(), Pe(o), Ne(!1), h = !0);
			for (var g = /* @__PURE__ */ new Set(), _ = jt, v = bn(), y = 0; y < c; y += 1) {
				I && R.nodeType === 8 && R.data === "]" && (o = R, h = !0, Ne(!1));
				var b = e[y], x = r(b, y), S = f ? null : s.get(x);
				S ? (S.v && nn(S.v, b), S.i && nn(S.i, y), v && _.unskip_effect(S.e)) : (S = vi(s, f ? o : mi ??= gn(), b, x, y, i, t, n), f || (S.e.f |= ue), s.set(x, S)), g.add(x);
			}
			if (c === 0 && a && !l && (f ? l = Rn(() => a(o)) : (l = Rn(() => a(mi ??= gn())), l.f |= ue)), c > g.size && We("", "", ""), I && c > 0 && Pe(Le()), !f) {
				if (d.set(_, g), v) {
					for (let [e, t] of s) g.has(e) || _.skip_effect(t.e);
					_.oncommit(p), _.ondiscard(m);
				} else p(_);
			}
			h && Ne(!0), Y(u);
		}),
		flags: t,
		items: s,
		pending: d,
		outrogroups: null,
		fallback: l
	};
	f = !1, I && (o = R);
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
			if (g.f ^= ue, g === c) yi(g, null, n);
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
	a && st(() => {
		if (d !== void 0) for (g of d) g.nodes?.a?.apply();
	});
}
function vi(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Qt(n) : /* @__PURE__ */ $t(n, !1, !1) : null, l = o & 2 ? Qt(i) : null;
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
		var o = /* @__PURE__ */ vn(r);
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
		I && (o = Pe(/* @__PURE__ */ _n(c)));
	}
	J(() => {
		var e = nr;
		if (s === (s = t() ?? "")) I && Fe();
		else if (n && !I) e.nodes = null, c.innerHTML = s, s !== "" && Ur(/* @__PURE__ */ _n(c), c.lastChild);
		else if (e.nodes !== null && (Un(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (I) {
				for (var a = R.data, l = Fe(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ vn(l);
				if (l === null) throw Ae(), Te;
				Ur(R, u), o = Pe(l);
			} else {
				var d = xn(r ? "svg" : i ? "math" : "template", r ? De : i ? Oe : void 0);
				d.innerHTML = s;
				var f = r || i ? d : d.content;
				if (Ur(/* @__PURE__ */ _n(f), f.lastChild), r || i) for (; /* @__PURE__ */ _n(f);) o.before(/* @__PURE__ */ _n(f));
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
	}, se);
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
	ht(() => {
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
		return ht(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
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
	if (ne(t)) {
		var c;
		return st(() => {
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
		abort: E,
		deactivate: E,
		reset: E,
		t: () => r
	};
	let { delay: l = 0, css: u, tick: d, easing: f = Ai } = t;
	var p, m = () => 1 - r;
	return st(() => {
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
			s = !0, p && (p.cancel(), p.effect = null, p.onfinish = E);
		},
		deactivate: () => {
			a = E;
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
				Er(e), i && Be(a, e) && (a = e, r.update(e));
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
	var o = e[ye];
	if (I || o !== n || o === void 0) {
		var s = Ii(n, r, a);
		I && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ye] = n;
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
	var i = e[be];
	if (I || i !== t) {
		var a = zi(t, r);
		I && a === e.getAttribute("style") || (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[be] = t;
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
			Ui(s, r ? i.includes(c) : un(c, n));
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
		if (!_(t)) return je();
		for (var r of e.options) r.selected = t.includes(Ji(r));
	} else {
		for (r of e.options) if (un(Ji(r), t)) {
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
	gt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), Ji);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && Ji(o);
		}
		n(a), e.__value = a, jt !== null && r.add(jt);
	}), Nn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = jt;
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
var Xi = Symbol("is custom element"), Zi = Symbol("is html"), Qi = we ? "link" : "LINK", $i = we ? "progress" : "PROGRESS";
function ea(e) {
	if (I) {
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
		e[Se] = n, st(n), mt();
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
	I && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Qi) || i[t] !== (i[t] = n) && (t === "loading" && (e[_e] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && oa(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ia(e) {
	return e[ve] ??= {
		[Xi]: e.nodeName.includes("-"),
		[Zi]: e.namespaceURI === Ee
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
	gt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = da(e) ? fa(a) : a, n(a), jt !== null && r.add(jt), await Sr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (I && e.defaultValue !== e.value || Tr(t) == null && e.value) && (n(da(e) ? fa(e.value) : e.value), jt !== null && r.add(jt)), Fn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = jt;
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
	o.push(n), gt(n, "change", () => {
		var e = n.__value;
		a && (e = ua(o, e, n.checked)), i(e);
	}, () => i(a ? [] : null)), Fn(() => {
		var e = r();
		I && n.defaultChecked !== n.checked ? s = !0 : a ? (e ||= [], n.checked = e.includes(n.__value)) : n.checked = un(n.__value, e);
	}), kn(() => {
		var e = o.indexOf(n);
		e !== -1 && o.splice(e, 1);
	}), ca.has(o) || (ca.add(o), st(() => {
		o.sort((e, t) => e.compareDocumentPosition(t) === 4 ? -1 : 1), ca.delete(o);
	})), st(() => {
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
	return e === t || e?.[me] === t;
}
function ga(e = rt(), t, n, r) {
	var i = $e.r, a = nr;
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
			if (ne(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			ne(i) && (i = i());
			let a = S(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (ne(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = S(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === me || t === ge) return !1;
		for (let n of e.props) if (ne(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (ne(n) && (n = n()), n) {
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
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ xt(r), Y(l)) : (c && (c = !1, s = o ? Tr(r) : r), s);
	let d;
	if (a) {
		var f = me in e || ge in e;
		d = S(e, t)?.set ?? (f && t in e ? (n) => e[t] = n : void 0);
	}
	var p, m = !1;
	a ? [p, m] = va(() => e[t]) : p = e[t], p === void 0 && r !== void 0 && (p = u(), d && (i && Ye(t), d(p)));
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
	var _ = !1, v = (n & 1 ? xt : wt)(() => (_ = !1, h()));
	a && Y(v);
	var y = nr;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Y(v) : i && a ? cn(e) : e;
			return U(v, n), _ = !0, s !== void 0 && (s = n), e;
		}
		return Zn && _ || y.f & 16384 ? v.v : Y(v);
	});
}
function Sa(e) {
	$e === null && He("onMount"), An(() => {
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
var io = (e) => ro(new Date(Qa(e) + Va).toISOString().slice(0, 10)), ao = cn({
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
	tt(t, !0);
	let n = xa(t, "value", 15, ""), r = ho("--fade"), i = /* @__PURE__ */ H(!1), a = /* @__PURE__ */ H(void 0), o = /* @__PURE__ */ H(void 0), s = /* @__PURE__ */ H(void 0), c = /* @__PURE__ */ V(() => t.options.find((e) => e.value === n())), l = () => [...Y(s).querySelectorAll("button")];
	async function u() {
		U(i, !0), await Sr(), (Y(s).querySelector("[aria-checked=\"true\"]") ?? l()[0])?.focus();
	}
	function d(e = !0) {
		U(i, !1), e && Y(o)?.focus();
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
	Pr("pointerdown", dn, (e) => Y(i) && !Y(a).contains(e.target) && d(!1));
	var h = W(m), g = (e) => {
		var t = go(), n = K(t, !0);
		J(() => Q(n, Y(c)?.label ?? "–")), Z(e, t);
	}, _ = (e) => {
		var a = bo(), l = G(a), m = K(W(l), !0);
		Ie(2), z(l), ga(l, (e) => U(o, e), () => Y(o));
		var h = q(l, 2), g = (e) => {
			var i = yo();
			hi(i, 21, () => t.options, (e) => e.value, (e, t) => {
				var r = vo(), i = W(r), a = K(i, !0), o = q(i, 2), s = (e) => {
					Z(e, _o());
				};
				$(o, (e) => {
					Y(t).value === n() && e(s);
				}), z(r), J(() => {
					ra(r, "aria-checked", Y(t).value === n()), Q(a, Y(t).label);
				}), Fr("click", r, () => f(Y(t).value)), Z(e, r);
			}), z(i), ga(i, (e) => U(s, e), () => Y(s)), Fr("keydown", i, p), ji(3, i, () => fo, () => ({ duration: r })), Z(e, i);
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
	}), z(m), ga(m, (e) => U(a, e), () => Y(a)), Z(e, m), nt();
}
Ir(["click", "keydown"]);
// src/lib/ui/Sidebar.svelte
var Co = /* @__PURE__ */ X("<a class=\"press svelte-1ccclju\"><svg class=\"icon svelte-1ccclju\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"></svg> <span> </span></a>"), wo = /* @__PURE__ */ X("<aside class=\"chrome svelte-1ccclju\"><!> <nav aria-label=\"Main\" class=\"svelte-1ccclju\"></nav></aside>");
function To(e, t) {
	tt(t, !0);
	let n = xa(t, "view", 15, ""), r = xa(t, "showPill", 3, !0);
	var i = wo(), a = W(i), o = (e) => {
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
		var r = Co(), i = W(r);
		xi(i, () => Y(n).icon, !0), z(i);
		var a = K(q(i, 2), !0);
		z(r), J(() => {
			ra(r, "href", Y(n).href), ra(r, "aria-current", t.page === Y(n).page ? "page" : void 0), Q(a, Y(n).label);
		}), Z(e, r);
	}), z(s), z(i), Z(e, i), nt();
}
// src/lib/ui/TabBar.svelte
var Eo = /* @__PURE__ */ X("<a class=\"press svelte-31wq8u\"><svg class=\"icon svelte-31wq8u\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"></svg> <span> </span></a>"), Do = /* @__PURE__ */ X("<nav class=\"chrome svelte-31wq8u\" aria-label=\"Main\"></nav>");
function Oo(e, t) {
	var n = Do();
	hi(n, 21, () => t.tabs, (e) => e.page, (e, n) => {
		var r = Eo(), i = W(r);
		xi(i, () => Y(n).icon, !0), z(i);
		var a = K(q(i, 2), !0);
		z(r), J(() => {
			ra(r, "href", Y(n).href), ra(r, "aria-current", t.page === Y(n).page ? "page" : void 0), Q(a, Y(n).label);
		}), Z(e, r);
	}), z(n), Z(e, n);
}
// src/lib/ui/Shell.svelte
var ko = /* @__PURE__ */ X("<header class=\"svelte-gp4acw\"><!></header>"), Ao = /* @__PURE__ */ X("<div><!> <main class=\"svelte-gp4acw\"><!></main> <!></div>");
function jo(e, t) {
	tt(t, !0);
	let n = xa(t, "options", 19, () => []), r = xa(t, "view", 15, ""), i = /* @__PURE__ */ V(() => [
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
	]), a = /* @__PURE__ */ V(() => t.page !== "settings");
	var o = Ao();
	let s;
	var c = W(o), l = (e) => {
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
		So(W(t), {
			get options() {
				return n();
			},
			get value() {
				return r();
			},
			set value(e) {
				r(e);
			}
		}), z(t), Z(e, t);
	};
	$(c, (e) => {
		ao.wide ? e(l) : Y(a) && e(u, 1);
	});
	var d = q(c, 2);
	Si(W(d), () => t.children), z(d);
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
	}), z(o), J(() => s = Bi(o, 1, "shell svelte-gp4acw", null, s, { wide: ao.wide })), Z(e, o), nt();
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
var Io = (e, t) => [...t, ...e.filter((e) => !t.some((t) => t.date === e.date))].sort((e, t) => e.date < t.date ? 1 : -1), Lo = ({ detailOpen: e }) => e ? "replace" : "push", Ro = cn({
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
	var a = W(r);
	Si(W(a), () => t.glyph), z(a);
	var o = q(a, 2), s = K(o, !0), c = q(o, 2), l = W(c, !0), u = q(l), d = (e) => {
		var n = As(), r = G(n, !0);
		r.nodeValue = " ";
		var i = K(q(r), !0);
		J(() => Q(i, t.unit)), Z(e, n);
	};
	$(u, (e) => {
		t.unit && e(d);
	}), z(c);
	var f = q(c, 2), p = K(f, !0), m = q(f, 2);
	Si(m, () => t.aside ?? E), Si(q(m, 2), () => t.below ?? E), z(r), J(() => {
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
	let n = xa(t, "full", 3, !1), r = (e) => Math.min(100, Math.max(0, e)), i = /* @__PURE__ */ V(() => t.from != null && t.to != null), a = /* @__PURE__ */ V(() => Y(i) ? r(Math.min(t.from, t.to)) : 0), o = /* @__PURE__ */ V(() => Y(i) ? r(Math.max(t.from, t.to)) : 0);
	var s = qr(), c = G(s), l = (e) => {
		var i = Fs(), s = W(i), c = (e) => {
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
		}), z(i), J((e, t) => {
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
	tt(t, !0);
	let n = xa(t, "current", 3, !1), r = /* @__PURE__ */ V(() => t.item.start_pct), i = /* @__PURE__ */ V(() => t.item.end_pct), a = /* @__PURE__ */ V(() => fs(t.item.added_wh, t.item.energy_source === "soc_estimate").split(" ")), o = /* @__PURE__ */ V(() => ie(Y(a), 2)), s = /* @__PURE__ */ V(() => Y(o)[0]), c = /* @__PURE__ */ V(() => Y(o)[1]), l = /* @__PURE__ */ V(() => `${cs(t.item.start, t.item.end)} · ${ja(t.item.avg_w)}`);
	{
		let a = (e) => {
			Z(e, Ls());
		}, o = (e) => {
			var n = Bs(), a = G(n), o = (e) => {
				var n = Rs(), r = K(n, !0);
				J((e) => Q(r, e), [() => Cs(t.item.cost)]), Z(e, n);
			};
			$(a, (e) => {
				t.item.cost?.amount != null && e(o);
			});
			var s = q(a, 2), c = (e) => {
				var t = zs(), n = W(t);
				Is(n, {
					get from() {
						return Y(r);
					},
					get to() {
						return Y(i);
					}
				});
				var a = K(q(n, 2));
				z(t), J((e, t) => Q(a, `${e ?? ""} → ${t ?? ""} %`), [() => Math.round(Y(r)), () => Math.round(Y(i))]), Z(e, t);
			};
			$(s, (e) => {
				Y(r) != null && Y(i) != null && e(c);
			}), Z(e, n);
		}, u = /* @__PURE__ */ V(() => No(t.item)), d = /* @__PURE__ */ V(() => ds(t.item));
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
	nt();
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
	tt(t, !0);
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
	}, i = /* @__PURE__ */ V(() => t.checklist.cars.length), a = /* @__PURE__ */ V(() => ({
		car: `${Y(i)} ${Y(i) === 1 ? "car is" : "cars are"} set up`,
		places: "Trips then read Home → Work instead of street names.",
		viewers: "Only matters when other people use this Home Assistant."
	})), o = /* @__PURE__ */ V(() => qo(t.checklist, t.places)), s = /* @__PURE__ */ V(() => $o(t.checklist)), c = /* @__PURE__ */ H(""), l = /* @__PURE__ */ H(!1);
	async function u(e) {
		U(c, ""), U(l, !0);
		try {
			return await m("PUT", "onboarding", e), !0;
		} catch (e) {
			return U(c, e.detail || `Could not save (${e.message})`, !0), !1;
		} finally {
			U(l, !1);
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
	var h = rc(), g = W(h), _ = q(W(g), 2);
	z(g);
	var v = q(g, 2), y = (e) => {
		var t = Ys(), n = K(t, !0);
		J(() => Q(n, Y(c))), Z(e, t);
	};
	$(v, (e) => {
		Y(c) && e(y);
	});
	var b = q(v, 2);
	hi(b, 21, () => Y(o), (e) => e.id, (e, t) => {
		var o = nc(), c = W(o);
		let l;
		var u = K(c, !0), d = q(c, 2), m = W(d), h = W(m), g = K(h, !0), _ = q(h, 1, !0);
		z(m);
		var v = q(m, 2), y = (e) => {
			var n = Xs(), r = K(n, !0);
			J(() => Q(r, Y(a)[Y(t).id])), Z(e, n);
		};
		$(v, (e) => {
			Y(a)[Y(t).id] && e(y);
		});
		var b = q(v, 2), x = (e) => {
			var t = Zs();
			hi(q(G(t), 2), 17, () => Y(s), di, (e, t) => {
				var r = qr();
				hi(G(r), 17, () => Y(t).kinds, di, (e, r) => {
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
		}), z(d), z(o), J(() => {
			l = Bi(c, 1, "mark svelte-1l9jcf1", null, l, { done: Y(t).done }), Q(u, Y(t).done ? "✓" : ""), Q(g, Y(t).done ? "Done: " : "To do: "), Q(_, r[Y(t).id]);
		}), Z(e, o);
	}), z(b), z(h), J(() => _.disabled = Y(l)), Fr("click", _, d), Z(e, h), nt();
}
Ir(["click"]);
// src/lib/ui/LiveStrip.svelte
var ac = /* @__PURE__ */ Gr("<svg class=\"icon svelte-lcylx6\" viewBox=\"0 0 24 24\" role=\"img\" aria-label=\"Plugged in\"><path d=\"M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4\"></path></svg>"), oc = /* @__PURE__ */ X("<li class=\"svelte-lcylx6\"><i class=\"svelte-lcylx6\"></i> <span class=\"where svelte-lcylx6\"><b class=\"svelte-lcylx6\"> </b> </span> <span class=\"vals svelte-lcylx6\"> <!></span></li>"), sc = /* @__PURE__ */ X("<ul class=\"card svelte-lcylx6\"></ul>");
function cc(e, t) {
	tt(t, !0);
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
	var i = qr(), a = G(i), o = (e) => {
		var i = sc();
		hi(i, 21, () => t.vehicles, (e) => e.id, (e, t) => {
			var i = oc(), a = W(i);
			let o;
			var s = q(a, 2), c = W(s), l = K(c, !0), u = q(c);
			z(s);
			var d = q(s, 2), f = W(d), p = q(f), m = (e) => {
				Z(e, ac());
			};
			$(p, (e) => {
				Y(t).status === "charging" && e(m);
			}), z(d), z(i), J((e, n, i) => {
				o = Hi(a, "", o, { background: r[Y(t).status] ?? r.parked }), Q(l, Y(t).name), Q(u, ` · ${e ?? ""}`), Q(f, `${n ?? ""} · ${i ?? ""} `);
			}, [
				() => Y(t).status === "no_data" ? xs(Y(t).updated) : `${n[Y(t).status] ?? Y(t).status} · ${Y(t).position?.place || "–"}`,
				() => Ma(Y(t).soc_percent),
				() => ka(Y(t).range_m)
			]), Z(e, i);
		}), z(i), Z(e, i);
	};
	$(a, (e) => {
		t.vehicles.length && e(o);
	}), Z(e, i), nt();
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
	tt(t, !0);
	let r = [], i = xa(t, "value", 15, ""), a = lc({
		response: .35,
		damping: 1
	}), o = po(a, { onFrame: (e) => U(c, e, !0) }), s = /* @__PURE__ */ H(0), c = /* @__PURE__ */ H(0), l = !1, u = /* @__PURE__ */ V(() => Math.max(0, (Y(s) - 4) / t.options.length));
	An(() => {
		let e = Math.max(0, t.options.findIndex((e) => e.value === i())) * Y(u);
		if (!l || ao.reducedMotion) l = Y(s) > 0, Object.assign(a, {
			value: e,
			target: e,
			velocity: 0
		}), U(c, e);
		else return o.to(e), o.stop;
	});
	var d = dc(), f = W(d);
	let p;
	hi(q(f, 2), 17, () => t.options, (e) => e.value, (e, t) => {
		var a = uc();
		let o;
		var s = W(a);
		ea(s);
		var c, l = K(q(s, 2), !0);
		z(a), J(() => {
			o = Bi(a, 1, "svelte-5bfr2e", null, o, { on: Y(t).value === i() }), ra(s, "name", n), c !== (c = Y(t).value) && (s.value = (s.__value = c) ?? ""), Q(l, Y(t).label);
		}), la(r, [], s, () => (Y(t).value, i()), i), Z(e, a);
	}), z(d), J(() => {
		ra(d, "aria-label", t.label), p = Hi(f, "", p, {
			width: `${Y(u) ?? ""}px`,
			transform: `translateX(${Y(c) ?? ""}px)`
		});
	}), ma(d, "clientWidth", (e) => U(s, e)), Z(e, d), nt();
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
	tt(t, !0);
	let n = (e) => {
		var n = vc(), o = G(n), s = W(o), c = q(W(s));
		z(s);
		var l = q(s, 2), u = W(l), d = q(u, 2);
		z(l), z(o);
		var f = q(o, 2);
		ui(W(f), () => t.id, (e) => {
			var n = _c();
			Si(W(n), () => t.children), z(n), ji(1, n, () => fo, () => ({ duration: a })), ji(2, n, () => fo, () => ({ duration: a })), Z(e, n);
		}), z(f), J(() => {
			Q(c, ` ${ao.wide ? "Close" : "Activity"}`), u.disabled = !r(), d.disabled = !i();
		}), Fr("click", s, y), Fr("click", u, () => b(r())), Fr("click", d, () => b(i())), Z(e, n);
	}, r = xa(t, "prev", 3, null), i = xa(t, "next", 3, null), a = ho("--fade"), o = /* @__PURE__ */ V(() => !ao.split), s = /* @__PURE__ */ V(() => !ao.wide && !ao.reducedMotion), c = lc({
		response: .35,
		damping: 1
	}), l = !ao.wide && !ao.reducedMotion, u = /* @__PURE__ */ H(cn(l ? innerWidth : 0)), d = /* @__PURE__ */ H(!1), f = /* @__PURE__ */ H(!1), p = /* @__PURE__ */ H(!1), m = /* @__PURE__ */ H(void 0), h = 0, g = null, _ = po(c, {
		snap: {
			distance: 1,
			speed: 30
		},
		onFrame: (e) => U(u, e, !0),
		onSettle() {
			U(d, !1), c.target > 0 && t.onclose();
		}
	});
	function v(e, t) {
		U(d, !0), _.to(e, t);
	}
	Sa(() => (c.value = Y(u), l && v(0), () => {
		_.stop(), clearTimeout(h);
	}));
	function y() {
		Y(p) || (Y(s) ? v(Y(m).offsetWidth) : (U(p, !0), h = setTimeout(t.onclose, a)));
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
		_.stop(), Y(m).setPointerCapture(e.pointerId), g.live = !0, U(d, U(f, !0), !0);
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
			U(u, Math.max(0, g.from + e.clientX - g.grab), !0), Object.assign(c, {
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
		g = null, U(f, !1);
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
	Pr("keydown", dn, x);
	var ne = G(T), E = (e) => {
		var t = yc();
		let r, i;
		var a = W(t);
		n(a), z(t), ga(t, (e) => U(m, e), () => Y(m)), Ni(t, (e) => gc?.(e)), J(() => {
			r = Bi(t, 1, "layer svelte-2a30b3", null, r, {
				phone: !ao.wide,
				busy: Y(d),
				held: Y(f),
				leaving: Y(p),
				"fade-in": !l
			}), ra(t, "aria-modal", !ao.wide), i = Hi(t, "", i, { transform: Y(u) ? `translateX(${Y(u)}px)` : null });
		}), Fr("pointerdown", t, ee), Fr("pointermove", t, te), Fr("pointerup", t, w), Pr("pointercancel", t, w), Z(e, t);
	}, re = (e) => {
		var t = bc();
		let r;
		var i = W(t);
		n(i), z(t), ga(t, (e) => U(m, e), () => Y(m)), J(() => r = Bi(t, 1, "column svelte-2a30b3", null, r, {
			leaving: Y(p),
			"fade-in": !l
		})), Z(e, t);
	};
	$(ne, (e) => {
		Y(o) ? e(E) : e(re, -1);
	}), Z(e, T), nt();
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
	tt(t, !0);
	let n = xa(t, "label", 3, "Route"), r = /* @__PURE__ */ V(() => t.points?.length >= 2 ? wc(t.points, t.width, t.height, 8) : null), i = /* @__PURE__ */ V(() => Y(r)?.points ?? []), a = /* @__PURE__ */ V(() => Y(i)[0]), o = /* @__PURE__ */ V(() => Y(i)[Y(i).length - 1]), s = /* @__PURE__ */ H(void 0), c = /* @__PURE__ */ H(typeof IntersectionObserver > "u");
	An(() => {
		if (Y(c) || !Y(s)) return;
		let e = new IntersectionObserver((e) => e.some((e) => e.isIntersecting) && U(c, !0), { rootMargin: "200px" });
		return e.observe(Y(s)), () => e.disconnect();
	});
	var l = qr(), u = G(l), d = (e) => {
		var l = Ac();
		let u;
		var d = W(l), f = W(d), p = (e) => {
			var t = qr();
			hi(G(t), 17, () => Y(r).tiles, (e) => `${e.x}/${e.y}`, (e, t) => {
				var n = qr();
				ci(G(n), () => Oc(Ec(Y(t))), null, (e, n) => {
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
		}), z(d);
		var m = q(d, 2), h = W(m), g = q(h), _ = q(g);
		z(m), z(l), ga(l, (e) => U(s, e), () => Y(s)), J((e) => {
			u = Hi(l, "", u, {
				width: `${t.width ?? ""}px`,
				height: `${t.height ?? ""}px`
			}), ra(m, "width", t.width), ra(m, "height", t.height), ra(m, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), ra(m, "aria-label", n()), ra(h, "points", e), ra(g, "cx", Y(a)[0]), ra(g, "cy", Y(a)[1]), ra(_, "cx", Y(o)[0]), ra(_, "cy", Y(o)[1]);
		}, [() => Y(i).map((e) => `${e[0].toFixed(1)},${e[1].toFixed(1)}`).join(" ")]), Z(e, l);
	};
	$(u, (e) => {
		Y(r) && e(d);
	}), Z(e, l), nt();
}
// src/lib/ui/TripCard.svelte
var Mc = /* @__PURE__ */ Gr("<svg class=\"icon\" viewBox=\"0 0 24 24\"><path d=\"M5 16v-5l2-5h10l2 5v5M5 16h14M5 16v3h3v-3M16 16v3h3v-3M7 11h10\"></path></svg>"), Nc = /* @__PURE__ */ X("<span class=\"route svelte-8nqrvt\"><!></span> <span class=\"caption stats svelte-8nqrvt\"> <br/> </span>", 1);
function Pc(e, t) {
	tt(t, !0);
	let n = xa(t, "current", 3, !1), r = /* @__PURE__ */ V(() => ka(t.item.distance_m).split(" ")), i = /* @__PURE__ */ V(() => ie(Y(r), 2)), a = /* @__PURE__ */ V(() => Y(i)[0]), o = /* @__PURE__ */ V(() => Y(i)[1]), s = /* @__PURE__ */ V(() => `${Za(t.item.start)} · ${t.item.end == null ? "now" : Na(t.item.duration_s)}`);
	{
		let r = (e) => {
			Z(e, Mc());
		}, i = (e) => {
			var n = Nc(), r = G(n), i = W(r);
			{
				let e = /* @__PURE__ */ V(() => ms(t.item));
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
			z(r);
			var a = q(r, 2), o = W(a, !0), s = q(o, 2, !0);
			z(a), J((e, t) => {
				Q(o, e), Q(s, t);
			}, [() => Ia(t.item.wh_per_100km), () => Aa(t.item.net_wh)]), Z(e, n);
		}, c = /* @__PURE__ */ V(() => No(t.item)), l = /* @__PURE__ */ V(() => ps(t.item));
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
	nt();
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
		let ne = (e) => {
			if (o[e] != null) {
				let t = h(l(a[e], s, p, d)), n = h(u(o[e], c, m, f));
				_(S, t + b, n), v(S, t, n, b, 0, gu * 2);
			}
		};
		if (i) i.forEach(ne);
		else for (let e = n; e <= r; e++) ne(e);
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
		}, w = te.stroke, T = d.dir * (d.ori == 0 ? 1 : -1), ne = C(u[T == 1 ? o : s]), E = S(l[T == 1 ? o : s]), re = E, D = E;
		i && t == -1 && (D = b, ee(w, D, ne)), ee(w, E, ne);
		for (let e = T == 1 ? o : s; e >= o && e <= s; e += T) {
			let n = u[e];
			if (n == null) continue;
			let r = S(l[e]), i = C(n);
			t == 1 ? ee(w, r, ne) : ee(w, re, i), ee(w, r, i), ne = i, re = r;
		}
		let O = re;
		i && t == 1 && (O = b + x, ee(w, O, ne));
		let [ie, k] = np(e, a);
		if (c.fill != null || ie != 0) {
			let t = te.fill = new Path2D(w), n = C(c.fillTo(e, a, c.min, c.max, ie));
			ee(t, O, n), ee(t, D, n);
		}
		if (!c.spanGaps) {
			let i = [];
			i.push(...sp(l, u, o, s, T, S, r));
			let f = c.width * Ml / 2, p = n || t == 1 ? f : -f, m = n || t == -1 ? -f : f;
			i.forEach((e) => {
				e[0] += p, e[1] += m;
			}), te.gaps = i = c.gaps(e, a, o, s, i), te.clip = ap(i, d.ori, h, g, _, v);
		}
		return k != 0 && (te.band = k == 2 ? [ip(e, a, o, s, w, -1), ip(e, a, o, s, w, 1)] : ip(e, a, o, s, w, k)), te;
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
		let te = m.pxRound, w = n, T = r * Ml, ne = s * Ml, E = c * Ml, re, D;
		_.ori == 0 ? [re, D] = a(e, t) : [D, re] = a(e, t);
		let O = _.dir * (_.ori == 0 ? 1 : -1), ie = _.ori == 0 ? mp : hp, k = _.ori == 0 ? u : (e, t, n, r, i, a, o) => {
			u(e, t, n, i, r, o, a);
		}, A = uu(e.bands, Xu).find((e) => e.series[0] == t), ae = A == null ? 0 : A.dir, j = m.fillTo(e, t, m.min, m.max, ae), M = te(b(j, v, ee, S)), N, P, oe, se = C, ce = te(m.width * Ml), le = !1, ue = null, de = null, fe = null, pe = null;
		d != null && (ce == 0 || f != null) && (le = !0, ue = d.values(e, t, i, p), de = /* @__PURE__ */ new Map(), new Set(ue).forEach((e) => {
			e != null && de.set(e, new Path2D());
		}), ce > 0 && (fe = f.values(e, t, i, p), pe = /* @__PURE__ */ new Map(), new Set(fe).forEach((e) => {
			e != null && pe.set(e, new Path2D());
		})));
		let { x0: me, size: he } = l;
		if (me != null && he != null) {
			w = 1, h = me.values(e, t, i, p), me.unit == 2 && (h = h.map((t) => e.posToVal(x + t * C, _.key, !0)));
			let n = he.values(e, t, i, p);
			P = he.unit == 2 ? n[0] * C : y(n[0], _, C, x) - y(0, _, C, x), se = Ep(h, g, y, _, C, x, se), oe = se - P + T;
		} else se = Ep(h, g, y, _, C, x, se), oe = se * o + T, P = se - oe;
		oe < 1 && (oe = 0), ce >= P / 2 && (ce = 0), oe < 5 && (te = Fu);
		let ge = oe > 0, _e = se - oe - (ge ? ce : 0);
		P = te(ju(_e, E, ne)), N = (w == 0 ? P / 2 : w == O ? 0 : P) - w * O * ((w == 0 ? T / 2 : 0) + (ge ? ce / 2 : 0));
		let ve = {
			stroke: null,
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: 0
		}, ye = le ? null : new Path2D(), be = null;
		if (A != null) be = e.data[A.series[1]];
		else {
			let { y0: n, y1: r } = l;
			n != null && r != null && (g = r.values(e, t, i, p), be = n.values(e, t, i, p));
		}
		let xe = re * P, Se = D * P;
		for (let n = O == 1 ? i : p; n >= i && n <= p; n += O) {
			let r = g[n];
			if (r == null) continue;
			if (be != null) {
				let e = be[n] ?? 0;
				if (r - e == 0) continue;
				M = b(e, v, ee, S);
			}
			let i = y(_.distr != 2 || l != null ? h[n] : n, _, C, x), a = b(uu(r, j), v, ee, S), o = te(i - N), s = te(Su(a, M)), c = te(xu(a, M)), u = s - c;
			if (r != null) {
				let i = r < 0 ? Se : xe, a = r < 0 ? xe : Se;
				le ? (ce > 0 && fe[n] != null && ie(pe.get(fe[n]), o, c + vu(ce / 2), P, Su(0, u - ce), i, a), ue[n] != null && ie(de.get(ue[n]), o, c + vu(ce / 2), P, Su(0, u - ce), i, a)) : ie(ye, o, c + vu(ce / 2), P, Su(0, u - ce), i, a), k(e, t, n, o - ce / 2, c, P + ce, u);
			}
		}
		return ce > 0 ? ve.stroke = le ? pe : ye : le || (ve._fill = m.width == 0 ? m._fill : m._stroke ?? m._fill, ve.width = 0), ve.fill = le ? de : ye, ve;
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
		let ne = {
			stroke: e(w, T, b, S, x, _),
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: $f
		}, E = ne.stroke, [re, D] = np(t, r);
		if (o.fill != null || re != 0) {
			let e = ne.fill = new Path2D(E), n = y(o.fillTo(t, r, o.min, o.max, re));
			S(e, te, n), S(e, ee, n);
		}
		if (!o.spanGaps) {
			let e = [];
			e.push(...sp(s, c, i, a, C, v, n)), ne.gaps = e = o.gaps(t, r, i, a, e), ne.clip = ap(e, l.ori, p, m, h, g);
		}
		return D != 0 && (ne.band = D == 2 ? [ip(t, r, i, a, E, -1), ip(t, r, i, a, E, 1)] : ip(t, r, i, a, E, D)), ne;
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
		e.target === m && (on != tn || sn != nn) && ln.click(r, e);
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
		axes: Vt,
		series: At
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
	let T = b[S], ne = T.distr, E, re;
	T.ori == 0 ? (Fl(l, Wc), E = a, re = o) : (Fl(l, Gc), E = o, re = a);
	let D = {};
	for (let e in b) {
		let t = b[e];
		(t.min != null || t.max != null) && (D[e] = {
			min: t.min,
			max: t.max
		}, t.min = t.max = null);
	}
	let O = e.tzDate || ((e) => new Date(yu(e / _))), ie = e.fmtDate || Td, k = _ == 1 ? Jd(O) : Zd(O), A = $d(O, Qd(_ == 1 ? qd : Xd, ie)), ae = af(O, nf(rf, ie)), j = [], M = r.legend = sd({}, cf, e.legend), N = r.cursor = sd({}, _f, { drag: { y: i == 2 } }, e.cursor), P = M.show, oe = N.show, se = M.markers;
	M.idxs = j, se.width = Nu(se.width), se.dash = Nu(se.dash), se.stroke = Nu(se.stroke), se.fill = Nu(se.fill);
	let ce, le, ue, de = [], fe = [], pe, me = !1, he = {};
	if (M.live) {
		let e = v[1] ? v[1].values : null;
		me = e != null, pe = me ? e(r, 1, 0) : { _: 0 };
		for (let e in pe) he[e] = Dl;
	}
	if (P) {
		if (ce = Rl("table", nl, l), ue = Rl("tbody", null, ce), M.mount(r, ce), me) {
			le = Rl("thead", null, ce, ue);
			let e = Rl("tr", null, le);
			for (var ge in Rl("th", null, e), pe) Rl("th", sl, e).textContent = ge;
		} else Fl(ce, il), M.live && Fl(ce, rl);
	}
	let _e = { show: !0 }, ve = { show: !1 };
	function ye(e, t) {
		if (t == 0 && (me || !M.live || i == 2)) return Zu;
		let n = [], a = Rl("tr", al, ue, ue.childNodes[t]);
		Fl(a, e.class), e.show || Fl(a, Zc);
		let o = Rl("th", null, a);
		if (se.show) {
			let e = zl(ol, o);
			if (t > 0) {
				let n = se.width(r, t);
				n && (e.style.border = n + "px " + se.dash(r, t) + " " + se.stroke(r, t)), e.style.background = se.fill(r, t);
			}
		}
		let s = zl(sl, o);
		for (var c in e.label instanceof HTMLElement ? s.appendChild(e.label) : s.textContent = e.label, t > 0 && (se.show || (s.style.color = e.width > 0 ? se.stroke(r, t) : se.fill(r, t)), xe("click", o, (t) => {
			if (N._lock) return;
			Ge(t);
			let n = v.indexOf(e);
			if ((t.ctrlKey || t.metaKey) != M.isolate) {
				let e = v.some((e, t) => t > 0 && t != n && e.show);
				v.forEach((t, r) => {
					r > 0 && _n(r, e ? r == n ? _e : ve : _e, !0, Zn.setSeries);
				});
			} else _n(n, { show: !e.show }, !0, Zn.setSeries);
		}, !1), Je && xe(bl, o, (t) => {
			N._lock || (Ge(t), _n(v.indexOf(e), xn, !0, Zn.setSeries));
		}, !1)), pe) {
			let e = Rl("td", cl, a);
			e.textContent = "--", n.push(e);
		}
		return [a, n];
	}
	let be = /* @__PURE__ */ new Map();
	function xe(e, t, n, i = !0) {
		let a = be.get(t) || {}, o = N.bind[e](r, t, n, i);
		o && (Jl(e, t, a[e] = o), be.set(t, a));
	}
	function Se(e, t, n) {
		let r = be.get(t) || {};
		for (let n in r) (e == null || n == e) && (Yl(n, t, r[n]), delete r[n]);
		e ?? be.delete(t);
	}
	let Ce = 0, we = 0, Te = 0, F = 0, Ee = 0, De = 0, Oe = Ee, ke = De, Ae = Te, je = F, Me = 0, I = 0, Ne = 0, R = 0;
	r.bbox = {};
	let Pe = !1, Fe = !1, z = !1, Ie = !1, Le = !1, Re = !1;
	function ze(e, t, n) {
		(n || e != r.width || t != r.height) && Be(e, t), Ht(!1), z = !0, Fe = !0, qt();
	}
	function Be(e, t) {
		r.width = Ce = Te = e, r.height = we = F = t, Ee = De = 0, Ue(), We();
		let n = r.bbox;
		Me = n.left = Hu(Ee * Ml, .5), I = n.top = Hu(De * Ml, .5), Ne = n.width = Hu(Te * Ml, .5), R = n.height = Hu(F * Ml, .5);
	}
	function Ve() {
		let e = !1, t = 0;
		for (; !e;) {
			t++;
			let n = zt(t), i = Bt(t);
			e = t == 3 || n && i, e || (Be(r.width, r.height), Fe = !0);
		}
	}
	function He({ width: e, height: t }) {
		ze(e, t);
	}
	r.setSize = He;
	function Ue() {
		let e = !1, t = !1, n = !1, r = !1;
		y.forEach((i, a) => {
			if (i.show && i._show) {
				let { side: a, _size: o } = i, s = a % 2, c = o + (i.label == null ? 0 : i.labelSize);
				c > 0 && (s ? (Te -= c, a == 3 ? (Ee += c, r = !0) : n = !0) : (F -= c, a == 0 ? (De += c, e = !0) : t = !0));
			}
		}), nt[0] = e, nt[1] = n, nt[2] = t, nt[3] = r, Te -= ot[1] + ot[3], Ee += ot[3], F -= ot[2] + ot[0], De += ot[0];
	}
	function We() {
		let e = Ee + Te, t = De + F, n = Ee, r = De;
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
	if (N.dataIdx == null) {
		let e = N.hover, n = e.skip = new Set(e.skip ?? []);
		n.add(void 0);
		let r = e.prox = Nu(e.prox), i = e.bias ??= 0;
		N.dataIdx = (e, a, o, s) => {
			if (a == 0) return o;
			let c = o, l = r(e, a, o, s) ?? ku, u = l >= 0 && l < ku, d = T.ori == 0 ? Te : F, f = N.left, p = t[0], m = t[a];
			if (n.has(m[o])) {
				c = null;
				let e = null, t = null, r;
				if (i == 0 || i == -1) for (r = o; e == null && r-- > 0;) n.has(m[r]) || (e = r);
				if (i == 0 || i == 1) for (r = o; t == null && r++ < m.length;) n.has(m[r]) || (t = r);
				if (e != null || t != null) {
					if (u) {
						let n = e == null ? -Infinity : E(p[e], T, d, 0), r = t == null ? Infinity : E(p[t], T, d, 0), i = f - n, a = r - f;
						i <= a ? i <= l && (c = e) : a <= l && (c = t);
					} else c = t == null ? e : e == null ? t : o - e <= t - o ? e : t;
				}
			} else u && _u(f - E(p[o], T, d, 0)) > l && (c = null);
			return c;
		};
	}
	let Ge = (e) => {
		N.event = e;
	};
	N.idxs = j, N._lock = !1;
	let Ke = N.points;
	Ke.show = Nu(Ke.show), Ke.size = Nu(Ke.size), Ke.stroke = Nu(Ke.stroke), Ke.width = Nu(Ke.width), Ke.fill = Nu(Ke.fill);
	let qe = r.focus = sd({}, e.focus || { alpha: .3 }, N.focus), Je = qe.prox >= 0, Ye = Je && Ke.one, B = [], Xe = [], Ze = [];
	function Qe(e, t) {
		let n = Ke.show(r, t);
		if (n instanceof HTMLElement) return Fl(n, tl), Fl(n, e.class), Vl(n, -10, -10, Te, F), m.insertBefore(n, B[t]), n;
	}
	function $e(e, t) {
		if (i == 1 || t > 0) {
			let t = i == 1 && b[e.scale].time, n = e.value;
			e.value = t ? td(n) ? af(O, nf(n, ie)) : n || ae : n || Bf, e.label = e.label || (t ? Df : Ef);
		}
		if (Ye || t > 0) {
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
		if (P) {
			let n = ye(e, t);
			de.splice(t, 0, n[0]), fe.splice(t, 0, n[1]), M.values.push(null);
		}
		if (oe) {
			j.splice(t, 0, null);
			let n = null;
			Ye ? t == 0 && (n = Qe(e, t)) : t > 0 && (n = Qe(e, t)), B.splice(t, 0, n), Xe.splice(t, 0, 0), Ze.splice(t, 0, 0);
		}
		Yn("addSeries", t);
	}
	function et(e, t) {
		t ??= v.length, e = i == 1 ? Lp(e, t, Of, qf) : Lp(e, t, {}, Kf), v.splice(t, 0, e), $e(v[t], t);
	}
	r.addSeries = et;
	function tt(e) {
		if (v.splice(e, 1), P) {
			M.values.splice(e, 1), fe.splice(e, 1);
			let t = de.splice(e, 1)[0];
			Se(null, t.firstChild), t.remove();
		}
		oe && (j.splice(e, 1), B.splice(e, 1)[0].remove(), Xe.splice(e, 1), Ze.splice(e, 1)), Yn("delSeries", e);
	}
	r.delSeries = tt;
	let nt = [
		!1,
		!1,
		!1,
		!1
	];
	function rt(e, t) {
		if (e._show = e.show, e.show) {
			let n = e.side % 2, i = b[e.scale];
			i ??= (e.scale = n ? v[1].scale : S, b[e.scale]);
			let a = i.time;
			e.size = Nu(e.size), e.space = Nu(e.space), e.rotate = Nu(e.rotate), Qu(e.incrs) && e.incrs.forEach((e) => {
				!Ku.has(e) && Ku.set(e, qu(e));
			}), e.incrs = Nu(e.incrs || (i.distr == 2 ? Md : a ? _ == 1 ? Kd : Yd : Nd)), e.splits = Nu(e.splits || (a && i.distr == 1 ? k : i.distr == 3 ? jf : i.distr == 4 ? Mf : Af)), e.stroke = Nu(e.stroke), e.grid.stroke = Nu(e.grid.stroke), e.ticks.stroke = Nu(e.ticks.stroke), e.border.stroke = Nu(e.border.stroke);
			let o = e.values;
			e.values = Qu(o) && !Qu(o[0]) ? Nu(o) : a ? Qu(o) ? $d(O, Qd(o, ie)) : td(o) ? ef(O, o) : o || A : o || kf, e.filter = Nu(e.filter || (i.distr >= 3 && i.log == 10 ? Rf : i.distr == 3 && i.log == 2 ? zf : Iu)), e.font = Kp(e.font), e.labelFont = Kp(e.labelFont), e._size = e.size(r, null, t, 0), e._space = e._rotate = e._incrs = e._found = e._splits = e._values = null, e._size > 0 && (nt[t] = !0, e._el = zl(Xc, f));
		}
	}
	function it(e, t, n, r) {
		let [i, a, o, s] = n, c = t % 2, l = 0;
		return c == 0 && (s || a) && (l = t == 0 && !i || t == 2 && !o ? yu(Tf.size / 3) : 0), c == 1 && (i || o) && (l = t == 1 && !a || t == 3 && !s ? yu(Vf.size / 2) : 0), l;
	}
	let at = r.padding = (e.padding || [
		it,
		it,
		it,
		it
	]).map((e) => Nu(uu(e, it))), ot = r._padding = at.map((e, t) => e(r, t, nt, 0)), st, ct = null, lt = null, ut = i == 1 ? v[0].idxs : null, dt = null, ft = !1;
	function pt(e, n) {
		if (t = e ?? [], r.data = r._data = t, i == 2) {
			st = 0;
			for (let e = 1; e < v.length; e++) st += t[e][0].length;
		} else {
			t.length == 0 && (r.data = r._data = t = [[]]), dt = t[0], st = dt.length;
			let e = t;
			if (ne == 2) {
				e = t.slice();
				let n = e[0] = Array(st);
				for (let e = 0; e < st; e++) n[e] = e;
			}
			r._data = t = e;
		}
		if (Ht(!0), Yn("setData"), ne == 2 && (z = !0), n !== !1) {
			let e = T;
			e.auto(r, ft) ? mt() : gn(S, e.min, e.max), Ie ||= N.left >= 0, Re = !0, qt();
		}
	}
	r.setData = pt;
	function mt() {
		ft = !0;
		let e, n;
		i == 1 && (st > 0 ? (ct = ut[0] = 0, lt = ut[1] = st - 1, e = t[0][ct], n = t[0][lt], ne == 2 ? (e = ct, n = lt) : e == n && (ne == 3 ? [e, n] = ru(e, e, T.log, !1) : ne == 4 ? [e, n] = iu(e, e, T.log, !1) : T.time ? n = e + yu(86400 / _) : [e, n] = lu(e, n, au, !0))) : (ct = ut[0] = e = null, lt = ut[1] = n = null)), gn(S, e, n);
	}
	let ht, gt, _t, vt, yt, bt, xt, St, Ct, V;
	function wt(e, t, n, r, i, a) {
		e ??= gl, n ??= Xu, r ??= "butt", i ??= gl, a ??= "round", e != ht && (d.strokeStyle = ht = e), i != gt && (d.fillStyle = gt = i), t != _t && (d.lineWidth = _t = t), a != yt && (d.lineJoin = yt = a), r != bt && (d.lineCap = bt = r), n != vt && d.setLineDash(vt = n);
	}
	function Tt(e, t, n, r) {
		t != gt && (d.fillStyle = gt = t), e != xt && (d.font = xt = e), n != St && (d.textAlign = St = n), r != Ct && (d.textBaseline = Ct = r);
	}
	function Et(e, t, n, i, a = 0) {
		if (i.length > 0 && e.auto(r, ft) && (t == null || t.min == null)) {
			let t = uu(ct, 0), r = uu(lt, i.length - 1), o = n.min == null ? nu(i, t, r, a, e.distr == 3) : [n.min, n.max];
			e.min = xu(e.min, n.min = o[0]), e.max = Su(e.max, n.max = o[1]);
		}
	}
	let Dt = {
		min: null,
		max: null
	};
	function Ot() {
		for (let e in b) {
			let t = b[e];
			D[e] == null && (t.min == null || D[S] != null && t.auto(r, ft)) && (D[e] = Dt);
		}
		for (let e in b) {
			let t = b[e];
			D[e] == null && t.from != null && D[t.from] != null && (D[e] = Dt);
		}
		D[S] != null && Ht(!0);
		let e = {};
		for (let t in D) {
			let n = D[t];
			if (n != null) {
				let a = e[t] = od(b[t], rd);
				if (n.min != null) sd(a, n);
				else if (t != S || i == 2) {
					if (st == 0 && a.from == null) {
						let e = a.range(r, null, null, t);
						a.min = e[0], a.max = e[1];
					} else a.min = ku, a.max = -Infinity;
				}
			}
		}
		if (st > 0) {
			v.forEach((n, a) => {
				if (i == 1) {
					let i = n.scale, o = D[i];
					if (o == null) return;
					let s = e[i];
					if (a == 0) {
						let e = s.range(r, s.min, s.max, i);
						s.min = e[0], s.max = e[1], ct = Xl(s.min, t[0]), lt = Xl(s.max, t[0]), lt - ct > 1 && (t[0][ct] < s.min && ct++, t[0][lt] > s.max && lt--), n.min = dt[ct], n.max = dt[lt];
					} else n.show && n.auto && Et(s, o, n, t[a], n.sorted);
					n.idxs[0] = ct, n.idxs[1] = lt;
				} else if (a > 0 && n.show && n.auto) {
					let [r, i] = n.facets, o = r.scale, s = i.scale, [c, l] = t[a], u = e[o], d = e[s];
					u != null && Et(u, D[o], r, c, r.sorted), d != null && Et(d, D[s], i, l, i.sorted), n.min = i.min, n.max = i.max;
				}
			});
			for (let t in e) {
				let n = e[t], i = D[t];
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
			for (let e in n) z = !0, Yn("setScale", e);
			oe && N.left >= 0 && (Ie = Re = !0);
		}
		for (let e in D) D[e] = null;
	}
	function kt(e) {
		let t = ju(ct - 1, 0, st - 1), n = ju(lt + 1, 0, st - 1);
		for (; e[t] == null && t > 0;) t--;
		for (; e[n] == null && n < st - 1;) n++;
		return [t, n];
	}
	function At() {
		if (st > 0) {
			let e = v.some((e) => e._focus) && V != qe.alpha;
			e && (d.globalAlpha = V = qe.alpha), v.forEach((e, n) => {
				if (n > 0 && e.show && (jt(n, !1), jt(n, !0), e._paths == null)) {
					let a = V;
					V != e.alpha && (d.globalAlpha = V = e.alpha);
					let o = i == 2 ? [0, t[n][0].length - 1] : kt(t[n]);
					e._paths = e.paths(r, n, o[0], o[1]), V != a && (d.globalAlpha = V = a);
				}
			}), v.forEach((e, t) => {
				if (t > 0 && e.show) {
					let n = V;
					V != e.alpha && (d.globalAlpha = V = e.alpha), e._paths != null && Mt(t, !1);
					{
						let n = e._paths == null ? null : e._paths.gaps, i = e.points.show(r, t, ct, lt, n), a = e.points.filter(r, t, i, n);
						(i || a) && (e.points._paths = e.points.paths(r, t, ct, lt, a), Mt(t, !0));
					}
					V != n && (d.globalAlpha = V = n), Yn("drawSeries", t);
				}
			}), e && (d.globalAlpha = V = 1);
		}
	}
	function jt(e, t) {
		let n = t ? v[e].points : v[e];
		n._stroke = n.stroke(r, e), n._fill = n.fill(r, e);
	}
	function Mt(e, t) {
		let n = t ? v[e].points : v[e], { stroke: r, fill: i, clip: a, flags: o, _stroke: s = n._stroke, _fill: c = n._fill, _width: l = n.width } = n._paths;
		l = Gu(l * Ml, 3);
		let u = null, f = l % 2 / 2;
		t && c == null && (c = l > 0 ? "#fff" : s);
		let p = n.pxAlign == 1 && f > 0;
		if (p && d.translate(f, f), !t) {
			let e = Me - l / 2, t = I - l / 2, n = Ne + l, r = R + l;
			u = new Path2D(), u.rect(e, t, n, r);
		}
		t ? Pt(s, l, n.dash, n.cap, c, r, i, o, a) : Nt(e, s, l, n.dash, n.cap, c, r, i, o, u, a), p && d.translate(-f, -f);
	}
	function Nt(e, n, i, a, o, s, c, l, u, d, f) {
		let p = !1;
		u != 0 && x.forEach((m, h) => {
			if (m.series[0] == e) {
				let e = v[m.series[1]], g = t[m.series[1]], _ = (e._paths || Yu).band;
				Qu(_) && (_ = m.dir == 1 ? _[0] : _[1]);
				let y, b = null;
				e.show && _ && du(g, ct, lt) ? (b = m.fill(r, h) || s, y = e._paths.clip) : _ = null, Pt(n, i, a, o, b, c, l, u, d, f, y, _), p = !0;
			}
		}), p || Pt(n, i, a, o, s, c, l, u, d, f);
	}
	function Pt(e, t, n, r, i, a, o, s, c, l, u, f) {
		wt(e, t, n, r, i), (c || l || f) && (d.save(), c && d.clip(c), l && d.clip(l)), f ? (s & 3) == 3 ? (d.clip(f), u && d.clip(u), It(i, o), Ft(e, a, t)) : s & ep ? (It(i, o), d.clip(f), Ft(e, a, t)) : s & $f && (d.save(), d.clip(f), u && d.clip(u), It(i, o), d.restore(), Ft(e, a, t)) : (It(i, o), Ft(e, a, t)), (c || l || f) && d.restore();
	}
	function Ft(e, t, n) {
		n > 0 && (t instanceof Map ? t.forEach((e, t) => {
			d.strokeStyle = ht = t, d.stroke(e);
		}) : t != null && e && d.stroke(t));
	}
	function It(e, t) {
		t instanceof Map ? t.forEach((e, t) => {
			d.fillStyle = gt = t, d.fill(e);
		}) : t != null && e && d.fill(t);
	}
	function Lt(e, t, n, i) {
		let a = y[e], o;
		if (i <= 0) o = [0, 0];
		else {
			let s = a._space = a.space(r, e, t, n, i);
			o = Gp(t, n, a._incrs = a.incrs(r, e, t, n, i, s), i, s);
		}
		return a._found = o;
	}
	function Rt(e, t, n, r, i, a, o, s, c, l) {
		let u = o % 2 / 2;
		h == 1 && d.translate(u, u), wt(s, o, c, l, s), d.beginPath();
		let f, p, m, g, _ = i + (r == 0 || r == 3 ? -a : a);
		n == 0 ? (p = i, g = _) : (f = i, m = _);
		for (let r = 0; r < e.length; r++) t[r] != null && (n == 0 ? f = m = e[r] : p = g = e[r], d.moveTo(f, p), d.lineTo(m, g));
		d.stroke(), h == 1 && d.translate(-u, -u);
	}
	function zt(e) {
		let t = !0;
		return y.forEach((n, i) => {
			if (!n.show) return;
			let a = b[n.scale];
			if (a.min == null) {
				n._show && (t = !1, n._show = !1, Ht(!1));
				return;
			}
			n._show || (t = !1, n._show = !0, Ht(!1));
			let o = n.side, s = o % 2, { min: c, max: l } = a, [u, d] = Lt(i, c, l, s == 0 ? Te : F);
			if (d == 0) return;
			let f = a.distr == 2, p = n._splits = n.splits(r, i, c, l, u, d, f), m = a.distr == 2 ? p.map((e) => dt[e]) : p, h = a.distr == 2 ? dt[p[1]] - dt[p[0]] : u, g = n._values = n.values(r, n.filter(r, m, i, d, h), i, d, h);
			n._rotate = o == 2 ? n.rotate(r, g, i, d) : 0;
			let _ = n._size;
			n._size = bu(n.size(r, g, i, e)), _ != null && n._size != _ && (t = !1);
		}), t;
	}
	function Bt(e) {
		let t = !0;
		return at.forEach((n, i) => {
			let a = n(r, i, nt, e);
			a != ot[i] && (t = !1), ot[i] = a;
		}), t;
	}
	function Vt() {
		for (let e = 0; e < y.length; e++) {
			let t = y[e];
			if (!t.show || !t._show) continue;
			let n = t.side, i = n % 2, a, o, c = t.stroke(r, e), l = n == 0 || n == 3 ? -1 : 1, [u, f] = t._found;
			if (t.label != null) {
				let s = t.labelGap * l, p = yu((t._lpos + s) * Ml);
				Tt(t.labelFont[0], c, "center", n == 2 ? dl : fl), d.save(), i == 1 ? (a = o = 0, d.translate(p, yu(I + R / 2)), d.rotate((n == 3 ? -gu : gu) / 2)) : (a = yu(Me + Ne / 2), o = p);
				let m = Mu(t.label) ? t.label(r, e, u, f) : t.label;
				d.fillText(m, a, o), d.restore();
			}
			if (f == 0) continue;
			let p = b[t.scale], m = i == 0 ? Ne : R, h = i == 0 ? Me : I, _ = t._splits, v = p.distr == 2 ? _.map((e) => dt[e]) : _, x = p.distr == 2 ? dt[_[1]] - dt[_[0]] : u, S = t.ticks, C = t.border, ee = S.show ? S.size : 0, te = yu(ee * Ml), w = yu((t.alignTo == 2 ? t._size - ee - t.gap : t.gap) * Ml), T = t._rotate * -gu / 180, ne = g(t._pos * Ml), E = ne + (te + w) * l;
			o = i == 0 ? E : 0, a = i == 1 ? E : 0;
			let re = t.font[0];
			Tt(re, c, t.align == 1 ? pl : t.align == 2 ? ml : T > 0 ? pl : T < 0 ? ml : i == 0 ? "center" : n == 3 ? ml : pl, T || i == 1 ? "middle" : n == 2 ? dl : fl);
			let D = t.font[1] * t.lineGap, O = _.map((e) => g(s(e, p, m, h))), ie = t._values;
			for (let e = 0; e < ie.length; e++) {
				let t = ie[e];
				if (t != null) {
					i == 0 ? a = O[e] : o = O[e], t = "" + t;
					let n = t.indexOf("\n") == -1 ? [t] : t.split(/\n/gm);
					for (let e = 0; e < n.length; e++) {
						let t = n[e];
						T ? (d.save(), d.translate(a, o + e * D), d.rotate(T), d.fillText(t, 0, 0), d.restore()) : d.fillText(t, a, o + e * D);
					}
				}
			}
			S.show && Rt(O, S.filter(r, v, e, f, x), i, n, ne, te, Gu(S.width * Ml, 3), S.stroke(r, e), S.dash, S.cap);
			let k = t.grid;
			k.show && Rt(O, k.filter(r, v, e, f, x), i, i == 0 ? 2 : 1, i == 0 ? I : Me, i == 0 ? R : Ne, Gu(k.width * Ml, 3), k.stroke(r, e), k.dash, k.cap), C.show && Rt([ne], [1], +(i == 0), i == 0 ? 1 : 2, i == 1 ? I : Me, i == 1 ? R : Ne, Gu(C.width * Ml, 3), C.stroke(r, e), C.dash, C.cap);
		}
		Yn("drawAxes");
	}
	function Ht(e) {
		v.forEach((t, n) => {
			n > 0 && (t._paths = null, e && (i == 1 ? (t.min = null, t.max = null) : t.facets.forEach((e) => {
				e.min = null, e.max = null;
			})));
		});
	}
	let Ut = !1, Wt = !1, Gt = [];
	function Kt() {
		Wt = !1;
		for (let e = 0; e < Gt.length; e++) Yn(...Gt[e]);
		Gt.length = 0;
	}
	function qt() {
		Ut ||= (pd(Yt), !0);
	}
	function Jt(e, t = !1) {
		Ut = !0, Wt = t, e(r), Yt(), t && Gt.length > 0 && queueMicrotask(Kt);
	}
	r.batch = Jt;
	function Yt() {
		if (Pe &&= (Ot(), !1), z &&= (Ve(), !1), Fe) {
			if (Ll(p, pl, Ee), Ll(p, dl, De), Ll(p, ll, Te), Ll(p, ul, F), Ll(m, pl, Ee), Ll(m, dl, De), Ll(m, ll, Te), Ll(m, ul, F), Ll(f, ll, Ce), Ll(f, ul, we), u.width = yu(Ce * Ml), u.height = yu(we * Ml), y.forEach(({ _el: e, _show: t, _size: n, _pos: r, side: i }) => {
				if (e != null) {
					if (t) {
						let t = i === 3 || i === 0 ? n : 0, a = i % 2 == 1;
						Ll(e, a ? "left" : "top", r - t), Ll(e, a ? "width" : "height", n), Ll(e, a ? "top" : "left", a ? De : Ee), Ll(e, a ? "height" : "width", a ? F : Te), Il(e, Zc);
					} else Fl(e, Zc);
				}
			}), ht = gt = _t = yt = bt = xt = St = Ct = vt = null, V = 1, Pn(!0), Ee != Oe || De != ke || Te != Ae || F != je) {
				Ht(!1);
				let e = Te / Ae, t = F / je;
				if (oe && !Ie && N.left >= 0) {
					N.left *= e, N.top *= t, H && Vl(H, yu(N.left), 0, Te, F), $t && Vl($t, 0, yu(N.top), Te, F);
					for (let n = 0; n < B.length; n++) {
						let r = B[n];
						r != null && (Xe[n] *= e, Ze[n] *= t, Vl(r, bu(Xe[n]), bu(Ze[n]), Te, F));
					}
				}
				if (fn.show && !Le && fn.left >= 0 && fn.width > 0) {
					fn.left *= e, fn.width *= e, fn.top *= t, fn.height *= t;
					for (let e in In) Ll(pn, e, fn[e]);
				}
				Oe = Ee, ke = De, Ae = Te, je = F;
			}
			Yn("setSize"), Fe = !1;
		}
		Ce > 0 && we > 0 && (d.clearRect(0, 0, u.width, u.height), Yn("drawClear"), ee.forEach((e) => e()), Yn("draw")), fn.show && Le && (mn(fn), Le = !1), oe && Ie && (Mn(null, !0, !1), Ie = !1), M.show && M.live && Re && (An(), Re = !1), c || (c = !0, r.status = 1, Yn("ready")), ft = !1, Ut = !1;
	}
	r.redraw = (e, t) => {
		z = t || !1, e === !1 ? qt() : gn(S, T.min, T.max);
	};
	function Xt(e, n) {
		let i = b[e];
		if (i.from == null) {
			if (st == 0) {
				let t = i.range(r, n.min, n.max, e);
				n.min = t[0], n.max = t[1];
			}
			if (n.min > n.max) {
				let e = n.min;
				n.min = n.max, n.max = e;
			}
			if (st > 1 && n.min != null && n.max != null && n.max - n.min < 1e-16) return;
			e == S && i.distr == 2 && st > 0 && (n.min = Xl(n.min, t[0]), n.max = Xl(n.max, t[0]), n.min == n.max && n.max++), D[e] = n, Pe = !0, qt();
		}
	}
	r.setScale = Xt;
	let Zt, Qt, H, $t, U, en, tn, nn, rn, an, on, sn, cn = !1, ln = N.drag, un = ln.x, dn = ln.y;
	oe && (N.x && (Zt = zl($c, m)), N.y && (Qt = zl(el, m)), T.ori == 0 ? (H = Zt, $t = Qt) : (H = Qt, $t = Zt), on = N.left, sn = N.top);
	let fn = r.select = sd({
		show: !0,
		over: !0,
		left: 0,
		width: 0,
		top: 0,
		height: 0
	}, e.select), pn = fn.show ? zl(Qc, fn.over ? m : p) : null;
	function mn(e, t) {
		if (fn.show) {
			for (let t in e) fn[t] = e[t], t in In && Ll(pn, t, e[t]);
			t !== !1 && Yn("setSelect");
		}
	}
	r.setSelect = mn;
	function hn(e) {
		if (v[e].show) P && Il(de[e], Zc);
		else if (P && Fl(de[e], Zc), oe) {
			let t = Ye ? B[0] : B[e];
			t != null && Vl(t, -10, -10, Te, F);
		}
	}
	function gn(e, t, n) {
		Xt(e, {
			min: t,
			max: n
		});
	}
	function _n(e, t, n, a) {
		t.focus != null && Sn(e), t.show != null && v.forEach((n, r) => {
			r > 0 && (e == r || e == null) && (n.show = t.show, hn(r), i == 2 ? (gn(n.facets[0].scale, null, null), gn(n.facets[1].scale, null, null)) : gn(n.scale, null, null), qt());
		}), n !== !1 && Yn("setSeries", e, t), a && er("setSeries", r, e, t);
	}
	r.setSeries = _n;
	function vn(e, t) {
		sd(x[e], t);
	}
	function W(e, t) {
		e.fill = Nu(e.fill || null), e.dir = uu(e.dir, -1), t ??= x.length, x.splice(t, 0, e);
	}
	function G(e) {
		e == null ? x.length = 0 : x.splice(e, 1);
	}
	r.addBand = W, r.setBand = vn, r.delBand = G;
	function K(e, t) {
		v[e].alpha = t, oe && B[e] != null && (B[e].style.opacity = t), P && de[e] && (de[e].style.opacity = t);
	}
	let q, yn, bn, xn = { focus: !0 };
	function Sn(e) {
		if (e != bn) {
			let t = e == null, n = qe.alpha != 1;
			v.forEach((r, a) => {
				if (i == 1 || a > 0) {
					let i = t || a == 0 || a == e;
					r._focus = t ? null : i, n && K(a, i ? 1 : qe.alpha);
				}
			}), bn = e, n && qt();
		}
	}
	P && Je && xe(xl, ce, (e) => {
		N._lock || (Ge(e), bn != null && _n(null, xn, !0, Zn.setSeries));
	});
	function Cn(e, t, n) {
		let r = b[t];
		n && (e = e / Ml - (r.ori == 1 ? De : Ee));
		let i = Te;
		r.ori == 1 && (i = F, e = i - e), r.dir == -1 && (e = i - e);
		let a = r._min, o = r._max, s = e / i, c = a + (o - a) * s, l = r.distr;
		return l == 3 ? Cu(10, c) : l == 4 ? Du(c, r.asinh) : l == 100 ? r.bwd(c) : c;
	}
	function wn(e, n) {
		return Xl(Cn(e, S, n), t[0], ct, lt);
	}
	r.valToIdx = (e) => Xl(e, t[0]), r.posToIdx = wn, r.posToVal = Cn, r.valToPos = (e, t, n) => b[t].ori == 0 ? a(e, b[t], n ? Ne : Te, n ? Me : 0) : o(e, b[t], n ? R : F, n ? I : 0), r.setCursor = (e, t, n) => {
		on = e.left, sn = e.top, Mn(null, t, n);
	};
	function Tn(e, t) {
		Ll(pn, pl, fn.left = e), Ll(pn, ll, fn.width = t);
	}
	function En(e, t) {
		Ll(pn, dl, fn.top = e), Ll(pn, ul, fn.height = t);
	}
	let Dn = T.ori == 0 ? Tn : En, On = T.ori == 1 ? Tn : En;
	function kn() {
		if (P && M.live) for (let e = +(i == 2); e < v.length; e++) {
			if (e == 0 && me) continue;
			let t = M.values[e], n = 0;
			for (let r in t) fe[e][n++].firstChild.nodeValue = t[r];
		}
	}
	function An(e, t) {
		if (e != null && (e.idxs ? e.idxs.forEach((e, t) => {
			j[t] = e;
		}) : ed(e.idx) || j.fill(e.idx), M.idx = j[0]), P && M.live) {
			for (let e = 0; e < v.length; e++) (e > 0 || i == 1 && !me) && jn(e, j[e]);
			kn();
		}
		Re = !1, t !== !1 && Yn("setLegend");
	}
	r.setLegend = An;
	function jn(e, n) {
		let i = v[e], a = e == 0 && ne == 2 ? dt : t[e], o;
		me ? o = i.values(r, e, n) ?? he : (o = i.value(r, n == null ? null : a[n], e, n), o = o == null ? he : { _: o }), M.values[e] = o;
	}
	function Mn(e, n, a) {
		rn = on, an = sn, [on, sn] = N.move(r, on, sn), N.left = on, N.top = sn, oe && (H && Vl(H, yu(on), 0, Te, F), $t && Vl($t, 0, yu(sn), Te, F));
		let o, s = ct > lt;
		q = ku, yn = null;
		let c = T.ori == 0 ? Te : F, l = T.ori == 1 ? Te : F;
		if (on < 0 || st == 0 || s) {
			o = N.idx = null;
			for (let e = 0; e < v.length; e++) {
				let t = B[e];
				t != null && Vl(t, -10, -10, Te, F);
			}
			Je && _n(null, xn, !0, e == null && Zn.setSeries), M.live && (j.fill(o), Re = !0);
		} else {
			let e, n, a;
			i == 1 && (e = T.ori == 0 ? on : sn, n = Cn(e, S), o = N.idx = Xl(n, t[0], ct, lt), a = E(t[0][o], T, c, 0));
			let s = -10, u = -10, d = 0, f = 0, p = !0, m = "", h = "";
			for (let e = +(i == 2); e < v.length; e++) {
				let g = v[e], _ = j[e], y = _ == null ? null : i == 1 ? t[e][_] : t[e][1][_], x = N.dataIdx(r, e, o, n), S = x == null ? null : i == 1 ? t[e][x] : t[e][1][x];
				if (Re = Re || S != y || x != _, j[e] = x, e > 0 && g.show) {
					let n = x == null ? -10 : x == o ? a : E(i == 1 ? t[0][x] : t[e][0][x], T, c, 0), _ = S == null ? -10 : re(S, i == 1 ? b[g.scale] : b[g.facets[1].scale], l, 0);
					if (Je && S != null) {
						let t = T.ori == 1 ? on : sn, n = _u(qe.dist(r, e, x, _, t));
						if (n < q) {
							let r = qe.bias;
							if (r != 0) {
								let i = Cn(t, g.scale), a = S >= 0 ? 1 : -1, o = i >= 0 ? 1 : -1;
								o == a && (o == 1 ? r == 1 ? S >= i : S <= i : r == 1 ? S <= i : S >= i) && (q = n, yn = e);
							} else q = n, yn = e;
						}
					}
					if (Re || Ye) {
						let t, i;
						T.ori == 0 ? (t = n, i = _) : (t = _, i = n);
						let a, o, c, l, g, v, y = !0, b = Ke.bbox;
						if (b != null) {
							y = !1;
							let t = b(r, e);
							c = t.left, l = t.top, a = t.width, o = t.height;
						} else c = t, l = i, a = o = Ke.size(r, e);
						if (v = Ke.fill(r, e), g = Ke.stroke(r, e), Ye) e == yn && q <= qe.prox && (s = c, u = l, d = a, f = o, p = y, m = v, h = g);
						else {
							let t = B[e];
							t != null && (Xe[e] = c, Ze[e] = l, Gl(t, a, o, y), Ul(t, v, g), Vl(t, bu(c), bu(l), Te, F));
						}
					}
				}
			}
			if (Ye) {
				let e = qe.prox;
				if (Re || (bn == null ? q <= e : q > e || yn != bn)) {
					let e = B[0];
					e != null && (Xe[0] = s, Ze[0] = u, Gl(e, d, f, p), Ul(e, m, h), Vl(e, bu(s), bu(u), Te, F));
				}
			}
		}
		if (fn.show && cn) {
			if (e != null) {
				let [t, n] = Zn.scales, [r, i] = Zn.match, [a, o] = e.cursor.sync.scales, s = e.cursor.drag;
				if (un = s._x, dn = s._y, un || dn) {
					let { left: s, top: u, width: d, height: f } = e.select, p = e.scales[a].ori, m = e.posToVal, h, g, _, v, y, x = t != null && r(t, a), S = n != null && i(n, o);
					x && un ? (p == 0 ? (h = s, g = d) : (h = u, g = f), _ = b[t], v = E(m(h, a), _, c, 0), y = E(m(h + g, a), _, c, 0), Dn(xu(v, y), _u(y - v))) : Dn(0, c), S && dn ? (p == 1 ? (h = s, g = d) : (h = u, g = f), _ = b[n], v = re(m(h, o), _, l, 0), y = re(m(h + g, o), _, l, 0), On(xu(v, y), _u(y - v))) : On(0, l);
				} else Ln();
			} else {
				let e = _u(rn - U), t = _u(an - en);
				if (T.ori == 1) {
					let n = e;
					e = t, t = n;
				}
				un = ln.x && e >= ln.dist, dn = ln.y && t >= ln.dist;
				let n = ln.uni;
				n == null ? ln.x && ln.y && (un || dn) && (un = dn = !0) : un && dn && (un = e >= n, dn = t >= n, !un && !dn && (t > e ? dn = !0 : un = !0));
				let r, i;
				un && (T.ori == 0 ? (r = tn, i = on) : (r = nn, i = sn), Dn(xu(r, i), _u(i - r)), dn || On(0, l)), dn && (T.ori == 1 ? (r = tn, i = on) : (r = nn, i = sn), On(xu(r, i), _u(i - r)), un || Dn(0, c)), !un && !dn && (Dn(0, 0), On(0, 0));
			}
		}
		if (ln._x = un, ln._y = dn, e == null) {
			if (a) {
				if (Qn != null) {
					let [e, t] = Zn.scales;
					Zn.values[0] = e == null ? null : Cn(T.ori == 0 ? on : sn, e), Zn.values[1] = t == null ? null : Cn(T.ori == 1 ? on : sn, t);
				}
				er(_l, r, on, sn, Te, F, o);
			}
			if (Je) {
				let e = a && Zn.setSeries, t = qe.prox;
				bn == null ? q <= t && _n(yn, xn, !0, e) : q > t ? _n(null, xn, !0, e) : yn != bn && _n(yn, xn, !0, e);
			}
		}
		Re && (M.idx = o, An()), n !== !1 && Yn("setCursor");
	}
	let Nn = null;
	Object.defineProperty(r, "rect", { get() {
		return Nn ?? Pn(!1), Nn;
	} });
	function Pn(e = !1) {
		e ? Nn = null : (Nn = m.getBoundingClientRect(), Yn("syncRect", Nn));
	}
	function Fn(e, t, n, r, i, a, o) {
		N._lock || cn && e != null && e.movementX == 0 && e.movementY == 0 || (J(e, t, n, r, i, a, o, !1, e != null), e == null ? Mn(t, !0, !1) : Mn(null, !0, !0));
	}
	function J(e, t, n, i, a, o, c, l, u) {
		if (Nn ?? Pn(!1), Ge(e), e != null) n = e.clientX - Nn.left, i = e.clientY - Nn.top;
		else {
			if (n < 0 || i < 0) {
				on = -10, sn = -10;
				return;
			}
			let [e, r] = Zn.scales, c = t.cursor.sync, [l, u] = c.values, [d, f] = c.scales, [p, m] = Zn.match, h = t.axes[0].side % 2 == 1, g = T.ori == 0 ? Te : F, _ = T.ori == 1 ? Te : F, v = h ? o : a, y = h ? a : o, x = h ? i : n, S = h ? n : i;
			if (n = d == null ? x / v * g : p(e, d) ? s(l, b[e], g, 0) : -10, i = f == null ? S / y * _ : m(r, f) ? s(u, b[r], _, 0) : -10, T.ori == 1) {
				let e = n;
				n = i, i = e;
			}
		}
		u && (t == null || t.cursor.event.type == _l) && ((n <= 1 || n >= Te - 1) && (n = Hu(n, Te)), (i <= 1 || i >= F - 1) && (i = Hu(i, F))), l ? (U = n, en = i, [tn, nn] = N.move(r, n, i)) : (on = n, sn = i);
	}
	let In = {
		width: 0,
		height: 0,
		left: 0,
		top: 0
	};
	function Ln() {
		mn(In, !1);
	}
	let Rn, zn, Bn, Vn;
	function Hn(e, t, n, i, a, o, s) {
		cn = !0, un = dn = ln._x = ln._y = !1, J(e, t, n, i, a, o, s, !0, !1), e != null && (xe(yl, kl, Un, !1), er(vl, r, tn, nn, Te, F, null));
		let { left: c, top: l, width: u, height: d } = fn;
		Rn = c, zn = l, Bn = u, Vn = d;
	}
	function Un(e, t, n, i, a, o, s) {
		cn = ln._x = ln._y = !1, J(e, t, n, i, a, o, s, !1, !0);
		let { left: c, top: l, width: u, height: d } = fn, f = u > 0 || d > 0, p = Rn != c || zn != l || Bn != u || Vn != d;
		if (f && p && mn(fn), ln.setScale && f && p) {
			let e = c, t = u, n = l, r = d;
			if (T.ori == 1 && (e = l, t = d, n = c, r = u), un && gn(S, Cn(e, S), Cn(e + t, S)), dn) for (let e in b) {
				let t = b[e];
				e != S && t.from == null && t.min != ku && gn(e, Cn(n + r, e), Cn(n, e));
			}
			Ln();
		} else N.lock && (N._lock = !N._lock, Mn(t, !0, e != null));
		e != null && (Se(yl, kl), er(yl, r, on, sn, Te, F, null));
	}
	function Wn(e, t, n, r, i, a, o) {
		if (N._lock) return;
		Ge(e);
		let s = cn;
		if (cn) {
			let e = !0, t = !0, n, r;
			T.ori == 0 ? (n = un, r = dn) : (n = dn, r = un), n && r && (e = on <= 10 || on >= Te - 10, t = sn <= 10 || sn >= F - 10), n && e && (on = on < tn ? 0 : Te), r && t && (sn = sn < nn ? 0 : F), Mn(null, !0, !0), cn = !1;
		}
		on = -10, sn = -10, j.fill(null), Mn(null, !0, !0), s && (cn = s);
	}
	function Gn(e, t, n, i, a, o, s) {
		N._lock || (Ge(e), mt(), Ln(), e != null && er(Sl, r, on, sn, Te, F, null));
	}
	function Kn() {
		y.forEach(qp), ze(r.width, r.height, !0);
	}
	Jl(El, Al, Kn);
	let qn = {};
	qn.mousedown = Hn, qn.mousemove = Fn, qn.mouseup = Un, qn.dblclick = Gn, qn.setSeries = (e, t, n, i) => {
		let a = Zn.match[2];
		n = a(r, t, n), n != -1 && _n(n, i, !0, !1);
	}, oe && (xe(vl, m, Hn), xe(_l, m, Fn), xe(bl, m, (e) => {
		Ge(e), Pn(!1);
	}), xe(xl, m, Wn), xe(Sl, m, Gn), jp.add(r), r.syncRect = Pn);
	let Jn = r.hooks = e.hooks || {};
	function Yn(e, t, n) {
		Wt ? Gt.push([
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
	}, N.sync);
	Zn.match.length == 2 && Zn.match.push(Xn), N.sync = Zn;
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
		$n.unsub(r), jp.delete(r), be.clear(), Yl(El, Al, Kn), l.remove(), ce?.remove(), Yn("destroy");
	}
	r.destroy = nr;
	function rr() {
		Yn("init", e, t), pt(t || e.data, !1), D[S] ? Xt(S, D[S]) : mt(), Le = fn.show && (fn.width > 0 || fn.height > 0), Ie = Re = !0, ze(e.width, e.height);
	}
	return v.forEach($e), y.forEach(rt), n ? n instanceof HTMLElement ? (n.appendChild(l), rr()) : n(r, rr) : rr(), r;
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
	tt(t, !0);
	let n = xa(t, "time", 3, !1), r = xa(t, "xlabel", 3, ""), i = xa(t, "height", 3, 180), a = xa(t, "label", 3, ""), o = xa(t, "xaxis", 19, () => ({})), s = xa(t, "marks", 19, () => []), c, l = /* @__PURE__ */ H(0), u = (e, t) => /^#[0-9a-f]{6}$/i.test(e) ? e + Math.round(t * 255).toString(16).padStart(2, "0") : e;
	An(() => {
		let e = matchMedia("(prefers-color-scheme: dark)"), t = () => an(l);
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
	ga(d, (e) => c = e, () => c), J((e) => ra(d, "aria-label", e), [() => a() || `Chart: ${t.series.map((e) => e.label).join(", ")}`]), Z(e, d), nt();
}
// src/lib/ui/DetailPage.svelte
var Zp = /* @__PURE__ */ X("<p class=\"d-msg\"> <a class=\"d-link\" href=\"#/activity\">Back to activity</a></p>"), Qp = /* @__PURE__ */ X("<p class=\"d-msg\" role=\"alert\"><button class=\"d-btn\">Retry</button></p>"), $p = /* @__PURE__ */ X("<p class=\"d-msg\" aria-busy=\"true\">Loading…</p>"), em = /* @__PURE__ */ X("<article class=\"d-stack\"><header><h1 class=\"d-title\" tabindex=\"-1\"><!></h1> <!></header> <!></article>");
function tm(e, t) {
	tt(t, !0);
	let n = /* @__PURE__ */ H(null), r = /* @__PURE__ */ H(null), i = /* @__PURE__ */ H(void 0), a = g();
	async function o() {
		let e = a.next();
		U(r, null);
		try {
			let r = await h(t.url);
			if (!e.current) return;
			t.onloaded?.(r), U(n, r, !0);
		} catch (t) {
			e.current && U(r, t, !0);
		}
	}
	Sa(() => (o(), Sr().then(() => Y(i)?.focus({ preventScroll: !0 })), a.reset));
	var s = em(), c = W(s), l = W(c), u = W(l), d = (e) => {
		var r = qr();
		Si(G(r), () => t.title, () => Y(n)), Z(e, r);
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
	}), z(l), ga(l, (e) => U(i, e), () => Y(i));
	var _ = q(l, 2), v = (e) => {
		var r = qr();
		Si(G(r), () => t.subtitle ?? E, () => Y(n)), Z(e, r);
	};
	$(_, (e) => {
		Y(n) && e(v);
	}), z(c);
	var y = q(c, 2), b = (e) => {
		var n = Zp(), r = W(n);
		Ie(), z(n), J(() => Q(r, `This ${t.noun ?? ""} is not available. `)), Z(e, n);
	}, x = (e) => {
		var t = Qp();
		Fr("click", K(t), o), Z(e, t);
	}, S = (e) => {
		Z(e, $p());
	}, C = (e) => {
		var r = qr();
		Si(G(r), () => t.body, () => Y(n), () => o), Z(e, r);
	};
	$(y, (e) => {
		Y(r)?.status === 404 ? e(b) : Y(r) ? e(x, 1) : Y(n) ? e(C, -1) : e(S, 2);
	}), z(s), J(() => Hi(s, `--accent: var(${t.accent ?? ""})`)), Z(e, s), nt();
}
Ir(["click"]);
// src/lib/ui/Figure.svelte
var nm = /* @__PURE__ */ X(" <small class=\"svelte-12txda6\"> </small>", 1), rm = /* @__PURE__ */ X("<div><span class=\"caption\"> </span> <span class=\"value big svelte-12txda6\"> <!></span> <!></div>");
function im(e, t) {
	let n = xa(t, "unit", 3, ""), r = xa(t, "size", 3, "normal");
	var i = rm();
	let a;
	var o = W(i), s = K(o, !0), c = q(o, 2), l = W(c, !0), u = q(l), d = (e) => {
		var t = nm(), r = G(t, !0);
		r.nodeValue = " ";
		var i = K(q(r), !0);
		J(() => Q(i, n())), Z(e, t);
	};
	$(u, (e) => {
		n() && e(d);
	}), z(c), Si(q(c, 2), () => t.children ?? E), z(i), J(() => {
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
		function ne() {}
		ne.extend = function(e) {
			var t = function() {
				p(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
			}, i = t.__super__ = this.prototype, a = r(i);
			for (var o in a.constructor = t, t.prototype = a, this) Object.prototype.hasOwnProperty.call(this, o) && o !== "prototype" && o !== "__super__" && (t[o] = this[o]);
			return e.statics && n(t, e.statics), e.includes && (E(e.includes), n.apply(null, [a].concat(e.includes))), n(a, e), delete a.statics, delete a.includes, a.options && (a.options = i.options ? r(i.options) : {}, n(a.options, e.options)), a._initHooks = [], a.callInitHooks = function() {
				if (!this._initHooksCalled) {
					i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
					for (var e = 0, t = a._initHooks.length; e < t; e++) a._initHooks[e].call(this);
				}
			}, t;
		}, ne.include = function(e) {
			var t = this.prototype.options;
			return n(this.prototype, e), e.options && (this.prototype.options = t, this.mergeOptions(e.options)), this;
		}, ne.mergeOptions = function(e) {
			return n(this.prototype.options, e), this;
		}, ne.addInitHook = function(e) {
			var t = Array.prototype.slice.call(arguments, 1), n = typeof e == "function" ? e : function() {
				this[e].apply(this, t);
			};
			return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(n), this;
		};
		function E(e) {
			if (typeof L < "u" && L && L.Mixin) {
				e = _(e) ? e : [e];
				for (var t = 0; t < e.length; t++) e[t] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", (/* @__PURE__ */ Error()).stack);
			}
		}
		var re = {
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
		re.addEventListener = re.on, re.removeEventListener = re.clearAllEventListeners = re.off, re.addOneTimeEventListener = re.once, re.fireEvent = re.fire, re.hasEventListeners = re.listens;
		var D = ne.extend(re);
		function O(e, t, n) {
			this.x = n ? Math.round(e) : e, this.y = n ? Math.round(t) : t;
		}
		var ie = Math.trunc || function(e) {
			return e > 0 ? Math.floor(e) : Math.ceil(e);
		};
		O.prototype = {
			clone: function() {
				return new O(this.x, this.y);
			},
			add: function(e) {
				return this.clone()._add(k(e));
			},
			_add: function(e) {
				return this.x += e.x, this.y += e.y, this;
			},
			subtract: function(e) {
				return this.clone()._subtract(k(e));
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
				return new O(this.x * e.x, this.y * e.y);
			},
			unscaleBy: function(e) {
				return new O(this.x / e.x, this.y / e.y);
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
				return this.x = ie(this.x), this.y = ie(this.y), this;
			},
			distanceTo: function(e) {
				e = k(e);
				var t = e.x - this.x, n = e.y - this.y;
				return Math.sqrt(t * t + n * n);
			},
			equals: function(e) {
				return e = k(e), e.x === this.x && e.y === this.y;
			},
			contains: function(e) {
				return e = k(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y);
			},
			toString: function() {
				return "Point(" + u(this.x) + ", " + u(this.y) + ")";
			}
		};
		function k(e, t, n) {
			return e instanceof O ? e : _(e) ? new O(e[0], e[1]) : e == null ? e : typeof e == "object" && "x" in e && "y" in e ? new O(e.x, e.y) : new O(e, t, n);
		}
		function A(e, t) {
			if (e) for (var n = t ? [e, t] : e, r = 0, i = n.length; r < i; r++) this.extend(n[r]);
		}
		A.prototype = {
			extend: function(e) {
				var t, n;
				if (!e) return this;
				if (e instanceof O || typeof e[0] == "number" || "x" in e) t = n = k(e);
				else if (e = ae(e), t = e.min, n = e.max, !t || !n) return this;
				return !this.min && !this.max ? (this.min = t.clone(), this.max = n.clone()) : (this.min.x = Math.min(t.x, this.min.x), this.max.x = Math.max(n.x, this.max.x), this.min.y = Math.min(t.y, this.min.y), this.max.y = Math.max(n.y, this.max.y)), this;
			},
			getCenter: function(e) {
				return k((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, e);
			},
			getBottomLeft: function() {
				return k(this.min.x, this.max.y);
			},
			getTopRight: function() {
				return k(this.max.x, this.min.y);
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
				return e = typeof e[0] == "number" || e instanceof O ? k(e) : ae(e), e instanceof A ? (t = e.min, n = e.max) : t = n = e, t.x >= this.min.x && n.x <= this.max.x && t.y >= this.min.y && n.y <= this.max.y;
			},
			intersects: function(e) {
				e = ae(e);
				var t = this.min, n = this.max, r = e.min, i = e.max, a = i.x >= t.x && r.x <= n.x, o = i.y >= t.y && r.y <= n.y;
				return a && o;
			},
			overlaps: function(e) {
				e = ae(e);
				var t = this.min, n = this.max, r = e.min, i = e.max, a = i.x > t.x && r.x < n.x, o = i.y > t.y && r.y < n.y;
				return a && o;
			},
			isValid: function() {
				return !!(this.min && this.max);
			},
			pad: function(e) {
				var t = this.min, n = this.max, r = Math.abs(t.x - n.x) * e, i = Math.abs(t.y - n.y) * e;
				return ae(k(t.x - r, t.y - i), k(n.x + r, n.y + i));
			},
			equals: function(e) {
				return e ? (e = ae(e), this.min.equals(e.getTopLeft()) && this.max.equals(e.getBottomRight())) : !1;
			}
		};
		function ae(e, t) {
			return !e || e instanceof A ? e : new A(e, t);
		}
		function j(e, t) {
			if (e) for (var n = t ? [e, t] : e, r = 0, i = n.length; r < i; r++) this.extend(n[r]);
		}
		j.prototype = {
			extend: function(e) {
				var t = this._southWest, n = this._northEast, r, i;
				if (e instanceof N) r = e, i = e;
				else if (e instanceof j) {
					if (r = e._southWest, i = e._northEast, !r || !i) return this;
				} else return e ? this.extend(P(e) || M(e)) : this;
				return !t && !n ? (this._southWest = new N(r.lat, r.lng), this._northEast = new N(i.lat, i.lng)) : (t.lat = Math.min(r.lat, t.lat), t.lng = Math.min(r.lng, t.lng), n.lat = Math.max(i.lat, n.lat), n.lng = Math.max(i.lng, n.lng)), this;
			},
			pad: function(e) {
				var t = this._southWest, n = this._northEast, r = Math.abs(t.lat - n.lat) * e, i = Math.abs(t.lng - n.lng) * e;
				return new j(new N(t.lat - r, t.lng - i), new N(n.lat + r, n.lng + i));
			},
			getCenter: function() {
				return new N((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2);
			},
			getSouthWest: function() {
				return this._southWest;
			},
			getNorthEast: function() {
				return this._northEast;
			},
			getNorthWest: function() {
				return new N(this.getNorth(), this.getWest());
			},
			getSouthEast: function() {
				return new N(this.getSouth(), this.getEast());
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
				e = typeof e[0] == "number" || e instanceof N || "lat" in e ? P(e) : M(e);
				var t = this._southWest, n = this._northEast, r, i;
				return e instanceof j ? (r = e.getSouthWest(), i = e.getNorthEast()) : r = i = e, r.lat >= t.lat && i.lat <= n.lat && r.lng >= t.lng && i.lng <= n.lng;
			},
			intersects: function(e) {
				e = M(e);
				var t = this._southWest, n = this._northEast, r = e.getSouthWest(), i = e.getNorthEast(), a = i.lat >= t.lat && r.lat <= n.lat, o = i.lng >= t.lng && r.lng <= n.lng;
				return a && o;
			},
			overlaps: function(e) {
				e = M(e);
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
				return e ? (e = M(e), this._southWest.equals(e.getSouthWest(), t) && this._northEast.equals(e.getNorthEast(), t)) : !1;
			},
			isValid: function() {
				return !!(this._southWest && this._northEast);
			}
		};
		function M(e, t) {
			return e instanceof j ? e : new j(e, t);
		}
		function N(e, t, n) {
			if (isNaN(e) || isNaN(t)) throw Error("Invalid LatLng object: (" + e + ", " + t + ")");
			this.lat = +e, this.lng = +t, n !== void 0 && (this.alt = +n);
		}
		N.prototype = {
			equals: function(e, t) {
				return e ? (e = P(e), Math.max(Math.abs(this.lat - e.lat), Math.abs(this.lng - e.lng)) <= (t === void 0 ? 1e-9 : t)) : !1;
			},
			toString: function(e) {
				return "LatLng(" + u(this.lat, e) + ", " + u(this.lng, e) + ")";
			},
			distanceTo: function(e) {
				return se.distance(this, P(e));
			},
			wrap: function() {
				return se.wrapLatLng(this);
			},
			toBounds: function(e) {
				var t = 180 * e / 40075017, n = t / Math.cos(Math.PI / 180 * this.lat);
				return M([this.lat - t, this.lng - n], [this.lat + t, this.lng + n]);
			},
			clone: function() {
				return new N(this.lat, this.lng, this.alt);
			}
		};
		function P(e, t, n) {
			return e instanceof N ? e : _(e) && typeof e[0] != "object" ? e.length === 3 ? new N(e[0], e[1], e[2]) : e.length === 2 ? new N(e[0], e[1]) : null : e == null ? e : typeof e == "object" && "lat" in e ? new N(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : t === void 0 ? null : new N(e, t, n);
		}
		var oe = {
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
				return new A(this.transformation.transform(t.min, n), this.transformation.transform(t.max, n));
			},
			infinite: !1,
			wrapLatLng: function(e) {
				var t = this.wrapLng ? c(e.lng, this.wrapLng, !0) : e.lng, n = this.wrapLat ? c(e.lat, this.wrapLat, !0) : e.lat, r = e.alt;
				return new N(n, t, r);
			},
			wrapLatLngBounds: function(e) {
				var t = e.getCenter(), n = this.wrapLatLng(t), r = t.lat - n.lat, i = t.lng - n.lng;
				if (r === 0 && i === 0) return e;
				var a = e.getSouthWest(), o = e.getNorthEast();
				return new j(new N(a.lat - r, a.lng - i), new N(o.lat - r, o.lng - i));
			}
		}, se = n({}, oe, {
			wrapLng: [-180, 180],
			R: 6371e3,
			distance: function(e, t) {
				var n = Math.PI / 180, r = e.lat * n, i = t.lat * n, a = Math.sin((t.lat - e.lat) * n / 2), o = Math.sin((t.lng - e.lng) * n / 2), s = a * a + Math.cos(r) * Math.cos(i) * o * o, c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
				return this.R * c;
			}
		}), ce = 6378137, le = {
			R: ce,
			MAX_LATITUDE: 85.0511287798,
			project: function(e) {
				var t = Math.PI / 180, n = this.MAX_LATITUDE, r = Math.max(Math.min(n, e.lat), -n), i = Math.sin(r * t);
				return new O(this.R * e.lng * t, this.R * Math.log((1 + i) / (1 - i)) / 2);
			},
			unproject: function(e) {
				var t = 180 / Math.PI;
				return new N((2 * Math.atan(Math.exp(e.y / this.R)) - Math.PI / 2) * t, e.x * t / this.R);
			},
			bounds: (function() {
				var e = ce * Math.PI;
				return new A([-e, -e], [e, e]);
			})()
		};
		function ue(e, t, n, r) {
			_(e) ? (this._a = e[0], this._b = e[1], this._c = e[2], this._d = e[3]) : (this._a = e, this._b = t, this._c = n, this._d = r);
		}
		ue.prototype = {
			transform: function(e, t) {
				return this._transform(e.clone(), t);
			},
			_transform: function(e, t) {
				return t ||= 1, e.x = t * (this._a * e.x + this._b), e.y = t * (this._c * e.y + this._d), e;
			},
			untransform: function(e, t) {
				return t ||= 1, new O((e.x / t - this._b) / this._a, (e.y / t - this._d) / this._c);
			}
		};
		function de(e, t, n, r) {
			return new ue(e, t, n, r);
		}
		var fe = n({}, se, {
			code: "EPSG:3857",
			projection: le,
			transformation: function() {
				var e = .5 / (Math.PI * le.R);
				return de(e, .5, -e, .5);
			}()
		}), pe = n({}, fe, { code: "EPSG:900913" });
		function me(e) {
			return document.createElementNS("http://www.w3.org/2000/svg", e);
		}
		function he(e, t) {
			for (var n = "", r = 0, i, a = e.length, o, s, c; r < a; r++) {
				for (s = e[r], i = 0, o = s.length; i < o; i++) c = s[i], n += (i ? "L" : "M") + c.x + " " + c.y;
				n += t ? B.svg ? "z" : "x" : "";
			}
			return n || "M0 0";
		}
		var ge = document.documentElement.style, _e = "ActiveXObject" in window, ve = _e && !document.addEventListener, ye = "msLaunchUri" in navigator && !("documentMode" in document), be = Ye("webkit"), xe = Ye("android"), Se = Ye("android 2") || Ye("android 3"), Ce = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), we = xe && Ye("Google") && Ce < 537 && !("AudioNode" in window), Te = !!window.opera, F = !ye && Ye("chrome"), Ee = Ye("gecko") && !be && !Te && !_e, De = !F && Ye("safari"), Oe = Ye("phantom"), ke = "OTransition" in ge, Ae = navigator.platform.indexOf("Win") === 0, je = _e && "transition" in ge, Me = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Se, I = "MozPerspective" in ge, Ne = !window.L_DISABLE_3D && (je || Me || I) && !ke && !Oe, R = typeof orientation < "u" || Ye("mobile"), Pe = R && be, Fe = R && Me, z = !window.PointerEvent && window.MSPointerEvent, Ie = !!(window.PointerEvent || z), Le = "ontouchstart" in window || !!window.TouchEvent, Re = !window.L_NO_TOUCH && (Le || Ie), ze = R && Te, Be = R && Ee, Ve = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, He = function() {
			var e = !1;
			try {
				var t = Object.defineProperty({}, "passive", { get: function() {
					e = !0;
				} });
				window.addEventListener("testPassiveEventSupport", l, t), window.removeEventListener("testPassiveEventSupport", l, t);
			} catch {}
			return e;
		}(), Ue = function() {
			return !!document.createElement("canvas").getContext;
		}(), We = !!(document.createElementNS && me("svg").createSVGRect), Ge = !!We && (function() {
			var e = document.createElement("div");
			return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
		})(), Ke = !We && function() {
			try {
				var e = document.createElement("div");
				e.innerHTML = "<v:shape adj=\"1\"/>";
				var t = e.firstChild;
				return t.style.behavior = "url(#default#VML)", t && typeof t.adj == "object";
			} catch {
				return !1;
			}
		}(), qe = navigator.platform.indexOf("Mac") === 0, Je = navigator.platform.indexOf("Linux") === 0;
		function Ye(e) {
			return navigator.userAgent.toLowerCase().indexOf(e) >= 0;
		}
		var B = {
			ie: _e,
			ielt9: ve,
			edge: ye,
			webkit: be,
			android: xe,
			android23: Se,
			androidStock: we,
			opera: Te,
			chrome: F,
			gecko: Ee,
			safari: De,
			phantom: Oe,
			opera12: ke,
			win: Ae,
			ie3d: je,
			webkit3d: Me,
			gecko3d: I,
			any3d: Ne,
			mobile: R,
			mobileWebkit: Pe,
			mobileWebkit3d: Fe,
			msPointer: z,
			pointer: Ie,
			touch: Re,
			touchNative: Le,
			mobileOpera: ze,
			mobileGecko: Be,
			retina: Ve,
			passiveEvents: He,
			canvas: Ue,
			svg: We,
			vml: Ke,
			inlineSvg: Ge,
			mac: qe,
			linux: Je
		}, Xe = B.msPointer ? "MSPointerDown" : "pointerdown", Ze = B.msPointer ? "MSPointerMove" : "pointermove", Qe = B.msPointer ? "MSPointerUp" : "pointerup", $e = B.msPointer ? "MSPointerCancel" : "pointercancel", et = {
			touchstart: Xe,
			touchmove: Ze,
			touchend: Qe,
			touchcancel: $e
		}, tt = {
			touchstart: dt,
			touchmove: ut,
			touchend: ut,
			touchcancel: ut
		}, nt = {}, rt = !1;
		function it(e, t, n) {
			return t === "touchstart" && lt(), tt[t] ? (n = tt[t].bind(this, n), e.addEventListener(et[t], n, !1), n) : (console.warn("wrong event specified:", t), l);
		}
		function at(e, t, n) {
			et[t] ? e.removeEventListener(et[t], n, !1) : console.warn("wrong event specified:", t);
		}
		function ot(e) {
			nt[e.pointerId] = e;
		}
		function st(e) {
			nt[e.pointerId] && (nt[e.pointerId] = e);
		}
		function ct(e) {
			delete nt[e.pointerId];
		}
		function lt() {
			rt ||= (document.addEventListener(Xe, ot, !0), document.addEventListener(Ze, st, !0), document.addEventListener(Qe, ct, !0), document.addEventListener($e, ct, !0), !0);
		}
		function ut(e, t) {
			if (t.pointerType !== (t.MSPOINTER_TYPE_MOUSE || "mouse")) {
				for (var n in t.touches = [], nt) t.touches.push(nt[n]);
				t.changedTouches = [t], e(t);
			}
		}
		function dt(e, t) {
			t.MSPOINTER_TYPE_TOUCH && t.pointerType === t.MSPOINTER_TYPE_TOUCH && rn(t), ut(e, t);
		}
		function ft(e) {
			var t = {}, n, r;
			for (r in e) n = e[r], t[r] = n && n.bind ? n.bind(e) : n;
			return e = t, t.type = "dblclick", t.detail = 2, t.isTrusted = !1, t._simulated = !0, t;
		}
		var pt = 200;
		function mt(e, t) {
			e.addEventListener("dblclick", t);
			var n = 0, r;
			function i(e) {
				if (e.detail !== 1) r = e.detail;
				else if (!(e.pointerType === "mouse" || e.sourceCapabilities && !e.sourceCapabilities.firesTouchEvents)) {
					var i = on(e);
					if (!i.some(function(e) {
						return e instanceof HTMLLabelElement && e.attributes.for;
					}) || i.some(function(e) {
						return e instanceof HTMLInputElement || e instanceof HTMLSelectElement;
					})) {
						var a = Date.now();
						a - n <= pt ? (r++, r === 2 && t(ft(e))) : r = 1, n = a;
					}
				}
			}
			return e.addEventListener("click", i), {
				dblclick: t,
				simDblclick: i
			};
		}
		function ht(e, t) {
			e.removeEventListener("dblclick", t.dblclick), e.removeEventListener("click", t.simDblclick);
		}
		var gt = Mt([
			"transform",
			"webkitTransform",
			"OTransform",
			"MozTransform",
			"msTransform"
		]), _t = Mt([
			"webkitTransition",
			"transition",
			"OTransition",
			"MozTransition",
			"msTransition"
		]), vt = _t === "webkitTransition" || _t === "OTransition" ? _t + "End" : "transitionend";
		function yt(e) {
			return typeof e == "string" ? document.getElementById(e) : e;
		}
		function bt(e, t) {
			var n = e.style[t] || e.currentStyle && e.currentStyle[t];
			if ((!n || n === "auto") && document.defaultView) {
				var r = document.defaultView.getComputedStyle(e, null);
				n = r ? r[t] : null;
			}
			return n === "auto" ? null : n;
		}
		function xt(e, t, n) {
			var r = document.createElement(e);
			return r.className = t || "", n && n.appendChild(r), r;
		}
		function St(e) {
			var t = e.parentNode;
			t && t.removeChild(e);
		}
		function Ct(e) {
			for (; e.firstChild;) e.removeChild(e.firstChild);
		}
		function V(e) {
			var t = e.parentNode;
			t && t.lastChild !== e && t.appendChild(e);
		}
		function wt(e) {
			var t = e.parentNode;
			t && t.firstChild !== e && t.insertBefore(e, t.firstChild);
		}
		function Tt(e, t) {
			if (e.classList !== void 0) return e.classList.contains(t);
			var n = kt(e);
			return n.length > 0 && RegExp("(^|\\s)" + t + "(\\s|$)").test(n);
		}
		function Et(e, t) {
			if (e.classList !== void 0) for (var n = f(t), r = 0, i = n.length; r < i; r++) e.classList.add(n[r]);
			else if (!Tt(e, t)) {
				var a = kt(e);
				Ot(e, (a ? a + " " : "") + t);
			}
		}
		function Dt(e, t) {
			e.classList === void 0 ? Ot(e, d((" " + kt(e) + " ").replace(" " + t + " ", " "))) : e.classList.remove(t);
		}
		function Ot(e, t) {
			e.className.baseVal === void 0 ? e.className = t : e.className.baseVal = t;
		}
		function kt(e) {
			return e.correspondingElement && (e = e.correspondingElement), e.className.baseVal === void 0 ? e.className : e.className.baseVal;
		}
		function At(e, t) {
			"opacity" in e.style ? e.style.opacity = t : "filter" in e.style && jt(e, t);
		}
		function jt(e, t) {
			var n = !1, r = "DXImageTransform.Microsoft.Alpha";
			try {
				n = e.filters.item(r);
			} catch {
				if (t === 1) return;
			}
			t = Math.round(t * 100), n ? (n.Enabled = t !== 100, n.Opacity = t) : e.style.filter += " progid:" + r + "(opacity=" + t + ")";
		}
		function Mt(e) {
			for (var t = document.documentElement.style, n = 0; n < e.length; n++) if (e[n] in t) return e[n];
			return !1;
		}
		function Nt(e, t, n) {
			var r = t || new O(0, 0);
			e.style[gt] = (B.ie3d ? "translate(" + r.x + "px," + r.y + "px)" : "translate3d(" + r.x + "px," + r.y + "px,0)") + (n ? " scale(" + n + ")" : "");
		}
		function Pt(e, t) {
			e._leaflet_pos = t, B.any3d ? Nt(e, t) : (e.style.left = t.x + "px", e.style.top = t.y + "px");
		}
		function Ft(e) {
			return e._leaflet_pos || new O(0, 0);
		}
		var It, Lt, Rt;
		if ("onselectstart" in document) It = function() {
			Yt(window, "selectstart", rn);
		}, Lt = function() {
			Zt(window, "selectstart", rn);
		};
		else {
			var zt = Mt([
				"userSelect",
				"WebkitUserSelect",
				"OUserSelect",
				"MozUserSelect",
				"msUserSelect"
			]);
			It = function() {
				if (zt) {
					var e = document.documentElement.style;
					Rt = e[zt], e[zt] = "none";
				}
			}, Lt = function() {
				zt && (document.documentElement.style[zt] = Rt, Rt = void 0);
			};
		}
		function Bt() {
			Yt(window, "dragstart", rn);
		}
		function Vt() {
			Zt(window, "dragstart", rn);
		}
		var Ht, Ut;
		function Wt(e) {
			for (; e.tabIndex === -1;) e = e.parentNode;
			e.style && (Gt(), Ht = e, Ut = e.style.outlineStyle, e.style.outlineStyle = "none", Yt(window, "keydown", Gt));
		}
		function Gt() {
			Ht && (Ht.style.outlineStyle = Ut, Ht = void 0, Ut = void 0, Zt(window, "keydown", Gt));
		}
		function Kt(e) {
			do
				e = e.parentNode;
			while ((!e.offsetWidth || !e.offsetHeight) && e !== document.body);
			return e;
		}
		function qt(e) {
			var t = e.getBoundingClientRect();
			return {
				x: t.width / e.offsetWidth || 1,
				y: t.height / e.offsetHeight || 1,
				boundingClientRect: t
			};
		}
		var Jt = {
			__proto__: null,
			TRANSFORM: gt,
			TRANSITION: _t,
			TRANSITION_END: vt,
			get: yt,
			getStyle: bt,
			create: xt,
			remove: St,
			empty: Ct,
			toFront: V,
			toBack: wt,
			hasClass: Tt,
			addClass: Et,
			removeClass: Dt,
			setClass: Ot,
			getClass: kt,
			setOpacity: At,
			testProp: Mt,
			setTransform: Nt,
			setPosition: Pt,
			getPosition: Ft,
			get disableTextSelection() {
				return It;
			},
			get enableTextSelection() {
				return Lt;
			},
			disableImageDrag: Bt,
			enableImageDrag: Vt,
			preventOutline: Wt,
			restoreOutline: Gt,
			getSizedParentNode: Kt,
			getScale: qt
		};
		function Yt(e, t, n, r) {
			if (t && typeof t == "object") for (var i in t) $t(e, i, t[i], n);
			else {
				t = f(t);
				for (var a = 0, o = t.length; a < o; a++) $t(e, t[a], n, r);
			}
			return this;
		}
		var Xt = "_leaflet_events";
		function Zt(e, t, n, r) {
			if (arguments.length === 1) Qt(e), delete e[Xt];
			else if (t && typeof t == "object") for (var i in t) U(e, i, t[i], n);
			else if (t = f(t), arguments.length === 2) Qt(e, function(e) {
				return v(t, e) !== -1;
			});
			else for (var a = 0, o = t.length; a < o; a++) U(e, t[a], n, r);
			return this;
		}
		function Qt(e, t) {
			for (var n in e[Xt]) {
				var r = n.split(/\d/)[0];
				(!t || t(r)) && U(e, r, null, null, n);
			}
		}
		var H = {
			mouseenter: "mouseover",
			mouseleave: "mouseout",
			wheel: !("onwheel" in window) && "mousewheel"
		};
		function $t(e, t, n, r) {
			var i = t + o(n) + (r ? "_" + o(r) : "");
			if (e[Xt] && e[Xt][i]) return this;
			var a = function(t) {
				return n.call(r || e, t || window.event);
			}, s = a;
			!B.touchNative && B.pointer && t.indexOf("touch") === 0 ? a = it(e, t, a) : B.touch && t === "dblclick" ? a = mt(e, a) : "addEventListener" in e ? t === "touchstart" || t === "touchmove" || t === "wheel" || t === "mousewheel" ? e.addEventListener(H[t] || t, a, B.passiveEvents ? { passive: !1 } : !1) : t === "mouseenter" || t === "mouseleave" ? (a = function(t) {
				t ||= window.event, un(e, t) && s(t);
			}, e.addEventListener(H[t], a, !1)) : e.addEventListener(t, s, !1) : e.attachEvent("on" + t, a), e[Xt] = e[Xt] || {}, e[Xt][i] = a;
		}
		function U(e, t, n, r, i) {
			i ||= t + o(n) + (r ? "_" + o(r) : "");
			var a = e[Xt] && e[Xt][i];
			if (!a) return this;
			!B.touchNative && B.pointer && t.indexOf("touch") === 0 ? at(e, t, a) : B.touch && t === "dblclick" ? ht(e, a) : "removeEventListener" in e ? e.removeEventListener(H[t] || t, a, !1) : e.detachEvent("on" + t, a), e[Xt][i] = null;
		}
		function en(e) {
			return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, this;
		}
		function tn(e) {
			return $t(e, "wheel", en), this;
		}
		function nn(e) {
			return Yt(e, "mousedown touchstart dblclick contextmenu", en), e._leaflet_disable_click = !0, this;
		}
		function rn(e) {
			return e.preventDefault ? e.preventDefault() : e.returnValue = !1, this;
		}
		function an(e) {
			return rn(e), en(e), this;
		}
		function on(e) {
			if (e.composedPath) return e.composedPath();
			for (var t = [], n = e.target; n;) t.push(n), n = n.parentNode;
			return t;
		}
		function sn(e, t) {
			if (!t) return new O(e.clientX, e.clientY);
			var n = qt(t), r = n.boundingClientRect;
			return new O((e.clientX - r.left) / n.x - t.clientLeft, (e.clientY - r.top) / n.y - t.clientTop);
		}
		var cn = B.linux && B.chrome ? window.devicePixelRatio : B.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
		function ln(e) {
			return B.edge ? e.wheelDeltaY / 2 : e.deltaY && e.deltaMode === 0 ? -e.deltaY / cn : e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : e.deltaX || e.deltaZ ? 0 : e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : e.detail ? e.detail / -32765 * 60 : 0;
		}
		function un(e, t) {
			var n = t.relatedTarget;
			if (!n) return !0;
			try {
				for (; n && n !== e;) n = n.parentNode;
			} catch {
				return !1;
			}
			return n !== e;
		}
		var dn = {
			__proto__: null,
			on: Yt,
			off: Zt,
			stopPropagation: en,
			disableScrollPropagation: tn,
			disableClickPropagation: nn,
			preventDefault: rn,
			stop: an,
			getPropagationPath: on,
			getMousePosition: sn,
			getWheelDelta: ln,
			isExternalTarget: un,
			addListener: Yt,
			removeListener: Zt
		}, fn = D.extend({
			run: function(e, t, n, r) {
				this.stop(), this._el = e, this._inProgress = !0, this._duration = n || .25, this._easeOutPower = 1 / Math.max(r || .5, .2), this._startPos = Ft(e), this._offset = t.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
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
				t && n._round(), Pt(this._el, n), this.fire("step");
			},
			_complete: function() {
				w(this._animId), this._inProgress = !1, this.fire("end");
			},
			_easeOut: function(e) {
				return 1 - (1 - e) ** this._easeOutPower;
			}
		}), pn = D.extend({
			options: {
				crs: fe,
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
				t = p(this, t), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(e), this._initLayout(), this._onResize = i(this._onResize, this), this._initEvents(), t.maxBounds && this.setMaxBounds(t.maxBounds), t.zoom !== void 0 && (this._zoom = this._limitZoom(t.zoom)), t.center && t.zoom !== void 0 && this.setView(P(t.center), t.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = _t && B.any3d && !B.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), Yt(this._proxy, vt, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
			},
			setView: function(e, t, r) {
				return t = t === void 0 ? this._zoom : this._limitZoom(t), e = this._limitCenter(P(e), t, this.options.maxBounds), r ||= {}, this._stop(), this._loaded && !r.reset && r !== !0 && (r.animate !== void 0 && (r.zoom = n({ animate: r.animate }, r.zoom), r.pan = n({
					animate: r.animate,
					duration: r.duration
				}, r.pan)), this._zoom === t ? this._tryAnimatedPan(e, r.pan) : this._tryAnimatedZoom && this._tryAnimatedZoom(e, t, r.zoom)) ? (clearTimeout(this._sizeTimer), this) : (this._resetView(e, t, r.pan && r.pan.noMoveStart), this);
			},
			setZoom: function(e, t) {
				return this._loaded ? this.setView(this.getCenter(), e, { zoom: t }) : (this._zoom = e, this);
			},
			zoomIn: function(e, t) {
				return e ||= B.any3d ? this.options.zoomDelta : 1, this.setZoom(this._zoom + e, t);
			},
			zoomOut: function(e, t) {
				return e ||= B.any3d ? this.options.zoomDelta : 1, this.setZoom(this._zoom - e, t);
			},
			setZoomAround: function(e, t, n) {
				var r = this.getZoomScale(t), i = this.getSize().divideBy(2), a = (e instanceof O ? e : this.latLngToContainerPoint(e)).subtract(i).multiplyBy(1 - 1 / r), o = this.containerPointToLatLng(i.add(a));
				return this.setView(o, t, { zoom: n });
			},
			_getBoundsCenterZoom: function(e, t) {
				t ||= {}, e = e.getBounds ? e.getBounds() : M(e);
				var n = k(t.paddingTopLeft || t.padding || [0, 0]), r = k(t.paddingBottomRight || t.padding || [0, 0]), i = this.getBoundsZoom(e, !1, n.add(r));
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
				if (e = M(e), !e.isValid()) throw Error("Bounds are not valid.");
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
				if (e = k(e).round(), t ||= {}, !e.x && !e.y) return this.fire("moveend");
				if (t.animate !== !0 && !this.getSize().contains(e)) return this._resetView(this.unproject(this.project(this.getCenter()).add(e)), this.getZoom()), this;
				if (this._panAnim || (this._panAnim = new fn(), this._panAnim.on({
					step: this._onPanTransitionStep,
					end: this._onPanTransitionEnd
				}, this)), t.noMoveStart || this.fire("movestart"), t.animate !== !1) {
					Et(this._mapPane, "leaflet-pan-anim");
					var n = this._getMapPanePos().subtract(e).round();
					this._panAnim.run(this._mapPane, n, t.duration || .25, t.easeLinearity);
				} else this._rawPanBy(e), this.fire("move").fire("moveend");
				return this;
			},
			flyTo: function(e, t, n) {
				if (n ||= {}, n.animate === !1 || !B.any3d) return this.setView(e, t, n);
				this._stop();
				var r = this.project(this.getCenter()), i = this.project(e), a = this.getSize(), o = this._zoom;
				e = P(e), t = t === void 0 ? o : t;
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
				return e = M(e), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), e.isValid() ? (this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
				var n = this.getCenter(), r = this._limitCenter(n, this._zoom, M(e));
				return n.equals(r) || this.panTo(r, t), this._enforcingBounds = !1, this;
			},
			panInside: function(e, t) {
				t ||= {};
				var n = k(t.paddingTopLeft || t.padding || [0, 0]), r = k(t.paddingBottomRight || t.padding || [0, 0]), i = this.project(this.getCenter()), a = this.project(e), o = this.getPixelBounds(), s = ae([o.min.add(n), o.max.subtract(r)]), c = s.getSize();
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
					var t = e.coords.latitude, n = e.coords.longitude, r = new N(t, n), i = r.toBounds(e.coords.accuracy * 2), a = this._locateOptions;
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
				for (var e in this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), St(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest &&= (w(this._resizeRequest), null), this._clearHandlers(), this._loaded && this.fire("unload"), this._layers) this._layers[e].remove();
				for (e in this._panes) St(this._panes[e]);
				return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
			},
			createPane: function(e, t) {
				var n = xt("div", "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""), t || this._mapPane);
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
				return new j(this.unproject(e.getBottomLeft()), this.unproject(e.getTopRight()));
			},
			getMinZoom: function() {
				return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
			},
			getMaxZoom: function() {
				return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? Infinity : this._layersMaxZoom : this.options.maxZoom;
			},
			getBoundsZoom: function(e, t, n) {
				e = M(e), n = k(n || [0, 0]);
				var r = this.getZoom() || 0, i = this.getMinZoom(), a = this.getMaxZoom(), o = e.getNorthWest(), s = e.getSouthEast(), c = this.getSize().subtract(n), l = ae(this.project(s, r), this.project(o, r)).getSize(), u = B.any3d ? this.options.zoomSnap : 1, d = c.x / l.x, f = c.y / l.y, p = t ? Math.max(d, f) : Math.min(d, f);
				return r = this.getScaleZoom(p, r), u && (r = Math.round(r / (u / 100)) * (u / 100), r = t ? Math.ceil(r / u) * u : Math.floor(r / u) * u), Math.max(i, Math.min(a, r));
			},
			getSize: function() {
				return (!this._size || this._sizeChanged) && (this._size = new O(this._container.clientWidth || 0, this._container.clientHeight || 0), this._sizeChanged = !1), this._size.clone();
			},
			getPixelBounds: function(e, t) {
				var n = this._getTopLeftPoint(e, t);
				return new A(n, n.add(this.getSize()));
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
				return t = t === void 0 ? this._zoom : t, this.options.crs.latLngToPoint(P(e), t);
			},
			unproject: function(e, t) {
				return t = t === void 0 ? this._zoom : t, this.options.crs.pointToLatLng(k(e), t);
			},
			layerPointToLatLng: function(e) {
				var t = k(e).add(this.getPixelOrigin());
				return this.unproject(t);
			},
			latLngToLayerPoint: function(e) {
				return this.project(P(e))._round()._subtract(this.getPixelOrigin());
			},
			wrapLatLng: function(e) {
				return this.options.crs.wrapLatLng(P(e));
			},
			wrapLatLngBounds: function(e) {
				return this.options.crs.wrapLatLngBounds(M(e));
			},
			distance: function(e, t) {
				return this.options.crs.distance(P(e), P(t));
			},
			containerPointToLayerPoint: function(e) {
				return k(e).subtract(this._getMapPanePos());
			},
			layerPointToContainerPoint: function(e) {
				return k(e).add(this._getMapPanePos());
			},
			containerPointToLatLng: function(e) {
				var t = this.containerPointToLayerPoint(k(e));
				return this.layerPointToLatLng(t);
			},
			latLngToContainerPoint: function(e) {
				return this.layerPointToContainerPoint(this.latLngToLayerPoint(P(e)));
			},
			mouseEventToContainerPoint: function(e) {
				return sn(e, this._container);
			},
			mouseEventToLayerPoint: function(e) {
				return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
			},
			mouseEventToLatLng: function(e) {
				return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
			},
			_initContainer: function(e) {
				var t = this._container = yt(e);
				if (!t) throw Error("Map container not found.");
				if (t._leaflet_id) throw Error("Map container is already initialized.");
				Yt(t, "scroll", this._onScroll, this), this._containerId = o(t);
			},
			_initLayout: function() {
				var e = this._container;
				this._fadeAnimated = this.options.fadeAnimation && B.any3d, Et(e, "leaflet-container" + (B.touch ? " leaflet-touch" : "") + (B.retina ? " leaflet-retina" : "") + (B.ielt9 ? " leaflet-oldie" : "") + (B.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
				var t = bt(e, "position");
				t !== "absolute" && t !== "relative" && t !== "fixed" && t !== "sticky" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
			},
			_initPanes: function() {
				var e = this._panes = {};
				this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), Pt(this._mapPane, new O(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (Et(e.markerPane, "leaflet-zoom-hide"), Et(e.shadowPane, "leaflet-zoom-hide"));
			},
			_resetView: function(e, t, n) {
				Pt(this._mapPane, new O(0, 0));
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
				Pt(this._mapPane, this._getMapPanePos().subtract(e));
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
				var t = e ? Zt : Yt;
				t(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && t(window, "resize", this._onResize, this), B.any3d && this.options.transform3DLimit && (e ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
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
					if (r && r.listens(t, !0) && (i && !un(a, e) || (n.push(r), i)) || a === this._container) break;
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
					n === "mousedown" && Wt(t), this._fireDOMEvent(e, n);
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
					t === "contextmenu" && rn(e);
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
				return Ft(this._mapPane) || new O(0, 0);
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
				return ae([
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
				var r = this.project(e, t), i = this.getSize().divideBy(2), a = new A(r.subtract(i), r.add(i)), o = this._getBoundsOffset(a, n, t);
				return Math.abs(o.x) <= 1 && Math.abs(o.y) <= 1 ? e : this.unproject(r.add(o), t);
			},
			_limitOffset: function(e, t) {
				if (!t) return e;
				var n = this.getPixelBounds(), r = new A(n.min.add(e), n.max.add(e));
				return e.add(this._getBoundsOffset(r, t));
			},
			_getBoundsOffset: function(e, t, n) {
				var r = ae(this.project(t.getNorthEast(), n), this.project(t.getSouthWest(), n)), i = r.min.subtract(e.min), a = r.max.subtract(e.max);
				return new O(this._rebound(i.x, -a.x), this._rebound(i.y, -a.y));
			},
			_rebound: function(e, t) {
				return e + t > 0 ? Math.round(e - t) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(t));
			},
			_limitZoom: function(e) {
				var t = this.getMinZoom(), n = this.getMaxZoom(), r = B.any3d ? this.options.zoomSnap : 1;
				return r && (e = Math.round(e / r) * r), Math.max(t, Math.min(n, e));
			},
			_onPanTransitionStep: function() {
				this.fire("move");
			},
			_onPanTransitionEnd: function() {
				Dt(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
			},
			_tryAnimatedPan: function(e, t) {
				var n = this._getCenterOffset(e)._trunc();
				return (t && t.animate) !== !0 && !this.getSize().contains(n) ? !1 : (this.panBy(n, t), !0);
			},
			_createAnimProxy: function() {
				var e = this._proxy = xt("div", "leaflet-proxy leaflet-zoom-animated");
				this._panes.mapPane.appendChild(e), this.on("zoomanim", function(e) {
					var t = gt, n = this._proxy.style[t];
					Nt(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), n === this._proxy.style[t] && this._animatingZoom && this._onZoomTransitionEnd();
				}, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
			},
			_destroyAnimProxy: function() {
				St(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
			},
			_animMoveEnd: function() {
				var e = this.getCenter(), t = this.getZoom();
				Nt(this._proxy, this.project(e, t), this.getZoomScale(t, 1));
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
				this._mapPane && (n && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = t, Et(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
					center: e,
					zoom: t,
					noUpdate: r
				}), this._tempFireZoomEvent ||= this._zoom !== this._animateToZoom, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(i(this._onZoomTransitionEnd, this), 250));
			},
			_onZoomTransitionEnd: function() {
				this._animatingZoom && (this._mapPane && Dt(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
			}
		});
		function mn(e, t) {
			return new pn(e, t);
		}
		var hn = ne.extend({
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
				return Et(t, "leaflet-control"), n.indexOf("bottom") === -1 ? r.appendChild(t) : r.insertBefore(t, r.firstChild), this._map.on("unload", this.remove, this), this;
			},
			remove: function() {
				return this._map &&= (St(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), null), this;
			},
			_refocusOnMap: function(e) {
				this._map && e && e.screenX > 0 && e.screenY > 0 && this._map.getContainer().focus();
			}
		}), gn = function(e) {
			return new hn(e);
		};
		pn.include({
			addControl: function(e) {
				return e.addTo(this), this;
			},
			removeControl: function(e) {
				return e.remove(), this;
			},
			_initControlPos: function() {
				var e = this._controlCorners = {}, t = "leaflet-", n = this._controlContainer = xt("div", t + "control-container", this._container);
				function r(r, i) {
					var a = t + r + " " + t + i;
					e[r + i] = xt("div", a, n);
				}
				r("top", "left"), r("top", "right"), r("bottom", "left"), r("bottom", "right");
			},
			_clearControlPos: function() {
				for (var e in this._controlCorners) St(this._controlCorners[e]);
				St(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
			}
		});
		var _n = hn.extend({
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
				return hn.prototype.addTo.call(this, e), this._expandIfNotCollapsed();
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
				Et(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
				var e = this._map.getSize().y - (this._container.offsetTop + 50);
				return e < this._section.clientHeight ? (Et(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = e + "px") : Dt(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
			},
			collapse: function() {
				return Dt(this._container, "leaflet-control-layers-expanded"), this;
			},
			_initLayout: function() {
				var e = "leaflet-control-layers", t = this._container = xt("div", e), n = this.options.collapsed;
				t.setAttribute("aria-haspopup", !0), nn(t), tn(t);
				var r = this._section = xt("section", e + "-list");
				n && (this._map.on("click", this.collapse, this), Yt(t, {
					mouseenter: this._expandSafely,
					mouseleave: this.collapse
				}, this));
				var i = this._layersLink = xt("a", e + "-toggle", t);
				i.href = "#", i.title = "Layers", i.setAttribute("role", "button"), Yt(i, {
					keydown: function(e) {
						e.keyCode === 13 && this._expandSafely();
					},
					click: function(e) {
						rn(e), this._expandSafely();
					}
				}, this), n || this.expand(), this._baseLayersList = xt("div", e + "-base", r), this._separator = xt("div", e + "-separator", r), this._overlaysList = xt("div", e + "-overlays", r), t.appendChild(r);
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
				Ct(this._baseLayersList), Ct(this._overlaysList), this._layerControlInputs = [];
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
				e.overlay ? (r = document.createElement("input"), r.type = "checkbox", r.className = "leaflet-control-layers-selector", r.defaultChecked = n) : r = this._createRadioElement("leaflet-base-layers_" + o(this), n), this._layerControlInputs.push(r), r.layerId = o(e.layer), Yt(r, "click", this._onInputClick, this);
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
				this._preventClick = !0, Yt(e, "click", rn), this.expand();
				var t = this;
				setTimeout(function() {
					Zt(e, "click", rn), t._preventClick = !1;
				});
			}
		}), vn = function(e, t, n) {
			return new _n(e, t, n);
		}, W = hn.extend({
			options: {
				position: "topleft",
				zoomInText: "<span aria-hidden=\"true\">+</span>",
				zoomInTitle: "Zoom in",
				zoomOutText: "<span aria-hidden=\"true\">&#x2212;</span>",
				zoomOutTitle: "Zoom out"
			},
			onAdd: function(e) {
				var t = "leaflet-control-zoom", n = xt("div", t + " leaflet-bar"), r = this.options;
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
				var a = xt("a", n, r);
				return a.innerHTML = e, a.href = "#", a.title = t, a.setAttribute("role", "button"), a.setAttribute("aria-label", t), nn(a), Yt(a, "click", an), Yt(a, "click", i, this), Yt(a, "click", this._refocusOnMap, this), a;
			},
			_updateDisabled: function() {
				var e = this._map, t = "leaflet-disabled";
				Dt(this._zoomInButton, t), Dt(this._zoomOutButton, t), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || e._zoom === e.getMinZoom()) && (Et(this._zoomOutButton, t), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || e._zoom === e.getMaxZoom()) && (Et(this._zoomInButton, t), this._zoomInButton.setAttribute("aria-disabled", "true"));
			}
		});
		pn.mergeOptions({ zoomControl: !0 }), pn.addInitHook(function() {
			this.options.zoomControl && (this.zoomControl = new W(), this.addControl(this.zoomControl));
		});
		var G = function(e) {
			return new W(e);
		}, K = hn.extend({
			options: {
				position: "bottomleft",
				maxWidth: 100,
				metric: !0,
				imperial: !0
			},
			onAdd: function(e) {
				var t = "leaflet-control-scale", n = xt("div", t), r = this.options;
				return this._addScales(r, t + "-line", n), e.on(r.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), n;
			},
			onRemove: function(e) {
				e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
			},
			_addScales: function(e, t, n) {
				e.metric && (this._mScale = xt("div", t, n)), e.imperial && (this._iScale = xt("div", t, n));
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
		}, yn = hn.extend({
			options: {
				position: "bottomright",
				prefix: "<a href=\"https://leafletjs.com\" title=\"A JavaScript library for interactive maps\">" + (B.inlineSvg ? "<svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"8\" viewBox=\"0 0 12 8\" class=\"leaflet-attribution-flag\"><path fill=\"#4C7BE1\" d=\"M0 0h12v4H0z\"/><path fill=\"#FFD500\" d=\"M0 4h12v3H0z\"/><path fill=\"#E0BC00\" d=\"M0 7h12v1H0z\"/></svg> " : "") + "Leaflet</a>"
			},
			initialize: function(e) {
				p(this, e), this._attributions = {};
			},
			onAdd: function(e) {
				for (var t in e.attributionControl = this, this._container = xt("div", "leaflet-control-attribution"), nn(this._container), e._layers) e._layers[t].getAttribution && this.addAttribution(e._layers[t].getAttribution());
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
		pn.mergeOptions({ attributionControl: !0 }), pn.addInitHook(function() {
			this.options.attributionControl && new yn().addTo(this);
		}), hn.Layers = _n, hn.Zoom = W, hn.Scale = K, hn.Attribution = yn, gn.layers = vn, gn.zoom = G, gn.scale = q, gn.attribution = function(e) {
			return new yn(e);
		};
		var bn = ne.extend({
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
		var xn = { Events: re }, Sn = B.touch ? "touchstart mousedown" : "mousedown", Cn = D.extend({
			options: { clickTolerance: 3 },
			initialize: function(e, t, n, r) {
				p(this, r), this._element = e, this._dragStartTarget = t || e, this._preventOutline = n;
			},
			enable: function() {
				this._enabled ||= (Yt(this._dragStartTarget, Sn, this._onDown, this), !0);
			},
			disable: function() {
				this._enabled && (Cn._dragging === this && this.finishDrag(!0), Zt(this._dragStartTarget, Sn, this._onDown, this), this._enabled = !1, this._moved = !1);
			},
			_onDown: function(e) {
				if (this._enabled && (this._moved = !1, !Tt(this._element, "leaflet-zoom-anim"))) {
					if (e.touches && e.touches.length !== 1) Cn._dragging === this && this.finishDrag();
					else if (!(Cn._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) && (Cn._dragging = this, this._preventOutline && Wt(this._element), Bt(), It(), !this._moving)) {
						this.fire("down");
						var t = e.touches ? e.touches[0] : e, n = Kt(this._element);
						this._startPoint = new O(t.clientX, t.clientY), this._startPos = Ft(this._element), this._parentScale = qt(n);
						var r = e.type === "mousedown";
						Yt(document, r ? "mousemove" : "touchmove", this._onMove, this), Yt(document, r ? "mouseup" : "touchend touchcancel", this._onUp, this);
					}
				}
			},
			_onMove: function(e) {
				if (this._enabled) {
					if (e.touches && e.touches.length > 1) this._moved = !0;
					else {
						var t = e.touches && e.touches.length === 1 ? e.touches[0] : e, n = new O(t.clientX, t.clientY)._subtract(this._startPoint);
						(n.x || n.y) && (Math.abs(n.x) + Math.abs(n.y) < this.options.clickTolerance || (n.x /= this._parentScale.x, n.y /= this._parentScale.y, rn(e), this._moved || (this.fire("dragstart"), this._moved = !0, Et(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), Et(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(n), this._moving = !0, this._lastEvent = e, this._updatePosition()));
					}
				}
			},
			_updatePosition: function() {
				var e = { originalEvent: this._lastEvent };
				this.fire("predrag", e), Pt(this._element, this._newPos), this.fire("drag", e);
			},
			_onUp: function() {
				this._enabled && this.finishDrag();
			},
			finishDrag: function(e) {
				Dt(document.body, "leaflet-dragging"), this._lastTarget &&= (Dt(this._lastTarget, "leaflet-drag-target"), null), Zt(document, "mousemove touchmove", this._onMove, this), Zt(document, "mouseup touchend touchcancel", this._onUp, this), Vt(), Lt();
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
			var d = P([0, 0]), f = M(e);
			f.getNorthWest().distanceTo(f.getSouthWest()) * f.getNorthEast().distanceTo(f.getNorthWest()) < 1700 && (d = En(e));
			var p = e.length, m = [];
			for (n = 0; n < p; n++) {
				var h = P(e[n]);
				m.push(t.project(P([h.lat - d.lat, h.lng - d.lng])));
			}
			for (s = c = l = 0, n = 0, r = p - 1; n < p; r = n++) i = m[n], a = m[r], o = i.y * a.x - a.y * i.x, c += (i.x + a.x) * o, l += (i.y + a.y) * o, s += o * 3;
			u = s === 0 ? m[0] : [c / s, l / s];
			var g = t.unproject(k(u));
			return P([g.lat + d.lat, g.lng + d.lng]);
		}
		function En(e) {
			for (var t = 0, n = 0, r = 0, i = 0; i < e.length; i++) {
				var a = P(e[i]);
				t += a.lat, n += a.lng, r++;
			}
			return P([t / r, n / r]);
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
			return n & 8 ? (l = e.x + a * (c.y - e.y) / o, u = c.y) : n & 4 ? (l = e.x + a * (s.y - e.y) / o, u = s.y) : n & 2 ? (l = c.x, u = e.y + o * (c.x - e.x) / a) : n & 1 && (l = s.x, u = e.y + o * (s.x - e.x) / a), new O(l, u, i);
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
			return c > 0 && (l = ((e.x - i) * o + (e.y - a) * s) / c, l > 1 ? (i = n.x, a = n.y) : l > 0 && (i += o * l, a += s * l)), o = e.x - i, s = e.y - a, r ? o * o + s * s : new O(i, a);
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
			var u = P([0, 0]), d = M(e);
			d.getNorthWest().distanceTo(d.getSouthWest()) * d.getNorthEast().distanceTo(d.getNorthWest()) < 1700 && (u = En(e));
			var f = e.length, p = [];
			for (n = 0; n < f; n++) {
				var m = P(e[n]);
				p.push(t.project(P([m.lat - u.lat, m.lng - u.lng])));
			}
			for (n = 0, r = 0; n < f - 1; n++) r += p[n].distanceTo(p[n + 1]) / 2;
			if (r === 0) l = p[0];
			else for (n = 0, a = 0; n < f - 1; n++) if (o = p[n], s = p[n + 1], i = o.distanceTo(s), a += i, a > r) {
				c = (a - r) / i, l = [s.x - c * (s.x - o.x), s.y - c * (s.y - o.y)];
				break;
			}
			var h = t.unproject(k(l));
			return P([h.lat + u.lat, h.lng + u.lng]);
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
				return new O(e.lng, e.lat);
			},
			unproject: function(e) {
				return new N(e.y, e.x);
			},
			bounds: new A([-180, -90], [180, 90])
		}, Wn = {
			R: 6378137,
			R_MINOR: 6356752.314245179,
			bounds: new A([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),
			project: function(e) {
				var t = Math.PI / 180, n = this.R, r = e.lat * t, i = this.R_MINOR / n, a = Math.sqrt(1 - i * i), o = a * Math.sin(r), s = Math.tan(Math.PI / 4 - r / 2) / ((1 - o) / (1 + o)) ** (a / 2);
				return r = -n * Math.log(Math.max(s, 1e-10)), new O(e.lng * t * n, r);
			},
			unproject: function(e) {
				for (var t = 180 / Math.PI, n = this.R, r = this.R_MINOR / n, i = Math.sqrt(1 - r * r), a = Math.exp(-e.y / n), o = Math.PI / 2 - 2 * Math.atan(a), s = 0, c = .1, l; s < 15 && Math.abs(c) > 1e-7; s++) l = i * Math.sin(o), l = ((1 - l) / (1 + l)) ** (i / 2), c = Math.PI / 2 - 2 * Math.atan(a * l) - o, o += c;
				return new N(o * t, e.x * t / n);
			}
		}, Gn = {
			__proto__: null,
			LonLat: Un,
			Mercator: Wn,
			SphericalMercator: le
		}, Kn = n({}, se, {
			code: "EPSG:3395",
			projection: Wn,
			transformation: function() {
				var e = .5 / (Math.PI * Wn.R);
				return de(e, .5, -e, .5);
			}()
		}), qn = n({}, se, {
			code: "EPSG:4326",
			projection: Un,
			transformation: de(1 / 180, 1, -1 / 180, .5)
		}), Jn = n({}, oe, {
			projection: Un,
			transformation: de(1, 0, -1, 0),
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
		oe.Earth = se, oe.EPSG3395 = Kn, oe.EPSG3857 = fe, oe.EPSG900913 = pe, oe.EPSG4326 = qn, oe.Simple = Jn;
		var Yn = D.extend({
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
		pn.include({
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
				var e = new j();
				for (var t in this._layers) {
					var n = this._layers[t];
					e.extend(n.getBounds ? n.getBounds() : n.getLatLng());
				}
				return e;
			}
		}), $n = function(e, t) {
			return new Qn(e, t);
		}, er = ne.extend({
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
				var i = k(r), a = k(t === "shadow" && n.shadowAnchor || n.iconAnchor || i && i.divideBy(2, !0));
				e.className = "leaflet-marker-" + t + " " + (n.className || ""), a && (e.style.marginLeft = -a.x + "px", e.style.marginTop = -a.y + "px"), i && (e.style.width = i.x + "px", e.style.height = i.y + "px");
			},
			_createImg: function(e, t) {
				return t ||= document.createElement("img"), t.src = e, t;
			},
			_getIconUrl: function(e) {
				return B.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"];
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
				var e = xt("div", "leaflet-default-icon-path", document.body), t = bt(e, "background-image") || bt(e, "backgroundImage");
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
				}, this).enable(), Et(e, "leaflet-marker-draggable");
			},
			removeHooks: function() {
				this._draggable.off({
					dragstart: this._onDragStart,
					predrag: this._onPreDrag,
					drag: this._onDrag,
					dragend: this._onDragEnd
				}, this).disable(), this._marker._icon && Dt(this._marker._icon, "leaflet-marker-draggable");
			},
			moved: function() {
				return this._draggable && this._draggable._moved;
			},
			_adjustPan: function(e) {
				var t = this._marker, n = t._map, r = this._marker.options.autoPanSpeed, i = this._marker.options.autoPanPadding, a = Ft(t._icon), o = n.getPixelBounds(), s = n.getPixelOrigin(), c = ae(o.min._subtract(s).add(i), o.max._subtract(s).subtract(i));
				if (!c.contains(a)) {
					var l = k((Math.max(c.max.x, a.x) - c.max.x) / (o.max.x - c.max.x) - (Math.min(c.min.x, a.x) - c.min.x) / (o.min.x - c.min.x), (Math.max(c.max.y, a.y) - c.max.y) / (o.max.y - c.max.y) - (Math.min(c.min.y, a.y) - c.min.y) / (o.min.y - c.min.y)).multiplyBy(r);
					n.panBy(l, { animate: !1 }), this._draggable._newPos._add(l), this._draggable._startPos._add(l), Pt(t._icon, this._draggable._newPos), this._onDrag(e), this._panRequest = te(this._adjustPan.bind(this, e));
				}
			},
			_onDragStart: function() {
				this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
			},
			_onPreDrag: function(e) {
				this._marker.options.autoPan && (w(this._panRequest), this._panRequest = te(this._adjustPan.bind(this, e)));
			},
			_onDrag: function(e) {
				var t = this._marker, n = t._shadow, r = Ft(t._icon), i = t._map.layerPointToLatLng(r);
				n && Pt(n, r), t._latlng = i, e.latlng = i, e.oldLatLng = this._oldLatLng, t.fire("move", e).fire("drag", e);
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
				p(this, t), this._latlng = P(e);
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
				return this._latlng = P(e), this.update(), this.fire("move", {
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
				n !== this._icon && (this._icon && this._removeIcon(), r = !0, e.title && (n.title = e.title), n.tagName === "IMG" && (n.alt = e.alt || "")), Et(n, t), e.keyboard && (n.tabIndex = "0", n.setAttribute("role", "button")), this._icon = n, e.riseOnHover && this.on({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				}), this.options.autoPanOnFocus && Yt(n, "focus", this._panOnFocus, this);
				var i = e.icon.createShadow(this._shadow), a = !1;
				i !== this._shadow && (this._removeShadow(), a = !0), i && (Et(i, t), i.alt = ""), this._shadow = i, e.opacity < 1 && this._updateOpacity(), r && this.getPane().appendChild(this._icon), this._initInteraction(), i && a && this.getPane(e.shadowPane).appendChild(this._shadow);
			},
			_removeIcon: function() {
				this.options.riseOnHover && this.off({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				}), this.options.autoPanOnFocus && Zt(this._icon, "focus", this._panOnFocus, this), St(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
			},
			_removeShadow: function() {
				this._shadow && St(this._shadow), this._shadow = null;
			},
			_setPos: function(e) {
				this._icon && Pt(this._icon, e), this._shadow && Pt(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex();
			},
			_updateZIndex: function(e) {
				this._icon && (this._icon.style.zIndex = this._zIndex + e);
			},
			_animateZoom: function(e) {
				var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
				this._setPos(t);
			},
			_initInteraction: function() {
				if (this.options.interactive && (Et(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), rr)) {
					var e = this.options.draggable;
					this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new rr(this), e && this.dragging.enable();
				}
			},
			setOpacity: function(e) {
				return this.options.opacity = e, this._map && this._updateOpacity(), this;
			},
			_updateOpacity: function() {
				var e = this.options.opacity;
				this._icon && At(this._icon, e), this._shadow && At(this._shadow, e);
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
					var t = this.options.icon.options, n = t.iconSize ? k(t.iconSize) : k(0, 0), r = t.iconAnchor ? k(t.iconAnchor) : k(0, 0);
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
				p(this, t), this._latlng = P(e), this._radius = this.options.radius;
			},
			setLatLng: function(e) {
				var t = this._latlng;
				return this._latlng = P(e), this.redraw(), this.fire("move", {
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
				this._pxBounds = new A(this._point.subtract(r), this._point.add(r));
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
				if (typeof t == "number" && (t = n({}, r, { radius: t })), p(this, t), this._latlng = P(e), isNaN(this.options.radius)) throw Error("Circle radius cannot be NaN");
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
				return new j(this._map.layerPointToLatLng(this._point.subtract(e)), this._map.layerPointToLatLng(this._point.add(e)));
			},
			setStyle: or.prototype.setStyle,
			_project: function() {
				var e = this._latlng.lng, t = this._latlng.lat, n = this._map, r = n.options.crs;
				if (r.distance === se.distance) {
					var i = Math.PI / 180, a = this._mRadius / se.R / i, o = n.project([t + a, e]), s = n.project([t - a, e]), c = o.add(s).divideBy(2), l = n.unproject(c).lat, u = Math.acos((Math.cos(a * i) - Math.sin(t * i) * Math.sin(l * i)) / (Math.cos(t * i) * Math.cos(l * i))) / i;
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
				return t ||= this._defaultShape(), e = P(e), t.push(e), this._bounds.extend(e), this.redraw();
			},
			_setLatLngs: function(e) {
				this._bounds = new j(), this._latlngs = this._convertLatLngs(e);
			},
			_defaultShape: function() {
				return zn(this._latlngs) ? this._latlngs : this._latlngs[0];
			},
			_convertLatLngs: function(e) {
				for (var t = [], n = zn(e), r = 0, i = e.length; r < i; r++) n ? (t[r] = P(e[r]), this._bounds.extend(t[r])) : t[r] = this._convertLatLngs(e[r]);
				return t;
			},
			_project: function() {
				var e = new A();
				this._rings = [], this._projectLatlngs(this._latlngs, this._rings, e), this._bounds.isValid() && e.isValid() && (this._rawPxBounds = e, this._updateBounds());
			},
			_updateBounds: function() {
				var e = this._clickTolerance(), t = new O(e, e);
				this._rawPxBounds && (this._pxBounds = new A([this._rawPxBounds.min.subtract(t), this._rawPxBounds.max.add(t)]));
			},
			_projectLatlngs: function(e, t, n) {
				var r = e[0] instanceof N, i = e.length, a, o;
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
				return n >= 2 && t[0] instanceof N && t[0].equals(t[n - 1]) && t.pop(), t;
			},
			_setLatLngs: function(e) {
				dr.prototype._setLatLngs.call(this, e), zn(this._latlngs) && (this._latlngs = [this._latlngs]);
			},
			_defaultShape: function() {
				return zn(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
			},
			_clipPoints: function() {
				var e = this._renderer._bounds, t = this.options.weight, n = new O(t, t);
				if (e = new A(e.min.subtract(n), e.max.add(n)), this._parts = [], this._pxBounds && this._pxBounds.intersects(e)) {
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
			return new N(e[1], e[0], e[2]);
		}
		function yr(e, t, n) {
			for (var r = [], i = 0, a = e.length, o; i < a; i++) o = t ? yr(e[i], t - 1, n) : (n || vr)(e[i]), r.push(o);
			return r;
		}
		function br(e, t) {
			return e = P(e), e.alt === void 0 ? [u(e.lng, t), u(e.lat, t)] : [
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
				this._url = e, this._bounds = M(t), p(this, n);
			},
			onAdd: function() {
				this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (Et(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
			},
			onRemove: function() {
				St(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
			},
			setOpacity: function(e) {
				return this.options.opacity = e, this._image && this._updateOpacity(), this;
			},
			setStyle: function(e) {
				return e.opacity && this.setOpacity(e.opacity), this;
			},
			bringToFront: function() {
				return this._map && V(this._image), this;
			},
			bringToBack: function() {
				return this._map && wt(this._image), this;
			},
			setUrl: function(e) {
				return this._url = e, this._image && (this._image.src = e), this;
			},
			setBounds: function(e) {
				return this._bounds = M(e), this._map && this._reset(), this;
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
				var e = this._url.tagName === "IMG", t = this._image = e ? this._url : xt("img");
				Et(t, "leaflet-image-layer"), this._zoomAnimated && Et(t, "leaflet-zoom-animated"), this.options.className && Et(t, this.options.className), t.onselectstart = l, t.onmousemove = l, t.onload = i(this.fire, this, "load"), t.onerror = i(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (t.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), e ? this._url = t.src : (t.src = this._url, t.alt = this.options.alt);
			},
			_animateZoom: function(e) {
				var t = this._map.getZoomScale(e.zoom), n = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
				Nt(this._image, n, t);
			},
			_reset: function() {
				var e = this._image, t = new A(this._map.latLngToLayerPoint(this._bounds.getNorthWest()), this._map.latLngToLayerPoint(this._bounds.getSouthEast())), n = t.getSize();
				Pt(e, t.min), e.style.width = n.x + "px", e.style.height = n.y + "px";
			},
			_updateOpacity: function() {
				At(this._image, this.options.opacity);
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
				var e = this._url.tagName === "VIDEO", t = this._image = e ? this._url : xt("video");
				if (Et(t, "leaflet-image-layer"), this._zoomAnimated && Et(t, "leaflet-zoom-animated"), this.options.className && Et(t, this.options.className), t.onselectstart = l, t.onmousemove = l, t.onloadeddata = i(this.fire, this, "load"), e) {
					for (var n = t.getElementsByTagName("source"), r = [], a = 0; a < n.length; a++) r.push(n[a].src);
					this._url = n.length > 0 ? r : [t.src];
				} else {
					_(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(t.style, "objectFit") && (t.style.objectFit = "fill"), t.autoplay = !!this.options.autoplay, t.loop = !!this.options.loop, t.muted = !!this.options.muted, t.playsInline = !!this.options.playsInline;
					for (var o = 0; o < this._url.length; o++) {
						var s = xt("source");
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
			Et(e, "leaflet-image-layer"), this._zoomAnimated && Et(e, "leaflet-zoom-animated"), this.options.className && Et(e, this.options.className), e.onselectstart = l, e.onmousemove = l;
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
				e && (e instanceof N || _(e)) ? (this._latlng = P(e), p(this, t)) : (p(this, e), this._source = t), this.options.content && (this._content = this.options.content);
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
				this._zoomAnimated = e._zoomAnimated, this._container || this._initLayout(), e._fadeAnimated && At(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && At(this._container, 1), this.bringToFront(), this.options.interactive && (Et(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
			},
			onRemove: function(e) {
				e._fadeAnimated ? (At(this._container, 0), this._removeTimeout = setTimeout(i(St, void 0, this._container), 200)) : St(this._container), this.options.interactive && (Dt(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
			},
			getLatLng: function() {
				return this._latlng;
			},
			setLatLng: function(e) {
				return this._latlng = P(e), this._map && (this._updatePosition(), this._adjustPan()), this;
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
				return this._map && V(this._container), this;
			},
			bringToBack: function() {
				return this._map && wt(this._container), this;
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
					var e = this._map.latLngToLayerPoint(this._latlng), t = k(this.options.offset), n = this._getAnchor();
					this._zoomAnimated ? Pt(this._container, e.add(n)) : t = t.add(e).add(n);
					var r = this._containerBottom = -t.y, i = this._containerLeft = -Math.round(this._containerWidth / 2) + t.x;
					this._container.style.bottom = r + "px", this._container.style.left = i + "px";
				}
			},
			_getAnchor: function() {
				return [0, 0];
			}
		});
		pn.include({ _initOverlay: function(e, t, n, r) {
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
				Mr.prototype.onAdd.call(this, e), e.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof or || this._source.on("preclick", en));
			},
			onRemove: function(e) {
				Mr.prototype.onRemove.call(this, e), e.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof or || this._source.off("preclick", en));
			},
			getEvents: function() {
				var e = Mr.prototype.getEvents.call(this);
				return (this.options.closeOnClick === void 0 ? this._map.options.closePopupOnClick : this.options.closeOnClick) && (e.preclick = this.close), this.options.keepInView && (e.moveend = this._adjustPan), e;
			},
			_initLayout: function() {
				var e = "leaflet-popup", t = this._container = xt("div", e + " " + (this.options.className || "") + " leaflet-zoom-animated"), n = this._wrapper = xt("div", e + "-content-wrapper", t);
				if (this._contentNode = xt("div", e + "-content", n), nn(t), tn(this._contentNode), Yt(t, "contextmenu", en), this._tipContainer = xt("div", e + "-tip-container", t), this._tip = xt("div", e + "-tip", this._tipContainer), this.options.closeButton) {
					var r = this._closeButton = xt("a", e + "-close-button", t);
					r.setAttribute("role", "button"), r.setAttribute("aria-label", "Close popup"), r.href = "#close", r.innerHTML = "<span aria-hidden=\"true\">&#215;</span>", Yt(r, "click", function(e) {
						rn(e), this.close();
					}, this);
				}
			},
			_updateLayout: function() {
				var e = this._contentNode, t = e.style;
				t.width = "", t.whiteSpace = "nowrap";
				var n = e.offsetWidth;
				n = Math.min(n, this.options.maxWidth), n = Math.max(n, this.options.minWidth), t.width = n + 1 + "px", t.whiteSpace = "", t.height = "";
				var r = e.offsetHeight, i = this.options.maxHeight, a = "leaflet-popup-scrolled";
				i && r > i ? (t.height = i + "px", Et(e, a)) : Dt(e, a), this._containerWidth = this._container.offsetWidth;
			},
			_animateZoom: function(e) {
				var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), n = this._getAnchor();
				Pt(this._container, t.add(n));
			},
			_adjustPan: function() {
				if (this.options.autoPan) {
					if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) this._autopanning = !1;
					else {
						var e = this._map, t = parseInt(bt(this._container, "marginBottom"), 10) || 0, n = this._container.offsetHeight + t, r = this._containerWidth, i = new O(this._containerLeft, -n - this._containerBottom);
						i._add(Ft(this._container));
						var a = e.layerPointToContainerPoint(i), o = k(this.options.autoPanPadding), s = k(this.options.autoPanPaddingTopLeft || o), c = k(this.options.autoPanPaddingBottomRight || o), l = e.getSize(), u = 0, d = 0;
						a.x + r + c.x > l.x && (u = a.x + r - l.x + c.x), a.x - u - s.x < 0 && (u = a.x - s.x), a.y + n + c.y > l.y && (d = a.y + n - l.y + c.y), a.y - d - s.y < 0 && (d = a.y - s.y), (u || d) && (this.options.keepInView && (this._autopanning = !0), e.fire("autopanstart").panBy([u, d]));
					}
				}
			},
			_getAnchor: function() {
				return k(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
			}
		}), Pr = function(e, t) {
			return new Nr(e, t);
		};
		pn.mergeOptions({ closePopupOnClick: !0 }), pn.include({
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
					an(e);
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
				this._contentNode = this._container = xt("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + o(this));
			},
			_updateLayout: function() {},
			_adjustPan: function() {},
			_setPosition: function(e) {
				var t, n, r = this._map, i = this._container, a = r.latLngToContainerPoint(r.getCenter()), o = r.layerPointToContainerPoint(e), s = this.options.direction, c = i.offsetWidth, l = i.offsetHeight, u = k(this.options.offset), d = this._getAnchor();
				s === "top" ? (t = c / 2, n = l) : s === "bottom" ? (t = c / 2, n = 0) : s === "center" ? (t = c / 2, n = l / 2) : s === "right" ? (t = 0, n = l / 2) : s === "left" ? (t = c, n = l / 2) : o.x < a.x ? (s = "right", t = 0, n = l / 2) : (s = "left", t = c + (u.x + d.x) * 2, n = l / 2), e = e.subtract(k(t, n, !0)).add(u).add(d), Dt(i, "leaflet-tooltip-right"), Dt(i, "leaflet-tooltip-left"), Dt(i, "leaflet-tooltip-top"), Dt(i, "leaflet-tooltip-bottom"), Et(i, "leaflet-tooltip-" + s), Pt(i, e);
			},
			_updatePosition: function() {
				var e = this._map.latLngToLayerPoint(this._latlng);
				this._setPosition(e);
			},
			setOpacity: function(e) {
				this.options.opacity = e, this._container && At(this._container, e);
			},
			_animateZoom: function(e) {
				var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
				this._setPosition(t);
			},
			_getAnchor: function() {
				return k(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
			}
		}), Ir = function(e, t) {
			return new Fr(e, t);
		};
		pn.include({
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
				t && (Yt(t, "focus", function() {
					this._tooltip._source = e, this.openTooltip();
				}, this), Yt(t, "blur", this.closeTooltip, this));
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
				if (n.html instanceof Element ? (Ct(t), t.appendChild(n.html)) : t.innerHTML = n.html === !1 ? "" : n.html, n.bgPos) {
					var r = k(n.bgPos);
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
				updateWhenIdle: B.mobile,
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
				this._removeAllTiles(), St(this._container), e._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
			},
			bringToFront: function() {
				return this._map && (V(this._container), this._setAutoZIndex(Math.max)), this;
			},
			bringToBack: function() {
				return this._map && (wt(this._container), this._setAutoZIndex(Math.min)), this;
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
				return e instanceof O ? e : new O(e, e);
			},
			_updateZIndex: function() {
				this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
			},
			_setAutoZIndex: function(e) {
				for (var t = this.getPane().children, n = -e(-Infinity, Infinity), r = 0, i = t.length, a; r < i; r++) a = t[r].style.zIndex, t[r] !== this._container && a && (n = e(n, +a));
				isFinite(n) && (this.options.zIndex = n + e(-1, 1), this._updateZIndex());
			},
			_updateOpacity: function() {
				if (this._map && !B.ielt9) {
					At(this._container, this.options.opacity);
					var e = +/* @__PURE__ */ new Date(), t = !1, n = !1;
					for (var r in this._tiles) {
						var i = this._tiles[r];
						if (i.current && i.loaded) {
							var a = Math.min(1, (e - i.loaded) / 200);
							At(i.el, a), a < 1 ? t = !0 : (i.active ? n = !0 : this._onOpaqueTile(i), i.active = !0);
						}
					}
					n && !this._noPrune && this._pruneTiles(), t && (w(this._fadeFrame), this._fadeFrame = te(this._updateOpacity, this));
				}
			},
			_onOpaqueTile: l,
			_initContainer: function() {
				this._container || (this._container = xt("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
			},
			_updateLevels: function() {
				var e = this._tileZoom, t = this.options.maxZoom;
				if (e !== void 0) {
					for (var n in this._levels) n = Number(n), this._levels[n].el.children.length || n === e ? (this._levels[n].el.style.zIndex = t - Math.abs(e - n), this._onUpdateLevel(n)) : (St(this._levels[n].el), this._removeTilesAtZoom(n), this._onRemoveLevel(n), delete this._levels[n]);
					var r = this._levels[e], i = this._map;
					return r || (r = this._levels[e] = {}, r.el = xt("div", "leaflet-tile-container leaflet-zoom-animated", this._container), r.el.style.zIndex = t, r.origin = i.project(i.unproject(i.getPixelOrigin()), e).round(), r.zoom = e, this._setZoomTransform(r, i.getCenter(), i.getZoom()), r.el.offsetWidth, this._onCreateLevel(r)), this._level = r, r;
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
				for (var e in this._levels) St(this._levels[e].el), this._onRemoveLevel(Number(e)), delete this._levels[e];
				this._removeAllTiles(), this._tileZoom = void 0;
			},
			_retainParent: function(e, t, n, r) {
				var i = Math.floor(e / 2), a = Math.floor(t / 2), o = n - 1, s = new O(+i, +a);
				s.z = +o;
				var c = this._tileCoordsToKey(s), l = this._tiles[c];
				return l && l.active ? (l.retain = !0, !0) : (l && l.loaded && (l.retain = !0), o > r && this._retainParent(i, a, o, r));
			},
			_retainChildren: function(e, t, n, r) {
				for (var i = 2 * e; i < 2 * e + 2; i++) for (var a = 2 * t; a < 2 * t + 2; a++) {
					var o = new O(i, a);
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
				B.any3d ? Nt(e.el, i, r) : Pt(e.el, i);
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
				return new A(i.subtract(a), i.add(a));
			},
			_update: function(e) {
				var t = this._map;
				if (t) {
					var n = this._clampZoom(t.getZoom());
					if (e === void 0 && (e = t.getCenter()), this._tileZoom !== void 0) {
						var r = this._getTiledPixelBounds(e), i = this._pxBoundsToTileRange(r), a = i.getCenter(), o = [], s = this.options.keepBuffer, c = new A(i.getBottomLeft().subtract([s, -s]), i.getTopRight().add([s, -s]));
						if (!(isFinite(i.min.x) && isFinite(i.min.y) && isFinite(i.max.x) && isFinite(i.max.y))) throw Error("Attempted to load an infinite number of tiles");
						for (var l in this._tiles) {
							var u = this._tiles[l].coords;
							u.z === this._tileZoom && c.contains(new O(u.x, u.y)) || (this._tiles[l].current = !1);
						}
						if (Math.abs(n - this._tileZoom) > 1) this._setView(e, n);
						else {
							for (var d = i.min.y; d <= i.max.y; d++) for (var f = i.min.x; f <= i.max.x; f++) {
								var p = new O(f, d);
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
				return M(this.options.bounds).overlaps(r);
			},
			_keyToBounds: function(e) {
				return this._tileCoordsToBounds(this._keyToTileCoords(e));
			},
			_tileCoordsToNwSe: function(e) {
				var t = this._map, n = this.getTileSize(), r = e.scaleBy(n), i = r.add(n);
				return [t.unproject(r, e.z), t.unproject(i, e.z)];
			},
			_tileCoordsToBounds: function(e) {
				var t = this._tileCoordsToNwSe(e), n = new j(t[0], t[1]);
				return this.options.noWrap || (n = this._map.wrapLatLngBounds(n)), n;
			},
			_tileCoordsToKey: function(e) {
				return e.x + ":" + e.y + ":" + e.z;
			},
			_keyToTileCoords: function(e) {
				var t = e.split(":"), n = new O(+t[0], +t[1]);
				return n.z = +t[2], n;
			},
			_removeTile: function(e) {
				var t = this._tiles[e];
				t && (St(t.el), delete this._tiles[e], this.fire("tileunload", {
					tile: t.el,
					coords: this._keyToTileCoords(e)
				}));
			},
			_initTile: function(e) {
				Et(e, "leaflet-tile");
				var t = this.getTileSize();
				e.style.width = t.x + "px", e.style.height = t.y + "px", e.onselectstart = l, e.onmousemove = l, B.ielt9 && this.options.opacity < 1 && At(e, this.options.opacity);
			},
			_addTile: function(e, t) {
				var n = this._getTilePos(e), r = this._tileCoordsToKey(e), a = this.createTile(this._wrapCoords(e), i(this._tileReady, this, e));
				this._initTile(a), this.createTile.length < 2 && te(i(this._tileReady, this, e, null, a)), Pt(a, n), this._tiles[r] = {
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
				n = this._tiles[r], n && (n.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (At(n.el, 0), w(this._fadeFrame), this._fadeFrame = te(this._updateOpacity, this)) : (n.active = !0, this._pruneTiles()), t || (Et(n.el, "leaflet-tile-loaded"), this.fire("tileload", {
					tile: n.el,
					coords: e
				})), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), B.ielt9 || !this._map._fadeAnimated ? te(this._pruneTiles, this) : setTimeout(i(this._pruneTiles, this), 250)));
			},
			_getTilePos: function(e) {
				return e.scaleBy(this.getTileSize()).subtract(this._level.origin);
			},
			_wrapCoords: function(e) {
				var t = new O(this._wrapX ? c(e.x, this._wrapX) : e.x, this._wrapY ? c(e.y, this._wrapY) : e.y);
				return t.z = e.z, t;
			},
			_pxBoundsToTileRange: function(e) {
				var t = this.getTileSize();
				return new A(e.min.unscaleBy(t).floor(), e.max.unscaleBy(t).ceil().subtract([1, 1]));
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
				this._url = e, t = p(this, t), t.detectRetina && B.retina && t.maxZoom > 0 ? (t.tileSize = Math.floor(t.tileSize / 2), t.zoomReverse ? (t.zoomOffset--, t.minZoom = Math.min(t.maxZoom, t.minZoom + 1)) : (t.zoomOffset++, t.maxZoom = Math.max(t.minZoom, t.maxZoom - 1)), t.minZoom = Math.max(0, t.minZoom)) : t.zoomReverse ? t.minZoom = Math.min(t.maxZoom, t.minZoom) : t.maxZoom = Math.max(t.minZoom, t.maxZoom), typeof t.subdomains == "string" && (t.subdomains = t.subdomains.split("")), this.on("tileunload", this._onTileRemove);
			},
			setUrl: function(e, t) {
				return this._url === e && t === void 0 && (t = !0), this._url = e, t || this.redraw(), this;
			},
			createTile: function(e, t) {
				var n = document.createElement("img");
				return Yt(n, "load", i(this._tileOnLoad, this, t, n)), Yt(n, "error", i(this._tileOnError, this, t, n)), (this.options.crossOrigin || this.options.crossOrigin === "") && (n.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (n.referrerPolicy = this.options.referrerPolicy), n.alt = "", n.src = this.getTileUrl(e), n;
			},
			getTileUrl: function(e) {
				var t = {
					r: B.retina ? "@2x" : "",
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
				B.ielt9 ? setTimeout(i(e, this, null, t), 0) : e(null, t);
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
					St(t), delete this._tiles[e], this.fire("tileabort", {
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
				var a = t.detectRetina && B.retina ? 2 : 1, o = this.getTileSize();
				r.width = o.x * a, r.height = o.y * a, this.wmsParams = r;
			},
			onAdd: function(e) {
				this._crs = this.options.crs || e.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
				var t = this._wmsVersion >= 1.3 ? "crs" : "srs";
				this.wmsParams[t] = this._crs.code, Vr.prototype.onAdd.call(this, e);
			},
			getTileUrl: function(e) {
				var t = this._tileCoordsToNwSe(e), n = this._crs, r = ae(n.project(t[0]), n.project(t[1])), i = r.min, a = r.max, o = (this._wmsVersion >= 1.3 && this._crs === qn ? [
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
				this._container || (this._initContainer(), Et(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
				B.any3d ? Nt(this._container, a, n) : Pt(this._container, a);
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
				this._bounds = new A(n, n.add(t.multiplyBy(1 + e * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
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
				Yt(e, "mousemove", this._onMouseMove, this), Yt(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this), Yt(e, "mouseout", this._handleMouseOut, this), e._leaflet_disable_events = !0, this._ctx = e.getContext("2d");
			},
			_destroyContainer: function() {
				w(this._redrawRequest), delete this._ctx, St(this._container), Zt(this._container), delete this._container;
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
					var e = this._bounds, t = this._container, n = e.getSize(), r = B.retina ? 2 : 1;
					Pt(t, e.min), t.width = r * n.x, t.height = r * n.y, t.style.width = n.x + "px", t.style.height = n.y + "px", B.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y), this.fire("update");
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
					this._redrawBounds = this._redrawBounds || new A(), this._redrawBounds.extend(e._pxBounds.min.subtract([t, t])), this._redrawBounds.extend(e._pxBounds.max.add([t, t]));
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
				t && (Dt(this._container, "leaflet-interactive"), this._fireEvent([t], e, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
			},
			_handleMouseHover: function(e, t) {
				if (!this._mouseHoverThrottled) {
					for (var n, r, a = this._drawFirst; a; a = a.next) n = a.layer, n.options.interactive && n._containsPoint(t) && (r = n);
					r !== this._hoveredLayer && (this._handleMouseOut(e), r && (Et(this._container, "leaflet-interactive"), this._fireEvent([r], e, "mouseover"), this._hoveredLayer = r)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, e), this._mouseHoverThrottled = !0, setTimeout(i(function() {
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
			return B.canvas ? new Gr(e) : null;
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
				this._container = xt("div", "leaflet-vml-container");
			},
			_update: function() {
				this._map._animatingZoom || (Wr.prototype._update.call(this), this.fire("update"));
			},
			_initPath: function(e) {
				var t = e._container = qr("shape");
				Et(t, "leaflet-vml-shape " + (this.options.className || "")), t.coordsize = "1 1", e._path = qr("path"), t.appendChild(e._path), this._updateStyle(e), this._layers[o(e)] = e;
			},
			_addPath: function(e) {
				var t = e._container;
				this._container.appendChild(t), e.options.interactive && e.addInteractiveTarget(t);
			},
			_removePath: function(e) {
				var t = e._container;
				St(t), e.removeInteractiveTarget(t), delete this._layers[o(e)];
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
				V(e._container);
			},
			_bringToBack: function(e) {
				wt(e._container);
			}
		}, Jr = B.vml ? qr : me, Yr = Wr.extend({
			_initContainer: function() {
				this._container = Jr("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Jr("g"), this._container.appendChild(this._rootGroup);
			},
			_destroyContainer: function() {
				St(this._container), Zt(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
			},
			_update: function() {
				if (!(this._map._animatingZoom && this._bounds)) {
					Wr.prototype._update.call(this);
					var e = this._bounds, t = e.getSize(), n = this._container;
					this._svgSize && this._svgSize.equals(t) || (this._svgSize = t, n.setAttribute("width", t.x), n.setAttribute("height", t.y)), Pt(n, e.min), n.setAttribute("viewBox", [
						e.min.x,
						e.min.y,
						t.x,
						t.y
					].join(" ")), this.fire("update");
				}
			},
			_initPath: function(e) {
				var t = e._path = Jr("path");
				e.options.className && Et(t, e.options.className), e.options.interactive && Et(t, "leaflet-interactive"), this._updateStyle(e), this._layers[o(e)] = e;
			},
			_addPath: function(e) {
				this._rootGroup || this._initContainer(), this._rootGroup.appendChild(e._path), e.addInteractiveTarget(e._path);
			},
			_removePath: function(e) {
				St(e._path), e.removeInteractiveTarget(e._path), delete this._layers[o(e)];
			},
			_updatePath: function(e) {
				e._project(), e._update();
			},
			_updateStyle: function(e) {
				var t = e._path, n = e.options;
				t && (n.stroke ? (t.setAttribute("stroke", n.color), t.setAttribute("stroke-opacity", n.opacity), t.setAttribute("stroke-width", n.weight), t.setAttribute("stroke-linecap", n.lineCap), t.setAttribute("stroke-linejoin", n.lineJoin), n.dashArray ? t.setAttribute("stroke-dasharray", n.dashArray) : t.removeAttribute("stroke-dasharray"), n.dashOffset ? t.setAttribute("stroke-dashoffset", n.dashOffset) : t.removeAttribute("stroke-dashoffset")) : t.setAttribute("stroke", "none"), n.fill ? (t.setAttribute("fill", n.fillColor || n.color), t.setAttribute("fill-opacity", n.fillOpacity), t.setAttribute("fill-rule", n.fillRule || "evenodd")) : t.setAttribute("fill", "none"));
			},
			_updatePoly: function(e, t) {
				this._setPath(e, he(e._parts, t));
			},
			_updateCircle: function(e) {
				var t = e._point, n = Math.max(Math.round(e._radius), 1), r = Math.max(Math.round(e._radiusY), 1) || n, i = "a" + n + "," + r + " 0 1,0 ", a = e._empty() ? "M0 0" : "M" + (t.x - n) + "," + t.y + i + n * 2 + ",0 " + i + -n * 2 + ",0 ";
				this._setPath(e, a);
			},
			_setPath: function(e, t) {
				e._path.setAttribute("d", t);
			},
			_bringToFront: function(e) {
				V(e._path);
			},
			_bringToBack: function(e) {
				wt(e._path);
			}
		});
		B.vml && Yr.include(Z);
		function Xr(e) {
			return B.svg || B.vml ? new Yr(e) : null;
		}
		pn.include({
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
				return e = M(e), [
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
		Yr.create = Jr, Yr.pointsToPath = he, hr.geometryToLayer = gr, hr.coordsToLatLng = vr, hr.coordsToLatLngs = yr, hr.latLngToCoords = br, hr.latLngsToCoords = xr, hr.getFeature = Sr, hr.asFeature = Y, pn.mergeOptions({ boxZoom: !0 });
		var $r = bn.extend({
			initialize: function(e) {
				this._map = e, this._container = e._container, this._pane = e._panes.overlayPane, this._resetStateTimeout = 0, e.on("unload", this._destroy, this);
			},
			addHooks: function() {
				Yt(this._container, "mousedown", this._onMouseDown, this);
			},
			removeHooks: function() {
				Zt(this._container, "mousedown", this._onMouseDown, this);
			},
			moved: function() {
				return this._moved;
			},
			_destroy: function() {
				St(this._pane), delete this._pane;
			},
			_resetState: function() {
				this._resetStateTimeout = 0, this._moved = !1;
			},
			_clearDeferredResetState: function() {
				this._resetStateTimeout !== 0 && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
			},
			_onMouseDown: function(e) {
				if (!e.shiftKey || e.which !== 1 && e.button !== 1) return !1;
				this._clearDeferredResetState(), this._resetState(), It(), Bt(), this._startPoint = this._map.mouseEventToContainerPoint(e), Yt(document, {
					contextmenu: an,
					mousemove: this._onMouseMove,
					mouseup: this._onMouseUp,
					keydown: this._onKeyDown
				}, this);
			},
			_onMouseMove: function(e) {
				this._moved || (this._moved = !0, this._box = xt("div", "leaflet-zoom-box", this._container), Et(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
				var t = new A(this._point, this._startPoint), n = t.getSize();
				Pt(this._box, t.min), this._box.style.width = n.x + "px", this._box.style.height = n.y + "px";
			},
			_finish: function() {
				this._moved && (St(this._box), Dt(this._container, "leaflet-crosshair")), Lt(), Vt(), Zt(document, {
					contextmenu: an,
					mousemove: this._onMouseMove,
					mouseup: this._onMouseUp,
					keydown: this._onKeyDown
				}, this);
			},
			_onMouseUp: function(e) {
				if ((e.which === 1 || e.button === 1) && (this._finish(), this._moved)) {
					this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(i(this._resetState, this), 0);
					var t = new j(this._map.containerPointToLatLng(this._startPoint), this._map.containerPointToLatLng(this._point));
					this._map.fitBounds(t).fire("boxzoomend", { boxZoomBounds: t });
				}
			},
			_onKeyDown: function(e) {
				e.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
			}
		});
		pn.addInitHook("addHandler", "boxZoom", $r), pn.mergeOptions({ doubleClickZoom: !0 });
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
		pn.addInitHook("addHandler", "doubleClickZoom", Q), pn.mergeOptions({
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
				Et(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
			},
			removeHooks: function() {
				Dt(this._map._container, "leaflet-grab"), Dt(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
					var t = M(this._map.options.maxBounds);
					this._offsetLimit = ae(this._map.latLngToContainerPoint(t.getNorthWest()).multiplyBy(-1), this._map.latLngToContainerPoint(t.getSouthEast()).multiplyBy(-1).add(this._map.getSize())), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
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
		pn.addInitHook("addHandler", "dragging", ei), pn.mergeOptions({
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
				e.tabIndex <= 0 && (e.tabIndex = "0"), Yt(e, {
					focus: this._onFocus,
					blur: this._onBlur,
					mousedown: this._onMouseDown
				}, this), this._map.on({
					focus: this._addHooks,
					blur: this._removeHooks
				}, this);
			},
			removeHooks: function() {
				this._removeHooks(), Zt(this._map._container, {
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
				Yt(document, "keydown", this._onKeyDown, this);
			},
			_removeHooks: function() {
				Zt(document, "keydown", this._onKeyDown, this);
			},
			_onKeyDown: function(e) {
				if (!(e.altKey || e.ctrlKey || e.metaKey)) {
					var t = e.keyCode, n = this._map, r;
					if (t in this._panKeys) {
						if (!n._panAnim || !n._panAnim._inProgress) {
							if (r = this._panKeys[t], e.shiftKey && (r = k(r).multiplyBy(3)), n.options.maxBounds && (r = n._limitOffset(k(r), n.options.maxBounds)), n.options.worldCopyJump) {
								var i = n.wrapLatLng(n.unproject(n.project(n.getCenter()).add(r)));
								n.panTo(i);
							} else n.panBy(r);
						}
					} else if (t in this._zoomKeys) n.setZoom(n.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[t]);
					else if (t === 27 && n._popup && n._popup.options.closeOnEscapeKey) n.closePopup();
					else return;
					an(e);
				}
			}
		});
		pn.addInitHook("addHandler", "keyboard", ti), pn.mergeOptions({
			scrollWheelZoom: !0,
			wheelDebounceTime: 40,
			wheelPxPerZoomLevel: 60
		});
		var ni = bn.extend({
			addHooks: function() {
				Yt(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
			},
			removeHooks: function() {
				Zt(this._map._container, "wheel", this._onWheelScroll, this);
			},
			_onWheelScroll: function(e) {
				var t = ln(e), n = this._map.options.wheelDebounceTime;
				this._delta += t, this._lastMousePos = this._map.mouseEventToContainerPoint(e), this._startTime ||= +/* @__PURE__ */ new Date();
				var r = Math.max(n - (+/* @__PURE__ */ new Date() - this._startTime), 0);
				clearTimeout(this._timer), this._timer = setTimeout(i(this._performZoom, this), r), an(e);
			},
			_performZoom: function() {
				var e = this._map, t = e.getZoom(), n = this._map.options.zoomSnap || 0;
				e._stop();
				var r = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), i = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(r)))) / Math.LN2, a = n ? Math.ceil(i / n) * n : i, o = e._limitZoom(t + (this._delta > 0 ? a : -a)) - t;
				this._delta = 0, this._startTime = null, o && (e.options.scrollWheelZoom === "center" ? e.setZoom(t + o) : e.setZoomAround(this._lastMousePos, t + o));
			}
		});
		pn.addInitHook("addHandler", "scrollWheelZoom", ni);
		var ri = 600;
		pn.mergeOptions({
			tapHold: B.touchNative && B.safari && B.mobile,
			tapTolerance: 15
		});
		var ii = bn.extend({
			addHooks: function() {
				Yt(this._map._container, "touchstart", this._onDown, this);
			},
			removeHooks: function() {
				Zt(this._map._container, "touchstart", this._onDown, this);
			},
			_onDown: function(e) {
				if (clearTimeout(this._holdTimeout), e.touches.length === 1) {
					var t = e.touches[0];
					this._startPos = this._newPos = new O(t.clientX, t.clientY), this._holdTimeout = setTimeout(i(function() {
						this._cancel(), this._isTapValid() && (Yt(document, "touchend", rn), Yt(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", t));
					}, this), ri), Yt(document, "touchend touchcancel contextmenu", this._cancel, this), Yt(document, "touchmove", this._onMove, this);
				}
			},
			_cancelClickPrevent: function e() {
				Zt(document, "touchend", rn), Zt(document, "touchend touchcancel", e);
			},
			_cancel: function() {
				clearTimeout(this._holdTimeout), Zt(document, "touchend touchcancel contextmenu", this._cancel, this), Zt(document, "touchmove", this._onMove, this);
			},
			_onMove: function(e) {
				var t = e.touches[0];
				this._newPos = new O(t.clientX, t.clientY);
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
		pn.addInitHook("addHandler", "tapHold", ii), pn.mergeOptions({
			touchZoom: B.touch,
			bounceAtZoomLimits: !0
		});
		var ai = bn.extend({
			addHooks: function() {
				Et(this._map._container, "leaflet-touch-zoom"), Yt(this._map._container, "touchstart", this._onTouchStart, this);
			},
			removeHooks: function() {
				Dt(this._map._container, "leaflet-touch-zoom"), Zt(this._map._container, "touchstart", this._onTouchStart, this);
			},
			_onTouchStart: function(e) {
				var t = this._map;
				if (!(!e.touches || e.touches.length !== 2 || t._animatingZoom || this._zooming)) {
					var n = t.mouseEventToContainerPoint(e.touches[0]), r = t.mouseEventToContainerPoint(e.touches[1]);
					this._centerPoint = t.getSize()._divideBy(2), this._startLatLng = t.containerPointToLatLng(this._centerPoint), t.options.touchZoom !== "center" && (this._pinchStartLatLng = t.containerPointToLatLng(n.add(r)._divideBy(2))), this._startDist = n.distanceTo(r), this._startZoom = t.getZoom(), this._moved = !1, this._zooming = !0, t._stop(), Yt(document, "touchmove", this._onTouchMove, this), Yt(document, "touchend touchcancel", this._onTouchEnd, this), rn(e);
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
					this._animRequest = te(s, this, !0), rn(e);
				}
			},
			_onTouchEnd: function() {
				!this._moved || !this._zooming ? this._zooming = !1 : (this._zooming = !1, w(this._animRequest), Zt(document, "touchmove", this._onTouchMove, this), Zt(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom)));
			}
		});
		pn.addInitHook("addHandler", "touchZoom", ai), pn.BoxZoom = $r, pn.DoubleClickZoom = Q, pn.Drag = ei, pn.Keyboard = ti, pn.ScrollWheelZoom = ni, pn.TapHold = ii, pn.TouchZoom = ai, e.Bounds = A, e.Browser = B, e.CRS = oe, e.Canvas = Gr, e.Circle = lr, e.CircleMarker = sr, e.Class = ne, e.Control = hn, e.DivIcon = Lr, e.DivOverlay = Mr, e.DomEvent = dn, e.DomUtil = Jt, e.Draggable = Cn, e.Evented = D, e.FeatureGroup = Qn, e.GeoJSON = hr, e.GridLayer = zr, e.Handler = bn, e.Icon = er, e.ImageOverlay = Er, e.LatLng = N, e.LatLngBounds = j, e.Layer = Yn, e.LayerGroup = Xn, e.LineUtil = Hn, e.Map = pn, e.Marker = ir, e.Mixin = xn, e.Path = or, e.Point = O, e.PolyUtil = Dn, e.Polygon = pr, e.Polyline = dr, e.Popup = Nr, e.PosAnimation = fn, e.Projection = Gn, e.Rectangle = Zr, e.Renderer = Wr, e.SVG = Yr, e.SVGOverlay = Ar, e.TileLayer = Vr, e.Tooltip = Fr, e.Transformation = ue, e.Util = T, e.VideoOverlay = Or, e.bind = i, e.bounds = ae, e.canvas = Kr, e.circle = ur, e.circleMarker = cr, e.control = gn, e.divIcon = Rr, e.extend = n, e.featureGroup = $n, e.geoJSON = wr, e.geoJson = Tr, e.gridLayer = Br, e.icon = tr, e.imageOverlay = Dr, e.latLng = P, e.latLngBounds = M, e.layerGroup = Zn, e.map = mn, e.marker = ar, e.point = k, e.polygon = mr, e.polyline = fr, e.popup = Pr, e.rectangle = Qr, e.setOptions = p, e.stamp = o, e.svg = Xr, e.svgOverlay = jr, e.tileLayer = Hr, e.tooltip = Ir, e.transformation = de, e.version = t, e.videoOverlay = kr;
		var oi = window.L;
		e.noConflict = function() {
			return window.L = oi, this;
		}, window.L = e;
	}));
})))()), om = /* @__PURE__ */ X("<div class=\"map svelte-1zqw7d\" role=\"region\"></div>");
function sm(e, t) {
	tt(t, !0);
	let n = am.default.TileLayer.extend({ createTile(e, t) {
		let n = document.createElement("img");
		return n.alt = "", am.default.DomEvent.on(n, "load", am.default.Util.bind(this._tileOnLoad, this, t, n)), am.default.DomEvent.on(n, "error", am.default.Util.bind(this._tileOnError, this, t, n)), Oc(this.getTileUrl(e)).then((e) => n.src = e, (e) => t(e, n)), n;
	} }), r = xa(t, "lines", 19, () => []), i = xa(t, "dots", 19, () => []), a = xa(t, "label", 3, "Map"), o = /* @__PURE__ */ H(void 0);
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
	ga(s, (e) => U(o, e), () => Y(o)), J(() => {
		ra(s, "aria-label", a()), c = Hi(s, "", c, { height: `${t.height ?? ""}px` });
	}), Z(e, s), nt();
}
// src/pages/ChargeDetail.svelte
var cm = /* @__PURE__ */ X("<span class=\"caption svelte-1d50lj3\">Cloud times</span>"), lm = /* @__PURE__ */ X("<span class=\"caption svelte-1d50lj3\">Estimated</span>"), um = /* @__PURE__ */ X("<p class=\"badges svelte-1d50lj3\"><!> <!></p>"), dm = /* @__PURE__ */ X("<p class=\"d-sub\"> </p> <!>", 1), fm = /* @__PURE__ */ X(" <small class=\"svelte-1d50lj3\"> </small>", 1), pm = /* @__PURE__ */ X("<p class=\"d-note\"> </p>"), mm = /* @__PURE__ */ X("<button class=\"d-btn\" type=\"button\">Clear</button>"), hm = /* @__PURE__ */ X("<form class=\"edit svelte-1d50lj3\"><label class=\"field wide\">Location name<input required=\"\" maxlength=\"40\" class=\"svelte-1d50lj3\"/></label> <label class=\"field\">€/kWh<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" required=\"\" class=\"svelte-1d50lj3\"/></label> <label class=\"field\">Start fee<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\" class=\"svelte-1d50lj3\"/></label> <label class=\"field\">€/min<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\" class=\"svelte-1d50lj3\"/></label> <button class=\"d-btn\" type=\"submit\">Save location</button> <button class=\"d-btn\" type=\"button\">Cancel</button></form>"), gm = /* @__PURE__ */ X("<div class=\"edit svelte-1d50lj3\"><button class=\"d-btn\" type=\"button\">Save as charge location</button></div>"), _m = /* @__PURE__ */ X("<p class=\"note svelte-1d50lj3\" role=\"alert\"> </p>"), vm = /* @__PURE__ */ X("<form class=\"edit svelte-1d50lj3\"><label class=\"field\">Total paid (€)<input type=\"number\" min=\"0\" step=\"0.01\" inputmode=\"decimal\" required=\"\" class=\"svelte-1d50lj3\"/></label> <button class=\"d-btn\" type=\"submit\">Save</button> <!></form> <!> <!>", 1), ym = /* @__PURE__ */ X("<div class=\"stats svelte-1d50lj3\"><span class=\"svelte-1d50lj3\"><span class=\"d-note\">Min</span><b class=\"svelte-1d50lj3\"> </b></span> <span class=\"svelte-1d50lj3\"><span class=\"d-note\">Average</span><b class=\"svelte-1d50lj3\"> </b></span> <span class=\"svelte-1d50lj3\"><span class=\"d-note\">Max</span><b class=\"svelte-1d50lj3\"> </b></span></div> <!> <p class=\"d-note source svelte-1d50lj3\"> </p>", 1), bm = /* @__PURE__ */ X("<p class=\"d-msg\">Not enough readings for a speed curve</p>"), xm = /* @__PURE__ */ X("<p class=\"d-msg\">No readings from the car during this charge</p>"), Sm = /* @__PURE__ */ X("<p class=\"d-msg\">No readings from the cloud for this charge</p>"), Cm = /* @__PURE__ */ X("<section class=\"d-card hero svelte-1d50lj3\"><span class=\"d-note\">Added</span> <span class=\"big svelte-1d50lj3\"> <!></span> <!> <div class=\"levels svelte-1d50lj3\"><span class=\"svelte-1d50lj3\"><span class=\"d-note\">Start</span><b class=\"svelte-1d50lj3\"> </b></span> <span class=\"end svelte-1d50lj3\"><span class=\"d-note\">End</span><b class=\"svelte-1d50lj3\"> </b></span></div></section> <!> <div class=\"d-figs three\"></div> <section class=\"d-card\"><div class=\"d-head\"><h2>Cost</h2><b class=\"amount svelte-1d50lj3\"> </b></div> <!> <!></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Charging speed</h2><span class=\"d-note\">kW against charge level</span></div> <!></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Battery energy</h2><span class=\"d-note\">from the car, kWh</span></div> <!></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Charge level</h2><span class=\"d-note\">from the cloud, %</span></div> <!></section> <section class=\"d-card\"><dl class=\"d-rows foot\"><div><dt>Outside temperature</dt><dd> </dd></div></dl></section>", 1);
function wm(e, t) {
	tt(t, !0);
	let n = xa(t, "isAdmin", 3, !1), r = /* @__PURE__ */ H(null), i = /* @__PURE__ */ H(""), a = /* @__PURE__ */ H(null), o = /* @__PURE__ */ H(""), s = /* @__PURE__ */ H(!1), c = /* @__PURE__ */ V(() => Y(r)?.charge), l = /* @__PURE__ */ V(() => Y(r)?.cost?.spot == null && Y(c)?.lat != null), u = /* @__PURE__ */ V(() => Y(c)?.energy_source === "soc_estimate"), d = /* @__PURE__ */ V(() => Y(r) ? Rc(Y(r).series) : null), f = /* @__PURE__ */ V(() => Y(r) ? Vc(Y(r).series, Y(r).capacity_wh) : null), p = /* @__PURE__ */ V(() => {
		if (!Y(f)) return null;
		let e = Y(f).x.map((e, t) => t).sort((e, t) => Y(f).x[e] - Y(f).x[t]);
		return {
			x: e.map((e) => Y(f).x[e]),
			kw: e.map((e) => Y(f).kw[e])
		};
	}), h = /* @__PURE__ */ V(() => Y(c) ? es(fs(Y(c).added_wh, Y(u))) : ["–", ""]), g = /* @__PURE__ */ V(() => Y(c) ? [
		gs("Duration", ts(Y(c).duration_s)),
		gs("Average power", es(ja(Y(c).avg_w))),
		gs("Range added", Y(c).range_added_m == null ? ["–", ""] : es(`~${ka(Y(c).range_added_m)}`))
	] : []), _ = (e, t) => t == null ? Aa(e) : `${Aa(e)} · ${Math.round(t)} %`, v = (e) => {
		let t = e.values.filter((e) => e != null);
		return t.length ? `${t[0]} to ${t[t.length - 1]}` : "–";
	}, y = (e) => {
		U(r, e, !0), U(i, e.cost?.basis === "receipt" ? String(e.cost.amount) : "", !0);
	};
	async function b(e, t) {
		U(o, ""), U(s, !0);
		let n = !0;
		try {
			await e();
		} catch (e) {
			n = !1, U(o, e.detail || `Could not save (${e.message})`, !0);
		}
		return await t(), Wo(), U(s, !1), n;
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
		await b(() => m("POST", "spots", l), n) && U(a, null);
	}
	{
		let m = (e) => {
			Ie();
			var t = Kr();
			J((e) => Q(t, e), [() => ds(Y(c))]), Z(e, t);
		}, b = (e) => {
			var t = dm(), n = G(t), r = K(n, !0), i = q(n, 2), a = (e) => {
				var t = um(), n = W(t), r = (e) => {
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
				}), z(t), Z(e, t);
			};
			$(i, (e) => {
				(Y(c).times_source === "cloud" || Y(u)) && e(a);
			}), J((e) => Q(r, e), [() => ls(Y(c).start, Y(c).end)]), Z(e, t);
		}, C = (e, t = E, u = E) => {
			var m = Cm(), y = G(m), b = q(W(y), 2), C = W(b, !0), ee = q(C), te = (e) => {
				var t = fm(), n = G(t, !0);
				n.nodeValue = " ";
				var r = K(q(n), !0);
				J(() => Q(r, Y(h)[1])), Z(e, t);
			};
			$(ee, (e) => {
				Y(h)[1] && e(te);
			}), z(b);
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
			var T = q(w, 2), ne = W(T), re = K(q(W(ne)), !0);
			z(ne);
			var D = q(ne, 2), O = K(q(W(D)), !0);
			z(D), z(T), z(y);
			var ie = q(y, 2), k = (e) => {
				{
					let t = /* @__PURE__ */ V(() => [{
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
			$(ie, (e) => {
				Y(c).lat != null && Y(c).lon != null && e(k);
			});
			var A = q(ie, 2);
			hi(A, 21, () => Y(g), (e) => e.label, (e, t) => {
				im(e, ba(() => Y(t), { size: "small" }));
			}), z(A);
			var ae = q(A, 2), j = W(ae), M = K(q(W(j)), !0);
			z(j);
			var N = q(j, 2), P = (e) => {
				var t = pm(), n = K(t, !0);
				J((e) => Q(n, e), [() => ws(Y(r).cost)]), Z(e, t);
			};
			$(N, (e) => {
				(Y(c).end != null || Y(r).cost.amount != null) && e(P);
			});
			var oe = q(N, 2), se = (e) => {
				var t = vm(), n = G(t), c = W(n), d = q(W(c));
				ea(d), z(c);
				var f = q(c, 2), p = q(f, 2), m = (e) => {
					var t = mm();
					J(() => t.disabled = Y(s)), Fr("click", t, () => x(null, u())), Z(e, t);
				};
				$(p, (e) => {
					Y(r).cost.basis === "receipt" && e(m);
				}), z(n);
				var h = q(n, 2), g = (e) => {
					var t = qr(), n = G(t), r = (e) => {
						var t = hm(), n = W(t), r = q(W(n));
						ea(r), z(n);
						var i = q(n, 2), o = q(W(i));
						ea(o), z(i);
						var c = q(i, 2), l = q(W(c));
						ea(l), z(c);
						var d = q(c, 2), f = q(W(d));
						ea(f), z(d);
						var p = q(d, 2), m = q(p, 2);
						z(t), J(() => p.disabled = Y(s)), Pr("submit", t, (e) => S(e, u())), sa(r, () => Y(a).name, (e) => Y(a).name = e), sa(o, () => Y(a).per_kwh, (e) => Y(a).per_kwh = e), sa(l, () => Y(a).start_fee, (e) => Y(a).start_fee = e), sa(f, () => Y(a).per_min, (e) => Y(a).per_min = e), Fr("click", m, () => U(a, null)), Z(e, t);
					}, i = (e) => {
						var t = gm();
						Fr("click", K(t), () => U(a, {
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
				}), sa(d, () => Y(i), (e) => U(i, e)), Z(e, t);
			};
			$(oe, (e) => {
				n() && e(se);
			}), z(ae);
			var ce = q(ae, 2), le = q(W(ce), 2), ue = (e) => {
				var t = ym(), n = G(t), r = W(n), i = K(q(W(r)), !0);
				z(r);
				var a = q(r, 2), o = K(q(W(a)), !0);
				z(a);
				var s = q(a, 2), l = K(q(W(s)), !0);
				z(s), z(n);
				var u = q(n, 2);
				{
					let e = /* @__PURE__ */ V(() => os(Y(f).min)), t = /* @__PURE__ */ V(() => ja(Y(c).avg_w)), n = /* @__PURE__ */ V(() => os(Y(f).max)), r = /* @__PURE__ */ V(() => [{
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
			}, de = (e) => {
				Z(e, bm());
			};
			$(le, (e) => {
				Y(p) ? e(ue) : e(de, -1);
			}), z(ce);
			var fe = q(ce, 2), pe = q(W(fe), 2), me = (e) => {
				{
					let t = /* @__PURE__ */ V(() => v(Y(d).car.series[0])), n = /* @__PURE__ */ V(() => Y(d).car.series.map((e) => ({
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
			}, he = (e) => {
				Z(e, xm());
			};
			$(pe, (e) => {
				Y(d)?.car ? e(me) : e(he, -1);
			}), z(fe);
			var ge = q(fe, 2), _e = q(W(ge), 2), ve = (e) => {
				{
					let t = /* @__PURE__ */ V(() => v(Y(d).cloud.series[0])), n = /* @__PURE__ */ V(() => Y(d).cloud.series.map((e, t) => ({
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
			}, ye = (e) => {
				Z(e, Sm());
			};
			$(_e, (e) => {
				Y(d)?.cloud ? e(ve) : e(ye, -1);
			}), z(ge);
			var be = q(ge, 2), xe = W(be), Se = W(xe), Ce = K(q(W(Se)), !0);
			z(Se), z(xe), z(be), J((e, t, n, r) => {
				Q(C, Y(h)[0]), Q(re, e), Q(O, t), Q(M, n), Q(Ce, r);
			}, [
				() => _(Y(c).start_wh, Y(c).start_pct),
				() => _(Y(c).end_wh, Y(c).end_pct),
				() => Cs(Y(r).cost),
				() => hs(Y(r).outside_temp_c)
			]), Z(e, m);
		}, ee = /* @__PURE__ */ V(() => `charges/${encodeURIComponent(t.vid)}/${t.start}`);
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
	nt();
}
Ir(["click"]);
// src/pages/TripDetail.svelte
var Tm = /* @__PURE__ */ X("<p class=\"d-sub\"> </p>"), Em = /* @__PURE__ */ X("<span class=\"d-note\"> </span>"), Dm = /* @__PURE__ */ X("<p class=\"d-note\">From your car's cloud data, approximate</p>"), Om = /* @__PURE__ */ X("<div class=\"big\"> <small>/ 100</small></div>"), km = /* @__PURE__ */ X("<div><dt> </dt><dd> </dd></div>"), Am = /* @__PURE__ */ X("<i></i>"), jm = /* @__PURE__ */ X("<li class=\"svelte-5xbjqg\"><i class=\"swatch svelte-5xbjqg\"></i><span class=\"n svelte-5xbjqg\"> </span><span> </span><span class=\"pc svelte-5xbjqg\"> </span></li>"), Mm = /* @__PURE__ */ X("<dl class=\"d-rows\"><div><dt>Standing</dt><dd> </dd></div></dl>"), Nm = /* @__PURE__ */ X("<section class=\"d-card\"><div class=\"d-head\"><h2>Driving style</h2><span class=\"d-note\"> </span></div> <!> <dl class=\"d-rows\"></dl> <div class=\"d-head bandhead\"><h2>Speed bands</h2><span class=\"d-note\">km/h · kWh/100 km · share</span></div> <div class=\"share-bar\" role=\"img\"></div> <ul class=\"bands svelte-5xbjqg\"></ul> <!></section>"), Pm = /* @__PURE__ */ X("<p class=\"d-msg\">No consumption data</p>"), Fm = /* @__PURE__ */ X("<p class=\"d-msg\">No speed data</p>"), Im = /* @__PURE__ */ X("<section class=\"d-card\"><div class=\"d-head\"><h2>Consumption</h2><span class=\"d-note\">kWh per 0.5 km</span></div> <!> <dl class=\"d-rows\"><div><dt>Battery</dt><dd> </dd></div> <div><dt>Net</dt><dd> </dd></div> <div><dt>Gross</dt><dd> </dd></div> <div><dt>Recuperated</dt><dd> </dd></div></dl></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Speed</h2><span class=\"d-note\"> </span></div> <!></section>", 1), Lm = /* @__PURE__ */ X("<div class=\"cmp svelte-5xbjqg\"><div class=\"line svelte-5xbjqg\"><span> </span> <b> </b></div> <div class=\"track svelte-5xbjqg\" aria-hidden=\"true\"><i class=\"usual svelte-5xbjqg\"></i><i class=\"dot svelte-5xbjqg\"></i></div> <span class=\"d-note\"> </span></div>"), Rm = /* @__PURE__ */ X("<section class=\"d-card\"><h2>Compared with your usual route</h2> <p class=\"d-note\"> </p> <!></section>"), zm = /* @__PURE__ */ X("<!> <div class=\"d-figs\"><!> <!></div> <!> <!> <!> <!> <section class=\"d-card\"><dl class=\"d-rows foot\"><div><dt>Battery</dt><dd> </dd></div> <div><dt>Outside temperature</dt><dd> </dd></div> <div><dt>Odometer</dt><dd> </dd></div></dl></section>", 1);
function Bm(e, t) {
	tt(t, !0);
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
			Ie();
			var r = Kr();
			J((e) => Q(r, e), [() => ps(n())]), Z(e, r);
		}, c = (e, t) => {
			let n = () => (t?.()).trip;
			var r = Tm(), i = K(r, !0);
			J((e) => Q(i, e), [() => ls(n().start, n().end)]), Z(e, r);
		}, l = (e, t = E) => {
			let s = /* @__PURE__ */ V(() => t().trip), c = /* @__PURE__ */ V(() => zc(t().series, .5)), l = /* @__PURE__ */ V(() => Ic(t().series)?.speed), u = /* @__PURE__ */ V(() => (t().series?.events ?? []).map(([e, t]) => ({
				x: e,
				color: a[t]
			}))), d = /* @__PURE__ */ V(() => Y(s).style), f = /* @__PURE__ */ V(() => Y(d) ? bs(Y(d).bands, .5) : []), p = /* @__PURE__ */ V(() => Y(s).avg_speed_mps == null ? null : Y(s).avg_speed_mps * 3.6), m = /* @__PURE__ */ V(() => Y(s).max_speed_mps == null ? null : Y(s).max_speed_mps * 3.6), h = /* @__PURE__ */ V(() => Fa(Y(s).wh_per_100km)), g = /* @__PURE__ */ V(() => rs(Y(s), t().similar)), _ = /* @__PURE__ */ V(() => [
				gs("Distance", es(ka(Y(s).distance_m))),
				gs("Duration", ts(Y(s).duration_s)),
				gs("Energy used", es(Aa(Y(s).net_wh))),
				gs("Average", Y(h) == null ? ["–", ""] : [Y(h).toFixed(1), "kWh/100 km"]),
				gs("Average speed", Y(p) == null ? ["–", ""] : [Y(p).toFixed(0), "km/h"]),
				gs("Recuperated", es(Aa(Y(s).recup_wh)))
			]), v = /* @__PURE__ */ V(() => Y(g) ? [{
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
			var y = zm(), b = G(y), x = (e) => {
				let n = /* @__PURE__ */ V(() => {
					let [e, n] = [t().route[0], t().route.at(-1)];
					return {
						a: e,
						z: n
					};
				});
				{
					let r = /* @__PURE__ */ V(() => [{
						points: t().route,
						kind: "trip"
					}]), i = /* @__PURE__ */ V(() => [{
						lat: Y(n).a[0],
						lon: Y(n).a[1],
						kind: "trip",
						role: "start"
					}, {
						lat: Y(n).z[0],
						lon: Y(n).z[1],
						kind: "trip",
						role: "end"
					}]), a = /* @__PURE__ */ V(() => ms(Y(s)));
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
			var S = q(b, 2), C = W(S);
			hi(C, 17, () => Y(_), (e) => e.label, (e, t) => {
				im(e, ba(() => Y(t)));
			});
			var ee = q(C, 2);
			{
				let e = /* @__PURE__ */ V(() => Ss(t().cost.total));
				im(ee, {
					label: "Cost",
					get value() {
						return Y(e);
					},
					children: (e, n) => {
						var r = qr(), i = G(r), a = (e) => {
							var n = Em(), r = K(n, !0);
							J((e) => Q(r, e), [() => Ts(t().cost)]), Z(e, n);
						}, o = /* @__PURE__ */ V(() => Ts(t().cost));
						$(i, (e) => {
							Y(o) && e(a);
						}), Z(e, r);
					},
					$$slots: { default: !0 }
				});
			}
			z(S);
			var te = q(S, 2), w = (e) => {
				Z(e, Dm());
			};
			$(te, (e) => {
				Y(s).approx && e(w);
			});
			var T = q(te, 2), ne = (e) => {
				var t = Nm(), n = W(t), r = K(q(W(n)), !0);
				z(n);
				var i = q(n, 2), a = (e) => {
					var t = Om(), n = W(t, !0);
					Ie(), z(t), J(() => Q(n, Y(d).score)), Z(e, t);
				};
				$(i, (e) => {
					Y(d).score != null && e(a);
				});
				var c = q(i, 2);
				hi(c, 21, () => _s, ([e, t]) => e, (e, t) => {
					var n = /* @__PURE__ */ V(() => ie(Y(t), 2));
					let r = () => Y(n)[0], i = () => Y(n)[1];
					var a = km(), o = W(a), c = K(o, !0), l = K(q(o));
					z(a), J((e) => {
						Q(c, i()), Q(l, `${Y(d)[r()][0] ?? ""} · ${e ?? ""}`);
					}, [() => ys(Y(d)[r()][0], Y(s).distance_m / 1e3)]), Z(e, a);
				}), z(c);
				var l = q(c, 4);
				hi(l, 23, () => Y(f), (e) => e.name, (e, t, n) => {
					var r = qr(), i = G(r), a = (e) => {
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
				}), z(l);
				var u = q(l, 2);
				hi(u, 23, () => Y(f), (e) => e.name, (e, t, n) => {
					var r = jm(), i = W(r);
					let a;
					var s = q(i), c = K(s, !0), l = q(s), u = K(l, !0), d = K(q(l));
					z(r), J((e, r) => {
						a = Hi(i, "", a, { opacity: o[Y(n)] }), Q(c, Y(t).name), Q(u, e), Q(d, `${r ?? ""} %`);
					}, [() => Y(t).kwhPer100 == null ? "–" : Y(t).kwhPer100.toFixed(1), () => Math.round(Y(t).share * 100)]), Z(e, r);
				}), z(u);
				var p = q(u, 2), m = (e) => {
					var t = Mm(), n = W(t), r = K(q(W(n)), !0);
					z(n), z(t), J((e) => Q(r, e), [() => Aa(Y(d).standing)]), Z(e, t);
				};
				$(p, (e) => {
					Y(d).standing != null && e(m);
				}), z(t), J((e, t) => {
					Q(r, e), ra(l, "aria-label", `Distance by speed band: ${t ?? ""}`);
				}, [() => vs(Y(d).score), () => Y(f).map((e) => `${e.name} km/h ${Math.round(e.share * 100)} %`).join(", ")]), Z(e, t);
			};
			$(T, (e) => {
				Y(d) && e(ne);
			});
			var re = q(T, 2), D = (e) => {
				var t = Im(), r = G(t), a = q(W(r), 2), o = (e) => {
					{
						let t = /* @__PURE__ */ V(() => Aa(Y(s).net_wh)), n = /* @__PURE__ */ V(() => Aa(Y(s).gross_wh)), r = /* @__PURE__ */ V(() => Aa(Y(s).recup_wh)), i = /* @__PURE__ */ V(() => [
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
				var f = q(a, 2), h = W(f), g = K(q(W(h)), !0);
				z(h);
				var _ = q(h, 2), v = K(q(W(_)), !0);
				z(_);
				var y = q(_, 2), b = K(q(W(y)), !0);
				z(y);
				var x = q(y, 2), S = K(q(W(x)), !0);
				z(x), z(f), z(r);
				var C = q(r, 2), ee = W(C), te = K(q(W(ee)));
				z(ee);
				var w = q(ee, 2), T = (e) => {
					{
						let t = /* @__PURE__ */ V(() => i(Y(m))), n = /* @__PURE__ */ V(() => i(Y(p))), r = /* @__PURE__ */ V(() => Y(u).length ? `, ${Y(u).length} driving events marked` : ""), a = /* @__PURE__ */ V(() => Y(l).series.map((e) => ({
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
				}, ne = (e) => {
					Z(e, Fm());
				};
				$(w, (e) => {
					Y(l) ? e(T) : e(ne, -1);
				}), z(C), J((e, t, n, r, i, a) => {
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
			$(re, (e) => {
				Y(s).approx || e(D);
			});
			var O = q(re, 2), k = (e) => {
				var n = Rm(), r = q(W(n), 2), i = K(r);
				hi(q(r, 2), 17, () => Y(v), (e) => e.name, (e, t) => {
					let n = /* @__PURE__ */ V(() => as(Y(t).m.delta, Y(t).unit, Y(t).digits));
					var r = Lm(), i = W(r), a = W(i), o = K(a, !0), s = q(a, 2);
					let c;
					var l = K(s, !0);
					z(i);
					var u = q(i, 2), d = q(W(u));
					let f;
					z(u);
					var p = K(q(u, 2));
					z(r), J((e, r, i) => {
						Q(o, Y(t).name), c = Bi(s, 1, "svelte-5xbjqg", null, c, {
							good: Y(n) !== "same" && Y(t).m.delta < 0,
							worse: Y(n) !== "same" && Y(t).m.delta > 0
						}), Q(l, Y(n)), f = Hi(d, "", f, { left: e }), Q(p, `${r ?? ""} · usually ${i ?? ""}`);
					}, [
						() => `${is(Y(t).m.mine, Y(t).m.usual) ?? ""}%`,
						() => Y(t).text(Y(t).m.mine),
						() => Y(t).text(Y(t).m.usual)
					]), Z(e, r);
				}), z(n), J((e) => Q(i, `${e ?? ""}, ${t().similar.n ?? ""} earlier ${t().similar.n === 1 ? "trip" : "trips"}`), [() => ps(Y(s))]), Z(e, n);
			};
			$(O, (e) => {
				Y(v).length && e(k);
			});
			var A = q(O, 2), ae = W(A), j = W(ae), M = K(q(W(j)), !0);
			z(j);
			var N = q(j, 2), P = K(q(W(N)), !0);
			z(N);
			var oe = q(N, 2), se = K(q(W(oe)), !0);
			z(oe), z(ae), z(A), J((e, t, n) => {
				Q(M, e), Q(P, t), Q(se, n);
			}, [
				() => ss(r(Y(s).start_pct), r(Y(s).end_pct), "%"),
				() => hs(Y(s).avg_temp_c),
				() => ss(r(Y(s).odometer_start_km), r(Y(s).odometer_end_km), "km")
			]), Z(e, y);
		}, u = /* @__PURE__ */ V(() => `trips/${encodeURIComponent(t.vid)}/${t.start}`);
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
	nt();
}
// src/pages/Activity.svelte
var Vm = !1, Hm = /* @__PURE__ */ X("<span class=\"svelte-hc7ao7\"> </span>"), Um = /* @__PURE__ */ X("<li class=\"svelte-hc7ao7\"><!></li>"), Wm = /* @__PURE__ */ X("<section><h2 class=\"chrome svelte-hc7ao7\"> <!></h2> <ul class=\"svelte-hc7ao7\"></ul></section>"), Gm = /* @__PURE__ */ X("<p class=\"msg\"> </p>"), Km = /* @__PURE__ */ X("<div class=\"msg\" role=\"alert\"><p>Couldn't load your activity.</p> <button class=\"btn\">Retry</button></div>"), qm = /* @__PURE__ */ X("<p class=\"msg\" aria-busy=\"true\">Loading…</p>"), Jm = /* @__PURE__ */ X("<div aria-hidden=\"true\"></div>"), Ym = /* @__PURE__ */ X("<div><div><h1 class=\"page-title\" tabindex=\"-1\">Activity</h1> <!> <!> <div class=\"filter svelte-hc7ao7\"><!></div> <div><!> <!></div> <!></div> <!></div>");
function Xm(e, t) {
	tt(t, !0);
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
	}, o = /* @__PURE__ */ H(cn([])), s = /* @__PURE__ */ H(null), c = /* @__PURE__ */ H(void 0), l = /* @__PURE__ */ H(void 0), u = /* @__PURE__ */ H(cn(Ro.filter)), d = /* @__PURE__ */ H(!1), p, m = /* @__PURE__ */ V(() => Po(Ro.days, Y(u))), _ = /* @__PURE__ */ V(() => n() && No({
		kind: n().kind,
		vehicle_id: n().vid,
		start: n().start
	})), v = /* @__PURE__ */ V(() => n() ? Fo(Ro.days, Ro.filter, n().kind, n().vid, n().start) : {
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
			e.current && U(o, n.vehicles, !0);
		} catch {}
	}
	let te = g();
	async function w() {
		if (!r()) return;
		let e = te.next();
		try {
			let t = await h("onboarding");
			e.current && U(s, t, !0);
		} catch {}
	}
	An(() => (Ho(t.view), ee(), w(), () => (C.reset(), te.reset()))), An(() => {
		let e = Ro.filter;
		if (e === Tr(() => Y(u))) return void U(d, !1);
		U(d, !0);
		let t = ho("--fade") / 2, n = setTimeout(() => (U(u, e, !0), U(d, !1)), t);
		return () => clearTimeout(n);
	}), An(() => {
		let e = () => {
			document.visibilityState === "visible" && (Wo(), ee(), w());
		}, t = setInterval(e, 6e4);
		return document.addEventListener("visibilitychange", e), () => {
			clearInterval(t), document.removeEventListener("visibilitychange", e);
		};
	}), An(() => {
		if (!Y(l) || Ro.next == null || Ro.loading || Ro.error) return;
		let e = new IntersectionObserver(([e]) => e.isIntersecting && Uo(), { rootMargin: "400px" });
		return e.observe(Y(l)), () => e.disconnect();
	});
	var T = Ym();
	let ne;
	var E = W(T);
	let re;
	var D = W(E);
	ga(D, (e) => U(c, e), () => Y(c));
	var O = q(D, 2), ie = (e) => {
		{
			let t = /* @__PURE__ */ V(f);
			ic(e, {
				get checklist() {
					return Y(s);
				},
				get places() {
					return Y(t);
				},
				reload: w,
				get gone() {
					return Y(c);
				}
			});
		}
	}, k = /* @__PURE__ */ V(() => Y(s) && Zo(r(), Y(s), f()));
	$(O, (e) => {
		Y(k) && e(ie);
	});
	var A = q(O, 2);
	cc(A, { get vehicles() {
		return Y(o);
	} });
	var ae = q(A, 2);
	fc(W(ae), {
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
	}), z(ae);
	var j = q(ae, 2);
	let M;
	var N = W(j);
	hi(N, 17, () => Y(m), (e) => e.date, (e, t) => {
		let n = /* @__PURE__ */ V(() => Pa(Y(t).summary));
		var r = Wm(), i = W(r), a = W(i, !0), o = q(a), s = (e) => {
			var t = Hm(), r = K(t);
			J(() => Q(r, ` · ${Y(n) ?? ""}`)), Z(e, t);
		};
		$(o, (e) => {
			Y(n) && e(s);
		}), z(i);
		var c = q(i, 2);
		hi(c, 21, () => Y(t).items, (e) => `${e.kind}/${e.vehicle_id}/${e.start}`, (e, t) => {
			var n = Um(), r = W(n), i = (e) => {
				{
					let n = /* @__PURE__ */ V(() => y(Y(t)));
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
					let n = /* @__PURE__ */ V(() => y(Y(t)));
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
			}), z(n), Z(e, n);
		}), z(c), z(r), J((e) => Q(a, e), [() => eo(Y(t).date, Ro.today)]), Z(e, r);
	});
	var P = q(N, 2), oe = (e) => {
		var t = Gm(), n = K(t, !0);
		J(() => Q(n, a[Y(u)])), Z(e, t);
	};
	$(P, (e) => {
		Y(m).length || Ro.loading || Ro.error || Ro.next != null || e(oe);
	}), z(j), ga(j, (e) => p = e, () => p);
	var se = q(j, 2), ce = (e) => {
		var n = Km(), r = q(W(n), 2);
		z(n), Fr("click", r, () => Ro.days.length ? Uo() : Ho(t.view)), Z(e, n);
	}, le = (e) => {
		Z(e, qm());
	}, ue = (e) => {
		var t = Jm();
		ga(t, (e) => U(l, e), () => Y(l)), Z(e, t);
	};
	$(se, (e) => {
		Ro.error ? e(ce) : Ro.loading ? e(le, 1) : Ro.next != null && e(ue, 2);
	}), z(E);
	var de = q(E, 2), fe = (e) => {
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
				var i = qr(), a = G(i), o = (e) => {
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
	$(de, (e) => {
		n() && e(fe);
	}), z(T), J(() => {
		ne = Bi(T, 1, "split svelte-hc7ao7", null, ne, { two: ao.split && n() }), re = Bi(E, 1, "page svelte-hc7ao7", null, re, { wide: ao.wide }), M = Bi(j, 1, "list svelte-hc7ao7", null, M, { out: Y(d) });
	}), Z(e, T), nt();
}
Ir(["click"]);
// src/pages/settings/FixedCosts.svelte
var Zm = /* @__PURE__ */ X("<div class=\"row split\"><span> <br/><span class=\"muted\"> </span></span> <button type=\"button\" class=\"danger press\">Delete</button></div> <form class=\"row split\"><label class=\"grow inline\">End date <input name=\"end\" type=\"date\"/></label> <button class=\"press\" type=\"submit\">Save</button></form>", 1), Qm = /* @__PURE__ */ X("<p class=\"row muted\">No fixed costs.</p>"), $m = /* @__PURE__ */ X("<option> </option>"), eh = /* @__PURE__ */ X("<form class=\"row fields\"><label class=\"field wide\">Name<input required=\"\" maxlength=\"40\"/></label> <label class=\"field\">Amount (€)<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" required=\"\"/></label> <label class=\"field\">Period<select></select></label> <label class=\"field\">Start<input type=\"date\" required=\"\"/></label> <label class=\"field\">End (optional)<input type=\"date\"/></label> <button class=\"press\" type=\"submit\">Add</button> <button class=\"press\" type=\"button\">Cancel</button></form>"), th = /* @__PURE__ */ X("<div class=\"row\"><button class=\"press\" type=\"button\">Add fixed cost</button></div>"), nh = /* @__PURE__ */ X("<h3> </h3> <div class=\"list card\"><!> <!></div>", 1), rh = /* @__PURE__ */ X("<h2>Fixed costs</h2> <p class=\"note caption\">Monthly card fees, insurance and the like. Empty the end date to run a cost on.</p> <!>", 1);
function ih(e, t) {
	tt(t, !0);
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
	}), i = /* @__PURE__ */ H(null), a = /* @__PURE__ */ H(cn(r())), o = /* @__PURE__ */ H(!1), s = (e) => t.data.prices.fixed_costs.filter((t) => t.vehicle_id === e);
	function c(e) {
		U(a, r(), !0), U(i, e, !0);
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
		U(o, !0), await t.change(() => m("POST", `vehicles/${Y(i)}/fixed_costs`, n)) && U(i, null), U(o, !1);
	}
	async function u(e, n) {
		e.preventDefault();
		let r = e.currentTarget.elements.end;
		r.value !== (n.end ?? "") && (await t.change(() => m("PUT", `fixed_costs/${n.id}`, { end: r.value || null })) || (r.value = n.end ?? ""));
	}
	let d = (e) => confirm(`Delete "${e.name}"?`) && t.change(() => m("DELETE", `fixed_costs/${e.id}`)), f = (e) => e.focus();
	var p = rh();
	hi(q(G(p), 4), 17, () => t.data.vehicles, (e) => e.id, (e, t) => {
		var r = nh(), p = G(r), m = K(p, !0), h = q(p, 2), g = W(h);
		hi(g, 17, () => s(Y(t).id), (e) => e.id, (e, t) => {
			var n = Zm(), r = G(n), i = W(r), a = W(i, !0), o = K(q(a, 2));
			z(i);
			var s = q(i, 2);
			z(r);
			var c = q(r, 2), l = W(c), f = q(W(l));
			ea(f), z(l);
			var p = q(l, 2);
			z(c), J((e) => {
				Q(a, Y(t).name), Q(o, `${e ?? ""} · ${Y(t).period ?? ""} · from ${Y(t).start ?? ""}${Y(t).end ? ` to ${Y(t).end}` : ""}`), ra(s, "aria-label", `Delete ${Y(t).name}`), ra(f, "aria-label", `End date of ${Y(t).name}`), ra(f, "min", Y(t).start), ta(f, Y(t).end ?? ""), ra(p, "aria-label", `Save end date of ${Y(t).name}`);
			}, [() => Ss(Y(t).amount)]), Fr("click", s, () => d(Y(t))), Pr("submit", c, (e) => u(e, Y(t))), Z(e, n);
		}, (e) => {
			Z(e, Qm());
		});
		var _ = q(g, 2), v = (e) => {
			var t = eh(), r = W(t), s = q(W(r));
			ea(s), Pi(s, () => f), z(r);
			var c = q(r, 2), u = q(W(c));
			ea(u), z(c);
			var d = q(c, 2), p = q(W(d));
			hi(p, 21, () => n, di, (e, t) => {
				var n = $m(), r = K(n, !0), i = {};
				J(() => {
					Q(r, Y(t)), i !== (i = Y(t)) && (n.value = (n.__value = i) ?? "");
				}), Z(e, n);
			}), z(p), Ki(p), z(d);
			var m = q(d, 2), h = q(W(m));
			ea(h), z(m);
			var g = q(m, 2), _ = q(W(g));
			ea(_), z(g);
			var v = q(g, 2), y = q(v, 2);
			z(t), J(() => {
				ra(_, "min", Y(a).start), v.disabled = Y(o);
			}), Pr("submit", t, l), sa(s, () => Y(a).name, (e) => Y(a).name = e), sa(u, () => Y(a).amount, (e) => Y(a).amount = e), qi(p, () => Y(a).period, (e) => Y(a).period = e), sa(h, () => Y(a).start, (e) => Y(a).start = e), sa(_, () => Y(a).end, (e) => Y(a).end = e), Fr("click", y, () => U(i, null)), Z(e, t);
		}, y = (e) => {
			var n = th();
			Fr("click", K(n), () => c(Y(t).id)), Z(e, n);
		};
		$(_, (e) => {
			Y(i) === Y(t).id ? e(v) : e(y, -1);
		}), z(h), J(() => Q(m, Y(t).name)), Z(e, r);
	}), Z(e, p), nt();
}
Ir(["click"]);
// src/pages/settings/Prices.svelte
var ah = /* @__PURE__ */ X("<form class=\"row fields\"><label class=\"field\">€/kWh<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" required=\"\"/></label> <label class=\"field\">Start fee<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\"/></label> <label class=\"field\">€/min<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\"/></label> <label class=\"field\">Valid from<input type=\"date\" required=\"\"/></label> <button class=\"press\" type=\"submit\">Save</button> <button class=\"press\" type=\"button\">Cancel</button></form>"), oh = /* @__PURE__ */ X("<div class=\"row split\"><span> <br/><span class=\"muted\"> </span></span> <button class=\"press\" type=\"button\">Change</button></div> <!>", 1), sh = /* @__PURE__ */ X("<form class=\"row\"><label class=\"grow\"><span class=\"sr\">Location name</span><input required=\"\" maxlength=\"40\"/></label> <button class=\"press\" type=\"submit\">Rename</button> <button type=\"button\" class=\"danger press\">Delete</button></form> <div class=\"row split\"><span class=\"muted\"> </span> <button class=\"press\" type=\"button\">Change</button></div> <!>", 1), ch = /* @__PURE__ */ X("<h3>Charge locations</h3> <div class=\"list card\"></div>", 1), lh = /* @__PURE__ */ X("<h2 id=\"prices\" tabindex=\"-1\">Prices</h2> <p class=\"note caption\">A new price counts from its date.</p> <div class=\"list card\"></div> <!>", 1);
function uh(e, t) {
	tt(t, !0);
	let n = (e, t = E) => {
		var n = qr(), a = G(n), s = (e) => {
			var t = ah(), n = W(t), a = q(W(n));
			ea(a), Pi(a, () => g), z(n);
			var s = q(n, 2), c = q(W(s));
			ea(c), z(s);
			var l = q(s, 2), u = q(W(l));
			ea(u), z(l);
			var d = q(l, 2), p = q(W(d));
			ea(p), z(d);
			var m = q(d, 2), h = q(m, 2);
			z(t), J(() => m.disabled = Y(r)), Pr("submit", t, f), sa(a, () => Y(o).per_kwh, (e) => Y(o).per_kwh = e), sa(c, () => Y(o).start_fee, (e) => Y(o).start_fee = e), sa(u, () => Y(o).per_min, (e) => Y(o).per_min = e), sa(p, () => Y(o).from, (e) => Y(o).from = e), Fr("click", h, () => U(i, null)), Z(e, t);
		};
		$(a, (e) => {
			Y(i) === t() && e(s);
		}), Z(e, n);
	}, r = /* @__PURE__ */ H(!1), i = /* @__PURE__ */ H(null), a = [], o = /* @__PURE__ */ H(cn({
		per_kwh: "",
		start_fee: "",
		per_min: "",
		from: ""
	})), s = /* @__PURE__ */ H(cn({}));
	An(() => {
		U(s, Object.fromEntries(t.data.prices.spots.map((e) => [e.id, e.name])), !0);
	});
	let c = () => Date.now(), l = (e) => e ? [
		`${Ss(e.per_kwh)}/kWh`,
		e.start_fee && `start fee ${Ss(e.start_fee)}`,
		e.per_min && `${Ss(e.per_min)}/min`
	].filter(Boolean).join(" · ") : "Not set", u = /* @__PURE__ */ V(() => [["ac", "Default AC price"], ["dc", "Default DC price"]].map(([e, n]) => ({
		id: e,
		label: n,
		list: t.data.prices[e]
	})));
	function d(e, t) {
		a = t;
		let n = ks(a, c());
		U(o, {
			per_kwh: n?.per_kwh ?? "",
			start_fee: n?.start_fee ?? "",
			per_min: n?.per_min ?? "",
			from: Xa()
		}, !0), U(i, e, !0);
	}
	async function f(e) {
		e.preventDefault();
		let n = {
			valid_from: Ds(a, Y(o).from),
			per_kwh: Number(Y(o).per_kwh),
			start_fee: Number(Y(o).start_fee),
			per_min: Number(Y(o).per_min)
		};
		U(r, !0), await t.change(() => m("PUT", `prices/${Y(i)}`, n)) && U(i, null), U(r, !1);
	}
	let p = (e) => t.change(() => m("PUT", `spots/${e.id}`, { name: Y(s)[e.id] })), h = (e) => confirm(`Delete "${e.name}"? Its charges go back to the default price.`) && t.change(() => m("DELETE", `spots/${e.id}`)), g = (e) => e.focus();
	var _ = lh(), v = q(G(_), 4);
	hi(v, 21, () => Y(u), (e) => e.id, (e, t) => {
		var r = oh(), i = G(r), a = W(i), o = W(a, !0), s = K(q(o, 2), !0);
		z(a);
		var u = q(a, 2);
		z(i);
		var f = q(i, 2);
		n(f, () => Y(t).id), J((e) => {
			Q(o, Y(t).label), Q(s, e), ra(u, "aria-label", `Change ${Y(t).label}`);
		}, [() => l(ks(Y(t).list, c()))]), Fr("click", u, () => d(Y(t).id, Y(t).list)), Z(e, r);
	}), z(v);
	var y = q(v, 2), b = (e) => {
		var r = ch(), i = q(G(r), 2);
		hi(i, 21, () => t.data.prices.spots, (e) => e.id, (e, t) => {
			var r = sh(), i = G(r), a = W(i), o = q(W(a));
			ea(o), z(a);
			var u = q(a, 2), f = q(u, 2);
			z(i);
			var m = q(i, 2), g = W(m), _ = K(g, !0), v = q(g, 2);
			z(m);
			var y = q(m, 2);
			n(y, () => Y(t).id), J((e) => {
				ra(u, "aria-label", `Rename ${Y(t).name}`), ra(f, "aria-label", `Delete ${Y(t).name}`), Q(_, e), ra(v, "aria-label", `Change price of ${Y(t).name}`);
			}, [() => l(ks(Y(t).tariffs, c()))]), Pr("submit", i, (e) => {
				e.preventDefault(), p(Y(t));
			}), sa(o, () => Y(s)[Y(t).id], (e) => Y(s)[Y(t).id] = e), Fr("click", f, () => h(Y(t))), Fr("click", v, () => d(Y(t).id, Y(t).tariffs)), Z(e, r);
		}), z(i), Z(e, r);
	};
	$(y, (e) => {
		t.data.prices.spots.length && e(b);
	}), Z(e, _), nt();
}
Ir(["click"]);
// src/pages/Settings.svelte
var dh = /* @__PURE__ */ X("<p class=\"err svelte-1ozf5k3\" role=\"alert\"> </p>"), fh = /* @__PURE__ */ X("<p class=\"note\" role=\"status\"> </p>"), ph = /* @__PURE__ */ X("<form class=\"row\"><label class=\"grow\"><span class=\"sr\">Group name</span><input required=\"\" maxlength=\"40\"/></label> <button class=\"press\" type=\"submit\">Rename</button> <button type=\"button\" class=\"danger press\">Delete</button></form>"), mh = /* @__PURE__ */ X("<p class=\"row muted\">No groups yet.</p>"), hh = /* @__PURE__ */ X("<button class=\"danger press\" type=\"button\">Keep its history</button> <button class=\"danger press\" type=\"button\">Delete everything</button> <button class=\"press\" type=\"button\">Cancel</button>", 1), gh = /* @__PURE__ */ X("<button class=\"danger press\" type=\"button\">Remove car</button>"), _h = /* @__PURE__ */ X("<option> </option>"), vh = /* @__PURE__ */ X("<label class=\"row split\"> <input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\"/></label>"), yh = /* @__PURE__ */ X("<label class=\"row split\"><span> <span class=\"muted\"> </span></span> <input type=\"checkbox\"/></label>"), bh = /* @__PURE__ */ X("<p class=\"row muted\">No users yet.</p>"), xh = /* @__PURE__ */ X("<section><h3> </h3> <div class=\"row\"><button class=\"press\" type=\"button\">Configure</button> <!></div> <div class=\"list card\"><label class=\"row split\">Cost group <select><option>No group</option><!></select></label> <!></div> <fieldset><legend>Viewers</legend> <div class=\"list card\"></div></fieldset></section>"), Sh = /* @__PURE__ */ X("<div class=\"row split\"><span> <span class=\"muted\">Archived</span></span> <button class=\"danger press\" type=\"button\">Delete history</button></div>"), Ch = /* @__PURE__ */ X("<h2>Archived</h2> <div class=\"list card\"></div>", 1), wh = /* @__PURE__ */ X("<div class=\"row\"><button class=\"press\" type=\"button\">Show getting started</button></div>"), Th = /* @__PURE__ */ X("<h2>Cost groups</h2> <div class=\"list card\"><!> <form class=\"row\"><label class=\"grow\"><span class=\"sr\">New group</span><input required=\"\" maxlength=\"40\" placeholder=\"New group\"/></label> <button class=\"press\" type=\"submit\">Add group</button></form></div> <!> <h2 id=\"cars\" tabindex=\"-1\">Cars</h2> <p class=\"note caption\">Users appear here after they open this page once. Administrators always see every car.</p> <div class=\"row\"><button class=\"press\" type=\"button\">Add car</button></div> <!> <!> <!> <!>", 1), Eh = /* @__PURE__ */ X("<p class=\"msg\">Loading…</p>"), Dh = /* @__PURE__ */ X("<div class=\"page settings svelte-1ozf5k3\"><h1 class=\"page-title\">Settings</h1> <!> <!> <!></div>");
function Oh(e, t) {
	tt(t, !0);
	let n = xa(t, "section", 3, null), r = /* @__PURE__ */ H(null), i = /* @__PURE__ */ H(null), a = /* @__PURE__ */ H(""), o = /* @__PURE__ */ H(""), s = /* @__PURE__ */ H(cn({})), c = /* @__PURE__ */ H(null), l = !1, u = /* @__PURE__ */ H(!1), d = /* @__PURE__ */ H(void 0), p = /* @__PURE__ */ H(0), _ = /* @__PURE__ */ V(() => Y(p) > 0), v = g(), y = (e) => U(a, e.detail || `Could not save (${e.message})`, !0);
	async function b() {
		let e = v.next(), t = l;
		l = !1;
		try {
			let [t, n] = await Promise.all([h("settings"), h("onboarding").catch(() => null)]);
			if (!e.current) return;
			U(r, t, !0), U(i, n, !0), U(u, !1), U(s, Object.fromEntries(t.groups.map((e) => [e.id, e.name])), !0);
		} catch (n) {
			if (!e.current) return;
			qs(n, t) ? (U(u, !0), U(r, {
				...Y(r),
				vehicles: []
			}, !0)) : U(a, `Could not load (${n.message})`);
		}
	}
	async function x(e) {
		U(a, ""), an(p);
		let t = !0;
		try {
			await e();
		} catch (e) {
			t = !1, y(e);
		}
		return await b(), an(p, -1), t;
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
		await x(() => m("POST", "groups", { name: Y(o) })), Y(a) || U(o, "");
	}), te = (e) => C(() => x(() => m("PUT", `groups/${e.id}`, { name: Y(s)[e.id] }))), w = (e) => confirm(`Delete group "${e.name}"?`) && x(() => m("DELETE", `groups/${e.id}`)), T = (e, t, n) => () => m("PUT", `vehicles/${e.id}`, {
		group_id: t,
		viewers: n
	}), ne = (e, t) => (U(c, null), C(() => x(async () => {
		let n = await m("DELETE", `vehicles/${e.id}?history=${t}`);
		l = !0, U(a, Gs(n) ?? "", !0);
	}), Y(d))), E = (e) => confirm(`Remove "${e.name}" and delete everything stored for it? This cannot be undone.`) && ne(e, "delete"), re = (e) => confirm(`Delete the stored history of "${e.name}"? This cannot be undone.`) && C(() => x(() => m("DELETE", `vehicles/${e.id}/history`)), Y(d)), D = (e) => e.focus(), O = (e, t) => () => m("PUT", `vehicles/${e.id}/card`, t), k = async () => {
		await x(() => m("PUT", "onboarding", { hidden: !1 })) && (location.hash = "#/activity");
	}, A = null;
	An(() => {
		if (!n()) A = null;
		else if (Y(r) && n() !== A) {
			A = n();
			let e = document.getElementById(n());
			e?.scrollIntoView(), e?.focus({ preventScroll: !0 });
		}
	}), b();
	var ae = Dh(), j = q(W(ae), 2), M = (e) => {
		var t = dh(), n = K(t, !0);
		J(() => Q(n, Y(a))), Z(e, t);
	};
	$(j, (e) => {
		Y(a) && e(M);
	});
	var N = q(j, 2), P = (e) => {
		var t = fh(), n = K(t, !0);
		J(() => Q(n, Ks)), Z(e, t);
	};
	$(N, (e) => {
		Y(u) && e(P);
	});
	var oe = q(N, 2), se = (e) => {
		let t = /* @__PURE__ */ V(() => Ws(Y(r).vehicles));
		var n = Th(), a = q(G(n), 2), l = W(a);
		hi(l, 17, () => Y(r).groups, (e) => e.id, (e, t) => {
			var n = ph(), r = W(n), i = q(W(r));
			ea(i), z(r);
			var a = q(r, 2), o = q(a, 2);
			z(n), J(() => {
				a.disabled = Y(_), ra(a, "aria-label", `Rename ${Y(t).name}`), o.disabled = Y(_), ra(o, "aria-label", `Delete ${Y(t).name}`);
			}), Pr("submit", n, (e) => {
				e.preventDefault(), te(Y(t));
			}), sa(i, () => Y(s)[Y(t).id], (e) => Y(s)[Y(t).id] = e), Fr("click", o, () => w(Y(t))), Z(e, n);
		}, (e) => {
			Z(e, mh());
		});
		var u = q(l, 2), p = W(u), m = q(W(p));
		ea(m), z(p);
		var h = q(p, 2);
		z(u), z(a);
		var g = q(a, 2);
		uh(g, {
			get data() {
				return Y(r);
			},
			change: x
		});
		var v = q(g, 6), y = W(v);
		ga(y, (e) => U(d, e), () => Y(d)), z(v);
		var b = q(v, 2);
		hi(b, 17, () => Y(t).active, (e) => e.id, (e, t) => {
			var n = xh(), i = W(n), a = K(i, !0), o = q(i, 2), s = W(o), l = q(s, 2), u = (e) => {
				var n = hh(), r = G(n), i = q(r, 2), a = q(i, 2);
				Pi(a, () => D), J(() => {
					r.disabled = Y(_), i.disabled = Y(_);
				}), Fr("click", r, () => ne(Y(t), "keep")), Fr("click", i, () => E(Y(t))), Fr("click", a, () => U(c, null)), Z(e, n);
			}, d = (e) => {
				var n = gh();
				J(() => n.disabled = Y(_)), Fr("click", n, () => U(c, Y(t).id, !0)), Z(e, n);
			};
			$(l, (e) => {
				Y(c) === Y(t).id ? e(u) : e(d, -1);
			}), z(o);
			var f = q(o, 2), p = W(f), m = q(W(p)), h = W(m);
			h.value = h.__value = "", hi(q(h), 17, () => Y(r).groups, di, (e, t) => {
				var n = _h(), r = K(n, !0), i = {};
				J(() => {
					Q(r, Y(t).name), i !== (i = Y(t).id) && (n.value = (n.__value = i) ?? "");
				}), Z(e, n);
			}), z(m);
			var g;
			Ki(m), z(p), hi(q(p, 2), 16, () => [["markup_pct", "Card markup %"], ["start_fee", "Card start fee"]], di, (e, n) => {
				var i = /* @__PURE__ */ V(() => ie(n, 2));
				let a = () => Y(i)[0], o = () => Y(i)[1], s = /* @__PURE__ */ V(() => Y(r).prices.cards[Y(t).id] ?? {
					markup_pct: 0,
					start_fee: 0
				});
				var c = vh(), l = W(c), u = q(l);
				ea(u), z(c), J(() => {
					Q(l, `${o() ?? ""} `), u.disabled = Y(_), ta(u, Y(s)[a()]);
				}), Fr("change", u, (e) => S(e, O(Y(t), {
					...Y(s),
					[a()]: Number(e.currentTarget.value)
				}), (e) => e.value = Y(s)[a()])), Z(e, c);
			}), z(f);
			var v = q(f, 2), y = q(W(v), 2);
			hi(y, 21, () => Y(r).users, (e) => e.id, (e, n) => {
				var r = yh(), i = W(r), a = W(i), o = K(q(a));
				z(i);
				var s = q(i, 2);
				ea(s), z(r), J((e, t) => {
					Q(a, `${(Y(n).name || Y(n).id) ?? ""} `), Q(o, `(last seen ${e ?? ""})`), s.disabled = Y(_), na(s, t);
				}, [() => to(Y(n).last_seen), () => Y(t).viewers.includes(Y(n).id)]), Fr("change", s, (e) => {
					let r = e.currentTarget.checked;
					S(e, T(Y(t), Y(t).group_id, r ? [...Y(t).viewers, Y(n).id] : Y(t).viewers.filter((e) => e !== Y(n).id)), (e) => e.checked = !r);
				}), Z(e, r);
			}, (e) => {
				Z(e, bh());
			}), z(y), z(v), z(n), J(() => {
				Q(a, Y(t).name), s.disabled = Y(_), m.disabled = Y(_), g !== (g = Y(t).group_id ?? "") && (m.value = (m.__value = g) ?? "", Gi(m, g));
			}), Fr("click", s, () => Js(Us)), Fr("change", m, (e) => S(e, T(Y(t), e.currentTarget.value || null, Y(t).viewers), (e) => e.value = Y(t).group_id ?? "")), Z(e, n);
		});
		var C = q(b, 2), A = (e) => {
			var n = Ch(), r = q(G(n), 2);
			hi(r, 21, () => Y(t).archived, (e) => e.id, (e, t) => {
				var n = Sh(), r = W(n), i = W(r);
				Ie(), z(r);
				var a = q(r, 2);
				z(n), J(() => {
					Q(i, `${Y(t).name ?? ""} `), a.disabled = Y(_);
				}), Fr("click", a, () => re(Y(t))), Z(e, n);
			}), z(r), Z(e, n);
		};
		$(C, (e) => {
			Y(t).archived.length && e(A);
		});
		var ae = q(C, 2);
		ih(ae, {
			get data() {
				return Y(r);
			},
			change: x
		});
		var j = q(ae, 2), M = (e) => {
			var t = wh(), n = K(t);
			J(() => n.disabled = Y(_)), Fr("click", n, k), Z(e, t);
		}, N = /* @__PURE__ */ V(() => Y(i) && Xo(Y(i), f()));
		$(j, (e) => {
			Y(N) && e(M);
		}), J(() => {
			h.disabled = Y(_), y.disabled = Y(_);
		}), Pr("submit", u, (e) => {
			e.preventDefault(), ee();
		}), sa(m, () => Y(o), (e) => U(o, e)), Fr("click", y, () => Js(Hs)), Z(e, n);
	}, ce = (e) => {
		Z(e, Eh());
	};
	$(oe, (e) => {
		Y(r) ? e(se) : Y(a) || e(ce, 1);
	}), z(ae), Z(e, ae), nt();
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
	tt(t, !0);
	let n = /* @__PURE__ */ H(void 0), r = /* @__PURE__ */ H(!1), i = /* @__PURE__ */ H(null), a = /* @__PURE__ */ H(!1), o = g();
	An(() => {
		let e = new IntersectionObserver((t) => t.some((e) => e.isIntersecting) && (U(r, !0), e.disconnect()));
		return e.observe(Y(n)), () => e.disconnect();
	});
	async function s() {
		let e = o.next();
		U(a, !1);
		try {
			let n = await h(Mh(t.view, t.period, t.at));
			if (!e.current) return;
			U(i, {
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
			e.current && U(a, !0);
		}
	}
	An(() => {
		if (Y(r)) return s(), o.reset;
	});
	var c = Uh(), l = q(W(c), 2), u = (e) => {
		var t = Vh(), n = q(W(t), 2);
		z(t), Fr("click", n, s), Z(e, t);
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
	}), z(c), ga(c, (e) => U(n, e), () => Y(n)), Z(e, c), nt();
}
Ir(["click"]);
// src/pages/Stats.svelte
var Gh = (e, t = E) => {
	var n = qh();
	let r;
	var i = W(n), a = (e) => {
		var n = Kh(), r = G(n), i = K(r, !0), a = K(q(r), !0);
		J(() => {
			Q(i, t().dir > 0 ? "▲" : "▼"), Q(a, t().dir > 0 ? "up" : "down");
		}), Z(e, n);
	};
	$(i, (e) => {
		t().dir && e(a);
	});
	var o = q(i);
	z(n), J(() => {
		r = Bi(n, 1, "trend svelte-qardfz", null, r, {
			up: t().hint && t().dir > 0,
			down: t().hint && t().dir < 0
		}), Q(o, ` ${t().text ?? ""}`);
	}), Z(e, n);
}, Kh = /* @__PURE__ */ X("<span aria-hidden=\"true\"> </span><span class=\"sr\"> </span>", 1), qh = /* @__PURE__ */ X("<span><!> </span>"), Jh = /* @__PURE__ */ X("<div class=\"msg svelte-qardfz\" role=\"alert\"><p>Couldn't load your statistics.</p> <button class=\"d-btn\">Retry</button></div>"), Yh = /* @__PURE__ */ X("<p class=\"msg svelte-qardfz\" aria-busy=\"true\">Loading…</p>"), Xh = /* @__PURE__ */ X("<span> </span>"), Zh = /* @__PURE__ */ X("<span class=\"sub caption svelte-qardfz\"><!> <!></span>"), Qh = /* @__PURE__ */ X("<p class=\"d-note\"> </p>"), $h = /* @__PURE__ */ X("<li class=\"svelte-qardfz\"><b> </b> <span class=\"d-note facts svelte-qardfz\"><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span></span></li>"), eg = /* @__PURE__ */ X("<section class=\"d-card pv svelte-qardfz\"><h2>By car</h2> <ul class=\"svelte-qardfz\"></ul></section>"), tg = /* @__PURE__ */ X("<a class=\"press svelte-qardfz\"><span class=\"k svelte-qardfz\">Longest trip</span><span class=\"v svelte-qardfz\"> </span> <span class=\"d-note svelte-qardfz\"> </span></a>"), ng = /* @__PURE__ */ X("<div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Longest trip</span><span class=\"v svelte-qardfz\"> </span></div>"), rg = /* @__PURE__ */ X("<a class=\"press svelte-qardfz\"><span class=\"k svelte-qardfz\">Most efficient trip</span><span class=\"v svelte-qardfz\"> </span> <span class=\"d-note svelte-qardfz\"> </span></a>"), ig = /* @__PURE__ */ X("<div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Most efficient trip</span><span class=\"v svelte-qardfz\"> </span><span class=\"d-note svelte-qardfz\">Trips of at least 5 km</span></div>"), ag = /* @__PURE__ */ X("<span class=\"d-note svelte-qardfz\"> </span>"), og = /* @__PURE__ */ X("<span class=\"d-note\"> </span>"), sg = /* @__PURE__ */ X("<span class=\"d-note pts svelte-qardfz\"><!></span>"), cg = /* @__PURE__ */ X("<div class=\"big\"> <small>/ 100</small><!></div>"), lg = /* @__PURE__ */ X(" <!>", 1), ug = /* @__PURE__ */ X("<div><dt> </dt><dd> <!></dd></div>"), dg = /* @__PURE__ */ X("<li class=\"svelte-qardfz\"><span class=\"bn svelte-qardfz\"> </span><span class=\"track svelte-qardfz\"><i class=\"meter svelte-qardfz\"></i></span><span class=\"bv svelte-qardfz\"> </span></li>"), fg = /* @__PURE__ */ X("<dl class=\"d-rows\"><div><dt>Standing</dt><dd> </dd></div></dl>"), pg = /* @__PURE__ */ X("<!> <dl class=\"d-rows\"></dl> <div class=\"d-head bandhead\"><h2>Consumption by speed</h2><span class=\"d-note\">km/h · kWh/100 km</span></div> <ul class=\"bands svelte-qardfz\"></ul> <!>", 1), mg = /* @__PURE__ */ X("<p class=\"d-msg\"> </p>"), hg = /* @__PURE__ */ X("<i></i>"), gg = /* @__PURE__ */ X("<li class=\"svelte-qardfz\"><i class=\"dot svelte-qardfz\"></i><span class=\"n svelte-qardfz\"> </span><span> </span><span class=\"pc svelte-qardfz\"> </span></li>"), _g = /* @__PURE__ */ X("<div class=\"share-bar\" role=\"img\"></div> <ul class=\"svelte-qardfz\"></ul>", 1), vg = /* @__PURE__ */ X("<div><div class=\"col svelte-qardfz\"><div class=\"tiles svelte-qardfz\"><div class=\"d-figs svelte-qardfz\"></div> <!></div> <!> <section class=\"d-card hl svelte-qardfz\"><h2>Highlights</h2> <ul class=\"svelte-qardfz\"><li class=\"svelte-qardfz\"><!></li> <li class=\"svelte-qardfz\"><!></li> <li class=\"svelte-qardfz\"><div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Recuperated</span><span class=\"v svelte-qardfz\"> </span> <!></div></li> <li class=\"svelte-qardfz\"><div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Cost</span><span class=\"v svelte-qardfz\"> </span> <span class=\"d-note cost svelte-qardfz\"> <!><!> <!></span></div></li></ul></section> <section class=\"d-card sty svelte-qardfz\"><div class=\"d-head\"><h2>Driving style</h2><!></div> <!></section></div> <div class=\"col svelte-qardfz\"><section class=\"d-card chartcard svelte-qardfz\"><div class=\"d-head\"><h2>Distance</h2><span class=\"d-note\"> </span></div> <!></section> <section class=\"d-card places svelte-qardfz\"><div class=\"d-head\"><h2>Charged by place</h2><span class=\"d-note\"> </span></div> <!></section></div></div> <div class=\"mapcard svelte-qardfz\"><!></div>", 1), yg = /* @__PURE__ */ X("<div class=\"page svelte-qardfz\"><h1 class=\"page-title\">Statistics</h1> <div class=\"seg svelte-qardfz\"><!></div> <div class=\"nav svelte-qardfz\"><button class=\"press svelte-qardfz\"><svg class=\"icon svelte-qardfz\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M15 5l-7 7 7 7\"></path></svg></button> <h2 aria-live=\"polite\" class=\"svelte-qardfz\"> </h2> <button class=\"press svelte-qardfz\"><svg class=\"icon svelte-qardfz\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 5l7 7-7 7\"></path></svg></button></div> <!></div>");
function bg(e, t) {
	tt(t, !0);
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
	], i = /* @__PURE__ */ H("week"), a = /* @__PURE__ */ H(null), o = /* @__PURE__ */ H(null), s = /* @__PURE__ */ H(!1), c = /* @__PURE__ */ H(!0), l = g(), u = (e) => (U(i, e, !0), U(a, null));
	async function d() {
		let e = l.next();
		U(c, !0), U(s, !1);
		try {
			let n = await h(jh(t.view, Y(i), Y(a)));
			e.current && U(o, n, !0);
		} catch {
			e.current && U(s, !0);
		} finally {
			e.current && U(c, !1);
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
	}, p = (e, t, n = !1) => f(Nh(e, t), n), m = (e) => Fa(e.wh_per_100km), _ = /* @__PURE__ */ V(() => Y(o)?.totals), v = /* @__PURE__ */ V(() => {
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
	}), y = /* @__PURE__ */ V(() => Y(o)?.buckets ?? []), b = /* @__PURE__ */ V(() => Y(y).map((e) => Lh(Y(i), e.start))), x = /* @__PURE__ */ V(() => Y(y).map((e) => Fa(e.wh_per_100km))), S = /* @__PURE__ */ V(() => ({
		splits: Y(b).map((e, t) => t).filter((e) => Y(i) !== "month" || Y(b)[e] === "1" || Number(Y(b)[e]) % 5 == 0),
		values: (e, t) => t.map((e) => Y(b)[e])
	})), C = /* @__PURE__ */ V(() => [{
		label: "Distance (km)",
		values: Y(y).map((e) => e.distance_m / 1e3),
		kind: "bars",
		color: "--trip"
	}, ...Y(x).some((e) => e != null) ? [{
		label: "kWh/100 km",
		values: Y(x),
		scale: "y2",
		color: "--energy"
	}] : []]), ee = /* @__PURE__ */ V(() => Y(i) === "year" ? "month" : "day"), te = /* @__PURE__ */ V(() => Y(_) ? `Distance per ${Y(ee)}: ${ka(Y(_).distance_m)} in total, average ${Ia(Y(_).wh_per_100km)}` : ""), w = /* @__PURE__ */ V(() => Y(o) ? Rh(Y(o).by_place) : []), T = (e, t) => e.other ? "--muted" : r[t % r.length], ne = /* @__PURE__ */ V(() => Y(_) ? p(Y(_).cost.total, Y(o).previous.cost.total, !0) : null), E = /* @__PURE__ */ V(() => Y(o)?.highlights), re = /* @__PURE__ */ V(() => Y(E)?.gross_wh > 0 ? Math.round(Y(E).recup_wh / Y(E).gross_wh * 100) : null), D = /* @__PURE__ */ V(() => Y(o)?.style), O = /* @__PURE__ */ V(() => Y(D)?.km > 0 ? zh(Y(D), Y(o).previous_style) : null), ie = /* @__PURE__ */ V(() => Bh(Y(O)?.points)), k = (e) => eo(Ya(e), Xa()), A = (e) => No({
		kind: "trip",
		vehicle_id: e.vehicle_id,
		start: e.start
	});
	var ae = yg(), j = q(W(ae), 2), M = W(j), N = () => Y(i), P = u;
	fc(M, {
		get options() {
			return n;
		},
		get value() {
			return N();
		},
		set value(e) {
			P(e);
		},
		label: "Period"
	}), z(j);
	var oe = q(j, 2), se = W(oe), ce = q(se, 2), le = K(ce, !0), ue = q(ce, 2);
	z(oe);
	var de = q(oe, 2), fe = (e) => {
		var t = Jh(), n = q(W(t), 2);
		z(t), Fr("click", n, d), Z(e, t);
	}, pe = (e) => {
		Z(e, Yh());
	}, me = (e) => {
		var n = vg(), r = G(n);
		let s;
		var l = W(r), u = W(l), d = W(u);
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
					var r = qr(), i = G(r), a = (e) => {
						var n = Zh(), r = W(n), i = (e) => {
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
						}), z(n), Z(e, n);
					};
					$(i, (e) => {
						(Y(t).count || Y(t).trend) && e(a);
					}), Z(e, r);
				},
				$$slots: { default: !0 }
			});
		}), z(d);
		var p = q(d, 2), m = (e) => {
			var t = Qh(), n = K(t);
			J(() => Q(n, `Change against the previous ${Y(i) ?? ""}`)), Z(e, t);
		}, h = /* @__PURE__ */ V(() => Y(v).some((e) => e.trend));
		$(p, (e) => {
			Y(h) && e(m);
		}), z(u);
		var g = q(u, 2), b = (e) => {
			var t = eg(), n = q(W(t), 2);
			hi(n, 21, () => Y(o).per_vehicle, (e) => e.id, (e, t) => {
				var n = $h(), r = W(n), i = K(r, !0), a = q(r, 2), o = W(a), s = K(o, !0), c = q(o), l = K(c, !0), u = q(c), d = K(u), f = q(u), p = K(f), m = K(q(f));
				z(a), z(n), J((e, n, r, a, o) => {
					Q(i, Y(t).name), Q(s, e), Q(l, n), Q(d, `${r ?? ""} used`), Q(p, `${a ?? ""} charged`), Q(m, `${o ?? ""} cost`);
				}, [
					() => ka(Y(t).totals.distance_m),
					() => Ia(Y(t).totals.wh_per_100km),
					() => Aa(Y(t).totals.net_wh),
					() => Aa(Y(t).totals.charged_wh),
					() => Ss(Y(t).totals.cost.total)
				]), Z(e, n);
			}), z(n), z(t), Z(e, t);
		};
		$(g, (e) => {
			Y(o).per_vehicle && e(b);
		});
		var x = q(g, 2), ae = q(W(x), 2), j = W(ae), M = W(j), N = (e) => {
			var t = tg(), n = q(W(t)), r = K(n, !0), i = K(q(n, 2));
			z(t), J((e, n, a, o) => {
				ra(t, "href", e), Q(r, n), Q(i, `${a ?? ""} · ${o ?? ""}`);
			}, [
				() => A(Y(E).longest),
				() => ka(Y(E).longest.distance_m),
				() => ps(Y(E).longest),
				() => k(Y(E).longest.start)
			]), Z(e, t);
		}, P = (e) => {
			var t = ng(), n = K(q(W(t)), !0);
			z(t), J(() => Q(n, "–")), Z(e, t);
		};
		$(M, (e) => {
			Y(E).longest ? e(N) : e(P, -1);
		}), z(j);
		var oe = q(j, 2), se = W(oe), ce = (e) => {
			var t = rg(), n = q(W(t)), r = K(n), i = K(q(n, 2));
			z(t), J((e, n, a) => {
				ra(t, "href", e), Q(r, `${n ?? ""} kWh/100 km`), Q(i, `${a ?? ""} · trips of at least 5 km`);
			}, [
				() => A(Y(E).most_efficient),
				() => (Y(E).most_efficient.wh_per_100km / 1e3).toFixed(1),
				() => k(Y(E).most_efficient.start)
			]), Z(e, t);
		}, le = (e) => {
			var t = ig(), n = K(q(W(t)), !0);
			Ie(), z(t), J(() => Q(n, "–")), Z(e, t);
		};
		$(se, (e) => {
			Y(E).most_efficient ? e(ce) : e(le, -1);
		}), z(oe);
		var ue = q(oe, 2), de = W(ue), fe = q(W(de)), pe = K(fe, !0), me = q(fe, 2), he = (e) => {
			var t = ag(), n = K(t);
			J((e) => Q(n, `${Y(re) ?? ""} % of the ${e ?? ""} used before recuperation`), [() => Aa(Y(E).gross_wh)]), Z(e, t);
		};
		$(me, (e) => {
			Y(re) != null && e(he);
		}), z(de), z(ue);
		var ge = q(ue, 2), _e = W(ge), ve = q(W(_e)), ye = K(ve, !0), be = q(ve, 2), xe = W(be), Se = q(xe), Ce = (e) => {
			var t = Kr();
			J((e) => Q(t, `· ${e ?? ""}`), [() => Es(Y(_).cost.total, Y(_).distance_m)]), Z(e, t);
		};
		$(Se, (e) => {
			Y(_).distance_m && e(Ce);
		});
		var we = q(Se), Te = (e) => {
			var t = Kr();
			J((e) => Q(t, `· ${e ?? ""}`), [() => Os(Y(_).cost.uncosted)]), Z(e, t);
		};
		$(we, (e) => {
			Y(_).cost.uncosted > 0 && e(Te);
		});
		var F = q(we, 2), Ee = (e) => {
			Gh(e, () => Y(ne));
		};
		$(F, (e) => {
			Y(ne) && e(Ee);
		}), z(be), z(_e), z(ge), z(ae), z(x);
		var De = q(x, 2), Oe = W(De), ke = q(W(Oe)), Ae = (e) => {
			var t = og(), n = K(t, !0);
			J((e) => Q(n, e), [() => Y(D).score == null ? "No trips of 2 km or more" : vs(Y(D).score)]), Z(e, t);
		};
		$(ke, (e) => {
			Y(O) && e(Ae);
		}), z(Oe);
		var je = q(Oe, 2), Me = (e) => {
			var t = pg(), n = G(t), r = (e) => {
				var t = cg(), n = W(t, !0), r = q(n, 2), i = (e) => {
					var t = sg();
					Gh(W(t), () => Y(ie)), z(t), Z(e, t);
				};
				$(r, (e) => {
					Y(ie) && e(i);
				}), z(t), J(() => Q(n, Y(D).score)), Z(e, t);
			};
			$(n, (e) => {
				Y(D).score != null && e(r);
			});
			var i = q(n, 2);
			hi(i, 21, () => Y(O).events, (e) => e.k, (e, t) => {
				let n = /* @__PURE__ */ V(() => f(Y(t).change, !0));
				var r = ug(), i = W(r), a = K(i, !0), o = q(i), s = W(o, !0), c = q(s), l = (e) => {
					var t = lg(), r = G(t, !0);
					r.nodeValue = " ", Gh(q(r), () => Y(n)), Z(e, t);
				};
				$(c, (e) => {
					Y(n) && e(l);
				}), z(o), z(r), J((e) => {
					Q(a, Y(t).name), Q(s, e);
				}, [() => ys(Y(D)[Y(t).k], Y(D).km)]), Z(e, r);
			}), z(i);
			var a = q(i, 4);
			hi(a, 21, () => Y(O).bands, (e) => e.name, (e, t) => {
				var n = dg(), r = W(n), i = K(r, !0), a = q(r), o = W(a);
				let s;
				z(a);
				var c = K(q(a), !0);
				z(n), J((e) => {
					Q(i, Y(t).name), s = Hi(o, "", s, { width: `${Y(t).share * 100}%` }), Q(c, e);
				}, [() => Y(t).value == null ? "–" : Y(t).value.toFixed(1)]), Z(e, n);
			}), z(a);
			var o = q(a, 2), s = (e) => {
				var t = fg(), n = W(t), r = K(q(W(n)), !0);
				z(n), z(t), J((e) => Q(r, e), [() => Aa(Y(D).standing_kwh * 1e3)]), Z(e, t);
			};
			$(o, (e) => {
				Y(D).standing_kwh != null && e(s);
			}), Z(e, t);
		}, I = (e) => {
			var t = mg(), n = K(t);
			J(() => Q(n, `No trips in this ${Y(i) ?? ""}.`)), Z(e, t);
		};
		$(je, (e) => {
			Y(O) ? e(Me) : e(I, -1);
		}), z(De), z(l);
		var Ne = q(l, 2), R = W(Ne), Pe = W(R), Fe = K(q(W(Pe)));
		z(Pe);
		var Le = q(Pe, 2), Re = (e) => {
			{
				let t = /* @__PURE__ */ V(() => Y(y).map((e, t) => t));
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
		}, ze = (e) => {
			var t = mg(), n = K(t);
			J(() => Q(n, `No trips in this ${Y(i) ?? ""}.`)), Z(e, t);
		};
		$(Le, (e) => {
			Y(_).distance_m > 0 ? e(Re) : e(ze, -1);
		}), z(R);
		var Be = q(R, 2), Ve = W(Be), He = K(q(W(Ve)), !0);
		z(Ve);
		var Ue = q(Ve, 2), We = (e) => {
			var t = _g(), n = G(t);
			hi(n, 23, () => Y(w), (e) => e.name, (e, t, n) => {
				var r = hg();
				let i;
				J((e) => i = Hi(r, "", i, {
					flex: `${Y(t).wh ?? ""} 1 0`,
					background: e
				}), [() => `var(${T(Y(t), Y(n)) ?? ""})`]), Z(e, r);
			}), z(n);
			var r = q(n, 2);
			hi(r, 23, () => Y(w), (e) => e.name, (e, t, n) => {
				var r = gg(), i = W(r);
				let a;
				var o = q(i), s = K(o, !0), c = q(o), l = K(c, !0), u = K(q(c));
				z(r), J((e, n, r) => {
					a = Hi(i, "", a, { background: e }), Q(s, Y(t).name), Q(l, n), Q(u, `${r ?? ""} %`);
				}, [
					() => `var(${T(Y(t), Y(n)) ?? ""})`,
					() => Aa(Y(t).wh),
					() => Math.round(Y(t).share * 100)
				]), Z(e, r);
			}), z(r), J((e) => ra(n, "aria-label", `Charged by place: ${e ?? ""}`), [() => Y(w).map((e) => `${e.name} ${Aa(e.wh)}`).join(", ")]), Z(e, t);
		}, Ge = (e) => {
			var t = mg(), n = K(t);
			J(() => Q(n, `No charging in this ${Y(i) ?? ""}.`)), Z(e, t);
		};
		$(Ue, (e) => {
			Y(w).length ? e(We) : e(Ge, -1);
		}), z(Be), z(Ne), z(r);
		var Ke = q(r, 2);
		Wh(W(Ke), {
			get view() {
				return t.view;
			},
			get period() {
				return Y(i);
			},
			get at() {
				return Y(a);
			}
		}), z(Ke), J((e, t, n, i, a) => {
			s = Bi(r, 1, "grid svelte-qardfz", null, s, { busy: Y(c) }), ra(r, "aria-busy", Y(c)), Q(pe, e), Q(ye, t), Q(xe, `${n ?? ""} charging · ${i ?? ""} fixed`), Q(Fe, `per ${Y(ee) ?? ""}`), Q(He, a);
		}, [
			() => Aa(Y(E).recup_wh),
			() => Ss(Y(_).cost.total),
			() => Ss(Y(_).cost.energy),
			() => Ss(Y(_).cost.fixed),
			() => Aa(Y(_).charged_wh)
		]), Z(e, n);
	};
	$(de, (e) => {
		Y(s) ? e(fe) : Y(o) ? e(me, -1) : e(pe, 1);
	}), z(ae), J((e) => {
		se.disabled = !Y(o) || Y(c), ra(se, "aria-label", `Previous ${Y(i) ?? ""}`), Q(le, e), ue.disabled = Y(c) || !Y(o)?.period.next_at, ra(ue, "aria-label", `Next ${Y(i) ?? ""}`);
	}, [() => Y(o) ? Ih(Y(i), Y(o).period.start, Y(o).period.end) : ""]), Fr("click", se, () => U(a, Y(o).period.prev_at, !0)), Fr("click", ue, () => U(a, Y(o).period.next_at, !0)), Z(e, ae), nt();
}
Ir(["click"]);
// src/App.svelte
var xg = /* @__PURE__ */ X("<p class=\"msg svelte-1n46o8q\"> </p>"), Sg = /* @__PURE__ */ X("<p class=\"msg svelte-1n46o8q\">Loading…</p>"), Cg = /* @__PURE__ */ X("<p class=\"msg svelte-1n46o8q\">No vehicles available to you.</p>");
function wg(e, t) {
	tt(t, !0);
	let n = /* @__PURE__ */ H(null), r = /* @__PURE__ */ H(cn({
		vehicles: [],
		groups: []
	})), i = /* @__PURE__ */ H(""), a = Da(location.hash), o = /* @__PURE__ */ H(cn(a)), s = /* @__PURE__ */ H(""), c = "car-insights-view", l = /* @__PURE__ */ V(() => [...Y(r).vehicles.map((e) => ({
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
			U(r, t, !0), Y(l).some((e) => e.value === Y(i)) || U(i, Y(l)[0]?.value || "", !0);
		} catch {}
	}
	function f() {
		let e = Y(o).page;
		U(o, Da(location.hash), !0), Y(o).redirect && location.replace(Y(o).redirect), e === "settings" && Y(o).page !== "settings" && d();
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
				var t = ie(e, 2);
				U(n, t[0], !0), U(r, t[1], !0);
			})([e, t]);
			let a = "";
			try {
				a = localStorage.getItem(c) || "";
			} catch {}
			let o = Y(l).map((e) => e.value);
			U(i, o.includes(a) ? a : o[0] || "", !0);
		} catch (e) {
			U(s, `Could not load (${e.message})`);
		}
	})();
	var m = qr(), _ = G(m), v = (e) => {
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
				U(i, e, !0);
			},
			children: (e, t) => {
				var r = qr(), a = G(r), s = (e) => {
					Oh(e, { get section() {
						return Y(o).section;
					} });
				}, c = (e) => {
					Z(e, Cg());
				}, l = (e) => {
					var t = qr();
					ui(G(t), () => Y(i), (e) => {
						bg(e, { get view() {
							return Y(i);
						} });
					}), Z(e, t);
				}, u = (e) => {
					var t = qr();
					ui(G(t), () => Y(i), (e) => {
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
	}), Z(e, m), nt();
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
