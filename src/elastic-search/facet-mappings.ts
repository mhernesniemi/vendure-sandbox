// Helper function that generates facet mappings
export function generateFacetMappings(
  indexedFacets: string[],
  forProductVariant = false
) {
  const mappings: Record<string, any> = {};

  indexedFacets.forEach((facetCode) => {
    mappings[facetCode] = {
      graphQlType: "[String!]",
      valueFn: forProductVariant
        ? (variant: any, languageCode: string, injector: any, ctx: any) => {
            const facetValues = variant.facetValues || [];
            const values: string[] = [];

            facetValues.forEach((fv: any) => {
              if (fv.facet?.code === facetCode) {
                const value =
                  fv.code || fv.name || (fv.id ? String(fv.id) : undefined);
                if (value) {
                  values.push(value);
                }
              }
            });

            return values;
          }
        : (
            product: any,
            variants: any,
            languageCode: string,
            injector: any,
            ctx: any
          ) => {
            const facetValues = product.facetValues || [];
            const values: string[] = [];

            facetValues.forEach((fv: any) => {
              if (fv.facet?.code === facetCode) {
                const value =
                  fv.code || fv.name || (fv.id ? String(fv.id) : undefined);
                if (value) {
                  values.push(value);
                }
              }
            });

            return values;
          },
    };
  });

  return mappings;
}
