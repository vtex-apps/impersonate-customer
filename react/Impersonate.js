import React, { Component, Fragment } from 'react'
import { Input, Button, Badge } from 'vtex.styleguide'

import { injectIntl, intlShape } from 'react-intl'

import { request, translate } from './utils'
import './global.css'

/** Canonical Impersonate component */
class Impersonate extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
  }

  state = {
    canImpersonate: false,
    email: '',
    loading: false,
    firstName: '',
    lastName: '',
    logged: false,
  }

  componentDidMount = () => {
    request('/api/sessions?items=*')
      .then(res => {
        this.processSession(res, true)
      })
      .catch(err => console.log(err))
  }

  processSession = (session, shouldInitilize) => {
    const {
      namespaces: {
        impersonate: {
          canImpersonate: { value },
        },
        profile: { isAuthenticated, email, firstName, lastName },
      },
    } = session

    const canImp = value === 'true'

    console.log('processSession', session)
    if (isAuthenticated.value === 'False') {
      this.setState({
        email: '',
        firstName: '',
        lastName: '',
        logged: false,
        canImpersonate: canImp,
      })
    } else {
      this.setState({
        canImpersonate: canImp,
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        logged: true,
      })
    }

    value && shouldInitilize && request('/api/sessions', { method: 'POST' })
  }

  handleInputChange = event => {
    this.setState({ email: event.target.value })
  }

  handleSetSesssion = email => {
    const params = {
      'vtex-impersonated-customer-email': {
        value: email,
      },
    }

    console.log('setSession', email)

    this.setState({ loading: true })

    request('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({
        public: params,
      }),
    })
      .then(() => {
        request('/api/sessions?items=*').then(session =>
          this.processSession(session)
        )
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  render() {
    const { intl } = this.props
    const {
      canImpersonate,
      email,
      loading,
      lastName,
      firstName,
      logged,
    } = this.state

    return canImpersonate ? (
      <div className="vtex-impersonate gray">
        {logged ? (
          <Fragment>
            <span className="vtex-impersonate__message mr3">
              <span className="mr3">
                {translate('impersonated.message', intl)}:
              </span>
              <Badge bgColor="#E3E4E6" color="#979899">
                {firstName ? `${firstName} ${lastName}` : email}
              </Badge>
            </span>
            <Button
              size="small"
              onClick={() => this.handleSetSesssion('')}
              isLoading={loading}
            >
              {translate('impersonout.button', intl)}
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <span className="vtex-impersonate__email-input w-50 w-25-l mr3">
              <Input
                value={email}
                onChange={this.handleInputChange}
                placeholder={'Ex: example@mail.com'}
              />
            </span>
            <Button
              size="small"
              onClick={() => this.handleSetSesssion(email)}
              isLoading={loading}
            >
              {translate('impersonate.button', intl)}
            </Button>
          </Fragment>
        )}
      </div>
    ) : (
      <span />
    )
  }
}

export default injectIntl(Impersonate)
