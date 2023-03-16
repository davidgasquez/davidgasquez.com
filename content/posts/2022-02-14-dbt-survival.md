---
title: "Kaplan-Meier Survival Curves in dbt"
date: 2022-02-14
draft: false
url: /posts/dbt-survival
---

Inspired by [Convoys](https://better.engineering/convoys/), I've tried to model conversion rates in SQL.

The following macro computes the Kaplan-Meier survival curves and conversion rates given two timestamps and the groups. You can then generate these tables at runtime and plot them in your favorite BI tool.

```sql
{% macro conversion_rate(relation, id, created, converted, groups, time_unit="minute") %}


	with durations as (
	    select
	        *
	        , timestamp_diff(coalesce({{ converted }}, current_timestamp()), {{ created }}, {{ time_unit }}) as duration
	    from {{ relation }}
	),


	total_subjects as (
	    select
	        {{ groups }} as g
	        , count(distinct {{ id }}) as num_subjects
	    from durations
	    group by 1
	),


	daily_conversions as (
	    select
	        duration
	        , {{ groups }} as g
	        , count(distinct {{ id }}) as total
	        , sum(if( {{ converted }} is null, 0, 1)) as conversions
	    from durations
	    group by 1, 2
	    order by 1 asc
	),


	cumulative_conversions as (
	    select
	        duration,
	        daily_conversions.g,
	        total,
	        conversions,
	        total_subjects.num_subjects - coalesce(sum(total) over (partition by daily_conversions.g order by duration asc rows between unbounded preceding and 1 preceding), 0) as at_risk
	    from daily_conversions
	    left join total_subjects on daily_conversions.g = total_subjects.g
	),


	final as (
	    select
	        duration,
	        g,
	        at_risk,
	        total,
	        conversions,
	        at_risk - conversions - coalesce(lead(at_risk, 1) over (partition by g order by duration asc), 0) as censored,
	        exp(sum(ln(1 - conversions / at_risk)) over (partition by g order by duration asc rows between unbounded preceding and current row)) as survival_proba,
	        100 * (1 - exp(sum(ln(1 - conversions / at_risk)) over (partition by g order by duration asc rows between unbounded preceding and current row))) as conversion_pct,
	        sum(conversions / at_risk) over (partition by g order by duration asc rows between unbounded preceding and current row) as cumulative_hazard
	    from cumulative_conversions
	    where conversions > 0 and duration < 60 * 2
	)


	select * from final


	{% endmacro %}
```

The usage then is as simple as:

```sql
with dataset as (
    select
        id
        , trial_started_at as created_at
        , converted_at
        , plan as g
    from {{ ref('trials') }}
)

select * from ({{ conversion_rate(relation="dataset", id="id", created="created_at", converted="converted_at", groups="g", time_unit="minute")}})
```

I'm sure this can be improved and simplified. For now, is good enough and it works! If you're looking for an alternative in Looker, the folks at Montreal Analytitcs have you covered: [How to Leverage Product Survival Curves in Looker](https://blog.montrealanalytics.com/how-to-leverage-product-survival-curves-in-looker-9a31663d4ae6).
