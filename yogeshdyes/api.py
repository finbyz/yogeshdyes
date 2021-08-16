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