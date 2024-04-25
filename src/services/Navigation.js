export default {
  routeByClassOnLogin(data) {
    if (data.class.includes("CMISE")) {
      if (data.group && !data.role.includes("admin")) {
        return this.filterByGroupOnLogin(data.group);
      } else {
        return "Landing";
      }
    } else if (data.class.includes("SPICE")) {
      return "SpiceLanding";
    }
  },

  filterByGroupOnLogin(userGroup) {
    if (userGroup.includes("IE")) {
      return "IELanding";
    } else if (userGroup.includes("EE")) {
      return "EELanding";
    } else if (userGroup.includes("Construct")) {
      return "ConstructLanding";
    } else {
      return "Landing";
    }
  },
};
