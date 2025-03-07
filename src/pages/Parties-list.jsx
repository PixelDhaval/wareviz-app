import React from 'react'
import PartiesList from '@/components/parties/PartiesList'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PartiesHeader from '@/components/parties/ParitesHeader'
import PageHeaderDate from '@/components/shared/pageHeader/PageHeaderDate'

const PartiesListPage = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className='main-content'>
                <div className="card">
                    <PartiesHeader />
                    <PartiesList />
                </div>
            </div>
        </>
    )
}

export default PartiesListPage