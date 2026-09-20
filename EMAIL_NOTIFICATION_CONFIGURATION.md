# SND Brightlife — Automatic Notification Recipients

Notification recipients are no longer configured with `NOTIFICATION_BCC_EMAILS`.

## How recipients are selected

The backend reads active member profiles from the Supabase `members` table and uses:

- `members.email` — the recipient email address
- `members.is_active = true` — only active accounts receive operational notifications
- `members.role` + `members.permissions` — determines which notification categories they receive

The backend applies the existing `ROLE_PERMISSIONS` rules through `effectivePermissions_()`, so `super_admin` receives all operational categories automatically, while administrators receive only the rights assigned to their profile.

## Notification routing

| Notification | Required assigned right | Recipient |
|---|---|---|
| New registration | `registration_approval` | Active profiles with that right |
| Account activation member copy | `registration_approval` | Member's registered email + responsible profiles BCC |
| Savings approved member copy | `savings_approval` | Member's registered email + responsible profiles BCC |
| Withdrawal request | `withdrawal_approval` | Active profiles with that right |
| Loan overdue management alert | `loan_approval` | Active profiles with that right |
| Loan overdue member copy | `loan_approval` | Member's registered email + responsible profiles BCC |
| Pending approvals | Matching approval rights for the pending categories | Active profiles with any matching right |
| Daily/weekly/monthly summaries | `view_reports` | Active profiles with that right |
| Password-reset OTP | No management right | Member's registered profile email only |

## Result

When a Super Admin assigns or removes a right from a member profile, the notification recipient list changes automatically. No Vercel environment-variable edit is required.

`RESEND_REPLY_TO_EMAIL` remains optional and can stay blank.
