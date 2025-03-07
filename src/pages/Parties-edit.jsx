import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PartiesEditHeader from '@/components/partiesEdit/PartiesEditHeader'
import PartiesEditForm from '@/components/partiesEdit/PartiesEditForm'
import PageHeaderDate from '@/components/shared/pageHeader/PageHeaderDate'

const PartiesEditPage = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className='main-content'>
                <div className='card'>
                    <PartiesEditHeader />
                    <PartiesEditForm />
                </div>
            </div>
        </>
    )
}   

export default PartiesEditPage