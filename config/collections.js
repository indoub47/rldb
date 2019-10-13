module.exports = {
  defect: {
    itype: "defect",
    tables: {
      main: { name: "defects" },
      journal: { name: "defectj" },
      viewActiveLastJ: { name: "defects_active_lastj" },
      viewAllLastJ: { name: "defects_all_lastj" }
    },
    itemNames: {
      item: "defektas",
      Item: "Defektas"
    },
    notPanaikinta: "(dstop IS NULL)",
    samePlaceFilter: {
      insert: {
        text:
          " WHERE (linija = $1 AND kelias = $2 AND km = $3 AND pk = $4 AND m = $5 AND siule = $6) AND regbit = $7",
        mainKeys: ["linija", "kelias", "km", "pk", "m", "siule"]
      },
      update: {
        text:
          " WHERE (linija = $1 AND kelias = $2 AND km = $3 AND pk = $4 AND m = $5 AND siule = $6) AND id <> $7 AND regbit = $8",
        mainKeys: ["linija", "kelias", "km", "pk", "m", "siule", "id"]
      }
    },
    permissions: {
      update: ["adm", "superadm"],
      insert: ["adm", "superadm"],
      delete: ["adm", "superadm"],
      fetchSupplied: ["adm", "superadm"],
      fetchUnapproved: ["oper"],
      supplyWork: ["oper"],
      processApproved: ["adm", "superadm"],
      fetchKmvs: ["kmv", "superadm"]
    }
  },

  welding: {
    itype: "welding",
    tables: {
      main: { name: "weldings" },
      journal: { name: "weldingj" },
      viewActiveLastJ: { name: "weldings_active_lastj" },
      viewAllLastJ: { name: "weldings_all_lastj" }
    },
    itemNames: {
      item: "suvirinimas",
      Item: "Suvirinimas"
    },
    notPanaikinta: "(dstop <> 0)",
    samePlaceFilter: {
      insert: {
        text:
          " WHERE (linija = $1 AND kelias = $2 AND km = $3 AND pk = $4 AND m = $5 AND siule = $6) AND regbit = $7",
        keys: ["linija", "kelias", "km", "pk", "m", "siule"]
      },
      update: {
        text:
          " WHERE (linija = $1 AND kelias = $2 AND km = $3 AND pk = $4 AND m = $5 AND siule = $6) AND id <> $7 AND regbit = $8",
        keys: ["linija", "kelias", "km", "pk", "m", "siule", "id"]
      }
    },
    permissions: {
      update: ["adm", "superadm"],
      insert: ["adm", "superadm"],
      delete: ["adm", "superadm"],
      fetchSupplied: ["adm", "superadm"],
      fetchUnapproved: ["oper"],
      supplyWork: ["oper"],
      processApproved: ["adm", "superadm"],
      fetchKmvs: ["kmv", "superadm"]
    }
  }
};


