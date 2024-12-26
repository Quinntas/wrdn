import {COLUMN_TYPES} from "@/app/debug/column-types";

export const PG_TYPES: {
    value: keyof typeof COLUMN_TYPES
    label: string
}[] = [
    {value: "bigint", label: "bigint"},
    {value: "bigserial", label: "bigserial"},
    {value: "bit", label: "bit"},
    {value: "bit varying", label: "bit varying"},
    {value: "boolean", label: "boolean"},
    {value: "box", label: "box"},
    {value: "bytea", label: "bytea"},
    {value: "character", label: "character"},
    {value: "character varying", label: "character varying"},
    {value: "cidr", label: "cidr"},
    {value: "circle", label: "circle"},
    {value: "date", label: "date"},
    {value: "double precision", label: "double precision"},
    {value: "inet", label: "inet"},
    {value: "integer", label: "integer"},
    {value: "interval", label: "interval"},
    {value: "json", label: "json"},
    {value: "jsonb", label: "jsonb"},
    {value: "line", label: "line"},
    {value: "lseg", label: "lseg"},
    {value: "macaddr", label: "macaddr"},
    {value: "macaddr8", label: "macaddr8"},
    {value: "money", label: "money"},
    {value: "numeric", label: "numeric"},
    {value: "path", label: "path"},
    {value: "pg_lsn", label: "pg_lsn"},
    {value: "pg_snapshot", label: "pg_snapshot"},
    {value: "point", label: "point"},
    {value: "polygon", label: "polygon"},
    {value: "real", label: "real"},
    {value: "smallint", label: "smallint"},
    {value: "smallserial", label: "smallserial"},
    {value: "serial", label: "serial"},
    {value: "text", label: "text"},
    {value: "time", label: "time"},
    {value: "time with time zone", label: "time with time zone"},
    {value: "timestamp", label: "timestamp"},
    {value: "timestamp with time zone", label: "timestamp with time zone"},
    {value: "tsquery", label: "tsquery"},
    {value: "tsvector", label: "tsvector"},
    {value: "txid_snapshot", label: "txid_snapshot"},
    {value: "uuid", label: "uuid"},
    {value: "xml", label: "xml"},
]