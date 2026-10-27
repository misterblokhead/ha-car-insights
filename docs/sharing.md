# Sharing

Car Insights follows Home Assistant's users.

## Administrators

Home Assistant administrators see every car. Only they can add or remove cars, change prices and fixed costs, edit groups and viewers, and see the Getting started card.

## Other users

Other users see only the cars an administrator gave them. Activity, Statistics and the car picker are limited to those cars.

A user appears in **Settings > Cars** after they open the Car Insights page once. Then, under each car's **Viewers**, tick the users who may see it. A user with no cars sees an empty Activity.

## Groups

A **cost group** adds up the costs of several cars, for example two cars of one household. Create the group under **Settings > Cost groups**, then pick it for each car under **Settings > Cars**. Statistics then show the group's totals, and Home Assistant gets month and year sensors for the group (see [Sensors and dashboard](sensors-and-dashboard.md)).

A non-admin sees a group only if they may see **every** car in it, so a group never reveals the total of a car they cannot see.
