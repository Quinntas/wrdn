"use client"

import React, {useState} from "react"
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Separator} from "@/components/ui/separator"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import {CSS} from '@dnd-kit/utilities'
import {Check, ChevronsUpDown, ExternalLink, GripVertical, Plus, Settings, X} from 'lucide-react'
import {Checkbox} from "@/components/ui/checkbox";
import {DefaultValueSuggestions} from "./default-value-suggestions"
import {getDefaultValue} from "./column-types"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {PG_TYPES} from "@/app/debug/pg-types";
import {cn} from "@/lib/utils";

type Column = {
    id: string
    name: string
    type: string
    expression: string
    isPrimary: boolean
}

function SortableColumn({
                            column,
                            index,
                            updateColumn,
                            removeColumn
                        }: {
    column: Column
    index: number
    updateColumn: (index: number, field: keyof Column, value: string | boolean) => void
    removeColumn: (index: number) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: column.id})

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const [typeOpen, setTypeOpen] = React.useState(false)

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="group flex items-center space-x-2 rounded-md  bg-card p-2"
        >
            <div {...listeners}>
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab"/>
            </div>
            <div className="flex items-center space-x-2">
                <Input
                    value={column.name}
                    onChange={(e) => updateColumn(index, "name", e.target.value)}
                    placeholder="Column name"
                    className="w-[150px]"
                />
                <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-[120px] justify-between"
                        >
                            {column.type || "Select type..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search type..." className="h-9"/>
                            <CommandList>
                                <CommandEmpty>No type found.</CommandEmpty>
                                <CommandGroup>
                                    {PG_TYPES.map((type) => (
                                        <CommandItem
                                            key={type.value}
                                            value={type.value}
                                            onSelect={(currentValue) => {
                                                updateColumn(index, "type", currentValue)
                                                setTypeOpen(false)
                                            }}
                                        >
                                            {type.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    column.type === type.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <div className="flex items-center relative">
                    <Input
                        value={column.expression}
                        onChange={(e) => updateColumn(index, "expression", e.target.value)}
                        placeholder="NULL"
                        className="w-[150px] pr-[35px]"
                    />
                    <DefaultValueSuggestions
                        type={column.type}
                        onSelect={(value) => updateColumn(index, "expression", value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        checked={column.isPrimary}
                        onCheckedChange={(checked) => updateColumn(index, "isPrimary", checked)}
                    />

                    <span className={"truncate"}>Is primary</span>
                </div>
            </div>
            <div className="ml-auto flex items-center justify-end w-full space-x-2">
                <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4"/>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColumn(index)}
                    disabled={index < 2}
                >
                    <X className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    )
}

export default function TableCreator() {
    const [columns, setColumns] = useState<Column[]>([
        {id: '1', name: 'id', type: 'serial', expression: 'NULL', isPrimary: true},
        {id: '2', name: 'created_at', type: 'timestamp', expression: 'now()', isPrimary: false},
    ])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event

        const id = over?.id

        if (id && active.id !== id) {
            setColumns((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const addColumn = () => {
        setColumns([...columns, {
            id: String(columns.length + 1),
            name: '',
            type: 'text',
            expression: 'NULL',
            isPrimary: false
        } satisfies Column])
    }

    const updateColumn = (index: number, field: keyof Column, value: string | boolean) => {
        const newColumns = [...columns];
        newColumns[index] = {...newColumns[index], [field]: value};
        if (field === 'type') {
            newColumns[index].expression = getDefaultValue(value as string);
        }
        setColumns(newColumns);
    };

    const removeColumn = (index: number) => {
        setColumns(columns.filter((_, i) => i !== index))
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Create Table</Button>
            </SheetTrigger>
            <SheetContent className="min-w-[700px] max-w-[700px] gap-0 flex flex-col p-0 overflow-y-auto">
                <SheetHeader className="p-6 sticky top-0 z-10 bg-background">
                    <SheetTitle className={"font-medium text-lg"}>
                        Create a new table
                    </SheetTitle>
                </SheetHeader>

                <Separator/>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Name</span>
                            <Input type="text" className="w-[400px]" required/>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Description</span>
                            <Input
                                type="text"
                                className="w-[400px]"
                                placeholder="Optional"
                            />
                        </div>
                    </div>
                </div>

                <Separator/>

                <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Columns</h3>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                <ExternalLink className="mr-2 h-4 w-4"/>
                                About data types
                            </Button>
                        </div>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={columns.map(col => col.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {columns.map((column, index) => (
                                    <SortableColumn
                                        key={column.id}
                                        column={column}
                                        index={index}
                                        updateColumn={updateColumn}
                                        removeColumn={removeColumn}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <div className={"flex rounded-md items-center justify-center p-2 border border-dashed "}>
                        <Button
                            variant="outline"
                            onClick={addColumn}
                            size={"sm"}
                        >
                            <Plus className=" h-4 w-4"/>
                            Add column
                        </Button>
                    </div>
                </div>

                <Separator/>

                <div className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Foreign keys</h3>
                    </div>

                    <div className={"flex rounded-md items-center justify-center p-2 border border-dashed "}>
                        <Button
                            variant="outline"
                            size={"sm"}
                        >
                            <Plus className="h-4 w-4"/>
                            Add foreign key
                        </Button>
                    </div>
                </div>

            </SheetContent>
        </Sheet>
    )
}

