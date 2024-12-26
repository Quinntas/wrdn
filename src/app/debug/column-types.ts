interface DefaultValue {
    value: string
    description: string
}

interface ColumnType {
    defaultValues: Record<string, DefaultValue>
}

export const COLUMN_TYPES: Record<string, ColumnType> = {
    uuid: {
        defaultValues: {
            'gen_random_uuid()': {
                value: "gen_random_uuid()",
                description: "Generates a random UUID"
            }
        }
    },
    date: {
        defaultValues: {
            "now()": {
                value: "now()",
                description: "Returns the current date and time"
            },
            "(now() at time zone 'utc')": {
                value: "(now() at time zone 'utc')",
                description: "Returns the current date and time based on the specified timezone"
            }
        }
    },
    timestamp: {
        defaultValues: {
            "now()": {
                value: "now()",
                description: "Returns the current date and time"
            },
            "(now() at time zone 'utc')": {
                value: "(now() at time zone 'utc')",
                description: "Returns the current date and time based on the specified timezone"
            }
        }
    },
    boolean: {
        defaultValues: {
            true: {
                value: "true",
                description: "Boolean true value"
            },
            false: {
                value: "false",
                description: "Boolean false value"
            }
        }
    },
    integer: {
        defaultValues: {
            0: {
                value: "0",
                description: "Zero"
            },
            1: {
                value: "1",
                description: "One"
            }
        }
    },
    "double precision": {
        defaultValues: {
            0: {
                value: "0.0",
                description: "Zero"
            },
            1: {
                value: "1.0",
                description: "One"
            }
        }
    },
    serial: {
        defaultValues: {
            NULL: {
                value: "NULL",
                description: "NULL"
            }
        },
    },
    text: {
        defaultValues: {
            NULL: {
                value: "NULL",
                description: "NULL"
            }
        }
    },
    jsonb: {
        defaultValues: {
            NULL: {
                value: "NULL",
                description: "NULL"
            },
        }
    },
    bigint: {
        defaultValues: {
            0: {
                value: "0",
                description: "Zero"
            },
            1: {
                value: "1",
                description: "One"
            }
        }
    },
    bigserial: {
        defaultValues: {
            0: {
                value: "0",
                description: "Zero"
            },
            1: {
                value: "1",
                description: "One"
            }
        }
    },
}

export function getDefaultValue(type: string): string {
    const typeData = COLUMN_TYPES[type as keyof typeof COLUMN_TYPES]
    if (typeData) {
        const firstDefault = Object.values(typeData.defaultValues)[0]
        return firstDefault ? firstDefault.value : 'NULL'
    }
    return 'NULL'
}