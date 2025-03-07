import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import PartiesCreateHeader from '@/components/partiesCreate/PartiesCreateHeader'
import PartiesCreate from '@/components/partiesCreate/PartiesCreate'
import PageHeaderDate from '@/components/shared/pageHeader/PageHeaderDate'

const PartiesCreatePage = () => {
    return (
        <>
            <PageHeader>
                <PageHeaderDate />
            </PageHeader>
            <div className='main-content'>
                <div className='card'>
                    <PartiesCreateHeader />
                    <PartiesCreate />
                </div>
            </div>
        </>
    )
}

export default PartiesCreatePage