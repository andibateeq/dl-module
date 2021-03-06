var options = {
    manager: require("../../../src/managers/master/instruction-manager"),
    model: require("dl-models").master.Instruction,
    util: require("../../data-util/master/instruction-data-util"),
    validator: require("dl-models").validator.master.instruction,
    createDuplicate: true,
    keys: ["name"]
};

var basicTest = require("../../basic-test-factory");
basicTest(options);
