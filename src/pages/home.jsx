import React from 'react'
import SiteOverviewStatistics from '@/components/widgetsStatistics/SiteOverviewStatistics'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import DashboardCharts from '@/components/widgetsCharts/DashboardCharts'
import RecenetLoadTable from '@/components/widgetsTables/RecentLoadTable'
import RecenetUnloadTable from '@/components/widgetsTables/RecentUnloadTable'

const Home = () => {
    return (
        <>
            <PageHeader />
            <div className='main-content'>
                <div className='row'>
                    <SiteOverviewStatistics />
                </div>
                <DashboardCharts />
                <div className="row">
                    <RecenetLoadTable title={"Recent Load"} />
                    <RecenetUnloadTable title={"Recent Unload"} />
                </div>
            </div>
            {/* <Footer /> */}
        </>
    )
}

export default Home