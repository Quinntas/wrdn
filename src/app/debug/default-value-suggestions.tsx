import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Menu} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {COLUMN_TYPES} from './column-types'

interface DefaultValueSuggestionsProps {
    type: string
    onSelect: (value: string) => void
}

export function DefaultValueSuggestions({type, onSelect}: DefaultValueSuggestionsProps) {
    const typeData = COLUMN_TYPES[type as keyof typeof COLUMN_TYPES]
    const suggestions = typeData ? Object.values(typeData.defaultValues) : []

    if (suggestions.length === 0) {
        return null
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 absolute right-0"
                >
                    <Menu className="h-4 w-4"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3" align="start">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Suggested expressions</h4>
                    <div className="divide-y">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className="w-full p-2 text-left hover:bg-accent rounded-sm"
                                onClick={() => onSelect(suggestion.value)}
                            >
                                <div className="font-mono text-sm">{suggestion.value}</div>
                                <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}