from __future__ import unicode_literals

import frappe
import frappe.defaults
from frappe import _
from frappe import msgprint, _
from frappe.utils import nowdate, flt, cint, cstr,now_datetime,getdate, add_days, add_months, get_last_day

def validate_user_permission(self,method):
	if self.user == frappe.session.user:
		frappe.throw("You cannot change permission for your own user id")
	

def execute_fun():
    frappe.get_doc("Purchase Receipt","PREBIL20-2100044").submit()

def pi_on_submit(self,method):
	validate_gst_state_code(self)

def validate_gst_state_code(self):
	gst_accounts = frappe.get_all("GST Account",
		filters={"company":self.company,"is_reverse_charge_account":1 if self.get('reverse_charge') == "Y" else 0 },
		fields=["cgst_account", "sgst_account", "igst_account"])

	if self.taxes:
		account_heads = [t.account_head for t in self.taxes]
		if self.supplier_gstin and self.company_gstin:
			if self.supplier_gstin[0:2] == self.company_gstin[0:2]:
				if gst_accounts[0].cgst_account not in account_heads:
					frappe.msgprint("CGST Account doesn't exists in taxes")
				if gst_accounts[0].sgst_account not in account_heads:
					frappe.msgprint("SGST Account doesn't exists in taxes")
			elif self.supplier_gstin[0:2] != self.company_gstin[0:2]:
				if gst_accounts[0].igst_account not in account_heads:
					frappe.msgprint("IGST Account doesn't exists in taxes")				
