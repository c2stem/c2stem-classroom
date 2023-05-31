export default {
  routeByClassOnLogin(data) {
    if (data.class.includes("CMISE")) {
      // this.$router.push({ name: "Landing" });
      return this.filterByGroupOnLogin(data.group);
    } else if (data.class.includes("SPICE")) {
      return "Home";
    }
  },

  filterByGroupOnLogin(userGroup) {
    if (userGroup.includes("IE")) {
      return "IELanding";
    } else if (userGroup.includes("EE")) {
      return "EELanding";
    } else if (userGroup.includes("Construct")) {
      return "Construct";
    }
  },
};
