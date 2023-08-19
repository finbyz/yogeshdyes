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
    commission_rate: function(frm) {
        if (frm.doc.freight<0 && frm.doc.insurance<0){
        let tot_cal=(frm.doc.total+frm.doc.freight+frm.doc.insurance);
        let value=(tot_cal*frm.doc.commission_rate)/100
        // this.frm.doc.total_commission = flt(value,precision("total_commission"));
        frm.set_value("commission_usd",value);
        // frm.set_value("total_commission",value);
       }
       if (frm.doc.freight>0 && frm.doc.insurance>0){
        let tot_cal=(frm.doc.total);
        let value=(tot_cal * frm.doc.commission_rate)/100
        frm.set_value("commission_usd",value);
       }
     
		// frm.trigger('calculate_commission_');
	},
    
    // calculate_commission_: function (frm) {
    //     console.log(frm.doc.freight)
    //    if (frm.doc.freight<0 && frm.doc.insurance<0){
    //     let tot_cal=(frm.doc.total+frm.doc.freight+frm.doc.insurance)*frm.doc.conversion_rate;
    //     let value=(tot_cal*frm.doc.commission_rate)/100
    //     console.log(value)
    //     frm.set_value("total_commission",value);
    //    }
    //    if (frm.doc.freight>0 && frm.doc.insurance>0){
    //     let tot_cal=(frm.doc.total)*frm.doc.conversion_rate;
    //     let value=(tot_cal * frm.doc.commission_rate)/100
    //     console.log(value)
    //     frm.set_value("total_commission",value);
    //    }
    // },


    before_save: function (frm) {
        frm.trigger("cal_total");
        frm.trigger("calculate_commission_");
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

    },
});

frappe.ui.form.on("Sales Invoice",  {
    custom_address:function(frm){
        if(!frm.doc.custom_address){
            console.log("test")
            frm.set_value('custom_address_display' , '')
        }

    }
});
