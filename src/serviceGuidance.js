// Suggest editable service selections from the visitor's answers.
export function recommendServices({ website, marketplace, products } = {}) {
  const launch = website === 'new';
  const hasOtherStore = website === 'other-platform';
  // Moving an existing shop still needs VendoAlgo setup. Migration replaces
  // the standard initial product upload for the same catalog.
  const selected = [
    ...(launch ? ['design', 'catalog', 'payments', 'shipping', 'training'] : []),
    ...(hasOtherStore ? ['design', 'payments', 'shipping', 'training', 'migration'] : []),
    ...(['already', 'interested'].includes(marketplace) ? ['ml'] : []),
    ...(['suppliers', 'both'].includes(products) ? ['auto-prices', 'auto-stock'] : []),
  ];
  const openGroups = [
    ...(hasOtherStore ? ['catalogue'] : []),
    ...(['already', 'interested'].includes(marketplace) ? ['configuration'] : []),
    ...(['suppliers', 'both'].includes(products) ? ['automation'] : []),
  ];
  return {
    goal: 'custom',
    selected,
    openGroups,
    expandLaunch: launch || hasOtherStore,
  };
}
