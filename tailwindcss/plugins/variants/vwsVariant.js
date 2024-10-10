import { DESIGN_WIDTH_SP } from "../../config/constants";

const vwsVariant = ({ addVariant }) => {
  addVariant("vws", ({ container }) => {
    container.walkRules((rule) => {
      rule.walkDecls((decl) => {
        const value = parseFloat(decl.value);
        if (!isNaN(value)) {
          const vwValue = (value / DESIGN_WIDTH_SP) * 100;
          decl.value = `${vwValue.toFixed(4)}vw`;
        }
      });
    });
  });
};

export default vwsVariant;
