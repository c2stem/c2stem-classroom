import axiosInstance from "./Axios";

function sanitizeHourlyData(hourlyData) {
  return Object.values(hourlyData || {}).map((row) => ({
    hour: row["test"] ?? row["hour"],
    totalRainfall: row["Total Rainfall (in)"] ?? row["totalRainfall"],
    totalAbsorption: row["Total Absorption (in)"] ?? row["totalAbsorption"],
    totalRunoff: row["Total Runoff (in)"] ?? row["totalRunoff"],
  }));
}

function sanitizeExperimentHistory(history) {
  return (history || []).map((test) => ({
    testNumber: test.testNumber,
    time: test.time,
    material: test.material,
    rainfallRate: test.rainfallRate,
    rainfallDuration: test.rainfallDuration,
    hourlyData: sanitizeHourlyData(test.hourlyData),
  }));
}

function sanitizeFindings(findings) {
  if (!findings) return findings;
  const result = {};
  Object.entries(findings).forEach(([key, val]) => {
    if (!val) { result[key] = val; return; }
    const tests = Object.values(val.tests || {}).map((t) => ({
      testNo: t["Test No."] ?? t["testNo"],
      time: t["Time"] ?? t["time"],
      material: t["Material"] ?? t["material"],
      rainfallRate: t["Rainfall Rate"] ?? t["rainfallRate"],
      rainfallDuration: t["Rainfall Duration"] ?? t["rainfallDuration"],
    }));
    result[key] = { hypothesis: val.hypothesis, finding: val.finding, tests };
  });
  return result;
}

export default {
  async saveUserState(user, state) {
    const checkList = state.checkedStatus;
    const favList = state.favoriteStatus;
    const dhSummary = state.designHistorySummary;
    const dhSummaryLength = state.designHistorySummaryLength;
    const hypotheses = state.hypotheses;
    const findings = sanitizeFindings(state.findings);
    const conclusions = state.conclusions;
    const inquiryExperimentHistory = sanitizeExperimentHistory(state.inquiryExperimentHistory);
    let response = await axiosInstance.post("state/setState", {
      username: user,
      checkList: checkList,
      favList: favList,
      designHistorySummary: dhSummary,
      designHistorySummaryLength: dhSummaryLength,
      hypotheses,
      findings,
      conclusions,
      inquiryExperimentHistory,
    });
    if (response) {
      console.log("successfully saved state: ", response);
    }
  },

  async gerUserState(user) {
    let response = await axiosInstance.get("state/getState/" + user, {
      withCredentials: true,
    });
    if (response) {
      return response.data;
    } else {
      return [];
    }
  },
};
