// Suggest editable service selections from the visitor's answers.
export function recommendServices({ website, marketplace, products } = {}) {
  const launch = website === 'new';
  const selected = [
    ...(launch ? ['design', 'catalog', 'payments', 'shipping', 'training'] : []),
    ...(['already', 'interested'].includes(marketplace) ? ['ml'] : []),
    ...(['suppliers', 'both'].includes(products) ? ['auto-prices', 'auto-stock'] : []),
  ];
  const openGroups = [
    ...(['already', 'interested'].includes(marketplace) ? ['configuration'] : []),
    ...(['suppliers', 'both'].includes(products) ? ['automation'] : []),
  ];
  return {
    goal: 'custom',
    selected,
    openGroups,
    expandLaunch: launch,
  };
}
