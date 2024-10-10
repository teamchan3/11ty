import { DESIGN_WIDTH } from "../../config/constants";

const vwVariant = ({ addVariant }) => {
  addVariant("vw", ({ container }) => {
    container.walkRules((rule) => {
      rule.walkDecls((decl) => {
        const value = parseFloat(decl.value);
        if (!isNaN(value)) {
          const vwValue = (value / DESIGN_WIDTH) * 100;
          decl.value = `${vwValue.toFixed(4)}vw`;
        }
      });
    });
  });
};

export default vwVariant;
