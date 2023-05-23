import { NextPage } from 'next'
import { withTranslation } from 'react-i18next'

const withI18n = (Page: NextPage<any>) => {
    const PageWithTranslation = withTranslation()(Page)
    return (props) => <PageWithTranslation {...props} />
}

export default withI18n
