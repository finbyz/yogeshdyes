// filters
// cur_frm.fields_dict.notify_party_address_table.grid.get_field("notify_party").get_query = function (doc) {
//     return {
//         query: "frappe.contacts.doctype.address.address.address_query",
//         filters: { link_doctype: "Customer", link_name: cur_frm.doc.customer }
//     };
// };
frappe.ui.form.on("Sales Invoice",  {
    validate: function(frm){
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
    },
    before_save: function (frm) {
        frm.trigger("cal_total");
    },
    cal_total: function (frm) {
        let total_gt_wt = frm.doc.total_tare_wt + frm.doc.total_qty;
        frm.set_value("total_gr_wt", total_gt_wt);
    },
    onload: function(frm){
        if(frm.doc.letter_head){
        cur_frm.fields_dict.letter_head.get_query = function(doc) {
            return {
                filters: {
                    "Company": doc.company
                }
            }
        };
        }
        cur_frm.fields_dict.lut_detail.get_query = function(doc) {
            return {
                filters: {
                    "Company": frm.doc.company
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
    },
});
frappe.ui.form.on("Sales Invoice",  {
    custom_consignee_address:function(frm){
        if(!frm.doc.custom_consignee_address){
            frm.set_value('custom_consignee_address_display' , '')
        }

    }
});

frappe.ui.form.on("Sales Invoice",  {
    custom_address:function(frm){
        if(!frm.doc.custom_address){
            console.log("test")
            frm.set_value('custom_address_display' , '')
        }

    }
});
