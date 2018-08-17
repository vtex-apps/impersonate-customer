import React, { Component } from 'react'
import { Link } from 'render'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'
import { intlShape } from 'react-intl'

import { translate } from '../utils/translate'
import { truncateString } from '../utils/format-string'
import Popover from './Popover'
import TelemarketingIcon from '../icons/TelemarketingIcon'
import CustomerIcon from '../icons/CustomerIcon'

/** Component that shows the client info calls the setSession function  to logout. */
export default class LogoutCustomerSession extends Component {
  static propTypes = {
    /** Intl info */
    intl: intlShape,
    /** Signed in client name */
    clientName: PropTypes.string.isRequired,
    /** Signed in client document */
    clientDocument: PropTypes.string.isRequired,
    /** Signed in client phone */
    clientPhone: PropTypes.string.isRequired,
    /** Signed in client email */
    clientEmail: PropTypes.string.isRequired,
    /** Current signedin attendant email */
    attendantEmail: PropTypes.string.isRequired,
    /** Calls the setSession on the parent component */
    onSetSesssion: PropTypes.func.isRequired,
    /** Loading Status */
    loading: PropTypes.bool.isRequired,
  }

  handleHeaderRendering = () => {
    const { intl, clientEmail } = this.props

    return (
      <div className="flex align-center">
        <CustomerIcon />
        <div className="pa2">
          {clientEmail ? `${truncateString(clientEmail, 25)}` : null}
        </div>
      </div>
    )
  }

  render() {
    const {
      attendantEmail,
      clientName,
      clientEmail,
      clientDocument,
      clientPhone,
      onSetSesssion,
      loading,
      intl,
    } = this.props

    return (
      <div className="vtex-telemarketing__logout">
        <Popover renderHeader={this.handleHeaderRendering}>
          <div className="bg-red w-100 pa4">
            <div className="vtex-telemarketing__popover-header-icon">
              <TelemarketingIcon size={50} />
            </div>
            <div className="vtex-telemarketing__popover-header-email white-50">
              {attendantEmail}
            </div>
          </div>
          <div className="bg-white w-100 pa4">
            <div className="vtex-telemarketing__logout-form gray">
              <div className="w-100 pa3 bw1 bb b--silver flex flex-wrap">
                <div className="w-50">
                  <CustomerIcon size={35} color={'#828282'} />
                </div>
                <div className="w-50">{clientName}</div>

                <div className="w-50 tl">Email</div>
                <div className="w-50">
                  <div className="pa3">{clientEmail}</div>
                </div>

                <div className="w-50 tl">
                  {translate('telemarketing-logout.document-label', intl)}
                </div>
                <div className="w-50">
                  <div className="db pa3">{clientDocument}</div>
                </div>

                <div className="w-50 tl">
                  {translate('telemarketing-logout.phone-label', intl)}
                </div>
                <div className="w-50">
                  <div className="db pa3">{clientPhone}</div>
                </div>
              </div>
              <div className="flex justify-around mt3">
                <Link to="/orders">
                  <Button size="small">
                    {translate('telemarketing-logout.button-orders', intl)}
                  </Button>
                </Link>
                <Button
                  size="small"
                  onClick={() => onSetSesssion('')}
                  isLoading={loading}
                >
                  {translate('telemarketing-logout.button', intl)}
                </Button>
              </div>
            </div>
          </div>
        </Popover>
      </div>
    )
  }
}