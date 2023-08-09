# Copyright (c) 2023, Finbyz Tech. Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.utils import (
	nowdate,
	flt,
	cint,
	cstr,
	now_datetime,
	getdate,
	add_days,
	add_months,
	get_last_day,
)
from frappe import _
# from yogeshdyes.yogeshdyes.report.purchase_comparison.purchase_comparison import get_data

def execute(filters={"item_code":"3 Core X 0.5 mm Sq Copper Shielded  Cable"}):
	columns, data = [], []
	data = get_data(filters)
	columns = get_columns(filters)
	return columns, data
# .where(purchase_invoice.posting_date <= self.filters.to_date)
def get_last_purchase_rate(item_code):
		purchase_invoice = frappe.qb.DocType("Purchase Invoice")
		purchase_invoice_item = frappe.qb.DocType("Purchase Invoice Item")

		query = (
			frappe.qb.from_(purchase_invoice_item)
			.inner_join(purchase_invoice)
			.on(purchase_invoice.name == purchase_invoice_item.parent)
			.select(purchase_invoice_item.base_rate / purchase_invoice_item.conversion_factor , purchase_invoice_item.qty , purchase_invoice.posting_date , purchase_invoice.supplier )
			.where(purchase_invoice.docstatus == 1)
			.where(purchase_invoice_item.item_code == item_code)
		)

		query.orderby(purchase_invoice.posting_date, order=frappe.qb.desc)
		query.limit(1)
		last_purchase_rate = query.run()
		return last_purchase_rate if last_purchase_rate else 0

def get_data(filters):
	conditions = ""
	if filters.get('item_code'):
		conditions += f" Where item.name = '{filters.get('item_code')}' "
	item_data = frappe.db.sql(f"""
						SELECT item.name as item	, item.item_name , sum(bin.actual_qty) as actual_qty , 
						ir.warehouse_reorder_level , ir.warehouse_reorder_qty , item.last_purchase_rate
						From `tabItem` as item
						left join `tabBin` as bin ON bin.item_code =  item.name
						left join `tabItem Reorder` as ir ON ir.parent = item.name
						 {conditions}
						Group By item.name
						""" , as_dict = 1)

	for row in item_data:
		last_purchase_rate = get_last_purchase_rate(row.item)
		if last_purchase_rate:
			row.update({"last_purchase_rate": last_purchase_rate[0][0] , "last_purchase_qty":last_purchase_rate[0][1] , "last_purchase_date" : last_purchase_rate[0][2] , "last_purchase_supplier":last_purchase_rate[0][3] })



	return item_data


def get_columns(filters):
	columns = [
		{"label": _("Item"), "fieldname": "item", "fieldtype":"Link" , "options":"Item" , "width": 120},
		{"label": _("Item Name"), "fieldname": "item_name", "fieldtype":"Data" , "width": 120},
		{"label": _("Actual Qty"), "fieldname": "actual_qty", "fieldtype":"Float" , "width": 120},
		{"label": _("Reorder Level"), "fieldname": "warehouse_reorder_level", "fieldtype":"Data" , "width": 120},
		{"label": _("Reorder Qty"), "fieldname": "warehouse_reorder_qty", "fieldtype":"Float" , "width": 120},
		{"label": _("Last Purchase Rate"), "fieldname": "last_purchase_rate", "fieldtype":"Float" , "width": 120},
		{"label": _("Last Purchase Qty"), "fieldname": "last_purchase_qty", "fieldtype":"Float" , "width": 120},
		{"label": _("Last Purchase Supplier"), "fieldname": "last_purchase_supplier", "fieldtype":"Link" , "options":"Supplier", "width": 120},
	]
	return columns