// Suggest a starting point from context; paid extras remain the visitor's choice.
export function recommendServices({ website, marketplace, products } = {}) {
  const hasStore = website === 'yes';
  const newStore = website === 'new' || website === 'other-channels';
  const marketplaceRelevant = marketplace === 'already' || marketplace === 'interested';
  return {
    goal: newStore ? 'launch' : 'help',
    help: hasStore && marketplaceRelevant ? 'configuration' : '',
    orientation: !hasStore && !newStore,
    marketplaceRelevant,
    supplierUpdates: products === 'suppliers' || products === 'both',
    reasons: [
      newStore ? 'newStore' : hasStore ? 'existingStore' : 'orientation',
      ...(marketplaceRelevant ? [marketplace === 'already' ? 'existingMarketplace' : 'newMarketplace'] : []),
      ...(['suppliers', 'both'].includes(products) ? ['suppliers'] : products === 'made-here' ? ['ownProducts'] : []),
    ],
  };
}
