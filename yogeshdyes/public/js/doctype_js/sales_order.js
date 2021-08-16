// filters
// cur_frm.fields_dict.notify_party_address_table.grid.get_field("notify_party").get_query = function (doc) {
//     return {
//         query: "frappe.contacts.doctype.address.address.address_query",
//         filters: { link_doctype: "Customer", link_name: cur_frm.doc.customer }
//     };
// };
frappe.ui.form.on("Sales Order", "validate",  function(frm) {
    if (frm.doc.notify_party_address_table){
	frm.doc.notify_party_address_table.forEach( function(row) {
		if (row.notify_party) {
            return frappe.call({
                method: "frappe.contacts.doctype.address.address.get_address_display",
                args: {
                    "address_dict": row.notify_party
                },
                callback: function (r) {
                    if (r.message)
                    frappe.model.set_value(row.doctype,row.name,"notify_address_display", r.message);
                }
            });
            frm.refresh_field("notify_party_address_table");
        }
	});
    }
});
frappe.ui.form.on("Sales Order","onload",  function(frm) {
    if(frm.doc.letter_head){
    cur_frm.fields_dict.letter_head.get_query = function(doc) {
        return {
            filters: {
                "Company": doc.company
            }
        }
    };
}
});
frappe.ui.form.on("Notify Party Address",{
    notify_party: function(frm,cdt,cdn){
        let row = locals[cdt][cdn]
		if (row.notify_party) {
            return frappe.call({
                method: "frappe.contacts.doctype.address.address.get_address_display",
                args: {
                    "address_dict": row.notify_party
                },
                callback: function (r) {
                    if (r.message)
                        frappe.model.set_value(row.doctype,row.name,"notify_address_display", r.message);
                }
            });
        }
    }
});
