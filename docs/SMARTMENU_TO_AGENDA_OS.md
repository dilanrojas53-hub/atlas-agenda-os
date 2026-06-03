# SmartMenu to Agenda OS

Agenda OS reuses the SaaS structure of SmartMenu without modifying SmartMenu.

## Core structures

SmartMenu had:

- public customer view
- tenant admin panel
- superadmin panel
- tenant creation
- customer profile
- order status
- menu catalog
- promotions, coupons, rewards and automations
- plan capability matrix
- payments with SINPE receipt review
- landing page per tenant
- staff and operations routes

Agenda OS converts them into vertical modules.

## Mapping

- tenants -> businesses
- menu_items -> catalog_items
- orders -> transactions
- order_items -> transaction_items
- customer_profiles -> client_profiles
- tenant_customer_stats -> tenant_client_stats
- promotions -> promotions
- coupons -> coupons
- loyalty_rewards -> loyalty_rewards
- automation_rules -> automation_rules
- order_status -> booking, payment or membership status
- kitchen display -> operations board
- staff dashboard -> staff portal
- restaurant landing -> business landing

## Vertical behavior

Appointments vertical:

- appointments
- professionals
- services
- deposits
- reminders
- client history

Membership vertical:

- memberships
- SINPE receipts
- products
- events
- attendance
- progress tracking

Clinic vertical:

- appointments
- professionals
- records
- documents
- consent forms
- follow ups

Academy vertical:

- memberships
- attendance
- events
- progress
- evaluations

## Product rule

Do not mix verticals in one tenant UI. Each slug must load its business, vertical and enabled modules.

## Customer rule

Client identity is global. Tenant stats are isolated per business. A client can have appointments in one tenant and memberships in another tenant from the same account.
