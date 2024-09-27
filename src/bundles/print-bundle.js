import jsPDF from "jspdf";
import centroid from "@turf/centroid";

/**
 * Letter size page measures
 * 215.9 × 279.4 millimeters or
 * 8.50 × 11.00 inches or
 * 612 × 792 points  or   72 pt/in
 */

export default {
  name: "print",

  getReducer: () => {
    const initialData = {};

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "":
          return Object.assign({}, state, payload);
        default:
          return state;
      }
    };
  },

  doPrintTest: () => ({ store }) => {
    const mission = store.selectMissionsByRoute();
    const approvals = store.selectMissionsApprovalItems();
    // const org = store.selectOrgsByRoute();
    const domains = store.selectDomainsItemsObject();
    const aoi = store.selectMissionsAoiGeoJSON();
    const missionAreaData = store.selectMissionsAreaDataItem();
    const aircraft = store.selectMissionsAircraftItems();
    const batteries = store.selectMissionsBatteriesItems();
    // const gcs = store.selectMissionsGcsItems();
    const payloads = store.selectMissionsPayloadsItems();
    const figures = store.selectMissionsFiguresItems();
    const personnel = store.selectMissionsPersonnelItems();

    function getDomainValue(key) {
      const d = domains[key];
      if (d) return d.val;
      return "n/a";
    }

    const flightCategoriesArray = mission.flight_category_id
      ? mission.flight_category_id.split(".")
      : [];
    flightCategoriesArray.shift();
    const flightCategories = flightCategoriesArray
      .map((mode) => {
        return getDomainValue(mode);
      })
      .join(", ");

    const flightModesArray = mission.flight_mode_id
      ? mission.flight_mode_id.split(".")
      : [];
    flightModesArray.shift();
    const flightModes = flightModesArray.map((mode) => {
      return getDomainValue(mode);
    });

    const centerPoint = centroid(aoi);
    const latLng = centerPoint.geometry.coordinates.reduce((p, c) => {
      return (p += `  ${Math.round(c * 1000) / 1000}`);
    }, "");

    // mission data stuff
    const airspaceClassArray = missionAreaData.airspace_classification_id
      ? missionAreaData.airspace_classification_id.split(".")
      : [];
    airspaceClassArray.shift();
    const airspaceClasses = airspaceClassArray
      .map((item) => {
        return getDomainValue(item);
      })
      .join(", ");

    const airspaceCoordinationArray = missionAreaData.airspace_coordination_id
      ? missionAreaData.airspace_coordination_id.split(".")
      : [];
    airspaceCoordinationArray.shift();
    const airspaceCoordination = airspaceCoordinationArray
      .map((item) => {
        return getDomainValue(item);
      })
      .join(", ");

    const notamRequirementArray = missionAreaData.notam_requirement_id
      ? missionAreaData.notam_requirement_id.split(".")
      : [];
    notamRequirementArray.shift();
    const notamRequirement = notamRequirementArray
      .map((item) => {
        return getDomainValue(item);
      })
      .join(", ");

    const missionEnvironmentArray = missionAreaData.mission_environment_id
      ? missionAreaData.mission_environment_id.split(".")
      : [];
    missionEnvironmentArray.shift();
    const missionEnvironment = missionEnvironmentArray
      .map((item) => {
        return getDomainValue(item);
      })
      .join(", ");

    const areaAssessmentArray = missionAreaData.area_assessment_id
      ? missionAreaData.area_assessment_id.split(".")
      : [];
    areaAssessmentArray.shift();
    const areaAssessment = areaAssessmentArray
      .map((item) => {
        return getDomainValue(item);
      })
      .join(", ");

    const dataProtectionArray = missionAreaData.data_protection_id
      ? missionAreaData.data_protection_id.split(".")
      : [];
    dataProtectionArray.shift();
    const dataProtection = dataProtectionArray
      .map((item) => {
        return getDomainValue(item);
      })
      .join(", ");

    // signatures and approval stuff
    if (mission.plan_sig) {
      const sig = JSON.parse(atob(mission.plan_sig.split(".")[0]));
      mission.plan_sig_date = sig.date;
    }

    approvals.sort((a, b) => {
      if (a.routing_order > b.routing_order) return 1;
      if (a.routing_order < b.routing_order) return -1;
      return 0;
    });
    const approvalsArray = approvals.map((approvalItem) => {
      if (approvalItem.sig && approvalItem.sig.length) {
        const sig = JSON.parse(atob(approvalItem.sig.split(".")[0]));
        if (approvalItem.approval_role === "Mission Approval Authority")
          mission.approved_date = sig.date;
        return {
          label: approvalItem.approval_role,
          value: `Digitally signed ${sig.username}/${sig.date}`,
          colspan: 12,
          rowspan: 1,
        };
      } else {
        return {
          label: approvalItem.approval_role,
          value: ``,
          colspan: 12,
          rowspan: 1,
        };
      }
    });

    console.log(mission);

    // inventory stuff
    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "letter",
      compress: true,
    });

    let pages = 1;
    let mt = 18;
    let mb = 54;
    let ml = 36;
    let mr = 36;
    let pt = 3;
    let pl = 3;
    let pb = 3;
    let pr = 3;
    let x = ml;
    let y = mt;
    let w = 612 - (ml + mr);
    let h = 792 - (mt + mb);
    let em = 8;
    let rowH = 3 * em;
    let colW = w / 12;

    // print our grid columns
    // pdf.setDrawColor('#cccccc');
    // pdf.setLineWidth(0.5);
    // for(var i = 0; i < 12; i++){
    //   pdf.rect(x + ( i * colW ), y, colW, h, 'S');
    // }
    // pdf.setDrawColor('#000000');

    // print title header
    pdf.setLineWidth(1);
    pdf.rect(36, 18, 612 - 72, 50, "S");

    pdf.setFontSize(16);
    let textY = 18 + pdf.getFontSize();
    pdf.text("SUAS Air Mission Plan", 612 / 2, textY, {
      align: "center",
    });
    pdf.setFontSize(10);
    textY = textY + pdf.getFontSize() + 5;
    pdf.text(
      [
        "For use of this form, see USACE Aviation Policy Letter 19-08",
        "The proponent is HQ, USACE Aviation",
      ],
      612 / 2,
      textY,
      {
        align: "center",
      }
    );

    // reset our cursor
    y = y + 50;

    const cells = [
      {
        label: "1. MISSION ID:",
        value: mission.slug.toUpperCase(),
        colspan: 6,
        rowspan: 1,
      },
      {
        label: "a. SUBMITTED ON:",
        value: mission.plan_sig_date
          ? new Date(mission.plan_sig_date).toLocaleDateString()
          : "n/a",
        colspan: 3,
        rowspan: 1,
      },
      {
        label: "b. APPROVED ON:",
        value: mission.approved_date
          ? new Date(mission.approved_date).toLocaleDateString()
          : "n/a",
        colspan: 3,
        rowspan: 1,
      },
      {
        label: "2. REQUESTING ORG:",
        value: "",
        colspan: 5,
        rowspan: 0.75,
      },
      {
        label: "3. CREW MEMBERS:",
        value: "",
        colspan: 4,
        rowspan: 0.75,
      },
      {
        label: "a. CREW POSITION:",
        value: "",
        colspan: 3,
        rowspan: 0.75,
      },
      {
        label: "a. FOA:",
        value: "",
        colspan: 5,
        rowspan: 1,
      },
      {
        label: "",
        value: personnel[0] ? [`${personnel[0].name}`] : "",
        colspan: 4,
        rowspan: 1,
      },
      {
        label: "",
        value: "",
        colspan: 3,
        rowspan: 1,
      },
      {
        label: "b. POC:",
        value: "",
        colspan: 5,
        rowspan: 1,
      },
      {
        label: "",
        value: personnel[1] ? [`${personnel[1].name}`] : "",
        colspan: 4,
        rowspan: 1,
      },
      {
        label: "",
        value: "",
        colspan: 3,
        rowspan: 1,
      },
      {
        label: "c. PHONE:",
        value: "",
        colspan: 5,
        rowspan: 1,
      },
      {
        label: "",
        value: personnel[2] ? [`${personnel[2].name}`] : "",
        colspan: 4,
        rowspan: 1,
      },
      {
        label: "",
        value: "",
        colspan: 3,
        rowspan: 1,
      },
      {
        label: "d. E-MAIL:",
        value: "",
        colspan: 5,
        rowspan: 1,
      },
      {
        label: "",
        value: personnel[3] ? [`${personnel[3].name}`] : "",
        colspan: 4,
        rowspan: 1,
      },
      {
        label: "",
        value: "",
        colspan: 3,
        rowspan: 1,
      },
      {
        label: "4. MISSION:",
        value: "",
        colspan: 2,
        rowspan: 2,
        baseline: "top",
      },
      {
        label: "a. WHAT",
        value: mission.description,
        colspan: 10,
        rowspan: 2,
        baseline: "top",
      },
      {
        label: ["b. FLIGHT", "CATEGORY:"],
        value: "",
        colspan: 2,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: flightCategories,
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: ["c. SUPPORT", "CATEGORY:"],
        value: "",
        colspan: 2,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: "",
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: [
          "d. FLIGHT MODES",
          "*Indicates Waiver",
          "Required",
          "(Annotate in Block 5)",
        ],
        value: "",
        colspan: 2,
        rowspan: 3,
        baseline: "top",
      },
      {
        label: "Day",
        value: flightModes.indexOf("Day") !== -1 ? "X" : "",
        colspan: 2,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "Night*",
        value: flightModes.indexOf("Night*") !== -1 ? "X" : "",
        colspan: 2,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "BVLOS*",
        value: flightModes.indexOf("BVLOS*") !== -1 ? "X" : "",
        colspan: 2,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "> 100 MPH*",
        value: flightModes.indexOf(">100 MPH*") !== -1 ? "X" : "",
        colspan: 2,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "> 400 Ft AGL*",
        value: flightModes.indexOf(">400Ft AGL*") !== -1 ? "X" : "",
        colspan: 2,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "< 3 Miles Visibility*",
        value: flightModes.indexOf("<3 Miles Visibility*") !== -1 ? "X" : "",
        colspan: 2,
        rowspan: 1,
        coloffset: 2,
        baseline: "top",
      },
      {
        label: "Operate / Fly over Person or People*",
        value:
          flightModes.indexOf("Operate / Fly over Person/People*") !== -1
            ? "X"
            : "",
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: ["Fly from moving vehicle", "or aircraft in pop areas*"],
        value:
          flightModes.indexOf(
            "Fly from moving vehicle or aircraft in populated area*"
          ) !== -1
            ? "X"
            : "",
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: [
          "< 500 Ft Vertically -or-",
          "< 2000 Ft Horizontally From Clouds*",
        ],
        value:
          flightModes.indexOf(
            "<500 Ft Vertically or <2000 Ft Horiz. from Clouds*"
          ) !== -1
            ? "X"
            : "",
        colspan: 5,
        rowspan: 1,
        coloffset: 2,
        baseline: "top",
      },
      {
        label: "Single RPI Operates Multiple UAS*",
        value:
          flightModes.indexOf("Single RPI Operates Multiple UAS*") !== -1
            ? "X"
            : "",
        colspan: 5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "e. SYSTEM EQUIPMENT AND SERIAL NUMBER (S/N):",
        value: "",
        colspan: 12,
        rowspan: 0.75,
      },
      {
        label: "UA(s):",
        value: "",
        colspan: 2,
        rowspan: 1,
      },
      {
        label: "",
        value: aircraft[0]
          ? [
              `${aircraft[0].name}: ${aircraft[0].serial_no}`,
              `${aircraft[0].make} - ${aircraft[0].model}`,
            ]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: aircraft[1]
          ? [
              `${aircraft[1].name}: ${aircraft[1].serial_no}`,
              `${aircraft[1].make} - ${aircraft[1].model}`,
            ]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: aircraft[2]
          ? [
              `${aircraft[2].name}: ${aircraft[2].serial_no}`,
              `${aircraft[2].make} - ${aircraft[2].model}`,
            ]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: aircraft[3]
          ? [
              `${aircraft[3].name}: ${aircraft[3].serial_no}`,
              `${aircraft[3].make} - ${aircraft[3].model}`,
            ]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "Payload(s):",
        value: "",
        colspan: 2,
        rowspan: 1,
      },
      {
        label: "",
        value: payloads[0]
          ? [`${payloads[0].name}: ${payloads[0].serial_no}`]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: payloads[1]
          ? [`${payloads[1].name}: ${payloads[1].serial_no}`]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: payloads[2]
          ? [`${payloads[2].name}: ${payloads[2].serial_no}`]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: payloads[3]
          ? [`${payloads[3].name}: ${payloads[3].serial_no}`]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "Batteries:",
        value: "",
        colspan: 2,
        rowspan: 1,
      },
      {
        label: "",
        value: batteries[0]
          ? [`${batteries[0].name}: ${batteries[0].serial_no}`]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: batteries[1]
          ? [`${batteries[1].name}: ${batteries[1].serial_no}`]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: batteries[2]
          ? [`${batteries[2].name}: ${batteries[2].serial_no}`]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: batteries[3]
          ? [`${batteries[3].name}: ${batteries[3].serial_no}`]
          : "",
        colspan: 2.5,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "f. WHEN:",
        value: "",
        colspan: 2,
        rowspan: 1,
      },
      {
        label: "START DATE:",
        value: new Date(mission.date_start).toLocaleDateString(),
        colspan: 5,
        rowspan: 1,
      },
      {
        label: "END DATE:",
        value: new Date(mission.date_end).toLocaleDateString(),
        colspan: 5,
        rowspan: 1,
      },
      {
        label: "g. WHERE:",
        value: "",
        colspan: 2,
        rowspan: 2,
        baseline: "top",
      },
      {
        label: ["LAT/LON", "of Initial Launch and Recovery Site"],
        value: latLng,
        colspan: 6,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: ["Nearest", "City/Town"],
        value: "",
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: ["Location Description"],
        value: mission.name,
        colspan: 6,
        rowspan: 1,
        coloffset: 2,
        baseline: "top",
      },
      {
        label: ["State"],
        value: "",
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "5. MISSION AREA DATA:",
        value: "",
        colspan: 6,
        rowspan: 0.75,
      },
      {
        label: "6. REQUEST FOR SUPPORT:",
        value: "",
        colspan: 6,
        rowspan: 0.75,
      },
      {
        label: ["a. AIRSPACE", "CLASSIFICATION"],
        value: "",
        colspan: 2,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "",
        value: airspaceClasses,
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "a. EQUIPMENT",
        value: "",
        colspan: 6,
        rowspan: 2,
        baseline: "top",
      },
      {
        label: ["a. AIRSPACE", "COORDINATION"],
        value: "",
        colspan: 2,
        rowspan: 1,
        rowoffset: -1,
        baseline: "top",
      },
      {
        label: "",
        value: airspaceCoordination,
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: ["c. NOTAM(s)", "REQUIREMENT"],
        value: "",
        colspan: 2,
        rowspan: 1,
        newline: true,
        rowoffset: 1,
        baseline: "top",
      },
      {
        label: "",
        value: notamRequirement,
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "b. FLIGHT MODE WAIVER:",
        value: "",
        colspan: 6,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: ["d. RISK", "ASSESSMENT"],
        value: "",
        colspan: 2,
        rowspan: 1,
        newline: true,
        baseline: "top",
      },
      {
        label: "",
        value: "",
        colspan: 4,
        rowspan: 1,
      },
      {
        label: "c. ADDITIONAL SUAC(s):",
        value: "",
        colspan: 6,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: ["e. MISSION", "ENVIRONMENT"],
        value: "",
        colspan: 2,
        rowspan: 1,
        newline: true,
        baseline: "top",
      },
      {
        label: "",
        value: missionEnvironment,
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: "d. REMARKS:",
        value: "",
        colspan: 6,
        rowspan: 4.75,
        baseline: "top",
      },
      {
        label: ["f. AREA", "ASSESSMENT"],
        value: "",
        colspan: 2,
        rowspan: 1,
        newline: true,
        rowoffset: -3.75,
        baseline: "top",
      },
      {
        label: "",
        value: areaAssessment,
        colspan: 4,
        rowspan: 1,
        baseline: "top",
      },
      {
        label: ["g. DATA", "PROTECTION"],
        value: "",
        colspan: 2,
        rowspan: 2.75,
        newline: true,
        rowoffset: 1,
        baseline: "top",
      },
      {
        label: "",
        value: dataProtection,
        colspan: 4,
        rowspan: 2.75,
        baseline: "top",
      },
    ];

    cells.forEach((cell) => {
      const cellWidth = cell.colspan * colW;
      const cellHeight = cell.rowspan * rowH;
      pdf.setFontSize(1 * em);
      pdf.setTextColor("#404040");
      const labelDim = pdf.getTextDimensions(cell.label);
      if (cell.coloffset) x = x + cell.coloffset * colW;
      if (cell.newline) x = ml;
      if (cell.rowoffset) y = y + cell.rowoffset * rowH;
      pdf.rect(x, y, cellWidth, cellHeight, "S");
      let textX = x + pl;
      let textY = y + cellHeight - pb;
      if (cell.baseline === "top") textY = y + pt;
      pdf.text(cell.label, textX, textY, {
        align: cell.align || "left",
        baseline: cell.baseline || "bottom",
      });
      pdf.setFontSize(1.2 * em);
      pdf.setTextColor("#000000");
      textX = x + pl + labelDim.w + pl + pl;
      textY = y + cellHeight - pb;
      if (cell.baseline === "top") textY = y + pt;
      pdf.text(cell.value, textX, textY, {
        align: cell.align || "left",
        baseline: cell.baseline || "bottom",
        maxWidth: cellWidth - (labelDim.w + pl + pl + pr + pr),
      });
      x = x + cellWidth;
      if (x >= ml + w) {
        x = ml;
        y = y + cellHeight;
      }
    });

    // print outer border
    pdf.setLineWidth(1.5);
    const lastRowHeight = cells[cells.length - 1].rowspan * rowH;
    pdf.rect(ml, mt, w, y - mt + lastRowHeight, "S");
    y = y + lastRowHeight;

    // function to add a figure page
    function addFigurePage() {
      // new page for our figures
      pdf.addPage({
        orientation: "p",
        unit: "pt",
        format: "letter",
      });
      pages++;

      // print outer border
      pdf.setLineWidth(1.5);
      pdf.rect(ml, mt, w, h, "S");
    }

    // add our first figure page
    addFigurePage();

    // loop through figures and do the thing
    x = ml;
    y = mt;
    const imgW = w - 2 * pr;
    let imgH = 300;
    figures.forEach((figure, i) => {
      imgH = (imgW * figure.height) / figure.width;
      const labelDim = pdf.getTextDimensions(figure.caption);

      if (y + (imgH + labelDim.h + 3 * pt) > h) {
        addFigurePage();
        y = mt;
      }

      pdf.addImage(
        figure.img,
        "JPEG",
        x + pl,
        y + pt,
        imgW,
        imgH,
        undefined,
        "MEDIUM",
        0
      );
      pdf.text(
        `FIGURE ${i + 1}: ${figure.caption}`,
        (w + 2 * pl) / 2,
        y + imgH + pt,
        {
          align: "center",
          baseline: "top",
          maxWidth: w - 100,
        }
      );
      console.log(Math.ceil(labelDim.w / (w - 100)));
      y = y + (imgH + Math.ceil(labelDim.w / (w - 100)) * labelDim.h + 2 * pt);
    });

    // add our signature page
    addFigurePage();
    x = ml;
    y = mt;
    pdf.setFontSize(1 * em);
    pdf.setTextColor("#404040");
    approvalsArray.forEach((cell) => {
      const cellWidth = cell.colspan * colW;
      const cellHeight = cell.rowspan * rowH;
      pdf.setFontSize(1 * em);
      pdf.setTextColor("#404040");
      const labelDim = pdf.getTextDimensions(cell.label);
      if (cell.coloffset) x = x + cell.coloffset * colW;
      if (cell.newline) x = ml;
      if (cell.rowoffset) y = y + cell.rowoffset * rowH;
      pdf.rect(x, y, cellWidth, cellHeight, "S");
      let textX = x + pl;
      let textY = y + cellHeight - pb;
      if (cell.baseline === "top") textY = y + pt;
      pdf.text(cell.label, textX, textY, {
        align: cell.align || "left",
        baseline: cell.baseline || "bottom",
      });
      pdf.setFontSize(1.2 * em);
      pdf.setTextColor("#000000");
      textX = x + pl + labelDim.w + pl + pl;
      textY = y + cellHeight - pb;
      if (cell.baseline === "top") textY = y + pt;
      pdf.text(cell.value, textX, textY, {
        align: cell.align || "left",
        baseline: cell.baseline || "bottom",
        maxWidth: cellWidth - (labelDim.w + pl + pl + pr + pr),
      });
      x = x + cellWidth;
      if (x >= ml + w) {
        x = ml;
        y = y + cellHeight;
      }
    });

    // loop through pages and print footers
    for (var i = 1; i < pages + 1; i++) {
      pdf.setPage(i);
      // print our footer
      pdf.setFontSize(1.2 * em);
      pdf.text("ENG FORM 176 (Draft), AUG 2019", ml, h + mt + pt, {
        align: "left",
        baseline: "top",
      });
      pdf.text(`PAGE ${i} OF ${pages}`, ml + w, h + mt + pt, {
        align: "right",
        baseline: "top",
      });
    }

    pdf.save(`${mission.slug.toUpperCase()}.pdf`);
  },
};
