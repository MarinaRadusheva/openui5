/* global QUnit */

sap.ui.define([
	"sap/ui/thirdparty/sinon-4",
	"sap/ui/fl/apply/_internal/connectors/PersonalizationConnector",
	"sap/ui/fl/apply/_internal/connectors/Utils"
], function(
	sinon,
	PersonalizationConnector,
	ApplyUtils
) {
	"use strict";

	var sandbox = sinon.sandbox.create();
	var newToken = "newToken";

	function fnReturnData(oServer, sData) {
		sandbox.server.respondWith([200, { "X-CSRF-Token": newToken, "Content-Type": "application/json" }, sData]);
	}

	QUnit.module("Connector", {
		beforeEach : function () {
			this.xhr = sinon.fakeServer.create();
			sandbox.useFakeServer();
			sandbox.server.autoRespond = true;
			fnReturnData(this.xhr, '{}');
		},
		afterEach: function() {
			PersonalizationConnector.xsrfToken = undefined;
			sandbox.restore();
		}
	}, function() {
		QUnit.test("given no static changes-bundle.json placed for 'reference' resource roots and a mock server, when loading flex data is triggered and an empty response is returned", function (assert) {
			return PersonalizationConnector.loadFlexData({url: "/flex/personalization", reference: "reference", appVersion: "1.0.0"}).then(function (oResult) {
				assert.deepEqual(oResult, {}, "the default response resolves the request Promise");
			});
		});

		QUnit.test("given a mock server, when loading flex data is triggered with the correct url", function (assert) {
			return PersonalizationConnector.loadFlexData({url: "/flex/personalization", reference: "reference", appVersion: "1.0.0"}).then(function () {
				assert.equal(sandbox.server.getRequest(0).url, "/flex/personalization/v1/data/reference?appVersion=1.0.0", "url is correct");
			});
		});

		QUnit.test("loadFlexData also requests and stores an xsrf token", function (assert) {
			return PersonalizationConnector.loadFlexData({url: "/flex/personalization", reference: "reference", appVersion: "1.0.0"}).then(function () {
				assert.equal(PersonalizationConnector.xsrfToken, newToken, "the token was stored correct");
			});
		});

		QUnit.test("loadFlexData trigger the correct request to back end", function (assert) {
			var mPropertyBag = {
				url: "/flex/personalization",
				reference: "reference",
				appVersion: "1.0.0"
			};
			var mParameter = {
				appVersion: "1.0.0"
			};
			var sExpectedUrl = "/flex/personalization/v1/data/reference?appVersion=1.0.0";
			var oStubGetUrlWithQueryParameters = sandbox.stub(ApplyUtils, "getUrl").returns(sExpectedUrl);
			var oStubSendRequest = sandbox.stub(ApplyUtils, "sendRequest").resolves({
				response : {},
				xsrfToken : "newToken",
				status: "200"
			});
			return PersonalizationConnector.loadFlexData(mPropertyBag).then(function () {
				assert.ok(oStubGetUrlWithQueryParameters.calledOnce, "getUrl is called once");
				assert.equal(oStubGetUrlWithQueryParameters.getCall(0).args[0], "/v1/data/", "with correct route path");
				assert.deepEqual(oStubGetUrlWithQueryParameters.getCall(0).args[1], mPropertyBag, "with correct property bag");
				assert.deepEqual(oStubGetUrlWithQueryParameters.getCall(0).args[2], mParameter, "with correct parameters input");
				assert.ok(oStubSendRequest.calledOnce, "sendRequest is called once");
				assert.equal(oStubSendRequest.getCall(0).args[0], sExpectedUrl, "with correct url");
				assert.equal(oStubSendRequest.getCall(0).args[1], "GET", "with correct method");
				assert.deepEqual(oStubSendRequest.getCall(0).args[2], {xsrfToken: undefined}, "with correct token");
				assert.equal(PersonalizationConnector.xsrfToken, "newToken", "new token is set");
			});
		});
	});

	QUnit.done(function () {
		jQuery('#qunit-fixture').hide();
	});
});
