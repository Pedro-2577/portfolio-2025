// Build a starting recommendation from all answers. Never preselect paid services.
export function recommendServices({ website, marketplace, products } = {}) {
  const hasStore = website === 'yes';
  const newStore = website === 'new';
  const marketplaceRelevant = marketplace === 'already' || marketplace === 'interested';
  const productUpdatesRelevant = products === 'suppliers' || products === 'both';

  return {
    goal: newStore ? 'launch' : 'help',
    help: hasStore && marketplaceRelevant ? 'configuration' : '',
    orientation: !hasStore && !newStore,
    marketplaceRelevant,
    productUpdatesRelevant,
    reasons: [
      ({ yes: 'existingStore', new: 'newStore', 'other-channels': 'otherChannels', unsure: 'websiteUnsure' })[website],
      ({ already: 'existingMarketplace', interested: 'newMarketplace', 'not-now': 'noMarketplace', unsure: 'marketplaceUnsure' })[marketplace],
      ({ suppliers: 'suppliers', 'made-here': 'ownProducts', both: 'bothSources', unsure: 'productsUnsure' })[products],
    ].filter(Boolean),
  };
}
