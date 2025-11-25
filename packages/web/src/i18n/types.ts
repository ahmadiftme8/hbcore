export interface TranslationSchema {
  navigation: {
    home: string;
    features: string;
    benefits: string;
    proof: string;
    objections: string;
    cta: string;
  };
  common: {
    login: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}

/**
 * Utility type to generate all possible translation keys from the schema
 * Converts nested object structure to dot-notation keys
 */
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationSchema>;
