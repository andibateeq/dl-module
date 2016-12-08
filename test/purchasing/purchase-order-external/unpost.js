require("should");
var helper = require("../../helper");

var purchaseOrderDataUtil = require('../../data').transaction.purchaseOrder;
var validatePR = require("dl-models").validator.purchasing.purchaseOrder;
var PurchaseOrderManager = require("../../../src/managers/purchasing/purchase-order-manager");
var purchaseOrderManager = null;
var purchaseOrders;

var purchaseOrderExternalDataUtil = require('../../data').transaction.purchaseOrderExternal;
var validatePO = require("dl-models").validator.purchasing.purchaseOrderExternal;
var PurchaseOrderExternalManager = require("../../../src/managers/purchasing/purchase-order-external-manager");
var purchaseOrderExternalManager = null;
var purchaseOrderExternal;

var poStatusEnum = require("dl-models").purchasing.enum.PurchaseOrderStatus;

before('#00. connect db', function (done) {
    helper.getDb()
        .then(db => {
            purchaseOrderManager = new PurchaseOrderManager(db, {
                username: 'dev'
            });
            purchaseOrderExternalManager = new PurchaseOrderExternalManager(db, {
                username: 'dev'
            });
            done();
        })
        .catch(e => {
            done(e);
        });
});

it('#01. should success when create new posted purchase-order-external with purchase-orders', function (done) {
    purchaseOrderExternalDataUtil.getPosted()
        .then(poe => {
            purchaseOrderExternal = poe;
            done();
        })
        .catch(e => {
            console.log(e.errors);
            done(e);
        });
});

it('#02. should isPosted = true', function (done) {
    purchaseOrderExternalManager.getSingleByQuery({ _id: purchaseOrderExternal._id })
        .then((data) => {
            data.isPosted.should.be.Boolean();
            data.isPosted.should.equal(true);
            done();
        })
        .catch(e => {
            console.log(e.errors);
            done(e);
        })
});

it('#03. should success when unposting purchase-order-external', function (done) {
    purchaseOrderExternalManager.unpost(purchaseOrderExternal._id)
        .then(poe => {
            purchaseOrderExternal = poe;
            purchaseOrderExternal.isPosted.should.equal(false);
            JSON.stringify(purchaseOrderExternal.status).should.equal(JSON.stringify(poStatusEnum.CREATED));
            done();
        })
        .catch(e => {
            console.log(e.errors);
            done(e);
        });

});

it('#04. all purchase-orders isPosted should be = false and status should be PROCESSING in purchase-order-external', function (done) {
    Promise.all(purchaseOrderExternal.items.map(purchaseOrder => {
        return purchaseOrderManager.getSingleById(purchaseOrder._id);
    }))
        .then(results => {
            purchaseOrders = results;
            purchaseOrderExternal.items.length.should.equal(purchaseOrders.length, "purchase-order-external items not the same count with purchase-orders");

            for (var purchaseOrder of purchaseOrders) {
                purchaseOrder.isPosted.should.equal(false);
                JSON.stringify(purchaseOrder.status).should.equal(JSON.stringify(poStatusEnum.PROCESSING));
            }
            done();
        })
        .catch(e => {
            console.log(e.errors);
            done(e);
        });
});