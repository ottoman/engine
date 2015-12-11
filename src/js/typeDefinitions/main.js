(function(factory) {
  if (typeof define === "function" && define.amd) {
    return define(["./function", "./object", "./number", "./text", "./bool", "./list", "./date"], factory);
  } else {
    return module.exports = factory(require("./function"), require("./object"), require("./number"), require("./text"), require("./bool"), require("./list"), require("./date"));
  }
})(function(functionDef, objectDef, numberDef, textDef, boolDef, listDef, dateDef) {
  return {
    functionDef: functionDef,
    objectDef: objectDef,
    numberDef: numberDef,
    textDef: textDef,
    boolDef: boolDef,
    listDef: listDef,
    dateDef: dateDef
  };
});
