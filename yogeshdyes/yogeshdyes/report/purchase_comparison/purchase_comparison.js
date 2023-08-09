// Copyright (c) 2023, Finbyz Tech. Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Purchase Comparison"] = {
	"filters": [
		{
			"label": __("Item"),
			"fieldname":"item_code",
			"fieldtype":"Link",
			"options": "Item",
		}
	]
};
