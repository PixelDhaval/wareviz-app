import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root";
import Home from "../pages/home";
import LayoutAuth from "../layout/layoutAuth";
import LoginMinimal from "../pages/login-minimal";
import RegisterMinimal from "../pages/register-minimal";
import ResetMinimal from "../pages/reset-minimal";
import ErrorMinimal from "../pages/error-minimal";
import OtpMinimal from "../pages/otp-minimal";
import MaintenanceMinimal from "../pages/maintenance-minimal";
import PartiesListPage from "../pages/Parties-list";
import PartiesCreatePage from "../pages/Parties-create";
import PartiesEditPage from "../pages/Parties-edit";
import CargoListPage from "../pages/cargo-list";
import CargoCreatePage from "../pages/cargo-create";
import CargoEditPage from "../pages/cargo-edit";
import GodownListPage from "../pages/godown-list";
import GodownCreatePage from "../pages/godown-create";
import GodownEditPage from "../pages/godown-edit";
import UnloadVehicleList from "../pages/unload-vehicle-list";
import UnloadThroughVehicleCreate from "../pages/unload-through-vehicle-create";
import UnloadThroughVehicleTabs from "../pages/unloadThroughVehicleTabs";
import PartyShiftingList from "../pages/party-shifting-list";
import PartyShiftingCreate from "../pages/party-shifting-create";
import PartyShiftingView from "../pages/party-shifting-view";
import LoadVehicleCreate from "../pages/load-vehicle-create";
import LoadVehicleView from "../pages/load-vehicle-view";
import VehicleMovementReport from "../pages/vehicleMovementReport";
import ShiftingReport from "../pages/shifting-report";

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
                path: "/movement-report",
                element: <VehicleMovementReport />
            },
            {
                path: "/shifting-report",
                element: <ShiftingReport />
            }
        ]
    },
    {
        path: "/",
        element: <LayoutAuth />,
        children: [
            {
                path: "/authentication/login/minimal",
                element: <LoginMinimal />
            },
            {
                path: "/authentication/register/minimal",
                element: <RegisterMinimal />
            },
            {
                path: "/authentication/reset/minimal",
                element: <ResetMinimal />
            },
            {
                path: "/authentication/404/minimal",
                element: <ErrorMinimal />
            },
            {
                path: "/authentication/verify/minimal",
                element: <OtpMinimal />
            },
            {
                path: "/authentication/maintenance/minimal",
                element: <MaintenanceMinimal />
            },
        ]
    }
])