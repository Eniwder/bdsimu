const Option = function(v){
	return Some(x);
}

class _Some{
	constructor(v){ this._v = v }
	flatMap(f) { 
		const result = f(this._v) 
		return (result.constructor.name === '_Some' || result.constructor.name === 'None') ?
			result : (function(){ throw new Error('Type Error: required [ flatMap(f: A => Option(B)) ]') }());
	}
	flatten(){ 
		return (this._v.constructor.name==='_Some' || this._v.constructor.name==='None') ?
			this._v : (function(){ throw new Error('Type Error: flatten can only apply Some(Option)') }());
	}
	map(f) { return Some(f(this._v)) }
	foreach(f) { return Some(f(this._v)) }
	orElse(v){ return false }
	getOrElse(v){ return this._v }
	get(){ return this._v }
	getOrElseLazy(f){ return this._v }
	orElseLazy(v){ return this }
}
const Some = function(v){
	return (v === null || typeof v === 'undefined') ?
		None : new _Some(v);
}
const None = {
	flatMap: () => None,
	flatten: () => None,
	map: f => None,
	foreach: f => None,
	orElse: v => Some(v),
	getOrElse: v => v,
	get: function(){ throw new Error('No such Element Error') },
	getOrElseLazy: f => f(),
	orElseLazy: f => Some(f()),
	constructor: {name: 'None'}
}
exports.Some = Some;
exports.None = None;
exports.Option = Option;