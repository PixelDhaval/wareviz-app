export const menuList = [
    {
        id: 0,
        name:"Master",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name:"Party Management",
                path: "/parties/list",
                subdropdownMenu: false
            },
            {
                id: 2,
                name:"Cargo Management",
                path: "/cargo/list",
                subdropdownMenu: false
            },
            {
                id: 3,
                name:"Godown Management",
                path: "/godown/list",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 1,
        name:"Unload Vehicle",    
        path: "/unload/create",
        icon: "truck-loading",
        dropdownMenu: [
           
        ]
    },
    {
        id: 2,
        name:"Load Vehicle",    
        path: "/load/create",
        icon: "truck-unloading",
        dropdownMenu: [
           
        ]
    },
    {
        id: 3,
        name: "Party Shifting",
        path: "/shifting/create",
        icon: "feather-clock",
        dropdownMenu: []
    },
    {
        id: 4,
        name: "Movement Report",
        path: "/report",
        icon: "movement report",
        dropdownMenu: []
    },
    {
        id: 10,
        name: "authentication",
        path: "#",
        icon: 'feather-power',
        dropdownMenu: [
            {
                id: 1,
                name: "login",
                path: "#",
                subdropdownMenu: [
                    {
                        id: 2,
                        name: "Minimal",
                        path: "/authentication/login/minimal",
                    },
                ]
            },
        ]
    }
]
