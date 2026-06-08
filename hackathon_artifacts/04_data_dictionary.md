# Juniper Loop Data Dictionary

All data is synthetic and fictional. Teams should treat the files as a shared sandbox for prototyping, analysis, and demo storytelling. The data intentionally avoids diagnoses, biometrics, clinical history, prescriptions, insurance details, and medical claims.

## `member_profile.csv`

- `member_id`: unique synthetic member ID.
- `first_name`: synthetic first name for demo personalization.
- `region`: broad geographic region.
- `membership_status`: Trial, Active, Paused, Canceled, or Prospect.
- `lifecycle_stage`: Prospect, New, Building, Established, Slipping, or Dormant.
- `plan_type`: Free, Monthly, Annual, or Shop Only.
- `join_date`: synthetic join date or prospect creation date.
- `days_since_join`: days from the scenario anchor date.
- `primary_habit_interest`: everyday wellness interest such as Move, Mindful, Nourish, Rest, Organize, or Connect.
- `secondary_habit_interest`: secondary non-sensitive interest.
- `preferred_content_format`: Article, Audio, Video, Checklist, Live Session, or Community Prompt.
- `preferred_channel`: Email, SMS, App Push, In App, or Web.
- `monthly_content_views`: content views in the last 30 days.
- `routine_starts_90d`: routine starts in the last 90 days.
- `routine_completions_90d`: routine completions in the last 90 days.
- `community_actions_90d`: non-sensitive community actions in the last 90 days.
- `shop_orders_12m`: commerce orders in the last 12 months.
- `average_order_value`: average order value in USD.
- `relationship_signal`: 0 to 100 synthetic indicator of current usefulness/engagement.

## `preferences_consent.csv`

- `member_id`: join key to `member_profile`.
- `email_permission`, `sms_permission`, `app_push_permission`: consent flags.
- `quiet_hours_preference`: broad timing preference.
- `message_tone_preference`: Coach, Calm, Practical, or Social.
- `reminder_frequency_preference`: Low, Medium, or High.
- `commerce_interest_level`: Low, Medium, or High.
- `community_interest_level`: Low, Medium, or High.

## `membership_events.csv`

- `event_id`: unique synthetic event ID.
- `member_id`: join key to `member_profile`.
- `event_date`: event date.
- `event_type`: Trial Started, Plan Started, Plan Renewed, Plan Paused, Plan Canceled, Routine Started, Routine Completed, Preference Updated, or Community Joined.
- `source`: App, Web, Email, SMS, App Push, or Support.
- `related_habit_interest`: non-sensitive habit interest when relevant.

## `content_interactions.csv`

- `interaction_id`: unique synthetic interaction ID.
- `member_id`: join key to `member_profile`.
- `content_id`: join key to `content_catalog`.
- `interaction_date`: interaction date.
- `interaction_type`: View, Save, Complete, Share, Dismiss, or Search.
- `session_context`: Morning, Midday, Evening, Weekend, or Unknown.
- `engagement_depth`: 1 to 5 synthetic depth indicator.

## `commerce_events.csv`

- `commerce_event_id`: unique synthetic commerce event ID.
- `member_id`: join key to `member_profile`.
- `event_date`: event date.
- `event_type`: Product View, Add To Cart, Purchase, Return, or Bundle Viewed.
- `product_id`: join key to `product_catalog`.
- `net_revenue`: revenue for purchase events.
- `routine_context`: non-sensitive habit context for the product event.

## `campaign_interactions.csv`

- `campaign_event_id`: unique synthetic campaign event ID.
- `member_id`: join key to `member_profile`.
- `campaign_id`: campaign identifier.
- `event_date`: event date.
- `channel`: Email, SMS, App Push, In App, or Web.
- `event_type`: Sent, Open, Click, Dismiss, Unsubscribe, Preference Updated, or Conversion.
- `journey_stage`: Onboarding, Building, Reconnect, Commerce, Community, or Education.

## `content_catalog.csv`

- `content_id`: content identifier.
- `title`: fictional content title.
- `format`: Article, Audio, Video, Checklist, Live Session, or Community Prompt.
- `habit_interest`: Move, Mindful, Nourish, Rest, Organize, or Connect.
- `estimated_minutes`: expected time commitment.
- `tone`: Calm, Practical, Social, or Guided.
- `lifecycle_fit`: suggested lifecycle fit.

## `product_catalog.csv`

- `product_id`: product identifier.
- `product_name`: fictional product or bundle name.
- `product_type`: Journal, Kit, Accessory, Digital, or Bundle.
- `routine_context`: everyday routine context.
- `price`: synthetic price in USD.
- `commerce_role`: Starter, Support, Deepen, Gift, or Replenish.
