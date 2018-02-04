# Bitcone Admin


Current Bitcone database layout:
```sql
CREATE TABLE public.bitcones
(
  uuid text NOT NULL,
  series integer,
  flavor text,
  owner text,
  created timestamp without time zone NOT NULL DEFAULT NOW(),
  CONSTRAINT pk PRIMARY KEY (uuid)
)
```

Future ideas: adding a column for what the bitcone was used to purchase
