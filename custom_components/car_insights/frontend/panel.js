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
}) : o, n)), l = "/api/car_insights/ui/", u, d = (e) => u = e, f = (e, t) => u ? u.fetchWithAuth(e, t) : fetch(e, t);
async function p(e, t, n) {
	let r = await f(l + t, {
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
var m = (e) => p("GET", e);
function h() {
	let e = { current: !1 }, t = () => e.current = !1;
	return {
		next: () => (t(), e = { current: !0 }),
		reset: t
	};
}
// node_modules/svelte/src/internal/shared/utils.js
var g = Array.isArray, _ = Array.prototype.indexOf, v = Array.prototype.includes, y = Array.from, b = Object.defineProperty, x = Object.getOwnPropertyDescriptor, S = Object.getOwnPropertyDescriptors, C = Object.prototype, w = Array.prototype, T = Object.getPrototypeOf, E = Object.isExtensible;
function D(e) {
	return typeof e == "function";
}
var O = () => {};
function ee(e) {
	return typeof e?.then == "function";
}
function te(e) {
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
function A(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
// node_modules/svelte/src/internal/client/constants.js
var ne = 1 << 24, j = 1024, re = 2048, ie = 4096, ae = 8192, oe = 16384, M = 32768, N = 1 << 25, se = 65536, ce = 1 << 19, le = 1 << 20, ue = 1 << 25, de = 1 << 21, fe = 1 << 22, pe = 1 << 23, me = Symbol("$state"), he = Symbol("component"), ge = Symbol("legacy props"), _e = Symbol(""), ve = Symbol("attributes"), ye = Symbol("class"), be = Symbol("style"), xe = Symbol("text"), Se = Symbol("form reset"), Ce = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), we = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), Te = {}, P = Symbol("uninitialized"), Ee = "http://www.w3.org/1999/xhtml", De = "http://www.w3.org/2000/svg", Oe = "http://www.w3.org/1998/Math/MathML";
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
var F = !1;
function Ne(e) {
	F = e;
}
var Pe;
function Fe(e) {
	if (e === null) throw Ae(), Te;
	return Pe = e;
}
function Ie() {
	return Fe(/* @__PURE__ */ _n(Pe));
}
function I(e) {
	if (F) {
		if (/* @__PURE__ */ _n(Pe) !== null) throw Ae(), Te;
		Pe = e;
	}
}
function Le(e = 1) {
	if (F) {
		for (var t = e, n = Pe; t--;) n = /* @__PURE__ */ _n(n);
		Pe = n;
	}
}
function Re(e = !0) {
	for (var t = 0, n = Pe;;) {
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
function ze(e) {
	if (!e || e.nodeType !== 8) throw Ae(), Te;
	return e.data;
}
// node_modules/svelte/src/internal/client/reactivity/equality.js
function Be(e) {
	return e === this.v;
}
function Ve(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function He(e) {
	return !Ve(e, this.v);
}
function Ue(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
// node_modules/svelte/src/internal/client/errors.js
function We() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Ge(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ke(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function qe() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Je(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Ye() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Xe(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ze() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function R() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Qe() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function $e() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
// node_modules/svelte/src/internal/client/context.js
var et = null;
function tt(e) {
	et = e;
}
function nt(e, t = !1, n) {
	et = {
		p: et,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: tr,
		l: null
	};
}
function rt(e) {
	var t = et, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) An(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, et = t.p, it(e);
}
function it(e = {}) {
	return b(e, he, { value: !0 }), e;
}
function at() {
	return !0;
}
// node_modules/svelte/src/internal/client/dom/task.js
var ot = [];
function st() {
	var e = ot;
	ot = [], te(e);
}
function ct(e) {
	if (ot.length === 0 && !Ft) {
		var t = ot;
		queueMicrotask(() => {
			t === ot && st();
		});
	}
	ot.push(e);
}
function lt() {
	for (; ot.length > 0;) st();
}
// node_modules/svelte/src/internal/client/reactivity/status.js
var ut = ~(re | ie | j);
function dt(e, t) {
	e.f = e.f & ut | t;
}
function ft(e) {
	e.f & 512 || e.deps === null ? dt(e, j) : dt(e, ie);
}
// node_modules/svelte/src/internal/client/reactivity/utils.js
function pt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), dt(e, j);
}
// node_modules/svelte/src/internal/client/dom/elements/misc.js
var mt = !1;
function ht() {
	mt || (mt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[Se]?.();
		});
	}, { capture: !0 }));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function gt(e) {
	var t = Qn, n = tr;
	er(null), nr(null);
	try {
		return e();
	} finally {
		er(t), nr(n);
	}
}
function _t(e, t, n, r = n) {
	e.addEventListener(t, () => gt(n));
	let i = e[Se];
	e[Se] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ht();
}
// node_modules/svelte/src/internal/client/reactivity/async.js
function vt(e, t, n, r) {
	let i = at() ? St : Tt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = tr, c = yt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Cn(e, s);
			}
			bt();
		}
	}
	var d = xt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ wt(e))).then(u).catch((e) => Cn(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), bt());
	}) : f();
}
function yt() {
	var e = tr, t = Qn, n = et, r = B;
	return function(i = !0) {
		nr(e), er(t), tt(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function bt(e = !0) {
	nr(null), er(null), tt(null), e && B?.deactivate();
}
function xt() {
	var e = tr, t = e.b, n = B, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function St(e) {
	var t = 2 | re;
	return tr !== null && (tr.f |= ce), {
		ctx: et,
		deps: null,
		effects: null,
		equals: Be,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: P,
		wv: 0,
		parent: tr,
		ac: null
	};
}
var Ct = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function wt(e, t, n) {
	let r = tr;
	r === null && We();
	var i = void 0, a = Zt(P), o = !Qn, s = /* @__PURE__ */ new Set();
	return Nn(() => {
		var t = tr, n = k();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== Ce && n.reject(e);
			}).finally(bt);
		} catch (e) {
			n.reject(e), bt();
		}
		var c = B;
		if (o) {
			if (t.f & 32768) var l = xt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(Ct);
			else for (let e of s.values()) e.reject(Ct);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== Ct && (c.activate(), t ? (a.f |= pe, tn(a, t)) : (a.f & 8388608 && (a.f ^= pe), tn(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), On(() => {
		for (let e of s) e.reject(Ct);
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
function z(e) {
	let t = /* @__PURE__ */ St(e);
	return ir(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Tt(e) {
	let t = /* @__PURE__ */ St(e);
	return t.equals = He, t;
}
function Et(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Vn(t[n]);
	}
}
function Dt(e) {
	var t, n = tr, r = e.parent;
	if (!Xn && r !== null && e.v !== P && r.f & 24576) return ke(), e.v;
	nr(r);
	try {
		Et(e), t = gr(e);
	} finally {
		nr(n);
	}
	return t;
}
function Ot(e) {
	var t = Dt(e);
	!e.equals(t) && (e.wv = pr(), (!B?.is_fork || e.deps === null) && (B === null ? e.v = t : (B.capture(e, t, !0), Mt?.capture(e, t, !0)), e.deps === null)) ? dt(e, j) : Xn || (Nt === null ? ft(e) : (Dn() || B?.is_fork) && Nt.set(e, t));
}
function kt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && gt(() => {
		t.ac.abort(Ce), t.ac = null;
	}), t.fn !== null && (t.teardown = O), yr(t, 0), zn(t));
}
function At(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && br(t);
}
// node_modules/svelte/src/internal/client/reactivity/batch.js
var jt = null, B = null, Mt = null, Nt = null, Pt = null, Ft = !1, It = !1, Lt = null, Rt = null, zt = 0, Bt = 1, Vt = class e {
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
		jt === null ? jt = this : (jt.#n = this, this.#t = jt), jt = this;
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
			for (var r of n.d) dt(r, re), t(r);
			for (r of n.m) dt(r, ie), t(r);
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
		for (let e of this.#u) this.#d.delete(e), dt(e, re), this.schedule(e);
		for (let e of this.#d) dt(e, ie), this.schedule(e);
		this.apply();
		for (var t = Lt = [], n = [], r = Rt = []; this.#c.length > 0;) {
			zt++ > 1e3 && (this.#S(), Ut());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Jt(e), this.#h() || this.discard(), t;
			}
		}
		if (B = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Lt = null, Rt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) qt(e, t);
			r.length > 0 && B.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), Mt = this, Gt(n), Gt(t), Mt = null, this.#s?.resolve();
			var o = B;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (V.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= j;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= j : i & 4 ? t.push(r) : mr(r) && (i & 16 && this.#d.add(r), br(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), dt(i, re), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), B = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) pt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== P && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Nt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		B = this;
	}
	deactivate() {
		B = null, Nt = null;
	}
	flush() {
		try {
			It = !0, B = this, this.#_();
		} finally {
			zt = 0, Pt = null, Lt = null, Rt = null, It = !1, B = null, Nt = null, V.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Ct);
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
		this.#m || (this.#m = !0, ct(() => {
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
		if (B === null) {
			let t = B = new e();
			!It && !Ft && ct(() => {
				t.#e || t.flush();
			});
		}
		return B;
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
			e === null || (e.#n = t), t === null ? jt = e : t.#t = e, this.linked = !1;
		}
	}
};
function Ht(e) {
	var t = Ft, n = Mt;
	Mt = null, Ft = !0;
	try {
		var r;
		for (e && (Ht(), r = e());;) {
			if (lt(), B === null) return r;
			B.flush();
		}
	} finally {
		Ft = t, Mt = n;
	}
}
function Ut() {
	try {
		Ye();
	} catch (e) {
		Cn(e, Pt);
	}
}
var Wt = null;
function Gt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && mr(r) && (Wt = /* @__PURE__ */ new Set(), br(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Un(r), Wt?.size > 0)) {
				V.clear();
				for (let e of Wt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Wt.has(n) && (Wt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || br(n);
					}
				}
				Wt.clear();
			}
		}
		Wt = null;
	}
}
function Kt(e) {
	B.schedule(e);
}
function qt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), dt(e, j);
		for (var n = e.first; n !== null;) qt(n, t), n = n.next;
	}
}
function Jt(e) {
	dt(e, j);
	for (var t = e.first; t !== null;) Jt(t), t = t.next;
}
// node_modules/svelte/src/internal/client/reactivity/sources.js
var Yt = /* @__PURE__ */ new Set(), V = /* @__PURE__ */ new Map(), Xt = !1;
function Zt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Be,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function H(e, t) {
	let n = Zt(e, t);
	return ir(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Qt(e, t = !1, n = !0) {
	let r = Zt(e);
	return t || (r.equals = He), r;
}
function U(e, t, n = !1) {
	return Qn !== null && (!$n || Qn.f & 131072) && at() && Qn.f & 4325394 && (rr === null || !rr.has(e)) && Qe(), tn(e, n ? sn(t) : t, Rt);
}
var $t = null, en = 0;
function tn(e, t, n = null) {
	if (!e.equals(t)) {
		Xn ? V.set(e, t) : V.has(e) || V.set(e, e.v);
		var r = Vt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Dt(t), Nt === null && ft(t);
		}
		e.wv = pr(), $t = null, en = 0, on(e, re, n), $t = null, at() && tr !== null && tr.f & 1024 && !(tr.f & 96) && (sr === null ? cr([e]) : sr.push(e)), !r.is_fork && Yt.size > 0 && !Xt && nn();
	}
	return t;
}
function nn() {
	Xt = !1;
	for (let e of Yt) {
		e.f & 1024 && dt(e, ie);
		let t;
		try {
			t = mr(e);
		} catch {
			t = !0;
		}
		t && br(e);
	}
	Yt.clear();
}
function rn(e, t = 1) {
	var n = Y(e), r = t === 1 ? n++ : n--;
	return U(e, n), r;
}
function an(e) {
	U(e, e.v + 1);
}
function on(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = at(), a = r.length;
		if (en += a, en > 1e5 && $t === null && ($t = /* @__PURE__ */ new Set()), $t !== null) {
			if ($t.has(e)) return;
			$t.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== tr) {
				var l = (c & re) === 0;
				if (l && dt(s, t), c & 131072) Yt.add(s);
				else if (c & 2) {
					var u = s;
					Nt?.delete(u), on(u, ie, n);
				} else if (l) {
					var d = s;
					c & 16 && Wt !== null && Wt.add(d), n === null ? Kt(d) : n.push(d);
				}
			}
		}
	}
}
function sn(e) {
	if (typeof e != "object" || !e || me in e || he in e) return e;
	let t = T(e);
	if (t !== C && t !== w) return e;
	var n = /* @__PURE__ */ new Map(), r = g(e), i = /* @__PURE__ */ H(0), a = null, o = dr, s = (e) => {
		if (dr === o) return e();
		var t = Qn, n = dr;
		er(null), fr(o);
		var r = e();
		return er(t), fr(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ H(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			"value" in r && r.configurable !== !1 && r.enumerable !== !1 && r.writable !== !1 || Ze();
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
					let e = s(() => /* @__PURE__ */ H(P, a));
					n.set(t, e), an(i);
				}
			} else U(r, P), an(i);
			return !0;
		},
		get(t, r, i) {
			if (r === me) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || x(t, r)?.writable) && (o = s(() => /* @__PURE__ */ H(sn(c ? t[r] : P), a)), n.set(r, o)), o !== void 0) {
				var l = Y(o);
				return l === P ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var r = Reflect.getOwnPropertyDescriptor(e, t), i = n.get(t);
			if (i !== void 0) {
				var a = Y(i);
				if (a === P) return;
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
			var r = n.get(t), i = r !== void 0 && r.v !== P || Reflect.has(e, t);
			return (r !== void 0 || tr !== null && (!i || x(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ H(i ? sn(e[t]) : P, a)), n.set(t, r)), Y(r) === P) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ H(P, a)), n.set(d + "", f)) : U(f, P);
			}
			if (l === void 0) (!u || x(e, t)?.writable) && (l = s(() => /* @__PURE__ */ H(void 0, a)), U(l, sn(o)), n.set(t, l));
			else {
				u = l.v !== P;
				var p = s(() => sn(o));
				U(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var h = n.get("length"), g = Number(t);
					Number.isInteger(g) && g >= h.v && U(h, g + 1);
				}
				an(i);
			}
			return !0;
		},
		ownKeys(e) {
			Y(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== P;
			});
			for (var [r, a] of n) a.v !== P && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			R();
		}
	});
}
function cn(e) {
	try {
		if (typeof e == "object" && e && me in e) return e[me];
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
		fn = x(t, "firstChild").get, pn = x(t, "nextSibling").get, E(e) && (e[ye] = void 0, e[ve] = null, e[be] = void 0, e.__e = void 0), E(n) && (n[xe] = void 0);
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
function W(e, t) {
	if (!F) return /* @__PURE__ */ gn(e);
	var n = /* @__PURE__ */ gn(Pe);
	if (n === null) n = Pe.appendChild(hn());
	else if (t && n.nodeType !== 3) {
		var r = hn();
		return n?.before(r), Fe(r), r;
	}
	return t && xn(n), Fe(n), n;
}
function G(e, t = !1) {
	if (!F) {
		var n = /* @__PURE__ */ gn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ _n(n) : n;
	}
	if (t) {
		if (Pe?.nodeType !== 3) {
			var r = hn();
			return Pe?.before(r), Fe(r), r;
		}
		xn(Pe);
	}
	return Pe;
}
function K(e, t = !1) {
	if (!F) return /* @__PURE__ */ gn(e);
	var n = W(e, t);
	return I(e), n;
}
function q(e, t = 1, n = !1) {
	let r = F ? Pe : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ _n(r);
	if (!F) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = hn();
			return r === null ? i?.after(a) : r.before(a), Fe(a), a;
		}
		xn(r);
	}
	return Fe(r), r;
}
function vn(e) {
	e.textContent = "";
}
function yn() {
	return !1;
}
function bn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function xn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Sn(e) {
	var t = tr;
	if (t === null) return Qn.f |= pe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Cn(e, t);
}
function Cn(e, t) {
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
function wn(e) {
	tr === null && (Qn === null && Je(e), qe()), Xn && Ke(e);
}
function Tn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function En(e, t) {
	var n = tr;
	n !== null && n.f & 8192 && (e |= ae);
	var r = {
		ctx: et,
		deps: null,
		nodes: null,
		f: e | re | 512,
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
	B?.register_created_effect(r);
	var i = r;
	if (e & 4) Lt === null ? Vt.ensure().schedule(r) : Lt.push(r);
	else if (t !== null) {
		try {
			br(r);
		} catch (e) {
			throw Vn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= se));
	}
	if (i !== null && (i.parent = n, n !== null && Tn(i, n), Qn !== null && Qn.f & 2 && !(e & 64))) {
		var a = Qn;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Dn() {
	return Qn !== null && !$n;
}
function On(e) {
	let t = En(8, null);
	return dt(t, j), t.teardown = e, t;
}
function kn(e) {
	wn("$effect");
	var t = tr.f;
	if (!Qn && t & 32 && et !== null && !et.i) {
		var n = et;
		(n.e ??= []).push(e);
	} else return An(e);
}
function An(e) {
	return En(4 | le, e);
}
function jn(e) {
	Vt.ensure();
	let t = En(64 | ce, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Wn(t, () => {
			Vn(t), n(void 0);
		}) : (Vn(t), n(void 0));
	});
}
function Mn(e) {
	return En(4, e);
}
function Nn(e) {
	return En(fe | ce, e);
}
function Pn(e, t = 0) {
	return En(8 | t, e);
}
function J(e, t = [], n = [], r = []) {
	vt(r, t, n, (t) => {
		En(8, () => {
			e(...t.map(Y));
		});
	});
}
function Fn(e, t = 0) {
	return En(16 | t, e);
}
function In(e, t = 0) {
	return En(ne | t, e);
}
function Ln(e) {
	return En(32 | ce, e);
}
function Rn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Xn, r = Qn;
		Zn(!0), er(null);
		try {
			t.call(null);
		} catch (t) {
			Cn(t, e.parent);
		} finally {
			Zn(n), er(r);
		}
	}
}
function zn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && gt(() => {
			e.abort(Ce);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Vn(n, t), n = r;
	}
}
function Bn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Vn(t), t = n;
	}
}
function Vn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Hn(e.nodes.start, e.nodes.end), n = !0), e.f |= N, zn(e, t && !n), yr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Rn(e), e.f ^= N, e.f |= oe;
	var i = e.parent;
	i !== null && i.first !== null && Un(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Hn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ _n(e);
		e.remove(), e = n;
	}
}
function Un(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Wn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Gn(e, r, !0);
	var i = () => {
		n && Vn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Gn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ae;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Gn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Kn(e) {
	e.f &= -257, qn(e, !0);
}
function qn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ae, e.f & 1024 || (dt(e, re), Vt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			qn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Jn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ _n(n);
		t.append(n), n = i;
	}
}
// node_modules/svelte/src/internal/client/legacy.js
var Yn = null, Xn = !1;
function Zn(e) {
	Xn = e;
}
var Qn = null, $n = !1;
function er(e) {
	Qn = e;
}
var tr = null;
function nr(e) {
	tr = e;
}
var rr = null;
function ir(e) {
	Qn !== null && (Qn.f & 2097152 || Qn.f & 2) && (rr ??= /* @__PURE__ */ new Set()).add(e);
}
var ar = null, or = 0, sr = null;
function cr(e) {
	sr = e;
}
var lr = 1, ur = 0, dr = ur;
function fr(e) {
	dr = e;
}
function pr() {
	return ++lr;
}
function mr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (mr(a) && Ot(a), a.wv > e.wv) return !0;
		}
		t & 512 && Nt === null && dt(e, j);
	}
	return !1;
}
function hr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(rr !== null && rr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? hr(a, t, !1) : t === a && (n ? dt(a, re) : a.f & 1024 && dt(a, ie), Kt(a));
	}
}
function gr(e) {
	var t = ar, n = or, r = sr, i = Qn, a = rr, o = et, s = $n, c = dr, l = e.f;
	ar = null, or = 0, sr = null, Qn = l & 96 ? null : e, rr = null, tt(e.ctx), $n = !1, dr = ++ur, e.ac !== null && (gt(() => {
		e.ac.abort(Ce);
	}), e.ac = null);
	try {
		e.f |= de;
		var u = e.fn, d = u();
		e.f |= M;
		var f = _r(e);
		if (at() && sr !== null && !$n && f !== null && !(e.f & 6146)) for (var p = 0; p < sr.length; p++) hr(sr[p], e);
		if (i !== null && i !== e) {
			if (ur++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ur;
			if (t !== null) for (let e of t) e.rv = ur;
			sr !== null && (r === null ? r = sr : r.push(...sr));
		}
		return e.f & 8388608 && (e.f ^= pe), d;
	} catch (t) {
		return _r(e), Sn(t);
	} finally {
		e.f ^= de, ar = t, or = n, sr = r, Qn = i, rr = a, tt(o), $n = s, dr = c;
	}
}
function _r(e) {
	var t = e.deps, n = B?.is_fork;
	if (ar !== null) {
		var r;
		if (n || yr(e, or), t !== null && or > 0) for (t.length = or + ar.length, r = 0; r < ar.length; r++) t[or + r] = ar[r];
		else e.deps = t = ar;
		if (Dn() && e.f & 512) for (r = or; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && or < t.length && (yr(e, or), t.length = or);
	return t;
}
function vr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = _.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (ar === null || !v.call(ar, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512), a.v !== P && ft(a), a.ac !== null && gt(() => {
			a.ac.abort(Ce), a.ac = null, dt(a, re);
		}), kt(a), yr(a, 0);
	}
}
function yr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) vr(e, n[r]);
}
function br(e) {
	var t = e.f;
	if (!(t & 16384)) {
		dt(e, j);
		var n = tr;
		tr = e;
		try {
			t & 16777232 ? Bn(e) : zn(e), Rn(e);
			var r = gr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = lr;
		} finally {
			tr = n;
		}
	}
}
async function xr() {
	await Promise.resolve(), Ht();
}
function Y(e) {
	var t = !!(e.f & 2);
	if (Yn?.add(e), Qn !== null && !$n && !(tr !== null && tr.f & 16384) && (rr === null || !rr.has(e))) {
		var n = Qn.deps;
		if (Qn.f & 2097152) e.rv < ur && (e.rv = ur, ar === null && n !== null && n[or] === e ? or++ : ar === null ? ar = [e] : ar.push(e));
		else {
			Qn.deps ??= [], v.call(Qn.deps, e) || Qn.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [Qn] : v.call(r, Qn) || r.push(Qn);
		}
	}
	if (Xn && V.has(e)) return V.get(e);
	if (t) {
		var i = e;
		if (Xn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Cr(i)) && (a = Dt(i)), V.set(i, a), a;
		}
		var o = !(i.f & 512) && !$n && Qn !== null && !!(Qn.f & 512), s = (i.f & M) === 0;
		mr(i) && (o && (i.f |= 512), Ot(i)), o && !s && (At(i), Sr(i));
	}
	if (Nt?.has(e)) return Nt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Sr(e) {
	if (e.f |= 512, e.deps !== null) for (let n of e.deps) {
		var t = n.reactions;
		t === null ? n.reactions = [e] : v.call(t, e) || t.push(e), n.f & 2 && !(n.f & 512) && (At(n), Sr(n));
	}
}
function Cr(e) {
	if (e.v === P) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (V.has(t) || t.f & 2 && Cr(t)) return !0;
	return !1;
}
function wr(e) {
	var t = $n;
	try {
		return $n = !0, e();
	} finally {
		$n = t;
	}
}
function Tr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (me in e) Er(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && me in n && Er(n);
		}
	}
}
function Er(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Er(e[n], t);
		} catch {}
		let n = T(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = S(n);
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
var Dr = ["touchstart", "touchmove"];
function Or(e) {
	return Dr.includes(e);
}
// node_modules/svelte/src/internal/client/dom/elements/events.js
var kr = Symbol("events"), Ar = /* @__PURE__ */ new Set(), jr = /* @__PURE__ */ new Set();
function Mr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Rr.call(t, e), !e.cancelBubble) return gt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, ct(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Nr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Mr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && On(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function Pr(e, t, n) {
	(t[kr] ??= {})[e] = n;
}
function Fr(e) {
	for (var t = 0; t < e.length; t++) Ar.add(e[t]);
	for (var n of jr) n(e);
}
var Ir = null, Lr = !1;
function Rr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Ir = e, Lr || (Lr = !0, setTimeout(() => {
		Lr = !1, Ir = null;
	}));
	var o = 0, s = Ir === e && e[kr];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[kr] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		b(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = Qn, d = tr;
		er(null), nr(null);
		try {
			for (var f, p = []; a !== null && a !== t;) {
				try {
					var m = a[kr]?.[r];
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
			e[kr] = t, delete e.currentTarget, er(u), nr(d);
		}
	}
}
// node_modules/svelte/src/internal/client/dom/reconciler.js
var zr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Br(e) {
	return zr?.createHTML(e) ?? e;
}
function Vr(e) {
	var t = bn("template");
	return t.innerHTML = Br(e.replaceAll("<!>", "<!---->")), t.content;
}
// node_modules/svelte/src/internal/client/dom/template.js
function Hr(e, t) {
	var n = tr;
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
		if (F) return Hr(Pe, null), Pe;
		i === void 0 && (i = Vr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ gn(i)));
		var t = r || dn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ gn(t), s = t.lastChild;
			Hr(o, s);
		} else Hr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ur(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (F) return Hr(Pe, null), Pe;
		if (!o) {
			var e = /* @__PURE__ */ gn(Vr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ gn(e);) o.appendChild(/* @__PURE__ */ gn(e));
			else o = /* @__PURE__ */ gn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ gn(t), r = t.lastChild;
			Hr(n, r);
		} else Hr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Wr(e, t) {
	return /* @__PURE__ */ Ur(e, t, "svg");
}
function Gr(e = "") {
	if (!F) {
		var t = hn(e + "");
		return Hr(t, t), t;
	}
	var n = Pe;
	return n.nodeType === 3 ? xn(n) : (n.before(n = hn()), Fe(n)), Hr(n, n), n;
}
function Kr() {
	if (F) return Hr(Pe, null), Pe;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = hn();
	return e.append(t, n), Hr(t, n), e;
}
function Z(e, t) {
	if (F) {
		var n = tr;
		n.f & 32768 && n.nodes.end !== null || (n.nodes.end = Pe), Ie();
	} else e !== null && e.before(t);
}
function qr() {
	if (F && Pe && Pe.nodeType === 8 && Pe.textContent?.startsWith("$")) {
		let e = Pe.textContent.substring(1);
		return Ie(), e;
	}
	return (window.__svelte ??= {}).uid ??= 1, `c${window.__svelte.uid++}`;
}
// node_modules/svelte/src/reactivity/create-subscriber.js
function Jr(e) {
	let t = 0, n = Zt(0), r;
	return () => {
		Dn() && (Y(n), Pn(() => (t === 0 && (r = wr(() => e(() => an(n)))), t += 1, () => {
			ct(() => {
				--t, t === 0 && (r?.(), r = void 0, an(n));
			});
		})));
	};
}
// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Yr = se | ce;
function Xr(e, t, n, r) {
	new Zr(e, t, n, r);
}
var Zr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = F ? Pe : null;
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
	#h = Jr(() => (this.#m = Zt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = tr;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = tr.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Fn(() => {
			if (F) {
				let e = ze(this.#t);
				Ie();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Yr), F && (this.#e = Pe);
	}
	#g() {
		try {
			this.#a = Ln(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		ct(r), t && (this.#s = Ln(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? Me() : (t = !0, n && $e(), this.#s !== null && Wn(this.#s, () => {
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
					Cn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (oe | N)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Ln(() => e(this.#e)), ct(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = hn(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return Ln(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							Cn(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(B)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Wn(this.#o, () => {
					this.#o = null;
				}), this.#S(B));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Ln(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Jn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Ln(() => t(this.#e));
			} else this.#S(B);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		pt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = tr, n = Qn, r = et;
		nr(this.#i), er(this.#i), tt(this.#i.ctx);
		try {
			return Vt.ensure(), e();
		} finally {
			nr(t), er(n), tt(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Wn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, ct(() => {
			this.#d = !1, this.#m && tn(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), Y(this.#m);
	}
	error(e) {
		if (e === Te || !this.#n.onerror && !this.#n.failed) throw e;
		B?.is_fork ? (this.#a && B.skip_effect(this.#a), this.#o && B.skip_effect(this.#o), this.#s && B.skip_effect(this.#s), B.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (Vn(this.#a), null), this.#o &&= (Vn(this.#o), null), this.#s &&= (Vn(this.#s), null), F && (Fe(this.#t), Le(), Fe(Re()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return Ln(() => {
						var r = tr;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Cn(e, this.#i.parent), null;
				}
			}));
		};
		ct(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					Cn(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Cn(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
}, Qr = !0;
function Q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[xe] ??= e.nodeValue) && (e[xe] = n, e.nodeValue = `${n}`);
}
function $r(e, t) {
	return ti(e, t);
}
var ei = /* @__PURE__ */ new Map();
function ti(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	mn();
	var c = void 0, l = jn(() => {
		var l = n ?? t.appendChild(hn());
		Xr(l, { pending: () => {} }, (t) => {
			nt({});
			var n = et;
			if (a && (n.c = a), i && (r.$$events = i), F && Hr(t, null), Qr = o, c = e(t, r) || it(), Qr = !0, F && (tr.nodes.end = Pe, Pe === null || Pe.nodeType !== 8 || Pe.data !== "]")) throw Ae(), Te;
			rt();
		}, s);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = Or(r);
					for (let e of [t, document]) {
						var a = ei.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ei.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Rr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(y(Ar)), jr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = ei.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Rr), r.delete(e), r.size === 0 && ei.delete(n)) : r.set(e, i);
			}
			jr.delete(d), l !== n && l.parentNode?.removeChild(l);
		};
	});
	return ni.set(c, l), c;
}
var ni = /* @__PURE__ */ new WeakMap(), ri = class {
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
			if (n) Kn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Kn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Vn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Jn(r, t), t.append(hn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Vn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Wn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Vn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = B, r = yn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = hn();
				i.append(a), this.#n.set(e, {
					effect: Ln(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Ln(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else F && (this.anchor = Pe), this.#a(n);
	}
}, ii = 0, ai = 1, oi = 2;
function si(e, t, n, r, i) {
	F && Ie();
	var a = at(), o = P, s = a ? Zt(o) : /* @__PURE__ */ Qt(o, !1, !1), c = a ? Zt(o) : /* @__PURE__ */ Qt(o, !1, !1), l = new ri(e);
	Fn(() => {
		var a = B, o = t(), u = !1;
		let d = F && ee(o) === (e.data === "[!");
		if (d && (Fe(Re()), Ne(!1)), ee(o)) {
			var f = yt(), p = !1;
			let e = (e) => {
				if (!u) {
					p = !0, f(!1), B === a && a.deactivate(), Vt.ensure();
					try {
						e();
					} finally {
						bt(!1), Ft || Ht();
					}
				}
			};
			o.then((t) => {
				e(() => {
					tn(s, t), l.ensure(ai, r && ((e) => r(e, s)));
				});
			}, (t) => {
				e(() => {
					if (tn(c, t), l.ensure(oi, i && ((e) => i(e, c))), !i) throw c.v;
				});
			}), F ? l.ensure(ii, n) : ct(() => {
				p || e(() => {
					l.ensure(ii, n);
				});
			});
		} else tn(s, o), l.ensure(ai, r && ((e) => r(e, s)));
		return d && Ne(!0), () => {
			u = !0;
		};
	});
}
// node_modules/svelte/src/internal/client/dom/blocks/if.js
function $(e, t, n = !1) {
	var r;
	F && (r = Pe, Ie());
	var i = new ri(e), a = n ? se : 0;
	function o(e, t) {
		if (F) {
			var n = ze(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Re();
				Fe(a), i.anchor = a, Ne(!1), i.ensure(e, t), Ne(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Fn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
// node_modules/svelte/src/internal/client/dom/blocks/key.js
var ci = Symbol("NaN");
function li(e, t, n) {
	F && Ie();
	var r = new ri(e), i = !at();
	Fn(() => {
		var e = t();
		e !== e && (e = ci), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
// node_modules/svelte/src/internal/client/dom/blocks/each.js
function ui(e, t) {
	return t;
}
function di(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Wn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					fi(e, y(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, u = l.parentNode;
			vn(u), u.append(l), e.items.clear();
		}
		fi(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function fi(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ue, Jn(a, document.createDocumentFragment())) : Vn(t[i], n);
	}
}
var pi;
function mi(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var c = e;
		o = F ? Fe(/* @__PURE__ */ gn(c)) : c.appendChild(hn());
	}
	F && Ie();
	var l = null, u = /* @__PURE__ */ Tt(() => {
		var e = n();
		return g(e) ? e : e == null ? [] : y(e);
	}), d = /* @__PURE__ */ new Map(), f = !0;
	function p(e) {
		if (!(h.effect.f & 16384)) {
			h.pending.delete(e);
			var n = Y(u);
			h.fallback = l, gi(h, n, o, t, r), l !== null && (n.length === 0 ? l.f & 33554432 ? (l.f ^= ue, vi(l, null, o)) : Kn(l) : Wn(l, () => {
				l = null;
			}));
		}
	}
	function m(e) {
		h.pending.delete(e);
	}
	var h = {
		effect: Fn(() => {
			var e = Y(u), c = e.length;
			let h = !1;
			F && ze(o) === "[!" != (c === 0) && (o = Re(), Fe(o), Ne(!1), h = !0);
			for (var g = /* @__PURE__ */ new Set(), _ = B, v = yn(), y = 0; y < c; y += 1) {
				F && Pe.nodeType === 8 && Pe.data === "]" && (o = Pe, h = !0, Ne(!1));
				var b = e[y], x = r(b, y), S = f ? null : s.get(x);
				S ? (S.v && tn(S.v, b), S.i && tn(S.i, y), v && _.unskip_effect(S.e)) : (S = _i(s, f ? o : pi ??= hn(), b, x, y, i, t, n), f || (S.e.f |= ue), s.set(x, S)), g.add(x);
			}
			if (c === 0 && a && !l && (f ? l = Ln(() => a(o)) : (l = Ln(() => a(pi ??= hn())), l.f |= ue)), c > g.size && Ge("", "", ""), F && c > 0 && Fe(Re()), !f) {
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
	f = !1, F && (o = Pe);
}
function hi(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function gi(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = hi(e.effect.first), l, u = null, d, f = [], p = [], m, h, g, _;
	if (a) for (_ = 0; _ < o; _ += 1) m = t[_], h = i(m, _), g = s.get(h).e, g.f & 33554432 || (g.nodes?.a?.measure(), (d ??= /* @__PURE__ */ new Set()).add(g));
	for (_ = 0; _ < o; _ += 1) {
		if (m = t[_], h = i(m, _), g = s.get(h).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(g), t.done.delete(g);
		if (g.f & 8192 && (Kn(g), a && (g.nodes?.a?.unfix(), (d ??= /* @__PURE__ */ new Set()).delete(g))), g.f & 33554432) {
			if (g.f ^= ue, g === c) vi(g, null, n);
			else {
				var v = u ? u.next : c;
				g === e.effect.last && (e.effect.last = g.prev), g.prev && (g.prev.next = g.next), g.next && (g.next.prev = g.prev), yi(e, u, g), yi(e, g, v), vi(g, v, n), u = g, f = [], p = [], c = hi(u.next);
				continue;
			}
		}
		if (g !== c) {
			if (l !== void 0 && l.has(g)) {
				if (f.length < p.length) {
					var b = p[0], x;
					u = b.prev;
					var S = f[0], C = f[f.length - 1];
					for (x = 0; x < f.length; x += 1) vi(f[x], b, n);
					for (x = 0; x < p.length; x += 1) l.delete(p[x]);
					yi(e, S.prev, C.next), yi(e, u, S), yi(e, C, b), c = b, u = C, --_, f = [], p = [];
				} else l.delete(g), vi(g, c, n), yi(e, g.prev, g.next), yi(e, g, u === null ? e.effect.first : u.next), yi(e, u, g), u = g;
				continue;
			}
			for (f = [], p = []; c !== null && c !== g;) (l ??= /* @__PURE__ */ new Set()).add(c), p.push(c), c = hi(c.next);
			if (c === null) continue;
		}
		g.f & 33554432 || f.push(g), u = g, c = hi(g.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (fi(e, y(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var w = [];
		if (l !== void 0) for (g of l) g.f & 8192 || w.push(g);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && w.push(c), c = hi(c.next);
		var T = w.length;
		if (T > 0) {
			var E = r & 4 && o === 0 ? n : null;
			if (a) {
				for (_ = 0; _ < T; _ += 1) w[_].nodes?.a?.measure();
				for (_ = 0; _ < T; _ += 1) w[_].nodes?.a?.fix();
			}
			di(e, w, E);
		}
	}
	a && ct(() => {
		if (d !== void 0) for (g of d) g.nodes?.a?.apply();
	});
}
function _i(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Zt(n) : /* @__PURE__ */ Qt(n, !1, !1) : null, l = o & 2 ? Zt(i) : null;
	return {
		v: c,
		i: l,
		e: Ln(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function vi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ _n(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function yi(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function bi(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		F && (o = Fe(/* @__PURE__ */ gn(c)));
	}
	J(() => {
		var e = tr;
		if (s === (s = t() ?? "")) F && Ie();
		else if (n && !F) e.nodes = null, c.innerHTML = s, s !== "" && Hr(/* @__PURE__ */ gn(c), c.lastChild);
		else if (e.nodes !== null && (Hn(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (F) {
				for (var a = Pe.data, l = Ie(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ _n(l);
				if (l === null) throw Ae(), Te;
				Hr(Pe, u), o = Fe(l);
			} else {
				var d = bn(r ? "svg" : i ? "math" : "template", r ? De : i ? Oe : void 0);
				d.innerHTML = s;
				var f = r || i ? d : d.content;
				if (Hr(/* @__PURE__ */ gn(f), f.lastChild), r || i) for (; /* @__PURE__ */ gn(f);) o.before(/* @__PURE__ */ gn(f));
				else o.before(f);
			}
		}
	});
}
// node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function xi(e, t, ...n) {
	var r = new ri(e);
	Fn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, se);
}
// node_modules/svelte/src/internal/client/timing.js
var Si = () => performance.now(), Ci = {
	tick: (e) => requestAnimationFrame(e),
	now: () => Si(),
	tasks: /* @__PURE__ */ new Set()
};
// node_modules/svelte/src/internal/client/loop.js
function wi() {
	let e = Ci.now();
	Ci.tasks.forEach((t) => {
		t.c(e) || (Ci.tasks.delete(t), t.f());
	}), Ci.tasks.size !== 0 && Ci.tick(wi);
}
function Ti(e) {
	let t;
	return Ci.tasks.size === 0 && Ci.tick(wi), {
		promise: new Promise((n) => {
			Ci.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			Ci.tasks.delete(t);
		}
	};
}
// node_modules/svelte/src/internal/client/dom/elements/transitions.js
function Ei(e, t) {
	gt(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function Di(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function Oi(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = Di(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var ki = (e) => e;
function Ai(e, t, n, r) {
	var i = !!(e & 1), a = !!(e & 2), o = i && a, s = !!(e & 4), c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return gt(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			t.inert = u, i ? (a || f?.abort(), f = ji(t, m(), p, 1, () => {
				Ei(t, "introstart");
			}, () => {
				Ei(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			})) : (p?.abort(), p?.reset?.());
		},
		out(e) {
			a ? (t.inert = !0, p = ji(t, m(), f, 0, () => {
				Ei(t, "outrostart");
			}, () => {
				Ei(t, "outroend"), e?.();
			})) : (e?.(), l = void 0);
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = tr;
	if ((g.nodes.t ??= []).push(h), i && Qr) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || !!(v.f & 32768);
		}
		_ && Mn(() => {
			wr(() => h.in());
		});
	}
}
function ji(e, t, n, r, i, a) {
	var o = r === 1, s = !1;
	if (D(t)) {
		var c;
		return ct(() => {
			s || (c = ji(e, t({ direction: o ? "in" : "out" }), n, r, i, a));
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
		abort: O,
		deactivate: O,
		reset: O,
		t: () => r
	};
	let { delay: l = 0, css: u, tick: d, easing: f = ki } = t;
	var p, m = () => 1 - r;
	return ct(() => {
		if (!s) {
			var c = [];
			if (o && n === void 0 && (d && d(0, 1), u)) {
				var h = Oi(u(0, 1));
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
						var v = o + s * f(_ / g), y = Oi(u(v, 1 - v));
						l.push(y), h ||= y.overflow === "hidden";
					}
					h && (e.style.overflow = "hidden"), m = () => {
						var e = p.currentTime;
						return o + s * f(e / c);
					}, d && Ti(() => {
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
			s = !0, p && (p.cancel(), p.effect = null, p.onfinish = O);
		},
		deactivate: () => {
			a = O;
		},
		reset: () => {
			r === 0 && d?.(1, 0);
		},
		t: () => m()
	};
}
// node_modules/svelte/src/internal/client/dom/elements/actions.js
function Mi(e, t, n) {
	Mn(() => {
		var r = wr(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			Pn(() => {
				var e = n();
				Tr(e), i && Ve(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
// node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Ni(e, t) {
	var n = void 0, r;
	In(() => {
		n !== (n = t()) && (r &&= (Vn(r), null), n && (r = Ln(() => {
			Mn(() => n(e));
		})));
	});
}
// node_modules/svelte/src/internal/shared/attributes.js
var Pi = [..." 	\n\r\f\xA0\v﻿"];
function Fi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Pi.includes(r[o - 1])) && (s === r.length || Pi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Ii(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Li(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Ri(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Li)), i && c.push(...Object.keys(i).map(Li));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Li(e.substring(l, u).trim());
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
		return r && (n += Ii(r)), i && (n += Ii(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
// node_modules/svelte/src/internal/client/dom/elements/class.js
function zi(e, t, n, r, i, a) {
	var o = e[ye];
	if (F || o !== n || o === void 0) {
		var s = Fi(n, r, a);
		F && s === e.getAttribute("class") || (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ye] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
// node_modules/svelte/src/internal/client/dom/elements/style.js
function Bi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Vi(e, t, n, r) {
	var i = e[be];
	if (F || i !== t) {
		var a = Ri(t, r);
		F && a === e.getAttribute("style") || (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[be] = t;
	} else r && (Array.isArray(r) ? (Bi(e, n?.[0], r[0]), Bi(e, n?.[1], r[1], "important")) : Bi(e, n, r));
	return r;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function Hi(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Ui(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || g(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var s of e.options) {
			var c = qi(s);
			Hi(s, r ? i.includes(c) : ln(c, n));
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
function Wi(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!g(t)) return je();
		for (var r of e.options) r.selected = t.includes(qi(r));
	} else {
		for (r of e.options) if (ln(qi(r), t)) {
			r.selected = !0;
			return;
		}
		n && t === void 0 || (e.selectedIndex = -1);
	}
}
function Gi(e) {
	var t = new MutationObserver((t) => {
		t.every(Ji) || ("__defaultValue" in e && Ui(e, !1), "__value" in e && Wi(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), On(() => {
		t.disconnect();
	});
}
function Ki(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	_t(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), qi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && qi(o);
		}
		n(a), e.__value = a, B !== null && r.add(B);
	}), Mn(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = B;
			if (r.has(o)) return;
		}
		if (Wi(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = qi(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function qi(e) {
	return "__value" in e ? e.__value : e.value;
}
function Ji(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Yi = Symbol("is custom element"), Xi = Symbol("is html"), Zi = we ? "link" : "LINK", Qi = we ? "progress" : "PROGRESS";
function $i(e) {
	if (F) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					na(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					na(e, "checked", null), e.checked = r;
				}
			}
		};
		e[Se] = n, ct(n), ht();
	}
}
function ea(e, t) {
	var n = ra(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Qi) && (e.value = t ?? "");
}
function ta(e, t) {
	var n = ra(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function na(e, t, n, r) {
	var i = ra(e);
	F && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Zi) || i[t] !== (i[t] = n) && (t === "loading" && (e[_e] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && aa(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function ra(e) {
	return e[ve] ??= {
		[Yi]: e.nodeName.includes("-"),
		[Xi]: e.namespaceURI === Ee
	};
}
var ia = /* @__PURE__ */ new Map();
function aa(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ia.get(t);
	if (n) return n;
	ia.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = S(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = T(i);
	}
	return n;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function oa(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	_t(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = ua(e) ? da(a) : a, n(a), B !== null && r.add(B), await xr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (F && e.defaultValue !== e.value || wr(t) == null && e.value) && (n(ua(e) ? da(e.value) : e.value), B !== null && r.add(B)), Pn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = B;
			if (r.has(i)) return;
		}
		ua(e) && n === da(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
var sa = /* @__PURE__ */ new Set();
function ca(e, t, n, r, i = r) {
	var a = n.getAttribute("type") === "checkbox", o = e;
	let s = !1;
	if (t !== null) for (var c of t) o = o[c] ??= [];
	o.push(n), _t(n, "change", () => {
		var e = n.__value;
		a && (e = la(o, e, n.checked)), i(e);
	}, () => i(a ? [] : null)), Pn(() => {
		var e = r();
		F && n.defaultChecked !== n.checked ? s = !0 : a ? (e ||= [], n.checked = e.includes(n.__value)) : n.checked = ln(n.__value, e);
	}), On(() => {
		var e = o.indexOf(n);
		e !== -1 && o.splice(e, 1);
	}), sa.has(o) || (sa.add(o), ct(() => {
		o.sort((e, t) => e.compareDocumentPosition(t) === 4 ? -1 : 1), sa.delete(o);
	})), ct(() => {
		if (s) {
			var e = a ? la(o, e, n.checked) : o.find((e) => e.checked)?.__value;
			i(e);
		}
	});
}
function la(e, t, n) {
	for (var r = /* @__PURE__ */ new Set(), i = 0; i < e.length; i += 1) e[i].checked && r.add(e[i].__value);
	return n || r.delete(t), Array.from(r);
}
function ua(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function da(e) {
	return e === "" ? null : +e;
}
var fa = /* @__PURE__ */ new class e {
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
function pa(e, t, n) {
	var r = fa.observe(e, () => n(e[t]));
	Mn(() => (wr(() => n(e[t])), r));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ma(e, t) {
	return e === t || e?.[me] === t;
}
function ha(e = it(), t, n, r) {
	var i = et.r, a = tr;
	return Mn(() => {
		var o, s;
		return Pn(() => {
			o = s, s = r?.() || [], wr(() => {
				ma(n(...s), e) || (t(e, ...s), o && ma(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ma(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
// node_modules/svelte/src/internal/client/reactivity/store.js
var ga = !1;
function _a(e) {
	var t = ga;
	try {
		return ga = !1, [e(), ga];
	} finally {
		ga = t;
	}
}
// node_modules/svelte/src/internal/client/reactivity/props.js
var va = {
	get(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (D(r) && (r = r()), typeof r == "object" && r && t in r) return r[t];
		}
	},
	set(e, t, n) {
		let r = e.props.length;
		for (; r--;) {
			let i = e.props[r];
			D(i) && (i = i());
			let a = x(i, t);
			if (a && a.set) return a.set(n), !0;
		}
		return !1;
	},
	getOwnPropertyDescriptor(e, t) {
		let n = e.props.length;
		for (; n--;) {
			let r = e.props[n];
			if (D(r) && (r = r()), typeof r == "object" && r && t in r) {
				let e = x(r, t);
				return e && !e.configurable && (e.configurable = !0), e;
			}
		}
	},
	has(e, t) {
		if (t === me || t === ge) return !1;
		for (let n of e.props) if (D(n) && (n = n()), n != null && t in n) return !0;
		return !1;
	},
	ownKeys(e) {
		let t = [];
		for (let n of e.props) if (D(n) && (n = n()), n) {
			for (let e in n) t.includes(e) || t.push(e);
			for (let e of Object.getOwnPropertySymbols(n)) t.includes(e) || t.push(e);
		}
		return t;
	}
};
function ya(...e) {
	return new Proxy({ props: e }, va);
}
function ba(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ St(r), Y(l)) : (c && (c = !1, s = o ? wr(r) : r), s);
	let d;
	if (a) {
		var f = me in e || ge in e;
		d = x(e, t)?.set ?? (f && t in e ? (n) => e[t] = n : void 0);
	}
	var p, m = !1;
	a ? [p, m] = _a(() => e[t]) : p = e[t], p === void 0 && r !== void 0 && (p = u(), d && (i && Xe(t), d(p)));
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
	var _ = !1, v = (n & 1 ? St : Tt)(() => (_ = !1, h()));
	a && Y(v);
	var y = tr;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? Y(v) : i && a ? sn(e) : e;
			return U(v, n), _ = !0, s !== void 0 && (s = n), e;
		}
		return Xn && _ || y.f & 16384 ? v.v : Y(v);
	});
}
function xa(e) {
	et === null && Ue("onMount"), kn(() => {
		let t = wr(e);
		if (typeof t == "function") return t;
	});
}
// node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
// src/lib/routes.js
var Sa = /* @__PURE__ */ new Set([
	"activity",
	"stats",
	"settings"
]), Ca = {
	trips: "trip",
	charges: "charge"
}, wa = {
	page: "activity",
	detail: null,
	redirect: "#/activity"
};
function Ta(e) {
	let [, t, n, r, ...i] = e.replace(/^#/, "").split("/");
	if (Sa.has(t) && n === void 0) return {
		page: t,
		detail: null,
		redirect: null
	};
	if (Ca[t] && /^\d+$/.test(r) && !i.length) try {
		return {
			page: "activity",
			detail: {
				kind: Ca[t],
				vid: decodeURIComponent(n),
				start: Number(r)
			},
			redirect: null
		};
	} catch {}
	return wa;
}
var Ea = (e, t) => e == null ? "–" : t(e), Da = (e) => Ea(e, (e) => `${(e / 1e3).toFixed(1)} km`), Oa = (e) => Ea(e, (e) => `${(e / 1e3).toFixed(2)} kWh`), ka = (e) => Ea(e, (e) => `${(e / 1e3).toFixed(1)} kW`), Aa = (e) => Ea(e, (e) => `${e.toFixed(1)} %`), ja = (e) => Ea(e, (e) => {
	let t = Math.round(e / 60);
	return t >= 60 ? `${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")} min` : `${t} min`;
});
function Ma({ distance_m: e, net_wh: t, charged_wh: n }) {
	let r = [];
	return e && r.push(`${(e / 1e3).toFixed(e >= 1e4 ? 0 : 1)} km`), t && r.push(`${(t / 1e3).toFixed(1)} kWh used`), n && r.push(`+${(n / 1e3).toFixed(1)} kWh`), r.join(" · ");
}
var Na = (e) => e == null ? null : e / 1e3, Pa = (e) => Ea(Na(e), (e) => `${e.toFixed(1)} kWh/100 km`), Fa = (e, t, n = 0) => Ea(e, (e) => `${e < 0 ? "−" : "+"}${Math.abs(e).toFixed(n)} ${t}`), Ia = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
], La = [
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
], Ra = (e) => String(e).padStart(2, "0"), za = 864e5, Ba, Va, Ha, Ua = () => Ha;
function Wa(e) {
	let t = e || void 0;
	try {
		new Intl.DateTimeFormat([], { timeZone: t });
	} catch {
		t = void 0;
	}
	Ha = t, Ba = new Intl.DateTimeFormat("en-US", {
		timeZone: t,
		hourCycle: "h23",
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric"
	}), Va = new Intl.DateTimeFormat([], {
		timeZone: t,
		hour: "2-digit",
		minute: "2-digit"
	});
}
Wa();
var Ga = (e) => Object.fromEntries(Ba.formatToParts(e).map((e) => [e.type, Number(e.value)]));
function Ka(e) {
	if (!Ha) return new Date(e + za / 2).toISOString().slice(0, 10).split("-").map(Number);
	let { year: t, month: n, day: r } = Ga(e);
	return [
		t,
		n,
		r
	];
}
var qa = (e) => {
	let { year: t, month: n, day: r } = Ga(e);
	return `${t}-${Ra(n)}-${Ra(r)}`;
}, Ja = () => qa(Date.now()), Ya = (e) => e == null ? "–" : Va.format(e), Xa = (e) => Date.parse(`${e}T00:00:00Z`), Za = (e) => {
	let t = new Date(Xa(e));
	return `${Ia[t.getUTCDay()]} ${t.getUTCDate()} ${La[t.getUTCMonth()]}`;
};
function Qa(e, t) {
	let n = (Xa(t) - Xa(e)) / za;
	return n === 0 ? "Today" : n === 1 ? "Yesterday" : Za(e);
}
function $a(e, t = Date.now()) {
	if (e == null) return "–";
	let n = qa(e);
	return n === qa(t) ? Ya(e) : `${Za(n)} ${Ya(e)}`;
}
var eo = (e) => {
	let t = Ga(e);
	return Date.UTC(t.year, t.month - 1, t.day, t.hour % 24, t.minute, t.second) - e;
};
function to(e) {
	let t = Xa(e), n = t - eo(t), r = t - eo(n);
	return qa(r) !== e && qa(n) === e ? n : r;
}
var no = (e) => to(new Date(Xa(e) + za).toISOString().slice(0, 10)), ro = sn({
	wide: !1,
	split: !1,
	reducedMotion: !1
}), io = matchMedia("(min-width: 768px)"), ao = matchMedia("(min-width: 1080px)"), oo = matchMedia("(prefers-reduced-motion: reduce)"), so = () => {
	ro.wide = io.matches, ro.split = ao.matches, ro.reducedMotion = oo.matches;
};
io.addEventListener("change", so), ao.addEventListener("change", so), oo.addEventListener("change", so), so();
// node_modules/svelte/src/transition/index.js
var co = (e) => e;
function lo(e, { delay: t = 0, duration: n = 400, easing: r = co } = {}) {
	let i = +getComputedStyle(e).opacity;
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e) => `opacity: ${e * i}`
	};
}
// src/lib/motion.js
function uo(e, { onFrame: t, onSettle: n, snap: r = {
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
var fo = (e) => parseFloat(e) * (e.trim().endsWith("ms") ? 1 : 1e3), po = (e) => fo(getComputedStyle(document.documentElement).getPropertyValue(e)), mo = /* @__PURE__ */ X("<span class=\"pill svelte-mrgi7d\"> </span>"), ho = /* @__PURE__ */ X("<span aria-hidden=\"true\">✓</span>"), go = /* @__PURE__ */ X("<button role=\"menuitemradio\" tabindex=\"-1\" class=\"svelte-mrgi7d\"><span> </span> <!></button>"), _o = /* @__PURE__ */ X("<div class=\"menu chrome svelte-mrgi7d\" role=\"menu\" aria-label=\"Vehicle\" tabindex=\"-1\"></div>"), vo = /* @__PURE__ */ X("<button class=\"pill press svelte-mrgi7d\" aria-haspopup=\"menu\"><span class=\"label svelte-mrgi7d\"> </span> <svg class=\"icon svelte-mrgi7d\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 9l6 6 6-6\"></path></svg></button> <!>", 1), yo = /* @__PURE__ */ X("<div class=\"root svelte-mrgi7d\"><!></div>");
function bo(e, t) {
	nt(t, !0);
	let n = ba(t, "value", 15, ""), r = po("--fade"), i = /* @__PURE__ */ H(!1), a = /* @__PURE__ */ H(void 0), o = /* @__PURE__ */ H(void 0), s = /* @__PURE__ */ H(void 0), c = /* @__PURE__ */ z(() => t.options.find((e) => e.value === n())), l = () => [...Y(s).querySelectorAll("button")];
	async function u() {
		U(i, !0), await xr(), (Y(s).querySelector("[aria-checked=\"true\"]") ?? l()[0])?.focus();
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
	var m = yo();
	Nr("pointerdown", un, (e) => Y(i) && !Y(a).contains(e.target) && d(!1));
	var h = W(m), g = (e) => {
		var t = mo(), n = K(t, !0);
		J(() => Q(n, Y(c)?.label ?? "–")), Z(e, t);
	}, _ = (e) => {
		var a = vo(), l = G(a), m = K(W(l), !0);
		Le(2), I(l), ha(l, (e) => U(o, e), () => Y(o));
		var h = q(l, 2), g = (e) => {
			var i = _o();
			mi(i, 21, () => t.options, (e) => e.value, (e, t) => {
				var r = go(), i = W(r), a = K(i, !0), o = q(i, 2), s = (e) => {
					Z(e, ho());
				};
				$(o, (e) => {
					Y(t).value === n() && e(s);
				}), I(r), J(() => {
					na(r, "aria-checked", Y(t).value === n()), Q(a, Y(t).label);
				}), Pr("click", r, () => f(Y(t).value)), Z(e, r);
			}), I(i), ha(i, (e) => U(s, e), () => Y(s)), Pr("keydown", i, p), Ai(3, i, () => lo, () => ({ duration: r })), Z(e, i);
		};
		$(h, (e) => {
			Y(i) && e(g);
		}), J(() => {
			na(l, "aria-expanded", Y(i)), Q(m, Y(c)?.label ?? "–");
		}), Pr("click", l, () => Y(i) ? d() : u()), Pr("keydown", l, (e) => {
			Y(i) || e.key !== "ArrowDown" && e.key !== "ArrowUp" || (e.preventDefault(), u());
		}), Z(e, a);
	};
	$(h, (e) => {
		t.options.length < 2 ? e(g) : e(_, -1);
	}), I(m), ha(m, (e) => U(a, e), () => Y(a)), Z(e, m), rt();
}
Fr(["click", "keydown"]);
// src/lib/ui/Sidebar.svelte
var xo = /* @__PURE__ */ X("<a class=\"press svelte-1ccclju\"><svg class=\"icon svelte-1ccclju\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"></svg> <span> </span></a>"), So = /* @__PURE__ */ X("<aside class=\"chrome svelte-1ccclju\"><!> <nav aria-label=\"Main\" class=\"svelte-1ccclju\"></nav></aside>");
function Co(e, t) {
	nt(t, !0);
	let n = ba(t, "view", 15, ""), r = ba(t, "showPill", 3, !0);
	var i = So(), a = W(i), o = (e) => {
		bo(e, {
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
	mi(s, 21, () => t.tabs, (e) => e.page, (e, n) => {
		var r = xo(), i = W(r);
		bi(i, () => Y(n).icon, !0), I(i);
		var a = K(q(i, 2), !0);
		I(r), J(() => {
			na(r, "href", Y(n).href), na(r, "aria-current", t.page === Y(n).page ? "page" : void 0), Q(a, Y(n).label);
		}), Z(e, r);
	}), I(s), I(i), Z(e, i), rt();
}
// src/lib/ui/TabBar.svelte
var wo = /* @__PURE__ */ X("<a class=\"press svelte-31wq8u\"><svg class=\"icon svelte-31wq8u\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"></svg> <span> </span></a>"), To = /* @__PURE__ */ X("<nav class=\"chrome svelte-31wq8u\" aria-label=\"Main\"></nav>");
function Eo(e, t) {
	var n = To();
	mi(n, 21, () => t.tabs, (e) => e.page, (e, n) => {
		var r = wo(), i = W(r);
		bi(i, () => Y(n).icon, !0), I(i);
		var a = K(q(i, 2), !0);
		I(r), J(() => {
			na(r, "href", Y(n).href), na(r, "aria-current", t.page === Y(n).page ? "page" : void 0), Q(a, Y(n).label);
		}), Z(e, r);
	}), I(n), Z(e, n);
}
// src/lib/ui/Shell.svelte
var Do = /* @__PURE__ */ X("<header class=\"svelte-gp4acw\"><!></header>"), Oo = /* @__PURE__ */ X("<div><!> <main class=\"svelte-gp4acw\"><!></main> <!></div>");
function ko(e, t) {
	nt(t, !0);
	let n = ba(t, "options", 19, () => []), r = ba(t, "view", 15, ""), i = /* @__PURE__ */ z(() => [
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
	]), a = /* @__PURE__ */ z(() => t.page !== "settings");
	var o = Oo();
	let s;
	var c = W(o), l = (e) => {
		Co(e, {
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
		var t = Do();
		bo(W(t), {
			get options() {
				return n();
			},
			get value() {
				return r();
			},
			set value(e) {
				r(e);
			}
		}), I(t), Z(e, t);
	};
	$(c, (e) => {
		ro.wide ? e(l) : Y(a) && e(u, 1);
	});
	var d = q(c, 2);
	xi(W(d), () => t.children), I(d);
	var f = q(d, 2), p = (e) => {
		Eo(e, {
			get tabs() {
				return Y(i);
			},
			get page() {
				return t.page;
			}
		});
	};
	$(f, (e) => {
		ro.wide || e(p);
	}), I(o), J(() => s = zi(o, 1, "shell svelte-gp4acw", null, s, { wide: ro.wide })), Z(e, o), rt();
}
// src/lib/activity.js
var Ao = (e, t) => e === "all" || t.kind === (e === "trips" ? "trip" : "charge"), jo = (e) => `#/${e.kind}s/${encodeURIComponent(e.vehicle_id)}/${e.start}`, Mo = (e, t) => t === "all" ? e : e.map((e) => ({
	...e,
	items: e.items.filter((e) => Ao(t, e))
})).filter((e) => e.items.length);
function No(e, t, n, r, i) {
	let a = Mo(e, t).flatMap((e) => e.items), o = a.findIndex((e) => e.kind === n && e.vehicle_id === r && e.start === i);
	return o < 0 ? {
		prev: null,
		next: null
	} : {
		prev: o > 0 ? jo(a[o - 1]) : null,
		next: o < a.length - 1 ? jo(a[o + 1]) : null
	};
}
var Po = (e, t) => [...t, ...e.filter((e) => !t.some((t) => t.date === e.date))].sort((e, t) => e.date < t.date ? 1 : -1), Fo = ({ detailOpen: e }) => e ? "replace" : "push", Io = sn({
	view: "",
	filter: "all",
	today: "",
	days: [],
	next: null,
	loading: !1,
	error: ""
}), Lo = h(), Ro = Lo.next(), zo = (e, t) => `activity?view=${encodeURIComponent(e)}${t == null ? "" : `&before=${t}`}`;
async function Bo(e) {
	let t = Ro = Lo.next();
	Object.assign(Io, {
		view: e,
		days: [],
		next: null,
		today: "",
		loading: !0,
		error: ""
	});
	try {
		let n = await m(zo(e));
		if (!t.current) return;
		Object.assign(Io, {
			today: n.today,
			days: n.days,
			next: n.next
		});
	} catch (e) {
		t.current && (Io.error = e.message);
	}
	t.current && (Io.loading = !1);
}
async function Vo() {
	if (Io.loading || Io.next == null) return;
	let e = Ro;
	Object.assign(Io, {
		loading: !0,
		error: ""
	});
	try {
		let t = await m(zo(Io.view, Io.next));
		if (!e.current) return;
		let n = new Set(Io.days.map((e) => e.date));
		Io.days.push(...t.days.filter((e) => !n.has(e.date))), Io.next = t.next;
	} catch (t) {
		e.current && (Io.error = t.message);
	}
	e.current && (Io.loading = !1);
}
async function Ho() {
	if (Io.loading || !Io.view) return;
	let e = Ro;
	try {
		let t = await m(zo(Io.view));
		if (!e.current || Io.loading) return;
		let n = Po(Io.days, t.days);
		Object.assign(Io, {
			today: t.today,
			error: "",
			days: n
		}), n.length === t.days.length && (Io.next = t.next);
	} catch {}
}
// src/lib/detail.js
function Uo(e) {
	let t = e.indexOf(" ");
	return t < 0 ? [e, ""] : [e.slice(0, t), e.slice(t + 1)];
}
function Wo(e) {
	if (e == null) return ["–", ""];
	let t = Math.round(e / 60);
	return [t >= 60 ? `${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")}` : String(t), "min"];
}
var Go = (e, t) => e == null || t == null ? null : {
	mine: e,
	usual: t,
	delta: e - t
};
function Ko(e, t) {
	return t ? {
		duration: Go(e.duration_s == null ? null : e.duration_s / 60, t.avg_duration_s == null ? null : t.avg_duration_s / 60),
		consumption: Go(Na(e.wh_per_100km), t.avg_wh_per_100km == null ? null : t.avg_wh_per_100km / 1e3)
	} : null;
}
var qo = (e, t) => t > 0 ? Math.min(94, Math.max(6, 50 + (e / t - 1) * 100)) : null, Jo = (e, t, n = 0) => e.toFixed(n).replace(/^-/, "").replace(/[0.]/g, "") === "" ? "same" : Fa(e, t, n), Yo = (e) => e == null ? "–" : `${e < 0 ? "−" : ""}${Math.abs(e).toFixed(1)} kW`, Xo = (e, t, n) => e == null && t == null ? "–" : `${e ?? "–"} → ${t ?? "–"} ${n}`, Zo = (e, t) => `${Ya(e)} – ${t == null ? "now" : Ya(t)}`, Qo = (e, t, n = Date.now()) => `${Qa(qa(e), qa(n))} · ${Zo(e, t)}`, $o = (e, t) => e ?? t ?? "Unknown", es = (e) => e.place ?? e.address ? `Charged at ${e.place ?? e.address}` : "Charged", ts = (e, t) => (t && e != null ? "~" : "") + Oa(e), ns = (e) => `${$o(e.from, e.from_address)} → ${$o(e.to, e.to_address)}`, rs = (e) => `Route from ${$o(e.from, e.from_address)} to ${$o(e.to, e.to_address)}, ${Da(e.distance_m)}, ${e.end == null ? "still driving" : ja(e.duration_s)}`, is = (e) => e == null ? "–" : `${e.toFixed(0)} °C`, as = (e, [t, n]) => ({
	label: e,
	value: t,
	unit: n
}), os = [
	["accel", "Hard accelerations"],
	["brake", "Hard brakings"],
	["corner", "Sharp corners"]
], ss = (e) => e == null ? "Too short for a score" : e >= 80 ? "Smooth" : e >= 60 ? "Average" : "Lively", cs = (e, t) => t > 0 ? `${(e / t * 10).toFixed(1)} per 10 km` : "–";
function ls(e, t) {
	let n = Object.values(e).reduce((e, [t]) => e + t, 0);
	return Object.entries(e).map(([e, [r, i]]) => ({
		name: e,
		share: n ? r / n : 0,
		kwhPer100: r >= t * 1e3 && r > 0 && i != null ? i / r * 100 : null
	}));
}
var us = (e, t = Date.now()) => `No data since ${Qa(qa(e), qa(t))}`, ds = (e) => e == null ? "–" : `€${e.toFixed(2)}`, fs = (e) => e?.amount == null ? "–" : e.basis === "default" ? `≈ ${ds(e.amount)}` : ds(e.amount);
function ps(e) {
	if (e?.amount == null) return "Not available: no price for this date, or no energy reading";
	if (e.basis === "receipt") return "Receipt";
	let t = e.tariff, n = [
		e.basis === "spot" ? e.spot ?? "Spot" : `Default ${e.current.toUpperCase()} price`,
		`${ds(t.per_kwh)}/kWh`,
		`${Math.round((e.loss - 1) * 100)} % charging loss`
	];
	return t.start_fee && n.push(`start fee ${ds(t.start_fee)}`), t.per_min && n.push(`${ds(t.per_min)}/min`), e.card_markup_pct && n.push(`card +${e.card_markup_pct} %`), e.card_start_fee && n.push(`card fee ${ds(e.card_start_fee)}`), n.join(" · ");
}
var ms = ({ energy: e, fixed: t }) => e == null ? "" : `${ds(e)} energy · ${t == null ? "fixed not available yet" : `${ds(t)} fixed`}`, hs = (e, t) => e == null || !t ? "–" : `${ds(e / t * 1e5)}/100 km`, gs = (e, t) => {
	let n = to(t), r = no(t);
	return e.find((e) => e.valid_from >= n && e.valid_from < r)?.valid_from ?? n;
}, _s = (e) => e > 0 ? `${e} ${e === 1 ? "charge" : "charges"} without a price` : "", vs = (e, t) => e.find((e) => e.valid_from <= t) ?? null, ys = /* @__PURE__ */ X(" <small> </small>", 1), bs = /* @__PURE__ */ X("<a><span class=\"glyph svelte-14efj7c\" aria-hidden=\"true\"><!></span> <span class=\"title svelte-14efj7c\"> </span> <span class=\"big svelte-14efj7c\"> <!></span> <span class=\"caption when svelte-14efj7c\"> </span> <!> <!></a>");
function xs(e, t) {
	let n = ba(t, "current", 3, !1);
	var r = bs();
	let i;
	var a = W(r);
	xi(W(a), () => t.glyph), I(a);
	var o = q(a, 2), s = K(o, !0), c = q(o, 2), l = W(c, !0), u = q(l), d = (e) => {
		var n = ys(), r = G(n, !0);
		r.nodeValue = " ";
		var i = K(q(r), !0);
		J(() => Q(i, t.unit)), Z(e, n);
	};
	$(u, (e) => {
		t.unit && e(d);
	}), I(c);
	var f = q(c, 2), p = K(f, !0), m = q(f, 2);
	xi(m, () => t.aside ?? O), xi(q(m, 2), () => t.below ?? O), I(r), J(() => {
		na(r, "href", t.href), i = zi(r, 1, `card press ${t.kind ?? ""}`, "svelte-14efj7c", i, {
			current: n(),
			aside: t.aside
		}), na(r, "aria-current", n() ? "page" : void 0), Q(s, t.title), Q(l, t.value), Q(p, t.when);
	}), Pr("click", r, function(...e) {
		t.onclick?.apply(this, e);
	}), Z(e, r);
}
Fr(["click"]);
// src/lib/ui/ChargeBar.svelte
var Ss = /* @__PURE__ */ X("<i class=\"base svelte-1vubvs7\"></i>"), Cs = /* @__PURE__ */ X("<i class=\"room svelte-1vubvs7\"></i>"), ws = /* @__PURE__ */ X("<div class=\"bar svelte-1vubvs7\" role=\"img\"><!> <i class=\"added svelte-1vubvs7\"></i> <!></div>");
function Ts(e, t) {
	let n = ba(t, "full", 3, !1), r = (e) => Math.min(100, Math.max(0, e)), i = /* @__PURE__ */ z(() => t.from != null && t.to != null), a = /* @__PURE__ */ z(() => Y(i) ? r(Math.min(t.from, t.to)) : 0), o = /* @__PURE__ */ z(() => Y(i) ? r(Math.max(t.from, t.to)) : 0);
	var s = Kr(), c = G(s), l = (e) => {
		var i = ws(), s = W(i), c = (e) => {
			var t = Ss();
			let n;
			J(() => n = Vi(t, "", n, { width: `${Y(a) ?? ""}%` })), Z(e, t);
		};
		$(s, (e) => {
			n() && e(c);
		});
		var l = q(s, 2);
		let u;
		var d = q(l, 2), f = (e) => {
			var t = Cs();
			let n;
			J(() => n = Vi(t, "", n, { left: `${Y(o) ?? ""}%` })), Z(e, t);
		};
		$(d, (e) => {
			n() && e(f);
		}), I(i), J((e, t) => {
			na(i, "aria-label", `Charged from ${e ?? ""} % to ${t ?? ""} %`), u = Vi(l, "", u, {
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
var Es = /* @__PURE__ */ Wr("<svg viewBox=\"0 0 24 24\"><path d=\"M13 3 5 14h6l-1 7 8-11h-6z\"></path></svg>"), Ds = /* @__PURE__ */ X("<span class=\"caption row svelte-1njo9sk\"> </span>"), Os = /* @__PURE__ */ X("<span class=\"level row svelte-1njo9sk\"><!> <span class=\"caption svelte-1njo9sk\"> </span></span>"), ks = /* @__PURE__ */ X("<!> <!>", 1);
function As(e, t) {
	nt(t, !0);
	let n = ba(t, "current", 3, !1), r = /* @__PURE__ */ z(() => t.item.start_pct), i = /* @__PURE__ */ z(() => t.item.end_pct), a = /* @__PURE__ */ z(() => ts(t.item.added_wh, t.item.energy_source === "soc_estimate").split(" ")), o = /* @__PURE__ */ z(() => A(Y(a), 2)), s = /* @__PURE__ */ z(() => Y(o)[0]), c = /* @__PURE__ */ z(() => Y(o)[1]), l = /* @__PURE__ */ z(() => `${Zo(t.item.start, t.item.end)} · ${ka(t.item.avg_w)}`);
	{
		let a = (e) => {
			Z(e, Es());
		}, o = (e) => {
			var n = ks(), a = G(n), o = (e) => {
				var n = Ds(), r = K(n, !0);
				J((e) => Q(r, e), [() => fs(t.item.cost)]), Z(e, n);
			};
			$(a, (e) => {
				t.item.cost?.amount != null && e(o);
			});
			var s = q(a, 2), c = (e) => {
				var t = Os(), n = W(t);
				Ts(n, {
					get from() {
						return Y(r);
					},
					get to() {
						return Y(i);
					}
				});
				var a = K(q(n, 2));
				I(t), J((e, t) => Q(a, `${e ?? ""} → ${t ?? ""} %`), [() => Math.round(Y(r)), () => Math.round(Y(i))]), Z(e, t);
			};
			$(s, (e) => {
				Y(r) != null && Y(i) != null && e(c);
			}), Z(e, n);
		}, u = /* @__PURE__ */ z(() => jo(t.item)), d = /* @__PURE__ */ z(() => es(t.item));
		xs(e, {
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
	rt();
}
// src/lib/ui/LiveStrip.svelte
var js = /* @__PURE__ */ Wr("<svg class=\"icon svelte-lcylx6\" viewBox=\"0 0 24 24\" role=\"img\" aria-label=\"Plugged in\"><path d=\"M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4\"></path></svg>"), Ms = /* @__PURE__ */ X("<li class=\"svelte-lcylx6\"><i class=\"svelte-lcylx6\"></i> <span class=\"where svelte-lcylx6\"><b class=\"svelte-lcylx6\"> </b> </span> <span class=\"vals svelte-lcylx6\"> <!></span></li>"), Ns = /* @__PURE__ */ X("<ul class=\"card svelte-lcylx6\"></ul>");
function Ps(e, t) {
	nt(t, !0);
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
	var i = Kr(), a = G(i), o = (e) => {
		var i = Ns();
		mi(i, 21, () => t.vehicles, (e) => e.id, (e, t) => {
			var i = Ms(), a = W(i);
			let o;
			var s = q(a, 2), c = W(s), l = K(c, !0), u = q(c);
			I(s);
			var d = q(s, 2), f = W(d), p = q(f), m = (e) => {
				Z(e, js());
			};
			$(p, (e) => {
				Y(t).status === "charging" && e(m);
			}), I(d), I(i), J((e, n, i) => {
				o = Vi(a, "", o, { background: r[Y(t).status] ?? r.parked }), Q(l, Y(t).name), Q(u, ` · ${e ?? ""}`), Q(f, `${n ?? ""} · ${i ?? ""} `);
			}, [
				() => Y(t).status === "no_data" ? us(Y(t).updated) : `${n[Y(t).status] ?? Y(t).status} · ${Y(t).position?.place || "–"}`,
				() => Aa(Y(t).soc_percent),
				() => Da(Y(t).range_m)
			]), Z(e, i);
		}), I(i), Z(e, i);
	};
	$(a, (e) => {
		t.vehicles.length && e(o);
	}), Z(e, i), rt();
}
// src/lib/spring.js
function Fs({ value: e = 0, response: t = .35, damping: n = 1 } = {}) {
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
var Is = /* @__PURE__ */ X("<label><input type=\"radio\" class=\"svelte-5bfr2e\"/> <span> </span></label>"), Ls = /* @__PURE__ */ X("<div class=\"group svelte-5bfr2e\" role=\"radiogroup\"><div class=\"marker svelte-5bfr2e\"></div> <!></div>");
function Rs(e, t) {
	let n = qr();
	nt(t, !0);
	let r = [], i = ba(t, "value", 15, ""), a = Fs({
		response: .35,
		damping: 1
	}), o = uo(a, { onFrame: (e) => U(c, e, !0) }), s = /* @__PURE__ */ H(0), c = /* @__PURE__ */ H(0), l = !1, u = /* @__PURE__ */ z(() => Math.max(0, (Y(s) - 4) / t.options.length));
	kn(() => {
		let e = Math.max(0, t.options.findIndex((e) => e.value === i())) * Y(u);
		if (!l || ro.reducedMotion) l = Y(s) > 0, Object.assign(a, {
			value: e,
			target: e,
			velocity: 0
		}), U(c, e);
		else return o.to(e), o.stop;
	});
	var d = Ls(), f = W(d);
	let p;
	mi(q(f, 2), 17, () => t.options, (e) => e.value, (e, t) => {
		var a = Is();
		let o;
		var s = W(a);
		$i(s);
		var c, l = K(q(s, 2), !0);
		I(a), J(() => {
			o = zi(a, 1, "svelte-5bfr2e", null, o, { on: Y(t).value === i() }), na(s, "name", n), c !== (c = Y(t).value) && (s.value = (s.__value = c) ?? ""), Q(l, Y(t).label);
		}), ca(r, [], s, () => (Y(t).value, i()), i), Z(e, a);
	}), I(d), J(() => {
		na(d, "aria-label", t.label), p = Vi(f, "", p, {
			width: `${Y(u) ?? ""}px`,
			transform: `translateX(${Y(c) ?? ""}px)`
		});
	}), pa(d, "clientWidth", (e) => U(s, e)), Z(e, d), rt();
}
// src/lib/gesture.js
var zs = (e, t = .998) => e / 1e3 * t / (1 - t), Bs = (e, t, n) => e + zs(t) > n / 2;
function Vs(e) {
	let t = e[0], n = e[e.length - 1];
	return t && n && n.t > t.t ? (n.x - t.x) / (n.t - t.t) * 1e3 : 0;
}
// src/lib/ui/DetailPane.svelte
var Hs = (e) => (document.body.appendChild(e), { destroy: () => e.remove() }), Us = /* @__PURE__ */ X("<div class=\"item svelte-2a30b3\"><!></div>"), Ws = /* @__PURE__ */ X("<header class=\"bar chrome svelte-2a30b3\"><button class=\"back press svelte-2a30b3\"><svg class=\"icon svelte-2a30b3\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m15 5-7 7 7 7\"></path></svg> </button> <span class=\"steps svelte-2a30b3\"><button class=\"press svelte-2a30b3\" aria-label=\"Previous activity\"><svg class=\"icon svelte-2a30b3\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m5 15 7-7 7 7\"></path></svg></button> <button class=\"press svelte-2a30b3\" aria-label=\"Next activity\"><svg class=\"icon svelte-2a30b3\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m5 9 7 7 7-7\"></path></svg></button></span></header> <div class=\"content svelte-2a30b3\"><!></div>", 1), Gs = /* @__PURE__ */ X("<div role=\"dialog\" tabindex=\"-1\" aria-label=\"Details\"><!></div>"), Ks = /* @__PURE__ */ X("<aside aria-label=\"Details\"><!></aside>");
function qs(e, t) {
	nt(t, !0);
	let n = (e) => {
		var n = Ws(), o = G(n), s = W(o), c = q(W(s));
		I(s);
		var l = q(s, 2), u = W(l), d = q(u, 2);
		I(l), I(o);
		var f = q(o, 2);
		li(W(f), () => t.id, (e) => {
			var n = Us();
			xi(W(n), () => t.children), I(n), Ai(1, n, () => lo, () => ({ duration: a })), Ai(2, n, () => lo, () => ({ duration: a })), Z(e, n);
		}), I(f), J(() => {
			Q(c, ` ${ro.wide ? "Close" : "Activity"}`), u.disabled = !r(), d.disabled = !i();
		}), Pr("click", s, y), Pr("click", u, () => b(r())), Pr("click", d, () => b(i())), Z(e, n);
	}, r = ba(t, "prev", 3, null), i = ba(t, "next", 3, null), a = po("--fade"), o = /* @__PURE__ */ z(() => !ro.split), s = /* @__PURE__ */ z(() => !ro.wide && !ro.reducedMotion), c = Fs({
		response: .35,
		damping: 1
	}), l = !ro.wide && !ro.reducedMotion, u = /* @__PURE__ */ H(sn(l ? innerWidth : 0)), d = /* @__PURE__ */ H(!1), f = /* @__PURE__ */ H(!1), p = /* @__PURE__ */ H(!1), m = /* @__PURE__ */ H(void 0), h = 0, g = null, _ = uo(c, {
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
	xa(() => (c.value = Y(u), l && v(0), () => {
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
	function w(e) {
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
	function T(e) {
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
	function E(e) {
		if (!g || e.pointerId !== g.id) return;
		if (!g.live) return void (g = null);
		g.samples.push({
			t: e.timeStamp,
			x: e.clientX
		}), S(e);
		let t = Vs(g.samples);
		g = null, U(f, !1);
		let n = Y(m).offsetWidth;
		v(Bs(Y(u), t, n) ? n : 0, t);
	}
	kn(() => {
		if (!Y(o)) return;
		let e = document.querySelector(ro.wide ? "main" : "#app");
		return e.inert = !0, () => e.inert = !1;
	}), kn(() => {
		t.id, Y(m)?.scrollTo(0, 0);
	});
	var D = Kr();
	Nr("keydown", un, x);
	var O = G(D), ee = (e) => {
		var t = Gs();
		let r, i;
		var a = W(t);
		n(a), I(t), ha(t, (e) => U(m, e), () => Y(m)), Mi(t, (e) => Hs?.(e)), J(() => {
			r = zi(t, 1, "layer svelte-2a30b3", null, r, {
				phone: !ro.wide,
				busy: Y(d),
				held: Y(f),
				leaving: Y(p),
				"fade-in": !l
			}), na(t, "aria-modal", !ro.wide), i = Vi(t, "", i, { transform: Y(u) ? `translateX(${Y(u)}px)` : null });
		}), Pr("pointerdown", t, w), Pr("pointermove", t, T), Pr("pointerup", t, E), Nr("pointercancel", t, E), Z(e, t);
	}, te = (e) => {
		var t = Ks();
		let r;
		var i = W(t);
		n(i), I(t), ha(t, (e) => U(m, e), () => Y(m)), J(() => r = zi(t, 1, "column svelte-2a30b3", null, r, {
			leaving: Y(p),
			"fade-in": !l
		})), Z(e, t);
	};
	$(O, (e) => {
		Y(o) ? e(ee) : e(te, -1);
	}), Z(e, D), rt();
}
Fr([
	"click",
	"pointerdown",
	"pointermove",
	"pointerup"
]);
var Js = 256;
function Ys(e, t, n) {
	let r = Js * 2 ** n, i = e * Math.PI / 180;
	return [(t + 180) / 360 * r, (1 - Math.log(Math.tan(i) + 1 / Math.cos(i)) / Math.PI) / 2 * r];
}
function Xs(e, t, n, r = 8) {
	let i = t - 2 * r, a = n - 2 * r, o = 17, s;
	for (;; o--) {
		s = e.map(([e, t]) => Ys(e, t, o));
		let r = s.map((e) => e[0]), c = s.map((e) => e[1]);
		if (o === 0 || Math.max(...r) - Math.min(...r) <= i && Math.max(...c) - Math.min(...c) <= a) {
			let e = Math.round((Math.max(...r) + Math.min(...r)) / 2 - t / 2), i = Math.round((Math.max(...c) + Math.min(...c)) / 2 - n / 2), a = [];
			for (let r = Math.floor(e / Js); r <= Math.floor((e + t - 1) / Js); r++) for (let t = Math.floor(i / Js); t <= Math.floor((i + n - 1) / Js); t++) t >= 0 && t < 2 ** o && a.push({
				z: o,
				x: r,
				y: t,
				left: r * Js - e,
				top: t * Js - i
			});
			return {
				z: o,
				tiles: a,
				points: s.map(([t, n]) => [t - e, n - i])
			};
		}
	}
}
var Zs = "/api/map_tiles/raster/{z}/{x}/{y}.png", Qs = ({ z: e, x: t, y: n }) => Zs.replace("{z}", e).replace("{x}", t).replace("{y}", n), $s = /* @__PURE__ */ new Map();
function ec(e) {
	let t = $s.get(e);
	return t || (t = f(e).then(async (e) => {
		if (!e.ok) throw Error(String(e.status));
		return URL.createObjectURL(await e.blob());
	}), t.catch(() => $s.get(e) === t && $s.delete(e)), $s.set(e, t)), t;
}
// src/lib/ui/RouteOutline.svelte
var tc = /* @__PURE__ */ X("<img alt=\"\" width=\"256\" height=\"256\" class=\"svelte-wy78el\"/>"), nc = /* @__PURE__ */ X("<span class=\"box svelte-wy78el\"><span class=\"tiles svelte-wy78el\" aria-hidden=\"true\"><!></span> <svg role=\"img\" class=\"svelte-wy78el\"><polyline class=\"svelte-wy78el\"></polyline><circle class=\"open svelte-wy78el\" r=\"3.5\"></circle><circle class=\"end svelte-wy78el\" r=\"3.5\"></circle></svg></span>");
function rc(e, t) {
	nt(t, !0);
	let n = ba(t, "label", 3, "Route"), r = /* @__PURE__ */ z(() => t.points?.length >= 2 ? Xs(t.points, t.width, t.height, 8) : null), i = /* @__PURE__ */ z(() => Y(r)?.points ?? []), a = /* @__PURE__ */ z(() => Y(i)[0]), o = /* @__PURE__ */ z(() => Y(i)[Y(i).length - 1]), s = /* @__PURE__ */ H(void 0), c = /* @__PURE__ */ H(typeof IntersectionObserver > "u");
	kn(() => {
		if (Y(c) || !Y(s)) return;
		let e = new IntersectionObserver((e) => e.some((e) => e.isIntersecting) && U(c, !0), { rootMargin: "200px" });
		return e.observe(Y(s)), () => e.disconnect();
	});
	var l = Kr(), u = G(l), d = (e) => {
		var l = nc();
		let u;
		var d = W(l), f = W(d), p = (e) => {
			var t = Kr();
			mi(G(t), 17, () => Y(r).tiles, (e) => `${e.x}/${e.y}`, (e, t) => {
				var n = Kr();
				si(G(n), () => ec(Qs(Y(t))), null, (e, n) => {
					var r = tc();
					let i;
					J(() => {
						na(r, "src", Y(n)), i = Vi(r, "", i, {
							left: `${Y(t).left ?? ""}px`,
							top: `${Y(t).top ?? ""}px`
						});
					}), Z(e, r);
				}), Z(e, n);
			}), Z(e, t);
		};
		$(f, (e) => {
			Y(c) && e(p);
		}), I(d);
		var m = q(d, 2), h = W(m), g = q(h), _ = q(g);
		I(m), I(l), ha(l, (e) => U(s, e), () => Y(s)), J((e) => {
			u = Vi(l, "", u, {
				width: `${t.width ?? ""}px`,
				height: `${t.height ?? ""}px`
			}), na(m, "width", t.width), na(m, "height", t.height), na(m, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), na(m, "aria-label", n()), na(h, "points", e), na(g, "cx", Y(a)[0]), na(g, "cy", Y(a)[1]), na(_, "cx", Y(o)[0]), na(_, "cy", Y(o)[1]);
		}, [() => Y(i).map((e) => `${e[0].toFixed(1)},${e[1].toFixed(1)}`).join(" ")]), Z(e, l);
	};
	$(u, (e) => {
		Y(r) && e(d);
	}), Z(e, l), rt();
}
// src/lib/ui/TripCard.svelte
var ic = /* @__PURE__ */ Wr("<svg class=\"icon\" viewBox=\"0 0 24 24\"><path d=\"M5 16v-5l2-5h10l2 5v5M5 16h14M5 16v3h3v-3M16 16v3h3v-3M7 11h10\"></path></svg>"), ac = /* @__PURE__ */ X("<span class=\"route svelte-8nqrvt\"><!></span> <span class=\"caption stats svelte-8nqrvt\"> <br/> </span>", 1);
function oc(e, t) {
	nt(t, !0);
	let n = ba(t, "current", 3, !1), r = /* @__PURE__ */ z(() => Da(t.item.distance_m).split(" ")), i = /* @__PURE__ */ z(() => A(Y(r), 2)), a = /* @__PURE__ */ z(() => Y(i)[0]), o = /* @__PURE__ */ z(() => Y(i)[1]), s = /* @__PURE__ */ z(() => `${Ya(t.item.start)} · ${t.item.end == null ? "now" : ja(t.item.duration_s)}`);
	{
		let r = (e) => {
			Z(e, ic());
		}, i = (e) => {
			var n = ac(), r = G(n), i = W(r);
			{
				let e = /* @__PURE__ */ z(() => rs(t.item));
				rc(i, {
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
			I(r);
			var a = q(r, 2), o = W(a, !0), s = q(o, 2, !0);
			I(a), J((e, t) => {
				Q(o, e), Q(s, t);
			}, [() => Pa(t.item.wh_per_100km), () => Oa(t.item.net_wh)]), Z(e, n);
		}, c = /* @__PURE__ */ z(() => jo(t.item)), l = /* @__PURE__ */ z(() => ns(t.item));
		xs(e, {
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
	rt();
}
// src/lib/series.js
var sc = (e) => e.every((e) => e == null);
function cc(e) {
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
		return t.every((e) => sc(e.values)) ? null : {
			x: r("km"),
			series: t
		};
	})([["Speed km/h", "speed_kmh"]]) };
}
function lc(e) {
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
function uc(e) {
	let t = e?.car_kwh ?? [], n = e?.cloud_soc ?? [], r = e?.cloud_plugged ?? [];
	return {
		car: t.length ? lc([{
			label: "Battery kWh",
			scale: "y",
			points: t
		}]) : null,
		cloud: n.length || r.length ? lc([{
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
function dc(e, t = .5) {
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
var fc = 12e4;
function pc(e, t) {
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
	for (let t of e?.car_kwh ?? []) (!i.length || t[0] - i.at(-1)[0] >= fc) && i.push(t);
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
var mc = !0, hc = "uplot", gc = "u-hz", _c = "u-vt", vc = "u-title", yc = "u-wrap", bc = "u-under", xc = "u-over", Sc = "u-axis", Cc = "u-off", wc = "u-select", Tc = "u-cursor-x", Ec = "u-cursor-y", Dc = "u-cursor-pt", Oc = "u-legend", kc = "u-live", Ac = "u-inline", jc = "u-series", Mc = "u-marker", Nc = "u-label", Pc = "u-value", Fc = "width", Ic = "height", Lc = "top", Rc = "bottom", zc = "left", Bc = "right", Vc = "#000", Hc = "#0000", Uc = "mousemove", Wc = "mousedown", Gc = "mouseup", Kc = "mouseenter", qc = "mouseleave", Jc = "dblclick", Yc = "resize", Xc = "scroll", Zc = "change", Qc = "dppxchange", $c = "--", el = typeof window < "u", tl = el ? document : null, nl = el ? window : null, rl = el ? navigator : null, il, al;
function ol() {
	let e = devicePixelRatio;
	il != e && (il = e, al && xl(Zc, al, ol), al = matchMedia(`(min-resolution: ${il - .001}dppx) and (max-resolution: ${il + .001}dppx)`), bl(Zc, al, ol), nl.dispatchEvent(new CustomEvent(Qc)));
}
function sl(e, t) {
	if (t != null) {
		let n = e.classList;
		!n.contains(t) && n.add(t);
	}
}
function cl(e, t) {
	let n = e.classList;
	n.contains(t) && n.remove(t);
}
function ll(e, t, n) {
	e.style[t] = n + "px";
}
function ul(e, t, n, r) {
	let i = tl.createElement(e);
	return t != null && sl(i, t), n?.insertBefore(i, r), i;
}
function dl(e, t) {
	return ul("div", e, t);
}
var fl = /* @__PURE__ */ new WeakMap();
function pl(e, t, n, r, i) {
	let a = "translate(" + t + "px," + n + "px)";
	a != fl.get(e) && (e.style.transform = a, fl.set(e, a), t < 0 || n < 0 || t > r || n > i ? sl(e, Cc) : cl(e, Cc));
}
var ml = /* @__PURE__ */ new WeakMap();
function hl(e, t, n) {
	let r = t + n;
	r != ml.get(e) && (ml.set(e, r), e.style.background = t, e.style.borderColor = n);
}
var gl = /* @__PURE__ */ new WeakMap();
function _l(e, t, n, r) {
	let i = t + "" + n;
	i != gl.get(e) && (gl.set(e, i), e.style.height = n + "px", e.style.width = t + "px", e.style.marginLeft = r ? -t / 2 + "px" : 0, e.style.marginTop = r ? -n / 2 + "px" : 0);
}
var vl = { passive: !0 }, yl = {
	...vl,
	capture: !0
};
function bl(e, t, n, r) {
	t.addEventListener(e, n, r ? yl : vl);
}
function xl(e, t, n, r) {
	t.removeEventListener(e, n, vl);
}
el && ol();
function Sl(e, t, n, r) {
	let i;
	n ||= 0, r ||= t.length - 1;
	let a = r <= 2147483647;
	for (; r - n > 1;) i = a ? n + r >> 1 : Wl((n + r) / 2), t[i] < e ? n = i : r = i;
	return e - t[n] <= t[r] - e ? n : r;
}
function Cl(e) {
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
var wl = (e) => e != null, Tl = (e) => e != null && e > 0, El = Cl(wl), Dl = Cl(Tl);
function Ol(e, t, n, r = 0, i = !1) {
	let a = i ? Dl : El, o = i ? Tl : wl;
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
	return [s ?? tu, c ?? -tu];
}
function kl(e, t, n, r) {
	let i = Xl(e), a = Xl(t);
	e == t && (i == -1 ? (e *= n, t /= n) : (e /= n, t *= n));
	let o = n == 10 ? Zl : Ql, s = i == 1 ? Wl : Kl, c = a == 1 ? Kl : Wl, l = s(o(Ul(e))), u = c(o(Ul(t))), d = Yl(n, l), f = Yl(n, u);
	return n == 10 && (l < 0 && (d = _u(d, -l)), u < 0 && (f = _u(f, -u))), r || n == 2 ? (e = d * i, t = f * a) : (e = gu(e, d), t = hu(t, f)), [e, t];
}
function Al(e, t, n, r) {
	let i = kl(e, t, n, r);
	return e == 0 && (i[0] = 0), t == 0 && (i[1] = 0), i;
}
var jl = .1, Ml = {
	mode: 3,
	pad: jl
}, Nl = {
	pad: 0,
	soft: null,
	mode: 0
}, Pl = {
	min: Nl,
	max: Nl
};
function Fl(e, t, n, r) {
	return Ou(n) ? Rl(e, t, n) : (Nl.pad = n, Nl.soft = r ? 0 : null, Nl.mode = r ? 3 : 0, Rl(e, t, Pl));
}
function Il(e, t) {
	return e ?? t;
}
function Ll(e, t, n) {
	for (t = Il(t, 0), n = Il(n, e.length - 1); t <= n;) {
		if (e[t] != null) return !0;
		t++;
	}
	return !1;
}
function Rl(e, t, n) {
	let r = n.min, i = n.max, a = Il(r.pad, 0), o = Il(i.pad, 0), s = Il(r.hard, -tu), c = Il(i.hard, tu), l = Il(r.soft, tu), u = Il(i.soft, -tu), d = Il(r.mode, 0), f = Il(i.mode, 0), p = t - e, m = Zl(p), h = Jl(Ul(e), Ul(t)), g = Ul(Zl(h) - m);
	(p < 1e-24 || g > 10) && (p = 0, (e == 0 || t == 0) && (p = 1e-24, d == 2 && l != tu && (a = 0), f == 2 && u != -tu && (o = 0)));
	let _ = p || h || 1e3, v = Yl(10, Wl(Zl(_))), y = _u(gu(e - _ * (p == 0 ? e == 0 ? .1 : 1 : a), v / 10), 24), b = e >= l && (d == 1 || d == 3 && y <= l || d == 2 && y >= l) ? l : tu, x = Jl(s, y < b && e >= b ? b : ql(b, y)), S = _u(hu(t + _ * (p == 0 ? t == 0 ? .1 : 1 : o), v / 10), 24), C = t <= u && (f == 1 || f == 3 && S >= u || f == 2 && S <= u) ? u : -tu, w = ql(c, S > C && t <= C ? C : Jl(C, S));
	return x == w && x == 0 && (w = 100), [x, w];
}
var zl = new Intl.NumberFormat(el ? rl.language : "en-US"), Bl = (e) => zl.format(e), Vl = Math, Hl = Vl.PI, Ul = Vl.abs, Wl = Vl.floor, Gl = Vl.round, Kl = Vl.ceil, ql = Vl.min, Jl = Vl.max, Yl = Vl.pow, Xl = Vl.sign, Zl = Vl.log10, Ql = Vl.log2, $l = (e, t = 1) => Vl.sinh(e) * t, eu = (e, t = 1) => Vl.asinh(e / t), tu = Infinity;
function nu(e) {
	return (Zl((e ^ e >> 31) - (e >> 31)) | 0) + 1;
}
function ru(e, t, n) {
	return ql(Jl(e, t), n);
}
function iu(e) {
	return typeof e == "function";
}
function au(e) {
	return iu(e) ? e : () => e;
}
var ou = () => {}, su = (e) => e, cu = (e, t) => t, lu = (e) => null, uu = (e) => !0, du = (e, t) => e == t, fu = /\.\d*?(?=9{6,}|0{6,})/gm, pu = (e) => {
	if (Tu(e) || vu.has(e)) return e;
	let t = `${e}`, n = t.match(fu);
	if (n == null) return e;
	let r = n[0].length - 1;
	if (t.indexOf("e-") != -1) {
		let [e, n] = t.split("e");
		return +`${pu(e)}e${n}`;
	}
	return _u(e, r);
};
function mu(e, t) {
	return pu(_u(pu(e / t)) * t);
}
function hu(e, t) {
	return pu(Kl(pu(e / t)) * t);
}
function gu(e, t) {
	return pu(Wl(pu(e / t)) * t);
}
function _u(e, t = 0) {
	if (Tu(e)) return e;
	let n = 10 ** t;
	return Gl(e * n * (1 + 2 ** -52)) / n;
}
var vu = /* @__PURE__ */ new Map();
function yu(e) {
	return (("" + e).split(".")[1] || "").length;
}
function bu(e, t, n, r) {
	let i = [], a = r.map(yu);
	for (let o = t; o < n; o++) {
		let t = Ul(o), n = _u(Yl(e, o), t);
		for (let s = 0; s < r.length; s++) {
			let c = e == 10 ? +`${r[s]}e${o}` : r[s] * n, l = (o >= 0 ? 0 : t) + (o >= a[s] ? 0 : a[s]), u = e == 10 ? c : _u(c, l);
			i.push(u), vu.set(u, l);
		}
	}
	return i;
}
var xu = {}, Su = [], Cu = [null, null], wu = Array.isArray, Tu = Number.isInteger, Eu = (e) => e === void 0;
function Du(e) {
	return typeof e == "string";
}
function Ou(e) {
	let t = !1;
	if (e != null) {
		let n = e.constructor;
		t = n == null || n == Object;
	}
	return t;
}
function ku(e) {
	return typeof e == "object" && !!e;
}
var Au = Object.getPrototypeOf(Uint8Array), ju = "__proto__";
function Mu(e, t = Ou) {
	let n;
	if (wu(e)) {
		let r = e.find((e) => e != null);
		if (wu(r) || t(r)) {
			n = Array(e.length);
			for (let r = 0; r < e.length; r++) n[r] = Mu(e[r], t);
		} else n = e.slice();
	} else if (e instanceof Au) n = e.slice();
	else if (t(e)) {
		n = {};
		for (let r in e) r != ju && (n[r] = Mu(e[r], t));
	} else n = e;
	return n;
}
function Nu(e) {
	let t = arguments;
	for (let n = 1; n < t.length; n++) {
		let r = t[n];
		for (let t in r) t != ju && (Ou(e[t]) ? Nu(e[t], Mu(r[t])) : e[t] = Mu(r[t]));
	}
	return e;
}
var Pu = 0, Fu = 1, Iu = 2;
function Lu(e, t, n) {
	for (let r = 0, i, a = -1; r < t.length; r++) {
		let o = t[r];
		if (o > a) {
			for (i = o - 1; i >= 0 && e[i] == null;) e[i--] = null;
			for (i = o + 1; i < n && e[i] == null;) e[a = i++] = null;
		}
	}
}
function Ru(e, t) {
	if (Vu(e)) {
		let t = e[0].slice();
		for (let n = 1; n < e.length; n++) t.push(...e[n].slice(1));
		return Hu(t[0]) || (t = Bu(t)), t;
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
			let c = o[e], l = Array(i).fill(void 0), u = t ? t[n][e] : Fu, d = [];
			for (let e = 0; e < c.length; e++) {
				let t = c[e], n = a.get(s[e]);
				t === null ? u != Pu && (l[n] = t, u == Iu && d.push(n)) : l[n] = t;
			}
			Lu(l, d, i), r.push(l);
		}
	}
	return r;
}
var zu = typeof queueMicrotask > "u" ? (e) => Promise.resolve().then(e) : queueMicrotask;
function Bu(e) {
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
function Vu(e) {
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
function Hu(e, t = 100) {
	let n = e.length;
	if (n <= 1) return !0;
	let r = 0, i = n - 1;
	for (; r <= i && e[r] == null;) r++;
	for (; i >= r && e[i] == null;) i--;
	if (i <= r) return !0;
	let a = Jl(1, Wl((i - r + 1) / t));
	for (let t = e[r], n = r + a; n <= i; n += a) {
		let r = e[n];
		if (r != null) {
			if (r <= t) return !1;
			t = r;
		}
	}
	return !0;
}
var Uu = [
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
], Wu = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
function Gu(e) {
	return e.slice(0, 3);
}
var Ku = Wu.map(Gu), qu = {
	MMMM: Uu,
	MMM: Uu.map(Gu),
	WWWW: Wu,
	WWW: Ku
};
function Ju(e) {
	return (e < 10 ? "0" : "") + e;
}
function Yu(e) {
	return (e < 10 ? "00" : e < 100 ? "0" : "") + e;
}
var Xu = {
	YYYY: (e) => e.getFullYear(),
	YY: (e) => (e.getFullYear() + "").slice(2),
	MMMM: (e, t) => t.MMMM[e.getMonth()],
	MMM: (e, t) => t.MMM[e.getMonth()],
	MM: (e) => Ju(e.getMonth() + 1),
	M: (e) => e.getMonth() + 1,
	DD: (e) => Ju(e.getDate()),
	D: (e) => e.getDate(),
	WWWW: (e, t) => t.WWWW[e.getDay()],
	WWW: (e, t) => t.WWW[e.getDay()],
	HH: (e) => Ju(e.getHours()),
	H: (e) => e.getHours(),
	h: (e) => {
		let t = e.getHours();
		return t == 0 ? 12 : t > 12 ? t - 12 : t;
	},
	AA: (e) => e.getHours() >= 12 ? "PM" : "AM",
	aa: (e) => e.getHours() >= 12 ? "pm" : "am",
	a: (e) => e.getHours() >= 12 ? "p" : "a",
	mm: (e) => Ju(e.getMinutes()),
	m: (e) => e.getMinutes(),
	ss: (e) => Ju(e.getSeconds()),
	s: (e) => e.getSeconds(),
	fff: (e) => Yu(e.getMilliseconds())
};
function Zu(e, t) {
	t ||= qu;
	let n = [], r = /\{([a-z]+)\}|[^{]+/gi, i;
	for (; i = r.exec(e);) n.push(i[0][0] == "{" ? Xu[i[1]] : i[0]);
	return (e) => {
		let r = "";
		for (let i = 0; i < n.length; i++) r += typeof n[i] == "string" ? n[i] : n[i](e, t);
		return r;
	};
}
var Qu = new Intl.DateTimeFormat().resolvedOptions().timeZone;
function $u(e, t) {
	let n;
	return t == "UTC" || t == "Etc/UTC" ? n = /* @__PURE__ */ new Date(+e + e.getTimezoneOffset() * 6e4) : t == Qu ? n = e : (n = new Date(e.toLocaleString("en-US", { timeZone: t })), n.setMilliseconds(e.getMilliseconds())), n;
}
var ed = (e) => e % 1 == 0, td = [
	1,
	2,
	2.5,
	5
], nd = bu(10, -32, 0, td), rd = bu(10, 0, 32, td), id = rd.filter(ed), ad = nd.concat(rd), od = "\n", sd = "{YYYY}", cd = od + sd, ld = "{M}/{D}", ud = od + ld, dd = ud + "/{YY}", fd = "{aa}", pd = "{h}:{mm}" + fd, md = od + pd, hd = ":{ss}", gd = null;
function _d(e) {
	let t = e * 1e3, n = t * 60, r = n * 60, i = r * 24, a = i * 30, o = i * 365, s = (e == 1 ? bu(10, 0, 3, td).filter(ed) : bu(10, -3, 0, td)).concat([
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
			sd,
			gd,
			gd,
			gd,
			gd,
			gd,
			gd,
			1
		],
		[
			i * 28,
			"{MMM}",
			cd,
			gd,
			gd,
			gd,
			gd,
			gd,
			1
		],
		[
			i,
			ld,
			cd,
			gd,
			gd,
			gd,
			gd,
			gd,
			1
		],
		[
			r,
			"{h}" + fd,
			dd,
			gd,
			ud,
			gd,
			gd,
			gd,
			1
		],
		[
			n,
			pd,
			dd,
			gd,
			ud,
			gd,
			gd,
			gd,
			1
		],
		[
			t,
			hd,
			dd + " " + pd,
			gd,
			ud + " " + pd,
			gd,
			md,
			gd,
			1
		],
		[
			e,
			hd + ".{fff}",
			dd + " " + pd,
			gd,
			ud + " " + pd,
			gd,
			md,
			gd,
			1
		]
	];
	function l(t) {
		return (s, c, l, u, d, f) => {
			let p = [], m = d >= o, h = d >= a && d < o, g = t(l), _ = _u(g * e, 3), v = Dd(g.getFullYear(), m ? 0 : g.getMonth(), h || m ? 1 : g.getDate()), y = _u(v * e, 3);
			if (h || m) {
				let n = h ? d / a : 0, r = m ? d / o : 0, i = _ == y ? _ : _u(Dd(v.getFullYear() + r, v.getMonth() + n, 1) * e, 3), s = new Date(Gl(i / e)), c = s.getFullYear(), l = s.getMonth();
				for (let a = 0; i <= u; a++) {
					let o = Dd(c + r * a, l + n * a, 1), s = o - t(_u(o * e, 3));
					i = _u((+o + s) * e, 3), i <= u && p.push(i);
				}
			} else {
				let a = d >= i ? i : d, o = y + (Wl(l) - Wl(_)) + hu(_ - y, a);
				p.push(o);
				let m = t(o), h = m.getHours() + m.getMinutes() / n + m.getSeconds() / r, g = d / r, v = f / s.axes[c]._space;
				for (; o = _u(o + d, e == 1 ? 0 : 3), !(o > u);) if (g > 1) {
					let e = Wl(_u(h + g, 6)) % 24, n = t(o).getHours() - e;
					n > 1 && (n = -1), o -= n * r, h = (h + g) % 24;
					let i = p[p.length - 1];
					_u((o - i) / d, 3) * v >= .7 && p.push(o);
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
var [vd, yd, bd] = _d(1), [xd, Sd, Cd] = _d(.001);
bu(2, -53, 53, [1]);
function wd(e, t) {
	return e.map((e) => e.map((n, r) => r == 0 || r == 8 || n == null ? n : t(r == 1 || e[8] == 0 ? n : e[1] + n)));
}
function Td(e, t) {
	return (n, r, i, a, o) => {
		let s = t.find((e) => o >= e[0]) || t[t.length - 1], c, l, u, d, f, p;
		return r.map((t) => {
			let n = e(t), r = n.getFullYear(), i = n.getMonth(), a = n.getDate(), o = n.getHours(), m = n.getMinutes(), h = n.getSeconds(), g = r != c && s[2] || i != l && s[3] || a != u && s[4] || o != d && s[5] || m != f && s[6] || h != p && s[7] || s[1];
			return c = r, l = i, u = a, d = o, f = m, p = h, g(n);
		});
	};
}
function Ed(e, t) {
	let n = Zu(t);
	return (t, r, i, a, o) => r.map((t) => n(e(t)));
}
function Dd(e, t, n) {
	return new Date(e, t, n);
}
function Od(e, t) {
	return t(e);
}
var kd = "{YYYY}-{MM}-{DD} {h}:{mm}{aa}";
function Ad(e, t) {
	return (n, r, i, a) => a == null ? $c : t(e(r));
}
function jd(e, t) {
	let n = e.series[t];
	return n.width ? n.stroke(e, t) : n.points.width ? n.points.stroke(e, t) : null;
}
function Md(e, t) {
	return e.series[t].fill(e, t);
}
var Nd = {
	show: !0,
	live: !0,
	isolate: !1,
	mount: ou,
	markers: {
		show: !0,
		width: 2,
		stroke: jd,
		fill: Md,
		dash: "solid"
	},
	idx: null,
	idxs: null,
	values: []
};
function Pd(e, t) {
	let n = e.cursor.points, r = dl(), i = n.size(e, t);
	ll(r, Fc, i), ll(r, Ic, i);
	let a = i / -2;
	ll(r, "marginLeft", a), ll(r, "marginTop", a);
	let o = n.width(e, t, i);
	return o && ll(r, "borderWidth", o), r;
}
function Fd(e, t) {
	let n = e.series[t].points;
	return n._fill || n._stroke;
}
function Id(e, t) {
	let n = e.series[t].points;
	return n._stroke || n._fill;
}
function Ld(e, t) {
	return e.series[t].points.size;
}
var Rd = [0, 0];
function zd(e, t, n) {
	return Rd[0] = t, Rd[1] = n, Rd;
}
function Bd(e, t, n, r = !0) {
	return (e) => {
		e.button != 0 || r && e.target != t || n(e);
	};
}
function Vd(e, t, n, r = !0) {
	return (e) => {
		r && e.target != t || n(e);
	};
}
var Hd = {
	show: !0,
	x: !0,
	y: !0,
	lock: !1,
	move: zd,
	points: {
		one: !1,
		show: Pd,
		size: Ld,
		width: 0,
		stroke: Id,
		fill: Fd
	},
	bind: {
		mousedown: Bd,
		mouseup: Bd,
		click: Bd,
		dblclick: Bd,
		mousemove: Vd,
		mouseleave: Vd,
		mouseenter: Vd
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
}, Ud = {
	show: !0,
	stroke: "rgba(0,0,0,0.07)",
	width: 2
}, Wd = Nu({}, Ud, { filter: cu }), Gd = Nu({}, Wd, { size: 10 }), Kd = Nu({}, Ud, { show: !1 }), qd = "12px system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"", Jd = "bold " + qd, Yd = 1.5, Xd = {
	show: !0,
	scale: "x",
	stroke: Vc,
	space: 50,
	gap: 5,
	alignTo: 1,
	size: 50,
	labelGap: 0,
	labelSize: 30,
	labelFont: Jd,
	side: 2,
	grid: Wd,
	ticks: Gd,
	border: Kd,
	font: qd,
	lineGap: Yd,
	rotate: 0
}, Zd = "Value", Qd = "Time", $d = {
	show: !0,
	scale: "x",
	auto: !1,
	sorted: 1,
	min: tu,
	max: -Infinity,
	idxs: []
};
function ef(e, t, n, r, i) {
	return t.map((e) => e == null ? "" : Bl(e));
}
function tf(e, t, n, r, i, a, o) {
	let s = [], c = vu.get(i) || 0;
	n = o ? n : _u(hu(n, i), c);
	for (let e = n; e <= r; e = _u(e + i, c)) s.push(Object.is(e, -0) ? 0 : e);
	return s;
}
function nf(e, t, n, r, i, a, o) {
	let s = [], c = e.scales[e.axes[t].scale].log;
	i = Yl(c, Wl((c == 10 ? Zl : Ql)(n))), c == 10 && (i = ad[Sl(i, ad)]);
	let l = n, u = i * c;
	c == 10 && (u = ad[Sl(u, ad)]);
	do
		s.push(l), l += i, c == 10 && !vu.has(l) && (l = _u(l, vu.get(i))), l >= u && (i = l, u = i * c, c == 10 && (u = ad[Sl(u, ad)]));
	while (l <= r);
	return s;
}
function rf(e, t, n, r, i, a, o) {
	let s = e.scales[e.axes[t].scale].asinh, c = r > s ? nf(e, t, Jl(s, n), r, i) : [s], l = r >= 0 && n <= 0 ? [0] : [];
	return (n < -s ? nf(e, t, Jl(s, -r), -n, i) : [s]).reverse().map((e) => -e).concat(l, c);
}
var af = /./, of = /[12357]/, sf = /[125]/, cf = /1/, lf = (e, t, n, r) => e.map((e, i) => t == 4 && e == 0 || i % r == 0 && n.test(e.toExponential()[+(e < 0)]) ? e : null);
function uf(e, t, n, r, i) {
	let a = e.axes[n], o = a.scale, s = e.scales[o], c = e.valToPos, l = a._space, u = c(10, o), d = c(9, o) - u >= l ? af : c(7, o) - u >= l ? of : c(5, o) - u >= l ? sf : cf;
	if (d == cf) {
		let e = Ul(c(1, o) - u);
		if (e < l) return lf(t.slice().reverse(), s.distr, d, Kl(l / e)).reverse();
	}
	return lf(t, s.distr, d, 1);
}
function df(e, t, n, r, i) {
	let a = e.axes[n], o = a.scale, s = a._space, c = e.valToPos, l = Ul(c(1, o) - c(2, o));
	return l < s ? lf(t.slice().reverse(), 3, af, Kl(s / l)).reverse() : t;
}
function ff(e, t, n, r) {
	return r == null ? $c : t == null ? "" : Bl(t);
}
var pf = {
	show: !0,
	scale: "y",
	stroke: Vc,
	space: 30,
	gap: 5,
	alignTo: 1,
	size: 50,
	labelGap: 0,
	labelSize: 30,
	labelFont: Jd,
	side: 3,
	grid: Wd,
	ticks: Gd,
	border: Kd,
	font: qd,
	lineGap: Yd,
	rotate: 0
};
function mf(e, t) {
	return _u((3 + (e || 1) * 2) * t, 3);
}
function hf(e, t) {
	let { scale: n, idxs: r } = e.series[0], i = e._data[0], a = e.valToPos(i[r[0]], n, !0), o = Ul(e.valToPos(i[r[1]], n, !0) - a) / (e.series[t].points.space * il);
	return r[1] - r[0] <= o;
}
var gf = {
	scale: null,
	auto: !0,
	sorted: 0,
	min: tu,
	max: -Infinity
}, _f = (e, t, n, r, i) => i, vf = {
	show: !0,
	auto: !0,
	sorted: 0,
	gaps: _f,
	alpha: 1,
	facets: [Nu({}, gf, { scale: "x" }), Nu({}, gf, { scale: "y" })]
}, yf = {
	scale: "y",
	auto: !0,
	sorted: 0,
	show: !0,
	spanGaps: !1,
	gaps: _f,
	alpha: 1,
	points: {
		show: hf,
		filter: null
	},
	values: null,
	min: tu,
	max: -Infinity,
	idxs: [],
	path: null,
	clip: null
};
function bf(e, t, n, r, i) {
	return n / 10;
}
var xf = {
	time: mc,
	auto: !0,
	distr: 1,
	log: 10,
	asinh: 1,
	min: null,
	max: null,
	dir: 1,
	ori: 0
}, Sf = Nu({}, xf, {
	time: !1,
	ori: 1
}), Cf = {};
function wf(e, t) {
	let n = Cf[e];
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
	}, e != null && (Cf[e] = n)), n;
}
var Tf = 1, Ef = 2;
function Df(e, t, n) {
	let r = e.mode, i = e.series[t], a = r == 2 ? e._data[t] : e._data, o = e.scales, s = e.bbox, c = a[0], l = r == 2 ? a[1] : a[t], u = r == 2 ? o[i.facets[0].scale] : o[e.series[0].scale], d = r == 2 ? o[i.facets[1].scale] : o[i.scale], f = s.left, p = s.top, m = s.width, h = s.height, g = e.valToPosH, _ = e.valToPosV;
	return u.ori == 0 ? n(i, c, l, u, d, g, _, f, p, m, h, If, Rf, Bf, Hf, Wf) : n(i, c, l, u, d, _, g, p, f, h, m, Lf, zf, Vf, Uf, Gf);
}
function Of(e, t) {
	let n = 0, r = 0, i = Il(e.bands, Su);
	for (let e = 0; e < i.length; e++) {
		let a = i[e];
		a.series[0] == t ? n = a.dir : a.series[1] == t && (a.dir == 1 ? r |= 1 : r |= 2);
	}
	return [n, r == 1 ? -1 : r == 2 ? 1 : r == 3 ? 2 : 0];
}
function kf(e, t, n, r, i) {
	let a = e.mode, o = e.series[t], s = a == 2 ? o.facets[1].scale : o.scale, c = e.scales[s];
	return i == -1 ? c.min : i == 1 ? c.max : c.distr == 3 ? c.dir == 1 ? c.min : c.max : 0;
}
function Af(e, t, n, r, i, a) {
	return Df(e, t, (e, t, o, s, c, l, u, d, f, p, m) => {
		let h = e.pxRound, g = s.dir * (s.ori == 0 ? 1 : -1), _ = s.ori == 0 ? Rf : zf, v, y;
		g == 1 ? (v = n, y = r) : (v = r, y = n);
		let b = h(l(t[v], s, p, d)), x = h(u(o[v], c, m, f)), S = h(l(t[y], s, p, d)), C = h(u(a == 1 ? c.max : c.min, c, m, f)), w = new Path2D(i);
		return _(w, S, C), _(w, b, C), _(w, b, x), w;
	});
}
function jf(e, t, n, r, i, a) {
	let o = null;
	if (e.length > 0) {
		o = new Path2D();
		let s = t == 0 ? Bf : Vf, c = n;
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
function Mf(e, t, n) {
	let r = e[e.length - 1];
	r && r[0] == t ? r[1] = n : e.push([t, n]);
}
function Nf(e, t, n, r, i, a, o) {
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
function Pf(e) {
	return e == 0 ? su : e == 1 ? Gl : (t) => mu(t, e);
}
function Ff(e) {
	let t = e == 0 ? If : Lf, n = e == 0 ? (e, t, n, r, i, a) => {
		e.arcTo(t, n, r, i, a);
	} : (e, t, n, r, i, a) => {
		e.arcTo(n, t, i, r, a);
	}, r = e == 0 ? (e, t, n, r, i) => {
		e.rect(t, n, r, i);
	} : (e, t, n, r, i) => {
		e.rect(n, t, i, r);
	};
	return (e, i, a, o, s, c = 0, l = 0) => {
		c == 0 && l == 0 ? r(e, i, a, o, s) : (c = ql(c, o / 2, s / 2), l = ql(l, o / 2, s / 2), t(e, i + c, a), n(e, i + o, a, i + o, a + s, c), n(e, i + o, a + s, i, a + s, l), n(e, i, a + s, i, a, l), n(e, i, a, i + o, a, c), e.closePath());
	};
}
var If = (e, t, n) => {
	e.moveTo(t, n);
}, Lf = (e, t, n) => {
	e.moveTo(n, t);
}, Rf = (e, t, n) => {
	e.lineTo(t, n);
}, zf = (e, t, n) => {
	e.lineTo(n, t);
}, Bf = Ff(0), Vf = Ff(1), Hf = (e, t, n, r, i, a) => {
	e.arc(t, n, r, i, a);
}, Uf = (e, t, n, r, i, a) => {
	e.arc(n, t, r, i, a);
}, Wf = (e, t, n, r, i, a, o) => {
	e.bezierCurveTo(t, n, r, i, a, o);
}, Gf = (e, t, n, r, i, a, o) => {
	e.bezierCurveTo(n, t, i, r, o, a);
};
function Kf(e) {
	return (e, t, n, r, i) => Df(e, t, (t, a, o, s, c, l, u, d, f, p, m) => {
		let { pxRound: h, points: g } = t, _, v;
		s.ori == 0 ? (_ = If, v = Hf) : (_ = Lf, v = Uf);
		let y = _u(g.width * il, 3), b = (g.size - g.width) / 2 * il, x = _u(b * 2, 3), S = new Path2D(), C = new Path2D(), { left: w, top: T, width: E, height: D } = e.bbox;
		Bf(C, w - x, T - x, E + x * 2, D + x * 2);
		let O = (e) => {
			if (o[e] != null) {
				let t = h(l(a[e], s, p, d)), n = h(u(o[e], c, m, f));
				_(S, t + b, n), v(S, t, n, b, 0, Hl * 2);
			}
		};
		if (i) i.forEach(O);
		else for (let e = n; e <= r; e++) O(e);
		return {
			stroke: y > 0 ? S : null,
			fill: S,
			clip: C,
			flags: 3
		};
	});
}
function qf(e) {
	return (t, n, r, i, a, o) => {
		r != i && (a != r && o != r && e(t, n, r), a != i && o != i && e(t, n, i), e(t, n, o));
	};
}
var Jf = qf(Rf), Yf = qf(zf);
function Xf(e) {
	let t = Il(e?.alignGaps, 0);
	return (e, n, r, i) => Df(e, n, (a, o, s, c, l, u, d, f, p, m, h) => {
		[r, i] = El(s, r, i);
		let g = a.pxRound, _ = (e) => g(u(e, c, m, f)), v = (e) => g(d(e, l, h, p)), y, b;
		c.ori == 0 ? (y = Rf, b = Jf) : (y = zf, b = Yf);
		let x = c.dir * (c.ori == 0 ? 1 : -1), S = {
			stroke: new Path2D(),
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: Tf
		}, C = S.stroke, w = !1;
		if (i - r >= m * 4) {
			let t = (t) => e.posToVal(t, c.key, !0), n = null, a = null, l, u, d, f = _(o[x == 1 ? r : i]), p = _(o[r]), m = _(o[i]), h = t(x == 1 ? p + 1 : m - 1);
			for (let e = x == 1 ? r : i; e >= r && e <= i; e += x) {
				let r = o[e], i = (x == 1 ? r < h : r > h) ? f : _(r), c = s[e];
				i == f ? c == null ? c === null && (w = !0) : (u = c, n == null ? (y(C, i, v(u)), l = n = a = u) : u < n ? n = u : u > a && (a = u)) : (n != null && b(C, f, v(n), v(a), v(l), v(u)), c == null ? (n = a = null, c === null && (w = !0)) : (u = c, y(C, i, v(u)), n = a = l = u), f = i, h = t(f + x));
			}
			n != null && n != a && d != f && b(C, f, v(n), v(a), v(l), v(u));
		} else for (let e = x == 1 ? r : i; e >= r && e <= i; e += x) {
			let t = s[e];
			t === null ? w = !0 : t != null && y(C, _(o[e]), v(t));
		}
		let [T, E] = Of(e, n);
		if (a.fill != null || T != 0) {
			let t = S.fill = new Path2D(C), s = v(a.fillTo(e, n, a.min, a.max, T)), c = _(o[r]), l = _(o[i]);
			x == -1 && ([l, c] = [c, l]), y(t, l, s), y(t, c, s);
		}
		if (!a.spanGaps) {
			let l = [];
			w && l.push(...Nf(o, s, r, i, x, _, t)), S.gaps = l = a.gaps(e, n, r, i, l), S.clip = jf(l, c.ori, f, p, m, h);
		}
		return E != 0 && (S.band = E == 2 ? [Af(e, n, r, i, C, -1), Af(e, n, r, i, C, 1)] : Af(e, n, r, i, C, E)), S;
	});
}
function Zf(e) {
	let t = Il(e.align, 1), n = Il(e.ascDesc, !1), r = Il(e.alignGaps, 0), i = Il(e.extend, !1);
	return (e, a, o, s) => Df(e, a, (c, l, u, d, f, p, m, h, g, _, v) => {
		[o, s] = El(u, o, s);
		let y = c.pxRound, { left: b, width: x } = e.bbox, S = (e) => y(p(e, d, _, h)), C = (e) => y(m(e, f, v, g)), w = d.ori == 0 ? Rf : zf, T = {
			stroke: new Path2D(),
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: Tf
		}, E = T.stroke, D = d.dir * (d.ori == 0 ? 1 : -1), O = C(u[D == 1 ? o : s]), ee = S(l[D == 1 ? o : s]), te = ee, k = ee;
		i && t == -1 && (k = b, w(E, k, O)), w(E, ee, O);
		for (let e = D == 1 ? o : s; e >= o && e <= s; e += D) {
			let n = u[e];
			if (n == null) continue;
			let r = S(l[e]), i = C(n);
			t == 1 ? w(E, r, O) : w(E, te, i), w(E, r, i), O = i, te = r;
		}
		let A = te;
		i && t == 1 && (A = b + x, w(E, A, O));
		let [ne, j] = Of(e, a);
		if (c.fill != null || ne != 0) {
			let t = T.fill = new Path2D(E), n = C(c.fillTo(e, a, c.min, c.max, ne));
			w(t, A, n), w(t, k, n);
		}
		if (!c.spanGaps) {
			let i = [];
			i.push(...Nf(l, u, o, s, D, S, r));
			let f = c.width * il / 2, p = n || t == 1 ? f : -f, m = n || t == -1 ? -f : f;
			i.forEach((e) => {
				e[0] += p, e[1] += m;
			}), T.gaps = i = c.gaps(e, a, o, s, i), T.clip = jf(i, d.ori, h, g, _, v);
		}
		return j != 0 && (T.band = j == 2 ? [Af(e, a, o, s, E, -1), Af(e, a, o, s, E, 1)] : Af(e, a, o, s, E, j)), T;
	});
}
function Qf(e, t, n, r, i, a, o = tu) {
	if (e.length > 1) {
		let s = null;
		for (let c = 0, l = Infinity; c < e.length; c++) if (t[c] !== void 0) {
			if (s != null) {
				let t = Ul(e[c] - e[s]);
				t < l && (l = t, o = Ul(n(e[c], r, i, a) - n(e[s], r, i, a)));
			}
			s = c;
		}
	}
	return o;
}
function $f(e) {
	e ||= xu;
	let t = Il(e.size, [
		.6,
		tu,
		1
	]), n = e.align || 0, r = e.gap || 0, i = e.radius;
	i = i == null ? [0, 0] : typeof i == "number" ? [i, 0] : i;
	let a = au(i), o = 1 - t[0], s = Il(t[1], tu), c = Il(t[2], 1), l = Il(e.disp, xu), u = Il(e.each, (e) => {}), { fill: d, stroke: f } = l;
	return (e, t, i, p) => Df(e, t, (m, h, g, _, v, y, b, x, S, C, w) => {
		let T = m.pxRound, E = n, D = r * il, O = s * il, ee = c * il, te, k;
		_.ori == 0 ? [te, k] = a(e, t) : [k, te] = a(e, t);
		let A = _.dir * (_.ori == 0 ? 1 : -1), ne = _.ori == 0 ? Bf : Vf, j = _.ori == 0 ? u : (e, t, n, r, i, a, o) => {
			u(e, t, n, i, r, o, a);
		}, re = Il(e.bands, Su).find((e) => e.series[0] == t), ie = re == null ? 0 : re.dir, ae = m.fillTo(e, t, m.min, m.max, ie), oe = T(b(ae, v, w, S)), M, N, se, ce = C, le = T(m.width * il), ue = !1, de = null, fe = null, pe = null, me = null;
		d != null && (le == 0 || f != null) && (ue = !0, de = d.values(e, t, i, p), fe = /* @__PURE__ */ new Map(), new Set(de).forEach((e) => {
			e != null && fe.set(e, new Path2D());
		}), le > 0 && (pe = f.values(e, t, i, p), me = /* @__PURE__ */ new Map(), new Set(pe).forEach((e) => {
			e != null && me.set(e, new Path2D());
		})));
		let { x0: he, size: ge } = l;
		if (he != null && ge != null) {
			E = 1, h = he.values(e, t, i, p), he.unit == 2 && (h = h.map((t) => e.posToVal(x + t * C, _.key, !0)));
			let n = ge.values(e, t, i, p);
			N = ge.unit == 2 ? n[0] * C : y(n[0], _, C, x) - y(0, _, C, x), ce = Qf(h, g, y, _, C, x, ce), se = ce - N + D;
		} else ce = Qf(h, g, y, _, C, x, ce), se = ce * o + D, N = ce - se;
		se < 1 && (se = 0), le >= N / 2 && (le = 0), se < 5 && (T = su);
		let _e = se > 0, ve = ce - se - (_e ? le : 0);
		N = T(ru(ve, ee, O)), M = (E == 0 ? N / 2 : E == A ? 0 : N) - E * A * ((E == 0 ? D / 2 : 0) + (_e ? le / 2 : 0));
		let ye = {
			stroke: null,
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: 0
		}, be = ue ? null : new Path2D(), xe = null;
		if (re != null) xe = e.data[re.series[1]];
		else {
			let { y0: n, y1: r } = l;
			n != null && r != null && (g = r.values(e, t, i, p), xe = n.values(e, t, i, p));
		}
		let Se = te * N, Ce = k * N;
		for (let n = A == 1 ? i : p; n >= i && n <= p; n += A) {
			let r = g[n];
			if (r == null) continue;
			if (xe != null) {
				let e = xe[n] ?? 0;
				if (r - e == 0) continue;
				oe = b(e, v, w, S);
			}
			let i = y(_.distr != 2 || l != null ? h[n] : n, _, C, x), a = b(Il(r, ae), v, w, S), o = T(i - M), s = T(Jl(a, oe)), c = T(ql(a, oe)), u = s - c;
			if (r != null) {
				let i = r < 0 ? Ce : Se, a = r < 0 ? Se : Ce;
				ue ? (le > 0 && pe[n] != null && ne(me.get(pe[n]), o, c + Wl(le / 2), N, Jl(0, u - le), i, a), de[n] != null && ne(fe.get(de[n]), o, c + Wl(le / 2), N, Jl(0, u - le), i, a)) : ne(be, o, c + Wl(le / 2), N, Jl(0, u - le), i, a), j(e, t, n, o - le / 2, c, N + le, u);
			}
		}
		return le > 0 ? ye.stroke = ue ? me : be : ue || (ye._fill = m.width == 0 ? m._fill : m._stroke ?? m._fill, ye.width = 0), ye.fill = ue ? fe : be, ye;
	});
}
function ep(e, t) {
	let n = Il(t?.alignGaps, 0);
	return (t, r, i, a) => Df(t, r, (o, s, c, l, u, d, f, p, m, h, g) => {
		[i, a] = El(c, i, a);
		let _ = o.pxRound, v = (e) => _(d(e, l, h, p)), y = (e) => _(f(e, u, g, m)), b, x, S;
		l.ori == 0 ? (b = If, S = Rf, x = Wf) : (b = Lf, S = zf, x = Gf);
		let C = l.dir * (l.ori == 0 ? 1 : -1), w = v(s[C == 1 ? i : a]), T = w, E = [], D = [];
		for (let e = C == 1 ? i : a; e >= i && e <= a; e += C) if (c[e] != null) {
			let t = s[e], n = v(t);
			E.push(T = n), D.push(y(c[e]));
		}
		let O = {
			stroke: e(E, D, b, S, x, _),
			fill: null,
			clip: null,
			band: null,
			gaps: null,
			flags: Tf
		}, ee = O.stroke, [te, k] = Of(t, r);
		if (o.fill != null || te != 0) {
			let e = O.fill = new Path2D(ee), n = y(o.fillTo(t, r, o.min, o.max, te));
			S(e, T, n), S(e, w, n);
		}
		if (!o.spanGaps) {
			let e = [];
			e.push(...Nf(s, c, i, a, C, v, n)), O.gaps = e = o.gaps(t, r, i, a, e), O.clip = jf(e, l.ori, p, m, h, g);
		}
		return k != 0 && (O.band = k == 2 ? [Af(t, r, i, a, ee, -1), Af(t, r, i, a, ee, 1)] : Af(t, r, i, a, ee, k)), O;
	});
}
function tp(e) {
	return ep(np, e);
}
function np(e, t, n, r, i, a) {
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
var rp = /* @__PURE__ */ new Set();
function ip() {
	for (let e of rp) e.syncRect(!0);
}
el && (bl(Yc, nl, ip), bl(Xc, nl, ip, !0), bl(Qc, nl, () => {
	bp.pxRatio = il;
}));
var ap = Xf(), op = Kf();
function sp(e, t, n, r) {
	return (r ? [e[0], e[1]].concat(e.slice(2)) : [e[0]].concat(e.slice(1))).map((e, r) => lp(e, r, t, n));
}
function cp(e, t) {
	return e.map((e, n) => n == 0 ? {} : Nu({}, t, e));
}
function lp(e, t, n, r) {
	return Nu({}, t == 0 ? n : r, e);
}
function up(e, t, n) {
	return t == null ? Cu : [t, n];
}
var dp = up;
function fp(e, t, n) {
	return t == null ? Cu : Fl(t, n, jl, !0);
}
function pp(e, t, n, r) {
	return t == null ? Cu : kl(t, n, e.scales[r].log, !1);
}
var mp = pp;
function hp(e, t, n, r) {
	return t == null ? Cu : Al(t, n, e.scales[r].log, !1);
}
var gp = hp;
function _p(e, t, n, r, i) {
	let a = Jl(nu(e), nu(t)), o = t - e, s = Sl(i / r * o, n);
	do {
		let e = n[s], t = r * e / o;
		if (t >= i && a + (e < 5 ? vu.get(e) : 0) <= 17) return [e, t];
	} while (++s < n.length);
	return [0, 0];
}
function vp(e) {
	let t, n;
	return e = e.replace(/(\d+)px/, (e, r) => (t = Gl((n = +r) * il)) + "px"), [
		e,
		t,
		n
	];
}
function yp(e) {
	e.show && [e.font, e.labelFont].forEach((e) => {
		let t = _u(e[2] * il, 1);
		e[0] = e[0].replace(/[0-9.]+px/, t + "px"), e[1] = t;
	});
}
function bp(e, t, n) {
	let r = { mode: Il(e.mode, 1) }, i = r.mode;
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
	let l = r.root = dl(hc);
	if (e.id != null && (l.id = e.id), sl(l, e.class), e.title) {
		let t = dl(vc, l);
		t.textContent = e.title;
	}
	let u = ul("canvas"), d = r.ctx = u.getContext("2d"), f = dl(yc, l);
	bl("click", f, (e) => {
		e.target === m && (on != tn || sn != nn) && ln.click(r, e);
	}, !0);
	let p = r.under = dl(bc, f);
	f.appendChild(u);
	let m = r.over = dl(xc, f);
	e = Mu(e);
	let h = +Il(e.pxAlign, 1), g = Pf(h);
	(e.plugins || []).forEach((t) => {
		t.opts && (e = t.opts(r, e) || e);
	});
	let _ = e.ms || .001, v = r.series = i == 1 ? sp(e.series || [], $d, yf, !1) : cp(e.series || [null], vf), y = r.axes = sp(e.axes || [], Xd, pf, !0), b = r.scales = {}, x = r.bands = e.bands || [];
	x.forEach((e) => {
		e.fill = au(e.fill || null), e.dir = Il(e.dir, -1);
	});
	let S = i == 2 ? v[1].facets[0].scale : v[0].scale, C = {
		axes: Ht,
		series: B
	}, w = (e.drawOrder || ["axes", "series"]).map((e) => C[e]);
	function T(e) {
		let t = e.distr == 3 ? (t) => Zl(t > 0 ? t : e.clamp(r, t, e.min, e.max, e.key)) : e.distr == 4 ? (t) => eu(t, e.asinh) : e.distr == 100 ? (t) => e.fwd(t) : (e) => e;
		return (n) => {
			let r = t(n), { _min: i, _max: a } = e, o = a - i;
			return (r - i) / o;
		};
	}
	function E(t) {
		let n = b[t];
		if (n == null) {
			let r = (e.scales || xu)[t] || xu;
			if (r.from != null) {
				E(r.from);
				let e = Nu({}, b[r.from], r, { key: t });
				e.valToPct = T(e), b[t] = e;
			} else {
				n = b[t] = Nu({}, t == S ? xf : Sf, r), n.key = t;
				let e = n.time, a = n.range, o = wu(a);
				if ((t != S || i == 2 && !e) && (o && (a[0] == null || a[1] == null) && (a = {
					min: a[0] == null ? Ml : {
						mode: 1,
						hard: a[0],
						soft: a[0]
					},
					max: a[1] == null ? Ml : {
						mode: 1,
						hard: a[1],
						soft: a[1]
					}
				}, o = !1), !o && Ou(a))) {
					let e = a;
					a = (t, n, r) => n == null ? Cu : Fl(n, r, e);
				}
				n.range = au(a || (e ? dp : t == S ? n.distr == 3 ? mp : n.distr == 4 ? gp : up : n.distr == 3 ? pp : n.distr == 4 ? hp : fp)), n.auto = au(!o && n.auto), n.clamp = au(n.clamp || bf), n._min = n._max = null, n.valToPct = T(n);
			}
		}
	}
	E("x"), E("y"), i == 1 && v.forEach((e) => {
		E(e.scale);
	}), y.forEach((e) => {
		E(e.scale);
	});
	for (let t in e.scales) E(t);
	let D = b[S], O = D.distr, ee, te;
	D.ori == 0 ? (sl(l, gc), ee = a, te = o) : (sl(l, _c), ee = o, te = a);
	let k = {};
	for (let e in b) {
		let t = b[e];
		(t.min != null || t.max != null) && (k[e] = {
			min: t.min,
			max: t.max
		}, t.min = t.max = null);
	}
	let A = e.tzDate || ((e) => new Date(Gl(e / _))), ne = e.fmtDate || Zu, j = _ == 1 ? bd(A) : Cd(A), re = Td(A, wd(_ == 1 ? yd : Sd, ne)), ie = Ad(A, Od(kd, ne)), ae = [], oe = r.legend = Nu({}, Nd, e.legend), M = r.cursor = Nu({}, Hd, { drag: { y: i == 2 } }, e.cursor), N = oe.show, se = M.show, ce = oe.markers;
	oe.idxs = ae, ce.width = au(ce.width), ce.dash = au(ce.dash), ce.stroke = au(ce.stroke), ce.fill = au(ce.fill);
	let le, ue, de, fe = [], pe = [], me, he = !1, ge = {};
	if (oe.live) {
		let e = v[1] ? v[1].values : null;
		he = e != null, me = he ? e(r, 1, 0) : { _: 0 };
		for (let e in me) ge[e] = $c;
	}
	if (N) {
		if (le = ul("table", Oc, l), de = ul("tbody", null, le), oe.mount(r, le), he) {
			ue = ul("thead", null, le, de);
			let e = ul("tr", null, ue);
			for (var _e in ul("th", null, e), me) ul("th", Nc, e).textContent = _e;
		} else sl(le, Ac), oe.live && sl(le, kc);
	}
	let ve = { show: !0 }, ye = { show: !1 };
	function be(e, t) {
		if (t == 0 && (he || !oe.live || i == 2)) return Cu;
		let n = [], a = ul("tr", jc, de, de.childNodes[t]);
		sl(a, e.class), e.show || sl(a, Cc);
		let o = ul("th", null, a);
		if (ce.show) {
			let e = dl(Mc, o);
			if (t > 0) {
				let n = ce.width(r, t);
				n && (e.style.border = n + "px " + ce.dash(r, t) + " " + ce.stroke(r, t)), e.style.background = ce.fill(r, t);
			}
		}
		let s = dl(Nc, o);
		for (var c in e.label instanceof HTMLElement ? s.appendChild(e.label) : s.textContent = e.label, t > 0 && (ce.show || (s.style.color = e.width > 0 ? ce.stroke(r, t) : ce.fill(r, t)), Se("click", o, (t) => {
			if (M._lock) return;
			qe(t);
			let n = v.indexOf(e);
			if ((t.ctrlKey || t.metaKey) != oe.isolate) {
				let e = v.some((e, t) => t > 0 && t != n && e.show);
				v.forEach((t, r) => {
					r > 0 && _n(r, e ? r == n ? ve : ye : ve, !0, Zn.setSeries);
				});
			} else _n(n, { show: !e.show }, !0, Zn.setSeries);
		}, !1), Xe && Se(Kc, o, (t) => {
			M._lock || (qe(t), _n(v.indexOf(e), xn, !0, Zn.setSeries));
		}, !1)), me) {
			let e = ul("td", Pc, a);
			e.textContent = "--", n.push(e);
		}
		return [a, n];
	}
	let xe = /* @__PURE__ */ new Map();
	function Se(e, t, n, i = !0) {
		let a = xe.get(t) || {}, o = M.bind[e](r, t, n, i);
		o && (bl(e, t, a[e] = o), xe.set(t, a));
	}
	function Ce(e, t, n) {
		let r = xe.get(t) || {};
		for (let n in r) (e == null || n == e) && (xl(n, t, r[n]), delete r[n]);
		e ?? xe.delete(t);
	}
	let we = 0, Te = 0, P = 0, Ee = 0, De = 0, Oe = 0, ke = De, Ae = Oe, je = P, Me = Ee, F = 0, Ne = 0, Pe = 0, Fe = 0;
	r.bbox = {};
	let Ie = !1, I = !1, Le = !1, Re = !1, ze = !1, Be = !1;
	function Ve(e, t, n) {
		(n || e != r.width || t != r.height) && He(e, t), Ut(!1), Le = !0, I = !0, Jt();
	}
	function He(e, t) {
		r.width = we = P = e, r.height = Te = Ee = t, De = Oe = 0, Ge(), Ke();
		let n = r.bbox;
		F = n.left = mu(De * il, .5), Ne = n.top = mu(Oe * il, .5), Pe = n.width = mu(P * il, .5), Fe = n.height = mu(Ee * il, .5);
	}
	function Ue() {
		let e = !1, t = 0;
		for (; !e;) {
			t++;
			let n = Bt(t), i = Vt(t);
			e = t == 3 || n && i, e || (He(r.width, r.height), I = !0);
		}
	}
	function We({ width: e, height: t }) {
		Ve(e, t);
	}
	r.setSize = We;
	function Ge() {
		let e = !1, t = !1, n = !1, r = !1;
		y.forEach((i, a) => {
			if (i.show && i._show) {
				let { side: a, _size: o } = i, s = a % 2, c = o + (i.label == null ? 0 : i.labelSize);
				c > 0 && (s ? (P -= c, a == 3 ? (De += c, r = !0) : n = !0) : (Ee -= c, a == 0 ? (Oe += c, e = !0) : t = !0));
			}
		}), it[0] = e, it[1] = n, it[2] = t, it[3] = r, P -= ct[1] + ct[3], De += ct[3], Ee -= ct[2] + ct[0], Oe += ct[0];
	}
	function Ke() {
		let e = De + P, t = Oe + Ee, n = De, r = Oe;
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
	if (M.dataIdx == null) {
		let e = M.hover, n = e.skip = new Set(e.skip ?? []);
		n.add(void 0);
		let r = e.prox = au(e.prox), i = e.bias ??= 0;
		M.dataIdx = (e, a, o, s) => {
			if (a == 0) return o;
			let c = o, l = r(e, a, o, s) ?? tu, u = l >= 0 && l < tu, d = D.ori == 0 ? P : Ee, f = M.left, p = t[0], m = t[a];
			if (n.has(m[o])) {
				c = null;
				let e = null, t = null, r;
				if (i == 0 || i == -1) for (r = o; e == null && r-- > 0;) n.has(m[r]) || (e = r);
				if (i == 0 || i == 1) for (r = o; t == null && r++ < m.length;) n.has(m[r]) || (t = r);
				if (e != null || t != null) {
					if (u) {
						let n = e == null ? -Infinity : ee(p[e], D, d, 0), r = t == null ? Infinity : ee(p[t], D, d, 0), i = f - n, a = r - f;
						i <= a ? i <= l && (c = e) : a <= l && (c = t);
					} else c = t == null ? e : e == null ? t : o - e <= t - o ? e : t;
				}
			} else u && Ul(f - ee(p[o], D, d, 0)) > l && (c = null);
			return c;
		};
	}
	let qe = (e) => {
		M.event = e;
	};
	M.idxs = ae, M._lock = !1;
	let Je = M.points;
	Je.show = au(Je.show), Je.size = au(Je.size), Je.stroke = au(Je.stroke), Je.width = au(Je.width), Je.fill = au(Je.fill);
	let Ye = r.focus = Nu({}, e.focus || { alpha: .3 }, M.focus), Xe = Ye.prox >= 0, Ze = Xe && Je.one, R = [], Qe = [], $e = [];
	function et(e, t) {
		let n = Je.show(r, t);
		if (n instanceof HTMLElement) return sl(n, Dc), sl(n, e.class), pl(n, -10, -10, P, Ee), m.insertBefore(n, R[t]), n;
	}
	function tt(e, t) {
		if (i == 1 || t > 0) {
			let t = i == 1 && b[e.scale].time, n = e.value;
			e.value = t ? Du(n) ? Ad(A, Od(n, ne)) : n || ie : n || ff, e.label = e.label || (t ? Qd : Zd);
		}
		if (Ze || t > 0) {
			e.width = e.width == null ? 1 : e.width, e.paths = e.paths || ap || lu, e.fillTo = au(e.fillTo || kf), e.pxAlign = +Il(e.pxAlign, h), e.pxRound = Pf(e.pxAlign), e.stroke = au(e.stroke || null), e.fill = au(e.fill || null), e._stroke = e._fill = e._paths = e._focus = null;
			let t = mf(Jl(1, e.width), 1), n = e.points = Nu({}, {
				size: t,
				width: Jl(1, t * .2),
				stroke: e.stroke,
				space: t * 2,
				paths: op,
				_stroke: null,
				_fill: null
			}, e.points);
			n.show = au(n.show), n.filter = au(n.filter), n.fill = au(n.fill), n.stroke = au(n.stroke), n.paths = au(n.paths), n.pxAlign = e.pxAlign;
		}
		if (N) {
			let n = be(e, t);
			fe.splice(t, 0, n[0]), pe.splice(t, 0, n[1]), oe.values.push(null);
		}
		if (se) {
			ae.splice(t, 0, null);
			let n = null;
			Ze ? t == 0 && (n = et(e, t)) : t > 0 && (n = et(e, t)), R.splice(t, 0, n), Qe.splice(t, 0, 0), $e.splice(t, 0, 0);
		}
		Yn("addSeries", t);
	}
	function nt(e, t) {
		t ??= v.length, e = i == 1 ? lp(e, t, $d, yf) : lp(e, t, {}, vf), v.splice(t, 0, e), tt(v[t], t);
	}
	r.addSeries = nt;
	function rt(e) {
		if (v.splice(e, 1), N) {
			oe.values.splice(e, 1), pe.splice(e, 1);
			let t = fe.splice(e, 1)[0];
			Ce(null, t.firstChild), t.remove();
		}
		se && (ae.splice(e, 1), R.splice(e, 1)[0].remove(), Qe.splice(e, 1), $e.splice(e, 1)), Yn("delSeries", e);
	}
	r.delSeries = rt;
	let it = [
		!1,
		!1,
		!1,
		!1
	];
	function at(e, t) {
		if (e._show = e.show, e.show) {
			let n = e.side % 2, i = b[e.scale];
			i ??= (e.scale = n ? v[1].scale : S, b[e.scale]);
			let a = i.time;
			e.size = au(e.size), e.space = au(e.space), e.rotate = au(e.rotate), wu(e.incrs) && e.incrs.forEach((e) => {
				!vu.has(e) && vu.set(e, yu(e));
			}), e.incrs = au(e.incrs || (i.distr == 2 ? id : a ? _ == 1 ? vd : xd : ad)), e.splits = au(e.splits || (a && i.distr == 1 ? j : i.distr == 3 ? nf : i.distr == 4 ? rf : tf)), e.stroke = au(e.stroke), e.grid.stroke = au(e.grid.stroke), e.ticks.stroke = au(e.ticks.stroke), e.border.stroke = au(e.border.stroke);
			let o = e.values;
			e.values = wu(o) && !wu(o[0]) ? au(o) : a ? wu(o) ? Td(A, wd(o, ne)) : Du(o) ? Ed(A, o) : o || re : o || ef, e.filter = au(e.filter || (i.distr >= 3 && i.log == 10 ? uf : i.distr == 3 && i.log == 2 ? df : cu)), e.font = vp(e.font), e.labelFont = vp(e.labelFont), e._size = e.size(r, null, t, 0), e._space = e._rotate = e._incrs = e._found = e._splits = e._values = null, e._size > 0 && (it[t] = !0, e._el = dl(Sc, f));
		}
	}
	function ot(e, t, n, r) {
		let [i, a, o, s] = n, c = t % 2, l = 0;
		return c == 0 && (s || a) && (l = t == 0 && !i || t == 2 && !o ? Gl(Xd.size / 3) : 0), c == 1 && (i || o) && (l = t == 1 && !a || t == 3 && !s ? Gl(pf.size / 2) : 0), l;
	}
	let st = r.padding = (e.padding || [
		ot,
		ot,
		ot,
		ot
	]).map((e) => au(Il(e, ot))), ct = r._padding = st.map((e, t) => e(r, t, it, 0)), lt, ut = null, dt = null, ft = i == 1 ? v[0].idxs : null, pt = null, mt = !1;
	function ht(e, n) {
		if (t = e ?? [], r.data = r._data = t, i == 2) {
			lt = 0;
			for (let e = 1; e < v.length; e++) lt += t[e][0].length;
		} else {
			t.length == 0 && (r.data = r._data = t = [[]]), pt = t[0], lt = pt.length;
			let e = t;
			if (O == 2) {
				e = t.slice();
				let n = e[0] = Array(lt);
				for (let e = 0; e < lt; e++) n[e] = e;
			}
			r._data = t = e;
		}
		if (Ut(!0), Yn("setData"), O == 2 && (Le = !0), n !== !1) {
			let e = D;
			e.auto(r, mt) ? gt() : gn(S, e.min, e.max), Re ||= M.left >= 0, Be = !0, Jt();
		}
	}
	r.setData = ht;
	function gt() {
		mt = !0;
		let e, n;
		i == 1 && (lt > 0 ? (ut = ft[0] = 0, dt = ft[1] = lt - 1, e = t[0][ut], n = t[0][dt], O == 2 ? (e = ut, n = dt) : e == n && (O == 3 ? [e, n] = kl(e, e, D.log, !1) : O == 4 ? [e, n] = Al(e, e, D.log, !1) : D.time ? n = e + Gl(86400 / _) : [e, n] = Fl(e, n, jl, !0))) : (ut = ft[0] = e = null, dt = ft[1] = n = null)), gn(S, e, n);
	}
	let _t, vt, yt, bt, xt, St, Ct, wt, z, Tt;
	function Et(e, t, n, r, i, a) {
		e ??= Hc, n ??= Su, r ??= "butt", i ??= Hc, a ??= "round", e != _t && (d.strokeStyle = _t = e), i != vt && (d.fillStyle = vt = i), t != yt && (d.lineWidth = yt = t), a != xt && (d.lineJoin = xt = a), r != St && (d.lineCap = St = r), n != bt && d.setLineDash(bt = n);
	}
	function Dt(e, t, n, r) {
		t != vt && (d.fillStyle = vt = t), e != Ct && (d.font = Ct = e), n != wt && (d.textAlign = wt = n), r != z && (d.textBaseline = z = r);
	}
	function Ot(e, t, n, i, a = 0) {
		if (i.length > 0 && e.auto(r, mt) && (t == null || t.min == null)) {
			let t = Il(ut, 0), r = Il(dt, i.length - 1), o = n.min == null ? Ol(i, t, r, a, e.distr == 3) : [n.min, n.max];
			e.min = ql(e.min, n.min = o[0]), e.max = Jl(e.max, n.max = o[1]);
		}
	}
	let kt = {
		min: null,
		max: null
	};
	function At() {
		for (let e in b) {
			let t = b[e];
			k[e] == null && (t.min == null || k[S] != null && t.auto(r, mt)) && (k[e] = kt);
		}
		for (let e in b) {
			let t = b[e];
			k[e] == null && t.from != null && k[t.from] != null && (k[e] = kt);
		}
		k[S] != null && Ut(!0);
		let e = {};
		for (let t in k) {
			let n = k[t];
			if (n != null) {
				let a = e[t] = Mu(b[t], ku);
				if (n.min != null) Nu(a, n);
				else if (t != S || i == 2) {
					if (lt == 0 && a.from == null) {
						let e = a.range(r, null, null, t);
						a.min = e[0], a.max = e[1];
					} else a.min = tu, a.max = -Infinity;
				}
			}
		}
		if (lt > 0) {
			v.forEach((n, a) => {
				if (i == 1) {
					let i = n.scale, o = k[i];
					if (o == null) return;
					let s = e[i];
					if (a == 0) {
						let e = s.range(r, s.min, s.max, i);
						s.min = e[0], s.max = e[1], ut = Sl(s.min, t[0]), dt = Sl(s.max, t[0]), dt - ut > 1 && (t[0][ut] < s.min && ut++, t[0][dt] > s.max && dt--), n.min = pt[ut], n.max = pt[dt];
					} else n.show && n.auto && Ot(s, o, n, t[a], n.sorted);
					n.idxs[0] = ut, n.idxs[1] = dt;
				} else if (a > 0 && n.show && n.auto) {
					let [r, i] = n.facets, o = r.scale, s = i.scale, [c, l] = t[a], u = e[o], d = e[s];
					u != null && Ot(u, k[o], r, c, r.sorted), d != null && Ot(d, k[s], i, l, i.sorted), n.min = i.min, n.max = i.max;
				}
			});
			for (let t in e) {
				let n = e[t], i = k[t];
				if (n.from == null && (i == null || i.min == null)) {
					let e = n.range(r, n.min == tu ? null : n.min, n.max == -Infinity ? null : n.max, t);
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
				i._min = e == 3 ? Zl(i.min) : e == 4 ? eu(i.min, i.asinh) : e == 100 ? i.fwd(i.min) : i.min, i._max = e == 3 ? Zl(i.max) : e == 4 ? eu(i.max, i.asinh) : e == 100 ? i.fwd(i.max) : i.max, n[t] = a = !0;
			}
		}
		if (a) {
			v.forEach((e, t) => {
				i == 2 ? t > 0 && n.y && (e._paths = null) : n[e.scale] && (e._paths = null);
			});
			for (let e in n) Le = !0, Yn("setScale", e);
			se && M.left >= 0 && (Re = Be = !0);
		}
		for (let e in k) k[e] = null;
	}
	function jt(e) {
		let t = ru(ut - 1, 0, lt - 1), n = ru(dt + 1, 0, lt - 1);
		for (; e[t] == null && t > 0;) t--;
		for (; e[n] == null && n < lt - 1;) n++;
		return [t, n];
	}
	function B() {
		if (lt > 0) {
			let e = v.some((e) => e._focus) && Tt != Ye.alpha;
			e && (d.globalAlpha = Tt = Ye.alpha), v.forEach((e, n) => {
				if (n > 0 && e.show && (Mt(n, !1), Mt(n, !0), e._paths == null)) {
					let a = Tt;
					Tt != e.alpha && (d.globalAlpha = Tt = e.alpha);
					let o = i == 2 ? [0, t[n][0].length - 1] : jt(t[n]);
					e._paths = e.paths(r, n, o[0], o[1]), Tt != a && (d.globalAlpha = Tt = a);
				}
			}), v.forEach((e, t) => {
				if (t > 0 && e.show) {
					let n = Tt;
					Tt != e.alpha && (d.globalAlpha = Tt = e.alpha), e._paths != null && Nt(t, !1);
					{
						let n = e._paths == null ? null : e._paths.gaps, i = e.points.show(r, t, ut, dt, n), a = e.points.filter(r, t, i, n);
						(i || a) && (e.points._paths = e.points.paths(r, t, ut, dt, a), Nt(t, !0));
					}
					Tt != n && (d.globalAlpha = Tt = n), Yn("drawSeries", t);
				}
			}), e && (d.globalAlpha = Tt = 1);
		}
	}
	function Mt(e, t) {
		let n = t ? v[e].points : v[e];
		n._stroke = n.stroke(r, e), n._fill = n.fill(r, e);
	}
	function Nt(e, t) {
		let n = t ? v[e].points : v[e], { stroke: r, fill: i, clip: a, flags: o, _stroke: s = n._stroke, _fill: c = n._fill, _width: l = n.width } = n._paths;
		l = _u(l * il, 3);
		let u = null, f = l % 2 / 2;
		t && c == null && (c = l > 0 ? "#fff" : s);
		let p = n.pxAlign == 1 && f > 0;
		if (p && d.translate(f, f), !t) {
			let e = F - l / 2, t = Ne - l / 2, n = Pe + l, r = Fe + l;
			u = new Path2D(), u.rect(e, t, n, r);
		}
		t ? Ft(s, l, n.dash, n.cap, c, r, i, o, a) : Pt(e, s, l, n.dash, n.cap, c, r, i, o, u, a), p && d.translate(-f, -f);
	}
	function Pt(e, n, i, a, o, s, c, l, u, d, f) {
		let p = !1;
		u != 0 && x.forEach((m, h) => {
			if (m.series[0] == e) {
				let e = v[m.series[1]], g = t[m.series[1]], _ = (e._paths || xu).band;
				wu(_) && (_ = m.dir == 1 ? _[0] : _[1]);
				let y, b = null;
				e.show && _ && Ll(g, ut, dt) ? (b = m.fill(r, h) || s, y = e._paths.clip) : _ = null, Ft(n, i, a, o, b, c, l, u, d, f, y, _), p = !0;
			}
		}), p || Ft(n, i, a, o, s, c, l, u, d, f);
	}
	function Ft(e, t, n, r, i, a, o, s, c, l, u, f) {
		Et(e, t, n, r, i), (c || l || f) && (d.save(), c && d.clip(c), l && d.clip(l)), f ? (s & 3) == 3 ? (d.clip(f), u && d.clip(u), Lt(i, o), It(e, a, t)) : s & Ef ? (Lt(i, o), d.clip(f), It(e, a, t)) : s & Tf && (d.save(), d.clip(f), u && d.clip(u), Lt(i, o), d.restore(), It(e, a, t)) : (Lt(i, o), It(e, a, t)), (c || l || f) && d.restore();
	}
	function It(e, t, n) {
		n > 0 && (t instanceof Map ? t.forEach((e, t) => {
			d.strokeStyle = _t = t, d.stroke(e);
		}) : t != null && e && d.stroke(t));
	}
	function Lt(e, t) {
		t instanceof Map ? t.forEach((e, t) => {
			d.fillStyle = vt = t, d.fill(e);
		}) : t != null && e && d.fill(t);
	}
	function Rt(e, t, n, i) {
		let a = y[e], o;
		if (i <= 0) o = [0, 0];
		else {
			let s = a._space = a.space(r, e, t, n, i);
			o = _p(t, n, a._incrs = a.incrs(r, e, t, n, i, s), i, s);
		}
		return a._found = o;
	}
	function zt(e, t, n, r, i, a, o, s, c, l) {
		let u = o % 2 / 2;
		h == 1 && d.translate(u, u), Et(s, o, c, l, s), d.beginPath();
		let f, p, m, g, _ = i + (r == 0 || r == 3 ? -a : a);
		n == 0 ? (p = i, g = _) : (f = i, m = _);
		for (let r = 0; r < e.length; r++) t[r] != null && (n == 0 ? f = m = e[r] : p = g = e[r], d.moveTo(f, p), d.lineTo(m, g));
		d.stroke(), h == 1 && d.translate(-u, -u);
	}
	function Bt(e) {
		let t = !0;
		return y.forEach((n, i) => {
			if (!n.show) return;
			let a = b[n.scale];
			if (a.min == null) {
				n._show && (t = !1, n._show = !1, Ut(!1));
				return;
			}
			n._show || (t = !1, n._show = !0, Ut(!1));
			let o = n.side, s = o % 2, { min: c, max: l } = a, [u, d] = Rt(i, c, l, s == 0 ? P : Ee);
			if (d == 0) return;
			let f = a.distr == 2, p = n._splits = n.splits(r, i, c, l, u, d, f), m = a.distr == 2 ? p.map((e) => pt[e]) : p, h = a.distr == 2 ? pt[p[1]] - pt[p[0]] : u, g = n._values = n.values(r, n.filter(r, m, i, d, h), i, d, h);
			n._rotate = o == 2 ? n.rotate(r, g, i, d) : 0;
			let _ = n._size;
			n._size = Kl(n.size(r, g, i, e)), _ != null && n._size != _ && (t = !1);
		}), t;
	}
	function Vt(e) {
		let t = !0;
		return st.forEach((n, i) => {
			let a = n(r, i, it, e);
			a != ct[i] && (t = !1), ct[i] = a;
		}), t;
	}
	function Ht() {
		for (let e = 0; e < y.length; e++) {
			let t = y[e];
			if (!t.show || !t._show) continue;
			let n = t.side, i = n % 2, a, o, c = t.stroke(r, e), l = n == 0 || n == 3 ? -1 : 1, [u, f] = t._found;
			if (t.label != null) {
				let s = t.labelGap * l, p = Gl((t._lpos + s) * il);
				Dt(t.labelFont[0], c, "center", n == 2 ? Lc : Rc), d.save(), i == 1 ? (a = o = 0, d.translate(p, Gl(Ne + Fe / 2)), d.rotate((n == 3 ? -Hl : Hl) / 2)) : (a = Gl(F + Pe / 2), o = p);
				let m = iu(t.label) ? t.label(r, e, u, f) : t.label;
				d.fillText(m, a, o), d.restore();
			}
			if (f == 0) continue;
			let p = b[t.scale], m = i == 0 ? Pe : Fe, h = i == 0 ? F : Ne, _ = t._splits, v = p.distr == 2 ? _.map((e) => pt[e]) : _, x = p.distr == 2 ? pt[_[1]] - pt[_[0]] : u, S = t.ticks, C = t.border, w = S.show ? S.size : 0, T = Gl(w * il), E = Gl((t.alignTo == 2 ? t._size - w - t.gap : t.gap) * il), D = t._rotate * -Hl / 180, O = g(t._pos * il), ee = O + (T + E) * l;
			o = i == 0 ? ee : 0, a = i == 1 ? ee : 0;
			let te = t.font[0];
			Dt(te, c, t.align == 1 ? zc : t.align == 2 ? Bc : D > 0 ? zc : D < 0 ? Bc : i == 0 ? "center" : n == 3 ? Bc : zc, D || i == 1 ? "middle" : n == 2 ? Lc : Rc);
			let k = t.font[1] * t.lineGap, A = _.map((e) => g(s(e, p, m, h))), ne = t._values;
			for (let e = 0; e < ne.length; e++) {
				let t = ne[e];
				if (t != null) {
					i == 0 ? a = A[e] : o = A[e], t = "" + t;
					let n = t.indexOf("\n") == -1 ? [t] : t.split(/\n/gm);
					for (let e = 0; e < n.length; e++) {
						let t = n[e];
						D ? (d.save(), d.translate(a, o + e * k), d.rotate(D), d.fillText(t, 0, 0), d.restore()) : d.fillText(t, a, o + e * k);
					}
				}
			}
			S.show && zt(A, S.filter(r, v, e, f, x), i, n, O, T, _u(S.width * il, 3), S.stroke(r, e), S.dash, S.cap);
			let j = t.grid;
			j.show && zt(A, j.filter(r, v, e, f, x), i, i == 0 ? 2 : 1, i == 0 ? Ne : F, i == 0 ? Fe : Pe, _u(j.width * il, 3), j.stroke(r, e), j.dash, j.cap), C.show && zt([O], [1], +(i == 0), i == 0 ? 1 : 2, i == 1 ? Ne : F, i == 1 ? Fe : Pe, _u(C.width * il, 3), C.stroke(r, e), C.dash, C.cap);
		}
		Yn("drawAxes");
	}
	function Ut(e) {
		v.forEach((t, n) => {
			n > 0 && (t._paths = null, e && (i == 1 ? (t.min = null, t.max = null) : t.facets.forEach((e) => {
				e.min = null, e.max = null;
			})));
		});
	}
	let Wt = !1, Gt = !1, Kt = [];
	function qt() {
		Gt = !1;
		for (let e = 0; e < Kt.length; e++) Yn(...Kt[e]);
		Kt.length = 0;
	}
	function Jt() {
		Wt ||= (zu(V), !0);
	}
	function Yt(e, t = !1) {
		Wt = !0, Gt = t, e(r), V(), t && Kt.length > 0 && queueMicrotask(qt);
	}
	r.batch = Yt;
	function V() {
		if (Ie &&= (At(), !1), Le &&= (Ue(), !1), I) {
			if (ll(p, zc, De), ll(p, Lc, Oe), ll(p, Fc, P), ll(p, Ic, Ee), ll(m, zc, De), ll(m, Lc, Oe), ll(m, Fc, P), ll(m, Ic, Ee), ll(f, Fc, we), ll(f, Ic, Te), u.width = Gl(we * il), u.height = Gl(Te * il), y.forEach(({ _el: e, _show: t, _size: n, _pos: r, side: i }) => {
				if (e != null) {
					if (t) {
						let t = i === 3 || i === 0 ? n : 0, a = i % 2 == 1;
						ll(e, a ? "left" : "top", r - t), ll(e, a ? "width" : "height", n), ll(e, a ? "top" : "left", a ? Oe : De), ll(e, a ? "height" : "width", a ? Ee : P), cl(e, Cc);
					} else sl(e, Cc);
				}
			}), _t = vt = yt = xt = St = Ct = wt = z = bt = null, Tt = 1, Pn(!0), De != ke || Oe != Ae || P != je || Ee != Me) {
				Ut(!1);
				let e = P / je, t = Ee / Me;
				if (se && !Re && M.left >= 0) {
					M.left *= e, M.top *= t, Qt && pl(Qt, Gl(M.left), 0, P, Ee), U && pl(U, 0, Gl(M.top), P, Ee);
					for (let n = 0; n < R.length; n++) {
						let r = R[n];
						r != null && (Qe[n] *= e, $e[n] *= t, pl(r, Kl(Qe[n]), Kl($e[n]), P, Ee));
					}
				}
				if (fn.show && !ze && fn.left >= 0 && fn.width > 0) {
					fn.left *= e, fn.width *= e, fn.top *= t, fn.height *= t;
					for (let e in In) ll(pn, e, fn[e]);
				}
				ke = De, Ae = Oe, je = P, Me = Ee;
			}
			Yn("setSize"), I = !1;
		}
		we > 0 && Te > 0 && (d.clearRect(0, 0, u.width, u.height), Yn("drawClear"), w.forEach((e) => e()), Yn("draw")), fn.show && ze && (mn(fn), ze = !1), se && Re && (Mn(null, !0, !1), Re = !1), oe.show && oe.live && Be && (An(), Be = !1), c || (c = !0, r.status = 1, Yn("ready")), mt = !1, Wt = !1;
	}
	r.redraw = (e, t) => {
		Le = t || !1, e === !1 ? Jt() : gn(S, D.min, D.max);
	};
	function Xt(e, n) {
		let i = b[e];
		if (i.from == null) {
			if (lt == 0) {
				let t = i.range(r, n.min, n.max, e);
				n.min = t[0], n.max = t[1];
			}
			if (n.min > n.max) {
				let e = n.min;
				n.min = n.max, n.max = e;
			}
			if (lt > 1 && n.min != null && n.max != null && n.max - n.min < 1e-16) return;
			e == S && i.distr == 2 && lt > 0 && (n.min = Sl(n.min, t[0]), n.max = Sl(n.max, t[0]), n.min == n.max && n.max++), k[e] = n, Ie = !0, Jt();
		}
	}
	r.setScale = Xt;
	let Zt, H, Qt, U, $t, en, tn, nn, rn, an, on, sn, cn = !1, ln = M.drag, un = ln.x, dn = ln.y;
	se && (M.x && (Zt = dl(Tc, m)), M.y && (H = dl(Ec, m)), D.ori == 0 ? (Qt = Zt, U = H) : (Qt = H, U = Zt), on = M.left, sn = M.top);
	let fn = r.select = Nu({
		show: !0,
		over: !0,
		left: 0,
		width: 0,
		top: 0,
		height: 0
	}, e.select), pn = fn.show ? dl(wc, fn.over ? m : p) : null;
	function mn(e, t) {
		if (fn.show) {
			for (let t in e) fn[t] = e[t], t in In && ll(pn, t, e[t]);
			t !== !1 && Yn("setSelect");
		}
	}
	r.setSelect = mn;
	function hn(e) {
		if (v[e].show) N && cl(fe[e], Cc);
		else if (N && sl(fe[e], Cc), se) {
			let t = Ze ? R[0] : R[e];
			t != null && pl(t, -10, -10, P, Ee);
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
			r > 0 && (e == r || e == null) && (n.show = t.show, hn(r), i == 2 ? (gn(n.facets[0].scale, null, null), gn(n.facets[1].scale, null, null)) : gn(n.scale, null, null), Jt());
		}), n !== !1 && Yn("setSeries", e, t), a && er("setSeries", r, e, t);
	}
	r.setSeries = _n;
	function W(e, t) {
		Nu(x[e], t);
	}
	function G(e, t) {
		e.fill = au(e.fill || null), e.dir = Il(e.dir, -1), t ??= x.length, x.splice(t, 0, e);
	}
	function K(e) {
		e == null ? x.length = 0 : x.splice(e, 1);
	}
	r.addBand = G, r.setBand = W, r.delBand = K;
	function q(e, t) {
		v[e].alpha = t, se && R[e] != null && (R[e].style.opacity = t), N && fe[e] && (fe[e].style.opacity = t);
	}
	let vn, yn, bn, xn = { focus: !0 };
	function Sn(e) {
		if (e != bn) {
			let t = e == null, n = Ye.alpha != 1;
			v.forEach((r, a) => {
				if (i == 1 || a > 0) {
					let i = t || a == 0 || a == e;
					r._focus = t ? null : i, n && q(a, i ? 1 : Ye.alpha);
				}
			}), bn = e, n && Jt();
		}
	}
	N && Xe && Se(qc, le, (e) => {
		M._lock || (qe(e), bn != null && _n(null, xn, !0, Zn.setSeries));
	});
	function Cn(e, t, n) {
		let r = b[t];
		n && (e = e / il - (r.ori == 1 ? Oe : De));
		let i = P;
		r.ori == 1 && (i = Ee, e = i - e), r.dir == -1 && (e = i - e);
		let a = r._min, o = r._max, s = e / i, c = a + (o - a) * s, l = r.distr;
		return l == 3 ? Yl(10, c) : l == 4 ? $l(c, r.asinh) : l == 100 ? r.bwd(c) : c;
	}
	function wn(e, n) {
		return Sl(Cn(e, S, n), t[0], ut, dt);
	}
	r.valToIdx = (e) => Sl(e, t[0]), r.posToIdx = wn, r.posToVal = Cn, r.valToPos = (e, t, n) => b[t].ori == 0 ? a(e, b[t], n ? Pe : P, n ? F : 0) : o(e, b[t], n ? Fe : Ee, n ? Ne : 0), r.setCursor = (e, t, n) => {
		on = e.left, sn = e.top, Mn(null, t, n);
	};
	function Tn(e, t) {
		ll(pn, zc, fn.left = e), ll(pn, Fc, fn.width = t);
	}
	function En(e, t) {
		ll(pn, Lc, fn.top = e), ll(pn, Ic, fn.height = t);
	}
	let Dn = D.ori == 0 ? Tn : En, On = D.ori == 1 ? Tn : En;
	function kn() {
		if (N && oe.live) for (let e = +(i == 2); e < v.length; e++) {
			if (e == 0 && he) continue;
			let t = oe.values[e], n = 0;
			for (let r in t) pe[e][n++].firstChild.nodeValue = t[r];
		}
	}
	function An(e, t) {
		if (e != null && (e.idxs ? e.idxs.forEach((e, t) => {
			ae[t] = e;
		}) : Eu(e.idx) || ae.fill(e.idx), oe.idx = ae[0]), N && oe.live) {
			for (let e = 0; e < v.length; e++) (e > 0 || i == 1 && !he) && jn(e, ae[e]);
			kn();
		}
		Be = !1, t !== !1 && Yn("setLegend");
	}
	r.setLegend = An;
	function jn(e, n) {
		let i = v[e], a = e == 0 && O == 2 ? pt : t[e], o;
		he ? o = i.values(r, e, n) ?? ge : (o = i.value(r, n == null ? null : a[n], e, n), o = o == null ? ge : { _: o }), oe.values[e] = o;
	}
	function Mn(e, n, a) {
		rn = on, an = sn, [on, sn] = M.move(r, on, sn), M.left = on, M.top = sn, se && (Qt && pl(Qt, Gl(on), 0, P, Ee), U && pl(U, 0, Gl(sn), P, Ee));
		let o, s = ut > dt;
		vn = tu, yn = null;
		let c = D.ori == 0 ? P : Ee, l = D.ori == 1 ? P : Ee;
		if (on < 0 || lt == 0 || s) {
			o = M.idx = null;
			for (let e = 0; e < v.length; e++) {
				let t = R[e];
				t != null && pl(t, -10, -10, P, Ee);
			}
			Xe && _n(null, xn, !0, e == null && Zn.setSeries), oe.live && (ae.fill(o), Be = !0);
		} else {
			let e, n, a;
			i == 1 && (e = D.ori == 0 ? on : sn, n = Cn(e, S), o = M.idx = Sl(n, t[0], ut, dt), a = ee(t[0][o], D, c, 0));
			let s = -10, u = -10, d = 0, f = 0, p = !0, m = "", h = "";
			for (let e = +(i == 2); e < v.length; e++) {
				let g = v[e], _ = ae[e], y = _ == null ? null : i == 1 ? t[e][_] : t[e][1][_], x = M.dataIdx(r, e, o, n), S = x == null ? null : i == 1 ? t[e][x] : t[e][1][x];
				if (Be = Be || S != y || x != _, ae[e] = x, e > 0 && g.show) {
					let n = x == null ? -10 : x == o ? a : ee(i == 1 ? t[0][x] : t[e][0][x], D, c, 0), _ = S == null ? -10 : te(S, i == 1 ? b[g.scale] : b[g.facets[1].scale], l, 0);
					if (Xe && S != null) {
						let t = D.ori == 1 ? on : sn, n = Ul(Ye.dist(r, e, x, _, t));
						if (n < vn) {
							let r = Ye.bias;
							if (r != 0) {
								let i = Cn(t, g.scale), a = S >= 0 ? 1 : -1, o = i >= 0 ? 1 : -1;
								o == a && (o == 1 ? r == 1 ? S >= i : S <= i : r == 1 ? S <= i : S >= i) && (vn = n, yn = e);
							} else vn = n, yn = e;
						}
					}
					if (Be || Ze) {
						let t, i;
						D.ori == 0 ? (t = n, i = _) : (t = _, i = n);
						let a, o, c, l, g, v, y = !0, b = Je.bbox;
						if (b != null) {
							y = !1;
							let t = b(r, e);
							c = t.left, l = t.top, a = t.width, o = t.height;
						} else c = t, l = i, a = o = Je.size(r, e);
						if (v = Je.fill(r, e), g = Je.stroke(r, e), Ze) e == yn && vn <= Ye.prox && (s = c, u = l, d = a, f = o, p = y, m = v, h = g);
						else {
							let t = R[e];
							t != null && (Qe[e] = c, $e[e] = l, _l(t, a, o, y), hl(t, v, g), pl(t, Kl(c), Kl(l), P, Ee));
						}
					}
				}
			}
			if (Ze) {
				let e = Ye.prox;
				if (Be || (bn == null ? vn <= e : vn > e || yn != bn)) {
					let e = R[0];
					e != null && (Qe[0] = s, $e[0] = u, _l(e, d, f, p), hl(e, m, h), pl(e, Kl(s), Kl(u), P, Ee));
				}
			}
		}
		if (fn.show && cn) {
			if (e != null) {
				let [t, n] = Zn.scales, [r, i] = Zn.match, [a, o] = e.cursor.sync.scales, s = e.cursor.drag;
				if (un = s._x, dn = s._y, un || dn) {
					let { left: s, top: u, width: d, height: f } = e.select, p = e.scales[a].ori, m = e.posToVal, h, g, _, v, y, x = t != null && r(t, a), S = n != null && i(n, o);
					x && un ? (p == 0 ? (h = s, g = d) : (h = u, g = f), _ = b[t], v = ee(m(h, a), _, c, 0), y = ee(m(h + g, a), _, c, 0), Dn(ql(v, y), Ul(y - v))) : Dn(0, c), S && dn ? (p == 1 ? (h = s, g = d) : (h = u, g = f), _ = b[n], v = te(m(h, o), _, l, 0), y = te(m(h + g, o), _, l, 0), On(ql(v, y), Ul(y - v))) : On(0, l);
				} else Ln();
			} else {
				let e = Ul(rn - $t), t = Ul(an - en);
				if (D.ori == 1) {
					let n = e;
					e = t, t = n;
				}
				un = ln.x && e >= ln.dist, dn = ln.y && t >= ln.dist;
				let n = ln.uni;
				n == null ? ln.x && ln.y && (un || dn) && (un = dn = !0) : un && dn && (un = e >= n, dn = t >= n, !un && !dn && (t > e ? dn = !0 : un = !0));
				let r, i;
				un && (D.ori == 0 ? (r = tn, i = on) : (r = nn, i = sn), Dn(ql(r, i), Ul(i - r)), dn || On(0, l)), dn && (D.ori == 1 ? (r = tn, i = on) : (r = nn, i = sn), On(ql(r, i), Ul(i - r)), un || Dn(0, c)), !un && !dn && (Dn(0, 0), On(0, 0));
			}
		}
		if (ln._x = un, ln._y = dn, e == null) {
			if (a) {
				if (Qn != null) {
					let [e, t] = Zn.scales;
					Zn.values[0] = e == null ? null : Cn(D.ori == 0 ? on : sn, e), Zn.values[1] = t == null ? null : Cn(D.ori == 1 ? on : sn, t);
				}
				er(Uc, r, on, sn, P, Ee, o);
			}
			if (Xe) {
				let e = a && Zn.setSeries, t = Ye.prox;
				bn == null ? vn <= t && _n(yn, xn, !0, e) : vn > t ? _n(null, xn, !0, e) : yn != bn && _n(yn, xn, !0, e);
			}
		}
		Be && (oe.idx = o, An()), n !== !1 && Yn("setCursor");
	}
	let Nn = null;
	Object.defineProperty(r, "rect", { get() {
		return Nn ?? Pn(!1), Nn;
	} });
	function Pn(e = !1) {
		e ? Nn = null : (Nn = m.getBoundingClientRect(), Yn("syncRect", Nn));
	}
	function J(e, t, n, r, i, a, o) {
		M._lock || cn && e != null && e.movementX == 0 && e.movementY == 0 || (Fn(e, t, n, r, i, a, o, !1, e != null), e == null ? Mn(t, !0, !1) : Mn(null, !0, !0));
	}
	function Fn(e, t, n, i, a, o, c, l, u) {
		if (Nn ?? Pn(!1), qe(e), e != null) n = e.clientX - Nn.left, i = e.clientY - Nn.top;
		else {
			if (n < 0 || i < 0) {
				on = -10, sn = -10;
				return;
			}
			let [e, r] = Zn.scales, c = t.cursor.sync, [l, u] = c.values, [d, f] = c.scales, [p, m] = Zn.match, h = t.axes[0].side % 2 == 1, g = D.ori == 0 ? P : Ee, _ = D.ori == 1 ? P : Ee, v = h ? o : a, y = h ? a : o, x = h ? i : n, S = h ? n : i;
			if (n = d == null ? x / v * g : p(e, d) ? s(l, b[e], g, 0) : -10, i = f == null ? S / y * _ : m(r, f) ? s(u, b[r], _, 0) : -10, D.ori == 1) {
				let e = n;
				n = i, i = e;
			}
		}
		u && (t == null || t.cursor.event.type == Uc) && ((n <= 1 || n >= P - 1) && (n = mu(n, P)), (i <= 1 || i >= Ee - 1) && (i = mu(i, Ee))), l ? ($t = n, en = i, [tn, nn] = M.move(r, n, i)) : (on = n, sn = i);
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
		cn = !0, un = dn = ln._x = ln._y = !1, Fn(e, t, n, i, a, o, s, !0, !1), e != null && (Se(Gc, tl, Un, !1), er(Wc, r, tn, nn, P, Ee, null));
		let { left: c, top: l, width: u, height: d } = fn;
		Rn = c, zn = l, Bn = u, Vn = d;
	}
	function Un(e, t, n, i, a, o, s) {
		cn = ln._x = ln._y = !1, Fn(e, t, n, i, a, o, s, !1, !0);
		let { left: c, top: l, width: u, height: d } = fn, f = u > 0 || d > 0, p = Rn != c || zn != l || Bn != u || Vn != d;
		if (f && p && mn(fn), ln.setScale && f && p) {
			let e = c, t = u, n = l, r = d;
			if (D.ori == 1 && (e = l, t = d, n = c, r = u), un && gn(S, Cn(e, S), Cn(e + t, S)), dn) for (let e in b) {
				let t = b[e];
				e != S && t.from == null && t.min != tu && gn(e, Cn(n + r, e), Cn(n, e));
			}
			Ln();
		} else M.lock && (M._lock = !M._lock, Mn(t, !0, e != null));
		e != null && (Ce(Gc, tl), er(Gc, r, on, sn, P, Ee, null));
	}
	function Wn(e, t, n, r, i, a, o) {
		if (M._lock) return;
		qe(e);
		let s = cn;
		if (cn) {
			let e = !0, t = !0, n, r;
			D.ori == 0 ? (n = un, r = dn) : (n = dn, r = un), n && r && (e = on <= 10 || on >= P - 10, t = sn <= 10 || sn >= Ee - 10), n && e && (on = on < tn ? 0 : P), r && t && (sn = sn < nn ? 0 : Ee), Mn(null, !0, !0), cn = !1;
		}
		on = -10, sn = -10, ae.fill(null), Mn(null, !0, !0), s && (cn = s);
	}
	function Gn(e, t, n, i, a, o, s) {
		M._lock || (qe(e), gt(), Ln(), e != null && er(Jc, r, on, sn, P, Ee, null));
	}
	function Kn() {
		y.forEach(yp), Ve(r.width, r.height, !0);
	}
	bl(Qc, nl, Kn);
	let qn = {};
	qn.mousedown = Hn, qn.mousemove = J, qn.mouseup = Un, qn.dblclick = Gn, qn.setSeries = (e, t, n, i) => {
		let a = Zn.match[2];
		n = a(r, t, n), n != -1 && _n(n, i, !0, !1);
	}, se && (Se(Wc, m, Hn), Se(Uc, m, J), Se(Kc, m, (e) => {
		qe(e), Pn(!1);
	}), Se(qc, m, Wn), Se(Jc, m, Gn), rp.add(r), r.syncRect = Pn);
	let Jn = r.hooks = e.hooks || {};
	function Yn(e, t, n) {
		Gt ? Kt.push([
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
	let Xn = (e, t, n) => n, Zn = Nu({
		key: null,
		setSeries: !1,
		filters: {
			pub: uu,
			sub: uu
		},
		scales: [S, v[1] ? v[1].scale : null],
		match: [
			du,
			du,
			Xn
		],
		values: [null, null]
	}, M.sync);
	Zn.match.length == 2 && Zn.match.push(Xn), M.sync = Zn;
	let Qn = Zn.key, $n = wf(Qn);
	function er(e, t, n, r, i, a, o) {
		Zn.filters.pub(e, t, n, r, i, a, o) && $n.pub(e, t, n, r, i, a, o);
	}
	$n.sub(r);
	function tr(e, t, n, r, i, a, o) {
		Zn.filters.sub(e, t, n, r, i, a, o) && qn[e](null, t, n, r, i, a, o);
	}
	r.pub = tr;
	function nr() {
		$n.unsub(r), rp.delete(r), xe.clear(), xl(Qc, nl, Kn), l.remove(), le?.remove(), Yn("destroy");
	}
	r.destroy = nr;
	function rr() {
		Yn("init", e, t), ht(t || e.data, !1), k[S] ? Xt(S, k[S]) : gt(), ze = fn.show && (fn.width > 0 || fn.height > 0), Re = Be = !0, Ve(e.width, e.height);
	}
	return v.forEach(tt), y.forEach(at), n ? n instanceof HTMLElement ? (n.appendChild(l), rr()) : n(r, rr) : rr(), r;
}
bp.assign = Nu, bp.fmtNum = Bl, bp.rangeNum = Fl, bp.rangeLog = kl, bp.rangeAsinh = Al, bp.orient = Df, bp.pxRatio = il, bp.join = Ru, bp.fmtDate = Zu, bp.tzDate = $u, bp.sync = wf;
{
	bp.addGap = Mf, bp.clipGaps = jf;
	let e = bp.paths = { points: Kf };
	e.linear = Xf, e.stepped = Zf, e.bars = $f, e.spline = tp;
}
// src/lib/Chart.svelte
var xp = /* @__PURE__ */ X("<div class=\"chart svelte-1knyfmf\" role=\"img\"></div>");
function Sp(e, t) {
	nt(t, !0);
	let n = ba(t, "time", 3, !1), r = ba(t, "xlabel", 3, ""), i = ba(t, "height", 3, 180), a = ba(t, "label", 3, ""), o = ba(t, "xaxis", 19, () => ({})), s = ba(t, "marks", 19, () => []), c, l = /* @__PURE__ */ H(0), u = (e, t) => /^#[0-9a-f]{6}$/i.test(e) ? e + Math.round(t * 255).toString(16).padStart(2, "0") : e;
	kn(() => {
		let e = matchMedia("(prefers-color-scheme: dark)"), t = () => rn(l);
		return e.addEventListener("change", t), () => e.removeEventListener("change", t);
	}), kn(() => {
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
			return e.dash && (r.dash = [6, 4]), e.scale === "plug" && (r.paths = bp.paths.stepped({ align: 1 })), e.kind === "area" && (r.fill = (e) => {
				let n = e.ctx.createLinearGradient(0, e.bbox.top, 0, e.bbox.top + e.bbox.height);
				return n.addColorStop(0, u(t, .35)), n.addColorStop(1, u(t, .04)), n;
			}), e.kind === "bars" && Object.assign(r, {
				paths: bp.paths.bars({
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
		}, y = Ua(), b = new bp({
			...y && { tzDate: (e) => bp.tzDate(/* @__PURE__ */ new Date(e * 1e3), y) },
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
	var d = xp();
	ha(d, (e) => c = e, () => c), J((e) => na(d, "aria-label", e), [() => a() || `Chart: ${t.series.map((e) => e.label).join(", ")}`]), Z(e, d), rt();
}
// src/lib/ui/DetailPage.svelte
var Cp = /* @__PURE__ */ X("<p class=\"d-msg\"> <a class=\"d-link\" href=\"#/activity\">Back to activity</a></p>"), wp = /* @__PURE__ */ X("<p class=\"d-msg\" role=\"alert\"><button class=\"d-btn\">Retry</button></p>"), Tp = /* @__PURE__ */ X("<p class=\"d-msg\" aria-busy=\"true\">Loading…</p>"), Ep = /* @__PURE__ */ X("<article class=\"d-stack\"><header><h1 class=\"d-title\" tabindex=\"-1\"><!></h1> <!></header> <!></article>");
function Dp(e, t) {
	nt(t, !0);
	let n = /* @__PURE__ */ H(null), r = /* @__PURE__ */ H(null), i = /* @__PURE__ */ H(void 0), a = h();
	async function o() {
		let e = a.next();
		U(r, null);
		try {
			let r = await m(t.url);
			if (!e.current) return;
			t.onloaded?.(r), U(n, r, !0);
		} catch (t) {
			e.current && U(r, t, !0);
		}
	}
	xa(() => (o(), xr().then(() => Y(i)?.focus({ preventScroll: !0 })), a.reset));
	var s = Ep(), c = W(s), l = W(c), u = W(l), d = (e) => {
		var r = Kr();
		xi(G(r), () => t.title, () => Y(n)), Z(e, r);
	}, f = (e) => {
		Z(e, Gr("Not available"));
	}, p = (e) => {
		var n = Gr();
		J(() => Q(n, `Couldn't load this ${t.noun ?? ""}`)), Z(e, n);
	}, g = (e) => {
		var n = Gr();
		J(() => Q(n, t.noun === "trip" ? "Trip" : "Charge")), Z(e, n);
	};
	$(u, (e) => {
		Y(n) ? e(d) : Y(r)?.status === 404 ? e(f, 1) : Y(r) ? e(p, 2) : e(g, -1);
	}), I(l), ha(l, (e) => U(i, e), () => Y(i));
	var _ = q(l, 2), v = (e) => {
		var r = Kr();
		xi(G(r), () => t.subtitle ?? O, () => Y(n)), Z(e, r);
	};
	$(_, (e) => {
		Y(n) && e(v);
	}), I(c);
	var y = q(c, 2), b = (e) => {
		var n = Cp(), r = W(n);
		Le(), I(n), J(() => Q(r, `This ${t.noun ?? ""} is not available. `)), Z(e, n);
	}, x = (e) => {
		var t = wp();
		Pr("click", K(t), o), Z(e, t);
	}, S = (e) => {
		Z(e, Tp());
	}, C = (e) => {
		var r = Kr();
		xi(G(r), () => t.body, () => Y(n), () => o), Z(e, r);
	};
	$(y, (e) => {
		Y(r)?.status === 404 ? e(b) : Y(r) ? e(x, 1) : Y(n) ? e(C, -1) : e(S, 2);
	}), I(s), J(() => Vi(s, `--accent: var(${t.accent ?? ""})`)), Z(e, s), rt();
}
Fr(["click"]);
// src/lib/ui/Figure.svelte
var Op = /* @__PURE__ */ X(" <small class=\"svelte-12txda6\"> </small>", 1), kp = /* @__PURE__ */ X("<div><span class=\"caption\"> </span> <span class=\"value big svelte-12txda6\"> <!></span> <!></div>");
function Ap(e, t) {
	let n = ba(t, "unit", 3, ""), r = ba(t, "size", 3, "normal");
	var i = kp();
	let a;
	var o = W(i), s = K(o, !0), c = q(o, 2), l = W(c, !0), u = q(l), d = (e) => {
		var t = Op(), r = G(t, !0);
		r.nodeValue = " ";
		var i = K(q(r), !0);
		J(() => Q(i, n())), Z(e, t);
	};
	$(u, (e) => {
		n() && e(d);
	}), I(c), xi(q(c, 2), () => t.children ?? O), I(i), J(() => {
		a = zi(i, 1, "fig card svelte-12txda6", null, a, { small: r() === "small" }), Q(s, t.label), Q(l, t.value);
	}), Z(e, i);
}
// node_modules/leaflet/dist/leaflet.css
var jp = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t, n) => {
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
		var C = window.requestAnimationFrame || b("RequestAnimationFrame") || S, w = window.cancelAnimationFrame || b("CancelAnimationFrame") || b("CancelRequestAnimationFrame") || function(e) {
			window.clearTimeout(e);
		};
		function T(e, t, n) {
			if (n && C === S) e.call(t);
			else return C.call(window, i(e, t));
		}
		function E(e) {
			e && w.call(window, e);
		}
		var D = {
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
			cancelFn: w,
			requestAnimFrame: T,
			cancelAnimFrame: E
		};
		function O() {}
		O.extend = function(e) {
			var t = function() {
				p(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
			}, i = t.__super__ = this.prototype, a = r(i);
			for (var o in a.constructor = t, t.prototype = a, this) Object.prototype.hasOwnProperty.call(this, o) && o !== "prototype" && o !== "__super__" && (t[o] = this[o]);
			return e.statics && n(t, e.statics), e.includes && (ee(e.includes), n.apply(null, [a].concat(e.includes))), n(a, e), delete a.statics, delete a.includes, a.options && (a.options = i.options ? r(i.options) : {}, n(a.options, e.options)), a._initHooks = [], a.callInitHooks = function() {
				if (!this._initHooksCalled) {
					i.callInitHooks && i.callInitHooks.call(this), this._initHooksCalled = !0;
					for (var e = 0, t = a._initHooks.length; e < t; e++) a._initHooks[e].call(this);
				}
			}, t;
		}, O.include = function(e) {
			var t = this.prototype.options;
			return n(this.prototype, e), e.options && (this.prototype.options = t, this.mergeOptions(e.options)), this;
		}, O.mergeOptions = function(e) {
			return n(this.prototype.options, e), this;
		}, O.addInitHook = function(e) {
			var t = Array.prototype.slice.call(arguments, 1), n = typeof e == "function" ? e : function() {
				this[e].apply(this, t);
			};
			return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(n), this;
		};
		function ee(e) {
			if (typeof L < "u" && L && L.Mixin) {
				e = _(e) ? e : [e];
				for (var t = 0; t < e.length; t++) e[t] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", (/* @__PURE__ */ Error()).stack);
			}
		}
		var te = {
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
		te.addEventListener = te.on, te.removeEventListener = te.clearAllEventListeners = te.off, te.addOneTimeEventListener = te.once, te.fireEvent = te.fire, te.hasEventListeners = te.listens;
		var k = O.extend(te);
		function A(e, t, n) {
			this.x = n ? Math.round(e) : e, this.y = n ? Math.round(t) : t;
		}
		var ne = Math.trunc || function(e) {
			return e > 0 ? Math.floor(e) : Math.ceil(e);
		};
		A.prototype = {
			clone: function() {
				return new A(this.x, this.y);
			},
			add: function(e) {
				return this.clone()._add(j(e));
			},
			_add: function(e) {
				return this.x += e.x, this.y += e.y, this;
			},
			subtract: function(e) {
				return this.clone()._subtract(j(e));
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
				return new A(this.x * e.x, this.y * e.y);
			},
			unscaleBy: function(e) {
				return new A(this.x / e.x, this.y / e.y);
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
				return this.x = ne(this.x), this.y = ne(this.y), this;
			},
			distanceTo: function(e) {
				e = j(e);
				var t = e.x - this.x, n = e.y - this.y;
				return Math.sqrt(t * t + n * n);
			},
			equals: function(e) {
				return e = j(e), e.x === this.x && e.y === this.y;
			},
			contains: function(e) {
				return e = j(e), Math.abs(e.x) <= Math.abs(this.x) && Math.abs(e.y) <= Math.abs(this.y);
			},
			toString: function() {
				return "Point(" + u(this.x) + ", " + u(this.y) + ")";
			}
		};
		function j(e, t, n) {
			return e instanceof A ? e : _(e) ? new A(e[0], e[1]) : e == null ? e : typeof e == "object" && "x" in e && "y" in e ? new A(e.x, e.y) : new A(e, t, n);
		}
		function re(e, t) {
			if (e) for (var n = t ? [e, t] : e, r = 0, i = n.length; r < i; r++) this.extend(n[r]);
		}
		re.prototype = {
			extend: function(e) {
				var t, n;
				if (!e) return this;
				if (e instanceof A || typeof e[0] == "number" || "x" in e) t = n = j(e);
				else if (e = ie(e), t = e.min, n = e.max, !t || !n) return this;
				return !this.min && !this.max ? (this.min = t.clone(), this.max = n.clone()) : (this.min.x = Math.min(t.x, this.min.x), this.max.x = Math.max(n.x, this.max.x), this.min.y = Math.min(t.y, this.min.y), this.max.y = Math.max(n.y, this.max.y)), this;
			},
			getCenter: function(e) {
				return j((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, e);
			},
			getBottomLeft: function() {
				return j(this.min.x, this.max.y);
			},
			getTopRight: function() {
				return j(this.max.x, this.min.y);
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
				return e = typeof e[0] == "number" || e instanceof A ? j(e) : ie(e), e instanceof re ? (t = e.min, n = e.max) : t = n = e, t.x >= this.min.x && n.x <= this.max.x && t.y >= this.min.y && n.y <= this.max.y;
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
				return ie(j(t.x - r, t.y - i), j(n.x + r, n.y + i));
			},
			equals: function(e) {
				return e ? (e = ie(e), this.min.equals(e.getTopLeft()) && this.max.equals(e.getBottomRight())) : !1;
			}
		};
		function ie(e, t) {
			return !e || e instanceof re ? e : new re(e, t);
		}
		function ae(e, t) {
			if (e) for (var n = t ? [e, t] : e, r = 0, i = n.length; r < i; r++) this.extend(n[r]);
		}
		ae.prototype = {
			extend: function(e) {
				var t = this._southWest, n = this._northEast, r, i;
				if (e instanceof M) r = e, i = e;
				else if (e instanceof ae) {
					if (r = e._southWest, i = e._northEast, !r || !i) return this;
				} else return e ? this.extend(N(e) || oe(e)) : this;
				return !t && !n ? (this._southWest = new M(r.lat, r.lng), this._northEast = new M(i.lat, i.lng)) : (t.lat = Math.min(r.lat, t.lat), t.lng = Math.min(r.lng, t.lng), n.lat = Math.max(i.lat, n.lat), n.lng = Math.max(i.lng, n.lng)), this;
			},
			pad: function(e) {
				var t = this._southWest, n = this._northEast, r = Math.abs(t.lat - n.lat) * e, i = Math.abs(t.lng - n.lng) * e;
				return new ae(new M(t.lat - r, t.lng - i), new M(n.lat + r, n.lng + i));
			},
			getCenter: function() {
				return new M((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2);
			},
			getSouthWest: function() {
				return this._southWest;
			},
			getNorthEast: function() {
				return this._northEast;
			},
			getNorthWest: function() {
				return new M(this.getNorth(), this.getWest());
			},
			getSouthEast: function() {
				return new M(this.getSouth(), this.getEast());
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
				e = typeof e[0] == "number" || e instanceof M || "lat" in e ? N(e) : oe(e);
				var t = this._southWest, n = this._northEast, r, i;
				return e instanceof ae ? (r = e.getSouthWest(), i = e.getNorthEast()) : r = i = e, r.lat >= t.lat && i.lat <= n.lat && r.lng >= t.lng && i.lng <= n.lng;
			},
			intersects: function(e) {
				e = oe(e);
				var t = this._southWest, n = this._northEast, r = e.getSouthWest(), i = e.getNorthEast(), a = i.lat >= t.lat && r.lat <= n.lat, o = i.lng >= t.lng && r.lng <= n.lng;
				return a && o;
			},
			overlaps: function(e) {
				e = oe(e);
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
				return e ? (e = oe(e), this._southWest.equals(e.getSouthWest(), t) && this._northEast.equals(e.getNorthEast(), t)) : !1;
			},
			isValid: function() {
				return !!(this._southWest && this._northEast);
			}
		};
		function oe(e, t) {
			return e instanceof ae ? e : new ae(e, t);
		}
		function M(e, t, n) {
			if (isNaN(e) || isNaN(t)) throw Error("Invalid LatLng object: (" + e + ", " + t + ")");
			this.lat = +e, this.lng = +t, n !== void 0 && (this.alt = +n);
		}
		M.prototype = {
			equals: function(e, t) {
				return e ? (e = N(e), Math.max(Math.abs(this.lat - e.lat), Math.abs(this.lng - e.lng)) <= (t === void 0 ? 1e-9 : t)) : !1;
			},
			toString: function(e) {
				return "LatLng(" + u(this.lat, e) + ", " + u(this.lng, e) + ")";
			},
			distanceTo: function(e) {
				return ce.distance(this, N(e));
			},
			wrap: function() {
				return ce.wrapLatLng(this);
			},
			toBounds: function(e) {
				var t = 180 * e / 40075017, n = t / Math.cos(Math.PI / 180 * this.lat);
				return oe([this.lat - t, this.lng - n], [this.lat + t, this.lng + n]);
			},
			clone: function() {
				return new M(this.lat, this.lng, this.alt);
			}
		};
		function N(e, t, n) {
			return e instanceof M ? e : _(e) && typeof e[0] != "object" ? e.length === 3 ? new M(e[0], e[1], e[2]) : e.length === 2 ? new M(e[0], e[1]) : null : e == null ? e : typeof e == "object" && "lat" in e ? new M(e.lat, "lng" in e ? e.lng : e.lon, e.alt) : t === void 0 ? null : new M(e, t, n);
		}
		var se = {
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
				return new re(this.transformation.transform(t.min, n), this.transformation.transform(t.max, n));
			},
			infinite: !1,
			wrapLatLng: function(e) {
				var t = this.wrapLng ? c(e.lng, this.wrapLng, !0) : e.lng, n = this.wrapLat ? c(e.lat, this.wrapLat, !0) : e.lat, r = e.alt;
				return new M(n, t, r);
			},
			wrapLatLngBounds: function(e) {
				var t = e.getCenter(), n = this.wrapLatLng(t), r = t.lat - n.lat, i = t.lng - n.lng;
				if (r === 0 && i === 0) return e;
				var a = e.getSouthWest(), o = e.getNorthEast();
				return new ae(new M(a.lat - r, a.lng - i), new M(o.lat - r, o.lng - i));
			}
		}, ce = n({}, se, {
			wrapLng: [-180, 180],
			R: 6371e3,
			distance: function(e, t) {
				var n = Math.PI / 180, r = e.lat * n, i = t.lat * n, a = Math.sin((t.lat - e.lat) * n / 2), o = Math.sin((t.lng - e.lng) * n / 2), s = a * a + Math.cos(r) * Math.cos(i) * o * o, c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
				return this.R * c;
			}
		}), le = 6378137, ue = {
			R: le,
			MAX_LATITUDE: 85.0511287798,
			project: function(e) {
				var t = Math.PI / 180, n = this.MAX_LATITUDE, r = Math.max(Math.min(n, e.lat), -n), i = Math.sin(r * t);
				return new A(this.R * e.lng * t, this.R * Math.log((1 + i) / (1 - i)) / 2);
			},
			unproject: function(e) {
				var t = 180 / Math.PI;
				return new M((2 * Math.atan(Math.exp(e.y / this.R)) - Math.PI / 2) * t, e.x * t / this.R);
			},
			bounds: (function() {
				var e = le * Math.PI;
				return new re([-e, -e], [e, e]);
			})()
		};
		function de(e, t, n, r) {
			_(e) ? (this._a = e[0], this._b = e[1], this._c = e[2], this._d = e[3]) : (this._a = e, this._b = t, this._c = n, this._d = r);
		}
		de.prototype = {
			transform: function(e, t) {
				return this._transform(e.clone(), t);
			},
			_transform: function(e, t) {
				return t ||= 1, e.x = t * (this._a * e.x + this._b), e.y = t * (this._c * e.y + this._d), e;
			},
			untransform: function(e, t) {
				return t ||= 1, new A((e.x / t - this._b) / this._a, (e.y / t - this._d) / this._c);
			}
		};
		function fe(e, t, n, r) {
			return new de(e, t, n, r);
		}
		var pe = n({}, ce, {
			code: "EPSG:3857",
			projection: ue,
			transformation: function() {
				var e = .5 / (Math.PI * ue.R);
				return fe(e, .5, -e, .5);
			}()
		}), me = n({}, pe, { code: "EPSG:900913" });
		function he(e) {
			return document.createElementNS("http://www.w3.org/2000/svg", e);
		}
		function ge(e, t) {
			for (var n = "", r = 0, i, a = e.length, o, s, c; r < a; r++) {
				for (s = e[r], i = 0, o = s.length; i < o; i++) c = s[i], n += (i ? "L" : "M") + c.x + " " + c.y;
				n += t ? R.svg ? "z" : "x" : "";
			}
			return n || "M0 0";
		}
		var _e = document.documentElement.style, ve = "ActiveXObject" in window, ye = ve && !document.addEventListener, be = "msLaunchUri" in navigator && !("documentMode" in document), xe = Ze("webkit"), Se = Ze("android"), Ce = Ze("android 2") || Ze("android 3"), we = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), Te = Se && Ze("Google") && we < 537 && !("AudioNode" in window), P = !!window.opera, Ee = !be && Ze("chrome"), De = Ze("gecko") && !xe && !P && !ve, Oe = !Ee && Ze("safari"), ke = Ze("phantom"), Ae = "OTransition" in _e, je = navigator.platform.indexOf("Win") === 0, Me = ve && "transition" in _e, F = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !Ce, Ne = "MozPerspective" in _e, Pe = !window.L_DISABLE_3D && (Me || F || Ne) && !Ae && !ke, Fe = typeof orientation < "u" || Ze("mobile"), Ie = Fe && xe, I = Fe && F, Le = !window.PointerEvent && window.MSPointerEvent, Re = !!(window.PointerEvent || Le), ze = "ontouchstart" in window || !!window.TouchEvent, Be = !window.L_NO_TOUCH && (ze || Re), Ve = Fe && P, He = Fe && De, Ue = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, We = function() {
			var e = !1;
			try {
				var t = Object.defineProperty({}, "passive", { get: function() {
					e = !0;
				} });
				window.addEventListener("testPassiveEventSupport", l, t), window.removeEventListener("testPassiveEventSupport", l, t);
			} catch {}
			return e;
		}(), Ge = function() {
			return !!document.createElement("canvas").getContext;
		}(), Ke = !!(document.createElementNS && he("svg").createSVGRect), qe = !!Ke && (function() {
			var e = document.createElement("div");
			return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
		})(), Je = !Ke && function() {
			try {
				var e = document.createElement("div");
				e.innerHTML = "<v:shape adj=\"1\"/>";
				var t = e.firstChild;
				return t.style.behavior = "url(#default#VML)", t && typeof t.adj == "object";
			} catch {
				return !1;
			}
		}(), Ye = navigator.platform.indexOf("Mac") === 0, Xe = navigator.platform.indexOf("Linux") === 0;
		function Ze(e) {
			return navigator.userAgent.toLowerCase().indexOf(e) >= 0;
		}
		var R = {
			ie: ve,
			ielt9: ye,
			edge: be,
			webkit: xe,
			android: Se,
			android23: Ce,
			androidStock: Te,
			opera: P,
			chrome: Ee,
			gecko: De,
			safari: Oe,
			phantom: ke,
			opera12: Ae,
			win: je,
			ie3d: Me,
			webkit3d: F,
			gecko3d: Ne,
			any3d: Pe,
			mobile: Fe,
			mobileWebkit: Ie,
			mobileWebkit3d: I,
			msPointer: Le,
			pointer: Re,
			touch: Be,
			touchNative: ze,
			mobileOpera: Ve,
			mobileGecko: He,
			retina: Ue,
			passiveEvents: We,
			canvas: Ge,
			svg: Ke,
			vml: Je,
			inlineSvg: qe,
			mac: Ye,
			linux: Xe
		}, Qe = R.msPointer ? "MSPointerDown" : "pointerdown", $e = R.msPointer ? "MSPointerMove" : "pointermove", et = R.msPointer ? "MSPointerUp" : "pointerup", tt = R.msPointer ? "MSPointerCancel" : "pointercancel", nt = {
			touchstart: Qe,
			touchmove: $e,
			touchend: et,
			touchcancel: tt
		}, rt = {
			touchstart: pt,
			touchmove: ft,
			touchend: ft,
			touchcancel: ft
		}, it = {}, at = !1;
		function ot(e, t, n) {
			return t === "touchstart" && dt(), rt[t] ? (n = rt[t].bind(this, n), e.addEventListener(nt[t], n, !1), n) : (console.warn("wrong event specified:", t), l);
		}
		function st(e, t, n) {
			nt[t] ? e.removeEventListener(nt[t], n, !1) : console.warn("wrong event specified:", t);
		}
		function ct(e) {
			it[e.pointerId] = e;
		}
		function lt(e) {
			it[e.pointerId] && (it[e.pointerId] = e);
		}
		function ut(e) {
			delete it[e.pointerId];
		}
		function dt() {
			at ||= (document.addEventListener(Qe, ct, !0), document.addEventListener($e, lt, !0), document.addEventListener(et, ut, !0), document.addEventListener(tt, ut, !0), !0);
		}
		function ft(e, t) {
			if (t.pointerType !== (t.MSPOINTER_TYPE_MOUSE || "mouse")) {
				for (var n in t.touches = [], it) t.touches.push(it[n]);
				t.changedTouches = [t], e(t);
			}
		}
		function pt(e, t) {
			t.MSPOINTER_TYPE_TOUCH && t.pointerType === t.MSPOINTER_TYPE_TOUCH && rn(t), ft(e, t);
		}
		function mt(e) {
			var t = {}, n, r;
			for (r in e) n = e[r], t[r] = n && n.bind ? n.bind(e) : n;
			return e = t, t.type = "dblclick", t.detail = 2, t.isTrusted = !1, t._simulated = !0, t;
		}
		var ht = 200;
		function gt(e, t) {
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
						a - n <= ht ? (r++, r === 2 && t(mt(e))) : r = 1, n = a;
					}
				}
			}
			return e.addEventListener("click", i), {
				dblclick: t,
				simDblclick: i
			};
		}
		function _t(e, t) {
			e.removeEventListener("dblclick", t.dblclick), e.removeEventListener("click", t.simDblclick);
		}
		var vt = Nt([
			"transform",
			"webkitTransform",
			"OTransform",
			"MozTransform",
			"msTransform"
		]), yt = Nt([
			"webkitTransition",
			"transition",
			"OTransition",
			"MozTransition",
			"msTransition"
		]), bt = yt === "webkitTransition" || yt === "OTransition" ? yt + "End" : "transitionend";
		function xt(e) {
			return typeof e == "string" ? document.getElementById(e) : e;
		}
		function St(e, t) {
			var n = e.style[t] || e.currentStyle && e.currentStyle[t];
			if ((!n || n === "auto") && document.defaultView) {
				var r = document.defaultView.getComputedStyle(e, null);
				n = r ? r[t] : null;
			}
			return n === "auto" ? null : n;
		}
		function Ct(e, t, n) {
			var r = document.createElement(e);
			return r.className = t || "", n && n.appendChild(r), r;
		}
		function wt(e) {
			var t = e.parentNode;
			t && t.removeChild(e);
		}
		function z(e) {
			for (; e.firstChild;) e.removeChild(e.firstChild);
		}
		function Tt(e) {
			var t = e.parentNode;
			t && t.lastChild !== e && t.appendChild(e);
		}
		function Et(e) {
			var t = e.parentNode;
			t && t.firstChild !== e && t.insertBefore(e, t.firstChild);
		}
		function Dt(e, t) {
			if (e.classList !== void 0) return e.classList.contains(t);
			var n = jt(e);
			return n.length > 0 && RegExp("(^|\\s)" + t + "(\\s|$)").test(n);
		}
		function Ot(e, t) {
			if (e.classList !== void 0) for (var n = f(t), r = 0, i = n.length; r < i; r++) e.classList.add(n[r]);
			else if (!Dt(e, t)) {
				var a = jt(e);
				At(e, (a ? a + " " : "") + t);
			}
		}
		function kt(e, t) {
			e.classList === void 0 ? At(e, d((" " + jt(e) + " ").replace(" " + t + " ", " "))) : e.classList.remove(t);
		}
		function At(e, t) {
			e.className.baseVal === void 0 ? e.className = t : e.className.baseVal = t;
		}
		function jt(e) {
			return e.correspondingElement && (e = e.correspondingElement), e.className.baseVal === void 0 ? e.className : e.className.baseVal;
		}
		function B(e, t) {
			"opacity" in e.style ? e.style.opacity = t : "filter" in e.style && Mt(e, t);
		}
		function Mt(e, t) {
			var n = !1, r = "DXImageTransform.Microsoft.Alpha";
			try {
				n = e.filters.item(r);
			} catch {
				if (t === 1) return;
			}
			t = Math.round(t * 100), n ? (n.Enabled = t !== 100, n.Opacity = t) : e.style.filter += " progid:" + r + "(opacity=" + t + ")";
		}
		function Nt(e) {
			for (var t = document.documentElement.style, n = 0; n < e.length; n++) if (e[n] in t) return e[n];
			return !1;
		}
		function Pt(e, t, n) {
			var r = t || new A(0, 0);
			e.style[vt] = (R.ie3d ? "translate(" + r.x + "px," + r.y + "px)" : "translate3d(" + r.x + "px," + r.y + "px,0)") + (n ? " scale(" + n + ")" : "");
		}
		function Ft(e, t) {
			e._leaflet_pos = t, R.any3d ? Pt(e, t) : (e.style.left = t.x + "px", e.style.top = t.y + "px");
		}
		function It(e) {
			return e._leaflet_pos || new A(0, 0);
		}
		var Lt, Rt, zt;
		if ("onselectstart" in document) Lt = function() {
			V(window, "selectstart", rn);
		}, Rt = function() {
			Zt(window, "selectstart", rn);
		};
		else {
			var Bt = Nt([
				"userSelect",
				"WebkitUserSelect",
				"OUserSelect",
				"MozUserSelect",
				"msUserSelect"
			]);
			Lt = function() {
				if (Bt) {
					var e = document.documentElement.style;
					zt = e[Bt], e[Bt] = "none";
				}
			}, Rt = function() {
				Bt && (document.documentElement.style[Bt] = zt, zt = void 0);
			};
		}
		function Vt() {
			V(window, "dragstart", rn);
		}
		function Ht() {
			Zt(window, "dragstart", rn);
		}
		var Ut, Wt;
		function Gt(e) {
			for (; e.tabIndex === -1;) e = e.parentNode;
			e.style && (Kt(), Ut = e, Wt = e.style.outlineStyle, e.style.outlineStyle = "none", V(window, "keydown", Kt));
		}
		function Kt() {
			Ut && (Ut.style.outlineStyle = Wt, Ut = void 0, Wt = void 0, Zt(window, "keydown", Kt));
		}
		function qt(e) {
			do
				e = e.parentNode;
			while ((!e.offsetWidth || !e.offsetHeight) && e !== document.body);
			return e;
		}
		function Jt(e) {
			var t = e.getBoundingClientRect();
			return {
				x: t.width / e.offsetWidth || 1,
				y: t.height / e.offsetHeight || 1,
				boundingClientRect: t
			};
		}
		var Yt = {
			__proto__: null,
			TRANSFORM: vt,
			TRANSITION: yt,
			TRANSITION_END: bt,
			get: xt,
			getStyle: St,
			create: Ct,
			remove: wt,
			empty: z,
			toFront: Tt,
			toBack: Et,
			hasClass: Dt,
			addClass: Ot,
			removeClass: kt,
			setClass: At,
			getClass: jt,
			setOpacity: B,
			testProp: Nt,
			setTransform: Pt,
			setPosition: Ft,
			getPosition: It,
			get disableTextSelection() {
				return Lt;
			},
			get enableTextSelection() {
				return Rt;
			},
			disableImageDrag: Vt,
			enableImageDrag: Ht,
			preventOutline: Gt,
			restoreOutline: Kt,
			getSizedParentNode: qt,
			getScale: Jt
		};
		function V(e, t, n, r) {
			if (t && typeof t == "object") for (var i in t) U(e, i, t[i], n);
			else {
				t = f(t);
				for (var a = 0, o = t.length; a < o; a++) U(e, t[a], n, r);
			}
			return this;
		}
		var Xt = "_leaflet_events";
		function Zt(e, t, n, r) {
			if (arguments.length === 1) H(e), delete e[Xt];
			else if (t && typeof t == "object") for (var i in t) $t(e, i, t[i], n);
			else if (t = f(t), arguments.length === 2) H(e, function(e) {
				return v(t, e) !== -1;
			});
			else for (var a = 0, o = t.length; a < o; a++) $t(e, t[a], n, r);
			return this;
		}
		function H(e, t) {
			for (var n in e[Xt]) {
				var r = n.split(/\d/)[0];
				(!t || t(r)) && $t(e, r, null, null, n);
			}
		}
		var Qt = {
			mouseenter: "mouseover",
			mouseleave: "mouseout",
			wheel: !("onwheel" in window) && "mousewheel"
		};
		function U(e, t, n, r) {
			var i = t + o(n) + (r ? "_" + o(r) : "");
			if (e[Xt] && e[Xt][i]) return this;
			var a = function(t) {
				return n.call(r || e, t || window.event);
			}, s = a;
			!R.touchNative && R.pointer && t.indexOf("touch") === 0 ? a = ot(e, t, a) : R.touch && t === "dblclick" ? a = gt(e, a) : "addEventListener" in e ? t === "touchstart" || t === "touchmove" || t === "wheel" || t === "mousewheel" ? e.addEventListener(Qt[t] || t, a, R.passiveEvents ? { passive: !1 } : !1) : t === "mouseenter" || t === "mouseleave" ? (a = function(t) {
				t ||= window.event, un(e, t) && s(t);
			}, e.addEventListener(Qt[t], a, !1)) : e.addEventListener(t, s, !1) : e.attachEvent("on" + t, a), e[Xt] = e[Xt] || {}, e[Xt][i] = a;
		}
		function $t(e, t, n, r, i) {
			i ||= t + o(n) + (r ? "_" + o(r) : "");
			var a = e[Xt] && e[Xt][i];
			if (!a) return this;
			!R.touchNative && R.pointer && t.indexOf("touch") === 0 ? st(e, t, a) : R.touch && t === "dblclick" ? _t(e, a) : "removeEventListener" in e ? e.removeEventListener(Qt[t] || t, a, !1) : e.detachEvent("on" + t, a), e[Xt][i] = null;
		}
		function en(e) {
			return e.stopPropagation ? e.stopPropagation() : e.originalEvent ? e.originalEvent._stopped = !0 : e.cancelBubble = !0, this;
		}
		function tn(e) {
			return U(e, "wheel", en), this;
		}
		function nn(e) {
			return V(e, "mousedown touchstart dblclick contextmenu", en), e._leaflet_disable_click = !0, this;
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
			if (!t) return new A(e.clientX, e.clientY);
			var n = Jt(t), r = n.boundingClientRect;
			return new A((e.clientX - r.left) / n.x - t.clientLeft, (e.clientY - r.top) / n.y - t.clientTop);
		}
		var cn = R.linux && R.chrome ? window.devicePixelRatio : R.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
		function ln(e) {
			return R.edge ? e.wheelDeltaY / 2 : e.deltaY && e.deltaMode === 0 ? -e.deltaY / cn : e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : e.deltaX || e.deltaZ ? 0 : e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : e.detail ? e.detail / -32765 * 60 : 0;
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
			on: V,
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
			addListener: V,
			removeListener: Zt
		}, fn = k.extend({
			run: function(e, t, n, r) {
				this.stop(), this._el = e, this._inProgress = !0, this._duration = n || .25, this._easeOutPower = 1 / Math.max(r || .5, .2), this._startPos = It(e), this._offset = t.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
			},
			stop: function() {
				this._inProgress && (this._step(!0), this._complete());
			},
			_animate: function() {
				this._animId = T(this._animate, this), this._step();
			},
			_step: function(e) {
				var t = +/* @__PURE__ */ new Date() - this._startTime, n = this._duration * 1e3;
				t < n ? this._runFrame(this._easeOut(t / n), e) : (this._runFrame(1), this._complete());
			},
			_runFrame: function(e, t) {
				var n = this._startPos.add(this._offset.multiplyBy(e));
				t && n._round(), Ft(this._el, n), this.fire("step");
			},
			_complete: function() {
				E(this._animId), this._inProgress = !1, this.fire("end");
			},
			_easeOut: function(e) {
				return 1 - (1 - e) ** this._easeOutPower;
			}
		}), pn = k.extend({
			options: {
				crs: pe,
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
				t = p(this, t), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(e), this._initLayout(), this._onResize = i(this._onResize, this), this._initEvents(), t.maxBounds && this.setMaxBounds(t.maxBounds), t.zoom !== void 0 && (this._zoom = this._limitZoom(t.zoom)), t.center && t.zoom !== void 0 && this.setView(N(t.center), t.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = yt && R.any3d && !R.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), V(this._proxy, bt, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
			},
			setView: function(e, t, r) {
				return t = t === void 0 ? this._zoom : this._limitZoom(t), e = this._limitCenter(N(e), t, this.options.maxBounds), r ||= {}, this._stop(), this._loaded && !r.reset && r !== !0 && (r.animate !== void 0 && (r.zoom = n({ animate: r.animate }, r.zoom), r.pan = n({
					animate: r.animate,
					duration: r.duration
				}, r.pan)), this._zoom === t ? this._tryAnimatedPan(e, r.pan) : this._tryAnimatedZoom && this._tryAnimatedZoom(e, t, r.zoom)) ? (clearTimeout(this._sizeTimer), this) : (this._resetView(e, t, r.pan && r.pan.noMoveStart), this);
			},
			setZoom: function(e, t) {
				return this._loaded ? this.setView(this.getCenter(), e, { zoom: t }) : (this._zoom = e, this);
			},
			zoomIn: function(e, t) {
				return e ||= R.any3d ? this.options.zoomDelta : 1, this.setZoom(this._zoom + e, t);
			},
			zoomOut: function(e, t) {
				return e ||= R.any3d ? this.options.zoomDelta : 1, this.setZoom(this._zoom - e, t);
			},
			setZoomAround: function(e, t, n) {
				var r = this.getZoomScale(t), i = this.getSize().divideBy(2), a = (e instanceof A ? e : this.latLngToContainerPoint(e)).subtract(i).multiplyBy(1 - 1 / r), o = this.containerPointToLatLng(i.add(a));
				return this.setView(o, t, { zoom: n });
			},
			_getBoundsCenterZoom: function(e, t) {
				t ||= {}, e = e.getBounds ? e.getBounds() : oe(e);
				var n = j(t.paddingTopLeft || t.padding || [0, 0]), r = j(t.paddingBottomRight || t.padding || [0, 0]), i = this.getBoundsZoom(e, !1, n.add(r));
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
				if (e = oe(e), !e.isValid()) throw Error("Bounds are not valid.");
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
				if (e = j(e).round(), t ||= {}, !e.x && !e.y) return this.fire("moveend");
				if (t.animate !== !0 && !this.getSize().contains(e)) return this._resetView(this.unproject(this.project(this.getCenter()).add(e)), this.getZoom()), this;
				if (this._panAnim || (this._panAnim = new fn(), this._panAnim.on({
					step: this._onPanTransitionStep,
					end: this._onPanTransitionEnd
				}, this)), t.noMoveStart || this.fire("movestart"), t.animate !== !1) {
					Ot(this._mapPane, "leaflet-pan-anim");
					var n = this._getMapPanePos().subtract(e).round();
					this._panAnim.run(this._mapPane, n, t.duration || .25, t.easeLinearity);
				} else this._rawPanBy(e), this.fire("move").fire("moveend");
				return this;
			},
			flyTo: function(e, t, n) {
				if (n ||= {}, n.animate === !1 || !R.any3d) return this.setView(e, t, n);
				this._stop();
				var r = this.project(this.getCenter()), i = this.project(e), a = this.getSize(), o = this._zoom;
				e = N(e), t = t === void 0 ? o : t;
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
					n <= 1 ? (this._flyToFrame = T(C, this), this._move(this.unproject(r.add(i.subtract(r).multiplyBy(v(a) / l)), o), this.getScaleZoom(s / _(a), o), { flyTo: !0 })) : this._move(e, t)._moveEnd(!0);
				}
				return this._moveStart(!0, n.noMoveStart), C.call(this), this;
			},
			flyToBounds: function(e, t) {
				var n = this._getBoundsCenterZoom(e, t);
				return this.flyTo(n.center, n.zoom, t);
			},
			setMaxBounds: function(e) {
				return e = oe(e), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), e.isValid() ? (this.options.maxBounds = e, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
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
				var n = this.getCenter(), r = this._limitCenter(n, this._zoom, oe(e));
				return n.equals(r) || this.panTo(r, t), this._enforcingBounds = !1, this;
			},
			panInside: function(e, t) {
				t ||= {};
				var n = j(t.paddingTopLeft || t.padding || [0, 0]), r = j(t.paddingBottomRight || t.padding || [0, 0]), i = this.project(this.getCenter()), a = this.project(e), o = this.getPixelBounds(), s = ie([o.min.add(n), o.max.subtract(r)]), c = s.getSize();
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
					var t = e.coords.latitude, n = e.coords.longitude, r = new M(t, n), i = r.toBounds(e.coords.accuracy * 2), a = this._locateOptions;
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
				for (var e in this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), wt(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest &&= (E(this._resizeRequest), null), this._clearHandlers(), this._loaded && this.fire("unload"), this._layers) this._layers[e].remove();
				for (e in this._panes) wt(this._panes[e]);
				return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
			},
			createPane: function(e, t) {
				var n = Ct("div", "leaflet-pane" + (e ? " leaflet-" + e.replace("Pane", "") + "-pane" : ""), t || this._mapPane);
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
				return new ae(this.unproject(e.getBottomLeft()), this.unproject(e.getTopRight()));
			},
			getMinZoom: function() {
				return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
			},
			getMaxZoom: function() {
				return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? Infinity : this._layersMaxZoom : this.options.maxZoom;
			},
			getBoundsZoom: function(e, t, n) {
				e = oe(e), n = j(n || [0, 0]);
				var r = this.getZoom() || 0, i = this.getMinZoom(), a = this.getMaxZoom(), o = e.getNorthWest(), s = e.getSouthEast(), c = this.getSize().subtract(n), l = ie(this.project(s, r), this.project(o, r)).getSize(), u = R.any3d ? this.options.zoomSnap : 1, d = c.x / l.x, f = c.y / l.y, p = t ? Math.max(d, f) : Math.min(d, f);
				return r = this.getScaleZoom(p, r), u && (r = Math.round(r / (u / 100)) * (u / 100), r = t ? Math.ceil(r / u) * u : Math.floor(r / u) * u), Math.max(i, Math.min(a, r));
			},
			getSize: function() {
				return (!this._size || this._sizeChanged) && (this._size = new A(this._container.clientWidth || 0, this._container.clientHeight || 0), this._sizeChanged = !1), this._size.clone();
			},
			getPixelBounds: function(e, t) {
				var n = this._getTopLeftPoint(e, t);
				return new re(n, n.add(this.getSize()));
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
				return t = t === void 0 ? this._zoom : t, this.options.crs.latLngToPoint(N(e), t);
			},
			unproject: function(e, t) {
				return t = t === void 0 ? this._zoom : t, this.options.crs.pointToLatLng(j(e), t);
			},
			layerPointToLatLng: function(e) {
				var t = j(e).add(this.getPixelOrigin());
				return this.unproject(t);
			},
			latLngToLayerPoint: function(e) {
				return this.project(N(e))._round()._subtract(this.getPixelOrigin());
			},
			wrapLatLng: function(e) {
				return this.options.crs.wrapLatLng(N(e));
			},
			wrapLatLngBounds: function(e) {
				return this.options.crs.wrapLatLngBounds(oe(e));
			},
			distance: function(e, t) {
				return this.options.crs.distance(N(e), N(t));
			},
			containerPointToLayerPoint: function(e) {
				return j(e).subtract(this._getMapPanePos());
			},
			layerPointToContainerPoint: function(e) {
				return j(e).add(this._getMapPanePos());
			},
			containerPointToLatLng: function(e) {
				var t = this.containerPointToLayerPoint(j(e));
				return this.layerPointToLatLng(t);
			},
			latLngToContainerPoint: function(e) {
				return this.layerPointToContainerPoint(this.latLngToLayerPoint(N(e)));
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
				var t = this._container = xt(e);
				if (!t) throw Error("Map container not found.");
				if (t._leaflet_id) throw Error("Map container is already initialized.");
				V(t, "scroll", this._onScroll, this), this._containerId = o(t);
			},
			_initLayout: function() {
				var e = this._container;
				this._fadeAnimated = this.options.fadeAnimation && R.any3d, Ot(e, "leaflet-container" + (R.touch ? " leaflet-touch" : "") + (R.retina ? " leaflet-retina" : "") + (R.ielt9 ? " leaflet-oldie" : "") + (R.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
				var t = St(e, "position");
				t !== "absolute" && t !== "relative" && t !== "fixed" && t !== "sticky" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
			},
			_initPanes: function() {
				var e = this._panes = {};
				this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), Ft(this._mapPane, new A(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (Ot(e.markerPane, "leaflet-zoom-hide"), Ot(e.shadowPane, "leaflet-zoom-hide"));
			},
			_resetView: function(e, t, n) {
				Ft(this._mapPane, new A(0, 0));
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
				return E(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
			},
			_rawPanBy: function(e) {
				Ft(this._mapPane, this._getMapPanePos().subtract(e));
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
				var t = e ? Zt : V;
				t(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && t(window, "resize", this._onResize, this), R.any3d && this.options.transform3DLimit && (e ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
			},
			_onResize: function() {
				E(this._resizeRequest), this._resizeRequest = T(function() {
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
					n === "mousedown" && Gt(t), this._fireDOMEvent(e, n);
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
				return It(this._mapPane) || new A(0, 0);
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
				var r = this.project(e, t), i = this.getSize().divideBy(2), a = new re(r.subtract(i), r.add(i)), o = this._getBoundsOffset(a, n, t);
				return Math.abs(o.x) <= 1 && Math.abs(o.y) <= 1 ? e : this.unproject(r.add(o), t);
			},
			_limitOffset: function(e, t) {
				if (!t) return e;
				var n = this.getPixelBounds(), r = new re(n.min.add(e), n.max.add(e));
				return e.add(this._getBoundsOffset(r, t));
			},
			_getBoundsOffset: function(e, t, n) {
				var r = ie(this.project(t.getNorthEast(), n), this.project(t.getSouthWest(), n)), i = r.min.subtract(e.min), a = r.max.subtract(e.max);
				return new A(this._rebound(i.x, -a.x), this._rebound(i.y, -a.y));
			},
			_rebound: function(e, t) {
				return e + t > 0 ? Math.round(e - t) / 2 : Math.max(0, Math.ceil(e)) - Math.max(0, Math.floor(t));
			},
			_limitZoom: function(e) {
				var t = this.getMinZoom(), n = this.getMaxZoom(), r = R.any3d ? this.options.zoomSnap : 1;
				return r && (e = Math.round(e / r) * r), Math.max(t, Math.min(n, e));
			},
			_onPanTransitionStep: function() {
				this.fire("move");
			},
			_onPanTransitionEnd: function() {
				kt(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
			},
			_tryAnimatedPan: function(e, t) {
				var n = this._getCenterOffset(e)._trunc();
				return (t && t.animate) !== !0 && !this.getSize().contains(n) ? !1 : (this.panBy(n, t), !0);
			},
			_createAnimProxy: function() {
				var e = this._proxy = Ct("div", "leaflet-proxy leaflet-zoom-animated");
				this._panes.mapPane.appendChild(e), this.on("zoomanim", function(e) {
					var t = vt, n = this._proxy.style[t];
					Pt(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1)), n === this._proxy.style[t] && this._animatingZoom && this._onZoomTransitionEnd();
				}, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
			},
			_destroyAnimProxy: function() {
				wt(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
			},
			_animMoveEnd: function() {
				var e = this.getCenter(), t = this.getZoom();
				Pt(this._proxy, this.project(e, t), this.getZoomScale(t, 1));
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
				return n.animate !== !0 && !this.getSize().contains(i) ? !1 : (T(function() {
					this._moveStart(!0, n.noMoveStart || !1)._animateZoom(e, t, !0);
				}, this), !0);
			},
			_animateZoom: function(e, t, n, r) {
				this._mapPane && (n && (this._animatingZoom = !0, this._animateToCenter = e, this._animateToZoom = t, Ot(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
					center: e,
					zoom: t,
					noUpdate: r
				}), this._tempFireZoomEvent ||= this._zoom !== this._animateToZoom, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(i(this._onZoomTransitionEnd, this), 250));
			},
			_onZoomTransitionEnd: function() {
				this._animatingZoom && (this._mapPane && kt(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
			}
		});
		function mn(e, t) {
			return new pn(e, t);
		}
		var hn = O.extend({
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
				return Ot(t, "leaflet-control"), n.indexOf("bottom") === -1 ? r.appendChild(t) : r.insertBefore(t, r.firstChild), this._map.on("unload", this.remove, this), this;
			},
			remove: function() {
				return this._map &&= (wt(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), null), this;
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
				var e = this._controlCorners = {}, t = "leaflet-", n = this._controlContainer = Ct("div", t + "control-container", this._container);
				function r(r, i) {
					var a = t + r + " " + t + i;
					e[r + i] = Ct("div", a, n);
				}
				r("top", "left"), r("top", "right"), r("bottom", "left"), r("bottom", "right");
			},
			_clearControlPos: function() {
				for (var e in this._controlCorners) wt(this._controlCorners[e]);
				wt(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
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
				Ot(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
				var e = this._map.getSize().y - (this._container.offsetTop + 50);
				return e < this._section.clientHeight ? (Ot(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = e + "px") : kt(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
			},
			collapse: function() {
				return kt(this._container, "leaflet-control-layers-expanded"), this;
			},
			_initLayout: function() {
				var e = "leaflet-control-layers", t = this._container = Ct("div", e), n = this.options.collapsed;
				t.setAttribute("aria-haspopup", !0), nn(t), tn(t);
				var r = this._section = Ct("section", e + "-list");
				n && (this._map.on("click", this.collapse, this), V(t, {
					mouseenter: this._expandSafely,
					mouseleave: this.collapse
				}, this));
				var i = this._layersLink = Ct("a", e + "-toggle", t);
				i.href = "#", i.title = "Layers", i.setAttribute("role", "button"), V(i, {
					keydown: function(e) {
						e.keyCode === 13 && this._expandSafely();
					},
					click: function(e) {
						rn(e), this._expandSafely();
					}
				}, this), n || this.expand(), this._baseLayersList = Ct("div", e + "-base", r), this._separator = Ct("div", e + "-separator", r), this._overlaysList = Ct("div", e + "-overlays", r), t.appendChild(r);
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
				z(this._baseLayersList), z(this._overlaysList), this._layerControlInputs = [];
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
				e.overlay ? (r = document.createElement("input"), r.type = "checkbox", r.className = "leaflet-control-layers-selector", r.defaultChecked = n) : r = this._createRadioElement("leaflet-base-layers_" + o(this), n), this._layerControlInputs.push(r), r.layerId = o(e.layer), V(r, "click", this._onInputClick, this);
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
				this._preventClick = !0, V(e, "click", rn), this.expand();
				var t = this;
				setTimeout(function() {
					Zt(e, "click", rn), t._preventClick = !1;
				});
			}
		}), W = function(e, t, n) {
			return new _n(e, t, n);
		}, G = hn.extend({
			options: {
				position: "topleft",
				zoomInText: "<span aria-hidden=\"true\">+</span>",
				zoomInTitle: "Zoom in",
				zoomOutText: "<span aria-hidden=\"true\">&#x2212;</span>",
				zoomOutTitle: "Zoom out"
			},
			onAdd: function(e) {
				var t = "leaflet-control-zoom", n = Ct("div", t + " leaflet-bar"), r = this.options;
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
				var a = Ct("a", n, r);
				return a.innerHTML = e, a.href = "#", a.title = t, a.setAttribute("role", "button"), a.setAttribute("aria-label", t), nn(a), V(a, "click", an), V(a, "click", i, this), V(a, "click", this._refocusOnMap, this), a;
			},
			_updateDisabled: function() {
				var e = this._map, t = "leaflet-disabled";
				kt(this._zoomInButton, t), kt(this._zoomOutButton, t), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || e._zoom === e.getMinZoom()) && (Ot(this._zoomOutButton, t), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || e._zoom === e.getMaxZoom()) && (Ot(this._zoomInButton, t), this._zoomInButton.setAttribute("aria-disabled", "true"));
			}
		});
		pn.mergeOptions({ zoomControl: !0 }), pn.addInitHook(function() {
			this.options.zoomControl && (this.zoomControl = new G(), this.addControl(this.zoomControl));
		});
		var K = function(e) {
			return new G(e);
		}, q = hn.extend({
			options: {
				position: "bottomleft",
				maxWidth: 100,
				metric: !0,
				imperial: !0
			},
			onAdd: function(e) {
				var t = "leaflet-control-scale", n = Ct("div", t), r = this.options;
				return this._addScales(r, t + "-line", n), e.on(r.updateWhenIdle ? "moveend" : "move", this._update, this), e.whenReady(this._update, this), n;
			},
			onRemove: function(e) {
				e.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
			},
			_addScales: function(e, t, n) {
				e.metric && (this._mScale = Ct("div", t, n)), e.imperial && (this._iScale = Ct("div", t, n));
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
		}), vn = function(e) {
			return new q(e);
		}, yn = hn.extend({
			options: {
				position: "bottomright",
				prefix: "<a href=\"https://leafletjs.com\" title=\"A JavaScript library for interactive maps\">" + (R.inlineSvg ? "<svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"8\" viewBox=\"0 0 12 8\" class=\"leaflet-attribution-flag\"><path fill=\"#4C7BE1\" d=\"M0 0h12v4H0z\"/><path fill=\"#FFD500\" d=\"M0 4h12v3H0z\"/><path fill=\"#E0BC00\" d=\"M0 7h12v1H0z\"/></svg> " : "") + "Leaflet</a>"
			},
			initialize: function(e) {
				p(this, e), this._attributions = {};
			},
			onAdd: function(e) {
				for (var t in e.attributionControl = this, this._container = Ct("div", "leaflet-control-attribution"), nn(this._container), e._layers) e._layers[t].getAttribution && this.addAttribution(e._layers[t].getAttribution());
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
		}), hn.Layers = _n, hn.Zoom = G, hn.Scale = q, hn.Attribution = yn, gn.layers = W, gn.zoom = K, gn.scale = vn, gn.attribution = function(e) {
			return new yn(e);
		};
		var bn = O.extend({
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
		var xn = { Events: te }, Sn = R.touch ? "touchstart mousedown" : "mousedown", Cn = k.extend({
			options: { clickTolerance: 3 },
			initialize: function(e, t, n, r) {
				p(this, r), this._element = e, this._dragStartTarget = t || e, this._preventOutline = n;
			},
			enable: function() {
				this._enabled ||= (V(this._dragStartTarget, Sn, this._onDown, this), !0);
			},
			disable: function() {
				this._enabled && (Cn._dragging === this && this.finishDrag(!0), Zt(this._dragStartTarget, Sn, this._onDown, this), this._enabled = !1, this._moved = !1);
			},
			_onDown: function(e) {
				if (this._enabled && (this._moved = !1, !Dt(this._element, "leaflet-zoom-anim"))) {
					if (e.touches && e.touches.length !== 1) Cn._dragging === this && this.finishDrag();
					else if (!(Cn._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) && (Cn._dragging = this, this._preventOutline && Gt(this._element), Vt(), Lt(), !this._moving)) {
						this.fire("down");
						var t = e.touches ? e.touches[0] : e, n = qt(this._element);
						this._startPoint = new A(t.clientX, t.clientY), this._startPos = It(this._element), this._parentScale = Jt(n);
						var r = e.type === "mousedown";
						V(document, r ? "mousemove" : "touchmove", this._onMove, this), V(document, r ? "mouseup" : "touchend touchcancel", this._onUp, this);
					}
				}
			},
			_onMove: function(e) {
				if (this._enabled) {
					if (e.touches && e.touches.length > 1) this._moved = !0;
					else {
						var t = e.touches && e.touches.length === 1 ? e.touches[0] : e, n = new A(t.clientX, t.clientY)._subtract(this._startPoint);
						(n.x || n.y) && (Math.abs(n.x) + Math.abs(n.y) < this.options.clickTolerance || (n.x /= this._parentScale.x, n.y /= this._parentScale.y, rn(e), this._moved || (this.fire("dragstart"), this._moved = !0, Ot(document.body, "leaflet-dragging"), this._lastTarget = e.target || e.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), Ot(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(n), this._moving = !0, this._lastEvent = e, this._updatePosition()));
					}
				}
			},
			_updatePosition: function() {
				var e = { originalEvent: this._lastEvent };
				this.fire("predrag", e), Ft(this._element, this._newPos), this.fire("drag", e);
			},
			_onUp: function() {
				this._enabled && this.finishDrag();
			},
			finishDrag: function(e) {
				kt(document.body, "leaflet-dragging"), this._lastTarget &&= (kt(this._lastTarget, "leaflet-drag-target"), null), Zt(document, "mousemove touchmove", this._onMove, this), Zt(document, "mouseup touchend touchcancel", this._onUp, this), Ht(), Rt();
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
				for (d = i[s], r = [], a = 0, u = e.length, o = u - 1; a < u; o = a++) c = e[a], l = e[o], c._code & d ? l._code & d || (f = Fn(l, c, d, t, n), f._code = In(f, t), r.push(f)) : (l._code & d && (f = Fn(l, c, d, t, n), f._code = In(f, t), r.push(f)), r.push(c));
				e = r;
			}
			return e;
		}
		function Tn(e, t) {
			var n, r, i, a, o, s, c, l, u;
			if (!e || e.length === 0) throw Error("latlngs not passed");
			zn(e) || (console.warn("latlngs are not flat! Only the first ring will be used"), e = e[0]);
			var d = N([0, 0]), f = oe(e);
			f.getNorthWest().distanceTo(f.getSouthWest()) * f.getNorthEast().distanceTo(f.getNorthWest()) < 1700 && (d = En(e));
			var p = e.length, m = [];
			for (n = 0; n < p; n++) {
				var h = N(e[n]);
				m.push(t.project(N([h.lat - d.lat, h.lng - d.lng])));
			}
			for (s = c = l = 0, n = 0, r = p - 1; n < p; r = n++) i = m[n], a = m[r], o = i.y * a.x - a.y * i.x, c += (i.x + a.x) * o, l += (i.y + a.y) * o, s += o * 3;
			u = s === 0 ? m[0] : [c / s, l / s];
			var g = t.unproject(j(u));
			return N([g.lat + d.lat, g.lng + d.lng]);
		}
		function En(e) {
			for (var t = 0, n = 0, r = 0, i = 0; i < e.length; i++) {
				var a = N(e[i]);
				t += a.lat, n += a.lng, r++;
			}
			return N([t / r, n / r]);
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
		function J(e, t, n, r, i) {
			var a = r ? Pn : In(e, n), o = In(t, n), s, c, l;
			for (Pn = o;;) {
				if (!(a | o)) return [e, t];
				if (a & o) return !1;
				s = a || o, c = Fn(e, t, s, n, i), l = In(c, n), s === a ? (e = c, a = l) : (t = c, o = l);
			}
		}
		function Fn(e, t, n, r, i) {
			var a = t.x - e.x, o = t.y - e.y, s = r.min, c = r.max, l, u;
			return n & 8 ? (l = e.x + a * (c.y - e.y) / o, u = c.y) : n & 4 ? (l = e.x + a * (s.y - e.y) / o, u = s.y) : n & 2 ? (l = c.x, u = e.y + o * (c.x - e.x) / a) : n & 1 && (l = s.x, u = e.y + o * (s.x - e.x) / a), new A(l, u, i);
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
			return c > 0 && (l = ((e.x - i) * o + (e.y - a) * s) / c, l > 1 ? (i = n.x, a = n.y) : l > 0 && (i += o * l, a += s * l)), o = e.x - i, s = e.y - a, r ? o * o + s * s : new A(i, a);
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
			var u = N([0, 0]), d = oe(e);
			d.getNorthWest().distanceTo(d.getSouthWest()) * d.getNorthEast().distanceTo(d.getNorthWest()) < 1700 && (u = En(e));
			var f = e.length, p = [];
			for (n = 0; n < f; n++) {
				var m = N(e[n]);
				p.push(t.project(N([m.lat - u.lat, m.lng - u.lng])));
			}
			for (n = 0, r = 0; n < f - 1; n++) r += p[n].distanceTo(p[n + 1]) / 2;
			if (r === 0) l = p[0];
			else for (n = 0, a = 0; n < f - 1; n++) if (o = p[n], s = p[n + 1], i = o.distanceTo(s), a += i, a > r) {
				c = (a - r) / i, l = [s.x - c * (s.x - o.x), s.y - c * (s.y - o.y)];
				break;
			}
			var h = t.unproject(j(l));
			return N([h.lat + u.lat, h.lng + u.lng]);
		}
		var Hn = {
			__proto__: null,
			simplify: On,
			pointToSegmentDistance: kn,
			closestPointOnSegment: An,
			clipSegment: J,
			_getEdgeIntersection: Fn,
			_getBitCode: In,
			_sqClosestPointOnSegment: Rn,
			isFlat: zn,
			_flat: Bn,
			polylineCenter: Vn
		}, Un = {
			project: function(e) {
				return new A(e.lng, e.lat);
			},
			unproject: function(e) {
				return new M(e.y, e.x);
			},
			bounds: new re([-180, -90], [180, 90])
		}, Wn = {
			R: 6378137,
			R_MINOR: 6356752.314245179,
			bounds: new re([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),
			project: function(e) {
				var t = Math.PI / 180, n = this.R, r = e.lat * t, i = this.R_MINOR / n, a = Math.sqrt(1 - i * i), o = a * Math.sin(r), s = Math.tan(Math.PI / 4 - r / 2) / ((1 - o) / (1 + o)) ** (a / 2);
				return r = -n * Math.log(Math.max(s, 1e-10)), new A(e.lng * t * n, r);
			},
			unproject: function(e) {
				for (var t = 180 / Math.PI, n = this.R, r = this.R_MINOR / n, i = Math.sqrt(1 - r * r), a = Math.exp(-e.y / n), o = Math.PI / 2 - 2 * Math.atan(a), s = 0, c = .1, l; s < 15 && Math.abs(c) > 1e-7; s++) l = i * Math.sin(o), l = ((1 - l) / (1 + l)) ** (i / 2), c = Math.PI / 2 - 2 * Math.atan(a * l) - o, o += c;
				return new M(o * t, e.x * t / n);
			}
		}, Gn = {
			__proto__: null,
			LonLat: Un,
			Mercator: Wn,
			SphericalMercator: ue
		}, Kn = n({}, ce, {
			code: "EPSG:3395",
			projection: Wn,
			transformation: function() {
				var e = .5 / (Math.PI * Wn.R);
				return fe(e, .5, -e, .5);
			}()
		}), qn = n({}, ce, {
			code: "EPSG:4326",
			projection: Un,
			transformation: fe(1 / 180, 1, -1 / 180, .5)
		}), Jn = n({}, se, {
			projection: Un,
			transformation: fe(1, 0, -1, 0),
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
		se.Earth = ce, se.EPSG3395 = Kn, se.EPSG3857 = pe, se.EPSG900913 = me, se.EPSG4326 = qn, se.Simple = Jn;
		var Yn = k.extend({
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
				var e = new ae();
				for (var t in this._layers) {
					var n = this._layers[t];
					e.extend(n.getBounds ? n.getBounds() : n.getLatLng());
				}
				return e;
			}
		}), $n = function(e, t) {
			return new Qn(e, t);
		}, er = O.extend({
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
				var i = j(r), a = j(t === "shadow" && n.shadowAnchor || n.iconAnchor || i && i.divideBy(2, !0));
				e.className = "leaflet-marker-" + t + " " + (n.className || ""), a && (e.style.marginLeft = -a.x + "px", e.style.marginTop = -a.y + "px"), i && (e.style.width = i.x + "px", e.style.height = i.y + "px");
			},
			_createImg: function(e, t) {
				return t ||= document.createElement("img"), t.src = e, t;
			},
			_getIconUrl: function(e) {
				return R.retina && this.options[e + "RetinaUrl"] || this.options[e + "Url"];
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
				var e = Ct("div", "leaflet-default-icon-path", document.body), t = St(e, "background-image") || St(e, "backgroundImage");
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
				}, this).enable(), Ot(e, "leaflet-marker-draggable");
			},
			removeHooks: function() {
				this._draggable.off({
					dragstart: this._onDragStart,
					predrag: this._onPreDrag,
					drag: this._onDrag,
					dragend: this._onDragEnd
				}, this).disable(), this._marker._icon && kt(this._marker._icon, "leaflet-marker-draggable");
			},
			moved: function() {
				return this._draggable && this._draggable._moved;
			},
			_adjustPan: function(e) {
				var t = this._marker, n = t._map, r = this._marker.options.autoPanSpeed, i = this._marker.options.autoPanPadding, a = It(t._icon), o = n.getPixelBounds(), s = n.getPixelOrigin(), c = ie(o.min._subtract(s).add(i), o.max._subtract(s).subtract(i));
				if (!c.contains(a)) {
					var l = j((Math.max(c.max.x, a.x) - c.max.x) / (o.max.x - c.max.x) - (Math.min(c.min.x, a.x) - c.min.x) / (o.min.x - c.min.x), (Math.max(c.max.y, a.y) - c.max.y) / (o.max.y - c.max.y) - (Math.min(c.min.y, a.y) - c.min.y) / (o.min.y - c.min.y)).multiplyBy(r);
					n.panBy(l, { animate: !1 }), this._draggable._newPos._add(l), this._draggable._startPos._add(l), Ft(t._icon, this._draggable._newPos), this._onDrag(e), this._panRequest = T(this._adjustPan.bind(this, e));
				}
			},
			_onDragStart: function() {
				this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
			},
			_onPreDrag: function(e) {
				this._marker.options.autoPan && (E(this._panRequest), this._panRequest = T(this._adjustPan.bind(this, e)));
			},
			_onDrag: function(e) {
				var t = this._marker, n = t._shadow, r = It(t._icon), i = t._map.layerPointToLatLng(r);
				n && Ft(n, r), t._latlng = i, e.latlng = i, e.oldLatLng = this._oldLatLng, t.fire("move", e).fire("drag", e);
			},
			_onDragEnd: function(e) {
				E(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", e);
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
				p(this, t), this._latlng = N(e);
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
				return this._latlng = N(e), this.update(), this.fire("move", {
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
				n !== this._icon && (this._icon && this._removeIcon(), r = !0, e.title && (n.title = e.title), n.tagName === "IMG" && (n.alt = e.alt || "")), Ot(n, t), e.keyboard && (n.tabIndex = "0", n.setAttribute("role", "button")), this._icon = n, e.riseOnHover && this.on({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				}), this.options.autoPanOnFocus && V(n, "focus", this._panOnFocus, this);
				var i = e.icon.createShadow(this._shadow), a = !1;
				i !== this._shadow && (this._removeShadow(), a = !0), i && (Ot(i, t), i.alt = ""), this._shadow = i, e.opacity < 1 && this._updateOpacity(), r && this.getPane().appendChild(this._icon), this._initInteraction(), i && a && this.getPane(e.shadowPane).appendChild(this._shadow);
			},
			_removeIcon: function() {
				this.options.riseOnHover && this.off({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				}), this.options.autoPanOnFocus && Zt(this._icon, "focus", this._panOnFocus, this), wt(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
			},
			_removeShadow: function() {
				this._shadow && wt(this._shadow), this._shadow = null;
			},
			_setPos: function(e) {
				this._icon && Ft(this._icon, e), this._shadow && Ft(this._shadow, e), this._zIndex = e.y + this.options.zIndexOffset, this._resetZIndex();
			},
			_updateZIndex: function(e) {
				this._icon && (this._icon.style.zIndex = this._zIndex + e);
			},
			_animateZoom: function(e) {
				var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
				this._setPos(t);
			},
			_initInteraction: function() {
				if (this.options.interactive && (Ot(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), rr)) {
					var e = this.options.draggable;
					this.dragging && (e = this.dragging.enabled(), this.dragging.disable()), this.dragging = new rr(this), e && this.dragging.enable();
				}
			},
			setOpacity: function(e) {
				return this.options.opacity = e, this._map && this._updateOpacity(), this;
			},
			_updateOpacity: function() {
				var e = this.options.opacity;
				this._icon && B(this._icon, e), this._shadow && B(this._shadow, e);
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
					var t = this.options.icon.options, n = t.iconSize ? j(t.iconSize) : j(0, 0), r = t.iconAnchor ? j(t.iconAnchor) : j(0, 0);
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
				p(this, t), this._latlng = N(e), this._radius = this.options.radius;
			},
			setLatLng: function(e) {
				var t = this._latlng;
				return this._latlng = N(e), this.redraw(), this.fire("move", {
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
				this._pxBounds = new re(this._point.subtract(r), this._point.add(r));
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
				if (typeof t == "number" && (t = n({}, r, { radius: t })), p(this, t), this._latlng = N(e), isNaN(this.options.radius)) throw Error("Circle radius cannot be NaN");
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
				return new ae(this._map.layerPointToLatLng(this._point.subtract(e)), this._map.layerPointToLatLng(this._point.add(e)));
			},
			setStyle: or.prototype.setStyle,
			_project: function() {
				var e = this._latlng.lng, t = this._latlng.lat, n = this._map, r = n.options.crs;
				if (r.distance === ce.distance) {
					var i = Math.PI / 180, a = this._mRadius / ce.R / i, o = n.project([t + a, e]), s = n.project([t - a, e]), c = o.add(s).divideBy(2), l = n.unproject(c).lat, u = Math.acos((Math.cos(a * i) - Math.sin(t * i) * Math.sin(l * i)) / (Math.cos(t * i) * Math.cos(l * i))) / i;
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
				return t ||= this._defaultShape(), e = N(e), t.push(e), this._bounds.extend(e), this.redraw();
			},
			_setLatLngs: function(e) {
				this._bounds = new ae(), this._latlngs = this._convertLatLngs(e);
			},
			_defaultShape: function() {
				return zn(this._latlngs) ? this._latlngs : this._latlngs[0];
			},
			_convertLatLngs: function(e) {
				for (var t = [], n = zn(e), r = 0, i = e.length; r < i; r++) n ? (t[r] = N(e[r]), this._bounds.extend(t[r])) : t[r] = this._convertLatLngs(e[r]);
				return t;
			},
			_project: function() {
				var e = new re();
				this._rings = [], this._projectLatlngs(this._latlngs, this._rings, e), this._bounds.isValid() && e.isValid() && (this._rawPxBounds = e, this._updateBounds());
			},
			_updateBounds: function() {
				var e = this._clickTolerance(), t = new A(e, e);
				this._rawPxBounds && (this._pxBounds = new re([this._rawPxBounds.min.subtract(t), this._rawPxBounds.max.add(t)]));
			},
			_projectLatlngs: function(e, t, n) {
				var r = e[0] instanceof M, i = e.length, a, o;
				if (r) {
					for (o = [], a = 0; a < i; a++) o[a] = this._map.latLngToLayerPoint(e[a]), n.extend(o[a]);
					t.push(o);
				} else for (a = 0; a < i; a++) this._projectLatlngs(e[a], t, n);
			},
			_clipPoints: function() {
				var e = this._renderer._bounds;
				if (this._parts = [], this._pxBounds && this._pxBounds.intersects(e)) {
					if (this.options.noClip) this._parts = this._rings;
					else for (var t = this._parts, n = 0, r, i = 0, a = this._rings.length, o, s, c; n < a; n++) for (c = this._rings[n], r = 0, o = c.length; r < o - 1; r++) s = J(c[r], c[r + 1], e, r, !0), s && (t[i] = t[i] || [], t[i].push(s[0]), (s[1] !== c[r + 1] || r === o - 2) && (t[i].push(s[1]), i++));
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
				return n >= 2 && t[0] instanceof M && t[0].equals(t[n - 1]) && t.pop(), t;
			},
			_setLatLngs: function(e) {
				dr.prototype._setLatLngs.call(this, e), zn(this._latlngs) && (this._latlngs = [this._latlngs]);
			},
			_defaultShape: function() {
				return zn(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
			},
			_clipPoints: function() {
				var e = this._renderer._bounds, t = this.options.weight, n = new A(t, t);
				if (e = new re(e.min.subtract(n), e.max.add(n)), this._parts = [], this._pxBounds && this._pxBounds.intersects(e)) {
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
				return o ? (o.feature = Sr(e), o.defaultOptions = o.options, this.resetStyle(o), a.onEachFeature && a.onEachFeature(e, o), this.addLayer(o)) : this;
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
			return new M(e[1], e[0], e[2]);
		}
		function yr(e, t, n) {
			for (var r = [], i = 0, a = e.length, o; i < a; i++) o = t ? yr(e[i], t - 1, n) : (n || vr)(e[i]), r.push(o);
			return r;
		}
		function br(e, t) {
			return e = N(e), e.alt === void 0 ? [u(e.lng, t), u(e.lat, t)] : [
				u(e.lng, t),
				u(e.lat, t),
				u(e.alt, t)
			];
		}
		function xr(e, t, n, r) {
			for (var i = [], a = 0, o = e.length; a < o; a++) i.push(t ? xr(e[a], zn(e[a]) ? 0 : t - 1, n, r) : br(e[a], r));
			return !t && n && i.length > 0 && i.push(i[0].slice()), i;
		}
		function Y(e, t) {
			return e.feature ? n({}, e.feature, { geometry: t }) : Sr(t);
		}
		function Sr(e) {
			return e.type === "Feature" || e.type === "FeatureCollection" ? e : {
				type: "Feature",
				properties: {},
				geometry: e
			};
		}
		var Cr = { toGeoJSON: function(e) {
			return Y(this, {
				type: "Point",
				coordinates: br(this.getLatLng(), e)
			});
		} };
		ir.include(Cr), lr.include(Cr), sr.include(Cr), dr.include({ toGeoJSON: function(e) {
			var t = !zn(this._latlngs), n = xr(this._latlngs, +!!t, !1, e);
			return Y(this, {
				type: (t ? "Multi" : "") + "LineString",
				coordinates: n
			});
		} }), pr.include({ toGeoJSON: function(e) {
			var t = !zn(this._latlngs), n = t && !zn(this._latlngs[0]), r = xr(this._latlngs, n ? 2 : +!!t, !0, e);
			return t || (r = [r]), Y(this, {
				type: (n ? "Multi" : "") + "Polygon",
				coordinates: r
			});
		} }), Xn.include({
			toMultiPoint: function(e) {
				var t = [];
				return this.eachLayer(function(n) {
					t.push(n.toGeoJSON(e).geometry.coordinates);
				}), Y(this, {
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
							var a = Sr(i);
							a.type === "FeatureCollection" ? r.push.apply(r, a.features) : r.push(a);
						}
					}
				}), n ? Y(this, {
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
				this._url = e, this._bounds = oe(t), p(this, n);
			},
			onAdd: function() {
				this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (Ot(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
			},
			onRemove: function() {
				wt(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
			},
			setOpacity: function(e) {
				return this.options.opacity = e, this._image && this._updateOpacity(), this;
			},
			setStyle: function(e) {
				return e.opacity && this.setOpacity(e.opacity), this;
			},
			bringToFront: function() {
				return this._map && Tt(this._image), this;
			},
			bringToBack: function() {
				return this._map && Et(this._image), this;
			},
			setUrl: function(e) {
				return this._url = e, this._image && (this._image.src = e), this;
			},
			setBounds: function(e) {
				return this._bounds = oe(e), this._map && this._reset(), this;
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
				var e = this._url.tagName === "IMG", t = this._image = e ? this._url : Ct("img");
				Ot(t, "leaflet-image-layer"), this._zoomAnimated && Ot(t, "leaflet-zoom-animated"), this.options.className && Ot(t, this.options.className), t.onselectstart = l, t.onmousemove = l, t.onload = i(this.fire, this, "load"), t.onerror = i(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (t.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), e ? this._url = t.src : (t.src = this._url, t.alt = this.options.alt);
			},
			_animateZoom: function(e) {
				var t = this._map.getZoomScale(e.zoom), n = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;
				Pt(this._image, n, t);
			},
			_reset: function() {
				var e = this._image, t = new re(this._map.latLngToLayerPoint(this._bounds.getNorthWest()), this._map.latLngToLayerPoint(this._bounds.getSouthEast())), n = t.getSize();
				Ft(e, t.min), e.style.width = n.x + "px", e.style.height = n.y + "px";
			},
			_updateOpacity: function() {
				B(this._image, this.options.opacity);
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
				var e = this._url.tagName === "VIDEO", t = this._image = e ? this._url : Ct("video");
				if (Ot(t, "leaflet-image-layer"), this._zoomAnimated && Ot(t, "leaflet-zoom-animated"), this.options.className && Ot(t, this.options.className), t.onselectstart = l, t.onmousemove = l, t.onloadeddata = i(this.fire, this, "load"), e) {
					for (var n = t.getElementsByTagName("source"), r = [], a = 0; a < n.length; a++) r.push(n[a].src);
					this._url = n.length > 0 ? r : [t.src];
				} else {
					_(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(t.style, "objectFit") && (t.style.objectFit = "fill"), t.autoplay = !!this.options.autoplay, t.loop = !!this.options.loop, t.muted = !!this.options.muted, t.playsInline = !!this.options.playsInline;
					for (var o = 0; o < this._url.length; o++) {
						var s = Ct("source");
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
			Ot(e, "leaflet-image-layer"), this._zoomAnimated && Ot(e, "leaflet-zoom-animated"), this.options.className && Ot(e, this.options.className), e.onselectstart = l, e.onmousemove = l;
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
				e && (e instanceof M || _(e)) ? (this._latlng = N(e), p(this, t)) : (p(this, e), this._source = t), this.options.content && (this._content = this.options.content);
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
				this._zoomAnimated = e._zoomAnimated, this._container || this._initLayout(), e._fadeAnimated && B(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), e._fadeAnimated && B(this._container, 1), this.bringToFront(), this.options.interactive && (Ot(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
			},
			onRemove: function(e) {
				e._fadeAnimated ? (B(this._container, 0), this._removeTimeout = setTimeout(i(wt, void 0, this._container), 200)) : wt(this._container), this.options.interactive && (kt(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
			},
			getLatLng: function() {
				return this._latlng;
			},
			setLatLng: function(e) {
				return this._latlng = N(e), this._map && (this._updatePosition(), this._adjustPan()), this;
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
				return this._map && Tt(this._container), this;
			},
			bringToBack: function() {
				return this._map && Et(this._container), this;
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
					var e = this._map.latLngToLayerPoint(this._latlng), t = j(this.options.offset), n = this._getAnchor();
					this._zoomAnimated ? Ft(this._container, e.add(n)) : t = t.add(e).add(n);
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
				var e = "leaflet-popup", t = this._container = Ct("div", e + " " + (this.options.className || "") + " leaflet-zoom-animated"), n = this._wrapper = Ct("div", e + "-content-wrapper", t);
				if (this._contentNode = Ct("div", e + "-content", n), nn(t), tn(this._contentNode), V(t, "contextmenu", en), this._tipContainer = Ct("div", e + "-tip-container", t), this._tip = Ct("div", e + "-tip", this._tipContainer), this.options.closeButton) {
					var r = this._closeButton = Ct("a", e + "-close-button", t);
					r.setAttribute("role", "button"), r.setAttribute("aria-label", "Close popup"), r.href = "#close", r.innerHTML = "<span aria-hidden=\"true\">&#215;</span>", V(r, "click", function(e) {
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
				i && r > i ? (t.height = i + "px", Ot(e, a)) : kt(e, a), this._containerWidth = this._container.offsetWidth;
			},
			_animateZoom: function(e) {
				var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), n = this._getAnchor();
				Ft(this._container, t.add(n));
			},
			_adjustPan: function() {
				if (this.options.autoPan) {
					if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) this._autopanning = !1;
					else {
						var e = this._map, t = parseInt(St(this._container, "marginBottom"), 10) || 0, n = this._container.offsetHeight + t, r = this._containerWidth, i = new A(this._containerLeft, -n - this._containerBottom);
						i._add(It(this._container));
						var a = e.layerPointToContainerPoint(i), o = j(this.options.autoPanPadding), s = j(this.options.autoPanPaddingTopLeft || o), c = j(this.options.autoPanPaddingBottomRight || o), l = e.getSize(), u = 0, d = 0;
						a.x + r + c.x > l.x && (u = a.x + r - l.x + c.x), a.x - u - s.x < 0 && (u = a.x - s.x), a.y + n + c.y > l.y && (d = a.y + n - l.y + c.y), a.y - d - s.y < 0 && (d = a.y - s.y), (u || d) && (this.options.keepInView && (this._autopanning = !0), e.fire("autopanstart").panBy([u, d]));
					}
				}
			},
			_getAnchor: function() {
				return j(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
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
				this._contentNode = this._container = Ct("div", e), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + o(this));
			},
			_updateLayout: function() {},
			_adjustPan: function() {},
			_setPosition: function(e) {
				var t, n, r = this._map, i = this._container, a = r.latLngToContainerPoint(r.getCenter()), o = r.layerPointToContainerPoint(e), s = this.options.direction, c = i.offsetWidth, l = i.offsetHeight, u = j(this.options.offset), d = this._getAnchor();
				s === "top" ? (t = c / 2, n = l) : s === "bottom" ? (t = c / 2, n = 0) : s === "center" ? (t = c / 2, n = l / 2) : s === "right" ? (t = 0, n = l / 2) : s === "left" ? (t = c, n = l / 2) : o.x < a.x ? (s = "right", t = 0, n = l / 2) : (s = "left", t = c + (u.x + d.x) * 2, n = l / 2), e = e.subtract(j(t, n, !0)).add(u).add(d), kt(i, "leaflet-tooltip-right"), kt(i, "leaflet-tooltip-left"), kt(i, "leaflet-tooltip-top"), kt(i, "leaflet-tooltip-bottom"), Ot(i, "leaflet-tooltip-" + s), Ft(i, e);
			},
			_updatePosition: function() {
				var e = this._map.latLngToLayerPoint(this._latlng);
				this._setPosition(e);
			},
			setOpacity: function(e) {
				this.options.opacity = e, this._container && B(this._container, e);
			},
			_animateZoom: function(e) {
				var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
				this._setPosition(t);
			},
			_getAnchor: function() {
				return j(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
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
				t && (V(t, "focus", function() {
					this._tooltip._source = e, this.openTooltip();
				}, this), V(t, "blur", this.closeTooltip, this));
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
				if (n.html instanceof Element ? (z(t), t.appendChild(n.html)) : t.innerHTML = n.html === !1 ? "" : n.html, n.bgPos) {
					var r = j(n.bgPos);
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
				updateWhenIdle: R.mobile,
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
				this._removeAllTiles(), wt(this._container), e._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
			},
			bringToFront: function() {
				return this._map && (Tt(this._container), this._setAutoZIndex(Math.max)), this;
			},
			bringToBack: function() {
				return this._map && (Et(this._container), this._setAutoZIndex(Math.min)), this;
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
				return e instanceof A ? e : new A(e, e);
			},
			_updateZIndex: function() {
				this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
			},
			_setAutoZIndex: function(e) {
				for (var t = this.getPane().children, n = -e(-Infinity, Infinity), r = 0, i = t.length, a; r < i; r++) a = t[r].style.zIndex, t[r] !== this._container && a && (n = e(n, +a));
				isFinite(n) && (this.options.zIndex = n + e(-1, 1), this._updateZIndex());
			},
			_updateOpacity: function() {
				if (this._map && !R.ielt9) {
					B(this._container, this.options.opacity);
					var e = +/* @__PURE__ */ new Date(), t = !1, n = !1;
					for (var r in this._tiles) {
						var i = this._tiles[r];
						if (i.current && i.loaded) {
							var a = Math.min(1, (e - i.loaded) / 200);
							B(i.el, a), a < 1 ? t = !0 : (i.active ? n = !0 : this._onOpaqueTile(i), i.active = !0);
						}
					}
					n && !this._noPrune && this._pruneTiles(), t && (E(this._fadeFrame), this._fadeFrame = T(this._updateOpacity, this));
				}
			},
			_onOpaqueTile: l,
			_initContainer: function() {
				this._container || (this._container = Ct("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
			},
			_updateLevels: function() {
				var e = this._tileZoom, t = this.options.maxZoom;
				if (e !== void 0) {
					for (var n in this._levels) n = Number(n), this._levels[n].el.children.length || n === e ? (this._levels[n].el.style.zIndex = t - Math.abs(e - n), this._onUpdateLevel(n)) : (wt(this._levels[n].el), this._removeTilesAtZoom(n), this._onRemoveLevel(n), delete this._levels[n]);
					var r = this._levels[e], i = this._map;
					return r || (r = this._levels[e] = {}, r.el = Ct("div", "leaflet-tile-container leaflet-zoom-animated", this._container), r.el.style.zIndex = t, r.origin = i.project(i.unproject(i.getPixelOrigin()), e).round(), r.zoom = e, this._setZoomTransform(r, i.getCenter(), i.getZoom()), r.el.offsetWidth, this._onCreateLevel(r)), this._level = r, r;
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
				for (var e in this._levels) wt(this._levels[e].el), this._onRemoveLevel(Number(e)), delete this._levels[e];
				this._removeAllTiles(), this._tileZoom = void 0;
			},
			_retainParent: function(e, t, n, r) {
				var i = Math.floor(e / 2), a = Math.floor(t / 2), o = n - 1, s = new A(+i, +a);
				s.z = +o;
				var c = this._tileCoordsToKey(s), l = this._tiles[c];
				return l && l.active ? (l.retain = !0, !0) : (l && l.loaded && (l.retain = !0), o > r && this._retainParent(i, a, o, r));
			},
			_retainChildren: function(e, t, n, r) {
				for (var i = 2 * e; i < 2 * e + 2; i++) for (var a = 2 * t; a < 2 * t + 2; a++) {
					var o = new A(i, a);
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
				R.any3d ? Pt(e.el, i, r) : Ft(e.el, i);
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
				return new re(i.subtract(a), i.add(a));
			},
			_update: function(e) {
				var t = this._map;
				if (t) {
					var n = this._clampZoom(t.getZoom());
					if (e === void 0 && (e = t.getCenter()), this._tileZoom !== void 0) {
						var r = this._getTiledPixelBounds(e), i = this._pxBoundsToTileRange(r), a = i.getCenter(), o = [], s = this.options.keepBuffer, c = new re(i.getBottomLeft().subtract([s, -s]), i.getTopRight().add([s, -s]));
						if (!(isFinite(i.min.x) && isFinite(i.min.y) && isFinite(i.max.x) && isFinite(i.max.y))) throw Error("Attempted to load an infinite number of tiles");
						for (var l in this._tiles) {
							var u = this._tiles[l].coords;
							u.z === this._tileZoom && c.contains(new A(u.x, u.y)) || (this._tiles[l].current = !1);
						}
						if (Math.abs(n - this._tileZoom) > 1) this._setView(e, n);
						else {
							for (var d = i.min.y; d <= i.max.y; d++) for (var f = i.min.x; f <= i.max.x; f++) {
								var p = new A(f, d);
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
				return oe(this.options.bounds).overlaps(r);
			},
			_keyToBounds: function(e) {
				return this._tileCoordsToBounds(this._keyToTileCoords(e));
			},
			_tileCoordsToNwSe: function(e) {
				var t = this._map, n = this.getTileSize(), r = e.scaleBy(n), i = r.add(n);
				return [t.unproject(r, e.z), t.unproject(i, e.z)];
			},
			_tileCoordsToBounds: function(e) {
				var t = this._tileCoordsToNwSe(e), n = new ae(t[0], t[1]);
				return this.options.noWrap || (n = this._map.wrapLatLngBounds(n)), n;
			},
			_tileCoordsToKey: function(e) {
				return e.x + ":" + e.y + ":" + e.z;
			},
			_keyToTileCoords: function(e) {
				var t = e.split(":"), n = new A(+t[0], +t[1]);
				return n.z = +t[2], n;
			},
			_removeTile: function(e) {
				var t = this._tiles[e];
				t && (wt(t.el), delete this._tiles[e], this.fire("tileunload", {
					tile: t.el,
					coords: this._keyToTileCoords(e)
				}));
			},
			_initTile: function(e) {
				Ot(e, "leaflet-tile");
				var t = this.getTileSize();
				e.style.width = t.x + "px", e.style.height = t.y + "px", e.onselectstart = l, e.onmousemove = l, R.ielt9 && this.options.opacity < 1 && B(e, this.options.opacity);
			},
			_addTile: function(e, t) {
				var n = this._getTilePos(e), r = this._tileCoordsToKey(e), a = this.createTile(this._wrapCoords(e), i(this._tileReady, this, e));
				this._initTile(a), this.createTile.length < 2 && T(i(this._tileReady, this, e, null, a)), Ft(a, n), this._tiles[r] = {
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
				n = this._tiles[r], n && (n.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (B(n.el, 0), E(this._fadeFrame), this._fadeFrame = T(this._updateOpacity, this)) : (n.active = !0, this._pruneTiles()), t || (Ot(n.el, "leaflet-tile-loaded"), this.fire("tileload", {
					tile: n.el,
					coords: e
				})), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), R.ielt9 || !this._map._fadeAnimated ? T(this._pruneTiles, this) : setTimeout(i(this._pruneTiles, this), 250)));
			},
			_getTilePos: function(e) {
				return e.scaleBy(this.getTileSize()).subtract(this._level.origin);
			},
			_wrapCoords: function(e) {
				var t = new A(this._wrapX ? c(e.x, this._wrapX) : e.x, this._wrapY ? c(e.y, this._wrapY) : e.y);
				return t.z = e.z, t;
			},
			_pxBoundsToTileRange: function(e) {
				var t = this.getTileSize();
				return new re(e.min.unscaleBy(t).floor(), e.max.unscaleBy(t).ceil().subtract([1, 1]));
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
				this._url = e, t = p(this, t), t.detectRetina && R.retina && t.maxZoom > 0 ? (t.tileSize = Math.floor(t.tileSize / 2), t.zoomReverse ? (t.zoomOffset--, t.minZoom = Math.min(t.maxZoom, t.minZoom + 1)) : (t.zoomOffset++, t.maxZoom = Math.max(t.minZoom, t.maxZoom - 1)), t.minZoom = Math.max(0, t.minZoom)) : t.zoomReverse ? t.minZoom = Math.min(t.maxZoom, t.minZoom) : t.maxZoom = Math.max(t.minZoom, t.maxZoom), typeof t.subdomains == "string" && (t.subdomains = t.subdomains.split("")), this.on("tileunload", this._onTileRemove);
			},
			setUrl: function(e, t) {
				return this._url === e && t === void 0 && (t = !0), this._url = e, t || this.redraw(), this;
			},
			createTile: function(e, t) {
				var n = document.createElement("img");
				return V(n, "load", i(this._tileOnLoad, this, t, n)), V(n, "error", i(this._tileOnError, this, t, n)), (this.options.crossOrigin || this.options.crossOrigin === "") && (n.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (n.referrerPolicy = this.options.referrerPolicy), n.alt = "", n.src = this.getTileUrl(e), n;
			},
			getTileUrl: function(e) {
				var t = {
					r: R.retina ? "@2x" : "",
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
				R.ielt9 ? setTimeout(i(e, this, null, t), 0) : e(null, t);
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
					wt(t), delete this._tiles[e], this.fire("tileabort", {
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
		var X = Vr.extend({
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
				var a = t.detectRetina && R.retina ? 2 : 1, o = this.getTileSize();
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
		function Ur(e, t) {
			return new X(e, t);
		}
		Vr.WMS = X, Hr.wms = Ur;
		var Wr = Yn.extend({
			options: { padding: .1 },
			initialize: function(e) {
				p(this, e), o(this), this._layers = this._layers || {};
			},
			onAdd: function() {
				this._container || (this._initContainer(), Ot(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
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
				R.any3d ? Pt(this._container, a, n) : Ft(this._container, a);
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
				this._bounds = new re(n, n.add(t.multiplyBy(1 + e * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
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
				V(e, "mousemove", this._onMouseMove, this), V(e, "click dblclick mousedown mouseup contextmenu", this._onClick, this), V(e, "mouseout", this._handleMouseOut, this), e._leaflet_disable_events = !0, this._ctx = e.getContext("2d");
			},
			_destroyContainer: function() {
				E(this._redrawRequest), delete this._ctx, wt(this._container), Zt(this._container), delete this._container;
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
					var e = this._bounds, t = this._container, n = e.getSize(), r = R.retina ? 2 : 1;
					Ft(t, e.min), t.width = r * n.x, t.height = r * n.y, t.style.width = n.x + "px", t.style.height = n.y + "px", R.retina && this._ctx.scale(2, 2), this._ctx.translate(-e.min.x, -e.min.y), this.fire("update");
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
				this._map && (this._extendRedrawBounds(e), this._redrawRequest = this._redrawRequest || T(this._redraw, this));
			},
			_extendRedrawBounds: function(e) {
				if (e._pxBounds) {
					var t = (e.options.weight || 0) + 1;
					this._redrawBounds = this._redrawBounds || new re(), this._redrawBounds.extend(e._pxBounds.min.subtract([t, t])), this._redrawBounds.extend(e._pxBounds.max.add([t, t]));
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
				t && (kt(this._container, "leaflet-interactive"), this._fireEvent([t], e, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
			},
			_handleMouseHover: function(e, t) {
				if (!this._mouseHoverThrottled) {
					for (var n, r, a = this._drawFirst; a; a = a.next) n = a.layer, n.options.interactive && n._containsPoint(t) && (r = n);
					r !== this._hoveredLayer && (this._handleMouseOut(e), r && (Ot(this._container, "leaflet-interactive"), this._fireEvent([r], e, "mouseover"), this._hoveredLayer = r)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, e), this._mouseHoverThrottled = !0, setTimeout(i(function() {
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
			return R.canvas ? new Gr(e) : null;
		}
		var Z = (function() {
			try {
				return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(e) {
					return document.createElement("<lvml:" + e + " class=\"lvml\">");
				};
			} catch {}
			return function(e) {
				return document.createElement("<" + e + " xmlns=\"urn:schemas-microsoft.com:vml\" class=\"lvml\">");
			};
		})(), qr = {
			_initContainer: function() {
				this._container = Ct("div", "leaflet-vml-container");
			},
			_update: function() {
				this._map._animatingZoom || (Wr.prototype._update.call(this), this.fire("update"));
			},
			_initPath: function(e) {
				var t = e._container = Z("shape");
				Ot(t, "leaflet-vml-shape " + (this.options.className || "")), t.coordsize = "1 1", e._path = Z("path"), t.appendChild(e._path), this._updateStyle(e), this._layers[o(e)] = e;
			},
			_addPath: function(e) {
				var t = e._container;
				this._container.appendChild(t), e.options.interactive && e.addInteractiveTarget(t);
			},
			_removePath: function(e) {
				var t = e._container;
				wt(t), e.removeInteractiveTarget(t), delete this._layers[o(e)];
			},
			_updateStyle: function(e) {
				var t = e._stroke, n = e._fill, r = e.options, i = e._container;
				i.stroked = !!r.stroke, i.filled = !!r.fill, r.stroke ? (t ||= e._stroke = Z("stroke"), i.appendChild(t), t.weight = r.weight + "px", t.color = r.color, t.opacity = r.opacity, r.dashArray ? t.dashStyle = _(r.dashArray) ? r.dashArray.join(" ") : r.dashArray.replace(/( *, *)/g, " ") : t.dashStyle = "", t.endcap = r.lineCap.replace("butt", "flat"), t.joinstyle = r.lineJoin) : t && (i.removeChild(t), e._stroke = null), r.fill ? (n ||= e._fill = Z("fill"), i.appendChild(n), n.color = r.fillColor || r.color, n.opacity = r.fillOpacity) : n && (i.removeChild(n), e._fill = null);
			},
			_updateCircle: function(e) {
				var t = e._point.round(), n = Math.round(e._radius), r = Math.round(e._radiusY || n);
				this._setPath(e, e._empty() ? "M0 0" : "AL " + t.x + "," + t.y + " " + n + "," + r + " 0,23592600");
			},
			_setPath: function(e, t) {
				e._path.v = t;
			},
			_bringToFront: function(e) {
				Tt(e._container);
			},
			_bringToBack: function(e) {
				Et(e._container);
			}
		}, Jr = R.vml ? Z : he, Yr = Wr.extend({
			_initContainer: function() {
				this._container = Jr("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Jr("g"), this._container.appendChild(this._rootGroup);
			},
			_destroyContainer: function() {
				wt(this._container), Zt(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
			},
			_update: function() {
				if (!(this._map._animatingZoom && this._bounds)) {
					Wr.prototype._update.call(this);
					var e = this._bounds, t = e.getSize(), n = this._container;
					this._svgSize && this._svgSize.equals(t) || (this._svgSize = t, n.setAttribute("width", t.x), n.setAttribute("height", t.y)), Ft(n, e.min), n.setAttribute("viewBox", [
						e.min.x,
						e.min.y,
						t.x,
						t.y
					].join(" ")), this.fire("update");
				}
			},
			_initPath: function(e) {
				var t = e._path = Jr("path");
				e.options.className && Ot(t, e.options.className), e.options.interactive && Ot(t, "leaflet-interactive"), this._updateStyle(e), this._layers[o(e)] = e;
			},
			_addPath: function(e) {
				this._rootGroup || this._initContainer(), this._rootGroup.appendChild(e._path), e.addInteractiveTarget(e._path);
			},
			_removePath: function(e) {
				wt(e._path), e.removeInteractiveTarget(e._path), delete this._layers[o(e)];
			},
			_updatePath: function(e) {
				e._project(), e._update();
			},
			_updateStyle: function(e) {
				var t = e._path, n = e.options;
				t && (n.stroke ? (t.setAttribute("stroke", n.color), t.setAttribute("stroke-opacity", n.opacity), t.setAttribute("stroke-width", n.weight), t.setAttribute("stroke-linecap", n.lineCap), t.setAttribute("stroke-linejoin", n.lineJoin), n.dashArray ? t.setAttribute("stroke-dasharray", n.dashArray) : t.removeAttribute("stroke-dasharray"), n.dashOffset ? t.setAttribute("stroke-dashoffset", n.dashOffset) : t.removeAttribute("stroke-dashoffset")) : t.setAttribute("stroke", "none"), n.fill ? (t.setAttribute("fill", n.fillColor || n.color), t.setAttribute("fill-opacity", n.fillOpacity), t.setAttribute("fill-rule", n.fillRule || "evenodd")) : t.setAttribute("fill", "none"));
			},
			_updatePoly: function(e, t) {
				this._setPath(e, ge(e._parts, t));
			},
			_updateCircle: function(e) {
				var t = e._point, n = Math.max(Math.round(e._radius), 1), r = Math.max(Math.round(e._radiusY), 1) || n, i = "a" + n + "," + r + " 0 1,0 ", a = e._empty() ? "M0 0" : "M" + (t.x - n) + "," + t.y + i + n * 2 + ",0 " + i + -n * 2 + ",0 ";
				this._setPath(e, a);
			},
			_setPath: function(e, t) {
				e._path.setAttribute("d", t);
			},
			_bringToFront: function(e) {
				Tt(e._path);
			},
			_bringToBack: function(e) {
				Et(e._path);
			}
		});
		R.vml && Yr.include(qr);
		function Xr(e) {
			return R.svg || R.vml ? new Yr(e) : null;
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
				return e = oe(e), [
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
		Yr.create = Jr, Yr.pointsToPath = ge, hr.geometryToLayer = gr, hr.coordsToLatLng = vr, hr.coordsToLatLngs = yr, hr.latLngToCoords = br, hr.latLngsToCoords = xr, hr.getFeature = Y, hr.asFeature = Sr, pn.mergeOptions({ boxZoom: !0 });
		var Q = bn.extend({
			initialize: function(e) {
				this._map = e, this._container = e._container, this._pane = e._panes.overlayPane, this._resetStateTimeout = 0, e.on("unload", this._destroy, this);
			},
			addHooks: function() {
				V(this._container, "mousedown", this._onMouseDown, this);
			},
			removeHooks: function() {
				Zt(this._container, "mousedown", this._onMouseDown, this);
			},
			moved: function() {
				return this._moved;
			},
			_destroy: function() {
				wt(this._pane), delete this._pane;
			},
			_resetState: function() {
				this._resetStateTimeout = 0, this._moved = !1;
			},
			_clearDeferredResetState: function() {
				this._resetStateTimeout !== 0 && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
			},
			_onMouseDown: function(e) {
				if (!e.shiftKey || e.which !== 1 && e.button !== 1) return !1;
				this._clearDeferredResetState(), this._resetState(), Lt(), Vt(), this._startPoint = this._map.mouseEventToContainerPoint(e), V(document, {
					contextmenu: an,
					mousemove: this._onMouseMove,
					mouseup: this._onMouseUp,
					keydown: this._onKeyDown
				}, this);
			},
			_onMouseMove: function(e) {
				this._moved || (this._moved = !0, this._box = Ct("div", "leaflet-zoom-box", this._container), Ot(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(e);
				var t = new re(this._point, this._startPoint), n = t.getSize();
				Ft(this._box, t.min), this._box.style.width = n.x + "px", this._box.style.height = n.y + "px";
			},
			_finish: function() {
				this._moved && (wt(this._box), kt(this._container, "leaflet-crosshair")), Rt(), Ht(), Zt(document, {
					contextmenu: an,
					mousemove: this._onMouseMove,
					mouseup: this._onMouseUp,
					keydown: this._onKeyDown
				}, this);
			},
			_onMouseUp: function(e) {
				if ((e.which === 1 || e.button === 1) && (this._finish(), this._moved)) {
					this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(i(this._resetState, this), 0);
					var t = new ae(this._map.containerPointToLatLng(this._startPoint), this._map.containerPointToLatLng(this._point));
					this._map.fitBounds(t).fire("boxzoomend", { boxZoomBounds: t });
				}
			},
			_onKeyDown: function(e) {
				e.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
			}
		});
		pn.addInitHook("addHandler", "boxZoom", Q), pn.mergeOptions({ doubleClickZoom: !0 });
		var $r = bn.extend({
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
		pn.addInitHook("addHandler", "doubleClickZoom", $r), pn.mergeOptions({
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
				Ot(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
			},
			removeHooks: function() {
				kt(this._map._container, "leaflet-grab"), kt(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
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
					var t = oe(this._map.options.maxBounds);
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
					!f.x && !f.y ? t.fire("moveend") : (f = t._limitOffset(f, t.options.maxBounds), T(function() {
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
				e.tabIndex <= 0 && (e.tabIndex = "0"), V(e, {
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
				V(document, "keydown", this._onKeyDown, this);
			},
			_removeHooks: function() {
				Zt(document, "keydown", this._onKeyDown, this);
			},
			_onKeyDown: function(e) {
				if (!(e.altKey || e.ctrlKey || e.metaKey)) {
					var t = e.keyCode, n = this._map, r;
					if (t in this._panKeys) {
						if (!n._panAnim || !n._panAnim._inProgress) {
							if (r = this._panKeys[t], e.shiftKey && (r = j(r).multiplyBy(3)), n.options.maxBounds && (r = n._limitOffset(j(r), n.options.maxBounds)), n.options.worldCopyJump) {
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
				V(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
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
			tapHold: R.touchNative && R.safari && R.mobile,
			tapTolerance: 15
		});
		var ii = bn.extend({
			addHooks: function() {
				V(this._map._container, "touchstart", this._onDown, this);
			},
			removeHooks: function() {
				Zt(this._map._container, "touchstart", this._onDown, this);
			},
			_onDown: function(e) {
				if (clearTimeout(this._holdTimeout), e.touches.length === 1) {
					var t = e.touches[0];
					this._startPos = this._newPos = new A(t.clientX, t.clientY), this._holdTimeout = setTimeout(i(function() {
						this._cancel(), this._isTapValid() && (V(document, "touchend", rn), V(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", t));
					}, this), ri), V(document, "touchend touchcancel contextmenu", this._cancel, this), V(document, "touchmove", this._onMove, this);
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
				this._newPos = new A(t.clientX, t.clientY);
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
			touchZoom: R.touch,
			bounceAtZoomLimits: !0
		});
		var ai = bn.extend({
			addHooks: function() {
				Ot(this._map._container, "leaflet-touch-zoom"), V(this._map._container, "touchstart", this._onTouchStart, this);
			},
			removeHooks: function() {
				kt(this._map._container, "leaflet-touch-zoom"), Zt(this._map._container, "touchstart", this._onTouchStart, this);
			},
			_onTouchStart: function(e) {
				var t = this._map;
				if (!(!e.touches || e.touches.length !== 2 || t._animatingZoom || this._zooming)) {
					var n = t.mouseEventToContainerPoint(e.touches[0]), r = t.mouseEventToContainerPoint(e.touches[1]);
					this._centerPoint = t.getSize()._divideBy(2), this._startLatLng = t.containerPointToLatLng(this._centerPoint), t.options.touchZoom !== "center" && (this._pinchStartLatLng = t.containerPointToLatLng(n.add(r)._divideBy(2))), this._startDist = n.distanceTo(r), this._startZoom = t.getZoom(), this._moved = !1, this._zooming = !0, t._stop(), V(document, "touchmove", this._onTouchMove, this), V(document, "touchend touchcancel", this._onTouchEnd, this), rn(e);
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
					this._moved ||= (t._moveStart(!0, !1), !0), E(this._animRequest);
					var s = i(t._move, t, this._center, this._zoom, {
						pinch: !0,
						round: !1
					}, void 0);
					this._animRequest = T(s, this, !0), rn(e);
				}
			},
			_onTouchEnd: function() {
				!this._moved || !this._zooming ? this._zooming = !1 : (this._zooming = !1, E(this._animRequest), Zt(document, "touchmove", this._onTouchMove, this), Zt(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom)));
			}
		});
		pn.addInitHook("addHandler", "touchZoom", ai), pn.BoxZoom = Q, pn.DoubleClickZoom = $r, pn.Drag = ei, pn.Keyboard = ti, pn.ScrollWheelZoom = ni, pn.TapHold = ii, pn.TouchZoom = ai, e.Bounds = re, e.Browser = R, e.CRS = se, e.Canvas = Gr, e.Circle = lr, e.CircleMarker = sr, e.Class = O, e.Control = hn, e.DivIcon = Lr, e.DivOverlay = Mr, e.DomEvent = dn, e.DomUtil = Yt, e.Draggable = Cn, e.Evented = k, e.FeatureGroup = Qn, e.GeoJSON = hr, e.GridLayer = zr, e.Handler = bn, e.Icon = er, e.ImageOverlay = Er, e.LatLng = M, e.LatLngBounds = ae, e.Layer = Yn, e.LayerGroup = Xn, e.LineUtil = Hn, e.Map = pn, e.Marker = ir, e.Mixin = xn, e.Path = or, e.Point = A, e.PolyUtil = Dn, e.Polygon = pr, e.Polyline = dr, e.Popup = Nr, e.PosAnimation = fn, e.Projection = Gn, e.Rectangle = Zr, e.Renderer = Wr, e.SVG = Yr, e.SVGOverlay = Ar, e.TileLayer = Vr, e.Tooltip = Fr, e.Transformation = de, e.Util = D, e.VideoOverlay = Or, e.bind = i, e.bounds = ie, e.canvas = Kr, e.circle = ur, e.circleMarker = cr, e.control = gn, e.divIcon = Rr, e.extend = n, e.featureGroup = $n, e.geoJSON = wr, e.geoJson = Tr, e.gridLayer = Br, e.icon = tr, e.imageOverlay = Dr, e.latLng = N, e.latLngBounds = oe, e.layerGroup = Zn, e.map = mn, e.marker = ar, e.point = j, e.polygon = mr, e.polyline = fr, e.popup = Pr, e.rectangle = Qr, e.setOptions = p, e.stamp = o, e.svg = Xr, e.svgOverlay = jr, e.tileLayer = Hr, e.tooltip = Ir, e.transformation = fe, e.version = t, e.videoOverlay = kr;
		var oi = window.L;
		e.noConflict = function() {
			return window.L = oi, this;
		}, window.L = e;
	}));
})))()), Mp = /* @__PURE__ */ X("<div class=\"map svelte-1zqw7d\" role=\"region\"></div>");
function Np(e, t) {
	nt(t, !0);
	let n = jp.default.TileLayer.extend({ createTile(e, t) {
		let n = document.createElement("img");
		return n.alt = "", jp.default.DomEvent.on(n, "load", jp.default.Util.bind(this._tileOnLoad, this, t, n)), jp.default.DomEvent.on(n, "error", jp.default.Util.bind(this._tileOnError, this, t, n)), ec(this.getTileUrl(e)).then((e) => n.src = e, (e) => t(e, n)), n;
	} }), r = ba(t, "lines", 19, () => []), i = ba(t, "dots", 19, () => []), a = ba(t, "label", 3, "Map"), o = /* @__PURE__ */ H(void 0);
	kn(() => {
		let e = getComputedStyle(Y(o)), t = (t) => e.getPropertyValue(`--${t}`).trim(), a = matchMedia("(pointer: coarse)").matches, s = jp.default.map(Y(o), {
			scrollWheelZoom: !1,
			dragging: !a
		});
		s.attributionControl.setPrefix(!1), new n(Zs, {
			maxZoom: 19,
			attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">OpenStreetMap</a> contributors"
		}).addTo(s);
		let c = jp.default.latLngBounds([]), l = (e, t) => t && e.on("click", () => location.hash = t);
		for (let { points: e, kind: n, href: i } of r()) l(jp.default.polyline(e, {
			color: t(n),
			weight: 4
		}).addTo(s), i), c.extend(e);
		for (let { lat: e, lon: n, kind: r, role: a, title: o, href: u } of i()) {
			let i = a === "end", d = jp.default.circleMarker([e, n], {
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
	var s = Mp();
	let c;
	ha(s, (e) => U(o, e), () => Y(o)), J(() => {
		na(s, "aria-label", a()), c = Vi(s, "", c, { height: `${t.height ?? ""}px` });
	}), Z(e, s), rt();
}
// src/pages/ChargeDetail.svelte
var Pp = /* @__PURE__ */ X("<span class=\"caption svelte-1d50lj3\">Cloud times</span>"), Fp = /* @__PURE__ */ X("<span class=\"caption svelte-1d50lj3\">Estimated</span>"), Ip = /* @__PURE__ */ X("<p class=\"badges svelte-1d50lj3\"><!> <!></p>"), Lp = /* @__PURE__ */ X("<p class=\"d-sub\"> </p> <!>", 1), Rp = /* @__PURE__ */ X(" <small class=\"svelte-1d50lj3\"> </small>", 1), zp = /* @__PURE__ */ X("<p class=\"d-note\"> </p>"), Bp = /* @__PURE__ */ X("<button class=\"d-btn\" type=\"button\">Clear</button>"), Vp = /* @__PURE__ */ X("<form class=\"edit svelte-1d50lj3\"><label class=\"field wide\">Location name<input required=\"\" maxlength=\"40\" class=\"svelte-1d50lj3\"/></label> <label class=\"field\">€/kWh<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" required=\"\" class=\"svelte-1d50lj3\"/></label> <label class=\"field\">Start fee<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\" class=\"svelte-1d50lj3\"/></label> <label class=\"field\">€/min<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\" class=\"svelte-1d50lj3\"/></label> <button class=\"d-btn\" type=\"submit\">Save location</button> <button class=\"d-btn\" type=\"button\">Cancel</button></form>"), Hp = /* @__PURE__ */ X("<div class=\"edit svelte-1d50lj3\"><button class=\"d-btn\" type=\"button\">Save as charge location</button></div>"), Up = /* @__PURE__ */ X("<p class=\"note svelte-1d50lj3\" role=\"alert\"> </p>"), Wp = /* @__PURE__ */ X("<form class=\"edit svelte-1d50lj3\"><label class=\"field\">Total paid (€)<input type=\"number\" min=\"0\" step=\"0.01\" inputmode=\"decimal\" required=\"\" class=\"svelte-1d50lj3\"/></label> <button class=\"d-btn\" type=\"submit\">Save</button> <!></form> <!> <!>", 1), Gp = /* @__PURE__ */ X("<div class=\"stats svelte-1d50lj3\"><span class=\"svelte-1d50lj3\"><span class=\"d-note\">Min</span><b class=\"svelte-1d50lj3\"> </b></span> <span class=\"svelte-1d50lj3\"><span class=\"d-note\">Average</span><b class=\"svelte-1d50lj3\"> </b></span> <span class=\"svelte-1d50lj3\"><span class=\"d-note\">Max</span><b class=\"svelte-1d50lj3\"> </b></span></div> <!> <p class=\"d-note source svelte-1d50lj3\"> </p>", 1), Kp = /* @__PURE__ */ X("<p class=\"d-msg\">Not enough readings for a speed curve</p>"), qp = /* @__PURE__ */ X("<p class=\"d-msg\">No readings from the car during this charge</p>"), Jp = /* @__PURE__ */ X("<p class=\"d-msg\">No readings from the cloud for this charge</p>"), Yp = /* @__PURE__ */ X("<section class=\"d-card hero svelte-1d50lj3\"><span class=\"d-note\">Added</span> <span class=\"big svelte-1d50lj3\"> <!></span> <!> <div class=\"levels svelte-1d50lj3\"><span class=\"svelte-1d50lj3\"><span class=\"d-note\">Start</span><b class=\"svelte-1d50lj3\"> </b></span> <span class=\"end svelte-1d50lj3\"><span class=\"d-note\">End</span><b class=\"svelte-1d50lj3\"> </b></span></div></section> <!> <div class=\"d-figs three\"></div> <section class=\"d-card\"><div class=\"d-head\"><h2>Cost</h2><b class=\"amount svelte-1d50lj3\"> </b></div> <!> <!></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Charging speed</h2><span class=\"d-note\">kW against charge level</span></div> <!></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Battery energy</h2><span class=\"d-note\">from the car, kWh</span></div> <!></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Charge level</h2><span class=\"d-note\">from the cloud, %</span></div> <!></section> <section class=\"d-card\"><dl class=\"d-rows foot\"><div><dt>Outside temperature</dt><dd> </dd></div></dl></section>", 1);
function Xp(e, t) {
	nt(t, !0);
	let n = ba(t, "isAdmin", 3, !1), r = /* @__PURE__ */ H(null), i = /* @__PURE__ */ H(""), a = /* @__PURE__ */ H(null), o = /* @__PURE__ */ H(""), s = /* @__PURE__ */ H(!1), c = /* @__PURE__ */ z(() => Y(r)?.charge), l = /* @__PURE__ */ z(() => Y(r)?.cost?.spot == null && Y(c)?.lat != null), u = /* @__PURE__ */ z(() => Y(c)?.energy_source === "soc_estimate"), d = /* @__PURE__ */ z(() => Y(r) ? uc(Y(r).series) : null), f = /* @__PURE__ */ z(() => Y(r) ? pc(Y(r).series, Y(r).capacity_wh) : null), m = /* @__PURE__ */ z(() => {
		if (!Y(f)) return null;
		let e = Y(f).x.map((e, t) => t).sort((e, t) => Y(f).x[e] - Y(f).x[t]);
		return {
			x: e.map((e) => Y(f).x[e]),
			kw: e.map((e) => Y(f).kw[e])
		};
	}), h = /* @__PURE__ */ z(() => Y(c) ? Uo(ts(Y(c).added_wh, Y(u))) : ["–", ""]), g = /* @__PURE__ */ z(() => Y(c) ? [
		as("Duration", Wo(Y(c).duration_s)),
		as("Average power", Uo(ka(Y(c).avg_w))),
		as("Range added", Y(c).range_added_m == null ? ["–", ""] : Uo(`~${Da(Y(c).range_added_m)}`))
	] : []), _ = (e, t) => t == null ? Oa(e) : `${Oa(e)} · ${Math.round(t)} %`, v = (e) => {
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
		return await t(), Ho(), U(s, !1), n;
	}
	let x = (e, n) => b(() => p("PUT", `charges/${encodeURIComponent(t.vid)}/${Y(c).start}/receipt`, { amount: e }), n);
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
		await b(() => p("POST", "spots", l), n) && U(a, null);
	}
	{
		let p = (e) => {
			Le();
			var t = Gr();
			J((e) => Q(t, e), [() => es(Y(c))]), Z(e, t);
		}, b = (e) => {
			var t = Lp(), n = G(t), r = K(n, !0), i = q(n, 2), a = (e) => {
				var t = Ip(), n = W(t), r = (e) => {
					Z(e, Pp());
				};
				$(n, (e) => {
					Y(c).times_source === "cloud" && e(r);
				});
				var i = q(n, 2), a = (e) => {
					Z(e, Fp());
				};
				$(i, (e) => {
					Y(u) && e(a);
				}), I(t), Z(e, t);
			};
			$(i, (e) => {
				(Y(c).times_source === "cloud" || Y(u)) && e(a);
			}), J((e) => Q(r, e), [() => Qo(Y(c).start, Y(c).end)]), Z(e, t);
		}, C = (e, t = O, u = O) => {
			var p = Yp(), y = G(p), b = q(W(y), 2), C = W(b, !0), w = q(C), T = (e) => {
				var t = Rp(), n = G(t, !0);
				n.nodeValue = " ";
				var r = K(q(n), !0);
				J(() => Q(r, Y(h)[1])), Z(e, t);
			};
			$(w, (e) => {
				Y(h)[1] && e(T);
			}), I(b);
			var E = q(b, 2);
			Ts(E, {
				get from() {
					return Y(c).start_pct;
				},
				get to() {
					return Y(c).end_pct;
				},
				full: !0
			});
			var D = q(E, 2), ee = W(D), te = K(q(W(ee)), !0);
			I(ee);
			var k = q(ee, 2), A = K(q(W(k)), !0);
			I(k), I(D), I(y);
			var ne = q(y, 2), j = (e) => {
				{
					let t = /* @__PURE__ */ z(() => [{
						lat: Y(c).lat,
						lon: Y(c).lon,
						kind: "charge"
					}]);
					Np(e, {
						get dots() {
							return Y(t);
						},
						height: 180
					});
				}
			};
			$(ne, (e) => {
				Y(c).lat != null && Y(c).lon != null && e(j);
			});
			var re = q(ne, 2);
			mi(re, 21, () => Y(g), (e) => e.label, (e, t) => {
				Ap(e, ya(() => Y(t), { size: "small" }));
			}), I(re);
			var ie = q(re, 2), ae = W(ie), oe = K(q(W(ae)), !0);
			I(ae);
			var M = q(ae, 2), N = (e) => {
				var t = zp(), n = K(t, !0);
				J((e) => Q(n, e), [() => ps(Y(r).cost)]), Z(e, t);
			};
			$(M, (e) => {
				(Y(c).end != null || Y(r).cost.amount != null) && e(N);
			});
			var se = q(M, 2), ce = (e) => {
				var t = Wp(), n = G(t), c = W(n), d = q(W(c));
				$i(d), I(c);
				var f = q(c, 2), p = q(f, 2), m = (e) => {
					var t = Bp();
					J(() => t.disabled = Y(s)), Pr("click", t, () => x(null, u())), Z(e, t);
				};
				$(p, (e) => {
					Y(r).cost.basis === "receipt" && e(m);
				}), I(n);
				var h = q(n, 2), g = (e) => {
					var t = Kr(), n = G(t), r = (e) => {
						var t = Vp(), n = W(t), r = q(W(n));
						$i(r), I(n);
						var i = q(n, 2), o = q(W(i));
						$i(o), I(i);
						var c = q(i, 2), l = q(W(c));
						$i(l), I(c);
						var d = q(c, 2), f = q(W(d));
						$i(f), I(d);
						var p = q(d, 2), m = q(p, 2);
						I(t), J(() => p.disabled = Y(s)), Nr("submit", t, (e) => S(e, u())), oa(r, () => Y(a).name, (e) => Y(a).name = e), oa(o, () => Y(a).per_kwh, (e) => Y(a).per_kwh = e), oa(l, () => Y(a).start_fee, (e) => Y(a).start_fee = e), oa(f, () => Y(a).per_min, (e) => Y(a).per_min = e), Pr("click", m, () => U(a, null)), Z(e, t);
					}, i = (e) => {
						var t = Hp();
						Pr("click", K(t), () => U(a, {
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
					var t = Up(), n = K(t, !0);
					J(() => Q(n, Y(o))), Z(e, t);
				};
				$(_, (e) => {
					Y(o) && e(v);
				}), J(() => f.disabled = Y(s)), Nr("submit", n, (e) => {
					e.preventDefault(), x(Number(Y(i)), u());
				}), oa(d, () => Y(i), (e) => U(i, e)), Z(e, t);
			};
			$(se, (e) => {
				n() && e(ce);
			}), I(ie);
			var le = q(ie, 2), ue = q(W(le), 2), de = (e) => {
				var t = Gp(), n = G(t), r = W(n), i = K(q(W(r)), !0);
				I(r);
				var a = q(r, 2), o = K(q(W(a)), !0);
				I(a);
				var s = q(a, 2), l = K(q(W(s)), !0);
				I(s), I(n);
				var u = q(n, 2);
				{
					let e = /* @__PURE__ */ z(() => Yo(Y(f).min)), t = /* @__PURE__ */ z(() => ka(Y(c).avg_w)), n = /* @__PURE__ */ z(() => Yo(Y(f).max)), r = /* @__PURE__ */ z(() => [{
						label: "kW",
						values: Y(m).kw,
						kind: "area",
						color: "--charge"
					}]);
					Sp(u, {
						get x() {
							return Y(m).x;
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
					() => Yo(Y(f).min),
					() => ka(Y(c).avg_w),
					() => Yo(Y(f).max)
				]), Z(e, t);
			}, fe = (e) => {
				Z(e, Kp());
			};
			$(ue, (e) => {
				Y(m) ? e(de) : e(fe, -1);
			}), I(le);
			var pe = q(le, 2), me = q(W(pe), 2), he = (e) => {
				{
					let t = /* @__PURE__ */ z(() => v(Y(d).car.series[0])), n = /* @__PURE__ */ z(() => Y(d).car.series.map((e) => ({
						...e,
						color: "--energy"
					})));
					Sp(e, {
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
			}, ge = (e) => {
				Z(e, qp());
			};
			$(me, (e) => {
				Y(d)?.car ? e(he) : e(ge, -1);
			}), I(pe);
			var _e = q(pe, 2), ve = q(W(_e), 2), ye = (e) => {
				{
					let t = /* @__PURE__ */ z(() => v(Y(d).cloud.series[0])), n = /* @__PURE__ */ z(() => Y(d).cloud.series.map((e, t) => ({
						...e,
						color: t ? "--muted" : "--charge"
					})));
					Sp(e, {
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
			}, be = (e) => {
				Z(e, Jp());
			};
			$(ve, (e) => {
				Y(d)?.cloud ? e(ye) : e(be, -1);
			}), I(_e);
			var xe = q(_e, 2), Se = W(xe), Ce = W(Se), we = K(q(W(Ce)), !0);
			I(Ce), I(Se), I(xe), J((e, t, n, r) => {
				Q(C, Y(h)[0]), Q(te, e), Q(A, t), Q(oe, n), Q(we, r);
			}, [
				() => _(Y(c).start_wh, Y(c).start_pct),
				() => _(Y(c).end_wh, Y(c).end_pct),
				() => fs(Y(r).cost),
				() => is(Y(r).outside_temp_c)
			]), Z(e, p);
		}, w = /* @__PURE__ */ z(() => `charges/${encodeURIComponent(t.vid)}/${t.start}`);
		Dp(e, {
			get url() {
				return Y(w);
			},
			noun: "charge",
			accent: "--charge-text",
			onloaded: y,
			title: p,
			subtitle: b,
			body: C,
			$$slots: {
				title: !0,
				subtitle: !0,
				body: !0
			}
		});
	}
	rt();
}
Fr(["click"]);
// src/pages/TripDetail.svelte
var Zp = /* @__PURE__ */ X("<p class=\"d-sub\"> </p>"), Qp = /* @__PURE__ */ X("<span class=\"d-note\"> </span>"), $p = /* @__PURE__ */ X("<p class=\"d-note\">From your car's cloud data, approximate</p>"), em = /* @__PURE__ */ X("<div class=\"big\"> <small>/ 100</small></div>"), tm = /* @__PURE__ */ X("<div><dt> </dt><dd> </dd></div>"), nm = /* @__PURE__ */ X("<i></i>"), rm = /* @__PURE__ */ X("<li class=\"svelte-5xbjqg\"><i class=\"swatch svelte-5xbjqg\"></i><span class=\"n svelte-5xbjqg\"> </span><span> </span><span class=\"pc svelte-5xbjqg\"> </span></li>"), im = /* @__PURE__ */ X("<dl class=\"d-rows\"><div><dt>Standing</dt><dd> </dd></div></dl>"), am = /* @__PURE__ */ X("<section class=\"d-card\"><div class=\"d-head\"><h2>Driving style</h2><span class=\"d-note\"> </span></div> <!> <dl class=\"d-rows\"></dl> <div class=\"d-head bandhead\"><h2>Speed bands</h2><span class=\"d-note\">km/h · kWh/100 km · share</span></div> <div class=\"share-bar\" role=\"img\"></div> <ul class=\"bands svelte-5xbjqg\"></ul> <!></section>"), om = /* @__PURE__ */ X("<p class=\"d-msg\">No consumption data</p>"), sm = /* @__PURE__ */ X("<p class=\"d-msg\">No speed data</p>"), cm = /* @__PURE__ */ X("<section class=\"d-card\"><div class=\"d-head\"><h2>Consumption</h2><span class=\"d-note\">kWh per 0.5 km</span></div> <!> <dl class=\"d-rows\"><div><dt>Battery</dt><dd> </dd></div> <div><dt>Net</dt><dd> </dd></div> <div><dt>Gross</dt><dd> </dd></div> <div><dt>Recuperated</dt><dd> </dd></div></dl></section> <section class=\"d-card\"><div class=\"d-head\"><h2>Speed</h2><span class=\"d-note\"> </span></div> <!></section>", 1), lm = /* @__PURE__ */ X("<div class=\"cmp svelte-5xbjqg\"><div class=\"line svelte-5xbjqg\"><span> </span> <b> </b></div> <div class=\"track svelte-5xbjqg\" aria-hidden=\"true\"><i class=\"usual svelte-5xbjqg\"></i><i class=\"dot svelte-5xbjqg\"></i></div> <span class=\"d-note\"> </span></div>"), um = /* @__PURE__ */ X("<section class=\"d-card\"><h2>Compared with your usual route</h2> <p class=\"d-note\"> </p> <!></section>"), dm = /* @__PURE__ */ X("<!> <div class=\"d-figs\"><!> <!></div> <!> <!> <!> <!> <section class=\"d-card\"><dl class=\"d-rows foot\"><div><dt>Battery</dt><dd> </dd></div> <div><dt>Outside temperature</dt><dd> </dd></div> <div><dt>Odometer</dt><dd> </dd></div></dl></section>", 1);
function fm(e, t) {
	nt(t, !0);
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
			Le();
			var r = Gr();
			J((e) => Q(r, e), [() => ns(n())]), Z(e, r);
		}, c = (e, t) => {
			let n = () => (t?.()).trip;
			var r = Zp(), i = K(r, !0);
			J((e) => Q(i, e), [() => Qo(n().start, n().end)]), Z(e, r);
		}, l = (e, t = O) => {
			let s = /* @__PURE__ */ z(() => t().trip), c = /* @__PURE__ */ z(() => dc(t().series, .5)), l = /* @__PURE__ */ z(() => cc(t().series)?.speed), u = /* @__PURE__ */ z(() => (t().series?.events ?? []).map(([e, t]) => ({
				x: e,
				color: a[t]
			}))), d = /* @__PURE__ */ z(() => Y(s).style), f = /* @__PURE__ */ z(() => Y(d) ? ls(Y(d).bands, .5) : []), p = /* @__PURE__ */ z(() => Y(s).avg_speed_mps == null ? null : Y(s).avg_speed_mps * 3.6), m = /* @__PURE__ */ z(() => Y(s).max_speed_mps == null ? null : Y(s).max_speed_mps * 3.6), h = /* @__PURE__ */ z(() => Na(Y(s).wh_per_100km)), g = /* @__PURE__ */ z(() => Ko(Y(s), t().similar)), _ = /* @__PURE__ */ z(() => [
				as("Distance", Uo(Da(Y(s).distance_m))),
				as("Duration", Wo(Y(s).duration_s)),
				as("Energy used", Uo(Oa(Y(s).net_wh))),
				as("Average", Y(h) == null ? ["–", ""] : [Y(h).toFixed(1), "kWh/100 km"]),
				as("Average speed", Y(p) == null ? ["–", ""] : [Y(p).toFixed(0), "km/h"]),
				as("Recuperated", Uo(Oa(Y(s).recup_wh)))
			]), v = /* @__PURE__ */ z(() => Y(g) ? [{
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
			var y = dm(), b = G(y), x = (e) => {
				let n = /* @__PURE__ */ z(() => {
					let [e, n] = [t().route[0], t().route.at(-1)];
					return {
						a: e,
						z: n
					};
				});
				{
					let r = /* @__PURE__ */ z(() => [{
						points: t().route,
						kind: "trip"
					}]), i = /* @__PURE__ */ z(() => [{
						lat: Y(n).a[0],
						lon: Y(n).a[1],
						kind: "trip",
						role: "start"
					}, {
						lat: Y(n).z[0],
						lon: Y(n).z[1],
						kind: "trip",
						role: "end"
					}]), a = /* @__PURE__ */ z(() => rs(Y(s)));
					Np(e, {
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
			mi(C, 17, () => Y(_), (e) => e.label, (e, t) => {
				Ap(e, ya(() => Y(t)));
			});
			var w = q(C, 2);
			{
				let e = /* @__PURE__ */ z(() => ds(t().cost.total));
				Ap(w, {
					label: "Cost",
					get value() {
						return Y(e);
					},
					children: (e, n) => {
						var r = Kr(), i = G(r), a = (e) => {
							var n = Qp(), r = K(n, !0);
							J((e) => Q(r, e), [() => ms(t().cost)]), Z(e, n);
						}, o = /* @__PURE__ */ z(() => ms(t().cost));
						$(i, (e) => {
							Y(o) && e(a);
						}), Z(e, r);
					},
					$$slots: { default: !0 }
				});
			}
			I(S);
			var T = q(S, 2), E = (e) => {
				Z(e, $p());
			};
			$(T, (e) => {
				Y(s).approx && e(E);
			});
			var D = q(T, 2), ee = (e) => {
				var t = am(), n = W(t), r = K(q(W(n)), !0);
				I(n);
				var i = q(n, 2), a = (e) => {
					var t = em(), n = W(t, !0);
					Le(), I(t), J(() => Q(n, Y(d).score)), Z(e, t);
				};
				$(i, (e) => {
					Y(d).score != null && e(a);
				});
				var c = q(i, 2);
				mi(c, 21, () => os, ([e, t]) => e, (e, t) => {
					var n = /* @__PURE__ */ z(() => A(Y(t), 2));
					let r = () => Y(n)[0], i = () => Y(n)[1];
					var a = tm(), o = W(a), c = K(o, !0), l = K(q(o));
					I(a), J((e) => {
						Q(c, i()), Q(l, `${Y(d)[r()][0] ?? ""} · ${e ?? ""}`);
					}, [() => cs(Y(d)[r()][0], Y(s).distance_m / 1e3)]), Z(e, a);
				}), I(c);
				var l = q(c, 4);
				mi(l, 23, () => Y(f), (e) => e.name, (e, t, n) => {
					var r = Kr(), i = G(r), a = (e) => {
						var r = nm();
						let i;
						J(() => i = Vi(r, "", i, {
							flex: `${Y(t).share ?? ""} 1 0`,
							background: "var(--trip)",
							opacity: o[Y(n)]
						})), Z(e, r);
					};
					$(i, (e) => {
						Y(t).share > 0 && e(a);
					}), Z(e, r);
				}), I(l);
				var u = q(l, 2);
				mi(u, 23, () => Y(f), (e) => e.name, (e, t, n) => {
					var r = rm(), i = W(r);
					let a;
					var s = q(i), c = K(s, !0), l = q(s), u = K(l, !0), d = K(q(l));
					I(r), J((e, r) => {
						a = Vi(i, "", a, { opacity: o[Y(n)] }), Q(c, Y(t).name), Q(u, e), Q(d, `${r ?? ""} %`);
					}, [() => Y(t).kwhPer100 == null ? "–" : Y(t).kwhPer100.toFixed(1), () => Math.round(Y(t).share * 100)]), Z(e, r);
				}), I(u);
				var p = q(u, 2), m = (e) => {
					var t = im(), n = W(t), r = K(q(W(n)), !0);
					I(n), I(t), J((e) => Q(r, e), [() => Oa(Y(d).standing)]), Z(e, t);
				};
				$(p, (e) => {
					Y(d).standing != null && e(m);
				}), I(t), J((e, t) => {
					Q(r, e), na(l, "aria-label", `Distance by speed band: ${t ?? ""}`);
				}, [() => ss(Y(d).score), () => Y(f).map((e) => `${e.name} km/h ${Math.round(e.share * 100)} %`).join(", ")]), Z(e, t);
			};
			$(D, (e) => {
				Y(d) && e(ee);
			});
			var te = q(D, 2), k = (e) => {
				var t = cm(), r = G(t), a = q(W(r), 2), o = (e) => {
					{
						let t = /* @__PURE__ */ z(() => Oa(Y(s).net_wh)), n = /* @__PURE__ */ z(() => Oa(Y(s).gross_wh)), r = /* @__PURE__ */ z(() => Oa(Y(s).recup_wh)), i = /* @__PURE__ */ z(() => [
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
						Sp(e, {
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
					Z(e, om());
				};
				$(a, (e) => {
					Y(c) ? e(o) : e(d, -1);
				});
				var f = q(a, 2), h = W(f), g = K(q(W(h)), !0);
				I(h);
				var _ = q(h, 2), v = K(q(W(_)), !0);
				I(_);
				var y = q(_, 2), b = K(q(W(y)), !0);
				I(y);
				var x = q(y, 2), S = K(q(W(x)), !0);
				I(x), I(f), I(r);
				var C = q(r, 2), w = W(C), T = K(q(W(w)));
				I(w);
				var E = q(w, 2), D = (e) => {
					{
						let t = /* @__PURE__ */ z(() => i(Y(m))), n = /* @__PURE__ */ z(() => i(Y(p))), r = /* @__PURE__ */ z(() => Y(u).length ? `, ${Y(u).length} driving events marked` : ""), a = /* @__PURE__ */ z(() => Y(l).series.map((e) => ({
							...e,
							kind: "area",
							color: "--trip"
						})));
						Sp(e, {
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
				}, O = (e) => {
					Z(e, sm());
				};
				$(E, (e) => {
					Y(l) ? e(D) : e(O, -1);
				}), I(C), J((e, t, n, r, i, a) => {
					Q(g, e), Q(v, t), Q(b, n), Q(S, r), Q(T, `max ${i ?? ""} · average ${a ?? ""}`);
				}, [
					() => Xo(n(Y(s).start_wh), n(Y(s).end_wh), "kWh"),
					() => Oa(Y(s).net_wh),
					() => Oa(Y(s).gross_wh),
					() => Oa(Y(s).recup_wh),
					() => i(Y(m)),
					() => i(Y(p))
				]), Z(e, t);
			};
			$(te, (e) => {
				Y(s).approx || e(k);
			});
			var ne = q(te, 2), j = (e) => {
				var n = um(), r = q(W(n), 2), i = K(r);
				mi(q(r, 2), 17, () => Y(v), (e) => e.name, (e, t) => {
					let n = /* @__PURE__ */ z(() => Jo(Y(t).m.delta, Y(t).unit, Y(t).digits));
					var r = lm(), i = W(r), a = W(i), o = K(a, !0), s = q(a, 2);
					let c;
					var l = K(s, !0);
					I(i);
					var u = q(i, 2), d = q(W(u));
					let f;
					I(u);
					var p = K(q(u, 2));
					I(r), J((e, r, i) => {
						Q(o, Y(t).name), c = zi(s, 1, "svelte-5xbjqg", null, c, {
							good: Y(n) !== "same" && Y(t).m.delta < 0,
							worse: Y(n) !== "same" && Y(t).m.delta > 0
						}), Q(l, Y(n)), f = Vi(d, "", f, { left: e }), Q(p, `${r ?? ""} · usually ${i ?? ""}`);
					}, [
						() => `${qo(Y(t).m.mine, Y(t).m.usual) ?? ""}%`,
						() => Y(t).text(Y(t).m.mine),
						() => Y(t).text(Y(t).m.usual)
					]), Z(e, r);
				}), I(n), J((e) => Q(i, `${e ?? ""}, ${t().similar.n ?? ""} earlier ${t().similar.n === 1 ? "trip" : "trips"}`), [() => ns(Y(s))]), Z(e, n);
			};
			$(ne, (e) => {
				Y(v).length && e(j);
			});
			var re = q(ne, 2), ie = W(re), ae = W(ie), oe = K(q(W(ae)), !0);
			I(ae);
			var M = q(ae, 2), N = K(q(W(M)), !0);
			I(M);
			var se = q(M, 2), ce = K(q(W(se)), !0);
			I(se), I(ie), I(re), J((e, t, n) => {
				Q(oe, e), Q(N, t), Q(ce, n);
			}, [
				() => Xo(r(Y(s).start_pct), r(Y(s).end_pct), "%"),
				() => is(Y(s).avg_temp_c),
				() => Xo(r(Y(s).odometer_start_km), r(Y(s).odometer_end_km), "km")
			]), Z(e, y);
		}, u = /* @__PURE__ */ z(() => `trips/${encodeURIComponent(t.vid)}/${t.start}`);
		Dp(e, {
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
	rt();
}
// src/pages/Activity.svelte
var pm = !1, mm = /* @__PURE__ */ X("<span class=\"svelte-hc7ao7\"> </span>"), hm = /* @__PURE__ */ X("<li class=\"svelte-hc7ao7\"><!></li>"), gm = /* @__PURE__ */ X("<section><h2 class=\"chrome svelte-hc7ao7\"> <!></h2> <ul class=\"svelte-hc7ao7\"></ul></section>"), _m = /* @__PURE__ */ X("<p class=\"msg\"> </p>"), vm = /* @__PURE__ */ X("<div class=\"msg\" role=\"alert\"><p>Couldn't load your activity.</p> <button class=\"btn\">Retry</button></div>"), ym = /* @__PURE__ */ X("<p class=\"msg\" aria-busy=\"true\">Loading…</p>"), bm = /* @__PURE__ */ X("<div aria-hidden=\"true\"></div>"), xm = /* @__PURE__ */ X("<div><div><h1 class=\"page-title\">Activity</h1> <!> <div class=\"filter svelte-hc7ao7\"><!></div> <div><!> <!></div> <!></div> <!></div>");
function Sm(e, t) {
	nt(t, !0);
	let n = ba(t, "detail", 3, null), r = ba(t, "isAdmin", 3, !1), i = [
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
	}, o = /* @__PURE__ */ H(sn([])), s = /* @__PURE__ */ H(void 0), c = /* @__PURE__ */ H(sn(Io.filter)), l = /* @__PURE__ */ H(!1), u, d = /* @__PURE__ */ z(() => Mo(Io.days, Y(c))), f = /* @__PURE__ */ z(() => n() && jo({
		kind: n().kind,
		vehicle_id: n().vid,
		start: n().start
	})), p = /* @__PURE__ */ z(() => n() ? No(Io.days, Io.filter, n().kind, n().vid, n().start) : {
		prev: null,
		next: null
	}), g = (e) => n()?.kind === e.kind && n().vid === e.vehicle_id && n().start === e.start, _ = (e) => {
		e.button !== 0 || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || (Fo({ detailOpen: !!n() }) === "replace" ? (e.preventDefault(), location.replace(e.currentTarget.getAttribute("href"))) : pm = !0);
	}, v = () => pm ? history.back() : location.replace("#/activity");
	kn(() => {
		Y(f) && ro.split && u?.querySelector("[aria-current=page]")?.closest("li").scrollIntoView({ block: "nearest" });
	});
	let y = "";
	kn(() => {
		if (Y(f)) return void (y = Y(f));
		pm = !1, y && u && ([...u.querySelectorAll("a")].find((e) => e.getAttribute("href") === y)?.focus({ preventScroll: !0 }), y = "");
	});
	let b = h();
	async function x() {
		let e = b.next();
		try {
			let n = await m(`overview?view=${encodeURIComponent(t.view)}`);
			e.current && U(o, n.vehicles, !0);
		} catch {}
	}
	kn(() => (Bo(t.view), x(), b.reset)), kn(() => {
		let e = Io.filter;
		if (e === wr(() => Y(c))) return void U(l, !1);
		U(l, !0);
		let t = po("--fade") / 2, n = setTimeout(() => (U(c, e, !0), U(l, !1)), t);
		return () => clearTimeout(n);
	}), kn(() => {
		let e = () => {
			document.visibilityState === "visible" && (Ho(), x());
		}, t = setInterval(e, 6e4);
		return document.addEventListener("visibilitychange", e), () => {
			clearInterval(t), document.removeEventListener("visibilitychange", e);
		};
	}), kn(() => {
		if (!Y(s) || Io.next == null || Io.loading || Io.error) return;
		let e = new IntersectionObserver(([e]) => e.isIntersecting && Vo(), { rootMargin: "400px" });
		return e.observe(Y(s)), () => e.disconnect();
	});
	var S = xm();
	let C;
	var w = W(S);
	let T;
	var E = q(W(w), 2);
	Ps(E, { get vehicles() {
		return Y(o);
	} });
	var D = q(E, 2);
	Rs(W(D), {
		get options() {
			return i;
		},
		label: "Show",
		get value() {
			return Io.filter;
		},
		set value(e) {
			Io.filter = e;
		}
	}), I(D);
	var O = q(D, 2);
	let ee;
	var te = W(O);
	mi(te, 17, () => Y(d), (e) => e.date, (e, t) => {
		let n = /* @__PURE__ */ z(() => Ma(Y(t).summary));
		var r = gm(), i = W(r), a = W(i, !0), o = q(a), s = (e) => {
			var t = mm(), r = K(t);
			J(() => Q(r, ` · ${Y(n) ?? ""}`)), Z(e, t);
		};
		$(o, (e) => {
			Y(n) && e(s);
		}), I(i);
		var c = q(i, 2);
		mi(c, 21, () => Y(t).items, (e) => `${e.kind}/${e.vehicle_id}/${e.start}`, (e, t) => {
			var n = hm(), r = W(n), i = (e) => {
				{
					let n = /* @__PURE__ */ z(() => g(Y(t)));
					oc(e, {
						get item() {
							return Y(t);
						},
						get current() {
							return Y(n);
						},
						onclick: _
					});
				}
			}, a = (e) => {
				{
					let n = /* @__PURE__ */ z(() => g(Y(t)));
					As(e, {
						get item() {
							return Y(t);
						},
						get current() {
							return Y(n);
						},
						onclick: _
					});
				}
			};
			$(r, (e) => {
				Y(t).kind === "trip" ? e(i) : e(a, -1);
			}), I(n), Z(e, n);
		}), I(c), I(r), J((e) => Q(a, e), [() => Qa(Y(t).date, Io.today)]), Z(e, r);
	});
	var k = q(te, 2), A = (e) => {
		var t = _m(), n = K(t, !0);
		J(() => Q(n, a[Y(c)])), Z(e, t);
	};
	$(k, (e) => {
		Y(d).length || Io.loading || Io.error || Io.next != null || e(A);
	}), I(O), ha(O, (e) => u = e, () => u);
	var ne = q(O, 2), j = (e) => {
		var n = vm(), r = q(W(n), 2);
		I(n), Pr("click", r, () => Io.days.length ? Vo() : Bo(t.view)), Z(e, n);
	}, re = (e) => {
		Z(e, ym());
	}, ie = (e) => {
		var t = bm();
		ha(t, (e) => U(s, e), () => Y(s)), Z(e, t);
	};
	$(ne, (e) => {
		Io.error ? e(j) : Io.loading ? e(re, 1) : Io.next != null && e(ie, 2);
	}), I(w);
	var ae = q(w, 2), oe = (e) => {
		qs(e, {
			get id() {
				return Y(f);
			},
			onclose: v,
			get prev() {
				return Y(p).prev;
			},
			get next() {
				return Y(p).next;
			},
			children: (e, t) => {
				var i = Kr(), a = G(i), o = (e) => {
					fm(e, {
						get vid() {
							return n().vid;
						},
						get start() {
							return n().start;
						}
					});
				}, s = (e) => {
					Xp(e, {
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
	$(ae, (e) => {
		n() && e(oe);
	}), I(S), J(() => {
		C = zi(S, 1, "split svelte-hc7ao7", null, C, { two: ro.split && n() }), T = zi(w, 1, "page svelte-hc7ao7", null, T, { wide: ro.wide }), ee = zi(O, 1, "list svelte-hc7ao7", null, ee, { out: Y(l) });
	}), Z(e, S), rt();
}
Fr(["click"]);
// src/lib/cars.js
var Cm = "/_my_redirect/config_flow_start?domain=car_insights", wm = "/config/integrations/integration/car_insights", Tm = (e) => ({
	active: e.filter((e) => !e.archived),
	archived: e.filter((e) => e.archived)
}), Em = (e) => e.history_deleted === !1 ? "Its history could not be deleted; try Delete history again." : null, Dm = "Car Insights stopped with its last car.", Om = (e, t) => t && e.status === 503;
function km(e) {
	window.top.history.pushState(null, "", e), window.top.dispatchEvent(new CustomEvent("location-changed"));
}
// src/pages/settings/FixedCosts.svelte
var Am = /* @__PURE__ */ X("<div class=\"row split\"><span> <br/><span class=\"muted\"> </span></span> <button type=\"button\" class=\"danger press\">Delete</button></div> <form class=\"row split\"><label class=\"grow inline\">End date <input name=\"end\" type=\"date\"/></label> <button class=\"press\" type=\"submit\">Save</button></form>", 1), jm = /* @__PURE__ */ X("<p class=\"row muted\">No fixed costs.</p>"), Mm = /* @__PURE__ */ X("<option> </option>"), Nm = /* @__PURE__ */ X("<form class=\"row fields\"><label class=\"field wide\">Name<input required=\"\" maxlength=\"40\"/></label> <label class=\"field\">Amount (€)<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" required=\"\"/></label> <label class=\"field\">Period<select></select></label> <label class=\"field\">Start<input type=\"date\" required=\"\"/></label> <label class=\"field\">End (optional)<input type=\"date\"/></label> <button class=\"press\" type=\"submit\">Add</button> <button class=\"press\" type=\"button\">Cancel</button></form>"), Pm = /* @__PURE__ */ X("<div class=\"row\"><button class=\"press\" type=\"button\">Add fixed cost</button></div>"), Fm = /* @__PURE__ */ X("<h3> </h3> <div class=\"list card\"><!> <!></div>", 1), Im = /* @__PURE__ */ X("<h2>Fixed costs</h2> <p class=\"note caption\">Monthly card fees, insurance and the like. Empty the end date to run a cost on.</p> <!>", 1);
function Lm(e, t) {
	nt(t, !0);
	let n = [
		"month",
		"quarter",
		"year",
		"once"
	], r = () => ({
		name: "",
		amount: "",
		period: "month",
		start: Ja(),
		end: ""
	}), i = /* @__PURE__ */ H(null), a = /* @__PURE__ */ H(sn(r())), o = /* @__PURE__ */ H(!1), s = (e) => t.data.prices.fixed_costs.filter((t) => t.vehicle_id === e);
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
		U(o, !0), await t.change(() => p("POST", `vehicles/${Y(i)}/fixed_costs`, n)) && U(i, null), U(o, !1);
	}
	async function u(e, n) {
		e.preventDefault();
		let r = e.currentTarget.elements.end;
		r.value !== (n.end ?? "") && (await t.change(() => p("PUT", `fixed_costs/${n.id}`, { end: r.value || null })) || (r.value = n.end ?? ""));
	}
	let d = (e) => confirm(`Delete "${e.name}"?`) && t.change(() => p("DELETE", `fixed_costs/${e.id}`)), f = (e) => e.focus();
	var m = Im();
	mi(q(G(m), 4), 17, () => t.data.vehicles, (e) => e.id, (e, t) => {
		var r = Fm(), p = G(r), m = K(p, !0), h = q(p, 2), g = W(h);
		mi(g, 17, () => s(Y(t).id), (e) => e.id, (e, t) => {
			var n = Am(), r = G(n), i = W(r), a = W(i, !0), o = K(q(a, 2));
			I(i);
			var s = q(i, 2);
			I(r);
			var c = q(r, 2), l = W(c), f = q(W(l));
			$i(f), I(l);
			var p = q(l, 2);
			I(c), J((e) => {
				Q(a, Y(t).name), Q(o, `${e ?? ""} · ${Y(t).period ?? ""} · from ${Y(t).start ?? ""}${Y(t).end ? ` to ${Y(t).end}` : ""}`), na(s, "aria-label", `Delete ${Y(t).name}`), na(f, "aria-label", `End date of ${Y(t).name}`), na(f, "min", Y(t).start), ea(f, Y(t).end ?? ""), na(p, "aria-label", `Save end date of ${Y(t).name}`);
			}, [() => ds(Y(t).amount)]), Pr("click", s, () => d(Y(t))), Nr("submit", c, (e) => u(e, Y(t))), Z(e, n);
		}, (e) => {
			Z(e, jm());
		});
		var _ = q(g, 2), v = (e) => {
			var t = Nm(), r = W(t), s = q(W(r));
			$i(s), Ni(s, () => f), I(r);
			var c = q(r, 2), u = q(W(c));
			$i(u), I(c);
			var d = q(c, 2), p = q(W(d));
			mi(p, 21, () => n, ui, (e, t) => {
				var n = Mm(), r = K(n, !0), i = {};
				J(() => {
					Q(r, Y(t)), i !== (i = Y(t)) && (n.value = (n.__value = i) ?? "");
				}), Z(e, n);
			}), I(p), Gi(p), I(d);
			var m = q(d, 2), h = q(W(m));
			$i(h), I(m);
			var g = q(m, 2), _ = q(W(g));
			$i(_), I(g);
			var v = q(g, 2), y = q(v, 2);
			I(t), J(() => {
				na(_, "min", Y(a).start), v.disabled = Y(o);
			}), Nr("submit", t, l), oa(s, () => Y(a).name, (e) => Y(a).name = e), oa(u, () => Y(a).amount, (e) => Y(a).amount = e), Ki(p, () => Y(a).period, (e) => Y(a).period = e), oa(h, () => Y(a).start, (e) => Y(a).start = e), oa(_, () => Y(a).end, (e) => Y(a).end = e), Pr("click", y, () => U(i, null)), Z(e, t);
		}, y = (e) => {
			var n = Pm();
			Pr("click", K(n), () => c(Y(t).id)), Z(e, n);
		};
		$(_, (e) => {
			Y(i) === Y(t).id ? e(v) : e(y, -1);
		}), I(h), J(() => Q(m, Y(t).name)), Z(e, r);
	}), Z(e, m), rt();
}
Fr(["click"]);
// src/pages/settings/Prices.svelte
var Rm = /* @__PURE__ */ X("<form class=\"row fields\"><label class=\"field\">€/kWh<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" required=\"\"/></label> <label class=\"field\">Start fee<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\"/></label> <label class=\"field\">€/min<input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\" placeholder=\"0\"/></label> <label class=\"field\">Valid from<input type=\"date\" required=\"\"/></label> <button class=\"press\" type=\"submit\">Save</button> <button class=\"press\" type=\"button\">Cancel</button></form>"), zm = /* @__PURE__ */ X("<div class=\"row split\"><span> <br/><span class=\"muted\"> </span></span> <button class=\"press\" type=\"button\">Change</button></div> <!>", 1), Bm = /* @__PURE__ */ X("<form class=\"row\"><label class=\"grow\"><span class=\"sr\">Location name</span><input required=\"\" maxlength=\"40\"/></label> <button class=\"press\" type=\"submit\">Rename</button> <button type=\"button\" class=\"danger press\">Delete</button></form> <div class=\"row split\"><span class=\"muted\"> </span> <button class=\"press\" type=\"button\">Change</button></div> <!>", 1), Vm = /* @__PURE__ */ X("<h3>Charge locations</h3> <div class=\"list card\"></div>", 1), Hm = /* @__PURE__ */ X("<h2>Prices</h2> <p class=\"note caption\">A new price counts from its date.</p> <div class=\"list card\"></div> <!>", 1);
function Um(e, t) {
	nt(t, !0);
	let n = (e, t = O) => {
		var n = Kr(), a = G(n), s = (e) => {
			var t = Rm(), n = W(t), a = q(W(n));
			$i(a), Ni(a, () => g), I(n);
			var s = q(n, 2), c = q(W(s));
			$i(c), I(s);
			var l = q(s, 2), u = q(W(l));
			$i(u), I(l);
			var d = q(l, 2), p = q(W(d));
			$i(p), I(d);
			var m = q(d, 2), h = q(m, 2);
			I(t), J(() => m.disabled = Y(r)), Nr("submit", t, f), oa(a, () => Y(o).per_kwh, (e) => Y(o).per_kwh = e), oa(c, () => Y(o).start_fee, (e) => Y(o).start_fee = e), oa(u, () => Y(o).per_min, (e) => Y(o).per_min = e), oa(p, () => Y(o).from, (e) => Y(o).from = e), Pr("click", h, () => U(i, null)), Z(e, t);
		};
		$(a, (e) => {
			Y(i) === t() && e(s);
		}), Z(e, n);
	}, r = /* @__PURE__ */ H(!1), i = /* @__PURE__ */ H(null), a = [], o = /* @__PURE__ */ H(sn({
		per_kwh: "",
		start_fee: "",
		per_min: "",
		from: ""
	})), s = /* @__PURE__ */ H(sn({}));
	kn(() => {
		U(s, Object.fromEntries(t.data.prices.spots.map((e) => [e.id, e.name])), !0);
	});
	let c = () => Date.now(), l = (e) => e ? [
		`${ds(e.per_kwh)}/kWh`,
		e.start_fee && `start fee ${ds(e.start_fee)}`,
		e.per_min && `${ds(e.per_min)}/min`
	].filter(Boolean).join(" · ") : "Not set", u = /* @__PURE__ */ z(() => [["ac", "Default AC price"], ["dc", "Default DC price"]].map(([e, n]) => ({
		id: e,
		label: n,
		list: t.data.prices[e]
	})));
	function d(e, t) {
		a = t;
		let n = vs(a, c());
		U(o, {
			per_kwh: n?.per_kwh ?? "",
			start_fee: n?.start_fee ?? "",
			per_min: n?.per_min ?? "",
			from: Ja()
		}, !0), U(i, e, !0);
	}
	async function f(e) {
		e.preventDefault();
		let n = {
			valid_from: gs(a, Y(o).from),
			per_kwh: Number(Y(o).per_kwh),
			start_fee: Number(Y(o).start_fee),
			per_min: Number(Y(o).per_min)
		};
		U(r, !0), await t.change(() => p("PUT", `prices/${Y(i)}`, n)) && U(i, null), U(r, !1);
	}
	let m = (e) => t.change(() => p("PUT", `spots/${e.id}`, { name: Y(s)[e.id] })), h = (e) => confirm(`Delete "${e.name}"? Its charges go back to the default price.`) && t.change(() => p("DELETE", `spots/${e.id}`)), g = (e) => e.focus();
	var _ = Hm(), v = q(G(_), 4);
	mi(v, 21, () => Y(u), (e) => e.id, (e, t) => {
		var r = zm(), i = G(r), a = W(i), o = W(a, !0), s = K(q(o, 2), !0);
		I(a);
		var u = q(a, 2);
		I(i);
		var f = q(i, 2);
		n(f, () => Y(t).id), J((e) => {
			Q(o, Y(t).label), Q(s, e), na(u, "aria-label", `Change ${Y(t).label}`);
		}, [() => l(vs(Y(t).list, c()))]), Pr("click", u, () => d(Y(t).id, Y(t).list)), Z(e, r);
	}), I(v);
	var y = q(v, 2), b = (e) => {
		var r = Vm(), i = q(G(r), 2);
		mi(i, 21, () => t.data.prices.spots, (e) => e.id, (e, t) => {
			var r = Bm(), i = G(r), a = W(i), o = q(W(a));
			$i(o), I(a);
			var u = q(a, 2), f = q(u, 2);
			I(i);
			var p = q(i, 2), g = W(p), _ = K(g, !0), v = q(g, 2);
			I(p);
			var y = q(p, 2);
			n(y, () => Y(t).id), J((e) => {
				na(u, "aria-label", `Rename ${Y(t).name}`), na(f, "aria-label", `Delete ${Y(t).name}`), Q(_, e), na(v, "aria-label", `Change price of ${Y(t).name}`);
			}, [() => l(vs(Y(t).tariffs, c()))]), Nr("submit", i, (e) => {
				e.preventDefault(), m(Y(t));
			}), oa(o, () => Y(s)[Y(t).id], (e) => Y(s)[Y(t).id] = e), Pr("click", f, () => h(Y(t))), Pr("click", v, () => d(Y(t).id, Y(t).tariffs)), Z(e, r);
		}), I(i), Z(e, r);
	};
	$(y, (e) => {
		t.data.prices.spots.length && e(b);
	}), Z(e, _), rt();
}
Fr(["click"]);
// src/pages/Settings.svelte
var Wm = /* @__PURE__ */ X("<p class=\"err svelte-1ozf5k3\" role=\"alert\"> </p>"), Gm = /* @__PURE__ */ X("<p class=\"note\" role=\"status\"> </p>"), Km = /* @__PURE__ */ X("<form class=\"row\"><label class=\"grow\"><span class=\"sr\">Group name</span><input required=\"\" maxlength=\"40\"/></label> <button class=\"press\" type=\"submit\">Rename</button> <button type=\"button\" class=\"danger press\">Delete</button></form>"), qm = /* @__PURE__ */ X("<p class=\"row muted\">No groups yet.</p>"), Jm = /* @__PURE__ */ X("<button class=\"danger press\" type=\"button\">Keep its history</button> <button class=\"danger press\" type=\"button\">Delete everything</button> <button class=\"press\" type=\"button\">Cancel</button>", 1), Ym = /* @__PURE__ */ X("<button class=\"danger press\" type=\"button\">Remove car</button>"), Xm = /* @__PURE__ */ X("<option> </option>"), Zm = /* @__PURE__ */ X("<label class=\"row split\"> <input type=\"number\" min=\"0\" step=\"any\" inputmode=\"decimal\"/></label>"), Qm = /* @__PURE__ */ X("<label class=\"row split\"><span> <span class=\"muted\"> </span></span> <input type=\"checkbox\"/></label>"), $m = /* @__PURE__ */ X("<p class=\"row muted\">No users yet.</p>"), eh = /* @__PURE__ */ X("<section><h3> </h3> <div class=\"row\"><button class=\"press\" type=\"button\">Configure</button> <!></div> <div class=\"list card\"><label class=\"row split\">Cost group <select><option>No group</option><!></select></label> <!></div> <fieldset><legend>Viewers</legend> <div class=\"list card\"></div></fieldset></section>"), th = /* @__PURE__ */ X("<div class=\"row split\"><span> <span class=\"muted\">Archived</span></span> <button class=\"danger press\" type=\"button\">Delete history</button></div>"), nh = /* @__PURE__ */ X("<h2>Archived</h2> <div class=\"list card\"></div>", 1), rh = /* @__PURE__ */ X("<h2>Cost groups</h2> <div class=\"list card\"><!> <form class=\"row\"><label class=\"grow\"><span class=\"sr\">New group</span><input required=\"\" maxlength=\"40\" placeholder=\"New group\"/></label> <button class=\"press\" type=\"submit\">Add group</button></form></div> <!> <h2>Cars</h2> <p class=\"note caption\">Users appear here after they open this page once. Administrators always see every car.</p> <div class=\"row\"><button class=\"press\" type=\"button\">Add car</button></div> <!> <!> <!>", 1), ih = /* @__PURE__ */ X("<p class=\"msg\">Loading…</p>"), ah = /* @__PURE__ */ X("<div class=\"page settings svelte-1ozf5k3\"><h1 class=\"page-title\">Settings</h1> <!> <!> <!></div>");
function oh(e, t) {
	nt(t, !0);
	let n = /* @__PURE__ */ H(null), r = /* @__PURE__ */ H(""), i = /* @__PURE__ */ H(""), a = /* @__PURE__ */ H(sn({})), o = /* @__PURE__ */ H(null), s = !1, c = /* @__PURE__ */ H(!1), l = /* @__PURE__ */ H(void 0), u = /* @__PURE__ */ H(0), d = /* @__PURE__ */ z(() => Y(u) > 0), f = h(), g = (e) => U(r, e.detail || `Could not save (${e.message})`, !0);
	async function _() {
		let e = f.next(), t = s;
		s = !1;
		try {
			let t = await m("settings");
			if (!e.current) return;
			U(n, t, !0), U(c, !1), U(a, Object.fromEntries(t.groups.map((e) => [e.id, e.name])), !0);
		} catch (i) {
			if (!e.current) return;
			Om(i, t) ? (U(c, !0), U(n, {
				...Y(n),
				vehicles: []
			}, !0)) : U(r, `Could not load (${i.message})`);
		}
	}
	async function v(e) {
		U(r, ""), rn(u);
		let t = !0;
		try {
			await e();
		} catch (e) {
			t = !1, g(e);
		}
		return await _(), rn(u, -1), t;
	}
	async function y(e, t, n) {
		let r = e.currentTarget;
		await v(t) || n(r), await xr(), r.focus();
	}
	async function b(e, t) {
		let n = document.activeElement;
		await e(), await xr(), (n?.isConnected ? n : t)?.focus();
	}
	let x = () => b(async () => {
		await v(() => p("POST", "groups", { name: Y(i) })), Y(r) || U(i, "");
	}), S = (e) => b(() => v(() => p("PUT", `groups/${e.id}`, { name: Y(a)[e.id] }))), C = (e) => confirm(`Delete group "${e.name}"?`) && v(() => p("DELETE", `groups/${e.id}`)), w = (e, t, n) => () => p("PUT", `vehicles/${e.id}`, {
		group_id: t,
		viewers: n
	}), T = (e, t) => (U(o, null), b(() => v(async () => {
		let n = await p("DELETE", `vehicles/${e.id}?history=${t}`);
		s = !0, U(r, Em(n) ?? "", !0);
	}), Y(l))), E = (e) => confirm(`Remove "${e.name}" and delete everything stored for it? This cannot be undone.`) && T(e, "delete"), D = (e) => confirm(`Delete the stored history of "${e.name}"? This cannot be undone.`) && b(() => v(() => p("DELETE", `vehicles/${e.id}/history`)), Y(l)), O = (e) => e.focus(), ee = (e, t) => () => p("PUT", `vehicles/${e.id}/card`, t);
	_();
	var te = ah(), k = q(W(te), 2), ne = (e) => {
		var t = Wm(), n = K(t, !0);
		J(() => Q(n, Y(r))), Z(e, t);
	};
	$(k, (e) => {
		Y(r) && e(ne);
	});
	var j = q(k, 2), re = (e) => {
		var t = Gm(), n = K(t, !0);
		J(() => Q(n, Dm)), Z(e, t);
	};
	$(j, (e) => {
		Y(c) && e(re);
	});
	var ie = q(j, 2), ae = (e) => {
		let t = /* @__PURE__ */ z(() => Tm(Y(n).vehicles));
		var r = rh(), s = q(G(r), 2), c = W(s);
		mi(c, 17, () => Y(n).groups, (e) => e.id, (e, t) => {
			var n = Km(), r = W(n), i = q(W(r));
			$i(i), I(r);
			var o = q(r, 2), s = q(o, 2);
			I(n), J(() => {
				o.disabled = Y(d), na(o, "aria-label", `Rename ${Y(t).name}`), s.disabled = Y(d), na(s, "aria-label", `Delete ${Y(t).name}`);
			}), Nr("submit", n, (e) => {
				e.preventDefault(), S(Y(t));
			}), oa(i, () => Y(a)[Y(t).id], (e) => Y(a)[Y(t).id] = e), Pr("click", s, () => C(Y(t))), Z(e, n);
		}, (e) => {
			Z(e, qm());
		});
		var u = q(c, 2), f = W(u), p = q(W(f));
		$i(p), I(f);
		var m = q(f, 2);
		I(u), I(s);
		var h = q(s, 2);
		Um(h, {
			get data() {
				return Y(n);
			},
			change: v
		});
		var g = q(h, 6), _ = W(g);
		ha(_, (e) => U(l, e), () => Y(l)), I(g);
		var b = q(g, 2);
		mi(b, 17, () => Y(t).active, (e) => e.id, (e, t) => {
			var r = eh(), i = W(r), a = K(i, !0), s = q(i, 2), c = W(s), l = q(c, 2), u = (e) => {
				var n = Jm(), r = G(n), i = q(r, 2), a = q(i, 2);
				Ni(a, () => O), J(() => {
					r.disabled = Y(d), i.disabled = Y(d);
				}), Pr("click", r, () => T(Y(t), "keep")), Pr("click", i, () => E(Y(t))), Pr("click", a, () => U(o, null)), Z(e, n);
			}, f = (e) => {
				var n = Ym();
				J(() => n.disabled = Y(d)), Pr("click", n, () => U(o, Y(t).id, !0)), Z(e, n);
			};
			$(l, (e) => {
				Y(o) === Y(t).id ? e(u) : e(f, -1);
			}), I(s);
			var p = q(s, 2), m = W(p), h = q(W(m)), g = W(h);
			g.value = g.__value = "", mi(q(g), 17, () => Y(n).groups, ui, (e, t) => {
				var n = Xm(), r = K(n, !0), i = {};
				J(() => {
					Q(r, Y(t).name), i !== (i = Y(t).id) && (n.value = (n.__value = i) ?? "");
				}), Z(e, n);
			}), I(h);
			var _;
			Gi(h), I(m), mi(q(m, 2), 16, () => [["markup_pct", "Card markup %"], ["start_fee", "Card start fee"]], ui, (e, r) => {
				var i = /* @__PURE__ */ z(() => A(r, 2));
				let a = () => Y(i)[0], o = () => Y(i)[1], s = /* @__PURE__ */ z(() => Y(n).prices.cards[Y(t).id] ?? {
					markup_pct: 0,
					start_fee: 0
				});
				var c = Zm(), l = W(c), u = q(l);
				$i(u), I(c), J(() => {
					Q(l, `${o() ?? ""} `), u.disabled = Y(d), ea(u, Y(s)[a()]);
				}), Pr("change", u, (e) => y(e, ee(Y(t), {
					...Y(s),
					[a()]: Number(e.currentTarget.value)
				}), (e) => e.value = Y(s)[a()])), Z(e, c);
			}), I(p);
			var v = q(p, 2), b = q(W(v), 2);
			mi(b, 21, () => Y(n).users, (e) => e.id, (e, n) => {
				var r = Qm(), i = W(r), a = W(i), o = K(q(a));
				I(i);
				var s = q(i, 2);
				$i(s), I(r), J((e, t) => {
					Q(a, `${(Y(n).name || Y(n).id) ?? ""} `), Q(o, `(last seen ${e ?? ""})`), s.disabled = Y(d), ta(s, t);
				}, [() => $a(Y(n).last_seen), () => Y(t).viewers.includes(Y(n).id)]), Pr("change", s, (e) => {
					let r = e.currentTarget.checked;
					y(e, w(Y(t), Y(t).group_id, r ? [...Y(t).viewers, Y(n).id] : Y(t).viewers.filter((e) => e !== Y(n).id)), (e) => e.checked = !r);
				}), Z(e, r);
			}, (e) => {
				Z(e, $m());
			}), I(b), I(v), I(r), J(() => {
				Q(a, Y(t).name), c.disabled = Y(d), h.disabled = Y(d), _ !== (_ = Y(t).group_id ?? "") && (h.value = (h.__value = _) ?? "", Wi(h, _));
			}), Pr("click", c, () => km(wm)), Pr("change", h, (e) => y(e, w(Y(t), e.currentTarget.value || null, Y(t).viewers), (e) => e.value = Y(t).group_id ?? "")), Z(e, r);
		});
		var te = q(b, 2), k = (e) => {
			var n = nh(), r = q(G(n), 2);
			mi(r, 21, () => Y(t).archived, (e) => e.id, (e, t) => {
				var n = th(), r = W(n), i = W(r);
				Le(), I(r);
				var a = q(r, 2);
				I(n), J(() => {
					Q(i, `${Y(t).name ?? ""} `), a.disabled = Y(d);
				}), Pr("click", a, () => D(Y(t))), Z(e, n);
			}), I(r), Z(e, n);
		};
		$(te, (e) => {
			Y(t).archived.length && e(k);
		}), Lm(q(te, 2), {
			get data() {
				return Y(n);
			},
			change: v
		}), J(() => {
			m.disabled = Y(d), _.disabled = Y(d);
		}), Nr("submit", u, (e) => {
			e.preventDefault(), x();
		}), oa(p, () => Y(i), (e) => U(i, e)), Pr("click", _, () => km(Cm)), Z(e, r);
	}, oe = (e) => {
		Z(e, ih());
	};
	$(ie, (e) => {
		Y(n) ? e(ae) : Y(r) || e(oe, 1);
	}), I(te), Z(e, te), rt();
}
Fr(["click", "change"]);
// src/lib/stats.js
var sh = [
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
], ch = (e) => (t, n, r) => `${e}?view=${encodeURIComponent(t)}&period=${n}${r ? `&at=${r}` : ""}`, lh = ch("stats"), uh = ch("map"), dh = (e, t) => e == null || !t ? null : (e - t) / t, fh = (e) => sh[e - 1].slice(0, 3);
function ph(e) {
	let [t, n, r] = Ka(e), i = new Date(Date.UTC(t, n - 1, r - 1));
	return [
		i.getUTCFullYear(),
		i.getUTCMonth() + 1,
		i.getUTCDate()
	];
}
function mh(e, t, n) {
	let [r, i, a] = Ka(t);
	if (e === "year") return String(r);
	if (e === "month") return `${sh[i - 1]} ${r}`;
	let [o, s, c] = ph(n);
	return o === r ? i === s ? `${a} – ${c} ${fh(i)}` : `${a} ${fh(i)} – ${c} ${fh(s)}` : `${a} ${fh(i)} ${r} – ${c} ${fh(s)} ${o}`;
}
function hh(e, t) {
	let [, n, r] = Ka(t);
	return e === "year" ? fh(n) : String(r);
}
function gh(e, t = 5) {
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
function _h(e, t) {
	let n = t?.km > 0 ? t : null, r = (e, t) => e.km > 0 ? e[t] / e.km * 10 : null, i = Object.values(e.bands).map((e) => e.kwh_per_100km), a = Math.max(0, ...i.filter((e) => e != null));
	return {
		points: e.score != null && n?.score != null ? e.score - n.score : null,
		events: os.map(([t, i]) => {
			let a = r(e, t);
			return {
				k: t,
				name: i,
				change: n ? dh(a, r(n, t)) : null
			};
		}),
		bands: Object.entries(e.bands).map(([e, t]) => ({
			name: e,
			value: t.kwh_per_100km,
			share: t.kwh_per_100km == null || !a ? 0 : Math.max(0, t.kwh_per_100km / a)
		}))
	};
}
var vh = (e) => e == null ? null : {
	dir: Math.sign(e),
	text: e ? String(Math.abs(e)) : "same",
	hint: !1
}, yh = /* @__PURE__ */ X("<div class=\"msg\" role=\"alert\"><p>Couldn't load the map.</p> <button class=\"d-btn\">Retry</button></div>"), bh = /* @__PURE__ */ X("<p class=\"d-msg\"> </p>"), xh = /* @__PURE__ */ X("<section class=\"d-card\"><div class=\"d-head\"><h2>Map</h2></div> <!></section>");
function Sh(e, t) {
	nt(t, !0);
	let n = /* @__PURE__ */ H(void 0), r = /* @__PURE__ */ H(!1), i = /* @__PURE__ */ H(null), a = /* @__PURE__ */ H(!1), o = h();
	kn(() => {
		let e = new IntersectionObserver((t) => t.some((e) => e.isIntersecting) && (U(r, !0), e.disconnect()));
		return e.observe(Y(n)), () => e.disconnect();
	});
	async function s() {
		let e = o.next();
		U(a, !1);
		try {
			let n = await m(uh(t.view, t.period, t.at));
			if (!e.current) return;
			U(i, {
				lines: n.trips.map((e) => ({
					points: e.route,
					kind: "trip",
					href: jo({
						kind: "trip",
						vehicle_id: e.vid,
						start: e.start
					})
				})),
				dots: n.charges.map((e) => ({
					lat: e.lat,
					lon: e.lon,
					kind: "charge",
					title: $o(e.name),
					href: jo({
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
	kn(() => {
		if (Y(r)) return s(), o.reset;
	});
	var c = xh(), l = q(W(c), 2), u = (e) => {
		var t = yh(), n = q(W(t), 2);
		I(t), Pr("click", n, s), Z(e, t);
	}, d = (e) => {
		var t = bh(), n = K(t, !0);
		J(() => {
			na(t, "aria-busy", Y(r)), Q(n, Y(r) ? "Loading…" : "");
		}), Z(e, t);
	}, f = (e) => {
		var n = bh(), r = K(n);
		J(() => Q(r, `Nothing to map this ${t.period ?? ""}`)), Z(e, n);
	}, p = (e) => {
		Np(e, {
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
	}), I(c), ha(c, (e) => U(n, e), () => Y(n)), Z(e, c), rt();
}
Fr(["click"]);
// src/pages/Stats.svelte
var Ch = (e, t = O) => {
	var n = Th();
	let r;
	var i = W(n), a = (e) => {
		var n = wh(), r = G(n), i = K(r, !0), a = K(q(r), !0);
		J(() => {
			Q(i, t().dir > 0 ? "▲" : "▼"), Q(a, t().dir > 0 ? "up" : "down");
		}), Z(e, n);
	};
	$(i, (e) => {
		t().dir && e(a);
	});
	var o = q(i);
	I(n), J(() => {
		r = zi(n, 1, "trend svelte-qardfz", null, r, {
			up: t().hint && t().dir > 0,
			down: t().hint && t().dir < 0
		}), Q(o, ` ${t().text ?? ""}`);
	}), Z(e, n);
}, wh = /* @__PURE__ */ X("<span aria-hidden=\"true\"> </span><span class=\"sr\"> </span>", 1), Th = /* @__PURE__ */ X("<span><!> </span>"), Eh = /* @__PURE__ */ X("<div class=\"msg svelte-qardfz\" role=\"alert\"><p>Couldn't load your statistics.</p> <button class=\"d-btn\">Retry</button></div>"), Dh = /* @__PURE__ */ X("<p class=\"msg svelte-qardfz\" aria-busy=\"true\">Loading…</p>"), Oh = /* @__PURE__ */ X("<span> </span>"), kh = /* @__PURE__ */ X("<span class=\"sub caption svelte-qardfz\"><!> <!></span>"), Ah = /* @__PURE__ */ X("<p class=\"d-note\"> </p>"), jh = /* @__PURE__ */ X("<li class=\"svelte-qardfz\"><b> </b> <span class=\"d-note facts svelte-qardfz\"><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span><span class=\"svelte-qardfz\"> </span></span></li>"), Mh = /* @__PURE__ */ X("<section class=\"d-card pv svelte-qardfz\"><h2>By car</h2> <ul class=\"svelte-qardfz\"></ul></section>"), Nh = /* @__PURE__ */ X("<a class=\"press svelte-qardfz\"><span class=\"k svelte-qardfz\">Longest trip</span><span class=\"v svelte-qardfz\"> </span> <span class=\"d-note svelte-qardfz\"> </span></a>"), Ph = /* @__PURE__ */ X("<div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Longest trip</span><span class=\"v svelte-qardfz\"> </span></div>"), Fh = /* @__PURE__ */ X("<a class=\"press svelte-qardfz\"><span class=\"k svelte-qardfz\">Most efficient trip</span><span class=\"v svelte-qardfz\"> </span> <span class=\"d-note svelte-qardfz\"> </span></a>"), Ih = /* @__PURE__ */ X("<div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Most efficient trip</span><span class=\"v svelte-qardfz\"> </span><span class=\"d-note svelte-qardfz\">Trips of at least 5 km</span></div>"), Lh = /* @__PURE__ */ X("<span class=\"d-note svelte-qardfz\"> </span>"), Rh = /* @__PURE__ */ X("<span class=\"d-note\"> </span>"), zh = /* @__PURE__ */ X("<span class=\"d-note pts svelte-qardfz\"><!></span>"), Bh = /* @__PURE__ */ X("<div class=\"big\"> <small>/ 100</small><!></div>"), Vh = /* @__PURE__ */ X(" <!>", 1), Hh = /* @__PURE__ */ X("<div><dt> </dt><dd> <!></dd></div>"), Uh = /* @__PURE__ */ X("<li class=\"svelte-qardfz\"><span class=\"bn svelte-qardfz\"> </span><span class=\"track svelte-qardfz\"><i class=\"meter svelte-qardfz\"></i></span><span class=\"bv svelte-qardfz\"> </span></li>"), Wh = /* @__PURE__ */ X("<dl class=\"d-rows\"><div><dt>Standing</dt><dd> </dd></div></dl>"), Gh = /* @__PURE__ */ X("<!> <dl class=\"d-rows\"></dl> <div class=\"d-head bandhead\"><h2>Consumption by speed</h2><span class=\"d-note\">km/h · kWh/100 km</span></div> <ul class=\"bands svelte-qardfz\"></ul> <!>", 1), Kh = /* @__PURE__ */ X("<p class=\"d-msg\"> </p>"), qh = /* @__PURE__ */ X("<i></i>"), Jh = /* @__PURE__ */ X("<li class=\"svelte-qardfz\"><i class=\"dot svelte-qardfz\"></i><span class=\"n svelte-qardfz\"> </span><span> </span><span class=\"pc svelte-qardfz\"> </span></li>"), Yh = /* @__PURE__ */ X("<div class=\"share-bar\" role=\"img\"></div> <ul class=\"svelte-qardfz\"></ul>", 1), Xh = /* @__PURE__ */ X("<div><div class=\"col svelte-qardfz\"><div class=\"tiles svelte-qardfz\"><div class=\"d-figs svelte-qardfz\"></div> <!></div> <!> <section class=\"d-card hl svelte-qardfz\"><h2>Highlights</h2> <ul class=\"svelte-qardfz\"><li class=\"svelte-qardfz\"><!></li> <li class=\"svelte-qardfz\"><!></li> <li class=\"svelte-qardfz\"><div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Recuperated</span><span class=\"v svelte-qardfz\"> </span> <!></div></li> <li class=\"svelte-qardfz\"><div class=\"svelte-qardfz\"><span class=\"k svelte-qardfz\">Cost</span><span class=\"v svelte-qardfz\"> </span> <span class=\"d-note cost svelte-qardfz\"> <!><!> <!></span></div></li></ul></section> <section class=\"d-card sty svelte-qardfz\"><div class=\"d-head\"><h2>Driving style</h2><!></div> <!></section></div> <div class=\"col svelte-qardfz\"><section class=\"d-card chartcard svelte-qardfz\"><div class=\"d-head\"><h2>Distance</h2><span class=\"d-note\"> </span></div> <!></section> <section class=\"d-card places svelte-qardfz\"><div class=\"d-head\"><h2>Charged by place</h2><span class=\"d-note\"> </span></div> <!></section></div></div> <div class=\"mapcard svelte-qardfz\"><!></div>", 1), Zh = /* @__PURE__ */ X("<div class=\"page svelte-qardfz\"><h1 class=\"page-title\">Statistics</h1> <div class=\"seg svelte-qardfz\"><!></div> <div class=\"nav svelte-qardfz\"><button class=\"press svelte-qardfz\"><svg class=\"icon svelte-qardfz\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M15 5l-7 7 7 7\"></path></svg></button> <h2 aria-live=\"polite\" class=\"svelte-qardfz\"> </h2> <button class=\"press svelte-qardfz\"><svg class=\"icon svelte-qardfz\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 5l7 7-7 7\"></path></svg></button></div> <!></div>");
function Qh(e, t) {
	nt(t, !0);
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
	], i = /* @__PURE__ */ H("week"), a = /* @__PURE__ */ H(null), o = /* @__PURE__ */ H(null), s = /* @__PURE__ */ H(!1), c = /* @__PURE__ */ H(!0), l = h(), u = (e) => (U(i, e, !0), U(a, null));
	async function d() {
		let e = l.next();
		U(c, !0), U(s, !1);
		try {
			let n = await m(lh(t.view, Y(i), Y(a)));
			e.current && U(o, n, !0);
		} catch {
			e.current && U(s, !0);
		} finally {
			e.current && U(c, !1);
		}
	}
	kn(() => (d(), l.reset));
	let f = (e, t = !1) => {
		if (e == null) return null;
		let n = Math.round(e * 100);
		return {
			dir: Math.sign(n),
			text: `${Math.abs(n)} %`,
			hint: t
		};
	}, p = (e, t, n = !1) => f(dh(e, t), n), g = (e) => Na(e.wh_per_100km), _ = /* @__PURE__ */ z(() => Y(o)?.totals), v = /* @__PURE__ */ z(() => {
		if (!Y(_)) return [];
		let e = Y(o).previous, [t, n] = [g(Y(_)), e.trips ? g(e) : null], r = t != null && n ? Number((t - n).toFixed(1)) : null;
		return [
			{
				label: "Distance",
				value: Uo(Da(Y(_).distance_m)),
				trend: p(Y(_).distance_m, e.distance_m)
			},
			{
				label: "Average",
				value: t == null ? ["–", ""] : [t.toFixed(1), "kWh/100 km"],
				trend: r == null ? null : {
					dir: Math.sign(r),
					text: r ? Fa(r, "kWh/100", 1) : "0.0 kWh/100",
					hint: !0
				}
			},
			{
				label: "Energy used",
				value: Uo(Oa(Y(_).net_wh)),
				count: `${Y(_).trips} ${Y(_).trips === 1 ? "trip" : "trips"}`,
				trend: p(Y(_).net_wh, e.net_wh, !0)
			},
			{
				label: "Charged",
				value: Uo(Oa(Y(_).charged_wh)),
				count: `${Y(_).charges} ${Y(_).charges === 1 ? "charge" : "charges"}`,
				trend: p(Y(_).charged_wh, e.charged_wh)
			}
		];
	}), y = /* @__PURE__ */ z(() => Y(o)?.buckets ?? []), b = /* @__PURE__ */ z(() => Y(y).map((e) => hh(Y(i), e.start))), x = /* @__PURE__ */ z(() => Y(y).map((e) => Na(e.wh_per_100km))), S = /* @__PURE__ */ z(() => ({
		splits: Y(b).map((e, t) => t).filter((e) => Y(i) !== "month" || Y(b)[e] === "1" || Number(Y(b)[e]) % 5 == 0),
		values: (e, t) => t.map((e) => Y(b)[e])
	})), C = /* @__PURE__ */ z(() => [{
		label: "Distance (km)",
		values: Y(y).map((e) => e.distance_m / 1e3),
		kind: "bars",
		color: "--trip"
	}, ...Y(x).some((e) => e != null) ? [{
		label: "kWh/100 km",
		values: Y(x),
		scale: "y2",
		color: "--energy"
	}] : []]), w = /* @__PURE__ */ z(() => Y(i) === "year" ? "month" : "day"), T = /* @__PURE__ */ z(() => Y(_) ? `Distance per ${Y(w)}: ${Da(Y(_).distance_m)} in total, average ${Pa(Y(_).wh_per_100km)}` : ""), E = /* @__PURE__ */ z(() => Y(o) ? gh(Y(o).by_place) : []), D = (e, t) => e.other ? "--muted" : r[t % r.length], O = /* @__PURE__ */ z(() => Y(_) ? p(Y(_).cost.total, Y(o).previous.cost.total, !0) : null), ee = /* @__PURE__ */ z(() => Y(o)?.highlights), te = /* @__PURE__ */ z(() => Y(ee)?.gross_wh > 0 ? Math.round(Y(ee).recup_wh / Y(ee).gross_wh * 100) : null), k = /* @__PURE__ */ z(() => Y(o)?.style), A = /* @__PURE__ */ z(() => Y(k)?.km > 0 ? _h(Y(k), Y(o).previous_style) : null), ne = /* @__PURE__ */ z(() => vh(Y(A)?.points)), j = (e) => Qa(qa(e), Ja()), re = (e) => jo({
		kind: "trip",
		vehicle_id: e.vehicle_id,
		start: e.start
	});
	var ie = Zh(), ae = q(W(ie), 2), oe = W(ae), M = () => Y(i), N = u;
	Rs(oe, {
		get options() {
			return n;
		},
		get value() {
			return M();
		},
		set value(e) {
			N(e);
		},
		label: "Period"
	}), I(ae);
	var se = q(ae, 2), ce = W(se), le = q(ce, 2), ue = K(le, !0), de = q(le, 2);
	I(se);
	var fe = q(se, 2), pe = (e) => {
		var t = Eh(), n = q(W(t), 2);
		I(t), Pr("click", n, d), Z(e, t);
	}, me = (e) => {
		Z(e, Dh());
	}, he = (e) => {
		var n = Xh(), r = G(n);
		let s;
		var l = W(r), u = W(l), d = W(u);
		mi(d, 21, () => Y(v), (e) => e.label, (e, t) => {
			Ap(e, {
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
					var r = Kr(), i = G(r), a = (e) => {
						var n = kh(), r = W(n), i = (e) => {
							var n = Oh(), r = K(n, !0);
							J(() => Q(r, Y(t).count)), Z(e, n);
						};
						$(r, (e) => {
							Y(t).count && e(i);
						});
						var a = q(r, 2), o = (e) => {
							Ch(e, () => Y(t).trend);
						};
						$(a, (e) => {
							Y(t).trend && e(o);
						}), I(n), Z(e, n);
					};
					$(i, (e) => {
						(Y(t).count || Y(t).trend) && e(a);
					}), Z(e, r);
				},
				$$slots: { default: !0 }
			});
		}), I(d);
		var p = q(d, 2), m = (e) => {
			var t = Ah(), n = K(t);
			J(() => Q(n, `Change against the previous ${Y(i) ?? ""}`)), Z(e, t);
		}, h = /* @__PURE__ */ z(() => Y(v).some((e) => e.trend));
		$(p, (e) => {
			Y(h) && e(m);
		}), I(u);
		var g = q(u, 2), b = (e) => {
			var t = Mh(), n = q(W(t), 2);
			mi(n, 21, () => Y(o).per_vehicle, (e) => e.id, (e, t) => {
				var n = jh(), r = W(n), i = K(r, !0), a = q(r, 2), o = W(a), s = K(o, !0), c = q(o), l = K(c, !0), u = q(c), d = K(u), f = q(u), p = K(f), m = K(q(f));
				I(a), I(n), J((e, n, r, a, o) => {
					Q(i, Y(t).name), Q(s, e), Q(l, n), Q(d, `${r ?? ""} used`), Q(p, `${a ?? ""} charged`), Q(m, `${o ?? ""} cost`);
				}, [
					() => Da(Y(t).totals.distance_m),
					() => Pa(Y(t).totals.wh_per_100km),
					() => Oa(Y(t).totals.net_wh),
					() => Oa(Y(t).totals.charged_wh),
					() => ds(Y(t).totals.cost.total)
				]), Z(e, n);
			}), I(n), I(t), Z(e, t);
		};
		$(g, (e) => {
			Y(o).per_vehicle && e(b);
		});
		var x = q(g, 2), ie = q(W(x), 2), ae = W(ie), oe = W(ae), M = (e) => {
			var t = Nh(), n = q(W(t)), r = K(n, !0), i = K(q(n, 2));
			I(t), J((e, n, a, o) => {
				na(t, "href", e), Q(r, n), Q(i, `${a ?? ""} · ${o ?? ""}`);
			}, [
				() => re(Y(ee).longest),
				() => Da(Y(ee).longest.distance_m),
				() => ns(Y(ee).longest),
				() => j(Y(ee).longest.start)
			]), Z(e, t);
		}, N = (e) => {
			var t = Ph(), n = K(q(W(t)), !0);
			I(t), J(() => Q(n, "–")), Z(e, t);
		};
		$(oe, (e) => {
			Y(ee).longest ? e(M) : e(N, -1);
		}), I(ae);
		var se = q(ae, 2), ce = W(se), le = (e) => {
			var t = Fh(), n = q(W(t)), r = K(n), i = K(q(n, 2));
			I(t), J((e, n, a) => {
				na(t, "href", e), Q(r, `${n ?? ""} kWh/100 km`), Q(i, `${a ?? ""} · trips of at least 5 km`);
			}, [
				() => re(Y(ee).most_efficient),
				() => (Y(ee).most_efficient.wh_per_100km / 1e3).toFixed(1),
				() => j(Y(ee).most_efficient.start)
			]), Z(e, t);
		}, ue = (e) => {
			var t = Ih(), n = K(q(W(t)), !0);
			Le(), I(t), J(() => Q(n, "–")), Z(e, t);
		};
		$(ce, (e) => {
			Y(ee).most_efficient ? e(le) : e(ue, -1);
		}), I(se);
		var de = q(se, 2), fe = W(de), pe = q(W(fe)), me = K(pe, !0), he = q(pe, 2), ge = (e) => {
			var t = Lh(), n = K(t);
			J((e) => Q(n, `${Y(te) ?? ""} % of the ${e ?? ""} used before recuperation`), [() => Oa(Y(ee).gross_wh)]), Z(e, t);
		};
		$(he, (e) => {
			Y(te) != null && e(ge);
		}), I(fe), I(de);
		var _e = q(de, 2), ve = W(_e), ye = q(W(ve)), be = K(ye, !0), xe = q(ye, 2), Se = W(xe), Ce = q(Se), we = (e) => {
			var t = Gr();
			J((e) => Q(t, `· ${e ?? ""}`), [() => hs(Y(_).cost.total, Y(_).distance_m)]), Z(e, t);
		};
		$(Ce, (e) => {
			Y(_).distance_m && e(we);
		});
		var Te = q(Ce), P = (e) => {
			var t = Gr();
			J((e) => Q(t, `· ${e ?? ""}`), [() => _s(Y(_).cost.uncosted)]), Z(e, t);
		};
		$(Te, (e) => {
			Y(_).cost.uncosted > 0 && e(P);
		});
		var Ee = q(Te, 2), De = (e) => {
			Ch(e, () => Y(O));
		};
		$(Ee, (e) => {
			Y(O) && e(De);
		}), I(xe), I(ve), I(_e), I(ie), I(x);
		var Oe = q(x, 2), ke = W(Oe), Ae = q(W(ke)), je = (e) => {
			var t = Rh(), n = K(t, !0);
			J((e) => Q(n, e), [() => Y(k).score == null ? "No trips of 2 km or more" : ss(Y(k).score)]), Z(e, t);
		};
		$(Ae, (e) => {
			Y(A) && e(je);
		}), I(ke);
		var Me = q(ke, 2), F = (e) => {
			var t = Gh(), n = G(t), r = (e) => {
				var t = Bh(), n = W(t, !0), r = q(n, 2), i = (e) => {
					var t = zh();
					Ch(W(t), () => Y(ne)), I(t), Z(e, t);
				};
				$(r, (e) => {
					Y(ne) && e(i);
				}), I(t), J(() => Q(n, Y(k).score)), Z(e, t);
			};
			$(n, (e) => {
				Y(k).score != null && e(r);
			});
			var i = q(n, 2);
			mi(i, 21, () => Y(A).events, (e) => e.k, (e, t) => {
				let n = /* @__PURE__ */ z(() => f(Y(t).change, !0));
				var r = Hh(), i = W(r), a = K(i, !0), o = q(i), s = W(o, !0), c = q(s), l = (e) => {
					var t = Vh(), r = G(t, !0);
					r.nodeValue = " ", Ch(q(r), () => Y(n)), Z(e, t);
				};
				$(c, (e) => {
					Y(n) && e(l);
				}), I(o), I(r), J((e) => {
					Q(a, Y(t).name), Q(s, e);
				}, [() => cs(Y(k)[Y(t).k], Y(k).km)]), Z(e, r);
			}), I(i);
			var a = q(i, 4);
			mi(a, 21, () => Y(A).bands, (e) => e.name, (e, t) => {
				var n = Uh(), r = W(n), i = K(r, !0), a = q(r), o = W(a);
				let s;
				I(a);
				var c = K(q(a), !0);
				I(n), J((e) => {
					Q(i, Y(t).name), s = Vi(o, "", s, { width: `${Y(t).share * 100}%` }), Q(c, e);
				}, [() => Y(t).value == null ? "–" : Y(t).value.toFixed(1)]), Z(e, n);
			}), I(a);
			var o = q(a, 2), s = (e) => {
				var t = Wh(), n = W(t), r = K(q(W(n)), !0);
				I(n), I(t), J((e) => Q(r, e), [() => Oa(Y(k).standing_kwh * 1e3)]), Z(e, t);
			};
			$(o, (e) => {
				Y(k).standing_kwh != null && e(s);
			}), Z(e, t);
		}, Ne = (e) => {
			var t = Kh(), n = K(t);
			J(() => Q(n, `No trips in this ${Y(i) ?? ""}.`)), Z(e, t);
		};
		$(Me, (e) => {
			Y(A) ? e(F) : e(Ne, -1);
		}), I(Oe), I(l);
		var Pe = q(l, 2), Fe = W(Pe), Ie = W(Fe), Re = K(q(W(Ie)));
		I(Ie);
		var ze = q(Ie, 2), Be = (e) => {
			{
				let t = /* @__PURE__ */ z(() => Y(y).map((e, t) => t));
				Sp(e, {
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
						return Y(T);
					}
				});
			}
		}, Ve = (e) => {
			var t = Kh(), n = K(t);
			J(() => Q(n, `No trips in this ${Y(i) ?? ""}.`)), Z(e, t);
		};
		$(ze, (e) => {
			Y(_).distance_m > 0 ? e(Be) : e(Ve, -1);
		}), I(Fe);
		var He = q(Fe, 2), Ue = W(He), We = K(q(W(Ue)), !0);
		I(Ue);
		var Ge = q(Ue, 2), Ke = (e) => {
			var t = Yh(), n = G(t);
			mi(n, 23, () => Y(E), (e) => e.name, (e, t, n) => {
				var r = qh();
				let i;
				J((e) => i = Vi(r, "", i, {
					flex: `${Y(t).wh ?? ""} 1 0`,
					background: e
				}), [() => `var(${D(Y(t), Y(n)) ?? ""})`]), Z(e, r);
			}), I(n);
			var r = q(n, 2);
			mi(r, 23, () => Y(E), (e) => e.name, (e, t, n) => {
				var r = Jh(), i = W(r);
				let a;
				var o = q(i), s = K(o, !0), c = q(o), l = K(c, !0), u = K(q(c));
				I(r), J((e, n, r) => {
					a = Vi(i, "", a, { background: e }), Q(s, Y(t).name), Q(l, n), Q(u, `${r ?? ""} %`);
				}, [
					() => `var(${D(Y(t), Y(n)) ?? ""})`,
					() => Oa(Y(t).wh),
					() => Math.round(Y(t).share * 100)
				]), Z(e, r);
			}), I(r), J((e) => na(n, "aria-label", `Charged by place: ${e ?? ""}`), [() => Y(E).map((e) => `${e.name} ${Oa(e.wh)}`).join(", ")]), Z(e, t);
		}, qe = (e) => {
			var t = Kh(), n = K(t);
			J(() => Q(n, `No charging in this ${Y(i) ?? ""}.`)), Z(e, t);
		};
		$(Ge, (e) => {
			Y(E).length ? e(Ke) : e(qe, -1);
		}), I(He), I(Pe), I(r);
		var Je = q(r, 2);
		Sh(W(Je), {
			get view() {
				return t.view;
			},
			get period() {
				return Y(i);
			},
			get at() {
				return Y(a);
			}
		}), I(Je), J((e, t, n, i, a) => {
			s = zi(r, 1, "grid svelte-qardfz", null, s, { busy: Y(c) }), na(r, "aria-busy", Y(c)), Q(me, e), Q(be, t), Q(Se, `${n ?? ""} charging · ${i ?? ""} fixed`), Q(Re, `per ${Y(w) ?? ""}`), Q(We, a);
		}, [
			() => Oa(Y(ee).recup_wh),
			() => ds(Y(_).cost.total),
			() => ds(Y(_).cost.energy),
			() => ds(Y(_).cost.fixed),
			() => Oa(Y(_).charged_wh)
		]), Z(e, n);
	};
	$(fe, (e) => {
		Y(s) ? e(pe) : Y(o) ? e(he, -1) : e(me, 1);
	}), I(ie), J((e) => {
		ce.disabled = !Y(o) || Y(c), na(ce, "aria-label", `Previous ${Y(i) ?? ""}`), Q(ue, e), de.disabled = Y(c) || !Y(o)?.period.next_at, na(de, "aria-label", `Next ${Y(i) ?? ""}`);
	}, [() => Y(o) ? mh(Y(i), Y(o).period.start, Y(o).period.end) : ""]), Pr("click", ce, () => U(a, Y(o).period.prev_at, !0)), Pr("click", de, () => U(a, Y(o).period.next_at, !0)), Z(e, ie), rt();
}
Fr(["click"]);
// src/App.svelte
var $h = /* @__PURE__ */ X("<p class=\"msg svelte-1n46o8q\"> </p>"), eg = /* @__PURE__ */ X("<p class=\"msg svelte-1n46o8q\">Loading…</p>"), tg = /* @__PURE__ */ X("<p class=\"msg svelte-1n46o8q\">No vehicles available to you.</p>");
function ng(e, t) {
	nt(t, !0);
	let n = /* @__PURE__ */ H(null), r = /* @__PURE__ */ H(sn({
		vehicles: [],
		groups: []
	})), i = /* @__PURE__ */ H(""), a = Ta(location.hash), o = /* @__PURE__ */ H(sn(a)), s = /* @__PURE__ */ H(""), c = "car-insights-view", l = /* @__PURE__ */ z(() => [...Y(r).vehicles.map((e) => ({
		value: `v:${e.id}`,
		label: e.name
	})), ...Y(r).groups.map((e) => ({
		value: `g:${e.id}`,
		label: `Group: ${e.name}`
	}))]), u = h();
	async function d() {
		let e = u.next();
		try {
			let t = await m("views");
			if (!e.current) return;
			U(r, t, !0), Y(l).some((e) => e.value === Y(i)) || U(i, Y(l)[0]?.value || "", !0);
		} catch {}
	}
	function f() {
		let e = Y(o).page;
		U(o, Ta(location.hash), !0), Y(o).redirect && location.replace(Y(o).redirect), e === "settings" && Y(o).page !== "settings" && d();
	}
	addEventListener("hashchange", f), a.redirect && location.replace(a.redirect), kn(() => {
		Y(n) && !Y(n).is_admin && Y(o).page === "settings" && location.replace("#/activity");
	});
	let p = "";
	kn(() => {
		p && Y(i) && Y(i) !== p && Y(o).detail && location.replace("#/activity"), Y(i) && (p = Y(i));
	}), kn(() => {
		if (Y(i)) try {
			localStorage.setItem(c, Y(i));
		} catch {}
	}), (async () => {
		try {
			let [e, t] = await Promise.all([m("me"), m("views")]);
			Wa(e?.tz), ((e) => {
				var t = A(e, 2);
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
	var g = Kr(), _ = G(g), v = (e) => {
		var t = $h(), n = K(t, !0);
		J(() => Q(n, Y(s))), Z(e, t);
	}, y = (e) => {
		Z(e, eg());
	}, b = (e) => {
		ko(e, {
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
				var r = Kr(), a = G(r), s = (e) => {
					oh(e, {});
				}, c = (e) => {
					Z(e, tg());
				}, l = (e) => {
					var t = Kr();
					li(G(t), () => Y(i), (e) => {
						Qh(e, { get view() {
							return Y(i);
						} });
					}), Z(e, t);
				}, u = (e) => {
					var t = Kr();
					li(G(t), () => Y(i), (e) => {
						Sm(e, {
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
	}), Z(e, g), rt();
}
// src/main.js
var rg = (e) => $r(ng, { target: e }), ig = () => new Promise((e) => {
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
customElements.define("car-insights-panel", class extends HTMLElement {
	#e = !1;
	set hass(e) {
		d(e), !this.#e && (this.#e = !0, this.style.display = "block", this.style.height = "100%", ig().then(() => {
			let e = this.appendChild(document.createElement("div"));
			e.id = "app", rg(e);
		}));
	}
});
