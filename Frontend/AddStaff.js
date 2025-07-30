import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCss from "../css/staff.module.css";

const initialStaffForm = {
  staffCode: "",
  fullName: "",
  gender: "",
  position: "",
  department: "",
};

function AddStaff() {
  const staffDirectory = {
    "S-0001": {
      fullName: "Dr. Cynthia Kha",
      department: "Organisational Development",
      position: "Director",
    },
    "S-0111": {
      fullName: "Thanet Chankriadsakun",
      department: "Organisational Development",
      position: "Director",
    },
    "S-0022": {
      fullName: "Sophia",
      department: "Health Services",
      position: "Assistant Director",
    },
    "S-0136": {
      fullName: "Hla Thein",
      department: "Organisational Development",
      position: "OHS Staff (5)",
    },
    "S-0213": {
      fullName: "Nan Eh Tho",
      department: "Organisational Development",
      position: "M & E Manager (1)",
    },
    "S-0964": {
      fullName: "Saw Eh Doh Htoo",
      department: "Organisational Development",
      position: "OHS Staff (4)",
    },
    "S-1025": {
      fullName: "Saw Sha Htoo",
      department: "Organisational Development",
      position: "OD Coordinator (3)",
    },
    "S-0244": {
      fullName: "Saw Htike Htike",
      department: "Health Service",
      position: "Deputy Director of Clinical Services",
    },
    "S-0256": {
      fullName: "Naw Mya Thida/Khu Say",
      department: "Health Service",
      position: "Deputy Director of Clinical Services",
    },
    "S-0256": {
      fullName: "Naw Mya Thida/Khu Say",
      department: "Health Service",
      position: "Deputy Director of Clinical Services",
    },
    "S-0848": {
      fullName: "Naw Su Moe Moe Kyaw",
      department: "Health Service",
      position: "Accountant (1)",
    },
    "S-1048": {
      fullName: "Naw Shelly Paw",
      department: "Health Service",
      position: "Accountant (3)",
    },
    "S-0948": {
      fullName: "Dr.Lily Sut Myat",
      department: "Health Service",
      position: "RH Technical Support",
    },
    "S-0966": {
      fullName: "Ngwe Yi Lwin",
      department: "Health Service",
      position: "Technicla Physicotherapist",
    },
    "S-0977": {
      fullName: "Dr. Khun Aung Naing Thu",
      department: "Health Service",
      position: "Clinical Technical and Medical Supervisor",
    },
    "S-0980": {
      fullName: "Dr.Zin Mar Than",
      department: "Health Service",
      position: "Radiologist & Clinical Technical Consultant",
    },
    "S-0981": {
      fullName: "Dr.Hnin Maymar Swe",
      department: "Health Service",
      position: "Radiologist & Clinical Technical Consultant",
    },
    "S-0988": {
      fullName: "Dr.Nang Naethit Oo",
      department: "Health Service",
      position: "Child Health Consultant",
    },
    "S-1016": {
      fullName: "Dr.tin Tun Oo",
      department: "Health Service",
      position: "Technical Ophthalmologist",
    },
    "S-0093": {
      fullName: "Saw Eh Kaw Htoo/Aehkothoo",
      department: "ECU",
      position: "ECU In charge",
    },
    "S-0341": {
      fullName: "Naw Mu Wah",
      department: "ECU",
      position: "ECU Supervisor",
    },
    "S-0947": {
      fullName: "Dr.Sainn Mya Thaw",
      department: "ECU",
      position: "ECU Program Coordinator",
    },
    "S-1017": {
      fullName: "Dr.Zaw Soe Htike",
      department: "ECU",
      position: "ECU Consultant",
    },
    "S-1019": {
      fullName: "Dr.Soe Moe Aung",
      department: "ECU",
      position: "ECU Trainer",
    },
    "S-0040": {
      fullName: "Nant Nyo Nyo So",
      department: "IPU",
      position: "IPU Staff",
    },
    "S-0159": {
      fullName: "Ni Ni Mar",
      department: "IPU",
      position: "CHV Staff 3",
    },
    "S-0426": {
      fullName: "Saw Kaw Kline",
      department: "IPU",
      position: "IPU In charge",
    },
    "S-0620": {
      fullName: "Saw Kaw Gay Moo",
      department: "IPU",
      position: "Nurse/HW 2",
    },
    "S-0618": {
      fullName: "Mu Wah Lel",
      department: "IPU",
      position: "Cleaner Staff 2",
    },
    "S-0620": {
      fullName: "Naw Tar Htoo",
      department: "IPU",
      position: "Cleaner Staff 3",
    },
    "S-0665": {
      fullName: "Naw Cha/Naw Ga Yee Tar",
      department: "IPU",
      position: "Cleaner Staff 3",
    },
    "S-0777": {
      fullName: "Thandar Htwe",
      department: "IPU",
      position: "Cleaner Staff 3",
    },
    "S-0818": {
      fullName: "Kaw Hood Paul",
      department: "IPU",
      position: "Staff 2",
    },
    "S-0875": {
      fullName: "Daw Myo Myo",
      department: "IPU",
      position: "Cleaner Staff 4",
    },
    "S-0528": {
      fullName: "Saw Kaw Gay Moo",
      department: "IPU",
      position: "Nurse/HW 2",
    },
    "S-1023": {
      fullName: "Than Than Win",
      department: "IPU",
      position: "Staff 5",
    },
    "S-1024": {
      fullName: "Naw Thandar Htet Kyaw",
      department: "IPU",
      position: "Staff 5",
    },
    "S-1077": {
      fullName: "Ma San Wai",
      department: "IPU",
      position: "Cleaner Staff 5",
    },
    "S-1124": {
      fullName: "Saw Dah Moo",
      department: "IPU",
      position: "IPU Staff 5",
    },
    "S-0433": {
      fullName: "Wah Khu Paw",
      department: "Health Service",
      position: "Nursing Aid Manager",
    },
    "S-0270": {
      fullName: "Nan Ngwe Linn 2",
      department: "Nursing Program",
      position: "Nurse/HW 1",
    },
    "S-0271": {
      fullName: "Nan Yee Yee Htay",
      department: "Nursing Program",
      position: "Nurse Aid Supervisor",
    },
    "S-0405": {
      fullName: "Saw Myint Kyaw",
      department: "Nursing Program",
      position: "Nurse Aid Supervisor",
    },
    "S-0477": {
      fullName: "Naw Hla Hla Win",
      department: "Nursing Program",
      position: "Nurse/HW 1",
    },
    "S-0489": {
      fullName: "Saw Zaw Oo",
      department: "Nursing Program",
      position: "Nurse Aid Supervisor",
    },
    "S-0575": {
      fullName: "Ei San Myint",
      department: "Nursing Program",
      position: "Nurse Aid in charge",
    },
    "S-0634": {
      fullName: "Naw Gay Poe/Naw Thar Gay",
      department: "Nursing Program",
      position: "Nurse/HW 1",
    },
    "S-0635": {
      fullName: "Nan Lay Lay Win",
      department: "Nursing Program",
      position: "Nurse Aid Supervisor",
    },
    "S-0656": {
      fullName: "Naw Ruby Hser/Naw Yu Be Nar",
      department: "Nursing Program",
      position: "Nurse/HW 1",
    },
    "S-0657": {
      fullName: "Naw Ae Say",
      department: "Nursing Program",
      position: "Nurse/HW 1",
    },
    "S-0764": {
      fullName: "Naw Paw Yet Wah",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0804": {
      fullName: "Naw Saviour Wah Htoo",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0806": {
      fullName: "Saw Kyi Wine/Saw Poe Chay Chay",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0810": {
      fullName: "Naw Gay Doh Htoo",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0814": {
      fullName: "Naw Mu Eh",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0815": {
      fullName: "Saw Lah Bway Soe",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0816": {
      fullName: "Maung Nyan Linn",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0889": {
      fullName: "Nan Ei Phyu",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0910": {
      fullName: "Daw Thandar Moe",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0950": {
      fullName: "Saw Hei Nay Moo Thaw",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0951": {
      fullName: "Naw Beh Wah",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0952": {
      fullName: "Naw Chit Chit",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0953": {
      fullName: "Nan Let Let Htun/Miss Naree",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0954": {
      fullName: "Naw Say Say",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0955": {
      fullName: "Saw Aung Myo",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0956": {
      fullName: "Naw Lah Poe Khu",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0957": {
      fullName: "Miss Wandi",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0958": {
      fullName: "Saw Naing Tun",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0959": {
      fullName: "Naw Aye Aye Htwe",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0970": {
      fullName: "Naw Pa Nwe Paw",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0971": {
      fullName: "Saw Taw Nay Htoo",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0972": {
      fullName: "Naw Pa Htar Paw",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0973": {
      fullName: "Saw Ler Bwe Moo",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0974": {
      fullName: "Saw Sar Kee",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0985": {
      fullName: "Nan Zin Mar Win",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-0986": {
      fullName: "Nan Paw Shee Eh",
      department: "Nursing Program",
      position: "Nurse Aid Staff",
    },
    "S-1005": {
      fullName: "Naw Stellar Paw",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1083": {
      fullName: "Nan Eh Than Kyar",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1084": {
      fullName: "Nan Mu Dar Eh",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1085": {
      fullName: "Nan Eh Sue Klaine",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1086": {
      fullName: "Nan Mya Yadanar Kaythi Soe",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1087": {
      fullName: "Nan Chant Phawt Phaung",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1088": {
      fullName: "Saw Thaung Shwe",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1089": {
      fullName: "Nan Chaw Ei Ei Win",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1090": {
      fullName: "Naw Mu Chay",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1091": {
      fullName: "Naw Law Eh Paw",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1092": {
      fullName: "Saw Yair Min Htun",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1093": {
      fullName: "Naw Thidar Win",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1094": {
      fullName: "Saw Aung Myint",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1095": {
      fullName: "Saw Sein Hla Maung",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1096": {
      fullName: "Nan Kalayar Myint Myint Kyaw",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1097": {
      fullName: "Nan Su Khin Lin Saw",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1098": {
      fullName: "Saw Thiha Paing",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1099": {
      fullName: "Nan Hla Soung Moe",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1100": {
      fullName: "Nan San Pwint Win Yi",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1101": {
      fullName: "Nan Khin Sapal Kyi",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1102": {
      fullName: "Naw LahLaw Eh Moo",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1103": {
      fullName: "Naw Phaw Moo Wah",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1104": {
      fullName: "Naw Day Day Phaw",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1105": {
      fullName: "Naw Paw K'Lu Htoo",
      department: "Nursing Program",
      position: "Nurse/HW (3)",
    },
    "S-1128": {
      fullName: "Dr Zwe",
      department: "VCT, Blood Bank Department (HIV Program)",
      position: "M & E Focal",
    },
    "S-0021": {
      fullName: "Naw Sabel Moe / Nopu Phalenoi",
      department: "Health Services",
      position: "HIV Program Manager (1)",
    },
    "S-0196": {
      fullName: "Naw Hsar Eh Gay / Hser Eh Gay",
      department: "VCT, Blood Bank Department (HIV Program)",
      position: "In-Charge (2)",
    },
    "S-0207": {
      fullName: "Naw Esther Paw / Easter Phaw",
      department: "VCT, Blood Bank Department (HIV Program)",
      position: "Supervisor (2)",
    },

    "S-0897": {
      fullName: "Naw Jackalin Aung",
      department: "VCT, Blood Bank Department (HIV Program)",
      position: "MHPSS/HIV Coordinator (3)",
    },
    "S-0921": {
      fullName: "Ah Sue",
      department: "VCT, Blood Bank Department (HIV Program)",
      position: "Referral Staff (2)",
    },
    "S-1015": {
      fullName: "Naw Mary",
      department: "VCT, Blood Bank Department (HIV Program)",
      position: "VCT/Peer Counselor",
    },
    "S-1061": {
      fullName: "Aye Thida",
      department: "VCT, Blood Bank Department (HIV Program)",
      position: "Home Base Care Staff (3)",
    },
    "S-1065": {
      fullName: "Min Thant Zin",
      department: "VCT, Blood Bank Department (HIV Program)",
      position: "VCT Data Staff (2)",
    },
    "S-1080": {
      fullName: "Naw Nay Gay Dee",
      department: "VCT, Blood Bank Department (HIV Program)",
      position: "VCT Counselor Staff (3)",
    },
    "S-0902": {
      fullName: "Naw Eh May Htoo / AEMITOO",
      department: "Health Services",
      position: "Reproductive Health Manager (2)",
    },
    "S-0144": {
      fullName: "Naw Chu Mee / Naw Sue Sue",
      department: "RH IPD",
      position: "In-Charge (1)",
    },
    "S-0154": {
      fullName: "Gay Htoo",
      department: "RH IPD",
      position: "Shift Leader (1)",
    },
    "S-0155": {
      fullName: "Mu Phoung Lar",
      department: "RH IPD",
      position: "Supervisor (1)",
    },
    "S-0206": {
      fullName: "Myint Myint Htay",
      department: "RH IPD",
      position: "Shift Leader (1)",
    },
    "S-0216": {
      fullName: "Aye Aye Win",
      department: "RH IPD",
      position: "Shift Leader (1)",
    },
    "S-0276": {
      fullName: "Nan Su Sandar Win / Nan Phaw Thein Gyi",
      department: "RH IPD",
      position: "Medic (1)",
    },
    "S-0432": {
      fullName: "Soe Nay",
      department: "RH IPD",
      position: "Shift Leader (1)",
    },
    "S-0446": {
      fullName: "Hnin Wai Oo",
      department: "RH IPD",
      position: "Medic (1)",
    },
    "S-0495": {
      fullName: "Nan Win New",
      department: "RH IPD",
      position: "Nurse/HW (1)",
    },
    "S-0573": {
      fullName: "Naw Paw Khu",
      department: "RH IPD",
      position: "Nurse/HW (2)",
    },
    "S-0754": {
      fullName: "Naw Pyo Pyo Aye",
      department: "RH IPD",
      position: "MCH -Health Worker (2)",
    },
    "S-0755": {
      fullName: "Naw Taw Taw",
      department: "RH IPD",
      position: "MCH -Health Worker (2)",
    },
    "S-0766": {
      fullName: "Naw Hay Me Rar Soe",
      department: "RH IPD",
      position: "Health Worker (3)",
    },
    "S-0817": {
      fullName: "Nan Pan Lone",
      department: "RH IPD",
      position: "EmOC Staff (2)",
    },
    "S-0874": {
      fullName: "Naw June Paw",
      department: "RH IPD",
      position: "Nurse/MCH (2)",
    },
    "S-0890": {
      fullName: "Naw Lay Lay Paw",
      department: "RH IPD",
      position: "EmOC HW (1)",
    },
    "S-0963": {
      fullName: "Thandar Phyo Wai",
      department: "RH IPD",
      position: "Health Worker (2)",
    },
    "S-0147": {
      fullName: "Nan Shee Tha Lar / Shee Tha Lar",
      department: "RH OPD",
      position: "In-Charge (2)",
    },
    "S-0148": {
      fullName: "Naw Ree / Phoae Saharattanaphan",
      department: "RH OPD",
      position: "Supervisor (2)",
    },
    "S-0149": {
      fullName: "Than Than Aye",
      department: "RH OPD",
      position: "Medic (1)",
    },
    "S-0153": {
      fullName: "Nan Kyi Kyi Aye / Nan Kyi aye",
      department: "RH OPD",
      position: "Medic (1)",
    },
    "S-0481": {
      fullName: "Naw Paw Htee Has / Paw Tee Sa",
      department: "RH OPD",
      position: "Medic (1)",
    },
    "S-0967": {
      fullName: "Naw Margaret",
      department: "RH OPD",
      position: "Health Worker (3)",
    },
    "S-1006": {
      fullName: "Daw Khine Shwe Zin",
      department: "RH OPD",
      position: "Health Worker (3)",
    },
    "S-1027": {
      fullName: "Naw Say Say Lwel",
      department: "RH OPD",
      position: "Health Worker (2)",
    },
    "S-1067": {
      fullName: "Nan Thazin Khine",
      department: "RH OPD",
      position: "Health Worker (4)",
    },
    "S-1068": {
      fullName: "Nan Eh Paw Tan",
      department: "RH OPD",
      position: "Health Worker (4)",
    },
    "S-1069": {
      fullName: "Naw Paw Thoo Lei",
      department: "RH OPD",
      position: "Health Worker (4)",
    },
    "S-0120": {
      fullName: "Hsar Moo Moo",
      department: "Health Services",
      position: "HIS Manager (1)",
    },
    "S-0026": {
      fullName: "Naw Hsar Moo / Naw Eh Moo",
      department: "HIS and Registration",
      position: "Staff (5)",
    },
    "S-0066": {
      fullName: "Moe Wai",
      department: "HIS and Registration",
      position: "Staff (1)",
    },
    "S-0250": {
      fullName: "Saw Poe Thar Nyaw",
      department: "HIS and Registration",
      position: "In-Charge (2)",
    },
    "S-0608": {
      fullName: "Htoo Htoo",
      department: "HIS and Registration",
      position: "Staff (3)",
    },
    "S-0669": {
      fullName: "Saw Aung Myo Htun",
      department: "HIS and Registration",
      position: "Staff (1)",
    },
    "S-0748": {
      fullName: "Saw Lah Kit",
      department: "HIS and Registration",
      position: "Medic (2)",
    },
    "S-0778": {
      fullName: "Saw Lay Doh",
      department: "HIS and Registration",
      position: "Staff (2)",
    },
    "S-0852": {
      fullName: "Naw Moo Eh Thaw",
      department: "HIS and Registration",
      position: "Staff (4)",
    },
    "S-0865": {
      fullName: "Saw Paing Aung",
      department: "HIS and Registration",
      position: "HIS and Registration Coordinator (2)",
    },
    "S-0882": {
      fullName: "Saw Chit San Lay",
      department: "HIS and Registration",
      position: "Staff (3)",
    },
    "S-0922": {
      fullName: "Saw Eh Kham Lar",
      department: "HIS and Registration",
      position: "Health Worker (3)",
    },
    "S-1021": {
      fullName: "Saw Moe Kyaw Kyaw",
      department: "HIS and Registration",
      position: "Staff (4)",
    },
    "S-1074": {
      fullName: "Saw Joseph Win",
      department: "HIS and Registration",
      position: "HIS staff (4)",
    },
    "S-1107": {
      fullName: "Naw Mu Kyar Oo",
      department: "HIS and Registration",
      position: "Patient Contribution Staff (5)",
    },
    "S-1121": {
      fullName: "Glory Sher Blue Wah",
      department: "HIS and Registration",
      position: "HIS Staff (4)",
    },
    "S-1122": {
      fullName: "Naw Hser Nay Gay",
      department: "HIS and Registration",
      position: "HIS Staff (4)",
    },
    "S-0075": {
      fullName: "Myint Htay (Daisy Paw)",
      department: "Eye Program",
      position: "Staff (1)",
    },
    "S-0114": {
      fullName: "Tamala Wah",
      department: "Eye Program",
      position: "In-Charge (2)",
    },
    "S-0115": {
      fullName: "U Myint Soe",
      department: "Eye Program",
      position: "Medic (2)",
    },
    "S-0117": {
      fullName: "Gay Paw",
      department: "Eye Program",
      position: "Medic (1)",
    },
    "S-0125": {
      fullName: "Say Nay",
      department: "Eye Program",
      position: "Medic (1)",
    },
    "S-0020": {
      fullName: "Nan May Soe",
      department: "Health Services",
      position: "Health Supportive Manager (1)",
    },
    "S-0173": {
      fullName: "Than Oo",
      department: "Lab",
      position: "Lab Staff (1)",
    },
    "S-0178": {
      fullName: "CC Job / Yaw Ba Htoo",
      department: "Lab",
      position: "In-Charge (2)",
    },
    "S-0180": {
      fullName: "Ah Nic",
      department: "Lab",
      position: "Staff (1)",
    },
    "S-0181": {
      fullName: "Naw Ku",
      department: "Lab",
      position: "Lab Staff (1)",
    },
    "S-0182": {
      fullName: "Nan Kyi Kyi Win",
      department: "Lab",
      position: "Lab Staff (1)",
    },
    "S-0184": {
      fullName: "Naw Ye Ye Win",
      department: "Lab",
      position: "Lab Staff (1)",
    },
    "S-0550": {
      fullName: "Ma Thin Thin Maw",
      department: "Lab",
      position: "Lab Staff (1)",
    },
    "S-0714": {
      fullName: "Khin Zaw Ag",
      department: "Lab",
      position: "Staff (1)",
    },
    "S-0885": {
      fullName: "Nan Yin Htwe",
      department: "Lab",
      position: "Staff (1)",
    },
    "S-0928": {
      fullName: "Naw Hsar Eh Htoo",
      department: "Lab",
      position: "Staff (3)",
    },
    "S-0931": {
      fullName: "Nan Shwe Zin Thein",
      department: "Lab",
      position: "Staff (2)",
    },
    "S-0997": {
      fullName: "U La Min Oo",
      department: "Lab",
      position: "Staff (1)",
    },
    "S-0157": {
      fullName: "Naw Klar Tee",
      department: "Referral",
      position: "Referral Coordinator (3)",
    },
    "S-0318": {
      fullName: "Naw Paw Hla Yee",
      department: "Referral",
      position: "Staff (1)",
    },
    "S-0533": {
      fullName: "Win Thidar",
      department: "Referral",
      position: "CHV-Staff (1)",
    },
    "S-0873": {
      fullName: "Daw Moo Thoukyar",
      department: "Referral",
      position: "Staff (1)",
    },
    "S-0884": {
      fullName: "Thin Ei Aung",
      department: "Referral",
      position: "Staff (2)",
    },
    "S-1079": {
      fullName: "Eh Ka Nyaw",
      department: "Referral",
      position: "Staff (3)",
    },
    "S-1118": {
      fullName: "Zin Min Oo",
      department: "Referral",
      position: "Staff (3)",
    },
    "S-0069": {
      fullName: "Saw Tay Tay / Tay Tay",
      department: "Adult & Child IPD",
      position: "Supervisor (1)",
    },
    "S-0070": {
      fullName: "Saw Su Klaing",
      department: "Adult & Child IPD",
      position: "In-Charge (1)",
    },
    "S-0082": {
      fullName: "Truman / Saw Lwal Tal",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0087": {
      fullName: "Saw Kyi Lynn",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0088": {
      fullName: "Saw Moo Htaw",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0101": {
      fullName: "Saw Maw Do",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0139": {
      fullName: "Saw Wai Yan Linn",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0258": {
      fullName: "Saw Aung Htay",
      department: "Adult & Child IPD",
      position: "Shift Leader (1)",
    },
    "S-0259": {
      fullName: "Khin Hnin Htwe / Ma Khin Lay Htwe",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0261": {
      fullName: "Saw Thu Thit",
      department: "Adult & Child IPD",
      position: "Shift Leader (1)",
    },
    "S-0263": {
      fullName: "Paw K'Paw Shee",
      department: "Adult & Child IPD",
      position: "Adult & Child IPD Supervisor (1)",
    },
    "S-0266": {
      fullName: "Saw Always",
      department: "Adult & Child IPD",
      position: "Shift Leader (1)",
    },
    "S-0273": {
      fullName: "Saw Ler Moo / Saw Tin Tun",
      department: "Adult & Child IPD",
      position: "Shift Leader (1)",
    },
    "S-0353": {
      fullName: "Saw Par Soe Gay",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0357": {
      fullName: "Naw Shee Nar Win",
      department: "Adult & Child IPD",
      position: "Shift Leader (1)",
    },
    "S-0373": {
      fullName: "Nan San San Aye",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0418": {
      fullName: "Naw Paw Aye",
      department: "Adult & Child IPD",
      position: "Shift Leader (1)",
    },
    "S-0427": {
      fullName: "Mr. Saw Dar Balal",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0429": {
      fullName: "Sa Htet Zin",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0633": {
      fullName: "Saw Henry",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0759": {
      fullName: "Aung Paing Oo",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0779": {
      fullName: "Saw Kee Tu",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0805": {
      fullName: "Naw Ah Ree Paw",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0807": {
      fullName: "Nan Swe Zin Than",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-0809": {
      fullName: "Saw Davidson",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-1011": {
      fullName: "Saw Pah Tha Dah",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-1028": {
      fullName: "Nan Mya Hnin Aung",
      department: "Adult & Child IPD",
      position: "Medic (1)",
    },
    "S-1132": {
      fullName: "Eh Gay Shee",
      department: "Adult & Child IPD",
      position: "Medic (3)",
    },
    "S-1082": {
      fullName: "Naw Moo Naw",
      department: "Adult & Child IPD",
      position: "Medic (3)",
    },
    "S-1125": {
      fullName: "Naw Christ Eh Wah Paw",
      department: "Adult & Child IPD",
      position: "Medic (3)",
    },
    "S-0262": {
      fullName: "Nan Pan Aye / Naw Paw Khue",
      department: "Health Services",
      position: "Adult & Child Health IPD Manager (1)",
    },
    "S-0138": {
      fullName: "Naw Lah",
      department: "Physiotherapy & TCM Department",
      position: "Staff (1)",
    },
    "S-0242": {
      fullName: "Naw Gu Gu",
      department: "Physiotherapy & TCM Department",
      position: "Staff (3)",
    },
    "S-0625": {
      fullName: "Saw Eh Htoo / THAY DO HTOO",
      department: "Physiotherapy & TCM Department",
      position: "Physio Coordinator (2)",
    },
    "S-0892": {
      fullName: "Naw Doh Htoo",
      department: "Physiotherapy & TCM Department",
      position: "Allied Health Assistant Staff (2)",
    },
    "S-0917": {
      fullName: "Naw Mu Khe Lar Say",
      department: "Physiotherapy & TCM Department",
      position: "Staff (4)",
    },
    "S-1075": {
      fullName: "Saw Kyay Hei",
      department: "Physiotherapy & TCM Department",
      position: "Staff (4)",
    },
    "S-1115": {
      fullName: "Naw Htoo Bwe",
      department: "Physiotherapy & TCM Department",
      position: "Allied Health Assistant Staff (4)",
    },
    "S-1116": {
      fullName: "Saw Aung Ko Win",
      department: "Physiotherapy & TCM Department",
      position: "Allied Health Assistant Staff (4)",
    },
    "S-1117": {
      fullName: "Ma Aye Aye Myint",
      department: "Physiotherapy & TCM Department",
      position: "Allied Health Assistant Staff (4)",
    },
    "S-0068": {
      fullName: "Saw Eh Ta Mwee / Arpee Arpee",
      department: "Surgical OPD",
      position: "In-Charge (2)",
    },
    "S-0071": {
      fullName: "Saw Lah Ku Htoo",
      department: "Surgical OPD",
      position: "Clinical Supervisor (2)",
    },
    "S-0080": {
      fullName: "Naw Paw Eh Htoo",
      department: "Surgical OPD",
      position: "Medic (1)",
    },
    "S-0267": {
      fullName: "Saw Eh K'Lu",
      department: "Surgical OPD",
      position: "Medic (1)",
    },
    "S-0168": {
      fullName: "Nyein Shwe Myint Htwe",
      department: "Adult-OPD",
      position: "Medic (1)",
    },
    "S-0170": {
      fullName: "Thi Thi Aye / Ta Kaw Paw",
      department: "Adult-OPD",
      position: "In-Charge (2)",
    },
    "S-0201": {
      fullName: "Yan Naing Moe",
      department: "Adult-OPD",
      position: "Medic (1)",
    },
    "S-0339": {
      fullName: "Aye Linn Thu",
      department: "Adult-OPD",
      position: "Supervisor (2)",
    },
    "S-0370": {
      fullName: "Nan Kyi Kyi Aye",
      department: "Adult-OPD",
      position: "Health Worker (1)",
    },
    "S-0406": {
      fullName: "Lah Lu",
      department: "Adult-OPD",
      position: "Medic (1)",
    },
    "S-0829": {
      fullName: "Naw Lay Ku Paw",
      department: "Adult-OPD",
      position: "Health Worker (3)",
    },
    "S-0900": {
      fullName: "U Kyaw Myaing",
      department: "Adult-OPD",
      position: "Medic (2)",
    },
    "S-0901": {
      fullName: "Naw Eh Say Wah",
      department: "Adult-OPD",
      position: "Health Worker (1)",
    },
    "S-0907": {
      fullName: "Yadana Oo",
      department: " Adult-OPD",
      position: "Health Worker (1)",
    },
    "S-0984": {
      fullName: "Ngamsiri Khamnuanpanaprai",
      department: "Adult-OPD",
      position: "Health Worker (4)",
    },
    "S-1057": {
      fullName: "Nan War War Hlaing",
      department: "Adult-OPD",
      position: "Health Worker (4)",
    },
    "S-0077": {
      fullName: "Naw Bway Paw / NAW SAR GALE",
      department: "Child OPD & Immunization",
      position: "Supervisor (2)",
    },
    "S-0097": {
      fullName: "Saw Kyay Poe",
      department: "Child OPD & Immunization",
      position: "Medic (1)",
    },
    "S-0272": {
      fullName: "Naw Gree Say",
      department: "Child OPD & Immunization",
      position: "In-Charge (2)",
    },
    "S-0369": {
      fullName: "Mya Than Htun",
      department: "Child OPD & Immunization",
      position: "Supervisor (2)",
    },
    "S-0490": {
      fullName: "Naw Naing Naing Thein / Naw Naing Naing Say",
      department: "Child OPD & Immunization",
      position: "Medic (1)",
    },
    "S-0770": {
      fullName: "Naw Sea Lar Paw",
      department: "Child OPD & Immunization",
      position: "Health Worker (2)",
    },
    "S-0962": {
      fullName: "Naw San San Cho",
      department: "Child OPD & Immunization",
      position: "Health Worker (4)",
    },
    "S-1012": {
      fullName: "Naw Bay Bay / Mrs. Myint Thein",
      department: "Child OPD & Immunization",
      position: "Medic (2)",
    },
    "S-1026": {
      fullName: "Naw Hser Hser",
      department: "Child OPD & Immunization",
      position: "Health Worker (2)",
    },
    "S-1059": {
      fullName: "Nan Thet Htay Myint",
      department: "Child OPD & Immunization",
      position: "Health Worker (4)",
    },
    "S-0364": {
      fullName: "Nan Kaw Thanoung Awar",
      department: "Dental",
      position: "CHW - Health Worker (1)",
    },
    "S-0763": {
      fullName: "Aye Tun",
      department: "Dental",
      position: "Supervisor (4)",
    },
    "S-0998": {
      fullName: "Hein Htet Aung",
      department: "Dental",
      position: "Dental Staff (1)",
    },
    "S-1062": {
      fullName: "Naw Su Kyi",
      department: "Dental",
      position: "Dental Staff (5)",
    },
    "S-0265": {
      fullName: "Tin Tin Soe",
      department: "Health Services",
      position: "Adult & Child Health OPD Manager (2)",
    },
    "S-0085": {
      fullName: "Naw Lu Bway Doh",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "CHW - Health Worker (1)",
    },
    "S-0121": {
      fullName: "Su Su Myint (Shar Ro Paw)",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "In-Charge (2)",
    },
    "S-0122": {
      fullName: "Naw Mee Mee / Mee Mee",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "Store keeper Coordinator (3)",
    },
    "S-0164": {
      fullName: "Hla Moo",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "Supervisor (2)",
    },
    "S-0198": {
      fullName: "Ma Hla Hla Win",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "CHW Staff (1)",
    },
    "S-0337": {
      fullName: "Naw Paw Wah",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "CHW Staff (1)",
    },
    "S-0535": {
      fullName: "Mue Lar Paung",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "CHW Staff (1)",
    },
    "S-0537": {
      fullName: "Naw Bu Say / Naw Khu Hsel",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "Medic (1)",
    },
    "S-0581": {
      fullName: "Saw Htun Zaw Oo",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "CHW Staff (2)",
    },
    "S-0627": {
      fullName: "Thein Zaw Win",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "Staff (1)",
    },
    "S-0799": {
      fullName: "Naw Mu Kha",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "MCH/CHW Staff (1)",
    },
    "S-0812": {
      fullName: "Naw Paw lah Thoo",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "Pharmacist Staff (1)",
    },
    "S-0819": {
      fullName: "Naw Tha Lay Paw / Siripon",
      department: "Pharmacy OPD and Central Pharmacy",
      position: "Pharmacist Staff (2)",
    },
    "S-1120": {
      fullName: "Saw Kyaw Pwel Moo",
      department: "Pharamcy IPD",
      position: "Health Worker (4)",
    },
    "S-0738": {
      fullName: "S'Pai Soe Moe / Eh Khu",
      department: "Health Services",
      position: "QI Manager (1)",
    },
    "S-0019": {
      fullName: "Nwe Ni Aung / Ms. Nuai Ni Aung",
      department: "Health Training and Community Health",
      position: "Deputy Director of Health Training and Community Health",
    },
    "S-0943": {
      fullName: "Dr. Thu Ya Aung / Yan Aung",
      department: "Health Training and Community Health",
      position: "Surgical Technical Trainer",
    },
    "S-0944": {
      fullName: "Dr. Saw San / Saw Pyi San Moe",
      department: "Health Training and Community Health",
      position: "MCH Technical Trainer",
    },
    "S-0945": {
      fullName: "Dr. Pyone Cho / Pho Cho",
      department: "Health Training and Community Health",
      position:
        "Clinical internship and medical student supervision consultant",
    },
    "S-0946": {
      fullName: "Dr. Saw Thiha Thein",
      department: "Health Training and Community Health",
      position: "Community Health Technical Support",
    },
    "S-1018": {
      fullName: "Dr. Min Kyaw Thu",
      department: "Health Training and Community Health",
      position: "EmONC Trainer",
    },
    "S-0999": {
      fullName: "Thuzar Htun",
      department: "Community Health",
      position: "Food Safety Staff (1)",
    },
    "S-1072": {
      fullName: "Naw Merry Linn",
      department: "Community Health and SRHR Program",
      position: "Staff (4)",
    },
    "S-0640": {
      fullName: "Saw Naing Oo",
      department: "Community Health",
      position: "DPHP Coordinator (2)",
    },
    "S-0248": {
      fullName: "Saw Hla Khin (or) Saw Eh Mwee",
      department: "School Health",
      position: "School Health Coordinator (2)",
    },
    "S-1112": {
      fullName: "Than Htike Lin",
      department: "School Health",
      position: "Staff (1)",
    },
    "S-0327": {
      fullName: "Saw Kyaing Tha Rit / MR. JATREE",
      department: "Training Office",
      position: "Health Training Manager (1)",
    },
    "S-0916": {
      fullName: "Naw Soe Soe",
      department: "Training Office",
      position: "Clinical Training Quality Improvement Manager (1)",
    },
    "S-0143": {
      fullName: "Naw Aye Aye / MISS AE AE",
      department: "Training Office",
      position: "MCH Supervisor (2)",
    },
    "S-0332": {
      fullName: "Miss. Daw Jyi Jyi Khaing",
      department: "Training Office",
      position: "Staff (2)",
    },
    "S-0576": {
      fullName: "Naw Soe Soe",
      department: "Training Office",
      position: "Child Health Supervisor (2)",
    },
    "S-0909": {
      fullName: "Mrs. Khaing Nandar Shwe",
      department: "Training Office",
      position: "Accountant Training and Community Health",
    },
    "S-1114": {
      fullName: "Naw Yin Thu Zar Aye",
      department: "Training Office",
      position: "Trainee Dormitory Supervisor (3)",
    },
    "S-0906": {
      fullName: "Naw Htoo Mu Paw",
      department: "Bachelor of Nursing",
      position: "Academic Manager (1)",
    },
    "S-0913": {
      fullName: "Naw Day Day",
      department: "Bachelor of Nursing",
      position: "Administration Officer",
    },
    "S-0990": {
      fullName: "Min Aung Zin Htet",
      department: "Bachelor of Nursing",
      position: "Accountant Staff (1)",
    },
    "S-0991": {
      fullName: "Say Moo Paw",
      department: "Bachelor of Nursing",
      position: "Administration Manager (1)",
    },
    "S-0992": {
      fullName: "Nan Sanay Mue",
      department: "Bachelor of Nursing",
      position: "Nursing Educator",
    },
    "S-0993": {
      fullName: "Saw Nyi Nyi Htoo",
      department: "Bachelor of Nursing",
      position: "Nursing Educator",
    },
    "S-0994": {
      fullName: "Naw Eh Dah Paw",
      department: "Bachelor of Nursing",
      position: "Nursing Educator",
    },
    "S-1133": {
      fullName: "Aung Thu Phyo",
      department: "Bachelor of Nursing",
      position: "Teacher (1)",
    },
    "S-0199": {
      fullName: "Thinn Naing / Aye Saing",
      department: "Library",
      position: "Staff (4)",
    },
    "S-0861": {
      fullName: "Saw Chan Thar",
      department: "Library",
      position: "Library Staff (4)",
    },
    "S-0940": {
      fullName: "U Nay Myo Aye",
      department: "Library",
      position: "Library Staff (1)",
    },
    "S-0277": {
      fullName: "Ko Shwe Hnin",
      department: "Education",
      position: "Deputy Director Education",
    },
    "S-0283": {
      fullName: "May Thazin Htun",
      department: "CDC - Admin",
      position: "Administration Manager (2)",
    },
    "S-0290": {
      fullName: "Naw Eal Say",
      department: "CDC - Admin",
      position: "Staff (3)",
    },
    "S-0296": {
      fullName: "Naw Eh Wah",
      department: "CDC - Admin",
      position: "HR & Accountant Coordinator (2)",
    },
    "S-0540": {
      fullName: "Naw Htoo Ler Wah",
      department: "CDC - Admin",
      position: "Staff (4)",
    },
    "S-0789": {
      fullName: "Saw Har Doh",
      department: "CDC - Admin",
      position: "Staff (3)",
    },
    "S-0305": {
      fullName: "Saw Hla Win / Sa Win",
      department: "CDC - Admin",
      position: "Staff (4)",
    },
    "S-0541": {
      fullName: "Cho Mar Wai",
      department: "CDC - Admin",
      position: "Staff (4)",
    },
    "S-0320": {
      fullName: "Saw Doh / Phatho",
      department: "CDC - Admin",
      position: "Staff (3)",
    },
    "S-0747": {
      fullName: "Maung Saw Christy Paul",
      department: "CDC - Admin",
      position: "Staff (3)",
    },
    "S-0300": {
      fullName: "Saw Lin Kyaw",
      department: "CDC - Admin",
      position: "IT & Documentation Supervisor (1)",
    },
    "S-0757": {
      fullName: "Saw Htee Mu Htoo",
      department: "CDC - Admin",
      position: "Logistics and Facilities Supervisor (1)",
    },
    "S-0542": {
      fullName: "Poe Nya",
      department: "CDC - Admin",
      position: "Staff (4)",
    },
    "S-0925": {
      fullName: "U Kyaw Thiha",
      department: "CDC - Admin",
      position: "Admin Staff (5)",
    },
    "S-1033": {
      fullName: "Myo Thu Ya Aung",
      department: "CDC - Admin",
      position: "School Security staff (3)",
    },
    "S-0299": {
      fullName: "Man Than Than Lay",
      department: "CDC - Admin",
      position: "Operations Manager (1)",
    },
    "S-0388": {
      fullName: "Maung Moe Hein",
      department: "CDC - High Teachers",
      position: "Teacher (2)",
    },
    "S-0872": {
      fullName: "Naw Eh Wah Paw",
      department: "CDC - High Teachers",
      position: "Class Subject Teacher (3)",
    },
    "S-0935": {
      fullName: "Win Min Hein",
      department: "CDC - High Teachers",
      position: "Teacher (3)",
    },
    "S-0936": {
      fullName: "U Wai Yan Phyo",
      department: "CDC - High Teachers",
      position: "Teacher (3)",
    },
    "S-0938": {
      fullName: "Daw Htet Mon Myint",
      department: "CDC - High Teachers",
      position: "Teacher (3)",
    },
    "S-0939": {
      fullName: "Daw Wah Wah Aye",
      department: "CDC - High Teachers",
      position: "Teacher (3)",
    },
    "S-1000": {
      fullName: "Mr. Thant Zin",
      department: "CDC - High Teachers",
      position: "Teacher (3)",
    },
    "S-1035": {
      fullName: "Saw Ehain Phoo Kyaw",
      department: "CDC - High Teachers",
      position: "Teacher (3)",
    },
    "S-1037": {
      fullName: "Daw Nyunt Nyunt Htay",
      department: "CDC - High Teachers",
      position: "Teacher (3)",
    },
    "S-1039": {
      fullName: "Saw Paing Sin",
      department: "CDC - High Teachers",
      position: "Multi-Rist Reduction Education Program Assistant",
    },
    "S-1049": {
      fullName: "Nan Yu Nandar Chaw",
      department: "CDC - High Teachers",
      position: "Teacher (3)",
    },
    "S-1050": {
      fullName: "U Soe Moe Htwe",
      department: "CDC - High Teachers",
      position: "Computer Teacher / Teacher (3)",
    },
    "S-1064": {
      fullName: "Daw Cho Mar Aung",
      department: "CDC - High Teachers",
      position: "Teacher (3)",
    },
    "S-0855": {
      fullName: "Daw May Zin Thant",
      department: "CDC - Middle Teachers",
      position: "Teacher (3)",
    },
    "S-0856": {
      fullName: "Naw Su War War Lin",
      department: "CDC - Middle Teachers",
      position: "Teacher (3)",
    },
    "S-0933": {
      fullName: "Naw Karici Paw",
      department: "CDC - Middle Teachers",
      position: "Teacher (3)",
    },
    "S-0934": {
      fullName: "Naw Paw Baw",
      department: "CDC - Middle Teachers",
      position: "Teacher (3)",
    },
    "S-0976": {
      fullName: "Daw Vung San Kim / Miss Wung Sam Kim",
      department: "CDC - Middle Teachers",
      position: "Teacher (3)",
    },
    "S-1010": {
      fullName: "Saw Sein Than",
      department: "CDC - Middle Teachers",
      position: "Teacher (3)",
    },
    "S-1034": {
      fullName: "Daw Khin Mya Win",
      department: "CDC - Middle Teachers",
      position: "Teacher (3)",
    },
    "S-1038": {
      fullName: "Khun Ye Htet Khaung",
      department: "CDC - Middle Teachers",
      position: "Teacher (3)",
    },
    "S-0293": {
      fullName: "Anna Paw",
      department: "CDC - Primary Teachers",
      position: "Teacher (3)",
    },
    "S-0297": {
      fullName: "Naw Lah K'Paw / Naw Hay Bulu",
      department: "CDC - Primary Teachers",
      position: "Teacher (3)",
    },
    "S-0745": {
      fullName: "Kyaw Soe",
      department: "CDC - Primary Teachers",
      position: "Teacher (3)",
    },
    "S-0857": {
      fullName: "Ma Wut Yi Htay",
      department: "CDC - Primary Teachers",
      position: "Teacher (3)",
    },
    "S-0858": {
      fullName: "Ma Zin Mo Mo Aung",
      department: "CDC - Primary Teachers",
      position: "Teacher (3)",
    },
    "S-0867": {
      fullName: "Tin Maung Swe",
      department: "CDC - Primary Teachers",
      position: "Class Subject Teacher (3)",
    },
    "S-0869": {
      fullName: "U Kyaw Lin Tun",
      department: "CDC - Primary Teachers",
      position: "Class Subject Teacher (3)",
    },
    "S-0870": {
      fullName: "Kae Blute Moo",
      department: "CDC - Primary Teachers",
      position: "Class Subject Teacher (3)",
    },
    "S-0932": {
      fullName: "Ja Wang",
      department: "CDC - Primary Teachers",
      position: "Teacher (3)",
    },
    "S-1032": {
      fullName: "U Tin Yu",
      department: "CDC - Primary Teachers",
      position: "Teacher (3)",
    },
    "S-1047": {
      fullName: "Nant Thazin Htet Htet",
      department: "CDC - Primary Teachers",
      position: "CSE Teacher (4)",
    },
    "S-1081": {
      fullName: "Aye Aye Thant",
      department: "CDC - Primary Teachers",
      position: "Teacher (3)",
    },
    "S-0506": {
      fullName: "Mr. Sunil Martin",
      department: "CDC - High Teachers",
      position: "Teacher",
    },
    "S-0682": {
      fullName: "Miss Tida Panabua-ngoen",
      department: "Non-Formal Education (NFE)",
      position: "Thai Teacher (2)",
    },
    "S-0684": {
      fullName: "Miss Duangdaw Wancharoenmai",
      department: "Non-Formal Education (NFE)",
      position: "Administration Coordinator (3)",
    },
    "S-0685": {
      fullName: "Miss Sudaporn Warunvaratorn",
      department: "Non-Formal Education (NFE)",
      position: "School Health Coordinator (3)",
    },
    "S-0688": {
      fullName: "Miss Wannaruk Phalko",
      department: "Non-Formal Education (NFE)",
      position: "Thai Teacher (2)",
    },
    "S-0690": {
      fullName: "Miss Nalinthip Phawilaisin",
      department: "Non-Formal Education (NFE)",
      position: "Non-Formal Education (NFE) Coordinator (2)",
    },
    "S-0791": {
      fullName: "Miss Korntipa Takunkeeree",
      department: "Non-Formal Education (NFE)",
      position: "Academic Coordinator (3)",
    },
    "S-0792": {
      fullName: "Mr. Sitthaporn Suwannachit",
      department: "Non-Formal Education (NFE)",
      position: "NFE Teacher (2)",
    },
    "S-0975": {
      fullName: "Don Chai / Seejindawana",
      department: "Non-Formal Education (NFE)",
      position: "Teacher (1)",
    },
    "S-1003": {
      fullName: "Vollapon Chawakhiri",
      department: "Non-Formal Education (NFE)",
      position: "Thai Teacher (1)",
    },
    "S-1106": {
      fullName: "Naw Lar May Win",
      department: "Non-Formal Education (NFE)",
      position: "Thai Teacher (3)",
    },
    "S-0317": {
      fullName: "Naw Aye Lar",
      department: "CDC - Early Childhood Development (ECD)",
      position: "ECD Teacher (3)",
    },
    "S-0712": {
      fullName: "Mrs. Shwe Sin Aye",
      department: "CDC - Early Childhood Development (ECD)",
      position: "ECD Teacher (3)",
    },
    "S-0713": {
      fullName: "Khin Ohnmar Shwe",
      department: "CDC - Early Childhood Development (ECD)",
      position: "ECD Teacher (3)",
    },
    "S-0903": {
      fullName: "Nant Yamin Thuzar",
      department: "CDC - Early Childhood Development (ECD)",
      position: "ECD Teacher (3)",
    },
    "S-0926": {
      fullName: "Nan May Khalar",
      department: "CDC - Early Childhood Development (ECD)",
      position: "Thai Teacher (3)",
    },
    "S-1045": {
      fullName: "Daw Nilar Win",
      department: "CDC - Early Childhood Development (ECD)",
      position: "Kitchen Staff (5)",
    },
    "S-1046": {
      fullName: "Naw Eh Hser Htee Paw",
      department: "CDC - Early Childhood Development (ECD)",
      position: "Assistant Teacher (3)",
    },
    "S-0504": {
      fullName: "Saw Myint Oo",
      department: "CDC - Education Quality Frame Work (EQF)",
      position: "Education Manager (2)",
    },
    "S-0280": {
      fullName: "Naw Bleh Wah Paw",
      department: "CDC - Community Development / Protection",
      position: "Community Development / Protection Manager (2)",
    },
    "S-0386": {
      fullName: "Naw Mairyar Paul",
      department: "CDC - Community Development / Protection",
      position: "Librarian Teacher (1)",
    },
    "S-0612": {
      fullName: "Naw Eh Wah",
      department: "CDC - Community Development / Protection",
      position: "Vocational Coordinator (3)",
    },
    "S-0700": {
      fullName: "Naw Tha Dah Paw",
      department: "CDC - Community Development / Protection",
      position: "School Health Coordinator (3)",
    },
    "S-0377": {
      fullName: "Mya Thandar",
      department: "GED Program",
      position: "GED Teacher (Mathematics Subject)",
    },
    "S-0894": {
      fullName: "Myo Win Nyein / Myo Yin",
      department: "GED Program",
      position: "GED Teacher (Social Studies)",
    },
    "S-1043": {
      fullName: "Nwe Ni Soe",
      department: "GED Program",
      position: "Higher Education and GED Coordinator (2)",
    },
    "S-0893": {
      fullName: "Mya That Nwe",
      department: "GED Program",
      position: "GED Teacher (Science Subject)",
    },
    "S-1051": {
      fullName: "Aung Myo Kyaw",
      department: "GED Program",
      position: "GED Teacher (English Subject)",
    },
    "S-0911": {
      fullName: "Sumitra Thida Soe",
      department: "Child Protection",
      position: "IPSR Project Coordinator",
    },
    "S-1066": {
      fullName: "Moe Hnin Phyu Phwe",
      department: "Child Protection",
      position: "Enumerator / Data Officer",
    },
    "S-0295": {
      fullName: "Nant Chaw Chaw",
      department: "Child Protection",
      position: "Women & Child Protection Manager (1)",
    },
    "S-0853": {
      fullName: "Chue Ngey Ngey",
      department: "Child Protection",
      position: "Staff (2)",
    },
    "S-1020": {
      fullName: "Phong Zi",
      department: "Child Protection",
      position: "Admin & HR Coordinator (3)",
    },
    "S-1052": {
      fullName: "Khin Zar Aye",
      department: "Child Protection",
      position: "Staff (1)",
    },
    "S-0231": {
      fullName: "Nway Nway Oo",
      department: "Child Protection",
      position: "Deputy Director of Protection",
    },
    "S-0203": {
      fullName: "Ta Ma Lar Wah",
      department: "Birth Registration",
      position: "BR Supervisor (3)",
    },
    "S-0238": {
      fullName: "Hnin Yu Yu Nyein",
      department: "Birth Registration",
      position: "BR Staff (3)",
    },
    "S-0845": {
      fullName: "Aye Myat Thu",
      department: "Birth Registration",
      position: "Birth Registration and Child Protection staff (4)",
    },
    "S-1053": {
      fullName: "Victoria / Naw Htwe",
      department: "Birth Registration",
      position: "Staff (3)",
    },
    "S-0307": {
      fullName: "Naw Eh Klu Paw",
      department: "Daycare Centre",
      position: "Staff (3)",
    },
    "S-0323": {
      fullName: "Naw Paw Ler Moo / Miss Pholaemu Rakdaenphal",
      department: "Daycare Centre",
      position: "Staff (3)",
    },
    "S-0324": {
      fullName: "Naw Than Hla",
      department: "Daycare Centre",
      position: "Staff (3)",
    },
    "S-0326": {
      fullName: "Naw Saytaver Moo",
      department: "Daycare Centre",
      position: "Staff (3)",
    },
    "S-0534": {
      fullName: "Mrs. Lar Khin Hla",
      department: "Daycare Centre",
      position: "Staff (3)",
    },
    "S-0638": {
      fullName: "Naw Palae Wah",
      department: "Daycare Centre",
      position: "Staff (3)",
    },
    "S-0703": {
      fullName: "Naw Eh Shee Wah",
      department: "Daycare Centre",
      position: "Staff (3)",
    },
    "S-0793": {
      fullName: "Naw Paw Paw",
      department: "Daycare Centre",
      position: "Staff (3)",
    },
    "S-0929": {
      fullName: "Naw Thoe Paw Dah",
      department: "Daycare Centre",
      position: "Staff (4)",
    },
    "S-1008": {
      fullName: "Naw Tha Nay Htoo",
      department: "Daycare Centre",
      position: "Staff (4)",
    },
    "S-1029": {
      fullName: "Naw Pae Pae",
      department: "Daycare Centre",
      position: "Staff (4)",
    },
    "S-0319": {
      fullName: "Naw Lily Aung",
      department: "Boarding House (Migrant)",
      position: "BH In-Charge (2)",
    },
    "S-0927": {
      fullName: "Naw Honey Joy",
      department: "CDC Boarding House IDP",
      position: "CDC's Dormitory Supervisor (4)",
    },
    "S-0197": {
      fullName: "Naw Million / Mrs. Malia Chankiadsakun",
      department: "Child Protection",
      position: "Women & Child Protection case management Coordinator (3)",
    },
    "S-0918": {
      fullName: "Shine Yati Ko",
      department: "Child Protection",
      position: "Women & Child Case Management Assistance Staff (1)",
    },
    "S-0010": {
      fullName: "Eh Nar Moo / Aenamu Ruechaiwichit",
      department: "Finance",
      position: "Deputy Director",
    },
    "S-0412": {
      fullName: "Saw Sein Min",
      department: "Finance",
      position: "Finance & Accountant Coordinator (3)",
    },
    "S-0498": {
      fullName: "Eh Klo Dah / Ae Klo Da",
      department: "Finance",
      position: "Finance Manager (1)",
    },
    "S-0776": {
      fullName: "Hnin Pwint Phyu / Cha Lisar",
      department: "Finance",
      position: "Assistant Manager (2)",
    },
    "S-0796": {
      fullName: "Miss Wasana Pattanpanich",
      department: "Finance",
      position: "Senior Banking Officer",
    },
    "S-0800": {
      fullName: "Saw ReJoice",
      department: "Finance",
      position: "Senior Accountant",
    },
    "S-0842": {
      fullName: "Jasmine Lu",
      department: "Finance",
      position: "Junior Accountant",
    },
    "S-0908": {
      fullName: "Zin Zin Myint",
      department: "Finance",
      position: "Junior Cashier",
    },
    "S-1007": {
      fullName: "July Win",
      department: "Finance",
      position: "Junior Cashier",
    },
    "S-1078": {
      fullName: "Grace / Chonthicha Roeingratsakun",
      department: "Finance",
      position: "Junior Banking Officer",
    },
    "S-1113": {
      fullName: "Sa Zaw Lu Chit",
      department: "Finance",
      position: "Senior Accountant",
    },
    "S-0017": {
      fullName: "Naw Stella Paw",
      department: "Human Resources",
      position: "HR Manager (1)",
    },
    "S-0598": {
      fullName: "Naw Sharro Htoo",
      department: "Human Resources",
      position: "HR Coordinator (2)",
    },
    "S-0762": {
      fullName: "Mrs. Wachiraya Singpraertkun",
      department: "Human Resources",
      position: "HR Legal document Coordinator (3)",
    },
    "S-0923": {
      fullName: "Saw Fedo / Mr. Naing Swe Oo",
      department: "Human Resources",
      position: "Payroll Officer",
    },
    "S-1002": {
      fullName: "Nan Phot Awr",
      department: "Human Resources",
      position: "Accountant (2)",
    },
    "S-1123": {
      fullName: "Saw Nya Wah",
      department: "Human Resources",
      position: "Staff (4)",
    },
    "S-0236": {
      fullName: "Saw Mya Thein",
      department: "Logistics",
      position: "Storekeeper / Staff (3)",
    },
    "S-0643": {
      fullName: "Saw Moon Light",
      department: "Logistics",
      position: "Logistic Coordinator (3)",
    },
    "S-0760": {
      fullName: "Naw Shine / Mrs Nochoe Siniathamkhanaphal",
      department: "Logistics",
      position: "In-Charge (2)",
    },
    "S-0761": {
      fullName: "Eh Htee Khaung / JATTRIN",
      department: "Logistics",
      position: "Central Warehouse Store Keeper",
    },
    "S-1055": {
      fullName: "Miss Kanyarak",
      department: "Logistics",
      position: "Procurement Staff (2)",
    },
    "S-1060": {
      fullName: "Molo / Samsor Saharattanaphan",
      department: "Logistics",
      position: "Procurement Staff (1)",
    },
    "S-0045": {
      fullName: "Saw Wunna / Wunna Aung",
      department: "Operations",
      position: "Vehicle In-Charge (1)",
    },
    "S-0234": {
      fullName: "Saw Ler Htoo / Ker Thoo",
      department: "Operations",
      position: "Logistic Manager (1)",
    },
    "S-0192": {
      fullName: "Saw Cho Kwee",
      department: "Vehicle",
      position: "4 Wheel Driver",
    },
    "S-0329": {
      fullName: "Mr. Yo Nay Htee",
      department: "Vehicle",
      position: "4 Wheel Driver",
    },
    "S-0349": {
      fullName: "Poe Kay (Saw Hlin Htwe)",
      department: "Vehicle",
      position: "4 Wheel Driver",
    },
    "S-0733": {
      fullName: "Saw Kanok Thongfakhunakon",
      department: "Vehicle",
      position: "6 Wheel Driver",
    },
    "S-0737": {
      fullName: "Mr. Thoku Phetnaphum",
      department: "Vehicle",
      position: "6 Wheel Driver",
    },
    "S-0769": {
      fullName: "Tin Ag Tun",
      department: "Vehicle",
      position: "Spare/Staff (4)",
    },
    "S-0864": {
      fullName: "Mr. Bunthaen Katikaboriban",
      department: "Vehicle",
      position: "6 Wheel Driver",
    },
    "S-1022": {
      fullName: "Mr. Prawit Moradokkeeree",
      department: "Vehicle",
      position: "6 Wheel Driver",
    },
    "S-1030": {
      fullName: "Saw Yo Tha",
      department: "Vehicle",
      position: "Spare/Staff (5)",
    },
    "S-1040": {
      fullName: "Mr. Rangsan Khongsathitnaiwana",
      department: "Vehicle",
      position: "6 Wheel Driver",
    },
    "S-1131": {
      fullName: "Htaw Nay Moo / Suwin SonSaengjan",
      department: "Vehicle",
      position: "4 Wheel Driver",
    },
    "S-0214": {
      fullName: "Naw lay Lay / Poe Lay",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "In-Charge (1)",
    },
    "S-0246": {
      fullName: "Naw Eh Khu Shee / Miss Mueja Kaenjae",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "Adult & Child IPD In-Charge (1)",
    },
    "S-0360": {
      fullName: "Nan Thazin Kyaw",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "Medic (1)",
    },
    "S-0413": {
      fullName: "Naw Thar Daw Phlal Mue",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "QI Coordinator (3)",
    },
    "S-0416": {
      fullName: "Khun Paing Oo",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "Medical Training Supervisor (2)",
    },
    "S-0485": {
      fullName: "Naw Cho Cho Naing / Ser Ser",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "Nurse/HW (1)",
    },
    "S-0514": {
      fullName: "Naw Christina / Naw December Phaw",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "RH Supervisor (2)",
    },
    "S-0556": {
      fullName: "Myint Myint San",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "Shift Leader (1)",
    },
    "S-0566": {
      fullName: "Saw X' Klay / Saw Chit Htwe",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "Nurse/HW (1)",
    },
    "S-0577": {
      fullName: "Saw Eh Si / Saw Kyaw Eh Kyi",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "Medic (1)",
    },
    "S-0652": {
      fullName: "Maung Chaw",
      department: "Staff Advance Course (Bachelor of Nursing)",
      position: "Medic (1)",
    },
    "S-0780": {
      fullName: "Naw Htee Kleet",
      department: "Staff Advance Course (EmONC)",
      position: "CHW/MCH",
    },
    "S-1014": {
      fullName: "Khun Ye Htwe",
      department: "Staff Advance Course (EmONC)",
      position: "MCH - Health Worker (3)",
    },
    "S-1070": {
      fullName: "Naw Su Po Po",
      department: "Staff Advance Course (EmONC)",
      position: "Health Worker (3)",
    },
    "S-1071": {
      fullName: "Naw Hnin Tha Zin Oo",
      department: "Staff Advance Course (EmONC)",
      position: "Health Worker (3)",
    },
    "S-0532": {
      fullName: "Nan Nilar / Nan Ohn Ni",
      department: "Staff Advance Course (Medic Group 3)",
      position: "Nurse/HW (2)",
    },
    "S-0813": {
      fullName: "Saw Hser Htoo Lo",
      department: "Staff Advance Course (Medic Group 3)",
      position: "Nurse Aide Staff (1)",
    },
    "S-0232": {
      fullName: "Naw Annie / Naw Anne Htun",
      department: "Community Operations",
      position: "Deputy Director Community Operations",
    },
    "S-0013": {
      fullName: "Khun Way",
      department: "Administration",
      position: "Volunteer & Visitor support staff (1)",
    },
    "S-0016": {
      fullName: "Saw Eh Dee",
      department: "Administration",
      position: "IT & Photocopy Coordinator (3)",
    },
    "S-0187": {
      fullName: "Sunny Aye / Sunne Ae",
      department: "Administration",
      position: "Liaison Coordinator (2)",
    },
    "S-0384": {
      fullName: "Naw Lwel Lwel / Laeh Laeh",
      department: "Administration",
      position: "Administration Manager (1)",
    },
    "S-0624": {
      fullName: "Khaing Zar Lin",
      department: "Administration",
      position: "Admin Coordinator (2)",
    },
    "S-0798": {
      fullName: "Aye Kham",
      department: "Administration",
      position: "Cleaning Staff (4)",
    },
    "S-0841": {
      fullName: "Saw Klo Doh Htoo",
      department: "Administration",
      position: "Land 3 Supervisor (3)",
    },
    "S-0851": {
      fullName: "S'Khaung Mike Tar / Khaung Mike Tar",
      department: "Administration",
      position: "Admin Staff (3)",
    },
    "S-0989": {
      fullName: "Wichai / Saw Eh K'Lear Soe",
      department: "Administration",
      position: "Staff (3)",
    },
    "S-1073": {
      fullName: "Nan Yein Yein",
      department: "Administration",
      position: "Staff (5)",
    },
    "S-0400": {
      fullName: "Saw Gay Nay Dee / Saw Kyaw Aye",
      department: "Fundraising",
      position: "Grants Coordinator (1)",
    },
    "S-0451": {
      fullName: "Naw Winny Htoo / Naw Win Ni Htoo",
      department: "Fundraising",
      position: "Grants Coordinator (1)",
    },
    "S-0730": {
      fullName: "Seongmin Kim",
      department: "Fundraising",
      position: "Fundraising & Grants Manager",
    },
    "S-1001": {
      fullName: "Myo Myint Myat Wai",
      department: "Fundraising",
      position: "Fundraising Assistant Manager (2)",
    },
    "S-1044": {
      fullName: "Naw April Wah",
      department: "Fundraising",
      position: "Grants Assistant Manager (2)",
    },
    "S-0018": {
      fullName: "Naw Htoo",
      department: "Community Operations",
      position: "Social Work Manager (1)",
    },
    "S-0995": {
      fullName: "Eh Khu Paw",
      department: "Community Operations",
      position: "Admin & HR Coordinator (3)",
    },
    "S-0033": {
      fullName: "Zaw Oo",
      department: "Kitchen",
      position: "Supervisor (3)",
    },
    "S-0035": {
      fullName: "Than Htay",
      department: "Kitchen",
      position: "Staff (3)",
    },
    "S-0036": {
      fullName: "Myint Naing Soe",
      department: "Kitchen",
      position: "Coordinator (3)",
    },
    "S-0037": {
      fullName: "Daw Kyi Kyi Aye",
      department: "Kitchen",
      position: "Staff (2)",
    },
    "S-0960": {
      fullName: "Naw Ke Wah",
      department: "Kitchen",
      position: "Staff (4)",
    },
    "S-0056": {
      fullName: "Nay Oo",
      department: "Security and Patients Relation",
      position: "Coordinator (2)",
    },
    "S-0057": {
      fullName: "Aung Pay",
      department: "Security and Patients Relation",
      position: "Supervisor (1)",
    },
    "S-0058": {
      fullName: "Saw Baw Nay Htoo",
      department: "Security and Patients Relation",
      position: "Supervisor (3)",
    },
    "S-0060": {
      fullName: "Eh Htal Moo",
      department: "Security and Patients Relation",
      position: "Staff (3)",
    },
    "S-0107": {
      fullName: "Pout Pout",
      department: "Security and Patients Relation",
      position: "Staff (2)",
    },
    "S-0374": {
      fullName: "Htun Win (Ah Pu)",
      department: "Security and Patients Relation",
      position: "Staff (4)",
    },
    "S-0623": {
      fullName: "Ko Aung",
      department: "Security and Patients Relation",
      position: "Staff (2)",
    },
    "S-0641": {
      fullName: "U Than Aung",
      department: "Security and Patients Relation",
      position: "Staff (4)",
    },
    "S-0651": {
      fullName: "Saw Khlo Htoo",
      department: "Security and Patients Relation",
      position: "Staff (3)",
    },
    "S-0846": {
      fullName: "Sai Kyaw Wann",
      department: "Security and Patients Relation",
      position: "Staff (4)",
    },
    "S-0876": {
      fullName: "Saw Nay Soe",
      department: "Security and Patients Relation",
      position: "Staff (4)",
    },
    "S-0987": {
      fullName: "Tun Myint Thein",
      department: "Security and Patients Relation",
      position: "Staff (4)",
    },
    "S-1076": {
      fullName: "Thanda Mon",
      department: "Security and Patients Relation",
      position: "Staff (5)",
    },
    "S-1126": {
      fullName: "Saw Lar Eh",
      department: "Security and Patients Relation",
      position: "Staff (5)",
    },
    "S-1127": {
      fullName: "Thu Kha Lin",
      department: "Security and Patients Relation",
      position: "Staff (5)",
    },
    "S-0133": {
      fullName: "Saw Design Oo",
      department: "Community Operations",
      position: "Facilities Manager (1)",
    },
    "S-0046": {
      fullName: "Tin Mg Win",
      department: "Facilities",
      position: "Supervisor (2)",
    },
    "S-0513": {
      fullName: "Saw Bel",
      department: "Facilities",
      position: "Logistic and Pharmacy Warehouse Staff (1)",
    },
    "S-0750": {
      fullName: "Saw Hlwan Moe Naing",
      department: "Facilities",
      position: "Staff (2)",
    },
    "S-0772": {
      fullName: "Saw Steven",
      department: "Facilities",
      position: "Wastewater System Maintainer Staff",
    },
    "S-0773": {
      fullName: "Saw Pi Oo",
      department: "Facilities",
      position: "Facility General Assistant Staff (3)",
    },
    "S-0795": {
      fullName: "Saw Denial / Poe Nyi",
      department: "Facilities",
      position: "Furniture/fitting Maintaining Staff (1)",
    },
    "S-0833": {
      fullName: "Ah Sai",
      department: "Facilities",
      position: "Staff (5)",
    },
    "S-0834": {
      fullName: "Daw Nyo Nyo Win",
      department: "Facilities",
      position: "Staff (5)",
    },
    "S-0850": {
      fullName: "Saw Ye Yint Naing",
      department: "Facilities",
      position: "Facilities Assistant Manager (2)",
    },
    "S-0891": {
      fullName: "Win Hlaing Tun",
      department: "Facilities",
      position: "Warehouse Staff (3)",
    },
    "S-0898": {
      fullName: "Sa Lwin Ko Oo",
      department: " Facilities",
      position: "Facilities Wastewater and Backup Accountant Staff",
    },
    "S-0899": {
      fullName: "Ko Aung Lin Moe",
      department: " Facilities",
      position: "Gardener Staff (5)",
    },
    "S-1110": {
      fullName: "Saw Nay Min",
      department: " Facilities",
      position: "Construction Supervisor (1)",
    },
    "S-1111": {
      fullName: "Min Thit Ko Ko",
      department: "Facilities",
      position: "Quality Improvement and M&E Supervisor (1)",
    },
    "S-0041": {
      fullName: "Tin Htun",
      department: "Water & Sanitation",
      position: "In-Charge (2)",
    },
    "S-0042": {
      fullName: "Khin Kyi Win",
      department: "Water & Sanitation",
      position: "Cleaner/Staff (4)",
    },
    "S-0043": {
      fullName: "Thein Soe",
      department: " Water & Sanitation",
      position: "Cleaner Leader Staff",
    },
    "S-0047": {
      fullName: "U Ngae",
      department: " Water & Sanitation",
      position: "Staff (4)",
    },
    "S-0052": {
      fullName: "Ma Nu / HLA HLA NU",
      department: " Water & Sanitation",
      position: "Cleaner/Staff (4)",
    },
    "S-0053": {
      fullName: "Daw Eh Kone",
      department: "Water & Sanitation",
      position: "Staff (3)",
    },
    "S-0054": {
      fullName: "Ma Wai / DAW KHIN HLA WAI",
      department: "Water & Sanitation",
      position: "Cleaner/Staff (4)",
    },
    "S-0836": {
      fullName: "Saw Tin Win",
      department: "Water & Sanitation",
      position: "Staff (1)",
    },
    "S-0847": {
      fullName: "Saw Thein Mg Chant",
      department: " Water & Sanitation",
      position: "Staff (3)",
    },
    "S-0941": {
      fullName: "San San Win / Mu Dah Bu",
      department: "Water & Sanitation",
      position: "Staff (5)",
    },
    "S-0961": {
      fullName: "Min Ko / Mr. Maung Myat Min Ko",
      department: "Water & Sanitation",
      position: "Cleaner Staff (4)",
    },
    "S-1063": {
      fullName: "Mg Naing Win",
      department: "Water & Sanitation",
      position: "Cleaner Staff (5)",
    },
    "S-1119": {
      fullName: "Saw Thein Tun Maung",
      department: "Water & Sanitation",
      position: "Staff (5)",
    },
    "S-0051": {
      fullName: "Mrs. Cho Mar",
      department: "Sewing Center",
      position: "Staff (4)",
    },
    "S-0311": {
      fullName: "Naw Ah Kyi / Mu Htoo",
      department: "Sewing Center",
      position: "Staff (3)",
    },
    "S-0942": {
      fullName: "Sui Ngun Par",
      department: "Sewing Center",
      position: "Staff (3)",
    },
    "S-0445": {
      fullName: "Eh Gay Wah / Wah Wah Poe",
      department: "Burma Based Health Services",
      position: "Operation Manager (1)",
    },
    "S-0844": {
      fullName: "Naw Nay Blut Htoo",
      department: "Burma Based Health Services",
      position: "Admin & HR Coordinator (3)",
    },
    "S-0888": {
      fullName: "Naw Wah Paw",
      department: " Burma Based Health Services",
      position: "HIS and M&E Coordinator (2)",
    },
    "S-0914": {
      fullName: "Naw Sar Eh",
      department: " Burma Based Health Services",
      position: "Pharmacy Warehouse Coordinator (3)",
    },
    "S-0915": {
      fullName: "S'Aung Naing Moe",
      department: " Burma Based Health Services",
      position: "School Health Staff (2)",
    },
    "S-1109": {
      fullName: "Daw Om Tee",
      department: " Burma Based Health Services",
      position: "Ethnic School Health Working Group Coordinator (3)",
    },
    "S-0735": {
      fullName: "Naw Palae Paw / PALEPOR",
      department: "Burma Based Health Services",
      position: "Deputy Director of BBHS",
    },
    "S-0034": {
      fullName: "Aung Myo Htut / Aung Myo Kyaw",
      department: "Kitchen",
      position: "Staff (4)",
    },
    "S-0383": {
      fullName: "Kleh Moo / Saw Kalae Mue",
      department: "Community Health",
      position: "Community Health Manager (1)",
    },
    "S-1137": {
      fullName: "Dr. Win Yarzar Soe",
      department: " Health Services",
      position: "Dentist",
    },
    "S-1138": {
      fullName: "Dr. Ei Zin Hein",
      department: " Health Services",
      position: "Laboratory Physician Consultant",
    },
    "S-1130": {
      fullName: "Thant Sin Oo",
      department: "HIS and Registration",
      position: "Administration Information System Technical Consultant",
    },
    "S-1054": {
      fullName: "John Aung Khant Wai",
      department: " HIS and Registration",
      position: "Health Information System Technical Lead",
    },
    "S-1139": {
      fullName: "Kyaw Swan Pyae Linn",
      department: " HIS and Registration",
      position: "Technical Trainer",
    },
    "S-1108": {
      fullName: "Dr. Aung Thura Htoo",
      department: "HIS and Registration",
      position: "HIS Technical Support",
    },
    "S-1140": {
      fullName: "Dr. Paing Zaw",
      department: " Health Training and Community Health",
      position: "Community Health Worker Lead Trainer",
    },
    "S-1141": {
      fullName: "Mrs. Supattra Jaiprong",
      department: "Bachelor of Nursing Program",
      position: "Nursing Clinical Coordinator",
    },
    "S-1142": {
      fullName: "Pyone Pyone Kyi",
      department: "Bachelor of Nursing Program",
      position: "Consultant for Bachelor of Nursing Science",
    },
    "S-1143": {
      fullName: "Dr. Thein Win",
      department: " Burma Based Health Services",
      position: "BBHS Consultant",
    },
    "S-1144": {
      fullName: "Dr. Khin Thida Saw",
      department: "ECU",
      position: "Emergency Care Unit (ECU) Volunteer",
    },
    "V-0001": {
      fullName: "Zin Mar Win",
      department: "CDC-Admin",
      position: "Volunteer",
    },
    "V-0002": {
      fullName: "Saw Thoe Htane",
      department: " CDC-Admin",
      position: "Volunteer",
    },
    "V-0003": {
      fullName: "Saw Myo Swe Lin",
      department: " CDC-Admin",
      position: "Volunteer",
    },
    "V-0004": {
      fullName: "Thanakit",
      department: "CDC-Admin",
      position: "Volunteer",
    },
    "V-0005": {
      fullName: "Bhone Thit Ko Ko",
      department: " CDC-Admin",
      position: "Volunteer",
    },
    "V-0006": {
      fullName: "Nwe",
      department: "CDC-Admin",
      position: "Volunteer",
    },
    "V-0007": {
      fullName: "Aye Myat Mon",
      department: "CDC-Admin",
      position: "Volunteer",
    },
    "V-0008": {
      fullName: "Naw Blut Law La Htoo",
      department: "Finance",
      position: "Volunteer",
    },
    "V-0009": {
      fullName: "La San Aung",
      department: "Finance",
      position: "Volunteer",
    },
    "V-0010": {
      fullName: "Saw Kaw Kaw",
      department: "Vehicle",
      position: "Volunteer",
    },
    "V-0011": {
      fullName: "Naw Eh May Paw",
      department: " RH OPD",
      position: "Volunteer",
    },
    "V-0012": {
      fullName: "Daripaw",
      department: "Burma Based Health Services",
      position: "Volunteer",
    },
    "V-0013": {
      fullName: "Nan Sa Nay Ma",
      department: "Burma Based Health Services",
      position: "Volunteer",
    },
    "V-0014": {
      fullName: "Ywun Shwe Hlwar",
      department: "Staff Advance",
      position: "Volunteer",
    },
    "V-0015": {
      fullName: "Thin Nandi San",
      department: "Staff Advance",
      position: "Volunteer",
    },
    "V-0016": {
      fullName: "Min Htun Myat Wai",
      department: "Staff Advance",
      position: "Volunteer",
    },
    "V-0017": {
      fullName: "Thel Nandar Swe",
      department: "Staff Advance",
      position: "Volunteer",
    },
    "V-0018": {
      fullName: "Mg Nay Ni Lwin",
      department: "Staff Advance",
      position: "Volunteer",
    },
    "V-0019": {
      fullName: "Yar Zar Oo",
      department: "Staff Advance",
      position: "Volunteer",
    },
    "V-0020": {
      fullName: "Aye Mya Nandar",
      department: "Staff Advance",
      position: "Volunteer",
    },
    "V-0021": {
      fullName: "Swan Yee Phyo Htun",
      department: "Organizational Development",
      position: "Volunteer",
    },
    "V-0022": {
      fullName: "May Phoo Pwint",
      department: "Water & Sanitation",
      position: "Volunteer",
    },
  };

  const [formData, setFormData] = useState(initialStaffForm);
  const [staffData, setStaffData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 5;

  // ✅ Filter staff by name or staffCode
  const filteredStaff = staffData.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.staffCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Slice filtered data for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstRow, indexOfLastRow);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "staffCode") {
      const staff = staffDirectory[value];
      if (staff) {
        setFormData({
          staffCode: value,
          fullName: staff.fullName,
          gender: "",
          position: staff.position,
          department: staff.department,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          fullName: "",
          position: "",
          department: "",
        }));
      }
    } else if (name === "fullName") {
      const entry = Object.entries(staffDirectory).find(
        ([code, data]) => data.fullName === value
      );
      if (entry) {
        const [code, data] = entry;
        setFormData({
          staffCode: code,
          fullName: value,
          gender: "",
          position: data.position,
          department: data.department,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          staffCode: "",
          position: "",
          department: "",
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchData = () => {
    axios
      .get("http://localhost:8000/staffdepartment")
      .then((res) => setStaffData(res.data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId !== null) {
      handleUpdate();
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/staffdepartment",
        formData
      );
      if (res.status === 200 || res.status === 201) {
        alert("Staff added successfully!");
        setFormData(initialStaffForm);
        fetchData();
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit");
    }
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8000/staffdepartment/${editId}`, formData)
      .then(() => {
        alert("Staff updated successfully");
        setFormData(initialStaffForm);
        setEditId(null);
        fetchData();
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Update failed");
      });
  };

  const handleEdit = (id) => {
    const staff = staffData.find((s) => s.id === id);
    if (staff) {
      setFormData({
        staffCode: staff.staffCode || "",
        fullName: staff.fullName || "",
        gender: staff.gender || "",
        position: staff.position || "",
        department: staff.department || "",
      });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      axios
        .delete(`http://localhost:8000/staffdepartment/${id}`)
        .then(() => {
          alert("Deleted successfully");
          fetchData();
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Failed to delete");
        });
    }
  };

  return (
    <div className={ProfileCss.StaffMainTbl}>
      <h1 className={ProfileCss.Heading}>💹 Add Staff Page Form</h1>

      <form onSubmit={handleSubmit} className={ProfileCss.FormContainer}>
        <label>
          Staff Code:
          <input
            type="text"
            name="staffCode"
            value={formData.staffCode}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Position:
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            readOnly={!!staffDirectory[formData.staffCode]}
          />
        </label>

        <label>
          Department:
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            readOnly={!!staffDirectory[formData.staffCode]}
          />
        </label>

        <label>
          Remark:
          <select name="remark" value={formData.remark} onChange={handleChange}>
            <option value="">Select Remark</option>
            <option>Resign</option>
          </select>
        </label>

        <button type="submit" className={ProfileCss.submitBtn}>
          {editId ? "Update" : "Submit"}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search by name or staff code"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "250px" }}
      />

      <table className={ProfileCss.StaffTable}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Staff Code</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Position</th>
            <th>Department</th>
            <th>Remark</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStaff.map((item, index) => (
            <tr key={item.id}>
              <td>{indexOfFirstRow + index + 1}</td>
              <td>{item.staffCode}</td>
              <td>{item.fullName}</td>
              <td>{item.gender}</td>
              <td>{item.position}</td>
              <td>{item.department}</td>
              <td>{item.remark}</td>
              <td>
                <button
                  onClick={() => handleEdit(item.id)}
                  className={ProfileCss.EditBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className={ProfileCss.DeletetBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>Page {currentPage}</span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(staffData.length / rowsPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage >= Math.ceil(staffData.length / rowsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AddStaff;
