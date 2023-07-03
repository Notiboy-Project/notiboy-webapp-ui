export interface PlanConfigDto {
  key: 'free' | 'silver' | 'gold';
  price: number;
  features: {
    channels: number;
    notification_days_retentions: number;
    notification_per_month: number;
    notification_characters: number;
    analytics: boolean;
  };
}

export const updateConfigsWithServer = (data?: any): PlanConfigDto[] => {
  if (!data) return PLAN_CONFIG;

  console.log(`plans data`, data);

  return [
    {
      key: 'free',
      price: data?.charge?.free,
      features: {
        channels: data?.channel_count?.free || 1,
        notification_days_retentions: data?.notification_retention?.free || 7,
        notification_per_month: data?.notification_count?.free || 1000,
        notification_characters: data?.notification_char_count?.free || 120,
        analytics: data?.optin_optout_analytics?.free || true
      }
    },
    {
      key: 'silver',
      price: data?.charge.silver || 9,
      features: {
        channels: data?.channel_count?.silver || 3,
        notification_days_retentions:
          data?.notification_retention?.silver || 15,
        notification_per_month: data?.notification_count?.silver || 30000,
        notification_characters: data?.notification_char_count?.silver || 200,
        analytics: data?.optin_optout_analytics?.silver || true
      }
    },
    {
      key: 'gold',
      price: data?.charge.gold || 29,
      features: {
        channels: data?.channel_count?.gold || 10,
        notification_days_retentions: data?.notification_retention?.gold || 30,
        notification_per_month: data?.notification_count?.gold || 100000,
        notification_characters: data?.notification_char_count?.gold || 500,
        analytics: data?.optin_optout_analytics?.gold || true
      }
    }
  ];
};

export const getPlanByKey = (key: string) =>
  PLAN_CONFIG.find((plan) => plan.key === key) || null;

export const PLAN_CONFIG: PlanConfigDto[] = [
  {
    key: 'free',
    price: 0,
    features: {
      channels: 1,
      notification_days_retentions: 7,
      notification_per_month: 1000,
      notification_characters: 120,
      analytics: true
    }
  },
  {
    key: 'silver',
    price: 9,
    features: {
      channels: 3,
      notification_days_retentions: 15,
      notification_per_month: 30000,
      notification_characters: 200,
      analytics: true
    }
  },
  {
    key: 'gold',
    price: 29,
    features: {
      channels: 10,
      notification_days_retentions: 30,
      notification_per_month: 100000,
      notification_characters: 500,
      analytics: true
    }
  }
];
