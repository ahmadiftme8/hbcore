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
    events: string;
    blog: string;
    support: string;
    about: string;
    contact: string;
  };
  common: {
    login: string;
    auth: string;
    user: string;
  };
  auth: {
    signIn: string;
    signInDescription: string;
    signingIn: string;
    signInWithGoogle: string;
    signOut: string;
    or: string;
    sendCode: string;
    sending: string;
    enterOtpCode: string;
    verify: string;
    verifying: string;
    back: string;
    turnstileSiteKeyNotConfigured: string;
    errors: {
      invalidPhone: string;
      completeSecurityVerification: string;
      invalidOtpCode: string;
      invalidCode: string;
      failedToSendOtp: string;
      turnstileVerificationFailed: string;
      failedToLoadSecurity: string;
      signInFailed: string;
      unauthorizedDomain: string;
      operationNotAllowed: string;
      popupBlocked: string;
      networkError: string;
      configurationNotFound: string;
      internalError: string;
    };
  };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
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
    feature4: {
      title: string;
      description: string;
    };
    feature5: {
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
      bullet4: string;
    };
    benefit4: {
      headline: string;
      paragraph: string;
      bullet1: string;
      bullet2: string;
      bullet3: string;
      bullet4: string;
    };
    benefit5: {
      headline: string;
      paragraph: string;
      bullet1: string;
      bullet2: string;
      bullet3: string;
      bullet4: string;
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
  about: {
    title: string;
    description: string;
    team: {
      title: string;
      subtitle: string;
      members: {
        amirhosseinMoshki: {
          name: string;
          role: string;
          education: string;
          bio: string;
        };
        alirezaJafartash: {
          name: string;
          role: string;
          education: string;
          bio: string;
        };
        hadiEsfandiarpour: {
          name: string;
          role: string;
          education: string;
          bio: string;
        };
        melikaEslami: {
          name: string;
          role: string;
          education: string;
          bio: string;
        };
      };
    };
  };
  footer: {
    brand: {
      name: string;
      tagline: string;
    };
    sections: {
      product: string;
      company: string;
      resources: string;
      social: string;
    };
    product: {
      home: string;
      features: string;
      benefits: string;
      socialProof: string;
    };
    company: {
      about: string;
      blog: string;
      careers: string;
      contact: string;
    };
    resources: {
      docs: string;
      support: string;
      faq: string;
      changelog: string;
    };
    social: {
      twitter: string;
      linkedin: string;
      instagram: string;
      telegram: string;
    };
    copyright: string;
    legal: {
      privacy: string;
      terms: string;
      cookies: string;
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
