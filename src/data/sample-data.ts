import type { System } from '../types'

const RAW_SYSTEMS: readonly System[] = [
  {
    fides_key: 'store_app',
    name: 'Example.com Online Storefront',
    description:
      'Storefront application to search for products, browse sales and promotions, review product information, etc.',
    system_type: 'Application',
    privacy_declarations: [
      {
        name: 'Online Advertising',
        data_categories: [
          'user.derived.identifiable.device.cookie_id',
          'user.derived.identifiable.device.ip_address',
          'user.derived.identifiable.location',
        ],
        data_subjects: ['customer'],
        data_use: 'advertising.third_party',
      },
      {
        name: 'Email Marketing',
        data_categories: ['user.provided.identifiable.contact.email'],
        data_subjects: ['customer'],
        data_use: 'advertising.first_party',
      },
      {
        name: 'Product Analytics',
        data_categories: ['user.derived.identifiable.device.cookie_id'],
        data_subjects: ['customer'],
        data_use: 'improve.system',
      },
    ],
    system_dependencies: [
      'app_database',
      'search_database',
      'advertising_integration',
      'email_integration',
      'analytics_integration',
    ],
  },
  {
    fides_key: 'checkout_app',
    name: 'Example.com Checkout',
    description: 'Checkout application to collect payment details and submit orders for processing',
    system_type: 'Application',
    privacy_declarations: [
      {
        name: 'eCommerce',
        data_categories: [
          'user.derived.identifiable.device.cookie_id',
          'user.provided.identifiable.contact.email',
          'user.provided.identifiable.financial',
        ],
        data_subjects: ['customer'],
        data_use: 'provide.system',
      },
      {
        name: 'Online Advertising',
        data_categories: [
          'user.derived.identifiable.device.cookie_id',
          'user.derived.identifiable.device.ip_address',
          'user.derived.identifiable.location',
        ],
        data_subjects: ['customer'],
        data_use: 'advertising.third_party',
      },
      {
        name: 'Product Analytics',
        data_categories: ['user.derived.identifiable.device.cookie_id'],
        data_subjects: ['customer'],
        data_use: 'improve.system',
      },
    ],
    system_dependencies: [
      'app_database',
      'orders_service',
      'advertising_integration',
      'analytics_integration',
      'payments_integration',
    ],
  },
  {
    fides_key: 'orders_service',
    name: 'Orders Management',
    description: 'Backend service to process new customer orders, manage inventory, etc.',
    system_type: 'Service',
    privacy_declarations: [
      {
        name: 'eCommerce',
        data_categories: [
          'user.derived.identifiable.device.cookie_id',
          'user.provided.identifiable.contact.email',
          'user.provided.identifiable.financial',
        ],
        data_subjects: ['customer'],
        data_use: 'provide.system',
      },
      {
        name: 'Product Analytics',
        data_categories: ['user.derived.identifiable.device.cookie_id'],
        data_subjects: ['customer'],
        data_use: 'improve.system',
      },
    ],
    system_dependencies: ['app_database', 'analytics_integration', 'payments_integration'],
  },
  {
    fides_key: 'orders_service',
    name: 'Orders Management',
    description: 'Backend service to process new customer orders, manage inventory, etc.',
    system_type: 'Service',
    privacy_declarations: [
      {
        name: 'eCommerce',
        data_categories: [
          'user.derived.identifiable.device.cookie_id',
          'user.provided.identifiable.contact.email',
          'user.provided.identifiable.financial',
        ],
        data_subjects: ['customer'],
        data_use: 'provide.system',
      },
      {
        name: 'Product Analytics',
        data_categories: ['user.derived.identifiable.device.cookie_id'],
        data_subjects: ['customer'],
        data_use: 'improve.system',
      },
    ],
    system_dependencies: ['app_database', 'analytics_integration', 'payments_integration'],
  },
  {
    fides_key: 'app_database',
    name: 'Example.com Database',
    description: 'Primary database used to manage account, orders, product, payment data, etc.',
    system_type: 'Database',
    privacy_declarations: [
      {
        name: 'eCommerce',
        data_categories: [
          'user.derived.identifiable.device.cookie_id',
          'user.provided.identifiable.contact.email',
          'user.provided.identifiable.financial',
        ],
        data_subjects: ['customer'],
        data_use: 'provide.system',
      },
    ],
    system_dependencies: [],
  },
  {
    fides_key: 'search_database',
    name: 'Example.com Search Engine',
    description: 'Search engine used to index product data and provide search results and product recommendations',
    system_type: 'Database',
    privacy_declarations: [],
    system_dependencies: [],
  },
  {
    fides_key: 'payments_integration',
    name: 'Stripe',
    description: 'Payments processing integration for eCommerce orders',
    system_type: 'Integration',
    privacy_declarations: [
      {
        name: 'eCommerce',
        data_categories: [
          'user.derived.identifiable.device.cookie_id',
          'user.provided.identifiable.contact.email',
          'user.provided.identifiable.financial',
        ],
        data_subjects: ['customer'],
        data_use: 'provide.system',
      },
    ],
    system_dependencies: [],
  },
  {
    fides_key: 'email_integration',
    name: 'Mailchimp',
    description: 'Email marketing integration to send emails, manage subscriber lists, etc.',
    system_type: 'Integration',
    privacy_declarations: [
      {
        name: 'Email Marketing',
        data_categories: ['user.provided.identifiable.contact.email'],
        data_subjects: ['customer'],
        data_use: 'advertising.first_party',
      },
    ],
    system_dependencies: [],
  },
  {
    fides_key: 'advertising_integration',
    name: 'Google Ads',
    description: 'Advertising integration to collect audience data and display ads and retargeting campaigns to users',
    system_type: 'Integration',
    privacy_declarations: [
      {
        name: 'Online Advertising',
        data_categories: [
          'user.derived.identifiable.device.cookie_id',
          'user.derived.identifiable.device.ip_address',
          'user.derived.identifiable.location',
        ],
        data_subjects: ['customer'],
        data_use: 'advertising.third_party',
      },
    ],
    system_dependencies: [],
  },
  {
    fides_key: 'analytics_integration',
    name: 'Google Analytics',
    description: 'Analytics integration to track website usage, conversion funnels, etc.',
    system_type: 'Integration',
    privacy_declarations: [
      {
        name: 'Product Analytics',
        data_categories: ['user.derived.identifiable.device.cookie_id'],
        data_subjects: ['customer'],
        data_use: 'improve.system',
      },
    ],
    system_dependencies: [],
  },
  {
    fides_key: 'privacy_app',
    name: 'Ethyca',
    description:
      'Privacy platform to automate the collection and processing of data subject requests for GDPR, CCPA, etc.',
    system_type: 'Application',
    privacy_declarations: [
      {
        name: 'Privacy Requests',
        data_categories: [
          'user.derived.identifiable.device.cookie_id',
          'user.provided.identifiable.contact.email',
          'user.derived.identifiable.device.ip_address',
          'user.derived.identifiable.location',
        ],
        data_subjects: ['customer'],
        data_use: 'provide.system.operations.support',
      },
    ],
    system_dependencies: [
      'app_database',
      'search_database',
      'payments_integration',
      'email_integration',
      'advertising_integration',
      'analytics_integration',
    ],
  },
] as const

/** Deduplicated by fides_key, the sample data has a duplicate orders_service */
export const SYSTEMS: readonly System[] = [...new Map(RAW_SYSTEMS.map((s) => [s.fides_key, s])).values()]

/**
 * Data-driven data_use → declaration name mapping.
 * First occurrence wins. Derived statically from SYSTEMS.
 */
export const DATA_USE_LABELS: ReadonlyMap<string, string> = new Map(
  SYSTEMS.flatMap((s) => s.privacy_declarations).reduce<[string, string][]>((acc, d) => {
    if (!acc.some(([key]) => key === d.data_use)) {
      acc.push([d.data_use, d.name])
    }
    return acc
  }, []),
)

/** Quick lookup by fides_key */
export const SYSTEM_BY_KEY: ReadonlyMap<string, System> = new Map(SYSTEMS.map((s) => [s.fides_key, s]))
