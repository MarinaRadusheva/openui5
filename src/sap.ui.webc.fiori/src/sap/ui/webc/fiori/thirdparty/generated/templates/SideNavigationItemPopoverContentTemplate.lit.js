sap.ui.define(['sap/ui/webc/common/thirdparty/base/renderer/LitRenderer'], function (litRender) { 'use strict';

	const block0 = (context, tags, suffix) => suffix ? litRender.html`<${litRender.scopeTag("ui5-responsive-popover", tags, suffix)} vertical-align="Top" class="ui5-side-navigation-popover"><${litRender.scopeTag("ui5-list", tags, suffix)} mode="None" @ui5-item-click="${litRender.ifDefined(context.handleListItemClick)}"><${litRender.scopeTag("ui5-li", tags, suffix)} title="${litRender.ifDefined(context._popoverContent.mainItem._tooltip)}" ?selected="${context._popoverContent.mainItemSelected}" .associatedItem="${litRender.ifDefined(context._popoverContent.mainItem)}">${litRender.ifDefined(context._popoverContent.mainItem.text)}</${litRender.scopeTag("ui5-li", tags, suffix)}>${ litRender.repeat(context._popoverContent.subItems, (item, index) => item._id || index, (item, index) => block1(item, index, context, tags, suffix)) }</${litRender.scopeTag("ui5-list", tags, suffix)}></${litRender.scopeTag("ui5-responsive-popover", tags, suffix)}>` : litRender.html`<ui5-responsive-popover vertical-align="Top" class="ui5-side-navigation-popover"><ui5-list mode="None" @ui5-item-click="${litRender.ifDefined(context.handleListItemClick)}"><ui5-li title="${litRender.ifDefined(context._popoverContent.mainItem._tooltip)}" ?selected="${context._popoverContent.mainItemSelected}" .associatedItem="${litRender.ifDefined(context._popoverContent.mainItem)}">${litRender.ifDefined(context._popoverContent.mainItem.text)}</ui5-li>${ litRender.repeat(context._popoverContent.subItems, (item, index) => item._id || index, (item, index) => block1(item, index, context, tags, suffix)) }</ui5-list></ui5-responsive-popover>`;
	const block1 = (item, index, context, tags, suffix) => suffix ? litRender.html`<${litRender.scopeTag("ui5-li", tags, suffix)} title="${litRender.ifDefined(item._tooltip)}" ?selected="${item.selected}" .associatedItem="${litRender.ifDefined(item)}">${litRender.ifDefined(item.text)}</${litRender.scopeTag("ui5-li", tags, suffix)}>` : litRender.html`<ui5-li title="${litRender.ifDefined(item._tooltip)}" ?selected="${item.selected}" .associatedItem="${litRender.ifDefined(item)}">${litRender.ifDefined(item.text)}</ui5-li>`;

	return block0;

});