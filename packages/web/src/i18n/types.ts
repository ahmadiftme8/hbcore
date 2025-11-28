export interface TranslationSchema {
  metadata: {
    title: string;
    description: string;
  };
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
  featuresAndBenefits: {
    features: {
      feature1: {
        title: string;
        description: string;
      };
      feature2: {
        title: string;
        description: string;
      };
      feature3: {
        title: string;
        description: string;
      };
    };
    benefits: {
      benefit1: {
        headline: string;
        paragraph: string;
        bullet1: string;
        bullet2: string;
        bullet3: string;
        bullet4: string;
      };
      benefit2: {
        headline: string;
        paragraph: string;
        bullet1: string;
        bullet2: string;
        bullet3: string;
        bullet4: string;
      };
      benefit3: {
        headline: string;
        paragraph: string;
        bullet1: string;
        bullet2: string;
        bullet3: string;
      };
      benefit4: {
        headline: string;
        paragraph: string;
        bullet1: string;
        bullet2: string;
        bullet3: string;
        bullet4: string;
      };
    };
  };
  socialProof: {
    testimonials: {
      testimonial1: {
        name: string;
        role: string;
        review: string;
      };
    };
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

/**
 * Utility type to convert TranslationSchema into a nested object structure
 * where each leaf property returns a string
 */
export type TranslationObject<T extends object> = {
  [K in keyof T]: T[K] extends object ? TranslationObject<T[K]> : T[K];
};

export type Translations = TranslationObject<TranslationSchema>;
