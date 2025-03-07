export const menuList = [
    {
        id: 1,
        name: "Party Management",
        path: "#",
        icon: 'feather-user',
        dropdownMenu: [
            {
                id: 1,
                name: "Parties",
                path: "/parties/list",
                subdropdownMenu: false
            },
        ]
    },
    {
        id: 2,
        name: "Cargo Management",
        path: "#",
        icon: 'feather-truck',
        dropdownMenu: [
            {
                id: 1,
                name: "Cargo",
                path: "/cargo/list",
                subdropdownMenu: false
            },
        ]
    },
    {
        id: 3,
        name: "Godown Management",
        path: "#",
        icon: 'feather-inbox',
        dropdownMenu: [
            {
                id: 1,
                name: "Godown",
                path: "/godown/list",
                subdropdownMenu: false
            },
        ]
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
