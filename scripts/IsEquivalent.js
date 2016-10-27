function isEquivalent(a, b) {
    if (((a == null || b == null) && a != b) || a.length !== b.length) return false;
    var aJoined = a.sort().join(',');
    var bJoined = b.sort().join(',');
    return aJoined === bJoined;
}
