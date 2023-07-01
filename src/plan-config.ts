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

export const getPlanByKey = (key: string) => PLAN_CONFIG.find(plan => plan.key === key) || null;

export const PLAN_CONFIG: PlanConfigDto[] = [
  {
    key: 'free',
    price: 0,
    features: {
      channels: 1,
      notification_days_retentions: 7,
      notification_per_month: 1000,
      notification_characters: 120,
      analytics: false
    }
  },
  {
    key: 'silver',
    price: 9,
    features: {
      channels: 1,
      notification_days_retentions: 7,
      notification_per_month: 1000,
      notification_characters: 200,
      analytics: true
    }
  },
  {
    key: 'gold',
    price: 29,
    features: {
      channels: 10,
      notification_days_retentions: 60,
      notification_per_month: 100000,
      notification_characters: 500,
      analytics: true
    }
  }
];
