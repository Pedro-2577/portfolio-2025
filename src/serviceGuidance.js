// Recommend only a starting point. Never select paid services automatically.
export function recommendServices({ website, products } = {}) {
  const newStore = website === 'new';
  return {
    goal: newStore ? 'launch' : 'help',
    orientation: website !== 'yes' && !newStore,
    productUpdatesRelevant: products === 'suppliers' || products === 'both',
  };
}
