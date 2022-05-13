// to serialize the session ID
BigInt.prototype.toJSON = function() { return this.toString() }