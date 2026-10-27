# Costs

Car Insights shows what each charge and each trip costs, and the month and year totals. You set the prices in **Car Insights > Settings** (administrators only). The **Set your electricity prices** step of the Getting started card jumps to them.

## Prices

Under **Prices**, set a **Default AC price** and a **Default DC price**:

- **€/kWh**: the price of one kWh.
- **Start fee**: a fixed amount per charge, if any.
- **€/min**: a price per minute, if any (some public chargers).
- **Valid from**: a new price counts from this date. Older charges keep the old price.

A charge with an average power above 22 kW counts as DC, anything else as AC. Charging losses between the grid and the battery are added (1 % for AC, 5 % for DC), because the car reports the energy that reached the battery.

## Charge locations

Charges at one place can have their own price, for example your own charger. Open a charge and save its location. Under **Prices > Charge locations** you can then rename it, change its price, or delete it (its charges go back to the default price).

## A receipt beats a price

Open a charge and enter **Total paid (€)** to use the real amount. Clear it to go back to the calculated cost.

## Card markup

Under **Cars**, each car has **Card markup %** and **Card start fee**, for a charge card that adds a percentage or a fee on top of the price.

## Fixed costs

Under **Fixed costs**, add costs per month, quarter or year, or a one-off (**once**), such as insurance or road tax. Give each a name, an amount, a period and a start date, and an end date if it stops. Empty the end date to run a cost on.

## How a trip is priced

A trip costs the energy it used, at the average price of your recent charges (or the AC default if there are none), plus its share of the fixed costs. The share is worked out over the last 365 days, and only once the car has driven at least 100 km in that span.

## Cost groups

A cost group adds up the costs of several cars. See [Sharing](sharing.md#groups).
