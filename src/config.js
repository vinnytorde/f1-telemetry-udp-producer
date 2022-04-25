require('dotenv').config()

// to serialize the session ID
BigInt.prototype.toJSON = function() { return this.toString() }

console.clear()