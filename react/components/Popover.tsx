import { path } from 'ramda'
import React, { Component, ReactNode } from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'

import telemarketing from '../telemarketing.css'

interface Props {
  /** Function that will display the header */
  renderHeader: () => any,
  arrowClasses: string,
  readonly children: ReactNode
}

/** Component that shows a content when it´s header is clicked */
export class Popover extends Component<Props> {
  public boxRef: any = React.createRef()

  public state = {
    isBoxOpen: false,
  }

  private iconRef: any

  public componentWillUnmount() {
    this.removeListeners()
  }

  public render() {
    const { renderHeader, children } = this.props
    const mobile = path(['__RUNTIME__', 'hints', 'mobile'], global)

    const boxPositionStyle = mobile ? {} : {
      right: this.iconRef && this.iconRef.offsetWidth - 43,
    }

    return (
      <div className={`${telemarketing.popoverContainer} relative flex h-100 items-center pr4`}>
        <div
          className="pointer w-100"
          onClick={this.handleHeaderClick}
          ref={e => {
            this.iconRef = e
          }}
        >
          {renderHeader()}
        </div>
        <div
          className={`${telemarketing.popoverBox} absolute top-2 z-max bb b--muted-3 ${
            this.state.isBoxOpen ? 'flex' : 'dn'
            }`}
          style={boxPositionStyle}
          ref={this.boxRef}
        >
          <div className={`${telemarketing.popoverContentContainer} mt3-ns mt2-s bg-base shadow-3-ns`}>
            {children}
          </div>
          <div className={`${telemarketing.popoverArrowUp} absolute top-0 rotate-135 dib-ns dn-s ${this.props.arrowClasses}`} />
        </div>
      </div>
    )
  }

  private handleHeaderClick = () => {
    document.addEventListener('mouseup', this.handleDocumentMouseUp)

    this.setState({ isBoxOpen: !this.state.isBoxOpen })
  }

  private handleDocumentMouseUp = (e: any) => {
    const { isBoxOpen } = this.state
    const target = e.target

    if (
      this.boxRef.current &&
      (!this.boxRef.current.contains(target) ||
        target.hasAttribute('closeonclick'))
    ) {

      if (isBoxOpen) { this.setState({ isBoxOpen: false }) }
      this.removeListeners()

      target.dispatchEvent(new Event('closeonclick'))
    }
  }

  private removeListeners = () => {
    document.removeEventListener('mouseup', this.handleDocumentMouseUp)
  }
  
}

export default withRuntimeContext(Popover)
