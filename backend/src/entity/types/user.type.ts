export type UserSecurityType = {
  login_attempts: number | null;
  login_time: Date | null;
  is_block: boolean;
  device_try?: string;
};
