with t as (select * from cdb_overalls_csv where  score::text!='')
SELECT countries.the_geom,countries.the_geom_webmercator, countries.admin as name,
countries.adm0_a3 as iso, t.score::float as score, t.type::float, t.federal as federal
FROM countries
LEFT JOIN t
on countries.adm0_a3=t.iso
