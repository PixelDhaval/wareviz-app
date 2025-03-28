import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root";
import Home from "../pages/home";
import LayoutAuth from "../layout/layoutAuth";
import LoginMinimal from "../pages/login-minimal";
import PartiesListPage from "../pages/Parties-list";
import PartiesCreatePage from "../pages/Parties-create";
import PartiesEditPage from "../pages/Parties-edit";
import CargoListPage from "../pages/cargo-list";
import CargoCreatePage from "../pages/cargo-create";
import CargoEditPage from "../pages/cargo-edit";
import GodownListPage from "../pages/godown-list";
import GodownCreatePage from "../pages/godown-create";
import GodownEditPage from "../pages/godown-edit";
import UnloadThroughVehicleCreate from "../pages/unload-through-vehicle-create";
import UnloadThroughVehicleTabs from "../pages/unloadThroughVehicleTabs";
import PartyShiftingList from "../pages/party-shifting-list";
import PartyShiftingCreate from "../pages/party-shifting-create";
import PartyShiftingView from "../pages/party-shifting-view";
import LoadVehicleCreate from "../pages/load-vehicle-create";
import LoadVehicleView from "../pages/load-vehicle-view";
import Report from "../pages/report";
import OpningStockList from "../pages/opning-stock-list";
import OpningStockEdit from "../pages/opning-stock-edit";
import PartiesView from "../pages/parties-view";
import GodownView from "../pages/godown-view";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/parties/list",
                element: <PartiesListPage />
            },
            {
                path: "/parties/create",
                element: <PartiesCreatePage />
            },
            {
                path: "/parties/view",
                element: <PartiesView />
            },
            {
                path: "/parties/edit",
                element: <PartiesEditPage />
            },
            {
                path: "/cargo/list",
                element: <CargoListPage />
            },
            {
                path: "/cargo/create",
                element: <CargoCreatePage />
            },
            {
                path: "/cargo/edit",
                element: <CargoEditPage />
            },
            {
                path: "/godown/list",
                element: <GodownListPage />
            },
            {
                path: "/godown/create",
                element: <GodownCreatePage />
            },
            {
                path: "/godown/edit",
                element: <GodownEditPage />
            },
            {
                path: "/godown/view",
                element: <GodownView />
            },
            {
                path: "/unload/create",
                element: <UnloadThroughVehicleCreate />
            },
            {
                path: "/unload/view",
                element: <UnloadThroughVehicleTabs />
            },
            {
                path: "/load/create",
                element: <LoadVehicleCreate />
            },
            {
                path: "/load/view",
                element: <LoadVehicleView/>
            },
            {
                path: "/shifting/list",
                element: <PartyShiftingList />
            },
            {
                path: "/shifting/create",  
                element: <PartyShiftingCreate />
            },
            {
                path: "/shifting/view",
                element: <PartyShiftingView />
            },
            {
                path:"/report",
                element: <Report />
            },
            {
                path: "/openingStock/list",
                element: <OpningStockList />
            },
            {
                path: "/openingStock/view",
                element: <OpningStockEdit />
            },
        ]
    },
    {
        path: "/",
        element: <LayoutAuth />,
        children: [
            {
                path: "/login",
                element: <LoginMinimal />
            }
        ]
    }
])