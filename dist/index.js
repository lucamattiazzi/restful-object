function RecursiveProxy(originalFn, path = []) {
    function get(obj, key) {
        if (obj.hasOwnProperty(key))
            return obj[key];
        if (typeof key === 'string') {
            const completePath = [...path, key];
            return new RecursiveProxy(obj, completePath);
        }
        else {
            return () => path;
        }
    }
    function apply(fn, that, args) {
        return fn(path, ...args);
    }
    return new Proxy(originalFn, { get, apply });
}
module.exports = { RecursiveProxy };
