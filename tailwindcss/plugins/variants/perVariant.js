const perVariant = ({ addVariant, e }) => {
  addVariant("per", ({ container, separator }) => {
    container.walkRules((rule) => {
      const updatedSelector = rule.selector.replace(
        new RegExp(`(.*)${e(`per${separator}`)}(.*)`),
        (_, base, className) => {
          return `${base}${className}`;
        }
      );
      rule.selector = updatedSelector;

      rule.walkDecls((decl) => {
        const match = decl.value.match(
          /\[(\d+(?:\.\d+)?(?:px|rem|em)?)\/(\d+(?:\.\d+)?(?:px|rem|em)?)\]/
        );
        if (match) {
          const [_, numerator, denominator] = match;
          const numValue = parseFloat(numerator);
          const denValue = parseFloat(denominator);
          if (!isNaN(numValue) && !isNaN(denValue) && denValue !== 0) {
            const percentage = (numValue / denValue) * 100;
            decl.value = `${percentage.toFixed(2)}%`;
          }
        }
      });
    });
  });
};

export default perVariant;
