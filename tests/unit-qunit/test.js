module("equiv");


test("Primitive types and constants", function () {
    equals(QUnit.equiv(null, null), true, "null");
});
