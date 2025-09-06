export const myLegoData = [
    {
        id: 'blockA',
        size: 'large', // custom prop to help with layout
        content: [
            { label: 'Item 1' },
            { label: 'Item 2' },
            { label: 'Item 3' },
            { label: 'Item 4' },
            { label: 'Item 5' },
            { label: 'Item 6' },
        ],
        connections: ['blockB'],
    },
    {
        id: 'blockB',
        size: 'small',
        content: [
            { label: 'Service A' },
            { label: 'Service B' },
        ],
        connections: ['blockC'],
    },
    {
        id: 'blockC',
        size: 'small',
        content: [
            { label: 'Data X' },
            { label: 'Data Y' },
            { label: 'Data Z' },
        ],
        connections: [],
    },
];