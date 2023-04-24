/*!
 * ${copyright}
 */
sap.ui.define([
		'sap/base/Log',
		'sap/ui/mdc/enum/ConditionValidated'
	],
	function(
		Log,
		ConditionValidated
	) {
		"use strict";

		var fnSerializeCondition = function (oCondition) {
			return JSON.stringify(Object.assign({}, oCondition, {isEmpty: undefined}), function (sKey, vValue) {
				return vValue === undefined ? '[undefined]' : vValue;
			});
		};

		/**
		 * @namespace
		 * @name sap.ui.mdc.condition
		 * @since 1.61.0
		 * @private
		 * @experimental As of version 1.61
		 * @ui5-restricted sap.fe
		 * @MDC_PUBLIC_CANDIDATE
		 */

		/**
		 * Utilities to create conditions to be used in {@link sap.ui.mdc.FilterField FilterField},
		 * {@link sap.ui.mdc.FilterBar FilterBar} or {@link sap.ui.mdc.condition.ConditionModel ConditionModel}
		 *
		 * @namespace
		 * @author SAP SE
		 * @version ${version}
		 * @since 1.61.0
		 * @alias sap.ui.mdc.condition.Condition
		 *
		 * @private
		 * @experimental As of version 1.61
		 * @ui5-restricted sap.fe
		 * @MDC_PUBLIC_CANDIDATE
		 */
		var Condition = {

				/**
				 * Condition object type defining the structure of a condition.
				 *
				 * @static
				 * @constant
				 * @typedef {object} sap.ui.mdc.condition.ConditionObject
				 * @property {string} operator Operator of the condition
				 * @property {any[]} values Array of values of the condition. Depending on the <code>operator</code>, this contains one or more entries. The entries are sored in internal format regarding the used data type.
				 * @property {object} [inParameters] In parameters of the condition. For each field path, a value is stored. (It is obsolete and only filled for conditions stored on old user-variants.)
				 * @property {object} [outParameters] Out parameters of the condition. For each field path, a value is stored. (It is obsolete and only filled for conditions stored on old user-variants.)
				 * @property {boolean} [isEmpty] If set, the condition is empty (used as dummy condition in {@link sap.ui.mdc.valuehelp.base.DefineConditionPanel DefineConditionPanel})
				 * @property {sap.ui.mdc.enum.ConditionValidated} validated If set to <code>ConditionValidated.Validated</code>, the condition is validated (by the value help) and not shown in the {@link sap.ui.mdc.valuehelp.base.DefineConditionPanel DefineConditionPanel} control
				 * @property {object} [payload] Payload of the condition. Set by application. Data needs to be stringified. (as stored and loaded in variants)
				 * @private
				 * @ui5-restricted sap.fe
				 * @MDC_PUBLIC_CANDIDATE
				 */

				/**
				 * Creates a condition instance for a condition representing a item chosen from the value help.
				 *
				 * This is a "equal to" (EQ) condition with key and description. It is used for entries selected in the field help
				 * and for everything entered in the {@link sap.ui.mdc.Field Field} control.
				 *
				 * @param {string} sKey Operator for the condition
				 * @param {string} sDescription Description of the operator
				 * @param {object} [oInParameters] In parameters of the condition. (Do not use it for new conditions, use payload instead.)
				 * @param {object} [oOutParameters] Out parameters of the condition. (Do not use it for new conditions, use payload instead.)
				 * @param {object} [oPayload] Payload of the condition
				 * @returns {sap.ui.mdc.condition.ConditionObject} The new condition object with the EQ operator along with <code>sKey</code> and <code>sDescription</code> as <code>aValues</code>
				 * @private
				 * @ui5-restricted sap.fe
				 * @MDC_PUBLIC_CANDIDATE
				 *
				 */
				createItemCondition: function(sKey, sDescription, oInParameters, oOutParameters, oPayload) {
					var sValidated = ConditionValidated.NotValidated;
					var aValues = [sKey, sDescription];
					if (sDescription === null || sDescription === undefined) {
						aValues.pop();
					} else {
						sValidated = ConditionValidated.Validated; // if there is a description set it is validated (even if empty string)
					}
					return this.createCondition("EQ", aValues, oInParameters, oOutParameters, sValidated, oPayload);
				},

				/**
				 * Creates a condition object.
				 *
				 * @param {string} sOperator Operator for the condition
				 * @param {any[]} aValues Array of values for the condition
				 * @param {object} [oInParameters] In parameters of the condition. (Do not use it for new conditions, use payload instead.)
				 * @param {object} [oOutParameters] Out parameters of the condition. (Do not use it for new conditions, use payload instead.)
				 * @param {sap.ui.mdc.enum.ConditionValidated} sValidated If set to <code>ConditionValidated.Validated</code>, the condition is validated (by the field help) and not shown in the <code>DefineConditionPanel</code> control
				 * @param {object} [oPayload] Payload of the condition
				 * @returns {sap.ui.mdc.condition.ConditionObject} The new condition object with the given operator and values
				 * @private
				 * @ui5-restricted sap.fe
				 * @MDC_PUBLIC_CANDIDATE
				 *
				 */
				createCondition: function(sOperator, aValues, oInParameters, oOutParameters, sValidated, oPayload) {
					var oCondition = { operator: sOperator, values: aValues, isEmpty: null, validated: sValidated }; // use null as undefined is not recognized by filter
					if (oInParameters) {
						oCondition.inParameters = oInParameters;
					}
					if (oOutParameters) {
						oCondition.outParameters = oOutParameters;
					}
					if (oPayload) {
						oCondition.payload = oPayload;
					}
					return oCondition;
				},

				/**
				 * Compares two conditions in detail
				 *
				 * Opposed to <code>FilterOperatorUtil.compareConditions</code> this comparison checks the whole condition object for equality except the {@link sap.ui.mdc.valuehelp.base.DefineConditionPanel DefineConditionPanel} specific <code>isEmpty</code> flag.
				 *
				 * @param {undefined|sap.ui.mdc.condition.ConditionObject} oCondition1 Condition to check
				 * @param {undefined|sap.ui.mdc.condition.ConditionObject} oCondition2 Condition to check
				 * @returns {boolean} <code>true</code> if conditions are equal
				 * @private
				 * @ui5-restricted sap.ui.mdc
				 */
				compareConditions: function(oCondition1, oCondition2) {
					var sCheckValue1 = fnSerializeCondition(oCondition1);
					var sCheckValue2 = fnSerializeCondition(oCondition2);
					return sCheckValue1 === sCheckValue2;

				},

				_removeEmptyConditions: function(aConditions) {
					for (var i = aConditions.length - 1; i > -1; i--) {
						if (aConditions[i].isEmpty) {
							aConditions.splice(parseInt(i), 1);
						}
					}
					return aConditions;
				},

				_removeInitialFlags: function(aConditions) {
					for (var i = aConditions.length - 1; i > -1; i--) {
						if (aConditions[i].isInitial) {
							delete aConditions[i].isInitial;
						}
					}
					return aConditions;
				}

		};

		return Condition;
	}, /* bExport= */ true);
