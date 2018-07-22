import React, { Component } from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';
import { convertEthHelper } from '../../lib/helpers';
import { feathersClient } from '../../lib/feathersClient';

import User from '../../models/User';

class AllTransactions extends Component {
  constructor() {
    super();

    this.state = {
      transactions: { data: [] },
    };
  }

  componentWillMount() {
    this.loadTransactions();
  }

  async loadTransactions() {
    const currentUserAddress = this.props.currentUser.address;
    const transactions = await feathersClient.service('transactions').find({
      query: {
        address: currentUserAddress,
      },
    });
    this.setState({ transactions });
  }

  render() {
    return (
      <div id="transactions-view">
        <div>
          <div className="table-container">
            {this.state.transactions.data.length > 0 && (
              <table className="table table-responsive table-striped table-hover">
                <thead>
                  <tr>
                    <th className=".td-transaction-name">Reciever</th>
                    <th className="td-transaction-amount-eth">Amount</th>
                    <th className="td-transaction-amount-dollars">Value</th>
                    <th className="td-user-action">User Action</th>
                    <th className="td-user-role">User Role</th>
                    <th className="td-transaction-creation-date">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.transactions.data.map(t => (
                    <tr>
                      <td className="td-transaction-name">
                        [{t.projectType}]
                        <em>{t.title}</em>
                      </td>
                      <td className="td-transaction-amount-eth">
                        {convertEthHelper(t.amount)} ETH
                      </td>
                      <td className="td-transaction-amount-dollars">{t.amount}</td>
                      {/* <td className="td-tx-address">{t.txHash}</td> */}
                      <td className="td-user-action">{t.userAction}</td>
                      <td className="td-user-role">{t.userRole}</td>
                      <td className="td-transaction-creation-date">
                        {moment(t.createdAt).format('MM/DD/YYYY')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {this.state.transactions.data.length === 0 && (
              <div>
                <center>
                  <h3>You didn&apos;t make any transactions yet!</h3>
                  <img
                    className="empty-state-img"
                    src={`${process.env.PUBLIC_URL}/img/logo.svg`}
                    width="200px"
                    height="200px"
                    alt="no-donations-icon"
                  />
                </center>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

AllTransactions.propTypes = {
  currentUser: PropTypes.instanceOf(User),
};

AllTransactions.defaultProps = {
  currentUser: PropTypes.instanceOf(User),
};
export default AllTransactions;
